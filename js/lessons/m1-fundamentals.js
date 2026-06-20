// Module 1 — Notation & Pitch
import { buildABC, scaleToABC } from '../theory.js';

export default {
  id: 'fundamentals',
  title: 'Notation & Pitch',
  blurb: 'How pitch works and how it is written down on the staff.',
  lessons: [
    {
      id: 'fund-alphabet',
      title: 'The Musical Alphabet',
      sections: [
        { type: 'prose', html: `
          <p>All of Western music is built from just <strong>seven letter names</strong>:
          <strong>A&nbsp;B&nbsp;C&nbsp;D&nbsp;E&nbsp;F&nbsp;G</strong>. After G the names start
          over at A. That repeating cycle is the <em>musical alphabet</em>.</p>
          <p>When you pass through all seven letters and arrive back at the same letter, you have
          travelled one <strong>octave</strong>. The two notes sound "the same, but higher/lower" —
          they share a name because one vibrates at exactly twice the frequency of the other.</p>` },
        { type: 'play', label: 'Hear A → A (one octave)', seq: true,
          notes: [{ name: 'A', octave: 3 }, { name: 'A', octave: 4 }] },
        { type: 'notation', caption: 'Eight notes of C up to the next C — a C-to-C octave.',
          abc: buildABC(
            ['C', 'D', 'E', 'F', 'G', 'A', 'B', { name: 'C', octave: 5 }],
            { clef: 'treble', dur: '4', perLine: 8, lyrics: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] }) },
        { type: 'callout', variant: 'tip', title: 'Click to listen',
          html: 'Click any note head in the notation above to hear it. Try it!' },
        { type: 'interactive', widget: 'pianoMini', config: { from: 'C', octaves: 1 },
          caption: 'A piano octave. White keys are the seven letter names; click to hear them.' },
      ],
      quiz: [
        { q: 'How many letter names does the musical alphabet use?',
          choices: ['5', '7', '8', '12'], answer: 1,
          explain: 'A B C D E F G — seven letters that repeat.' },
        { q: 'What do we call the distance from one note to the next note of the same name?',
          choices: ['A step', 'An octave', 'A fifth', 'A scale'], answer: 1,
          explain: 'Same letter, double the frequency = one octave.' },
        { q: 'Which letter comes right after G?',
          choices: ['H', 'A', 'C', 'F'], answer: 1,
          explain: 'There is no H in music — after G the alphabet restarts at A.' },
      ],
    },
    {
      id: 'fund-staff',
      title: 'The Staff & Treble Clef',
      sections: [
        { type: 'prose', html: `
          <p>Music is written on a <strong>staff</strong>: five lines and four spaces. The higher a
          note sits, the higher it sounds. A <strong>clef</strong> at the start tells you which
          pitches the lines and spaces represent.</p>
          <p>The <strong>treble clef</strong> (or G clef) curls around the second line from the
          bottom, marking it as <strong>G</strong>. From there the notes follow the musical
          alphabet up and down by line/space.</p>` },
        { type: 'notation', caption: 'Treble-clef line notes, bottom to top: E G B D F.',
          abc: buildABC(['E', 'G', 'B', { name: 'D', octave: 5 }, { name: 'F', octave: 5 }],
            { clef: 'treble', dur: '4', perLine: 5, lyrics: ['E', 'G', 'B', 'D', 'F'] }) },
        { type: 'callout', variant: 'tip', title: 'Memory hooks',
          html: 'Lines (bottom→top) <strong>E G B D F</strong> — “<em>Every Good Boy Does Fine</em>”. Spaces spell <strong>F A C E</strong>.' },
        { type: 'notation', caption: 'Treble-clef space notes: F A C E.',
          abc: buildABC(['F', 'A', { name: 'C', octave: 5 }, { name: 'E', octave: 5 }],
            { clef: 'treble', dur: '4', perLine: 4, lyrics: ['F', 'A', 'C', 'E'] }) },
      ],
      quiz: [
        { q: 'How many lines does a musical staff have?',
          choices: ['4', '5', '6', '7'], answer: 1, explain: 'Five lines and four spaces.' },
        { q: 'The treble-clef spaces (bottom to top) spell which word?',
          choices: ['FACE', 'EGBDF', 'CAGE', 'BEAD'], answer: 0, explain: 'F – A – C – E.' },
        { q: 'A higher position on the staff means the note sounds…',
          choices: ['Louder', 'Higher', 'Longer', 'Shorter'], answer: 1,
          explain: 'Vertical position = pitch; higher on the staff = higher pitch.' },
      ],
    },
    {
      id: 'fund-grand-staff',
      title: 'Bass Clef & the Grand Staff',
      sections: [
        { type: 'prose', html: `
          <p>Lower instruments and the left hand of the piano use the <strong>bass clef</strong>
          (F clef). Its two dots surround the second line from the top, marking it as
          <strong>F</strong>.</p>
          <p>Stack the treble clef above the bass clef and join them and you get the
          <strong>grand staff</strong>. The note that sits between them — on a short
          <em>ledger line</em> — is <strong>middle C</strong>, the centre of the piano.</p>` },
        { type: 'notation', caption: 'Bass-clef line notes: G B D F A.',
          abc: buildABC(
            [{ name: 'G', octave: 2 }, { name: 'B', octave: 2 }, { name: 'D', octave: 3 },
             { name: 'F', octave: 3 }, { name: 'A', octave: 3 }],
            { clef: 'bass', dur: '4', perLine: 5, lyrics: ['G', 'B', 'D', 'F', 'A'] }) },
        { type: 'callout', variant: 'tip', title: 'Bass memory hooks',
          html: 'Lines <strong>G B D F A</strong> — “<em>Good Boys Do Fine Always</em>”. Spaces <strong>A C E G</strong> — “<em>All Cows Eat Grass</em>”.' },
        { type: 'play', label: 'Hear middle C', notes: [{ name: 'C', octave: 4 }] },
      ],
      quiz: [
        { q: 'Which clef is used for lower pitches and the piano left hand?',
          choices: ['Treble', 'Bass', 'Alto', 'Tenor'], answer: 1, explain: 'The bass (F) clef.' },
        { q: 'The note sitting between the treble and bass staves is…',
          choices: ['Middle C', 'High G', 'Low F', 'Middle A'], answer: 0,
          explain: 'Middle C sits on a ledger line between the two staves.' },
        { q: 'A grand staff is made of which two clefs joined together?',
          choices: ['Treble + alto', 'Bass + tenor', 'Treble + bass', 'Two treble'], answer: 2,
          explain: 'Treble on top, bass below, joined by a brace.' },
      ],
    },
    {
      id: 'fund-accidentals',
      title: 'Sharps, Flats & the Chromatic Scale',
      sections: [
        { type: 'prose', html: `
          <p>Between the seven letter names live the “in-between” pitches. A <strong>sharp (♯)</strong>
          raises a note by the smallest distance in Western music; a <strong>flat (♭)</strong> lowers
          it. A <strong>natural (♮)</strong> cancels a sharp or flat.</p>
          <p>Play every pitch in order — letters and in-betweens — and you get the
          <strong>chromatic scale</strong>, twelve notes per octave:</p>
          <p style="text-align:center;font-size:1.05rem;letter-spacing:.04em">
          C&nbsp; C♯&nbsp; D&nbsp; D♯&nbsp; E&nbsp; F&nbsp; F♯&nbsp; G&nbsp; G♯&nbsp; A&nbsp; A♯&nbsp; B&nbsp; (C)</p>
          <p>The same key can have two names: C♯ and D♭ are the <strong>same pitch</strong> spelled
          differently. These are <strong>enharmonic equivalents</strong>.</p>` },
        { type: 'play', label: 'Hear the chromatic scale', seq: true,
          notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', { name: 'C', octave: 5 }] },
        { type: 'interactive', widget: 'pianoMini', config: { from: 'C', octaves: 1, showBlack: true },
          caption: 'The black keys are the sharps/flats. C♯ and D♭ are the same black key.' },
      ],
      quiz: [
        { q: 'How many different pitches are in one octave of the chromatic scale?',
          choices: ['7', '8', '12', '13'], answer: 2, explain: 'Twelve — seven letters plus five in-between notes.' },
        { q: 'A sharp (♯) does what to a note?',
          choices: ['Raises it', 'Lowers it', 'Cancels it', 'Doubles it'], answer: 0,
          explain: 'Sharp raises by a half step; flat lowers by a half step.' },
        { q: 'C♯ and D♭ are…',
          choices: ['Different pitches', 'The same pitch, spelled two ways', 'An octave apart', 'Both naturals'],
          answer: 1, explain: 'They are enharmonic equivalents — one key, two names.' },
      ],
    },
    {
      id: 'fund-steps',
      title: 'Half Steps & Whole Steps',
      sections: [
        { type: 'prose', html: `
          <p>The chromatic scale moves by the smallest unit, the <strong>half step</strong>
          (semitone) — adjacent keys on a piano, e.g. E→F or C→C♯.</p>
          <p>Skip one key and you have a <strong>whole step</strong> (two half steps), e.g. C→D
          or E→F♯.</p>
          <p>Watch out: between <strong>B–C</strong> and <strong>E–F</strong> there is no black key,
          so those white-key pairs are already half steps. Every scale and chord you will learn is
          just a recipe of half and whole steps.</p>` },
        { type: 'play', label: 'Hear a half step (C → C♯)', seq: true, notes: ['C', 'C#'] },
        { type: 'play', label: 'Hear a whole step (C → D)', seq: true, notes: ['C', 'D'] },
        { type: 'callout', variant: 'key', title: 'Remember',
          html: '1 whole step = 2 half steps. The natural half steps are <strong>E–F</strong> and <strong>B–C</strong>.' },
      ],
      quiz: [
        { q: 'A whole step equals how many half steps?',
          choices: ['Half of one', 'One', 'Two', 'Three'], answer: 2, explain: '1 whole step = 2 half steps.' },
        { q: 'Which pair is a natural half step (no note between them)?',
          choices: ['C–D', 'F–G', 'E–F', 'G–A'], answer: 2, explain: 'E–F and B–C have no key between them.' },
        { q: 'C to D is a…',
          choices: ['Half step', 'Whole step', 'Octave', 'Tritone'], answer: 1, explain: 'C→C♯→D is two half steps = one whole step.' },
      ],
    },
  ],
};
