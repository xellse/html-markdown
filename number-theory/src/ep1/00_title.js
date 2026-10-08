// 片头：片名卡。片名下面一个 4×4 点阵，左下角 3×3 空着，剩下 ┐ 形的一圈（和正文、和 Jasper 的记号同一个方向）。
(() => {
  const F = (f0, inner) => ({ type: 'n1_fade', f0, fd: 0.4, inner });
  defineScene({
    id: 'title', chapter: '开场', dur: 6.1, noSeries: true, floor: N1.FL,
    fx: [
      F(5.5, { type: 'title', id: 'tt', text: '一道题长大了', x: 800, y: 210, size: 140, t0: -0.15, underline: true, sfx: 'stamp' }),
      F(5.5, { type: 'title', id: 'ep', text: '第 1 集', x: 800, y: 372, size: 60, t0: 0.6, color: 'red', rot: -3 }),
      // "7 找到了，6 呢？": the digits in the same handwriting as the rest of the episode
      F(5.5, { type: 'write', id: 'a7', text: '7', x: 424, y: 452, size: 96, t0: 1.1, speed: 2600, color: 'red' }),
      F(5.5, { type: 'title', id: 'a1', text: '找到了，', x: 498, y: 500, size: 96, t0: 1.25, color: 'red', anchor: 'start' }),
      F(5.5, { type: 'write', id: 'a6', text: '6', x: 872, y: 452, size: 96, t0: 1.45, speed: 2600, color: 'red' }),
      F(5.5, { type: 'title', id: 'a2', text: '呢？', x: 946, y: 500, size: 96, t0: 1.6, color: 'red', anchor: 'start' }),
      { type: 'n1_dots', id: 'd', x: 722, y: 600, N: 4, gap: 52, t0: 1.8, t1: 5.4, hide: (i, j) => i >= 1 && j <= 2, arms: { t: 2.6 } },
    ],
    subs: [
    {"t0": 0.3, "t1": 5.59, "text": "一道题长大了，第一集：7找到了，6呢？", "say": "一道题长大了。第一集：七找到了，六呢？", "hide": true}
    ],
  });
})();
