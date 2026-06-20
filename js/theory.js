// theory.js — Instrument-neutral music theory engine
// Notes & spelling, intervals, scales, keys, modes, chords, and ABC-notation output.

'use strict';

// ─── Notes & pitch classes ──────────────────────────────────────────────────

const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const ENHARMONIC = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
  'E#': 'F', 'B#': 'C'
};

// Parse a note name like "C", "F#", "Bb", "F##", "Dbb" → { letter, acc }
// acc is in semitones: -2..+2 (b=-1, #=+1)
function parseNote(name) {
  const m = String(name).match(/^([A-Ga-g])([#b]*)(\d*)$/);
  if (!m) throw new Error(`Unknown note: ${name}`);
  const letter = m[1].toUpperCase();
  let acc = 0;
  for (const ch of m[2]) acc += ch === '#' ? 1 : -1;
  const octave = m[3] === '' ? null : parseInt(m[3], 10);
  return { letter, acc, octave };
}

function accidentalStr(acc) {
  if (acc > 0) return '#'.repeat(acc);
  if (acc < 0) return 'b'.repeat(-acc);
  return '';
}

// Pitch class 0-11 from a note name
function pitchClass(name) {
  const { letter, acc } = parseNote(name);
  return ((LETTER_PC[letter] + acc) % 12 + 12) % 12;
}

// Normalize any spelling to a canonical sharp name (for comparisons)
function normalizeNote(name) {
  return CHROMATIC_SHARP[pitchClass(name)];
}

function notesEqual(a, b) {
  return pitchClass(a) === pitchClass(b);
}

// Spell the note `letter` so its pitch class equals `targetPc` (choosing acc -2..+2)
function spellWithLetter(letter, targetPc) {
  const base = LETTER_PC[letter];
  let acc = ((targetPc - base) % 12 + 12) % 12;
  if (acc > 6) acc -= 12; // wrap to nearest (e.g. 11 → -1)
  return letter + accidentalStr(acc);
}

// ─── Intervals ──────────────────────────────────────────────────────────────

const INTERVAL_NAMES = {
  0: 'Perfect Unison (P1)',
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
  11: 'Major 7th (M7)',
  12: 'Perfect Octave (P8)'
};

const INTERVAL_SHORT = {
  0: 'P1', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3', 5: 'P4',
  6: 'TT', 7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8'
};

function semitonesBetween(a, b) {
  return ((pitchClass(b) - pitchClass(a)) % 12 + 12) % 12;
}

function getInterval(a, b) {
  const semitones = semitonesBetween(a, b);
  return { semitones, name: INTERVAL_NAMES[semitones], short: INTERVAL_SHORT[semitones] };
}

// Transpose a (possibly octave-bearing) note by N semitones, sharp spelling
function transposeNote(name, semitones) {
  const { octave } = parseNote(name);
  const pc = (pitchClass(name) + semitones % 12 + 12) % 12;
  const out = CHROMATIC_SHARP[pc];
  if (octave == null) return out;
  // Track octave crossings using absolute semitone position
  const absStart = LETTER_PC[parseNote(name).letter] + parseNote(name).acc + octave * 12;
  const abs = absStart + semitones;
  return out + Math.floor(abs / 12);
}

// ─── Scales & modes ─────────────────────────────────────────────────────────

// Semitone steps from the root.
const SCALES = {
  'Major':             [0, 2, 4, 5, 7, 9, 11],
  'Natural Minor':     [0, 2, 3, 5, 7, 8, 10],
  'Harmonic Minor':    [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor':     [0, 2, 3, 5, 7, 9, 11],
  'Pentatonic Major':  [0, 2, 4, 7, 9],
  'Pentatonic Minor':  [0, 3, 5, 7, 10],
  'Blues':             [0, 3, 5, 6, 7, 10],
  'Chromatic':         [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  // Modes of the major scale
  'Ionian':            [0, 2, 4, 5, 7, 9, 11],
  'Dorian':            [0, 2, 3, 5, 7, 9, 10],
  'Phrygian':          [0, 1, 3, 5, 7, 8, 10],
  'Lydian':            [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian':        [0, 2, 4, 5, 7, 9, 10],
  'Aeolian':           [0, 2, 3, 5, 7, 8, 10],
  'Locrian':           [0, 1, 3, 5, 6, 8, 10]
};

const MODE_ORDER = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
const MODE_CHARACTER = {
  'Ionian':     'The major scale — bright, resolved, the reference point.',
  'Dorian':     'Minor with a raised 6th — jazzy, hopeful minor.',
  'Phrygian':   'Minor with a flat 2nd — dark, Spanish/flamenco colour.',
  'Lydian':     'Major with a raised 4th — dreamy, floating.',
  'Mixolydian': 'Major with a flat 7th — bluesy, dominant.',
  'Aeolian':    'The natural minor scale — sad, classic minor.',
  'Locrian':    'Diminished tonic, flat 2nd & 5th — unstable, rarely a tonic.'
};

// Returns correctly-spelled note names for a scale. 7-note scales get one letter
// per degree; other scales fall back to key-appropriate chromatic spelling.
function getScaleNotes(root, scaleName) {
  const steps = SCALES[scaleName];
  if (!steps) throw new Error(`Unknown scale: ${scaleName}`);
  const rootPc = pitchClass(root);
  const rootLetter = parseNote(root).letter;

  if (steps.length === 7) {
    const startIdx = LETTERS.indexOf(rootLetter);
    return steps.map((semi, i) => {
      const letter = LETTERS[(startIdx + i) % 7];
      return spellWithLetter(letter, (rootPc + semi) % 12);
    });
  }
  // Non-heptatonic: pick flats or sharps based on the root's spelling
  const useFlat = parseNote(root).acc < 0 || ['F'].includes(rootLetter);
  const table = useFlat ? CHROMATIC_FLAT : CHROMATIC_SHARP;
  return steps.map(semi => table[(rootPc + semi) % 12]);
}

// Rotate the major scale of `root` to its Nth mode (1-indexed degree)
function getModeNotes(majorRoot, degree) {
  const major = getScaleNotes(majorRoot, 'Major');
  const modeRoot = major[degree - 1];
  return getScaleNotes(modeRoot, MODE_ORDER[degree - 1]);
}

// ─── Keys & the circle of fifths ────────────────────────────────────────────

const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const FLAT_ORDER  = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

// Major keys around the circle of fifths (sharps positive, flats negative)
const CIRCLE_OF_FIFTHS = [
  { major: 'C',  minor: 'A',  acc: 0 },
  { major: 'G',  minor: 'E',  acc: 1 },
  { major: 'D',  minor: 'B',  acc: 2 },
  { major: 'A',  minor: 'F#', acc: 3 },
  { major: 'E',  minor: 'C#', acc: 4 },
  { major: 'B',  minor: 'G#', acc: 5 },
  { major: 'F#', minor: 'D#', acc: 6 },
  { major: 'Db', minor: 'Bb', acc: -5 },
  { major: 'Ab', minor: 'F',  acc: -4 },
  { major: 'Eb', minor: 'C',  acc: -3 },
  { major: 'Bb', minor: 'G',  acc: -2 },
  { major: 'F',  minor: 'D',  acc: -1 }
];

// Key signature for a major key: { count, type:'sharp'|'flat'|'none', notes:[...] }
function keySignature(majorRoot) {
  const entry = CIRCLE_OF_FIFTHS.find(e => notesEqual(e.major, majorRoot));
  if (!entry) return { count: 0, type: 'none', notes: [] };
  if (entry.acc === 0) return { count: 0, type: 'none', notes: [] };
  if (entry.acc > 0) {
    return { count: entry.acc, type: 'sharp', notes: SHARP_ORDER.slice(0, entry.acc).map(n => n + '#') };
  }
  const n = -entry.acc;
  return { count: n, type: 'flat', notes: FLAT_ORDER.slice(0, n).map(l => l + 'b') };
}

function relativeMinor(majorRoot) {
  const e = CIRCLE_OF_FIFTHS.find(x => notesEqual(x.major, majorRoot));
  return e ? e.minor : getScaleNotes(majorRoot, 'Major')[5];
}
function relativeMajor(minorRoot) {
  const e = CIRCLE_OF_FIFTHS.find(x => notesEqual(x.minor, minorRoot));
  return e ? e.major : getScaleNotes(minorRoot, 'Natural Minor')[2];
}

// ─── Chords ─────────────────────────────────────────────────────────────────

const CHORD_FORMULAS = {
  'Major':      [0, 4, 7],
  'Minor':      [0, 3, 7],
  'Augmented':  [0, 4, 8],
  'Diminished': [0, 3, 6],
  'Sus2':       [0, 2, 7],
  'Sus4':       [0, 5, 7],
  'Maj7':       [0, 4, 7, 11],
  'Dom7':       [0, 4, 7, 10],
  'Min7':       [0, 3, 7, 10],
  'm7b5':       [0, 3, 6, 10],
  'Dim7':       [0, 3, 6, 9],
  'MinMaj7':    [0, 3, 7, 11],
  '6':          [0, 4, 7, 9],
  'm6':         [0, 3, 7, 9]
};

// Symbol suffixes for display (root + suffix)
const CHORD_SUFFIX = {
  'Major': '', 'Minor': 'm', 'Augmented': '+', 'Diminished': '°',
  'Sus2': 'sus2', 'Sus4': 'sus4', 'Maj7': 'maj7', 'Dom7': '7', 'Min7': 'm7',
  'm7b5': 'm7♭5', 'Dim7': '°7', 'MinMaj7': 'm(maj7)', '6': '6', 'm6': 'm6'
};

// Spell a chord using stacked thirds (every other letter), like a scale would.
function getChordNotes(root, chordType) {
  const formula = CHORD_FORMULAS[chordType];
  if (!formula) throw new Error(`Unknown chord: ${chordType}`);
  const rootPc = pitchClass(root);
  const startIdx = LETTERS.indexOf(parseNote(root).letter);
  // chord tones are root, 3rd, 5th, 7th → letters two apart
  return formula.map((semi, i) => {
    const letter = LETTERS[(startIdx + i * 2) % 7];
    return spellWithLetter(letter, (rootPc + semi) % 12);
  });
}

function chordSymbol(root, chordType) {
  return root + (CHORD_SUFFIX[chordType] ?? ` ${chordType}`);
}

// Identify chord name(s) from a set of note names
function identifyChord(notes) {
  const inputPc = new Set(notes.map(pitchClass));
  const results = [];
  for (const root of notes) {
    for (const [type, formula] of Object.entries(CHORD_FORMULAS)) {
      const chordPc = new Set(formula.map(s => (pitchClass(root) + s) % 12));
      if (chordPc.size === inputPc.size &&
          [...chordPc].every(p => inputPc.has(p))) {
        results.push({ root: normalizeNote(root), type, symbol: chordSymbol(normalizeNote(root), type) });
      }
    }
  }
  return results;
}

// ─── Diatonic harmony ───────────────────────────────────────────────────────

// Triads built on each degree of a 7-note scale
const ROMAN_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const ROMAN_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

function triadQuality(third, fifth) {
  if (third === 4 && fifth === 7) return 'Major';
  if (third === 3 && fifth === 7) return 'Minor';
  if (third === 3 && fifth === 6) return 'Diminished';
  if (third === 4 && fifth === 8) return 'Augmented';
  return 'Major';
}

// Diatonic triads of a scale: [{ degree, root, type, symbol, roman, notes }]
function diatonicTriads(root, scaleName = 'Major') {
  const scale = getScaleNotes(root, scaleName);
  const pcs = scale.map(pitchClass);
  const romans = scaleName === 'Major' || scaleName === 'Ionian' ? ROMAN_MAJOR
    : (scaleName === 'Natural Minor' || scaleName === 'Aeolian') ? ROMAN_MINOR : ROMAN_MAJOR;
  return scale.map((deg, i) => {
    const third = ((pcs[(i + 2) % 7] - pcs[i]) % 12 + 12) % 12;
    const fifth = ((pcs[(i + 4) % 7] - pcs[i]) % 12 + 12) % 12;
    const type = triadQuality(third, fifth);
    const notes = [scale[i], scale[(i + 2) % 7], scale[(i + 4) % 7]];
    return {
      degree: i + 1, root: deg, type, symbol: chordSymbol(deg, type),
      roman: romans[i], notes
    };
  });
}

// Diatonic seventh chords of a scale
function diatonicSevenths(root, scaleName = 'Major') {
  const scale = getScaleNotes(root, scaleName);
  return scale.map((deg, i) => {
    const notes = [0, 2, 4, 6].map(o => scale[(i + o) % 7]);
    const id = identifyChord(notes);
    const type = id[0]?.type || 'Maj7';
    return { degree: i + 1, root: deg, type, symbol: chordSymbol(deg, type), notes };
  });
}

// ─── ABC notation output ────────────────────────────────────────────────────

// Convert a note name (+octave) to an ABC pitch token, e.g. ("C#",5) → "^c"
function noteToABC(name, octave = 4) {
  const { letter, acc, octave: parsedOct } = parseNote(name);
  const oct = parsedOct != null ? parsedOct : octave;
  let token = '';
  if (acc > 0) token += '^'.repeat(acc);
  else if (acc < 0) token += '_'.repeat(-acc);
  // naturals need no sign under K:C (all programmatic output uses K:C)
  if (oct >= 5) {
    token += letter.toLowerCase() + "'".repeat(oct - 5);
  } else {
    token += letter + ','.repeat(4 - oct);
  }
  return token;
}

// Build a full ABC tune string.
// events: array of either a note string ("C"/"C#"), {name,octave}, or
//         {chord:[...]} for a stacked chord, or "z" for a rest.
// opts: { clef:'treble'|'bass', key:'C', meter:'4/4', noStem, title, dur }
function buildABC(events, opts = {}) {
  const {
    clef = 'treble', key = 'C', meter = 'none',
    title = '', dur = '4', perLine = 0, octave = 4
  } = opts;

  let header = 'X:1\n';
  if (title) header += `T:${title}\n`;
  header += `M:${meter}\n`;
  header += `L:1/${dur}\n`;
  header += `K:${key} clef=${clef}\n`;

  const tokens = events.map(ev => {
    if (ev === 'z' || ev === 'rest') return 'z';
    if (typeof ev === 'string') return noteToABC(ev, octave);
    if (ev.chord) return '[' + ev.chord.map(n =>
      typeof n === 'string' ? noteToABC(n, octave) : noteToABC(n.name, n.octave)).join('') + ']';
    return noteToABC(ev.name, ev.octave ?? octave);
  });

  let body = '';
  if (perLine > 0) {
    for (let i = 0; i < tokens.length; i += perLine) {
      body += tokens.slice(i, i + perLine).join(' ') + ' |\n';
      if (opts.lyrics) body += 'w: ' + opts.lyrics.slice(i, i + perLine).join(' ') + '\n';
    }
  } else {
    body = tokens.join(' ') + ' |\n';
    if (opts.lyrics) body += 'w: ' + opts.lyrics.join(' ') + '\n';
  }
  return header + body;
}

// Convenience: ABC for a scale ascending within one octave (auto octave bumps)
function scaleToABC(root, scaleName, opts = {}) {
  const notes = getScaleNotes(root, scaleName);
  const startOct = opts.octave ?? 4;
  let prevPc = -1;
  let oct = startOct;
  const events = notes.map((n, i) => {
    const pc = pitchClass(n);
    if (i > 0 && pc <= prevPc) oct++; // letter wrapped past B → next octave
    prevPc = pc;
    return { name: n, octave: oct };
  });
  // add the octave root on top
  events.push({ name: notes[0], octave: oct + 1 });
  return buildABC(events, { dur: '4', perLine: 8, ...opts });
}

// ─── Lists for UI ───────────────────────────────────────────────────────────

const NOTE_CHOICES = CHROMATIC_SHARP;
const SCALE_NAMES = Object.keys(SCALES);
const CHORD_TYPES = Object.keys(CHORD_FORMULAS);

export {
  CHROMATIC_SHARP, CHROMATIC_FLAT, LETTERS, ENHARMONIC,
  SCALES, MODE_ORDER, MODE_CHARACTER, CHORD_FORMULAS, CHORD_SUFFIX,
  INTERVAL_NAMES, INTERVAL_SHORT, CIRCLE_OF_FIFTHS, SHARP_ORDER, FLAT_ORDER,
  ROMAN_MAJOR, ROMAN_MINOR, NOTE_CHOICES, SCALE_NAMES, CHORD_TYPES,
  parseNote, accidentalStr, pitchClass, normalizeNote, notesEqual,
  spellWithLetter, semitonesBetween, getInterval, transposeNote,
  getScaleNotes, getModeNotes, keySignature, relativeMinor, relativeMajor,
  getChordNotes, chordSymbol, identifyChord, diatonicTriads, diatonicSevenths,
  noteToABC, buildABC, scaleToABC
};
