import { storage } from './storage.js';

let ctx;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function blip({ freq = 440, dur = 0.08, type = 'sine', gain = 0.05 } = {}) {
  if (!storage.get('settings:sound', true)) return;
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(c.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.stop(c.currentTime + dur);
  } catch {
    /* audio context unavailable (autoplay policy) — ignore */
  }
}

export const sfx = {
  hover: () => blip({ freq: 720, dur: 0.05, gain: 0.02 }),
  click: () => blip({ freq: 360, dur: 0.08, gain: 0.05 }),
  open: () => blip({ freq: 520, dur: 0.12, type: 'triangle', gain: 0.05 }),
  close: () => blip({ freq: 260, dur: 0.1, type: 'triangle', gain: 0.05 }),
  notification: () => { blip({ freq: 880, dur: 0.09, gain: 0.05 }); setTimeout(() => blip({ freq: 1180, dur: 0.09, gain: 0.05 }), 90); },
  typing: () => blip({ freq: 300 + Math.random() * 200, dur: 0.02, gain: 0.015 }),
};

export function initAudio() {
  document.body.addEventListener('pointerover', (e) => {
    if (e.target.closest('a, button, .dock-item, .glass-card')) sfx.hover();
  });
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) sfx.click();
  });
}
