// 8岁：一位研究数学教育的教授来找小陶做题（据 Clements 1984）。
// 快乐数：7 → 49 → 97 → 130 → 10 → 1 停住；2 → 4 → 16 → … → 20 → 4 绕圈。
// 小陶飞快地试了 3、4、5、6、8、9 就宣布“只有两种结局”；小问号问“全部？”；教授记下：没有证明 · 没试两位数。
// 共享给 60_happyproof.js：window.h2Happy（数字平方和、圈的画法）。
(() => {
  const FL = 780, TOP = 600, SEATP = 690, STOOL = 652;
  const PX = 380, TX = 1300;                    // professor's chair, Terry's stool
  const CASE_T = [565, TOP];                    // briefcase spot on the table (bottom centre)
  const sq = n => String(n).split('').reduce((s, d) => s + d * d, 0);
  const run = (n, stop) => { const a = [n]; while (!stop(a[a.length - 1], a)) a.push(sq(a[a.length - 1])); return a; };
  const CH1 = run(7, v => v === 1);                                 // [7, 49, 97, 130, 10, 1]
  const RING = run(4, (v, a) => a.length > 1 && sq(v) === 4);       // [4, 16, 37, 58, 89, 145, 42, 20]
  const WORK = CH1.slice(0, -1).map(n => (n < 10 ? `${n}×${n}` : String(n).split('').map(d => d * d).join('+'))); // 7×7, 16+81, 81+49, 1+9+0, 1+0
  const TESTS = [3, 4, 5, 6, 8, 9];
  // every tested number really ends up in the ring
  TESTS.forEach(n => { let v = n, k = 0; while (!RING.includes(v) && k++ < 50) v = sq(v); if (!RING.includes(v)) throw new Error('h2: ' + n); });

  /* ---------------- shared helpers ---------------- */
  const probe = (s, size) => layoutWriting({ text: s, x: 0, y: 0, size, t0: 0, speed: 1 });
  const wOf = (s, size) => probe(s, size).xEnd - 0.1 * size;
  /** arrow along an ellipse arc (degrees, clockwise on screen) */
  function ellArrow(key, cx, cy, rx, ry, a0, a1, p, o = {}) {
    if (p <= 0) return;
    const n = 12, pts = [];
    for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * RAD; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    const col = o.color || C.ink, z = o.z ?? Z.annot, w = o.w || 4;
    stroke(key, pts, { z, w, color: col, draw: p, boil: 0.7, opacity: o.opacity });
    if (p > 0.92) {
      const e = pts[n], b = pts[n - 2], L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = o.head || 16;
      const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
      const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
      stroke(key + '.h', [r1, [e[0], e[1], 1], r2], { z, w, color: col, boil: 0.7, opacity: o.opacity });
    }
  }
  /** numbers placed on an ellipse; gap angles so the arrows clear each number's box */
  function ringLayout(cx, cy, rx, ry, size, a0 = 180) {
    const items = RING.map((n, i) => {
      const a = a0 + i * 360 / RING.length, s = String(n), w = wOf(s, size);
      const c = [cx + Math.cos(a * RAD) * rx, cy + Math.sin(a * RAD) * ry];
      return { n, s, a, w, c, x: c[0] - w / 2, y: c[1] - size / 2 };
    });
    const clear = (it, sgn) => {
      for (let d = 3; d < 60; d += 0.5) {
        const a = (it.a + sgn * d) * RAD, p = [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
        if (Math.abs(p[0] - it.c[0]) > it.w / 2 + size * 0.22 || Math.abs(p[1] - it.c[1]) > size * 0.5 + size * 0.2) return d;
      }
      return 30;
    };
    items.forEach(it => { it.dOut = clear(it, 1); it.dIn = clear(it, -1); });
    return items;
  }
  /** tiny happy face */
  function smiley(key, c, r, col, z, p = 1) {
    stroke(key + '.o', ringPts(key, c[0], c[1], r, r, { n: 10, a0: -100, sweep: 372 }), { z, w: 3.4, color: col, draw: p });
    if (p < 0.8) return;
    dot(key + '.e0', [c[0] - r * 0.35, c[1] - r * 0.2], r * 0.13, col, z);
    dot(key + '.e1', [c[0] + r * 0.35, c[1] - r * 0.2], r * 0.13, col, z);
    stroke(key + '.m', [[c[0] - r * 0.45, c[1] + r * 0.2], [c[0], c[1] + r * 0.52], [c[0] + r * 0.45, c[1] + r * 0.2]], { z, w: 3, color: col });
  }
  window.h2Happy = { sq, RING, ellArrow, ringLayout, smiley, wOf };

  /* ---------------- cast looks ---------------- */
  // the professor: curly hair (plus glasses from the rig)
  HAIR.h2_prof = () => {
    const top = [];
    for (let i = 0; i <= 20; i++) { const a = (-170 + i * 8) * RAD, r = i % 2 ? 1.16 : 0.99; top.push([Math.cos(a) * r, Math.sin(a) * r]); }
    return [top];
  };
  const SITP = { ...POSE.sitBase, armL: [22, 34], armR: [22, 34] };
  const walkCase = t => ({ ...makeWalk(2.7, 4.7, 4.6)(t), armR: [30, 60] });
  const writeP = t => ({ ...SITP, lean: 4, tilt: 7, armScale: 1.05, armL: [30, 40],
    ikR: { w: 1, to: 'desk', dx: 6 + 10 * Math.sin(t * 7.5) + 6 * Math.sin(t * 2.3), dy: -2 - 3 * Math.abs(Math.sin(t * 15)), bend: 'down' } });
  Object.assign(POSE, {
    h2_pCarry: { armR: [30, 60] },
    h2_pLift: { lean: 2, armScale: 1.5, ikR: { w: 1, to: 'abs', dx: 0, dy: 0 } },
    h2_pSit: SITP,
    h2_pReach: { ...SITP, lean: 6, tilt: 4, armScale: 1.3, ikR: { w: 1, to: 'desk', dx: 48, dy: -86, bend: 'down' }, ikL: { w: 1, to: 'hip', dx: -50, dy: 50, bend: 'down' } },
    h2_pSmile: { ...SITP, tilt: -4 },
    h2_sitScratch: { ...POSE.sitHands, tilt: 9, armScale: 1.7, ikR: { w: 1, to: 'head', dx: 1.0, dy: -0.95, bend: 'out' } },
    h2_announce: { lean: -3, tilt: -6, armScale: 1.35, armR: [160, 8], ikL: { w: 1, to: 'hip', dx: -26, dy: -6, bend: 'out' } },
  });
  POSE.h2_pLift.ikR = { w: 1, to: 'abs', dx: 540, dy: 505 };
  Object.assign(FACE, {
    h2_sheep: { lidL: 0.3, lidR: 0.3, brow: 'line', browL: -14, browR: -14, browY: 0.02, mouth: 'wavy', mw: 0.3 },
  });
  SFX.define('h2_latch', tone => { tone('square', 1300, 900, 0.025, 0.06); tone('square', 1200, 850, 0.025, 0.06, null, 0.08); });
  SFX.define('h2_whirr', tone => { tone('triangle', 500, 900, 0.18, 0.08, [9, 60]); });

  /* ---------------- props ---------------- */
  /** briefcase: (x, y) = bottom centre; open 0..1 swings the lid up */
  function drawCase(k, x, y, open, z) {
    const W = 150, H = 92;
    if (open > 0.02) {
      const lh = 64 * open;
      stroke(k + '.lid', [[x - W / 2, y - H], [x - W / 2 + 10, y - H - lh, 1], [x + W / 2 - 10, y - H - lh, 1], [x + W / 2, y - H]], { z: z - 0.2, w: 5, fill: C.paper });
      stroke(k + '.pp', [[x - 52, y - H + 4], [x - 46, y - H - 14 * open], [x + 38, y - H - 12 * open], [x + 46, y - H + 4]], { z: z - 0.1, w: 3, fill: C.paper });
    }
    stroke(k + '.body', [[x - W / 2, y], [x - W / 2, y - H, 1], [x + W / 2, y - H, 1], [x + W / 2, y, 1], [x - W / 2, y, 1]], { z, w: 5, fill: C.paper });
    if (open <= 0.02) {
      stroke(k + '.handle', [[x - 22, y - H], [x - 18, y - H - 20], [x + 18, y - H - 20], [x + 22, y - H]], { z, w: 4.5 });
      stroke(k + '.flap', [[x - W / 2 + 6, y - H + 26], [x + W / 2 - 6, y - H + 26]], { z, w: 3 });
    }
    [-1, 1].forEach(s => stroke(k + '.latch' + s, [[x + s * 42 - 7, y - H + 18], [x + s * 42 + 7, y - H + 18, 1], [x + s * 42 + 7, y - H + 32, 1], [x + s * 42 - 7, y - H + 32, 1], [x + s * 42 - 7, y - H + 18]], { z: z + 0.1, w: 3 }));
  }
  const LIFT0 = 4.85, LIFT1 = 5.25, OPEN_T = 7.55, CLOSE_T = 13.35;
  COMP.h2_case = {
    draw(fx, t, F) {
      const a = F.anchors.prof; if (!a) return;
      const carried = [a.handR[0], a.handR[1] + 92 + 20];
      const open = clamp((t - OPEN_T) / 0.22) * (1 - clamp((t - CLOSE_T) / 0.2));
      if (t >= 20) { drawCase('h2case', 245, FL, 0, Z.chair + 1); return; }      // moved to the floor (while hidden by the big sheet)
      if (t < LIFT0) { drawCase('h2case', carried[0], carried[1], 0, Z.front + 1); return; }
      const u = EASE.io(clamp((t - LIFT0) / (LIFT1 - LIFT0)));
      const p = [lerp(carried[0], CASE_T[0], u), lerp(carried[1], CASE_T[1], u) - Math.sin(Math.PI * u) * 50];
      drawCase('h2case', p[0], p[1], open, u < 1 ? Z.front + 1 : Z.desk + 1);
    },
    cues: () => [[LIFT1, 'thud'], [OPEN_T - 0.05, 'h2_latch'], [CLOSE_T + 0.1, 'h2_latch']],
  };
  /** the professor's little notebook, lying on the table */
  COMP.h2_pad = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const pp = EASE.back(clamp((t - fx.t0) / 0.25)), z = Z.desk + 1, [x, y] = fx.at;
      DL.save(); DL.translate(x, y); DL.scale(pp);
      stroke('h2pad', [[-38, 0], [-30, -12, 1], [38, -12, 1], [32, 0, 1], [-38, 0, 1]], { z, w: 4, fill: C.paper });
      for (let i = 0; i < 5; i++) stroke('h2pad.s' + i, [[-24 + i * 12, -15], [-22 + i * 12, -9]], { z: z + 0.1, w: 2.6 });
      DL.restore();
    },
  };

  /* small problem sheets fly out of the briefcase (generic problems, not real ones) */
  const FAN = [[560, 372, -8], [690, 362, -4], [820, 356, 0], [950, 362, 4], [1080, 372, 8]];
  const OUT = [7.9, 8.3, 8.7, 9.1, 9.5], BACK = [12.95, 13.05, null, 13.12, 13.2];
  const CASE_MOUTH = [565, TOP - 110], SW = 120, SH = 150, G0 = 13.5, S0 = 72.25;
  const DOODLE = [
    { w: probe('1+2+3', 26), x: -46, y: -20 },
    null,
    { w: probe('7 → ?', 30), x: -44, y: -18 },
    null,
    { w: probe('□+□=10', 22), x: -48, y: -14 },
  ];
  function drawDoodle(i, k, z, op = 1) {
    // two faint pencil lines = the printed question
    stroke(k + '.q0', [[-44, -56], [44, -56]], { z, w: 2, color: C.pencil, opacity: 0.7 * op, boil: 0.4 });
    stroke(k + '.q1', [[-44, -44], [20, -44]], { z, w: 2, color: C.pencil, opacity: 0.7 * op, boil: 0.4 });
    const d = DOODLE[i];
    if (d) d.w.strokes.forEach((s, j) => stroke(k + '.d' + j, s.pts.map(p => [p[0] + d.x, p[1] + d.y, p[2]]), { z, w: 3, opacity: op }));
    if (i === 1) {
      stroke(k + '.tri', [[-34, 44], [0, -24, 1], [34, 44, 1], [-34, 44, 1]], { z, w: 3, opacity: op });
      [[-12, 26], [8, 18], [0, 34]].forEach((p, j) => dot(k + '.td' + j, p, 3.5, C.ink, z));
    }
    if (i === 3) for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dot(k + `.g${r}${c}`, [-26 + c * 26, -14 + r * 26], 4.5, C.ink, z);
  }
  function drawSmallSheet(i, k, c, rot, sc, z, op = 1) {
    DL.save(); DL.translate(c[0], c[1]); DL.rotate(rot); DL.scale(sc);
    stroke(k, [[-SW / 2, -SH / 2], [SW / 2, -SH / 2, 1], [SW / 2, SH / 2, 1], [-SW / 2, SH / 2, 1], [-SW / 2, -SH / 2, 1]], { z, w: 4, fill: C.paper, opacity: op });
    if (sc > 0.6) drawDoodle(i, k, z + 0.1, op);
    DL.restore();
  }
  COMP.h2_sheets = {
    draw(fx, t) {
      FAN.forEach((f, i) => {
        if (t < OUT[i]) return;
        if (i === 2 && t >= G0) return;                   // the chosen one becomes the big sheet
        const u = EASE.out(clamp((t - OUT[i]) / 0.45));
        let c = [lerp(CASE_MOUTH[0], f[0], u), lerp(CASE_MOUTH[1], f[1], u) - Math.sin(Math.PI * u) * 110];
        let sc = lerp(0.3, 1, u), rot = lerp(0, f[2], u);
        if (BACK[i] !== null && t >= BACK[i]) {
          const v = EASE.in(clamp((t - BACK[i]) / 0.3)); if (v >= 1) return;
          c = [lerp(f[0], CASE_MOUTH[0], v), lerp(f[1], CASE_MOUTH[1], v) - Math.sin(Math.PI * v) * 60];
          sc = lerp(1, 0.3, v);
        }
        let wig = 0;
        if (i === 2 && t > 12.95) wig = Math.sin((t - 12.95) * 2 * Math.PI * 3) * 5 * (1 - clamp((t - 12.95) / 0.5));
        drawSmallSheet(i, 'h2sh' + i, c, rot + wig, sc, 41);
      });
    },
    cues: () => OUT.map(t => [t, 'paper']).concat(BACK.filter(b => b !== null).map(t => [t, 'swish']), [[12.95, 'boop']]),
  };

  /* ---------------- the big sheet (the chosen problem, zoomed up to full screen) ---------------- */
  const BIG = [100, 86, 1250, 792], SMALL = [FAN[2][0] - SW / 2, FAN[2][1] - SH / 2, FAN[2][0] + SW / 2, FAN[2][1] + SH / 2], FLAT = [770, TOP - 12, 870, TOP - 1];
  const lerpBox = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
  COMP.h2_big = {
    draw(fx, t) {
      if (t < G0) return;
      const u = EASE.io(clamp((t - G0) / 0.6)), v = EASE.io(clamp((t - S0) / 0.5));
      let b = lerpBox(lerpBox(SMALL, BIG, u), FLAT, v);
      const z = v >= 1 ? Z.desk + 1 : 41, [x0, y0, x1, y1] = b, f = 36 * u * (1 - v);
      if (v >= 1) { stroke('h2big', [[x0, y1], [x0 + 8, y0, 1], [x1, y0, 1], [x1 - 6, y1, 1], [x0, y1, 1]], { z, w: 4, fill: C.paper }); return; }
      stroke('h2big', [[x0, y0], [x1 - f, y0, 1], [x1, y0 + f, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 5, fill: C.paper });
      if (f > 2) stroke('h2big.fold', [[x1 - f, y0], [x1 - f + 3, y0 + f - 3, 1], [x1, y0 + f]], { z: z + 0.1, w: 3.5 });
      if (u < 0.4 && v <= 0) {                           // the little '7 → ?' fades as it grows
        const s = (x1 - x0) / SW;
        DL.save(); DL.translate((x0 + x1) / 2, (y0 + y1) / 2); DL.scale(s);
        drawDoodle(2, 'h2bigd', z + 0.1, 1 - u / 0.4);
        DL.restore();
      }
    },
    cues: () => [[G0, 'whoosh'], [S0, 'whoosh'], [S0 + 0.5, 'paper']],
  };
  /** yellow highlighter band (drawn above the big sheet, multiplied under the ink) */
  COMP.h2_band = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const p = EASE.out(clamp((t - fx.t0) / (fx.dur || 0.35))); if (p <= 0) return;
      const x1 = lerp(fx.x0, fx.x1, p), n = 8, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const x = lerp(fx.x0, x1, i / n); top.push([x, fx.y0 + Math.sin(i * 1.7) * 3]); bot.unshift([x, fx.y1 + Math.sin(i * 2.3) * 4]); }
      stroke(fx.id, top.concat(bot), { z: fx.z ?? 41.5, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  /* ---------------- what gets written on the big sheet ---------------- */
  const ZW = 42;                                                     // writing layer (above the big sheet)
  // row 1: 7 → 49 → 97 → 130 → 10 → 1
  const S1 = 88, Y1 = 186, X1a = 150, X1b = 1212;
  const w1 = CH1.map(n => wOf(String(n), S1)), gap1 = (X1b - X1a - w1.reduce((a, b) => a + b, 0)) / (CH1.length - 1);
  const x1 = []; { let x = X1a; w1.forEach((w, i) => { x1.push(x); x += w + gap1; }); }
  const ARR1 = CH1.slice(0, -1).map((_, i) => ({ from: [x1[i] + w1[i] + 14, Y1 + S1 * 0.58], to: [x1[i + 1] - 14, Y1 + S1 * 0.58], mid: x1[i] + w1[i] + gap1 / 2 }));
  const T_NUM1 = [21.95, 24.35, 28.95, 31.35, 32.65, 34.45];
  const T_WORK = [22.9, 26.9, 30.65, 31.95, 33.85], T_ARR1 = [23.9, 28.6, 31.1, 32.4, 34.2];
  const T_RING1 = 35.25, T_SMILE = 35.6;
  // row 2: 2 → ring
  const RC = [700, 585], RX = 262, RY = 150, S2 = 56;
  const RL = ringLayout(RC[0], RC[1], RX, RY, S2);
  const T_TWO = 42.2, T_TWOARR = 43.2, T_RN = RL.map((_, i) => 45.9 + i * 0.42), T_RARR = RL.map((_, i) => 45.9 + i * 0.42 + 0.26);
  const T_CLOSE = 49.4, T_SPIN = 49.9;
  T_RARR[RL.length - 1] = T_CLOSE;
  // tests: 3 ✓ 4 ✓ … (all of them fall into the ring)
  const TX0 = 1136, TY0 = 392, TDY = 62, TS = 44, T_TEST = TESTS.map((_, i) => 52.85 + i * 0.7);
  const WR = [];
  const wr = (id, text, x, y, size, t0, o = {}) => { const fx = { type: 'write', id, text, x, y, size, t0, speed: o.speed || 2600, gap: 0.02, glyphGap: 0.02, w: o.w || 6, sfx: 'pen', z: ZW, t1: S0, ...o }; WR.push(fx); return fx; };
  CH1.forEach((n, i) => wr('h2c1n' + i, String(n), x1[i], Y1, S1, T_NUM1[i], { w: 7.5 }));
  WORK.forEach((s, i) => wr('h2c1w' + i, s, ARR1[i].mid - wOf(s, 38) / 2, Y1 + S1 + 20, 38, T_WORK[i], { w: 4, speed: 2000 }));
  wr('h2two', '2', 180, RC[1] - 40, 80, T_TWO, { w: 7 });
  RL.forEach((it, i) => wr('h2rn' + i, it.s, it.x, it.y, S2, T_RN[i], { w: 5.5, speed: 3000 }));
  TESTS.forEach((n, i) => wr('h2ts' + i, n + ' ✓', TX0, TY0 + i * TDY, TS, T_TEST[i], { w: 4.5, speed: 3400 }));

  /** the arrows of both chains + the spinning marker */
  COMP.h2_arrows = {
    draw(fx, t) {
      if (t >= S0) return;
      ARR1.forEach((a, i) => arrow('h2a1.' + i, a.from, a.to, { p: EASE.out(clamp((t - T_ARR1[i]) / 0.25)), bend: 0.06, color: C.ink, w: 4.5, head: 16, z: ZW }));
      arrow('h2a2', [248, RC[1] + 6], [RL[0].x - 16, RC[1] + 6], { p: EASE.out(clamp((t - T_TWOARR) / 0.3)), bend: 0.05, color: C.ink, w: 4.5, head: 16, z: ZW });
      RL.forEach((it, i) => {
        const nx = RL[(i + 1) % RL.length], a1 = i === RL.length - 1 ? nx.a + 360 : nx.a;
        ellArrow('h2ra' + i, RC[0], RC[1], RX, RY, it.a + it.dOut, a1 - nx.dIn, EASE.out(clamp((t - T_RARR[i]) / (i === RL.length - 1 ? 0.4 : 0.2))), { z: ZW, w: 4.2, head: 15 });
      });
      // the little marker going round and round (inside the ring)
      if (t >= T_SPIN) {
        const a = 180 + (t - T_SPIN) * 150, op = clamp((t - T_SPIN) / 0.3);
        ellArrow('h2spin', RC[0], RC[1], RX - 78, RY - 64, a - 70, a, 1, { color: C.red, w: 5, head: 18, z: Z.annot, opacity: op });
      }
    },
    cues: () => [...T_ARR1.map(t => [t, 'plip']), [T_TWOARR, 'plip'], ...T_RARR.map(t => [t, 'plip']), [T_CLOSE + 0.35, 'ding'], [T_SPIN, 'h2_whirr'], [T_SPIN + 2.4, 'h2_whirr'], [T_SPIN + 4.8, 'h2_whirr']],
  };
  /** red: ring round the final 1 + a tiny happy face, and a ring pulse on the 4 when the loop closes */
  COMP.h2_marks = {
    draw(fx, t) {
      if (t >= S0) return;
      const sp = EASE.out(clamp((t - T_SMILE) / 0.35));
      if (sp > 0) smiley('h2smile', [1236, 166], 17, C.red, Z.annot, sp);
    },
    cues: () => [[T_SMILE, 'pop']],
  };
  /** Terry's pencil while he ticks off 3, 4, 5, 6, 8, 9 */
  const SH_T = [TX, STOOL - 46];
  const tickTarget = t => {
    const k = clamp(Math.floor((t - T_TEST[0] + 0.15) / 0.7), 0, TESTS.length - 1);
    return [TX0 + 60, TY0 + k * TDY + TS * 0.6];
  };
  const tickPose = t => {
    const tg = tickTarget(t), dx = tg[0] - SH_T[0], dy = tg[1] - SH_T[1];
    const a = Math.atan2(-dx, dy) / RAD + Math.sin(t * 40) * 2, d = Math.hypot(dx, dy);
    return { ...POSE.sitHands, tilt: -5, armScale: clamp((d - 30) / 83, 0.8, 1.9), armL: [a, 0], ikL: { w: 0 } };
  };
  COMP.h2_pencil = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors.terry; if (!a) return;
      const h = a.handL, tg = tickTarget(t), d = dist(h, tg) || 1, u = [(tg[0] - h[0]) / d, (tg[1] - h[1]) / d], n = [-u[1], u[0]];
      const tip = [h[0] + u[0] * 40, h[1] + u[1] * 40], back = [h[0] - u[0] * 26, h[1] - u[1] * 26], z = Z.front + 13;
      const P = (p, s) => [p[0] + n[0] * s, p[1] + n[1] * s];
      stroke('h2pen', [P(back, -6), P([h[0] + u[0] * 22, h[1] + u[1] * 22], -6), tip, P([h[0] + u[0] * 22, h[1] + u[1] * 22], 6), P(back, 6), P(back, -6)], { z, w: 3.5, fill: C.paper });
      dot('h2pen.l', tip, 3.5, C.ink, z + 0.1);
    },
  };
  COMP.h2_sweat = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const ph = ((t - fx.t0) * 0.8) % 1, c = [a.head[0] - a.r * 1.05 - 6, a.head[1] - a.r * 0.4 + ph * 26], o = Math.sin(Math.PI * ph);
      stroke('h2sw', [[c[0], c[1] - 16], [c[0] + 9, c[1] + 2], [c[0], c[1] + 9], [c[0] - 9, c[1] + 2], [c[0], c[1] - 16]], { z: Z.fx, w: 3.4, fill: C.paper, opacity: o });
    },
  };

  /* ---------------- the professor's note (zoomed up from his notebook) ---------------- */
  const NOTE = { box: [500, 106, 1200, 326], pad: [[478, TOP - 12], [540, TOP - 12]], t0: 73.1 };
  const NOTE_A = '没有证明 · ', NOTE_B = '没试两位数', NS = 60, NX = 548, NY = 236;
  window.h2Note = { A: NOTE_A, B: NOTE_B };
  COMP.h2_note = {
    draw(fx, t) {
      if (t < NOTE.t0) return;
      const lt = t - NOTE.t0, p = EASE.out(clamp(lt / 0.4)), [x0, y0, x1, y1] = NOTE.box, z = Z.fx;
      stroke('h2nt.card', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 5, fill: C.paper, draw: p });
      // spiral binding along the top
      for (let i = 0; i < 12; i++) stroke('h2nt.sp' + i, ringPts('h2nt.sp' + i, x0 + 40 + i * 57, y0, 9, 13, { n: 8, closed: true }), { z: z + 0.1, w: 3, closed: true, draw: clamp(p * 1.4 - 0.4) });
      [NY + 38, NY - 44].forEach((y, i) => stroke('h2nt.rl' + i, [[x0 + 22, y], [x1 - 22, y + 1]], { z: z + 0.05, w: 2, color: C.pencil, opacity: 0.55 * p, boil: 0.4 }));
      // zoom lines from the notebook on the table
      stroke('h2nt.z0', [NOTE.pad[0], [x0 + 4, y1]], { z: Z.desk + 2, w: 2.2, color: C.pencil, draw: p, boil: 0.5 });
      stroke('h2nt.z1', [NOTE.pad[1], [x1 - 4, y1]], { z: Z.desk + 2, w: 2.2, color: C.pencil, draw: p, boil: 0.5 });
      if (lt > 0.3) text('h2nt.h', '教授的笔记', x0 + 30, y0 + 44, { size: 34, anchor: 'start', z: z + 0.2, opacity: clamp((lt - 0.3) / 0.2), color: C.ink });
    },
    cues: () => [[NOTE.t0, 'paper']],
  };

  /* ---------------- tracks ---------------- */
  defineScene({
    id: 'visitor', chapter: '8岁 · 快乐数', dur: 82.6, floor: FL,
    cast: {
      prof: { H: 440, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'h2_prof', glasses: true, desk: [500, TOP - 4], blink: [4.0, 1.3] },
      terry: { H: 245, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9], z: 12 },
    },
    order: ['prof', 'terry'],
    tracks: {
      terry: {
        enter: 1.55,
        pos: [[0, [TX, STOOL]], [57.95, [TX, STOOL - 6], 0.22], [69.3, [TX, STOOL], 0.25]],
        pose: [[0, t => ({ ...POSE.sitHands, legL: [70, -63 + 24 * Math.sin(t * 2 * Math.PI * 1.3)], legR: [70, -63 - 24 * Math.sin(t * 2 * Math.PI * 1.3)] })],
          [5.4, 'sitHands', 0.3], [8.0, { ...POSE.sitHands, lean: -5, tilt: -6 }, 0.25], [13.0, 'sitHands', 0.25],
          [22.0, { ...POSE.sitHands, armScale: 1.5, armL: [96, 6], ikL: { w: 0 }, tilt: -4 }, 0.2], [25.2, 'sitHands', 0.25],
          [35.4, { ...POSE.sitHands, armScale: 1.6, armL: [140, 30], armR: [140, 30], ikL: { w: 0 }, ikR: { w: 0 } }, 0.15, 'back'], [37.2, 'sitHands', 0.3],
          [52.5, tickPose, 0.2], [57.1, 'sitHands', 0.25],
          [57.95, 'stand', 0.2], [58.3, 'h2_announce', 0.15, 'back'], [65.4, 'stand', 0.25], [69.3, 'h2_sitScratch', 0.25], [72.6, 'sitHands', 0.3]],
        squash: [[0, 1], [35.4, 1.1, 0.06], [35.5, 1, 0.25, 'back'], [57.85, 0.88, 0.08], [57.95, 1.1, 0.1], [58.1, 1, 0.25, 'back'],
          [65.3, 1.06, 0.05], [65.4, 1, 0.2, 'back'], [69.3, 0.9, 0.1], [69.45, 1, 0.25, 'back']],
        face: [[0, 'smile'], [2.9, 'surprised', 0.05], [3.6, 'smile', 0.05], [8.0, 'grin', 0.05], [13.0, 'idea', 0.05], [16.0, 'focus', 0.05],
          [35.4, 'joy', 0.05], [37.4, 'smile', 0.05], [42.2, 'focus', 0.05], [49.6, 'surprised', 0.05], [50.6, 'idea', 0.05], [52.5, 'focus', 0.05],
          [57.1, 'grin', 0.05], [58.3, 'proud', 0.05], [65.3, 'surprised', 0.05], [69.3, 'h2_sheep', 0.08], [74.0, 'neutral', 0.1]],
        turn: [[0, -0.2], [2.8, -0.55, 0.15], [13.0, -0.4, 0.15], [57.95, -0.1, 0.15], [65.2, 0.4, 0.12], [69.3, 0.1, 0.15], [72.6, -0.45, 0.2]],
        gaze: [[0, 'viewer'], [2.8, 'prof'], [7.8, 'fan'], [13.2, 'big'], [15.6, 'wr'], [35.4, 'viewer'], [37.5, 'wr'], [52.5, 'tick'], [57.2, 'viewer'],
          [65.2, 'qm'], [69.4, [1390, 770]], [72.7, 'pad']],
      },
      prof: {
        pos: [...walkPath(2.7, 4.7, -240, PX, FL), [5.3, [PX, SEATP], 0.32]],
        pose: [[0, walkCase], [4.7, 'h2_pCarry', 0.1], [LIFT0 - 0.05, 'h2_pLift', 0.2], [5.3, 'h2_pSit', 0.3], [7.15, 'h2_pReach', 0.3], [8.2, 'h2_pSit', 0.3],
          [10.3, 'h2_pSmile', 0.2], [72.5, writeP, 0.3]],
        face: [[0, 'smile'], [5.3, 'neutral', 0.05], [7.2, 'smile', 0.05], [10.3, 'idea', 0.05], [11.3, 'smile', 0.05], [72.5, 'focus', 0.05]],
        turn: [[0, 0.55], [5.3, 0.4, 0.2], [72.5, 0.45, 0.2]],
        gaze: [[0, 'terry'], [7.2, 'case'], [8.2, 'fan'], [10.3, 'terry'], [72.5, 'pad']],
      },
    },
    targets: F => {
      const tg = { fan: [820, 360], case: CASE_T.slice(0, 1).concat([TOP - 60]), big: [700, 420], tick: tickTarget(F.t), pad: [510, TOP - 10] };
      tg.qm = (F.anchors.qm || {}).head || [1440, 620];
      let cur = null; WR.forEach(w => { if (w.strokes && w.t0 <= F.t) cur = w; });
      tg.wr = cur ? penAt(cur, F.t) : [300, 150];
      if (F.t < 21.9) tg.wr = [480, 140];
      return tg;
    },
    set: [
      { type: 'floor', t0: 1.4 },
      { type: 'chair', x: PX, seat: SEATP, full: true, t0: 1.42 },
      { type: 'desk', x: 820, top: TOP, w: 700, t0: 1.45 },
      { type: 'stool', x: TX, seat: STOOL, t0: 1.5 },
    ],
    fx: [
      { type: 'ageStamp', age: 8, place: '一位教授来找他做题', t0: 0, center: [800, 360], R: 150, dockT: 1.32, dock: [1486, 108], dockScale: 0.46, pulse: [] },
      { type: 'label', id: 'lbProf', text: '研究数学教育的教授', at: [610, 236], rot: -3, t0: 4.3, t1: 7.05, target: { char: 'prof', part: 'headTop' }, bend: 0.2, gap: 14 },
      { type: 'h2_case', id: 'case' },
      { type: 'h2_pad', id: 'pad', t0: 72.7, at: [510, TOP] },
      { type: 'h2_sheets', id: 'sheets' },
      { type: 'thought', id: 'h2think', at: [205, 250], rx: 132, ry: 88, t0: 10.4, t1: 12.75, from: { char: 'prof', part: 'headTop', dx: -30, dy: -6 } },
      { type: 'prop', kind: 'h2_thinkKid', id: 'thk', t0: 10.55, t1: 12.75, at: [205, 250], drawDur: 0.2 },
      { type: 'h2_big', id: 'big' },
      // the rule, in yellow
      { type: 'scribe', id: 'h2rule', text: '规则：每一位数字平方，再加起来', x: 150, y: 132, size: 46, t0: 16.4, t1: S0, cps: 11, z: ZW, anchor: 'start' },
      { type: 'h2_band', id: 'h2ruleHi', t0: 19.2, t1: S0, x0: 140, x1: 150 + 15 * 46 + 8, y0: 110, y1: 158, dur: 0.45 },
      ...WR,
      { type: 'h2_arrows', id: 'arr' },
      { type: 'ring', id: 'h2ring1', of: 'h2c1n5', glyph: 0, t0: T_RING1, t1: S0 },
      { type: 'h2_marks', id: 'marks' },
      { type: 'label', id: 'lbHappy', text: '快乐数', at: [1060, 128], rot: -4, t0: 37.8, t1: S0, target: [1170, 172], bend: -0.25, gap: 6, size: 46 },
      { type: 'ring', id: 'h2ring4', of: 'h2rn0', glyph: 0, t0: T_CLOSE + 0.3, t1: T_CLOSE + 2.2 },
      { type: 'h2_pencil', id: 'pencil', t0: 52.6, t1: 57.1 },
      { type: 'speedLines', id: 'h2zip', char: 'terry', part: 'handL', t0: 53.0, t1: 56.6 },
      { type: 'speech', id: 'h2say', text: ['只有', '两种结局！'], at: [1440, 262], tail: [-60, 70], speaker: 'terry', t0: 60.25, t1: 64.95, size: 58, rot: -3 },
      { type: 'qm', id: 'qm', size: 180, t0: 64.95, burst: true, pos: [[0, [1440, FL]]],
        act: [[0, 'idle'], [65.45, 'hop'], [66.35, 'idle']], hopHz: 2.2,
        mood: [[0, 'surprised'], [65.45, 'neutral'], [69.9, 'surprised'], [72.4, 'neutral']],
        gaze: [[0, 'terry'], [72.4, 'pad'], [74.2, [850, 250]]],
        tilt: [[0, 0], [65.45, -8, 0.3], [72.4, 0, 0.3]],
        sign: [[0, null], [65.45, '全部？'], [S0, null]],
        sfxAt: [[64.95, 'boing'], [65.45, 'pop']] },
      { type: 'h2_sweat', id: 'sweat', char: 'terry', t0: 69.6, t1: 72.3 },
      { type: 'h2_note', id: 'note' },
      { type: 'scribe', id: 'h2noteA', text: NOTE_A, x: NX, y: NY, size: NS, t0: 76.3, cps: 5, z: Z.fx + 0.3, anchor: 'start' },
      { type: 'scribe', id: 'h2noteB', text: NOTE_B, x: NX + textWidth(NOTE_A, NS), y: NY, size: NS, t0: 78.9, cps: 5, z: Z.fx + 0.3, anchor: 'start' },
    ],
    sfx: [[1.55, 'hop'], [5.3, 'thud'], [57.95, 'hop'], [69.3, 'thud']],
    steps: [{ t0: 2.7, t1: 4.7, hz: 4.6 }],
    subs: [
      { t0: 0.2, t1: 2.5, text: '小陶八岁那年，' },
      { t0: 2.6, t1: 7.0, text: '一位研究数学教育的教授来看他。' },
      { t0: 7.1, t1: 12.6, text: '教授带来了好多题，想看看他是怎么想的。' },
      { t0: 12.7, t1: 15.5, text: '其中一道是这样的：' },
      { t0: 15.6, t1: 21.7, text: '随便挑一个数，把每一位数字平方，再加起来。' },
      { t0: 21.8, t1: 25.6, text: '比如7：7乘7是49。', say: '比如七：七乘七是四十九。' },
      { t0: 25.7, t1: 30.4, text: '49：16加81，是97。', say: '四十九：十六加八十一，是九十七。' },
      { t0: 30.5, t1: 37.6, text: '97、130、10……最后变成1，停住了。', say: '九十七、一百三十、十……最后变成一，停住了。' },
      { t0: 37.7, t1: 41.4, text: '这样的数，叫“快乐数”。' },
      { t0: 41.5, t1: 45.7, text: '可是换成2，就会一直绕圈圈：', say: '可是换成二，就会一直绕圈圈：' },
      { t0: 45.8, t1: 52.1, text: '4、16、37……又回到4，永远停不下来。', say: '四、十六、三十七……又回到四，永远停不下来。' },
      { t0: 52.2, t1: 57.7, text: '小陶飞快地试了3、4、5、6、8、9，', say: '小陶飞快地试了三、四、五、六、八、九，' },
      { t0: 57.8, t1: 60.1, text: '然后大声宣布：' },
      { t0: 60.2, t1: 64.9, text: '“所有的数，都只有这两种结局！”', voice: 'kid' },
      { t0: 65.0, t1: 69.2, text: '“你把所有的数都试过了吗？”', voice: 'qm' },
      { t0: 69.3, t1: 72.2, text: '“……试了九个。”', say: '……试了九个。', voice: 'kid' },
      { t0: 72.4, t1: 78.5, text: '教授在本子上记下：他说得很快，却没有证明，' },
      { t0: 78.6, t1: 82.3, text: '也没去试两位数的数。' },
    ],
  });

  /** inside the professor's thought cloud: a little Terry and a question mark */
  PROPS.h2_thinkKid = (fx, t, lt, p) => {
    portrait('h2tk', -44, 12, 40, { z: Z.fx + 1 });
    text('h2tk.q', '?', 50, 4, { size: 76, font: CFG.FONT_MIX, z: Z.fx + 1, scale: lerp(0.4, 1, EASE.back(p)), rot: 8 });
  };
})();
