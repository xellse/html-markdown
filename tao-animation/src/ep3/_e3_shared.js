// 第 3 集共用：角色造型、灵光一闪的灯泡、骨牌棋盘。下划线开头，总会排在最前面被构建带上。
/* ---------------- cast (10 岁的小陶；和第 2 集的 9 岁衔接：略高一点，头略小一点) ---------------- */
const E3 = {
  terry: { H: 262, head: 0.425, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  // 长大以后的陶哲轩（和第 2 集第 40 场的大人造型一致：那撮头发不变）
  taoAdult: { H: 400, head: 0.37, torso: 0.24, leg: 0.32, arm: 0.36, hair: 'tuft', blink: [3.9, 1.6] },
  // 埃尔德什：瘦高、戴眼镜、地中海加侧发
  erdos: { H: 430, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'sides', glasses: true, blink: [4.1, 1.7] },
  STAMP: { center: [800, 360], R: 150, dock: [1486, 108], dockScale: 0.46 },
};

/* ---------------- 灵光一闪：头顶的灯泡 ----------------
 * { type: 'e3_bulb', id, char: 'terry' (跟着头顶) | at: [x, y] (灯泡底座的位置), dx, dy, size: 90, t0, t1,
 *   state: [[t, 'on'|'off'|'flicker'|'dead']] }
 * on = 亮（黄色 + 光芒，"叮"）；off = 不亮；flicker = 一闪一闪（快没电了）；dead = 灯丝断了、歪着。
 * 每次切到 'on' 都会响一声 ding。发布命名点 '<id>.bulb'（灯泡中心）。 */
COMP.e3_bulb = {
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const lt = t - fx.t0, s = fx.size || 90, k = fx.id;
    let base;
    if (fx.char) { const a = F.anchors[fx.char]; if (!a) return; base = [a.headTop[0] + (fx.dx || 0), a.headTop[1] - 26 + (fx.dy || 0)]; }
    else base = fx.at;
    const st = stepTrack(fx.state, t) || 'off';
    let sT = fx.t0; (fx.state || []).forEach(q => { if (q[0] <= t) sT = q[0]; });
    let lit = st === 'on';
    if (st === 'flicker') lit = rnd(k, Math.floor(t * 13), 3) > 0.15;
    const pop = fx.t0 < 0 ? 1 : EASE.back(clamp(lt / 0.26));
    const flash = st === 'on' ? 1 + 0.18 * Math.max(0, 1 - (t - sT) / 0.25) : 1;
    const tiltDead = st === 'dead' ? 14 * EASE.back(clamp((t - sT) / 0.35)) : 0;
    DL.save(); DL.translate(base[0], base[1]); DL.scale(pop * flash); DL.rotate(tiltDead);
    const z = fx.z ?? Z.fx, cy = -s * 0.62, R = s * 0.4;
    if (lit) stroke(k + '.glow', ringPts(k + '.g', 0, cy, R * 0.98, R * 1.02, { n: 12, closed: true }), { z: z - 0.2, closed: true, fill: C.hi, noStroke: true, opacity: 0.9, blend: true, w: 1 });
    stroke(k + '.glass', ringPts(k, 0, cy, R, R * 1.04, { n: 14, a0: 125, sweep: 290 }).concat([[s * 0.17, -s * 0.2], [-s * 0.17, -s * 0.2]]), { z, w: 4.5, closed: true, fill: lit ? 'none' : C.paper });
    [-0.2, -0.1, 0].forEach((y, i) => stroke(k + '.neck' + i, [[-s * 0.17, y * s], [s * 0.17, y * s + 1]], { z, w: 4 }));
    stroke(k + '.tip', [[-s * 0.07, s * 0.02], [0, s * 0.07], [s * 0.07, s * 0.02]], { z, w: 4 });
    // filament: a little zigzag (droops when dead)
    const fy = cy + R * 0.25, droop = st === 'dead' ? R * 0.35 : 0;
    stroke(k + '.fil', [[-s * 0.1, -s * 0.22], [-s * 0.12, fy], [-s * 0.05, fy - s * 0.1 + droop], [s * 0.02, fy + droop * 0.6], [s * 0.08, fy - s * 0.1], [s * 0.12, fy], [s * 0.1, -s * 0.22]],
      { z: z + 0.1, w: 2.6, color: lit ? C.ink : C.pencil });
    if (lit) {
      for (let i = 0; i < 7; i++) {
        const a = (-160 + i * 23.3) * RAD, L = s * (0.2 + 0.05 * Math.sin(t * 9 + i * 1.7));
        const r0 = R * 1.3;
        stroke(k + '.ray' + i, [[Math.cos(a) * r0, cy + Math.sin(a) * r0], [Math.cos(a) * (r0 + L), cy + Math.sin(a) * (r0 + L)]], { z, w: 4, draw: EASE.out(clamp((t - sT) / 0.15)) });
      }
    }
    DL.restore();
    F.targets[k + '.bulb'] = [base[0], base[1] + cy * pop];
  },
  cues: fx => {
    const c = [[fx.t0, 'pop']]; let prev = null;
    (fx.state || []).forEach(([t, v]) => { if (v === 'on' && prev !== 'on') c.push([t, 'ding']); if (v === 'dead' && prev !== 'dead') c.push([t, 'thud']); prev = v; });
    return c;
  },
};

/* ---------------- 骨牌棋盘 ----------------
 * { type: 'e3_board', id, at: [cx, cy] | pos: 轨道, scale: 数 | 轨道, n: 4, cell: 96, t0, drawDur: 0.5,
 *   cut: t | null            剪掉两个对角（(0,0) 和 (n-1,n-1)）的时间；t0 之前就剪好写负数；null = 完整棋盘
 *   color: t | null          开始涂黑白的时间（黑格 = (r+c) 为偶数，所以被剪掉的两个角都是黑的）
 *   colorDur: 1.2            把所有黑格涂完用的时间
 *   attempts: [{ t0, step: 0.32, dom: [[r, c, 'h'|'v'], …], fail: t, t1 }]
 *       一次"摆骨牌"：从 t0 起每隔 step 秒放一块；fail 时把没盖住的格子用红圈圈出来；t1 时整组撤掉（不写 = 一直留着）
 *       t0 为负数 = 切进来时已经摆好。
 *   rings: [{ cells: [[r,c],…], t0, t1 }]   额外的红圈（例如只圈某一块骨牌的两格）
 *   hideLeft: true           不自动圈出剩下的格子
 * }
 * 发布命名点：'<id>.c<r>_<c>'（每个格子的中心，世界坐标）、'<id>.center'、'<id>.top'、'<id>.bottom'。 */
const E3B = {
  black: (r, c) => (r + c) % 2 === 0,
  cells(n, cut) { const out = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!(cut && ((r === 0 && c === 0) || (r === n - 1 && c === n - 1)))) out.push([r, c]); return out; },
  domCells: ([r, c, d]) => d === 'h' ? [[r, c], [r, c + 1]] : [[r, c], [r + 1, c]],
};
COMP.e3_board = {
  init(fx) {
    fx.n = fx.n || 4; fx.cell = fx.cell || 96;
    // sanity: every attempt's dominoes must sit on the cut board, without overlaps
    (fx.attempts || []).forEach((a, ai) => {
      const seen = new Set();
      a.dom.forEach(d => E3B.domCells(d).forEach(([r, c]) => {
        const key = r + '_' + c, cutCell = fx.cut !== null && fx.cut !== undefined && ((r === 0 && c === 0) || (r === fx.n - 1 && c === fx.n - 1));
        if (r < 0 || c < 0 || r >= fx.n || c >= fx.n || cutCell || seen.has(key)) console.error('e3_board: bad domino in attempt', ai, d);
        seen.add(key);
      }));
    });
    return fx;
  },
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const lt = t - fx.t0, n = fx.n, s = fx.cell, k = fx.id;
    const pos = fx.pos ? evalTrack(fx.pos, t) : fx.at;
    const sc = typeof fx.scale === 'number' ? fx.scale : (fx.scale ? evalTrack(fx.scale, t) : 1);
    const p = fx.t0 < 0 ? 1 : EASE.out(clamp(lt / (fx.drawDur ?? 0.5)));
    const x0 = -n * s / 2, y0 = -n * s / 2;
    const W = (r, c) => [pos[0] + sc * (x0 + (c + 0.5) * s), pos[1] + sc * (y0 + (r + 0.5) * s)];
    const cutOn = fx.cut !== null && fx.cut !== undefined;
    const cutDone = cutOn && t >= fx.cut + 0.55;
    const isCut = (r, c) => (r === 0 && c === 0) || (r === n - 1 && c === n - 1);
    const present = (r, c) => r >= 0 && c >= 0 && r < n && c < n && !(cutDone && isCut(r, c));
    DL.save(); DL.translate(pos[0], pos[1]); if (sc !== 1) DL.scale(sc);
    const z = fx.z ?? Z.set + 2, lw = 1 / Math.sqrt(Math.max(0.15, sc)), wOut = (fx.w || 6) * lw, wIn = wOut * 0.5; // thin boards keep readable lines
    // grid edges: every unique edge once; outer edges thick
    const edges = [];
    for (let r = 0; r <= n; r++) for (let c = 0; c < n; c++) { const a = present(r - 1, c), b = present(r, c); if (a || b) edges.push({ key: `h${r}_${c}`, pts: [[x0 + c * s, y0 + r * s], [x0 + (c + 1) * s, y0 + r * s]], outer: a !== b }); }
    for (let c = 0; c <= n; c++) for (let r = 0; r < n; r++) { const a = present(r, c - 1), b = present(r, c); if (a || b) edges.push({ key: `v${c}_${r}`, pts: [[x0 + c * s, y0 + r * s], [x0 + c * s, y0 + (r + 1) * s]], outer: a !== b }); }
    edges.forEach((e, i) => stroke(k + '.' + e.key, e.pts, { z: z + (e.outer ? 0.3 : 0.2), w: e.outer ? wOut : wIn, draw: clamp(p * 1.6 - (i / edges.length) * 0.6), bow: 0.3 }));
    // the two corners being cut away: red dashed outline, then the square falls off
    if (cutOn && fx.cut >= 0 && t >= fx.cut && t < fx.cut + 1.3) { // a negative cut = already cut when the scene opens
      [[0, 0], [n - 1, n - 1]].forEach(([r, c], i) => {
        const u = clamp((t - fx.cut - 0.55) / 0.7), fall = EASE.in(u);
        const cx = x0 + (c + 0.5) * s + (i ? 1 : -1) * fall * 60, cy = y0 + (r + 0.5) * s + fall * 260;
        const h = s / 2, rot = (i ? 1 : -1) * 40 * fall, op = 1 - u;
        DL.save(); DL.translate(cx, cy); DL.rotate(rot);
        stroke(k + '.cut' + i, [[-h, -h], [h, -h, 1], [h, h, 1], [-h, h, 1], [-h, -h, 1]], { z: z + 0.5, w: 4.5, color: C.red, draw: EASE.out(clamp((t - fx.cut) / 0.4)), opacity: op, fill: u > 0 ? C.paper : 'none' });
        if (E3B.black(r, c) && fx.color !== undefined && fx.color !== null && t >= fx.color) hatch(k + '.cuth' + i, -h, -h, s, z + 0.4, 1, op, lw);
        DL.restore();
      });
    }
    // black squares: hand hatching, cell by cell
    if (fx.color !== undefined && fx.color !== null && t >= fx.color) {
      const blacks = E3B.cells(n, cutDone).filter(([r, c]) => E3B.black(r, c));
      blacks.forEach(([r, c], i) => {
        const u = fx.color < 0 && fx.t0 < 0 ? 1 : clamp((t - fx.color - i * (fx.colorDur ?? 1.2) / blacks.length) / 0.22);
        if (u > 0) hatch(k + '.b' + r + '_' + c, x0 + c * s, y0 + r * s, s, z + 0.1, u, 1, lw);
      });
    }
    // dominoes
    const doms = [];
    (fx.attempts || []).forEach((a, ai) => {
      if (t < a.t0 || (a.t1 !== undefined && t >= a.t1 + 0.3)) return;
      const out = a.t1 !== undefined ? clamp((t - a.t1) / 0.3) : 0;
      a.dom.forEach((d, di) => {
        const td = a.t0 + di * (a.step ?? 0.32); if (t < td) return;
        const u = a.t0 < 0 ? 1 : EASE.back(clamp((t - td) / 0.16));
        doms.push({ d, key: `${k}.a${ai}d${di}`, u, out });
      });
      const covered = new Set(a.dom.flatMap(d => E3B.domCells(d).map(([r, c]) => r + '_' + c)));
      const failT = a.fail ?? (a.t0 + a.dom.length * (a.step ?? 0.32) + 0.25);
      if (!fx.hideLeft && t >= failT && out < 1) {
        E3B.cells(n, true).filter(([r, c]) => !covered.has(r + '_' + c)).forEach(([r, c], j) => {
          const cx = x0 + (c + 0.5) * s, cy = y0 + (r + 0.5) * s, q = clamp((t - failT - j * 0.12) / 0.25);
          if (q > 0) stroke(`${k}.a${ai}L${j}`, ringPts(`${k}.a${ai}L${j}`, cx, cy, s * 0.4, s * 0.4, { n: 10, a0: -100, sweep: 380, rv: 0.06 }), { z: z + 2, w: wOut * 0.9, color: C.red, draw: EASE.out(q), opacity: 1 - out });
        });
      }
    });
    doms.forEach(({ d, key, u, out }) => {
      const [[r1, c1], [r2, c2]] = E3B.domCells(d);
      const cx = x0 + ((c1 + c2) / 2 + 0.5) * s, cy = y0 + ((r1 + r2) / 2 + 0.5) * s;
      const hw = (d[2] === 'h' ? s : s / 2) - s * 0.1, hh = (d[2] === 'h' ? s / 2 : s) - s * 0.1;
      DL.save(); DL.translate(cx, cy - out * 30); DL.scale(lerp(0.6, 1, u));
      stroke(key, superPts(0, 0, hw * 2, hh * 2, 20, 6), { z: z + 1, w: wOut * 0.95, closed: true, fill: 'none', opacity: 1 - out });
      const tk = d[2] === 'h' ? [[0, -hh * 0.45], [0, hh * 0.45]] : [[-hw * 0.45, 0], [hw * 0.45, 0]];
      stroke(key + '.m', tk, { z: z + 1, w: wIn, opacity: 1 - out });
      DL.restore();
    });
    // extra red rings (e.g. the two squares under one domino)
    (fx.rings || []).forEach((g, gi) => {
      if (t < g.t0 || (g.t1 !== undefined && t >= g.t1)) return;
      g.cells.forEach(([r, c], j) => {
        const cx = x0 + (c + 0.5) * s, cy = y0 + (r + 0.5) * s;
        stroke(`${k}.R${gi}_${j}`, ringPts(`${k}.R${gi}_${j}`, cx, cy, s * 0.42, s * 0.42, { n: 10, a0: -100, sweep: 380, rv: 0.06 }), { z: z + 2, w: wOut * 0.9, color: C.red, draw: EASE.out(clamp((t - g.t0 - j * 0.12) / 0.25)) });
      });
    });
    DL.restore();
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) F.targets[`${k}.c${r}_${c}`] = W(r, c);
    F.targets[k + '.center'] = pos;
    F.targets[k + '.top'] = [pos[0], pos[1] + sc * y0];
    F.targets[k + '.bottom'] = [pos[0], pos[1] - sc * y0];
  },
  cues: fx => {
    const c = [];
    if (fx.t0 >= 0) c.push([fx.t0, 'pen']);
    if (fx.cut !== null && fx.cut !== undefined && fx.cut >= 0) c.push([fx.cut, 'zip'], [fx.cut + 0.6, 'whoosh']);
    if (fx.color !== null && fx.color !== undefined && fx.color >= 0) c.push([fx.color, 'swish'], [fx.color + 0.6, 'swish']);
    (fx.attempts || []).forEach(a => {
      if (a.t0 < 0) return;
      a.dom.forEach((d, di) => c.push([a.t0 + di * (a.step ?? 0.32), 'tap']));
      if (!fx.hideLeft) c.push([a.fail ?? (a.t0 + a.dom.length * (a.step ?? 0.32) + 0.25), 'buzz']);
    });
    return c;
  },
};
/** Pencil-ink hatching inside one square (local coords): diagonal lines, drawn in with u (0..1). */
function hatch(key, x, y, s, z, u, op, lw = 1) {
  const m = 7;
  for (let i = 1; i < m * 2; i++) {
    const d = (i / (m * 2)) * 2 * s, a = d <= s ? [x + d, y] : [x + s, y + d - s], b = d <= s ? [x, y + d] : [x + d - s, y + s];
    const inset = s * 0.06, A = [lerp(a[0], b[0], inset / s), lerp(a[1], b[1], inset / s)], B = [lerp(b[0], a[0], inset / s), lerp(b[1], a[1], inset / s)];
    stroke(key + '.' + i, [A, B], { z, w: 2.6 * lw, opacity: 0.8 * op, draw: clamp(u * 2 - (i / (m * 2))), boil: 0.6 });
  }
}

/* 九次失败的摆法（都是 6 块骨牌，剩下两个白格；用脚本枚举过 154 种摆法挑出来的）。
 * TRIES[0] 是"一行一行摆"的第一次；TRIES[8] 是第九次，也是第 55 场开场时棋盘上的那一次。 */
E3B.TRIES = [
  [[0, 1, 'h'], [1, 0, 'h'], [1, 2, 'h'], [2, 0, 'h'], [2, 2, 'h'], [3, 0, 'h']],   // 剩 (0,3) (3,2)
  [[0, 1, 'h'], [0, 3, 'v'], [1, 1, 'h'], [2, 0, 'h'], [2, 2, 'v'], [3, 0, 'h']],   // 剩 (1,0) (2,3)
  [[0, 2, 'h'], [1, 0, 'h'], [1, 2, 'v'], [1, 3, 'v'], [2, 0, 'h'], [3, 1, 'h']],   // 剩 (0,1) (3,0)
  [[0, 1, 'h'], [0, 3, 'v'], [1, 0, 'h'], [2, 0, 'v'], [2, 2, 'h'], [3, 1, 'h']],   // 剩 (1,2) (2,1)
  [[0, 1, 'h'], [1, 0, 'h'], [1, 2, 'v'], [1, 3, 'v'], [2, 0, 'v'], [3, 1, 'h']],   // 剩 (0,3) (2,1)
  [[0, 1, 'h'], [0, 3, 'v'], [1, 1, 'h'], [2, 0, 'v'], [2, 1, 'v'], [2, 2, 'h']],   // 剩 (1,0) (3,2)
  [[0, 2, 'h'], [1, 0, 'h'], [1, 2, 'h'], [2, 0, 'v'], [2, 1, 'v'], [2, 2, 'v']],   // 剩 (0,1) (2,3)
  [[0, 1, 'h'], [0, 3, 'v'], [1, 0, 'v'], [1, 1, 'h'], [2, 1, 'v'], [2, 2, 'h']],   // 剩 (3,0) (3,2)
  [[0, 1, 'h'], [0, 3, 'v'], [1, 0, 'h'], [1, 2, 'v'], [2, 0, 'h'], [3, 0, 'h']],   // 剩 (2,3) (3,2)
];
/** 主棋盘的统一位置（第 40、45、50、55 场衔接用） */
E3B.MAIN = { at: [600, 420], cell: 100 };

/** 一张横线纸（和第 2 集的 e2_page 一样），中心在道具位置。fx: {w, h, lines, title} */
PROPS.e3_page = (fx, t, lt, p) => {
  const W = fx.w || 520, H = fx.h || 520, z = fx.z ?? Z.set, k = fx.id;
  stroke(k + '.sheet', [[-W / 2, -H / 2], [W / 2, -H / 2 + 4, 1], [W / 2 - 3, H / 2, 1], [-W / 2 + 4, H / 2 - 3, 1], [-W / 2, -H / 2, 1]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
  stroke(k + '.shade', [[-W / 2 + 12, H / 2 + 8], [W / 2 + 7, H / 2 + 6, 1], [W / 2 + 7, -H / 2 + 12]], { z: z - 0.5, w: 2.4, color: C.pencil, opacity: 0.6 * p, boil: 0.5 });
  const n = fx.lines ?? 5, top = -H / 2 + (fx.title ? 110 : 70);
  for (let i = 0; i < n; i++) {
    const y = top + i * ((H / 2 - 40 - top) / Math.max(1, n - 1));
    stroke(k + '.l' + i, [[-W / 2 + 26, y], [W / 2 - 26, y + 1]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.5, draw: stag(p, 1, 3), boil: 0.4 });
  }
  stroke(k + '.m', [[-W / 2 + 60, -H / 2 + 14], [-W / 2 + 60, H / 2 - 14]], { z: z + 0.1, w: 2, color: C.red, opacity: 0.45, draw: stag(p, 2, 3), boil: 0.4 });
  if (fx.title) text(k + '.t', fx.title, 0, -H / 2 + 52, { size: 40, z: z + 0.2, opacity: clamp((lt - 0.3) / 0.2) });
};
