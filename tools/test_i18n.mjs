// tools/test_i18n.mjs — valida los diccionarios del simulador (fija + ejecución).
//
// Uso: node tools/test_i18n.mjs (también corre con `npm run check`)
//
// Comprueba, sin navegador ni red:
//   - que exista lang/<idioma>.js para los 5 idiomas y defina SIM_DICTS.<idioma>;
//   - que todos tengan exactamente las mismas claves que lang/es.js;
//   - que ninguna clave quede vacía ni duplicada en el archivo;
//   - que toda clave usada por index.html exista en la base;
//   - que la base no tenga claves muertas (salvo doc.title y lang.title);
//   - que en/pt/fr tengan texto traducido de verdad (no sean copias del español);
//   - que ar conserve el voseo respecto de la base;
//   - que lang/runtime/<idioma>.js cubra las mismas claves rt.* que la base;
//   - que toda clave rt()/rtf() usada en js/*.js exista y los escenarios y el
//     manual estén completos;
//   - que index.html cargue los diccionarios, runtime-dict.js y js/i18n.js en
//     el orden correcto y que js/main.js repinte al cambiar de idioma.
//   - que index.html cargue los diccionarios y js/i18n.js antes que main.js;
//   - que js/main.js inicialice el motor.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');

const LANGS = ['es', 'ar', 'en', 'pt', 'fr'];
const BASE = 'es';

// Claves que no salen del marcado: el <title> y la etiqueta del selector de
// idioma que js/i18n.js inyecta en el menú Inicio.
const MANUAL_KEYS = new Set(['doc.title', 'lang.title']);

// Atributos que js/i18n.js sabe traducir (deben coincidir con i18n_extract).
const I18N_ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

// Un idioma traducido no debería coincidir con el español en más de la mitad
// de sus textos; si pasa, es casi seguro una copia sin traducir.
const MAX_SAME_RATIO = 0.5;

let ok = 0, fail = 0;
function check(label, condition, detail = '') {
    if (condition) { ok++; console.log(`  ok  - ${label}`); }
    else { fail++; console.log(`  FAIL - ${label}${detail ? ': ' + detail : ''}`); }
}

// --- 1. Carga de diccionarios --------------------------------------------
const dicts = {};
const sources = {};
for (const lang of LANGS) {
    const file = path.join(ROOT, 'lang', `${lang}.js`);
    check(`lang/${lang}.js existe`, fs.existsSync(file));
    if (!fs.existsSync(file)) continue;

    const src = fs.readFileSync(file, 'utf8');
    sources[lang] = src;
    const win = {};
    try {
        vm.runInNewContext(src, { window: win }, { filename: file });
    } catch (err) {
        check(`lang/${lang}.js es JavaScript válido`, false, err.message);
        continue;
    }
    check(`lang/${lang}.js es JavaScript válido`, true);

    const dict = (win.SIM_DICTS || {})[lang];
    dicts[lang] = dict;
    check(`lang/${lang}.js define SIM_DICTS.${lang}`, !!dict && typeof dict === 'object');
}

const esKeys = Object.keys(dicts[BASE] || {});
check('la base tiene claves', esKeys.length > 0, `${esKeys.length} claves`);

// --- 2. Paridad de claves -------------------------------------------------
for (const lang of LANGS) {
    if (lang === BASE || !dicts[lang]) continue;
    const keys = Object.keys(dicts[lang]);
    const missing = esKeys.filter(k => !(k in dicts[lang]));
    const extra = keys.filter(k => !esKeys.includes(k));
    check(`[${lang}] mismas claves que ${BASE}`, !missing.length && !extra.length,
        (missing.length ? `faltan ${missing.length}: ${missing.slice(0, 4).join(', ')} ` : '') +
        (extra.length ? `sobran ${extra.length}: ${extra.slice(0, 4).join(', ')}` : ''));
}

// --- 3. Integridad de cada diccionario ------------------------------------
for (const lang of LANGS) {
    const dict = dicts[lang];
    if (!dict) continue;

    const empty = Object.entries(dict).filter(([, v]) => typeof v !== 'string' || !v.trim());
    check(`[${lang}] sin valores vacíos ni no textuales`, !empty.length,
        empty.slice(0, 4).map(([k]) => k).join(', '));

    // Una clave repetida en el literal pisa a la anterior sin avisar.
    const literals = [...(sources[lang] || '').matchAll(/^\s{4}'([^']+)':/gm)].map(m => m[1]);
    const dupes = literals.filter((k, i) => literals.indexOf(k) !== i);
    check(`[${lang}] sin claves duplicadas en el archivo`, !dupes.length,
        [...new Set(dupes)].slice(0, 4).join(', '));
    check(`[${lang}] literales y claves cargadas coinciden`,
        literals.length === Object.keys(dict).length,
        `${literals.length} literales vs ${Object.keys(dict).length} claves`);
}

// --- 4. Cobertura del marcado --------------------------------------------
const html = read('index.html');
const htmlKeys = new Set(
    [...html.matchAll(/data-i18n(?:-([a-z-]+))?="([^"]+)"/g)].map(m => m[2])
);

const unknown = [...htmlKeys].filter(k => !(k in (dicts[BASE] || {})));
check('toda clave de index.html existe en la base', !unknown.length,
    unknown.slice(0, 6).join(', '));

const dead = esKeys.filter(k => !htmlKeys.has(k) && !MANUAL_KEYS.has(k));
check('la base no tiene claves que el marcado no use', !dead.length,
    dead.slice(0, 6).join(', '));

const badAttrs = [...html.matchAll(/data-i18n-([a-z-]+)="[^"]+"/g)]
    .map(m => m[1])
    .filter(a => !I18N_ATTRS.includes(a));
check('los atributos data-i18n-* son los que aplica el motor', !badAttrs.length,
    [...new Set(badAttrs)].join(', '));

const htmlTitle = (/<title>([^<]*)<\/title>/.exec(html) || [])[1]?.trim();
check('doc.title de la base coincide con el <title>', dicts.es?.['doc.title'] === htmlTitle,
    `${dicts.es?.['doc.title']} vs ${htmlTitle}`);

// --- 5. Traducciones reales ----------------------------------------------
for (const lang of ['en', 'pt', 'fr']) {
    if (!dicts[lang]) continue;
    const same = esKeys.filter(k => dicts[lang][k] === dicts.es[k]);
    const ratio = esKeys.length ? same.length / esKeys.length : 1;
    check(`[${lang}] tiene texto traducido (no es copia del español)`,
        ratio <= MAX_SAME_RATIO, `${same.length}/${esKeys.length} iguales`);
}

if (dicts.ar) {
    const diff = esKeys.filter(k => dicts.ar[k] !== dicts.es[k]);
    check('[ar] conserva el voseo respecto de la base', diff.length >= 3,
        `${diff.length} textos distintos`);
}

// --- 6. Cableado en la página --------------------------------------------
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const at = src => scripts.indexOf(src);

check('index.html carga js/i18n.js', at('js/i18n.js') !== -1);
check('js/i18n.js se carga antes que js/main.js',
    at('js/i18n.js') !== -1 && at('js/main.js') !== -1 && at('js/i18n.js') < at('js/main.js'));

for (const lang of LANGS) {
    const src = `lang/${lang}.js`;
    check(`index.html carga ${src}`, at(src) !== -1);
    check(`${src} se carga antes que js/i18n.js`,
        at(src) !== -1 && at('js/i18n.js') !== -1 && at(src) < at('js/i18n.js'));
}

const mainJs = read('js', 'main.js');
check('js/main.js inicializa el motor de idiomas', /window\.i18n\.init\(\)/.test(mainJs));

const engine = read('js', 'i18n.js');
for (const lang of LANGS) {
    check(`js/i18n.js anuncia el idioma ${lang}`,
        new RegExp(`\\b${lang}: \\{ name:`).test(engine));
}
check('js/i18n.js usa la base española', /BASE_LANG = 'es'/.test(engine));

// --- 7. Textos de ejecución (fase 3) -------------------------------------
// Se cargan los diccionarios fijos + lang/runtime/*.js + js/runtime-dict.js en
// un mismo contexto, igual que en index.html, y se valida el diccionario final.
const runtimeWin = {};
const runtimeCtx = { window: runtimeWin };
vm.createContext(runtimeCtx);

for (const lang of LANGS) {
    const file = path.join(ROOT, 'lang', `${lang}.js`);
    if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), runtimeCtx, { filename: file });
}
for (const lang of LANGS) {
    const file = path.join(ROOT, 'lang', 'runtime', `${lang}.js`);
    check(`lang/runtime/${lang}.js existe`, fs.existsSync(file));
    if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), runtimeCtx, { filename: file });
}

const loader = path.join(ROOT, 'js', 'runtime-dict.js');
check('js/runtime-dict.js existe', fs.existsSync(loader));
if (fs.existsSync(loader)) {
    vm.runInContext(fs.readFileSync(loader, 'utf8'), runtimeCtx, { filename: loader });
}

const full = runtimeWin.SIM_DICTS || {};
const fullEs = full[BASE] || {};
const fullEsKeys = Object.keys(fullEs);
const runtimeKeys = fullEsKeys.filter(k => k.startsWith('rt.'));
check('el diccionario final tiene textos de ejecución', runtimeKeys.length > 0, `${runtimeKeys.length} claves rt.*`);

for (const lang of LANGS) {
    const dict = full[lang] || {};
    const missing = fullEsKeys.filter(k => !(k in dict));
    const extra = Object.keys(dict).filter(k => !fullEsKeys.includes(k));
    check(`[${lang}] paridad completa (fijos + ejecución)`, !missing.length && !extra.length,
        (missing.length ? `faltan ${missing.length}: ${missing.slice(0, 4).join(', ')} ` : '') +
        (extra.length ? `sobran ${extra.length}: ${extra.slice(0, 4).join(', ')}` : ''));
}

const emptyRuntime = runtimeKeys.filter(k => !String(fullEs[k]).trim());
check('textos de ejecución sin valores vacíos', !emptyRuntime.length, emptyRuntime.slice(0, 4).join(', '));

// Toda clave rt.* usada en js/*.js debe existir en el diccionario final.
const usedRt = new Set();
for (const file of fs.readdirSync(path.join(ROOT, 'js'))) {
    if (!file.endsWith('.js')) continue;
    const src = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
    for (const m of src.matchAll(/\brt[f]?\(\s*'([^']+)'/g)) usedRt.add(m[1]);
    for (const m of src.matchAll(/\brt[f]?\(\s*"([^"]+)"/g)) usedRt.add(m[1]);
}
const missingRt = [...usedRt].filter(k => !k.includes('${') && k !== 'help.' && k !== 'app.' && !(`rt.${k}` in fullEs));
check('toda clave rt() usada en js/*.js existe', !missingRt.length, missingRt.slice(0, 8).join(', '));

for (let n = 1; n <= 12; n++) {
    check(`escenario ${n} tiene nombre, síntomas y pasos`,
        `rt.scen.${n}.name` in fullEs
        && `rt.scen.${n}.s.1` in fullEs
        && `rt.scen.${n}.p.1` in fullEs);
}
for (const tab of ['alumno', 'docente', 'herramientas', 'escenarios']) {
    check(`manual traducido: ${tab}`, `rt.help.${tab}` in fullEs);
}

const runtimeScripts = [
    ...LANGS.map(lang => `lang/runtime/${lang}.js`),
    'js/runtime-dict.js'
];
for (const src of runtimeScripts) {
    check(`index.html carga ${src}`, scripts.includes(src));
    check(`${src} se carga antes que js/i18n.js`,
        scripts.indexOf(src) !== -1 && scripts.indexOf(src) < scripts.indexOf('js/i18n.js'));
}
check('js/main.js repinta textos al cambiar de idioma',
    /sim:langchange/.test(mainJs) && /refreshRuntimeTexts/.test(mainJs));

console.log(`\nResultado: ${ok} ok, ${fail} fallidos`);
process.exit(fail ? 1 : 0);
