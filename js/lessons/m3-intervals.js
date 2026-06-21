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
          <p>Always count the starting note as "1". C→D is a 2nd. C→C at the <em>same pitch</em> is a
          <strong>unison</strong>; C up to the <em>next</em> C is an <strong>octave</strong>.</p>` },
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
          <p>Some intervals are <strong>perfect</strong> (the unison, 4th, 5th and octave) — they
          sound stable and open. The 2nd, 3rd, 6th and 7th instead come in two sizes:
          <strong>major</strong> (larger) and <strong>minor</strong> (exactly one half step smaller).</p>
          <p>The surest way to pin down an interval's <em>quality</em> is to <strong>count its half
          steps</strong> from the lower note. For example, <strong>C–E</strong> spans 4 half steps —
          which the table below calls a <strong>major 3rd</strong>. Count first, then check the table.
          Here is every interval inside one octave — open it whenever you need a reference:</p>
          <details class="reftable"><summary>Show / hide the full interval table</summary>
          <table class="theory-table">
            <thead><tr><th>Interval</th><th>Short</th><th>Half steps</th><th>From C</th></tr></thead>
            <tbody>
              <tr><td>Perfect unison</td><td>P1</td><td>0</td><td>C–C</td></tr>
              <tr><td>Minor 2nd</td><td>m2</td><td>1</td><td>C–D♭</td></tr>
              <tr><td>Major 2nd</td><td>M2</td><td>2</td><td>C–D</td></tr>
              <tr><td>Minor 3rd</td><td>m3</td><td>3</td><td>C–E♭</td></tr>
              <tr><td>Major 3rd</td><td>M3</td><td>4</td><td>C–E</td></tr>
              <tr><td>Perfect 4th</td><td>P4</td><td>5</td><td>C–F</td></tr>
              <tr><td>Augmented 4th</td><td>A4</td><td>6</td><td>C–F♯</td></tr>
              <tr><td>Diminished 5th</td><td>d5</td><td>6</td><td>C–G♭</td></tr>
              <tr class="hl"><td>Perfect 5th</td><td>P5</td><td>7</td><td>C–G</td></tr>
              <tr><td>Minor 6th</td><td>m6</td><td>8</td><td>C–A♭</td></tr>
              <tr><td>Major 6th</td><td>M6</td><td>9</td><td>C–A</td></tr>
              <tr><td>Minor 7th</td><td>m7</td><td>10</td><td>C–B♭</td></tr>
              <tr><td>Major 7th</td><td>M7</td><td>11</td><td>C–B</td></tr>
              <tr><td>Perfect octave</td><td>P8</td><td>12</td><td>C–C</td></tr>
            </tbody>
          </table></details>` },
        { type: 'callout', variant: 'key', title: 'Worth memorizing',
          html: 'The perfect intervals by half step: <strong>unison = 0, 4th = 5, 5th = 7, octave = 12</strong>. The <strong>perfect 5th = 7 half steps</strong> (C up to G) turns up everywhere — lock that one in.' },
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
          <p>Exactly halfway through the octave (6 half steps) sits the <strong>tritone</strong>. It
          sounds tense and unresolved — it’s the engine of the dominant chord you’ll meet later.</p>
          <p>The tritone is also our way into the last two qualities. <strong>Augmented</strong> means
          <em>one half step wider</em> than a perfect or major interval; <strong>diminished</strong>
          means <em>one half step narrower</em> than a perfect or minor interval. So the very same
          6-half-step gap is an <strong>augmented 4th</strong> when spelled as a 4th (C–F♯: C-D-E-F) but a
          <strong>diminished 5th</strong> when spelled as a 5th (C–G♭: C-D-E-F-G) — same sound, different
          spelling and name.</p>
          <p>Many people learn interval sounds by linking them to songs: a Perfect 4th opens “Here Comes
          the Bride”; a Perfect 5th opens the Star Wars theme; a Major 6th opens “My Bonnie Lies Over
          the Ocean.” Use the ear-training questions below to start recognising them.</p>` },
        { type: 'play', label: 'Augmented 4th — the tritone (C–F♯)', seq: true, notes: ['C', 'F#'] },
        { type: 'play', label: 'Diminished 5th — same sound (C–G♭)', seq: true, notes: ['C', 'Gb'] },
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
        { q: 'Listen — which interval is this?', audio: { notes: ['A', 'C'], label: 'Play the interval' },
          choices: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Major 2nd'], answer: 1,
          explain: 'A up to C is 3 half steps — a minor 3rd (darker colour).' },
      ],
    },
  ],
};
