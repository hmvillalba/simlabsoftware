// js/i18n.js — motor de internacionalización del simulador (interfaz fija).
//
// Los textos viven en lang/<idioma>.js como diccionarios planos:
//     window.SIM_DICTS.es = { 'desktop.miPC': 'Mi PC', ... }
//
// El español (lang/es.js) es la BASE: lo genera tools/i18n_extract.mjs desde el
// propio index.html, así que sus claves y sus textos son los del marcado real.
// Los demás idiomas deben tener exactamente las mismas claves; tools/test_i18n.mjs
// falla si falta o sobra alguna, y `npm run check` lo corre junto con los tests
// de la landing.
//
// Qué traduce este motor:
//   - nodos con data-i18n="clave"
//   - atributos con data-i18n-placeholder / -title / -aria-label / -alt
//   - el <title> del documento (clave doc.title)
//   - <html lang> y <html dir>
//
// Los textos que arma JavaScript en ejecución (alertas, consola CMD,
// escenarios, manual, monitor, examen e informes) usan las claves rt.* que
// agrega js/runtime-dict.js desde lang/runtime/<idioma>.js. Los módulos los
// piden con rt()/rtf() (js/state.js) al momento de dibujarlos.
//
// El idioma elegido se guarda en localStorage y se puede forzar con ?lang=xx,
// que es lo que usan los enlaces de la landing (index.html?lang=en).

(function () {
    'use strict';

    var STORAGE_KEY = 'retroos_lang';
    var DEFAULT_LANG = 'es';
    var BASE_LANG = 'es';

    // Metadatos de cada idioma publicado. `tag` es el valor de <html lang>;
    // `dir` permite sumar idiomas RTL más adelante sin tocar el resto.
    var LANGS = {
        es: { name: 'Español', tag: 'es', dir: 'ltr' },
        ar: { name: 'Español (Argentina)', tag: 'es-AR', dir: 'ltr' },
        en: { name: 'English', tag: 'en', dir: 'ltr' },
        pt: { name: 'Português', tag: 'pt', dir: 'ltr' },
        fr: { name: 'Français', tag: 'fr', dir: 'ltr' }
    };

    var current = DEFAULT_LANG;

    /** Diccionario de un idioma, o null si todavía no se cargó. */
    function dict(lang) {
        var all = window.SIM_DICTS;
        return all && all[lang] ? all[lang] : null;
    }

    /**
     * Traduce una clave. Si el idioma activo no la tiene (o el diccionario no
     * cargó), cae al español y, en última instancia, al texto de respaldo.
     * Nunca devuelve la clave cruda: preferible un texto en otro idioma que un
     * 'desktop.miPC' visible en pantalla.
     */
    function t(key, fallback) {
        var d = dict(current);
        if (d && Object.prototype.hasOwnProperty.call(d, key)) return d[key];
        var base = dict(BASE_LANG);
        if (base && Object.prototype.hasOwnProperty.call(base, key)) return base[key];
        return fallback === undefined ? key : fallback;
    }

    function getLang() {
        return current;
    }

    function hasLang(lang) {
        return !!LANGS[lang] && !!dict(lang);
    }

    /** Lista de idiomas que tienen diccionario cargado, para el selector. */
    function availableLangs() {
        return Object.keys(LANGS).filter(hasLang);
    }

    function meta(lang) {
        return LANGS[lang] || LANGS[DEFAULT_LANG];
    }

    /** Aplica los textos a un subárbol (por defecto, todo el documento). */
    function applyI18n(root) {
        var scope = root || document;

        var nodes = scope.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var key = el.getAttribute('data-i18n');
            // El texto de respaldo es el que ya está escrito en el HTML, así un
            // cambio de idioma nunca deja el nodo vacío.
            // Los espacios de los extremos se conservan: en el menú Inicio el
            // texto va pegado a un icono y el espacio inicial es el que separa.
            var raw = el.textContent;
            var lead = /^\s*/.exec(raw)[0];
            var trail = /\s*$/.exec(raw)[0];
            el.textContent = lead + t(key, raw.trim()) + trail;
        }

        // Atributos traducibles: los mismos que reconoce tools/i18n_extract.mjs.
        var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
        for (var a = 0; a < ATTRS.length; a++) {
            var attr = ATTRS[a];
            var els = scope.querySelectorAll('[data-i18n-' + attr + ']');
            for (var j = 0; j < els.length; j++) {
                var elAttr = els[j];
                var attrKey = elAttr.getAttribute('data-i18n-' + attr);
                elAttr.setAttribute(attr, t(attrKey, elAttr.getAttribute(attr) || ''));
            }
        }

        document.title = t('doc.title', document.title);

        var html = document.documentElement;
        var m = meta(current);
        html.setAttribute('lang', m.tag);
        html.setAttribute('dir', m.dir);

        syncLangSelector();
    }

    // --- Selector de idioma -------------------------------------------------
    // Se inyecta en el menú Inicio con JS en vez de escribirlo en index.html
    // para que el marcado no repita la lista: sale de availableLangs().
    function buildLangSelector() {
        var menu = document.getElementById('start-menu');
        if (!menu || document.getElementById('lang-selector')) return;

        var box = document.createElement('div');
        box.id = 'lang-selector';
        box.className = 'pt-1 mt-1 border-t border-gray-400';

        var title = document.createElement('div');
        title.className = 'px-1 pb-1 text-[10px] font-bold text-gray-700';
        title.textContent = t('lang.title', 'Idioma');
        box.appendChild(title);

        var row = document.createElement('div');
        row.className = 'flex flex-wrap gap-1 px-1 pb-1';

        availableLangs().forEach(function (lang) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'win98-btn px-1.5 py-0.5 text-[10px] font-bold';
            btn.setAttribute('data-lang', lang);
            btn.textContent = lang.toUpperCase();
            btn.title = meta(lang).name;
            btn.setAttribute('lang', meta(lang).tag);
            btn.onclick = function () {
                setLang(lang);
                if (typeof toggleStartMenu === 'function') toggleStartMenu(false);
            };
            row.appendChild(btn);
        });

        box.appendChild(row);

        // Va antes del primer <hr> del menú, así queda junto a las utilidades y
        // arriba de los accesos a ventanas.
        var firstHr = menu.querySelector('hr');
        menu.insertBefore(box, firstHr || null);
    }

    /** Marca el botón del idioma activo. */
    function syncLangSelector() {
        var btns = document.querySelectorAll('#lang-selector [data-lang]');
        for (var i = 0; i < btns.length; i++) {
            var on = btns[i].getAttribute('data-lang') === current;
            btns[i].classList.toggle('active', on);
            btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
            btns[i].style.fontWeight = on ? 'bold' : 'normal';
            btns[i].style.textDecoration = on ? 'underline' : 'none';
        }
        var label = document.querySelector('#lang-selector > div');
        if (label) label.textContent = t('lang.title', 'Idioma');
    }

    /** Cambia el idioma, lo persiste y vuelve a aplicar todo. */
    function setLang(lang) {
        if (!hasLang(lang)) lang = DEFAULT_LANG;
        current = lang;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* modo privado */ }
        applyI18n();
        // Aviso para el resto de los módulos: la fase 3 puede escuchar este
        // evento para refrescar textos armados por JS (consola, escenarios...).
        try {
            document.dispatchEvent(new CustomEvent('sim:langchange', { detail: { lang: lang } }));
        } catch (e) { /* navegador sin CustomEvent */ }
    }

    /** Idioma inicial: ?lang= > localStorage > navegador > español. */
    function detectLang() {
        // Alias por si alguien copia la etiqueta hreflang (es-AR) en la URL.
        var alias = { 'es-ar': 'ar' };
        try {
            var param = new URLSearchParams(window.location.search).get('lang');
            if (param) {
                var code = param.toLowerCase();
                if (alias[code]) code = alias[code];
                if (hasLang(code)) return code;
            }
        } catch (e) { /* URLSearchParams no disponible */ }

        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved && hasLang(saved)) return saved;
        } catch (e) { /* modo privado */ }

        var nav = (navigator.language || '').toLowerCase();
        if (nav === 'es-ar' && hasLang('ar')) return 'ar';
        if (nav.indexOf('en') === 0 && hasLang('en')) return 'en';
        if (nav.indexOf('pt') === 0 && hasLang('pt')) return 'pt';
        if (nav.indexOf('fr') === 0 && hasLang('fr')) return 'fr';
        return DEFAULT_LANG;
    }

    /**
     * Arranque. Se llama desde js/main.js dentro de window.onload, cuando ya
     * existen el menú Inicio y el DOM completo.
     */
    function initI18n() {
        current = detectLang();
        buildLangSelector();
        applyI18n();
    }

    // API pública. `t` es el nombre corto que usan el resto de los módulos.
    window.t = t;
    window.i18n = {
        t: t,
        init: initI18n,
        apply: applyI18n,
        setLang: setLang,
        getLang: getLang,
        availableLangs: availableLangs,
        meta: meta,
        LANGS: LANGS
    };
})();

