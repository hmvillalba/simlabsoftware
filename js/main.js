// js/main.js - Inicialización de RetroOS 3.0, bucles principales y control de eventos del ciclo de vida

function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

window.onload = function() {
    // Primero el idioma: deja el marcado fijo traducido antes de que el resto
    // de los módulos pinte datos vivos en sus contenedores.
    if (window.i18n) window.i18n.init();

    // Al cambiar de idioma, los módulos repintan los textos de ejecución que ya
    // están en pantalla (Panel de Misión, manual, monitor, tareas, examen).
    document.addEventListener('sim:langchange', function () {
        if (typeof refreshRuntimeTexts === 'function') refreshRuntimeTexts();
    });

    installResizeGrips();
    loadScenario(1);
    renderDefragGrid();
    renderMsconfigList();
    navBrowser('home');
    renderExamStudentsList();
    loadExamHistory();
    renderExamHistory();
    applyStudentOnlyModeFromStorage();
    showHelpTab('alumno');
    restoreExamSession();

    // Bucle de simulación optimizado con Dirty Checking (intervalo de 800 ms)
    setInterval(updateSystemState, 800);
    setInterval(updateClock, 1000);
    setInterval(saveExamSession, 5000);

    window.addEventListener('pagehide', saveExamSession);
    window.addEventListener('beforeunload', (ev) => {
        if (osState.examMode && !saveExamSession()) {
            ev.preventDefault();
            ev.returnValue = '';
        }
    });
};

