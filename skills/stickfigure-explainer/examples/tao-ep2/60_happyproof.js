// 证明快乐数：用“一步一步写出理由”的写法，把小陶八岁时的猜想讲清楚。
// 第一步：大数会变小（四位数最多 9999 → 324）；第二步：1000 以下跑不出 1000（999 → 243）；第三步：电脑检查 1～999。
// 结果：1～999 中停在 1 的有 142 个，其余 857 个都进入 4→16→37→58→89→145→42→20 的圈（下面的代码现算核对）。
(() => {
  const FL = 780;
  const H = window.h2Happy;                       // from 10_visitor.js (digit-square sum, ring helpers)
  const sq = H.sq;
  if (!GLYPH['<']) GLYPH['<'] = { w: 0.56, s: [[[0.5, 0.36], [0.06, 0.64, 1], [0.5, 0.92]]] };
  // every number drawn below is computed here
  const happy = n => { const seen = new Set(); while (n !== 1 && !seen.has(n)) { seen.add(n); n = sq(n); } return n === 1; };
  let NH = 0; for (let n = 1; n <= 999; n++) if (happy(n)) NH++;
  const NL = 999 - NH;                                                           // 142 / 857
  let MAX3 = 0; for (let n = 1; n <= 999; n++) MAX3 = Math.max(MAX3, sq(n));    // 243
  const BIGN = 987654, B1 = sq(BIGN), B2 = sq(B1);                              // 271, 54
  if (sq(9999) !== 324 || MAX3 !== 243 || sq(999) !== 243 || B1 !== 271 || B2 !== 54) throw new Error('h2 happyproof numbers');

  const probe = (s, size) => layoutWriting({ text: s, x: 0, y: 0, size, t0: 0, speed: 1 });
  const WRS = [];
  /** a chain of write blocks placed one after another */
  const chain = (parts, x, y, size, o = {}) => {
    let xx = x;
    return parts.map(([id, s, t0, extra = {}]) => {
      const lead = s.length - s.trimStart().length; s = s.trimStart();
      xx += lead * (GLYPH[' '].w + 0.1) * (extra.size || size) + (extra.pad || 0);
      const fx = { type: 'write', id, text: s, x: xx, y: y + (extra.dy || 0), size: extra.size || size, t0, speed: extra.speed || 2400, gap: 0.02, glyphGap: 0.02,
        w: extra.w || o.w || 5.5, sfx: 'pen', z: Z.board, t1: o.t1, color: extra.color };
      xx += probe(s, fx.size).xEnd;
      WRS.push(fx); return fx;
    });
  };

  /* ---------------- page 0: the conjecture again ---------------- */
  const P0 = 9.75;
  chain([['h2p0a', '7 → … → 1', 1.3]], 190, 300, 64, { t1: P0 });
  chain([['h2p0b', '2 → 4 → 16 → … → 4', 2.6]], 190, 400, 64, { t1: P0 });
  /* ---------------- page 1: steps 1 and 2 ---------------- */
  const P1 = 39.6, SA = 62;
  const RA = chain([['h2a1', '9999', 13.9, { w: 6 }], ['h2a2', ' → 81+81+81+81', 17.8], ['h2a3', ' = 324', 21.6, { pad: 18 }], ['h2a4', ' < 1000', 23.9, { color: 'red', w: 5, pad: 4 }]], 170, 330, SA, { t1: P1 });
  const RC = chain([['h2c1', String(BIGN), 27.2, { size: 80, dy: -8, w: 6.5 }], ['h2c2', ` → ${B1}`, 28.9, { size: 60, dy: 10 }], ['h2c3', ` → ${B2}`, 30.1, { size: 46, dy: 24, w: 4.5 }]], 170, 458, 60, { t1: P1 });
  const RD = chain([['h2d1', '999', 34.9, { w: 6 }], ['h2d2', ' → 81+81+81', 35.8], ['h2d3', ` = ${MAX3}`, 37.3, { pad: 18 }]], 170, 668, SA, { t1: P1 });
  /* ---------------- page 2: the computer ---------------- */
  const P2 = 56.85;
  /* ---------------- page 3: the note, stamped ---------------- */

  /* ---------------- the computer (a simplified 1980s machine) ---------------- */
  const MONO = 34, ADV = 0.4 * MONO, LH = 36, ROWS = 6, SX = 232, SY = 392;
  const RUN0 = 46.1, RUN1 = 49.55;
  const lineOf = n => { const a = sq(n), b = sq(a); return `${n} -> ${a} -> ${b} ... ${happy(n) ? '1 :)' : 'LOOP'}`; };
  const nAt = t => t < RUN0 ? 0 : Math.min(999, Math.max(1, Math.ceil(999 * Math.pow(clamp((t - RUN0) / (RUN1 - RUN0)), 3))));
  function screenLines(t) {
    const out = [];
    if (t >= 44.3) { const s = 'RUN CHECK 1-999', k = Math.min(s.length, Math.floor((t - 44.3) * 12)); out.push(s.slice(0, k)); }
    const n = nAt(t);
    for (let i = Math.max(1, n - ROWS + 1); i <= n; i++) out.push(lineOf(i));
    if (t >= RUN1 + 0.2) out.push('DONE: 999 NUMBERS');
    if (t >= RUN1 + 0.6) out.push(`STOP AT 1: ${NH}   LOOP: ${NL}`);
    return out.slice(-ROWS);
  }
  PROPS.h2_pc = (fx, t, lt, p) => {
    const zc = Z.set + 1, zt = Z.set + 3;
    stroke('h2pc.case', superPts(450, 490, 540, 320, 30, 7), { z: zc, w: 6, closed: true, fill: C.paper, draw: stag(p, 0, 4) });
    stroke('h2pc.scr', superPts(450, 486, 484, 256, 30, 5), { z: zc + 0.2, w: 4.5, closed: true, fill: C.paper, draw: stag(p, 1, 4) });
    stroke('h2pc.gl', [[676, 540], [672, 580], [656, 598]], { z: zc + 0.3, w: 2.4, color: C.pencil, opacity: 0.6 * stag(p, 2, 4), boil: 0.5 });
    if (p > 0.6) dot('h2pc.led', [212, 632], 5, C.ink, zc + 0.3);
    stroke('h2pc.base', [[400, 650], [500, 650, 1], [516, 676, 1], [384, 676, 1], [400, 650, 1]], { z: zc, w: 4.5, fill: C.paper, draw: stag(p, 2, 4) });
    stroke('h2pc.kb', [[296, 766], [310, 718, 1], [590, 718, 1], [604, 766, 1], [296, 766, 1]], { z: zc, w: 5, fill: C.paper, draw: stag(p, 3, 4) });
    if (p > 0.8) [0, 1, 2].forEach(r => { for (let i = 0; i < 12 - r; i++) stroke(`h2pc.k${r}.${i}`, [[330 + r * 8 + i * 21, 730 + r * 11], [341 + r * 8 + i * 21, 730 + r * 11]], { z: zc + 0.1, w: 4, boil: 0.4 }); });
    if (p < 0.99) return;
    const L = screenLines(t);
    L.forEach((s, i) => text('h2pc.r' + i, s, SX, SY + i * LH, { size: MONO, font: CFG.FONT_MONO, anchor: 'start', z: zt }));
    if ((t * 2.4) % 1 < 0.55 && t < RUN0) { const last = L[L.length - 1] || '', cx = SX + last.length * ADV + 2, cy = SY + (Math.max(1, L.length) - 1) * LH;
      stroke('h2pc.cur', [[cx, cy - 12], [cx + ADV - 2, cy - 12, 1], [cx + ADV - 2, cy + 12, 1], [cx, cy + 12, 1]], { z: zt, closed: true, fill: C.ink, noStroke: true, w: 1, boil: 0.2 }); }
    // the "blink of an eye": speed lines while it runs
    if (t > RUN0 && t < RUN1) [0, 1, 2].forEach(i => stroke('h2pc.sp' + i, [[726 + i * 14, 400 + i * 60], [760 + i * 14, 390 + i * 60]], { z: Z.fx, w: 3.5, boil: 1 }));
  };
  const KEYS = []; for (let i = 0; i < 15; i++) KEYS.push([44.3 + i / 12, 'key']);

  /* ---------------- result boxes ---------------- */
  const BOX1 = [840, 316, 1090, 516], BOX2 = [1110, 296, 1490, 488], MR = [1300, 414, 150, 52];
  COMP.h2_results = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const box = (k, b, t0) => {
        const pp = EASE.back(clamp((t - t0) / 0.3)); if (pp <= 0) return false;
        const [x0, y0, x1, y1] = b, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        DL.save(); DL.about(cx, cy, () => DL.scale(pp));
        stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z: Z.board, w: 5, fill: C.paper });
        DL.restore(); return pp > 0.95;
      };
      if (box('h2rb1', BOX1, fx.t0)) {
        text('h2rb1.t', '停在 1', 965, 350, { size: 44, z: Z.board + 1 });
        text('h2rb1.n', '1', 965, 420, { size: 96, font: CFG.FONT_MIX, z: Z.board + 1 });
        stroke('h2rb1.r', ringPts('h2rb1.r', 965, 422, 40, 50, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - fx.t0 - 0.35) / 0.35)) });
        H.smiley('h2rb1.s', [1022, 380], 15, C.red, Z.annot, EASE.out(clamp((t - fx.t0 - 0.6) / 0.3)));
        text('h2rb1.c', `${NH} 个`, 965, 490, { size: 34, font: CFG.FONT_MIX, z: Z.board + 1, opacity: clamp((t - fx.t0 - 0.8) / 0.2) });
      }
      if (box('h2rb2', BOX2, fx.t1b)) {
        text('h2rb2.t', '绕那个圈', 1300, 332, { size: 40, z: Z.board + 1 });
        const [cx, cy, rx, ry] = MR;
        H.RING.forEach((n, i) => { const a = (180 + i * 45) * RAD; text('h2rb2.n' + i, String(n), cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, { size: 32, font: CFG.FONT_MIX, z: Z.board + 1, halo: 7 }); });
        stroke('h2rb2.e', ringPts('h2rb2.e', cx, cy, rx, ry, { n: 16, a0: 0, sweep: 360, rv: 0, closed: true }), { z: Z.board + 0.5, w: 2.4, color: C.pencil, closed: true, opacity: 0.8 });
        const a = (180 + (t - fx.t1b) * 150) * RAD;
        dot('h2rb2.sp', [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry], 8, C.red, Z.board + 0.7);
        text('h2rb2.c', `${NL} 个`, cx, cy + 2, { size: 34, font: CFG.FONT_MIX, z: Z.board + 1, opacity: clamp((t - fx.t1b - 0.8) / 0.2) });
      }
    },
    cues: fx => [[fx.t0, 'pop'], [fx.t0 + 0.35, 'pen'], [fx.t1b, 'pop']],
  };

  /* ---------------- page 3: the professor's note, now stamped ---------------- */
  const NB = [170, 286, 870, 466], NT = 57.0, ST = 58.1;
  const NOTE = window.h2Note || { A: '没有证明 · ', B: '没试两位数' };
  const TICK = layoutWriting({ text: '✓', x: 760, y: 250, size: 190, t0: ST, speed: 2600 });
  COMP.h2_stamped = {
    draw(fx, t) {
      if (t < NT) return;
      const lt = t - NT, p = EASE.out(clamp(lt / 0.35)), [x0, y0, x1, y1] = NB, z = Z.board;
      stroke('h2sn.card', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 5, fill: C.paper, draw: p });
      for (let i = 0; i < 12; i++) stroke('h2sn.sp' + i, ringPts('h2sn.sp' + i, x0 + 40 + i * 57, y0, 9, 13, { n: 8, closed: true }), { z: z + 0.1, w: 3, closed: true, draw: clamp(p * 1.4 - 0.4) });
      if (lt > 0.3) {
        const op = clamp((lt - 0.3) / 0.2);
        text('h2sn.h', '教授的笔记', x0 + 30, y0 + 44, { size: 32, anchor: 'start', z: z + 0.2, opacity: op });
        text('h2sn.t', NOTE.A + NOTE.B, x0 + 44, y0 + 120, { size: 54, anchor: 'start', z: z + 0.2, opacity: op });
      }
      // red stamp: a big tick + "猜想是对的！"
      TICK.strokes.forEach((s, i) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke('h2sn.tk' + i, s.pts, { z: Z.stamp, w: 12, color: C.red, draw: q, boil: 0.6 }); });
      const sp = clamp((t - ST - 0.3) / 0.2);
      if (sp > 0) text('h2sn.ok', '猜想是对的！', 1000, 500, { size: 60, color: C.red, z: Z.stamp, rot: -5, scale: lerp(1.8, 1, EASE.out(sp)), opacity: sp, halo: 8 });
    },
    cues: () => [[NT, 'paper'], [ST, 'pen'], [ST + 0.3, 'stamp'], [ST + 0.35, 'tada']],
  };
  /** red brace beside the three written reasons */
  COMP.h2_brace = {
    draw(fx, t) {
      const p = EASE.out(clamp((t - fx.t0) / 0.35)); if (p <= 0) return;
      const x = 900, y0 = 560, y1 = 760, m = (y0 + y1) / 2;
      stroke('h2br', [[x, y0], [x + 18, y0 + 12], [x + 20, m - 14], [x + 38, m, 1], [x + 20, m + 14], [x + 18, y1 - 12], [x, y1]], { z: Z.annot, w: 5, color: C.red, draw: p });
    },
    cues: fx => [[fx.t0, 'pen']],
  };

  const pointL = { armScale: 1.5, armL: [84, 6], armR: [16, 10] };
  defineScene({
    id: 'happyproof', chapter: '证明快乐数', dur: 68.0, floor: FL,
    cast: {
      terry: { H: 245, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.6,
        pos: [[0, [1400, FL]]],
        pose: [[0, 'stand'], [1.4, pointL, 0.15], [4.8, 'stand', 0.2], [13.9, pointL, 0.15], [16.8, 'stand', 0.2], [23.8, 'cheer', 0.12, 'back'], [25.8, 'stand', 0.2],
          [28.9, pointL, 0.15], [31.8, 'stand', 0.2], [37.3, pointL, 0.15], [39.4, 'stand', 0.2], [46.1, { armScale: 1.3, armL: [30, 110], armR: [30, 110] }, 0.15], [49.6, 'stand', 0.2],
          [57.0, 'cheer', 0.12, 'back'], [60.9, 'stand', 0.3]],
        squash: [[0, 1], [23.7, 0.9, 0.06], [23.8, 1.1, 0.08], [23.95, 1, 0.25, 'back'], [56.9, 0.88, 0.08], [57.0, 1.12, 0.08], [57.15, 1, 0.25, 'back']],
        face: [[0, 'smile'], [1.3, 'focus', 0.05], [5.1, 'smile', 0.05], [10.0, 'focus', 0.05], [21.6, 'idea', 0.05], [23.8, 'grin', 0.05], [26.5, 'focus', 0.05],
          [28.9, 'surprised', 0.05], [30.5, 'grin', 0.05], [32.8, 'focus', 0.05], [37.3, 'proud', 0.05], [39.7, 'focus', 0.05], [46.1, 'surprised', 0.05],
          [49.6, 'grin', 0.05], [51.0, 'focus', 0.05], [57.0, 'joy', 0.05], [61.0, 'proud', 0.05]],
        turn: [[0, -0.35]],
        gaze: [[0, 'viewer'], [1.3, [500, 340]], [5.1, 'viewer'], [9.9, [420, 300]], [13.9, [260, 370]], [17.8, [700, 360]], [21.6, [1000, 360]], [23.8, 'viewer'],
          [27.2, [300, 470]], [29.5, [650, 500]], [32.8, [500, 640]], [35.0, [600, 690]], [39.7, [400, 300]], [44.3, [450, 490]], [50.8, [965, 420]], [53.8, [1300, 410]],
          [57.0, 'viewer'], [59.0, 'qm'], [61.2, [500, 660]], [64.5, 'viewer']],
      },
    },
    targets: F => ({ qm: (F.anchors.qm || {}).head || [1190, 620] }),
    fx: [
      { type: 'factCard', id: 'card', t0: 0, box: [90, 92, 1510, 790], topic: '把快乐数讲清楚', rules: [] },
      // page 0: recap
      { type: 'scribe', id: 'h2p0t', text: '猜想：所有的数，都只有这两种结局？', x: 170, y: 540, size: 48, t0: 3.3, t1: P0, cps: 9, z: Z.board },
      { type: 'prop', kind: 'h2_miniNote', id: 'mn', t0: 1.0, t1: P0, at: [1080, 360], drawDur: 0.3, sfxAt: [[1.0, 'paper']] },
      { type: 'scribe', id: 'h2p0n', text: '新写法：一步一步，写出“为什么”', x: 170, y: 650, size: 48, t0: 5.4, t1: P0, cps: 9, color: 'red', z: Z.annot },
      // page 1
      { type: 'scribe', id: 'h2s1', text: '第一步：大数会变小', x: 170, y: 290, size: 50, t0: 10.0, t1: P1, cps: 8, z: Z.board },
      { type: 'label', id: 'lb9', text: '每一位最大是 9', at: [640, 395], rot: -3, t0: 15.2, t1: 17.6, target: { write: 'h2a1', glyph: 3, dy: -30 }, bend: 0.2, gap: 14 },
      { type: 'highlight', id: 'h2hiA', of: 'h2a3', t0: 22.5, t1: P1, dur: 0.3 },
      { type: 'label', id: 'lbDrop', text: '几步就掉到 1000 以下', at: [760, 578], rot: -2, t0: 30.8, t1: 32.7, target: { write: 'h2c2', glyph: 4, dy: 4 }, bend: -0.25, gap: 12 },
      { type: 'scribe', id: 'h2s2', text: '第二步：1000 以下的数，跑不出 1000', x: 170, y: 622, size: 44, t0: 32.9, t1: P1, cps: 9, z: Z.board },
      { type: 'highlight', id: 'h2hiD', of: 'h2d3', t0: 38.0, t1: P1, dur: 0.3 },
      { type: 'label', id: 'lbOut', text: ['最多 243，', '跑不出去！'], at: [1110, 700], rot: -3, t0: 38.3, t1: P1, size: 40 },
      ...WRS,
      // page 2
      { type: 'scribe', id: 'h2s3', text: '第三步：把 1 到 999 一个个检查', x: 170, y: 290, size: 48, t0: 39.9, t1: P2, cps: 9, z: Z.board },
      { type: 'prop', kind: 'h2_pc', id: 'pc', t0: 41.6, t1: P2, at: [0, 0], drawDur: 0.6, sfxAt: [[41.6, 'swish'], [RUN0, 'beep'], [RUN1 + 0.2, 'ding'], ...KEYS] },
      { type: 'label', id: 'lbBlink', text: '一眨眼', at: [820, 600], rot: -4, t0: 47.0, t1: 50.6, target: [700, 490], bend: 0.2, gap: 14 },
      { type: 'h2_results', id: 'res', t0: 51.9, t1b: 53.9, t1: P2 },
      // page 3
      { type: 'h2_stamped', id: 'stamped' },
      { type: 'scribe', id: 'h2w1', text: '第一步：大数会变小', x: 190, y: 580, size: 42, t0: 61.8, cps: 12, z: Z.board },
      { type: 'scribe', id: 'h2w2', text: '第二步：1000 以下，跑不出去', x: 190, y: 660, size: 42, t0: 62.9, cps: 12, z: Z.board },
      { type: 'scribe', id: 'h2w3', text: '第三步：电脑检查 1～999', x: 190, y: 740, size: 42, t0: 64.0, cps: 12, z: Z.board },
      { type: 'h2_brace', id: 'brace', t0: 65.0 },
      { type: 'label', id: 'lbWhy', text: '“为什么”', at: [1072, 660], rot: -3, t0: 65.3, t1: 68.0, size: 46 },
      { type: 'qm', id: 'qm', size: 180, t0: 58.6, pos: [[0, [1262, FL]]], burst: true,
        act: [[0, 'hop'], [59.5, 'nod'], [63.0, 'idle'], [65.3, 'nod']],
        mood: [[0, 'happy']],
        gaze: [[0, [520, 380]], [61.0, [500, 660]], [65.3, 'viewer']],
        sfxAt: [[58.6, 'boing'], [59.5, 'plip']] },
    ],
    sfx: [[0.6, 'hop'], [23.8, 'hop'], [57.0, 'hop'], [P0, 'swish'], [P1, 'swish'], [P2, 'swish']],
    subs: [
      { t0: 0.3, t1: 5.0, text: '还记得小陶八岁时的快乐数猜想吗？' },
      { t0: 5.1, t1: 9.8, text: '用新的写法，我们也能把它讲清楚。' },
      { t0: 9.9, t1: 13.0, text: '第一步：大数会变小。' },
      { t0: 13.1, t1: 17.3, text: '一个四位数，每一位最大是9，', say: '一个四位数，每一位最大是九，' },
      { t0: 17.4, t1: 23.5, text: '9乘9是81，四位加起来最多324，', say: '九乘九是八十一，四位加起来最多三百二十四，' },
      { t0: 23.6, t1: 26.4, text: '比1000小多了！', say: '比一千小多了！' },
      { t0: 26.5, t1: 32.6, text: '所以再大的数，算几步就会掉到1000以下。', say: '所以再大的数，算几步就会掉到一千以下。' },
      { t0: 32.7, t1: 39.6, text: '第二步：1000以下的数，再算也跑不出1000。', say: '第二步：一千以下的数，再算也跑不出一千。' },
      { t0: 39.7, t1: 45.5, text: '第三步：把1到999一个个检查——', say: '第三步：把一到九百九十九，一个个检查——' },
      { t0: 45.6, t1: 50.6, text: '这个活儿交给电脑，一眨眼就做完了。' },
      { t0: 50.7, t1: 56.8, text: '结果：只有两种结局，停在1，或者绕那个圈。', say: '结果：只有两种结局，停在一，或者绕那个圈。' },
      { t0: 56.9, t1: 60.8, text: '小陶八岁时的猜想，是对的！' },
      { t0: 60.9, t1: 66.7, text: '不过这一次，我们把“为什么”也写出来了。' },
    ],
  });

  /** page 0: the professor's note from before, small */
  PROPS.h2_miniNote = (fx, t, lt, p) => {
    const z = Z.board;
    stroke('h2mn', [[-180, -70], [180, -70, 1], [180, 70, 1], [-180, 70, 1], [-180, -70, 1]], { z, w: 4.5, fill: C.paper, draw: p });
    for (let i = 0; i < 7; i++) stroke('h2mn.sp' + i, ringPts('h2mn.sp' + i, -150 + i * 50, -70, 7, 10, { n: 8, closed: true }), { z: z + 0.1, w: 2.6, closed: true, draw: p });
    if (p > 0.9) {
      text('h2mn.h', '教授的笔记', -160, -32, { size: 26, anchor: 'start', z: z + 0.2 });
      text('h2mn.t', '没有证明 · 没试两位数', 0, 20, { size: 38, z: z + 0.2 });
    }
  };
})();
