// 结尾：回到地图（奇数一侧前两级打勾，偶数一侧闪问号）→ 两行金句 → 下集换一扇门（余数门）。
(() => {
  const F = (f0, inner, fd = 0.4) => ({ type: 'n1_fade', f0, fd, inner });
  // 下集预告用的一扇大门：余数门（门框上一排两两成对的点，剩一个红点）
  PROPS.h1_door = (fx, t, lt, p) => {
    const k = fx.id, w = 230, h = 340;
    stroke(k + '.f', [[-w / 2, h / 2], [-w / 2, -h / 2 + 50, 1], [0, -h / 2 - 10], [w / 2, -h / 2 + 50], [w / 2, h / 2, 1]], { z: Z.board, w: 6, draw: p });
    if (lt > 0.6) stroke(k + '.g', superPts(0, 20, w - 30, h - 60, 24, 4), { z: Z.hi, w: 28, color: C.hi, closed: true, opacity: 0.75 * clamp((lt - 0.6) / 0.4) });
    for (let q = 0; q < 3; q++) { dot(`${k}.a${q}`, [-70 + q * 46, -h / 2 + 62], 9, C.ink, Z.board + 1); dot(`${k}.b${q}`, [-70 + q * 46, -h / 2 + 86], 9, C.ink, Z.board + 1); }
    dot(k + '.c', [-70 + 3 * 46, -h / 2 + 74], 9, C.red, Z.board + 1);
  };
  defineScene({
    id: 'ending', chapter: '第一步', dur: 33.2, floor: N1.FL,
    cast: { kid: N1.kid },
    tracks: {
      kid: {
        enter: 16.2,
        pos: [[0, [1350, N1.FL]]],
        pose: [[0, 'stand'], [16.2, 'kidCheer', 0.15, 'back'], [17.4, 'stand', 0.2], [24.0, 'thinkStand', 0.2], [32.2, 'stand', 0.2]],
        face: [[0, 'smile'], [16.2, 'joy', 0.05], [17.4, 'smile', 0.1], [24.0, 'focus', 0.08], [28.0, 'idea', 0.06]],
        turn: [[0, -0.4]],
        gaze: [[0, 'viewer'], [24.2, 'door']],
      },
    },
    targets: () => ({ door: [560, 420] }),
    fx: [
      { type: 'n1_map', id: 'map', t0: 0, t1: 15.9, doorL: [[0, 0]], doorR: [[0, 0]], lit: [[0.4, 0], [0.7, 1]],
         steps: [[0.4, 0], [0.7, 1]], ticks: [[4.4, 0], [5.4, 1]], qs: [[8.8, 0], [9.6, 1]] },
      F(23.6, { type: 'title', id: 'g1', text: '试出来的，是这几个；', x: 640, y: 300, size: 84, t0: 16.7 }),
      F(23.6, { type: 'title', id: 'g2', text: '想明白的，是每一个。', x: 700, y: 470, size: 84, t0: 20.3, color: 'red', underline: true }),
      { type: 'prop', kind: 'h1_door', id: 'door', at: [560, 430], t0: 24.3, t1: 32.4 },
      F(32.4, { type: 'write', id: 'sq', text: '1 4 9 16 25 …', x: 820, y: 300, size: 76, t0: 27.9, speed: 2400 }),
      F(32.4, { type: 'title', id: 'q', text: '÷ 4，剩下几个？', x: 1010, y: 520, size: 64, t0: 29.6, color: 'red', rot: -2, font: CFG.FONT_MIX }),
    ],
    subs: [
    {"t0": 0.3, "t1": 3.95, "text": "今天，我们走上了两级台阶："},
    {"t0": 4.35, "t1": 8.2, "text": "每一个正奇数都行，而且会造。"},
    {"t0": 8.7, "t1": 12.0, "text": "那串偶数，是还没找到，"},
    {"t0": 12.2, "t1": 15.79, "text": "还是根本没有？还不知道。"},
    {"t0": 16.69, "t1": 19.82, "text": "试出来的，是这几个；"},
    {"t0": 20.32, "t1": 23.4, "text": "想明白的，是每一个。"},
    {"t0": 24.3, "t1": 27.55, "text": "下一集，我们换一扇门："},
    {"t0": 27.85, "t1": 32.7, "text": "把平方数四个四个分组，看看会剩下几个。"}
    ],
  });
})();
