// 第 50 场 · 换个办法想：灵光不来，就坐下来想。① 失败也是线索：九次失败排成 3×3，圈出每次剩下的两格；
// ② 问一个更好的问题：不问“怎么摆”，问“剩下的两格，有什么共同点？”；③ 换个看法：把黑白涂回去——剩下的全是白格。
// 开场接第 45 场：主棋盘在 E3B.MAIN（剪过角、没涂色、空的），小问号 [960, 770] 举牌“为什么总剩两格？”，小陶在 1180。
// 结尾交给第 55 场：主棋盘回到 E3B.MAIN，已涂色，摆着 E3B.TRIES[8]，(2,3)(3,2) 两个白格被圈着；小陶站在 1180，表情 idea。
(() => {
  const FL = 780, TX = 1180, M = E3B.MAIN, CS = M.cell, TR = E3B.TRIES;
  const TS = 0.33, GX = 575, GY = 445, GAP = 160;                // thumbnails: 33 px squares, 3×3
  const SLOT = k => [GX + (k % 3 - 1) * GAP, GY + (Math.floor(k / 3) - 1) * GAP];
  const leftOf = dom => { const cov = new Set(dom.flatMap(d => E3B.domCells(d).map(([r, c]) => r + '_' + c))); return E3B.cells(4, true).filter(([r, c]) => !cov.has(r + '_' + c)); };
  // what the scene shows: every one of the nine tries leaves two squares, and both are white
  TR.forEach((dom, k) => { const L = leftOf(dom); if (L.length !== 2 || L.some(([r, c]) => E3B.black(r, c))) console.error('d3_think: try', k, 'does not leave two white squares', L); });
  { const L = leftOf(TR[8]).map(x => x.join(',')).join(' '); if (L !== '2,3 3,2') console.error('d3_think: TRIES[8] should leave (2,3) (3,2)', L); }

  /* ---------------- timing ---------------- */
  const BULB0 = 0.9, POOF = 3.4, SIT = 4.5;
  const SHRINK = 7.9, SWAP = 8.55, THUMB_T = k => (k ? 8.8 + (k - 1) * 0.17 : SWAP), RING_T = k => 11.0 + k * 0.36;
  const STEP = [7.6, 15.8, 27.5];
  const HOW = 19.5, STRIKE = 20.55, HEAD = 22.35, ARROW = 24.3;
  const TILT = 27.65, CLOUD = 30.4, CB = 30.65, CLOUD_OFF = 34.3, COLOR_T = k => 34.45 + k * 0.1;
  const REDO_T = k => 37.8 + k * 0.12, REDO_OFF = 40.95, JAW = 37.9, WHITE = 38.9, STAND = 39.35;
  const CHECK_T = k => 41.3 + k * 0.14, QEXIT = 42.8, GATHER = 43.55, DUR = 44.9;
  const OFF = 43.3;                                            // the notes are tidied away

  /* ---------------- the three steps, noted down on the left in red ---------------- */
  const STEPS = [['1', '失败也是线索'], ['2', '问更好的问题'], ['3', '换个看法']];
  COMP.d3_tSteps = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const size = 38;
      STEPS.forEach(([n, s], i) => {
        const t0 = STEP[i], lt = t - t0; if (lt < 0) return;
        const cur = i === STEPS.length - 1 || t < STEP[i + 1], op = cur ? 1 : 0.5, pp = EASE.back(clamp(lt / 0.22));
        const x = fx.x, y = fx.y + i * fx.dy, k = fx.id + i;
        DL.save(); DL.translate(x + 24, y); DL.scale(lerp(0.5, 1, pp));
        stroke(k + '.o', ringPts(k + '.o', 0, 0, 24, 24, { n: 10, a0: -110, sweep: 375, rv: 0.05 }), { z: Z.annot, w: 4, color: C.red, opacity: op, draw: EASE.out(clamp(lt / 0.3)) });
        const g = GLYPH[n], gs = 32;
        g.s.forEach((st, j) => stroke(k + '.n' + j, st.map(([u, v, c]) => [(u - g.w / 2) * gs, (v - 0.5) * gs, c]), { z: Z.annot, w: 4.5, color: C.red, opacity: op, draw: clamp((lt - 0.1) / 0.18), boil: 0.6 }));
        DL.restore();
        text(k + '.t', s, x + 60, y + 2, { size, anchor: 'start', color: C.red, opacity: op * clamp((lt - 0.12) / 0.12), halo: 8 });
      });
    },
    cues: () => STEP.map(t => [t, 'pop']),
  };

  /* ---------------- little helpers ---------------- */
  /** "…" thinking dots above a head */
  COMP.d3_tDots = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      [0, 1, 2].forEach(i => {
        const u = EASE.back(clamp((t - fx.t0 - i * 0.4) / 0.2)); if (u <= 0) return;
        dot(fx.id + i, [a.headTop[0] - 30 + i * 30, a.headTop[1] - 42 - Math.max(0, Math.sin((t - fx.t0) * 4 - i)) * 4], 7 * u, C.ink, Z.fx);
      });
    },
    cues: fx => [0, 1, 2].map(i => [fx.t0 + i * 0.4, 'plip']),
  };
  /** a pencil puff where the (unlit) bulb was */
  COMP.d3_tPoof = {
    draw(fx, t, F) {
      const lt = t - fx.t0; if (lt < 0 || lt > 0.5) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const c = [a.headTop[0], a.headTop[1] - 26 - 56], u = EASE.out(lt / 0.5);
      for (let i = 0; i < 6; i++) {
        const ang = (i * 60 + 15) * RAD, r = 14 + 26 * u, q = [c[0] + Math.cos(ang) * (20 + 40 * u), c[1] + Math.sin(ang) * (20 + 40 * u)];
        stroke(fx.id + i, ringPts(fx.id + i, q[0], q[1], r * 0.45, r * 0.45, { n: 8, closed: true }), { z: Z.fx, w: 2.6, color: C.pencil, closed: true, opacity: 1 - u, boil: 0.6 });
      }
    },
    cues: fx => [[fx.t0, 'boop']],
  };
  /** a red curved arrow round the head: "look at it another way" */
  COMP.d3_tTurn = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.35)), R = a.r * 1.75, c = a.head, pts = [];
      for (let i = 0; i <= 10; i++) { const ang = (-160 + 110 * i / 10) * RAD; pts.push([c[0] + Math.cos(ang) * R, c[1] + Math.sin(ang) * R]); }
      stroke(fx.id, pts, { z: Z.annot, w: 4.5, color: C.red, draw: p, boil: 0.8 });
      if (p > 0.92) {
        const e = pts[10], b = pts[8], L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = 18;
        const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
        const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
        stroke(fx.id + '.h', [r1, [e[0], e[1], 1], r2], { z: Z.annot, w: 4.5, color: C.red, boil: 0.8 });
      }
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /** a plain red arrow (from the written question down to the circled squares) */
  COMP.d3_tArrow = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      arrow(fx.id, fx.from, fx.to, { p: EASE.out(clamp((t - fx.t0) / 0.3)), bend: fx.bend ?? 0.2 });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /** "every time": a red ✓ beside each of the nine boards */
  COMP.d3_tChecks = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const g = GLYPH['✓'], s = 30, h = 1.5 * CS * TS;   // in the empty (cut-off) bottom-right corner of each board
      TR.forEach((_, k) => {
        const u = clamp((t - CHECK_T(k)) / 0.16); if (u <= 0) return;
        const [x, y] = SLOT(k), x0 = x + h - s * 0.4, y0 = y + h - s * 0.55;
        stroke(fx.id + k, g.s[0].map(([a, b, c]) => [x0 + a * s, y0 + b * s, c]), { z: Z.annot, w: 5, color: C.red, draw: u, boil: 0.6 });
      });
    },
    cues: () => TR.map((_, k) => [CHECK_T(k), 'pen']),
  };

  /* ---------------- the boards ---------------- */
  const mainBoard = { type: 'e3_board', id: 'd3t.m', cell: CS, t0: -1, t1: SWAP, cut: -1, color: null,
    pos: [[0, M.at], [SHRINK, SLOT(0), 0.6, 'io']], scale: [[0, 1], [SHRINK, TS, 0.6, 'io']] };
  const thumbs = TR.map((dom, k) => {
    const T0 = THUMB_T(k), last = k === TR.length - 1;
    return { type: 'e3_board', id: 'd3t.b' + k, cell: CS, t0: T0, t1: last ? undefined : GATHER + 0.32, drawDur: 0.01,
      cut: -1, color: COLOR_T(k), colorDur: 0.9,
      pos: [[0, SLOT(k)], ...(last ? [[GATHER, M.at, 0.7, 'io']] : [])],
      scale: [...(k ? [[0, 0.05], [T0, TS, 0.22, 'back']] : [[0, TS], [SWAP, TS * 1.12, 0.06], [SWAP + 0.06, TS, 0.2, 'back']]),
        last ? [GATHER, 1, 0.7, 'io'] : [GATHER, 0.03, 0.3, 'in']],
      attempts: [{ t0: -1, step: 0, dom, fail: RING_T(k) }],
      rings: [{ cells: leftOf(dom), t0: REDO_T(k), t1: REDO_OFF }] };
  });

  /* ---------------- Terry ---------------- */
  const KNEES = { sit: 1, legScale: 1, thigh: 0.5, legL: [118, -118], legR: [118, -118] };     // sitting on the floor, knees up
  const HUG = { ikL: { w: 1, to: 'hip', dx: -32, dy: -20, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 32, dy: -20, bend: 'out' } }; // hands on the knees
  Object.assign(POSE, {
    d3_tSit: { ...KNEES, armScale: 1.3, ...HUG },
    d3_tChin: { ...KNEES, tilt: -7, armScale: 1.55, ikL: { w: 1, to: 'chin', dx: -0.2, dy: 0.05, bend: 'down' }, ikR: HUG.ikR },
    d3_tTilt: { ...KNEES, tilt: 30, lean: 3, armScale: 1.3, ...HUG },
    d3_tShock: { ...KNEES, lean: -4, armScale: 1.5, armL: [112, 34], armR: [112, 34] },
    d3_tPointL: { lean: -3, tilt: -4, armScale: 1.5, armL: [84, 8], armR: [16, 10] },
    d3_tShrug: { tilt: 8, armScale: 1.5, armL: [64, -70], armR: [64, -70] },
  });
  const SIT_Y = 759;   // hip height when sitting with knees up (feet on the floor)

  defineScene({
    id: 'think', chapter: '换个办法想', dur: DUR, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [SIT, [TX, SIT_Y], 0.22], [STAND, [TX, FL], 0.18]],
        pose: [[0, 'scratchStand'], [BULB0, 'lookUp', 0.15], [POOF + 0.1, 'd3_tShrug', 0.1, 'back'], [SIT, 'd3_tSit', 0.22], [5.0, 'd3_tChin', 0.2],
          [TILT, 'd3_tTilt', 0.15, 'back'], [29.9, 'd3_tChin', 0.2], [JAW, 'd3_tShock', 0.08, 'back'], [STAND, 'stand', 0.18],
          [CHECK_T(0) - 0.2, 'd3_tPointL', 0.12, 'back'], [GATHER, 'stand', 0.2]],
        face: [[0, 'sheepish'], [BULB0, 'focus', 0.08], [POOF + 0.1, 'sheepish', 0.08], [SIT, 'neutral', 0.08], [5.0, 'focus', 0.08],
          [TILT, 'puzzled', 0.06], [29.9, 'focus', 0.08], [CB + 0.5, 'surprised', 0.06], [CLOUD_OFF, 'focus', 0.08], [JAW, 'jaw', 0.06, 'back'], [STAND, 'idea', 0.05]],
        turn: [[0, 0], [BULB0, -0.1, 0.1], [SIT, -0.35, 0.12], [TILT, 0, 0.12], [29.9, -0.35, 0.12], [JAW, -0.2, 0.08], [STAND, -0.35, 0.12]],
        gaze: [[0, 'viewer'], [BULB0, 'bulb'], [POOF + 0.1, 'viewer'], [SIT, 'board'], [SHRINK, 'grid'], [STEP[1], 'qm'], [HEAD, 'head'], [ARROW + 0.3, 'grid'],
          [TILT, 'viewer'], [CLOUD + 0.1, 'cloud'], [CLOUD_OFF, 'grid'], [JAW, 'grid'], [GATHER, 'board']],
        squash: [[0, 1], [SIT + 0.2, 0.9, 0.05], [SIT + 0.25, 1, 0.2, 'back'], [JAW, 1.1, 0.05], [JAW + 0.06, 1, 0.22, 'back'],
          [STAND - 0.1, 0.88, 0.08], [STAND, 1.1, 0.08], [STAND + 0.12, 1, 0.22, 'back']],
      },
    },
    targets: () => ({ bulb: [TX, 450], board: M.at, grid: [GX, GY], qm: [960, 640], head: [GX, 150], cloud: [1250, 370] }),
    set: [{ type: 'floor' }],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      // L1–L2: no flash comes — sit down and think
      { type: 'e3_bulb', id: 'd3t.bulb', char: 'terry', t0: BULB0, t1: POOF, state: [[BULB0, 'off']] },
      { type: 'd3_tPoof', id: 'd3t.poof', char: 'terry', t0: POOF },
      { type: 'd3_tDots', id: 'd3t.dots', char: 'terry', t0: 5.3, t1: 7.4 },
      // the boards: the empty main board shrinks into the first slot; the nine failed tries come back as clues
      mainBoard,
      ...thumbs,
      { type: 'd3_tSteps', id: 'd3t.st', x: 40, y: 300, dy: 80, t1: OFF },
      // L5–L7: a better question
      { type: 'qm', id: 'qm', size: 160, t0: -1, silent: true, signSide: 'left', t1: QEXIT + 0.5,
        pos: [[0, [960, 770]], [QEXIT, t => { const u = clamp((t - QEXIT) / 0.45); return [lerp(960, 1050, u), 770 - Math.sin(Math.PI * Math.min(1, u * 1.4)) * 110 + EASE.in(u) * 330]; }, 0]],
        act: [[0, 'nod'], [1.2, 'idle'], [SIT + 0.1, 'nod'], [5.6, 'idle'], [STEP[1], 'hop'], [STEP[1] + 0.9, 'idle'], [ARROW + 0.2, 'nod'], [ARROW + 1.4, 'idle'],
          [STAND, 'hop'], [STAND + 0.9, 'idle'], [CHECK_T(0), 'nod'], [CHECK_T(8) + 0.3, 'idle']],
        mood: [[0, 'happy'], [1.2, 'neutral'], [SIT + 0.1, 'happy'], [7.0, 'neutral'], [HOW, 'doubt'], [HEAD, 'neutral'], [ARROW + 0.2, 'happy'], [26.6, 'neutral'],
          [JAW, 'surprised'], [STAND, 'happy']],
        gaze: [[-1, 'terry'], [SHRINK, 'grid'], [STEP[1], 'viewer'], [HEAD, 'head'], [ARROW + 0.2, 'terry'], [TILT, 'terry'], [CLOUD + 0.1, 'cloud'], [CLOUD_OFF, 'grid'], [STAND, 'terry'], [CHECK_T(0), 'grid']],
        sign: [[-1, '为什么总剩两格？'], [SIT, null], [HOW, '怎么摆？'], [HEAD - 0.25, null]],
        sfxAt: [[STEP[1], 'hop'], [HOW, 'pop'], [STAND, 'hop'], [QEXIT, 'hop']] },
      { type: 'strike', id: 'd3t.strike', rect: [824, 533, 160, 53], t0: STRIKE, t1: HEAD - 0.25, dur: 0.25 },
      { type: 'scribe', id: 'd3t.q', text: '剩下的两格，有什么共同点？', x: GX - 13 * 46 / 2, y: 150, size: 46, t0: HEAD, t1: OFF, cps: 7.5, color: 'red', halo: 8 },
      { type: 'd3_tArrow', id: 'd3t.qa', from: [462, 180], to: [517, 254], t0: ARROW, t1: CLOUD_OFF, bend: -0.2 },
      // L8–L10: look at it another way — a chessboard is black and white
      { type: 'd3_tTurn', id: 'd3t.turn', char: 'terry', t0: TILT + 0.15, t1: 29.9 },
      { type: 'thought', id: 'd3t.cloud', at: [1250, 370], rx: 138, ry: 104, t0: CLOUD, t1: CLOUD_OFF, from: { char: 'terry', part: 'headTop', dy: -8 } },
      { type: 'e3_board', id: 'd3t.cb', at: [1250, 370], n: 4, cell: CS, scale: 0.27, t0: CB, t1: CLOUD_OFF, drawDur: 0.35, cut: null, color: CB + 0.4, colorDur: 0.8, z: Z.fx + 1 },
      // L11–L12: every circle sits on a white square
      { type: 'title', id: 'd3t.white', text: '全是白的！', x: 1010, y: 300, size: 76, t0: WHITE, t1: OFF, color: 'ink', sfx: 'pop' },
      { type: 'band', id: 'd3t.whiteHi', rect: [826, 282, 368, 54], t0: WHITE + 0.4, t1: OFF, dur: 0.4 },
      { type: 'd3_tChecks', id: 'd3t.ck', t1: OFF },
    ],
    sfx: [[SHRINK, 'whoosh'], [SWAP, 'tap'], [SWAP + 0.03, 'tap'], ...TR.map((_, k) => [RING_T(k), 'pen']), [SIT + 0.2, 'thud'],
      ...TR.map((_, k) => [REDO_T(k), 'plip']), [JAW, 'boing'], [GATHER, 'whoosh']],
    subs: [
      { t0: 0.3, t1: 4.1, text: '灵光不来的时候，就换个办法：' },
      { t0: 4.2, t1: 7.0, text: '不再瞎摆，开始想。' },
      { t0: 7.5, t1: 10.7, text: '第一步：失败也是线索。' },
      { t0: 10.8, t1: 14.6, text: '把每次剩下的两格，都圈出来。' },
      { t0: 15.7, t1: 19.3, text: '第二步：问一个更好的问题。' },
      { t0: 19.4, t1: 22.0, text: '不问“怎么摆”，' },
      { t0: 22.1, t1: 26.5, text: '问：“剩下的两格，有什么共同点？”' },
      { t0: 27.4, t1: 30.2, text: '第三步：换个看法。' },
      { t0: 30.3, t1: 34.1, text: '棋盘，本来就是黑白相间的呀！' },
      { t0: 34.2, t1: 36.8, text: '把颜色涂回去——' },
      { t0: 37.7, t1: 40.9, text: '剩下的两格，全是白的！' },
      { t0: 41.0, t1: 44.2, text: '每一次，都是两个白格。' },
    ],
  });
})();
