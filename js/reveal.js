/**
 * reveal.js — fades `.rv` elements in as they scroll into view.
 * `replay(scope)` re-arms the animation (used after a role switch).
 */
(function (App) {
  'use strict';

  const { $$ } = App.utils;
  let observer = null;

  function arm(el) {
    el.classList.remove('in');
    void el.offsetWidth; // restart the CSS animation
    if (observer) observer.observe(el);
    else el.classList.add('in');
  }

  App.reveal = {
    init() {
      const items = $$('.rv');
      items.forEach((el, i) => { el.style.animationDelay = (i % 4) * 0.08 + 's'; });

      if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
      }
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      }, { threshold: .12 });
      items.forEach((el) => observer.observe(el));
    },

    replay(scope) {
      $$('.rv', scope).forEach(arm);
    },
  };
})((window.App = window.App || {}));
