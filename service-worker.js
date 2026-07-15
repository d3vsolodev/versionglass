import { storage } from './storage.js';

export function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || !storage.get('settings:particles', true)) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles, mouse = { x: -9999, y: -9999 };
  const COUNT = Math.min(80, Math.floor((innerWidth * innerHeight) / 22000));
  const LINK_DIST = 130;

  function resize() {
    w = canvas.width = innerWidth * devicePixelRatio;
    h = canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function makeParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const accent = getComputedStyle(document.body).getPropertyValue('--accent-2').trim() || '#8ce8d4';

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        p.x -= dx * 0.012;
        p.y -= dy * 0.012;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.25;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  resize();
  makeParticles();
  step();
}
