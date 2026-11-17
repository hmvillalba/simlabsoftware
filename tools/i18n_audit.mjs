// tools/i18n_audit.mjs — inventario de textos del simulador (solo lectura).
//
// Uso: node tools/i18n_audit.mjs
//
// Cuenta, sin modificar nada:
//   - nodos de texto visibles en index.html (fuera de <script>, <style>, comentarios)
//   - atributos con texto traducible (placeholder, title, aria-label, alt)
//   - marcas data-i18n ya aplicadas por tools/i18n_extract.mjs
//   - cadenas con texto en js/*.js y llamadas a rt()/rtf() de la fase 3
// Sirve para dimensionar la internacionalización y detectar texto sin migrar.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const hasLetter = s => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(s);

const html = read('index.html');
const body = html.slice(html.indexOf('<body'));
const markup = body
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');

const textNodes = markup
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 1 && hasLetter(s));

const attrRe = /\s(placeholder|title|aria-label|alt)="([^"]*)"/g;
const attrs = [...markup.matchAll(attrRe)].filter(m => hasLetter(m[2]));

let jsStrings = 0;
let jsAlerts = 0;
let rtCalls = 0;
for (const file of fs.readdirSync(path.join(ROOT, 'js'))) {
    if (!file.endsWith('.js')) continue;
    const src = read(path.join('js', file));
    const strings = src.match(/'[^'\n]{6,}'|"[^"\n]{6,}"|`[^`]{6,}`/g) || [];
    jsStrings += strings.filter(hasLetter).length;
    jsAlerts += (src.match(/\balert\(|\bconfirm\(/g) || []).length;
    rtCalls += (src.match(/\brt[f]?\(/g) || []).length;
}

const uniqueTexts = new Set(textNodes.map(s => s.replace(/\s+/g, ' ')));
const marked = (html.match(/data-i18n(?:-[a-z-]+)?=/g) || []).length;

console.log('index.html');
console.log('  nodos de texto visibles :', textNodes.length, `(${uniqueTexts.size} únicos)`);
console.log('  atributos con texto     :', attrs.length);
console.log('  marcas data-i18n        :', marked);
console.log('js/*.js');
console.log('  cadenas con texto       :', jsStrings, '(inventario crudo)');
console.log('  alert/confirm           :', jsAlerts);
console.log('  llamadas rt()/rtf()     :', rtCalls);
