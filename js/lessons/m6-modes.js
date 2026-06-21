// Module 6 — Modes
import { scaleToABC, getScaleNotes, octaveScale } from '../theory.js';

export default {
  id: 'modes',
  title: 'Modes',
  blurb: 'The seven flavours of the major scale and their characteristic colours.',
  lessons: [
    {
      id: 'mode-what',
      title: 'What Are Modes?',
      sections: [
        { type: 'prose', html: `
          <p>Play the white keys from C to C and you get C major (<strong>Ionian</strong>). Play the
          same white keys but start and end on <strong>D</strong>, and the pattern of steps shifts —
          you get <strong>D Dorian</strong>, a different mood from the same notes. Each starting degree
          gives a <strong>mode</strong>:</p>
          <p style="text-align:center;line-height:2">
          1 Ionian · 2 Dorian · 3 Phrygian · 4 Lydian · 5 Mixolydian · 6 Aeolian · 7 Locrian</p>
          <p>Modes are how one parent scale yields seven distinct colours.</p>` },
        { type: 'notation', caption: 'D Dorian — white keys from D to D.', abc: scaleToABC('D', 'Dorian', { octave: 4 }) },
        { type: 'play', label: 'Hear D Dorian', seq: true,
          notes: octaveScale(getScaleNotes('D', 'Dorian')) },
      ],
      quiz: [
        { q: 'Playing the white keys from D to D gives which mode?',
          choices: ['D Ionian', 'D Dorian', 'D Phrygian', 'D Lydian'], answer: 1,
          explain: 'Starting on the 2nd degree of C major gives Dorian.' },
        { q: 'How many modes come from the major scale?',
          choices: ['5', '6', '7', '12'], answer: 2, explain: 'One per scale degree — seven modes.' },
        { q: 'Ionian is just another name for…',
          choices: ['The minor scale', 'The major scale', 'The blues scale', 'The chromatic scale'], answer: 1,
          explain: 'Ionian = the ordinary major scale.' },
      ],
    },
    {
      id: 'mode-depth',
      title: 'A Mode Up Close: D Dorian',
      sections: [
        { type: 'prose', html: `
          <p>Let’s build one mode slowly. Take the white keys of C major but make <strong>D</strong> home:
          <strong>D E F G A B C D</strong>. That’s <strong>D Dorian</strong> — a minor-sounding scale (it
          has a ♭3, F), but with one bright surprise.</p>
          <p>That surprise is a <strong>natural 6th</strong> (B). It’s Dorian’s <strong>characteristic
          note</strong> — the single degree that sets a mode apart from the plain scale it resembles. Plain
          natural minor has a ♭6; Dorian’s natural 6 is why it sounds like a “hopeful” minor.</p>
          <p>Hear it right after its parent, C major (Ionian) — <em>same keys, different home, different
          mood</em> — then build your own below:</p>` },
        { type: 'play', label: 'C Ionian (major) — C D E F G A B C', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Ionian')) },
        { type: 'play', label: 'D Dorian — same white keys, home on D', seq: true,
          notes: octaveScale(getScaleNotes('D', 'Dorian')) },
        { type: 'interactive', widget: 'scaleLab', config: { root: 'D', scale: 'Dorian' },
          caption: 'Build any mode yourself — change the root and scale, and listen for the characteristic note.' },
      ],
      quiz: [
        { q: 'D Dorian uses the notes of which major scale?',
          choices: ['D major', 'C major', 'G major', 'F major'], answer: 1,
          explain: 'The white keys C–C started on D — so it shares C major’s notes.' },
        { q: 'Dorian’s characteristic note (vs natural minor) is its…',
          choices: ['♭2', 'natural 6th', '♯4', '♭7'], answer: 1,
          explain: 'A natural 6 (not the ♭6 of natural minor) gives Dorian its brighter colour.' },
        { q: 'A “characteristic note” is…',
          choices: ['The loudest note', 'The one altered degree that gives a mode its flavour',
                    'The first note', 'The highest note'], answer: 1,
          explain: 'It’s the degree that distinguishes a mode from the plain major or minor scale.' },
      ],
    },
    {
      id: 'mode-bright-dark',
      title: 'Bright vs Dark Modes',
      sections: [
        { type: 'prose', html: `
          <p>Whether a mode sounds “major” or “minor” depends on its 3rd. From <strong>brightest to
          darkest</strong>, the seven modes run: Lydian, Ionian, Mixolydian (the major-3rd modes), then
          Dorian, Aeolian, Phrygian, Locrian (the minor-3rd modes).</p>
          <p>Each has one <strong>characteristic note</strong> that gives its flavour: Lydian’s ♯4 (dreamy),
          Mixolydian’s ♭7 (bluesy), Dorian’s natural 6 (hopeful minor), Phrygian’s ♭2 (dark, flamenco-flavoured).</p>` },
        { type: 'play', label: 'Lydian (bright, ♯4) — C Lydian', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Lydian')) },
        { type: 'play', label: 'Mixolydian (♭7) — C Mixolydian', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Mixolydian')) },
        { type: 'play', label: 'Phrygian (dark, ♭2) — C Phrygian', seq: true,
          notes: octaveScale(getScaleNotes('C', 'Phrygian')) },
      ],
      quiz: [
        { q: 'Which note makes a mode sound major or minor?',
          choices: ['The 2nd', 'The 3rd', 'The 5th', 'The 7th'], answer: 1, explain: 'A major 3rd = bright; a minor 3rd = dark.' },
        { q: 'Lydian’s characteristic note is the…',
          choices: ['♭2', '♯4', '♭7', '♯5'], answer: 1, explain: 'The raised 4th gives Lydian its dreamy float.' },
        { q: 'Mixolydian is like a major scale but with a…',
          choices: ['♭3', '♭7', '♯4', '♭6'], answer: 1, explain: 'Major scale + ♭7 = the dominant, bluesy Mixolydian.' },
      ],
    },
  ],
};
