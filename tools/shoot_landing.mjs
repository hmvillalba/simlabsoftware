// tools/shoot_landing.mjs — capturas reales del simulador para la landing.
//
// Uso: node tools/shoot_landing.mjs
//
// Genera, con Chrome headless (sin Puppeteer ni dependencias):
//   assets/landing/simulator-desktop.png  1440x900, tres ventanas abiertas
//   assets/landing/simulator-mobile.png    390x844, vista de celular
//   assets/landing/og.png                 1200x630, imagen para compartir
//
// Cómo funciona: copia index.html a un archivo temporal en la raíz del repo,
// le agrega un script que abre las ventanas del escritorio por las funciones
// públicas de la propia app (openWindow) y lo abre con Chrome. El temporal se
// borra siempre, así el repositorio no queda con archivos de más. Las rutas de
// css/ y js/ son relativas, por eso el temporal va en la raíz y no en tools/.
//
// Requiere Chrome o Edge instalado. Se puede pasar la ruta con CHROME_PATH.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'assets', 'landing');
const TMP = path.join(ROOT, '_shot_tmp.html');

const CANDIDATES = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

const findBrowser = () => {
    const found = CANDIDATES.find(p => fs.existsSync(p));
    if (!found) throw new Error('No se encontró Chrome ni Edge. Definí CHROME_PATH.');
    return found;
};

/** Reparto de ventanas por vista. Se posicionan a mano para que no se tapen. */
const VIEWS = [
    {
        file: 'simulator-desktop.png',
        width: 1440,
        height: 900,
        // [id, left, top, width] — se aplican después de abrirlas.
        windows: [
            ['win-taskmgr', 16, 48, 500],
            ['win-hwmon', 528, 48, 560],
            ['win-vmem', 16, 430, 520]
        ]
    },
    {
        file: 'simulator-mobile.png',
        width: 390,
        height: 844,
        windows: [
            ['win-taskmgr', 4, 44, 380]
        ]
    },
    {
        file: 'og.png',
        width: 1200,
        height: 630,
        windows: [
            ['win-taskmgr', 14, 40, 470],
            ['win-hwmon', 500, 40, 560]
        ]
    }
];

/** Script que se inyecta antes de </body>. */
function injection(windows) {
    return `<script>
// Inyectado por tools/shoot_landing.mjs: abre y ubica las ventanas para la captura.
window.addEventListener('load', function () {
    var boxes = ${JSON.stringify(windows)};
    boxes.forEach(function (box) {
        var id = box[0], left = box[1], top = box[2], width = box[3];
        var el = document.getElementById(id);
        if (!el) return;
        openWindow(id);
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.width = width + 'px';
        el.style.maxHeight = 'calc(100vh - ' + (top + 56) + 'px)';
    });
    // El panel de misión estorba en la composición: queda detrás de las ventanas.
    var panel = document.getElementById('mission-panel');
    if (panel) panel.style.zIndex = '1';
});
</script>`;
}

function shoot(browser, { file, width, height, windows }) {
    fs.writeFileSync(TMP, htmlWith(windows), 'utf8');
    const target = path.join(OUT, file);
    execFileSync(browser, [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        `--window-size=${width},${height}`,
        '--virtual-time-budget=8000',
        `--screenshot=${target}`,
        'file:///' + TMP.replace(/\\/g, '/')
    ], { stdio: 'ignore', timeout: 120000 });
    const kb = (fs.statSync(target).size / 1024).toFixed(0);
    console.log(`  ${file}  ${width}x${height}  ${kb} KB`);
}

function htmlWith(windows) {
    const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    return src.replace('</body>', injection(windows) + '\n</body>');
}

function main() {
    const browser = findBrowser();
    fs.mkdirSync(OUT, { recursive: true });
    console.log('Capturas con ' + browser);
    try {
        for (const view of VIEWS) shoot(browser, view);
    } finally {
        if (fs.existsSync(TMP)) fs.unlinkSync(TMP);
    }
    console.log('Listo: assets/landing/*.png');
}

main();
