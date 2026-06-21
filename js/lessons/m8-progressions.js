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
        { type: 'notation', caption: 'The same four tones spelled out — 1 3 5 7. The B on top is the 7th.',
          abc: buildABC(['C', 'E', 'G', { name: 'B', octave: 4 }], { clef: 'treble', dur: '4', perLine: 4, lyrics: ['1', '3', '5', '7'] }) },
        { type: 'play', label: 'C maj7 (lush)', chord: true, notes: getChordNotes('C', 'Maj7') },
        { type: 'play', label: 'C7 (dominant — wants to resolve)', chord: true, notes: getChordNotes('C', 'Dom7') },
        { type: 'play', label: 'C m7 (smooth)', chord: true, notes: getChordNotes('C', 'Min7') },
        { type: 'play', label: 'C m7♭5 (half-diminished — tense)', chord: true, notes: getChordNotes('C', 'm7b5') },
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
          a surprise).</p>
          <p>A phrase can also <em>end on the V</em> — e.g. <strong>I → V</strong>, a <strong>half
          cadence</strong> — which sounds unfinished, like a comma. An authentic V → I is called
          <strong>perfect (PAC)</strong> when both chords are root-position and the tonic is on top, and
          <strong>imperfect (IAC)</strong> otherwise — a gentler landing.</p>` },
        { type: 'play', label: 'Authentic cadence: G7 → C', chordSeq: [getChordNotes('G', 'Dom7'), getChordNotes('C', 'Major')] },
        { type: 'play', label: 'Plagal “amen”: F → C', chordSeq: [getChordNotes('F', 'Major'), getChordNotes('C', 'Major')] },
        { type: 'play', label: 'Deceptive: G7 → Am (a surprise)', chordSeq: [getChordNotes('G', 'Dom7'), getChordNotes('A', 'Minor')] },
        { type: 'play', label: 'Half cadence: C → G7 (sounds unfinished)', chordSeq: [getChordNotes('C', 'Major'), getChordNotes('G', 'Dom7')] },
      ],
      quiz: [
        { q: 'A cadence functions like…',
          choices: ['A key signature', 'Musical punctuation ending a phrase', 'A time signature', 'A scale'], answer: 1,
          explain: 'Cadences close phrases the way punctuation closes sentences.' },
        { q: 'The strongest, most final cadence is…',
          choices: ['IV → I', 'V → vi', 'V → I', 'ii → iii'], answer: 2, explain: 'The authentic cadence V → I resolves home.' },
        { q: 'IV → I is known as the ___ cadence.',
          choices: ['Authentic', 'Plagal (“amen”)', 'Deceptive', 'Half'], answer: 1, explain: 'The plagal or “amen” cadence.' },
        { q: 'A phrase that ends on the V chord (e.g. I → V) is a…',
          choices: ['Plagal cadence', 'Half cadence', 'Authentic cadence', 'Deceptive cadence'], answer: 1,
          explain: 'Ending on V sounds unfinished — a half cadence.' },
      ],
    },
    {
      id: 'pro-secondary',
      title: 'Secondary Dominants',
      sections: [
        { type: 'prose', html: `
          <p>Any chord can be briefly treated as a temporary “home” by borrowing <em>its</em> dominant —
          the dominant-7th chord a 5th above it. These are <strong>secondary dominants</strong>, written
          <strong>V/x</strong> (“five of x”).</p>
          <p>The most common is <strong>V/V</strong>, the dominant of the dominant. In C major that’s
          <strong>D7</strong> (D F♯ A C); its F♯ is a leading tone into G, pulling hard into the real V
          (G7), then home to C.</p>` },
        { type: 'play', label: 'V/V → V → I in C: D7 – G7 – C', chordSeq: [
            getChordNotes('D', 'Dom7'), getChordNotes('G', 'Dom7'), getChordNotes('C', 'Major')] },
        { type: 'play', label: 'V/vi → vi in C: E7 – Am', chordSeq: [
            getChordNotes('E', 'Dom7'), getChordNotes('A', 'Minor')] },
        { type: 'play', label: 'V/ii → ii in C: A7 – Dm', chordSeq: [
            getChordNotes('A', 'Dom7'), getChordNotes('D', 'Minor')] },
      ],
      quiz: [
        { q: 'A secondary dominant is…',
          choices: ['The second chord of a song', 'A chord borrowed as the dominant of a non-tonic chord',
                    'Any minor chord', 'The relative minor'], answer: 1,
          explain: 'It’s the V (usually V7) of a chord other than the tonic — written V/x.' },
        { q: 'In C major, the secondary dominant V/V is…',
          choices: ['G7', 'D7', 'F7', 'C7'], answer: 1,
          explain: 'The dominant of G (the V) is D7 — its F♯ leads up to G.' },
        { q: 'What makes a secondary dominant pull so strongly to its target?',
          choices: ['It is louder', 'Its dominant-7th adds a leading tone into the target chord',
                    'It removes the 5th', 'It is always minor'], answer: 1,
          explain: 'The dominant 7th introduces a leading tone a half step below the target’s root.' },
      ],
    },
    {
      id: 'pro-figured',
      title: 'Inversion Figures',
      sections: [
        { type: 'prose', html: `
          <p>A Roman numeral can also show a chord’s <strong>inversion</strong> with small figures (from
          figured bass) that say which chord tone is in the bass:</p>
          <ul>
            <li><strong>Triads:</strong> root position = no figure; <strong>6</strong> = first inversion
            (3rd in the bass); <strong>6/4</strong> = second inversion (5th in the bass).</li>
            <li><strong>Seventh chords:</strong> <strong>7</strong> = root; <strong>6/5</strong> = first;
            <strong>4/3</strong> = second; <strong>4/2</strong> = third inversion (the 7th in the bass).</li>
          </ul>
          <p>So <strong>V6</strong> is a dominant triad with its 3rd in the bass; <strong>V4/3</strong> is a
          dominant 7th with its 5th in the bass. The numbers are just the intervals above the bass note.</p>` },
        { type: 'play', label: 'C → C6 → C6/4 (root, then 3rd, then 5th in the bass)', chordSeq: [
            [{ name: 'C', octave: 4 }, { name: 'E', octave: 4 }, { name: 'G', octave: 4 }],
            [{ name: 'E', octave: 4 }, { name: 'G', octave: 4 }, { name: 'C', octave: 5 }],
            [{ name: 'G', octave: 4 }, { name: 'C', octave: 5 }, { name: 'E', octave: 5 }]] },
      ],
      quiz: [
        { q: 'A “6” after a Roman numeral means the chord is…',
          choices: ['A six-note chord', 'In first inversion (3rd in the bass)', 'Major', 'In root position'], answer: 1,
          explain: 'The figure 6 marks first inversion — the 3rd is in the bass.' },
        { q: 'For a seventh chord, which figure puts the 7th in the bass?',
          choices: ['6/5', '4/3', '4/2', '7'], answer: 2, explain: '4/2 (third inversion) places the 7th in the bass.' },
        { q: 'Inversion figures are counted from…',
          choices: ['The tempo', 'The intervals above the bass note', 'The key signature', 'The clef'], answer: 1,
          explain: 'Figured bass numbers the intervals above the bass.' },
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
