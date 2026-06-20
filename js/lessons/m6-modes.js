// Module 6 — Modes
import { scaleToABC, getScaleNotes } from '../theory.js';

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
          notes: getScaleNotes('D', 'Dorian').map(n => ({ name: n, octave: 4 })).concat([{ name: 'D', octave: 5 }]) },
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
      id: 'mode-bright-dark',
      title: 'Bright vs Dark Modes',
      sections: [
        { type: 'prose', html: `
          <p>Whether a mode sounds “major” or “minor” depends on its 3rd. <strong>Major-type</strong>
          modes (major 3rd): Lydian, Ionian, Mixolydian — brightest to least. <strong>Minor-type</strong>
          modes (minor 3rd): Dorian, Aeolian, Phrygian, Locrian — least dark to darkest.</p>
          <p>Each has one <strong>characteristic note</strong> that gives its flavour: Lydian’s ♯4 (dreamy),
          Mixolydian’s ♭7 (bluesy), Dorian’s natural 6 (hopeful minor), Phrygian’s ♭2 (Spanish).</p>` },
        { type: 'play', label: 'Lydian (bright, ♯4) — C Lydian', seq: true,
          notes: getScaleNotes('C', 'Lydian').map(n => ({ name: n, octave: 4 })).concat([{ name: 'C', octave: 5 }]) },
        { type: 'play', label: 'Mixolydian (♭7) — C Mixolydian', seq: true,
          notes: getScaleNotes('C', 'Mixolydian').map(n => ({ name: n, octave: 4 })).concat([{ name: 'C', octave: 5 }]) },
        { type: 'play', label: 'Phrygian (dark, ♭2) — C Phrygian', seq: true,
          notes: getScaleNotes('C', 'Phrygian').map(n => ({ name: n, octave: 4 })).concat([{ name: 'C', octave: 5 }]) },
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
