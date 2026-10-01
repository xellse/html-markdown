// 第 40 场 · 骨牌难题：4×4 棋盘剪掉对角两格，7 块骨牌能不能盖满？小陶“能！”，摆了九次，次次剩两格。
// 演绎：“我们陪小陶一起卡一次”，不是他当年做过的某一道具体的题。九次摆法 = E3B.TRIES[0..8]（每次剩两个白格）。
// 结尾画面交给第 45 场：主棋盘在 E3B.MAIN，剪过角、没涂色、空的；小问号 [960, 770]（size 160，牌子在左边）举牌“为什么总剩两格？”；小陶在 1180。
(() => {
  const FL = 780, TX = 1180, M = E3B.MAIN, CS = M.cell, TR = E3B.TRIES;
  const cellC = (r, c) => [M.at[0] + (c - 1.5) * CS, M.at[1] + (r - 1.5) * CS];
  const domC = d => { const [a, b] = E3B.domCells(d).map(([r, c]) => cellC(r, c)); return lerp2(a, b, 0.5); };
  const leftOf = dom => { const cov = new Set(dom.flatMap(d => E3B.domCells(d).map(([r, c]) => r + '_' + c))); return E3B.cells(4, true).filter(([r, c]) => !cov.has(r + '_' + c)); };
  // the claim of the scene: every try leaves exactly two squares, never side by side (both white)
  TR.forEach((dom, k) => {
    const L = leftOf(dom);
    if (dom.length !== 6 || L.length !== 2 || L.some(([r, c]) => E3B.black(r, c)) || Math.abs(L[0][0] - L[1][0]) + Math.abs(L[0][1] - L[1][1]) === 1) console.error('d3_domino: try', k, 'is not "6 dominoes, two apart squares left"', L);
  });

  /* ---------------- timing ---------------- */
  const T = { wink: 1.4, old: 4.5, board: 7.75, cut: 10.9, diag: 14.35, drop: 14.8, ask: 18.75, can: 23.2 };
  const L9 = 28.55, L10 = 32.15, L11 = 35.55, L12 = 38.05, L13 = 42.35, L14 = 45.25;
  const CLEAR = 45.0, QT = 46.7, SIGN = 47.25, DUR = 49.35;
  // the attempts: two careful ones, then the montage (3rd … 9th try), faster and faster
  const ATT = [
    { t0: 25.55, step: 0.38, fail: L9, t1: 32.0 },
    { t0: 32.6, step: 0.42, fail: L11, t1: 37.75 },
  ];
  const MONT = [[37.99, 0.08], [38.96, 0.07], [39.81, 0.03], [40.28, 0.03], [40.75, 0.03], [41.22, 0.03], [41.69, 0.03]];
  MONT.forEach(([t0, step], i) => ATT.push({ t0, step, fail: +(t0 + 5 * step + 0.16).toFixed(2), t1: i < MONT.length - 1 ? MONT[i + 1][0] - 0.02 : CLEAR }));
  const FAILS = ATT.map(a => a.fail), NINE = FAILS[8];
  const tdOf = (k, i) => ATT[k].t0 + i * ATT[k].step;

  /* ---------------- red-pen tag: text now, arrow(s) later ---------------- */
  COMP.d3_dTag = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, lines = [].concat(fx.text), size = fx.size || CFG.SIZE.label;
      const sizes = lines.map((_, i) => (i === 0 ? size : size * 0.82));
      const w = Math.max(...lines.map((l, i) => textWidth(l, sizes[i]))), h = sizes.reduce((a, b) => a + b * 1.15, 0);
      const pp = EASE.back(clamp(lt / 0.2));
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(fx.rot || 0);
      let yy = -h / 2;
      lines.forEach((l, i) => { yy += sizes[i] * 0.575; text(fx.id + '.t' + i, l, 0, yy, { size: sizes[i], color: C.red, z: Z.annot, scale: lerp(0.6, 1, pp), opacity: clamp(lt / 0.08), halo: 8 }); yy += sizes[i] * 0.575; });
      DL.restore();
      const a0 = fx.arrowT0 ?? fx.t0;
      (fx.targets || []).forEach((tg, i) => {
        const p = EASE.out(clamp((t - a0 - 0.12 - i * 0.15) / 0.3)); if (p <= 0) return;
        const hw = w / 2 + 12, hh = h / 2 + 8, vx = tg[0] - fx.at[0], vy = tg[1] - fx.at[1];
        const s = Math.min(hw / Math.abs(vx || 1e-6), hh / Math.abs(vy || 1e-6));
        const from = [fx.at[0] + vx * s, fx.at[1] + vy * s], dl = dist(from, tg) || 1, gap = fx.gap ?? 14;
        arrow(fx.id + '.a' + i, from, [tg[0] - (tg[0] - from[0]) / dl * gap, tg[1] - (tg[1] - from[1]) / dl * gap], { p, bend: (fx.bends || [])[i] ?? 0.2 });
      });
    },
    cues: fx => [[fx.t0, 'pop']].concat(fx.arrowT0 !== undefined ? [[fx.arrowT0 + 0.12, 'pen']] : []),
  };

  /* ---------------- "老题目": a little dust blown off the old problem ---------------- */
  COMP.d3_dDust = {
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0 || lt > 1.5) return;
      [[-120, -10, 1], [115, -24, -1], [-70, 34, 1], [92, 30, -1], [5, -44, 1]].forEach(([dx, dy, s], i) => {
        const u = clamp((lt - i * 0.07) / 1.2); if (u <= 0 || u >= 1) return;
        const c = [fx.at[0] + dx * (1 + u * 0.5), fx.at[1] + dy - u * 50], r = 10 + u * 16, op = Math.sin(Math.PI * u);
        const pts = []; for (let j = 0; j <= 10; j++) { const a = (s * j * 62) * RAD, rr = r * (0.35 + j * 0.065); pts.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr]); }
        stroke(fx.id + '.p' + i, pts, { z: Z.annot - 1, w: 3, color: C.pencil, opacity: op, boil: 0.7 });
      });
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  /* ---------------- L5: one domino, on its own: it covers two neighbouring squares ---------------- */
  const DG = { at: [200, 472], s: 90 };
  function dominoShape(key, s, o) { // a domino lying flat, centred at the origin, s = one square
    const hw = s * 0.9, hh = s * 0.4;
    stroke(key, superPts(0, 0, hw * 2, hh * 2, 20, 6), { z: o.z, w: o.w, closed: true, fill: 'none', opacity: o.opacity });
    stroke(key + '.m', [[0, -hh * 0.45], [0, hh * 0.45]], { z: o.z, w: o.w * 0.55, opacity: o.opacity });
  }
  COMP.d3_dDiag = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, { s } = DG, [cx, cy] = DG.at, k = fx.id, op = 1 - clamp((t - fx.t1 + 0.25) / 0.25), z = Z.set + 2;
      const p = EASE.out(clamp(lt / 0.4));
      stroke(k + '.sq', [[cx - s, cy - s / 2], [cx + s, cy - s / 2, 1], [cx + s, cy + s / 2, 1], [cx - s, cy + s / 2, 1], [cx - s, cy - s / 2, 1]], { z, w: 5, draw: p, opacity: op });
      stroke(k + '.mid', [[cx, cy - s / 2], [cx, cy + s / 2]], { z, w: 3, draw: clamp(p * 2 - 1), opacity: op });
      // the domino pops in above the squares, then drops on and covers both
      const pin = EASE.back(clamp((t - fx.t0 - 0.3) / 0.22)); if (pin <= 0) return;
      const u = clamp((t - T.drop) / 0.22), y = lerp(cy - 150, cy, EASE.in(u));
      const sq = u >= 1 ? 1 - 0.12 * Math.sin(Math.PI * clamp((t - T.drop - 0.22) / 0.2)) : 1;
      DL.save(); DL.translate(cx, y); DL.scale(pin * (2 - sq), pin * sq);
      dominoShape(k + '.dom', s, { z: z + 1, w: 6, opacity: op });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pen'], [fx.t0 + 0.3, 'pop'], [T.drop + 0.22, 'tap'], [T.drop + 0.24, 'thud']],
  };

  /* ---------------- L6: a row of 7 dominoes — the supply. The first two tries fly them onto the board ---------------- */
  const ROW_Y = 160, ROW_X = i => M.at[0] + (i - 3) * 76, ICON = 36, FLY = 0.24;
  const ROW_IN = 19.35, REFILL = 32.25, ROW_OUT = 37.75;
  const iconAt = (i, t) => { // → {c, rot, sc, op} or null
    const t0 = ROW_IN + i * 0.09; if (t < t0 || t >= ROW_OUT + 0.25) return null;
    const home = [ROW_X(i), ROW_Y], op = 1 - clamp((t - ROW_OUT) / 0.25);
    let sc = EASE.back(clamp((t - t0) / 0.2)), rot = 0;
    if (i === 6) { // the seventh domino: left over, with nowhere to go
      FAILS.slice(0, 2).forEach(f => { const v = (t - f - 0.3) / 0.9; if (v > 0 && v < 1) rot += 16 * Math.sin(v * 2 * Math.PI * 3) * (1 - v); });
      return { c: home, rot, sc, op };
    }
    const k = t < REFILL ? 0 : 1;
    if (k === 1) sc = EASE.back(clamp((t - REFILL - i * 0.05) / 0.2));
    const td = tdOf(k, i), d = TR[k][i];
    if (t >= td) return null;
    const u = clamp((t - (td - FLY)) / FLY); if (u <= 0) return { c: home, rot, sc, op };
    const e = u * u, to = domC(d), c = lerp2(home, to, e);
    return { c: [c[0], c[1] - 60 * Math.sin(Math.PI * u)], rot: (d[2] === 'v' ? 90 : 0) * EASE.io(u), sc: lerp(1, 0.6 * CS / ICON, e), op };
  };
  COMP.d3_dRow = {
    draw(fx, t) {
      for (let i = 0; i < 7; i++) {
        const s = iconAt(i, t); if (!s || s.sc <= 0.01) continue;
        DL.save(); DL.translate(s.c[0], s.c[1]); DL.rotate(s.rot); DL.scale(s.sc);
        dominoShape(fx.id + '.i' + i, ICON, { z: Z.fx, w: lerp(4.4, 3.4, clamp((s.sc - 1) / 0.7)) / s.sc, opacity: s.op });
        DL.restore();
      }
    },
    cues: () => [0, 1, 2, 3, 4, 5, 6].map(i => [ROW_IN + i * 0.09, 'plip']).concat([[REFILL, 'plip'], [REFILL + 0.15, 'plip'], [ROW_OUT, 'whoosh']]),
  };

  /* ---------------- the tally: one red ✗ per failed try, up to 9 ---------------- */
  const XG = k => [905 + (k % 3) * 70, 255 + Math.floor(k / 3) * 70], XC = [975, 325];
  COMP.d3_dXs = {
    draw(fx, t) {
      if (t >= CLEAR + 0.3) return;
      const op = 1 - clamp((t - CLEAR) / 0.3), h = 22;
      FAILS.forEach((f, k) => {
        const u = clamp((t - f) / 0.16); if (u <= 0) return;
        const [x, y] = XG(k), j = rnd(hstr(fx.id), k, 4) * 4;
        stroke(fx.id + '.a' + k, [[x - h, y - h + j], [x + h, y + h - j]], { z: Z.annot, w: 6, color: C.red, draw: EASE.out(clamp(u * 2)), opacity: op });
        stroke(fx.id + '.b' + k, [[x + h, y - h], [x - h + j, y + h]], { z: Z.annot, w: 6, color: C.red, draw: EASE.out(clamp(u * 2 - 1)), opacity: op });
      });
      const rp = EASE.out(clamp((t - fx.ringT) / 0.4));
      if (rp > 0) stroke(fx.id + '.ring', ringPts(fx.id + '.ring', XC[0], XC[1], 124, 118, { n: 14, a0: -150, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: rp, opacity: op });
    },
    cues: fx => [[fx.ringT, 'pen'], [CLEAR, 'whoosh']],
  };

  /* ---------------- sweat drops (ink) ---------------- */
  COMP.d3_dSweat = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      [0, 1].forEach(i => {
        const ph = ((t - fx.t0) * 1.3 + i * 0.5) % 1, o = Math.sin(Math.PI * ph), s = i ? -1 : 1;
        const c = [a.head[0] + s * (a.r + 22 + ph * 40), a.head[1] - a.r * 0.6 + ph * ph * 50 - 20];
        stroke(fx.id + i, [[c[0], c[1] - 16], [c[0] + 9, c[1] + 2], [c[0], c[1] + 9], [c[0] - 9, c[1] + 2], [c[0], c[1] - 16]], { z: Z.fx, w: 3.4, fill: C.paper, opacity: o });
      });
    },
  };

  /* ---------------- Terry ---------------- */
  // placing: the board-side arm (screen left) jabs out as each domino lands
  const placeTimes = k => TR[k].map((_, i) => tdOf(k, i));
  const jab = tds => t => {
    let td = null; tds.forEach(x => { if (x - 0.18 <= t) td = x; });
    const e = td === null ? 0 : Math.sin(Math.PI * clamp((t - (td - 0.18)) / 0.36));
    return { lean: -4 * e, tilt: -5 + 3 * e, armScale: 1.55, armL: [lerp(28, 94, e), lerp(34, 4, e)], armR: [18, 12], ikL: { w: 0 }, ikR: { w: 0 } };
  };
  const flail = t => {
    const w = 2 * Math.PI * 4.3;
    return { lean: -3 + 2 * Math.sin(t * 9), tilt: -6 + 5 * Math.sin(t * 7.3), armScale: 1.55,
      armL: [72 + 26 * Math.sin(w * t), 18 + 18 * Math.sin(w * t + 1)], armR: [58 + 28 * Math.sin(w * t + 2.3), 22 + 18 * Math.sin(w * t + 3)], ikL: { w: 0 }, ikR: { w: 0 } };
  };
  Object.assign(POSE, {
    d3_dSlump: { lean: -3, tilt: -14, sq: 0.93, armScale: 1.1, armL: [5, 4], armR: [5, 4] },
    d3_dOneMore: { lean: 2, tilt: 6, armScale: 1.6, armR: [128, 26], armL: [18, 12] },
    d3_dReach: { lean: -6, tilt: -4, armScale: 1.55, armL: [86, 6], armR: [24, 16] },
    d3_dStartle: { lean: 4, tilt: 4, armScale: 1.45, armL: [62, 46], armR: [62, 46] },
  });
  const firstFail = FAILS[0];
  const curCell = t => { // the domino being placed right now (for Terry's eyes)
    let c = null;
    [0, 1].forEach(k => TR[k].forEach((d, i) => { if (tdOf(k, i) - 0.25 <= t && t < ATT[k].fail) c = domC(d); }));
    return c || M.at;
  };
  const midLeft = k => { const L = leftOf(TR[k]); return lerp2(cellC(...L[0]), cellC(...L[1]), 0.5); };

  defineScene({
    id: 'domino', chapter: '骨牌难题', dur: DUR, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        enter: 0.15,
        pos: [[0, [TX, FL]]],
        pose: [[0, 'akimbo'], [T.old, 'stand', 0.15], [T.diag + 0.6, 'thinkStand', 0.15], [T.can, 'kidCheer', 0.1, 'back'],
          [ATT[0].t0 - 0.3, jab(placeTimes(0)), 0.15], [L9, 'stand', 0.15], [L10, 'akimbo', 0.12, 'back'], [ATT[1].t0 - 0.3, jab(placeTimes(1)), 0.15],
          [L11 + 0.4, 'scratchStand', 0.12, 'back'], [MONT[0][0] - 0.1, flail, 0.12], [NINE, 'd3_dSlump', 0.2],
          [CLEAR + 0.05, 'd3_dOneMore', 0.12, 'back'], [46.15, 'd3_dReach', 0.15], [QT + 0.05, 'd3_dStartle', 0.07, 'back'], [48.0, 'thinkStand', 0.25]],
        face: [[0, 'proudGrin'], [T.old, 'neutral', 0.08], [T.board, 'focus', 0.08], [T.cut + 0.6, 'surprised', 0.05], [T.cut + 1.4, 'focus', 0.08],
          [T.can, 'proudGrin', 0.05], [ATT[0].t0, 'grin', 0.08], [L9, 'puzzled', 0.06], [L10, 'effort', 0.06], [L11, 'puzzled', 0.06], [L11 + 0.4, 'sheepish', 0.08],
          [MONT[0][0], 'effort', 0.06], [NINE, 'sheepish', 0.1], [CLEAR + 0.05, 'effort', 0.06], [QT + 0.05, 'surprised', 0.04], [48.0, 'focus', 0.1]],
        turn: [[0, -0.15], [T.old, -0.4, 0.12], [T.can, -0.1, 0.08], [ATT[0].t0 - 0.3, -0.4, 0.1], [CLEAR + 0.05, -0.15, 0.1], [46.15, -0.4, 0.1]],
        gaze: [[0, 'viewer'], [T.old, 'old'], [T.board, 'board'], [T.cut + 0.5, 'fall'], [T.cut + 1.4, 'board'], [T.diag, 'diag'], [T.ask, 'ask'], [ROW_IN, 'row'],
          [T.can, 'viewer'], [ATT[0].t0 - 0.3, 'cur'], [L9, 'left0'], [L10, 'cur'], [L11, 'left1'], [MONT[0][0], 'board'], [NINE, 'left8'],
          [CLEAR + 0.05, 'viewer'], [46.15, 'board'], [QT + 0.05, 'qm'], [SIGN + 0.4, 'sign'], [48.0, 'board']],
        squash: [[0, 1], [T.cut + 0.6, 1.07, 0.05], [T.cut + 0.66, 1, 0.2, 'back'], [T.can, 0.9, 0.05], [T.can + 0.05, 1.08, 0.08], [T.can + 0.15, 1, 0.2, 'back'],
          [L9, 0.95, 0.06], [L9 + 0.06, 1, 0.2, 'back'], [QT + 0.05, 1.1, 0.05], [QT + 0.11, 1, 0.22, 'back']],
      },
    },
    targets: F => ({ old: [250, 210], board: M.at, fall: [600, 640], diag: DG.at, ask: [600, 100], row: [600, ROW_Y], cur: curCell(F.t),
      left0: midLeft(0), left1: midLeft(1), left8: midLeft(8), qm: [960, 640], sign: [904, 560] }),
    set: [{ type: 'floor' }],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      // L1: a wink from the red pen
      { type: 'label', id: 'd3d.wink', text: '（他还不知道）', at: [905, 360], rot: -3, t0: T.wink, t1: 4.3, target: { char: 'terry', part: 'headTop', dx: -30, dy: 6 }, bend: -0.25, gap: 14 },
      // L2–L4: the old problem, the board, the cut
      { type: 'd3_dTag', id: 'd3d.old', text: '老题目', at: [250, 205], rot: -5, size: 52, t0: T.old, t1: T.cut - 0.2, arrowT0: T.board + 0.25, targets: [[392, 330]], bends: [0.25], gap: 10 },
      { type: 'd3_dDust', id: 'd3d.dust', at: [250, 205], t0: T.old + 0.15 },
      { type: 'e3_board', id: 'd3d.b', at: M.at, cell: CS, t0: T.board, drawDur: 0.6, cut: T.cut, color: null,
        attempts: ATT.map((a, k) => ({ ...a, dom: TR[k] })),
        rings: [{ cells: leftOf(TR[8]), t0: L13 + 0.3, t1: CLEAR }] },
      // L5: one domino on its own
      { type: 'd3_dDiag', id: 'd3d.dg', t0: T.diag, t1: ATT[0].t0 - 0.3 },
      { type: 'label', id: 'd3d.lbDom', text: ['骨牌：', '盖住相邻两格'], at: [200, 318], rot: -3, t0: T.drop + 0.35, t1: ATT[0].t0 - 0.3, target: [200, 428], bend: 0.15, gap: 8 },
      // L6: the question + the seven dominoes
      { type: 'title', id: 'd3d.ask', text: '7 块骨牌，能盖满吗？', x: 600, y: 90, size: 56, t0: T.ask, t1: ATT[0].t0 - 0.3, color: 'ink' },
      { type: 'd3_dRow', id: 'd3d.row' },
      // L7: the (misleading) flash of insight
      { type: 'e3_bulb', id: 'd3d.bulb', char: 'terry', t0: T.can, t1: QT,
        state: [[T.can, 'on'], [L9, 'flicker'], [L10, 'on'], [L11, 'flicker'], [NINE, 'off'], [L14, 'flicker']] },
      { type: 'speech', id: 'd3d.can', text: '能！', at: [1000, 440], tail: [56, 30], speaker: 'terry', t0: T.can, t1: ATT[0].t0 - 0.2, size: 100, rot: -5 },
      // L9: two squares left, not side by side
      { type: 'd3_dTag', id: 'd3d.apart', text: '不挨着！', at: [960, 520], rot: -3, size: 46, t0: L9 + 1.3, t1: ATT[0].t1, targets: [cellC(0, 3), cellC(3, 2)], bends: [0.25, -0.2], gap: 46 },
      // the tally of failed tries
      { type: 'd3_dXs', id: 'd3d.xs', ringT: NINE + 0.5 },
      { type: 'title', id: 'd3d.nine', text: '9 次', x: XC[0], y: 470, size: 50, t0: NINE + 0.75, t1: CLEAR, color: 'red', rot: -4, sfx: 'pop' },
      { type: 'd3_dSweat', id: 'd3d.sw', char: 'terry', t0: 39.0, t1: QT },
      // L14: 小问号 bursts in
      { type: 'qm', id: 'qm', size: 160, t0: QT, burst: true, signSide: 'left', pos: [[0, [960, 770]]],
        act: [[0, 'idle'], [QT + 0.3, 'hop'], [QT + 0.75, 'idle'], [48.1, 'tap']], hopHz: 2.2,
        mood: [[0, 'surprised'], [SIGN, 'doubt']],
        gaze: [[0, 'terry'], [48.1, 'board']],
        sign: [[0, null], [SIGN, '为什么总剩两格？']],
        sfxAt: [[QT, 'boing'], [SIGN, 'pop']] },
    ],
    subs: [
      { t0: 0.3, t1: 4.3, text: '这一回，我们陪小陶一起卡一次。' },
      { t0: 4.4, t1: 7.6, text: '这是一道有名的老题目：' },
      { t0: 7.7, t1: 10.5, text: '一个 4×4 的棋盘，', say: '一个四乘四的棋盘，' },
      { t0: 10.6, t1: 13.8, text: '剪掉两个对角上的格子。' },
      { t0: 14.2, t1: 18.2, text: '一块骨牌，正好盖住相邻的两格。' },
      { t0: 18.6, t1: 22.8, text: '问：用 7 块骨牌，能不能把它盖满？', say: '问：用七块骨牌，能不能把它盖满？' },
      { t0: T.can, t1: 25.3, text: '“能！”', voice: 'kid' },
      { t0: 25.45, t1: 27.95, text: '摆，摆，摆……' },
      { t0: L9, t1: L9 + 3.2, text: '最后剩下两格，不挨着。' },
      { t0: L10, t1: L10 + 2.1, text: '再来一次。' },
      { t0: L11, t1: L11 + 2.1, text: '又剩两格。' },
      { t0: L12, t1: L12 + 3.6, text: '第三次，第四次……第九次。' },
      { t0: L13, t1: L13 + 2.4, text: '次次都剩两格。' },
      { t0: L14, t1: L14 + 3.62, text: '“再试一次……就一次……”', voice: 'kid' },
    ],
  });
})();
