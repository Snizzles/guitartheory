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
  responsive: 'resize',
  add_classes: true,
  paddingtop: 6,
  paddingbottom: 6,
  paddingleft: 0,
  paddingright: 0,
  staffwidth: 540
};

// Render an ABC string into `el`. If `clickToHear`, clicking a note plays it.
// Returns the abcjs tune object (or null).
function renderNotation(el, abc, opts = {}) {
  const lib = abcjsLib();
  if (!lib) { el.innerHTML = '<em style="color:var(--text-muted)">Notation unavailable</em>'; return null; }

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
