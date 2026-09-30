// 2岁：看《芝麻街》学会认字和算数，还当起了五岁小朋友的“小老师”
(() => {
  const FL = 780, SIT_Y = 772;
  const TVX = 1370, TVY = 520;                 // TV cabinet centre
  const TERRY_X = 1100, GIRL_X = 545, DAD_X = 125, MOM_X = 372;
  // toy blocks: 2 + 3 = ?
  const BK = { x0: 625, S: 64, G: 10, D: 11, t0: 14.5, stag: 0.16, fall: 0.26, qT: 17.0, fiveT: 17.12, hiT: 17.85 };
  const bkX = i => BK.x0 + BK.S / 2 + i * (BK.S + BK.G);

  /* ---------- poses / faces / hair / sounds (a2_ prefix) ---------- */
  const SITB = { sit: 1, legScale: 1, thigh: 0.55, legL: [80, 8], legR: [80, 8], armL: [55, 30], armR: [55, 30] };
  const SITG = { sit: 1, legScale: 1, thigh: 0.5, legL: [78, 8], legR: [78, 8], armL: [30, 24], armR: [30, 24] };
  Object.assign(POSE, {
    a2_sitBaby: SITB,
    a2_babyPoint: { ...SITB, armL: [75, 8], armR: [55, 30], lean: -8, tilt: -6 },
    a2_babyCheer: { ...SITB, armL: [150, 16], armR: [150, 16] },
    a2_babyThumb: { ...SITB, armR: [110, -10], armL: [55, 30], lean: 3, tilt: -6 },
    a2_dadShock: { lean: -4, armL: [48, 70], armR: [48, 70] },
    a2_sitGirl: SITG,
    a2_girlScratch: { ...SITG, tilt: 8, ikR: { w: 1, to: 'head', dx: 0.72, dy: -0.72, bend: 'out' } },
    a2_girlCheer: { ...SITG, armL: [150, 14], armR: [150, 14] },
    a2_cheeks: { lean: -3, ikL: { w: 1, to: 'head', dx: -1.06, dy: 0.45, bend: 'down' }, ikR: { w: 1, to: 'head', dx: 1.06, dy: 0.45, bend: 'down' } },
    a2_ask: { armR: [40, 75], armL: [16, 10], lean: 2 },
  });
  Object.assign(FACE, {
    a2_proudGrin: { lidL: 0.3, lidR: 0.3, mouth: 'grin', mw: 0.44, brow: 'arc', browY: 0.02 },
  });
  // mom's bob: a rounded cap that stops at chin level, ends flicking in
  HAIR.a2_bob = () => {
    const cap = [[-1.02, 0.54], [-1.17, 0.44]];
    for (let i = 0; i <= 12; i++) { const a = (170 + i * 200 / 12) * RAD, r = 1.16 + (i % 2 ? 0.05 : 0); cap.push([Math.cos(a) * r, Math.sin(a) * r]); }
    cap.push([1.17, 0.44], [1.02, 0.54]);
    return [cap, [[-0.55, -0.9], [-0.9, -0.42], [-0.98, 0.25]], [[0.58, -0.92], [0.93, -0.45], [1.0, 0.25]]];
  };
  SFX.define('a2_static', (tone, noise) => { noise('highpass', 3200, 0.7, 0.18, 0.07); tone('sine', 1500, 900, 0.1, 0.05); });
  SFX.define('a2_block', (tone, noise) => { tone('sine', 240, 95, 0.11, 0.34); noise('lowpass', 900, 0.8, 0.05, 0.12); });
  SFX.define('a2_clap', (tone, noise) => { noise('bandpass', 1500, 0.9, 0.06, 0.28); });
  SFX.define('a2_twinkle', tone => { [1568, 2093, 2637, 3136].forEach((f, i) => tone('sine', f, f * 1.01, 0.18, 0.07, null, i * 0.07)); });

  /* ---------- Terry's little routines (pure functions of t) ---------- */
  // screen programme: tokens hop in one by one
  const SHOWS = [
    { t0: 3.25, t1: 6.4, toks: ['A', 'B', 'C'] },
    { t0: 6.55, t1: 9.4, toks: ['1', '2', '3'] },
    { t0: 9.55, t1: 24.3, toks: ['2', '+', '3'] },
  ];
  const HOPS = SHOWS.flatMap(s => s.toks.map((_, i) => s.t0 + 0.25 + i * 0.55));
  const readAlong = t => (HOPS.some(h => t >= h && t < h + 0.32) && t < 11 ? { mouth: 'o', eyeSY: 1.06, brow: 'arc', browY: 0.02 } : { mouth: 'smile', mw: 0.34 });
  const watchBob = t => ({ ...SITB, lean: 2, tilt: 4 * Math.sin((t - 3.3) * 2 * Math.PI * 1.1) });
  const CLAP = { t0: 10.0, t1: 11.3, hz: 2.5 };
  const clap = t => { const c = Math.cos((t - CLAP.t0) * 2 * Math.PI * CLAP.hz); return { ...SITB, armL: [60, -100 - 20 * c], armR: [60, -100 - 20 * c] }; };
  const tap = t => ({ ...POSE.a2_babyPoint, armL: [75 + 8 * Math.max(0, Math.sin((t - 16.2) * 2 * Math.PI * 2.2)), 8] });

  /* ---------- set: a rug ---------- */
  SETDRAW.a2_rug = (s, p) => {
    const z = Z.set + 1;
    stroke('a2rug.o', ringPts('a2rug.o', s.x, s.y, s.rx, s.ry, { n: 16, closed: true, rv: 0.01 }), { z, w: 4, closed: true, fill: C.paper, draw: stag(p, 0, 2) });
    stroke('a2rug.i', ringPts('a2rug.i', s.x, s.y, s.rx - 40, s.ry - 6, { n: 16, a0: 60, sweep: 350, rv: 0.01 }), { z, w: 2.4, color: C.pencil, draw: stag(p, 1, 2) });
    [-1, 1].forEach(sd => {
      for (let i = 0; i < 4; i++) {
        const y = s.y - s.ry * 0.6 + i * s.ry * 0.4, x = s.x + sd * s.rx * Math.sqrt(Math.max(0, 1 - ((y - s.y) / s.ry) ** 2));
        stroke(`a2rug.f${sd}${i}`, [[x, y], [x + sd * 16, y + 2]], { z, w: 2.6, draw: stag(p, 1, 2) });
      }
    });
  };

  // a wall clock whose hands really move, and a framed doodle (sun over hills)
  SETDRAW.a2_clock = (s, p, lt) => {
    const { x, y, r } = s, z = Z.set;
    stroke('a2clk.o', ringPts('a2clk.o', x, y, r, r, { n: 12, a0: -110, sweep: 372, rv: 0.03 }), { z, w: 5, draw: stag(p, 0, 2) });
    if (p < 0.6) return;
    [0, 3, 6, 9].forEach(i => { const a = i * 30 * RAD; stroke('a2clk.m' + i, [[x + Math.sin(a) * r * 0.72, y - Math.cos(a) * r * 0.72], [x + Math.sin(a) * r * 0.86, y - Math.cos(a) * r * 0.86]], { z, w: 3 }); });
    const am = (lt * 4) * RAD, ah = (300 + lt * 0.7) * RAD;
    stroke('a2clk.hm', [[x, y], [x + Math.sin(am) * r * 0.7, y - Math.cos(am) * r * 0.7]], { z, w: 3.5 });
    stroke('a2clk.hh', [[x, y], [x + Math.sin(ah) * r * 0.45, y - Math.cos(ah) * r * 0.45]], { z, w: 4.5 });
    dot('a2clk.c', [x, y], 4, C.ink, z);
  };
  SETDRAW.a2_frame = (s, p) => {
    const { x, y, w, h } = s, z = Z.set, L = x - w / 2, R = x + w / 2, T = y - h / 2, B = y + h / 2;
    stroke('a2frm.o', [[L, T], [R, T, 1], [R, B, 1], [L, B, 1], [L, T - 2, 1]], { z, w: 5, draw: stag(p, 0, 3) });
    stroke('a2frm.i', [[L + 12, T + 12], [R - 12, T + 12, 1], [R - 12, B - 12, 1], [L + 12, B - 12, 1], [L + 12, T + 10, 1]], { z, w: 2.5, draw: stag(p, 1, 3) });
    stroke('a2frm.hill', [[L + 14, B - 30], [x - 22, T + 52], [x + 10, B - 34], [x + 34, T + 60], [R - 14, B - 32]], { z, w: 3, draw: stag(p, 2, 3) });
    stroke('a2frm.sun', ringPts('a2frm.sun', R - 36, T + 34, 11, 11, { n: 8 }), { z, w: 3, draw: stag(p, 2, 3) });
    stroke('a2frm.nail', [[x - 30, T], [x, T - 30, 1], [x + 30, T]], { z, w: 2.2, color: C.pencil, draw: stag(p, 1, 3) });
  };

  /* ---------- props ---------- */
  // a 1970s TV set on legs with rabbit-ear antenna; the screen shows only letters and numbers
  PROPS.a2_tv = (fx, t, lt, p) => {
    const z = Z.chair, SX = -30, SW = 196, SH = 158;
    // one happy squash at the sparkle
    const sv = (t - 24.45) / 0.45, sp = sv > 0 && sv < 1 ? Math.sin(Math.PI * sv) : 0;
    DL.save(); DL.translate(0, 260); DL.scale(1 + 0.05 * sp, 1 - 0.04 * sp); DL.translate(0, -260);
    stroke('a2tv.cab', superPts(0, 0, 290, 210, 24, 6), { z, w: 6, closed: true, fill: C.paper, draw: stag(p, 0, 5) });
    stroke('a2tv.scr', superPts(SX, 0, SW, SH, 24, 3.2), { z: z + 1, w: 5, closed: true, fill: C.paper, draw: stag(p, 1, 5) });
    [[-52, 'k1'], [-8, 'k2']].forEach(([y, k], i) => {
      stroke('a2tv.' + k, ringPts('a2tv.' + k, 112, y, 15, 15, { n: 9, closed: true }), { z: z + 1, w: 4, closed: true, fill: C.paper, draw: stag(p, 2, 5) });
      stroke('a2tv.' + k + 't', [[112, y], [112 + (i ? 8 : -6), y - 10]], { z: z + 1, w: 3, draw: stag(p, 2, 5) });
    });
    for (let i = 0; i < 4; i++) stroke('a2tv.g' + i, [[98, 34 + i * 14], [126, 34 + i * 14]], { z: z + 1, w: 3, draw: stag(p, 3, 5) });
    stroke('a2tv.legL', [[-108, 104], [-128, 260]], { z, w: 5.5, draw: stag(p, 3, 5) });
    stroke('a2tv.legR', [[108, 104], [128, 260]], { z, w: 5.5, draw: stag(p, 3, 5) });
    stroke('a2tv.dome', [[-24, -104], [-17, -117], [0, -122], [17, -117], [24, -104]], { z, w: 5, fill: C.paper, draw: stag(p, 4, 5) });
    stroke('a2tv.earL', [[-6, -118], [-74, -226]], { z, w: 4, draw: stag(p, 4, 5) });
    stroke('a2tv.earR', [[6, -118], [82, -234]], { z, w: 4, draw: stag(p, 4, 5) });
    if (p > 0.95) { dot('a2tv.tipL', [-74, -226], 7, C.ink, z); dot('a2tv.tipR', [82, -234], 7, C.ink, z); }
    stroke('a2tv.gl1', [[SX + 52, -58], [SX + 72, -44]], { z: z + 2, w: 2.4, color: C.pencil, draw: stag(p, 2, 5) });
    stroke('a2tv.gl2', [[SX + 62, -64], [SX + 82, -50]], { z: z + 2, w: 2.4, color: C.pencil, draw: stag(p, 2, 5) });
    if (p > 0.8) shadow('a2tv.sh', 0, 264, 300, 1);
    // --- screen ---
    const zc = z + 3;
    if (t >= 3.0 && t < 3.25) { // CRT switch-on: a line that opens up
      const u = EASE.out(clamp((t - 3.0) / 0.25));
      stroke('a2tv.on', [[SX - 80 * u, 0], [SX + 80 * u, 0]], { z: zc, w: 5, boil: 0.4 });
    }
    [6.4, 9.4, 24.3].forEach((f, k) => { // channel-change flicker
      if (t < f || t >= f + 0.15) return;
      for (let i = 0; i < 4; i++) { const y = -52 + i * 34 + rnd(hstr('a2fl' + k), i, BOIL.frame) * 8; stroke(`a2tv.fl${k}.${i}`, [[SX - 78, y], [SX + 78, y + 3]], { z: zc, w: 3, boil: 1.5 }); }
    });
    const show = SHOWS.find(s => t >= s.t0 && t < s.t1);
    if (show) show.toks.forEach((tk, i) => {
      const a = show.t0 + 0.25 + i * 0.55, v = t - a; if (v < 0) return;
      const pp = EASE.back(clamp(v / 0.2)), hop = v < 0.3 ? -14 * Math.sin(Math.PI * v / 0.3) : 0;
      text('a2tv.tk' + i, tk, SX + (i - 1) * 54, 2 + hop, { size: 70, font: CFG.FONT_MIX, color: C.ink, z: zc, scale: lerp(0.3, 1, pp) });
    });
    if (t >= 24.45) { // finale: both things he learned
      const v = t - 24.45, pp = EASE.back(clamp(v / 0.25));
      text('a2tv.fa', 'A B C', SX, -30, { size: 54, font: CFG.FONT_MIX, z: zc, scale: lerp(0.3, 1, pp) });
      text('a2tv.fb', '1 2 3', SX, 34, { size: 54, font: CFG.FONT_MIX, z: zc, scale: lerp(0.3, 1, EASE.back(clamp((v - 0.12) / 0.25))) });
    }
    DL.restore();
    // --- one glow / sparkle ---
    const g = t - 24.45;
    if (g > 0 && g < 1.6) {
      const out = EASE.out(clamp(g / 0.3)), op = 1 - clamp((g - 1.1) / 0.5);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + 0.2, c = Math.cos(a), s = Math.sin(a);
        const r0x = 172, r0y = 136;
        const p0 = [c * r0x, s * r0y - 10], p1 = [c * (r0x + 30 * out), s * (r0y + 30 * out) - 10];
        if (s > 0.75) continue; // no rays into the floor
        stroke('a2tv.ray' + i, [p0, p1], { z: Z.fx, w: 3.5, opacity: op, boil: 0.8 });
      }
      [[-176, -150, 1], [150, -180, 0.8], [178, 40, 0.9]].forEach(([x, y, k], i) => {
        const sc = k * EASE.back(clamp((g - 0.1 - i * 0.08) / 0.25)) * op; if (sc <= 0.01) return;
        stroke('a2tv.st' + i + 'a', [[x - 22 * sc, y], [x + 22 * sc, y]], { z: Z.fx, w: 4 });
        stroke('a2tv.st' + i + 'b', [[x, y - 22 * sc], [x, y + 22 * sc]], { z: Z.fx, w: 4 });
        stroke('a2tv.st' + i + 'c', [[x - 10 * sc, y - 10 * sc], [x + 10 * sc, y + 10 * sc]], { z: Z.fx, w: 2.5 });
        stroke('a2tv.st' + i + 'd', [[x - 10 * sc, y + 10 * sc], [x + 10 * sc, y - 10 * sc]], { z: Z.fx, w: 2.5 });
      });
    }
  };

  // one handwriting glyph, top-left at (x, y); draw 0..1 runs through its strokes in order
  const glyph = (key, ch, x, y, size, o = {}) => {
    const g = GLYPH[ch]; if (!g) return;
    const lens = g.s.map(s => polyLen(s.map(([u, v]) => [u, v]))), tot = lens.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    g.s.forEach((s, i) => {
      const d = o.draw === undefined ? 1 : clamp((o.draw * tot - acc) / lens[i]); acc += lens[i];
      if (d > 0) stroke(key + '.' + i, s.map(([u, v, c]) => [x + u * size, y + v * size, c]), { z: o.z, w: o.w || 6, color: o.color || C.ink, draw: d, boil: 0.55, opacity: o.opacity });
    });
  };

  // big toy blocks that fall in: 2 + 3 = ?  → the '?' hops off and a 5 is written
  PROPS.a2_blocks = (fx, t) => {
    const { S, D } = BK, z = Z.desk - 2, syms = ['2', '+', '3', '=', '?'];
    syms.forEach((ch, i) => {
      const tl = t - (BK.t0 + i * BK.stag); if (tl < 0) return;
      const u = clamp(tl / BK.fall);
      let yo = -330 * (1 - u * u), sy = 1;
      const v = (tl - BK.fall) / 0.22;
      if (v > 0 && v < 1) { yo = -14 * Math.sin(Math.PI * v); sy = 1 - 0.1 * Math.sin(Math.PI * Math.min(1, v * 2)); }
      const cx = bkX(i), by = FL;
      DL.save(); DL.translate(cx, by + yo); DL.scale(1 + (1 - sy) * 0.6, sy); DL.translate(-cx, -by);
      const L = cx - S / 2, R = cx + S / 2, T = by - S, k = 'a2bk' + i;
      stroke(k + '.top', [[L, T], [L + D, T - D, 1], [R + D, T - D, 1], [R, T, 1], [L, T, 1]], { z, w: 4.5, fill: C.paper });
      stroke(k + '.side', [[R, T], [R + D, T - D, 1], [R + D, by - D, 1], [R, by, 1], [R, T, 1]], { z, w: 4.5, fill: C.paper });
      stroke(k + '.front', [[L + 6, T], [R, T, 1], [R, by, 1], [L, by, 1], [L, T, 1], [L + 8, T - 1]], { z, w: 5, fill: C.paper });
      const gs = 48, gy = T + (S - gs) / 2 - 1;
      if (ch === '?') {
        const q = t - BK.qT;
        if (q < 0.35) {
          const qu = clamp(q / 0.35), gw = GLYPH['?'].w * gs;
          DL.save(); DL.translate(0, -80 * EASE.out(qu)); DL.about(cx, gy + gs / 2, () => DL.rotate(28 * qu));
          glyph(k + '.q', '?', cx - gw / 2, gy, gs, { z: z + 1.5, w: 5.5, opacity: 1 - qu });
          DL.restore();
        }
        const d = clamp((t - BK.fiveT) / 0.5);
        if (d > 0) glyph(k + '.five', '5', cx - GLYPH['5'].w * gs / 2, gy, gs, { z: z + 1.5, w: 6.5, draw: d });
      } else glyph(k + '.g', ch, cx - GLYPH[ch].w * gs / 2, gy, gs, { z: z + 1.5, w: 5.5 });
      DL.restore();
    });
    // the key idea: yellow highlighter across 2 + 3 = 5
    const hp = EASE.out(clamp((t - BK.hiT) / 0.3));
    if (hp > 0) {
      const x0 = BK.x0 - 16, x1 = lerp(x0, bkX(4) + S / 2 + 20, hp), y0 = FL - S + 12, y1 = FL - 10, n = 8, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); top.push([x, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([x, y1 + Math.sin(i * 2.3) * 4]); }
      stroke('a2bk.hi', top.concat(bot), { z: z + 1, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    }
  };

  defineScene({
    id: 'age2', chapter: '2岁 · 芝麻街', dur: 27.8, floor: FL,
    cast: {
      dad: { H: 440, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'part', glasses: true, blink: [4.1, 0.4] },
      mom: { H: 420, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'a2_bob', blink: [3.6, 2.2] },
      girl: { H: 215, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'ponytail', kid: true, blink: [3.8, 1.6] },
      terry: { H: 170, head: 0.56, torso: 0.24, leg: 0.28, arm: 0.46, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    order: ['dad', 'mom', 'girl', 'terry'],
    tracks: {
      terry: {
        enter: 2.0,
        pos: [[0, [TERRY_X, SIT_Y]]],
        pose: [[0, 'a2_sitBaby'], [3.3, watchBob, 0.2], [CLAP.t0, clap, 0.12], [11.5, 'a2_sitBaby', 0.2],
          [16.2, tap, 0.1, 'back'], [18.3, 'a2_babyCheer', 0.12, 'back'], [19.3, 'a2_sitBaby', 0.2], [24.1, 'a2_babyThumb', 0.1, 'back']],
        face: [[0, 'smile'], [3.26, 'surprised', 0.04], [3.5, readAlong, 0.05], [CLAP.t0, 'joy', 0.05], [11.5, 'grin', 0.05],
          [13.3, 'smile', 0.05], [16.2, 'grin', 0.05], [17.7, 'proud', 0.05], [18.3, 'joy', 0.05], [19.3, 'smile', 0.05],
          [21.0, 'neutral', 0.05], [24.1, 'a2_proudGrin', 0.05]],
        turn: [[0, 0.55], [13.2, -0.45, 0.2], [19.3, -0.55, 0.15]],
        gaze: [[0, 'screen'], [13.0, 'girl'], [14.5, 'blocks'], [16.2, 'qblock'], [17.8, 'girl'], [19.3, 'dad']],
        squash: [[0, 1], [3.26, 1.12, 0.05], [3.32, 1, 0.22, 'back'], [16.2, 1.1, 0.05], [16.26, 1, 0.2, 'back'],
          [18.3, 1.14, 0.06], [18.37, 1, 0.25, 'back'], [24.1, 1.14, 0.06], [24.17, 1, 0.25, 'back']],
      },
      girl: {
        pos: [[0, [-90, FL]], [12.6, [GIRL_X, FL], 1.4, 'lin'], [14.0, [GIRL_X, SIT_Y], 0.25]],
        pose: [[0, makeWalk(12.6, 14.0, 5.2)], [14.0, 'a2_sitGirl', 0.25], [15.4, 'a2_girlScratch', 0.15], [17.9, 'a2_sitGirl', 0.12],
          [18.4, 'a2_girlCheer', 0.1, 'back'], [19.6, 'a2_sitGirl', 0.2]],
        face: [[0, 'smile'], [15.3, 'puzzled', 0.05], [17.9, 'idea', 0.05], [18.4, 'joy', 0.05], [19.6, 'smile', 0.05]],
        turn: [[0, 0.5], [14.0, 0.4, 0.2], [19.5, -0.3, 0.2]],
        gaze: [[0, [800, 700]], [14.3, 'terry'], [14.6, 'blocks'], [15.3, 'qblock'], [16.3, 'terry'], [17.1, 'qblock'], [18.4, 'viewer'], [19.5, 'mom']],
        squash: [[0, 1], [14.22, 0.88, 0.05], [14.28, 1, 0.2, 'back'], [18.4, 1.12, 0.06], [18.46, 1, 0.25, 'back']],
      },
      dad: {
        enter: 18.8,
        pos: [[0, [DAD_X, FL]]],
        pose: [[0, 'stand'], [19.3, 'a2_dadShock', 0.08, 'back'], [21.0, 'a2_ask', 0.15], [24.3, 'stand', 0.25]],
        face: [[0, 'surprised'], [19.3, 'jaw', 0.06, 'back'], [20.9, 'surprised', 0.1], [24.8, 'smile', 0.1]],
        turn: [[0, 0.45]],
        gaze: [[0, 'terry']],
        squash: [[0, 1], [19.3, 1.08, 0.06], [19.37, 1, 0.25, 'back']],
      },
      mom: {
        enter: 18.9,
        pos: [[0, [MOM_X, FL]]],
        pose: [[0, 'stand'], [19.35, 'a2_cheeks', 0.08, 'back'], [24.8, 'stand', 0.25]],
        face: [[0, 'surprised'], [19.35, 'jaw', 0.06, 'back'], [24.8, 'joy', 0.1]],
        turn: [[0, 0.5]],
        gaze: [[0, 'terry']],
        squash: [[0, 1], [19.35, 1.08, 0.06], [19.42, 1, 0.25, 'back']],
      },
    },
    targets: () => ({ screen: [TVX - 30, TVY], blocks: [805, 745], qblock: [bkX(4), 740] }),
    set: [
      { type: 'floor', t0: 1.4 },
      { type: 'a2_rug', x: 820, y: 784, rx: 400, ry: 20, t0: 1.5 },
      { type: 'a2_clock', x: 760, y: 190, r: 48, t0: 1.6 },
      { type: 'a2_frame', x: 1060, y: 170, w: 150, h: 110, t0: 1.65 },
      { type: 'door', x: 250, w: 420, top: 280, t0: 1.55 },
    ],
    fx: [
      { type: 'ageStamp', age: 2, place: '澳大利亚·阿德莱德', t0: 0, center: [800, 360], R: 150, dockT: 1.32, dock: [1486, 108], dockScale: 0.46, pulse: [15.25] },
      { type: 'prop', kind: 'a2_tv', id: 'tv', t0: 1.6, at: [TVX, TVY], drawDur: 0.5 },
      { type: 'label', id: 'lbName', text: '陶哲轩，2岁', at: [950, 540], rot: -3, t0: 2.4, t1: 5.6, target: { char: 'terry', part: 'headTop' }, bend: -0.25 },
      { type: 'label', id: 'lbTV', text: '电视节目《芝麻街》', at: [1100, 330], rot: -2, t0: 6.0, t1: 9.4, target: [TVX - 118, TVY - 72], bend: 0.2 },
      // he learned it himself
      { type: 'thought', id: 'th', at: [930, 440], rx: 150, ry: 80, t0: 10.2, t1: 12.8, from: { char: 'terry', part: 'headTop' } },
      { type: 'title', id: 'thA', text: 'A B C', x: 930, y: 412, size: 54, font: CFG.FONT_MIX, t0: 10.4, t1: 12.8, z: Z.fx + 1 },
      { type: 'title', id: 'th1', text: '1 2 3', x: 930, y: 470, size: 54, font: CFG.FONT_MIX, t0: 10.6, t1: 12.8, z: Z.fx + 1 },
      // the lesson
      { type: 'prop', kind: 'a2_blocks', id: 'blocks', t0: BK.t0, at: [0, 0], drawDur: 0 },
      { type: 'label', id: 'lbTeach', text: '小老师（2岁）', at: [1110, 520], rot: 3, t0: 15.2, t1: 18.4, target: { char: 'terry', part: 'headTop' }, bend: 0.25 },
      { type: 'label', id: 'lbKid', text: '学生（5岁）', at: [660, 500], rot: -3, t0: 15.45, t1: 18.4, target: { char: 'girl', part: 'headTop', dx: 10 }, bend: -0.25 },
      { type: 'mark', id: 'q', char: '?', on: ['girl'], t0: 15.5, t1: 17.0, dx: -34 },
      // parents
      { type: 'label', id: 'lbJaw', text: '下巴（掉了）', at: [700, 420], rot: -3, t0: 19.6, t1: 21.6, target: { char: 'mom', part: 'jaw', dx: 14 }, bend: 0.2, gap: 12 },
      { type: 'speech', id: 'ask', text: '你怎么会的？', at: [400, 196], tail: [-150, 46], speaker: 'dad', t0: 21.0, t1: 23.9, rot: -3 },
      { type: 'speech', id: 'ans', text: '《芝麻街》教的！', at: [860, 460], tail: [200, 44], speaker: 'terry', t0: 24.1, t1: 27.7, rot: -4, size: 80 },
    ],
    sfx: [[2.0, 'hop'], [3.0, 'a2_static'], [6.4, 'a2_static'], [9.4, 'a2_static'],
      ...HOPS.map(h => [h, 'plip']),
      ...[0, 1, 2, 3].map(i => [CLAP.t0 + i / CLAP.hz, 'a2_clap']),
      ...[0, 1, 2, 3, 4].map(i => [BK.t0 + i * BK.stag + BK.fall, 'a2_block']),
      [14.22, 'thud'], [16.2, 'boop'], [BK.qT, 'whip'], [BK.fiveT, 'pen'], [BK.fiveT + 0.25, 'pen'], [BK.fiveT + 0.5, 'ding'], [BK.hiT, 'swish'],
      [18.3, 'hop'], [18.8, 'plip'], [18.9, 'plip'], [19.3, 'boing'], [24.1, 'hop'], [24.3, 'a2_static'], [24.45, 'a2_twinkle']],
    steps: [{ t0: 12.6, t1: 14.0, hz: 5.2 }],
    subs: [
      { t0: 0.2, t1: 4.6, text: '陶哲轩出生在澳大利亚的阿德莱德。' },
      { t0: 4.7, t1: 9.6, text: '两岁时，他天天看电视节目《芝麻街》，' },
      { t0: 9.7, t1: 12.9, text: '自己学会了认字和算数。' },
      { t0: 13.2, t1: 16.5, text: '有一天，爸爸妈妈发现：' },
      { t0: 16.6, t1: 20.3, text: '他在教五岁的小朋友做加法！' },
      { t0: 20.8, t1: 24.0, text: '问他怎么学会的，他说：' },
      { t0: 24.1, t1: 27.1, text: '“《芝麻街》教的！”', voice: 'kid' },
    ],
  });
})();
