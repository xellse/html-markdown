// 卡住曲线：Orlin 式的心情图表笑话。横轴“时间”，纵轴“心情”。
// 简单题：一条短短的平线，稍微鼓一下就完了（“嗯，做完了。”）。
// 难题：先掉进“卡住谷”，在谷底待很久很久（冒汗、问号、红笔括号越拉越长），然后突然——“啊哈！”——冲上“啊哈峰”。
// 更难的题（虚线）：谷更深，峰也更高。
// 曲线由公式逐点生成；骑在线上的小陶头像 = 曲线上 x 处的点、沿法线抬高一个头半径。都是时间的纯函数。
// 这是对“卡住”这种普遍感受的图解（演绎），不是某一次真实事件。
(() => {
  /* ---------------- the chart ---------------- */
  const OX = 180, AXY = 760, YTOP = 104, XEND = 1546;   // axes: origin x, time-axis y, top of the mood axis, end of the time axis
  const X0 = 240, YB = 400;                             // every curve starts here (neutral mood)
  const R = 46;                                         // the rider's head radius
  const EASY_END = 480;
  const easyY = x => YB - 18 * Math.exp(-(((x - 360) / 34) ** 2));                 // flat, one tiny bump
  const HARD = { drop: [320, 420], floor: 620, valley: [420, 860], amp: 11, cycles: 5.5, climb: [860, 940], peak: 228, desc: [940, 1010], plateau: 322, end: 1040 };
  const HARDER = { drop: [320, 440], floor: 725, valley: [440, 1130], amp: 8, cycles: 8.5, climb: [1130, 1210], peak: 125, desc: [1210, 1290], plateau: 286, end: 1340 };
  const sm = u => { u = clamp(u); return u * u * (3 - 2 * u); };
  /** the "stuck" curve: flat, drop into the valley, wiggle along the floor, rocket up to a sharp peak, settle a bit lower */
  function stuckY(c, x) {
    if (x <= c.drop[0]) return YB;
    if (x <= c.drop[1]) return lerp(YB, c.floor, sm((x - c.drop[0]) / (c.drop[1] - c.drop[0])));
    if (x <= c.valley[1]) {
      const u = (x - c.valley[0]) / (c.valley[1] - c.valley[0]), taper = Math.min(1, u * 8, (1 - u) * 8);
      return c.floor - c.amp * taper * Math.sin(u * c.cycles * 2 * Math.PI);
    }
    if (x <= c.climb[1]) return lerp(c.floor, c.peak, Math.pow((x - c.climb[0]) / (c.climb[1] - c.climb[0]), 1.7));
    if (x <= c.desc[1]) return lerp(c.peak, c.plateau, sm((x - c.desc[0]) / (c.desc[1] - c.desc[0])));
    return c.plateau;
  }
  const hardY = x => stuckY(HARD, x), harderY = x => stuckY(HARDER, x);
  // sanity: the harder problem's valley is deeper and its peak higher (smaller y = happier)
  if (!(HARDER.floor > HARD.floor && HARDER.peak < HARD.peak && HARD.peak < easyY(360))) console.error('c3: curve shapes');

  /** sample a curve densely enough on steep parts; the peak is a sharp corner */
  function sample(fn, x0, x1, peakX) {
    const pts = []; let x = x0;
    while (x < x1) {
      pts.push([x, fn(x)]);
      const s = fn(x + 0.4) - fn(x - 0.4), dx = clamp(7 / Math.sqrt(1 + (s / 0.8) ** 2), 0.6, 7);
      if (peakX !== undefined && x < peakX && x + dx >= peakX) { pts.push([peakX, fn(peakX), 1]); x = peakX + 0.7; continue; }
      x += dx;
    }
    pts.push([x1, fn(x1)]);
    return pts;
  }
  /** the part of a polyline left of xe (curves are functions of x) */
  function cutAt(pts, xe) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p[0] <= xe) { out.push(p); continue; }
      const q = pts[i - 1];
      if (q) out.push([xe, lerp(q[1], p[1], (xe - q[0]) / ((p[0] - q[0]) || 1))]);
      break;
    }
    return out;
  }
  /** split a polyline into dashes (on, off in stage units) */
  function dashes(pts, on, off) {
    const out = [], period = on + off; let cur = null, s = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], L = dist(a, b); let u0 = 0;
      while (u0 < L - 1e-9) {
        const ph = s % period, inOn = ph < on, step = Math.max(1e-6, Math.min((inOn ? on : period) - ph, L - u0));
        const p0 = lerp2(a, b, u0 / L), p1 = lerp2(a, b, Math.min(1, (u0 + step) / L));
        if (inOn) { if (!cur) { cur = [p0]; out.push(cur); } cur.push(p1); } else cur = null;
        u0 += step; s += step;
      }
    }
    return out;
  }

  /* ---------------- the rider's journey (scene time) ---------------- */
  const T = { pop: 6.8, e0: 8.0, e1: 10.8, hop0: 14.2, hop1: 14.7, h0: 15.8, edge: 17.3, fall: 17.5, land: 18.3, c0: 18.5, c1: 26.3,
    sud: 27.0, crouch: 27.9, aha: 28.6, top: 28.95, sit: 29.12, after0: 31.6, after1: 32.1, laugh: 40.0 };
  const PUSHES = 6;
  const easyX = t => (t < T.e0 ? X0 : lerp(X0, EASY_END, EASE.io(clamp((t - T.e0) / (T.e1 - T.e0)))));
  /** x of the rider on the hard curve: slow start, pause at the edge, fall, stop-and-go crawl through the valley, rocket climb */
  const HX = t => {
    if (t < T.fall) return lerp(X0, HARD.drop[0], EASE.io(clamp((t - T.h0) / (T.edge - T.h0))));
    if (t < T.c0) return lerp(HARD.drop[0], HARD.drop[1], EASE.in(clamp((t - T.fall) / (T.land - T.fall))));
    if (t < T.c1) { const u = (t - T.c0) / (T.c1 - T.c0), w = 2 * Math.PI * PUSHES; return lerp(HARD.valley[0], HARD.valley[1], u - Math.sin(w * u) / w); }
    if (t < T.aha) return HARD.valley[1];
    return lerp(HARD.climb[0], HARD.climb[1] - 1, clamp((t - T.aha) / (T.top - T.aha)));
  };
  /** a point on curve fn at x, lifted one head radius along the upper normal; also the slope */
  const on = (fn, x) => {
    const y = fn(x), s = (fn(x + 0.4) - fn(x - 0.4)) / 0.8, n = Math.hypot(s, 1);
    return [[x + s / n * R, y - R / n], s];
  };
  const hopsAt = t => {
    let h = 0;
    if (t >= 29.6 && t < 31.1) h = 24 * Math.abs(Math.sin(Math.PI * (t - 29.6) / 0.5));
    if (t >= T.laugh && t < T.laugh + 1.5) h = 9 * Math.abs(Math.sin(Math.PI * (t - T.laugh) / 0.25));
    return h;
  };
  const TOP = [HARD.climb[1], HARD.peak - R - 1];
  /** where the head is (centre), the slope under it, and its entrance pop */
  function riderAt(t) {
    if (t < T.pop) return null;
    if (t < T.hop0) { const [c, s] = on(easyY, easyX(t)); return { c, s, pop: EASE.back(clamp((t - T.pop) / 0.3)) }; }
    if (t < T.hop1) { const u = (t - T.hop0) / (T.hop1 - T.hop0); return { c: [lerp(EASY_END, X0, EASE.io(u)), YB - R - Math.sin(Math.PI * u) * 90], s: 0, pop: 1 }; }
    if (t < T.h0) return { c: [X0, YB - R], s: 0, pop: 1 };
    if (t < T.top) { const [c, s] = on(hardY, HX(t)); return { c, s, pop: 1 }; }
    if (t < T.sit) { // vault from the wall onto the very top
      const u = EASE.out((t - T.top) / (T.sit - T.top)), a = on(hardY, HARD.climb[1] - 1)[0];
      return { c: [lerp(a[0], TOP[0], u), lerp(a[1], TOP[1], u) - Math.sin(Math.PI * u) * 26], s: 0, pop: 1 };
    }
    return { c: [TOP[0], TOP[1] - hopsAt(t)], s: 0, pop: 1 };
  }
  /** damped squash after a landing at t0 (1 = round) */
  const land = (t, t0, a) => { const v = t - t0; return v >= 0 && v < 0.6 ? -a * Math.exp(-6 * v) * Math.cos(16 * v) : 0; };
  function squashAt(t) {
    let s = 1 + land(t, T.land, 0.24) + land(t, T.sit, 0.26);
    [30.1, 30.6, 31.1].forEach(t0 => { s += land(t, t0, 0.1); });
    if (t >= T.crouch && t < T.aha) s -= 0.2 * EASE.out(clamp((t - T.crouch) / 0.45)) - 0.012 * Math.sin(t * 70);
    if (t >= T.aha && t < T.top) s = 1.26;
    return [1 + (1 - s) * 0.6, s];
  }
  const FACES = [[0, 'neutral'], [9.1, 'smile'], [9.9, 'neutral'], [10.85, 'bored'], [14.2, 'grin'], [14.7, 'proudGrin'], [17.3, 'surprised'],
    [17.5, { eyeSY: 1.18, pupil: 0.62, brow: 'arc', browY: 0.14, mouth: 'o' }], [18.3, 'surprised'], [18.9, 'focus'], [20.6, 'puzzled'], [22.4, 'effort'],
    [24.0, 'sheepish'], [25.2, 'effort'], [26.3, 'focus'], [T.sud, 'surprised'], [T.crouch, 'effort'],
    [T.aha, { eyeSY: 1.14, pupil: 0.8, brow: 'arc', browY: 0.1, mouth: 'jaw', mo: 0.5, mw: 0.4 }], [T.sit, 'joy'],
    [34.9, 'surprised'], [36.6, { eyeSY: 1.16, pupil: 0.7, brow: 'arc', browY: 0.12, mouth: 'o' }], [37.6, 'grin'], [39.2, 'joy'], [T.laugh, 'laugh'],
    [41.6, 'joy'], [44.3, 'proud'], [46.6, 'smile']];
  const QS = [[19.9, -78, -86, 62, -14], [21.7, 2, -110, 66, 8], [23.5, 82, -94, 62, 16]];   // kept below the 简单题 tag   // [t0, dx, dy, size, rot] around the head
  const PEN3 = [[34.1, X0], [34.25, HARDER.drop[0]], [34.6, HARDER.drop[1]], [36.25, HARDER.climb[0]], [36.6, HARDER.climb[1]], [36.95, HARDER.desc[1]], [37.1, HARDER.end]];
  const pen3 = t => {
    if (t <= PEN3[0][0]) return PEN3[0][1] - 1;
    for (let i = 1; i < PEN3.length; i++) if (t < PEN3[i][0]) { const [a, xa] = PEN3[i - 1], [b, xb] = PEN3[i]; return lerp(xa, xb, (t - a) / (b - a)); }
    return HARDER.end;
  };
  /** where the rider looks ([x, y] or null = at the viewer) */
  function gazeAt(t, c) {
    if (t < T.e1) return [c[0] + 220, c[1] + 24];
    if (t < T.hop0) return null;
    if (t < T.edge) return [c[0] + 220, c[1] + 10];
    if (t < T.c0) return [c[0] + 90, c[1] + 220];
    if (t < T.c1) {
      for (const [t0, dx, dy] of QS) if (t >= t0 && t < t0 + 0.9) return [c[0] + dx, c[1] + dy];
      return [c[0] + 220, c[1] + 30];
    }
    if (t < T.sud) return [c[0] + 220, c[1] + 30];
    if (t < T.sit) return [TOP[0], TOP[1] - 120];
    if (t >= 34.1 && t < 37.3) { const x = pen3(t); return [x, harderY(x)]; }
    if (t >= 44.3 && t < 46.6) return [440, YB];
    return null;
  }

  /* ---------------- Terry's head on its own (portrait() style, with the rig's expressions) ---------------- */
  function c3Head(k, c, r, face, o) {
    const f = Object.assign({}, DEF_FACE, face), z = Z.front, rot = o.rot || 0;
    DL.save(); DL.translate(c[0], c[1]); DL.rotate(rot); DL.translate(0, r); DL.scale((o.sx || 1) * o.pop, (o.sy || 1) * o.pop); DL.translate(0, -r);
    const hl = (u, v) => [u * r, v * r * f.headSY];
    stroke(k + '.fill', ringPts(k, 0, 0, r, r * f.headSY, { n: 12, a0: -120, sweep: 360, rv: 0.035, closed: true }), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
    stroke(k + '.line', ringPts(k, 0, 0, r, r * f.headSY, { n: 12, a0: -120, sweep: 372, rv: 0.035 }), { z, w: 5 });
    HAIR.tuft(o.sway || 0, o.swayX || 0).forEach((pts, i) => stroke(k + '.hair' + i, pts.map(p => hl(p[0], p[1])), { z, w: 4.6 }));
    // eyes (kid proportions, as in the rig)
    const ex = 0.36, ey = -0.1, erx = 0.34, ery = 0.41, pr = 0.14 * f.pupil;
    const blinking = f.eyes === 'open' && f.eyeSY <= 1.02 && ((o.t + 0.6) % 3.4) < 0.1;
    let gx = 0, gy = 1, pin = false;
    if (o.gaze) { const vx = o.gaze[0] - c[0], vy = o.gaze[1] - c[1], a = -rot * RAD; gx = vx * Math.cos(a) - vy * Math.sin(a); gy = vx * Math.sin(a) + vy * Math.cos(a); pin = true; }
    const gl = Math.hypot(gx, gy) || 1; gx /= gl; gy /= gl;
    [-1, 1].forEach((s, i) => {
      const cx = s * ex, cy = ey - (f.eyeSY - 1) * 0.2, rx = erx, ry = ery * f.eyeSY, ke = k + '.eye' + i;
      if (blinking) { stroke(ke, [hl(cx - rx * 0.85, cy + 0.04), hl(cx, cy + ry * 0.2), hl(cx + rx * 0.85, cy + 0.04)], { z, w: 4.2 }); return; }
      if (f.eyes === 'happy') { stroke(ke, [hl(cx - rx * 0.82, cy + ry * 0.18), hl(cx, cy - ry * 0.42), hl(cx + rx * 0.82, cy + ry * 0.18)], { z, w: 4.6 }); return; }
      stroke(ke, ringPts(ke, cx, cy, rx, ry, { n: 11, a0: -100, sweep: 360, rv: 0.04, closed: true }).map(p => hl(p[0], p[1])), { z, w: 4.2, closed: true, fill: C.paper });
      const rim = 1 / Math.sqrt((gx / rx) ** 2 + (gy / ry) ** 2), m = pin ? Math.max(0, rim - pr - 0.03) : 0.06;
      let px = cx + gx * m, py = cy + gy * m;
      const lid = s < 0 ? f.lidL : f.lidR;
      if (lid > 0.01) {
        const ly = cy - ry + 2 * ry * lid, hw = rx * Math.sqrt(Math.max(0, 1 - ((ly - cy) / ry) ** 2));
        stroke(ke + 'lid', [hl(cx - hw, ly), hl(cx + hw, ly)], { z, w: 4.2, bow: 0.3 });
        py = Math.max(py, Math.min(ly + pr * 0.8, cy + ry - pr));
        const ny = (py - cy) / ry, maxX = rx * Math.sqrt(Math.max(0, 1 - ny * ny)) - pr;
        px = clamp(px, cx - maxX, cx + maxX);
      }
      dot(ke + 'p', hl(px, py), pr * r, C.ink, z);
    });
    if (f.brow !== 'none') [-1, 1].forEach((s, i) => {
      const cx = s * ex, top = ey - ery * f.eyeSY - (f.eyeSY - 1) * 0.2, kb = k + '.brow' + i;
      if (f.brow === 'arc') { const by = top - 0.14 - f.browY; stroke(kb, [hl(cx - erx * 0.6, by + 0.06), hl(cx, by - 0.05), hl(cx + erx * 0.6, by + 0.06)], { z, w: 4 }); }
      else { const by = top - 0.1 - f.browY, a = (s < 0 ? f.browL : f.browR) * RAD, h = 0.2; stroke(kb, [hl(cx - s * h * Math.cos(a), by + h * Math.sin(a)), hl(cx + s * h * Math.cos(a), by - h * Math.sin(a))], { z, w: 4.4 }); }
    });
    const mx = f.mx, my = 0.6, w = f.mw, km = k + '.mouth';
    switch (f.mouth) {
      case 'smile': stroke(km, [hl(mx - w / 2, my - 0.04), hl(mx, my + 0.08), hl(mx + w / 2, my - 0.04)], { z, w: 4.4 }); break;
      case 'grin': stroke(km, [hl(mx - w / 2, my - 0.04), hl(mx + w / 2, my - 0.04, 1), hl(mx + w / 4, my + 0.14), hl(mx, my + 0.18), hl(mx - w / 4, my + 0.14)].map((p, i) => (i === 1 ? [p[0], p[1], 1] : p)), { z, w: 4.4, closed: true, fill: C.paper }); break;
      case 'o': stroke(km, ringPts(km, mx, my + 0.02, 0.075, 0.09, { n: 8, closed: true }).map(p => hl(p[0], p[1])), { z, w: 4, closed: true, fill: C.paper }); break;
      case 'jaw': { const cy = my + 0.02 + 0.28 * f.mo, ry = 0.1 + 0.36 * f.mo, rx = 0.12 + 0.05 * f.mo; stroke(km, ringPts(km, mx, cy, rx, ry, { n: 10, closed: true }).map(p => hl(p[0], p[1])), { z, w: 4.4, closed: true, fill: C.paper }); break; }
      case 'wavy': stroke(km, [hl(mx - w / 2, my), hl(mx - w / 4, my - 0.05), hl(mx, my + 0.03), hl(mx + w / 4, my - 0.05), hl(mx + w / 2, my + 0.01)], { z, w: 4 }); break;
      case 'smirk': stroke(km, [hl(mx - w / 2, my + 0.02), hl(mx + w / 5, my + 0.03), hl(mx + w / 2, my - 0.07)], { z, w: 4.4 }); break;
      case 'frown': stroke(km, [hl(mx - w / 2, my + 0.05), hl(mx, my - 0.05), hl(mx + w / 2, my + 0.05)], { z, w: 4.4 }); break;
      default: stroke(km, [hl(mx - w / 2, my), hl(mx + w / 2, my)], { z, w: 4.4 });
    }
    DL.restore();
  }

  /* ---------------- components ---------------- */
  /** the axes (drawn in one L-stroke, as by hand), their labels and three little mood faces */
  function moodFace(k, cx, cy, r, kind, p) {
    if (p <= 0) return;
    const z = Z.set + 1;
    DL.save(); DL.translate(cx, cy); DL.scale(Math.max(0.01, p));
    stroke(k + '.o', ringPts(k, 0, 0, r, r, { n: 10, a0: -100, sweep: 372 }), { z, w: 3.6 });
    dot(k + '.e0', [-r * 0.36, -r * 0.18], r * 0.13, C.ink, z); dot(k + '.e1', [r * 0.36, -r * 0.18], r * 0.13, C.ink, z);
    const m = kind === 'up' ? [[-0.42, 0.22], [0, 0.5], [0.42, 0.22]] : kind === 'down' ? [[-0.42, 0.5], [0, 0.26], [0.42, 0.5]] : [[-0.36, 0.36], [0.36, 0.36]];
    stroke(k + '.m', m.map(([u, v]) => [u * r, v * r]), { z, w: 3.4 });
    DL.restore();
  }
  COMP.c3_caxes = {
    draw(fx, t) {
      const p = EASE.io(clamp((t - 0.45) / 1.0)); if (p <= 0) return;
      const z = Z.set + 1;
      stroke('c3c.ax', [[OX, YTOP], [OX, AXY, 1], [XEND, AXY]], { z, w: 5.5, draw: p });
      if (p > 0.97) {
        stroke('c3c.ax.hy', [[OX - 15, YTOP + 24], [OX, YTOP, 1], [OX + 15, YTOP + 24]], { z, w: 5.5 });
        stroke('c3c.ax.hx', [[XEND - 24, AXY - 15], [XEND, AXY, 1], [XEND - 24, AXY + 15]], { z, w: 5.5 });
      }
      const lx = clamp((t - 3.4) / 0.25), ly = clamp((t - 4.9) / 0.25);
      if (lx > 0) text('c3c.ax.tx', '时间', 1474, 722, { size: 48, z, scale: lerp(0.5, 1, EASE.back(lx)), opacity: clamp(lx * 3) });
      if (ly > 0) text('c3c.ax.ty', '心情', 212, 108, { size: 48, z, anchor: 'start', scale: lerp(0.5, 1, EASE.back(ly)), opacity: clamp(ly * 3) });
      [[168, 'up', 5.35], [YB, 'flat', 5.65], [702, 'down', 5.95]].forEach(([y, kind, t0], i) => {
        const q = EASE.back(clamp((t - t0) / 0.25)); if (q <= 0) return;
        stroke('c3c.tick' + i, [[OX - 9, y], [OX + 9, y]], { z, w: 3.5 });
        moodFace('c3c.mf' + i, 128, y, 25, kind, q);
      });
    },
    cues: () => [[0.45, 'pen'], [0.95, 'pen'], [3.4, 'pop'], [4.9, 'pop'], [5.35, 'boop'], [5.65, 'boop'], [5.95, 'boop']],
  };
  /** a mood curve, drawn up to ext(t); dash: true for the dashed "harder problem" */
  COMP.c3_ccurve = {
    init(fx) { fx.pts = sample(fx.fn, X0, fx.x1, fx.peakX); if (fx.dash) fx.dashes = dashes(fx.pts, 24, 15); return fx; },
    draw(fx, t) {
      const xe = fx.ext(t); if (xe <= X0 + 0.5) return;
      const o = { z: Z.board, w: fx.w || 5.5, boil: 0.4 };
      if (!fx.dash) { const P = cutAt(fx.pts, xe); if (P.length >= 2) stroke(fx.id, P, o); return; }
      fx.dashes.forEach((d, i) => { if (d[0][0] >= xe) return; const P = cutAt(d, xe); if (P.length >= 2) stroke(fx.id + '.d' + i, P, o); });
    },
  };
  /** the rider: Terry's head riding the pen tip, plus its sweat, question marks, speed lines and the burst at the top.
   *  Publishes F.anchors.c3_head (for the bulb and the speech tails). */
  COMP.c3_crider = {
    draw(fx, t, F) {
      const st = riderAt(t); if (!st) return;
      const { c, s, pop } = st, k = 'c3c.head';
      let rot = clamp(Math.atan(s) / RAD * 0.3, -26, 26);
      if (t >= T.c0 && t < T.c1) rot += 8 * (1 - Math.cos(2 * Math.PI * PUSHES * (t - T.c0) / (T.c1 - T.c0))) / 2;   // leans into every push
      if (t >= T.laugh && t < T.laugh + 1.5) rot += 7 * Math.sin((t - T.laugh) * 2 * Math.PI * 2.4);
      const [sx, sy] = squashAt(t);
      const prev = riderAt(t - 0.07), vx = prev ? c[0] - prev.c[0] : 0, vy = prev ? c[1] - prev.c[1] : 0;
      const sway = clamp(vy * 0.012, -0.4, 0.4), swayX = clamp(-vx * 0.004, -0.25, 0.25);
      let face = stepTrack(FACES, t); if (typeof face === 'string') face = FACE[face];
      c3Head(k, c, R, face, { rot, sx, sy, pop, sway, swayX, gaze: gazeAt(t, c), t });
      const top = [c[0], c[1] + R - 2 * R * sy * pop];
      F.anchors.c3_head = { head: c, headTop: top, r: R, mouth: [c[0], c[1] + 0.6 * R], jaw: [c[0], c[1] + 1.2 * R] };
      // question marks while stuck (they pop away at "突然")
      QS.forEach(([t0, dx, dy, size, qr], i) => {
        if (t < t0 || t >= T.sud + 0.15) return;
        const pp = EASE.back(clamp((t - t0) / 0.22)) * (1 - clamp((t - T.sud) / 0.15));
        text('c3c.q' + i, '?', c[0] + dx, c[1] + dy + Math.sin((t - t0) * 3 + i) * 4, { size, font: CFG.FONT_MIX, z: Z.fx, scale: Math.max(0.01, pp), rot: qr });
      });
      // sweat drops flying off
      if (t >= 21.8 && t < T.c1) [0, 1].forEach(i => {
        const ph = ((t - 21.8) * 1.4 + i * 0.5) % 1, o = Math.sin(Math.PI * ph), sd = i ? -1 : 1;
        const d = [c[0] + sd * (R + 16 + ph * 38), c[1] - R * 0.55 + ph * ph * 46 - 16];
        stroke('c3c.sw' + i, [[d[0], d[1] - 15], [d[0] + 8, d[1] + 2], [d[0], d[1] + 9], [d[0] - 8, d[1] + 2], [d[0], d[1] - 15]], { z: Z.fx, w: 3.2, fill: C.paper, opacity: o });
      });
      // speed lines behind the rocket climb
      if (t >= T.aha && t < T.sit + 0.25) {
        const D = [80 / Math.hypot(80, 392), -392 / Math.hypot(80, 392)], P = [-D[1], D[0]];
        const op = clamp((t - T.aha) / 0.08) * (1 - clamp((t - T.top) / 0.45));
        [-1.5, -0.5, 0.5, 1.5].forEach((j, i) => {
          const L = 80 + 40 * ((i * 37) % 3) / 2, a = [c[0] - D[0] * (R + 12) + P[0] * j * 18, c[1] - D[1] * (R + 12) + P[1] * j * 18];
          stroke('c3c.sp' + i, [a, [a[0] - D[0] * L, a[1] - D[1] * L]], { z: Z.fx, w: 4, opacity: op, boil: 0.6 });
        });
      }
      // burst at the top
      if (t >= T.sit && t < T.sit + 0.6) {
        const u = EASE.out((t - T.sit) / 0.6);
        for (let i = 0; i < 9; i++) {
          const a = (-180 + i * 22.5) * RAD, r0 = R + 18 + 46 * u, r1 = r0 + 30 * (1 - u) + 8;
          stroke('c3c.bu' + i, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0], [c[0] + Math.cos(a) * r1, c[1] + Math.sin(a) * r1]], { z: Z.fx, w: 4.5, opacity: 1 - u, boil: 0.6 });
        }
      }
    },
    cues: () => {
      const c = [[T.pop, 'pop'], [T.hop0, 'hop'], [T.hop1, 'tap'], [T.edge, 'boop'], [T.fall, 'whoosh'], [T.land, 'thud'],
        ...QS.map(q => [q[0], 'boop']), [T.sud, 'plip'], [T.aha + 0.02, 'zip'], [T.aha + 0.05, 'whoosh'], [T.sit, 'tada'],
        [29.6, 'hop'], [30.1, 'hop'], [30.6, 'hop'], [T.laugh, 'boing']];
      for (let i = 0; i < PUSHES; i++) c.push([T.c0 + (i + 0.25) * (T.c1 - T.c0) / PUSHES, 'tap']);
      return c;
    },
  };
  /** red brace under the valley that keeps growing with the rider: "很久……" → "很久很久很久很久……" */
  const LONG = [[21.2, '很久……'], [22.6, '很久很久……'], [24.3, '很久很久很久……'], [25.7, '很久很久很久很久……']];
  COMP.c3_cbrace = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const x0 = HARD.valley[0] + 6, x1 = Math.max(x0 + 40, Math.min(HX(t), HARD.valley[1])), y = 668, mid = (x0 + x1) / 2, k = fx.id;
      stroke(k, [[x0, y - 18], [x0 + 5, y - 3], [x0 + 18, y], [mid - 14, y], [mid - 3, y + 4], [mid, y + 15, 1], [mid + 3, y + 4], [mid + 14, y], [x1 - 18, y], [x1 - 5, y - 3], [x1, y - 18]],
        { z: Z.annot, w: 4, color: C.red, draw: EASE.out(clamp((t - fx.t0) / 0.3)) });
      let lab = null, lt = 0; LONG.forEach(([t0, s]) => { if (t >= t0) { lab = s; lt = t0; } });
      if (lab) text(k + '.t', lab, x0 + 4, y + 46, { size: 46, color: C.red, anchor: 'start', z: Z.annot, scale: lerp(1.25, 1, EASE.out(clamp((t - lt) / 0.2))) });
    },
    cues: fx => [[fx.t0, 'pen'], ...LONG.map(([t0]) => [t0, 'pen'])],
  };
  /** red note + arrow like `label`, but with no paper halo (so a highlighter band can sit under it) */
  const val = (v, t) => (typeof v === 'function' ? v(t) : v);
  COMP.c3_cnote = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, size = fx.size || 44, pp = EASE.back(clamp(lt / 0.2)), at = val(fx.at, t);
      text(fx.id, fx.text, at[0], at[1], { size, color: C.red, z: Z.annot, scale: lerp(0.6, 1, pp), opacity: clamp(lt / 0.08), rot: fx.rot || 0, halo: fx.halo });
      arrow(fx.id + '.a', val(fx.from, t), val(fx.to, t), { p: EASE.out(clamp((lt - 0.12) / 0.3)), bend: fx.bend ?? 0.2 });
    },
    cues: fx => [[fx.t0, 'pop'], ...(fx.sfxAt || [])],
  };
  /** 卡住谷: first beside the drop (while the rider falls in), then it slides into the empty valley before the dashed curve's drop is drawn */
  const VMOVE = 33.6, vU = t => EASE.io(clamp((t - VMOVE) / 0.4));

  const DUR = 48.4;
  defineScene({
    id: 'curve', chapter: '卡住曲线', dur: DUR,
    cast: {},
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      { type: 'c3_caxes', id: 'c3c.axes' },
      // the three curves
      { type: 'c3_ccurve', id: 'c3c.easy', fn: easyY, x1: EASY_END, ext: t => (t < T.hop0 ? easyX(t) : EASY_END), w: 5.5 },
      { type: 'c3_ccurve', id: 'c3c.hard', fn: hardY, x1: HARD.end, peakX: HARD.climb[1], w: 5.5,
        ext: t => (t < T.h0 ? X0 : Math.max(HX(t), t >= T.top ? HARD.climb[1] : 0, t >= T.after0 ? lerp(HARD.climb[1], HARD.end, EASE.io(clamp((t - T.after0) / (T.after1 - T.after0)))) : 0)) },
      { type: 'c3_ccurve', id: 'c3c.harder', fn: harderY, x1: HARDER.end, peakX: HARDER.climb[1], w: 4, dash: true, ext: pen3 },
      // tags at the ends of the lines (ink)
      { type: 'title', id: 'c3c.tagE', text: '简单题', x: EASY_END + 52, y: 392, size: 40, t0: T.e1, anchor: 'start', color: 'ink' },
      { type: 'title', id: 'c3c.tagH', text: '难题', x: HARD.end + 16, y: HARD.plateau, size: 40, t0: T.after1 + 0.05, anchor: 'start', color: 'ink' },
      { type: 'title', id: 'c3c.tagX', text: '更难的题', x: HARDER.end + 14, y: HARDER.plateau, size: 40, t0: 37.15, anchor: 'start', color: 'ink' },
      // red notes on the chart
      { type: 'c3_cnote', id: 'c3c.lbValley', text: '卡住谷', rot: -4, size: 46, halo: 8, t0: 19.3, t1: DUR, bend: 0.2, sfxAt: [[VMOVE, 'whoosh']],
        at: t => lerp2([282, 600], [640, 545], vU(t)), from: t => lerp2([352, 612], [640, 572], vU(t)), to: t => lerp2([486, 634], [640, 612], vU(t)) },
      { type: 'c3_cbrace', id: 'c3c.brace', t0: 21.0, t1: 34.0 },
      { type: 'band', id: 'c3c.hiPeak', rect: [652, 212, 138, 50], t0: 40.0, dur: 0.45, pad: 12 },
      { type: 'c3_cnote', id: 'c3c.lbPeak', text: '啊哈峰', at: [720, 236], rot: -2, size: 46, t0: 30.9, t1: DUR, from: [800, 246], to: [918, 262], bend: 0.25 },
      { type: 'label', id: 'c3c.lbDeep', text: '更深', at: [934, 684], rot: -3, t0: 35.65, t1: 39.1, target: [850, 728], bend: -0.25, gap: 12, size: 42 },
      { type: 'label', id: 'c3c.lbHigh', text: '更高', at: [1090, 150], rot: -3, t0: 36.75, t1: 39.1, target: [1198, 130], bend: -0.2, gap: 12, size: 42 },
      { type: 'label', id: 'c3c.lbNoPeak', text: '（没有峰）', at: [430, 300], rot: -3, t0: 44.6, t1: DUR, target: [455, 398], bend: 0.2, gap: 12, size: 40 },
      // the rider, its bulb and its words
      { type: 'c3_crider', id: 'c3c.rider' },
      { type: 'e3_bulb', id: 'c3c.bulb', char: 'c3_head', size: 64, t0: T.aha, dy: 4, state: [[T.aha, 'on']] },
      { type: 'speech', id: 'c3c.done', text: '嗯，做完了。', at: [700, 250], tail: [-170, 40], speaker: 'c3_head', t0: 11.2, t1: 13.9, size: 52, rot: -2 },
      { type: 'speech', id: 'c3c.aha', text: '啊哈！', at: [1150, 122], tail: [-120, 34], speaker: 'c3_head', t0: T.top + 0.02, t1: 31.4, size: 84, rot: -4 },
    ],
    sfx: [[8.0, 'pen'], [8.9, 'pen'], [9.8, 'pen'], [T.h0, 'pen'], [16.6, 'pen'], [T.after0, 'pen'], [34.1, 'whoosh'], [34.6, 'swish'], [36.25, 'zip']],
    subs: [
      { t0: 0.3, t1: 2.9, text: '我们来画一张图。' },
      { t0: 3.0, t1: 6.4, text: '横着是时间，竖着是心情。' },
      { t0: 6.5, t1: 9.9, text: '做简单题，心情是这样的：' },
      { t0: 10.0, t1: 13.4, text: '平平的：“嗯，做完了。”' },
      { t0: 13.9, t1: 17.1, text: '做难题，心情是这样的：' },
      { t0: 17.2, t1: 20.8, text: '先往下掉，掉进“卡住谷”，' },
      { t0: 20.9, t1: 23.9, text: '在谷底待很久很久……' },
      { t0: 26.3, t1: 28.5, text: '然后突然——' },
      { t0: 28.6, t1: 30.7, text: '“啊哈！”', voice: 'kid' },
      { t0: 30.8, t1: 33.4, text: '冲上“啊哈峰”！' },
      { t0: 34.0, t1: 36.6, text: '题越难，谷越深，' },
      { t0: 36.7, t1: 38.7, text: '峰也越高。' },
      { t0: 39.2, t1: 44.2, text: '那一下“啊哈”，是世上最好玩的感觉之一。' },
      { t0: 44.3, t1: 47.9, text: '简单题，给不了你这种感觉。' },
    ],
  });
})();
