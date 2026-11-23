/**
 * skills.js — interactive skills widget: a tile grid plus a detail card that
 * auto-advances (via the CSS-driven `.sk-bar` timer) and supports ←/→ buttons.
 */
(function (App) {
  'use strict';

  const { $, escapeHtml } = App.utils;

  function createWidget(gridEl, cardEl, skills) {
    if (!gridEl || !cardEl || !skills.length) return;
    let current = 0;

    gridEl.innerHTML = skills.map((s, i) =>
      '<button class="tile" type="button" data-i="' + i + '" aria-label="' + escapeHtml(s.name) + '">' +
      s.icon + '<span>' + escapeHtml(s.name) + '</span></button>').join('');
    const tiles = Array.from(gridEl.children);

    function show(index) {
      current = (index + skills.length) % skills.length;
      const skill = skills[current];

      cardEl.classList.remove('swap');
      void cardEl.offsetWidth; // restart the swap animation
      cardEl.classList.add('swap');
      cardEl.innerHTML =
        '<div class="sk-nav"><button type="button" data-step="-1" aria-label="Назад">←</button>' +
        '<button type="button" data-step="1" aria-label="Далі">→</button></div>' +
        '<div class="sk-logo">' + skill.icon + '</div>' +
        '<h4>' + escapeHtml(skill.name) + '</h4><p>' + escapeHtml(skill.text) + '</p><div class="sk-bar"></div>';
      tiles.forEach((tile, i) => tile.classList.toggle('on', i === current));
    }

    gridEl.addEventListener('click', (e) => {
      const tile = e.target.closest('.tile');
      if (tile) show(Number(tile.dataset.i));
    });
    cardEl.addEventListener('click', (e) => {
      const step = e.target.closest('[data-step]');
      if (step) show(current + Number(step.dataset.step));
    });
    cardEl.addEventListener('animationend', (e) => {
      if (e.target.classList.contains('sk-bar')) show(current + 1); // timer finished
    });

    // Don't burn cycles auto-advancing while the widget is off-screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        cardEl.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }).observe(cardEl);
    }

    show(0);
  }

  App.skills = {
    init() {
      createWidget($('#skg'), $('#skc'), App.skillsData.it);
      createWidget($('#skg2'), $('#skc2'), App.skillsData.ct);
    },
  };
})((window.App = window.App || {}));
