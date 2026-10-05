// 尾声（全系列）：六级台阶——看出来 / 写清楚 / 想通 / 直视错 / 好玩也认真 / 好好用功；
// 他给学得快的孩子们写的话（自己推一推、去查一查、问问别人）；
// 小问号从陶哲轩头上跳出来（他头上还留着一个小小的“?”），跳到一个新的孩子身边，孩子的本子上写着 Jasper：“轮到你了！”
(() => {
  const FL = 780, ST = [[200, 0.6], [5.6, 1], [7.6, 2], [10.1, 3], [12.4, 4], [15.2, 5], [18.7, 6]];   // [time, step] (0 = ground)
  const STEP = i => [260 + i * 170, FL - i * 70];                                                      // top-left corner of step i (1..6)
  const LAB = ['看出来', '写清楚', '想通', '直视错', '好玩也认真', '好好用功'];
  const LT = [5.3, 7.4, 9.8, 12.2, 14.9, 18.4];
  const S1 = 23.2, S2 = 37.4;   // section changes
  /** 六级台阶，每级一个红色标签。{t0, t1} */
  COMP.h6_stairs = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id, op = 1 - clamp((t - fx.t1 + 0.35) / 0.35), z = Z.set;
      for (let i = 1; i <= 6; i++) {
        const p = EASE.out(clamp((t - fx.t0 - (i - 1) * 0.12) / 0.4)); if (p <= 0) continue;
        const [x, y] = STEP(i);
        stroke(k + '.s' + i, [[x, y + 70], [x, y, 1], [x + 170, y, 1], [x + 170, FL]], { z, w: 5, draw: p, opacity: op });   // sharp corners: a step, not an arch
        const q = clamp((t - LT[i - 1]) / 0.25);
        if (q > 0) text(k + '.l' + i, LAB[i - 1], x + 85, y + 36, { size: i === 5 ? 34 : 40, color: C.red, z: Z.annot, opacity: q * op, scale: lerp(1.4, 1, EASE.back(q)) });
      }
      stroke(k + '.g', [[120, FL], [260, FL]], { z, w: 5, opacity: op });
    },
    cues: fx => LT.map(t => [t, 'pen']),
  };
  // little Tao hops up one step per label
  const hopPos = t => {
    let i = 0; for (const [tt, s] of ST) if (t >= tt) i = s;
    const prev = ST.filter(([tt]) => tt <= t).slice(-2)[0] || ST[0], cur = ST.filter(([tt]) => tt <= t).slice(-1)[0] || ST[0];
    const u = clamp((t - cur[0]) / 0.35), from = prev[1], to = cur[1];
    const xy = s => s === 0 ? [180, FL] : [STEP(s)[0] + 85, STEP(s)[1]];
    const a = xy(from), b = xy(to);
    return [lerp(a[0], b[0], EASE.io(u)), lerp(a[1], b[1], EASE.io(u)) - Math.sin(Math.PI * u) * 60];
  };
  /** 一个孩子的书桌：桌子 + 一本摊开的本子，封面写 Jasper。{at, t0} */
  COMP.h6_desk = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.5)), [x, y] = fx.at, k = fx.id, z = Z.desk;
      stroke(k + '.top', [[x - 170, y], [x + 170, y]], { z, w: 6, draw: p });
      stroke(k + '.l1', [[x - 150, y], [x - 150, FL]], { z, w: 5, draw: p });
      stroke(k + '.l2', [[x + 150, y], [x + 150, FL]], { z, w: 5, draw: p });
      stroke(k + '.bk', [[x - 120, y - 6], [x - 110, y - 46, 1], [x + 20, y - 40, 1], [x + 10, y - 2, 1]], { z: z + 0.2, w: 4, closed: true, fill: C.paper, draw: p });
      if (p > 0.6) text(k + '.nm', 'Jasper', x - 50, y - 24, { size: 34, z: z + 0.3, rot: -4 });
    },
    cues: fx => [[fx.t0, 'paper']],
  };
  defineScene({
    id: 'ending', chapter: '尾声', dur: 45.1, floor: FL,
    cast: { little: { ...E6.kid, hair: 'tuft', H: 230 }, tao: E6.taoAdult, kid: E6.kid },
    tracks: {
      little: {
        enter: 0.4,
        pos: [[0, t => hopPos(t)], [S1 - 0.5, t => { const u = EASE.in(clamp((t - (S1 - 0.5)) / 0.45)); const a = hopPos(S1 - 0.5); return [lerp(a[0], 1800, u), a[1] - Math.sin(Math.PI * Math.min(u, 0.5)) * 50]; }]],
        pose: [[0, 'stand'], [18.9, 'kidCheer', 0.12, 'back']],
        face: [[0, 'smile'], [18.9, 'joy', 0.05]],
        turn: [[0, 0.3]],
        squash: [[0, 1]],
      },
      tao: {
        enter: S1 - 0.1,
        pos: [[0, [520, FL]]],
        pose: [[0, 'stand'], [27.4, 'present', 0.2], [S2, 'stand', 0.2], [40.0, t => ({ ...POSE.wave, armScale: 1.6, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 40) * 11)] }), 0.12]],
        face: [[0, 'smile'], [S2, 'joy', 0.06]],
        turn: [[0, 0.3]],
        gaze: [[0, 'viewer'], [S2 + 0.3, 'kid']],
      },
      kid: {
        enter: S2 + 0.4,
        pos: [[0, [1385, FL]]],
        pose: [[0, 'stand'], [43.0, 'kidCheer', 0.12, 'back']],
        face: [[0, 'focus'], [42.4, 'surprised', 0.05], [43.0, 'joy', 0.05]],
        turn: [[0, -0.3]],
        gaze: [[0, 'book'], [42.4, 'qmT']],
      },
    },
    targets: F => ({ kid: [1385, 520], book: [1160, 610], qmT: F.targets['qm'] || [1080, 500] }),
    fx: [
      // ① 六级台阶
      { type: 'h6_stairs', id: 'st', t0: 0.3, t1: S1 },
      { type: 'title', id: 'six', text: '六集，一级一级', x: 400, y: 200, size: 60, t0: 0.6, t1: S1, color: 'red', rot: -3 },
      // ② 给学得快的孩子们写的话：三件事
      { type: 'title', id: 'q1', text: '说不通？去弄清楚：', x: 1100, y: 240, size: 64, t0: 27.4, t1: S2 },
      { type: 'title', id: 'a1', text: '① 自己推一推', x: 1000, y: 370, size: 56, t0: 32.3, t1: S2, color: 'red', anchor: 'start' },
      { type: 'title', id: 'a2', text: '② 去查一查', x: 1000, y: 460, size: 56, t0: 33.6, t1: S2, color: 'red', anchor: 'start' },
      { type: 'title', id: 'a3', text: '③ 问问别人', x: 1000, y: 550, size: 56, t0: 35.0, t1: S2, color: 'red', anchor: 'start' },
      { type: 'title', id: 'src', text: '（2004 年，写给学得快的孩子们）', x: 1100, y: 650, size: 36, t0: 24.0, t1: S2, color: 'red' },
      // ③ 小问号跳到新的孩子身边；陶哲轩头上还留着一个小小的“?”
      { type: 'h6_desk', id: 'desk', at: [1220, 650], t0: S2 + 0.2 },
      { type: 'qm', id: 'qm', pos: [[0, [600, 330]], [S2 + 0.4, [600, 330]], [39.6, [1010, 560], 1.6, 'io']], size: 150, t0: S2 + 0.1, act: [[0, 'hop'], [41.4, 'wave']], mood: [[0, 'happy']], sign: [[0, null], [42.5, '轮到你了！']], signSize: 56 },
      { type: 'mark', id: 'mk', char: '?', on: ['tao'], dx: 60, t0: 39.8 },
    ],
    subs: [
      { t0: 0.3, t1: 4.9, text: '六集，我们跟着小陶，一级一级往上走：' },
      { t0: 5.3, t1: 9.5, text: '看出来，靠聪明；写清楚，靠练习；' },
      { t0: 9.8, t1: 14.6, text: '想通，靠不放弃；变强，靠直视自己的错；' },
      { t0: 14.9, t1: 18.1, text: '好玩的事，也要认真做；' },
      { t0: 18.4, t1: 22.8, text: '聪明总有不够用的时候：要好好用功。' },
      { t0: 23.7, t1: 27.1, text: '他给学得快的孩子们写过：' },
      { t0: 27.4, t1: 32.0, text: '“如果有什么说不通，别怕，去弄清楚：' },
      { t0: 32.1, t1: 36.9, text: '自己推一推，去查一查，或者问问别人。”' },
      { t0: 37.8, t1: 42.2, text: '小问号，跳到了一个新的孩子身边——' },
      { t0: 42.6, t1: 44.6, text: '“轮到你了！”', voice: 'qm', say: '轮到你了！' },
    ],
  });
})();
