/**
 * transition.js — the "column wipe" that covers the page while the role changes.
 *
 * Sequence: columns grow down (cover) → label appears → `swap()` runs while the
 * page is fully hidden → columns shrink away (reveal) → cleanup.
 * Everything animates `transform`/`opacity` via the Web Animations API.
 */
(function (App) {
  'use strict';

  const { sleep } = App.utils;

  const STAGGER = 45;   // ms between neighbouring columns
  const DURATION = 400; // ms per column
  const HOLD_BEFORE_SWAP = 60;
  const HOLD_AFTER_SWAP = 460;
  const EASE = 'cubic-bezier(.7,0,.3,1)';

  let wipe;
  let columns;
  let labelEl;
  let busy = false;

  function build() {
    const count = innerWidth < 700 ? 7 : 12;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += '<i style="left:' + (i * 100 / count) + '%;width:' + (100 / count + .2) + '%"></i>';
    }
    wipe = document.createElement('div');
    wipe.className = 'wipe';
    wipe.setAttribute('aria-hidden', 'true');
    wipe.innerHTML = html + '<div class="wl"></div>';
    document.body.appendChild(wipe);
    columns = Array.from(wipe.querySelectorAll('i'));
    labelEl = wipe.querySelector('.wl');
  }

  function sweep(from, to, origin) {
    return Promise.all(columns.map((col, i) => col.animate(
      [{ transform: 'scaleY(' + from + ')', transformOrigin: origin }, { transform: 'scaleY(' + to + ')', transformOrigin: origin }],
      { duration: DURATION, delay: i * STAGGER, easing: EASE, fill: 'forwards' },
    ).finished));
  }

  function showLabel(visible) {
    const shown = { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' };
    const hiddenIn = { opacity: 0, transform: 'scale(.7)', filter: 'blur(14px)' };
    const hiddenOut = { opacity: 0, transform: 'scale(1.25)', filter: 'blur(14px)' };
    return labelEl.animate(visible ? [hiddenIn, shown] : [shown, hiddenOut], {
      duration: visible ? 450 : 380,
      delay: visible ? columns.length * STAGGER * .5 : 0,
      easing: 'cubic-bezier(.2,.9,.3,1)',
      fill: 'forwards',
    }).finished;
  }

  App.transition = {
    /**
     * @param {string} title  text shown in the middle of the wipe
     * @param {{swap: Function, reveal?: Function}} hooks
     *        swap   — called while the page is fully covered
     *        reveal — called as the cover starts to open
     */
    async run(title, hooks) {
      if (busy) return false;
      busy = true;
      if (!wipe) build();

      labelEl.innerHTML = '<small>Переходимо до ролі</small>' + title;
      wipe.style.display = 'block';

      await Promise.all([sweep(0, 1, '50% 0'), showLabel(true)]);
      await sleep(HOLD_BEFORE_SWAP);
      hooks.swap();
      await sleep(HOLD_AFTER_SWAP);

      const closing = Promise.all([sweep(1, 0, '50% 100%'), showLabel(false)]);
      if (hooks.reveal) hooks.reveal();
      await closing;

      wipe.style.display = 'none';
      [labelEl].concat(columns).forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      busy = false;
      return true;
    },
  };
})((window.App = window.App || {}));
