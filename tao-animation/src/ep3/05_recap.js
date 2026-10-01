// 上集回顾：小陶学会了把过程写出来（第 2 集结尾的那张纸）；可是要写清楚，先得想出来——要是怎么看都看不出来呢？
(() => {
  const FL = 770, PG = [430, 380], TX = 1330;
  const LINES = ['① 奇数：两个两个排，多一个。', '② 把两个奇数放在一起。', '③ 多的两个，凑成一对。', '所以：全部成对，是偶数。'];   // = ep2's last page
  defineScene({
    id: 'recap', chapter: '上集回顾', dur: 17.7, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]]],
        pose: [[0, 'stand'], [4.6, { ...POSE.stand, armScale: 1.5, armL: [128, 10] }, 0.12, 'back'], [9.0, 'thinkStand', 0.15], [13.2, { ...POSE.stand, lean: -5, tilt: -6 }, 0.1, 'back']],
        face: [[0, 'smile'], [4.6, 'proud', 0.05], [9.0, 'focus', 0.05], [13.2, 'jaw', 0.05], [14.9, 'puzzled', 0.08]],
        turn: [[0, -0.45], [9.0, -0.2, 0.1], [13.2, -0.35, 0.08]],
        gaze: [[0, 'page'], [4.6, [1100, 210]], [6.7, 'viewer'], [9.0, 'chain'], [13.2, 'qmT']],
        squash: [[0, 1], [13.2, 0.9, 0.05], [13.26, 1, 0.22, 'back']],
      },
    },
    targets: () => ({ page: PG, chain: [760, 330], qmT: [800, 640] }),
    fx: [
      { type: 'title', id: 'stampR', text: '上集回顾', x: 150, y: 110, size: 44, t0: -0.1, t1: 9.0, color: 'red', rot: -6 },
      // ep2's last page, already written and checked
      { type: 'prop', kind: 'e3_page', id: 'pg', at: PG, rot: -2, t0: -0.3, t1: 9.0, w: 640, h: 440, lines: 4, title: '写出过程' },
      ...LINES.map((s, i) => ({ type: 'scribe', id: 'ln' + i, text: s, x: PG[0] - 256, y: PG[1] - 66 + i * 72, size: 38, t0: -2, t1: 9.0, cps: 40, z: Z.set + 1 })),
      ...LINES.map((s, i) => ({ type: 'write', id: 'ck' + i, text: '✓', x: PG[0] + 262, y: PG[1] - 96 + i * 72, size: 46, t0: 0.6 + i * 0.45, t1: 9.0, speed: 1800, color: 'red', w: 6, sfx: 'pen', z: Z.annot })),
      { type: 'qm', id: 'qm', pos: [[0, [870, 770]], [13.0, [800, 770], 0.3, 'back']], size: 170, signSize: 52, t0: -1, silent: true,
        act: [[0, 'nod'], [3.2, 'idle'], [13.0, 'hop'], [14.0, 'tap']], mood: [[0, 'happy'], [13.0, 'doubt']],
        sign: [[0, null], [13.3, '看不出来呢？']], gaze: [[0, 'page'], [4.6, 'terry'], [13.0, 'viewer']] },
      // ep2's two golden lines
      { type: 'title', id: 'w1', text: '看出来，靠聪明；', x: 1100, y: 170, size: 56, t0: 4.7, t1: 9.0 },
      { type: 'title', id: 'w2', text: '写清楚，靠练习。', x: 1100, y: 250, size: 56, t0: 6.7, t1: 9.0, underline: true },
      // but first you have to figure it out
      { type: 'title', id: 'c1', text: '想出来', x: 470, y: 330, size: 92, t0: 11.2, t1: 12.95, color: 'red', rot: -3 },
      { type: 'h3_arrow', id: 'ar', from: [610, 330], to: [800, 330], t0: 11.5, t1: 12.95 },
      { type: 'title', id: 'c2', text: '写清楚', x: 940, y: 330, size: 92, t0: 9.8, t1: 12.95 },
      { type: 'label', id: 'lbFirst', text: '先得', size: 56, at: [470, 170], rot: -4, t0: 11.3, t1: 12.95, target: [470, 268], gap: 8 },
      // the problem that doesn't give itself away
      { type: 'h3_qs', id: 'qs', t0: 13.6 },
    ],
    subs: [
      { t0: 0.3, t1: 4.5, text: '上一集，小陶学会了把过程写出来。' },
      { t0: 4.6, t1: 8.9, text: '看出来，靠聪明；写清楚，靠练习。' },
      { t0: 9.0, t1: 12.8, text: '可是，要写清楚，先得想出来。' },
      { t0: 12.95, t1: 17.15, text: '要是一道题，怎么看都看不出来呢？' },
    ],
  });
  /** a hand-drawn arrow drawn in. {from, to, t0, t1} */
  COMP.h3_arrow = {
    draw(fx, t) { if (t < fx.t0 || t >= fx.t1) return; arrow(fx.id, fx.from, fx.to, { p: EASE.out(clamp((t - fx.t0) / 0.3)), w: 6, bend: -0.12 }); },
    cues: fx => [[fx.t0, 'swish']],
  };
  /** red question marks popping around Terry's head, one after another */
  COMP.h3_qs = {
    draw(fx, t, F) {
      const an = F.anchors.terry; if (!an || t < fx.t0) return;
      [[-150, -40, 84, -12], [130, -90, 100, 10], [-60, -170, 70, 14]].forEach(([dx, dy, s, r], i) => {
        const q = clamp((t - fx.t0 - i * 0.45) / 0.2); if (q <= 0) return;
        text(fx.id + i, '？', an.head[0] + dx, an.head[1] + dy, { size: s, color: C.red, rot: r, scale: EASE.back(q), z: Z.annot });
      });
    },
    cues: fx => [0, 1, 2].map(i => [fx.t0 + i * 0.45, 'boop']),
  };
})();
