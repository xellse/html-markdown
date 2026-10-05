// 第 35 场 · 质数排队（primes）：24 岁当上 UCLA 正教授；28 岁和数学家本·格林回答“间隔一样的质数队伍，能排到多长？”；
// 3、5、7（下一个 9 = 3×3，轻轻带过，缩进左上角小框）；5、11、17、23、29（“轮到你了”停顿：第 6 节车厢是“?”）→ 35 = 5×7，车厢脱节；
// 小问号：“为什么偏偏是 5？”→ 35 = 5 + 5×6 = 5×(1+6) = 5×7，开头的 5 又回来了（小框里开头的 3 也闪一下）；
// 3 / 5 / 7 开头的队伍都会断；可是想要多长都有：10 个一串（199 起每次 +210，真的都是质数）、100 个一串（只画珠子）；
// 找到的最长：27 个（2019 年；到 2026 年还没找到 28 个）；2006 年菲尔兹奖。
// 印章：开场盖 24 岁（UCLA）→ “二十八岁”角落换 28 → “2006 年”角落换 31 → 结尾前收掉。所有数字在页面加载时验算（算错就 console.error）。
// 开场：只有印章；结尾：全部清掉（陶哲轩走出画面，印章缩小消失）。
(() => {
  const FL = 770;
  const ST = E6.STAMP;

  /* ---------------- the maths, checked ---------------- */
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const ap = (a, d, n) => Array.from({ length: n }, (_, i) => a + i * d);
  const QA = ap(3, 2, 4), QB = ap(5, 6, 6), QC = ap(7, 30, 7), Q10 = ap(199, 210, 10);
  const BREAK = [[QA, 3, 3], [QB, 5, 7], [QC, 11, 17]];
  BREAK.forEach(([q, p, r]) => {
    const last = q[q.length - 1];
    if (!q.slice(0, -1).every(isPrime) || isPrime(last) || p * r !== last) console.error('d6_primes: the queue should break at its last car', q, p, r);
  });
  if (QA.join() !== '3,5,7,9' || QB.join() !== '5,11,17,23,29,35' || QC.join() !== '7,37,67,97,127,157,187') console.error('d6_primes: queues', QA, QB, QC);
  if (!Q10.every(isPrime) || Q10.join() !== '199,409,619,829,1039,1249,1459,1669,1879,2089') console.error('d6_primes: 199 + 210k should be ten primes', Q10);
  if (5 + 5 * 6 !== 35 || 5 * (1 + 6) !== 35 || 5 * 7 !== 35 || 3 * 3 !== 9) console.error('d6_primes: 35 = 5 + 5×6 = 5×(1+6) = 5×7');
  const S = { e1: `${QB[5]}=${QB[0]}+${QB[0]}×${QB[1] - QB[0]}`, e2: `=${QB[0]}×(1+${QB[1] - QB[0]})=5×7`, nA: '=3×3', nB: '=5×7', nC: '=11×17' };
  if (S.e1 !== '35=5+5×6' || S.e2 !== '=5×(1+6)=5×7') console.error('d6_primes: the board text', S);

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    // L1–L2: outside the UCLA building
    ST24: 0.12, DOCK24: 1.75, P24: 4.75, HALL: 1.6, SIGN: 2.05, W0: 2.0, W1: 3.4, PLATE: 6.75, PROUD: 6.95,
    IN0: 7.8, IN1: 8.4, SHUT: 8.38, GONE: 8.62, HALL_OUT: 8.65, ST24_OUT: 8.6, ST28: 8.85,
    // L3–L5: the blackboard
    BOARD: 8.95, T2W0: 9.05, T2W1: 9.85, BW0: 10.35, BW1: 11.15, WAVE: 11.45, WAVE1: 12.55, NAME: 11.45,
    LOOK: 12.9, POINT: 13.0, QBIG: 13.1, OLD: 14.35, Q_OUT: 16.85, QL1: 17.0, QL2: 18.55, THINK: 17.7,
    LEAVE0: 21.1, LEAVE1: 21.8, BOARD_OUT: 21.15, FLOOR_OUT: 21.6,
    // L6: 3, 5, 7 → 9
    A: [21.9, 22.35, 22.8, 24.3], A_ARC: [23.4, 23.8, 24.2], A_BAD: 24.65, DOCK0: 25.55, DOCK1: 26.0, FRAME: 25.95,
    // L7: 5, 11, 17, 23, 29
    B: [26.25, 26.75, 27.45, 28.2, 29.1], B_ARC: [30.15, 30.4, 30.65, 30.9],
    // L8 + the pause
    TURN: 32.0, B5: 33.2, B5Q: 33.5, PAUSE: 36.9,
    // L9: 35 = 5×7
    TURN_OUT: 37.3, Q35_OUT: 37.55, N35: 38.1, EQ57: 40.0, BAD35: 41.05, NOTPRIME: 41.3,
    // L10–L11: why 5?
    QM: 42.75, SIGNQ: 43.05, NOTE_OUT: 45.75, SIGN_OFF: 45.95, E1: 46.1, E2: 47.55, LINK: 49.0, BACK5: 49.25, NOD: 49.5,
    FLASH: 50.25, BACK3: 50.4, MATH_OUT: 51.55,
    // L12: every queue breaks
    RC: [52.0, 52.4, 52.8], SAME: 52.6, BRK: [54.2, 54.65, 55.1], ROWS_OUT: 56.5,
    // L13–L14: as long as you like
    PROVED: 56.6, LONG: 58.75, UP: 61.5, R10: 61.8, BEADS: 63.0, HI: 64.5, LONG_OUT: 66.55,
    // L15: the longest found: 27
    LENS: 66.95, CNT: 68.35, CNT_TXT: 68.6, N27: 70.95, GE: 71.55, NOTE27: 71.8, CNT_OUT: 73.35,
    // L16–L17: the Fields medal
    FLOOR2: 73.5, ST28_OUT: 73.75, ST31: 74.0, T3W0: 73.6, T3W1: 75.2, UPLOOK: 75.95, DROP: 76.05, LAND: 76.9, FIELDS: 77.05,
    HOLD: 78.3, SHINE: [78.55, 80.35], LAB_OUT: 81.0, EXIT0: 81.05, EXIT1: 82.2, ST31_OUT: 81.9, FLOOR_OUT2: 81.95, DUR: 82.4,
  };

  /* ---------------- helpers ---------------- */
  /** fade every item drawn since n0 by a (0..1) */
  const fadeFrom = (n0, a) => { if (a >= 1) return; for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * a).toFixed(3); } };
  /** a hand-written line (laid out now, so its glyph boxes can be ringed and linked) */
  const W = (id, text, x, y, size, t0, o = {}) => {
    const fx = { type: 'write', id, text, x, y, size, t0, speed: 2600, w: 5.5, gap: 0.02, glyphGap: 0.02, ...o };
    if (fx.color === 'red') { fx.z = fx.z ?? Z.annot; fx.sfx = fx.sfx || 'pen'; fx.speed = o.speed || 3000; }
    layoutWriting(fx); fx._d6 = 1; return fx;
  };
  const drawLayout = (k, L, t, o = {}) => L.strokes.forEach((s, j) => {
    const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke(k + '.' + j, s.pts, { z: o.z ?? Z.board, w: o.w || 5.5, color: o.color === 'red' ? C.red : C.ink, draw: q, boil: 0.55 });
  });
  const boxOf = (L, i) => { const b = L.boxes[i]; return [b.x, b.y, b.w, b.h]; };

  /** a group of components; from `out` on, the group fades (and optionally shrinks toward `about`) over `dur` */
  COMP.d6_fade = {
    init(fx) {
      fx.inner = [].concat(fx.inner);
      fx.inner.forEach(f => { const c = COMP[f.type]; if (c.init && !f._d6) { c.init(f); f._d6 = 1; } });
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
      fadeFrom(n0, 1 - u);
    },
    cues: fx => fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])).concat(fx.out !== undefined && fx.whoosh ? [[fx.out, 'whoosh']] : []),
  };
  /** free drawing: fn(t, lt, key, F) from t0 on */
  COMP.d6_fn = {
    draw(fx, t, F) { if (t < fx.t0) return; fx.fn(t, t - fx.t0, fx.id, F); },
    cues: fx => fx.cues || [],
  };
  /** the floor line, drawn on (so it can live inside a fading group) */
  PROPS.d6_floor = (fx, t, lt, p) => stroke(fx.id, [[20, FL], [800, FL + 2], [1580, FL - 1]], { z: Z.set, w: 2.2, color: C.pencil, draw: p, opacity: 0.8 });

  /* ---------------- L1–L2: the university building ---------------- */
  const HALL = { x0: 560, x1: 1340, top: 200, peak: 92, cx: 950, band: [722, 222, 1178, 284], DX: 100, DY: 440, AR: 100, plate: [735, 548] };
  const SIGN_TXT = '加州大学洛杉矶分校';
  const archPts = (cx, half, yTop, r, n = 8) => { const a = []; for (let i = 0; i <= n; i++) { const g = Math.PI + (i / n) * Math.PI; a.push([cx + Math.cos(g) * half, yTop + Math.sin(g) * r]); } return a; };
  PROPS.d6_hall = (fx, t, lt, p) => {
    const k = fx.id, z = Z.set, H = HALL, n = 5;
    stroke(k + '.wall', [[H.x0, FL], [H.x0, H.top, 1], [H.x1, H.top, 1], [H.x1, FL]], { z, w: 6, draw: stag(p, 0, n) });
    stroke(k + '.roof', [[H.x0 - 36, H.top + 2], [H.cx, H.peak, 1], [H.x1 + 36, H.top + 2, 1], [H.x0 - 36, H.top + 2, 1]], { z: z + 0.1, w: 6, fill: C.paper, draw: stag(p, 1, n) });
    stroke(k + '.roof2', [[H.x0 + 40, H.top - 14], [H.cx, H.peak + 30], [H.x1 - 40, H.top - 14]], { z: z + 0.2, w: 2.6, color: C.pencil, opacity: 0.7, draw: stag(p, 2, n), boil: 0.5 });
    const [b0, b1, b2, b3] = H.band;
    stroke(k + '.band', [[b0, b1], [b2, b1, 1], [b2, b3, 1], [b0, b3, 1], [b0, b1, 1]], { z, w: 4, fill: C.paper, draw: stag(p, 2, n) });
    stroke(k + '.door', [[H.cx - H.DX, FL], ...archPts(H.cx, H.DX, H.DY, H.AR), [H.cx + H.DX, FL]], { z, w: 6, draw: stag(p, 3, n) });
    stroke(k + '.step', [[H.cx - H.DX - 30, FL - 12], [H.cx + H.DX + 30, FL - 12]], { z, w: 3.5, draw: stag(p, 3, n) });
    [655, 765, 1135, 1245].forEach((wx, i) => {
      stroke(k + '.win' + i, [[wx - 36, 420], ...archPts(wx, 36, 356, 36, 6), [wx + 36, 420, 1], [wx - 36, 420, 1]], { z, w: 4, draw: stag(p, 4, n) });
      stroke(k + '.wm' + i, [[wx, 324], [wx, 418]], { z, w: 2.4, color: C.pencil, opacity: 0.7, draw: stag(p, 4, n), boil: 0.4 });
    });
    // the name over the door, written out
    const ts = t - T.SIGN;
    if (ts >= 0) { const ch = [...SIGN_TXT], m = Math.min(ch.length, Math.floor(ts * 10) + 1); text(k + '.sign', ch.slice(0, m).join(''), (b0 + b2) / 2 - textWidth(SIGN_TXT, 44) / 2, (b1 + b3) / 2, { size: 44, anchor: 'start', z: z + 0.5 }); }
    // the office plate: 正教授
    const tp = t - T.PLATE;
    if (tp >= 0) {
      const s = Math.max(0.01, EASE.back(clamp(tp / 0.28))), [px, py] = H.plate;
      DL.save(); DL.about(px, py, () => DL.scale(s));
      stroke(k + '.plate', [[px - 84, py - 34], [px + 84, py - 34, 1], [px + 84, py + 34, 1], [px - 84, py + 34, 1], [px - 84, py - 34, 1]], { z: z + 0.5, w: 4.5, fill: C.paper });
      text(k + '.pt', '正教授', px, py + 1, { size: 44, z: z + 0.6 });
      DL.restore();
    }
    // the double door swings shut behind him
    const u = EASE.out(clamp((t - T.SHUT) / 0.22));
    if (u > 0) {
      const leaf = s => { const a = archPts(H.cx, H.DX, H.DY, H.AR, 8).filter(q => s * (q[0] - H.cx) >= -0.5); return [[H.cx + s * H.DX, FL], ...(s < 0 ? a : a.reverse()), [H.cx, FL, 1]]; };
      [-1, 1].forEach((s, i) => {
        const hinge = H.cx + s * H.DX, pts = leaf(s).map(q => [hinge + (q[0] - hinge) * u, q[1], q[2]]);
        stroke(k + '.leaf' + i, pts.concat([[pts[0][0], pts[0][1], 1]]), { z: Z.front + 6, w: 5, fill: C.paper });
        if (u > 0.9) dot(k + '.knob' + i, [H.cx + s * 22, 600], 6, C.ink, Z.front + 6.2);
      });
    }
  };

  /* ---------------- L3–L5: the blackboard ---------------- */
  const BRD = { x: 380, y: 100, w: 840, h: 370 };
  PROPS.d6_board = (fx, t, lt, p) => SETDRAW.board(BRD, p);

  /* ---------------- the train: a queue of numbers, one per car ----------------
   * {id, cx: [car centres], y, w, h, size, z, speed, cars: [{n, t0, ck?, q?: [tIn, tOut], bad?: {t, note, nx, ny, size, anchor, out}}],
   *  arcs: [{i (to car i from car i-1), t0, txt}], brk: [dx, dy, deg], xf (track [[t, [tx, ty, s]]]), box ([x0, y0, x1, y1] base coords),
   *  frame (t: draw a frame round box), flash (t: rings on car 0 and the bad car's note), ckOut, arcOut } */
  COMP.d6_train = {
    init(fx) {
      const { w, h, size, y } = fx;
      fx.cars.forEach((c, i) => {
        const cx = fx.cx[i];
        c.L = layoutWriting({ text: String(c.n), x: cx, y: y - size / 2, size, t0: c.nT ?? c.t0 + 0.1, speed: fx.speed || 2600, anchor: 'middle', gap: 0.02, glyphGap: 0.02 });
        if (c.q) c.Q = layoutWriting({ text: '?', x: cx, y: y - size / 2, size, t0: c.q[0], speed: 2000, anchor: 'middle' });
        if (c.ck !== undefined) c.CK = layoutWriting({ text: '✓', x: cx, y: y + h / 2 + 24, size: 40, t0: c.ck, speed: 2800, anchor: 'middle' });
        const b = c.bad;
        if (b && b.note) b.N = layoutWriting({ text: b.note, x: b.nx ?? cx, y: b.ny ?? y + h / 2 + 32, size: b.size || 48, t0: b.noteT ?? b.t + 0.25, speed: 3000, anchor: b.anchor || 'middle', gap: 0.02, glyphGap: 0.02 });
      });
      (fx.arcs || []).forEach(a => {
        const x0 = fx.cx[a.i - 1] + fx.w * 0.18, x1 = fx.cx[a.i] - fx.w * 0.18, yA = y - h / 2 - 6, len = x1 - x0, lift = 0.32 * len / 2;
        a.from = [x0, yA]; a.to = [x1, yA];
        if (a.txt) a.L = layoutWriting({ text: a.txt, x: (x0 + x1) / 2, y: yA - lift - 10 - (a.size || 44), size: a.size || 44, t0: a.t0 + 0.2, speed: 3000, anchor: 'middle', gap: 0.02, glyphGap: 0.02 });
      });
      return fx;
    },
    draw(fx, t) {
      if (t < Math.min(fx.cars[0].t0, fx.rail ?? 99)) return;
      const k = fx.id, { w, h, y } = fx, z = fx.z ?? Z.board, brk = fx.brk || [16, 8, 9];
      DL.save();
      if (fx.xf) { const [tx, ty, s] = evalTrack(fx.xf, t); DL.translate(tx, ty); DL.scale(s); }
      if (fx.flash !== undefined && fx.box) {
        const v = (t - fx.flash) / 0.5; if (v > 0 && v < 1) { const bx = (fx.box[0] + fx.box[2]) / 2, by = (fx.box[1] + fx.box[3]) / 2; DL.about(bx, by, () => DL.scale(1 + 0.12 * Math.sin(Math.PI * v))); }
      }
      if (fx.rail !== undefined && t >= fx.rail) {   // a pencil rail the cars stand on (drawn first)
        const ry = y + h / 2 + 2 + h * 0.13 + 3, rx0 = fx.cx[0] - w / 2 - 34, rx1 = fx.cx[fx.cx.length - 1] + w / 2 + 34;
        stroke(k + '.rail', [[rx0, ry], [(rx0 + rx1) / 2, ry + 2], [rx1, ry - 1]], { z: z - 0.4, w: 3.5, color: C.pencil, draw: EASE.out(clamp((t - fx.rail) / 0.4)), boil: 0.5 });
      }
      if (fx.frame !== undefined && t >= fx.frame) {
        const [x0, y0, x1, y1] = fx.box;
        stroke(k + '.frame', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z: z - 0.3, w: 6, fill: C.paper, draw: EASE.out(clamp((t - fx.frame) / 0.35)) });
      }
      fx.cars.forEach((c, i) => {
        const lt = t - c.t0; if (lt < 0) return;
        const cx = fx.cx[i], pop = Math.max(0.01, EASE.back(clamp(lt / 0.25)));
        const bu = c.bad && t >= c.bad.t ? EASE.back(clamp((t - c.bad.t) / 0.3)) : 0;
        // the coupling to the car in front (it snaps when this car breaks off)
        if (i > 0 && lt >= 0.08) {
          const x0 = fx.cx[i - 1] + w / 2, x1 = cx - w / 2, yc = y + h * 0.22, g = (x1 - x0) * 0.32;
          if (bu <= 0) stroke(k + '.cp' + i, [[x0 - 3, yc], [x1 + 3, yc]], { z: z - 0.1, w: 4 });
          else {
            stroke(k + '.cp' + i, [[x0 - 3, yc], [x0 + g, yc + 5 * bu]], { z: z - 0.1, w: 4 });
            stroke(k + '.cq' + i, [[x1 + 3 + brk[0] * bu, yc + brk[1] * bu], [x1 - g + brk[0] * bu, yc + brk[1] * bu + 7 * bu]], { z: z - 0.1, w: 4 });
          }
        }
        DL.save();
        if (bu > 0) { DL.translate(brk[0] * bu, brk[1] * bu); DL.about(cx, y + h / 2, () => DL.rotate(brk[2] * bu)); }
        DL.about(cx, y + h / 2, () => DL.scale(pop));
        stroke(k + '.c' + i, superPts(cx, y, w, h, 24, 8), { z, w: 5, closed: true, fill: C.paper });
        [-1, 1].forEach((s, j) => stroke(k + '.w' + i + j, ringPts(k + '.w' + i + j, cx + s * w * 0.27, y + h / 2 + 2, h * 0.13, h * 0.13, { n: 9, closed: true }), { z: z + 0.2, w: 4, closed: true, fill: C.paper }));
        if (!c.blank) drawLayout(k + '.n' + i, c.L, t, { z: z + 0.3, w: fx.nw || 5.5 });
        if (c.Q) {
          const qa = 1 - clamp((t - c.q[1]) / 0.2);
          if (qa > 0) { const n0 = DL.items.length; drawLayout(k + '.q' + i, c.Q, t, { z: z + 0.3, color: 'red' }); fadeFrom(n0, qa); }
        }
        if (c.bad) {
          const xu = EASE.out(clamp((t - c.bad.t - 0.12) / 0.16)), xv = EASE.out(clamp((t - c.bad.t - 0.24) / 0.16));
          const xc = [cx + w / 2 - 4, y - h / 2 + 2], r = fx.xr || 20;
          if (xu > 0) stroke(k + '.x' + i + 'a', [[xc[0] - r, xc[1] - r], [xc[0] + r, xc[1] + r]], { z: Z.annot, w: 6, color: C.red, draw: xu });
          if (xv > 0) stroke(k + '.x' + i + 'b', [[xc[0] + r, xc[1] - r], [xc[0] - r, xc[1] + r]], { z: Z.annot, w: 6, color: C.red, draw: xv });
        }
        DL.restore();
        if (c.CK) { const a = fx.ckOut === undefined ? 1 : 1 - clamp((t - fx.ckOut) / 0.25); if (a > 0) { const n0 = DL.items.length; drawLayout(k + '.ck' + i, c.CK, t, { z: Z.annot, color: 'red', w: 5 }); fadeFrom(n0, a); } }
        if (c.bad && c.bad.N) { const a = c.bad.out === undefined ? 1 : 1 - clamp((t - c.bad.out) / 0.25); if (a > 0) { const n0 = DL.items.length; drawLayout(k + '.nt' + i, c.bad.N, t, { z: Z.annot, color: 'red', w: 5 }); fadeFrom(n0, a); } }
      });
      (fx.arcs || []).forEach((a, j) => {
        const p = EASE.out(clamp((t - a.t0) / 0.3)); if (p <= 0) return;
        const al = fx.arcOut === undefined ? 1 : 1 - clamp((t - fx.arcOut) / 0.25); if (al <= 0) return;
        const n0 = DL.items.length;
        arrow(k + '.a' + j, a.from, a.to, { p, bend: -0.32, color: C.red, w: 4, head: 14, z: Z.annot });
        if (a.L) drawLayout(k + '.al' + j, a.L, t, { z: Z.annot, color: 'red', w: 5 });
        fadeFrom(n0, al);
      });
      // the corner flash: the first number and the first factor of the bad car light up together
      if (fx.flash !== undefined && t >= fx.flash) {
        const bad = fx.cars.find(c => c.bad), rings = [boxOf(fx.cars[0].L, 0), bad && bad.bad.N ? boxOf(bad.bad.N, 1) : null].filter(Boolean);
        rings.forEach((b, j) => {
          const p = EASE.out(clamp((t - fx.flash - j * 0.15) / 0.3)); if (p <= 0) return;
          stroke(k + '.fl' + j, ringPts(k + '.fl' + j, b[0] + b[2] / 2, b[1] + b[3] * 0.52, b[2] / 2 + 22, b[3] / 2 + 18, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 8, color: C.red, draw: p });
        });
      }
      DL.restore();
    },
    cues: fx => {
      const c = [];
      fx.cars.forEach(car => {
        c.push([car.t0, 'pop']);
        if (car.ck !== undefined) c.push([car.ck, 'pen']);
        if (car.q) c.push([car.q[0], 'pen']);
        if (car.bad) c.push([car.bad.t, 'boing'], [car.bad.t + 0.12, 'pen']);
        if (car.bad && car.bad.N) c.push([car.bad.N.t0, 'pen']);
      });
      (fx.arcs || []).forEach(a => c.push([a.t0, 'pen']));
      if (fx.flash !== undefined) c.push([fx.flash, 'ding']);
      return c;
    },
  };

  // L6: 3, 5, 7 → 9 (= 3×3); then it shrinks into the top-left corner box
  const A_CX = [455, 685, 915, 1145], A_Y = 420, A_BOX = [350, 255, 1282, 580], A_S = 0.5, A_AT = [40, 74];
  const rowA = {
    type: 'd6_train', id: 'd6rA', rail: T.A[0] - 0.2, cx: A_CX, y: A_Y, w: 170, h: 120, size: 70,
    cars: QA.map((n, i) => ({ n, t0: T.A[i], ...(i === 3 ? { bad: { t: T.A_BAD, note: S.nA, size: 48 } } : {}) })),
    arcs: [1, 2, 3].map(i => ({ i, t0: T.A_ARC[i - 1], txt: '+2' })),
    xf: [[0, [0, 0, 1]], [T.DOCK0, [A_AT[0] - A_BOX[0] * A_S, A_AT[1] - A_BOX[1] * A_S, A_S], T.DOCK1 - T.DOCK0, 'io']],
    box: A_BOX, frame: T.FRAME, flash: T.FLASH,
  };
  // L7–L9: 5, 11, 17, 23, 29, ? → 35 (= 5×7)
  const B_CX = [225, 455, 685, 915, 1145, 1375], B_Y = 420;
  const rowB = {
    type: 'd6_train', id: 'd6rB', rail: T.B[0] - 0.2, cx: B_CX, y: B_Y, w: 170, h: 120, size: 66, ckOut: T.QM - 0.2,
    cars: QB.map((n, i) => (i < 5
      ? { n, t0: T.B[i], ck: T.B[i] + 0.4 }
      : { n, t0: T.B5, nT: T.N35, q: [T.B5Q, T.Q35_OUT], bad: { t: T.BAD35, note: S.nB, noteT: T.EQ57, nx: B_CX[5] + 16, size: 52, out: T.NOTE_OUT } })),
    arcs: [1, 2, 3, 4].map(i => ({ i, t0: T.B_ARC[i - 1], txt: '+6' })).concat([{ i: 5, t0: T.B5 - 0.3, txt: '+6' }]),
  };
  COMP.d6_train.init(rowB); rowB._d6 = 1;   // laid out now: the link in L11 needs the first car's glyph box
  if (T.N35 <= T.Q35_OUT + 0.2) console.error('d6_primes: the ? should be gone before 35 is written');

  // L11: 35 = 5 + 5×6 = 5×(1+6) = 5×7 under the row; the first 5 links back to the first car
  const E1 = W('d6eq.e1', S.e1, 600, 590, 60, T.E1);
  const E2 = W('d6eq.e2', S.e2, E1.boxes[2].x, 676, 60, T.E2, { speed: 3000 });
  const FIVE = boxOf(E1, 3);
  const CAR5 = boxOf(rowB.cars[0].L, 0);
  const ringAt = (k, b, p) => stroke(k, ringPts(k, b[0] + b[2] / 2, b[1] + b[3] * 0.52, b[2] / 2 + 18, b[3] / 2 + 14, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: p });
  const link = {
    type: 'd6_fn', id: 'd6lk', t0: T.LINK, cues: [[T.LINK, 'pen'], [T.LINK + 0.15, 'pen'], [T.LINK + 0.3, 'pen']],
    fn: (t, lt, k) => {
      ringAt(k + '.r0', CAR5, EASE.out(clamp(lt / 0.3)));
      ringAt(k + '.r1', FIVE, EASE.out(clamp((lt - 0.15) / 0.3)));
      const from = [CAR5[0] + CAR5[2] / 2 + 6, CAR5[1] + CAR5[3] + 22], to = [FIVE[0] + FIVE[2] / 2 - 4, FIVE[1] - 20];
      arrow(k + '.a', from, to, { p: EASE.out(clamp((lt - 0.3) / 0.4)), bend: 0.22, color: C.red, w: 5, head: 18 });
    },
  };

  /* ---------------- L12: three queues, each breaks at its last car ---------------- */
  const RC_X0 = 190, RC_DX = 146, RC_Y = [210, 380, 550], RC_W = 112, RC_H = 80;
  const rowsC = BREAK.map(([q, p, r], j) => {
    const cx = q.map((_, i) => RC_X0 + i * RC_DX), last = cx[cx.length - 1];
    return {
      type: 'd6_train', id: 'd6rc' + j, rail: T.RC[0] - 0.12 + j * 0.08, cx, y: RC_Y[j], w: RC_W, h: RC_H, size: 46, speed: 4200, brk: [12, 6, 9], xr: 15,
      cars: q.map((n, i) => ({ n, t0: T.RC[j] + i * 0.07, ...(i === q.length - 1 ? { bad: { t: T.BRK[j], note: `=${p}×${r}`, nx: last + RC_W / 2 + 40, ny: RC_Y[j] - 23, size: 46, anchor: 'start' } } : {}) })),
    };
  });

  /* ---------------- L13–L14: as long as you like ---------------- */
  const R10_CX = Q10.map((_, i) => 161 + i * 142), R10_Y = 340;
  const row10 = {
    type: 'd6_train', id: 'd6r10', rail: T.R10 - 0.1, cx: R10_CX, y: R10_Y, w: 126, h: 74, size: 38, speed: 5200, nw: 4.6,
    cars: Q10.map((n, i) => ({ n, t0: T.R10 + i * 0.09 })), arcs: [{ i: 1, t0: T.R10 + 0.3, txt: '+210', size: 38 }],
  };
  const LONG_TXT = '想要多长都有！', LONG_S = [110, 88], LONG_Y = [420, 150];
  const longTitle = {
    type: 'd6_fn', id: 'd6lt', t0: T.LONG, cues: [[T.LONG, 'stamp'], [T.HI, 'swish']],
    fn: (t, lt, k) => {
      const u = EASE.io(clamp((t - T.UP) / 0.4)), size = lerp(LONG_S[0], LONG_S[1], u), y = lerp(LONG_Y[0], LONG_Y[1], u), pp = EASE.back(clamp(lt / 0.3));
      text(k + '.t', LONG_TXT, 800, y, { size, z: Z.annot, scale: lerp(0.5, 1, pp), opacity: clamp(lt / 0.1) });
      const hp = EASE.out(clamp((t - T.HI) / 0.45)); if (hp <= 0) return;
      const tw = textWidth(LONG_TXT, size), x0 = 800 - tw / 2 - 12, xe = lerp(x0, 800 + tw / 2 + 12, hp), y0 = y - size * 0.42, y1 = y + size * 0.48, top = [], bot = [];
      for (let i = 0; i <= 8; i++) { const x = lerp(x0, xe, i / 8); top.push([x, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([x, y1 + Math.sin(i * 2.3) * 4]); }
      stroke(k + '.hi', top.concat(bot), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    },
  };
  // 100 in a row: beads running off into the distance (nobody has found 100, so no numbers)
  const BEAD = (() => {
    const S0 = [150, 612], VP = [1540, 468], d = Math.hypot(VP[0] - S0[0], VP[1] - S0[1]), ux = (VP[0] - S0[0]) / d, uy = (VP[1] - S0[1]) / d, out = [];
    let r = 24, s = 0;
    while (r > 2.2) { const wob = Math.sin(out.length * 0.7) * r * 0.5; out.push({ c: [S0[0] + ux * s - uy * wob, S0[1] + uy * s + ux * wob], r }); const r2 = r * 0.955; s += 1.3 * (r + r2); r = r2; }
    return out;
  })();
  const beads = {
    type: 'd6_fn', id: 'd6bd', t0: T.BEADS, cues: [0, 8, 16, 24, 32].map(i => [T.BEADS + i * 0.022, 'tap']),
    fn: (t, lt, k) => {
      const shown = BEAD.filter((_, i) => lt >= i * 0.022);
      if (shown.length > 1) stroke(k + '.str', shown.map(b => b.c), { z: Z.board - 0.2, w: 2.4, color: C.pencil, opacity: 0.8, boil: 0.4 });
      shown.forEach((b, i) => {
        const pp = Math.max(0.01, EASE.back(clamp((lt - i * 0.022) / 0.2)));
        stroke(k + '.b' + i, ringPts(k + '.b' + i, b.c[0], b.c[1], b.r * pp, b.r * pp, { n: b.r > 8 ? 10 : 7, closed: true, rv: 0.05 }), { z: Z.board, w: Math.max(1.6, 4.5 * Math.sqrt(b.r / 24)), closed: true, fill: C.paper, boil: 0.4 });
      });
      if (shown.length === BEAD.length) {
        const e = BEAD[BEAD.length - 1].c;
        [0, 1, 2].forEach(j => { if (lt > BEAD.length * 0.022 + j * 0.08) dot(k + '.d' + j, [e[0] + 14 + j * 11, e[1] - 1 - j * 1.2], 2.4, C.pencil, Z.board); });
      }
    },
  };

  /* ---------------- L15: the longest anyone has found ---------------- */
  const CNT = { cx: 860, cy: 400, w: 640, h: 300 };
  const N27 = W('d6cnt.n', '27', 822, 368, 150, T.N27, { anchor: 'middle', speed: 3200, w: 8 });
  const counter = {
    type: 'd6_fn', id: 'd6cb', t0: T.CNT, cues: [[T.CNT, 'pen'], [T.CNT_TXT, 'pen'], [T.CNT_TXT + 0.45, 'pen'], [T.GE, 'pop']],
    fn: (t, lt, k) => {
      const { cx, cy, w, h } = CNT, x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, p = EASE.out(clamp(lt / 0.45));
      stroke(k + '.o', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z: Z.set, w: 6, fill: C.paper, draw: p });
      stroke(k + '.i', [[x0 + 14, y0 + 14], [x1 - 14, y0 + 14, 1], [x1 - 14, y1 - 14, 1], [x0 + 14, y1 - 14, 1], [x0 + 14, y0 + 14, 1]], { z: Z.set + 0.1, w: 3, draw: EASE.out(clamp((lt - 0.15) / 0.4)) });
      stroke(k + '.rule', [[x0 + 60, y0 + 100], [x1 - 60, y0 + 100]], { z: Z.set + 0.1, w: 2.4, color: C.pencil, opacity: 0.7, draw: EASE.out(clamp((lt - 0.3) / 0.3)), boil: 0.4 });
      const tt = t - T.CNT_TXT;
      if (tt >= 0) { const ch = [...'人们找到的最长'], m = Math.min(ch.length, Math.floor(tt * 8) + 1); text(k + '.t', ch.slice(0, m).join(''), cx - textWidth('人们找到的最长', 56) / 2, y0 + 58, { size: 56, anchor: 'start', z: Z.board }); }
      const tg = t - T.GE;
      if (tg >= 0) text(k + '.ge', '个', N27.x + N27.width + 62, 452, { size: 90, z: Z.board, scale: lerp(1.6, 1, EASE.back(clamp(tg / 0.22))), opacity: clamp(tg / 0.08) });
    },
  };
  const lens = {
    type: 'd6_fn', id: 'd6lens', t0: T.LENS, cues: [[T.LENS, 'pop']],
    fn: (t, lt, k) => {
      const s = Math.max(0.01, EASE.back(clamp(lt / 0.3))), sw = clamp((lt - 0.2) / 1.8), a = sw > 0 && sw < 1 ? Math.sin(sw * Math.PI * 3) : 0;
      const c = [318 + 26 * a, 410 + 12 * Math.sin(sw * Math.PI * 6)];
      DL.save(); DL.about(c[0], c[1], () => { DL.scale(s); DL.rotate(-8 + 6 * a); });
      stroke(k + '.f', ringPts(k + '.f', c[0], c[1], 70, 70, { n: 14, closed: true, rv: 0.02 }), { z: Z.board - 0.1, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke(k + '.r', ringPts(k + '.r', c[0], c[1], 70, 70, { n: 14, a0: -100, sweep: 372, rv: 0.02 }), { z: Z.board, w: 7 });
      stroke(k + '.g', [[c[0] - 34, c[1] - 30], [c[0] - 14, c[1] - 46]], { z: Z.board, w: 3, color: C.pencil, opacity: 0.8 });
      stroke(k + '.h', [[c[0] + 50, c[1] + 50], [c[0] + 118, c[1] + 118]], { z: Z.board, w: 16 });
      DL.restore();
    },
  };

  /* ---------------- L16–L17: the Fields medal is lowered onto him ---------------- */
  const T3X = 900;
  const medalIn = { id: 'd6md', char: 'tao3', label: 'F', r: 54, t0: -1, shine: T.SHINE };
  const medal = {
    type: 'd6_fn', id: 'd6mdrop', t0: T.DROP, cues: [[T.DROP, 'whoosh'], [T.LAND, 'ding'], ...T.SHINE.map(s => [s, 'plip'])],
    fn: (t, lt, k, F) => {
      const off = (1 - EASE.out(clamp((t - T.DROP) / (T.LAND - T.DROP)))) * 640;
      DL.save(); DL.translate(0, -off); if (off > 44) DL.zoff = -10;   // behind his head until the disc is below his chin
      COMP.e6_medal.draw(medalIn, t, F); DL.zoff = 0; DL.restore();
    },
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    d6_waveL: { armL: [118, 52], armR: [16, 10] },
    d6_chinL: { tilt: 6, armScale: 1.5, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 1.02, dy: 0.42, bend: 'out' } },
    d6_hold: { armL: [14, 10], ikR: { w: 1, to: 'abs', dx: T3X + 36, dy: 652, bend: 'out' } },
  });
  const waveR = t0 => t => ({ ...POSE.wave, armR: [118, 22 + 25 * Math.sin((t - t0) * 11)] });
  const waveL = t0 => t => ({ ...POSE.d6_waveL, armL: [118, 22 + 25 * Math.sin((t - t0) * 11 + 1)] });
  const walkT1 = makeWalk(T.W0, T.W1, 5.2), walkT1b = makeWalk(T.IN0, T.IN1, 5.6);
  const walkT2 = makeWalk(T.T2W0, T.T2W1, 5.2), walkT2b = makeWalk(T.LEAVE0, T.LEAVE1, 5.6);
  const walkB = makeWalk(T.BW0, T.BW1, 5.2), walkBb = makeWalk(T.LEAVE0, T.LEAVE1, 5.6);
  const walkT3 = makeWalk(T.T3W0, T.T3W1, 5.2), walkT3b = makeWalk(T.EXIT0, T.EXIT1, 5.6);

  defineScene({
    id: 'primes', chapter: '质数排队', dur: T.DUR, floor: FL,
    cast: { tao: E6.taoAdult, tao2: E6.taoAdult, ben: E6.ben, tao3: E6.taoAdult },
    order: ['tao', 'tao2', 'ben', 'tao3'],
    tracks: {
      // L1–L2: walks up to the building, sees the plate, walks in; the doors close behind him
      tao: {
        enter: T.W0 - 0.05,
        pos: [[0, [-90, FL]], [T.W0, [545, FL], T.W1 - T.W0, 'lin'], [T.IN0, [HALL.cx, FL], T.IN1 - T.IN0, 'lin'], [T.GONE, [3000, FL], 0]],
        pose: [[0, walkT1], [T.PROUD, 'stand', 0.12, 'back'], [T.IN0 - 0.05, walkT1b, 0.08]],
        face: [[0, 'smile'], [T.PROUD, 'joy', 0.1]],
        turn: [[0, 0.5], [T.W1, 0.2, 0.15], [T.PLATE + 0.1, 0.35, 0.1], [T.IN0 - 0.05, 0.5, 0.08]],
        gaze: [[0, 'viewer'], [T.SIGN + 0.2, 'sign'], [T.W1 + 0.3, 'viewer'], [T.PLATE + 0.1, 'plate'], [T.IN0, [HALL.cx, 520]]],
      },
      // L3–L5: in front of the blackboard (left)
      tao2: {
        enter: T.T2W0 - 0.05,
        pos: [[0, [-90, FL]], [T.T2W0, [235, FL], T.T2W1 - T.T2W0, 'lin'], [T.LEAVE0, [-140, FL], T.LEAVE1 - T.LEAVE0, 'lin']],
        pose: [[0, walkT2], [T.WAVE, waveR(T.WAVE), 0.1, 'back'], [T.WAVE1, 'stand', 0.15], [T.POINT, 'point', 0.12, 'back'], [T.THINK, 'thinkStand', 0.14, 'back'], [T.LEAVE0, walkT2b, 0.08]],
        face: [[0, 'smile'], [T.WAVE, 'joy', 0.08], [T.LOOK, 'focus', 0.1], [T.THINK, 'idea', 0.1], [T.LEAVE0, 'smile', 0.1]],
        turn: [[0, 0.5], [T.T2W1, 0.3, 0.12], [T.LEAVE0, -0.55, 0.1]],
        gaze: [[0, 'viewer'], [T.BW0 + 0.2, 'ben'], [T.LOOK, 'board'], [T.LEAVE0, [-200, 500]]],
      },
      // the mathematician Ben Green (not drawn as the real person: glasses and messy hair, like any 数学家)
      ben: {
        enter: T.BW0 - 0.05,
        pos: [[0, [1720, FL]], [T.BW0, [1365, FL], T.BW1 - T.BW0, 'lin'], [T.LEAVE0, [1740, FL], T.LEAVE1 - T.LEAVE0, 'lin']],
        pose: [[0, walkB], [T.WAVE + 0.08, waveL(T.WAVE), 0.1, 'back'], [T.WAVE1, 'stand', 0.15], [T.QBIG + 0.3, 'd6_chinL', 0.14, 'back'], [T.LEAVE0, walkBb, 0.08]],
        face: [[0, 'smile'], [T.WAVE + 0.08, 'joy', 0.08], [T.LOOK, 'focus', 0.1], [T.THINK + 0.3, 'puzzled', 0.1], [T.LEAVE0, 'smile', 0.1]],
        turn: [[0, -0.5], [T.BW1, -0.3, 0.12], [T.LEAVE0, 0.55, 0.1]],
        gaze: [[0, 'tao2'], [T.LOOK, 'board'], [T.LEAVE0, [1800, 500]]],
      },
      // L16–L17: the medal
      tao3: {
        enter: T.T3W0 - 0.05,
        pos: [[0, [-100, FL]], [T.T3W0, [T3X, FL], T.T3W1 - T.T3W0, 'lin'], [T.EXIT0, [1740, FL], T.EXIT1 - T.EXIT0, 'lin']],
        pose: [[0, walkT3], [T.UPLOOK, 'lookUp', 0.15], [T.LAND, 'stand', 0.12, 'back'], [T.HOLD, 'd6_hold', 0.15, 'back'], [T.EXIT0, walkT3b, 0.08]],
        face: [[0, 'smile'], [T.UPLOOK, 'surprised', 0.08], [T.LAND, 'joy', 0.06], [T.HOLD, 'smile', 0.1], [T.SHINE[1] - 0.3, 'joy', 0.1]],
        turn: [[0, 0.5], [T.T3W1, 0.1, 0.12], [T.EXIT0, 0.55, 0.08]],
        squash: [[0, 1], [T.LAND, 0.88, 0.08], [T.LAND + 0.08, 1.05, 0.1], [T.LAND + 0.2, 1, 0.12]],
        gaze: [[0, 'viewer'], [T.UPLOOK, [T3X, 160]], [T.DROP + 0.45, [T3X, 420]], [T.LAND + 0.4, 'viewer'], [T.HOLD, [T3X, 650]], [T.HOLD + 1.2, 'viewer']],
      },
    },
    targets: () => ({ sign: [HALL.cx, 253], plate: HALL.plate, board: [800, 270] }),
    steps: [{ t0: T.W0, t1: T.W1, hz: 5.2 }, { t0: T.IN0, t1: T.IN1, hz: 5.6 }, { t0: T.T2W0, t1: T.T2W1, hz: 5.2 }, { t0: T.BW0, t1: T.BW1, hz: 5.2 },
      { t0: T.LEAVE0, t1: T.LEAVE1, hz: 5.6 }, { t0: T.T3W0, t1: T.T3W1, hz: 5.2 }, { t0: T.EXIT0, t1: T.EXIT1, hz: 5.6 }],
    fx: [
      // age stamps: 24 (stamped in the middle, UCLA) → 28 → 31, swapped in the corner; the last one shrinks away before the cut
      { type: 'ageStamp', key: 'stamp24', age: 24, place: 'UCLA', t0: T.ST24, ...ST, dockT: T.DOCK24, pulse: [T.P24], t1: T.ST24_OUT },
      { type: 'ageStamp', key: 'stamp28', age: 28, t0: T.ST28, ...ST, center: ST.dock, dockT: -99, pulse: [T.ST28 + 0.55], t1: T.ST28_OUT },
      { type: 'ageStamp', key: 'stamp31', age: 31, t0: T.ST31, ...ST, center: ST.dock, dockT: -99, pulse: [T.ST31 + 0.55], t1: T.ST31_OUT },

      // L1–L5: the floor (outside, then in front of the board)
      { type: 'd6_fade', id: 'd6flA', out: T.FLOOR_OUT, inner: { type: 'prop', id: 'd6flA.l', kind: 'd6_floor', at: [0, 0], t0: T.HALL } },
      // L1–L2: the building; 正教授 on the plate
      { type: 'd6_fade', id: 'd6hallF', out: T.HALL_OUT, about: [HALL.cx, 480], shrink: 0.15, inner: { type: 'prop', id: 'd6hall', kind: 'd6_hall', at: [0, 0], t0: T.HALL, drawDur: 0.9, sfxAt: [[T.HALL, 'pen'], [T.HALL + 0.4, 'pen'], [T.SIGN, 'pen'], [T.PLATE, 'pop'], [T.SHUT + 0.18, 'thud']] } },

      // L3–L5: the blackboard: a big “?” (a two-hundred-year-old question), then the question itself
      { type: 'd6_fade', id: 'd6brdF', out: T.BOARD_OUT, whoosh: true, inner: [
        { type: 'prop', id: 'd6brd', kind: 'd6_board', at: [0, 0], t0: T.BOARD, drawDur: 0.5, sfxAt: [[T.BOARD, 'chalk']] },
        { type: 'd6_fade', id: 'd6qbF', out: T.Q_OUT, dur: 0.25, inner: W('d6qb', '?', 800, 152, 190, T.QBIG, { anchor: 'middle', speed: 1700, w: 8 }) },
        { type: 'label', id: 'd6old', text: '两百多年前的老问题', at: [800, 408], rot: -2, size: 44, t0: T.OLD, t1: T.DUR },
        { type: 'scribe', id: 'd6ql1', text: '间隔一样的质数队伍，', x: 800 - textWidth('间隔一样的质数队伍，', 62) / 2, y: 206, size: 62, t0: T.QL1, cps: 7, z: Z.board, sfx: 'chalk' },
        { type: 'scribe', id: 'd6ql2', text: '能排到多长？', x: 800 - textWidth('能排到多长？', 62) / 2, y: 304, size: 62, t0: T.QL2, cps: 7, z: Z.board, sfx: 'chalk' },
      ] },
      { type: 'd6_fade', id: 'd6nmF', out: T.LOOK + 1.7, inner: { type: 'label', id: 'd6nm', text: '本·格林', at: [1365, 318], rot: 3, size: 44, t0: T.NAME, t1: T.DUR } },

      // L6: 3, 5, 7 → 9, then into the corner box (it stays there until L11)
      { type: 'd6_fade', id: 'd6rAF', out: T.MATH_OUT, inner: rowA },
      // L7–L11: 5, 11, 17, 23, 29 → ? → 35
      { type: 'd6_fade', id: 'd6rBF', out: T.MATH_OUT, whoosh: true, inner: rowB },
      // L8: your turn (the player pauses at T.PAUSE)
      { type: 'd6_fade', id: 'd6turnF', out: T.TURN_OUT, inner: { type: 'title', id: 'd6turn', text: '轮到你了！', x: 800, y: 172, size: 88, t0: T.TURN, color: 'red', rot: -3, sfx: 'stamp' } },
      // L9: 不是质数
      { type: 'd6_fade', id: 'd6npF', out: T.NOTE_OUT, inner: { type: 'label', id: 'd6np', text: '不是质数', at: [B_CX[5] + 14, 616], rot: -3, size: 46, t0: T.NOTPRIME, t1: T.DUR } },
      // L10: 小问号 asks; L11: it nods
      { type: 'd6_fade', id: 'd6qmF', out: T.MATH_OUT, inner: {
        type: 'qm', id: 'd6qm', size: 180, t0: T.QM, burst: true, pos: [[0, [200, 780]]], signSize: 52,
        mood: [[0, 'surprised'], [T.SIGNQ, 'doubt'], [T.SIGN_OFF, 'neutral'], [T.NOD, 'happy']],
        act: [[0, 'idle'], [T.SIGNQ, 'tap'], [T.SIGN_OFF, 'idle'], [T.NOD, 'nod'], [T.NOD + 1.2, 'idle']],
        sign: [[0, null], [T.SIGNQ, '为什么偏偏是 5？'], [T.SIGN_OFF, null]],
        gaze: [[0, [B_CX[5], 540]], [T.SIGN_OFF, [760, 620]], [T.LINK, [CAR5[0], 470]], [T.LINK + 0.6, [FIVE[0], 600]], [T.FLASH, [260, 160]]],
      } },
      // L11: the working, and the 5 that comes back
      { type: 'd6_fade', id: 'd6eqF', out: T.MATH_OUT, inner: [E1, E2, link,
        { type: 'label', id: 'd6b5', text: '开头的 5 又回来了', at: [1150, 612], rot: -3, size: 44, t0: T.BACK5, t1: T.DUR },
        { type: 'label', id: 'd6b3', text: '开头的 3 也回来了', at: [700, 150], rot: -3, size: 38, t0: T.BACK3, t1: T.DUR },
      ] },

      // L12: every queue breaks, whatever it starts with
      { type: 'd6_fade', id: 'd6rcF', out: T.ROWS_OUT, whoosh: true, inner: [...rowsC,
        { type: 'label', id: 'd6same', text: '从几开头都一样', at: [800, 700], rot: -2, size: 50, t0: T.SAME, t1: T.DUR },
      ] },

      // L13–L14: but they proved it: as long as you like — 10 in a row (real primes), 100 in a row (beads)
      { type: 'd6_fade', id: 'd6pvF', out: T.UP, inner: { type: 'title', id: 'd6pv', text: '他们证明了：', x: 800, y: 290, size: 60, t0: T.PROVED, color: 'red', rot: -2 } },
      { type: 'd6_fade', id: 'd6lgF', out: T.LONG_OUT, whoosh: true, inner: [longTitle, row10, beads,
        { type: 'label', id: 'd6l10', text: '10 个', at: [R10_CX[0], 450], rot: -3, size: 44, t0: T.R10 + 0.2, t1: T.DUR },
        { type: 'label', id: 'd6l100', text: '100 个', at: [180, 690], rot: -3, size: 44, t0: T.BEADS + 0.2, t1: T.DUR },
      ] },

      // L15: the longest found so far: 27
      { type: 'd6_fade', id: 'd6cntF', out: T.CNT_OUT, whoosh: true, inner: [lens, counter, N27,
        { type: 'label', id: 'd6n27', text: '（2019 年；到 2026 年还没找到 28 个）', at: [CNT.cx, 612], rot: -1, size: 40, t0: T.NOTE27, t1: T.DUR },
      ] },

      // L16–L17: the Fields medal (2006)
      { type: 'd6_fade', id: 'd6flB', out: T.FLOOR_OUT2, inner: { type: 'prop', id: 'd6flB.l', kind: 'd6_floor', at: [0, 0], t0: T.FLOOR2 } },
      medal,
      { type: 'd6_fade', id: 'd6fdF', out: T.LAB_OUT, inner: { type: 'label', id: 'd6fd', text: ['菲尔兹奖', '2006 年'], at: [560, 590], rot: -3, size: 50, t0: T.FIELDS, t1: T.DUR, target: [T3X - 4, 646], bend: -0.2, gap: 66 } },
    ],
    pauses: [T.PAUSE],
    subs: [
      { t0: 0.3, t1: 4.5, text: '后来，他去了加州大学洛杉矶分校，' },
      { t0: 4.6, t1: 8.0, text: '二十四岁，当上了正教授。' },
      { t0: 8.7, t1: 12.7, text: '二十八岁，他和数学家本·格林，' },
      { t0: 12.8, t1: 16.8, text: '回答了一个两百多年前的老问题：' },
      { t0: 16.9, t1: 21.1, text: '间隔一样的质数队伍，能排到多长？' },
      { t0: 21.8, t1: 25.0, text: '3、5、7：每次加2。', say: '三、五、七：每次加二。' },
      { t0: 26.2, t1: 31.4, text: '5、11、17、23、29：每次加6。', say: '五、十一、十七、二十三、二十九：每次加六。' },
      { t0: 32.0, t1: 36.6, text: '轮到你了：下一个数是几？它是质数吗？' },
      { t0: 37.3, t1: 42.5, text: '下一个是35——它是5×7，不是质数！', say: '下一个是三十五——它等于五乘七，不是质数！' },
      { t0: 43.0, t1: 45.6, text: '“为什么偏偏是5？”', voice: 'qm', say: '为什么偏偏是五？' },
      { t0: 46.0, t1: 51.2, text: '35=5+5×6：开头的5又回来了！', say: '三十五，等于五加五个六：开头的五又回来了！' },
      { t0: 51.9, t1: 56.1, text: '从几开头都一样：每一队都会断掉。' },
      { t0: 56.8, t1: 61.4, text: '可他们证明了：想要多长的队伍都有——' },
      { t0: 61.7, t1: 66.3, text: '10个一串、100个一串，都藏在质数里！', say: '十个一串、一百个一串，都藏在质数里！' },
      { t0: 67.0, t1: 72.2, text: '只是很难找：人们找到的最长的，是27个。', say: '只是很难找：人们找到的最长的，是二十七个。' },
      { t0: 73.9, t1: 78.1, text: '2006年，他获得了菲尔兹奖——', say: '二零零六年，他获得了菲尔兹奖——' },
      { t0: 78.2, t1: 81.6, text: '数学界最有名的大奖之一。' },
    ],
  });
})();
