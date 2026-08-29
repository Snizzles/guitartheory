// fretboard.js — Guitar fretboard model + SVG diagram, for the sight-reading decks.
//
// Guitar is a transposing instrument: its music is written one octave HIGHER than it
// sounds. So the staff shows `written`, the neck and the audio use `sounding`, and the
// two differ by 12 semitones. Everything here works in sounding pitch unless a name
// says otherwise.

'use strict';

import { pitchClass, parseNote, CHROMATIC_SHARP, CHROMATIC_FLAT } from './theory.js';

// MIDI number of a note name + octave (C4 = 60, so E2 = 40).
function midiOf(name, octave) {
  const p = parseNote(name);
  const oct = p.octave != null ? p.octave : octave;
  return 12 * (oct + 1) + pitchClass(name);
}
function midiToNote(midi) {
  return { name: CHROMATIC_SHARP[((midi % 12) + 12) % 12], octave: Math.floor(midi / 12) - 1 };
}
// Enharmonic partner for a black-key pitch ("A#" → "Bb"), else null.
function enharmonicOf(name) {
  const pc = pitchClass(name);
  const flat = CHROMATIC_FLAT[pc];
  return flat !== CHROMATIC_SHARP[pc] ? flat : null;
}

// Standard tuning, low string first. `string: 0` is the low E (6th string).
const STANDARD_TUNING = [
  { label: 'E', midi: midiOf('E', 2) },
  { label: 'A', midi: midiOf('A', 2) },
  { label: 'D', midi: midiOf('D', 3) },
  { label: 'G', midi: midiOf('G', 3) },
  { label: 'B', midi: midiOf('B', 3) },
  { label: 'e', midi: midiOf('E', 4) }
];

const GUITAR_WRITTEN_OFFSET = 12;   // written pitch is an octave above sounding

// Every place a given sounding pitch can be played within `maxFret`.
function positionsForMidi(midi, maxFret = 5, tuning = STANDARD_TUNING) {
  const out = [];
  tuning.forEach((s, i) => {
    const fret = midi - s.midi;
    if (fret >= 0 && fret <= maxFret) out.push({ string: i, fret });
  });
  return out;
}

// Every playable (string, fret, midi) within range — the pool the decks draw from.
function fretboardPositions(maxFret = 5, tuning = STANDARD_TUNING) {
  const out = [];
  tuning.forEach((s, i) => {
    for (let f = 0; f <= maxFret; f++) out.push({ string: i, fret: f, midi: s.midi + f });
  });
  return out;
}

const INLAY_FRETS = [3, 5, 7, 9];

// Render a fretboard diagram as an SVG string. `marks` is [{string,fret}]; the low E
// is drawn at the bottom, as when looking down at the neck while playing.
// With `interactive: true` the diagram also carries a transparent hit target and a
// hidden marker circle for every (string, fret) cell, so a caller can turn a tap into
// right/wrong feedback without needing to know any of the geometry.
function fretboardSVG(marks = [], { frets = 5, tuning = STANDARD_TUNING, interactive = false, showNames = false, onlyString = null } = {}) {
  const padL = 40, padR = 12, padT = 14, padB = 22;
  const fretW = 46, stringGap = 17;
  const boardW = fretW * frets;
  const w = padL + boardW + padR;
  const h = padT + stringGap * (tuning.length - 1) + padB;
  const yOf = i => padT + (tuning.length - 1 - i) * stringGap;   // string 0 (low E) at bottom
  const xOfFret = f => padL + f * fretW;
  const centreOf = f => padL + (f - 0.5) * fretW;                // where a finger sits

  const p = [];
  p.push(`<svg class="fb-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Guitar fretboard diagram">`);

  // inlay markers
  INLAY_FRETS.filter(f => f <= frets).forEach(f =>
    p.push(`<circle class="fb-inlay" cx="${centreOf(f)}" cy="${(yOf(2) + yOf(3)) / 2}" r="4"/>`));
  if (frets >= 12) {
    p.push(`<circle class="fb-inlay" cx="${centreOf(12)}" cy="${yOf(4)}" r="4"/>`);
    p.push(`<circle class="fb-inlay" cx="${centreOf(12)}" cy="${yOf(1)}" r="4"/>`);
  }

  // frets, then the nut on top of fret 0
  for (let f = 1; f <= frets; f++)
    p.push(`<line class="fb-fret" x1="${xOfFret(f)}" y1="${yOf(5)}" x2="${xOfFret(f)}" y2="${yOf(0)}"/>`);
  p.push(`<line class="fb-nut" x1="${padL}" y1="${yOf(5)}" x2="${padL}" y2="${yOf(0)}"/>`);

  // strings + their open-note labels
  tuning.forEach((s, i) => {
    p.push(`<line class="fb-string" x1="${padL}" y1="${yOf(i)}" x2="${padL + boardW}" y2="${yOf(i)}"/>`);
    p.push(`<text class="fb-open-label" x="6" y="${yOf(i) + 4}">${s.label}</text>`);
  });

  // note names at every position (the reference map)
  if (showNames) {
    tuning.forEach((s2, i) => {
      if (onlyString != null && i !== onlyString) return;
      for (let f = 0; f <= frets; f++) {
        const n = midiToNote(s2.midi + f).name.replace('#', '\u266f');
        const cx = f === 0 ? padL - 13 : centreOf(f);
        p.push(`<circle class="fb-namebg" cx="${cx}" cy="${yOf(i)}" r="7.5"/>`);
        p.push(`<text class="fb-name" x="${cx}" y="${yOf(i) + 3}" text-anchor="middle">${n}</text>`);
      }
    });
  }

  // fret numbers
  for (let f = 1; f <= frets; f++)
    p.push(`<text class="fb-fretnum" x="${centreOf(f)}" y="${h - 7}" text-anchor="middle">${f}</text>`);

  // the marked positions
  marks.forEach(m => {
    if (m.fret === 0) {
      // open string: a ring just behind the nut, the usual chord-chart convention
      p.push(`<circle class="fb-open" cx="${padL - 13}" cy="${yOf(m.string)}" r="5.5"/>`);
    } else {
      p.push(`<circle class="fb-dot" cx="${centreOf(m.fret)}" cy="${yOf(m.string)}" r="7"/>`);
    }
  });

  if (interactive) {
    // hidden markers first, then transparent hit targets on top so they catch the tap
    tuning.forEach((s2, i) => {
      for (let f = 0; f <= frets; f++) {
        const cx = f === 0 ? padL - 13 : centreOf(f);
        p.push(`<circle class="fb-mark" data-string="${i}" data-fret="${f}" cx="${cx}" cy="${yOf(i)}" r="${f === 0 ? 5.5 : 7}"/>`);
      }
    });
    tuning.forEach((s2, i) => {
      for (let f = 0; f <= frets; f++) {
        const x = f === 0 ? 0 : xOfFret(f - 1);
        const wCell = f === 0 ? padL : fretW;
        p.push(`<rect class="fb-hit" data-string="${i}" data-fret="${f}" role="button" tabindex="0" ` +
               `aria-label="${positionLabel({ string: i, fret: f })}" ` +
               `x="${x}" y="${yOf(i) - stringGap / 2}" width="${wCell}" height="${stringGap}"/>`);
      }
    });
  }

  p.push('</svg>');
  return p.join('');
}

// The natural notes ascending one string — the classic way to learn a string.
function naturalPositionsOnString(stringIndex, maxFret = 12, tuning = STANDARD_TUNING) {
  const out = [];
  for (let f = 0; f <= maxFret; f++) {
    const midi = tuning[stringIndex].midi + f;
    if (!CHROMATIC_SHARP[midi % 12].includes('#')) out.push({ string: stringIndex, fret: f, midi });
  }
  return out;
}

// "6th string, 3rd fret" / "1st string, open"
const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
function positionLabel({ string, fret }) {
  const stringNo = 6 - string;               // string 0 is the 6th (low E)
  return `${ORDINAL[stringNo - 1]} string, ${fret === 0 ? 'open' : 'fret ' + fret}`;
}

export {
  STANDARD_TUNING, GUITAR_WRITTEN_OFFSET,
  midiOf, midiToNote, enharmonicOf,
  positionsForMidi, fretboardPositions, naturalPositionsOnString, fretboardSVG, positionLabel
};
