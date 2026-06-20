// flashcards.js — Unscored memorization decks. Each deck generates random cards
// from the theory engine. A card has a question, a revealed answer, and audio.

'use strict';

import {
  buildABC, scaleToABC, getChordNotes, getScaleNotes, getInterval, transposeNote,
  keySignature, relativeMinor, chordSymbol, pitchClass, CHROMATIC_SHARP, CHROMATIC_FLAT,
  CIRCLE_OF_FIFTHS
} from './theory.js';

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const fmt = n => n.replaceAll('#', '♯').replaceAll('b', '♭');
const chip = n => `<span class="note-chip">${fmt(n)}</span>`;
const big = h => `<div class="fc-big">${h}</div>`;

const ROOTS = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#'];
const ROOTS_SIMPLE = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'];
const CHORD_TYPES = ['Major', 'Minor', 'Dom7', 'Maj7', 'Min7', 'Diminished',
  'Augmented', 'Sus4', 'Sus2', 'm7b5', '6', 'm6'];
const SCALES = ['Major', 'Natural Minor', 'Harmonic Minor', 'Pentatonic Major',
  'Pentatonic Minor', 'Blues', 'Dorian', 'Mixolydian'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const DECKS = [
  {
    id: 'notes-staff',
    title: 'Note Reading',
    blurb: 'A note appears on the staff — name it. Treble & bass clef.',
    generate() {
      const clef = Math.random() < 0.5 ? 'treble' : 'bass';
      const letter = pick(LETTERS);
      const acc = pick([0, 0, 0, 1, -1]);
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
    blurb: 'See a chord symbol — recall the notes it contains.',
    generate() {
      const root = pick(ROOTS), type = pick(CHORD_TYPES);
      const notes = getChordNotes(root, type);
      return {
        prompt: 'What notes are in this chord?',
        q: { html: big(chordSymbol(root, type)) },
        a: { html: notes.map(chip).join(' '), abc: buildABC([{ chord: notes }], { clef: 'treble', dur: '2' }) },
        play: { notes, chord: true }
      };
    }
  },
  {
    id: 'name-chord',
    title: 'Name the Chord',
    blurb: 'See a stack of notes — name the chord.',
    generate() {
      const root = pick(ROOTS), type = pick(CHORD_TYPES);
      const notes = getChordNotes(root, type);
      return {
        prompt: 'Name this chord',
        q: { abc: buildABC([{ chord: notes }], { clef: 'treble', dur: '2' }), html: notes.map(chip).join(' ') },
        a: { html: big(chordSymbol(root, type)) },
        play: { notes, chord: true }
      };
    }
  },
  {
    id: 'intervals',
    title: 'Intervals',
    blurb: 'Two notes on the staff — name the interval between them.',
    generate() {
      const root = pick(ROOTS_SIMPLE), semi = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      const topFull = transposeNote(root + '4', semi);
      const m = topFull.match(/([A-G][#b]*)(\d+)/);
      const topName = m[1], topOct = parseInt(m[2], 10);
      const info = getInterval(root, topName);
      return {
        prompt: 'Name the interval',
        q: { abc: buildABC([root + '4', topFull], { clef: 'treble', dur: '4' }) },
        a: { html: `<strong>${info.name}</strong>` },
        play: { notes: [{ name: root, octave: 4 }, { name: topName, octave: topOct }] }
      };
    }
  },
  {
    id: 'scale-spelling',
    title: 'Scale Spelling',
    blurb: 'Given a scale name, spell out its notes.',
    generate() {
      const root = pick(ROOTS), scale = pick(SCALES);
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
    generate() {
      const key = pick(CIRCLE_OF_FIFTHS).major;
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
