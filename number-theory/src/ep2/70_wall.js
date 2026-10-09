// 第 70 场 · 撞墙（id wall）。B4，前缀 q2_。34.5 秒。
// 画面（ep2-storyboard.md "撞墙（反证法）"）：同屏三组 = 右侧证明栈 / 2×2 表和结果行 / 撞墙的 6。
//   L1   borrow 场的 2×2 表重新画出（四格的算式和花纹签都在）；上集的 12、8、5、7 四块数字砖依次飞进对应格子
//        （16 − 4、9 − 1、9 − 4、16 − 9），花纹签和格子一样，各打红勾（只有画面）。表下面的结果行：0（实心）、1（斜线）、
//        空着一格、3（空心）。证明栈第 5 行。
//   L2   不借的三格（L 形）红笔描出来，红字"不超过大平方的零头：0 或 1"，正好在结果行的 0、1 上面。
//   L3   顶栏展开。借位格用红线连到结果行的 3；顶栏跑道条余 3 那条红圈。"余 2 那条"：结果行空着的那格画出虚线框、
//        红字"空"，顶栏跑道条余 2 那条红圈；空格下面立起一面墙。
//   L4–L5 一个小火柴人推着 6 的砖（网点）从左边走来；6 的花纹签和空格的花纹签一起红圈（6 只在余 2 那条）；
//        证明栈第 6 行；小人轻轻撞上墙、弹回来，冒出红色小星。
//   L6   表和四块砖淡出（25.0）；"6根本没有"时 6 旁边盖一张白卡"6 / ✗ 没有小拐角"（dark 场 2026 卡的画法）；证明栈第 7 行；
//        6、墙、小人、结果行一直留到 29.0 才淡出。卡③"大平方减小平方 ÷ 4：只余 0、1、3"从 28.4 起写在左上（原来表的位置）。
//   L7   范围卡钉在卡③下面（30.3）；卡③和范围卡一起缩进顶栏（30.9）；议程 ② 打勾（31.5）；红笔顺着证明栈从"假设"一路画到"撞墙"，
//        整列亮起；"这叫反证法"时盖章（33.3）。
// 开场 = 顶栏收起 + 议程条 + 证明栈 0–4 行（第 4 行当前）+ 范围卡；
// 结尾 = 顶栏展开（卡①②③）+ 议程条（①②打勾）+ 证明栈 0–7 行全亮、盖章 + 范围卡（dark 场接着用）。
(() => {
  const DUR = 34.5, FL = N2.FL;

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    // L1
    tab: 0.15, fly: [0.85, 1.45, 2.05, 2.65], flyDur: 0.5, row: [4.25, 4.7, 5.15], st5: 5.6,
    // L2
    loop: 6.3, lbl: 7.25, lblOut: 12.6,
    // L3
    open: 10.9, arr3: 11.1, hi3: [11.25, 13.2], slot: 13.35, hi2: [13.4, 17.4], wall: 14.6, redOut: 15.7,
    // L4–L5: the little stick figure with the 6
    mini: 16.1, ring6: 16.4, ring6Out: 17.9, w1: [16.1, 17.3], w2: [18.3, 20.4], w3: [21.1, 23.6], bonk: 23.6, st6: 22.3,
    // L6–L7
    // clear: the table and the four bricks go (frees the upper area); xcard: "6 根本没有" stamps ✗ next to the 6; clear2: the 6, the wall, the figure, the result row go
    clear: 25.0, xcard: 26.9, st7: 27.3, card: 28.4, clear2: 29.0, scope: 30.3, dock: 30.9, tick: 31.5, trace: 30.85, all: 31.1, stamp: 33.3, traceOut: 33.85,
  };

  /* ---------------- self-check ---------------- */
  const CELL = { '0,0': { res: 0, n: 12, A: 16, B: 4 }, '1,1': { res: 0, n: 8, A: 9, B: 1 }, '1,0': { res: 1, n: 5, A: 9, B: 4 }, '0,1': { res: 3, n: 7, A: 16, B: 9, borrow: true } };
  {
    const bad = [], chk = (ok, what) => { if (!ok) bad.push(what); };
    for (const [rc, v] of Object.entries(CELL)) {
      const [r, c] = rc.split(',').map(Number);
      chk(v.A - v.B === v.n, `${v.A} − ${v.B} = ${v.n}`);
      chk(v.A % 4 === r && v.B % 4 === c && Math.sqrt(v.A) % 1 === 0 && Math.sqrt(v.B) % 1 === 0, `${v.A}、${v.B} 是平方，零头 ${r}、${c}`);
      chk(v.n % 4 === v.res, `${v.n} 除以 4 余 ${v.res}，落在格 (${r},${c})`);
      chk((r >= c ? r - c : r + 4 - c) === v.res && !!v.borrow === r < c, `格 (${r},${c}) 的结果 ${v.res}`);
      if (!v.borrow) chk(v.res <= r, `不借时 ${v.res} 不超过大平方的零头 ${r}`);
    }
    chk(6 % 4 === 2, '6 余 2');
    for (let a = 1; a <= 60; a++) for (let b = 0; b < a; b++) if ((a * a - b * b) % 4 === 2) bad.push(`${a}² − ${b}² 余 2`);
    if (bad.length) console.error('q2 wall: ' + bad.join('；'));
  }

  /* ---------------- helpers ---------------- */
  const box = N2.box;
  const fadeIn = (t, t0, d = 0.25) => clamp((t - t0) / d);

  /* ---------------- the 2×2 table (same geometry as borrow) ---------------- */
  const TB = { x0: 330, y0: 270, cw: 330, ch: 120 };
  const cellR = (r, c) => [TB.x0 + c * TB.cw, TB.y0 + r * TB.ch, TB.x0 + (c + 1) * TB.cw, TB.y0 + (r + 1) * TB.ch];
  const SLOT = [Object.keys(CELL).find(k => CELL[k].n === 12), Object.keys(CELL).find(k => CELL[k].n === 8), Object.keys(CELL).find(k => CELL[k].n === 5), Object.keys(CELL).find(k => CELL[k].n === 7)];
  const brickAt = rc => { const [r, c] = rc.split(',').map(Number), [x0, y0] = cellR(r, c); return [x0 + 238, y0 + 92]; };
  COMP.q2_table = {
    draw(fx, t) {
      if (t < T.tab) return;
      const k = fx.id, u = EASE.out(fadeIn(t, T.tab, 0.4)), z = Z.board;
      const [X0, Y0] = [TB.x0, TB.y0], X1 = X0 + 2 * TB.cw, Y1 = Y0 + 2 * TB.ch;
      stroke(k + '.o', box(X0, Y0, X1, Y1), { z, w: 4, draw: u, fill: C.paper });
      stroke(k + '.v', [[X0 + TB.cw, Y0], [X0 + TB.cw, Y1]], { z, w: 3, draw: u });
      stroke(k + '.h', [[X0, Y0 + TB.ch], [X1, Y0 + TB.ch]], { z, w: 3, draw: u });
      text(k + '.top', '小平方的零头', X0 + TB.cw, 202, { size: 36, z, anchor: 'middle', opacity: u });
      text(k + '.lf0', '大平方', 215, 372, { size: 36, z, anchor: 'middle', opacity: u });
      text(k + '.lf1', '的零头', 215, 414, { size: 36, z, anchor: 'middle', opacity: u });
      for (const rc of Object.keys(CELL)) {
        const [r, c] = rc.split(',').map(Number), [x0, y0, , y1] = cellR(r, c);
        stroke(`${k}.tb${r}${c}`, box(x0 + 8, y0 + 8, x0 + 48, y1 - 8), { z: Z.board + 0.4, w: 2.5, draw: u });
        N2.fill(`${k}.f${r}${c}`, x0 + 10, y0 + 10, x0 + 46, y1 - 10, CELL[rc].res, { z: Z.board + 0.3, draw: u, step: 14, dot: 3 });
      }
    },
    cues: () => [[T.tab, 'paper']],
  };
  const TW = [
    N2.W('q2tc0', '0', TB.x0 + TB.cw / 2, 222, 40, T.tab + 0.1, { anchor: 'middle', speed: 6000 }),
    N2.W('q2tc1', '1', TB.x0 + 1.5 * TB.cw, 222, 40, T.tab + 0.1, { anchor: 'middle', speed: 6000 }),
    N2.W('q2tr0', '0', 300, TB.y0 + 40, 40, T.tab + 0.1, { anchor: 'middle', speed: 6000 }),
    N2.W('q2tr1', '1', 300, TB.y0 + TB.ch + 40, 40, T.tab + 0.1, { anchor: 'middle', speed: 6000 }),
  ];
  {
    const sum = (id, r, c, s, size, dx) => { const [x0, y0] = cellR(r, c); return N2.W(id, s, x0 + dx, y0 + (size === 40 ? 16 : 18), size, T.tab + 0.15, { speed: 9000, silent: true }); };
    TW.push(sum('q2s00', 0, 0, '0 − 0 = 0', 40, 64), sum('q2s11', 1, 1, '1 − 1 = 0', 40, 64), sum('q2s10', 1, 0, '1 − 0 = 1', 40, 64));
    const [x0, y0] = cellR(0, 1);
    const R4 = layoutWriting(N2.W('q2s01r', '4 + ', x0 + 62, y0 + 18, 36, T.tab + 0.15, { color: 'red', speed: 9000, silent: true }));
    const S = layoutWriting(N2.W('q2s01a', '0 − 1 = 3', R4.xEnd, y0 + 18, 36, T.tab + 0.15, { speed: 9000, silent: true }));
    R4._n2 = S._n2 = 1;
    TW.push(R4, S, { type: 'scribe', id: 'q2s01j', text: '借一组', x: x0 + 64, y: y0 + 90, size: 36, cps: 30, color: 'red', t0: T.tab + 0.2, z: Z.annot });
  }

  /* ---------------- the four bricks from last time fly into their cells ---------------- */
  const FROM = [-60, 700];
  COMP.q2_fly = {
    draw(fx, t) {
      const k = fx.id;
      SLOT.forEach((rc, i) => {
        const t0 = T.fly[i]; if (t < t0) return;
        const v = CELL[rc], to = brickAt(rc), u = EASE.io(fadeIn(t, t0, T.flyDur));
        const p = [lerp(FROM[0], to[0], u), lerp(FROM[1], to[1], u) - 40 * Math.sin(Math.PI * u)];
        N2.brick(`${k}.b${v.n}`, p[0], p[1], v.n, v.res, { scale: lerp(1, 0.75, u), size: 50 });
      });
    },
    cues: () => T.fly.flatMap(t0 => [[t0, 'whoosh'], [t0 + T.flyDur, 'tap']]),
  };
  const TICKS = SLOT.map((rc, i) => { const [x, y] = brickAt(rc); return N2.W('q2tk' + i, '✓', x + 44, y - 21, 40, T.fly[i] + T.flyDur + 0.12, { color: 'red' }); });

  /* ---------------- the result row: 0, 1, (2: empty), 3 ---------------- */
  const RX = r => 420 + r * 150, RY = 590, RS = 0.85;
  const RW = 96 * RS, RH = 64 * RS, RTW = 96 * 0.28 * RS;
  COMP.q2_row = {
    draw(fx, t) {
      const k = fx.id;
      [0, 1, 3].forEach((r, i) => {
        const t0 = T.row[i]; if (t < t0) return;
        N2.brick(`${k}.r${r}`, RX(r), RY, r, r, { size: 44, scale: RS * Math.max(0.01, EASE.back(fadeIn(t, t0, 0.25))) });
      });
      // the empty slot for remainder 2
      if (t >= T.slot) {
        const u = fadeIn(t, T.slot, 0.3), x0 = RX(2) - RW / 2, y0 = RY - RH / 2, n0 = DL.items.length;
        N2.dash(k + '.sd', [x0, y0], [x0 + RW, y0], { color: C.red, w: 3, step: 16, on: 9, z: Z.board });
        N2.dash(k + '.sr', [x0 + RW, y0], [x0 + RW, y0 + RH], { color: C.red, w: 3, step: 16, on: 9, z: Z.board });
        N2.dash(k + '.su', [x0 + RW, y0 + RH], [x0, y0 + RH], { color: C.red, w: 3, step: 16, on: 9, z: Z.board });
        N2.dash(k + '.sl', [x0, y0 + RH], [x0, y0], { color: C.red, w: 3, step: 16, on: 9, z: Z.board });
        N2.fill(k + '.sf', x0 + 3, y0 + 3, x0 + RTW, y0 + RH - 3, 2, { z: Z.board, opacity: 0.45, step: 12 * RS, dot: 2.6 * RS });
        text(k + '.kong', '空', x0 + RTW + (RW - RTW) / 2, RY + 1, { size: 38, color: C.red, z: Z.annot, anchor: 'middle' });
        N2.fadeFrom(n0, u);
      }
    },
    cues: () => [...T.row.map(t0 => [t0, 'pop']), [T.slot, 'pen']],
  };

  /* ---------------- the wall under the empty slot ---------------- */
  const WX0 = RX(2) - 32, WX1 = RX(2) + 32, WTOP = RY + RH / 2 + 10;
  COMP.q2_wall = {
    draw(fx, t) {
      if (t < T.wall) return;
      const k = fx.id, u = EASE.out(fadeIn(t, T.wall, 0.5)), top = lerp(FL, WTOP, u);
      const sh = t >= T.bonk && t < T.bonk + 0.3 ? 3 * Math.sin((t - T.bonk) * 60) * (1 - (t - T.bonk) / 0.3) : 0;
      stroke(k + '.o', box(WX0 + sh, top, WX1 + sh, FL), { z: Z.front - 1, w: 4, fill: '#F3E3C3' });
      const rh = (FL - WTOP) / 6;
      for (let i = 1; i < 6; i++) { const y = FL - i * rh; if (y > top + 2) stroke(`${k}.h${i}`, [[WX0 + sh, y], [WX1 + sh, y]], { z: Z.front - 0.9, w: 2.5 }); }
      for (let i = 0; i < 6; i++) {
        const y0 = FL - (i + 1) * rh, y1 = FL - i * rh, x = (i % 2 ? WX0 + (WX1 - WX0) / 2 : WX0 + (WX1 - WX0) / 4) + sh;
        if (y0 >= top - 1) stroke(`${k}.v${i}`, [[x, y0], [x, y1]], { z: Z.front - 0.9, w: 2.5 });
      }
    },
    cues: () => [[T.wall, 'thud'], [T.bonk, 'thud']],
  };

  /* ---------------- the little stick figure pushing the 6 ---------------- */
  const BX = WX0 - 123;                   // hip x when the brick touches the wall
  const PUSH = { lean: 7, armScale: 1.25, ikL: { w: 1, to: 'hip', dx: 40, dy: -22, bend: 'down' }, ikR: { w: 1, to: 'hip', dx: 48, dy: -26, bend: 'down' } };
  const walks = [makeWalk(T.w1[0], T.w1[1], 5.2), makeWalk(T.w2[0], T.w2[1], 4.2), makeWalk(T.w3[0], T.w3[1], 3.0)];
  const WALKS = [T.w1, T.w2, T.w3];
  const miniPose = t => {
    const i = WALKS.findIndex(([a, b]) => t >= a && t < b);
    const base = i >= 0 ? walks[i](t) : {};
    if (t >= T.bonk) return { ...PUSH, lean: lerp(7, -8, clamp((t - T.bonk) / 0.15)), tilt: -10 * Math.sin(clamp((t - T.bonk - 0.3) / 1.2) * Math.PI * 3) * (1 - clamp((t - T.bonk - 0.3) / 1.2)) };
    return { ...base, ...PUSH, lean: PUSH.lean + (base.lean || 0) * 0.3 };
  };
  COMP.q2_carry = {
    draw(fx, t, F) {
      if (t < T.mini) return;
      const a = F.anchors.q2m; if (!a) return;
      const k = fx.id, c = [a.hip[0] + 84, a.hip[1] - 26];
      N2.brick(k + '.b', c[0], c[1], 6, 2, { scale: 0.8, size: 46 });
      if (t >= T.ring6 && t < T.ring6Out + 0.3) {
        const o = 1 - fadeIn(t, T.ring6Out, 0.3), d = EASE.out(fadeIn(t, T.ring6, 0.35));
        N2.ring(k + '.r6', c[0] - 38.4 + 10.8, c[1], 22, 34, { draw: d, opacity: o });
        N2.ring(k + '.rs', RX(2) - RW / 2 + RTW / 2, RY, 16, 36, { draw: d, opacity: o });
      }
    },
    cues: () => [[T.ring6, 'pen']],
  };

  /* ---------------- L6–L7: card ③ and its scope card ---------------- */
  const CARD3 = { at: [450, 300], w: 560 };   // upper-left, where the table was
  const SC3 = { at: [450, 480], w: 470, h: 140, size: 36, lines: ['两个数从 0、1、2……里挑，', '叫 a、b，a > b'] };
  const HUD3 = N2.HUD_GEO.card(3);
  const XC = [300, 705];                      // the ✗ card, left of the dazed figure, under the result row

  /** fades (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: keep these at the end of fx */
  COMP.q2_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.35));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };

  defineScene({
    id: 'wall', chapter: '撞墙', dur: DUR, floor: FL,
    cast: { q2m: { H: 120, head: 0.46, torso: 0.22, leg: 0.3, arm: 0.34, kid: true, blink: [3.7, 0.4] } },
    tracks: {
      q2m: {
        enter: T.mini,
        pos: [[0, [-80, FL]], [T.w1[0], [250, FL], T.w1[1] - T.w1[0], 'lin'], [T.w2[0], [470, FL], T.w2[1] - T.w2[0], 'lin'],
          [T.w3[0], [BX, FL], T.w3[1] - T.w3[0], 'lin'], [T.bonk, [BX - 70, FL], 0.4, 'out']],
        pose: [[0, miniPose]],
        face: [[0, 'focus'], [T.ring6, 'smile', 0.1], [T.w3[0], 'effort', 0.1], [T.bonk, 'jaw', 0.04], [T.bonk + 0.6, 'sheepish', 0.15]],
        turn: [[0, 0.35]],
        gaze: [[0, [800, 700]], [T.bonk + 0.6, 'viewer'], [T.xcard + 0.1, XC]],
        squash: [[0, 1], [T.bonk, 0.86, 0.05], [T.bonk + 0.05, 1, 0.3, 'back']],
      },
    },
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'wall', collapse: [[T.open, 0]], stripHi: [[T.hi3[0], T.hi3[1], 3], [T.hi2[0], T.hi2[1], 2]], dock: [[T.dock, 3]], tick: [[T.tick, 1]] },
      { type: 'n2_stack', id: 'stack', from: 5, cur: [[0, 4]], add: [[T.st5, 5], [T.st6, 6], [T.st7, 7]], all: T.all, stamp: T.stamp },
      { type: 'prop', kind: 'n1_card', id: 'scope', at: N2.STACK_CARD.at, w: N2.STACK_CARD.w, h: N2.STACK_CARD.h, size: N2.STACK_CARD.size, lines: N2.STACK_CARD.lines, t0: -1 },

      // L1–L5: the table, the flying bricks, the result row, the red notes, the wall
      { type: 'n2_grp', id: 'q2tbG', out: T.clear, inner: [{ type: 'q2_table', id: 'q2tb' }, ...TW] },
      // L2: the three cells without borrowing, and what they share
      { type: 'n2_fn', id: 'q2loop', t0: T.loop, cues: [[T.loop, 'pen']], fn: (t, lt, k) => {
        const o = 1 - fadeIn(t, T.redOut, 0.35); if (o <= 0) return;
        const X0 = TB.x0, Xm = TB.x0 + TB.cw, X1 = TB.x0 + 2 * TB.cw, Y0 = TB.y0, Ym = TB.y0 + TB.ch, Y1 = TB.y0 + 2 * TB.ch;
        stroke(k, [[X0, Y0], [Xm, Y0, 1], [Xm, Ym, 1], [X1, Ym, 1], [X1, Y1, 1], [X0, Y1, 1], [X0, Y0 - 3, 1]], { z: Z.annot, w: 6, color: C.red, draw: EASE.out(clamp(lt / 0.7)), opacity: o });
      } },
      N2.F(T.lblOut, { type: 'scribe', id: 'q2lbl', text: '不超过大平方的零头：0 或 1', x: TB.x0, y: 540, size: 36, cps: 12, color: 'red', t0: T.lbl, z: Z.annot }, 0.35),
      // L3: the borrow cell always lands on 3
      { type: 'n2_fn', id: 'q2a3', t0: T.arr3, cues: [[T.arr3, 'pen']], fn: (t, lt, k) => {
        const o = 1 - fadeIn(t, T.redOut, 0.35); if (o <= 0) return;
        const n0 = DL.items.length, [, y0, x1, y1] = cellR(0, 1);
        arrow(k, [x1 + 6, (y0 + y1) / 2], [RX(3) + 22, RY - RH / 2 - 10], { p: EASE.out(clamp(lt / 0.45)), bend: -0.35, color: C.red, w: 4.5, z: Z.annot });
        N2.fadeFrom(n0, o);
      } },
      { type: 'n2_grp', id: 'q2flG', out: T.clear, inner: [{ type: 'q2_fly', id: 'q2fl' }, ...TICKS] },
      { type: 'n2_grp', id: 'q2rwG', out: T.clear2, inner: [{ type: 'q2_row', id: 'q2rw' }, { type: 'q2_wall', id: 'q2wl' }] },
      { type: 'n2_grp', id: 'q2cyG', out: T.clear2, inner: { type: 'q2_carry', id: 'q2cy' } },
      // L6 "6根本没有小拐角": a white card stamped next to the 6 (the look of dark's 2026 card)
      { type: 'n2_grp', id: 'q2xcG', out: T.clear2, inner: { type: 'n2_fn', id: 'q2xc', t0: T.xcard, cues: [[T.xcard, 'stamp']], fn: (t, lt, k) => {
        const n0 = DL.items.length, s = lerp(1.6, 1, EASE.back(clamp(lt / 0.22)));
        DL.save(); DL.translate(XC[0], XC[1]); DL.rotate(-4); DL.scale(s);
        stroke(k + '.bk', N2.box(-150, -65, 150, 65), { z: Z.annot + 2, w: 4, fill: '#FFFFFF' });
        text(k + '.n', '6', 0, -30, { size: 40, z: Z.annot + 2.2, font: CFG.FONT_MIX });
        text(k + '.x', '✗', -112, 30, { size: 50, color: C.red, z: Z.annot + 2.2, font: CFG.FONT_MIX });
        text(k + '.t', '没有小拐角', 22, 30, { size: 40, z: Z.annot + 2.2 });
        DL.restore(); N2.fadeFrom(n0, clamp(lt * 6));
      } } },
      { type: 'n2_star', id: 'q2star', at: [BX - 70 + 4, FL - 150], r: 20, t0: T.bonk + 0.05, dur: 1.4 },

      // L6–L7: card ③ with its scope card, both fly into the top bar
      { type: 'n2_bigcard', id: 'q2c3', n: 3, at: CARD3.at, w: CARD3.w, lines: ['大平方减小平方 ÷ 4：', '只余 0、1、3'], size: 50, t0: T.card, cps: 12, dock: T.dock },
      { type: 'n2_grp', id: 'q2scG', out: T.dock + 0.25, dur: 0.35, inner: { type: 'prop', kind: 'n1_card', id: 'q2sc', ...SC3, t0: T.scope, drawDur: 0.4, sfxAt: [[T.scope, 'paper']],
        pos: [[0, SC3.at], [T.dock, [HUD3[0], HUD3[1] + 30], 0.6, 'io']], scale: [[0, 1], [T.dock, 0.3, 0.6, 'io']] } },
      // L7: the red pen runs down the stack, from the assumption to the wall
      { type: 'n2_fn', id: 'q2trace', t0: T.trace, cues: [[T.trace, 'swish']], fn: (t, lt, k) => {
        const o = 1 - fadeIn(t, T.traceOut, 0.35); if (o <= 0) return;
        const n0 = DL.items.length, x = N2.STACK_X - 42;
        arrow(k, [x, N2.STACK_Y - 16], [x, N2.STACK_Y + 7 * N2.STACK_LH + 14], { p: EASE.io(clamp(lt / 1.3)), bend: 0, color: C.red, w: 4.5, z: Z.annot });
        N2.fadeFrom(n0, o);
      } },

      // exits that must stay last
      { type: 'q2_fade', t0: T.clear2, keys: ['q2m.'] },
    ],
    subs: [
      { t0: 0.6, t1: 5.89, text: '所以两个平方相减，零头只能是0、1、3：', say: '所以两个平方相减，零头只能是零、一、三：' },
      { t0: 6.09, t1: 10.73, text: '不借时，结果不超过大平方的零头：0或1；', say: '不借时，结果不超过大平方的零头：零或一；' },
      { t0: 10.93, t1: 15.67, text: '借一组，总是3。余2那条，谁也到不了。', say: '借一组，总是三。余二那条，谁也到不了。' },
      { t0: 16.07, t1: 20.53, text: '可6在余2那条；一个数只在一条跑道上，', say: '可六在余二那条；一个数只在一条跑道上，' },
      { t0: 20.73, t1: 25.06, text: '不可能又在0、1、3：撞墙了。', say: '不可能又在零、一、三：撞墙了。' },
      { t0: 25.31, t1: 29.22, text: '所以假设错了：6根本没有小拐角。', say: '所以假设错了：六根本没有小拐角。' },
      { t0: 29.72, t1: 34.05, text: '先假设能做到，推到撞墙：这叫反证法。' },
    ],
  });
})();
