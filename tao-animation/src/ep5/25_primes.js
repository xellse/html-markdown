// 第 25 场 · 质数机器（b5_）
// 事实（ep5-script.md）：1987 年第六题：若 k²+k+n 对 0 ≤ k ≤ √(n/3) 都是质数，则对 0 ≤ k ≤ n−2 都是质数。
//   n = 41：k = 0..3 得 41、43、47、53（每次多加 2、4、6……）⇒ k = 0..39 的 40 个数都是质数；k = 40 时 1681 = 41 × 41。
//   他这题 5 分（丢的 2 分在这里，为什么扣分没有记录）。
// 演绎：“质数机器”是把 □×□+□+41 画成一台机器；小问号替观众问“为什么一定？”。
// 开头 = 第 20 场结尾（成绩单 7、7、7、7、7、5，“= 40”，第 6 格红圈，同一个 id 'b5.sheet'；印章 11 岁已停靠）。
// 所有数在页面加载时验算，算错就 console.error。
(() => {
  const FL = 780, SH = E5.SHEET, CELL = SH.cell, SID = 'b5.sheet';

  /* ---------------- the maths, checked ---------------- */
  const f = k => k * k + k + 41;
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  for (let k = 0; k <= 39; k++) if (!isPrime(f(k))) console.error('b5_primes: ' + f(k) + ' should be prime');
  if ([0, 1, 2, 3].map(f).join() !== '41,43,47,53' || f(1) - f(0) !== 2 || f(2) - f(1) !== 4 || f(3) - f(2) !== 6) console.error('b5_primes: 41, 43, 47, 53');
  if (f(40) !== 1681 || 41 * 41 !== 1681 || isPrime(1681)) console.error('b5_primes: 1681 = 41×41');
  if (Math.floor(Math.sqrt(41 / 3)) !== 3 || 41 - 2 !== 39) console.error('b5_primes: k ≤ √(41/3) is 0..3, k ≤ 41−2 is 0..39');
  if (E5.S87.join() !== '7,7,7,7,7,5') console.error('b5_primes: E5.S87 changed');

  /* ---------------- times (scene clock). L1–L10 as in the script; L11, L12 moved 0.8 s later ---------------- */
  const P = {
    LB6: 1.65, LB6_OUT: 2.7, SH_GO: 2.85,
    MACH: 3.15, LBM: 4.5, LBIN: 7.8, FORM: [10.05, 11.17, 12.18], L_OUT: 13.65,
    BALL: [13.8, 14.65, 15.47, 16.37], OUT: [14.55, 15.4, 16.22, 17.12],
    DIFF: [20.05, 20.72, 21.45], TICK: [22.15, 22.27, 22.39, 22.51], D_OUT: 23.65,
    SHRINK: 23.9, S0: 24.4, S1: 26.0, LB40: 26.75, LB40_OUT: 28.95,
    B40: 29.35, B40_DROP: 30.15, COUGH: 30.45, C1681: 31.0, EQ: 32.25, CROSS: 33.8, NOTP: 34.0, M3_OUT: 35.5,
    TO41: 35.7, LB41: 36.15, BREAK: 37.2, CNT_OUT: 39.75,
    HEAD: 40.2, RING4: 41.85, ST1: 42.0, ARC: 44.95, ST2: 45.15, FOR41: 46.4, M5_OUT: 47.9,
    QM: 48.15, SIGN: 48.45, LN1: 49.4, TICKL: 50.05, LN2: 50.8, MTN: 50.95, BAND: 51.35, M6_OUT: 52.85,
    SH_BACK: 53.05, T_IN: 53.45, RING5: 54.05, PINCH: 54.85, LBP: 55.25, END: 57.3, DUR: 57.9,
  };

  /* ---------------- helpers ---------------- */
  const fadeFrom = (n0, op) => { if (op >= 0.999) return; for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * op).toFixed(3); } };
  COMP.b5_pFade = {
    init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k <= 0) return;
      const n0 = DL.items.length;
      COMP[fx.inner.type].draw(fx.inner, t, F);
      fadeFrom(n0, k);
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };
  /** hand-written numbers (strokes, not a font: the fonts draw 0 square-ish), centred on (x, yc) */
  const HW = new Map();
  const hwLay = (str, size) => { const k = str + '|' + size; if (!HW.has(k)) HW.set(k, layoutWriting({ text: str, x: 0, y: -size / 2, size, t0: 0, speed: 1, anchor: 'middle' })); return HW.get(k); };
  function hw(key, str, x, yc, size, o = {}) {
    const L = hwLay(str, size), op = o.op ?? 1; if (op <= 0.01) return;
    DL.save(); DL.translate(x, yc); if (o.sc !== undefined && o.sc !== 1) DL.scale(o.sc);
    L.strokes.forEach((s, i) => {
      const d = o.p === undefined ? 1 : clamp(o.p * L.strokes.length - i);
      if (d > 0) stroke(key + '.' + i, s.pts, { z: o.z ?? Z.front, w: o.w || 5, color: o.color || C.ink, opacity: op, boil: 0.5, draw: d < 1 ? d : undefined });
    });
    DL.restore();
  }
  const rect = (k, x, y, w, h, o) => stroke(k, [[x - w / 2, y - h / 2], [x + w / 2, y - h / 2, 1], [x + w / 2, y + h / 2, 1], [x - w / 2, y + h / 2, 1], [x - w / 2, y - h / 2, 1]], o);

  SFX.define('b5_cough', (tone, noise) => { noise('bandpass', 520, 0.9, 0.13, 0.32, 260); tone('sawtooth', 150, 85, 0.12, 0.05); });
  SFX.define('b5_whirr', tone => { tone('triangle', 360, 1050, 0.24, 0.06, [26, 80]); });
  SFX.define('b5_clunk', (tone, noise) => { tone('sine', 230, 120, 0.09, 0.24); noise('lowpass', 900, 0.8, 0.04, 0.1); });

  /* ---------------- the score sheet: shrinks away to the top-left, comes back (a little smaller) at the end ---------------- */
  const cellX = i => SH.at[0] - (6 * CELL + 26) / 2 + i * CELL + (i >= 3 ? 26 : 0) + CELL / 2;
  const CORNER = [220, 128], BACK = [800, 150], BACK_S = 0.92, SMALL = 0.32;
  COMP.b5_pSheet = {
    init(fx) { COMP.e5_scores.init(fx.inner); return fx; },
    draw(fx, t, F) {
      let pos, s, op;
      if (t < P.SH_GO + 0.45) {
        const u = EASE.in(clamp((t - P.SH_GO) / 0.45));
        pos = lerp2(SH.at, CORNER, u); s = lerp(1, SMALL, u); op = 1 - clamp((t - P.SH_GO - 0.15) / 0.3);
      } else if (t >= P.SH_BACK && t < P.END + 0.45) {
        const ui = EASE.out(clamp((t - P.SH_BACK) / 0.4)), uo = EASE.in(clamp((t - P.END) / 0.45));
        pos = lerp2(lerp2(CORNER, BACK, ui), CORNER, uo); s = lerp(lerp(SMALL, BACK_S, ui), SMALL, uo);
        op = clamp((t - P.SH_BACK) / 0.25) * (1 - clamp((t - P.END - 0.1) / 0.35));
      } else return;
      const n0 = DL.items.length;
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(s); DL.translate(-SH.at[0], -SH.at[1]);
      COMP.e5_scores.draw(fx.inner, t, F);
      DL.restore();
      fadeFrom(n0, op);
      F.targets[SID + '.s5'] = [pos[0] + s * (cellX(5) - SH.at[0]), pos[1]];
    },
    cues: fx => COMP.e5_scores.cues(fx.inner).concat([[P.SH_GO, 'whoosh'], [P.SH_BACK, 'whoosh']]),
  };

  /* ---------------- the prime machine ---------------- */
  const M = { x0: 270, x1: 690, y0: 270, y1: 560, cx: 480, base: [480, 584] };
  const FUN = { y0: 172, y1: 262, l0: 378, r0: 582, l1: 452, r1: 508 };
  const PANEL = { x0: 296, x1: 664, y0: 288, y1: 386 };
  const GEARS = [{ c: [372, 472], R: 46, n: 11, dir: 1 }, { c: [446, 478], R: 33, n: 8, dir: -1 }, { c: [520, 468], R: 46, n: 11, dir: 1 }];
  const LAMP = [618, 448], PIPE = { x0: 628, x1: 652, y0: 270, y1: 226 }, MOUTH = [792, 566];
  // the formula on the panel, written in three bursts ("□×□" · "+□" · "+41")
  const FORM = layoutWriting({ text: '□×□+□+41', x: M.cx, y: 309, size: 56, t0: P.FORM[0], speed: 2600, gap: 0.03, glyphGap: 0.03, anchor: 'middle' });
  [[3, P.FORM[1]], [5, P.FORM[2]]].forEach(([g0, tt]) => {
    const first = FORM.strokes.find(s => s.gi >= g0), dt = tt - first.t0;
    FORM.strokes.forEach(s => { if (s.gi >= g0) s.t0 += dt; });
  });
  if (FORM.strokes[FORM.strokes.length - 1].t0 > P.FORM[2] + 1.0) console.error('b5_primes: the formula writes too slowly');
  // stream of cards 4..39: faster and faster
  const OUTS = [...P.OUT];
  for (let k = 4; k <= 39; k++) OUTS[k] = P.S0 + (P.S1 - P.S0) * Math.pow((k - 4) / 35, 0.62);
  // gear speed (deg/s of the big gears), piecewise constant; the cough jams them
  const SPD = [[0, 0], [P.MACH + 0.5, 40], [8.95, 160], [9.6, 40]];
  P.BALL.forEach((b, k) => { SPD.push([b + 0.45, 330], [P.OUT[k] + 0.1, 45]); });
  SPD.push([P.S0 - 0.35, 720], [P.S1 + 0.15, 45], [P.B40_DROP + 0.2, 300], [P.COUGH, 0], [P.C1681 - 0.08, 260], [P.C1681 + 0.3, 30]);
  SPD.sort((a, b) => a[0] - b[0]);
  const gearAngle = t => { let a = 0; for (let i = 0; i < SPD.length; i++) { const t0 = SPD[i][0], t1 = i + 1 < SPD.length ? SPD[i + 1][0] : Infinity; if (t <= t0) break; a += SPD[i][1] * (Math.min(t, t1) - t0); } return a; };
  const gearSpeed = t => stepTrack(SPD, t);
  function gear(k, g, ang, z, p) {
    const { c, R, n } = g, pts = [];
    for (let i = 0; i < n; i++) {
      const a0 = ang + i * 360 / n;
      [[0, 0.78], [0.12, 1], [0.38, 1], [0.5, 0.78]].forEach(([fq, r]) => { const a = (a0 + fq * 360 / n) * RAD; pts.push([c[0] + Math.cos(a) * R * r, c[1] + Math.sin(a) * R * r, 1]); });
    }
    pts.push([pts[0][0], pts[0][1], 1]);
    stroke(k, pts, { z, w: 3.6, fill: C.paper, draw: p, boil: 0.5 });
    stroke(k + '.hub', ringPts(k + '.hub', c[0], c[1], R * 0.3, R * 0.3, { n: 8, closed: true }), { z: z + 0.1, w: 3.2, closed: true, draw: p });
    const a = ang * RAD;
    if (p > 0.6) stroke(k + '.sp', [[c[0] + Math.cos(a) * R * 0.3, c[1] + Math.sin(a) * R * 0.3], [c[0] + Math.cos(a) * R * 0.66, c[1] + Math.sin(a) * R * 0.66]], { z: z + 0.1, w: 3 });
  }
  COMP.b5_pMachine = {
    draw(fx, t) {
      if (t < P.MACH || t >= P.M5_OUT + 0.4) return;
      const n0 = DL.items.length, p = EASE.out(clamp((t - P.MACH) / 0.6)), k = 'b5p.m', z = Z.set + 3;
      // the cough: a shake about the feet
      const cu = (t - P.COUGH) / 0.65, shake = cu >= 0 && cu < 1 ? 2.6 * Math.sin(cu * 2 * Math.PI * 5.5) * (1 - cu) : 0;
      DL.save(); DL.translate(M.base[0], M.base[1]); DL.rotate(shake); DL.translate(-M.base[0] + (cu >= 0 && cu < 1 ? 4 * Math.sin(cu * 40) * (1 - cu) : 0), -M.base[1]);
      // body, feet, exhaust pipe
      stroke(k + '.body', [[M.x0, M.y0], [M.x1, M.y0, 1], [M.x1, M.y1, 1], [M.x0, M.y1, 1], [M.x0, M.y0, 1]], { z, w: 6, fill: C.paper, draw: stag(p, 0, 4) });
      [[322, -1], [638, 1]].forEach(([x, s], i) => stroke(k + '.ft' + i, [[x - 22, M.y1], [x - 28, M.y1 + 24, 1], [x + 28, M.y1 + 24, 1], [x + 22, M.y1]], { z: z - 0.1, w: 4.5, fill: C.paper, draw: stag(p, 1, 4) }));
      stroke(k + '.pipe', [[PIPE.x0, PIPE.y0], [PIPE.x0, PIPE.y1, 1], [PIPE.x1, PIPE.y1, 1], [PIPE.x1, PIPE.y0]], { z: z - 0.1, w: 4.5, fill: C.paper, draw: stag(p, 1, 4) });
      stroke(k + '.cap', [[PIPE.x0 - 8, PIPE.y1], [PIPE.x1 + 8, PIPE.y1]], { z: z - 0.05, w: 6, draw: stag(p, 1, 4) });
      // the formula panel and its writing
      stroke(k + '.panel', [[PANEL.x0, PANEL.y0], [PANEL.x1, PANEL.y0, 1], [PANEL.x1, PANEL.y1, 1], [PANEL.x0, PANEL.y1, 1], [PANEL.x0, PANEL.y0, 1]], { z: z + 0.1, w: 3.5, draw: stag(p, 1, 4) });
      FORM.strokes.forEach((s, i) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke(k + '.f' + i, s.pts, { z: z + 0.3, w: 6, draw: q, boil: 0.55 }); });
      // gears (they turn; the cough jams them with a twitch)
      const a = gearAngle(t) + (cu >= 0 && cu < 1 ? 14 * Math.sin(cu * 60) * (1 - cu) : 0);
      GEARS.forEach((g, i) => gear(k + '.g' + i, g, g.dir * a * (46 / g.R) + i * 17, z + 0.2, stag(p, 2, 4)));
      // a little lamp that lights while the machine is working
      const lit = gearSpeed(t) >= 200 && p >= 1;
      stroke(k + '.lamp', ringPts(k + '.lamp', LAMP[0], LAMP[1], 17, 17, { n: 10, closed: true }), { z: z + 0.2, w: 4, closed: true, fill: lit ? C.ink : C.paper, draw: stag(p, 3, 4) });
      if (lit) for (let i = 0; i < 6; i++) { const r = (i * 60 - 90) * RAD; stroke(k + '.lr' + i, [[LAMP[0] + Math.cos(r) * 24, LAMP[1] + Math.sin(r) * 24], [LAMP[0] + Math.cos(r) * 33, LAMP[1] + Math.sin(r) * 33]], { z: z + 0.2, w: 3 }); }
      // output chute on the right
      stroke(k + '.chT', [[M.x1, 506], [804, 546]], { z: z - 0.1, w: 4.5, draw: stag(p, 3, 4) });
      stroke(k + '.chB', [[M.x1, 552], [804, 592], [804, 540, 1]], { z: z - 0.1, w: 4.5, draw: stag(p, 3, 4) });
      // the funnel (paper-filled, in front of the balls so they vanish into it)
      const fz = Z.set + 3.6;
      stroke(k + '.fun', [[FUN.l0, FUN.y0], [FUN.r0, FUN.y0, 1], [FUN.r1, FUN.y1, 1], [FUN.r1, M.y0 + 2, 1], [FUN.l1, M.y0 + 2, 1], [FUN.l1, FUN.y1, 1], [FUN.l0, FUN.y0, 1]], { z: fz, w: 5, fill: C.paper, draw: stag(p, 3, 4) });
      stroke(k + '.rim', ringPts(k + '.rim', M.cx, FUN.y0, (FUN.r0 - FUN.l0) / 2, 13, { n: 14, a0: 0, sweep: 360, closed: true }), { z: fz + 0.1, w: 4, closed: true, fill: C.paper, draw: stag(p, 3, 4) });
      DL.restore();
      // the cough: smoke puffs out of the pipe (pencil)
      [0.05, 0.2, 0.34, 0.52].forEach((d, j) => {
        const u = (t - P.COUGH - d) / 1.1; if (u <= 0 || u >= 1) return;
        const c = [PIPE.x0 + 12 + 40 * u + j * 10, PIPE.y1 - 22 - 140 * u], r = 20 + 38 * u;
        stroke(k + '.sm' + j, ringPts(k + '.sm' + j, c[0], c[1], r, r * 0.85, { n: 9, closed: true, rv: 0.16 }), { z: Z.fx, w: 3.5, color: C.pencil, closed: true, fill: C.paper, opacity: 1 - u });
      });
      fadeFrom(n0, 1 - clamp((t - P.M5_OUT) / 0.35));
    },
    cues: () => [[P.MACH, 'swish'], ...FORM.strokes.map(s => [s.t0, 'pen']), ...P.BALL.map(b => [b + 0.45, 'b5_whirr']), [P.S0 - 0.35, 'b5_whirr'], [P.S0 + 0.4, 'b5_whirr'], [P.S0 + 0.9, 'b5_whirr'],
      [P.COUGH + 0.05, 'b5_cough'], [P.COUGH + 0.34, 'b5_cough']],
  };

  /* ---------------- number balls dropping into the funnel ---------------- */
  const BALL_Y = 86;
  const BALLS = P.BALL.map((b, k) => ({ n: String(k), t0: b, drop: b + 0.3, r: 34, size: 44 })).concat([{ n: '40', t0: P.B40, drop: P.B40_DROP, r: 40, size: 42 }]);
  for (let k = 4; k <= 39; k++) BALLS.push({ n: null, t0: OUTS[k] - 0.78, drop: OUTS[k] - 0.78, r: 15, from: -20 });
  COMP.b5_pBalls = {
    draw(fx, t) {
      BALLS.forEach((b, i) => {
        if (t < b.t0 || t >= b.drop + 0.32) return;
        const y0 = b.from ?? BALL_Y, y = y0 + (FUN.y1 - y0) * EASE.in(clamp((t - b.drop) / 0.3));
        const pop = b.from !== undefined ? 1 : Math.max(0.01, EASE.back(clamp((t - b.t0) / 0.25)));
        const k = 'b5p.ball' + i, z = Z.set + 2.5;
        DL.save(); DL.translate(M.cx, y); DL.scale(pop);
        stroke(k, ringPts(k, 0, 0, b.r, b.r, { n: 11, closed: true }), { z, w: b.n ? 4.5 : 3.5, closed: true, fill: C.paper });
        if (b.n) hw(k + '.n', b.n, 0, 0, b.size, { z: z + 0.1, w: 5 });
        DL.restore();
      });
    },
    cues: () => BALLS.filter(b => b.n).map(b => [b.t0, 'pop']).concat(BALLS.filter(b => b.n).map(b => [b.drop + 0.2, 'plip'])),
  };

  /* ---------------- cards: four big ones in a row, then a long strip of 40 small ones, then the 41st ---------------- */
  const ROW = [905, 1045, 1185, 1325], ROW_Y = 540, BIG = { w: 112, h: 82, num: 52 };
  const SX = i => 172 + 31 * i, SY = 718, MINI = { w: 26, h: 38 };
  const C40 = { c: [1010, 445], w: 210, h: 112, num: 64 };
  const LAND = i => (i < 4 ? P.SHRINK + i * 0.06 + 0.4 : i < 40 ? OUTS[i] + 0.3 : P.TO41 + 0.4);   // when card i sits in the strip
  /** where card i is at time t: {c, w, h, u (0 = big, 1 = mini), num, numSize} */
  function cardAt(i, t) {
    if (i < 4) {
      const o = P.OUT[i]; if (t < o) return null;
      const fly = EASE.out(clamp((t - o) / 0.32)), sh = P.SHRINK + i * 0.06, v = EASE.io(clamp((t - sh) / 0.4));
      const c0 = lerp2(MOUTH, [ROW[i], ROW_Y], fly), c0y = c0[1] - Math.sin(Math.PI * fly) * 40;
      const s = lerp(0.3, 1, fly);
      return { c: lerp2([c0[0], c0y], [SX(i), SY], v), w: lerp(BIG.w * s, MINI.w, v), h: lerp(BIG.h * s, MINI.h, v), u: v, num: String(f(i)), numSize: BIG.num * s };
    }
    if (i < 40) {
      const o = OUTS[i]; if (t < o) return null;
      const fly = EASE.out(clamp((t - o) / 0.3)), c = lerp2(MOUTH, [SX(i), SY], fly);
      return { c: [c[0], c[1] - Math.sin(Math.PI * fly) * 30], w: lerp(14, MINI.w, fly), h: lerp(20, MINI.h, fly), u: 1, num: null };
    }
    const o = P.C1681; if (t < o) return null;
    const fly = EASE.out(clamp((t - o) / 0.4)), v = EASE.io(clamp((t - P.TO41) / 0.4)), s = lerp(0.25, 1, fly);
    const c0 = lerp2(MOUTH, C40.c, fly);
    return { c: lerp2([c0[0], c0[1] - Math.sin(Math.PI * fly) * 50], [SX(40), SY], v), w: lerp(C40.w * s, MINI.w, v), h: lerp(C40.h * s, MINI.h, v), u: v, num: '1681', numSize: C40.num * s };
  }
  COMP.b5_pCards = {
    draw(fx, t) {
      if (t >= P.M5_OUT + 0.35) return;
      const n0 = DL.items.length;
      for (let i = 0; i <= 40; i++) {
        const s = cardAt(i, t); if (!s) continue;
        const k = 'b5p.cd' + i, [x, y] = s.c, z = Z.set + 5 + (s.u < 1 ? 1 : 0) + (i === 40 ? 0.5 : 0);
        rect(k, x, y, s.w, s.h, { z, w: lerp(4.5, 3, s.u), fill: C.paper });
        if (s.num && s.u < 0.5) hw(k + '.n', s.num, x, y, s.numSize, { z: z + 0.1, w: lerp(5.5, 3, s.u), op: 1 - s.u * 2 });
        if (i < 40) {          // ✓ = prime: big cards get one in the corner (L5), small ones in the middle when they land
          const tt = i < 4 ? P.TICK[i] : LAND(i);
          if (t >= tt) {
            const corner = [x + s.w / 2 - 16, y - s.h / 2 + 4], mid = [x, y], c = lerp2(corner, mid, s.u);
            hw(k + '.ok', '✓', c[0], c[1], lerp(34, 22, s.u), { z: z + 0.2, w: lerp(5, 3.4, s.u), color: C.red, p: clamp((t - tt) / 0.18) });
          }
        } else if (t >= P.CROSS) {   // ✗ = not prime
          const q = EASE.out(clamp((t - P.CROSS) / 0.3)), hx = s.w / 2 - lerp(16, 5, s.u), hy = s.h / 2 - lerp(12, 7, s.u), ww = lerp(7, 3.6, s.u);
          stroke(k + '.x1', [[x - hx, y - hy], [x + hx, y + hy]], { z: z + 0.2, w: ww, color: C.red, draw: clamp(q * 2) });
          stroke(k + '.x2', [[x + hx, y - hy], [x - hx, y + hy]], { z: z + 0.2, w: ww, color: C.red, draw: clamp(q * 2 - 1) });
        }
      }
      fadeFrom(n0, 1 - clamp((t - P.M5_OUT) / 0.35));
    },
    cues: () => {
      const c = P.OUT.map(o => [o, 'b5_clunk']).concat(P.TICK.map(tt => [tt, 'pen']), [[P.SHRINK, 'swish'], [P.C1681, 'b5_clunk'], [P.CROSS, 'pen'], [P.TO41, 'swish']]);
      for (let i = 4; i < 40; i += 3) c.push([OUTS[i], 'tap']);
      return c;
    },
  };
  /** red arcs +2, +4, +6 between the four big cards */
  COMP.b5_pDiffs = {
    draw(fx, t) {
      if (t >= P.D_OUT + 0.25) return;
      const n0 = DL.items.length;
      P.DIFF.forEach((td, j) => {
        if (t < td) return;
        const a = [ROW[j] + 8, ROW_Y - BIG.h / 2 - 8], b = [ROW[j + 1] - 8, ROW_Y - BIG.h / 2 - 8];
        arrow('b5p.df' + j, a, b, { p: EASE.out(clamp((t - td) / 0.3)), bend: -0.62, w: 4, head: 14 });
        hw('b5p.dn' + j, '+' + (2 * j + 2), (a[0] + b[0]) / 2, a[1] - 72, 44, { z: Z.annot, w: 5, color: C.red, p: clamp((t - td - 0.1) / 0.25) });
      });
      fadeFrom(n0, 1 - clamp((t - P.D_OUT) / 0.25));
    },
    cues: () => P.DIFF.map(td => [td, 'pen']),
  };
  /** the count over the strip: a pencil brace over the ✓ cards and "n 个 ✓" */
  const countAt = t => { let n = 0; for (let i = 0; i < 40; i++) if (t >= LAND(i)) n++; return n; };
  COMP.b5_pCount = {
    draw(fx, t) {
      if (t < LAND(0) || t >= P.CNT_OUT + 0.25) return;
      const n0 = DL.items.length, n = countAt(t); if (!n) return;
      const xa = SX(0) - 15, xb = SX(n - 1) + 15, mid = (xa + xb) / 2, y = 684, k = 'b5p.cnt';
      stroke(k + '.br', [[xa, y + 8], [xa + 8, y - 2], [mid - 10, y - 2], [mid, y - 14], [mid + 10, y - 2], [xb - 8, y - 2], [xb, y + 8]], { z: Z.set + 6, w: 3.5 });
      const str = n + ' 个', size = 48, tw = textWidth(str, size), all = tw + 10 + 0.8 * 40, x0 = mid - all / 2;
      const pulse = 1 + 0.25 * Math.max(0, Math.sin(Math.PI * clamp((t - LAND(39)) / 0.35)));
      DL.save(); DL.translate(mid, y - 46); DL.scale(pulse); DL.translate(-mid, -(y - 46));
      text(k + '.t', str, x0, y - 46, { size, font: CFG.FONT_MIX, anchor: 'start', z: Z.annot, halo: 8 });
      hw(k + '.ok', '✓', x0 + tw + 10 + 16, y - 48, 40, { z: Z.annot, w: 5, color: C.red });
      DL.restore();
      fadeFrom(n0, 1 - clamp((t - P.CNT_OUT) / 0.25));
    },
    cues: () => [[LAND(39), 'boop']],
  };
  /** 规律断了: a red zigzag between the 40th and the 41st card */
  COMP.b5_pBreak = {
    draw(fx, t) {
      if (t < P.BREAK || t >= P.M5_OUT + 0.35) return;
      const x = (SX(39) + SX(40)) / 2, op = 1 - clamp((t - P.M5_OUT) / 0.35);
      stroke('b5p.brk', [[x - 6, 686], [x + 6, 700], [x - 6, 714], [x + 6, 728], [x - 6, 742], [x + 4, 754]], { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - P.BREAK) / 0.25)), opacity: op });
    },
    cues: () => [[P.BREAK, 'pen']],
  };

  /* ---------------- “前 4 个 ✓ ⇒ 前 40 个 ✓” and the ring + arrow on the strip ---------------- */
  const CLAIM = { x: 1120, y: 405, size: 56 };
  const claimParts = [['t', '前 4 个', P.ST1], ['ok', '✓', P.ST1 + 0.25], ['imp', '', P.ST2], ['t', '前 40 个', P.ST2 + 0.2], ['ok', '✓', P.ST2 + 0.45]];
  const partW = ([kind, s]) => (kind === 't' ? textWidth(s, CLAIM.size) : kind === 'ok' ? 0.8 * CLAIM.size : 70);
  const CLAIM_W = claimParts.reduce((a, q) => a + partW(q), 0) + 18 * (claimParts.length - 1);
  COMP.b5_pClaim = {
    draw(fx, t) {
      if (t < P.ST1 || t >= P.M5_OUT + 0.35) return;
      const n0 = DL.items.length, { y, size } = CLAIM, k = 'b5p.cl';
      let x = CLAIM.x - CLAIM_W / 2;
      claimParts.forEach((q, i) => {
        const [kind, s, tt] = q, w = partW(q), u = clamp((t - tt) / 0.2);
        if (u > 0) {
          if (kind === 't') text(k + i, s, x, y, { size, anchor: 'start', z: Z.annot, opacity: clamp(u * 4), scale: lerp(0.7, 1, EASE.back(u)) });
          if (kind === 'ok') hw(k + i, '✓', x + w / 2, y - 2, size * 0.85, { z: Z.annot, w: 6, color: C.red, p: u });
          if (kind === 'imp') {   // ⇒ drawn as a double arrow
            const a = x + 4, b = x + w - 6;
            stroke(k + i + 'a', [[a, y - 8], [b - 10, y - 8]], { z: Z.annot, w: 4.5, draw: u });
            stroke(k + i + 'b', [[a, y + 8], [b - 10, y + 8]], { z: Z.annot, w: 4.5, draw: u });
            if (u > 0.9) stroke(k + i + 'h', [[b - 22, y - 22], [b, y, 1], [b - 22, y + 22]], { z: Z.annot, w: 4.5 });
          }
        }
        x += w + 18;
      });
      fadeFrom(n0, 1 - clamp((t - P.M5_OUT) / 0.35));
    },
    cues: () => claimParts.map(q => [q[2], q[0] === 'ok' ? 'pen' : 'pop']),
  };
  COMP.b5_pStripMarks = {
    draw(fx, t) {
      if (t < P.RING4 || t >= P.M5_OUT + 0.35) return;
      const n0 = DL.items.length, cx = (SX(0) + SX(3)) / 2, rx = (SX(3) - SX(0)) / 2 + MINI.w / 2 + 20;
      stroke('b5p.r4', ringPts('b5p.r4', cx, SY, rx, MINI.h / 2 + 15, { n: 12, a0: -150, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - P.RING4) / 0.35)) });
      if (t >= P.ARC) arrow('b5p.arc', [cx + rx + 6, SY - 26], [SX(39), SY - MINI.h / 2 - 8], { p: EASE.io(clamp((t - P.ARC) / 0.7)), bend: -0.08, w: 4.5, head: 20 });
      fadeFrom(n0, 1 - clamp((t - P.M5_OUT) / 0.35));
    },
    cues: () => [[P.RING4, 'pen'], [P.ARC, 'swish']],
  };

  /* ---------------- 看出规律 ✓ / 证出来（一座小山） ---------------- */
  const LN = { x: 760, y1: 330, y2: 520, size: 72 };
  const MTN = { base: 600, x0: 1030, x1: 1430, peak: [1236, 372], peak2: [1352, 470] };
  COMP.b5_pLines = {
    draw(fx, t) {
      if (t < P.LN1 || t >= P.M6_OUT + 0.3) return;
      const n0 = DL.items.length, k = 'b5p.ln', { x, size } = LN;
      const u1 = clamp((t - P.LN1) / 0.2);
      text(k + '.1', '看出规律', x, LN.y1, { size, anchor: 'start', z: Z.annot, opacity: clamp(u1 * 4), scale: lerp(0.7, 1, EASE.back(u1)) });
      if (t >= P.TICKL) hw(k + '.ok', '✓', x + textWidth('看出规律', size) + 56, LN.y1 - 2, size, { z: Z.annot, w: 7, color: C.red, p: clamp((t - P.TICKL) / 0.25) });
      const u2 = clamp((t - P.LN2) / 0.2);
      if (u2 > 0) text(k + '.2', '证出来', x, LN.y2, { size, anchor: 'start', z: Z.annot, opacity: clamp(u2 * 4), scale: lerp(0.7, 1, EASE.back(u2)) });
      const q = EASE.out(clamp((t - P.MTN) / 0.5));
      if (q > 0) {
        const { base, x0, x1, peak, peak2 } = MTN;
        stroke(k + '.m2', [[1250, base], [peak2[0], peak2[1], 1], [x1, base]], { z: Z.set + 1, w: 5, fill: C.paper, draw: q });
        stroke(k + '.m1', [[x0, base], [peak[0] - 40, peak[1] + 60], [peak[0], peak[1], 1], [peak[0] + 50, peak[1] + 80], [1330, base]], { z: Z.set + 2, w: 5.5, fill: C.paper, draw: q });
        stroke(k + '.gr', [[x0 - 20, base], [x1 + 20, base]], { z: Z.set + 2, w: 3, color: C.pencil, draw: q });
        if (q > 0.8) {
          [[1080, 586], [1108, 560], [1094, 532], [1132, 506], [1150, 470], [1180, 446], [1200, 410]].forEach((pt, i) => dot(k + '.p' + i, pt, 3.2, C.ink, Z.set + 2.5));
          stroke(k + '.pole', [[peak[0], peak[1] + 2], [peak[0], peak[1] - 52]], { z: Z.set + 2.6, w: 4 });
          stroke(k + '.flag', [[peak[0], peak[1] - 52], [peak[0] + 40, peak[1] - 40, 1], [peak[0], peak[1] - 28]], { z: Z.set + 2.6, w: 3.6, fill: C.paper });
        }
      }
      fadeFrom(n0, 1 - clamp((t - P.M6_OUT) / 0.3));
    },
    cues: () => [[P.LN1, 'pop'], [P.TICKL, 'pen'], [P.LN2, 'pop'], [P.MTN, 'swish']],
  };

  /* ---------------- 差一点点: thumb and finger, a tiny gap ---------------- */
  Object.assign(POSE, { b5_pinch: { armScale: 1.6, tilt: 6, armR: [112, 38], ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' } } });
  COMP.b5_pPinch = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors.terry; if (!a) return;
      const h = a.handR, q = clamp((t - fx.t0) / 0.15);
      stroke('b5p.pi1', [h, [h[0] + 8, h[1] - 20], [h[0] + 24, h[1] - 32]], { z: Z.front + 1, w: 5, draw: q });   // finger
      stroke('b5p.pi2', [h, [h[0] + 20, h[1] - 3], [h[0] + 33, h[1] - 14]], { z: Z.front + 1, w: 5, draw: q });   // thumb
      F.targets['b5p.gap'] = [h[0] + 30, h[1] - 24];
    },
  };

  /* ---------------- scene ---------------- */
  defineScene({
    id: 'primes', chapter: '质数机器', dur: P.DUR, floor: FL,
    cast: { terry: E5.terry },
    tracks: {
      terry: {
        enter: P.T_IN,
        pos: [[0, [560, FL]], [P.END, [-260, FL], 0.35, 'in']],
        pose: [[0, 'stand'], [P.PINCH, 'b5_pinch', 0.12, 'back'], [P.END, { lean: -14, tilt: -6, armL: [40, 30], armR: [40, 30] }, 0.08]],
        face: [[0, 'sheepish']],
        turn: [[0, 0.25], [P.END, -0.4, 0.08]],
        gaze: [[0, 'cell6'], [P.PINCH, 'viewer']],
        squash: [[0, 1], [P.PINCH, 1.05, 0.05], [P.PINCH + 0.05, 1, 0.2, 'back']],
      },
    },
    targets: () => ({ cell6: [BACK[0] + BACK_S * (cellX(5) - SH.at[0]), BACK[1]] }),
    fx: [
      { type: 'ageStamp', age: 11, t0: -3, ...E5.STAMP, dockT: -2, t1: P.DUR - 0.35 },   // shrinks away before the next scene stamps 12
      // the hand-over from havana: the sheet (same id), "第六题"; then it shrinks away
      { type: 'b5_pSheet', id: 'b5p.sheetGo', inner: { type: 'e5_scores', id: SID, at: SH.at, cell: CELL, t0: -1,
        scores: E5.S87.map(v => [v, -5]), total: [40, -5], ringT: [[5, -1, 52.0], [5, P.RING5]] } },
      { type: 'b5_pFade', f0: P.LB6_OUT, fd: 0.2, inner: { type: 'label', id: 'b5p.lb6', text: '第六题', at: [1160, 330], rot: -4, size: 52, t0: P.LB6, t1: P.LB6_OUT + 1, target: [cellX(5) + 6, SH.at[1] + 66], bend: 0.2, gap: 10 } },
      // the machine
      { type: 'b5_pBalls', id: 'b5p.balls' },
      { type: 'b5_pMachine', id: 'b5p.machine' },
      { type: 'b5_pFade', f0: P.L_OUT, fd: 0.25, inner: { type: 'label', id: 'b5p.lbM', text: '质数机器', at: [168, 236], rot: -5, size: 46, t0: P.LBM, t1: P.L_OUT + 1, target: [276, 300], bend: -0.25, gap: 10 } },
      { type: 'b5_pFade', f0: P.L_OUT, fd: 0.25, inner: { type: 'label', id: 'b5p.lbIn', text: '放进一个数', at: [800, 140], rot: 3, size: 44, t0: P.LBIN, t1: P.L_OUT + 1, target: [594, 178], bend: 0.25, gap: 12 } },
      // 41, 43, 47, 53 … then the strip
      { type: 'b5_pCards', id: 'b5p.cards' },
      { type: 'b5_pDiffs', id: 'b5p.diffs' },
      { type: 'b5_pCount', id: 'b5p.count' },
      { type: 'b5_pFade', f0: P.LB40_OUT, fd: 0.25, inner: { type: 'title', id: 'b5p.lb40', text: '连着 40 个质数！', x: 1130, y: 430, size: 60, color: 'red', rot: -3, t0: P.LB40 } },
      // 40 → 1681 = 41 × 41
      { type: 'b5_pFade', f0: P.M3_OUT, fd: 0.22, inner: { type: 'write', id: 'b5p.eq', text: '= 41×41', x: C40.c[0] + C40.w / 2 + 24, y: C40.c[1] - 31, size: 62, t0: P.EQ, speed: 2600, gap: 0.03, glyphGap: 0.04, w: 6.5, color: 'red', sfx: 'pen', z: Z.annot } },
      { type: 'b5_pFade', f0: P.M3_OUT, fd: 0.22, inner: { type: 'title', id: 'b5p.notp', text: '不是质数', x: C40.c[0], y: 572, size: 52, color: 'red', rot: -3, t0: P.NOTP } },
      // the 41st
      { type: 'b5_pFade', f0: P.CNT_OUT, fd: 0.25, inner: { type: 'label', id: 'b5p.lb41', text: '第 41 个数', at: [1268, 590], rot: -4, size: 46, t0: P.LB41, t1: P.CNT_OUT + 1, target: [SX(40) - 2, SY - MINI.h / 2 - 4], bend: -0.25, gap: 10 } },
      { type: 'b5_pBreak', id: 'b5p.break' },
      // what problem 6 asks
      { type: 'b5_pFade', f0: P.M5_OUT, fd: 0.35, inner: { type: 'title', id: 'b5p.head', text: '第六题要你证明：', x: CLAIM.x, y: 300, size: 48, t0: P.HEAD } },
      { type: 'b5_pStripMarks', id: 'b5p.marks' },
      { type: 'b5_pClaim', id: 'b5p.claim' },
      { type: 'b5_pFade', f0: P.M5_OUT, fd: 0.35, inner: { type: 'title', id: 'b5p.for41', text: '（对 41 来说）', x: CLAIM.x, y: 492, size: 42, color: 'red', rot: -2, t0: P.FOR41 } },
      // why must it?
      { type: 'qm', id: 'b5p.qm', pos: [[0, [330, 700]], [P.M6_OUT - 0.05, [-240, 700], 0.35, 'in']], size: 180, signSize: 42, t0: P.QM, t1: P.M6_OUT + 0.45, burst: true,
        mood: [[0, 'doubt']], act: [[0, 'hop'], [P.SIGN + 0.4, 'idle'], [P.M6_OUT - 0.05, 'hop']], sign: [[0, null], [P.SIGN, '为什么一定？']],
        gaze: [[0, 'viewer'], [P.LN1, [LN.x + 120, LN.y1]], [P.LN2, [LN.x + 100, LN.y2]], [P.MTN + 0.6, [MTN.peak[0], MTN.peak[1]]]] },
      { type: 'b5_pLines', id: 'b5p.lines' },
      { type: 'band', id: 'b5p.hi', rect: [LN.x, LN.y2 - LN.size / 2, textWidth('证出来', LN.size), LN.size], t0: P.BAND, t1: P.M6_OUT + 0.3, dur: 0.4, pad: 12 },
      // 5 points: a tiny bit short
      { type: 'b5_pPinch', id: 'b5p.pinch', t0: P.PINCH + 0.08, t1: P.END + 0.05 },
      { type: 'b5_pFade', f0: P.END - 0.05, fd: 0.2, inner: { type: 'label', id: 'b5p.lbP', text: '差一点点', at: [890, 470], rot: -4, size: 56, t0: P.LBP, t1: P.END + 1, target: { target: 'b5p.gap' }, bend: 0.25, gap: 10 } },
    ],
    sfx: [[P.T_IN, 'pop'], [P.END, 'whoosh']],
    subs: [
      { t0: 0.3, t1: 3.5, text: '丢掉的2分，在第六题。', say: '丢掉的两分，在第六题。' },
      { t0: 3.6, t1: 7.2, text: '它和一台“质数机器”有关：' },
      { t0: 7.6, t1: 13.6, text: '放进一个数，机器就算：□×□+□+41。', say: '放进一个数，机器就算：它乘它，加上它，再加四十一。' },
      { t0: 14.1, t1: 18.9, text: '出来41、43、47、53……', say: '出来四十一、四十三、四十七、五十三……' },
      { t0: 19.2, t1: 23.4, text: '每次多加2、4、6……全是质数！', say: '每次多加二、四、六……全是质数！' },
      { t0: 24.0, t1: 28.6, text: '从0放到39：四十个数，全是质数！', say: '从零放到三十九：四十个数，全是质数！' },
      { t0: 29.3, t1: 35.3, text: '可是放进40：1681=41×41。', say: '可是放进四十：一千六百八十一，等于四十一乘四十一。' },
      { t0: 35.7, t1: 39.1, text: '第四十一个数，规律断了。' },
      { t0: 40.0, t1: 44.6, text: '第六题要你证明：只要开头几个是质数，' },
      { t0: 44.7, t1: 47.9, text: '后面一长串就一定都是。' },
      { t0: 49.2, t1: 52.8, text: '看出规律不难，证出来才难。' },
      { t0: 53.2, t1: 57.2, text: '小陶拿了5分，离满分差一点点。', say: '小陶拿了五分，离满分差一点点。' },
    ],
  });
})();
