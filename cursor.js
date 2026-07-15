import { storage } from './storage.js';

export function initBackground() {
  const scene = document.createElement('div');
  scene.className = 'bg-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = `
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
    <canvas id="particle-canvas"></canvas>
    <div class="grain"></div>
  `;
  document.body.prepend(scene);

  const particlesOn = storage.get('settings:particles', true);
  scene.querySelector('#particle-canvas').style.display = particlesOn ? 'block' : 'none';

  const motionOn = storage.get('settings:motion', true);
  if (!motionOn) return;

  const blobs = [...scene.querySelectorAll('.blob')];
  window.addEventListener('pointermove', (e) => {
    const px = (e.clientX / innerWidth - 0.5);
    const py = (e.clientY / innerHeight - 0.5);
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 6; // background layer moves ~10px per spec, blobs vary slightly
      b.style.translate = `${px * depth}px ${py * depth}px`;
    });
  });

  return scene;
}
