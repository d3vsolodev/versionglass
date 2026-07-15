import { $$, clamp } from './utils.js';
import { storage } from './storage.js';

export function initGlassParallax() {
  if (!storage.get('settings:motion', true)) return;

  const cards = $$('[data-parallax]');
  window.addEventListener('pointermove', (e) => {
    const px = e.clientX / innerWidth - 0.5;
    const py = e.clientY / innerHeight - 0.5;
    cards.forEach((card) => {
      const depth = Number(card.dataset.parallax) || 4;
      card.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  });
}

export function initTilt() {
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = clamp(-py * 14, -14, 14);
      const ry = clamp(px * 14, -14, 14);
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}
