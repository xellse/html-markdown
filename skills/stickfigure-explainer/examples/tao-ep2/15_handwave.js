// 教授还发现了几件事（据 Clements 1984 的观察）：讲题爱用手比划（“挥手论证”）；解答只写一点点；做完不爱检查，急着做下一题。
(() => {
  const FL = 780, TOP = 600, SEATP = 690, STOOL = 652;
  const PX = 380, TX = 1230;
  const G0 = 3.4, G1 = 12.7;                                   // Terry's big gestures
  const W0 = 13.1, HOP_T = 18.05, NEXT_X = 1420;               // writing at the table, then off to the next problem
  const HOLD_T = 18.3;                                         // the professor lifts the paper

  /* ---------------- gestures (pure functions of t) ---------------- */
  const gest = t => {
    const w = 2 * Math.PI * 1.25, u = t - G0;
    return {
      armL: [92 + 72 * Math.sin(w * u), 30 + 40 * Math.sin(w * u + 1.1)],
      armR: [92 + 72 * Math.sin(w * u + 2.3), 30 + 40 * Math.sin(w * u + 3.1)],
    };
  };
  const gestPose = t => ({ lean: 2 * Math.sin(t * 5), tilt: 6 * Math.sin(t * 3.7), armScale: 1.65, ...gest(t), ikL: { w: 0 }, ikR: { w: 0 } });
  const TH = 245, ARM = 0.34 * TH * 1.65;
  /** hand position from the gesture angles (same maths as the rig; standing on the stool) */
  const handAt = (t, s) => {
    const g = gest(t), spec = s < 0 ? g.armL : g.armR, half = ARM / 2;
    const hip = [TX, STOOL - 6 - 0.3 * TH * Math.cos(7 * RAD)], neck = [hip[0], hip[1] - 0.22 * TH], sh = lerp2(neck, hip, 0.15);
    const e = [sh[0] + s * Math.sin(spec[0] * RAD) * half, sh[1] + Math.cos(spec[0] * RAD) * half];
    return [e[0] + s * Math.sin((spec[0] + spec[1]) * RAD) * half, e[1] + Math.cos((spec[0] + spec[1]) * RAD) * half];
  };
  COMP.h2_arcs = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const op = clamp((t - fx.t0) / 0.3) * clamp((fx.t1 - t) / 0.3);
      [-1, 1].forEach(s => {
        const pts = [], pts2 = [];
        for (let k = 1; k <= 8; k++) {
          const h = handAt(t - k * 0.035, s), c = [TX, 480], d = dist(h, c) || 1;
          pts.push([h[0] + (h[0] - c[0]) / d * 16, h[1] + (h[1] - c[1]) / d * 16]);
          pts2.push([h[0] + (h[0] - c[0]) / d * 30, h[1] + (h[1] - c[1]) / d * 30]);
        }
        stroke('h2arc' + s, pts, { z: Z.fx, w: 4, opacity: op, boil: 0.6 });
        stroke('h2arc2' + s, pts2.slice(0, 5), { z: Z.fx, w: 2.6, opacity: op * 0.6, boil: 0.6 });
      });
    },
  };
  /** squiggly "speech": wordless scribbles puffing out of Terry's mouth and drifting to the professor */
  const SQ_T = [];
  for (let t = G0 + 0.2; t < G1 - 1.2; t += 0.62) SQ_T.push(t);
  function squiggle(k, kind, c, s, op) {
    const z = Z.fx, o = { z, w: 4.4, opacity: op, boil: 0.8 };
    if (kind === 0) { const p = []; for (let i = 0; i <= 22; i++) { const a = i * 0.62, r = 4 + i * 1.3; p.push([c[0] + Math.cos(a) * r * s, c[1] + Math.sin(a) * r * s]); } stroke(k, p, o); }
    else if (kind === 1) stroke(k, [0, 1, 2, 3, 4, 5, 6].map(i => [c[0] - 42 * s + i * 14 * s, c[1] + (i % 2 ? -12 : 12) * s]), o);
    else if (kind === 2) { const p = []; for (let i = 0; i <= 16; i++) p.push([c[0] - 44 * s + i * 5.5 * s, c[1] + Math.sin(i * 0.9) * 12 * s]); stroke(k, p, o); }
    else { const p = []; for (let i = 0; i <= 18; i++) { const a = i * 0.7; p.push([c[0] - 36 * s + i * 4 * s + Math.cos(a) * 12 * s, c[1] + Math.sin(a) * 12 * s]); } stroke(k, p, o); }
  }
  COMP.h2_blah = {
    draw(fx, t, F) {
      const a = F.anchors.terry; if (!a) return;
      SQ_T.forEach((t0, i) => {
        const lt = t - t0; if (lt < 0 || lt > 1.9) return;
        const u = lt / 1.9, lane = [-40, 30, -80, 0][i % 4];
        const c = [a.mouth[0] - 110 - u * 330, a.mouth[1] - 40 + lane - Math.sin(Math.PI * u) * 40];
        squiggle('h2bl' + i, i % 4, c, 1.1 + 0.35 * EASE.back(clamp(lt / 0.25)), clamp(lt / 0.15) * (1 - clamp((u - 0.7) / 0.3)));
      });
    },
    cues: () => SQ_T.map(t => [t, 'h2_blah']),
  };
  SFX.define('h2_blah', tone => { tone('triangle', 300 + Math.random() * 200, 500 + Math.random() * 300, 0.09, 0.07, [22, 40]); });

  /* ---------------- the written "solution" ---------------- */
  const SW = 540, SH = 420;
  const BOX0 = [560, 100, 1100, 520], BOX1 = [524, 182, 944, 509];     // zoomed-up inset -> held by the professor
  const ANS = layoutWriting({ text: '= 12', x: 250, y: 96, size: 120, t0: 15.25, speed: 1500, gap: 0.03, glyphGap: 0.03 });
  const SCR = [
    { t0: 13.7, dur: 0.7, pts: [[36, 130], [56, 104], [74, 142], [96, 100], [112, 146], [140, 108], [156, 140], [186, 112], [206, 134]] },
    { t0: 14.5, dur: 0.6, pts: [[44, 196], [60, 172], [84, 204], [104, 166], [128, 202], [150, 170], [176, 196]] },
    { t0: 15.05, dur: 0.15, pts: [[40, 214], [186, 160]] },  // crossed out
  ];
  const boxAt = t => {
    const u = EASE.io(clamp((t - HOLD_T) / 0.5));
    return BOX0.map((v, i) => lerp(v, BOX1[i], u));
  };
  COMP.h2_solution = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, p = EASE.out(clamp(lt / 0.4)), b = boxAt(t), s = (b[2] - b[0]) / SW, z = Z.fx;
      const held = clamp((t - HOLD_T) / 0.5), rot = -3 * held;
      // zoom lines from the paper on the table (until it is picked up)
      if (held < 0.05) {
        stroke('h2so.z0', [[1100, TOP - 10], [b[0] + 4, b[3]]], { z: Z.desk + 2, w: 2.2, color: C.pencil, draw: p, boil: 0.5 });
        stroke('h2so.z1', [[1162, TOP - 10], [b[2] - 4, b[3]]], { z: Z.desk + 2, w: 2.2, color: C.pencil, draw: p, boil: 0.5 });
        stroke('h2so.pp', [[1098, TOP - 1], [1106, TOP - 11, 1], [1166, TOP - 11, 1], [1160, TOP - 1, 1], [1098, TOP - 1, 1]], { z: Z.desk + 1, w: 3.5, fill: C.paper });
      }
      DL.save(); DL.translate(b[0], b[1]); DL.about(0, SH * s, () => DL.rotate(rot)); DL.scale(s);
      stroke('h2so.pg', [[0, 0], [SW, 0, 1], [SW, SH, 1], [0, SH, 1], [0, 0, 1]], { z, w: 5 / Math.max(s, 0.5), fill: C.paper, draw: p });
      if (p > 0.8) {
        // the printed question (faint pencil)
        [[30, 40, 470], [30, 64, 300]].forEach(([x, y, x1], i) => stroke('h2so.q' + i, [[x, y], [x1, y + 1]], { z: z + 0.1, w: 2.4, color: C.pencil, opacity: 0.8, boil: 0.4 }));
        SCR.forEach((sc, i) => stroke('h2so.s' + i, sc.pts, { z: z + 0.2, w: 3.6, draw: EASE.io(clamp((t - sc.t0) / sc.dur)), boil: 0.8 }));
        ANS.strokes.forEach((st, i) => { const q = clamp((t - st.t0) / st.dur); if (q > 0) stroke('h2so.a' + i, st.pts, { z: z + 0.2, w: 8, draw: q, boil: 0.6 }); });
        const ul = EASE.out(clamp((t - ANS.tEnd - 0.1) / 0.25));
        if (ul > 0) stroke('h2so.ul', [[240, 236], [340, 244], [470, 232]], { z: z + 0.2, w: 5, draw: ul });
      }
      DL.restore();
    },
    cues: fx => [[fx.t0, 'paper'], ...SCR.map(s => [s.t0, 'pen']), ...ANS.strokes.map(s => [s.t0, 'pen']), [HOLD_T, 'paper']],
  };
  /** the next problem: a little pile of papers on the floor */
  COMP.h2_pile = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const pp = EASE.back(clamp((t - fx.t0) / 0.3)), z = Z.front + 13;
      DL.save(); DL.translate(1520, FL); DL.scale(pp);
      [0, 1, 2].forEach(i => stroke('h2pl' + i, [[-58 + i * 3, -2 - i * 7], [-48 + i * 3, -14 - i * 7, 1], [52 - i * 2, -14 - i * 7, 1], [44 - i * 2, -2 - i * 7, 1], [-58 + i * 3, -2 - i * 7, 1]], { z: z - i * 0.1, w: 3.5, fill: C.paper }));
      DL.restore();
      if (t > fx.t0 + 0.6) {        // furious scribble on top
        const ph = Math.floor(t * 8) % 3;
        stroke('h2pl.s', [[1480, FL - 30 - ph], [1494, FL - 36], [1506, FL - 28 + ph], [1520, FL - 36], [1534, FL - 29]], { z: z + 0.2, w: 2.6, boil: 1 });
      }
    },
    cues: fx => [[fx.t0, 'paper']],
  };

  /* ---------------- poses ---------------- */
  const writeT = t => ({ ...POSE.sitHands, lean: -4, tilt: -8, armScale: 1.35,
    ikL: { w: 1, to: 'desk', dx: -8 + 14 * Math.sin(t * 9) + 8 * Math.sin(t * 3.1), dy: -3 - 4 * Math.abs(Math.sin(t * 17)), bend: 'down' } });
  const crouchW = t => ({ ...POSE.crouch, lean: 10, tilt: 10, armScale: 1.25,
    ikR: { w: 1, to: 'abs', dx: 1500 + 16 * Math.sin(t * 13), dy: FL - 30 - 5 * Math.abs(Math.sin(t * 21)), bend: 'down' },
    ikL: { w: 1, to: 'abs', dx: 1470, dy: FL - 18, bend: 'down' } });
  const noteP = t => ({ ...POSE.h2_pSit, lean: 4, tilt: 7, armScale: 1.05, armL: [30, 40],
    ikR: { w: 1, to: 'desk', dx: 6 + 10 * Math.sin(t * 7.5), dy: -2 - 3 * Math.abs(Math.sin(t * 15)), bend: 'down' } });
  Object.assign(POSE, {
    h2_pHoldUp: { lean: -2, tilt: -5, armScale: 1.2, ikR: { w: 1, to: 'abs', dx: 532, dy: 452, bend: 'down' }, armL: [14, 12] },
  });
  const hopOff = t => { const u = clamp((t - HOP_T) / 0.4); return [lerp(TX, NEXT_X, u), lerp(STOOL, FL, EASE.in(u)) - Math.sin(Math.PI * u) * 70]; };

  defineScene({
    id: 'handwave', dur: 29.6, floor: FL,
    cast: {
      prof: { H: 440, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'h2_prof', glasses: true, desk: [500, TOP - 4], blink: [4.0, 1.3] },
      terry: { H: 245, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9], z: 12, desk: [1120, TOP - 4] },
    },
    order: ['prof', 'terry'],
    tracks: {
      terry: {
        pos: [[0, [TX, STOOL - 6]], [W0, [TX, STOOL], 0.25], [HOP_T, hopOff, 0], [HOP_T + 0.4, [NEXT_X, FL], 0]],
        pose: [[0, 'stand'], [G0, gestPose, 0.2], [G1, 'stand', 0.25], [W0, 'sitHands', 0.25], [W0 + 0.3, writeT, 0.2], [16.4, 'sitHands', 0.2],
          [HOP_T, 'jumpUp', 0.1], [HOP_T + 0.38, 'crouch', 0.08], [HOP_T + 0.6, crouchW, 0.2]],
        squash: [[0, 1], [G0, t => 1 + 0.05 * Math.sin((t - G0) * 2 * Math.PI * 2.5), 0.1], [G1, 1, 0.2],
          [HOP_T - 0.1, 0.88, 0.08], [HOP_T, 1.08, 0.1], [HOP_T + 0.4, 0.86, 0.06], [HOP_T + 0.46, 1, 0.2, 'back']],
        face: [[0, 'grin'], [G0, t => (Math.floor(t * 3) % 2 ? { mouth: 'o', eyeSY: 1.08, brow: 'arc' } : { mouth: 'grin', mw: 0.44, brow: 'arc' })], [G1, 'smile', 0.05],
          [W0 + 0.3, 'focus', 0.05], [16.4, 'proud', 0.05], [HOP_T, 'grin', 0.05], [HOP_T + 0.6, 'focus', 0.05]],
        turn: [[0, -0.45], [HOP_T + 0.4, 0.45, 0.15]],
        gaze: [[0, 'prof'], [W0 + 0.2, 'paper'], [16.4, 'viewer'], [HOP_T + 0.4, [1510, FL - 20]]],
      },
      prof: {
        pos: [[0, [PX, SEATP]], [HOLD_T - 0.15, [PX, FL], 0.3]],
        pose: [[0, noteP], [3.2, 'h2_pSit', 0.3], [HOLD_T - 0.15, 'stand', 0.3], [HOLD_T + 0.1, 'h2_pHoldUp', 0.35]],
        face: [[0, 'focus'], [3.2, 'neutral', 0.05], [6.0, 'surprised', 0.05], [8.6, 'puzzled', 0.05], [13.0, 'neutral', 0.05],
          [HOLD_T + 0.4, 'puzzled', 0.05], [23.0, 'surprised', 0.05], [24.2, 'puzzled', 0.05]],
        turn: [[0, 0.45], [HOLD_T + 0.4, 0.2, 0.2], [23.0, 0.5, 0.15]],
        gaze: [[0, 'pad'], [3.2, 'terry'], [G0 + 0.4, 'hands'], [G1, 'terry'], [W0 + 0.4, 'paper'], [HOLD_T + 0.4, 'sheet'], [21.0, 'viewer'], [23.0, 'terry']],
      },
    },
    targets: F => {
      const a = F.anchors.terry, h = a ? lerp2(a.handL, a.handR, 0.5) : [TX, 420];
      return { hands: h, pad: [510, TOP - 10], paper: [1130, TOP - 8], sheet: [730, 300] };
    },
    set: [
      { type: 'floor' },
      { type: 'chair', x: PX, seat: SEATP, full: true },
      { type: 'desk', x: 820, top: TOP, w: 700 },
      { type: 'stool', x: TX, seat: STOOL },
    ],
    fx: [
      { type: 'ageStamp', age: 8, t0: -3, center: [800, 360], R: 150, dockT: -2, dock: [1486, 108], dockScale: 0.46 },
      { type: 'h2_pad', id: 'pad', t0: -1, at: [510, TOP] },
      { type: 'h2_arcs', id: 'arcs', t0: G0 + 0.2, t1: G1 },
      { type: 'h2_blah', id: 'blah' },
      { type: 'mark', id: 'huh', char: '?', on: ['prof'], t0: 9.0, t1: 12.7, dx: 40 },
      { type: 'label', id: 'lbWave', text: ['挥手论证：', '用比划代替道理'], at: [720, 190], rot: -3, t0: 8.2, t1: 12.8, target: { char: 'terry', part: 'handL' }, bend: -0.2, gap: 20, size: 50 },
      { type: 'h2_solution', id: 'sol', t0: W0 + 0.1 },
      { type: 'qm', id: 'qm', size: 170, t0: 19.9, pos: [[0, [962, TOP - 2]]], z: Z.fx - 0.5,
        act: [[0, 'idle'], [22.9, 'hop'], [23.8, 'idle']],
        mood: [[0, 'surprised'], [20.5, 'neutral']],
        gaze: [[0, [700, 330]], [22.9, 'terry']],
        tilt: [[0, 0], [20.4, 8, 0.3]],
        sign: [[0, null], [20.4, '过程呢？']],
        sfxAt: [[19.9, 'boing'], [20.4, 'pop']] },
      { type: 'h2_pile', id: 'pile', t0: HOP_T - 0.3 },
      { type: 'speedLines', id: 'zip', char: 'terry', part: 'handR', t0: HOP_T + 0.7, t1: 27.8 },
      { type: 'label', id: 'lbNext', text: ['下一题！', '（检查？跳过！）'], at: [1330, 320], rot: -3, t0: 23.0, t1: 29.6, target: { char: 'terry', part: 'headTop' }, bend: 0.2, gap: 16, size: 44 },
    ],
    sfx: [[G0, 'whip'], [W0, 'thud'], [16.4, 'ding'], [HOP_T, 'hop'], [HOP_T + 0.4, 'thud']],
    subs: [
      { t0: 0.2, t1: 3.3, text: '教授还发现了几件事：' },
      { t0: 3.4, t1: 7.9, text: '小陶讲题的时候，喜欢用手比划。' },
      { t0: 8.0, t1: 12.8, text: '数学家管这个叫——“挥手论证”。' },
      { t0: 12.9, t1: 17.9, text: '让他把解答写在纸上，他只写一点点，' },
      { t0: 18.0, t1: 22.8, text: '刚好能让人相信他会做，就停笔了。' },
      { t0: 22.9, t1: 28.2, text: '做完了也不爱检查，更想赶紧做下一题。' },
    ],
  });
})();
