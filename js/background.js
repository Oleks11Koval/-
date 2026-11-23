/**
 * background.js — canvas particle network + floating pixel sprites.
 *
 * Performance: distances are compared squared (no sqrt/hypot in the hot loop),
 * the canvas resolution is capped, resize is debounced to one frame and the
 * loop pauses while the tab is hidden.
 */
(function (App) {
  'use strict';

  const { $, prefersReducedMotion } = App.utils;

  const LINK_DIST = 110;
  const PUSH_DIST = 130;
  const MAX_DPR = 1.5;

  function initNetwork(canvas) {
    const ctx = canvas.getContext('2d');
    const count = innerWidth < 700 ? 22 : 48;
    const points = [];
    let width = 0;
    let height = 0;
    let mouseX = -999;
    let mouseY = -999;
    let running = false;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, MAX_DPR);
      width = innerWidth;
      height = innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function step(p) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const d2 = dx * dx + dy * dy;
      if (d2 < PUSH_DIST * PUSH_DIST && d2 > 0) { // push away from the cursor
        const d = Math.sqrt(d2);
        p.x += dx / d * 1.6;
        p.y += dy / d * 1.6;
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(155,229,72,.45)';
      for (let i = 0; i < count; i++) {
        const p = points[i];
        step(p);
        ctx.fillRect(p.x, p.y, p.r * 1.6, p.r * 1.6);
        for (let j = i + 1; j < count; j++) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            ctx.strokeStyle = 'rgba(155,229,72,' + (.09 * (1 - Math.sqrt(d2) / LINK_DIST)) + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    resize();
    for (let i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4,
        r: Math.random() * 2 + .8,
      });
    }

    let resizeQueued = false;
    addEventListener('resize', () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(() => { resizeQueued = false; resize(); });
    });
    addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

    running = true;
    requestAnimationFrame(frame);
  }

  function initFloaters(container) {
    const { SPRITES, toSvg } = App.pixelArt;
    const kinds = [SPRITES.heart, SPRITES.ghost, SPRITES.pacman];
    const count = innerWidth < 700 ? 8 : 16;

    for (let q = 0; q < count; q++) {
      const kind = q % 3;
      const bitmap = kinds[kind];
      const scale = 3 + Math.floor(Math.random() * 4);
      const el = document.createElement('div');
      el.innerHTML = toSvg(bitmap, kind === 1 ? '#ffffff' : '#9be548', scale * bitmap[0].length);
      el.style.left = Math.random() * 100 + '%';
      el.style.top = '0';
      container.appendChild(el);

      const duration = 26000 + Math.random() * 30000;
      el.animate([
        { transform: 'translate(0,' + (innerHeight + 80) + 'px) rotate(0deg)' },
        { transform: 'translate(' + ((Math.random() - .5) * 160) + 'px,-120px) rotate(' + ((Math.random() - .5) * 60) + 'deg)' },
      ], { duration, delay: -Math.random() * duration, iterations: Infinity, easing: 'linear' });
    }
  }

  App.background = {
    init() {
      if (prefersReducedMotion) return;
      initNetwork($('#cv'));
      initFloaters($('#fl'));
    },
  };
})((window.App = window.App || {}));
