// Keyboard and mouse input, translated into game actions. The game is played with mouse
// clicks on either picture and a few keys; every action is named here so main.js never
// reads raw events.
import { BAR, FIELD, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';

export const ACTION_START = 'start';
export const ACTION_HINT = 'hint';
export const ACTION_MUTE = 'mute';
export const ACTION_PAUSE = 'pause';
export const ACTION_RESTART = 'restart';
export const ACTION_NEXT = 'next';
export const ACTION_DIFFICULTY = 'difficulty';
export const ACTION_CLICK_PANEL = 'click-panel';
export const ACTION_CLICK_HINT = 'click-hint';
export const ACTION_CLICK_MUTE = 'click-mute';
export const ACTION_CLICK_PAUSE = 'click-pause';

/**
 * Convert a canvas pixel into logical field coordinates (the canvas is scaled to fit
 * the window, so client pixels are not field pixels).
 */
export function toField(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * FIELD.width,
    y: ((clientY - rect.top) / rect.height) * FIELD.height,
  };
}

/** Which picture panel (if any) a field point falls in, with panel-local coordinates. */
export function panelAt(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL.width) {
    return { side: 'left', x: x - PANEL_LEFT_X, y: y - PANEL.y };
  }
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL.width) {
    return { side: 'right', x: x - PANEL_RIGHT_X, y: y - PANEL.y };
  }
  return null;
}

export function createInput(canvas, onAction) {
  function onKey(event) {
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') { onAction(ACTION_START); event.preventDefault(); }
    else if (key === 'h') onAction(ACTION_HINT);
    else if (key === 'm') onAction(ACTION_MUTE);
    else if (key === 'p' || key === 'escape') onAction(ACTION_PAUSE);
    else if (key === 'r') onAction(ACTION_RESTART);
    else if (key === '1' || key === '2' || key === '3') onAction(ACTION_DIFFICULTY, key);
    else if (key === 'n') onAction(ACTION_NEXT);
  }

  function onClick(event) {
    const { x, y } = toField(canvas, event.clientX, event.clientY);
    // Bottom bar buttons: hint (left), mute (right).
    if (y >= BAR.y && y <= BAR.y + BAR.height) {
      if (x >= 16 && x <= 176) { onAction(ACTION_CLICK_HINT); return; }
      if (x >= 1104 && x <= 1264) { onAction(ACTION_CLICK_MUTE); return; }
      return;
    }
    const panel = panelAt(x, y);
    if (panel) onAction(ACTION_CLICK_PANEL, panel);
  }

  window.addEventListener('keydown', onKey);
  canvas.addEventListener('click', onClick);
  return {
    destroy() {
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('click', onClick);
    },
  };
}
