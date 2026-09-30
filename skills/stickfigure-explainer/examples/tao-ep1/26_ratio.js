// 数学小知识（续）：相邻两个斐波那契数相除 → 越来越接近 1.618…（黄金比）——“极限”
(() => {
  const LINES = [
    ['8 ÷ 5 = 1.6', 1.6], ['13 ÷ 8 = 1.625', 1.625], ['21 ÷ 13 = 1.615…', 21 / 13], ['34 ÷ 21 = 1.619…', 34 / 21], ['55 ÷ 34 = 1.617…', 55 / 34],
  ];
  const LX = 170, LY0 = 292, LDY = 86, LSIZE = 62, T0 = 3.3, TSTEP = 1.25;
  // little convergence plot: values bounce above/below the golden ratio and settle
  const PX0 = 820, PX1 = 1250, vy = v => 660 - (v - 1.598) / 0.032 * 360, GOLD = (1 + Math.sqrt(5)) / 2;
  const px = i => PX0 + 40 + i * ((PX1 - PX0 - 80) / 4);

  COMP.r1_plot = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0;
      // axis
      stroke('r1.ax', [[PX0, 690], [PX0, 290]], { z: Z.set, w: 3, color: C.pencil, draw: EASE.out(clamp(lt / 0.4)) });
      stroke('r1.ay', [[PX0, 690], [PX1, 690]], { z: Z.set, w: 3, color: C.pencil, draw: EASE.out(clamp(lt / 0.4)) });
      // the golden-ratio line, dashed in red
      const gp = clamp((t - fx.goldT) / 0.6);
      if (gp > 0) {
        const y = vy(GOLD), n = 9;
        for (let i = 0; i < n; i++) {
          const a = PX0 + (PX1 - PX0) * i / n, b = a + (PX1 - PX0) / n * 0.55;
          if (i / n < gp) stroke('r1.g' + i, [[a, y], [b, y]], { z: Z.annot, w: 4, color: C.red, boil: 0.5 });
        }
        if (gp > 0.9) text('r1.gl', '1.618…', PX1 + 16, y, { size: 44, font: CFG.FONT_MIX, anchor: 'start', color: C.red, z: Z.annot, halo: 6 });
      }
      // points + zig-zag
      const pts = [];
      LINES.forEach(([, v], i) => {
        const ti = T0 + i * TSTEP + 1.0; if (t < ti) return;
        const p = [px(i), vy(v)]; pts.push(p);
        dot('r1.p' + i, p, 9 * EASE.back(clamp((t - ti) / 0.2)), C.ink, Z.annot);
      });
      if (pts.length > 1) stroke('r1.zz', pts, { z: Z.annot - 1, w: 3.5, boil: 0.6 });
    },
    cues: fx => LINES.map((_, i) => [T0 + i * TSTEP + 1.0, 'plip']).concat([[fx.goldT, 'swish']]),
  };

  defineScene({
    id: 'ratio', dur: 19.2, floor: 770,
    cast: {
      terry: { H: 225, head: 0.45, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.6,
        pos: [[0, [1420, 770]]],
        pose: [[0, 'stand'], [9.4, { armScale: 1.5, armL: [84, 6], armR: [16, 10] }, 0.12], [14.3, { armScale: 1.6, armL: [118, 42], armR: [118, 42] }, 0.12, 'back']],
        face: [[0, 'smile'], [3.3, 'focus', 0.05], [9.4, 'surprised', 0.05], [11.5, 'idea', 0.05], [14.3, 'joy', 0.05]],
        turn: [[0, -0.35]],
        gaze: [[0, 'viewer'], [3.3, 'lines'], [7.0, 'plot'], [11.5, 'viewer']],
        squash: [[0, 1], [14.2, 0.9, 0.08], [14.3, 1.1, 0.08], [14.4, 1, 0.25, 'back']],
      },
    },
    targets: () => ({ lines: [420, 480], plot: [1040, 480] }),
    fx: [
      { type: 'a6_factCard', id: 'card', t0: -0.2, box: [90, 92, 1510, 790], topic: '越来越接近……', rules: [] },
      ...LINES.map(([s], i) => ({ type: 'write', id: 'l' + i, text: s, x: LX, y: LY0 + i * LDY, size: LSIZE, t0: T0 + i * TSTEP, speed: 2900, gap: 0.02, glyphGap: 0.015, w: 5.5, sfx: 'pen', z: Z.board })),
      { type: 'r1_plot', id: 'plot', t0: 3.0, goldT: 9.4 },
      { type: 'label', id: 'lbGold', text: '黄金比', at: [1380, 280], rot: -3, t0: 11.5, t1: 19.2, target: [1330, vy(GOLD) - 22], bend: 0.2, gap: 8 },
      { type: 'label', id: 'lbLim', text: '越来越接近一个数 = 极限', at: [1040, 738], rot: -2, t0: 14.3, t1: 19.2, target: [1150, vy(GOLD) + 22], bend: -0.2, gap: 10, size: 42 },
      { type: 'label', id: 'lbBook', text: '（《疯狂微积分》里讲过哦）', at: [440, 748], rot: 2, t0: 15.4, t1: 19.2, size: 32 },
    ],
    sfx: [[14.3, 'ding']],
    subs: [
      { t0: 0.3, t1: 3.0, text: '再告诉你一个秘密：' },
      { t0: 3.1, t1: 6.5, text: '用后一个数，除以前一个数，' },
      { t0: 6.6, t1: 11.4, text: '得数跳来跳去，越来越接近1.618……', say: '得数跳来跳去，越来越接近一点六一八。' },
      { t0: 11.5, t1: 14.2, text: '这个数叫“黄金比”。' },
      { t0: 14.3, t1: 19.0, text: '越来越接近一个数——这就是“极限”！' },
    ],
  });
})();
