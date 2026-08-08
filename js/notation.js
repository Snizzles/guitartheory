// notation.js — Thin wrapper over the vendored abcjs (global `ABCJS`).
// Renders staff notation and wires click-to-hear using each note's MIDI pitches.

'use strict';

import { playMidi } from './audio.js';

function abcjsLib() {
  if (typeof window.ABCJS === 'undefined') {
    console.error('abcjs failed to load — notation cannot render.');
    return null;
  }
  return window.ABCJS;
}

const BASE_PARAMS = {
  add_classes: true,
  // 'resize' makes abcjs emit a viewBox and size the SVG fluidly, so the element's
  // layout box always matches the painted music (never clipped). Do NOT use the
  // `scale` option here: it paints through a transform, which layout ignores, so the
  // container sizes to the *unscaled* height and cuts off the bottom of the staff.
  responsive: 'resize',
  // Legibility is set by staffwidth instead: the music is laid out in this many
  // virtual units and then stretched to the container, so a *smaller* staffwidth
  // renders *larger* notes. 300 is ~1.8x the glyph size of the old 540.
  staffwidth: 300,
  paddingtop: 6,
  paddingbottom: 6,
  paddingleft: 0,
  paddingright: 0
};

// Render an ABC string into `el`. If `clickToHear`, clicking a note plays it.
// Returns the abcjs tune object (or null).
function renderNotation(el, abc, opts = {}) {
  const lib = abcjsLib();
  if (!lib) { el.innerHTML = '<em style="color:var(--text-muted)">Notation couldn’t load — the music engine isn’t available. Try reloading the page.</em>'; return null; }

  const params = { ...BASE_PARAMS, ...opts.params };

  if (opts.clickToHear !== false) {
    params.clickListener = (abcelem) => {
      const midi = (abcelem.midiPitches || []).map(p => p.pitch);
      if (midi.length) {
        playMidi(midi, midi.length > 1 ? 1.0 : 0.6);
        flashNote(abcelem);
      }
    };
  }

  const tunes = lib.renderAbc(el, abc, params);
  return tunes && tunes[0];
}

// Briefly highlight the clicked note's SVG element.
function flashNote(abcelem) {
  const els = abcelem.abselem && abcelem.abselem.elemset;
  if (!els) return;
  els.forEach(node => {
    node.classList && node.classList.add('abc-note-flash');
    setTimeout(() => node.classList && node.classList.remove('abc-note-flash'), 320);
  });
}

export { renderNotation };
