// js/state.js - Estado global y configuración del simulador RetroOS 3.0

const osState = {
    totalRAM: 512,
    diskType: 'HDD',
    diskCapacityGB: 40,
    diskUsedGB: 32,
    fragmentation: 88,
    junkFilesMB: 400,
    defragging: false,
    swapping: false,
    cpuTemp: 45,
    audioEnabled: false,
    pageFaults: 0,
    currentScenario: 1,
    teacherUnlocked: false,
    mustChangePass: false,
    injectedSwapMB: 0,
    browserExtraRAM: 0,
    extraHeavyApps: [],
    // RetroOS 2.7+
    bootTimeSec: 45,
    coolingEfficiency: 85,
    thermalThrottle: false,
    networkOk: true,
    networkIssue: null, // 'ip' | 'gateway' | 'dns' | null
    softwareConflict: false,
    conflictAppName: null,
    budgetRemaining: 0,
    budgetTotal: 0,
    budgetSpent: 0,
    freeDiskGB: 8,
    startupApps: [
        { id: 'startup-antivirus', name: 'Antivirus Turbo 98', pid: 102, ram: 140, cpu: 5, net: 2, enabled: true },
        { id: 'startup-updater', name: 'UpdaterX Service', pid: 108, ram: 90, cpu: 4, net: 10, enabled: true },
        { id: 'startup-cloud', name: 'CloudSync Background', pid: 114, ram: 80, cpu: 3, net: 15, enabled: true },
        { id: 'startup-malware', name: 'svchost_fake.exe', pid: 666, ram: 160, cpu: 45, net: 120, enabled: true },
        { id: 'startup-heavy', name: 'LegacyUpdater98.exe', pid: 120, ram: 110, cpu: 18, net: 5, enabled: false },
        { id: 'startup-conflict', name: 'OldOfficeHelper.exe', pid: 130, ram: 95, cpu: 22, net: 0, enabled: false }
    ],
    openWindows: [],
    minimizedWindows: [],
    auditLog: [],
    // Monitor 2.8
    historyRAM: [],
    historyCPU: [],
    historyTemp: [],
    historyDisk: [],
    snapshots: [],
    lastCpuLoad: 15,
    // Evaluación 2.9
    examMode: false,
    examDifficulty: 3,
    examStudentName: '',
    examStudents: [],
    examCourse: '',
    examDivision: '',
    examStartTime: null,
    examStartHealth: 0,
    examStartSnapshot: null,
    examActions: [],
    examScore: null,
    examReport: null,
    examHistory: [],
    examTimerInterval: null,
    studentOnlyMode: false
};

const scenarioConfigs = {
    1: {
        name: '1 (Caso Integral)',
        ram: 512, frag: 88, junk: 400, temp: 78, malware: true,
        diskType: 'HDD', diskUsedGB: 34, freeDiskGB: 6, bootTimeSec: 95,
        coolingEfficiency: 55, networkOk: true, softwareConflict: false, budget: 0,
        symptoms: [
            'Ralentización extrema generalizada en el sistema.',
            'Uso alto de CPU y congestión de la interfaz gráfica.',
            'Lecturas continuas en el disco duro (rascado constante).',
            'Temperatura de CPU por encima del umbral seguro.'
        ],
        idealSteps: [
            "1. Abrir Administrador de Tareas o Consola CMD y finalizar el proceso malicioso 'svchost_fake.exe' (PID 666).",
            "2. Ir a la Tienda de Hardware y ampliar la memoria RAM a 1.5 GB o 2.5 GB.",
            "3. Abrir el Desfragmentador de Disco C: y ejecutar desfragmentación completa.",
            "4. Abrir Disk Cleaner para escanear y eliminar archivos temporales.",
            "5. Abrir MSConfig y deshabilitar servicios innecesarios al inicio."
        ]
    },
    2: {
        name: '2 (Thrashing y Memoria Virtual)',
        ram: 512, frag: 10, junk: 20, temp: 48, malware: false,
        diskType: 'HDD', diskUsedGB: 20, freeDiskGB: 20, bootTimeSec: 40,
        coolingEfficiency: 90, networkOk: true, softwareConflict: false, budget: 0,
        symptoms: [
            'Tiempos de respuesta lentos al cambiar entre ventanas.',
            'Conteo de Page Faults (fallos de página) elevado continuamente.',
            'Mapeo de Swap extremadamente lleno en la Tabla de Páginas.',
            'El disco duro no detiene la transferencia de datos.'
        ],
        idealSteps: [
            "1. Diagnosticar saturación en la ventana 'Tabla de Páginas / Inspector VMem'.",
            "2. Abrir Administrador de Tareas para identificar sobreconsumo de RAM.",
            "3. Ir a Tienda de Hardware e incrementar la RAM física a 1.5 GB o superior.",
            "4. Verificar en el Inspector VMem que los Page Faults se detengan."
        ]
    },
    3: {
        name: '3 (Ciberseguridad y Auditoría)',
        ram: 1536, frag: 12, junk: 30, temp: 55, malware: true,
        diskType: 'HDD', diskUsedGB: 18, freeDiskGB: 22, bootTimeSec: 50,
        coolingEfficiency: 85, networkOk: true, softwareConflict: false, budget: 0,
        symptoms: [
            'Tráfico de red anómalo y elevado en segundo plano (>100 KB/s).',
            'Proceso sospechoso en ejecución imitando un binario del sistema.',
            'Consumo o pico de procesador persistente al 45% o más.'
        ],
        idealSteps: [
            "1. Abrir Administrador de Tareas o CMD y revisar columna de Tráfico de Red / CPU.",
            "2. Identificar el proceso 'svchost_fake.exe' (PID 666).",
            "3. Finalizar el proceso via GUI o via CMD: taskkill /PID 666.",
            "4. Abrir MSConfig y desmarcar 'svchost_fake.exe' de la lista de inicio."
        ]
    },
    4: {
        name: '4 (Mantenimiento de Hardware y Disco)',
        ram: 1536, frag: 92, junk: 650, temp: 85, malware: false,
        diskType: 'HDD', diskUsedGB: 36, freeDiskGB: 4, bootTimeSec: 70,
        coolingEfficiency: 40, networkOk: true, softwareConflict: false, budget: 0,
        symptoms: [
            'Advertencia de temperatura crítica en el procesador (>80°C).',
            'Lectura de archivos sumamente lenta debido a dispersión de sectores.',
            'Capacidad de almacenamiento ocupada por basura temporal masiva.'
        ],
        idealSteps: [
            "1. Inspeccionar Propiedades del Sistema / Métricas para detectar la temperatura crítica.",
            "2. Ejecutar 'Disk Cleaner' para realizar la limpieza de temporales.",
            "3. Ejecutar 'Desfragmentador C:' para reorganizar bloques fragmentados.",
            "4. Confirmar bajada de temperatura y salud del sistema restaurada."
        ]
    },
    5: {
        name: '5 (Inicio Lento de Windows)',
        ram: 1024, frag: 15, junk: 80, temp: 52, malware: false,
        diskType: 'HDD', diskUsedGB: 22, freeDiskGB: 18, bootTimeSec: 140,
        coolingEfficiency: 80, networkOk: true, softwareConflict: false, budget: 0,
        enableStartupHeavy: true,
        symptoms: [
            'El sistema tarda más de 2 minutos en quedar usable después de iniciar sesión.',
            'Varios procesos se cargan automáticamente al arranque.',
            'Uso de CPU elevado durante los primeros minutos.',
            'El disco registra actividad intensa al inicio.'
        ],
        idealSteps: [
            "1. Abrir MSConfig y revisar la lista de programas de inicio.",
            "2. Deshabilitar 'LegacyUpdater98.exe' y otros servicios innecesarios.",
            "3. Verificar en Administrador de Tareas que el consumo de arranque bajó.",
            "4. Confirmar que el tiempo de arranque simulado se reduce significativamente."
        ]
    },
    6: {
        name: '6 (Saturación de CPU)',
        ram: 1536, frag: 8, junk: 40, temp: 68, malware: false,
        diskType: 'HDD', diskUsedGB: 15, freeDiskGB: 25, bootTimeSec: 35,
        coolingEfficiency: 75, networkOk: true, softwareConflict: false, budget: 0,
        launchHeavyOnStart: true,
        symptoms: [
            'La computadora responde lentamente aunque hay memoria RAM disponible.',
            'CPU cerca del 100% durante intervalos prolongados.',
            'Un proceso concentra gran parte del consumo de procesador.',
            'Las aplicaciones tardan en responder a clics y cambios de ventana.'
        ],
        idealSteps: [
            "1. Abrir Administrador de Tareas y ordenar/revisar la columna de CPU.",
            "2. Identificar el proceso pesado (RenderEngine3D o similar) que satura el CPU.",
            "3. Finalizar el proceso innecesario vía GUI o CMD.",
            "4. Verificar que el uso de CPU y la temperatura bajen a niveles normales."
        ]
    },
    7: {
        name: '7 (HDD lento vs SSD)',
        ram: 1536, frag: 45, junk: 60, temp: 50, malware: false,
        diskType: 'HDD', diskUsedGB: 28, freeDiskGB: 12, bootTimeSec: 85,
        coolingEfficiency: 85, networkOk: true, softwareConflict: false, budget: 120,
        symptoms: [
            'Tiempos de carga de programas y archivos muy elevados.',
            'Latencia alta en operaciones de lectura/escritura aleatorias.',
            'El acceso al disco se vuelve costoso durante la paginación.',
            'La RAM no está saturada; el cuello de botella es el almacenamiento.'
        ],
        idealSteps: [
            "1. Revisar Propiedades del Sistema y confirmar que el disco es HDD.",
            "2. Observar fragmentación y tiempos de respuesta del disco.",
            "3. Ir a Tienda de Hardware y simular el cambio a SSD (si el presupuesto lo permite).",
            "4. Comparar el comportamiento antes/después: tiempos de arranque y carga."
        ]
    },
    8: {
        name: '8 (Sobrecalentamiento por refrigeración)',
        ram: 1536, frag: 12, junk: 50, temp: 92, malware: false,
        diskType: 'HDD', diskUsedGB: 20, freeDiskGB: 20, bootTimeSec: 40,
        coolingEfficiency: 25, networkOk: true, softwareConflict: false, budget: 0,
        symptoms: [
            'La temperatura del procesador supera los 85-90°C bajo carga moderada.',
            'El sistema reduce automáticamente la frecuencia (thermal throttling).',
            'Las aplicaciones se vuelven más lentas después de varios minutos.',
            'El ventilador simulado funciona por debajo de lo necesario.'
        ],
        idealSteps: [
            "1. Observar la temperatura en el Panel de Misión y Propiedades del Sistema.",
            "2. Identificar que el problema es de refrigeración (coolingEfficiency bajo).",
            "3. Simular mantenimiento de refrigeración (comando o acción de limpieza térmica).",
            "4. Verificar que la temperatura baja y desaparece el thermal throttle."
        ]
    },
    9: {
        name: '9 (Disco casi lleno)',
        ram: 1024, frag: 20, junk: 980, temp: 48, malware: false,
        diskType: 'HDD', diskUsedGB: 38, freeDiskGB: 2, bootTimeSec: 55,
        coolingEfficiency: 85, networkOk: true, softwareConflict: false, budget: 0,
        symptoms: [
            'El disco tiene menos del 10% de espacio libre.',
            'Algunas operaciones de escritura fallan o son muy lentas.',
            'Hay cientos de MB de archivos temporales y basura.',
            'El sistema advierte sobre espacio insuficiente.'
        ],
        idealSteps: [
            "1. Abrir Disk Cleaner y ejecutar el análisis de archivos temporales.",
            "2. Limpiar los archivos basura encontrados.",
            "3. Verificar en Propiedades del Sistema / métricas el espacio libre recuperado.",
            "4. Confirmar que las operaciones de escritura vuelven a funcionar normalmente."
        ]
    },
    10: {
        name: '10 (Conflicto de software)',
        ram: 1536, frag: 10, junk: 40, temp: 55, malware: false,
        diskType: 'HDD', diskUsedGB: 18, freeDiskGB: 22, bootTimeSec: 45,
        coolingEfficiency: 80, networkOk: true, softwareConflict: true, budget: 0,
        enableConflictApp: true,
        symptoms: [
            'Dos aplicaciones generan demoras intermitentes cuando se ejecutan juntas.',
            'Una de ellas funciona bien de forma aislada.',
            'Aparecen picos de CPU y accesos frecuentes al disco.',
            'El problema no es falta de RAM ni de espacio en disco.'
        ],
        idealSteps: [
            "1. Abrir Administrador de Tareas y observar el proceso 'OldOfficeHelper.exe'.",
            "2. Comparar el comportamiento con y sin ese proceso activo.",
            "3. Finalizar o deshabilitar el proceso conflictivo desde MSConfig o Task Manager.",
            "4. Verificar que las demoras intermitentes desaparecen."
        ]
    },
    11: {
        name: '11 (Problemas de Red)',
        ram: 1536, frag: 8, junk: 30, temp: 48, malware: false,
        diskType: 'HDD', diskUsedGB: 16, freeDiskGB: 24, bootTimeSec: 35,
        coolingEfficiency: 90, networkOk: false, networkIssue: 'dns', softwareConflict: false, budget: 0,
        symptoms: [
            'No se puede navegar a sitios web aunque el cable/red parece conectado.',
            'El tráfico de red es irregular o nulo en algunos casos.',
            'Posible problema de DNS, puerta de enlace o configuración IP.',
            'El resto del sistema (CPU/RAM/Disco) funciona con normalidad.'
        ],
        idealSteps: [
            "1. Abrir Consola CMD y ejecutar 'ipconfig' o 'network' para ver el estado.",
            "2. Identificar el tipo de fallo (DNS / Gateway / IP).",
            "3. Ejecutar el comando de reparación de red simulado (netfix o repair).",
            "4. Verificar que la conectividad se restaura y el tráfico vuelve a la normalidad."
        ]
    },
    12: {
        name: '12 (Actualización con presupuesto limitado)',
        ram: 512, frag: 35, junk: 120, temp: 72, malware: false,
        diskType: 'HDD', diskUsedGB: 30, freeDiskGB: 10, bootTimeSec: 90,
        coolingEfficiency: 50, networkOk: true, softwareConflict: false, budget: 80,
        symptoms: [
            'El equipo es lento por una combinación de poca RAM y disco HDD.',
            'Temperatura algo elevada y fragmentación moderada.',
            'El presupuesto de actualización es limitado (solo se puede mejorar un componente principal).',
            'Hay que elegir la mejora con mejor relación costo-beneficio.'
        ],
        idealSteps: [
            "1. Diagnosticar cuál es el cuello de botella principal (RAM vs Disco vs Temp).",
            "2. Revisar el presupuesto disponible en la Tienda de Hardware.",
            "3. Elegir la actualización más efectiva según el diagnóstico (RAM prioritaria en este caso).",
            "4. Aplicar la mejora y verificar el impacto real en las métricas de rendimiento."
        ]
    }
};

const appCatalog = {
    'win-browser': { title: 'Navegador Web', icon: 'fa-globe', ram: 220, cpu: 15, pid: 201, exe: 'netscape.exe' },
    'win-player': { title: 'Retro Player', icon: 'fa-compact-disc', ram: 110, cpu: 10, pid: 202, exe: 'winamp.exe' },
    'win-games': { title: 'Juegos', icon: 'fa-gamepad', ram: 160, cpu: 25, pid: 203, exe: 'arcade.exe' },
    'win-calc': { title: 'Calculadora', icon: 'fa-calculator', ram: 30, cpu: 2, pid: 204, exe: 'calc.exe' },
    'win-sysprops': { title: 'Mi PC', icon: 'fa-desktop', ram: 25, cpu: 1, pid: 205, exe: 'explorer.exe' },
    'win-taskmgr': { title: 'Admin Tareas', icon: 'fa-chart-line', ram: 35, cpu: 3, pid: 206, exe: 'taskmgr.exe' },
    'win-vmem': { title: 'Tabla Páginas', icon: 'fa-layer-group', ram: 40, cpu: 4, pid: 207, exe: 'vmem.exe' },
    'win-defrag': { title: 'Defrag Disco', icon: 'fa-hard-drive', ram: 80, cpu: 20, pid: 208, exe: 'defrag.exe' },
    'win-cleaner': { title: 'Disk Cleaner', icon: 'fa-broom', ram: 50, cpu: 8, pid: 209, exe: 'cleaner.exe' },
    'win-msconfig': { title: 'MSConfig', icon: 'fa-sliders', ram: 30, cpu: 2, pid: 210, exe: 'msconfig.exe' },
    'win-nanoedit': { title: 'Bloc de Notas', icon: 'fa-file-lines', ram: 20, cpu: 1, pid: 211, exe: 'notepad.exe' },
    'win-ramshop': { title: 'Hardware RAM', icon: 'fa-memory', ram: 20, cpu: 1, pid: 212, exe: 'ramshop.exe' },
    'win-cmd': { title: 'Consola CMD', icon: 'fa-terminal', ram: 25, cpu: 2, pid: 213, exe: 'cmd.exe' },
    'win-teacher': { title: 'Panel Docente', icon: 'fa-user-graduate', ram: 30, cpu: 2, pid: 214, exe: 'teacher.exe' },
    'win-hwmon': { title: 'Monitor HW', icon: 'fa-gauge-high', ram: 45, cpu: 5, pid: 215, exe: 'hwmon.exe' },
    'win-help': { title: 'Manual / Ayuda', icon: 'fa-book-open', ram: 20, cpu: 1, pid: 216, exe: 'help.exe' }
};

const helpContent = {
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
};

const HW_PRICES = { ram: { 512: 0, 1536: 45, 2560: 70 }, ssd: 60, cooling: 15 };

function logAuditEvent(msg, meta) {
    const timestamp = new Date().toLocaleTimeString();
    const fullMsg = `[${timestamp}] ${msg}`;
    osState.auditLog.push(fullMsg);

    if (osState.examMode && meta && meta.type) {
        osState.examActions.push({ time: timestamp, msg, ...meta });
    }
    if (osState.examMode && typeof saveExamSession === 'function') saveExamSession();

    const container = document.getElementById('audit-log-container');
    if (container) {
        const p = document.createElement('p');
        p.innerText = fullMsg;
        container.appendChild(p);
        container.scrollTop = container.scrollHeight;
    }
}

function copyAuditReport() {
    const report = osState.auditLog.join('\n');
    navigator.clipboard.writeText(report).then(() => {
        alert('Informe de Auditoría paso a paso copiado al portapapeles.');
    }).catch(() => {
        alert('Copiado manualmente:\n' + report);
    });
}

