/**
 * logo-effect.js — easter-egg: click the logo for pixel hearts and a Pac-Man
 * that eats a row of dots across the screen.
 */
(function (App) {
  'use strict';

  const { $, prefersReducedMotion } = App.utils;
  const { SPRITES, toSvg } = App.pixelArt;

  const HEARTS = 10;
  const DOT_SPACING = 60;

  function spawnHearts(wrap, rect) {
    const cx = rect.left + rect.width / 2;
    for (let i = 0; i < HEARTS; i++) {
      const w = 18 + Math.random() * 16;
      const heart = document.createElement('div');
      heart.innerHTML = toSvg(SPRITES.heart, i % 2 ? '#ffffff' : '#9be548', w);
      heart.style.left = (cx - w / 2) + 'px';
      heart.style.top = (rect.top + rect.height / 2) + 'px';
      wrap.appendChild(heart);

      const dx = (Math.random() - .5) * rect.width * 1.8;
      const dy = 70 + Math.random() * 170;
      heart.animate([
        { transform: 'translate(0,0) scale(.3)', opacity: 1 },
        { transform: 'translate(' + dx * .6 + 'px,-24px) scale(1.25)', opacity: 1, offset: .25 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1)', opacity: 0 },
      ], { duration: 1100 + Math.random() * 600, easing: 'ease-out', fill: 'forwards' });
    }
  }

  function spawnPacman(wrap, rect) {
    const vw = innerWidth;
    const y = rect.bottom + 56;
    const duration = Math.min(2600, Math.max(1500, vw * 1.7));

    for (let k = 0, n = Math.floor(vw / DOT_SPACING); k < n; k++) {
      const x = k * DOT_SPACING + 34;
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.left = x + 'px';
      dot.style.top = (y + 18) + 'px';
      wrap.appendChild(dot);
      dot.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0)' }],
        { duration: 120, delay: (x + 30) / (vw + 120) * duration, fill: 'both' },
      );
    }

    const pac = document.createElement('div');
    pac.className = 'pac';
    pac.style.top = y + 'px';
    wrap.appendChild(pac);
    return pac.animate(
      [{ transform: 'translateX(-60px)' }, { transform: 'translateX(' + (vw + 20) + 'px)' }],
      { duration, easing: 'linear', fill: 'forwards' },
    );
  }

  App.logoEffect = {
    init() {
      const logo = $('#logo');
      const layer = document.createElement('div');
      layer.className = 'fx';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);

      logo.addEventListener('click', () => {
        if (prefersReducedMotion) return;
        logo.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-5px) rotate(-2deg)' },
          { transform: 'translateX(5px) rotate(2deg)' },
          { transform: 'translateX(0)' },
        ], { duration: 260 });

        const rect = logo.getBoundingClientRect();
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:absolute;inset:0';
        layer.appendChild(wrap);
        spawnHearts(wrap, rect);
        spawnPacman(wrap, rect).onfinish = () => wrap.remove();
      });
    },
  };
})((window.App = window.App || {}));
