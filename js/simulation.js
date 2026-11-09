// js/simulation.js - Motor de simulación del sistema, métricas, optimizaciones y hardware monitor

// Caches para Dirty Checking (evitan layout thrashing y recreación de DOM innecesaria)
let lastVMemCache = null;
let lastProcTableCache = null;

function invalidateSimulationCaches() {
    lastVMemCache = null;
    lastProcTableCache = null;
}

function setTextIfChanged(id, val) {
    const el = document.getElementById(id);
    if (el && el.innerText !== String(val)) el.innerText = String(val);
}

function loadScenario(num) {
    if (osState.examMode) {
        alert('Escenarios bloqueados durante el examen.\nUsá «Cancelar / Desbloquear» o «Finalizar y Evaluar» para cambiar de escenario.');
        return;
    }
    osState.currentScenario = num;
    const config = scenarioConfigs[num];
    if (!config) return;
    
    invalidateSimulationCaches();

    // Reinicio completo y consistente de todo el estado
    osState.totalRAM = config.ram;
    osState.diskType = config.diskType || 'HDD';
    osState.diskCapacityGB = config.diskCapacityGB || 40;
    osState.diskUsedGB = config.diskUsedGB || 20;
    osState.freeDiskGB = config.freeDiskGB != null ? config.freeDiskGB : (osState.diskCapacityGB - osState.diskUsedGB);
    osState.fragmentation = config.frag;
    osState.junkFilesMB = config.junk;
    osState.cpuTemp = config.temp;
    osState.bootTimeSec = config.bootTimeSec || 40;
    osState.coolingEfficiency = config.coolingEfficiency != null ? config.coolingEfficiency : 85;
    osState.thermalThrottle = osState.cpuTemp > 85 || osState.coolingEfficiency < 35;
    osState.networkOk = config.networkOk !== false;
    osState.networkIssue = config.networkIssue || null;
    osState.softwareConflict = !!config.softwareConflict;
    osState.budgetRemaining = config.budget || 0;
    osState.budgetTotal = config.budget || 0;
    osState.budgetSpent = 0;
    updateBudgetDisplay();
    osState.injectedSwapMB = 0;
    osState.browserExtraRAM = 0;
    osState.extraHeavyApps = [];
    osState.pageFaults = 0;
    osState.swapping = false;
    osState.defragging = false;
    osState.minimizedWindows = [];
    osState.historyRAM = [];
    osState.historyCPU = [];
    osState.historyTemp = [];
    osState.historyDisk = [];
    osState.snapshots = [];
    osState.lastCpuLoad = 15;
    if (typeof renderCompareTable === 'function') renderCompareTable();

    const defragLabel = document.getElementById('defrag-pct-text');
    if (defragLabel) defragLabel.innerText = `${Math.round(osState.fragmentation)}%`; 

    // Cerrar todas las ventanas
    osState.openWindows = [];
    document.querySelectorAll('.win98-box[id^="win-"]').forEach(win => win.classList.add('hidden'));
    renderTaskbarTabs();

    // Restaurar apps de inicio según el escenario
    osState.startupApps.forEach(app => {
        if (app.id === 'startup-malware') {
            app.enabled = !!config.malware;
        } else if (app.id === 'startup-heavy') {
            app.enabled = !!config.enableStartupHeavy;
        } else if (app.id === 'startup-conflict') {
            app.enabled = !!config.enableConflictApp;
        } else {
            app.enabled = true;
        }
    });

    if (config.launchHeavyOnStart) {
        osState.extraHeavyApps.push({
            id: 'heavy_scen_' + num,
            name: 'RenderEngine3D_Benchmark.exe',
            pid: 450,
            ram: 320,
            cpu: 55,
            net: 0
        });
    }

    document.getElementById('active-scenario-tag').innerText = config.name;
    
    const symptomsUl = document.getElementById('symptoms-list');
    symptomsUl.innerHTML = config.symptoms.map(s => `<li>${s}</li>`).join('');

    const correctionOl = document.getElementById('correction-steps-list');
    correctionOl.innerHTML = config.idealSteps.map(step => `<li>${step}</li>`).join('');

    for (let i = 1; i <= 12; i++) {
        const btn = document.getElementById(`btn-scen-${i}`);
        if (btn) {
            if (i === num) {
                btn.classList.add('active', 'bg-blue-100', 'border-blue-800');
            } else {
                btn.classList.remove('active', 'bg-blue-100', 'border-blue-800');
            }
        }
    }

    logAuditEvent(`Docente cambió al Escenario ${config.name}.`);
    renderDefragGrid();
    renderMsconfigList();
    updateSystemState();
    logAuditEvent(`Estado inicial: RAM ${osState.totalRAM} MB | Disco ${osState.diskType} | Frag ${osState.fragmentation}% | Temp ${osState.cpuTemp}°C | Boot ~${osState.bootTimeSec}s | Free ${osState.freeDiskGB} GB`);
}

function injectFault(type) {
    playSound('alert');
    invalidateSimulationCaches();
    if (type === 'overheat') {
        osState.cpuTemp = Math.min(105, osState.cpuTemp + 35);
        logAuditEvent(`[FALLO INYECTADO DOCENTE] Se provocó sobrecalentamiento de CPU (+35°C). Temp actual: ${osState.cpuTemp}°C.`);
    } else if (type === 'fillswap') {
        osState.injectedSwapMB += 450;
        logAuditEvent(`[FALLO INYECTADO DOCENTE] Se saturó la Memoria Virtual / Swap (+450 MB ficticios).`);
    } else if (type === 'launchheavy') {
        const heavyId = 'heavy_' + Date.now();
        osState.extraHeavyApps.push({ id: heavyId, name: 'RenderEngine3D_Benchmark.exe', pid: Math.floor(Math.random()*800)+300, ram: 380, cpu: 40, net: 0 });
        logAuditEvent(`[FALLO INYECTADO DOCENTE] Se lanzó proceso pesado 'RenderEngine3D_Benchmark.exe' (380 MB RAM, 40% CPU).`);
    } else if (type === 'malware') {
        const malwareApp = osState.startupApps.find(a => a.id === 'startup-malware');
        if (malwareApp) {
            malwareApp.enabled = true;
            logAuditEvent(`[FALLO INYECTADO DOCENTE] Se inyectó / activó proceso 'svchost_fake.exe' (CryptoMiner).`);
            renderMsconfigList();
        }
    }
    updateSystemState();
}

function runHeavyGame(name, ram) {
    const gameId = 'game_' + Date.now();
    invalidateSimulationCaches();
    osState.extraHeavyApps.push({ id: gameId, name: `${name}.exe`, pid: Math.floor(Math.random()*800)+300, ram: ram, cpu: 35, net: 0 });
    logAuditEvent(`[JUEGOS] Se ejecutó ${name} consumiendo ${ram} MB de RAM extra.`);
    updateSystemState();
    alert(`Iniciando ${name}... Observa el impacto en la RAM/Swap en el Panel de Misión y Administrador de Tareas.`);
}

function toggleCorrectionGuide() {
    const panel = document.getElementById('correction-guide-panel');
    const btn = document.getElementById('btn-toggle-correction');
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ocultar Pauta';
        logAuditEvent('Docente desplegó la Pauta de Corrección.');
    } else {
        panel.classList.add('hidden');
        btn.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> Ver Pauta';
    }
}

function navBrowser(page) {
    const frame = document.getElementById('browser-frame');
    const urlBar = document.getElementById('browser-url-bar');
    invalidateSimulationCaches();

    if (page === 'home') {
        osState.browserExtraRAM = 0;
        urlBar.value = "http://www.buscadorsuper.com";
        frame.innerHTML = `
            <div class="text-center space-y-3">
                <h1 class="text-2xl font-bold text-blue-900">BuscadorSúper 98</h1>
                <div class="flex justify-center gap-1">
                    <input type="text" placeholder="Buscar en la web..." class="border p-1 text-xs w-64">
                    <button onclick="navBrowser('search')" class="win98-btn px-2 font-bold">Buscar</button>
                </div>
                <div class="text-left text-xs space-y-1 mt-4">
                    <p class="font-bold border-b">Sitios Recomendados:</p>
                    <p><a href="#" onclick="navBrowser('news')" class="text-blue-700 underline">Noticias de Tecnología de los 90s</a></p>
                    <p><a href="#" onclick="navBrowser('heavy')" class="text-blue-700 underline font-bold text-red-700">Portal Web 3D/HD (Carga masiva en RAM +350MB)</a></p>
                </div>
            </div>
        `;
    } else if (page === 'search' || page === 'news') {
        osState.browserExtraRAM = 50;
        urlBar.value = "http://www.buscadorsuper.com/noticias";
        frame.innerHTML = `
            <h2 class="font-bold text-sm text-blue-900 border-b mb-2">Portal de Noticias Tech</h2>
            <p class="mb-2">¡Nuevos módulos de SDRAM prometen eliminar los problemas de intercambio de páginas (swapping)!</p>
            <p class="text-gray-600">Recomendación: Monitoree el Administrador de Tareas si nota ralentizaciones.</p>
        `;
    } else if (page === 'heavy') {
        osState.browserExtraRAM = 350;
        urlBar.value = "http://www.webpesada.com/portal";
        frame.innerHTML = `
            <div class="p-3 bg-red-100 border border-red-400 text-red-900 rounded space-y-2">
                <p class="font-bold text-sm"><i class="fa-solid fa-triangle-exclamation"></i> ¡Cargando portal web pesado con scripts y render 3D!</p>
                <p class="text-xs">Esta pestaña está consumiendo <span class="font-bold">350 MB de RAM adicionales</span>.</p>
                <p class="text-[10px] text-gray-700">Comprueba cómo el sistema empieza a paginar en disco (Swap/PageFaults) si no tienes suficiente memoria física.</p>
            </div>
        `;
        logAuditEvent("Navegador Web cargó un portal pesado (+350 MB de consumo).");
    }
    updateSystemState();
}

let calcState = '';
function calcInput(val) {
    calcState += val;
    document.getElementById('calc-display').value = calcState;
}
function calcClear() {
    calcState = '';
    document.getElementById('calc-display').value = '0';
}
function calcEqual() {
    try {
        calcState = eval(calcState).toString();
        document.getElementById('calc-display').value = calcState;
    } catch(e) {
        document.getElementById('calc-display').value = 'Error';
        calcState = '';
    }
}

function controlPlayer(action) {
    const btn = document.getElementById('btn-player-play');
    if (action === 'play') {
        btn.innerHTML = '<i class="fa-solid fa-pause"></i> Pausa';
        logAuditEvent('Reproductor MP3 en reproducción.');
    } else if (action === 'pause') {
        btn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
    }
}

/* CORE SIMULATION LOOP CON DIRTY CHECKING */
function updateSystemState() {
    const startupRAM = osState.startupApps.filter(a => a.enabled).reduce((sum, a) => sum + a.ram, 0);
    
    let appsRAM = osState.openWindows.reduce((sum, winId) => {
        let appRam = appCatalog[winId] ? appCatalog[winId].ram : 0;
        if (winId === 'win-browser') appRam += osState.browserExtraRAM;
        return sum + appRam;
    }, 0);

    const extraRAM = osState.extraHeavyApps.reduce((sum, a) => sum + a.ram, 0);
    const totalUsedRAM = startupRAM + appsRAM + extraRAM;

    const overflowRAM = Math.max(0, (totalUsedRAM + osState.injectedSwapMB) - osState.totalRAM);
    osState.swapping = overflowRAM > 0 || (totalUsedRAM >= osState.totalRAM * 0.90);
    if (osState.swapping) osState.pageFaults += 1;

    const ramPct = Math.min(100, Math.round((totalUsedRAM / osState.totalRAM) * 100));
    const netApps = osState.startupApps.filter(a => a.enabled).reduce((sum, a) => sum + a.net, 0);

    if (osState.coolingEfficiency < 40 && osState.cpuTemp < 95) {
        osState.cpuTemp = Math.min(105, osState.cpuTemp + 0.3);
    } else if (osState.coolingEfficiency > 70 && osState.cpuTemp > 50) {
        osState.cpuTemp = Math.max(42, osState.cpuTemp - 0.15);
    }
    osState.thermalThrottle = osState.cpuTemp > 85;

    osState.freeDiskGB = Math.max(0, Math.round((osState.diskCapacityGB - osState.diskUsedGB - (osState.junkFilesMB / 1024)) * 10) / 10);

    // Actualización selectiva de métricas principales
    setTextIfChanged('metric-ram', `${ramPct}% (${totalUsedRAM} / ${osState.totalRAM} MB)`);
    setTextIfChanged('metric-frag', `${Math.round(osState.fragmentation)}%`);
    setTextIfChanged('metric-free', `${osState.freeDiskGB} GB`);
    setTextIfChanged('metric-temp', `${Math.round(osState.cpuTemp)}°C${osState.thermalThrottle ? ' ⚠' : ''}`);
    setTextIfChanged('metric-boot', `${osState.bootTimeSec}s`);
    setTextIfChanged('metric-net', osState.networkOk ? `${netApps} KB/s` : 'SIN CONEXIÓN');

    setTextIfChanged('tray-ram-label', `RAM: ${ramPct}%`);
    setTextIfChanged('prop-ram-text', `RAM: ${osState.totalRAM} MB SDRAM`);
    setTextIfChanged('prop-frag-text', `Disco ${osState.diskType}: Frag ${Math.round(osState.fragmentation)}% | Libre ${osState.freeDiskGB} GB`);
    setTextIfChanged('prop-temp-text', `Temperatura: ${Math.round(osState.cpuTemp)}°C | Refrigeración: ${osState.coolingEfficiency}%`);

    const startupCPU = osState.startupApps.filter(a => a.enabled).reduce((sum, a) => sum + a.cpu, 0);
    const appsCPU = osState.openWindows.reduce((sum, id) => sum + (appCatalog[id] ? appCatalog[id].cpu : 0), 0);
    const extraCPU = osState.extraHeavyApps.reduce((sum, a) => sum + a.cpu, 0);
    let cpuLoad = Math.min(100, startupCPU + appsCPU + extraCPU);
    if (osState.thermalThrottle) cpuLoad = Math.min(100, cpuLoad + 15);
    if (osState.swapping) cpuLoad = Math.min(100, cpuLoad + 8);
    osState.lastCpuLoad = cpuLoad;

    let diskActivity = 10;
    if (osState.swapping) diskActivity += 40;
    if (osState.defragging) diskActivity += 35;
    if (osState.fragmentation > 50) diskActivity += 15;
    if (osState.diskType === 'HDD' && osState.bootTimeSec > 70) diskActivity += 10;
    diskActivity = Math.min(100, diskActivity);

    const pushHist = (arr, val) => { arr.push(val); if (arr.length > 20) arr.shift(); };
    pushHist(osState.historyRAM, ramPct);
    pushHist(osState.historyCPU, cpuLoad);
    pushHist(osState.historyTemp, Math.round(osState.cpuTemp));
    pushHist(osState.historyDisk, diskActivity);

    // Sub-renders optimizados condicionalmente por visibilidad de ventana
    renderVirtualMemoryGrids(totalUsedRAM, osState.totalRAM, overflowRAM);
    renderProcessListTable();
    calculateEvaluationScore();
    updateHardwareMonitor(ramPct, cpuLoad, diskActivity);
}

function renderVirtualMemoryGrids(usedRAM, totalRAM, overflowRAM) {
    const win = document.getElementById('win-vmem');
    if (!win || win.classList.contains('hidden')) return;

    const ramContainer = document.getElementById('ram-frames-grid');
    const swapContainer = document.getElementById('swap-frames-grid');
    if (!ramContainer || !swapContainer) return;

    const frameSizeMB = 32;
    const totalRAMFrames = Math.floor(totalRAM / frameSizeMB);
    const usedRAMFrames = Math.min(totalRAMFrames, Math.ceil(usedRAM / frameSizeMB));
    const swapFramesCount = Math.min(24, Math.ceil(overflowRAM / frameSizeMB));
    const isSwapping = osState.swapping;
    const pf = osState.pageFaults;

    const cacheKey = `${usedRAMFrames}_${totalRAMFrames}_${swapFramesCount}_${isSwapping}_${pf}_${usedRAM}_${totalRAM}_${overflowRAM}`;
    if (lastVMemCache === cacheKey) return;
    lastVMemCache = cacheKey;

    ramContainer.innerHTML = '';
    swapContainer.innerHTML = '';

    setTextIfChanged('vmem-ram-capacity', `${totalRAM} MB`);
    setTextIfChanged('vmem-ram-usage-text', `${usedRAM} MB Usados (${usedRAMFrames}/${totalRAMFrames} Marcos)`);

    const ramFrag = document.createDocumentFragment();
    for (let i = 0; i < totalRAMFrames; i++) {
        const frame = document.createElement('div');
        frame.className = "h-6 border flex items-center justify-center text-[9px] font-mono rounded font-bold ";

        if (i < usedRAMFrames) {
            if (isSwapping && i >= totalRAMFrames - 2) {
                frame.className += "bg-red-500 text-white animate-pulse";
                frame.innerText = "FAULT";
            } else {
                frame.className += "bg-blue-600 text-white";
                frame.innerText = `PAG_${i}`;
            }
        } else {
            frame.className += "bg-gray-200 text-gray-500";
            frame.innerText = `LIBRE`;
        }
        ramFrag.appendChild(frame);
    }
    ramContainer.appendChild(ramFrag);

    setTextIfChanged('pf-count', pf);
    setTextIfChanged('vmem-swap-usage-text', `${overflowRAM} MB Paginados a Disco`);

    const swapFrag = document.createDocumentFragment();
    for (let j = 0; j < 24; j++) {
        const frame = document.createElement('div');
        frame.className = "h-5 border flex items-center justify-center text-[8px] font-mono rounded font-bold ";
        if (j < swapFramesCount) {
            frame.className += "bg-amber-600 text-white";
            frame.innerText = `SWAP_${j}`;
        } else {
            frame.className += "bg-amber-100 text-amber-800 border-amber-300";
            frame.innerText = `---`;
        }
        swapFrag.appendChild(frame);
    }
    swapContainer.appendChild(swapFrag);
}

function renderDefragGrid() {
    const container = document.getElementById('defrag-grid-container');
    if (!container) return;
    container.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 160; i++) {
        const block = document.createElement('div');
        block.className = 'h-3.5 w-full rounded-sm ' + (osState.fragmentation > 20 ? (i % 3 === 0 ? 'block-frag' : 'block-used') : 'block-defragging');
        frag.appendChild(block);
    }
    container.appendChild(frag);
}

function runDefragmentation() {
    if (osState.defragging) return;
    if (osState.diskType === 'SSD') {
        alert('La unidad simulada es SSD. No se recomienda desfragmentarla como un HDD; utiliza la optimización/TRIM del sistema.');
        logAuditEvent('[DIAGNÓSTICO] Se evitó desfragmentar una unidad SSD; la acción apropiada sería optimización/TRIM.', { type: 'defrag_ssd_attempt', via: 'gui' });
        return;
    }
    osState.defragging = true;
    const initialFragmentation = osState.fragmentation;
    document.getElementById('defrag-pct-text').innerText = "Procesando...";
    logAuditEvent(`Inició desfragmentación de HDD con ${Math.round(initialFragmentation)}% de fragmentación.`);
    setTimeout(() => {
        osState.defragging = false;
        osState.fragmentation = Math.min(8, Math.round(initialFragmentation * 0.05));
        if (initialFragmentation > 40) {
            osState.bootTimeSec = Math.max(25, Math.round(osState.bootTimeSec * 0.85));
        }
        document.getElementById('defrag-pct-text').innerText = `${osState.fragmentation}% (Optimizado)`;
        renderDefragGrid();
        playSound('done');
        logAuditEvent(`Desfragmentación de HDD completada. Fragmentación: ${Math.round(initialFragmentation)}% → ${osState.fragmentation}%.`, { type: 'defrag_done' });
        updateSystemState();
    }, 3000);
}

function scanJunkFiles() {
    const log = document.getElementById('cleaner-log');
    log.innerHTML += `<p class="text-yellow-300">&gt; Encontrados ${osState.junkFilesMB} MB de temporales y archivos basura.</p>`;
    log.innerHTML += `<p class="text-gray-400">&gt; Espacio libre actual estimado: ${osState.freeDiskGB} GB</p>`;
    logAuditEvent("Escaneo de archivos temporales finalizado.");
}

function cleanJunkFiles() {
    const log = document.getElementById('cleaner-log');
    const recovered = osState.junkFilesMB;
    osState.junkFilesMB = 0;
    osState.diskUsedGB = Math.max(5, osState.diskUsedGB - (recovered / 1024));
    log.innerHTML += `<p class="text-emerald-400">&gt; Limpieza finalizada. Recuperados ~${recovered} MB.</p>`;
    playSound('ok');
    logAuditEvent(`Archivos temporales eliminados por el alumno. Recuperados ${recovered} MB.`, { type: 'clean_junk' });
    updateSystemState();
}

function renderMsconfigList() {
    const container = document.getElementById('msconfig-list-container');
    if (!container) return;
    container.innerHTML = '';
    const frag = document.createDocumentFragment();
    osState.startupApps.forEach(app => {
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-1 bg-gray-100 border rounded";
        row.innerHTML = `
            <label class="font-bold ${app.id==='startup-malware'?'text-red-700':''}"><input type="checkbox" ${app.enabled?'checked':''} onchange="toggleStartup('${app.id}')"> ${app.name}</label>
            <span>${app.ram} MB</span>
        `;
        frag.appendChild(row);
    });
    container.appendChild(frag);
}

function toggleStartup(id) {
    const item = osState.startupApps.find(a => a.id === id);
    if (item) {
        item.enabled = !item.enabled;
        invalidateSimulationCaches();
        if (!item.enabled && (id === 'startup-heavy' || id === 'startup-cloud' || id === 'startup-updater')) {
            osState.bootTimeSec = Math.max(25, osState.bootTimeSec - 18);
        } else if (item.enabled && (id === 'startup-heavy' || id === 'startup-cloud')) {
            osState.bootTimeSec += 18;
        }
        logAuditEvent(`MSConfig: Configuración de inicio modificada para '${item.name}' (Habilitado: ${item.enabled}).`, { type: 'msconfig_toggle', id: item.id, enabled: item.enabled });
        updateSystemState();
    }
}

function renderProcessListTable() {
    const win = document.getElementById('win-taskmgr');
    if (!win || win.classList.contains('hidden')) return;

    const tbody = document.getElementById('proc-table-body');
    if (!tbody) return;

    const enabledStartup = osState.startupApps.filter(a => a.enabled).map(a => `${a.id}:${a.ram}:${a.cpu}:${a.net}`).join('|');
    const openWins = osState.openWindows.join(',');
    const heavy = osState.extraHeavyApps.map(a => `${a.id}:${a.ram}:${a.cpu}`).join('|');
    const key = `${enabledStartup}#${openWins}#${heavy}#${osState.browserExtraRAM}`;

    if (lastProcTableCache === key) return;
    lastProcTableCache = key;

    tbody.innerHTML = '';
    const frag = document.createDocumentFragment();

    // 1. Procesos en Segundo Plano / MSConfig
    osState.startupApps.filter(a => a.enabled).forEach(app => {
        const tr = document.createElement('tr');
        tr.className = "border-b hover:bg-gray-200";
        tr.innerHTML = `
            <td class="p-1 font-bold ${app.id==='startup-malware'?'text-red-700':''}">${app.name} (${app.pid})</td>
            <td class="p-1">${app.ram} MB</td>
            <td class="p-1">${app.cpu}%</td>
            <td class="p-1">${app.net} KB/s</td>
            <td class="p-1 text-right"><button onclick="killStartupApp('${app.id}')" class="win98-btn px-1 text-[10px] text-red-700 font-bold">Terminar</button></td>
        `;
        frag.appendChild(tr);
    });

    // 2. Programas / Ventanas abiertas dinámicamente
    osState.openWindows.forEach(winId => {
        const app = appCatalog[winId];
        if (app) {
            let currentRam = app.ram;
            if (winId === 'win-browser') currentRam += osState.browserExtraRAM;

            const tr = document.createElement('tr');
            tr.className = "border-b hover:bg-gray-200 bg-blue-50";
            tr.innerHTML = `
                <td class="p-1 font-bold text-blue-900">${app.exe} (${app.pid})</td>
                <td class="p-1 font-bold">${currentRam} MB</td>
                <td class="p-1">${app.cpu}%</td>
                <td class="p-1">0 KB/s</td>
                <td class="p-1 text-right"><button onclick="closeWindow('${winId}')" class="win98-btn px-1 text-[10px] text-red-700 font-bold">Cerrar</button></td>
            `;
            frag.appendChild(tr);
        }
    });

    // 3. Procesos pesados
    osState.extraHeavyApps.forEach(app => {
        const tr = document.createElement('tr');
        tr.className = "border-b hover:bg-gray-200 bg-purple-50";
        tr.innerHTML = `
            <td class="p-1 font-bold text-purple-900">${app.name} (${app.pid})</td>
            <td class="p-1 font-bold">${app.ram} MB</td>
            <td class="p-1">${app.cpu}%</td>
            <td class="p-1">${app.net} KB/s</td>
            <td class="p-1 text-right"><button onclick="killExtraHeavyApp('${app.id}')" class="win98-btn px-1 text-[10px] text-red-700 font-bold">Terminar</button></td>
        `;
        frag.appendChild(tr);
    });

    tbody.appendChild(frag);
}

function killStartupApp(id) {
    const app = osState.startupApps.find(a => a.id === id);
    if (app) {
        app.enabled = false;
        invalidateSimulationCaches();
        logAuditEvent(`[ACCION ALUMNO] Finalizó proceso '${app.name}' (PID ${app.pid}) via Administrador de Tareas.`, { type: 'kill_process', id: app.id, pid: app.pid, via: 'taskmgr' });
        renderMsconfigList();
        updateSystemState();
    }
}

function killExtraHeavyApp(id) {
    const index = osState.extraHeavyApps.findIndex(a => a.id === id);
    if (index !== -1) {
        const name = osState.extraHeavyApps[index].name;
        osState.extraHeavyApps.splice(index, 1);
        invalidateSimulationCaches();
        logAuditEvent(`[ACCION ALUMNO] Finalizó proceso pesado '${name}' via Administrador de Tareas.`, { type: 'kill_heavy', name, via: 'taskmgr' });
        updateSystemState();
    }
}

function tryPurchase(cost, label) {
    if (cost <= 0) return true;
    if (osState.budgetTotal > 0) {
        if (cost > osState.budgetRemaining) {
            playSound('error');
            alert(`Presupuesto insuficiente.\n${label} cuesta $${cost} y solo quedan $${osState.budgetRemaining}.`);
            logAuditEvent(`[ACCION ALUMNO] Compra rechazada por presupuesto: ${label} ($${cost}). Disponible: $${osState.budgetRemaining}.`, { type: 'purchase_rejected', label });
            return false;
        }
        osState.budgetRemaining -= cost;
    }
    osState.budgetSpent += cost;
    logAuditEvent(`[ACCION ALUMNO] Compra realizada: ${label} ($${cost}).${osState.budgetTotal > 0 ? ' Presupuesto restante: $' + osState.budgetRemaining + '.' : ''}`);
    return true;
}

function setSystemRAM(mb) {
    if (mb === osState.totalRAM) return;
    const currentPrice = HW_PRICES.ram[osState.totalRAM] || 0;
    const targetPrice = HW_PRICES.ram[mb] || 0;
    const cost = Math.max(0, targetPrice - currentPrice);
    if (!tryPurchase(cost, `RAM ${mb} MB`)) return;
    osState.totalRAM = mb;
    invalidateSimulationCaches();
    if (mb >= 1536 && osState.bootTimeSec > 60) {
        osState.bootTimeSec = Math.max(35, Math.round(osState.bootTimeSec * 0.7));
    }
    playSound('ok');
    logAuditEvent(`[ACCION ALUMNO] Hardware actualizado: Ampliación de RAM física a ${mb} MB.`, { type: 'ram_upgrade', mb });
    updateSystemState();
    updateBudgetDisplay();
}

function upgradeDisk(type) {
    if (type === osState.diskType) return;
    if (type === 'SSD') {
        if (!tryPurchase(HW_PRICES.ssd, 'SSD 120 GB')) return;
        osState.diskType = 'SSD';
        osState.fragmentation = Math.min(osState.fragmentation, 5);
        osState.bootTimeSec = Math.max(18, Math.round(osState.bootTimeSec * 0.45));
        logAuditEvent(`[ACCION ALUMNO] Disco migrado a SSD. Fragmentación ya no es crítica. Tiempo de arranque reducido.`, { type: 'disk_upgrade', to: 'SSD' });
    } else {
        osState.diskType = 'HDD';
        logAuditEvent(`[ACCION ALUMNO] Disco configurado como HDD.`, { type: 'disk_upgrade', to: 'HDD' });
    }
    playSound('ok');
    renderDefragGrid();
    updateSystemState();
    updateBudgetDisplay();
}

function improveCooling() {
    if (!tryPurchase(HW_PRICES.cooling, 'Mantenimiento de refrigeración')) return;
    osState.coolingEfficiency = Math.min(100, osState.coolingEfficiency + 45);
    osState.cpuTemp = Math.max(42, osState.cpuTemp - 25);
    osState.thermalThrottle = false;
    playSound('ok');
    logAuditEvent(`[ACCION ALUMNO] Mantenimiento de refrigeración realizado. Eficiencia: ${osState.coolingEfficiency}%. Temp: ${Math.round(osState.cpuTemp)}°C.`, { type: 'cooling' });
    updateSystemState();
    updateBudgetDisplay();
}

function updateBudgetDisplay() {
    const el = document.getElementById('budget-display');
    if (!el) return;
    if (osState.budgetTotal > 0) {
        el.innerText = `Presupuesto: $${osState.budgetRemaining} disponibles de $${osState.budgetTotal} (gastado: $${osState.budgetSpent})`;
        el.classList.toggle('text-red-700', osState.budgetRemaining < 15);
    } else {
        el.innerText = `Sin límite de presupuesto en este escenario. Gastado: $${osState.budgetSpent}`;
        el.classList.remove('text-red-700');
    }
}

function repairNetwork() {
    osState.networkOk = true;
    osState.networkIssue = null;
    playSound('ok');
    logAuditEvent(`[ACCION ALUMNO] Red reparada (ipconfig /renew + DNS flush simulado).`, { type: 'network_fix' });
    updateSystemState();
}

function calculateEvaluationScore() {
    let score = 100;
    const isMalwareActive = osState.startupApps.find(a => a.id === 'startup-malware' && a.enabled);
    const isHeavyStartup = osState.startupApps.find(a => a.id === 'startup-heavy' && a.enabled);
    const isConflict = osState.startupApps.find(a => a.id === 'startup-conflict' && a.enabled);
    
    if (isMalwareActive) score -= 22;
    if (osState.swapping) score -= 22;
    if (osState.fragmentation > 20) score -= 15;
    if (osState.junkFilesMB > 80 || osState.freeDiskGB < 4) score -= 12;
    if (osState.cpuTemp > 75 || osState.thermalThrottle) score -= 15;
    if (osState.bootTimeSec > 90) score -= 10;
    if (!osState.networkOk) score -= 18;
    if (isHeavyStartup || isConflict) score -= 12;
    if (osState.extraHeavyApps.length > 0) score -= 8;

    score = Math.max(0, Math.min(100, Math.round(score)));
    
    const healthText = document.getElementById('system-health-score');
    const healthFill = document.getElementById('health-bar-fill');
    
    if (healthText && healthFill) {
        setTextIfChanged('system-health-score', `${score}%`);
        healthFill.style.width = `${score}%`;

        if (score >= 80) {
            healthText.className = "font-mono font-bold text-green-600 text-sm";
            healthFill.className = "bg-green-600 h-full transition-all duration-300";
        } else if (score >= 50) {
            healthText.className = "font-mono font-bold text-amber-600 text-sm";
            healthFill.className = "bg-amber-500 h-full transition-all duration-300";
        } else {
            healthText.className = "font-mono font-bold text-red-600 text-sm";
            healthFill.className = "bg-red-600 h-full transition-all duration-300";
        }
    }
}

function handleCmdKey(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('cmd-input');
        const output = document.getElementById('cmd-output');
        const val = input.value.trim();
        
        const p = document.createElement('p');
        p.innerText = `C:\\> ${val}`;
        output.appendChild(p);

        const cmdLower = val.toLowerCase();

        if (cmdLower === 'help') {
            const res = document.createElement('p');
            res.className = "text-gray-400";
            res.innerText = "Comandos: help, tasklist, taskkill /PID <id>, taskkill /IM nombre.exe, kill nombre.exe, mem, defrag, systeminfo, ipconfig, netfix, coolfix, cls";
            output.appendChild(res);
        } else if (cmdLower === 'cls') {
            output.innerHTML = '';
        } else if (cmdLower === 'tasklist') {
            osState.startupApps.filter(a => a.enabled).forEach(app => {
                const res = document.createElement('p');
                res.innerText = `${app.name.padEnd(25)} PID: ${app.pid}   RAM: ${app.ram}MB`;
                output.appendChild(res);
            });
            osState.openWindows.forEach(winId => {
                const app = appCatalog[winId];
                if (app) {
                    const res = document.createElement('p');
                    res.innerText = `${app.exe.padEnd(25)} PID: ${app.pid}   RAM: ${app.ram}MB`;
                    output.appendChild(res);
                }
            });
        } else if (cmdLower.startsWith('taskkill') || cmdLower.startsWith('kill')) {
            const pidMatch = val.match(/(?:\/PID\s+|\bpid\s+)(\d+)/i);
            const nameMatch = val.match(/(?:\/IM\s+|\bkill\s+)([\w.-]+\.exe)/i);
            const targetPid = pidMatch ? Number(pidMatch[1]) : null;
            const targetName = nameMatch ? nameMatch[1].toLowerCase() : (cmdLower.startsWith('kill ') ? val.slice(5).trim().toLowerCase() : null);
            let terminated = false;
            const startupTarget = osState.startupApps.find(a => a.enabled && ((targetPid !== null && a.pid === targetPid) || (targetName && a.name.toLowerCase() === targetName)));
            if (startupTarget) {
                startupTarget.enabled = false;
                terminated = true;
                logAuditEvent(`[ACCION ALUMNO] Proceso finalizado via CMD: ${startupTarget.name} (PID ${startupTarget.pid})`, { type: 'kill_process', id: startupTarget.id, pid: startupTarget.pid, via: 'cmd' });
                renderMsconfigList();
            }
            if (!terminated && targetPid !== null) {
                const heavyIdx = osState.extraHeavyApps.findIndex(a => a.pid === targetPid);
                if (heavyIdx !== -1) {
                    const name = osState.extraHeavyApps[heavyIdx].name;
                    osState.extraHeavyApps.splice(heavyIdx, 1);
                    terminated = true;
                    logAuditEvent(`[ACCION ALUMNO] Proceso pesado finalizado via CMD: ${name}`, { type: 'kill_heavy', name, via: 'cmd' });
                }
            }
            const res = document.createElement('p');
            res.className = terminated ? "text-green-400" : "text-red-400";
            res.innerText = terminated ? `Proceso terminado exitosamente.` : `No se encontró el proceso especificado.`;
            output.appendChild(res);
            invalidateSimulationCaches();
            updateSystemState();
        } else if (cmdLower === 'mem') {
            const res = document.createElement('p');
            res.innerText = `Memoria Total: ${osState.totalRAM} MB | Swap activo: ${osState.swapping ? 'SI' : 'NO'} | Page Faults: ${osState.pageFaults}`;
            output.appendChild(res);
        } else if (cmdLower === 'defrag') {
            runDefragmentation();
            const res = document.createElement('p');
            res.className = "text-yellow-300";
            res.innerText = "Iniciando proceso de desfragmentación desde línea de comandos...";
            output.appendChild(res);
        } else if (cmdLower === 'systeminfo') {
            const res = document.createElement('p');
            res.innerText = `RetroOS 3.0 | RAM: ${osState.totalRAM}MB | Disco: ${osState.diskType} (${osState.freeDiskGB}GB libres) | Temp CPU: ${Math.round(osState.cpuTemp)}°C | Red: ${osState.networkOk ? 'OK' : 'FALLO'}`;
            output.appendChild(res);
        } else if (cmdLower === 'ipconfig' || cmdLower === 'network') {
            const res = document.createElement('p');
            res.className = osState.networkOk ? 'text-green-300' : 'text-red-300';
            res.innerText = osState.networkOk ?
                'Adaptador Ethernet: IP 192.168.1.45 | Máscara 255.255.255.0 | Puerta de enlace 192.168.1.1 | DNS 8.8.8.8 [OK]' :
                `Fallo de red detectado: ${osState.networkIssue || 'desconectado'}. Use 'netfix' para reparar.`;
            output.appendChild(res);
        } else if (cmdLower === 'netfix' || cmdLower === 'repair') {
            if (osState.networkOk) {
                const res = document.createElement('p');
                res.innerText = 'La red ya funciona correctamente.';
                output.appendChild(res);
            } else {
                repairNetwork();
                const res = document.createElement('p');
                res.className = 'text-yellow-300';
                res.innerText = 'Reparación de red completada (ipconfig /renew + flushdns). Conectividad restaurada.';
                output.appendChild(res);
            }
        } else if (cmdLower === 'coolfix' || cmdLower === 'cleanfan') {
            improveCooling();
            const res = document.createElement('p');
            res.className = 'text-yellow-300';
            res.innerText = `Mantenimiento de refrigeración simulado. Eficiencia ahora: ${osState.coolingEfficiency}%. Temp: ${Math.round(osState.cpuTemp)}°C.`;
            output.appendChild(res);
        } else {
            const res = document.createElement('p');
            res.className = "text-red-400";
            res.innerText = `'${val}' no se reconoce como un comando interno o externo.`;
            output.appendChild(res);
        }

        logAuditEvent(`[CMD] Comando ejecutado: "${val}"`, { type: 'cmd_exec', cmd: cmdLower, via: 'cmd' });
        input.value = '';
        output.scrollTop = output.scrollHeight;
    }
}

function renderSparkline(containerId, data, maxVal) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const max = maxVal || Math.max(...data, 1);
    el.innerHTML = data.map(v => {
        const h = Math.max(2, Math.round((v / max) * 36));
        return `<span style="height:${h}px"></span>`;
    }).join('');
}

function updateHardwareMonitor(ramPct, cpuLoad, diskActivity) {
    const win = document.getElementById('win-hwmon');
    if (!win || win.classList.contains('hidden')) return;

    const set = (id, text) => { const e = document.getElementById(id); if (e && e.innerText !== text) e.innerText = text; };
    const setW = (id, pct) => { const e = document.getElementById(id); const s = Math.min(100, pct) + '%'; if (e && e.style.width !== s) e.style.width = s; };

    set('hwmon-ram-pct', ramPct + '%');
    setW('hwmon-ram-bar', ramPct);
    set('hwmon-cpu-pct', Math.round(cpuLoad) + '%');
    setW('hwmon-cpu-bar', cpuLoad);
    set('hwmon-temp', Math.round(osState.cpuTemp) + '°C');
    setW('hwmon-temp-bar', Math.min(100, (osState.cpuTemp / 110) * 100));
    const diskLabel = diskActivity > 70 ? 'Alto' : diskActivity > 35 ? 'Medio' : 'Bajo';
    set('hwmon-disk', diskLabel + ' (' + Math.round(diskActivity) + '%)');
    setW('hwmon-disk-bar', diskActivity);
    set('hwmon-cool', osState.coolingEfficiency + '%');
    setW('hwmon-cool-bar', osState.coolingEfficiency);
    set('hwmon-pf', String(osState.pageFaults));
    const thEl = document.getElementById('hwmon-throttle');
    if (thEl) {
        thEl.innerText = osState.thermalThrottle ? 'SÍ ⚠' : 'No';
        thEl.className = 'font-mono font-bold ' + (osState.thermalThrottle ? 'text-red-700' : 'text-green-700');
    }

    const blades = document.getElementById('fan-blades');
    if (blades) {
        blades.classList.remove('slow', 'fast', 'stopped');
        if (osState.coolingEfficiency < 30) blades.classList.add('stopped');
        else if (osState.cpuTemp > 80 || osState.coolingEfficiency < 50) blades.classList.add('fast');
        else if (osState.cpuTemp < 55) blades.classList.add('slow');
    }

    renderSparkline('spark-ram', osState.historyRAM, 100);
    renderSparkline('spark-cpu', osState.historyCPU, 100);
    renderSparkline('spark-temp', osState.historyTemp, 110);
    renderSparkline('spark-disk', osState.historyDisk, 100);
}

function takeSnapshot() {
    const startupRAM = osState.startupApps.filter(a => a.enabled).reduce((s, a) => s + a.ram, 0);
    const appsRAM = osState.openWindows.reduce((s, id) => s + (appCatalog[id] ? appCatalog[id].ram : 0) + (id === 'win-browser' ? osState.browserExtraRAM : 0), 0);
    const extraRAM = osState.extraHeavyApps.reduce((s, a) => s + a.ram, 0);
    const used = startupRAM + appsRAM + extraRAM;
    const snap = {
        time: new Date().toLocaleTimeString(),
        ram: osState.totalRAM,
        ramUsed: used,
        cpu: osState.lastCpuLoad,
        temp: Math.round(osState.cpuTemp),
        frag: Math.round(osState.fragmentation),
        free: osState.freeDiskGB,
        boot: osState.bootTimeSec,
        cool: osState.coolingEfficiency,
        pf: osState.pageFaults,
        net: osState.networkOk,
        malware: !!osState.startupApps.find(a => a.id === 'startup-malware' && a.enabled),
        health: document.getElementById('system-health-score')?.innerText || '?'
    };
    osState.snapshots.push(snap);
    if (osState.snapshots.length > 4) osState.snapshots.shift();
    renderCompareTable();
    logAuditEvent(`[MONITOR] Snapshot capturado (${snap.time}): RAM ${snap.ramUsed}/${snap.ram} MB, CPU ${snap.cpu}%, Temp ${snap.temp}°C, Salud ${snap.health}`, { type: 'snapshot' });
}

function clearSnapshots() {
    osState.snapshots = [];
    renderCompareTable();
    logAuditEvent('[MONITOR] Snapshots de comparación limpiados.');
}

function renderCompareTable() {
    const container = document.getElementById('compare-table-container');
    if (!container) return;
    if (osState.snapshots.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-2">Capturá un estado inicial y otro después de intervenir para comparar.</p>';
        return;
    }
    if (osState.snapshots.length === 1) {
        const s = osState.snapshots[0];
        container.innerHTML = `<p class="text-[11px] p-1">Estado capturado a las <b>${s.time}</b> — Salud: ${s.health}<br>
            RAM ${s.ramUsed}/${s.ram} MB | CPU ${Math.round(s.cpu)}% | Temp ${s.temp}°C | Frag ${s.frag}% | Libre ${s.free} GB | Boot ${s.boot}s</p>
            <p class="text-gray-500 text-center text-[10px]">Capturá un segundo estado para ver la comparación.</p>`;
        return;
    }
    const a = osState.snapshots[0];
    const b = osState.snapshots[osState.snapshots.length - 1];
    const diff = (va, vb, lowerBetter) => {
        if (va === vb) return '<span class="text-gray-500">=</span>';
        const better = lowerBetter ? (vb < va) : (vb > va);
        const cls = better ? 'compare-better' : 'compare-worse';
        const arrow = better ? '↓' : '↑';
        return `<span class="${cls}">${arrow} ${Math.abs(vb - va)}</span>`;
    };
    container.innerHTML = `
        <table class="w-full text-left">
            <thead><tr class="bg-gray-100"><th class="p-1">Métrica</th><th class="p-1">Antes (${a.time})</th><th class="p-1">Después (${b.time})</th><th class="p-1">Δ</th></tr></thead>
            <tbody>
                <tr class="compare-row"><td>Salud</td><td>${a.health}</td><td>${b.health}</td><td>${diff(parseInt(a.health), parseInt(b.health), false)}</td></tr>
                <tr class="compare-row"><td>RAM usada</td><td>${a.ramUsed} MB</td><td>${b.ramUsed} MB</td><td>${diff(a.ramUsed, b.ramUsed, true)}</td></tr>
                <tr class="compare-row"><td>CPU</td><td>${Math.round(a.cpu)}%</td><td>${Math.round(b.cpu)}%</td><td>${diff(Math.round(a.cpu), Math.round(b.cpu), true)}</td></tr>
                <tr class="compare-row"><td>Temperatura</td><td>${a.temp}°C</td><td>${b.temp}°C</td><td>${diff(a.temp, b.temp, true)}</td></tr>
                <tr class="compare-row"><td>Fragmentación</td><td>${a.frag}%</td><td>${b.frag}%</td><td>${diff(a.frag, b.frag, true)}</td></tr>
                <tr class="compare-row"><td>Espacio libre</td><td>${a.free} GB</td><td>${b.free} GB</td><td>${diff(a.free, b.free, false)}</td></tr>
                <tr class="compare-row"><td>Tiempo arranque</td><td>${a.boot}s</td><td>${b.boot}s</td><td>${diff(a.boot, b.boot, true)}</td></tr>
                <tr class="compare-row"><td>Page Faults</td><td>${a.pf}</td><td>${b.pf}</td><td>${diff(a.pf, b.pf, true)}</td></tr>
                <tr class="compare-row"><td>Refrigeración</td><td>${a.cool}%</td><td>${b.cool}%</td><td>${diff(a.cool, b.cool, false)}</td></tr>
            </tbody>
        </table>`;
}


