// 开场：片名卡。小陶背上书包挥手，一架纸飞机从左飞到右（他要第一次出远门比赛了）。
(() => {
  const FL = 690, HX = 1300;
  /** 一架纸飞机沿弧线飞过，身后一串铅笔虚线 */
  COMP.h4_plane = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const u = clamp((t - fx.t0) / fx.dur), path = v => [lerp(fx.from[0], fx.to[0], v), lerp(fx.from[1], fx.to[1], v) - Math.sin(Math.PI * v) * fx.arc];
      const p = path(EASE.io(u)), q = path(EASE.io(clamp(u - 0.02))), ang = Math.atan2(p[1] - q[1], p[0] - q[0]) / RAD;
      for (let i = 0; i < 14; i++) { const v = i / 14; if (v > EASE.io(u) - 0.03) break; const a = path(v), b = path(v + 0.025); stroke(fx.id + '.d' + i, [a, b], { z: Z.fx, w: 3, color: C.pencil, boil: 0.5 }); }
      DL.save(); DL.translate(p[0], p[1]); DL.rotate(ang);
      stroke(fx.id + '.b', [[34, 0], [-26, -18, 1], [-14, 0, 1], [-26, 16, 1], [34, 0, 1]], { z: Z.fx + 0.1, w: 4, fill: C.paper });
      stroke(fx.id + '.f', [[34, 0], [-14, 0]], { z: Z.fx + 0.2, w: 3 });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'whoosh']],
  };
  defineScene({
    id: 'title', chapter: '开场', dur: 6.2, noSeries: true, floor: FL,
    cast: { terry: { ...E4.terry, bag: true } },
    tracks: {
      terry: {
        enter: 1.2,
        pos: [[0, [HX, FL]]],
        pose: [[0, 'stand'], [1.5, t => ({ ...POSE.wave, armScale: 1.8, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 1.5) * 11)] }), 0.12], [4.0, 'stand', 0.2]],
        face: [[0, 'joy']],
        turn: [[0, -0.25]],
        gaze: [[0, 'viewer'], [2.2, 'plane'], [3.6, 'viewer']],
      },
    },
    targets: () => ({ plane: [1000, 160] }),
    fx: [
      { type: 'title', id: 'tt', text: '数学少年陶哲轩', x: 640, y: 250, size: 140, t0: -0.15, underline: true, sfx: 'stamp' },
      { type: 'title', id: 'ep', text: '第 4 集', x: 640, y: 412, size: 64, t0: 0.6, color: 'red', rot: -3 },
      { type: 'title', id: 'a', text: '第一次站上世界赛场', x: 640, y: 556, size: 92, t0: 1.1, color: 'red', rot: -2 },
      { type: 'h4_plane', id: 'pl', from: [120, 120], to: [1520, 140], arc: 60, t0: 2.0, dur: 2.2 },
    ],
    sfx: [[1.2, 'hop']],
    subs: [{ t0: 0.3, t1: 5.7, text: '数学少年陶哲轩，第四集：第一次站上世界赛场。', hide: true }],
  });
})();
