// 10 岁之前：小陶做题靠“灵光一闪”——题目一来，叮，答案就出来了。
// 10 岁开始准备 IMO（事实：1986 年 7 月 IMO 时他还不满 11 岁；考两天，每天 4 个半小时、3 道题）。
// 4.5 ÷ 3 = 1.5（小时）。卡片上的题都自己验算过：12×12 = 144，7+7+7 = 21，9×9 = 81，1+2+…+10 = 55，100-58 = 42。
// “第一道难题”“等那一声叮”“灯泡没电了”是对“卡住”的演绎，不是某一次真实事件。
(() => {
  const FL = 780, TX = 300;

  /* ---------------- 题目卡片：一张张飞来，叮一声，答案写上去 ---------------- */
  const CW = 440, CH = 270, OUT_T = 14.65;
  const CARDS = [
    { q: '12×12 =', a: '144', tIn: 0.7, at: [880, 455], rot: -5, tAns: 4.3 },
    { q: '□+□+□=21', box7: true, qSize: 64, qy: -42, tIn: 6.0, at: [930, 432], rot: 3, tAns: 8.3 },
    { q: '9×9 =', a: '81', tIn: 11.3, at: [868, 448], rot: -3, tAns: 11.75 },
    { q: '1+2+…+10 =', a: '55', tIn: 12.4, at: [940, 426], rot: 4, tAns: 12.85 },
    { q: '100-58 =', a: '42', tIn: 13.4, at: [902, 442], rot: -2, tAns: 13.85 },
  ];
  CARDS.forEach(c => {
    const qs = c.qSize || 60, qy = c.qy ?? -100;
    c.qL = layoutWriting({ text: c.q, x: 0, y: qy, size: qs, t0: 0, speed: 1, anchor: 'middle' });
    if (c.a) c.aL = [layoutWriting({ text: c.a, x: 0, y: 2, size: 100, t0: c.tAns, speed: 2600, gap: 0.02, glyphGap: 0.02, anchor: 'middle' })];
    // □+□+□=21: a 7 goes into each box
    if (c.box7) c.aL = c.qL.boxes.filter(b => b.ch === '□').map((b, i) =>
      layoutWriting({ text: '7', x: b.x + 0.39 * qs - 0.3 * 36, y: qy + 0.2 * qs + 8, size: 36, t0: c.tAns + i * 0.22, speed: 2200 }));
  });
  // the maths on the cards, checked
  if (12 * 12 !== 144 || 7 * 3 !== 21 || 9 * 9 !== 81 || 55 !== 10 * 11 / 2 || 100 - 58 !== 42) console.error('f3: card maths');
  function cardPose(c, i, t) {
    const u = clamp((t - c.tIn) / 0.42), e = EASE.out(u);
    let x = lerp(1880, c.at[0], e), y = lerp(c.at[1] + 40, c.at[1], e) - Math.sin(Math.PI * u) * 34, rot = c.rot + 34 * (1 - e);
    const sc = lerp(0.85, 1, e), v = clamp((t - (OUT_T + i * 0.05)) / 0.35);
    if (v > 0) { const w = EASE.in(v); x += 1300 * w; y -= 160 * w; rot += 25 * w; }
    return { x, y, rot, sc, gone: v >= 1 };
  }
  COMP.f3_cards = {
    draw(fx, t) {
      CARDS.forEach((c, i) => {
        if (t < c.tIn) return;
        const P = cardPose(c, i, t); if (P.gone) return;
        const k = 'f3.card' + i, z = 41 + i * 0.5;
        DL.save(); DL.translate(P.x, P.y); DL.rotate(P.rot); DL.scale(P.sc);
        stroke(k, [[-CW / 2, -CH / 2], [CW / 2, -CH / 2, 1], [CW / 2, CH / 2, 1], [-CW / 2, CH / 2, 1], [-CW / 2, -CH / 2, 1]], { z, w: 4.5, fill: C.paper });
        stroke(k + '.sh', [[-CW / 2 + 12, CH / 2 + 7], [CW / 2 + 7, CH / 2 + 7, 1], [CW / 2 + 7, -CH / 2 + 12]], { z: z - 0.05, w: 2.4, color: C.pencil, opacity: 0.7, boil: 0.5 });
        c.qL.strokes.forEach((s, j) => stroke(k + '.q' + j, s.pts, { z: z + 0.1, w: 5, boil: 0.5 }));
        (c.aL || []).forEach((L, m) => L.strokes.forEach((s, j) => {
          const q = clamp((t - s.t0) / s.dur);
          if (q > 0) stroke(k + '.a' + m + '.' + j, s.pts, { z: z + 0.1, w: c.box7 ? 5.5 : 7, draw: q, boil: 0.55 });
        }));
        DL.restore();
      });
    },
    cues: () => CARDS.flatMap(c => [[c.tIn, 'whip'], [c.tIn + 0.38, 'paper'], ...c.aL.map(L => [L.strokes[0].t0, 'pen'])]).concat([[OUT_T, 'whoosh']]),
  };
  const topCard = t => {
    let i = -1; CARDS.forEach((c, j) => { if (c.tIn <= t) i = j; });
    if (i < 0) return [900, 440];
    const P = cardPose(CARDS[i], i, t); return [P.x, P.y];
  };

  /* ---------------- 考场：三张试卷 + 一个钟 ---------------- */
  const PAPERS = [
    { at: [975, 340], rot: -3, tIn: 20.5, tc: 25.0 },
    { at: [1165, 350], rot: 2, tIn: 20.68, tc: 25.3 },
    { at: [1355, 336], rot: -2, tIn: 20.86, tc: 25.6 },
  ];
  const EXAM_T1 = 38.5, PW = 150, PH = 200;
  COMP.f3_exam = {
    draw(fx, t) {
      if (t >= EXAM_T1) return;
      PAPERS.forEach((pp, i) => {
        if (t < pp.tIn) return;
        const k = 'f3.ex' + i, u = clamp((t - pp.tIn) / 0.28), z = Z.set + 2;
        let sc = Math.max(0.01, EASE.back(u));
        const v = (t - pp.tc) / 0.32; if (v > 0 && v < 1) sc *= 1 + 0.12 * Math.sin(Math.PI * v);
        DL.save(); DL.translate(pp.at[0], pp.at[1] - (1 - EASE.out(u)) * 40); DL.rotate(pp.rot); DL.scale(sc);
        stroke(k, [[-PW / 2, -PH / 2], [PW / 2, -PH / 2, 1], [PW / 2, PH / 2, 1], [-PW / 2, PH / 2, 1], [-PW / 2, -PH / 2, 1]], { z, w: 4.5, fill: C.paper });
        stroke(k + '.sh', [[-PW / 2 + 10, PH / 2 + 6], [PW / 2 + 6, PH / 2 + 6, 1], [PW / 2 + 6, -PH / 2 + 10]], { z: z - 0.05, w: 2.2, color: C.pencil, opacity: 0.7, boil: 0.5 });
        // dense scribbled lines = a long, hard question
        for (let r = 0; r < 7; r++) {
          const y = -PH / 2 + 30 + r * 23, x0 = -PW / 2 + 16, len = (r === 0 ? 70 : 104) - (r === 6 ? 40 : 0) + rnd(hstr(k), r, 4) * 10, pts = [];
          for (let j = 0; j <= 7; j++) pts.push([x0 + len * j / 7, y + (j % 2 ? -3.5 : 3) + rnd(hstr(k), r, j) * 1.5]);
          stroke(k + '.l' + r, pts, { z: z + 0.1, w: r === 0 ? 4 : 2.6, boil: 0.6 });
        }
        DL.restore();
      });
    },
    cues: () => PAPERS.flatMap(pp => [[pp.tIn, 'paper'], [pp.tc, 'boop']]),
  };
  // the clock: 9:00 → 13:30 (four and a half hours) in a whirl, a red arc following the hour hand
  const CLK = { c: [655, 335], r: 112, t0: 23.4, s0: 23.65, s1: 24.75 };
  const clkMin = t => 270 * EASE.io(clamp((t - CLK.s0) / (CLK.s1 - CLK.s0)));
  const hourA = m => 270 + m * 0.5, clockPt = (a, rr) => [CLK.c[0] + Math.sin(a * RAD) * rr, CLK.c[1] - Math.cos(a * RAD) * rr];
  COMP.f3_clock = {
    draw(fx, t) {
      if (t < CLK.t0 || t >= EXAM_T1) return;
      const lt = t - CLK.t0, pop = Math.max(0.01, EASE.back(clamp(lt / 0.3))), { r } = CLK, z = Z.set + 2, k = 'f3.clk';
      const m = clkMin(t);
      DL.save(); DL.translate(CLK.c[0], CLK.c[1]); DL.scale(pop); DL.translate(-CLK.c[0], -CLK.c[1]);
      const [cx, cy] = CLK.c;
      [-1, 1].forEach(s => stroke(k + '.ft' + s, [[cx + s * r * 0.5, cy + r * 0.86], [cx + s * r * 0.72, cy + r * 1.12]], { z, w: 6 }));
      stroke(k + '.o', ringPts(k + '.o', cx, cy, r, r, { n: 14, a0: -110, sweep: 374, rv: 0.02 }), { z, w: 6.5, fill: C.paper });
      stroke(k + '.i', ringPts(k + '.i', cx, cy, r * 0.9, r * 0.9, { n: 14, a0: 60, sweep: 366, rv: 0.02 }), { z: z + 0.1, w: 2.5 });
      for (let i = 0; i < 12; i++) {
        const a = i * 30, big = i % 3 === 0;
        stroke(k + '.t' + i, [clockPt(a, r * (big ? 0.66 : 0.72)), clockPt(a, r * 0.82)], { z: z + 0.1, w: big ? 4.5 : 3 });
      }
      // blur behind the minute hand while it whirls
      const spin = t > CLK.s0 && t < CLK.s1;
      if (spin) for (let j = 1; j <= 3; j++) stroke(k + '.bl' + j, [0, 1, 2, 3, 4].map(q => clockPt(m * 6 - j * 14 - q * 5, r * 0.62)), { z: z + 0.15, w: 2.4, color: C.pencil, opacity: 0.8 - j * 0.2, boil: 0.6 });
      stroke(k + '.hh', [CLK.c, clockPt(hourA(m), r * 0.46)], { z: z + 0.2, w: 7 });
      stroke(k + '.hm', [CLK.c, clockPt(m * 6, r * 0.7)], { z: z + 0.2, w: 4.5 });
      dot(k + '.c', CLK.c, 6, C.ink, z + 0.3);
      // red arc outside the rim: 9 o'clock round to where the hour hand is now
      const sweep = hourA(m) - 270;
      if (sweep > 2) {
        const R2 = r + 22, pts = [];
        for (let i = 0; i <= 14; i++) pts.push(clockPt(270 + sweep * i / 14, R2));
        stroke(k + '.arc', pts, { z: Z.annot, w: 5, color: C.red, boil: 0.6 });
        if (t >= CLK.s1) {
          const e = pts[14], b = clockPt(270 + sweep - 8, R2), L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = 18;
          const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
          const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
          stroke(k + '.arcH', [r1, [e[0], e[1], 1], r2], { z: Z.annot, w: 5, color: C.red, boil: 0.6 });
        }
      }
      DL.restore();
    },
    cues: () => [[CLK.t0, 'pop'], [CLK.s0, 'f3_whirr'], [CLK.s0 + 0.35, 'f3_whirr'], [CLK.s0 + 0.7, 'f3_whirr'], [CLK.s1, 'plip']],
  };
  SFX.define('f3_whirr', tone => { tone('triangle', 420, 1300, 0.26, 0.07, [28, 90]); });
  SFX.define('f3_fizz', (tone, noise) => { noise('bandpass', 3600, 3, 0.045, 0.07); tone('square', 120, 116, 0.05, 0.025); });

  /* 4.5 ÷ 3 = 1.5, red pen, centred under the papers */
  const EQ_Y = 520, EQ_S = 84;
  const w1 = writeWidth('4.5 ÷ 3 =', EQ_S), w2 = writeWidth('1.5', EQ_S), EQ_GAP = 50;
  const EQ_X = 960 - (w1 + EQ_GAP + w2) / 2, EQ2_X = EQ_X + w1 + EQ_GAP;
  if (Math.abs(4.5 / 3 - 1.5) > 1e-9) console.error('f3: 4.5 / 3');

  /* ---------------- 第一道难题：一张比他还大的试卷 ---------------- */
  const GP = { x: 925, y: 778, w: 540, h: 640, t0: 38.65, land: 38.95 };
  const GROWS = [];
  for (let r = 0; r < 10; r++) {
    const y = -GP.h + 170 + r * 44, x0 = -GP.w / 2 + 52, len = (r === 9 ? 230 : 400 + rnd(hstr('f3gp'), r, 1) * 30), pts = [];
    for (let j = 0; j <= 14; j++) pts.push([x0 + len * j / 14, y + (j % 2 ? -5 : 4) + rnd(hstr('f3gp'), r, j + 10) * 2.5]);
    GROWS.push(pts);
  }
  COMP.f3_giant = {
    draw(fx, t) {
      if (t < GP.t0) return;
      const u = clamp((t - GP.t0) / (GP.land - GP.t0)), dy = -980 * (1 - EASE.in(u)), lt = t - GP.land;
      const sq = lt > 0 && lt < 0.3 ? 1 - 0.07 * Math.sin(Math.PI * lt / 0.3) : 1, z = Z.set + 2, k = 'f3.gp', { w, h } = GP, f = 52;
      DL.save(); DL.translate(GP.x, GP.y + dy); DL.rotate(-1.5); DL.scale(1 + (1 - sq) * 0.5, sq);
      stroke(k, [[-w / 2, 0], [-w / 2, -h, 1], [w / 2 - f, -h, 1], [w / 2, -h + f, 1], [w / 2, 0, 1], [-w / 2, 0, 1]], { z, w: 6, fill: C.paper });
      stroke(k + '.fold', [[w / 2 - f, -h], [w / 2 - f + 4, -h + f - 4, 1], [w / 2, -h + f]], { z: z + 0.1, w: 4 });
      stroke(k + '.sh', [[-w / 2 + 14, 8], [w / 2 + 9, 8, 1], [w / 2 + 9, -h + f + 14]], { z: z - 0.05, w: 2.5, color: C.pencil, opacity: 0.7, boil: 0.5 });
      text(k + '.h', '第 1 题', -w / 2 + 52, -h + 78, { size: 62, anchor: 'start', z: z + 0.2 });
      stroke(k + '.hu', [[-w / 2 + 48, -h + 120], [-w / 2 + 230, -h + 117]], { z: z + 0.2, w: 4 });
      GROWS.forEach((pts, i) => stroke(k + '.r' + i, pts, { z: z + 0.2, w: 3, boil: 0.7 }));
      DL.restore();
      // a puff of pencil dust at both feet when it lands
      if (lt > 0 && lt < 0.55) {
        const q = lt / 0.55;
        [-1, 1].forEach(s => [0, 1, 2].forEach(j => {
          const bx = GP.x + s * (w / 2 + 10), a = (s < 0 ? 180 + 20 + j * 22 : -20 - j * 22) * RAD, r0 = 12 + 50 * q;
          stroke(k + '.d' + s + j, [[bx + Math.cos(a) * r0, GP.y + Math.sin(a) * r0 * 0.6], [bx + Math.cos(a) * (r0 + 22), GP.y + Math.sin(a) * (r0 + 22) * 0.6]], { z: Z.fx, w: 3, color: C.pencil, opacity: 1 - q, boil: 0.6 });
        }));
      }
    },
    cues: () => [[GP.t0, 'whoosh'], [GP.land, 'thud']],
  };

  /* the bulb sputters in shorter and shorter bursts, then dies (one fizz per burst) */
  const BURSTS = [[45.85, 0.34], [46.8, 0.26], [47.65, 0.18], [48.4, 0.1]];
  const FLICK = [[41.85, 'off'], ...BURSTS.flatMap(([b, d]) => [[b, 'flicker'], [b + d, 'off']]), [49.1, 'dead']];
  /** a little curl of pencil smoke rising off the dead bulb */
  COMP.f3_smoke = {
    draw(fx, t, F) {
      const lt = t - fx.t0, b = F.targets['f3.bulb2.bulb']; if (lt < 0 || !b) return;
      [0, 1].forEach(j => {
        const ph = ((lt + j * 0.7) / 1.4) % 1, op = Math.sin(Math.PI * ph) * clamp(lt / 0.3), pts = [];
        for (let i = 0; i <= 6; i++) { const v = i / 6; pts.push([b[0] + 14 + j * 16 + Math.sin(v * 5 + lt * 3 + j) * 9, b[1] - 46 - ph * 40 - v * 46]); }
        stroke('f3.smk' + j, pts, { z: Z.fx, w: 3, color: C.pencil, opacity: op, boil: 0.8 });
      });
    },
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    f3_shock: { lean: -5, tilt: -4, armScale: 1.55, armL: [128, 36], armR: [128, 36] },
    f3_lean: { lean: -6, tilt: -8, armScale: 1.3, armL: [30, 20], armR: [30, 20] },
    f3_finger: { lean: -2, tilt: -5, armScale: 1.7, armR: [148, 22], ikL: { w: 1, to: 'hip', dx: -26, dy: -6, bend: 'out' } },
  });
  const dingPop = tt => [[tt, 1.08, 0.05], [tt + 0.06, 1, 0.22, 'back']];

  defineScene({
    id: 'flash', chapter: '灵光一闪', dur: 51.6, floor: FL,
    cast: { terry: { ...E3.terry } },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]]],
        pose: [[0, 'stand'], [1.9, 'thinkStand', 0.12, 'back'], [3.7, 'stand', 0.12], [4.3, 'kidPoint', 0.1, 'back'], [5.95, 'stand', 0.15],
          [8.3, 'kidPoint', 0.1, 'back'], [11.2, 'akimbo', 0.12, 'back'], [15.35, 'stand', 0.15], [21.3, 'f3_lean', 0.1, 'back'], [23.4, 'stand', 0.15],
          [27.4, 'thinkStand', 0.15], [31.2, 'f3_shock', 0.08, 'back'], [33.95, 'f3_finger', 0.1, 'back'], [38.3, 'stand', 0.2],
          [38.95, 'f3_lean', 0.08, 'back'], [39.6, 'lookUp', 0.2], [45.8, 'thinkStand', 0.2], [49.2, 'scratchStand', 0.12, 'back']],
        face: [[0, 'smile'], [1.1, 'focus', 0.05], [1.9, 'proud', 0.05], [4.0, 'idea', 0.05], [4.6, 'grin', 0.05], [6.0, 'focus', 0.05],
          [7.5, 'idea', 0.05], [8.3, 'grin', 0.05], [11.2, 'proudGrin', 0.05], [15.35, 'surprised', 0.05], [16.3, 'smile', 0.1], [17.45, 'grin', 0.05],
          [20.3, 'neutral', 0.05], [21.3, 'surprised', 0.05], [22.4, 'focus', 0.1], [23.7, 'surprised', 0.05], [24.9, 'focus', 0.1],
          [31.2, 'jaw', 0.06, 'back'], [33.95, 'proudGrin', 0.05], [38.95, 'surprised', 0.05], [39.9, 'focus', 0.1], [45.8, 'puzzled', 0.08],
          [49.15, 'sheepish', 0.06]],
        turn: [[0, 0.35], [1.9, 0, 0.12], [4.0, 0.4, 0.1], [11.2, 0.1, 0.12], [15.35, 0.35, 0.12], [31.2, 0.1, 0.1], [33.95, 0, 0.1],
          [38.95, 0.45, 0.1], [41.9, 0.15, 0.15], [49.2, 0.1, 0.12]],
        gaze: [[0, 'viewer'], [0.8, 'card'], [1.9, 'viewer'], [3.9, 'card'], [11.2, 'viewer'], [15.35, 'stamp'], [20.3, 'papers'], [23.45, 'clock'],
          [24.95, 'papers'], [27.4, 'eq'], [31.2, 'viewer'], [38.7, 'giant'], [41.9, 'bulbUp'], [49.3, 'viewer']],
        squash: [[0, 1], ...dingPop(4.0), ...dingPop(7.5), ...dingPop(11.7), ...dingPop(12.8), ...dingPop(13.8),
          [15.85, 0.92, 0.05], [15.91, 1, 0.22, 'back'], [21.3, 1.06, 0.05], [21.36, 1, 0.2, 'back'],
          [31.2, 1.13, 0.06], [31.27, 1, 0.28, 'back'], [38.95, 0.86, 0.05], [39.0, 1.08, 0.08], [39.1, 1, 0.22, 'back'],
          [49.1, 0.9, 0.06], [49.17, 1, 0.22, 'back']],
      },
    },
    targets: F => ({
      card: topCard(F.t), stamp: E3.STAMP.center, papers: [1165, 330], clock: CLK.c, eq: [960, 560], giant: [925, 260], bulbUp: [TX, 420],
    }),
    set: [{ type: 'floor' }],
    fx: [
      { type: 'f3_cards', id: 'f3.cards' },
      { type: 'title', id: 'f3.title', text: '灵光一闪', x: 905, y: 150, size: 130, t0: 4.05, t1: OUT_T, underline: true },
      { type: 'e3_bulb', id: 'f3.bulb', char: 'terry', t0: 4.0, t1: 14.95,
        state: [[4.0, 'on'], [5.95, 'off'], [7.5, 'on'], [11.2, 'off'], [11.7, 'on'], [12.35, 'off'], [12.8, 'on'], [13.35, 'off'], [13.8, 'on']] },
      // 10 岁的印章，先盖在中间，再停靠到右上角
      { type: 'ageStamp', age: 10, place: '准备奥数', t0: 15.35, center: E3.STAMP.center, R: E3.STAMP.R, dockT: 20.25, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale, pulse: [] },
      { type: 'label', id: 'f3.lbIMO', text: 'IMO = 国际数学奥林匹克', at: [800, 690], rot: -2, t0: 17.45, t1: 20.2, target: [836, 592], bend: 0.12, gap: 8 },
      // the exam
      { type: 'f3_exam', id: 'f3.exam' },
      ...PAPERS.map((pp, i) => ({ type: 'write', id: 'f3.cnt' + i, text: String(i + 1), x: pp.at[0], y: 158, size: 58, t0: pp.tc, t1: EXAM_T1, speed: 2600, color: 'red', w: 6, sfx: 'pen', anchor: 'middle', z: Z.annot })),
      { type: 'f3_clock', id: 'f3.clock' },
      { type: 'label', id: 'f3.lbHours', text: '4.5 小时', at: [455, 162], rot: -4, t0: 24.85, t1: EXAM_T1, target: clockPt(325, CLK.r + 30), bend: -0.2, gap: 8 },
      { type: 'write', id: 'f3.eq1', text: '4.5 ÷ 3 =', x: EQ_X, y: EQ_Y, size: EQ_S, t0: 27.45, t1: EXAM_T1, speed: 2400, gap: 0.03, glyphGap: 0.04, color: 'red', w: 6.5, sfx: 'pen', z: Z.annot },
      { type: 'write', id: 'f3.eq2', text: '1.5', x: EQ2_X, y: EQ_Y, size: EQ_S, t0: 28.95, t1: EXAM_T1, speed: 2400, gap: 0.03, glyphGap: 0.04, color: 'red', w: 7, sfx: 'pen', z: Z.annot },
      { type: 'highlight', id: 'f3.hi', of: 'f3.eq2', t0: 29.45, dur: 0.35, t1: EXAM_T1 },
      { type: 'label', id: 'f3.lbHr', text: '小时', at: [EQ2_X + w2 + 120, 700], rot: -4, t0: 29.75, t1: EXAM_T1, target: [EQ2_X + w2 * 0.6, EQ_Y + EQ_S + 18], bend: 0.25, gap: 8 },
      { type: 'speech', id: 'f3.say1', text: '一个半小时？', at: [300, 370], tail: [0, 44], speaker: 'terry', t0: 31.25, t1: 33.85, size: 64, rot: -3 },
      { type: 'speech', id: 'f3.say2', text: ['我做一道题，', '一般只要一分钟！'], at: [318, 352], tail: [6, 74], speaker: 'terry', t0: 33.95, t1: 38.2, size: 54, rot: -2 },
      // the first hard problem
      { type: 'f3_giant', id: 'f3.giant' },
      { type: 'e3_bulb', id: 'f3.bulb2', char: 'terry', t0: 41.85, state: FLICK },
      { type: 'f3_smoke', id: 'f3.smoke', t0: 49.35 },
      { type: 'label', id: 'f3.lbDead', text: '（没电了）', at: [505, 318], rot: -4, t0: 49.5, t1: 51.6, target: { target: 'f3.bulb2.bulb', dx: 28, dy: -10 }, bend: 0.2, gap: 12 },
    ],
    sfx: [[21.3, 'boing'], [31.2, 'boing'], ...BURSTS.map(([b]) => [b, 'f3_fizz'])],
    subs: [
      { t0: 0.3, t1: 3.7, text: '小陶做题，一直有个法宝：' },
      { t0: 3.8, t1: 5.8, text: '灵光一闪。' },
      { t0: 5.9, t1: 11.1, text: '题目一来，脑子里“叮”一声，答案就出来了。' },
      { t0: 11.5, t1: 15.25, text: '叮！叮！叮！' },
      { t0: 15.35, t1: 20.15, text: '十岁这年，他开始准备国际数学奥林匹克。' },
      { t0: 20.25, t1: 23.25, text: '这里的题，可不一样。' },
      { t0: 23.35, t1: 27.15, text: '一天四个半小时，只有三道题。' },
      { t0: 27.25, t1: 31.05, text: '平均一道题，要想一个半小时。' },
      { t0: 31.15, t1: 33.82, text: '“一个半小时？”', voice: 'kid' },
      { t0: 33.92, t1: 38.11, text: '“我做一道题，一般只要一分钟！”', voice: 'kid' },
      { t0: 38.61, t1: 41.61, text: '第一道难题摆在面前。' },
      { t0: 41.71, t1: 44.91, text: '他等着那一声“叮”……' },
      { t0: 45.61, t1: 47.61, text: '等啊等……' },
      { t0: 48.51, t1: 50.71, text: '没有“叮”。' },
    ],
  });
})();
