// 猜想会骗人：圆上连线（旁白插话的经典例子，不是陶哲轩的真实事件）。
// 2、3、4、5 个点 → 2、4、8、16 块；6 个点只有 31 块（不是 32）。
// 区域是现算的：在圆里撒细网格，按每条弦所在直线的正负号分组（弦贯穿整个圆，所以每一组正好是一块），
// 数字放在每块的重心（重心太贴边时改放在离边最远的点）。
(() => {
  const FL = 780;

  /* ---------------- geometry: points, chords, regions ---------------- */
  const onCircle = a => [Math.cos(a * RAD), Math.sin(a * RAD)];
  const chordsOf = n => { const c = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c.push([i, j]); return c; };
  /** regions of the unit disk cut by every chord between points at angles angs (deg, screen) */
  function c2Regions(angs, N) {
    const P = angs.map(onCircle), ch = chordsOf(P.length).map(([i, j]) => {
      const [x1, y1] = P[i], [x2, y2] = P[j], nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny);
      return [x1, y1, nx / L, ny / L];
    });
    const edge = (x, y) => { let d = 1 - Math.hypot(x, y); for (const [x1, y1, nx, ny] of ch) d = Math.min(d, Math.abs((x - x1) * nx + (y - y1) * ny)); return d; };
    const G = new Map();
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
      const x = -1 + 2 * (a + 0.5) / N, y = -1 + 2 * (b + 0.5) / N;
      if (x * x + y * y >= 0.994) continue;
      let key = '';
      for (const [x1, y1, nx, ny] of ch) key += (x - x1) * nx + (y - y1) * ny > 0 ? '1' : '0';
      let g = G.get(key); if (!g) { g = { n: 0, sx: 0, sy: 0, r: -1, inc: null }; G.set(key, g); }
      g.n++; g.sx += x; g.sy += y;
      const d = edge(x, y); if (d > g.r) { g.r = d; g.inc = [x, y]; }
    }
    return [...G.values()].map(g => {
      const c = [g.sx / g.n, g.sy / g.n], dc = edge(c[0], c[1]);
      return { r: g.r, p: dc >= 0.8 * g.r ? c : g.inc };
    });
  }
  // small circles (2, 3, 4, 5 points) and the big one (6 points): irregular angles, no three chords through one point
  const ROW = [
    { n: 2, angs: [-30, 168], expect: 2 },
    { n: 3, angs: [-62, 58, 188], expect: 4 },
    { n: 4, angs: [-42, 62, 148, 246], expect: 8 },
    { n: 5, angs: [-80, -8, 64, 150, 222], expect: 16 },
  ];
  ROW.forEach(c => { const k = c2Regions(c.angs, 260).length; if (k !== c.expect) console.error(`c2 circles: ${c.n} points give ${k} regions, expected ${c.expect}`); });
  const A6 = [49.2, 102.4, 183.3, 236.1, 291, 344];
  const REG = c2Regions(A6, 420);
  if (REG.length !== 31) console.error(`c2 circles: 6 points give ${REG.length} regions, expected 31`);
  // counting order: outer ring, middle ring, centre — each clockwise from the top
  const ringOf = p => { const d = Math.hypot(p[0], p[1]); return d > 0.72 ? 0 : d > 0.45 ? 1 : 2; };
  const angOf = p => (Math.atan2(p[1], p[0]) / RAD + 90 + 360 + 8) % 360;
  REG.sort((a, b) => ringOf(a.p) - ringOf(b.p) || angOf(a.p) - angOf(b.p));

  /* ---------------- timing ---------------- */
  const T = {
    ring: [5.0, 5.25, 5.5, 5.75],          // the four little circles draw on
    pts: [8.6, 13.6, 15.7, 18.0],          // their points pop
    chords: [9.9, 13.95, 16.05, 18.35],    // chords draw
    count: [12.25, 14.8, 17.15, 19.75],    // "2块", "4块", ...
    seq: 21.0, hops: [23.45, 24.05, 24.65],
    B: 26.1,                               // row fades, sequence docks top-right, the big circle
    bigRing: 26.85, bigPts: 27.35, bigChords: 27.8, guess: 29.4, qm: 28.5,
    count0: 31.0, countDur: 5.5,
    only31: 36.85, broken: 39.9,
    Cc: 43.8, row1: 44.4, row2: 47.9, proof: 52.75,
  };
  const numT = i => T.count0 + T.countDur * Math.pow(i / 30, 0.82);
  const CHORD_GAP = 0.1, CHORD_DUR = 0.26;

  /* ---------------- the row of four small circles ---------------- */
  const ROW_Y = 245, ROW_R = 98, ROW_X = [180, 440, 700, 960];
  const numW = (s, size) => layoutWriting({ text: s, x: 0, y: 0, size, t0: 0, speed: 1 }).xEnd;
  COMP.c2_row = {
    init(fx) {
      fx.counts = ROW.map((c, i) => {
        const s = String(c.expect), size = 58, w = numW(s, size) + 52;
        return layoutWriting({ text: s, x: ROW_X[i] - w / 2, y: ROW_Y + ROW_R + 34, size, t0: T.count[i], speed: 1500, gap: 0.03 });
      });
      return fx;
    },
    draw(fx, t) {
      if (t >= fx.t1) return;
      const op = 1 - clamp((t - fx.fade) / 0.35);
      ROW.forEach((c, i) => {
        const cx = ROW_X[i], cy = ROW_Y, k = 'c2r' + i, rp = EASE.out(clamp((t - T.ring[i]) / 0.45));
        if (rp <= 0) return;
        stroke(k + '.o', ringPts(k + '.o', cx, cy, ROW_R, ROW_R, { n: 16, a0: -110, rv: 0.012, closed: true }), { z: Z.board, w: 5, closed: true, draw: rp, opacity: op });
        if (rp > 0.8) text(k + '.lab', `${c.n}个点`, cx, cy - ROW_R - 34, { size: 36, z: Z.board, opacity: op * clamp((t - T.ring[i] - 0.3) / 0.2) });
        const P = c.angs.map(a => onCircle(a).map((v, j) => (j ? cy : cx) + v * ROW_R));
        chordsOf(c.n).forEach(([a, b], j) => {
          const u = EASE.io(clamp((t - T.chords[i] - j * CHORD_GAP) / CHORD_DUR));
          if (u > 0) stroke(k + '.ch' + j, [P[a], P[b]], { z: Z.board, w: 3.6, draw: u, opacity: op, bow: 0.5 });
        });
        P.forEach((p, j) => { const u = clamp((t - T.pts[i] - j * 0.07) / 0.15); if (u > 0) dot(k + '.p' + j, p, 9 * EASE.back(u), C.ink, Z.board + 1); });
        const w = fx.counts[i];
        w.strokes.forEach((s, j) => { const u = clamp((t - s.t0) / s.dur); if (u > 0) stroke(k + '.n' + j, s.pts, { z: Z.board, w: 5.5, draw: u, opacity: op, boil: 0.55 }); });
        if (t >= w.tEnd) text(k + '.kuai', '块', w.xEnd + 26, w.y + 32, { size: 50, z: Z.board, opacity: op, scale: lerp(0.6, 1, EASE.back(clamp((t - w.tEnd) / 0.18))) });
      });
    },
    cues: fx => ROW.flatMap((c, i) => [[T.ring[i], 'swish'], ...c.angs.map((_, j) => [T.pts[i] + j * 0.07, 'plip']),
      ...chordsOf(c.n).map((_, j) => [T.chords[i] + j * CHORD_GAP, 'pen']), [fx.counts[i].t0, 'pen'], [fx.counts[i].tEnd, 'pop']]),
  };

  /* ---------------- the sequence 2, 4, 8, 16 (… 32?) with ×2 hops; docks top-right ---------------- */
  const SQ = { x: 330, y: 452, size: 100 };
  const SEQ_POS = [[0, [0, 0]], [T.B, [1062 - 0.6 * SQ.x, 64 - 0.6 * SQ.y], 0.7, 'io']];
  const SEQ_SC = [[0, 1], [T.B, 0.6, 0.7, 'io']];
  COMP.c2_seq = {
    init(fx) {
      fx.a = layoutWriting({ text: '2, 4, 8, 16', x: SQ.x, y: SQ.y, size: SQ.size, t0: T.seq, speed: 2000, gap: 0.03, glyphGap: 0.03 });
      fx.b = layoutWriting({ text: ', 32', x: fx.a.xEnd, y: SQ.y, size: SQ.size, t0: T.guess, speed: 2000, gap: 0.03, glyphGap: 0.03 });
      fx.q = layoutWriting({ text: '?', x: fx.b.xEnd, y: SQ.y, size: SQ.size, t0: fx.b.tEnd + 0.08, speed: 1600 });
      // number boxes (digits grouped), for the hops
      fx.nums = []; let cur = null;
      fx.a.boxes.concat(fx.b.boxes).forEach(b => {
        if (/\d/.test(b.ch)) { if (!cur) { cur = { x0: b.x, x1: b.x + b.w }; fx.nums.push(cur); } else cur.x1 = b.x + b.w; } else cur = null;
      });
      fx.hopT = T.hops.concat([fx.b.tEnd + 0.05]);
      return fx;
    },
    draw(fx, t) {
      if (t < T.seq) return;
      const pos = evalTrack(SEQ_POS, t), sc = evalTrack(SEQ_SC, t);
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc);
      const ink = (w, col, key) => w.strokes.forEach((s, j) => { const u = clamp((t - s.t0) / s.dur); if (u > 0) stroke(key + j, s.pts, { z: Z.board, w: 7, color: col, draw: u, boil: 0.55 }); });
      ink(fx.a, C.ink, 'c2sa'); ink(fx.b, C.ink, 'c2sb'); ink(fx.q, C.red, 'c2sq');
      const base = SQ.y + SQ.size, cx = i => (fx.nums[i].x0 + fx.nums[i].x1) / 2;
      fx.hopT.forEach((t0, k) => {
        const lt = t - t0; if (lt < 0) return;
        const y = base + 22;
        arrow('c2h' + k, [cx(k) + 6, y], [cx(k + 1) - 6, y], { p: EASE.io(clamp(lt / 0.34)), bend: 0.42, head: 18, w: 4.5 });
        const mx = (cx(k) + cx(k + 1)) / 2, my = y + (cx(k + 1) - cx(k)) * 0.21 + 44;
        const pp = clamp((lt - 0.2) / 0.18);
        if (pp > 0) text('c2hx' + k, '×2', mx, my, { size: 54, font: CFG.FONT_MIX, color: C.red, z: Z.annot, scale: lerp(0.3, 1, EASE.back(pp)), halo: 6 });
        if (k === 3 && t >= T.broken) { // the rule breaks: strike the last "×2"
          const u = EASE.out(clamp((t - T.broken) / 0.25));
          stroke('c2hxX', [[mx - 46, my + 26], [lerp(mx - 46, mx + 46, u), lerp(my + 26, my - 26, u)]], { z: Z.annot + 1, w: 6, color: C.red });
        }
      });
      if (t >= T.only31) { // cross out "32?"
        const x0 = fx.nums[4].x0 - 12, x1 = fx.q.xEnd + 6, y0 = SQ.y - 6, y1 = base + 8;
        const u1 = EASE.out(clamp((t - T.only31) / 0.2)), u2 = EASE.out(clamp((t - T.only31 - 0.2) / 0.2));
        stroke('c2x1', [[x0, y0], lerp2([x0, y0], [x1, y1], u1)], { z: Z.annot, w: 7, color: C.red });
        if (u2 > 0) stroke('c2x2', [[x1, y0], lerp2([x1, y0], [x0, y1], u2)], { z: Z.annot, w: 7, color: C.red });
      }
      DL.restore();
    },
    cues: fx => fx.a.strokes.map(s => [s.t0, 'pen']).concat(fx.b.strokes.map(s => [s.t0, 'pen']), [[fx.q.t0, 'pen']],
      fx.hopT.map(t0 => [t0, 'hop']), [[T.B, 'whoosh'], [T.only31, 'pen'], [T.only31 + 0.2, 'pen'], [T.broken, 'pen']]),
  };

  /* ---------------- the big 6-point circle, numbered as we count ---------------- */
  const BIG = { R: 330 };
  const BIG_POS = [[0, [562, 440]], [T.Cc, [250, 362], 0.7, 'io']];
  const BIG_SC = [[0, 1], [T.Cc, 0.5, 0.7, 'io']];
  COMP.c2_big = {
    draw(fx, t) {
      if (t < T.bigRing) return;
      const pos = evalTrack(BIG_POS, t), sc = evalTrack(BIG_SC, t), R = BIG.R;
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc);
      stroke('c2b.o', ringPts('c2b.o', 0, 0, R, R, { n: 22, a0: -100, rv: 0.008, closed: true }), { z: Z.board, w: 6, closed: true, draw: EASE.out(clamp((t - T.bigRing) / 0.5)) });
      const P = A6.map(a => onCircle(a).map(v => v * R));
      chordsOf(6).forEach(([a, b], j) => {
        const u = EASE.io(clamp((t - T.bigChords - j * CHORD_GAP) / CHORD_DUR));
        if (u > 0) stroke('c2b.ch' + j, [P[a], P[b]], { z: Z.board, w: 4, draw: u, bow: 0.4 });
      });
      P.forEach((p, j) => { const u = clamp((t - T.bigPts - j * 0.08) / 0.15); if (u > 0) dot('c2b.p' + j, p, 12 * EASE.back(u), C.ink, Z.board + 1); });
      REG.forEach((g, i) => {
        const lt = t - numT(i); if (lt < 0) return;
        const size = clamp(g.r * R * 1.45, 24, 46), q = [g.p[0] * R, g.p[1] * R];
        text('c2b.n' + i, String(i + 1), q[0], q[1] + 1, { size, font: CFG.FONT_MIX, z: Z.annot, scale: lerp(0.3, 1, EASE.back(clamp(lt / 0.16))) });
        if (i === 30) {
          const u = EASE.out(clamp((lt - 0.12) / 0.3));
          stroke('c2b.ring31', ringPts('c2b.ring31', q[0] + 1, q[1] + 2, size * 0.95, size * 0.8, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: u });
        }
      });
      DL.restore();
    },
    cues: () => [[T.bigRing, 'swish'], ...A6.map((_, j) => [T.bigPts + j * 0.08, 'plip']),
      ...chordsOf(6).map((_, j) => [T.bigChords + j * CHORD_GAP, 'pen']), ...REG.map((_, i) => [numT(i), i === 30 ? 'ding' : 'plip'])],
  };

  /* ---------------- conclusion: little red arrows between words, a yellow swipe under 证明 ---------------- */
  COMP.c2_arrow = {
    draw(fx, t) { if (t < fx.t0) return; arrow(fx.id, fx.from, fx.to, { p: EASE.out(clamp((t - fx.t0) / 0.3)), bend: fx.bend ?? -0.12, head: 18, w: 4.5 }); },
    cues: fx => [[fx.t0, 'pen']],
  };
  COMP.c2_swipe = {
    draw(fx, t) {
      const p = EASE.out(clamp((t - fx.t0) / (fx.dur || 0.35))); if (p <= 0) return;
      const [x0, y0, x1r, y1] = fx.box, x1 = lerp(x0, x1r, p), n = 8, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); top.push([x, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([x, y1 + Math.sin(i * 2.3) * 4]); }
      stroke(fx.id, top.concat(bot), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  // standing poses for Terry in this scene
  Object.assign(POSE, {
    c2_akimbo: { lean: -2, tilt: -4, ikL: { w: 1, to: 'hip', dx: -30, dy: -6, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 30, dy: -6, bend: 'out' } },
    c2_scratchStand: { tilt: 8, armScale: 1.7, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 1.0, dy: -0.95, bend: 'out' } },
    c2_thinkStand: { tilt: -6, armScale: 1.5, ikR: { w: 1, to: 'hip', dx: 24, dy: -2, bend: 'out' }, ikL: { w: 1, to: 'head', dx: -1.02, dy: 0.42, bend: 'out' } },
    c2_pointL: { lean: -3, armScale: 1.5, armL: [84, 6], armR: [16, 10] },
    c2_shock: { lean: -5, armScale: 1.5, armL: [128, 36], armR: [128, 36] },
  });
  const TX = 1440, QX = 1130;
  const ROW1 = 262, ROW2 = 410, WX = 448;

  defineScene({
    id: 'circles', chapter: '猜想会骗人', dur: 56.6, floor: FL,
    cast: {
      terry: { H: 245, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.15,
        pos: [[0, [TX, FL]]],
        pose: [[0, 'c2_thinkStand'], [4.9, 'stand', 0.2], [21.0, 'c2_pointL', 0.15, 'back'], [26.1, 'stand', 0.2], [T.guess - 0.1, 'c2_akimbo', 0.18],
          [T.only31 - 0.15, 'c2_shock', 0.1, 'back'], [T.only31 + 1.6, 'stand', 0.25], [39.2, 'c2_scratchStand', 0.25], [T.Cc, 'c2_thinkStand', 0.3],
          [T.proof, 'stand', 0.25]],
        face: [[0, 'puzzled'], [4.9, 'neutral', 0.1], [5.4, 'focus', 0.1], [12.25, 'smile', 0.1], [21.0, 'idea', 0.08], [23.45, 'grin', 0.1],
          [26.1, 'focus', 0.1], [T.guess - 0.1, 'proud', 0.1], [30.8, 'focus', 0.1], [T.only31 - 0.15, 'jaw', 0.06, 'back'], [T.only31 + 1.6, 'surprised', 0.15],
          [39.2, 'puzzled', 0.12], [T.Cc, 'focus', 0.15], [T.proof, 'idea', 0.08], [T.proof + 1.0, 'smile', 0.15]],
        turn: [[0, -0.35]],
        gaze: [[0, [1250, 330]], [4.9, 'row'], [21.0, 'seqA'], [T.B, 'c2big'], [T.guess, 'seqB'], [T.qm + 0.1, 'viewer'], [T.guess + 1.4, 'c2big'],
          [T.count0 - 0.2, 'c2cur'], [T.only31 - 0.15, 'viewer'], [T.only31 + 1.6, 'n31'], [39.2, 'viewer'], [T.Cc + 0.6, 'words'], [T.proof, 'proof'], [T.proof + 1.2, 'viewer']],
        squash: [[0, 1], [T.only31 - 0.15, 1.12, 0.06], [T.only31 - 0.08, 1, 0.3, 'back'], [T.guess - 0.1, 0.94, 0.08], [T.guess, 1, 0.2, 'back']],
      },
    },
    targets: F => {
      const lt = F.t;
      let i = 0; for (let k = 1; k < 4; k++) if (lt >= T.pts[k] - 0.3) i = k;
      // the number being counted right now (for eyes), in screen coordinates
      const pos = evalTrack(BIG_POS, lt), sc = evalTrack(BIG_SC, lt), k = REG.findIndex((_, j) => numT(j) > lt), n = k < 0 ? 30 : clamp(k - 1, 0, 30);
      const cur = REG[n], c2cur = [pos[0] + cur.p[0] * BIG.R * sc, pos[1] + cur.p[1] * BIG.R * sc];
      return { row: [ROW_X[i], ROW_Y], seqA: [620, 520], seqB: [1330, 110], n31: [1280, 320], words: [760, 330], proof: [720, 600], c2cur, c2big: pos };
    },
    fx: [
      // L1: tried a few, all fine — so why isn't that enough?
      { type: 'thought', id: 'th', at: [1235, 330], rx: 175, ry: 82, t0: 0.45, t1: 4.8, from: { char: 'terry', part: 'headTop', dy: -30 } },
      { type: 'write', id: 'thok', text: '✓ ✓ ✓', x: 1118, y: 298, size: 58, t0: 0.95, t1: 4.8, speed: 1400, gap: 0.12, glyphGap: 0.1, color: 'ink', w: 5, z: Z.fx + 1, sfx: 'pen' },
      { type: 'write', id: 'thq', text: '?', x: 1322, y: 290, size: 72, t0: 2.75, t1: 4.8, speed: 900, color: 'red', w: 5.5, z: Z.fx + 1, sfx: 'pen' },
      // L2–L6: the little circles, the counts, the doubling
      { type: 'c2_row', id: 'row', t1: T.B + 0.4, fade: T.B },
      { type: 'c2_seq', id: 'seq' },
      // L7–L10: six points
      { type: 'c2_big', id: 'big' },
      { type: 'qm', id: 'qm', size: 190, t0: T.qm, burst: true,
        pos: [[0, [QX, FL]]],
        act: [[0, 'hop'], [T.qm + 0.9, 'idle'], [T.only31 - 0.1, 'idle'], [T.broken - 0.3, 'shake'], [T.broken + 1.2, 'idle'], [T.proof + 0.35, 'hop'], [T.proof + 2.2, 'idle']],
        mood: [[0, 'happy'], [T.count0 - 0.2, 'neutral'], [T.only31 - 0.15, 'surprised'], [T.broken - 0.3, 'doubt'], [T.Cc, 'neutral'], [T.proof + 0.35, 'happy']],
        gaze: [[0, 'viewer'], [T.guess + 0.3, [1330, 110]], [T.count0 - 0.2, 'c2cur'], [T.only31 + 0.2, 'viewer'], [T.only31 + 1.4, [1250, 320]], [T.Cc + 0.6, [760, 330]], [T.proof + 0.35, 'viewer']],
        sign: [[0, null], [T.guess + 0.2, '32？'], [T.count0 - 0.3, null], [T.proof + 0.35, '所以要证明！']],
        sfxAt: [[T.qm, 'boing'], [T.only31, 'boing'], [T.proof + 0.35, 'pop'], [T.proof + 0.8, 'hop'], [T.proof + 1.25, 'hop']] },
      // "31!" — big, red
      { type: 'write', id: 'n31', text: '31', x: 1184, y: 238, size: 150, t0: T.only31, speed: 3000, gap: 0.03, color: 'red', w: 9, z: Z.annot, sfx: 'pen' },
      { type: 'title', id: 'n31x', text: '！', x: 1408, y: 316, size: 140, t0: T.only31 + 0.62, color: 'red', rot: 6, sfx: 'stamp' },
      // L11–L13: guessing a pattern is only the start → reasons → proof
      { type: 'scribe', id: 'w1a', text: '猜出规律', x: WX, y: ROW1, size: 62, t0: T.row1, cps: 8 },
      { type: 'c2_arrow', id: 'a1', from: [WX + 262, ROW1 + 4], to: [WX + 360, ROW1 + 4], t0: T.row1 + 1.3 },
      { type: 'scribe', id: 'w1b', text: '只是开始', x: WX + 382, y: ROW1, size: 62, t0: T.row1 + 1.6, cps: 8 },
      { type: 'scribe', id: 'w2a', text: '永远成立？', x: WX, y: ROW2, size: 62, t0: T.row2, cps: 8 },
      { type: 'c2_arrow', id: 'a2', from: [WX + 326, ROW2 + 4], to: [WX + 424, ROW2 + 4], t0: T.row2 + 1.9 },
      { type: 'scribe', id: 'w2b', text: '讲出道理', x: WX + 446, y: ROW2, size: 62, t0: T.row2 + 2.3, cps: 8 },
      { type: 'c2_swipe', id: 'hiProof', box: [560, 572, 880, 668], t0: T.proof + 0.35, dur: 0.4 },
      { type: 'title', id: 'proof', text: '证明', x: 720, y: 610, size: 140, t0: T.proof, sfx: 'stamp' },
    ],
    sfx: [[0.15, 'pop'], [T.guess - 0.1, 'boop'], [T.only31 - 0.15, 'boing'], [39.2, 'plip']],
    subs: [
      { t0: 0.3, t1: 4.8, text: '试了几个都对，为什么还不够呢？' },
      { t0: 4.9, t1: 8.1, text: '来看一个有名的例子。' },
      { t0: 8.2, t1: 13.5, text: '圆上点两个点，连起来，圆被切成2块。', say: '圆上点两个点，连起来，圆被切成两块。' },
      { t0: 13.6, t1: 17.9, text: '三个点，4块；四个点，8块；', say: '三个点，四块；四个点，八块；' },
      { t0: 18.0, t1: 20.9, text: '五个点，16块。', say: '五个点，十六块。' },
      { t0: 21.0, t1: 26.0, text: '2、4、8、16……每次都翻一倍！', say: '二、四、八、十六……每次都翻一倍！' },
      { t0: 26.1, t1: 30.7, text: '那六个点呢？大家都猜：32块！', say: '那六个点呢？大家都猜：三十二块！' },
      { t0: 30.8, t1: 33.4, text: '我们来数一数……' },
      { t0: 36.9, t1: 39.1, text: '只有31块！', say: '只有三十一块！' },
      { t0: 39.2, t1: 43.7, text: '规律到第六次，突然“失灵”了。' },
      { t0: 43.8, t1: 47.6, text: '所以，猜出规律只是开始；' },
      { t0: 47.7, t1: 52.5, text: '要确定它永远成立，得讲出道理——' },
      { t0: 52.6, t1: 55.2, text: '这就叫“证明”。' },
    ],
  });
})();
