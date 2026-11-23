/**
 * main.js — application entry point. Initialises each feature module once the
 * DOM is ready (scripts are `defer`red, so it is). Order matters only where
 * a module reads another's state: roles → reveal/scrollSpy → gate.
 */
(function (App) {
  'use strict';

  const modules = [
    'background',   // canvas network + floating sprites
    'reveal',       // scroll-reveal observer
    'scrollSpy',    // progress bar + active nav link
    'pointerFx',    // glow / tilt / magnetic buttons / ripple
    'mobileMenu',   // burger navigation
    'logoEffect',   // logo easter-egg
    'skills',       // skills widgets
    'roleSwitch',   // header IT | Content toggle
    'gate',         // role chooser (last: needs everything above)
  ];

  modules.forEach((name) => App[name].init());
})(window.App);
