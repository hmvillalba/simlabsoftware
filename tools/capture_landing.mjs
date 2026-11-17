// tools/capture_landing.mjs — capturas reales del simulador para la landing.
//
// Uso: node tools/capture_landing.mjs
//
// Abre index.html en Chrome (o Edge) en modo headless, espera a que los estilos
// estén aplicados, abre las ventanas del taller con las funciones del propio
// simulador y guarda:
//
//   assets/landing/simulator-desktop.png  1440x900
//   assets/landing/simulator-mobile.png    390x844
//   assets/landing/og.png                 1200x630
//
// No hay dependencias: se habla con Chrome por el protocolo DevTools (CDP)
// usando el WebSocket que ya trae Node 22+. Las capturas se versionan, así que
// este script se corre solo cuando cambia la interfaz.
//
// El navegador se busca en las rutas habituales de Windows, Linux y macOS; se
// puede forzar con CHROME_PATH=/ruta/al/chrome.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'assets', 'landing');
const PORT = 9333;
const HTTP_PORT = 8099;
const PAGE_URL = `http://127.0.0.1:${HTTP_PORT}/index.html`;

const CANDIDATES = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

function findBrowser() {
    for (const p of CANDIDATES) if (fs.existsSync(p)) return p;
    throw new Error('No se encontró Chrome ni Edge. Indicá la ruta con CHROME_PATH.');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Servidor estático mínimo: el simulador usa localStorage y con file:// falla. */
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2'
};

function serve() {
    const server = http.createServer((req, res) => {
        const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
        const file = path.join(ROOT, rel);
        // Nada fuera del repositorio.
        if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
        fs.readFile(file, (err, data) => {
            if (err) { res.writeHead(404).end('no encontrado'); return; }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
            res.end(data);
        });
    });
    return new Promise(resolve => server.listen(HTTP_PORT, '127.0.0.1', () => resolve(server)));
}

/** Cliente mínimo de CDP: id → promesa, más espera de eventos por método. */
function connect(wsUrl) {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    const waiters = [];
    let seq = 0;

    ws.addEventListener('message', ev => {
        const msg = JSON.parse(ev.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
        } else if (msg.method) {
            for (let i = waiters.length - 1; i >= 0; i--) {
                if (waiters[i].method === msg.method) {
                    waiters[i].resolve(msg.params);
                    waiters.splice(i, 1);
                }
            }
        }
    });

    const ready = new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve, { once: true });
        ws.addEventListener('error', () => reject(new Error('No se pudo conectar al navegador')), { once: true });
    });

    return {
        ready,
        send(method, params = {}) {
            const id = ++seq;
            return new Promise((resolve, reject) => {
                pending.set(id, { resolve, reject });
                ws.send(JSON.stringify({ id, method, params }));
            });
        },
        once(method, timeout = 20000) {
            return new Promise((resolve, reject) => {
                const waiter = { method, resolve };
                waiters.push(waiter);
                setTimeout(() => {
                    const i = waiters.indexOf(waiter);
                    if (i > -1) { waiters.splice(i, 1); reject(new Error(`Timeout esperando ${method}`)); }
                }, timeout);
            });
        },
        close() { ws.close(); }
    };
}

async function httpJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
    return res.json();
}

async function evaluate(cdp, expression) {
    const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
        expression, returnByValue: true, awaitPromise: true
    });
    if (exceptionDetails) throw new Error(exceptionDetails.text || 'Error evaluando JS en la página');
    return result.value;
}

/** Espera a que la app esté lista (onload corrido y estado creado). */
async function waitForApp(cdp) {
    for (let i = 0; i < 80; i++) {
        try {
            const ok = await evaluate(cdp, 'Boolean(window.osState && document.getElementById("mission-panel"))');
            if (ok) return;
        } catch { /* la página todavía no tiene contexto JS */ }
        await sleep(250);
    }
    throw new Error('La app no terminó de cargar');
}

/** Captura la pestaña actual y la guarda como PNG. */
async function shot(cdp, file) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(path.join(OUT, file), buf);
    console.log(`  ${file}  ${(buf.length / 1024).toFixed(0)} KB`);
}

/** Ventanas del simulador ubicadas a mano para que no se tapen. */
const LAYOUT_DESKTOP = `
    document.getElementById('start-menu')?.classList.add('hidden');
    const place = (id, left, top, width) => {
        const w = document.getElementById(id);
        if (!w) return;
        w.classList.remove('hidden');
        w.style.left = left + 'px';
        w.style.top = top + 'px';
        if (width) w.style.width = width + 'px';
        w.style.height = '';
    };
    place('win-hwmon', 100, 52, 520);
    place('win-taskmgr', 632, 52, 448);
    place('win-vmem', 632, 396, 448);
    if (typeof renderTaskbarTabs === 'function') renderTaskbarTabs();
    if (typeof updateSystemState === 'function') updateSystemState();
    true;
`;

/** En el celular solo se deja el monitor: es lo que mejor se lee. */
const LAYOUT_MOBILE = `
    ['win-vmem', 'win-taskmgr', 'win-hwmon'].forEach(id => {
        const w = document.getElementById(id);
        if (w) w.classList.add('hidden');
    });
    document.getElementById('start-menu')?.classList.add('hidden');
    const mon = document.getElementById('win-hwmon');
    if (mon) {
        mon.classList.remove('hidden');
        mon.style.left = '8px';
        mon.style.top = '8px';
        mon.style.width = '';
        mon.style.height = '';
    }
    if (typeof renderTaskbarTabs === 'function') renderTaskbarTabs();
    if (typeof updateSystemState === 'function') updateSystemState();
    true;
`;

async function captureDesktop(cdp) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
    });
    await sleep(700);
    await evaluate(cdp, LAYOUT_DESKTOP);
    await sleep(1400);
    await shot(cdp, 'simulator-desktop.png');
}

async function captureMobile(cdp) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: 390, height: 844, deviceScaleFactor: 2, mobile: true
    });
    await sleep(900);
    await evaluate(cdp, LAYOUT_MOBILE);
    await sleep(1400);
    await shot(cdp, 'simulator-mobile.png');
}


/** Portada para compartir en redes: 1200x630 con la captura y el título. */
function ogHtml(desktopPngBase64) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{box-sizing:border-box;margin:0}
        body{width:1200px;height:630px;background:#020617;color:#e2e8f0;overflow:hidden;
             font-family:'Segoe UI',system-ui,-apple-system,sans-serif;position:relative;
             background-image:radial-gradient(circle,rgba(51,65,85,.55) 1px,transparent 1px);background-size:24px 24px}
        .glow{position:absolute;right:-160px;top:-160px;width:520px;height:520px;border-radius:50%;
              background:radial-gradient(circle,rgba(45,212,191,.22),transparent 70%)}
        .wrap{padding:52px 64px}
        .badge{display:inline-block;padding:8px 16px;border-radius:999px;border:1px solid rgba(45,212,191,.35);
               background:rgba(45,212,191,.12);color:#99f6e4;font-size:19px;font-weight:600}
        h1{font-size:54px;line-height:1.1;letter-spacing:-1.5px;color:#fff;margin:20px 0 12px;max-width:1040px}
        p{font-size:23px;color:#94a3b8;max-width:940px}
        .frame{margin-top:30px;border-radius:16px;overflow:hidden;border:1px solid #1e293b;
               box-shadow:0 28px 70px rgba(0,0,0,.55);line-height:0}
        img{width:1072px;display:block}
    </style></head><body><div class="glow"></div>
        <div class="wrap">
            <span class="badge">Gratis · Sin instalar · Funciona sin internet</span>
            <h1>Diagn&#243;stico de PC en un escritorio simulado</h1>
            <p>12 escenarios con fallas, herramientas de t&#233;cnico, panel docente y evaluaci&#243;n autom&#225;tica.</p>
            <div class="frame"><img src="data:image/png;base64,${desktopPngBase64}"></div>
        </div>
    </body></html>`;
}

async function captureOg(cdp) {
    const desktop = fs.readFileSync(path.join(OUT, 'simulator-desktop.png')).toString('base64');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: 1200, height: 630, deviceScaleFactor: 1, mobile: false
    });
    const { frameTree } = await cdp.send('Page.getFrameTree');
    await cdp.send('Page.setDocumentContent', { frameId: frameTree.frame.id, html: ogHtml(desktop) });
    await sleep(900);
    await shot(cdp, 'og.png');
}


async function main() {
    fs.mkdirSync(OUT, { recursive: true });
    const browser = findBrowser();
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'simlab-shot-'));
    const server = await serve();
    console.log(`Navegador: ${browser}`);
    console.log(`Sirviendo ${path.relative(process.cwd(), ROOT) || '.'} en http://127.0.0.1:${HTTP_PORT}/`);

    const child = spawn(browser, [
        '--headless=new',
        '--hide-scrollbars',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
        '--allow-file-access-from-files',
        '--mute-audio',
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${profile}`,
        '--window-size=1440,900',
        'about:blank'
    ], { stdio: 'ignore' });

    try {
        // El puerto tarda en levantar: se reintenta hasta 15 s.
        let version;
        for (let i = 0; i < 60 && !version; i++) {
            try { version = await httpJson(`http://127.0.0.1:${PORT}/json/version`); }
            catch { await sleep(250); }
        }
        if (!version) throw new Error('El navegador no abrió el puerto de depuración');

        // Se abre una pestaña nueva; las versiones recientes exigen PUT.
        const newTab = `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(PAGE_URL)}`;
        let target;
        try { target = await httpJson(newTab, { method: 'PUT' }); }
        catch { target = await httpJson(newTab); }

        const cdp = connect(target.webSocketDebuggerUrl);
        await cdp.ready;
        await cdp.send('Page.enable');
        await cdp.send('Runtime.enable');

        const loaded = cdp.once('Page.loadEventFired').catch(() => null);
        await cdp.send('Page.navigate', { url: PAGE_URL });
        await loaded;

        await waitForApp(cdp);
        // Tailwind del CDN aplica estilos después del load: se le da margen.
        await sleep(2500);
        console.log('Capturando…');
        await captureDesktop(cdp);
        await captureMobile(cdp);
        await captureOg(cdp);

        cdp.close();
        console.log('Listo: assets/landing/');
    } finally {
        child.kill();
        server.close();
        // Windows tarda en soltar los archivos del perfil: se reintenta y, si
        // sigue bloqueado, se deja en el temporal sin romper la ejecución.
        for (let i = 0; i < 10; i++) {
            try { fs.rmSync(profile, { recursive: true, force: true }); break; }
            catch { await sleep(400); }
        }
    }
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });

