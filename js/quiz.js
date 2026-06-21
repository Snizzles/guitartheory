// quiz.js — End-of-lesson check-for-understanding quiz.
// Multiple-choice, one question at a time, with an optional audio prompt
// (ear-training). Quizzes are optional self-checks; passing marks the lesson complete.

'use strict';

import { playSequence, playChord } from './audio.js';

const PASS_THRESHOLD = 0.7;

// Fisher–Yates shuffle (returns a new array)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Scroll the lesson content back to the top so the learner can re-read it.
function scrollToLessonTop() {
  const s = document.querySelector('#content-scroll');
  if (s) s.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render a quiz into `container`.
// questions: [{ q (html), choices:[str], answer:int, explain?, audio?:{notes,chord,label} }]
// onPass: called once when the user passes.
function renderQuiz(container, questions, onPass) {
  let deck = [];        // shuffled working copy for the current attempt
  let index = 0;
  let correctCount = 0;
  let passed = false;
  let responses = [];   // { q, correctText, chosenText, correct } per answered question

  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'quiz';
  container.appendChild(card);

  // Build a fresh shuffled deck: question order AND choice order are randomised each
  // attempt, so passing reflects understanding rather than memorised answer positions.
  function buildDeck() {
    deck = shuffle(questions).map(orig => {
      const correctText = orig.choices[orig.answer];
      const choices = shuffle(orig.choices);
      return {
        q: orig.q, audio: orig.audio, explain: orig.explain,
        choices, answer: choices.indexOf(correctText), correctText
      };
    });
    index = 0; correctCount = 0; responses = [];
  }

  function showQuestion() {
    const q = deck[index];
    card.innerHTML = '';

    const head = document.createElement('div');
    head.className = 'quiz-head';
    head.innerHTML = `<span class="quiz-counter">Question ${index + 1} of ${deck.length}</span>`;
    card.appendChild(head);

    const prompt = document.createElement('div');
    prompt.className = 'quiz-q';
    prompt.innerHTML = q.q;
    card.appendChild(prompt);

    if (q.audio) {
      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn quiz-audio';
      playBtn.innerHTML = `▶ ${q.audio.label || 'Play'}`;
      playBtn.addEventListener('click', () => {
        if (q.audio.chord) playChord(q.audio.notes);
        else playSequence(q.audio.notes, 0.45);
      });
      card.appendChild(playBtn);
    }

    const choices = document.createElement('div');
    choices.className = 'quiz-choices';
    q.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice';
      btn.innerHTML = choice;
      btn.addEventListener('click', () => answer(i, q, choices, btn));
      choices.appendChild(btn);
    });
    card.appendChild(choices);
  }

  function answer(selected, q, choicesEl, btn) {
    const correct = selected === q.answer;
    if (correct) correctCount++;
    responses.push({ q: q.q, correctText: q.correctText, chosenText: q.choices[selected], correct });

    choicesEl.querySelectorAll('.quiz-choice').forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('correct');
      else if (b === btn) b.classList.add('incorrect');
    });

    const fb = document.createElement('div');
    fb.className = 'quiz-feedback ' + (correct ? 'good' : 'bad');
    fb.innerHTML = (correct ? '✓ Correct. ' : '✗ Not quite. ') + (q.explain || '');
    card.appendChild(fb);

    // On a miss, point the learner back to the material.
    if (!correct) {
      const review = document.createElement('button');
      review.className = 'btn-ghost quiz-review-link';
      review.textContent = '↑ Review the lesson';
      review.addEventListener('click', scrollToLessonTop);
      card.appendChild(review);
    }

    const next = document.createElement('button');
    next.className = 'btn-primary quiz-next';
    next.textContent = index + 1 < deck.length ? 'Next question' : 'See results';
    next.addEventListener('click', () => {
      index++;
      if (index < deck.length) showQuestion();
      else showResults();
    });
    card.appendChild(next);
  }

  function showResults() {
    const pct = Math.round((correctCount / deck.length) * 100);
    const didPass = correctCount / deck.length >= PASS_THRESHOLD;
    const missed = responses.filter(r => !r.correct);

    const recap = missed.length
      ? '<div class="quiz-recap"><div class="quiz-recap-title">Worth another look:</div>' +
        missed.map(r => `<div class="quiz-recap-item">${r.q}<span class="quiz-recap-ans">Answer: ${r.correctText}</span></div>`).join('') +
        '</div>'
      : '';

    card.innerHTML = `
      <div class="quiz-result ${didPass ? 'pass' : 'fail'}">
        <div class="quiz-score">${correctCount} / ${deck.length}</div>
        <div class="quiz-score-pct">${pct}%</div>
        <p class="quiz-result-msg">${didPass
          ? 'Nice work — that’s a pass! This lesson is marked complete. ✓'
          : 'These quizzes are just self-checks — review the lesson and try again whenever you like.'}</p>
        ${recap}
        <div class="quiz-result-actions">
          <button class="btn-secondary quiz-retry">Try the quiz again</button>
          <button class="btn-ghost quiz-review">↑ Review the lesson</button>
        </div>
      </div>`;
    card.querySelector('.quiz-retry').addEventListener('click', () => { buildDeck(); showQuestion(); });
    card.querySelector('.quiz-review').addEventListener('click', scrollToLessonTop);

    if (didPass && !passed) {
      passed = true;
      if (typeof onPass === 'function') onPass();
    }
  }

  buildDeck();
  showQuestion();
}

export { renderQuiz, PASS_THRESHOLD };
