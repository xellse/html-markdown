// 第 35 场 · 第六题（1988 年 IMO 第 6 题）：出了名的超级难题。选题委员会 6 人没做出来；四位数论专家各做 6 小时也没做出来；
// 全场 268 人只有 11 人满分；小陶这题 1 分（他写了什么没有记录，所以讲题的部分不用小陶，用小问号）。
// 讲题：魔法分数 (a×a + b×b) ÷ (a×b + 1) 是整数 ⇒ 是平方数。试 (2,8)：68÷17=4=2×2；梯子：下一级 (b, 4b−a) = (8,30)，
// “轮到你了”停顿；验算 964÷241=4；往下爬 (8,30)→(2,8)→(0,2)，(0+4)÷(0+1)=4=2×2；每一级都是 4；钥匙：每架梯子都能爬到 0（真正难证的一步，只说“要证明”）。
// 所有数字在页面加载时用 JS 重算（算错就 console.error），黑板上的字也由这些数拼出来。
// 开场 = 第 30 场结尾（成绩单只有第 4 格的 7）；结尾只留成绩单（第 4 格 7、第 6 格 1），交给第 40 场。
(() => {
  const FL = 770;
  const SH = E5.SHEET, CELL = SH.cell;
  const cellX = i => SH.at[0] - (6 * CELL + 26) / 2 + i * CELL + (i >= 3 ? 26 : 0) + CELL / 2;

  /* ---------------- the maths, checked ---------------- */
  const frac = (a, b) => [a * a + b * b, a * b + 1];
  const A0 = 2, B0 = 8;
  const [N0, D0] = frac(A0, B0);                 // 68, 17
  const K = N0 / D0;                             // 4
  const ROOT = Math.round(Math.sqrt(K));         // 2
  const UP = [B0, K * B0 - A0];                  // next rung up: (8, 30)
  const [N1, D1] = frac(UP[0], UP[1]);           // 964, 241
  const DOWN = [K * A0 - B0, A0];                // next rung down from (2, 8): (0, 2)
  const [N2, D2] = frac(DOWN[0], DOWN[1]);       // 4, 1
  if (N0 !== 68 || D0 !== 17 || K !== 4 || ROOT * ROOT !== K) console.error('d5_six: 68 ÷ 17 should be 4 = 2×2', N0, D0, K);
  if (UP[1] !== 30 || N1 !== 964 || D1 !== 241 || N1 !== K * D1) console.error('d5_six: the rung (8, 30) should give 964 ÷ 241 = 4', UP, N1, D1);
  if (K * UP[0] - UP[1] !== A0 || UP[0] !== B0) console.error('d5_six: climbing down from (8, 30) should reach (2, 8)');
  if (DOWN.join() !== '0,2' || N2 / D2 !== K || DOWN[1] !== ROOT) console.error('d5_six: the ground rung should be (0, 2) with (0+4)÷(0+1) = 4', DOWN);
  const S = {
    top0: `${A0 * A0}+${B0 * B0}=${N0}`, bot0: `${A0 * B0}+1=${D0}`, div0: `${N0}÷${D0}=${K}`, sq: `=${ROOT}×${ROOT}`,
    times: `×${B0}-${A0}`, eq30: `=${UP[1]}`,
    top1: `${UP[0] * UP[0]}+${UP[1] * UP[1]}=${N1}`, bot1: `${UP[0] * UP[1]}+1=${D1}`, div1: `${N1}÷${D1}=${K}`,
    ground: `(${DOWN[0] * DOWN[0]}+${DOWN[1] * DOWN[1]})÷(${DOWN[0] * DOWN[1]}+1)=${N2 / D2}`,
    r28: `(${A0},${B0})`, r8q: `(${UP[0]},?)`, r830: `(${UP[0]},${UP[1]})`, r02: `(${DOWN[0]},${DOWN[1]})`, eq4: `=${K}`,
  };
  if (S.top0 !== '4+64=68' || S.bot0 !== '16+1=17' || S.div0 !== '68÷17=4' || S.sq !== '=2×2' || S.times !== '×8-2' || S.eq30 !== '=30' ||
      S.top1 !== '64+900=964' || S.bot1 !== '240+1=241' || S.div1 !== '964÷241=4' || S.ground !== '(0+4)÷(0+1)=4') console.error('d5_six: board text', S);
  if (4 * 8 - 2 !== 30) console.error('d5_six: 4×8−2');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    RING1: 0.5, TITLE: 1.0, STAR: [1.35, 1.6], SUPER: 3.0, SHEET1_OUT: 3.9, TITLE_OUT: 4.55,
    TABLE: 4.85, CIN: 4.95, COMM: 5.6, MARKS: 6.3, SHAKE1: 8.2, COUT: 9.65,
    DESKS: 9.95, XIN: 10.0, CLOCK: 10.05, H0: 10.8, H1: 13.0, SIX: 12.0, EFFORT: 11.6, SHAKE2: 13.25, XOUT: 14.62,
    GRID: 14.8, FILL: 17.6, L11: 18.3, FLASH: 19.0, GOUT: 20.25,
    SHEET2: 20.45, WALK_IN: 20.45, WALK_IN1: 21.25, RING2: 21.4, ONE: 22.7, WALK_OUT: 24.0, WALK_OUT1: 24.75, SHEET2_OUT: 24.3,
    CARD: 24.5, AB: 27.6, NUM: 29.3, BAR: 30.35, DEN: 30.5, ST1: 33.0, IMP: 34.15, ST2: 34.55, BAND: 35.7,
    EX0: 37.95, EX1: 38.85, EXBAR: 38.95, EX2: 39.85, EX3: 41.6, EX4: 43.9, EX5: 45.0,
    LAD: 47.0, LB28: 47.45, LB8Q: 51.1, FORM: 52.7, ANS: 54.4,
    TURN: 56.5, PAUSE: 60.9, TURN_OUT: 61.25,
    EQ30: 63.0, N30: 63.7,
    EXOUT: 64.45, CK0: 64.75, CK1: 64.95, CKBAR: 65.0, CK2: 65.25, CK3: 66.3, CK4: 68.4, CKOUT: 70.3,
    QIN: 70.9, RA: 73.5, HOP1: 74.25, RB: 74.6, GRUNG: 75.3, LB02: 75.45, HOP2: 75.6, RC: 75.9, RC1: 77.0,
    G0: 77.5, G1: 79.3, QHAPPY: 79.6,
    LIGHT0: 81.4, LIGHT: [81.9, 82.4, 82.9], TOP22: 83.6,
    CARD_OUT: 85.65, KEY: 86.1, KEYTXT: 86.9, KEYSHINE: 88.6,
    END: 90.3, SHEET3: 90.55, DUR: 91.7,
  };

  /* ---------------- helpers ---------------- */
  /** a hand-written line, laid out now (so its boxes can be used for rings and bands) */
  const W = (id, text, x, y, size, t0, o = {}) => {
    const fx = { type: 'write', id, text, x, y, size, t0, speed: 2300, w: 5.5, gap: 0.02, glyphGap: 0.02, ...o };
    if (fx.color === 'red') { fx.z = fx.z ?? Z.annot; fx.sfx = fx.sfx || 'pen'; fx.speed = o.speed || 2800; }
    layoutWriting(fx); fx._d5 = 1; return fx;
  };
  const boxRect = (L, from = 0, to = L.boxes.length) => { const bs = L.boxes.slice(from, to), b = bs[bs.length - 1]; return [bs[0].x, L.y, b.x + b.w - bs[0].x, L.size]; };

  /** draws a group of components; from `out` on, the whole group fades (and optionally shrinks toward `about`) over `dur` */
  COMP.d5_fade = {
    init(fx) {
      fx.inner = [].concat(fx.inner);
      fx.inner.forEach(f => { const c = COMP[f.type]; if (c.init && !f._d5) { c.init(f); f._d5 = 1; } });
      return fx;
    },
    draw(fx, t, F) {
      const u = fx.out === undefined ? 0 : clamp((t - fx.out) / (fx.dur ?? 0.3));
      if (u >= 1) return;
      const n0 = DL.items.length, e = EASE.in(u);
      DL.save();
      if (u > 0 && fx.about) DL.about(fx.about[0], fx.about[1], () => DL.scale(1 - (fx.shrink ?? 0.3) * e));
      fx.inner.forEach(f => COMP[f.type].draw(f, t, F));
      DL.restore();
      if (u > 0) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * (1 - u)).toFixed(3); }
    },
    cues: fx => fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])).concat(fx.out !== undefined && fx.whoosh ? [[fx.out, 'whoosh']] : []),
  };
  /** plain strokes that draw on: {list: [{pts, t0, dur, w, color}]} */
  COMP.d5_lines = {
    draw(fx, t) {
      fx.list.forEach((s, i) => {
        const q = EASE.out(clamp((t - s.t0) / (s.dur ?? 0.25))); if (q <= 0) return;
        stroke(fx.id + '.' + i, s.pts, { z: s.z ?? Z.board, w: s.w ?? 5, color: s.color === 'red' ? C.red : C.ink, draw: q, boil: 0.6 });
      });
    },
    cues: fx => fx.list.filter(s => !s.silent).map(s => [s.t0, 'pen']),
  };
  /** a maths line mixing letters (typed in the hand-lettering font, they pop in) and hand-written symbols.
   *  {tokens: [{s: 'a'} | {g: '×'}, …], x, y (top), size, t0, anchor: 'middle', color per token} */
  COMP.d5_expr = {
    init(fx) {
      const Sz = fx.size, gap = Sz * 0.08; let x = 0, tt = fx.t0;
      fx._parts = fx.tokens.map(tk => {
        if (tk.s !== undefined) { const w = Sz * 0.5, pt = { s: tk.s, x: x + w / 2, t0: tt, color: tk.color }; x += w + gap; tt += 0.14; return pt; }
        const L = layoutWriting({ text: tk.g, x, y: fx.y, size: Sz, t0: tt, speed: fx.speed || 2400, gap: 0.02, glyphGap: 0.02 });
        x = L.x + L.width + gap; tt = L.tEnd; return { L, color: tk.color };
      });
      fx.width = x - gap; fx.tEnd = tt;
      const dx = fx.anchor === 'middle' ? fx.x - fx.width / 2 : fx.x;
      fx._parts.forEach(pt => {
        if (pt.L) { pt.L.strokes.forEach(s => { s.pts = s.pts.map(q => [q[0] + dx, q[1], q[2]]); }); pt.L.boxes.forEach(b => { b.x += dx; }); pt.L.x += dx; } else pt.x += dx;
      });
      fx.x0 = dx;
      return fx;
    },
    draw(fx, t) {
      const Sz = fx.size, z = fx.z ?? Z.board;
      fx._parts.forEach((pt, i) => {
        const col = pt.color === 'red' ? C.red : C.ink;
        if (pt.L) { pt.L.strokes.forEach((s, j) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke(`${fx.id}.p${i}.${j}`, s.pts, { z, w: fx.w || 5.5, color: col, draw: q, boil: 0.55 }); }); return; }
        const q = clamp((t - pt.t0) / 0.12); if (q <= 0) return;
        text(`${fx.id}.p${i}`, pt.s, pt.x, fx.y + Sz * 0.58, { size: Sz * 1.12, font: CFG.FONT_MIX, color: col, z, opacity: q, scale: lerp(1.35, 1, EASE.out(q)) });
      });
    },
    cues: fx => fx._parts.map(pt => [pt.L ? pt.L.t0 : pt.t0, 'pen']),
  };
  /** the floor line, drawn on like the engine's (so it can live inside a fading group) */
  PROPS.d5_floor = (fx, t, lt, p) => stroke(fx.id, [[20, FL], [800, FL + 2], [1580, FL - 1]], { z: Z.set, w: 2.2, color: C.pencil, draw: p, opacity: 0.8 });

  /* ---------------- L1: 第六题 ★★ ---------------- */
  COMP.d5_stars = {
    draw(fx, t) {
      fx.stars.forEach(([x, y, t0, rot], i) => {
        const lt = t - t0; if (lt < 0) return;
        const pop = Math.max(0.01, EASE.back(clamp(lt / 0.25))), R = fx.r * pop, rr = R * 0.46, pts = [];
        for (let j = 0; j < 10; j++) { const a = (-90 + rot + j * 36) * RAD, r = j % 2 ? rr : R; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r, 1]); }
        pts.push([pts[0][0], pts[0][1], 1]);
        stroke(`${fx.id}.${i}`, pts, { z: Z.annot - 1, w: 5.5, fill: C.paper });
      });
    },
    cues: fx => fx.stars.map(s => [s[2], 'plip']),
  };

  /* ---------------- L2: the problem committee at a long table ---------------- */
  const TBL = { cx: 800, top: 585, w: 1240 };
  const CX = [300, 480, 660, 940, 1120, 1300], CHIP = TBL.top + 34;
  PROPS.d5_table = (fx, t, lt, p) => {
    const w = fx.w, h = FL - fx.top, k = fx.id, z = Z.front + 1;
    stroke(k + '.slab', superPts(0, 9, w, 20, 18, 7), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.cloth', [[-w / 2 + 14, 19], [w / 2 - 14, 19, 1], [w / 2 - 8, h, 1], [-w / 2 + 8, h, 1], [-w / 2 + 14, 19, 1]], { z: z - 0.1, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    const n = Math.round(w / 170);
    for (let i = 1; i < n; i++) { const x = -w / 2 + (w / n) * i; stroke(k + '.fold' + i, [[x, 44], [x + 3, h - 14]], { z: z - 0.05, w: 2, color: C.pencil, opacity: 0.55, draw: stag(p, 2, 3), boil: 0.4 }); }
    (fx.papers || []).forEach((x, i) => stroke(k + '.pp' + i, [[x - 34, 3], [x + 28, 3, 1], [x + 36, 12, 1], [x - 26, 12, 1], [x - 34, 3, 1]], { z: z + 0.5, w: 3, fill: C.paper, draw: stag(p, 2, 3) }));
    if (p > 0.8) shadow(k + '.sh', 0, h + 4, w + 30, 1);
  };

  /* ---------------- L3: four experts, one desk each, and a clock ---------------- */
  const XX = [225, 505, 1095, 1375], DTOP = 600, XHIP = DTOP + 34;
  PROPS.d5_desk = (fx, t, lt, p) => {
    const w = 210, h = FL - DTOP, k = fx.id, z = Z.desk;
    stroke(k + '.slab', superPts(0, 9, w, 20, 16, 7), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.panel', [[-w / 2 + 12, 19], [w / 2 - 12, 19, 1], [w / 2 - 12, h, 1], [-w / 2 + 12, h, 1], [-w / 2 + 12, 19, 1]], { z: z - 0.1, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(k + '.drawer', [[-w / 2 + 36, 46], [w / 2 - 36, 46, 1], [w / 2 - 36, 92, 1], [-w / 2 + 36, 92, 1], [-w / 2 + 36, 46, 1]], { z: z - 0.05, w: 3, draw: stag(p, 2, 3) });
    stroke(k + '.knob', [[-10, 69], [10, 69]], { z: z - 0.05, w: 3.5, draw: stag(p, 2, 3) });
    stroke(k + '.pp', [[-40, 3], [26, 3, 1], [36, 12, 1], [-30, 12, 1], [-40, 3, 1]], { z: z + 0.5, w: 3, fill: C.paper, draw: stag(p, 2, 3) });
    if (p > 0.8) shadow(k + '.sh', 0, h + 4, w + 24, 1);
  };
  const CLK = { at: [800, 330], r: 108 };
  COMP.d5_clock = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, p = EASE.out(clamp(lt / 0.4)), [cx, cy] = CLK.at, R = CLK.r, k = fx.id, z = Z.board;
      stroke(k + '.fill', ringPts(k + '.f', cx, cy, R, R, { n: 16, closed: true, rv: 0.015 }), { z: z - 0.1, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke(k + '.rim', ringPts(k + '.r', cx, cy, R, R, { n: 16, a0: -100, sweep: 370, rv: 0.015 }), { z, w: 6, draw: p });
      for (let i = 0; i < 12; i++) {
        const a = i * 30 * RAD, big = i % 3 === 0, r0 = R * (big ? 0.72 : 0.8), r1 = R * 0.9;
        stroke(k + '.tk' + i, [[cx + Math.sin(a) * r0, cy - Math.cos(a) * r0], [cx + Math.sin(a) * r1, cy - Math.cos(a) * r1]], { z, w: big ? 5 : 3, draw: clamp((lt - 0.2 - i * 0.015) / 0.1) });
      }
      // 6 hours: the hour hand goes from 12 to 6 (half a turn) while the minute hand spins round six times
      const u = clamp((t - fx.s0) / (fx.s1 - fx.s0)), ha = 180 * u, ma = 360 * 6 * u;
      const hand = (key, ang, L, w) => { const a = ang * RAD; stroke(k + key, [[cx, cy], [cx + Math.sin(a) * L, cy - Math.cos(a) * L]], { z: z + 0.2, w, draw: clamp((lt - 0.3) / 0.15), bow: 0.2 }); };
      hand('.mh', ma, R * 0.74, 5); hand('.hh', ha, R * 0.48, 9);
      if (lt > 0.35) dot(k + '.c', [cx, cy], 8, C.ink, z + 0.3);
      if (u > 0) {
        const RA = R + 24, pts = [];
        for (let i = 0; i <= 16; i++) { const a = ha * i / 16 * RAD; pts.push([cx + Math.sin(a) * RA, cy - Math.cos(a) * RA]); }
        stroke(k + '.arc', pts, { z: Z.annot, w: 5, color: C.red, boil: 0.6 });
        if (u > 0.9) {   // arrow head at the moving end, along the clockwise tangent
          const a = ha * RAD, e = [cx + Math.sin(a) * RA, cy - Math.cos(a) * RA], tg = [Math.cos(a), Math.sin(a)], nr = [Math.sin(a), -Math.cos(a)], hl = 20;
          stroke(k + '.ah', [[e[0] - tg[0] * hl + nr[0] * hl * 0.6, e[1] - tg[1] * hl + nr[1] * hl * 0.6], [e[0], e[1], 1], [e[0] - tg[0] * hl - nr[0] * hl * 0.6, e[1] - tg[1] * hl - nr[1] * hl * 0.6]], { z: Z.annot, w: 5, color: C.red });
        }
      }
    },
    cues: fx => { const c = [[fx.t0, 'pen']]; for (let x = fx.s0; x < fx.s1; x += 0.3) c.push([x, 'tap']); return c.concat([[fx.s1, 'ding']]); },
  };

  /* ---------------- L4: 268 contestants, 11 full marks ---------------- */
  const NDOT = 268, GCOL = 27, GROW = Math.ceil(NDOT / GCOL), GP = 34, GCEN = [760, 455];
  const ORDER = Array.from({ length: NDOT }, (_, i) => i).sort((a, b) => rnd(hstr('d5six.grid'), a, 1) - rnd(hstr('d5six.grid'), b, 1));
  const FULL = ORDER.slice(0, 11).sort((a, b) => a - b);
  if (GROW !== 10 || GCOL * GROW - NDOT !== 2 || new Set(FULL).size !== 11) console.error('d5_six: the grid should be 268 dots with 11 filled');
  const dotC = i => [GCEN[0] + ((i % GCOL) - (GCOL - 1) / 2) * GP, GCEN[1] + (Math.floor(i / GCOL) - (GROW - 1) / 2) * GP];
  const FULL_PICK = FULL.reduce((b, i) => (dotC(i)[0] - 0.3 * Math.abs(dotC(i)[1] - GCEN[1]) > dotC(b)[0] - 0.3 * Math.abs(dotC(b)[1] - GCEN[1]) ? i : b), FULL[0]);
  COMP.d5_grid = {
    draw(fx, t) {
      if (t < T.GRID) return;
      for (let i = 0; i < NDOT; i++) {
        const r = Math.floor(i / GCOL), u = clamp((t - T.GRID - r * 0.06 - (i % GCOL) * 0.005) / 0.15); if (u <= 0) continue;
        const c = dotC(i), j = FULL.indexOf(i);
        stroke('d5six.g' + i, ringPts('d5six.g' + i, c[0], c[1], 11, 11, { n: 8, closed: true, rv: 0.06 }), { z: Z.board, w: 2.6, closed: true, fill: C.paper, opacity: u, boil: 0.5 });
        if (j >= 0) {
          const v = clamp((t - T.FILL - j * 0.09) / 0.15), fl = (t - T.FLASH - j * 0.03) / 0.4, pulse = fl > 0 && fl < 1 ? 1 + 0.5 * Math.sin(Math.PI * fl) : 1;
          if (v > 0) dot('d5six.gf' + i, c, 11.5 * EASE.back(v) * pulse, C.ink, Z.board + 0.1);
        }
      }
    },
    cues: () => [...Array(GROW).keys()].filter(r => r % 2 === 0).map(r => [T.GRID + r * 0.06, 'tap']).concat(FULL.map((_, j) => [T.FILL + j * 0.09, 'plip']), [[T.FLASH, 'ding']]),
  };

  /* ---------------- L6–L8: the problem card (left) ---------------- */
  const CARD = [40, 100, 740, 700], CCX = 390;
  const FS = 66, NUMY = 336, BARY = 424, DENY = 444;
  const numE = { type: 'd5_expr', id: 'd5six.num', tokens: [{ s: 'a' }, { g: '×' }, { s: 'a' }, { g: ' + ' }, { s: 'b' }, { g: '×' }, { s: 'b' }], x: CCX, y: NUMY, size: FS, t0: T.NUM, anchor: 'middle' };
  const denE = { type: 'd5_expr', id: 'd5six.den', tokens: [{ s: 'a' }, { g: '×' }, { s: 'b' }, { g: ' + 1' }], x: CCX, y: DENY, size: FS, t0: T.DEN + 0.15, anchor: 'middle' };
  COMP.d5_expr.init(numE); COMP.d5_expr.init(denE); numE._d5 = denE._d5 = 1;
  const BARW = Math.max(numE.width, denE.width) / 2 + 26;
  const ST = { y: 600, size: 54 };
  const ST1X = 145, IMP0 = ST1X + 3 * ST.size + 22, IMP1 = IMP0 + 64, ST2X = IMP1 + 22;
  const HI_RECT = [ST2X + ST.size, ST.y - ST.size / 2, 3 * ST.size, ST.size];

  /* ---------------- L9–L10, L15: the working (right column) ---------------- */
  const RC = 1280, RCL = 1160, RS = 44, RY = [180, 248, 305, 318, 382];
  const exAB = { type: 'd5_expr', id: 'd5six.ex0', tokens: [{ s: 'a' }, { g: `=${A0}, ` }, { s: 'b' }, { g: `=${B0}` }], x: RC, y: RY[0], size: RS, t0: T.EX0, anchor: 'middle' };
  const ex1 = W('d5six.ex1', S.top0, RC, RY[1], RS, T.EX1, { anchor: 'middle' });
  const ex2 = W('d5six.ex2', S.bot0, RC, RY[3], RS, T.EX2, { anchor: 'middle' });
  const ex3 = W('d5six.ex3', S.div0, RCL, RY[4], RS, T.EX3);
  const ex4 = W('d5six.ex4', S.sq, ex3.xEnd + 6, RY[4], RS, T.EX4, { color: 'red' });
  const ex5 = W('d5six.ex5', '✓', ex4.xEnd + 14, RY[4] - 4, 48, T.EX5, { color: 'red' });
  const exBar = { type: 'd5_lines', id: 'd5six.exbar', list: [{ pts: [[RC - 128, RY[2]], [RC + 128, RY[2]]], t0: T.EXBAR, silent: true }] };
  const ANS4 = boxRect(ex3, ex3.boxes.length - 1);
  const ckAB = { type: 'd5_expr', id: 'd5six.ck0', tokens: [{ s: 'a' }, { g: `=${UP[0]}, ` }, { s: 'b' }, { g: `=${UP[1]}` }], x: RC, y: RY[0], size: RS, t0: T.CK0, anchor: 'middle', speed: 2800 };
  const ck1 = W('d5six.ck1', S.top1, RC, RY[1], RS, T.CK1, { anchor: 'middle', speed: 3400 });
  const ck2 = W('d5six.ck2', S.bot1, RC, RY[3], RS, T.CK2, { anchor: 'middle', speed: 3400 });
  const ck3 = W('d5six.ck3', S.div1, RCL, RY[4], RS, T.CK3);
  const ck4 = W('d5six.ck4', '✓', ck3.xEnd + 14, RY[4] - 4, 48, T.CK4, { color: 'red' });
  const ckBar = { type: 'd5_lines', id: 'd5six.ckbar', list: [{ pts: [[RC - 160, RY[2]], [RC + 160, RY[2]]], t0: T.CKBAR, silent: true }] };

  /* ---------------- the ladder (centre) ---------------- */
  const LAD = { xl0: 898, xl1: 907, xr0: 1082, xr1: 1073, y0: FL + 2, y1: 300, cx: 990 };
  const railX = (s, y) => { const u = (LAD.y0 - y) / (LAD.y0 - LAD.y1); return s < 0 ? lerp(LAD.xl0, LAD.xl1, u) : lerp(LAD.xr0, LAD.xr1, u); };
  const RUNG = { g: 755, a: 620, b: 495, c: 370 };          // (0,2) on the ground, (2,8), (8,30), and one more (not labelled)
  const LBY = y => y - 52, LS = 44, EX = 1100;               // a rung's label sits just above it; “=4” goes right of the ladder
  COMP.d5_ladder = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, z = Z.set + 1, k = fx.id, p = EASE.out(clamp(lt / 0.45));
      [-1, 1].forEach((s, i) => stroke(k + '.rail' + i, [[railX(s, LAD.y0), LAD.y0], [railX(s, LAD.y1), LAD.y1]], { z, w: 6, draw: p }));
      [-1, 1].forEach((s, i) => stroke(k + '.foot' + i, [[railX(s, LAD.y0) - 12, LAD.y0], [railX(s, LAD.y0) + 12, LAD.y0]], { z, w: 5, draw: p }));
      [[RUNG.a, 0.35], [RUNG.b, 0.45], [RUNG.c, 0.55]].forEach(([y, d], i) => {
        const q = EASE.out(clamp((lt - d) / 0.16)); if (q <= 0) return;
        stroke(k + '.r' + i, [[railX(-1, y), y], [lerp(railX(-1, y), railX(1, y), q), y]], { z, w: 5 });
      });
      const g = EASE.out(clamp((t - T.GRUNG) / 0.2));   // the ground rung comes later, when the climb gets there
      if (g > 0) stroke(k + '.rg', [[railX(-1, RUNG.g), RUNG.g], [lerp(railX(-1, RUNG.g), railX(1, RUNG.g), g), RUNG.g]], { z, w: 5 });
      // it goes on up: three pencil dots above the top
      [0, 1, 2].forEach(j => { if (lt > 0.6 + j * 0.06) dot(k + '.d' + j, [LAD.cx, LAD.y1 - 22 - j * 20], 4.5, C.pencil, z); });
    },
    cues: fx => [[fx.t0, 'pen'], [fx.t0 + 0.35, 'tap'], [fx.t0 + 0.45, 'tap'], [fx.t0 + 0.55, 'tap'], [T.GRUNG, 'pop']],
  };
  const lb28 = W('d5six.lb28', S.r28, LAD.cx, LBY(RUNG.a), LS, T.LB28, { anchor: 'middle' });
  const L8q = layoutWriting({ text: S.r8q, x: LAD.cx, y: LBY(RUNG.b), size: LS, t0: 0, speed: 1, anchor: 'middle' });
  const lb8a = W('d5six.lb8a', `(${UP[0]},`, L8q.boxes[0].x, LBY(RUNG.b), LS, T.LB8Q);
  const lb8q = W('d5six.lb8q', '?', L8q.boxes[3].x, LBY(RUNG.b), LS, lb8a.tEnd + 0.15, { color: 'red' });
  const lb8b = W('d5six.lb8b', ')', L8q.boxes[4].x, LBY(RUNG.b), LS, lb8q.tEnd + 0.05);
  const lb830 = W('d5six.lb830', S.r830, LAD.cx, LBY(RUNG.b), LS, T.N30 + 0.1, { anchor: 'middle' });
  const lb02 = W('d5six.lb02', S.r02, LAD.cx, LBY(RUNG.g), LS, T.LB02, { anchor: 'middle' });
  // the formula for the "?": ? = 4 × 8 − 2 (the 4 in red: it is the answer we just got) … = 30
  const f0 = W('d5six.f0', '?', EX, LBY(RUNG.b), LS, T.FORM, { color: 'red' });
  const f1 = W('d5six.f1', '=', f0.xEnd, LBY(RUNG.b), LS, f0.tEnd + 0.05);
  const f2 = W('d5six.f2', String(K), f1.xEnd, LBY(RUNG.b), LS, f1.tEnd + 0.1, { color: 'red' });
  const f3 = W('d5six.f3', S.times, f2.xEnd, LBY(RUNG.b), LS, f2.tEnd + 0.1);
  const f4 = W('d5six.f4', S.eq30, f3.xEnd, LBY(RUNG.b), LS, T.EQ30);
  const F4C = [f2.boxes[0].x + f2.boxes[0].w / 2, LBY(RUNG.b) + LS + 6];
  // the ground rung, worked out; then "= 4" lights up rung by rung, bottom to top
  const g0 = W('d5six.g0', S.ground, EX, LBY(RUNG.g) + 4, 40, T.G0, { speed: 2600 });
  const g1 = W('d5six.g1', S.sq, g0.xEnd + 6, LBY(RUNG.g) + 4, 40, T.G1, { color: 'red' });
  const G_EQ4 = boxRect(g0, g0.boxes.length - 2);
  const e28 = W('d5six.e28', S.eq4, EX, LBY(RUNG.a), LS, T.LIGHT[0], { color: 'red' });
  const e830 = W('d5six.e830', S.eq4, EX, LBY(RUNG.b), LS, T.LIGHT[1], { color: 'red' });
  const eTop = W('d5six.etop', S.eq4, EX, LBY(RUNG.c), LS, T.LIGHT[2], { color: 'red' });
  const e22 = W('d5six.e22', S.sq, e830.xEnd + 16, LBY(RUNG.b), LS, T.TOP22, { color: 'red' });
  const lbRect = L => [L.x, L.y, L.width, L.size];

  /* ---------------- 小问号 climbs down beside the ladder ---------------- */
  const QX = 872, QS = 130;
  const qmPos = t => {
    const hop = (u, y0, y1, h) => [QX, lerp(y0, y1, u) - Math.sin(Math.PI * u) * h];
    if (t < T.HOP1) return [QX, RUNG.b];
    if (t < T.HOP2) return hop(EASE.io(clamp((t - T.HOP1) / 0.35)), RUNG.b, RUNG.a, 34);
    return hop(EASE.io(clamp((t - T.HOP2) / 0.4)), RUNG.a, FL, 34);
  };

  /* ---------------- L20: the key ---------------- */
  const KEY = { at: [420, 450] };
  const KEYTXT = '每架梯子都能爬到 0';
  COMP.d5_key = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, pop = Math.max(0.01, EASE.back(clamp(lt / 0.35))), [x, y] = KEY.at, k = fx.id, z = Z.board;
      DL.save(); DL.translate(x, y); DL.scale(pop); DL.rotate(-4);
      const bx = -262, R = 76;
      stroke(k + '.bowF', ringPts(k + '.bf', bx, 0, R, R, { n: 14, closed: true, rv: 0.03 }), { z: z - 0.1, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke(k + '.bow', ringPts(k + '.b', bx, 0, R, R, { n: 14, a0: 20, sweep: 322, rv: 0.03 }), { z, w: 6 });
      stroke(k + '.hole', ringPts(k + '.h', bx - 6, 0, 28, 28, { n: 10, closed: true, rv: 0.05 }), { z, w: 5, closed: true });
      const s0 = bx + R * 0.93, H = 30;
      stroke(k + '.shaft', [[s0, -H], [262, -H, 1], [262, H, 1], [214, H, 1], [214, H + 48, 1], [186, H + 48, 1], [186, H + 22, 1], [160, H + 22, 1], [160, H + 52, 1], [130, H + 52, 1], [130, H, 1], [s0, H]], { z, w: 6, fill: C.paper });
      const tp = t - fx.tText;
      if (tp >= 0) {
        const chars = [...KEYTXT], n = Math.min(chars.length, Math.floor(tp * 7) + 1);
        text(k + '.t', chars.slice(0, n).join(''), -150, 2, { size: 40, color: C.red, z: Z.annot, anchor: 'start' });
      }
      (fx.shine || []).forEach((st, j) => {
        const u = (t - st) / 0.5; if (u < 0 || u > 1) return;
        for (let i = 0; i < 4; i++) {
          const a = (-150 + i * 34) * RAD, r0 = R + 14, L = 26 * Math.sin(Math.PI * u);
          stroke(k + '.sh' + j + i, [[bx + Math.cos(a) * r0, Math.sin(a) * r0], [bx + Math.cos(a) * (r0 + L), Math.sin(a) * (r0 + L)]], { z, w: 4 });
        }
      });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pop'], [fx.tText, 'pen'], [fx.tText + 0.6, 'pen'], ...(fx.shine || []).map(s => [s, 'ding'])],
  };

  /* ---------------- cast ---------------- */
  // seated head-scratching with longer arms (like the engine's scratchStand), so the elbow swings out and the arm stays off the face;
  // the free arm hangs down behind the table
  const SITA = { sit: 1, legScale: 0.85, thigh: 0.25, legL: [62, -57], legR: [62, -57] };
  const HEADR = { w: 1, to: 'head', dx: 1.0, dy: -0.95, bend: 'out' }, HEADL = { w: 1, to: 'head', dx: -1.0, dy: -0.95, bend: 'out' };
  Object.assign(POSE, {
    d5_scratchR: { ...SITA, tilt: 8, armScale: 1.6, ikR: HEADR, armL: [12, 6] },
    d5_scratchL: { ...SITA, tilt: -8, armScale: 1.6, ikL: HEADL, armR: [12, 6] },
    d5_both: { ...SITA, armScale: 1.6, ikL: HEADL, ikR: HEADR },
  });
  const COMM = [
    { hair: 'messy', pose: 'd5_scratchR', face: 'puzzled', turn: 0.2 },
    { hair: 'bob', pose: 'thinkChin', face: 'focus', turn: 0.15 },
    { hair: 'part', glasses: true, pose: 'd5_scratchL', face: 'puzzled', turn: 0.1 },
    { hair: 'sides', pose: 'd5_both', face: 'effort', turn: -0.1 },
    { hair: 'curly', glasses: true, pose: 'chinHand', face: 'puzzled', turn: -0.15 },
    { hair: 'ponytail', pose: 'd5_scratchL', face: 'puzzled', turn: -0.2 },
  ];
  const XPERT = [
    { hair: 'sides', glasses: true, after: 'd5_both', side: -1 },
    { hair: 'curly', after: 'thinkChin', side: -1 },
    { hair: 'part', glasses: true, after: 'chinHand', side: 1 },
    { hair: 'messy', after: 'd5_both', side: 1 },
  ];
  const shake = (t0, base, amp = 0.36, dur = 0.95) => t => (t >= t0 && t < t0 + dur ? base + amp * Math.sin((t - t0) * 2 * Math.PI * 2.6) * (1 - (t - t0) / dur) : base);
  const cast = {}, tracks = {}, order = [];
  COMM.forEach((m, i) => {
    const id = 'd5c' + i, x = CX[i];
    cast[id] = { ...E5.expert, H: 300, hair: m.hair, glasses: !!m.glasses, desk: [x, TBL.top + 2], blink: [3.6 + i * 0.17, i * 0.6] };
    tracks[id] = {
      enter: T.CIN + i * 0.09,
      pos: [[0, [x, CHIP]], [T.COUT, [x - 1750, CHIP], 0.3, 'in']],
      pose: [[0, m.pose]],
      face: [[0, m.face], [T.SHAKE1, 'sheepish', 0.08]],
      turn: [[0, shake(T.SHAKE1 + i * 0.05, m.turn)]],
      gaze: [[0, [x, TBL.top + 8]], [T.SHAKE1, 'viewer']],
    };
    order.push(id);
  });
  XPERT.forEach((m, i) => {
    const id = 'd5x' + i, x = XX[i];
    cast[id] = { ...E5.expert, H: 330, hair: m.hair, glasses: !!m.glasses, desk: [x, DTOP + 2], blink: [3.9 + i * 0.21, 1.3 + i * 0.5] };
    tracks[id] = {
      enter: T.XIN + i * 0.1,
      pos: [[0, [x, XHIP]], [T.XOUT, [x + m.side * 900, XHIP], 0.3, 'in']],
      pose: [[0, 'armsDesk'], [T.SHAKE2 - 0.1, m.after, 0.12, 'back']],
      face: [[0, 'focus'], [T.EFFORT + i * 0.1, 'effort', 0.08], [T.SHAKE2, 'puzzled', 0.06]],
      turn: [[0, shake(T.SHAKE2 + 0.25 + i * 0.06, -0.12 * m.side)]],
      gaze: [[0, [x, DTOP + 8]], [12.3 + i * 0.08, 'clock'], [T.SHAKE2, 'viewer']],
    };
    order.push(id);
  });
  cast.terry = E5.terry;
  const walkIn = makeWalk(T.WALK_IN, T.WALK_IN1, 5.2), walkOut = makeWalk(T.WALK_OUT, T.WALK_OUT1, 5.2);
  tracks.terry = {
    enter: T.WALK_IN - 0.05,
    pos: [[0, [1700, FL]], [T.WALK_IN, [1210, FL], T.WALK_IN1 - T.WALK_IN, 'lin'], [T.WALK_OUT, [1740, FL], T.WALK_OUT1 - T.WALK_OUT, 'lin']],
    pose: [[0, t => (t < T.WALK_OUT ? walkIn(t) : walkOut(t))]],
    face: [[0, 'focus']],
    turn: [[0, -0.35], [T.WALK_IN1, -0.15, 0.12], [T.WALK_OUT - 0.1, 0.45, 0.1]],
    gaze: [[0, 'viewer'], [T.WALK_IN1 - 0.1, 'box6'], [T.WALK_OUT - 0.1, [1800, 560]]],
  };
  order.push('terry');

  /* ---------------- the score sheet (three appearances: as scene 30 left it, the 1 point, and as scene 40 picks it up) ---------------- */
  const sheet = (id, t0, scores, ringT) => ({ type: 'e5_scores', id, at: SH.at, cell: CELL, t0, scores, ringT });
  const NONE = [null, null, null, [7, -1], null, null];

  defineScene({
    id: 'six', chapter: '第六题', dur: T.DUR, floor: FL,
    cast, tracks, order,
    targets: () => ({ box6: [cellX(5), SH.at[1]], clock: CLK.at }),
    steps: [{ t0: T.WALK_IN, t1: T.WALK_IN1, hz: 5.2 }, { t0: T.WALK_OUT, t1: T.WALK_OUT1, hz: 5.2 }],
    fx: [
      { type: 'ageStamp', age: 12, t0: -3, ...E5.STAMP, dockT: -2 },

      // L1: the sheet as scene 30 left it; box 6 gets a red ring; 第六题 ★★ — 超级难题
      { type: 'd5_fade', id: 'd5six.sh1F', out: T.SHEET1_OUT, about: SH.at, shrink: 0.4, whoosh: true, inner: sheet('d5six.sh1', -1, NONE, [[5, T.RING1]]) },
      { type: 'd5_fade', id: 'd5six.ttlF', out: T.TITLE_OUT, about: [800, 480], shrink: 0.3, whoosh: true, inner: [
        { type: 'title', id: 'd5six.ttl', text: '第六题', x: 610, y: 470, size: 130, t0: T.TITLE, sfx: 'stamp' },
        { type: 'd5_stars', id: 'd5six.stars', r: 52, stars: [[905, 462, T.STAR[0], -8], [1010, 456, T.STAR[1], 6]] },
        { type: 'label', id: 'd5six.super', text: '超级难题', at: [1225, 610], rot: -4, size: 60, t0: T.SUPER, t1: T.DUR, target: [1035, 512], bend: 0.25, gap: 14 },
      ] },

      // L2: the committee (6), scratching their heads
      { type: 'd5_fade', id: 'd5six.floorAF', out: T.XOUT, inner: { type: 'prop', id: 'd5six.floorA', kind: 'd5_floor', at: [0, 0], t0: T.TABLE } },
      { type: 'prop', id: 'd5six.table', kind: 'd5_table', w: TBL.w, top: TBL.top, papers: CX.map(x => x - TBL.cx), t0: T.TABLE, drawDur: 0.4,
        pos: [[0, [TBL.cx, TBL.top]], [T.COUT, [TBL.cx - 1750, TBL.top], 0.3, 'in']] },
      { type: 'd5_fade', id: 'd5six.commF', out: T.COUT, dur: 0.25, inner: [
        { type: 'label', id: 'd5six.comm', text: '选题委员会（6 人）', at: [800, 236], rot: -2, size: 56, t0: T.COMM, t1: T.DUR },
        { type: 'mark', id: 'd5six.q', char: '?', on: order.slice(0, 6), t0: T.MARKS, t1: T.DUR, stagger: 0.14 },
      ] },

      // L3: four number theorists, six hours each
      ...XX.map((x, i) => ({ type: 'prop', id: 'd5six.desk' + i, kind: 'd5_desk', t0: T.DESKS, drawDur: 0.4,
        pos: [[0, [x, DTOP]], [T.XOUT, [x + XPERT[i].side * 900, DTOP], 0.3, 'in']] })),
      { type: 'd5_fade', id: 'd5six.clkF', out: T.XOUT, about: CLK.at, shrink: 0.4, inner: [
        { type: 'd5_clock', id: 'd5six.clk', t0: T.CLOCK, s0: T.H0, s1: T.H1 },
        { type: 'label', id: 'd5six.six', text: '6 小时', at: [1040, 296], rot: -3, size: 56, t0: T.SIX, t1: T.DUR },
      ] },

      // L4: 268 dots, 11 filled in
      { type: 'd5_fade', id: 'd5six.gridF', out: T.GOUT, about: GCEN, shrink: 0.15, inner: [
        { type: 'd5_grid', id: 'd5six.grid' },
        { type: 'label', id: 'd5six.l11', text: '11 / 268', at: [1405, 455], rot: -3, size: 64, t0: T.L11, t1: T.DUR, target: dotC(FULL_PICK), bend: 0.2, gap: 18 },
      ] },

      // L5: the sheet comes back: box 6 = 1; Terry beside it (focused, not upset)
      { type: 'd5_fade', id: 'd5six.floorBF', out: T.SHEET2_OUT, inner: { type: 'prop', id: 'd5six.floorB', kind: 'd5_floor', at: [0, 0], t0: T.SHEET2 } },
      { type: 'd5_fade', id: 'd5six.sh2F', out: T.SHEET2_OUT, about: SH.at, shrink: 0.4, whoosh: true,
        inner: sheet('d5six.sh2', T.SHEET2, [null, null, null, [7, -1], null, [E5.S88[5], T.ONE]], [[5, T.RING2]]) },

      // L6–L8: the problem card
      { type: 'd5_fade', id: 'd5six.cardF', out: T.CARD_OUT, whoosh: true, inner: [
        { type: 'factCard', id: 'd5six.card', box: CARD, topic: '魔法分数', stamp: '第六题', t0: T.CARD },
        { type: 'scribe', id: 'd5six.ab', text: 'a、b：正整数', x: CCX - 138, y: 296, size: 46, t0: T.AB, cps: 9, z: Z.board },
        numE,
        { type: 'd5_lines', id: 'd5six.bar', list: [{ pts: [[CCX - BARW, BARY], [CCX + BARW, BARY - 2]], t0: T.BAR, w: 5.5 }] },
        denE,
        { type: 'scribe', id: 'd5six.st1', text: '是整数', x: ST1X, y: ST.y, size: ST.size, t0: T.ST1, cps: 8, z: Z.board },
        { type: 'd5_lines', id: 'd5six.imp', list: [
          { pts: [[IMP0, ST.y - 9], [IMP1 - 10, ST.y - 9]], t0: T.IMP, dur: 0.15 },
          { pts: [[IMP0, ST.y + 9], [IMP1 - 10, ST.y + 9]], t0: T.IMP + 0.08, dur: 0.15, silent: true },
          { pts: [[IMP1 - 22, ST.y - 22], [IMP1, ST.y, 1], [IMP1 - 22, ST.y + 22]], t0: T.IMP + 0.18, dur: 0.15, silent: true },
        ] },
        { type: 'scribe', id: 'd5six.st2', text: '是平方数', x: ST2X, y: ST.y, size: ST.size, t0: T.ST2, cps: 8, z: Z.board },
        { type: 'band', id: 'd5six.hi', rect: HI_RECT, t0: T.BAND, dur: 0.45, pad: 8 },
      ] },

      // L9–L10: try a = 2, b = 8
      { type: 'd5_fade', id: 'd5six.exF', out: T.EXOUT, whoosh: true, inner: [exAB, ex1, exBar, ex2, ex3, ex4, ex5] },

      // L11–L20: the ladder and everything written on and beside it
      { type: 'd5_fade', id: 'd5six.ladF', out: T.END, dur: 0.35, inner: [
        { type: 'prop', id: 'd5six.floorC', kind: 'd5_floor', at: [0, 0], t0: T.LAD },
        { type: 'd5_ladder', id: 'd5six.lad', t0: T.LAD },
        lb28, lb830, lb02,
        { type: 'ringRect', id: 'd5six.rA', rect: lbRect(lb830), t0: T.RA, t1: T.RB, pad: 10 },
        { type: 'ringRect', id: 'd5six.rB', rect: lbRect(lb28), t0: T.RB, t1: T.RC, pad: 10 },
        { type: 'ringRect', id: 'd5six.rC', rect: lbRect(lb02), t0: T.RC, t1: T.RC1, pad: 10 },
        g0, g1,
        { type: 'ringRect', id: 'd5six.rG', rect: G_EQ4, t0: T.LIGHT0, t1: T.CARD_OUT, pad: 4 },
        e28, e830, eTop, e22,
      ] },
      { type: 'd5_fade', id: 'd5six.lb8F', out: T.N30, dur: 0.2, inner: [lb8a, lb8q, lb8b] },
      { type: 'd5_fade', id: 'd5six.formF', out: T.CKOUT, whoosh: true, inner: [f0, f1, f2, f3, f4] },
      { type: 'd5_fade', id: 'd5six.ansF', out: T.TURN_OUT, inner: [
        { type: 'label', id: 'd5six.ans', text: '= 刚才的答案', at: [1232, 556], rot: -2, size: 40, t0: T.ANS, t1: T.DUR, target: F4C, bend: -0.25, gap: 8 },
        { type: 'ringRect', id: 'd5six.rAns', rect: ANS4, t0: T.ANS + 0.15, pad: 5 },
      ] },

      // L13: your turn (the player pauses at T.PAUSE)
      { type: 'd5_fade', id: 'd5six.turnF', out: T.TURN_OUT, inner: { type: 'title', id: 'd5six.turn', text: '轮到你了！', x: 955, y: 128, size: 80, t0: T.TURN, color: 'red', rot: -3, sfx: 'stamp' } },

      // L15: check (8, 30) in the same place
      { type: 'd5_fade', id: 'd5six.ckF', out: T.CKOUT, whoosh: true, inner: [ckAB, ck1, ckBar, ck2, ck3, ck4] },

      // L16–L19: 小问号 climbs down (8,30) → (2,8) → (0,2)
      { type: 'd5_fade', id: 'd5six.qmF', out: T.END, dur: 0.35, inner: {
        type: 'qm', id: 'd5six.qm', size: QS, t0: T.QIN, burst: true, pos: [[0, qmPos]],
        mood: [[0, 'neutral'], [T.QHAPPY, 'happy'], [T.KEY, 'surprised'], [T.KEYSHINE, 'happy']],
        act: [[0, 'idle'], [T.QHAPPY, 'nod'], [T.QHAPPY + 1.1, 'idle'], [T.KEYSHINE, 'nod'], [T.KEYSHINE + 1.1, 'idle']],
        gaze: [[0, [LAD.cx, RUNG.a]], [T.HOP1 - 0.2, [LAD.cx, RUNG.a + 40]], [T.RB + 0.3, [LAD.cx, RUNG.g]], [T.G0, [1250, 720]],
          [T.LIGHT0, [1130, 720]], [T.LIGHT[0], [1130, 590]], [T.LIGHT[1], [1130, 465]], [T.LIGHT[2], [1130, 340]], [T.TOP22, [1220, 465]],
          [T.KEY, [500, 450]], [T.KEYSHINE + 0.6, 'viewer']],
        sfxAt: [[T.HOP1, 'hop'], [T.HOP1 + 0.35, 'tap'], [T.HOP2, 'hop'], [T.HOP2 + 0.4, 'tap']],
      } },

      // L20: the key
      { type: 'd5_fade', id: 'd5six.keyF', out: T.END, dur: 0.35, about: KEY.at, shrink: 0.3, inner: { type: 'd5_key', id: 'd5six.key', t0: T.KEY, tText: T.KEYTXT, shine: [T.KEYSHINE] } },

      // the end: the sheet is left for scene 40 (box 4 = 7, box 6 = 1)
      sheet('d5six.sh3', T.SHEET3, [null, null, null, [7, -1], null, [E5.S88[5], -1]]),
    ],
    sfx: [[T.END, 'whoosh'], [T.COUT, 'whoosh'], [T.XOUT, 'whoosh'], [T.GOUT, 'whoosh']],
    pauses: [T.PAUSE],
    subs: [
      { t0: 0.3, t1: 4.5, text: '第六题，是一道出了名的超级难题。' },
      { t0: 5.0, t1: 9.6, text: '选题委员会的六个人，没有一个做出来。' },
      { t0: 10.0, t1: 14.6, text: '四位数论专家各做六小时，也没做出来。' },
      { t0: 15.2, t1: 20.2, text: '全场268人，只有11个人拿了满分。', say: '全场两百六十八人，只有十一个人拿了满分。' },
      { t0: 20.6, t1: 24.0, text: '小陶这道题，只拿了1分。', say: '小陶这道题，只拿了一分。' },
      { t0: 24.9, t1: 27.3, text: '题目是这样的：' },
      { t0: 27.4, t1: 31.6, text: '两个正整数a和b，算一个“魔法分数”：', say: '两个正整数 a 和 b，算一个魔法分数：' },
      { t0: 32.9, t1: 37.1, text: '如果它是整数，它就一定是平方数！' },
      { t0: 37.8, t1: 41.0, text: '试试a=2，b=8：', say: '试试 a 等于二，b 等于八：' },
      { t0: 41.4, t1: 46.2, text: '68÷17=4，正好是2×2！', say: '六十八除以十七，等于四，正好是二乘二！' },
      { t0: 46.9, t1: 50.5, text: '从（2，8）出发，有一架梯子：', say: '从二和八出发，有一架梯子：' },
      { t0: 50.9, t1: 55.9, text: '下一级（8，？）：用4×8−2来算。', say: '下一级是八和问号：问号用四乘八减二来算。' },
      { t0: 56.4, t1: 60.6, text: '轮到你了：算出问号，再验算一下。' },
      { t0: 61.3, t1: 64.5, text: '4×8−2=30。', say: '四乘八减二，等于三十。' },
      { t0: 65.6, t1: 70.0, text: '964÷241，还是4！', say: '九百六十四除以二百四十一，还是四！' },
      { t0: 70.7, t1: 73.3, text: '梯子还能往下爬：' },
      { t0: 73.4, t1: 77.0, text: '（8，30）→（2，8）→（0，2）。', say: '八和三十，二和八，零和二。' },
      { t0: 77.4, t1: 80.8, text: '爬到0，分数就是2×2。', say: '爬到零，分数就是二乘二。' },
      { t0: 81.2, t1: 85.6, text: '答案一路不变，所以开头也是2×2。', say: '答案一路不变，所以开头也是二乘二。' },
      { t0: 86.0, t1: 90.2, text: '钥匙：证明每架梯子都能爬到0。', say: '钥匙：证明每架梯子，都能爬到零。' },
    ],
  });
})();
