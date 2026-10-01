// 第 58 场 · 写下来：小陶把想通的过程写成三行证明，小问号读一行点一次头；
// 换成真正的 8×8 棋盘：完整棋盘的骨牌摆法有 12,988,816 种（一秒试一种 ≈ 150 天 ≈ 5 个月）；剪掉两个角、涂上颜色：黑 30 白 32，盖不满！
(() => {
  const FL = 780, TOP = 600, STOOL = 652, TX = 1350;
  const DESK = { x: 1270, w: 300 }, PAPER = [1238, TOP - 4];   // the little sheet Terry writes on
  const PAGE = [548, 385], PW = 900, PH = 560;                    // the same sheet, blown up
  const CUT_T = 13.45;                                            // the page goes, the 8×8 board comes
  const ZIN = 0.15, ZDUR = 0.35, PAPER_C = [PAPER[0], PAPER[1] - 5];  // the page zooms up out of the little sheet, and back into it at CUT_T

  /** a group of ordinary fx drawn together, with an optional moving transform (xf: t => DL ops) and a fade (op: t => 0..1) — for exits.
   *  (same code in 55_aha.js, so each scene builds on its own) */
  COMP.a3_grp = {
    init(fx) { fx.items.forEach(it => { const c = COMP[it.type]; if (c.init) c.init(it); }); return fx; },
    draw(fx, t, F) {
      if ((fx.t0 !== undefined && t < fx.t0) || (fx.t1 !== undefined && t >= fx.t1)) return;
      const n0 = DL.items.length;
      DL.save(); if (fx.xf) fx.xf(t);
      fx.items.forEach(it => COMP[it.type].draw(it, t, F));
      DL.restore();
      const op = fx.op ? fx.op(t) : 1;
      if (op < 0.999) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * op).toFixed(3); }
    },
    cues: fx => fx.items.flatMap(it => (COMP[it.type].cues ? COMP[it.type].cues(it) : [])),
  };
  const fadeOut = (t0, d = 0.3) => t => 1 - clamp((t - t0) / d);
  /** page zoom: 0 = shrunk onto the desk sheet, 1 = full size */
  const zoomK = t => EASE.out(clamp((t - ZIN) / ZDUR)) * (1 - EASE.in(clamp((t - CUT_T + ZDUR) / ZDUR)));
  const pageXf = t => { const k = zoomK(t), c = lerp2(PAPER_C, PAGE, k); DL.translate(c[0], c[1]); DL.scale(lerp(0.06, 1, k)); DL.translate(-PAGE[0], -PAGE[1]); };

  /* ---------------- the page: a loose sheet of notebook paper (same look as ep2's) ---------------- */
  PROPS.a3_page = (fx, t, lt, p) => {
    const W = fx.w || 520, H = fx.h || 520, z = Z.set, k = fx.id;
    stroke(k + '.sheet', [[-W / 2, -H / 2], [W / 2, -H / 2 + 4, 1], [W / 2 - 3, H / 2, 1], [-W / 2 + 4, H / 2 - 3, 1], [-W / 2, -H / 2, 1]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.shade', [[-W / 2 + 12, H / 2 + 8], [W / 2 + 7, H / 2 + 6, 1], [W / 2 + 7, -H / 2 + 12]], { z: z - 0.5, w: 2.4, color: C.pencil, opacity: 0.6 * p, boil: 0.5 });
    const n = fx.lines ?? 5, top = -H / 2 + (fx.title ? 110 : 70);
    for (let i = 0; i < n; i++) {
      const y = top + i * ((H / 2 - 40 - top) / Math.max(1, n - 1));
      stroke(k + '.l' + i, [[-W / 2 + 26, y], [W / 2 - 26, y + 1]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.5, draw: stag(p, 1, 3), boil: 0.4 });
    }
    stroke(k + '.m', [[-W / 2 + 60, -H / 2 + 14], [-W / 2 + 60, H / 2 - 14]], { z: z + 0.1, w: 2, color: C.red, opacity: 0.45, draw: stag(p, 2, 3), boil: 0.4 });
  };
  // rules sit at PAGE.y - PH/2 + 70 + i·(PH/2 − 40 − (−PH/2 + 70))/4  →  175, 287.5, 400, …: each line of writing sits just above one
  const LX = 172, LY = [244, 357, 470], LS = 46, CPS = 9;
  const LINES = [
    { text: '① 每块骨牌，盖住一黑一白。', t0: 1.5 },
    { text: '② 剪掉两个黑角：黑 6 个，白 8 个。', t0: 3.9 },
    { text: '③ 黑白不一样多，所以盖不满。', t0: 7.0 },
  ];
  LINES.forEach(L => { L.t1 = L.t0 + [...L.text].length / CPS; L.ck = L.t1 + 0.28; });
  const WRITING = LINES.map(L => [L.t0, L.t1]);

  /** the little sheet on the desk, pencil zoom lines up to the big page, and the pencil in Terry's hand */
  COMP.a3_deskPaper = {
    draw(fx, t, F) {
      const z = Z.desk + 1;
      stroke('a3dp.p', [[PAPER[0] - 34, PAPER[1]], [PAPER[0] - 28, PAPER[1] - 9, 1], [PAPER[0] + 30, PAPER[1] - 9, 1], [PAPER[0] + 36, PAPER[1], 1], [PAPER[0] - 34, PAPER[1], 1]], { z, w: 3.5, fill: C.paper });
      if (t < fx.t1) {
        const p = EASE.out(clamp((t - fx.t0) / 0.3)), x1 = PAGE[0] + PW / 2;
        stroke('a3dp.z0', [[PAPER[0] - 30, PAPER[1] - 9], [x1 + 2, PAGE[1] - PH / 2 + 6]], { z: Z.set - 1, w: 2, color: C.pencil, opacity: 0.8, draw: p, boil: 0.5 });
        stroke('a3dp.z1', [[PAPER[0] - 34, PAPER[1]], [x1 + 2, PAGE[1] + PH / 2 - 4]], { z: Z.set - 1, w: 2, color: C.pencil, opacity: 0.8, draw: p, boil: 0.5 });
      }
      const a = F.anchors.terry; if (!a) return;
      const h = a.handL, d = [-0.62, 0.78];                       // pencil: tip down-left of the hand
      stroke('a3dp.pen', [[h[0] - d[0] * 18, h[1] - d[1] * 18], [h[0] + d[0] * 20, h[1] + d[1] * 20]], { z: Z.front + 1, w: 6 });
      stroke('a3dp.tip', [[h[0] + d[0] * 20, h[1] + d[1] * 20], [h[0] + d[0] * 27, h[1] + d[1] * 27]], { z: Z.front + 1, w: 2.5 });
    },
    cues: fx => [[fx.t0, 'paper']],
  };

  /* ---------------- the real 8×8 board, and lots of ways to tile it ---------------- */
  const BC = [520, 400], BS = 64, N8 = 8;
  const BOARD_T = CUT_T + 0.1, TCUT = 25.3, TCOLOR = TCUT + 1.3;   // colouring starts once both corners have fallen away
  // tilings of the full board: every 2×2 block holds two horizontal or two vertical dominoes (picked by a fixed hash)
  const tiling = seed => {
    const dom = [];
    for (let br = 0; br < N8; br += 2) for (let bc = 0; bc < N8; bc += 2) {
      if (rnd(hstr('a3tile' + seed), br, bc) > 0) dom.push([br, bc, 'h'], [br + 1, bc, 'h']);
      else dom.push([br, bc, 'v'], [br, bc + 1, 'v']);
    }
    return dom;
  };
  // when each tiling shows up: a few at once for "一千多万种", then one a second for "一秒试一种"
  const TILE_T = [17.15, 18.45, 19.45, 20.15, 20.7, 21.15, 21.8, 22.8, 23.8];
  const TILE_END = 25.0, TILE_OUT = TILE_END + 0.3;               // tilings, the number and its labels fade out together
  const TILINGS = TILE_T.map((t0, i) => ({ t0, t1: TILE_T[i + 1] ?? TILE_OUT, dom: tiling(i + 3) }));
  TILINGS.forEach((T, i) => {
    const seen = new Set();
    T.dom.forEach(d => E3B.domCells(d).forEach(([r, c]) => { const k = r + '_' + c; if (r >= N8 || c >= N8 || seen.has(k)) console.error('a3_proof: bad tiling', i, d); seen.add(k); }));
    if (seen.size !== 64) console.error('a3_proof: tiling does not cover the board', i);
  });
  COMP.a3_tilings = {
    draw(fx, t) {
      const x0 = BC[0] - N8 * BS / 2, y0 = BC[1] - N8 * BS / 2, z = Z.set + 3, wO = 4.5;
      TILINGS.forEach((T, ti) => {
        if (t < T.t0 || t >= T.t1) return;
        const sweep = Math.min(0.55, (T.t1 - T.t0) * 0.5);
        T.dom.forEach((d, di) => {
          const [[r1, c1], [r2, c2]] = E3B.domCells(d);
          const u = clamp((t - T.t0 - ((r1 + c1) / 14) * sweep) / 0.12); if (u <= 0) return;
          const cx = x0 + ((c1 + c2) / 2 + 0.5) * BS, cy = y0 + ((r1 + r2) / 2 + 0.5) * BS;
          const hw = (d[2] === 'h' ? BS : BS / 2) - BS * 0.1, hh = (d[2] === 'h' ? BS / 2 : BS) - BS * 0.1;
          DL.save(); DL.translate(cx, cy); DL.scale(lerp(0.6, 1, EASE.back(u)));
          stroke(`a3t${ti}.${di}`, superPts(0, 0, hw * 2, hh * 2, 20, 6), { z, w: wO, closed: true, fill: 'none' });
          DL.restore();
        });
      });
    },
    cues: () => TILINGS.map((T, i) => [T.t0, i < 6 ? 'swish' : 'tap']),
  };

  /* ---------------- "剪掉两个角": the 8×8 puzzle board is the cut one (the 12,988,816 was for the full board) ---------------- */
  const CUTLBL_OUT = 27.3, TALLY_T = 27.75;
  const C00 = [BC[0] - 3.5 * BS, BC[1] - 3.5 * BS], C77 = [BC[0] + 3.5 * BS, BC[1] + 3.5 * BS];
  COMP.a3_cutLbl = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, pp = EASE.back(clamp(lt / 0.2)), at = [BC[0] + 10, 96];
      text('a3cl.t', '剪掉两个角', at[0], at[1], { size: 44, color: C.red, rot: -2, scale: lerp(0.6, 1, pp), opacity: clamp(lt / 0.08), halo: 8, z: Z.annot });
      arrow('a3cl.a0', [at[0] - 118, at[1] + 6], [C00[0] + 6, C00[1] - 22], { p: EASE.out(clamp((lt - 0.12) / 0.3)), bend: 0.25, color: C.red });
      arrow('a3cl.a1', [at[0] + 118, at[1] + 8], [C77[0] + 42, C77[1] - 6], { p: EASE.out(clamp((lt - 0.22) / 0.4)), bend: -0.33, color: C.red });
    },
    cues: fx => [[fx.t0, 'pop']],
  };

  /* ---------------- the verdict: a red rubber stamp ---------------- */
  COMP.a3_stamp = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const u = clamp((t - fx.t0) / 0.18), W = textWidth(fx.text, fx.size) / 2 + 40, H = fx.size * 0.78;
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(fx.rot || 0); DL.scale(lerp(1.9, 1, EASE.out(u)));
      const o = { z: Z.stamp - 1, color: C.red, opacity: u, boil: 0.6 };
      stroke(fx.id + '.o', [[-W, -H], [W, -H, 1], [W, H, 1], [-W, H, 1], [-W, -H, 1]], { ...o, w: 8, fill: C.paper });
      stroke(fx.id + '.i', [[-W + 13, -H + 13], [W - 13, -H + 13, 1], [W - 13, H - 13, 1], [-W + 13, H - 13, 1], [-W + 13, -H + 13, 1]], { ...o, w: 3.4 });
      text(fx.id + '.t', fx.text, 0, 4, { size: fx.size, color: C.red, z: Z.stamp - 0.5, opacity: u });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'stamp']],
  };

  /* ---------------- the facts, checked ---------------- */
  const cut8 = E3B.cells(N8, true), B30 = cut8.filter(([r, c]) => E3B.black(r, c)).length, W32 = cut8.length - B30;
  if (B30 !== 30 || W32 !== 32) console.error('a3_proof: 8×8 cut board should be 30 black + 32 white', B30, W32);
  const cut4 = E3B.cells(4, true), B6 = cut4.filter(([r, c]) => E3B.black(r, c)).length;
  if (B6 !== 6 || cut4.length - B6 !== 8) console.error('a3_proof: 4×4 cut board should be 6 black + 8 white');
  const days = 12988816 / 86400;                                  // 150.33… days ≈ 5 months
  if (Math.round(days) !== 150 || Math.round(days / 30) !== 5) console.error('a3_proof: 150 days', days);

  /* ---------------- poses ---------------- */
  const writeT = t => ({ ...POSE.sitHands, lean: -4, tilt: -8, armScale: 1.35,
    ikL: { w: 1, to: 'desk', dx: -6 + 12 * Math.sin(t * 9) + 7 * Math.sin(t * 3.1), dy: -3 - 4 * Math.abs(Math.sin(t * 17)), bend: 'down' } });
  const restT = { ...POSE.sitHands, lean: -2, tilt: -4, armScale: 1.35, ikL: { w: 1, to: 'desk', dx: 4, dy: -3, bend: 'down' } };
  const writing = t => WRITING.some(([a, b]) => t >= a && t < b);
  const writeOrRest = t => (writing(t) ? writeT(t) : restT);
  Object.assign(POSE, {
    a3_sitCheer: { ...POSE.sitHands, armScale: 1.7, armL: [145, 16], armR: [145, 16], ikL: { w: 0 }, ikR: { w: 0 } },
  });

  const RX = 885, RS = 64;                                         // right-hand column of red working
  defineScene({
    id: 'proof', chapter: '写下来', dur: 31.5, floor: FL,
    cast: { terry: { ...E3.terry, desk: [PAPER[0] + 4, TOP - 4] } },
    tracks: {
      terry: {
        pos: [[0, [TX, STOOL - 6]]],
        pose: [[0, writeOrRest], [27.7, 'sitHands', 0.15], [28.85, 'a3_sitCheer', 0.1, 'back']],
        face: [[0, 'focus'], [LINES[0].ck, 'smile', 0.05], [LINES[1].t0, 'focus', 0.05], [LINES[1].ck, 'smile', 0.05], [LINES[2].t0, 'focus', 0.05],
          [LINES[2].ck, 'proud', 0.05], [9.8, 'smile', 0.05], [BOARD_T, 'neutral', 0.05], [19.3, 'jaw', 0.06, 'back'], [21.2, 'surprised', 0.1],
          [22.6, 'sheepish', 0.08], [TCOLOR, 'idea', 0.06], [28.85, 'proudGrin', 0.05]],
        turn: [[0, -0.45], [9.8, -0.3, 0.12]],
        gaze: [[0, 'pen'], [9.8, 'qm'], [11.8, 'viewer'], [BOARD_T, 'board'], [19.0, 'num'], [21.8, 'board'], [27.75, 'tally'], [28.85, 'viewer']],
        squash: [[0, 1], [19.3, 1.08, 0.05], [19.36, 1, 0.2, 'back'], [28.85, 1.08, 0.05], [28.92, 1, 0.22, 'back']],
      },
    },
    targets: F => ({ pen: [PAPER[0] - 4, PAPER[1] - 6], qm: [1052, 620], board: BC, num: [RX + 180, 190], tally: [RX + 60, 260], page: [PAGE[0] + 200, 360] }),
    set: [
      { type: 'floor' },
      { type: 'stool', x: TX, seat: STOOL },
      { type: 'desk', x: DESK.x, top: TOP, w: DESK.w },
    ],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      // L1: the proof, written line by line; 小问号 reads along and nods; red ticks
      { type: 'a3_grp', id: 'a3gPage', t0: ZIN, t1: CUT_T, xf: pageXf, items: [
        { type: 'prop', kind: 'a3_page', id: 'a3pg', at: PAGE, rot: -1, t0: ZIN, w: PW, h: PH, lines: 5, drawDur: 0, sfxAt: [[ZIN, 'paper']] },
        ...LINES.map((L, i) => ({ type: 'scribe', id: 'a3ln' + i, text: L.text, x: LX, y: LY[i], size: LS, t0: L.t0, cps: CPS, z: Z.board })),
        ...LINES.map((L, i) => ({ type: 'write', id: 'a3ck' + i, text: '✓', x: 918, y: LY[i] - 36, size: 64, t0: L.ck + (i === 2 ? 0.25 : 0), speed: 1600, color: 'red', w: 6, sfx: 'pen', z: Z.annot })),
      ] },
      { type: 'a3_deskPaper', id: 'a3dp', t0: ZIN + ZDUR, t1: CUT_T - ZDUR },
      { type: 'qm', id: 'a3qm', pos: [[0, [1052, FL]]], size: 165, t0: 0.35, burst: true,
        act: [[0, 'idle'], [LINES[0].ck + 0.1, 'nod'], [LINES[0].ck + 0.9, 'idle'], [LINES[1].ck + 0.1, 'nod'], [LINES[1].ck + 0.9, 'idle'],
          [LINES[2].ck + 0.35, 'nod'], [LINES[2].ck + 1.1, 'idle'], [9.85, 'nod'], [11.6, 'idle'], [19.3, 'idle'], [28.85, 'hop'], [30.2, 'idle']],
        mood: [[0, 'neutral'], [9.85, 'happy'], [BOARD_T, 'neutral'], [19.3, 'surprised'], [22.6, 'doubt'], [TCOLOR + 0.6, 'neutral'], [28.85, 'happy']],
        gaze: [[0, 'page'], [9.85, 'viewer'], [BOARD_T, 'board'], [19.0, 'num'], [21.8, 'board'], [28.85, 'viewer']],
        sfxAt: [[9.85, 'boop'], [28.85, 'hop']] },
      // L3–L5: the real 8×8 board; how many ways to tile the full one; how long that would take
      { type: 'e3_board', id: 'a3b8', at: BC, n: N8, cell: BS, t0: BOARD_T, drawDur: 0.7, cut: TCUT, color: TCOLOR, colorDur: 0.8, w: 5 },
      { type: 'a3_grp', id: 'a3gCount', t1: TILE_OUT, op: fadeOut(TILE_END), items: [
        { type: 'a3_tilings', id: 'a3tl' },
        { type: 'label', id: 'a3lbFull', text: '完整棋盘的摆法', at: [RX + 200, 300], rot: -2, t0: 18.0, t1: TILE_OUT, target: [BC[0] + N8 * BS / 2 + 6, 330], bend: 0.2, gap: 8 },
        { type: 'write', id: 'a3num', text: '12,988,816', x: RX, y: 160, size: RS, t0: 18.95, speed: 2900, gap: 0.03, glyphGap: 0.04, color: 'red', w: 6.5, z: Z.annot, sfx: 'pen' },
        { type: 'label', id: 'a3lbDays', text: ['一秒一种', '≈ 150 天 ≈ 5 个月'], at: [RX + 200, 436], rot: -2, t0: 22.4, t1: TILE_OUT, size: 48 },
      ] },
      // L6: cut (now the real puzzle board), colour, count, verdict
      { type: 'a3_grp', id: 'a3gCutLbl', t1: CUTLBL_OUT + 0.3, op: fadeOut(CUTLBL_OUT), items: [{ type: 'a3_cutLbl', id: 'a3cl', t0: TCUT + 0.05 }] },
      { type: 'title', id: 'a3tB', text: '黑', x: RX + 20, y: 230, size: RS, t0: TALLY_T, color: 'red', sfx: 'pop' },
      { type: 'write', id: 'a3n30', text: '30', x: RX + 66, y: 230 - RS / 2, size: RS, t0: TALLY_T + 0.1, speed: 2600, color: 'red', w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'title', id: 'a3tW', text: '白', x: RX + 20, y: 340, size: RS, t0: TALLY_T + 0.45, color: 'red', sfx: 'pop' },
      { type: 'write', id: 'a3n32', text: '32', x: RX + 66, y: 340 - RS / 2, size: RS, t0: TALLY_T + 0.55, speed: 2600, color: 'red', w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'a3_stamp', id: 'a3st', text: '盖不满！', at: [BC[0], BC[1] + 10], size: 104, rot: -8, t0: 29.2 },
    ],
    sfx: [[CUT_T - ZDUR, 'whoosh']],
    subs: [
      { t0: 0.3, t1: 3.7, text: '小陶把想通的过程写下来：' },
      { t0: 9.8, t1: 13.0, text: '小问号读完，点了点头。' },
      { t0: 13.7, t1: 16.9, text: '换成真正的 8×8 棋盘，', say: '换成真正的八乘八棋盘，' },
      { t0: 17.0, t1: 21.6, text: '光是完整的棋盘，就有一千多万种摆法。' },
      { t0: 21.7, t1: 25.3, text: '一秒试一种，也要试五个月。' },
      { t0: 25.8, t1: 30.0, text: '可涂上颜色，一下就知道：盖不满。' },
    ],
  });
})();
