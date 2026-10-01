// 第 3 集 · 埃尔德什（10 岁，1985 年，阿德莱德）
// 事实（ep3-script.md）：1985 年埃尔德什到阿德莱德，和 10 岁的陶哲轩一起看题，留下了著名的照片；
//   陶哲轩 2019 年回忆（Princeton Alumni Weekly）："he spoke to me like an adult, like an equal."；
//   埃尔德什没有固定的家，拎着手提箱到处找人合作，管小孩叫 epsilon（Hoffman 1998）；
//   那天看的题是 Erdős 问题 #587（和平方数有关）——纸上只画几个平方数，不写题目；
//   差异问题 1932 年提出，2015 年由陶哲轩证明，用到了 Polymath5 众人合作得到的约化。
// 演绎（画面上的比方，不是真实事件）：手提箱弹开、取景框、题卡从照片里飞出来、题卡沿时间线飞到陶哲轩手里、"线索"纸片。
// 拍照的做法：白闪那一刻，台上的两个人移出画面，换成两份定格的"照片里的人"（r3pE / r3pT，不在 order 里），
// 由 COMP.r3_photo 在照片自己的坐标系里画（DL 变换），所以整张照片可以连人带桌子一起缩小、挪到角落。
(() => {
  const FL = 780;
  const EX = 620, EX2 = 670, TX = 1030;                        // Erdős stops at EX, steps up to the table (EX2); Terry stands at TX
  const DESK = { x: 830, top: 660, w: 260 };
  const PAPER = [868, 654];                                    // the problem sheet lying on the table
  /* ---------------- times (scene clock) ---------------- */
  const WALK0 = 1.3, WALK1 = 4.0;
  const HOUSE_T = 7.9, HOUSE_X = 8.45, HOUSE_T1 = 9.35;
  const PUT0 = 9.3, PUT1 = 9.65, OPEN0 = 10.0, CLOSE0 = 12.25;
  const BEND = 12.85, EPS0 = 16.2, SHRINK = 18.9, LENS = 19.3, EPS_T1 = 21.25;
  const OPEN1 = 21.35, FLY0 = 21.45, FLY1 = 21.95, CLOSE1 = 22.3, LOOK = 21.85, POINT = 22.25;
  const INSET0 = 22.45, INSET1 = 25.1;
  const VF0 = 25.2, FLASH = 26.6, SHR0 = 27.6, SHR1 = 28.2, TAPE = [28.32, 28.48], Y85 = 28.62;
  const QUOTE = [31.45, 32.45, 33.65], ULINE = 33.4;
  const C0 = 35.6, C1 = 36.1;                                  // the photo moves to the corner
  const TWALK0 = 35.6, TWALK1 = 36.4, TCX = 150;               // Terry walks back in (part 3)
  const TL0 = 39.6, TL_Y = 560, TL_X0 = 330, TL_X1 = 1250, TL_END = 1300;
  const M_ENTER = 40.1, QM_T = 41.3;
  const PICK0 = 44.1, PIN0 = 44.6, PIN1 = 45.15, Y32 = 45.35;
  const TRAV0 = 47.8, TRAV1 = 49.4, TAO_IN = 48.5, Y15 = 49.0, BULB = 50.9, CHECK = 51.15;
  const NOTE = 51.6, CLUE0 = 51.75, RELAX = 52.8, SMILE = 53.0, GRIN = 54.1;
  const DUR = 56.2;

  /* ---------------- sounds ---------------- */
  SFX.define('r3_click', (tone, noise) => {           // camera shutter: two short mechanical clacks
    noise('highpass', 2800, 0.8, 0.022, 0.42); tone('square', 1900, 1500, 0.014, 0.05);
    noise('bandpass', 1500, 1.4, 0.05, 0.32, null, 0.075); tone('square', 900, 700, 0.02, 0.05, null, 0.075);
  });
  SFX.define('r3_charge', tone => { tone('sine', 900, 3400, 0.28, 0.035); });    // flash charging whine
  SFX.define('r3_latch', tone => { tone('square', 1300, 900, 0.025, 0.06); tone('square', 1200, 850, 0.025, 0.06, null, 0.07); });
  SFX.define('r3_shrink', tone => { tone('sine', 1500, 240, 0.28, 0.16); });
  SFX.define('r3_tape', (tone, noise) => { noise('bandpass', 1800, 0.9, 0.08, 0.12, 700); });

  /* ---------------- poses ---------------- */
  const CARRY = { w: 1, to: 'hip', dx: -44, dy: 10, bend: 'down' };          // the hand holding the suitcase
  const CW = 104, CHT = 62, CHANDLE = 12, CASE_F = [500, FL];
  Object.assign(POSE, {
    r3_carry: { armR: [14, 10], ikL: CARRY },
    r3_put: { lean: -14, tilt: -10, legL: [14, -26], legR: [8, -14], armScale: 1.2, armR: [30, 20],
      ikL: { w: 1, to: 'hip', dx: CASE_F[0] - EX, dy: 60, bend: 'down' } },   // hip-relative, so it blends smoothly from CARRY
    r3_bendPoint: { lean: 22, tilt: 14, legL: [10, -6], legR: [6, -10], armScale: 1.2, armR: [84, 4], armL: [26, 18] },
    r3_bendLook: { lean: 34, tilt: 18, legL: [12, -10], legR: [6, -14], armL: [34, 16], ikR: { w: 1, to: 'abs', dx: 762, dy: 657, bend: 'down' } },
    r3_tHuh: { tilt: -8, armScale: 1.4, armL: [55, 75], armR: [55, 75] },
    r3_tPoint: { lean: -5, tilt: -10, armScale: 1.55, armR: [16, 10], ikL: { w: 1, to: 'abs', dx: 896, dy: 650, bend: 'down' } },
    // the grown-up mathematicians on the timeline (stuck)
    r3_mScratchR: { tilt: 8, armScale: 1.15, ikR: { w: 1, to: 'head', dx: 0.95, dy: -0.9, bend: 'out' }, ikL: { w: 1, to: 'hip', dx: -18, dy: -4, bend: 'out' } },
    r3_mScratchL: { tilt: -8, armScale: 1.15, ikL: { w: 1, to: 'head', dx: -0.95, dy: -0.9, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 18, dy: -4, bend: 'out' } },
    r3_mChin: { tilt: -6, armScale: 1.1, ikL: { w: 1, to: 'chin', dx: -0.15, dy: 0.05, bend: 'down' }, ikR: { w: 1, to: 'hip', dx: 18, dy: -4, bend: 'out' } },
    r3_mHead: { armScale: 1.15, ikL: { w: 1, to: 'head', dx: -0.9, dy: -0.75, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 0.9, dy: -0.75, bend: 'out' } },
    r3_mRelax: { armL: [18, 12], armR: [18, 12] },
  });
  const HAND_T = [1250, 540];                                  // grown-up Tao's hand, held out (catches the card)
  POSE.r3_catch = { lean: -6, tilt: -6, armScale: 1.1, armR: [16, 10], ikL: { w: 1, to: 'abs', dx: HAND_T[0], dy: HAND_T[1], bend: 'out' } };
  const walkE = t => ({ ...makeWalk(WALK0, WALK1, 4.4, { lean: 5 })(t), ikL: CARRY });

  /* ---------------- the suitcase (whole worldly goods) ---------------- */
  const caseBottom = (t, F) => {
    const a = F.anchors.erdos, carried = a ? [a.handL[0], a.handL[1] + CHANDLE + CHT] : [-300, FL];
    if (t < PUT0) return carried;
    const u = EASE.io(clamp((t - PUT0) / (PUT1 - PUT0)));
    return lerp2(carried, CASE_F, u);
  };
  const openAt = t => Math.max(clamp((t - OPEN0) / 0.16) * (1 - clamp((t - CLOSE0) / 0.14)), clamp((t - OPEN1) / 0.12) * (1 - clamp((t - CLOSE1) / 0.14)));
  function drawCase(k, x, y, open, rise, z, t) {
    const W = CW, H = CHT;
    if (open > 0.02) {
      const lh = 56 * open;
      stroke(k + '.lid', [[x - W / 2, y - H], [x - W / 2 + 8, y - H - lh, 1], [x + W / 2 - 8, y - H - lh, 1], [x + W / 2, y - H]], { z: z - 0.4, w: 4.5, fill: C.paper });
      // a shirt …
      DL.save(); DL.translate(x - 30, y - H + 8 - rise * 0.75); DL.rotate(-14);
      stroke(k + '.shirt', [[-12, -26], [-28, -18, 1], [-38, -4, 1], [-26, 3, 1], [-20, -5, 1], [-20, 26, 1], [20, 26, 1], [20, -5, 1], [26, 3, 1], [38, -4, 1], [28, -18, 1], [12, -26, 1], [6, -19], [0, -17], [-6, -19], [-12, -26]], { z: z - 0.2, w: 3.5, fill: C.paper });
      DL.restore();
      // … and a pile of papers full of maths
      [[-2, -6], [12, 4], [26, 13], [38, 22]].forEach(([dx, r], i) => {
        if (i === 3 && t >= FLY0) return;                     // the top sheet hops out: that's the problem they look at
        DL.save(); DL.translate(x + 14 + dx, y - H + 10 - rise * (0.7 + i * 0.12)); DL.rotate(r);
        stroke(k + '.pp' + i, [[-24, -32], [24, -32, 1], [24, 32, 1], [-24, 32, 1], [-24, -32, 1]], { z: z - 0.3 + i * 0.01, w: 3, fill: C.paper });
        [[-14, -20, 10], [-14, -10, 2], [-14, 0, 12]].forEach(([sx, sy, len], j) => {
          const pts = []; for (let q = 0; q <= 5; q++) pts.push([sx + q * (len + 12) / 5, sy + (q % 2 ? -3 : 2)]);
          stroke(k + '.pp' + i + 's' + j, pts, { z: z - 0.29 + i * 0.01, w: 2, boil: 0.7 });
        });
        DL.restore();
      });
      // a sock hanging over the front edge
      stroke(k + '.sock', [[x + 34, y - H + 2], [x + 38, y - H + 26 * Math.min(1, rise / 30)], [x + 52, y - H + 30 * Math.min(1, rise / 30), 1], [x + 50, y - H + 18 * Math.min(1, rise / 30)], [x + 46, y - H + 2]], { z: z + 0.3, w: 3.2, fill: C.paper });
    }
    stroke(k + '.body', [[x - W / 2, y], [x - W / 2, y - H, 1], [x + W / 2, y - H, 1], [x + W / 2, y, 1], [x - W / 2, y, 1]], { z, w: 5, fill: C.paper });
    stroke(k + '.band', [[x - W / 2 + 4, y - H + 22], [x + W / 2 - 4, y - H + 22]], { z: z + 0.1, w: 2.6 });
    if (open <= 0.02) stroke(k + '.handle', [[x - 20, y - H], [x - 16, y - H - CHANDLE - 2], [x + 16, y - H - CHANDLE - 2], [x + 20, y - H]], { z, w: 4.5 });
    [-1, 1].forEach(s => stroke(k + '.latch' + s, [[x + s * 38 - 7, y - H + 14], [x + s * 38 + 7, y - H + 14, 1], [x + s * 38 + 7, y - H + 28, 1], [x + s * 38 - 7, y - H + 28, 1], [x + s * 38 - 7, y - H + 14, 1]], { z: z + 0.2, w: 2.8, fill: C.paper }));
  }
  COMP.r3_case = {
    draw(fx, t, F) {
      if (t >= FLASH) return;
      const b = caseBottom(t, F), open = openAt(t);
      const rise = Math.max(44 * EASE.back(clamp((t - OPEN0 - 0.04) / 0.3)) * (1 - clamp((t - CLOSE0) / 0.12)), 30 * clamp((t - OPEN1) / 0.15) * (1 - clamp((t - CLOSE1) / 0.12)));
      drawCase('r3case', b[0], b[1], open, rise, Z.front + 1, t);
    },
    cues: () => [[PUT1, 'thud'], [OPEN0, 'r3_latch'], [OPEN0 + 0.05, 'boing'], [CLOSE0, 'r3_latch'], [OPEN1, 'r3_latch'], [CLOSE1, 'r3_latch']],
  };
  /** the problem sheet: hops out of the suitcase onto the table, then lies there */
  const FLY_FROM = [CASE_F[0] + 52, FL - CHT - 40];
  const paperPos = t => {
    const u = clamp((t - FLY0) / (FLY1 - FLY0));             // up first (clear of Erdős's head), then across
    return [lerp(FLY_FROM[0], PAPER[0], u * u), lerp(FLY_FROM[1], PAPER[1] - 4, u) - Math.sin(Math.PI * u) * 480];
  };
  function sheetFlat(k, z) {
    const [x, y] = PAPER;
    stroke(k, [[x - 42, y + 5], [x - 34, y - 6, 1], [x + 44, y - 6, 1], [x + 38, y + 5, 1], [x - 42, y + 5, 1]], { z, w: 4, fill: C.paper });
  }
  COMP.r3_paper = {
    draw(fx, t) {
      if (t < FLY0 || t >= FLASH) return;
      if (t >= FLY1) { sheetFlat('r3sheet', Z.desk + 1); return; }
      const u = clamp((t - FLY0) / (FLY1 - FLY0)), c = paperPos(t);
      DL.save(); DL.translate(c[0], c[1]); DL.rotate(-20 + 400 * EASE.io(u)); DL.scale(1, lerp(1, 0.4, u * u));
      stroke('r3sheet', [[-26, -34], [26, -34, 1], [26, 34, 1], [-26, 34, 1], [-26, -34, 1]], { z: Z.body - 1, w: 4, fill: C.paper });   // flies behind Erdős
      DL.restore();
    },
    cues: () => [[FLY0, 'whoosh'], [FLY1, 'paper']],
  };

  /* ---------------- "他没有家" ---------------- */
  const HOUSE = [395, 330];
  COMP.r3_house = {
    draw(fx, t) {
      if (t < HOUSE_T || t >= HOUSE_T1) return;
      const lt = t - HOUSE_T, [x, y] = HOUSE, z = Z.annot - 1, p = k => EASE.out(clamp((lt - k * 0.1) / 0.2));
      stroke('r3hs.body', [[x - 46, y - 34], [x - 46, y + 44, 1], [x + 46, y + 44, 1], [x + 46, y - 34]], { z, w: 5, draw: p(0) });
      stroke('r3hs.roof', [[x - 64, y - 24], [x, y - 88, 1], [x + 64, y - 24]], { z, w: 5, draw: p(1) });
      stroke('r3hs.door', [[x - 13, y + 44], [x - 13, y + 8, 1], [x + 13, y + 8, 1], [x + 13, y + 44]], { z, w: 4, draw: p(2) });
      stroke('r3hs.chim', [[x + 24, y - 63], [x + 24, y - 84, 1], [x + 40, y - 84, 1], [x + 40, y - 47]], { z, w: 4, draw: p(2.6) });
      const a = EASE.out(clamp((t - HOUSE_X) / 0.14)), b = EASE.out(clamp((t - HOUSE_X - 0.16) / 0.14));
      stroke('r3hs.x0', [[x - 74, y - 92], [x + 74, y + 60]], { z: Z.annot, w: 8, color: C.red, draw: a });
      stroke('r3hs.x1', [[x + 74, y - 92], [x - 74, y + 60]], { z: Z.annot, w: 8, color: C.red, draw: b });
    },
    cues: () => [[HOUSE_T, 'pen'], [HOUSE_X, 'pen'], [HOUSE_X + 0.16, 'pen']],
  };

  /* ---------------- ε: big, then very very small, then under a magnifying glass ---------------- */
  const EPS = [[0.56, 0.16], [0.4, 0.03], [0.2, 0.04], [0.09, 0.2], [0.17, 0.38], [0.4, 0.47, 1], [0.15, 0.56], [0.05, 0.75], [0.14, 0.94], [0.36, 1.0], [0.6, 0.88]];
  const EPS_C = [840, 292];
  const epsPts = (cx, cy, size) => EPS.map(([u, v, c]) => [cx + (u - 0.32) * size, cy + (v - 0.5) * size, c]);
  COMP.r3_eps = {
    draw(fx, t) {
      if (t < EPS0 || t >= EPS_T1) return;
      const p = EASE.io(clamp((t - EPS0) / 0.55)), sh = EASE.in(clamp((t - SHRINK) / 0.3));
      if (sh < 1) stroke('r3eps.big', epsPts(EPS_C[0], EPS_C[1], lerp(190, 6, sh)), { z: Z.annot, w: lerp(11, 3, sh), color: C.red, draw: p, boil: 0.6 });
      else dot('r3eps.dot', EPS_C, 4, C.red, Z.annot);
      const m = t - LENS; if (m < 0) return;
      const pop = EASE.back(clamp(m / 0.25)), R = 80, z = Z.annot + 1;
      DL.save(); DL.translate(EPS_C[0], EPS_C[1]); DL.scale(pop);
      stroke('r3lens.f', ringPts('r3lens', 0, 0, R, R, { n: 16, closed: true, rv: 0.01 }), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke('r3lens.e', epsPts(0, 0, 92), { z: z + 0.1, w: 7, color: C.red, boil: 0.6 });
      stroke('r3lens.o', ringPts('r3lens', 0, 0, R, R, { n: 16, a0: -100, sweep: 368, rv: 0.01 }), { z: z + 0.2, w: 6 });
      stroke('r3lens.gl', ringPts('r3lens.gl', 0, 0, R - 16, R - 16, { n: 6, a0: 200, sweep: 50 }), { z: z + 0.2, w: 3, color: C.pencil });
      const h0 = [R * 0.72, R * 0.72], h1 = [R * 0.72 + 74, R * 0.72 + 74];
      stroke('r3lens.h', [h0, h1], { z: z + 0.2, w: 15 });
      stroke('r3lens.h2', [[h0[0] + 12, h0[1] + 12], [h1[0] - 6, h1[1] - 6]], { z: z + 0.3, w: 5, color: C.paper, boil: 0 });
      DL.restore();
    },
    cues: () => [[EPS0, 'pen'], [SHRINK, 'r3_shrink'], [LENS, 'pop']],
  };

  /* ---------------- what they looked at: a zoom-in on the sheet (a few squares; not the whole problem) ---------------- */
  const BOX = [PAPER[0] - 182, 124, PAPER[0] + 182, 330];
  COMP.r3_inset = {
    draw(fx, t) {
      if (t < INSET0 || t >= INSET1) return;
      const lt = t - INSET0, [x0, y0, x1, y1] = BOX;
      stroke('r3in.ring', ringPts('r3in.ring', PAPER[0], PAPER[1] - 1, 66, 22, { n: 12, a0: -150, sweep: 380, rv: 0.05 }), { z: Z.annot, w: 3, color: C.pencil, draw: EASE.out(clamp(lt / 0.25)) });
      stroke('r3in.line', [[PAPER[0], PAPER[1] - 25], [PAPER[0], y1]], { z: Z.annot, w: 2.6, color: C.pencil, draw: EASE.out(clamp((lt - 0.15) / 0.25)), boil: 0.5 });
      stroke('r3in.box', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z: Z.fx, w: 5, fill: C.paper, draw: EASE.out(clamp((lt - 0.3) / 0.3)) });
    },
    cues: () => [[INSET0, 'pen'], [INSET0 + 0.3, 'paper']],
  };
  const SQ = { type: 'write', id: 'r3sq', text: '1, 4, 9, 16, …', x: PAPER[0], y: 146, size: 52, anchor: 'middle', t0: INSET0 + 0.55, t1: INSET1, speed: 3400, gap: 0.015, glyphGap: 0.015, w: 5.5, z: Z.fx + 1, sfx: 'pen' };
  const BOXQ = 72, POW = 34, BOXQ_X = PAPER[0] - (writeWidth('□', BOXQ) + 4 + writeWidth('2', POW)) / 2;
  const SQB = { type: 'write', id: 'r3box', text: '□', x: BOXQ_X, y: 214, size: BOXQ, t0: layoutWriting({ ...SQ }).tEnd + 0.15, t1: INSET1, speed: 3000, w: 6, z: Z.fx + 1, sfx: 'pen' };
  const INSET_W = [SQ, SQB,
    { type: 'write', id: 'r3pow', text: '2', x: BOXQ_X + writeWidth('□', BOXQ) + 4, y: 224, size: POW, t0: layoutWriting({ ...SQB }).tEnd + 0.05, t1: INSET1, speed: 2200, w: 4.5, z: Z.fx + 1, sfx: 'pen' },
  ];

  /* ---------------- the photo ---------------- */
  const IMG = [580, 380, 1130, 786], PC = [(IMG[0] + IMG[2]) / 2, (IMG[1] + IMG[3]) / 2];
  const MS = 14, MB = 120;                                     // photo margins (photo coords): sides/top, bottom once it is a print
  const MID = [800, 236], CORNER = [212, 230];
  const photoTf = t => {
    const u = EASE.io(clamp((t - SHR0) / (SHR1 - SHR0))), v = EASE.io(clamp((t - C0) / (C1 - C0)));
    return { s: lerp(lerp(1, 0.62, u), 0.3, v), c: lerp2(lerp2(PC, MID, u), CORNER, v), rot: lerp(-2 * u, -5, v), mb: lerp(MS, MB, u) };
  };
  const toWorld = (p, t) => {
    const f = photoTf(t), r = f.rot * RAD, dx = (p[0] - PC[0]) * f.s, dy = (p[1] - PC[1]) * f.s;
    return [f.c[0] + dx * Math.cos(r) - dy * Math.sin(r), f.c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
  };
  const DATE = layoutWriting({ text: '1985', x: PC[0], y: IMG[3] + 24, size: 68, t0: Y85, speed: 2600, gap: 0.03, glyphGap: 0.03, anchor: 'middle' });
  COMP.r3_photo = {
    draw(fx, t, F) {
      if (t < FLASH) return;
      const f = photoTf(t), z = Z.set + 1, lw = 1 / Math.max(f.s, 0.5);
      DL.save(); DL.translate(f.c[0], f.c[1]); DL.rotate(f.rot); DL.scale(f.s); DL.translate(-PC[0], -PC[1]);
      const [x0, y0, x1, y1] = IMG, ox0 = x0 - MS, oy0 = y0 - MS, ox1 = x1 + MS, oy1 = y1 + f.mb;
      stroke('r3ph.sheet', [[ox0, oy0], [ox1, oy0, 1], [ox1, oy1, 1], [ox0, oy1, 1], [ox0, oy0, 1]], { z, w: 5 * lw, fill: C.paper });
      stroke('r3ph.shade', [[ox0 + 18, oy1 + 10], [ox1 + 10, oy1 + 10, 1], [ox1 + 10, oy0 + 18]], { z: z - 0.5, w: 3 * lw, color: C.pencil, opacity: 0.7, boil: 0.5 });
      stroke('r3ph.img', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z: z + 0.1, w: 2.5 * lw, color: C.pencil });
      // the picture: the two of them bent over the sheet, frozen at the click
      stroke('r3ph.floor', [[x0 + 10, FL], [x1 - 10, FL + 1]], { z: z + 0.2, w: 2.2, color: C.pencil, opacity: 0.8 });
      SETDRAW.desk({ ...DESK, open: true }, 1);
      sheetFlat('r3ph.paper', Z.desk + 1);
      ['r3pE', 'r3pT'].forEach(id => { const L = layoutChar(id, t, F); if (L) drawChar(L, F); });
      // sticky tape on the top corners, then the date written on the white strip
      TAPE.forEach((tt, i) => {
        const u = clamp((t - tt) / 0.12); if (u <= 0) return;
        const w = 132, h = 40;
        DL.save(); DL.translate(i ? ox1 - 8 : ox0 + 8, oy0 + 6); DL.rotate(i ? 36 : -36); DL.scale(lerp(1.5, 1, EASE.out(u)));
        stroke('r3ph.tape' + i, [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2 - 7, -h / 4, 1], [w / 2, 0, 1], [w / 2 - 7, h / 4, 1], [w / 2, h / 2, 1],
          [-w / 2, h / 2, 1], [-w / 2 + 7, h / 4, 1], [-w / 2, 0, 1], [-w / 2 + 7, -h / 4, 1], [-w / 2, -h / 2, 1]], { z: Z.front + 4, w: 3 * lw, color: C.pencil, fill: C.paper, opacity: 0.95 });
        DL.restore();
      });
      DATE.strokes.forEach((s, i) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke('r3ph.d' + i, s.pts, { z: Z.front + 4, w: 9, draw: q, boil: 0.55 }); });
      DL.restore();
    },
    cues: () => [[FLASH - 0.3, 'r3_charge'], [SHR0, 'whoosh'], ...TAPE.map(t => [t, 'r3_tape']), ...DATE.strokes.map(s => [s.t0, 'pen']), [C0, 'whoosh']],
  };
  /** viewfinder corners (someone is about to take a picture), with a little autofocus twitch */
  COMP.r3_vf = {
    draw(fx, t) {
      if (t < VF0 || t >= FLASH) return;
      const u = EASE.out(clamp((t - VF0) / 0.3)), af = Math.sin(Math.PI * clamp((t - (FLASH - 0.55)) / 0.25)) * 12;
      const d = 40 * (1 - u) - af, L = 50, [x0, y0, x1, y1] = IMG, yb = Math.min(y1 + d, 790);
      [[x0 - d, y0 - d, 1, 1], [x1 + d, y0 - d, -1, 1], [x1 + d, yb, -1, -1], [x0 - d, yb, 1, -1]].forEach(([x, y, sx, sy], i) =>
        stroke('r3vf' + i, [[x, y + sy * L], [x, y, 1], [x + sx * L, y]], { z: Z.annot, w: 6, opacity: clamp((t - VF0) / 0.1) }));
    },
    cues: () => [[VF0, 'boop'], [FLASH - 0.55, 'tap']],
  };
  /** the flash: the whole page goes white, then fades; comic burst lines round "咔嚓！" */
  const KA = [1292, 404];
  COMP.r3_flash = {
    draw(fx, t) {
      const u = (t - FLASH) / 0.55;
      if (u >= 0 && u < 1) stroke('r3flash', [[-40, -40], [1640, -40, 1], [1640, 940, 1], [-40, 940, 1], [-40, -40, 1]], { z: 80, fill: C.paper, noStroke: true, w: 1, opacity: Math.pow(1 - u, 1.6), boil: 0 });
      const v = (t - FLASH) / 0.6;
      if (v >= 0 && v < 1) for (let i = 0; i < 8; i++) {
        const a = (i * 45 + 10) * RAD, r0 = 120 + 70 * EASE.out(v), r1 = r0 + 36 * (1 - v) + 8;
        stroke('r3burst' + i, [[KA[0] + Math.cos(a) * r0, KA[1] + Math.sin(a) * r0 * 0.7], [KA[0] + Math.cos(a) * r1, KA[1] + Math.sin(a) * r1 * 0.7]], { z: Z.annot, w: 4, opacity: 1 - v, boil: 0.6 });
      }
    },
  };
  /** red pen underline under "like an adult" */
  const Q_SIZE = 58, Q_X = [800 - 425.5 / 2, 800 - 325.7 / 2, 800 - 361.1 / 2], Q_Y = [578, 646, 714];
  COMP.r3_uline = {
    draw(fx, t) {
      if (t < ULINE || t >= C0) return;
      const p = EASE.out(clamp((t - ULINE) / 0.35)), x0 = Q_X[1] - 4, x1 = x0 + 318, y = Q_Y[1] + 36;
      const pts = []; for (let i = 0; i <= 10; i++) pts.push([lerp(x0, x1, i / 10), y + (i % 2 ? -3 : 3) + i * 0.4]);
      stroke('r3ul', pts, { z: Z.annot, w: 5, color: C.red, draw: p });
    },
    cues: () => [[ULINE, 'pen']],
  };

  /* ---------------- Erdős's problems: cards fly out of the photo ---------------- */
  const CARDS = [[480, 200, -7, 0], [630, 250, 5, 1], [780, 198, -3, 0], [930, 246, 7, 0], [1080, 204, -6, 1]];
  const PICK = 2, KW = 116, KH = 84, PIN = [330, 474], HELD = [HAND_T[0] - 12, HAND_T[1] - 46], ARC = [[260, -150], [1500, -40]];
  const SRC = toWorld([700, 520], C1 + 1);                     // Erdős in the photo, once it sits in the corner
  const cardT = i => 36.2 + i * 0.17;
  function cardAt(i, t) {                                      // → [centre, rotation, scale] | null (pure)
    const [x, y, r] = CARDS[i], t0 = cardT(i);
    if (t < t0) return null;
    const u = EASE.out(clamp((t - t0) / 0.5));
    let c = [lerp(SRC[0], x, u), lerp(SRC[1], y, u) - Math.sin(Math.PI * u) * 90], rot = lerp(-30, r, u), sc = lerp(0.2, 1, u);
    if (i !== PICK || t < PIN0) return [c, rot, sc];
    const v = EASE.io(clamp((t - PIN0) / (PIN1 - PIN0)));
    c = [lerp(x, PIN[0], v), lerp(y, PIN[1], v) - Math.sin(Math.PI * v) * 70]; rot = lerp(r, -4, v);
    if (t < TRAV0) return [c, rot, 1];
    // cubic arc: straight up off the pin, high over the whole pile, down into Tao's hand
    const w = EASE.io(clamp((t - TRAV0) / (TRAV1 - TRAV0))), q = 1 - w, k = [q * q * q, 3 * q * q * w, 3 * q * w * w, w * w * w];
    const P = [PIN, ARC[0], ARC[1], HELD], at = j => k[0] * P[0][j] + k[1] * P[1][j] + k[2] * P[2][j] + k[3] * P[3][j];
    return [[at(0), at(1)], lerp(-4, 12, w) + Math.sin(Math.PI * w) * 24, lerp(1, 0.92, w)];
  }
  function drawCard(k, i, c, rot, sc, t) {
    const z = Z.fx + (i === PICK && t >= PIN0 ? 4 : 2), w = KW / 2, h = KH / 2;
    DL.save(); DL.translate(c[0], c[1]); DL.rotate(rot); DL.scale(sc);
    stroke(k, [[-w, -h], [w, -h, 1], [w, h, 1], [-w, h, 1], [-w, -h, 1]], { z, w: 4, fill: C.paper });
    stroke(k + '.l0', [[-w + 14, -h + 16], [w - 14, -h + 16]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.85, boil: 0.4 });
    stroke(k + '.l1', [[-w + 14, -h + 28], [w - 42, -h + 28]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.85, boil: 0.4 });
    const solved = i === PICK && t >= CHECK;
    if (!solved) text(k + '.q', '?', 0, 14, { size: 48, font: CFG.FONT_MIX, z: z + 0.2 });
    else {
      const g = GLYPH['✓'], S = 54, p = clamp((t - CHECK) / 0.25);
      stroke(k + '.ok', g.s[0].map(([u, v, cc]) => [-S * 0.4 + u * S, -S * 0.25 + v * S, cc]), { z: z + 0.2, w: 6, color: C.red, draw: p });
    }
    if (CARDS[i][3]) {                                         // a price tag ($, no amount)
      DL.save(); DL.translate(w - 10, -h + 6); DL.rotate(28);
      stroke(k + '.str', [[0, 0], [16, 14]], { z: z + 0.3, w: 2.4 });
      stroke(k + '.tag', [[16, 15], [28, 2, 1], [62, 2, 1], [62, 30, 1], [28, 30, 1], [16, 15, 1]], { z: z + 0.3, w: 3, fill: C.paper });
      dot(k + '.hole', [25, 16], 2.6, C.ink, z + 0.4);
      text(k + '.d', '$', 45, 16, { size: 26, font: CFG.FONT_MIX, z: z + 0.4 });
      DL.restore();
    }
    DL.restore();
  }
  COMP.r3_cards = {
    draw(fx, t) {
      if (t < C1) return;
      CARDS.forEach((_, i) => { const s = cardAt(i, t); if (s) drawCard('r3card' + i, i, s[0], s[1], s[2], t); });
    },
    cues: () => [...CARDS.map((_, i) => [cardT(i), i % 2 ? 'paper' : 'whoosh']), [PIN0, 'whoosh'], [PIN1, 'paper'], [TRAV0, 'whoosh'], [TRAV1, 'paper'], [CHECK, 'pen']],
  };

  /* ---------------- the timeline, the stuck grown-ups, the clues ---------------- */
  COMP.r3_tl = {
    draw(fx, t) {
      if (t < TL0) return;
      const p = EASE.io(clamp((t - TL0) / 0.7)), z = Z.set + 1, xs = TL_X0 - 40, span = TL_END - xs;
      arrow('r3tl', [xs, TL_Y], [TL_END, TL_Y], { p, bend: 0, color: C.ink, w: 5, head: 22, z });
      const at = x => clamp((p * span - (x - xs)) / 30);
      [TL_X0, TL_X1].forEach((x, i) => stroke('r3tl.t' + i, [[x, TL_Y - 16], [x + 1, TL_Y + 16]], { z, w: 5, draw: at(x) }));
      for (let i = 0; i < 8; i++) { const x = TL_X0 + (i + 1) * (TL_X1 - TL_X0) / 9; stroke('r3tl.m' + i, [[x, TL_Y - 8], [x, TL_Y + 8]], { z, w: 2.6, color: C.pencil, draw: at(x) }); }
    },
    cues: () => [[TL0, 'swish']],
  };
  const MATH = { H: 190, head: 0.38, torso: 0.24, leg: 0.32, arm: 0.36, floor: TL_Y, noShadow: true };
  const MATHS = [
    { id: 'r3m0', x: 520, def: { hair: 'messy', blink: [3.9, 0.3] }, pose: 'r3_mScratchR', face: 'puzzled', turn: 0.25 },
    { id: 'r3m1', x: 705, def: { hair: 'ponytail', blink: [4.3, 1.1] }, pose: 'r3_mChin', face: 'focus', turn: -0.2 },
    { id: 'r3m2', x: 890, def: { hair: 'part', glasses: true, blink: [3.6, 2.0] }, pose: 'r3_mScratchL', face: 'sheepish', turn: 0.3 },
    { id: 'r3m3', x: 1070, def: { hair: 'curly', blink: [4.1, 2.9] }, pose: 'r3_mHead', face: 'effort', turn: -0.15 },
  ];
  /** little paper scraps (their clues) hop from the grown-ups to Tao */
  COMP.r3_clues = {
    draw(fx, t, F) {
      MATHS.forEach((m, i) => {
        const t0 = CLUE0 + i * 0.16, u = (t - t0) / 0.62; if (u < 0 || u >= 1) return;
        const a = F.anchors[m.id]; if (!a) return;
        const from = [a.head[0], a.head[1] - a.r - 10], to = [HELD[0] - 6, HELD[1] - 10], e = EASE.io(u);
        const c = [lerp(from[0], to[0], e), lerp(from[1], to[1], e) - Math.sin(Math.PI * e) * 120], sc = u < 0.85 ? 1 : 1 - (u - 0.85) / 0.15;
        DL.save(); DL.translate(c[0], c[1]); DL.rotate(-15 + 300 * e); DL.scale(Math.max(0.05, sc));
        stroke('r3clue' + i, [[-16, -12], [16, -12, 1], [16, 12, 1], [-16, 12, 1], [-16, -12, 1]], { z: Z.fx + 3, w: 3, fill: C.paper });
        stroke('r3clue' + i + '.s', [[-9, -2], [-4, -6], [1, 2], [6, -5], [10, 0]], { z: Z.fx + 3.1, w: 2, boil: 0.6 });
        DL.restore();
      });
    },
    cues: () => MATHS.map((_, i) => [CLUE0 + i * 0.16, 'plip']),
  };

  /* ---------------- tracks ---------------- */
  const OFF = [-3000, FL];
  const mathTracks = {};
  MATHS.forEach((m, i) => {
    mathTracks[m.id] = {
      enter: M_ENTER + i * 0.25,
      pos: [[0, [m.x, TL_Y]]],
      pose: [[0, m.pose], [RELAX, 'r3_mRelax', 0.15, 'back']],
      face: [[0, m.face], [TRAV0, 'surprised', 0.05], [TRAV1 + 0.1, 'focus', 0.08], [BULB, 'idea', 0.05], [RELAX, 'smile', 0.08]],
      turn: [[0, m.turn], [TRAV0, 0.45, 0.12]],
      gaze: [[0, [m.x + (i % 2 ? -70 : 70), 230]], [TRAV0, 'card'], [TRAV1 + 0.1, 'tao']],
      squash: [[0, 1], [RELAX, 1.06, 0.06], [RELAX + 0.06, 1, 0.2, 'back']],
    };
  });
  const photoPose = { erdos: 'r3_bendLook', terry: 'r3_tPoint' };

  defineScene({
    id: 'erdos', chapter: '埃尔德什', dur: DUR, floor: FL,
    cast: {
      erdos: { ...E3.erdos },
      terry: { ...E3.terry },
      ...Object.fromEntries(MATHS.map(m => [m.id, { ...MATH, ...m.def }])),
      tao: { ...E3.taoAdult },
      // the two of them inside the photo (drawn by r3_photo, not by the stage; they never blink)
      r3pE: { ...E3.erdos, blink: [1000, 500] },
      r3pT: { ...E3.terry, blink: [1000, 500] },
    },
    order: ['erdos', 'terry', ...MATHS.map(m => m.id), 'tao'],
    tracks: {
      erdos: {
        pos: [[0, [-170, FL]], [WALK0, [EX, FL], WALK1 - WALK0, 'lin'], [BEND - 0.05, [EX2, FL], 0.2], [FLASH, OFF, 0]],
        pose: [[0, walkE], [WALK1, 'r3_carry', 0.12], [PUT0, 'r3_put', 0.3], [PUT1 + 0.2, 'stand', 0.25],
          [BEND, 'r3_bendPoint', 0.14, 'back'], [EPS0, 'stand', 0.2], [LOOK, 'r3_bendLook', 0.22]],
        squash: [[0, 1], [BEND, 1.04, 0.06], [BEND + 0.06, 1, 0.2, 'back']],
        face: [[0, 'smile'], [HOUSE_T, 'neutral', 0.08], [PUT0, 'focus', 0.08], [PUT1 + 0.2, 'smile', 0.08], [BEND, 'grin', 0.05],
          [EPS0, 'smile', 0.08], [LOOK, 'focus', 0.08], [24.0, 'smile', 0.1]],
        turn: [[0, 0.5], [WALK1, 0.4, 0.12], [PUT0, -0.2, 0.15], [PUT1 + 0.2, 0.4, 0.15], [BEND, 0.6, 0.1], [EPS0, 0.35, 0.12], [LOOK, 0.5, 0.15]],
        gaze: [[0, [1400, 450]], [WALK1, 'terry'], [HOUSE_T, 'viewer'], [PUT0, 'case'], [PUT1 + 0.2, 'terry'], [EPS0, 'eps'], [OPEN1, 'paperfly'], [LOOK, 'paper']],
      },
      terry: {
        pos: [[0, [TX, FL]], [FLASH, OFF, 0], [TWALK0, [-120, FL], 0], [TWALK0, [TCX, FL], TWALK1 - TWALK0, 'lin']],
        pose: [[0, 'stand'], [13.2, 'r3_tHuh', 0.12, 'back'], [15.4, 'stand', 0.2], [POINT, 'r3_tPoint', 0.15, 'back'],
          [FLASH, 'stand', 0], [TWALK0, makeWalk(TWALK0, TWALK1, 5.2, { lean: 5 })], [TWALK1, 'stand', 0.1]],
        squash: [[0, 1], [13.2, 1.1, 0.06], [13.26, 1, 0.22, 'back'], [OPEN0, 1.06, 0.05], [OPEN0 + 0.05, 1, 0.2, 'back'],
          [SHRINK + 0.3, 1.08, 0.05], [SHRINK + 0.35, 1, 0.2, 'back'], [GRIN, 1.08, 0.06], [GRIN + 0.06, 1, 0.25, 'back']],
        face: [[0, 'neutral'], [1.4, 'surprised', 0.05], [2.2, 'smile', 0.1], [HOUSE_T, 'puzzled', 0.08], [OPEN0, 'surprised', 0.05], [10.7, 'grin', 0.08],
          [12.4, 'smile', 0.08], [13.2, 'surprised', 0.05], [14.4, 'grin', 0.08], [EPS0, 'smile', 0.1], [SHRINK + 0.3, 'surprised', 0.05], [19.9, 'grin', 0.08],
          [OPEN1, 'smile', 0.1], [POINT, 'focus', 0.1],
          [TWALK0, 'neutral', 0], [cardT(0) + 0.1, 'surprised', 0.05], [37.6, 'smile', 0.1], [M_ENTER + 0.5, 'focus', 0.1],
          [TRAV0, 'surprised', 0.05], [BULB, 'idea', 0.05], [SMILE, 'smile', 0.1], [GRIN, 'joy', 0.08]],
        turn: [[0, -0.4], [TWALK0, 0.45, 0]],
        gaze: [[0, 'erdos'], [HOUSE_T, 'house'], [PUT1, 'case'], [12.4, 'erdos'], [EPS0, 'eps'], [OPEN1, 'paperfly'], [FLY1, 'paper'],
          [TWALK0, [1600, 520]], [cardT(0), 'cards'], [TL0, 'tl'], [PICK0, 'card'], [TRAV1 + 0.1, 'tao'], [SMILE, 'tl']],
      },
      ...mathTracks,
      tao: {
        enter: TAO_IN,
        pos: [[0, [1400, FL]]],
        pose: [[0, 'r3_catch']],
        face: [[0, 'focus'], [BULB, 'idea', 0.05], [51.8, 'smile', 0.1]],
        turn: [[0, -0.45]],
        gaze: [[0, 'card'], [51.8, 'maths']],
      },
      r3pE: { pos: [[0, [EX2, FL]]], pose: [[0, photoPose.erdos]], face: [[0, 'smile']], turn: [[0, 0.5]], gaze: [[0, PAPER]] },
      r3pT: { pos: [[0, [TX, FL]]], pose: [[0, photoPose.terry]], face: [[0, 'focus']], turn: [[0, -0.4]], gaze: [[0, PAPER]] },
    },
    targets: F => {
      const t = F.t, b = caseBottom(t, F), c = cardAt(PICK, t);
      return { house: HOUSE, eps: EPS_C, paper: PAPER, paperfly: t < FLY1 ? paperPos(t) : PAPER, case: [b[0], b[1] - CHT / 2],
        cards: [780, 225], tl: [790, TL_Y], card: c ? c[0] : [750, 198], maths: [790, 420] };
    },
    set: [
      { type: 'floor', t1: FLASH },
      { type: 'desk', ...DESK, open: true, t1: FLASH },
      { type: 'floor', t0: C0 },
    ],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      // part 1 · the visitor
      { type: 'label', id: 'r3lbWhen', text: '1985 年 · 阿德莱德', at: [800, 150], rot: -2, t0: 0.4, t1: 4.6, size: 46 },
      { type: 'r3_case', id: 'r3case' },
      { type: 'label', id: 'r3lbName', text: '埃尔德什', at: [345, 300], rot: -3, t0: 4.9, t1: 7.7, target: { char: 'erdos', part: 'headTop', dx: -36, dy: 6 }, bend: -0.25, gap: 14, size: 50 },
      { type: 'r3_house', id: 'r3house' },
      { type: 'label', id: 'r3lbStuff', text: '（全部家当）', at: [275, 520], rot: -3, t0: 10.35, t1: 12.5, target: [478, 650], bend: 0.2, gap: 10 },
      // ε
      { type: 'speech', id: 'r3say', text: '一个 ε！', at: [890, 318], tail: [-120, 36], speaker: 'erdos', t0: 13.0, t1: 16.0, size: 76, rot: -3 },
      { type: 'r3_eps', id: 'r3eps' },
      { type: 'label', id: 'r3lbSmall', text: '很小很小的数', at: [1185, 236], rot: -3, t0: 19.5, t1: EPS_T1, target: [928, 270], bend: 0.2, gap: 8 },
      // looking at a problem together
      { type: 'r3_paper', id: 'r3paper' },
      { type: 'r3_inset', id: 'r3inset' },
      ...INSET_W,
      // the photo
      { type: 'r3_vf', id: 'r3vf' },
      { type: 'r3_photo', id: 'r3photo' },
      { type: 'title', id: 'r3ka', text: '咔嚓！', x: KA[0], y: KA[1], size: 86, rot: 10, color: 'ink', t0: FLASH, t1: SHR0 + 0.15, sfx: 'r3_click' },
      { type: 'label', id: 'r3lb19', text: '陶哲轩 2019 年回忆', at: [800, 500], rot: -2, t0: 29.1, t1: C0, size: 40 },
      ...['“He spoke to me', 'like an adult,', 'like an equal.”'].map((s, i) => ({ type: 'scribe', id: 'r3q' + i, text: s, x: Q_X[i], y: Q_Y[i], size: Q_SIZE, font: CFG.FONT_MIX, t0: QUOTE[i], t1: C0, cps: 16 })),
      { type: 'r3_uline', id: 'r3ul' },
      // part 3 · his problems; one of them, 1932 → 2015
      { type: 'r3_cards', id: 'r3cards' },
      { type: 'r3_tl', id: 'r3tl' },
      { type: 'mark', id: 'r3qm', char: '?', on: MATHS.map(m => m.id), t0: QM_T, t1: TRAV0, stagger: 0.18, size: 58 },
      { type: 'ringRect', id: 'r3pick', rect: [CARDS[PICK][0] - KW / 2, CARDS[PICK][1] - KH / 2, KW, KH], t0: PICK0, t1: PIN0, pad: 16 },
      { type: 'write', id: 'r3y32', text: '1932', x: TL_X0, y: TL_Y + 28, size: 52, anchor: 'middle', t0: Y32, speed: 2400, gap: 0.03, glyphGap: 0.03, w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'write', id: 'r3y15', text: '2015', x: TL_X1, y: TL_Y + 28, size: 52, anchor: 'middle', t0: Y15, speed: 2400, gap: 0.03, glyphGap: 0.03, w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'e3_bulb', id: 'r3bulb', char: 'tao', t0: BULB, state: [[BULB, 'on']], size: 90 },
      { type: 'r3_clues', id: 'r3clues' },
      { type: 'title', id: 'r3note', text: '（也用上了很多数学家一起攒下的线索）', x: 790, y: 708, size: 42, color: 'red', rot: -1, t0: NOTE, t1: DUR },
      { type: 'r3_flash', id: 'r3flash' },
    ],
    sfx: [[13.0, 'boing'], ...MATHS.map((_, i) => [M_ENTER + i * 0.25, 'plip']), [TAO_IN, 'hop']],
    steps: [{ t0: WALK0, t1: WALK1, hz: 4.4 }, { t0: TWALK0, t1: TWALK1, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 4.7, text: '也是十岁那年，来了一位特别的客人：' },
      { t0: 4.8, t1: 7.6, text: '大数学家埃尔德什。' },
      { t0: 7.7, t1: 12.3, text: '他没有家，拎着手提箱到处找人做数学。' },
      { t0: 12.8, t1: 16.0, text: '他管小孩叫“ε”——', say: '他管小孩叫艾普西隆——' },
      { t0: 16.1, t1: 20.7, text: '数学里，ε 是一个很小很小的数。', say: '数学里，艾普西隆是一个很小很小的数。' },
      { t0: 21.3, t1: 24.7, text: '他和十岁的小陶一起看题，' },
      { t0: 25.1, t1: 28.3, text: '留下了一张有名的照片。' },
      { t0: 29.0, t1: 31.2, text: '小陶后来说：' },
      { t0: 31.3, t1: 35.3, text: '“他跟我说话，像对大人一样。”' },
      { t0: 36.0, t1: 39.4, text: '埃尔德什还出了很多难题。' },
      { t0: 39.5, t1: 43.9, text: '有的题，全世界的数学家卡了几十年。' },
      { t0: 44.0, t1: 47.6, text: '其中一道，1932 年提出，', say: '其中一道，一九三二年提出，' },
      { t0: 47.7, t1: 52.1, text: '八十多年后，被长大的陶哲轩解决了。' },
      { t0: 52.7, t1: 55.7, text: '卡几十年，也不丢人。' },
    ],
  });
})();
