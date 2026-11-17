// tools/i18n_extract.mjs — migración de los textos de la interfaz fija.
//
// Uso:
//   node tools/i18n_extract.mjs            → audita (no escribe nada)
//   node tools/i18n_extract.mjs --write    → marca index.html con data-i18n y
//                                            escribe lang/es.js (base)
//
// Se puede volver a correr: los nodos que ya tienen data-i18n se saltan y las
// claves que ya existen en lang/es.js se conservan, así agregar textos nuevos
// al marcado no obliga a rehacer las traducciones.
//
// Además del texto del marcado, la base incluye dos claves manuales que no son
// atributos ni nodos: doc.title (el <title>) y lang.title (la etiqueta del
// selector de idioma que inyecta js/i18n.js).
//
// Qué hace:
//   1. Parsea index.html con parse5 pidiendo posiciones de origen.
//   2. Recorre los nodos de texto visibles y los atributos traducibles
//      (placeholder, title, aria-label, alt).
//   3. Agrupa cada texto por su región (el id del contenedor más cercano) y le
//      arma una clave legible: `<region>.<textoEnCamelCase>`.
//   4. Escribe los cambios por offset inverso: al resto del archivo no se le
//      toca ni un byte, así el diff se lee.
//
// Cómo marca cada texto (dos formas, según el caso):
//   unico   el texto es el único contenido del elemento → data-i18n en el
//           elemento mismo; el motor aplica textContent, sin nodos extra.
//   mixto   el elemento también tiene iconos u otros hijos → se envuelve el
//           texto en <span data-i18n="…">, así el motor reemplaza solo ese
//           span y no toca los iconos.
//
// Las regiones dinamicas (tablas, medidores, consolas, reloj) se saltan: el
// texto lo escribe JavaScript en ejecucion y pisarlo con una traduccion fija
// romperia los datos vivos. Esos textos se traducen en la fase 3, con t().
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parse } from 'parse5';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const HTML = path.join(ROOT, 'index.html');
const LANG_DIR = path.join(ROOT, 'lang');
const BASELINE = path.join(LANG_DIR, 'es.js');
const REPORT = path.join(LANG_DIR, 'ui-report.json');

const WRITE = process.argv.includes('--write');

/** Atributos cuyo valor es texto visible para el usuario. */
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

/**
 * Contenedores que el simulador rellena por JavaScript (tablas, listas,
 * consolas, medidores, reloj). Marcar su texto seria un error: al cambiar de
 * idioma el motor escribiria texto fijo encima de los datos vivos.
 */
const DYNAMIC_PREFIXES = [
    'metric-', 'hwmon-', 'spark-', 'prop-', 'pf-', 'vmem-', 'exam-', 'tray-',
    'budget-', 'calc-display', 'defrag-', 'page-fault', 'active-scenario',
    'system-health', 'clock', 'mission-', 'symptoms-', 'proc-table',
    'msconfig-list', 'correction-steps', 'compare-table', 'ram-frames',
    'swap-frames', 'audit-log', 'cmd-output', 'cleaner-log', 'browser-frame',
    'taskbar-app-tabs', 'fan-blades', 'fan-svg', 'health-bar', 'exam-results',
    'help-body'
];

/** Texto con letras de verdad (deja afuera "X", "_", "0%", "·"). */
const hasLetters = s => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(s);

/** Tags que no aportan texto de interfaz. */
const SKIP = new Set(['script', 'style', 'svg', 'path', 'title', 'meta', 'link', 'br', 'hr', 'img']);

/** "Admin Tareas" → "adminTareas"; "Uso RAM / Swap:" → "usoRamSwap". */
function camel(text) {
    const words = text
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Za-z0-9]+/g, ' ')
        .trim().split(/\s+/)
        .filter(Boolean);
    if (!words.length) return 'texto';
    const base = words.slice(0, 6).join('');
    return base.charAt(0).toLowerCase() + base.slice(1);
}

/** "win-taskmgr" → "taskmgr"; "mission-panel" → "mission". */
function regionOf(id) {
    return id
        .replace(/^win-/, '')
        .replace(/^modal-/, '')
        .replace(/^btn-/, '')
        .replace(/-panel$/, '')
        .replace(/-container$/, '')
        .replace(/-body$/, '')
        .replace(/-list$/, '');
}

const attrOf = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const idOf = node => attrOf(node, 'id');
const isDynamic = id => !!id && DYNAMIC_PREFIXES.some(p => id.startsWith(p));

// --- Recorrido del DOM ----------------------------------------------------
/** Entradas de texto encontradas: {kind, text, key, node, region}. */
const entries = [];

/** Reserva de claves: evita que dos textos distintos caigan en la misma. */
const used = new Map();
function reserveKey(region, text) {
    const base = region + '.' + camel(text);
    let key = base;
    let n = 2;
    while (used.has(key) && used.get(key) !== text) key = base + '-' + n++;
    used.set(key, text);
    return key;
}

/** Primer ancestro con id: define la región de la clave. */
function regionOfChain(chain) {
    for (let i = chain.length - 1; i >= 0; i--) {
        const id = idOf(chain[i]);
        if (id) return { id, region: regionOf(id) };
    }
    return { id: null, region: 'ui' };
}

const isElement = n => typeof n.tagName === 'string';
const kidsOf = n => n.childNodes || [];

/** Recorre el árbol acumulando la cadena de ancestros. */
function walk(node, chain) {
    const element = isElement(node);

    if (element) {
        // Región dinámica: nada de acá se marca.
        const id = idOf(node);
        if (isDynamic(id)) return;
        if (attrOf(node, 'data-i18n-skip') !== undefined) return;
        if (SKIP.has(node.tagName)) return;

        // Atributos con texto visible (se saltan los que ya están marcados).
        for (const attr of ATTRS) {
            if (attrOf(node, 'data-i18n-' + attr) !== undefined) continue;
            const value = attrOf(node, attr);
            if (!value || !hasLetters(value)) continue;
            const { region } = regionOfChain(chain);
            entries.push({ kind: 'attr', attr, text: value.trim(), key: reserveKey(region, value.trim()), node, region });
        }

        // El texto de un elemento ya marcado entero ya está traducido: no se
        // vuelve a envolver ni se duplica la clave.
        if (attrOf(node, 'data-i18n') !== undefined) return;

        chain = [...chain, node];
    }

    if (node.nodeName === '#text') {
        const text = node.value;
        if (!text || !hasLetters(text)) return;
        const parent = chain[chain.length - 1];
        if (!parent) return;
        // <textarea> y <option> no admiten un span adentro.
        const noWrap = parent.tagName === 'textarea' || parent.tagName === 'option';
        const siblings = kidsOf(parent).filter(c =>
            c.nodeName !== '#comment' && !(c.nodeName === '#text' && !c.value.trim()));
        const onlyChild = siblings.length === 1;
        if (!onlyChild && noWrap) return;
        const { region } = regionOfChain(chain);
        entries.push({
            kind: onlyChild ? 'unique' : 'mixed',
            text: text.trim(),
            key: reserveKey(region, text.trim()),
            node,
            parent,
            region
        });
        return;
    }

    for (const child of kidsOf(node)) walk(child, chain);
}

const source = fs.readFileSync(HTML, 'utf8');

// Claves ya traducidas de la base: se conservan y se usan para no reutilizar
// una clave con otro texto al agregar marcado nuevo.
const existing = {};
if (fs.existsSync(BASELINE)) {
    try {
        const win = {};
        vm.runInNewContext(fs.readFileSync(BASELINE, 'utf8'), { window: win }, { filename: BASELINE });
        Object.assign(existing, (win.SIM_DICTS || {}).es || {});
    } catch (err) {
        console.warn(`Aviso: no se pudo leer lang/es.js (${err.message}); se reescribe desde cero.`);
    }
}
for (const [k, v] of Object.entries(existing)) used.set(k, v);

const doc = parse(source, { sourceCodeLocationInfo: true });
walk(doc, []);

// --- Aplicación de cambios ------------------------------------------------
/**
 * Los cambios se aplican por offset inverso, de atrás hacia adelante, así los
 * offsets que ya se calcularon no se mueven. Al resto del archivo no se le
 * toca ni un byte.
 */
function buildEdits() {
    const edits = [];
    // Inserciones de atributos, agrupadas por elemento: un mismo tag puede
    // necesitar data-i18n y data-i18n-placeholder a la vez.
    const attrInserts = new Map();

    for (const entry of entries) {
        if (entry.kind === 'attr') {
            const target = entry.node;
            const list = attrInserts.get(target) || [];
            list.push(`data-i18n-${entry.attr}="${entry.key}"`);
            attrInserts.set(target, list);
            continue;
        }
        if (entry.kind === 'unique') {
            const list = attrInserts.get(entry.parent) || [];
            list.push(`data-i18n="${entry.key}"`);
            attrInserts.set(entry.parent, list);
            continue;
        }
        // 'mixed': se envuelve solo el texto, sin tocar iconos ni otros hijos.
        const loc = entry.node.sourceCodeLocation;
        edits.push({ at: loc.startOffset, text: `<span data-i18n="${entry.key}">` });
        edits.push({ at: loc.endOffset, text: '</span>' });
    }

    for (const [element, attrs] of attrInserts) {
        const loc = element.sourceCodeLocation;
        if (!loc?.startTag) continue;
        // Punto de inserción: justo antes del '>' (o del '/>' de un tag vacío).
        let at = loc.startTag.endOffset - 1;
        if (loc.startTag.endOffset - 2 >= loc.startTag.startOffset
            && source[loc.startTag.endOffset - 2] === '/') at -= 1;
        edits.push({ at, text: ' ' + attrs.join(' ') });
    }

    return edits;
}

/** Aplica los cambios y devuelve el HTML nuevo. */
function applyEdits(html, edits) {
    const sorted = [...edits].sort((a, b) => b.at - a.at);
    let out = html;
    for (const edit of sorted) out = out.slice(0, edit.at) + edit.text + out.slice(edit.at);
    return out;
}

const uniqueTexts = new Map();
for (const entry of entries) uniqueTexts.set(entry.key, entry.text);

// --- Salida por consola ---------------------------------------------------
const byKind = entries.reduce((acc, e) => {
    acc[e.kind] = (acc[e.kind] || 0) + 1;
    return acc;
}, {});
console.log(`Nodos y atributos marcables: ${entries.length}`);
console.log(`  unicos (data-i18n en el elemento): ${byKind.unique || 0}`);
console.log(`  mixtos (span alrededor del texto): ${byKind.mixed || 0}`);
console.log(`  atributos (placeholder/title/alt): ${byKind.attr || 0}`);
console.log(`Claves distintas: ${uniqueTexts.size}`);

if (!WRITE) {
    console.log('\nModo auditoria: no se escribio nada. Usa --write para aplicar.');
    process.exit(0);
}

// --- Escritura ------------------------------------------------------------
fs.mkdirSync(LANG_DIR, { recursive: true });

const edits = buildEdits();
fs.writeFileSync(HTML, applyEdits(source, edits), 'utf8');
console.log(`\nindex.html actualizado: ${edits.length} inserciones.`);

/** Diccionario base en español, con las claves ordenadas. */
function dictSource(lang, dict) {
    const keys = Object.keys(dict).sort();
    const body = keys.map(k => `    '${k}': ${JSON.stringify(dict[k])},`).join('\n');
    return `// lang/${lang}.js — textos de la interfaz fija, generado por tools/i18n_extract.mjs.
//
// Este archivo es la BASE: las claves y los textos en español salen del propio
// index.html. Los demas idiomas (ar, en, pt, fr) deben tener exactamente las
// mismas claves; tools/test_i18n.mjs falla si falta o sobra alguna.
//
// Las claves son planas ("region.texto") a proposito: asi el diff de una
// traduccion se lee linea por linea y el test de paridad es una comparacion de
// conjuntos, no un recorrido de arboles.
window.SIM_DICTS = window.SIM_DICTS || {};
window.SIM_DICTS.${lang} = {
${body}
};
`;
}

/**
 * Diccionario final de la base: lo que ya estaba en lang/es.js + los textos
 * nuevos del marcado + las claves manuales que no salen de ningún nodo.
 */
function mergeBase() {
    const dict = { ...existing };
    for (const [k, v] of uniqueTexts) dict[k] = v;

    const title = (/<title>([^<]*)<\/title>/.exec(source) || [])[1]?.trim();
    if (title) dict['doc.title'] = title;
    dict['lang.title'] = 'Idioma';
    return dict;
}

const base = mergeBase();
fs.writeFileSync(BASELINE, dictSource('es', base), 'utf8');
console.log(`lang/es.js escrito: ${Object.keys(base).length} claves (${uniqueTexts.size} nuevas).`);

// Inventario completo para revisar a mano los textos de la interfaz.
const report = {
    total: Object.keys(base).length,
    nuevos: entries.length,
    claves: Object.fromEntries(Object.entries(base).sort(([a], [b]) => a.localeCompare(b)))
};
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');
console.log(`lang/ui-report.json escrito (inventario para revisar).`);

