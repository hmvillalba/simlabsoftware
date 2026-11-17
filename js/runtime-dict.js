// js/runtime-dict.js — fusiona los textos de ejecución en SIM_DICTS.
//
// lang/runtime/<idioma>.js guarda un objeto anidado (SIM_RUNTIME.<idioma>).
// Acá se aplana con el prefijo "rt." y se mezcla con el diccionario fijo de
// cada idioma. Los arrays se numeran desde 1: scen.1.s[1] → rt.scen.1.s.1.
//
// El rioplatense (ar) no duplica todo: reutiliza la base española y aplica
// SIM_RUNTIME.arOverrides para las formas de voseo.
(function () {
    'use strict';

    var LANGS = ['es', 'ar', 'en', 'pt', 'fr'];
    var R = window.SIM_RUNTIME || {};

    function flatten(value, prefix, out) {
        if (Array.isArray(value)) {
            value.forEach(function (item, i) {
                flatten(item, prefix ? prefix + '.' + (i + 1) : String(i + 1), out);
            });
            return out;
        }
        if (value && typeof value === 'object') {
            Object.keys(value).forEach(function (k) {
                flatten(value[k], prefix ? prefix + '.' + k : k, out);
            });
            return out;
        }
        out[prefix] = String(value);
        return out;
    }

    var flatEs = flatten(R.es || {}, '', {});

    LANGS.forEach(function (lang) {
        var flat = lang === 'ar'
            ? Object.assign({}, flatEs, R.arOverrides || {})
            : flatten(R[lang] || {}, '', {});

        var all = window.SIM_DICTS = window.SIM_DICTS || {};
        all[lang] = all[lang] || {};
        Object.keys(flat).forEach(function (key) {
            all[lang]['rt.' + key] = flat[key];
        });
    });
})();
