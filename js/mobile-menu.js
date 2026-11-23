/**
 * mobile-menu.js — burger toggle for the collapsible navigation (≤ 860px).
 */
(function (App) {
  'use strict';

  const { $, $$ } = App.utils;
  const MOBILE_MAX = 860;
  let header;
  let burger;

  function setOpen(open) {
    header.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }

  App.mobileMenu = {
    init() {
      header = $('.hd');
      burger = $('#bgr');

      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!header.classList.contains('open'));
      });
      $$('.nav a, .menu__in > .btn').forEach((a) => a.addEventListener('click', () => setOpen(false)));
      document.addEventListener('click', (e) => { if (!header.contains(e.target)) setOpen(false); });
      addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
      addEventListener('resize', () => { if (innerWidth > MOBILE_MAX) setOpen(false); });
    },
    close() { setOpen(false); },
  };
})((window.App = window.App || {}));
