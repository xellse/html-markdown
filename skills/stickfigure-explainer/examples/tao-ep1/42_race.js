// 小问号登场（二）：脑子 vs 手 的赛跑。脑子（带着小陶的头发）一溜烟到了终点，手还在起点慢慢写。
(() => {
  const GY = 690;                       // the track (ground line)
  const START_X = 120, FIN_X = 1090;    // flag poles
  const B0 = [330, 262], B1 = [1262, 606], LAUNCH = 1.25, ARRIVE = 1.75;
  const FLAG_X = 1420, FLAG_T = 2.05;

  /* ---------- brain-rocket position (pure function of t) ---------- */
  const brainPos = t => {
    if (t < LAUNCH) return [B0[0], B0[1] + Math.sin(t * 2 * Math.PI * 1.4) * 6 - clamp((t - LAUNCH + 0.3) / 0.3) * 10];
    if (t < ARRIVE) { const u = EASE.io((t - LAUNCH) / (ARRIVE - LAUNCH)); return [lerp(B0[0], B1[0], u), lerp(B0[1], B1[1], u * u) - Math.sin(Math.PI * u) * 40]; }
    return B1;
  };
  const brainSq = t => {
    if (t >= LAUNCH - 0.25 && t < LAUNCH) return 0.86;                    // crouch before the zoom
    if (t >= LAUNCH && t < ARRIVE) return 1.0;
    const v = t - ARRIVE; if (v >= 0 && v < 0.35) return 1 - 0.2 * Math.sin(Math.PI * v / 0.35) * (1 - v / 0.35 * 0.3); // landing squash
    return 1 + 0.03 * Math.sin(t * 2 * Math.PI * 1.2);                    // breathing
  };

  /** the brain with Terry's tuft, tiny arms, a rocket nozzle. Local: centre of brain, ~170 x 120. */
  function drawBrain(key, t, flying, holdFlag) {
    const z = Z.front, w = 5;
    // lumpy outline (a cloud of bumps)
    const pts = [];
    for (let i = 0; i < 36; i++) {
      const a = i / 36 * Math.PI * 2, bump = 1 + 0.07 * Math.abs(Math.sin(a * 4.5));
      pts.push([Math.cos(a) * 86 * bump, Math.sin(a) * 60 * bump - (Math.sin(a) < 0 ? 4 : 0)]);
    }
    stroke(key + '.o', pts, { z, w, closed: true, fill: C.paper });
    // folds: a middle fissure and a few squiggles (behind the face)
    stroke(key + '.f0', [[-4, -60], [4, -40], [-6, -22], [2, -6]], { z, w: 3.4 });
    stroke(key + '.f1', [[-66, -24], [-48, -38], [-30, -28], [-40, -12]], { z, w: 3.2 });
    stroke(key + '.f2', [[34, -40], [52, -30], [68, -38]], { z, w: 3.2 });
    stroke(key + '.f3', [[-70, 22], [-54, 34], [-40, 26]], { z, w: 3.2 });
    stroke(key + '.f4', [[46, 28], [62, 18], [72, 30]], { z, w: 3.2 });
    // Terry's tuft on top
    HAIR.tuft(flying ? 0.35 : 0, flying ? -0.25 : 0).forEach((h, i) => stroke(key + '.t' + i, h.map(p => [p[0] * 62 + 4, (p[1] + 0.97) * 62 - 58]), { z, w: 5 }));
    // face: happy, determined
    [-1, 1].forEach((s, i) => {
      stroke(key + '.e' + i, ringPts(key + '.e' + i, s * 22, 4, 13, 16, { n: 10, closed: true }), { z, w: 3.8, closed: true, fill: C.paper });
      dot(key + '.p' + i, [s * 22 + (flying ? 4 : 2), 7], 5.5, C.ink, z);
    });
    stroke(key + '.m', [[-14, 34], [0, 44], [14, 34]], { z, w: 4 });
    // arms
    stroke(key + '.aL', [[-70, 30], [-94, 40], [-104, 30]], { z, w: 4.5 });
    const hR = holdFlag || [100, 34];
    stroke(key + '.aR', [[70, 30], [(70 + hR[0]) / 2 + 6, hR[1] + 10], hR], { z, w: 4.5 });
    // rocket nozzle on the back, flame while flying
    stroke(key + '.nz', [[-84, -16], [-110, -24, 1], [-110, 24, 1], [-84, 16]], { z: z - 0.5, w: 4.5, fill: C.paper });
    if (flying) {
      const f = 1 + 0.25 * Math.sin(t * 60);
      stroke(key + '.fl', [[-112, -18], [-150 * f, -10], [-132, 0], [-168 * f, 8], [-112, 18]], { z: z - 0.5, w: 4 });
    }
  }
  PROPS.q1_brain = (fx, t) => {
    const flying = t >= LAUNCH - 0.05 && t < ARRIVE + 0.05;
    const sq = brainSq(t);
    DL.about(0, 64, () => DL.scale(1 + (1 - sq) * 0.6, sq)); // squash about the bottom
    const hold = t >= FLAG_T - 0.25 ? [118, lerp(-40, 30, EASE.io(clamp((t - FLAG_T + 0.25) / 0.25)))] : null;
    DL.scale(1.3);
    drawBrain('q1br', t, flying, hold);
  };
  /** speed lines + dust behind the brain */
  COMP.q1_zoom = {
    draw(fx, t) {
      if (t < LAUNCH || t > ARRIVE + 0.55) return;
      const p = brainPos(Math.min(t, ARRIVE)), fade = 1 - clamp((t - ARRIVE) / 0.55);
      [-36, -6, 26, 52].forEach((dy, i) => {
        const x1 = p[0] - 190 - i * 14, len = t < ARRIVE ? 180 + i * 40 : 120;
        stroke('q1z' + i, [[x1 - len, p[1] + dy], [x1, p[1] + dy]], { z: Z.fx, w: 4, opacity: fade, boil: 0.6 });
      });
      // dust puffs left at the start
      const u = clamp((t - LAUNCH) / 0.6);
      [0, 1, 2].forEach(i => stroke('q1d' + i, ringPts('q1d' + i, B0[0] - 150 + i * 40, B0[1] + 40 - i * 10, 18 + u * 14, 12 + u * 8, { n: 9, closed: true }), { z: Z.fx, w: 3, closed: true, opacity: 1 - u }));
    },
    cues: () => [[LAUNCH, 'whoosh'], [LAUNCH + 0.02, 'zip'], [ARRIVE, 'thud']],
  };
  /** race flags: red pole + pennant with a word */
  PROPS.q1_flag = (fx, t, lt, p) => {
    const z = Z.set + 2, col = fx.color === 'ink' ? C.ink : C.red, H = fx.h || 300, fw = fx.fw || 130;
    stroke(fx.id + '.pole', [[0, 0], [2, -H]], { z, w: 6, color: col, draw: clamp(p * 2) });
    const fp = clamp(p * 2 - 1);
    if (fp > 0) {
      stroke(fx.id + '.cloth', [[2, -H], [fw, -H + 8, 1], [fw - 14, -H + 36], [fw, -H + 64, 1], [2, -H + 64]], { z, w: 5, color: col, fill: C.paper, draw: fp });
      if (fx.word) text(fx.id + '.w', fx.word, fw / 2 - 4, -H + 33, { size: 40, color: col, z: z + 0.5, opacity: clamp(fp * 2 - 1) });
    }
  };
  /** the x = 7 flag the brain plants beyond the finish */
  PROPS.q1_goal = (fx, t, lt) => {
    const drop = EASE.in(clamp(lt / 0.18)), z = Z.front;
    DL.translate(0, (1 - drop) * -70);
    stroke('q1g.pole', [[0, 0], [1, -170]], { z, w: 5 });
    stroke('q1g.cloth', [[1, -170], [138, -166, 1], [138, -106, 1], [1, -110]], { z, w: 4.5, fill: C.paper });
  };

  /* ---------- the tired hand holding a pencil ---------- */
  // pencil tip follows the slow writing '3x + 5 ...'; the hand (a fist with a sleeve, and a tired little face) pants
  function drawHand(tip, t, done) {
    const z = Z.front, pant = Math.sin(t * 2 * Math.PI * (done ? 2.4 : 1.8));
    DL.save(); DL.translate(tip[0], tip[1]); DL.rotate(30 + pant * 2.5); DL.scale(1.3);
    // pencil: tip at origin, body going up
    stroke('q1p.tip', [[0, 0], [-11, -34, 1], [11, -34, 1], [0, 0]], { z, w: 4, fill: C.paper });
    stroke('q1p.lead', [[0, 0], [-3.5, -10, 1], [3.5, -10, 1], [0, 0]], { z: z + 0.1, w: 3.5, fill: C.ink });
    stroke('q1p.body', [[-11, -34], [-11, -176, 1], [11, -176, 1], [11, -34]], { z, w: 4.5, fill: C.paper });
    stroke('q1p.hex', [[0, -40], [0, -60]], { z, w: 2.4, color: C.pencil });
    stroke('q1p.hex2', [[0, -150], [0, -170]], { z, w: 2.4, color: C.pencil });
    stroke('q1p.fer', [[-12, -176], [-12, -196, 1], [12, -196, 1], [12, -176]], { z, w: 4, fill: C.paper });
    stroke('q1p.fer2', [[-12, -186], [12, -186]], { z, w: 2.6 });
    stroke('q1p.eras', [[-11, -196], [-10, -214], [0, -220], [10, -214], [11, -196]], { z, w: 4, fill: C.paper });
    const hy = pant * 2;
    // sleeve + forearm going off up-right
    stroke('q1h.arm', [[40, -150 + hy], [92, -236 + hy], [134, -212 + hy], [78, -120 + hy]], { z: z + 0.1, w: 5, fill: C.paper });
    stroke('q1h.cuff', [[84, -222 + hy], [118, -202 + hy]], { z: z + 0.15, w: 3.4 });
    // fist: back of the hand on the right of the pencil
    stroke('q1h.back', [[8, -140 + hy], [44, -150 + hy], [80, -128 + hy], [86, -92 + hy], [70, -62 + hy], [30, -54 + hy], [6, -62 + hy]], { z: z + 0.2, w: 5, fill: C.paper });
    // curled fingers wrapping round the front of the pencil (three knuckle bumps)
    [0, 1, 2].forEach(i => {
      const y0 = -66 - i * 24 + hy;
      stroke('q1h.k' + i, [[8, y0 + 4], [-14, y0 + 2], [-20, y0 - 10], [-12, y0 - 20], [8, y0 - 20]], { z: z + 0.25, w: 4.5, fill: C.paper });
    });
    // thumb over the top
    stroke('q1h.th', [[10, -140 + hy], [-8, -150 + hy], [-18, -140 + hy], [-8, -128 + hy], [12, -126 + hy]], { z: z + 0.25, w: 4.5, fill: C.paper });
    // tired face on the back of the hand
    [-1, 1].forEach((s, i) => stroke('q1h.e' + i, [[48 + s * 14 - 6, -112 + hy], [48 + s * 14 + 6, -109 + hy]], { z: z + 0.3, w: 3.6 }));
    const mo = 0.5 + 0.5 * Math.abs(pant);
    stroke('q1h.m', ringPts('q1h.m', 48, -86 + hy, 5, 3 + 6 * mo, { n: 8, closed: true }), { z: z + 0.3, w: 3.2, closed: true, fill: C.paper });
    DL.restore();
    // sweat drops flying off (two, on a loop)
    [0, 1].forEach(i => {
      const ph = ((t * 0.9 + i * 0.5) % 1), o = Math.sin(Math.PI * ph);
      const c = [tip[0] + 150 + ph * 70 + i * 16, tip[1] - 250 + ph * ph * 90 - i * 18];
      stroke('q1s' + i, [[c[0], c[1] - 16], [c[0] + 9, c[1] + 2], [c[0], c[1] + 9], [c[0] - 9, c[1] + 2], [c[0], c[1] - 16]], { z: Z.fx, w: 3.4, fill: C.paper, opacity: o });
    });
    // panting puffs
    const pp = (t * 1.8) % 1;
    if (pp < 0.5) [0, 1].forEach(i => stroke('q1pf' + i, [[tip[0] + 196 + i * 12 + pp * 30, tip[1] - 100 - i * 16], [tip[0] + 218 + i * 12 + pp * 40, tip[1] - 106 - i * 16]], { z: Z.fx, w: 3, opacity: 1 - pp * 2 }));
  }
  const SLOW = { id: 'q1slow', text: '3x + 5 ...', x: 196, y: GY - 58 - 12, size: 58, t0: 1.55, speed: 170, gap: 0.22, glyphGap: 0.28, w: 5, sfx: 'pen' };
  const SLOWL = layoutWriting({ ...SLOW });
  PROPS.q1_hand = (fx, t) => {
    const done = t >= SLOWL.tEnd;
    const tip = t < SLOW.t0 ? SLOWL.strokes[0].pts[0] : penAt(SLOWL, Math.min(t, SLOWL.tEnd - 0.001));
    drawHand(tip, t, done);
  };

  /* ---------- thought cloud contents ---------- */
  const TH = { at: [1290, 220], rx: 250, ry: 92 };
  const TW1 = { id: 'q1th1', text: '3x = 21', x: 1092, y: 194, size: 50, t0: 5.75, speed: 1400, w: 4.5, z: Z.fx + 1, sfx: 'pen' };
  const TW1L = layoutWriting({ ...TW1 });
  const TW2 = { id: 'q1th2', text: 'x = 7', x: TW1L.xEnd + 88, y: 194, size: 50, t0: TW1L.tEnd + 0.45, speed: 1400, w: 4.5, z: Z.fx + 1, sfx: 'pen' };
  COMP.q1_thArrow = {
    draw(fx, t) {
      if (t < fx.t0) return;
      arrow('q1tha', [TW1L.xEnd + 8, 224], [TW1L.xEnd + 70, 224], { p: EASE.out(clamp((t - fx.t0) / 0.3)), bend: 0.12, color: C.ink, w: 4, z: Z.fx + 1, head: 16 });
    },
  };

  defineScene({
    id: 'race', dur: 10.3, floor: GY,
    fx: [
      // the track: a pencil ground line with little lane ticks
      { type: 'prop', kind: 'q1_track', id: 'trk', t0: 0, at: [0, 0], drawDur: 0.5, sfxAt: [[0.02, 'swish']] },
      { type: 'prop', kind: 'q1_flag', id: 'fS', word: '起点', t0: 0.2, at: [START_X, GY], drawDur: 0.4, sfxAt: [[0.3, 'pop']] },
      { type: 'prop', kind: 'q1_flag', id: 'fF', word: '终点', t0: 0.45, at: [FIN_X, GY], drawDur: 0.4, sfxAt: [[0.55, 'pop']] },
      { type: 'write', ...SLOW },
      { type: 'prop', kind: 'q1_hand', id: 'hand', t0: 0.6, at: [0, 0], drawDur: 0 },
      { type: 'prop', kind: 'q1_brain', id: 'brain', t0: 0.6, pos: [[0, brainPos]], drawDur: 0, sfxAt: [[0.6, 'boop']] },
      { type: 'q1_zoom', id: 'zoom' },
      { type: 'prop', kind: 'q1_goal', id: 'goal', t0: FLAG_T, at: [FLAG_X, GY], drawDur: 0, sfxAt: [[FLAG_T + 0.16, 'thud']] },
      { type: 'write', id: 'q1gw', text: 'x = 7', x: FLAG_X + 14, y: GY - 162, size: 44, t0: FLAG_T + 0.22, speed: 2400, w: 4.5, z: Z.front + 1, sfx: 'pen', endSfx: 'ding' },
      { type: 'label', id: 'lbBrain', text: '脑子：已经到终点', at: [1250, 300], rot: -3, t0: 2.2, t1: 5.3, target: [1262, 505], bend: -0.2, gap: 14 },
      { type: 'label', id: 'lbHand', text: '手：还在起点', at: [640, 290], rot: 3, t0: 2.9, t1: 5.5, target: { target: 'hand' }, bend: 0.25, gap: 16 },
      { type: 'thought', id: 'q1cloud', at: TH.at, rx: TH.rx, ry: TH.ry, t0: 5.4, t1: 10.3, from: [1266, 512] },
      { type: 'write', ...TW1 },
      { type: 'q1_thArrow', id: 'tha', t0: TW1L.tEnd + 0.1 },
      { type: 'write', ...TW2 },
      { type: 'label', id: 'lbOnly', text: '这些，只有他自己看得见', at: [760, 190], rot: -2, t0: 6.9, t1: 10.2, target: [1036, 220], bend: -0.2, gap: 8 },
    ],
    targets: F => ({ hand: [SLOWL_tip(F.t)[0] + 150, SLOWL_tip(F.t)[1] - 210] }),
    subs: [
      { t0: 0.2, t1: 4.9, text: '小陶的脑子跑得飞快，手却懒得跟上。' },
      { t0: 5.0, t1: 9.8, text: '答案写出来了，想法却还藏在脑子里。' },
    ],
  });
  function SLOWL_tip(t) { return t < SLOW.t0 ? SLOWL.strokes[0].pts[0] : penAt(SLOWL, Math.min(t, SLOWL.tEnd - 0.001)); }

  PROPS.q1_track = (fx, t, lt, p) => {
    stroke('q1t.g', [[80, GY], [800, GY + 2], [1540, GY - 1]], { z: Z.set, w: 4, draw: p });
    for (let i = 0; i < 12; i++) {
      const x = 130 + i * 118;
      stroke('q1t.k' + i, [[x, GY + 16], [x + 40, GY + 17]], { z: Z.set, w: 2.4, color: C.pencil, opacity: 0.8, draw: clamp(p * 1.5 - i * 0.04) });
    }
    // chequered finish line on the ground
    stroke('q1t.fin', [[FIN_X, GY - 4], [FIN_X, GY + 30]], { z: Z.set, w: 5, color: C.red, draw: p });
  };
})();
