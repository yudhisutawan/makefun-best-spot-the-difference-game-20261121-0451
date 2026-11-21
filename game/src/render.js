// Everything the player sees: the HUD, the two picture panels with their markers, the
// bottom bar and the title / pause / level-clear / win / game-over overlays. The renderer
// only paints state — it never changes it.
import {
  BAR, DIFFICULTIES, FIELD, FONT, PALETTE, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X,
} from './config.js';
import { LEVELS } from './levels.js';
import {
  SCREEN_GAME_OVER, SCREEN_LEVEL_CLEAR, SCREEN_PAUSED, SCREEN_PLAY,
  SCREEN_TITLE, SCREEN_WIN,
} from './state.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawPanel(ctx, game, x, changed) {
  const level = LEVELS[game.levelIndex];
  ctx.save();
  ctx.shadowColor = PALETTE.panelShadow;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = PALETTE.panelFrame;
  rr(ctx, x - 4, PANEL.y - 4, PANEL.width + 8, PANEL.height + 8, 10);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(x, PANEL.y);
  level.draw(ctx, PANEL.width, PANEL.height, changed);
  ctx.restore();
  // Tag naming the picture.
  ctx.fillStyle = '#2b2135';
  rr(ctx, x + 10, PANEL.y + 10, 108, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#f7f2e7';
  ctx.font = 'bold 16px ' + FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(x === PANEL_LEFT_X ? 'Gambar A' : 'Gambar B', x + 64, PANEL.y + 26);
}

function drawMarkers(ctx, game) {
  const level = LEVELS[game.levelIndex];
  const found = level.differences.filter((d) => game.found.has(d.id));
  for (const panelX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
    for (const diff of found) {
      const cx = panelX + diff.x;
      const cy = PANEL.y + diff.y;
      ctx.strokeStyle = PALETTE.good;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, diff.r + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = PALETTE.good;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (game.hintId) {
      const diff = level.differences.find((d) => d.id === game.hintId);
      if (diff) {
        const pulse = 6 + 4 * Math.sin(game.elapsed * 8);
        const cx = panelX + diff.x;
        const cy = PANEL.y + diff.y;
        ctx.strokeStyle = PALETTE.hint;
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, diff.r + pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    if (game.wrongAt && game.wrongAt.side === (panelX === PANEL_LEFT_X ? 'left' : 'right')) {
      const cx = panelX + game.wrongAt.x;
      const cy = PANEL.y + game.wrongAt.y;
      ctx.strokeStyle = PALETTE.bad;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 12); ctx.lineTo(cx + 12, cy + 12);
      ctx.moveTo(cx + 12, cy - 12); ctx.lineTo(cx - 12, cy + 12);
      ctx.stroke();
    }
  }
}

function drawHud(ctx, game) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, 0, FIELD.width, 72);
  ctx.fillStyle = PALETTE.hudLine;
  ctx.fillRect(0, 70, FIELD.width, 2);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = PALETTE.accent;
  ctx.font = 'bold 28px ' + FONT;
  ctx.fillText('BEDA GAMBAR', 20, 38);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '16px ' + FONT;
  ctx.fillText('Cari perbedaannya!', 236, 40);

  const level = LEVELS[game.levelIndex];
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 20px ' + FONT;
  ctx.fillText(`Level ${game.levelIndex + 1}/3 — ${level.name}`, 640, 28);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '15px ' + FONT;
  ctx.fillText(level.subtitle, 640, 52);

  // Remaining counter — big, because the screenshots must show it.
  const remaining = level.differences.length - game.found.size;
  ctx.fillStyle = '#2b2135';
  rr(ctx, 1150, 10, 110, 52, 10); ctx.fill();
  ctx.fillStyle = remaining === 0 ? PALETTE.good : PALETTE.accent;
  ctx.font = 'bold 22px ' + FONT;
  ctx.textAlign = 'center';
  ctx.fillText(`Sisa: ${remaining}`, 1205, 30);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '13px ' + FONT;
  ctx.fillText(`ditemukan ${game.found.size}/10`, 1205, 50);

  // Timer and score, right-aligned in their own columns.
  const low = game.timeLeft <= 30 && game.screen === SCREEN_PLAY;
  ctx.fillStyle = low ? PALETTE.bad : PALETTE.text;
  ctx.font = 'bold 26px ' + FONT;
  ctx.textAlign = 'right';
  ctx.fillText(fmtTime(game.timeLeft), 960, 30);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '13px ' + FONT;
  ctx.fillText('waktu', 960, 52);
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 22px ' + FONT;
  ctx.fillText(`Skor ${game.score}`, 1120, 30);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '13px ' + FONT;
  ctx.fillText('skor', 1120, 52);
  ctx.textAlign = 'left';
}

function drawBottomBar(ctx, game, muted) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, BAR.y, FIELD.width, BAR.height);
  ctx.fillStyle = PALETTE.hudLine;
  ctx.fillRect(0, BAR.y, FIELD.width, 2);
  // Hint button.
  ctx.fillStyle = PALETTE.button;
  rr(ctx, 16, BAR.y + 12, 160, 36, 8); ctx.fill();
  ctx.fillStyle = game.hintsLeft > 0 ? PALETTE.text : PALETTE.muted;
  ctx.font = 'bold 16px ' + FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Petunjuk (H) · ${game.hintsLeft}`, 96, BAR.y + 31);
  // Level dots.
  for (let i = 0; i < LEVELS.length; i += 1) {
    ctx.fillStyle = i < game.levelIndex ? PALETTE.good : (i === game.levelIndex ? PALETTE.accent : '#4d4170');
    ctx.beginPath();
    ctx.arc(440 + i * 36, BAR.y + 30, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '14px ' + FONT;
  ctx.fillText('H petunjuk · P jeda · M suara · R ulang', 800, BAR.y + 31);
  // Mute button.
  ctx.fillStyle = PALETTE.button;
  rr(ctx, 1104, BAR.y + 12, 160, 36, 8); ctx.fill();
  ctx.fillStyle = PALETTE.text;
  ctx.fillText(muted ? 'Suara: Mati (M)' : 'Suara: Nyala (M)', 1184, BAR.y + 31);
  ctx.textAlign = 'left';
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(20, 16, 29, 0.82)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.fillStyle = accent;
  ctx.font = 'bold 44px ' + FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 640, 250);
  ctx.fillStyle = PALETTE.text;
  ctx.font = '20px ' + FONT;
  lines.forEach((line, i) => ctx.fillText(line, 640, 320 + i * 36));
  ctx.textAlign = 'left';
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function draw(game, muted) {
    ctx.clearRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);

    if (game.screen === SCREEN_TITLE) {
      drawTitle(ctx, game);
      return;
    }

    drawHud(ctx, game);
    const all = new Set(LEVELS[game.levelIndex].differences.map((d) => d.id));
    drawPanel(ctx, game, PANEL_LEFT_X, new Set());
    drawPanel(ctx, game, PANEL_RIGHT_X, all);
    drawMarkers(ctx, game);
    drawBottomBar(ctx, game, muted);

    // The message line (what was just found, or a wrong-click nudge).
    if (game.message) {
      ctx.fillStyle = '#2b2135';
      const w = ctx.measureText(game.message).width + 36;
      rr(ctx, 640 - w / 2, 596, w, 40, 20); ctx.fill();
      ctx.fillStyle = PALETTE.accent;
      ctx.font = 'bold 18px ' + FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(game.message, 640, 617);
      ctx.textAlign = 'left';
    }

    if (game.screen === SCREEN_PAUSED) {
      overlay(ctx, 'Jeda', ['Tekan P atau Esc untuk lanjut.', 'H petunjuk · M suara · R ulang level'], PALETTE.accent);
    } else if (game.screen === SCREEN_LEVEL_CLEAR) {
      const level = LEVELS[game.levelIndex];
      overlay(ctx, 'Level Selesai!', [
        `Kamu menemukan semua 10 perbedaan di ${level.name}.`,
        `Skor level ini: ${game.levelScore} (termasuk bonus waktu).`,
        'Tekan N atau klik untuk lanjut ke level berikutnya.',
      ], PALETTE.good);
    } else if (game.screen === SCREEN_WIN) {
      overlay(ctx, 'Kamu Menang!', [
        'Semua 30 perbedaan di tiga suasana ditemukan!',
        `Skor akhir: ${game.score}  ·  Skor terbaik: ${game.best}`,
        'Tekan Enter untuk main lagi.',
      ], PALETTE.accent);
    } else if (game.screen === SCREEN_GAME_OVER) {
      const level = LEVELS[game.levelIndex];
      overlay(ctx, 'Waktu Habis!', [
        `Di ${level.name} kamu menemukan ${game.found.size} dari 10 perbedaan.`,
        `Skor: ${game.score}`,
        'Tekan R untuk mencoba level ini lagi.',
      ], PALETTE.bad);
    }
  }

  function drawTitle(ctx, game) {
    // A framed preview of the first scene behind the title, so the cover reads as a game.
    const all = new Set(LEVELS[0].differences.map((d) => d.id));
    ctx.save();
    ctx.globalAlpha = 0.45;
    drawPanel(ctx, { ...game, levelIndex: 0 }, PANEL_LEFT_X, new Set());
    drawPanel(ctx, { ...game, levelIndex: 0 }, PANEL_RIGHT_X, all);
    ctx.restore();
    ctx.fillStyle = 'rgba(20, 16, 29, 0.78)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = PALETTE.accent;
    ctx.font = 'bold 64px ' + FONT;
    ctx.fillText('BEDA GAMBAR', 640, 190);
    ctx.fillStyle = PALETTE.text;
    ctx.font = '24px ' + FONT;
    ctx.fillText('Dua gambar nyaris sama. Sepuluh perbedaan tersembunyi.', 640, 250);
    ctx.fillText('Klik perbedaannya di gambar mana pun — kiri atau kanan.', 640, 286);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = '18px ' + FONT;
    ctx.fillText('Tiga suasana: Pasar Senja · Taman Bunga · Pelabuhan Pagi', 640, 330);
    ctx.fillText('H petunjuk · P jeda · M suara · R ulang level', 640, 362);
    // Difficulty choices.
    const keys = ['santai', 'normal', 'cepat'];
    keys.forEach((key, i) => {
      const d = DIFFICULTIES[key];
      const x = 400 + i * 170;
      const selected = game.difficulty === key;
      ctx.fillStyle = selected ? PALETTE.accent : PALETTE.button;
      rr(ctx, x - 75, 420, 150, 64, 10); ctx.fill();
      ctx.fillStyle = selected ? '#2b2135' : PALETTE.text;
      ctx.font = 'bold 20px ' + FONT;
      ctx.fillText(`${i + 1} · ${d.label}`, x, 442);
      ctx.font = '14px ' + FONT;
      ctx.fillText(`${d.seconds} dtk · ${d.hints} petunjuk`, x, 466);
    });
    ctx.fillStyle = PALETTE.text;
    ctx.font = 'bold 22px ' + FONT;
    ctx.fillText('Tekan Enter atau klik untuk mulai', 640, 540);
    if (game.best > 0) {
      ctx.fillStyle = PALETTE.muted;
      ctx.font = '16px ' + FONT;
      ctx.fillText(`Skor terbaik: ${game.best}`, 640, 576);
    }
    ctx.textAlign = 'left';
  }

  return { draw };
}
