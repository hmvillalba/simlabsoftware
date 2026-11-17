# jsPDF 2.5.1 — copia local para exportar informes PDF sin internet.

- Archivo: `jspdf.umd.min.js`
- Origen: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
- Licencia: MIT (ver https://github.com/parallax/jsPDF)

Se versiona en `assets/vendor/` para que el simulador funcione abierto con
`file://` y sin conexión. Si se actualiza, reemplazar el archivo y verificar
que `window.jspdf.jsPDF` siga disponible (`node tools/test_offline.mjs`).
