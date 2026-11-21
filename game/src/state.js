// The game's state: screens, levels, scoring, timer, hints and mistakes. No drawing
// happens here — render.js paints whatever this holds.
import { CLICK_SLOP, DIFFICULTIES, SCORE } from './config.js';
import { LEVELS } from './levels.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_CLEAR = 'level-clear';
export const SCREEN_WIN = 'win';
export const SCREEN_GAME_OVER = 'game-over';

export const DIFFICULTY_KEYS = ['santai', 'normal', 'cepat'];

export function createState() {
  const state = {
    screen: SCREEN_TITLE,
    difficulty: 'normal',
    levelIndex: 0,
    found: new Set(), // difference ids found in the current level
    foundOrder: [], // ids in the order they were found (for markers)
    score: 0,
    levelScore: 0,
    timeLeft: DIFFICULTIES.normal.seconds,
    hintsLeft: DIFFICULTIES.normal.hints,
    mistakes: 0,
    message: '',
    messageUntil: 0,
    hintId: null, // id currently pulsing from a hint
    hintUntil: 0,
    wrongAt: null, // {x, y, side, until} of the last wrong click
    lastTickSecond: -1,
    best: 0,
    elapsed: 0,
  };

  function level() { return LEVELS[state.levelIndex]; }
  function remaining() { return level().differences.length - state.found.size; }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.foundOrder = [];
    state.levelScore = 0;
    state.timeLeft = DIFFICULTIES[state.difficulty].seconds;
    state.hintsLeft = DIFFICULTIES[state.difficulty].hints;
    state.mistakes = 0;
    state.hintId = null;
    state.wrongAt = null;
    state.message = '';
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.score = 0;
    startLevel(0);
  }

  function flash(message, seconds = 2.2) {
    state.message = message;
    state.messageUntil = state.elapsed + seconds;
  }

  /** A click inside a picture panel, in panel-local coordinates. */
  function clickPanel(panel) {
    if (state.screen !== SCREEN_PLAY) return null;
    const diffs = level().differences;
    for (const diff of diffs) {
      if (state.found.has(diff.id)) continue;
      const dx = panel.x - diff.x;
      const dy = panel.y - diff.y;
      const r = diff.r + CLICK_SLOP;
      if (dx * dx + dy * dy <= r * r) {
        state.found.add(diff.id);
        state.foundOrder.push(diff.id);
        state.score += SCORE.find;
        state.levelScore += SCORE.find;
        flash(diff.label);
        if (state.found.size === diffs.length) {
          const bonus = Math.round(state.timeLeft) * SCORE.timeBonusPerSecond;
          state.score += bonus;
          state.levelScore += bonus;
          state.screen = state.levelIndex + 1 >= LEVELS.length ? SCREEN_WIN : SCREEN_LEVEL_CLEAR;
          return { type: 'level-clear', bonus };
        }
        return { type: 'found', diff };
      }
    }
    state.mistakes += 1;
    state.score = Math.max(0, state.score + SCORE.wrong);
    state.wrongAt = { x: panel.x, y: panel.y, side: panel.side, until: state.elapsed + 0.7 };
    flash('Bukan di situ — coba lagi!');
    return { type: 'wrong' };
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY) return null;
    if (state.hintsLeft <= 0) { flash('Petunjuk habis!'); return null; }
    const unfound = level().differences.filter((d) => !state.found.has(d.id));
    if (unfound.length === 0) return null;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score + SCORE.hint);
    // Hint the difference nearest the centre of the ones still hidden, so it feels fair.
    const pick = unfound[Math.floor(unfound.length / 2)];
    state.hintId = pick.id;
    state.hintUntil = state.elapsed + 2.5;
    flash(`Petunjuk: cari di sekitar ${pick.label.replace('!', '').toLowerCase()}…`, 2.5);
    return { type: 'hint', diff: pick };
  }

  /** Advance the timer; returns 'timeout' when time runs out. */
  function step(dt) {
    state.elapsed += dt;
    if (state.screen === SCREEN_PLAY) {
      state.timeLeft -= dt;
      const whole = Math.ceil(state.timeLeft);
      if (whole <= 10 && whole !== state.lastTickSecond && whole > 0) {
        state.lastTickSecond = whole;
        return 'tick';
      }
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        state.screen = SCREEN_GAME_OVER;
        return 'timeout';
      }
    }
    if (state.hintId && state.elapsed > state.hintUntil) state.hintId = null;
    if (state.wrongAt && state.elapsed > state.wrongAt.until) state.wrongAt = null;
    if (state.message && state.elapsed > state.messageUntil) state.message = '';
    return null;
  }

  return {
    state, level, remaining, startGame, startLevel, clickPanel, useHint, step, flash,
    nextLevel() { startLevel(state.levelIndex + 1); },
    retryLevel() { startLevel(state.levelIndex); },
    setDifficulty(key) {
      if (DIFFICULTY_KEYS.includes(key)) {
        state.difficulty = key;
        return true;
      }
      return false;
    },
  };
}
