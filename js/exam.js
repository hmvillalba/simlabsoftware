// js/exam.js - Lógica del modo examen, evaluación automática, rúbricas y exportación (PDF, CSV, TXT)

function setExamDifficulty(level) {
    osState.examDifficulty = Number(level);
    const panel = document.getElementById('correction-guide-panel');
    const btn = document.getElementById('btn-toggle-correction');
    if (osState.examDifficulty === 1) {
        if (panel) panel.classList.remove('hidden');
        if (btn) btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> ${rt('ui.correctionHide', 'Ocultar Pauta')}`;
    } else if (osState.examDifficulty === 3) {
        if (panel) panel.classList.add('hidden');
        if (btn) btn.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${rt('ui.correctionShow', 'Ver Pauta')}`;
    }
    logAuditEvent(rtf('log.difficulty', { level: osState.examDifficulty }, `Nivel de dificultad: ${osState.examDifficulty}`));
}

function setScenarioButtonsLocked(locked) {
    for (let i = 1; i <= 12; i++) {
        const btn = document.getElementById(`btn-scen-${i}`);
        if (btn) {
            btn.disabled = locked;
            btn.style.opacity = locked ? '0.45' : '1';
            btn.style.pointerEvents = locked ? 'none' : 'auto';
            btn.title = locked ? rt('ui.lockedDuringExam', 'Bloqueado durante el examen') : '';
        }
    }
    const diffSel = document.getElementById('exam-difficulty');
    if (diffSel) diffSel.disabled = locked;
}

function getExamStudentsLabel() {
    const list = osState.examStudents || [];
    if (list.length === 0) return '—';
    if (list.length === 1) return list[0];
    return list.join(' · ') + ' ' + rtf('ui.studentsCount', { n: list.length }, `(${list.length} alumnos)`);
}

function getExamGroupLabel() {
    const parts = [];
    if (osState.examCourse) parts.push(osState.examCourse);
    if (osState.examDivision) parts.push(rtf('ui.groupDiv', { div: osState.examDivision }, 'Div. ' + osState.examDivision));
    return parts.length ? parts.join(' ') : '';
}

function renderExamStudentsList() {
    const el = document.getElementById('exam-students-list');
    if (!el) return;
    if (!osState.examStudents.length) {
        el.innerHTML = `<span class="text-gray-400">${rt('ui.studentsNone', 'Ningún alumno agregado')}</span>`;
        return;
    }
    el.innerHTML = osState.examStudents.map((name, i) =>
        `<span class="inline-flex items-center gap-1 bg-indigo-100 border border-indigo-300 px-1.5 py-0.5 rounded">
            <i class="fa-solid fa-user text-indigo-700"></i> ${name}
            <button type="button" onclick="removeExamStudent(${i})" class="text-red-700 font-bold leading-none ${osState.examMode ? 'hidden' : ''}" title="${rt('ui.studentsRemove', 'Quitar')}">×</button>
        </span>`
    ).join('');
}

function addExamStudent() {
    if (osState.examMode) {
        alert(rt('alert.examNoAddStudents', 'No se pueden agregar alumnos durante el examen.'));
        return;
    }
    const input = document.getElementById('exam-student-name');
    const name = (input ? input.value : '').trim();
    if (!name) {
        alert(rt('alert.examStudentName', 'Escribí el nombre del alumno.'));
        if (input) input.focus();
        return;
    }
    if (osState.examStudents.some(s => s.toLowerCase() === name.toLowerCase())) {
        alert(rt('alert.examStudentDuplicate', 'Ese alumno ya está en la lista.'));
        return;
    }
    if (osState.examStudents.length >= 8) {
        alert(rt('alert.examStudentMax', 'Máximo 8 alumnos por examen grupal.'));
        return;
    }
    osState.examStudents.push(name);
    osState.examStudentName = osState.examStudents.join(', ');
    if (input) { input.value = ''; input.focus(); }
    renderExamStudentsList();
}

function removeExamStudent(index) {
    if (osState.examMode) return;
    osState.examStudents.splice(index, 1);
    osState.examStudentName = osState.examStudents.join(', ');
    renderExamStudentsList();
}

function setExamFormLocked(locked) {
    ['exam-student-name', 'exam-course', 'exam-division', 'exam-difficulty'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = locked;
    });
    const addBtn = document.getElementById('btn-add-student');
    if (addBtn) addBtn.disabled = locked;
    renderExamStudentsList();
}

function showExamBanner(show) {
    const banner = document.getElementById('exam-banner');
    const info = document.getElementById('exam-banner-info');
    if (!banner) return;
    if (show) {
        banner.classList.remove('hidden');
        if (info) {
            const group = getExamGroupLabel();
            const names = getExamStudentsLabel();
            info.innerText = rtf('ui.examBanner', {
                group: group ? group + ' · ' : '',
                names,
                scenario: osState.currentScenario,
                level: osState.examDifficulty
            }, `${names} · Esc. ${osState.currentScenario} · Nv ${osState.examDifficulty}`);
        }
    } else {
        banner.classList.add('hidden');
    }
}

function startExamMode() {
    if (osState.mustChangePass) {
        alert(rt('alert.examChangePass', 'Cambiá la clave inicial del docente antes de iniciar un examen.'));
        return;
    }
    if (osState.examMode) {
        alert(rt('alert.examAlreadyRunning', 'Ya hay un examen en curso.'));
        return;
    }
    const nameInput = document.getElementById('exam-student-name');
    const pending = (nameInput ? nameInput.value : '').trim();
    if (pending && osState.examStudents.length === 0) {
        osState.examStudents.push(pending);
        if (nameInput) nameInput.value = '';
        renderExamStudentsList();
    }
    if (osState.examStudents.length === 0) {
        alert(rt('alert.examNeedStudent', 'Agregá al menos un alumno antes de iniciar el examen.'));
        if (nameInput) nameInput.focus();
        return;
    }
    const courseEl = document.getElementById('exam-course');
    const divEl = document.getElementById('exam-division');
    osState.examCourse = (courseEl ? courseEl.value : '').trim();
    osState.examDivision = (divEl ? divEl.value : '').trim();
    osState.examStudentName = osState.examStudents.join(', ');

    const healthEl = document.getElementById('system-health-score');
    osState.examMode = true;
    osState.examStartTime = new Date();
    osState.examStartHealth = healthEl ? parseInt(healthEl.innerText) || 0 : 0;
    osState.examActions = [];
    osState.examScore = null;
    osState.examReport = null;
    osState.examStartSnapshot = captureExamSnapshot();

    document.getElementById('btn-start-exam').classList.add('hidden');
    document.getElementById('btn-end-exam').classList.remove('hidden');
    document.getElementById('btn-cancel-exam').classList.remove('hidden');
    setExamFormLocked(true);

    const statusBar = document.getElementById('exam-status-bar');
    statusBar.classList.remove('hidden');
    const group = getExamGroupLabel();
    document.getElementById('exam-status-text').innerText = rtf('ui.examStatusRunning', {
        group: group ? group + ' · ' : '',
        students: getExamStudentsLabel(),
        scenario: osState.currentScenario,
        level: osState.examDifficulty,
        health: osState.examStartHealth
    }, 'EXAMEN EN CURSO.');
    document.getElementById('exam-results-panel').classList.add('hidden');

    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.add('hidden');
    showExamBanner(true);
    startExamTimer();
    setScenarioButtonsLocked(true);
    setExamDifficulty(osState.examDifficulty);

    logAuditEvent(rtf('log.examStarted', {
        course: osState.examCourse || '—',
        division: osState.examDivision || '—',
        students: osState.examStudentName,
        scenario: osState.currentScenario
    }, 'Examen iniciado.'));
    alert(rtf('alert.examStarted', {
        group: group ? rt('ui.examCourseDiv', 'Curso/Div: ') + group + '\n' : '',
        students: osState.examStudents.join('\n• ')
    }, 'Modo Examen activado.'));
}

function cancelExamMode() {
    if (!osState.examMode) {
        alert(rt('alert.examNoRunning', 'No hay examen en curso.'));
        return;
    }
    if (!confirm(rt('alert.examCancelConfirm', '¿Cancelar el examen sin evaluar?'))) {
        return;
    }
    osState.examMode = false;
    clearExamSession();
    osState.examActions = [];
    osState.examScore = null;
    stopExamTimer();

    document.getElementById('btn-start-exam').classList.remove('hidden');
    document.getElementById('btn-end-exam').classList.add('hidden');
    document.getElementById('btn-cancel-exam').classList.add('hidden');
    setExamFormLocked(false);
    document.getElementById('exam-status-text').innerText = rt('ui.examStatusCancelled', 'Examen cancelado.');
    document.getElementById('exam-results-panel').classList.add('hidden');

    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.remove('hidden');
    showExamBanner(false);
    setScenarioButtonsLocked(false);

    logAuditEvent(rtf('log.examCancelled', { students: osState.examStudentName || '—' }, 'Examen cancelado.'));
    alert(rt('alert.examCancelled', 'Examen cancelado.'));
}

function captureExamSnapshot() {
    const startupRAM = osState.startupApps.filter(a => a.enabled).reduce((s, a) => s + a.ram, 0);
    const appsRAM = osState.openWindows.reduce((s, id) => s + (appCatalog[id] ? appCatalog[id].ram : 0) + (id === 'win-browser' ? osState.browserExtraRAM : 0), 0);
    const extraRAM = osState.extraHeavyApps.reduce((s, a) => s + a.ram, 0);
    const used = startupRAM + appsRAM + extraRAM;
    return {
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
        heavyStartup: !!osState.startupApps.find(a => a.id === 'startup-heavy' && a.enabled),
        conflict: !!osState.startupApps.find(a => a.id === 'startup-conflict' && a.enabled),
        junk: osState.junkFilesMB,
        diskType: osState.diskType,
        swapping: osState.swapping,
        throttle: osState.thermalThrottle,
        health: document.getElementById('system-health-score')?.innerText || '0%'
    };
}

function evaluateExamCriteria(start, end) {
    const criteria = [];
    let points = 0;
    let maxPoints = 0;
    const startH = parseInt(start.health) || 0;
    const endH = parseInt(end.health) || 0;

    const acts = osState.examActions;
    const opened = (id) => acts.some(a => a.type === 'open_window' && a.id === id);
    const ranCmd = (re) => acts.some(a => a.type === 'cmd_exec' && re.test(a.cmd || ''));
    const DIAG_WINDOWS = ['win-taskmgr', 'win-vmem', 'win-hwmon', 'win-sysprops'];
    const isDiagAction = (a) =>
        (a.type === 'open_window' && DIAG_WINDOWS.includes(a.id)) ||
        (a.type === 'cmd_exec' && /^(tasklist|systeminfo)\b/.test(a.cmd || ''));
    const FIX_TYPES = ['kill_process', 'kill_heavy', 'defrag_done', 'clean_junk', 'ram_upgrade', 'disk_upgrade', 'cooling', 'network_fix', 'msconfig_toggle'];
    const isFixAction = (a) => FIX_TYPES.includes(a.type);

    // 1. Salud general
    maxPoints += 15;
    if (endH >= 85) {
        points += 15;
        criteria.push({ name: rt('exam.crit.healthHigh', 'Salud del sistema ≥ 85%'), ok: true, detail: rtf('exam.crit.healthRange', { start: startH, end: endH }, `${startH}% → ${endH}%`) });
    } else if (endH > startH + 15) {
        points += 10;
        criteria.push({ name: rt('exam.crit.healthNotable', 'Salud del sistema mejoró notablemente'), ok: true, detail: rtf('exam.crit.healthImproved', { start: startH, end: endH, delta: endH - startH }, `${startH}% → ${endH}%`) });
    } else if (endH > startH) {
        points += 5;
        criteria.push({ name: rt('exam.crit.healthSlight', 'Salud del sistema mejoró levemente'), ok: true, detail: rtf('exam.crit.healthRange', { start: startH, end: endH }, `${startH}% → ${endH}%`) });
    } else {
        criteria.push({ name: rt('exam.crit.healthBase', 'Salud del sistema'), ok: false, detail: rtf('exam.crit.healthNoImprove', { start: startH, end: endH }, `${startH}% → ${endH}%`) });
    }

    // 2. Malware
    if (start.malware) {
        maxPoints += 15;
        if (!end.malware) {
            points += 15;
            criteria.push({ name: rt('exam.crit.malware', 'Malware eliminado'), ok: true, detail: rt('exam.crit.malwareKilled', 'svchost_fake.exe finalizado') });
        } else {
            criteria.push({ name: rt('exam.crit.malware', 'Malware eliminado'), ok: false, detail: rt('exam.crit.malwareActive', 'Sigue activo') });
        }
        maxPoints += 8;
        const disabledInMsconfig = acts.some(a =>
            a.type === 'msconfig_toggle' && a.id === 'startup-malware' && a.enabled === false
        );
        if (!end.malware && disabledInMsconfig) {
            points += 8;
            criteria.push({ name: rt('exam.crit.persist', 'Persistencia del malware eliminada'), ok: true, detail: rt('exam.crit.persistDisabled', 'Deshabilitado al inicio') });
        } else if (!end.malware) {
            points += 3;
            criteria.push({ name: rt('exam.crit.persist', 'Persistencia del malware eliminada'), ok: false, detail: rt('exam.crit.persistNotDisabled', 'Proceso muerto pero no deshabilitado') });
        } else {
            criteria.push({ name: rt('exam.crit.persist', 'Persistencia del malware eliminada'), ok: false, detail: rt('exam.crit.persistNotFixed', 'No corregido') });
        }
    }

    // 3. Memoria / thrashing
    if (start.swapping || start.ramUsed > start.ram * 0.85) {
        maxPoints += 12;
        if (!end.swapping && end.ramUsed < end.ram * 0.8) {
            points += 12;
            criteria.push({ name: rt('exam.crit.memory', 'Presión de memoria resuelta'), ok: true, detail: rtf('exam.crit.memoryResolved', { used: end.ramUsed, total: end.ram }, `RAM ${end.ramUsed}/${end.ram} MB`) });
        } else {
            criteria.push({ name: rt('exam.crit.memory', 'Presión de memoria resuelta'), ok: false, detail: end.swapping ? rt('exam.crit.memorySwap', 'Sigue en swap') : rtf('exam.crit.memoryRam', { used: end.ramUsed, total: end.ram }, `RAM ${end.ramUsed}/${end.ram} MB`) });
        }
        if (start.ram <= 512) {
            maxPoints += 8;
            if (end.ram >= 1536) {
                points += 8;
                criteria.push({ name: rt('exam.crit.ramUpgrade', 'Ampliación de RAM adecuada'), ok: true, detail: rtf('exam.crit.ramUpgradeDetail', { start: start.ram, end: end.ram }, `${start.ram} → ${end.ram} MB`) });
            } else {
                criteria.push({ name: rt('exam.crit.ramUpgrade', 'Ampliación de RAM adecuada'), ok: false, detail: rtf('exam.crit.ramStill', { end: end.ram }, `Sigue en ${end.ram} MB`) });
            }
        }
    }

    // 4. Page Faults controlados
    maxPoints += 6;
    if (end.pf <= start.pf + 5 || !end.swapping) {
        points += 6;
        criteria.push({ name: rt('exam.crit.pf', 'Page Faults controlados'), ok: true, detail: rtf('exam.crit.pfOk', { start: start.pf, end: end.pf }, `PF ${start.pf} → ${end.pf}`) });
    } else {
        criteria.push({ name: rt('exam.crit.pf', 'Page Faults controlados'), ok: false, detail: rtf('exam.crit.pfBad', { end: end.pf }, 'PF siguen subiendo') });
    }

    // 5. Fragmentación / disco
    if (start.frag > 20 && start.diskType === 'HDD') {
        maxPoints += 10;
        const fragDetail = rtf('exam.crit.fragDetail', { start: start.frag, end: end.frag }, `${start.frag}% → ${end.frag}%`);
        if (end.frag <= 12) {
            points += 10;
            criteria.push({ name: rt('exam.crit.frag', 'Fragmentación de HDD corregida'), ok: true, detail: fragDetail });
        } else {
            criteria.push({ name: rt('exam.crit.frag', 'Fragmentación de HDD corregida'), ok: false, detail: fragDetail });
        }
    }
    if (start.diskType === 'HDD' && start.frag > 30) {
        maxPoints += 5;
        if (end.diskType === 'SSD') {
            points += 5;
            criteria.push({ name: rt('exam.crit.ssd', 'Migración a SSD (opcional)'), ok: true, detail: rt('exam.crit.ssdOk', 'HDD → SSD') });
        } else {
            criteria.push({ name: rt('exam.crit.ssd', 'Migración a SSD (opcional)'), ok: false, detail: rt('exam.crit.ssdNo', 'Sigue en HDD') });
        }
    }

    // 6. Temperatura / refrigeración
    if (start.temp > 70 || start.throttle || start.cool < 50) {
        maxPoints += 12;
        if (end.temp <= 65 && !end.throttle) {
            points += 12;
            criteria.push({ name: rt('exam.crit.temp', 'Temperatura y refrigeración normalizadas'), ok: true, detail: rtf('exam.crit.tempOk', { start: start.temp, end: end.temp, cool: end.cool }, `${start.temp}°C → ${end.temp}°C`) });
        } else {
            criteria.push({ name: rt('exam.crit.temp', 'Temperatura y refrigeración normalizadas'), ok: false, detail: rtf('exam.crit.tempDetail', { start: start.temp, end: end.temp }, `${start.temp}°C → ${end.temp}°C`) });
        }
    }

    // 7. Espacio en disco
    if (start.junk > 80 || start.free < 5) {
        maxPoints += 10;
        if (end.junk < 40 && end.free > start.free) {
            points += 10;
            criteria.push({ name: rt('exam.crit.disk', 'Espacio en disco recuperado'), ok: true, detail: rtf('exam.crit.diskOk', { start: start.free, end: end.free }, `Libre ${start.free} → ${end.free} GB`) });
        } else {
            criteria.push({ name: rt('exam.crit.disk', 'Espacio en disco recuperado'), ok: false, detail: rtf('exam.crit.diskBad', { end: end.free, junk: end.junk }, `Libre ${end.free} GB`) });
        }
    }

    // 8. Red
    if (!start.net) {
        maxPoints += 12;
        if (end.net) {
            points += 12;
            criteria.push({ name: rt('exam.crit.net', 'Conectividad de red restaurada'), ok: true, detail: rt('exam.crit.netOk', 'Red OK') });
        } else {
            criteria.push({ name: rt('exam.crit.net', 'Conectividad de red restaurada'), ok: false, detail: rt('exam.crit.netBad', 'Sigue sin conexión') });
        }
    }

    // 9. Inicio del sistema
    if (start.heavyStartup || start.conflict || start.boot > 90) {
        maxPoints += 10;
        const bootImproved = end.boot < start.boot - 15;
        const appsClean = !end.heavyStartup && !end.conflict;
        if (appsClean && bootImproved) {
            points += 10;
            criteria.push({ name: rt('exam.crit.boot', 'Inicio optimizado'), ok: true, detail: rtf('exam.crit.bootDetail', { start: start.boot, end: end.boot }, `Boot ${start.boot}s → ${end.boot}s`) });
        } else if (appsClean || bootImproved) {
            points += 5;
            criteria.push({ name: rt('exam.crit.bootPartial', 'Inicio parcialmente optimizado'), ok: true, detail: rtf('exam.crit.bootDetail', { start: start.boot, end: end.boot }, `Boot ${end.boot}s`) });
        } else {
            criteria.push({ name: rt('exam.crit.boot', 'Inicio optimizado'), ok: false, detail: rtf('exam.crit.bootDetailPartial', { boot: end.boot }, `Boot ${end.boot}s`) });
        }
    }

    // 10. Procesos pesados
    const killedHeavy = acts.some(a => a.type === 'kill_heavy');
    if (start.cpu > 50 || (osState.extraHeavyApps.length === 0 && killedHeavy)) {
        maxPoints += 6;
        if (end.cpu < 45 || killedHeavy) {
            points += 6;
            criteria.push({ name: rt('exam.crit.heavy', 'Procesos pesados controlados'), ok: true, detail: rtf('exam.crit.heavyOk', { cpu: Math.round(end.cpu) }, `CPU ~${Math.round(end.cpu)}%`) });
        } else {
            criteria.push({ name: rt('exam.crit.heavy', 'Procesos pesados controlados'), ok: false, detail: rtf('exam.crit.heavyBad', { cpu: Math.round(end.cpu) }, `CPU ~${Math.round(end.cpu)}%`) });
        }
    }

    // 11. Herramientas de diagnóstico
    maxPoints += 12;
    const usedTaskMgr = opened('win-taskmgr') || ranCmd(/\b(tasklist|taskmgr)\b/);
    const usedVmem = opened('win-vmem');
    const usedHwmon = opened('win-hwmon');
    const usedCmd = acts.some(a => a.via === 'cmd');
    const usedSysprops = opened('win-sysprops');
    const usedMsconfig = opened('win-msconfig') || acts.some(a => a.type === 'msconfig_toggle');
    const diagList = [];
    if (usedTaskMgr) diagList.push('TaskMgr');
    if (usedVmem) diagList.push('VMem');
    if (usedHwmon) diagList.push('MonitorHW');
    if (usedCmd) diagList.push('CMD');
    if (usedSysprops) diagList.push('Propiedades');
    if (usedMsconfig) diagList.push('MSConfig');
    const diagCount = diagList.length;
    if (diagCount >= 3) {
        points += 12;
        criteria.push({ name: rt('exam.crit.diag', 'Uso de herramientas de diagnóstico'), ok: true, detail: rtf('exam.crit.diagOk', { n: diagCount, tools: diagList.join(', ') }, `${diagCount} herramientas`) });
    } else if (diagCount >= 2) {
        points += 8;
        criteria.push({ name: rt('exam.crit.diag', 'Uso de herramientas de diagnóstico'), ok: true, detail: rtf('exam.crit.diagOk', { n: diagCount, tools: diagList.join(', ') }, `${diagCount} herramientas`) });
    } else if (diagCount === 1) {
        points += 4;
        criteria.push({ name: rt('exam.crit.diag', 'Uso de herramientas de diagnóstico'), ok: true, detail: rtf('exam.crit.diagSome', { tool: diagList[0] }, `Solo: ${diagList[0]}`) });
    } else {
        criteria.push({ name: rt('exam.crit.diag', 'Uso de herramientas de diagnóstico'), ok: false, detail: rt('exam.crit.diagNone', 'No se usaron herramientas de diagnóstico') });
    }

    // 12. Diagnóstico antes de reparar
    maxPoints += 8;
    const firstDiagIdx = acts.findIndex(isDiagAction);
    const firstFixIdx = acts.findIndex(isFixAction);
    if (firstDiagIdx >= 0 && (firstFixIdx < 0 || firstDiagIdx < firstFixIdx)) {
        points += 8;
        criteria.push({ name: rt('exam.crit.before', 'Diagnóstico antes de intervenir'), ok: true, detail: rt('exam.crit.beforeOk', 'Observó el sistema antes de reparar') });
    } else if (firstDiagIdx >= 0) {
        points += 3;
        criteria.push({ name: rt('exam.crit.before', 'Diagnóstico antes de intervenir'), ok: false, detail: rt('exam.crit.beforeBad', 'Usó herramientas pero reparó antes de diagnosticar') });
    } else {
        criteria.push({ name: rt('exam.crit.before', 'Diagnóstico antes de intervenir'), ok: false, detail: rt('exam.crit.beforeNone', 'No hay evidencia de diagnóstico previo') });
    }

    // 13. Verificación posterior
    maxPoints += 6;
    const usedSnapshot = acts.some(a => a.type === 'snapshot');
    const recheckedAfter = firstFixIdx >= 0 && acts.some((a, i) => i > firstFixIdx && isDiagAction(a));
    if (usedSnapshot || recheckedAfter) {
        points += 6;
        criteria.push({ name: rt('exam.crit.verify', 'Verificación posterior a la reparación'), ok: true, detail: usedSnapshot ? rt('exam.crit.verifySnapshots', 'Usó snapshots') : rt('exam.crit.verifyMetrics', 'Revisó métricas después') });
    } else {
        criteria.push({ name: rt('exam.crit.verify', 'Verificación posterior a la reparación'), ok: false, detail: rt('exam.crit.verifyBad', 'No verificó el resultado') });
    }

    // 13b. Presupuesto
    if (osState.budgetTotal > 0) {
        maxPoints += 6;
        if (osState.budgetSpent > 0) {
            points += 6;
            criteria.push({ name: rt('exam.crit.budget', 'Gestión del presupuesto'), ok: true, detail: rtf('exam.crit.budgetOk', { spent: osState.budgetSpent, total: osState.budgetTotal }, `Gastó $${osState.budgetSpent}`) });
        } else {
            criteria.push({ name: rt('exam.crit.budget', 'Gestión del presupuesto'), ok: false, detail: rt('exam.crit.budgetNo', 'No invirtió el presupuesto') });
        }
        if (osState.currentScenario === 12) {
            maxPoints += 8;
            if (end.ram >= 1536) {
                points += 8;
                criteria.push({ name: rt('exam.crit.budgetRam', 'Priorizó la mejora de mayor impacto (RAM)'), ok: true, detail: rtf('exam.crit.budgetRamOk', { start: start.ram, end: end.ram }, `RAM ${start.ram} → ${end.ram} MB`) });
            } else {
                criteria.push({ name: rt('exam.crit.budgetRam', 'Priorizó la mejora de mayor impacto (RAM)'), ok: false, detail: rt('exam.crit.budgetRamBad', 'El cuello de botella principal era la RAM') });
            }
        }
    }

    // 14. Acciones erróneas
    maxPoints += 6;
    const killedEssential = acts.some(a =>
        (a.type === 'kill_process' && (a.pid === 102 || a.id === 'startup-antivirus')) ||
        (a.type === 'msconfig_toggle' && a.id === 'startup-antivirus' && a.enabled === false)
    );
    const defraggedSSD = acts.some(a => a.type === 'defrag_ssd_attempt');
    if (!killedEssential && !defraggedSSD) {
        points += 6;
        criteria.push({ name: rt('exam.crit.wrong', 'Evitar acciones incorrectas'), ok: true, detail: rt('exam.crit.wrongOk', 'Sin intervenciones dañinas detectadas') });
    } else {
        const details = [];
        if (killedEssential) details.push(rt('exam.crit.wrongKilled', 'cerró antivirus'));
        if (defraggedSSD) details.push(rt('exam.crit.wrongSSD', 'intentó desfragmentar SSD'));
        criteria.push({ name: rt('exam.crit.wrong', 'Evitar acciones incorrectas'), ok: false, detail: details.join(', ') });
    }

    // 15. Eficiencia
    maxPoints += 5;
    const durationSec = osState.examStartTime ? Math.round((new Date() - osState.examStartTime) / 1000) : 0;
    const actionCount = osState.examActions.filter(a => a.type !== 'session_restored').length;
    if (actionCount >= 3 && actionCount <= 25 && durationSec < 600) {
        points += 5;
        criteria.push({ name: rt('exam.crit.eff', 'Eficiencia de la intervención'), ok: true, detail: rtf('exam.crit.effOk', { actions: actionCount, minutes: Math.floor(durationSec/60), seconds: durationSec%60 }, `${actionCount} acciones`) });
    } else if (actionCount > 0) {
        points += 2;
        criteria.push({ name: rt('exam.crit.eff', 'Eficiencia de la intervención'), ok: true, detail: rtf('exam.crit.effSome', { actions: actionCount }, `${actionCount} acciones`) });
    } else {
        criteria.push({ name: rt('exam.crit.eff', 'Eficiencia de la intervención'), ok: false, detail: rt('exam.crit.effNone', 'Sin acciones registradas') });
    }

    if (maxPoints === 0) maxPoints = 20;
    const pct = Math.round((points / maxPoints) * 100);
    return { criteria, points, maxPoints, pct, startH, endH };
}

function endExamMode() {
    if (!osState.examMode) {
        alert(rt('alert.examNoRunning', 'No hay examen en curso.'));
        return;
    }
    const endSnap = captureExamSnapshot();
    const durationSec = Math.round((new Date() - osState.examStartTime) / 1000);
    const evaluation = evaluateExamCriteria(osState.examStartSnapshot, endSnap);

    osState.examMode = false;
    clearExamSession();
    osState.examScore = evaluation.pct;

    const config = localizedScenario(osState.currentScenario);
    const obsEl = document.getElementById('exam-observations');
    const observations = (obsEl ? obsEl.value : '').trim();
    const report = {
        studentName: osState.examStudentName || rt('exam.report.noName', 'Sin nombre'),
        students: osState.examStudents.slice(),
        course: osState.examCourse || '',
        division: osState.examDivision || '',
        isGroup: osState.examStudents.length > 1,
        observations: observations,
        scenario: osState.currentScenario,
        scenarioName: config ? config.name : String(osState.currentScenario),
        difficulty: osState.examDifficulty,
        startTime: osState.examStartTime.toLocaleString(),
        endTime: new Date().toLocaleString(),
        durationSec,
        startHealth: evaluation.startH,
        endHealth: evaluation.endH,
        score: evaluation.pct,
        points: evaluation.points,
        maxPoints: evaluation.maxPoints,
        criteria: evaluation.criteria,
        actionsCount: osState.examActions.length,
        actions: osState.examActions.slice(),
        startSnap: osState.examStartSnapshot,
        endSnap
    };
    osState.examReport = report;
    osState.examHistory.push(JSON.parse(JSON.stringify(report)));
    if (osState.examHistory.length > 50) osState.examHistory.shift();
    saveExamHistory();
    playSound('done');
    renderExamHistory();
    stopExamTimer();

    document.getElementById('btn-start-exam').classList.remove('hidden');
    document.getElementById('btn-end-exam').classList.add('hidden');
    document.getElementById('btn-cancel-exam').classList.add('hidden');
    setExamFormLocked(false);
    document.getElementById('exam-status-text').innerText = rtf('ui.examStatusFinished', {
        mode: report.isGroup ? rt('exam.report.group', 'Grupo') : rt('exam.report.student', 'Alumno'),
        name: report.studentName,
        course: report.course ? report.course + ' ' + report.division + ' · ' : '',
        score: evaluation.pct,
        time: formatExamTimer(durationSec)
    }, 'EXAMEN FINALIZADO.');

    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.remove('hidden');
    showExamBanner(false);
    setScenarioButtonsLocked(false);

    const panel = document.getElementById('exam-results-panel');
    panel.classList.remove('hidden');
    let html = '';
    if (report.course || report.division) {
        html += `<p class="font-bold text-indigo-900 mb-0.5">${rtf('ui.resultsCourseDivision', { course: report.course || '—', division: report.division || '' }, 'Curso/División')}</p>`;
    }
    html += `<p class="font-bold text-indigo-900 mb-0.5">${report.isGroup ? rtf('ui.resultsGroup', { n: report.students.length }, 'Grupo') : rt('ui.resultsStudent', 'Alumno')}: ${report.studentName}</p>`;
    if (report.isGroup) {
        html += `<p class="text-[10px] text-gray-700 mb-1">• ${report.students.join('<br>• ')}</p>`;
    }
    const resultLabel = evaluation.pct >= 80 ? rt('ui.resultsExcellent', 'Excelente')
        : evaluation.pct >= 60 ? rt('ui.resultsPassed', 'Aprobado')
        : evaluation.pct >= 40 ? rt('ui.resultsRegular', 'Regular')
        : rt('ui.resultsInsufficient', 'Insuficiente');
    html += `<p class="font-bold text-indigo-900 mb-1">${rtf('ui.resultsResult', { pct: evaluation.pct, label: resultLabel }, `Resultado: ${evaluation.pct}%`)}</p>`;
    if (observations) {
        html += `<p class="text-[10px] mt-1 border-t pt-1"><b>${rt('ui.resultsObservations', 'Observaciones:')}</b> ${observations.replace(/</g, '&lt;')}</p>`;
    }
    html += `<table class="w-full text-[10px]"><thead><tr class="bg-gray-100"><th class="p-0.5 text-left">${rt('ui.resultsCriteria', 'Criterio')}</th><th class="p-0.5">${rt('ui.resultsState', 'Estado')}</th><th class="p-0.5 text-left">${rt('ui.resultsDetail', 'Detalle')}</th></tr></thead><tbody>`;
    evaluation.criteria.forEach(c => {
        html += `<tr class="border-b"><td class="p-0.5">${c.name}</td><td class="p-0.5 text-center">${c.ok ? '✓' : '✗'}</td><td class="p-0.5">${c.detail}</td></tr>`;
    });
    html += `</tbody></table>`;
    html += `<p class="mt-1 text-[10px] text-gray-600">${rtf('exam.report.actions', { n: osState.examActions.length }, 'Acciones')} · ${rt('exam.report.duration', 'Duración:')} ${Math.floor(durationSec/60)}m ${durationSec%60}s</p>`;
    panel.innerHTML = html;

    logAuditEvent(rtf('log.examFinished', {
        score: evaluation.pct,
        points: evaluation.points,
        max: evaluation.maxPoints,
        duration: durationSec
    }, 'Examen finalizado.'));
}

function syncExamObservations() {
    const obsEl = document.getElementById('exam-observations');
    if (osState.examReport && obsEl) {
        osState.examReport.observations = obsEl.value.trim();
        if (osState.examHistory.includes(osState.examReport)) saveExamHistory();
    }
}

function exportExamReport() {
    const r = osState.examReport;
    if (!r) {
        alert(rt('alert.examNoReport', 'No hay informe de examen.'));
        return;
    }
    syncExamObservations();
    const safeName = (r.isGroup ? 'Grupo_' + (r.course || '') + (r.division || '') : (r.students && r.students[0]) || r.studentName || 'SinNombre')
        .replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
    let text = `═══════════════════════════════════════\n`;
    text += `  ${rt('exam.report.title', 'RetroOS 3.0 — Informe de Evaluación')}\n`;
    text += `═══════════════════════════════════════\n\n`;
    text += `${rt('exam.report.course', 'Curso:')} ${r.course || '—'}\n`;
    text += `${rt('exam.report.division', 'División:')} ${r.division || '—'}\n`;
    text += `${rt('exam.report.modality', 'Modalidad:')} ${r.isGroup ? rtf('exam.report.groupMode', { n: (r.students ? r.students.length : 0) }, 'Grupal') : rt('exam.report.individual', 'Individual')}\n`;
    text += `${rt('exam.report.students', 'Alumno(s):')}\n`;
    (r.students || [r.studentName]).forEach(s => { text += `  • ${s}\n`; });
    text += `\n${rt('exam.report.scenario', 'Escenario:')} ${r.scenarioName}\n`;
    text += `${rt('exam.report.difficulty', 'Nivel de dificultad:')} ${r.difficulty}\n`;
    text += `${rt('exam.report.start', 'Inicio:')} ${r.startTime}\n`;
    text += `${rt('exam.report.end', 'Fin:')} ${r.endTime}\n`;
    text += `${rt('exam.report.duration', 'Duración:')} ${Math.floor(r.durationSec/60)}m ${r.durationSec%60}s\n`;
    text += `${rt('exam.report.txtStartHealth', 'Salud inicial:')} ${r.startHealth}% → ${rt('exam.report.txtFinalHealth', 'Salud final:')} ${r.endHealth}%\n`;
    text += `${rt('exam.report.score', 'PUNTUACIÓN:')} ${r.score}% (${r.points}/${r.maxPoints} ${rt('exam.report.txtPoints', 'puntos')})\n`;
    if (r.isGroup) {
        text += `\n${rt('exam.report.shared', 'La puntuación es compartida por el grupo.')}\n`;
    }
    text += `\n${rt('exam.report.txtObservations', '--- Observaciones del docente ---')}\n`;
    text += (r.observations ? r.observations : rt('exam.report.noObservations', '(sin observaciones)')) + '\n';
    text += `\n${rt('exam.report.txtCriteria', '--- Criterios ---')}\n`;
    r.criteria.forEach(c => {
        text += `${c.ok ? '[OK]' : '[X]'} ${c.name}: ${c.detail}\n`;
    });
    text += `\n${rtf('exam.report.txtActions', { n: r.actionsCount }, 'Acciones registradas')}\n`;
    r.actions.forEach(a => { text += `[${a.time}] ${a.msg}\n`; });
    text += `\n${rt('exam.report.txtInitial', '--- Estado inicial ---')}\n`;
    text += JSON.stringify(r.startSnap, null, 2);
    text += `\n\n${rt('exam.report.txtFinal', '--- Estado final ---')}\n`;
    text += JSON.stringify(r.endSnap, null, 2);
    text += `\n\n${rt('exam.report.txtGenerated', 'Generado por RetroOS 3.0')}\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RetroOS_Informe_${safeName}_Esc${r.scenario}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    logAuditEvent(rtf('log.exportTxt', { name: r.studentName }, 'Informe TXT exportado.'));
}

function exportExamCSV() {
    const r = osState.examReport;
    if (!r) {
        alert(rt('alert.examNoReport', 'No hay informe de examen.'));
        return;
    }
    syncExamObservations();
    const safeName = (r.isGroup ? 'Grupo_' + (r.course || '') + (r.division || '') : (r.students && r.students[0]) || r.studentName || 'SinNombre')
        .replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
    let csv = 'Campo,Valor\n';
    csv += `Curso,"${(r.course || '').replace(/"/g, '""')}"\n`;
    csv += `Division,"${(r.division || '').replace(/"/g, '""')}"\n`;
    csv += `Modalidad,${r.isGroup ? rt('exam.report.csvGroup', 'Grupal') : rt('exam.report.csvIndividual', 'Individual')}\n`;
    csv += `Alumnos,"${(r.studentName || '').replace(/"/g, '""')}"\n`;
    (r.students || []).forEach((s, i) => {
        csv += `Alumno_${i + 1},"${s.replace(/"/g, '""')}"\n`;
    });
    csv += `Escenario,"${r.scenarioName}"\n`;
    csv += `Nivel,${r.difficulty}\n`;
    csv += `Puntuacion,${r.score}%\n`;
    csv += `Inicio,"${r.startTime}"\n`;
    csv += `Fin,"${r.endTime}"\n`;
    csv += `Duracion_s,${r.durationSec}\n`;
    csv += `Observaciones,"${(r.observations || '').replace(/"/g, '""')}"\n\n`;
    csv += 'Criterio,Cumplido,Detalle\n';
    r.criteria.forEach(c => {
        csv += `"${c.name}",${c.ok ? rt('ui.statusYes', 'SI') : rt('ui.statusNo', 'NO')},"${c.detail.replace(/"/g, '""')}"\n`;
    });
    csv += `\nMetrica,Inicial,Final\n`;
    csv += `Salud,${r.startHealth}%,${r.endHealth}%\n`;
    csv += `RAM usada,${r.startSnap.ramUsed} MB,${r.endSnap.ramUsed} MB\n`;
    csv += `Temperatura,${r.startSnap.temp}C,${r.endSnap.temp}C\n`;
    csv += `Fragmentacion,${r.startSnap.frag}%,${r.endSnap.frag}%\n`;
    csv += `Espacio libre,${r.startSnap.free} GB,${r.endSnap.free} GB\n`;
    csv += `Tiempo arranque,${r.startSnap.boot}s,${r.endSnap.boot}s\n`;
    csv += `Puntuacion,${r.score}%,\n`;
    csv += `Duracion,${r.durationSec}s,\n`;
    csv += `Acciones,${r.actionsCount},\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RetroOS_Evaluacion_${safeName}_Esc${r.scenario}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logAuditEvent(rtf('log.exportCsv', { name: r.studentName }, 'Informe CSV exportado.'));
}

function exportExamPDF() {
    const r = osState.examReport;
    if (!r) {
        alert(rt('alert.examNoReport', 'No hay informe de examen.'));
        return;
    }
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert(rt('alert.pdfUnavailable', 'No se pudo cargar la librería PDF.'));
        return;
    }
    syncExamObservations();
    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 16;
    const lineH = 6;
    const maxW = pageW - margin * 2;

    const ensureSpace = (need) => {
        if (y + need > 280) {
            doc.addPage();
            y = 16;
        }
    };
    const addLine = (text, opts = {}) => {
        const size = opts.size || 10;
        const style = opts.style || 'normal';
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(String(text), maxW);
        ensureSpace(lines.length * lineH);
        doc.text(lines, margin, y);
        y += lines.length * (opts.lh || lineH);
    };
    const addGap = (h = 3) => { y += h; };

    // Encabezado
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(rt('exam.report.title', 'RetroOS 3.0 — Informe de Evaluación'), margin, 14);
    y = 30;
    doc.setTextColor(0, 0, 0);

    addLine(rt('exam.report.data', 'Datos del examen'), { size: 12, style: 'bold' });
    addGap(1);
    addLine(`${rt('exam.report.course', 'Curso:')} ${r.course || '—'}    ${rt('exam.report.division', 'División:')} ${r.division || '—'}`);
    addLine(`${rt('exam.report.modality', 'Modalidad:')} ${r.isGroup ? rtf('exam.report.groupMode', { n: (r.students ? r.students.length : 0) }, 'Grupal') : rt('exam.report.individual', 'Individual')}`);
    addLine(`${rt('exam.report.students', 'Alumno(s):')} ${r.studentName || '—'}`);
    if (r.students && r.students.length > 1) {
        r.students.forEach((s, i) => addLine(`  ${i + 1}. ${s}`, { size: 9 }));
    }
    addLine(`${rt('exam.report.scenario', 'Escenario:')} ${r.scenarioName}`);
    addLine(`${rt('exam.report.difficulty', 'Nivel de dificultad:')} ${r.difficulty}`);
    addLine(`${rt('exam.report.start', 'Inicio:')} ${r.startTime}`);
    addLine(`${rt('exam.report.end', 'Fin:')} ${r.endTime}`);
    addLine(`${rt('exam.report.duration', 'Duración:')} ${Math.floor(r.durationSec / 60)}m ${r.durationSec % 60}s`);
    addGap(2);

    ensureSpace(18);
    const scoreColor = r.score >= 80 ? [5, 150, 105] : r.score >= 60 ? [217, 119, 6] : [220, 38, 38];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(margin, y - 4, maxW, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(rtf('exam.report.scoreLine', {
        score: r.score,
        points: r.points,
        max: r.maxPoints,
        start: r.startHealth,
        end: r.endHealth
    }, `PUNTUACIÓN: ${r.score}%`), margin + 3, y + 3.5);
    doc.setTextColor(0, 0, 0);
    y += 16;

    if (r.isGroup) {
        addLine(rt('exam.report.shared', 'La puntuación es compartida por el grupo.'), { size: 9, style: 'italic' });
        addGap(2);
    }

    addLine(rt('exam.report.observations', 'Observaciones del docente'), { size: 11, style: 'bold' });
    addLine(r.observations || rt('exam.report.noObservations', '(sin observaciones)'), { size: 9 });
    addGap(3);

    addLine(rt('exam.report.criteria', 'Criterios de evaluación'), { size: 11, style: 'bold' });
    addGap(1);
    (r.criteria || []).forEach(c => {
        const mark = c.ok ? '[OK]' : '[X]';
        addLine(`${mark} ${c.name}: ${c.detail}`, { size: 9, lh: 5 });
    });
    addGap(3);

    addLine(rtf('exam.report.actions', { n: r.actionsCount || 0 }, 'Acciones registradas'), { size: 11, style: 'bold' });
    addGap(1);
    if (!r.actions || r.actions.length === 0) {
        addLine(rt('exam.report.none', '(ninguna)'), { size: 9 });
    } else {
        r.actions.forEach(a => {
            addLine(`[${a.time}] ${a.msg}`, { size: 8, lh: 4.5 });
        });
    }
    addGap(4);

    ensureSpace(10);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(rtf('exam.report.generated', { date: new Date().toLocaleString() }, 'Generado por RetroOS 3.0'), margin, 290);

    const safeName = (r.isGroup ? 'Grupo_' + (r.course || '') + (r.division || '') : (r.students && r.students[0]) || r.studentName || 'SinNombre')
        .replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
    doc.save(`RetroOS_Informe_${safeName}_Esc${r.scenario}_${Date.now()}.pdf`);
    logAuditEvent(rtf('log.exportPdf', { name: r.studentName }, 'Informe PDF exportado.'));
}

let currentHelpTab = 'alumno';

function showHelpTab(tab) {
    currentHelpTab = tab;
    const body = document.getElementById('help-body');
    if (body) body.innerHTML = rt('help.' + tab, helpContent[tab] || '');
    ['alumno', 'docente', 'herramientas', 'escenarios'].forEach(t => {
        const btn = document.getElementById('help-tab-' + t);
        if (!btn) return;
        if (t === tab) btn.classList.add('active', 'bg-blue-100');
        else btn.classList.remove('active', 'bg-blue-100');
    });
}

function exportHelpPDF() {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert(rt('alert.pdfUnavailableSimple', 'No se pudo cargar la librería PDF.'));
        return;
    }
    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 14;
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin * 2;
    let y = 16;
    const ensure = (n) => { if (y + n > 280) { doc.addPage(); y = 16; } };
    const line = (text, size = 10, style = 'normal') => {
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(String(text), maxW);
        ensure(lines.length * 5.5);
        doc.text(lines, margin, y);
        y += lines.length * 5.5;
    };

    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageW, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(rt('exam.report.manualTitle', 'RetroOS 3.0 — Manual de Uso y Diagnóstico'), margin, 13);
    y = 28;
    doc.setTextColor(0, 0, 0);

    const sections = [
        { key: 'alumno', titleKey: 'exam.report.manualS1', fallback: '1. Guía para Alumnos' },
        { key: 'docente', titleKey: 'exam.report.manualS2', fallback: '2. Guía para Docentes' },
        { key: 'herramientas', titleKey: 'exam.report.manualS3', fallback: '3. Herramientas del Sistema' },
        { key: 'escenarios', titleKey: 'exam.report.manualS4', fallback: '4. Escenarios Didácticos (1 a 12)' }
    ];

    sections.forEach(s => {
        ensure(12);
        line(rt(s.titleKey, s.fallback), 12, 'bold');
        y += 2;
        const html = rt('help.' + s.key, helpContent[s.key] || '');
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const plain = (tmp.innerText || tmp.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
        line(plain, 9, 'normal');
        y += 4;
    });

    ensure(10);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(rtf('exam.report.generated', { date: new Date().toLocaleString() }, 'Generado por RetroOS 3.0'), margin, 290);
    doc.save('RetroOS_3_0_Manual_de_uso.pdf');
    logAuditEvent(rt('log.helpPdf', 'Manual de uso exportado a PDF.'));
}

