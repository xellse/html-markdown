// 片尾卡：下集预告（两扇门并排，中间一个房间的轮廓；四条跑道一闪而过）+ 第二集完。
(() => {
  const F = N2.F;
  // 两扇门 + 中间一个房间：左门画乘号和方格，右门画两两成对的点和一个红点；局部原点 = 房间中心
  PROPS.h2_room = (fx, t, lt, p) => {
    const k = fx.id;
    stroke(k + '.room', [[-330, 150], [-330, -60, 1], [0, -190, 1], [330, -60, 1], [330, 150, 1], [-330, 150, 1]], { z: Z.set, w: 5, draw: p, fill: '#F4EFE4' });
    const door = (kk, cx, sym) => {
      stroke(kk + '.f', [[cx - 70, 150], [cx - 70, -20, 1], [cx, -60], [cx + 70, -20], [cx + 70, 150, 1]], { z: Z.board, w: 5, draw: clamp(p * 1.5 - 0.3), fill: C.paper });
      if (sym === 'x') { text(kk + '.s', '×', cx, 10, { size: 54, z: Z.board + 1, anchor: 'middle', opacity: clamp(p * 2 - 1) }); for (let q = 0; q < 3; q++) stroke(`${kk}.g${q}`, [[cx - 40, 50 + q * 30], [cx + 40, 50 + q * 30]], { z: Z.board + 0.5, w: 2.5, color: C.pencil, opacity: clamp(p * 2 - 1) }); }
      else { for (let q = 0; q < 3; q++) { dot(`${kk}.a${q}`, [cx - 36 + q * 24, 0], 6, C.ink, Z.board + 1); dot(`${kk}.b${q}`, [cx - 36 + q * 24, 16], 6, C.ink, Z.board + 1); } dot(kk + '.c', [cx + 36, 8], 6, C.red, Z.board + 1); }
    };
    door(k + '.L', -170, 'x'); door(k + '.R', 170, 'dots');
    if (lt > 0.9) stroke(k + '.glow', [[-60, 140], [60, 140]], { z: Z.hi, w: 22, color: C.hi, opacity: 0.8 * clamp((lt - 0.9) / 0.4) });
  };
  defineScene({
    id: 'end', dur: 8.9, floor: N2.FL,
    fx: [
      F(4.6, { type: 'title', id: 'nx', text: '下集：两扇门，同一个房间', x: 800, y: 160, size: 76, t0: 0.5, color: 'red' }),
      { type: 'n2_grp', id: 'rmg', out: 4.4, inner: { type: 'prop', kind: 'h2_room', id: 'rm', at: [800, 470], t0: 0.8, drawDur: 1.0 } },
      { type: 'n2_fn', id: 'fl', t0: 2.6, cues: [[2.6, 'swish']], fn: (t, lt, k) => {
        const o = clamp(lt / 0.2) * (1 - clamp((lt - 1.2) / 0.3)); if (o <= 0) return;
        for (let r = 0; r < 4; r++) { const x0 = 1170, y0 = 330 + r * 40; stroke(`${k}.b${r}`, N2.box(x0, y0, x0 + 260, y0 + 28), { z: Z.set, w: 3, fill: C.paper, opacity: o }); N2.fill(`${k}.f${r}`, x0 + 2, y0 + 2, x0 + 258, y0 + 26, r, { z: Z.set + 0.2, step: 12, dot: 2.6, opacity: o }); }
      } },
      { type: 'title', id: 'fin', text: '《一道题长大了》', x: 800, y: 330, size: 96, t0: 4.9, sfx: 'stamp' },
      { type: 'title', id: 'fin2', text: '第二集 · 完', x: 800, y: 480, size: 72, t0: 5.3, color: 'red', rot: -2 },
    ],
    subs: [
      { t0: 0.6, t1: 4.21, text: '下集：两扇门，同一个房间。' },
      { t0: 4.91, t1: 8.45, text: '《一道题长大了》，第二集完。' },
    ],
  });
})();
