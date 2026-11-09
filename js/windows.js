// js/windows.js - Gestor de ventanas, barra de tareas, menú inicio, arrastre y redimensionamiento

const TASKBAR_H = 48;

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.remove('hidden');
        fitWindowToViewport(win);
        bringToFront(win);
        playSound('click');
        if (!osState.openWindows.includes(id)) osState.openWindows.push(id);
        osState.minimizedWindows = osState.minimizedWindows.filter(w => w !== id);
        renderTaskbarTabs();
        logAuditEvent(`Abrió ventana '${appCatalog[id] ? appCatalog[id].title : id}'.`, { type: 'open_window', id });
        if (typeof invalidateSimulationCaches === 'function') invalidateSimulationCaches();
        updateSystemState();
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.classList.add('hidden');
        playSound('click');
        osState.openWindows = osState.openWindows.filter(w => w !== id);
        renderTaskbarTabs();
        logAuditEvent(`Cerró ventana '${appCatalog[id] ? appCatalog[id].title : id}'.`, { type: 'close_window', id });
        updateSystemState();
    }
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add('hidden');
    if (!osState.openWindows.includes(id)) osState.openWindows.push(id);
    if (!osState.minimizedWindows.includes(id)) osState.minimizedWindows.push(id);
    renderTaskbarTabs();
    logAuditEvent(`Minimizó ventana '${appCatalog[id] ? appCatalog[id].title : id}'. El proceso sigue activo.`);
    updateSystemState();
}

function renderTaskbarTabs() {
    const container = document.getElementById('taskbar-app-tabs');
    if (!container) return;
    container.innerHTML = '';
    osState.openWindows.forEach(winId => {
        const meta = appCatalog[winId];
        if (meta) {
            const btn = document.createElement('button');
            btn.className = "win98-btn px-2 py-0.5 text-xs font-bold truncate max-w-[120px]";
            btn.innerHTML = `<i class="fa-solid ${meta.icon}"></i> ${meta.title}`;
            if (osState.minimizedWindows.includes(winId)) btn.classList.add('opacity-60');
            btn.onclick = () => openWindow(winId);
            container.appendChild(btn);
        }
    });
}

function toggleStartMenu(forceState) {
    const menu = document.getElementById('start-menu');
    if (!menu) return;
    if (typeof forceState === 'boolean') {
        if (!forceState) menu.classList.add('hidden');
        else menu.classList.remove('hidden');
    } else {
        menu.classList.toggle('hidden');
    }
}

function openAboutModal() {
    const modal = document.getElementById('modal-about');
    if (modal) {
        modal.classList.remove('hidden');
        playSound('click');
        logAuditEvent('Abrió ventana Acerca de RetroOS 3.0.');
    }
}

function closeAboutModal() {
    const modal = document.getElementById('modal-about');
    if (modal) {
        modal.classList.add('hidden');
        playSound('click');
    }
}

function bringToFront(win) {
    const z = (w) => parseInt(w.style.zIndex || getComputedStyle(w).zIndex, 10) || 20;
    const wins = Array.from(document.querySelectorAll('.win98-box[id^="win-"]')).sort((x, y) => z(x) - z(y));
    const i = wins.indexOf(win);
    if (i > -1) wins.splice(i, 1);
    wins.push(win);
    wins.forEach((w, idx) => { w.style.zIndex = 20 + idx; }); // siempre < 50 (menús y modal)
}

function fitWindowToViewport(win) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = Math.min(win.offsetWidth, vw - 8);
    const h = Math.min(win.offsetHeight, vh - TASKBAR_H - 8);
    const left = Math.max(0, Math.min(win.offsetLeft, vw - w));
    const top = Math.max(0, Math.min(win.offsetTop, vh - TASKBAR_H - h));
    if (left !== win.offsetLeft) win.style.left = left + 'px';
    if (top !== win.offsetTop) win.style.top = top + 'px';
}

function installResizeGrips() {
    document.querySelectorAll('.win98-box[id^="win-"]').forEach(win => {
        if (win.querySelector(':scope > .win-resize-grip')) return;
        const grip = document.createElement('div');
        grip.className = 'win-resize-grip';
        grip.title = 'Arrastrar para cambiar el tamaño';
        win.appendChild(grip);
    });
}

window.addEventListener('resize', () => {
    document.querySelectorAll('.win98-box[id^="win-"]:not(.hidden)').forEach(fitWindowToViewport);
});

let currentDrag = null, currentResize = null;
document.addEventListener('pointerdown', (e) => {
    const win = e.target.closest ? e.target.closest('.win98-box[id^="win-"]') : null;
    if (!win || win.classList.contains('hidden')) return;
    bringToFront(win);
    if (e.target.closest('.win-resize-grip')) {
        currentResize = { win, sx: e.clientX, sy: e.clientY, w: win.offsetWidth, h: win.offsetHeight };
        e.preventDefault();
        return;
    }
    const bar = e.target.closest('.win98-titlebar');
    if (!bar || !win.contains(bar) || e.target.closest('button, input, select, textarea')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    currentDrag = { win, dx: e.clientX - win.offsetLeft, dy: e.clientY - win.offsetTop };
    e.preventDefault();
});

document.addEventListener('pointermove', (e) => {
    if (currentResize) {
        const { win, sx, sy, w, h } = currentResize;
        const vw = window.innerWidth, vh = window.innerHeight;
        const newW = Math.max(Math.min(260, vw - 8), Math.min(w + (e.clientX - sx), vw - win.offsetLeft - 4));
        const newH = Math.max(120, Math.min(h + (e.clientY - sy), vh - TASKBAR_H - win.offsetTop));
        win.style.width = newW + 'px';
        win.style.height = newH + 'px';
        return;
    }
    if (!currentDrag) return;
    const { win, dx, dy } = currentDrag;
    const left = Math.min(Math.max(e.clientX - dx, 100 - win.offsetWidth), window.innerWidth - 100);
    const top = Math.min(Math.max(e.clientY - dy, 0), window.innerHeight - 90);
    win.style.left = left + 'px';
    win.style.top = top + 'px';
});

['pointerup', 'pointercancel'].forEach(ev => document.addEventListener(ev, () => { currentDrag = null; currentResize = null; }));
