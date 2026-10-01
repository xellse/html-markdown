// 上集回顾：小陶学会了把过程写出来（第 2 集结尾的那张纸）；可是要写清楚，先得想出来——要是怎么看都看不出来呢？
(() => {
  const FL = 770, PG = [430, 380], TX = 1330;
  const LINES = ['① 奇数：一对一对，多一个。', '② 两个奇数放在一起，', '③ 多的两个凑成一对。'];
  defineScene({
    id: 'recap', chapter: '上集回顾', dur: 17.7, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        enter: 0.2,
        pos: [[0, [TX, FL]]],
        pose: [[0, 'stand'], [4.6, 'kidPoint', 0.12, 'back'], [9.0, 'thinkStand', 0.15], [12.95, { ...POSE.stand, lean: -5, tilt: -6 }, 0.1, 'back']],
        face: [[0, 'smile'], [4.6, 'proud', 0.05], [9.0, 'focus', 0.05], [12.85, 'jaw', 0.05], [14.6, 'puzzled', 0.08]],
        turn: [[0, -0.45], [4.6, 0.1, 0.1], [9.0, -0.2, 0.1], [12.95, -0.35, 0.08]],
        gaze: [[0, 'page'], [4.6, 'viewer'], [9.0, 'chain'], [12.95, 'big']],
        squash: [[0, 1], [12.95, 0.9, 0.05], [12.86, 1, 0.22, 'back']],
      },
    },
    targets: () => ({ page: PG, chain: [760, 330], big: [600, 380] }),
    fx: [
      { type: 'title', id: 'stampR', text: '上集回顾', x: 150, y: 110, size: 44, t0: -0.1, t1: 9.0, color: 'red', rot: -6 },
      // ep2's last page, already written and checked
      { type: 'prop', kind: 'e3_page', id: 'pg', at: PG, rot: -2, t0: -0.3, t1: 9.0, w: 600, h: 400, lines: 4, title: '写出过程' },
      ...LINES.map((s, i) => ({ type: 'scribe', id: 'ln' + i, text: s, x: PG[0] - 236, y: PG[1] - 60 + i * 80, size: 36, t0: -2, t1: 9.0, cps: 40, z: Z.set + 1 })),
      ...LINES.map((s, i) => ({ type: 'write', id: 'ck' + i, text: '✓', x: PG[0] + 214, y: PG[1] - 90 + i * 80, size: 54, t0: 0.6 + i * 0.5, t1: 9.0, speed: 1800, color: 'red', w: 6, sfx: 'pen', z: Z.annot })),
      { type: 'qm', id: 'qm', pos: [[0, [870, 700]], [12.95, [985, 760], 0.3, 'back']], size: 150, t0: -1, silent: true,
        act: [[0, 'nod'], [3.2, 'idle'], [12.95, 'hop'], [13.8, 'tap']], mood: [[0, 'happy'], [12.95, 'doubt']],
        sign: [[0, null], [13.2, '看不出来呢？']], gaze: [[0, 'page'], [4.6, 'terry'], [12.95, 'viewer']] },
      // ep2's two golden lines
      { type: 'title', id: 'w1', text: '看出来，靠聪明；', x: 1100, y: 170, size: 56, t0: 4.7, t1: 9.0 },
      { type: 'title', id: 'w2', text: '写清楚，靠练习。', x: 1100, y: 250, size: 56, t0: 6.7, t1: 9.0, underline: true },
      // but first you have to figure it out
      { type: 'title', id: 'c1', text: '想出来', x: 470, y: 330, size: 92, t0: 9.6, t1: 12.95, color: 'red', rot: -3 },
      { type: 'h3_arrow', id: 'ar', from: [610, 330], to: [800, 330], t0: 10.1, t1: 12.95 },
      { type: 'title', id: 'c2', text: '写清楚', x: 940, y: 330, size: 92, t0: 8.95, t1: 12.95 },
      { type: 'label', id: 'lbFirst', text: '先得', at: [470, 180], rot: -4, t0: 10.6, t1: 12.95, target: [470, 268], gap: 8 },
      // the problem that doesn't give itself away
      { type: 'h3_bigq', id: 'bq', at: [580, 400], t0: 12.95 },
    ],
    sfx: [[0.2, 'hop']],
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
  /** a big, blank problem sheet that thuds down, covered in scribbles and "?" — nothing you can see at a glance */
  COMP.h3_bigq = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, drop = EASE.in(clamp(lt / 0.25)), [cx, cy0] = fx.at, cy = lerp(cy0 - 500, cy0, drop);
      const W = 560, H = 520, z = Z.set + 1, sq = lt > 0.25 && lt < 0.5 ? 1 - 0.06 * Math.sin(Math.PI * (lt - 0.25) / 0.25) : 1;
      DL.save(); DL.translate(cx, cy + H / 2); DL.scale(1); DL.translate(0, -H / 2 * sq);
      stroke(fx.id + '.sh', [[-W / 2, -H / 2], [W / 2, -H / 2 + 6, 1], [W / 2 - 4, H / 2, 1], [-W / 2 + 6, H / 2 - 4, 1], [-W / 2, -H / 2, 1]], { z, w: 6, fill: C.paper });
      text(fx.id + '.t', '难题', -W / 2 + 40, -H / 2 + 52, { size: 44, anchor: 'start', z: z + 0.1 });
      for (let i = 0; i < 5; i++) {
        const y = -H / 2 + 120 + i * 62, x1 = W / 2 - 40 - (i % 2) * 70 - (i === 4 ? 160 : 0), pts = [];
        for (let k = 0; k <= 10; k++) pts.push([lerp(-W / 2 + 40, x1, k / 10), y + (k % 2 ? -4 : 3)]);
        stroke(fx.id + '.l' + i, pts, { z: z + 0.1, w: 3, boil: 0.6 });
      }
      DL.restore();
      // question marks popping around it, in the red pen
      [[-330, -150, 90, -12], [320, -200, 110, 10], [-300, 160, 76, 14], [-340, 20, 84, -8]].forEach(([dx, dy, s, r], i) => {
        const q = clamp((lt - 0.6 - i * 0.35) / 0.2); if (q <= 0) return;
        text(fx.id + '.q' + i, '？', cx + dx, cy0 + dy, { size: s, color: C.red, rot: r, scale: EASE.back(q), z: Z.annot });
      });
    },
    cues: fx => [[fx.t0 + 0.25, 'thud'], ...[0, 1, 2, 3].map(i => [fx.t0 + 0.6 + i * 0.35, 'boop'])],
  };
})();
