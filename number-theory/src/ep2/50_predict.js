// 第 50 场 · 先预测，再核对（id predict）。B3，前缀 p2_。
// 分镜：ep2-storyboard.md "3:25–4:15 · 先预测，再核对"。同屏三组：左边风车示意（后半场换成"组 | 零头"两栏小表）/ 中间 Jasper 的本子（书桌上那本的放大）/ 右边书桌和 Jasper。
// 开场、结尾都只有顶栏 + 议程条；Jasper 和书桌在本场里出现、在结尾前淡出。
// 数（自己验算，算错 console.error）：37 = 18 + 1 + 18；18 × 19 = 342；37 × 37 = 1369 = 4 × 342 + 1；
// 2026 = 4 × 506 + 2；1369 = 4 × 342 + 1；506 > 342；2 − 1 = 1；2026 − 1369 = 657 = 4 × 164 + 1。
(() => {
  const FL = N2.FL, DUR = 49.5, W = N2.W;

  /* ---------------- the arithmetic (every number on screen comes from here) ---------------- */
  const M = 18, SIDE = M + 1 + M, PIECE = M * (M + 1), SQ = SIDE * SIDE;
  const Y = 2026, YQ = Math.floor(Y / 4), YR = Y % 4;
  const SQQ = Math.floor(SQ / 4), SQR = SQ % 4;
  const D = Y - SQ, DQ = Math.floor(D / 4), DR = D % 4;
  [[SIDE === 37, '37 = 18 + 1 + 18'], [PIECE === 342, '18 × 19 = 342'], [SQ === 37 * 37 && SQ === 1369, '37 × 37 = 1369'],
    [SQ === 4 * PIECE + 1, '37² = 4 片 18 × 19 再加 1'], [SQQ === PIECE && SQR === 1, '1369 ÷ 4 = 342 … 1'],
    [Y === 4 * 506 + 2 && YQ === 506 && YR === 2, '2026 = 4 × 506 + 2'], [YQ > SQQ, '506 > 342'], [YR >= SQR && YR - SQR === 1, '2 − 1 = 1（零头够减）'],
    [D === 657 && D + SQ === Y, '2026 − 1369 = 657'], [D === 4 * 164 + 1 && DQ === 164 && DR === 1, '657 ÷ 4 = 164 … 1'],
    [DR === YR - SQR && DQ === YQ - SQQ, '只看零头：差的零头 = 零头的差']]
    .forEach(([ok, s]) => { if (!ok) console.error('p2 predict: wrong arithmetic: ' + s); });

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    desk: 0.15, kid: 0.25,
    // L1–L3: the windmill of 37
    sq: 0.8, ctr: 1.35, s37: 2.85, tk: [3.45, 4.05, 4.65], pc: [6.95, 7.3, 7.65, 8.0], mul: 8.45, plus1: 9.75, eq: 11.85, pred: 13.45,
    // L4–L5: Jasper's notebook
    page: 16.25, w1a: 16.65, w1b: 18.6, w2a: 19.95, think: 20.95, w2b: 22.3, cheerA: 24.3, arr: 24.0, tk1: 24.75,
    clrA: 26.7,
    // L6–L9: 2026 − 1369
    tbl: 27.3, r1: 27.6, r2: 28.55, stop: 29.75, rg1: 30.95, rg2: 31.55, rgOut: 33.0,
    za: 33.35, cmp: 34.8, flash: 35.7, dim: 36.9, zb: 38.55, band: 39.35, predB: 39.75, stopOut: 40.2,
    v: 40.55, dv: 42.3, tk2: 44.1, cheerB: 44.1, slap: 45.3, proud: 46.2,
    end: 48.85,
  };

  /* ---------------- geometry ---------------- */
  // the windmill of 37 (a sketch: 18 | 1 | 18 drawn as 180 | 40 | 180)
  const MX = 100, MY = 240, A = 180, CC = 40, S = 2 * A + CC;
  const R = (x0, y0, x1, y1) => [MX + x0, MY + y0, MX + x1, MY + y1];
  const PIECES = [R(0, 0, A + CC, A), R(A + CC, 0, S, A + CC), R(A, A + CC, S, S), R(0, A, A, S)];   // ① top, ② right, ③ bottom, ④ left; each 18 × 19
  const CTR = [MX + A + CC / 2, MY + A + CC / 2];
  const NUMXY = [[MX + 28, MY + 28], [MX + S - 28, MY + 28], [MX + S - 28, MY + S - 28], [MX + 28, MY + S - 28]];
  const P3 = PIECES[2], P3C = (P3[0] + P3[2]) / 2;
  // the notebook page (a zoom of the open book on the desk) and the desk
  const PG = { x0: 572, y0: 196, x1: 1110, y1: 560 }, DESK = [1290, 660], NB = [1390, 648];
  const JX = 1505;
  // the "组 | 零头" table
  const TB = { x0: 30, x1: 552, dv: 352, hy: 236, ul: 262, y1: 282, y2: 346, y3: 424, gx: 202, rx: 460, lx: 34, size: 40 };

  /* ---------------- written lines ---------------- */
  const lay = f => { layoutWriting(f); return f; };
  // windmill labels (ink) and the red "+1"
  const A37 = lay(W('p2a37', String(SIDE), MX - 38, CTR[1] - 20, 40, T.s37, { anchor: 'middle' }));
  const A18L = lay(W('p2a18L', String(M), MX + A / 2, 190, 40, T.tk[0], { anchor: 'middle' }));
  const A1 = lay(W('p2a1', '1', MX + A + CC / 2, 190, 40, T.tk[1], { anchor: 'middle' }));
  const A18R = lay(W('p2a18R', String(M), MX + A + CC + A / 2, 190, 40, T.tk[2], { anchor: 'middle' }));
  const AMUL = lay(W('p2aMul', `${M} × ${M + 1}`, P3C, 484, 40, T.mul, { anchor: 'middle' }));
  const AEQ = lay(W('p2aEq', `= ${PIECE}`, P3C, 548, 40, T.eq, { anchor: 'middle' }));
  const APLUS = lay(W('p2aPlus', '+1', CTR[0] + 56, CTR[1] - 62, 36, T.plus1, { color: 'red', anchor: 'middle' }));
  // Jasper's notebook, part 1
  const W1A = lay(W('p2aW1a', `${SIDE} × ${SIDE} = `, PG.x0 + 28, 236, 48, T.w1a, { speed: 2000 }));
  const W1B = lay(W('p2aW1b', String(SQ), W1A.xEnd, 236, 48, T.w1b, { speed: 2200 }));
  const W2A = lay(W('p2aW2a', `${SQ} ÷ 4 = `, PG.x0 + 28, 320, 48, T.w2a, { speed: 2200 }));
  const W2B = lay(W('p2aW2b', `${SQQ} … ${SQR}`, W2A.xEnd, 320, 48, T.w2b, { speed: 3000 }));
  const QX0 = W2B.boxes[0].x, QX1 = W2B.boxes[2].x + W2B.boxes[2].w;           // the quotient 342
  const QUOT = [(QX0 + QX1) / 2, 320 + 24];
  const ATK = lay(W('p2aTk', '✓', QX1 - 14, 374, 44, T.tk1, { color: 'red' }));
  if (W2B.xEnd > PG.x1 - 10) console.error('p2 predict: 1369 ÷ 4 runs off the page', W2B.xEnd);

  // the table
  const tw = (id, s, x, y, t0, o) => lay(W(id, s, x, y, TB.size, t0, o));
  const R1A = tw('p2bR1a', `${Y} =`, TB.lx, TB.y1, T.r1);
  const G1 = tw('p2bG1', String(YQ), TB.gx, TB.y1, R1A.tEnd + 0.05);
  const R1R = tw('p2bR1r', String(YR), TB.rx, TB.y1, G1.tEnd + 0.25, { anchor: 'middle' });
  const R2A = tw('p2bR2a', `${SQ} =`, TB.lx, TB.y2, T.r2);
  const G2 = tw('p2bG2', String(SQQ), TB.gx, TB.y2, R2A.tEnd + 0.05);
  const R2R = tw('p2bR2r', String(SQR), TB.rx, TB.y2, G2.tEnd + 0.25, { anchor: 'middle' });
  const ZFULL = writeWidth(`${YR} − ${SQR} = ${YR - SQR}`, TB.size), Z0 = TB.rx - ZFULL / 2;
  const ZA = tw('p2bZa', `${YR} − ${SQR} `, Z0, TB.y3, T.za);
  const ZB = tw('p2bZb', `= ${YR - SQR}`, ZA.xEnd, TB.y3, T.zb);
  const GCMP = tw('p2bGcmp', `${YQ} > ${SQQ}`, TB.dv - 14, TB.y3, T.cmp, { anchor: 'end' });
  if (ZB.x + ZB.width > PG.x0 - 12 || GCMP.x < TB.x0) console.error('p2 predict: the table is too wide', ZB.x + ZB.width, GCMP.x);

  // the column subtraction on the notebook (one write per digit, so the places line up), then the check
  const VRX = 900, VP = 40, VS = 52;
  const colNum = (id, str, y, t0) => {
    const out = []; let tt = t0; const ch = [...str];
    // digits sit in fixed place columns (units at the right); a leading minus sits a little further out
    ch.forEach((c, i) => { const col = ch.length - 1 - i + (c === '−' ? 0.35 : 0); const f = lay(W(`${id}${i}`, c, VRX - VP * (col + 0.5), y, VS, tt, { anchor: 'middle', speed: 3400, gap: 0.015, glyphGap: 0.015 })); out.push(f); tt = f.tEnd + 0.01; });
    out.tEnd = tt; return out;
  };
  const VA = colNum('p2bVa', String(Y), 222, T.v);
  const VB = colNum('p2bVb', '−' + SQ, 290, VA.tEnd + 0.05);
  const VLINE = VB.tEnd + 0.03;
  const VC = colNum('p2bVc', String(D), 372, VLINE + 0.2);
  const DV = lay(W('p2bDv', `${D} ÷ 4 = ${DQ} … ${DR}`, PG.x0 + 28, 462, 46, T.dv, { speed: 3400, gap: 0.015, glyphGap: 0.015 }));
  const TK2 = lay(W('p2bTk', '✓', DV.x + DV.width + 14, 456, 48, Math.max(T.tk2, DV.tEnd + 0.05), { color: 'red' }));
  if (TK2.x + TK2.width > PG.x1 - 8) console.error('p2 predict: 657 ÷ 4 ✓ runs off the page', TK2.x + TK2.width);

  /* ---------------- components ---------------- */
  /** fades (to `to`, default 0) every item already drawn this frame whose key starts with one of `keys`: keep these at the end of fx */
  COMP.p2_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = lerp(1, fx.to ?? 0, clamp((t - fx.t0) / (fx.d || 0.35)));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** the 37 windmill sketch: outline, the 18 | 1 | 18 ticks, four red-outlined pieces ①–④ (no fill pattern), the red centre dot */
  COMP.p2_mill = {
    draw(fx, t) {
      if (t < T.sq || t >= T.clrA + 0.4) return;
      const k = fx.id;
      stroke(k + '.sq', N2.box(MX, MY, MX + S, MY + S), { z: Z.board, w: 4.5, draw: EASE.out(clamp((t - T.sq) / 0.5)) });
      [[T.tk[0], MX + A], [T.tk[1], MX + A + CC]].forEach(([tt, x], i) => { if (t >= tt) stroke(`${k}.tk${i}`, [[x, MY - 22], [x, MY + 4]], { z: Z.board, w: 3.5, draw: EASE.out(clamp((t - tt) / 0.2)) }); });
      PIECES.forEach((r, i) => {
        const tt = T.pc[i]; if (t < tt) return;
        const v = clamp((t - tt) / 0.35);
        stroke(`${k}.p${i}`, N2.box(r[0] + 6, r[1] + 6, r[2] - 6, r[3] - 6), { z: Z.annot - 2, w: 3, color: C.red, draw: v });
        text(`${k}.n${i}`, N2.CIRC[i], NUMXY[i][0], NUMXY[i][1], { size: 36, color: C.red, z: Z.annot - 1.5, anchor: 'middle', opacity: clamp(v * 2) });
      });
      if (t >= T.ctr) {
        const pu = (t - T.plus1) / 0.6, pulse = pu > 0 && pu < 1 ? 1 + 0.7 * Math.sin(Math.PI * pu) : 1;
        dot(k + '.c', CTR, 10 * Math.max(0.01, EASE.back(clamp((t - T.ctr) / 0.25))) * pulse, C.red, Z.annot - 1);
      }
    },
    cues: () => [[T.sq, 'pen'], [T.ctr, 'plip'], ...T.pc.map(tt => [tt, 'pen']), [T.plus1, 'boop']],
  };
  /** Jasper's notebook page, zoomed: a sheet with a tail down to the open book on the desk (z 11: under the highlighter) */
  COMP.p2_page = {
    draw(fx, t) {
      if (t < T.page) return;
      const k = fx.id, p = EASE.out(clamp((t - T.page) / 0.35)), { x0, y0, x1, y1 } = PG, tip = [NB[0] - 4, NB[1] - 14];
      stroke(k + '.o', [[x0, y0], [x1, y0, 1], [x1, 462, 1], tip.concat(1), [x1, 524, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z: 11, w: 4.5, fill: C.paper, draw: p });
      stroke(k + '.ear', [[x1 - 30, y0], [x1 - 30, y0 + 30, 1], [x1, y0 + 30]], { z: 11.1, w: 2.5, draw: clamp(p * 2 - 1) });
    },
    cues: () => [[T.page, 'paper']],
  };
  /** the open exercise book on the desk (beside the closed "Jasper" book of n1_desk) */
  COMP.p2_nb = {
    draw(fx, t) {
      if (t < T.desk + 0.3) return;
      const k = fx.id, z = Z.desk + 0.4, p = EASE.out(clamp((t - T.desk - 0.3) / 0.35)), [cx, y] = [NB[0], DESK[1]];
      stroke(k + '.l', [[cx - 52, y], [cx - 46, y - 30, 1], [cx, y - 33, 1], [cx, y, 1], [cx - 52, y, 1]], { z, w: 4, fill: C.paper, draw: p });
      stroke(k + '.r', [[cx, y], [cx, y - 33, 1], [cx + 46, y - 30, 1], [cx + 52, y, 1], [cx, y, 1]], { z, w: 4, fill: C.paper, draw: p });
      for (let i = 0; i < 2; i++) {
        stroke(`${k}.a${i}`, [[cx - 40, y - 22 + i * 9], [cx - 8, y - 23 + i * 9]], { z: z + 0.1, w: 2.2, color: C.pencil, draw: p });
        stroke(`${k}.b${i}`, [[cx + 8, y - 23 + i * 9], [cx + 40, y - 22 + i * 9]], { z: z + 0.1, w: 2.2, color: C.pencil, draw: p });
      }
    },
  };
  /** the "组 | 零头" table: header, underline, divider (its 组 header is keyed p2bG so it greys with the 组 column) */
  COMP.p2_tbl = {
    draw(fx, t) {
      if (t < T.tbl) return;
      const k = fx.id, p = EASE.out(clamp((t - T.tbl) / 0.35));
      stroke(k + '.ul', [[TB.x0, TB.ul], [TB.x1, TB.ul]], { z: Z.board, w: 3, draw: p });
      stroke(k + '.dv', [[TB.dv, TB.hy - 22], [TB.dv, TB.y3 + 50]], { z: Z.board, w: 3, draw: p });
      const o = clamp((t - T.tbl - 0.15) / 0.25);
      text('p2bG.hd', '组', (TB.gx + TB.dv - 20) / 2 + 4, TB.hy, { size: TB.size, z: Z.board, anchor: 'middle', opacity: o });
      text(k + '.lt', '零头', TB.rx, TB.hy, { size: TB.size, z: Z.board, anchor: 'middle', opacity: o });
      // "组" after the group counts
      [[G1, 'p2bG1z'], [G2, 'p2bG2z']].forEach(([g, kk]) => { if (t >= g.tEnd) text(kk, '组', g.x + g.width + 26, g.y + TB.size / 2 + 1, { size: TB.size, z: Z.board, anchor: 'middle', opacity: clamp((t - g.tEnd) / 0.15) }); });
    },
    cues: () => [[T.tbl, 'pen']],
  };
  /** a ruled line (the subtraction line of the column sum) */
  COMP.p2_hline = { draw(fx, t) { if (t < fx.t0) return; stroke(fx.id, [[fx.x0, fx.y], [fx.x1, fx.y + 1]], { z: Z.board, w: 4, draw: EASE.out(clamp((t - fx.t0) / 0.15)) }); }, cues: fx => [[fx.t0, 'chalk']] };
  /** a red arrow drawing on */
  COMP.p2_arrow = { draw(fx, t) { if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return; arrow(fx.id, fx.from, fx.to, { p: EASE.out(clamp((t - fx.t0) / 0.35)), bend: fx.bend ?? 0.15, color: C.red, w: 4.5, head: 22 }); }, cues: fx => [[fx.t0, 'whoosh']] };
  /** the sticky note Jasper slaps on the front of the desk */
  const NOTE = { c: [1300, 716], w: 252, h: 100 };
  COMP.p2_note = {
    draw(fx, t) {
      if (t < T.slap) return;
      const k = fx.id, u = EASE.back(clamp((t - T.slap) / 0.25)), s = lerp(1.35, 1, u);
      DL.save(); DL.translate(NOTE.c[0], NOTE.c[1]); DL.rotate(-3); DL.scale(s);
      const hw = NOTE.w / 2, hh = NOTE.h / 2, o = clamp((t - T.slap) / 0.1);
      stroke(k + '.b', N2.box(-hw, -hh, hw, hh), { z: Z.desk + 1, w: 3.5, fill: '#FFFFFF', opacity: o });
      stroke(k + '.tp', N2.box(-34, -hh - 10, 34, -hh + 10), { z: Z.desk + 1.2, w: 2, color: C.pencil, fill: '#E6E1D6', opacity: 0.9 * o });
      text(k + '.l0', '算完减法，', -hw + 18, -20, { size: 36, z: Z.desk + 1.3, anchor: 'start', opacity: o });
      text(k + '.l1', '用零头查一遍', -hw + 18, 24, { size: 36, z: Z.desk + 1.3, anchor: 'start', opacity: o });
      DL.restore();
    },
    cues: () => [[T.slap + 0.05, 'tap']],
  };

  /* ---------------- Jasper ---------------- */
  Object.assign(POSE, {
    p2_write: { lean: -3, tilt: -2, armScale: 1.6, armR: [12, 10], ikL: { w: 1, to: 'abs', dx: NB[0] + 6, dy: NB[1], bend: 'down' } },
    p2_ptL: { lean: -2, tilt: -5, armScale: 1.5, armL: [100, 8], armR: [16, 10] },
    p2_slap: { lean: -6, tilt: -4, armScale: 1.6, armR: [18, 10], ikL: { w: 1, to: 'abs', dx: NOTE.c[0] + 96, dy: NOTE.c[1] - 6, bend: 'down' } },
  });
  const scrib = t => ({ ...POSE.p2_write, ikL: { w: 1, to: 'abs', dx: NB[0] + 6 + 7 * Math.sin(t * 12), dy: NB[1] + 3 * Math.sin(t * 19), bend: 'down' } });

  defineScene({
    id: 'predict', chapter: '先预测，再核对', dur: DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: T.kid,
        pos: [[0, [JX, FL]]],
        pose: [[0, 'stand'], [T.pred, 'thinkStand', 0.15, 'back'], [T.page + 0.1, scrib, 0.12], [T.think, 'thinkStand', 0.15, 'back'], [T.w2b - 0.1, scrib, 0.12],
          [23.6, 'p2_write', 0.1], [T.cheerA, 'kidCheer', 0.12, 'back'], [25.8, 'stand', 0.2],
          [T.r1, 'p2_write', 0.15], [T.stop, 'stand', 0.08, 'back'], [T.zb - 0.15, 'p2_ptL', 0.12, 'back'], [T.v - 0.1, scrib, 0.12], [T.dv + 1.6, 'p2_write', 0.1],
          [T.cheerB, 'kidCheer', 0.12, 'back'], [T.slap - 0.2, 'p2_slap', 0.15, 'back'], [T.proud, 'akimbo', 0.18]],
        face: [[0, 'smile'], [2.6, 'focus', 0.1], [T.eq, 'idea', 0.08], [T.pred, 'focus', 0.1], [T.think, 'puzzled', 0.1], [T.w2b, 'surprised', 0.06], [22.9, 'grin', 0.08],
          [T.cheerA, 'joy', 0.06], [25.8, 'smile', 0.1], [T.r1, 'focus', 0.1], [T.stop, 'surprised', 0.05], [30.6, 'focus', 0.1], [T.zb - 0.15, 'grin', 0.08],
          [T.v, 'focus', 0.1], [T.cheerB, 'joy', 0.06], [T.slap - 0.2, 'proudGrin', 0.08], [T.proud, 'proud', 0.1]],
        turn: [[0, -0.3], [T.page, -0.4, 0.15], [25.8, -0.25, 0.15], [T.v, -0.4, 0.15], [T.cheerB, -0.2, 0.15]],
        gaze: [[0, 'viewer'], [0.8, 'mill'], [T.tk[0], 'top'], [T.pc[0], 'mill'], [T.mul, 'piece3'], [T.pred, 'pred'], [T.page, 'nb'],
          [T.think, 'page'], [T.w2b, 'nb'], [T.arr, 'piece3'], [T.arr + 0.35, 'quot'], [25.8, 'viewer'],
          [T.tbl, 'table'], [T.stop, 'stop'], [30.7, 'rem'], [T.cmp, 'grp'], [T.zb - 0.15, 'rem'], [T.v, 'nb'], [T.cheerB, 'viewer'], [T.slap - 0.2, 'note'], [T.proud, 'viewer']],
        squash: [[0, 1], [T.cheerA, 1.06, 0.05], [T.cheerA + 0.05, 1, 0.2, 'back'], [T.stop, 0.92, 0.05], [T.stop + 0.05, 1, 0.22, 'back'],
          [T.cheerB, 1.06, 0.05], [T.cheerB + 0.05, 1, 0.2, 'back'], [T.slap, 0.94, 0.05], [T.slap + 0.05, 1, 0.2, 'back']],
      },
    },
    targets: () => ({
      mill: CTR, top: [MX + S / 2, 210], piece3: [P3C, 540], pred: [MX + S / 2, 694], nb: NB, page: [840, 330], quot: QUOT,
      table: [290, 360], stop: [840, 330], rem: [TB.rx, 330], grp: [250, 440], note: NOTE.c,
    }),
    set: [{ type: 'floor', t0: T.desk, t1: T.end + 0.4 }],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'predict', flash: [[T.flash, 1]] },

      // ---- the desk, the open book, the notebook page
      { type: 'n1_desk', id: 'p2desk', at: DESK, t0: T.desk, t1: T.end },
      { type: 'p2_nb', id: 'p2nb' },
      { type: 'p2_page', id: 'p2page' },

      // ---- L1–L3: the windmill of 37 (left)
      { type: 'p2_mill', id: 'p2aMill' },
      ...[A37, A18L, A1, A18R, AMUL, AEQ, APLUS].map(f => ({ ...f, t1: T.clrA + 0.4 })),
      { type: 'scribe', id: 'p2aPred', text: `应该：商 ${PIECE}，余 ${SQ - 4 * PIECE}`, x: MX + S / 2, y: 694, size: 40, cps: 9, color: 'red', anchor: 'middle', t0: T.pred, t1: T.clrA + 0.4 },

      // ---- L4–L5: 37 × 37 = 1369, 1369 ÷ 4 = 342 … 1, the red arrow from the piece's 342 to the quotient, ✓
      ...[W1A, W1B, W2A, W2B, ATK].map(f => ({ ...f, t1: T.clrA + 0.4 })),
      { type: 'p2_arrow', id: 'p2aArr', from: [AEQ.x + AEQ.width + 10, 548 + 26], to: [QX0 + 12, 320 + 48 + 14], t0: T.arr, t1: T.clrA + 0.4, bend: 0.12 },

      // ---- L6–L8: the "组 | 零头" table (left)
      { type: 'p2_tbl', id: 'p2bTbl' },
      ...[R1A, G1, R1R, R2A, G2, R2R, ZA, ZB, GCMP].map(f => ({ ...f, t1: T.end + 0.4 })),
      { type: 'ring', id: 'p2bRg1', of: 'p2bR1r', glyph: 0, t0: T.rg1, t1: T.rgOut + 0.4 },
      { type: 'ring', id: 'p2bRg2', of: 'p2bR2r', glyph: 0, t0: T.rg2, t1: T.rgOut + 0.4 },
      { type: 'band', id: 'p2bBand', rect: [Z0, TB.y3, ZFULL, TB.size], pad: 6, t0: T.band, dur: 0.45, t1: T.end + 0.4 },
      { type: 'scribe', id: 'p2bPred', text: `预测：余 ${YR - SQR}`, x: TB.rx - 6, y: 510, size: 40, cps: 8, anchor: 'middle', t0: T.predB, t1: T.end + 0.4 },
      // "先别算！" (red, on the empty page) until Jasper starts the sum
      N2.F(T.stopOut, { type: 'title', id: 'p2bStop', text: '先别算！', x: 840, y: 330, size: 60, color: 'red', rot: -5, t0: T.stop, sfx: 'boop' }, 0.35),

      // ---- L8: the column sum 2026 − 1369 = 657, then 657 ÷ 4 = 164 … 1 ✓
      ...VA, ...VB, { type: 'p2_hline', id: 'p2bVl', x0: VRX - VP * 5 - 8, x1: VRX + 8, y: 358, t0: VLINE }, ...VC,
      DV, TK2,

      // ---- L9: the sticky note on the desk
      { type: 'p2_note', id: 'p2note' },

      // eased exits and the grey 组 column (must stay last: they fade what was drawn before them)
      { type: 'p2_fade', t0: T.clrA, keys: ['p2a'] },
      { type: 'p2_fade', t0: T.rgOut, keys: ['p2bRg'] },
      { type: 'p2_fade', t0: T.dim, d: 0.4, to: 0.3, keys: ['p2bG'] },
      { type: 'p2_fade', t0: T.end, keys: ['p2b', 'p2page', 'p2nb', 'p2note', 'kid.', 'floor'] },
    ].map(f => (f.type === 'write' && f.t1 === undefined ? { ...f, t1: T.end + 0.4 } : f)),
    sfx: [[T.kid, 'pop'], [T.stop, 'hop']],
    subs: [
      {"t0": 0.7, "t1": 5.34, "text": "风车还能先报商：37是18加1加18，", "say": "风车还能先报商：三十七是十八加一加十八，"},
      {"t0": 5.54, "t1": 10.62, "text": "所以37的平方是4片18×19，再加1；", "say": "所以三十七的平方，是四片十八乘十九，再加一；"},
      {"t0": 10.82, "t1": 16.19, "text": "18×19是342：应该商342，余1。", "say": "十八乘十九是三百四十二：应该商三百四十二，余一。"},
      {"t0": 16.49, "t1": 21.95, "text": "“37×37是1369，除以4……”", "voice": "kid", "say": "三十七乘三十七是一千三百六十九，除以四……"},
      {"t0": 22.15, "t1": 26.65, "text": "“342余1！连商都对上了！”", "voice": "kid", "say": "三百四十二余一！连商都对上了！"},
      {"t0": 27.15, "t1": 32.9, "text": "2026减1369？先别算：零头2和1。", "say": "两千零二十六减一千三百六十九？先别算：零头二和一。"},
      {"t0": 33.1, "t1": 38.1, "text": "零头够减，整组减整组还是整组：只看零头。"},
      {"t0": 38.4, "t1": 44.53, "text": "“2减1，预测余1！算出657……真余1！”", "voice": "kid", "say": "二减一，预测余一！算出六百五十七……真余一！"},
      {"t0": 44.73, "t1": 48.97, "text": "“以后算完减法，我也用零头查一遍！”", "voice": "kid", "say": "以后算完减法，我也用零头查一遍！"},
    ],
  });
})();
