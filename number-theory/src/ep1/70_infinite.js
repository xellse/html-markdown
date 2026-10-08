// 第 70 场 · 查到 1000（infinite）：一台火柴人电脑站在右边，往左吐出纸带（和上一场的表一样：上面是数，下面打勾），
// 纸带从左往右读是 1、2、3……（最新的数紧挨电脑），越滚越快，一直查到 1000（998 是空格）；空格还是每隔 4 个（“隔 4”弧线）；小问号：够了吗？
// 不够：纸带接着往左飞出画面，左边写“……无穷”；电脑累得冒汗；
// 我们需要一个理由：2、6、10、14……一起亮起来，连成一条红线，越来越小，消失在远处。
// 开场：空舞台（电脑画出来，小问号弹进来）；结尾：全部淡出。
(() => {
  const FL = N1.FL;

  /* ---------------- the maths, checked ---------------- */
  const blank = n => n % 4 === 2;                       // the numbers not (yet) written as a² − b²
  // n = a² − b² = (a − b)(a + b): look for a factor pair d·e = n with d ≤ e of the same parity (then a = (d + e) / 2, b = (e − d) / 2)
  const ways = n => { for (let d = 1; d * d <= n; d++) if (n % d === 0 && (n / d - d) % 2 === 0) return true; return false; };
  for (let n = 1; n <= 1000; n++) if (ways(n) === blank(n)) { console.error('e1_infinite: blank pattern breaks at', n); break; }
  if (!blank(998) || blank(996) || blank(997) || blank(999) || blank(1000)) console.error('e1_infinite: the last blank below 1000 should be 998');
  const SERIES = Array.from({ length: 14 }, (_, k) => 4 * k + 2);
  if (SERIES.slice(0, 5).join() !== '2,6,10,14,18' || !SERIES.every(blank)) console.error('e1_infinite: series', SERIES);

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    PC: 0.1, TAPE: 0.5, STOP: 4.2,
    RING: [5.0, 5.2, 5.4], ARC: [5.85, 6.25], RING_OUT: 12.55,
    QSIGN: 9.05, QDOWN: 12.3,
    GO: 12.9, INF: 17.6, SWEAT: 20.75,
    OLD_OUT: 24.05,
    ITEM: 24.4, LIT: 25.65, LINE: 25.95, ALL: 29.6,
    OUT: 32.4, DUR: 33.0,
  };

  /* ---------------- helpers ---------------- */
  const fadeFrom = (n0, a) => { if (a >= 1) return; for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * a).toFixed(3); } };
  /** a group: optional transform track xf [[t, [tx, ty, s]]]; from `out` on it fades over `dur` */
  COMP.e1_grp = COMP.e1_grp || {
    init(fx) { fx.inner = [].concat(fx.inner); fx.inner.forEach(f => { const c = COMP[f.type]; if (c.init && !f._e1) { c.init(f); f._e1 = 1; } }); return fx; },
    draw(fx, t, F) {
      if (fx.t0 !== undefined && t < fx.t0) return;
      const u = fx.out === undefined ? 0 : clamp((t - fx.out) / (fx.dur ?? 0.35)); if (u >= 1) return;
      const n0 = DL.items.length;
      DL.save();
      if (fx.xf) { const [tx, ty, s] = evalTrack(fx.xf, t); DL.translate(tx, ty); DL.scale(s); }
      fx.inner.forEach(f => COMP[f.type].draw(f, t, F));
      DL.restore();
      fadeFrom(n0, 1 - u);
    },
    cues: fx => fx.cues || fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])),
  };
  /** free drawing: fn(t, lt, key, F) from t0 on */
  COMP.e1_fn = COMP.e1_fn || { draw(fx, t, F) { if (t < fx.t0) return; fx.fn(t, t - fx.t0, fx.id, F); }, cues: fx => fx.cues || [] };
  const dash = (k, p, q, o = {}) => {
    const L = dist(p, q), m = Math.max(1, Math.round(L / (o.step || 22)));
    for (let d = 0; d < m; d++) { const u0 = d / m, u1 = Math.min(1, u0 + (o.on || 12) / L); stroke(`${k}.${d}`, [lerp2(p, q, u0), lerp2(p, q, u1)], { z: o.z ?? Z.board, w: o.w || 3, color: o.color || C.ink, opacity: o.opacity, boil: 0.4 }); }
  };
  const drawLayout = (k, L, o = {}) => L.strokes.forEach((s, j) => stroke(k + '.' + j, s.pts, { z: o.z ?? Z.board, w: o.w || 5.5, color: o.color || C.ink, boil: 0.55, opacity: o.opacity }));

  /* ---------------- how many cells the computer has pushed out by time t ---------------- */
  const P = t => {
    if (t < T.TAPE) return 0;
    if (t < 1.4) return 3 * (t - T.TAPE) / (1.4 - T.TAPE);                         // 1, 2, 3 — one by one
    if (t < 3.3) {                                                                  // faster and faster … (Hermite: 3 → 995)
      const D = 1.9, u = (t - 1.4) / D, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * 3 + (u3 - 2 * u2 + u) * D * 3.33 + (-2 * u3 + 3 * u2) * 995 + (u3 - u2) * D * 11.1;
    }
    if (t < T.STOP) { const u = (t - 3.3) / (T.STOP - 3.3); return 995 + 5 * (1 - (1 - u) * (1 - u)); }   // … 996, 997, 998, 999, 1000
    if (t < T.GO) return 1000;
    const s = t - T.GO; return 1000 + 4 * s + 250 * s * s;                           // not enough: off it flies
  };
  const speed = t => (P(t + 0.02) - P(t)) / 0.02;

  /* ---------------- the computer (a box with a screen, little hands and legs) ---------------- */
  const PCB = { x0: 1290, x1: 1530, y0: 296, y1: 504 }, SX = PCB.x0, PCX = (PCB.x0 + PCB.x1) / 2;   // the slot is on its left side
  const computer = {
    type: 'e1_fn', id: 'e1iPc', t0: T.PC, cues: [[T.PC, 'pen'], [T.PC + 0.25, 'pen'], [T.TAPE, 'beep'], [T.STOP, 'ding'], [T.GO, 'beep'], [T.SWEAT, 'boop']],
    fn: (t, lt, k) => {
      const p = EASE.out(clamp(lt / 0.5)), { x0, x1, y0, y1 } = PCB, z = Z.desk, v = speed(t), busy = v > 0.5;
      stroke(k + '.box', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 6, fill: C.paper, draw: p });
      stroke(k + '.scr', superPts((x0 + x1) / 2, 382, 196, 120, 24, 7), { z: z + 0.1, w: 4, closed: true, fill: C.paper, draw: clamp(p * 1.4 - 0.4) });
      stroke(k + '.slot', [[x0 + 2, 322], [x0 + 2, 478]], { z: z + 0.1, w: 9, draw: clamp(p * 1.4 - 0.4) });
      [0, 1, 2].forEach(i => dot(`${k}.led${i}`, [x1 - 74 + i * 22, 474], 5, i === 0 && busy && Math.floor(t * 8) % 2 ? C.red : C.ink, z + 0.2));
      // legs and feet
      [[PCX - 60, PCX - 72], [PCX + 60, PCX + 72]].forEach(([a, b], i) => stroke(`${k}.leg${i}`, [[a, y1], [b, FL], [b + (i ? 22 : -22), FL]], { z: z - 1, w: 5.5, draw: clamp(p * 1.5 - 0.5) }));
      if (p > 0.7) shadow(k + '.sh', PCX, FL + 4, 200, 1);
      // little hands: they crank while the tape runs
      const ph = busy ? Math.sin(t * 14) : 0, sw = t > T.SWEAT ? Math.sin(t * 9) : 0;
      stroke(k + '.armR', [[x1, 420], [x1 + 34, 446 + 10 * ph], [x1 + 30 - 8 * sw, 488 + 6 * ph]], { z, w: 5, draw: clamp(p * 1.5 - 0.5) });
      stroke(k + '.armL', [[x0 + 40, y1], [x0 + 8, y1 + 34 - 8 * ph], [x0 - 26, y1 + 26 + 10 * ph]], { z, w: 5, draw: clamp(p * 1.5 - 0.5) });
      // the screen: the number it is checking (computer font)
      if (lt > 0.35) {
        const n = Math.floor(P(t) + 1e-6), s = String(n);
        text(k + '.cnt', s, PCX, 380, { size: Math.min(64, 176 / (CFG.MONO_ADV * s.length)), font: CFG.FONT_MONO, z: z + 0.3, color: C.ink });
      }
      // L6: it can never finish — sweat drops
      if (t > T.SWEAT) for (let i = 0; i < 12; i++) {
        const td = t - (T.SWEAT + i * 0.45); if (td < 0 || td > 0.6) continue;
        const u = td / 0.6, side = i % 2 ? 1 : -1, bx = side > 0 ? x1 + 18 : x0 - 18, by = y0 - 6 + u * 46;
        stroke(`${k}.sw${i % 3}`, [[bx, by - 14], [bx - 7, by + 2], [bx, by + 9], [bx + 7, by + 2], [bx, by - 14, 1]], { z: Z.fx, w: 3.5, opacity: 1 - u * 0.8 });
      }
    },
  };

  /* ---------------- the tape: numbers on top, ticks below (like the table) ---------------- */
  const CW = 110, TY0 = 330, TY1 = 400, TY2 = 470;
  const TICK = layoutWriting({ text: '✓', x: 0, y: 0, size: 46, t0: 0, speed: 1e6 });
  const LEAD = 30;                                     // a strip of blank paper between the slot and the newest cell
  const cellX = (k, t) => SX - LEAD - (P(t) - k + 0.5) * CW;   // centre of cell k (cell 1 came out first, so it is furthest left: the tape reads 1, 2, 3 … left to right)
  const tape = {
    type: 'e1_fn', id: 'e1iTp', t0: T.TAPE, cues: [0.5, 0.8, 1.1, 1.4, 1.7, 2.0, 2.3, 2.6, 2.9, 3.2, 3.5, 3.75, 3.95, 4.1].map(x => [x + 0.02, 'tap']).concat([13.1, 13.5, 13.8, 14.1].map(x => [x, 'tap']), [[T.GO + 0.6, 'whoosh']]),
    fn: (t, lt, k) => {
      const Pt = P(t), lead = Math.max(-40, SX - LEAD - Pt * CW), v = speed(t);
      if (lead >= SX - 1) return;
      [TY0, TY1, TY2].forEach((y, i) => stroke(`${k}.h${i}`, [[lead, y], [SX, y, 1]], { z: Z.board, w: i === 1 ? 3 : 4.5 }));
      const kmax = Math.ceil(Pt), kmin = Math.max(1, Math.floor(Pt - (SX + 40) / CW));
      for (let n = kmax; n >= kmin; n--) {
        const x = cellX(n, t); if (x + CW / 2 < -40) continue;
        stroke(`${k}.v${n}`, [[x - CW / 2, TY0], [x - CW / 2, TY2]], { z: Z.board, w: 3.5 });
        if (n === kmax && x + CW / 2 < SX) stroke(`${k}.v${n}R`, [[x + CW / 2, TY0], [x + CW / 2, TY2]], { z: Z.board, w: 3.5 });
        if (x + CW / 2 > SX - 10) continue;   // still (partly) inside the computer
        const s = String(n);
        text(`${k}.n${n}`, s, x, (TY0 + TY1) / 2 + 2, { size: Math.min(54, 92 / (CFG.MONO_ADV * s.length)), font: CFG.FONT_MONO, z: Z.board + 0.1 });
        if (blank(n)) { const P4 = [[x - 26, TY1 + 9], [x + 26, TY1 + 9], [x + 26, TY2 - 9], [x - 26, TY2 - 9]]; P4.forEach((a, j) => dash(`${k}.b${n}.${j}`, a, P4[(j + 1) % 4], { step: 14, on: 7, w: 2.5 })); }
        else TICK.strokes.forEach((st, j) => stroke(`${k}.k${n}.${j}`, st.pts.map(q => [q[0] + x - TICK.width / 2, q[1] + TY1 + 12, q[2]]), { z: Z.annot - 1, w: 5, color: C.red, boil: 0.5 }));
      }
      // speed streaks above and below the tape
      if (v > 25) {
        const a = clamp((v - 25) / 200), len = 60 + 220 * a;
        for (let i = 0; i < 6; i++) {
          const y = i < 3 ? TY0 - 18 - i * 11 : TY2 + 18 + (i - 3) * 11, x = SX - 60 - ((i * 397 + t * 1900) % 1170);
          stroke(`${k}.sp${i}`, [[x, y], [Math.max(0, x - len), y]], { z: Z.set, w: 2.6, color: C.pencil, opacity: 0.85 * a, boil: 0.6 });
        }
      }
    },
  };

  /* ---------------- L2: the blanks on screen flash; “隔 4” arcs (the tape is standing still at 1000) ---------------- */
  const SHOWN = [990, 994, 998], xAt = n => SX - LEAD - (1000 - n + 0.5) * CW;   // left to right
  const blanksNote = {
    type: 'e1_grp', id: 'e1iBlG', out: T.RING_OUT, dur: 0.3,
    inner: { type: 'e1_fn', id: 'e1iBl', t0: T.RING[0], cues: T.RING.map(r => [r, 'plip']).concat(T.ARC.map(a => [a, 'pen'])),
      fn: (t, lt, k) => {
        SHOWN.forEach((n, i) => {
          const u = clamp((t - T.RING[i]) / 0.25); if (u <= 0) return;
          stroke(`${k}.r${i}`, ringPts(`${k}.r${i}`, xAt(n), (TY0 + TY1) / 2 + 2, 58, 40, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: EASE.out(u) });
        });
        T.ARC.forEach((ta, i) => {
          const p = EASE.out(clamp((t - ta) / 0.35)); if (p <= 0) return;
          const a = [xAt(SHOWN[i]) + 10, TY0 - 8], b = [xAt(SHOWN[i + 1]) - 10, TY0 - 8], len = b[0] - a[0], c = [(a[0] + b[0]) / 2, a[1] - 0.28 * len], pts = [];
          for (let j = 0; j <= 8; j++) { const u = j / 8; pts.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]]); }
          stroke(`${k}.a${i}`, pts, { z: Z.annot, w: 4, color: C.red, draw: p, boil: 0.8 });
          const lu = clamp((t - ta - 0.2) / 0.2);
          if (lu > 0) text(`${k}.l${i}`, '隔 4', (a[0] + b[0]) / 2, TY0 - 98, { size: 40, color: C.red, z: Z.annot, opacity: lu, scale: lerp(0.6, 1, EASE.back(lu)), halo: 8 });
        });
      } },
  };

  /* ---------------- L5: “……无穷” on the left, where the tape runs out of the picture ---------------- */
  const inf = { type: 'title', id: 'e1iInf', text: '……无穷', x: 300, y: 230, size: 84, t0: T.INF, rot: 3, sfx: 'pop' };

  const old = { type: 'e1_grp', id: 'e1iOld', out: T.OLD_OUT, inner: [tape, computer, blanksNote, inf] };

  /* ---------------- L7–L8: 2, 6, 10, 14 … light up together, strung on a red line that runs off into the distance ---------------- */
  const A = [210, 610], VP = [1480, 286], R = 0.8;
  const ITEMS = SERIES.map((n, k) => {
    const f = 1 - Math.pow(R, k), s = Math.pow(R, k);
    return { n, k, c: [A[0] + (VP[0] - A[0]) * f, A[1] + (VP[1] - A[1]) * f], s, L: layoutWriting({ text: String(n), x: 0, y: -31, size: 62, t0: 0, speed: 1e6, anchor: 'middle', gap: 0.02, glyphGap: 0.02 }) };
  });
  const RR = 56;
  const series = {
    type: 'e1_fn', id: 'e1iSe', t0: T.ITEM, cues: [[T.ITEM, 'pop'], [T.ITEM + 0.25, 'pop'], [T.LIT, 'ding'], [T.LINE, 'zip'], [T.ALL, 'tada']],
    fn: (t, lt, k) => {
      const pv = (t - T.ALL) / 0.5, pulse = pv > 0 && pv < 1 ? 1 + 0.22 * Math.sin(Math.PI * pv) : 1;
      // the red string between the rings (never through a number), thinner and thinner, into the vanishing point
      ITEMS.forEach((it, i) => {
        const nx = ITEMS[i + 1], to = nx ? nx.c : VP, d = dist(it.c, to) || 1, ux = (to[0] - it.c[0]) / d, uy = (to[1] - it.c[1]) / d;
        const r0 = RR * it.s + 6, r1 = nx ? RR * nx.s + 6 : 0;
        const u = clamp((t - T.LINE - i * 0.07) / 0.12); if (u <= 0 || d < r0 + r1 + 2) return;
        const p = [it.c[0] + ux * r0, it.c[1] + uy * r0], q = [to[0] - ux * r1, to[1] - uy * r1];
        stroke(`${k}.ln${i}`, [p, lerp2(p, q, u)], { z: Z.annot - 1, w: Math.max(1.4, 6 * it.s), color: C.red, boil: 0.5 });
      });
      ITEMS.forEach(it => {
        const ap = clamp((t - T.ITEM - it.k * 0.06) / 0.22); if (ap <= 0) return;
        const s = it.s * Math.max(0.01, EASE.back(ap));
        DL.save(); DL.translate(it.c[0], it.c[1]); DL.scale(s * pulse);
        drawLayout(`${k}.n${it.k}`, it.L, { w: 5.5, z: Z.board });
        const lu = clamp((t - T.LIT) / 0.25);
        if (lu > 0) stroke(`${k}.r${it.k}`, ringPts(`${k}.r${it.k}`, 0, 0, RR * EASE.back(lu), RR * EASE.back(lu), { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red });
        // rays when they all light up at once (L8: “一下子”)
        if (pv > 0 && pv < 1) for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4 + 0.3, r0 = RR + 10 + 8 * pv, r1 = r0 + 16; stroke(`${k}.ray${it.k}.${j}`, [[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a) * r1, Math.sin(a) * r1]], { z: Z.annot, w: 4, color: C.red, opacity: 1 - pv }); }
        DL.restore();
      });
    },
  };
  const seriesG = { type: 'e1_grp', id: 'e1iSeG', out: T.OUT, inner: series };

  /* ---------------- 小问号 ---------------- */
  const QX = 1120;
  const qm = {
    type: 'e1_grp', id: 'e1iQmG', out: T.OUT,
    inner: {
      type: 'qm', id: 'e1iQm', size: 150, t0: 0.12, burst: true, pos: [[0, [QX, FL]]], signSize: 58,
      mood: [[0, 'neutral'], [1.6, 'surprised'], [T.STOP + 0.3, 'neutral'], [T.QSIGN, 'doubt'], [T.QDOWN, 'neutral'], [T.GO + 0.4, 'surprised'], [T.ITEM, 'neutral'], [T.ALL, 'happy']],
      act: [[0, 'idle'], [T.QSIGN, 'tap'], [T.QDOWN, 'idle'], [T.ALL, 'hop'], [T.ALL + 1.4, 'idle']],
      sign: [[0, null], [T.QSIGN, '够了吗？'], [T.QDOWN, null]],
      gaze: [[0, [1410, 380]], [1.6, [700, 400]], [T.STOP, [1410, 380]], [T.RING[0], [545, 360]], [T.QSIGN, 'viewer'], [T.GO, [600, 400]], [T.INF, [300, 240]], [T.SWEAT, [1410, 330]],
        [T.ITEM, [500, 520]], [T.LINE + 0.4, [1300, 320]], [T.ALL, 'viewer']],
    },
  };

  defineScene({
    id: 'infinite', chapter: '查到 1000', dur: T.DUR, floor: FL,
    fx: [old, seriesG, qm],
    subs: [
      { t0: 0.3, t1: 4.15, text: '让电脑一个一个查，查到1000。', say: '让电脑一个一个查，查到一千。' },
      { t0: 4.55, t1: 8.4, text: '空格还是每隔4个，出现一次。', say: '空格还是每隔四个，出现一次。' },
      { t0: 9.0, t1: 11.85, text: '“查到1000，够了吗？”', voice: 'qm', say: '查到一千，够了吗？' },
      { t0: 12.35, t1: 17.04, text: '不够。2、6、10、14……', say: '不够。二、六、十、十四……' },
      { t0: 17.24, t1: 20.35, text: '这串数有无穷多个，' },
      { t0: 20.55, t1: 24.0, text: '一个一个查，永远查不完。' },
      { t0: 24.6, t1: 27.45, text: '我们需要一个理由，' },
      { t0: 27.65, t1: 31.9, text: '对这串里的每一个，一下子都成立。' },
    ],
  });
})();
