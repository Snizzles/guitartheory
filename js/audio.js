// audio.js — Lightweight Web Audio synth for playing notes, scales, and chords.
// No external samples/soundfonts: a soft triangle-ish tone with an ADSR envelope.

'use strict';

import { pitchClass, parseNote } from './theory.js';

let ctx = null;
let audioUnavailable = false;
function audioCtx() {
  if (audioUnavailable) return null;          // browser has no Web Audio — degrade quietly
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { audioUnavailable = true; return null; }
    try { ctx = new AC(); } catch { audioUnavailable = true; return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// MIDI number then frequency. C4 = 60, A4 = 69 = 440Hz.
function midiOf(name, octave = 4) {
  const { octave: parsedOct } = parseNote(name);
  const oct = parsedOct != null ? parsedOct : octave;
  return 12 * (oct + 1) + pitchClass(name);
}
function freqOf(name, octave = 4) {
  return 440 * Math.pow(2, (midiOf(name, octave) - 69) / 12);
}

// Play a single frequency at time `t` for `dur` seconds.
function playFreq(freq, t, dur, gainPeak = 0.22) {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  // Two stacked oscillators (sine + soft triangle) for a warmer tone
  osc.type = 'triangle';
  osc.frequency.value = freq;

  const osc2 = ac.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq;
  const gain2 = ac.createGain();
  gain2.gain.value = 0.5;

  // ADSR — clamp decay so sustain is reached by the note's end for very short notes
  const a = Math.min(0.012, dur / 2), s = 0.6, r = 0.25;
  const d = Math.min(0.12, Math.max(0, dur - a));
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(gainPeak, t + a);
  gain.gain.linearRampToValueAtTime(gainPeak * s, t + a + d);
  gain.gain.setValueAtTime(gainPeak * s, t + Math.max(dur, a + d));
  gain.gain.linearRampToValueAtTime(0, t + Math.max(dur, a + d) + r);

  osc.connect(gain);
  osc2.connect(gain2);
  gain2.connect(gain);
  gain.connect(ac.destination);

  const stopAt = t + Math.max(dur, a + d) + r + 0.02;
  osc.start(t); osc2.start(t);
  osc.stop(stopAt);
  osc2.stop(stopAt);
  // Release the node graph once playback ends (avoids accumulation under rapid play)
  osc.onended = () => { osc.disconnect(); osc2.disconnect(); gain.disconnect(); gain2.disconnect(); };
}

// Play one note immediately (e.g. on a click).
function playNote(name, octave = 4, dur = 0.6) {
  const ac = audioCtx();
  if (!ac) return;
  playFreq(freqOf(name, octave), ac.currentTime, dur);
}

// Play a melodic sequence. notes: [{name,octave}] or ["C","D"...]; noteDur seconds each.
function playSequence(notes, noteDur = 0.5, gap = 0.0) {
  const ac = audioCtx();
  if (!ac) return 0;
  let t = ac.currentTime + 0.05;
  for (const n of notes) {
    const name = typeof n === 'string' ? n : n.name;
    const oct = typeof n === 'string' ? 4 : (n.octave ?? 4);
    playFreq(freqOf(name, oct), t, noteDur);
    t += noteDur + gap;
  }
  return (notes.length * (noteDur + gap)) * 1000; // ms duration
}

// Play notes together as a chord. notes: [{name,octave}] or ["C","E","G"].
function playChord(notes, dur = 1.1) {
  const ac = audioCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.05;
  for (const n of notes) {
    const name = typeof n === 'string' ? n : n.name;
    const oct = typeof n === 'string' ? 4 : (n.octave ?? 4);
    playFreq(freqOf(name, oct), t, dur, 0.16);
  }
}

// Play raw MIDI note numbers together (used by clickable abcjs notation).
function playMidi(midiNumbers, dur = 0.7) {
  const ac = audioCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.02;
  const list = Array.isArray(midiNumbers) ? midiNumbers : [midiNumbers];
  for (const m of list) {
    const freq = 440 * Math.pow(2, (m - 69) / 12);
    playFreq(freq, t, dur, list.length > 1 ? 0.16 : 0.22);
  }
}

// Play an interval: two notes in sequence, then together.
function playInterval(a, b, octA = 4, octB = 4) {
  playSequence([{ name: a, octave: octA }, { name: b, octave: octB }], 0.45);
  setTimeout(() => playChord([{ name: a, octave: octA }, { name: b, octave: octB }], 1.0), 1100);
}

// Create/resume the AudioContext from a user gesture so the first real play isn't silent.
function primeAudio() { try { audioCtx(); } catch {} }

export { playNote, playSequence, playChord, playInterval, playMidi, freqOf, midiOf, primeAudio };
