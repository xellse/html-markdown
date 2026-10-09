// 片头：片名卡。片名下面是第 1 集结尾那排 9 个点（4 | 4 | 1），再下面四条短跑道（余 0 实心、余 1 斜线、余 2 网点、余 3 空心）。
(() => {
  const F = N2.F;
  defineScene({
    id: 'title', chapter: '开场', dur: 5.4, noSeries: true, floor: N2.FL,
    fx: [
      F(4.9, { type: 'title', id: 'tt', text: '一道题长大了', x: 800, y: 180, size: 140, t0: -0.15, underline: true, sfx: 'stamp' }),
      F(4.9, { type: 'title', id: 'ep', text: '第 2 集', x: 800, y: 330, size: 60, t0: 0.5, color: 'red', rot: -3 }),
      F(4.9, { type: 'title', id: 'sub', text: '不用试遍所有数', x: 800, y: 430, size: 84, t0: 0.9, color: 'red' }),
      { type: 'n2_grp', id: 'g9g', out: 4.8, inner: { type: 'prop', kind: 'n2_group9', id: 'g9', at: [630, 530], t0: 1.4, ringAt: 0.6 } },
      { type: 'n2_fn', id: 'tl', t0: 2.2, cues: [[2.2, 'pen']], fn: (t, lt, k) => {
        const o = 1 - clamp((t - 4.8) / 0.4); if (o <= 0) return;
        for (let r = 0; r < 4; r++) {
          const u = EASE.out(clamp((lt - r * 0.15) / 0.35)), x0 = 560, x1 = 1040, y0 = 590 + r * 46, y1 = y0 + 34;
          stroke(`${k}.b${r}`, N2.box(x0, y0, x0 + (x1 - x0) * u, y1), { z: Z.set, w: 3.5, fill: C.paper, opacity: o });
          N2.fill(`${k}.f${r}`, x0 + 2, y0 + 2, x0 + (x1 - x0) * u - 2, y1 - 2, r, { z: Z.set + 0.2, step: 14, dot: 3, opacity: o });
        }
      } },
    ],
    subs: [
      { t0: 0.3, t1: 4.92, text: '一道题长大了，第二集：不用试遍所有数', say: '一道题长大了。第二集：不用试遍所有数。', hide: true },
    ],
  });
})();
