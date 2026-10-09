// 第 30 场 · 平方落进哪几条（squares）
// Jasper 走进来，右边插着他的旧牌"大的会 / 剩 2、3？"，牌杆上贴着第 1 集片尾那排 1、4、9、16、25 的小卡（下面各一块余数花纹：斜线、实心……）。
// 上方一排 11 个小点阵 0²–10²（0² 是空虚线小框；1²–5² 画出点；6²–10² 用省略号画法），下方四条临时的"平方跑道"（不带勾、不带 ┐）。
// 旁白念到哪个，哪个点亮：1²–5² 红框圈成"4 点一组 + 零头"（零头点变红），6²–10² 刷一条余数花纹、红字"÷4 余0 / 余1"，然后落进平方跑道。
// 余 0 六个、余 1 五个；余 2、余 3 两条写红字"0 个"。旧牌挂上红色问号（不划掉）。
// Jasper 举新牌"偶 → 余 0，/ 奇 → 余 1？"，盖红框"猜想"标签。小问号跳到余 0 跑道上举牌"第 100 个？"，跑道右端拉出省略号。
// 开场：只有顶栏 + 议程条；结尾：只剩顶栏 + 议程条（其余 0.4 秒淡出，Jasper 走出右边）。
(() => {
  const FL = N2.FL;

  /* ---------------- the maths, checked on load ---------------- */
  const K = [...Array(11).keys()];                       // side lengths 0..10
  const SQ = K.map(k => k * k), REM = SQ.map(v => v % 4);
  const LANE0 = [0, 4, 16, 36, 64, 100], LANE1 = [1, 9, 25, 49, 81];   // as the narrator reads them
  if (SQ.filter(v => v % 4 === 0).join() !== LANE0.join()) console.error('s2_squares: squares leaving 0', SQ);
  if (SQ.filter(v => v % 4 === 1).join() !== LANE1.join()) console.error('s2_squares: squares leaving 1', SQ);
  if (SQ.some(v => v % 4 > 1) || LANE0.length + LANE1.length !== 11) console.error('s2_squares: 11 squares, none in lanes 2 and 3');
  K.forEach(k => { if (REM[k] !== k % 2) console.error('s2_squares: even side → 0, odd side → 1 fails at', k); });
  // Jasper's divisions for the big ones (the red "÷4 余r" labels)
  [[36, 9, 0], [64, 16, 0], [100, 25, 0], [49, 12, 1], [81, 20, 1]].forEach(([n, q, r]) => { if (4 * q + r !== n || r !== n % 4) console.error('s2_squares:', n, '÷ 4 =', q, '…', r); });
  // the sticker from episode 1: 1, 4, 9, 16, 25 leave 1, 0, 1, 0, 1
  const STK = [1, 4, 9, 16, 25];
  if (STK.map(v => v % 4).join() !== '1,0,1,0,1') console.error('s2_squares: sticker remainders');
  // 1²–5² framed as "groups of 4 + the bit left over": every dot in exactly one group or the leftover
  const blk = (r, c) => [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]];
  const GROUPS = {
    1: { g: [], left: [[0, 0]] },
    2: { g: [blk(0, 0)], left: [] },
    3: { g: [[[0, 0], [0, 1], [0, 2], [1, 2]], blk(1, 0)], left: [[2, 2]] },
    4: { g: [blk(0, 0), blk(0, 2), blk(2, 0), blk(2, 2)], left: [] },
    5: { g: [blk(0, 0), blk(0, 2), blk(2, 0), blk(2, 2), [[0, 4], [1, 4], [2, 4], [3, 4]], [[4, 0], [4, 1], [4, 2], [4, 3]]], left: [[4, 4]] },
  };
  for (let k = 1; k <= 5; k++) {
    const G = GROUPS[k], seen = new Set(); let bad = false;
    [...G.g.flat(), ...G.left].forEach(([r, c]) => { const key = r + ',' + c; if (seen.has(key) || r >= k || c >= k) bad = true; seen.add(key); });
    if (bad || seen.size !== k * k || G.g.some(q => q.length !== 4) || G.left.length !== k * k % 4 || G.g.length !== Math.floor(k * k / 4)) console.error('s2_squares: groups of', k, '×', k);
  }

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    KID: 0.05, KID_AT: 0.65, OLD: 0.9, STICK: 1.6,
    ROW: 3.0, ROW_DT: 0.12, LANES: 4.9,
    LIT0: [6.9, 7.45, 8.0, 8.7, 9.6, 10.5],              // 0, 4, 16, 36, 64, 100
    HEAD0: 11.35,
    LIT1: [13.0, 13.5, 14.05, 14.95, 15.85],             // 1, 9, 25, 49, 81
    HEAD1: 16.65,
    ZERO2: 19.3, ZERO3: 19.9, QMARK: 20.9,
    NEW: 22.6, TAG: 25.7, QM: 27.45, QSIGN: 27.8, ELL: 29.3,
    SIGN_OUT: 30.45, OUT: 30.85, KID_OUT: 30.8, KID_GONE: 31.6, DUR: 31.7,
  };
  const FALL_AFTER = 0.6, FALL_DUR = 0.5;

  /* ---------------- layout ---------------- */
  // the temporary square lanes (no ticks, no ┐)
  const LN = { x: 150, y: 400, W: 800, H: 80, gap: 12, head: 56, cell: 112 };
  const laneY = r => LN.y + r * (LN.H + LN.gap) + LN.H / 2;
  const cellX = j => LN.x + LN.head + LN.cell * (j + 0.5);
  // the row of 11 little squares above the lanes
  const RX = k => 130 + 80 * k, RB = 312, RNY = 352, G0 = 14, SL = 0.72;   // RB: y of the bottom row of dots; SL: scale in a lane
  const ITEMS = K.map(k => {
    const r = REM[k], j = r === 0 ? k / 2 : (k - 1) / 2, lit = r === 0 ? T.LIT0[j] : T.LIT1[j];
    return { k, n: SQ[k], r, j, tIn: T.ROW + k * T.ROW_DT, lit, fall: lit + FALL_AFTER, big: k >= 6 };
  });
  if (ITEMS.filter(it => it.r === 0).map(it => it.n).join() !== LANE0.join() || ITEMS.filter(it => it.r === 1).map(it => it.n).join() !== LANE1.join()) console.error('s2_squares: lane order');
  // the signs (both scenes squares and odd use the same places)
  const OB = [1180, 480], NB = [1400, 320], JX = 1480, GRIP = [NB[0], 590];
  const QX = 900;   // 小问号 stands on the top edge of lane 0

  /* ---------------- helpers ---------------- */
  const dotO = (key, p, r, col, z, o = 1) => { if (r <= 0.05 || o <= 0.01) return; dot(key, p, r, col, z); if (o < 1) DL.items[DL.items.length - 1].attrs.opacity = +o.toFixed(3); };
  const dashRect = (key, x0, y0, x1, y1, o = {}) => { const P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; P.forEach((p, i) => N2.dash(`${key}${i}`, p, P[(i + 1) % 4], { step: o.step || 10, on: o.on || 5, w: o.w || 2.4, z: o.z ?? Z.front, color: o.color })); };
  /** one little square k × k, centred at (cx, cy), dot spacing G0 × s; lit (0..1) draws its groups (k ≤ 5) or its remainder strip (k ≥ 6) */
  function drawSquare(key, it, cx, cy, s, t) {
    const k = it.k, g = G0 * s, R = 4.6 * s, z = Z.front, lit = t >= it.lit;
    const bump = lit && t < it.lit + 0.35 ? 1 + 0.3 * Math.sin(Math.PI * (t - it.lit) / 0.35) : 1;
    if (k === 0) { const h = 15 * s * bump; dashRect(key + '.z', cx - h, cy - h, cx + h, cy + h, { step: 9 * s, on: 5 * s, w: 2.6 }); return; }
    if (!it.big) {
      const off = (k - 1) / 2, P = (i, j) => [cx + (j - off) * g, cy + (i - off) * g];
      const G = GROUPS[k], left = new Set(G.left.map(([i, j]) => i + ',' + j));
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) dot(`${key}.d${i}_${j}`, P(i, j), R * bump, lit && left.has(i + ',' + j) ? C.red : C.ink, z);
      if (lit) G.g.forEach((cells, gi) => {
        const d = EASE.out(clamp((t - it.lit - gi * 0.06) / 0.3)), pad = g * 0.38, rw = 2.6 * Math.max(0.85, s);
        const rs = cells.map(c => c[0]), cs = cells.map(c => c[1]), i0 = Math.min(...rs), i1 = Math.max(...rs), j0 = Math.min(...cs), j1 = Math.max(...cs);
        const a = P(i0, j0), b = P(i1, j1);
        if ((i1 - i0 + 1) * (j1 - j0 + 1) === 4) stroke(`${key}.g${gi}`, superPts((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, b[0] - a[0] + 2 * pad, b[1] - a[1] + 2 * pad, 20, 5), { z: Z.annot - 3, w: rw, color: C.red, closed: true, draw: d });
        else {   // the L of 3 × 3: the top row and the dot under its right end
          const q = (i, j) => P(i, j), x0 = q(0, 0)[0] - pad, x2 = q(0, 2)[0], y0 = q(0, 0)[1] - pad, y1 = q(1, 2)[1];
          stroke(`${key}.g${gi}`, [[x0, y0], [x2 + pad, y0, 1], [x2 + pad, y1 + pad, 1], [x2 - pad, y1 + pad, 1], [x2 - pad, y0 + 2 * pad, 1], [x0, y0 + 2 * pad, 1], [x0, y0, 1]], { z: Z.annot - 3, w: rw, color: C.red, draw: d });
        }
      });
      return;
    }
    // 6²–10²: five places a side, the 4th one an ellipsis (tiny dots, so it scales with the square)
    const P = p => (p - 2) * g, e = 1.7 * s, eg = g * 0.24;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const x = cx + P(j), y = cy + P(i);
      if (i !== 3 && j !== 3) dot(`${key}.d${i}_${j}`, [x, y], R * bump, C.ink, z);
      else if (i === 3 && j === 3) [-1, 0, 1].forEach(q => dot(`${key}.ec${q}`, [x + q * eg, y + q * eg], e, C.ink, z));
      else if (i === 3) [-1, 0, 1].forEach(q => dot(`${key}.ev${j}_${q}`, [x, y + q * eg], e, C.ink, z));
      else [-1, 0, 1].forEach(q => dot(`${key}.eh${i}_${q}`, [x + q * eg, y], e, C.ink, z));
    }
    // the remainder strip, brushed on from the left when it is read out
    if (lit) {
      const x0 = cx - 2 * g - 7 * s, x1 = cx + 2 * g + 7 * s, y0 = cy + 2 * g + 8 * s, y1 = y0 + 13 * s, d = EASE.out(clamp((t - it.lit) / 0.35));
      stroke(key + '.sb', N2.box(x0, y0, x0 + (x1 - x0) * d, y1), { z: z - 0.2, w: 2, fill: C.paper });
      N2.fill(key + '.sf', x0 + 1, y0 + 1, x1 - 1, y1 - 1, it.r, { z: z - 0.1, draw: d, step: 8 * s, w: 1.8 });
    }
  }
  /** where an item is at time t: array centre, number centre, scale */
  function itemAt(it, t) {
    const rowC = [RX(it.k), it.k === 0 ? RB - 6 : it.big ? RB - 2 * G0 : RB - (it.k - 1) * G0 / 2], rowN = [RX(it.k), RNY];
    const lx = cellX(it.j), ly = laneY(it.r), laneC = [lx - 24, it.big ? ly - 6 : ly], laneN = [lx + 30, ly];
    const u = EASE.io(clamp((t - it.fall) / FALL_DUR)), hop = 46 * Math.sin(Math.PI * u);
    return { c: [lerp(rowC[0], laneC[0], u), lerp(rowC[1], laneC[1], u) - hop], n: [lerp(rowN[0], laneN[0], u), lerp(rowN[1], laneN[1], u) - hop], s: lerp(1, SL, u), u };
  }

  /* ---------------- components ---------------- */
  /** the 11 little squares: pop into the row, light up when read, fall into their lane */
  COMP.s2_items = {
    draw(fx, t, F) {
      const out = clamp((t - fx.out) / 0.4); if (out >= 1) return;
      ITEMS.forEach(it => {
        if (t < it.tIn) return;
        const n0 = DL.items.length, key = `${fx.id}.${it.k}`, a = Math.max(0.01, EASE.back(clamp((t - it.tIn) / 0.25)));
        const P = itemAt(it, t);
        DL.save(); DL.about(P.c[0], P.c[1], () => DL.scale(a));
        drawSquare(key, it, P.c[0], P.c[1], P.s, t);
        DL.restore();
        text(key + '.n', String(it.n), P.n[0], P.n[1], { size: 36, font: CFG.FONT_MIX, z: Z.front, anchor: 'middle', scale: a });
        // the red "÷4 余r" over the big ones, while they are lit and still in the row
        if (it.big && t >= it.lit) {
          const o = clamp((t - it.lit) / 0.15) * (1 - clamp((t - it.fall) / 0.25));
          if (o > 0.01) text(key + '.lab', '÷4 余' + it.r, RX(it.k), RB - 4 * G0 - 34, { size: 36, font: CFG.FONT_MIX, color: C.red, z: Z.annot, anchor: 'middle', opacity: o, halo: 6 });
        }
        F.targets[`s2it${it.k}`] = P.c;
        N2.fadeFrom(n0, 1 - out);
      });
    },
    cues: fx => ITEMS.flatMap(it => [[it.lit, it.big ? 'swish' : 'pen'], [it.fall + FALL_DUR * 0.8, 'tap']]).concat([[T.ROW, 'pop'], [T.ROW + 0.6, 'pop'], [T.ROW + 1.2, 'pop']]),
  };

  /** a two-line wooden sign (the same drawing as in odd): board centre `at`; plant: pole down to the floor (drops in), else held (pole 300, rises in);
   *  sticker: t (the little card from episode 1 on the pole); qmark: t (a red ? hangs from the board); t1: fade */
  const SW = 300, SH = 130, SS = 42;
  COMP.s2_sign = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.35) : 0; if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, lt = t - fx.t0, u = EASE.back(clamp(lt / 0.3)), z = Z.front;
      const cx = fx.at[0], cy = fx.at[1] + (1 - u) * (fx.plant ? -40 : 40), bot = cy + SH / 2;
      stroke(k + '.pole', [[cx, bot], [cx, fx.plant ? FL : bot + 300]], { z, w: 7, draw: EASE.out(clamp(lt / 0.25)) });
      stroke(k + '.b', N2.box(cx - SW / 2, cy - SH / 2, cx + SW / 2, bot), { z: z + 0.05, w: 5, fill: '#F3E3C3', draw: EASE.out(clamp(lt / 0.3)) });
      const to = clamp(lt * 4 - 0.6);
      fx.lines.forEach((s, i) => {
        const y = cy + (i - 0.5) * 54;
        if (s.endsWith('？')) {   // prefix and the ？ meet at xq, so the ？ can be wiped on its own
          const pre = s.slice(0, -1), W = textWidth(s, SS) * 0.92, xq = cx - W / 2 + textWidth(pre, SS) * 0.92;
          text(`${k}.t${i}`, pre, xq, y, { size: SS, z: z + 0.2, anchor: 'end', opacity: to });
          const qo = fx.qErase !== undefined ? 1 - clamp((t - fx.qErase) / 0.3) : 1;
          if (qo > 0.01) text(`${k}.q${i}`, '？', xq, y, { size: SS, z: z + 0.2, anchor: 'start', opacity: to * qo });
        } else text(`${k}.t${i}`, s, cx, y, { size: SS, z: z + 0.2, anchor: 'middle', opacity: to });
      });
      // the little card from episode 1 on the pole: 1, 4, 9, 16, 25 and a remainder swatch under each
      if (fx.sticker !== undefined && t >= fx.sticker) {
        const v = EASE.back(clamp((t - fx.sticker) / 0.3)), m0 = DL.items.length;
        DL.save(); DL.translate(cx, bot + 140); DL.rotate(-3); DL.scale(Math.max(0.01, v));
        stroke(k + '.sk', N2.box(-125, -42, 125, 42), { z: z + 0.3, w: 3, fill: '#FFFFFF' });
        dot(k + '.pin', [0, -36], 7, C.red, z + 0.45);
        [-92, -48, -4, 42, 90].forEach((x, i) => {
          text(`${k}.sn${i}`, String(STK[i]), x, -12, { size: 36, font: CFG.FONT_MIX, z: z + 0.4, anchor: 'middle' });
          stroke(`${k}.sw${i}`, N2.box(x - 15, 12, x + 15, 30), { z: z + 0.35, w: 2, fill: C.paper });
          N2.fill(`${k}.sf${i}`, x - 14, 13, x + 14, 29, STK[i] % 4, { z: z + 0.38, step: 7, w: 1.6 });
        });
        DL.restore(); N2.fadeFrom(m0, clamp(v * 3));
      }
      // a red ? hanging from the board's lower right corner, swinging (not crossed out: 11 examples cannot overturn it)
      if (fx.qmark !== undefined && t >= fx.qmark) {
        const qt = t - fx.qmark, v = EASE.back(clamp(qt / 0.3)), sw = 14 * Math.sin(qt * 5) * Math.exp(-qt * 0.9);
        DL.save(); DL.translate(cx + 138, bot); DL.rotate(sw);
        stroke(k + '.qs', [[0, 0], [0, 18 * v]], { z: z + 0.3, w: 2.5, color: C.red });
        text(k + '.qq', '?', 0, 54, { size: 76 * Math.max(0.01, v), font: CFG.FONT_MIX, color: C.red, z: z + 0.4, anchor: 'middle' });
        DL.restore();
      }
      F.targets[k + '.c'] = [cx, cy];
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: fx => [[fx.t0, fx.plant ? 'thud' : 'whip'], ...(fx.sticker !== undefined ? [[fx.sticker, 'paper']] : []), ...(fx.qmark !== undefined ? [[fx.qmark, 'boing']] : [])],
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    s2_ptL: { lean: -2, tilt: -4, armScale: 1.5, armL: [80, 8], armR: [16, 10] },
    s2_hold: { lean: -2, tilt: -4, armScale: 1.5, ikL: { w: 1, to: 'abs', dx: GRIP[0], dy: GRIP[1], bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 28, dy: -6, bend: 'out' } },
  });
  const exitWalk = makeWalk(T.KID_OUT, T.KID_GONE, 5.6);

  defineScene({
    id: 'squares', chapter: '平方只余 0 或 1', dur: T.DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        pos: [[0, [1720, FL]], [T.KID, [JX, FL], T.KID_AT - T.KID, 'lin'], [T.KID_OUT, [1720, FL], T.KID_GONE - T.KID_OUT, 'lin']],
        pose: [[0, makeWalk(T.KID, T.KID_AT, 5.2)], [T.OLD + 0.05, 's2_ptL', 0.12, 'back'], [T.ROW, 'stand', 0.15], [T.QMARK + 0.1, 'thinkStand', 0.14, 'back'],
          [T.NEW - 0.15, 's2_hold', 0.15, 'back'], [T.KID_OUT, exitWalk, 0.08]],
        face: [[0, 'smile'], [T.OLD, 'proudGrin', 0.08], [T.ROW, 'focus', 0.1], [T.ZERO2 - 0.3, 'surprised', 0.08], [T.QMARK + 0.1, 'puzzled', 0.1],
          [T.NEW - 0.1, 'idea', 0.08], [T.TAG + 0.3, 'smile', 0.1], [T.QM + 0.2, 'puzzled', 0.1], [T.KID_OUT, 'smile', 0.1]],
        turn: [[0, -0.4], [T.KID_OUT - 0.05, 0.5, 0.1]],
        gaze: [[0, [OB[0], OB[1]]], [T.STICK, [OB[0], OB[1] + 205]], [T.ROW, [560, 290]], [T.LIT0[0], [420, 300]], [T.LIT0[3], [600, 420]], [T.HEAD0, [110, 440]],
          [T.LIT1[0], [420, 300]], [T.LIT1[3], [620, 520]], [T.ZERO2 - 0.3, [520, 670]], [T.QMARK, [OB[0] + 138, OB[1] + 120]], [T.NEW, 'viewer'],
          [T.QM, [QX, 300]], [T.ELL, [900, 480]], [T.KID_OUT, 'viewer']],
      },
    },
    steps: [{ t0: T.KID, t1: T.KID_AT, hz: 5.2 }, { t0: T.KID_OUT, t1: T.KID_GONE, hz: 5.6 }],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'squares' },
      // a short pencil floor under Jasper and the planted sign
      { type: 'n2_fn', id: 's2fl', t0: 0, fn: (t, lt, k) => { const o = 1 - clamp((t - T.OUT - 0.4) / 0.35); if (o > 0) stroke(k, [[1000, FL], [1300, FL + 2], [1590, FL - 1]], { z: Z.set, w: 2.2, color: C.pencil, draw: EASE.out(clamp(lt / 0.4)), opacity: 0.8 * o }); } },

      // the temporary square lanes
      { type: 'n2_lanes', id: 's2ln', x: LN.x, y: LN.y, W: LN.W, H: LN.H, gap: LN.gap, head: LN.head, t0: T.LANES, pop: 0.8, t1: T.OUT, labelSize: 40 },
      // 余零 / 余一: a red ring round the lane's name
      { type: 'n2_fn', id: 's2hd', t0: T.HEAD0, cues: [[T.HEAD0, 'pen'], [T.HEAD1, 'pen']], fn: (t, lt, k) => {
        [[T.HEAD0, 0], [T.HEAD1, 1]].forEach(([t0, r]) => {
          const o = 1 - clamp((t - t0 - 1.6) / 0.3); if (t < t0 || o <= 0) return;
          N2.ring(`${k}.${r}`, LN.x - 46, laneY(r), 50, 32, { draw: EASE.out(clamp((t - t0) / 0.35)), opacity: o });
        });
      } },
      // 余2、余3: none at all
      { type: 'n2_grp', id: 's2zg', out: T.OUT, dur: 0.4, inner: [
        { type: 'title', id: 's2z2', text: '0 个', x: cellX(2), y: laneY(2), size: 44, color: 'red', t0: T.ZERO2, sfx: 'plip' },
        { type: 'title', id: 's2z3', text: '0 个', x: cellX(2), y: laneY(3), size: 44, color: 'red', t0: T.ZERO3, sfx: 'plip' },
      ] },
      // the 11 little squares (drawn over the lanes)
      { type: 's2_items', id: 's2it', out: T.OUT },
      // 第 100 个？ — the lanes go on: an ellipsis pulled out at the right end of lanes 0 and 1
      { type: 'n2_fn', id: 's2el', t0: T.ELL, cues: [[T.ELL, 'pen']], fn: (t, lt, k) => {
        const o = 1 - clamp((t - T.OUT) / 0.4); if (o <= 0) return;
        [[0, cellX(6) - 38], [1, cellX(5) - 38]].forEach(([r, x0], i) => [0, 1, 2].forEach(q => {
          const a = EASE.back(clamp((lt - i * 0.15 - q * 0.12) / 0.2)); if (a > 0) dotO(`${k}.${r}.${q}`, [x0 + q * 22, laneY(r)], 5.5 * a, C.ink, Z.front, o);
        }));
      } },

      // Jasper's old sign, planted on the right, with the sticker; later a red ? hangs from it
      { type: 's2_sign', id: 's2old', at: OB, plant: true, lines: ['大的会', '剩 2、3？'], t0: T.OLD, sticker: T.STICK, qmark: T.QMARK, t1: T.OUT },
      // the new sign, held up in his left hand, and its red "猜想" tag
      { type: 's2_sign', id: 's2new', at: NB, lines: ['偶 → 余 0，', '奇 → 余 1？'], t0: T.NEW, t1: T.SIGN_OUT },
      { type: 'n2_tag', id: 's2tag', at: [NB[0] - SW / 2 + 30, NB[1] - SH / 2 - 42], rot: -6, size: 40, t0: T.TAG, t1: T.SIGN_OUT },

      // 小问号 hops onto lane 0: 第 100 个？
      { type: 'n2_grp', id: 's2qg', out: T.OUT, dur: 0.4, inner: { type: 'qm', id: 's2qm', size: 130, t0: T.QM, burst: true, signSide: 'left', signSize: 56,
        pos: [[0, [QX, LN.y]]],
        mood: [[0, 'surprised'], [T.QSIGN + 0.8, 'doubt']],
        act: [[0, 'idle'], [T.QSIGN, 'tap'], [T.QSIGN + 1.6, 'idle']],
        sign: [[0, null], [T.QSIGN, '第 100 个？']],
        gaze: [[0, [500, 300]], [T.QSIGN, 'viewer'], [T.ELL, [960, 480]]] } },
    ],
    subs: [
      {"t0": 0.7, "t1": 6.18, "text": "“上集平方只剩0和1，大的总会剩2、3吧？”", "voice": "kid", "say": "上集平方只剩零和一，大的总会剩二、三吧？"},
      {"t0": 6.58, "t1": 12.42, "text": "0、4、16、36、64、100：余0；", "say": "零、四、十六、三十六、六十四、一百：余零；"},
      {"t0": 12.62, "t1": 17.67, "text": "1、9、25、49、81：余1。", "say": "一、九、二十五、四十九、八十一：余一。"},
      {"t0": 17.87, "t1": 22.15, "text": "这11个里，余2、余3一个都没有。", "say": "这十一个里，余二、余三，一个都没有。"},
      {"t0": 22.55, "t1": 27.36, "text": "“看着像：偶数的平方余0，奇数的余1？”", "voice": "kid", "say": "看着像：偶数的平方余零，奇数的余一？"},
      {"t0": 27.76, "t1": 31.21, "text": "“第一百个平方，也这样吗？”", "voice": "qm", "say": "第一百个平方，也这样吗？"},
    ],
  });
})();
