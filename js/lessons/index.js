// lessons/index.js — Aggregates all modules and provides navigation helpers.

import m1 from './m1-fundamentals.js';
import m2 from './m2-rhythm.js';
import m3 from './m3-intervals.js';
import m4 from './m4-scales.js';
import m5 from './m5-keys.js';
import m6 from './m6-modes.js';
import m7 from './m7-triads.js';
import m8 from './m8-progressions.js';

const MODULES = [m1, m2, m3, m4, m5, m6, m7, m8];

// Flattened, ordered list of lessons with a back-reference to their module.
const LESSONS = [];
MODULES.forEach((mod, mi) => {
  mod.lessons.forEach((lesson, li) => {
    LESSONS.push({ ...lesson, moduleId: mod.id, moduleTitle: mod.title, moduleIndex: mi, lessonIndex: li });
  });
});

const lessonIndexById = new Map(LESSONS.map((l, i) => [l.id, i]));

function getLesson(id) {
  const i = lessonIndexById.get(id);
  return i == null ? null : LESSONS[i];
}
function nextLesson(id) {
  const i = lessonIndexById.get(id);
  return (i == null || i + 1 >= LESSONS.length) ? null : LESSONS[i + 1];
}
function prevLesson(id) {
  const i = lessonIndexById.get(id);
  return (i == null || i <= 0) ? null : LESSONS[i - 1];
}
function moduleLessonIds(moduleId) {
  return LESSONS.filter(l => l.moduleId === moduleId).map(l => l.id);
}
const allLessonIds = () => LESSONS.map(l => l.id);

export { MODULES, LESSONS, getLesson, nextLesson, prevLesson, moduleLessonIds, allLessonIds };
