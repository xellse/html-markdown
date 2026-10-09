// 第 60 场 · 反证：假设 6 写得出（id proof）。B3，前缀 f2_。
// 分镜：ep2-storyboard.md "4:15–4:50 · 假设 6 写得出（记账）"。同屏三组：右侧证明栈（+ 范围卡）/ 主画面（先是"假设"，再是两栏记账，最后是 7 = 1 组 + 3）/ 角色。
// 开场只有顶栏 + 议程条；顶栏 0.3 秒收成细边。结尾留下：收起的顶栏 + 议程条 + 证明栈第 0、1 行（第 1 行当前）+ 范围卡（下一场 borrow 用 from: 2, cur: [[0, 1]]）。
// u、v、r、w 只是画面上的标签，旁白不念。
// 数（自己验算，算错 console.error）：每个平方 ÷ 4 只余 0 或 1；6 余 2；16 − 9 = 7 = 4 + 3（16 余 0，9 余 1，7 余 3）。
(() => {
  const FL = N2.FL, DUR = 35.0, W = N2.W;

  /* ---------------- the arithmetic ---------------- */
  const SIX = 6, BIG = 16, SMALL = 9, SEVEN = BIG - SMALL;
  const sqRem = new Set(); for (let n = 0; n <= 300; n++) sqRem.add(n * n % 4);
  const diffs = new Set(); for (const r of sqRem) for (const w of sqRem) if (r >= w) diffs.add(r - w);   // Jasper's guess: just subtract the two leftovers
  [[sqRem.size === 2 && sqRem.has(0) && sqRem.has(1), '每个平方 ÷ 4 只余 0 或 1（边长 0–300）'], [SIX % 4 === 2, '6 余 2'],
    [BIG === 4 * 4 && SMALL === 3 * 3, '16 = 4²，9 = 3²'], [SEVEN === 7, '16 − 9 = 7'], [BIG % 4 === 0 && SMALL % 4 === 1, '16 余 0，9 余 1'],
    [SEVEN === 4 * 1 + 3 && Math.floor(SEVEN / 4) === 1 && SEVEN % 4 === 3, '7 = 1 组 + 3'],
    [diffs.size === 2 && diffs.has(0) && diffs.has(1) && !diffs.has(SEVEN % 4), '"相减也只剩 0 和 1" 被 7 推翻']]
    .forEach(([ok, s]) => { if (!ok) console.error('f2 proof: wrong arithmetic: ' + s); });

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    col: 0.3,
    // L1–L2: 6, "假设", the scope card, a² − b² = 6, stack row 0
    six: 0.9, tag: 3.3, card: 5.6, eq: 8.0, row0: 9.4, outA: 11.55,
    // L3: the ledger
    led: 11.9, la: 12.45, ba: [12.75, 12.9, 13.05, 13.2, 13.35], u: 13.5, lb: 13.7, bb: [13.95, 14.1, 14.25, 14.4], v: 14.55,
    pa: 14.85, pb: 15.15, dim: 15.95,
    // L4: card ② pops, stack row 1, "0 或 1"
    pop0: 16.25, pop1: 19.7, row1: 16.85, ra: 17.9, rb: 18.45,
    // L5: Jasper and his sign
    kid: 20.15, sign: 22.35, outB: 25.2,
    // L6–L7: the question mark, 7 = 1 group + 3
    qm: 25.4, qsign: 27.2, seven: 29.5, grp: 30.65, box: 31.05, one: 31.25, ring3: 31.8, tip: 32.15, puz: 32.7,
    end: 34.45,
  };

  /* ---------------- geometry ---------------- */
  // the ledger (x 300–1135, left of the stack): header 组 | 零头, row a² over row − b²
  const LG = { x0: 300, x1: 1135, dv: 818, hy: 214, ul: 238, lx: 360, ya: 290, yb: 430, bh: 30, px0: 842, px1: 926, lbx: 938, ox: 994 };
  const BXA = [480, 552, 624, null, 744], BXB = [480, 552, null, 672];     // null = "⋯"
  const GRPC = xs => { const v = xs.filter(x => x !== null); return (v[0] + v[v.length - 1]) / 2; };
  // Jasper (left, below the ledger's row labels) and the sign he holds up; the question mark on the right
  const JX = 100, GRIP = [188, 552], PL = 100, BW = 176, BH = 112, QX = 1060, QS = 150;
  // 7 = 1 group + 3
  const S7 = { lx: 470, y: 300, x0: 560, dx: 64, r: 10, box: [556, 250, 656, 350] };
  const S7TO = [[586, 280], [626, 280], [586, 320], [626, 320], [724, 296], [790, 308], [856, 298]];

  /* ---------------- written lines ---------------- */
  const lay = f => { layoutWriting(f); return f; };
  const EQ = lay(W('f2aEq', `a² − b² = ${SIX}`, 600, 440, 72, T.eq, { anchor: 'middle', speed: 2400 }));
  const LA = lay(W('f2bLa', 'a²', LG.lx, LG.ya - 28, 56, T.la));
  const offB = layoutWriting({ text: '− ', x: 0, y: 0, size: 56, t0: 0, speed: 1 }).xEnd;
  const LB = lay(W('f2bLb', '− b²', LG.lx - offB, LG.yb - 28, 56, T.lb));
  const LU = lay(W('f2bU', 'u', GRPC(BXA) - 30, LG.ya + LG.bh + 14, 40, T.u));
  const LV = lay(W('f2bV', 'v', GRPC(BXB) - 30, LG.yb + LG.bh + 14, 40, T.v));
  const LR = lay(W('f2bR', 'r', LG.lbx, LG.ya - 24, 48, T.pa + 0.15));
  const LW = lay(W('f2bW', 'w', LG.lbx, LG.yb - 24, 48, T.pb + 0.15));
  // "0 或 1" (red: what card ② tells us) beside r and w; the 或 is drawn by the ledger
  const ORX = LG.ox + 50;
  const RA0 = lay(W('f2bRa0', '0', LG.ox, LG.ya - 20, 44, T.ra, { color: 'red' }));
  const RA1 = lay(W('f2bRa1', '1', ORX + 30, LG.ya - 20, 44, T.ra + 0.3, { color: 'red' }));
  const RB0 = lay(W('f2bRb0', '0', LG.ox, LG.yb - 20, 44, T.rb, { color: 'red' }));
  const RB1 = lay(W('f2bRb1', '1', ORX + 30, LG.yb - 20, 44, T.rb + 0.3, { color: 'red' }));
  if (RA1.x + RA1.width > N2.STACK_X - 30) console.error('f2 proof: "0 或 1" runs into the stack', RA1.x + RA1.width);
  const N7 = lay(W('f2d7n', String(SEVEN), S7.lx, S7.y - 32, 64, T.seven));
  const N3 = lay(W('f2d3', String(SEVEN % 4), S7TO[5][0], 206, 48, T.ring3 + 0.3, { color: 'red', anchor: 'middle' }));

  /* ---------------- components ---------------- */
  /** fades (to `to`, default 0) every item already drawn this frame whose key starts with one of `keys`: keep these at the end of fx */
  COMP.f2_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = lerp(1, fx.to ?? 0, clamp((t - fx.t0) / (fx.d || 0.35)));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** the brick "6" (余 2 tab): pops in big */
  COMP.f2_six = {
    draw(fx, t) {
      if (t < T.six || t >= T.outA + 0.4) return;
      N2.brick(fx.id, 430, 330, SIX, SIX % 4, { scale: 1.8 * Math.max(0.01, EASE.back(clamp((t - T.six) / 0.3))) });
    },
    cues: () => [[T.six, 'pop']],
  };
  /** a 4-dot box (2 × 2) centred at (cx, cy), half-size h */
  const box4 = (k, cx, cy, h, s, op) => {
    if (s <= 0.01) return;
    DL.save(); DL.translate(cx, cy); DL.scale(s);
    stroke(k + '.b', N2.box(-h, -h, h, h), { z: Z.board, w: 3.5, opacity: op });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b], i) => { dot(`${k}.d${i}`, [a * h * 0.44, b * h * 0.44], h * 0.2, C.ink, Z.board + 0.1); if (op < 1) DL.items[DL.items.length - 1].attrs.opacity = +op.toFixed(3); });
    DL.restore();
  };
  /** the ledger: header 组 | 零头, the rows of 4-dot boxes (grey after "各剩零头"), the leftover pockets with a "?" */
  COMP.f2_ledger = {
    draw(fx, t) {
      if (t < T.led || t >= T.outB + 0.4) return;
      const k = fx.id, p = EASE.out(clamp((t - T.led) / 0.35)), o = clamp((t - T.led - 0.15) / 0.25);
      stroke(k + '.ul', [[LG.x0, LG.ul], [LG.x1, LG.ul]], { z: Z.board, w: 3, draw: p });
      stroke(k + '.dv', [[LG.dv, LG.hy - 20], [LG.dv, LG.yb + LG.bh + 34]], { z: Z.board, w: 3, draw: p });
      text(k + '.hg', '组', (BXA[0] + BXA[4]) / 2, LG.hy, { size: 40, z: Z.board, anchor: 'middle', opacity: o });
      text(k + '.hr', '零头', (LG.dv + LG.x1) / 2, LG.hy, { size: 40, z: Z.board, anchor: 'middle', opacity: o });
      const dim = 1 - 0.65 * clamp((t - T.dim) / 0.4);
      const row = (key, xs, ts, cy, tu, lab) => {
        xs.forEach((x, i) => {
          const tt = ts[i]; if (t < tt) return;
          const s = EASE.back(clamp((t - tt) / 0.22));
          if (x === null) { const xc = (xs[i - 1] + xs[i + 1]) / 2; [-14, 0, 14].forEach((dx, j) => { dot(`${key}.e${j}`, [xc + dx, cy], 3.6 * s, C.ink, Z.board); DL.items[DL.items.length - 1].attrs.opacity = +dim.toFixed(3); }); return; }
          box4(`${key}.x${i}`, x, cy, LG.bh, s, dim);
        });
        if (t >= tu + 0.1) text(key + '.z', '组', lab.x + lab.width + 24, cy + LG.bh + 14 + 20, { size: 40, z: Z.board, anchor: 'middle', opacity: clamp((t - tu - 0.1) / 0.15) * dim });
      };
      row(k + '.ra', BXA, T.ba, LG.ya, T.u, LU);
      row(k + '.rb', BXB, T.bb, LG.yb, T.v, LV);
      // the leftover pockets (dashed), each with a pencil "?" until card ② answers it
      [[T.pa, LG.ya, T.ra, 'pa'], [T.pb, LG.yb, T.rb, 'pb']].forEach(([tt, cy, tq, kk]) => {
        if (t < tt) return;
        const u = clamp((t - tt) / 0.3), y0 = cy - LG.bh, y1 = cy + LG.bh, x0 = LG.px0, x1 = LG.px1, oo = { w: 3, step: 15, on: 8, draw: u };
        N2.dash(`${k}.${kk}t`, [x0, y0], [x1, y0], oo); N2.dash(`${k}.${kk}r`, [x1, y0], [x1, y1], oo);
        N2.dash(`${k}.${kk}b`, [x1, y1], [x0, y1], oo); N2.dash(`${k}.${kk}l`, [x0, y1], [x0, y0], oo);
        const qo = clamp((t - tt - 0.15) / 0.2) * (1 - clamp((t - tq) / 0.3));
        if (qo > 0) text(`${k}.${kk}q`, '?', (x0 + x1) / 2, cy, { size: 48, font: CFG.FONT_MIX, color: C.pencil, z: Z.board, anchor: 'middle', opacity: qo });
      });
      // the red 或 of "0 或 1"
      [[T.ra, LG.ya], [T.rb, LG.yb]].forEach(([tt, cy], i) => { if (t >= tt + 0.15) text(`${k}.or${i}`, '或', ORX, cy, { size: 40, color: C.red, z: Z.annot, anchor: 'middle', opacity: clamp((t - tt - 0.15) / 0.15) }); });
    },
    cues: () => [[T.led, 'pen'], ...T.ba.map(tt => [tt, 'plip']), ...T.bb.map(tt => [tt, 'plip']), [T.pa, 'pen'], [T.pb, 'pen'], [T.dim, 'swish']],
  };
  /** Jasper's sign "差也只剩 0 和 1！", held up by its pole (grip = his hand); at `tip` it flops over to one side */
  const signRot = t => {
    if (t < T.tip) return 0;
    const u = clamp((t - T.tip) / 0.38), b = (t - T.tip - 0.38) / 0.45;
    return 38 * EASE.in(u) - (b > 0 && b < 1 ? 6 * Math.sin(Math.PI * b) * (1 - b) : 0);
  };
  COMP.f2_sign = {
    draw(fx, t) {
      if (t < T.sign) return;
      const k = fx.id, s = Math.max(0.01, EASE.back(clamp((t - T.sign) / 0.3)));
      DL.save(); DL.translate(GRIP[0], GRIP[1]); DL.rotate(signRot(t)); DL.scale(s);
      stroke(k + '.pole', [[0, 22], [0, -PL]], { z: Z.front, w: 7 });
      stroke(k + '.b', N2.box(-BW / 2, -PL - BH, BW / 2, -PL), { z: Z.front, w: 5, fill: '#F3E3C3' });
      text(k + '.t0', '差也只剩', 0, -PL - BH + 32, { size: 40, z: Z.front + 0.2, anchor: 'middle' });
      text(k + '.t1', '0 和 1！', 0, -PL - 32, { size: 40, z: Z.front + 0.2, anchor: 'middle' });
      DL.restore();
    },
    cues: () => [[T.sign, 'whip'], [T.tip + 0.38, 'thud']],
  };
  /** 7 dots: in a row, then 4 of them gather into a 4-dot box ("1 组") and 3 stay loose */
  COMP.f2_seven = {
    draw(fx, t) {
      if (t < T.seven) return;
      const k = fx.id, g = EASE.io(clamp((t - T.grp) / 0.4));
      for (let i = 0; i < SEVEN; i++) {
        const s = EASE.back(clamp((t - T.seven - i * 0.06) / 0.22)); if (s <= 0) continue;
        const p = lerp2([S7.x0 + S7.dx * i, S7.y], S7TO[i], g);
        dot(`${k}.d${i}`, p, S7.r * s, C.ink, Z.front);
      }
      if (t >= T.box) { const [x0, y0, x1, y1] = S7.box; stroke(k + '.box', N2.box(x0, y0, x1, y1), { z: Z.board, w: 3.5, draw: EASE.out(clamp((t - T.box) / 0.3)) }); }
      if (t >= T.one) text(k + '.one', '1 组', (S7.box[0] + S7.box[2]) / 2, S7.box[3] + 34, { size: 36, z: Z.board, anchor: 'middle', opacity: clamp((t - T.one) / 0.2) });
    },
    cues: () => [[T.seven, 'pop'], [T.grp, 'swish'], [T.box, 'pen']],
  };

  /* ---------------- Jasper ---------------- */
  Object.assign(POSE, {
    f2_hold: { lean: 2, tilt: -3, armScale: 1.6, armL: [16, 10], ikR: { w: 1, to: 'abs', dx: GRIP[0], dy: GRIP[1] + 4, bend: 'out' } },
    f2_holdPuz: { lean: -3, tilt: 11, armScale: 1.6, ikL: { w: 1, to: 'hip', dx: -26, dy: -6, bend: 'out' }, ikR: { w: 1, to: 'abs', dx: GRIP[0], dy: GRIP[1] + 4, bend: 'out' } },
  });

  defineScene({
    id: 'proof', chapter: '反证', dur: DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: T.kid,
        pos: [[0, [JX, FL]]],
        pose: [[0, 'stand'], [T.sign - 0.12, 'f2_hold', 0.15, 'back'], [T.puz, 'f2_holdPuz', 0.15, 'back']],
        face: [[0, 'smile'], [20.6, 'grin', 0.08], [T.sign, 'proudGrin', 0.06], [25.6, 'surprised', 0.06], [26.6, 'neutral', 0.1], [T.seven, 'focus', 0.1],
          [T.ring3, 'surprised', 0.05], [T.tip + 0.38, 'jaw', 0.05], [T.puz + 0.2, 'puzzled', 0.1]],
        turn: [[0, 0.3]],
        gaze: [[0, 'viewer'], [20.7, 'pockets'], [T.sign, 'viewer'], [T.qm + 0.15, 'qm'], [T.seven, 'seven'], [T.ring3, 'three'], [T.tip, 'sign'], [T.puz + 0.3, 'viewer']],
        squash: [[0, 1], [T.sign, 1.05, 0.05], [T.sign + 0.05, 1, 0.2, 'back'], [T.tip + 0.38, 0.93, 0.05], [T.tip + 0.43, 1, 0.22, 'back']],
      },
    },
    targets: F => {
      const a = signRot(F.t) * RAD;
      return {
        pockets: [(LG.px0 + LG.px1) / 2, (LG.ya + LG.yb) / 2], qm: [QX, FL - 160 * QS / 200], seven: [700, 300], three: [790, 302],
        sign: [GRIP[0] + Math.sin(a) * (PL + BH / 2), GRIP[1] - Math.cos(a) * (PL + BH / 2)], six: [430, 330],
      };
    },
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'proof', collapse: [[T.col, 1]], pop: [[T.pop0, T.pop1, 2]] },
      { type: 'n2_stack', id: 'stack', add: [[T.row0, 0], [T.row1, 1]] },
      { type: 'prop', kind: 'n1_card', id: 'scope', at: N2.STACK_CARD.at, w: N2.STACK_CARD.w, h: N2.STACK_CARD.h, size: N2.STACK_CARD.size, lines: N2.STACK_CARD.lines, t0: T.card, drawDur: 0.4, sfxAt: [[T.card, 'paper']] },

      // ---- L1–L2: 6 (余 2), the "假设" tag, a² − b² = 6
      { type: 'f2_six', id: 'f2aSix' },
      { type: 'n2_tag', id: 'f2aTag', at: [775, 322], rot: -6, text: '假设：写得出', size: 44, t0: T.tag, t1: T.outA },
      { ...EQ, t1: T.outA + 0.4 },

      // ---- L3–L4: the ledger
      { type: 'f2_ledger', id: 'f2bLed' },
      ...[LA, LB, LU, LV, LR, LW, RA0, RA1, RB0, RB1].map(f => ({ ...f, t1: T.outB + 0.4 })),

      // ---- L5–L7: Jasper's sign, the question mark, 7 = 1 组 + 3
      { type: 'f2_sign', id: 'f2cSign' },
      { type: 'mark', id: 'f2cQ', char: '?', on: ['kid'], t0: T.puz + 0.1, t1: T.end + 0.4, dx: -16 },
      { type: 'qm', id: 'f2qm', pos: [[0, [QX, FL]]], size: QS, signSize: 52, signSide: 'left', t0: T.qm, t1: T.end + 0.4, burst: true,
        mood: [[0, 'neutral'], [T.qsign, 'doubt'], [T.ring3, 'happy']],
        act: [[0, 'idle'], [T.qm + 0.3, 'hop'], [T.qm + 1.15, 'idle'], [T.qsign, 'tap'], [28.9, 'idle'], [T.ring3, 'nod'], [33.0, 'idle']],
        sign: [[0, null], [T.qsign, `${BIG} − ${SMALL} = ${SEVEN}？`]],
        gaze: [[0, 'viewer'], [T.qm + 0.5, 'kid'], [T.qsign, 'viewer'], [T.seven, 'seven'], [T.ring3, 'three'], [T.tip, 'sign'], [T.puz, 'kid']] },
      { ...N7, t1: T.end + 0.4 },
      { type: 'f2_seven', id: 'f2dSev' },
      { type: 'ringRect', id: 'f2dRing', rect: [S7TO[4][0] - 18, S7.y - 22, S7TO[6][0] - S7TO[4][0] + 36, 44], pad: 16, t0: T.ring3, t1: T.end + 0.4 },
      { ...N3, t1: T.end + 0.4 },

      // eased exits and the grey 组 labels (must stay last)
      { type: 'f2_fade', t0: T.outA, keys: ['f2a'] },
      { type: 'f2_fade', t0: T.dim, d: 0.4, to: 0.35, keys: ['f2bU', 'f2bV'] },
      { type: 'f2_fade', t0: T.outB, keys: ['f2b'] },
      { type: 'f2_fade', t0: T.end, keys: ['kid.', 'f2c', 'f2d', 'f2qm'] },
    ],
    subs: [
      {"t0": 0.7, "t1": 5.13, "text": "轮到6了。换个走法：先假设它写得出。", "say": "轮到六了。换个走法：先假设它写得出。"},
      {"t0": 5.33, "t1": 11.29, "text": "规则卡上两个数叫a、b：a²−b²=6。", "say": "规则卡上两个数叫 a、b：a 平方减 b 平方，等于六。"},
      {"t0": 11.69, "t1": 15.97, "text": "记账：两个平方都四个一组，各剩零头；"},
      {"t0": 16.17, "t1": 20.08, "text": "刚证过：两个零头都只能是0或1。", "say": "刚证过：两个零头都只能是零或一。"},
      {"t0": 20.48, "t1": 25.17, "text": "“零头只有0和1，相减也只剩0和1！”", "voice": "kid", "say": "零头只有零和一，相减也只剩零和一！"},
      {"t0": 25.47, "t1": 29.11, "text": "“上集的7呢？16减9。”", "voice": "qm", "say": "上集的七呢？十六减九。"},
      {"t0": 29.41, "t1": 34.53, "text": "“7……四个一组，剩3！哪来的3？”", "voice": "kid", "say": "七……四个一组，剩三！哪来的三？"},
    ],
    sfx: [[T.kid, 'pop'], [T.puz, 'tap']],
  });
})();
