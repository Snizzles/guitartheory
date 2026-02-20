// app.js — App init, routing, session management

'use strict';

import { TUNING_PRESETS, ALL_NOTES,
         getNoteAtPosition, getScalePositions, getAllPositionsForNote } from './theory.js';
import { Fretboard, COLORS } from './fretboard.js';
import {
  buildNoteMemoSession, buildIntervalSession, buildScaleSession, buildChordSession,
  getStreak, getWeakSpots, loadStats, shuffle
} from './exercises.js';

// ─── State ─────────────────────────────────────────────────────────────────────

const state = {
  tuning: [...TUNING_PRESETS['Standard']],
  currentPage: 'home',
  session: null,
  fretboard: null,
  pendingPositions: [],
  awaitingPositions: false
};

// ─── Tuning Management ─────────────────────────────────────────────────────────

function loadTuning() {
  try {
    const saved = localStorage.getItem('mt_tuning');
    if (saved) state.tuning = JSON.parse(saved);
  } catch {}
}

function saveTuning() {
  localStorage.setItem('mt_tuning', JSON.stringify(state.tuning));
}

function initTuningUI() {
  const select = document.getElementById('tuning-preset');
  const custom = document.getElementById('tuning-custom');

  // Populate preset options
  select.innerHTML = '';
  for (const name of Object.keys(TUNING_PRESETS)) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
  const customOpt = document.createElement('option');
  customOpt.value = 'Custom';
  customOpt.textContent = 'Custom';
  select.appendChild(customOpt);

  // Detect which preset matches current tuning
  const currentStr = JSON.stringify(state.tuning);
  let matched = false;
  for (const [name, t] of Object.entries(TUNING_PRESETS)) {
    if (JSON.stringify(t) === currentStr) {
      select.value = name;
      matched = true;
      break;
    }
  }
  if (!matched) select.value = 'Custom';

  updateCustomTuningUI();

  select.addEventListener('change', () => {
    if (select.value === 'Custom') {
      custom.style.display = 'flex';
    } else {
      state.tuning = [...TUNING_PRESETS[select.value]];
      saveTuning();
      custom.style.display = 'none';
      updateCustomTuningUI();
      onTuningChanged();
    }
  });
}

function updateCustomTuningUI() {
  const custom = document.getElementById('tuning-custom');
  const inputs = custom.querySelectorAll('input');
  inputs.forEach((inp, i) => {
    inp.value = state.tuning[i] || '';
    inp.oninput = () => {
      state.tuning[i] = inp.value.trim() || state.tuning[i];
      saveTuning();
      onTuningChanged();
    };
  });
}

function onTuningChanged() {
  if (state.fretboard) {
    state.fretboard.setTuning(state.tuning);
  }
}

// ─── Navigation ────────────────────────────────────────────────────────────────

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
    const navBtn = document.querySelector(`[data-page="${page}"]`);
    if (navBtn) navBtn.classList.add('active');
    state.currentPage = page;

    if (page === 'home') renderHome();
  }
}

// ─── Home / Dashboard ──────────────────────────────────────────────────────────

function renderHome() {
  const streak = getStreak();
  document.getElementById('streak-count').textContent = streak.count;
  document.getElementById('streak-date').textContent =
    streak.lastDate ? `Last session: ${streak.lastDate}` : 'No sessions yet';

  // Weak spots
  const weakEl = document.getElementById('weak-spots');
  const weak = getWeakSpots('', 5);
  if (weak.length === 0) {
    weakEl.innerHTML = '<em style="color:#6b7280">No data yet — start a session!</em>';
  } else {
    weakEl.innerHTML = weak.map(w => {
      const pct = Math.round(w.accuracy * 100);
      const label = w.key.replace(/_/g, ' ').replace(/^(note|interval|scale|chord) /, '');
      return `<div class="weak-item">
        <span class="weak-label">${label}</span>
        <span class="weak-pct ${pct < 50 ? 'bad' : 'ok'}">${pct}%</span>
      </div>`;
    }).join('');
  }
}

// ─── Exercise Runner ───────────────────────────────────────────────────────────

function startSession(session) {
  state.session = session;
  state.pendingPositions = [];
  state.awaitingPositions = false;
  navigate('exercise');
  renderExercise();
}

function renderExercise() {
  const sess = state.session;
  if (!sess || sess.isDone) {
    showSummary();
    return;
  }

  const q = sess.current;
  const container = document.getElementById('exercise-area');
  container.innerHTML = '';

  // Progress bar
  const progressWrap = document.getElementById('exercise-progress');
  const pct = (sess.currentIndex / sess.total) * 100;
  progressWrap.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>
    <span class="progress-label">${sess.currentIndex + 1} / ${sess.total}</span>
  `;

  const prompt = document.createElement('div');
  prompt.className = 'exercise-prompt';
  prompt.innerHTML = q.prompt;
  container.appendChild(prompt);

  // Render by type
  switch (q.type) {
    case 'find_note':    renderFindNote(q, container); break;
    case 'name_note':    renderMultiChoice(q, container); break;
    case 'identify_interval': renderMultiChoice(q, container, true); break;
    case 'find_interval':    renderFindInterval(q, container); break;
    case 'name_scale':   renderMultiChoice(q, container); break;
    case 'build_scale':  renderBuildScale(q, container); break;
    case 'chord_notes':  renderMultiChoice(q, container); break;
    case 'name_chord':   renderMultiChoice(q, container); break;
    default:             renderMultiChoice(q, container); break;
  }
}

// Shared fretboard setup
function setupFretboard(container, tuning, clickable = true, frets = 12) {
  const fbContainer = document.createElement('div');
  fbContainer.className = 'fretboard-container';
  container.appendChild(fbContainer);

  const fb = new Fretboard();
  fb.render(fbContainer, { tuning, frets, clickable });
  state.fretboard = fb;
  return fb;
}

// Multiple choice questions (no fretboard interaction needed)
function renderMultiChoice(q, container, showFretboard = false) {
  if (showFretboard && q.positionA && q.positionB) {
    const fb = setupFretboard(container, q.tuning, false);
    fb.highlight([
      { ...q.positionA, color: COLORS.root, label: q.noteA },
      { ...q.positionB, color: COLORS.scale, label: q.noteB }
    ]);
  }

  const choicesEl = document.createElement('div');
  choicesEl.className = 'choices';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-num">${i + 1}</span> ${choice}`;
    btn.dataset.value = choice;
    btn.addEventListener('click', () => handleMultiChoiceAnswer(choice, q, choicesEl));
    choicesEl.appendChild(btn);
  });
  container.appendChild(choicesEl);

  // Keyboard shortcuts
  state._keyHandler = (e) => {
    const n = parseInt(e.key);
    if (n >= 1 && n <= q.choices.length) {
      const btn = choicesEl.querySelectorAll('.choice-btn')[n - 1];
      if (btn && !btn.disabled) btn.click();
    }
  };
  document.addEventListener('keydown', state._keyHandler);
}

function handleMultiChoiceAnswer(selected, q, choicesEl) {
  document.removeEventListener('keydown', state._keyHandler);
  const isCorrect = selected === q.correctAnswer;
  state.session.answer(isCorrect);

  choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.value === q.correctAnswer) btn.classList.add('correct');
    else if (btn.dataset.value === selected && !isCorrect) btn.classList.add('incorrect');
  });

  showFeedback(isCorrect, q.correctAnswer);
  setTimeout(() => renderExercise(), 1200);
}

// Find Note: click all instances of a note on the fretboard
function renderFindNote(q, container) {
  const fb = setupFretboard(container, q.tuning, true);
  const targets = new Set(q.targets.map(p => `${p.string},${p.fret}`));
  const clicked = new Set();

  const hint = document.createElement('div');
  hint.className = 'find-hint';
  hint.textContent = `Find ${targets.size} notes`;
  container.appendChild(hint);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'submit-btn';
  submitBtn.textContent = 'Submit';
  submitBtn.style.display = 'none';
  container.appendChild(submitBtn);

  fb.onClick((s, f, note) => {
    const key = `${s},${f}`;
    if (clicked.has(key)) {
      clicked.delete(key);
      fb.clearHighlight([{ string: s, fret: f }]);
    } else {
      clicked.add(key);
      const isTarget = targets.has(key);
      fb.highlight([{ string: s, fret: f, color: COLORS.highlight }]);
    }
    hint.textContent = `${clicked.size} selected / ${targets.size} needed`;
    submitBtn.style.display = clicked.size > 0 ? 'block' : 'none';
  });

  submitBtn.addEventListener('click', () => {
    submitBtn.disabled = true;
    fb.clickCallback = null;

    let allCorrect = true;
    // Check clicked vs targets
    for (const key of clicked) {
      const isTarget = targets.has(key);
      const [s, f] = key.split(',').map(Number);
      fb.highlights.set(key, { color: isTarget ? COLORS.correct : COLORS.incorrect, label: getNoteAtPosition(s, f, q.tuning) });
      if (!isTarget) allCorrect = false;
    }
    for (const key of targets) {
      if (!clicked.has(key)) {
        const [s, f] = key.split(',').map(Number);
        fb.highlights.set(key, { color: COLORS.incorrect, label: getNoteAtPosition(s, f, q.tuning) });
        allCorrect = false;
      }
    }
    fb._drawNoteMarkers();

    const isCorrect = allCorrect && clicked.size === targets.size;
    state.session.answer(isCorrect);
    showFeedback(isCorrect);
    setTimeout(() => renderExercise(), 1600);
  });
}

// Find Interval: given a root, click the target note at the given interval
function renderFindInterval(q, container) {
  const fb = setupFretboard(container, q.tuning, true);
  fb.highlight([{ ...q.rootPosition, color: COLORS.root, label: q.rootNote }]);

  const targets = new Set(q.targets.map(p => `${p.string},${p.fret}`));

  fb.onClick((s, f, note) => {
    const key = `${s},${f}`;
    const isCorrect = targets.has(key);
    fb.clickCallback = null;

    // Show all target positions
    fb.highlight(q.targets.map(p => ({ ...p, color: COLORS.correct, label: q.targetNote })));
    if (!isCorrect) {
      fb.highlight([{ string: s, fret: f, color: COLORS.incorrect, label: note }]);
    }

    state.session.answer(isCorrect);
    showFeedback(isCorrect, `Target: ${q.targetNote}`);
    setTimeout(() => renderExercise(), 1600);
  });
}

// Build Scale: click all scale tones
function renderBuildScale(q, container) {
  const fb = setupFretboard(container, q.tuning, true);

  // Show root as hint
  const rootPositions = q.targets.filter(p => p.isRoot);
  if (rootPositions.length > 0) {
    fb.highlight([{ ...rootPositions[0], color: COLORS.root, label: q.root }]);
  }

  const targets = new Set(q.targets.map(p => `${p.string},${p.fret}`));
  const clicked = new Set();

  const hint = document.createElement('div');
  hint.className = 'find-hint';
  hint.textContent = `Select ${q.targets.length} notes`;
  container.appendChild(hint);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'submit-btn';
  submitBtn.textContent = 'Submit';
  submitBtn.style.display = 'none';
  container.appendChild(submitBtn);

  fb.onClick((s, f, note) => {
    const key = `${s},${f}`;
    if (clicked.has(key)) {
      clicked.delete(key);
      const wasRoot = rootPositions.some(p => p.string === s && p.fret === f);
      if (wasRoot) fb.highlight([{ string: s, fret: f, color: COLORS.root, label: q.root }]);
      else fb.clearHighlight([{ string: s, fret: f }]);
    } else {
      clicked.add(key);
      fb.highlight([{ string: s, fret: f, color: COLORS.highlight, label: note }]);
    }
    hint.textContent = `${clicked.size} selected / ${q.targets.length} needed`;
    submitBtn.style.display = clicked.size > 0 ? 'block' : 'none';
  });

  submitBtn.addEventListener('click', () => {
    submitBtn.disabled = true;
    fb.clickCallback = null;

    let allCorrect = true;
    for (const key of clicked) {
      const [s, f] = key.split(',').map(Number);
      const isTarget = targets.has(key);
      fb.highlights.set(key, { color: isTarget ? COLORS.correct : COLORS.incorrect, label: getNoteAtPosition(s, f, q.tuning) });
      if (!isTarget) allCorrect = false;
    }
    for (const key of targets) {
      if (!clicked.has(key)) {
        const [s, f] = key.split(',').map(Number);
        fb.highlights.set(key, { color: COLORS.incorrect, label: '' });
        allCorrect = false;
      }
    }
    fb._drawNoteMarkers();

    const isCorrect = allCorrect && clicked.size === targets.size;
    state.session.answer(isCorrect);
    showFeedback(isCorrect);
    setTimeout(() => renderExercise(), 1600);
  });
}

// ─── Feedback ──────────────────────────────────────────────────────────────────

function showFeedback(isCorrect, detail = '') {
  const fb = document.getElementById('feedback-banner');
  fb.className = 'feedback-banner ' + (isCorrect ? 'correct' : 'incorrect');
  fb.textContent = isCorrect ? '✓ Correct!' : `✗ Incorrect${detail ? ' — ' + detail : ''}`;
  fb.style.display = 'block';
  setTimeout(() => { fb.style.display = 'none'; }, 1100);
}

// ─── Session Summary ───────────────────────────────────────────────────────────

function showSummary() {
  const container = document.getElementById('exercise-area');
  const progressWrap = document.getElementById('exercise-progress');
  progressWrap.innerHTML = '';

  const result = state.session.summary();
  const pct = Math.round(result.accuracy * 100);

  container.innerHTML = `
    <div class="summary">
      <h2>Session Complete</h2>
      <div class="summary-score">${result.correct} / ${result.total}</div>
      <div class="summary-pct ${pct >= 70 ? 'good' : 'needs-work'}">${pct}%</div>
      <p class="summary-msg">${pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Good work!' : 'Keep practicing!'}</p>
      <div class="summary-actions">
        <button class="btn-primary" onclick="app.navigate('home')">Home</button>
        <button class="btn-secondary" onclick="app.repeatSession()">Repeat</button>
      </div>
    </div>
  `;
}

// ─── Fretboard Explorer ────────────────────────────────────────────────────────

function initExplorer() {
  const container = document.getElementById('explorer-fretboard');
  const fb = new Fretboard();
  fb.render(container, { tuning: state.tuning, frets: 24, clickable: false });

  function updateExplorer() {
    const root = document.getElementById('exp-root').value;
    const type = document.getElementById('exp-type').value;
    const mode = document.getElementById('exp-mode').value;

    fb.setTuning(state.tuning);
    fb.reset();

    try {
      if (mode === 'scale') {
        const positions = getScalePositions(root, type, state.tuning, 24);
        fb.highlight(positions.map(p => ({
          ...p,
          color: p.isRoot ? COLORS.root : COLORS.scale,
          label: p.note
        })));
      } else {
        // note
        const positions = getAllPositionsForNote(root, state.tuning, 24);
        fb.highlight(positions.map(p => ({
          ...p,
          color: COLORS.root,
          label: root
        })));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  document.getElementById('exp-root').addEventListener('change', updateExplorer);
  document.getElementById('exp-type').addEventListener('change', updateExplorer);
  document.getElementById('exp-mode').addEventListener('change', () => {
    const mode = document.getElementById('exp-mode').value;
    document.getElementById('exp-type-wrap').style.display = mode === 'scale' ? '' : 'none';
    updateExplorer();
  });

  // Populate scale type selector
  const typeSelect = document.getElementById('exp-type');
  typeSelect.innerHTML = '';
  for (const name of ['Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor',
    'Pentatonic Major', 'Pentatonic Minor', 'Blues', 'Dorian', 'Phrygian',
    'Lydian', 'Mixolydian', 'Locrian', 'Whole Tone', 'Phrygian Dominant']) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    typeSelect.appendChild(opt);
  }

  // Populate root selector
  const rootSelect = document.getElementById('exp-root');
  rootSelect.innerHTML = '';
  for (const n of ALL_NOTES) {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    rootSelect.appendChild(opt);
  }

  updateExplorer();
}

// ─── Module Setup UIs ──────────────────────────────────────────────────────────

function setupModuleUI(moduleId) {
  const el = document.getElementById(`page-${moduleId}`);
  if (!el) return;

  // Populate all note/scale/chord selectors in this module's setup UI
  el.querySelectorAll('select.notes-select').forEach(sel => {
    sel.innerHTML = ALL_NOTES.map(n => `<option value="${n}">${n}</option>`).join('');
  });
}

// ─── App Init ─────────────────────────────────────────────────────────────────

function init() {
  loadTuning();
  initTuningUI();

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      navigate(page);
      if (page === 'explorer') initExplorer();
    });
  });

  // Module start buttons
  document.getElementById('btn-start-notes-find').addEventListener('click', () =>
    startSession(buildNoteMemoSession(state.tuning, 'find', 10)));
  document.getElementById('btn-start-notes-name').addEventListener('click', () =>
    startSession(buildNoteMemoSession(state.tuning, 'name', 10)));
  document.getElementById('btn-start-intervals-id').addEventListener('click', () =>
    startSession(buildIntervalSession(state.tuning, 'identify', 10)));
  document.getElementById('btn-start-intervals-find').addEventListener('click', () =>
    startSession(buildIntervalSession(state.tuning, 'find', 10)));
  document.getElementById('btn-start-scales-name').addEventListener('click', () =>
    startSession(buildScaleSession(state.tuning, 'name', 10)));
  document.getElementById('btn-start-scales-build').addEventListener('click', () =>
    startSession(buildScaleSession(state.tuning, 'build', 10)));
  document.getElementById('btn-start-chords-notes').addEventListener('click', () =>
    startSession(buildChordSession(state.tuning, 'notes', 10)));
  document.getElementById('btn-start-chords-name').addEventListener('click', () =>
    startSession(buildChordSession(state.tuning, 'name', 10)));

  // Tuning custom inputs
  const customDiv = document.getElementById('tuning-custom');
  customDiv.style.display = 'none';

  navigate('home');
}

function repeatSession() {
  if (state.session) {
    const ModuleBuilders = {
      'notes_find':       () => buildNoteMemoSession(state.tuning, 'find', state.session.total),
      'notes_name':       () => buildNoteMemoSession(state.tuning, 'name', state.session.total),
      'intervals_identify': () => buildIntervalSession(state.tuning, 'identify', state.session.total),
      'intervals_find':   () => buildIntervalSession(state.tuning, 'find', state.session.total),
      'scales_name':      () => buildScaleSession(state.tuning, 'name', state.session.total),
      'scales_build':     () => buildScaleSession(state.tuning, 'build', state.session.total),
      'chords_notes':     () => buildChordSession(state.tuning, 'notes', state.session.total),
      'chords_name':      () => buildChordSession(state.tuning, 'name', state.session.total),
    };
    const builder = ModuleBuilders[state.session.module];
    if (builder) startSession(builder());
  }
}

// Expose to global for inline onclick handlers
window.app = { navigate, repeatSession };

document.addEventListener('DOMContentLoaded', init);
