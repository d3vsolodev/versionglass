import { $, $$, throttle } from './utils.js';

export function initNavigation() {
  const nav = $('.floating-nav');
  if (nav) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', throttle(() => {
      const y = window.scrollY;
      if (y > lastY && y > 120) nav.classList.add('nav-hidden');
      else nav.classList.remove('nav-hidden');
      lastY = y;
    }, 80));
  }

  // Magnetic dock
  $$('.dock-item').forEach((item) => {
    item.addEventListener('pointermove', (e) => {
      const rect = item.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      item.style.transform = `translateY(-10px) scale(1.18) translateX(${dx * 0.12}px)`;
    });
    item.addEventListener('pointerleave', () => (item.style.transform = ''));
  });

  // Search bar expand + fake voice/suggestions
  const search = $('.floating-search input');
  if (search) {
    const list = $('.search-suggestions');
    search.addEventListener('input', () => {
      if (!list) return;
      const q = search.value.trim().toLowerCase();
      list.hidden = q.length === 0;
    });
    const voiceBtn = $('.search-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.add('listening');
        search.placeholder = 'Listening…';
        setTimeout(() => {
          voiceBtn.classList.remove('listening');
          search.placeholder = 'Search VisionGlass…';
        }, 1600);
      });
    }
  }
}
