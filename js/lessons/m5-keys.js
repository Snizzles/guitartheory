// Module 5 — Keys & the Circle of Fifths
export default {
  id: 'keys',
  title: 'Keys & the Circle of Fifths',
  blurb: 'Key signatures, sharps/flats order, relative keys, and the circle.',
  lessons: [
    {
      id: 'key-signatures',
      title: 'Key Signatures',
      sections: [
        { type: 'prose', html: `
          <p>Rather than write a sharp or flat on every note, music states them once at the start of
          each line as a <strong>key signature</strong>. It tells you the key and which notes are
          consistently raised or lowered.</p>
          <p>Sharps are always added in the same order — <strong>F C G D A E B</strong> — and flats in
          the reverse — <strong>B E A D G C F</strong>. G major has one sharp (F♯); D major has two
          (F♯ C♯); F major has one flat (B♭).</p>` },
        { type: 'notation', caption: 'G major scale — notice the single F♯ in the key signature.',
          clickToHear: true,
          abc: 'X:1\nM:none\nL:1/4\nK:G clef=treble\nG A B c d e f g |\n' },
        { type: 'callout', variant: 'tip', title: 'Order of sharps & flats',
          html: 'Sharps: <strong>F C G D A E B</strong> (“Father Charles Goes Down And Ends Battle”). Flats: reverse it — <strong>B E A D G C F</strong>.' },
      ],
      quiz: [
        { q: 'In what order are sharps added to a key signature?',
          choices: ['B E A D G C F', 'F C G D A E B', 'C D E F G A B', 'G D A E B F C'], answer: 1,
          explain: 'F C G D A E B — flats are the exact reverse.' },
        { q: 'How many sharps does G major have?',
          choices: ['0', '1', '2', '3'], answer: 1, explain: 'One: F♯.' },
        { q: 'A key signature is written…',
          choices: ['On every note', 'Once at the start of each line', 'Only in the first bar', 'Never'], answer: 1,
          explain: 'It appears right after the clef on each staff line.' },
      ],
    },
    {
      id: 'key-relative',
      title: 'Relative Major & Minor',
      sections: [
        { type: 'prose', html: `
          <p>Every major key shares its key signature with a <strong>relative minor</strong> — the same
          notes, a different home. The relative minor starts on the <strong>6th degree</strong> of the
          major scale — which is the same note as a minor 3rd (3 half steps) <em>below</em> the tonic
          (two ways to find the same spot).</p>
          <p>C major ↔ A minor (no sharps/flats). G major ↔ E minor (one sharp). To find a relative
          minor quickly: count down three half steps from the major tonic.</p>` },
        { type: 'play', label: 'C major (bright)', seq: true,
          notes: ['C', 'E', 'G', { name: 'C', octave: 5 }] },
        { type: 'play', label: 'A minor (its relative — same notes, darker)', seq: true,
          notes: ['A', 'C', 'E', { name: 'A', octave: 5 }] },
        { type: 'callout', variant: 'key', title: 'Shortcut',
          html: 'Relative minor = down a minor 3rd (3 half steps) from the major tonic. Relative major = up a minor 3rd from the minor tonic.' },
      ],
      quiz: [
        { q: 'The relative minor starts on which degree of the major scale?',
          choices: ['2nd', '4th', '5th', '6th'], answer: 3, explain: 'The 6th degree — e.g. A in C major.' },
        { q: 'What is the relative minor of C major?',
          choices: ['A minor', 'E minor', 'G minor', 'D minor'], answer: 0, explain: 'C major and A minor share no sharps or flats.' },
        { q: 'Relative major and minor keys share the same…',
          choices: ['Tonic', 'Tempo', 'Key signature', 'Clef'], answer: 2, explain: 'Same key signature, different tonic.' },
      ],
    },
    {
      id: 'key-circle',
      title: 'The Circle of Fifths',
      sections: [
        { type: 'prose', html: `
          <p>Arrange the keys by perfect 5ths and they form a loop — the <strong>circle of fifths</strong>.
          Move <strong>clockwise</strong> (up a 5th) and you add one sharp each step: C → G → D → A …
          Move <strong>counter-clockwise</strong> (down a 5th / up a 4th) and you add one flat:
          C → F → B♭ → E♭ …</p>
          <p>For example, start at <strong>C</strong> (0 sharps), step clockwise to <strong>G</strong>
          (1 sharp), then <strong>D</strong> (2 sharps) — each step adds exactly one. It’s the master map
          of music: neighbouring keys are closely related, the inner ring shows each relative minor, and
          it predicts chord progressions. Click any key below.</p>` },
        { type: 'interactive', widget: 'circleOfFifths', config: {},
          caption: 'Click a key to see its signature and relative minor.' },
      ],
      quiz: [
        { q: 'Moving clockwise around the circle of fifths, each step adds…',
          choices: ['One flat', 'One sharp', 'One whole step', 'One octave'], answer: 1,
          explain: 'Clockwise = up a 5th = +1 sharp. Counter-clockwise = +1 flat.' },
        { q: 'What note is a perfect 5th above C?',
          choices: ['F', 'G', 'A', 'D'], answer: 1, explain: 'C→G is a perfect 5th — the next key clockwise.' },
        { q: 'Two keys next to each other on the circle are…',
          choices: ['Unrelated', 'Closely related (differ by one accidental)', 'Always relative minors', 'An octave apart'],
          answer: 1, explain: 'Adjacent keys differ by just one sharp or flat — very closely related.' },
      ],
    },
  ],
};
