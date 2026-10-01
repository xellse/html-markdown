// 开场：片名卡。小陶头顶一团乱麻，一抽，拉直成一条线，灯泡亮了。
(() => {
  const FL = 690, HX = 1300;
  /** 一团乱麻：参数曲线从"线团"插值到一条直线。{at, r, t0, t1, pull, pullDur} */
  COMP.h3_knot = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, N = 90, r = fx.r, [cx, cy] = fx.at;
      const u = EASE.io(clamp((t - fx.pull) / (fx.pullDur || 0.8))), spin = (t - fx.t0) * 0.9 * (1 - u);
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const th = i / N * 6 * Math.PI + spin;
        const a = [cx + r * (0.62 * Math.sin(1.3 * th + 1) + 0.38 * Math.cos(2.7 * th)), cy + r * (0.62 * Math.cos(1.7 * th) + 0.38 * Math.sin(3.1 * th + 2))];
        const b = [cx + lerp(-1.6, 1.6, i / N) * r, cy + Math.sin(i / N * Math.PI * 2) * 3];
        pts.push(lerp2(a, b, u));
      }
      stroke(fx.id, pts, { z: Z.fx, w: 4, draw: fx.t0 < 0 ? 1 : EASE.out(clamp(lt / 0.5)), boil: 0.8 });
    },
    cues: fx => [[fx.t0, 'pen'], [fx.pull, 'zip']],
  };
  defineScene({
    id: 'title', chapter: '开场', dur: 6.2, noSeries: true, floor: FL,
    cast: { terry: { ...E3.terry, blink: [3.3, 0.9] } },
    tracks: {
      terry: {
        enter: 1.0,
        pos: [[0, [HX, FL]]],
        pose: [[0, 'scratchStand'], [2.4, 'stand', 0.12], [3.7, 'kidCheer', 0.1, 'back'], [5.2, 'stand', 0.25]],
        face: [[0, 'puzzled'], [2.4, 'effort', 0.05], [3.7, 'joy', 0.05]],
        turn: [[0, -0.25]],
        gaze: [[0, [HX, 330]], [3.7, 'viewer']],
        squash: [[0, 1], [3.7, 1.1, 0.06], [3.76, 1, 0.25, 'back']],
      },
    },
    fx: [
      { type: 'title', id: 'tt', text: '数学少年陶哲轩', x: 640, y: 250, size: 140, t0: -0.15, underline: true, sfx: 'stamp' },
      { type: 'title', id: 'ep', text: '第 3 集', x: 640, y: 412, size: 64, t0: 0.6, color: 'red', rot: -3 },
      { type: 'title', id: 'a', text: '卡住，', x: 430, y: 556, size: 100, t0: 1.0, color: 'red', rot: -3 },
      { type: 'title', id: 'b', text: '然后想通', x: 790, y: 556, size: 100, t0: 3.7, color: 'red', rot: 1, sfx: 'tada' },
      { type: 'h3_knot', id: 'knot', at: [HX, 330], r: 62, t0: 1.3, t1: 3.75, pull: 2.5, pullDur: 0.9 },
      { type: 'e3_bulb', id: 'bulb', char: 'terry', size: 96, t0: 3.6, state: [[0, 'on']] },
    ],
    sfx: [[1.0, 'hop']],
    subs: [{ t0: 0.3, t1: 5.3, text: '数学少年陶哲轩，第三集：卡住，然后想通。', hide: true }],
  });
})();
