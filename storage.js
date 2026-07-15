import { $$ } from './utils.js';
import { storage } from './storage.js';
import { applyMotionPreference } from './motion.js';

const KEYS = ['motion', 'blur', 'particles', 'sound', 'transparency', 'animations'];

function applyBlur(enabled) {
  document.documentElement.style.setProperty('--_blur-override', enabled ? '' : '0px');
  $$('.glass, .glass-panel, .floating-nav, .floating-dock, .floating-search').forEach((el) => {
    el.style.backdropFilter = enabled ? '' : 'none';
    el.style.webkitBackdropFilter = enabled ? '' : 'none';
  });
}

function applyTransparency(enabled) {
  document.body.style.setProperty('--glass-tint', enabled ? '' : 'rgba(20,20,28,.92)');
}

export function initSettings() {
  const toggles = $$('[data-setting]');
  toggles.forEach((toggle) => {
    const key = toggle.dataset.setting;
    const value = storage.get(`settings:${key}`, true);
    toggle.checked = value;
    toggle.addEventListener('change', () => {
      storage.set(`settings:${key}`, toggle.checked);
      reapply(key, toggle.checked);
    });
  });
}

function reapply(key, value) {
  switch (key) {
    case 'motion':
      applyMotionPreference();
      break;
    case 'blur':
      applyBlur(value);
      break;
    case 'transparency':
      applyTransparency(value);
      break;
    case 'particles': {
      const canvas = document.getElementById('particle-canvas');
      if (canvas) canvas.style.display = value ? 'block' : 'none';
      break;
    }
    default:
      break;
  }
}

export function applyStoredSettingsOnLoad() {
  applyMotionPreference();
  applyBlur(storage.get('settings:blur', true));
  applyTransparency(storage.get('settings:transparency', true));
}
