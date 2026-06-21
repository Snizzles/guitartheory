// Module 4 — Scales
import { scaleToABC, getScaleNotes, octaveScale } from '../theory.js';

export default {
  id: 'scales',
  title: 'Scales',
  blurb: 'The major-scale formula and the minor, pentatonic and blues scales.',
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
        { type: 'interactive', widget: 'scaleLab', config: { root: 'C', scale: 'Major' },
          caption: 'Build the major scale from any root — the W-W-H-W-W-W-H pattern always holds.' },
      ],
      quiz: [
        { q: 'What is the step pattern of a major scale?',
          choices: ['W W W H W W H', 'W H W W H W W', 'W W H W W W H', 'H W W H W W W'], answer: 2,
          explain: 'Whole Whole Half Whole Whole Whole Half.' },
        { q: 'Which scale uses only the white keys C to C?',
          choices: ['A minor', 'C major', 'G major', 'F major'], answer: 1, explain: 'C major = all white keys.' },
        { q: 'Scale degree 1 (the “home” note) is called the…',
          choices: ['Dominant', 'Leading tone', 'Tonic', 'Subdominant'], answer: 2, explain: 'Degree 1 = the tonic.' },
      ],
    },
    {
      id: 'sca-minor',
      title: 'Minor Scales',
      sections: [
        { type: 'prose', html: `
          <p>The <strong>natural minor</strong> scale sounds darker. Its formula is
          <strong>W H W W H W W</strong>. A natural minor (A B C D E F G) uses all white keys too —
          it’s C major’s “relative minor,” the same notes starting from a different home.</p>
          <p>Two variants tweak the top for stronger pull to the tonic:</p>
          <ul>
            <li><strong>Harmonic minor</strong> — raise the 7th (a leading tone), giving an exotic gap.</li>
            <li><strong>Melodic minor</strong> — raise the 6th and 7th going up, then revert to natural minor coming down.</li>
          </ul>` },
        { type: 'notation', caption: 'A natural minor scale.', abc: scaleToABC('A', 'Natural Minor', { octave: 4 }) },
        { type: 'play', label: 'Hear A natural minor', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Natural Minor')) },
        { type: 'play', label: 'Hear A harmonic minor (raised 7th)', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Harmonic Minor')) },
        { type: 'notation', caption: 'A melodic minor, ascending — the 6th (F♯) and 7th (G♯) are raised.',
          abc: scaleToABC('A', 'Melodic Minor') },
        { type: 'play', label: 'Hear A melodic minor — ascending (raised 6th & 7th)', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Melodic Minor')) },
        { type: 'play', label: 'Hear it descending — reverting to natural minor (G♮, F♮)', seq: true,
          notes: octaveScale(getScaleNotes('A', 'Natural Minor')).slice().reverse() },
      ],
      quiz: [
        { q: 'The natural minor step pattern is…',
          choices: ['W W H W W W H', 'W H W W H W W', 'H W W W H W W', 'W W W H W W H'], answer: 1,
          explain: 'Whole Half Whole Whole Half Whole Whole.' },
        { q: 'A natural minor uses the same notes as which major scale?',
          choices: ['A major', 'C major', 'G major', 'E major'], answer: 1,
          explain: 'A minor is the relative minor of C major — same white keys.' },
        { q: 'Harmonic minor differs from natural minor by…',
          choices: ['Raising the 7th', 'Lowering the 3rd', 'Raising the 2nd', 'Removing the 6th'], answer: 0,
          explain: 'The raised 7th creates a leading tone pulling to the tonic.' },
      ],
    },
    {
      id: 'sca-pentatonic',
      title: 'Pentatonic & Blues Scales',
      sections: [
        { type: 'prose', html: `
          <p><strong>Pentatonic</strong> scales use just five notes. The <strong>major pentatonic</strong>
          is the major scale with the 4th and 7th removed (1 2 3 5 6) — bright and singable. The
          <strong>minor pentatonic</strong> (1 ♭3 4 5 ♭7) is the backbone of rock and blues solos.</p>
          <p>Add one chromatic <strong>“blue note”</strong> (the ♭5) to the minor pentatonic and you get the
          <strong>blues scale</strong>.</p>` },
        { type: 'notation', caption: 'C major pentatonic (5 notes).', abc: scaleToABC('C', 'Pentatonic Major') },
        { type: 'play', label: 'Hear C minor pentatonic', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Pentatonic Minor')) },
        { type: 'play', label: 'Hear C blues scale (with ♭5)', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Blues')) },
      ],
      quiz: [
        { q: 'How many notes are in a pentatonic scale?',
          choices: ['4', '5', '6', '7'], answer: 1, explain: '“Penta” = five.' },
        { q: 'Major pentatonic is the major scale with which degrees removed?',
          choices: ['2 and 6', '3 and 7', '4 and 7', '1 and 5'], answer: 2, explain: 'Remove the 4th and 7th.' },
        { q: 'The blues scale is a minor pentatonic plus which added note?',
          choices: ['♭2', '♭5 (the blue note)', '♯6', 'natural 7'], answer: 1,
          explain: 'The chromatic ♭5 is the signature “blue note.”' },
      ],
    },
  ],
};
