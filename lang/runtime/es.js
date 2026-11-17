// lang/runtime/es.js — textos que el simulador arma en ejecución (fase 3).
//
// Estructura anidada y compacta: js/runtime-dict.js la aplana a claves planas
// dentro de SIM_DICTS.es con el prefijo "rt." (por ejemplo scen.1.name queda
// como rt.scen.1.name). Los arrays se numeran desde 1 (s.1, s.2...).
//
// Es la BASE de los textos dinámicos: alertas, Panel de Misión, manual, CMD,
// monitor, examen e informes. Los demás idiomas deben tener exactamente las
// mismas claves; tools/test_i18n.mjs falla si falta o sobra alguna.
window.SIM_RUNTIME = window.SIM_RUNTIME || {};
window.SIM_RUNTIME.es = {
    scen: {
        1: {
            name: '1 (Caso Integral)',
            s: [
                'Ralentización extrema generalizada en el sistema.',
                'Uso alto de CPU y congestión de la interfaz gráfica.',
                'Lecturas continuas en el disco duro (rascado constante).',
                'Temperatura de CPU por encima del umbral seguro.'
            ],
            p: [
                "1. Abrir Administrador de Tareas o Consola CMD y finalizar el proceso malicioso 'svchost_fake.exe' (PID 666).",
                '2. Ir a la Tienda de Hardware y ampliar la memoria RAM a 1.5 GB o 2.5 GB.',
                '3. Abrir el Desfragmentador de Disco C: y ejecutar desfragmentación completa.',
                '4. Abrir Disk Cleaner para escanear y eliminar archivos temporales.',
                '5. Abrir MSConfig y deshabilitar servicios innecesarios al inicio.'
            ]
        },
        2: {
            name: '2 (Thrashing y Memoria Virtual)',
            s: [
                'Tiempos de respuesta lentos al cambiar entre ventanas.',
                'Conteo de Page Faults (fallos de página) elevado continuamente.',
                'Mapeo de Swap extremadamente lleno en la Tabla de Páginas.',
                'El disco duro no detiene la transferencia de datos.'
            ],
            p: [
                "1. Diagnosticar saturación en la ventana 'Tabla de Páginas / Inspector VMem'.",
                '2. Abrir Administrador de Tareas para identificar sobreconsumo de RAM.',
                '3. Ir a Tienda de Hardware e incrementar la RAM física a 1.5 GB o superior.',
                '4. Verificar en el Inspector VMem que los Page Faults se detengan.'
            ]
        },
        3: {
            name: '3 (Ciberseguridad y Auditoría)',
            s: [
                'Tráfico de red anómalo y elevado en segundo plano (>100 KB/s).',
                'Proceso sospechoso en ejecución imitando un binario del sistema.',
                'Consumo o pico de procesador persistente al 45% o más.'
            ],
            p: [
                '1. Abrir Administrador de Tareas o CMD y revisar columna de Tráfico de Red / CPU.',
                "2. Identificar el proceso 'svchost_fake.exe' (PID 666).",
                '3. Finalizar el proceso via GUI o via CMD: taskkill /PID 666.',
                "4. Abrir MSConfig y desmarcar 'svchost_fake.exe' de la lista de inicio."
            ]
        },
        4: {
            name: '4 (Mantenimiento de Hardware y Disco)',
            s: [
                'Advertencia de temperatura crítica en el procesador (>80°C).',
                'Lectura de archivos sumamente lenta debido a dispersión de sectores.',
                'Capacidad de almacenamiento ocupada por basura temporal masiva.'
            ],
            p: [
                '1. Inspeccionar Propiedades del Sistema / Métricas para detectar la temperatura crítica.',
                "2. Ejecutar 'Disk Cleaner' para realizar la limpieza de temporales.",
                "3. Ejecutar 'Desfragmentador C:' para reorganizar bloques fragmentados.",
                '4. Confirmar bajada de temperatura y salud del sistema restaurada.'
            ]
        },
        5: {
            name: '5 (Inicio Lento de Windows)',
            s: [
                'El sistema tarda más de 2 minutos en quedar usable después de iniciar sesión.',
                'Varios procesos se cargan automáticamente al arranque.',
                'Uso de CPU elevado durante los primeros minutos.',
                'El disco registra actividad intensa al inicio.'
            ],
            p: [
                '1. Abrir MSConfig y revisar la lista de programas de inicio.',
                "2. Deshabilitar 'LegacyUpdater98.exe' y otros servicios innecesarios.",
                '3. Verificar en Administrador de Tareas que el consumo de arranque bajó.',
                '4. Confirmar que el tiempo de arranque simulado se reduce significativamente.'
            ]
        },
        6: {
            name: '6 (Saturación de CPU)',
            s: [
                'La computadora responde lentamente aunque hay memoria RAM disponible.',
                'CPU cerca del 100% durante intervalos prolongados.',
                'Un proceso concentra gran parte del consumo de procesador.',
                'Las aplicaciones tardan en responder a clics y cambios de ventana.'
            ],
            p: [
                '1. Abrir Administrador de Tareas y ordenar/revisar la columna de CPU.',
                '2. Identificar el proceso pesado (RenderEngine3D o similar) que satura el CPU.',
                '3. Finalizar el proceso innecesario vía GUI o CMD.',
                '4. Verificar que el uso de CPU y la temperatura bajen a niveles normales.'
            ]
        },
        7: {
            name: '7 (HDD lento vs SSD)',
            s: [
                'Tiempos de carga de programas y archivos muy elevados.',
                'Latencia alta en operaciones de lectura/escritura aleatorias.',
                'El acceso al disco se vuelve costoso durante la paginación.',
                'La RAM no está saturada; el cuello de botella es el almacenamiento.'
            ],
            p: [
                '1. Revisar Propiedades del Sistema y confirmar que el disco es HDD.',
                '2. Observar fragmentación y tiempos de respuesta del disco.',
                '3. Ir a Tienda de Hardware y simular el cambio a SSD (si el presupuesto lo permite).',
                '4. Comparar el comportamiento antes/después: tiempos de arranque y carga.'
            ]
        },
        8: {
            name: '8 (Sobrecalentamiento por refrigeración)',
            s: [
                'La temperatura del procesador supera los 85-90°C bajo carga moderada.',
                'El sistema reduce automáticamente la frecuencia (thermal throttling).',
                'Las aplicaciones se vuelven más lentas después de varios minutos.',
                'El ventilador simulado funciona por debajo de lo necesario.'
            ],
            p: [
                '1. Observar la temperatura en el Panel de Misión y Propiedades del Sistema.',
                '2. Identificar que el problema es de refrigeración (coolingEfficiency bajo).',
                '3. Simular mantenimiento de refrigeración (comando o acción de limpieza térmica).',
                '4. Verificar que la temperatura baja y desaparece el thermal throttle.'
            ]
        },
        9: {
            name: '9 (Disco casi lleno)',
            s: [
                'El disco tiene menos del 10% de espacio libre.',
                'Algunas operaciones de escritura fallan o son muy lentas.',
                'Hay cientos de MB de archivos temporales y basura.',
                'El sistema advierte sobre espacio insuficiente.'
            ],
            p: [
                '1. Abrir Disk Cleaner y ejecutar el análisis de archivos temporales.',
                '2. Limpiar los archivos basura encontrados.',
                '3. Verificar en Propiedades del Sistema / métricas el espacio libre recuperado.',
                '4. Confirmar que las operaciones de escritura vuelven a funcionar normalmente.'
            ]
        },
        10: {
            name: '10 (Conflicto de software)',
            s: [
                'Dos aplicaciones generan demoras intermitentes cuando se ejecutan juntas.',
                'Una de ellas funciona bien de forma aislada.',
                'Aparecen picos de CPU y accesos frecuentes al disco.',
                'El problema no es falta de RAM ni de espacio en disco.'
            ],
            p: [
                "1. Abrir Administrador de Tareas y observar el proceso 'OldOfficeHelper.exe'.",
                '2. Comparar el comportamiento con y sin ese proceso activo.',
                '3. Finalizar o deshabilitar el proceso conflictivo desde MSConfig o Task Manager.',
                '4. Verificar que las demoras intermitentes desaparecen.'
            ]
        },
        11: {
            name: '11 (Problemas de Red)',
            s: [
                'No se puede navegar a sitios web aunque el cable/red parece conectado.',
                'El tráfico de red es irregular o nulo en algunos casos.',
                'Posible problema de DNS, puerta de enlace o configuración IP.',
                'El resto del sistema (CPU/RAM/Disco) funciona con normalidad.'
            ],
            p: [
                "1. Abrir Consola CMD y ejecutar 'ipconfig' o 'network' para ver el estado.",
                '2. Identificar el tipo de fallo (DNS / Gateway / IP).',
                '3. Ejecutar el comando de reparación de red simulado (netfix o repair).',
                '4. Verificar que la conectividad se restaura y el tráfico vuelve a la normalidad.'
            ]
        },
        12: {
            name: '12 (Actualización con presupuesto limitado)',
            s: [
                'El equipo es lento por una combinación de poca RAM y disco HDD.',
                'Temperatura algo elevada y fragmentación moderada.',
                'El presupuesto de actualización es limitado (solo se puede mejorar un componente principal).',
                'Hay que elegir la mejora con mejor relación costo-beneficio.'
            ],
            p: [
                '1. Diagnosticar cuál es el cuello de botella principal (RAM vs Disco vs Temp).',
                '2. Revisar el presupuesto disponible en la Tienda de Hardware.',
                '3. Elegir la actualización más efectiva según el diagnóstico (RAM prioritaria en este caso).',
                '4. Aplicar la mejora y verificar el impacto real en las métricas de rendimiento.'
            ]
        }
    },
    help: {
        alumno: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Guía para alumnos</h2>
        <p><b>¿Qué es RetroOS?</b> Es un laboratorio virtual estilo Windows 98. La PC simulada tiene problemas (poca RAM, malware, disco lleno, temperatura alta, etc.). Tu trabajo es <b>diagnosticar</b>, <b>reparar</b> y <b>comprobar</b> que mejoró.</p>
        <p class="font-bold text-emerald-800">Método recomendado</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Leé los síntomas del <b>Panel de Misión</b> (si está visible).</li>
            <li>Abrí herramientas: Administrador de Tareas, Monitor HW, Tabla de Páginas, Propiedades, CMD.</li>
            <li>Formulá una hipótesis (¿es RAM? ¿malware? ¿disco? ¿calor?).</li>
            <li>Aplicá una solución concreta.</li>
            <li>Verificá métricas o capturá un snapshot en el Monitor HW.</li>
        </ol>
        <p class="font-bold text-emerald-800">Qué podés hacer</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>Finalizar procesos (Task Manager o <code>taskkill</code> en CMD).</li>
            <li>Ampliar RAM, migrar a SSD o mejorar refrigeración (Tienda de Hardware).</li>
            <li>Desfragmentar HDD, limpiar temporales, deshabilitar programas al inicio (MSConfig).</li>
            <li>Reparar red con <code>ipconfig</code> / <code>netfix</code>.</li>
            <li>Jugar o abrir programas pesados para ver el impacto en la memoria.</li>
        </ul>
        <p class="font-bold text-amber-800">En modo examen</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li>El Panel de Misión se oculta: investigá vos solo.</li>
            <li>No se puede cambiar de escenario.</li>
            <li>Hay un temporizador arriba en rojo.</li>
            <li>No hace falta “adivinar”: usá las herramientas y dejá evidencia de lo que hiciste.</li>
        </ul>
        <p class="text-gray-600">Consejo: no amplíes la RAM sin mirar antes si hay un proceso malicioso o la CPU saturada. Cada problema tiene su causa.</p>
    `,
        docente: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Guía para docentes</h2>
        <p><b>Acceso:</b> icono Panel Docente o menú Inicio. Clave inicial <code>1234</code> (hay que cambiarla en el primer acceso). Se guarda cifrada (SHA-256 con sal) en el navegador. Para una clave que el alumno no pueda borrar, definí <code>FIXED_TEACHER_HASH</code> en el archivo.</p>
        <p class="font-bold text-emerald-800">Panel docente — funciones</p>
        <ul class="list-disc list-inside space-y-0.5">
            <li><b>Cambiar clave</b> de acceso.</li>
            <li><b>Cerrar sesión docente</b> (vuelve a pedir clave).</li>
            <li><b>Modo solo alumno</b>: oculta el icono del escritorio; el acceso queda por Inicio + clave.</li>
            <li><b>12 escenarios</b> didácticos con síntomas y pauta de corrección.</li>
            <li><b>Inyector de fallos</b>: sobrecalentamiento, swap, proceso pesado, malware.</li>
            <li><b>Modo examen</b>: alumno(s), curso, división, nivel 1–3, temporizador, evaluación automática.</li>
            <li><b>Observaciones</b> del docente en el informe.</li>
            <li><b>Exportar</b> informe TXT, CSV o PDF.</li>
            <li><b>Historial</b> de evaluaciones (se guarda en este navegador; ver / re-exportar).</li>
        </ul>
        <p class="font-bold text-emerald-800">Flujo de examen sugerido</p>
        <ol class="list-decimal list-inside space-y-1">
            <li>Elegí escenario y cargalo.</li>
            <li>Completá curso, división y agregá alumno(s) (hasta 8 en grupo).</li>
            <li>Nivel: 1 guiado · 2 técnico · 3 profesional (sin pistas).</li>
            <li>Iniciar Examen → panel de misión oculto, escenarios bloqueados, banner + tiempo.</li>
            <li>Al terminar: Finalizar y Evaluar → nota y criterios.</li>
            <li>Opcional: observaciones → Exportar PDF.</li>
            <li>Cancelar / Desbloquear sale sin nota.</li>
        </ol>
        <p class="font-bold text-amber-800">Evaluación automática</p>
        <p>Puntúa resultados (malware, RAM, temp, disco, red, etc.) y procedimiento (uso de herramientas, diagnosticar antes de reparar, verificar después, evitar errores como desfragmentar SSD).</p>
    `,
        herramientas: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Herramientas del sistema</h2>
        <ul class="list-disc list-inside space-y-1">
            <li><b>Administrador de Tareas:</b> procesos, RAM, CPU, red; terminar tareas.</li>
            <li><b>Tabla de Páginas / VMem:</b> marcos RAM vs SWAP y page faults (thrashing).</li>
            <li><b>Monitor de Hardware:</b> barras y sparklines de RAM/CPU/temp/disco, ventilador, snapshots antes/después.</li>
            <li><b>Desfragmentador:</b> solo HDD. En SSD avisa que no corresponde.</li>
            <li><b>Disk Cleaner:</b> analiza y limpia temporales; recupera espacio.</li>
            <li><b>MSConfig:</b> programas de inicio (incluye malware y servicios pesados).</li>
            <li><b>Tienda de Hardware:</b> RAM, SSD, refrigeración.</li>
            <li><b>CMD:</b> help, tasklist, taskkill, mem, systeminfo, defrag, ipconfig, netfix, coolfix.</li>
            <li><b>Navegador / Juegos / Player:</b> generan carga real de recursos.</li>
            <li><b>Panel de Misión:</b> síntomas y métricas (oculto en examen).</li>
            <li><b>Manual / Ayuda:</b> esta ventana; exportable a PDF.</li>
        </ul>
        <p class="font-bold text-emerald-800">Comandos CMD útiles</p>
        <p class="font-mono text-[11px] bg-gray-100 p-2 border">help · tasklist · taskkill /PID 666 · mem · systeminfo · defrag · ipconfig · netfix · coolfix · cls</p>
    `,
        escenarios: `
        <h2 class="font-bold text-blue-900 text-sm border-b pb-1">Escenarios 1 a 12</h2>
        <ol class="list-decimal list-inside space-y-1">
            <li><b>Caso integral:</b> RAM + malware + fragmentación + temperatura.</li>
            <li><b>Thrashing / VMem:</b> poca RAM, page faults, swap lleno.</li>
            <li><b>Ciberseguridad:</b> svchost_fake.exe, CPU y red anómalas.</li>
            <li><b>Hardware y disco:</b> frag. alta, basura, sobrecalentamiento.</li>
            <li><b>Inicio lento:</b> muchos programas al arranque.</li>
            <li><b>CPU saturada:</b> proceso pesado; la RAM no es el cuello de botella.</li>
            <li><b>HDD vs SSD:</b> latencia de disco; opción de migrar a SSD.</li>
            <li><b>Sobrecalentamiento:</b> refrigeración deficiente y thermal throttle.</li>
            <li><b>Disco casi lleno:</b> poco espacio libre y temporales.</li>
            <li><b>Conflicto de software:</b> aplicaciones que interfieren entre sí.</li>
            <li><b>Problemas de red:</b> DNS/IP; reparar con CMD.</li>
            <li><b>Presupuesto limitado:</b> elegir la mejor actualización de hardware.</li>
        </ol>
        <p class="text-gray-600 mt-2">En examen nivel 3 el alumno no ve la pauta ni el panel de síntomas: debe descubrir la causa con las herramientas.</p>
    `
    },
    alert: {
        scenarioLocked: 'Escenarios bloqueados durante el examen.\nUsá «Cancelar / Desbloquear» o «Finalizar y Evaluar» para cambiar de escenario.',
        gameStarted: 'Iniciando {name}... Observa el impacto en la RAM/Swap en el Panel de Misión y Administrador de Tareas.',
        ssdDefrag: 'La unidad simulada es SSD. No se recomienda desfragmentarla como un HDD; utiliza la optimización/TRIM del sistema.',
        budgetInsufficient: 'Presupuesto insuficiente.\n{label} cuesta ${cost} y solo quedan ${remaining}.',
        auditCopied: 'Informe de Auditoría paso a paso copiado al portapapeles.',
        auditCopyManual: 'Copiado manualmente:\n{report}',
        teacherExamActive: 'Hay un examen en curso. Finalizalo o cancelalo antes de cerrar la sesión docente.',
        teacherLoggedOut: 'Sesión docente cerrada.\nPara volver a entrar hace falta la clave.',
        historySaveFailed: 'No se pudo guardar el historial en este navegador. Exportá los informes (PDF/CSV) para no perderlos.',
        clearHistory: '¿Vaciar TODO el historial de evaluaciones guardado en este navegador? Esta acción no se puede deshacer.',
        teacherPassSaveFailed: 'No se pudo guardar la clave en este navegador (localStorage bloqueado).',
        initialPass: 'Estás usando la clave inicial (1234).\nCambiala ahora: no vas a poder iniciar exámenes hasta hacerlo.',
        loginLocked: 'Demasiados intentos. Esperá {seconds} s.',
        loginWrong: 'Clave incorrecta. Intente de nuevo.',
        examNoAddStudents: 'No se pueden agregar alumnos durante el examen.',
        examStudentName: 'Escribí el nombre del alumno.',
        examStudentDuplicate: 'Ese alumno ya está en la lista.',
        examStudentMax: 'Máximo 8 alumnos por examen grupal.',
        examChangePass: 'Cambiá la clave inicial del docente antes de iniciar un examen.',
        examAlreadyRunning: 'Ya hay un examen en curso. Finalizalo o cancelalo primero.',
        examNeedStudent: 'Agregá al menos un alumno (o un grupo) antes de iniciar el examen.',
        examStarted: 'Modo Examen activado\n\n{group}Alumnos:\n• {students}\n\n• Banner rojo + temporizador\n• Panel de Misión oculto\n• Escenarios bloqueados',
        examNoRunning: 'No hay examen en curso.',
        examCancelConfirm: '¿Cancelar el examen sin evaluar?\n\nSe restaurará el Panel de Misión y se desbloquearán los escenarios.\nNo se generará puntuación.',
        examCancelled: 'Examen cancelado.\nPanel de Misión restaurado.\nEscenarios desbloqueados.',
        examNoReport: 'No hay informe de examen. Iniciá y finalizá un examen primero.',
        pdfUnavailable: 'No se pudo cargar la librería PDF. Verificá la conexión a internet o usá Exportar Informe (.txt).',
        pdfUnavailableSimple: 'No se pudo cargar la librería PDF. Verificá la conexión a internet.'
    },
    app: {
        'win-browser': 'Navegador Web',
        'win-player': 'Retro Player',
        'win-games': 'Juegos',
        'win-calc': 'Calculadora',
        'win-sysprops': 'Mi PC',
        'win-taskmgr': 'Admin Tareas',
        'win-vmem': 'Tabla Páginas',
        'win-defrag': 'Defrag Disco',
        'win-cleaner': 'Disk Cleaner',
        'win-msconfig': 'MSConfig',
        'win-nanoedit': 'Bloc de Notas',
        'win-ramshop': 'Hardware RAM',
        'win-cmd': 'Consola CMD',
        'win-teacher': 'Panel Docente',
        'win-hwmon': 'Monitor HW',
        'win-help': 'Manual / Ayuda'
    },
    ui: {
        resizeGrip: 'Arrastrar para cambiar el tamaño',
        playerPause: 'Pausa',
        playerPlay: 'Play',
        defragProcessing: 'Procesando...',
        defragOptimized: '{pct}% (Optimizado)',
        cleanerFound: 'Encontrados {mb} MB de temporales y archivos basura.',
        cleanerFree: 'Espacio libre actual estimado: {gb} GB',
        cleanerDone: 'Limpieza finalizada. Recuperados ~{mb} MB.',
        vmemUsed: '{used} MB Usados ({usedFrames}/{totalFrames} Marcos)',
        vmemPaged: '{mb} MB Paginados a Disco',
        vmemFreeFrame: 'LIBRE',
        vmemFaultFrame: 'FAULT',
        taskmgrEnd: 'Terminar',
        taskmgrClose: 'Cerrar',
        budgetLimited: 'Presupuesto: ${remaining} disponibles de ${total} (gastado: ${spent})',
        budgetUnlimited: 'Sin límite de presupuesto en este escenario. Gastado: ${spent}',
        shopCooling: 'Mantenimiento de refrigeración',
        correctionHide: 'Ocultar Pauta',
        correctionShow: 'Ver Pauta',
        lockedDuringExam: 'Bloqueado durante el examen',
        examCourseDiv: 'Curso/Div: ',
        on: 'Habilitado',
        off: 'Deshabilitado',
        disconnected: 'desconectado',
        hwmonHigh: 'Alto',
        hwmonMedium: 'Medio',
        hwmonLow: 'Bajo',
        hwmonYes: 'SÍ ⚠',
        hwmonNo: 'No',
        statusNoConnection: 'SIN CONEXIÓN',
        statusOk: 'OK',
        statusFail: 'FALLO',
        statusYes: 'SI',
        statusNo: 'NO',
        propsRam: 'RAM: {mb} MB SDRAM',
        propsDisk: 'Disco {type}: Frag {frag}% | Libre {free} GB',
        propsTemp: 'Temperatura: {temp}°C | Refrigeración: {cool}%',
        browserHomeTitle: 'BuscadorSúper 98',
        browserSearchPlaceholder: 'Buscar en la web...',
        browserSearchBtn: 'Buscar',
        browserSites: 'Sitios Recomendados:',
        browserNewsLink: 'Noticias de Tecnología de los 90s',
        browserHeavyLink: 'Portal Web 3D/HD (Carga masiva en RAM +350MB)',
        browserNewsTitle: 'Portal de Noticias Tech',
        browserNewsBody1: '¡Nuevos módulos de SDRAM prometen eliminar los problemas de intercambio de páginas (swapping)!',
        browserNewsBody2: 'Recomendación: Monitoree el Administrador de Tareas si nota ralentizaciones.',
        browserHeavyTitle: '¡Cargando portal web pesado con scripts y render 3D!',
        browserHeavyBody1: 'Esta pestaña está consumiendo {mb} MB de RAM adicionales.',
        browserHeavyBody2: 'Comprueba cómo el sistema empieza a paginar en disco (Swap/PageFaults) si no tienes suficiente memoria física.',
        compareEmpty: 'Capturá un estado inicial y otro después de intervenir para comparar.',
        compareOne: 'Estado capturado a las <b>{time}</b> — Salud: {health}<br>RAM {ramUsed}/{ram} MB | CPU {cpu}% | Temp {temp}°C | Frag {frag}% | Libre {free} GB | Boot {boot}s',
        compareSecond: 'Capturá un segundo estado para ver la comparación.',
        compareMetric: 'Métrica',
        compareBefore: 'Antes ({time})',
        compareAfter: 'Después ({time})',
        compareDelta: 'Δ',
        compareHealth: 'Salud',
        compareRamUsed: 'RAM usada',
        compareCpu: 'CPU',
        compareTemp: 'Temperatura',
        compareFrag: 'Fragmentación',
        compareFree: 'Espacio libre',
        compareBoot: 'Tiempo arranque',
        comparePf: 'Page Faults',
        compareCool: 'Refrigeración',
        historyEmpty: 'Aún no hay evaluaciones guardadas.',
        historyView: 'Ver',
        historyLoaded: 'Historial #{n} cargado — listo para re-exportar.',
        historyCourseDivision: 'Curso/División: {course} {division}',
        historyGroup: 'Grupo',
        historyStudent: 'Alumno',
        historyScore: 'Nota: {score}% · Escenario {scenario} · {time}',
        historyObservations: 'Observaciones:',
        studentsNone: 'Ningún alumno agregado',
        studentsRemove: 'Quitar',
        studentsCount: '{n} alumnos',
        groupDiv: 'Div. {div}',
        resultsCourseDivision: 'Curso/División: {course} {division}',
        resultsGroup: 'Grupo ({n})',
        resultsStudent: 'Alumno',
        resultsExcellent: 'Excelente',
        resultsPassed: 'Aprobado',
        resultsRegular: 'Regular',
        resultsInsufficient: 'Insuficiente',
        resultsResult: 'Resultado: {pct}% — {label}',
        resultsObservations: 'Observaciones:',
        resultsCriteria: 'Criterio',
        resultsState: 'Estado',
        resultsDetail: 'Detalle',
        examStatusCancelled: 'Examen cancelado (sin evaluación). Escenarios desbloqueados.',
        examStatusRunning: 'EXAMEN EN CURSO · {group}{students} · Esc {scenario} · Nv {level} · Salud ini: {health}%',
        examStatusRestored: 'EXAMEN EN CURSO (restaurado tras recarga) · {group}{students} · Esc {scenario} · Nv {level} · Salud ini: {health}%',
        examStatusFinished: 'EXAMEN FINALIZADO · {mode}: {name} · {course}Nota: {score}% · Tiempo: {time}',
        examBanner: '{group}{names} · Esc. {scenario} · Nv {level}'
    },
    cmd: {
        help: 'Comandos: help, tasklist, taskkill /PID <id>, taskkill /IM nombre.exe, kill nombre.exe, mem, defrag, systeminfo, ipconfig, netfix, coolfix, cls',
        notFound: "'{cmd}' no se reconoce como un comando interno o externo.",
        terminated: 'Proceso terminado exitosamente.',
        processNotFound: 'No se encontró el proceso especificado.',
        mem: 'Memoria Total: {ram} MB | Swap activo: {swap} | Page Faults: {pf}',
        defragStart: 'Iniciando proceso de desfragmentación desde línea de comandos...',
        systeminfo: 'RetroOS 3.0 | RAM: {ram}MB | Disco: {disk} ({free}GB libres) | Temp CPU: {temp}°C | Red: {net}',
        ipconfigOk: 'Adaptador Ethernet: IP 192.168.1.45 | Máscara 255.255.255.0 | Puerta de enlace 192.168.1.1 | DNS 8.8.8.8 [OK]',
        ipconfigFail: "Fallo de red detectado: {issue}. Use 'netfix' para reparar.",
        netOk: 'La red ya funciona correctamente.',
        netFixed: 'Reparación de red completada (ipconfig /renew + flushdns). Conectividad restaurada.',
        coolfix: 'Mantenimiento de refrigeración simulado. Eficiencia ahora: {eff}%. Temp: {temp}°C.'
    },
    log: {
        scenarioChanged: 'Docente cambió al Escenario {name}.',
        scenarioInitial: 'Estado inicial: RAM {ram} MB | Disco {disk} | Frag {frag}% | Temp {temp}°C | Boot ~{boot}s | Free {free} GB',
        faultOverheat: '[FALLO INYECTADO DOCENTE] Se provocó sobrecalentamiento de CPU (+35°C). Temp actual: {temp}°C.',
        faultSwap: '[FALLO INYECTADO DOCENTE] Se saturó la Memoria Virtual / Swap (+450 MB ficticios).',
        faultHeavy: "[FALLO INYECTADO DOCENTE] Se lanzó proceso pesado 'RenderEngine3D_Benchmark.exe' (380 MB RAM, 40% CPU).",
        faultMalware: "[FALLO INYECTADO DOCENTE] Se inyectó / activó proceso 'svchost_fake.exe' (CryptoMiner).",
        gameRun: '[JUEGOS] Se ejecutó {name} consumiendo {ram} MB de RAM extra.',
        correctionShown: 'Docente desplegó la Pauta de Corrección.',
        playerPlaying: 'Reproductor MP3 en reproducción.',
        browserHeavy: 'Navegador Web cargó un portal pesado (+350 MB de consumo).',
        ssdDefragAvoided: '[DIAGNÓSTICO] Se evitó desfragmentar una unidad SSD; la acción apropiada sería optimización/TRIM.',
        defragStart: 'Inició desfragmentación de HDD con {frag}% de fragmentación.',
        defragDone: 'Desfragmentación de HDD completada. Fragmentación: {from}% → {to}%.',
        cleanerScan: 'Escaneo de archivos temporales finalizado.',
        cleanerDone: 'Archivos temporales eliminados por el alumno. Recuperados {mb} MB.',
        msconfigToggle: "MSConfig: Configuración de inicio modificada para '{name}' (Habilitado: {enabled}).",
        killProcess: "[ACCION ALUMNO] Finalizó proceso '{name}' (PID {pid}) via Administrador de Tareas.",
        killHeavy: "[ACCION ALUMNO] Finalizó proceso pesado '{name}' via Administrador de Tareas.",
        purchaseRejected: '[ACCION ALUMNO] Compra rechazada por presupuesto: {label} (${cost}). Disponible: ${remaining}.',
        purchase: '[ACCION ALUMNO] Compra realizada: {label} (${cost}).{extra}',
        purchaseRemaining: ' Presupuesto restante: ${remaining}.',
        ramUpgrade: '[ACCION ALUMNO] Hardware actualizado: Ampliación de RAM física a {mb} MB.',
        diskSSD: '[ACCION ALUMNO] Disco migrado a SSD. Fragmentación ya no es crítica. Tiempo de arranque reducido.',
        diskHDD: '[ACCION ALUMNO] Disco configurado como HDD.',
        cooling: '[ACCION ALUMNO] Mantenimiento de refrigeración realizado. Eficiencia: {eff}%. Temp: {temp}°C.',
        networkFix: '[ACCION ALUMNO] Red reparada (ipconfig /renew + DNS flush simulado).',
        killProcessCmd: '[ACCION ALUMNO] Proceso finalizado via CMD: {name} (PID {pid})',
        killHeavyCmd: '[ACCION ALUMNO] Proceso pesado finalizado via CMD: {name}',
        cmdExec: '[CMD] Comando ejecutado: "{cmd}"',
        snapshot: '[MONITOR] Snapshot capturado ({time}): RAM {ramUsed}/{ram} MB, CPU {cpu}%, Temp {temp}°C, Salud {health}',
        snapshotsCleared: '[MONITOR] Snapshots de comparación limpiados.',
        difficulty: 'Nivel de dificultad establecido: {level}',
        examStarted: '[EXAMEN] Iniciado. Curso: {course} Div: {division}. Alumnos: {students}. Escenario {scenario}.',
        examCancelled: '[EXAMEN] Cancelado. Alumnos: "{students}". Sin evaluación.',
        examFinished: '[EXAMEN] Finalizado. Puntuación: {score}% ({points}/{max}). Duración: {duration}s.',
        exportTxt: '[EXAMEN] Informe exportado (.txt) — {name}',
        exportCsv: '[EXAMEN] Informe CSV exportado — Alumno: {name}',
        exportPdf: '[EXAMEN] Informe PDF exportado — {name}',
        helpPdf: '[AYUDA] Manual de uso exportado a PDF.',
        teacherLogout: '[DOCENTE] Sesión cerrada. Se requiere clave nuevamente.',
        studentOnly: '[DOCENTE] Modo solo alumno: {state}',
        studentOnlyOn: 'activado (icono escritorio oculto)',
        studentOnlyOff: 'desactivado',
        sessionRestored: '[EXAMEN] Sesión restaurada tras recarga del navegador (inactiva ~{seconds}s). El cronómetro continúa desde el inicio original.',
        historyCleared: '[DOCENTE] Historial de evaluaciones vaciado.',
        teacherAuth: 'Panel de Docente autenticado exitosamente.',
        windowOpen: "Abrió ventana '{name}'.",
        windowClose: "Cerró ventana '{name}'.",
        windowMinimize: "Minimizó ventana '{name}'. El proceso sigue activo.",
        aboutOpen: 'Abrió ventana Acerca de RetroOS 3.0.'
    },
    exam: {
        crit: {
            healthHigh: 'Salud del sistema ≥ 85%',
            healthNotable: 'Salud del sistema mejoró notablemente',
            healthSlight: 'Salud del sistema mejoró levemente',
            healthBase: 'Salud del sistema',
            healthRange: '{start}% → {end}%',
            healthImproved: '{start}% → {end}% (+{delta})',
            healthNoImprove: '{start}% → {end}% (sin mejora suficiente)',
            malware: 'Malware eliminado',
            malwareKilled: 'svchost_fake.exe finalizado',
            malwareActive: 'Sigue activo',
            persist: 'Persistencia del malware eliminada (MSConfig)',
            persistDisabled: 'Deshabilitado al inicio',
            persistNotDisabled: 'Proceso muerto pero no deshabilitado al inicio',
            persistNotFixed: 'No corregido',
            memory: 'Presión de memoria / thrashing resuelto',
            memoryResolved: 'RAM {used}/{total} MB, swap off',
            memorySwap: 'Sigue en swap',
            memoryRam: 'RAM {used}/{total} MB',
            ramUpgrade: 'Ampliación de RAM adecuada',
            ramUpgradeDetail: '{start} → {end} MB',
            ramStill: 'Sigue en {end} MB',
            pf: 'Page Faults controlados',
            pfOk: 'PF inicio ~{start}, fin {end}',
            pfBad: 'PF siguen subiendo ({end})',
            frag: 'Fragmentación de HDD corregida',
            fragDetail: '{start}% → {end}%',
            ssd: 'Migración a SSD (opcional)',
            ssdOk: 'HDD → SSD',
            ssdNo: 'Sigue en HDD',
            temp: 'Temperatura y refrigeración normalizadas',
            tempOk: '{start}°C → {end}°C, cool {cool}%',
            tempDetail: '{start}°C → {end}°C',
            disk: 'Espacio en disco recuperado',
            diskOk: 'Libre {start}→{end} GB',
            diskBad: 'Libre {end} GB, basura {junk} MB',
            net: 'Conectividad de red restaurada',
            netOk: 'Red OK',
            netBad: 'Sigue sin conexión',
            boot: 'Inicio optimizado',
            bootPartial: 'Inicio parcialmente optimizado',
            bootDetail: 'Boot {start}s → {end}s',
            bootDetailPartial: '{boot}s, procesos problemáticos activos',
            heavy: 'Procesos pesados innecesarios controlados',
            heavyOk: 'CPU fin ~{cpu}%',
            heavyBad: 'CPU ~{cpu}%',
            diag: 'Uso de herramientas de diagnóstico',
            diagOk: '{n} herramientas distintas',
            diagSome: 'Solo: {tool}',
            diagNone: 'No se usaron herramientas de diagnóstico',
            before: 'Diagnóstico antes de intervenir',
            beforeOk: 'Observó el sistema antes de reparar',
            beforeBad: 'Usó herramientas pero reparó antes de diagnosticar',
            beforeNone: 'No hay evidencia de diagnóstico previo',
            verify: 'Verificación posterior a la reparación',
            verifySnapshots: 'Usó snapshots',
            verifyMetrics: 'Revisó métricas después',
            verifyBad: 'No verificó el resultado',
            budget: 'Gestión del presupuesto',
            budgetOk: 'Gastó ${spent} de ${total} sin excederlo',
            budgetNo: 'No invirtió el presupuesto en ninguna mejora',
            budgetRam: 'Priorizó la mejora de mayor impacto (RAM)',
            budgetRamOk: 'RAM {start} → {end} MB',
            budgetRamBad: 'El cuello de botella principal era la RAM',
            wrong: 'Evitar acciones incorrectas',
            wrongOk: 'Sin intervenciones dañinas detectadas',
            wrongKilled: 'cerró antivirus',
            wrongSSD: 'intentó desfragmentar SSD',
            eff: 'Eficiencia de la intervención',
            effOk: '{actions} acciones en {minutes}m {seconds}s',
            effSome: '{actions} acciones (revisar si hubo pasos de más)',
            effNone: 'Sin acciones registradas'
        },
        report: {
            title: 'RetroOS 3.0 — Informe de Evaluación',
            data: 'Datos del examen',
            course: 'Curso:',
            division: 'División:',
            modality: 'Modalidad:',
            groupMode: 'Grupal ({n} alumnos)',
            individual: 'Individual',
            students: 'Alumno(s):',
            scenario: 'Escenario:',
            difficulty: 'Nivel de dificultad:',
            start: 'Inicio:',
            end: 'Fin:',
            duration: 'Duración:',
            score: 'PUNTUACIÓN:',
            scoreLine: 'PUNTUACIÓN: {score}%  ({points}/{max} puntos)  —  Salud {start}% → {end}%',
            shared: 'La puntuación es compartida por todos los integrantes del grupo.',
            observations: 'Observaciones del docente',
            noObservations: '(sin observaciones)',
            criteria: 'Criterios de evaluación',
            actions: 'Acciones registradas ({n})',
            none: '(ninguna)',
            generated: 'Generado por RetroOS 3.0 — {date}',
            noName: 'Sin nombre',
            group: 'Grupo',
            student: 'Alumno',
            manualTitle: 'RetroOS 3.0 — Manual de Uso y Diagnóstico',
            manualS1: '1. Guía para Alumnos',
            manualS2: '2. Guía para Docentes',
            manualS3: '3. Herramientas del Sistema',
            manualS4: '4. Escenarios Didácticos (1 a 12)',
            txtCourse: 'Curso:',
            txtDivision: 'División:',
            txtLevel: 'Nivel de dificultad:',
            txtDuration: 'Duración:',
            txtStartHealth: 'Salud inicial:',
            txtFinalHealth: 'Salud final:',
            txtScore: 'PUNTUACIÓN:',
            txtPoints: 'puntos',
            txtObservations: '--- Observaciones del docente ---',
            txtCriteria: '--- Criterios ---',
            txtActions: '--- Acciones registradas ({n}) ---',
            txtInitial: '--- Estado inicial ---',
            txtFinal: '--- Estado final ---',
            txtGenerated: 'Generado por RetroOS 3.0',
            csvGroup: 'Grupal',
            csvIndividual: 'Individual'
        }
    }
};
