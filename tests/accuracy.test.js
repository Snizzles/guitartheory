import test from 'node:test';
import assert from 'node:assert/strict';
import { midiOf, SCALES, getScaleNotes, octaveScale, getChordNotes } from '../js/theory.js';
import { midiOf as audioMidi, freqOf } from '../js/audio.js';
import { midiOf as fretMidi } from '../js/fretboard.js';
import { getDeck } from '../js/flashcards.js';
import { renderNotation } from '../js/notation.js';
import * as progress from '../js/progress.js';

const midi = n => midiOf(n.name, n.octave);

test('accidentals crossing C preserve absolute pitch in audio and fretboard helpers', () => {
  for (const [note, expected] of [['B#4',72], ['Cb4',59], ['B##4',73], ['Cbb4',58], ['A4',69]]) {
    for (const fn of [midiOf, audioMidi, fretMidi]) assert.equal(fn(note), expected, note);
  }
  assert.equal(freqOf('B#4'), freqOf('C5'));
  assert.equal(freqOf('Cb4'), freqOf('B3'));
});

test('every supported scale ascends by its formula, including enharmonic boundary keys', () => {
  for (const root of ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B','Cb','B#']) {
    for (const [scale, formula] of Object.entries(SCALES)) {
      const notes = octaveScale(getScaleNotes(root, scale));
      assert.deepEqual(notes.map(midi), [...formula,12].map(n => midiOf(notes[0].name,4)+n), `${root} ${scale}`);
    }
  }
});

test('generated chord cards have the labeled inversion as their lowest pitch', () => {
  const roots = ['C','G','D','A','E','B','F','Bb','Eb','Ab','Db','F#'];
  const types = ['Major','Minor','Dom7','Maj7','Min7','Sus2','Sus4','Augmented','Diminished','m7b5','Dim7','6','m6'];
  const original = Math.random;
  try {
    roots.forEach((root, ri) => types.forEach((type, ti) => {
      const notes = getChordNotes(root, type);
      notes.forEach((_, inv) => {
        const picks = [(ri+.1)/roots.length,(ti+.1)/types.length,(inv+.1)/notes.length];
        Math.random = () => picks.shift();
        const card = getDeck('name-chord').generate('all');
        assert.equal(card.play.notes[0].name, notes[inv]);
        const pitches = card.play.notes.map(midi);
        assert.ok(pitches.every((n,i) => i === 0 || n > pitches[i-1]), `${root} ${type} inversion ${inv}`);
      });
    }));
    Math.random = () => .2;
    assert.deepEqual(getDeck('name-chord').generate('basic').play.notes.map(midi), [67,71,74]);
  } finally { Math.random = original; }
});

test('guitar cards carry sounding-pitch transposition while general theory stays at concert pitch', () => {
  const cards = [getDeck('fret-read').generate(), getDeck('fret-name').generate(),
    ...getDeck('string-walk').sequence('s6')];
  for (const card of cards) {
    for (const side of [card.q, card.a]) if (side.abc) assert.equal(side.playbackTranspose, -12);
  }
  assert.equal(getDeck('notes-staff').generate().q.playbackTranspose, undefined);
});

test('notation clicks transpose audio only, leaving the written score intact', () => {
  let params;
  const frequencies = [];
  const param = () => ({setValueAtTime(){}, linearRampToValueAtTime(){}});
  globalThis.window = {
    ABCJS: { renderAbc(el, abc, options) { params=options; assert.equal(abc,'written score'); return [{}]; } },
    AudioContext: class {
      currentTime = 0;
      createOscillator() { return {frequency: {set value(v){frequencies.push(v);}}, connect(){}, start(){}, stop(){}}; }
      createGain() { return {gain:param(), connect(){}}; }
    }
  };
  const click = transpose => {
    frequencies.length=0;
    renderNotation({}, 'written score', {playbackTranspose:transpose});
    params.clickListener({midiPitches:[{pitch:52}]});
    return frequencies[0];
  };
  assert.equal(click(-12), freqOf('E2'));
  assert.equal(click(undefined), freqOf('E3'));
});

test('course completion requires all lessons, even when completed out of order', () => {
  progress.resetAll();
  const ids=['first','middle','final'];
  progress.markComplete('final');
  assert.equal(progress.isCourseComplete(ids), false);
  progress.markComplete('first');
  assert.equal(progress.isCourseComplete(ids), false);
  progress.markComplete('middle');
  assert.equal(progress.isCourseComplete(ids), true);
  assert.equal(progress.isCourseComplete([]), false);
  progress.resetAll();
});
