// 第 65 场 · 借位（id borrow）。B4，前缀 b2_。53.0 秒。
// 画面（ep2-storyboard.md "借位"）：同屏三组 = 右侧证明栈 / 当前的图 / 角色（Jasper；小问号只在 L6）。
//   L1      "组 | 零头"两栏：16 = 4 组 | 0，− 9 = 2 组 | 1；零头栏 0、1 被红圈圈住，红字"不够减"。组栏的方框是铅笔灰（proof 场说过"以后只盯零头"）。
//   L2      Jasper 说"借"：右上角小卡闪出竖式 20 − 1（十位上一个红色借位点）= 19，只停 2 秒。
//   L3      借位：组栏第 4 个方框被红笔划掉，一个墨色方框滑进零头栏、散成 4 个点；拿走 1 个（和"1"连起来），剩 3 个滑到结果行，
//           框成一格（余 3 = 空心），结果行 7 = 1 组 | 3。全程不出现负号。
//   L4–L5   2×2 情况表（行：大平方的零头；列：小平方的零头）一格一格点亮：(0,0)、(1,1) 实心，(1,0) 斜线，(0,1) 先写 0 − 1，
//           再在前面补红色"4 +"和"借一组"，= 3，空心。"就这四种"：红框圈住整张表，证明栈第 2 行。
//   L6      小问号举牌"没得借？"。
//   L7      b×b（3×3）滑到 a×a（4×4）的左下角，被罩住，多出 Jasper 的 ┐ 那条拐角边；写 a² > b²。
//   L8      跑道条从顶边弹出、放大成四条跑道；b² 的砖（余 1、第 3 轮）和 a² 的砖（余 0、第 5 轮）落进去；
//           红笔按"轮"往下数（0、1、2……），到 b² 时画出它转过的整轮（短括号），到 a² 时画出 a² 的（长括号）：只多不少。证明栈第 3 行"组够减"。
//   L9–L11  要借时：a² 的砖（余 0）提起来、b² 的砖（余 1）被圈；Jasper：a² 放进 b² 那一轮 → 在 b² 前面 → 红字 a² < b²、红叉；
//           跳到后一轮。"多一轮"：b² 那一轮整列红框，一个红色 4 点方框从这一轮掉出来："可借"。证明栈第 4 行。
// 开场 = 顶栏收起 + 议程条 + 证明栈 0–1 行（第 1 行当前）+ 范围卡；结尾 = 同样 + 证明栈 0–4 行（第 4 行当前），其余在 52.3 秒起淡出。
(() => {
  const DUR = 53.0, FL = N2.FL, JX = 112;

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    // L1: the ledger
    hdr: 0.45, r1: 0.6, r1b: 0.95, r1n: 1.5, r2: 1.75, r2b: 2.05, r2n: 2.45, rule: 3.0, ring: 3.95, nope: 4.25,
    // L2: Jasper, the corner card 20 − 1
    kid: 5.2, cheer: 6.6, vc: 7.3, vcDot: 7.95, vcRes: 8.15, vcOut: 9.35,
    // L3: borrow one group
    nopeOut: 10.45, slash: 10.6, slide: 10.85, land: 11.5, take: 12.85, took: 13.15, res: 13.6, frame: 14.05, res3: 14.1, ledOut: 15.15,
    // L4–L5: the 2×2 table
    tab: 15.5, c00: 16.6, c11: 17.35, eq0: 18.35, c10: 20.25, eq1: 21.0, c01: 21.75, brw: 22.35, eq3: 23.05, four: 24.05, st2: 24.35,
    // L6: the question mark
    qm: 25.35, qsign: 25.55, qsOut: 28.8, tabOut: 28.75, qmOut: 28.95,
    // L7: a×a covers b×b
    bb: 29.1, aa: 29.55, bOut: 30.45, slideB: 30.55, corner: 31.7, gt: 32.55, dotsOut: 34.25,
    // L8: lanes, the two bricks, counting rounds
    lanes: 34.45, b2in: 35.15, a2in: 35.65, pen: 35.95, penStep: 0.12, st3: 38.6, brOut: 39.6,
    // L9–L11: when we must borrow
    lift: 40.45, ringA: 40.85, ringB: 42.2, ringsOut: 43.9, tryIn: 44.35, lt: 45.35, cross: 46.15, hopTo: 46.75,
    more: 49.6, box4: 50.2, st4: 50.85, end: 52.3,
  };

  /* ---------------- self-check (all the arithmetic on screen) ---------------- */
  // the four cells: [big remainder r][small remainder c] → what the cell shows
  const CELL = { '0,0': { res: 0 }, '1,1': { res: 0 }, '1,0': { res: 1 }, '0,1': { res: 3, borrow: true } };
  {
    const bad = [], chk = (ok, what) => { if (!ok) bad.push(what); };
    chk(16 === 4 * 4 + 0, '16 = 4 组 + 0'); chk(9 === 4 * 2 + 1, '9 = 2 组 + 1');
    chk(4 + 0 - 1 === 3, '4 + 0 − 1 = 3'); chk(20 - 1 === 19 && (10 - 1) === 9 && 2 - 1 === 1, '20 − 1 = 19（借一个十：10 − 1 = 9，十位 2 − 1 = 1）');
    chk(16 - 9 === 7 && 7 === 4 * (4 - 1 - 2) + 3, '16 − 9 = 7 = 1 组 + 3（借走 1 组后 3 − 2 = 1 组）');
    for (const [rc, v] of Object.entries(CELL)) {
      const [r, c] = rc.split(',').map(Number);
      const want = r >= c ? r - c : r + 4 - c;
      chk(want === v.res && !!v.borrow === r < c, `格 (${r},${c}) = ${v.res}`);
    }
    chk(4 * 4 === 16 && 3 * 3 === 9 && 16 - 9 === 2 * 3 + 1, 'a×a = 4×4 罩住 b×b = 3×3，┐ 有 2×3 + 1 = 7 个点');
    // lanes: n sits in lane n % 4, round floor(n / 4)
    const at = n => [n % 4, Math.floor(n / 4)];
    chk(String(at(9)) === '1,2' && String(at(16)) === '0,4' && String(at(8)) === '0,2' && String(at(12)) === '0,3', '跑道位置：9 → 余1 第3轮，16 → 余0 第5轮，8、12 → 余0');
    // the lemma behind L8–L11, exhaustively for 0 ≤ b < a ≤ 60
    for (let a = 1; a <= 60; a++) for (let b = 0; b < a; b++) {
      const A = a * a, B = b * b, ga = Math.floor(A / 4), gb = Math.floor(B / 4), ra = A % 4, rb = B % 4;
      if (ga < gb) bad.push(`组不够减：${a}² − ${b}²`);
      if (ra < rb && ga <= gb) bad.push(`借不到：${a}² − ${b}²`);
      if ((A - B) % 4 !== (ra >= rb ? ra - rb : ra + 4 - rb)) bad.push(`零头记账不对：${a}² − ${b}²`);
      if ((A - B) % 4 === 2) bad.push(`差余 2：${a}² − ${b}²`);
    }
    if (bad.length) console.error('b2 borrow: ' + bad.join('；'));
  }

  /* ---------------- helpers ---------------- */
  const box = N2.box;
  const fadeIn = (t, t0, d = 0.25) => clamp((t - t0) / d);
  /** one group: a square with 2×2 dots (proof scene: the group columns are pencil grey) */
  const gbox = (k, cx, cy, o = {}) => {
    const s = o.s ?? 1, col = o.color || C.pencil, n0 = DL.items.length, z = o.z ?? Z.board;
    stroke(k + '.b', box(cx - 30 * s, cy - 30 * s, cx + 30 * s, cy + 30 * s), { z, w: 3, color: col, fill: '#FFFFFF' });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], i) => dot(`${k}.d${i}`, [cx + a * 13 * s, cy + b * 13 * s], 6 * s, col, z + 0.1));
    N2.fadeFrom(n0, o.opacity ?? 1);
  };
  /** a red 4-dot box (one group you can borrow) */
  const redGroup = (k, cx, cy, s = 1, op = 1) => {
    const n0 = DL.items.length;
    stroke(k + '.b', superPts(cx, cy, 58 * s, 58 * s, 20, 6), { z: Z.annot, w: 4, color: C.red, closed: true, fill: '#FFFFFF' });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], i) => dot(`${k}.d${i}`, [cx + a * 13 * s, cy + b * 13 * s], 6.5 * s, C.red, Z.annot + 0.1));
    N2.fadeFrom(n0, op);
  };

  /* ---------------- L1–L3: the ledger "组 | 零头" ---------------- */
  const LG = { lab: 340, gx: [400, 472, 544, 616], div: 690, rx: [730, 762, 794, 826], num: 868, y: [331, 421, 516] };
  const LAND = [(LG.rx[0] + LG.rx[3]) / 2, LG.y[0]];       // where the borrowed group lands in the remainder column
  const ONE = [LG.num + 13, LG.y[1]];                     // the "1" of 9's remainder
  COMP.b2_ledger = {
    draw(fx, t) {
      if (t < T.hdr) return;
      const out = clamp((t - T.ledOut) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, z = Z.board, hu = EASE.out(fadeIn(t, T.hdr, 0.4));
      text(k + '.h0', '组', 508, 262, { size: 40, z, anchor: 'middle', opacity: hu });
      text(k + '.h1', '零头', 790, 262, { size: 40, z, anchor: 'middle', opacity: hu });
      stroke(k + '.hl', [[280, 290], [920, 290]], { z, w: 2.5, color: C.pencil, draw: hu });
      stroke(k + '.dv', [[LG.div, 240], [LG.div, 556]], { z, w: 3, draw: hu });
      if (t >= T.rule) stroke(k + '.rule', [[280, 470], [920, 470]], { z, w: 4, draw: EASE.out(fadeIn(t, T.rule, 0.35)) });
      const pop = t0 => Math.max(0.01, EASE.back(fadeIn(t, t0, 0.25)));
      // the groups of 16 (the 4th one is the one that gets borrowed) and of 9
      LG.gx.forEach((x, i) => { if (t >= T.r1b + i * 0.1) gbox(`${k}.a${i}`, x, LG.y[0], { s: pop(T.r1b + i * 0.1) }); });
      LG.gx.slice(0, 2).forEach((x, i) => { if (t >= T.r2b + i * 0.1) gbox(`${k}.b${i}`, x, LG.y[1], { s: pop(T.r2b + i * 0.1) }); });
      if (t >= T.res) gbox(k + '.c0', LG.gx[0], LG.y[2], { s: pop(T.res) });
      // "0 − 1": not enough
      if (t >= T.ring && t < T.nopeOut + 0.3) {
        const o = 1 - fadeIn(t, T.nopeOut, 0.3);
        N2.ring(k + '.ring', LG.num + 16, (LG.y[0] + LG.y[1]) / 2, 40, 86, { draw: EASE.out(fadeIn(t, T.ring, 0.35)), opacity: o });
        if (t >= T.nope) text(k + '.nope', '不够减', 930, 412, { size: 40, color: C.red, z: Z.annot, anchor: 'start', opacity: fadeIn(t, T.nope, 0.2) * o });
      }
      // borrow: strike the 4th group of 16, a copy slides into the remainder column and opens into 4 dots
      if (t >= T.slash) stroke(k + '.sl', [[LG.gx[3] - 34, LG.y[0] + 34], [LG.gx[3] + 34, LG.y[0] - 34]], { z: Z.annot, w: 5, color: C.red, draw: EASE.out(fadeIn(t, T.slash, 0.2)) });
      if (t >= T.slide && t < T.land + 0.4) {
        const u = EASE.io(fadeIn(t, T.slide, T.land - T.slide)), c = [lerp(LG.gx[3], LAND[0], u), LG.y[0] - 70 * Math.sin(Math.PI * u)];
        if (t < T.land) gbox(k + '.mv', c[0], c[1], { color: C.ink, z: Z.front });
        else {   // the box outline fades, the 4 dots spread into a row
          const v = EASE.out(fadeIn(t, T.land, 0.4)), n1 = DL.items.length;
          stroke(k + '.mvb', box(LAND[0] - 30, LAND[1] - 30, LAND[0] + 30, LAND[1] + 30), { z: Z.front, w: 3, fill: '#FFFFFF' });
          N2.fadeFrom(n1, 1 - v);
        }
      }
      if (t >= T.land) {
        const v = EASE.out(fadeIn(t, T.land, 0.4)), start = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        LG.rx.forEach((x, i) => {
          let p = [lerp(LAND[0] + start[i][0] * 13, x, v), lerp(LAND[1] + start[i][1] * 13, LG.y[0], v)], op = 1;
          if (i === 3 && t >= T.took) { const w = EASE.io(fadeIn(t, T.took, 0.35)); p = lerp2(p, ONE, w); op = 1 - w; }   // taken away by the 1
          if (i < 3 && t >= T.res) p = [p[0], lerp(LG.y[0], LG.y[2], EASE.io(fadeIn(t, T.res, 0.4)))];                   // the 3 left over go down to the result row
          if (op > 0.01) { dot(`${k}.p${i}`, p, 8.5, C.ink, Z.front); if (op < 1) DL.items[DL.items.length - 1].attrs.opacity = +op.toFixed(3); }
        });
      }
      if (t >= T.take && t < T.took + 0.7) stroke(k + '.tk', [[LG.rx[3], LG.y[0] + 12], [ONE[0] - 6, ONE[1] - 30]], { z: Z.annot, w: 3.5, color: C.red, draw: EASE.out(fadeIn(t, T.take, 0.3)), opacity: 1 - fadeIn(t, T.took + 0.35, 0.35) });
      // the 3 left over, framed: remainder 3 = the hollow pattern (an empty frame)
      if (t >= T.frame) stroke(k + '.fr', box(LG.rx[0] - 18, LG.y[2] - 24, LG.rx[2] + 18, LG.y[2] + 24), { z: Z.board, w: 3, draw: EASE.out(fadeIn(t, T.frame, 0.3)) });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.r1b, 'pop'], [T.r2b, 'pop'], [T.ring, 'pen'], [T.slash, 'pen'], [T.slide, 'whoosh'], [T.land, 'pop'], [T.take, 'pen'], [T.took, 'plip'], [T.res, 'swish'], [T.frame, 'pen']],
  };
  const LEDGER_W = [
    N2.W('b2w16', '16', LG.lab, 305, 52, T.r1, { anchor: 'end', sfx: 'chalk' }),
    N2.W('b2w9', '− 9', LG.lab, 395, 52, T.r2, { anchor: 'end', sfx: 'chalk' }),
    N2.W('b2wr0', '0', LG.num, 305, 52, T.r1n, { sfx: 'chalk' }),
    N2.W('b2wr1', '1', LG.num + 4, 395, 52, T.r2n, { sfx: 'chalk' }),
    N2.W('b2w7', '7', LG.lab, 490, 52, T.res, { anchor: 'end', sfx: 'chalk' }),
    N2.W('b2wr3', '3', LG.num, 490, 52, T.res3, { sfx: 'chalk' }),
  ];

  /* ---------------- L2: the corner card, 20 − 1 in columns (2 seconds, not read out) ---------------- */
  const V20 = layoutWriting(N2.W('b2v20', '20', 1080, 218, 40, T.vc + 0.1, { anchor: 'end', speed: 5200, sfx: 'chalk' }));
  const V1 = N2.W('b2v1', '− 1', 1080, 266, 40, T.vc + 0.3, { anchor: 'end', speed: 5200, sfx: 'chalk' });
  const V19 = N2.W('b2v19', '19', 1080, 322, 40, T.vcRes, { anchor: 'end', speed: 5200, sfx: 'chalk' });
  const TENS = [V20.boxes[0].x + V20.boxes[0].w / 2, 201];
  V20._n2 = 1;   // laid out already
  const VCARD = { type: 'n2_grp', id: 'b2vcG', t0: T.vc, out: T.vcOut, dur: 0.3, inner: [
    { type: 'n2_fn', id: 'b2vc', t0: T.vc, cues: [[T.vc, 'paper']], fn: (t, lt, k) => {
      const s = Math.max(0.01, EASE.back(clamp(lt / 0.2)));
      DL.save(); DL.translate(1040, 280); DL.scale(s);
      stroke(k + '.c', box(-78, -90, 78, 92), { z: Z.board - 0.5, w: 3.5, fill: '#FFFFFF' });
      DL.restore();
      if (lt > 0.55) stroke(k + '.r', [[1000, 314], [1092, 314]], { z: Z.board, w: 4, draw: EASE.out(clamp((lt - 0.55) / 0.15)) });
      if (t >= T.vcDot) dot(k + '.dot', TENS, 6 * Math.max(0.01, EASE.back(clamp((t - T.vcDot) / 0.2))), C.red, Z.annot);
    } },
    V20, V1, V19,
  ] };

  /* ---------------- L4–L5: the 2×2 table ---------------- */
  const TB = { x0: 330, y0: 270, cw: 330, ch: 120 };
  const cellR = (r, c) => [TB.x0 + c * TB.cw, TB.y0 + r * TB.ch, TB.x0 + (c + 1) * TB.cw, TB.y0 + (r + 1) * TB.ch];
  const ON = { '0,0': T.c00, '1,1': T.c11, '1,0': T.c10, '0,1': T.c01 };          // the cell lights up
  const FILL = { '0,0': T.eq0, '1,1': T.eq0 + 0.25, '1,0': T.eq1, '0,1': T.eq3 };  // its pattern is brushed in
  COMP.b2_table = {
    draw(fx, t) {
      if (t < T.tab) return;
      const out = clamp((t - T.tabOut) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, u = EASE.out(fadeIn(t, T.tab, 0.45)), z = Z.board;
      const [X0, Y0] = [TB.x0, TB.y0], X1 = X0 + 2 * TB.cw, Y1 = Y0 + 2 * TB.ch;
      stroke(k + '.o', box(X0, Y0, X1, Y1), { z, w: 4, draw: u, fill: C.paper });
      stroke(k + '.v', [[X0 + TB.cw, Y0], [X0 + TB.cw, Y1]], { z, w: 3, draw: u });
      stroke(k + '.h', [[X0, Y0 + TB.ch], [X1, Y0 + TB.ch]], { z, w: 3, draw: u });
      text(k + '.top', '小平方的零头', X0 + TB.cw, 202, { size: 36, z, anchor: 'middle', opacity: u });
      text(k + '.lf0', '大平方', 215, 372, { size: 36, z, anchor: 'middle', opacity: u });
      text(k + '.lf1', '的零头', 215, 414, { size: 36, z, anchor: 'middle', opacity: u });
      for (const rc of Object.keys(CELL)) {
        const [r, c] = rc.split(',').map(Number), [x0, y0, x1, y1] = cellR(r, c), on = ON[rc];
        if (t < on) continue;
        // tab: a little frame on the left of the cell, brushed with the pattern of the result
        stroke(`${k}.tb${r}${c}`, box(x0 + 8, y0 + 8, x0 + 48, y1 - 8), { z: Z.board + 0.4, w: 2.5, draw: EASE.out(fadeIn(t, on, 0.3)) });
        if (t >= FILL[rc]) N2.fill(`${k}.f${r}${c}`, x0 + 10, y0 + 10, x0 + 46, y1 - 10, CELL[rc].res, { z: Z.board + 0.3, draw: EASE.out(fadeIn(t, FILL[rc], 0.4)), step: 14, dot: 3 });
        // the cell lights up: a red frame that fades
        const fl = 1 - fadeIn(t, on + 0.5, 0.6);
        if (fl > 0) stroke(`${k}.fl${r}${c}`, box(x0 + 4, y0 + 4, x1 - 4, y1 - 4), { z: Z.annot - 0.5, w: 4.5, color: C.red, draw: EASE.out(fadeIn(t, on, 0.25)), opacity: fl });
        // the hollow tab of the borrow cell: a red pulse round the empty frame
        if (CELL[rc].borrow && t >= FILL[rc] && t < FILL[rc] + 1.0) N2.ring(`${k}.hr`, x0 + 28, (y0 + y1) / 2, 34, 64, { draw: EASE.out(fadeIn(t, FILL[rc], 0.3)), opacity: 1 - fadeIn(t, FILL[rc] + 0.7, 0.3) });
      }
      // "就这四种": a red frame round the whole table
      if (t >= T.four) stroke(k + '.all', superPts((X0 + X1) / 2, (Y0 + Y1) / 2, X1 - X0 + 16, Y1 - Y0 + 16, 24, 7), { z: Z.annot, w: 4.5, color: C.red, closed: true, draw: EASE.out(fadeIn(t, T.four, 0.5)) });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.tab, 'paper'], ...Object.values(ON).map(v => [v, 'plip']), [T.eq0, 'swish'], [T.eq1, 'swish'], [T.eq3, 'swish'], [T.four, 'pen']],
  };
  // the table's handwriting: column / row labels, and the four sums (the borrow cell: "0 − 1" first, then a red "4 +" in front, then "= 3")
  const TW = [
    N2.W('b2tc0', '0', TB.x0 + TB.cw / 2, 222, 40, T.tab + 0.3, { anchor: 'middle' }),
    N2.W('b2tc1', '1', TB.x0 + 1.5 * TB.cw, 222, 40, T.tab + 0.4, { anchor: 'middle' }),
    N2.W('b2tr0', '0', 300, TB.y0 + 40, 40, T.tab + 0.5, { anchor: 'middle' }),
    N2.W('b2tr1', '1', 300, TB.y0 + TB.ch + 40, 40, T.tab + 0.6, { anchor: 'middle' }),
  ];
  const sumIn = (id, r, c, a, b, ta, tb) => {
    const [x0, y0] = cellR(r, c), A = layoutWriting(N2.W(id + 'a', a, x0 + 64, y0 + 16, 40, ta));
    const B = layoutWriting(N2.W(id + 'b', b, A.xEnd, y0 + 16, 40, tb)); A._n2 = B._n2 = 1; return [A, B];
  };
  TW.push(...sumIn('b2s00', 0, 0, '0 − 0', ' = 0', T.c00, T.eq0), ...sumIn('b2s11', 1, 1, '1 − 1', ' = 0', T.c11, T.eq0 + 0.25), ...sumIn('b2s10', 1, 0, '1 − 0', ' = 1', T.c10, T.eq1));
  {
    const [x0, y0] = cellR(0, 1);
    const R4 = layoutWriting(N2.W('b2s01r', '4 + ', x0 + 62, y0 + 18, 36, T.brw, { color: 'red' }));
    const S = layoutWriting(N2.W('b2s01a', '0 − 1', R4.xEnd, y0 + 18, 36, T.c01));
    const E = layoutWriting(N2.W('b2s01b', ' = 3', S.xEnd, y0 + 18, 36, T.eq3));
    R4._n2 = S._n2 = E._n2 = 1;
    if (E.x + E.width > x0 + TB.cw - 6) console.error('b2 borrow: the borrow cell sum runs out of its cell');
    TW.push(R4, S, E, { type: 'scribe', id: 'b2s01j', text: '借一组', x: x0 + 64, y: y0 + 90, size: 36, cps: 8, color: 'red', t0: T.brw + 0.2, z: Z.annot });
  }

  /* ---------------- L7: a×a covers b×b ---------------- */
  const AA = { x: 640, y: 300, N: 4, g: 52 }, BB = { x: 330, y: 352, N: 3, g: 52 };
  const SLIDE = AA.x - BB.x;    // b×b ends in a×a's bottom-left corner
  const ax1 = AA.x + 3 * AA.g, ay1 = AA.y + 3 * AA.g, pc = 26;

  /* ---------------- L8–L11: the lanes, the two bricks, the rounds ---------------- */
  const LN = { x: 340, y: 300, W: 730, H: 70, gap: 14, head: 70, cell: 110 };
  const P = n => N2.laneXY(LN, n);
  const colX = j => LN.x + LN.head + LN.cell * j;              // left edge of round j
  const S0 = 152 / LN.W;                                       // the lanes start as the thin strip in the top bar
  const BS = 0.9;
  const arcTo = (p, q, u, h) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u) - h * Math.sin(Math.PI * u)];
  const UP = [P(16)[0], 236];
  /** where the a² brick is */
  function aPos(t) {
    if (t < T.lift) return P(16);
    if (t < T.tryIn) return lerp2(P(16), UP, EASE.io(fadeIn(t, T.lift, 0.4)));
    if (t < T.hopTo) return arcTo(UP, P(8), EASE.io(fadeIn(t, T.tryIn, 0.5)), 40);
    return arcTo(P(8), P(12), EASE.io(fadeIn(t, T.hopTo, 0.45)), 60);
  }
  const penN = t => (t - T.pen) / T.penStep;   // the red pen counts 0, 1, 2 … down each round
  const bracket = (k, x0, x1, y, lab, u, op) => {
    stroke(k, [[x0, y + 14], [x0, y, 1], [x1, y, 1], [x1, y + 14, 1]], { z: Z.annot, w: 4, color: C.red, draw: u, opacity: op });
    text(k + '.t', lab, x0 - 12, y + 2, { size: 36, color: C.red, z: Z.annot, anchor: 'end', opacity: clamp(u * 2) * op });
  };
  COMP.b2_track = {
    draw(fx, t) {
      if (t < T.b2in) return;
      const out = clamp((t - T.end) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length;
      // faint round separators
      const su = fadeIn(t, T.b2in - 0.1, 0.4);
      for (let j = 1; j < 6; j++) stroke(`${k}.sep${j}`, [[colX(j), LN.y + 4], [colX(j), LN.y + 4 * LN.H + 3 * LN.gap - 4]], { z: Z.set + 0.35, w: 2, color: C.pencil, opacity: 0.55 * su });
      // L8: the red pen counts down each round; the trail stays under the bricks
      if (t >= T.pen && t < T.brOut + 0.35) {
        const o = 1 - fadeIn(t, T.brOut, 0.35), nn = Math.min(16, penN(t)), i0 = Math.floor(nn), f = nn - i0;
        // one red stroke down each round (0 → 3); between rounds the pen hops to the top of the next one
        const tip = i0 >= 16 ? P(16) : lerp2(P(i0), P(i0 + 1), i0 % 4 === 3 ? EASE.io(f) : f), cur = Math.floor(nn / 4);
        for (let j = 0; j <= cur; j++) {
          const a = P(4 * j), b = j < cur ? P(4 * j + 3) : i0 >= 16 ? P(16) : i0 % 4 === 3 ? P(i0) : tip;
          if (dist(a, b) > 2) stroke(`${k}.tr${j}`, [[a[0], a[1] - 24], b], { z: Z.set + 0.5, w: 4, color: C.red, opacity: 0.5 * o, boil: 0.3 });
        }
        if (penN(t) < 16.6) dot(k + '.pen', tip, 9, C.red, Z.annot);
        const tb = T.pen + 9 * T.penStep, ta = T.pen + 16 * T.penStep;
        if (t >= tb) bracket(k + '.bb', colX(0), colX(2), 266, 'b²', EASE.out(fadeIn(t, tb, 0.3)), o);
        if (t >= ta) bracket(k + '.ba', colX(0), colX(4), 222, 'a²', EASE.out(fadeIn(t, ta, 0.4)), o);
      }
      // the b² brick (remainder 1, round 3)
      const dropIn = (t0, p) => { const u = EASE.out(fadeIn(t, t0, 0.3)); return [[p[0], p[1] - 60 * (1 - u)], u]; };
      const [pb, ub] = dropIn(T.b2in, P(9));
      N2.brick(k + '.b2', pb[0], pb[1], 'b²', 1, { scale: BS, opacity: ub });
      // the a² brick (remainder 0)
      if (t >= T.a2in) {
        const [pa0, ua] = dropIn(T.a2in, P(16)), pa = t < T.lift ? pa0 : aPos(t);
        N2.brick(k + '.a2', pa[0], pa[1], 'a²', 0, { scale: BS, opacity: ua });
      }
      // L9: "a² remainder 0, b² remainder 1"
      if (t >= T.ringA && t < T.ringsOut + 0.3) {
        const o = 1 - fadeIn(t, T.ringsOut, 0.3);
        N2.ring(k + '.ra', UP[0], UP[1], 64, 46, { draw: EASE.out(fadeIn(t, T.ringA, 0.35)), opacity: o });
        if (t >= T.ringB) N2.ring(k + '.rb', P(9)[0], P(9)[1], 64, 46, { draw: EASE.out(fadeIn(t, T.ringB, 0.35)), opacity: o });
      }
      // L11: the extra round, and the group it brings
      if (t >= T.more) {
        const c = colX(2) + LN.cell / 2, yTop = LN.y - 6, yBot = LN.y + 4 * LN.H + 3 * LN.gap + 6;
        stroke(k + '.col', superPts(c, (yTop + yBot) / 2, LN.cell - 6, yBot - yTop, 22, 7), { z: Z.annot, w: 4.5, color: C.red, closed: true, draw: EASE.out(fadeIn(t, T.more, 0.45)) });
        if (t >= T.box4) {
          const u = EASE.io(fadeIn(t, T.box4, 0.45)), y = lerp(P(10)[1], 676, u), s = Math.max(0.01, EASE.back(fadeIn(t, T.box4, 0.2)));
          redGroup(k + '.g', c, y, s);
          if (t >= T.box4 + 0.5) text(k + '.kj', '可借', c + 44, 678, { size: 40, color: C.red, z: Z.annot, anchor: 'start', opacity: fadeIn(t, T.box4 + 0.5, 0.2) });
        }
      }
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.b2in, 'tap'], [T.a2in, 'tap'], [T.pen, 'pen'], [T.pen + 9 * T.penStep, 'plip'], [T.pen + 16 * T.penStep, 'plip'], [T.lift, 'swish'], [T.ringA, 'pen'], [T.ringB, 'pen'],
      [T.tryIn, 'whoosh'], [T.tryIn + 0.5, 'tap'], [T.hopTo, 'boing'], [T.hopTo + 0.45, 'tap'], [T.more, 'pen'], [T.box4, 'pop']],
  };

  /** fades (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: keep these at the end of fx */
  COMP.b2_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.35));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    b2_ptR: { lean: 2, tilt: 3, armScale: 1.5, armR: [118, 8], armL: [16, 10] },
  });

  defineScene({
    id: 'borrow', chapter: '借位', dur: DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: T.kid,
        pos: [[0, [JX, FL]]],
        pose: [[0, 'stand'], [T.cheer, 'kidCheer', 0.12, 'back'], [7.45, 'b2_ptR', 0.14, 'back'], [9.7, 'stand', 0.15],
          [11.5, 'b2_ptR', 0.12, 'back'], [13.1, 'stand', 0.15], [T.qm + 0.4, 'thinkStand', 0.15, 'back'], [T.bb, 'stand', 0.15],
          [T.corner, 'b2_ptR', 0.12, 'back'], [33.6, 'stand', 0.15], [44.2, 'b2_ptR', 0.12, 'back'], [T.hopTo + 0.2, 'akimbo', 0.15, 'back'],
          [T.box4 + 0.2, 'kidCheer', 0.12, 'back'], [51.5, 'stand', 0.2]],
        face: [[0, 'neutral'], [5.5, 'surprised', 0.06], [T.cheer, 'grin', 0.08], [9.7, 'smile', 0.1], [10.6, 'focus', 0.1], [14.6, 'idea', 0.08],
          [T.tab, 'focus', 0.1], [T.four, 'smile', 0.1], [25.6, 'puzzled', 0.08], [T.bb, 'focus', 0.1], [T.gt, 'idea', 0.08], [T.lanes, 'focus', 0.1],
          [44.2, 'idea', 0.06], [T.cross, 'grin', 0.08], [47.4, 'proud', 0.1], [T.box4 + 0.2, 'joy', 0.08], [51.5, 'smile', 0.1]],
        turn: [[0, 0.3]],
        gaze: [[0, 'viewer'], [5.4, 'ledger'], [7.4, 'vcard'], [9.6, 'viewer'], [10.5, 'ledger'], [T.tab, 'table'], [25.5, 'qmh'], [28.9, 'dots'],
          [T.lanes, 'lanes'], [40.4, 'a2'], [49.5, 'col2'], [51.5, 'viewer']],
        squash: [[0, 1], [T.cheer, 1.06, 0.05], [T.cheer + 0.05, 1, 0.2, 'back'], [T.box4 + 0.2, 1.06, 0.05], [T.box4 + 0.25, 1, 0.2, 'back']],
      },
    },
    targets: F => ({
      ledger: [600, 400], vcard: [1040, 280], table: [660, 390], qmh: [1075, 660], dots: [640, 400], lanes: [700, 460],
      a2: aPos(F.t), col2: [colX(2) + LN.cell / 2, 460], cell01: [cellR(0, 1)[0] + 160, 330],
    }),
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'borrow' },
      { type: 'n2_stack', id: 'stack', from: 2, cur: [[0, 1]], add: [[T.st2, 2], [T.st3, 3], [T.st4, 4]] },
      { type: 'prop', kind: 'n1_card', id: 'scope', at: N2.STACK_CARD.at, w: N2.STACK_CARD.w, h: N2.STACK_CARD.h, size: N2.STACK_CARD.size, lines: N2.STACK_CARD.lines, t0: -1 },

      // L1–L3: the ledger
      { type: 'n2_grp', id: 'b2lgG', out: T.ledOut, inner: [{ type: 'b2_ledger', id: 'b2lg' }, ...LEDGER_W] },
      VCARD,

      // L4–L5: the 2×2 table
      { type: 'n2_grp', id: 'b2tbG', out: T.tabOut, inner: [{ type: 'b2_table', id: 'b2tb' }, ...TW] },

      // L6: the question mark
      { type: 'n2_grp', id: 'b2qmG', out: T.qmOut, inner: { type: 'qm', id: 'b2qm', pos: [[0, [1075, FL]]], size: 150, signSize: 52, signSide: 'left', t0: T.qm, burst: true,
        mood: [[0, 'doubt']], act: [[0, 'idle'], [T.qsign, 'tap'], [27.4, 'idle']], sign: [[0, null], [T.qsign, '没得借？'], [T.qsOut, null]], gaze: [[0, 'cell01']] } },

      // L7: b×b slides into a×a's bottom-left corner
      { type: 'n2_grp', id: 'b2bbG', out: T.dotsOut, xf: [[0, [0, 0, 1]], [T.slideB, [SLIDE, 0, 1], 0.6, 'io']], inner: [
        { type: 'n1_dots', id: 'b2bb', x: BB.x, y: BB.y, N: BB.N, gap: BB.g, t0: T.bb },
        { type: 'n2_fn', id: 'b2bbo', t0: T.bb + 0.35, cues: [[T.bb + 0.35, 'pen']], fn: (t, lt, k) => stroke(k, superPts(BB.x + BB.g, BB.y + BB.g, 2 * BB.g + 52, 2 * BB.g + 52, 24, 6), { z: Z.annot, w: 4, color: C.red, closed: true, draw: EASE.out(clamp(lt / 0.4)) }) },
      ] },
      { type: 'n2_grp', id: 'b2lbG', out: T.bOut, dur: 0.3, inner: N2.W('b2lb', 'b × b', BB.x + BB.g, 506, 44, T.bb + 0.3, { anchor: 'middle' }) },
      { type: 'n2_grp', id: 'b2aaG', out: T.dotsOut, inner: [
        { type: 'n1_dots', id: 'b2aa', x: AA.x, y: AA.y, N: AA.N, gap: AA.g, t0: T.aa },
        N2.W('b2la', 'a × a', AA.x + 1.5 * AA.g, 506, 44, T.aa + 0.3, { anchor: 'middle' }),
        { type: 'n2_fn', id: 'b2cn', t0: T.corner, cues: [[T.corner, 'pen']], fn: (t, lt, k) => stroke(k, [[AA.x - pc, AA.y - pc], [ax1 + pc, AA.y - pc, 1], [ax1 + pc, ay1 + pc, 1], [ax1 - pc, ay1 + pc, 1], [ax1 - pc, AA.y + pc, 1], [AA.x - pc, AA.y + pc, 1], [AA.x - pc, AA.y - pc - 3, 1]], { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp(lt / 0.6)) }) },
        N2.W('b2gt', 'a² > b²', 868, 352, 56, T.gt, { sfx: 'chalk' }),
      ] },

      // L8–L11: the lanes pop out of the top edge and grow
      { type: 'n2_grp', id: 'b2lnG', t0: T.lanes, out: T.end, xf: [[0, [452 - LN.x * S0, 80 - LN.y * S0, S0]], [T.lanes, [0, 0, 1], 0.6, 'out']],
        cues: [[T.lanes, 'whoosh']], inner: { type: 'n2_lanes', id: 'b2ln', ...LN, t0: T.lanes, pop: 0.5 } },
      { type: 'b2_track', id: 'b2tr' },
      // L10: "in the same round, remainder 0 comes first": a² < b², red cross
      { type: 'n2_grp', id: 'b2xG', out: T.hopTo, dur: 0.3, inner: [
        N2.W('b2lt', 'a² < b²', P(8)[0], 196, 40, T.lt, { anchor: 'middle', color: 'red' }),
        N2.W('b2x', '✗', P(8)[0], P(8)[1] - 34, 64, T.cross, { anchor: 'middle', color: 'red' }),
      ] },

      // exits that must stay last
      { type: 'b2_fade', t0: T.end, keys: ['kid.'] },
    ],
    subs: [
      { t0: 0.5, t1: 5.24, text: '16余0，9余1：零头0减1，不够减。', say: '十六余零，九余一：零头零减一，不够减。' },
      { t0: 5.54, t1: 10.28, text: '“不够减？借呀，跟竖式借位一样！”', voice: 'kid', say: '不够减？借呀，跟竖式借位一样！' },
      { t0: 10.48, t1: 15.12, text: '这里拆开一组：4个加0个，减1，剩3。', say: '这里拆开一组：四个加零个，减一，剩三。' },
      { t0: 15.52, t1: 19.97, text: '只看零头：0减0、1减1，得0；', say: '只看零头：零减零、一减一，得零；' },
      { t0: 20.17, t1: 25.29, text: '1减0得1；0减1借一组得3：就这四种。', say: '一减零得一；零减一借一组，得三：就这四种。' },
      { t0: 25.69, t1: 28.74, text: '“要是没有整组可借呢？”', voice: 'qm', say: '要是没有整组可借呢？' },
      { t0: 28.99, t1: 34.43, text: 'a比b大，a×a罩得住b×b：a²更大，', say: 'a 比 b 大，a 乘 a 罩得住 b 乘 b：a 的平方更大，' },
      { t0: 34.63, t1: 39.27, text: '排得更靠后，转过的整轮只多不少：组够减。' },
      { t0: 39.57, t1: 43.93, text: '要借时，a²余0、b²余1：', say: '要借时，a 的平方余零，b 的平方余一：' },
      { t0: 44.23, t1: 49.33, text: '“同一轮里余0在前，a²只能在后一轮！”', voice: 'kid', say: '同一轮里余零在前，a 的平方只能在后一轮！' },
      { t0: 49.53, t1: 52.54, text: '多一轮，就多一组可借。' },
    ],
  });
})();
