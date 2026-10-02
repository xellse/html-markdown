// 第 20 场 · 第一天：1986 年 7 月 9 日，IMO 第一天考试——四个半小时，三道题。
// 第 1 题：{2, 5, 13, d}。2×5−1 = 9 = 3×3，2×13−1 = 25 = 5×5，5×13−1 = 64 = 8×8，全是平方数；
// 换一个数 d（不是 2、5、13），2d−1、5d−1、13d−1 不可能全是平方数——要证出来。他第 1 题 7 分（满分），第 2 题（几何）也是 7 分。
// 所有算式在页面加载时验算，算错就 console.error。成绩单用共享的 e4_scores（位置 E4.SHEET），第 25 场从本场结尾接着演。
(() => {
  const FL = 780, DX = 290, DTOP = 622, DW = 300, SEAT = 640;     // Terry's desk (open, so his dangling legs show) and seat
  const SH = E4.SHEET, CELL = SH.cell;
  /** centre of score cell i (0-based) and its bottom edge — same maths as e4_scores */
  const cellX = i => SH.at[0] - (6 * CELL + 26) / 2 + i * CELL + (i >= 3 ? 26 : 0) + CELL / 2;
  const CELL_BOT = SH.at[1] + CELL / 2;

  /* ---------------- timing (scene clock) ---------------- */
  const ROOM_T1 = 7.15;                       // the establishing shot clears before the maths
  const MATH_T1 = 25.1;                       // the three square lines leave
  const Q_T1 = 34.2;                          // the d-lines and the "不能" stamp leave
  const W1 = [11.2, 12.75, 13.45], W2 = [14.3, 16.0, 16.9], W3 = [18.0, 19.7, 20.6];   // lhs, "= n", red "= k×k"
  const ALL_T = 21.95, HI_T = 22.55;          // 全是平方数！ and its yellow swipe
  const DQ = [25.3, 25.75, 26.2], D_T = 26.65, QM_T = [28.2, 28.45, 28.7], NO_T = 30.95;
  const TICK_T = 34.75, FULL_T = 35.95, S1_T = 36.55;
  const GEO_T = 38.7, GEO_LB = 39.75, S2_T = 41.05, DUR = 42.5;

  /* ---------------- the maths, checked ---------------- */
  const SQ = [[2, 5, 3], [2, 13, 5], [5, 13, 8]];
  SQ.forEach(([a, b, k]) => { if (a * b - 1 !== k * k) console.error('d4_day1: ' + a + '×' + b + '−1 is not ' + k + '×' + k); });
  if (9 !== 3 * 3 || 25 !== 5 * 5 || 64 !== 8 * 8) console.error('d4_day1: squares');

  /* ---------------- layout of the three lines: lhs right-aligned, "=" in one column, red notes in another ---------------- */
  const S = 92, RS = 66, GAP1 = 30, GAP2 = 58, MCX = 1035;
  const LINES = SQ.map(([a, b, k]) => ({ lhs: `${a}×${b} - 1`, rhs: `= ${a * b - 1}`, note: `= ${k}×${k}` }));
  const wL = Math.max(...LINES.map(L => writeWidth(L.lhs, S))), wR = Math.max(...LINES.map(L => writeWidth(L.rhs, S)));
  const wN = Math.max(...LINES.map(L => writeWidth(L.note, RS)));
  const X0 = MCX - (wL + GAP1 + wR + GAP2 + wN) / 2, EQX = X0 + wL + GAP1, NX = EQX + wR + GAP2;
  const LY = [290, 408, 526];
  const WT = [W1, W2, W3];
  const MATH = LINES.flatMap((L, i) => [
    { type: 'write', id: `d4d1.l${i}`, text: L.lhs, x: EQX - GAP1, y: LY[i], size: S, t0: WT[i][0], t1: MATH_T1, speed: 2300, gap: 0.03, glyphGap: 0.03, w: 7, anchor: 'end', sfx: 'pen' },
    { type: 'write', id: `d4d1.r${i}`, text: L.rhs, x: EQX, y: LY[i], size: S, t0: WT[i][1], t1: MATH_T1, speed: 2300, gap: 0.03, glyphGap: 0.03, w: 7, sfx: 'pen' },
    { type: 'write', id: `d4d1.n${i}`, text: L.note, x: NX, y: LY[i] + (S - RS), size: RS, t0: WT[i][2], t1: MATH_T1, speed: 2800, gap: 0.02, glyphGap: 0.03, w: 5.5, color: 'red', sfx: 'pen', z: Z.annot },
  ]);
  const NO_AT = [1400, 566], ALL_Y = 696, ALL_S = 88, ALL_W = textWidth('全是平方数！', ALL_S);

  /* ---------------- the question: put a new number d next to 2, 5 and 13 ---------------- */
  const QL = ['2×□ - 1 =', '5×□ - 1 =', '13×□ - 1 ='];
  const wEq = writeWidth('=', S), QX = EQX + wEq + 0.1 * S + writeWidth(' ', S) + 0.12 * S;   // where the red "?" goes
  const QFX = QL.map((txt, i) => ({ type: 'write', id: `d4d1.q${i}`, text: txt, x: EQX + wEq, y: LY[i], size: S, t0: DQ[i], t1: Q_T1, speed: 3200, gap: 0.02, glyphGap: 0.02, w: 7, anchor: 'end', sfx: 'pen' }));
  /** a red "d" pops into each □ */
  COMP.d4_d1d = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      QFX.forEach((q, i) => {
        const w = FXBY[q.id], b = w && w.boxes.find(bb => bb.ch === '□'); if (!b) return;
        const lt = t - fx.t0 - i * 0.12; if (lt < 0) return;
        const pp = EASE.back(clamp(lt / 0.22));
        text('d4d1.d' + i, 'd', b.x + 0.39 * S, w.y + 0.56 * S, { size: 60, font: CFG.FONT_MIX, color: C.red, z: Z.annot, scale: lerp(0.3, 1, pp), opacity: clamp(lt / 0.08) });
      });
    },
    cues: fx => [0, 1, 2].map(i => [fx.t0 + i * 0.12, 'plip']),
  };
  /** red rubber stamp ("不能") */
  COMP.d4_d1stamp = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const u = clamp((t - fx.t0) / 0.18), W = textWidth(fx.text, fx.size) / 2 + 44, H = fx.size * 0.8;
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(fx.rot || 0); DL.scale(lerp(1.9, 1, EASE.out(u)));
      const o = { z: Z.stamp - 1, color: C.red, opacity: u, boil: 0.6 };
      stroke(fx.id + '.o', [[-W, -H], [W, -H, 1], [W, H, 1], [-W, H, 1], [-W, -H, 1]], { ...o, w: 8, fill: C.paper });
      stroke(fx.id + '.i', [[-W + 13, -H + 13], [W - 13, -H + 13, 1], [W - 13, H - 13, 1], [-W + 13, H - 13, 1], [-W + 13, -H + 13, 1]], { ...o, w: 3.4 });
      text(fx.id + '.t', fx.text, 0, 4, { size: fx.size, color: C.red, z: Z.stamp - 0.5, opacity: u });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'stamp']],
  };

  /* ---------------- the exam room: rows of little desks, everyone bent over their paper ---------------- */
  const ROWS = [
    { top: 500, s: 0.52, xs: [720, 890, 1060, 1230, 1400], hair: ['part', 'curly', 'messy', 'bob', 'ponytail'] },
    { top: 556, s: 0.7, xs: [800, 1030, 1260, 1490], hair: ['messy', 'ponytail', 'part', 'curly'] },
  ];
  function miniKid(k, x, top, s, hair, z, p) {
    const r = 48 * s, hc = [x, top - 70 * s], w = DW * 0.78 * s, fl = top + (FL - DTOP) * s;
    // the student (behind the desk): torso, head looking down at the paper, hair
    stroke(k + '.torso', [[x, hc[1] + r], [x, top + 10]], { z, w: 4, draw: p });
    stroke(k + '.hf', ringPts(k + '.h', hc[0], hc[1], r, r, { n: 12, closed: true, rv: 0.035 }), { z: z + 0.05, closed: true, fill: C.paper, noStroke: true, w: 1, draw: p });
    stroke(k + '.h', ringPts(k + '.h', hc[0], hc[1], r, r, { n: 12, a0: -120, sweep: 372, rv: 0.035 }), { z: z + 0.06, w: 3.6, draw: p });
    if (p > 0.6) [-1, 1].forEach(sd => dot(k + '.e' + sd, [x + sd * 0.34 * r, hc[1] + 0.22 * r], 0.13 * r + 1, C.ink, z + 0.07));
    if (hair && HAIR[hair]) HAIR[hair](0, 0).forEach((pts, i) => stroke(k + '.hr' + i, pts.map(q => [hc[0] + q[0] * r, hc[1] + q[1] * r]), { z: z + 0.08, w: 3.2, draw: p }));
    // the desk in front, and both hands on it
    const zd = z + 0.2;
    stroke(k + '.slab', superPts(x, top + 7 * s, w, 16 * s, 16, 7), { z: zd, w: 3.6, closed: true, fill: C.paper, draw: p });
    stroke(k + '.pan', [[x - w / 2 + 10 * s, top + 15 * s], [x + w / 2 - 10 * s, top + 15 * s, 1], [x + w / 2 - 10 * s, top + 70 * s, 1], [x - w / 2 + 10 * s, top + 70 * s, 1], [x - w / 2 + 10 * s, top + 15 * s]], { z: zd, w: 3.2, fill: C.paper, draw: p });
    [-1, 1].forEach(sd => stroke(k + '.lg' + sd, [[x + sd * (w / 2 - 16 * s), top + 70 * s], [x + sd * (w / 2 - 15 * s), fl]], { z: zd, w: 3.4, draw: p }));
    stroke(k + '.pp', [[x - 40 * s, top + 1], [x - 32 * s, top - 9 * s, 1], [x + 36 * s, top - 9 * s, 1], [x + 44 * s, top + 1, 1]], { z: zd + 0.05, w: 2.6, fill: C.paper, draw: p });
    [-1, 1].forEach(sd => stroke(k + '.arm' + sd, [[x + sd * 6 * s, hc[1] + r + 16 * s], [x + sd * 50 * s, top - 22 * s], [x + sd * 26 * s, top - 2]], { z: zd + 0.1, w: 3.6, draw: p }));
  }
  /** the room steps back (fades to 40 %) once the clock and the papers take over, so they are the one focus */
  COMP.d4_d1room = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const n0 = DL.items.length, op = 1 - 0.6 * EASE.io(clamp((t - fx.dim) / 0.3));
      ROWS.forEach((R, ri) => R.xs.forEach((x, i) => {
        const p = EASE.out(clamp((t - 0.05 - ri * 0.12 - i * 0.05) / 0.38)); if (p <= 0) return;
        miniKid(`d4d1.m${ri}_${i}`, x, R.top, R.s, R.hair[i], Z.set + 1 + ri * 0.5, p);
      }));
      if (op < 0.999) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * op).toFixed(3); }
    },
  };

  /* ---------------- Terry's desk: three problem papers (they flip up for "三道题") and his pencil ---------------- */
  const PAPERS = [0, 1, 2].map(i => ({ desk: [DX + 46 + i * 30, DTOP - 1], air: [446 + i * 98, 420], rot0: -6 + i * 5, rot1: -5 + i * 4, up: 5.2 + i * 0.12, n: 5.55 + i * 0.3 }));
  const PDN = 6.95;
  const PN = PAPERS.map((pp, i) => layoutWriting({ text: String(i + 1), x: 0, y: -26, size: 46, t0: pp.n, speed: 2600, anchor: 'middle' }));
  COMP.d4_d1papers = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      PAPERS.forEach((pp, i) => {
        const up = EASE.back(clamp((t - pp.up) / 0.32)), dn = EASE.io(clamp((t - PDN - i * 0.06) / 0.3)), k = up * (1 - dn);
        const c = lerp2(pp.desk, pp.air, k), sy = lerp(0.12, 1, k), sx = lerp(0.8, 1, k), w = 82, h = 104, z = k > 0.02 ? Z.fx : Z.desk + 1 + i * 0.01;
        DL.save(); DL.translate(c[0], c[1] - (h / 2) * sy); DL.rotate(lerp(pp.rot0, pp.rot1, k)); DL.scale(sx, sy);
        stroke('d4d1.pp' + i, [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z, w: 4, fill: C.paper });
        for (let r = 0; r < 4; r++) stroke(`d4d1.pp${i}.l${r}`, [[-w / 2 + 12, -h / 2 + 22 + r * 20], [w / 2 - (r === 3 ? 34 : 12), -h / 2 + 23 + r * 20]], { z: z + 0.05, w: 2.4, boil: 0.6 });
        DL.restore();
        // the red count 1, 2, 3 (only while the papers are up)
        if (k > 0.9) {
          DL.save(); DL.translate(pp.air[0], pp.air[1] - 52 - 70);
          PN[i].strokes.forEach((st, j) => { const q = clamp((t - st.t0) / st.dur); if (q > 0) stroke(`d4d1.pn${i}.${j}`, st.pts, { z: Z.annot, w: 5.5, color: C.red, draw: q, boil: 0.55 }); });
          DL.restore();
        }
      });
    },
    cues: () => PAPERS.flatMap((pp, i) => [[pp.up, 'paper'], [pp.n, 'pen']]).concat([[PDN, 'swish']]),
  };
  /** Terry's pencil, held in his screen-right hand */
  COMP.d4_d1pencil = {
    draw(fx, t, F) {
      const a = F.anchors.terry; if (!a) return;
      const h = a.handR, d = [-0.55, 0.84];
      stroke('d4d1.pen', [[h[0] - d[0] * 16, h[1] - d[1] * 16], [h[0] + d[0] * 18, h[1] + d[1] * 18]], { z: Z.front + 1, w: 6 });
      stroke('d4d1.tip', [[h[0] + d[0] * 18, h[1] + d[1] * 18], [h[0] + d[0] * 25, h[1] + d[1] * 25]], { z: Z.front + 1, w: 2.5 });
    },
  };

  /* ---------------- wall calendar (7 月 9 日) and the wall clock (9:00 → 13:30) ---------------- */
  const CAL = { c: [178, 300], w: 124, h: 142 };
  const CAL9 = layoutWriting({ text: '9', x: CAL.c[0], y: CAL.c[1] - 30, size: 76, t0: 0.75, speed: 2400, anchor: 'middle' });
  COMP.d4_d1cal = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pop = Math.max(0.01, EASE.back(clamp(lt / 0.3)) * (1 - EASE.in(clamp((t - fx.out) / 0.18)))), { c, w, h } = CAL, z = Z.set + 2, k = 'd4d1.cal';
      DL.save(); DL.translate(c[0], c[1]); DL.scale(pop); DL.rotate(-3); DL.translate(-c[0], -c[1]);
      const x0 = c[0] - w / 2, y0 = c[1] - h / 2;
      stroke(k, [[x0, y0], [x0 + w, y0, 1], [x0 + w, y0 + h, 1], [x0, y0 + h, 1], [x0, y0, 1]], { z, w: 4.5, fill: C.paper });
      stroke(k + '.hd', [[x0 + 6, y0 + 40], [x0 + w - 6, y0 + 41]], { z: z + 0.1, w: 3.5, color: C.red });
      [-1, 1].forEach(s => stroke(k + '.ring' + s, ringPts(k + '.ring' + s, c[0] + s * 30, y0, 7, 11, { n: 8, a0: 180, sweep: 300 }), { z: z + 0.2, w: 3 }));
      text(k + '.m', '7 月', c[0], y0 + 21, { size: 30, color: C.red, z: z + 0.2 });
      CAL9.strokes.forEach((st, j) => { const q = clamp((t - st.t0) / st.dur); if (q > 0) stroke(k + '.d' + j, st.pts, { z: z + 0.2, w: 6.5, draw: q, boil: 0.55 }); });
      if (t > 1.0) text(k + '.r', '日', c[0] + 40, c[1] + 45, { size: 26, z: z + 0.2, opacity: clamp((t - 1.0) / 0.15) });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pop'], [0.75, 'pen'], [fx.out, 'whoosh']],
  };
  const CLK = { c: [1440, 300], r: 70, t0: 3.7, s0: 3.95, s1: 5.0 };
  const clkMin = t => 270 * EASE.io(clamp((t - CLK.s0) / (CLK.s1 - CLK.s0)));
  const hourA = m => 270 + m * 0.5, clockPt = (a, rr) => [CLK.c[0] + Math.sin(a * RAD) * rr, CLK.c[1] - Math.cos(a * RAD) * rr];
  COMP.d4_d1clock = {
    draw(fx, t) {
      if (t < CLK.t0 || t >= fx.t1) return;
      const lt = t - CLK.t0, pop = Math.max(0.01, EASE.back(clamp(lt / 0.3))), { r } = CLK, z = Z.set + 2, k = 'd4d1.clk', m = clkMin(t), [cx, cy] = CLK.c;
      DL.save(); DL.translate(cx, cy); DL.scale(pop); DL.translate(-cx, -cy);
      stroke(k + '.nail', [[cx - 22, cy - r - 2], [cx, cy - r - 28, 1], [cx + 22, cy - r - 2]], { z, w: 2.2, color: C.pencil });
      stroke(k + '.o', ringPts(k + '.o', cx, cy, r, r, { n: 14, a0: -110, sweep: 374, rv: 0.02 }), { z, w: 6, fill: C.paper });
      for (let i = 0; i < 12; i++) { const big = i % 3 === 0; stroke(k + '.t' + i, [clockPt(i * 30, r * (big ? 0.64 : 0.72)), clockPt(i * 30, r * 0.82)], { z: z + 0.1, w: big ? 4 : 2.6 }); }
      if (t > CLK.s0 && t < CLK.s1) for (let j = 1; j <= 3; j++) stroke(k + '.bl' + j, [0, 1, 2, 3, 4].map(q => clockPt(m * 6 - j * 14 - q * 5, r * 0.6)), { z: z + 0.15, w: 2.2, color: C.pencil, opacity: 0.8 - j * 0.2, boil: 0.6 });
      stroke(k + '.hh', [CLK.c, clockPt(hourA(m), r * 0.44)], { z: z + 0.2, w: 6.5 });
      stroke(k + '.hm', [CLK.c, clockPt(m * 6, r * 0.68)], { z: z + 0.2, w: 4.5 });
      dot(k + '.cd', CLK.c, 5, C.ink, z + 0.3);
      const sweep = hourA(m) - 270;   // red arc: 9 o'clock round to the hour hand
      if (sweep > 2) {
        const R2 = r + 20, pts = [];
        for (let i = 0; i <= 12; i++) pts.push(clockPt(270 + sweep * i / 12, R2));
        stroke(k + '.arc', pts, { z: Z.annot, w: 5, color: C.red, boil: 0.6 });
        if (t >= CLK.s1) {
          const e = pts[12], b = clockPt(270 + sweep - 9, R2), L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = 17;
          const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
          const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
          stroke(k + '.arcH', [r1, [e[0], e[1], 1], r2], { z: Z.annot, w: 5, color: C.red, boil: 0.6 });
        }
      }
      DL.restore();
    },
    cues: () => [[CLK.t0, 'pop'], [CLK.s0, 'd4_whirr'], [CLK.s0 + 0.35, 'd4_whirr'], [CLK.s0 + 0.7, 'd4_whirr'], [CLK.s1, 'plip']],
  };
  SFX.define('d4_whirr', tone => { tone('triangle', 420, 1300, 0.26, 0.07, [28, 90]); });
  if (270 / 60 !== 4.5) console.error('d4_day1: 9:00 → 13:30 should be 4½ hours');

  /* ---------------- problem 2: a triangle and a 120° turn about one corner (the shared end frame with scene 25) ---------------- */
  const GEO = { c: [1090, 520] };
  const GT = [[-40, -150], [-200, 100], [120, 90]];       // triangle corners (relative to GEO.c); the turn is about the right corner
  const GARC = { r: 112, a0: -94, a1: 26 };                 // 120° clockwise, outside the triangle
  COMP.d4_d1geo = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, p = fx.t0 < 0 ? 1 : EASE.out(clamp(lt / 0.5)), [cx, cy] = GEO.c, z = Z.board, k = fx.id;
      const P = GT.map(([x, y]) => [cx + x, cy + y]);
      stroke(k + '.tri', [P[0], [P[1][0], P[1][1], 1], [P[2][0], P[2][1], 1], [P[0][0], P[0][1], 1]], { z, w: 5.5, draw: p });
      const O = P[2], at = a => [O[0] + Math.cos(a * RAD) * GARC.r, O[1] + Math.sin(a * RAD) * GARC.r];
      const q = fx.t0 < 0 ? 1 : EASE.out(clamp((t - fx.arcT) / 0.45));
      if (q > 0) {
        dot(k + '.p0', at(GARC.a0), 8, C.ink, z + 0.2);
        const n = 10, pts = []; for (let i = 0; i <= n; i++) pts.push(at(lerp(GARC.a0, GARC.a1, i / n)));
        stroke(k + '.arc', pts, { z, w: 4.5, draw: q });
        [0, 1].forEach(j => stroke(k + '.sp' + j, [O, at(j ? GARC.a1 : GARC.a0)], { z: z - 0.1, w: 2.2, color: C.pencil, draw: q, boil: 0.5 }));
        if (q > 0.95) {
          const e = at(GARC.a1), b = at(GARC.a1 - 14), L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = 20;
          const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
          const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
          stroke(k + '.ah', [r1, [e[0], e[1], 1], r2], { z, w: 4.5 });
          dot(k + '.p1', e, 8, C.ink, z + 0.2);
        }
      }
    },
    cues: fx => (fx.t0 >= 0 ? [[fx.t0, 'pen'], [fx.arcT, 'swish']] : []),
  };

  const GEO_LB_AT = [826, 352], GEO_LB_TG = [GEO.c[0] - 118, GEO.c[1] - 40];
  if (Math.abs(GARC.a1 - GARC.a0 - 120) > 1e-9) console.error('d4_day1: the turn should be 120°');

  /* ---------------- “藏着一个巧合”: the three numbers of problem 1 ---------------- */
  const SET = [2, 5, 13].map((n, i) => ({ n, c: [MCX - 290 + i * 290, 470], t0: 8.05 + i * 0.4 }));
  SET.forEach(e => { e.L = layoutWriting({ text: String(e.n), x: e.c[0], y: e.c[1] - 62, size: 124, t0: e.t0 + 0.12, speed: 2400, gap: 0.03, anchor: 'middle' }); });
  COMP.d4_d1set = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      SET.forEach((e, i) => {
        if (t < e.t0) return;
        const k = 'd4d1.set' + i, p = EASE.out(clamp((t - e.t0) / 0.3));
        stroke(k, ringPts(k, e.c[0], e.c[1], 104, 98, { n: 13, a0: -120, sweep: 372, rv: 0.04 }), { z: Z.board, w: 5, draw: p });
        e.L.strokes.forEach((st, j) => { const q = clamp((t - st.t0) / st.dur); if (q > 0) stroke(k + '.n' + j, st.pts, { z: Z.board, w: 7.5, draw: q, boil: 0.55 }); });
      });
    },
    cues: () => SET.flatMap(e => [[e.t0, 'pen'], [e.t0 + 0.12, 'pen']]),
  };

  /* ---------------- poses ---------------- */
  const SITK = { sit: 1, legScale: 1.15, thigh: 0.2, legL: [70, -63], legR: [70, -63] };
  const desk = (dx, dy = -3, bend = 'down') => ({ w: 1, to: 'desk', dx, dy, bend });
  const swing = t => { const s = Math.sin((t - 0.4) * 2 * Math.PI * 1.4); return { ...SITK, legL: [70, -63 + 30 * s], legR: [70, -63 - 30 * s], tilt: 3 * s, ikL: desk(-46), ikR: desk(40) }; };
  const writeT = t => ({ ...SITK, lean: 3, tilt: 7, armScale: 1.2, ikL: desk(-42),
    ikR: { w: 1, to: 'desk', dx: 54 + 12 * Math.sin(t * 9) + 7 * Math.sin(t * 3.1), dy: -4 - 4 * Math.abs(Math.sin(t * 17)), bend: 'down' } });
  Object.assign(POSE, {
    d4_desk: { ...SITK, ikL: desk(-46), ikR: desk(40) },
    d4_deskUp: { ...SITK, lean: -2, tilt: -6, ikL: desk(-46), ikR: desk(40) },
    d4_deskIdea: { ...SITK, lean: -3, tilt: -4, ikL: desk(-48, -6, 'out'), ikR: desk(42, -6, 'out') },
  });

  /** the line Terry is reading right now (for his gaze) */
  const lineAt = t => {
    if (t < W2[0]) return [EQX, LY[0] + 40];
    if (t < W3[0]) return [EQX, LY[1] + 40];
    if (t < ALL_T) return [EQX, LY[2] + 40];
    return [MCX, ALL_Y];
  };

  defineScene({
    id: 'day1', chapter: '第一天', dur: DUR, floor: FL,
    cast: { terry: { ...E4.terry, desk: [DX, DTOP - 3] } },
    tracks: {
      terry: {
        pos: [[0, [DX, SEAT]]],
        pose: [[0, swing], [ROOM_T1, 'd4_desk', 0.2], [ALL_T, 'd4_deskIdea', 0.1, 'back'], [24.4, 'd4_desk', 0.2],
          [31.85, writeT, 0.12], [34.2, 'd4_deskUp', 0.12, 'back'], [38.55, writeT, 0.12], [40.95, 'd4_desk', 0.15]],
        face: [[0, 'neutral'], [3.7, 'surprised', 0.05], [5.45, 'focus', 0.08], [11.1, 'focus'], [ALL_T, 'idea', 0.05], [24.4, 'focus', 0.1],
          [QM_T[0], 'puzzled', 0.08], [NO_T, 'focus', 0.08], [34.2, 'neutral', 0.1], [38.55, 'focus', 0.1]],
        turn: [[0, 0.25], [1.7, 0.2, 0.12], [3.7, 0.45, 0.12], [5.45, 0.3, 0.12], [ROOM_T1, 0.35, 0.15], [31.85, 0.1, 0.15], [34.2, 0.2, 0.12], [38.55, 0.1, 0.15], [40.95, 0.3, 0.15]],
        gaze: [[0, 'viewer'], [0.9, 'cal'], [1.75, 'sheet'], [3.75, 'clock'], [5.45, 'papers'], [ROOM_T1, 'set'], [W1[0], 'line'], [24.4, 'qs'], [NO_T, 'stampNo'],
          [31.85, 'paper'], [34.2, 'cell1'], [38.55, 'paper'], [40.95, 'geo']],
        squash: [[0, 1], [3.7, 1.06, 0.05], [3.76, 1, 0.2, 'back'], [ALL_T, 1.08, 0.05], [ALL_T + 0.06, 1, 0.22, 'back'], [34.2, 1.05, 0.05], [34.26, 1, 0.2, 'back']],
      },
    },
    targets: F => ({
      sheet: SH.at, cal: CAL.c, clock: CLK.c, papers: [544, 420], line: lineAt(F.t), set: [MCX, 470], qs: [EQX - 120, LY[1] + 40], stampNo: NO_AT,
      paper: [DX + 70, DTOP - 6], cell1: [cellX(0), SH.at[1]], geo: [GEO.c[0], GEO.c[1] - 20],
    }),
    set: [
      { type: 'floor' },
      { type: 'chair', x: DX, seat: DTOP + 4 },   // only the back shows: the seat hides behind the desk top, so his legs dangle in the clear
      { type: 'desk', x: DX, top: DTOP, w: DW, open: true },
    ],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2 },
      { type: 'd4_d1room', id: 'd4d1.room', dim: 3.6, t1: ROOM_T1 },
      { type: 'd4_d1cal', id: 'd4d1.cal', t0: 0.35, out: 3.45, t1: 3.65 },   // the date goes as the clock comes
      { type: 'd4_d1clock', id: 'd4d1.clock', t1: ROOM_T1 },
      { type: 'label', id: 'd4d1.lbHours', text: '4½ 小时', at: [1238, 236], rot: -4, t0: 4.95, t1: ROOM_T1, target: clockPt(300, CLK.r + 26), bend: -0.25, gap: 8 },
      { type: 'd4_d1papers', id: 'd4d1.papers', t1: DUR + 1 },
      { type: 'd4_d1pencil', id: 'd4d1.pencil' },
      { type: 'swingMarks', id: 'd4d1.swing', char: 'terry', t0: 0.6, t1: 3.6 },
      // the score sheet: six empty boxes, top of the frame (E4.SHEET); problem 1 and 2 get their 7s
      { type: 'e4_scores', id: 'd4d1.sheet', at: SH.at, cell: CELL, t0: 1.7, scores: [[7, S1_T], [7, S2_T], null, null, null, null] },
      // 第 1 题
      { type: 'label', id: 'd4d1.lbP1', text: '第 1 题', at: [470, 318], rot: -3, t0: 7.4, t1: 10.95, target: [cellX(0) - 8, CELL_BOT + 6], bend: -0.2, gap: 10 },
      { type: 'd4_d1set', id: 'd4d1.set', t1: 10.95 },
      ...MATH,
      { type: 'title', id: 'd4d1.all', text: '全是平方数！', x: MCX, y: ALL_Y, size: ALL_S, t0: ALL_T, t1: MATH_T1 },
      { type: 'band', id: 'd4d1.hi', rect: [MCX - ALL_W / 2, ALL_Y - ALL_S / 2, ALL_W, ALL_S], t0: HI_T, t1: MATH_T1, dur: 0.45, pad: 14 },
      // a new number d
      ...QFX,
      { type: 'd4_d1d', id: 'd4d1.d', t0: D_T, t1: Q_T1 },
      ...QM_T.map((t0, i) => ({ type: 'write', id: 'd4d1.qm' + i, text: '?', x: QX, y: LY[i], size: S, t0, t1: Q_T1, speed: 2600, w: 7, color: 'red', sfx: 'pen', z: Z.annot })),
      { type: 'd4_d1stamp', id: 'd4d1.no', text: '不能', at: NO_AT, size: 92, rot: -7, t0: NO_T, t1: Q_T1 },
      // proved: full marks
      { type: 'write', id: 'd4d1.tick', text: '✓', x: 452, y: 470, size: 118, t0: TICK_T, t1: 38.45, speed: 2600, w: 8, color: 'red', sfx: 'pen', z: Z.annot },
      { type: 'label', id: 'd4d1.lbFull', text: '满分！', at: [470, 318], rot: -4, size: 50, t0: FULL_T, t1: 38.45, target: [cellX(0) - 8, CELL_BOT + 6], bend: -0.2, gap: 10 },
      // problem 2: geometry
      { type: 'd4_d1geo', id: 'd4d1.geo', t0: GEO_T, arcT: GEO_T + 0.6 },
      { type: 'label', id: 'd4d1.lbGeo', text: '几何', at: GEO_LB_AT, rot: -4, size: 50, t0: GEO_LB, t1: DUR + 1, target: GEO_LB_TG, bend: -0.25, gap: 12 },
    ],
    subs: [
      { t0: 0.3, t1: 3.5, text: '7月9日，第一天考试。', say: '七月九日，第一天考试。' },
      { t0: 3.6, t1: 6.6, text: '四个半小时，三道题。' },
      { t0: 7.3, t1: 10.7, text: '第一题里，藏着一个巧合：' },
      { t0: 11.1, t1: 14.1, text: '2×5−1=9，', say: '二乘五减一，等于九；' },
      { t0: 14.2, t1: 17.8, text: '2×13−1=25，', say: '二乘十三减一，等于二十五；' },
      { t0: 17.9, t1: 21.5, text: '5×13−1=64。', say: '五乘十三减一，等于六十四。' },
      { t0: 21.9, t1: 24.1, text: '全是平方数！' },
      { t0: 25.2, t1: 29.9, text: '题目问：换一个数d，还能这么巧吗？', say: '题目问：换一个数 d 进来，还能这么巧吗？' },
      { t0: 30.0, t1: 33.8, text: '答案是：不能。要把它证出来。' },
      { t0: 34.3, t1: 37.9, text: '小陶证出来了：满分，7分！', say: '小陶证出来了：满分，七分！' },
      { t0: 38.6, t1: 42.0, text: '第二题是几何，也是满分。' },
    ],
  });
})();
