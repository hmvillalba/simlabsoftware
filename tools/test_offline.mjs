// tools/test_offline.mjs — valida que el sitio funcione sin internet.
//
// Uso: node tools/test_offline.mjs (también corre con `npm run check`)
//
// Comprueba, sin navegador ni red:
//   - que el simulador (index.html) no cargue scripts, estilos, iconos ni
//     imágenes desde http(s):// y que todos sus recursos locales existan;
//   - lo mismo para las 5 portadas (es/ar/en/pt/fr);
//   - que css/win98.css y los CSS compilados no importen fuentes o URLs remotas;
//   - que existan el Tailwind compilado del simulador, FontAwesome local y
//     jsPDF vendorizado;
//   - que assets/simulator.css incluya las clases representativas del escritorio;
//   - que npm run build compile el CSS del simulador y npm run check lo valide.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const exists = (...p) => fs.existsSync(path.join(ROOT, ...p));

let ok = 0, fail = 0;
function check(label, condition, detail = '') {
    if (condition) { ok++; console.log(`  ok  - ${label}`); }
    else { fail++; console.log(`  FAIL - ${label}${detail ? ': ' + detail : ''}`); }
}

/** Recursos que el navegador descarga al abrir una página. */
function resourceUrls(html) {
    const urls = [];
    for (const m of html.matchAll(/<(script|img|iframe|source)\b[^>]*\bsrc="([^"]+)"/gi)) {
        urls.push({ tag: m[1], url: m[2] });
    }
    for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
        const tag = m[0];
        if (!/rel="(stylesheet|icon|preload|manifest)"/i.test(tag)) continue;
        const href = /\bhref="([^"]+)"/i.exec(tag);
        if (href) urls.push({ tag: 'link', url: href[1] });
    }
    return urls;
}

function validatePage(label, htmlFile, baseDir) {
    const html = read(htmlFile);
    const urls = resourceUrls(html);
    const external = urls.filter(r => /^(https?:)?\/\//i.test(r.url));

    check(`${label}: sin recursos externos`, !external.length,
        external.map(r => `${r.tag}=${r.url}`).slice(0, 4).join(', '));

    const missing = urls
        .filter(r => !/^(data:|#|mailto:|tel:)/i.test(r.url))
        .map(r => r.url.split('?')[0].split('#')[0])
        .filter(url => !fs.existsSync(path.resolve(ROOT, baseDir, url)));

    check(`${label}: todos los recursos locales existen`, !missing.length,
        missing.slice(0, 4).join(', '));
}

// --- 1. Páginas -----------------------------------------------------------
validatePage('simulador', 'index.html', '.');
for (const lang of ['es', 'ar', 'en', 'pt', 'fr']) {
    validatePage(`portada ${lang}`, path.join(lang, 'index.html'), lang);
}

// --- 2. CSS sin imports remotos -----------------------------------------
for (const file of ['css/win98.css', 'assets/simulator.css', 'assets/landing.css']) {
    check(`${file} existe`, exists(file));
    if (!exists(file)) continue;
    const css = read(file);
    check(`${file} sin @import remoto`, !/@import\s+(?:url\()?\s*['"]?https?:/i.test(css));
    check(`${file} sin url(http...)`, !/url\(\s*['"]?https?:/i.test(css));
}

// --- 3. Assets críticos ---------------------------------------------------
const critical = [
    'assets/simulator.css',
    'assets/fontawesome/css/all.min.css',
    'assets/fontawesome/webfonts/fa-solid-900.woff2',
    'assets/vendor/jspdf.umd.min.js'
];
for (const file of critical) check(`${file} existe`, exists(file));

if (exists('assets/vendor/jspdf.umd.min.js')) {
    const lib = read('assets/vendor/jspdf.umd.min.js');
    check('jsPDF local tiene el build UMD', lib.includes('jsPDF') && lib.length > 100 * 1024,
        `${(lib.length / 1024).toFixed(1)} KB`);
}

if (exists('assets/simulator.css')) {
    const css = read('assets/simulator.css');
    check('assets/simulator.css es liviano (menos de 200 KB)', css.length < 200 * 1024,
        `${(css.length / 1024).toFixed(1)} KB`);
    for (const cls of ['.grid', '.hidden', '.bg-blue-900', '.text-\\[10px\\]', '.max-w-\\[120px\\]', '.bg-\\[\\#008080\\]']) {
        check(`simulator.css incluye ${cls}`, css.includes(cls));
    }
}

// --- 4. Ningún host de CDN en páginas o CSS ------------------------------
const forbidden = [
    'cdn.tailwindcss.com',
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'unpkg.com',
    'cdn.jsdelivr.net'
];
const scanned = ['index.html', 'css/win98.css', 'assets/simulator.css', 'assets/landing.css'];
for (const file of scanned) {
    if (!exists(file)) continue;
    const src = read(file);
    const found = forbidden.filter(host => src.includes(host));
    check(`${file} sin hosts de CDN`, !found.length, found.join(', '));
}

// --- 5. Scripts de build/check ------------------------------------------
const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};
check('npm run build compila la landing y el simulador',
    /build:landing/.test(scripts.build || '') && /build:simulator/.test(scripts.build || ''));
check('npm run build:simulator:css compila assets/simulator.css',
    /src\/simulator\.css/.test(scripts['build:simulator:css'] || '')
    && /assets\/simulator\.css/.test(scripts['build:simulator:css'] || ''));
check('npm run check ejecuta el test offline',
    /test_offline\.mjs/.test(scripts.check || ''));

console.log(`\nResultado: ${ok} ok, ${fail} fallidos`);
process.exit(fail ? 1 : 0);
