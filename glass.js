import { lerp } from './utils.js';

export function initCursor() {
  if (window.matchMedia('(hover:none), (pointer:coarse)').matches) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'liquid-cursor-dot';
  ring.className = 'liquid-cursor-ring';
  Object.assign(dot.style, {
    position: 'fixed', top: 0, left: 0, width: '8px', height: '8px',
    borderRadius: '50%', background: 'var(--accent)', pointerEvents: 'none',
    zIndex: 'var(--z-cursor)', transform: 'translate(-50%,-50%)', mixBlendMode: 'difference',
  });
  Object.assign(ring.style, {
    position: 'fixed', top: 0, left: 0, width: '34px', height: '34px',
    borderRadius: '50%', border: '1.5px solid var(--accent)', pointerEvents: 'none',
    zIndex: 'var(--z-cursor)', transform: 'translate(-50%,-50%)',
    transition: 'width .25s var(--ease-glass), height .25s var(--ease-glass), opacity .25s',
    boxShadow: '0 0 18px 2px color-mix(in srgb, var(--accent) 45%, transparent)',
  });
  document.body.append(dot, ring);

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;
  let ringScale = 1;

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    document.documentElement.style.setProperty('--mx', `${mx}px`);
    document.documentElement.style.setProperty('--my', `${my}px`);

    const target = e.target.closest('a, button, .glass-card, .dock-item, .icon-btn');
    ringScale = target ? 1.8 : 1;
    ring.style.opacity = '1';
  });

  window.addEventListener('pointerdown', () => (ring.style.width = ring.style.height = `${34 * ringScale * .82}px`));
  window.addEventListener('pointerup', () => (ring.style.width = ring.style.height = `${34 * ringScale}px`));
  window.addEventListener('pointerleave', () => (ring.style.opacity = '0'));

  function raf() {
    rx = lerp(rx, mx, 0.18);
    ry = lerp(ry, my, 0.18);
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    ring.style.width = ring.style.height = `${34 * ringScale}px`;
    requestAnimationFrame(raf);
  }
  raf();
}
