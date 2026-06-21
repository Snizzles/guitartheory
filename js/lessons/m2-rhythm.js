// Module 2 — Reading Rhythm
export default {
  id: 'rhythm',
  title: 'Reading Rhythm',
  blurb: 'Note values, rests, and time signatures — enough to read any example.',
  lessons: [
    {
      id: 'rhy-values',
      title: 'Note Values',
      sections: [
        { type: 'prose', html: `
          <p>Pitch tells you <em>which</em> note; <strong>rhythm</strong> tells you <em>how long</em>
          it lasts. Note values are relative — each is half the length of the one before.
          <strong>In 4/4 time</strong>:</p>
          <ul>
            <li><strong>Whole note</strong> — hollow head, no stem — 4 beats</li>
            <li><strong>Half note</strong> — hollow head with a stem — 2 beats</li>
            <li><strong>Quarter note</strong> — filled head with a stem — 1 beat</li>
            <li><strong>Eighth note</strong> — filled head, stem + flag — ½ beat</li>
          </ul>` },
        { type: 'notation', caption: 'Whole note; two half notes; four quarter notes — each bar fills 4/4.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\nC4 | C2 C2 | C C C C |\n' },
        { type: 'play', label: 'Hear quarter notes (a steady beat)', seq: true,
          notes: ['C', 'C', 'C', 'C'] },
      ],
      quiz: [
        { q: 'In 4/4 time, how many beats does a whole note last?',
          choices: ['1', '2', '3', '4'], answer: 3, explain: 'A whole note fills all four beats.' },
        { q: 'A quarter note lasts how long compared to a half note?',
          choices: ['Twice as long', 'Half as long', 'The same', 'Four times as long'], answer: 1,
          explain: 'Each value is half the previous: half = 2 beats, quarter = 1.' },
        { q: 'Which note value has a filled head, a stem, and a flag?',
          choices: ['Whole', 'Half', 'Quarter', 'Eighth'], answer: 3, explain: 'The flag marks an eighth note (½ beat).' },
      ],
    },
    {
      id: 'rhy-meter',
      title: 'Time Signatures & Measures',
      sections: [
        { type: 'prose', html: `
          <p>Vertical <strong>bar lines</strong> divide music into <strong>measures</strong> (bars).
          A <strong>time signature</strong> at the start says how each bar is counted.</p>
          <p>The <strong>top number</strong> = how many beats per bar. The <strong>bottom number</strong>
          = which note value gets one beat (4 = quarter note). So <strong>4/4</strong> is “four quarter-note
          beats per bar” — by far the most common. <strong>3/4</strong> gives three beats (a waltz).</p>` },
        { type: 'notation', caption: '3/4 time: three quarter-note beats in every bar.',
          clickToHear: false,
          abc: 'X:1\nM:3/4\nL:1/4\nK:C\nC D E | F G A |\n' },
        { type: 'callout', variant: 'key', title: 'Reading a time signature',
          html: 'Top = beats per bar. Bottom = the note value worth one beat (4 = quarter, 8 = eighth).' },
      ],
      quiz: [
        { q: 'In a time signature, what does the top number tell you?',
          choices: ['The tempo', 'Beats per bar', 'Which note is the beat', 'The key'], answer: 1,
          explain: 'Top = number of beats in each measure.' },
        { q: 'What does the bottom number 4 mean?',
          choices: ['Four bars', 'Four sharps', 'The quarter note gets one beat', 'Play four times'], answer: 2,
          explain: 'Bottom 4 = a quarter note equals one beat.' },
        { q: 'How many beats are in one bar of 3/4?',
          choices: ['2', '3', '4', '6'], answer: 1, explain: 'Three quarter-note beats — a waltz feel.' },
      ],
    },
    {
      id: 'rhy-rests-dots',
      title: 'Rests, Dots & Ties',
      sections: [
        { type: 'prose', html: `
          <p>Silence is written too. Every note value has a matching <strong>rest</strong> of the same
          length — a beat of silence.</p>
          <p>A <strong>dot</strong> after a note adds half of its own value: a dotted half note = 2 + 1 =
          <strong>3 beats</strong>. A <strong>tie</strong> is a curved line joining two notes of the same
          pitch into one longer sound (e.g. tie two halves across a bar line for a 4-beat note).</p>` },
        { type: 'notation', caption: 'A dotted half (3 beats) + a quarter fills a 4/4 bar.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\nC3 D | z2 E2 |\n' },
        { type: 'notation', caption: 'Rests mirror notes: a whole rest, two half rests, four quarter rests.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\nz4 | z2 z2 | z z z z |\n' },
        { type: 'notation', caption: 'A tie joins two same-pitch notes across the bar line into one sustained sound.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\nC4- | C4 |\n' },
        { type: 'callout', variant: 'tip', title: 'Dot maths',
          html: 'A dot = “add half again.” Dotted quarter = 1 + ½ = 1½ beats. Dotted half = 2 + 1 = 3 beats.' },
      ],
      quiz: [
        { q: 'A dot after a note adds…',
          choices: ['One beat', 'Half of the note’s value', 'Double the value', 'A rest'], answer: 1,
          explain: 'A dot adds half of the note’s own value.' },
        { q: 'How many beats is a dotted half note?',
          choices: ['2', '2½', '3', '4'], answer: 2, explain: '2 + half of 2 (=1) = 3 beats.' },
        { q: 'What does a tie do?',
          choices: ['Adds a sharp', 'Makes it louder', 'Joins two same-pitch notes into one sound', 'Speeds it up'],
          answer: 2, explain: 'A tie combines the durations of two notes of the same pitch.' },
      ],
    },
    {
      id: 'rhy-subdivision',
      title: 'Sixteenths, Triplets & Syncopation',
      sections: [
        { type: 'prose', html: `
          <p>Keep halving and the eighth note splits into two <strong>sixteenth notes</strong> (two flags,
          ¼ beat each) — four per quarter-note beat. Notes are <strong>beamed</strong> in beat-sized groups
          so the pulse stays readable.</p>
          <p>Not every division is in twos. A <strong>triplet</strong> squeezes <em>three</em> even notes
          into the space of two — three eighths in one beat, marked with a small “3”.</p>
          <p><strong>Syncopation</strong> accents the <em>off-beats</em> — the “&” between the numbers —
          instead of the strong beats, giving music its push and groove.</p>` },
        { type: 'notation', caption: 'One beat split finer: a quarter, two eighths, then four sixteenths.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\nC C/2C/2 C/4C/4C/4C/4 C |\n' },
        { type: 'notation', caption: 'Eighth-note triplets — three even notes per beat.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\n(3C/2C/2C/2 (3C/2C/2C/2 C C |\n' },
        { type: 'notation', caption: 'Syncopation — the inner notes land between the beats.',
          clickToHear: false,
          abc: 'X:1\nM:4/4\nL:1/4\nK:C\nC/2 C C C C/2 |\n' },
      ],
      quiz: [
        { q: 'How many sixteenth notes fit in one quarter-note beat?',
          choices: ['2', '3', '4', '6'], answer: 2, explain: 'Four sixteenths per quarter — each is ¼ of a beat.' },
        { q: 'A triplet fits how many notes into the usual space of two?',
          choices: ['Two', 'Three', 'Four', 'Six'], answer: 1, explain: 'Three even notes in the time of two.' },
        { q: 'Syncopation places accents…',
          choices: ['On the downbeats', 'Off the beat (the “&”s)', 'Only at the end', 'On the last bar'], answer: 1,
          explain: 'Emphasis falls between the main beats — the source of groove.' },
      ],
    },
    {
      id: 'rhy-compound',
      title: 'Compound Meter — 6/8',
      sections: [
        { type: 'prose', html: `
          <p>So far each beat split into <em>two</em> (simple meter). In <strong>compound meter</strong> each
          beat splits into <em>three</em>. The most common is <strong>6/8</strong>: six eighth notes per bar,
          but felt as <strong>two</strong> beats of three — a lilting <em>ONE-two-three FOUR-five-six</em>.</p>
          <p>The beat is a <strong>dotted quarter</strong> (three eighths). 6/8 powers jigs and ballads with a
          swaying “in two” feel — quite different from 3/4’s three even beats.</p>` },
        { type: 'notation', caption: '6/8 — six eighths grouped in two, then the two dotted-quarter beats.',
          clickToHear: false,
          abc: 'X:1\nM:6/8\nL:1/8\nK:C\nCCC CCC | C3 C3 |\n' },
        { type: 'callout', variant: 'key', title: 'Simple vs compound',
          html: 'Simple meter: each beat divides in two (4/4, 3/4). Compound meter: each beat divides in three (6/8, 9/8, 12/8). In 6/8 the beat is a dotted quarter.' },
      ],
      quiz: [
        { q: 'In 6/8, the beat is usually felt as…',
          choices: ['Six beats', 'Two beats of three', 'Three beats of two', 'One beat'], answer: 1,
          explain: 'Six eighths group into two dotted-quarter beats.' },
        { q: 'In compound meter, each beat divides into…',
          choices: ['Two', 'Three', 'Four', 'Five'], answer: 1, explain: 'Compound = beats split in three (vs two for simple).' },
        { q: 'The beat note in 6/8 is a…',
          choices: ['Quarter note', 'Dotted quarter note', 'Half note', 'Eighth note'], answer: 1,
          explain: 'Three eighths = one dotted quarter, the 6/8 pulse.' },
      ],
    },
  ],
};
