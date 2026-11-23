/**
 * pixel-art.js — renders tiny 'X'/'.' bitmaps as crisp inline SVG.
 * Used by the floating background sprites and the logo easter-egg.
 */
(function (App) {
  'use strict';

  const SPRITES = {
    heart: ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'],
    ghost: ['..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XXXXXXXX', 'XX.XX.XX'],
    pacman: ['..XXXX..', '.XXXXXX.', 'XXXXXX..', 'XXXX....', 'XXXXXX..', '.XXXXXX.', '..XXXX..'],
  };

  /** @returns {string} SVG markup for `bitmap`, `width` px wide. */
  function toSvg(bitmap, color, width) {
    const w = bitmap[0].length;
    const h = bitmap.length;
    let rects = '';
    bitmap.forEach((row, y) => {
      for (let x = 0; x < w; x++) {
        if (row.charAt(x) === 'X') rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    });
    return '<svg width="' + width + '" height="' + (width * h / w) + '" viewBox="0 0 ' + w + ' ' + h +
      '" fill="' + color + '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">' + rects + '</svg>';
  }

  App.pixelArt = { SPRITES, toSvg };
})((window.App = window.App || {}));
