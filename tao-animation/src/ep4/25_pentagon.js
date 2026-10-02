// 第 25 场 · 五边形游戏（1986 年 IMO 第 3 题）：五边形顶点上写整数，总和为正；有负数就挑一个，把它变正，再把它（原来的负值）加到两边的邻居上。
// 问：一定会停吗？答：一定会（证明很难）。全场 210 人只有 12 人满分；小陶 3 分，是澳大利亚队这题的全部得分。第一天 7+7+3 = 17 分。
// 演示的 5 步在页面加载时用 JS 重算一遍（和分镜给出的序列不一致就 console.error）。
// 开场 = 第 20 场结尾（小陶在桌前，成绩单 7、7、空，第 2 题的三角形）；结尾只留成绩单（7、7、3）和第 1–3 格下的红括号“17”，交给第 30 场。
(() => {
  const FL = 780, DX = 290, DTOP = 622, DW = 300, SEAT = 640;     // same desk and seat as scene 20
  const SH = E4.SHEET, CELL = SH.cell;
  const cellX = i => SH.at[0] - (6 * CELL + 26) / 2 + i * CELL + (i >= 3 ? 26 : 0) + CELL / 2;
  const CELL_BOT = SH.at[1] + CELL / 2, CELL_L = i => cellX(i) - CELL / 2, CELL_R = i => cellX(i) + CELL / 2;
  const CUT = 25.6;                              // pentagon, desk and Terry leave; the 210 grid comes in
  const DUR = 42.0;

  /* ---------------- the game, re-computed and checked against the storyboard ---------------- */
  const P0 = [2, 1, -2, 0, 1];                  // A (top), B, C, D, E clockwise
  const PICK = [2, 1, 3, 2, 4];                 // C, B, D, C, E
  const EXPECT = [[2, -1, 2, -2, 1], [1, 1, 1, -2, 1], [1, 1, -1, 2, -1], [1, 0, 1, 1, -1], [0, 0, 1, 0, 1]];
  const STATES = [P0];
  PICK.forEach((i, j) => {
    const s = STATES[j], v = s[i];
    if (!(v < 0)) console.error(`d4_pentagon: step ${j + 1} picks ${'ABCDE'[i]} = ${v}, which is not negative`);
    const n = s.slice(); n[i] = -v; n[(i + 4) % 5] += v; n[(i + 1) % 5] += v;
    if (n.join() !== EXPECT[j].join()) console.error(`d4_pentagon: step ${j + 1} gives (${n}) but the storyboard says (${EXPECT[j]})`);
    if (n.reduce((a, b) => a + b, 0) !== 2) console.error('d4_pentagon: the total should stay 2');
    STATES.push(n);
  });
  if (STATES[5].some(v => v < 0)) console.error('d4_pentagon: the game should have stopped after 5 steps');
  const negs = STATES.map(s => s.filter(v => v < 0).length);
  if (negs.join() !== '1,2,1,2,1,0') console.error('d4_pentagon: negatives per step', negs);
  if (7 + 7 + 3 !== 17) console.error('d4_pentagon: day one should be 17');

  /* ---------------- geometry of the pentagon ---------------- */
  const PC = [800, 505],   // top node sits between the sheet's 第一天 / 第二天 labels
  PR = 212, NR = 54, VS = 64;
  const NODE = [0, 1, 2, 3, 4].map(k => { const a = (-90 + 72 * k) * RAD; return [PC[0] + Math.cos(a) * PR, PC[1] + Math.sin(a) * PR]; });

  /* ---------------- timing ---------------- */
  const INIT_T = [1.9, 2.4, 2.9, 3.4, 3.9];     // the five numbers are written
  // each step: ring round the chosen negative (s) → it is struck and turns positive (flip) → red arrows to both neighbours (arr)
  // → the neighbours' old numbers are struck and the new ones written (nb). Step 1 is the rule, played slowly; steps 2–5 take 1.5 s each.
  const STEPS = [
    { s: 5.75, flip: 7.55, arr: 9.35, nb: 10.6, end: 12.25, slow: true },
    ...[13.1, 14.6, 16.1, 17.6].map(s => ({ s, flip: s + 0.25, arr: s + 0.7, nb: s + 0.85, end: s + 1.42 })),
  ];
  /** a struck number: strike drawn (sd), held (hold), then floats up and fades (FLOAT); the new number is written from tw */
  const STRIKE = slow => (slow ? { sd: 0.25, hold: 0.25, nw: 0.15 } : { sd: 0.1, hold: 0.1, nw: 0.1 }), FLOAT = 0.3;
  const STOP_T = 19.25, MORE_T = 11.5, MORE_T1 = 13.95;
  const SURE_T = 21.35, PROOF_T = 23.15, MTN_T = 23.8, MTN_LAND = 24.06;

  /* ---------------- value history of every node: [{v, tw (write starts), ts (struck by the next one)}] ---------------- */
  const HIST = NODE.map((_, k) => [{ v: P0[k], tw: INIT_T[k], speed: 1900 }]);
  STEPS.forEach((st, j) => {
    const i = PICK[j], after = STATES[j + 1], X = STRIKE(st.slow);
    [[i, st.flip], [(i + 4) % 5, st.nb], [(i + 1) % 5, st.nb]].forEach(([k, ts]) => {
      const H = HIST[k], e = H[H.length - 1];
      e.ts = ts; e.X = X;
      H.push({ v: after[k], tw: ts + X.sd + X.hold + X.nw, speed: st.slow ? 2200 : 3400 });
    });
  });
  HIST.forEach((H, k) => H.forEach(e => {
    e.L = layoutWriting({ text: String(e.v), x: NODE[k][0], y: NODE[k][1] - VS / 2, size: VS, t0: e.tw, speed: e.speed, gap: 0.02, glyphGap: 0.02, anchor: 'middle' });
  }));
  /** step number at time t (-1 = none) */
  const stepAt = t => { let j = -1; STEPS.forEach((st, i) => { if (t >= st.s) j = i; }); return j; };

  /** offset copy of an edge from node a toward node b, pushed outward (away from the centre) */
  const edgeArrow = (a, b, off = 26) => {
    const P = NODE[a], Q = NODE[b], d = dist(P, Q), u = [(Q[0] - P[0]) / d, (Q[1] - P[1]) / d];
    let n = [-u[1], u[0]]; const m = [(P[0] + Q[0]) / 2 - PC[0], (P[1] + Q[1]) / 2 - PC[1]];
    if (n[0] * m[0] + n[1] * m[1] < 0) n = [-n[0], -n[1]];
    return { from: [P[0] + u[0] * (NR + 6) + n[0] * off, P[1] + u[1] * (NR + 6) + n[1] * off], to: [Q[0] - u[0] * (NR + 10) + n[0] * off, Q[1] - u[1] * (NR + 10) + n[1] * off], n, mid: [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2] };
  };
  // "+(-2)" beside both arrows in the slow first step
  const ADD_LB = [(PICK[0] + 4) % 5, (PICK[0] + 1) % 5].map((k, j) => {
    const e = edgeArrow(PICK[0], k), c = [e.mid[0] + e.n[0] * 78, e.mid[1] + e.n[1] * 78];
    return layoutWriting({ text: '+(' + P0[PICK[0]] + ')', x: c[0], y: c[1] - 22, size: 44, t0: STEPS[0].arr + 0.3 + j * 0.25, speed: 2800, gap: 0.02, glyphGap: 0.02, anchor: 'middle' });
  });

  COMP.d4_p5pent = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, z = Z.board, k = 'd4p5';
      // edges, then the round nodes on top
      for (let i = 0; i < 5; i++) {
        const p = EASE.out(clamp((lt - i * 0.07) / 0.3)); if (p <= 0) continue;
        stroke(`${k}.e${i}`, [NODE[i], NODE[(i + 1) % 5]], { z: z - 0.2, w: 5, draw: p });
      }
      NODE.forEach((c, i) => {
        const u = clamp((lt - 0.2 - i * 0.06) / 0.25); if (u <= 0) return;
        const sc = Math.max(0.01, EASE.back(u));
        DL.save(); DL.translate(c[0], c[1]); DL.scale(sc);
        stroke(`${k}.n${i}`, ringPts(`${k}.n${i}`, 0, 0, NR, NR, { n: 12, closed: true, rv: 0.03 }), { z, w: 5, closed: true, fill: C.paper });
        DL.restore();
      });
      // values: the current one, and the one just struck out floating away
      HIST.forEach((H, n) => H.forEach((e, j) => {
        if (j > 0 && t < e.tw - 0.001) return;
        let fu = 0;
        if (e.ts !== undefined) { fu = clamp((t - e.ts - e.X.sd - e.X.hold) / FLOAT); if (fu >= 1) return; }
        const op = 1 - fu, c = NODE[n];
        DL.save(); DL.translate(c[0] + 30 * EASE.out(fu), c[1] - 70 * EASE.out(fu)); DL.scale(1 - 0.35 * fu); DL.translate(-c[0], -c[1]);
        e.L.strokes.forEach((st, m) => { const q = clamp((t - st.t0) / st.dur); if (q > 0) stroke(`${k}.v${n}.${j}.${m}`, st.pts, { z: z + 0.3, w: 6.5, draw: q, boil: 0.55, opacity: op }); });
        if (e.ts !== undefined && t >= e.ts) {
          const L = e.L;
          stroke(`${k}.x${n}.${j}`, [[L.x - 10, c[1] + 10], [L.x + L.width + 10, c[1] - 12]], { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp((t - e.ts) / e.X.sd)), opacity: op });
        }
        DL.restore();
      }));
      // the step in progress: red ring round the chosen negative, red arrows to its two neighbours
      const j = stepAt(t);
      if (j >= 0 && t < STEPS[j].end) {
        const st = STEPS[j], i = PICK[j], c = NODE[i];
        stroke(`${k}.ring${j}`, ringPts(`${k}.ring${j}`, c[0], c[1], NR + 17, NR + 17, { n: 12, a0: -130, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 5.5, color: C.red, draw: EASE.out(clamp((t - st.s) / (st.slow ? 0.35 : 0.2))) });
        if (t >= st.arr) [(i + 4) % 5, (i + 1) % 5].forEach((nb, m) => {
          const e = edgeArrow(i, nb);
          arrow(`${k}.ar${j}.${m}`, e.from, e.to, { p: EASE.out(clamp((t - st.arr - m * 0.05) / (st.slow ? 0.3 : 0.18))), bend: 0.08, color: C.red, w: 4.5, head: 18 });
        });
        if (st.slow && t >= st.arr) ADD_LB.forEach((L, m) => L.strokes.forEach((s, q) => { const u = clamp((t - s.t0) / s.dur); if (u > 0) stroke(`${k}.add${m}.${q}`, s.pts, { z: Z.annot, w: 4.5, color: C.red, draw: u, boil: 0.55 }); }));
      }
    },
    cues: fx => {
      const c = [[fx.t0, 'pen'], [fx.t0 + 0.25, 'pop']];
      HIST.forEach(H => H.forEach((e, j) => { if (j === 0) c.push([e.tw, 'pen']); }));
      STEPS.forEach((st, j) => { const X = STRIKE(st.slow), nw = X.sd + X.hold + X.nw; c.push([st.s, 'pen'], [st.flip, 'pen'], [st.flip + nw, 'plip'], [st.arr, st.slow ? 'swish' : 'tap'], [st.nb, 'pen'], [st.nb + nw, 'plip']); if (st.slow) ADD_LB.forEach(L => c.push([L.t0, 'pen'])); });
      return c;
    },
  };
  /** "第 n 步" in the red pen, top right of the pentagon */
  COMP.d4_p5count = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const j = stepAt(t); if (j < 0) return;
      const lt = t - STEPS[j].s, pp = EASE.back(clamp(lt / 0.2));
      text('d4p5.cnt', `第 ${j + 1} 步`, fx.at[0], fx.at[1], { size: 52, color: C.red, rot: -3, z: Z.annot, scale: lerp(0.6, 1, pp), halo: 8 });
    },
  };
  /** red word slammed down (“停！”) */
  COMP.d4_p5slam = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, u = clamp(lt / 0.16), sc = lerp(1.8, 1, EASE.in(u));
      text(fx.id, fx.text, fx.at[0], fx.at[1], { size: fx.size, color: C.red, z: Z.annot, rot: fx.rot, scale: sc, opacity: clamp(u * 2.5), halo: 12 });
      const q = (lt - 0.16) / 0.35;
      if (q > 0 && q < 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => {
        const bx = fx.at[0] + sx * (fx.size * 1.05 + 20 * q), by = fx.at[1] + sy * (fx.size * 0.55 + 14 * q);
        stroke(fx.id + '.L' + i, [[bx, by], [bx + sx * 24, by + sy * 16]], { z: Z.annot, w: 4.5, color: C.red, opacity: 1 - q, boil: 0.6 });
      });
    },
    cues: fx => [[fx.t0, 'whoosh'], [fx.t0 + 0.15, 'stamp']],
  };
  /** “证明” with a little mountain dropped on top of it */
  const PRF = { at: [1275, 652], size: 76 };
  const MTN = [[-130, 0], [-92, -62, 1], [-66, -40, 1], [-14, -150, 1], [22, -90, 1], [50, -118, 1], [124, 0, 1]];
  COMP.d4_p5proof = {
    draw(fx, t) {
      if (t < PROOF_T || t >= fx.t1) return;
      const lt = t - PROOF_T, pp = EASE.back(clamp(lt / 0.25)), [x, y] = PRF.at, top = y - PRF.size * 0.5 - 4;
      const land = t - MTN_LAND, sq = land > 0 && land < 0.35 ? 1 - 0.22 * Math.sin(Math.PI * land / 0.35) : 1;
      DL.save(); DL.translate(x, y + PRF.size * 0.5); DL.scale(1 + (1 - sq) * 0.5, sq); DL.translate(-x, -(y + PRF.size * 0.5));
      text('d4p5.prf', '证明', x, y, { size: PRF.size, z: Z.board, scale: lerp(0.5, 1, pp), opacity: clamp(lt / 0.1) });
      DL.restore();
      if (t >= MTN_T) {
        const u = clamp((t - MTN_T) / (MTN_LAND - MTN_T)), dy = -560 * (1 - EASE.in(u)), mtop = top + PRF.size * 0.5 * (1 - sq);
        DL.save(); DL.translate(x, mtop + dy);
        stroke('d4p5.mtn', MTN, { z: Z.board + 0.5, w: 5, fill: C.paper });
        stroke('d4p5.snow', [[-44, -92], [-28, -82], [-14, -98], [2, -84], [12, -104]], { z: Z.board + 0.6, w: 3.5 });
        stroke('d4p5.base', [[-130, 0], [124, 0]], { z: Z.board + 0.5, w: 4 });
        DL.restore();
        if (land > 0 && land < 0.5) {
          const q = land / 0.5;
          [-1, 1].forEach(s => [0, 1, 2].forEach(i => {
            const bx = x + s * 136, a = (s < 0 ? 200 + i * 22 : -20 - i * 22) * RAD, r0 = 10 + 40 * q;
            stroke(`d4p5.dust${s}${i}`, [[bx + Math.cos(a) * r0, mtop + Math.sin(a) * r0 * 0.6], [bx + Math.cos(a) * (r0 + 18), mtop + Math.sin(a) * (r0 + 18) * 0.6]], { z: Z.fx, w: 3, color: C.pencil, opacity: 1 - q, boil: 0.6 });
          }));
        }
      }
    },
    cues: () => [[PROOF_T, 'pop'], [MTN_T, 'whoosh'], [MTN_LAND, 'thud']],
  };

  /* ---------------- the 210 contestants: 21 × 10 dots, 12 filled in ---------------- */
  const GC = 21, GRW = 10, GP = 38, GCEN = [800, 492], GRID_T = 25.65, FILL_T = 27.3, GRID_T1 = 30.95;
  const ORDER = Array.from({ length: GC * GRW }, (_, i) => i).sort((a, b) => rnd(hstr('d4p5grid'), a, 1) - rnd(hstr('d4p5grid'), b, 1));
  const FULL = ORDER.slice(0, 12).sort((a, b) => a - b);
  if (GC * GRW !== 210 || new Set(FULL).size !== 12) console.error('d4_pentagon: grid should be 210 dots with 12 filled');
  const dotC = i => [GCEN[0] + ((i % GC) - (GC - 1) / 2) * GP, GCEN[1] + (Math.floor(i / GC) - (GRW - 1) / 2) * GP];
  const FULL_PICK = FULL.reduce((b, i) => (dotC(i)[0] - dotC(i)[1] > dotC(b)[0] - dotC(b)[1] ? i : b), FULL[0]);   // the top-right-most one gets the label's arrow
  COMP.d4_p5grid = {
    draw(fx, t) {
      if (t < GRID_T || t >= GRID_T1) return;
      for (let i = 0; i < GC * GRW; i++) {
        const r = Math.floor(i / GC), u = clamp((t - GRID_T - r * 0.055 - (i % GC) * 0.006) / 0.15); if (u <= 0) continue;
        const c = dotC(i), j = FULL.indexOf(i);
        stroke('d4p5.g' + i, ringPts('d4p5.g' + i, c[0], c[1], 12, 12, { n: 8, closed: true, rv: 0.06 }), { z: Z.board, w: 2.6, closed: true, fill: C.paper, opacity: u, boil: 0.5 });
        if (j >= 0) { const v = clamp((t - FILL_T - j * 0.09) / 0.15); if (v > 0) dot('d4p5.gf' + i, c, 12.5 * EASE.back(v), C.ink, Z.board + 0.1); }
      }
    },
    cues: () => [...Array(GRW).keys()].map(r => [GRID_T + r * 0.055, 'tap']).filter((_, r) => r % 2 === 0).concat(FULL.map((_, j) => [FILL_T + j * 0.09, 'plip'])),
  };

  /* ---------------- after the grid: a little pentagon under box 3, then the “17” brace ---------------- */
  COMP.d4_p5icon = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.35)), [cx, cy] = fx.at, r = fx.r;
      const pts = [0, 1, 2, 3, 4].map(k => { const a = (-90 + 72 * k) * RAD; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
      stroke('d4p5.icon', [pts[0], ...pts.slice(1).map(q => [q[0], q[1], 1]), [pts[0][0], pts[0][1], 1]], { z: Z.board, w: 5, draw: p });
      pts.forEach((q, k) => { if (p > 0.6) dot('d4p5.icd' + k, q, 9, C.ink, Z.board + 0.1); });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  const BR = { x0: CELL_L(0) + 6, x1: CELL_R(2) - 6, y: 262, d: 34, t0: 39.0 };
  COMP.d4_p5brace = {
    draw(fx, t) {
      if (t < BR.t0) return;
      const { x0, x1, y, d } = BR, m = (x0 + x1) / 2, h = d / 2, p = EASE.out(clamp((t - BR.t0) / 0.45));
      const pts = [[x0, y], [x0 + 10, y + h * 0.9], [x0 + 26, y + h, 1], [m - 24, y + h, 1], [m - 8, y + h * 1.15], [m, y + d, 1], [m + 8, y + h * 1.15], [m + 24, y + h, 1], [x1 - 26, y + h, 1], [x1 - 10, y + h * 0.9], [x1, y]];
      stroke('d4p5.brace', pts, { z: Z.annot, w: 5, color: C.red, draw: p, boil: 0.6 });
    },
    cues: () => [[BR.t0, 'pen']],
  };
  const SEV_X = (BR.x0 + BR.x1) / 2;

  /* ---------------- scene 20's end frame: problem 2's triangle and its label, cleared away first ---------------- */
  const GEO = { c: [1090, 520] }, GT = [[-40, -150], [-200, 100], [120, 90]], GARC = { r: 112, a0: -94, a1: 26 };
  const GEO_LB_AT = [826, 352], GEO_LB_TG = [GEO.c[0] - 118, GEO.c[1] - 40], GEO_OUT = 0.15;
  COMP.d4_p5geo = {
    draw(fx, t) {
      const u = clamp((t - GEO_OUT) / 0.3), sc = 1 - EASE.in(u); if (sc <= 0.02) return;
      const [cx, cy] = GEO.c, z = Z.board, k = 'd4p5.geo';
      DL.save(); DL.translate(cx, cy); DL.scale(sc); DL.translate(-cx, -cy);
      const P = GT.map(([x, y]) => [cx + x, cy + y]);
      stroke(k + '.tri', [P[0], [P[1][0], P[1][1], 1], [P[2][0], P[2][1], 1], [P[0][0], P[0][1], 1]], { z, w: 5.5 });
      const O = P[2], at = a => [O[0] + Math.cos(a * RAD) * GARC.r, O[1] + Math.sin(a * RAD) * GARC.r];
      dot(k + '.p0', at(GARC.a0), 8, C.ink, z + 0.2);
      const pts = []; for (let i = 0; i <= 10; i++) pts.push(at(lerp(GARC.a0, GARC.a1, i / 10)));
      stroke(k + '.arc', pts, { z, w: 4.5 });
      [0, 1].forEach(j => stroke(k + '.sp' + j, [O, at(j ? GARC.a1 : GARC.a0)], { z: z - 0.1, w: 2.2, color: C.pencil, boil: 0.5 }));
      const e = at(GARC.a1), b = at(GARC.a1 - 14), L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = 20;
      const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
      const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
      stroke(k + '.ah', [r1, [e[0], e[1], 1], r2], { z, w: 4.5 });
      dot(k + '.p1', e, 8, C.ink, z + 0.2);
      DL.restore();
    },
    cues: () => [[GEO_OUT, 'whoosh']],
  };
  /** the three problem papers lying flat on Terry's desk, and his pencil (as scene 20 leaves them) */
  COMP.d4_p5desk = {
    draw(fx, t, F) {
      if (t >= fx.t1) return;
      [0, 1, 2].forEach(i => {
        const c = [DX + 46 + i * 30, DTOP - 1], w = 82, h = 104, sy = 0.12;
        DL.save(); DL.translate(c[0], c[1] - (h / 2) * sy); DL.rotate(-6 + i * 5); DL.scale(0.8, sy);
        const z = Z.desk + 1 + i * 0.01;
        stroke('d4p5.pp' + i, [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z, w: 4, fill: C.paper });
        for (let r = 0; r < 4; r++) stroke(`d4p5.pp${i}.l${r}`, [[-w / 2 + 12, -h / 2 + 22 + r * 20], [w / 2 - (r === 3 ? 34 : 12), -h / 2 + 23 + r * 20]], { z: z + 0.05, w: 2.4, boil: 0.6 });
        DL.restore();
      });
      const a = F.anchors.terry; if (!a) return;
      const h = a.handR, d = [-0.55, 0.84];
      stroke('d4p5.pen', [[h[0] - d[0] * 16, h[1] - d[1] * 16], [h[0] + d[0] * 18, h[1] + d[1] * 18]], { z: Z.front + 1, w: 6 });
      stroke('d4p5.tip', [[h[0] + d[0] * 18, h[1] + d[1] * 18], [h[0] + d[0] * 25, h[1] + d[1] * 25]], { z: Z.front + 1, w: 2.5 });
    },
  };

  /* ---------------- Terry (same seat and rest pose as the end of scene 20) ---------------- */
  const SITK = { sit: 1, legScale: 1.15, thigh: 0.2, legL: [70, -63], legR: [70, -63] };
  const desk = (dx, dy = -3, bend = 'down') => ({ w: 1, to: 'desk', dx, dy, bend });
  const REST = { ...SITK, ikL: desk(-46), ikR: desk(40) };
  const CHIN = { ...SITK, tilt: -7, armScale: 1.55, ikL: { w: 1, to: 'chin', dx: -0.25, dy: 0.02, bend: 'down' }, ikR: desk(40) };
  const UP = { ...SITK, lean: -3, tilt: -5, ikL: desk(-48, -6, 'out'), ikR: desk(42, -6, 'out') };
  /** where Terry looks: the node being played, or what is being said */
  const selAt = t => { const j = stepAt(t); return j >= 0 ? NODE[PICK[j]] : PC; };

  defineScene({
    id: 'pentagon', chapter: '五边形游戏', dur: DUR, floor: FL,
    cast: { terry: { ...E4.terry, desk: [DX, DTOP - 3] } },
    tracks: {
      terry: {
        pos: [[0, [DX, SEAT]], [CUT, [-900, SEAT], 0]],
        pose: [[0, REST], [13.0, CHIN, 0.14, 'back'], [STOP_T, UP, 0.1, 'back'], [21.3, REST, 0.2]],
        face: [[0, 'focus'], [13.0, 'puzzled', 0.08], [STOP_T, 'surprised', 0.05], [20.7, 'focus', 0.1]],
        turn: [[0, 0.3], [0.6, 0.35, 0.12]],
        gaze: [[0, [1090, 500]], [0.6, 'pent'], [5.75, 'sel'], [STOP_T, 'pent'], [SURE_T, [1275, 360]], [PROOF_T, [1275, 600]]],
        squash: [[0, 1], [STOP_T, 1.07, 0.05], [STOP_T + 0.06, 1, 0.22, 'back']],
      },
    },
    targets: F => ({ pent: PC, sel: selAt(F.t), 'd4p5.full': [dotC(FULL_PICK)[0] + 10, dotC(FULL_PICK)[1] - 10] }),   // the label "12 人满分" points at one filled dot
    set: [
      { type: 'floor' },
      { type: 'chair', x: DX, seat: DTOP + 4, t1: CUT },
      { type: 'desk', x: DX, top: DTOP, w: DW, open: true, t1: CUT },
    ],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2 },
      { type: 'd4_p5desk', id: 'd4p5.desk', t1: CUT },
      // the score sheet carries on from scene 20 (7, 7, empty); box 3 gets its 3
      { type: 'e4_scores', id: 'd4p5.sheet', at: SH.at, cell: CELL, t0: -1, scores: [[7, -1], [7, -1], [3, 32.15], [null, 0], [null, 0], [null, 0]] },
      // scene 20's last picture leaves
      { type: 'd4_p5geo', id: 'd4p5.geo' },
      { type: 'label', id: 'd4p5.lbGeo', text: '几何', at: GEO_LB_AT, rot: -4, size: 50, t0: -1, t1: GEO_OUT + 0.12, target: GEO_LB_TG, bend: -0.25, gap: 12 },
      // the game
      { type: 'label', id: 'd4p5.lbP3', text: '第 3 题', at: [592, 330], rot: -3, t0: 1.2, t1: 4.95, target: [cellX(2) - 6, CELL_BOT + 6], bend: -0.2, gap: 10 },
      { type: 'd4_p5pent', id: 'd4p5.pent', t0: 0.55, t1: CUT },
      { type: 'd4_p5count', id: 'd4p5.cnt', at: [1270, 300], t1: STEPS[4].end + 0.1 },
      { type: 'label', id: 'd4p5.lbMore', text: ['负数', '反而变多了？'], at: [1275, 470], rot: 3, size: 54, t0: MORE_T, t1: MORE_T1 },
      { type: 'd4_p5slam', id: 'd4p5.stop', text: '停！', at: [PC[0] + 8, PC[1] + 6], size: 130, rot: -6, t0: STOP_T, t1: 20.8 },
      { type: 'label', id: 'd4p5.lbSure', text: '一定会停', at: [1275, 360], rot: -4, size: 56, t0: SURE_T, t1: CUT },
      { type: 'd4_p5proof', id: 'd4p5.proof', t1: CUT },
      // 210 contestants, 12 full marks
      { type: 'd4_p5grid', id: 'd4p5.grid' },
      { type: 'label', id: 'd4p5.lb210', text: '210 人', at: [262, 492], rot: -4, size: 50, t0: 26.25, t1: GRID_T1, target: [GCEN[0] - (GC / 2) * GP - 4, GCEN[1] - 40], bend: 0.2, gap: 12 },
      { type: 'label', id: 'd4p5.lb12', text: '12 人满分', at: [1360, 268], rot: 3, size: 50, t0: 28.75, t1: GRID_T1, target: { target: 'd4p5.full' }, bend: 0.2, gap: 18 },
      // 3 points: all of Australia's points on this problem
      { type: 'd4_p5icon', id: 'd4p5.icon', at: [cellX(2) + 4, 372], r: 72, t0: 31.05, t1: 38.75 },
      { type: 'label', id: 'd4p5.lbAus', text: ['澳大利亚队', '这题的全部分数'], at: [1090, 470], rot: -3, size: 62, t0: 33.95, t1: 38.75, target: [CELL_R(2) + 8, CELL_BOT - 4], bend: 0.18, gap: 12 },
      // day one: 17
      { type: 'd4_p5brace', id: 'd4p5.brace' },
      { type: 'write', id: 'd4p5.17', text: '17', x: SEV_X, y: BR.y + BR.d + 16, size: 96, t0: 39.75, speed: 2600, gap: 0.03, glyphGap: 0.03, w: 7, color: 'red', anchor: 'middle', sfx: 'pen', z: Z.annot },
    ],
    subs: [
      { t0: 1.1, t1: 5.1, text: '第三题，是五边形上的数字游戏：' },
      { t0: 5.4, t1: 9.0, text: '哪个数是负的，就把它变正，' },
      { t0: 9.1, t1: 12.5, text: '再把它加到两边的邻居上。' },
      { t0: 13.0, t1: 17.0, text: '问：这个游戏，一定会停下来吗？' },
      { t0: 20.7, t1: 25.3, text: '答案是：一定会。可是要证明，太难了。' },
      { t0: 25.7, t1: 30.7, text: '全场210个人，只有12个人做出满分。', say: '全场两百一十个人，只有十二个人做出满分。' },
      { t0: 31.1, t1: 33.7, text: '小陶拿了3分——', say: '小陶拿了三分——' },
      { t0: 33.8, t1: 38.2, text: '是澳大利亚队在这道题上的全部分数。' },
      { t0: 38.9, t1: 41.5, text: '第一天，17分。', say: '第一天，十七分。' },
    ],
  });
})();
