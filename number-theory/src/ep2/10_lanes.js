// 第 10 场 · 上集的问题与四条跑道（lanes）
// 开场：第 1 集 1–16 的两行表缩小回来，空格 2、6、10、14 闪一下；下面是"还没找到 / 根本没有"两格，小问号站在两格中间举牌提问；
// 两格缩成一张小卡收到一边。9 个点排一行（9 = 3 × 3），红圈 4 | 4 | 1，"零头"；本子上的横式 9 ÷ 4 = 2 … 1，"余数"。
// 5 个散点：红圈抓走 4 个成一组，只剩 1 个；卡片"余数：0、1、2、3"。
// 四条跑道：数字砖 0–15 轮流落进去，每满一轮，跑道左边多一个红色 4 点小方框；9 的那排点挪到一边，和砖 9 对上；
// 红点按顺序跳过 0–15（每个数只轮到一次），砖 6 闪一下，别的三条变淡。翻页到第 1 集的地图：右门打开，门后是四条小跑道，
// 门楣写"余数门"；地图淡出，四条小跑道缩进顶栏，成了细跑道条。
// 开场：空舞台（小问号 0.1 秒弹进来）；结尾：只剩顶栏的细跑道条。
(() => {
  const FL = N2.FL, W = N2.W, F = N2.F;

  /* ---------------- the maths, checked ---------------- */
  const ways = n => { const w = []; for (let a = 1; a <= n; a++) for (let b = 0; b < a; b++) if (a * a - b * b === n) w.push([a, b]); return w; };
  const NUMS = Array.from({ length: 16 }, (_, i) => i + 1), BLANK = NUMS.filter(n => !ways(n).length);
  if (BLANK.join() !== '2,6,10,14') console.error('l2_lanes: the blanks of the 1–16 table', BLANK);
  if (3 * 3 !== 9 || 4 + 4 + 1 !== 9 || Math.floor(9 / 4) !== 2 || 9 % 4 !== 1 || 4 * 2 + 1 !== 9) console.error('l2_lanes: 9 = 3 × 3 = 4 + 4 + 1, 9 ÷ 4 = 2 … 1');
  if (5 - 4 !== 1 || 5 % 4 !== 1) console.error('l2_lanes: 5 dots, a group of 4, 1 left');
  // bricks 0–15: brick n goes into lane n % 4 in round floor(n / 4); every number exactly once, four full rounds of 4
  const LANE_OF = n => n % 4, ROUND_OF = n => Math.floor(n / 4);
  for (let n = 0; n < 16; n++) if (4 * ROUND_OF(n) + LANE_OF(n) !== n || LANE_OF(n) < 0 || LANE_OF(n) > 3) console.error('l2_lanes: brick', n);
  if ([0, 1, 2, 3].some(r => Array.from({ length: 16 }, (_, n) => n).filter(n => LANE_OF(n) === r).length !== 4)) console.error('l2_lanes: 4 bricks per lane');
  if (Array.from({ length: 16 }, (_, n) => n).filter(n => n === 6).map(LANE_OF).join() !== '2') console.error('l2_lanes: 6 is in lane 2 only');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    QM: 0.1, GRID: 0.3, NUM: 0.45, TICK: 0.75, FLASH: [1.25, 1.45, 1.65, 1.85], PANELS: 2.4, SIGN: 2.75, SIGN_OFF: 5.0,
    TB_OUT: 5.0, PN_SHRINK: 5.0, PN_AWAY: 5.4, QM_MOVE: 5.15,
    G9: 5.55, EQ9: 6.3, RING9: 8.1, LEFT1: 9.4, LEFT1_OFF: 10.85, BIT: 10.95, DIV: 12.5, DIV_RING: 13.95, REM: 14.15,
    FIVE: 15.35, GRAB: 16.5, GRAB_RING: 16.85, GRAB_GO: 17.2, WIGGLE: 17.5, CARD: 18.0, DEMO_OUT: 20.0,
    G9_MOVE: 20.2, LANES: 20.9, BRICK0: 22.0, BRICK_DT: 0.36, DROP: 0.18, SLIDE: 0.28, DOTS: 28.0,
    R9: [28.3, 28.55, 28.8], R9_OUT: 29.5, G9_OUT: 29.6,
    HOP0: 30.1, HOP_DT: 0.1, SIX: 32.0, VEIL: 32.2, VEIL_OFF: 33.65, SIX_OFF: 33.8, QM_EXIT: 33.3,
    FLIP: 34.3, FLIP_DUR: 0.9, OLD_OUT: 34.95,
    MAP: 35.1, DOOR: 35.55, OPEN: 36.05, LABEL: 36.85, FLY: 37.85, STRIP: 38.4, MAP_OUT: 38.25, DUR: 39.4,
  };
  const landT = n => T.BRICK0 + n * T.BRICK_DT + T.DROP + T.SLIDE;
  const ROUND_T = [0, 1, 2, 3].map(j => landT(4 * j + 3));   // a round is full when its 4th brick lands

  /* ---------------- 1–16 two-row table (第 1 集 60_table 的画法，缩小) ---------------- */
  const TX0 = 304, TCW = 62, TY0 = 210, TCH = 70, TX1 = TX0 + 16 * TCW, TY1 = TY0 + TCH, TY2 = TY0 + 2 * TCH;
  const tcx = n => TX0 + (n - 0.5) * TCW, tNS = n => (n >= 10 ? 36 : 42), tNY = TY0 + TCH / 2;
  const tableGrid = {
    type: 'n2_fn', id: 'l2tGr', t0: T.GRID, cues: [[T.GRID, 'pen']],
    fn: (t, lt, k) => {
      stroke(k + '.o', N2.box(TX0, TY0, TX1, TY2), { z: Z.board, w: 4, draw: EASE.out(clamp(lt / 0.4)) });
      stroke(k + '.m', [[TX0, TY1], [TX1, TY1]], { z: Z.board, w: 3, draw: EASE.out(clamp((lt - 0.15) / 0.3)) });
      for (let i = 1; i < 16; i++) stroke(`${k}.v${i}`, [[TX0 + i * TCW, TY0], [TX0 + i * TCW, TY2]], { z: Z.board, w: 3, draw: EASE.out(clamp((lt - 0.2 - i * 0.01) / 0.2)) });
    },
  };
  const tableNums = NUMS.map((n, i) => W('l2tN' + n, String(n), tcx(n), tY(n), tNS(n), T.NUM + i * 0.025, { anchor: 'middle', speed: 7000, silent: i % 5 !== 0, sfx: 'pen' }));
  function tY(n) { return TY0 + (TCH - tNS(n)) / 2; }
  const tableTicks = NUMS.filter(n => !BLANK.includes(n)).map((n, i) => W('l2tK' + n, '✓', tcx(n), TY1 + (TCH - 40) / 2, 40, T.TICK + i * 0.02, { anchor: 'middle', color: 'red', speed: 6000, silent: i % 4 !== 0 }));
  // blanks: dashed (hollow) tick cells, and a red ring round the number when it flashes
  const tableBlanks = {
    type: 'n2_fn', id: 'l2tBl', t0: T.TICK, cues: T.FLASH.map(f => [f, 'plip']),
    fn: (t, lt, k) => BLANK.forEach((n, i) => {
      const x = tcx(n), y = (TY1 + TY2) / 2, hw = 22, hh = 26, P = [[x - hw, y - hh], [x + hw, y - hh], [x + hw, y + hh], [x - hw, y + hh]];
      P.forEach((p, j) => N2.dash(`${k}.${n}.${j}`, p, P[(j + 1) % 4], { step: 13, on: 7, w: 2.6 }));
      const u = clamp((t - T.FLASH[i]) / 0.25); if (u <= 0) return;
      const pv = (t - T.FLASH[i]) / 0.45, s = pv > 0 && pv < 1 ? 1 + 0.18 * Math.sin(Math.PI * pv) : 1;
      stroke(`${k}.r${n}`, ringPts(`${k}.rp${n}`, x, tNY, 26 * s, 30 * s, { n: 12, a0: -140, sweep: 385, rv: 0.04 }), { z: Z.annot, w: 4, color: C.red, draw: EASE.out(u) });
    }),
  };
  const table = { type: 'n2_grp', id: 'l2tb', out: T.TB_OUT, inner: [tableGrid, ...tableNums, ...tableTicks, tableBlanks] };

  /* ---------------- 两格（还没找到 / 根本没有）：缩成小卡，收到左边去 ---------------- */
  const PS = 0.66, PTX = 800 - 650 * PS, PTY = 392 - 172 * PS;
  const panels = {
    type: 'n2_panels', id: 'l2pn', t0: T.PANELS, t1: T.PN_AWAY + 0.1,
    xf: [[0, [PTX, PTY, PS]], [T.PN_SHRINK, [30 - 90 * 0.28, 200 - 172 * 0.28, 0.28], 0.4, 'io'], [T.PN_AWAY, [-420, 200 - 172 * 0.28, 0.28], 0.4, 'in']],
  };

  /* ---------------- 9 个点：9 = 3 × 3，4 | 4 | 1；9 ÷ 4 = 2 … 1 ---------------- */
  const G9X = 230, G9Y = 330, G9S = 1.3, G9X2 = 1180, G9Y2 = 250, G9S2 = 0.9;
  const g9 = {
    type: 'n2_grp', id: 'l2g9g', out: T.G9_OUT,
    inner: { type: 'prop', kind: 'n2_group9', id: 'l2g9', t0: T.G9, ringAt: T.RING9 - T.G9, drawDur: 0.4, sfxAt: [[T.G9, 'pop'], [T.RING9, 'pen']],
      pos: [[0, [G9X, G9Y]], [T.G9_MOVE, [G9X2, G9Y2], 0.6, 'io']], scale: [[0, G9S], [T.G9_MOVE, G9S2, 0.6, 'io']] },
  };
  const RED9 = [G9X + 340 * G9S, G9Y], RED9b = [G9X2 + 340 * G9S2, G9Y2];
  const DIV_TXT = '9 ÷ 4 = 2 … 1', DIV_S = 56, DIV_Y = 412, DIVW = writeWidth(DIV_TXT, DIV_S);
  const DIV_LAY = layoutWriting({ text: DIV_TXT, x: G9X, y: DIV_Y, size: DIV_S, t0: 0, speed: 1 }), DIV_BOX = DIV_LAY.boxes[DIV_LAY.boxes.length - 1];
  if (!DIV_BOX || DIV_BOX.ch !== '1' || DIV_LAY.boxes.length !== [...DIV_TXT].length) console.error('l2_lanes: 9 ÷ 4 = 2 … 1 glyphs', DIV_LAY.boxes.map(b => b.ch).join(''));
  const nine = [
    F(T.DEMO_OUT, W('l2eq9', '9 = 3 × 3', G9X + 170 * G9S, 230, 56, T.EQ9, { anchor: 'middle', sfx: 'pen' })),
    { type: 'label', id: 'l2left', text: '剩 1 个', at: [830, 236], target: [RED9[0] + 4, RED9[1] - 22], t0: T.LEFT1, t1: T.LEFT1_OFF, bend: 0.2 },
    { type: 'label', id: 'l2bit', text: '零头', at: [830, 236], target: [RED9[0] + 4, RED9[1] - 22], t0: T.BIT, t1: T.DEMO_OUT, bend: 0.2 },
    F(T.DEMO_OUT, W('l2div', DIV_TXT, G9X, DIV_Y, DIV_S, T.DIV, { sfx: 'pen' })),
    // red ring round the remainder 1 (the engine's ring only finds top-level writes, so the glyph box is laid out here)
    { type: 'n2_fn', id: 'l2divR', t0: T.DIV_RING, cues: [[T.DIV_RING, 'pen']], fn: (t, lt, k) => {
      const o = 1 - clamp((t - T.DEMO_OUT) / 0.4); if (o <= 0) return;
      const b = DIV_BOX; stroke(k, ringPts(k + '.p', b.x + b.w / 2, b.y + b.h * 0.52, b.w / 2 + 20, b.h / 2 + 16, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp(lt / 0.35)), opacity: o });
    } },
    { type: 'label', id: 'l2rem', text: '余数', at: [G9X + DIVW + 110, 548], target: [G9X + DIVW - 14, DIV_Y + DIV_S + 18], t0: T.REM, t1: T.DEMO_OUT, bend: -0.25 },
  ];

  /* ---------------- 5 个散点：红圈抓走 4 个成一组，只剩 1 个 ---------------- */
  const P5 = [[985, 292], [1072, 258], [1012, 388], [1098, 360], [1215, 330]];          // the last one is left over
  const Q5 = [[1000, 305], [1046, 305], [1000, 351], [1046, 351]];                         // the 2 × 2 group
  COMP.l2_five = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const out = clamp((t - fx.t1) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, gu = EASE.io(clamp((t - T.GRAB) / 0.3)), go = EASE.io(clamp((t - T.GRAB_GO) / 0.4)), dx = -60 * go;
      P5.forEach((p, i) => {
        const a = EASE.back(clamp((t - fx.t0 - i * 0.08) / 0.22)); if (a <= 0) return;
        let q = p;
        if (i < 4) q = [lerp(p[0], Q5[i][0], gu) + dx, lerp(p[1], Q5[i][1], gu)];
        else { const w = t > T.WIGGLE && t < T.WIGGLE + 0.6 ? 7 * Math.sin((t - T.WIGGLE) * 30) * (1 - (t - T.WIGGLE) / 0.6) : 0; q = [p[0] + w, p[1]]; }
        dot(`${k}.d${i}`, q, 13 * a, i === 4 ? C.red : C.ink, Z.front);
      });
      const ru = clamp((t - T.GRAB_RING) / 0.3);
      if (ru > 0) stroke(k + '.ring', ringPts(k + '.rp', 1023 + dx, 328, 62, 60, { n: 16, a0: -130, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(ru) });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: fx => [[fx.t0, 'pop'], [T.GRAB, 'swish'], [T.GRAB_RING, 'pen'], [T.GRAB_GO, 'whoosh'], [T.WIGGLE, 'plip']],
  };
  const five = { type: 'l2_five', id: 'l2five', t0: T.FIVE, t1: T.DEMO_OUT };
  const remCard = { type: 'n2_grp', id: 'l2cdg', out: T.DEMO_OUT, inner: { type: 'prop', kind: 'n1_card', id: 'l2cd', at: [1100, 545], t0: T.CARD, w: 440, h: 104, size: 46, lines: ['余数：0、1、2、3'], drawDur: 0.35, sfxAt: [[T.CARD, 'paper']] } };

  /* ---------------- 四条跑道 + 数字砖 0–15 ---------------- */
  const L = { x: 300, y: 300, W: 760, H: 76, gap: 16, head: 70, cell: 110 };
  const laneY = r => L.y + r * (L.H + L.gap), laneCY = r => laneY(r) + L.H / 2;
  const lanes = { type: 'n2_lanes', id: 'l2ln', ...L, t0: T.LANES, t1: T.OLD_OUT };
  const BOX_X = [70, 135, 200, 265], BOX_Y = 252;
  // the red 4-dot box (one more group of 4)
  const box4 = (k, x, y, s, o = {}) => {
    stroke(k + '.b', N2.box(x - 27 * s, y - 27 * s, x + 27 * s, y + 27 * s), { z: o.z ?? Z.annot - 3, w: 4, color: C.red, fill: C.paper, opacity: o.opacity });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], i) => dot(`${k}.d${i}`, [x + a * 11 * s, y + b * 11 * s], 6 * s, C.ink, (o.z ?? Z.annot - 3) + 0.1));
  };
  COMP.l2_bricks = {
    draw(fx, t, F) {
      if (t < T.BRICK0) return;
      const out = clamp((t - fx.t1) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length;
      for (let n = 0; n < 16; n++) {
        const t0 = T.BRICK0 + n * T.BRICK_DT; if (t < t0) continue;
        // it drops in at the far end of its lane (nothing there yet), then slides along the lane to its place in the round
        const [x, y] = N2.laneXY(L, n), XE = L.x + L.W - 58, fu = clamp((t - t0) / T.DROP), su = clamp((t - t0 - T.DROP) / T.SLIDE);
        const xx = lerp(XE, x, EASE.out(su)); let yy = lerp(150, y, EASE.in(fu)), s = 1;
        const u = fu;
        if (n === 6 && t >= T.SIX) { const pv = (t - T.SIX) / 0.5; s = pv < 1 ? 1 + 0.28 * Math.sin(Math.PI * pv) : 1; }
        N2.brick(`${k}.b${n}`, xx, yy, n, LANE_OF(n), { opacity: clamp(u * 4), scale: s, z: n === 6 && t >= T.SIX ? Z.front + 2 : Z.front });
        F.targets[`${k}.b${n}`] = [x, y];
      }
      // a column is one round = one group of 4: it flashes red when it is full, and one more red box pops in on the left
      ROUND_T.forEach((rt, j) => {
        const u = (t - rt) / 0.7;
        if (u > 0 && u < 1) {
          const x = L.x + L.head + L.cell * (j + 0.5);
          stroke(`${k}.col${j}`, superPts(x, (laneY(0) + laneY(3) + L.H) / 2, L.cell - 2, 4 * L.H + 3 * L.gap + 14, 22, 6), { z: Z.annot, w: 4.5, color: C.red, closed: true, opacity: 1 - clamp((u - 0.6) / 0.4), draw: EASE.out(clamp(u * 3)) });
        }
        const b = EASE.back(clamp((t - rt - 0.1) / 0.3)); if (b > 0) box4(`${k}.bx${j}`, BOX_X[j], BOX_Y, Math.max(0.01, b));
      });
      // after four rounds: the lanes go on
      if (t >= T.DOTS) [0, 1, 2, 3].forEach(r => text(`${k}.dots${r}`, '……', 905, laneCY(r), { size: 40, color: C.pencil, z: Z.front, anchor: 'middle', opacity: clamp((t - T.DOTS - r * 0.08) / 0.25) }));
      // 每个数只轮到一次: a red dot hops over the bricks in order 0, 1, 2 … 15
      const hu = (t - T.HOP0) / T.HOP_DT;
      if (hu >= 0 && hu < 16) {
        const i = Math.floor(hu), f = hu - i, a = N2.laneXY(L, i), b = N2.laneXY(L, Math.min(15, i + 1));
        const p = i >= 15 ? a : lerp2(a, b, EASE.io(f)), lift = i >= 15 ? 0 : 26 * Math.sin(Math.PI * f);
        dot(k + '.hop', [p[0], p[1] - 44 - lift], 10, C.red, Z.annot + 1);
      }
      // 6 is only in one lane: the other three lanes fade back (a paper veil), a red ring round brick 6
      const vu = clamp((t - T.VEIL) / 0.35) * (1 - clamp((t - T.VEIL_OFF) / 0.35));
      if (vu > 0) [0, 1, 3].forEach(r => stroke(`${k}.veil${r}`, N2.box(L.x - 80, laneY(r) - 6, L.x + L.W + 8, laneY(r) + L.H + 6), { z: Z.front + 1, w: 1, fill: C.paper, noStroke: true, opacity: 0.62 * vu, boil: 0 }));
      const su = clamp((t - T.SIX) / 0.3) * (1 - clamp((t - T.SIX_OFF) / 0.3));
      if (su > 0) { const [x, y] = N2.laneXY(L, 6); stroke(k + '.six', ringPts(k + '.sixp', x, y, 66, 46, { n: 14, a0: -130, sweep: 385, rv: 0.04 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - T.SIX) / 0.3)), opacity: su }); }
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [
      ...Array.from({ length: 16 }, (_, n) => [T.BRICK0 + n * T.BRICK_DT + T.DROP, 'tap']),
      ...ROUND_T.map(rt => [rt + 0.1, 'pop']), [T.DOTS, 'pen'], [T.HOP0, 'hop'], [T.HOP0 + 0.8, 'hop'], [T.SIX, 'plip'],
    ],
  };
  const bricks = { type: 'l2_bricks', id: 'l2br', t1: T.OLD_OUT };
  // 排哪条就余几: brick 9, the 9-dot row's odd dot, and the label 余1 get a red ring
  const nineRings = {
    type: 'n2_fn', id: 'l2r9', t0: T.R9[0], cues: T.R9.map(r => [r, 'pen']),
    fn: (t, lt, k) => {
      const o = 1 - clamp((t - T.R9_OUT) / 0.3); if (o <= 0) return;
      const [bx, by] = N2.laneXY(L, 9);
      const R = [[bx, by, 60, 42], [RED9b[0], RED9b[1], 26, 26], [L.x - 44, laneCY(1), 46, 32]];
      R.forEach(([x, y, rx, ry], i) => { const u = clamp((t - T.R9[i]) / 0.3); if (u > 0) stroke(`${k}.r${i}`, ringPts(`${k}.rp${i}`, x, y, rx, ry, { n: 14, a0: -130, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(u), opacity: o }); });
    },
  };

  /* ---------------- 地图：右门打开，门后是跑道，门楣"余数门"；跑道缩进顶栏 ---------------- */
  const map = { type: 'n2_map', id: 'l2map', t0: T.MAP, t1: T.MAP_OUT, fog: true, doorR: [[T.DOOR, 0, 1], [T.FLY, 0, 0]], openR: T.OPEN, labelR: T.LABEL };
  // a copy of the four little lanes behind the door flies up into the top bar and becomes the thin lane strip
  COMP.l2_fly = {
    draw(fx, t) {
      if (t < T.FLY) return;
      const o = 1 - clamp((t - T.STRIP - 0.05) / 0.3); if (o <= 0) return;
      const u = EASE.io(clamp((t - T.FLY) / (T.STRIP - T.FLY))), k = fx.id, [sx0, sy0, sx1] = N2.HUD_GEO.strip;
      for (let r = 0; r < 4; r++) {
        const a = [1219, 370 + r * 62, 1381, 416 + r * 62], b = [sx0, sy0 + r * 20, sx1, sy0 + r * 20 + 15];
        const [x0, y0, x1, y1] = a.map((v, i) => lerp(v, b[i], u));
        stroke(`${k}.b${r}`, N2.box(x0, y0, x1, y1), { z: Z.annot - 2.5, w: lerp(3, 2.5, u), fill: C.paper, opacity: o });
        N2.fill(`${k}.f${r}`, x0 + 2, y0 + 2, x0 + lerp(44, x1 - x0 - 2, u), y1 - 2, r, { z: Z.annot - 2.4, step: lerp(12, 9, u), dot: lerp(2.6, 2, u), w: lerp(2.6, 1.6, u), opacity: o });
      }
    },
    cues: () => [[T.FLY, 'whoosh']],
  };

  /* ---------------- 小问号 ---------------- */
  const qm = {
    type: 'qm', id: 'l2qm', size: 130, t0: T.QM, burst: true, signSize: 56,
    pos: [[0, [800, 736]], [T.QM_MOVE, [1450, FL], 0.7, 'io'], [T.QM_EXIT, [1780, FL], 0.8, 'in']],
    mood: [[0, 'neutral'], [T.PANELS, 'doubt'], [T.G9, 'neutral'], [T.RING9, 'happy'], [T.FIVE, 'neutral'], [T.GRAB, 'surprised'], [T.CARD, 'happy'],
      [T.LANES, 'neutral'], [ROUND_T[0], 'happy'], [T.HOP0, 'neutral'], [T.SIX, 'surprised'], [T.SIX + 0.8, 'happy']],
    act: [[0, 'idle'], [T.QM_MOVE, 'hop'], [T.QM_MOVE + 0.75, 'idle'], [ROUND_T[0], 'nod'], [ROUND_T[0] + 1, 'idle'], [T.SIX + 0.8, 'nod'], [T.SIX + 1.6, 'idle'], [T.QM_EXIT, 'hop']],
    sign: [[0, null], [T.SIGN, '哪一种？'], [T.SIGN_OFF, null]],
    gaze: [[0, [800, 260]], [T.FLASH[0], [tcx(2), 250]], [T.FLASH[2], [tcx(10), 250]], [T.PANELS, 'l2pn.L'], [3.6, 'l2pn.R'], [T.SIGN_OFF, 'viewer'],
      [T.G9, [500, 330]], [T.DIV, [420, 440]], [T.FIVE, [1080, 330]], [T.CARD, [1100, 545]], [T.LANES, [700, 420]], [T.BRICK0, [430, 300]],
      [ROUND_T[1], [640, 400]], [ROUND_T[3], [760, 480]], [T.R9[0], [540, 430]], [T.HOP0, [500, 400]], [T.SIX, [540, 520]], [T.QM_EXIT, [1800, 600]]],
  };

  defineScene({
    id: 'lanes', chapter: '四条跑道', dur: T.DUR, floor: FL,
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'lanes', strip: T.STRIP },
      table, panels, g9, ...nine, five, remCard,
      lanes, bricks, nineRings,
      { type: 'n2_flip', id: 'l2flip', t0: T.FLIP, dur: T.FLIP_DUR },
      map,
      { type: 'l2_fly', id: 'l2fly' },
      qm,
    ],
    subs: [
      {"t0": 0.3, "t1": 4.95, "text": "“上集的空格：还没找到，还是根本没有？”", "voice": "qm", "say": "上集的空格：还没找到，还是根本没有？"},
      {"t0": 5.45, "t1": 10.55, "text": "说好分平方：9是3×3，两组4个剩1个。", "say": "说好分平方：九是三乘三，两组四个，剩一个。"},
      {"t0": 10.8, "t1": 14.89, "text": "剩下的零头，就是你做除法时的余数；"},
      {"t0": 15.09, "t1": 19.73, "text": "剩够4个还能再凑一组，所以只能是0到3。", "say": "剩够四个还能再凑一组，所以只能是零到三。"},
      {"t0": 20.13, "t1": 24.41, "text": "不光平方：把每个数轮着排进四条跑道，"},
      {"t0": 24.61, "t1": 29.44, "text": "每满一轮多一组4个，所以排哪条就余几。", "say": "每满一轮，多一组四个，所以排哪条，就余几。"},
      {"t0": 29.74, "t1": 34.2, "text": "每个数只轮到一次，所以只在一条跑道上。"},
      {"t0": 34.6, "t1": 38.88, "text": "地图上看“剩几个”的门，就叫余数门。"},
    ],
  });
})();
