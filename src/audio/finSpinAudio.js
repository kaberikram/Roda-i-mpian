// ── WEB AUDIO (no bundle — game-show style SFX) ───────────────────────────────
const FinSpinAudio = (function createFinSpinAudio() {
  let ctx = null;
  let mutedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function beep({ f0, f1, t, type = 'sine', vol = 0.14, atk = 0.004 }) {
    if (mutedMotion) return;
    const c = getCtx();
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t0);
    if (f1 != null && Math.abs(f1 - f0) > 1) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + t);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + t);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + t + 0.02);
  }

  function dingCluster(freqs, step, vol) {
    if (mutedMotion) return;
    const c = getCtx();
    let t = c.currentTime + 0.02;
    freqs.forEach((f) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0008, t + step - 0.01);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(t);
      osc.stop(t + step + 0.03);
      t += step * 0.92;
    });
  }

  return {
    setMutedMotion(v) { mutedMotion = !!v; },
    async resume() {
      if (mutedMotion) return;
      const c = getCtx();
      if (c.state === 'suspended') await c.resume();
    },
    playUiStart() {
      dingCluster([523.25, 659.25, 783.99, 987.77], 0.07, 0.1);
    },
    playSpinStart() {
      if (mutedMotion) return;
      const c = getCtx();
      const t0 = c.currentTime;
      const dur = 0.35;
      const osc = c.createOscillator();
      const filt = c.createBiquadFilter();
      const g = c.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t0);
      osc.frequency.exponentialRampToValueAtTime(480, t0 + dur * 0.7);
      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(800, t0);
      filt.frequency.exponentialRampToValueAtTime(5200, t0 + dur * 0.5);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.09, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      osc.connect(filt);
      filt.connect(g);
      g.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
      // airy layer
      const n = c.createBufferSource();
      const buflen = Math.ceil(c.sampleRate * 0.28);
      const buf = c.createBuffer(1, buflen, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < buflen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / buflen);
      n.buffer = buf;
      const bpf = c.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 1400;
      bpf.Q.value = 0.85;
      const ng = c.createGain();
      ng.gain.setValueAtTime(0, t0);
      ng.gain.linearRampToValueAtTime(0.045, t0 + 0.06);
      ng.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.28);
      n.connect(bpf);
      bpf.connect(ng);
      ng.connect(c.destination);
      n.start(t0);
    },
    playTick() {
      beep({ f0: 1850, f1: 400, t: 0.028, type: 'square', vol: 0.07, atk: 0.001 });
    },
    playLandMoney() {
      dingCluster([392, 493.88, 587.33, 783.99, 987.77], 0.055, 0.11);
    },
    playLandBust() {
      if (mutedMotion) return;
      const c = getCtx();
      const t0 = c.currentTime;
      const dur = 0.5;

      const main = c.createOscillator();
      main.type = 'sine';
      main.frequency.setValueAtTime(238, t0);
      main.frequency.linearRampToValueAtTime(88, t0 + dur);

      const mGain = c.createGain();
      mGain.gain.setValueAtTime(0, t0);
      mGain.gain.linearRampToValueAtTime(0.052, t0 + 0.07);
      mGain.gain.linearRampToValueAtTime(0.038, t0 + 0.2);
      mGain.gain.linearRampToValueAtTime(0.00015, t0 + dur);

      const mFilt = c.createBiquadFilter();
      mFilt.type = 'lowpass';
      mFilt.frequency.setValueAtTime(1400, t0);
      mFilt.frequency.linearRampToValueAtTime(420, t0 + dur);

      main.connect(mFilt);
      mFilt.connect(mGain);

      const dub = c.createOscillator();
      dub.type = 'sine';
      dub.frequency.setValueAtTime(119, t0);
      dub.frequency.linearRampToValueAtTime(62, t0 + dur);

      const dGain = c.createGain();
      dGain.gain.setValueAtTime(0, t0 + 0.02);
      dGain.gain.linearRampToValueAtTime(0.018, t0 + 0.1);
      dGain.gain.linearRampToValueAtTime(0.00012, t0 + dur * 0.92);

      dub.connect(dGain);

      const len = Math.ceil(c.sampleRate * 0.2);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / Math.max(1, len - 1));
        data[i] = (Math.random() * 2 - 1) * w * w * w;
      }
      const n = c.createBufferSource();
      n.buffer = buf;

      const nLp = c.createBiquadFilter();
      nLp.type = 'lowpass';
      nLp.frequency.value = 680;
      nLp.Q.value = 0.4;

      const nGain = c.createGain();
      nGain.gain.setValueAtTime(0, t0 + 0.03);
      nGain.gain.linearRampToValueAtTime(0.014, t0 + 0.09);
      nGain.gain.linearRampToValueAtTime(0.0001, t0 + 0.22);

      n.connect(nLp);
      nLp.connect(nGain);

      const tail = c.createGain();
      tail.gain.value = 1;
      mGain.connect(tail);
      dGain.connect(tail);
      nGain.connect(tail);

      const soft = c.createDynamicsCompressor();
      soft.threshold.setValueAtTime(-30, t0);
      soft.knee.setValueAtTime(28, t0);
      soft.ratio.setValueAtTime(2.8, t0);
      soft.attack.setValueAtTime(0.035, t0);
      soft.release.setValueAtTime(0.22, t0);

      tail.connect(soft);
      soft.connect(c.destination);

      main.start(t0);
      main.stop(t0 + dur + 0.04);
      dub.start(t0);
      dub.stop(t0 + dur + 0.04);
      n.start(t0 + 0.025);
    },
    playLetterGood() {
      beep({ f0: 523.25, f1: 659.25, t: 0.09, type: 'triangle', vol: 0.16 });
      setTimeout(() => beep({ f0: 880, f1: 1174.66, t: 0.06, type: 'sine', vol: 0.1 }), 55);
    },
    playLetterVowel() {
      beep({ f0: 784, f1: 1046.5, t: 0.1, type: 'sine', vol: 0.12 });
      setTimeout(() => beep({ f0: 1318.5, f1: 1567.98, t: 0.07, type: 'triangle', vol: 0.08 }), 45);
    },
    playLetterBad() {
      beep({ f0: 180, f1: 130, t: 0.18, type: 'sawtooth', vol: 0.12 });
      setTimeout(() => beep({ f0: 140, f1: 90, t: 0.12, type: 'square', vol: 0.08 }), 70);
    },
    playRoundSolve() {
      dingCluster([392, 493.88, 587.33, 739.99, 880], 0.065, 0.12);
      setTimeout(() => dingCluster([1046.5, 1318.5], 0.08, 0.09), 230);
    },
    playRoundTaDa() {
      dingCluster([523.25, 659.25, 783.99, 1046.5], 0.08, 0.11);
    },
    playGameOverFanfare() {
      dingCluster([392, 493.88, 587.33, 783.99, 987.77, 1174.66], 0.07, 0.1);
      setTimeout(() => beep({ f0: 523.25, f1: 523.25, t: 0.45, type: 'sine', vol: 0.08, atk: 0.05 }), 480);
    },
    playFailBuzz() {
      beep({ f0: 100, f1: 85, t: 0.35, type: 'square', vol: 0.1 });
    },
    playKeyTap() {
      beep({ f0: 660, f1: 520, t: 0.025, type: 'sine', vol: 0.05, atk: 0.001 });
    },
  };
})();

export default FinSpinAudio;
