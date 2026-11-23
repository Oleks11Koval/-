/**
 * utils.js — tiny dependency-free helpers shared by all modules.
 *
 * Architecture note: scripts are classic (non-module) files loaded with `defer`
 * in a fixed order, and every file exposes ONE object on the `App` namespace.
 * This keeps the site working when opened straight from disk (file://), where
 * browsers block ES-module imports.
 */
(function (App) {
  'use strict';

  const root = document.documentElement;

  App.utils = {
    root,

    /** True when the user asked the OS to minimise motion. */
    prefersReducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,

    $(selector, scope) {
      return (scope || document).querySelector(selector);
    },

    $$(selector, scope) {
      return Array.from((scope || document).querySelectorAll(selector));
    },

    /** Promise-based timeout. */
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /** Collapse bursts of calls into at most one call per animation frame. */
    rafThrottle(fn) {
      let queued = false;
      return function throttled() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          fn();
        });
      };
    },

    /** Escape text before putting it into an innerHTML template. */
    escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, (ch) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
      ));
    },
  };
})((window.App = window.App || {}));
