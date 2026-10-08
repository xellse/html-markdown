// 第 60 场 · 列个表（table）：1 到 16 列成一张两行的表（上面一行是数，下面一行打勾）；
// 先给奇数一起打勾，再给 4、8、12 打勾；16 也行：25 − 9 = 16 ✓；空着的 2、6、10、14 是空心格，依次闪；
// 空格之间画弧线“隔 4”；Jasper：从 2 开始每隔 4 个……2、6、10、14、18 都不行？（表外加 17、18 两格）；
// 红笔在表格上方贴标签“猜想（还没证明）”。
// 开场：空舞台（Jasper、小问号 0.1 秒内弹进来）；结尾：Jasper 走出右边，其余全部淡出。
(() => {
  const FL = N1.FL;

  /* ---------------- the maths, checked ---------------- */
  // n is a difference of two squares a² − b² (a > b ≥ 0) exactly when n is odd or a multiple of 4
  const ways = n => { const w = []; for (let a = 1; a <= n; a++) for (let b = 0; b < a; b++) if (a * a - b * b === n) w.push([a, b]); return w; };
  const OK = Array.from({ length: 18 }, (_, i) => ways(i + 1).length > 0);
  const BLANK = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].filter(n => !OK[n - 1]);
  if (BLANK.join() !== '2,6,10,14,18' || !ways(16).some(([a, b]) => a === 5 && b === 3) || 25 - 9 !== 16) console.error('e1_table: blanks / 16 = 5² − 3²', BLANK);
  const ODD = [1, 3, 5, 7, 9, 11, 13, 15], EVEN = [4, 8, 12];
  if (![...ODD, ...EVEN, 16, 17].every(n => OK[n - 1])) console.error('e1_table: ticks');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    GRID: 0.35, NUM: 1.0, NUM_DT: 0.14,
    TICK_ODD: 5.25, TICK_EVEN: [6.55, 6.8, 7.05],
    EQ: 10.3, TICK16: 12.35, EQ_OUT: 22.5,
    FLASH: [15.5, 16.2, 16.9, 17.6],                    // “空着的是 2、6、10、14”
    ARC: [19.55, 20.15, 20.75],                         // 2→6, 6→10, 10→14 “隔 4”
    LIT2: 23.2, HOP26: [24.45, 24.9],                   // “从 2 开始，每隔 4 个”
    PULSE: [26.4, 26.9], HOP: [[27.05, 27.4], [27.55, 27.9], [28.25, 28.65]], EXT: 27.75, ARC4: 28.0, Q18: 29.0, PUZZLE: 29.6,
    ARC_OUT: 32.25, TAG: 34.3,
    EXIT0: 37.75, EXIT1: 38.75, OUT: 38.3, DUR: 38.9,
  };

  /* ---------------- helpers ---------------- */
  const fadeFrom = (n0, a) => { if (a >= 1) return; for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * a).toFixed(3); } };
  /** a group: optional transform track xf [[t, [tx, ty, s]]]; from `out` on it fades over `dur` */
  COMP.e1_grp = COMP.e1_grp || {
    init(fx) { fx.inner = [].concat(fx.inner); fx.inner.forEach(f => { const c = COMP[f.type]; if (c.init && !f._e1) { c.init(f); f._e1 = 1; } }); return fx; },
    draw(fx, t, F) {
      if (fx.t0 !== undefined && t < fx.t0) return;
      const u = fx.out === undefined ? 0 : clamp((t - fx.out) / (fx.dur ?? 0.35)); if (u >= 1) return;
      const n0 = DL.items.length;
      DL.save();
      if (fx.xf) { const [tx, ty, s] = evalTrack(fx.xf, t); DL.translate(tx, ty); DL.scale(s); }
      fx.inner.forEach(f => COMP[f.type].draw(f, t, F));
      DL.restore();
      fadeFrom(n0, 1 - u);
    },
    cues: fx => fx.cues || fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])),
  };
  /** free drawing: fn(t, lt, key, F) from t0 on */
  COMP.e1_fn = COMP.e1_fn || { draw(fx, t, F) { if (t < fx.t0) return; fx.fn(t, t - fx.t0, fx.id, F); }, cues: fx => fx.cues || [] };
  const W = (id, text, x, y, size, t0, o = {}) => {
    const fx = { type: 'write', id, text, x, y, size, t0, speed: 2600, w: 5.5, gap: 0.02, glyphGap: 0.02, ...o };
    if (fx.color === 'red') { fx.z = fx.z ?? Z.annot; fx.sfx = fx.sfx || 'pen'; fx.speed = o.speed || 3000; }
    return fx;
  };
  /** a dashed straight line */
  const dash = (k, p, q, o = {}) => {
    const L = dist(p, q), m = Math.max(1, Math.round(L / (o.step || 22)));
    for (let d = 0; d < m; d++) { const u0 = d / m, u1 = Math.min(1, u0 + (o.on || 12) / L); if (o.draw !== undefined && u0 > o.draw) break; stroke(`${k}.${d}`, [lerp2(p, q, u0), lerp2(p, q, u1)], { z: o.z ?? Z.board, w: o.w || 3, color: o.color || C.ink, opacity: o.opacity, boil: 0.4 }); }
  };
  Object.assign(POSE, {
    e1_pointUL: { armScale: 1.55, tilt: -3, armL: [116, 8], armR: [16, 10] },
  });

  /* ---------------- the table: numbers on top, ticks below ---------------- */
  const X0 = 60, CW = 82, Y0 = 232, CH = 96, X1 = X0 + 16 * CW, Y1 = Y0 + CH, Y2 = Y0 + 2 * CH;
  const cx = n => X0 + (n - 0.5) * CW, NY = Y0 + CH / 2, NS = 52, KS = 54, tickTop = Y1 + (CH - KS) / 2;
  const nSize = n => (n >= 10 ? 44 : NS), nTop = n => Y0 + (CH - nSize(n)) / 2;   // two-digit numbers at 0.85× so they keep clear of the cell lines
  const grid = {
    type: 'e1_fn', id: 'e1tGr', t0: T.GRID, cues: [[T.GRID, 'pen'], [T.GRID + 0.3, 'pen']],
    fn: (t, lt, k) => {
      stroke(k + '.o', [[X0, Y0], [X1, Y0, 1], [X1, Y2, 1], [X0, Y2, 1], [X0, Y0, 1]], { z: Z.board, w: 4.5, draw: EASE.out(clamp(lt / 0.5)) });
      stroke(k + '.m', [[X0, Y1], [X1, Y1]], { z: Z.board, w: 3.5, draw: EASE.out(clamp((lt - 0.25) / 0.35)) });
      for (let i = 1; i < 16; i++) stroke(`${k}.v${i}`, [[X0 + i * CW, Y0], [X0 + i * CW, Y2]], { z: Z.board, w: 3.5, draw: EASE.out(clamp((lt - 0.3 - i * 0.02) / 0.2)) });
    },
  };
  // numbers 1–16, written one after another; the blank ones can pulse (L4, L7)
  const PULSE_AT = { 2: [T.FLASH[0], T.PULSE[0]], 6: [T.FLASH[1], T.PULSE[1]], 10: [T.FLASH[2]], 14: [T.FLASH[3]] };
  const num = n => {
    const w = W('e1tN' + n, String(n), cx(n), nTop(n), nSize(n), T.NUM + (n - 1) * T.NUM_DT, { anchor: 'middle', speed: 4200, sfx: 'pen', silent: n % 3 !== 1 });
    if (!PULSE_AT[n]) return w;
    const S = 1.3, c = [cx(n), NY], at = s => [c[0] - s * c[0], c[1] - s * c[1], s];
    const xf = [[0, at(1)]]; PULSE_AT[n].forEach(p => xf.push([p, at(S), 0.1, 'out'], [p + 0.12, at(1), 0.25, 'io']));
    return { type: 'e1_grp', id: 'e1tNp' + n, xf, inner: w };
  };
  const ticks = [
    ...ODD.map((n, i) => W('e1tK' + n, '✓', cx(n), tickTop, KS, T.TICK_ODD + i * 0.04, { anchor: 'middle', color: 'red', speed: 3400, silent: i % 3 !== 0 })),
    ...EVEN.map((n, i) => W('e1tK' + n, '✓', cx(n), tickTop, KS, T.TICK_EVEN[i], { anchor: 'middle', color: 'red', speed: 3400 })),
    W('e1tK16', '✓', cx(16), tickTop, KS, T.TICK16, { anchor: 'middle', color: 'red', speed: 3400 }),
  ];
  // L4: the blank tick cells become dashed (hollow) one by one
  const hollow = {
    type: 'e1_fn', id: 'e1tHo', t0: T.FLASH[0], cues: T.FLASH.map(f => [f, 'plip']),
    fn: (t, lt, k) => [2, 6, 10, 14].forEach((n, i) => {
      const u = clamp((t - T.FLASH[i]) / 0.3); if (u <= 0) return;
      const s = EASE.back(u), x = cx(n), y = (Y1 + Y2) / 2, hw = 27 * s, hh = 33 * s;
      const P = [[x - hw, y - hh], [x + hw, y - hh], [x + hw, y + hh], [x - hw, y + hh]];
      P.forEach((p, j) => dash(`${k}.${n}.${j}`, p, P[(j + 1) % 4], { step: 15, on: 8, w: 3 }));
    }),
  };
  // L7: 17 and 18, outside the table (dashed cells); 17 is odd (✓), 18 gets a red "?"
  const EXT = {
    type: 'e1_fn', id: 'e1tEx', t0: T.EXT, cues: [[T.EXT, 'pen']],
    fn: (t, lt, k) => {
      const d = EASE.out(clamp(lt / 0.35)), xe = X1 + 2 * CW;
      dash(k + '.t', [X1, Y0], [xe, Y0], { draw: d }); dash(k + '.m', [X1, Y1], [xe, Y1], { draw: d }); dash(k + '.b', [X1, Y2], [xe, Y2], { draw: d });
      if (d > 0.5) { dash(k + '.v1', [X1 + CW, Y0], [X1 + CW, Y2]); dash(k + '.v2', [xe, Y0], [xe, Y2]); }
    },
  };
  const ext = [EXT,
    W('e1tN17', '17', cx(17), nTop(17), nSize(17), T.EXT + 0.15, { anchor: 'middle', speed: 4200, sfx: 'pen' }),
    W('e1tN18', '18', cx(18), nTop(18), nSize(18), T.EXT + 0.35, { anchor: 'middle', speed: 4200, sfx: 'pen' }),
    W('e1tK17', '✓', cx(17), tickTop, KS, T.EXT + 0.55, { anchor: 'middle', color: 'red', speed: 3400 }),
    W('e1tQ18', '?', cx(18), tickTop, KS, T.Q18, { anchor: 'middle', color: 'red', speed: 2600 }),
  ];

  /* ---------------- L6–L7: the blanks light up, hopping from 2 (red rings stay) ---------------- */
  const HOPS = [[2, 6, ...T.HOP26], [6, 10, ...T.HOP[0]], [10, 14, ...T.HOP[1]], [14, 18, ...T.HOP[2]]];
  const LIT = [[2, T.LIT2], ...HOPS.map(h => [h[1], h[3]])];
  const RING_PULSE = { 2: T.PULSE[0], 6: T.PULSE[1] };
  const arcPts = (a, b) => { const p = [cx(a) + 8, Y0 - 8], q = [cx(b) - 8, Y0 - 8], len = q[0] - p[0], c = [(p[0] + q[0]) / 2, p[1] - 0.28 * len]; return { p, q, c }; };
  const onArc = (A, u) => [(1 - u) * (1 - u) * A.p[0] + 2 * (1 - u) * u * A.c[0] + u * u * A.q[0], (1 - u) * (1 - u) * A.p[1] + 2 * (1 - u) * u * A.c[1] + u * u * A.q[1]];
  const lit = {
    type: 'e1_fn', id: 'e1tLt', t0: T.LIT2, cues: LIT.map(([, tl]) => [tl, 'pop']).concat(HOPS.map(h => [h[2], 'hop'])),
    fn: (t, lt, k) => {
      LIT.forEach(([n, tl]) => {
        const u = clamp((t - tl) / 0.25); if (u <= 0) return;
        const pv = RING_PULSE[n] !== undefined ? (t - RING_PULSE[n]) / 0.4 : -1, s = pv > 0 && pv < 1 ? 1 + 0.1 * Math.sin(Math.PI * pv) : 1;
        // inside the cell (half-width 41): two-digit numbers are written smaller, so one ring size fits all
        stroke(`${k}.r${n}`, ringPts(`${k}.r${n}`, cx(n), NY, 32 * s, 37 * s, { n: 12, a0: -140, sweep: 385, rv: 0.04 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(u) });
      });
      // the hopping red dot
      HOPS.forEach(([a, b, h0, h1], i) => {
        const u = (t - h0) / (h1 - h0); if (u < 0 || u > 1) return;
        dot(`${k}.hop`, onArc(arcPts(a, b), EASE.io(u)), 12, C.red, Z.annot + 1);
      });
    },
  };

  /* ---------------- L5: arcs “隔 4” between the blanks (and 14 → 18 in L7) ---------------- */
  const ARCS = [[2, 6, T.ARC[0]], [6, 10, T.ARC[1]], [10, 14, T.ARC[2]], [14, 18, T.ARC4]];
  const arcs = {
    type: 'e1_grp', id: 'e1tArG', out: T.ARC_OUT, dur: 0.3,
    inner: { type: 'e1_fn', id: 'e1tAr', t0: T.ARC[0], cues: ARCS.map(([, , ta]) => [ta, 'pen']),
      fn: (t, lt, k) => ARCS.forEach(([a, b, ta], i) => {
        const p = EASE.out(clamp((t - ta) / 0.35)); if (p <= 0) return;
        const A = arcPts(a, b);
        arrow(`${k}.a${i}`, A.p, A.q, { p, bend: -0.28, color: C.red, w: 4, head: 16 });
        const lu = clamp((t - ta - 0.2) / 0.2); if (lu <= 0) return;
        text(`${k}.l${i}`, '隔 4', (A.p[0] + A.q[0]) / 2, Y0 - 86, { size: 40, color: C.red, z: Z.annot, opacity: lu, scale: lerp(0.6, 1, EASE.back(lu)), halo: 8 });
      }) },
  };

  /* ---------------- L3: 25 − 9 = 16 ✓ under 16 ---------------- */
  const eq = { type: 'e1_grp', id: 'e1tEqG', out: T.EQ_OUT, inner: W('e1tEq', '25 − 9 = 16 ✓', X1 - 6, Y2 + 30, 50, T.EQ, { anchor: 'end', color: 'red', speed: 3000 }) };

  /* ---------------- L8: the tag above the table ---------------- */
  const TAG_TXT = '猜想（还没证明）', TAG_AT = [800, 140], TAG_S = 50;
  const tag = {
    type: 'e1_fn', id: 'e1tTag', t0: T.TAG, cues: [[T.TAG, 'stamp']],
    fn: (t, lt, k) => {
      const u = clamp(lt / 0.25), s = lerp(1.5, 1, EASE.back(u)), w = textWidth(TAG_TXT, TAG_S) + 50, h = 82;
      DL.save(); DL.translate(TAG_AT[0], TAG_AT[1]); DL.rotate(-3); DL.scale(s);
      stroke(k + '.b', [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z: Z.annot, w: 5, color: C.red, fill: C.paper, opacity: clamp(u * 3) });
      text(k + '.t', TAG_TXT, 0, 2, { size: TAG_S, color: C.red, z: Z.annot + 0.5, opacity: clamp(u * 3) });
      DL.restore();
    },
  };

  const table = {
    type: 'e1_grp', id: 'e1tTb', out: T.OUT,
    inner: [grid, ...Array.from({ length: 16 }, (_, i) => num(i + 1)), ...ticks, hollow, ...ext, lit, tag],
  };

  /* ---------------- 小问号 ---------------- */
  const QX = 1265, KX = 1445;
  const qm = {
    type: 'e1_grp', id: 'e1tQmG', out: T.OUT,
    inner: {
      type: 'qm', id: 'e1tQm', size: 150, t0: 0.08, burst: true, pos: [[0, [QX, FL]]],
      mood: [[0, 'neutral'], [T.TICK_ODD + 0.2, 'happy'], [T.EQ, 'surprised'], [T.TICK16, 'happy'], [T.FLASH[0], 'neutral'], [T.PUZZLE, 'doubt'], [T.TAG + 0.6, 'happy']],
      act: [[0, 'idle'], [T.TICK16, 'hop'], [T.TICK16 + 1.3, 'idle'], [T.TAG + 0.6, 'nod'], [T.TAG + 1.8, 'idle']],
      gaze: [[0, [700, 260]], [T.TICK_ODD, [500, 320]], [T.EQ, [1200, 420]], [T.FLASH[0], [cx(2), 300]], [T.FLASH[2], [cx(10), 300]], [T.ARC[0], [cx(8), 150]],
        [T.LIT2, [cx(2), 240]], [T.HOP[0][0], [cx(10), 240]], [T.HOP[2][0], [cx(18), 240]], [T.PUZZLE, 'kid'], [T.TAG, TAG_AT]],
    },
  };

  defineScene({
    id: 'table', chapter: '列个表', dur: T.DUR, floor: FL,
    cast: { kid: N1.kid },
    tracks: {
      kid: {
        enter: 0.0,
        pos: [[0, [KX, FL]], [T.EXIT0, [1760, FL], T.EXIT1 - T.EXIT0, 'lin']],
        pose: [[0, 'stand'], [T.FLASH[0] - 0.2, 'e1_pointUL', 0.12, 'back'], [T.ARC[0], 'stand', 0.15],
          [T.LIT2 - 0.2, 'e1_pointUL', 0.12, 'back'], [T.PUZZLE, 'thinkStand', 0.14, 'back'], [T.TAG + 0.3, 'scratchStand', 0.14, 'back'], [T.TAG + 1.9, 'stand', 0.15],
          [T.EXIT0, makeWalk(T.EXIT0, T.EXIT1, 5.2), 0.08]],
        face: [[0, 'focus'], [T.TICK_ODD, 'smile', 0.1], [T.EQ, 'surprised', 0.08], [T.TICK16, 'joy', 0.08], [T.FLASH[0] - 0.3, 'focus', 0.1], [T.ARC[0], 'idea', 0.1],
          [T.LIT2 - 0.3, 'focus', 0.1], [T.PUZZLE, 'puzzled', 0.1], [T.TAG + 0.3, 'sheepish', 0.1], [T.TAG + 1.9, 'smile', 0.1]],
        turn: [[0, -0.4], [T.EXIT0, 0.5, 0.1]],
        gaze: [[0, [600, 240]], [T.TICK_ODD, [600, 320]], [T.EQ, [1200, 420]], [T.TICK16, [cx(16), 320]], [T.FLASH[0], [cx(2), 260]], [T.FLASH[1], [cx(6), 260]], [T.FLASH[2], [cx(10), 260]], [T.FLASH[3], [cx(14), 260]],
          [T.ARC[0], [cx(4), 150]], [T.ARC[2], [cx(12), 150]], [T.LIT2, [cx(2), 240]], [T.HOP26[0], [cx(6), 240]], [T.HOP[0][0], [cx(10), 240]], [T.HOP[1][0], [cx(14), 240]], [T.HOP[2][0], [cx(18), 240]],
          [T.PUZZLE, 'viewer'], [T.TAG, TAG_AT], [T.TAG + 1.9, 'viewer'], [T.EXIT0, [1800, 600]]],
      },
    },
    steps: [{ t0: T.EXIT0, t1: T.EXIT1, hz: 5.2 }],
    fx: [table, arcs, eq, qm],
    subs: [
      { t0: 0.3, t1: 4.25, text: '那到底哪些偶数不行？列个表。' },
      { t0: 4.65, t1: 7.7, text: '找到写法的，打个勾。' },
      { t0: 9.3, t1: 13.51, text: '16也行：5的平方减3的平方。', say: '十六也行：五的平方减三的平方。' },
      { t0: 14.41, t1: 18.65, text: '“空着的是2、6、10、14。”', voice: 'kid', say: '空着的是二、六、十、十四。' },
      { t0: 19.05, t1: 22.3, text: '空格之间，正好隔着4。', say: '空格之间，正好隔着四。' },
      { t0: 22.8, t1: 26.15, text: '“从2开始，每隔4个，”', voice: 'kid', say: '从二开始，每隔四个，' },
      { t0: 26.35, t1: 32.0, text: '“2、6、10、14、18……都不行？”', voice: 'kid', say: '二、六、十、十四、十八……都不行？' },
      { t0: 32.5, t1: 37.35, text: '这又是一个猜想，先贴个标签：还没证明。' },
    ],
  });
})();
