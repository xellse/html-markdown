// 第 5 集共用：角色造型、横线纸、成绩单、奖牌、印章位置、两年的分数。下划线开头，总会排在最前面被构建带上。
/* ---------------- cast ---------------- */
const E5 = {
  // 9 岁的小陶（第 10 场回忆他 1985 年初写的小文章）：和第 3、4 集的 10 岁造型一样，略矮一点
  terry9: { H: 250, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  // 11–13 岁的小陶（1987–1988）：比第 4 集（262）高一点
  terry: { H: 280, head: 0.415, torso: 0.225, leg: 0.305, arm: 0.34, hair: 'tuft', kid: true, blink: [3.4, 1.2] },
  // 15 岁的小陶（写书，第 60 场）：少年，头身比更接近大人
  teen: { H: 340, head: 0.39, torso: 0.235, leg: 0.32, arm: 0.35, hair: 'tuft', blink: [3.6, 0.5] },
  // 长大以后的陶哲轩（和第 3、4 集一致）
  taoAdult: { H: 400, head: 0.37, torso: 0.24, leg: 0.32, arm: 0.36, hair: 'tuft', blink: [3.9, 1.6] },
  // 爸爸、妈妈（和第 1 集一致；妈妈用引擎自带的 bob 发型）
  dad: { H: 440, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'part', glasses: true, blink: [4.1, 0.4] },
  mom: { H: 420, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'bob', blink: [3.6, 2.2] },
  // 退休的老教授（周末喝茶聊数学；第 15、28 场）：秃顶、两边一撮头发、戴眼镜，略弯腰的话用 pose 表现
  prof: { H: 410, head: 0.37, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'sides', glasses: true, blink: [4.4, 2.1] },
  // 澳大利亚队的大哥哥大姐姐（1988 年的队友；只当“队友们”用，不指名）
  mate1: { H: 400, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'messy', blink: [3.9, 0.3] },
  mate2: { H: 410, head: 0.35, torso: 0.25, leg: 0.34, arm: 0.36, hair: 'part', glasses: true, blink: [4.3, 1.1] },
  mate3: { H: 395, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'curly', blink: [3.6, 2.0] },
  mate4: { H: 405, head: 0.355, torso: 0.25, leg: 0.335, arm: 0.36, hair: 'bob', blink: [3.7, 0.7] },
  mate5: { H: 398, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'ponytail', blink: [4.0, 2.6] },
  // 两位阅卷老师（1988 年第四题；第 30 场）、监考老师（第 50 场）、出题委员 / 专家（第 35 场，小一号也行）、总理（第 40 场，只是“总理”，不画成真人的样子）
  markerA: { H: 420, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'part', glasses: true, blink: [4.1, 1.7] },
  markerB: { H: 410, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'messy', blink: [3.8, 0.6] },
  proctor: { H: 425, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'sides', tie: true, blink: [4.0, 2.4] },
  expert: { H: 400, head: 0.37, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'part', blink: [4.2, 1.0] },
  pm: { H: 430, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'part', tie: true, blink: [4.5, 1.9] },
  /** 年龄印章：先盖在中央，再停靠到右上角（和第 4 集一样） */
  STAMP: { center: [800, 360], R: 150, dock: [1486, 108], dockScale: 0.46 },
};

/** 一张横线纸（和第 2 集的 e2_page 一样），中心在道具位置。fx: {w, h, lines, title} */
PROPS.e5_page = (fx, t, lt, p) => {
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

/** 周末下午茶（第 15、28 场共用）：一张小圆桌，桌上一把茶壶、两杯冒热气的茶、一盘饼干。道具位置 = 桌面中心。
 *  fx: { steam: true（茶杯冒热气，默认开）, cookies: 5（盘里剩几块，可做成轨道 [[t, n], …] 让饼干一块块变少）} */
PROPS.e5_tea = (fx, t, lt, p) => {
  const k = fx.id, z = fx.z ?? Z.desk;
  // table: oval top + one leg + foot
  stroke(k + '.top', ringPts(k + '.top', 0, 0, 170, 26, { n: 16, closed: true }), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 4) });
  stroke(k + '.leg', [[-6, 26], [-4, 190], [6, 190], [4, 26]], { z: z - 0.2, w: 5, draw: stag(p, 1, 4) });
  stroke(k + '.foot', [[-70, 196], [0, 186, 1], [70, 196]], { z: z - 0.2, w: 5, draw: stag(p, 1, 4) });
  // teapot (left): round closed body, spout on the right, loop handle on the left, lid + knob
  const tx = -92, ty = -44;
  stroke(k + '.pot', ringPts(k + '.pot', tx, ty, 46, 36, { n: 16, closed: true }), { z: z + 0.2, w: 4.5, closed: true, fill: C.paper, draw: stag(p, 2, 4) });
  stroke(k + '.spout', [[tx + 40, ty + 4], [tx + 62, ty - 14], [tx + 80, ty - 34], [tx + 90, ty - 38]], { z: z + 0.1, w: 4.5, draw: stag(p, 2, 4) });
  stroke(k + '.spout2', [[tx + 42, ty - 12], [tx + 70, ty - 40]], { z: z + 0.1, w: 3.5, draw: stag(p, 2, 4) });
  stroke(k + '.handle', ringPts(k + '.h', tx - 50, ty, 16, 20, { n: 9, a0: 90, sweep: 180 }), { z: z + 0.1, w: 4.5, draw: stag(p, 2, 4) });
  stroke(k + '.lid', [[tx - 24, ty - 33], [tx, ty - 44, 1], [tx + 24, ty - 33]], { z: z + 0.3, w: 4, draw: stag(p, 2, 4) });
  dot(k + '.knob', [tx, ty - 50], 6, C.ink, z + 0.3);
  // two cups with steam
  [[22, 'c1'], [78, 'c2']].forEach(([cx, id]) => {
    stroke(k + '.' + id, [[cx - 22, -44], [cx - 17, -6, 1], [cx + 17, -6, 1], [cx + 22, -44], [cx - 22, -44, 1]], { z: z + 0.2, w: 4, closed: true, fill: C.paper, draw: stag(p, 3, 4) });
    stroke(k + '.' + id + 'h', ringPts(k + id, cx + 25, -27, 9, 11, { n: 7, a0: -90, sweep: 180 }), { z: z + 0.2, w: 3.5, draw: stag(p, 3, 4) });
    if (fx.steam !== false && p >= 1) for (let i = 0; i < 2; i++) {
      const ph = (t * 0.7 + i * 0.5 + cx * 0.01) % 1, y0 = -52 - ph * 46, sx = cx - 6 + i * 12;
      stroke(k + '.' + id + 's' + i, [[sx, y0], [sx + 6 * Math.sin(ph * 6), y0 - 12], [sx, y0 - 24]], { z: z + 0.3, w: 2.6, color: C.pencil, opacity: 0.7 * Math.sin(Math.PI * ph) });
    }
  });
  // plate of cookies (right)
  const n = Array.isArray(fx.cookies) ? stepTrack(fx.cookies, t) : (fx.cookies ?? 5), px = 138;
  stroke(k + '.plate', ringPts(k + '.pl', px, -6, 40, 9, { n: 10, closed: true }), { z: z + 0.2, w: 3.5, closed: true, fill: C.paper, draw: stag(p, 3, 4) });
  for (let i = 0; i < n; i++) {
    const cx = px - 26 + (i % 3) * 26, cy = -16 - Math.floor(i / 3) * 14;
    stroke(k + '.ck' + i, ringPts(k + '.ck' + i, cx, cy, 11, 7, { n: 7, closed: true }), { z: z + 0.3 + i * 0.01, w: 3, closed: true, fill: C.paper, draw: stag(p, 3, 4) });
    dot(k + '.ckd' + i, [cx + 2, cy - 1], 2, C.ink, z + 0.35);
  }
};

/** 一张课程卡（第 5、80 场）：横线 + 标题，上面斜盖一个红色“不及格”章；卡片只露出一半（从下面探出来）。{at, t0, t1, title, peek} */
COMP.e5_course = {
  draw(fx, t) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const lt = t - fx.t0, p = EASE.back(clamp(lt / 0.4)), k = fx.id, z = Z.set + 2, [cx, cy] = fx.at;
    const op = fx.t1 !== undefined ? 1 - clamp((t - fx.t1 + 0.3) / 0.3) : 1;
    DL.save(); DL.translate(cx, cy + (1 - p) * 120); DL.rotate(fx.rot || 4);
    stroke(k + '.card', superPts(0, 0, 230, 290, 24, 10), { z, w: 5, closed: true, fill: C.paper, opacity: op });
    text(k + '.t', fx.title || '一门课', 0, -96, { size: 40, z: z + 0.1, opacity: op });
    for (let i = 0; i < 3; i++) stroke(k + '.l' + i, [[-80, -30 + i * 44], [80, -28 + i * 44]], { z: z + 0.1, w: 3, color: C.pencil, opacity: 0.7 * op, boil: 0.5 });
    if (t >= fx.stampT) {
      const s = EASE.back(clamp((t - fx.stampT) / 0.25));
      DL.save(); DL.translate(0, 40); DL.rotate(-14); DL.scale(lerp(1.6, 1, s));
      stroke(k + '.st', superPts(0, 0, 200, 76, 20, 8), { z: z + 0.3, w: 5, closed: true, color: C.red, opacity: op });
      text(k + '.stt', '不及格', 0, 2, { size: 50, color: C.red, z: z + 0.4, opacity: op });
      DL.restore();
    }
    DL.restore();
  },
  cues: fx => [[fx.t0, 'paper'], [fx.stampT, 'stamp']],
};

/* ---------------- 成绩单：六道题的得分 ----------------
 * { type: 'e5_scores', id, at: [cx, cy], scale: 1, t0, t1, cell: 118,
 *   scores: [[分, 写出时间], …6 个]（写出时间为负 = 一开始就写好；null = 还没写）,
 *   total: [总分, 写出时间]（可选）, ringT: [[题号 0-5, t, t1?], …]（红圈圈出某一格，t1 时消失；可选）,
 *   braces: [{ from: 0, to: 2, label: '17', t0, t1 }]（格子下面的红色大括号 + 红色手写数字；t0 为负 = 一开始就在，t1 时 0.25 秒淡出）}
 * 一道题满分 7 分。分数用手写字形一笔笔写进格子；第 3、4 题之间的粗线分开“第一天 / 第二天”。
 * 有 t1 时，最后 0.3 秒淡出。发布命名点：'<id>.s<i>'（第 i 格中心，i 从 0 起）、'<id>.total'、'<id>.top'。 */
COMP.e5_scores = {
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
    const sc = fx.scale || 1, [cx, cy] = fx.at, z = fx.z ?? Z.set + 2, n0 = DL.items.length;
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
    // with a t1, the sheet fades out over its last 0.3 s instead of vanishing in one frame
    const fo = fx.t1 !== undefined ? 1 - clamp((t - fx.t1 + 0.3) / 0.3) : 1;
    if (fo < 1) for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * fo).toFixed(3); }
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
 * { type: 'e5_medal', id, at: [x, y]（奖牌中心）| char + part（挂在某人脖子上：char: 'terry'）, r: 54, label: '铜' | '银' | '金', t0, t1, shine: [t…] }
 * 只用墨线：一个圆牌、一条 V 形挂带，中间写“铜”。 */
COMP.e5_medal = {
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const kid = fx.char && CAST[fx.char] && CAST[fx.char].kid, lt = t - fx.t0, r = fx.r || (kid ? 38 : 54), k = fx.id;   // a child's medal is smaller (r 38 keeps its label readable on a phone)
    let c, neck = null;
    if (fx.char) { const a = F.anchors[fx.char]; if (!a) return; neck = [a.head[0], a.head[1] + a.r * 1.05]; c = [neck[0] + (fx.dx || 0), neck[1] + (fx.drop || (kid ? 52 : r * 1.7))]; }
    else c = fx.pos ? evalTrack(fx.pos, t) : fx.at;
    const pop = fx.t0 < 0 ? 1 : EASE.back(clamp(lt / 0.3)), z = fx.z ?? Z.front + 2;
    DL.save(); DL.about(c[0], c[1], () => DL.scale(pop));
    const top = neck || [c[0], c[1] - r * 2.2];
    stroke(k + '.rL', [[top[0] - r * 0.55, top[1]], [c[0] - r * 0.32, c[1] - r * 0.86]], { z: z - 0.1, w: 4 });
    stroke(k + '.rR', [[top[0] + r * 0.55, top[1]], [c[0] + r * 0.32, c[1] - r * 0.86]], { z: z - 0.1, w: 4 });
    stroke(k + '.disc', ringPts(k, c[0], c[1], r, r, { n: 14, closed: true }), { z, w: 5, closed: true, fill: C.paper });
    stroke(k + '.in', ringPts(k + 'i', c[0], c[1], r * 0.74, r * 0.74, { n: 12, a0: 20, sweep: 300 }), { z: z + 0.1, w: 2.4, color: C.pencil });
    text(k + '.t', fx.label || '银', c[0], c[1] + 2, { size: r * 0.95, z: z + 0.2 });
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

/** 成绩单在画面上的统一位置（第 20/25 场和第 30/35/40 场衔接用） */
E5.SHEET = { at: [800, 140], cell: 96 };
/** 六道题得分（IMO 官网）：1987 年 40 分（银牌，金牌线 42），1988 年 34 分（金牌，金牌线 32） */
E5.S87 = [7, 7, 7, 7, 7, 5];
E5.S88 = [7, 5, 7, 7, 7, 1];
