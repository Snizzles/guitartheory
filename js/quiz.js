// quiz.js — End-of-lesson check-for-understanding quiz.
// Multiple-choice, one question at a time, with an optional audio prompt
// (ear-training). Passing the threshold unlocks the next lesson.

'use strict';

import { playSequence, playChord } from './audio.js';

const PASS_THRESHOLD = 0.7;

// Render a quiz into `container`.
// questions: [{ q (html), choices:[str], answer:int, explain?, audio?:{notes,chord,label} }]
// onPass: called once when the user passes.
function renderQuiz(container, questions, onPass) {
  let index = 0;
  let correctCount = 0;
  let passed = false;

  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'quiz';
  container.appendChild(card);

  function showQuestion() {
    const q = questions[index];
    card.innerHTML = '';

    const head = document.createElement('div');
    head.className = 'quiz-head';
    head.innerHTML = `<span class="quiz-counter">Question ${index + 1} of ${questions.length}</span>`;
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

    choicesEl.querySelectorAll('.quiz-choice').forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('correct');
      else if (b === btn) b.classList.add('incorrect');
    });

    const fb = document.createElement('div');
    fb.className = 'quiz-feedback ' + (correct ? 'good' : 'bad');
    fb.innerHTML = (correct ? '✓ Correct. ' : '✗ Not quite. ') + (q.explain || '');
    card.appendChild(fb);

    const next = document.createElement('button');
    next.className = 'btn-primary quiz-next';
    next.textContent = index + 1 < questions.length ? 'Next question' : 'See results';
    next.addEventListener('click', () => {
      index++;
      if (index < questions.length) showQuestion();
      else showResults();
    });
    card.appendChild(next);
  }

  function showResults() {
    const pct = Math.round((correctCount / questions.length) * 100);
    const didPass = correctCount / questions.length >= PASS_THRESHOLD;
    card.innerHTML = `
      <div class="quiz-result ${didPass ? 'pass' : 'fail'}">
        <div class="quiz-score">${correctCount} / ${questions.length}</div>
        <div class="quiz-score-pct">${pct}%</div>
        <p class="quiz-result-msg">${didPass
          ? 'Nice work — lesson complete! The next lesson is unlocked.'
          : `You need ${Math.ceil(questions.length * PASS_THRESHOLD)} correct to pass. Review the lesson and try again.`}</p>
        <button class="btn-secondary quiz-retry">Try the quiz again</button>
      </div>`;
    card.querySelector('.quiz-retry').addEventListener('click', () => {
      index = 0; correctCount = 0; showQuestion();
    });

    if (didPass && !passed) {
      passed = true;
      if (typeof onPass === 'function') onPass();
    }
  }

  showQuestion();
}

export { renderQuiz, PASS_THRESHOLD };
