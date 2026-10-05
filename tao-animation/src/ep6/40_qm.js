// 第 40 场 · 小问号去哪儿了（id qm）。
// 事实（ep6-script.md）：博客《Ask yourself dumb questions – and answer them!》：“one should be unafraid to ask “stupid” questions”；
// 《Be sceptical of your own work》：题“solving itself almost effortlessly, and you can't quite see why” → “analyse your solution more sceptically”；
// PAW 2019：解出题以后只记得从 A 到 B 的短路，忘了所有死胡同，“a lot of trial and error and really terribly embarrassing ideas”；
// 2026：“projects with 20 or 50 people”；孪生质数（差 2 的质数对）：“That's the one I would most love to have.”
// “小问号住进了他的脑子里”只是比喻（他没说过“我会问自己为什么”这句原话）：画成小问号缩小钻进头里，旁边红笔“（打个比方）”。
// 纸上那道“自己解开了”的题只是示意（1+2+…+100=5050，对的）；回忆框里的“奇数+奇数=偶数、3+5=8”呼应第 2 集。
// 开场：只有直接盖在角落的“长大后”印章。结尾前 0.6 秒全部淡出，印章收掉。
(() => {
  const FL = 760, DUR = 78.8, TX = 1180;          // floor; grown-up Tao stands at TX from L6 to the end
  const BFL = 690;                                 // the floor inside the memory frame
  const SITY = FL - 94, DTOP = 606;                // Tao's hip when seated; desk top

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    // L1–L3: the little question mark; memory frame: little Tao's proof (episode 2)
    stamp: 0.05, floor: 0.35, qa: 0.4, qaLand: 1.5, qaSign: 1.15, qaDown: 3.6,
    box: 3.7, tag1: 4.05, kid: 4.1, head1: 4.2, math1: 4.75, sqm: 5.5, kidDone: 6.4, why: 8.4, kidSurp: 8.6, qaNod: 8.8, kidSheep: 9.3,
    aOut: 10.45,
    // L4–L5: the exam day
    teen: 11.0, tag2: 11.05, puz: 12.0, scratch: 12.6, bq1: 15.0, bq2: 16.4, sheep2: 15.6, n2: 17.3, qaOut: 18.75, bOut: 19.0,
    // L6–L8: the first essay
    desk: 19.0, tao: 19.15, p1: 19.45, t1a: 24.0, t1b: 25.9, body: 20.2, sitUp: 27.6, raise: 28.5, n3: 28.8, hi1: 29.3, cOut: 32.3,
    // L9–L10: the second essay, the too-easy tick, the magnifier
    deskOut: 32.35, stand: 32.5, p2: 32.7, t2: 33.1, prob: 34.4, puzzle: 35.6, squint: 37.9, mag: 37.95, n4: 38.6, dOut: 41.8,
    // L11: the question mark moves in
    qe: 42.7, run1: 43.9, j0: 44.0, j1: 44.5, s0: 45.6, s1: 46.0, meta: 44.8, metaOut: 47.3,
    // L12–L14: the maze
    maze: 48.2, point: 48.3, path: 50.6, n5: 51.5, dead: 53.1, n6: 54.5, balls: 56.3, sheep: 58.4, laugh: 59.8, fOut: 61.4,
    // L15: many people
    gb: 61.7, ppl: 62.1, scr: 62.3, crowd: 63.5, gOut: 67.0,
    // L16–L17: twin primes
    look: 67.6, pairs: [68.0, 68.7, 69.4, 70.2], brace: 71.15, n7: 71.3, dots: 74.1, bigQ: 74.9, n7Out: 75.5, n8: 75.95, end: 78.2,
  };
  // the little red "?" that pops above his head now and then, once the question mark has moved in
  const HUH = [[46.3, 47.9], [54.9, 56.6], [65.0, 66.7], [75.4, DUR]];

  /* ---------------- little helpers ---------------- */
  const box = (k, x0, y0, x1, y1, o) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], o);
  /** a blackboard frame of our own (the set board has fixed keys and an eraser that would sit on Tao's hair) */
  function board(k, b, p, z) {
    box(k + '.o', b.x, b.y, b.x + b.w, b.y + b.h, { z, w: 6, fill: C.paper, draw: stag(p, 0, 3) });
    box(k + '.i', b.x + 14, b.y + 14, b.x + b.w - 14, b.y + b.h - 14, { z: z + 0.1, w: 3.2, draw: stag(p, 1, 3) });
    stroke(k + '.tray', [[b.x + 30, b.y + b.h + 12], [b.x + b.w * (b.tray ?? 1) - 30, b.y + b.h + 12]], { z, w: 5, draw: stag(p, 2, 3) });
  }
  /** fades out (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: must stay at the end of fx */
  COMP.x6_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.3));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** the little question mark, scaled as a whole about its feet (sc: t => scale) — so it can shrink while it jumps and dives */
  COMP.x6_qmS = {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const p = evalTrack(fx.pos, t), s = Math.max(0.01, fx.sc(t));
      DL.save(); DL.about(p[0], p[1], () => DL.scale(s));
      COMP.qm.draw(fx, t, F);
      DL.restore();
    },
    cues: fx => COMP.qm.cues(fx),
  };
  /** wavy handwriting lines (an essay's body, notes on the board). {lines: [[x, y, w, t0]], color, z, t1} */
  COMP.x6_scrib = {
    draw(fx, t) {
      if (fx.t1 !== undefined && t >= fx.t1) return;
      fx.lines.forEach(([x, y, w, t0], i) => {
        const p = clamp((t - t0) / 0.35); if (p <= 0) return;
        const pts = [];
        for (let j = 0; j <= 14; j++) { const u = j / 14; pts.push([x + u * w, y + 8 * Math.sin(u * 21 + i) * (0.6 + 0.4 * Math.sin(u * 7 + i * 2))]); }
        stroke(fx.id + '.' + i, pts, { z: fx.z ?? Z.board, w: 3.4, color: fx.color === 'pencil' ? C.pencil : C.ink, draw: p, boil: 0.6 });
      });
    },
    cues: fx => fx.lines.map(l => [l[3], fx.sfx || 'pen']),
  };

  /* ---------------- L1–L5: the memory frame (with its own little board) ---------------- */
  const BOX = { x0: 110, y0: 150, x1: 1050, y1: 720 };
  const BB = { x: 200, y: 290, w: 440, h: 300 };
  COMP.x6_mem = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.5)), k = fx.id, z = Z.set;
      box(k + '.o', BOX.x0, BOX.y0, BOX.x1, BOX.y1, { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
      stroke(k + '.sh', [[BOX.x0 + 14, BOX.y1 + 9], [BOX.x1 + 9, BOX.y1 + 8, 1], [BOX.x1 + 9, BOX.y0 + 14]], { z: z - 0.5, w: 2.4, color: C.pencil, opacity: 0.6 * p, boil: 0.5 });
      box(k + '.in', BOX.x0 + 14, BOX.y0 + 14, BOX.x1 - 14, BOX.y1 - 14, { z: z + 0.1, w: 2.2, color: C.pencil, draw: stag(p, 1, 3), boil: 0.5 });
      board(k + '.bd', BB, EASE.out(clamp((t - fx.t0 - 0.15) / 0.45)), z + 0.3);
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  // little Tao finishes his line; his hand follows the pen as far as his short arm reaches
  const KX = 660, KSH = [KX, 566];
  const kidWrite = t => {
    const w = FXBY.x6m1; let p = w ? penAt(w, t) : [560, 450];
    const v = [p[0] - KSH[0], p[1] - KSH[1]], d = Math.hypot(v[0], v[1]) || 1, m = 150;
    if (d > m) p = [KSH[0] + v[0] / d * m, KSH[1] + v[1] / d * m];
    return { lean: -3, tilt: -5, armScale: 1.8, armR: [16, 10], ikL: { w: 1, to: 'abs', dx: p[0] + 4 * Math.sin(t * 17), dy: p[1] + 3 * Math.sin(t * 23), bend: 'down' } };
  };

  /* ---------------- L6–L10: the two essays ---------------- */
  const PAPER = { at: [580, 400], w: 820, h: 470 };
  const taoWrite = t => ({ ...POSE.sitBase, tilt: 8, lean: 4, ikL: { w: 1, to: 'desk', dx: -50, dy: -2, bend: 'down' },
    ikR: { w: 1, to: 'desk', dx: 22 + 10 * Math.sin(t * 7.3), dy: -4 + 3 * Math.sin(t * 11.1), bend: 'down' } });
  // the "problem that solves itself": written in one quick swoosh, then a tick
  const PRB = { type: 'write', id: 'x6pr', text: '1+2+…+100=5050', x: 270, y: 320, size: 60, speed: 5200, gap: 0.004, glyphGap: 0.004, t0: T.prob, silent: true, z: Z.set + 1, t1: T.dOut + 0.32 };
  layoutWriting(PRB);
  T.ck = PRB.tEnd + 0.08;
  const CKC = [902, 345];                          // centre of the tick (x 866–938, y 300–390)
  const MAGOFF = [114, 110];                       // the hand holds the magnifier this far below-right of the glass
  COMP.x6_spark = {
    draw(fx, t) {
      const u = (t - fx.t0) / 0.6; if (u < 0 || u >= 1) return;
      for (let i = 0; i < 6; i++) {
        const a = (-150 + i * 30) * RAD, r0 = 66, L = 30 * Math.sin(Math.PI * u);
        stroke(fx.id + '.' + i, [[fx.at[0] + Math.cos(a) * r0, fx.at[1] + Math.sin(a) * r0], [fx.at[0] + Math.cos(a) * (r0 + L), fx.at[1] + Math.sin(a) * (r0 + L)]], { z: Z.fx, w: 3.5 });
      }
    },
    cues: fx => [[fx.t0, 'ding']],
  };
  /** a magnifying glass held in the character's screen-left hand; inside the glass, the tick drawn bigger */
  COMP.x6_mag = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const h = a.handL, lt = t - fx.t0, k = fx.id, z = Z.front + 1, R = 64;
      const pop = Math.max(0.01, EASE.back(clamp(lt / 0.25)));
      const c = [h[0] - MAGOFF[0], h[1] - MAGOFF[1]], d = dist(h, c), u = [(c[0] - h[0]) / d, (c[1] - h[1]) / d], rim = [c[0] - u[0] * R, c[1] - u[1] * R];
      DL.save(); DL.about(h[0], h[1], () => DL.scale(pop));
      stroke(k + '.hd', [h, rim], { z, w: 12 });
      stroke(k + '.gl', ringPts(k + '.gl', c[0], c[1], R, R, { n: 14, closed: true }), { z: z + 0.1, w: 6, closed: true, fill: C.paper });
      const m = clamp((lt - 0.3) / 0.25);
      if (m > 0) {
        const g = GLYPH['✓'], s = 100, ox = c[0] - g.w * s / 2, oy = c[1] - s / 2;
        g.s.forEach((st, i) => stroke(k + '.ck' + i, st.map(([x, y, cn]) => [ox + x * s, oy + y * s, cn]), { z: z + 0.2, w: 9, opacity: m }));
      }
      stroke(k + '.sh', ringPts(k + '.sh', c[0], c[1], R - 14, R - 14, { n: 6, a0: 196, sweep: 52 }), { z: z + 0.3, w: 3, color: C.pencil });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pop']],
  };

  /* ---------------- L11: the question mark jumps onto his head and dives in ---------------- */
  const LAND = [TX - 4, 392];
  const qmEPos = t => {
    if (t < T.run1) return [lerp(-120, 760, clamp((t - T.qe) / (T.run1 - T.qe))), FL];
    if (t < T.j0) return [760, FL];
    if (t < T.j1) { const u = (t - T.j0) / (T.j1 - T.j0); return [lerp(760, LAND[0], u), lerp(FL, LAND[1], u) - 230 * Math.sin(Math.PI * u)]; }
    if (t < T.s0) return LAND;
    return [LAND[0], lerp(LAND[1], LAND[1] + 34, EASE.in(clamp((t - T.s0) / (T.s1 - T.s0))))];
  };
  const qmESc = t => t < T.j0 ? 1 : t < T.j1 ? lerp(1, 0.6, EASE.io((t - T.j0) / (T.j1 - T.j0))) : t < T.s0 ? 0.6 : 0.6 * (1 - EASE.in(clamp((t - T.s0) / (T.s1 - T.s0))));
  /** the small red "?" over a character's head (left of the tuft), at the given [t0, t1) spans; a little ink "plop" at `plop` */
  COMP.x6_huh = {
    draw(fx, t, F) {
      const a = F.anchors[fx.char]; if (!a) return;
      fx.times.forEach(([t0, t1], i) => {
        if (t < t0 || t >= t1) return;
        const lt = t - t0, pp = EASE.back(clamp(lt / 0.22)), op = clamp(lt / 0.08) * (1 - clamp((t - (t1 - 0.3)) / 0.3));
        text(fx.id + '.' + i, '?', a.headTop[0] - 0.9 * a.r, a.headTop[1] - 40 - 4 * Math.sin(lt * 3), { size: 66, font: CFG.FONT_MIX, color: C.red, z: Z.fx, scale: lerp(0.3, 1, pp), opacity: op, rot: -10 });
      });
      const u = (t - fx.plop) / 0.35;
      if (u >= 0 && u < 1) for (let i = 0; i < 5; i++) {
        const ang = (-160 + i * 35) * RAD, r0 = 18 + 26 * u, c = a.headTop;
        stroke(fx.id + '.p' + i, [[c[0] + Math.cos(ang) * r0, c[1] + Math.sin(ang) * r0], [c[0] + Math.cos(ang) * (r0 + 16), c[1] + Math.sin(ang) * (r0 + 16)]], { z: Z.fx, w: 3.5, opacity: 1 - u });
      }
    },
    cues: fx => fx.times.map(([t0]) => [t0, 'plip']),
  };

  /* ---------------- L12–L14: the maze ---------------- */
  const MZ = { x0: 110, y0: 150, s: 96, nc: 8, nr: 5, mid: 2 };
  const X = c => MZ.x0 + c * MZ.s, Y = r => MZ.y0 + r * MZ.s, cc = (c, r) => [X(c + 0.5), Y(r + 0.5)];
  const MIDY = Y(MZ.mid + 0.5), PATH0 = [X(0) - 30, MIDY], PATH1 = [X(MZ.nc) + 32, MIDY];
  // the dead ends: cell paths branching off the one straight corridor; `ball`: a crumpled sheet lies at the end
  const BR = [
    { cells: [[1, 2], [1, 1], [0, 1], [0, 0], [1, 0], [2, 0]], ball: true },
    { cells: [[3, 2], [3, 1], [3, 0], [4, 0], [5, 0]], ball: true },
    { cells: [[3, 1], [2, 1]] },
    { cells: [[5, 2], [5, 1], [6, 1], [6, 0], [7, 0], [7, 1]], ball: true },
    { cells: [[5, 1], [4, 1]] },
    { cells: [[0, 2], [0, 3], [0, 4], [1, 4], [1, 3], [2, 3]], ball: true },
    { cells: [[4, 2], [4, 3], [3, 3], [3, 4], [2, 4]], ball: true },
    { cells: [[4, 3], [4, 4], [5, 4]] },
    { cells: [[6, 2], [6, 3], [7, 3], [7, 4], [6, 4]], ball: true },
    { cells: [[6, 3], [5, 3]] },
  ];
  // passages = the corridor + every step of every branch; every other cell edge is a wall
  const lk = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) ? `${a}|${b}` : `${b}|${a}`;
  const LINK = new Set();
  for (let c = 0; c < MZ.nc - 1; c++) LINK.add(lk([c, MZ.mid], [c + 1, MZ.mid]));
  BR.forEach(b => b.cells.slice(1).forEach((q, i) => LINK.add(lk(b.cells[i], q))));
  { // check: the passages must form a tree over all cells (a perfect maze: exactly one way from the entrance to the exit)
    const seen = new Set(['0,' + MZ.mid]), todo = [[0, MZ.mid]];
    while (todo.length) { const [c, r] = todo.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => { const q = [c + dc, r + dr]; if (!seen.has(`${q}`) && LINK.has(lk([c, r], q))) { seen.add(`${q}`); todo.push(q); } }); }
    if (LINK.size !== MZ.nc * MZ.nr - 1 || seen.size !== MZ.nc * MZ.nr) console.error('x6 maze: passages do not form a tree', LINK.size, seen.size);
  }
  const WALLS = [
    [[X(0), Y(MZ.mid)], [X(0), Y(0), 1], [X(MZ.nc), Y(0), 1], [X(MZ.nc), Y(MZ.mid)]],                     // outer frame, open at both ends of the corridor
    [[X(0), Y(MZ.mid + 1)], [X(0), Y(MZ.nr), 1], [X(MZ.nc), Y(MZ.nr), 1], [X(MZ.nc), Y(MZ.mid + 1)]],
  ];
  for (let c = 0; c < MZ.nc; c++) for (let r = 0; r < MZ.nr; r++) {
    if (c < MZ.nc - 1 && !LINK.has(lk([c, r], [c + 1, r]))) WALLS.push([[X(c + 1), Y(r)], [X(c + 1), Y(r + 1)]]);
    if (r < MZ.nr - 1 && !LINK.has(lk([c, r], [c, r + 1]))) WALLS.push([[X(c), Y(r + 1)], [X(c + 1), Y(r + 1)]]);
  }
  // pencil dashes along each dead end (precomputed: dash start/end and how far along the branch it starts)
  BR.forEach((b, i) => {
    const pts = b.cells.map(q => cc(q[0], q[1])), dashes = []; let L = 0;
    for (let j = 1; j < pts.length; j++) {
      const a = pts[j - 1], e = pts[j], d = dist(a, e);
      for (let s = 0; s < d - 4; s += 26) dashes.push({ a: lerp2(a, e, s / d), b: lerp2(a, e, Math.min(d, s + 15) / d), at: L + s });
      L += d;
    }
    b.dashes = dashes; b.len = L; b.end = pts[pts.length - 1]; b.t0 = T.dead + i * 0.17;
  });
  const BALLS = BR.filter(b => b.ball).map((b, j) => ({ at: b.end, t0: T.balls + j * 0.3 }));
  COMP.x6_maze = {
    draw(fx, t) {
      if (t < T.maze || t >= fx.t1) return;
      const k = fx.id, z = Z.set + 0.5;
      WALLS.forEach((w, i) => stroke(k + '.w' + i, w, { z, w: 5, draw: EASE.out(clamp((t - T.maze - i * 0.02) / 0.22)) }));
      const s0 = clamp((t - T.maze - 0.4) / 0.15);
      if (s0 > 0) dot(k + '.start', [PATH0[0] - 8, PATH0[1]], 8 * s0, C.ink, z + 0.2);
      // the forgotten roads: pencil dashes
      BR.forEach((b, i) => {
        const p = clamp((t - b.t0) / 0.45); if (p <= 0) return;
        const reach = p * b.len;
        b.dashes.forEach((d, j) => {
          if (d.at >= reach) return;
          const full = dist(d.a, d.b), e = Math.min(1, (reach - d.at) / full);
          stroke(k + '.d' + i + '_' + j, [d.a, lerp2(d.a, d.b, e)], { z: z + 0.1, w: 4, color: C.pencil, boil: 0.5 });
        });
      });
      // crumpled sheets at the ends of the dead ends
      BALLS.forEach((b, j) => {
        if (t < b.t0) return;
        const u = Math.max(0.01, EASE.back(clamp((t - b.t0) / 0.25))), [x, y] = b.at, kk = k + '.b' + j;
        DL.save(); DL.about(x, y, () => DL.scale(u)); DL.about(x, y, () => DL.rotate(j * 47));
        stroke(kk, ringPts(kk, x, y, 23, 20, { n: 9, closed: true, rv: 0.16 }), { z: z + 0.3, w: 3.5, closed: true, fill: C.paper });
        stroke(kk + 'c0', [[x - 13, y - 4], [x - 4, y + 3], [x + 3, y - 6], [x + 11, y + 2]], { z: z + 0.4, w: 2.4 });
        stroke(kk + 'c1', [[x - 8, y + 10], [x + 1, y + 6], [x + 8, y + 12]], { z: z + 0.4, w: 2.4 });
        DL.restore();
      });
      // the one remembered road, in red, straight through
      const rp = EASE.io(clamp((t - T.path) / 0.7));
      if (rp > 0) {
        stroke(k + '.red', [PATH0, PATH1], { z: Z.annot - 1, w: 7, color: C.red, draw: rp });
        if (rp >= 1) stroke(k + '.redH', [[PATH1[0] - 20, PATH1[1] - 14], [PATH1[0], PATH1[1], 1], [PATH1[0] - 20, PATH1[1] + 14]], { z: Z.annot - 1, w: 7, color: C.red });
      }
    },
    cues: () => [[T.maze, 'pen'], [T.path, 'zip'], ...BR.filter((_, i) => i % 2 === 0).map(b => [b.t0, 'pen']), ...BALLS.map(b => [b.t0, 'paper'])],
  };

  /* ---------------- L15–L17: the big board, the crowd, the twin primes ---------------- */
  const GB = { x: 230, y: 70, w: 1120, h: 250, tray: 0.55 };   // short tray: the little "?" over Tao's head stays clear of it
  COMP.x6_board = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      board(fx.id, GB, EASE.out(clamp((t - fx.t0) / 0.45)), Z.set);
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  // a long row of small head-and-shoulders silhouettes behind the people: they pop in from Tao outward
  const CROWD = (() => {
    const xs = []; for (let i = 0; i < 30; i++) xs.push(70 + i * 50);
    const rank = xs.map((x, i) => [Math.abs(x - TX), i]).sort((a, b) => a[0] - b[0]), t0 = [];
    rank.forEach(([, i], r) => { t0[i] = T.crowd + r * 0.06; });
    return xs.map((x, i) => ({ x, t0: t0[i] }));
  })();
  COMP.x6_crowd = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const y = 440, z = Z.set + 2;
      CROWD.forEach((h, i) => {
        if (t < h.t0) return;
        const u = Math.max(0.01, EASE.back(clamp((t - h.t0) / 0.25))), k = fx.id + '.' + i;
        DL.save(); DL.about(h.x, y + 44, () => DL.scale(u));
        stroke(k + 's', [[h.x - 27, y + 44], [h.x - 23, y + 27, 1], [h.x, y + 21], [h.x + 23, y + 27], [h.x + 27, y + 44, 1]], { z, w: 3.2, fill: C.paper });
        stroke(k + 'h', ringPts(k + 'h', h.x, y, 17, 17, { n: 9, closed: true }), { z: z + 0.1, w: 3.2, closed: true, fill: C.paper });
        DL.restore();
      });
    },
    cues: () => CROWD.filter((_, i) => i % 5 === 2).map(h => [h.t0, 'pop']),
  };
  /** a red brace under the whole list of pairs (x 430–1150), point down in the middle: "this whole list is the problem" */
  const BRACE = [[430, 284], [438, 294, 1], [782, 294], [790, 304, 1], [798, 294], [1142, 294], [1150, 284, 1]];
  COMP.x6_brace = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      stroke(fx.id, BRACE, { z: Z.annot - 1, w: 4.5, color: C.red, draw: EASE.out(clamp((t - fx.t0) / 0.35)) });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  const PS = 66, PR1 = 108, PR2 = 214, QS = 96, QY = PR2 + PS - QS;   // QS: the big ? stays below row 1 (row 1 ends at y 174, the ? starts at 184)   // pair rows (glyph tops); the big ? sits on row 2's baseline

  /* ---------------- poses, faces ---------------- */
  Object.assign(POSE, {
    // pointing with the screen-left arm (he faces left, toward the maze)
    x6_pointL: { lean: -2, armScale: 1.2, armL: [84, 6], armR: [16, 10] },
    // holding the magnifier out to the tick on the paper
    x6_mag: { lean: -4, tilt: -5, armScale: 1.45, armR: [16, 10], ikL: { w: 1, to: 'abs', dx: CKC[0] + MAGOFF[0], dy: CKC[1] + MAGOFF[1], bend: 'down' } },
  });
  Object.assign(FACE, {
    x6_squint: { lidL: 0.55, lidR: 0.42, eyeSY: 0.92, brow: 'line', browL: 14, browR: 4, browY: 0.02, mouth: 'flat', mw: 0.18 },
    x6_keen: { brow: 'line', browL: 10, browR: 10, mouth: 'smile', mw: 0.22 },
  });

  const hop = [0.62, 1.07, 1.52, 42.92, 43.37, 43.82, 18.95].map(h => [h, 'hop']);

  defineScene({
    id: 'qm', chapter: '小问号去哪儿了', dur: DUR, floor: FL,
    cast: {
      kid: { ...E6.kid, hair: 'tuft', floor: BFL },                 // little Tao (episode 2), in the memory frame
      teen: { ...E6.teen, floor: BFL },                             // the exam day, in the memory frame
      tao: { ...E6.taoAdult, desk: [TX, DTOP] },
      m4: { ...E6.mate4, H: 342 }, m2: { ...E6.mate2, H: 348 }, m1: { ...E6.mate1, H: 340 }, ben: { ...E6.ben, H: 348 }, m3: { ...E6.mate3, H: 352 },
    },
    order: ['kid', 'teen', 'tao', 'm4', 'm2', 'm1', 'ben', 'm3'],
    tracks: {
      kid: {
        enter: T.kid,
        pos: [[0, [KX, BFL]], [T.aOut + 0.35, [-900, BFL], 0]],
        pose: [[0, kidWrite], [T.kidDone, 'stand', 0.15], [T.kidSheep, 'scratchStand', 0.12, 'back']],
        face: [[0, 'focus'], [T.kidDone, 'proud', 0.1], [T.kidSurp, 'surprised', 0.06], [T.kidSheep, 'sheepish', 0.12]],
        turn: [[0, -0.45], [T.kidDone, 0.1, 0.15], [T.kidSurp, 0.4, 0.12]],
        gaze: [[0, 'kidPen'], [T.kidDone, 'viewer'], [T.kidSurp, 'sq']],
        squash: [[0, 1], [T.kidSurp, 1.08, 0.05], [T.kidSurp + 0.05, 1, 0.22, 'back']],
      },
      teen: {
        enter: T.teen,
        pos: [[0, [770, BFL]], [T.bOut + 0.35, [-900, BFL], 0]],
        pose: [[0, 'stand'], [T.scratch, 'scratchStand', 0.12, 'back']],
        face: [[0, 'neutral'], [T.puz, 'puzzled', 0.1], [T.sheep2, 'sheepish', 0.12]],
        turn: [[0, -0.4]],
        gaze: [[0, 'bd'], [T.bq1, 'bq1'], [T.bq2, 'bq2'], [T.n2, 'viewer']],
        squash: [[0, 1], [T.bq1, 0.94, 0.05], [T.bq1 + 0.05, 1, 0.22, 'back']],
      },
      tao: {
        enter: T.tao,
        pos: [[0, [TX, SITY]], [T.raise, [TX, FL], 0.2]],   // L8: he stands up behind the desk to raise his hand, like asking in class
        pose: [[0, taoWrite], [T.sitUp, 'sitUp', 0.15], [T.raise, 'raiseHand', 0.2, 'back'], [T.stand, 'stand', 0.25],
          [T.puzzle, 'scratchStand', 0.12, 'back'], [T.squint, 'x6_mag', 0.3, 'out'], [T.dOut, 'stand', 0.25],
          [T.point, 'x6_pointL', 0.15, 'back'], [T.path - 0.2, 'stand', 0.2], [T.dead, 'thinkStand', 0.15], [T.balls, 'stand', 0.15],
          [T.sheep, 'scratchStand', 0.12, 'back'], [T.laugh + 1.1, 'stand', 0.2], [T.look + 0.3, 'thinkStand', 0.15], [T.dots - 0.3, 'stand', 0.2]],
        face: [[0, 'focus'], [T.sitUp, 'smile', 0.1], [T.raise, 'grin', 0.06], [T.stand, 'neutral', 0.1],
          [T.prob, 'surprised', 0.06], [T.puzzle, 'puzzled', 0.1], [T.squint, 'x6_squint', 0.1], [T.dOut, 'neutral', 0.1],
          [T.qe + 0.3, 'smile', 0.1], [T.j1, 'surprised', 0.05], [T.j1 + 0.5, 'smile', 0.1], [T.s1, 'idea', 0.05], [T.s1 + 0.7, 'smile', 0.1],
          [T.point, 'smile', 0.1], [T.path, 'focus', 0.1], [T.dead, 'neutral', 0.1], [T.balls, 'surprised', 0.06], [T.balls + 0.8, 'neutral', 0.1],
          [T.sheep, 'sheepish', 0.1], [T.laugh, 'laugh', 0.08], [T.fOut, 'smile', 0.1],
          [T.ppl, 'joy', 0.08], [T.crowd + 1.0, 'smile', 0.1], [T.look, 'focus', 0.1], [HUH[3][0], 'x6_keen', 0.1]],
        turn: [[0, -0.3], [T.gb + 0.2, 0, 0.2], [T.look, -0.35, 0.2]],
        gaze: [[0, 'paper'], [T.t2, 'paper'], [T.prob, 'prob'], [T.ck, 'ck'], [T.dOut, 'viewer'], [T.qe + 0.2, 'qmE'], [T.s1, 'viewer'],
          [T.maze, 'maze'], [T.path, 'tip'], [T.dead, 'maze'], [T.sheep, 'viewer'],
          [T.gb, 'viewer'], [T.ppl + 0.1, 'm3'], [T.ppl + 0.7, 'ben'], [T.crowd, 'viewer'], [T.look, 'pairs'], [T.bigQ, 'bigQ']],
        squash: [[0, 1], [T.raise, 1.05, 0.06], [T.raise + 0.06, 1, 0.22, 'back'], [T.j1, 0.93, 0.06], [T.j1 + 0.06, 1, 0.25, 'back'],
          [T.s1, 1.06, 0.06], [T.s1 + 0.06, 1, 0.25, 'back']],
      },
      // L15: the people who work with him (classmates and the mathematician reused, a size smaller)
      m3: { enter: T.ppl, pos: [[0, [1400, FL]], [T.gOut + 0.35, [2400, FL], 0]], pose: [[0, 'stand'], [T.ppl + 0.5, 'wave', 0.12, 'back'], [T.ppl + 1.8, 'stand', 0.15]], face: [[0, 'smile'], [T.ppl + 0.5, 'joy', 0.08]], turn: [[0, -0.45]], gaze: [[0, 'tao']] },
      ben: { enter: T.ppl + 0.25, pos: [[0, [960, FL]], [T.gOut + 0.35, [-900, FL], 0]], pose: [[0, 'stand']], face: [[0, 'smile']], turn: [[0, 0.35]], gaze: [[0, 'tao'], [T.ppl + 1.2, 'gbc']] },
      m1: { enter: T.ppl + 0.5, pos: [[0, [760, FL]], [T.gOut + 0.35, [-900, FL], 0]], pose: [[0, 'stand'], [T.ppl + 1.3, 'raiseHand', 0.12, 'back']], face: [[0, 'smile'], [T.ppl + 1.3, 'grin', 0.06]], turn: [[0, 0.25]], gaze: [[0, 'gbc']] },
      m2: { enter: T.ppl + 0.75, pos: [[0, [560, FL]], [T.gOut + 0.35, [-900, FL], 0]], pose: [[0, 'stand']], face: [[0, 'smile']], turn: [[0, 0.3]], gaze: [[0, 'gbc']] },
      m4: { enter: T.ppl + 1.0, pos: [[0, [360, FL]], [T.gOut + 0.35, [-900, FL], 0]], pose: [[0, 'stand'], [T.ppl + 1.4, 'wave', 0.12, 'back'], [T.ppl + 2.6, 'stand', 0.15]], face: [[0, 'joy']], turn: [[0, 0.35]], gaze: [[0, 'viewer']] },
    },
    targets: F => ({
      kidPen: [520, 440], sq: [900, 600], bd: [420, 440], bq1: [420, 380], bq2: [420, 500],
      paper: [560, 300], prob: [560, 350], ck: CKC, qmE: qmEPos(F.t), maze: [500, 390],
      tip: [lerp(PATH0[0], PATH1[0], EASE.io(clamp((F.t - T.path) / 0.7))), MIDY], gbc: [790, 245], pairs: [790, 240], bigQ: [833, 268],
    }),
    set: [
      { type: 'floor', t0: T.floor },
      { type: 'desk', x: TX, top: DTOP, w: 250, t0: T.desk, t1: T.deskOut + 0.32 },
    ],
    fx: [
      // the stamp: stamped straight into its corner
      { type: 'ageStamp', label: '长大后', t0: T.stamp, ...E6.STAMP, center: E6.STAMP.dock, dockT: -1, t1: T.end },

      // L1–L3: the little question mark hops in; the memory frame: little Tao's proof, the question mark reading it
      { type: 'qm', id: 'x6qa', pos: [[0, [1760, FL]], [T.qa, [1320, FL], T.qaLand - T.qa, 'out'], [T.qaOut, [1830, FL], 0.5, 'in']], size: 200, t0: T.qa, t1: T.bOut + 0.3,
        mood: [[0, 'happy'], [T.bq1, 'doubt']], act: [[0, 'hop'], [T.qaLand, 'idle'], [T.qaNod, 'nod'], [T.qaNod + 1.3, 'idle'], [T.qaOut, 'hop']],
        sign: [[0, null], [T.qaSign, '为什么？'], [T.qaDown, null]], gaze: [[0, 'viewer'], [T.box + 0.2, [560, 440]], [T.why, [900, 520]], [T.teen, 'bd']] },
      { type: 'x6_mem', id: 'x6mem', t0: T.box, t1: T.bOut + 0.32 },
      { type: 'title', id: 'x6tag1', text: '第 2 集', x: 236, y: 206, size: 44, color: 'red', rot: -4, t0: T.tag1, t1: T.aOut + 0.32 },
      { type: 'scribe', id: 'x6h1', text: '奇数+奇数=偶数', x: 252, y: 350, size: 48, cps: 16, t0: T.head1, t1: T.aOut + 0.32, z: Z.set + 1 },
      { type: 'write', id: 'x6m1', text: '3+5=8', x: 590, y: 400, size: 60, anchor: 'end', speed: 2000, t0: T.math1, t1: T.aOut + 0.32, z: Z.set + 1 },
      { type: 'qm', id: 'x6qs', pos: [[0, [905, BFL]]], size: 120, signSize: 66, t0: T.sqm, t1: T.aOut + 0.32,
        mood: [[0, 'neutral'], [T.why, 'doubt']], act: [[0, 'idle'], [T.why, 'tap']], sign: [[0, null], [T.why, '为什么？']], gaze: [[0, 'kidPen'], [T.why, 'viewer']] },

      // L4–L5: the exam day — the two questions he could not answer
      { type: 'title', id: 'x6tag2', text: '口试那天', x: 250, y: 206, size: 44, color: 'red', rot: -4, t0: T.tag2, t1: T.bOut + 0.32 },
      { type: 'scribe', id: 'x6bq1', text: '为什么对？', x: 260, y: 380, size: 64, cps: 7, t0: T.bq1, t1: T.bOut + 0.32, z: Z.set + 1, sfx: 'chalk' },
      { type: 'scribe', id: 'x6bq2', text: '有什么用？', x: 260, y: 500, size: 64, cps: 7, t0: T.bq2, t1: T.bOut + 0.32, z: Z.set + 1, sfx: 'chalk' },
      { type: 'label', id: 'x6n2', text: '答不出的，正是这两个', size: 44, at: [420, 644], rot: -1, t0: T.n2, t1: T.bOut + 0.32, target: [612, 440], bend: 0.15, gap: 10 },

      // L6–L8: the first essay
      { type: 'prop', id: 'x6p1', kind: 'e6_page', at: PAPER.at, w: PAPER.w, h: PAPER.h, lines: 0, t0: T.p1, t1: T.cOut + 0.32, drawDur: 0.5, sfxAt: [[T.p1, 'paper']] },
      { type: 'scribe', id: 'x6t1a', text: '问自己笨问题——', x: 310, y: 270, size: 66, cps: 5, t0: T.t1a, t1: T.cOut + 0.32, z: Z.set + 1 },
      { type: 'scribe', id: 'x6t1b', text: '然后回答它！', x: 310, y: 360, size: 66, cps: 5, t0: T.t1b, t1: T.cOut + 0.32, z: Z.set + 1 },
      { type: 'x6_scrib', id: 'x6rl', color: 'pencil', z: Z.set + 1, t1: T.cOut + 0.32, lines: [[260, 455, 650, T.body], [260, 515, 600, T.body + 0.8], [260, 575, 420, T.body + 1.6]] },
      { type: 'band', id: 'x6hi1', rect: [508, 237, 198, 66], t0: T.hi1, t1: T.cOut + 0.32, dur: 0.4 },
      { type: 'label', id: 'x6n3', text: '不要怕问‘笨’问题', size: 48, at: [1230, 205], rot: -2, t0: T.n3, t1: T.cOut + 0.32, target: { char: 'tao', part: 'handR', dy: -18 }, bend: -0.25, gap: 10 },

      // L9–L10: the second essay — a problem that "solved itself", a tick he cannot explain, a magnifier
      { type: 'prop', id: 'x6p2', kind: 'e6_page', at: PAPER.at, w: PAPER.w, h: PAPER.h, lines: 0, t0: T.p2, t1: T.dOut + 0.32, drawDur: 0.5, sfxAt: [[T.p2, 'paper']] },
      { type: 'scribe', id: 'x6t2', text: '要怀疑你自己的作品', x: 600, y: 240, size: 60, anchor: 'middle', cps: 7.5, t0: T.t2, t1: T.dOut + 0.32, z: Z.set + 1 },
      PRB,
      { type: 'write', id: 'x6ck', text: '✓', x: CKC[0] - 36, y: CKC[1] - 45, size: 90, speed: 2600, w: 7, t0: T.ck, t1: T.dOut + 0.32, z: Z.set + 1, sfx: 'pen' },
      { type: 'x6_spark', id: 'x6spk', at: CKC, t0: T.ck + 0.25 },
      { type: 'scribe', id: 'x6sv', text: '自己解开了！', x: 564, y: 470, size: 52, cps: 12, t0: T.ck + 0.3, t1: T.dOut + 0.32, z: Z.set + 1 },
      { type: 'x6_mag', id: 'x6mag', char: 'tao', t0: T.mag, t1: T.dOut + 0.32 },
      { type: 'label', id: 'x6n4', text: '更怀疑地检查', size: 46, at: [1160, 250], rot: -3, t0: T.n4, t1: T.dOut + 0.32, target: [958, 300], bend: 0.2, gap: 8 },

      // L11: the question mark hops in, onto his head, and dives in (a metaphor, and the frame says so)
      { type: 'x6_qmS', id: 'x6qe', pos: [[0, qmEPos]], sc: qmESc, size: 160, t0: T.qe, t1: T.s1,
        mood: [[0, 'happy']], act: [[0, 'hop'], [T.run1, 'idle'], [T.j1 + 0.15, 'nod'], [T.s0 - 0.1, 'idle']], gaze: [[0, 'tao'], [T.j1, 'viewer']] },
      { type: 'title', id: 'x6meta', text: '（打个比方）', x: 880, y: 380, size: 44, color: 'red', rot: -3, t0: T.meta, t1: T.metaOut + 0.32 },
      { type: 'x6_huh', id: 'x6huh', char: 'tao', times: HUH, plop: T.s1 },

      // L12–L14: the maze — one short road remembered, all the dead ends forgotten
      { type: 'x6_maze', id: 'x6mz', t1: T.fOut + 0.32 },
      { type: 'label', id: 'x6n5', text: '记得的路', size: 46, at: [1000, 290], rot: -3, t0: T.n5, t1: T.fOut + 0.32, target: [PATH1[0] - 14, MIDY - 8], bend: 0.2, gap: 8 },
      { type: 'label', id: 'x6n6', text: '忘掉的路', size: 46, at: [1010, 684], rot: 2, t0: T.n6, t1: T.fOut + 0.32, target: [842, 600], bend: -0.2, gap: 10 },

      // L15: many people around one big board
      { type: 'x6_board', id: 'x6gb', t0: T.gb, t1: DUR },
      { type: 'x6_scrib', id: 'x6scr', sfx: 'chalk', t1: T.gOut + 0.32, lines: [[300, 125, 190, 0], [620, 118, 150, 1], [930, 130, 210, 2], [1160, 120, 140, 3], [380, 198, 230, 4], [760, 188, 170, 5], [1050, 204, 200, 6], [520, 268, 160, 7], [820, 274, 200, 8]].map(([x, y, w, i]) => [x, y, w, T.scr + i * 0.38]) },
      { type: 'x6_crowd', id: 'x6crowd', t1: T.gOut + 0.32 },

      // L16–L17: the pairs of primes two apart … and nobody knows if they go on forever
      { type: 'write', id: 'x6pair0', text: '(3,5)', x: 430, y: PR1, size: PS, speed: 2300, t0: T.pairs[0] },
      { type: 'write', id: 'x6pair1', text: '(5,7)', x: 678, y: PR1, size: PS, speed: 2300, t0: T.pairs[1] },
      { type: 'write', id: 'x6pair2', text: '(11,13)', x: 926, y: PR1, size: PS, speed: 2300, t0: T.pairs[2] },
      { type: 'write', id: 'x6pair3', text: '(17,19)', x: 430, y: PR2, size: PS, speed: 2300, t0: T.pairs[3] },
      { type: 'write', id: 'x6pair4', text: '…', x: 722, y: PR2, size: PS, speed: 2300, t0: T.dots },
      { type: 'write', id: 'x6bigq', text: '?', x: 800, y: QY, size: QS, speed: 2600, w: 9, color: 'red', t0: T.bigQ, sfx: 'pen' },
      { type: 'x6_brace', id: 'x6brace', t0: T.brace, t1: T.n7Out + 0.32 },
      { type: 'label', id: 'x6n7', text: '最想得到的那道题', size: 50, at: [560, 402], rot: -2, t0: T.n7, t1: T.n7Out + 0.32, target: [790, 306], bend: 0.15, gap: 8 },
      { type: 'label', id: 'x6n8', text: '还没人知道', size: 50, at: [905, 404], rot: -3, t0: T.n8, t1: DUR, target: [829, QY + QS + 8], bend: -0.2, gap: 8 },

      // eased exits (must stay last: they fade what was drawn before them)
      { type: 'x6_fade', t0: T.aOut, keys: ['kid.', 'x6qs.', 'x6h1', 'x6m1.', 'x6tag1'] },
      { type: 'x6_fade', t0: T.bOut, keys: ['teen.', 'x6mem.', 'x6tag2', 'x6bq1', 'x6bq2', 'x6n2.'] },
      { type: 'x6_fade', t0: T.cOut, keys: ['x6p1.', 'x6t1a', 'x6t1b', 'x6rl.', 'x6hi1', 'x6n3.'] },
      { type: 'x6_fade', t0: T.deskOut, keys: ['desk' + TX] },
      { type: 'x6_fade', t0: T.dOut, keys: ['x6p2.', 'x6t2', 'x6pr.', 'x6ck.', 'x6sv', 'x6mag.', 'x6n4.'] },
      { type: 'x6_fade', t0: T.metaOut, keys: ['x6meta'] },
      { type: 'x6_fade', t0: T.fOut, keys: ['x6mz.', 'x6n5.', 'x6n6.'] },
      { type: 'x6_fade', t0: T.gOut, keys: ['m1.', 'm2.', 'm3.', 'm4.', 'ben.', 'x6crowd.', 'x6scr.'] },
      { type: 'x6_fade', t0: T.n7Out, keys: ['x6n7.', 'x6brace'] },
      { type: 'x6_fade', t0: T.end, keys: ['tao.', 'x6gb.', 'x6pair', 'x6bigq.', 'x6n8.', 'x6huh.', 'floor'] },
    ],
    sfx: [...hop, [T.kid, 'pop'], [T.kidSurp, 'boop'], [T.teen, 'pop'], [T.scratch, 'tap'], [T.tao, 'pop'], [T.raise, 'whip'],
      [T.prob, 'zip'], [T.puzzle, 'boop'], [T.squint, 'swish'], [T.j0, 'boing'], [T.j1, 'tap'], [T.s0 + 0.2, 'zip'], [T.s1, 'pop'],
      [T.point, 'swish'], [T.sheep, 'boop'], [T.ppl, 'pop'], [T.ppl + 0.5, 'pop'], [T.ppl + 1.0, 'pop'], [T.look, 'tap']],
    subs: [
      { t0: 0.3, t1: 3.3, text: '还记得那个小问号吗？' },
      { t0: 3.8, t1: 7.2, text: '小时候，它是读证明的人，' },
      { t0: 7.3, t1: 10.3, text: '总在问：“为什么？”' },
      { t0: 11.0, t1: 14.4, text: '口试那天，小陶答不出的，' },
      { t0: 14.5, t1: 18.7, text: '正是“为什么对”和“有什么用”。' },
      { t0: 19.4, t1: 23.0, text: '长大以后，他写过一篇文章，' },
      { t0: 23.1, t1: 28.1, text: '题目叫：《问自己笨问题——然后回答它！》' },
      { t0: 28.5, t1: 31.9, text: '“不要怕问‘笨’问题。”' },
      { t0: 32.6, t1: 37.6, text: '还有一篇：题解得太顺，又说不清为什么——' },
      { t0: 37.9, t1: 41.7, text: '“就要更怀疑地，检查一遍。”' },
      { t0: 42.6, t1: 47.2, text: '就好像，小问号住进了他自己的脑子里。' },
      { t0: 48.1, t1: 52.9, text: '他说：解出题以后，人们只记得最短的路，' },
      { t0: 53.0, t1: 55.6, text: '忘了所有死胡同。' },
      { t0: 56.0, t1: 61.2, text: '“其实有大量试错，还有很多很丢脸的想法。”' },
      { t0: 61.9, t1: 66.9, text: '现在，他有的项目，是和几十个人一起做的。' },
      { t0: 67.6, t1: 71.8, text: '还有一道题，他说“最想拿下”——' },
      { t0: 72.1, t1: 77.5, text: '差2的质数有没有无穷多对？还没人知道。', say: '相差二的质数，有没有无穷多对？还没有人知道。' },
    ],
  });
})();
