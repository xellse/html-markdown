/* 第 2 集共用素材（主持人独占；场景代理只读，需要改动写进报告）
   第 1 集的素材在 _n1_shared.js（原样复制）：N1.kid、COMP.n1_desk、COMP.n1_dots、COMP.n1_map、PROPS.n1_card、PROPS.n1_mark、PROPS.n1_sign、COMP.n1_fade。
   本文件：
   - N2：常量（Jasper、地面、版面分区）和小工具（N2.W 手写、N2.F 淡出、N2.box、N2.dash、N2.ring）
   - COMP.n2_grp / COMP.n2_fn：分组（可整体移动缩放、淡出）和自由绘制
   - N2.fill：余数花纹（余 0 实心、余 1 斜线、余 2 网点、余 3 空心）；N2.brick：数字砖
   - COMP.n2_lanes + N2.laneXY：四条跑道
   - COMP.n2_hud：顶栏（细跑道条 + 卡①–④停靠的小图标）和议程条，跨场景的状态由 N2.HUD_AT 规定
   - COMP.n2_bigcard：结论卡（黄色荧光笔），写出来以后缩进顶栏
   - COMP.n2_tag："猜想"标签，可当场撕掉换成"证明了 ✓"
   - COMP.n2_stack：证明栈（右侧一栏）
   - COMP.n2_star：红色小星（撞到时）
   - COMP.n2_flip：翻页；PROPS.n2_group9：9 个点 4 | 4 | 1
   - COMP.n2_panels："还没找到 / 根本没有"两格
   - PROPS.n2_c1card：第 1 集的结论卡缩略图
   - COMP.n2_map：第 1 集的地图 + 门楣字、开门、门缝透光、半边台阶、小旗、问号拆两半 */

const N2 = {
  kid: N1.kid,
  FL: 780,
  SOLID: '#3A3A3A',                 // 余 0 的实心
  // 版面分区（舞台 1600 × 900）
  AGENDA: [40, 86, 420, 170],       // 议程条
  TOP: [440, 66, 1560, 170],        // 顶栏
  BODY: [0, 190, 1600, 790],        // 主体
  STACK_X: 1180,                    // 证明栈的左边
  STACK_Y: 340, STACK_LH: 58,       // 证明栈第 0 行的中心 y、行距
  // 证明栈上方钉的范围卡（proof 场钉上，borrow、wall、dark 场开场就在；用 PROPS.n1_card 画）
  STACK_CARD: { at: [1370, 236], w: 392, h: 130, size: 30, lines: ['两个数从 0、1、2……里挑，', '叫 a、b，a > b'] },
};

/* ---------------- 小工具 ---------------- */
N2.box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
/** 把从 n0 起画进 DL 的图元整体乘上不透明度 a */
N2.fadeFrom = (n0, a) => { if (a >= 1) return; for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * a).toFixed(3); } };
/** 手写一行数学（write 的常用默认值）；红色时自动放到批注层、配 pen 音效 */
N2.W = (id, text, x, y, size, t0, o = {}) => {
  const fx = { type: 'write', id, text, x, y, size, t0, speed: 2600, w: 5.5, gap: 0.02, glyphGap: 0.02, ...o };
  if (fx.color === 'red') { fx.z = fx.z ?? Z.annot; fx.sfx = fx.sfx || 'pen'; fx.speed = o.speed || 3000; }
  return fx;
};
/** 让一个没有 t1 的组件（title、scribe、write……）在 f0 起 fd 秒内淡出 */
N2.F = (f0, inner, fd = 0.4) => ({ type: 'n1_fade', f0, fd, inner });
/** 虚线 */
N2.dash = (k, p, q, o = {}) => {
  const L = dist(p, q), m = Math.max(1, Math.round(L / (o.step || 22)));
  for (let d = 0; d < m; d++) {
    const u0 = d / m, u1 = Math.min(1, u0 + (o.on || 12) / L); if (o.draw !== undefined && u0 > o.draw) break;
    stroke(`${k}.${d}`, [lerp2(p, q, u0), lerp2(p, q, u1)], { z: o.z ?? Z.board, w: o.w || 3, color: o.color || C.ink, opacity: o.opacity, boil: 0.4 });
  }
};
/** 红笔圈（手绘椭圆） */
N2.ring = (k, cx, cy, rx, ry, o = {}) => stroke(k, ringPts(k + '.p', cx, cy, rx, ry, { n: o.n || 16, a0: -130, sweep: 385, rv: 0.05 }), { z: o.z ?? Z.annot, w: o.w || 4.5, color: o.color || C.red, draw: o.draw ?? 1, opacity: o.opacity });

/** 分组：inner（一个或多个 fx）；xf: [[t, [tx, ty, s]], …] 整体平移缩放；out 起 dur 秒淡出；t0 之前不画 */
COMP.n2_grp = {
  init(fx) { fx.inner = [].concat(fx.inner); fx.inner.forEach(f => { const c = COMP[f.type]; if (c && c.init && !f._n2) { c.init(f); f._n2 = 1; } }); return fx; },
  draw(fx, t, F) {
    if (fx.t0 !== undefined && t < fx.t0) return;
    const u = fx.out === undefined ? 0 : clamp((t - fx.out) / (fx.dur ?? 0.35)); if (u >= 1) return;
    const n0 = DL.items.length;
    DL.save();
    if (fx.xf) { const [tx, ty, s] = evalTrack(fx.xf, t); DL.translate(tx, ty); DL.scale(s); }
    fx.inner.forEach(f => COMP[f.type].draw(f, t, F));
    DL.restore();
    N2.fadeFrom(n0, 1 - u);
  },
  cues: fx => fx.cues || fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])),
};
/** 自由绘制：fn(t, lt, key, F)，t0 起每帧调用；cues: [[t, 音效]] */
COMP.n2_fn = { draw(fx, t, F) { if (t < fx.t0) return; fx.fn(t, t - fx.t0, fx.id, F); }, cues: fx => fx.cues || [] };

/* ---------------- 余数花纹与数字砖 ----------------
   N2.fill(key, x0, y0, x1, y1, r, o)：在矩形里画余 r 的花纹（0 实心、1 斜线、2 网点、3 空心＝什么都不画）。
     o: { z, opacity, draw（0..1，从左往右画出多少）, step（斜线间距，默认 18）, dot（网点半径，默认 3.5） }
   N2.brick(key, cx, cy, n, r, o)：数字砖。左边一小条"花纹签"（余 r 的花纹），右边纸色底上写数字，所以花纹不会穿过数字。
     r = null 表示白砖（不刷花纹，用在"平方检查站"）。o: { w: 96, h: 64, size, z, opacity, scale, dim（变灰 0..1）, color（数字颜色）, tab（花纹签宽，默认 w×0.28） }
   本集的四种花纹只表示"余几"，别的东西（风车分片、借位、检查站）都不用它们。 */
N2.fill = (k, x0, y0, x1, y1, r, o = {}) => {
  const z = o.z ?? Z.set + 0.2, op = o.opacity ?? 1, xe = x0 + (x1 - x0) * clamp(o.draw ?? 1);
  if (xe <= x0 + 0.5 || op <= 0) return;
  if (r === 0) { stroke(k + '.s', N2.box(x0, y0, xe, y1), { z, w: 1, fill: N2.SOLID, color: N2.SOLID, opacity: op, boil: 0 }); return; }
  if (r === 1) {
    const s = o.step || 18, h = y1 - y0;
    for (let c = x0 - h, i = 0; c < xe; c += s, i++) {
      // segment from (c, y1) to (c + h, y0), clipped to x0..xe
      let a = [c, y1], b = [c + h, y0];
      if (a[0] < x0) a = [x0, y1 - (x0 - c)];
      if (b[0] > xe) b = [xe, y0 + (c + h - xe)];
      if (b[0] - a[0] < 2) continue;
      stroke(`${k}.h${i}`, [a, b], { z, w: o.w || 2.6, color: C.ink, opacity: op, boil: 0.25 });
    }
    return;
  }
  if (r === 2) {
    const s = o.step || 18, R = o.dot || 3.5;
    let i = 0;
    for (let y = y0 + s / 2, row = 0; y < y1 - 2; y += s * 0.8, row++)
      for (let x = x0 + s / 2 + (row % 2) * s / 2; x < xe - 2; x += s) dot(`${k}.d${i++}`, [x, y], R, C.ink, z);
    if (op < 1) for (let j = DL.items.length - i; j < DL.items.length; j++) DL.items[j].attrs.opacity = +op.toFixed(3);
  }
};
N2.brick = (k, cx, cy, n, r, o = {}) => {
  const s = o.scale ?? 1; if (s <= 0.01) return;
  const w = (o.w || 96) * s, h = (o.h || 64) * s, z = o.z ?? Z.front, op = o.opacity ?? 1, tw = (o.tab ?? (o.w || 96) * 0.28) * s;
  const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2, n0 = DL.items.length;
  stroke(k + '.b', N2.box(x0, y0, x1, y1), { z, w: 3.5, fill: '#FFFDF7', opacity: op });
  if (r !== null && r !== undefined) {
    N2.fill(k + '.f', x0 + 3, y0 + 3, x0 + tw, y1 - 3, r, { z: z + 0.1, opacity: op, step: 12 * s, dot: 2.6 * s });
    stroke(k + '.tl', [[x0 + tw, y0], [x0 + tw, y1]], { z: z + 0.15, w: 2.5, opacity: op });
  }
  const str = String(n), fs = (o.size || (str.length >= 4 ? 30 : str.length === 3 ? 36 : 42)) * s;
  const tx = r === null || r === undefined ? cx : (x0 + tw + x1) / 2;
  text(k + '.n', str, tx, cy + 1, { size: fs, font: CFG.FONT_MIX, z: z + 0.2, anchor: 'middle', color: o.color || C.ink, opacity: op });
  if (o.dim) N2.fadeFrom(n0, 1 - 0.65 * clamp(o.dim));
};

/* ---------------- 四条跑道 ----------------
   { type:'n2_lanes', id, x, y,          // 左上角（不含左边的"余 r"字）
     W: 1000, H: 76, gap: 16,            // 跑道长、高、间距
     head: 70,                           // 跑道最左边的花纹头（余 r 的花纹）宽度
     t0, pop: 0.8, t1,                   // 出现（四条依次画出）、淡出
     lanes: [0,1,2,3],                   // 画哪几条（默认四条）
     hi: [[t, r, on]],                   // 第 r 条描黄（on = 1）/ 取消（0）
     dim: [[t, r, on]],                  // 第 r 条变灰
     labels: true }                      // 左边写"余0 / 余1 / 余2 / 余3"
   N2.laneXY(L, n)：数 n 在跑道布局 L（就是这个 fx，或者同样字段的对象）里的砖位置：第 n % 4 条、第 floor(n / 4) 轮；
     每一轮一列，列宽 L.cell（默认 110），第一列中心在 x + head + cell / 2。
   发布命名点 <id>.lane0 … lane3（每条跑道左端花纹头的中心）。 */
N2.laneXY = (L, n) => {
  const H = L.H || 76, gap = L.gap ?? 16, head = L.head ?? 70, cell = L.cell || 110;
  const r = ((n % 4) + 4) % 4, j = Math.floor(n / 4);
  return [L.x + head + cell * (j + 0.5), L.y + r * (H + gap) + H / 2];
};
COMP.n2_lanes = {
  draw(fx, t, F) {
    if (t < fx.t0) return;
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.35) : 0; if (out >= 1) return;
    const k = fx.id, W = fx.W || 1000, H = fx.H || 76, gap = fx.gap ?? 16, head = fx.head ?? 70, op = 1 - out, lt = t - fx.t0;
    const last = (arr, r) => { let v = 0, at = -1; for (const e of arr || []) if (t >= e[0] && e[1] === r) { v = e[2] ?? 1; at = e[0]; } return [v, at]; };
    (fx.lanes || [0, 1, 2, 3]).forEach((r, i) => {
      const y0 = fx.y + r * (H + gap), y1 = y0 + H, x0 = fx.x, x1 = fx.x + W;
      const u = fx.t0 < 0 ? 1 : EASE.out(clamp((lt - i * (fx.pop ?? 0.8) / 4) / 0.4)); if (u <= 0) return;
      const [dm] = last(fx.dim, r), n0 = DL.items.length;
      const [hv, hat] = last(fx.hi, r);
      if (hv) stroke(`${k}.hi${r}`, N2.box(x0 - 8, y0 - 8, x1 + 8, y1 + 8), { z: Z.hi, w: 14, color: C.hi, opacity: 0.85 * clamp((t - hat) / 0.3) * op });
      stroke(`${k}.o${r}`, N2.box(x0, y0, x1, y1), { z: Z.set, w: 4, draw: u, fill: C.paper, opacity: op });
      N2.fill(`${k}.f${r}`, x0 + 2, y0 + 2, x0 + head, y1 - 2, r, { z: Z.set + 0.2, draw: u, opacity: op });
      stroke(`${k}.hl${r}`, [[x0 + head, y0], [x0 + head, y1]], { z: Z.set + 0.3, w: 3, draw: u, opacity: op });
      if (fx.labels !== false) text(`${k}.n${r}`, '余' + r, x0 - 14, (y0 + y1) / 2, { size: fx.labelSize || 40, z: Z.set + 0.3, anchor: 'end', font: CFG.FONT_MIX, opacity: u * op });
      F.targets[`${k}.lane${r}`] = [x0 + head / 2, (y0 + y1) / 2];
      if (dm) N2.fadeFrom(n0, 1 - 0.6 * dm);
    });
  },
  cues: fx => (fx.t0 >= 0 ? [[fx.t0, 'pen']] : []),
};

/* ---------------- 顶栏和议程条 n2_hud ----------------
   每一场都画一个 { type:'n2_hud', id:'hud', at:'<场景 id>', …事件 }。场景开始时的状态由 N2.HUD_AT[at] 给定（= 上一场结束时的状态），
   所以切场时顶栏不会跳。场景里只写"这一场发生的变化"：
     strip: t                      细跑道条出现（lanes 场结尾，跑道缩上去的那一刻）
     dock: [[t, n]]                卡 n 停靠：t 是 n2_bigcard 开始飞向顶栏的时刻（同一个 t 传给两边），t + 0.6 秒后由顶栏接着画
     agenda: t                     议程条出现（三个编号）
     tick: [[t, i]]                议程第 i 项（0、1、2）打勾：先展开文字 2.6 秒，再收回成"编号 + ✓"
     open: [[t0, t1, i]]           议程第 i 项临时展开（不打勾）
     collapse: [[t, on]]           顶栏收成一条细边（on = 1）/ 恢复（0）
     pop: [[t0, t1, n]]            卡 n 临时弹出（收起时也会出现），放大、垫黄
     flash: [[t, n]]               卡 n 闪一下
     stripHi: [[t0, t1, r]]        细跑道条的第 r 条描红（被引用）
     out: t                        整个顶栏 0.4 秒淡出（ending 场结尾）
   发布命名点 hud.card1 … card4（卡的中心）、hud.strip0 … strip3（细跑道条每条的中心）、hud.ag0 … ag2（议程编号的中心）。 */
N2.HUD_AT = {
  lanes: {},
  why4: { strip: 1 },
  agenda: { strip: 1, cards: 1 },
  squares: { strip: 1, cards: 1, agenda: 1 },
  even: { strip: 1, cards: 1, agenda: 1 },
  odd: { strip: 1, cards: 1, agenda: 1 },
  predict: { strip: 1, cards: 2, agenda: 1, ticks: [0] },
  proof: { strip: 1, cards: 2, agenda: 1, ticks: [0] },
  borrow: { strip: 1, cards: 2, agenda: 1, ticks: [0], collapsed: 1 },
  wall: { strip: 1, cards: 2, agenda: 1, ticks: [0], collapsed: 1 },
  dark: { strip: 1, cards: 3, agenda: 1, ticks: [0, 1] },
  enough: { strip: 1, cards: 3, agenda: 1, ticks: [0, 1, 2] },
  ending: { strip: 1, cards: 4, agenda: 1, ticks: [0, 1, 2] },
};
N2.CARDS = { 1: '零头不变', 2: '平方：0或1', 3: '相减：0、1、3', 4: '只判"不是"' };
N2.AGENDA = ['平方落哪几条？', '两个平方相减呢？', '余2：还没找到，还是根本没有？'];
N2.CIRC = ['①', '②', '③', '④'];
N2.HUD_GEO = {
  strip: [452, 80, 604, 156],                      // 细跑道条：四条，各高 15，间距 5
  card: n => [636 + (n - 1) * 232, 118],           // 卡 n 的中心
  cardWH: [218, 70],
  ag: i => [78 + i * 118, 128],                    // 议程编号 i 的中心
};
COMP.n2_hud = {
  draw(fx, t, F) {
    const S = N2.HUD_AT[fx.at] || {}, k = fx.id, G = N2.HUD_GEO;
    const out = fx.out !== undefined ? clamp((t - fx.out) / 0.4) : 0; if (out >= 1) return;
    const n0 = DL.items.length;
    // ---- state at t
    const stripT = S.strip ? -9 : fx.strip ?? Infinity;
    const cardT = n => (n <= (S.cards || 0) ? -9 : ((fx.dock || []).find(d => d[1] === n) || [Infinity])[0] + 0.6);
    const agT = S.agenda ? -9 : fx.agenda ?? Infinity;
    const tickT = i => ((S.ticks || []).includes(i) ? -9 : ((fx.tick || []).find(d => d[1] === i) || [Infinity])[0]);
    let col = S.collapsed ? 1 : 0, colAt = -9; for (const [tt, on] of fx.collapse || []) if (t >= tt) { col = on ? 1 : 0; colAt = tt; }
    const cu = clamp((t - colAt) / 0.35), cv = col ? EASE.io(cu) : 1 - EASE.io(cu);   // 0 = open, 1 = collapsed
    const cvv = colAt < 0 ? (col ? 1 : 0) : cv;
    // ---- collapsed: one thin line along the top edge
    if (cvv > 0.02 && t >= stripT) stroke(k + '.thin', [[452, 70], [1556, 70]], { z: Z.annot - 2, w: 5, color: C.pencil, opacity: cvv });
    const openK = 1 - cvv;
    // ---- strip
    if (t >= stripT && openK > 0.01) {
      const [x0, y0, x1] = G.strip, u = stripT < 0 ? 1 : EASE.out(clamp((t - stripT) / 0.4));
      for (let r = 0; r < 4; r++) {
        const ya = y0 + r * 20, yb = ya + 15;
        stroke(`${k}.sb${r}`, N2.box(x0, ya, x0 + (x1 - x0) * u, yb), { z: Z.annot - 2, w: 2.5, fill: C.paper, opacity: openK });
        N2.fill(`${k}.sf${r}`, x0 + 1, ya + 1, x0 + (x1 - x0) * u - 1, yb - 1, r, { z: Z.annot - 1.9, step: 9, dot: 2, w: 1.6, opacity: openK });
        F.targets[`${k}.strip${r}`] = [(x0 + x1) / 2, (ya + yb) / 2];
        for (const [a, b, rr] of fx.stripHi || []) if (rr === r && t >= a && t < b) stroke(`${k}.sh${r}`, ringPts(`${k}.shp${r}`, (x0 + x1) / 2, (ya + yb) / 2, (x1 - x0) / 2 + 14, 16, { n: 14 }), { z: Z.annot, w: 4, color: C.red, closed: true, draw: clamp((t - a) / 0.3) });
      }
    }
    // ---- cards
    const [cw, ch] = G.cardWH;
    for (let n = 1; n <= 4; n++) {
      const ct = cardT(n), [cx, cy] = G.card(n); F.targets[`${k}.card${n}`] = [cx, cy];
      const popE = (fx.pop || []).find(([a, b, nn]) => nn === n && t >= a && t < b + 0.3);
      if (t < ct) continue;
      let vis = openK, sc = 1, glow = 0;
      if (popE) { const [a, b] = popE, pu = clamp((t - a) / 0.25) * (1 - clamp((t - b) / 0.3)); vis = Math.max(vis, pu); sc = 1 + 0.15 * pu; glow = pu; }
      for (const [ft, nn] of fx.flash || []) if (nn === n && t >= ft && t < ft + 0.7) { const q = Math.sin(Math.PI * (t - ft) / 0.7); sc = Math.max(sc, 1 + 0.15 * q); glow = Math.max(glow, q); vis = Math.max(vis, q); }
      if (vis <= 0.01) continue;
      const fin = ct < 0 ? 1 : EASE.out(clamp((t - ct) / 0.2));
      DL.save(); DL.translate(cx, cy); DL.scale(sc);
      if (glow > 0) stroke(`${k}.cg${n}`, N2.box(-cw / 2 - 6, -ch / 2 - 6, cw / 2 + 6, ch / 2 + 6), { z: Z.annot - 1.5, w: 14, color: C.hi, opacity: 0.85 * glow });
      stroke(`${k}.c${n}`, N2.box(-cw / 2, -ch / 2, cw / 2, ch / 2), { z: Z.annot - 1, w: 3, fill: '#FFFFFF', opacity: vis * fin });
      text(`${k}.cn${n}`, N2.CIRC[n - 1], -cw / 2 + 24, 1, { size: 34, color: C.red, z: Z.annot - 0.8, anchor: 'middle', opacity: vis * fin });
      text(`${k}.ct${n}`, N2.CARDS[n], -cw / 2 + 46, 1, { size: 32, z: Z.annot - 0.8, anchor: 'start', font: CFG.FONT_MIX, opacity: vis * fin });
      DL.restore();
    }
    // ---- agenda bar
    if (t >= agT) {
      const au = agT < 0 ? 1 : EASE.back(clamp((t - agT) / 0.35));
      for (let i = 0; i < 3; i++) {
        const [ax, ay] = G.ag(i); F.targets[`${k}.ag${i}`] = [ax, ay];
        const tt = tickT(i), done = t >= tt;
        stroke(`${k}.ab${i}`, ringPts(`${k}.abp${i}`, ax - 14, ay, 30 * au, 30 * au, { n: 12 }), { z: Z.annot - 1, w: 3.5, color: C.red, closed: true, fill: '#FFFFFF' });
        text(`${k}.an${i}`, String(i + 1), ax - 14, ay + 1, { size: 36, color: C.red, z: Z.annot - 0.8, anchor: 'middle', font: CFG.FONT_MIX, opacity: au });
        if (done) {
          const tu = tt < 0 ? 1 : EASE.back(clamp((t - tt - 0.4) / 0.25));
          text(`${k}.ak${i}`, '✓', ax + 34, ay - 2, { size: 50 * Math.max(0.01, tu), color: C.red, z: Z.annot - 0.7, anchor: 'middle', font: CFG.FONT_MIX });
        }
        // expanded text: on a tick (2.6 s) or an explicit open
        let ex = 0;
        if (tt >= 0 && t >= tt) ex = clamp((t - tt) / 0.25) * (1 - clamp((t - tt - 2.6) / 0.3));
        for (const [a, b, ii] of fx.open || []) if (ii === i && t >= a) ex = Math.max(ex, clamp((t - a) / 0.25) * (1 - clamp((t - b) / 0.3)));
        if (ex > 0.01) {
          const s = N2.AGENDA[i], w = textWidth(s, 36) * 0.95 + 40, x0 = 44, y0 = 178;
          stroke(`${k}.ae${i}`, N2.box(x0, y0, x0 + w, y0 + 62), { z: Z.annot + 1, w: 3, color: C.red, fill: '#FFFFFF', opacity: ex });
          text(`${k}.at${i}`, s, x0 + 20, y0 + 32, { size: 36, z: Z.annot + 1.2, anchor: 'start', font: CFG.FONT_MIX, opacity: ex });
          stroke(`${k}.al${i}`, [[ax - 14, ay + 30], [x0 + 40, y0]], { z: Z.annot + 0.9, w: 2.5, color: C.red, opacity: ex });
        }
      }
    }
    if (out > 0) N2.fadeFrom(n0, 1 - out);
  },
  cues: fx => [
    ...(fx.strip !== undefined ? [[fx.strip, 'swish']] : []),
    ...(fx.dock || []).map(([tt]) => [tt + 0.6, 'tap']),
    ...(fx.agenda !== undefined ? [[fx.agenda, 'pop']] : []),
    ...(fx.tick || []).map(([tt]) => [tt + 0.4, 'pen']),
    ...(fx.pop || []).map(([tt]) => [tt, 'plip']),
  ],
};

/* ---------------- 结论卡 n2_bigcard ----------------
   { type:'n2_bigcard', id, n,              // 卡号 1–4（左上角红色 ①…④）
     at: [cx, cy], w: 760,                  // 中心、宽（高按行数）
     lines: ['每个平方 ÷ 4：', '只余 0 或 1'], size: 52,
     t0,                                    // 开始写（白卡 0.3 秒画出，文字逐字出现，最后一行垫黄色荧光笔）
     cps: 14,                               // 每秒字数
     sub: '它给的是必须满足的条件',          // 可选：下面一行小字（36 号）
     dock: t }                              // 可选：t 起 0.6 秒飞进顶栏卡 n 的位置并缩小；之后不画（顶栏接着画，hud 的 dock 用同一个 t）
   发布命名点 <id>.c（卡中心，飞行时跟着动）、<id>.r（卡右边缘中点，钉范围卡用）。 */
COMP.n2_bigcard = {
  draw(fx, t, F) {
    if (t < fx.t0) return;
    if (fx.dock !== undefined && t >= fx.dock + 0.6) return;
    const k = fx.id, size = fx.size || 52, L = fx.lines || [], w = fx.w || 760, lh = size * 1.3;
    const h = 40 + L.length * lh + (fx.sub ? 54 : 0) + 20, lt = t - fx.t0, p = EASE.out(clamp(lt / 0.3));
    let cx = fx.at[0], cy = fx.at[1], sc = 1;
    if (fx.dock !== undefined && t > fx.dock) {
      const u = EASE.io(clamp((t - fx.dock) / 0.6)), [dx, dy] = N2.HUD_GEO.card(fx.n);
      cx = lerp(cx, dx, u); cy = lerp(cy, dy, u); sc = lerp(1, N2.HUD_GEO.cardWH[0] / w, u);
    }
    F.targets[k + '.c'] = [cx, cy]; F.targets[k + '.r'] = [cx + w / 2 * sc, cy];
    DL.save(); DL.translate(cx, cy); DL.scale(sc);
    stroke(k + '.b', N2.box(-w / 2, -h / 2, w / 2, h / 2), { z: Z.annot - 1, w: 4, fill: '#FFFFFF', draw: p });
    text(k + '.n', N2.CIRC[(fx.n || 1) - 1], -w / 2 + 34, -h / 2 + 36, { size: 48, color: C.red, z: Z.annot - 0.5, anchor: 'middle', opacity: p });
    let shown = (lt - 0.3) * (fx.cps || 14);
    L.forEach((s, i) => {
      const n = Math.max(0, Math.min(s.length, Math.floor(shown))); shown -= s.length;
      const y = -h / 2 + 40 + lh * (i + 0.5);
      if (i === L.length - 1 && n > 0) {
        const bw = textWidth(s, size) * 0.93;
        stroke(`${k}.hi${i}`, [[-bw / 2 - 10, y + 4], [bw / 2 + 10, y + 4]], { z: Z.annot - 0.9, w: size * 0.95, color: C.hi, draw: clamp(n / s.length), opacity: 0.9 });
      }
      if (n > 0) text(`${k}.l${i}`, s.slice(0, n), -textWidth(s, size) * 0.465, y, { size, z: Z.annot - 0.5, anchor: 'start', font: CFG.FONT_MIX });
    });
    if (fx.sub && shown > 0) text(k + '.sub', fx.sub, 0, h / 2 - 40, { size: 36, z: Z.annot - 0.5, anchor: 'middle', color: C.pencil, opacity: clamp(shown / 4) });
    DL.restore();
  },
  cues: fx => [[fx.t0, 'paper'], ...(fx.dock !== undefined ? [[fx.dock, 'whoosh']] : [])],
};

/* ---------------- "猜想"标签 n2_tag ----------------
   { type:'n2_tag', id, at: [x, y] 或 pos: [[t, [x, y]], …], rot: -6,
     text: '猜想', size: 40,                // 第 1 集表上的那张用 text: '猜想（还没证明）', size: 50, rot: -3
     t0,                                    // 盖上（放大落下）
     swap: t,                               // 可选：红框标签被撕下（往下掉、转、淡出），原处弹出黄底"证明了 ✓"
     t1 }                                   // 可选：0.3 秒淡出 */
COMP.n2_tag = {
  draw(fx, t, F) {
    if (t < fx.t0) return;
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.3) : 0; if (out >= 1) return;
    const k = fx.id, size = fx.size || 40, [x, y] = fx.pos ? evalTrack(fx.pos, t) : fx.at, rot = fx.rot ?? -6, n0 = DL.items.length;
    const box = (key, s, color, fill, sz) => { const w = textWidth(s, sz) * 0.95 + 40, h = sz + 30; stroke(key + '.b', N2.box(-w / 2, -h / 2, w / 2, h / 2), { z: Z.annot + 1, w: 4.5, color, fill }); };
    const u = clamp((t - fx.t0) / 0.25);
    const torn = fx.swap !== undefined ? clamp((t - fx.swap) / 0.5) : 0;
    if (torn < 1) {
      DL.save(); DL.translate(x + 30 * torn, y + 160 * torn * torn); DL.rotate(rot + 50 * torn); DL.scale(Math.max(0.01, lerp(1.5, 1, EASE.back(u))));
      const a = n0; box(k + '.r', fx.text || '猜想', C.red, C.paper, size);
      text(k + '.rt', fx.text || '猜想', 0, 2, { size, color: C.red, z: Z.annot + 1.2, anchor: 'middle' });
      N2.fadeFrom(a, clamp(u * 3) * (1 - torn));
      DL.restore();
    }
    if (fx.swap !== undefined && t >= fx.swap + 0.15) {
      const v = EASE.back(clamp((t - fx.swap - 0.15) / 0.3)), s = '证明了 ✓', sz = Math.round(size * 0.95);
      DL.save(); DL.translate(x, y); DL.rotate(rot * 0.5); DL.scale(Math.max(0.01, v));
      const w = textWidth(s, sz) * 0.95 + 40, h = sz + 30;
      stroke(k + '.gh', [[-w / 2 + 8, 0], [w / 2 - 8, 0]], { z: Z.annot + 0.9, w: h - 6, color: C.hi, opacity: 0.95 });
      stroke(k + '.gb', N2.box(-w / 2, -h / 2, w / 2, h / 2), { z: Z.annot + 1, w: 4 });
      text(k + '.gt', s, 0, 2, { size: sz, z: Z.annot + 1.2, anchor: 'middle', font: CFG.FONT_MIX });
      DL.restore();
    }
    if (out > 0) N2.fadeFrom(n0, 1 - out);
  },
  cues: fx => [[fx.t0, 'stamp'], ...(fx.swap !== undefined ? [[fx.swap, 'swish'], [fx.swap + 0.15, 'pop']] : [])],
};

/* ---------------- 证明栈 n2_stack ----------------
   右侧一栏（x N2.STACK_X 起，宽约 380），每行一步；当前行黑墨 + 黄色荧光笔，讲过的行变灰不擦。
   { type:'n2_stack', id:'stack', x: N2.STACK_X, y: N2.STACK_Y, lh: N2.STACK_LH, size: 34,   // 位置都有默认值，四场不要改
     from: k,                 // 场景开始时已经写好的行数（前一场写过的）；配合 cur: [[0, k-1]] 让上一场最后的当前行接着高亮，切场不跳
     add: [[t, i]],           // 第 i 行写出来并成为当前行
     cur: [[t, i]],           // 第 i 行重新成为当前行（-1 = 没有当前行）
     all: t,                  // 整列一起亮（都变黑）
     stamp: t,                // 栈顶盖红章"反证法"
     box: t,                  // 所有行里的 6 被红笔改成 □（dark 场）
     glow: t,                 // "□ 在余 2"那行的"余 2"发红光
     ok: t,                   // 其余各行右边打 ✓，栏下写"对任何 □ 都成立"
     t1 }                     // 0.4 秒淡出
   行的内容固定在 N2.STACK（四场共用同一份），行号见下。发布命名点 <id>.l0 … l7（每行左端）。 */
N2.STACK = [
  '假设：a² − b² = 6',        // 0  proof
  '两个零头：0 或 1',          // 1  proof
  '相减：0、1，或借一组得 3',   // 2  borrow
  '组够减',                    // 3  borrow
  '要借时，借得到',             // 4  borrow
  '相减的零头：0、1、3',        // 5  wall
  '6 在余 2，不在 0、1、3',     // 6  wall
  '撞墙：6 没有小拐角',         // 7  wall
];
COMP.n2_stack = {
  draw(fx, t, F) {
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.4) : 0; if (out >= 1) return;
    const k = fx.id, x = fx.x ?? N2.STACK_X, y0 = fx.y ?? N2.STACK_Y, lh = fx.lh || N2.STACK_LH, size = fx.size || 34, n0 = DL.items.length;
    const addT = i => (i < (fx.from || 0) ? -9 : ((fx.add || []).find(a => a[1] === i) || [Infinity])[0]);
    let cur = -1; const ev = [...(fx.add || []), ...(fx.cur || [])].sort((a, b) => a[0] - b[0]);
    for (const [tt, i] of ev) if (t >= tt) cur = i;
    const all = fx.all !== undefined && t >= fx.all, boxed = fx.box !== undefined && t >= fx.box;
    let any = false;
    N2.STACK.forEach((s0, i) => {
      const at = addT(i); if (t < at) return; any = true;
      const y = y0 + i * lh, u = at < 0 ? 1 : clamp((t - at) / 0.35);
      const s = boxed && s0.includes('6') ? s0.replace(/6/g, '□') : s0;
      const isCur = i === cur && !all, col = isCur || all ? C.ink : C.pencil;
      if (isCur) stroke(`${k}.hi${i}`, [[x - 6, y + 3], [x + Math.min(380, textWidth(s, size) * 0.95) + 6, y + 3]], { z: Z.hi, w: size * 1.05, color: C.hi, draw: u, opacity: 0.9 });
      text(`${k}.t${i}`, s, x, y, { size, z: Z.annot - 1, anchor: 'start', font: CFG.FONT_MIX, color: col, opacity: u });
      if (boxed && s0.includes('6')) { const bu = clamp((t - fx.box) / 0.3); if (bu < 1) stroke(`${k}.bx${i}`, ringPts(`${k}.bxp${i}`, x + 20, y, 26, 26, { n: 10 }), { z: Z.annot, w: 3.5, color: C.red, closed: true, opacity: 1 - bu }); }
      if (i === 6 && fx.glow !== undefined && t >= fx.glow) {
        const g = clamp((t - fx.glow) / 0.3), off = textWidth(s.slice(0, s.indexOf('余')), size) * 0.93;
        stroke(`${k}.gl`, ringPts(`${k}.glp`, x + off + 44, y, 50, 26, { n: 14 }), { z: Z.annot, w: 5, color: C.red, closed: true, draw: g });
      }
      if (fx.ok !== undefined && t >= fx.ok + i * 0.08 && !s0.includes('6')) text(`${k}.ok${i}`, '✓', x + 392, y - 2, { size: 40, color: C.red, z: Z.annot, anchor: 'middle', font: CFG.FONT_MIX });
      F.targets[`${k}.l${i}`] = [x, y];
    });
    if (fx.ok !== undefined && t >= fx.ok + 0.7) text(k + '.okt', '对任何 □ 都成立', x - 40, y0 + 3.5 * lh, { size: 36, color: C.red, z: Z.annot, anchor: 'end', font: CFG.FONT_MIX, opacity: clamp((t - fx.ok - 0.7) / 0.3) });
    if (any) stroke(k + '.rule', [[x - 24, y0 - 30], [x - 24, y0 + 7.6 * lh]], { z: Z.set, w: 2.5, color: C.pencil, opacity: 0.7 });
    if (fx.stamp !== undefined && t >= fx.stamp) {
      const su = clamp((t - fx.stamp) / 0.2), sc = lerp(1.8, 1, EASE.back(su));
      DL.save(); DL.translate(x + 270, y0 - 30); DL.rotate(-8); DL.scale(sc);
      stroke(k + '.st', N2.box(-92, -34, 92, 34), { z: Z.stamp, w: 5, color: C.red, opacity: clamp(su * 3) });
      text(k + '.stt', '反证法', 0, 2, { size: 44, color: C.red, z: Z.stamp, anchor: 'middle', opacity: clamp(su * 3) });
      DL.restore();
    }
    if (out > 0) N2.fadeFrom(n0, 1 - out);
  },
  cues: fx => [...(fx.add || []).map(([tt]) => [tt, 'pen']), ...(fx.stamp !== undefined ? [[fx.stamp, 'stamp']] : []), ...(fx.box !== undefined ? [[fx.box, 'pen']] : [])],
};

/* ---------------- 红色小星（撞到时；第 1 集 d1_star 的通用版）{ at, r: 20, t0, dur: 1.5 } ---------------- */
COMP.n2_star = {
  draw(fx, t) {
    const lt = t - fx.t0, dur = fx.dur || 1.5, R = fx.r || 20; if (lt < 0 || lt >= dur) return;
    const [x, y] = fx.at, s = Math.max(0.01, EASE.back(clamp(lt / 0.22))), op = 1 - clamp((lt - dur + 0.35) / 0.35), k = fx.id;
    const pts = []; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * RAD, r = (i % 2 ? 0.45 : 1) * R; pts.push([Math.cos(a) * r, Math.sin(a) * r, 1]); }
    pts.push([pts[0][0], pts[0][1], 1]);
    DL.save(); DL.translate(x, y - 12 * clamp(lt / dur)); DL.rotate(10 * Math.sin(lt * 5)); DL.scale(s);
    stroke(k + '.s', pts, { z: Z.fx, w: 3.5, color: C.red, fill: C.red, opacity: op, boil: 0.3 });
    DL.restore();
    const lu = clamp(lt / 0.25), lo = 1 - clamp((lt - 0.35) / 0.3);
    if (lo > 0) [-40, 0, 40].forEach((a, i) => {
      const ang = (a - 150) * RAD, r0 = R + 10, r1 = r0 + 20 * lu;
      stroke(`${k}.l${i}`, [[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], { z: Z.fx, w: 3.5, color: C.red, opacity: lo });
    });
  },
  cues: fx => [[fx.t0 + 0.05, 'plip']],
};

/* ---------------- 翻页（第 1 集 a1_flip）{ t0, dur: 0.9 }：一张纸从右往左扫过旧画面（新画面画在纸后面） ---------------- */
COMP.n2_flip = {
  draw(fx, t) {
    const u = (t - fx.t0) / (fx.dur || 0.9); if (u <= 0 || u >= 1) return;
    const e = EASE.io(u), k = fx.id;
    const X = y => lerp(1760, -260, e) + (y - 400) * 0.22 + 30 * Math.sin(y / 795 * Math.PI);
    const edge = [0, 100, 200, 300, 400, 500, 600, 700, 795].map(y => [X(y), y]);
    stroke(k + '.sheet', [...edge, [1720, 795, 1], [1720, 0, 1], [X(0), 0, 1]], { z: 55, fill: C.paper, noStroke: true, w: 1, boil: 0 });
    stroke(k + '.sh', edge.map(([x, y]) => [x - 16, y]), { z: 55.1, w: 3, color: C.pencil, opacity: 0.6 });
    stroke(k + '.edge', edge, { z: 55.2, w: 4.5 });
  },
  cues: fx => [[fx.t0, 'swish']],
};

/* ---------------- 9 个点排成一行，红圈圈成 4 | 4 | 1，最后一个红点（第 1 集片尾那排）；局部原点 = 第一个点 ---------------- */
PROPS.n2_group9 = (fx, t, lt, p) => {
  const k = fx.id, xs = [0, 36, 72, 108, 170, 206, 242, 278, 340], ringAt = fx.ringAt ?? 0.7;
  xs.forEach((x, i) => { if (p * 9 > i) dot(`${k}.d${i}`, [x, 0], 11, i === 8 ? C.red : C.ink, Z.front); });
  if (lt > ringAt) [[0, 108], [170, 278]].forEach(([a, b], g) => stroke(`${k}.r${g}`, ringPts(`${k}.rp${g}`, (a + b) / 2, 0, (b - a) / 2 + 24, 26, { n: 16 }), { z: Z.annot, w: 4, color: C.red, closed: true, draw: clamp((lt - ringAt - g * 0.25) / 0.35) }));
};

/* ---------------- "还没找到 / 根本没有"两格（第 1 集 20_six 的画法，简化） ----------------
   { type:'n2_panels', id, t0, xf: [[t, [tx, ty, s]]],   // 原尺寸：左格 [90,172,610,690]，右格 [690,172,1210,690]；xf 缩放移动（缩成小卡用）
     stamp: t,                          // 右格"根本没有"上盖红章 ✓
     lock: t, lockOut: t,               // 右格旁边挂锁牌"这个世界上谁都做不到"（引用①后半）；lockOut 起淡出
     t1 }                               // 0.35 秒淡出
   发布命名点 <id>.L、<id>.R（两格中心，已按 xf 换算）。 */
COMP.n2_panels = {
  draw(fx, t, F) {
    if (t < fx.t0) return;
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.35) : 0; if (out >= 1) return;
    const k = fx.id, lt = t - fx.t0, n0 = DL.items.length, GND = 650;
    const [tx, ty, s] = fx.xf ? evalTrack(fx.xf, t) : [0, 0, 1];
    F.targets[k + '.L'] = [tx + 350 * s, ty + 431 * s]; F.targets[k + '.R'] = [tx + 950 * s, ty + 431 * s];
    DL.save(); DL.translate(tx, ty); DL.scale(s);
    const panel = (kk, [x0, y0, x1, y1], cap) => {
      stroke(kk + '.f', N2.box(x0, y0, x1, y1), { z: Z.board, w: 5, fill: C.paper, draw: fx.t0 < 0 ? 1 : EASE.out(clamp(lt / 0.4)) });
      text(kk + '.cap', cap, (x0 + x1) / 2, y0 + 58, { size: 56, z: Z.board + 1, anchor: 'middle', opacity: fx.t0 < 0 ? 1 : clamp((lt - 0.3) / 0.2) });
      stroke(kk + '.g', [[x0 + 30, GND], [x1 - 30, GND + 2]], { z: Z.board + 0.5, w: 2.4, color: C.pencil, opacity: 0.8 });
    };
    panel(k + '.pl', [90, 172, 610, 690], '还没找到');
    panel(k + '.pr', [690, 172, 1210, 690], '根本没有');
    const a = fx.t0 < 0 ? 1 : clamp((lt - 0.4) / 0.3), z = Z.board + 1, o = { z, w: 4.5, opacity: a };
    // left: a little person flipping through a pile of scratch paper
    for (let i = 0; i < 6; i++) { const y = GND - 6 - i * 9, x = 445 + [0, 6, -5, 8, -3, 4][i]; stroke(`${k}.pp${i}`, N2.box(x - 64, y - 4, x + 64, y + 4), { z: z + i * 0.01, w: 3, fill: C.paper, opacity: a }); }
    const fl = Math.max(0, Math.sin(lt * 2 * Math.PI / 0.9)), hip = [300, 590], neck = [328, 540], head = [348, 510], sh = [324, 550];
    stroke(k + '.lgL', [hip, [292, 620], [278, GND]], o); stroke(k + '.lgR', [hip, [316, 620], [328, GND]], o);
    stroke(k + '.bd', [hip, neck], o);
    stroke(k + '.amA', [sh, [356, 574], [386, 594 - 14 * fl]], o); stroke(k + '.amB', [sh, [348, 584], [378, 604]], o);
    stroke(k + '.hd', ringPts(k + '.hr', head[0], head[1], 26, 26, { n: 12, closed: true }), { ...o, closed: true, fill: C.paper });
    dot(k + '.e0', [356, 514], 3.6, C.ink, z + 0.1); dot(k + '.e1', [368, 513], 3.6, C.ink, z + 0.1);
    // right: a door with a padlock
    stroke(k + '.door', [[870, GND], [870, 330, 1], [1030, 330, 1], [1030, GND]], { z, w: 5.5, fill: C.paper, opacity: a });
    stroke(k + '.in', [[892, GND - 14], [892, 352, 1], [1008, 352, 1], [1008, GND - 14]], { z: z + 0.1, w: 2.4, color: C.pencil, opacity: 0.8 * a });
    stroke(k + '.lk', N2.box(930, 480, 970, 520), { z: z + 0.3, w: 4, fill: C.paper, opacity: a });
    stroke(k + '.sh', [[936, 480], [938, 462], [950, 456], [962, 462], [964, 480]], { z: z + 0.3, w: 4, opacity: a });
    if (fx.stamp !== undefined && t >= fx.stamp) {
      const su = clamp((t - fx.stamp) / 0.2), sc = lerp(1.8, 1, EASE.back(su));
      DL.save(); DL.translate(1100, 250); DL.rotate(-12); DL.scale(sc);
      stroke(k + '.st', ringPts(k + '.stp', 0, 0, 56, 56, { n: 14, a0: -110, sweep: 372 }), { z: Z.stamp, w: 6, color: C.red, opacity: clamp(su * 3) });
      text(k + '.stt', '✓', 0, 4, { size: 72, color: C.red, z: Z.stamp, anchor: 'middle', font: CFG.FONT_MIX, opacity: clamp(su * 3) });
      DL.restore();
    }
    if (fx.lock !== undefined && t >= fx.lock) {
      const lu = EASE.back(clamp((t - fx.lock) / 0.3)), lo = fx.lockOut !== undefined ? 1 - clamp((t - fx.lockOut) / 0.35) : 1, m0 = DL.items.length;
      DL.save(); DL.translate(1250, 300); DL.rotate(4 * Math.sin((t - fx.lock) * 3) * (1 - clamp((t - fx.lock) / 1.5))); DL.scale(Math.max(0.01, lu));
      stroke(k + '.ls', [[-120, 0], [0, -60, 1], [120, 0]], { z: Z.annot, w: 3 });
      stroke(k + '.lb', N2.box(-170, 0, 170, 130), { z: Z.annot, w: 4.5, fill: '#F3E3C3' });
      text(k + '.lt1', '这个世界上', 0, 40, { size: 40, z: Z.annot + 0.2, anchor: 'middle' });
      text(k + '.lt2', '谁都做不到', 0, 92, { size: 40, z: Z.annot + 0.2, anchor: 'middle', color: C.red });
      DL.restore(); N2.fadeFrom(m0, lo);
    }
    DL.restore();
    if (out > 0) N2.fadeFrom(n0, 1 - out);
  },
  cues: fx => [[fx.t0, 'paper'], ...(fx.stamp !== undefined ? [[fx.stamp, 'stamp']] : []), ...(fx.lock !== undefined ? [[fx.lock, 'thud']] : [])],
};

/* ---------------- 第 1 集的结论卡（缩略图）：白卡 + 黄色荧光笔"每一个正奇数，都是两个平方的差"；局部原点 = 卡中心，配合 prop 的 scale 缩放 ---------------- */
PROPS.n2_c1card = (fx, t, lt, p) => {
  const k = fx.id, w = 620, h = 170, z = Z.annot - 1;
  stroke(k + '.b', N2.box(-w / 2, -h / 2, w / 2, h / 2), { z, w: 4, fill: '#FFFFFF', draw: p });
  const o = clamp(p * 2 - 0.6);
  stroke(k + '.hi', [[-250, 34], [250, 34]], { z: z + 0.1, w: 52, color: C.hi, opacity: 0.9 * o });
  text(k + '.l1', '每一个正奇数，', 0, -32, { size: 50, z: z + 0.2, anchor: 'middle', opacity: o });
  text(k + '.l2', '都是两个平方的差', 0, 34, { size: 50, z: z + 0.2, anchor: 'middle', opacity: o });
  if (fx.tag) text(k + '.tg', fx.tag, w / 2 - 10, -h / 2 - 26, { size: 34, z: z + 0.2, anchor: 'end', color: C.red, opacity: o });
};

/* ---------------- 地图 n2_map：第 1 集的 n1_map 加本集的几样东西 ----------------
   n1_map 的参数照用（t0、t1、doorL、doorR、steps、lit、ticks、qs、fog），另加：
     labelR: t / labelL: t     门楣上写出"余数门" / "因子门"（红字，门顶上方）
     openR: t                  右门打开（门板向右收窄 0.7 秒），门后是四条小跑道
     lightL: t                 左门开一条缝、透出黄光；门板上画第 1 集那个 6 = 2 × 3 的小长方形（2 行 3 列点）
     halfLit: [[t, i]]         第 i 级台阶只亮偶数那一半（右半边）
     flag: [[t, i]]            第 i 级台阶偶数一侧插一面网点小旗"余2"
     split: [[t, i]]           第 i 级台阶偶数一侧的问号拆成两半："✗ 没有"（网点底）和"?"（实心底）；配合 n1_map 的 qs 不要再给这一级
   布局（n1_map 固定）：左门中心 (300, 470)，右门中心 (1300, 470)，门宽 190、高 300；台阶第 i 级踏面 x 520+112i … 632+112i，y 700−92i。 */
COMP.n2_map = {
  init(fx) { fx._m = { ...fx, type: 'n1_map' }; return fx; },
  draw(fx, t, F) {
    if (t < fx.t0) return;
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.4) : 0; if (out >= 1) return;
    COMP.n1_map.draw(fx._m, t, F);
    const k = fx.id + 'x', op = 1 - out, n0 = DL.items.length;
    const on = v => v !== undefined && t >= v;
    const sx = i => 520 + i * 112, sy = i => 700 - i * 92;
    if (on(fx.labelR)) text(k + '.lr', '余数门', 1300, 282, { size: 52, color: C.red, z: Z.annot, anchor: 'middle', opacity: clamp((t - fx.labelR) / 0.3), halo: true });
    if (on(fx.labelL)) text(k + '.ll', '因子门', 300, 282, { size: 52, color: C.red, z: Z.annot, anchor: 'middle', opacity: clamp((t - fx.labelL) / 0.3), halo: true });
    if (on(fx.openR)) {
      const u = EASE.io(clamp((t - fx.openR) / 0.7)), x0 = 1215, x1 = 1385, y0 = 350, y1 = 615;
      // behind the door: four little lanes
      for (let r = 0; r < 4; r++) { const ya = y0 + 20 + r * 62, yb = ya + 46; stroke(`${k}.bl${r}`, N2.box(x0 + 4, ya, x1 - 4, yb), { z: Z.board + 1.2, w: 3, fill: C.paper }); N2.fill(`${k}.bf${r}`, x0 + 6, ya + 2, x0 + 50, yb - 2, r, { z: Z.board + 1.3, step: 12, dot: 2.6 }); }
      // the door leaf swinging open (narrows towards the right jamb)
      const lx = lerp(x0, x1 - 18, u);
      stroke(k + '.leaf', [[lx, y0 - 6], [x1, y0 - 12 * u, 1], [x1, y1 + 12 * u, 1], [lx, y1 + 6, 1], [lx, y0 - 6, 1]], { z: Z.board + 1.5, w: 4.5, fill: '#F3E3C3' });
    }
    if (on(fx.lightL)) {
      const u = clamp((t - fx.lightL) / 0.5);
      stroke(k + '.slit', [[392, 350], [392, 615]], { z: Z.hi, w: 18, color: C.hi, opacity: 0.9 * u });
      for (let q = 0; q < 3; q++) stroke(`${k}.ray${q}`, [[400, 400 + q * 80], [440 + 30 * u, 380 + q * 90]], { z: Z.hi, w: 6, color: C.hi, opacity: 0.8 * u });
      stroke(k + '.r6', N2.box(250, 520, 350, 586), { z: Z.board + 1.5, w: 3.5, fill: '#FFFFFF', opacity: u });
      for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) dot(`${k}.d6${i}${j}`, [270 + j * 30, 538 + i * 30], 6, C.ink, Z.board + 1.6);
    }
    for (const [tt, i] of fx.halfLit || []) if (t >= tt) stroke(`${k}.hl${i}`, [[sx(i) + 60, sy(i) - 8], [sx(i + 1) - 6, sy(i) - 8]], { z: Z.hi, w: 16, color: C.hi, draw: clamp((t - tt) / 0.3), opacity: 0.9 });
    for (const [tt, i] of fx.flag || []) if (t >= tt) {
      const u = EASE.back(clamp((t - tt) / 0.3)), x = sx(i) + 96, y = sy(i) - 10;
      stroke(`${k}.fp${i}`, [[x, y], [x, y - 110 * u]], { z: Z.annot, w: 4 });
      stroke(`${k}.ff${i}`, N2.box(x, y - 110 * u, x + 92 * u, y - 60 * u), { z: Z.annot, w: 3.5, fill: C.paper });
      if (u > 0.9) { N2.fill(`${k}.fd${i}`, x + 3, y - 107, x + 30, y - 63, 2, { z: Z.annot + 0.1, step: 10, dot: 2.2 }); text(`${k}.ft${i}`, '余2', x + 62, y - 85, { size: 32, z: Z.annot + 0.2, anchor: 'middle', font: CFG.FONT_MIX }); }
    }
    for (const [tt, i] of fx.split || []) if (t >= tt) {
      const u = clamp((t - tt) / 0.3), x = sx(i) + 56, y = sy(i);
      stroke(`${k}.sa${i}`, N2.box(x, y - 74, x + 26, y - 14), { z: Z.annot - 0.2, w: 2.5, fill: C.paper, opacity: u });
      N2.fill(`${k}.sad${i}`, x + 2, y - 72, x + 24, y - 16, 2, { z: Z.annot - 0.1, step: 9, dot: 2, opacity: u });
      text(`${k}.sx${i}`, '✗', x + 13, y - 44, { size: 44, color: C.red, z: Z.annot, anchor: 'middle', font: CFG.FONT_MIX, opacity: u });
      stroke(`${k}.sb${i}`, N2.box(x + 30, y - 74, x + 56, y - 14), { z: Z.annot - 0.2, w: 2.5, fill: '#FFFFFF', opacity: u });
      text(`${k}.sq${i}`, '?', x + 43, y - 44, { size: 44, color: C.red, z: Z.annot, anchor: 'middle', font: CFG.FONT_MIX, opacity: u });
      text(`${k}.sl${i}`, '没有', x - 2, y + 40, { size: 32, color: C.red, z: Z.annot, anchor: 'middle', opacity: u });
    }
    if (op < 1) N2.fadeFrom(n0, op);
  },
  cues: fx => [...(COMP.n1_map.cues ? COMP.n1_map.cues(fx) : []), ...(fx.openR !== undefined ? [[fx.openR, 'whoosh']] : []), ...(fx.labelR !== undefined ? [[fx.labelR, 'pen']] : []), ...(fx.labelL !== undefined ? [[fx.labelL, 'pen']] : [])],
};
