// flashcards.js — Unscored memorization decks. Each deck generates random cards
// from the theory engine. Decks with a `levels` list start on the easiest level
// (e.g. basic major/minor triads) so beginners aren't shown advanced chords.

'use strict';

import {
  buildABC, scaleToABC, getChordNotes, getScaleNotes, getInterval, noteAtInterval, INTERVAL_CATALOG,
  keySignature, relativeMinor, chordSymbol, chordFullName, pitchClass,
  CHROMATIC_SHARP, CHROMATIC_FLAT, CIRCLE_OF_FIFTHS
} from './theory.js';

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const fmt = n => n.replaceAll('#', '♯').replaceAll('b', '♭');
const chip = n => `<span class="note-chip">${fmt(n)}</span>`;
const big = h => `<div class="fc-big">${h}</div>`;
const sub = h => `<div class="fc-sub">${h}</div>`;

// Root pools, easy → full
const COMMON_ROOTS = ['C', 'G', 'D', 'A', 'E', 'F'];
const CORE_ROOTS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'];
const ALL_ROOTS = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Shared level configs for the two chord decks
const CHORD_LEVELS = {
  basic: { roots: COMMON_ROOTS, types: ['Major', 'Minor'] },
  core:  { roots: CORE_ROOTS, types: ['Major', 'Minor', 'Dom7', 'Maj7', 'Min7', 'Sus4'] },
  all:   { roots: ALL_ROOTS, types: ['Major', 'Minor', 'Dom7', 'Maj7', 'Min7', 'Sus2', 'Sus4',
                                     'Augmented', 'Diminished', 'm7b5', 'Dim7', '6', 'm6'] }
};
const CHORD_LEVEL_LIST = [
  { id: 'basic', label: 'Basic triads' },
  { id: 'core', label: 'Core chords' },
  { id: 'all', label: 'All chords' }
];

const SCALE_LEVELS = {
  basic: { roots: COMMON_ROOTS, scales: ['Major', 'Natural Minor'] },
  core:  { roots: CORE_ROOTS, scales: ['Major', 'Natural Minor', 'Pentatonic Major', 'Pentatonic Minor', 'Blues'] },
  all:   { roots: ALL_ROOTS, scales: ['Major', 'Natural Minor', 'Harmonic Minor', 'Pentatonic Major',
                                      'Pentatonic Minor', 'Blues', 'Dorian', 'Mixolydian'] }
};
const SCALE_LEVEL_LIST = [
  { id: 'basic', label: 'Major & minor' },
  { id: 'core', label: '+ Pentatonic & blues' },
  { id: 'all', label: 'All scales' }
];

const lvl = (levels, id) => levels[id] || levels.basic;

function chordCardCommon(levelId) {
  const cfg = lvl(CHORD_LEVELS, levelId);
  const root = pick(cfg.roots), type = pick(cfg.types);
  return { root, type, notes: getChordNotes(root, type) };
}

const DECKS = [
  {
    id: 'notes-staff',
    title: 'Note Reading',
    blurb: 'A note appears on the staff — name it.',
    defaultLevel: 'basic',
    levels: [
      { id: 'basic', label: 'Treble · naturals' },
      { id: 'sharps', label: 'Treble · all notes' },
      { id: 'all', label: 'Both clefs' }
    ],
    generate(levelId = 'basic') {
      const clef = levelId === 'all' && Math.random() < 0.5 ? 'bass' : 'treble';
      const letter = pick(LETTERS);
      const acc = levelId === 'basic' ? 0 : pick([0, 0, 0, 1, -1]);
      const name = letter + (acc === 1 ? '#' : acc === -1 ? 'b' : '');
      const octave = clef === 'treble' ? pick([4, 5]) : pick([2, 3]);
      const pc = pitchClass(name);
      let answer = `<strong>${fmt(name)}</strong>`;
      if (acc !== 0) {
        const sharp = CHROMATIC_SHARP[pc], flat = CHROMATIC_FLAT[pc];
        const other = name === sharp ? flat : sharp;
        if (other !== name) answer += ` <span class="fc-muted">(= ${fmt(other)})</span>`;
      }
      return {
        prompt: `Name this note (${clef} clef)`,
        q: { abc: buildABC([{ name, octave }], { clef, dur: '4' }) },
        a: { html: answer },
        play: { notes: [{ name, octave }] }
      };
    }
  },
  {
    id: 'chord-notes',
    title: 'Notes in a Chord',
    blurb: 'See a chord — recall the notes it contains.',
    defaultLevel: 'basic',
    levels: CHORD_LEVEL_LIST,
    generate(levelId = 'basic') {
      const { root, type, notes } = chordCardCommon(levelId);
      return {
        prompt: 'What notes are in this chord?',
        q: { html: big(fmt(chordSymbol(root, type))) + sub(fmt(chordFullName(root, type))) },
        a: { html: notes.map(chip).join(' '), abc: buildABC([{ chord: notes }], { clef: 'treble', dur: '2' }) },
        play: { notes, chord: true }
      };
    }
  },
  {
    id: 'name-chord',
    title: 'Name the Chord',
    blurb: 'See a stack of notes — name the chord.',
    defaultLevel: 'basic',
    levels: CHORD_LEVEL_LIST,
    generate(levelId = 'basic') {
      const { root, type, notes } = chordCardCommon(levelId);
      return {
        prompt: 'Name this chord',
        q: { abc: buildABC([{ chord: notes }], { clef: 'treble', dur: '2' }), html: notes.map(chip).join(' ') },
        a: { html: big(fmt(chordSymbol(root, type))) + sub(fmt(chordFullName(root, type))) },
        play: { notes, chord: true }
      };
    }
  },
  {
    id: 'intervals',
    title: 'Intervals',
    blurb: 'Two notes on the staff — name the interval between them.',
    defaultLevel: 'basic',
    levels: [
      { id: 'basic', label: 'Common intervals' },
      { id: 'all', label: 'All intervals' }
    ],
    generate(levelId = 'basic') {
      // Generate the upper note BY INTERVAL (not by transposing a semitone count) so the
      // staff spelling and the printed name always agree, e.g. C's minor 3rd is E♭, not D♯.
      const pool = levelId === 'basic'
        ? INTERVAL_CATALOG.filter(iv => ['M2', 'm3', 'M3', 'P4', 'P5', 'P8'].includes(iv.short))
        : INTERVAL_CATALOG.filter(iv => iv.short !== 'P1');
      const root = pick(levelId === 'basic' ? COMMON_ROOTS : CORE_ROOTS);
      const iv = pick(pool);
      const topFull = noteAtInterval(root + '4', iv.steps, iv.semis);
      const m = topFull.match(/([A-G][#b]*)(\d+)/);
      const topName = m[1], topOct = parseInt(m[2], 10);
      const info = getInterval(root + '4', topFull);   // spelling-aware
      return {
        prompt: 'Name the interval',
        q: { abc: buildABC([root + '4', topFull], { clef: 'treble', dur: '4' }) },
        a: { html: `<strong>${info.name}</strong> <span class="fc-muted">(${info.short})</span>` },
        play: { notes: [{ name: root, octave: 4 }, { name: topName, octave: topOct }] }
      };
    }
  },
  {
    id: 'scale-spelling',
    title: 'Scale Spelling',
    blurb: 'Given a scale name, spell out its notes.',
    defaultLevel: 'basic',
    levels: SCALE_LEVEL_LIST,
    generate(levelId = 'basic') {
      const cfg = lvl(SCALE_LEVELS, levelId);
      const root = pick(cfg.roots), scale = pick(cfg.scales);
      const notes = getScaleNotes(root, scale);
      return {
        prompt: 'Spell this scale',
        q: { html: big(`${fmt(root)} ${scale}`) },
        a: { html: notes.map(chip).join(' '), abc: scaleToABC(root, scale) },
        play: { notes: notes.map(n => ({ name: n, octave: 4 })).concat([{ name: notes[0], octave: 5 }]) }
      };
    }
  },
  {
    id: 'key-signatures',
    title: 'Key Signatures',
    blurb: 'How many sharps or flats does a key have — and which?',
    defaultLevel: 'basic',
    levels: [
      { id: 'basic', label: 'Common keys' },
      { id: 'all', label: 'All keys' }
    ],
    generate(levelId = 'basic') {
      const pool = levelId === 'basic'
        ? CIRCLE_OF_FIFTHS.filter(e => ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'].includes(e.major))
        : CIRCLE_OF_FIFTHS;
      const key = pick(pool).major;
      const ks = keySignature(key);
      const ans = ks.type === 'none'
        ? 'No sharps or flats'
        : `${ks.count} ${ks.type}${ks.count > 1 ? 's' : ''}: ${ks.notes.map(fmt).join(', ')}`;
      return {
        prompt: 'Key signature?',
        q: { html: big(`${fmt(key)} major`) },
        a: { html: `<strong>${ans}</strong><br><span class="fc-muted">Relative minor: ${fmt(relativeMinor(key))} minor</span>` },
        play: { notes: getScaleNotes(key, 'Major').map(n => ({ name: n, octave: 4 })).concat([{ name: key, octave: 5 }]) }
      };
    }
  }
];

const getDeck = id => DECKS.find(d => d.id === id) || null;

export { DECKS, getDeck };
