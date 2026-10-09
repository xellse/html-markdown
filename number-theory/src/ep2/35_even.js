// 第 35 场 · 偶数边：切成 4 块（even）
// 一排边长 1–6 的小正方形，交替标红字"奇 / 偶"，后面省略号。
// 具体图先出（只有画面）：6×6 点阵横竖各一刀，分成 4 块 3×3，写"36 = 4 × 9"。
// 一般图：每边"m + m"（两块之间留一道缝，每块中间画省略号），"m = 0、1、2……都行"；横竖各一刀（黑墨），四块标"m × m"；
// 先图后式：(m + m) × (m + m) = 4 × m × m。
// "各拿一个凑一组"：四块里对称的 4 个点一起亮，红框连成一组，飞进右边的"组"栏；三次以后快进，四块同时拿空；"零头"栏是空的，刷实心的砖"余0"。
// 同屏三组：具体图 / 一般图 / 结果。开场：只有顶栏 + 议程条；结尾：只剩顶栏 + 议程条（其余 0.35 秒淡出）。
(() => {
  /* ---------------- the maths, checked on load ---------------- */
  if (6 * 6 !== 36 || 4 * 9 !== 36 || 3 * 3 !== 9 || 3 + 3 !== 6) console.error('e2_even: 36 = 4 × 9');
  for (let m = 0; m <= 60; m++) {
    const s = m + m;
    if (s * s !== 4 * m * m || (s * s) % 4 !== 0) console.error('e2_even: (m + m) × (m + m) ≠ 4 × m × m at m =', m);
    // four blocks of m × m, one dot from each per group: after m × m groups all four are empty at once
    let left = [m * m, m * m, m * m, m * m], groups = 0;
    while (left.every(v => v > 0)) { left = left.map(v => v - 1); groups++; }
    if (left.some(v => v !== 0) || groups * 4 !== s * s) console.error('e2_even: taking one from each block does not empty them together at m =', m);
  }
  [1, 2, 3, 4, 5, 6].forEach(k => { if ((k % 2 === 0) !== [2, 4, 6].includes(k)) console.error('e2_even: 奇/偶 labels', k); });

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    ROW: 0.9, ROW_DT: 0.13, ROW_LAB: 2.5, ROW_LDT: 0.16, ROW_OUT: 4.25,
    C6: 4.6, CUT_H: 5.05, CUT_V: 5.3, SPLIT: 5.6, EQ36: 6.0,
    GEN: 6.9, TOP: 7.75, LEFT: 8.3, ANY: 8.95,
    GCUT_H: 11.0, GCUT_V: 11.45, MM: 12.3, MM_DT: 0.15, SAME: 14.75, EQ1: 13.25, EQ2: 14.1, MM_OUT: 15.25,
    HEAD: 15.55, GRAB: [15.7, 16.35, 16.95], FAST: 17.45, FAST_DT: 0.11, EMPTY: 18.45, RES: 18.9,
    OUT: 20.15, DUR: 20.6,
  };

  /* ---------------- layout ---------------- */
  // the row of little squares, sides 1..6
  const RX = i => 230 + 160 * i, RB = 330, RG = 13;
  // the concrete 6 × 6
  const C6 = { x: 140, y: 300, g: 38 };
  C6.cx = C6.x + 2.5 * C6.g; C6.cy = C6.y + 2.5 * C6.g;
  // the general square: 4 places a block side counted from the centre (0, 1, ellipsis, 3); a gap of GAP between the two blocks
  const GN = { cx: 720, cy: 420, g: 44, gap: 14 };
  const gOff = p => GN.gap / 2 + GN.g / 2 + p * GN.g;              // distance of place p from the centre line
  const gPos = (sx, sy, pi, pj) => [GN.cx + sx * gOff(pj), GN.cy + sy * gOff(pi)];
  const EDGE = gOff(3), BC = gOff(1.5);                           // outermost dot; block centre
  const QS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  // the picks (row distance, column distance from the centre): three by hand, then the rest fast
  const PICK = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 3], [3, 0], [1, 3], [3, 1], [3, 3]];
  if (PICK.length !== 9 || new Set(PICK.map(String)).size !== 9 || PICK.some(([a, b]) => a === 2 || b === 2)) console.error('e2_even: every drawn dot of a block picked once');
  const pickT = i => (i < 3 ? T.GRAB[i] : T.FAST + (i - 3) * T.FAST_DT);
  // the result: "组" column and "零头" column
  const COLX = 1210, COLY = i => 312 + 64 * i, LEFTX = 1420;
  const EQY = 678, EQS = 44, EQ_ALL = '(m + m) × (m + m) = 4 × m × m', EQ_A = '(m + m) × (m + m)';
  const EQX = GN.cx - writeWidth(EQ_ALL, EQS) / 2, EQX2 = EQX + writeWidth(EQ_A + ' ', EQS) + 0.1 * EQS;
  const EQ1L = layoutWriting({ text: EQ_A, x: EQX, y: EQY, size: EQS, t0: T.EQ1, speed: 3600, gap: 0.02, glyphGap: 0.02 });
  if (EQ1L.tEnd > T.EQ2) console.error('e2_even: the two halves of the equation overlap', EQ1L.tEnd);

  /* ---------------- helpers ---------------- */
  const dotO = (key, p, r, col, z, o = 1) => { if (r <= 0.05 || o <= 0.01) return; dot(key, p, r, col, z); if (o < 1) DL.items[DL.items.length - 1].attrs.opacity = +o.toFixed(3); };
  const dashRect = (key, x0, y0, x1, y1, o = {}) => { const P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; P.forEach((p, i) => N2.dash(`${key}${i}`, p, P[(i + 1) % 4], { step: o.step || 12, on: o.on || 6, w: o.w || 2.6, z: o.z ?? Z.front, color: o.color || C.pencil })); };
  const W = (id, s, x, y, size, t0, o = {}) => N2.W(id, s, x, y, size, t0, o);

  /* ---------------- components ---------------- */
  /** the row of little squares 1..6, each labelled 奇 or 偶, and an ellipsis */
  COMP.e2_row = {
    draw(fx, t) {
      if (t < T.ROW) return;
      const k = fx.id;
      for (let i = 0; i < 6; i++) {
        const n = i + 1, a = Math.max(0.01, EASE.back(clamp((t - T.ROW - i * T.ROW_DT) / 0.25))); if (t < T.ROW + i * T.ROW_DT) continue;
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) dot(`${k}.${i}.${r}_${c}`, [RX(i) + (c - (n - 1) / 2) * RG * a, RB - (n - 1 - r) * RG * a], 4.4 * a, C.ink, Z.front);
        const lt = t - T.ROW_LAB - i * T.ROW_LDT;
        if (lt > 0) text(`${k}.l${i}`, n % 2 ? '奇' : '偶', RX(i), RB + 46, { size: 42, color: C.red, z: Z.annot, anchor: 'middle', scale: lerp(0.5, 1, EASE.back(clamp(lt / 0.2))) });
      }
      [0, 1, 2].forEach(q => { const a = EASE.back(clamp((t - T.ROW - 6 * T.ROW_DT - q * 0.08) / 0.2)); if (a > 0) dot(`${k}.e${q}`, [RX(6) - 40 + q * 22, RB - 30], 5.5 * a, C.ink, Z.front); });
    },
    cues: () => [[T.ROW, 'pop'], [T.ROW + 0.4, 'pop'], [T.ROW_LAB, 'plip'], [T.ROW_LAB + 0.5, 'plip']],
  };

  /** the concrete 6 × 6: pops in row by row, cut across and down (ink), the four 3 × 3 blocks move a little apart */
  COMP.e2_c6 = {
    draw(fx, t) {
      if (t < T.C6) return;
      const k = fx.id, { x, y, g, cx, cy } = C6, sp = 9 * EASE.out(clamp((t - T.SPLIT) / 0.35));
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
        const a = EASE.back(clamp((t - T.C6 - i * 0.05) / 0.22)); if (a <= 0) continue;
        dot(`${k}.d${i}_${j}`, [x + j * g + (j < 3 ? -sp : sp), y + i * g + (i < 3 ? -sp : sp)], 7.6 * a, C.ink, Z.front);
      }
      const L = 2.5 * g + 26;
      if (t >= T.CUT_H) stroke(k + '.h', [[cx - L, cy], [cx + L, cy]], { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.CUT_H) / 0.25)) });
      if (t >= T.CUT_V) stroke(k + '.v', [[cx, cy - L], [cx, cy + L]], { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.CUT_V) / 0.25)) });
    },
    cues: () => [[T.C6, 'pop'], [T.CUT_H, 'swish'], [T.CUT_V, 'swish'], [T.SPLIT, 'tap']],
  };

  /** the general square (m + m a side), its two cuts, and the picks: four mirrored dots light up, a red box joins them, they fly to the 组 column */
  COMP.e2_gen = {
    draw(fx, t, F) {
      if (t < T.GEN) return;
      const k = fx.id, g = GN.g, R = g * 0.2, lt = t - T.GEN;
      // which pick a dot belongs to
      const pickOf = (pi, pj) => PICK.findIndex(([a, b]) => a === pi && b === pj);
      const ellO = 1 - clamp((t - T.FAST - 0.6) / 0.3);
      QS.forEach(([sx, sy], q) => {
        for (let pi = 0; pi < 4; pi++) for (let pj = 0; pj < 4; pj++) {
          const a = EASE.back(clamp((lt - (3 - pi) * 0.04 - q * 0.03) / 0.22)); if (a <= 0) continue;
          const p = gPos(sx, sy, pi, pj), key = `${k}.${q}.${pi}_${pj}`;
          if (pi === 2 || pj === 2) {   // the ellipsis places
            if (ellO <= 0.01) continue;
            const e = 2.6, d = 8;
            const dirs = pi === 2 && pj === 2 ? [sx, sy] : pi === 2 ? [0, 1] : [1, 0];
            [-1, 0, 1].forEach(s => dotO(`${key}.${s + 1}`, [p[0] + dirs[0] * s * d, p[1] + dirs[1] * s * d], e * a, C.ink, Z.front, ellO));
            continue;
          }
          const pk = pickOf(pi, pj), tp = pickT(pk);
          if (t >= tp) {
            if (pk >= 3) { const v = 1 - clamp((t - tp) / 0.16); if (v > 0) dot(key, p, R * (1 + 0.3 * (1 - v)) * v, C.red, Z.front); continue; }
            continue;   // a hand pick: drawn by the flying group below
          }
          dot(key, p, R * a, C.ink, Z.front);
        }
      });
      // the three hand picks: lit, boxed, flown to the 组 column (and staying there as a little group)
      for (let i = 0; i < 3; i++) {
        const tp = T.GRAB[i]; if (t < tp) continue;
        const [pi, pj] = PICK[i], X = gOff(pj), Y = gOff(pi), u = EASE.io(clamp((t - tp - 0.45) / 0.45));
        const c = [lerp(GN.cx, COLX, u), lerp(GN.cy, COLY(i), u) - 60 * Math.sin(Math.PI * u)], hx = lerp(X, 9, u), hy = lerp(Y, 9, u), pad = lerp(13, 9, u);
        const bump = 1 + 0.35 * Math.sin(Math.PI * clamp((t - tp) / 0.3));
        QS.forEach(([sx, sy], q) => dot(`${k}.g${i}.${q}`, [c[0] + sx * hx, c[1] + sy * hy], R * lerp(1, 0.7, u) * bump, C.ink, Z.front + 0.5));
        const d = EASE.out(clamp((t - tp - 0.12) / 0.25));
        stroke(`${k}.gb${i}`, superPts(c[0], c[1], 2 * (hx + pad), 2 * (hy + pad), 20, 6), { z: Z.annot - 3, w: 3.5, color: C.red, closed: true, draw: d });
      }
      // the fast ones: a quick red box flashes round each set as it goes
      for (let i = 3; i < PICK.length; i++) {
        const tp = pickT(i), v = (t - tp) / 0.22; if (v <= 0 || v >= 1) continue;
        const [pi, pj] = PICK[i];
        stroke(`${k}.fb${i}`, superPts(GN.cx, GN.cy, 2 * (gOff(pj) + 12), 2 * (gOff(pi) + 12), 20, 6), { z: Z.annot - 3, w: 3, color: C.red, closed: true, opacity: 1 - v });
      }
      // the 组 column runs on: ⋮
      [0, 1, 2].forEach(q => { const a = EASE.back(clamp((t - T.FAST - 0.15 - q * 0.08) / 0.2)); if (a > 0) dot(`${k}.cm${q}`, [COLX, COLY(3) - 16 + q * 16], 5 * a, C.ink, Z.front); });
      // the two cuts (ink), across and down
      const L = EDGE + 30;
      if (t >= T.GCUT_H) stroke(k + '.ch', [[GN.cx - L, GN.cy], [GN.cx + L, GN.cy]], { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.GCUT_H) / 0.3)) });
      if (t >= T.GCUT_V) stroke(k + '.cv', [[GN.cx, GN.cy - L], [GN.cx, GN.cy + L]], { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.GCUT_V) / 0.3)) });
      F.targets[k + '.c'] = [GN.cx, GN.cy];
    },
    cues: () => [[T.GEN, 'pop'], [T.GCUT_H, 'swish'], [T.GCUT_V, 'swish'], ...T.GRAB.flatMap(tp => [[tp, 'plip'], [tp + 0.12, 'pen'], [tp + 0.5, 'whoosh']]),
      [T.FAST, 'zip'], [T.FAST + 0.35, 'zip']],
  };

  // the general square's labels: m + m along the top and down the left (hand-written)
  const sideLabels = [
    W('e2tm1', 'm', GN.cx - BC, GN.cy - EDGE - 70, 44, T.TOP, { anchor: 'middle' }),
    W('e2tp', '+', GN.cx, GN.cy - EDGE - 70, 44, T.TOP + 0.2, { anchor: 'middle' }),
    W('e2tm2', 'm', GN.cx + BC, GN.cy - EDGE - 70, 44, T.TOP + 0.35, { anchor: 'middle' }),
    W('e2lm1', 'm', GN.cx - EDGE - 54, GN.cy - BC - 24, 44, T.LEFT, { anchor: 'middle' }),
    W('e2lp', '+', GN.cx - EDGE - 54, GN.cy - 24, 44, T.LEFT + 0.2, { anchor: 'middle' }),
    W('e2lm2', 'm', GN.cx - EDGE - 54, GN.cy + BC - 24, 44, T.LEFT + 0.35, { anchor: 'middle' }),
  ];
  // m × m in each block (on a paper patch), pulsing at "一样多"
  COMP.e2_mm = {
    init(fx) { fx.L = layoutWriting({ text: 'm × m', x: 0, y: -20, size: 40, t0: 0, speed: 3000, anchor: 'middle', gap: 0.02, glyphGap: 0.02 }); return fx; },
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0) return;
      const o = 1 - clamp((t - T.MM_OUT) / 0.3); if (o <= 0) return;
      const k = fx.id, v = (t - T.SAME - fx.q * 0.12) / 0.45, sc = v > 0 && v < 1 ? 1 + 0.25 * Math.sin(Math.PI * v) : 1, n0 = DL.items.length;
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.scale(sc);
      stroke(k + '.bk', superPts(0, 0, fx.L.width + 26, 58, 20, 6), { z: Z.front + 1, w: 1, fill: C.paper, noStroke: true, closed: true, opacity: clamp(lt / 0.15) });
      fx.L.strokes.forEach((s, i) => { const p = clamp((lt - s.t0) / s.dur); if (p > 0) stroke(`${k}.s${i}`, s.pts, { z: Z.front + 1.2, w: 5, draw: p, boil: 0.55 }); });
      DL.restore(); N2.fadeFrom(n0, o);
    },
    cues: fx => [[fx.t0, 'chalk']],
  };
  const mmLabels = QS.map(([sx, sy], q) => ({ type: 'e2_mm', id: `e2mm${q}`, q, at: [GN.cx + sx * BC, GN.cy + sy * BC], t0: T.MM + q * T.MM_DT }));

  defineScene({
    id: 'even', dur: T.DUR, floor: N2.FL,
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'even' },

      // 边长不是偶数就是奇数
      { type: 'n2_grp', id: 'e2rowG', out: T.ROW_OUT, dur: 0.35, inner: { type: 'e2_row', id: 'e2row' } },

      // the concrete 6 × 6 → 36 = 4 × 9
      { type: 'n2_grp', id: 'e2c6G', out: T.OUT, dur: 0.35, inner: [
        { type: 'e2_c6', id: 'e2c6' },
        W('e2eq36', '36 = 4 × 9', C6.cx, 545, 44, T.EQ36, { anchor: 'middle' }),
      ] },

      // the general square, its labels, m = 0、1、2……, the equation
      { type: 'n2_grp', id: 'e2genG', out: T.OUT, dur: 0.35, inner: [
        { type: 'e2_gen', id: 'e2gen' },
        ...sideLabels,
        { type: 'scribe', id: 'e2any', text: 'm = 0、1、2……都行', x: GN.cx, y: 638, size: 36, anchor: 'middle', t0: T.ANY, cps: 14, z: Z.annot, sfx: 'pen' },
        ...mmLabels,
        W('e2eq1', EQ_A, EQX, EQY, EQS, T.EQ1, { speed: 3600 }),
        W('e2eq2', '= 4 × m × m', EQX2, EQY, EQS, T.EQ2, { speed: 3600 }),
      ] },

      // the result: 组 | 零头; the 零头 column stays empty → a solid brick 余0
      { type: 'n2_grp', id: 'e2resG', out: T.OUT, dur: 0.35, inner: [
        { type: 'title', id: 'e2h1', text: '组', x: COLX, y: 250, size: 44, t0: T.HEAD, sfx: 'pop' },
        { type: 'title', id: 'e2h2', text: '零头', x: LEFTX, y: 250, size: 44, t0: T.HEAD + 0.1, sfx: 'plip' },
        { type: 'n2_fn', id: 'e2col', t0: T.HEAD, cues: [[T.EMPTY, 'tap'], [T.RES, 'stamp']], fn: (t, lt, k) => {
          stroke(k + '.sep', [[(COLX + LEFTX) / 2, 222], [(COLX + LEFTX) / 2, 560]], { z: Z.set, w: 2.5, color: C.pencil, draw: EASE.out(clamp(lt / 0.3)), opacity: 0.8 });
          if (t >= T.EMPTY) { const a = EASE.back(clamp((t - T.EMPTY) / 0.25)); DL.save(); DL.about(LEFTX, 330, () => DL.scale(Math.max(0.01, a))); dashRect(k + '.e', LEFTX - 30, 300, LEFTX + 30, 360); DL.restore(); }
          if (t >= T.RES) N2.brick(k + '.b', LEFTX, 450, '余0', 0, { w: 150, h: 76, size: 44, scale: EASE.back(clamp((t - T.RES) / 0.3)) });
        } },
      ] },
    ],
    subs: [
      {"t0": 0.7, "t1": 5.34, "text": "边长不是偶数就是奇数：切两种正方形就够。"},
      {"t0": 5.64, "t1": 10.48, "text": "随便多大的偶数边：m加m，m是几都行，", "say": "随便多大的偶数边：m 加 m，m 是几都行，"},
      {"t0": 10.68, "t1": 15.2, "text": "横竖各一刀，切成4块m×m，一样多。", "say": "横竖各一刀，切成四块 m 乘 m，一样多。"},
      {"t0": 15.45, "t1": 20.09, "text": "每块各拿1个凑一组，4块同时拿空：余0。", "say": "每块各拿一个凑一组，四块同时拿空：余零。"},
    ],
  });
})();
