// Module 7 — Triads & Diatonic Harmony
import { buildABC, getChordNotes, diatonicTriads } from '../theory.js';

const triadChord = (root, type) => buildABC([{ chord: getChordNotes(root, type) }], { clef: 'treble', dur: '2' });

export default {
  id: 'triads',
  title: 'Triads & Diatonic Harmony',
  blurb: 'Build chords by stacking thirds, then harmonise a whole key.',
  lessons: [
    {
      id: 'tri-build',
      title: 'Building Triads',
      sections: [
        { type: 'prose', html: `
          <p>A <strong>triad</strong> is a three-note chord built by stacking two 3rds: a
          <strong>root</strong>, a <strong>3rd</strong> and a <strong>5th</strong>. The qualities of
          those 3rds set the chord type:</p>
          <ul>
            <li><strong>Major</strong> — major 3rd + minor 3rd (1 – 3 – 5). Bright.</li>
            <li><strong>Minor</strong> — minor 3rd + major 3rd (1 – ♭3 – 5). Dark.</li>
            <li><strong>Diminished</strong> — two minor 3rds (1 – ♭3 – ♭5). Tense.</li>
            <li><strong>Augmented</strong> — two major 3rds (1 – 3 – ♯5). Unsettled.</li>
          </ul>` },
        { type: 'notation', caption: 'C major triad — C E G stacked.', abc: triadChord('C', 'Major') },
        { type: 'play', label: 'C major (bright)', chord: true, notes: getChordNotes('C', 'Major') },
        { type: 'play', label: 'C minor (dark)', chord: true, notes: getChordNotes('C', 'Minor') },
        { type: 'play', label: 'C diminished (tense)', chord: true, notes: getChordNotes('C', 'Diminished') },
        { type: 'play', label: 'C augmented (unsettled)', chord: true, notes: getChordNotes('C', 'Augmented') },
        { type: 'interactive', widget: 'chordLab', config: { root: 'C', type: 'Major' },
          caption: 'Pick a root and chord type to see and hear it.' },
      ],
      quiz: [
        { q: 'A triad is built by stacking…',
          choices: ['Two 2nds', 'Two 3rds', 'Two 5ths', 'Three octaves'], answer: 1,
          explain: 'Root + 3rd + 5th = two stacked thirds.' },
        { q: 'A major triad contains which scale degrees?',
          choices: ['1 ♭3 5', '1 3 5', '1 3 ♯5', '1 4 5'], answer: 1, explain: 'Root, major 3rd, perfect 5th.' },
        { q: 'A diminished triad stacks…',
          choices: ['Two major 3rds', 'Two minor 3rds', 'A major then minor 3rd', 'A 4th and a 5th'], answer: 1,
          explain: 'Two minor 3rds → 1 ♭3 ♭5, a tense sound.' },
      ],
    },
    {
      id: 'tri-inversions',
      title: 'Chord Inversions',
      sections: [
        { type: 'prose', html: `
          <p>A chord keeps its identity no matter which note is on the bottom. Put the root lowest and
          it’s <strong>root position</strong>. Put the 3rd lowest = <strong>first inversion</strong>;
          the 5th lowest = <strong>second inversion</strong>.</p>
          <p>Inversions let chords connect smoothly with minimal movement (good <em>voice leading</em>)
          and change which note sits in the bass without changing the chord’s name.</p>` },
        { type: 'play', label: 'C major — root position (C E G)', chord: true,
          notes: [{ name: 'C', octave: 4 }, { name: 'E', octave: 4 }, { name: 'G', octave: 4 }] },
        { type: 'play', label: 'C major — first inversion (E G C)', chord: true,
          notes: [{ name: 'E', octave: 4 }, { name: 'G', octave: 4 }, { name: 'C', octave: 5 }] },
        { type: 'play', label: 'C major — second inversion (G C E)', chord: true,
          notes: [{ name: 'G', octave: 4 }, { name: 'C', octave: 5 }, { name: 'E', octave: 5 }] },
        { type: 'play', label: 'Voice leading — jumpy: C → F, both root position (big leaps)', chordSeq: [
            [{ name: 'C', octave: 4 }, { name: 'E', octave: 4 }, { name: 'G', octave: 4 }],
            [{ name: 'F', octave: 4 }, { name: 'A', octave: 4 }, { name: 'C', octave: 5 }]] },
        { type: 'play', label: 'Voice leading — smooth: C → F/C, F inverted (notes barely move)', chordSeq: [
            [{ name: 'C', octave: 4 }, { name: 'E', octave: 4 }, { name: 'G', octave: 4 }],
            [{ name: 'C', octave: 4 }, { name: 'F', octave: 4 }, { name: 'A', octave: 4 }]] },
      ],
      quiz: [
        { q: 'A chord with its 3rd in the bass is in…',
          choices: ['Root position', 'First inversion', 'Second inversion', 'No key'], answer: 1,
          explain: '3rd on the bottom = first inversion.' },
        { q: 'Inverting a chord changes its…',
          choices: ['Name', 'Bass note', 'Key', 'Number of notes'], answer: 1,
          explain: 'Same notes and name; a different note is in the bass.' },
        { q: 'Why use inversions?',
          choices: ['To change the key', 'For smoother voice leading', 'To add sharps', 'To make it louder'], answer: 1,
          explain: 'They let chords connect with minimal movement.' },
      ],
    },
    {
      id: 'tri-diatonic',
      title: 'Diatonic Chords & Roman Numerals',
      sections: [
        { type: 'prose', html: `
          <p>Build a triad on <em>each</em> degree of a major scale, using only notes from that scale,
          and you get the seven <strong>diatonic chords</strong>. Their qualities are always the same
          pattern, labelled with <strong>Roman numerals</strong> (uppercase = major, lowercase = minor,
          ° = diminished):</p>
          <p style="text-align:center;font-size:1.05rem"><strong>I&nbsp; ii&nbsp; iii&nbsp; IV&nbsp; V&nbsp; vi&nbsp; vii°</strong></p>
          <p>In C major that is C, Dm, Em, F, G, Am, B°. The <strong>I, IV and V</strong> chords are the
          three majors and the harmonic backbone of countless songs.</p>` },
        { type: 'prose', html: () => {
            const t = diatonicTriads('C', 'Major');
            return '<p style="text-align:center;line-height:2.2">' +
              t.map(c => `<strong>${c.roman}</strong> = ${c.symbol}`).join(' &nbsp;·&nbsp; ') + '</p>';
          } },
        { type: 'play', label: 'Hear I–IV–V–I in C (C – F – G – C)', seq: false, chordSeq: [
            getChordNotes('C', 'Major'), getChordNotes('F', 'Major'),
            getChordNotes('G', 'Major'), getChordNotes('C', 'Major')] },
      ],
      quiz: [
        { q: 'In a major key, the ii chord is always…',
          choices: ['Major', 'Minor', 'Diminished', 'Augmented'], answer: 1, explain: 'Pattern: I ii iii IV V vi vii° — ii is minor.' },
        { q: 'In C major, which chord is the V?',
          choices: ['F', 'G', 'Am', 'B°'], answer: 1,
          explain: 'The 5th degree is G → G major (the V chord, called the dominant — scale degree 5).' },
        { q: 'Uppercase vs lowercase Roman numerals indicate…',
          choices: ['Loud vs soft', 'Major vs minor quality', 'Fast vs slow', 'Sharp vs flat'], answer: 1,
          explain: 'Uppercase = major, lowercase = minor, ° = diminished.' },
      ],
    },
  ],
};
