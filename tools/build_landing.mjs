// tools/build_landing.mjs — genera la landing estática multilingüe.
//
// Uso: node tools/build_landing.mjs
//
// Lee landing/template.html y los diccionarios landing/i18n/*.js y escribe un
// index.html por idioma EN LA RAÍZ del repositorio:
//
//   es/index.html (español neutro, x-default)
//   ar/index.html (español rioplatense)
//   en/index.html
//   pt/index.html
//   fr/index.html
//   sitemap.xml
//   robots.txt
//
// El simulador NO se mueve de /index.html: netlify.toml redirige la raíz (/) a
// /es/ y ofrece el alias /simulador, así que quien entra al dominio ve la
// portada y quien necesita la herramienta la abre directo. La landing enlaza al
// simulador con "../index.html" y comparte sus assets (../assets/…).
//
// Todo es relativo: funciona en Netlify, en GitHub Pages, en un subdirectorio y
// abriendo el archivo con file:// (donde no hay redirecciones: el simulador se
// abre en /index.html o desde el enlace de la propia portada).
//
// landing/ contiene solo las fuentes (plantilla, diccionarios y la config de
// Tailwind). El resultado se versiona: no hace falta compilar para publicar y
// el sitio queda auditable en el propio diff.
//
// Tokens de landing/template.html:
//   {{seccion.clave}}  texto del diccionario landing/i18n/<idioma>.js (se escapa)
//   {{_lang}} {{_dir}} idioma y dirección del texto
//   {{_root}}          prefijo relativo hasta la raíz del sitio ("../")
//   {{_route}}         carpeta del idioma ("es")
//   {{_locale}}        locale de og:locale (es_ES, en_US, pt_BR, fr_FR)
//   {{_site}}          URL base del sitio (canónica y para compartir)
//   {{_year}}          año en curso, para el aviso de copyright
//   {{_altLinks}}      navegación de idiomas ya generada
//   {{_hreflang}}      etiquetas <link rel="alternate" hreflang> ya generadas
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const L = (...p) => path.join(ROOT, 'landing', ...p);

/** Idiomas publicados y el locale que se anuncia en og:locale. */
export const LANGS = ['es', 'ar', 'en', 'pt', 'fr'];
const LANG_TAG = { es: 'es', ar: 'es-AR', en: 'en', pt: 'pt', fr: 'fr' };
const OG_LOCALE = { es: 'es_ES', ar: 'es_AR', en: 'en_US', pt: 'pt_BR', fr: 'fr_FR' };

/** URL base del sitio. Se puede cambiar con SITE_URL al compilar. */
const SITE = (process.env.SITE_URL || 'https://simlabsoftware.netlify.app').replace(/\/+$/, '');

// --- Diccionarios ---------------------------------------------------------
function loadDicts() {
    const win = {};
    for (const lang of LANGS) {
        const file = L('i18n', lang + '.js');
        if (!fs.existsSync(file)) throw new Error(`Falta el diccionario ${file}`);
        vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window: win }, { filename: file });
    }
    if (!win.LANDING_DICTS) throw new Error('Los diccionarios no definieron window.LANDING_DICTS');
    return win.LANDING_DICTS;
}

/** Aplana {a:{b:'x'}} en {'a.b':'x'}. */
function flat(obj, prefix = '', out = {}) {
    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? prefix + '.' + k : k;
        if (typeof v === 'string') out[key] = v;
        else if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out);
    }
    return out;
}

// --- Utilidades de HTML ---------------------------------------------------
const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Enlaces de idioma del encabezado (el idioma actual queda marcado). */
function altLinks(dicts, lang) {
    const label = esc(dicts[lang].nav.langLabel);
    const items = LANGS.map(l => {
        const name = esc(dicts[l]._meta.name);
        const current = l === lang;
        const code = l.toUpperCase();
        const tag = LANG_TAG[l];
        return current
            ? `<span lang="${tag}" aria-current="page">${code}</span>`
            : `<a href="../${l}/index.html" hreflang="${tag}" lang="${tag}" title="${name}">${code}</a>`;
    }).join('\n                ');
    return `<nav class="lang-nav" aria-label="${label}">\n                ${items}\n            </nav>`;
}

/** <link rel="alternate" hreflang> de los cinco idiomas + x-default. */
function hreflang() {
    const lines = LANGS.map(l => `    <link rel="alternate" hreflang="${LANG_TAG[l]}" href="${SITE}/${l}/">`);
    lines.push(`    <link rel="alternate" hreflang="x-default" href="${SITE}/es/">`);
    return lines.join('\n');
}

// --- Generación de una página --------------------------------------------
/** JSON-LD de la aplicación educativa, con su nombre y descripción traducidos. */
function jsonLd(dicts, lang) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'EducationalApplication',
        name: 'SimLab Software',
        alternateName: 'RetroOS 3.0',
        description: dicts[lang].meta.description,
        url: `${SITE}/${lang}/`,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web browser',
        inLanguage: LANGS.map(l => LANG_TAG[l]),
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        license: 'https://opensource.org/licenses/MIT',
        author: { '@type': 'Person', name: 'Hugo Martín Villalba' },
        featureList: [
            dicts[lang].features.f1Title,
            dicts[lang].features.f2Title,
            dicts[lang].features.f3Title,
            dicts[lang].features.f4Title
        ]
    };
    // Se cierra cualquier </script> que venga en un texto traducido.
    const json = JSON.stringify(data, null, 4).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">\n${json}\n    </script>`;
}

function renderPage(template, dicts, lang, year) {
    const values = flat(dicts[lang]);
    const special = {
        _lang: LANG_TAG[lang],
        _route: lang,
        _dir: dicts[lang]._meta.dir || 'ltr',
        _root: '../',
        _site: SITE,
        _locale: OG_LOCALE[lang] || 'es_ES',
        _year: String(year),
        _altLinks: altLinks(dicts, lang),
        _hreflang: hreflang(),
        _jsonLd: jsonLd(dicts, lang)
    };
    return template.replace(/\{\{([\w.]+)\}\}/g, (m, key) => {
        if (key in special) return special[key];
        const v = values[key];
        if (v === undefined) throw new Error(`Token sin resolver en ${lang}: ${m} (clave '${key}')`);
        // El texto del diccionario se interpola en HTML de atributo o de nodo:
        // se escapa para que un apóstrofo o un & no rompa el marcado.
        return esc(v.replace(/\{year\}/g, String(year)));
    });
}

// --- Sitemap y robots ----------------------------------------------------
// La raíz del sitio es la portada (/ redirige a /es/) y el simulador tiene URL
// propia: /index.html (y el alias /simulador declarado en netlify.toml).
function renderSitemap(year) {
    const items = [
        ...LANGS.map(l => ({ loc: `${SITE}/${l}/`, priority: '1.0', alternates: true })),
        { loc: `${SITE}/index.html`, priority: '0.9', alternates: false }
    ];
    const urls = items.map(({ loc, priority, alternates }) => {
        const alts = alternates
            ? LANGS.map(a => `        <xhtml:link rel="alternate" hreflang="${LANG_TAG[a]}" href="${SITE}/${a}/"/>`).join('\n') + '\n'
            : '';
        return `    <url>\n        <loc>${loc}</loc>\n        <lastmod>${year}-01-01</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>${priority}</priority>\n${alts}    </url>`;
    }).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

function renderRobots() {
    return `# robots.txt — generado por tools/build_landing.mjs.
User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
}


// --- main ----------------------------------------------------------------
function main() {
    const dicts = loadDicts();
    const template = fs.readFileSync(L('template.html'), 'utf8');
    const year = new Date().getFullYear();

    // Todas las claves de la plantilla deben existir en los cinco idiomas.
    const tokens = [...new Set([...template.matchAll(/\{\{([\w.]+)\}\}/g)].map(m => m[1]))]
        .filter(k => !k.startsWith('_'));
    const problems = [];
    for (const lang of LANGS) {
        const values = flat(dicts[lang]);
        for (const key of tokens) if (values[key] === undefined) problems.push(`${lang}: falta '${key}'`);
    }
    if (problems.length) throw new Error('Diccionarios incompletos:\n  ' + problems.join('\n  '));

    for (const lang of LANGS) {
        const dir = path.join(ROOT, lang);
        fs.mkdirSync(dir, { recursive: true });
        const html = renderPage(template, dicts, lang, year);
        fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
        console.log(`  ${lang}: ${lang}/index.html (${(html.length / 1024).toFixed(1)} KB, ${tokens.length} claves)`);
    }

    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), renderSitemap(year), 'utf8');
    fs.writeFileSync(path.join(ROOT, 'robots.txt'), renderRobots(), 'utf8');

    console.log('Landing: 5 páginas + sitemap.xml + robots.txt en la raíz del repo');
    console.log(`URL base del sitio: ${SITE} (se puede cambiar con SITE_URL=...)`);
    console.log('Recordatorio: npm run build:landing:css compila assets/landing.css.');
}

main();

