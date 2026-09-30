// 第二步：讲清楚为什么——每个奇数是一个“L”形，把正方形放大一圈（数学小知识卡 + 点阵拼图）
(() => {
  const FL = 780, G = { x: 330, y: 350, d: 96, r: 18 };      // dot grid: top-left cell centre, spacing, dot radius
  const LAYER_T = [2.0, 5.4, 9.2, 11.6];                     // when the 1st…4th layer (1, 3, 5, 7 dots) drops in
  const cell = (i, j) => [G.x + i * G.d, G.y + j * G.d];
  /** layer k (0-based) is the "L" that grows a k×k square into (k+1)×(k+1): 2k+1 dots */
  const layer = k => { const c = []; for (let i = 0; i <= k; i++) c.push([i, k]); for (let j = 0; j < k; j++) c.push([k, j]); return c; };

  COMP.dm_grid = {
    draw(fx, t) {
      LAYER_T.forEach((t0, k) => {
        const lt = t - t0; if (lt < 0) return;
        const cells = layer(k), newest = k === LAYER_T.filter(x => x <= t).length - 1;
        // the newest L glows yellow while it is being talked about
        if (newest && k > 0) {
          const hp = EASE.out(clamp(lt / 0.3));
          const [a, b] = [cell(0, k), cell(k, k)], [c2] = [cell(k, 0)];
          stroke('dm.hlA' + k, superPts((a[0] + b[0]) / 2, a[1], (b[0] - a[0] + G.d * 0.9) * hp, G.d * 0.8, 16, 4), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, w: 1 });
          stroke('dm.hlB' + k, superPts(c2[0], (c2[1] + b[1]) / 2, G.d * 0.8, (b[1] - c2[1] + G.d * 0.9) * hp, 16, 4), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, w: 1 });
        }
        cells.forEach(([i, j], n) => {
          const u = EASE.back(clamp((lt - n * 0.07) / 0.22)); if (u <= 0) return;
          const p = cell(i, j);
          dot(`dm.d${k}.${n}`, [p[0], p[1] - (1 - u) * 40], G.r * Math.min(1, u), C.ink, Z.front);
        });
        // '+3', '+5', '+7' in a column to the right of the finished 4×4 square, on the row the L ends
        if (k > 0) text('dm.l' + k, '+' + (2 * k + 1), G.x + 3 * G.d + 110, cell(k, k)[1] + 4, { size: 56, font: CFG.FONT_MIX, color: C.red, z: Z.annot, opacity: clamp(lt / 0.2), halo: 6 });
        text('dm.s' + k, `${k + 1}×${k + 1}`, G.x + k * G.d / 2, G.y - 62, { size: 48, font: CFG.FONT_MIX, z: Z.annot, opacity: newest ? clamp(lt / 0.2) : 0 });
      });
    },
    cues: () => LAYER_T.map(t => [t, 'pop']),
  };

  defineScene({
    id: 'proof', chapter: '讲清楚为什么', dur: 25.8, floor: FL,
    cast: {
      kid: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      kid: {
        pos: [[0, [1360, FL]]],
        pose: [[0, 'thinkStand'], [4.3, 'kidPoint', 0.12], [18.5, 'kidCheer', 0.1, 'back']],
        face: [[0, 'focus'], [4.3, 'idea', 0.05], [18.5, 'joy', 0.05]],
        turn: [[0, -0.35]],
        gaze: [[0, 'grid']],
        squash: [[0, 1], [18.5, 1.1, 0.06], [18.56, 1, 0.25, 'back']],
      },
    },
    targets: () => ({ grid: [G.x + 1.5 * G.d, G.y + 1.5 * G.d] }),
    fx: [
      { type: 'factCard', id: 'card', t0: -0.2, box: [90, 92, 1180, 790], topic: '为什么是平方数？', rules: [] },
      { type: 'dm_grid', id: 'grid' },
      { type: 'scribe', id: 'rule', text: '每个奇数 = 一个“L”，把正方形放大一圈', x: 190, y: 720, size: 44, t0: 14.1, cps: 7 },
      { type: 'label', id: 'lbL', text: '一个“L”', at: [960, 400], rot: -3, t0: 5.6, t1: 13.9, target: [G.x + 2 * G.d + 24, G.y + G.d], bend: 0.2, gap: 12 },
      { type: 'qm', id: 'qm', pos: [[0, [1220, FL]]], size: 170, t0: 1.0, act: [[0, 'idle'], [18.5, 'nod'], [23.6, 'hop']],
        mood: [[0, 'doubt'], [8.3, 'surprised'], [18.5, 'happy']], sign: [[0, null], [23.6, '懂了！']], gaze: [[0, 'grid'], [23.6, 'viewer']] },
    ],
    subs: [
      { t0: 0.3, t1: 4.2, text: '把每个奇数，摆成一个“L”形：' },
      { t0: 4.3, t1: 8.2, text: '1个点，加上3个，拼成2×2；', say: '一个点，加上三个，拼成二乘二；' },
      { t0: 8.3, t1: 13.9, text: '再加5个，拼成3×3；再加7个，拼成4×4。', say: '再加五个，拼成三乘三；再加七个，拼成四乘四。' },
      { t0: 14.0, t1: 18.4, text: '每个“L”都正好把正方形放大一圈，' },
      { t0: 18.5, t1: 23.5, text: '所以不管加到第几个奇数，都是正方形！' },
      { t0: 23.6, t1: 25.5, text: '“懂了！”', voice: 'qm' },
    ],
  });
})();
