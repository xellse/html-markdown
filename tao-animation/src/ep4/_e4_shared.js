// 第 4 集共用：角色造型、灯泡、横线纸、成绩单、奖牌。下划线开头，总会排在最前面被构建带上。
/* ---------------- cast ---------------- */
const E4 = {
  // 10 岁的小陶（1986 年 7 月考 IMO 时 10 岁，一周后满 11 岁）：和第 3 集同一个造型
  terry: { H: 262, head: 0.425, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  // 澳大利亚队的大哥哥们（十六七岁的高中生）：比小陶高一大截，各有一个特征
  mate1: { H: 400, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'messy', blink: [3.9, 0.3] },
  mate2: { H: 410, head: 0.35, torso: 0.25, leg: 0.34, arm: 0.36, hair: 'part', glasses: true, blink: [4.3, 1.1] },
  mate3: { H: 395, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'curly', blink: [3.6, 2.0] },
  mate4: { H: 398, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'ponytail', blink: [4.0, 2.6] },   // 队里唯一的大姐姐
  mate5: { H: 405, head: 0.355, torso: 0.25, leg: 0.335, arm: 0.36, hair: 'bob', blink: [3.7, 0.7] },   // 齐耳的“锅盖头”
  // 阅卷老师（IMO 的“协调员”）：戴眼镜、打领带
  grader: { H: 420, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'sides', glasses: true, tie: true, blink: [4.1, 1.7] },
  // 长大以后的陶哲轩（和第 3 集一致）
  taoAdult: { H: 400, head: 0.37, torso: 0.24, leg: 0.32, arm: 0.36, hair: 'tuft', blink: [3.9, 1.6] },
  STAMP: { center: [800, 360], R: 150, dock: [1486, 108], dockScale: 0.46 },
};

/* ---------------- 灵光一闪：头顶的灯泡 ----------------
 * { type: 'e4_bulb', id, char: 'terry' (跟着头顶) | at: [x, y] (灯泡底座的位置), dx, dy, size: 90, t0, t1,
 *   state: [[t, 'on'|'off'|'flicker'|'dead']] }
 * on = 亮（黄色 + 光芒，"叮"）；off = 不亮；flicker = 一闪一闪（快没电了）；dead = 灯丝断了、歪着。
 * 每次切到 'on' 都会响一声 ding。发布命名点 '<id>.bulb'（灯泡中心）。 */
COMP.e4_bulb = {
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const lt = t - fx.t0, s = fx.size || 90, k = fx.id;
    let base;
    if (fx.char) { const a = F.anchors[fx.char]; if (!a) return; base = [a.headTop[0] + (fx.dx || 0), a.headTop[1] - 26 + (fx.dy || 0)]; }
    else base = fx.at;
    const st = stepTrack(fx.state, t) || 'off';
    let sT = fx.t0; (fx.state || []).forEach(q => { if (q[0] <= t) sT = q[0]; });
    let lit = st === 'on';
    const sputter = st === 'flicker' && rnd(hstr(k), Math.floor(t * 11), 3) > 0.35; // mostly dark, with short weak sputters
    const pop = fx.t0 < 0 ? 1 : EASE.back(clamp(lt / 0.26));
    const flash = st === 'on' ? 1 + 0.18 * Math.max(0, 1 - (t - sT) / 0.25) : 1;
    const tiltDead = st === 'dead' ? 14 * EASE.back(clamp((t - sT) / 0.35)) : 0;
    DL.save(); DL.translate(base[0], base[1]); DL.scale(pop * flash); DL.rotate(tiltDead);
    const z = fx.z ?? Z.fx, cy = -s * 0.62, R = s * 0.4;
    if (lit || sputter) stroke(k + '.glow', ringPts(k + '.g', 0, cy, R * 0.98, R * 1.02, { n: 12, closed: true }), { z: z - 0.2, closed: true, fill: C.hi, noStroke: true, opacity: lit ? 0.9 : 0.4, blend: true, w: 1 });
    stroke(k + '.glass', ringPts(k, 0, cy, R, R * 1.04, { n: 14, a0: 125, sweep: 290 }).concat([[s * 0.17, -s * 0.2], [-s * 0.17, -s * 0.2]]), { z, w: 4.5, closed: true, fill: lit || sputter ? 'none' : C.paper });
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

/** 一张横线纸（和第 2 集的 e2_page 一样），中心在道具位置。fx: {w, h, lines, title} */
PROPS.e4_page = (fx, t, lt, p) => {
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

/* ---------------- 成绩单：六道题的得分 ----------------
 * { type: 'e4_scores', id, at: [cx, cy], scale: 1, t0, t1, cell: 118,
 *   scores: [[分, 写出时间], …6 个]（写出时间为负 = 一开始就写好；null = 还没写）,
 *   total: [总分, 写出时间]（可选）, ringT: [[题号 0-5, t, t1?], …]（红圈圈出某一格，t1 时消失；可选）,
 *   braces: [{ from: 0, to: 2, label: '17', t0, t1 }]（格子下面的红色大括号 + 红色手写数字；t0 为负 = 一开始就在，t1 时 0.25 秒淡出）}
 * 一道题满分 7 分。分数用手写字形一笔笔写进格子；第 3、4 题之间的粗线分开“第一天 / 第二天”。
 * 发布命名点：'<id>.s<i>'（第 i 格中心，i 从 0 起）、'<id>.total'、'<id>.top'。 */
COMP.e4_scores = {
  init(fx) {
    const c = fx.cell || 118, n = 6, gap = 26;
    fx._W = n * c + gap;   // the six boxes stay centred on `at`; a total is drawn to their right
    fx._x0 = -fx._W / 2;
    fx._bx = i => fx._x0 + i * c + (i >= 3 ? gap : 0);
    fx._writes = (fx.scores || []).map((e, i) => !e || e[0] === null ? null : COMP.write.init({ id: fx.id + '.w' + i, text: String(e[0]), x: 0, y: 0, size: c * 0.62, t0: e[1], speed: 1500, w: 6.5, anchor: 'middle' }));
    fx._br = (fx.braces || []).map((b, j) => ({ ...b, w: COMP.write.init({ id: fx.id + '.bw' + j, text: b.label, x: 0, y: 0, size: c * 0.6, t0: b.t0 < 0 ? -9 : b.t0 + 0.3, t1: b.t1, speed: 1500, w: 6, color: 'red', anchor: 'middle', z: Z.annot }) }));
    if (fx.total) fx._tw = COMP.write.init({ id: fx.id + '.wt', text: '= ' + fx.total[0], x: 0, y: 0, size: c * 0.62, t0: fx.total[1], speed: 1500, w: 6.5 });
    return fx;
  },
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const c = fx.cell || 118, k = fx.id, lt = t - fx.t0, p = fx.t0 < 0 ? 1 : EASE.out(clamp(lt / 0.45));
    const sc = fx.scale || 1, [cx, cy] = fx.at, z = fx.z ?? Z.set + 2;
    DL.save(); DL.translate(cx, cy); if (sc !== 1) DL.scale(sc);
    for (let i = 0; i < 6; i++) {
      const x = fx._bx(i);
      stroke(k + '.b' + i, [[x, -c / 2], [x + c, -c / 2, 1], [x + c, c / 2, 1], [x, c / 2, 1], [x, -c / 2, 1]], { z, w: 5, fill: C.paper, draw: clamp(p * 1.4 - i * 0.07) });
      text(k + '.n' + i, String(i + 1), x + c / 2, -c / 2 - 34, { size: 40, font: CFG.FONT_MIX, color: C.pencil, z, opacity: clamp(lt / 0.3) });
    }
    text(k + '.d1', '第一天', fx._bx(1) + c / 2, c / 2 + 42, { size: 36, color: C.pencil, z, opacity: clamp(lt / 0.3) });
    text(k + '.d2', '第二天', fx._bx(4) + c / 2, c / 2 + 42, { size: 36, color: C.pencil, z, opacity: clamp(lt / 0.3) });
    (fx._writes || []).forEach((w, i) => {
      if (!w) return;
      DL.save(); DL.translate(fx._bx(i) + c / 2, -c * 0.31); COMP.write.draw(w, t, F); DL.restore();
    });
    if (fx._tw) { DL.save(); DL.translate(fx._bx(5) + c + 34, -c * 0.31); COMP.write.draw(fx._tw, t, F); DL.restore(); }
    (fx._br || []).forEach((b, j) => {
      if (t < b.t0 || (b.t1 !== undefined && t >= b.t1 + 0.25)) return;
      const op = b.t1 !== undefined ? 1 - clamp((t - b.t1) / 0.25) : 1, xa = fx._bx(b.from) + 8, xb = fx._bx(b.to) + c - 8, y = c / 2 + 74, mid = (xa + xb) / 2;
      stroke(k + '.br' + j, [[xa, y - 14], [xa + 10, y], [mid - 12, y], [mid, y + 16], [mid + 12, y], [xb - 10, y], [xb, y - 14]], { z: Z.annot, w: 5, color: C.red, opacity: op, draw: b.t0 < 0 ? 1 : EASE.out(clamp((t - b.t0) / 0.35)) });
      if (op > 0.02) { DL.save(); DL.translate(mid, y + 22); if (op < 1) DL.scale(1); COMP.write.draw(b.w, t, F); DL.restore(); }
    });
    (fx.ringT || []).forEach(([i, rt, rt1], j) => {
      if (t < rt || (rt1 !== undefined && t >= rt1)) return;
      const x = fx._bx(i) + c / 2;
      stroke(k + '.r' + j, ringPts(k + '.r' + j, x, 0, c * 0.62, c * 0.62, { n: 11, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp((t - rt) / 0.3)) });
    });
    DL.restore();
    for (let i = 0; i < 6; i++) F.targets[`${k}.s${i}`] = [cx + sc * (fx._bx(i) + c / 2), cy];
    F.targets[k + '.total'] = [cx + sc * (fx._bx(5) + c + 34 + c * 0.7), cy];
    F.targets[k + '.top'] = [cx, cy - sc * (c / 2 + 34)];
  },
  cues: fx => {
    const c = fx.t0 >= 0 ? [[fx.t0, 'paper']] : [];
    (fx._writes || []).forEach(w => { if (w && w.t0 >= 0) c.push([w.t0, 'pen']); });
    if (fx._tw && fx._tw.t0 >= 0) c.push([fx._tw.t0, 'pen']);
    (fx.ringT || []).forEach(([, rt]) => { if (rt >= 0) c.push([rt, 'pen']); });
    (fx.braces || []).forEach(b => { if (b.t0 >= 0) c.push([b.t0, 'pen']); });
    return c;
  },
};

/* ---------------- 奖牌 ----------------
 * { type: 'e4_medal', id, at: [x, y]（奖牌中心）| char + part（挂在某人脖子上：char: 'terry'）, r: 54, label: '铜', t0, t1, shine: [t…] }
 * 只用墨线：一个圆牌、一条 V 形挂带，中间写“铜”。 */
COMP.e4_medal = {
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const kid = fx.char && CAST[fx.char] && CAST[fx.char].kid, lt = t - fx.t0, r = fx.r || (kid ? 30 : 54), k = fx.id;   // a child's medal is smaller
    let c, neck = null;
    if (fx.char) { const a = F.anchors[fx.char]; if (!a) return; neck = [a.head[0], a.head[1] + a.r * 1.05]; c = [neck[0] + (fx.dx || 0), neck[1] + (fx.drop || (kid ? 44 : r * 1.7))]; }
    else c = fx.pos ? evalTrack(fx.pos, t) : fx.at;
    const pop = fx.t0 < 0 ? 1 : EASE.back(clamp(lt / 0.3)), z = fx.z ?? Z.front + 2;
    DL.save(); DL.about(c[0], c[1], () => DL.scale(pop));
    const top = neck || [c[0], c[1] - r * 2.2];
    stroke(k + '.rL', [[top[0] - r * 0.55, top[1]], [c[0] - r * 0.32, c[1] - r * 0.86]], { z: z - 0.1, w: 4 });
    stroke(k + '.rR', [[top[0] + r * 0.55, top[1]], [c[0] + r * 0.32, c[1] - r * 0.86]], { z: z - 0.1, w: 4 });
    stroke(k + '.disc', ringPts(k, c[0], c[1], r, r, { n: 14, closed: true }), { z, w: 5, closed: true, fill: C.paper });
    stroke(k + '.in', ringPts(k + 'i', c[0], c[1], r * 0.74, r * 0.74, { n: 12, a0: 20, sweep: 300 }), { z: z + 0.1, w: 2.4, color: C.pencil });
    text(k + '.t', fx.label || '铜', c[0], c[1] + 2, { size: r * 0.95, z: z + 0.2 });
    (fx.shine || []).forEach((st, j) => {
      const u = (t - st) / 0.5; if (u < 0 || u > 1) return;
      for (let i = 0; i < 4; i++) {
        const a = (-60 + i * 40) * RAD, r0 = r * 1.25, L = r * 0.45 * Math.sin(Math.PI * u);
        stroke(k + '.sh' + j + i, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0 - r * 0.3], [c[0] + Math.cos(a) * (r0 + L), c[1] + Math.sin(a) * (r0 + L) - r * 0.3]], { z, w: 4 });
      }
    });
    DL.restore();
    F.targets[k + '.c'] = c;
  },
  cues: fx => [[fx.t0, 'ding'], ...(fx.shine || []).map(s => [s, 'plip'])],
};

/** 成绩单在画面上的统一位置（第 20、25、30、40 场衔接用） */
E4.SHEET = { at: [800, 140], cell: 96 };
/** 1986 年的六道题得分（IMO 官网）；第一天 17 分，第二天 2 分 */
E4.SCORES = [7, 7, 3, 1, 0, 1];
