// The deterministic screenshot scenes behind ?shot=start|play|level2|end. Each one stages
// a real game state — the same state a player reaches by playing — and the renderer paints
// it, so the screenshots are honest renders of the game's own code, not mock-ups.
//
// - start: the title screen over a dimmed preview of the first scene.
// - play: level 1 (Pasar Senja) mid-hunt, 4 of 10 differences found, 6 still hidden,
//   2:12 left on the clock — the cover shot.
// - level2: level 2 (Taman Bunga) mid-hunt, 3 found, 7 still hidden.
// - end: the win screen after all three levels.
import { LEVELS } from './levels.js';
import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './state.js';

function stageFound(game, levelIndex, foundIds, timeLeft, score) {
  const s = game.state;
  s.screen = SCREEN_PLAY;
  s.levelIndex = levelIndex;
  s.found = new Set(foundIds);
  s.foundOrder = [...foundIds];
  s.timeLeft = timeLeft;
  s.score = score;
  s.levelScore = foundIds.length * 100;
  s.hintsLeft = 3;
  s.mistakes = 0;
  s.message = '';
  s.hintId = null;
  s.wrongAt = null;
}

export function stageShot(name, game) {
  const s = game.state;
  if (name === 'play') {
    const ids = LEVELS[0].differences.map((d) => d.id);
    stageFound(game, 0, [ids[0], ids[2], ids[5], ids[7]], 132, 400);
    s.message = LEVELS[0].differences[7].label;
    s.messageUntil = 99999;
    return;
  }
  if (name === 'level2') {
    const ids = LEVELS[1].differences.map((d) => d.id);
    stageFound(game, 1, [ids[1], ids[4], ids[8]], 145, 1150);
    s.message = LEVELS[1].differences[8].label;
    s.messageUntil = 99999;
    return;
  }
  if (name === 'end') {
    s.screen = SCREEN_WIN;
    s.levelIndex = 2;
    s.found = new Set(LEVELS[2].differences.map((d) => d.id));
    s.foundOrder = LEVELS[2].differences.map((d) => d.id);
    s.score = 3420;
    s.best = 3420;
    s.timeLeft = 48;
    s.message = '';
    return;
  }
  s.screen = SCREEN_TITLE;
  s.best = game.state.best;
}
