// theory.js — Pure music theory: notes, intervals, scales, chords

'use strict';

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Enharmonic equivalents (flat → sharp)
const ENHARMONIC = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
  'E#': 'F', 'B#': 'C'
};

function normalizeNote(note) {
  // Strip octave number if present
  const match = note.match(/^([A-G][#b]?)(\d*)$/);
  if (!match) return note;
  const name = match[1];
  return ENHARMONIC[name] || name;
}

function noteIndex(note) {
  const n = normalizeNote(note);
  const idx = CHROMATIC.indexOf(n);
  if (idx === -1) throw new Error(`Unknown note: ${note}`);
  return idx;
}

// Get note name at a fret position given tuning
// tuning: array of note strings e.g. ['E2','A2','D3','G3','B3','E4']
// string: 0-based (0 = lowest/thickest string)
// fret: 0-based
function getNoteAtPosition(string, fret, tuning) {
  const openNote = tuning[string];
  const openIdx = noteIndex(openNote);
  return CHROMATIC[(openIdx + fret) % 12];
}

// Get all fret positions for a given note across all strings
function getAllPositionsForNote(note, tuning, frets = 24) {
  const target = normalizeNote(note);
  const positions = [];
  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= frets; f++) {
      if (getNoteAtPosition(s, f, tuning) === target) {
        positions.push({ string: s, fret: f });
      }
    }
  }
  return positions;
}

// Semitones between two notes (positive, 0-11)
function semitonesBetween(noteA, noteB) {
  const a = noteIndex(noteA);
  const b = noteIndex(noteB);
  return (b - a + 12) % 12;
}

const INTERVAL_NAMES = {
  0: 'Unison (P1)',
  1: 'Minor 2nd (m2)',
  2: 'Major 2nd (M2)',
  3: 'Minor 3rd (m3)',
  4: 'Major 3rd (M3)',
  5: 'Perfect 4th (P4)',
  6: 'Tritone (TT)',
  7: 'Perfect 5th (P5)',
  8: 'Minor 6th (m6)',
  9: 'Major 6th (M6)',
  10: 'Minor 7th (m7)',
  11: 'Major 7th (M7)'
};

const INTERVAL_SHORT = {
  0: 'P1', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3',
  5: 'P4', 6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6',
  10: 'm7', 11: 'M7'
};

function getInterval(noteA, noteB) {
  const semitones = semitonesBetween(noteA, noteB);
  return {
    semitones,
    name: INTERVAL_NAMES[semitones],
    short: INTERVAL_SHORT[semitones]
  };
}

// Scale definitions: array of semitone steps from root
const SCALES = {
  'Major':             [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor':     [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor':    [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor':     [0, 2, 3, 5, 7, 9, 11],
  'Pentatonic Major':  [0, 2, 4, 7, 9],
  'Pentatonic Minor':  [0, 3, 5, 7, 10],
  'Blues':             [0, 3, 5, 6, 7, 10],
  'Dorian':            [0, 2, 3, 5, 7, 9, 10],
  'Phrygian':          [0, 1, 3, 5, 7, 8, 10],
  'Lydian':            [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian':        [0, 2, 4, 5, 7, 9, 10],
  'Locrian':           [0, 1, 3, 5, 6, 8, 10],
  'Phrygian Dominant': [0, 1, 4, 5, 7, 8, 10],
  'Whole Tone':        [0, 2, 4, 6, 8, 10],
  'Diminished (HW)':   [0, 1, 3, 4, 6, 7, 9, 10],
  'Diminished (WH)':   [0, 2, 3, 5, 6, 8, 9, 11]
};

function getScaleNotes(root, scaleName) {
  const steps = SCALES[scaleName];
  if (!steps) throw new Error(`Unknown scale: ${scaleName}`);
  const rootIdx = noteIndex(root);
  return steps.map(s => CHROMATIC[(rootIdx + s) % 12]);
}

function getScalePositions(root, scaleName, tuning, frets = 24) {
  const notes = new Set(getScaleNotes(root, scaleName));
  const positions = [];
  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= frets; f++) {
      const note = getNoteAtPosition(s, f, tuning);
      if (notes.has(note)) {
        positions.push({ string: s, fret: f, note, isRoot: note === normalizeNote(root) });
      }
    }
  }
  return positions;
}

// Chord formulas (semitone intervals from root)
const CHORD_FORMULAS = {
  'Major':      [0, 4, 7],
  'Minor':      [0, 3, 7],
  'Augmented':  [0, 4, 8],
  'Diminished': [0, 3, 6],
  'Sus2':       [0, 2, 7],
  'Sus4':       [0, 5, 7],
  'Dom7':       [0, 4, 7, 10],
  'Maj7':       [0, 4, 7, 11],
  'Min7':       [0, 3, 7, 10],
  'm7b5':       [0, 3, 6, 10],
  'Dim7':       [0, 3, 6, 9],
  'Aug7':       [0, 4, 8, 10],
  'Maj9':       [0, 4, 7, 11, 14],
  'Dom9':       [0, 4, 7, 10, 14],
  'Min9':       [0, 3, 7, 10, 14],
  'Add9':       [0, 4, 7, 14],
  'Dom7b9':     [0, 4, 7, 10, 13],
  'Dom7#9':     [0, 4, 7, 10, 15],
  '6':          [0, 4, 7, 9],
  'm6':         [0, 3, 7, 9]
};

function getChordNotes(root, chordType) {
  const formula = CHORD_FORMULAS[chordType];
  if (!formula) throw new Error(`Unknown chord: ${chordType}`);
  const rootIdx = noteIndex(root);
  return formula.map(s => CHROMATIC[(rootIdx + s) % 12]);
}

// Given a set of notes, identify possible chord names
function identifyChord(notes) {
  const normalized = notes.map(normalizeNote);
  const results = [];
  for (const root of normalized) {
    for (const [type, formula] of Object.entries(CHORD_FORMULAS)) {
      const chordNotes = new Set(getChordNotes(root, type));
      const inputNotes = new Set(normalized);
      const matches = [...chordNotes].every(n => inputNotes.has(n)) &&
                      [...inputNotes].every(n => chordNotes.has(n));
      if (matches) {
        results.push({ root, type, name: `${root} ${type}` });
      }
    }
  }
  return results;
}

// Get a note N semitones above a given note
function transposeNote(note, semitones) {
  const idx = noteIndex(note);
  return CHROMATIC[(idx + semitones + 12) % 12];
}

// All scale names for UI
const SCALE_NAMES = Object.keys(SCALES);
const CHORD_TYPES = Object.keys(CHORD_FORMULAS);
const ALL_NOTES = CHROMATIC;

// Tuning presets
const TUNING_PRESETS = {
  'Standard':   ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  'Drop D':     ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  'Drop C#':    ['C#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
  'Drop C':     ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'],
  'Drop B':     ['B1', 'F#2', 'B2', 'E3', 'G#3', 'C#4'],
  'Open G':     ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
  'Open D':     ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
  'DADGAD':     ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
  'Half Down':  ['D#2', 'G#2', 'C#3', 'F#3', 'A#3', 'D#4'],
  'Full Down':  ['D2', 'G2', 'C3', 'F3', 'A3', 'D4']
};

export {
  CHROMATIC, ENHARMONIC, SCALES, CHORD_FORMULAS,
  INTERVAL_NAMES, INTERVAL_SHORT, TUNING_PRESETS,
  SCALE_NAMES, CHORD_TYPES, ALL_NOTES,
  normalizeNote, noteIndex, getNoteAtPosition,
  getAllPositionsForNote, semitonesBetween,
  getInterval, getScaleNotes, getScalePositions,
  getChordNotes, identifyChord, transposeNote
};
