// Boot and the one loop: input is read as actions, the state advances in fixed 1/60 s
// steps, and the renderer paints what is there. The game moves between six screens:
// title, play, paused, level-clear, win and game-over.
//
// ?shot=start|play|level2|end stages that scene instead of running the loop, paints it
// twice and sets window.__shotReady for a screenshot. window.__game exposes the state
// for automated play-testing.
import { BEST_KEY, STEP } from './config.js';
import { createAudio } from './audio.js';
import {
  ACTION_CLICK_HINT, ACTION_CLICK_MUTE, ACTION_CLICK_PANEL, ACTION_DIFFICULTY,
  ACTION_HINT, ACTION_MUTE, ACTION_NEXT, ACTION_PAUSE, ACTION_RESTART,
  ACTION_START, createInput,
} from './input.js';
import {
  DIFFICULTY_KEYS, SCREEN_GAME_OVER, SCREEN_LEVEL_CLEAR, SCREEN_PAUSED,
  SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, createState,
} from './state.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall is dropped, not replayed. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const game = createState();
const audio = createAudio();
const renderer = createRenderer(canvas);

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

game.state.best = readBest();

function announce() {
  const s = game.state;
  status.textContent = s.message
    || (s.screen === SCREEN_PLAY
      ? `Level ${s.levelIndex + 1}: ${s.found.size} dari 10 perbedaan ditemukan, ${Math.ceil(s.timeLeft)} detik tersisa.`
      : '');
}

function onAction(action, arg) {
  const s = game.state;
  audio.unlock();
  if (action === ACTION_MUTE || action === ACTION_CLICK_MUTE) {
    const muted = audio.toggleMute();
    game.flash(muted ? 'Suara dimatikan.' : 'Suara dinyalakan.');
    return;
  }
  if (action === ACTION_DIFFICULTY) {
    if (s.screen === SCREEN_TITLE) {
      game.setDifficulty(DIFFICULTY_KEYS[Number(arg) - 1]);
    }
    return;
  }
  if (action === ACTION_PAUSE) {
    if (s.screen === SCREEN_PLAY) s.screen = SCREEN_PAUSED;
    else if (s.screen === SCREEN_PAUSED) s.screen = SCREEN_PLAY;
    return;
  }
  if (action === ACTION_RESTART) {
    if (s.screen === SCREEN_PLAY || s.screen === SCREEN_PAUSED || s.screen === SCREEN_GAME_OVER) {
      game.retryLevel();
    }
    return;
  }
  if (action === ACTION_HINT || action === ACTION_CLICK_HINT) {
    const result = game.useHint();
    if (result) audio.found();
    return;
  }
  if (action === ACTION_NEXT) {
    if (s.screen === SCREEN_LEVEL_CLEAR) game.nextLevel();
    return;
  }
  if (action === ACTION_START) {
    if (s.screen === SCREEN_TITLE || s.screen === SCREEN_WIN) game.startGame();
    else if (s.screen === SCREEN_LEVEL_CLEAR) game.nextLevel();
    else if (s.screen === SCREEN_PAUSED) s.screen = SCREEN_PLAY;
    return;
  }
  if (action === ACTION_CLICK_PANEL) {
    if (s.screen === SCREEN_TITLE || s.screen === SCREEN_WIN) { game.startGame(); return; }
    if (s.screen === SCREEN_LEVEL_CLEAR) { game.nextLevel(); return; }
    if (s.screen === SCREEN_GAME_OVER) { game.retryLevel(); return; }
    if (s.screen !== SCREEN_PLAY) return;
    const result = game.clickPanel(arg);
    if (!result) return;
    if (result.type === 'found') audio.found();
    else if (result.type === 'wrong') audio.wrong();
    else if (result.type === 'level-clear') {
      if (s.screen === SCREEN_WIN) {
        audio.win();
        if (s.score > s.best) {
          s.best = s.score;
          saveBest(s.best);
        }
      } else {
        audio.levelClear();
      }
    }
  }
}

createInput(canvas, onAction);

function step(dt) {
  const event = game.step(dt);
  if (event === 'tick') audio.tick();
}

let last = performance.now();
let accumulator = 0;

function frame(now) {
  const elapsed = Math.min((now - last) / 1000, MAX_FRAME);
  last = now;
  accumulator += elapsed;
  while (accumulator >= STEP) {
    step(STEP);
    accumulator -= STEP;
  }
  renderer.draw(game.state, audio.isMuted());
  announce();
  requestAnimationFrame(frame);
}

if (shot) {
  stageShot(shot, game);
  let painted = 0;
  (function paint() {
    renderer.draw(game.state, audio.isMuted());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  })();
} else {
  requestAnimationFrame(frame);
}

// Exposed for automated play-testing (not part of the game itself).
window.__game = game;
