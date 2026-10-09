// 结尾：回到地图。第四级台阶"为什么不可能？"只亮偶数一半，插余 2 小旗；第一级偶数一侧的问号拆成"✗ 没有 / ?"；
// 雾里一块路牌闪"除不尽？"；地图缩到左上，右边四个跑道图标：余 1 ✓、余 3 ✓（上集造出来的）、余 2 ✗（和顶栏卡①–④一起连进余数门）、
// 余 0 ?（虚线指向左边的门）；左门门楣写出"因子门"，门缝透光。
// 开场：只有顶栏 + 议程条；结尾：全部淡出（顶栏 out）。
(() => {
  const FL = N2.FL;
  Object.assign(POSE, { h2_ptL: { armScale: 1.5, armL: [80, 8], armR: [16, 10] } });   // kidPoint, pointing left
  const T = {
    HALF: 1.6, FLAG: 2.3, SPLIT: 3.4,            // L1 这级台阶……为余2亮了
    SIGN: 6.2,                                   // L2 除不尽
    SHRINK: 9.7,                                 // 地图缩到左上
    ICON: [10.4, 10.7, 11.0, 11.3],              // 四个跑道图标（余 1、余 3、余 2、余 0）
    LINKS: 12.4,                                 // 余 2 ✗ 和卡①–④连进余数门
    DASH: 15.6,                                  // L4 余 0 ? 虚线指向左门
    LBL: 19.7, LIGHT: 20.4,                      // L5 因子门
    OUT: 22.9, DUR: 23.9,
  };
  // map transform after the shrink: frame 110–1490 × 120–760 → 80–908 × 200–584
  const S = 0.6, TX = 80 - 110 * S, TY = 200 - 120 * S;
  const mp = ([x, y]) => [TX + x * S, TY + y * S];
  const DOOR_R = mp([1300, 470]), DOOR_L = mp([300, 470]);
  const ICONS = [ // [r, mark, x, y]
    [1, '✓', 1060, 300], [3, '✓', 1350, 300], [2, '✗', 1060, 470], [0, '?', 1350, 470],
  ];
  const icon = (k, r, mark, x, y, u) => {
    const w = 200, h = 64, x0 = x - w / 2, y0 = y - h / 2;
    stroke(k + '.b', N2.box(x0, y0, x0 + w * u, y0 + h), { z: Z.board, w: 4, fill: C.paper });
    N2.fill(k + '.f', x0 + 2, y0 + 2, x0 + Math.min(56, w * u), y0 + h - 2, r, { z: Z.board + 0.2, step: 13, dot: 3 });
    if (u < 0.6) return;
    const a = clamp((u - 0.6) / 0.4);
    text(k + '.n', '余' + r, x0 + 112, y, { size: 40, z: Z.board + 0.3, anchor: 'middle', font: CFG.FONT_MIX, opacity: a });
    text(k + '.m', mark, x0 + w + 36, y - 2, { size: 60, z: Z.annot, anchor: 'middle', color: C.red, font: CFG.FONT_MIX, opacity: a });
  };
  defineScene({
    id: 'ending', chapter: '两扇门', dur: T.DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: 10.1,
        pos: [[0, [1500, FL]], [22.3, [1500, FL]], [22.35, [1760, FL], 0.55, 'in']],
        pose: [[0, 'stand'], [10.25, 'kidCheer', 0.15, 'out'], [13.6, 'stand', 0.2], [15.4, 'h2_ptL', 0.2], [18.8, 'stand', 0.2], [22.35, makeWalk(22.35, 22.9, 5.2)]],
        face: [[0, 'smile'], [10.25, 'joy', 0.05], [13.6, 'smile', 0.1], [15.4, 'focus', 0.1], [20.4, 'idea', 0.06]],
        turn: [[0, -0.6], [22.3, 0.8, 0.1]],
        gaze: [[0, 'viewer'], [15.4, 'doorL'], [20.6, 'viewer']],
      },
    },
    targets: () => ({ doorL: DOOR_L }),
    sfx: [[T.ICON[0], 'pop'], [T.ICON[2], 'pop'], [T.LINKS, 'pen'], [T.DASH, 'pen'], [T.LIGHT, 'chime']],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'ending', out: T.OUT },
      { type: 'n2_grp', id: 'mapg', out: T.OUT, dur: 0.4,
        xf: [[0, [80, 88, 0.9]], [T.SHRINK, [TX, TY, S], 0.7, 'io']],   // 0.9 so the frame stays under the top bar (y 196–772)
        inner: { type: 'n2_map', id: 'map', t0: 0, doorL: [[0, 0], [T.LIGHT, 1]], doorR: [[0, 1]], labelR: -1, labelL: T.LBL, lightL: T.LIGHT,
          lit: [[-1, 0], [-1, 1]], steps: [[-1, 0], [-1, 1], [0.9, 3]], ticks: [[-1, 0], [-1, 1]], qs: [[-1, 1]],
          halfLit: [[T.HALF, 3]], flag: [[T.FLAG, 3]], split: [[T.SPLIT, 0]] } },
      // L2: a signpost in the fog flashes "除不尽？" (a ÷ with a leftover dot; no fractions)
      { type: 'n2_fn', id: 'sgn', t0: T.SIGN, cues: [[T.SIGN, 'plip']], fn: (t, lt, k) => {
        const a = clamp(lt / 0.25) * (1 - clamp((t - T.SHRINK + 0.3) / 0.3)); if (a <= 0) return;
        const pulse = 1 + 0.06 * Math.sin(lt * 7) * (1 - clamp(lt / 2)), x = 80 + 1245 * 0.9, y = 88 + 236 * 0.9;
        DL.save(); DL.translate(x, y); DL.scale(pulse);
        stroke(k + '.hi', N2.box(-118, -46, 118, 46), { z: Z.hi + 3, w: 16, color: C.hi, opacity: 0.8 * a });
        stroke(k + '.b', N2.box(-110, -40, 110, 40), { z: Z.set + 3, w: 4, fill: '#FFFFFF', opacity: a });
        text(k + '.d', '÷', -70, 2, { size: 54, z: Z.set + 3.2, anchor: 'middle', font: CFG.FONT_MIX, opacity: a });
        text(k + '.t', '除不尽？', 20, 2, { size: 40, z: Z.set + 3.2, anchor: 'middle', color: C.red, opacity: a });
        DL.restore();
      } },
      // four lane icons on the right
      { type: 'n2_fn', id: 'ic', t0: T.ICON[0], fn: (t, lt, k) => {
        const o = 1 - clamp((t - T.OUT) / 0.4); if (o <= 0) return;
        const n0 = DL.items.length;
        ICONS.forEach(([r, mark, x, y], i) => { const u = EASE.out(clamp((t - T.ICON[i]) / 0.4)); if (u > 0) icon(`${k}.${r}`, r, mark, x, y, u); });
        const nu = clamp((t - T.ICON[1] - 0.4) / 0.3);
        if (nu > 0) text(k + '.note', '上集造出来的', 1205, 368, { size: 34, z: Z.annot, anchor: 'middle', color: C.red, opacity: nu });
        N2.fadeFrom(n0, o);
      } },
      // red links: 余 2 ✗ and the four cards into the remainder door
      { type: 'n2_fn', id: 'lk', t0: T.LINKS, fn: (t, lt, k) => {
        const o = 1 - clamp((t - T.OUT) / 0.4); if (o <= 0) return;
        const to = [DOOR_R[0] + 20, DOOR_R[1] - 40];
        arrow(k + '.r2', [950, 470], to, { p: EASE.out(clamp(lt / 0.5)), bend: 0.12, color: C.red, w: 4, head: 16, z: Z.annot });
        for (let n = 1; n <= 4; n++) {
          const [cx, cy] = N2.HUD_GEO.card(n), u = EASE.out(clamp((lt - 0.4 - n * 0.18) / 0.4)); if (u <= 0) continue;
          // a wire: down from the card, left along y 214 (above the icons), down into the door
          stroke(`${k}.c${n}`, [[cx, cy + 38], [cx, 214 - n * 4, 1], [to[0] + n * 6, 214 - n * 4, 1], [to[0] + n * 6, to[1] - 10, 1]], { z: Z.annot - 0.5, w: 3, color: C.red, opacity: 0.85 * o, draw: u });
        }
        if (o < 1) { const it = DL.items.find(i => i.key === k + '.r2'); if (it) it.attrs.opacity = o; }
      } },
      // 余 0 ?: a dashed line to the factor door
      { type: 'n2_fn', id: 'ds', t0: T.DASH, fn: (t, lt, k) => {
        const o = 1 - clamp((t - T.OUT) / 0.4); if (o <= 0) return;
        // around the map, not through 余2 or the remainder door: down from 余0, left under the map frame, up its left side, into the factor door
        const P = [[1350, 506], [1350, 618], [52, 618], [52, DOOR_L[1]], [DOOR_L[0] - 62, DOOR_L[1]]];
        const L = P.slice(1).map((q, i) => dist(P[i], q)), tot = L.reduce((a, b) => a + b, 0);
        let left = EASE.out(clamp(lt / 1.2)) * tot;
        P.slice(1).forEach((q, i) => { if (left <= 0) return; const u = Math.min(1, left / L[i]); N2.dash(`${k}.d${i}`, P[i], lerp2(P[i], q, u), { color: C.red, w: 3.5, z: Z.annot, opacity: o, step: 26, on: 14 }); left -= L[i]; });
        if (left > 0) stroke(k + '.ah', [[DOOR_L[0] - 80, DOOR_L[1] - 14], [DOOR_L[0] - 62, DOOR_L[1], 1], [DOOR_L[0] - 80, DOOR_L[1] + 14]], { z: Z.annot, w: 3.5, color: C.red, opacity: o });
      } },
    ],
    subs: [
      { t0: 0.7, t1: 5.16, text: '这级台阶“为什么不可能”，为余2亮了。', say: '这级台阶“为什么不可能”，为余二亮了。' },
      { t0: 5.66, t1: 9.75, text: '要是非把除法除尽，就得请来新的数。' },
      { t0: 10.25, t1: 14.3, text: '“余数门一个理由，就关掉一整条！”', voice: 'kid', say: '余数门一个理由，就关掉一整条！' },
      { t0: 14.7, t1: 19.39, text: '余0的行不行、怎么找全，靠看谁乘谁的门：', say: '余零的行不行、怎么找全，靠看谁乘谁的门：' },
      { t0: 19.59, t1: 23.37, text: '因子门。下一集，就打开它。' },
    ],
  });
})();
