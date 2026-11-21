// Every tuning number, colour and layout constant in one place. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window, so no rule below depends on
// the screen size. Two picture panels sit side by side under a HUD bar, with a bottom bar
// for hints, mute and level dots.
export const FIELD = { width: 1280, height: 720 };

// One picture panel (the scene is drawn in this 600x560 local space, twice: once plain on
// the left, once with the differences applied on the right).
export const PANEL = { width: 600, height: 560, y: 84, gap: 48 };
export const PANEL_LEFT_X = 16;
export const PANEL_RIGHT_X = PANEL_LEFT_X + PANEL.width + PANEL.gap;

export const HUD = { height: 72 };
export const BAR = { y: 652, height: 60 };

/** The simulation's fixed step, in seconds. */
export const STEP = 1 / 60;

/** Click tolerance added to a difference's own radius, in panel pixels. */
export const CLICK_SLOP = 8;

/** Points for a find, penalty for a wrong click, cost of a hint, bonus per second left. */
export const SCORE = { find: 100, wrong: -25, hint: -50, timeBonusPerSecond: 5 };

/** Difficulties: seconds per level and hints per level. */
export const DIFFICULTIES = {
  santai: { label: 'Santai', seconds: 240, hints: 3, blurb: 'Tanpa tekanan — cocok untuk bersantai.' },
  normal: { label: 'Normal', seconds: 180, hints: 3, blurb: 'Waktu cukup, perbedaan makin licik.' },
  cepat: { label: 'Cepat', seconds: 120, hints: 2, blurb: 'Detik berjalan — hanya untuk mata elang.' },
};

export const PALETTE = {
  backdrop: '#14101d',
  hud: '#221c33',
  hudLine: '#3a2f52',
  panelFrame: '#f5ead6',
  panelShadow: '#00000088',
  text: '#f7f2e7',
  muted: '#b8aec9',
  accent: '#ffc53d',
  accent2: '#ff7a59',
  good: '#7bd88a',
  bad: '#ff5d5d',
  hint: '#59c2ff',
  button: '#3d3357',
  buttonHover: '#4d4170',
};

export const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'beda-gambar.best';
