// 上集回顾：“好玩 / 认真”；一条短跑道、一条长长的马拉松路；“马拉松开始了”：17 岁的小陶走上长路。
(() => {
  const FL = 760;
  /** 一条短跑道（左）和一条弯弯曲曲伸向远方的路（右）。{t0, t1} */
  COMP.h6_roads = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, k = fx.id, op = fx.t1 !== undefined ? 1 - clamp((t - fx.t1 + 0.3) / 0.3) : 1, z = Z.set;
      const p1 = EASE.out(clamp(lt / 0.5)), p2 = EASE.out(clamp((lt - 0.6) / 0.9));
      // sprint track: two parallel lines + a finish post
      stroke(k + '.s1', [[150, 640], [560, 640]], { z, w: 4, draw: p1, opacity: op });
      stroke(k + '.s2', [[150, 700], [560, 700]], { z, w: 4, draw: p1, opacity: op });
      stroke(k + '.post', [[560, 600], [560, 720]], { z, w: 5, draw: p1, opacity: op });
      // marathon road: two curves converging to a far point
      const L = [], R = [];
      for (let i = 0; i <= 16; i++) { const u = i / 16, w = lerp(150, 6, u), x = lerp(1000, 1380, u) + Math.sin(u * 7) * 90 * (1 - u), y = lerp(FL, 300, u); L.push([x - w, y]); R.push([x + w, y]); }
      stroke(k + '.r1', L, { z, w: 4, draw: p2, opacity: op });
      stroke(k + '.r2', R, { z, w: 4, draw: p2, opacity: op });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  defineScene({
    id: 'recap', chapter: '上集回顾', dur: 14.3, floor: FL,
    cast: { terry: E6.teen },
    tracks: {
      terry: {
        enter: 9.3,
        pos: [[0, [700, FL]], [9.6, [700, FL]], [12.4, [960, FL], 2.8, 'lin']],
        pose: [[0, makeWalk(9.6, 12.4, 4.6)], [12.5, { ...POSE.stand, armScale: 1.6, ikL: { w: 1, to: [1300, 420], bend: 'out' } }, 0.2, 'back']],
        face: [[0, 'smile'], [12.5, 'joy', 0.05]],
        turn: [[0, 0.4]],
        gaze: [[0, 'far']],
      },
    },
    targets: () => ({ far: [1380, 300] }),
    fx: [
      { type: 'title', id: 'w1', text: '好玩', x: 520, y: 260, size: 120, t0: 0.4, t1: 4.4 },
      { type: 'title', id: 'w2', text: '认真', x: 1060, y: 260, size: 120, t0: 1.4, t1: 4.4, underline: true },
      { type: 'h6_roads', id: 'rd', t0: 4.5, t1: 14.2 },
      { type: 'title', id: 'sp', text: '短跑 = 奥数', x: 355, y: 560, size: 50, t0: 5.0, t1: 14.2, color: 'red', rot: -3 },
      { type: 'title', id: 'mr', text: '马拉松 = 研究', x: 1180, y: 250, size: 50, t0: 6.6, t1: 14.2, color: 'red', rot: 3 },
      { type: 'title', id: 'last', text: '最后一集', x: 520, y: 260, size: 80, t0: 9.3, t1: 14.2, color: 'red', rot: -4, sfx: 'stamp' },
    ],
    subs: [
      { t0: 0.3, t1: 4.3, text: '上一集：好玩的事，也要认真做。' },
      { t0: 4.4, t1: 8.6, text: '他说：奥数像短跑，研究像马拉松。' },
      { t0: 9.2, t1: 13.8, text: '这一集，也是最后一集：马拉松开始了。' },
    ],
  });
})();
