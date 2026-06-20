# Music Theory — A Structured Course

A browser-based course that teaches music theory from the ground up — instrument-neutral,
notation-first, and fully interactive. Every concept is shown in standard staff notation you
can **click to hear**, with audio examples, interactive explorers, and a short quiz at the end
of each lesson.

**Live app:** https://snizzles.github.io/guitartheory/

## The Course

Eight modules, beginner → advanced:

1. **Notation & Pitch** — the musical alphabet, the staff, treble & bass clefs, the grand staff, accidentals & the chromatic scale, half/whole steps
2. **Reading Rhythm** — note values, time signatures & measures, rests, dots & ties
3. **Intervals** — number & quality, major/minor/perfect, the tritone, ear training
4. **Scales** — the major-scale formula, minor scales, pentatonic & blues
5. **Keys & the Circle of Fifths** — key signatures, relative major/minor, the circle
6. **Modes** — the seven modes and their characteristic colours
7. **Triads & Diatonic Harmony** — building triads, inversions, Roman numerals
8. **Seventh Chords & Progressions** — 7th chords, cadences, common progressions

## Features

- **Interactive staff notation** — rendered with [abcjs](https://www.abcjs.net/); click any note to hear it
- **Audio** — a built-in Web Audio synth plays notes, scales, intervals and chords (no samples to download)
- **Interactive explorers** — a mini piano, an interval lab, scale & chord builders, and a clickable circle of fifths
- **End-of-lesson quizzes** — pass to unlock the next lesson
- **Practice flashcards** — unscored memorization decks (note reading, notes-in-a-chord, name-the-chord, intervals, scale spelling, key signatures) you can drill anytime; flip to check yourself and hear every answer. Each deck has a **difficulty selector** that starts on the basics (e.g. major/minor triads) and adds advanced material only when you choose
- **Progress tracking** — completion ticks, course %, and resume-where-you-left-off, saved in `localStorage`

## Tech Stack

- Vanilla HTML + CSS + ES modules — no build step
- [abcjs](https://www.abcjs.net/) (vendored in `vendor/`) for notation rendering
- Web Audio API for sound
- `localStorage` for progress

## File Structure

```
index.html              — App shell: header, sidebar, content
css/style.css           — Dark study theme + responsive layout
vendor/abcjs-basic-min.js — Vendored notation library
js/theory.js            — Music theory engine: notes, spelling, scales, keys, chords, ABC output
js/audio.js             — Web Audio synth
js/notation.js          — abcjs wrapper (render + click-to-hear)
js/quiz.js              — End-of-lesson quiz engine
js/flashcards.js        — Unscored memorization decks
js/progress.js          — localStorage progress tracking
js/app.js               — Routing, lesson rendering, interactive widgets
js/lessons/             — Lesson content (one file per module) + index
.github/workflows/pages.yml — GitHub Pages deploy
```

## Running Locally

The app uses ES modules, so serve it over HTTP (not `file://`):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deployment

Pushes to `main` are deployed automatically by `.github/workflows/pages.yml`.
One-time setup: **Settings → Pages → Source → "GitHub Actions"**.
