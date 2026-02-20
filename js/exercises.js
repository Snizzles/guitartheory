// exercises.js — Exercise modules + simple spaced repetition scoring

'use strict';

import {
  ALL_NOTES, INTERVAL_SHORT,
  getNoteAtPosition, getAllPositionsForNote,
  getScalePositions, getChordNotes, transposeNote,
  normalizeNote
} from './theory.js';

// ─── Spaced Repetition Storage ────────────────────────────────────────────────

const STORAGE_KEY = 'mt_scores';
const STREAK_KEY  = 'mt_streak';
const STATS_KEY   = 'mt_stats';

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

function getItemScore(key) {
  const scores = loadScores();
  return scores[key] || { correct: 0, incorrect: 0, lastSeen: 0 };
}

function recordResult(key, isCorrect) {
  const scores = loadScores();
  if (!scores[key]) scores[key] = { correct: 0, incorrect: 0, lastSeen: 0 };
  if (isCorrect) scores[key].correct++;
  else scores[key].incorrect++;
  scores[key].lastSeen = Date.now();
  saveScores(scores);
}

function getAccuracy(key) {
  const s = getItemScore(key);
  const total = s.correct + s.incorrect;
  return total === 0 ? null : s.correct / total;
}

// Lower score = higher priority (unseen or low accuracy + stale)
function getPriority(key) {
  const s = getItemScore(key);
  const total = s.correct + s.incorrect;
  if (total === 0) return 1000; // never seen — top priority
  const accuracy = s.correct / total;
  const staleness = (Date.now() - s.lastSeen) / (1000 * 60 * 60); // hours
  return (1 - accuracy) * 100 + Math.min(staleness, 48);
}

function buildSession(allKeys, count = 10) {
  return allKeys
    .map(k => ({ key: k, priority: getPriority(k) }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, count)
    .map(x => x.key);
}

// Streak tracking
function getStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":""}');
  } catch { return { count: 0, lastDate: '' }; }
}

function updateStreak() {
  const streak = getStreak();
  const today = new Date().toDateString();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  streak.count = streak.lastDate === yesterday ? streak.count + 1 : 1;
  streak.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  return streak;
}

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch { return {}; }
}

function saveStats(module, sessionResult) {
  const stats = loadStats();
  if (!stats[module]) stats[module] = [];
  stats[module].push({ ...sessionResult, date: Date.now() });
  // Keep last 30 sessions per module
  if (stats[module].length > 30) stats[module] = stats[module].slice(-30);
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ─── Session State ─────────────────────────────────────────────────────────────

class Session {
  constructor(module, questions) {
    this.module = module;
    this.questions = questions;
    this.currentIndex = 0;
    this.results = [];
  }

  get current() { return this.questions[this.currentIndex]; }
  get isDone() { return this.currentIndex >= this.questions.length; }
  get total() { return this.questions.length; }
  get score() { return this.results.filter(Boolean).length; }

  answer(isCorrect) {
    const q = this.current;
    recordResult(q.key, isCorrect);
    this.results.push(isCorrect);
    this.currentIndex++;
  }

  summary() {
    const result = {
      total: this.total,
      correct: this.score,
      accuracy: this.total ? this.score / this.total : 0
    };
    saveStats(this.module, result);
    updateStreak();
    return result;
  }
}

// ─── Utility helpers ───────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr, n = 1) {
  const s = shuffle(arr);
  return n === 1 ? s[0] : s.slice(0, n);
}

function wrongChoices(correctAnswer, pool, n = 3) {
  return shuffle(pool.filter(x => x !== correctAnswer)).slice(0, n);
}

function makeChoices(correct, pool, n = 4) {
  const wrong = wrongChoices(correct, pool, n - 1);
  return shuffle([correct, ...wrong]);
}

// ─── Note Memorization ─────────────────────────────────────────────────────────

function buildNoteMemoSession(tuning, mode = 'find', count = 10, frets = 12) {
  // Mode 'find': given a note name, find all positions
  // Mode 'name': given a position, name the note
  const allKeys = [];

  if (mode === 'find') {
    for (const note of ALL_NOTES) {
      allKeys.push(`note_find_${note}`);
    }
  } else {
    for (let s = 0; s < tuning.length; s++) {
      for (let f = 0; f <= frets; f++) {
        allKeys.push(`note_name_${s}_${f}`);
      }
    }
  }

  const sessionKeys = buildSession(allKeys, count);

  return new Session('notes_' + mode, sessionKeys.map(key => {
    if (mode === 'find') {
      const note = key.split('_')[2];
      return {
        key,
        type: 'find_note',
        prompt: `Find all <strong>${note}</strong> notes on the fretboard`,
        targetNote: note,
        targets: getAllPositionsForNote(note, tuning, frets),
        tuning
      };
    } else {
      const [, , s, f] = key.split('_');
      const string = parseInt(s), fret = parseInt(f);
      const correctNote = getNoteAtPosition(string, fret, tuning);
      return {
        key,
        type: 'name_note',
        prompt: `What note is this?`,
        string,
        fret,
        correctAnswer: correctNote,
        choices: makeChoices(correctNote, ALL_NOTES),
        tuning
      };
    }
  }));
}

// ─── Interval Exercises ─────────────────────────────────────────────────────────

const INTERVAL_LIST = Object.values(INTERVAL_SHORT);
const INTERVAL_SEMITONES = Object.entries(INTERVAL_SHORT).map(([s, name]) => ({ semitones: parseInt(s), name }));

function buildIntervalSession(tuning, mode = 'identify', count = 10, frets = 12) {
  // Mode 'identify': two notes highlighted, pick interval name
  // Mode 'find': given root + interval, click the target note
  const allKeys = [];

  if (mode === 'identify') {
    for (let s = 0; s < tuning.length; s++) {
      for (let f = 0; f < frets; f++) {
        for (const semitones of [1,2,3,4,5,7,12]) {
          allKeys.push(`interval_id_${s}_${f}_${semitones}`);
        }
      }
    }
  } else {
    for (const note of ALL_NOTES) {
      for (const semitones of [1,2,3,4,5,7,12]) {
        allKeys.push(`interval_find_${note}_${semitones}`);
      }
    }
  }

  const sessionKeys = buildSession(allKeys, count);

  return new Session('intervals_' + mode, sessionKeys.map(key => {
    if (mode === 'identify') {
      const [,, s, f, sem] = key.split('_');
      const string = parseInt(s), fret = parseInt(f), semitones = parseInt(sem);
      const noteA = getNoteAtPosition(string, fret, tuning);
      const noteB = transposeNote(noteA, semitones);
      const correctInterval = INTERVAL_SHORT[semitones];
      // Find a position for noteB on same or adjacent string
      const positionsB = getAllPositionsForNote(noteB, tuning, frets);
      const targetPos = positionsB.find(p => p.fret >= fret && p.fret <= fret + semitones + 2) || positionsB[0];
      return {
        key,
        type: 'identify_interval',
        prompt: `What interval is this?`,
        positionA: { string, fret },
        positionB: targetPos,
        noteA,
        noteB,
        correctAnswer: correctInterval,
        choices: makeChoices(correctInterval, INTERVAL_LIST),
        tuning
      };
    } else {
      const parts = key.split('_');
      const note = parts[2], semitones = parseInt(parts[3]);
      const targetNote = transposeNote(note, semitones);
      const intervalName = INTERVAL_SHORT[semitones];
      const targets = getAllPositionsForNote(targetNote, tuning, frets);
      // Pick a random root position
      const rootPositions = getAllPositionsForNote(note, tuning, frets);
      const rootPos = rootPositions[Math.floor(Math.random() * rootPositions.length)] || { string: 0, fret: 0 };
      return {
        key,
        type: 'find_interval',
        prompt: `Find the <strong>${intervalName}</strong> above <strong>${note}</strong>`,
        rootPosition: rootPos,
        rootNote: note,
        targetNote,
        targets,
        tuning
      };
    }
  }));
}

// ─── Scale Patterns ─────────────────────────────────────────────────────────────

function buildScaleSession(tuning, mode = 'name', count = 10, frets = 12) {
  // Mode 'name': show a highlighted pattern, name the scale
  // Mode 'build': given root + scale, click all tones
  const commonScales = ['Major', 'Natural Minor', 'Pentatonic Major', 'Pentatonic Minor', 'Blues', 'Dorian', 'Mixolydian'];
  const allKeys = [];

  for (const note of ALL_NOTES) {
    for (const scale of commonScales) {
      allKeys.push(`scale_${mode}_${note}_${scale.replace(/ /g, '_')}`);
    }
  }

  const sessionKeys = buildSession(allKeys, count);

  return new Session('scales_' + mode, sessionKeys.map(key => {
    const parts = key.split('_');
    // key format: scale_mode_note_scale_name...
    const note = parts[2];
    const scaleName = parts.slice(3).join(' ');

    const positions = getScalePositions(note, scaleName, tuning, frets);

    if (mode === 'name') {
      const correctAnswer = `${note} ${scaleName}`;
      // Generate plausible wrong answers
      const wrongRoots = shuffle(ALL_NOTES.filter(n => n !== note)).slice(0, 1);
      const wrongScales = shuffle(commonScales.filter(s => s !== scaleName)).slice(0, 2);
      const wrongs = [
        `${wrongRoots[0]} ${scaleName}`,
        `${note} ${wrongScales[0]}`,
        `${wrongRoots[0]} ${wrongScales[1]}`
      ];
      return {
        key,
        type: 'name_scale',
        prompt: 'Name this scale pattern',
        root: note,
        scaleName,
        positions,
        correctAnswer,
        choices: shuffle([correctAnswer, ...wrongs]),
        tuning
      };
    } else {
      return {
        key,
        type: 'build_scale',
        prompt: `Click all notes of <strong>${note} ${scaleName}</strong>`,
        root: note,
        scaleName,
        targets: positions,
        tuning
      };
    }
  }));
}

// ─── Chord Construction ────────────────────────────────────────────────────────

function buildChordSession(tuning, mode = 'notes', count = 10) {
  // Mode 'notes': what notes are in chord X?
  // Mode 'name':  given notes, name the chord
  const commonChords = ['Major', 'Minor', 'Dom7', 'Maj7', 'Min7', 'Augmented', 'Diminished', 'Sus4', 'm7b5'];
  const allKeys = [];

  for (const note of ALL_NOTES) {
    for (const chord of commonChords) {
      allKeys.push(`chord_${mode}_${note}_${chord}`);
    }
  }

  const sessionKeys = buildSession(allKeys, count);

  return new Session('chords_' + mode, sessionKeys.map(key => {
    const parts = key.split('_');
    const note = parts[2];
    const chordType = parts.slice(3).join('_');
    const chordNotes = getChordNotes(note, chordType);
    const chordName = `${note} ${chordType}`;

    if (mode === 'notes') {
      const wrongChordTypes = shuffle(commonChords.filter(c => c !== chordType)).slice(0, 3);
      const wrongAnswers = wrongChordTypes.map(wt => getChordNotes(note, wt).join(' – '));
      const correctAnswer = chordNotes.join(' – ');
      return {
        key,
        type: 'chord_notes',
        prompt: `What notes are in <strong>${chordName}</strong>?`,
        chord: chordName,
        root: note,
        chordType,
        chordNotes,
        correctAnswer,
        choices: shuffle([correctAnswer, ...wrongAnswers]),
        tuning
      };
    } else {
      const wrongChords = shuffle(commonChords.filter(c => c !== chordType)).slice(0, 3)
        .map(c => `${note} ${c}`);
      return {
        key,
        type: 'name_chord',
        prompt: `What chord has these notes?\n<strong>${chordNotes.join(' – ')}</strong>`,
        chord: chordName,
        root: note,
        chordType,
        chordNotes,
        correctAnswer: chordName,
        choices: shuffle([chordName, ...wrongChords]),
        tuning
      };
    }
  }));
}

// ─── Weak Spot Summary ─────────────────────────────────────────────────────────

function getWeakSpots(prefix, limit = 5) {
  const scores = loadScores();
  return Object.entries(scores)
    .filter(([k]) => !prefix || k.startsWith(prefix))
    .filter(([, v]) => v.correct + v.incorrect > 0)
    .map(([k, v]) => ({
      key: k,
      accuracy: v.correct / (v.correct + v.incorrect),
      total: v.correct + v.incorrect
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export {
  Session, buildSession,
  buildNoteMemoSession, buildIntervalSession, buildScaleSession, buildChordSession,
  getStreak, updateStreak, getWeakSpots, loadStats, recordResult,
  getAccuracy, shuffle, pickRandom, makeChoices
};
