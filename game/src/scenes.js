// The three original scenes, drawn procedurally with the canvas 2D API — no image files,
// no copied art. Each scene is drawn twice per frame: once plain (left panel) and once
// with its differences applied (right panel). `changed` is the set of difference ids that
// the right panel shows; the left panel is always drawn with an empty set.
//
// Every difference is a small, deliberate change a careful player can spot: something
// missing, a colour swapped, an extra bird, a light switched off. The coordinates in the
// level definitions (levels.js) match the anchors used here.

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function sky(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.62);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h * 0.62);
}

function cloud(ctx, x, y, s, color = '#ffffff') {
  ctx.fillStyle = color;
  circle(ctx, x, y, 16 * s); ctx.fill();
  circle(ctx, x + 18 * s, y - 6 * s, 13 * s); ctx.fill();
  circle(ctx, x + 36 * s, y, 15 * s); ctx.fill();
  ctx.fillRect(x - 14 * s, y - 2 * s, 62 * s, 16 * s);
}

function bird(ctx, x, y, s = 1, color = '#2b2135') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 9 * s, y);
  ctx.stroke();
}

function lanternString(ctx, w, y, missingId, changed) {
  ctx.strokeStyle = '#3a2f52';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y - 26);
  ctx.quadraticCurveTo(w / 2, y + 18, w, y - 26);
  ctx.stroke();
  const spots = [70, 170, 300, 430, 530];
  spots.forEach((x, i) => {
    const sag = 8 + 14 * Math.sin((x / w) * Math.PI);
    const ly = y + sag;
    if (changed.has(missingId) && i === 2) return; // the middle lantern is gone
    ctx.strokeStyle = '#3a2f52';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y - 26 + (ly - (y - 26)) * 0.4); ctx.lineTo(x, ly - 12); ctx.stroke();
    ctx.fillStyle = i % 2 ? '#ff9f43' : '#ff6b6b';
    ctx.beginPath(); ctx.ellipse(x, ly, 11, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe66d';
    ctx.fillRect(x - 2, ly - 4, 4, 8);
  });
}

function stripedAwning(ctx, x, y, w, h, colorA, colorB, stripes) {
  for (let i = 0; i < stripes; i += 1) {
    ctx.fillStyle = i % 2 ? colorA : colorB;
    const sx = x + (w / stripes) * i;
    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.lineTo(sx + w / stripes, y);
    ctx.lineTo(sx + w / stripes, y + h);
    ctx.lineTo(sx, y + h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(x, y + h - 6, w, 6);
}

// ---------------------------------------------------------------------------
// Level 1 — Pasar Senja (Twilight Market)
// ---------------------------------------------------------------------------
export function drawMarket(ctx, w, h, changed) {
  sky(ctx, w, h, '#3b2a5e', '#ff9a5c');
  // Low sun, and a crescent moon that only the right panel has.
  ctx.fillStyle = '#ffd166';
  circle(ctx, 500, 120, 30); ctx.fill();
  ctx.fillStyle = '#ffb703';
  circle(ctx, 500, 120, 22); ctx.fill();
  if (changed.has('moon')) {
    ctx.fillStyle = '#f7f2e7';
    circle(ctx, 520, 62, 16); ctx.fill();
    ctx.fillStyle = '#3b2a5e';
    circle(ctx, 526, 58, 14); ctx.fill();
  }
  cloud(ctx, 60, 60, 0.9, '#ffd9b0');
  cloud(ctx, 380, 44, 0.7, '#ffd9b0');
  bird(ctx, 120, 80);
  bird(ctx, 150, 66, 0.8);
  if (changed.has('bird')) bird(ctx, 210, 96, 1); // one extra bird

  // Back buildings, one window lit in the left panel only.
  ctx.fillStyle = '#4a3566';
  ctx.fillRect(30, 130, 110, 190);
  ctx.fillStyle = '#5a4178';
  ctx.fillRect(460, 110, 110, 210);
  ctx.fillStyle = changed.has('window') ? '#4a3566' : '#ffe66d';
  ctx.fillRect(62, 168, 26, 30);
  ctx.fillStyle = '#3b2a5e';
  ctx.fillRect(492, 150, 26, 30);
  ctx.fillRect(492, 200, 26, 30);
  ctx.fillStyle = '#2b2135';
  ctx.beginPath(); ctx.moveTo(30, 130); ctx.lineTo(85, 104); ctx.lineTo(140, 130); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(460, 110); ctx.lineTo(515, 84); ctx.lineTo(570, 110); ctx.closePath(); ctx.fill();

  // Street.
  ctx.fillStyle = '#6b4a3a';
  ctx.fillRect(0, 320, w, h - 320);
  ctx.fillStyle = '#7d5a48';
  ctx.fillRect(0, 320, w, 10);
  ctx.fillStyle = '#5a3d31';
  for (let i = 0; i < 8; i += 1) ctx.fillRect(20 + i * 72, 470, 40, 6);

  // Stall 1 (left): fruit.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(48, 380, 130, 12);
  ctx.fillRect(58, 392, 10, 60);
  ctx.fillRect(158, 392, 10, 60);
  stripedAwning(ctx, 40, 250, 146, 34, '#e63946', '#f5ead6', 6);
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(52, 250, 8, 130);
  ctx.fillRect(166, 250, 8, 130);
  // Basket of fruit: oranges on the left, green apples on the right.
  ctx.fillStyle = '#a4713b';
  ctx.beginPath(); ctx.ellipse(113, 372, 52, 16, 0, 0, Math.PI); ctx.fill();
  ctx.fillRect(61, 368, 104, 12);
  const fruitColor = changed.has('fruit') ? '#7bd88a' : '#ff8c42';
  for (let i = 0; i < 7; i += 1) {
    ctx.fillStyle = fruitColor;
    circle(ctx, 76 + i * 13, 360 - (i % 2) * 8, 9); ctx.fill();
    ctx.fillStyle = '#4a7c59';
    ctx.fillRect(74 + i * 13, 348 - (i % 2) * 8, 3, 6);
  }

  // Stall 2 (middle): sate, signboard and flag.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(238, 380, 150, 12);
  ctx.fillRect(248, 392, 10, 60);
  ctx.fillRect(368, 392, 10, 60);
  const awningColor = changed.has('awning') ? '#2ec4b6' : '#e63946';
  stripedAwning(ctx, 230, 236, 166, 34, awningColor, '#f5ead6', 6);
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(242, 236, 8, 144);
  ctx.fillRect(376, 236, 8, 144);
  // Signboard: SATE on the left, SOTO on the right.
  ctx.fillStyle = '#2b2135';
  rr(ctx, 262, 276, 102, 40, 6); ctx.fill();
  ctx.fillStyle = '#ffe66d';
  ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(changed.has('sign') ? 'SOTO' : 'SATE', 313, 297);
  // Flag on the stall pole.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(388, 180, 5, 60);
  ctx.fillStyle = changed.has('flag') ? '#59c2ff' : '#ff5d5d';
  ctx.beginPath(); ctx.moveTo(393, 180); ctx.lineTo(425, 190); ctx.lineTo(393, 202); ctx.closePath(); ctx.fill();
  // Skewers on the counter.
  ctx.strokeStyle = '#d9c9a8';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath(); ctx.moveTo(256 + i * 28, 372); ctx.lineTo(272 + i * 28, 352); ctx.stroke();
  }
  ctx.fillStyle = '#b5651d';
  for (let i = 0; i < 4; i += 1) { circle(ctx, 268 + i * 28, 356, 6); ctx.fill(); }

  // Stall 3 (right): crates, and a cat that only the left panel has.
  ctx.fillStyle = '#a4713b';
  ctx.fillRect(452, 400, 60, 44);
  ctx.fillRect(518, 400, 60, 44);
  ctx.fillRect(482, 356, 60, 44);
  ctx.strokeStyle = '#7a4a22';
  ctx.lineWidth = 2;
  ctx.strokeRect(452, 400, 60, 44);
  ctx.strokeRect(518, 400, 60, 44);
  ctx.strokeRect(482, 356, 60, 44);
  if (!changed.has('cat')) {
    // Cat sitting on the middle crate.
    ctx.fillStyle = '#2b2135';
    ctx.beginPath(); ctx.ellipse(512, 340, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 526, 322, 11); ctx.fill();
    ctx.beginPath(); ctx.moveTo(519, 313); ctx.lineTo(522, 302); ctx.lineTo(527, 312); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(530, 313); ctx.lineTo(533, 302); ctx.lineTo(536, 312); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2b2135';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(498, 330); ctx.quadraticCurveTo(482, 322, 486, 306); ctx.stroke();
  }

  // Bicycle leaning by the crates — gone in the right panel.
  if (!changed.has('bike')) {
    ctx.strokeStyle = '#2b2135';
    ctx.lineWidth = 4;
    circle(ctx, 440, 500, 22); ctx.stroke();
    circle(ctx, 500, 500, 22); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(440, 500); ctx.lineTo(468, 462); ctx.lineTo(500, 500);
    ctx.moveTo(468, 462); ctx.lineTo(452, 462);
    ctx.moveTo(468, 462); ctx.lineTo(488, 462);
    ctx.stroke();
    ctx.strokeStyle = '#ff5d5d';
    ctx.beginPath(); ctx.moveTo(448, 456); ctx.lineTo(462, 456); ctx.stroke();
  }

  lanternString(ctx, w, 96, 'lantern', changed);
}

function flower(ctx, x, y, color, s = 1) {
  ctx.strokeStyle = '#2f7d4f';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 26 * s); ctx.stroke();
  ctx.fillStyle = color;
  for (let p = 0; p < 5; p += 1) {
    const a = (p / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 6 * s); ctx.fill();
  }
  ctx.fillStyle = '#ffe66d';
  circle(ctx, x, y, 5 * s); ctx.fill();
}

function butterfly(ctx, x, y, s = 1, color = '#ff7ad9') {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x - 7 * s, y, 7 * s, 10 * s, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 7 * s, y, 7 * s, 10 * s, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b2135';
  ctx.fillRect(x - 1.5 * s, y - 8 * s, 3 * s, 16 * s);
}

// ---------------------------------------------------------------------------
// Level 2 — Taman Bunga (Flower Garden)
// ---------------------------------------------------------------------------
export function drawGarden(ctx, w, h, changed) {
  sky(ctx, w, h, '#7ec8f7', '#dff3ff');
  // Sun with rays — the rays vanish in the right panel.
  ctx.fillStyle = '#ffd166';
  circle(ctx, 90, 70, 30); ctx.fill();
  if (!changed.has('rays')) {
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(90 + Math.cos(a) * 38, 70 + Math.sin(a) * 38);
      ctx.lineTo(90 + Math.cos(a) * 50, 70 + Math.sin(a) * 50);
      ctx.stroke();
    }
  }
  cloud(ctx, 300, 60, 1);
  cloud(ctx, 470, 100, 0.8);
  if (changed.has('cloud')) cloud(ctx, 430, 170, 0.7); // one extra cloud
  bird(ctx, 250, 90);
  bird(ctx, 280, 76, 0.8);

  // Lawn.
  ctx.fillStyle = '#5da85f';
  ctx.fillRect(0, 300, w, h - 300);
  ctx.fillStyle = '#4c9450';
  ctx.fillRect(0, 300, w, 8);

  // Willow tree (left) with a nest only the right panel has.
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(96, 180, 22, 130);
  ctx.fillStyle = '#3f7d44';
  circle(ctx, 107, 160, 78); ctx.fill();
  circle(ctx, 55, 195, 48); ctx.fill();
  circle(ctx, 165, 195, 48); ctx.fill();
  ctx.fillStyle = '#57a05a';
  circle(ctx, 107, 130, 46); ctx.fill();
  ctx.strokeStyle = '#57a05a';
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(50 + i * 26, 210);
    ctx.quadraticCurveTo(55 + i * 26, 260, 48 + i * 26, 292);
    ctx.stroke();
  }
  if (changed.has('nest')) {
    ctx.fillStyle = '#8b5a2b';
    ctx.beginPath(); ctx.ellipse(150, 148, 22, 9, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#7ec8f7';
    circle(ctx, 144, 142, 5); ctx.fill();
    circle(ctx, 156, 142, 5); ctx.fill();
  }

  // Flower beds.
  ctx.fillStyle = '#8a5a3b';
  ctx.beginPath(); ctx.ellipse(300, 470, 190, 34, 0, 0, Math.PI * 2); ctx.fill();
  const tulipColor = changed.has('flower') ? '#59c2ff' : '#ff5d5d';
  flower(ctx, 170, 440, tulipColor);
  flower(ctx, 205, 452, '#ff9f43');
  flower(ctx, 240, 438, '#ff5d5d');
  flower(ctx, 280, 452, '#c77dff');
  flower(ctx, 320, 440, '#ff9f43');
  flower(ctx, 355, 452, '#ff5d5d');
  flower(ctx, 390, 442, '#c77dff');
  flower(ctx, 425, 452, '#ff9f43');
  butterfly(ctx, 250, 400, 1, '#ff7ad9');
  if (changed.has('butterfly')) butterfly(ctx, 420, 300, 1.1, '#59c2ff'); // extra butterfly

  // Pond (bottom right) with lily pads, a fish, and a bridge.
  ctx.fillStyle = '#3d9bd6';
  ctx.beginPath(); ctx.ellipse(480, 490, 120, 55, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#57b6e8';
  ctx.beginPath(); ctx.ellipse(470, 482, 90, 38, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3f9d4e';
  circle(ctx, 430, 500, 14); ctx.fill();
  if (!changed.has('lily')) { circle(ctx, 520, 508, 14); ctx.fill(); } // lily pad gone
  circle(ctx, 490, 522, 11); ctx.fill();
  ctx.fillStyle = '#ff9f43';
  circle(ctx, 452, 492, 4); ctx.fill();
  circle(ctx, 470, 500, 3); ctx.fill();
  if (changed.has('fish')) {
    // A fish leaping out of the pond.
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath(); ctx.ellipse(480, 448, 18, 9, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(494, 442); ctx.lineTo(506, 436); ctx.lineTo(504, 450); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    circle(ctx, 470, 444, 2.5); ctx.fill();
  }
  // Arched bridge over the pond.
  ctx.fillStyle = '#a4713b';
  ctx.beginPath();
  ctx.moveTo(380, 520);
  ctx.quadraticCurveTo(480, 420, 580, 520);
  ctx.lineTo(580, 540);
  ctx.quadraticCurveTo(480, 448, 380, 540);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#7a4a22';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const t = i / 4;
    const x = 400 + t * 160;
    const y = 512 - Math.sin(t * Math.PI) * 46;
    ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x, y); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(396, 496); ctx.quadraticCurveTo(480, 420, 564, 496); ctx.stroke();

  // Bench — gone in the right panel.
  if (!changed.has('bench')) {
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(280, 330, 90, 10);
    ctx.fillRect(280, 352, 90, 8);
    ctx.fillRect(288, 340, 8, 40);
    ctx.fillRect(354, 340, 8, 40);
    ctx.fillRect(280, 306, 8, 26);
    ctx.fillRect(362, 306, 8, 26);
    ctx.fillRect(280, 306, 90, 8);
  }

  // Stepping stones across the lawn — one missing on the right.
  ctx.fillStyle = '#d9d3c3';
  const stones = [[180, 520], [215, 532], [250, 522], [285, 534]];
  stones.forEach(([x, y], i) => {
    if (changed.has('stone') && i === 2) return;
    ctx.beginPath(); ctx.ellipse(x, y, 16, 7, 0, 0, Math.PI * 2); ctx.fill();
  });

  // Low fence on the right edge — one post missing on the right.
  ctx.fillStyle = '#f5ead6';
  ctx.fillRect(556, 340, 8, 90);
  if (!changed.has('fence')) { ctx.fillRect(584, 340, 8, 90); }
  ctx.fillRect(540, 352, 60, 6);
  ctx.fillRect(540, 382, 60, 6);
}

// ---------------------------------------------------------------------------
// Level 3 — Pelabuhan Pagi (Morning Harbor)
// ---------------------------------------------------------------------------
export function drawHarbor(ctx, w, h, changed) {
  sky(ctx, w, h, '#aee3f5', '#fff3c4');
  ctx.fillStyle = '#ffe66d';
  circle(ctx, 500, 90, 28); ctx.fill();
  cloud(ctx, 120, 70, 1);
  cloud(ctx, 320, 50, 0.8);
  bird(ctx, 450, 90);
  if (changed.has('gull')) bird(ctx, 380, 120, 0.9); // one extra gull
  bird(ctx, 200, 110, 0.8);

  // Sea.
  ctx.fillStyle = '#2f7fb8';
  ctx.fillRect(0, 330, w, h - 330);
  ctx.fillStyle = '#57a8d8';
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 100, 360 + (i % 2) * 40);
    ctx.quadraticCurveTo(45 + i * 100, 350 + (i % 2) * 40, 70 + i * 100, 360 + (i % 2) * 40);
    ctx.strokeStyle = '#bfe6f7';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Lighthouse (left) with a lamp that is dark on the right.
  ctx.fillStyle = '#f5ead6';
  ctx.beginPath();
  ctx.moveTo(56, 330); ctx.lineTo(68, 140); ctx.lineTo(104, 140); ctx.lineTo(116, 330); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e63946';
  ctx.fillRect(60, 290, 52, 18);
  ctx.fillRect(64, 220, 44, 18);
  ctx.fillStyle = '#2b2135';
  ctx.fillRect(62, 118, 48, 24);
  ctx.fillStyle = changed.has('light') ? '#3a3a3a' : '#ffe66d';
  ctx.fillRect(70, 122, 32, 16);
  ctx.beginPath(); ctx.moveTo(58, 118); ctx.lineTo(86, 100); ctx.lineTo(114, 118); ctx.closePath();
  ctx.fillStyle = '#e63946'; ctx.fill();
  if (!changed.has('light')) {
    ctx.fillStyle = 'rgba(255,230,109,0.25)';
    ctx.beginPath(); ctx.moveTo(102, 130); ctx.lineTo(190, 108); ctx.lineTo(190, 152); ctx.closePath(); ctx.fill();
  }

  // Fisherman's hut with a window and a chimney.
  ctx.fillStyle = '#b5651d';
  ctx.fillRect(150, 300, 90, 60);
  ctx.beginPath(); ctx.moveTo(140, 300); ctx.lineTo(195, 268); ctx.lineTo(250, 300); ctx.closePath();
  ctx.fillStyle = '#8b4513'; ctx.fill();
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(222, 268, 12, 30);
  if (changed.has('smoke')) {
    ctx.fillStyle = '#e8e8e8';
    circle(ctx, 228, 252, 8); ctx.fill();
    circle(ctx, 222, 238, 10); ctx.fill();
    circle(ctx, 230, 222, 7); ctx.fill();
  }
  ctx.fillStyle = changed.has('hutwindow') ? '#3a3a3a' : '#ffe66d';
  ctx.fillRect(168, 316, 22, 22);
  ctx.fillStyle = '#5a3d31';
  ctx.fillRect(206, 316, 20, 44);

  // Boats on the sea.
  // Small boat (left).
  ctx.fillStyle = '#8b5a2b';
  ctx.beginPath(); ctx.moveTo(180, 420); ctx.lineTo(260, 420); ctx.lineTo(240, 446); ctx.lineTo(200, 446); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5a3d31';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(220, 420); ctx.lineTo(220, 360); ctx.stroke();
  ctx.fillStyle = '#f5ead6';
  ctx.beginPath(); ctx.moveTo(220, 362); ctx.lineTo(220, 414); ctx.lineTo(254, 414); ctx.closePath(); ctx.fill();
  // Middle boat with a sail that changes colour, and a flag that changes too.
  ctx.fillStyle = '#6b3fa0';
  ctx.beginPath(); ctx.moveTo(300, 400); ctx.lineTo(400, 400); ctx.lineTo(372, 434); ctx.lineTo(326, 434); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3a2f52';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(350, 400); ctx.lineTo(350, 316); ctx.stroke();
  ctx.fillStyle = changed.has('sail') ? '#e63946' : '#f5ead6';
  ctx.beginPath(); ctx.moveTo(350, 320); ctx.lineTo(350, 396); ctx.lineTo(392, 396); ctx.closePath(); ctx.fill();
  ctx.fillStyle = changed.has('flag') ? '#59c2ff' : '#ff5d5d';
  ctx.beginPath(); ctx.moveTo(350, 316); ctx.lineTo(374, 322); ctx.lineTo(350, 330); ctx.closePath(); ctx.fill();
  // Dolphin leaping beside the middle boat — right panel only.
  if (changed.has('dolphin')) {
    ctx.fillStyle = '#7fb3d5';
    ctx.beginPath();
    ctx.moveTo(262, 452);
    ctx.quadraticCurveTo(280, 408, 306, 424);
    ctx.quadraticCurveTo(292, 440, 282, 452);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(306, 424); ctx.lineTo(316, 414); ctx.lineTo(314, 428); ctx.closePath(); ctx.fill();
  }

  // Wooden pier (bottom) with crates, a rope coil and a buoy.
  ctx.fillStyle = '#a4713b';
  ctx.fillRect(0, 480, w, 80);
  ctx.fillStyle = '#8b5a2b';
  for (let x = 0; x < w; x += 60) ctx.fillRect(x, 480, 4, 80);
  ctx.fillStyle = '#7d5a48';
  ctx.fillRect(0, 480, w, 6);
  // Crate stack — the top crate is missing on the right.
  ctx.fillStyle = '#c98f4a';
  ctx.fillRect(500, 516, 44, 44);
  ctx.fillRect(548, 516, 44, 44);
  if (!changed.has('crate')) { ctx.fillRect(524, 472, 44, 44); }
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 2;
  ctx.strokeRect(500, 516, 44, 44);
  ctx.strokeRect(548, 516, 44, 44);
  if (!changed.has('crate')) { ctx.strokeRect(524, 472, 44, 44); }
  // Rope coil — gone on the right.
  if (!changed.has('rope')) {
    ctx.strokeStyle = '#d9c9a8';
    ctx.lineWidth = 5;
    circle(ctx, 420, 528, 18); ctx.stroke();
    circle(ctx, 420, 528, 10); ctx.stroke();
  }
  // Buoy bobbing in the water — orange on the left, yellow on the right.
  ctx.fillStyle = changed.has('buoy') ? '#ffe66d' : '#ff8c42';
  ctx.beginPath(); ctx.ellipse(200, 462, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f5ead6';
  ctx.fillRect(192, 456, 16, 6);
  ctx.fillStyle = '#2b2135';
  ctx.fillRect(198, 438, 4, 10);
}
