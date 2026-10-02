// 第 4 集 · 第二天（1986 年 7 月 10 日，第 4–6 题）
// 事实（ep4-script.md）：第二天三道题得 1、0、1，共 2 分；第 5 题全场 210 人里有 57 人满分，他 0 分。
// 演绎：考场画面（墙上的日历翻过一页）；阅卷老师看的是一份“缺了一步”的示意证明——讲 IMO 只认完整证明的规矩，
//   不是他的卷子。他当时的感受没有记录：小陶只用 focus / effort 的表情埋头做题，不演难过。
//   墙上的钟从 9 点走到 1 点半只是示意“一天四个半小时”（开考时间没有记录）。
// 开场 = 第 25 场结尾（成绩单 7、7、3，位置 E4.SHEET，第 1–3 格下的红括号“17”用 e4_scores 的 braces 接过来，考场画面结束前淡出）；
// 结尾只剩成绩单 7、7、3、1、0、1，第 40 场接着演。
(() => {
  const FL = 780, SH = E4.SHEET, SC = 'b4d.sc';
  const DX = 520, DTOP = 610, DW = 340, SEAT = 618;            // Terry's desk (same build as ep3's exam desk)
  /* ---------------- times (scene clock) ---------------- */
  const FLIP = 0.55, UL0 = 1.95, UL1 = 12.55;                   // calendar 9 → 10; red underline under the sheet's "第二天"
  const W4 = 4.6, W5 = 7.5, W6 = 10.4;                          // the three scores, on "1分" / "0分" / "1分"
  const BR0 = 14.0, BR_OUT = 16.2, A_END = 16.45;              // "2" brace (its number is written 0.3 s later, on "两分"); both braces fade; the exam room goes away
  const GRID0 = 16.5, FILL0 = 17.85, FILL_DT = 0.025, LB57 = 19.3, RING5 = 21.65, B_END = 24.6;
  const G_IN = 24.65, LBG = 24.95, TK = [25.95, 26.65], GAP = 27.3, CARET = 28.5, QM = 28.85, MINUS = 29.85, LBM = 30.05;
  const C_END = 31.75, FADE0 = C_END - 0.3, DUR = 31.9;          // the proof and its marks fade out, the grader zips off

  const EXAMPLE = G_IN + 0.5;
  const fadeOut = t => 1 - clamp((t - FADE0) / 0.3);
  SFX.define('b4_none', () => {});
  SFX.define('b4_tick', tone => { tone('sine', 1400, 1100, 0.03, 0.08); });
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];

  /* ---------------- 墙上的撕页日历：9 撕掉，露出 10 ---------------- */
  const CAL = { x: 1255, y: 318, w: 220, h: 262, band: 66 };
  const CAL_9 = layoutWriting({ text: '9', x: 0, y: 0, size: 128, t0: -9, speed: 1, anchor: 'middle' });
  const CAL_10 = layoutWriting({ text: '10', x: 0, y: 0, size: 128, t0: -9, speed: 1, anchor: 'middle' });
  const NUM_Y = CAL.y + CAL.band + (CAL.h - CAL.band) / 2 - 64;  // glyph top so the number sits mid-page
  COMP.b4_cal = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const { x, y, w, h, band } = CAL, z = Z.set + 1, k = 'b4d.cal';
      stroke(k + '.str', [[x - 58, y + 2], [x, y - 44, 1], [x + 58, y + 2]], { z, w: 2.4, color: C.pencil });
      dot(k + '.nail', [x, y - 44], 4.5, C.ink, z);
      stroke(k + '.sh', [[x - w / 2 + 12, y + h + 8], [x + w / 2 + 8, y + h + 8, 1], [x + w / 2 + 8, y + 12]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7, boil: 0.5 });
      stroke(k + '.pg', box(x - w / 2, y, x + w / 2, y + h), { z, w: 5, fill: C.paper });
      stroke(k + '.band', [[x - w / 2, y + band], [x + w / 2, y + band + 1]], { z: z + 0.1, w: 4 });
      text(k + '.m', '7 月', x, y + band / 2 + 2, { size: 46, z: z + 0.2 });
      DL.save(); DL.translate(x, NUM_Y);
      CAL_10.strokes.forEach((s, i) => stroke(k + '.ten' + i, s.pts, { z: z + 0.2, w: 7, boil: 0.5 }));
      DL.restore();
      // yesterday's page: tears off at its top edge, swings, drops and fades
      const u = (t - FLIP) / 0.85;
      if (u < 1) {
        const sw = EASE.out(clamp(u / 0.25)), fall = EASE.in(clamp((u - 0.12) / 0.88));
        const op = 1 - clamp((u - 0.7) / 0.22), z2 = z + 0.5;    // opaque while it still covers the "10", gone before the subtitles
        DL.save();
        DL.translate(x - w / 2 + 40 * fall, y + band + 460 * fall);
        DL.rotate(14 * sw + 40 * fall);                       // hangs from its top-left corner, right side dropping
        stroke(k + '.old', box(0, 0, w, h - band), { z: z2, w: 5, fill: C.paper, opacity: op });
        DL.translate(w / 2, NUM_Y - y - band);
        CAL_9.strokes.forEach((s, i) => stroke(k + '.nine' + i, s.pts, { z: z2 + 0.1, w: 7, boil: 0.5, opacity: op }));
        DL.restore();
      }
      // two binding rings over the top edge
      [-1, 1].forEach(s => stroke(k + '.rg' + s, ringPts(k + '.rg' + s, x + s * 58, y, 11, 16, { n: 8, a0: 100, sweep: 300 }), { z: z + 0.6, w: 4 }));
    },
    cues: () => [[FLIP, 'paper'], [FLIP + 0.15, 'whoosh']],
  };

  /* ---------------- 墙上的钟：每道题一跳，一天四个半小时 ---------------- */
  const CLK = { c: [965, 540], r: 66 };
  const CLK_J = [[3.75, 90], [6.65, 180], [9.55, 270]];        // minutes after the start (4.5 h in all), one jump per problem
  const clkMin = t => { let m = 0; CLK_J.forEach(([tj, v], j) => { if (t >= tj) m = lerp(j ? CLK_J[j - 1][1] : 0, v, EASE.out(clamp((t - tj) / 0.45))); }); return m; };
  const clkPt = (a, rr) => [CLK.c[0] + Math.sin(a * RAD) * rr, CLK.c[1] - Math.cos(a * RAD) * rr];
  COMP.b4_clock = {
    draw(fx, t) {
      if (t >= fx.t1) return;
      const { c, r } = CLK, z = Z.set + 1, k = 'b4d.clk', m = clkMin(t);
      stroke(k + '.nail', [[c[0] - 22, c[1] - r - 2], [c[0], c[1] - r - 28, 1], [c[0] + 22, c[1] - r - 2]], { z, w: 2.2, color: C.pencil });
      stroke(k + '.o', ringPts(k + '.o', c[0], c[1], r, r, { n: 14, a0: -110, sweep: 374, rv: 0.02 }), { z, w: 5.5, fill: C.paper });
      for (let i = 0; i < 12; i++) { const big = i % 3 === 0; stroke(k + '.t' + i, [clkPt(i * 30, r * (big ? 0.64 : 0.72)), clkPt(i * 30, r * 0.84)], { z: z + 0.1, w: big ? 4 : 2.4 }); }
      CLK_J.forEach(([tj, v], j) => {              // pencil motion blur behind the minute hand while it whirls
        const u = (t - tj) / 0.5; if (u <= 0 || u >= 1) return;
        const a1 = m * 6, a0 = a1 - 80;
        [0.46, 0.58].forEach((rr, q) => stroke(k + '.bl' + j + q, [0, 1, 2, 3, 4, 5].map(i => clkPt(lerp(a0, a1, i / 5) - 6, r * rr)), { z: z + 0.15, w: 2.4, color: C.pencil, opacity: 1 - u, boil: 0.6 }));
      });
      stroke(k + '.hh', [c, clkPt(270 + m * 0.5, r * 0.42)], { z: z + 0.2, w: 6 });   // starts at 9 o'clock
      stroke(k + '.hm', [c, clkPt(m * 6, r * 0.66)], { z: z + 0.2, w: 4.2 });
      dot(k + '.cd', c, 4.5, C.ink, z + 0.3);
    },
    cues: () => CLK_J.map(([tj]) => [tj, 'b4_whirr']),
  };
  SFX.define('b4_whirr', tone => { tone('triangle', 420, 1300, 0.22, 0.06, [28, 90]); });

  /* ---------------- 课桌上的三张题纸 + 小陶手里的铅笔 ---------------- */
  COMP.b4_desk = {
    draw(fx, t, F) {
      if (t >= fx.t1) return;
      const z = Z.desk + 1, k = 'b4d.dk';
      // two sheets stacked at the right (seen a little from above), the one he works on in front of him
      stroke(k + '.s2', [[DX + 64, DTOP + 1], [DX + 80, DTOP - 26, 1], [DX + 156, DTOP - 30, 1], [DX + 152, DTOP + 1, 1], [DX + 64, DTOP + 1, 1]], { z, w: 3.6, fill: C.paper });
      stroke(k + '.s3', [[DX + 70, DTOP - 3], [DX + 90, DTOP - 32, 1], [DX + 160, DTOP - 34, 1], [DX + 158, DTOP - 3, 1], [DX + 70, DTOP - 3, 1]], { z: z + 0.05, w: 3.6, fill: C.paper });
      stroke(k + '.s1', [[DX - 112, DTOP + 1], [DX - 92, DTOP - 36, 1], [DX + 58, DTOP - 36, 1], [DX + 70, DTOP + 1, 1], [DX - 112, DTOP + 1, 1]], { z: z + 0.1, w: 4.2, fill: C.paper });
      // a few lines of his working (grow a little as the day goes on)
      const nl = 1 + Math.min(3, Math.floor(t / 4));
      for (let r = 0; r < nl; r++) {
        const yy = DTOP - 28 + r * 7, x0 = DX - 88 + r * 2, len = 70 + rnd(hstr(k), r, 1) * 20, pts = [];
        for (let j = 0; j <= 6; j++) pts.push([x0 + len * j / 6, yy + (j % 2 ? -1.6 : 1.2)]);
        stroke(k + '.w' + r, pts, { z: z + 0.15, w: 1.8, boil: 0.6 });
      }
      const a = F.anchors.terry; if (!a) return;
      const h = a.handR;
      stroke(k + '.pencil', [[h[0] - 5, h[1] + 8], [h[0] + 13, h[1] - 24]], { z: Z.front + 1, w: 4.5 });
    },
  };

  /** a red underline under the sheet's own "第二天" label (centre of boxes 4–6, 90 below the boxes' centre line) */
  COMP.b4_ul = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const c = F.targets[SC + '.s4']; if (!c) return;
      const y = SH.at[1] + SH.cell / 2 + 70;
      stroke('b4d.ul', [[c[0] - 62, y + 2], [c[0], y], [c[0] + 62, y - 3]], { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - fx.t0) / 0.3)) });
    },
    cues: fx => [[fx.t0, 'pen']],
  };

  /* ---------------- 全场 210 人：57 个人满分（涂黑） ---------------- */
  const GR = { cols: 21, rows: 10, cell: 33, cx: 800, top: 334, r: 11.5, n: 57 };
  const GX0 = GR.cx - GR.cols * GR.cell / 2;
  const cellC = i => [GX0 + (i % GR.cols + 0.5) * GR.cell, GR.top + (Math.floor(i / GR.cols) + 0.5) * GR.cell];
  if (GR.cols * GR.rows !== 210) console.error('b4d: the grid must hold 210 contestants');
  COMP.b4_grid = {
    draw(fx, t) {
      if (t < GRID0 || t >= B_END) return;
      const k = 'b4d.g', z = Z.set + 2;
      for (let i = 0; i < GR.cols * GR.rows; i++) {
        const r = Math.floor(i / GR.cols), c = i % GR.cols, a = EASE.back(clamp((t - GRID0 - (r + c) * 0.012) / 0.16));
        if (a <= 0.01) continue;
        const [x, y] = cellC(i), full = i < GR.n && t >= FILL0 + i * FILL_DT;
        stroke(k + i, ringPts(k + i, x, y, GR.r * a, GR.r * a, { n: 8, closed: true, rv: 0.06 }), { z, w: 2.8, closed: true, fill: full ? C.ink : C.paper, boil: 0.6 });
      }
    },
    cues: () => [[GRID0, 'paper'], ...Array.from({ length: 10 }, (_, j) => [FILL0 + j * 6 * FILL_DT, 'tap'])],
  };

  /* ---------------- 阅卷：一份缺了一步的证明 ---------------- */
  const PP = { x0: 500, y0: 324, x1: 1070, y1: 760 };
  const LINES = [{ y: 466, words: [120, 64, 150] }, { y: 528, words: [92, '=', 170] }, { y: 664, words: ['→', 110, 140] }, { y: 724, words: [150, 70, '□'] }];
  const GAP_Y = 596, MARGIN_X = 538, SCORE = [932, 338, 1042, 404];
  const SLOT = [624, GAP_Y - 30, 900, GAP_Y + 30];                // the empty place where a step should be
  COMP.b4_proof = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, fo = fadeOut(t), p = EASE.out(clamp(lt / 0.4)), z = Z.set + 1, k = 'b4d.pf', { x0, y0, x1, y1 } = PP;
      stroke(k, box(x0, y0, x1, y1), { z, w: 5, fill: C.paper, draw: p, opacity: fo });
      stroke(k + '.sh', [[x0 + 14, y1 + 8], [x1 + 8, y1 + 8, 1], [x1 + 8, y0 + 14]], { z: z - 0.1, w: 2.5, color: C.pencil, opacity: 0.7 * p * fo, boil: 0.5 });
      stroke(k + '.mg', [[MARGIN_X + 22, y0 + 100], [MARGIN_X + 22, y1 - 18]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.6 * p * fo, boil: 0.4 });
      if (lt < 0.25) return;
      const q = clamp((lt - 0.25) / 0.2) * fo;
      text(k + '.t', '证明', x0 + 60, y0 + 48, { size: 50, anchor: 'start', z: z + 0.2, opacity: q });
      // not his paper: just an example of how marking works
      const eq = clamp((t - EXAMPLE) / 0.2) * fo;
      if (eq > 0) text(k + '.ex', '（举个例子）', x0 + 172, y0 + 50, { size: 40, anchor: 'start', color: C.red, z: Z.annot, opacity: eq, scale: lerp(0.7, 1, EASE.back(clamp((t - EXAMPLE) / 0.2))) });
      stroke(k + '.sc', box(...SCORE), { z: z + 0.2, w: 3.5, opacity: q });
      // the written lines: little scribbled "words" with a few maths signs; the third line is missing
      LINES.forEach((L, li) => {
        let x = MARGIN_X + 46;
        L.words.forEach((wd, wi) => {
          const kk = k + '.l' + li + 'w' + wi;
          if (typeof wd === 'string') {
            const G = GLYPH[wd], s = 40;
            G.s.forEach((sg, si) => stroke(kk + '.' + si, sg.map(([u, v, c]) => [x + u * s, L.y - s * 0.62 + v * s, c]), { z: z + 0.2, w: 4, opacity: q, boil: 0.5 }));
            x += G.w * s + 18;
            return;
          }
          const pts = [], n = Math.round(wd / 9);
          for (let j = 0; j <= n; j++) pts.push([x + wd * j / n, L.y + (j % 2 ? -5 : 4) + rnd(hstr(kk), j, 3) * 2]);
          stroke(kk, pts, { z: z + 0.2, w: 3, opacity: q, boil: 0.6 });
          x += wd + 22;
        });
      });
      // when the grader gets there: the gap shows up as an empty dashed slot
      const sp = clamp((t - GAP) / 0.35);
      if (sp > 0) {
        const [a, b, c, d] = SLOT, segs = [];
        for (let xx = a; xx < c - 4; xx += 26) segs.push([[xx, b], [Math.min(c, xx + 14), b]], [[xx, d], [Math.min(c, xx + 14), d]]);
        for (let yy = b; yy < d - 4; yy += 26) segs.push([[a, yy], [a, Math.min(d, yy + 14)]], [[c, yy], [c, Math.min(d, yy + 14)]]);
        segs.forEach((sg, i) => stroke(k + '.slot' + i, sg, { z: z + 0.2, w: 3, color: C.pencil, opacity: sp * fo, boil: 0.5 }));
      }
    },
    cues: fx => [[fx.t0, 'paper']],
  };
  /** the insertion caret "∧" at the gap (the missing step) */
  COMP.b4_caret = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [x, y] = fx.at;
      stroke('b4d.caret', [[x - 20, y + 22], [x, y - 22, 1], [x + 20, y + 22]], { z: Z.annot, w: 6, color: C.red, draw: EASE.out(clamp((t - fx.t0) / 0.22)), opacity: fadeOut(t) });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /** a red hand-written mark (✓ ? −) that fades out with the proof */
  COMP.b4_mark = {
    init: layoutWriting,
    draw(fx, t) {
      if (t >= fx.t1) return;
      const op = fadeOut(t);
      fx.strokes.forEach((s, i) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke(fx.id + '.s' + i, s.pts, { z: Z.annot, w: fx.w || 6, color: C.red, draw: q < 1 ? q : undefined, boil: 0.55, opacity: op }); });
    },
    cues: fx => fx.strokes.map(s => [s.t0, fx.sfx || 'pen']),
  };
  /** the grader's red pen (red barrel, ink outline), held in his right hand with the nib down toward the paper */
  const PEN_D = [16, 26], PEN_U = (() => { const l = Math.hypot(...PEN_D); return [PEN_D[0] / l, PEN_D[1] / l]; })();
  COMP.b4_pen = {
    draw(fx, t, F) {
      const a = F.anchors.grader; if (!a || t >= fx.t1) return;
      const h = a.handR, [ux, uy] = PEN_U, nx = -uy * 6, ny = ux * 6;
      const top = [h[0] - ux * 30, h[1] - uy * 30], nib = [h[0] + ux * 20, h[1] + uy * 20], tip = [h[0] + PEN_D[0] + ux * 4, h[1] + PEN_D[1] + uy * 4];
      const op = fadeOut(t);
      stroke('b4d.pen', [[top[0] + nx, top[1] + ny], [nib[0] + nx, nib[1] + ny, 1], [nib[0] - nx, nib[1] - ny, 1], [top[0] - nx, top[1] - ny, 1], [top[0] + nx, top[1] + ny, 1]], { z: Z.front + 1, w: 3, fill: C.red, opacity: op });
      stroke('b4d.penTip', [[nib[0] + nx * 0.8, nib[1] + ny * 0.8], [tip[0], tip[1], 1], [nib[0] - nx * 0.8, nib[1] - ny * 0.8]], { z: Z.front + 1, w: 3, fill: C.paper, opacity: op });
    },
  };
  // where the pen tip is (absolute); the hand follows it with IK
  const TIP = [[0, [556, 700]], [TK[0] - 0.3, [MARGIN_X, LINES[0].y - 8], 0.25], [TK[1] - 0.3, [MARGIN_X, LINES[1].y - 8], 0.25], [GAP, [572, GAP_Y + 4], 0.3],
    [CARET - 0.05, [584, GAP_Y + 14], 0.15], [QM - 0.05, [600, GAP_Y + 8], 0.2], [MINUS - 0.3, [556, 700], 0.3]];
  const tipAt = t => evalTrack(TIP, t);
  // he stands well to the left of the paper (face clear of it) and reaches across from the side, elbow down, so the
  // pen arm never crosses his face; the free hand steadies the paper's lower left edge
  const GX = 330, GR_BASE = { lean: 6, tilt: 4, armScale: 1.65, ikL: { w: 1, to: 'abs', dx: PP.x0 + 6, dy: 712, bend: 'down' } };
  const graderPose = t => {
    const p = tipAt(t), w = 1 - clamp((t - (C_END - 0.35)) / 0.12);      // lets go of the pen target as he zips off
    return { ...GR_BASE, ikL: { ...GR_BASE.ikL, w }, ikR: { w, to: 'abs', dx: p[0] - PEN_D[0], dy: p[1] - PEN_D[1], bend: 'down' }, armL: [20, 14], armR: [20, 14] };
  };

  /* ---------------- poses ---------------- */
  const SIT = POSE.sitBase;
  const desk = (dx, dy = -3, bend = 'down') => ({ w: 1, to: 'desk', dx, dy, bend });
  Object.assign(POSE, {
    b4_think: { ...SIT, tilt: -7, lean: 1, ikL: desk(-50), ikR: { w: 1, to: 'chin', dx: 0.3, dy: 0.04, bend: 'down' } },
  });
  // working hard, not upset: focus brows, eyes narrowed, mouth pressed flat (the built-in 'effort' frown can read as sad)
  Object.assign(FACE, { b4_hard: { lidL: 0.22, lidR: 0.22, brow: 'line', browL: 16, browR: 16, mouth: 'flat', mw: 0.16 } });
  /** writing: the pencil hand scribbles along the line (pure function of t) */
  const writing = (lean, tilt) => t => ({ ...SIT, lean, tilt, ikL: desk(-52), ikR: desk(22 + 12 * Math.sin(t * 6.3), -6 - 4 * Math.abs(Math.sin(t * 12.6))) });

  defineScene({
    id: 'day2', chapter: '第二天', dur: DUR, floor: FL,
    cast: { terry: { ...E4.terry, desk: [DX, DTOP - 3] }, grader: { ...E4.grader } },
    tracks: {
      terry: {
        pos: [[0, [DX, SEAT]], [A_END, [-600, SEAT], 0]],
        pose: [[0, writing(3, 12)], [W5 - 0.9, 'b4_think', 0.14, 'back'], [W6 - 0.9, writing(6, 15), 0.14, 'back']],
        face: [[0, 'focus'], [W6 - 0.9, 'b4_hard', 0.08], [12.6, 'neutral', 0.1]],
        turn: [[0, 0.15], [W5 - 0.9, -0.1, 0.14], [W6 - 0.9, 0.15, 0.14]],
        gaze: [[0, 'paper'], [W5 - 0.9, 'up'], [W6 - 0.9, 'paper']],
        squash: [[0, 1], [W5 - 0.9, 1.04, 0.05], [W5 - 0.84, 1, 0.2, 'back'], [W6 - 0.9, 0.96, 0.05], [W6 - 0.84, 1, 0.2, 'back']],
      },
      grader: {
        enter: G_IN,
        pos: [[0, [GX, FL]], [C_END - 0.35, [-700, FL], 0.35, 'in']],
        pose: [[0, graderPose]],
        face: [[0, 'neutral'], [TK[0], 'focus', 0.06], [GAP + 0.1, 'puzzled', 0.06], [CARET, 'focus', 0.06]],
        turn: [[0, 0.4], [MINUS - 0.2, 0.15, 0.15]],
        gaze: [[0, 'tip'], [MINUS - 0.2, 'viewer']],
      },
    },
    targets: F => ({ paper: [DX - 20, DTOP - 18], up: [DX + 140, DTOP - 260], tip: tipAt(F.t) }),
    set: [
      { type: 'floor', t1: A_END },
      { type: 'floor', t0: G_IN },
      { type: 'stool', x: DX, seat: SEAT, t1: A_END },
      { type: 'desk', x: DX, top: DTOP, w: DW, t1: A_END },
    ],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2 },
      // the score sheet: 7, 7, 3 from yesterday; today 1, 0, 1
      // the shared braces: scene 25's "17" is already there (fades out with the exam room), the "2" comes on "两分"
      { type: 'e4_scores', id: SC, at: SH.at, cell: SH.cell, t0: -1, scores: [[7, -5], [7, -5], [3, -5], [1, W4], [0, W5], [1, W6]],
        braces: [{ from: 0, to: 2, label: '17', t0: -1, t1: BR_OUT }, { from: 3, to: 5, label: '2', t0: BR0, t1: BR_OUT }],
        ringT: [[4, RING5, B_END]] },   // the ring on the 0 goes away before the grader: his own paper isn't shown
      { type: 'b4_ul', id: 'b4d.ul', t0: UL0, t1: UL1 },
      // exam room, day two
      { type: 'b4_cal', id: 'b4d.cal', t1: A_END },
      { type: 'b4_clock', id: 'b4d.clock', t1: A_END },
      { type: 'b4_desk', id: 'b4d.desk', t1: A_END },
      // problem 5: 57 of the 210 got full marks
      { type: 'title', id: 'b4d.all', text: '全场 210 人', x: GR.cx, y: 300, size: 40, t0: GRID0 + 0.1, t1: B_END, dur: 0.2, sfx: 'b4_none' },
      { type: 'b4_grid', id: 'b4d.grid' },
      { type: 'label', id: 'b4d.lb57', text: '57 人满分', at: [262, 470], rot: -4, t0: LB57, t1: B_END, target: cellC(GR.cols + 3), bend: -0.2, gap: 18, size: 46 },
      // the grader: only a complete proof counts
      { type: 'b4_proof', id: 'b4d.proof', t0: G_IN, t1: C_END },
      { type: 'label', id: 'b4d.lbG', text: '阅卷老师', at: [160, 330], rot: -4, t0: LBG, t1: GAP + 0.6, target: { char: 'grader', part: 'headTop', dx: -10, dy: 6 }, bend: 0.2, gap: 14 },
      ...TK.map((tt, i) => ({ type: 'b4_mark', id: 'b4d.tk' + i, text: '✓', x: MARGIN_X, y: LINES[i].y - 32, size: 46, t0: tt, t1: C_END, speed: 2800, anchor: 'middle', w: 5.5, sfx: 'b4_tick' })),
      { type: 'b4_caret', id: 'b4d.caret', at: [600, GAP_Y + 8], t0: CARET, t1: C_END },
      { type: 'b4_mark', id: 'b4d.q', text: '?', x: (SLOT[0] + SLOT[2]) / 2, y: GAP_Y - 32, size: 62, anchor: 'middle', t0: QM, t1: C_END, speed: 2600, w: 6 },
      { type: 'b4_mark', id: 'b4d.minus', text: '-', x: (SCORE[0] + SCORE[2]) / 2, y: (SCORE[1] + SCORE[3]) / 2 - 56, size: 92, t0: MINUS, t1: C_END, speed: 1400, anchor: 'middle', w: 9 },
      { type: 'label', id: 'b4d.lbM', text: '扣分', at: [1210, 370], rot: 4, t0: LBM, t1: C_END - 0.15, target: [SCORE[2] + 4, (SCORE[1] + SCORE[3]) / 2], bend: 0.15, gap: 12, size: 48 },
      { type: 'b4_pen', id: 'b4d.pen', t1: C_END },
    ],
    sfx: [[G_IN, 'pop'], [GAP + 0.1, 'boop']],
    subs: [
      { t0: 0.3, t1: 3.1, text: '7月10日，第二天。', say: '七月十日，第二天。' },
      { t0: 3.7, t1: 6.1, text: '第四题，1分。', say: '第四题，一分。' },
      { t0: 6.6, t1: 9.0, text: '第五题，0分。', say: '第五题，零分。' },
      { t0: 9.5, t1: 11.9, text: '第六题，1分。', say: '第六题，一分。' },
      { t0: 12.6, t1: 15.8, text: '第二天，一共只有2分。', say: '第二天，一共只有两分。' },
      { t0: 16.5, t1: 20.9, text: '第五题，全场有57个人拿了满分；', say: '第五题，全场有五十七个人拿了满分；' },
      { t0: 21.0, t1: 24.0, text: '小陶，一分也没拿到。' },
      { t0: 24.7, t1: 28.3, text: '阅卷老师，只认完整的证明。' },
      { t0: 28.4, t1: 31.2, text: '少一步，就要扣分。' },
    ],
  });
})();
