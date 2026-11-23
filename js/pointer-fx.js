/**
 * pointer-fx.js — mouse-driven micro-interactions, all via ONE delegated
 * listener per event type (instead of dozens of per-element listeners):
 *   .g     cursor-following glow (CSS vars --mx / --my)
 *   .tilt  3D tilt
 *   .btn   magnetic pull + click ripple
 *
 * Mouse moves are applied once per animation frame.
 */
(function (App) {
  'use strict';

  let pendingEvent = null;
  let frameId = 0;

  function localPoint(e, el) {
    const r = el.getBoundingClientRect();
    return { r, x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function applyMove(e) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const glass = target.closest('.g');
    if (glass) {
      const p = localPoint(e, glass);
      glass.style.setProperty('--mx', p.x + 'px');
      glass.style.setProperty('--my', p.y + 'px');
    }

    const tilt = target.closest('.tilt');
    if (tilt) {
      const p = localPoint(e, tilt);
      const x = p.x / p.r.width - .5;
      const y = p.y / p.r.height - .5;
      tilt.style.transform = 'perspective(800px) rotateY(' + x * 14 + 'deg) rotateX(' + (-y * 14) + 'deg) scale(1.02)';
    }

    const btn = target.closest('.btn');
    if (btn) {
      const p = localPoint(e, btn);
      btn.style.transform = 'translate(' + ((p.x - p.r.width / 2) * .25) + 'px,' + ((p.y - p.r.height / 2) * .35) + 'px)';
    }
  }

  function flush() {
    frameId = 0;
    if (pendingEvent) applyMove(pendingEvent);
    pendingEvent = null;
  }

  function onMove(e) {
    pendingEvent = e;
    if (!frameId) frameId = requestAnimationFrame(flush);
  }

  function onLeave(e) {
    if (!(e.target instanceof Element)) return;
    pendingEvent = null; // drop a queued move so it can't re-apply after leaving
    ['.tilt', '.btn'].forEach((selector) => {
      const el = e.target.closest(selector);
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
  }

  function onClick(e) {
    const btn = e.target instanceof Element && e.target.closest('.btn');
    if (!btn) return;
    const p = localPoint(e, btn);
    const size = Math.max(p.r.width, p.r.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (p.x - size / 2) + 'px;top:' + (p.y - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }

  App.pointerFx = {
    init() {
      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseout', onLeave);
      document.addEventListener('click', onClick);
    },
  };
})((window.App = window.App || {}));
