// 9岁：去大学上数学课（事实：约 9 岁起到弗林德斯大学上大学数学课）。
// 后半段（只写答案的作业被画满问号、小问号变多）是概括性的画面，不是某一次真实事件。
(() => {
  const FL = 780, SEAT = 690, DESK_TOP = 612, STOOL = 596, CUT = 16.75;
  const TX = 1240, TX2 = 1372;               // Terry on the high stool; Terry standing after the cut
  const OFF = [[CUT, [-900, FL], 0]];        // classroom people leave the frame at the cut

  /* ---------------- the lecture room ---------------- */
  const ADULT = { H: 430, head: 0.36, torso: 0.24, leg: 0.32, arm: 0.36, noShadow: true };
  const jumpToStool = t => { const u = clamp((t - 3.42) / 0.26); return [lerp(1350, TX, EASE.io(u)), lerp(FL, STOOL, EASE.io(u)) - Math.sin(Math.PI * u) * 60]; };
  const swing = t => {
    const s = Math.sin((t - 5.5) * 2 * Math.PI * 1.5);
    return { ...POSE.sitHands, legL: [70, -63 + 28 * s], legR: [70, -63 - 28 * s], tilt: 4 * s };
  };
  // the three grown-up students share one choreography (a double-take at the tiny newcomer)
  const adult = (base, x, enter, lookAt) => ({
    enter,
    pos: [[0, [x, SEAT]], ...OFF],
    pose: [[0, base], [3.62, 'sitUp', 0.08, 'back'], [4.7, base, 0.2], [9.2, 'sitUp', 0.15]],
    face: [[0, 'neutral'], [3.62, 'surprised', 0.04], [4.2, 'puzzled', 0.06], [4.7, 'neutral', 0.1], [6.0, 'smile', 0.1], [9.2, 'focus', 0.1]],
    turn: [[0, -0.3], [3.62, 0.6, 0.06], [4.7, -0.3, 0.1], [6.0, 0.45, 0.12], [8.6, -0.3, 0.12]],
    gaze: [[0, 'board'], [3.62, 'terry'], [4.7, 'board'], [6.0, 'terry'], [8.6, 'board'], [lookAt, 'boardHi']],
    squash: [[0, 1], [3.62, 1.08, 0.05], [3.68, 1, 0.2, 'back']],
  });

  /* ---------------- the board: a step-by-step derivation ---------------- */
  const BS = 58, BX = 500;
  const BOARD = [
    { id: 'c2u.b0', text: '(x+1)×(x+1)', x: BX, y: 74 },
    { id: 'c2u.b1', text: '= x×x + x + x + 1', x: BX + 60, y: 150 },
    { id: 'c2u.b2', text: '= x×x + 2x + 1', x: BX + 60, y: 226 },
  ];
  let bt = 1.95;
  BOARD.forEach(b => { const w = layoutWriting({ ...b, size: BS, t0: bt, speed: 1500, gap: 0.03, glyphGap: 0.03 }); b.t0 = bt; b.tEnd = w.tEnd; b.xEnd = w.xEnd; bt = w.tEnd + 0.3; });
  const HI_T = [14.15, 14.75, 15.35];
  /** invisible: all three board lines as one stroke list, so the lecturer's chalk hand follows the pen across lines */
  COMP.c2u_penTrack = {
    init(fx) { fx.strokes = BOARD.flatMap(b => layoutWriting({ ...b, size: BS, t0: b.t0, speed: 1500, gap: 0.03, glyphGap: 0.03 }).strokes); fx.t0 = BOARD[0].t0; return fx; },
    draw() {},
  };

  /* ---------------- the homework sheet ---------------- */
  const SH = { x: 640, y: 430, w: 860, h: 660 };
  PROPS.c2u_sheet = (fx, t, lt) => {
    const z = Z.set, { w, h } = SH;
    stroke('c2u.sheet', superPts(0, 0, w, h, 28, 14), { z, w: 5, closed: true, fill: C.paper });
    stroke('c2u.shade', [[-w / 2 + 18, h / 2 + 10], [w / 2 + 10, h / 2 + 8, 1], [w / 2 + 8, -h / 2 + 18]], { z: z - 0.5, w: 2.5, color: C.pencil, opacity: 0.7, boil: 0.5 });
    text('c2u.title', '作业', -w / 2 + 70, -h / 2 + 62, { size: 46, anchor: 'start', z: z + 1 });
    stroke('c2u.hr', [[-w / 2 + 40, -h / 2 + 106], [w / 2 - 40, -h / 2 + 104]], { z: z + 1, w: 3 });
    [-80, 60, 150, 240].forEach((y, i) => stroke('c2u.rl' + i, [[-w / 2 + 40, y], [w / 2 - 40, y + 1]], { z: z + 0.5, w: 2, color: C.pencil, opacity: 0.45, boil: 0.4 }));
    text('c2u.ans', '答：成立。', -10, -18, { size: 100, z: z + 1 });
  };
  // red question marks, all over the page (sheet-absolute positions; [x, y, size, rot])
  const QS = [[272, 262, 80, -14], [610, 196, 70, 10], [930, 214, 96, 16], [1000, 360, 66, -8], [262, 342, 64, 12],
    [380, 560, 80, -18], [560, 610, 62, 8], [770, 590, 88, 14], [930, 560, 70, -10], [460, 180, 58, 20],
    [790, 196, 62, -16], [260, 620, 70, 6], [1010, 650, 60, 18], [470, 470, 52, 14], [860, 470, 52, -12]];
  const Q0 = 18.55, QGAP = 0.19;
  COMP.c2u_qmarks = {
    draw(fx, t) {
      if (t < Q0) return;
      QS.forEach(([x, y, size, rot], i) => {
        const t0 = Q0 + i * QGAP; if (t < t0) return;
        const g = GLYPH['?'];
        DL.save(); DL.translate(x, y); DL.rotate(rot);
        g.s.forEach((s, j) => {
          const u = clamp((t - t0 - j * 0.1) / 0.14);
          if (u > 0) stroke('c2u.q' + i + '.' + j, s.map(([a, b, c]) => [(a - g.w / 2) * size, (b - 0.5) * size, c]), { z: Z.board, w: 5.5, color: C.red, draw: u, boil: 0.6 });
        });
        DL.restore();
      });
    },
    cues: () => QS.map((_, i) => [Q0 + i * QGAP, 'pen']),
  };
  /** red ring around the lone answer */
  COMP.c2u_ansRing = {
    draw(fx, t) {
      const u = EASE.out(clamp((t - fx.t0) / 0.45)); if (u <= 0) return;
      stroke('c2u.ring', ringPts('c2u.ring', SH.x - 10, SH.y - 16, 300, 84, { n: 16, a0: -160, sweep: 380, rv: 0.05 }), { z: Z.annot, w: 5, color: C.red, draw: u });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /** thought-bubble contents: the reasoning Terry has in his head (scribbled lines and a tick) */
  COMP.c2u_idea = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      [[1232, 268, 150], [1232, 308, 190], [1232, 348, 120]].forEach(([x, y, len], i) => {
        const u = clamp((t - fx.t0 - i * 0.3) / 0.28); if (u <= 0) return;
        const pts = []; for (let k = 0; k <= 8; k++) pts.push([x + len * k / 8, y + (k % 2 ? -7 : 5)]);
        stroke('c2u.id' + i, pts, { z: Z.fx + 1, w: 3.5, draw: u, boil: 0.8 });
      });
      const v = clamp((t - fx.t0 - 1.0) / 0.2);
      if (v > 0) { const g = GLYPH['✓']; stroke('c2u.idok', g.s[0].map(([a, b, c]) => [1382 + a * 56, 318 + b * 56, c]), { z: Z.fx + 1, w: 5, draw: v }); }
    },
    cues: fx => [[fx.t0, 'pen'], [fx.t0 + 0.3, 'pen'], [fx.t0 + 0.6, 'pen'], [fx.t0 + 1.0, 'ding']],
  };

  /* ---------------- tiny 小问号s hop onto the page, one by one ---------------- */
  const MINI = [
    { at: [310, 748], size: 116 }, { at: [1004, 748], size: 116 }, { at: [470, 322], size: 100 }, { at: [842, 322], size: 100 },
    { at: [262, 482], size: 96 }, { at: [1030, 482], size: 96 }, { at: [650, 752], size: 165, sign: '理由呢？' },
  ];
  const M0 = 22.05, MGAP = 0.42;
  const hopIn = (at, t0) => t => {
    const u = clamp((t - t0) / 0.36), from = [at[0] + (at[0] < 640 ? -120 : 120), 900];
    return [lerp(from[0], at[0], u), lerp(from[1], at[1], EASE.out(u)) - Math.sin(Math.PI * u) * 150];
  };
  const minis = MINI.map((m, i) => {
    const t0 = M0 + i * MGAP;
    return { type: 'qm', id: 'c2u.m' + i, size: m.size, t0, blink: 0.3 + i * 0.47,
      pos: [[0, hopIn(m.at, t0)]],
      act: [[0, 'idle'], [t0 + 0.36, 'hop'], [t0 + 0.36 + 0.9, 'idle'], ...(m.sign ? [[26.3, 'tap']] : [])], hopHz: 2.2,
      mood: [[0, 'surprised'], [t0 + 0.36, 'happy'], [25.1, 'doubt'], [30.6, 'neutral']],
      gaze: [[0, 'viewer'], [25.1, 'ans'], [27.8, 'terryHead'], [30.6, 'ans']],
      sign: [[0, null], ...(m.sign ? [[25.05, m.sign]] : [])],
      signSize: m.sign ? 46 : 40,
      sfxAt: [[t0, 'boing'], [t0 + 0.36, 'hop'], ...(m.sign ? [[25.05, 'pop']] : [])] };
  });

  Object.assign(POSE, {
    c2u_thinkStand: { tilt: -6, armScale: 1.5, ikR: { w: 1, to: 'hip', dx: 24, dy: -2, bend: 'out' }, ikL: { w: 1, to: 'head', dx: -1.02, dy: 0.42, bend: 'out' } },
    c2u_shock: { lean: -5, armScale: 1.5, armL: [128, 36], armR: [128, 36] },
  });

  defineScene({
    id: 'university', chapter: '9岁 · 大学课堂', dur: 36.4, floor: FL,
    cast: {
      lecturer: { H: 450, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'sides', glasses: true, chalk: true, blink: [4.1, 1.3] },
      st1: { ...ADULT, hair: 'messy', desk: [470, DESK_TOP], blink: [4.3, 0.2] },
      st2: { ...ADULT, hair: 'ponytail', desk: [700, DESK_TOP], blink: [3.7, 1.9] },
      st3: { ...ADULT, hair: 'part', glasses: true, desk: [930, DESK_TOP], blink: [4.6, 2.6] },
      terry: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    order: ['lecturer', 'st1', 'st2', 'st3', 'terry'],
    tracks: {
      lecturer: {
        enter: 1.5,
        pos: [[0, [175, FL]], ...OFF],
        pose: [[0, 'chalkUp'], [1.9, 'write', 0.14], [bt - 0.2, 'present', 0.14], [11.6, 'present', 0.1], [14.0, 'chalkUp', 0.14]],
        face: [[0, 'neutral'], [1.9, 'focus', 0.05], [bt - 0.2, 'smile', 0.1], [9.3, 'neutral', 0.1]],
        turn: [[0, 0.45], [bt - 0.2, 0.2, 0.12]],
        gaze: [[0, 'board'], [1.9, 'pen'], [bt - 0.2, 'students'], [11.6, 'ansEnd'], [14.0, 'board']],
      },
      st1: adult('chinHand', 470, 1.58, 11.5),
      st2: adult('armsDesk', 700, 1.64, 11.5),
      st3: adult('leanBack', 930, 1.7, 11.5),
      terry: {
        pos: [[0, [1760, FL]], [1.9, [1350, FL], 1.0, 'lin'], [3.42, jumpToStool, 0], [CUT, [TX2, FL], 0]],
        pose: [[0, makeWalk(1.9, 2.9, 5.2)], [2.95, 'stand', 0.1], [3.2, 'crouch', 0.1], [3.42, 'jumpUp', 0.08], [3.7, 'sitHands', 0.1, 'back'],
          [5.5, swing, 0.15], [9.2, 'sitHands', 0.2], [CUT, 'stand', 0], [18.55, 'c2u_shock', 0.1, 'back'], [19.6, 'stand', 0.25],
          [25.4, 'c2u_thinkStand', 0.3]],
        squash: [[0, 1], [3.2, 0.86, 0.08], [3.42, 1.12, 0.06], [3.7, 0.86, 0.05], [3.76, 1, 0.18, 'back'],
          [CUT, 0.9, 0], [CUT + 0.02, 1, 0.25, 'back'], [18.55, 1.1, 0.06], [18.62, 1, 0.25, 'back']],
        face: [[0, 'smile'], [3.7, 'grin', 0.05], [5.5, 'joy', 0.1], [9.2, 'focus', 0.1], [CUT, 'neutral', 0], [18.55, 'surprised', 0.05],
          [22.05, 'jaw', 0.06, 'back'], [24.2, 'surprised', 0.15], [25.4, 'focus', 0.2], [30.7, 'puzzled', 0.15], [32.4, 'focus', 0.2]],
        turn: [[0, -0.6], [2.95, -0.2, 0.1], [3.7, -0.35, 0.1], [CUT, -0.3, 0]],
        gaze: [[0, [0, 700]], [2.95, 'stool'], [3.7, 'board'], [5.5, 'viewer'], [9.2, 'boardHi'], [CUT, 'page'], [22.05, 'minis'], [25.4, 'ans'],
          [27.9, [1300, 280]], [30.7, 'ans']],
      },
    },
    targets: F => {
      return { board: [760, 170], boardHi: [760, 150], students: [700, 520], stool: [TX, STOOL], ansEnd: [BOARD[2].xEnd - 60, 260],
        page: [640, 300], ans: [630, 410], minis: [640, 600], terryHead: F.anchors.terry ? F.anchors.terry.head : [TX2, 520] };
    },
    pen: 'c2u.pen',
    set: [
      { type: 'floor', t0: 1.5, t1: CUT },
      { type: 'board', x: 320, y: 40, w: 940, h: 262, t0: 1.52, t1: CUT },
      { type: 'chair', x: 470, seat: SEAT, t0: 1.5, t1: CUT }, { type: 'chair', x: 700, seat: SEAT, t0: 1.54, t1: CUT }, { type: 'chair', x: 930, seat: SEAT, t0: 1.58, t1: CUT },
      { type: 'desk', x: 705, top: DESK_TOP, w: 780, open: true, t0: 1.55, t1: CUT },
      { type: 'stool', x: TX, seat: STOOL, t0: 1.7, t1: CUT },
    ],
    fx: [
      { type: 'ageStamp', age: 9, place: '去大学上数学课', t0: 0, center: [800, 360], R: 150, dockT: 1.32, dock: [1486, 108], dockScale: 0.46, pulse: [5.2] },
      { type: 'title', id: 'c2u.proofWord', text: '证明：', x: 424, y: 104, size: 48, t0: 1.7, t1: CUT, color: 'ink', z: Z.board, sfx: 'chalk' },
      { type: 'c2u_penTrack', id: 'c2u.pen' },
      ...BOARD.map(b => ({ type: 'write', id: b.id, text: b.text, x: b.x, y: b.y, size: BS, t0: b.t0, t1: CUT, speed: 1500, gap: 0.03, glyphGap: 0.03, w: 6 })),
      { type: 'label', id: 'c2u.lbSmall', text: '最小的学生', at: [1428, 330], rot: 3, t0: 5.3, t1: 9.1, target: { char: 'terry', part: 'headTop', dx: 14 }, bend: 0.25 },
      { type: 'swingMarks', id: 'c2u.swing', char: 'terry', t0: 5.6, t1: 9.1 },
      { type: 'label', id: 'c2u.lbAns', text: '答案', at: [1338, 262], rot: -3, t0: 11.7, t1: CUT, target: [BOARD[2].xEnd + 4, 262], bend: 0.15, gap: 8 },
      ...BOARD.map((b, i) => ({ type: 'highlight', id: 'c2u.hi' + i, of: b.id, t0: HI_T[i], dur: 0.35, t1: CUT })),
      { type: 'label', id: 'c2u.lbStep', text: '每一步的理由', at: [760, 366], rot: -2, t0: 14.3, t1: CUT, target: [BX - 40, 190], bend: -0.25, gap: 6 },
      // the sheet (cut)
      { type: 'prop', kind: 'c2u_sheet', id: 'c2u.sheetP', t0: CUT, pos: [[0, [SH.x, 1300]], [CUT, [SH.x, SH.y], 0.35, 'out']], rot: -1, drawDur: 0, sfxAt: [[CUT, 'paper'], [CUT + 0.34, 'thud']] },
      { type: 'c2u_qmarks', id: 'c2u.qs' },
      ...minis,
      { type: 'thought', id: 'c2u.th', at: [1300, 308], rx: 170, ry: 88, t0: 27.9, t1: 30.65, from: { char: 'terry', part: 'headTop', dy: -30 } },
      { type: 'c2u_idea', id: 'c2u.idea', t0: 28.2, t1: 30.65 },
      { type: 'label', id: 'c2u.lbHead', text: '别人看不见', at: [1210, 150], rot: -3, t0: 28.9, t1: 30.65, target: [1250, 218], bend: 0.2, gap: 6 },
      { type: 'c2u_ansRing', id: 'c2u.ring', t0: 30.75 },
      { type: 'label', id: 'c2u.lbSee', text: '大家只看得见这个', at: [1250, 250], rot: 2, t0: 31.1, target: [SH.x + 300, SH.y - 30], bend: -0.25, gap: 10, t1: 36.4 },
    ],
    sfx: [[1.5, 'plip'], [1.58, 'plip'], [1.64, 'plip'], [1.7, 'plip'], [3.2, 'thud'], [3.44, 'boing'], [3.62, 'whip'], [18.55, 'boing']],
    steps: [{ t0: 1.9, t1: 2.95, hz: 5.2 }],
    subs: [
      { t0: 0.2, t1: 4.82, text: '九岁时，小陶开始去大学上数学课。' },
      { t0: 4.92, t1: 9.1, text: '教室里，他是个子最小的学生。' },
      { t0: 9.2, t1: 13.95, text: '大学的数学作业，要的不只是答案，' },
      { t0: 14.05, t1: 16.9, text: '而是每一步的理由。' },
      { t0: 17.0, t1: 21.9, text: '只写答案的作业，会被红笔画满问号。' },
      { t0: 22.0, t1: 25.4, text: '小问号，一下子变多了！' },
      { t0: 25.5, t1: 27.8, text: '小陶慢慢明白：' },
      { t0: 27.9, t1: 33.8, text: '别人看不见你的脑子，只看得见你写下的字。' },
    ],
  });
})();
