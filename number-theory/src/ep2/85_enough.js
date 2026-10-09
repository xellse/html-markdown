// 第 85 场 · 余数门能判"一定不是"（enough）：
// 小问号举牌"过了余数门，就一定行？"。一张单独的白卡"平方检查站：是不是平方？"（门口挂卡②的小牌"平方只余 0 或 1"；卡上不出现跑道花纹）。
// 2021 的白砖走进门：2021 ÷ 4 = 505 … 1，盖"0 或 1 ✓"。Jasper 的本子：44 × 44 = 1936，45 × 45 = 2025。
// 检查站下方一段数轴 1936（44²）……2021……2025（45²），44² 和 45² 之间一对空括号"44、45 中间没有整数"；第 1 集"一层层往外包"的小点阵闪一下。
// 2021 盖"不是平方"。2025 也走进门：盖"是平方""0 或 1 ✓"，和 2021 并排，红笔"光看余数，分不开"。
// Jasper 写 2025 − 4 = 2021、45² − 2²，2021 旁画 ┐；检查站一分为二："是平方？ ✗" | "是平方差？ ✓ ┐"，2021 站在中间。
// 卡④写出来（余数门：能判"一定不是"，判不了"是"；它给的是必须满足的条件），缩进顶栏。
// 回到余 0 那条跑道：4、8、12、16 打勾，20、24、28 挂红问号；Jasper 举牌"20、24 也行！"，小问号举牌"猜想？"，牌上贴"猜想"标签（不打叉、不换）。
// 开场：只有顶栏 + 议程条；结尾：只剩顶栏（卡①–④）+ 议程条。
(() => {
  const FL = N2.FL, W = N2.W, F = N2.F;

  /* ---------------- the maths, checked ---------------- */
  const isSq = n => Number.isInteger(Math.sqrt(n));
  const isDiff = n => { for (let d = 1; d * d <= n; d++) if (n % d === 0 && (n / d - d) % 2 === 0) return true; return false; };
  if (2021 !== 4 * 505 + 1 || 2021 % 4 !== 1) console.error('n2x_enough: 2021 ÷ 4 should be 505 … 1');
  if (44 * 44 !== 1936 || 45 * 45 !== 2025) console.error('n2x_enough: 44² = 1936, 45² = 2025');
  for (let n = 1937; n < 2025; n++) if (isSq(n)) { console.error('n2x_enough: a square between 44² and 45²?', n); break; }
  if (isSq(2021) || !isSq(2025) || 2025 % 4 !== 1 || 2025 !== 4 * 506 + 1) console.error('n2x_enough: 2021 is not a square, 2025 is, both 余 1');
  if (2025 - 4 !== 2021 || 45 * 45 - 2 * 2 !== 2021 || !isDiff(2021)) console.error('n2x_enough: 2021 = 2025 − 4 = 45² − 2²');
  for (let m = 0; m <= 300; m++) if ((m * m) % 4 > 1) { console.error('n2x_enough: card ② (squares leave 0 or 1) fails at', m); break; }
  if (6 * 6 - 4 * 4 !== 20 || 5 * 5 - 1 * 1 !== 24) console.error('n2x_enough: 20 = 6² − 4², 24 = 5² − 1²');
  if (![4, 8, 12, 16, 20, 24, 28].every(isDiff)) console.error('n2x_enough: 4 … 28 should all have a 小拐角 (the scene does not say so for 20, 24, 28)');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    QM: 0.25, QSIGN: 0.8, QDOWN: 4.3, QOUT: 4.5,
    CARD: 4.7, GATE: 5.1, PLAQUE: 5.5, B21: 6.2, DIV: 6.95, ST21: 9.4,
    KID: 9.9, NB: 10.1, W1: 10.6, W2: 14.2, DIV_OUT: 17.4,
    NL: 17.9, NUM: 18.1, SQ: 18.9, DOTS: 19.6, BAND: 20.2, DOTS_OUT: 21.9, PAREN: 20.7, PNOTE: 21.1,
    SAND: 22.9, NOT: 24.6, NL_OUT: 26.8,
    MOVE: 27.2, B25: 27.6, IS: 28.6, ST25: 29.6, SAME: 30.6,
    W3: 33.3, W4: 35.5, MARK: 37.5,
    PREP: 39.2, SPLIT: 39.6, HL: 40.3, HR: 41.2,
    CLR: 42.9, CARD4: 43.7, DOCK: 47.5,
    LANE: 48.7, BRICKS: 49.0, TICKS: [50.7, 51.2, 51.7, 52.25], QS: [52.85, 53.1, 53.35],
    SIGN: 54.1, QM2: 57.8, QSIGN2: 58.3, TAG: 59.35, PULSE: 61.9, QDOWN2: 63.2,
    OUT: 63.8, WALK: 64.0, END: 64.5, DUR: 65.3,
  };

  /* ---------------- 平方检查站（一张单独的白卡，不带跑道花纹）---------------- */
  const CARD = [300, 190, 1160, 575], MID = 730, GATE = 470, FLOOR = 548, BRY = 504, BS = 1.3;
  const ST_UP = [185, -44], ST_DN = [185, 26];          // close to their own brick: 2025's group and 2021's group stay ≥ 60 px apart
  const red = (k, s, x, y, size, o = {}) => text(k, s, x, y, { size, color: C.red, z: Z.annot, ...o });
  /** a red rubber stamp: slams in at t0 */
  const stamp = (k, s, cx, cy, t0, t, op = 1) => {
    if (t < t0) return;
    const su = clamp((t - t0) / 0.2), sc = lerp(1.7, 1, EASE.back(su)), a = clamp(su * 3) * op, sz = 38;
    const w = textWidth(s, sz) * 0.95 + 34, h = sz + 22;
    DL.save(); DL.translate(cx, cy); DL.rotate(-5); DL.scale(sc);
    stroke(k + '.b', N2.box(-w / 2, -h / 2, w / 2, h / 2), { z: Z.stamp, w: 4.5, color: C.red, opacity: a });
    text(k + '.t', s, 0, 2, { size: sz, color: C.red, z: Z.stamp, font: CFG.FONT_MIX, opacity: a });
    DL.restore();
  };
  const card = {
    type: 'n2_fn', id: 'n2xcd', t0: T.CARD,
    cues: [[T.CARD, 'paper'], [T.GATE, 'pen'], [T.PLAQUE, 'tap'], [T.SAME, 'pen'], [T.SPLIT, 'swish'], [T.HR + 0.75, 'pen']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.CLR) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length, p = EASE.out(clamp(lt / 0.45)), prep = 1 - clamp((t - T.PREP) / 0.35);
      const [x0, y0, x1, y1] = CARD, z = Z.board;
      if (t < T.SPLIT + 0.25) {
        stroke(k + '.c', N2.box(x0, y0, x1, y1), { z, w: 4.5, fill: '#FFFFFF', draw: p });
        if (t >= T.SPLIT) stroke(k + '.tear', [[MID, y0], [MID + 8, (y0 + y1) / 2], [MID - 4, y1]], { z: z + 0.2, w: 3, color: C.red, draw: clamp((t - T.SPLIT) / 0.25) });
      } else {
        const d = 30 * EASE.io(clamp((t - T.SPLIT - 0.25) / 0.5));
        stroke(k + '.cl', N2.box(x0 - d, y0, MID - d, y1), { z, w: 4.5, fill: '#FFFFFF' });
        stroke(k + '.cr', N2.box(MID + d, y0, x1 + d, y1), { z, w: 4.5, fill: '#FFFFFF' });
      }
      if (prep > 0) {
        const m0 = DL.items.length;
        text(k + '.tt', '平方检查站：是不是平方？', (x0 + x1) / 2, 236, { size: 46, z: z + 1, opacity: clamp(p * 2 - 0.8) });
        // the gate: two posts and a little roof, the floor line; card ② hangs above it as a small plaque
        const g = EASE.out(clamp((t - T.GATE) / 0.4));
        if (g > 0) {
          stroke(k + '.pl', [[GATE - 75, FLOOR], [GATE - 75, 380]], { z: z + 0.5, w: 5, draw: g });
          stroke(k + '.pr', [[GATE + 75, FLOOR], [GATE + 75, 380]], { z: z + 0.5, w: 5, draw: g });
          stroke(k + '.rf', [[GATE - 96, 384], [GATE, 362], [GATE + 96, 384]], { z: z + 0.5, w: 5, draw: g });
          stroke(k + '.fl', [[x0 + 20, FLOOR + 1], [x1 - 20, FLOOR]], { z: z + 0.3, w: 2.5, color: C.pencil, draw: g });
        }
        const pu = EASE.back(clamp((t - T.PLAQUE) / 0.3));
        if (pu > 0) {
          DL.save(); DL.translate(GATE, 312); DL.scale(Math.max(0.01, pu));
          stroke(k + '.s1', [[-90, 30], [-50, 52]], { z: z + 0.6, w: 2.5 }); stroke(k + '.s2', [[90, 30], [50, 52]], { z: z + 0.6, w: 2.5 });
          stroke(k + '.pq', N2.box(-165, -30, 165, 30), { z: z + 0.7, w: 3.5, fill: '#FFFFFF' });
          text(k + '.pn', '②', -136, 1, { size: 36, color: C.red, z: z + 0.8 });
          text(k + '.pt', '平方只余 0 或 1', 18, 1, { size: 36, z: z + 0.8, font: CFG.FONT_MIX });
          DL.restore();
        }
        // L6: same 零头, different answers — a red bracket over the two "0 或 1 ✓" stamps
        if (t >= T.SAME) {
          const u = clamp((t - T.SAME) / 0.4), a = GATE + ST_UP[0], b = X21(t) + ST_UP[0], yb = BRY + ST_UP[1] - 30, yt = yb - 26;
          stroke(k + '.br', [[a, yb], [a, yt, 1], [b, yt, 1], [b, yb, 1]], { z: Z.annot, w: 4, color: C.red, draw: u });
          if (u > 0.5) red(k + '.same', '光看余数，分不开', (a + b) / 2, yt - 36, 44, { opacity: clamp((u - 0.5) * 3) });
        }
        N2.fadeFrom(m0, prep);
      }
      // after the split: two headings (their ✗ / ✓ are hand-written: see headMarks)
      if (t >= T.HL) text(k + '.hl', '是平方？', 440, 300, { size: 48, z: z + 1, opacity: clamp((t - T.HL) / 0.3) });
      if (t >= T.HR) text(k + '.hr', '是平方差？', 935, 300, { size: 48, z: z + 1, opacity: clamp((t - T.HR) / 0.3) });
      if (t >= T.HR + 0.75) { DL.save(); DL.translate(1142, 302); PROPS.n1_mark({ id: k + '.hm', size: 34 }, t, 0, clamp((t - T.HR - 0.75) / 0.3)); DL.restore(); }
      N2.fadeFrom(n0, op);
    },
  };

  const headMarks = { type: 'n2_grp', id: 'n2xhmG', out: T.CLR, dur: 0.4, inner: [
    W('n2xhx', '✗', 548, 276, 52, T.HL + 0.4, { color: 'red' }),
    W('n2xhk', '✓', 1066, 276, 52, T.HR + 0.4, { color: 'red' }),
  ] };

  /* ---------------- 2021、2025 两块白砖（r = null：不刷花纹）和它们的章 ---------------- */
  const X21R = 870;                                     // 2021's place after 2025 arrives
  const X21 = t => {
    let x = lerp(120, GATE, EASE.out(clamp((t - T.B21) / 0.7)));
    x += (X21R - GATE) * EASE.io(clamp((t - T.MOVE) / 0.6));
    return lerp(x, MID, EASE.io(clamp((t - T.SPLIT - 0.1) / 0.6)));
  };
  const Y21 = t => lerp(BRY, 450, EASE.io(clamp((t - T.SPLIT - 0.1) / 0.6)));
  const X25 = t => lerp(120, GATE, EASE.out(clamp((t - T.B25) / 0.7)));
  {
    const half = (str) => (textWidth(str, 38) * 0.95 + 34) / 2 + 4, bw = 96 * BS / 2;   // stamp half-width (+ rotation slack), brick half-width
    const r25 = GATE + ST_UP[0] + Math.max(half('0 或 1 ✓'), half('是平方')), l21 = X21R - bw, r21 = X21R + ST_DN[0] + Math.max(half('0 或 1 ✓'), half('不是平方'));
    if (l21 - r25 < 60 || r21 > CARD[2] - 6) console.error('n2x_enough: stamp groups crowd each other or leave the card', r25, l21, r21);
  }
  const bricks = {
    type: 'n2_fn', id: 'n2xbr', t0: T.B21,
    cues: [[T.B21, 'whoosh'], [T.ST21, 'stamp'], [T.NOT, 'stamp'], [T.MOVE, 'swish'], [T.B25, 'whoosh'], [T.IS, 'stamp'], [T.ST25, 'stamp'], [T.MARK, 'pen']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.CLR) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length, prep = 1 - clamp((t - T.PREP) / 0.35);
      // 2021
      const x = X21(t), y = Y21(t);
      N2.brick(k + '.a', x, y, 2021, null, { scale: BS, opacity: clamp(lt / 0.2) });
      if (prep > 0) {
        const m0 = DL.items.length;
        stamp(k + '.a1', '0 或 1 ✓', x + ST_UP[0], y + ST_UP[1], T.ST21, t);
        stamp(k + '.a2', '不是平方', x + ST_DN[0], y + ST_DN[1], T.NOT, t);
        N2.fadeFrom(m0, prep);
      }
      if (t >= T.MARK) { DL.save(); DL.translate(x + 78, y - 54); PROPS.n1_mark({ id: k + '.am', size: 40 }, t, t - T.MARK, EASE.out(clamp((t - T.MARK) / 0.35))); DL.restore(); }
      // 2025
      if (t >= T.B25 && prep > 0) {
        const m0 = DL.items.length, x5 = X25(t);
        N2.brick(k + '.b', x5, BRY, 2025, null, { scale: BS, opacity: clamp((t - T.B25) / 0.2) });
        stamp(k + '.b2', '是平方', x5 + ST_DN[0], BRY + ST_DN[1], T.IS, t);
        stamp(k + '.b1', '0 或 1 ✓', x5 + ST_UP[0], BRY + ST_UP[1], T.ST25, t);
        N2.fadeFrom(m0, prep);
      }
      N2.fadeFrom(n0, op);
    },
  };

  /* ---------------- 横式（检查站下方）：2021 ÷ 4 = 505 … 1，红圈圈出余数 ---------------- */
  const DIV = W('n2xdv', '2021 ÷ 4 = 505 … 1', 330, 596, 44, T.DIV, { speed: 3400 });
  const DIV_END = layoutWriting({ ...DIV }).tEnd;   // the ring and the stamp wait for the last digit
  if (DIV_END + 0.45 > T.ST21) console.error('n2x_enough: the division ends too late', DIV_END);
  const divRing = {
    type: 'n2_fn', id: 'n2xdr', t0: DIV_END + 0.08, cues: [[DIV_END + 0.08, 'pen']],
    fn: (t, lt, k) => { const b = DIV.boxes && DIV.boxes[DIV.boxes.length - 1]; if (!b) return; stroke(k + '.r', ringPts(k + '.rp', b.x + b.w / 2, b.y + b.h * 0.55, b.w / 2 + 18, b.h / 2 + 12, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp(lt / 0.35)) }); },
  };
  const division = { type: 'n2_grp', id: 'n2xdvG', out: T.DIV_OUT, dur: 0.4, inner: [DIV, divRing] };

  /* ---------------- 一段数轴：1936（44²）……2021……2025（45²）；44、45 中间没有整数 ---------------- */
  const NLY = 676, NX = { a: 420, m: 860, b: 1050 };
  const nlFn = {
    type: 'n2_fn', id: 'n2xnl', t0: T.NL, cues: [[T.NL, 'pen'], [T.SAND, 'pen']],
    fn: (t, lt, k) => {
      const u = EASE.out(clamp(lt / 0.5));
      stroke(k + '.ln', [[340, NLY], [340 + 800 * u, NLY]], { z: Z.board, w: 4 });
      [NX.a, NX.m, NX.b].forEach((x, i) => { if (u * 800 + 340 > x) stroke(`${k}.tk${i}`, [[x, NLY - 12], [x, NLY + 12]], { z: Z.board, w: 3.5 }); });
      if (lt > 0.4) text(k + '.el', '……', 640, NLY - 26, { size: 40, z: Z.board, opacity: clamp((lt - 0.4) / 0.3) });
      if (t >= T.SAND) stroke(k + '.rg', ringPts(k + '.rgp', NX.m, 635, 64, 30, { n: 14, a0: -140, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - T.SAND) / 0.35)) });
    },
  };
  const numberLine = {
    type: 'n2_grp', id: 'n2xnlG', out: T.NL_OUT, dur: 0.4,
    inner: [
      nlFn,
      W('n2xn1', '1936', NX.a, 616, 38, T.NUM, { anchor: 'middle' }),
      W('n2xn2', '2021', NX.m, 616, 38, T.NUM + 0.35, { anchor: 'middle' }),
      W('n2xn3', '2025', NX.b, 616, 38, T.NUM + 0.7, { anchor: 'middle' }),
      W('n2xs1', '44²', NX.a, 694, 38, T.SQ, { anchor: 'middle' }),
      W('n2xs2', '45²', NX.b, 694, 38, T.SQ + 0.3, { anchor: 'middle' }),
      W('n2xpa', '(  )', 735, 694, 38, T.PAREN, { anchor: 'middle', color: 'red' }),
      { type: 'scribe', id: 'n2xpn', text: '44、45 中间没有整数', x: 735, y: 760, size: 36, cps: 14, anchor: 'middle', color: 'red', t0: T.PNOTE },
    ],
  };
  // 第 1 集"一层层往外包"：5 × 5 的点阵，外面一圈垫黄（边长多 1，平方多一圈）
  const dots = { type: 'n1_dots', id: 'n2xdt', x: 170, y: 606, N: 5, gap: 26, t0: T.DOTS, pop: 0.4, band: { t: T.BAND }, t1: T.DOTS_OUT };

  /* ---------------- Jasper 的本子 ---------------- */
  const NB = [1200, 196, 1580, 478], NBX = 1234, NBS = 38, NBY = [222, 284, 346, 408];
  const notebook = {
    type: 'n2_fn', id: 'n2xnb', t0: T.NB, cues: [[T.NB, 'paper']],
    fn: (t, lt, k) => {
      const p = EASE.out(clamp(lt / 0.4)), [x0, y0, x1, y1] = NB;
      stroke(k + '.pg', N2.box(x0, y0, x1, y1), { z: Z.set + 1, w: 4, fill: '#FFFFFF', draw: p });
      stroke(k + '.mg', [[x0 + 26, y0 + 4], [x0 + 26, y1 - 4]], { z: Z.set + 1.1, w: 2.2, color: C.red, opacity: 0.6, draw: p });
      [270, 332, 394, 456].forEach((y, i) => stroke(`${k}.r${i}`, [[x0 + 8, y], [x1 - 8, y]], { z: Z.set + 1.1, w: 2, color: C.pencil, opacity: 0.6, draw: p }));
    },
  };
  const NBW = [
    W('n2xw1', '44 × 44 = 1936', NBX, NBY[0], NBS, T.W1),
    W('n2xw2', '45 × 45 = 2025', NBX, NBY[1], NBS, T.W2),
    W('n2xw3', '2025 − 4 = 2021', NBX, NBY[2], NBS, T.W3),
    W('n2xw4', '45² − 2²', NBX, NBY[3], NBS, T.W4),          // under "2025 − 4": 2025 = 45², 4 = 2²
  ];
  NBW.forEach(w => { if (writeWidth(w.text, NBS) > NB[2] - NBX - 8) console.error('n2x_enough: notebook line too wide', w.text, writeWidth(w.text, NBS)); });
  const notes = { type: 'n2_grp', id: 'n2xnbG', out: T.CLR, dur: 0.4, inner: [notebook, ...NBW] };

  /* ---------------- 卡④ ---------------- */
  const card4 = { type: 'n2_bigcard', id: 'n2xc4', n: 4, at: [745, 470], w: 880, lines: ['余数门：', '能判“一定不是”，判不了“是”'], size: 52, cps: 10, sub: '它给的是必须满足的条件', t0: T.CARD4, dock: T.DOCK };

  /* ---------------- 回到余 0 那条：4、8、12、16 打勾，20、24、28 挂红问号 ---------------- */
  const LX = 200, LY = 236, LH = 92, LHEAD = 80, CELL = 140, BYL = LY + LH / 2;
  const NS = [4, 8, 12, 16, 20, 24, 28], BXL = j => LX + LHEAD + CELL * (j + 0.5);
  const lane = { type: 'n2_lanes', id: 'n2xln', x: LX, y: LY, W: 1300, H: LH, gap: 16, head: LHEAD, lanes: [0], labelSize: 44, t0: T.LANE, t1: T.END };
  const laneBricks = {
    type: 'n2_fn', id: 'n2xlb', t0: T.BRICKS, cues: [[T.BRICKS, 'pop'], ...T.QS.map(x => [x, 'plip']), [T.PULSE, 'boop']],
    fn: (t, lt, k) => {
      NS.forEach((n, j) => {
        const s = EASE.back(clamp((lt - j * 0.1) / 0.25)); if (s <= 0.01) return;
        N2.brick(`${k}.b${j}`, BXL(j), BYL, n, 0, { scale: 1.15 * s });
      });
      if (lt > 0.8) text(k + '.el', '……', BXL(7) + 10, BYL, { size: 44, z: Z.set + 1, opacity: clamp((lt - 0.8) / 0.3) });
      // the red question marks hang on little strings under 20, 24, 28
      T.QS.forEach((tq, i) => {
        if (t < tq) return;
        const j = 4 + i, x = BXL(j), u = EASE.back(clamp((t - tq) / 0.3)), sw = 6 * Math.sin((t - tq) * 3 + i) * (1 - clamp((t - tq) / 3)) + 3 * Math.sin(t * 1.3 + i);
        const pv = (t - T.PULSE - i * 0.12) / 0.5, pb = pv > 0 && pv < 1 ? 1 + 0.25 * Math.sin(Math.PI * pv) : 1;
        stroke(`${k}.qs${i}`, [[x, BYL + 38], [x + sw * 0.4, BYL + 60]], { z: Z.annot, w: 2.5, color: C.red, draw: u });
        text(`${k}.q${i}`, '?', x + sw * 0.6, BYL + 92, { size: 56 * Math.max(0.01, u) * pb, color: C.red, z: Z.annot, font: CFG.FONT_MIX, rot: sw });
      });
    },
  };
  const ticks = NS.slice(0, 4).map((n, j) => W(`n2xtk${j}`, '✓', BXL(j), BYL + 50, 46, T.TICKS[j], { anchor: 'middle', color: 'red' }));
  const laneG = { type: 'n2_grp', id: 'n2xlbG', out: T.END, dur: 0.35, inner: [laneBricks, ...ticks] };

  /* ---------------- Jasper 的牌和"猜想"标签 ---------------- */
  const SG = [1250, 455];
  const sign = { type: 'n2_grp', id: 'n2xsgG', out: T.OUT, dur: 0.3, inner: { type: 'prop', kind: 'n1_sign', id: 'n2xsg', at: SG, text: '20、24 也行！', size: 44, w: 380, t0: T.SIGN, drawDur: 0.3, sfxAt: [[T.SIGN, 'pop']] } };
  const TAGAT = [SG[0] + 182, SG[1] - 62];
  const tag = { type: 'n2_tag', id: 'n2xtag', text: '猜想', size: 40, rot: -6, at: TAGAT, t0: T.TAG, t1: T.OUT };

  /* ---------------- 小问号（开头一次，结尾一次） ---------------- */
  const qm1 = {
    type: 'n2_grp', id: 'n2xq1G', out: T.QOUT, dur: 0.35,
    inner: { type: 'qm', id: 'n2xq1', size: 150, t0: T.QM, burst: true, pos: [[0, [260, FL]]], signSize: 46,
      mood: [[0, 'neutral'], [T.QSIGN, 'doubt']], act: [[0, 'idle'], [T.QSIGN, 'tap'], [T.QDOWN, 'idle']],
      sign: [[0, null], [T.QSIGN, '过了余数门，就一定行？'], [T.QDOWN, null]], gaze: [[0, 'viewer'], [T.QDOWN, [730, 400]]] },
  };
  const qm2 = {
    type: 'n2_grp', id: 'n2xq2G', out: T.END, dur: 0.35,
    inner: { type: 'qm', id: 'n2xq2', size: 150, t0: T.QM2, burst: true, pos: [[0, [200, FL]]], signSize: 56,
      mood: [[0, 'neutral'], [T.QSIGN2, 'doubt'], [T.TAG + 0.4, 'neutral']], act: [[0, 'idle'], [T.QSIGN2, 'tap'], [T.TAG, 'nod'], [T.TAG + 1.0, 'idle']],
      sign: [[0, null], [T.QSIGN2, '猜想？'], [T.QDOWN2, null]], gaze: [[0, [1250, 455]], [T.QSIGN2, 'viewer'], [T.TAG, TAGAT], [T.PULSE, [900, 370]]] },
  };

  /* ---------------- Jasper ---------------- */
  Object.assign(POSE, {
    n2x_up: { lean: -2, tilt: -4, armScale: 1.5, armR: [124, 26], armL: [16, 10] },                         // right arm up and out (clear of his face): at his notebook
    n2x_ptL: { armScale: 1.5, armL: [82, 6], armR: [16, 10], lean: -2 },                                  // pointing left, at 2021 in the card
    n2x_hold: { lean: -2, tilt: 4, armScale: 1.6, ikL: { w: 1, to: 'abs', dx: SG[0] + 6, dy: 632, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 26, dy: -6, bend: 'out' } },
  });
  const KX = 1390;

  defineScene({
    id: 'enough', chapter: '判不了"是"', dur: T.DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: T.KID,
        pos: [[0, [KX, FL]], [T.WALK, [1740, FL], 1.0, 'lin']],
        pose: [[0, 'stand'], [T.W1 - 0.1, 'n2x_up', 0.15, 'back'], [T.W2 + 2.2, 'stand', 0.15], [T.SAND, 'thinkStand', 0.15, 'back'], [T.NOT + 0.4, 'stand', 0.15],
          [T.W3 - 0.3, 'n2x_up', 0.15, 'back'], [T.MARK - 0.2, 'n2x_ptL', 0.12, 'back'], [T.PREP + 0.2, 'stand', 0.15],
          [T.SIGN, 'n2x_hold', 0.15, 'back'], [T.OUT, 'stand', 0.15], [T.WALK, makeWalk(T.WALK, T.WALK + 1.0, 5.2)]],
        face: [[0, 'smile'], [T.W1, 'focus', 0.1], [T.W1 + 1.3, 'grin', 0.08], [T.W2 + 1.4, 'proudGrin', 0.1], [T.SAND, 'focus', 0.1], [T.NOT, 'surprised', 0.06], [T.NOT + 0.8, 'neutral', 0.1],
          [T.W3 - 0.3, 'idea', 0.06], [T.W3 + 1.2, 'grin', 0.08], [T.MARK, 'proudGrin', 0.1], [T.SPLIT, 'smile', 0.1], [T.CARD4, 'focus', 0.1], [T.LANE, 'smile', 0.1],
          [T.SIGN, 'grin', 0.08], [T.QSIGN2, 'sheepish', 0.1], [T.PULSE, 'smile', 0.1]],
        turn: [[0, -0.2], [T.MARK - 0.2, -0.4, 0.15], [T.PREP, -0.25, 0.15], [T.SIGN, -0.2, 0.15], [T.QSIGN2, -0.45, 0.15], [T.WALK, 0.4, 0.15]],
        gaze: [[0, 'nb'], [T.NL, 'nl'], [T.SAND, 'b21'], [T.B25, 'b25'], [T.SAME, 'same'], [T.W3 - 0.3, 'nb'], [T.MARK - 0.2, 'b21'], [T.SPLIT, 'card'],
          [T.CARD4, 'c4'], [T.LANE, 'lane'], [T.SIGN, 'viewer'], [T.QSIGN2, 'qm'], [T.TAG, 'tag'], [T.TAG + 1.2, 'viewer'], [T.WALK, [1700, 640]]],
      },
    },
    targets: F => ({ nb: [1390, 330], nl: [740, 650], b21: [X21(F.t), Y21(F.t)], b25: [X25(F.t), BRY], same: [880, 380], card: [MID, 330], c4: [745, 470],
      lane: [BXL(5), BYL], qm: [200, 640], tag: TAGAT }),
    steps: [{ t0: T.WALK, t1: T.WALK + 1.0, hz: 5.2 }],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'enough', dock: [[T.DOCK, 4]] },
      qm1,
      card, headMarks, bricks, division, numberLine, dots, notes,
      card4,
      lane, laneG, sign, tag, qm2,
    ],
    subs: [
      {"t0": 0.8, "t1": 4.25, "text": "“过了余数门，就一定行吗？”", "voice": "qm", "say": "过了余数门，就一定行吗？"},
      {"t0": 4.55, "t1": 9.96, "text": "换个问题：2021是平方吗？余1，过关。", "say": "换个问题：两千零二十一是平方吗？余一，过关。"},
      {"t0": 10.26, "t1": 17.62, "text": "“44²是1936，45²是2025！”", "voice": "kid", "say": "四十四平方，一千九百三十六！四十五平方，两千零二十五！"},
      {"t0": 17.82, "t1": 22.51, "text": "44、45挨着，边长越大平方越大：", "say": "四十四、四十五挨着，边长越大，平方越大："},
      {"t0": 22.71, "t1": 26.8, "text": "夹在中间的2021，不是平方。", "say": "夹在中间的两千零二十一，不是平方。"},
      {"t0": 27.1, "t1": 32.49, "text": "2025是平方，也余1：光看余数分不开。", "say": "两千零二十五是平方，也余一：光看余数，分不开。"},
      {"t0": 32.89, "t1": 39.05, "text": "“可2021是45²减2²，有小拐角！”", "voice": "kid", "say": "可两千零二十一，是四十五平方减二平方，有小拐角！"},
      {"t0": 39.3, "t1": 43.22, "text": "对：平方差和平方，是两件事。"},
      {"t0": 43.62, "t1": 48.08, "text": "余数门能判“一定不是”，判不了“是”。"},
      {"t0": 48.58, "t1": 53.8, "text": "回到余0那条：4、8、12、16有写法，", "say": "回到余零那条：四、八、十二、十六有写法，"},
      {"t0": 54.0, "t1": 58.04, "text": "“20、24……肯定也行！”", "voice": "kid", "say": "二十、二十四……肯定也行！"},
      {"t0": 58.29, "t1": 60.46, "text": "“又是猜想？”", "voice": "qm", "say": "又是猜想？"},
      {"t0": 60.71, "t1": 64.83, "text": "对，还是猜想：余数门答不了这一条。"},
    ],
  });
})();
