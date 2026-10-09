/* 第 1 集共用素材（主持人独占；场景代理只读）
   - N1.kid：Jasper（和《数学少年陶哲轩》第 6 集结尾同一个孩子）
   - COMP.n1_desk：Jasper 的书桌（本子封面写 Jasper）
   - COMP.n1_dots：点阵（拿掉左下角、描出"一圈"、胳膊折叠配对、省略号表示一般的 n）
   - COMP.n1_map：全局地图（因子门、余数门、五级台阶、雾）
   - PROPS.n1_card：范围卡片（图钉 + 一小段数轴）
   - PROPS.n1_mark：Jasper 的记号 ┐
   - PROPS.n1_sign：举着的木牌 */
const N1 = {
  kid: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'messy', kid: true, blink: [3.2, 1.3] },
  FL: 780,
};

/** 书桌：at = [桌面中心 x, 桌面 y]；本子封面写 Jasper（t0 < 0 表示切进来时已经在） */
COMP.n1_desk = {
  draw(fx, t) {
    if (t < fx.t0 || (fx.t1 !== undefined && t > fx.t1 + 0.35)) return;
    const pin = fx.t0 < 0 ? 1 : EASE.out(clamp((t - fx.t0) / 0.5));
    const pout = fx.t1 !== undefined ? 1 - clamp((t - fx.t1) / 0.35) : 1;
    const [x, y] = fx.at, k = fx.id, z = Z.desk, o = { z, w: 6, draw: pin, opacity: pout };
    stroke(k + '.top', [[x - 170, y], [x + 170, y]], o);
    stroke(k + '.l1', [[x - 150, y], [x - 150, fx.floor ?? N1.FL]], { ...o, w: 5 });
    stroke(k + '.l2', [[x + 150, y], [x + 150, fx.floor ?? N1.FL]], { ...o, w: 5 });
    stroke(k + '.bk', [[x - 120, y - 6], [x - 110, y - 46, 1], [x + 20, y - 40, 1], [x + 10, y - 2, 1]], { z: z + 0.2, w: 4, closed: true, fill: C.paper, draw: pin, opacity: pout });
    if (pin > 0.6) text(k + '.nm', 'Jasper', x - 50, y - 24, { size: 36, z: z + 0.3, rot: -4, opacity: pout });
  },
  cues: fx => (fx.t0 >= 0 ? [[fx.t0, 'paper']] : []),
};

/* ---------------------------------------------------------------------
   点阵 n1_dots
   { type:'n1_dots', id, x, y,            // 左上角那个点的位置
     N: 4, gap: 46, r,                    // 每边 N 个点；点距；点半径（默认 gap*0.2，最小 6）
     rows,                                // 可选：行数（默认 N，用来画长方形）
     t0, pop: 0.5,                        // 出现时间；pop 秒内一行一行冒出来（t0<0 表示已经在）
     t1,                                  // 可选：0.35 秒淡出
     cut: { k: 3, t: 2, dur: 0.5 },       // 可选：左下角 k×k 先被红圈圈住，再淡出（拿掉）
     band: { t },                         // 可选：最外一圈（上边一行 + 右边一列）垫上黄色荧光笔
     arms: { t },                         // 可选：两条胳膊用实线描，角上那个点用虚线圈（全集固定画法）
     fold: { t, dur: 0.8 },               // 可选：右边那条胳膊转到上边胳膊的正上方，一个对一个（角上的点不动）
     pairs: { t },                        // 可选：折叠后每一对点用红色小椭圆圈起来（配合 fold）
     ell: 3,                              // 可选：第 ell 行和第 ell 列画成省略号（表示"随便多大"）
     hide: (i, j) => bool,                // 可选：不画某些点（例如只剩 99 个点的形状）
     color }                              // 点的颜色，默认墨色
   发布命名点：<id>.corner（角上那个点）、<id>.top（上边胳膊中点上方）、<id>.right（右边胳膊中点右侧）、
   <id>.center（整个点阵中心）、<id>.bl（左下角 k×k 块的中心，有 cut 时）、<id>.size（右下角外侧，用来标 N）。
   --------------------------------------------------------------------- */
COMP.n1_dots = {
  init(fx) {
    fx.gap = fx.gap || 46; fx.rows = fx.rows || fx.N; fx.r = fx.r || Math.max(6, fx.gap * 0.2); fx.pop = fx.pop ?? 0.5;
    return fx;
  },
  pos(fx, i, j) { return [fx.x + j * fx.gap, fx.y + i * fx.gap]; },
  draw(fx, t, F) {
    if (t < fx.t0) return;
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.35) : 0; if (out >= 1) return;
    const k = fx.id, N = fx.N, R = fx.rows, g = fx.gap, op = 1 - out, lt = t - fx.t0;
    const isCorner = (i, j) => i === 0 && j === N - 1;
    const inTop = (i, j) => i === 0 && j < N - 1, inRight = (i, j) => j === N - 1 && i > 0;
    // fold: right-arm dot at row i moves to column N-1-i, one row above the top arm
    const fu = fx.fold ? EASE.io(clamp((t - fx.fold.t) / (fx.fold.dur || 0.8))) : 0;
    const where = (i, j) => {
      const p = this.pos(fx, i, j);
      if (fu > 0 && inRight(i, j)) {
        const q = this.pos(fx, -1, N - 1 - i);
        // swing along an arc (pivot at the corner) so the arm visibly rotates up
        const piv = this.pos(fx, 0, N - 1), a0 = Math.atan2(p[1] - piv[1], p[0] - piv[0]), a1 = Math.atan2(q[1] - piv[1], q[0] - piv[0]);
        const r0 = dist(p, piv), r1 = dist(q, piv), a = a0 + (a1 - a0) * fu, rr = r0 + (r1 - r0) * fu;
        return [piv[0] + rr * Math.cos(a), piv[1] + rr * Math.sin(a)];
      }
      return p;
    };
    const cutU = fx.cut ? clamp((t - fx.cut.t - 0.45) / (fx.cut.dur || 0.5)) : 0;
    const inCut = (i, j) => fx.cut && i >= R - fx.cut.k && j < fx.cut.k;
    // band (yellow highlighter behind the outer layer)
    if (fx.band && t >= fx.band.t) {
      const u = EASE.out(clamp((t - fx.band.t) / 0.45)), w = g * 0.78;
      const a = this.pos(fx, 0, 0), b = this.pos(fx, 0, N - 1), c = this.pos(fx, R - 1, N - 1);
      stroke(k + '.bandT', [[a[0] - g * 0.3, a[1]], [b[0], b[1]]], { z: Z.hi, w, color: C.hi, draw: u, opacity: 0.85 * op, boil: 0.3 });
      stroke(k + '.bandR', [[b[0], b[1]], [c[0], c[1] + g * 0.3]], { z: Z.hi, w, color: C.hi, draw: clamp(u * 1.4 - 0.4), opacity: 0.85 * op, boil: 0.3 });
    }
    // dots
    for (let i = 0; i < R; i++) for (let j = 0; j < N; j++) {
      if (fx.hide && fx.hide(i, j)) continue;
      if (fx.ell !== undefined && (i === fx.ell || j === fx.ell)) continue;
      const appear = fx.t0 < 0 ? 1 : EASE.back(clamp((lt - (R > 1 ? i / (R - 1) : 0) * fx.pop * 0.6) / 0.22));
      if (appear <= 0) continue;
      let o = op, rr = fx.r * appear;
      if (inCut(i, j)) { o *= 1 - cutU; if (o <= 0.01) continue; }
      dot(`${k}.d${i}_${j}`, where(i, j), rr, fx.color || C.ink, Z.front);
      if (o < 1) { const it = DL.items[DL.items.length - 1]; if (it) it.attrs.opacity = +o.toFixed(3); }
    }
    // ellipsis glyphs in place of the elided row / column
    if (fx.ell !== undefined) {
      const ea = fx.t0 < 0 ? 1 : clamp((lt - 0.3) / 0.3);
      for (let j = 0; j < N; j++) if (j !== fx.ell) { const p = this.pos(fx, fx.ell, j); text(`${k}.ev${j}`, '⋮', p[0], p[1], { size: g * 0.9, z: Z.front, opacity: ea * op }); }
      for (let i = 0; i < R; i++) if (i !== fx.ell) { const p = this.pos(fx, i, fx.ell); text(`${k}.eh${i}`, '⋯', p[0], p[1], { size: g * 0.9, z: Z.front, opacity: ea * op }); }
      const p = this.pos(fx, fx.ell, fx.ell); text(`${k}.ec`, '⋱', p[0], p[1], { size: g * 0.9, z: Z.front, opacity: ea * op });
    }
    // cut: red ring around the bottom-left k x k block, then the block fades
    if (fx.cut && t >= fx.cut.t && cutU < 1) {
      const kk = fx.cut.k, a = this.pos(fx, R - kk, 0), b = this.pos(fx, R - 1, kk - 1);
      const ru = clamp((t - fx.cut.t) / 0.4), pad = g * 0.42;
      const pts = ringPts(k + '.cutR', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (b[0] - a[0]) / 2 + pad, (b[1] - a[1]) / 2 + pad, { n: 22 });
      stroke(k + '.cut', pts, { z: Z.annot, w: 5, color: C.red, draw: ru, opacity: (1 - cutU) * op });
    }
    // arms: solid outlines round the two arms, dashed circle round the corner dot
    if (fx.arms && t >= fx.arms.t) {
      const u = EASE.out(clamp((t - fx.arms.t) / 0.5)), pad = g * 0.36;
      const box = (key, i0, j0, i1, j1, draw) => {
        const a = where(i0, j0), b = where(i1, j1);
        const x0 = Math.min(a[0], b[0]) - pad, x1 = Math.max(a[0], b[0]) + pad, y0 = Math.min(a[1], b[1]) - pad, y1 = Math.max(a[1], b[1]) + pad;
        stroke(key, superPts((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0, 24, 6), { z: Z.annot, w: 4, color: C.red, closed: true, draw, opacity: op });
      };
      if (N > 1 && !(fx.pairs && t >= fx.pairs.t)) {
        if (fu < 1) box(k + '.armT', 0, 0, 0, N - 2, u);
        if (fu === 0) box(k + '.armR', 1, N - 1, R - 1, N - 1, clamp(u * 1.3 - 0.3));
        else if (fu >= 1) box(k + '.armRf', -1, 0, -1, N - 2, 1);
      }
      const c = where(0, N - 1), cr = g * 0.42;
      for (let s = 0; s < 8; s++) {
        const a0 = s * Math.PI / 4, a1 = a0 + Math.PI / 7;
        const arc = []; for (let q = 0; q <= 4; q++) { const a = a0 + (a1 - a0) * q / 4; arc.push([c[0] + cr * Math.cos(a), c[1] + cr * Math.sin(a)]); }
        stroke(`${k}.cd${s}`, arc, { z: Z.annot, w: 4, color: C.red, draw: clamp(u * 8 - s), opacity: op, boil: 0.2 });
      }
    }
    // pairs: after folding, a red oval round each column pair
    if (fx.pairs && t >= fx.pairs.t) {
      for (let j = 0; j < N - 1; j++) {
        const a = where(-1 + 0, j), b = where(0, j), u = clamp((t - fx.pairs.t - j * 0.08) / 0.3);
        const top = this.pos(fx, -1, j), bot = this.pos(fx, 0, j);
        const pts = ringPts(`${k}.pr${j}`, top[0], (top[1] + bot[1]) / 2, g * 0.36, g * 0.88, { n: 16 });
        stroke(`${k}.p${j}`, pts, { z: Z.annot, w: 4, color: C.red, draw: u, opacity: op });
      }
    }
    // named points
    const T = F.targets;
    T[k + '.corner'] = where(0, N - 1);
    const tm = this.pos(fx, 0, (N - 2) / 2); T[k + '.top'] = [tm[0], tm[1] - g * 0.9];
    const rm = this.pos(fx, R / 2, N - 1); T[k + '.right'] = [rm[0] + g * 0.9, rm[1]];
    const cm = this.pos(fx, (R - 1) / 2, (N - 1) / 2); T[k + '.center'] = cm;
    if (fx.cut) { const a = this.pos(fx, R - fx.cut.k, 0), b = this.pos(fx, R - 1, fx.cut.k - 1); T[k + '.bl'] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
    const br = this.pos(fx, R - 1, N - 1); T[k + '.size'] = [br[0] + g * 0.8, br[1] + g * 0.8];
  },
  cues: fx => {
    const c = []; if (fx.t0 >= 0) c.push([fx.t0, 'pop']);
    if (fx.cut) c.push([fx.cut.t, 'swish']);
    if (fx.band) c.push([fx.band.t, 'plip']);
    if (fx.fold) c.push([fx.fold.t, 'whoosh']);
    if (fx.pairs) c.push([fx.pairs.t, 'pen']);
    return c;
  },
};

/* ---------------------------------------------------------------------
   地图 n1_map（开场、结尾都用同一张）
   { type:'n1_map', id, t0, t1,
     doorL: [[t, on]], doorR: [[t, on]],   // 门亮起（on=1）/ 熄灭（0）
     steps: [[t, i]],                      // 第 i 级台阶（0..4）写出它的问题
     lit: [[t, i]],                        // 第 i 级台阶亮起（黄色）
     ticks: [[t, i]],                      // 第 i 级台阶左半边（奇数一侧）打勾
     qs: [[t, i]],                         // 第 i 级台阶右半边（偶数一侧）闪问号
     fog: true }                           // 远处的雾和看不清的路牌
   布局固定：左门中心 (300, 470)，右门中心 (1300, 470)，台阶从 (560, 700) 一级级往右上到 (1040, 300)。
   发布命名点：<id>.doorL、<id>.doorR、<id>.step0 … <id>.step4（每级台阶面的中心）。
   --------------------------------------------------------------------- */
const N1_STEP_TXT = ['有没有？', '怎么造？', '找得全吗？', '为什么不可能？', '有无穷多个吗？'];
COMP.n1_map = {
  draw(fx, t, F) {
    if (t < fx.t0) return;
    const out = fx.t1 !== undefined ? clamp((t - fx.t1) / 0.4) : 0; if (out >= 1) return;
    const k = fx.id, op = 1 - out, pin = fx.t0 < 0 ? 1 : EASE.out(clamp((t - fx.t0) / 0.7));
    const last = (arr, i) => { let v = null; for (const [tt, ii, val] of arr || []) if (t >= tt && (i === undefined || ii === i)) v = val === undefined ? tt : val; return v; };
    const has = (arr, i) => (arr || []).some(([tt, ii]) => t >= tt && ii === i);
    const since = (arr, i) => { const e = (arr || []).find(([tt, ii]) => ii === i); return e ? t - e[0] : -1; };
    // paper edge of the map
    stroke(k + '.frame', [[110, 120], [1490, 120, 1], [1490, 760, 1], [110, 760, 1], [110, 120, 1]], { z: Z.set, w: 4, draw: pin, opacity: op * 0.9 });
    // doors
    const door = (side, cx, on) => {
      const key = `${k}.${side}`, w = 190, h = 300, x0 = cx - w / 2, y0 = 470 - h / 2, y1 = 470 + h / 2;
      stroke(key + '.f', [[x0, y1], [x0, y0 + 40, 1], [cx, y0 - 10], [x0 + w, y0 + 40], [x0 + w, y1, 1]], { z: Z.board, w: 6, draw: pin, opacity: op });
      if (on > 0) stroke(key + '.glow', superPts(cx, 470 + 15, w - 26, h - 50, 24, 4), { z: Z.hi, w: 26, color: C.hi, closed: true, opacity: 0.7 * on * op });
      if (side === 'L') {   // factor door: a × on the frame, grid hatching inside
        text(key + '.sym', '×', cx, y0 + 50, { size: 64, z: Z.board + 1, opacity: pin * op });
        for (let q = 0; q < 4; q++) stroke(`${key}.h${q}`, [[x0 + 30 + q * 40, y0 + 95], [x0 + 30 + q * 40, y1 - 20]], { z: Z.board, w: 2.5, color: C.pencil, draw: pin, opacity: op });
        for (let q = 0; q < 4; q++) stroke(`${key}.v${q}`, [[x0 + 22, y0 + 110 + q * 44], [x0 + w - 22, y0 + 110 + q * 44]], { z: Z.board, w: 2.5, color: C.pencil, draw: pin, opacity: op });
      } else {              // remainder door: grouped dots with one left over
        for (let q = 0; q < 3; q++) { dot(`${key}.a${q}`, [x0 + 52 + q * 44, y0 + 50], 8, C.ink, Z.board + 1); dot(`${key}.b${q}`, [x0 + 52 + q * 44, y0 + 72], 8, C.ink, Z.board + 1); }
        dot(`${key}.c`, [x0 + 52 + 3 * 44, y0 + 61], 8, C.red, Z.board + 1);
        for (let q = 0; q < 5; q++) for (let p = 0; p < 4; p++) dot(`${key}.s${q}_${p}`, [x0 + 40 + p * 38, y0 + 120 + q * 34], 4, C.pencil, Z.board);
      }
      F.targets[`${k}.door${side}`] = [cx, 470];
    };
    // door keyframes: [t, on] (or [t, _, on]); the latest one at or before t wins
    const doorOn = arr => { let v = 0; for (const e of arr || []) if (t >= e[0]) v = e.length > 2 ? e[2] : e[1]; return clamp(+v || 0); };
    door('L', 300, doorOn(fx.doorL)); door('R', 1300, doorOn(fx.doorR));
    // five steps between the doors: one staircase outline; tread i spans x 520+112i .. 520+112(i+1) at y 700-92i
    const sx = i => 520 + i * 112, sy = i => 700 - i * 92;
    const outline = [[470, 700]]; for (let i = 0; i < 5; i++) { outline.push([sx(i + 1), sy(i), 1]); if (i < 4) outline.push([sx(i + 1), sy(i + 1), 1]); }
    outline.push([sx(5), 700, 1], [470, 700, 1]);
    stroke(k + '.stairs', outline, { z: Z.set + 1, w: 5, draw: pin, opacity: op, fill: '#F4EFE4' });
    for (let i = 0; i < 5; i++) {
      const x0 = sx(i), x1 = sx(i + 1), y = sy(i), key = `${k}.st${i}`;
      const c = [(x0 + x1) / 2, y - 6]; F.targets[`${k}.step${i}`] = c;
      if (has(fx.lit, i)) stroke(key + '.lit', [[x0 + 6, y - 8], [x1 - 6, y - 8]], { z: Z.hi, w: 16, color: C.hi, draw: clamp(since(fx.lit, i) / 0.4), opacity: 0.9 * op });
      if (has(fx.steps, i)) {
        const u = clamp(since(fx.steps, i) / 0.35);
        text(key + '.q', N1_STEP_TXT[i], x0 - 10, y - 30, { size: 36, z: Z.annot, color: C.red, anchor: 'end', opacity: u * op, halo: true });
      }
      if (has(fx.ticks, i)) {   // odd side: a big tick with 奇 under it, inside the stair body
        const u = clamp(since(fx.ticks, i) / 0.25) * op;
        text(key + '.tk', '✓', x0 + 24, y - 34, { size: 58, z: Z.annot, color: C.red, anchor: 'middle', opacity: u });
        text(key + '.tkl', '奇', x0 + 24, y + 40, { size: 36, z: Z.annot, color: C.red, anchor: 'middle', opacity: u });
      }
      if (has(fx.qs, i)) {      // even side: a pulsing ? with 偶 under it
        const u = clamp(since(fx.qs, i) / 0.25) * op, b = 1 + 0.12 * Math.sin(Math.max(0, since(fx.qs, i)) * 9);
        text(key + '.qq', '?', x0 + 96, y - 34, { size: 58 * b, z: Z.annot, color: C.red, anchor: 'middle', opacity: u });
        text(key + '.qql', '偶', x0 + 96, y + 40, { size: 36, z: Z.annot, color: C.red, anchor: 'middle', opacity: u });
      }
    }
    // fog with blurry signposts
    if (fx.fog !== false) {
      const fu = pin * op;
      for (let q = 0; q < 3; q++) {
        const cx = 1150 + q * 95, cy = 175 + (q % 2) * 40;
        stroke(`${k}.sp${q}`, [[cx, cy + 70], [cx, cy - 10]], { z: Z.set, w: 4, color: C.pencil, opacity: fu * 0.8 });
        stroke(`${k}.sb${q}`, [[cx - 38, cy - 34], [cx + 38, cy - 34, 1], [cx + 38, cy - 4, 1], [cx - 38, cy - 4, 1], [cx - 38, cy - 34, 1]], { z: Z.set, w: 3, color: C.pencil, opacity: fu * 0.8 });
      }
      for (let q = 0; q < 6; q++) {   // fog puffs, kept inside the map frame (x < 1490, y > 120)
        const cx = 960 + q * 80, cy = 172 + (q % 3) * 28;
        stroke(`${k}.fog${q}`, ringPts(`${k}.fg${q}`, cx, cy, 86, 32, { n: 14 }), { z: Z.set + 2, w: 18, color: '#EFEAE0', closed: true, fill: '#EFEAE0', opacity: 0.92 * fu, boil: 0.5 });
      }
    }
  },
  cues: fx => [...(fx.t0 >= 0 ? [[fx.t0, 'paper']] : []), ...(fx.steps || []).map(([tt]) => [tt, 'plip']), ...(fx.ticks || []).map(([tt]) => [tt, 'pen'])],
};

/* 范围卡片：白卡片 + 图钉；lines = ['两个数都是 0 或正整数', …]；nl: 时间（局部，-1 = 一开始就有）画出一小段数轴 0 1 2 3 …；
   neg: 时间，数轴 0 的左边贴"负数：以后"小便签。局部原点 = 卡片中心；w、h 可调。 */
PROPS.n1_card = (fx, t, lt, p) => {
  const k = fx.id, w = fx.w || 560, h = fx.h || (fx.nl !== undefined ? 300 : 200), z = Z.annot - 1;
  stroke(k + '.c', [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z, w: 3.5, fill: '#FFFFFF', draw: p });
  dot(k + '.pin', [0, -h / 2 + 14], 11, C.red, z + 0.5);
  const L = fx.lines || [];
  L.forEach((s, i) => text(`${k}.l${i}`, s, -w / 2 + 28, -h / 2 + 62 + i * 50, { size: fx.size || 36, font: CFG.FONT_MIX, z: z + 0.3, anchor: 'start', opacity: clamp(p * 3 - 1 - i * 0.3) }));
  if (fx.nl !== undefined && lt >= fx.nl) {
    const u = EASE.out(clamp((lt - fx.nl) / 0.5)), y = h / 2 - 58, x0 = -w / 2 + 90, dx = 90;
    stroke(k + '.ax', [[x0 - 30, y], [x0 + dx * 4 + 10, y]], { z: z + 0.3, w: 3.5, draw: u });
    ['0', '1', '2', '3'].forEach((s, i) => { stroke(`${k}.tk${i}`, [[x0 + i * dx, y - 10], [x0 + i * dx, y + 10]], { z: z + 0.3, w: 3, draw: u }); text(`${k}.n${i}`, s, x0 + i * dx, y + 34, { size: 36, font: CFG.FONT_MIX, z: z + 0.3, anchor: 'middle', opacity: u }); });
    text(k + '.dots', '……', x0 + dx * 4 + 40, y + 2, { size: 34, z: z + 0.3, anchor: 'start', opacity: u });
  }
  if (fx.neg !== undefined && lt >= fx.neg) {
    const u = EASE.back(clamp((lt - fx.neg) / 0.3)), y = h / 2 - 58, x = -w / 2 + 20;
    stroke(k + '.ng', [[x - 70, y - 28], [x + 30, y - 28, 1], [x + 30, y + 24, 1], [x - 70, y + 24, 1], [x - 70, y - 28, 1]], { z: z + 0.6, w: 3, fill: '#FFF6B8', draw: u });
    text(k + '.ngt', '负数：以后', x - 20, y - 2, { size: 30, z: z + 0.7, anchor: 'middle', color: C.red, opacity: u });
  }
};

/* Jasper 的记号 ┐：一横一竖，红笔写；size = 横的长度（默认 46） */
PROPS.n1_mark = (fx, t, lt, p) => {
  const s = fx.size || 46, k = fx.id;
  stroke(k + '.m', [[-s / 2, -s / 2], [s / 2, -s / 2, 1], [s / 2, s / 2]], { z: Z.annot, w: fx.w || 6, color: fx.color || C.red, draw: p });
};

/* 木牌：text（一行）、w；局部原点 = 牌子中心，杆子往下 140 */
PROPS.n1_sign = (fx, t, lt, p) => {
  const k = fx.id, w = fx.w || 360, h = 96;
  stroke(k + '.pole', [[0, h / 2], [0, h / 2 + 140]], { z: Z.front, w: 7, draw: p });
  stroke(k + '.b', [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z: Z.front, w: 5, fill: '#F3E3C3', draw: p });
  text(k + '.t', fx.text || '', 0, 2, { size: fx.size || 46, z: Z.front + 0.2, anchor: 'middle', opacity: clamp(p * 2 - 0.8) });
};

/** 让 inner（另一个 fx）在 [f0, f0 + fd] 里淡出，而不是一帧消失（title、scribe 等没有 t1 的组件用） */
COMP.n1_fade = {
  init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); },
  draw(fx, t, F) {
    const k = 1 - clamp((t - fx.f0) / (fx.fd || 0.4)); if (k <= 0) return;
    const n0 = DL.items.length;
    COMP[fx.inner.type].draw(fx.inner, t, F);
    if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); }
  },
  cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
};
