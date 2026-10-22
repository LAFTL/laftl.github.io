/* Theme choices and a keyboard-accessible example. No network requests. */
(() => {
  'use strict';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: light)');
  const choices = new Set(['dark', 'system', 'light']);
  let choice = 'dark';
  try {
    const saved = window.localStorage.getItem('laftl-theme');
    if (choices.has(saved)) choice = saved;
  } catch (_) { /* Storage may be blocked; controls still work. */ }

  function applyTheme() {
    const theme = choice === 'system' ? (media.matches ? 'light' : 'dark') : choice;
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#faf9fc' : '#161616';
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice));
    });
  }
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.addEventListener('click', () => {
      if (!choices.has(button.dataset.themeChoice)) return;
      choice = button.dataset.themeChoice;
      try { window.localStorage.setItem('laftl-theme', choice); } catch (_) {}
      applyTheme();
    });
  });
  if (media.addEventListener) media.addEventListener('change', () => { if (choice === 'system') applyTheme(); });
  applyTheme();
  const themeSwitch = document.querySelector('.theme-switch');
  if (themeSwitch) themeSwitch.hidden = false;

  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    if (!tabs.length) return;
    function selectTab(tab) {
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !active;
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', event => {
        const positions = {
          ArrowRight: (index + 1) % tabs.length,
          ArrowLeft: (index - 1 + tabs.length) % tabs.length,
          Home: 0,
          End: tabs.length - 1
        };
        if (!(event.key in positions)) return;
        event.preventDefault();
        const next = tabs[positions[event.key]];
        selectTab(next);
        next.focus();
      });
    });
    selectTab(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
    list.hidden = false;
  });
})();
