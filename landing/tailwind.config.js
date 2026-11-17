/** Tailwind CSS v3.4.17 — configuración del build de la landing.
 *
 * Va separada de la del simulador a propósito: la landing solo lleva las
 * clases que usa su plantilla, así el CSS publicado no arrastra estilos del
 * escritorio de RetroOS. La plantilla es `landing/template.html` y también se
 * revisan los diccionarios, por si en el futuro se agregan clases desde ahí.
 */
module.exports = {
    content: [
        './landing/template.html',
        './landing/i18n/*.js'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'ui-monospace', 'monospace']
            }
        }
    },
    plugins: []
};
