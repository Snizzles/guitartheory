// Module 8 — Seventh Chords & Progressions
import { buildABC, getChordNotes } from '../theory.js';

const seventhChord = (root, type) => buildABC([{ chord: getChordNotes(root, type) }], { clef: 'treble', dur: '2' });

export default {
  id: 'progressions',
  title: 'Seventh Chords & Progressions',
  blurb: 'Richer four-note chords, cadences, and the progressions behind real songs.',
  lessons: [
    {
      id: 'pro-sevenths',
      title: 'Seventh Chords',
      sections: [
        { type: 'prose', html: `
          <p>Stack one more 3rd on a triad and you get a <strong>seventh chord</strong> — four notes,
          a richer, jazzier sound. The common types:</p>
          <ul>
            <li><strong>Major 7 (maj7)</strong> — 1 3 5 7. Lush, dreamy.</li>
            <li><strong>Dominant 7 (7)</strong> — 1 3 5 ♭7. Bluesy, wants to resolve.</li>
            <li><strong>Minor 7 (m7)</strong> — 1 ♭3 5 ♭7. Smooth, mellow.</li>
            <li><strong>Half-diminished (m7♭5)</strong> — 1 ♭3 ♭5 ♭7. Tense, used in minor keys.</li>
          </ul>` },
        { type: 'notation', caption: 'C major 7 — C E G B.', abc: seventhChord('C', 'Maj7') },
        { type: 'play', label: 'C maj7 (lush)', chord: true, notes: getChordNotes('C', 'Maj7') },
        { type: 'play', label: 'C7 (dominant — wants to resolve)', chord: true, notes: getChordNotes('C', 'Dom7') },
        { type: 'play', label: 'C m7 (smooth)', chord: true, notes: getChordNotes('C', 'Min7') },
        { type: 'interactive', widget: 'chordLab', config: { root: 'D', type: 'Min7' },
          caption: 'Explore seventh chords from any root.' },
      ],
      quiz: [
        { q: 'A seventh chord has how many notes?',
          choices: ['2', '3', '4', '5'], answer: 2, explain: 'Four — a triad plus one more stacked 3rd.' },
        { q: 'A dominant 7 chord is spelled…',
          choices: ['1 3 5 7', '1 3 5 ♭7', '1 ♭3 5 ♭7', '1 ♭3 ♭5 ♭7'], answer: 1,
          explain: 'Major triad + a flat 7 → the restless dominant sound.' },
        { q: 'Which seventh chord sounds the most lush/dreamy and stable?',
          choices: ['Dominant 7', 'Minor 7', 'Major 7', 'Half-diminished'], answer: 2, explain: 'maj7 (1 3 5 7) is lush and at rest.' },
      ],
    },
    {
      id: 'pro-cadences',
      title: 'Cadences: V → I',
      sections: [
        { type: 'prose', html: `
          <p>A <strong>cadence</strong> is a chord move that ends a phrase, like punctuation. The
          strongest is the <strong>authentic cadence V → I</strong>: the dominant’s tension (its tritone
          and leading tone) resolves home to the tonic.</p>
          <p>Make the V a <strong>dominant 7</strong> (G7 → C) and the pull is even stronger. Other
          cadences: <strong>IV → I</strong> (plagal, the “amen”), and <strong>V → vi</strong> (deceptive,
          a surprise).</p>` },
        { type: 'play', label: 'Authentic cadence: G7 → C', chordSeq: [getChordNotes('G', 'Dom7'), getChordNotes('C', 'Major')] },
        { type: 'play', label: 'Plagal “amen”: F → C', chordSeq: [getChordNotes('F', 'Major'), getChordNotes('C', 'Major')] },
        { type: 'play', label: 'Deceptive: G → Am', chordSeq: [getChordNotes('G', 'Major'), getChordNotes('A', 'Minor')] },
      ],
      quiz: [
        { q: 'A cadence functions like…',
          choices: ['A key signature', 'Musical punctuation ending a phrase', 'A time signature', 'A scale'], answer: 1,
          explain: 'Cadences close phrases the way punctuation closes sentences.' },
        { q: 'The strongest, most final cadence is…',
          choices: ['IV → I', 'V → vi', 'V → I', 'ii → iii'], answer: 2, explain: 'The authentic cadence V → I resolves home.' },
        { q: 'IV → I is known as the ___ cadence.',
          choices: ['Authentic', 'Plagal (“amen”)', 'Deceptive', 'Half'], answer: 1, explain: 'The plagal or “amen” cadence.' },
      ],
    },
    {
      id: 'pro-progressions',
      title: 'Common Progressions',
      sections: [
        { type: 'prose', html: `
          <p>Because diatonic chords are numbered, progressions are shared across keys as Roman-numeral
          formulas. A few that power thousands of songs:</p>
          <ul>
            <li><strong>I – IV – V</strong> — rock, blues, folk.</li>
            <li><strong>I – V – vi – IV</strong> — the “four-chord pop song.”</li>
            <li><strong>ii – V – I</strong> — the cornerstone of jazz.</li>
            <li><strong>I – vi – IV – V</strong> — 1950s doo-wop.</li>
          </ul>
          <p>Learn them by number and you can play them instantly in any key.</p>` },
        { type: 'play', label: 'I–V–vi–IV in C (C – G – Am – F)', chordSeq: [
            getChordNotes('C', 'Major'), getChordNotes('G', 'Major'),
            getChordNotes('A', 'Minor'), getChordNotes('F', 'Major')] },
        { type: 'play', label: 'ii–V–I in C (Dm7 – G7 – Cmaj7)', chordSeq: [
            getChordNotes('D', 'Min7'), getChordNotes('G', 'Dom7'), getChordNotes('C', 'Maj7')] },
        { type: 'callout', variant: 'key', title: 'You finished the course! 🎉',
          html: 'You now know how pitch, rhythm, intervals, scales, keys, modes and chords fit together. Revisit any lesson from the sidebar, and keep your ears active by playing along.' },
      ],
      quiz: [
        { q: 'The “four-chord pop song” progression is…',
          choices: ['ii – V – I', 'I – V – vi – IV', 'I – IV – V', 'I – vi – ii – V'], answer: 1,
          explain: 'I – V – vi – IV underlies a huge number of pop hits.' },
        { q: 'Which progression is the cornerstone of jazz?',
          choices: ['I – IV – V', 'ii – V – I', 'I – V – vi – IV', 'vi – IV – I – V'], answer: 1,
          explain: 'The ii – V – I is jazz harmony’s central cell.' },
        { q: 'Why are progressions written as Roman numerals instead of letter chords?',
          choices: ['They look fancier', 'So they transpose to any key', 'To hide the key', 'Tradition only'], answer: 1,
          explain: 'Numbered chords work in every key — just plug in that key’s diatonic chords.' },
      ],
    },
  ],
};
