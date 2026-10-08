// 第 30 场 · 一层一层往外包（bands）：先把 6 放一边；从 1 个点开始，一圈一圈往外包：1→4 多 3，4→9 多 5，9→16 多 7；
// Jasper：3、5、7 都是奇数！每一圈都是拐角，跟我的记号一个样（┐ 飞过去，正好压在最外一圈上）；
// 可是只看了三层（三个点阵排到左上角）；小问号：第一百层？——右边升起一座顶出画面的点阵塔。
// 开场：空舞台（Jasper、小问号 0.1 秒内弹进来）；结尾：Jasper 走出右边，其余全部淡出。
(() => {
  const FL = N1.FL;

  /* ---------------- the maths, checked ---------------- */
  const LAYERS = [[1, 2], [2, 3], [3, 4]].map(([a, b]) => ({ a: a * a, b: b * b, d: b * b - a * a, N: b }));
  if (LAYERS.map(l => `${l.a}>${l.b}+${l.d}`).join() !== '1>4+3,4>9+5,9>16+7' || !LAYERS.every(l => l.d % 2 === 1 && l.d === 2 * l.N - 1)) console.error('e1_bands: layers', LAYERS);

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    SIX: 0.55, SIXQ: 1.05, PARK: 2.55, PARK1: 3.1,
    ONE: 5.2, GUIDE: 6.7, GUIDE_OUT: 8.55,
    S: { 2: 9.35, 3: 13.0, 4: 16.7 },            // a new layer pops (sub L3/L4/L5 t0)
    ROW: { 2: 9.65, 3: 13.3, 4: 17.0 },          // "1 → 4" …
    PLUS: { 2: 10.9, 3: 14.55, 4: 18.25 },       // "+3" … ("多了3个")
    CHEER: 20.7, BAND: 21.1, CHEER_END: 24.9,
    RAISE: 26.4, MARK: 26.55, FLASH: 26.7, FLY: 28.25, LAND: 28.95, DOWN: 29.1,
    OUT1: 31.45, SHR: 31.6, SHR1: 32.25, SA: 32.3, SB: 32.5, LBL: 32.75,
    QSIGN: 35.4, TOWER: 35.6, LOOK: 35.85,
    EXIT0: 38.85, EXIT1: 39.9, OUT: 39.4, DUR: 40.0,
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
  Object.assign(POSE, {
    e1_pointUL: { armScale: 1.55, tilt: -3, armL: [116, 8], armR: [16, 10] },
    e1_raiseL: { lean: 6, tilt: 4, armScale: 1.95, armL: [138, 34], ikR: { w: 1, to: 'hip', dx: 22, dy: -10, bend: 'out' } },
  });

  /* ---------------- the growing square (left) ---------------- */
  const G = 92, BL = [220, 640];                       // gap; the bottom-left dot never moves
  const top = N => BL[1] - (N - 1) * G;
  // each layer: its dots only (the inner square is already there), then its arms (solid boxes + dashed corner)
  const layerDots = N => ({ type: 'n1_dots', id: 'e1bL' + N, x: BL[0], y: top(N), N, gap: G, t0: T.S[N], pop: 0.4, hide: (i, j) => !(i === 0 || j === N - 1) });
  const layerArms = (N, t1) => ({ type: 'n1_dots', id: 'e1bA' + N, x: BL[0], y: top(N), N, gap: G, t0: T.S[N] + 0.35, arms: { t: T.S[N] + 0.4 }, hide: () => true, ...(t1 ? { t1 } : {}) });
  const layerFlash = (N, t) => ({ type: 'n1_dots', id: 'e1bF' + N, x: BL[0], y: top(N), N, gap: G, t0: t, arms: { t }, hide: () => true, t1: t + 0.75 });
  const one = { type: 'n1_dots', id: 'e1b1', x: BL[0], y: BL[1], N: 1, gap: G, t0: T.ONE };
  // L8: the square shrinks into the top-left corner and two smaller ones join it: 2×2, 3×3, 4×4 in a row
  const SS = 0.55, XF = [400 - SS * BL[0], 330 - SS * BL[1]];
  const pre = x => (x - XF[0]) / SS;                   // final x -> group coords
  const snap = (N, xFinal, t0) => ({ type: 'n1_dots', id: 'e1bS' + N, x: pre(xFinal), y: top(N), N, gap: G, t0, pop: 0.3, arms: { t: t0 + 0.2 } });
  const SNAP_X = { 2: 100, 3: 215, 4: 400 };
  const square = {
    type: 'e1_grp', id: 'e1bSq', out: T.OUT,
    xf: [[0, [0, 0, 1]], [T.SHR, [XF[0], XF[1], SS], T.SHR1 - T.SHR, 'io']],
    cues: [[T.ONE, 'pop'], ...[2, 3, 4].flatMap(N => [[T.S[N], 'pop'], [T.S[N] + 0.4, 'pen']]), [T.FLASH, 'pen'], [T.FLASH + 0.7, 'pen'], [T.SHR, 'whoosh'], [T.SA, 'pop'], [T.SB, 'pop']],
    inner: [one, layerDots(2), layerDots(3), layerDots(4), layerArms(2, T.S[3]), layerArms(3, T.S[4]), layerArms(4), layerFlash(2, T.FLASH), layerFlash(3, T.FLASH + 0.7), snap(2, SNAP_X[2], T.SA), snap(3, SNAP_X[3], T.SB)],
  };
  // L2: faint pencil ┐ ripples around the single dot (the layers still to come)
  const guides = {
    type: 'e1_fn', id: 'e1bGd', t0: T.GUIDE, cues: [[T.GUIDE, 'plip']],
    fn: (t, lt, k) => {
      const out = 1 - clamp((t - T.GUIDE_OUT) / 0.35); if (out <= 0) return;
      for (let n = 1; n <= 3; n++) {
        const a = EASE.out(clamp((lt - (n - 1) * 0.35) / 0.3)); if (a <= 0) continue;
        const c = [BL[0] + n * G, BL[1] - n * G], ends = [[BL[0] - G * 0.45, c[1]], c, [c[0], BL[1] + G * 0.45]];
        // dashes along the two legs of the ┐
        [[ends[0], ends[1]], [ends[1], ends[2]]].forEach(([p, q], s) => {
          const L = dist(p, q), m = Math.floor(L / 30);
          for (let d = 0; d < m; d++) {
            const u0 = d / m, u1 = u0 + 16 / L;
            stroke(`${k}.${n}.${s}.${d}`, [lerp2(p, q, u0), lerp2(p, q, Math.min(1, u1))], { z: Z.set, w: 3, color: C.pencil, opacity: 0.85 * a * out, boil: 0.4 });
          }
        });
      }
    },
  };

  /* ---------------- the tally (middle): 1 → 4 +3 / 4 → 9 +5 / 9 → 16 +7 ---------------- */
  const ROW_Y = { 2: 330, 3: 450, 4: 570 }, RS = 64;
  const tallyRow = N => {
    const l = LAYERS[N - 2];
    return [
      W(`e1bT${N}a`, String(l.a), 700, ROW_Y[N], RS, T.ROW[N], { anchor: 'end' }),
      W(`e1bT${N}b`, '→', 716, ROW_Y[N], RS, T.ROW[N] + 0.25),
      W(`e1bT${N}c`, String(l.b), 792, ROW_Y[N], RS, T.ROW[N] + 0.5),
      W(`e1bT${N}d`, '+' + l.d, 922, ROW_Y[N], RS, T.PLUS[N], { color: 'red' }),
    ];
  };
  const tally = {
    type: 'e1_grp', id: 'e1bTl', out: T.OUT1,
    inner: [...tallyRow(2), ...tallyRow(3), ...tallyRow(4),
      // L6: 3, 5, 7 … all odd — the one yellow on screen
      { type: 'band', id: 'e1bTb', rect: [906, 300, 112, 350], t0: T.BAND, dur: 0.45 }],
  };

  /* ---------------- L7: Jasper's mark ┐ flies onto the outer layer ---------------- */
  const S0 = 84, S1 = 3 * G + 30, CORNER = [BL[0] + 3 * G, top(4)], C1 = [CORNER[0] - S1 / 2, CORNER[1] + S1 / 2], MID = [860, 210];
  const mark = {
    type: 'e1_grp', id: 'e1bMkG', out: T.OUT1, dur: 0.3,
    inner: {
      type: 'e1_fn', id: 'e1bMk', t0: T.MARK, cues: [[T.MARK, 'pen'], [T.FLY, 'whoosh'], [T.LAND, 'ding']],
      fn: (t, lt, k, F) => {
        const a = F.anchors.kid; if (!a) return;
        const h = a.handL, c0 = [h[0] - S0 / 2 + 8, h[1] - S0 / 2 - 6];   // held by the foot of the ┐
        const u = EASE.io(clamp((t - T.FLY) / (T.LAND - T.FLY)));
        const c = u <= 0 ? c0 : [lerp(lerp(c0[0], MID[0], u), lerp(MID[0], C1[0], u), u), lerp(lerp(c0[1], MID[1], u), lerp(MID[1], C1[1], u), u)];
        const s = lerp(S0, S1, u);
        DL.save(); DL.translate(c[0], c[1]);
        PROPS.n1_mark({ id: k, size: s, w: 7 }, t, lt, EASE.out(clamp(lt / 0.3)));
        DL.restore();
      },
    },
  };

  /* ---------------- L8: the labels under the three small squares ---------------- */
  const snapLbl = {
    type: 'e1_grp', id: 'e1bSl', out: T.OUT,
    inner: [2, 3, 4].map((N, i) => W('e1bSl' + N, '+' + LAYERS[i].d, SNAP_X[N] + (N - 1) * G * SS / 2, 362, 44, T.LBL + i * 0.25, { anchor: 'middle', color: 'red' })),
  };

  /* ---------------- L1: "6 ?" is set aside (parked in the top-right corner) ---------------- */
  const SIX_C = [662, 325], PK = 0.4, PK_AT = [1470, 118];
  const six = {
    type: 'e1_grp', id: 'e1bSix', out: T.OUT,
    inner: [
      { type: 'e1_fn', id: 'e1bSixBox', t0: T.PARK1 - 0.1, cues: [[T.PARK1 - 0.1, 'paper']],
        fn: (t, lt, k) => { const w = 132, h = 94, [x, y] = PK_AT; stroke(k, [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2, 1], [x + w / 2, y + h / 2, 1], [x - w / 2, y + h / 2, 1], [x - w / 2, y - h / 2, 1]], { z: Z.board - 1, w: 3.5, fill: C.paper, draw: EASE.out(clamp(lt / 0.35)) }); } },
      { type: 'e1_grp', id: 'e1bSixW',
        xf: [[0, [0, 0, 1]], [T.PARK, [PK_AT[0] - PK * SIX_C[0], PK_AT[1] - PK * SIX_C[1], PK], T.PARK1 - T.PARK, 'io']],
        cues: [[T.SIX, 'chalk'], [T.SIXQ, 'pen'], [T.PARK, 'whoosh']],
        inner: [W('e1bSix6', '6', 560, 250, 150, T.SIX, { speed: 2200, w: 8 }), W('e1bSixQ', '?', 680, 250, 150, T.SIXQ, { color: 'red', speed: 2600, w: 8, z: Z.board })] },
    ],
  };

  /* ---------------- L9: the tower (5×5, 6×6 … off the top of the frame) ---------------- */
  const TG = 26, TX = 820, tower = [];
  for (let N = 5, yb = 760, i = 0; yb > -40; N++, i++) {
    const h = (N - 1) * TG, t0 = T.TOWER + i * 0.2;
    tower.push({ type: 'n1_dots', id: 'e1bTw' + N, x: TX - h / 2, y: yb - h, N, gap: TG, r: 5.5, t0, pop: 0.25, arms: { t: t0 + 0.25 } });
    yb -= h + 34;
  }
  const towerG = { type: 'e1_grp', id: 'e1bTwG', out: T.OUT, inner: tower, cues: tower.map(f => [f.t0, 'pop']).concat([[T.TOWER, 'whoosh']]) };

  /* ---------------- 小问号 ---------------- */
  const QX = 1150, KX = 1395;
  const qm = {
    type: 'e1_grp', id: 'e1bQmG', out: T.OUT,
    inner: {
      type: 'qm', id: 'e1bQm', size: 150, t0: 0.08, burst: true, pos: [[0, [QX, FL]]], signSize: 58, signSide: 'left',
      mood: [[0, 'neutral'], [T.CHEER + 0.2, 'happy'], [T.CHEER_END, 'neutral'], [T.LAND, 'surprised'], [T.LAND + 0.8, 'happy'], [T.SHR, 'neutral'], [T.QSIGN, 'doubt']],
      act: [[0, 'idle'], [T.CHEER + 0.2, 'hop'], [T.CHEER + 1.6, 'idle'], [T.QSIGN, 'tap'], [T.EXIT0 - 0.3, 'idle']],
      sign: [[0, null], [T.QSIGN, '第一百层？'], [T.EXIT0, null]],
      gaze: [[0, [SIX_C[0], SIX_C[1]]], [T.PARK1, PK_AT], [T.ONE, BL], [T.S[2], [BL[0] + 60, BL[1] - 60]], [T.ROW[2] + 0.6, [820, 420]], [T.S[4], [BL[0] + 140, BL[1] - 140]], [T.PLUS[4], [960, 600]],
        [T.CHEER, 'kid'], [T.RAISE + 0.3, 'kid'], [T.FLY + 0.2, C1], [T.SHR1, [300, 240]], [T.QSIGN, 'viewer'], [T.TOWER + 0.5, [TX, 200]]],
    },
  };

  defineScene({
    id: 'bands', chapter: '一层一层往外包', dur: T.DUR, floor: FL,
    cast: { kid: N1.kid },
    tracks: {
      kid: {
        enter: 0.0,
        pos: [[0, [KX, FL]], [T.EXIT0, [1760, FL], T.EXIT1 - T.EXIT0, 'lin']],
        pose: [[0, 'stand'], [T.ONE + 0.1, 'e1_pointUL', 0.12, 'back'], [T.GUIDE_OUT, 'stand', 0.15],
          [T.S[4] + 0.1, 'e1_pointUL', 0.12, 'back'], [T.PLUS[4] + 0.6, 'stand', 0.15],
          [T.CHEER, 'kidCheer', 0.12, 'out'], [T.CHEER_END, 'stand', 0.15],
          [T.RAISE, 'e1_raiseL', 0.14, 'back'], [T.DOWN, 'e1_pointUL', 0.14, 'back'], [T.LAND + 1.9, 'stand', 0.15],
          [T.SHR, 'thinkStand', 0.14, 'back'], [T.LOOK, 'lookUp', 0.15, 'back'], [T.EXIT0, makeWalk(T.EXIT0, T.EXIT1, 5.2), 0.08]],
        face: [[0, 'smile'], [T.PARK, 'sheepish', 0.1], [T.PARK1 + 0.5, 'smile', 0.1], [T.S[2], 'focus', 0.1], [T.PLUS[4] + 0.2, 'idea', 0.08],
          [T.CHEER, 'joy', 0.08], [T.CHEER_END, 'smile', 0.1], [T.RAISE, 'proudGrin', 0.08], [T.SHR, 'focus', 0.1], [T.LOOK, 'surprised', 0.08], [T.EXIT0, 'smile', 0.1]],
        turn: [[0, -0.35], [T.EXIT0, 0.5, 0.1]],
        gaze: [[0, [SIX_C[0], SIX_C[1]]], [T.PARK, PK_AT], [T.PARK1 + 0.3, 'viewer'], [T.ONE, BL], [T.S[2], [BL[0] + 50, BL[1] - 50]], [T.ROW[2] + 0.3, [800, 360]], [T.S[3], [BL[0] + 90, BL[1] - 90]],
          [T.ROW[3] + 0.3, [800, 480]], [T.S[4], [BL[0] + 140, BL[1] - 140]], [T.ROW[4] + 0.3, [820, 600]], [T.CHEER, [960, 480]], [T.CHEER + 1.4, 'viewer'],
          [T.RAISE, [BL[0] + 140, BL[1] - 140]], [T.FLY, C1], [T.SHR1, [300, 250]], [T.LOOK, [TX, -60]], [T.EXIT0, [1800, 600]]],
      },
    },
    steps: [{ t0: T.EXIT0, t1: T.EXIT1, hz: 5.2 }],
    fx: [six, guides, square, tally, mark, snapLbl, towerG, qm],
    subs: [
      { t0: 0.3, t1: 4.15, text: '先别急着找6，看看能找到谁。', say: '先别急着找六，看看能找到谁。' },
      { t0: 4.55, t1: 8.6, text: '从1个点开始，一层一层往外包。', say: '从一个点开始，一层一层往外包。' },
      { t0: 9.3, t1: 12.35, text: '1变成4，多了3个。', say: '一变成四，多了三个。' },
      { t0: 12.95, t1: 16.06, text: '4变成9，多了5个。', say: '四变成九，多了五个。' },
      { t0: 16.66, t1: 19.91, text: '9变成16，多了7个。', say: '九变成十六，多了七个。' },
      { t0: 20.61, t1: 24.73, text: '“3、5、7……都是奇数！”', voice: 'kid', say: '三、五、七……都是奇数！' },
      { t0: 26.33, t1: 30.76, text: '“每一圈都是拐角，跟我的记号一个样！”', voice: 'kid', say: '每一圈都是拐角，跟我的记号一个样！' },
      { t0: 31.46, t1: 34.93, text: '可是，我们只看了三层。' },
      { t0: 35.33, t1: 38.58, text: '“第一百层，也是奇数吗？”', voice: 'qm', say: '第一百层，也是奇数吗？' },
    ],
  });
})();
