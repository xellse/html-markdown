// 第 20 场 · 1987 哈瓦那（b5_）
// 事实（ep5-script.md）：1987 年 IMO 在古巴哈瓦那，考试 7 月 10、11 日；他 11 岁（7 月 17 日满 12 岁）。
//   六题得分 7、7、7、7、7、5，共 40 分，银牌；满分 42（6 题 × 7 分）；那年 22 人满分，金牌线就是 42。
// 演绎：海边、棕榈树、太阳只是“哈瓦那”的简笔画；22 个举着“42”的小人代表 22 位满分选手（不指名）。
//   他拿银牌时怎么想没有记录：这里只演开心（smile → grin → joy），不演失落。
// 开头：第 15 场停靠着的“12 岁”先缩走，“11 岁 · 哈瓦那”在中央盖下再停靠。
// 结尾：只留下成绩单（E5.SHEET，7、7、7、7、7、5，“= 40”，第 6 格红圈）和印章，第 25 场第一帧一模一样（同一个 id 'b5.sheet'）。
(() => {
  const FL = 780, SH = E5.SHEET, CELL = SH.cell, SID = 'b5.sheet', TX = 420, MX = 800;
  if (E5.S87.join() !== '7,7,7,7,7,5' || E5.S87.reduce((a, b) => a + b, 0) !== 40 || 6 * 7 !== 42 || 42 - 40 !== 2) console.error('b5_havana: score maths');
  /** centre of score cell i (same maths as e5_scores) */
  const cellX = i => SH.at[0] - (6 * CELL + 26) / 2 + i * CELL + (i >= 3 ? 26 : 0) + CELL / 2;
  const TOT_X = cellX(5) + CELL / 2 + 34, TS = CELL * 0.62;              // left end and size of the written "= 40"
  const X40 = TOT_X + (0.62 + 0.1 + 0.24 + 0.1) * TS, X40E = TOT_X + 2.38 * TS;   // where its "40" starts / ends

  /* ---------------- times (scene clock; subtitles as in the script) ---------------- */
  const T = {
    Y87: 0.35, YM: 1.1, BEACH: 1.45, CUBA: 2.0, CUBA_OUT: 4.1,
    OLD_OUT: 4.1, STAMP: 4.4, DOCK: 5.75,
    WALK0: 4.6, WALK1: 5.7, CAL: 6.2, CAKE: 6.45, LB12: 6.95, A_OUT: 8.65,
    SHEET: 9.15, W7: [10.55, 11.35, 12.11, 12.8, 13.48], W5: 15.95, TOT: 17.85, FULL: 19.15, GAP: 20.45, RING: 20.95, GAP_OUT: 22.75,
    CROWD: 23.15, LB22: 24.6, LINE: 27.6, LBLINE: 27.95, C_OUT: 30.45,
    MOVE0: 30.95, MOVE1: 31.7, MEDAL: 32.6, LBS: 32.95, END: 35.0, DUR: 35.6,
  };

  /* ---------------- helpers ---------------- */
  const fadeFrom = (n0, op) => { if (op >= 0.999) return; for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * op).toFixed(3); } };
  /** wraps any fx and fades it out over [f0, f0 + fd] */
  COMP.b5_hFade = {
    init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k <= 0) return;
      const n0 = DL.items.length;
      COMP[fx.inner.type].draw(fx.inner, t, F);
      fadeFrom(n0, k);
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };
  /** the previous scene's docked stamp (12 岁): stays, then shrinks away into its corner */
  COMP.b5_hOldStamp = {
    draw(fx, t, F) {
      const u = clamp((t - fx.out) / 0.22); if (u >= 1) return;
      const d = fx.inner.dock, s = Math.max(0.01, 1 - EASE.in(u));
      DL.save(); DL.translate(d[0], d[1]); DL.scale(s); DL.translate(-d[0], -d[1]);
      COMP.ageStamp.draw(fx.inner, t, F);
      DL.restore();
    },
    cues: fx => [[fx.out, 'whoosh']],
  };
  /** a pencil floor that draws on and fades out at the end (the next scene has no floor) */
  COMP.b5_hFloor = {
    draw(fx, t) {
      const op = 1 - clamp((t - fx.out) / 0.4); if (t < fx.t0 || op <= 0) return;
      stroke('b5h.floor', [[20, FL], [800, FL + 2], [1580, FL - 1]], { z: Z.set, w: 2.2, color: C.pencil, opacity: 0.8 * op, draw: EASE.out(clamp((t - fx.t0) / 0.4)) });
    },
  };

  /* ---------------- 1987，古巴，哈瓦那：海、太阳、两棵棕榈树 ---------------- */
  const SUN = [1240, 205];
  const WAVES = [[658, [300, 540, 780, 1020, 1250]], [694, [410, 650, 890, 1130, 1330]], [730, [250, 520, 800, 1060, 1290]]];
  const FRONDS = [[-150, 38], [-108, 100], [-56, -66], [62, -70], [112, 96], [152, 32]];
  function palm(k, bx, by, tx, ty, p, z, t) {
    const sgn = tx > bx ? 1 : -1, top = [tx + Math.sin(t * 1.3 + bx) * 3, ty];
    const ctl = [(bx + tx) / 2 - sgn * 24, (by + ty) / 2];
    const P = u => [(1 - u) * (1 - u) * bx + 2 * (1 - u) * u * ctl[0] + u * u * top[0], (1 - u) * (1 - u) * by + 2 * (1 - u) * u * ctl[1] + u * u * top[1]];
    const L = [], R = [];
    for (let i = 0; i <= 6; i++) { const u = i / 6, q = P(u), hw = lerp(13, 7, u); L.push([q[0] - hw, q[1]]); R.push([q[0] + hw, q[1]]); }
    stroke(k + '.fill', L.concat(R.slice().reverse()), { z: z - 0.05, closed: true, fill: C.paper, noStroke: true, w: 1, draw: stag(p, 0, 4) });
    stroke(k + '.tL', L, { z, w: 5, draw: stag(p, 0, 4) });
    stroke(k + '.tR', R, { z, w: 5, draw: stag(p, 0, 4) });
    for (let i = 1; i <= 5; i++) { const u = i / 6.3, q = P(u), hw = lerp(13, 7, u); stroke(k + '.rg' + i, [[q[0] - hw + 2, q[1] - 3], [q[0] + hw - 2, q[1] + 3]], { z, w: 2.6, draw: stag(p, 1, 4) }); }
    FRONDS.forEach(([dx, dy], i) => {
      const tip = [top[0] + dx, top[1] + dy], len = Math.hypot(dx, dy), n = [-dy / len, dx / len];
      const mid = [top[0] + dx * 0.5, top[1] + dy * 0.5 - Math.abs(dx) * 0.2];
      const a = [mid[0] + n[0] * 17, mid[1] + n[1] * 17], b = [mid[0] - n[0] * 17, mid[1] - n[1] * 17];
      stroke(k + '.f' + i, [[top[0], top[1], 1], a, [tip[0], tip[1], 1], b, [top[0], top[1], 1]], { z: z + 0.2, w: 4.5, fill: C.paper, draw: stag(p, 2, 4) });
      stroke(k + '.v' + i, [top, mid, [top[0] + dx * 0.88, top[1] + dy * 0.88]], { z: z + 0.25, w: 2.2, draw: stag(p, 3, 4), boil: 0.6 });
    });
    if (p > 0.85) [[-12, 16], [11, 18], [0, 30]].forEach(([dx, dy], i) => dot(k + '.c' + i, [top[0] + dx, top[1] + dy], 9, C.ink, z + 0.3));
  }
  COMP.b5_hBeach = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.out + 0.3) return;
      const n0 = DL.items.length, p = EASE.out(clamp((t - fx.t0) / 0.7)), z = Z.set, k = 'b5h.bch';
      stroke(k + '.hz', [[20, 622], [800, 624], [1580, 620]], { z, w: 2.2, color: C.pencil, opacity: 0.8, draw: stag(p, 0, 4) });
      WAVES.forEach(([y, xs], r) => xs.forEach((x0, i) => {
        const x = x0 + 9 * Math.sin(t * 1.1 + r * 1.7 + i);
        stroke(`${k}.wv${r}_${i}`, [[x, y], [x + 17, y - 8], [x + 35, y], [x + 52, y + 8], [x + 70, y]], { z, w: 3, draw: stag(p, 1 + (r % 2), 4), boil: 0.7 });
      }));
      stroke(k + '.sun', ringPts(k + '.sun', SUN[0], SUN[1], 46, 46, { n: 14, a0: -110, sweep: 372, rv: 0.03 }), { z, w: 5, draw: stag(p, 1, 4) });
      for (let i = 0; i < 10; i++) {
        const a = (i * 36 + t * 9) * RAD;
        stroke(k + '.ray' + i, [[SUN[0] + Math.cos(a) * 62, SUN[1] + Math.sin(a) * 62], [SUN[0] + Math.cos(a) * 84, SUN[1] + Math.sin(a) * 84]], { z, w: 4, draw: stag(p, 2, 4) });
      }
      palm(k + '.pL', 170, 778, 214, 382, p, z + 1, t);
      palm(k + '.pR', 1440, 778, 1396, 402, p, z + 1, t);
      fadeFrom(n0, 1 - clamp((t - fx.out) / 0.3));
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  /* ---------------- 小日历：7 月 17 日，画一个小蛋糕 ---------------- */
  const CAL = { c: [1090, 445], w: 172, h: 230 };
  const CAL17 = layoutWriting({ text: '17', x: CAL.c[0] - 6, y: 384, size: 76, t0: T.CAL + 0.25, speed: 2400, anchor: 'middle' });
  COMP.b5_hCal = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.out + 0.3) return;
      const n0 = DL.items.length, { c, w, h } = CAL, z = Z.set + 2, k = 'b5h.cal';
      const pop = Math.max(0.01, EASE.back(clamp((t - fx.t0) / 0.3)));
      DL.save(); DL.translate(c[0], c[1]); DL.scale(pop); DL.rotate(3); DL.translate(-c[0], -c[1]);
      const x0 = c[0] - w / 2, y0 = c[1] - h / 2;
      stroke(k, [[x0, y0], [x0 + w, y0, 1], [x0 + w, y0 + h, 1], [x0, y0 + h, 1], [x0, y0, 1]], { z, w: 4.5, fill: C.paper });
      stroke(k + '.hd', [[x0 + 6, y0 + 44], [x0 + w - 6, y0 + 45]], { z: z + 0.1, w: 3.5, color: C.red });
      [-1, 1].forEach(s => stroke(k + '.ring' + s, ringPts(k + '.ring' + s, c[0] + s * 42, y0, 7, 11, { n: 8, a0: 180, sweep: 300 }), { z: z + 0.2, w: 3 }));
      text(k + '.m', '7 月', c[0], y0 + 23, { size: 36, color: C.red, z: z + 0.2 });
      CAL17.strokes.forEach((st, j) => { const q = clamp((t - st.t0) / st.dur); if (q > 0) stroke(k + '.d' + j, st.pts, { z: z + 0.2, w: 6.5, draw: q, boil: 0.55 }); });
      if (t > T.CAL + 0.5) text(k + '.r', '日', c[0] + 62, 440, { size: 36, z: z + 0.2, opacity: clamp((t - T.CAL - 0.5) / 0.15) });
      // the cake: plate, two tiers, a candle with a flickering flame
      const q = EASE.out(clamp((t - T.CAKE) / 0.4));
      if (q > 0) {
        const cx = c[0], zc = z + 0.3;
        stroke(k + '.plate', [[cx - 52, 549], [cx + 52, 548]], { z: zc, w: 3.5, draw: q });
        stroke(k + '.base', [[cx - 40, 547], [cx - 40, 521, 1], [cx + 40, 521, 1], [cx + 40, 547, 1]], { z: zc, w: 4, fill: C.paper, draw: q });
        stroke(k + '.icing', [[cx - 40, 529], [cx - 27, 535], [cx - 13, 528], [cx, 535], [cx + 13, 528], [cx + 27, 535], [cx + 40, 529]], { z: zc + 0.05, w: 2.6, draw: q, boil: 0.6 });
        stroke(k + '.top', [[cx - 28, 521], [cx - 28, 503, 1], [cx + 28, 503, 1], [cx + 28, 521, 1]], { z: zc, w: 4, fill: C.paper, draw: q });
        stroke(k + '.cdl', [[cx - 4, 503], [cx - 4, 485, 1], [cx + 4, 485, 1], [cx + 4, 503, 1]], { z: zc, w: 3, fill: C.paper, draw: q });
        if (q > 0.9) {
          const f = 1 + 0.18 * Math.sin(t * 15);
          stroke(k + '.flame', [[cx, 483], [cx - 6, 476], [cx, 466 - 3 * f, 1], [cx + 6, 476], [cx, 483, 1]], { z: zc + 0.1, w: 3, fill: C.paper });
        }
      }
      DL.restore();
      fadeFrom(n0, 1 - clamp((t - fx.out) / 0.3));
    },
    cues: fx => [[fx.t0, 'pop'], [CAL17.strokes[0].t0, 'pen'], [T.CAKE, 'plip']],
  };

  /* ---------------- 40 和 42：“满分 42”、红色大括号“差 2 分” ---------------- */
  COMP.b5_hGap = {
    draw(fx, t) {
      if (t < T.FULL || t >= fx.out + 0.25) return;
      const n0 = DL.items.length, k = 'b5h.gap';
      const u = clamp((t - T.FULL) / 0.2), sz = 48, w = 2 * sz + 0.3 * sz + sz, cx = X40E - w / 2 + 6;
      text(k + '.full', '满分 42', cx, 300, { size: sz, color: C.red, z: Z.annot, scale: lerp(0.6, 1, EASE.back(u)), opacity: clamp(u * 4), halo: 8 });
      if (t >= T.GAP) {
        const x = X40E + 22, y0 = 132, y1 = 304, ym = (y0 + y1) / 2;
        stroke(k + '.br', [[x - 12, y0], [x, y0 + 8], [x + 2, ym - 10], [x + 16, ym], [x + 2, ym + 10], [x, y1 - 8], [x - 12, y1]], { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp((t - T.GAP) / 0.3)) });
        const v = clamp((t - T.GAP - 0.18) / 0.2);
        if (v > 0) text(k + '.d2', '差 2 分', x + 92, ym, { size: 44, color: C.red, z: Z.annot, scale: lerp(0.6, 1, EASE.back(v)), opacity: clamp(v * 4), halo: 8 });
      }
      fadeFrom(n0, 1 - clamp((t - fx.out) / 0.25));
    },
    cues: () => [[T.FULL, 'pop'], [T.GAP, 'pen'], [T.GAP + 0.18, 'pop']],
  };

  /* ---------------- 22 个满分的人：两排小人，每人举着“42” ---------------- */
  const CROWD = [];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 11; i++) {
    CROWD.push({ x: r ? 691 + 82 * i : 650 + 82 * i, F: r ? 772 : 650, H: r ? 118 : 104, z: Z.set + 2 + r, t: T.CROWD + r * 0.22 + i * 0.045, hair: (i * 3 + r * 2) % 4, k: `b5h.cr${r}_${i}` });
  }
  if (CROWD.length !== 22) console.error('b5_havana: 22 people');
  const SIGN = { w: 58, h: 42 };
  function mini(f, s, t) {
    const { x, F, H, z, k } = f, r = 0.19 * H, hc = [x, F - H + r], neck = hc[1] + r, hip = F - 0.42 * H, sh = neck + 0.05 * H;
    const sy = F - H - 30, bob = Math.sin(t * 5 + x * 0.05) * 2;
    DL.save(); DL.translate(x, F); DL.scale(s); DL.translate(-x, -F);
    stroke(k + '.lg', [[x - 0.11 * H, F], [x, hip, 1], [x + 0.11 * H, F]], { z, w: 3.6 });
    stroke(k + '.bd', [[x, hip], [x, neck]], { z, w: 3.6 });
    stroke(k + '.hf', ringPts(k + '.h', hc[0], hc[1], r, r, { n: 10, closed: true }), { z: z + 0.05, closed: true, fill: C.paper, noStroke: true, w: 1 });
    stroke(k + '.h', ringPts(k + '.h', hc[0], hc[1], r, r, { n: 10, a0: -120, sweep: 372 }), { z: z + 0.06, w: 3.4 });
    [-1, 1].forEach(d => dot(k + '.e' + d, [x + d * 0.36 * r, hc[1] - 0.08 * r], 2.6, C.ink, z + 0.07));
    stroke(k + '.m', [[x - 0.28 * r, hc[1] + 0.42 * r], [x, hc[1] + 0.58 * r], [x + 0.28 * r, hc[1] + 0.42 * r]], { z: z + 0.07, w: 2.4 });
    if (f.hair === 1) [-0.4, 0, 0.4].forEach((u, j) => stroke(k + '.hr' + j, [[x + u * r, hc[1] - 0.92 * r], [x + u * r * 1.4, hc[1] - 1.35 * r]], { z: z + 0.08, w: 2.8 }));
    if (f.hair === 2) stroke(k + '.hr', [[x + 0.8 * r, hc[1] - 0.6 * r], [x + 1.35 * r, hc[1] - 0.2 * r], [x + 1.3 * r, hc[1] + 0.5 * r]], { z: z + 0.08, w: 2.8 });
    if (f.hair === 3) stroke(k + '.hr', ringPts(k + '.hr', hc[0], hc[1], r * 1.12, r * 1.12, { n: 8, a0: 190, sweep: 160 }), { z: z + 0.08, w: 2.8 });
    // both hands up, holding a placard over the head
    const hy = sy + SIGN.h / 2 + bob;
    [-1, 1].forEach(d => stroke(k + '.a' + d, [[x, sh], [x + d * 0.22 * H, (sh + hy) / 2 + 6], [x + d * 20, hy]], { z: z + 0.09, w: 3.4 }));
    const x0 = x - SIGN.w / 2, y0 = sy - SIGN.h / 2 + bob;
    stroke(k + '.sg', [[x0, y0], [x0 + SIGN.w, y0, 1], [x0 + SIGN.w, y0 + SIGN.h, 1], [x0, y0 + SIGN.h, 1], [x0, y0, 1]], { z: z + 0.1, w: 3.4, fill: C.paper });
    text(k + '.n', '42', x, sy + bob + 1, { size: 36, z: z + 0.15 });
    DL.restore();
  }
  COMP.b5_hCrowd = {
    draw(fx, t) {
      if (t < T.CROWD || t >= fx.out + 0.3) return;
      const n0 = DL.items.length;
      CROWD.forEach(f => { const s = EASE.back(clamp((t - f.t) / 0.22)); if (s > 0.01) mini(f, s, t); });
      fadeFrom(n0, 1 - clamp((t - fx.out) / 0.3));
    },
    cues: () => CROWD.filter((f, i) => i % 3 === 0).map(f => [f.t, 'plip']),
  };
  /** 金牌线 42: a line along the tops of the placards */
  const LINE_Y = 650 - 104 - 30 - SIGN.h / 2 - 8;
  COMP.b5_hLine = {
    draw(fx, t) {
      if (t < T.LINE || t >= fx.out + 0.3) return;
      const n0 = DL.items.length, k = 'b5h.gl';
      stroke(k, [[604, LINE_Y + 1], [1080, LINE_Y - 1], [1556, LINE_Y]], { z: Z.set + 4, w: 5, draw: EASE.io(clamp((t - T.LINE) / 0.45)) });
      const u = clamp((t - T.LBLINE) / 0.2);
      if (u > 0) text(k + '.t', '金牌线 42', 712, LINE_Y - 38, { size: 44, z: Z.annot, scale: lerp(0.6, 1, EASE.back(u)), opacity: clamp(u * 4), halo: 8 });
      fadeFrom(n0, 1 - clamp((t - fx.out) / 0.3));
    },
    cues: () => [[T.LINE, 'swish'], [T.LBLINE, 'pop']],
  };

  /* ---------------- cast ---------------- */
  const walkOff = { lean: 14, tilt: 6, armL: [40, 30], armR: [40, 30] };
  const terry = {
    enter: T.WALK0,
    pos: [[0, [-120, FL]], [T.WALK0, [TX, FL], T.WALK1 - T.WALK0, 'lin'], [T.MOVE0, [MX, FL], T.MOVE1 - T.MOVE0, 'lin'], [T.END, [1820, FL], 0.35, 'in']],
    pose: [[0, makeWalk(T.WALK0, T.WALK1)], [T.W7[4], 'kidCheer', 0.06, 'back'], [14.55, 'stand', 0.15],
      [T.MOVE0, makeWalk(T.MOVE0, T.MOVE1, 5.6)], [T.MEDAL, 'kidCheer', 0.06, 'back'], [T.END, walkOff, 0.08]],
    face: [[0, 'smile'], [T.W7[2], 'grin', 0.06], [T.W5, 'smile', 0.08], [T.TOT, 'grin', 0.06], [T.CROWD + 0.15, 'neutral', 0.08],
      [T.MOVE0, 'smile', 0.08], [T.MEDAL, 'joy', 0.05]],
    turn: [[0, 0.3], [T.MOVE1, 0, 0.15], [T.END, 0.4, 0.08]],
    gaze: [[0, 'viewer'], [T.CAL + 0.1, 'cal'], [T.CAL + 1.7, 'viewer'], [T.SHEET, 'sheet'],
      ...T.W7.map((tw, i) => [tw - 0.1, 'c' + i]), [T.W7[4] + 0.6, 'viewer'], [T.W5 - 0.15, 'c5'], [T.TOT, 'tot'], [T.FULL + 0.1, 'full'], [T.RING, 'c5'], [T.RING + 1.0, 'viewer'],
      [T.CROWD + 0.15, 'crowd'], [T.LINE, 'line'], [T.LINE + 1.4, 'viewer'], [T.MEDAL + 0.1, 'medal'], [T.MEDAL + 0.9, 'viewer']],
    squash: [[0, 1], [T.W7[4], 0.9, 0.05], [T.W7[4] + 0.06, 1.06, 0.08], [T.W7[4] + 0.14, 1, 0.22, 'back'],
      [T.MEDAL, 0.9, 0.05], [T.MEDAL + 0.06, 1.07, 0.08], [T.MEDAL + 0.14, 1, 0.22, 'back']],
  };

  defineScene({
    id: 'havana', chapter: '1987 哈瓦那', dur: T.DUR, floor: FL,
    cast: { terry: E5.terry },
    tracks: { terry },
    targets: () => ({
      cal: [CAL.c[0], CAL.c[1] + 20], sheet: SH.at, tot: [(X40 + X40E) / 2, SH.at[1]], full: [X40E - 40, 300],
      ...Object.fromEntries([0, 1, 2, 3, 4, 5].map(i => ['c' + i, [cellX(i), SH.at[1]]])),
      crowd: [1080, 560], line: [900, LINE_Y], medal: [MX, 690],
    }),
    fx: [
      // the stamp: the old 12 leaves, 11 · 哈瓦那 comes down in the middle and docks
      { type: 'b5_hOldStamp', id: 'b5h.old', out: T.OLD_OUT, inner: { age: 12, t0: -3, ...E5.STAMP, dockT: -2 } },
      { type: 'ageStamp', age: 11, place: '哈瓦那', t0: T.STAMP, ...E5.STAMP, dockT: T.DOCK },
      { type: 'b5_hFloor', id: 'b5h.floor', t0: 0.15, out: T.END },
      // 1987 年 7 月 · 古巴 · 哈瓦那
      { type: 'b5_hBeach', id: 'b5h.beach', t0: T.BEACH, out: T.A_OUT },
      { type: 'b5_hFade', f0: T.A_OUT, fd: 0.3, inner: { type: 'write', id: 'b5h.y87', text: '1987', x: 840, y: 34, size: 150, anchor: 'end', t0: T.Y87, speed: 2600, gap: 0.03, glyphGap: 0.05, w: 9, sfx: 'pen' } },
      { type: 'b5_hFade', f0: T.A_OUT, fd: 0.3, inner: { type: 'title', id: 'b5h.ym', text: '年 7 月', x: 862, y: 140, size: 76, anchor: 'start', t0: T.YM } },
      { type: 'b5_hFade', f0: T.CUBA_OUT, fd: 0.22, inner: { type: 'title', id: 'b5h.cuba', text: '古巴 · 哈瓦那', x: 800, y: 286, size: 62, color: 'red', rot: -2, t0: T.CUBA } },
      // 7 月 17 日：再过几天满 12 岁
      { type: 'b5_hCal', id: 'b5h.cal', t0: T.CAL, out: T.A_OUT },
      { type: 'b5_hFade', f0: T.A_OUT, fd: 0.3, inner: { type: 'label', id: 'b5h.lb12', text: '还有几天满 12 岁', at: [735, 585], rot: -3, size: 44, t0: T.LB12, t1: T.A_OUT + 1, target: [1046, 528], bend: -0.2, gap: 12 } },
      // the score sheet: five 7s, a 5, "= 40"; the ring on box 6 stays for the next scene
      { type: 'e5_scores', id: SID, at: SH.at, cell: CELL, t0: T.SHEET,
        scores: [...T.W7.map(tw => [7, tw]), [5, T.W5]], total: [40, T.TOT], ringT: [[5, T.RING]] },
      { type: 'b5_hGap', id: 'b5h.gap', out: T.GAP_OUT },
      // 22 people with 42; the gold line
      { type: 'b5_hCrowd', id: 'b5h.crowd', out: T.C_OUT },
      { type: 'b5_hFade', f0: T.C_OUT, fd: 0.3, inner: { type: 'title', id: 'b5h.lb22', text: '22 人满分', x: 1130, y: 380, size: 56, color: 'red', rot: -3, t0: T.LB22 } },
      { type: 'b5_hLine', id: 'b5h.line', out: T.C_OUT },
      // silver
      { type: 'e5_medal', id: 'b5h.medal', char: 'terry', r: 34, drop: 46, label: '银', t0: T.MEDAL, t1: T.END + 0.45, shine: [T.MEDAL + 0.35, T.MEDAL + 1.45] },
      { type: 'b5_hFade', f0: T.END, fd: 0.2, inner: { type: 'label', id: 'b5h.lbS', text: '银牌！', at: [1060, 560], rot: -4, size: 52, t0: T.LBS, t1: T.END + 1, target: { char: 'terry', part: 'hip', dx: 30, dy: -16 }, bend: 0.2, gap: 14 } },
    ],
    sfx: [[T.END, 'whoosh'], [T.MEDAL + 0.05, 'tada']],
    steps: [{ t0: T.WALK0, t1: T.WALK1, hz: 5.2 }, { t0: T.MOVE0, t1: T.MOVE1, hz: 5.6 }],
    subs: [
      { t0: 0.3, t1: 4.3, text: '1987年7月，古巴，哈瓦那。', say: '一九八七年七月，古巴，哈瓦那。' },
      { t0: 4.4, t1: 8.6, text: '小陶十一岁，再过几天就满十二岁。' },
      { t0: 9.2, t1: 14.2, text: '前五道题：7分、7分、7分、7分、7分！', say: '前五道题：七分，七分，七分，七分，七分！' },
      { t0: 14.8, t1: 17.2, text: '第六题，5分。', say: '第六题，五分。' },
      { t0: 17.6, t1: 22.4, text: '一共40分，离满分42分，只差2分！', say: '一共四十分，离满分四十二分，只差两分！' },
      { t0: 23.1, t1: 27.3, text: '可那一年，有22个人考了满分，', say: '可那一年，有二十二个人考了满分，' },
      { t0: 27.4, t1: 30.4, text: '金牌要满分才拿得到。' },
      { t0: 30.9, t1: 33.9, text: '小陶拿到的是：银牌！' },
    ],
  });
})();
