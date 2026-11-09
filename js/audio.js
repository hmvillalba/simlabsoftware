// js/audio.js - Motor de efectos de sonido sintetizados (Web Audio API)

let audioCtx = null;

function playSound(type) {
    if (!osState.audioEnabled) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        // [frecuencia Hz (0 = silencio), duración s]
        const seqs = {
            click: [[1000, 0.03]],
            ok:    [[660, 0.08], [880, 0.12]],
            error: [[240, 0.15], [170, 0.25]],
            alert: [[900, 0.1], [0, 0.06], [900, 0.1], [0, 0.06], [900, 0.1]],
            done:  [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.25]]
        };
        let t = audioCtx.currentTime;
        (seqs[type] || seqs.click).forEach(([freq, dur]) => {
            if (freq > 0) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type === 'error' ? 'sawtooth' : 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.04, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(t); osc.stop(t + dur);
            }
            t += dur;
        });
    } catch (e) { /* audio no disponible */ }
}

function toggleAudio() {
    osState.audioEnabled = !osState.audioEnabled;
    const btn = document.getElementById('btn-audio-toggle');
    if (!btn) return;
    if (osState.audioEnabled) {
        btn.innerHTML = '<i class="fa-solid fa-volume-high text-green-700"></i> FX ON';
        playSound('ok');
    } else {
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark text-red-700"></i> FX OFF';
    }
}
