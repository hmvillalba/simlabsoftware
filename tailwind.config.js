/** Tailwind CSS v3.4.17 — configuración del simulador.
 *
 * A diferencia de la landing, el simulador arma clases también desde
 * js/*.js (filas de tablas, tarjetas, estados de ventanas). Por eso el
 * content incluye index.html y todo js/. El CSS compilado se publica en
 * assets/simulator.css y se carga localmente: el simulador debe funcionar
 * sin internet.
 */
module.exports = {
    content: [
        './index.html',
        './js/**/*.js'
    ],
    darkMode: 'class',
    theme: {
        extend: {}
    },
    plugins: []
};
