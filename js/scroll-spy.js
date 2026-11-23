/**
 * scroll-spy.js — scroll progress bar + highlighting of the current nav link.
 *
 * Performance: work is coalesced to one run per frame, the progress bar uses
 * `transform` (no layout), and class changes are written only when they differ.
 */
(function (App) {
  'use strict';

  const { $, rafThrottle, root } = App.utils;
  const TRIGGER = 0.4; // a section is "current" once its top passes 40% of the viewport

  let progress;
  const sectionCache = new Map();

  function sectionFor(link) {
    let section = sectionCache.get(link);
    if (section === undefined) {
      section = $(link.getAttribute('href'));
      sectionCache.set(link, section);
    }
    return section;
  }

  function measure() {
    const max = root.scrollHeight - innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';

    const links = App.roles.navLinks();
    let current = -1;
    links.forEach((link, i) => {
      const section = sectionFor(link);
      if (section && section.getBoundingClientRect().top < innerHeight * TRIGGER) current = i;
    });
    links.forEach((link, i) => {
      const on = i === current;
      if (link.classList.contains('on') !== on) link.classList.toggle('on', on);
    });
  }

  const update = rafThrottle(measure);

  App.scrollSpy = {
    init() {
      progress = $('#pg');
      addEventListener('scroll', update, { passive: true });
      addEventListener('resize', update);
      update();
    },
    update,
  };
})((window.App = window.App || {}));
