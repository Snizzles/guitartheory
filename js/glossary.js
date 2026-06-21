// glossary.js — Plain-language definitions of the terms used across the course.
// Rendered as a standalone reference page (see renderGlossary in app.js).

'use strict';

// Grouped roughly in the order concepts appear in the course.
const GLOSSARY = [
  { term: 'Octave', def: 'The distance from one note to the next note of the same name. The two notes sound alike because the higher one vibrates at exactly twice the frequency.' },
  { term: 'Staff', def: 'The five lines and four spaces that music is written on. Higher on the staff = higher in pitch.' },
  { term: 'Clef', def: 'A symbol at the start of the staff that fixes which pitches the lines and spaces represent (treble/G clef, bass/F clef).' },
  { term: 'Ledger line', def: 'A short extra line for notes that sit above or below the five-line staff — middle C sits on one between the treble and bass staves.' },
  { term: 'Accidental', def: 'A sharp (♯), flat (♭) or natural (♮) that raises, lowers, or cancels a note.' },
  { term: 'Sharp / Flat', def: 'A sharp raises a note by one half step; a flat lowers it by one half step.' },
  { term: 'Enharmonic', def: 'Two names for the same pitch — e.g. C♯ and D♭ are the same key, spelled differently.' },
  { term: 'Half step (semitone)', def: 'The smallest distance in Western music — two adjacent keys on a piano, e.g. E→F.' },
  { term: 'Whole step (tone)', def: 'Two half steps, e.g. C→D.' },
  { term: 'Interval', def: 'The distance between two pitches, named by a number (count the letters) and a quality (major, minor, perfect, augmented, diminished).' },
  { term: 'Perfect', def: 'The quality of the unison, 4th, 5th and octave — stable, open-sounding intervals.' },
  { term: 'Major / Minor (interval)', def: 'The two sizes of the 2nd, 3rd, 6th and 7th; minor is one half step smaller than major.' },
  { term: 'Augmented / Diminished', def: 'Augmented = one half step wider than perfect or major; diminished = one half step narrower than perfect or minor.' },
  { term: 'Tritone', def: 'The six-half-step interval at the middle of the octave — an augmented 4th or diminished 5th. Tense and unresolved.' },
  { term: 'Scale', def: 'An ordered set of notes that defines a key’s “home” sound, built from a fixed pattern of whole and half steps.' },
  { term: 'Tonic', def: 'Scale degree 1 — the “home” note a key is named after and resolves to.' },
  { term: 'Subdominant', def: 'Scale degree 4.' },
  { term: 'Dominant', def: 'Scale degree 5 (and the chord built on it) — it pulls strongly back to the tonic.' },
  { term: 'Leading tone', def: 'Scale degree 7, a half step below the tonic, pulling up to it.' },
  { term: 'Key signature', def: 'The sharps or flats shown once at the start of each line, stating the key so they don’t need writing on every note.' },
  { term: 'Relative minor / major', def: 'A major and minor key that share the same key signature; the relative minor starts on the 6th degree of the major scale.' },
  { term: 'Circle of fifths', def: 'The keys arranged by perfect 5ths in a loop; each clockwise step adds a sharp, each counter-clockwise step adds a flat.' },
  { term: 'Mode', def: 'A scale made by starting the major scale on a different degree — seven modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian), each with its own colour.' },
  { term: 'Characteristic note', def: 'The one altered degree that gives a mode its distinctive flavour (e.g. Lydian’s ♯4, Mixolydian’s ♭7).' },
  { term: 'Triad', def: 'A three-note chord built by stacking two 3rds: root, 3rd and 5th.' },
  { term: 'Inversion', def: 'A chord with a note other than the root in the bass — first inversion (3rd in bass), second inversion (5th in bass). Same chord, different bass note.' },
  { term: 'Voice leading', def: 'Connecting chords smoothly so each note moves as little as possible, often using inversions.' },
  { term: 'Diatonic', def: 'Belonging to a given key — using only the notes of its scale.' },
  { term: 'Roman numerals', def: 'Labels for the chords built on each scale degree (I ii iii IV V vi vii°); uppercase = major, lowercase = minor, ° = diminished.' },
  { term: 'Seventh chord', def: 'A four-note chord — a triad plus one more stacked 3rd (e.g. maj7, dominant 7, m7, m7♭5).' },
  { term: 'Cadence', def: 'A chord move that ends a phrase, like punctuation — e.g. authentic (V→I), plagal (IV→I), deceptive (V→vi).' },
  { term: 'Progression', def: 'A sequence of chords, often written as Roman numerals so it transposes to any key (e.g. I–V–vi–IV).' }
];

export { GLOSSARY };
