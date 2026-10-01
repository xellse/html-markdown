// “卡住”是什么感觉：脑子里一团乱麻，纸上一片空白，时间一分一分过去，纸团越堆越多。
// 对一个习惯了“一眼看出来”的孩子，卡住还会让人怀疑自己——红笔旁白说：不是。卡住 ≠ 笨，= 题目终于够难了。
// （演绎：这是对“卡住”这种普遍感受的描写，不是某一次真实事件。）
(() => {
  const FL = 780, DX = 520, DTOP = 610, DW = 360, SEAT = 618;
  const CL = [1065, 300];                                   // where the thought clouds and the big words live

  /* ---------------- the blank sheet on the desk (seen a little from above) ---------------- */
  const SHEET = [[DX - 76, DTOP + 1], [DX - 62, DTOP - 22, 1], [DX + 62, DTOP - 22, 1], [DX + 76, DTOP + 1, 1], [DX - 76, DTOP + 1, 1]];
  COMP.f3_sheet = {
    draw() { stroke('f3s.sheet', SHEET, { z: Z.desk + 1, w: 4, fill: C.paper }); },
  };

  /* ---------------- wall clock: 1 min → 10 min → 20 min, each a quick whirl ---------------- */
  const WC = { c: [215, 215], r: 88 };
  const JUMPS = [[9.5, 1], [10.3, 10], [11.25, 20]];
  const wcMin = t => {
    let m = 0, prev = 0;
    JUMPS.forEach(([tj, v]) => { if (t >= tj) { m = lerp(prev, v, EASE.out(clamp((t - tj) / 0.35))); } prev = v; });
    return m + Math.max(0, t - 11.6) * 0.5;                // then it keeps creeping on
  };
  const wcPt = (a, rr) => [WC.c[0] + Math.sin(a * RAD) * rr, WC.c[1] - Math.cos(a * RAD) * rr];
  COMP.f3_wclock = {
    draw(fx, t) {
      const { c, r } = WC, z = Z.set + 1, k = 'f3s.wc', m = wcMin(t);
      stroke(k + '.nail', [[c[0] - 26, c[1] - r - 2], [c[0], c[1] - r - 34, 1], [c[0] + 26, c[1] - r - 2]], { z, w: 2.2, color: C.pencil });
      stroke(k + '.o', ringPts(k + '.o', c[0], c[1], r, r, { n: 14, a0: -110, sweep: 374, rv: 0.02 }), { z, w: 6, fill: C.paper });
      for (let i = 0; i < 12; i++) { const big = i % 3 === 0; stroke(k + '.t' + i, [wcPt(i * 30, r * (big ? 0.66 : 0.74)), wcPt(i * 30, r * 0.84)], { z: z + 0.1, w: big ? 4 : 2.6 }); }
      // motion blur right after each jump
      JUMPS.forEach(([tj, v], j) => {
        const u = (t - tj) / 0.45; if (u <= 0 || u >= 1) return;
        const from = j ? JUMPS[j - 1][1] : 0, a1 = m * 6, a0 = Math.max(from * 6, a1 - 70);
        [0.48, 0.6].forEach((rr, q) => stroke(k + '.bl' + j + q, [0, 1, 2, 3, 4, 5].map(i => wcPt(lerp(a0, a1, i / 5) - 6, r * rr)), { z: z + 0.15, w: 2.4, color: C.pencil, opacity: 1 - u, boil: 0.6 }));
      });
      stroke(k + '.hh', [c, wcPt(90 + m * 0.5, r * 0.44)], { z: z + 0.2, w: 6.5 });
      stroke(k + '.hm', [c, wcPt(m * 6, r * 0.68)], { z: z + 0.2, w: 4.5 });
      dot(k + '.cd', c, 5, C.ink, z + 0.3);
    },
    cues: () => JUMPS.flatMap(([tj]) => [[tj, 'f3s_tick'], [tj + 0.05, 'whip']]),
  };
  SFX.define('f3s_tick', tone => { tone('sine', 1500, 900, 0.03, 0.12); tone('sine', 1300, 800, 0.03, 0.1, null, 0.12); });
  // the red time notes beside the clock: number hand-written, "分钟" in the pen font
  const MINS = [['1', 9.5, 160], ['10', 10.3, 228], ['20', 11.25, 296]];

  /* ---------------- 一团乱麻: one long scribbled loop-de-loop, slowly turning ---------------- */
  const TANGLE = (() => {
    // loops of slowly changing size and centre, laid over each other like a ball of string
    const pts = [[-190, 64], [-150, 40], [-112, 46]];                       // a loose end
    for (let i = 0; i <= 96; i++) {
      const th = i * 0.5, r = 1 - 0.38 * Math.abs(Math.sin(i * 0.131 + 0.7)) - 0.16 * Math.sin(i * 0.057);
      pts.push([118 * r * Math.cos(th) + 20 * Math.sin(i * 0.23), 80 * r * Math.sin(th * 1.07 + 0.4) + 14 * Math.cos(i * 0.19)]);
    }
    const e = pts[pts.length - 1];
    pts.push([e[0] + 46, e[1] + 30], [e[0] + 84, e[1] + 22], [e[0] + 116, e[1] + 52]);   // and another
    return pts;
  })();
  COMP.f3_tangle = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0;
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(lt * 14);
      stroke('f3s.tg', TANGLE, { z: Z.fx + 1, w: 3.4, draw: EASE.io(clamp(lt / 1.1)), boil: 0.8 });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pen'], [fx.t0 + 0.4, 'pen'], [fx.t0 + 0.8, 'pen']],
  };
  /** inside the memory cloud: a happy little Terry (the bulb above him is the shared e3_bulb) */
  PROPS.f3_memo = () => { portrait('f3s.memo', 0, 0, 44, { z: Z.fx + 1, happy: true }); };

  /** a little pencil rain cloud over his head while he shrinks */
  COMP.f3_gloom = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors.terry; if (!a) return;
      const lt = t - fx.t0, p = EASE.back(clamp(lt / 0.35)), op = clamp((fx.t1 - t) / 0.2), c = [a.headTop[0] + 6, a.headTop[1] - 92], k = 'f3s.gl';
      DL.save(); DL.translate(c[0], c[1]); DL.scale(p);
      stroke(k, ringPts(k, 0, 0, 74, 30, { n: 11, closed: true, rv: 0.2 }), { z: Z.fx, w: 3.4, closed: true, fill: C.paper, opacity: op });
      [[-40, -6, 30], [-12, 4, 44], [18, -8, 36], [44, 2, 24]].forEach(([x, y, l], i) => stroke(k + '.h' + i, [[x - l / 2, y + 8], [x + l / 2, y - 8]], { z: Z.fx + 0.1, w: 2.2, color: C.pencil, opacity: op, boil: 0.7 }));
      DL.restore();
      [-44, -14, 16, 46].forEach((dx, i) => {
        const ph = ((lt * 1.6 + i * 0.27) % 1), y = c[1] + 36 + ph * 46;
        stroke(k + '.r' + i, [[c[0] + dx, y], [c[0] + dx - 4, y + 14]], { z: Z.fx, w: 2.6, color: C.pencil, opacity: op * Math.sin(Math.PI * ph) * clamp(lt / 0.4) });
      });
    },
    cues: fx => [[fx.t0, 'boop']],
  };

  /* ---------------- crumpled paper balls piling up on both sides of the desk ---------------- */
  const BR = 24, G0 = 757, G1 = G0 - 42, G2 = G1 - 42;
  const BALLS = [[250, G0], [746, G0], [296, G0], [700, G0], [342, G0], [792, G0], [273, G1], [723, G1], [319, G1], [769, G1], [296, G2], [746, G2]]
    .map((p, i) => ({ to: p, t0: 9.65 + i * 0.32 }));
  const FROM = [DX, DTOP - 26];
  COMP.f3_balls = {
    draw(fx, t) {
      BALLS.forEach((b, i) => {
        if (t < b.t0) return;
        const u = clamp((t - b.t0) / 0.45), e = EASE.io(u), k = 'f3s.ball' + i;
        const c = [lerp(FROM[0], b.to[0], e), lerp(FROM[1], b.to[1], EASE.in(u)) - Math.sin(Math.PI * u) * 150];
        const rot = (b.to[0] < DX ? -1 : 1) * 260 * e;
        DL.save(); DL.translate(c[0], c[1]); DL.rotate(rot); DL.scale(lerp(0.5, 1, e));
        const z = Z.desk + 2 + i * 0.01;
        stroke(k, ringPts(k, 0, 0, BR, BR * 0.92, { n: 10, closed: true, rv: 0.16 }), { z, w: 3.6, closed: true, fill: C.paper });
        stroke(k + '.c0', [[-14, -6], [-3, 2], [-8, 11]], { z: z + 0.001, w: 2.2, boil: 0.6 });
        stroke(k + '.c1', [[4, -14], [9, -3], [17, 0]], { z: z + 0.001, w: 2.2, boil: 0.6 });
        DL.restore();
      });
    },
    cues: () => BALLS.map(b => [b.t0, 'paper']),
  };

  /* ---------------- “不是。” slammed down by the red pen ---------------- */
  COMP.f3_slam = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, u = clamp(lt / 0.16), sc = lerp(2.3, 1, EASE.in(u));
      text('f3s.slam', fx.text, fx.x, fx.y, { size: fx.size, color: C.red, z: Z.annot, rot: fx.rot, scale: sc, opacity: clamp(u * 2.5), halo: 12 });
      const q = (lt - 0.16) / 0.35;
      if (q > 0 && q < 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => {
        const bx = fx.x + sx * (fx.size * 1.55 + 20 * q), by = fx.y + sy * (fx.size * 0.55 + 14 * q);
        stroke('f3s.slamL' + i, [[bx, by], [bx + sx * 26, by + sy * 18]], { z: Z.annot, w: 4.5, color: C.red, opacity: 1 - q, boil: 0.6 });
      });
    },
    cues: fx => [[fx.t0, 'whoosh'], [fx.t0 + 0.15, 'stamp']],
  };

  /* ---------------- 卡住 ≠ 笨 / = 题目终于够难了 ---------------- */
  const L1Y = 288, L1S = 120, NEQ_S = 110, L2Y = 440, L2S = 84;
  const neqW = writeWidth('≠', NEQ_S), eqW = writeWidth('=', L2S);
  const L1X = CL[0] - (2 * L1S + 24 + neqW + 24 + L1S) / 2;
  const NEQ_X = L1X + 2 * L1S + 24, BEN_X = NEQ_X + neqW + 24;
  const L2X = CL[0] - (eqW + 22 + 7 * L2S) / 2, L2TX = L2X + eqW + 22;
  const HARD = '题目终于够难了', HARD_T = 32.0, HARD_CPS = 6;

  /* ---------------- poses ---------------- */
  const SIT = POSE.sitBase;
  const desk = (dx, dy = -3, bend = 'down') => ({ w: 1, to: 'desk', dx, dy, bend });
  Object.assign(POSE, {
    f3_sitPaper: { ...SIT, tilt: 6, ikL: desk(-48), ikR: desk(48) },
    f3_slump: { ...SIT, hop: 34, lean: 4, tilt: 24, armScale: 1.2, ikL: desk(-52), ikR: desk(38) },
    f3_hunch: { ...SIT, hop: 10, tilt: -4, ikL: desk(-36), ikR: desk(36) },
    f3_shrink: { ...SIT, hop: 22, tilt: 10, ikL: desk(-30, -3, 'out'), ikR: desk(30, -3, 'out') },
    f3_up: { ...SIT, lean: -2, tilt: -8, ikL: desk(-46), ikR: desk(46) },
    f3_fists: { ...SIT, lean: 1, tilt: 3, armScale: 1.1, ikL: desk(-40, -10, 'out'), ikR: desk(40, -10, 'out') },
  });

  defineScene({
    id: 'stuck', chapter: '卡住了', dur: 35.8, floor: FL,
    cast: { terry: { ...E3.terry, desk: [DX, DTOP - 3] } },
    tracks: {
      terry: {
        pos: [[0, [DX, SEAT]]],
        pose: [[0, 'f3_sitPaper'], [3.85, 'thinkChin', 0.12, 'back'], [6.6, 'f3_sitPaper', 0.12], [9.3, 'chinHand', 0.12, 'back'],
          [10.3, 'sitScratch', 0.12, 'back'], [11.25, 'f3_slump', 0.14, 'back'], [13.65, 'f3_hunch', 0.2], [18.2, 'f3_shrink', 1.2],
          [26.55, 'sitUp', 0.07, 'back'], [28.7, 'f3_up', 0.2], [31.85, 'f3_fists', 0.1, 'back']],
        face: [[0, 'focus'], [1.75, 'puzzled', 0.06], [6.6, 'bored', 0.08], [9.3, 'bored'], [10.3, 'puzzled', 0.06], [11.25, 'sheepish', 0.08],
          [13.65, 'neutral', 0.1], [18.2, 'sheepish', 0.3], [26.55, 'surprised', 0.05], [28.7, 'focus', 0.1], [31.85, 'effort', 0.06]],
        turn: [[0, 0], [3.85, 0.15, 0.12], [9.3, -0.35, 0.12], [10.3, 0, 0.12], [13.65, 0.3, 0.15], [18.2, 0, 0.3], [26.55, 0.35, 0.08], [33.9, 0, 0.15]],
        gaze: [[0, 'paper'], [3.85, 'viewer'], [6.6, 'paper'], [9.3, 'wclock'], [10.3, 'viewer'], [11.25, 'paper'], [13.7, 'cloud'],
          [18.2, 'down'], [21.9, 'viewer'], [26.55, 'nope'], [28.7, 'words'], [33.9, 'paper']],
        squash: [[0, 1], [10.3, 1.05, 0.05], [10.36, 1, 0.2, 'back'], [11.25, 0.92, 0.08], [11.33, 1, 0.25, 'back'],
          [18.2, 0.8, 1.6], [26.55, 1.12, 0.06], [26.62, 1, 0.28, 'back'], [31.85, 1.08, 0.06], [31.92, 1, 0.25, 'back'],
          [33.6, 1.05, 0.05], [33.66, 1, 0.22, 'back']],
      },
    },
    targets: () => ({ paper: [DX, DTOP - 12], wclock: WC.c, cloud: CL, down: [DX, 760], nope: [CL[0], 320], words: [CL[0], 360] }),
    set: [
      { type: 'floor' },
      { type: 'stool', x: DX, seat: SEAT },
      { type: 'desk', x: DX, top: DTOP, w: DW },
    ],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      { type: 'f3_sheet', id: 'f3s.sheetC' },
      { type: 'f3_wclock', id: 'f3s.wclock' },
      { type: 'title', id: 'f3s.stuck', text: '卡住', x: CL[0], y: 290, size: 150, t0: 1.75, t1: 3.8, underline: true },
      // 脑子里一团乱麻
      { type: 'thought', id: 'f3s.cloud1', at: CL, rx: 240, ry: 140, t0: 3.88, t1: 9.2, from: { char: 'terry', part: 'headTop', dx: 24, dy: -8 } },
      { type: 'f3_tangle', id: 'f3s.tangle', at: [CL[0] - 10, CL[1] - 4], t0: 4.15, t1: 9.2 },
      // 纸上一片空白
      { type: 'label', id: 'f3s.lbBlank', text: '（空白）', at: [800, 560], rot: 3, t0: 7.25, t1: 9.2, target: [DX + 50, DTOP - 12], bend: -0.25, gap: 8 },
      // 1 分钟，10 分钟，20 分钟……
      ...MINS.flatMap(([n, t0, y], i) => [
        { type: 'write', id: 'f3s.mn' + i, text: n, x: 384, y: y - 26, size: 52, t0, t1: 13.55, speed: 2600, color: 'red', w: 6, sfx: 'pen', anchor: 'end', z: Z.annot },
        { type: 'title', id: 'f3s.mt' + i, text: '分钟', x: 398, y: y + 2, size: 46, t0: t0 + 0.12, t1: 13.55, color: 'red', anchor: 'start', dur: 0.2, sfx: 'pen' },
      ]),
      { type: 'f3_balls', id: 'f3s.balls' },
      // 习惯了“一眼看出来”：a memory of the old ding
      { type: 'thought', id: 'f3s.cloud2', at: CL, rx: 185, ry: 135, t0: 13.72, t1: 17.95, from: { char: 'terry', part: 'headTop', dx: 24, dy: -8 } },
      { type: 'prop', kind: 'f3_memo', id: 'f3s.memo', at: [CL[0], CL[1] + 52], t0: 13.85, t1: 17.95, drawDur: 0 },
      { type: 'e3_bulb', id: 'f3s.memoBulb', at: [CL[0], CL[1] - 20], size: 62, t0: 13.85, t1: 17.95, state: [[-1, 'on']], z: Z.fx + 2 },
      // “我是不是……没那么聪明？”
      { type: 'f3_gloom', id: 'f3s.gloom', t0: 18.7, t1: 21.8 },
      { type: 'thought', id: 'f3s.cloud3', at: CL, rx: 262, ry: 132, t0: 21.85, t1: 26.5, from: { char: 'terry', part: 'headTop', dx: 24, dy: -8 } },
      { type: 'scribe', id: 'f3s.doubt1', text: '我是不是……', x: CL[0] - 162, y: CL[1] - 34, size: 54, t0: 22.0, t1: 26.5, cps: 8, z: Z.fx + 1, sfx: 'f3s_none' },
      { type: 'scribe', id: 'f3s.doubt2', text: '没那么聪明？', x: CL[0] - 162, y: CL[1] + 36, size: 54, t0: 22.95, t1: 26.5, cps: 7, z: Z.fx + 1, sfx: 'f3s_none' },
      // 不是。
      { type: 'f3_slam', id: 'f3s.no', text: '不是。', x: CL[0] - 10, y: 320, size: 230, rot: -6, t0: 26.5, t1: 28.55 },
      // 卡住 ≠ 笨
      { type: 'title', id: 'f3s.k1', text: '卡住', x: L1X, y: L1Y, size: L1S, t0: 28.72, anchor: 'start', dur: 0.25 },
      { type: 'write', id: 'f3s.neq', text: '≠', x: NEQ_X, y: L1Y - NEQ_S * 0.62, size: NEQ_S, t0: 29.5, speed: 1400, gap: 0.06, w: 7, sfx: 'pen' },
      { type: 'title', id: 'f3s.k2', text: '笨', x: BEN_X, y: L1Y, size: L1S, t0: 30.5, anchor: 'start', dur: 0.25 },
      // = 题目终于够难了
      { type: 'write', id: 'f3s.eq', text: '=', x: L2X, y: L2Y - L2S * 0.62, size: L2S, t0: 31.85, speed: 1400, w: 6.5, sfx: 'pen' },
      { type: 'band', id: 'f3s.hi', rect: [L2TX + 4 * L2S, L2Y - L2S * 0.5, 3 * L2S, L2S], t0: 33.6, dur: 0.4 },
      { type: 'scribe', id: 'f3s.hard', text: HARD, x: L2TX, y: L2Y, size: L2S, t0: HARD_T, cps: HARD_CPS },
    ],
    subs: [
      { t0: 0.3, t1: 3.7, text: '这种感觉，叫做“卡住”。' },
      { t0: 3.8, t1: 6.4, text: '脑子里一团乱麻，' },
      { t0: 6.5, t1: 8.9, text: '纸上一片空白。' },
      { t0: 9.3, t1: 13.1, text: '一分钟，十分钟，二十分钟……' },
      { t0: 13.6, t1: 18.0, text: '对一个习惯了“一眼看出来”的孩子，' },
      { t0: 18.1, t1: 21.7, text: '卡住还有一种更难受的感觉：' },
      { t0: 21.8, t1: 25.61, text: '“我是不是……没那么聪明？”', voice: 'kid' },
      { t0: 26.31, t1: 28.4, text: '不是。' },
      { t0: 28.56, t1: 31.66, text: '卡住，不说明你笨；' },
      { t0: 31.76, t1: 35.16, text: '说明这道题，终于够难了。' },
    ],
  });
  SFX.define('f3s_none', () => {});
})();
