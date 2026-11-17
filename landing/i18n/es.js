// landing/i18n/es.js — Textos de la landing en español neutro.
//
// Este archivo es la fuente de verdad: todos los demás idiomas deben tener
// exactamente las mismas claves. tools/build_landing.mjs genera la página
// es/ a partir de acá y tools/test_landing.mjs comprueba que no falte ninguna.
//
// El contenido describe lo que hace el simulador (index.html): 12 escenarios,
// herramientas de diagnóstico, panel docente protegido, modo examen y uso sin
// instalación. No promete nada que la aplicación no tenga.
window.LANDING_DICTS = window.LANDING_DICTS || {};
window.LANDING_DICTS.es = {
    _meta: { name: 'Español neutro', dir: 'ltr' },

    meta: {
        title: 'SimLab Software — Simulador de diagnóstico de sistemas operativos',
        description: 'Simulador educativo, gratuito y sin instalación: diagnostica una PC con fallas de RAM, CPU, disco, temperatura, malware y red. Incluye 12 escenarios, panel docente y modo examen.',
        ogImageAlt: 'Escritorio del simulador con las ventanas de Administrador de Tareas y Monitor de Hardware abiertas'
    },

    nav: {
        langLabel: 'Idioma',
        features: 'Qué incluye',
        scenarios: 'Escenarios',
        teachers: 'Para docentes',
        start: 'Empezar',
        support: 'Apoyar',
        repo: 'Repositorio',
        simulator: 'Abrir simulador'
    },

    hero: {
        badge: 'Gratis · Sin instalar · Funciona sin internet',
        title: 'Aprende a diagnosticar computadoras rompiéndolas un poco',
        lead: 'SimLab Software es un simulador de escritorio con estética de Windows 98: los estudiantes abren una PC con fallas, miden RAM, CPU, disco y temperatura, y reparan el problema con herramientas reales de mantenimiento.',
        ctaPrimary: 'Abrir simulador',
        ctaSecondary: 'Ver el código',
        note: 'Se ejecuta en el navegador y también abriendo el archivo desde una carpeta o un pendrive, sin servidor ni conexión.'
    },

    features: {
        title: 'Qué incluye',
        lead: 'Un laboratorio de mantenimiento completo dentro del navegador, sin licencias ni cuentas.',
        f1Title: 'Sistema operativo simulado',
        f1Text: 'Escritorio, ventanas que se arrastran, barra de tareas y sonidos retro generados en vivo. Cada acción queda registrada en un log de auditoría.',
        f2Title: 'Métricas que reaccionan',
        f2Text: 'RAM y swap con page faults, thrashing, temperatura y thermal throttling, fragmentación del disco, tráfico de red y un índice de salud del sistema.',
        f3Title: 'Herramientas de técnico',
        f3Text: 'Administrador de Tareas, Tabla de Páginas, Monitor de Hardware, Desfragmentador, Disk Cleaner, MSConfig, Tienda de Hardware y consola CMD.',
        f4Title: 'Listo para el aula',
        f4Text: '12 escenarios con fallas, inyector de fallas para el docente, modo examen cronometrado y exportación del informe en PDF, CSV o TXT.'
    },

    shots: {
        title: 'Cómo se ve',
        lead: 'Capturas del simulador real, en escritorio y en celular.',
        desktopCaption: 'Escritorio de RetroOS 3.0 con el Administrador de Tareas, la Tabla de Páginas y el Monitor de Hardware abiertos.',
        mobileCaption: 'La misma interfaz en un celular: las ventanas se reordenan y la barra se compacta.',
        altDesktop: 'Escritorio del simulador con las ventanas de procesos, paginación y monitor de hardware',
        altMobile: 'Vista del simulador en un celular con las ventanas apiladas'
    },

    scenarios: {
        title: 'Doce fallas para diagnosticar',
        lead: 'Cada escenario trae síntomas, métricas alteradas y una pauta de corrección esperada.',
        s1Title: 'Caso integral',
        s1Text: 'Poca RAM, malware, disco fragmentado y temperatura alta en el mismo equipo.',
        s2Title: 'Thrashing',
        s2Text: 'Page faults en aumento y swap saturado: falta memoria física.',
        s3Title: 'Ciberseguridad',
        s3Text: 'Un proceso que imita al sistema consume CPU y red en segundo plano.',
        s4Title: 'Hardware y disco',
        s4Text: 'Fragmentación extrema, archivos temporales y refrigeración deficiente.',
        s5Title: 'Inicio lento',
        s5Text: 'Demasiados programas de arranque: el equipo tarda minutos en quedar usable.',
        s6Title: 'CPU saturada',
        s6Text: 'Un proceso pesado copa el procesador aunque sobre memoria RAM.',
        more: 'Los escenarios 7 a 12 cubren HDD frente a SSD, sobrecalentamiento, disco casi lleno, conflicto de software, fallas de red y una actualización con presupuesto limitado.',
        tableTitle: 'Cómo se resuelve un caso',
        colSymptom: 'Síntoma',
        colTool: 'Herramienta',
        colFix: 'Reparación',
        r1Symptom: 'La PC tarda y el disco no deja de trabajar',
        r1Tool: 'Tabla de Páginas',
        r1Fix: 'Ampliar la RAM física en la Tienda de Hardware y verificar que bajen los page faults',
        r2Symptom: 'CPU y red altas sin que el usuario haga nada',
        r2Tool: 'Administrador de Tareas / CMD',
        r2Fix: 'Identificar y finalizar el proceso malicioso, y quitarlo del inicio con MSConfig',
        r3Symptom: 'Se apaga o se ralentiza después de unos minutos',
        r3Tool: 'Monitor de Hardware',
        r3Fix: 'Revisar la eficiencia de refrigeración y confirmar que baje la temperatura',
        r4Symptom: 'El disco está lleno y todo va lento',
        r4Tool: 'Disk Cleaner / Desfragmentador',
        r4Fix: 'Eliminar temporales, desfragmentar el HDD y comprobar el espacio libre'
    },

    teachers: {
        title: 'Para docentes',
        lead: 'El material para dar clase ya viene dentro del simulador.',
        p1Title: 'Acceso protegido',
        p1Text: 'El panel docente se abre con una clave que se guarda cifrada con SHA-256, y se puede cambiar en el primer acceso.',
        p2Title: 'Inyector de fallas',
        p2Text: 'Durante la clase puedes provocar sobrecalentamiento, swap, un proceso pesado o malware y ver cómo reacciona cada grupo.',
        p3Title: 'Corrección automática',
        p3Text: 'El modo examen puntúa resultados y procedimiento: qué diagnosticó, qué reparó y en qué orden.',
        classTitle: 'Una clase de 45 minutos',
        class1: 'Elige un escenario, cárgalo y proyecta el escritorio mientras explicas los síntomas.',
        class2: 'Cada grupo mide con el Monitor de Hardware y la Tabla de Páginas antes de tocar nada.',
        class3: 'Los alumnos reparan con las herramientas y comprueban el resultado con CMD.',
        class4: 'Cierra con la pauta de corrección y las observaciones que deja el panel docente.',
        rubricTitle: 'La rúbrica que aplica el examen',
        rubric1: 'Resultados: malware eliminado, RAM suficiente, temperatura y disco en rango, red funcionando.',
        rubric2: 'Procedimiento: usar las herramientas adecuadas y no desfragmentar un SSD.',
        rubric3: 'Orden: diagnosticar antes de reparar y verificar después de cada cambio.',
        rubric4: 'Trabajo en grupo: hasta 8 alumnos por equipo, con curso y división en el informe.'
    },

    start: {
        title: 'Empezar en un minuto',
        lead: 'Sin registro, sin instalación y sin depender de la conexión del aula.',
        s1Title: 'Abre el simulador',
        s1Text: 'Se abre en el navegador y ya está: no hay cuentas ni descargas.',
        s2Title: 'Elige un escenario',
        s2Text: 'El escenario 1 viene cargado al iniciar; los demás se eligen desde el panel de misión.',
        s3Title: 'Guarda tu trabajo',
        s3Text: 'El avance queda en el navegador y el informe del examen se exporta en PDF, CSV o TXT.',
        cmdTitle: 'Consola para practicar',
        cmdText: 'La CMD del simulador entiende los comandos que se usan en un taller real:'
    },

    repo: {
        title: 'Código abierto',
        lead: 'El proyecto es MIT: puedes usarlo en clase, modificarlo y compartirlo.',
        license: 'Licencia MIT',
        contribute: 'Cómo colaborar',
        issues: 'Reportar un error',
        support: 'Apoyar el proyecto',
        star: 'Dar una estrella en GitHub'
    },

    support: {
        title: 'Apoyar el proyecto',
        lead: 'El simulador es gratuito y sin publicidad. Si te sirve para dar clase, estas son las formas de devolverlo.',
        mentionTitle: 'Menciona el proyecto',
        mentionText: 'Cuéntales a colegas y estudiantes de dónde lo sacaste, o comparte el enlace en tu material de clase.',
        starTitle: 'Deja una estrella',
        starText: 'Una estrella en GitHub ayuda a que otros docentes lo encuentren.',
        donateTitle: 'Donación (opcional)',
        donateText: 'Si te gusta el Simulador queda a tu criterio una Mención o Donación para el autor.',
        cafecito: 'Invitame un Cafecito',
        kofi: 'Apoyar en Ko-fi',
        donateNote: 'Cafecito: Argentina y Mercado Pago · Ko-fi: internacional.'
    },

    rights: {
        title: 'Licencia y derechos',
        license: 'Distribuido bajo Licencia MIT',
        donation: 'Si te gusta el Simulador queda a tu criterio una Mención o Donación para el autor.',
        mit: 'El código se puede usar, copiar, modificar y redistribuir, incluso en clase, conservando el aviso de copyright. Se entrega tal cual, sin garantías.',
        read: 'Leer la licencia completa'
    },

    footer: {
        madeBy: 'Hecho por Hugo Martín Villalba',
        rights: '© {year} Hugo Martín Villalba · Licencia MIT',
        otherLanguages: 'Otros idiomas'
    }
};

