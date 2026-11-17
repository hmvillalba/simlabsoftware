// lang/runtime/ar.js — variante rioplatense de los textos de ejecución.
//
// No duplica el diccionario: js/runtime-dict.js parte de la base española y
// aplica estos overrides. Solo se listan los textos donde cambia el voseo o la
// redacción regional; el resto se comparte con lang/runtime/es.js.
window.SIM_RUNTIME = window.SIM_RUNTIME || {};
window.SIM_RUNTIME.arOverrides = {
    'alert.gameStarted': 'Iniciando {name}... Observá el impacto en la RAM/Swap en el Panel de Misión y Administrador de Tareas.',
    'alert.ssdDefrag': 'La unidad simulada es SSD. No se recomienda desfragmentarla como un HDD; utilizá la optimización/TRIM del sistema.',
    'alert.historySaveFailed': 'No se pudo guardar el historial en este navegador. Exportá los informes (PDF/CSV) para no perderlos.',
    'alert.initialPass': 'Estás usando la clave inicial (1234).\nCambiala ahora: no vas a poder iniciar exámenes hasta hacerlo.',
    'alert.loginLocked': 'Demasiados intentos. Esperá {seconds} s.',
    'alert.loginWrong': 'Clave incorrecta. Intentá de nuevo.',
    'alert.examChangePass': 'Cambiá la clave inicial del docente antes de iniciar un examen.',
    'alert.examAlreadyRunning': 'Ya hay un examen en curso. Finalizalo o cancelalo primero.',
    'alert.examNeedStudent': 'Agregá al menos un alumno (o un grupo) antes de iniciar el examen.',
    'alert.pdfUnavailable': 'No se pudo cargar la librería PDF. Verificá la conexión a internet o usá Exportar Informe (.txt).',
    'alert.pdfUnavailableSimple': 'No se pudo cargar la librería PDF. Verificá la conexión a internet.',
    'ui.resizeGrip': 'Arrastrá para cambiar el tamaño',
    'ui.browserHeavyBody2': 'Fijate cómo el sistema empieza a paginar en disco (Swap/PageFaults) si no tenés suficiente memoria física.',
    'ui.compareEmpty': 'Capturá un estado inicial y otro después de intervenir para comparar.',
    'ui.compareSecond': 'Capturá un segundo estado para ver la comparación.',
    'cmd.ipconfigFail': "Fallo de red detectado: {issue}. Usá 'netfix' para reparar."
};
