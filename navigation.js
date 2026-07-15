import { storage } from './storage.js';

export function applyMotionPreference() {
  const enabled = storage.get('settings:motion', true);
  document.body.classList.toggle('no-motion', !enabled);
}
