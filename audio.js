import { initTheme } from './theme.js';
import { initBackground } from './background.js';
import { initParticles } from './particles.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initGlassParallax, initTilt } from './glass.js';
import { initRevealObserver } from './observer.js';
import { applyMotionPreference } from './motion.js';
import { initWidgets } from './widgets.js';
import { initWeather } from './weather.js';
import { initAudio, sfx } from './audio.js';
import { initSettings, applyStoredSettingsOnLoad } from './settings.js';
import { storage } from './storage.js';
import { $, $$, uid } from './utils.js';

/* ---------------- Notification Center ---------------- */
const notifQueue = [];
let notifShowing = false;

function ensureNotifRoot() {
  let root = $('.notif-root');
  if (!root) {
    root = document.createElement('div');
    root.className = 'notif-root';
    Object.assign(root.style, {
      position: 'fixed', top: '20px', right: '20px', zIndex: 'var(--z-notif)',
      display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px',
    });
    document.body.appendChild(root);
  }
  return root;
}

export function notify(title, body, { duration = 4200 } = {}) {
  notifQueue.push({ title, body, duration, id: uid() });
  if (!notifShowing) drainQueue();
}

function drainQueue() {
  if (!notifQueue.length) { notifShowing = false; return; }
  notifShowing = true;
  const { title, body, duration } = notifQueue.shift();
  const root = ensureNotifRoot();
  const card = document.createElement('div');
  card.className = 'glass-panel';
  card.style.cssText = 'padding:14px 16px;animation:scale-in .35s var(--ease-glass) both;';
  card.innerHTML = `<strong style="font-family:var(--font-display);font-size:.9rem;">${title}</strong><p style="margin-top:4px;font-size:.82rem;">${body}</p>`;
  root.appendChild(card);
  sfx.notification();
  setTimeout(() => {
    card.style.transition = 'opacity .3s, transform .3s';
    card.style.opacity = '0';
    card.style.transform = 'translateX(30px)';
    setTimeout(() => { card.remove(); drainQueue(); }, 300);
  }, duration);
}
window.VisionGlassNotify = notify;

/* ---------------- Floating AI Assistant ---------------- */
const KB = [
  { match: /gallery|photo|image/i, reply: 'The Gallery page holds interactive glass cards with hover zoom and 3D tilt — find it in the dock or the nav bar.' },
  { match: /project/i, reply: 'Projects showcases build case studies as glass cards. Open the Projects page from the floating nav to browse them.' },
  { match: /theme|color|dark|light/i, reply: 'Head to Settings → Theme to switch between Glass, Dark, Light, Ocean, Purple, Neon, Cyber and Sunset. Your choice is saved automatically.' },
  { match: /widget|dashboard/i, reply: 'The Dashboard bundles Weather, Clock, Calendar, Music, Notes and Todos into one bento grid of glass cards.' },
  { match: /setting|motion|blur|sound/i, reply: 'Settings lets you toggle motion, blur, particles, sound, transparency and animations independently.' },
  { match: /profile|about|who/i, reply: 'Profile has the bio, skills and social links; About explains the concept behind VisionGlass.' },
  { match: /hi|hello|hey/i, reply: 'Hey! I can help you find your way around VisionGlass — try asking about the gallery, dashboard, or themes.' },
];

function assistantReply(text) {
  const hit = KB.find((k) => k.match.test(text));
  return hit ? hit.reply : "I'm a lightweight guide for this site — try asking about the dashboard, gallery, projects, themes, or settings.";
}

function initAssistant() {
  if ($('.assistant-launcher')) return;

  const launcher = document.createElement('button');
  launcher.className = 'assistant-launcher icon-btn';
  launcher.setAttribute('aria-label', 'Open AI assistant');
  Object.assign(launcher.style, {
    position: 'fixed', bottom: '92px', right: '24px', zIndex: 'var(--z-assistant)',
    width: '54px', height: '54px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
    boxShadow: '0 10px 30px -8px color-mix(in srgb, var(--accent) 60%, transparent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
  });
  launcher.textContent = '✦';
  document.body.appendChild(launcher);

  const panel = document.createElement('div');
  panel.className = 'assistant-panel glass-panel';
  panel.hidden = true;
  Object.assign(panel.style, {
    position: 'fixed', bottom: '156px', right: '24px', zIndex: 'var(--z-assistant)',
    width: 'min(320px, calc(100vw - 48px))', maxHeight: '420px', display: 'flex', flexDirection: 'column',
    padding: '16px', animation: 'scale-in .3s var(--ease-glass) both',
  });
  panel.innerHTML = `
    <div class="row-between" style="margin-bottom:10px;">
      <strong style="font-family:var(--font-display);">VisionGlass Guide</strong>
      <button class="assistant-close icon-btn" aria-label="Close" style="width:28px;height:28px;">×</button>
    </div>
    <div class="assistant-log" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;font-size:.85rem;"></div>
    <form class="assistant-form row" style="margin-top:10px;gap:8px;">
      <input class="assistant-input" placeholder="Ask about this site…" style="flex:1;background:var(--glass-tint);border:1px solid var(--glass-border);border-radius:999px;padding:8px 14px;color:var(--text-primary);" />
      <button class="btn btn-primary" type="submit" style="padding:8px 16px;">Ask</button>
    </form>
  `;
  document.body.appendChild(panel);

  const log = panel.querySelector('.assistant-log');
  const addMsg = (text, who) => {
    const bubble = document.createElement('div');
    bubble.style.cssText = `align-self:${who === 'user' ? 'flex-end' : 'flex-start'};max-width:85%;padding:8px 12px;border-radius:14px;background:${who === 'user' ? 'var(--accent)' : 'var(--glass-tint)'};color:${who === 'user' ? 'var(--accent-contrast)' : 'var(--text-primary)'};`;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  };
  addMsg('Hi! Ask me about the gallery, dashboard, projects, or themes.', 'bot');

  launcher.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    sfx[panel.hidden ? 'close' : 'open']();
  });
  panel.querySelector('.assistant-close').addEventListener('click', () => { panel.hidden = true; sfx.close(); });
  panel.querySelector('.assistant-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = panel.querySelector('.assistant-input');
    const val = input.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    input.value = '';
    setTimeout(() => addMsg(assistantReply(val), 'bot'), 350);
  });
}

/* ---------------- Boot ---------------- */
function boot() {
  initTheme();
  applyStoredSettingsOnLoad();
  initBackground();
  initParticles();
  initCursor();
  initNavigation();
  initGlassParallax();
  initTilt();
  initRevealObserver();
  initAudio();
  initSettings();
  initWidgets();
  initWeather();
  initAssistant();

  $$('a[href]').forEach((a) => {
    if (a.getAttribute('href') === location.pathname.split('/').pop()) a.classList.add('active');
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('js/service-worker.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', boot);
