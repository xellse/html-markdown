// 第 40 场 · 奇数边：风车切法（odd）
// A  Jasper 弹进来："奇数边也从中间切！"7×7 点阵横竖各一刀（切在正中那一排/一列旁边），四块分开：4×4、4×3、3×4、3×3，
//    红笔描出中间那一排、一列："多一排""多一列"。Jasper 挠头。四块合回去，7×7 缩到左边。
// B  一般图（每边 7 个位置，第 2、6 个画省略号）：上边、左边用短竖线隔出"m | 1 | m"。中心点变红（两张图都变）。
//    7×7 上四片风车依次用红色细线描边，外角标 ①②③④；一般图四片一起描边。7×7 每片标"3 × 4"，一般图旁写"每片 m × (m + 1)"。
// C  外圈：一般图四条外边依次亮红，每条边标"m + 1"和"m"两段。里圈：中心周围四条缝依次亮红，右边红字"长边 m + 1 / = 短边 m + 中心 1 个"
//    "不重叠、不留缝，只空出中心"。
// D  照样拿空：四片里转着对应的 4 个点一起亮，红框连成一组，飞进右边"组"栏；三次以后快进；最后只剩中心点，它晃一下；
//    "零头"栏落下 1 个红点，刷斜线的砖"余1"。
// E  式子 (m + 1 + m) × (m + 1 + m) = 4 × m × (m + 1) + 1（两行）；一般图变成 m = 0：一个红点、四片空虚线框，"m = 0：只剩中心 1 个"；
//    红笔核对"4 × 12 + 1 = 49 ✓"。
// F  两张图缩到左边淡出，式子留着；Jasper 举新牌、旧牌插在旁边（squares 场同样的两块牌、同样的位置）；
//    结论卡②"每个平方 ÷ 4：只余 0 或 1"写出来（黄色荧光笔）；新牌的"猜想"标签撕掉换成"证明了 ✓"、牌上的问号擦掉；钉范围卡"边长是 0 或正整数"。
//    结论卡飞进顶栏卡②；议程条展开，① 打勾；Jasper 说"剩 2、3 的猜想错了"，旧牌被红笔划掉。
// 开场：只有顶栏 + 议程条；结尾：只剩顶栏（卡①②）+ 议程条（① 打勾）。
(() => {
  const FL = N2.FL;

  /* ---------------- the maths, checked on load ---------------- */
  // the windmill for side m + 1 + m: piece ① = rows 0..m−1 × cols 0..m, the other three are ① turned a quarter at a time round the centre (m, m)
  const windmill = m => {
    const n = 2 * m + 1, rot = ([i, j]) => [j, n - 1 - i], P1 = [];
    for (let i = 0; i < m; i++) for (let j = 0; j <= m; j++) P1.push([i, j]);
    const P = [P1]; for (let q = 1; q < 4; q++) P.push(P[q - 1].map(rot));
    return { n, P, rot };
  };
  for (let m = 0; m <= 40; m++) {
    const { n, P } = windmill(m), seen = new Map();
    P.forEach((cells, q) => cells.forEach(([i, j]) => { const k = i + ',' + j; if (seen.has(k)) console.error('o2_odd: windmill pieces overlap at m =', m, k); seen.set(k, q); }));
    if (seen.size !== n * n - 1 || seen.has(m + ',' + m)) console.error('o2_odd: the windmill does not fill the square but the centre at m =', m);
    if (P.some(c => c.length !== m * (m + 1)) || n * n !== 4 * m * (m + 1) + 1) console.error('o2_odd: (m + 1 + m)² ≠ 4 × m × (m + 1) + 1 at m =', m);
    if (m === 0) continue;
    // 外圈: along the top edge, piece ① covers m + 1, piece ② the other m — the same on every edge (quarter turns)
    const top = [...Array(n).keys()].map(j => seen.get('0,' + j));
    if (top.filter(q => q === 0).length !== m + 1 || top.filter(q => q === 1).length !== m) console.error('o2_odd: outer edge m + 1 | m fails at m =', m);
    // 里圈: piece ②'s long side (rows 0..m in column m + 1) faces m cells of ① and the centre (column m)
    const face = [...Array(m + 1).keys()].map(i => (i === m ? 'c' : seen.get(i + ',' + m)));
    if (P[1].filter(([, j]) => j === m + 1).length !== m + 1 || face.filter(q => q === 0).length !== m || face[m] !== 'c') console.error('o2_odd: inner seam m + 1 = m + 1 fails at m =', m);
    // 照样拿空: one cell from each piece per group, all four empty together, the centre left over
    let left = P.map(c => c.length), groups = 0; while (left.every(v => v > 0)) { left = left.map(v => v - 1); groups++; }
    if (left.some(v => v) || groups !== m * (m + 1) || n * n - 4 * groups !== 1) console.error('o2_odd: taking one from each piece does not leave exactly the centre at m =', m);
  }
  if (7 !== 3 + 1 + 3 || 7 !== 4 + 3 || 3 * 4 !== 12 || 4 * 12 + 1 !== 49 || 7 * 7 !== 49 || 49 % 4 !== 1) console.error('o2_odd: 7 × 7 = 4 × 12 + 1');
  if (4 * 4 + 4 * 3 + 3 * 4 + 3 * 3 !== 49 || 4 * 4 === 3 * 3) console.error('o2_odd: the middle cut gives 4×4, 4×3, 3×4, 3×3');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    // A: cut down the middle
    KID: 0.1, S: 0.35, CUT_H: 1.5, CUT_V: 2.05, SPLIT: 2.7, EXTRA: 3.75, EXTRA_L: [4.0, 4.35], SCRATCH: 4.3, EXTRA_OUT: 5.4, JOIN: 5.55,
    S_MOVE: 6.3, KID_MOVE: 6.25, KID_AT: 7.05,
    // B: the windmill
    GEN: 7.2, TOP: [8.2, 8.55, 8.9], LEFT: 9.4, CENTER: 11.0, PIECE: [12.1, 12.5, 12.9, 13.3], GPIECE: 13.8, P34: 14.9, EACH: 15.9, LAB_OUT: 18.05,
    // C: outer ring, inner ring
    OUTER: [18.6, 19.7, 20.8, 21.9], OUTER_OUT: 23.25,
    SEAM: [23.9, 24.5, 25.1, 25.7], INN: [24.1, 25.0, 26.6], CRING: 26.2, INNER_OUT: 28.2,
    // D: take them away the same way
    HEAD: 28.6, GRAB: [28.9, 29.5, 30.05], FAST: 30.5, FAST_DT: 0.13, WIG: 31.45, LEFT1: 31.9, RES: 32.35,
    // E: the equation, m = 0, the check
    EQ1: 32.65, EQ2: 33.5, CHECK: 34.2, M0: 34.5, M0L: 34.65, RES_OUT: 35.0,
    // F: the conclusion
    SHRINK: 35.8, OLD: 35.5, NEW: 35.85, TAG: 36.05, CARD: 36.35, SWAP: 38.0, SCOPE: 38.6, DOCK: 40.3, TICK: 41.3, STRIKE: [42.3, 42.45],
    END: 43.45, KID_OUT: 43.55, KID_GONE: 44.3, DUR: 44.4,
  };

  /* ---------------- layout ---------------- */
  const WM = windmill(3), PIECES = WM.P, rot = WM.rot, rotInv = ([i, j]) => [6 - j, i];
  const pieceOf = new Map(); PIECES.forEach((c, q) => c.forEach(([i, j]) => pieceOf.set(i + ',' + j, q)));
  const bbox = cells => { const is = cells.map(c => c[0]), js = cells.map(c => c[1]); return [Math.min(...is), Math.min(...js), Math.max(...is), Math.max(...js)]; };
  const PB = PIECES.map(bbox);
  // the 7 × 7: centre and spacing move from the middle (part A) to the left
  const SQA = [700, 430, 50], SQB = [220, 400, 40];
  const sqAt = t => evalTrack([[0, SQA], [T.S_MOVE, SQB, 0.6, 'io']], t);
  // the general square: 7 places a side, places 1 and 5 drawn as ellipses
  const GN = { cx: 640, cy: 400, g: 44 }, ELL = new Set([1, 5]);
  const gP = (i, j) => [GN.cx + (j - 3) * GN.g, GN.cy + (i - 3) * GN.g];
  const G0 = GN.cx - 3 * GN.g, G1 = GN.cx + 3 * GN.g, GT = GN.cy - 3 * GN.g, GB = GN.cy + 3 * GN.g;   // outermost dot rows / columns
  // picks, in piece ① coordinates (its drawn dots: rows 0, 2 × columns 0, 2, 3), nearest the centre first
  const PK = [[2, 3], [2, 2], [0, 3], [0, 2], [2, 0], [0, 0]];
  if (PK.some(([i, j]) => ELL.has(i) || ELL.has(j) || pieceOf.get(i + ',' + j) !== 0) || PIECES[0].filter(([i, j]) => !ELL.has(i) && !ELL.has(j)).length !== PK.length) console.error('o2_odd: picks are the drawn dots of piece ①');
  const pickT = k => (k < 3 ? T.GRAB[k] : T.FAST + (k - 3) * T.FAST_DT);
  // result columns, the signs (same places as in squares), the card
  const COLX = 900, COLY = k => 312 + 64 * k, LEFTX = 1110;
  const OB = [1180, 450], NB = [1400, 290], JX = 1480, GRIP = [NB[0], 590];
  const SW = 300, SH = 130, SS = 42, STK = [1, 4, 9, 16, 25];
  if (STK.map(v => v % 4).join() !== '1,0,1,0,1') console.error('o2_odd: sticker remainders');
  const CARD = [680, 330], EQX = 690, EQS = 44, EQY1 = 618, EQY2 = 680;
  const EQ_A = '(m + 1 + m) × (m + 1 + m)', EQ_B = '= 4 × m × (m + 1) + 1';
  const EQ1L = layoutWriting({ text: EQ_A, x: 0, y: 0, size: EQS, t0: T.EQ1, speed: 3600, gap: 0.02, glyphGap: 0.02 });
  if (EQ1L.tEnd > T.EQ2) console.error('o2_odd: equation lines overlap in time', EQ1L.tEnd);
  const CHK = '4 × 12 + 1 = 49 ✓';
  { const m = CHK.match(/\d+/g).map(Number); if (m[0] * m[1] + m[2] !== m[3]) console.error('o2_odd: the check line', CHK); }

  /* ---------------- helpers ---------------- */
  const dotO = (key, p, r, col, z, o = 1) => { if (r <= 0.05 || o <= 0.01) return; dot(key, p, r, col, z); if (o < 1) DL.items[DL.items.length - 1].attrs.opacity = +o.toFixed(3); };
  const dashRect = (key, x0, y0, x1, y1, o = {}) => { const P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; P.forEach((p, i) => N2.dash(`${key}${i}`, p, P[(i + 1) % 4], { step: o.step || 12, on: o.on || 6, w: o.w || 2.6, z: o.z ?? Z.front, color: o.color || C.pencil, opacity: o.opacity })); };
  const W = (id, s, x, y, size, t0, o = {}) => N2.W(id, s, x, y, size, t0, o);
  const pieceBox = (key, P, b, g, pad, d, o = {}) => {   // a piece's red outline round its cell box b = [i0, j0, i1, j1], P(i, j) → point
    const a = P(b[0], b[1]), c = P(b[2], b[3]);
    stroke(key, superPts((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, c[0] - a[0] + 2 * pad, c[1] - a[1] + 2 * pad, 22, 6), { z: Z.annot - 3, w: o.w || 3, color: C.red, closed: true, draw: d, opacity: o.opacity });
  };

  /* ---------------- the 7 × 7 ---------------- */
  COMP.o2_sq = {
    draw(fx, t, F) {
      if (t < T.S) return;
      const k = fx.id, [cx, cy, g] = sqAt(t), lt = t - T.S, R = g * 0.19;
      const sp = 12 * (EASE.out(clamp((t - T.SPLIT) / 0.35)) - EASE.io(clamp((t - T.JOIN) / 0.35)));
      const P = (i, j) => [cx + (j - 3) * g + (sp ? (j <= 3 ? -sp : sp) : 0), cy + (i - 3) * g + (sp ? (i <= 3 ? -sp : sp) : 0)];
      const Q = (i, j) => [cx + (j - 3) * g, cy + (i - 3) * g];   // without the split
      const cen = t >= T.CENTER, cb = cen && t < T.CENTER + 0.4 ? 1 + 0.5 * Math.sin(Math.PI * (t - T.CENTER) / 0.4) : 1;
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
        const a = EASE.back(clamp((lt - i * 0.05) / 0.22)); if (a <= 0) continue;
        const c = i === 3 && j === 3 && cen;
        dot(`${k}.d${i}_${j}`, P(i, j), R * a * (c ? 1.25 * cb : 1), c ? C.red : C.ink, Z.front);
      }
      // part A: the two cuts beside the middle row / column, then they go
      const co = 1 - clamp((t - T.JOIN) / 0.35), L = 3.5 * g + 18;
      if (co > 0) {
        if (t >= T.CUT_H) stroke(k + '.ch', [[cx - L, cy + 0.5 * g], [cx + L, cy + 0.5 * g]], { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.CUT_H) / 0.25)), opacity: co });
        if (t >= T.CUT_V) stroke(k + '.cv', [[cx + 0.5 * g, cy - L], [cx + 0.5 * g, cy + L]], { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.CUT_V) / 0.25)), opacity: co });
      }
      // the extra row and column, in red
      const eo = 1 - clamp((t - T.EXTRA_OUT) / 0.3);
      if (t >= T.EXTRA && eo > 0) {
        const d = EASE.out(clamp((t - T.EXTRA) / 0.4)), pad = g * 0.42, r0 = P(3, 0), r1 = P(3, 6), c0 = P(0, 3), c1 = P(6, 3);
        stroke(k + '.xr', superPts((r0[0] + r1[0]) / 2, r0[1], r1[0] - r0[0] + 2 * pad, 2 * pad, 22, 6), { z: Z.annot - 2, w: 4.5, color: C.red, closed: true, draw: d, opacity: eo });
        stroke(k + '.xc', superPts(c0[0], (c0[1] + c1[1]) / 2, 2 * pad, c1[1] - c0[1] + 2 * pad, 22, 6), { z: Z.annot - 2, w: 4.5, color: C.red, closed: true, draw: clamp(d * 1.3 - 0.3), opacity: eo });
        [['多一排', [r1[0] + pad + 76, r1[1]]], ['多一列', [c1[0], c1[1] + pad + 36]]].forEach(([s, p], q) => {
          const lt2 = t - T.EXTRA_L[q]; if (lt2 > 0) text(`${k}.xl${q}`, s, p[0], p[1], { size: 44, color: C.red, z: Z.annot, anchor: 'middle', scale: lerp(0.5, 1, EASE.back(clamp(lt2 / 0.2))), opacity: eo, halo: 8 });
        });
      }
      // part B: the windmill — red outlines, ①–④ at the outer corners, 3 × 4 in each piece
      PIECES.forEach((cells, q) => {
        if (t < T.PIECE[q]) return;
        pieceBox(`${k}.p${q}`, Q, PB[q], g, g * 0.38, EASE.out(clamp((t - T.PIECE[q]) / 0.35)));
        const corner = [[0, 0], [0, 6], [6, 6], [6, 0]][q], cp = Q(...corner), sx = corner[1] ? 1 : -1, sy = corner[0] ? 1 : -1;
        text(`${k}.pn${q}`, N2.CIRC[q], cp[0] + sx * 0.95 * g, cp[1] + sy * 0.95 * g, { size: 40, color: C.red, z: Z.annot, anchor: 'middle', scale: lerp(0.5, 1, EASE.back(clamp((t - T.PIECE[q] - 0.15) / 0.2))) });
      });
      F.targets[k + '.c'] = [cx, cy];
    },
    cues: () => [[T.S, 'pop'], [T.CUT_H, 'swish'], [T.CUT_V, 'swish'], [T.SPLIT, 'tap'], [T.EXTRA, 'pen'], [T.JOIN, 'tap'], [T.S_MOVE, 'whoosh'], [T.CENTER, 'plip'], ...T.PIECE.map(tt => [tt, 'pen'])],
  };
  // 3 × 4 in each piece of the 7 × 7 (hand-written on a paper patch; the 7 × 7 sits still by then)
  COMP.o2_tag = {
    init(fx) { fx.L = layoutWriting({ text: fx.text, x: 0, y: -fx.size / 2, size: fx.size, t0: 0, speed: 3000, anchor: 'middle', gap: 0.02, glyphGap: 0.02 }); return fx; },
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0) return;
      const k = fx.id, col = fx.color === 'red' ? C.red : C.ink;
      DL.save(); DL.translate(fx.at[0], fx.at[1]);
      if (fx.back) stroke(k + '.bk', superPts(0, 0, fx.L.width + 20, fx.size * 1.25, 20, 6), { z: Z.front + 1, w: 1, fill: C.paper, noStroke: true, closed: true, opacity: clamp(lt / 0.15) });
      fx.L.strokes.forEach((s, i) => { const p = clamp((lt - s.t0) / s.dur); if (p > 0) stroke(`${k}.s${i}`, s.pts, { z: Z.front + 1.2, w: fx.w || 4.5, color: col, draw: p, boil: 0.55 }); });
      DL.restore();
    },
    cues: fx => [[fx.t0, fx.color === 'red' ? 'pen' : 'chalk']],
  };
  const sqP = (i, j) => [SQB[0] + (j - 3) * SQB[2], SQB[1] + (i - 3) * SQB[2]];
  const p34 = PB.map(([i0, j0, i1, j1], q) => { const a = sqP(i0, j0), c = sqP(i1, j1); return { type: 'o2_tag', id: `o2p34${q}`, text: '3 × 4', size: 36, back: true, at: [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], t0: T.P34 + q * 0.12 }; });

  /* ---------------- the general square ---------------- */
  COMP.o2_gen = {
    draw(fx, t, F) {
      if (t < T.GEN) return;
      const k = fx.id, g = GN.g, R = g * 0.19, lt = t - T.GEN;
      const cen = t >= T.CENTER, cb = cen && t < T.CENTER + 0.4 ? 1 + 0.5 * Math.sin(Math.PI * (t - T.CENTER) / 0.4) : 1;
      const ellO = 1 - clamp((t - T.FAST - 0.45) / 0.3);
      let wig = 0; { const v = (t - T.WIG) / 0.6; if (v > 0 && v < 1) wig = Math.sin(v * 4 * Math.PI) * 6 * (1 - v); }
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
        const a = EASE.back(clamp((lt - i * 0.04) / 0.22)); if (a <= 0) continue;
        const p = gP(i, j), key = `${k}.${i}_${j}`;
        if (i === 3 && j === 3) { dot(key, [p[0] + wig, p[1] - Math.abs(wig)], R * a * (cen ? 1.25 * cb : 1), cen ? C.red : C.ink, Z.front); continue; }
        if (ELL.has(i) || ELL.has(j)) {
          if (ellO <= 0.01) continue;
          const dir = ELL.has(i) && ELL.has(j) ? [1, 1] : ELL.has(i) ? [0, 1] : [1, 0];
          [-1, 0, 1].forEach(s => dotO(`${key}.${s + 1}`, [p[0] + dir[0] * s * 9, p[1] + dir[1] * s * 9], 2.7 * a, C.ink, Z.front, ellO));
          continue;
        }
        // which pick takes this dot: turn it back into piece ①
        let c = [i, j]; for (let q = 0; q < pieceOf.get(i + ',' + j); q++) c = rotInv(c);
        const pk = PK.findIndex(([a2, b2]) => a2 === c[0] && b2 === c[1]), tp = pickT(pk);
        if (t >= tp) {
          if (pk >= 3) { const v = 1 - clamp((t - tp) / 0.16); if (v > 0) dot(key, p, R * (1 + 0.3 * (1 - v)) * v, C.red, Z.front); }
          continue;
        }
        dot(key, p, R * a, C.ink, Z.front);
      }
      // the windmill's outlines (no fill: the four patterns only mean remainders); at m = 0 they shrink to four empty dashed boxes
      const po = 1 - clamp((t - T.M0) / 0.3);
      if (t >= T.GPIECE && po > 0) PIECES.forEach((cells, q) => pieceBox(`${k}.p${q}`, gP, PB[q], g, g * 0.36, EASE.out(clamp((t - T.GPIECE) / 0.45)), { opacity: po }));
      if (t >= T.M0) {
        const u = EASE.back(clamp((t - T.M0 - 0.15) / 0.3)), { cx, cy } = GN;
        [[-12, -36, 1], [36, -12, 0], [12, 36, 1], [-36, 12, 0]].forEach(([dx, dy, hz], q) => {
          const hw = (hz ? 22 : 13) * u, hh = (hz ? 13 : 22) * u; if (u > 0.05) dashRect(`${k}.z${q}`, cx + dx - hw, cy + dy - hh, cx + dx + hw, cy + dy + hh, { color: C.red, step: 9, on: 5, w: 2.6, z: Z.annot - 3 });
        });
      }
      // the three hand picks: four dots a quarter turn apart light up, a red box joins them, they fly into the 组 column
      for (let n = 0; n < 3; n++) {
        const tp = T.GRAB[n]; if (t < tp) continue;
        const u = EASE.io(clamp((t - tp - 0.45) / 0.45)), bump = 1 + 0.35 * Math.sin(Math.PI * clamp((t - tp) / 0.3));
        const c0 = [GN.cx, GN.cy], c1 = [COLX, COLY(n)], c = [lerp(c0[0], c1[0], u), lerp(c0[1], c1[1], u) - 60 * Math.sin(Math.PI * u)];
        let cell = PK[n]; const pts = [];
        for (let q = 0; q < 4; q++) { const p = gP(...cell), home = [p[0] - GN.cx, p[1] - GN.cy], icon = [[-9, -9], [9, -9], [9, 9], [-9, 9]][q]; pts.push([c[0] + lerp(home[0], icon[0], u), c[1] + lerp(home[1], icon[1], u)]); cell = rot(cell); }
        pts.forEach((p, q) => dot(`${k}.g${n}.${q}`, p, R * lerp(1, 0.7, u) * bump, C.ink, Z.front + 0.5));
        const d = EASE.out(clamp((t - tp - 0.12) / 0.3)), pad = lerp(14, 9, u);
        // the box through the four (padded outwards from their centre)
        const out = pts.map(p => { const vx = p[0] - c[0], vy = p[1] - c[1], L = Math.hypot(vx, vy) || 1; return [p[0] + vx / L * pad * 1.4, p[1] + vy / L * pad * 1.4, 1]; });
        stroke(`${k}.gb${n}`, [...out, out[0]], { z: Z.annot - 3, w: 3.5, color: C.red, draw: d });
      }
      // the fast ones: a red box flashes through each set of four
      for (let n = 3; n < PK.length; n++) {
        const tp = pickT(n), v = (t - tp) / 0.22; if (v <= 0 || v >= 1) continue;
        let cell = PK[n]; const pts = []; for (let q = 0; q < 4; q++) { const p = gP(...cell); pts.push([p[0], p[1], 1]); cell = rot(cell); }
        stroke(`${k}.fb${n}`, [...pts, pts[0]], { z: Z.annot - 3, w: 3, color: C.red, opacity: 1 - v });
      }
      [0, 1, 2].forEach(q => { const a = EASE.back(clamp((t - T.FAST - 0.15 - q * 0.08) / 0.2)); if (a > 0) dot(`${k}.cm${q}`, [COLX, COLY(3) - 16 + q * 16], 5 * a, C.ink, Z.front); });
      F.targets[k + '.c'] = [GN.cx, GN.cy];
    },
    cues: () => [[T.GEN, 'pop'], [T.CENTER, 'plip'], [T.GPIECE, 'pen'], ...T.GRAB.flatMap(tp => [[tp, 'plip'], [tp + 0.12, 'pen'], [tp + 0.5, 'whoosh']]),
      [T.FAST, 'zip'], [T.FAST + 0.3, 'zip'], [T.WIG, 'boing'], [T.M0, 'swish']],
  };

  // part B: "m | 1 | m" along the top and down the left (ink), short strokes between the three parts
  const mm1m = [
    W('o2tm1', 'm', gP(0, 1)[0], GT - 64, 40, T.TOP[0], { anchor: 'middle' }),
    W('o2t1', '1', gP(0, 3)[0], GT - 64, 40, T.TOP[1], { anchor: 'middle' }),
    W('o2tm2', 'm', gP(0, 5)[0], GT - 64, 40, T.TOP[2], { anchor: 'middle' }),
    W('o2lm1', 'm', G0 - 48, gP(1, 0)[1] - 30, 40, T.LEFT, { anchor: 'middle' }),
    W('o2l1', '1', G0 - 48, gP(3, 0)[1] - 30, 40, T.LEFT + 0.2, { anchor: 'middle' }),
    W('o2lm2', 'm', G0 - 48, gP(5, 0)[1] - 30, 40, T.LEFT + 0.4, { anchor: 'middle' }),
    { type: 'n2_fn', id: 'o2tk', t0: T.TOP[0], cues: [[T.TOP[0], 'pen'], [T.LEFT, 'pen']], fn: (t, lt, k) => {
      const g = GN.g, d = EASE.out(clamp(lt / 0.25)), e = EASE.out(clamp((t - T.LEFT) / 0.25));
      [2.5, 3.5].forEach((v, q) => {
        const x = GN.cx + (v - 3) * g, y = GN.cy + (v - 3) * g;
        stroke(`${k}.t${q}`, [[x, GT - 52], [x, GT - 18]], { z: Z.board, w: 3.5, draw: d });
        if (t >= T.LEFT) stroke(`${k}.l${q}`, [[G0 - 52, y], [G0 - 18, y]], { z: Z.board, w: 3.5, draw: e });
      });
    } },
  ];
  // "每片 m × (m + 1)" beside the general square
  const each = [
    { type: 'title', id: 'o2each', text: '每片', x: G1 + 100, y: GN.cy, size: 40, t0: T.EACH, dur: 0.2 },
    W('o2eachW', 'm × (m + 1)', G1 + 152, GN.cy - 28, 40, T.EACH + 0.25),
  ];

  /* ---------------- C: outer edges and inner seams ---------------- */
  // outer edges, in turn: a red line just outside the edge, a short stroke where the long part (m + 1) meets the short part (m), both labelled
  const OUT_D = 26;
  const EDGES = [
    { a: [G0 - 22, GT - OUT_D], b: [G1 + 22, GT - OUT_D], cut: [GN.cx + 0.5 * GN.g, GT - OUT_D], n: 'v', L: [[(gP(0, 0)[0] + gP(0, 3)[0]) / 2, GT - OUT_D - 46, 'm + 1', 'middle'], [gP(0, 5)[0], GT - OUT_D - 46, 'm', 'middle']] },
    { a: [G1 + OUT_D, GT - 22], b: [G1 + OUT_D, GB + 22], cut: [G1 + OUT_D, GN.cy + 0.5 * GN.g], n: 'h', L: [[G1 + OUT_D + 16, (gP(0, 0)[1] + gP(3, 0)[1]) / 2 - 30, 'm + 1', 'start'], [G1 + OUT_D + 16, gP(5, 0)[1] - 30, 'm', 'start']] },
    { a: [G1 + 22, GB + OUT_D], b: [G0 - 22, GB + OUT_D], cut: [GN.cx - 0.5 * GN.g, GB + OUT_D], n: 'v', L: [[(gP(0, 3)[0] + gP(0, 6)[0]) / 2, GB + OUT_D + 6, 'm + 1', 'middle'], [gP(0, 1)[0], GB + OUT_D + 6, 'm', 'middle']] },
    { a: [G0 - OUT_D, GB + 22], b: [G0 - OUT_D, GT - 22], cut: [G0 - OUT_D, GN.cy - 0.5 * GN.g], n: 'h', L: [[G0 - OUT_D - 16, (gP(3, 0)[1] + gP(6, 0)[1]) / 2 - 30, 'm + 1', 'end'], [G0 - OUT_D - 16, gP(1, 0)[1] - 30, 'm', 'end']] },
  ];
  const outerLabels = EDGES.flatMap((E, e) => E.L.map(([x, y, s, anchor], q) => W(`o2ol${e}${q}`, s, x, y, 40, T.OUTER[e] + 0.3 + q * 0.3, { color: 'red', anchor })));
  const outerLines = { type: 'n2_fn', id: 'o2ol', t0: T.OUTER[0], cues: T.OUTER.map(tt => [tt, 'swish']), fn: (t, lt, k) => EDGES.forEach((E, e) => {
    if (t < T.OUTER[e]) return;
    const d = EASE.out(clamp((t - T.OUTER[e]) / 0.35)), hot = 1 - clamp((t - T.OUTER[e] - 0.9) / 0.3);
    stroke(`${k}.e${e}`, [E.a, E.b], { z: Z.annot - 2, w: 4 + 3 * hot, color: C.red, draw: d });
    if (d >= 1) { const [x, y] = E.cut; stroke(`${k}.c${e}`, E.n === 'v' ? [[x, y - 14], [x, y + 14]] : [[x - 14, y], [x + 14, y]], { z: Z.annot - 2, w: 4, color: C.red }); }
  }) };
  // inner seams: ① | ④ + centre, ② | ① + centre, ③ | ② + centre, ④ | ③ + centre — each the long side of one piece
  const g = GN.g;
  const SEAMS = [
    [[G0 - 22, GN.cy - 0.5 * g], [GN.cx + 22, GN.cy - 0.5 * g]],
    [[GN.cx + 0.5 * g, GT - 22], [GN.cx + 0.5 * g, GN.cy + 22]],
    [[G1 + 22, GN.cy + 0.5 * g], [GN.cx - 22, GN.cy + 0.5 * g]],
    [[GN.cx - 0.5 * g, GB + 22], [GN.cx - 0.5 * g, GN.cy - 22]],
  ];
  // check: each seam is (m + 1) places long, i.e. 4 places for the drawn 7
  SEAMS.forEach(([a, b], q) => { if (Math.abs(dist(a, b) - (4 * g)) > 0.5) console.error('o2_odd: seam', q, 'is not m + 1 places long'); });
  const innerLines = { type: 'n2_fn', id: 'o2in', t0: T.SEAM[0], cues: [...T.SEAM.map(tt => [tt, 'pen']), [T.CRING, 'pen']], fn: (t, lt, k) => {
    SEAMS.forEach(([a, b], q) => { if (t >= T.SEAM[q]) stroke(`${k}.s${q}`, [a, b], { z: Z.annot - 2, w: 6, color: C.red, draw: EASE.out(clamp((t - T.SEAM[q]) / 0.35)) }); });
    if (t >= T.CRING) N2.ring(k + '.c', GN.cx, GN.cy, 20, 20, { draw: EASE.out(clamp((t - T.CRING) / 0.35)), z: Z.annot - 1 });
  } };
  const innerText = [
    { type: 'scribe', id: 'o2i1', text: '长边 m + 1', x: G1 + 60, y: 350, size: 40, color: 'red', t0: T.INN[0], cps: 12, z: Z.annot, sfx: 'pen' },
    { type: 'scribe', id: 'o2i2', text: '= 短边 m + 中心 1 个', x: G1 + 60, y: 412, size: 40, color: 'red', t0: T.INN[1], cps: 12, z: Z.annot, sfx: 'pen' },
    { type: 'scribe', id: 'o2i3', text: '不重叠、不留缝，只空出中心', x: G1 + 60, y: 490, size: 36, color: 'red', t0: T.INN[2], cps: 12, z: Z.annot, sfx: 'pen' },
  ];

  /* ---------------- D: 组 | 零头 ---------------- */
  const result = { type: 'n2_fn', id: 'o2res', t0: T.HEAD, cues: [[T.LEFT1, 'hop'], [T.RES, 'stamp']], fn: (t, lt, k) => {
    stroke(k + '.sep', [[(COLX + LEFTX) / 2, 222], [(COLX + LEFTX) / 2, 560]], { z: Z.set, w: 2.5, color: C.pencil, draw: EASE.out(clamp(lt / 0.3)), opacity: 0.8 });
    if (t >= T.LEFT1) {   // one dot drops into 零头: the centre's twin
      const u = EASE.out(clamp((t - T.LEFT1) / 0.3)); dot(k + '.one', [LEFTX, lerp(250, 330, u)], 9 * Math.max(0.01, clamp((t - T.LEFT1) / 0.12)), C.red, Z.front);
    }
    if (t >= T.RES) N2.brick(k + '.b', LEFTX, 450, '余1', 1, { w: 150, h: 76, size: 44, scale: EASE.back(clamp((t - T.RES) / 0.3)) });
  } };

  /* ---------------- F: the two signs (the same drawing as in squares) ---------------- */
  COMP.o2_sign = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.35) : 0; if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, lt = t - fx.t0, u = EASE.back(clamp(lt / 0.3)), z = Z.front;
      const cx = fx.at[0], cy = fx.at[1] + (1 - u) * (fx.plant ? -40 : 40), bot = cy + SH / 2;
      stroke(k + '.pole', [[cx, bot], [cx, fx.plant ? FL : bot + 300]], { z, w: 7, draw: EASE.out(clamp(lt / 0.25)) });
      stroke(k + '.b', N2.box(cx - SW / 2, cy - SH / 2, cx + SW / 2, bot), { z: z + 0.05, w: 5, fill: '#F3E3C3', draw: EASE.out(clamp(lt / 0.3)) });
      const to = clamp(lt * 4 - 0.6);
      fx.lines.forEach((s, i) => {
        const y = cy + (i - 0.5) * 54;
        if (s.endsWith('？')) {
          const pre = s.slice(0, -1), Wd = textWidth(s, SS) * 0.92, xq = cx - Wd / 2 + textWidth(pre, SS) * 0.92;
          text(`${k}.t${i}`, pre, xq, y, { size: SS, z: z + 0.2, anchor: 'end', opacity: to });
          const qo = fx.qErase !== undefined ? 1 - clamp((t - fx.qErase) / 0.3) : 1;
          if (qo > 0.01) text(`${k}.q${i}`, '？', xq, y, { size: SS, z: z + 0.2, anchor: 'start', opacity: to * qo });
        } else text(`${k}.t${i}`, s, cx, y, { size: SS, z: z + 0.2, anchor: 'middle', opacity: to });
      });
      if (fx.sticker !== undefined && t >= fx.sticker) {
        const v = EASE.back(clamp((t - fx.sticker) / 0.3)), m0 = DL.items.length;
        DL.save(); DL.translate(cx, bot + 125); DL.rotate(-3); DL.scale(Math.max(0.01, v));
        stroke(k + '.sk', N2.box(-125, -42, 125, 42), { z: z + 0.3, w: 3, fill: '#FFFFFF' });
        dot(k + '.pin', [0, -36], 7, C.red, z + 0.45);
        [-92, -48, -4, 42, 90].forEach((x, i) => {
          text(`${k}.sn${i}`, String(STK[i]), x, -12, { size: 36, font: CFG.FONT_MIX, z: z + 0.4, anchor: 'middle' });
          stroke(`${k}.sw${i}`, N2.box(x - 15, 12, x + 15, 30), { z: z + 0.35, w: 2, fill: C.paper });
          N2.fill(`${k}.sf${i}`, x - 14, 13, x + 14, 29, STK[i] % 4, { z: z + 0.38, step: 7, w: 1.6 });
        });
        DL.restore(); N2.fadeFrom(m0, clamp(v * 3));
      }
      if (fx.qmark !== undefined && t >= fx.qmark) {
        const qt = t - fx.qmark, v = EASE.back(clamp(qt / 0.3)), sw = 14 * Math.sin(qt * 5) * Math.exp(-qt * 0.9);
        DL.save(); DL.translate(cx + 112, bot); DL.rotate(sw);
        stroke(k + '.qs', [[0, 0], [0, 26 * v]], { z: z + 0.3, w: 2.5, color: C.red });
        text(k + '.qq', '?', 0, 62, { size: 76 * Math.max(0.01, v), font: CFG.FONT_MIX, color: C.red, z: z + 0.4, anchor: 'middle' });
        DL.restore();
      }
      F.targets[k + '.c'] = [cx, cy];
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: fx => [[fx.t0, fx.plant ? 'thud' : 'whip'], ...(fx.sticker !== undefined ? [[fx.sticker, 'paper']] : []), ...(fx.qmark !== undefined ? [[fx.qmark, 'boing']] : [])],
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    o2_ptL: { lean: -2, tilt: -4, armScale: 1.5, armL: [80, 8], armR: [16, 10] },
    o2_chopU: { lean: -3, tilt: -4, armScale: 1.5, armL: [130, 20], armR: [16, 10] },
    o2_chopD: { lean: 2, tilt: -2, armScale: 1.5, armL: [70, 4], armR: [16, 10] },
    o2_hold: { lean: -2, tilt: -4, armScale: 1.5, ikL: { w: 1, to: 'abs', dx: GRIP[0], dy: GRIP[1], bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 28, dy: -6, bend: 'out' } },
  });
  const moveWalk = makeWalk(T.KID_MOVE, T.KID_AT, 5.4), exitWalk = makeWalk(T.KID_OUT, T.KID_GONE, 5.6);

  defineScene({
    id: 'odd', dur: T.DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: T.KID,
        pos: [[0, [1080, FL]], [T.KID_MOVE, [JX, FL], T.KID_AT - T.KID_MOVE, 'lin'], [T.KID_OUT, [1720, FL], T.KID_GONE - T.KID_OUT, 'lin']],
        pose: [[0, 'stand'], [0.6, 'o2_ptL', 0.12, 'back'], [T.CUT_H - 0.25, 'o2_chopU', 0.1], [T.CUT_H, 'o2_chopD', 0.1], [T.CUT_V - 0.25, 'o2_chopU', 0.1], [T.CUT_V, 'o2_chopD', 0.1],
          [T.SPLIT + 0.3, 'stand', 0.15], [T.SCRATCH, 'scratchStand', 0.15, 'back'], [T.JOIN, 'stand', 0.15], [T.KID_MOVE, moveWalk, 0.08],
          [T.SEAM[0], 'thinkStand', 0.15, 'back'], [T.HEAD, 'stand', 0.15], [T.RES + 0.1, 'kidCheer', 0.12, 'back'], [T.RES + 1.2, 'stand', 0.15],
          [T.NEW - 0.15, 'o2_hold', 0.15, 'back'], [T.KID_OUT, exitWalk, 0.08]],
        face: [[0, 'proudGrin'], [T.SPLIT, 'focus', 0.1], [T.EXTRA, 'surprised', 0.08], [T.SCRATCH, 'puzzled', 0.1], [T.GEN, 'focus', 0.1], [T.PIECE[0], 'idea', 0.1],
          [T.OUTER[0], 'focus', 0.1], [T.RES, 'joy', 0.08], [T.EQ1, 'smile', 0.1], [T.CARD, 'focus', 0.1], [T.SWAP, 'joy', 0.08], [T.STRIKE[0] - 0.4, 'laugh', 0.08], [T.KID_OUT, 'smile', 0.1]],
        turn: [[0, -0.4], [T.KID_OUT - 0.05, 0.5, 0.1]],
        gaze: [[0, [700, 430]], [T.CUT_H, [700, 455]], [T.EXTRA, [820, 420]], [T.SCRATCH, 'viewer'], [T.JOIN, [700, 430]], [T.GEN, [640, 400]], [T.PIECE[0], [220, 400]],
          [T.GPIECE, [640, 400]], [T.EACH, [980, 400]], [T.OUTER[0], [640, 240]], [T.OUTER[1], [820, 400]], [T.OUTER[2], [640, 570]], [T.OUTER[3], [470, 400]],
          [T.SEAM[0], [640, 400]], [T.INN[0], [1000, 400]], [T.GRAB[0], [700, 360]], [T.WIG, [640, 400]], [T.LEFT1, [LEFTX, 420]], [T.EQ1, [690, 660]], [T.CHECK, [220, 620]],
          [T.CARD, [CARD[0], CARD[1]]], [T.SWAP, [NB[0] - 110, NB[1] - 70]], [T.DOCK, [868, 118]], [T.STRIKE[0] - 0.3, [OB[0], OB[1]]], [T.KID_OUT, 'viewer']],
      },
    },
    steps: [{ t0: T.KID_MOVE, t1: T.KID_AT, hz: 5.4 }, { t0: T.KID_OUT, t1: T.KID_GONE, hz: 5.6 }],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'odd', dock: [[T.DOCK, 2]], tick: [[T.TICK, 0]] },
      // a short pencil floor under Jasper
      { type: 'n2_fn', id: 'o2fl', t0: 0, fn: (t, lt, k) => { const o = 1 - clamp((t - T.KID_GONE) / 0.1); if (o > 0) stroke(k, [[960, FL], [1300, FL + 2], [1590, FL - 1]], { z: Z.set, w: 2.2, color: C.pencil, draw: EASE.out(clamp(lt / 0.4)), opacity: 0.8 * o }); } },

      // the two pictures (7 × 7 and the general square) with everything on them; they shrink to the left and go
      { type: 'n2_grp', id: 'o2pics', out: T.SHRINK + 0.1, dur: 0.45, xf: [[0, [0, 0, 1]], [T.SHRINK, [40, 120, 0.7], 0.55, 'in']], inner: [
        { type: 'o2_sq', id: 'o2sq' },
        ...p34,
        { type: 'o2_gen', id: 'o2gen' },
        { type: 'n2_grp', id: 'o2mmG', out: T.LAB_OUT, dur: 0.3, inner: [...mm1m, ...each] },
        { type: 'n2_grp', id: 'o2outG', out: T.OUTER_OUT, dur: 0.3, inner: [outerLines, ...outerLabels] },
        { type: 'n2_grp', id: 'o2inG', out: T.INNER_OUT, dur: 0.3, inner: [innerLines, ...innerText] },
        { type: 'n2_grp', id: 'o2m0G', t0: T.M0L, inner: [
          W('o2m0w', 'm = 0', GN.cx - 205, GB + 22, 40, T.M0L),
          { type: 'scribe', id: 'o2m0t', text: '：只剩中心 1 个', x: GN.cx - 205 + writeWidth('m = 0', 40) + 8, y: GB + 42, size: 40, t0: T.M0L + 0.3, cps: 16, z: Z.annot, sfx: 'pen' },
        ] },
        W('o2chk', CHK, SQB[0], 600, 36, T.CHECK, { anchor: 'middle', color: 'red' }),
      ] },

      // 组 | 零头 (part D), gone before the signs come
      { type: 'n2_grp', id: 'o2resG', out: T.RES_OUT, dur: 0.35, inner: [
        { type: 'title', id: 'o2h1', text: '组', x: COLX, y: 250, size: 44, t0: T.HEAD, sfx: 'pop' },
        { type: 'title', id: 'o2h2', text: '零头', x: LEFTX, y: 250, size: 44, t0: T.HEAD + 0.1, sfx: 'plip' },
        result,
      ] },

      // the equation (stays to the end)
      { type: 'n2_grp', id: 'o2eqG', out: T.END + 0.15, dur: 0.35, inner: [
        W('o2eq1', EQ_A, EQX, EQY1, EQS, T.EQ1, { anchor: 'middle', speed: 3600 }),
        W('o2eq2', EQ_B, EQX, EQY2, EQS, T.EQ2, { anchor: 'middle', speed: 3600 }),
      ] },

      // the conclusion card ② and its scope card
      { type: 'n2_bigcard', id: 'o2card', n: 2, at: CARD, w: 580, lines: ['每个平方 ÷ 4：', '只余 0 或 1'], size: 52, t0: T.CARD, dock: T.DOCK },
      { type: 'n2_grp', id: 'o2scG', out: T.DOCK, dur: 0.35, inner: { type: 'prop', kind: 'n1_card', id: 'o2sc', at: [CARD[0] + 40, 488], w: 420, h: 96, size: 36, lines: ['边长是 0 或正整数'], t0: T.SCOPE, drawDur: 0.35, sfxAt: [[T.SCOPE, 'paper']] } },

      // Jasper's two signs from squares: the old one planted (red ?), the new one held up (猜想 → 证明了 ✓)
      { type: 'o2_sign', id: 'o2old', at: OB, plant: true, lines: ['大的会', '剩 2、3？'], t0: T.OLD, sticker: T.OLD + 0.2, qmark: T.OLD + 0.35, t1: T.END },
      { type: 'n2_grp', id: 'o2stG', out: T.END, dur: 0.35, inner: [
        { type: 'strike', id: 'o2st1', rect: [OB[0] - 80, OB[1] - 27 - 24, 160, 48], t0: T.STRIKE[0], dur: 0.25 },
        { type: 'strike', id: 'o2st2', rect: [OB[0] - 104, OB[1] + 27 - 24, 208, 48], t0: T.STRIKE[1], dur: 0.25 },
      ] },
      { type: 'o2_sign', id: 'o2new', at: NB, lines: ['偶 → 余 0，', '奇 → 余 1？'], t0: T.NEW, qErase: T.SWAP, t1: T.END },
      { type: 'n2_tag', id: 'o2tag', at: [NB[0] - SW / 2 + 40, NB[1] - SH / 2 - 4], rot: -6, size: 40, t0: T.TAG, swap: T.SWAP, t1: T.END },
    ],
    subs: [
      {"t0": 0.6, "t1": 6.06, "text": "“奇数边也从中间切！咦，多出一排一列？”", "voice": "kid", "say": "奇数边也从中间切！咦，多出一排一列？"},
      {"t0": 6.36, "t1": 10.4, "text": "换个切法：奇数边是m加1加m，", "say": "换个切法：奇数边是 m 加一加 m，"},
      {"t0": 10.6, "t1": 14.38, "text": "中间留1个点，四周切4片风车，", "say": "中间留一个点，四周切四片风车，"},
      {"t0": 14.58, "t1": 17.95, "text": "每片一边m、一边m+1。", "say": "每片一边 m，一边 m 加一。"},
      {"t0": 18.3, "t1": 23.26, "text": "外圈：长边m+1接短边m，正好一条边；", "say": "外圈：长边 m 加一，接短边 m，正好一条边；"},
      {"t0": 23.46, "t1": 28.3, "text": "里圈：长边m+1，对着短边m加中心1个。", "say": "里圈：长边 m 加一，对着短边 m，加中心一个。"},
      {"t0": 28.55, "t1": 33.22, "text": "4片一样多，照样拿空，中间剩1个：余1。", "say": "四片一样多，照样拿空，中间剩一个：余一。"},
      {"t0": 33.52, "t1": 38.21, "text": "切法不看m：每个平方除以4，只余0或1。", "say": "切法不看 m：每个平方除以四，只余零或一。"},
      {"t0": 38.61, "t1": 43.85, "text": "“大的也只余0或1：剩2、3的猜想错了！”", "voice": "kid", "say": "大的也只余零或一：剩二、三的猜想错了！"},
    ],
  });
})();
