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

/** Pinta solo el Panel de Misión (nombre, síntomas y pauta) del escenario. */
function renderScenarioPanel(num) {
    const config = localizedScenario(num);
    if (!config) return;

    const tag = document.getElementById('active-scenario-tag');
    if (tag) tag.innerText = config.name;

    const symptomsUl = document.getElementById('symptoms-list');
    if (symptomsUl) symptomsUl.innerHTML = config.symptoms.map(s => `<li>${s}</li>`).join('');

    const correctionOl = document.getElementById('correction-steps-list');
    if (correctionOl) correctionOl.innerHTML = config.idealSteps.map(step => `<li>${step}</li>`).join('');
}

function loadScenario(num) {
    if (osState.examMode) {
        alert(rt('alert.scenarioLocked', 'Escenarios bloqueados durante el examen.'));
        return;
    }
    osState.currentScenario = num;
    const config = localizedScenario(num);
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

    renderScenarioPanel(num);

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

    logAuditEvent(rtf('log.scenarioChanged', { name: config.name }, `Docente cambió al Escenario ${config.name}.`));
    renderDefragGrid();
    renderMsconfigList();
    updateSystemState();
    logAuditEvent(rtf('log.scenarioInitial', {
        ram: osState.totalRAM,
        disk: osState.diskType,
        frag: osState.fragmentation,
        temp: osState.cpuTemp,
        boot: osState.bootTimeSec,
        free: osState.freeDiskGB
    }, 'Estado inicial del escenario.'));
}

function injectFault(type) {
    playSound('alert');
    invalidateSimulationCaches();
    if (type === 'overheat') {
        osState.cpuTemp = Math.min(105, osState.cpuTemp + 35);
        logAuditEvent(rtf('log.faultOverheat', { temp: osState.cpuTemp }, 'Fallo inyectado: sobrecalentamiento.'));
    } else if (type === 'fillswap') {
        osState.injectedSwapMB += 450;
        logAuditEvent(rt('log.faultSwap', 'Fallo inyectado: swap saturado.'));
    } else if (type === 'launchheavy') {
        const heavyId = 'heavy_' + Date.now();
        osState.extraHeavyApps.push({ id: heavyId, name: 'RenderEngine3D_Benchmark.exe', pid: Math.floor(Math.random()*800)+300, ram: 380, cpu: 40, net: 0 });
        logAuditEvent(rt('log.faultHeavy', 'Fallo inyectado: proceso pesado.'));
    } else if (type === 'malware') {
        const malwareApp = osState.startupApps.find(a => a.id === 'startup-malware');
        if (malwareApp) {
            malwareApp.enabled = true;
            logAuditEvent(rt('log.faultMalware', 'Fallo inyectado: malware.'));
            renderMsconfigList();
        }
    }
    updateSystemState();
}

function runHeavyGame(name, ram) {
    const gameId = 'game_' + Date.now();
    invalidateSimulationCaches();
    osState.extraHeavyApps.push({ id: gameId, name: `${name}.exe`, pid: Math.floor(Math.random()*800)+300, ram: ram, cpu: 35, net: 0 });
    logAuditEvent(rtf('log.gameRun', { name, ram }, `Se ejecutó ${name}.`));
    updateSystemState();
    alert(rtf('alert.gameStarted', { name }, `Iniciando ${name}...`));
}

function toggleCorrectionGuide() {
    const panel = document.getElementById('correction-guide-panel');
    const btn = document.getElementById('btn-toggle-correction');
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> ${rt('ui.correctionHide', 'Ocultar Pauta')}`;
        logAuditEvent(rt('log.correctionShown', 'Docente desplegó la Pauta de Corrección.'));
    } else {
        panel.classList.add('hidden');
        btn.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${rt('ui.correctionShow', 'Ver Pauta')}`;
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
                <h1 class="text-2xl font-bold text-blue-900">${rt('ui.browserHomeTitle', 'BuscadorSúper 98')}</h1>
                <div class="flex justify-center gap-1">
                    <input type="text" placeholder="${rt('ui.browserSearchPlaceholder', 'Buscar en la web...')}" class="border p-1 text-xs w-64">
                    <button onclick="navBrowser('search')" class="win98-btn px-2 font-bold">${rt('ui.browserSearchBtn', 'Buscar')}</button>
                </div>
                <div class="text-left text-xs space-y-1 mt-4">
                    <p class="font-bold border-b">${rt('ui.browserSites', 'Sitios Recomendados:')}</p>
                    <p><a href="#" onclick="navBrowser('news')" class="text-blue-700 underline">${rt('ui.browserNewsLink', 'Noticias de Tecnología')}</a></p>
                    <p><a href="#" onclick="navBrowser('heavy')" class="text-blue-700 underline font-bold text-red-700">${rt('ui.browserHeavyLink', 'Portal Web pesado')}</a></p>
                </div>
            </div>
        `;
    } else if (page === 'search' || page === 'news') {
        osState.browserExtraRAM = 50;
        urlBar.value = "http://www.buscadorsuper.com/noticias";
        frame.innerHTML = `
            <h2 class="font-bold text-sm text-blue-900 border-b mb-2">${rt('ui.browserNewsTitle', 'Portal de Noticias Tech')}</h2>
            <p class="mb-2">${rt('ui.browserNewsBody1', '')}</p>
            <p class="text-gray-600">${rt('ui.browserNewsBody2', '')}</p>
        `;
    } else if (page === 'heavy') {
        osState.browserExtraRAM = 350;
        urlBar.value = "http://www.webpesada.com/portal";
        frame.innerHTML = `
            <div class="p-3 bg-red-100 border border-red-400 text-red-900 rounded space-y-2">
                <p class="font-bold text-sm"><i class="fa-solid fa-triangle-exclamation"></i> ${rt('ui.browserHeavyTitle', '')}</p>
                <p class="text-xs">${rtf('ui.browserHeavyBody1', { mb: 350 }, '')}</p>
                <p class="text-[10px] text-gray-700">${rt('ui.browserHeavyBody2', '')}</p>
            </div>
        `;
        logAuditEvent(rt('log.browserHeavy', 'Navegador Web cargó un portal pesado.'));
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
        btn.innerHTML = `<i class="fa-solid fa-pause"></i> ${rt('ui.playerPause', 'Pausa')}`;
        logAuditEvent(rt('log.playerPlaying', 'Reproductor MP3 en reproducción.'));
    } else if (action === 'pause') {
        btn.innerHTML = `<i class="fa-solid fa-play"></i> ${rt('ui.playerPlay', 'Play')}`;
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
    setTextIfChanged('metric-net', osState.networkOk ? `${netApps} KB/s` : rt('ui.statusNoConnection', 'SIN CONEXIÓN'));

    setTextIfChanged('tray-ram-label', `RAM: ${ramPct}%`);
    setTextIfChanged('prop-ram-text', rtf('ui.propsRam', { mb: osState.totalRAM }, `RAM: ${osState.totalRAM} MB SDRAM`));
    setTextIfChanged('prop-frag-text', rtf('ui.propsDisk', {
        type: osState.diskType,
        frag: Math.round(osState.fragmentation),
        free: osState.freeDiskGB
    }, `Disco ${osState.diskType}: Frag ${Math.round(osState.fragmentation)}% | Libre ${osState.freeDiskGB} GB`));
    setTextIfChanged('prop-temp-text', rtf('ui.propsTemp', {
        temp: Math.round(osState.cpuTemp),
        cool: osState.coolingEfficiency
    }, `Temperatura: ${Math.round(osState.cpuTemp)}°C | Refrigeración: ${osState.coolingEfficiency}%`));

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
    setTextIfChanged('vmem-ram-usage-text', rtf('ui.vmemUsed', {
        used: usedRAM,
        usedFrames: usedRAMFrames,
        totalFrames: totalRAMFrames
    }, `${usedRAM} MB Usados (${usedRAMFrames}/${totalRAMFrames} Marcos)`));

    const ramFrag = document.createDocumentFragment();
    for (let i = 0; i < totalRAMFrames; i++) {
        const frame = document.createElement('div');
        frame.className = "h-6 border flex items-center justify-center text-[9px] font-mono rounded font-bold ";

        if (i < usedRAMFrames) {
            if (isSwapping && i >= totalRAMFrames - 2) {
                frame.className += "bg-red-500 text-white animate-pulse";
                frame.innerText = rt('ui.vmemFaultFrame', 'FAULT');
            } else {
                frame.className += "bg-blue-600 text-white";
                frame.innerText = `PAG_${i}`;
            }
        } else {
            frame.className += "bg-gray-200 text-gray-500";
            frame.innerText = rt('ui.vmemFreeFrame', 'LIBRE');
        }
        ramFrag.appendChild(frame);
    }
    ramContainer.appendChild(ramFrag);

    setTextIfChanged('pf-count', pf);
    setTextIfChanged('vmem-swap-usage-text', rtf('ui.vmemPaged', { mb: overflowRAM }, `${overflowRAM} MB Paginados a Disco`));

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
        alert(rt('alert.ssdDefrag', 'La unidad simulada es SSD. No se recomienda desfragmentarla.'));
        logAuditEvent(rt('log.ssdDefragAvoided', 'Se evitó desfragmentar una unidad SSD.'), { type: 'defrag_ssd_attempt', via: 'gui' });
        return;
    }
    osState.defragging = true;
    const initialFragmentation = osState.fragmentation;
    document.getElementById('defrag-pct-text').innerText = rt('ui.defragProcessing', 'Procesando...');
    logAuditEvent(rtf('log.defragStart', { frag: Math.round(initialFragmentation) }, 'Inició desfragmentación de HDD.'));
    setTimeout(() => {
        osState.defragging = false;
        osState.fragmentation = Math.min(8, Math.round(initialFragmentation * 0.05));
        if (initialFragmentation > 40) {
            osState.bootTimeSec = Math.max(25, Math.round(osState.bootTimeSec * 0.85));
        }
        document.getElementById('defrag-pct-text').innerText = rtf('ui.defragOptimized', { pct: osState.fragmentation }, `${osState.fragmentation}% (Optimizado)`);
        renderDefragGrid();
        playSound('done');
        logAuditEvent(rtf('log.defragDone', { from: Math.round(initialFragmentation), to: osState.fragmentation }, 'Desfragmentación completada.'), { type: 'defrag_done' });
        updateSystemState();
    }, 3000);
}

function scanJunkFiles() {
    const log = document.getElementById('cleaner-log');
    log.innerHTML += `<p class="text-yellow-300">&gt; ${rtf('ui.cleanerFound', { mb: osState.junkFilesMB }, 'Temporales encontrados.')}</p>`;
    log.innerHTML += `<p class="text-gray-400">&gt; ${rtf('ui.cleanerFree', { gb: osState.freeDiskGB }, 'Espacio libre estimado.')}</p>`;
    logAuditEvent(rt('log.cleanerScan', 'Escaneo de archivos temporales finalizado.'));
}

function cleanJunkFiles() {
    const log = document.getElementById('cleaner-log');
    const recovered = osState.junkFilesMB;
    osState.junkFilesMB = 0;
    osState.diskUsedGB = Math.max(5, osState.diskUsedGB - (recovered / 1024));
    log.innerHTML += `<p class="text-emerald-400">&gt; ${rtf('ui.cleanerDone', { mb: recovered }, 'Limpieza finalizada.')}</p>`;
    playSound('ok');
    logAuditEvent(rtf('log.cleanerDone', { mb: recovered }, 'Archivos temporales eliminados.'), { type: 'clean_junk' });
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
        logAuditEvent(rtf('log.msconfigToggle', {
            name: item.name,
            state: item.enabled ? rt('ui.on', 'Habilitado') : rt('ui.off', 'Deshabilitado')
        }, `MSConfig: ${item.name}`), { type: 'msconfig_toggle', id: item.id, enabled: item.enabled });
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
            <td class="p-1 text-right"><button onclick="killStartupApp('${app.id}')" class="win98-btn px-1 text-[10px] text-red-700 font-bold">${rt('ui.taskmgrEnd', 'Terminar')}</button></td>
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
                <td class="p-1 text-right"><button onclick="closeWindow('${winId}')" class="win98-btn px-1 text-[10px] text-red-700 font-bold">${rt('ui.taskmgrClose', 'Cerrar')}</button></td>
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
            <td class="p-1 text-right"><button onclick="killExtraHeavyApp('${app.id}')" class="win98-btn px-1 text-[10px] text-red-700 font-bold">${rt('ui.taskmgrEnd', 'Terminar')}</button></td>
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
        logAuditEvent(rtf('log.killProcess', { name: app.name, pid: app.pid }, `Finalizó proceso '${app.name}'.`), { type: 'kill_process', id: app.id, pid: app.pid, via: 'taskmgr' });
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
        logAuditEvent(rtf('log.killHeavy', { name }, `Finalizó proceso pesado '${name}'.`), { type: 'kill_heavy', name, via: 'taskmgr' });
        updateSystemState();
    }
}

function tryPurchase(cost, label) {
    if (cost <= 0) return true;
    if (osState.budgetTotal > 0) {
        if (cost > osState.budgetRemaining) {
            playSound('error');
            alert(rtf('alert.budgetInsufficient', { label, cost, remaining: osState.budgetRemaining }, 'Presupuesto insuficiente.'));
            logAuditEvent(rtf('log.purchaseRejected', { label, cost, remaining: osState.budgetRemaining }, 'Compra rechazada por presupuesto.'), { type: 'purchase_rejected', label });
            return false;
        }
        osState.budgetRemaining -= cost;
    }
    osState.budgetSpent += cost;
    logAuditEvent(rtf('log.purchase', {
        label,
        cost,
        extra: osState.budgetTotal > 0 ? rtf('log.purchaseRemaining', { remaining: osState.budgetRemaining }, '') : ''
    }, `Compra realizada: ${label}.`));
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
    logAuditEvent(rtf('log.ramUpgrade', { mb }, `RAM ampliada a ${mb} MB.`), { type: 'ram_upgrade', mb });
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
        logAuditEvent(rt('log.diskSSD', 'Disco migrado a SSD.'), { type: 'disk_upgrade', to: 'SSD' });
    } else {
        osState.diskType = 'HDD';
        logAuditEvent(rt('log.diskHDD', 'Disco configurado como HDD.'), { type: 'disk_upgrade', to: 'HDD' });
    }
    playSound('ok');
    renderDefragGrid();
    updateSystemState();
    updateBudgetDisplay();
}

function improveCooling() {
    if (!tryPurchase(HW_PRICES.cooling, rt('ui.shopCooling', 'Mantenimiento de refrigeración'))) return;
    osState.coolingEfficiency = Math.min(100, osState.coolingEfficiency + 45);
    osState.cpuTemp = Math.max(42, osState.cpuTemp - 25);
    osState.thermalThrottle = false;
    playSound('ok');
    logAuditEvent(rtf('log.cooling', {
        eff: osState.coolingEfficiency,
        temp: Math.round(osState.cpuTemp)
    }, 'Mantenimiento de refrigeración realizado.'), { type: 'cooling' });
    updateSystemState();
    updateBudgetDisplay();
}

function updateBudgetDisplay() {
    const el = document.getElementById('budget-display');
    if (!el) return;
    if (osState.budgetTotal > 0) {
        el.innerText = rtf('ui.budgetLimited', {
            remaining: osState.budgetRemaining,
            total: osState.budgetTotal,
            spent: osState.budgetSpent
        }, `Presupuesto: $${osState.budgetRemaining}.`);
        el.classList.toggle('text-red-700', osState.budgetRemaining < 15);
    } else {
        el.innerText = rtf('ui.budgetUnlimited', { spent: osState.budgetSpent }, `Gastado: $${osState.budgetSpent}`);
        el.classList.remove('text-red-700');
    }
}

function repairNetwork() {
    osState.networkOk = true;
    osState.networkIssue = null;
    playSound('ok');
    logAuditEvent(rt('log.networkFix', 'Red reparada.'), { type: 'network_fix' });
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
            res.innerText = rt('cmd.help', 'Comandos disponibles.');
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
                logAuditEvent(rtf('log.killProcessCmd', { name: startupTarget.name, pid: startupTarget.pid }, 'Proceso finalizado via CMD.'), { type: 'kill_process', id: startupTarget.id, pid: startupTarget.pid, via: 'cmd' });
                renderMsconfigList();
            }
            if (!terminated && targetPid !== null) {
                const heavyIdx = osState.extraHeavyApps.findIndex(a => a.pid === targetPid);
                if (heavyIdx !== -1) {
                    const name = osState.extraHeavyApps[heavyIdx].name;
                    osState.extraHeavyApps.splice(heavyIdx, 1);
                    terminated = true;
                    logAuditEvent(rtf('log.killHeavyCmd', { name }, 'Proceso pesado finalizado via CMD.'), { type: 'kill_heavy', name, via: 'cmd' });
                }
            }
            const res = document.createElement('p');
            res.className = terminated ? "text-green-400" : "text-red-400";
            res.innerText = terminated ? rt('cmd.terminated', 'Proceso terminado exitosamente.') : rt('cmd.processNotFound', 'No se encontró el proceso especificado.');
            output.appendChild(res);
            invalidateSimulationCaches();
            updateSystemState();
        } else if (cmdLower === 'mem') {
            const res = document.createElement('p');
            res.innerText = rtf('cmd.mem', {
                ram: osState.totalRAM,
                swap: osState.swapping ? rt('ui.statusYes', 'SI') : rt('ui.statusNo', 'NO'),
                pf: osState.pageFaults
            }, `Memoria Total: ${osState.totalRAM} MB.`);
            output.appendChild(res);
        } else if (cmdLower === 'defrag') {
            runDefragmentation();
            const res = document.createElement('p');
            res.className = "text-yellow-300";
            res.innerText = rt('cmd.defragStart', 'Iniciando desfragmentación...');
            output.appendChild(res);
        } else if (cmdLower === 'systeminfo') {
            const res = document.createElement('p');
            res.innerText = rtf('cmd.systeminfo', {
                ram: osState.totalRAM,
                disk: osState.diskType,
                free: osState.freeDiskGB,
                temp: Math.round(osState.cpuTemp),
                net: osState.networkOk ? rt('ui.statusOk', 'OK') : rt('ui.statusFail', 'FALLO')
            }, 'RetroOS 3.0 | systeminfo');
            output.appendChild(res);
        } else if (cmdLower === 'ipconfig' || cmdLower === 'network') {
            const res = document.createElement('p');
            res.className = osState.networkOk ? 'text-green-300' : 'text-red-300';
            res.innerText = osState.networkOk ?
                rt('cmd.ipconfigOk', 'Adaptador Ethernet [OK]') :
                rtf('cmd.ipconfigFail', { issue: osState.networkIssue || rt('ui.disconnected', 'desconectado') }, 'Fallo de red detectado.');
            output.appendChild(res);
        } else if (cmdLower === 'netfix' || cmdLower === 'repair') {
            if (osState.networkOk) {
                const res = document.createElement('p');
                res.innerText = rt('cmd.netOk', 'La red ya funciona correctamente.');
                output.appendChild(res);
            } else {
                repairNetwork();
                const res = document.createElement('p');
                res.className = 'text-yellow-300';
                res.innerText = rt('cmd.netFixed', 'Reparación de red completada.');
                output.appendChild(res);
            }
        } else if (cmdLower === 'coolfix' || cmdLower === 'cleanfan') {
            improveCooling();
            const res = document.createElement('p');
            res.className = 'text-yellow-300';
            res.innerText = rtf('cmd.coolfix', {
                eff: osState.coolingEfficiency,
                temp: Math.round(osState.cpuTemp)
            }, 'Mantenimiento de refrigeración simulado.');
            output.appendChild(res);
        } else {
            const res = document.createElement('p');
            res.className = "text-red-400";
            res.innerText = rtf('cmd.notFound', { cmd: val }, `'${val}' no se reconoce como un comando.`);
            output.appendChild(res);
        }

        logAuditEvent(rtf('log.cmdExec', { cmd: val }, `[CMD] ${val}`), { type: 'cmd_exec', cmd: cmdLower, via: 'cmd' });
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
    const diskLabel = diskActivity > 70 ? rt('ui.hwmonHigh', 'Alto') : diskActivity > 35 ? rt('ui.hwmonMedium', 'Medio') : rt('ui.hwmonLow', 'Bajo');
    set('hwmon-disk', diskLabel + ' (' + Math.round(diskActivity) + '%)');
    setW('hwmon-disk-bar', diskActivity);
    set('hwmon-cool', osState.coolingEfficiency + '%');
    setW('hwmon-cool-bar', osState.coolingEfficiency);
    set('hwmon-pf', String(osState.pageFaults));
    const thEl = document.getElementById('hwmon-throttle');
    if (thEl) {
        thEl.innerText = osState.thermalThrottle ? rt('ui.hwmonYes', 'SÍ ⚠') : rt('ui.hwmonNo', 'No');
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
    logAuditEvent(rtf('log.snapshot', {
        time: snap.time,
        ramUsed: snap.ramUsed,
        ram: snap.ram,
        cpu: snap.cpu,
        temp: snap.temp,
        health: snap.health
    }, 'Snapshot capturado.'), { type: 'snapshot' });
}

function clearSnapshots() {
    osState.snapshots = [];
    renderCompareTable();
    logAuditEvent(rt('log.snapshotsCleared', 'Snapshots de comparación limpiados.'));
}

function renderCompareTable() {
    const container = document.getElementById('compare-table-container');
    if (!container) return;
    if (osState.snapshots.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-2">${rt('ui.compareEmpty', 'Capturá un estado para comparar.')}</p>`;
        return;
    }
    if (osState.snapshots.length === 1) {
        const s = osState.snapshots[0];
        container.innerHTML = `<p class="text-[11px] p-1">${rtf('ui.compareOne', {
            time: s.time,
            health: s.health,
            ramUsed: s.ramUsed,
            ram: s.ram,
            cpu: Math.round(s.cpu),
            temp: s.temp,
            frag: s.frag,
            free: s.free,
            boot: s.boot
        }, 'Estado capturado.')}</p>
            <p class="text-gray-500 text-center text-[10px]">${rt('ui.compareSecond', 'Capturá un segundo estado.')}</p>`;
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
            <thead><tr class="bg-gray-100"><th class="p-1">${rt('ui.compareMetric', 'Métrica')}</th><th class="p-1">${rtf('ui.compareBefore', { time: a.time }, 'Antes')}</th><th class="p-1">${rtf('ui.compareAfter', { time: b.time }, 'Después')}</th><th class="p-1">${rt('ui.compareDelta', 'Δ')}</th></tr></thead>
            <tbody>
                <tr class="compare-row"><td>${rt('ui.compareHealth', 'Salud')}</td><td>${a.health}</td><td>${b.health}</td><td>${diff(parseInt(a.health), parseInt(b.health), false)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareRamUsed', 'RAM usada')}</td><td>${a.ramUsed} MB</td><td>${b.ramUsed} MB</td><td>${diff(a.ramUsed, b.ramUsed, true)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareCpu', 'CPU')}</td><td>${Math.round(a.cpu)}%</td><td>${Math.round(b.cpu)}%</td><td>${diff(Math.round(a.cpu), Math.round(b.cpu), true)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareTemp', 'Temperatura')}</td><td>${a.temp}°C</td><td>${b.temp}°C</td><td>${diff(a.temp, b.temp, true)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareFrag', 'Fragmentación')}</td><td>${a.frag}%</td><td>${b.frag}%</td><td>${diff(a.frag, b.frag, true)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareFree', 'Espacio libre')}</td><td>${a.free} GB</td><td>${b.free} GB</td><td>${diff(a.free, b.free, false)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareBoot', 'Tiempo arranque')}</td><td>${a.boot}s</td><td>${b.boot}s</td><td>${diff(a.boot, b.boot, true)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.comparePf', 'Page Faults')}</td><td>${a.pf}</td><td>${b.pf}</td><td>${diff(a.pf, b.pf, true)}</td></tr>
                <tr class="compare-row"><td>${rt('ui.compareCool', 'Refrigeración')}</td><td>${a.cool}%</td><td>${b.cool}%</td><td>${diff(a.cool, b.cool, false)}</td></tr>
            </tbody>
        </table>`;
}

/**
 * Vuelve a pintar los textos de ejecución que ya están en pantalla cuando se
 * cambia de idioma. Los números y el estado no se tocan.
 */
function refreshRuntimeTexts() {
    renderScenarioPanel(osState.currentScenario);
    invalidateSimulationCaches();
    renderTaskbarTabs();
    renderMsconfigList();
    renderCompareTable();
    updateBudgetDisplay();
    updateSystemState();
    renderExamStudentsList();
    if (typeof currentHelpTab !== 'undefined') showHelpTab(currentHelpTab);
    if (osState.examMode) showExamBanner(true);
    document.querySelectorAll('.win-resize-grip').forEach(grip => {
        grip.title = rt('ui.resizeGrip', 'Arrastrar para cambiar el tamaño');
    });
}


