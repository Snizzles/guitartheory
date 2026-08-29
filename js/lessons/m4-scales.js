// Module 4 — Scales
import { scaleToABC, getScaleNotes, octaveScale } from '../theory.js';

export default {
  id: 'scales',
  title: 'Scales',
  blurb: 'Major, the three minors, and the pentatonic and blues scales.',
  lessons: [
    {
      id: 'sca-major',
      title: 'The Major Scale Formula',
      sections: [
        { type: 'prose', html: `
          <p>A <strong>scale</strong> is an ordered set of notes that defines a key’s “home” sound.
          The <strong>major scale</strong> is the foundation of Western music, built from one fixed
          recipe of whole (W) and half (H) steps:</p>
          <p style="text-align:center;font-size:1.1rem;letter-spacing:.06em"><strong>W&nbsp;W&nbsp;H&nbsp;W&nbsp;W&nbsp;W&nbsp;H</strong></p>
          <p>Start on C and apply it using only white keys and you get <strong>C major</strong>:
          C D E F G A B C. Notice the two half steps fall exactly at E–F and B–C.</p>` },
        { type: 'notation', caption: 'C major scale, ascending.', abc: scaleToABC('C', 'Major') },
        { type: 'play', label: 'Hear C major', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Major')) },
        { type: 'callout', variant: 'key', title: 'Scale degrees',
          html: 'Each note has a number (1–7) and a name: 1 = tonic, 4 = subdominant, 5 = dominant, 7 = leading tone. Degree 1 is “home.”' },
        { type: 'prose', html: `
          <p>The formula is the whole point: it works from <em>any</em> starting note. Begin on
          <strong>G</strong> and follow W-W-H-W-W-W-H and you get G A B C D E <strong>F♯</strong> G.</p>
          <p>The F♯ isn’t a choice — it’s forced. Between the 6th and 7th degrees the formula demands a
          whole step, and E to F♮ is only a half step, so the 7th has to be raised. Every major scale
          needs exactly the sharps or flats that keep this pattern intact, which is precisely what a
          <em>key signature</em> records (Module 5).</p>` },
        { type: 'notation', caption: 'G major — the same pattern, so the 7th must be F♯.',
          abc: scaleToABC('G', 'Major') },
        { type: 'play', label: 'Hear G major', seq: true,
          notes: octaveScale(getScaleNotes('G', 'Major')) },
        { type: 'interactive', widget: 'scaleLab', config: { root: 'C', scale: 'Major' },
          caption: 'Pick a root and a scale — the formula, step pattern, notes and notation all update to match.' },
      ],
      quiz: [
        { q: 'What is the step pattern of a major scale?',
          choices: ['W W W H W W H', 'W H W W H W W', 'W W H W W W H', 'H W W H W W W'], answer: 2,
          explain: 'Whole Whole Half Whole Whole Whole Half.' },
        { q: 'Which scale uses only the white keys C to C?',
          choices: ['A minor', 'C major', 'G major', 'F major'], answer: 1, explain: 'C major = all white keys.' },
        { q: 'Scale degree 1 (the “home” note) is called the…',
          choices: ['Dominant', 'Leading tone', 'Tonic', 'Subdominant'], answer: 2, explain: 'Degree 1 = the tonic.' },
        { q: 'Why does G major contain F♯ rather than F♮?',
          choices: ['To make it sound brighter', 'Because the formula needs a whole step between degrees 6 and 7',
                    'Because G is a sharp key by tradition', 'To avoid using the note F'], answer: 1,
          explain: 'E to F♮ is only a half step; the pattern requires a whole step, so the 7th is raised to F♯.' },
      ],
    },
    {
      id: 'sca-minor',
      title: 'The Natural Minor Scale',
      sections: [
        { type: 'prose', html: `
          <p>The <strong>natural minor</strong> scale sounds darker. Its formula is
          <strong>W H W W H W W</strong>, which against the major scale reads
          <strong>1 2 ♭3 4 5 ♭6 ♭7</strong> — three lowered degrees, and the ♭3 does most of the work.</p>
          <p>A natural minor (A B C D E F G) uses all white keys, just like C major. Same notes,
          different home — that makes it C major’s <strong>relative minor</strong>.</p>` },
        { type: 'notation', caption: 'A natural minor — the white keys, starting from A.',
          abc: scaleToABC('A', 'Natural Minor') },
        { type: 'play', label: 'Hear A natural minor', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Natural Minor')) },
        { type: 'prose', html: `
          <p>There are two different ways a major and a minor scale can be related, and beginners often
          run them together:</p>
          <ul>
            <li><strong>Relative</strong> — <em>same notes, different tonic</em>. C major and A minor
            share all seven notes and one key signature.</li>
            <li><strong>Parallel</strong> — <em>same tonic, different notes</em>. C major and C minor
            both call C home, but C minor flattens the 3rd, 6th and 7th: C D <strong>E♭</strong> F G
            <strong>A♭</strong> <strong>B♭</strong>.</li>
          </ul>
          <p>Play the parallel pair back to back — same starting note, and the mood flips.</p>` },
        { type: 'notation', caption: 'C natural minor — same home as C major, three degrees lowered.',
          abc: scaleToABC('C', 'Natural Minor') },
        { type: 'play', label: 'Hear C major (bright)', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Major')) },
        { type: 'play', label: 'Hear C minor — its parallel minor (same home, darker)', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Natural Minor')) },
        { type: 'callout', variant: 'key', title: 'Relative vs parallel',
          html: '<strong>Relative</strong> = same notes, different tonic (C major ↔ A minor). <strong>Parallel</strong> = same tonic, different notes (C major ↔ C minor).' },
      ],
      quiz: [
        { q: 'The natural minor step pattern is…',
          choices: ['W W H W W W H', 'W H W W H W W', 'H W W W H W W', 'W W W H W W H'], answer: 1,
          explain: 'Whole Half Whole Whole Half Whole Whole.' },
        { q: 'A natural minor uses the same notes as which major scale?',
          choices: ['A major', 'C major', 'G major', 'E major'], answer: 1,
          explain: 'A minor is the relative minor of C major — same white keys.' },
        { q: 'Against the major scale, natural minor lowers which degrees?',
          choices: ['2, 4 and 6', '3, 6 and 7', '1, 4 and 5', '2, 5 and 7'], answer: 1,
          explain: '1 2 ♭3 4 5 ♭6 ♭7 — the flat 3rd is what makes it sound minor.' },
        { q: 'C minor is C major’s ___ minor.',
          choices: ['relative', 'parallel', 'harmonic', 'chromatic'], answer: 1,
          explain: 'Same tonic, different notes = parallel. (C major’s *relative* minor is A minor.)' },
      ],
    },
    {
      id: 'sca-minor-variants',
      title: 'Harmonic & Melodic Minor',
      sections: [
        { type: 'prose', html: `
          <p>Natural minor has one weakness. Its 7th degree sits a <em>whole</em> step below the tonic
          (G up to A), so it drifts home rather than pulling there. Compare that with a major scale,
          where the 7th is only a half step below the tonic — a <strong>leading tone</strong> that
          leans hard into home.</p>
          <p><strong>Harmonic minor</strong> fixes it by raising the 7th, and nothing else:
          <strong>1 2 ♭3 4 5 ♭6 7</strong>. In A minor that turns G into <strong>G♯</strong>.</p>` },
        { type: 'notation', caption: 'A harmonic minor — the 7th raised to G♯.',
          abc: scaleToABC('A', 'Harmonic Minor') },
        { type: 'play', label: 'Hear A natural minor (7th drifts home)', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Natural Minor')) },
        { type: 'play', label: 'Hear A harmonic minor (7th pulls home)', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Harmonic Minor')) },
        { type: 'prose', html: `
          <p>Raising the 7th has a side effect. The gap from the ♭6 to the raised 7th (F up to G♯) is now
          <strong>three half steps</strong> — an <em>augmented 2nd</em>, wider than any step in the major
          scale. That leap is exactly the “exotic,” Middle-Eastern-tinged colour people recognise in
          harmonic minor.</p>
          <p><strong>Melodic minor</strong> smooths it out by raising the <em>6th as well</em>, so the
          top of the scale climbs evenly: <strong>1 2 ♭3 4 5 6 7</strong>. Classically it does this only
          on the way <em>up</em>; coming down there is no leading tone to set up, so it reverts to plain
          natural minor. (Jazz keeps the raised form in both directions — the “jazz minor.”)</p>` },
        { type: 'notation', caption: 'A melodic minor ascending — 6th (F♯) and 7th (G♯) both raised.',
          abc: scaleToABC('A', 'Melodic Minor') },
        { type: 'play', label: 'Hear A melodic minor — ascending', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Melodic Minor')) },
        { type: 'play', label: 'Hear it descending — back to natural minor (G♮, F♮)', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Natural Minor')).slice().reverse() },
        { type: 'callout', variant: 'key', title: 'Why this matters later',
          html: 'The raised 7th is what gives a minor key its major <strong>V</strong> chord and a diminished <strong>vii°</strong> — the engine behind cadences in minor. You’ll harmonise all of this in Module 7.' },
        { type: 'interactive', widget: 'scaleLab', config: { root: 'A', scale: 'Harmonic Minor' },
          caption: 'Compare the three minors from the same root — watch the formula row change.' },
      ],
      quiz: [
        { q: 'Harmonic minor differs from natural minor by…',
          choices: ['Raising the 7th', 'Lowering the 3rd', 'Raising the 2nd', 'Removing the 6th'], answer: 0,
          explain: 'The raised 7th creates a leading tone pulling to the tonic.' },
        { q: 'The distinctive “exotic” leap in harmonic minor sits between degrees…',
          choices: ['1 and 2', '3 and 4', '♭6 and 7', '4 and 5'], answer: 2,
          explain: 'Raising the 7th leaves a three-half-step augmented 2nd from ♭6 up to 7.' },
        { q: 'Melodic minor raises the 6th as well in order to…',
          choices: ['Make it sound more exotic', 'Smooth out the augmented 2nd on the way up',
                    'Turn it into a major scale', 'Remove the leading tone'], answer: 1,
          explain: 'Raising the 6th evens out the climb to the tonic.' },
        { q: 'Classically, descending melodic minor…',
          choices: ['Keeps both raised notes', 'Reverts to natural minor', 'Raises the 5th', 'Is never played'],
          answer: 1, explain: 'Coming down there is no leading tone to prepare, so it reverts.' },
      ],
    },
    {
      id: 'sca-pentatonic',
      title: 'Pentatonic Scales',
      sections: [
        { type: 'prose', html: `
          <p><strong>Pentatonic</strong> scales use just five notes (“penta” = five). The
          <strong>major pentatonic</strong> is the major scale with the 4th and 7th removed —
          <strong>1 2 3 5 6</strong>. In C: C D E G A.</p>
          <p>Those two discarded degrees are exactly the ones involved in the major scale’s half steps
          (E–F and B–C). Take them out and <em>no two notes are a half step apart</em>, so nothing in the
          scale can clash — which is why pentatonics feel so forgiving to improvise with.</p>` },
        { type: 'notation', caption: 'C major pentatonic — five notes, no half steps.',
          abc: scaleToABC('C', 'Pentatonic Major') },
        { type: 'play', label: 'Hear C major pentatonic', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Pentatonic Major')) },
        { type: 'prose', html: `
          <p>The <strong>minor pentatonic</strong> is its darker twin — <strong>1 ♭3 4 5 ♭7</strong>, the
          backbone of rock and blues soloing. In A: A C D E G.</p>
          <p>Look closely and those are the same five notes as C major pentatonic, just started from a
          different home. Pentatonics have relatives exactly like full scales do: <strong>C major
          pentatonic and A minor pentatonic are the same five notes</strong>.</p>` },
        { type: 'notation', caption: 'A minor pentatonic — the same five notes, home on A.',
          abc: scaleToABC('A', 'Pentatonic Minor') },
        { type: 'play', label: 'Hear A minor pentatonic', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Pentatonic Minor')) },
        { type: 'interactive', widget: 'scaleLab', config: { root: 'C', scale: 'Pentatonic Major' },
          caption: 'Switch between the pentatonics and their parent scales to see which degrees drop out.' },
      ],
      quiz: [
        { q: 'How many notes are in a pentatonic scale?',
          choices: ['4', '5', '6', '7'], answer: 1, explain: '“Penta” = five.' },
        { q: 'Major pentatonic is the major scale with which degrees removed?',
          choices: ['2 and 6', '3 and 7', '4 and 7', '1 and 5'], answer: 2, explain: 'Remove the 4th and 7th.' },
        { q: 'Why is a pentatonic scale so hard to play a “wrong” note in?',
          choices: ['It has no half steps, so nothing clashes', 'It has only white keys',
                    'It is always played slowly', 'It contains no 5th'], answer: 0,
          explain: 'Dropping the 4th and 7th removes both half steps from the major scale.' },
        { q: 'A minor pentatonic contains the same five notes as…',
          choices: ['A major pentatonic', 'C major pentatonic', 'G major pentatonic', 'E minor pentatonic'],
          answer: 1, explain: 'Relatives again — same notes, different home.' },
      ],
    },
    {
      id: 'sca-blues',
      title: 'The Blues Scale',
      sections: [
        { type: 'prose', html: `
          <p>Take the minor pentatonic and slip in one extra chromatic note — the <strong>♭5</strong> —
          and you have the six-note <strong>blues scale</strong>: <strong>1 ♭3 4 ♭5 5 ♭7</strong>.
          In C: C E♭ F G♭ G B♭.</p>
          <p>That added ♭5 is the <strong>“blue note.”</strong> It sits between the 4th and the 5th, so
          the scale briefly moves in half steps — F, G♭, G — and that little chromatic squeeze is the
          grit and vocal “cry” the blues is built on.</p>` },
        { type: 'notation', caption: 'C blues scale — the ♭5 (G♭) wedged between the 4th and 5th.',
          abc: scaleToABC('C', 'Blues') },
        { type: 'play', label: 'Hear C minor pentatonic (no blue note)', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Pentatonic Minor')) },
        { type: 'play', label: 'Hear C blues scale (with the ♭5)', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Blues')) },
        { type: 'callout', variant: 'tip', title: 'Use it as a passing note',
          html: 'The blue note is tense on purpose. It usually works best <em>passed through</em> on the way between the 4th and 5th rather than landed on and held.' },
        { type: 'interactive', widget: 'scaleLab', config: { root: 'C', scale: 'Blues' },
          caption: 'Try the blues scale from other roots, and compare it with the minor pentatonic it grew from.' },
      ],
      quiz: [
        { q: 'The blues scale is a minor pentatonic plus which added note?',
          choices: ['♭2', '♭5 (the blue note)', '♯6', 'natural 7'], answer: 1,
          explain: 'The chromatic ♭5 is the signature “blue note.”' },
        { q: 'How many notes does the blues scale have?',
          choices: ['5', '6', '7', '8'], answer: 1, explain: 'Six — the five pentatonic notes plus the ♭5.' },
        { q: 'The blue note sits between which two degrees?',
          choices: ['1 and ♭3', '4 and 5', '5 and ♭7', '♭7 and 1'], answer: 1,
          explain: '4 – ♭5 – 5 gives the scale its chromatic half-step squeeze.' },
      ],
    },
  ],
};
