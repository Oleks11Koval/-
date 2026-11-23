/**
 * roles.js — single source of truth for which role ("it" | "ct") is shown.
 *
 * The role lives on <html data-role="…">; CSS uses it to show the matching
 * content and nav links. This module keeps the rest of the UI in sync.
 */
(function (App) {
  'use strict';

  const { $, $$, root } = App.utils;

  const TITLES = {
    it: 'Hack’11 Мотивашка — Олексій · IT Resp',
    ct: 'Hack’11 Мотивашка — Олексій · Content Resp',
  };
  const LABELS = {
    it: 'IT Responsible',
    ct: 'Content Responsible',
  };

  let current = root.dataset.role || 'it';

  function syncSwitch(role) {
    const sw = $('#sw');
    sw.dataset.r = role;
    $$('button', sw).forEach((btn) => {
      const on = btn.dataset.role === role;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  App.roles = {
    LABELS,

    get() { return current; },

    /** Nav links that belong to the active role (plus shared ones). */
    navLinks() {
      return $$('.nav a').filter((a) => !a.dataset.r || a.dataset.r === current);
    },

    /** Re-arm the reveal animations of the active role's content. */
    replay() {
      App.reveal.replay($('.role[data-role="' + current + '"]'));
    },

    /** Switch the visible role. Pass { replay: false } to animate later. */
    apply(role, options) {
      current = role;
      root.dataset.role = role;
      syncSwitch(role);
      document.title = TITLES[role];
      App.mobileMenu.close();
      window.scrollTo({ top: 0, behavior: 'instant' });
      App.scrollSpy.update();
      if (!options || options.replay !== false) App.roles.replay();
    },
  };
})((window.App = window.App || {}));
