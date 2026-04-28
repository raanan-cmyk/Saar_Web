/* ===== ACCESSIBILITY WIDGET ===== */
(function () {
  'use strict';

  const STORAGE_KEY = 'hm_a11y';
  const FONT_CLASSES = ['a11y-font-1', 'a11y-font-2', 'a11y-font-3'];
  const TOGGLE_ACTIONS = [
    'high-contrast',
    'grayscale',
    'highlight-links',
    'readable-font',
    'stop-animations',
    'focus-highlight',
  ];

  // State
  let state = loadState();

  // Elements
  const widget   = document.getElementById('a11yWidget');
  const toggle   = document.getElementById('a11yToggle');
  const panel    = document.getElementById('a11yPanel');
  const closeBtn = document.getElementById('a11yClose');
  const resetBtn = document.getElementById('a11yReset');
  const body     = document.body;

  // ── Open / Close panel ─────────────────────────────────────────
  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closePanel() {
    if (panel.hidden) return;   // already closed – do nothing
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    panel.hidden ? openPanel() : closePanel();
  });

  closeBtn.addEventListener('click', closePanel);

  // Close on outside click (only when panel is actually open)
  document.addEventListener('click', e => {
    if (!panel.hidden && !widget.contains(e.target)) closePanel();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  // ── Font size ───────────────────────────────────────────────────
  document.getElementById('fontIncrease').addEventListener('click', () => {
    state.fontSize = Math.min(state.fontSize + 1, 3);
    applyFontSize();
    saveState();
  });

  document.getElementById('fontDecrease').addEventListener('click', () => {
    state.fontSize = Math.max(state.fontSize - 1, 0);
    applyFontSize();
    saveState();
  });

  document.getElementById('fontReset').addEventListener('click', () => {
    state.fontSize = 0;
    applyFontSize();
    saveState();
  });

  function applyFontSize() {
    FONT_CLASSES.forEach(c => body.classList.remove(c));
    if (state.fontSize > 0) body.classList.add(`a11y-font-${state.fontSize}`);
  }

  // ── Toggle options ──────────────────────────────────────────────
  document.querySelectorAll('.a11y-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      state[action] = !state[action];
      applyAction(action, state[action]);
      updateButton(btn, state[action]);
      saveState();
    });
  });

  function applyAction(action, active) {
    const cls = 'a11y-' + action;
    body.classList.toggle(cls, active);
  }

  function updateButton(btn, active) {
    btn.setAttribute('aria-checked', active ? 'true' : 'false');
  }

  // ── Reset all ───────────────────────────────────────────────────
  resetBtn.addEventListener('click', () => {
    state = defaultState();
    applyAll();
    saveState();

    // Visual feedback
    resetBtn.textContent = '✓ אופס בהצלחה';
    setTimeout(() => { resetBtn.textContent = '↺ אפס הכל'; }, 1500);
  });

  // ── Apply everything ────────────────────────────────────────────
  function applyAll() {
    applyFontSize();

    TOGGLE_ACTIONS.forEach(action => {
      applyAction(action, state[action]);
      const btn = document.querySelector(`.a11y-opt[data-action="${action}"]`);
      if (btn) updateButton(btn, state[action]);
    });
  }

  // ── State helpers ───────────────────────────────────────────────
  function defaultState() {
    return { fontSize: 0, ...Object.fromEntries(TOGGLE_ACTIONS.map(a => [a, false])) };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved ? { ...defaultState(), ...saved } : defaultState();
    } catch { return defaultState(); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  // ── Init: apply saved state on page load ────────────────────────
  applyAll();

})();
