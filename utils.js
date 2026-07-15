import { storage } from './storage.js';
import { $$, emit } from './utils.js';

export const THEMES = [
  { id: 'glass', name: 'Glass', colors: ['#6e56cf', '#2dd4bf', '#f472b6'] },
  { id: 'dark', name: 'Dark', colors: ['#3a3a3a', '#1c1c1c', '#4b4b4b'] },
  { id: 'light', name: 'Light', colors: ['#c9d4ff', '#bdeee2', '#ffd3e6'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0891b2', '#0ea5e9', '#22d3ee'] },
  { id: 'purple', name: 'Purple', colors: ['#9333ea', '#c026d3', '#6d28d9'] },
  { id: 'neon', name: 'Neon', colors: ['#39ff14', '#00e5ff', '#ff00e5'] },
  { id: 'cyber', name: 'Cyber', colors: ['#ff0080', '#7928ca', '#00f0ff'] },
  { id: 'sunset', name: 'Sunset', colors: ['#ff7849', '#ff4d97', '#ffb347'] },
];

export function applyTheme(id) {
  document.body.setAttribute('data-theme', id);
  storage.set('theme', id);
  emit('theme:changed', id);
  $$('.theme-swatch').forEach((el) => {
    el.classList.toggle('active', el.dataset.theme === id);
  });
}

export function initTheme() {
  const saved = storage.get('theme', 'glass');
  applyTheme(saved);

  $$('.theme-swatch').forEach((el) => {
    el.addEventListener('click', () => applyTheme(el.dataset.theme));
  });
}
