// 第 40 场 · 每一个正奇数（proof）——全集最重要的一场：不跳步的证明，画面一步一步跟着旁白。
// L1 先前数过的三层（3、5、7）缩走 → L2–L4 随便多大的正方形（每边 n 个点，省略号表示一般的 n；旁边滚动 n = 0、1、2、100……）
// → L5–L8 外面包一层（虚线预告大一号）：右边一列 n 个、上边一行 n 个、角上 1 个（全集固定画法：胳膊实线框 + 角上虚线圈）
// → L9–L10 手写 (n+1)² − n² = n + n + 1：大正方形描实、原来的正方形被红圈拿掉（洞里写 n²），n、n、1 和图上的标签一起跳
// → L11–L12 右胳膊整条转到上胳膊上方，一个对一个，红椭圆配对，角上的 1 落单 → 黄色：总剩一个的数，就是奇数
// → L13 n = 1、2、3、100 图形跟着变 → L14–L15 小问号：反过来呢？（图形翻回一圈的样子）
// → L16–L21 99：11×9 一堆 → 拿出 1 个放在角上 → 98 个飞成两条各 49 的长胳膊（中间省略）→ 包住 49×49 → 50×50 → 红笔核对
// → L22–L24 3、5、7、9 一起拆开（拿掉落单的 1 个、两两配对、"反折"成两条胳膊、包住正方形、补成大一号）→ L25 1 = 1² − 0²
// → L26–L28 1、3、5、7……一个个打上 Jasper 的 ┐ 记号；黄色：每一个正奇数，都是两个平方的差；钉上范围卡片。
// 开场：空舞台（Jasper、小问号 0.15 秒内弹进来）；结尾：最后 0.6 秒全部淡出，Jasper 和小问号走出右边。
(() => {
  const FL = N1.FL;

  /* ---------------- the maths, checked on load ---------------- */
  const sq = v => v * v;
  for (let n = 0; n <= 200; n++) if (sq(n + 1) - sq(n) !== n + n + 1 || (n + n + 1) % 2 !== 1) console.error('c1_proof: (n+1)² − n² ≠ n + n + 1 at n =', n);
  [[2, 3], [3, 5], [4, 7]].forEach(([N, d]) => { if (sq(N) - sq(N - 1) !== d) console.error('c1_proof: old layers', N, d); });
  const ARM99 = (99 - 1) / 2;
  if (11 * 9 !== 99 || 99 - 1 !== 98 || ARM99 !== 49 || ARM99 + ARM99 + 1 !== 99 || ARM99 + 1 !== 50) console.error('c1_proof: 99 = 49 + 49 + 1');
  const CHECK = ['50 × 50 = 2500', '49 × 49 = 2401', '2500 − 2401 = 99'];
  [(a, b, c) => a * b === c, (a, b, c) => a * b === c, (a, b, c) => a - b === c].forEach((f, i) => { const m = CHECK[i].match(/\d+/g).map(Number); if (!f(...m)) console.error('c1_proof: wrong check line', CHECK[i]); });
  const SLOTS = [1, 3, 5, 7, 9].map(k => ({ k, n: (k - 1) / 2 }));
  SLOTS.forEach(({ k, n }) => { if (sq(n + 1) - sq(n) !== k) console.error('c1_proof: slot', k); });
  const SLOT_LAB = SLOTS.map(({ k, n }) => (k === 1 ? '1 = 1² − 0²' : `${n + 1}² − ${n}²`));
  if (SLOT_LAB.join('|') !== '1 = 1² − 0²|2² − 1²|3² − 2²|4² − 3²|5² − 4²') console.error('c1_proof: slot labels', SLOT_LAB);
  const ODDS = [1, 3, 5, 7, 9, 11, 13, 15];
  if (!ODDS.every(k => k % 2 === 1 && sq((k + 1) / 2) - sq((k - 1) / 2) === k)) console.error('c1_proof: odd row', ODDS);

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    // L1: the three layers counted before (3, 5, 7), then they shrink away
    OLD: 0.3, OLD_N: 0.95, OLD_OUT: 3.75,
    // L2–L3: a square of any size, n dots a side
    CORE: 4.95, DIM_L: 8.7, DIM_B: 9.45,
    // L4: n = 0, 1, 2, 100, …
    ROLL: 11.85, R: [13.05, 13.5, 13.9, 14.35, 15.0], ROLL_OUT: 16.45,
    // L5–L8: one more layer round it
    PREV: 17.3, COL: 21.5, BOXC: 22.25, LABC: 23.15, ROW: 24.9, BOXR: 25.6, LABR: 26.55, COR: 28.45, BOXK: 28.95, LABK: 29.6,
    // L9: big square − the old square
    DIM_OUT: 31.15, EQ1: 31.55, BIG: 31.6, BIGA: 32.05, EQ2: 32.5, EQ2B: 32.68, CUT: 32.95, HOLE: 34.0, N2: 34.2, BIG_OUT: 34.9,
    // L10: = n + n + 1
    EQ3: 35.75, LAYER: 35.95, EQN1: 37.45, EQP1: 37.75, EQN2: 37.95, EQP2: 38.3, EQ1C: 38.55,
    // L11–L12: pair them up, one is left over; odd
    LAB_OUT: 39.9, FOLD: 40.25, PAIRS: 41.35, WIG: 42.3, ALONE: 42.45, CONC: 44.5, CONC_HI: 46.4,
    // L13: any n
    ALONE_OUT: 48.05, ROLL2: 48.35, NV: [48.65, 49.55, 50.45, 51.3],
    // L14–L15: the other way round?
    STAGE_OUT: 52.85, Q1: 53.05, Q2: 55.6, UNFOLD: 58.0, GEN_OUT: 60.2, Q_OFF: 60.45,
    // L16–L21: 99
    PILE: 60.95, T99: 61.35, PICK: 63.85, FLY: 64.6, KR: 65.35, TAG1: 65.6, T98: 67.85, T98_OUT: 68.85, SPLIT: 68.95, ARMS: 70.55, L49A: 71.0, L49B: 71.45,
    CORE99: 73.5, L4949: 75.05, BIG99: 77.5, L5050: 78.3, V1: 79.35, V2: 80.45, V3: 82.35, V3B: 84.6, VCK: 85.45, OUT99: 87.2,
    // L22–L24 (+0.6 s): 3, 5, 7, 9 taken apart together
    NUMS: 88.35, PILES: 88.45, LONE: 91.0, PAIR: 93.05, OVAL: 93.6, OVAL_OUT: 94.9, UNF: 95.1, BOX: 96.15, CORES: 98.1, OUTL: 99.8, LABS: 100.3,
    // L25: even 1
    ONE_NUM: 102.75, ONE_PILE: 102.85, ONE_HOP: 103.35, ONE_RING: 103.75, ONE_BOX: 104.0, ONE_SQ: 104.3, ONE_LAB: 104.55, SMALL_OUT: 107.05,
    // L26–L28: every positive odd number
    ROWN: [108.3, 108.75, 109.2, 109.65, 110.0, 110.2, 110.4, 110.6], ROW_DOTS: 110.8, TITLE: 111.2, HI: 114.9, CARD: 115.7, RING: 119.1,
    END: 120.95, DUR: 121.6,
  };

  /* ---------------- helpers ---------------- */
  const fadeFrom = (n0, a) => { if (a >= 1) return; for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * a).toFixed(3); } };
  const dotO = (key, p, r, col, z, o = 1) => { if (r <= 0.05 || o <= 0.01) return; dot(key, p, r, col, z); if (o < 1) DL.items[DL.items.length - 1].attrs.opacity = +o.toFixed(3); };
  const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const bez = (a, b, c, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  /** pencil dashes round a rectangle, drawn on with d (0..1) */
  const dashRect = (key, x0, y0, x1, y1, d, o) => {
    const P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], segs = [];
    for (let e = 0; e < 4; e++) { const nd = Math.max(1, Math.round(dist(P[e], P[e + 1]) / 26)); for (let q = 0; q < nd; q++) segs.push([lerp2(P[e], P[e + 1], q / nd), lerp2(P[e], P[e + 1], (q + 0.55) / nd)]); }
    segs.forEach((s, i) => { if (i < d * segs.length) stroke(`${key}${i}`, s, { z: Z.set, w: 3, color: C.pencil, opacity: o, boil: 0.4 }); });
  };
  /** the corner dot's dashed red circle (the series' fixed drawing) */
  const cornerRing = (key, c, cr, u, o, w = 4) => {
    for (let s = 0; s < 8; s++) {
      const a0 = s * Math.PI / 4, a1 = a0 + Math.PI / 7, arc = [];
      for (let q = 0; q <= 4; q++) { const a = a0 + (a1 - a0) * q / 4; arc.push([c[0] + cr * Math.cos(a), c[1] + cr * Math.sin(a)]); }
      stroke(`${key}${s}`, arc, { z: Z.annot, w, color: C.red, draw: clamp(u * 8 - s), opacity: o, boil: 0.2 });
    }
  };
  /** an arm's solid red outline (axis-aligned in the current frame) */
  const armBox = (key, cx, cy, w, h, d, o, lw = 4) => stroke(key, superPts(cx, cy, w, h, 24, 6), { z: Z.annot, w: lw, color: C.red, closed: true, draw: d, opacity: o });
  /** the red oval round one pair (the upper dot is one gap above the lower) */
  const pairOval = (key, x, yLow, g, d, o) => stroke(key, ringPts(key + 'r', x, yLow - g / 2, g * 0.36, g * 0.88, { n: 16 }), { z: Z.annot, w: 4, color: C.red, draw: d, opacity: o });
  /** the right arm swinging up onto the top arm, as one rigid stick: centre + angle for fold progress u (0 = right arm, 1 = lying one row above the top arm).
   *  Arm dot s (1 = next to the corner) ends up s − 1 columns from the left, so dot s pairs with top-arm column s − 1.
   *  The centre bows out to the right so the stick never sweeps over the square. */
  const armPose = (xc, yc, n, g, u) => {
    const sm = (n + 1) / 2, L = n * g, C0 = [xc, yc + sm * g], C1 = [xc - sm * g, yc - g], K = [xc + 0.82 * L, yc - 0.25 * L];
    return { c: [bez(C0[0], K[0], C1[0], u), bez(C0[1], K[1], C1[1], u)], a: -90 * u, sm };
  };
  const armPt = (P, s, g) => { const d = (s - P.sm) * g, r = P.a * RAD; return [P.c[0] - Math.sin(r) * d, P.c[1] + Math.cos(r) * d]; };

  /** a group; from `out` on it fades (and optionally shrinks toward `about`) over `dur` */
  COMP.c1_fade = {
    init(fx) {
      fx.inner = [].concat(fx.inner);
      fx.inner.forEach(f => { const c = COMP[f.type]; if (c.init && !f._c1) { c.init(f); f._c1 = 1; } });
      return fx;
    },
    draw(fx, t, F) {
      const u = fx.out === undefined ? 0 : clamp((t - fx.out) / (fx.dur ?? 0.35));
      if (u >= 1) return;
      const n0 = DL.items.length;
      DL.save();
      if (u > 0 && fx.about) DL.about(fx.about[0], fx.about[1], () => DL.scale(1 - (fx.shrink ?? 0.3) * EASE.in(u)));
      fx.inner.forEach(f => COMP[f.type].draw(f, t, F));
      DL.restore();
      fadeFrom(n0, 1 - u);
    },
    cues: fx => fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])).concat(fx.out !== undefined && fx.whoosh ? [[fx.out, 'whoosh']] : []),
  };
  /** free drawing: fn(t, lt, key, F) from t0 on */
  COMP.c1_fn = {
    draw(fx, t, F) { if (t < fx.t0) return; fx.fn(t, t - fx.t0, fx.id, F); },
    cues: fx => fx.cues || [],
  };
  /** a tag: hand-written glyphs (glyph: true) or text, red by default; pulse: [t…]; back: paper patch behind; target + from: arrow */
  COMP.c1_tag = {
    init(fx) {
      if (fx.glyph) fx.L = layoutWriting({ text: fx.text, x: 0, y: -fx.size / 2, size: fx.size, t0: fx.t0, speed: fx.speed || 3000, anchor: 'middle', gap: 0.02, glyphGap: 0.02 });
      return fx;
    },
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const out = fx.out !== undefined ? clamp((t - fx.out) / 0.3) : 0; if (out >= 1) return;
      const op = 1 - out, lt = t - fx.t0, k = fx.id, col = fx.color === 'ink' ? C.ink : C.red;
      let sc = fx.L ? 1 : lerp(0.6, 1, EASE.back(clamp(lt / 0.2)));
      (fx.pulse || []).forEach(p => { const v = (t - p) / 0.5; if (v > 0 && v < 1) sc *= 1 + 0.4 * Math.sin(Math.PI * v); });
      const [x, y] = fx.at;
      DL.save(); DL.translate(x, y); DL.scale(sc);
      if (fx.back) { const w = (fx.L ? fx.L.width : textWidth(fx.text, fx.size)) + 40, h = fx.size * 1.4; stroke(k + '.bk', superPts(0, 0, w, h, 20, 6), { z: Z.annot - 0.5, w: 1, fill: C.paper, noStroke: true, closed: true, opacity: op * clamp(lt / 0.15) }); }
      if (fx.L) fx.L.strokes.forEach((s, i) => { const p = clamp((t - s.t0) / s.dur); if (p > 0) stroke(`${k}.s${i}`, s.pts, { z: Z.annot, w: fx.w || 5, color: col, draw: p, opacity: op, boil: 0.55 }); });
      else text(k + '.t', fx.text, 0, 0, { size: fx.size, color: col, z: Z.annot, opacity: clamp(lt / 0.08) * op, halo: 8, rot: fx.rot || 0 });
      DL.restore();
      if (fx.target) {
        const tg = resolveTarget(fx.target, F); if (!tg) return;
        const from = [x + fx.from[0], y + fx.from[1]], dl = dist(from, tg) || 1, gap = fx.gap ?? 18;
        const to = [tg[0] - (tg[0] - from[0]) / dl * gap, tg[1] - (tg[1] - from[1]) / dl * gap], n0 = DL.items.length;
        arrow(k + '.a', from, to, { p: EASE.out(clamp((lt - 0.12) / 0.3)), bend: fx.bend ?? 0.2, color: col, w: 4 });
        fadeFrom(n0, op);
      }
    },
    cues: fx => [[fx.t0, fx.glyph ? 'pen' : 'pop'], ...(fx.pulse || []).map(p => [p, 'plip'])],
  };
  /** "n = 0" with the value rolling: the old value slides up and fades, the new one slides in (hand-written glyphs) */
  COMP.c1_roll = {
    init(fx) {
      fx.P = layoutWriting({ text: 'n =', x: fx.x, y: fx.y, size: fx.size, t0: fx.t0, speed: 2600, gap: 0.02, glyphGap: 0.03 });
      fx.vx = fx.P.x + fx.P.width + fx.size * 0.32;
      fx.V = fx.vals.map(([, s]) => layoutWriting({ text: s, x: fx.vx, y: fx.y, size: fx.size, t0: 0, speed: 1 }));
      return fx;
    },
    draw(fx, t) {
      if (t < fx.t0) return;
      const k = fx.id;
      fx.P.strokes.forEach((s, i) => { const p = clamp((t - s.t0) / s.dur); if (p > 0) stroke(`${k}.p${i}`, s.pts, { z: Z.annot, w: 5.5, draw: p, boil: 0.55 }); });
      let cur = -1; fx.vals.forEach(([tt], i) => { if (t >= tt) cur = i; });
      if (cur < 0) return;
      const e = EASE.out(clamp((t - fx.vals[cur][0]) / 0.22));
      [cur - 1, cur].forEach(i => {
        if (i < 0) return;
        const dy = i === cur ? (1 - e) * fx.size * 0.5 : -e * fx.size * 0.5, o = i === cur ? e : 1 - e;
        if (o <= 0.01) return;
        fx.V[i].strokes.forEach((s, j) => stroke(`${k}.v${i}_${j}`, s.pts.map(q => [q[0], q[1] + dy, q[2]]), { z: Z.annot, w: 5.5, opacity: o, boil: 0.55 }));
      });
    },
    cues: fx => [[fx.t0, 'pen'], ...fx.vals.map(([tt]) => [tt, 'tap'])],
  };
  /** a short pencil floor under the audience only (so the stage is not cut in two) */
  PROPS.c1_floor = (fx, t, lt, p) => stroke(fx.id + '.floor', [[1225, FL], [1410, FL + 2], [1590, FL - 1]], { z: Z.set, w: 2.2, color: C.pencil, draw: p, opacity: 0.8 });

  /* ---------------- L2–L15: the general square (n with an ellipsis) ----------------
   * {id, bl: [x, y] (bottom-left dot of the old square), g, t0 (old square pops in, row by row),
   *  prev: {t, t1} (pencil dashes: the bigger square to come), col / row / cor (right column, top row, corner pop in),
   *  boxC / boxR / boxK (the two arms' outlines, the corner's dashed circle), flash: [[t, 'C'|'R'|'K'|'L']],
   *  big: {t, t1} (ink outline of the big square), cut: {t} (red ring round the old square, then it fades), hole: {t, t1},
   *  fold: {t, dur}, pairs: {t}, wig: [t…] (the corner hops), nv: [[t, 1|2|3|'g']] (the folded layer for a given n), unfold: {t, dur}, t1}
   * The general square shows 7 places a side with the 4th as an ellipsis (3 dots, …, 3 dots). The corner row stays put when n changes. */
  const GEN = { bl: [220, 690], g: 52 };
  COMP.c1_gen = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.35) : 0; if (out >= 1) return;
      const op = 1 - out, k = fx.id, g = fx.g, [blx, bly] = fx.bl, R = Math.max(6, g * 0.2), pad = g * 0.36, lt = t - fx.t0, EL = g * 0.9;
      let nvT = -1, nv = 'g'; (fx.nv || []).forEach(([tt, v]) => { if (t >= tt) { nv = v; nvT = tt; } });
      const gen = nv === 'g', n = gen ? 7 : nv, ell = gen ? 3 : -1;
      const re = nvT >= 0 ? Math.max(0.01, EASE.back(clamp((t - nvT) / 0.22))) : null;
      const yc = bly - 7 * g, xc = blx + n * g;
      let fu = fx.fold ? EASE.io(clamp((t - fx.fold.t) / fx.fold.dur)) : 0;
      const unf = !!fx.unfold && t >= fx.unfold.t, unfEnd = fx.unfold ? fx.unfold.t + fx.unfold.dur : Infinity;
      if (unf) fu = 1 - EASE.io(clamp((t - fx.unfold.t) / fx.unfold.dur));
      const boxS = from => {
        if (from === undefined || t < from) return null;
        if (t >= unfEnd) return { d: EASE.out(clamp((t - unfEnd) / 0.4)), o: 1 };
        if (fx.pairs && t >= fx.pairs.t) { const o = 1 - clamp((t - fx.pairs.t) / 0.2); return o > 0 ? { d: 1, o } : null; }
        return { d: EASE.out(clamp((t - from) / 0.5)), o: 1 };
      };
      const flashW = part => { let w = 4; (fx.flash || []).forEach(([tt, p]) => { if (p === part || p === 'L') { const v = (t - tt) / 0.5; if (v > 0 && v < 1) w += 4 * Math.sin(Math.PI * v); } }); return w; };
      // pencil dashes: the bigger square to come; then the solid ink outline of the big square
      if (fx.prev && t >= fx.prev.t) { const o = 1 - clamp((t - fx.prev.t1) / 0.3); if (o > 0) dashRect(k + '.pv', blx - 22, yc - 22, xc + 22, bly + 22, EASE.out(clamp((t - fx.prev.t) / 0.6)), o * op); }
      if (fx.big && t >= fx.big.t) { const o = 1 - clamp((t - fx.big.t1) / 0.3); if (o > 0) stroke(k + '.big', rectPts(blx - 22, yc - 22, xc + 22, bly + 22), { z: Z.set + 1, w: 3.5, draw: EASE.out(clamp((t - fx.big.t) / 0.5)), opacity: o * op }); }
      if (fx.hole && t >= fx.hole.t) { const o = 1 - clamp((t - fx.hole.t1) / 0.3); if (o > 0) dashRect(k + '.hl', blx - pad, yc + g - pad, blx + 6 * g + pad, bly + pad, EASE.out(clamp((t - fx.hole.t) / 0.5)), o * op); }
      // the old square (n × n), row by row; the cut rings it in red and fades it away
      const cutU = fx.cut ? clamp((t - fx.cut.t - 0.45) / 0.5) : 0;
      if (gen && cutU < 1) {
        const co = op * (1 - cutU);
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          if (i === ell || j === ell) continue;
          const a = EASE.back(clamp((lt - (i / (n - 1)) * 0.6) / 0.22));
          if (a > 0) dotO(`${k}.c${i}_${j}`, [blx + j * g, yc + (i + 1) * g], R * a, C.ink, Z.front, co);
        }
        const ea = clamp((lt - 0.55) / 0.3) * co;
        if (ea > 0.01) {
          for (let j = 0; j < n; j++) if (j !== ell) text(`${k}.ev${j}`, '⋮', blx + j * g, yc + (ell + 1) * g, { size: EL, z: Z.front, opacity: ea });
          for (let i = 0; i < n; i++) if (i !== ell) text(`${k}.eh${i}`, '⋯', blx + ell * g, yc + (i + 1) * g, { size: EL, z: Z.front, opacity: ea });
          text(`${k}.ec`, '⋱', blx + ell * g, yc + (ell + 1) * g, { size: EL, z: Z.front, opacity: ea });
        }
        if (fx.cut && t >= fx.cut.t) stroke(k + '.cut', superPts(blx + 3 * g, yc + 4 * g, 6 * g + 1.1 * g, 6 * g + 1.1 * g, 24, 4), { z: Z.annot, w: 5, color: C.red, closed: true, draw: EASE.out(clamp((t - fx.cut.t) / 0.4)), opacity: co });
      }
      // the right column (arm C): drawn in its own frame, so it can swing up as one stick
      if (fx.col !== undefined && t >= fx.col) {
        const P = armPose(xc, yc, n, g, fu);
        DL.save(); DL.translate(P.c[0], P.c[1]); DL.rotate(P.a);
        for (let s = 1; s <= n; s++) {
          const p = [0, (s - P.sm) * g], a = re ?? EASE.back(clamp((t - fx.col - ((s - 1) / Math.max(1, n - 1)) * 0.35) / 0.22));
          if (s - 1 === ell) { if (a > 0) text(`${k}.ce`, '⋮', p[0], p[1], { size: EL, z: Z.front, opacity: clamp(a) * op }); }
          else if (a > 0) dotO(`${k}.cd${s}`, p, R * a, C.ink, Z.front, op);
        }
        const b = boxS(fx.boxC);
        if (b) armBox(k + '.bxC', 0, 0, 2 * pad, (n - 1) * g + 2 * pad, b.d, b.o * op, flashW('C'));
        DL.restore();
      }
      // the top row (arm R)
      if (fx.row !== undefined && t >= fx.row) {
        for (let m = 1; m <= n; m++) {
          const c = n - m, p = [xc - m * g, yc], a = re ?? EASE.back(clamp((t - fx.row - (c / Math.max(1, n - 1)) * 0.35) / 0.22));
          if (c === ell) { if (a > 0) text(`${k}.re`, '⋯', p[0], p[1], { size: EL, z: Z.front, opacity: clamp(a) * op }); }
          else if (a > 0) dotO(`${k}.rd${c}`, p, R * a, C.ink, Z.front, op);
        }
        const b = boxS(fx.boxR);
        if (b) armBox(k + '.bxR', blx + (n - 1) * g / 2, yc, (n - 1) * g + 2 * pad, 2 * pad, b.d, b.o * op, flashW('R'));
      }
      // the corner
      if (fx.cor !== undefined && t >= fx.cor) {
        let hop = 0; (fx.wig || []).forEach(w => { const v = (t - w) / 0.55; if (v > 0 && v < 1) hop -= 20 * Math.abs(Math.sin(2 * Math.PI * v)) * (1 - v * 0.6); });
        const c = [xc, yc + hop], a = re ?? EASE.back(clamp((t - fx.cor) / 0.25));
        dotO(k + '.k', c, R * a, C.ink, Z.front, op);
        if (fx.boxK !== undefined && t >= fx.boxK) cornerRing(k + '.kr', c, g * 0.42, EASE.out(clamp((t - fx.boxK) / 0.5)), op, flashW('K'));
      }
      // the pairs, once the right arm lies on the top arm
      if (fx.pairs && t >= fx.pairs.t) {
        const po = unf ? 1 - clamp((t - fx.unfold.t) / 0.2) : 1;
        if (po > 0) for (let c = 0; c < n; c++) if (c !== ell) pairOval(`${k}.pr${c}`, blx + c * g, yc, g, clamp((t - fx.pairs.t - c * 0.08) / 0.3), po * op);
      }
      const T_ = F.targets;
      T_[k + '.corner'] = [xc, yc];
    },
    cues: fx => {
      const c = [[fx.t0, 'pop']];
      ['col', 'row', 'cor'].forEach(p => { if (fx[p] !== undefined) c.push([fx[p], 'pop']); });
      ['boxC', 'boxR', 'boxK'].forEach(p => { if (fx[p] !== undefined) c.push([fx[p], 'pen']); });
      if (fx.prev) c.push([fx.prev.t, 'pen']);
      if (fx.big) c.push([fx.big.t, 'pen']);
      if (fx.cut) c.push([fx.cut.t, 'pen'], [fx.cut.t + 0.45, 'swish']);
      if (fx.hole) c.push([fx.hole.t, 'pen']);
      if (fx.fold) c.push([fx.fold.t, 'whoosh']);
      if (fx.pairs) c.push([fx.pairs.t, 'pen']);
      (fx.wig || []).forEach(w => c.push([w, 'boing']));
      (fx.nv || []).forEach(([tt]) => c.push([tt, 'pop']));
      if (fx.unfold) c.push([fx.unfold.t, 'whoosh']);
      (fx.flash || []).forEach(([tt]) => c.push([tt, 'plip']));
      return c;
    },
  };
  const G_YC = GEN.bl[1] - 7 * GEN.g, G_XC = GEN.bl[0] + 7 * GEN.g;   // corner of the general square: (584, 326)

  /* ---------------- L16–L21: 99 ----------------
   * 99 dots in an 11 × 9 heap → the top-right one is ringed and flies to the corner → the other 98 fly into two arms of 49,
   * drawn like the general square: 4 dots, an ellipsis, 4 dots (the 41 middle dots of each arm fly into the ellipsis and melt into it).
   * Then a pencil 49 × 49 square (also with ellipses) and the ink outline of 50 × 50. */
  const N9 = { px0: 750, py0: 300, gp: 30, r0: 6.5, bx: 200, by: 690, g: 44, ell: 4 };
  N9.yt = N9.by - 9 * N9.g; N9.xr = N9.bx + 9 * N9.g;   // top-arm row y (294), right-arm column x (596): the corner
  N9.R = Math.max(6, N9.g * 0.2);
  const HEAP = [];
  (() => {
    let q = 0;
    for (let i = 0; i < 9; i++) for (let j = 0; j < 11; j++) {
      const s = [N9.px0 + j * N9.gp, N9.py0 + i * N9.gp];
      if (i === 0 && j === 10) { HEAP.push({ s, e: [N9.xr, N9.yt], pick: true, i }); continue; }
      const top = q < 49, w = top ? q : q - 49;                 // index along its arm (0..48)
      const slot = w < 4 ? w : w >= 45 ? w - 40 : N9.ell;        // 0–3 | ellipsis | 5–8
      const e = top ? [N9.bx + slot * N9.g, N9.yt] : [N9.xr, N9.yt + (slot + 1) * N9.g];
      HEAP.push({ s, e, i, top, w, melt: slot === N9.ell, t0: T.SPLIT + (top ? 0 : 0.3) + w * 0.013 });
      q++;
    }
    if (q !== 98 || HEAP.length !== 99 || HEAP.filter(d => d.top).length !== 49 || HEAP.filter(d => d.melt).length !== 82) console.error('c1_proof: the heap of 99', q, HEAP.length);
  })();
  const MELT = [T.SPLIT + 4 * 0.013, T.SPLIT + 0.3 + 45 * 0.013 + 0.55];   // when the ellipses fill in
  COMP.c1_99 = {
    draw(fx, t, F) {
      if (t < T.PILE) return;
      const k = fx.id, lt = t - T.PILE, { g, R, xr, yt, bx, by, ell } = N9, pad = g * 0.36;
      HEAP.forEach((d, idx) => {
        const a = EASE.back(clamp((lt - d.i / 8 * 0.5) / 0.22)); if (a <= 0) return;
        let p = d.s, r = N9.r0, o = 1;
        if (d.pick) {
          const u = EASE.io(clamp((t - T.FLY) / 0.7));
          if (u > 0) { const m = [(d.s[0] + d.e[0]) / 2, Math.min(d.s[1], d.e[1]) - 130]; p = [bez(d.s[0], m[0], d.e[0], u), bez(d.s[1], m[1], d.e[1], u)]; r = lerp(N9.r0, R, u); }
        } else {
          const u = EASE.io(clamp((t - d.t0) / 0.55));
          if (u > 0) {
            const dx = d.e[0] - d.s[0], dy = d.e[1] - d.s[1], L = Math.hypot(dx, dy) || 1, sg = d.top ? 1 : -1;
            const m = [(d.s[0] + d.e[0]) / 2 + sg * dy / L * 0.16 * L, (d.s[1] + d.e[1]) / 2 - sg * dx / L * 0.16 * L];
            p = [bez(d.s[0], m[0], d.e[0], u), bez(d.s[1], m[1], d.e[1], u)]; r = lerp(N9.r0, R, u);
            if (d.melt) o = 1 - clamp((u - 0.7) / 0.3);
          }
        }
        dotO(`${k}.d${idx}`, p, r * a, C.ink, Z.front, o);
      });
      // the arms' ellipses fill in as the middle dots melt into them
      const me = clamp((t - MELT[0] - 0.4) / (MELT[1] - MELT[0]));
      if (me > 0) { text(k + '.eT', '⋯', bx + ell * g, yt, { size: g * 0.9, z: Z.front, opacity: me }); text(k + '.eR', '⋮', xr, yt + (ell + 1) * g, { size: g * 0.9, z: Z.front, opacity: me }); }
      // the picked dot: ringed, then flown to the corner, where it gets the dashed circle
      const pk = HEAP[10];
      if (t >= T.PICK && t < T.FLY + 0.1) stroke(k + '.pick', ringPts(k + '.pickR', pk.s[0], pk.s[1], 17, 17, { n: 10, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - T.PICK) / 0.3)), opacity: 1 - clamp((t - T.FLY) / 0.1) });
      if (t >= T.KR) cornerRing(k + '.kr', [xr, yt], g * 0.42, EASE.out(clamp((t - T.KR) / 0.5)), 1);
      // the two arms' outlines
      if (t >= T.ARMS) {
        const u = EASE.out(clamp((t - T.ARMS) / 0.5));
        armBox(k + '.bxT', bx + 4 * g, yt, 8 * g + 2 * pad, 2 * pad, u, 1);
        armBox(k + '.bxR', xr, yt + 5 * g, 2 * pad, 8 * g + 2 * pad, clamp(u * 1.3 - 0.3), 1);
      }
      // the 49 × 49 square inside: pencil dots with ellipses, filling in row by row from the top
      if (t >= T.CORE99) {
        for (let i = 0; i < 9; i++) {
          const u = clamp(((t - T.CORE99) / 0.8) * 9 - i); if (u <= 0) continue;
          const y = yt + (i + 1) * g, a = EASE.back(clamp(u / 0.6));
          for (let j = 0; j < 9; j++) {
            if (t >= T.L4949 && i === ell && Math.abs(j - ell) <= 3) continue;   // under the 49 × 49 patch
            if (i === ell && j === ell) text(`${k}.qc`, '⋱', bx + j * g, y, { size: g * 0.9, z: Z.front, color: C.pencil, opacity: clamp(u) });
            else if (i === ell) text(`${k}.qv${j}`, '⋮', bx + j * g, y, { size: g * 0.9, z: Z.front, color: C.pencil, opacity: clamp(u) });
            else if (j === ell) text(`${k}.qh${i}`, '⋯', bx + j * g, y, { size: g * 0.9, z: Z.front, color: C.pencil, opacity: clamp(u) });
            else dotO(`${k}.q${i}_${j}`, [bx + j * g, y], R * 0.9 * a, C.pencil, Z.front - 1, 1);
          }
        }
      }
      // 50 × 50: the ink outline round everything
      if (t >= T.BIG99) stroke(k + '.big', rectPts(bx - 22, yt - 22, xr + 22, by + 22), { z: Z.set + 1, w: 4, draw: EASE.out(clamp((t - T.BIG99) / 0.6)) });
      F.targets[k + '.corner'] = [xr, yt];
    },
    cues: () => [[T.PILE, 'pop'], [T.PICK, 'pen'], [T.FLY, 'whoosh'], [T.FLY + 0.7, 'plip'], [T.KR, 'pen'], [T.SPLIT, 'zip'], [T.SPLIT + 0.35, 'whoosh'],
      [T.ARMS, 'pen'], [T.CORE99, 'swish'], [T.BIG99, 'pen']],
  };

  /* ---------------- L22–L25: 1, 3, 5, 7, 9 taken apart ----------------
   * {id, n, cx, cy (the corner), T: {pile, lone, ring, pair, oval, ovalOut, unf, box, core, outl}}
   * The heap is a row of 2n + 1 dots under the corner row; the right-most hops up into the corner, the rest hop into pairs
   * (that is the folded picture from before), the pairs are ringed, then the upper row swings down into the right arm. */
  const OG = 40, OR = 7, OPAD = OG * 0.36;
  COMP.c1_odd = {
    draw(fx, t) {
      const S = fx.T; if (t < S.pile) return;
      const k = fx.id, n = fx.n, cx = fx.cx, cy = fx.cy;
      const heapP = j => [cx - 20 - j * 20, cy + 50];
      const hopTo = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * Math.sin(Math.PI * u)];
      const pa = j => EASE.back(clamp((t - S.pile - (2 * n - j) * 0.04) / 0.22));
      // the odd one out → the corner
      const lu = EASE.io(clamp((t - S.lone) / 0.35));
      dotO(k + '.k', hopTo(heapP(0), [cx, cy], lu, 46), OR * pa(0), C.ink, Z.front);
      if (t >= S.ring) cornerRing(k + '.kr', [cx, cy], OG * 0.42, EASE.out(clamp((t - S.ring) / 0.5)), 1);
      // two by two
      const fu = S.unf !== undefined ? 1 - EASE.io(clamp((t - S.unf) / 0.9)) : 1;
      for (let m = 1; m <= n; m++) {
        const pu = EASE.io(clamp((t - S.pair - (m - 1) * 0.05) / 0.35));
        dotO(`${k}.a${m}`, hopTo(heapP(2 * m - 1), [cx - m * OG, cy], pu, 14), OR * pa(2 * m - 1), C.ink, Z.front);
        const up = t >= S.unf ? armPt(armPose(cx, cy, n, OG, fu), n + 1 - m, OG) : hopTo(heapP(2 * m), [cx - m * OG, cy - OG], pu, 22);
        dotO(`${k}.b${m}`, up, OR * pa(2 * m), C.ink, Z.front);
      }
      if (n > 0 && t >= S.oval) {
        const o = 1 - clamp((t - S.ovalOut) / 0.25);
        if (o > 0) for (let m = 1; m <= n; m++) pairOval(`${k}.ov${m}`, cx - m * OG, cy, OG, clamp((t - S.oval - (m - 1) * 0.08) / 0.3), o);
      }
      // the two arms (empty for 1)
      if (t >= S.box) {
        const u = EASE.out(clamp((t - S.box) / 0.5));
        if (n > 0) { armBox(k + '.bxT', cx - (n + 1) * OG / 2, cy, (n - 1) * OG + 2 * OPAD, 2 * OPAD, u, 1); armBox(k + '.bxR', cx, cy + (n + 1) * OG / 2, 2 * OPAD, (n - 1) * OG + 2 * OPAD, clamp(u * 1.3 - 0.3), 1); }
        else { armBox(k + '.bxT', cx - OG, cy, 2 * OPAD, 2 * OPAD, u, 1); armBox(k + '.bxR', cx, cy + OG, 2 * OPAD, 2 * OPAD, clamp(u * 1.3 - 0.3), 1); }
      }
      // the square inside (pencil); for 1 it is a 0 × 0 "empty square"
      if (t >= S.core) {
        if (n > 0) for (let i = 1; i <= n; i++) for (let c = 1; c <= n; c++) { const a = EASE.back(clamp((t - S.core - (i - 1) * 0.08) / 0.22)); if (a > 0) dotO(`${k}.q${i}_${c}`, [cx - c * OG, cy + i * OG], OR * 0.9 * a, C.pencil, Z.front - 1); }
        else dashRect(k + '.e', cx - OG - 13, cy + OG - 13, cx - OG + 13, cy + OG + 13, EASE.out(clamp((t - S.core) / 0.4)), 1);
      }
      if (n > 0 && t >= S.outl) stroke(k + '.ol', rectPts(cx - n * OG - 22, cy - 22, cx + 22, cy + n * OG + 22), { z: Z.set + 1, w: 3, draw: EASE.out(clamp((t - S.outl) / 0.5)) });
    },
    cues: fx => {
      const S = fx.T, c = [[S.pile, 'pop'], [S.lone, 'hop'], [S.ring, 'pen'], [S.box, 'pen'], [S.core, 'pop']];
      if (fx.n > 0) c.push([S.pair, 'plip'], [S.oval, 'pen'], [S.unf, 'whoosh'], [S.outl, 'pen']);
      return c;
    },
  };
  const SLOT_CX = [140, 410, 660, 945, 1240], SLOT_CY = 330;
  const slotT = n => (n === 0
    ? { pile: T.ONE_PILE, lone: T.ONE_HOP, ring: T.ONE_RING, box: T.ONE_BOX, core: T.ONE_SQ }
    : { pile: T.PILES + 0.2 * (n - 1), lone: T.LONE + 0.12 * (n - 1), ring: T.LONE + 0.4 + 0.12 * (n - 1), pair: T.PAIR + 0.1 * (n - 1), oval: T.OVAL + 0.1 * (n - 1),
        ovalOut: T.OVAL_OUT, unf: T.UNF + 0.08 * (n - 1), box: T.BOX, core: T.CORES + 0.1 * (n - 1), outl: T.OUTL + 0.1 * (n - 1) });
  const slotX = n => SLOT_CX[n] - n * OG / 2;   // centre of the finished square

  /* ---------------- the equation (L9–L10), laid out once so its pieces can be written at their own moments ---------------- */
  const EQ = { x: 214, y: 104, size: 60, segs: [['(n+1)²', T.EQ1], ['−', T.EQ2], ['n²', T.EQ2B], ['=', T.EQ3], ['n', T.EQN1], ['+', T.EQP1], ['n', T.EQN2], ['+', T.EQP2], ['1', T.EQ1C]] };
  const EQL = layoutWriting({ text: EQ.segs.map(s => s[0]).join(' '), x: EQ.x, y: EQ.y, size: EQ.size, t0: 0, speed: 1 });
  let ci = 0;
  const eqFx = EQ.segs.map(([s, t0], i) => { const fx = { type: 'write', id: `c1eq${i}`, text: s, x: EQL.boxes[ci].x, y: EQ.y, size: EQ.size, t0, speed: 2400, w: 5.5, sfx: 'chalk' }; ci += [...s].length + 1; return fx; });
  const EQ1W = writeWidth('(n+1)²', EQ.size), EQ_A = EQ.x + EQ1W * 0.4;   // the arrow from (n+1)² down to the big square

  /* ---------------- the check (L20–L21): red, '=' signs in one column ---------------- */
  const VX = 1110, VS = 52;
  const vLine = (id, s, y, t0) => {
    const L = layoutWriting({ text: s, x: 0, y, size: VS, t0, speed: 3000 }), eq = L.boxes.findIndex(b => b.ch === '=');
    const x = eq >= 0 ? VX - L.boxes[eq].x : VX - L.width - 0.44 * VS;   // no '=' yet: end where the ' =' would start
    return { type: 'write', id, text: s, x, y, size: VS, t0, speed: 3000, color: 'red', z: Z.annot, sfx: 'pen', w: 5 };
  };
  const V1 = vLine('c1v1', CHECK[0], 300, T.V1), V2 = vLine('c1v2', CHECK[1], 380, T.V2), V3 = vLine('c1v3', '2500 − 2401', 470, T.V3);
  const V3B = { type: 'write', id: 'c1v3b', text: '= 99', x: VX, y: 470, size: VS, t0: T.V3B, speed: 3000, color: 'red', z: Z.annot, sfx: 'pen', w: 5 };
  if (V3.text + ' ' + V3B.text !== CHECK[2]) console.error('c1_proof: check line 3');
  const VCK = { type: 'write', id: 'c1vck', text: '✓', x: VX + writeWidth('= 99', VS) + 26, y: 466, size: 60, t0: T.VCK, speed: 2600, color: 'red', z: Z.annot, sfx: 'pen', w: 6 };

  /* ---------------- the last picture (L26–L28) ---------------- */
  const ROW = { y: 336, size: 64, x0: 150, dx: 118 };
  const rowFx = ODDS.map((v, i) => ({ type: 'write', id: `c1rw${i}`, text: String(v), x: ROW.x0 + i * ROW.dx, y: ROW.y, size: ROW.size, t0: T.ROWN[i], speed: 2600, anchor: 'middle', w: 5.5, sfx: 'pen' }));
  rowFx.forEach(f => layoutWriting(f));
  const markFx = rowFx.map((f, i) => ({ type: 'prop', id: `c1mk${i}`, kind: 'n1_mark', at: [f.x + f.width + 22, ROW.y + 10], t0: T.ROWN[i] + 0.22, size: 26, w: 5, drawDur: 0.25, sfxAt: [[T.ROWN[i] + 0.22, 'pen']] }));
  const CX0 = 560 - textWidth('总剩一个的数，就是奇数。', 60) / 2;   // the L12 line
  const TITLE = '每一个正奇数，都是两个平方的差', TS = 62, TX = 640 - textWidth(TITLE, TS) / 2, TY = 205;

  /* ---------------- characters ---------------- */
  const JX = 1490, QX = 1318;
  const exitWalk = makeWalk(T.END, T.END + 0.6, 5.6);

  defineScene({
    id: 'proof', chapter: '每一个正奇数', dur: T.DUR, floor: FL,
    cast: { kid: N1.kid },
    tracks: {
      kid: {
        enter: 0.05,
        pos: [[0, [JX, FL]], [T.END, [JX + 250, FL], 0.6, 'lin']],
        pose: [[0, 'stand'], [T.Q2 + 0.2, 'thinkStand', 0.14, 'back'], [T.PILE - 0.3, 'stand', 0.14], [T.VCK + 0.1, 'kidCheer', 0.12, 'back'], [T.OUT99 + 0.1, 'stand', 0.14],
          [T.RING, 'kidCheer', 0.12, 'back'], [T.END, exitWalk, 0.08]],
        face: [[0, 'smile'], [T.CORE - 0.2, 'focus', 0.1], [T.R[0], 'smile', 0.1], [T.PREV, 'focus', 0.1], [T.CONC, 'idea', 0.1], [T.CONC_HI, 'joy', 0.1], [T.ROLL2, 'smile', 0.1],
          [T.Q1 + 0.2, 'puzzled', 0.1], [T.PILE, 'focus', 0.1], [T.VCK + 0.1, 'joy', 0.08], [T.OUT99 + 0.1, 'smile', 0.1], [T.ONE_LAB + 0.4, 'laugh', 0.08], [T.SMALL_OUT, 'smile', 0.1],
          [T.HI, 'joy', 0.1], [T.END, 'smile', 0.1]],
        turn: [[0, -0.35], [T.END - 0.05, 0.5, 0.1]],
        gaze: [[0, [600, 440]], [T.CORE - 0.2, [380, 520]], [T.R[0] - 0.2, [880, 500]], [T.PREV, [420, 480]], [T.EQ1, [520, 140]], [T.FOLD, [420, 300]], [T.CONC, [560, 520]],
          [T.ROLL2, [520, 300]], [T.Q1, [QX, 640]], [T.PILE, [900, 420]], [T.FLY, [600, 300]], [T.SPLIT, [420, 480]], [T.V1, [1000, 400]], [T.OUT99, [650, 380]],
          [T.ROWN[0], [600, 360]], [T.TITLE, [640, 205]], [T.END, 'viewer']],
      },
    },
    steps: [{ t0: T.END, t1: T.END + 0.6, hz: 5.6 }],
    fx: [
      { type: 'n1_fade', f0: T.DUR - 0.6, fd: 0.35, inner: { type: 'prop', id: 'c1fl', kind: 'c1_floor', at: [0, 0], t0: 0, drawDur: 0.4 } },

      /* L1: the three layers counted before (2×2, 3×3, 4×4 with their new layer outlined), then they shrink away */
      { type: 'c1_fade', id: 'c1oldF', out: T.OLD_OUT, dur: 0.45, about: [600, 440], shrink: 0.6, whoosh: true, inner: [
        { type: 'n1_dots', id: 'c1o2', x: 330, y: 480, N: 2, gap: 40, t0: T.OLD, arms: { t: T.OLD + 0.3 } },
        { type: 'n1_dots', id: 'c1o3', x: 510, y: 440, N: 3, gap: 40, t0: T.OLD + 0.15, arms: { t: T.OLD + 0.45 } },
        { type: 'n1_dots', id: 'c1o4', x: 730, y: 400, N: 4, gap: 40, t0: T.OLD + 0.3, arms: { t: T.OLD + 0.6 } },
        ...[['3', 350, 392], ['5', 550, 352], ['7', 790, 312]].map(([s, x, y], i) => ({ type: 'write', id: `c1on${i}`, text: s, x, y, size: 52, t0: T.OLD_N + i * 0.2, speed: 2800, anchor: 'middle', color: 'red', z: Z.annot, sfx: 'pen', w: 5 })),
      ] },

      /* L2–L15: the general square */
      { type: 'c1_gen', id: 'c1g', bl: GEN.bl, g: GEN.g, t0: T.CORE, t1: T.GEN_OUT,
        prev: { t: T.PREV, t1: T.BIG }, col: T.COL, boxC: T.BOXC, row: T.ROW, boxR: T.BOXR, cor: T.COR, boxK: T.BOXK,
        big: { t: T.BIG, t1: T.BIG_OUT }, cut: { t: T.CUT }, hole: { t: T.HOLE, t1: T.LAB_OUT },
        flash: [[T.LAYER, 'L'], [T.EQN1, 'C'], [T.EQN2, 'R'], [T.EQ1C, 'K']],
        fold: { t: T.FOLD, dur: 1.0 }, pairs: { t: T.PAIRS }, wig: [T.WIG], nv: T.NV.map((tt, i) => [tt, [1, 2, 3, 'g'][i]]), unfold: { t: T.UNFOLD, dur: 0.9 } },

      // L3: n dots a side (dimension lines with the n in the gap)
      { type: 'c1_fade', id: 'c1dimF', out: T.DIM_OUT, inner: [
        { type: 'c1_fn', id: 'c1dim', t0: T.DIM_L, cues: [[T.DIM_L, 'pen'], [T.DIM_B, 'pen']], fn: (t, lt, k) => {
          const [blx, bly] = GEN.bl, g = GEN.g, y0 = G_YC + g, x1 = blx + 6 * g, xl = blx - 52, yb = bly + 52, my = (y0 + bly) / 2, mx = (blx + x1) / 2;
          const u = EASE.out(clamp(lt / 0.4)), v = EASE.out(clamp((t - T.DIM_B) / 0.4)), o = { z: Z.set + 1, w: 3 };
          stroke(k + '.l1', [[xl, y0], [xl, lerp(y0, my - 30, u)]], o); stroke(k + '.l2', [[xl, bly], [xl, lerp(bly, my + 30, u)]], o);
          stroke(k + '.lt', [[xl - 9, y0], [xl + 9, y0]], { ...o, draw: u }); stroke(k + '.lb', [[xl - 9, bly], [xl + 9, bly]], { ...o, draw: u });
          if (v > 0) {
            stroke(k + '.b1', [[blx, yb], [lerp(blx, mx - 30, v), yb]], o); stroke(k + '.b2', [[x1, yb], [lerp(x1, mx + 30, v), yb]], o);
            stroke(k + '.bl', [[blx, yb - 9], [blx, yb + 9]], { ...o, draw: v }); stroke(k + '.br', [[x1, yb - 9], [x1, yb + 9]], { ...o, draw: v });
          }
        } },
        { type: 'c1_tag', id: 'c1dnL', glyph: true, text: 'n', at: [GEN.bl[0] - 52, (G_YC + GEN.g + GEN.bl[1]) / 2], size: 50, t0: T.DIM_L + 0.25, color: 'ink', w: 5.5 },
        { type: 'c1_tag', id: 'c1dnB', glyph: true, text: 'n', at: [GEN.bl[0] + 3 * GEN.g, GEN.bl[1] + 52], size: 50, t0: T.DIM_B + 0.25, color: 'ink', w: 5.5 },
      ] },
      // L4: n = 0, 1, 2, 100, …
      { type: 'c1_fade', id: 'c1r1F', out: T.ROLL_OUT, inner: { type: 'c1_roll', id: 'c1r1', x: 760, y: 468, size: 72, t0: T.ROLL, vals: T.R.map((tt, i) => [tt, ['0', '1', '2', '100', '…'][i]]) } },

      // L6–L8: n, n, 1 beside the new layer (they jump when the equation names them)
      { type: 'c1_fade', id: 'c1labF', out: T.LAB_OUT, inner: [
        { type: 'c1_tag', id: 'c1lC', glyph: true, text: 'n', at: [G_XC + 62, G_YC + 4 * GEN.g], size: 50, t0: T.LABC, pulse: [T.LAYER, T.EQN1] },
        { type: 'c1_tag', id: 'c1lR', glyph: true, text: 'n', at: [GEN.bl[0] + 3 * GEN.g, G_YC - 62], size: 50, t0: T.LABR, pulse: [T.LAYER, T.EQN2] },
        { type: 'c1_tag', id: 'c1lK', glyph: true, text: '1', at: [G_XC + 48, G_YC - 54], size: 50, t0: T.LABK, pulse: [T.LAYER, T.EQ1C] },
      ] },

      // L9–L10: (n+1)² − n² = n + n + 1
      { type: 'c1_fade', id: 'c1eqF', out: T.STAGE_OUT, inner: eqFx },
      { type: 'c1_fade', id: 'c1eqaF', out: T.BIG_OUT, inner: { type: 'c1_fn', id: 'c1eqa', t0: T.BIGA, cues: [[T.BIGA, 'pen']], fn: (t, lt, k) => arrow(k, [EQ_A, EQ.y + EQ.size + 14], [EQ_A, G_YC - 22 - 12], { p: EASE.out(clamp(lt / 0.3)), bend: 0.1, color: C.red, w: 4, head: 18 }) } },
      { type: 'c1_fade', id: 'c1n2F', out: T.LAB_OUT, inner: { type: 'c1_tag', id: 'c1n2', glyph: true, text: 'n²', at: [GEN.bl[0] + 3 * GEN.g, G_YC + 4 * GEN.g], size: 76, t0: T.N2, color: 'ink', w: 6 } },

      // L11: the one left over
      { type: 'c1_fade', id: 'c1alF', out: T.ALONE_OUT, inner: { type: 'c1_tag', id: 'c1al', text: '落单', at: [G_XC + 150, G_YC + 4], size: 50, t0: T.ALONE, target: { target: 'c1g.corner' }, from: [-56, 0], gap: 26, bend: 0.12 } },
      // L12: the yellow conclusion
      { type: 'c1_fade', id: 'c1coF', out: T.STAGE_OUT, inner: [
        { type: 'scribe', id: 'c1co', text: '总剩一个的数，就是奇数。', x: CX0, y: 520, size: 60, t0: T.CONC, cps: 6.5, z: Z.annot, sfx: 'pen' },
        { type: 'band', id: 'c1coH', rect: [CX0, 486, textWidth('总剩一个的数，就是奇数', 60), 68], t0: T.CONC_HI, dur: 0.5 },
      ] },
      // L13: whatever n is
      { type: 'c1_fade', id: 'c1r2F', out: T.STAGE_OUT, inner: { type: 'c1_roll', id: 'c1r2', x: 780, y: 240, size: 64, t0: T.ROLL2, vals: T.NV.map((tt, i) => [tt, ['1', '2', '3', '100'][i]]) } },

      // L14–L15: 小问号
      { type: 'qm', id: 'c1qm', size: 140, t0: 0.12, signSide: 'left', signSize: 54,
        pos: [[0, [QX, FL]], [T.END, [QX + 380, FL], 0.6, 'lin']],
        mood: [[0, 'neutral'], [T.CONC_HI, 'happy'], [T.ROLL2, 'neutral'], [T.Q1, 'surprised'], [T.Q2, 'doubt'], [T.Q_OFF, 'neutral'], [T.VCK, 'happy'], [T.OUT99, 'neutral'],
          [T.ONE_LAB + 0.4, 'happy'], [T.SMALL_OUT, 'neutral'], [T.HI, 'happy']],
        act: [[0, 'idle'], [T.CONC_HI + 0.1, 'nod'], [T.CONC_HI + 1.3, 'idle'], [T.Q1, 'tap'], [T.Q1 + 1.6, 'idle'], [T.Q2 + 0.1, 'tap'], [T.Q2 + 1.8, 'idle'],
          [T.VCK + 0.1, 'nod'], [T.VCK + 1.3, 'idle'], [T.RING, 'hop']],
        sign: [[0, null], [T.Q1, '反过来呢？'], [T.Q2, '随便一个奇数？'], [T.Q_OFF, null]],
        gaze: [[0, [600, 440]], [T.CORE, [380, 520]], [T.EQ1, [520, 140]], [T.FOLD, [420, 300]], [T.CONC, [560, 520]], [T.Q1, 'viewer'], [T.PILE, [900, 420]], [T.SPLIT, [420, 480]],
          [T.V1, [1000, 400]], [T.OUT99, [650, 380]], [T.ROWN[0], [600, 360]], [T.END, 'viewer']] },

      /* L16–L21: 99 */
      { type: 'c1_fade', id: 'c1n9F', out: T.OUT99, whoosh: true, inner: [
        { type: 'c1_99', id: 'c1n9' },
        { type: 'write', id: 'c1t99', text: '99', x: 900, y: 175, size: 96, t0: T.T99, speed: 2600, anchor: 'middle', w: 7 },
        { type: 'c1_tag', id: 'c1n9k', glyph: true, text: '1', at: [N9.xr + 42, N9.yt - 44], size: 46, t0: T.TAG1 },
        { type: 'c1_fade', id: 'c1n98F', out: T.T98_OUT, dur: 0.25, inner: { type: 'c1_tag', id: 'c1n98', glyph: true, text: '98', at: [1110, 420], size: 52, t0: T.T98 } },
        { type: 'c1_tag', id: 'c1n9a', glyph: true, text: '49', at: [N9.bx + 4 * N9.g, N9.yt - 56], size: 46, t0: T.L49A },
        { type: 'c1_tag', id: 'c1n9b', glyph: true, text: '49', at: [N9.xr + 60, N9.yt + 7 * N9.g], size: 46, t0: T.L49B },
        { type: 'c1_tag', id: 'c1n9c', glyph: true, text: '49 × 49', at: [N9.bx + 4 * N9.g, N9.yt + 5 * N9.g], size: 54, t0: T.L4949, color: 'ink', back: true, w: 5.5 },
        { type: 'c1_tag', id: 'c1n9d', glyph: true, text: '50 × 50', at: [(N9.bx + N9.xr) / 2, N9.by + 62], size: 50, t0: T.L5050, color: 'ink', w: 5.5 },
        V1, V2, V3, V3B, VCK,
      ] },

      /* L22–L25: 1, 3, 5, 7, 9 */
      { type: 'c1_fade', id: 'c1oddF', out: T.SMALL_OUT, whoosh: true, inner: SLOTS.flatMap(({ k, n }) => [
        { type: 'c1_odd', id: `c1s${n}`, n, cx: SLOT_CX[n], cy: SLOT_CY, T: slotT(n) },
        { type: 'write', id: `c1sn${n}`, text: String(k), x: slotX(n), y: 196, size: 58, t0: n === 0 ? T.ONE_NUM : T.NUMS + 0.2 * (n - 1), speed: 2600, anchor: 'middle', w: 5.5 },
        { type: 'write', id: `c1sl${n}`, text: SLOT_LAB[n], x: slotX(n), y: 566, size: 44, t0: n === 0 ? T.ONE_LAB : T.LABS + 0.3 * (n - 1), speed: 3000, anchor: 'middle', color: 'red', z: Z.annot, sfx: 'pen', w: 5 },
      ]) },

      /* L26–L28: every positive odd number */
      { type: 'c1_fade', id: 'c1endF', out: T.END, dur: 0.35, inner: [
        ...rowFx, ...markFx,
        { type: 'title', id: 'c1rwd', text: '……', x: ROW.x0 + ODDS.length * ROW.dx + 10, y: ROW.y + ROW.size * 0.62, size: 56, t0: T.ROW_DOTS, sfx: 'pop' },
        { type: 'scribe', id: 'c1tt', text: TITLE, x: TX, y: TY, size: TS, t0: T.TITLE, cps: 4.2, z: Z.annot, sfx: 'pen' },
        { type: 'band', id: 'c1ttH', rect: [TX, TY - 34, textWidth(TITLE, TS), 68], t0: T.HI, dur: 0.6 },
        { type: 'c1_fn', id: 'c1ttU', t0: T.RING, cues: [[T.RING, 'pen']], fn: (t, lt, k) => {   // 每一个: underlined twice in red
          stroke(k + '.a', [[TX - 6, TY + 44], [TX + TS * 1.5, TY + 46], [TX + TS * 3 + 6, TY + 42]], { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp(lt / 0.3)) });
          stroke(k + '.b', [[TX + 4, TY + 56], [TX + TS * 1.5, TY + 57], [TX + TS * 3 - 4, TY + 54]], { z: Z.annot, w: 4, color: C.red, draw: EASE.out(clamp((lt - 0.2) / 0.3)) });
        } },
        { type: 'prop', id: 'c1card', kind: 'n1_card', at: [640, 566], t0: T.CARD, lines: ['两个数都是 0 或正整数'], w: 500, h: 110, size: 40, drawDur: 0.4, sfxAt: [[T.CARD, 'paper']] },
      ] },
    ],
    subs: [
      { t0: 1.5, t1: 4.35, text: '我们不数第几层了。' },   // L1
      { t0: 4.65, t1: 8.1, text: '画一个随便多大的正方形，' },   // L2
      { t0: 8.4, t1: 11.24, text: '每条边上有n个点。', say: '每条边上有 n 个点。' },   // L3
      { t0: 11.54, t1: 16.23, text: 'n是几都行：0、1、2、100……', say: 'n 是几都行：零、一、二、一百……' },   // L4
      { t0: 16.83, t1: 21.08, text: '外面包一层，变成大一号的正方形：' },   // L5
      { t0: 21.38, t1: 24.46, text: '右边加一列，n个；', say: '右边加一列，n 个；' },   // L6
      { t0: 24.76, t1: 27.99, text: '上边加一行，也是n个；', say: '上边加一行，也是 n 个；' },   // L7
      { t0: 28.29, t1: 30.97, text: '角上，再加1个。', say: '角上，再加一个。' },   // L8
      { t0: 31.47, t1: 35.32, text: '大正方形减掉原来的正方形，' },   // L9
      { t0: 35.52, t1: 39.54, text: '剩下的就是这一圈：n加n加1。', say: '剩下的就是这一圈：n 加 n 加一。' },   // L10
      { t0: 40.04, t1: 44.19, text: '两个n两两配对，多出的1落了单：', say: '两个 n 两两配对，多出的一落了单：' },   // L11
      { t0: 44.39, t1: 47.84, text: '总剩一个的数，就是奇数。' },   // L12
      { t0: 48.34, t1: 52.31, text: '这样算，不管n是几，都一样。', say: '这样算，不管 n 是几，都一样。' },   // L13
      { t0: 53.01, t1: 55.26, text: '“那反过来呢？”', voice: 'qm', say: '那反过来呢？' },   // L14
      { t0: 55.56, t1: 60.41, text: '“随便给一个奇数，都能做成这样的一圈吗？”', voice: 'qm', say: '随便给一个奇数，都能做成这样的一圈吗？' },   // L15
      { t0: 60.91, t1: 63.2, text: '比如99。', say: '比如九十九。' },   // L16
      { t0: 63.5, t1: 67.35, text: '先拿出落单的1个，放在角上，', say: '先拿出落单的一个，放在角上，' },   // L17
      { t0: 67.65, t1: 72.9, text: '剩下98个，分成两条胳膊，每条49个。', say: '剩下九十八个，分成两条胳膊，每条四十九个。' },   // L18
      { t0: 73.3, t1: 77.15, text: '包住49×49的正方形，', say: '包住四十九乘四十九的正方形，' },   // L19
      { t0: 77.35, t1: 80.4, text: '正好变成50×50。', say: '正好变成五十乘五十。' },   // L20
      { t0: 81.0, t1: 86.7, text: '核对一下：2500减2401，正好99。', say: '核对一下：两千五百减两千四百零一，正好九十九。' },   // L21
      { t0: 88.2, t1: 92.65, text: '任何奇数都能这样：拿掉落单的1个，', say: '任何奇数都能这样：拿掉落单的一个，' },   // L22 (+0.6)
      { t0: 92.85, t1: 97.7, text: '剩下的两两配对，分成两条一样长的胳膊，' },   // L23
      { t0: 97.9, t1: 101.95, text: '包住一个正方形，补成大一号的。' },   // L24
      { t0: 102.65, t1: 106.9, text: '就连1也行：1的平方减0的平方。', say: '就连一也行：一的平方减零的平方。' },   // L25
      { t0: 107.6, t1: 113.32, text: '所以，1、3、5、7……每一个正奇数，', say: '所以，一、三、五、七……每一个正奇数，' },   // L26
      { t0: 113.52, t1: 116.37, text: '都是两个平方的差。' },   // L27
      { t0: 116.97, t1: 120.82, text: '不是试出来的几个，是每一个。' },   // L28
    ],
  });
})();
