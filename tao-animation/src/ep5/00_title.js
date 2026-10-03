// 开场：片名卡。小陶在一张小蹦床上一跳一跳（第 10 场会讲到：跳跳蹦床，气就消了）。
(() => {
  const FL = 700, HX = 1300;
  /** 小蹦床：一个扁扁的椭圆垫子 + 四条腿；fx.sag 轨道 = 垫子被踩下去多少（0..1） */
  PROPS.h5_tramp = (fx, t, lt, p) => {
    const k = fx.id, z = Z.back, sag = fx.sag ? fx.sag(t) : 0;
    stroke(k + '.mat', [[-120, 0], [-60, 10 + 26 * sag, 1], [60, 10 + 26 * sag, 1], [120, 0]], { z: z + 0.2, w: 5, draw: stag(p, 0, 3) });
    stroke(k + '.rim', ringPts(k + '.rim', 0, 0, 124, 18, { n: 14, a0: 180, sweep: 180 }), { z, w: 4.5, draw: stag(p, 1, 3) });
    [-104, -40, 40, 104].forEach((x, i) => stroke(k + '.leg' + i, [[x, 8], [x * 1.08, 62]], { z: z - 0.1, w: 4.5, draw: stag(p, 2, 3) }));
  };
  // three hops: up 0.18 s, down 0.18 s, then a short squash on the mat
  const HOPS = [1.4, 2.05, 2.7, 3.35], up = 120;
  const hopY = t => { for (const h of HOPS) { const u = (t - h) / 0.5; if (u >= 0 && u < 1) return -up * 4 * u * (1 - u); } return 0; };
  const sag = t => { for (const h of HOPS) { const d = t - h; if (d > -0.08 && d < 0.06) return 1 - Math.abs(d + 0.01) / 0.08; const e = t - (h + 0.5); if (e > -0.06 && e < 0.08) return 1 - Math.abs(e - 0.01) / 0.08; } return 0; };
  defineScene({
    id: 'title', chapter: '开场', dur: 6.2, noSeries: true, floor: FL,
    cast: { terry: { ...E5.terry, noShadow: true } },
    tracks: {
      terry: {
        enter: 0.9,
        pos: [[0, t => [HX, FL - 64 + hopY(t)]]],
        pose: [[0, 'stand'], [1.3, 'kidCheer', 0.1], [3.9, 'stand', 0.15], [4.2, t => ({ ...POSE.wave, armScale: 1.8, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 4.2) * 11)] }), 0.12]],
        face: [[0, 'smile'], [1.3, 'joy', 0.05]],
        turn: [[0, -0.25]],
      },
    },
    fx: [
      { type: 'title', id: 'tt', text: '数学少年陶哲轩', x: 640, y: 250, size: 140, t0: -0.15, underline: true, sfx: 'stamp' },
      { type: 'title', id: 'ep', text: '第 5 集', x: 640, y: 412, size: 64, t0: 0.6, color: 'red', rot: -3 },
      { type: 'title', id: 'a', text: '好玩，也要认真', x: 640, y: 556, size: 96, t0: 1.1, color: 'red', rot: -2 },
      { type: 'prop', id: 'tr', kind: 'h5_tramp', at: [HX, FL - 62], t0: 0.4, drawDur: 0.5, sag },
    ],
    sfx: HOPS.map(h => [h, 'boing']),
    subs: [{ t0: 0.3, t1: 5.7, text: '数学少年陶哲轩，第五集：好玩，也要认真。', hide: true }],
  });
})();
