// 他自己说：长大的陶哲轩 2006 年接受采访时谈解题（UCLA Newsroom, 2006-08-22，原话见 ep3-script.md 事实清单）。
// 小时候以为难题靠“灵光一闪”（梦里天上掉下一个亮灯泡）→ 红笔打 ✗；
// 其实像攀岩：试试这个——走了一段；不行（✗）；再试试那个；哦，有条小捷径；做得够久，从后门找到路；最后才发现：解出来了（插旗、灯泡亮）。
// 悬崖、路线和小人都是图解（演绎），小人的位置是时间的纯函数（按路线弧长插值）。
(() => {
  const FL = 780, TAOX = 200;
  const DUR = 41.8;
  /* ---------------- timing (scene time) ---------------- */
  const TM = { cloud: 3.45, kid: 3.75, think: 4.3, fall0: 5.95, fall1: 6.6, cross: 8.95, cut: 9.9, pop: 10.5, bump: 15.0, oh: 18.25, cutDraw: 19.3,
    door: 23.6, doorOpen: 24.35, inside: 24.75, doorShut: 24.95, summit: 26.4, ohTop: 27.7, flag: 27.9, solved: 28.3, shrink: 30.2,
    l8: 30.75, l9: 36.0, l10: 38.85, hi: 39.6 };

  /* ---------------- the cliff (group coords; the whole group shrinks into the corner at TM.shrink) ---------------- */
  // a craggy rock: every vertex a sharp corner
  const OUTLINE = [[640, 768], [662, 692], [702, 642], [694, 590], [738, 522], [730, 470], [782, 420], [832, 394], [852, 346], [930, 320], [990, 298],
    [1050, 304], [1118, 264], [1170, 260], [1210, 236], [1252, 256], [1312, 262], [1352, 302], [1420, 330], [1442, 382], [1492, 432], [1502, 520],
    [1532, 562], [1528, 662], [1556, 768]].map((p, i) => (i ? [p[0], p[1], 1] : p));
  const PIV = [1548, 770], SHRINK = 0.6;
  const groupS = t => lerp(1, SHRINK, EASE.io(clamp((t - TM.shrink) / 0.5)));
  const G = (p, t) => { const s = groupS(t); return [PIV[0] + (p[0] - PIV[0]) * s, PIV[1] + (p[1] - PIV[1]) * s]; };
  const S0 = [760, 752], LA = [840, 650], DEAD = [905, 560], LB = [1050, 548], LC = [1170, 410], DOOR = [1350, 392], SUM = [1210, 238];
  const SEGS = [
    { t0: 11.2, t1: 12.6, pts: [S0, [790, 695], LA], mode: 'climb', trail: 0 },
    { t0: 12.8, t1: 14.0, pts: [LA, [872, 605], DEAD], mode: 'climb', trail: 1 },
    { t0: 15.4, t1: 16.0, pts: [DEAD, [872, 605], LA], mode: 'slide', ease: 'in' },
    { t0: 16.25, t1: 17.9, pts: [LA, [930, 645], [1010, 610], LB], mode: 'climb', trail: 2 },
    { t0: 20.2, t1: 20.6, pts: [LB, LC], mode: 'zip', ease: 'io' },
    { t0: 21.8, t1: 24.3, pts: [LC, [1240, 440], [1320, 470], [1400, 450], [1420, 410], [1390, 392], DOOR], mode: 'plod', trail: 3 },
  ];
  SEGS.forEach(s => { s.len = polyLen(s.pts); });
  const INSIDE = [[1350, 378], [1322, 340], [1272, 330], [1242, 292], [1213, 262]];
  /** where the climber's feet are, and what it is doing */
  function climberAt(t) {
    if (t < TM.pop || (t >= TM.inside && t < TM.summit)) return null;
    if (t >= TM.summit) {
      const mode = t < TM.flag ? 'stand' : t < TM.solved ? 'plant' : 'cheer';
      return { p: SUM, mode, phase: 0, dir: 1, pop: EASE.back(clamp((t - TM.summit) / 0.3)), op: 1 };
    }
    let last = null;
    for (const s of SEGS) {
      if (t >= s.t0 && t < s.t1) {
        const u = (EASE[s.ease || 'lin'])((t - s.t0) / (s.t1 - s.t0)), p = pointAt(s.pts, u), q = pointAt(s.pts, Math.min(1, u + 0.02));
        return { p, mode: s.mode, phase: u * s.len / 17, dir: q[0] >= p[0] ? 1 : -1, pop: 1, op: 1 };
      }
      if (t >= s.t1) last = s;
    }
    if (!last) return { p: S0, mode: 'stand', phase: 0, dir: 1, pop: EASE.back(clamp((t - TM.pop) / 0.3)), op: 1 };
    const p = last.pts[last.pts.length - 1];
    if (t >= 14.0 && t < 15.4) return { p, mode: 'reach', phase: 0, dir: 1, pop: 1, op: 1 };
    if (t >= TM.doorOpen) { const u = clamp((t - TM.doorOpen - 0.1) / 0.3); return { p: [p[0] + 4 * u, p[1]], mode: 'stand', phase: 0, dir: 1, pop: 1 - 0.35 * u, op: 1 - u }; }
    return { p, mode: 'stand', phase: 0, dir: last.pts[last.pts.length - 1][0] >= last.pts[0][0] ? 1 : -1, pop: 1, op: 1 };
  }
  const CFACES = [[0, 'smile'], [11.2, 'focus'], [14.0, 'effort'], [TM.bump, 'surprised'], [15.4, 'sheepish'], [16.25, 'focus'], [17.9, 'neutral'], [TM.oh, 'idea'],
    [19.8, 'grin'], [20.7, 'smile'], [21.8, 'focus'], [22.6, 'effort'], [24.2, 'smile'], [TM.summit, 'puzzled'], [TM.ohTop, 'surprised'], [TM.flag, 'grin'], [TM.solved, 'joy']];
  function climberGaze(t, st) {
    const [x, y] = st.p;
    if (t >= 14.0 && t < 15.4) return [930, 440];
    if (t >= TM.oh && t < 20.2) return LC;
    if (t >= TM.summit + 0.2 && t < TM.ohTop) return [x + (Math.floor((t - TM.summit) / 0.45) % 2 ? 160 : -160), y - 60];
    if (t >= TM.ohTop) return null;
    if (st.mode === 'stand') return null;
    return [x + st.dir * 140, y - 120];
  }

  /* ---------------- drawing helpers ---------------- */
  /** a head on its own (portrait() style + the rig's expressions). o: {gaze, t, w, op} */
  function c3mHead(k, c, r, face, o) {
    const f = Object.assign({}, DEF_FACE, face), z = o.z ?? Z.front, W = o.w || 1, op = o.op ?? 1;
    const hl = (u, v) => [c[0] + u * r, c[1] + v * r * f.headSY];
    stroke(k + '.fill', ringPts(k, c[0], c[1], r, r * f.headSY, { n: 12, a0: -120, sweep: 360, rv: 0.035, closed: true }), { z, closed: true, fill: C.paper, noStroke: true, w: 1, opacity: op });
    stroke(k + '.line', ringPts(k, c[0], c[1], r, r * f.headSY, { n: 12, a0: -120, sweep: 372, rv: 0.035 }), { z, w: 4.5 * W, opacity: op });
    HAIR.tuft(0, 0).forEach((pts, i) => stroke(k + '.hair' + i, pts.map(p => hl(p[0], p[1])), { z, w: 4.2 * W, opacity: op }));
    const ex = 0.36, ey = -0.1, erx = 0.34, ery = 0.41, pr = 0.14 * f.pupil;
    const blinking = f.eyes === 'open' && f.eyeSY <= 1.02 && ((o.t + 1.3) % 3.6) < 0.1;
    let gx = 0, gy = 1, pin = false;
    if (o.gaze) { gx = o.gaze[0] - c[0]; gy = o.gaze[1] - c[1]; pin = true; }
    const gl = Math.hypot(gx, gy) || 1; gx /= gl; gy /= gl;
    [-1, 1].forEach((s, i) => {
      const cx = s * ex, cy = ey - (f.eyeSY - 1) * 0.2, rx = erx, ry = ery * f.eyeSY, ke = k + '.eye' + i;
      if (blinking) { stroke(ke, [hl(cx - rx * 0.85, cy + 0.04), hl(cx, cy + ry * 0.2), hl(cx + rx * 0.85, cy + 0.04)], { z, w: 3.8 * W, opacity: op }); return; }
      if (f.eyes === 'happy') { stroke(ke, [hl(cx - rx * 0.82, cy + ry * 0.18), hl(cx, cy - ry * 0.42), hl(cx + rx * 0.82, cy + ry * 0.18)], { z, w: 4 * W, opacity: op }); return; }
      stroke(ke, ringPts(ke, cx, cy, rx, ry, { n: 11, a0: -100, sweep: 360, rv: 0.04, closed: true }).map(p => hl(p[0], p[1])), { z, w: 3.6 * W, closed: true, fill: C.paper, opacity: op });
      const rim = 1 / Math.sqrt((gx / rx) ** 2 + (gy / ry) ** 2), m = pin ? Math.max(0, rim - pr - 0.03) : 0.06;
      let px = cx + gx * m, py = cy + gy * m;
      const lid = s < 0 ? f.lidL : f.lidR;
      if (lid > 0.01) {
        const ly = cy - ry + 2 * ry * lid, hw = rx * Math.sqrt(Math.max(0, 1 - ((ly - cy) / ry) ** 2));
        stroke(ke + 'lid', [hl(cx - hw, ly), hl(cx + hw, ly)], { z, w: 3.6 * W, bow: 0.3, opacity: op });
        py = Math.max(py, Math.min(ly + pr * 0.8, cy + ry - pr));
        const ny = (py - cy) / ry, maxX = rx * Math.sqrt(Math.max(0, 1 - ny * ny)) - pr;
        px = clamp(px, cx - maxX, cx + maxX);
      }
      if (op > 0.5) dot(ke + 'p', hl(px, py), pr * r, C.ink, z);
    });
    if (f.brow !== 'none') [-1, 1].forEach((s, i) => {
      const cx = s * ex, top = ey - ery * f.eyeSY - (f.eyeSY - 1) * 0.2, kb = k + '.brow' + i;
      if (f.brow === 'arc') { const by = top - 0.14 - f.browY; stroke(kb, [hl(cx - erx * 0.6, by + 0.06), hl(cx, by - 0.05), hl(cx + erx * 0.6, by + 0.06)], { z, w: 3.6 * W, opacity: op }); }
      else { const by = top - 0.1 - f.browY, a = (s < 0 ? f.browL : f.browR) * RAD, h = 0.2; stroke(kb, [hl(cx - s * h * Math.cos(a), by + h * Math.sin(a)), hl(cx + s * h * Math.cos(a), by - h * Math.sin(a))], { z, w: 3.8 * W, opacity: op }); }
    });
    const mx = f.mx, my = 0.6, w = f.mw, km = k + '.mouth', mo = { z, w: 3.8 * W, opacity: op };
    switch (f.mouth) {
      case 'smile': stroke(km, [hl(mx - w / 2, my - 0.04), hl(mx, my + 0.08), hl(mx + w / 2, my - 0.04)], mo); break;
      case 'grin': stroke(km, [hl(mx - w / 2, my - 0.04), [...hl(mx + w / 2, my - 0.04), 1], hl(mx + w / 4, my + 0.14), hl(mx, my + 0.18), hl(mx - w / 4, my + 0.14)], { ...mo, closed: true, fill: C.paper }); break;
      case 'o': stroke(km, ringPts(km, mx, my + 0.02, 0.075, 0.09, { n: 8, closed: true }).map(p => hl(p[0], p[1])), { ...mo, closed: true, fill: C.paper }); break;
      case 'wavy': stroke(km, [hl(mx - w / 2, my), hl(mx - w / 4, my - 0.05), hl(mx, my + 0.03), hl(mx + w / 4, my - 0.05), hl(mx + w / 2, my + 0.01)], mo); break;
      case 'frown': stroke(km, [hl(mx - w / 2, my + 0.05), hl(mx, my - 0.05), hl(mx + w / 2, my + 0.05)], mo); break;
      default: stroke(km, [hl(mx - w / 2, my), hl(mx + w / 2, my)], mo);
    }
  }
  /** the little climbing Tao: feet at b (group coords). Limbs by mode; phase drives the climbing / walking cycle. */
  const ARM = 25, LEG = 22;
  function limbsFor(st, t) {
    const ph = st.phase * Math.PI, s = Math.sin(ph), d = st.dir;
    switch (st.mode) {
      case 'climb': return { hands: [[-15, -112 - 13 * s], [15, -112 + 13 * s]], feet: [[-11, -2 - 12 * Math.max(0, s)], [11, -2 - 12 * Math.max(0, -s)]], lean: 0 };
      case 'slide': return { hands: [[-18, -122 + 4 * Math.sin(t * 30)], [18, -120 - 4 * Math.sin(t * 30)]], feet: [[-7, 0], [7, 0]], lean: 0 };
      case 'zip': return { hands: [[-30 * d, -64], [-24 * d, -58]], feet: [[-16 * d, -4], [-4 * d, 0]], lean: 22 * d };
      case 'plod': return { hands: [[-16 - 10 * s, -44], [16 + 10 * s, -44]], feet: [[-9 + 13 * s, -5 * Math.max(0, s)], [9 - 13 * s, -5 * Math.max(0, -s)]], lean: 8 * d };
      case 'reach': return { hands: [[-20, -98], [8, -128 + 3 * Math.sin(t * 22)]], feet: [[-10, 0], [10, -6]], lean: 0 };
      case 'plant': return { hands: [[-18, -44], [34, -80]], feet: [[-10, 0], [10, 0]], lean: 0 };
      case 'cheer': return { hands: [[-30, -128], [30, -128]], feet: [[-10, 0], [10, 0]], lean: 0 };
      default: return { hands: [[-18, -44], [18, -44]], feet: [[-10, 0], [10, 0]], lean: 0 };
    }
  }
  function climberFig(k, st, t) {
    const L = limbsFor(st, t), z = Z.front, op = st.op, sq = 1 + (st.mode === 'cheer' ? -0.12 * Math.exp(-8 * (t - TM.solved)) * Math.cos(18 * (t - TM.solved)) : 0);
    DL.save(); DL.translate(st.p[0], st.p[1]); DL.scale(st.pop * (1 + (1 - sq) * 0.6), st.pop * sq); DL.rotate(L.lean);
    const hip = [0, -40], sh = [0, -70], neck = [0, -74], head = [0, -94];
    const lw = { z, w: 4.5, opacity: op };
    L.feet.forEach((f, i) => { const s = i ? 1 : -1, [kn, ft] = solveIK(hip, f, LEG, LEG, (a, b) => (s * a[0] > s * b[0] ? a : b)); stroke(k + '.leg' + i, [hip, kn, ft], lw); });
    stroke(k + '.torso', [hip, neck], lw);
    L.hands.forEach((h, i) => { const s = i ? 1 : -1, [el, hd] = solveIK(sh, h, ARM, ARM, (a, b) => (s * a[0] > s * b[0] ? a : b)); stroke(k + '.arm' + i, [sh, el, hd], lw); });
    let face = stepTrack(CFACES, t); if (typeof face === 'string') face = FACE[face];
    const gz = climberGaze(t, st);
    c3mHead(k + '.h', head, 20, face, { t, w: 0.8, op, gaze: gz ? [gz[0] - st.p[0], gz[1] - st.p[1] + 0] : null });
    DL.restore();
  }
  /** dashed polyline drawn on up to fraction u (0..1) */
  function dashedTo(k, pts, u, o) {
    if (u <= 0) return;
    const L = polyLen(pts) * u, on = o.on || 12, off = o.off || 9;
    for (let s = 0, i = 0; s < L; s += on + off, i++) {
      const a = pointAt(pts, s / polyLen(pts)), b = pointAt(pts, Math.min(L, s + on) / polyLen(pts));
      stroke(k + '.' + i, [a, b], { z: o.z ?? Z.board, w: o.w || 3.6, color: o.color || C.ink, opacity: o.opacity, boil: 0.5, bow: 0.2 });
    }
  }
  const segU = (s, t) => (EASE[s.ease || 'lin'])(clamp((t - s.t0) / (s.t1 - s.t0)));
  /** red note (group coords) with an arrow; fades with fadeT */
  function note(k, str, at, rot, t0, t, target, o = {}) {
    if (t < t0) return;
    const lt = t - t0, pp = EASE.back(clamp(lt / 0.2)), op = clamp(lt / 0.08) * (1 - clamp((t - TM.shrink) / 0.3));
    if (op <= 0.01) return;
    text(k, str, at[0], at[1], { size: o.size || 40, color: C.red, z: Z.annot, rot, scale: lerp(0.6, 1, pp), opacity: op, halo: 8 });
    if (target) arrow(k + '.a', o.from, target, { p: EASE.out(clamp((lt - 0.12) / 0.3)) * (op > 0.9 ? 1 : 0), bend: o.bend ?? 0.2, head: 16 });
  }
  const BULB = { id: 'c3m.bulbTop', t0: TM.solved, size: 52, state: [[TM.solved, 'on']], at: [0, 0] };

  COMP.c3m_cliff = {
    draw(fx, t, F) {
      if (t < TM.cut) return;
      const lt = t - TM.cut, p = EASE.out(clamp(lt / 0.6)), s = groupS(t), z = Z.set;
      DL.save(); DL.translate(PIV[0], PIV[1]); DL.scale(s); DL.translate(-PIV[0], -PIV[1]);
      // rock, ledges, cracks, overhang
      stroke('c3m.rock', OUTLINE, { z, w: 6, fill: C.paper, draw: stag(p, 0, 3) });
      stroke('c3m.ground', [[600, 770], [1080, 772], [1590, 769]], { z, w: 2.2, color: C.pencil, opacity: 0.8, draw: stag(p, 0, 3) });
      // ledges: a shelf line with pencil shading under it
      [[[810, 653], [872, 651]], [[1018, 551], [1086, 549]], [[1138, 413], [1206, 411]]].forEach((pts, i) => {
        stroke('c3m.ledge' + i, pts, { z: z + 0.2, w: 4.5, draw: stag(p, 1, 3) });
        for (let j = 0; j < 4; j++) { const x = lerp(pts[0][0] + 10, pts[1][0] - 4, j / 3), y = lerp(pts[0][1], pts[1][1], j / 3);
          stroke('c3m.lh' + i + '_' + j, [[x, y + 5], [x - 10, y + 17]], { z: z + 0.2, w: 2.2, color: C.pencil, draw: stag(p, 2, 3), boil: 0.4 }); }
      });
      for (let j = 0; j < 6; j++) { const x = 872 + j * 21;
        stroke('c3m.oh' + j, [[x, 452 - j * 0.6], [x - 11, 466 - j * 0.6]], { z: z + 0.2, w: 2.2, color: C.pencil, draw: stag(p, 2, 3), boil: 0.4 }); }
      [[[720, 700], [745, 682], [750, 662]], [[1100, 705], [1132, 692]], [[1420, 560], [1440, 598], [1434, 630]], [[985, 372], [1008, 362]], [[1300, 640], [1322, 610]], [[1210, 560], [1236, 572]],
        [[1352, 330], [1390, 352]], [[1458, 470], [1470, 500]], [[700, 742], [722, 730]], [[1240, 690], [1278, 680], [1290, 700]]]
        .forEach((pts, i) => stroke('c3m.crack' + i, pts, { z: z + 0.2, w: 2.4, color: C.pencil, draw: stag(p, 2, 3), boil: 0.5 }));
      stroke('c3m.over', [[858, 446, 1], [915, 426], [990, 432, 1], [986, 446, 1], [930, 441], [868, 452, 1], [858, 446, 1]], { z: z + 0.3, w: 5, fill: C.paper, draw: stag(p, 1, 3) });
      // trails (dashed ink): each one grows behind the climber
      SEGS.forEach(sg => { if (sg.trail !== undefined) dashedTo('c3m.tr' + sg.trail, sg.pts, segU(sg, t), {}); });
      // the shortcut, spotted before it is taken
      dashedTo('c3m.short', [LB, LC], EASE.out(clamp((t - TM.cutDraw) / 0.45)), { on: 20, off: 10, w: 4.2 });
      // dead end: red ✗
      const xp = EASE.out(clamp((t - TM.bump - 0.05) / 0.15)), xq = EASE.out(clamp((t - TM.bump - 0.2) / 0.15));
      if (xp > 0) stroke('c3m.x0', [[930, 514], [972, 556]], { z: Z.annot, w: 7, color: C.red, draw: xp });
      if (xq > 0) stroke('c3m.x1', [[972, 512], [932, 558]], { z: Z.annot, w: 7, color: C.red, draw: xq });
      // the back door: pops in, swings open, swallows the climber, shuts
      if (t >= TM.door) {
        const dp = EASE.back(clamp((t - TM.door) / 0.3)), open = clamp((t - TM.doorOpen) / 0.15) * (1 - clamp((t - TM.doorShut) / 0.15));
        DL.save(); DL.translate(DOOR[0], DOOR[1]); DL.scale(dp);
        const fr = [[-21, 0], [-21, -42, 1], [-14, -56], [0, -61], [14, -56], [21, -42, 1], [21, 0]];
        stroke('c3m.doorF', fr, { z: z + 0.5, w: 4.5, fill: open > 0.05 ? C.ink : C.paper });
        const lw = 42 * (1 - 0.8 * open);
        stroke('c3m.doorL', [[-21, 0], [-21, -42, 1], [-14, -56], [-21 + lw * 0.5, -60], [-21 + lw, -50, 1], [-21 + lw, 0, 1], [-21, 0, 1]], { z: z + 0.6, w: 4, fill: C.paper });
        dot('c3m.knob', [-21 + lw * 0.8, -26], 3.5, C.ink, z + 0.7);
        DL.restore();
      }
      // the way through the inside (pencil dots)
      dashedTo('c3m.in', INSIDE, EASE.io(clamp((t - TM.doorShut) / 1.3)), { on: 3, off: 11, w: 4, color: C.pencil, z: z + 0.4 });
      // flag on the summit
      if (t >= TM.flag) {
        const u = EASE.in(clamp((t - TM.flag) / 0.16)), dy = -70 * (1 - u), wave = Math.sin(t * 7) * 4;
        stroke('c3m.pole', [[1252, 240 + dy], [1252, 128 + dy]], { z: Z.front - 1, w: 5 });
        stroke('c3m.flag', [[1252, 130 + dy], [1306, 146 + dy + wave, 1], [1252, 164 + dy, 1]], { z: Z.front - 1, w: 4.5, fill: C.paper });
      }
      // red notes along the way
      note('c3m.n0', '试试这个', [588, 636], -4, 11.1, t, [780, 700], { from: [662, 650], bend: 0.15 });
      note('c3m.n1', '再试试那个', [985, 714], -3, 15.95, t, [975, 640], { from: [985, 692], bend: 0.15 });
      note('c3m.n2', '小捷径', [1218, 522], 3, 19.85, t, [1118, 482], { from: [1158, 512], bend: -0.2 });
      note('c3m.n3', '后门', [1468, 296], 4, 23.9, t, [1376, 352], { from: [1440, 312], bend: -0.2 });
      // the climber, its "!" and speed lines, sweat while plodding, the bulb at the top
      const st = climberAt(t);
      if (st) {
        climberFig('c3m.cl', st, t);
        const hd = [st.p[0], st.p[1] - 94];
        if (t >= TM.oh && t < 19.6) text('c3m.bang', '!', hd[0] + 30, hd[1] - 56, { size: 60, font: CFG.FONT_MIX, z: Z.fx, scale: lerp(0.3, 1, EASE.back(clamp((t - TM.oh) / 0.2))), rot: 8 });
        if (st.mode === 'zip') [0, 1, 2].forEach(i => { const a = [hd[0] - 34 - i * 4, hd[1] + 30 + i * 22]; stroke('c3m.sp' + i, [a, [a[0] - 52, a[1] + 58]], { z: Z.fx, w: 3.5, boil: 0.6 }); });
        if (t >= 22.6 && t < 24.2) { const ph = ((t - 22.6) * 1.3) % 1, d = [hd[0] - 30 - ph * 16, hd[1] - 10 + ph * ph * 30];
          stroke('c3m.sw', [[d[0], d[1] - 12], [d[0] + 7, d[1] + 2], [d[0], d[1] + 8], [d[0] - 7, d[1] + 2], [d[0], d[1] - 12]], { z: Z.fx, w: 3, fill: C.paper, opacity: Math.sin(Math.PI * ph) }); }
        if (t >= TM.solved) { BULB.at = [SUM[0] + 2, SUM[1] - 94 - 20 - 18]; COMP.e3_bulb.draw(BULB, t, F); }
      }
      DL.restore();
    },
    cues: () => [[TM.cut, 'swish'], [TM.cut + 0.3, 'pen'], [TM.pop, 'pop'], [11.1, 'pop'], [11.4, 'tap'], [11.9, 'tap'], [12.4, 'tap'], [13.0, 'tap'], [13.5, 'tap'],
      [TM.bump, 'thud'], [TM.bump + 0.05, 'pen'], [TM.bump + 0.2, 'buzz'], [15.4, 'whoosh'], [15.95, 'pop'], [16.5, 'tap'], [17.0, 'tap'], [17.5, 'tap'],
      [TM.oh, 'boop'], [TM.cutDraw, 'pen'], [19.85, 'pop'], [20.2, 'zip'], [20.6, 'tap'], [22.1, 'step'], [22.7, 'step'], [23.3, 'step'], [23.9, 'step'],
      [TM.door, 'pop'], [23.9, 'pop'], [TM.doorOpen, 'tap'], [TM.doorShut, 'thud'], [TM.doorShut + 0.2, 'pen'],
      [TM.summit, 'boing'], [TM.ohTop, 'boop'], [TM.flag + 0.15, 'thud'], [TM.solved, 'pop'], [TM.solved, 'ding'], [TM.shrink, 'whoosh']],
  };

  /* ---------------- the romantic idea: a dream where a lit bulb drops from the sky ---------------- */
  const CL = { c: [880, 420], rx: 360, ry: 228 }, KID = [950, 560];
  const BULB2 = { id: 'c3m.bulbSky', t0: TM.fall0, size: 80, state: [[TM.fall1, 'on']], at: [0, 0] };
  const fallY = (t, landY) => lerp(-60, landY, EASE.in(clamp((t - TM.fall0) / (TM.fall1 - TM.fall0))));
  COMP.c3m_dream = {
    draw(fx, t, F) {
      if (t < TM.cloud || t >= TM.cut) return;
      const pp = EASE.back(clamp((t - TM.cloud) / 0.3)), z = Z.set + 1;
      // trail of little bubbles from the grown-up's head
      [[320, 420, 13], [372, 404, 19], [436, 390, 26]].forEach(([x, y, r], i) => {
        const q = clamp((t - TM.cloud - i * 0.06) / 0.15);
        if (q > 0) stroke('c3m.tb' + i, ringPts('c3m.tb' + i, x, y, r, r, { n: 9, closed: true }), { z, w: 4, closed: true, fill: C.paper, draw: q });
      });
      const pts = [], n = 13;
      for (let i = 0; i < n * 3; i++) { const a = i / (n * 3) * Math.PI * 2, bump = 1 + 0.07 * Math.abs(Math.sin(a * n / 2 * 2)); pts.push([CL.c[0] + Math.cos(a) * CL.rx * bump * pp, CL.c[1] + Math.sin(a) * CL.ry * bump * pp]); }
      stroke('c3m.cloud', pts, { z, w: 5, closed: true, fill: C.paper });
      if (pp > 0.9) stroke('c3m.cground', [[KID[0] - 170, KID[1] + 12], [KID[0], KID[1] + 14], [KID[0] + 170, KID[1] + 11]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.8 });
      // sparkles around the dream
      if (t >= TM.fall1) [[1100, 300], [1140, 470], [700, 470], [790, 560]].forEach(([x, y], i) => {
        const tw = 0.6 + 0.4 * Math.sin(t * 6 + i * 1.7), r = 14 * tw;
        stroke('c3m.sk' + i, [[x - r, y], [x + r, y]], { z: z + 0.2, w: 3 }); stroke('c3m.sk' + i + 'v', [[x, y - r], [x, y + r]], { z: z + 0.2, w: 3 });
      });
      // the bulb: falls, lands above the kid's head (ding), then rides along with him
      const a = F.anchors.kid;
      if (a && t >= TM.fall0) { const land = a.headTop[1] - 26; BULB2.at = [a.headTop[0], t < TM.fall1 ? fallY(t, land) : land]; COMP.e3_bulb.draw(BULB2, t, F); }
      // red pen: the dream is crossed out
      const x0 = EASE.out(clamp((t - TM.cross) / 0.16)), x1 = EASE.out(clamp((t - TM.cross - 0.17) / 0.16));
      if (x0 > 0) stroke('c3m.dx0', [[CL.c[0] - 250, CL.c[1] - 170], [CL.c[0] + 250, CL.c[1] + 170]], { z: Z.annot, w: 11, color: C.red, draw: x0 });
      if (x1 > 0) stroke('c3m.dx1', [[CL.c[0] + 250, CL.c[1] - 170], [CL.c[0] - 250, CL.c[1] + 170]], { z: Z.annot, w: 11, color: C.red, draw: x1 });
    },
    cues: () => [[TM.cloud, 'boop'], [TM.fall0, 'whoosh'], [TM.fall1, 'ding'], [TM.cross, 'pen'], [TM.cross + 0.17, 'pen'], [TM.cross + 0.2, 'buzz'], [TM.cut, 'pop']],
  };

  /* ---------------- the interviewer's microphone, poking in from the left ---------------- */
  COMP.c3m_mic = {
    draw(fx, t) {
      const u = EASE.out(clamp((t - fx.t0) / 0.3)) * (1 - EASE.in(clamp((t - fx.t1) / 0.3))); if (u <= 0) return;
      const off = (1 - u) * 180, d = [0.77, -0.64], z = Z.front + 2;
      const head = [fx.at[0] - d[0] * off, fx.at[1] - d[1] * off], end = [head[0] - d[0] * 190, head[1] - d[1] * 190];
      stroke('c3m.mic.h', [[head[0] - d[0] * 22, head[1] - d[1] * 22], end], { z, w: 9 });
      stroke('c3m.mic.b', ringPts('c3m.mic.b', head[0], head[1], 21, 21, { n: 10, closed: true }), { z: z + 0.1, w: 4.5, closed: true, fill: C.paper });
      [-8, 0, 8].forEach((o, i) => stroke('c3m.mic.g' + i, [[head[0] + o - 12, head[1] - 12 + Math.abs(o)], [head[0] + o + 12, head[1] + 12 - Math.abs(o)]], { z: z + 0.2, w: 2, color: C.pencil }));
      stroke('c3m.mic.c', [[head[0] - d[0] * 26 - 9, head[1] - d[1] * 26 - 9], [head[0] - d[0] * 26 + 9, head[1] - d[1] * 26 + 9]], { z: z + 0.2, w: 5 });
    },
    cues: fx => [[fx.t0, 'whoosh'], [fx.t1, 'whoosh']],
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    c3_present: { armR: [92, 10], armL: [12, 8], lean: -1 },
    c3_recall: { tilt: -7, armScale: 1.2, ikR: { w: 1, to: 'hip', dx: 28, dy: -4, bend: 'out' }, ikL: { w: 1, to: 'chin', dx: -0.25, dy: 0.05, bend: 'down' } },
    c3_scratchA: { tilt: 8, armScale: 1.25, ikL: { w: 1, to: 'hip', dx: -28, dy: -4, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 0.95, dy: -0.85, bend: 'out' } },
    c3_cheerA: { armScale: 1.35, armL: [128, 20], armR: [128, 20] },
    c3_kidSitCheer: { ...POSE.sitFloor, armScale: 1.75, armL: [140, 18], armR: [140, 18] },
  });
  const climberWorld = t => { const st = climberAt(t); return st ? G([st.p[0], st.p[1] - 94], t) : G(SUM, t); };

  defineScene({
    id: 'myth', chapter: '他自己说', dur: DUR, floor: FL,
    cast: {
      tao: { ...E3.taoAdult },
      kid: { ...E3.terry, noShadow: true },
    },
    order: ['tao', 'kid'],
    tracks: {
      tao: {
        enter: 0.25,
        pos: [[0, [TAOX, FL]]],
        pose: [[0, 'stand'], [3.5, 'c3_recall', 0.2], [TM.cross, 'stand', 0.2], [TM.cut + 0.4, 'c3_present', 0.15], [12.0, 'stand', 0.25],
          [19.85, 'c3_present', 0.15], [21.5, 'stand', 0.25], [TM.solved, 'c3_cheerA', 0.12, 'back'], [29.6, 'stand', 0.25],
          [TM.l8, 'c3_present', 0.15], [35.9, 'c3_scratchA', 0.15, 'back'], [TM.l10, 'akimbo', 0.15, 'back']],
        face: [[0, 'smile'], [3.5, { lidL: 0.25, lidR: 0.25, mouth: 'smile', mw: 0.3, brow: 'arc', browY: 0.04 }, 0.1], [TM.cross, 'laugh', 0.08],
          [TM.cut + 0.4, 'smile', 0.1], [TM.bump, 'puzzled', 0.08], [15.9, 'smile', 0.1], [TM.oh, 'idea', 0.08], [19.6, 'grin', 0.1],
          [21.8, 'focus', 0.1], [24.0, 'proud', 0.1], [TM.solved, 'joy', 0.08], [29.6, 'smile', 0.1], [35.9, 'sheepish', 0.08], [TM.l10, 'proudGrin', 0.08]],
        turn: [[0, 0.15], [3.5, 0.35, 0.15], [TM.l8, 0.15, 0.2]],
        gaze: [[0, 'viewer'], [3.5, 'cloud'], [TM.cross, 'viewer'], [TM.cut + 0.4, 'climber'], [TM.l8, 'viewer'], [TM.l9, 'line9'], [37.4, 'viewer']],
        squash: [[0, 1], [TM.solved, 1.06, 0.06], [TM.solved + 0.06, 1, 0.25, 'back'], [TM.l10, 1.05, 0.06], [TM.l10 + 0.06, 1, 0.25, 'back']],
      },
      kid: {
        enter: TM.kid,
        pos: [[0, KID], [TM.cut, [-900, FL], 0]],
        pose: [[0, 'sitFloor'], [TM.fall1 + 0.05, 'c3_kidSitCheer', 0.1, 'back'], [8.2, 'sitFloor', 0.25]],
        face: [[0, 'smile'], [TM.fall0, 'surprised', 0.06], [TM.fall1, 'joy', 0.05], [TM.cross, 'jaw', 0.06, 'back']],
        turn: [[0, -0.2]],
        gaze: [[0, [950, 200]], [TM.fall0, 'bulbSky'], [TM.fall1 + 0.2, 'viewer']],
        squash: [[0, 1], [TM.fall1, 0.88, 0.05], [TM.fall1 + 0.05, 1.06, 0.1], [TM.fall1 + 0.15, 1, 0.2, 'back'], [TM.cross, 0.9, 0.05], [TM.cross + 0.05, 1, 0.2, 'back']],
      },
    },
    targets: F => {
      const a = F.anchors.kid;
      return { cloud: CL.c, climber: climberWorld(F.t), line9: [760, 290],
        bulbSky: a ? [a.headTop[0], fallY(F.t, a.headTop[1] - 26) - 50] : [950, 200] };
    },
    fx: [
      { type: 'c3m_mic', id: 'c3m.mic', at: [110, 566], t0: 0.8, t1: 35.0 },
      { type: 'label', id: 'c3m.when', text: '2006 年接受采访时', at: [232, 300], rot: -3, size: 36, t0: 1.1, t1: DUR },
      { type: 'c3m_dream', id: 'c3m.dream' },
      { type: 'label', id: 'c3m.thought', text: '小时候以为……', at: [700, 318], rot: -3, size: 38, t0: TM.think, t1: TM.cut },
      { type: 'c3m_cliff', id: 'c3m.cliff' },
      { type: 'title', id: 'c3m.key', text: '“关键不在聪明，也不在快。”', x: 760, y: 160, size: 54, t0: TM.l8, color: 'ink', rot: -1 },
      { type: 'band', id: 'c3m.hi', rect: [690, 376, 280, 70], t0: TM.hi, dur: 0.45, pad: 10 },
      { type: 'title', id: 'c3m.l9', text: '大数学家也会卡住。', x: 760, y: 290, size: 70, t0: TM.l9, color: 'ink' },
      { type: 'title', id: 'c3m.l10', text: '他只是不怕卡住。', x: 760, y: 410, size: 70, t0: TM.l10, color: 'ink' },
    ],
    sfx: [[0.25, 'pop'], [TM.kid, 'pop'], [TM.solved + 0.02, 'tada'], [TM.l10, 'boing']],
    subs: [
      { t0: 0.3, t1: 3.3, text: '陶哲轩长大以后说过：' },
      { t0: 3.4, t1: 8.8, text: '“小时候，我以为难题都是靠灵光一闪解决的。”' },
      { t0: 9.5, t1: 14.1, text: '“其实总是：试试这个——走了一段；”' },
      { t0: 14.2, t1: 18.0, text: '“或者不行。再试试那个——”' },
      { t0: 18.1, t1: 21.5, text: '“哦，这儿有条小捷径。”' },
      { t0: 21.6, t1: 25.8, text: '“做得够久，就会从后门找到路。”' },
      { t0: 25.9, t1: 30.1, text: '“最后才发现：哦，我解出来了。”' },
      { t0: 30.7, t1: 34.5, text: '“关键不在聪明，也不在快。”' },
      { t0: 35.2, t1: 38.6, text: '你看，大数学家也会卡住。' },
      { t0: 38.7, t1: 41.3, text: '他只是不怕卡住。' },
    ],
  });
})();
