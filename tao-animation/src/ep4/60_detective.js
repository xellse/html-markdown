// 第 60 场 · 错误侦探：小陶戴上侦探帽、拿起放大镜。黑板上是一道“假设”的例子：1+2+…+20，两头配成对，每对 21；
// “一共 20 对”（错的就是这一步，先不揭晓）→ 20×21=420。小问号举牌：420？太大了吧？一只手拿着橡皮伸过来，被小陶拦住：先别擦！
// 侦探三步：① 承认错了（圈出 420）——上限检查：20 个数、每个最多 20 → 20×20=400，420 > 400，肯定错；
// ② 往回找：放大镜沿着算式一行行往回移，停在“20 对”上（停顿：轮到你了）；
// ③ 改正，再检查：20 个数两个两个配 → 10 对；10×21=210 ✓，210 < 400 ✓。
// 开场：黑板空着，小陶站在右边；结尾：黑板写满，小陶戴着侦探帽举着放大镜欢呼。
(() => {
  const FL = 780, TX = 1330;
  const BD = { x0: 40, y0: 86, x1: 1150, y1: 664 };
  const LX = 100, RCX = 888;                                   // left column (the sum) / right column (the checks)
  const QP = [630, BD.y1 + 12];                                // 小问号 stands on the chalk tray, next to 420

  /* ---------------- the maths, checked ---------------- */
  const N = 20, PAIR = N + 1, NPAIRS = N / 2;
  let SUM = 0; for (let i = 1; i <= N; i++) SUM += i;
  const COLS = Array.from({ length: NPAIRS }, (_, i) => [i + 1, N - i]);   // 1+20, 2+19, …, 10+11
  if (SUM !== 210) console.error('x4_detective: 1+…+20 should be 210', SUM);
  if (N * PAIR !== 420 || N * N !== 400 || NPAIRS * PAIR !== 210 || NPAIRS !== 10) console.error('x4_detective: arithmetic');
  if (COLS.some(([a, b]) => a + b !== PAIR) || COLS.length * 2 !== N || NPAIRS * PAIR !== SUM) console.error('x4_detective: pairs');
  if (!(N * PAIR > N * N) || !(NPAIRS * PAIR < N * N)) console.error('x4_detective: bounds');
  const S = {
    rowA: '1+2+3+…+' + N, d1: `${N}×${PAIR}`, d2: '=' + N * PAIR, e: `${NPAIRS}×${PAIR}=${NPAIRS * PAIR}`,
    max: `${N}×${N}=${N * N}`, gt: `${N * PAIR}>${N * N}`, lt: `${NPAIRS * PAIR}<${N * N}`,
  };
  if (S.d1 + S.d2 !== '20×21=420' || S.e !== '10×21=210' || S.max !== '20×20=400' || S.gt !== '420>400' || S.lt !== '210<400') console.error('x4_detective: board text', S);

  /* ---------------- timing ---------------- */
  const T = {
    HAT0: 2.45, HAT1: 2.78, LENS: 3.35, PEEK1: 5.15, TITLE: 3.75, HYPO: 5.55,
    A: 6.85, B1: 10.85, B2: 12.0, B3: 13.2, U1: 14.3, U2: 14.8, BR: 17.5, C20: 17.75, D1: 18.95, D2: 20.5,
    QIN: 22.5, QSIGN: 23.15, QOUT: 26.55, QEND: 27.25,
    ER0: 26.95, ERHIT: 27.38, EROUT: 28.95, EREND: 29.5, STOP: 27.15, NOERASE: 27.5,
    S1: 29.85, RING: 31.95, CUO: 32.35,
    GRID: 34.35, MAX: 36.45, W400: 38.3, HI: 39.75, GT: 41.0, RING2: 42.1, FADE: 44.25,
    S2: 44.6, FLY0: 44.75, FLY1: 45.2,
    TURN: 49.2, PAUSE: 53.6, TURN1: 54.15,
    L21: 54.3, CK21: 56.2, L20: 57.85, NUM: 58.35, OVAL: 59.25, PAIRS10: 60.35, BACK0: 60.3, BACK1: 60.7,
    RING20: 60.85, STRIKE20: 61.2, TEN: 61.45,
    S3: 62.6, STRIKED: 63.75, E: 67.05, CKE: 68.65, LT: 69.55, CKLT: 70.75, CHEER: 71.05, DUR: 73.2,
  };

  /* ---------------- board layout (handwritten rows) ---------------- */
  const SZ = { A: 60, B: 60, U: 44, C: 60, D: 64 };
  const Y = { A: 112, B: 212, BR21: 284, U: 300, BRL: 358, C: 382, D: 476, E: 572 };
  const lay = fx => layoutWriting({ ...fx });
  const W = (id, text, x, y, size, t0, o = {}) => ({ type: 'write', id, text, x, y, size, t0, speed: 2300, w: 6, ...o });
  const wA = W('x4a', S.rowA, LX, Y.A, SZ.A, T.A, { speed: 2700 });
  const PSTR = ([a, b]) => `(${a}+${b})`;   // (1+20), (2+19): built from COLS so the board can only show true pairs
  const wB1 = W('x4b1', PSTR(COLS[0]), LX, Y.B, SZ.B, T.B1);
  const B1 = lay(wB1);
  const wB2 = W('x4b2', '+' + PSTR(COLS[1]), B1.xEnd, Y.B, SZ.B, T.B2);
  const B2 = lay(wB2);
  const wB3 = W('x4b3', '+…', B2.xEnd, Y.B, SZ.B, T.B3);
  const B3 = lay(wB3);
  const PAIRS = [[B1.boxes[0], B1.boxes[5]], [B2.boxes[1], B2.boxes[6]]].map(([a, b]) => [a.x, b.x + b.w]);
  const BEND = B3.boxes[1].x + B3.boxes[1].w, BMID = (LX + BEND) / 2;
  const w21 = PAIRS.map(([x0, x1], i) => W('x4u' + i, String(PAIR), (x0 + x1) / 2, Y.U, SZ.U, i ? T.U2 + 0.12 : T.U1 + 0.12, { anchor: 'middle', speed: 2400, w: 5.5 }));
  // “20 对” (red, under the long brace): the digits are written, 对 is lettered; later struck and corrected to “→10 对”
  const C20W = writeWidth(String(N), SZ.C), C_X = BMID - (C20W + 8 + SZ.C) / 2;
  const wC20 = W('x4c20', String(N), C_X, Y.C, SZ.C, T.C20, { speed: 2600 });
  const DUI1 = [C_X + C20W + 8 + SZ.C / 2, Y.C + SZ.C / 2];
  const TEN_X = DUI1[0] + SZ.C / 2 + 22;
  const wTen = W('x4ten', '→' + NPAIRS, TEN_X, Y.C, SZ.C, T.TEN, { color: 'red', speed: 2800, w: 6, z: Z.annot, sfx: 'pen' });
  const TEN = lay(wTen), DUI2 = [TEN.x + TEN.width + 8 + SZ.C / 2, DUI1[1]];
  const wD1 = W('x4d1', S.d1, LX, Y.D, SZ.D, T.D1);
  const D1 = lay(wD1);
  const wD2 = W('x4d2', S.d2, D1.xEnd, Y.D, SZ.D, T.D2);
  const D2 = lay(wD2);
  const R420 = (() => { const a = D2.boxes[1], b = D2.boxes[3]; return [a.x, Y.D, b.x + b.w - a.x, SZ.D]; })();
  const DEND = D2.boxes[3].x + D2.boxes[3].w;
  const wE = W('x4e', S.e, LX, Y.E, SZ.D, T.E, { speed: 2200 });
  const E = lay(wE);
  // right column: the upper bound
  const RS = 56, RY = { max: 294, gt: 372, lt: 452 };
  const wMax = W('x4w400', S.max, RCX, RY.max, RS, T.W400, { anchor: 'middle' });
  const wGt = W('x4gt', S.gt, RCX, RY.gt, RS, T.GT, { anchor: 'middle', color: 'red', speed: 2800, w: 5.5, z: Z.annot, sfx: 'pen' });
  const wLt = W('x4lt', S.lt, RCX, RY.lt, RS, T.LT, { anchor: 'middle', color: 'red', speed: 2800, w: 5.5, z: Z.annot, sfx: 'pen' });
  const LT = lay(wLt);
  const CK = (id, x, y, size, t0) => ({ type: 'write', id, text: '✓', x, y, size, t0, speed: 1700, color: 'red', w: 6, sfx: 'pen', z: Z.annot });

  /* ---------------- the blackboard (no eraser on the tray: the eraser comes later, held by a hand) ---------------- */
  SETDRAW.x4_board = (s, p) => {
    const { x0, y0, x1, y1 } = BD, z = Z.set;
    const rect = (k, a, b, c, d, i, w) => stroke(k, [[a, b], [c, b, 1], [c, d, 1], [a, d, 1], [a, b - 2]], { z, w, draw: stag(p, i, 3) });
    rect('x4bd.o', x0, y0, x1, y1, 0, 6);
    rect('x4bd.i', x0 + 14, y0 + 14, x1 - 14, y1 - 14, 1, 3.5);
    stroke('x4bd.tray', [[x0 + 30, y1 + 12], [x1 - 30, y1 + 12]], { z, w: 5, draw: stag(p, 2, 3) });
    for (let i = 0; i < 4; i++) stroke('x4bd.dust' + i, [[x0 + 60 + i * 13, y1 - 30], [x0 + 84 + i * 13, y1 - 58]], { z, w: 1.8, color: C.pencil, opacity: 0.5 * stag(p, 2, 3), boil: 0.5 });
  };

  /** fade any component out over 0.3 s from fx.fadeT (multiplies the opacity of what it draws) */
  COMP.x4_fade = {
    init(fx) { const c = COMP[fx.inner.type]; fx.inner.t1 = fx.fadeT + 0.3; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const n0 = DL.items.length; COMP[fx.inner.type].draw(fx.inner, t, F);
      const f = 1 - clamp((t - fx.fadeT) / 0.3); if (f >= 1) return;
      for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * f).toFixed(3); }
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };

  /* ---------------- curly braces (ink under each pair, red under all of them) ---------------- */
  COMP.x4_brace = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const { x0, x1, y, d } = fx, xm = (x0 + x1) / 2, h = d / 2;
      const pts = [[x0, y], [x0 + 6, y + h * 0.8], [x0 + 16, y + h], [xm - 12, y + h], [xm - 3, y + h * 1.2], [xm, y + d, 1], [xm + 3, y + h * 1.2], [xm + 12, y + h], [x1 - 16, y + h], [x1 - 6, y + h * 0.8], [x1, y]];
      stroke(fx.id, pts, { z: fx.color === 'red' ? Z.annot : Z.board, w: fx.w || 3.5, color: fx.color === 'red' ? C.red : C.ink, draw: EASE.out(clamp((t - fx.t0) / 0.3)), boil: 0.6 });
    },
    cues: fx => [[fx.t0, fx.color === 'red' ? 'pen' : 'chalk']],
  };

  /* ---------------- 20 boxes, 2 rows × 10 columns: first the upper bound, later the pairs ---------------- */
  const G = { x0: RCX - 230, y0: 150, cell: 46 }, GC = c => G.x0 + (c + 0.5) * G.cell;
  COMP.x4_grid = {
    draw(fx, t) {
      if (t < T.GRID) return;
      const z = Z.board, c = G.cell, fadeMax = 1 - clamp((t - T.FADE) / 0.3);
      for (let i = 0; i < N; i++) {
        const col = i % 10, row = Math.floor(i / 10), x = G.x0 + col * c, y = G.y0 + row * c;
        const p = EASE.out(clamp((t - T.GRID - i * 0.025) / 0.15)); if (p <= 0) continue;
        stroke('x4g.b' + i, [[x, y], [x + c, y, 1], [x + c, y + c, 1], [x, y + c, 1], [x, y, 1]], { z, w: 3.5, draw: p, boil: 0.6 });
        // “at most 20” in every box (pencil), until step 2
        const m = clamp((t - T.MAX - i * 0.03) / 0.1) * fadeMax;
        if (m > 0) text('x4g.m' + i, String(N), x + c / 2, y + c / 2 + 1, { size: 30, font: CFG.FONT_MIX, color: C.pencil, opacity: m, z: z + 0.1 });
        // the real numbers: top row 1…10, bottom row 20…11 — every column is one pair
        const v = row === 0 ? COLS[col][0] : COLS[col][1], q = clamp((t - T.NUM - col * 0.07) / 0.1);
        if (q > 0) text('x4g.n' + i, String(v), x + c / 2, y + c / 2 + 1, { size: 32, font: CFG.FONT_MIX, opacity: q, z: z + 0.1, scale: lerp(1.4, 1, EASE.out(q)) });
      }
      COLS.forEach((_, col) => {
        const p = EASE.out(clamp((t - T.OVAL - col * 0.1) / 0.15)); if (p <= 0) return;
        stroke('x4g.o' + col, superPts(GC(col), G.y0 + c, c - 6, 2 * c + 16, 18, 3), { z: Z.annot, w: 3.8, color: C.red, closed: true, draw: p });
      });
      const lab = (k, s, y, t0, op = 1) => {
        const lt = t - t0; if (lt < 0 || op <= 0) return;
        text(k, s, RCX, y, { size: 38, color: C.red, z: Z.annot, opacity: clamp(lt / 0.08) * op, scale: lerp(0.6, 1, EASE.back(clamp(lt / 0.2))), halo: 8 });
      };
      const tidy = 1 - clamp((t - T.E) / 0.3);                     // once 10×21 is written, the grid's labels step back
      lab('x4g.l0', N + ' 个数', 126, T.GRID + 0.15, tidy);
      lab('x4g.l1', '每个最多 ' + N, 270, T.MAX + 0.1, fadeMax);
      lab('x4g.l2', '两个两个配：' + NPAIRS + ' 对', 270, T.PAIRS10, tidy);
    },
    cues: () => [[T.GRID + 0.15, 'pop'], [T.MAX + 0.1, 'pop'], ...COLS.map((_, i) => [T.NUM + i * 0.07, 'tap']), ...COLS.map((_, i) => [T.OVAL + i * 0.1, 'plip']), [T.PAIRS10, 'pop']],
  };

  /* ---------------- 侦探三步 (red, under the 错误侦探 title) ---------------- */
  const STEPS = [['1', '承认错了', T.S1], ['2', '往回找', T.S2], ['3', '改正，再检查', T.S3]];
  COMP.x4_steps = {
    draw(fx, t) {
      STEPS.forEach(([n, s, t0], i) => {
        const lt = t - t0; if (lt < 0) return;
        const y = fx.y + i * fx.dy, k = fx.id + i, pp = EASE.back(clamp(lt / 0.22));
        DL.save(); DL.translate(fx.x + fx.size * 0.56, y); DL.scale(lerp(0.5, 1, pp));
        const rr = fx.size * 0.56;
        stroke(k + '.o', ringPts(k + '.o', 0, 0, rr, rr, { n: 10, a0: -110, sweep: 375, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp(lt / 0.3)) });
        const g = GLYPH[n], gs = fx.size * 0.78;
        g.s.forEach((st, j) => stroke(k + '.n' + j, st.map(([u, v, c]) => [(u - g.w / 2) * gs, (v - 0.5) * gs, c]), { z: Z.annot, w: 4.5, color: C.red, draw: clamp((lt - 0.1) / 0.18), boil: 0.6 }));
        DL.restore();
        text(k + '.t', s, fx.x + fx.size * 1.32, y + 2, { size: fx.size, anchor: 'start', color: C.red, opacity: clamp((lt - 0.12) / 0.12), halo: 8 });
      });
    },
    cues: () => STEPS.map(([, , t0]) => [t0, 'pop']),
  };

  /* ---------------- the detective hat (a deerstalker; the tuft pokes out of the top) ---------------- */
  const HAT = { band: -0.82, rx: 1.04, ry: 0.94, tilt: 7 };
  const headFrame = (a, t, id) => {
    const hx = a.head[0], hy = a.head[1], r = a.r, ha = Math.atan2(a.headTop[0] - hx, -(a.headTop[1] - hy));
    const turn = evalTrack((TRACKS[id] || {}).turn, t) ?? 0;
    return { hx, hy, r, c: Math.cos(ha), s: Math.sin(ha), turn };
  };
  COMP.x4_hat = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const hf = headFrame(a, t, fx.char), k = fx.id, z = Z.front + 1;
      const drop = (1 - EASE.in(clamp((t - fx.t0) / (fx.land - fx.t0)))) * 620;
      const lu = clamp((t - fx.land) / 0.28), sq = t < fx.land ? 1.06 : 1 - 0.2 * Math.sin(Math.PI * lu) * (1 - lu);
      const ct = Math.cos(HAT.tilt * RAD), st = Math.sin(HAT.tilt * RAD), B = HAT.band;
      const P = (u, v) => {
        const du = u + hf.turn * 0.12, dv = (v - B) * sq;
        const u2 = du * ct - dv * st, v2 = B + du * st + dv * ct;
        return [hf.hx + (u2 * hf.c - v2 * hf.s) * hf.r, hf.hy + (u2 * hf.s + v2 * hf.c) * hf.r - drop];
      };
      const domeY = u => B - HAT.ry * Math.sqrt(Math.max(0, 1 - (u / HAT.rx) ** 2));
      // peaks (front and back, drawn left and right), then the crown over them
      [-1, 1].forEach((sd, i) => {
        const pts = [[sd * 0.78, B - 0.08], [sd * 1.16, B - 0.02], [sd * 1.42, B + 0.16], [sd * 1.52, B + 0.36, 1], [sd * 1.22, B + 0.3], [sd * 0.84, B + 0.16]];
        stroke(k + '.pk' + i, pts.map(([u, v, c]) => [...P(u, v), c]), { z, w: 4.2, closed: true, fill: C.paper });
      });
      const dome = [];
      for (let i = 0; i <= 14; i++) { const an = Math.PI + Math.PI * i / 14; dome.push(P(Math.cos(an) * HAT.rx, B + Math.sin(an) * HAT.ry)); }
      stroke(k + '.crown', [[...P(-HAT.rx, B + 0.04), 1], ...dome, [...P(HAT.rx, B + 0.04), 1], [...P(0, B + 0.07)], [...P(-HAT.rx, B + 0.04), 1]], { z: z + 0.1, w: 4.6, fill: C.paper });
      stroke(k + '.band', [P(-HAT.rx * 0.97, B - 0.17), P(0, B - 0.22), P(HAT.rx * 0.97, B - 0.17)], { z: z + 0.2, w: 3.2 });
      // plaid, in pencil
      [-0.48, 0.44].forEach((u, i) => stroke(k + '.pv' + i, [P(u, B - 0.24), P(u * 1.04, (B - 0.24 + domeY(u)) / 2), P(u * 0.96, domeY(u) + 0.08)], { z: z + 0.2, w: 2.2, color: C.pencil, boil: 0.5 }));
      stroke(k + '.ph', [P(-0.9, B - 0.5), P(0, B - 0.6), P(0.9, B - 0.5)], { z: z + 0.2, w: 2.2, color: C.pencil, boil: 0.5 });
      // the ear flaps, tied up: a little bow on the crown, left of the tuft
      const bw = P(-0.42, domeY(-0.42) + 0.12), br = hf.r;
      [-1, 1].forEach((sd, i) => stroke(k + '.bow' + i, [bw, [bw[0] + sd * br * 0.26, bw[1] - br * 0.15], [bw[0] + sd * br * 0.3, bw[1] + br * 0.06], bw], { z: z + 0.3, w: 3, closed: true, fill: C.paper }));
      dot(k + '.knot', bw, br * 0.055, C.ink, z + 0.4);
      // the tuft, popping out of the top once the hat has landed (the real tuft is hidden under the crown)
      if (t >= fx.land) {
        const pop = Math.max(0.01, EASE.back(clamp((t - fx.land - 0.04) / 0.3))), top = B - HAT.ry + 0.03, base = [0.02, top];
        HAIR.tuft(0, 0).forEach((pts, i) => stroke(k + '.tuft' + i, pts.map(([u, v]) => P(base[0] + (u - 0.02) * pop, base[1] + (v + 0.97) * pop)), { z: z + 0.3, w: 5 }));
      }
    },
    cues: fx => [[fx.t0, 'whoosh'], [fx.land, 'tap'], [fx.land + 0.06, 'boing']],
  };

  /* ---------------- the magnifying glass ----------------
   * in Terry's left hand (small); over his left eye for a peek (the eye inside looks huge); then it flies to the board,
   * gets big and moves back along the working; after "10 对" it flies back to his hand. */
  const LN = { Rh: 30, Lh: 42, Re: 40, Rf: 78, Lf: 86 };
  const HANDDIR = [[0, -112]];
  const ROWA_C = [LX + lay(wA).width / 2, Y.A + SZ.A / 2], ROWB_C = [BMID, Y.B + SZ.B / 2];
  const P420 = [R420[0] + R420[2] / 2, Y.D + SZ.D / 2], PD1 = [LX + D1.width / 2, Y.D + SZ.D / 2];
  const P21 = [(PAIRS[0][0] + PAIRS[1][1]) / 2, Y.U + SZ.U / 2], P20 = [(C_X + DUI1[0] + SZ.C / 2) / 2, Y.C + SZ.C / 2];
  const P21a = [(PAIRS[0][0] + PAIRS[0][1]) / 2, Y.U + SZ.U / 2];
  // where the big lens looks: [x, y, handle angle] — the handle is turned so it never lies across the step being looked at
  const FLOAT = [[0, [...P420, 70]], [46.0, [...PD1, 70], 0.35], [46.85, [...P21a, 0], 0.4], [47.7, [...ROWB_C, -40], 0.4], [48.45, [...ROWA_C, -35], 0.4],
    [49.35, [...P20, 0], 0.55], [T.L21, [...P21a, 0], 0.35], [T.L20, [...P20, 0], 0.35]];
  const eyeW = t => clamp((t - T.LENS) / 0.06) * (1 - clamp((t - T.PEEK1) / 0.15));
  const flyW = t => EASE.io(clamp((t - T.FLY0) / (T.FLY1 - T.FLY0))) * (1 - EASE.io(clamp((t - T.BACK0) / (T.BACK1 - T.BACK0))));
  const eyePoint = (a, t) => {
    const hf = headFrame(a, t, 'terry'), u = -0.36 * (1 - 0.12 * Math.abs(hf.turn)) + hf.turn * 0.28, v = -0.1;
    return [hf.hx + (u * hf.c - v * hf.s) * hf.r, hf.hy + (u * hf.s + v * hf.c) * hf.r];
  };
  function lensState(t, F) {
    if (t < T.LENS) return null;
    const a = F.anchors.terry; if (!a) return null;
    const hand = a.handL, ad = evalTrack(HANDDIR, t) * RAD;
    let c = [hand[0] + Math.cos(ad) * (LN.Rh + LN.Lh), hand[1] + Math.sin(ad) * (LN.Rh + LN.Lh)], R = LN.Rh;
    const ew = eyeW(t);
    if (ew > 0) { c = lerp2(c, eyePoint(a, t), ew); R = lerp(R, LN.Re, ew); }
    let hDir = Math.atan2(hand[1] - c[1], hand[0] - c[0]), hLen = Math.max(12, dist(hand, c) - R);
    const fw = flyW(t);
    if (fw > 0) {
      const bob = t < T.PAUSE || t > T.L21 ? Math.sin(t * 3.1) * 3 : 0;
      const p = evalTrack(FLOAT, t);
      c = lerp2(c, [p[0], p[1] + bob], fw); c[1] -= Math.sin(Math.PI * fw) * 70;
      R = lerp(R, LN.Rf, fw); hDir = lerp(hDir, p[2] * RAD, fw); hLen = lerp(hLen, LN.Lf, fw);
    }
    const pop = Math.max(0.01, EASE.back(clamp((t - T.LENS) / 0.25)));
    return { c, R: R * pop, hDir, hLen: hLen * pop, eye: ew, fw, r: a.r };
  }
  COMP.x4_lens = {
    draw(fx, t, F) {
      const st = lensState(t, F); if (!st) return;
      const { c, R, hDir, hLen } = st, k = fx.id, z = st.fw > 0.5 ? Z.annot + 2 : Z.front + 2;
      const ux = Math.cos(hDir), uy = Math.sin(hDir);
      const h0 = [c[0] + ux * R * 0.96, c[1] + uy * R * 0.96], h1 = [c[0] + ux * (R + hLen), c[1] + uy * (R + hLen)];
      const hw = clamp(R * 0.21, 8, 15);
      if (st.eye > 0.5) {   // the peek: a paper lens over his eye, and a huge eye inside it
        stroke(k + '.fill', ringPts(k + '.f', c[0], c[1], R, R, { n: 16, closed: true, rv: 0.01 }), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
        const ex = 0.34 * st.r * 1.5, ey = 0.41 * st.r * 1.5;
        stroke(k + '.eye', ringPts(k + '.e', c[0], c[1] + 2, ex, ey, { n: 12, a0: -100, sweep: 360, rv: 0.04, closed: true }), { z: z + 0.1, w: 4.5, closed: true, fill: C.paper });
        dot(k + '.pupil', [c[0] + 2, c[1] + 8], 0.14 * st.r * 1.6, C.ink, z + 0.15);
      }
      stroke(k + '.h', [h0, h1], { z, w: hw });
      stroke(k + '.h2', [lerp2(h0, h1, 0.22), lerp2(h0, h1, 0.86)], { z: z + 0.1, w: hw * 0.36, color: C.paper, boil: 0 });
      stroke(k + '.o', ringPts(k + '.o', c[0], c[1], R, R, { n: 16, a0: -100, sweep: 368, rv: 0.012 }), { z: z + 0.2, w: clamp(R * 0.09, 4.5, 7) });
      stroke(k + '.i', ringPts(k + '.i', c[0], c[1], R * 0.84, R * 0.84, { n: 14, a0: 60, sweep: 250, rv: 0.015 }), { z: z + 0.2, w: clamp(R * 0.035, 2, 3) });
      stroke(k + '.gl', ringPts(k + '.gl', c[0], c[1], R * 0.6, R * 0.6, { n: 6, a0: 195, sweep: 60 }), { z: z + 0.2, w: clamp(R * 0.06, 2.6, 4.5), color: C.pencil });
      stroke(k + '.gl2', ringPts(k + '.gl2', c[0], c[1], R * 0.6, R * 0.6, { n: 3, a0: 268, sweep: 14 }), { z: z + 0.2, w: clamp(R * 0.06, 2.6, 4.5), color: C.pencil });
    },
    cues: () => [[T.LENS, 'pop'], [T.FLY0, 'whoosh'], [46.0, 'swish'], [46.85, 'swish'], [47.7, 'swish'], [48.45, 'swish'], [49.35, 'swish'],
      [T.L21, 'swish'], [T.L20, 'swish'], [T.BACK0, 'whoosh'], [T.BACK1, 'tap']],
  };

  /* ---------------- a hand with an eraser reaches in from the right — and gets stopped ---------------- */
  const EY = 604, EW = 116, EH = 54, EXL = 1452;   // EXL: where its left face stops (at Terry's hand)
  const ERX = [[0, 1740], [T.ER0, EXL + EW / 2, T.ERHIT - T.ER0, 'out'], [T.EROUT, 1760, T.EREND - T.EROUT, 'in']];
  COMP.x4_eraser = {
    draw(fx, t) {
      if (t < T.ER0 || t >= T.EREND) return;
      const x = evalTrack(ERX, t), k = fx.id, z = Z.front + 3, hit = t - T.ERHIT;
      const sq = hit > 0 && hit < 0.3 ? 1 - 0.2 * Math.sin(Math.PI * hit / 0.3) : 1;
      const jig = hit > 0.3 && t < T.EROUT ? Math.sin(t * 30) * 2 : 0;   // still pushing, a little
      const xl = x - EW / 2 + jig;                                         // left face (the one that touches the hand)
      // the arm, from off stage
      stroke(k + '.arm', [[1680, EY + 64], [lerp(1680, xl + EW * 0.8, 0.5), EY + 30], [xl + EW * 0.8, EY + 6]], { z: z - 0.2, w: 6 });
      DL.save(); DL.translate(xl, EY); DL.scale(sq, 2 - sq); DL.rotate(-4);
      // a school eraser: a rubber block with a rounded, worn end, half in a paper sleeve that says 橡皮
      stroke(k + '.body', [[EW * 0.5, -EH / 2, 1], [10, -EH / 2], [1, -EH / 4], [0, 0], [1, EH / 4], [10, EH / 2], [EW * 0.5, EH / 2, 1]], { z, w: 4.5, fill: C.paper });
      stroke(k + '.sleeve', [[EW * 0.44, -EH / 2 - 5], [EW + 2, -EH / 2 - 5, 1], [EW + 2, EH / 2 + 5, 1], [EW * 0.44, EH / 2 + 5, 1], [EW * 0.44, -EH / 2 - 5, 1]], { z: z + 0.1, w: 4.2, fill: C.paper });
      text(k + '.lbl', '橡皮', EW * 0.73, 1, { size: 27, z: z + 0.2 });
      stroke(k + '.worn', [[7, -EH / 2 + 9], [4, 0], [7, EH / 2 - 9]], { z: z + 0.05, w: 2.2, color: C.pencil });
      DL.restore();
      if (t < T.ERHIT) [-14, 0, 14].forEach((dy, i) => stroke(k + '.sp' + i, [[x + EW / 2 + 16, EY + dy], [x + EW / 2 + 52, EY + dy]], { z, w: 3, opacity: 0.8, boil: 0.8 }));
      if (hit > 0 && hit < 0.45) {
        const o = 1 - hit / 0.45;
        [[-40, -30], [-50, 0], [-40, 30]].forEach(([dx, dy], i) => stroke(k + '.hit' + i, [[xl - 6 + dx * 0.3, EY + dy * 0.5], [xl - 6 + dx * 0.8, EY + dy * 1.1]], { z: Z.fx, w: 3.5, opacity: o }));
      }
    },
    cues: () => [[T.ER0, 'whip'], [T.ERHIT, 'thud'], [T.EROUT, 'whoosh']],
  };

  /* ---------------- Terry ---------------- */
  Object.assign(POSE, {
    x4_peek: { tilt: -3, armScale: 1.45, ikL: { w: 1, to: 'head', dx: -1.22, dy: 0.98, bend: 'down' }, armR: [16, 10] },
    x4_hold: { armScale: 1.45, armL: [102, 38], armR: [16, 10] },
    x4_stop: { lean: 2, armScale: 1.5, armL: [102, 38], ikR: { w: 1, to: 'abs', dx: EXL - 4, dy: EY + 4, bend: 'down' } },
    x4_cheer: { armScale: 1.7, armL: [102, 38], armR: [112, 32] },
  });
  const cheer = t => ({ ...POSE.x4_cheer, hop: -40 * Math.sin(Math.PI * clamp((t - T.CHEER) / 0.42)) });

  defineScene({
    id: 'detective', chapter: '错误侦探', dur: T.DUR, floor: FL,
    cast: { terry: E4.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]]],
        pose: [[0, 'stand'], [0.4, 'thinkStand', 0.15, 'back'], [2.2, 'lookUp', 0.12, 'back'], [T.HAT1, 'stand', 0.1], [T.LENS - 0.05, 'x4_peek', 0.15, 'back'],
          [T.PEEK1, 'x4_hold', 0.15, 'back'], [T.STOP, 'x4_stop', 0.1, 'back'], [T.EROUT + 0.3, 'x4_hold', 0.15],
          [T.FLY0 - 0.05, 'thinkStand', 0.2],
          [T.BACK0 - 0.1, 'x4_hold', 0.18, 'back'], [T.CHEER, cheer, 0.1, 'back']],
        face: [[0, 'neutral'], [0.4, 'focus', 0.08], [2.2, 'surprised', 0.06], [T.HAT1, 'grin', 0.05], [T.LENS, 'proudGrin', 0.05], [T.PEEK1, 'focus', 0.08],
          [T.QSIGN, 'puzzled', 0.06], [T.STOP, 'focus', 0.05], [T.EROUT + 0.3, 'focus', 0.08], [T.RING, 'sheepish', 0.06], [T.GRID, 'focus', 0.08],
          [T.RING2 - 0.1, 'proud', 0.06], [T.S2, 'focus', 0.06], [T.TURN, 'grin', 0.05], [51.6, 'focus', 0.08], [T.CK21, 'smile', 0.05], [T.L20, 'focus', 0.05],
          [T.PAIRS10, 'idea', 0.05], [T.S3, 'focus', 0.08], [T.CKE, 'smile', 0.05], [T.CHEER, 'joy', 0.05]],
        turn: [[0, 0], [T.PEEK1, -0.4, 0.12], [T.QIN, -0.55, 0.12], [T.STOP, 0.35, 0.1], [T.EROUT + 0.3, -0.4, 0.12], [T.TURN, 0, 0.1], [51.6, -0.4, 0.12], [T.CHEER, 0, 0.1]],
        gaze: [[0, 'viewer'], [2.2, 'hat'], [T.HAT1, 'viewer'], [T.PEEK1 + 0.1, 'rowA'], [T.B1, 'rowB'], [T.U1, 'r21'], [T.BR, 'r20'], [T.D1, 'd420'],
          [T.QIN, 'qm'], [T.QOUT, 'd420'], [T.ER0 + 0.1, 'eraser'], [T.EROUT + 0.3, 'd420'], [T.GRID, 'grid'], [T.W400, 'max'], [T.GT, 'gt'], [T.RING2, 'd420'],
          [T.S2, 'steps'], [T.FLY0, 'lens'], [T.TURN, 'viewer'], [51.6, 'lens'], [T.NUM, 'grid'], [T.RING20, 'r20'], [T.S3, 'steps'], [T.STRIKED - 0.1, 'd420'],
          [T.E, 'rowE'], [T.LT, 'lt'], [T.CHEER, 'viewer']],
        squash: [[0, 1], [T.HAT1, 0.9, 0.05], [T.HAT1 + 0.06, 1, 0.22, 'back'], [T.STOP, 1.06, 0.05], [T.STOP + 0.06, 1, 0.2, 'back'],
          [T.PAIRS10 + 0.15, 1.08, 0.05], [T.PAIRS10 + 0.21, 1, 0.2, 'back'], [T.CHEER, 1.1, 0.05], [T.CHEER + 0.06, 1, 0.22, 'back']],
      },
    },
    targets: F => {
      const L = lensState(F.t, F), er = evalTrack(ERX, F.t);
      return {
        hat: [TX, 260], rowA: ROWA_C, rowB: ROWB_C, r21: P21, r20: P20, d420: P420, qm: [QP[0], QP[1] - 120], eraser: [er - EW / 2, EY],
        grid: [RCX, G.y0 + G.cell], max: [RCX, RY.max + RS / 2], gt: [RCX, RY.gt + RS / 2], lt: [RCX, RY.lt + RS / 2], rowE: [LX + E.width / 2, Y.E + SZ.D / 2],
        steps: [1300, 360], lens: L ? L.c : P420,
      };
    },
    set: [{ type: 'floor' }, { type: 'x4_board' }],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2 },
      // L1: the hat drops on, the magnifying glass comes out — 错误侦探
      { type: 'x4_hat', id: 'x4hat', char: 'terry', t0: T.HAT0, land: T.HAT1 },
      { type: 'title', id: 'x4ttl', text: '错误侦探', x: 1335, y: 206, size: 62, t0: T.TITLE, color: 'red', rot: -3, underline: true, sfx: 'stamp' },
      { type: 'title', id: 'x4hyp', text: '（假设的例子）', x: 452, y: 56, size: 46, t0: T.HYPO, color: 'red', rot: -2 },
      // L2–L5: the working, written on the board
      wA, wB1, wB2, wB3,
      { type: 'x4_brace', id: 'x4ub0', x0: PAIRS[0][0] + 4, x1: PAIRS[0][1] - 4, y: Y.BR21, d: 14, t0: T.U1 },
      { type: 'x4_brace', id: 'x4ub1', x0: PAIRS[1][0] + 4, x1: PAIRS[1][1] - 4, y: Y.BR21, d: 14, t0: T.U2 },
      ...w21,
      { type: 'x4_brace', id: 'x4ubR', x0: LX, x1: BEND, y: Y.BRL, d: 18, t0: T.BR, w: 4 },
      wC20,
      { type: 'title', id: 'x4dui1', text: '对', x: DUI1[0], y: DUI1[1], size: SZ.C, t0: T.C20 + 0.3, z: Z.board, dur: 0.15, sfx: 'chalk' },
      wD1, wD2,
      // L6: 小问号
      { type: 'qm', id: 'x4qm', size: 160, signSize: 46, t0: T.QIN, t1: T.QEND, silent: true,
        pos: [[0, t => {
          const hop = (u, p0, p1, hgt) => [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u) - Math.sin(Math.PI * u) * hgt];
          if (t < T.QOUT) return hop(EASE.out(clamp((t - T.QIN) / 0.45)), [790, 930], QP, 150);
          return hop(EASE.in(clamp((t - T.QOUT) / 0.45)), QP, [800, 940], 90);
        }]],
        act: [[0, 'idle'], [T.QSIGN, 'tap'], [T.QOUT, 'idle']], mood: [[0, 'neutral'], [T.QSIGN, 'doubt']],
        sign: [[0, null], [T.QSIGN, '420？太大了吧？'], [T.QOUT, null]], gaze: [[0, 'd420'], [24.8, 'viewer'], [T.QOUT, [-200, 700]]],
        sfxAt: [[T.QIN + 0.02, 'hop'], [T.QIN + 0.42, 'tap'], [T.QSIGN, 'pop'], [T.QOUT, 'hop']] },
      // L7: the eraser is stopped
      { type: 'x4_eraser', id: 'x4er' },
      { type: 'title', id: 'x4nox', text: '先别擦！', x: 1494, y: 488, size: 46, t0: T.NOERASE, t1: T.EREND + 0.1, color: 'red', rot: -5 },
      // the three steps
      { type: 'x4_steps', id: 'x4st', x: 1170, y: 282, dy: 62, size: 48 },
      // L8: step 1 — admit it: ring 420
      { type: 'ringRect', id: 'x4r420', rect: R420, t0: T.RING, pad: 14 },
      { type: 'title', id: 'x4cuo', text: '错了', x: DEND + 70, y: Y.D + SZ.D / 2, size: 44, t0: T.CUO, color: 'red', rot: -4, sfx: 'pen' },
      // L9–L11: the upper bound
      { type: 'x4_grid', id: 'x4g' },
      { type: 'x4_fade', id: 'x4hiF', fadeT: T.FADE, inner: { type: 'highlight', id: 'x4hi', of: 'x4w400', t0: T.HI, dur: 0.4 } },
      wMax, wGt,
      { type: 'ringRect', id: 'x4r420b', rect: R420, t0: T.RING2, pad: 18 },
      // L12–L13: step 2 — the magnifying glass goes back along the working; your turn
      { type: 'title', id: 'x4turn', text: '轮到你了！', x: RCX, y: 568, size: 80, t0: T.TURN, t1: T.TURN1, color: 'red', rot: -3, sfx: 'stamp' },
      // L14–L15: each pair is 21 ✓ — but 20 numbers make only 10 pairs
      CK('x4ck21', PAIRS[1][1] + 26, Y.U - 6, 52, T.CK21),
      { type: 'ringRect', id: 'x4r20', rect: [C_X, Y.C, DUI1[0] + SZ.C / 2 - C_X, SZ.C], t0: T.RING20, pad: 12 },
      { type: 'strike', id: 'x4s20', rect: { write: 'x4c20' }, t0: T.STRIKE20, dur: 0.2 },
      wTen,
      { type: 'band', id: 'x4hi10', rect: [TEN.x, Y.C, DUI2[0] + SZ.C / 2 - TEN.x, SZ.C], t0: T.TEN + 0.65, dur: 0.4, pad: 12 },
      { type: 'title', id: 'x4dui2', text: '对', x: DUI2[0], y: DUI2[1], size: SZ.C, t0: T.TEN + 0.5, color: 'red', dur: 0.15, sfx: 'pen' },
      // L16–L17: step 3 — fix it, check again
      { type: 'strike', id: 'x4sD', rect: [LX, Y.D, DEND - LX, SZ.D], t0: T.STRIKED, dur: 0.3 },
      wE,
      CK('x4ckE', LX + E.width + 30, Y.E - 4, 60, T.CKE),
      wLt,
      CK('x4ckLt', RCX + LT.width / 2 + 22, RY.lt - 6, 56, T.CKLT),
      // the magnifying glass, last so it sits over the working
      { type: 'x4_lens', id: 'x4lens' },
    ],
    sfx: [[T.CHEER, 'tada']],
    pauses: [T.PAUSE],
    subs: [
      { t0: 0.3, t1: 4.9, text: '怎么直视一个错误？我们来当一回侦探。' },
      { t0: 5.4, t1: 9.0, text: '假设小陶算：从1加到20。', say: '假设小陶算：从一加到二十。' },
      { t0: 9.3, t1: 13.9, text: '他把数配成对：1+20，2+19……', say: '他把数配成对：一加二十，二加十九……' },
      { t0: 14.0, t1: 17.0, text: '每一对，都是21。', say: '每一对，都是二十一。' },
      { t0: 17.4, t1: 22.4, text: '一共20对，20×21=420。', say: '一共二十对，二十乘二十一，等于四百二十。' },
      { t0: 23.1, t1: 26.5, text: '“420？好像太大了吧？”', voice: 'qm', say: '四百二十？好像太大了吧？' },
      { t0: 27.2, t1: 29.6, text: '先别急着擦掉！' },
      { t0: 29.7, t1: 33.7, text: '侦探第一步：先承认，这里错了。' },
      { t0: 34.2, t1: 38.0, text: '20个数，每个都不超过20，', say: '二十个数，每个都不超过二十，' },
      { t0: 38.1, t1: 40.7, text: '加起来最多400。', say: '加起来最多四百。' },
      { t0: 40.8, t1: 43.8, text: '420，肯定错了。', say: '四百二十，肯定错了。' },
      { t0: 44.5, t1: 48.7, text: '侦探第二步：往回找，错在哪一步？' },
      { t0: 49.1, t1: 53.5, text: '轮到你了：先暂停想一想，再点继续。' },
      { t0: 54.2, t1: 57.4, text: '每一对是21，没错。', say: '每一对是二十一，没错。' },
      { t0: 57.8, t1: 61.8, text: '可是，20个数，只能配成10对！', say: '可是，二十个数，只能配成十对！' },
      { t0: 62.5, t1: 66.7, text: '侦探第三步：改过来，再检查一遍。' },
      { t0: 67.0, t1: 72.2, text: '10×21=210。比400小，对了！', say: '十乘二十一，等于两百一十。比四百小，对了！' },
    ],
  });
})();
