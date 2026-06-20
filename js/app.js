// app.js — Course shell: routing, lesson rendering, interactive widgets, progress.

'use strict';

import {
  MODULES, LESSONS, getLesson, nextLesson, prevLesson, moduleLessonIds, allLessonIds
} from './lessons/index.js';
import { renderNotation } from './notation.js';
import { playNote, playSequence, playChord, playInterval } from './audio.js';
import { renderQuiz } from './quiz.js';
import { DECKS, getDeck } from './flashcards.js';
import {
  NOTE_CHOICES, SCALE_NAMES, CHORD_TYPES,
  getScaleNotes, getChordNotes, getInterval, transposeNote,
  keySignature, relativeMinor, chordSymbol, chordFullName, buildABC, scaleToABC
} from './theory.js';
import * as progress from './progress.js';

const ALL_IDS = allLessonIds();

// ─── Element helpers ────────────────────────────────────────────────────────
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
const $ = sel => document.querySelector(sel);
const fmtAcc = s => s.replaceAll('#', '♯').replaceAll('b', '♭');

// Render abcjs notation after layout settles (double rAF) so the container has a
// measured width — avoids blank SVGs, notably on mobile Safari.
function mountNotation(elm, abc, opts) {
  requestAnimationFrame(() => requestAnimationFrame(() => renderNotation(elm, abc, opts)));
}

// ─── Routing ────────────────────────────────────────────────────────────────
function currentRoute() {
  const h = location.hash.replace(/^#\/?/, '');
  if (h.startsWith('lesson/')) return { view: 'lesson', id: h.slice('lesson/'.length) };
  if (h.startsWith('practice/')) return { view: 'practice', id: h.slice('practice/'.length) };
  return { view: 'home' };
}
function go(hash) { location.hash = hash; }

// ─── Sidebar ────────────────────────────────────────────────────────────────
function renderSidebar() {
  const nav = $('#sidebar-nav');
  nav.innerHTML = '';
  const route = currentRoute();

  const home = el('button', 'side-home' + (route.view === 'home' ? ' active' : ''), '🏠 Course Home');
  home.addEventListener('click', () => go('#/home'));
  nav.appendChild(home);

  // Practice / memorization decks
  const pracWrap = el('div', 'side-module');
  pracWrap.appendChild(el('div', 'side-module-title', '<span>Practice · Flashcards</span><span class="side-module-prog">∞</span>'));
  const pracList = el('div', 'side-lessons');
  DECKS.forEach(deck => {
    const active = route.view === 'practice' && route.id === deck.id;
    const btn = el('button', 'side-lesson' + (active ? ' active' : ''),
      `<span class="tick">◆</span> ${deck.title}`);
    btn.addEventListener('click', () => go('#/practice/' + deck.id));
    pracList.appendChild(btn);
  });
  pracWrap.appendChild(pracList);
  nav.appendChild(pracWrap);

  MODULES.forEach((mod, mi) => {
    const mp = progress.modulePercent(moduleLessonIds(mod.id));
    const modWrap = el('div', 'side-module');
    modWrap.appendChild(el('div', 'side-module-title',
      `<span>${mi + 1}. ${mod.title}</span><span class="side-module-prog">${mp.done}/${mp.total}</span>`));

    const list = el('div', 'side-lessons');
    mod.lessons.forEach(lesson => {
      const done = progress.isComplete(lesson.id);
      const active = route.view === 'lesson' && route.id === lesson.id;
      const btn = el('button', 'side-lesson' + (active ? ' active' : ''),
        `<span class="tick ${done ? 'done' : ''}">${done ? '✓' : '○'}</span> ${lesson.title}`);
      btn.addEventListener('click', () => go('#/lesson/' + lesson.id));
      list.appendChild(btn);
    });
    modWrap.appendChild(list);
    nav.appendChild(modWrap);
  });
}

// ─── Home view ──────────────────────────────────────────────────────────────
function renderHome() {
  const main = $('#content');
  const pct = progress.coursePercent(ALL_IDS);
  const last = progress.getLastLesson();
  const resumeId = last && getLesson(last) ? last : LESSONS[0].id;
  const resumeLesson = getLesson(resumeId);
  const started = progress.completedCount() > 0 || !!last;

  main.innerHTML = '';
  const hero = el('div', 'hero');
  hero.appendChild(el('h1', null, 'Music Theory'));
  hero.appendChild(el('p', 'hero-sub',
    'A structured, hands-on course — from reading the staff to building chords and progressions. Every concept is shown in notation you can hear and explore.'));

  const bar = el('div', 'home-progress');
  bar.appendChild(el('div', 'progress-track', `<div class="progress-fill" style="width:${pct}%"></div>`));
  bar.appendChild(el('div', 'progress-pct', `${pct}% complete`));
  hero.appendChild(bar);

  const actions = el('div', 'hero-actions');
  const cont = el('button', 'btn-primary',
    started ? `▶ Continue: ${resumeLesson.title}` : '▶ Start the course');
  cont.addEventListener('click', () => go('#/lesson/' + resumeId));
  actions.appendChild(cont);
  if (started) {
    const reset = el('button', 'btn-ghost', 'Reset progress');
    reset.addEventListener('click', () => {
      if (confirm('Clear all saved progress?')) { progress.resetAll(); render(); }
    });
    actions.appendChild(reset);
  }
  hero.appendChild(actions);
  main.appendChild(hero);

  const grid = el('div', 'module-cards');
  MODULES.forEach((mod, mi) => {
    const mp = progress.modulePercent(moduleLessonIds(mod.id));
    const card = el('button', 'module-card');
    card.innerHTML = `
      <div class="mc-num">${mi + 1}</div>
      <div class="mc-body">
        <div class="mc-title">${mod.title}</div>
        <div class="mc-blurb">${mod.blurb}</div>
        <div class="mc-foot"><div class="progress-track sm"><div class="progress-fill" style="width:${mp.pct}%"></div></div><span>${mp.done}/${mp.total}</span></div>
      </div>`;
    card.addEventListener('click', () => go('#/lesson/' + mod.lessons[0].id));
    grid.appendChild(card);
  });
  main.appendChild(grid);

  // Practice / memorization decks
  main.appendChild(el('h2', 'home-section-title', 'Practice · Memorization'));
  main.appendChild(el('p', 'home-section-sub', 'Unscored flashcards for free-time drilling — flip the card to check yourself, and hear every answer.'));
  const pgrid = el('div', 'practice-cards');
  DECKS.forEach(deck => {
    const card = el('button', 'practice-card');
    card.innerHTML = `<div class="pc-title">${deck.title}</div><div class="pc-blurb">${deck.blurb}</div>`;
    card.addEventListener('click', () => go('#/practice/' + deck.id));
    pgrid.appendChild(card);
  });
  main.appendChild(pgrid);

  $('#content-scroll').scrollTop = 0;
}

// ─── Lesson view ────────────────────────────────────────────────────────────
function renderLesson(id) {
  const lesson = getLesson(id);
  if (!lesson) { go('#/home'); return; }
  progress.setLastLesson(id);

  const main = $('#content');
  main.innerHTML = '';

  const header = el('div', 'lesson-header');
  header.appendChild(el('div', 'lesson-eyebrow', `${lesson.moduleIndex + 1}. ${lesson.moduleTitle}`));
  header.appendChild(el('h1', 'lesson-title', lesson.title));
  main.appendChild(header);

  lesson.sections.forEach(sec => main.appendChild(renderSection(sec)));

  // Quiz
  const quizWrap = el('div', 'lesson-quiz card-block');
  quizWrap.appendChild(el('h2', 'block-label', 'Check your understanding'));
  const quizMount = el('div');
  quizWrap.appendChild(quizMount);
  main.appendChild(quizWrap);

  // Footer nav
  const footer = el('div', 'lesson-nav');
  const prev = prevLesson(id);
  const next = nextLesson(id);
  const prevBtn = el('button', 'btn-secondary', prev ? '← Previous' : '← Home');
  prevBtn.addEventListener('click', () => go(prev ? '#/lesson/' + prev.id : '#/home'));
  footer.appendChild(prevBtn);

  const nextBtn = el('button', 'btn-primary next-btn', next ? 'Next lesson →' : 'Finish course →');
  function refreshNext() {
    const unlocked = progress.isComplete(id);
    nextBtn.disabled = !unlocked;
    nextBtn.title = unlocked ? '' : 'Pass the quiz to unlock';
    nextBtn.classList.toggle('locked', !unlocked);
  }
  nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    go(next ? '#/lesson/' + next.id : '#/home');
  });
  footer.appendChild(nextBtn);
  main.appendChild(footer);

  renderQuiz(quizMount, lesson.quiz, () => {
    progress.markComplete(id);
    refreshNext();
    renderSidebar();
  });
  refreshNext();
  $('#content-scroll').scrollTop = 0;
}

// ─── Section renderers ──────────────────────────────────────────────────────
function renderSection(sec) {
  switch (sec.type) {
    case 'prose':    return el('div', 'sec-prose', typeof sec.html === 'function' ? sec.html() : sec.html);
    case 'callout':  return renderCallout(sec);
    case 'notation': return renderNotationSection(sec);
    case 'play':     return renderPlaySection(sec);
    case 'interactive': return renderWidget(sec);
    default:         return el('div', null, '');
  }
}

function renderCallout(sec) {
  const c = el('div', 'callout ' + (sec.variant || 'tip'));
  if (sec.title) c.appendChild(el('div', 'callout-title', sec.title));
  c.appendChild(el('div', 'callout-body', typeof sec.html === 'function' ? sec.html() : sec.html));
  return c;
}

function renderNotationSection(sec) {
  const wrap = el('div', 'sec-notation card-block');
  const mount = el('div', 'notation-mount');
  wrap.appendChild(mount);
  if (sec.caption) wrap.appendChild(el('div', 'notation-caption', sec.caption));
  mountNotation(mount, sec.abc, { clickToHear: sec.clickToHear !== false });
  return wrap;
}

function playSection(sec) {
  if (sec.chordSeq) {
    sec.chordSeq.forEach((chord, i) => setTimeout(() => playChord(chord, 0.9), i * 750));
  } else if (sec.chord) {
    if (sec.notes) playChord(sec.notes);
  } else if (sec.notes) {
    playSequence(sec.notes, 0.45);
  }
}
function renderPlaySection(sec) {
  const btn = el('button', 'play-btn', `▶ ${sec.label || 'Play'}`);
  btn.addEventListener('click', () => playSection(sec));
  return btn;
}

// ─── Interactive widgets ────────────────────────────────────────────────────
function renderWidget(sec) {
  const wrap = el('div', 'widget card-block');
  const body = el('div', 'widget-body');
  wrap.appendChild(body);
  if (sec.caption) wrap.appendChild(el('div', 'notation-caption', sec.caption));
  const fns = { pianoMini, intervalLab, scaleLab, chordLab, circleOfFifths };
  (fns[sec.widget] || (() => {}))(body, sec.config || {});
  return wrap;
}

// Mini interactive piano keyboard
function pianoMini(mount, { from = 'C', octaves = 1 } = {}) {
  const whiteSeq = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackAfter = { C: 'C#', D: 'D#', F: 'F#', G: 'G#', A: 'A#' };
  const kb = el('div', 'piano');
  const startIdx = whiteSeq.indexOf(from) === -1 ? 0 : whiteSeq.indexOf(from);
  for (let o = 0; o < octaves; o++) {
    for (let i = 0; i < 7; i++) {
      const abs = startIdx + o * 7 + i;
      const letter = whiteSeq[abs % 7];
      const oct = 4 + Math.floor(abs / 7);      // octave from absolute white-key index
      const white = el('div', 'pkey white');
      white.dataset.note = letter; white.dataset.oct = oct;
      white.appendChild(el('span', 'pkey-label', letter));
      const blackName = blackAfter[letter];
      if (blackName && letter !== 'B') {
        const black = el('div', 'pkey black');
        black.dataset.note = blackName; black.dataset.oct = oct;
        white.appendChild(black);
      }
      kb.appendChild(white);
    }
  }
  kb.addEventListener('click', e => {
    const key = e.target.closest('.pkey');
    if (!key) return;
    e.stopPropagation();
    playNote(key.dataset.note, parseInt(key.dataset.oct, 10), 0.7);
    key.classList.add('pressed');
    setTimeout(() => key.classList.remove('pressed'), 200);
  });
  mount.appendChild(kb);
}

// Interval explorer
function intervalLab(mount, { root = 'C' } = {}) {
  const ctrl = el('div', 'lab-controls');
  ctrl.appendChild(el('label', null, 'Root'));
  const rootSel = selectEl(NOTE_CHOICES, root);
  ctrl.appendChild(rootSel);
  mount.appendChild(ctrl);

  const btns = el('div', 'lab-chips');
  mount.appendChild(btns);
  const out = el('div', 'lab-out');
  mount.appendChild(out);
  const mount2 = el('div', 'notation-mount');
  mount.appendChild(mount2);

  const intervals = [
    ['m2', 1], ['M2', 2], ['m3', 3], ['M3', 4], ['P4', 5], ['TT', 6],
    ['P5', 7], ['m6', 8], ['M6', 9], ['m7', 10], ['M7', 11], ['P8', 12]
  ];
  function show(semi, silent) {
    const r = rootSel.value;
    const topFull = transposeNote(r + '4', semi);     // e.g. "G4" or "C5"
    const m = topFull.match(/([A-G][#b]?)(\d+)/);
    const topName = m[1], topOct = parseInt(m[2], 10);
    const info = getInterval(r + '4', topFull);        // octave-aware (so P8 ≠ P1)
    out.innerHTML = `<strong>${fmtAcc(r)}</strong> → <strong>${fmtAcc(topName)}</strong> &nbsp;·&nbsp; ${info.name}`;
    mountNotation(mount2, buildABC([r + '4', topFull], { clef: 'treble', dur: '4' }), { clickToHear: true });
    if (!silent) playInterval(r, topName, 4, topOct);
  }
  intervals.forEach(([name, semi]) => {
    const b = el('button', 'lab-chip', name);
    b.addEventListener('click', () => { setActive(btns, b); show(semi); });
    btns.appendChild(b);
  });
  rootSel.addEventListener('change', () => {
    const active = btns.querySelector('.lab-chip.active');
    if (active) active.click();
  });
  // initial render without auto-playing audio
  setActive(btns, btns.firstChild);
  show(intervals[0][1], true);
}

// Scale explorer
function scaleLab(mount, { root = 'C', scale = 'Major' } = {}) {
  const ctrl = el('div', 'lab-controls');
  ctrl.appendChild(el('label', null, 'Root'));
  const rootSel = selectEl(NOTE_CHOICES, root);
  ctrl.appendChild(rootSel);
  ctrl.appendChild(el('label', null, 'Scale'));
  const scaleSel = selectEl(SCALE_NAMES, scale);
  ctrl.appendChild(scaleSel);
  mount.appendChild(ctrl);

  const out = el('div', 'lab-out');
  mount.appendChild(out);
  const mount2 = el('div', 'notation-mount');
  mount.appendChild(mount2);
  const playBtn = el('button', 'play-btn', '▶ Play scale');
  mount.appendChild(playBtn);

  let currentNotes = [];
  function update() {
    const r = rootSel.value, s = scaleSel.value;
    try {
      const notes = getScaleNotes(r, s);
      currentNotes = notes;
      out.innerHTML = notes.map(n => `<span class="note-chip">${fmtAcc(n)}</span>`).join('');
      mountNotation(mount2, scaleToABC(r, s), { clickToHear: true });
    } catch (e) { out.textContent = 'n/a'; }
  }
  playBtn.addEventListener('click', () => {
    const seq = currentNotes.map(n => ({ name: n, octave: 4 })).concat([{ name: currentNotes[0], octave: 5 }]);
    playSequence(seq, 0.4);
  });
  rootSel.addEventListener('change', update);
  scaleSel.addEventListener('change', update);
  update();
}

// Chord explorer
function chordLab(mount, { root = 'C', type = 'Major' } = {}) {
  const ctrl = el('div', 'lab-controls');
  ctrl.appendChild(el('label', null, 'Root'));
  const rootSel = selectEl(NOTE_CHOICES, root);
  ctrl.appendChild(rootSel);
  ctrl.appendChild(el('label', null, 'Type'));
  const typeSel = selectEl(CHORD_TYPES, type);
  ctrl.appendChild(typeSel);
  mount.appendChild(ctrl);

  const out = el('div', 'lab-out');
  mount.appendChild(out);
  const mount2 = el('div', 'notation-mount');
  mount.appendChild(mount2);
  const playBtn = el('button', 'play-btn', '▶ Play chord');
  mount.appendChild(playBtn);

  let currentNotes = [];
  function update() {
    const r = rootSel.value, t = typeSel.value;
    const notes = getChordNotes(r, t);
    currentNotes = notes;
    out.innerHTML = `<strong>${fmtAcc(chordSymbol(r, t))}</strong> ` +
      `<span class="fc-muted">(${fmtAcc(chordFullName(r, t))})</span><br>` +
      notes.map(n => `<span class="note-chip">${fmtAcc(n)}</span>`).join(' ');
    mountNotation(mount2, buildABC([{ chord: notes }], { clef: 'treble', dur: '2' }), { clickToHear: true });
  }
  playBtn.addEventListener('click', () => playChord(currentNotes));
  rootSel.addEventListener('change', update);
  typeSel.addEventListener('change', update);
  update();
}

// Circle of fifths
function circleOfFifths(mount, _cfg) {
  const order = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const size = 280, cx = size / 2, cy = size / 2, rOuter = 120, rInner = 78;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('class', 'cof-svg');

  order.forEach((key, i) => {
    const ang = (i / 12) * 2 * Math.PI - Math.PI / 2;
    const x = cx + Math.cos(ang) * rOuter;
    const y = cy + Math.sin(ang) * rOuter;
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'cof-key');
    g.style.cursor = 'pointer';
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', 22);
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', x); text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle'); text.textContent = key;
    g.appendChild(circle); g.appendChild(text);
    g.addEventListener('click', () => selectKey(key, g));
    svg.appendChild(g);

    // inner ring: relative minor
    const rm = relativeMinor(key);
    const xi = cx + Math.cos(ang) * rInner, yi = cy + Math.sin(ang) * rInner;
    const t2 = document.createElementNS(svgNS, 'text');
    t2.setAttribute('x', xi); t2.setAttribute('y', yi + 4);
    t2.setAttribute('text-anchor', 'middle'); t2.setAttribute('class', 'cof-minor');
    t2.textContent = rm + 'm';
    svg.appendChild(t2);
  });
  mount.appendChild(svg);
  const detail = el('div', 'cof-detail');
  mount.appendChild(detail);

  function selectKey(key, g, silent) {
    svg.querySelectorAll('.cof-key').forEach(k => k.classList.remove('active'));
    g.classList.add('active');
    const sig = keySignature(key);
    const sigText = sig.type === 'none' ? 'no sharps or flats'
      : `${sig.count} ${sig.type}${sig.count > 1 ? 's' : ''}: ${sig.notes.map(fmtAcc).join(', ')}`;
    detail.innerHTML = `<strong>${fmtAcc(key)} major</strong> — ${sigText}.<br>Relative minor: <strong>${fmtAcc(relativeMinor(key))} minor</strong>.`;
    if (!silent) playSequence(getScaleNotes(key, 'Major').map(n => ({ name: n, octave: 4 })).concat([{ name: key, octave: 5 }]), 0.28);
  }
  selectKey('C', svg.querySelector('.cof-key'), true);   // initial select, no auto-play
}

// ─── Small UI utils ─────────────────────────────────────────────────────────
function selectEl(options, selected) {
  const s = el('select', 'lab-select');
  options.forEach(o => {
    const opt = el('option', null, o);
    opt.value = o;
    if (o === selected) opt.selected = true;
    s.appendChild(opt);
  });
  return s;
}
function setActive(parent, btn) {
  parent.querySelectorAll('.lab-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── Render dispatch ────────────────────────────────────────────────────────
function render() {
  if (window._fcKey) { document.removeEventListener('keydown', window._fcKey); window._fcKey = null; }
  const route = currentRoute();
  // normalize unknown/bad hashes (e.g. #/garbage) to a clean home URL
  if (route.view === 'home' && location.hash && location.hash !== '#/home') { go('#/home'); return; }
  renderSidebar();
  if (route.view === 'lesson') renderLesson(route.id);
  else if (route.view === 'practice') renderPractice(route.id);
  else renderHome();
  // close mobile sidebar on navigation
  document.body.classList.remove('sidebar-open');
}

// ─── Practice (flashcards) view ─────────────────────────────────────────────
function renderPractice(id) {
  const deck = getDeck(id);
  if (!deck) { go('#/home'); return; }
  const main = $('#content');
  main.innerHTML = '';

  const header = el('div', 'lesson-header');
  header.appendChild(el('div', 'lesson-eyebrow', 'Practice · Flashcards'));
  header.appendChild(el('h1', 'lesson-title', deck.title));
  header.appendChild(el('p', 'hero-sub', deck.blurb + ' Unscored — drill as long as you like.'));
  main.appendChild(header);

  let level = deck.defaultLevel || (deck.levels && deck.levels[0].id) || null;
  let count = 0;

  if (deck.levels) {
    const lc = el('div', 'level-control');
    lc.appendChild(el('span', 'level-label', 'Difficulty'));
    deck.levels.forEach(L => {
      const b = el('button', 'level-btn' + (L.id === level ? ' active' : ''), L.label);
      b.addEventListener('click', () => {
        if (L.id === level) return;          // already on this level — don't re-roll
        level = L.id;
        lc.querySelectorAll('.level-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        count = 0;
        nextCard();
      });
      lc.appendChild(b);
    });
    main.appendChild(lc);
  }

  const cardMount = el('div', 'flashcard-mount');
  main.appendChild(cardMount);

  function nextCard() {
    count++;
    renderCard(cardMount, deck.generate(level), nextCard, count);
  }
  nextCard();

  const footer = el('div', 'lesson-nav');
  const back = el('button', 'btn-secondary', '← Course Home');
  back.addEventListener('click', () => go('#/home'));
  footer.appendChild(back);
  main.appendChild(footer);
  $('#content-scroll').scrollTop = 0;
}

function renderCard(mount, card, onNext, count) {
  mount.innerHTML = '';
  const c = el('div', 'flashcard card-block');
  c.appendChild(el('div', 'fc-count', `Card ${count}`));
  c.appendChild(el('div', 'fc-prompt', card.prompt));

  const qArea = el('div', 'fc-q');
  if (card.q.html) qArea.appendChild(el('div', 'fc-html', card.q.html));
  if (card.q.abc) {
    const m = el('div', 'notation-mount');
    qArea.appendChild(m);
    mountNotation(m, card.q.abc, { clickToHear: true });
  }
  c.appendChild(qArea);

  if (card.play) {
    const pb = el('button', 'play-btn', '▶ Hear it');
    pb.addEventListener('click', () =>
      card.play.chord ? playChord(card.play.notes) : playSequence(card.play.notes, 0.45));
    c.appendChild(pb);
  }

  const aArea = el('div', 'fc-a');
  aArea.style.display = 'none';
  if (card.a.html) aArea.appendChild(el('div', 'fc-html', card.a.html));
  if (card.a.abc) aArea.appendChild(el('div', 'notation-mount'));
  c.appendChild(aArea);

  const ctr = el('div', 'fc-controls');
  const reveal = el('button', 'btn-primary', 'Reveal answer');
  const next = el('button', 'btn-secondary', 'Next card →');
  function doReveal() {
    if (aArea.style.display !== 'none') return;
    aArea.style.display = 'block';
    reveal.textContent = 'Answer shown';
    reveal.disabled = true;
    // Defer to the next frame so the now-visible container has a measured width
    // before abcjs renders (mobile Safari renders a blank SVG otherwise).
    if (card.a.abc) mountNotation(aArea.querySelector('.notation-mount'), card.a.abc, { clickToHear: true });
  }
  reveal.addEventListener('click', doReveal);
  next.addEventListener('click', onNext);
  ctr.appendChild(reveal);
  ctr.appendChild(next);
  c.appendChild(ctr);

  c.appendChild(el('div', 'fc-hint', 'Space / Enter = reveal · → = next card'));
  mount.appendChild(c);

  // Keyboard shortcuts (single handler, replaced each card)
  if (window._fcKey) document.removeEventListener('keydown', window._fcKey);
  window._fcKey = (e) => {
    if (['SELECT', 'INPUT', 'BUTTON', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); doReveal(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
  };
  document.addEventListener('keydown', window._fcKey);
}

function init() {
  window.addEventListener('hashchange', render);
  $('#menu-toggle').addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
  $('#sidebar-backdrop').addEventListener('click', () => document.body.classList.remove('sidebar-open'));
  if (!location.hash) location.hash = '#/home';
  render();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
