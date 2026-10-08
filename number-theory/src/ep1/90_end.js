// 片尾卡：下集预告（4 条花纹不同的跑道一闪而过）+ 第一集完。
(() => {
  const F = (f0, inner) => ({ type: 'n1_fade', f0, fd: 0.35, inner });
  // 4 条跑道：余 0 实心、余 1 斜线、余 2 网点、余 3 空心（下一集固定沿用）
  PROPS.h1_lanes = (fx, t, lt, p) => {
    const k = fx.id, W = 900, H = 64;
    for (let r = 0; r < 4; r++) {
      const y = r * (H + 18), u = clamp(p * 4 - r);
      stroke(`${k}.l${r}`, [[0, y], [W, y, 1], [W, y + H, 1], [0, y + H, 1], [0, y, 1]], { z: Z.set, w: 4, draw: u, fill: r === 0 ? '#3A3A3A' : C.paper });
      if (r === 1) for (let q = 0; q < 23; q++) stroke(`${k}.s${q}`, [[q * 38 + 10, y + H - 6], [Math.min(W - 6, q * 38 + 40), y + 6]], { z: Z.set + 0.2, w: 3, draw: u });
      if (r === 2) for (let q = 0; q < 45; q++) dot(`${k}.d${q}`, [q * 20 + 10, y + H / 2 + ((q % 2) ? 12 : -12)], 4, C.ink, Z.set + 0.2);
      text(`${k}.n${r}`, '余 ' + r, -70, y + H / 2, { size: 40, z: Z.set + 0.3, anchor: 'middle', font: CFG.FONT_MIX, opacity: u });
    }
  };
  defineScene({
    id: 'end', dur: 9.0, floor: N1.FL,
    fx: [
      F(4.3, { type: 'title', id: 'nx', text: '下集：不用试遍所有数', x: 800, y: 170, size: 80, t0: 0.5, color: 'red' }),
      F(3.7, { type: 'prop', kind: 'h1_lanes', id: 'lanes', at: [400, 280], t0: 0.9, drawDur: 1.2 }),
      { type: 'title', id: 'fin', text: '《一道题长大了》', x: 800, y: 330, size: 96, t0: 4.6, sfx: 'stamp' },
      { type: 'title', id: 'fin2', text: '第一集 · 完', x: 800, y: 480, size: 72, t0: 5.0, color: 'red', rot: -2 },
    ],
    subs: [
    {"t0": 0.6, "t1": 3.97, "text": "下集：不用试遍所有数。"},
    {"t0": 4.67, "t1": 8.52, "text": "《一道题长大了》，第一集完。"}
    ],
  });
})();
