// fretboard.js — SVG fretboard component, tuning-aware

'use strict';

import { getNoteAtPosition } from './theory.js';

const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
const DOUBLE_MARKERS = [12, 24];

const COLORS = {
  root:      '#f59e0b',  // amber
  accent:    '#f59e0b',  // amber (alias — used for "mystery" highlighted note)
  scale:     '#3b82f6',  // blue
  correct:   '#22c55e',  // green
  incorrect: '#ef4444',  // red
  highlight: '#a78bfa',  // violet
  neutral:   '#6b7280'   // gray
};

class Fretboard {
  constructor() {
    this.svg = null;
    this.container = null;
    this.tuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
    this.numFrets = 12;
    this.clickCallback = null;
    this.highlights = new Map(); // key: "string,fret" → { color, label }
    this.clickable = false;

    // Layout constants (computed in render)
    this.layout = {};
  }

  render(container, options = {}) {
    this.container = container;
    this.tuning = options.tuning || this.tuning;
    this.numFrets = options.frets || 12;
    this.clickable = options.clickable !== false;

    container.innerHTML = '';
    this._buildLayout();
    this._createSVG();
    this._drawFretboard();
    this._drawNoteMarkers();
    return this;
  }

  _buildLayout() {
    const numStrings = this.tuning.length;
    const numFrets = this.numFrets;

    // Responsive: use container width
    const containerW = this.container.clientWidth || 700;
    const padding = { top: 30, bottom: 30, left: 40, right: 20 };
    const innerW = containerW - padding.left - padding.right;
    const fretWidth = innerW / numFrets;
    const stringSpacing = 28;
    const innerH = (numStrings - 1) * stringSpacing;
    const totalH = innerH + padding.top + padding.bottom;

    this.layout = {
      containerW,
      totalH,
      padding,
      fretWidth,
      stringSpacing,
      numStrings,
      numFrets,
      innerH
    };
  }

  _createSVG() {
    const { containerW, totalH } = this.layout;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${containerW} ${totalH}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('class', 'fretboard-svg');
    this.svg = svg;
    this.container.appendChild(svg);
  }

  _x(fret) {
    const { padding, fretWidth } = this.layout;
    // fret 0 is the nut position; fret n is the center of fret n
    return padding.left + (fret - 0.5) * fretWidth;
  }

  _x0() {
    // Nut x position
    return this.layout.padding.left;
  }

  _y(string) {
    // string 0 = lowest (thickest) = bottom visually
    const { padding, stringSpacing, numStrings } = this.layout;
    return padding.top + (numStrings - 1 - string) * stringSpacing;
  }

  _drawFretboard() {
    const { padding, fretWidth, numFrets, numStrings, stringSpacing, totalH, containerW } = this.layout;
    const svg = this.svg;

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', 0);
    bg.setAttribute('y', 0);
    bg.setAttribute('width', containerW);
    bg.setAttribute('height', totalH);
    bg.setAttribute('fill', '#1a1a2e');
    bg.setAttribute('rx', 8);
    svg.appendChild(bg);

    // Fretboard body
    const fb = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fb.setAttribute('x', padding.left);
    fb.setAttribute('y', padding.top);
    fb.setAttribute('width', fretWidth * numFrets);
    fb.setAttribute('height', (numStrings - 1) * stringSpacing);
    fb.setAttribute('fill', '#2d1810');
    fb.setAttribute('rx', 4);
    svg.appendChild(fb);

    // Fret position markers (dots on fretboard)
    for (const markerFret of FRET_MARKERS) {
      if (markerFret > numFrets) continue;
      const mx = this._x0() + markerFret * fretWidth - fretWidth / 2;
      const isDouble = DOUBLE_MARKERS.includes(markerFret);

      if (isDouble) {
        const midY = padding.top + (numStrings - 1) * stringSpacing / 2;
        const offset = stringSpacing * 0.8;
        [midY - offset / 2, midY + offset / 2].forEach(cy => {
          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('cx', mx);
          dot.setAttribute('cy', cy);
          dot.setAttribute('r', 5);
          dot.setAttribute('fill', '#4a3520');
          svg.appendChild(dot);
        });
      } else {
        const midY = padding.top + (numStrings - 1) * stringSpacing / 2;
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', mx);
        dot.setAttribute('cy', midY);
        dot.setAttribute('r', 5);
        dot.setAttribute('fill', '#4a3520');
        svg.appendChild(dot);
      }
    }

    // Fret lines (vertical)
    for (let f = 0; f <= numFrets; f++) {
      const x = this._x0() + f * fretWidth;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const isNut = f === 0;
      line.setAttribute('x', x - (isNut ? 3 : 1));
      line.setAttribute('y', padding.top);
      line.setAttribute('width', isNut ? 5 : 2);
      line.setAttribute('height', (numStrings - 1) * stringSpacing);
      line.setAttribute('fill', isNut ? '#d4a855' : '#5a4030');
      svg.appendChild(line);
    }

    // String lines (horizontal)
    const stringThicknesses = [3.5, 2.8, 2.2, 1.6, 1.1, 0.8];
    for (let s = 0; s < numStrings; s++) {
      const y = this._y(s);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', this._x0());
      line.setAttribute('x2', this._x0() + numFrets * fretWidth);
      line.setAttribute('y1', y);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#c0a060');
      line.setAttribute('stroke-width', stringThicknesses[numStrings - 1 - s] || 1);
      svg.appendChild(line);
    }

    // Open string note labels (left of nut)
    for (let s = 0; s < numStrings; s++) {
      const y = this._y(s);
      const note = getNoteAtPosition(s, 0, this.tuning);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', padding.left - 8);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#9ca3af');
      text.setAttribute('font-family', 'monospace');
      text.textContent = note;
      svg.appendChild(text);
    }

    // Fret number labels
    for (let f = 1; f <= numFrets; f++) {
      if (f % 2 !== 0 || FRET_MARKERS.includes(f)) {
        const x = this._x0() + f * fretWidth - fretWidth / 2;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', totalH - 8);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '9');
        text.setAttribute('fill', FRET_MARKERS.includes(f) ? '#d4a855' : '#6b7280');
        text.setAttribute('font-family', 'monospace');
        text.textContent = f;
        svg.appendChild(text);
      }
    }

    // Reference note layer (dim background labels, populated by showReferenceNotes())
    this._referenceGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._referenceGroup.setAttribute('class', 'reference-notes');
    svg.appendChild(this._referenceGroup);

    // Highlight layer (exercise dots — sits above reference notes)
    this._highlightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._highlightGroup.setAttribute('class', 'highlights');
    svg.appendChild(this._highlightGroup);

    // Click hit areas — rendered last so they sit on top and receive all pointer events
    if (this.clickable) {
      this._hitAreaGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this._hitAreaGroup.setAttribute('class', 'hit-areas');
      for (let s = 0; s < numStrings; s++) {
        for (let f = 0; f <= numFrets; f++) {
          const x = f === 0 ? this._x0() - 20 : this._x0() + (f - 1) * fretWidth;
          const w = f === 0 ? 20 : fretWidth;
          const y = this._y(s) - stringSpacing / 2;
          const h = stringSpacing;

          const hit = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          hit.setAttribute('x', x);
          hit.setAttribute('y', y);
          hit.setAttribute('width', w);
          hit.setAttribute('height', h);
          hit.setAttribute('fill', 'transparent');
          hit.setAttribute('data-string', s);
          hit.setAttribute('data-fret', f);
          hit.style.cursor = 'pointer';

          hit.addEventListener('click', (e) => {
            if (this.clickCallback) {
              const str = parseInt(hit.getAttribute('data-string'));
              const fret = parseInt(hit.getAttribute('data-fret'));
              this.clickCallback(str, fret, getNoteAtPosition(str, fret, this.tuning));
            }
          });

          this._hitAreaGroup.appendChild(hit);
        }
      }
      svg.appendChild(this._hitAreaGroup);
    }
  }

  _drawNoteMarkers() {
    this._highlightGroup.innerHTML = '';
    const { stringSpacing } = this.layout;
    const r = Math.min(stringSpacing / 2 - 2, 11);

    for (const [key, info] of this.highlights) {
      const [s, f] = key.split(',').map(Number);
      const cx = f === 0 ? this._x0() - 10 : this._x(f);
      const cy = this._y(s);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', info.color || COLORS.neutral);
      circle.setAttribute('stroke', '#1a1a2e');
      circle.setAttribute('stroke-width', '1.5');
      this._highlightGroup.appendChild(circle);

      if (info.label) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '9');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#1a1a2e');
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('pointer-events', 'none');
        text.textContent = info.label;
        this._highlightGroup.appendChild(text);
      }
    }
  }

  // Highlight an array of {string, fret} or {string, fret, color, label} objects
  highlight(positions, color = COLORS.scale, label = null) {
    for (const pos of positions) {
      const key = `${pos.string},${pos.fret}`;
      this.highlights.set(key, {
        color: pos.color || color,
        label: pos.label !== undefined ? pos.label : (label || getNoteAtPosition(pos.string, pos.fret, this.tuning))
      });
    }
    this._drawNoteMarkers();
    return this;
  }

  // Flash a position with a color then restore
  flash(string, fret, color, duration = 600) {
    const key = `${string},${fret}`;
    const old = this.highlights.get(key);
    const tempColor = color;

    this.highlights.set(key, { color: tempColor, label: old ? old.label : '' });
    this._drawNoteMarkers();

    setTimeout(() => {
      if (old) {
        this.highlights.set(key, old);
      } else {
        this.highlights.delete(key);
      }
      this._drawNoteMarkers();
    }, duration);
  }

  onClick(callback) {
    this.clickCallback = callback;
    return this;
  }

  // Show dim note-name labels as a learning aid.
  // filter: 'all' = every note, 'naturals' = A B C D E F G only, 'none' = clear
  showReferenceNotes(filter = 'none') {
    if (!this._referenceGroup) return this;
    this._referenceGroup.innerHTML = '';
    if (filter === 'none') return this;

    const NATURALS = new Set(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    const { stringSpacing } = this.layout;
    const r = Math.min(stringSpacing / 2 - 2, 11);

    for (let s = 0; s < this.tuning.length; s++) {
      for (let f = 0; f <= this.numFrets; f++) {
        const note = getNoteAtPosition(s, f, this.tuning);
        if (filter === 'naturals' && !NATURALS.has(note)) continue;

        const cx = f === 0 ? this._x0() - 10 : this._x(f);
        const cy = this._y(s);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        // Easy = slightly brighter, Medium = dimmer (naturals only)
        circle.setAttribute('fill', filter === 'all' ? '#1e2d45' : '#1a2a1a');
        circle.setAttribute('stroke', filter === 'all' ? '#2a4060' : '#223022');
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('pointer-events', 'none');
        this._referenceGroup.appendChild(circle);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', cx);
        text.setAttribute('y', cy + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', note.length > 1 ? '7' : '8');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', filter === 'all' ? '#4a7aaa' : '#4a8a4a');
        text.setAttribute('font-family', 'monospace');
        text.setAttribute('pointer-events', 'none');
        text.textContent = note;
        this._referenceGroup.appendChild(text);
      }
    }
    return this;
  }

  reset() {
    this.highlights.clear();
    this._drawNoteMarkers();
    if (this._referenceGroup) this._referenceGroup.innerHTML = '';
    return this;
  }

  setTuning(tuning) {
    this.tuning = tuning;
    if (this.container) {
      this.render(this.container, { tuning, frets: this.numFrets, clickable: this.clickable });
    }
    return this;
  }

  // Remove highlighting from specific positions
  clearHighlight(positions) {
    for (const pos of positions) {
      this.highlights.delete(`${pos.string},${pos.fret}`);
    }
    this._drawNoteMarkers();
    return this;
  }
}

export { Fretboard, COLORS };
