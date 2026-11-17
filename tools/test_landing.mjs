// tools/test_landing.mjs — valida la landing generada.
//
// Uso: node tools/test_landing.mjs (también corre con `npm run check`)
//
// Comprueba, sin navegador ni red:
//   - que las páginas de los 5 idiomas existan y sean HTML completo;
//   - que los diccionarios de landing/i18n tengan exactamente las mismas claves;
//   - que no quede ningún token {{...}} sin resolver;
//   - hreflang completo (5 idiomas + x-default) y canónica por idioma;
//   - metadatos OG/Twitter con imagen y locale;
//   - que no haya recursos de CDNs (todo local, como el simulador);
//   - que las imágenes y el CSS referenciados existan en disco;
//   - que la sección de apoyo/derechos esté en los cinco idiomas;
//   - que el enlace al simulador apunte a un index.html que exista;
//   - que sitemap.xml, robots.txt, netlify.toml y vercel.json sean coherentes
//     con las páginas.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const L = (...p) => path.join(ROOT, 'landing', ...p);
const LANGS = ['es', 'ar', 'en', 'pt', 'fr'];
const LANG_TAG = { es: 'es', ar: 'es-AR', en: 'en', pt: 'pt', fr: 'fr' };
const OG_LOCALE = { es: 'es_ES', ar: 'es_AR', en: 'en_US', pt: 'pt_BR', fr: 'fr_FR' };
const SITE = (process.env.SITE_URL || 'https://simlabsoftware.netlify.app').replace(/\/+$/, '');

let ok = 0, fail = 0;
function check(label, condition, detail = '') {
    if (condition) { ok++; console.log(`  ok  - ${label}`); }
    else { fail++; console.log(`  FAIL - ${label}${detail ? ': ' + detail : ''}`); }
}

// --- 1. Diccionarios de la landing ---------------------------------------
const dicts = {};
for (const lang of LANGS) {
    const file = L('i18n', lang + '.js');
    check(`landing/i18n/${lang}.js existe`, fs.existsSync(file));
    if (!fs.existsSync(file)) continue;
    const win = {};
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window: win }, { filename: file });
    dicts[lang] = (win.LANDING_DICTS || {})[lang];
    check(`landing/i18n/${lang}.js define LANDING_DICTS.${lang}`, !!dicts[lang]);
}

const flat = (obj, prefix = '', out = {}) => {
    for (const [k, v] of Object.entries(obj || {})) {
        const key = prefix ? prefix + '.' + k : k;
        if (typeof v === 'string') out[key] = v;
        else if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out);
    }
    return out;
};

const esFlat = flat(dicts.es);
const esKeys = new Set(Object.keys(esFlat));
check('[es] español neutro identificado en el selector', dicts.es?._meta.name === 'Español neutro');
check('[ar] español rioplatense identificado en el selector', dicts.ar?._meta.name === 'Español (Argentina)');
check('[es] usa formas de español neutro',
    dicts.es?.start?.s1Title === 'Abre el simulador' && !/\b(abrí|elegí|guardá|armá)\b/i.test(esFlat['hero.lead'] || ''));
check('[ar] conserva el contenido rioplatense original',
    dicts.ar?.start?.s1Title === 'Abrí el simulador' && /abr/i.test(dicts.ar?.hero?.lead || ''));
for (const lang of LANGS) {
    if (lang === 'es') continue;
    const keys = new Set(Object.keys(flat(dicts[lang])));
    const missing = [...esKeys].filter(k => !keys.has(k) && !k.startsWith('_meta.'));
    const extra = [...keys].filter(k => !esKeys.has(k) && !k.startsWith('_meta.'));
    check(`[${lang}] mismas claves que es`, !missing.length && !extra.length,
        (missing.length ? `faltan ${missing.length}: ${missing.slice(0, 4).join(', ')} ` : '') +
        (extra.length ? `sobran ${extra.length}: ${extra.slice(0, 4).join(', ')}` : ''));
}

// Los textos no deben quedar sin traducir (copia literal del español). Se
// excluyen los que son iguales por naturaleza y se listan las coincidencias
// legítimas (misma palabra en los dos idiomas) para que el chequeo siga siendo
// estricto con el resto.
const SAME_ALLOWED = {
    // La variante rioplatense conserva el contenido que estaba publicado en es.
    ar: Object.keys(esFlat),
    // Nombres propios de herramientas y marcas que no se traducen.
    en: ['nav.simulator', 'hero.ctaPrimary', 'footer.madeBy'],
    pt: ['nav.simulator', 'hero.ctaPrimary', 'repo.support', 'rights.title',
        'scenarios.r3Tool', 'scenarios.r4Tool'],
    fr: ['nav.simulator', 'hero.ctaPrimary', 'repo.support']
};
for (const lang of LANGS) {
    if (lang === 'es') continue;
    const allowed = new Set(SAME_ALLOWED[lang] || []);
    const other = flat(dicts[lang]);
    const same = Object.keys(esFlat).filter(k =>
        !k.startsWith('_meta.') && !allowed.has(k) &&
        esFlat[k].length > 12 && esFlat[k] === other[k]);
    check(`[${lang}] no hay textos sin traducir`, !same.length, same.slice(0, 3).join(' | '));
}

// --- 2. Páginas generadas ------------------------------------------------
const pages = {};
for (const lang of LANGS) {
    const file = path.join(ROOT, lang, 'index.html');
    const exists = fs.existsSync(file);
    check(`${lang}/index.html existe`, exists);
    if (!exists) continue;
    const html = fs.readFileSync(file, 'utf8');
    pages[lang] = html;

    check(`[${lang}] es un documento HTML completo`,
        html.startsWith('<!DOCTYPE html>') && html.includes('</html>'));
    const expectedDir = dicts[lang]?._meta.dir || 'ltr';
    check(`[${lang}] <html lang> y dir correctos`,
        html.includes(`<html lang="${LANG_TAG[lang]}" dir="${expectedDir}"`), (html.match(/<html[^>]*>/) || [''])[0]);
    check(`[${lang}] no quedan tokens sin resolver`,
        !/\{\{[\w.]+\}\}/.test(html), (html.match(/\{\{[\w.]+\}\}/g) || []).slice(0, 3).join(', '));

    // hreflang y canónica
    for (const other of LANGS) {
        check(`[${lang}] hreflang ${other}`, html.includes(`hreflang="${LANG_TAG[other]}" href="${SITE}/${other}/"`));
    }
    check(`[${lang}] hreflang x-default`, html.includes('hreflang="x-default"'));
    check(`[${lang}] canónica propia`, html.includes(`<link rel="canonical" href="${SITE}/${lang}/">`));

    // metadatos sociales
    check(`[${lang}] Open Graph completo`,
        ['og:type', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:locale']
            .every(p => html.includes(`property="${p}"`)));
    check(`[${lang}] locale Open Graph correcto`,
        html.includes(`property="og:locale" content="${OG_LOCALE[lang]}"`));
    check(`[${lang}] Twitter Card`,
        ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']
            .every(n => html.includes(`name="${n}"`)));
    check(`[${lang}] tiene <title> y description no vacíos`,
        /<title>[^<]{10,}<\/title>/.test(html) &&
        new RegExp(`name="description" content="[^"]{20,}"`).test(html));

    // selector de idioma con el idioma actual marcado
    check(`[${lang}] selector de idioma marca el actual`,
        html.includes(`aria-current="page"`) && LANGS.every(l => l === lang || html.includes(`../${l}/index.html`)));

    // Sin CDNs: los únicos recursos que se pueden cargar son locales. Las URLs
    // absolutas de canonical/hreflang/og:* son datos, no recursos, así que solo
    // se revisan <link rel="stylesheet">, <script src> e <img src>.
    const external = [...html.matchAll(/<(?:link|script|img)\b([^>]*)>/g)]
        .filter(m => {
            const attrs = m[1];
            if (/rel="(?:canonical|alternate|icon)"/.test(attrs)) return false;
            return /(?:href|src)="(?:https?:)?\/\//.test(attrs);
        })
        .map(m => m[0].slice(0, 90));
    check(`[${lang}] sin recursos externos (CSS, JS, imágenes locales)`, !external.length,
        external.slice(0, 3).join(' | '));

    // recursos locales referenciados y presentes en disco
    for (const asset of ['assets/landing.css', 'assets/fontawesome/css/all.min.css', 'assets/fonts/fonts.css']) {
        check(`[${lang}] referencia y existe ${asset}`,
            html.includes(`../${asset}`) && fs.existsSync(path.join(ROOT, asset)));
    }
    for (const img of ['simulator-desktop.png', 'simulator-mobile.png', 'og.png']) {
        check(`[${lang}] imagen ${img} referenciada y en disco`,
            (img === 'og.png' ? html.includes('/assets/landing/og.png') : html.includes(`../assets/landing/${img}`))
            && fs.existsSync(path.join(ROOT, 'assets', 'landing', img)));
    }

    // enlaces al simulador y a la licencia (el simulador conserva /index.html
    // y recibe el idioma por ?lang=xx)
    check(`[${lang}] enlaza al simulador con ../index.html?lang=${lang}`,
        html.includes(`href="../index.html?lang=${lang}"`) && fs.existsSync(path.join(ROOT, 'index.html')));
    check(`[${lang}] enlaza a la licencia`,
        html.includes('href="../LICENSE"') && fs.existsSync(path.join(ROOT, 'LICENSE')));

    // accesibilidad mínima
    check(`[${lang}] todas las imágenes tienen alt`, !/<img(?![^>]*\balt=)[^>]*>/.test(html));
    check(`[${lang}] enlaces externos con rel de seguridad`,
        !/<a[^>]+target="_blank"(?![^>]*rel="noopener)/.test(html));
    check(`[${lang}] exactamente un <h1>`, (html.match(/<h1[\s>]/g) || []).length === 1);
    check(`[${lang}] sección de apoyo y derechos`,
        html.includes('id="apoyar"') &&
        html.includes('cafecito.app/hmvillalba') &&
        html.includes('ko-fi.com/hugomartinvillalba') &&
        html.includes('href="../LICENSE"') &&
        /© \d{4} Hugo Martín Villalba/.test(html));
    check(`[${lang}] ancla de apoyo en la navegación`, html.includes('href="#apoyar"'));
    check(`[${lang}] secciones con ancla de la navegación`,
        ['#incluye', '#escenarios', '#docentes', '#empezar', '#apoyar'].every(a => html.includes(`href="${a}"`)));
}


// --- 3. Rutas del sitio: portada en la raíz y simulador aparte ------------
// El dominio abre la portada (/ redirige a /es/, español neutro y x-default) y el
// simulador queda accesible sin pasar por ella en /index.html y en el alias
// /simulador. La configuración vive en netlify.toml y vercel.json porque el
// sitio no tiene servidor propio: cada plataforma necesita su propia regla.
check('el simulador sigue en index.html', fs.existsSync(path.join(ROOT, 'index.html')));
check('/es/ es el x-default de hreflang',
    LANGS.every(l => (pages[l] || '').includes('hreflang="x-default" href="' + SITE + '/es/"')));

const netlifyFile = path.join(ROOT, 'netlify.toml');
check('netlify.toml existe (rutas del despliegue)', fs.existsSync(netlifyFile));
if (fs.existsSync(netlifyFile)) {
    const toml = fs.readFileSync(netlifyFile, 'utf8');
    // Las redirecciones de netlify.toml se leen sin dependencias: cada bloque
    // [[redirects]] trae from/to/status.
    const redirects = [...toml.matchAll(/\[\[redirects\]\]([\s\S]*?)(?=\[\[|\s*$)/g)]
        .map(m => {
            const block = m[1];
            // Los valores de Netlify pueden ir entre comillas o no (status = 302),
            // así que el helper acepta ambos formatos.
            const get = k => (block.match(new RegExp(`^\\s*${k}\\s*=\\s*"?([^"\\r\\n]*)"?\\s*$`, 'm')) || [])[1];
            return { from: get('from'), to: get('to'), status: Number(get('status') || 301) };
        });
    check('hay redirecciones declaradas', redirects.length > 0);
    check('la raíz redirige a /es/',
        redirects.some(r => r.from === '/' && r.to === '/es/' && r.status === 302));
    for (const src of ['/simulador', '/simulador/']) {
        check(`el alias ${src} abre el simulador`,
            redirects.some(r => r.from === src && r.to === '/index.html' && r.status === 302));
    }
    // La landing vive en carpetas reales (es/, ar/…), así que publish debe ser
    // la raíz y no un subdirectorio generado.
    check('publish es la raíz del repo', /^\s*publish\s*=\s*"\."/m.test(toml));
    check('el simulador conserva su URL propia', !redirects.some(r => r.from === '/index.html'));
}

// Vercel necesita la misma tabla de rutas: sin vercel.json sirve el index.html
// de la raíz (el simulador) y la portada nunca aparece.
const vercelFile = path.join(ROOT, 'vercel.json');
check('vercel.json existe (rutas del despliegue)', fs.existsSync(vercelFile));
if (fs.existsSync(vercelFile)) {
    let config = null;
    try { config = JSON.parse(fs.readFileSync(vercelFile, 'utf8')); }
    catch (err) { check('vercel.json es JSON válido', false, err.message); }
    if (config) {
        check('vercel.json es JSON válido', true);
        check('Vercel: publica la raíz del repo (sin carpeta public)',
            config.outputDirectory === '.');
        const redirects = Array.isArray(config.redirects) ? config.redirects : [];
        check('Vercel: la raíz redirige a /es/',
            redirects.some(r => r.source === '/' && r.destination === '/es/' && r.permanent === false));
        for (const src of ['/simulador', '/simulador/']) {
            check(`Vercel: el alias ${src} abre el simulador`,
                redirects.some(r => r.source === src && r.destination === '/index.html' && r.permanent === false));
        }
        check('Vercel: el simulador conserva su URL propia',
            !redirects.some(r => r.source === '/index.html'));
    }
}


// --- 4. sitemap.xml y robots.txt ----------------------------------------
const sitemap = path.join(ROOT, 'sitemap.xml');
check('sitemap.xml existe', fs.existsSync(sitemap));
if (fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, 'utf8');
    check('sitemap declara los 5 idiomas', LANGS.every(l => xml.includes(`<loc>${SITE}/${l}/</loc>`)));
    check('sitemap incluye el simulador', xml.includes(`<loc>${SITE}/index.html</loc>`));
    check('sitemap no anuncia la raíz como página propia (es una redirección)',
        !xml.includes(`<loc>${SITE}/</loc>`));
    check('sitemap con anotaciones hreflang', LANGS.every(l => xml.includes(`hreflang="${LANG_TAG[l]}"`)));
    check('sitemap etiqueta Argentina como español argentino', xml.includes(`hreflang="es-AR" href="${SITE}/ar/`));
    check('sitemap no declara equivalentes por idioma del simulador',
        !/<url>\s*<loc>[^<]*\/index\.html<\/loc>[\s\S]*?xhtml:link[\s\S]*?<\/url>/.test(xml));
    check('sitemap es XML bien formado (declaración y urlset)',
        xml.startsWith('<?xml') && xml.includes('</urlset>'));
}
const robots = path.join(ROOT, 'robots.txt');
check('robots.txt existe', fs.existsSync(robots));
if (fs.existsSync(robots)) {
    check('robots.txt apunta al sitemap',
        fs.readFileSync(robots, 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`));
}

// --- 5. El CSS de la landing está compilado ------------------------------
const css = path.join(ROOT, 'assets', 'landing.css');
check('assets/landing.css existe (npm run build:landing)', fs.existsSync(css));
if (fs.existsSync(css)) {
    const src = fs.readFileSync(css, 'utf8');
    check('assets/landing.css es liviano (menos de 200 KB)', src.length < 200 * 1024,
        `${(src.length / 1024).toFixed(1)} KB`);
    for (const cls of ['rounded-2xl', 'bg-teal-400', 'sm:grid-cols-3']) {
        check(`assets/landing.css incluye .${cls}`, src.includes(cls.replace(':', '\\:')));
    }
    check('assets/landing.css no incluye clases exclusivas del simulador',
        !src.includes('.win98-box') && !src.includes('#mission-panel'));
}

// --- 6. La fuente de la landing no se publica como página -----------------
check('landing/template.html queda fuera de las URLs publicadas',
    !pages.es || !pages.es.includes('{{'));
check('la landing no arrastra scripts del simulador',
    LANGS.every(l => !(pages[l] || '').includes('js/state.js') && !(pages[l] || '').includes('cdn.tailwindcss.com')));

console.log(`\nResultado: ${ok} ok, ${fail} fallidos`);
process.exit(fail ? 1 : 0);

