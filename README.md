# Guitar Theory Trainer

A browser-based music theory learning app built for guitarists. Sessions are short (10 questions, ~3 minutes), use spaced repetition, and are directly applicable to real playing.

**Live app:** https://snizzles.github.io/guitartheory/

## Features

- **Note Memorization** — Find all instances of a note on the fretboard, or name a highlighted position
- **Intervals** — Identify the interval between two highlighted notes, or locate a note at a given interval from a root
- **Scale Patterns** — Name a highlighted scale pattern, or build one by clicking all the tones
- **Chord Construction** — Recall the notes in a chord, or identify a chord from its notes
- **Fretboard Explorer** — Visualize any scale or note across the full 24-fret neck, no scoring
- **Custom Tunings** — 10 presets (Standard, Drop D, Drop C#, Drop C, Drop B, Open G, Open D, DADGAD, Half Down, Full Down) plus custom per-string input
- **Spaced Repetition** — Weak spots surface more often; per-item accuracy tracked in `localStorage`
- **Day Streak** — Tracks consecutive days you've practiced

## Tech Stack

- Vanilla HTML + CSS + JavaScript — no build step, no dependencies
- SVG fretboard rendered in JavaScript
- `localStorage` for all progress and stats persistence

## File Structure

```
index.html        — Shell, navigation, all page containers
css/style.css     — Dark theme, responsive/mobile-first layout
js/theory.js      — Pure music theory: notes, intervals, scales, chords
js/fretboard.js   — SVG fretboard component, tuning-aware
js/exercises.js   — Exercise modules + spaced repetition scoring
js/app.js         — App init, routing, session management
```

## Running Locally

Because the app uses ES modules (`type="module"`), you need to serve it over HTTP rather than opening `index.html` directly as a `file://` URL. Any static file server works:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then open http://localhost:8080.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` – `4` | Select multiple-choice answer |

## Scales Covered

Major, Natural Minor, Harmonic Minor, Melodic Minor, Pentatonic Major, Pentatonic Minor, Blues, Dorian, Phrygian, Lydian, Mixolydian, Locrian, Whole Tone, Phrygian Dominant, Diminished (HW/WH)

## Chords Covered

Major, Minor, Augmented, Diminished, Sus2, Sus4, Dom7, Maj7, Min7, m7b5, Dim7, Aug7, Maj9, Dom9, Min9, Add9, Dom7b9, Dom7#9, 6, m6
