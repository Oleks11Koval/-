/**
 * gate.js — the full-screen "who do you want to see me as?" chooser.
 * While it is open the page behind it is `inert` (no focus, no clicks).
 */
(function (App) {
  'use strict';

  const { $, $$, root } = App.utils;

  const EXIT_REPLAY_DELAY = 350; // start revealing content while the gate fades
  const EXIT_REMOVE_DELAY = 950; // after the gate's CSS transition ends

  let gate;
  let behind; // elements made inert while the gate is open

  function setInert(value) {
    behind.forEach((el) => { el.inert = value; });
  }

  function choose(role) {
    if (gate.classList.contains('out')) return;

    App.roles.apply(role, { replay: false });
    gate.classList.add('out');
    root.classList.remove('locked');
    setInert(false);

    setTimeout(() => App.roles.replay(), EXIT_REPLAY_DELAY);
    setTimeout(() => {
      gate.style.display = 'none';
      const active = $('#sw button.on');
      if (active) active.focus({ preventScroll: true });
    }, EXIT_REMOVE_DELAY);
  }

  App.gate = {
    init() {
      gate = $('#gate');
      if (!gate) { root.classList.remove('locked'); return; }

      behind = $$('.hw, main, #contacts');
      setInert(true);

      $$('[data-pick]', gate).forEach((btn) => {
        btn.addEventListener('click', () => choose(btn.dataset.pick));
      });
      const first = $('[data-pick]', gate);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 900);
    },
  };
})((window.App = window.App || {}));
