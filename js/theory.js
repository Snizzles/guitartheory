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

// Octave-aware when both notes carry an octave (so C4→C5 is a P8, not a P1);
// otherwise reduces to the within-octave pitch-class distance.
function getInterval(a, b) {
  const pa = parseNote(a), pb = parseNote(b);
  let semitones;
  if (pa.octave != null && pb.octave != null) {
    const abs = (LETTER_PC[pb.letter] + pb.acc + pb.octave * 12) -
                (LETTER_PC[pa.letter] + pa.acc + pa.octave * 12);
    semitones = Math.abs(abs);
    if (semitones > 12) semitones = semitones % 12 === 0 ? 12 : semitones % 12;
  } else {
    semitones = semitonesBetween(a, b);
  }
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
  // Non-heptatonic: choose flats for flat roots, minor-flavoured scales, or natural F.
  const rootAcc = parseNote(root).acc;
  const isMinorish = scaleName === 'Pentatonic Minor' || scaleName === 'Blues';
  const useFlat = rootAcc < 0 || (rootAcc === 0 && (isMinorish || rootLetter === 'F'));
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
// Computed from the correctly-spelled major scale, so it's right for every key
// spelling (incl. Gb, C#, Cb) rather than matching the circle table by pitch class.
function keySignature(majorRoot) {
  const notes = getScaleNotes(majorRoot, 'Major');
  const sharps = notes.filter(n => parseNote(n).acc > 0);
  const flats = notes.filter(n => parseNote(n).acc < 0);
  if (sharps.length && !flats.length) {
    const ordered = SHARP_ORDER.map(L => sharps.find(n => parseNote(n).letter === L)).filter(Boolean);
    return { count: sharps.length, type: 'sharp', notes: ordered };
  }
  if (flats.length && !sharps.length) {
    const ordered = FLAT_ORDER.map(L => flats.find(n => parseNote(n).letter === L)).filter(Boolean);
    return { count: flats.length, type: 'flat', notes: ordered };
  }
  return { count: 0, type: 'none', notes: [] };
}

// Relatives derived from scale degree, so spelling is correct for any key.
function relativeMinor(majorRoot) {
  return getScaleNotes(majorRoot, 'Major')[5];            // 6th degree
}
function relativeMajor(minorRoot) {
  return getScaleNotes(minorRoot, 'Natural Minor')[2];    // 3rd degree
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
  'AugMaj7':    [0, 4, 8, 11],
  '6':          [0, 4, 7, 9],
  'm6':         [0, 3, 7, 9]
};

// Symbol suffixes for display (root + suffix)
const CHORD_SUFFIX = {
  'Major': '', 'Minor': 'm', 'Augmented': '+', 'Diminished': '°',
  'Sus2': 'sus2', 'Sus4': 'sus4', 'Maj7': 'maj7', 'Dom7': '7', 'Min7': 'm7',
  'm7b5': 'm7♭5', 'Dim7': '°7', 'MinMaj7': 'm(maj7)', 'AugMaj7': '+maj7', '6': '6', 'm6': 'm6'
};

// Diatonic letter steps from the root for each chord tone. Tertian chords stack
// thirds (0,2,4,6); sus and 6 chords use different scale degrees, so spelling must
// follow the real degree, not assume thirds (e.g. Csus4 = C F G, not C E# G).
const CHORD_DEGREES = {
  'Major': [0, 2, 4], 'Minor': [0, 2, 4], 'Augmented': [0, 2, 4], 'Diminished': [0, 2, 4],
  'Sus2': [0, 1, 4], 'Sus4': [0, 3, 4],
  'Maj7': [0, 2, 4, 6], 'Dom7': [0, 2, 4, 6], 'Min7': [0, 2, 4, 6],
  'm7b5': [0, 2, 4, 6], 'Dim7': [0, 2, 4, 6], 'MinMaj7': [0, 2, 4, 6], 'AugMaj7': [0, 2, 4, 6],
  '6': [0, 2, 4, 5], 'm6': [0, 2, 4, 5]
};

// Spell a chord's notes using each tone's diatonic degree.
function getChordNotes(root, chordType) {
  const formula = CHORD_FORMULAS[chordType];
  if (!formula) throw new Error(`Unknown chord: ${chordType}`);
  const rootPc = pitchClass(root);
  const startIdx = LETTERS.indexOf(parseNote(root).letter);
  const degrees = CHORD_DEGREES[chordType];
  return formula.map((semi, i) => {
    const step = degrees ? degrees[i] : i * 2;
    const letter = LETTERS[(startIdx + step) % 7];
    return spellWithLetter(letter, (rootPc + semi) % 12);
  });
}

function chordSymbol(root, chordType) {
  return root + (CHORD_SUFFIX[chordType] ?? ` ${chordType}`);
}

// Readable, spelled-out chord quality (for learners): "augmented", "dominant 7th"…
const CHORD_NAMES = {
  'Major': 'major', 'Minor': 'minor', 'Augmented': 'augmented', 'Diminished': 'diminished',
  'Sus2': 'suspended 2nd', 'Sus4': 'suspended 4th', 'Maj7': 'major 7th', 'Dom7': 'dominant 7th',
  'Min7': 'minor 7th', 'm7b5': 'half-diminished 7th', 'Dim7': 'diminished 7th',
  'MinMaj7': 'minor-major 7th', 'AugMaj7': 'augmented-major 7th', '6': 'major 6th', 'm6': 'minor 6th'
};
function chordFullName(root, chordType) {
  return `${root} ${CHORD_NAMES[chordType] || chordType}`;
}

// Identify chord name(s) from a set of note names
function identifyChord(notes) {
  const inputPc = new Set(notes.map(pitchClass));
  const results = [];
  const seen = new Set();
  for (const root of new Set(notes)) {
    for (const [type, formula] of Object.entries(CHORD_FORMULAS)) {
      const chordPc = new Set(formula.map(s => (pitchClass(root) + s) % 12));
      if (chordPc.size === inputPc.size &&
          [...chordPc].every(p => inputPc.has(p))) {
        const r = normalizeNote(root);
        const key = r + '|' + type;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ root: r, type, symbol: chordSymbol(r, type) });
        }
      }
    }
  }
  return results;
}

// ─── Diatonic harmony ───────────────────────────────────────────────────────

// Roman numeral base per degree (case/suffix applied from the chord quality)
const ROMAN_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];   // kept for reference
const ROMAN_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
const ROMAN_NUM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// Build the Roman numeral from the chord quality, correct for any 7-note scale.
function romanFor(i, type) {
  let r = ROMAN_NUM[i];
  if (type === 'Minor' || type === 'Diminished') r = r.toLowerCase();
  if (type === 'Diminished') r += '°';
  else if (type === 'Augmented') r += '+';
  return r;
}

function triadQuality(third, fifth) {
  if (third === 4 && fifth === 7) return 'Major';
  if (third === 3 && fifth === 7) return 'Minor';
  if (third === 3 && fifth === 6) return 'Diminished';
  if (third === 4 && fifth === 8) return 'Augmented';
  return 'Major';
}

// Diatonic triads of a 7-note scale: [{ degree, root, type, symbol, roman, notes }]
function diatonicTriads(root, scaleName = 'Major') {
  const scale = getScaleNotes(root, scaleName);
  if (scale.length !== 7) throw new Error(`diatonicTriads requires a 7-note scale: ${scaleName}`);
  const pcs = scale.map(pitchClass);
  return scale.map((deg, i) => {
    const third = ((pcs[(i + 2) % 7] - pcs[i]) % 12 + 12) % 12;
    const fifth = ((pcs[(i + 4) % 7] - pcs[i]) % 12 + 12) % 12;
    const type = triadQuality(third, fifth);
    const notes = [scale[i], scale[(i + 2) % 7], scale[(i + 4) % 7]];
    return {
      degree: i + 1, root: deg, type, symbol: chordSymbol(deg, type),
      roman: romanFor(i, type), notes
    };
  });
}

// Diatonic seventh chords of a 7-note scale
function diatonicSevenths(root, scaleName = 'Major') {
  const scale = getScaleNotes(root, scaleName);
  if (scale.length !== 7) throw new Error(`diatonicSevenths requires a 7-note scale: ${scaleName}`);
  return scale.map((deg, i) => {
    const notes = [0, 2, 4, 6].map(o => scale[(i + o) % 7]);
    const type = identifyChord(notes)[0]?.type || null;   // null when not a known quality
    return { degree: i + 1, root: deg, type, symbol: type ? chordSymbol(deg, type) : `${deg} (other)`, notes };
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

  // Measure-aware token builder: tracks the accidental in effect for each
  // letter+octave within the current measure and emits an explicit accidental
  // (including a natural `=`) only when a note differs from what's active —
  // so naturals after a flat/sharp render correctly without cluttering plain scales.
  function tok(name, oct, macc) {
    const p = parseNote(name);
    const o = p.octave != null ? p.octave : oct;
    const k = p.letter + o;
    const active = macc[k] === undefined ? 0 : macc[k];
    let prefix = '';
    if (p.acc !== active) {
      prefix = p.acc > 0 ? '^'.repeat(p.acc) : p.acc < 0 ? '_'.repeat(-p.acc) : '=';
      macc[k] = p.acc;
    }
    const body = o >= 5 ? p.letter.toLowerCase() + "'".repeat(o - 5) : p.letter + ','.repeat(4 - o);
    return prefix + body;
  }

  function measureTokens(evs) {
    const macc = {};
    return evs.map(ev => {
      if (ev === 'z' || ev === 'rest') return 'z';
      if (typeof ev === 'string') return tok(ev, octave, macc);
      if (ev.chord) return '[' + ev.chord.map(n =>
        typeof n === 'string' ? tok(n, octave, macc) : tok(n.name, n.octave ?? octave, macc)).join('') + ']';
      return tok(ev.name, ev.octave ?? octave, macc);
    }).join(' ');
  }

  let body = '';
  if (perLine > 0) {
    for (let i = 0; i < events.length; i += perLine) {
      body += measureTokens(events.slice(i, i + perLine)) + ' |\n';
      if (opts.lyrics) body += 'w: ' + opts.lyrics.slice(i, i + perLine).join(' ') + '\n';
    }
  } else {
    body = measureTokens(events) + ' |\n';
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
  // add the octave root on top (fixed at one octave above the start)
  events.push({ name: notes[0], octave: startOct + 1 });
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
  getChordNotes, chordSymbol, chordFullName, CHORD_NAMES,
  identifyChord, diatonicTriads, diatonicSevenths,
  noteToABC, buildABC, scaleToABC
};
