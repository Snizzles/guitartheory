// Module 3 — Intervals
import { buildABC } from '../theory.js';

export default {
  id: 'intervals',
  title: 'Intervals',
  blurb: 'The distance between two notes — the DNA of scales and chords.',
  lessons: [
    {
      id: 'int-basics',
      title: 'What Is an Interval?',
      sections: [
        { type: 'prose', html: `
          <p>An <strong>interval</strong> is the distance between two pitches. It has two parts:</p>
          <ul>
            <li><strong>Number</strong> — count the letter names inclusively. C up to E is a
            <em>3rd</em> (C-D-E = three letters). C up to G is a <em>5th</em>.</li>
            <li><strong>Quality</strong> — major, minor, perfect, augmented or diminished — the exact
            size in half steps.</li>
          </ul>
          <p>Always count the starting note as "1". C→D is a 2nd, C→C (same letter) is a unison or an
          octave.</p>` },
        { type: 'notation', caption: 'C up to G — count C-D-E-F-G = a 5th.',
          abc: buildABC(['C', { name: 'G', octave: 4 }], { clef: 'treble', dur: '4' }) },
        { type: 'play', label: 'Hear C then G', seq: true, notes: ['C', 'G'] },
      ],
      quiz: [
        { q: 'Counting C up to E, what interval number is it?',
          choices: ['2nd', '3rd', '4th', '5th'], answer: 1, explain: 'C-D-E = three letters = a 3rd.' },
        { q: 'When naming an interval number, you count…',
          choices: ['Only the top note', 'The black keys', 'Both notes and every letter between, inclusively', 'Half steps only'],
          answer: 2, explain: 'Count letter names inclusively, starting at 1.' },
        { q: 'The two parts of a full interval name are…',
          choices: ['Sharp and flat', 'Number and quality', 'Line and space', 'High and low'], answer: 1,
          explain: 'e.g. “major” (quality) + “3rd” (number).' },
      ],
    },
    {
      id: 'int-qualities',
      title: 'Major, Minor & Perfect',
      sections: [
        { type: 'prose', html: `
          <p>Some intervals are <strong>perfect</strong> (unison, 4th, 5th, octave) — they sound stable
          and open. The 2nd, 3rd, 6th and 7th come in <strong>major</strong> (larger) and
          <strong>minor</strong> (one half step smaller) flavours.</p>
          <p>Within one octave, by half steps from the root: m2 (1), M2 (2), m3 (3), M3 (4), P4 (5),
          tritone (6), P5 (7), m6 (8), M6 (9), m7 (10), M7 (11), octave (12).</p>` },
        { type: 'play', label: 'Major 3rd — bright (C–E)', seq: true, notes: ['C', 'E'] },
        { type: 'play', label: 'Minor 3rd — darker (C–E♭)', seq: true, notes: ['C', 'Eb'] },
        { type: 'play', label: 'Perfect 5th — strong, open (C–G)', seq: true, notes: ['C', 'G'] },
        { type: 'interactive', widget: 'intervalLab', config: { root: 'C' },
          caption: 'Pick any interval to see it on the staff and hear it.' },
      ],
      quiz: [
        { q: 'Which of these is a perfect interval?',
          choices: ['2nd', '3rd', '5th', '7th'], answer: 2, explain: 'Unison, 4th, 5th and octave are perfect.' },
        { q: 'A minor 3rd is how much smaller than a major 3rd?',
          choices: ['A whole step', 'A half step', 'An octave', 'They are equal'], answer: 1,
          explain: 'Minor is exactly one half step smaller than major.' },
        { q: 'How many half steps is a perfect 5th?',
          choices: ['5', '6', '7', '8'], answer: 2, explain: 'P5 = 7 half steps (e.g. C up to G).' },
      ],
    },
    {
      id: 'int-tritone-ear',
      title: 'The Tritone & Training Your Ear',
      sections: [
        { type: 'prose', html: `
          <p>Exactly halfway through the octave (6 half steps) sits the <strong>tritone</strong> — an
          augmented 4th / diminished 5th. It sounds tense and unresolved; it’s the engine of the
          dominant chord you’ll meet later.</p>
          <p>Many people learn interval sounds by linking them to songs: a Perfect 4th opens “Here Comes
          the Bride”; a Perfect 5th opens the Star Wars theme; a Major 6th opens “My Bonnie Lies Over
          the Ocean.” Use the ear-training questions below to start recognising them.</p>` },
        { type: 'play', label: 'Hear the tritone (C–F♯)', seq: true, notes: ['C', 'F#'] },
        { type: 'play', label: 'Compare: Perfect 5th (C–G)', seq: true, notes: ['C', 'G'] },
      ],
      quiz: [
        { q: 'How many half steps make a tritone?',
          choices: ['4', '5', '6', '7'], answer: 2, explain: 'Six — exactly half an octave.' },
        { q: 'The tritone is also known as a…',
          choices: ['Major 3rd', 'Augmented 4th / diminished 5th', 'Perfect 4th', 'Minor 6th'], answer: 1,
          explain: 'Augmented 4th and diminished 5th are the same 6-semitone gap.' },
        { q: 'Listen — which interval is this?', audio: { notes: ['C', 'G'], label: 'Play the interval' },
          choices: ['Minor 2nd', 'Major 3rd', 'Perfect 5th', 'Octave'], answer: 2,
          explain: 'C up to G, strong and open — a perfect 5th.' },
        { q: 'Listen — is this major or minor?', audio: { notes: ['A', 'C'], label: 'Play the interval' },
          choices: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Major 2nd'], answer: 1,
          explain: 'A up to C is 3 half steps — a minor 3rd (darker colour).' },
      ],
    },
  ],
};
