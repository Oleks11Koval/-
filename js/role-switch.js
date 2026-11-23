/**
 * role-switch.js — header IT | Content toggle.
 */
(function (App) {
  'use strict';

  const { $, $$, prefersReducedMotion } = App.utils;

  function change(role) {
    if (role === App.roles.get()) return;
    App.mobileMenu.close(); // collapse the burger panel right away

    if (prefersReducedMotion) {
      App.roles.apply(role);
      return;
    }
    App.transition.run(App.roles.LABELS[role], {
      swap: () => App.roles.apply(role, { replay: false }),
      reveal: () => App.roles.replay(),
    });
  }

  App.roleSwitch = {
    init() {
      $$('#sw button').forEach((btn) => {
        btn.addEventListener('click', () => change(btn.dataset.role));
      });
    },
  };
})((window.App = window.App || {}));
