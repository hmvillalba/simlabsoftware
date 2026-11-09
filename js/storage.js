// js/storage.js - Persistencia en localStorage, sesiones de examen, historial y autenticación docente (SHA-256)

/* ===== MODAL Y ACCESO DOCENTE ===== */
function openTeacherAuthModal() {
    if (osState.teacherUnlocked) {
        openWindow('win-teacher');
    } else {
        document.getElementById('modal-teacher-auth').classList.remove('hidden');
        document.getElementById('teacher-pass-input').value = '';
        document.getElementById('auth-error-msg').classList.add('hidden');
        document.getElementById('teacher-pass-input').focus();
    }
}

function closeTeacherAuthModal() {
    document.getElementById('modal-teacher-auth').classList.add('hidden');
}

function teacherLogout() {
    if (osState.examMode) {
        alert('Hay un examen en curso. Finalizalo o cancelalo antes de cerrar la sesión docente.');
        return;
    }
    osState.teacherUnlocked = false;
    closeWindow('win-teacher');
    logAuditEvent('[DOCENTE] Sesión cerrada. Se requiere clave nuevamente.');
    alert('Sesión docente cerrada.\nPara volver a entrar hace falta la clave.');
}

function setStudentOnlyMode(enabled) {
    osState.studentOnlyMode = !!enabled;
    try { localStorage.setItem('retroos_student_only', enabled ? '1' : '0'); } catch (e) {}
    const desk = document.getElementById('desktop-icon-teacher');
    if (desk) {
        if (enabled) desk.classList.add('hidden');
        else desk.classList.remove('hidden');
    }
    logAuditEvent(`[DOCENTE] Modo solo alumno: ${enabled ? 'activado (icono escritorio oculto)' : 'desactivado'}.`);
}

function applyStudentOnlyModeFromStorage() {
    try {
        const v = localStorage.getItem('retroos_student_only');
        const enabled = v === '1';
        osState.studentOnlyMode = enabled;
        const chk = document.getElementById('chk-student-mode');
        if (chk) chk.checked = enabled;
        const desk = document.getElementById('desktop-icon-teacher');
        if (desk && enabled) desk.classList.add('hidden');
    } catch (e) {}
}

function formatExamTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function startExamTimer() {
    stopExamTimer();
    const tick = () => {
        if (!osState.examMode || !osState.examStartTime) return;
        const elapsed = Math.floor((Date.now() - osState.examStartTime.getTime()) / 1000);
        const el = document.getElementById('exam-banner-timer');
        if (el) el.innerText = formatExamTimer(elapsed);
    };
    tick();
    osState.examTimerInterval = setInterval(tick, 1000);
}

function stopExamTimer() {
    if (osState.examTimerInterval) {
        clearInterval(osState.examTimerInterval);
        osState.examTimerInterval = null;
    }
    const el = document.getElementById('exam-banner-timer');
    if (el) el.innerText = '00:00';
}

/* ===== EXAMEN EN CURSO: se guarda y se restaura si se recarga la página ===== */
const EXAM_SESSION_KEY = 'retroos_exam_session';
const EXAM_SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const SIM_FIELDS = ['totalRAM', 'diskType', 'diskCapacityGB', 'diskUsedGB', 'freeDiskGB', 'fragmentation',
    'junkFilesMB', 'cpuTemp', 'pageFaults', 'injectedSwapMB', 'browserExtraRAM', 'bootTimeSec',
    'coolingEfficiency', 'thermalThrottle', 'networkOk', 'networkIssue', 'softwareConflict', 'conflictAppName',
    'budgetRemaining', 'budgetTotal', 'budgetSpent'];

function saveExamSession() {
    if (!osState.examMode || !osState.examStartTime) return true;
    try {
        const sim = {};
        SIM_FIELDS.forEach(k => { sim[k] = osState[k]; });
        sim.extraHeavyApps = osState.extraHeavyApps;
        sim.startupApps = osState.startupApps.map(a => ({ id: a.id, enabled: a.enabled }));
        sim.openWindows = osState.openWindows;
        sim.minimizedWindows = osState.minimizedWindows;
        const data = {
            v: 1,
            savedAt: Date.now(),
            exam: {
                scenario: osState.currentScenario,
                students: osState.examStudents,
                studentName: osState.examStudentName,
                course: osState.examCourse,
                division: osState.examDivision,
                difficulty: osState.examDifficulty,
                startTime: osState.examStartTime.toISOString(),
                startHealth: osState.examStartHealth,
                startSnapshot: osState.examStartSnapshot,
                actions: osState.examActions
            },
            sim,
            auditLog: osState.auditLog.slice(-500)
        };
        localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(data));
        osState.examSaveFailed = false;
        return true;
    } catch (e) {
        osState.examSaveFailed = true;
        return false;
    }
}

function clearExamSession() {
    try { localStorage.removeItem(EXAM_SESSION_KEY); } catch (e) {}
    osState.examSaveFailed = false;
}

function restoreExamSession() {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(EXAM_SESSION_KEY)); } catch (e) { return false; }
    if (!data || data.v !== 1 || !data.exam || !data.sim || !scenarioConfigs[data.exam.scenario]) return false;
    if (Date.now() - (data.savedAt || 0) > EXAM_SESSION_MAX_AGE_MS) { clearExamSession(); return false; }

    const ex = data.exam, sim = data.sim;
    loadScenario(ex.scenario);
    SIM_FIELDS.forEach(k => { if (k in sim) osState[k] = sim[k]; });
    osState.extraHeavyApps = Array.isArray(sim.extraHeavyApps) ? sim.extraHeavyApps : [];
    (sim.startupApps || []).forEach(saved => {
        const app = osState.startupApps.find(a => a.id === saved.id);
        if (app) app.enabled = !!saved.enabled;
    });
    osState.swapping = false;
    osState.defragging = false;
    osState.auditLog = Array.isArray(data.auditLog) ? data.auditLog : osState.auditLog;

    osState.examStudents = Array.isArray(ex.students) ? ex.students : [];
    osState.examStudentName = ex.studentName || osState.examStudents.join(', ');
    osState.examCourse = ex.course || '';
    osState.examDivision = ex.division || '';
    osState.examDifficulty = Number(ex.difficulty) || 3;
    osState.examStartHealth = ex.startHealth || 0;
    osState.examStartSnapshot = ex.startSnapshot || null;
    osState.examActions = Array.isArray(ex.actions) ? ex.actions : [];
    osState.examStartTime = new Date(ex.startTime);
    osState.examScore = null;
    osState.examReport = null;

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
    setVal('exam-course', osState.examCourse);
    setVal('exam-division', osState.examDivision);
    setVal('exam-difficulty', String(osState.examDifficulty));
    setExamDifficulty(osState.examDifficulty);

    (sim.openWindows || []).forEach(id => {
        const win = document.getElementById(id);
        if (!win || !appCatalog[id]) return;
        if (!osState.openWindows.includes(id)) osState.openWindows.push(id);
        if ((sim.minimizedWindows || []).includes(id)) {
            if (!osState.minimizedWindows.includes(id)) osState.minimizedWindows.push(id);
        } else {
            win.classList.remove('hidden');
            fitWindowToViewport(win);
            bringToFront(win);
        }
    });
    renderTaskbarTabs();

    osState.examMode = true;
    document.getElementById('btn-start-exam').classList.add('hidden');
    document.getElementById('btn-end-exam').classList.remove('hidden');
    document.getElementById('btn-cancel-exam').classList.remove('hidden');
    setExamFormLocked(true);
    document.getElementById('exam-status-bar').classList.remove('hidden');
    const group = getExamGroupLabel();
    document.getElementById('exam-status-text').innerText =
        `EXAMEN EN CURSO (restaurado tras recarga) · ${group ? group + ' · ' : ''}${getExamStudentsLabel()} · Esc ${osState.currentScenario} · Nv ${osState.examDifficulty} · Salud ini: ${osState.examStartHealth}%`;
    document.getElementById('exam-results-panel').classList.add('hidden');
    const mission = document.getElementById('mission-panel');
    if (mission) mission.classList.add('hidden');
    showExamBanner(true);
    startExamTimer();
    setScenarioButtonsLocked(true);

    renderDefragGrid();
    renderMsconfigList();
    renderExamStudentsList();
    updateBudgetDisplay();
    updateSystemState();
    const away = Math.max(0, Math.round((Date.now() - (data.savedAt || Date.now())) / 1000));
    logAuditEvent(`[EXAMEN] Sesión restaurada tras recarga del navegador (inactiva ~${away}s). El cronómetro continúa desde el inicio original.`, { type: 'session_restored' });
    return true;
}

const EXAM_HISTORY_KEY = 'retroos_exam_history';

function saveExamHistory() {
    try {
        localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(osState.examHistory));
    } catch (e) {
        try {
            osState.examHistory = osState.examHistory.slice(-20);
            localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(osState.examHistory));
        } catch (e2) {
            alert('No se pudo guardar el historial en este navegador. Exportá los informes (PDF/CSV) para no perderlos.');
        }
    }
}

function loadExamHistory() {
    try {
        const raw = localStorage.getItem(EXAM_HISTORY_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (Array.isArray(data)) osState.examHistory = data;
    } catch (e) {}
}

function renderExamHistory() {
    const list = document.getElementById('exam-history-list');
    if (!list) return;
    if (!osState.examHistory.length) {
        list.innerHTML = '<p class="text-gray-500">Aún no hay evaluaciones guardadas.</p>';
        return;
    }
    list.innerHTML = osState.examHistory.map((h, i) => {
        const group = [h.course, h.division].filter(Boolean).join(' ');
        const names = (h.students && h.students.length) ? h.students.join(', ') : h.studentName;
        return `<div class="flex flex-wrap items-center justify-between gap-1 bg-white border border-teal-200 p-1 rounded">
            <span class="font-mono"><b>#${i + 1}</b> ${group ? group + ' · ' : ''}${names} · Esc${h.scenario} · <b>${h.score}%</b> · ${h.endTime}</span>
            <span class="flex gap-1">
                <button onclick="loadHistoryReport(${i})" class="win98-btn px-1.5 py-0.5 text-[10px] font-bold">Ver</button>
                <button onclick="exportHistoryPDF(${i})" class="win98-btn px-1.5 py-0.5 text-[10px] font-bold text-red-800">PDF</button>
                <button onclick="exportHistoryTXT(${i})" class="win98-btn px-1.5 py-0.5 text-[10px] font-bold text-blue-900">TXT</button>
            </span>
        </div>`;
    }).join('');
}

function clearExamHistory() {
    if (!osState.examHistory.length) return;
    if (!confirm('¿Vaciar TODO el historial de evaluaciones guardado en este navegador? Esta acción no se puede deshacer.')) return;
    osState.examHistory = [];
    saveExamHistory();
    renderExamHistory();
    logAuditEvent('[DOCENTE] Historial de evaluaciones vaciado.');
}

function loadHistoryReport(index) {
    const h = osState.examHistory[index];
    if (!h) return;
    osState.examReport = h;
    const obs = document.getElementById('exam-observations');
    if (obs) obs.value = h.observations || '';
    const panel = document.getElementById('exam-results-panel');
    if (panel) {
        panel.classList.remove('hidden');
        let html = '';
        if (h.course || h.division) html += `<p class="font-bold text-indigo-900">Curso/División: ${h.course || '—'} ${h.division || ''}</p>`;
        html += `<p class="font-bold text-indigo-900">${h.isGroup ? 'Grupo' : 'Alumno'}: ${h.studentName}</p>`;
        html += `<p class="font-bold">Nota: ${h.score}% · Escenario ${h.scenarioName} · ${h.endTime}</p>`;
        if (h.observations) html += `<p class="text-[10px] mt-1"><b>Observaciones:</b> ${String(h.observations).replace(/</g, '&lt;')}</p>`;
        panel.innerHTML = html;
    }
    document.getElementById('exam-status-text').innerText = `Historial #${index + 1} cargado — listo para re-exportar.`;
    document.getElementById('exam-status-bar')?.classList.remove('hidden');
}

function exportHistoryTXT(index) {
    const h = osState.examHistory[index];
    if (!h) return;
    osState.examReport = h;
    exportExamReport();
}

function exportHistoryPDF(index) {
    const h = osState.examHistory[index];
    if (!h) return;
    osState.examReport = h;
    exportExamPDF();
}

/* ===== CLAVE DOCENTE: hash SHA-256 con sal (sin texto plano) ===== */
const FIXED_TEACHER_HASH = '';
const TEACHER_HASH_KEY = 'retroos_teacher_hash';
const TEACHER_LEGACY_KEY = 'retroos_teacher_pass';
let loginFails = 0, loginLockUntil = 0;

const SHA_K = [], SHA_H = [];
(function initSha() {
    let n = 2, cnt = 0;
    while (cnt < 64) {
        let prime = true;
        for (let i = 2; i * i <= n; i++) { if (n % i === 0) { prime = false; break; } }
        if (prime) {
            if (cnt < 8) SHA_H[cnt] = (Math.pow(n, 1 / 2) % 1 * 4294967296) | 0;
            SHA_K[cnt] = (Math.pow(n, 1 / 3) % 1 * 4294967296) | 0;
            cnt++;
        }
        n++;
    }
})();

function sha256Hex(msg) {
    const ror = (x, n) => (x >>> n) | (x << (32 - n));
    const bytes = new TextEncoder().encode(msg);
    const l = bytes.length;
    const buf = new Uint8Array(((l + 9 + 63) >> 6) << 6);
    buf.set(bytes);
    buf[l] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(buf.length - 4, (l * 8) >>> 0);
    dv.setUint32(buf.length - 8, Math.floor(l * 8 / 4294967296));
    let h = SHA_H.slice();
    const w = new Array(64);
    for (let i = 0; i < buf.length; i += 64) {
        for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
        for (let t = 16; t < 64; t++) {
            const s0 = ror(w[t - 15], 7) ^ ror(w[t - 15], 18) ^ (w[t - 15] >>> 3);
            const s1 = ror(w[t - 2], 17) ^ ror(w[t - 2], 19) ^ (w[t - 2] >>> 10);
            w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
        }
        let [a, b, c, d, e, f, g, hh] = h;
        for (let t = 0; t < 64; t++) {
            const S1 = ror(e, 6) ^ ror(e, 11) ^ ror(e, 25);
            const ch = (e & f) ^ (~e & g);
            const t1 = (hh + S1 + ch + SHA_K[t] + w[t]) | 0;
            const S0 = ror(a, 2) ^ ror(a, 13) ^ ror(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) | 0;
            hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
        }
        h = [(h[0] + a) | 0, (h[1] + b) | 0, (h[2] + c) | 0, (h[3] + d) | 0, (h[4] + e) | 0, (h[5] + f) | 0, (h[6] + g) | 0, (h[7] + hh) | 0];
    }
    return h.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

function hashPassword(pass, salt) {
    let h = sha256Hex(salt + pass);
    for (let i = 0; i < 3000; i++) h = sha256Hex(h + pass);
    return h;
}

function randomSalt() {
    const arr = new Uint8Array(12);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    return Array.from(arr).map(x => x.toString(16).padStart(2, '0')).join('');
}

function generarHashClave(pass) {
    const salt = randomSalt();
    const out = salt + ':' + hashPassword(String(pass), salt);
    console.log('Pegá esto en FIXED_TEACHER_HASH:\n' + out);
    return out;
}

function readStoredCredential() {
    try {
        const c = JSON.parse(localStorage.getItem(TEACHER_HASH_KEY));
        if (c && c.salt && c.hash) return c;
    } catch (e) {}
    return null;
}

function readLegacyPassword() {
    try {
        const v = localStorage.getItem(TEACHER_LEGACY_KEY);
        if (v && v.length > 0) return v;
    } catch (e) {}
    return null;
}

function verifyTeacherPassword(input) {
    if (FIXED_TEACHER_HASH) {
        const [salt, hash] = FIXED_TEACHER_HASH.split(':');
        return hashPassword(input, salt) === hash;
    }
    const cred = readStoredCredential();
    if (cred) return hashPassword(input, cred.salt) === cred.hash;
    const legacy = readLegacyPassword();
    return input === (legacy !== null ? legacy : '1234');
}

function isDefaultTeacherPassword() {
    if (FIXED_TEACHER_HASH) return false;
    if (readStoredCredential()) return false;
    const legacy = readLegacyPassword();
    return legacy === null || legacy === '1234';
}

function setTeacherPassword(pass) {
    try {
        const salt = randomSalt();
        localStorage.setItem(TEACHER_HASH_KEY, JSON.stringify({ salt, hash: hashPassword(pass, salt) }));
        localStorage.removeItem(TEACHER_LEGACY_KEY);
    } catch (e) {
        alert('No se pudo guardar la clave en este navegador (localStorage bloqueado).');
        return false;
    }
    return true;
}

function checkTeacherPassword() {
    const errEl = document.getElementById('auth-error-msg');
    const showErr = (t) => { errEl.innerText = t; errEl.classList.remove('hidden'); };
    const now = Date.now();
    if (now < loginLockUntil) {
        playSound('error');
        showErr(`Demasiados intentos. Esperá ${Math.ceil((loginLockUntil - now) / 1000)} s.`);
        return;
    }
    const input = document.getElementById('teacher-pass-input').value;
    if (verifyTeacherPassword(input)) {
        loginFails = 0;
        if (!FIXED_TEACHER_HASH && !readStoredCredential() && readLegacyPassword() !== null && input !== '1234') {
            setTeacherPassword(input);
        }
        osState.mustChangePass = isDefaultTeacherPassword();
        osState.teacherUnlocked = true;
        document.getElementById('teacher-pass-input').value = '';
        errEl.classList.add('hidden');
        closeTeacherAuthModal();
        logAuditEvent("Panel de Docente autenticado exitosamente.");
        openWindow('win-teacher');
        if (osState.mustChangePass) {
            alert('Estás usando la clave inicial (1234).\nCambiala ahora: no vas a poder iniciar exámenes hasta hacerlo.');
            const cur = document.getElementById('teacher-pass-current');
            if (cur) { cur.focus(); cur.scrollIntoView({ block: 'center' }); }
        }
    } else {
        loginFails++;
        playSound('error');
        if (loginFails >= 5) {
            loginLockUntil = Date.now() + 30000;
            loginFails = 0;
            showErr('Demasiados intentos. Esperá 30 s.');
        } else {
            showErr('Clave incorrecta. Intente de nuevo.');
        }
    }
}

function changeTeacherPassword() {
    const cur = (document.getElementById('teacher-pass-current')?.value || '');
    const neu = (document.getElementById('teacher-pass-new')?.value || '');
    const conf = (document.getElementById('teacher-pass-confirm')?.value || '');
    const msg = document.getElementById('teacher-pass-msg');
    const showMsg = (text, ok) => {
        if (!msg) return;
        msg.classList.remove('hidden', 'text-red-700', 'text-green-700');
        msg.classList.add(ok ? 'text-green-700' : 'text-red-700');
        msg.innerText = text;
    };
    if (FIXED_TEACHER_HASH) {
        showMsg('La clave está fijada en el archivo (FIXED_TEACHER_HASH); se cambia editando el archivo.', false);
        return;
    }
    if (!verifyTeacherPassword(cur)) {
        showMsg('La clave actual no es correcta.', false);
        return;
    }
    if (neu.length < 6) {
        showMsg('La nueva clave debe tener al menos 6 caracteres.', false);
        return;
    }
    if (neu === '1234') {
        showMsg('Esa clave es demasiado obvia. Elegí otra.', false);
        return;
    }
    if (neu !== conf) {
        showMsg('La confirmación no coincide con la nueva clave.', false);
        return;
    }
    if (!setTeacherPassword(neu)) {
        showMsg('Error al guardar la clave.', false);
        return;
    }
    osState.mustChangePass = false;
    document.getElementById('teacher-pass-current').value = '';
    document.getElementById('teacher-pass-new').value = '';
    document.getElementById('teacher-pass-confirm').value = '';
    showMsg('Clave actualizada correctamente (guardada cifrada). Se usará en el próximo acceso.', true);
}

