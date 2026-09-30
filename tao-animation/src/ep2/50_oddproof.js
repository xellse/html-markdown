// 怎样写清楚：同一个答案的三种写法（奇数 + 奇数 = 偶数）。
// 写法一“显然。”→ 小问号问“为什么显然？”；写法二举三个例子 → “只试了三个呀”（呼应圆上 31 块）；
// 写法三一步一步：奇数 = 两个两个排好 + 多出一个；两个多出来的凑成一对；全是对 → 偶数。最后换成很大的数也一样。
(() => {
  const FL = 776;
  const SH = { cx: 810, cy: 460, w: 1120, h: 620 };        // sheet: x 250–1370, y 150–770
  const QX = 118, TX = 1480;
  const ZB = Z.board + 2;                                   // phase-B page content sits above the new sheet

  /* ---------------- helpers ---------------- */
  const LAY = new Map();
  const lay = (str, size, speed) => {
    const k = str + '|' + size + '|' + speed; let L = LAY.get(k);
    if (!L) { L = layoutWriting({ text: str, x: 0, y: 0, size, t0: 0, speed, gap: 0.03, glyphGap: 0.03 }); LAY.set(k, L); }
    return L;
  };
  const wWidth = (str, size) => { const L = lay(str, size, 1600); return L.xEnd - 0.1 * size; };
  /** handwriting (GLYPH strokes) at cx (centred) or x (anchor start) that writes on from t0 */
  function ink(key, str, x, y, size, t0, t, o = {}) {
    if (t < t0) return;
    const L = lay(str, size, o.speed || 1600), dx = o.start ? x : x - wWidth(str, size) / 2;
    L.strokes.forEach((s, i) => {
      const p = clamp((t - t0 - s.t0) / s.dur); if (p <= 0) return;
      stroke(key + '.' + i, s.pts.map(q => [q[0] + dx, q[1] + y, q[2]]), { z: o.z ?? ZB, w: o.w || 5, color: o.color === 'red' ? C.red : C.ink, draw: p, boil: 0.55, opacity: o.op });
    });
  }
  /** Chinese handwriting line, written in segments [{n, t0}] (character counts), anchor start */
  COMP.p2o_line = {
    draw(fx, t) {
      if (t < fx.segs[0].t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const chars = [...fx.text], cps = fx.cps || 8;
      let n = 0, base = 0;
      fx.segs.forEach(s => { const sn = s.n ?? chars.length - base; if (t >= s.t0) n = Math.min(base + sn, base + Math.floor((t - s.t0) * cps) + 1); base += sn; });
      const x = fx.center ? fx.x - textWidth(fx.text, fx.size) / 2 : fx.x;
      text(fx.id, chars.slice(0, n).join(''), x, fx.y, { size: fx.size || 44, anchor: 'start', color: fx.color === 'red' ? C.red : C.ink, z: fx.z ?? ZB });
    },
    cues: fx => { const c = []; let base = 0; const L = [...fx.text].length; fx.segs.forEach(s => { const sn = s.n ?? L - base; base += sn; for (let i = 0; i < sn; i += 2) c.push([s.t0 + i / (fx.cps || 8), 'pen']); }); return c; },
  };
  /** the notebook sheet (centred on the prop position) */
  PROPS.p2o_sheet = (fx, t, lt, p) => {
    const W = SH.w, H = SH.h, z = fx.z ?? Z.set, k = fx.id;
    stroke(k + '.s', [[-W / 2, -H / 2], [W / 2, -H / 2 + 3, 1], [W / 2 - 2, H / 2, 1], [-W / 2 + 3, H / 2 - 2, 1], [-W / 2, -H / 2, 1]], { z, w: 5, fill: C.paper, draw: p });
    stroke(k + '.sh', [[-W / 2 + 14, H / 2 + 8], [W / 2 + 8, H / 2 + 6, 1], [W / 2 + 8, -H / 2 + 14]], { z: z - 0.3, w: 2.4, color: C.pencil, opacity: 0.65 * p, boil: 0.5 });
    stroke(k + '.m', [[-W / 2 + 54, -H / 2 + 14], [-W / 2 + 54, H / 2 - 14]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.5 * p, boil: 0.4 });
  };
  /** red pen marks: ✓ / ✗ drawn in stroke order. {kind, at, size, t0, t1, z} */
  COMP.p2o_mark = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, [x, y] = fx.at, s = fx.size || 40, z = fx.z ?? ZB + 1;
      if (fx.kind === 'x') {
        stroke(fx.id + '.a', [[x - s, y - s * 0.7], [x + s, y + s * 0.7]], { z, w: 7, color: C.red, draw: EASE.out(clamp(lt / 0.18)) });
        stroke(fx.id + '.b', [[x + s, y - s * 0.7], [x - s, y + s * 0.7]], { z, w: 7, color: C.red, draw: EASE.out(clamp((lt - 0.2) / 0.18)) });
      } else {
        stroke(fx.id, [[x - s * 0.5, y], [x - s * 0.15, y + s * 0.4, 1], [x + s * 0.55, y - s * 0.5]], { z, w: fx.w || 5.5, color: C.red, draw: EASE.out(clamp(lt / 0.22)) });
      }
    },
    cues: fx => [[fx.t0, 'pen']].concat(fx.kind === 'x' ? [[fx.t0 + 0.2, 'pen']] : []),
  };

  /* ---------------- the dot picture (pure function of t) ---------------- */
  const S = 64, RT = 290, RB = 354, MID = (RT + RB) / 2, DR = 13, LY = 386;
  const T = {
    scat: 34.0, arr0: 37.3, arr1: 38.3, ovA: 38.5, ringA: 39.5, lab7: 38.9,
    p2: 42.4, popB: 43.1, lab9: 44.0, plus: 44.4, ringB: 43.9,
    p3: 47.6, p3e: 48.6, ringOff: 47.35, yel: 48.8, ovM: 49.1,
    pulse: 53.0, eq16: 54.4,
    p5: 60.6, p5e: 61.3, popA2: 61.3, popB2: 62.1, labBig: 61.6, ringBig: 63.0, ringBigOff: 63.6, m0: 63.8, m1: 64.6, yelBig: 64.7, eqBig: 65.2,
  };
  const segX = (t, keys) => { let v = keys[0][1]; keys.slice(1).forEach(([t0, x, d]) => { const u = EASE.io(clamp((t - t0) / d)); v = lerp(v, x, u); }); return v; };
  const x0A = t => segX(t, [[0, 714], [T.p2, 522, 0.6], [T.p3, 586, 1.0]]);
  const x0B = t => segX(t, [[0, 842], [T.p3, 778, 1.0]]);
  const SCAT = [[630, 280], [760, 256], [915, 300], [690, 372], [842, 380], [985, 350], [812, 316]];
  const popS = (t, t0) => EASE.back(clamp((t - t0) / 0.2));
  const oval = (key, x, t, t0, o = {}) => {
    const p = EASE.out(clamp((t - t0) / 0.3)); if (p <= 0) return;
    const bump = o.pulse ? 1 + 0.22 * Math.sin(Math.PI * clamp((t - o.pulse) / 0.35)) : 1;
    stroke(key, ringPts(key, x, MID, 25 * bump * (o.k || 1), 56 * bump * (o.k || 1), { n: 12, a0: -100, sweep: 372, rv: 0.04 }), { z: ZB + 0.5, w: 2.8, color: C.ink, draw: p, opacity: 0.85 });
  };
  const redRing = (key, p, t, t0, t1) => {
    const u = EASE.out(clamp((t - t0) / 0.3)), o = 1 - clamp((t - t1) / 0.3); if (u <= 0 || o <= 0) return;
    stroke(key, ringPts(key, p[0], p[1], 26, 26, { n: 10, a0: -130, sweep: 380, rv: 0.05 }), { z: ZB + 1, w: 4.2, color: C.red, draw: u, opacity: o });
  };
  const yellow = (key, x, t, t0, k = 1) => {
    const p = EASE.out(clamp((t - t0) / 0.35)); if (p <= 0) return;
    stroke(key, superPts(x, MID, 56 * k, 118 * k * p, 16, 3), { z: ZB + 0.2, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
  };

  /** 7 + 9: pairs, leftovers, merge. Drawn in its own frame so it can shrink aside for the big numbers. */
  function smallPic(t) {
    const xa = x0A(t), xb = x0B(t);
    // A = 7: pairs in columns 0..2, leftover on top in column 3
    for (let k = 0; k < 7; k++) {
      const col = k < 6 ? Math.floor(k / 2) : 3, row = k < 6 ? k % 2 : 0;
      const g = [xa + col * S, row ? RB : RT];
      const u = EASE.io(clamp((t - T.arr0 - (k % 4) * 0.08) / 0.7));
      const p = lerp2(SCAT[k], g, u), s = popS(t, T.scat + k * 0.12);
      if (s > 0) dot('p2o.a' + k, p, DR * s, C.ink, Z.front);
    }
    for (let i = 0; i < 3; i++) oval('p2o.oa' + i, xa + i * S, t, T.ovA + i * 0.2, { pulse: T.pulse + i * 0.13 });
    redRing('p2o.ra', [xa + 3 * S, RT], t, T.ringA, T.ringOff);
    // B = 9: leftover at the bottom of column 0, pairs in columns 1..4
    for (let k = 0; k < 9; k++) {
      const col = k < 8 ? 1 + Math.floor(k / 2) : 0, row = k < 8 ? k % 2 : 1;
      const s = popS(t, T.popB + col * 0.12 + row * 0.05);
      if (s > 0) dot('p2o.b' + k, [xb + col * S, row ? RB : RT], DR * s, C.ink, Z.front);
    }
    for (let i = 1; i <= 4; i++) oval('p2o.ob' + i, xb + i * S, t, T.popB + i * 0.12 + 0.2, { pulse: T.pulse + (3 + i) * 0.13 });
    redRing('p2o.rb', [xb, RB], t, T.ringB, T.ringOff);
    // the leftovers meet: yellow = the key idea, then an oval like every other pair
    yellow('p2o.y', xb, t, T.yel);
    oval('p2o.om', xb, t, T.ovM, { pulse: T.pulse + 3 * 0.13 });
    // number labels (move with their blocks)
    const cA = xa + S, cB = xb + 2.5 * S;
    ink('p2o.l7', '7', cA, LY, 46, T.lab7, t);
    ink('p2o.l9', '9', cB, LY, 46, T.lab9, t);
    ink('p2o.lp', '+', (cA + cB) / 2 + 12, LY, 46, T.plus, t);
    ink('p2o.l16', '= 16', cB + 42, LY, 46, T.eq16, t, { start: true });
  }
  /** 3001 + 4999, with the middle dots trailing off */
  const S2 = 46, R2 = 10;
  const x0A2 = t => segX(t, [[0, 704], [T.m0, 750, 0.8]]);
  const x0B2 = t => segX(t, [[0, 1026], [T.m0, 980, 0.8]]);
  function bigPic(t) {
    const xa = x0A2(t), xb = x0B2(t);
    const trail = (key, x, t0) => {
      [-0.28, 0, 0.28].forEach((d, i) => [RT, RB].forEach((y, j) => {
        const s = popS(t, t0 + i * 0.05); if (s > 0) dot(key + i + j, [x + d * S2, y], 3.6 * s, C.ink, Z.front);
      }));
    };
    [0, 1, 3, 4].forEach((u, i) => {
      [RT, RB].forEach((y, r) => { const s = popS(t, T.popA2 + u * 0.1 + r * 0.04); if (s > 0) dot(`p2o.A${u}${r}`, [xa + u * S2, y], R2 * s, C.ink, Z.front); });
      oval('p2o.oA' + u, xa + u * S2, t, T.popA2 + u * 0.1 + 0.15, { k: 0.78 });
    });
    trail('p2o.tA', xa + 2 * S2, T.popA2 + 0.2);
    { const s = popS(t, T.popA2 + 0.55); if (s > 0) dot('p2o.Alo', [xa + 5 * S2, RT], R2 * s, C.ink, Z.front); }
    { const s = popS(t, T.popB2); if (s > 0) dot('p2o.Blo', [xb, RB], R2 * s, C.ink, Z.front); }
    [1, 2, 4, 5].forEach(u => {
      [RT, RB].forEach((y, r) => { const s = popS(t, T.popB2 + u * 0.1 + r * 0.04); if (s > 0) dot(`p2o.B${u}${r}`, [xb + u * S2, y], R2 * s, C.ink, Z.front); });
      oval('p2o.oB' + u, xb + u * S2, t, T.popB2 + u * 0.1 + 0.15, { k: 0.78 });
    });
    trail('p2o.tB', xb + 3 * S2, T.popB2 + 0.3);
    redRing('p2o.rA2', [xa + 5 * S2, RT], t, T.ringBig, T.ringBigOff);
    redRing('p2o.rB2', [xb, RB], t, T.ringBig + 0.1, T.ringBigOff);
    yellow('p2o.y2', xb, t, T.yelBig, 0.8);
    oval('p2o.oM2', xb, t, T.yelBig + 0.3, { k: 0.78 });
    const cA = xa + 2 * S2, cB = xb + 3 * S2;
    ink('p2o.L1', '3001', cA, LY, 40, T.labBig, t);
    ink('p2o.L2', '4999', cB, LY, 40, T.labBig + 0.8, t);
    ink('p2o.L3', '+', (cA + cB) / 2, LY, 40, T.labBig + 1.4, t);
    ink('p2o.L4', '= 8000', cB + wWidth('4999', 40) / 2 + 28, LY, 38, T.eqBig, t, { start: true });
  }
  COMP.p2o_pic = {
    draw(fx, t) {
      if (t < T.scat) return;
      const u = EASE.io(clamp((t - T.p5) / (T.p5e - T.p5))), sc = lerp(1, 0.6, u), cx = lerp(810, 440, u);
      DL.save(); DL.translate(cx, MID); DL.scale(sc); DL.translate(-810, -MID);
      smallPic(t);
      DL.restore();
      if (t >= T.p5) bigPic(t);
    },
  };
  const picSfx = [
    ...[0, 1, 2, 3, 4, 5, 6].map(k => [T.scat + k * 0.12, 'plip']), [T.arr0, 'swish'], ...[0, 1, 2].map(i => [T.ovA + i * 0.2, 'pen']), [T.lab7, 'pen'],
    [T.p2, 'swish'], ...[0, 1, 2, 3, 4].map(c => [T.popB + c * 0.12, 'plip']), [T.lab9, 'pen'], [T.plus, 'pen'],
    [T.p3, 'whoosh'], [T.p3e - 0.02, 'tap'], [T.ovM, 'pen'], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => [T.pulse + i * 0.13, 'plip']), [T.eq16, 'pen'],
    [T.p5, 'swish'], ...[0, 1, 3, 4, 5].map(u => [T.popA2 + u * 0.1, 'plip']), ...[0, 1, 2, 4, 5].map(u => [T.popB2 + u * 0.1, 'plip']),
    [T.labBig, 'pen'], [T.labBig + 0.8, 'pen'], [T.ringBig, 'pen'], [T.m0, 'whoosh'], [T.m1 - 0.02, 'tap'], [T.eqBig, 'pen'],
  ];

  /* ---------------- page A: versions 1 and 2 ---------------- */
  const OLD_END = 29.3, NEW_T = 28.8;
  const EX = [['3 + 5 = 8', 20.55], ['7 + 9 = 16', 21.45], ['11 + 13 = 24', 22.45]];
  const EXX = 905, EXY = [400, 490, 580], EXS = 54;
  COMP.p2o_pageA = {
    draw(fx, t) {
      if (t >= OLD_END) return;
      stroke('p2o.div', [[810, 285], [812, 740]], { z: Z.set + 0.5, w: 2.4, color: C.pencil, opacity: 0.8 * clamp((t - 14.0) / 0.3), boil: 0.4 });
      EX.forEach(([s, t0], i) => ink('p2o.ex' + i, s, EXX, EXY[i], EXS, t0, t, { start: true, z: Z.board, w: 5.5, speed: 1900 }));
    },
  };
  const exEnd = i => EXX + wWidth(EX[i][0], EXS);

  /* ---------------- 小问号's thought: the circle with 31 pieces ---------------- */
  COMP.p2o_th31 = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = clamp((t - fx.t0 - 0.25) / 0.3); if (p <= 0) return;
      const c = [128, 330], r = 40, z = Z.fx + 1;
      stroke('p2o.tc', ringPts('p2o.tc', c[0], c[1], r, r, { n: 12, closed: true }), { z, w: 3.5, closed: true, draw: p });
      const A = [49, 102, 183, 236, 291, 344].map(a => [c[0] + Math.cos(a * RAD) * r, c[1] + Math.sin(a * RAD) * r]);
      let k = 0;
      for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) stroke('p2o.tch' + k++, [A[i], A[j]], { z, w: 1.6, draw: p, bow: 0.3 });
      ink('p2o.t31', '31', 212, 306, 44, fx.t0 + 0.6, t, { z, w: 4.5, color: 'red' });
    },
  };

  /* ---------------- steps on page B ---------------- */
  const LX = 342, LYS = [500, 572, 644, 716], LSZ = 46;
  const L1 = '1. 奇数：两个两个排好，还多出一个。';
  const STEPS = [
    { text: L1, segs: [{ n: 6, t0: 33.2 }, { t0: 37.1 }] },
    { text: '2. 把两个奇数放在一起。', segs: [{ t0: 42.2 }] },
    { text: '3. 两个多出来的，正好凑成一对！', segs: [{ t0: 46.5 }] },
    { text: '所以：全部都两个两个排好，是偶数。', segs: [{ t0: 51.65 }] },
  ];
  const CHK = [41.2, 45.6, 50.7, 56.0];

  Object.assign(POSE, {
    p2o_akimbo: { lean: -2, tilt: -4, ikL: { w: 1, to: 'hip', dx: -30, dy: -6, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 30, dy: -6, bend: 'out' } },
    p2o_scratch: { tilt: 8, armScale: 1.7, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 1.0, dy: -0.95, bend: 'out' } },
    p2o_think: { tilt: -6, armScale: 1.5, ikR: { w: 1, to: 'hip', dx: 24, dy: -2, bend: 'out' }, ikL: { w: 1, to: 'head', dx: -1.02, dy: 0.42, bend: 'out' } },
    p2o_point: { armScale: 1.5, armL: [82, 6], armR: [16, 10] },
    p2o_cheer: { armScale: 1.75, armL: [140, 18], armR: [140, 18] },
  });

  const qmNod = (t0, d = 1.0) => [[t0, 'nod'], [t0 + d, 'idle']];

  defineScene({
    id: 'oddproof', chapter: '怎样写清楚', dur: 70.4, floor: FL,
    cast: {
      terry: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.5,
        pos: [[0, [TX, FL]], [57.0, t => [TX, FL - 30 * Math.sin(Math.PI * clamp((t - 57.0) / 0.3))], 0]],
        pose: [[0, 'stand'], [14.1, 'p2o_akimbo', 0.15], [19.3, 'p2o_scratch', 0.2], [20.4, 'p2o_point', 0.15], [23.6, 'stand', 0.2],
          [25.9, 'p2o_scratch', 0.2], [28.8, 'p2o_think', 0.25], [37.4, 'stand', 0.25], [57.0, 'p2o_cheer', 0.12, 'back'], [59.0, 'stand', 0.25]],
        face: [[0, 'smile'], [2.4, 'puzzled', 0.1], [5.2, 'neutral', 0.1], [9.0, 'focus', 0.1], [14.1, 'proud', 0.08], [19.3, 'surprised', 0.05], [19.8, 'puzzled', 0.1],
          [20.4, 'smile', 0.1], [23.6, 'grin', 0.08], [25.0, 'surprised', 0.06], [25.9, 'puzzled', 0.1], [28.8, 'focus', 0.1], [38.2, 'idea', 0.06],
          [40.0, 'focus', 0.1], [48.7, 'grin', 0.06], [51.5, 'smile', 0.1], [57.0, 'joy', 0.06], [60.6, 'focus', 0.1], [64.7, 'grin', 0.06], [66.2, 'joy', 0.08]],
        turn: [[0, -0.35]],
        gaze: [[0, 'viewer'], [1.2, 'sheet'], [14.1, 'viewer'], [19.3, 'qmHead'], [20.4, 'examples'], [25.0, 'qmHead'], [28.8, 'sheet'],
          [33.0, 'pic'], [41.3, 'steps'], [42.4, 'pic'], [51.6, 'steps'], [57.0, 'viewer'], [60.6, 'big'], [66.2, 'viewer']],
        squash: [[0, 1], [19.3, 1.08, 0.05], [19.36, 1, 0.2, 'back'], [56.95, 0.9, 0.05], [57.0, 1.1, 0.06], [57.3, 1, 0.25, 'back']],
      },
    },
    targets: F => ({
      sheet: [810, 420], examples: [1090, 480], pic: [810, 330], steps: [620, 600], big: [1010, 330],
      qmHead: F.anchors.qm ? F.anchors.qm.head : [QX, 620],
    }),
    fx: [
      // page A
      { type: 'prop', kind: 'p2o_sheet', id: 'p2o.shA', at: [SH.cx, SH.cy], t0: 0.1, t1: OLD_END, drawDur: 0.6, sfxAt: [[0.1, 'paper']] },
      { type: 'p2o_line', id: 'p2o.ask', text: '怎样才算“写清楚”？', x: 810, y: 450, size: 76, center: true, segs: [{ t0: 1.3 }], cps: 7, t1: 7.1, z: Z.board },
      { type: 'mark', id: 'p2o.q', char: '?', on: ['terry'], t0: 2.4, t1: 6.0 },
      { type: 'p2o_line', id: 'p2o.title', text: '奇数 + 奇数 = 偶数？', x: 810, y: 98, size: 62, center: true, segs: [{ t0: 7.3 }], cps: 9, z: Z.board },
      { type: 'p2o_line', id: 'p2o.odd', text: '奇数：1, 3, 5, 7, 9, …', x: 310, y: 212, size: 38, segs: [{ t0: 10.2 }], cps: 12, t1: OLD_END, z: Z.board },
      { type: 'p2o_line', id: 'p2o.even', text: '偶数：2, 4, 6, 8, 10, …', x: 830, y: 212, size: 38, segs: [{ t0: 11.8 }], cps: 12, t1: OLD_END, z: Z.board },
      { type: 'p2o_pageA', id: 'p2o.pageA' },
      { type: 'p2o_line', id: 'p2o.h1', text: '写法一', x: 530, y: 318, size: 46, center: true, segs: [{ n: 3, t0: 14.2 }], cps: 8, t1: OLD_END, z: Z.board },
      { type: 'p2o_line', id: 'p2o.obv', text: '显然。', x: 540, y: 505, size: 130, center: true, segs: [{ n: 3, t0: 15.4 }], cps: 3.2, t1: OLD_END, z: Z.board },
      { type: 'p2o_mark', id: 'p2o.x', kind: 'x', at: [530, 505], size: 150, t0: 19.1, t1: OLD_END, z: Z.board + 0.5 },
      { type: 'p2o_line', id: 'p2o.h2', text: '写法二', x: 1090, y: 318, size: 46, center: true, segs: [{ n: 3, t0: 20.4 }], cps: 8, t1: OLD_END, z: Z.board },
      ...EX.map((_, i) => ({ type: 'p2o_mark', id: 'p2o.ck' + i, at: [exEnd(i) + 34, EXY[i] + 26], size: 44, t0: 23.7 + i * 0.3, t1: OLD_END, z: Z.board + 0.5 })),
      // page B slides in over page A
      { type: 'prop', kind: 'p2o_sheet', id: 'p2o.shB', pos: [[0, [SH.cx, 1260]], [NEW_T, [SH.cx, SH.cy], 0.45, 'out']], rot: [[0, 3], [NEW_T, 0, 0.45, 'out']], t0: NEW_T, drawDur: 0, z: Z.board + 1, sfxAt: [[NEW_T, 'paper'], [NEW_T + 0.42, 'thud']] },
      { type: 'p2o_line', id: 'p2o.h3', text: '写法三：一步一步来', x: 310, y: 205, size: 44, segs: [{ n: 9, t0: 29.6 }], cps: 8 },
      ...STEPS.map((s, i) => ({ type: 'p2o_line', id: 'p2o.st' + i, text: s.text, x: LX, y: LYS[i], size: LSZ, segs: s.segs, cps: 8 })),
      ...CHK.map((t0, i) => ({ type: 'p2o_mark', id: 'p2o.sc' + i, at: [300, LYS[i] + 2], size: 38, t0 })),
      { type: 'p2o_pic', id: 'p2o.pic' },
      { type: 'label', id: 'p2o.lbLeft', text: '多出来的一个', at: [1130, 212], rot: 2, t0: 39.6, t1: 42.05, target: [714 + 3 * S + 10, RT - 24], bend: 0.25, gap: 8 },
      // 小问号
      { type: 'qm', id: 'qm', size: 180, signSize: 46, t0: 0.8, burst: true, pos: [[0, [QX, FL]]],
        act: [[0, 'idle'], [17.6, 'tap'], [19.9, 'idle'], [23.6, 'hop'], [24.95, 'idle'], ...qmNod(41.2), ...qmNod(45.6), ...qmNod(50.7), ...qmNod(56.0),
          [57.0, 'nod'], [59.2, 'idle'], [66.0, 'hop'], [67.4, 'idle']],
        mood: [[0, 'happy'], [2.0, 'neutral'], [17.6, 'doubt'], [20.3, 'neutral'], [23.6, 'happy'], [25.0, 'doubt'], [28.7, 'neutral'],
          [41.2, 'happy'], [42.2, 'neutral'], [45.6, 'happy'], [46.5, 'neutral'], [48.8, 'surprised'], [49.8, 'happy'], [51.6, 'neutral'], [56.0, 'happy'],
          [60.6, 'neutral'], [62.2, 'surprised'], [64.7, 'happy']],
        gaze: [[0, 'viewer'], [2.2, 'sheet'], [14.1, [530, 505]], [20.3, 'examples'], [23.5, 'viewer'], [25.0, 'examples'], [28.7, 'sheet'],
          [33.0, 'pic'], [41.0, [520, LYS[0]]], [42.3, 'pic'], [45.4, [520, LYS[1]]], [46.3, 'pic'], [50.5, [520, LYS[2]]], [51.4, [520, LYS[3]]],
          [57.0, 'viewer'], [60.6, 'big'], [66.0, 'viewer']],
        sign: [[0, null], [17.6, '为什么显然？'], [20.3, null], [25.0, '只试了三个呀'], [28.7, null], [57.4, '懂了！']],
        sfxAt: [[0.8, 'boing'], [23.65, 'hop'], [24.1, 'hop'], [24.55, 'hop'], [17.6, 'pop'], [25.0, 'pop'], [57.4, 'pop'], ...CHK.map(t => [t + 0.02, 'plip']),
          [66.05, 'hop'], [66.5, 'hop'], [66.95, 'hop']] },
      { type: 'thought', id: 'p2o.th', at: [165, 330], rx: 125, ry: 78, t0: 25.8, t1: 28.7, from: { char: 'qm', part: 'sign', dx: -30, dy: 16 } },
      { type: 'p2o_th31', id: 'p2o.th31', t0: 25.8, t1: 28.7 },
    ],
    sfx: [[0.5, 'pop'], [19.3, 'boing'], [23.7, 'ding'], [57.0, 'tada'], [64.7, 'ding'], [48.8, 'ding'], ...picSfx],
    subs: [
      { t0: 0.3, t1: 5.1, text: '那么，什么样的过程才算“写清楚”？' },
      { t0: 5.2, t1: 8.9, text: '我们用一个小问题来试试：' },
      { t0: 9.0, t1: 14.0, text: '为什么两个奇数加起来，一定是偶数？' },
      { t0: 14.1, t1: 17.5, text: '第一种写法：“显然。”' },
      { t0: 17.6, t1: 19.9, text: '“为什么显然？”', voice: 'qm' },
      { t0: 20.3, t1: 23.5, text: '第二种写法：举例子。' },
      { t0: 23.6, t1: 27.8, text: '“都对！可你只试了三个呀。”', voice: 'qm' },
      { t0: 28.7, t1: 32.4, text: '第三种写法，一步一步来。' },
      { t0: 32.5, t1: 36.9, text: '第一步，先说清楚：什么是奇数？' },
      { t0: 37.0, t1: 42.0, text: '奇数，就是两个两个排好，还多出一个。' },
      { t0: 42.1, t1: 46.3, text: '第二步，把两个奇数放在一起。' },
      { t0: 46.4, t1: 51.4, text: '第三步，两个多出来的，正好凑成一对！' },
      { t0: 51.5, t1: 56.8, text: '所以，全部都能两个两个排好——是偶数。' },
      { t0: 57.0, t1: 60.4, text: '这一次，小问号点头了。' },
      { t0: 60.6, t1: 65.6, text: '而且不管奇数有多大，这个道理都成立。' },
    ],
  });
})();
