// 第 15 场 · 为什么偏偏按 4 分（why4）
// 小问号举牌"为什么是 4？"。第 1 集 1–16 的两行表回来，空格 2、6、10、14 依次闪，之间画红弧"隔 4"。
// 下面一小堆：2 个点（黄色荧光笔垫着）；左边一个一个加上红色 4 点方框：6、10、14，零头那 2 个点始终不动。
// 表里的 2、6、10、14 变成数字砖，一起落进余 2 跑道。卡①"多一整组或拿走一整组，零头不变"写出来，飞进顶栏。
// Jasper 走进来举牌"两个两个分！"。画面换成两堆：偶数堆、奇数堆；4（┐）和 6（红色 ?）挤在偶数堆里，红笔"分不开"。
// 换回四条跑道：4、8、12 落进余 0（带 ┐），2、6、10、14 落进余 2（红 ?）。Jasper 走出左边。
// 开场：只有顶栏细跑道条；结尾：只剩顶栏（细跑道条 + 卡①）。
(() => {
  const FL = N2.FL, W = N2.W;

  /* ---------------- the maths, checked ---------------- */
  const ways = n => { const w = []; for (let a = 1; a <= n; a++) for (let b = 0; b < a; b++) if (a * a - b * b === n) w.push([a, b]); return w; };
  const NUMS = Array.from({ length: 16 }, (_, i) => i + 1), BLANK = NUMS.filter(n => !ways(n).length);
  if (BLANK.join() !== '2,6,10,14') console.error('w2_why4: the blanks of the 1–16 table', BLANK);
  // 2, 6, 10, 14: 2 plus 0, 1, 2, 3 whole groups of 4, so the bit left over is always 2
  BLANK.forEach((n, k) => { if (n !== 2 + 4 * k || n % 4 !== 2 || (n - 2) / 4 !== k) console.error('w2_why4: blank', n, 'is 2 + 4 ×', k); });
  // 两个两个分: 4 has a way (┐), 6 has none yet, but both are even, so pairing cannot tell them apart
  const EVENS = [2, 4, 6, 8, 10, 12, 14], ODDS = [1, 3, 5, 7, 9];
  if (!ways(4).length || ways(6).length || 4 % 2 !== 0 || 6 % 2 !== 0) console.error('w2_why4: 4 and 6 in the same even pile');
  if (EVENS.some(n => n % 2) || ODDS.some(n => n % 2 === 0)) console.error('w2_why4: piles');
  // 按 4 分: 4, 8, 12 go to lane 0 and have a way; the blanks go to lane 2 and have none
  const TO0 = [4, 8, 12], TO2 = [2, 6, 10, 14];
  if (TO0.some(n => n % 4 !== 0 || !ways(n).length) || TO2.some(n => n % 4 !== 2 || ways(n).length)) console.error('w2_why4: lanes 0 and 2');
  if ([...TO0, ...TO2].sort((a, b) => a - b).join() !== EVENS.join()) console.error('w2_why4: every even brick lands somewhere');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    QM: 0.15, QSIGN: 0.7, QSIGN_OFF: 3.95, QM_MOVE: 3.95, QM_EXIT: 8.9,
    GRID: 4.15, NUM: 4.3, TICK: 4.6, FLASH: [5.5, 5.95, 6.45, 6.95], ARC: [7.8, 8.2, 8.6],
    PILE: 9.85, HI: 10.3, BOX: [10.9, 11.35, 11.8], KEEP: 12.15, LANE: 12.45, FLY0: 12.95, FLY_DT: 0.12, FLY_DUR: 0.55,
    TB_OUT: 13.4, PILE_OUT: 13.9, CARD: 13.75, DOCK: 16.6,
    KID_IN: 14.0, KID_AT: 14.8, SIGN: 15.0, SIGN_OFF: 18.3, LANE_OUT: 18.2,
    HEAPS: 18.5, MARK4: 19.9, Q6: 21.3, SQUEEZE: 23.4, APART: 25.1, HEAPS_OUT: 26.3, ROW: 26.6,
    LANES: 26.85, DROP0: [28.0, 28.4, 28.8], DROP2: [30.0, 30.3, 30.6, 30.9], DROP_DUR: 0.4,
    KID_OUT: 31.4, KID_GONE: 32.35, END_OUT: 31.95, DUR: 32.7,
  };

  /* ---------------- 1–16 two-row table, blanks, arcs "隔 4" ---------------- */
  const TX0 = 304, TCW = 62, TY0 = 290, TCH = 70, TX1 = TX0 + 16 * TCW, TY1 = TY0 + TCH, TY2 = TY0 + 2 * TCH;
  const tcx = n => TX0 + (n - 0.5) * TCW, tNS = n => (n >= 10 ? 36 : 42), tNY = TY0 + TCH / 2;
  const tableGrid = {
    type: 'n2_fn', id: 'w2tGr', t0: T.GRID, cues: [[T.GRID, 'pen']],
    fn: (t, lt, k) => {
      stroke(k + '.o', N2.box(TX0, TY0, TX1, TY2), { z: Z.board, w: 4, draw: EASE.out(clamp(lt / 0.4)) });
      stroke(k + '.m', [[TX0, TY1], [TX1, TY1]], { z: Z.board, w: 3, draw: EASE.out(clamp((lt - 0.15) / 0.3)) });
      for (let i = 1; i < 16; i++) stroke(`${k}.v${i}`, [[TX0 + i * TCW, TY0], [TX0 + i * TCW, TY2]], { z: Z.board, w: 3, draw: EASE.out(clamp((lt - 0.2 - i * 0.01) / 0.2)) });
    },
  };
  const tableNums = NUMS.map((n, i) => W('w2tN' + n, String(n), tcx(n), TY0 + (TCH - tNS(n)) / 2, tNS(n), T.NUM + i * 0.025, { anchor: 'middle', speed: 7000, silent: i % 5 !== 0, sfx: 'pen' }));
  const tableTicks = NUMS.filter(n => !BLANK.includes(n)).map((n, i) => W('w2tK' + n, '✓', tcx(n), TY1 + (TCH - 40) / 2, 40, T.TICK + i * 0.02, { anchor: 'middle', color: 'red', speed: 6000, silent: i % 4 !== 0 }));
  const tableBlanks = {
    type: 'n2_fn', id: 'w2tBl', t0: T.TICK, cues: T.FLASH.map(f => [f, 'plip']),
    fn: (t, lt, k) => BLANK.forEach((n, i) => {
      const x = tcx(n), y = (TY1 + TY2) / 2, hw = 22, hh = 26, P = [[x - hw, y - hh], [x + hw, y - hh], [x + hw, y + hh], [x - hw, y + hh]];
      P.forEach((p, j) => N2.dash(`${k}.${n}.${j}`, p, P[(j + 1) % 4], { step: 13, on: 7, w: 2.6 }));
      const u = clamp((t - T.FLASH[i]) / 0.25); if (u <= 0) return;
      const pv = (t - T.FLASH[i]) / 0.45, s = pv > 0 && pv < 1 ? 1 + 0.18 * Math.sin(Math.PI * pv) : 1;
      stroke(`${k}.r${n}`, ringPts(`${k}.rp${n}`, x, tNY, 26 * s, 30 * s, { n: 12, a0: -140, sweep: 385, rv: 0.04 }), { z: Z.annot, w: 4, color: C.red, draw: EASE.out(u) });
    }),
  };
  const arcPts = (a, b) => { const p = [tcx(a) + 8, TY0 - 8], q = [tcx(b) - 8, TY0 - 8]; return { p, q }; };
  const arcs = {
    type: 'n2_fn', id: 'w2tAr', t0: T.ARC[0], cues: T.ARC.map(a => [a, 'pen']),
    fn: (t, lt, k) => [[2, 6], [6, 10], [10, 14]].forEach(([a, b], i) => {
      const p = EASE.out(clamp((t - T.ARC[i]) / 0.35)); if (p <= 0) return;
      const A = arcPts(a, b);
      arrow(`${k}.a${i}`, A.p, A.q, { p, bend: -0.28, color: C.red, w: 4, head: 16 });
      const lu = clamp((t - T.ARC[i] - 0.2) / 0.2); if (lu <= 0) return;
      text(`${k}.l${i}`, '隔 4', (A.p[0] + A.q[0]) / 2, TY0 - 82, { size: 40, color: C.red, z: Z.annot, opacity: lu, scale: lerp(0.6, 1, EASE.back(lu)), halo: 8 });
    }),
  };
  const table = { type: 'n2_grp', id: 'w2tb', out: T.TB_OUT, inner: [tableGrid, ...tableNums, ...tableTicks, tableBlanks, arcs] };

  /* ---------------- 2 个点 + 一个一个加上 4 点方框：6、10、14（零头不动） ---------------- */
  const PY = 610, DOTX = [640, 684], BOXX = [560, 482, 404];
  const box4 = (k, x, y, s, o = {}) => {
    stroke(k + '.b', N2.box(x - 32 * s, y - 32 * s, x + 32 * s, y + 32 * s), { z: o.z ?? Z.front, w: 4, color: C.red, fill: C.paper, opacity: o.opacity });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], i) => dot(`${k}.d${i}`, [x + a * 13 * s, y + b * 13 * s], 7 * s, C.ink, (o.z ?? Z.front) + 0.1));
  };
  COMP.w2_pile = {
    draw(fx, t) {
      if (t < T.PILE) return;
      const out = clamp((t - T.PILE_OUT) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, lt = t - T.PILE;
      const nb = T.BOX.filter(b => t >= b).length, val = 2 + 4 * nb, last = nb ? T.BOX[nb - 1] : T.PILE;
      const pop = 1 + 0.25 * Math.sin(Math.PI * clamp((t - last) / 0.3));
      text(k + '.n', String(val), 200, PY, { size: 84, z: Z.front, anchor: 'middle', scale: pop, opacity: clamp(lt / 0.2) });
      text(k + '.eq', '=', 300, PY, { size: 64, z: Z.front, anchor: 'middle', opacity: clamp(lt / 0.2) });
      // the leftover 2 dots never move: yellow highlighter under them
      const hu = clamp((t - T.HI) / 0.35);
      if (hu > 0) stroke(k + '.hi', [[DOTX[0] - 30, PY + 2], [DOTX[1] + 30, PY - 2]], { z: Z.hi, w: 52, color: C.hi, draw: EASE.out(hu), opacity: 0.9 });
      DOTX.forEach((x, i) => { const a = EASE.back(clamp((lt - i * 0.1) / 0.25)); if (a > 0) dot(`${k}.d${i}`, [x, PY], 14 * a, C.ink, Z.front); });
      T.BOX.forEach((bt, i) => {
        const u = clamp((t - bt) / 0.3); if (u <= 0) return;
        box4(`${k}.bx${i}`, BOXX[i], lerp(PY - 110, PY, EASE.back(u)), 1, { opacity: clamp(u * 3) });
      });
      const ku = clamp((t - T.KEEP) / 0.3);
      if (ku > 0) stroke(k + '.keep', ringPts(k + '.kp', (DOTX[0] + DOTX[1]) / 2, PY, 52, 38, { n: 14, a0: -130, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(ku) });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.PILE, 'pop'], [T.HI, 'swish'], ...T.BOX.map(b => [b + 0.2, 'tap']), [T.KEEP, 'pen']],
  };

  /* ---------------- 余 2 跑道（只画这一条）：表里的 2、6、10、14 一起落进来 ---------------- */
  const L1 = { x: 850, y: 520 - 2 * 92, W: 640, H: 76, gap: 16, head: 70, cell: 110 };
  const lane2 = { type: 'n2_lanes', id: 'w2l2', ...L1, lanes: [2], t0: T.LANE, t1: T.LANE_OUT };
  COMP.w2_fly4 = {
    draw(fx, t) {
      if (t < T.FLY0) return;
      const out = clamp((t - T.LANE_OUT) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length;
      TO2.forEach((n, i) => {
        const u = clamp((t - T.FLY0 - i * T.FLY_DT) / T.FLY_DUR); if (u <= 0) return;
        const a = [tcx(n), tNY], b = N2.laneXY(L1, n), e = EASE.io(u), p = lerp2(a, b, e);
        N2.brick(`${k}.b${n}`, p[0], p[1] - 90 * Math.sin(Math.PI * e), n, 2, { scale: lerp(0.62, 1, e) });
      });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => TO2.map((n, i) => [T.FLY0 + i * T.FLY_DT + T.FLY_DUR, 'tap']),
  };

  /* ---------------- 卡①：多一整组或拿走一整组，零头不变（写完飞进顶栏） ---------------- */
  const card1 = { type: 'n2_bigcard', id: 'w2c1', n: 1, at: [800, 330], w: 780, size: 52, lines: ['多一整组或拿走一整组，', '零头不变'], t0: T.CARD, dock: T.DOCK };

  /* ---------------- 两堆：偶数堆、奇数堆（白砖：不刷花纹） ---------------- */
  const HE = [700, 525], HO = [1235, 525];
  const PILE_POS = { 2: [565, 452, -5], 4: [668, 444, 4], 6: [772, 456, -3], 8: [600, 534, 3], 10: [708, 528, -4], 12: [815, 540, 5], 14: [700, 612, 2],
    1: [1140, 460, 4], 3: [1245, 452, -4], 5: [1345, 466, 3], 7: [1185, 545, -3], 9: [1295, 548, 5] };
  const ROW_X = n => 520 + EVENS.indexOf(n) * 106, ROW_Y = 245;
  const L4 = { x: 430, y: 330, W: 1000, H: 76, gap: 16, head: 70, cell: 110 };
  const dropT = n => (TO0.includes(n) ? T.DROP0[TO0.indexOf(n)] : T.DROP2[TO2.indexOf(n)]);
  // Jasper's ┐ on a brick (has a small corner), or a red ? (not found yet), at the brick's top-right corner;
  // q = 1 once the brick is in a lane: the mark tucks onto the brick's corner so it stays inside the lane
  const markOn = (k, x, y, kind, a, q = 0) => {
    if (a <= 0) return;
    if (kind === 'mark') { const dx = lerp(0, -8, q), dy = lerp(0, 12, q); stroke(k, [[x + 30 + dx, y - 46 + dy], [x + 58 + dx, y - 46 + dy, 1], [x + 58 + dx, y - 18 + dy]], { z: Z.annot, w: 5.5, color: C.red, draw: EASE.out(a) }); }
    else text(k, '?', x + lerp(52, 47, q), y + lerp(-36, -16, q), { size: lerp(50, 40, q), color: C.red, z: Z.annot, anchor: 'middle', font: CFG.FONT_MIX, opacity: clamp(a * 2), scale: lerp(0.5, 1, EASE.back(a)), halo: 6 });
  };
  COMP.w2_heaps = {
    draw(fx, t) {
      if (t < T.HEAPS) return;
      const out = clamp((t - T.END_OUT) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, lt = t - T.HEAPS;
      // the two heap outlines, their names, the red ring and "分不开" (all fade when the lanes come)
      const ho = 1 - clamp((t - T.HEAPS_OUT) / 0.35);
      if (ho > 0) {
        const m0 = DL.items.length, d = EASE.out(clamp(lt / 0.45));
        stroke(k + '.he', ringPts(k + '.hep', HE[0], HE[1], 270, 165, { n: 18, a0: -100, sweep: 372, rv: 0.06 }), { z: Z.set, w: 5, draw: d, fill: '#F4EFE4' });
        stroke(k + '.ho', ringPts(k + '.hop', HO[0], HO[1], 215, 150, { n: 18, a0: -100, sweep: 372, rv: 0.06 }), { z: Z.set, w: 5, draw: d, fill: '#F4EFE4' });
        text(k + '.ne', '偶数堆', HE[0], 322, { size: 48, z: Z.board, anchor: 'middle', opacity: clamp((lt - 0.3) / 0.3) });
        text(k + '.no', '奇数堆', HO[0], 336, { size: 48, z: Z.board, anchor: 'middle', opacity: clamp((lt - 0.3) / 0.3) });
        text(k + '.more', '……', HO[0] + 50, 616, { size: 44, z: Z.board, anchor: 'middle', color: C.pencil, opacity: clamp((lt - 0.8) / 0.3) });
        const su = clamp((t - T.SQUEEZE) / 0.35);
        if (su > 0) stroke(k + '.sq', ringPts(k + '.sqp', 720, 450, 128, 58, { n: 16, a0: -130, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(su) });
        const au = clamp((t - T.APART) / 0.3);
        if (au > 0) text(k + '.ap', '分不开', HE[0], 724, { size: 52, color: C.red, z: Z.annot, anchor: 'middle', opacity: clamp(au * 2), scale: lerp(0.6, 1, EASE.back(au)), rot: -3, halo: 8 });
        if (ho < 1) N2.fadeFrom(m0, ho);
      }
      // odd bricks: in their heap, fade with it
      ODDS.forEach((n, i) => {
        const a = EASE.back(clamp((lt - 0.3 - i * 0.06) / 0.25)); if (a <= 0 || ho <= 0) return;
        const [x, y, r] = PILE_POS[n], m0 = DL.items.length;
        DL.save(); DL.translate(x, y); DL.rotate(r); N2.brick(`${k}.o${n}`, 0, 0, n, null, { scale: Math.max(0.01, a) }); DL.restore();
        if (ho < 1) N2.fadeFrom(m0, ho);
      });
      // even bricks: heap → a row on top → their lanes (4, 8, 12 to lane 0 with ┐; 2, 6, 10, 14 to lane 2 with ?)
      EVENS.forEach((n, i) => {
        const a = EASE.back(clamp((lt - 0.2 - i * 0.06) / 0.25)); if (a <= 0) return;
        const [hx, hy, hr] = PILE_POS[n], ru = EASE.io(clamp((t - T.ROW - i * 0.03) / 0.4));
        let x = lerp(hx, ROW_X(n), ru), y = lerp(hy, ROW_Y, ru), rot = lerp(hr, 0, ru);
        const dt = dropT(n), du = clamp((t - dt) / T.DROP_DUR), [lx, ly] = N2.laneXY(L4, n);
        if (du > 0) { const e = EASE.in(du); x = lerp(x, lx, e); y = lerp(y, ly, e); }
        const landed = du >= 1, after = t - dt - T.DROP_DUR, bob = landed && after < 0.16 ? -6 * Math.sin(Math.PI * after / 0.16) : 0;
        DL.save(); DL.translate(x, y + bob); DL.rotate(rot);
        N2.brick(`${k}.e${n}`, 0, 0, n, landed ? n % 4 : null, { scale: Math.max(0.01, a) });
        // marks travel with their brick
        if (n === 4) markOn(`${k}.m${n}`, 0, 0, 'mark', clamp((t - T.MARK4) / 0.3), du);
        else if (TO0.includes(n)) markOn(`${k}.m${n}`, 0, 0, 'mark', clamp((t - dt - T.DROP_DUR) / 0.3), 1);
        if (n === 6) markOn(`${k}.q${n}`, 0, 0, 'q', clamp((t - T.Q6) / 0.3), du);
        else if (TO2.includes(n)) markOn(`${k}.q${n}`, 0, 0, 'q', clamp((t - dt - T.DROP_DUR) / 0.3), 1);
        DL.restore();
      });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.HEAPS, 'paper'], [T.HEAPS + 0.3, 'pop'], [T.MARK4, 'pen'], [T.Q6, 'plip'], [T.SQUEEZE, 'pen'], [T.APART, 'stamp'], [T.ROW, 'swish'],
      ...[...T.DROP0, ...T.DROP2].map(d => [d + T.DROP_DUR, 'tap'])],
  };
  const lanes4 = { type: 'n2_lanes', id: 'w2ln', ...L4, t0: T.LANES, t1: T.END_OUT };

  /* ---------------- Jasper 的牌 ---------------- */
  const GRIP = [300, 560], SIGN_AT = [300, 460];
  Object.assign(POSE, {
    w2_hold: { lean: 2, tilt: 5, armScale: 1.5, ikR: { w: 1, to: 'abs', dx: GRIP[0], dy: GRIP[1], bend: 'out' }, ikL: { w: 1, to: 'hip', dx: -26, dy: -6, bend: 'out' } },
    w2_ptR: { lean: 2, tilt: 4, armScale: 1.5, armR: [108, 6], armL: [16, 10] },
  });
  const sign = { type: 'n2_grp', id: 'w2sg', out: T.SIGN_OFF, inner: { type: 'prop', kind: 'n1_sign', id: 'w2sign', at: SIGN_AT, text: '两个两个分！', w: 340, size: 46, t0: T.SIGN, drawDur: 0.3, sfxAt: [[T.SIGN, 'whip']] } };

  /* ---------------- 小问号 ---------------- */
  const qm = {
    type: 'qm', id: 'w2qm', size: 140, t0: T.QM, burst: true, signSize: 54,
    pos: [[0, [800, FL]], [T.QM_MOVE, [1440, FL], 0.65, 'io'], [T.QM_EXIT, [1780, FL], 0.8, 'in']],
    mood: [[0, 'doubt'], [T.QSIGN_OFF, 'neutral'], [T.FLASH[0], 'surprised'], [T.ARC[0], 'happy']],
    act: [[0, 'idle'], [T.QSIGN, 'tap'], [2.6, 'idle'], [T.QM_MOVE, 'hop'], [T.QM_MOVE + 0.7, 'idle'], [T.ARC[1], 'nod'], [T.ARC[2] + 0.6, 'idle'], [T.QM_EXIT, 'hop']],
    sign: [[0, null], [T.QSIGN, '为什么是 4？'], [T.QSIGN_OFF, null]],
    gaze: [[0, 'viewer'], [T.QSIGN_OFF, [800, 340]], [T.FLASH[0], [tcx(2), 320]], [T.FLASH[2], [tcx(10), 320]], [T.ARC[0], [tcx(8), 240]], [T.QM_EXIT, [1800, 600]]],
  };

  defineScene({
    id: 'why4', dur: T.DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        pos: [[0, [-130, FL]], [T.KID_IN, [220, FL], T.KID_AT - T.KID_IN, 'lin'], [T.KID_OUT, [-170, FL], T.KID_GONE - T.KID_OUT, 'lin']],
        pose: [[0, makeWalk(T.KID_IN, T.KID_AT, 5.2)], [T.KID_AT, 'stand', 0.1], [T.SIGN, 'w2_hold', 0.15, 'back'], [T.SIGN_OFF, 'stand', 0.15],
          [T.MARK4 - 0.2, 'w2_ptR', 0.12, 'back'], [T.Q6 + 0.8, 'stand', 0.15], [T.APART, 'scratchStand', 0.14, 'back'], [T.HEAPS_OUT, 'stand', 0.15],
          [T.DROP0[0] - 0.2, 'w2_ptR', 0.12, 'back'], [T.DROP2[0] - 0.4, 'stand', 0.15], [T.DROP2[3] + 0.3, 'akimbo', 0.12, 'back'],
          [T.KID_OUT - 0.1, 'stand', 0.1], [T.KID_OUT, makeWalk(T.KID_OUT, T.KID_GONE, 5.2), 0.08]],
        face: [[0, 'smile'], [T.KID_AT, 'idea', 0.08], [T.SIGN + 0.3, 'proudGrin', 0.1], [T.SIGN_OFF, 'focus', 0.1], [T.Q6, 'surprised', 0.08], [T.Q6 + 0.9, 'focus', 0.1],
          [T.APART, 'puzzled', 0.1], [T.LANES, 'focus', 0.1], [T.DROP0[0], 'idea', 0.08], [T.DROP2[3] + 0.3, 'joy', 0.1]],
        turn: [[0, 0.4], [T.KID_OUT, -0.5, 0.1]],
        gaze: [[0, [700, 600]], [T.KID_AT, 'viewer'], [T.SIGN_OFF, [700, 470]], [T.MARK4, [668, 444]], [T.Q6, [772, 456]], [T.SQUEEZE, [720, 450]], [T.APART, 'viewer'],
          [T.ROW, [800, 260]], [T.DROP0[0], [655, 360]], [T.DROP0[2], [875, 360]], [T.DROP2[0], [545, 540]], [T.DROP2[3], [875, 540]], [T.DROP2[3] + 0.3, 'viewer'], [T.KID_OUT, [-200, 600]]],
      },
    },
    steps: [{ t0: T.KID_IN, t1: T.KID_AT, hz: 5.2 }, { t0: T.KID_OUT, t1: T.KID_GONE, hz: 5.2 }],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'why4', dock: [[T.DOCK, 1]] },
      table,
      { type: 'w2_pile', id: 'w2pile' },
      lane2, { type: 'w2_fly4', id: 'w2fly' },
      card1,
      sign,
      { type: 'w2_heaps', id: 'w2hp' },
      lanes4,
      qm,
    ],
    subs: [
      {"t0": 0.6, "t1": 3.85, "text": "“为什么偏偏四个四个分？”", "voice": "qm", "say": "为什么偏偏四个四个分？"},
      {"t0": 4.1, "t1": 9.58, "text": "上集的空格2、6、10、14，隔4一个：", "say": "上集的空格：二、六、十、十四，隔四一个："},
      {"t0": 9.78, "t1": 14.47, "text": "2余2；多一整组零头不变，所以全余2。", "say": "二余二；多一整组，零头不变，所以全余二。"},
      {"t0": 14.87, "t1": 18.35, "text": "“两个两个分，不是更简单？”", "voice": "kid", "say": "两个两个分，不是更简单？"},
      {"t0": 18.55, "t1": 22.64, "text": "两个两个分：4有写法，6还没找到，", "say": "两个两个分：四有写法，六还没找到，"},
      {"t0": 22.84, "t1": 26.57, "text": "却挤在同一个偶数堆里，分不开。"},
      {"t0": 26.82, "t1": 32.23, "text": "按4分：4、8、12去余0，空格去余2。", "say": "按四分：四、八、十二去余零，空格去余二。"},
    ],
  });
})();
