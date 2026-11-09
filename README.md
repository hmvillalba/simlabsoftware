# SimLab Software — RetroOS 3.0

Simulador interactivo y pedagógico de diagnóstico de sistemas operativos, arquitectura de computadoras y optimización de hardware diseñado para la enseñanza práctica de conceptos fundamentales y avanzados de informática y sistemas.

Desarrollado como una aplicación web autónoma (Single Page Application) basada en tecnologías web estándar, sin dependencias de servidor ni requerimientos de instalación compleja. Funciona tanto en servidores web como abriendo directamente el archivo en cualquier navegador en modo 100% offline.

> 🌐 **Acceso en línea:** Puedes utilizar el simulador directamente desde tu navegador en **[https://simlabsoftware.netlify.app](https://simlabsoftware.netlify.app/)**

---

## 🚀 Características Principales

### 🖥️ Entorno de Sistema Operativo Didáctico (RetroOS 3.0)
- Interfaz gráfica nostálgica y funcional inspirada en Windows 98.
- Gestor de ventanas con arrastre (drag & drop), redimensionamiento, minimizado, maximizado y foco dinámico.
- Barra de tareas interactiva con reloj en tiempo real, menú de Inicio y monitor de memoria RAM en bandeja.
- Efectos de sonido retro procedurales mediante la **Web Audio API** (sin necesidad de archivos externos).

### ⚙️ Simulación y Métricas en Tiempo Real
- **Memoria RAM & Swap (Paginación Virtual):** Monitoreo en vivo de páginas en memoria física vs. archivo de paginación, cálculo de Page Faults y simulación realista de **Thrashing** (hiperpaginación).
- **CPU & Thermal Throttling:** Simulación de frecuencia del procesador, temperatura por núcleo, RPM de ventiladores y pérdida de rendimiento por estrangulamiento térmico.
- **Fragmentación de Almacenamiento HDD:** Bloques de disco con sectores contiguos y fragmentados que afectan la latencia de lectura/escritura y el tiempo de arranque.
- **Tráfico de Red & Malware:** Procesos en segundo plano que saturan el ancho de banda o minan criptomonedas consumiendo ciclos de reloj.
- **Índice de Salud del Sistema:** Puntuación global del 0 al 100% calculada dinámicamente según la estabilidad del equipo.

### 🛠️ Herramientas de Mantenimiento y Diagnóstico
- **Administrador de Tareas (Task Manager):** Inspección de procesos activos con PID, consumo de CPU/RAM, ajuste de prioridades y finalización de procesos rebeldes.
- **Monitor de Hardware:** Gráficos e indicadores de temperaturas, carga de núcleos y estado de refrigeración.
- **Desfragmentador de Disco:** Mapa visual interactivo de clústeres y proceso de desfragmentación en vivo.
- **Limpiador de Disco (Disk Cleaner):** Detección y eliminación de archivos temporales, registros obsoletos y caché del sistema para liberar espacio.
- **MSConfig (Configuración del Sistema):** Control de aplicaciones de inicio automático y servicios para optimizar el tiempo de arranque.
- **CMD (Consola de Comandos):** Terminal con comandos interactivos (`ping`, `ipconfig`, `netstat`, `tasklist`, `taskkill`, `sfc /scannow`, `mem`, `cls`, `help`).
- **Reparador de Conexión de Red:** Asistente paso a paso para diagnosticar y renovar configuración IP, caché DNS y sockets.
- **Hardware Shop:** Módulo de actualización para adquirir e instalar más módulos de memoria RAM física cuando el equipo sufre cuellos de botella.
- **Tabla de Páginas:** Visualización didáctica de marcos de página físicos y asignación de memoria virtual.

### 🎓 Herramientas Pedagógicas para Clases y Evaluaciones
- **12 Escenarios Prácticos de Laboratorio:** Fallas preconfiguradas del mundo real para resolución por parte de los estudiantes:
  1. *El misterio de la PC lenta (Malware Miner)*
  2. *Memoria agotada y Thrashing severo*
  3. *CPU al rojo vivo (Pasta térmica degradada)*
  4. *Arranque eterno (Sobrecarga de programas de inicio)*
  5. *Disco al límite y fragmentación extrema*
  6. *Falla de DNS y aislamiento de red*
  7. *Servicio zombie consumiendo recursos*
  8. *Cuello de botella multivariable (RAM + Temperatura)*
  9. *Caída crítica del sistema por desborde*
  10. *Conflicto de red y Gateway erróneo*
  11. *Servicio crítico caído en segundo plano*
  12. *Optimización integral y puesta a punto de estación de trabajo*
- **Panel Docente Protegido:** Acceso mediante contraseña con hash seguro SHA-256 para configuración de actividades.
- **Inyector de Fallas en Vivo:** El docente puede inducir saturación de memoria, sobrecalentamiento, malware o fallas de red durante la clase para poner a prueba a los alumnos.
- **Modo Examen con Temporizador:** Evaluación cronometrada con bloqueo de herramientas no autorizadas y registro riguroso de cada acción tomada.
- **Exportación de Informes en PDF y CSV:** Generación instantánea de reportes de auditoría con notas, tiempos y acciones detalladas para corrección docente.

### 💾 Persistencia y Modo 100% Offline
- Almacenamiento local automático en el navegador mediante `localStorage`.
- No requiere conexión a internet, bases de datos ni servidores externos para funcionar.
- Compatible con apertura directa mediante protocolo `file:///`.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica y modular.
- **Tailwind CSS & CSS3 Win98:** Motor de estilos retro con bordes biselados, paletas clásicas y diseño responsivo.
- **JavaScript (Vanilla Modular):** Arquitectura cliente limpia dividida por responsabilidades (`state.js`, `audio.js`, `storage.js`, `windows.js`, `simulation.js`, `exam.js`, `main.js`).
- **Web Audio API:** Síntesis sonora procedural en tiempo de ejecución.
- **jsPDF:** Generación de informes vectoriales descargables en PDF en el navegador del usuario.
- **FontAwesome:** Iconografía técnica y visual clásica de sistemas.

---

## 💻 Acceso e Instalación

### Opción 1: En línea (Recomendada - Sin instalación)
Disponible directamente en Netlify:
👉 **[https://simlabsoftware.netlify.app](https://simlabsoftware.netlify.app/)**

### Opción 2: Abrir localmente en el navegador
1. Clona el repositorio:
   ```bash
   git clone https://github.com/hmvillalba/simlabsoftware.git
   ```
2. Abre el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari). ¡Listo! No requiere compilar ni instalar paquetes.

### Opción 3: Servidor local (XAMPP / Apache / Live Server)
1. Coloca la carpeta en el directorio web (por ejemplo `C:\xampp\htdocs\simulador\optimizacion`).
2. Inicia el servidor Apache.
3. Accede desde el navegador a:
   ```text
   http://localhost/simulador/optimizacion/
   ```

---

## 👤 Autor

- **Hugo Martín Villalba** ([@hmvillalba](https://github.com/hmvillalba))

---

## ☕ Apoyo al Proyecto

> **"Si te gusta el Simulador queda a tu criterio una Mención o Donación para el autor."**

Si utilizas este simulador para tus clases, talleres educativos o aprendizaje personal y deseas apoyar su desarrollo continuo:

[![Invitame un cafecito](https://img.shields.io/badge/Cafecito-Invitame%20uno-blue?style=for-the-badge&logo=coffeescript&logoColor=white)](https://cafecito.app/hmvillalba)
[![Apóyame en Ko-fi](https://img.shields.io/badge/Ko--fi-Apóyame-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/hugomartinvillalba)

- ⭐ Dale una estrella al repositorio en [GitHub](https://github.com/hmvillalba/simlabsoftware).
- 📢 Menciona y comparte la herramienta con tus colegas o estudiantes.
- ☕ Si deseas colaborar económicamente, podés invitar un café mediante **[Cafecito](https://cafecito.app/hmvillalba)** (Argentina / Mercado Pago) o **[Ko-fi](https://ko-fi.com/hugomartinvillalba)** (Internacional).

---

## 📄 Licencia

Este proyecto se distribuye bajo los términos de la **Licencia MIT**. Consulta el archivo [LICENSE](LICENSE) para más información.
