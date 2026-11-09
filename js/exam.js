// js/exam.js - Lógica del modo examen, evaluación automática, rúbricas y exportación (PDF, CSV, TXT)

function setExamDifficulty(level) {
    osState.examDifficulty = Number(level);
    const panel = document.getElementById('correction-guide-panel');
    const btn = document.getElementById('btn-toggle-correction');
    if (osState.examDifficulty === 1) {
        if (panel) panel.classList.remove('hidden');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ocultar Pauta';
    } else if (osState.examDifficulty === 3) {
        if (panel) panel.classList.add('hidden');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-book-bookmark"></i> Ver Pauta';
    }
    logAuditEvent(`Nivel de dificultad establecido: ${osState.examDifficulty}`);
}

function setScenarioButtonsLocked(locked) {
    for (let i = 1; i <= 12; i++) {
        const btn = document.getElementById(`btn-scen-${i}`);
        if (btn) {
            btn.disabled = locked;
            btn.style.opacity = locked ? '0.45' : '1';
            btn.style.pointerEvents = locked ? 'none' : 'auto';
            btn.title = locked ? 'Bloqueado durante el examen' : '';
        }
    }
    const diffSel = document.getElementById('exam-difficulty');
    if (diffSel) diffSel.disabled = locked;
}

function getExamStudentsLabel() {
    const list = osState.examStudents || [];
    if (list.length === 0) return '—';
    if (list.length === 1) return list[0];
    return list.join(' · ') + ` (${list.length} alumnos)`;
}

function getExamGroupLabel() {
    const parts = [];
    if (osState.examCourse) parts.push(osState.examCourse);
    if (osState.examDivision) parts.push('Div. ' + osState.examDivision);
    return parts.length ? parts.join(' ') : '';
}

function renderExamStudentsList() {
    const el = document.getElementById('exam-students-list');
    if (!el) return;
    if (!osState.examStudents.length) {
        el.innerHTML = '<span class="text-gray-400">Ningún alumno agregado</span>';
        return;
    }
    el.innerHTML = osState.examStudents.map((name, i) =>
        `<span class="inline-flex items-center gap-1 bg-indigo-100 border border-indigo-300 px-1.5 py-0.5 rounded">
            <i class="fa-solid fa-user text-indigo-700"></i> ${name}
            <button type="button" onclick="removeExamStudent(${i})" class="text-red-700 font-bold leading-none ${osState.examMode ? 'hidden' : ''}" title="Quitar">×</button>
        </span>`
    ).join('');
}

function addExamStudent() {
    if (osState.examMode) {
        alert('No se pueden agregar alumnos durante el examen.');
        return;
    }
    const input = document.getElementById('exam-student-name');
    const name = (input ? input.value : '').trim();
    if (!name) {
        alert('Escribí el nombre del alumno.');
        if (input) input.focus();
        return;
    }
    if (osState.examStudents.some(s => s.toLowerCase() === name.toLowerCase())) {
        alert('Ese alumno ya está en la lista.');
        return;
    }
    if (osState.examStudents.length >= 8) {
        alert('Máximo 8 alumnos por examen grupal.');
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
            info.innerText = `${group ? group + ' · ' : ''}${names} · Esc. ${osState.currentScenario} · Nv ${osState.examDifficulty}`;
        }
    } else {
        banner.classList.add('hidden');
    }
}

function startExamMode() {
    if (osState.mustChangePass) {
        alert('Cambiá la clave inicial del docente antes de iniciar un examen.');
        return;
    }
    if (osState.examMode) {
        alert('Ya hay un examen en curso. Finalizalo o cancelalo primero.');
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
        alert('Agregá al menos un alumno (o un grupo) antes de iniciar el examen.');
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
    document.getElementById('exam-status-text').innerText =
        `EXAMEN EN CURSO · ${group ? group + ' · ' : ''}${getExamStudentsLabel()} · Esc ${osState.currentScenario} · Nv ${osState.examDifficulty} · Salud ini: ${osState.examStartHealth}%`;
    document.getElementById('exam-results-panel').classList.add('hidden');

    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.add('hidden');
    showExamBanner(true);
    startExamTimer();
    setScenarioButtonsLocked(true);
    setExamDifficulty(osState.examDifficulty);

    logAuditEvent(`[EXAMEN] Iniciado. Curso: ${osState.examCourse || '—'} Div: ${osState.examDivision || '—'}. Alumnos: ${osState.examStudentName}. Escenario ${osState.currentScenario}.`);
    alert(`Modo Examen activado\n\n${group ? 'Curso/Div: ' + group + '\n' : ''}Alumnos:\n• ${osState.examStudents.join('\n• ')}\n\n• Banner rojo + temporizador\n• Panel de Misión oculto\n• Escenarios bloqueados`);
}

function cancelExamMode() {
    if (!osState.examMode) {
        alert('No hay examen en curso.');
        return;
    }
    if (!confirm('¿Cancelar el examen sin evaluar?\n\nSe restaurará el Panel de Misión y se desbloquearán los escenarios.\nNo se generará puntuación.')) {
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
    document.getElementById('exam-status-text').innerText = 'Examen cancelado (sin evaluación). Escenarios desbloqueados.';
    document.getElementById('exam-results-panel').classList.add('hidden');

    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.remove('hidden');
    showExamBanner(false);
    setScenarioButtonsLocked(false);

    logAuditEvent(`[EXAMEN] Cancelado. Alumnos: "${osState.examStudentName || '—'}". Sin evaluación.`);
    alert('Examen cancelado.\nPanel de Misión restaurado.\nEscenarios desbloqueados.');
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
        criteria.push({ name: 'Salud del sistema ≥ 85%', ok: true, detail: `${startH}% → ${endH}%` });
    } else if (endH > startH + 15) {
        points += 10;
        criteria.push({ name: 'Salud del sistema mejoró notablemente', ok: true, detail: `${startH}% → ${endH}% (+${endH - startH})` });
    } else if (endH > startH) {
        points += 5;
        criteria.push({ name: 'Salud del sistema mejoró levemente', ok: true, detail: `${startH}% → ${endH}%` });
    } else {
        criteria.push({ name: 'Salud del sistema', ok: false, detail: `${startH}% → ${endH}% (sin mejora suficiente)` });
    }

    // 2. Malware
    if (start.malware) {
        maxPoints += 15;
        if (!end.malware) {
            points += 15;
            criteria.push({ name: 'Malware eliminado', ok: true, detail: 'svchost_fake.exe finalizado' });
        } else {
            criteria.push({ name: 'Malware eliminado', ok: false, detail: 'Sigue activo' });
        }
        maxPoints += 8;
        const disabledInMsconfig = acts.some(a =>
            a.type === 'msconfig_toggle' && a.id === 'startup-malware' && a.enabled === false
        );
        if (!end.malware && disabledInMsconfig) {
            points += 8;
            criteria.push({ name: 'Persistencia del malware eliminada (MSConfig)', ok: true, detail: 'Deshabilitado al inicio' });
        } else if (!end.malware) {
            points += 3;
            criteria.push({ name: 'Persistencia del malware eliminada (MSConfig)', ok: false, detail: 'Proceso muerto pero no deshabilitado al inicio' });
        } else {
            criteria.push({ name: 'Persistencia del malware eliminada (MSConfig)', ok: false, detail: 'No corregido' });
        }
    }

    // 3. Memoria / thrashing
    if (start.swapping || start.ramUsed > start.ram * 0.85) {
        maxPoints += 12;
        if (!end.swapping && end.ramUsed < end.ram * 0.8) {
            points += 12;
            criteria.push({ name: 'Presión de memoria / thrashing resuelto', ok: true, detail: `RAM ${end.ramUsed}/${end.ram} MB, swap off` });
        } else {
            criteria.push({ name: 'Presión de memoria / thrashing resuelto', ok: false, detail: end.swapping ? 'Sigue en swap' : `RAM ${end.ramUsed}/${end.ram} MB` });
        }
        if (start.ram <= 512) {
            maxPoints += 8;
            if (end.ram >= 1536) {
                points += 8;
                criteria.push({ name: 'Ampliación de RAM adecuada', ok: true, detail: `${start.ram} → ${end.ram} MB` });
            } else {
                criteria.push({ name: 'Ampliación de RAM adecuada', ok: false, detail: `Sigue en ${end.ram} MB` });
            }
        }
    }

    // 4. Page Faults controlados
    maxPoints += 6;
    if (end.pf <= start.pf + 5 || !end.swapping) {
        points += 6;
        criteria.push({ name: 'Page Faults controlados', ok: true, detail: `PF inicio ~${start.pf}, fin ${end.pf}` });
    } else {
        criteria.push({ name: 'Page Faults controlados', ok: false, detail: `PF siguen subiendo (${end.pf})` });
    }

    // 5. Fragmentación / disco
    if (start.frag > 20 && start.diskType === 'HDD') {
        maxPoints += 10;
        if (end.frag <= 12) {
            points += 10;
            criteria.push({ name: 'Fragmentación de HDD corregida', ok: true, detail: `${start.frag}% → ${end.frag}%` });
        } else {
            criteria.push({ name: 'Fragmentación de HDD corregida', ok: false, detail: `${start.frag}% → ${end.frag}%` });
        }
    }
    if (start.diskType === 'HDD' && start.frag > 30) {
        maxPoints += 5;
        if (end.diskType === 'SSD') {
            points += 5;
            criteria.push({ name: 'Migración a SSD (opcional)', ok: true, detail: 'HDD → SSD' });
        } else {
            criteria.push({ name: 'Migración a SSD (opcional)', ok: false, detail: 'Sigue en HDD' });
        }
    }

    // 6. Temperatura / refrigeración
    if (start.temp > 70 || start.throttle || start.cool < 50) {
        maxPoints += 12;
        if (end.temp <= 65 && !end.throttle) {
            points += 12;
            criteria.push({ name: 'Temperatura y refrigeración normalizadas', ok: true, detail: `${start.temp}°C → ${end.temp}°C, cool ${end.cool}%` });
        } else {
            criteria.push({ name: 'Temperatura y refrigeración normalizadas', ok: false, detail: `${start.temp}°C → ${end.temp}°C` });
        }
    }

    // 7. Espacio en disco
    if (start.junk > 80 || start.free < 5) {
        maxPoints += 10;
        if (end.junk < 40 && end.free > start.free) {
            points += 10;
            criteria.push({ name: 'Espacio en disco recuperado', ok: true, detail: `Libre ${start.free}→${end.free} GB` });
        } else {
            criteria.push({ name: 'Espacio en disco recuperado', ok: false, detail: `Libre ${end.free} GB, basura ${end.junk} MB` });
        }
    }

    // 8. Red
    if (!start.net) {
        maxPoints += 12;
        if (end.net) {
            points += 12;
            criteria.push({ name: 'Conectividad de red restaurada', ok: true, detail: 'Red OK' });
        } else {
            criteria.push({ name: 'Conectividad de red restaurada', ok: false, detail: 'Sigue sin conexión' });
        }
    }

    // 9. Inicio del sistema
    if (start.heavyStartup || start.conflict || start.boot > 90) {
        maxPoints += 10;
        const bootImproved = end.boot < start.boot - 15;
        const appsClean = !end.heavyStartup && !end.conflict;
        if (appsClean && bootImproved) {
            points += 10;
            criteria.push({ name: 'Inicio optimizado', ok: true, detail: `Boot ${start.boot}s → ${end.boot}s` });
        } else if (appsClean || bootImproved) {
            points += 5;
            criteria.push({ name: 'Inicio parcialmente optimizado', ok: true, detail: `Boot ${end.boot}s` });
        } else {
            criteria.push({ name: 'Inicio optimizado', ok: false, detail: `Boot ${end.boot}s, procesos problemáticos activos` });
        }
    }

    // 10. Procesos pesados
    const killedHeavy = acts.some(a => a.type === 'kill_heavy');
    if (start.cpu > 50 || (osState.extraHeavyApps.length === 0 && killedHeavy)) {
        maxPoints += 6;
        if (end.cpu < 45 || killedHeavy) {
            points += 6;
            criteria.push({ name: 'Procesos pesados innecesarios controlados', ok: true, detail: `CPU fin ~${Math.round(end.cpu)}%` });
        } else {
            criteria.push({ name: 'Procesos pesados innecesarios controlados', ok: false, detail: `CPU ~${Math.round(end.cpu)}%` });
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
        criteria.push({ name: 'Uso de herramientas de diagnóstico', ok: true, detail: `${diagCount} herramientas: ${diagList.join(', ')}` });
    } else if (diagCount >= 2) {
        points += 8;
        criteria.push({ name: 'Uso de herramientas de diagnóstico', ok: true, detail: `${diagCount} herramientas: ${diagList.join(', ')}` });
    } else if (diagCount === 1) {
        points += 4;
        criteria.push({ name: 'Uso de herramientas de diagnóstico', ok: true, detail: `Solo: ${diagList[0]}` });
    } else {
        criteria.push({ name: 'Uso de herramientas de diagnóstico', ok: false, detail: 'No se usaron herramientas de diagnóstico' });
    }

    // 12. Diagnóstico antes de reparar
    maxPoints += 8;
    const firstDiagIdx = acts.findIndex(isDiagAction);
    const firstFixIdx = acts.findIndex(isFixAction);
    if (firstDiagIdx >= 0 && (firstFixIdx < 0 || firstDiagIdx < firstFixIdx)) {
        points += 8;
        criteria.push({ name: 'Diagnóstico antes de intervenir', ok: true, detail: 'Observó el sistema antes de reparar' });
    } else if (firstDiagIdx >= 0) {
        points += 3;
        criteria.push({ name: 'Diagnóstico antes de intervenir', ok: false, detail: 'Usó herramientas pero reparó antes de diagnosticar' });
    } else {
        criteria.push({ name: 'Diagnóstico antes de intervenir', ok: false, detail: 'No hay evidencia de diagnóstico previo' });
    }

    // 13. Verificación posterior
    maxPoints += 6;
    const usedSnapshot = acts.some(a => a.type === 'snapshot');
    const recheckedAfter = firstFixIdx >= 0 && acts.some((a, i) => i > firstFixIdx && isDiagAction(a));
    if (usedSnapshot || recheckedAfter) {
        points += 6;
        criteria.push({ name: 'Verificación posterior a la reparación', ok: true, detail: usedSnapshot ? 'Usó snapshots' : 'Revisó métricas después' });
    } else {
        criteria.push({ name: 'Verificación posterior a la reparación', ok: false, detail: 'No verificó el resultado' });
    }

    // 13b. Presupuesto
    if (osState.budgetTotal > 0) {
        maxPoints += 6;
        if (osState.budgetSpent > 0) {
            points += 6;
            criteria.push({ name: 'Gestión del presupuesto', ok: true, detail: `Gastó $${osState.budgetSpent} de $${osState.budgetTotal} sin excederlo` });
        } else {
            criteria.push({ name: 'Gestión del presupuesto', ok: false, detail: 'No invirtió el presupuesto en ninguna mejora' });
        }
        if (osState.currentScenario === 12) {
            maxPoints += 8;
            if (end.ram >= 1536) {
                points += 8;
                criteria.push({ name: 'Priorizó la mejora de mayor impacto (RAM)', ok: true, detail: `RAM ${start.ram} → ${end.ram} MB` });
            } else {
                criteria.push({ name: 'Priorizó la mejora de mayor impacto (RAM)', ok: false, detail: 'El cuello de botella principal era la RAM' });
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
        criteria.push({ name: 'Evitar acciones incorrectas', ok: true, detail: 'Sin intervenciones dañinas detectadas' });
    } else {
        const details = [];
        if (killedEssential) details.push('cerró antivirus');
        if (defraggedSSD) details.push('intentó desfragmentar SSD');
        criteria.push({ name: 'Evitar acciones incorrectas', ok: false, detail: details.join(', ') });
    }

    // 15. Eficiencia
    maxPoints += 5;
    const durationSec = osState.examStartTime ? Math.round((new Date() - osState.examStartTime) / 1000) : 0;
    const actionCount = osState.examActions.filter(a => a.type !== 'session_restored').length;
    if (actionCount >= 3 && actionCount <= 25 && durationSec < 600) {
        points += 5;
        criteria.push({ name: 'Eficiencia de la intervención', ok: true, detail: `${actionCount} acciones en ${Math.floor(durationSec/60)}m ${durationSec%60}s` });
    } else if (actionCount > 0) {
        points += 2;
        criteria.push({ name: 'Eficiencia de la intervención', ok: true, detail: `${actionCount} acciones (revisar si hubo pasos de más)` });
    } else {
        criteria.push({ name: 'Eficiencia de la intervención', ok: false, detail: 'Sin acciones registradas' });
    }

    if (maxPoints === 0) maxPoints = 20;
    const pct = Math.round((points / maxPoints) * 100);
    return { criteria, points, maxPoints, pct, startH, endH };
}

function endExamMode() {
    if (!osState.examMode) {
        alert('No hay examen en curso.');
        return;
    }
    const endSnap = captureExamSnapshot();
    const durationSec = Math.round((new Date() - osState.examStartTime) / 1000);
    const evaluation = evaluateExamCriteria(osState.examStartSnapshot, endSnap);

    osState.examMode = false;
    clearExamSession();
    osState.examScore = evaluation.pct;

    const config = scenarioConfigs[osState.currentScenario];
    const obsEl = document.getElementById('exam-observations');
    const observations = (obsEl ? obsEl.value : '').trim();
    const report = {
        studentName: osState.examStudentName || 'Sin nombre',
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
    document.getElementById('exam-status-text').innerText =
        `EXAMEN FINALIZADO · ${report.isGroup ? 'Grupo' : 'Alumno'}: ${report.studentName} · ${report.course ? report.course + ' ' + report.division + ' · ' : ''}Nota: ${evaluation.pct}% · Tiempo: ${formatExamTimer(durationSec)}`;

    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.remove('hidden');
    showExamBanner(false);
    setScenarioButtonsLocked(false);

    const panel = document.getElementById('exam-results-panel');
    panel.classList.remove('hidden');
    let html = '';
    if (report.course || report.division) {
        html += `<p class="font-bold text-indigo-900 mb-0.5">Curso/División: ${report.course || '—'} ${report.division || ''}</p>`;
    }
    html += `<p class="font-bold text-indigo-900 mb-0.5">${report.isGroup ? 'Grupo (' + report.students.length + ')' : 'Alumno'}: ${report.studentName}</p>`;
    if (report.isGroup) {
        html += `<p class="text-[10px] text-gray-700 mb-1">• ${report.students.join('<br>• ')}</p>`;
    }
    html += `<p class="font-bold text-indigo-900 mb-1">Resultado: ${evaluation.pct}% — ${evaluation.pct >= 80 ? 'Excelente' : evaluation.pct >= 60 ? 'Aprobado' : evaluation.pct >= 40 ? 'Regular' : 'Insuficiente'}</p>`;
    if (observations) {
        html += `<p class="text-[10px] mt-1 border-t pt-1"><b>Observaciones:</b> ${observations.replace(/</g, '&lt;')}</p>`;
    }
    html += `<table class="w-full text-[10px]"><thead><tr class="bg-gray-100"><th class="p-0.5 text-left">Criterio</th><th class="p-0.5">Estado</th><th class="p-0.5 text-left">Detalle</th></tr></thead><tbody>`;
    evaluation.criteria.forEach(c => {
        html += `<tr class="border-b"><td class="p-0.5">${c.name}</td><td class="p-0.5 text-center">${c.ok ? '✓' : '✗'}</td><td class="p-0.5">${c.detail}</td></tr>`;
    });
    html += `</tbody></table>`;
    html += `<p class="mt-1 text-[10px] text-gray-600">Acciones registradas: ${osState.examActions.length} · Duración: ${Math.floor(durationSec/60)}m ${durationSec%60}s</p>`;
    panel.innerHTML = html;

    logAuditEvent(`[EXAMEN] Finalizado. Puntuación: ${evaluation.pct}% (${evaluation.points}/${evaluation.maxPoints}). Duración: ${durationSec}s.`);
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
        alert('No hay informe de examen. Iniciá y finalizá un examen primero.');
        return;
    }
    syncExamObservations();
    const safeName = (r.isGroup ? 'Grupo_' + (r.course || '') + (r.division || '') : (r.students && r.students[0]) || r.studentName || 'SinNombre')
        .replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
    let text = `═══════════════════════════════════════\n`;
    text += `  INFORME DE EVALUACIÓN — RetroOS 3.0\n`;
    text += `═══════════════════════════════════════\n\n`;
    text += `Curso: ${r.course || '—'}\n`;
    text += `División: ${r.division || '—'}\n`;
    text += `Modalidad: ${r.isGroup ? 'Grupal (' + (r.students ? r.students.length : 0) + ' alumnos)' : 'Individual'}\n`;
    text += `Alumno(s):\n`;
    (r.students || [r.studentName]).forEach(s => { text += `  • ${s}\n`; });
    text += `\nEscenario: ${r.scenarioName}\n`;
    text += `Nivel de dificultad: ${r.difficulty}\n`;
    text += `Inicio: ${r.startTime}\n`;
    text += `Fin: ${r.endTime}\n`;
    text += `Duración: ${Math.floor(r.durationSec/60)}m ${r.durationSec%60}s\n`;
    text += `Salud inicial: ${r.startHealth}% → Salud final: ${r.endHealth}%\n`;
    text += `PUNTUACIÓN: ${r.score}% (${r.points}/${r.maxPoints} puntos)\n`;
    if (r.isGroup) {
        text += `\nNota: la puntuación es compartida por todos los integrantes del grupo.\n`;
    }
    text += `\n--- Observaciones del docente ---\n`;
    text += (r.observations ? r.observations : '(sin observaciones)') + '\n';
    text += `\n--- Criterios ---\n`;
    r.criteria.forEach(c => {
        text += `${c.ok ? '[OK]' : '[X]'} ${c.name}: ${c.detail}\n`;
    });
    text += `\n--- Acciones registradas (${r.actionsCount}) ---\n`;
    r.actions.forEach(a => { text += `[${a.time}] ${a.msg}\n`; });
    text += `\n--- Estado inicial ---\n`;
    text += JSON.stringify(r.startSnap, null, 2);
    text += `\n\n--- Estado final ---\n`;
    text += JSON.stringify(r.endSnap, null, 2);
    text += `\n\nGenerado por RetroOS 3.0\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RetroOS_Informe_${safeName}_Esc${r.scenario}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    logAuditEvent(`[EXAMEN] Informe exportado (.txt) — ${r.studentName}`);
}

function exportExamCSV() {
    const r = osState.examReport;
    if (!r) {
        alert('No hay informe de examen. Iniciá y finalizá un examen primero.');
        return;
    }
    syncExamObservations();
    const safeName = (r.isGroup ? 'Grupo_' + (r.course || '') + (r.division || '') : (r.students && r.students[0]) || r.studentName || 'SinNombre')
        .replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
    let csv = 'Campo,Valor\n';
    csv += `Curso,"${(r.course || '').replace(/"/g, '""')}"\n`;
    csv += `Division,"${(r.division || '').replace(/"/g, '""')}"\n`;
    csv += `Modalidad,${r.isGroup ? 'Grupal' : 'Individual'}\n`;
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
        csv += `"${c.name}",${c.ok ? 'SI' : 'NO'},"${c.detail.replace(/"/g, '""')}"\n`;
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
    logAuditEvent(`[EXAMEN] Informe CSV exportado — Alumno: ${r.studentName}`);
}

function exportExamPDF() {
    const r = osState.examReport;
    if (!r) {
        alert('No hay informe de examen. Iniciá y finalizá un examen primero.');
        return;
    }
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert('No se pudo cargar la librería PDF. Verificá la conexión a internet o usá Exportar Informe (.txt).');
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
    doc.text('RetroOS 3.0 — Informe de Evaluación', margin, 14);
    y = 30;
    doc.setTextColor(0, 0, 0);

    addLine('Datos del examen', { size: 12, style: 'bold' });
    addGap(1);
    addLine(`Curso: ${r.course || '—'}    División: ${r.division || '—'}`);
    addLine(`Modalidad: ${r.isGroup ? 'Grupal (' + (r.students ? r.students.length : 0) + ' alumnos)' : 'Individual'}`);
    addLine(`Alumno(s): ${r.studentName || '—'}`);
    if (r.students && r.students.length > 1) {
        r.students.forEach((s, i) => addLine(`  ${i + 1}. ${s}`, { size: 9 }));
    }
    addLine(`Escenario: ${r.scenarioName}`);
    addLine(`Nivel de dificultad: ${r.difficulty}`);
    addLine(`Inicio: ${r.startTime}`);
    addLine(`Fin: ${r.endTime}`);
    addLine(`Duración: ${Math.floor(r.durationSec / 60)}m ${r.durationSec % 60}s`);
    addGap(2);

    ensureSpace(18);
    const scoreColor = r.score >= 80 ? [5, 150, 105] : r.score >= 60 ? [217, 119, 6] : [220, 38, 38];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.roundedRect(margin, y - 4, maxW, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`PUNTUACIÓN: ${r.score}%  (${r.points}/${r.maxPoints} puntos)  —  Salud ${r.startHealth}% → ${r.endHealth}%`, margin + 3, y + 3.5);
    doc.setTextColor(0, 0, 0);
    y += 16;

    if (r.isGroup) {
        addLine('La puntuación es compartida por todos los integrantes del grupo.', { size: 9, style: 'italic' });
        addGap(2);
    }

    addLine('Observaciones del docente', { size: 11, style: 'bold' });
    addLine(r.observations || '(sin observaciones)', { size: 9 });
    addGap(3);

    addLine('Criterios de evaluación', { size: 11, style: 'bold' });
    addGap(1);
    (r.criteria || []).forEach(c => {
        const mark = c.ok ? '[OK]' : '[X]';
        addLine(`${mark} ${c.name}: ${c.detail}`, { size: 9, lh: 5 });
    });
    addGap(3);

    addLine(`Acciones registradas (${r.actionsCount || 0})`, { size: 11, style: 'bold' });
    addGap(1);
    if (!r.actions || r.actions.length === 0) {
        addLine('(ninguna)', { size: 9 });
    } else {
        r.actions.forEach(a => {
            addLine(`[${a.time}] ${a.msg}`, { size: 8, lh: 4.5 });
        });
    }
    addGap(4);

    ensureSpace(10);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generado por RetroOS 3.0 — ${new Date().toLocaleString()}`, margin, 290);

    const safeName = (r.isGroup ? 'Grupo_' + (r.course || '') + (r.division || '') : (r.students && r.students[0]) || r.studentName || 'SinNombre')
        .replace(/[\\/:*?"<>|]/g, '_').substring(0, 40);
    doc.save(`RetroOS_Informe_${safeName}_Esc${r.scenario}_${Date.now()}.pdf`);
    logAuditEvent(`[EXAMEN] Informe PDF exportado — ${r.studentName}`);
}

function showHelpTab(tab) {
    const body = document.getElementById('help-body');
    if (body) body.innerHTML = helpContent[tab] || '';
    ['alumno', 'docente', 'herramientas', 'escenarios'].forEach(t => {
        const btn = document.getElementById('help-tab-' + t);
        if (!btn) return;
        if (t === tab) btn.classList.add('active', 'bg-blue-100');
        else btn.classList.remove('active', 'bg-blue-100');
    });
}

function exportHelpPDF() {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert('No se pudo cargar la librería PDF. Verificá la conexión a internet.');
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
    doc.text('RetroOS 3.0 — Manual de Uso y Diagnóstico', margin, 13);
    y = 28;
    doc.setTextColor(0, 0, 0);

    const sections = [
        { key: 'alumno', title: '1. Guía para Alumnos' },
        { key: 'docente', title: '2. Guía para Docentes' },
        { key: 'herramientas', title: '3. Herramientas del Sistema' },
        { key: 'escenarios', title: '4. Escenarios Didácticos (1 a 12)' }
    ];

    sections.forEach(s => {
        ensure(12);
        line(s.title, 12, 'bold');
        y += 2;
        const html = helpContent[s.key] || '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const plain = (tmp.innerText || tmp.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
        line(plain, 9, 'normal');
        y += 4;
    });

    ensure(10);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Generado por RetroOS 3.0 — ' + new Date().toLocaleString(), margin, 290);
    doc.save('RetroOS_3_0_Manual_de_uso.pdf');
    logAuditEvent('[AYUDA] Manual de uso exportado a PDF.');
}
