// progress.js — localStorage-backed course progress: completion, %, and resume.

'use strict';

const KEY = 'mtc_progress_v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completed: {}, lastLesson: null };
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

let state = load();

function isComplete(lessonId) {
  return !!state.completed[lessonId];
}

function markComplete(lessonId) {
  if (!state.completed[lessonId]) {
    state.completed[lessonId] = Date.now();
    save(state);
  }
}

function setLastLesson(lessonId) {
  state.lastLesson = lessonId;
  save(state);
}

function getLastLesson() {
  return state.lastLesson;
}

function completedCount() {
  return Object.keys(state.completed).length;
}

// Overall percentage given the full ordered lesson list.
function coursePercent(allLessonIds) {
  if (!allLessonIds.length) return 0;
  const done = allLessonIds.filter(id => state.completed[id]).length;
  return Math.round((done / allLessonIds.length) * 100);
}

// Per-module {done,total} given lessons grouped by module id.
function modulePercent(lessonIds) {
  const done = lessonIds.filter(id => state.completed[id]).length;
  return { done, total: lessonIds.length, pct: lessonIds.length ? Math.round(done / lessonIds.length * 100) : 0 };
}

function resetAll() {
  state = { completed: {}, lastLesson: null };
  save(state);
}

export {
  isComplete, markComplete, setLastLesson, getLastLesson,
  completedCount, coursePercent, modulePercent, resetAll
};
