// 第 6 集（最后一集）共用：角色造型、印章位置、横线纸、奖牌。下划线开头，总会排在最前面被构建带上。
/* ---------------- cast ---------------- */
const E6 = {
  // 17–20 岁的小陶（普林斯顿读博士）：少年，比第 5 集 15 岁时（340）高一点
  teen: { H: 365, head: 0.385, torso: 0.24, leg: 0.325, arm: 0.35, hair: 'tuft', blink: [3.6, 0.5] },
  // 长大以后的陶哲轩（和第 3–5 集一致）
  taoAdult: { H: 400, head: 0.37, torso: 0.24, leg: 0.32, arm: 0.36, hair: 'tuft', blink: [3.9, 1.6] },
  // 爸爸（和第 1、5 集一致）
  dad: { H: 440, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'part', glasses: true, blink: [4.1, 0.4] },
  // 导师斯坦老师（Elias Stein）：年长的教授，打领带；不要画成真人的样子，只是“导师”
  stein: { H: 415, head: 0.37, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'sides', tie: true, blink: [4.4, 2.1] },
  // 另外两位考官（不点名）
  exam2: { H: 420, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'part', glasses: true, blink: [4.1, 1.7] },
  exam3: { H: 405, head: 0.36, torso: 0.25, leg: 0.32, arm: 0.36, hair: 'messy', blink: [3.8, 0.6] },
  // 研究生同学们（只当“同学们”用）
  mate1: { H: 395, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'curly', blink: [3.6, 2.0] },
  mate2: { H: 405, head: 0.355, torso: 0.25, leg: 0.335, arm: 0.36, hair: 'bob', blink: [3.7, 0.7] },
  mate3: { H: 410, head: 0.35, torso: 0.25, leg: 0.34, arm: 0.36, hair: 'part', glasses: true, blink: [4.3, 1.1] },
  mate4: { H: 398, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'ponytail', blink: [4.0, 2.6] },
  // 数学家本·格林（一起证明质数队伍的人）：不要画成真人的样子
  ben: { H: 405, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'messy', glasses: true, blink: [3.9, 0.9] },
  // 最后一个镜头里的“新的孩子”（本子上写着 Jasper）：8 岁，发型和小陶不同
  kid: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'messy', kid: true, blink: [3.2, 1.3] },
  /** 年龄印章：先盖在中央，再停靠到右上角（和第 4、5 集一样）；换年龄前旧印章用 t1 缩小消失 */
  STAMP: { center: [800, 360], R: 150, dock: [1486, 108], dockScale: 0.46 },
};

/** 一张横线纸（和第 2 集的 e2_page、第 5 集的 e5_page 一样），中心在道具位置。fx: {w, h, lines, title} */
PROPS.e6_page = (fx, t, lt, p) => {
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


/* ---------------- 奖牌 ----------------
 * { type: 'e6_medal', id, at: [x, y]（奖牌中心）| char + part（挂在某人脖子上：char: 'terry'）, r: 54, label: '铜' | '银' | '金', t0, t1, shine: [t…] }
 * 只用墨线：一个圆牌、一条 V 形挂带，中间写“铜”。 */
COMP.e6_medal = {
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

/** 一个孩子的书桌：桌子 + 一本本子，封面写 Jasper（第 80、90 场共用）。{at, t0}（t0 为负 = 一开始就画好） */
COMP.e6_desk = {
  draw(fx, t) {
    if (t < fx.t0) return;
    const p = fx.t0 < 0 ? 1 : EASE.out(clamp((t - fx.t0) / 0.5)), [x, y] = fx.at, k = fx.id, z = Z.desk;
    stroke(k + '.top', [[x - 170, y], [x + 170, y]], { z, w: 6, draw: p });
    stroke(k + '.l1', [[x - 150, y], [x - 150, fx.floor ?? 780]], { z, w: 5, draw: p });
    stroke(k + '.l2', [[x + 150, y], [x + 150, fx.floor ?? 780]], { z, w: 5, draw: p });
    stroke(k + '.bk', [[x - 120, y - 6], [x - 110, y - 46, 1], [x + 20, y - 40, 1], [x + 10, y - 2, 1]], { z: z + 0.2, w: 4, closed: true, fill: C.paper, draw: p });
    if (p > 0.6) text(k + '.nm', 'Jasper', x - 50, y - 24, { size: 34, z: z + 0.3, rot: -4 });
  },
  cues: fx => (fx.t0 >= 0 ? [[fx.t0, 'paper']] : []),
};
