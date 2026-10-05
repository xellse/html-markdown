// 第 6 集 · 第 30 场 · 从那以后（id change）
// 事实（ep6-script.md）：口试以后，他开始认真上课、认真读书，多听同学和老师的，少打游戏，特别用功地做导师给的题；
//   每周见导师：导师耐心听完、想一想，就从文件柜里抽出一篇论文递给他；导师给的第一道题，他博士毕业五年后才解出来；
//   1996 年 6 月拿到博士学位，20 岁；2019 年他写道：差点没通过口试，可能是当时最好的事。
// 演绎：四格快切里的教室、图书馆、同学、电脑房都只是示意；“第一道题”是哪道没有记录，卡片上只画一个“?”；
//   时间箭头上的刻度只表示一年年过去（两格读博的年份、一顶博士帽 = 毕业、1–5 = 毕业后第几年）；
//   “他变了”不演成一下子全改掉：他只是走上来，握拳点点头。
// 开场：直接在角落盖 18 岁；说到“二十岁”换成 20 岁；结尾前 0.6 秒内全部清掉，印章也收掉。
(() => {
  const FL = 780, DUR = 52.2, OFF = [-900, FL], SEAT = 612;

  /* ---------------- times (scene clock) ---------------- */
  // each cut: the people fade at cN (and leave the stage at cN + OUT), the props a moment later at pN;
  // the next shot's props start drawing in under them, its people pop in only once the old ones are gone
  const OUT = 0.24;
  const T = {
    s18: 0.15, s18out: 39.6, s20: 39.9, s20out: 51.6,
    // L1 从那以后
    w0: 0.3, w1: 1.5, hd: 0.45, nod: 1.85, c0: 3.2,
    // L2 ① 上课 ② 读书
    cls: 3.25, clsIn: 3.46, chk: 4.0, c1: 4.75, p1: 4.85, lib: 4.85, libIn: 5.0, flip: 5.75, c2: 6.45, p2: 6.5,
    // L3 ③ 同学
    talk: 6.7, sp1: 6.85, sw: 8.3, sp3: 8.45, sp3e: 9.85, nods: [7.3, 7.8, 8.95, 9.45], c3: 10.0,
    // L4 ④ 电脑房
    pc: 10.1, pcIn: 10.26, reach: 10.8, off: 11.05, lbPc: 11.45, c4: 12.95, p4: 13.05,
    // L5 导师给的题
    desk: 13.2, deskIn: 13.35, lbProb: 13.6, c5: 17.4, p5: 17.45,
    // L6–L8 每周见面
    meet: 17.5, wk0: 17.6, wk1: 18.55, stIn: 17.75, flips: [18.3, 18.85, 19.4], ex0: 19.2, ex1: 22.5,
    nodS: [20.35, 21.65], think: 23.15, thinkEnd: 24.6, walk0: 24.75, walk1: 25.4, drawer: 25.45, pick: 25.95,
    back0: 26.35, back1: 27.0, give: 27.05, take: 27.35, open: 27.8, c6: 29.25, p6: 29.3,
    // L9–L10 第一道题
    card: 29.4, teen7: 29.55, scratch: 30.45, arr0: 32.95, arr1: 35.55, check: 35.8, lbYr: 36.0, c7: 37.4, p7: 37.55,
    // L11 博士
    grad: 37.66, hop: 38.7, c8: 43.05,
    // L12–L13 回头看
    door: 43.15, tao: 43.31, look: 43.8, pulse: 44.65, quote: 46.4, note: 46.75, hi: 49.4, end: 51.55,
  };
  const PAGES = [14.55, 14.9, 15.25, 15.6, 15.95, 16.3, 16.65, 17.0];
  const DOOD = [[19.45, '?', 690, 372], [20.05, 'x', 780, 318], [20.65, '→', 850, 380], [21.25, '=', 728, 300], [21.85, '…', 815, 336]];

  /* ---------------- little helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const pop = (t, t0, d = 0.25) => Math.max(0.01, EASE.back(clamp((t - t0) / d)));
  const nodTilt = (t, list, amp = 9) => { for (const n0 of list) { const u = t - n0; if (u > 0 && u < 0.45) return amp * Math.sin(u / 0.45 * Math.PI); } return 0; };
  /** hand-written GLYPH characters drawn whole, x = left edge, y = top */
  function glyphs(k, str, x, y, size, o = {}) {
    let gx = x;
    [...str].forEach((ch, i) => {
      const g = GLYPH[ch]; if (!g) return;
      g.s.forEach((s, j) => stroke(`${k}.${i}.${j}`, s.map(([u, v, c]) => [gx + u * size, y + v * size, c]), { z: o.z ?? Z.set + 1, w: o.w || 3, color: o.color || C.ink, opacity: o.opacity, draw: o.draw, boil: 0.5 }));
      gx += (g.w + 0.1) * size;
    });
    return gx - x;
  }
  const glyphW = (str, size) => [...str].reduce((s, ch) => s + ((GLYPH[ch] || { w: 0 }).w + 0.1) * size, 0) - 0.1 * size;
  /** a scribbled line standing in for handwriting */
  function scrib(k, x0, x1, y, o = {}) {
    const n = Math.max(3, Math.round((x1 - x0) / 11)), pts = [], a = o.amp ?? 2;
    for (let m = 0; m <= n; m++) pts.push([x0 + (x1 - x0) * m / n, y + (m % 2 ? -a : a * 0.7)]);
    stroke(k, pts, { z: o.z, w: o.w || 2.4, draw: o.draw, boil: 0.6, color: o.color, opacity: o.opacity });
  }
  /** fades out (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: keep these last in fx */
  COMP.c6_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.25));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };

  /* ---------------- ① 教室第一排：黑板上的粉笔字、桌上的笔记本、红 ✓ ---------------- */
  const BD = { x: 150, y: 160, w: 620, h: 280 }, CLS = { x: 1060, top: 600 };
  COMP.c6_cls = {
    draw(fx, t) {
      if (t < T.cls || t >= T.p1 + 0.3) return;
      const k = 'c6cls', p = clamp((t - T.cls - 0.15) / 0.35);
      if (p > 0) {   // chalk notes (fragments only, no real maths)
        glyphs(k + '.g0', '( x + 1 )', 205, 202, 44, { z: Z.board, w: 4, draw: p });
        scrib(k + '.l0', 420, 690, 228, { z: Z.board, w: 3, amp: 4, draw: p });
        scrib(k + '.l1', 205, 640, 296, { z: Z.board, w: 3, amp: 4, draw: p });
        glyphs(k + '.g2', '→', 205, 334, 44, { z: Z.board, w: 4, draw: p });
        scrib(k + '.l2', 268, 560, 360, { z: Z.board, w: 3, amp: 4, draw: p });
        scrib(k + '.l3', 205, 470, 408, { z: Z.board, w: 3, amp: 4, draw: p });
      }
      const nb = clamp((t - T.cls - 0.1) / 0.25);
      if (nb > 0) {   // an open notebook on his desk; lines appear on the right page as he writes
        const cx = 1100, y0 = 598, y1 = 566, zn = Z.desk + 1;
        stroke(k + '.nbL', [[cx - 2, y0], [cx - 72, y0 + 2, 1], [cx - 64, y1, 1], [cx - 2, y1 + 4, 1], [cx - 2, y0, 1]], { z: zn, w: 3.5, fill: C.paper, draw: nb });
        stroke(k + '.nbR', [[cx + 2, y0], [cx + 72, y0 + 2, 1], [cx + 64, y1, 1], [cx + 2, y1 + 4, 1], [cx + 2, y0, 1]], { z: zn, w: 3.5, fill: C.paper, draw: nb });
        for (let i = 0; i < 3; i++) scrib(k + '.nl' + i, cx - 58, cx - 12, 576 + i * 8, { z: zn + 0.1, w: 1.8, amp: 1.2, draw: nb });
        const n = Math.floor((t - T.cls - 0.35) / 0.22) + 1;
        for (let i = 0; i < Math.min(3, n); i++) scrib(k + '.nr' + i, cx + 12, cx + 56, 576 + i * 8, { z: zn + 0.1, w: 1.8, amp: 1.2 });
      }
      if (t >= T.chk) glyphs(k + '.ck', '✓', 1185, 392, 100, { z: Z.annot, w: 7, color: C.red, draw: clamp((t - T.chk) / 0.2) });
    },
    cues: () => [[T.cls + 0.2, 'chalk'], [T.cls + 0.5, 'pen'], [T.cls + 0.95, 'pen'], [T.chk, 'ding']],
  };

  /* ---------------- ② 图书馆：书架（中间一格少了几本），他抱着一摞书在读 ---------------- */
  const LIB = { x0: 110, x1: 520, y0: 250, rows: [425, 600, 775] };
  const BOOKS = (() => {
    const out = [], h = hstr('c6lib');
    LIB.rows.forEach((bot, row) => {
      let x = LIB.x0 + 16, i = 0;
      for (;;) {
        const w = 24 + Math.round(7 * (rnd(h, row * 40 + i, 1) + 1)), ht = 106 + Math.round(20 * (rnd(h, row * 40 + i, 2) + 1));
        if (x + w > LIB.x1 - 16 - (row === 1 ? 70 : 0)) break;   // the gap: the books he took
        out.push({ x, w, h: ht, bot: bot - 2 });
        x += w + 3; i++;
      }
    });
    return out;
  })();
  const STK = { x: 940, y: 690, books: [[150, 24, 0, -1], [134, 22, 7, 1.5], [156, 24, -5, -0.5], [138, 22, 3, 1]] };
  COMP.c6_lib = {
    draw(fx, t) {
      if (t < T.lib || t >= T.p2 + 0.3) return;
      const k = 'c6lib', z = Z.set, p = EASE.out(clamp((t - T.lib) / 0.4));
      stroke(k + '.o', box(LIB.x0, LIB.y0, LIB.x1, FL), { z, w: 5, fill: C.paper, draw: p });
      LIB.rows.slice(0, 2).forEach((y, i) => stroke(k + '.sb' + i, [[LIB.x0, y], [LIB.x1, y + 1]], { z: z + 0.1, w: 5, draw: p }));
      const q = clamp((t - T.lib - 0.12) / 0.3);
      if (q > 0) BOOKS.forEach((b, j) => {
        const d = clamp(q * 1.6 - (j / BOOKS.length) * 0.6);
        stroke(k + '.b' + j, box(b.x, b.bot - b.h, b.x + b.w, b.bot), { z: z + 0.2, w: 3.2, fill: C.paper, draw: d });
        stroke(k + '.bs' + j, [[b.x + 4, b.bot - b.h + 16], [b.x + b.w - 4, b.bot - b.h + 16]], { z: z + 0.3, w: 2.2, draw: d });
      });
      // the stack in his arms (pops in with him); the top book is open
      const s = pop(t, T.libIn, 0.3), zs = Z.desk, kS = 'c6libS';
      DL.save(); DL.about(STK.x, STK.y, () => DL.scale(s));
      let yb = STK.y;
      STK.books.forEach(([w, h, dx, r], j) => {
        DL.save(); DL.translate(STK.x + dx, yb - h / 2); DL.rotate(r);
        stroke(kS + '.sk' + j, box(-w / 2, -h / 2, w / 2, h / 2), { z: zs, w: 4, fill: C.paper });
        stroke(kS + '.sp' + j, [[-w / 2 + 9, h / 2 - 6], [w / 2 - 9, h / 2 - 6]], { z: zs + 0.1, w: 2, color: C.pencil });
        DL.restore();
        yb -= h;
      });
      const x = STK.x, y = yb;   // the open book
      stroke(kS + '.pL', [[x - 2, y + 2], [x - 74, y + 4, 1], [x - 72, y - 8], [x - 38, y - 15], [x - 2, y - 6, 1], [x - 2, y + 2, 1]], { z: zs + 0.2, w: 3.5, fill: C.paper });
      stroke(kS + '.pR', [[x + 2, y + 2], [x + 74, y + 4, 1], [x + 72, y - 8], [x + 38, y - 15], [x + 2, y - 6, 1], [x + 2, y + 2, 1]], { z: zs + 0.2, w: 3.5, fill: C.paper });
      for (let i = 0; i < 2; i++) { scrib(kS + '.tl' + i, x - 62, x - 14, y - 5 + i * 6, { z: zs + 0.3, w: 1.6, amp: 1 }); scrib(kS + '.tr' + i, x + 14, x + 62, y - 5 + i * 6, { z: zs + 0.3, w: 1.6, amp: 1 }); }
      const f = (t - T.flip) / 0.35;   // he turns a page
      if (f > 0 && f < 1) { const a = Math.PI * EASE.io(f); stroke(kS + '.flip', [[x, y - 6], [x + 36 * Math.cos(a), y - 20 - 18 * Math.sin(a)], [x + 72 * Math.cos(a), y - 8 - 34 * Math.sin(a)]], { z: zs + 0.4, w: 3 }); }
      DL.restore();
    },
    cues: () => [[T.lib, 'pen'], [T.lib + 0.15, 'paper'], [T.flip, 'paper']],
  };

  /* ---------------- ③ “说话”的小弧线（同学说，他听） ---------------- */
  COMP.c6_spk = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const r = a.r, d = fx.dir, cx = a.head[0] + d * r * 1.22, cy = a.head[1] + r * 0.42, lt = t - fx.t0;
      const op = clamp(lt / 0.15) * clamp((fx.t1 - t) / 0.15);
      for (let i = 0; i < 3; i++) {
        const R = 10 + i * 12, pts = [];
        for (let j = 0; j <= 4; j++) { const an = (-48 + j * 24) * RAD; pts.push([cx + d * R * Math.cos(an), cy + R * Math.sin(an)]); }
        const blink = 0.45 + 0.55 * Math.max(0, Math.sin(t * 9 - i * 1.3));
        stroke(fx.id + '.' + i, pts, { z: Z.fx, w: 3.5, opacity: op * blink });
      }
    },
  };

  /* ---------------- ④ 电脑房：方方的老显示器，游戏画面（小格子地图 + 小城堡），一只手按下开关 ---------------- */
  const PCD = { x: 900, top: 600 }, MON = { x0: 895, y0: 320, x1: 1225, y1: 572 }, SCR = { x0: 918, y0: 340, x1: 1202, y1: 550 };
  const BTN = [935, 561], SC = [(SCR.x0 + SCR.x1) / 2, (SCR.y0 + SCR.y1) / 2];
  function gameScreen(k, z) {
    const gx = 940, gy = 364, cs = 37;
    for (let i = 0; i <= 4; i++) {
      stroke(k + '.gv' + i, [[gx + i * cs, gy], [gx + i * cs, gy + 4 * cs]], { z, w: 2, boil: 0.4 });
      stroke(k + '.gh' + i, [[gx, gy + i * cs], [gx + 4 * cs, gy + i * cs]], { z, w: 2, boil: 0.4 });
    }
    [[0, 0], [2, 1], [1, 3], [3, 2]].forEach(([c, r], i) => {   // little trees
      const x = gx + c * cs + cs / 2, y = gy + r * cs + cs / 2;
      stroke(k + '.tr' + i, [[x - 9, y + 10], [x, y - 11, 1], [x + 9, y + 10, 1], [x - 9, y + 10, 1]], { z, w: 2.6 });
    });
    [[1, 1], [3, 0], [0, 2]].forEach(([c, r], i) => scrib(k + '.wv' + i, gx + c * cs + 6, gx + c * cs + cs - 6, gy + r * cs + cs / 2, { z, w: 2.2, amp: 3 }));   // water
    const cx = 1152, by = 528;   // a little castle with a flag
    const top = [[cx - 38, by], [cx - 38, by - 58, 1]];
    for (let i = 0; i < 6; i++) { const x = cx - 38 + i * 15.2; top.push([x, by - 68, 1], [x + 7.6, by - 68, 1], [x + 7.6, by - 58, 1], [x + 15.2, by - 58, 1]); }
    top.push([cx + 38, by, 1]);
    stroke(k + '.cs', top, { z, w: 3 });
    stroke(k + '.cd', [[cx - 10, by], [cx - 10, by - 20], [cx, by - 30], [cx + 10, by - 20], [cx + 10, by]], { z, w: 2.6 });
    stroke(k + '.fp', [[cx, by - 68], [cx, by - 112]], { z, w: 2.6 });
    stroke(k + '.fl', [[cx, by - 112], [cx + 26, by - 104, 1], [cx, by - 96, 1]], { z, w: 2.6 });
  }
  COMP.c6_pc = {
    draw(fx, t) {
      if (t < T.pc || t >= T.p4 + 0.3) return;
      const k = 'c6pc', z = Z.set + 1, p = EASE.out(clamp((t - T.pc) / 0.4));
      stroke(k + '.mon', box(MON.x0, MON.y0, MON.x1, MON.y1), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.scr', box(SCR.x0, SCR.y0, SCR.x1, SCR.y1), { z: z + 0.1, w: 3.5, draw: p });
      stroke(k + '.neck', [[1030, MON.y1], [1020, PCD.top - 2, 1], [1100, PCD.top - 2, 1], [1090, MON.y1, 1]], { z: z - 0.1, w: 4, fill: C.paper, draw: p });
      stroke(k + '.mSh', [[MON.x0 + 12, MON.y1 + 6], [MON.x1 + 7, MON.y1 + 5, 1], [MON.x1 + 7, MON.y0 + 12]], { z: z - 0.2, w: 2.4, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      // the power button (pressed at T.off) and its little light
      const pr = t >= T.off && t < T.off + 0.18 ? 0.7 : 1;
      stroke(k + '.btn', ringPts(k + '.btn', BTN[0], BTN[1], 7 * pr, 7 * pr, { n: 8, closed: true }), { z: z + 0.2, w: 3, closed: true, fill: C.paper, draw: p });
      if (t < T.off) dot(k + '.led', [1190, 561], 4.5, C.ink, z + 0.2);
      // keyboard
      const kb = clamp((t - T.pc - 0.1) / 0.3);
      stroke(k + '.kb', [[792, 598], [952, 598, 1], [944, 584, 1], [800, 584, 1], [792, 598, 1]], { z: Z.desk + 1, w: 3.5, fill: C.paper, draw: kb });
      for (let i = 0; i < 6; i++) if (kb > 0.6) stroke(k + '.ky' + i, [[810 + i * 22, 591], [822 + i * 22, 591]], { z: Z.desk + 1.1, w: 2.4 });
      // the game, until he switches it off: the picture squeezes into a line, then a dot (an old tube screen)
      if (t >= T.pc + 0.2 && t < T.off + 0.5) {
        const u1 = EASE.in(clamp((t - T.off) / 0.12)), u2 = EASE.in(clamp((t - T.off - 0.12) / 0.14));
        if (u1 < 1) {
          DL.save(); DL.about(SC[0], SC[1], () => DL.scale(1, Math.max(0.02, 1 - u1)));
          gameScreen(k + '.g', z + 0.2);
          DL.restore();
        } else {
          const L = 130 * (1 - u2), op = 1 - clamp((t - T.off - 0.3) / 0.2);
          if (L > 3) stroke(k + '.line', [[SC[0] - L, SC[1]], [SC[0] + L, SC[1]]], { z: z + 0.2, w: 4 });
          else dot(k + '.dot', SC, 5 * op + 0.5, C.ink, z + 0.2);
        }
      }
      if (t >= T.off + 0.5) stroke(k + '.gl', [[SCR.x0 + 18, SCR.y0 + 40], [SCR.x0 + 40, SCR.y0 + 18]], { z: z + 0.2, w: 2.4, color: C.pencil });   // the glass, now dark
    },
    cues: () => [[T.pc, 'pen'], [T.pc + 0.3, 'beep'], [10.4, 'key'], [10.55, 'key'], [10.68, 'key'], [T.off, 'tap'], [T.off + 0.05, 'zip']],
  };

  /* ---------------- ⑤ 书桌：一叠“导师给的题”；他写满一张，就放到右边，纸越堆越高 ---------------- */
  const DK = { x: 800, top: 600, sheet: [822, 577], pile: [968, 598], stack: [640, 598] };
  const PJ = [[0, -2], [5, 1.5], [-3, -1], [6, 2], [-2, -1.5], [3, 1], [-5, -2], [2, 1.5]];
  COMP.c6_dk = {
    draw(fx, t) {
      if (t < T.desk || t >= T.p5 + 0.3) return;
      const k = 'c6dk', z = Z.desk + 1, p = clamp((t - T.desk - 0.1) / 0.3);
      const [sx, sy] = DK.stack;   // the problems from his advisor: a neat stack
      stroke(k + '.st', box(sx - 58, sy - 28, sx + 58, sy), { z, w: 4, fill: C.paper, draw: p });
      for (let i = 1; i < 4; i++) stroke(k + '.sl' + i, [[sx - 58, sy - 28 + i * 7], [sx + 58, sy - 28 + i * 7]], { z: z + 0.1, w: 1.8, draw: p });
      // the sheet he is writing on (a fresh one after each page goes onto the pile)
      const [cx, cy] = DK.sheet;
      stroke(k + '.sh', [[cx - 56, cy + 21], [cx + 56, cy + 21, 1], [cx + 50, cy - 21, 1], [cx - 50, cy - 21, 1], [cx - 56, cy + 21, 1]], { z, w: 3.5, fill: C.paper, draw: p });
      let last = T.desk + 0.3; PAGES.forEach(pt => { if (t >= pt) last = pt; });
      const n = t < T.desk + 0.3 ? 0 : Math.min(3, Math.floor((t - last - 0.04) / 0.09) + 1);
      for (let i = 0; i < n; i++) scrib(k + '.wl' + i, cx - 42, cx + (i === 2 ? 18 : 40), cy - 10 + i * 10, { z: z + 0.1, w: 2, amp: 1.5 });
      // the pile of written pages (scratch work, not answers)
      PAGES.forEach((pt, i) => {
        if (t < pt) return;
        const u = EASE.io(clamp((t - pt) / 0.3)), [jx, jr] = PJ[i];
        const rest = [DK.pile[0] + jx, DK.pile[1] - 5 - i * 9], from = [cx, cy];
        const c = [lerp(from[0], rest[0], u), lerp(from[1], rest[1], u) - 60 * Math.sin(Math.PI * u)];
        const w = lerp(100, 128, u), h = lerp(40, 9, u);
        DL.save(); DL.translate(c[0], c[1]); DL.rotate(jr * u);
        stroke(k + '.pg' + i, box(-w / 2, -h / 2, w / 2, h / 2), { z: z + 0.2 + i * 0.01, w: 3, fill: C.paper });
        if (h > 20) for (let j = 0; j < 2; j++) scrib(k + '.pl' + i + j, -w / 2 + 10, w / 2 - 12, -h / 2 + 12 + j * 10, { z: z + 0.21 + i * 0.01, w: 1.8, amp: 1.2 });
        DL.restore();
      });
    },
    cues: () => [[T.desk + 0.1, 'paper'], ...PAGES.map(p => [p, 'paper']), ...[13.9, 14.3, 14.7, 15.1, 15.5, 15.9, 16.3, 16.7].map(x => [x, 'pen'])],
  };

  /* ---------------- ⑥ 每周见面：墙上的日历一周翻一页 ---------------- */
  const CAL = { x: 250, y: 175, w: 190, h: 210, band: 52 };
  COMP.c6_cal = {
    draw(fx, t) {
      if (t < T.meet || t >= T.p6 + 0.3) return;
      const { x, y, w, h, band } = CAL, z = Z.set + 1, k = 'c6cal', p = EASE.out(clamp((t - T.meet) / 0.35));
      stroke(k + '.str', [[x - 52, y + 2], [x, y - 40, 1], [x + 52, y + 2]], { z, w: 2.4, color: C.pencil, draw: p });
      dot(k + '.nail', [x, y - 40], 4.5, C.ink, z);
      stroke(k + '.pg', box(x - w / 2, y, x + w / 2, y + h), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.sh', [[x - w / 2 + 12, y + h + 8], [x + w / 2 + 8, y + h + 8, 1], [x + w / 2 + 8, y + 12]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      stroke(k + '.band', [[x - w / 2, y + band], [x + w / 2, y + band + 1]], { z: z + 0.1, w: 4, draw: p });
      let i = 0; T.flips.forEach(f => { if (t >= f) i++; });
      const cy = y + band + (h - band) / 2, lastF = i ? T.flips[i - 1] : -9, q = clamp((t - T.meet - 0.2) / 0.2) * clamp((t - lastF - 0.15) / 0.1);
      if (q > 0) text(k + '.wk', `第 ${i + 1} 周`, x, cy, { size: 50, z: z + 0.2, opacity: q });
      T.flips.forEach((f, j) => {   // the page just torn off swings down and fades
        const u = (t - f) / 0.5; if (u < 0 || u >= 1) return;
        const sw = EASE.out(clamp(u / 0.25)), fall = EASE.in(clamp((u - 0.1) / 0.9)), op = 1 - clamp((u - 0.55) / 0.4), z2 = z + 0.5;
        DL.save(); DL.translate(x - w / 2 + 30 * fall, y + band + 260 * fall); DL.rotate(16 * sw + 36 * fall); DL.translate(-(x - w / 2), -(y + band));
        stroke(k + '.old' + j, box(x - w / 2, y + band, x + w / 2, y + h), { z: z2, w: 5, fill: C.paper, opacity: op });
        text(k + '.oldT' + j, `第 ${j + 1} 周`, x, cy, { size: 50, z: z2 + 0.1, opacity: 1 - clamp(u / 0.28) });
        DL.restore();
      });
      [-1, 1].forEach(s => stroke(k + '.rg' + s, ringPts(k + '.rg' + s, x + s * 52, y, 10, 15, { n: 8, a0: 100, sweep: 300 }), { z: z + 0.6, w: 4, draw: p }));
    },
    cues: () => [[T.meet, 'paper'], ...T.flips.map(f => [f, 'paper'])],
  };

  /* ---------------- ⑥ 文件柜：最上面的抽屉被拉开，里面是一沓沓文件 ---------------- */
  const CAB = { x0: 1300, x1: 1460, y0: 470, dh: 103 };
  const drawerU = t => EASE.out(clamp((t - T.drawer) / 0.22));
  const drawerOff = t => { const u = drawerU(t); return [-40 * u, 18 * u]; };
  const HANDLE = t => { const [ox, oy] = drawerOff(t); return [(CAB.x0 + CAB.x1) / 2 + ox, CAB.y0 + 8 + CAB.dh / 2 - 4 + oy]; };
  const INSIDE = [1338, 488];
  COMP.c6_cab = {
    draw(fx, t) {
      if (t < T.meet || t >= T.p6 + 0.3) return;
      const { x0, x1, y0, dh } = CAB, k = 'c6cab', z = Z.set + 1, p = EASE.out(clamp((t - T.meet - 0.1) / 0.4)), cx = (x0 + x1) / 2;
      stroke(k + '.body', box(x0, y0, x1, FL), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.sh', [[x1 + 4, y0 + 12], [x1 + 8, FL - 2]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      const front = (kk, oy, ox, zz) => {
        stroke(kk, box(x0 + 10 + ox, y0 + 8 + oy, x1 - 10 + ox, y0 + dh - 4 + oy), { z: zz, w: 3.5, fill: C.paper, draw: p });
        stroke(kk + '.h', [[cx - 22 + ox, y0 + 8 + dh / 2 - 4 + oy], [cx + 22 + ox, y0 + 8 + dh / 2 - 4 + oy]], { z: zz + 0.05, w: 5, draw: p });
        stroke(kk + '.l', box(cx - 16 + ox, y0 + 20 + oy, cx + 16 + ox, y0 + 34 + oy), { z: zz + 0.05, w: 2.4, draw: p });
      };
      for (let i = 1; i < 3; i++) front(k + '.d' + i, i * dh, 0, z + 0.2);
      const [ox, oy] = drawerOff(t);
      if (ox < -1) {   // the open drawer: its dark opening, the folders sticking up, the drawer's sides
        stroke(k + '.hole', box(x0 + 10, y0 + 8, x1 - 10, y0 + dh - 4), { z: z + 0.2, w: 3.5, fill: C.paper });
        stroke(k + '.sL', [[x0 + 10, y0 + 8], [x0 + 10 + ox, y0 + 8 + oy]], { z: z + 0.35, w: 3 });
        stroke(k + '.sR', [[x1 - 10, y0 + 8], [x1 - 10 + ox, y0 + 8 + oy]], { z: z + 0.35, w: 3 });
        [0, 1, 2, 3].forEach(i => {
          const fx0 = x0 + 22 + i * 30 + ox * 0.5, fy = y0 + 8 + oy * 0.5;
          stroke(k + '.f' + i, [[fx0, fy + 10], [fx0 + 4, fy - 8, 1], [fx0 + 20, fy - 8, 1], [fx0 + 24, fy + 10]], { z: z + 0.3, w: 2.8, fill: C.paper });
        });
      }
      front(k + '.d0', oy, ox, z + 0.4);
    },
    cues: () => [[T.meet + 0.1, 'pen'], [T.drawer, 'whoosh'], [T.drawer + 0.2, 'thud']],
  };

  /* ---------------- ⑥ 那篇论文：从抽屉里抽出来，递过去，他翻开就读 ---------------- */
  const HAND = [702, 628], PC6 = [645, 640];
  function paperCenter(t, F) {
    if (t < T.pick) return null;
    const s = F.anchors.stein, b = F.anchors.tMeet;
    if (t < T.give) return s ? [s.handR[0], s.handR[1] - 26] : null;
    if (t < T.take) return s ? [s.handL[0], s.handL[1] - 26] : null;
    if (!b) return null;
    return lerp2([b.handR[0] - 4, b.handR[1] - 26], PC6, EASE.io(clamp((t - T.take - 0.1) / 0.3)));
  }
  COMP.c6_pp = {
    draw(fx, t, F) {
      if (t < T.pick || t >= T.c6 + 0.3) return;
      const c = paperCenter(t, F); if (!c) return;
      const k = 'c6pp', z = Z.front + 1, s = pop(t, T.pick, 0.2), o = EASE.out(clamp((t - T.open) / 0.25)), W = 86 * (1 + o), H = 110;
      DL.save(); DL.about(c[0], c[1], () => DL.scale(s)); DL.translate(c[0], c[1]); DL.rotate(lerp(-4, 0, o));
      stroke(k + '.p', box(-W / 2, -H / 2, W / 2, H / 2), { z, w: 3.5, fill: C.paper });
      const tx = lerp(0, -43, o);
      text(k + '.t', '论文', tx, -H / 2 + 26, { size: 36, z: z + 0.1 });
      for (let i = 0; i < 4; i++) scrib(k + '.l' + i, tx - 32, tx + 32 - (i === 3 ? 22 : 0), -H / 2 + 56 + i * 12, { z: z + 0.1, w: 1.8, amp: 1.2 });
      if (o > 0.4) {
        stroke(k + '.fold', [[0, -H / 2 + 4], [0, H / 2 - 4]], { z: z + 0.1, w: 2, color: C.pencil });
        for (let i = 0; i < 6; i++) scrib(k + '.r' + i, 11, 75 - (i === 5 ? 26 : 0), -H / 2 + 18 + i * 14, { z: z + 0.1, w: 1.8, amp: 1.2, opacity: clamp((o - 0.4) / 0.4) });
      }
      DL.restore();
    },
    cues: () => [[T.pick, 'paper'], [T.take, 'paper'], [T.open, 'paper']],
  };

  /* ---------------- ⑥ 他讲的时候冒出来的小符号；老师想的时候，思考云里一个“…” ---------------- */
  COMP.c6_dd = {
    draw(fx, t) {
      if (t < T.ex0 || t >= T.c6 + 0.3) return;
      DOOD.forEach(([t0, ch, x, y], i) => {
        const lt = t - t0; if (lt < 0 || lt > 1.3) return;
        const s = pop(t, t0, 0.2), op = 1 - clamp((lt - 0.95) / 0.35), size = 54, gw = glyphW(ch, size);
        DL.save(); DL.about(x + gw / 2, y + size / 2, () => DL.scale(s)); DL.translate(0, -26 * EASE.out(clamp(lt / 1.3)));
        glyphs('c6dd.' + i, ch, x, y, size, { z: Z.fx, w: 4.5, opacity: op });
        DL.restore();
      });
      if (t >= T.think + 0.05 && t < T.thinkEnd) {
        const s = pop(t, T.think + 0.05, 0.3);
        DL.save(); DL.about(1150, 300, () => DL.scale(s));
        glyphs('c6dd.th', '…', 1150 - glyphW('…', 80) / 2, 262, 80, { z: Z.fx + 1, w: 6 });
        DL.restore();
      }
    },
    cues: () => DOOD.map(([t0]) => [t0, 'boop']),
  };

  /* ---------------- ⑦ 导师给的第一道题：卡片上一个大“?”；一条长长的时间箭头 ---------------- */
  const CD = { x: 420, y: 395, w: 330, h: 300 }, AR = { x0: 605, x1: 1462, y: 470 };
  const TICKS = [680, 770, 870, 980, 1080, 1180, 1280, 1380];   // two years of grad school, the PhD (a cap), then years 1–5
  const tipU = t => clamp((t - T.arr0) / (T.arr1 - T.arr0));
  const tipX = t => lerp(AR.x0, AR.x1, tipU(t));
  const tickT = x => T.arr0 + (x - AR.x0) / (AR.x1 - AR.x0) * (T.arr1 - T.arr0);
  const arY = x => AR.y + 2.5 * Math.sin(x * 0.045);
  /** a little mortarboard: a flat diamond, a band, a tassel (local coords, centre of the board at 0,0) */
  function capIcon(k, cx, cy, s, z) {
    stroke(k + '.b', [[cx - 34 * s, cy], [cx, cy - 11 * s, 1], [cx + 34 * s, cy, 1], [cx, cy + 11 * s, 1], [cx - 34 * s, cy, 1]], { z, w: 3.5, fill: C.paper });
    stroke(k + '.c', [[cx - 18 * s, cy + 5 * s], [cx - 16 * s, cy + 22 * s, 1], [cx + 16 * s, cy + 22 * s, 1], [cx + 18 * s, cy + 5 * s]], { z: z - 0.05, w: 3.5, fill: C.paper });
    stroke(k + '.t', [[cx, cy], [cx + 22 * s, cy + 4 * s], [cx + 24 * s, cy + 22 * s]], { z: z + 0.05, w: 2.6 });
  }
  COMP.c6_cd = {
    draw(fx, t) {
      if (t < T.card || t >= T.p7 + 0.3) return;
      const k = 'c6cd', z = Z.set + 2, { x, y, w, h } = CD, s = pop(t, T.card, 0.3);
      DL.save(); DL.about(x, y, () => DL.scale(s));
      stroke(k + '.c', box(x - w / 2, y - h / 2, x + w / 2, y + h / 2), { z, w: 5, fill: C.paper });
      stroke(k + '.sh', [[x - w / 2 + 12, y + h / 2 + 8], [x + w / 2 + 8, y + h / 2 + 7, 1], [x + w / 2 + 8, y - h / 2 + 12]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7, boil: 0.5 });
      text(k + '.t', '导师给的第一道题', x, y - h / 2 + 44, { size: 36, z: z + 0.2 });
      stroke(k + '.u', [[x - w / 2 + 24, y - h / 2 + 76], [x + w / 2 - 24, y - h / 2 + 74]], { z: z + 0.1, w: 3 });
      glyphs(k + '.q', '?', x - glyphW('?', 170) / 2, y - h / 2 + 100, 170, { z: z + 0.2, w: 9, draw: clamp((t - T.card - 0.25) / 0.3) });
      DL.restore();
      // the arrow of the years
      if (t >= T.arr0) {
        const tx = tipX(t), pts = [];
        for (let xx = AR.x0; xx < tx; xx += 30) pts.push([xx, arY(xx)]);
        pts.push([tx, arY(tx)]);
        if (pts.length > 1) stroke(k + '.ar', pts, { z, w: 5, boil: 0.6 });
        const hy = arY(tx);
        stroke(k + '.ah', [[tx - 24, hy - 15], [tx + 2, hy, 1], [tx - 24, hy + 15]], { z, w: 5 });
        TICKS.forEach((xx, i) => {
          const t0 = tickT(xx); if (t < t0) return;
          const q = pop(t, t0, 0.2);
          DL.save(); DL.about(xx, AR.y, () => DL.scale(q));
          stroke(k + '.tk' + i, [[xx, AR.y - 18], [xx, AR.y + 18]], { z: z + 0.1, w: 4 });
          if (i === 2) capIcon(k + '.cap', xx, AR.y - 52, 1, z + 0.2);
          if (i >= 3) { const d = String(i - 2), size = 44; glyphs(k + '.n' + i, d, xx - glyphW(d, size) / 2, AR.y - 72, size, { z: z + 0.2, w: 4.5 }); }
          DL.restore();
        });
      }
      if (t >= T.arr1 + 0.05) text(k + '.end', '博士毕业 5 年后', 1180, 545, { size: 44, z: z + 0.2, scale: lerp(0.6, 1, EASE.back(clamp((t - T.arr1 - 0.05) / 0.2))), opacity: clamp((t - T.arr1 - 0.05) / 0.1) });
      if (t >= T.check) glyphs(k + '.ck', '✓', 1430, 322, 110, { z: Z.annot, w: 8, color: C.red, draw: clamp((t - T.check) / 0.22) });
    },
    cues: () => [[T.card, 'pop'], [T.card + 0.25, 'pen'], [T.arr0, 'zip'], ...TICKS.map(x => [tickT(x), 'tap']), [T.arr1 + 0.05, 'pop'], [T.check, 'ding']],
  };

  /* ---------------- ⑧ 博士帽（落到头上）和证书“1996 博士” ---------------- */
  const DIP = { w: 210, h: 92 };
  COMP.c6_gr = {
    draw(fx, t, F) {
      if (t < T.grad || t >= T.c8 + 0.3) return;
      const a = F.anchors.tGrad; if (!a) return;
      const k = 'c6gr', r = a.r, z = Z.front + 1;
      // diploma between his hands (rolled ends in his hands)
      const m = lerp2(a.handL, a.handR, 0.5), dp = pop(t, T.grad + 0.1, 0.3);
      DL.save(); DL.about(m[0], m[1], () => DL.scale(dp)); DL.translate(m[0], m[1] - 2);
      stroke(k + '.d', box(-DIP.w / 2, -DIP.h / 2, DIP.w / 2, DIP.h / 2), { z, w: 4, fill: C.paper });
      [-1, 1].forEach(sg => stroke(k + '.r' + sg, ringPts(k + '.r' + sg, sg * (DIP.w / 2 + 6), 0, 13, DIP.h / 2 + 6, { n: 10, closed: true }), { z: z + 0.1, w: 4, closed: true, fill: C.paper }));
      text(k + '.t', '1996 博士', 0, 2, { size: 42, z: z + 0.2 });
      DL.restore();
      // the cap drops onto his head
      const u = clamp((t - T.grad - 0.3) / 0.25); if (u <= 0) return;
      const ang = Math.atan2(a.headTop[0] - a.head[0], a.head[1] - a.headTop[1]) / RAD, drop = -90 * (1 - EASE.in(u));
      DL.save(); DL.translate(a.head[0], a.head[1]); DL.rotate(ang); DL.translate(0, drop);
      const P = (x, y, c) => (c ? [x * r, y * r, 1] : [x * r, y * r]);
      stroke(k + '.band', [P(-0.82, -0.94), P(-0.74, -0.8, 1), P(0.74, -0.8, 1), P(0.82, -0.94, 1)], { z, w: 4.5, fill: C.paper });
      stroke(k + '.board', [P(-1.42, -1.04), P(0.04, -1.32, 1), P(1.46, -1.06, 1), P(0, -0.86, 1), P(-1.42, -1.04, 1)], { z: z + 0.1, w: 4.5, fill: C.paper });
      stroke(k + '.tas', [P(0.02, -1.08), P(1.0, -1.0), P(1.14, -0.5)], { z: z + 0.2, w: 3 });
      [-1, 0, 1].forEach(i => stroke(k + '.tf' + i, [P(1.14, -0.52), P(1.14 + i * 0.07, -0.34)], { z: z + 0.2, w: 2.6 }));
      DL.restore();
      // a little burst of ink when he hops
      const b = (t - T.hop) / 0.55;
      if (b > 0 && b < 1) for (let i = 0; i < 7; i++) {
        const an = (-160 + i * 23.3) * RAD, r0 = r * 2.0, L = r * 0.55 * Math.sin(Math.PI * b);
        stroke(k + '.bu' + i, [[a.head[0] + Math.cos(an) * r0, a.head[1] - 20 + Math.sin(an) * r0], [a.head[0] + Math.cos(an) * (r0 + L), a.head[1] - 20 + Math.sin(an) * (r0 + L)]], { z: Z.fx, w: 4 });
      }
    },
    cues: () => [[T.grad + 0.1, 'pop'], [T.grad + 0.55, 'plip'], [T.hop, 'tada']],
  };

  /* ---------------- ⑨ 那扇“资格口试”的门，和一路走过来的脚印 ---------------- */
  const DOOR = { x: 260, w: 220, top: 330 };
  COMP.c6_dr = {
    draw(fx, t) {
      if (t < T.door || t >= T.end + 0.3) return;
      const k = 'c6dr', z = Z.set + 1, s = pop(t, T.door + 0.2, 0.25), [x, y] = [DOOR.x, 430];
      DL.save(); DL.about(x, y, () => DL.scale(s));
      stroke(k + '.sg', box(x - 100, y - 32, x + 100, y + 32), { z, w: 4, fill: C.paper });
      text(k + '.t', '资格口试', x, y + 2, { size: 42, z: z + 0.1 });
      DL.restore();
      for (let i = 0; i < 9; i++) {   // footprints from the door to where he stands now
        const t0 = T.door + 0.15 + i * 0.07; if (t < t0) continue;
        const fx0 = 420 + i * 80, fy = i % 2 ? 772 : 763;
        stroke(k + '.fp' + i, ringPts(k + '.fp' + i, fx0, fy, 13, 5.5, { n: 8, closed: true }), { z: Z.set, w: 2.4, color: C.pencil, closed: true, opacity: clamp((t - t0) / 0.15) });
      }
    },
    cues: () => [[T.door, 'pen'], [T.door + 0.2, 'pop']],
  };
  /** the essay in his hand ("他写道") */
  COMP.c6_es = {
    draw(fx, t, F) {
      if (t < T.tao || t >= T.end + 0.3) return;
      const a = F.anchors.tao; if (!a) return;
      const k = 'c6es', z = Z.front + 1, c = [a.handL[0] - 4, a.handL[1] - 24];
      let s = 1; const v = (t - T.pulse) / 0.45; if (v > 0 && v < 1) s = 1 + 0.18 * Math.sin(Math.PI * v);
      DL.save(); DL.about(c[0], c[1], () => DL.scale(s)); DL.translate(c[0], c[1]); DL.rotate(-5);
      stroke(k + '.p', box(-42, -54, 42, 54), { z, w: 3.5, fill: C.paper });
      stroke(k + '.ti', [[-28, -36], [-8, -39], [12, -35], [28, -38]], { z: z + 0.1, w: 4, boil: 0.5 });
      for (let i = 0; i < 5; i++) scrib(k + '.l' + i, -30, 30 - (i === 4 ? 24 : 0), -14 + i * 13, { z: z + 0.1, w: 1.8, amp: 1.2 });
      DL.restore();
    },
    cues: () => [[T.pulse, 'paper']],
  };
  /** the quote, two lines, with a tail to him; the yellow highlighter goes over “最好的事” */
  const QT = { x0: 470, y1: 292, y2: 362, size: 58, l1: '“差点没通过，', l2: '可能是当时最好的事。”' };
  COMP.c6_qt = {
    draw(fx, t, F) {
      if (t < T.quote || t >= T.end + 0.3) return;
      const k = 'c6qt', lt = t - T.quote, pp = EASE.back(clamp(lt / 0.25)), op = clamp(lt / 0.1);
      text(k + '.1', QT.l1, QT.x0, QT.y1, { size: QT.size, anchor: 'start', z: Z.annot, scale: lerp(0.7, 1, pp), opacity: op });
      const p2 = EASE.back(clamp((lt - 0.12) / 0.25));
      if (lt > 0.12) text(k + '.2', QT.l2, QT.x0, QT.y2, { size: QT.size, anchor: 'start', z: Z.annot, scale: lerp(0.7, 1, p2), opacity: clamp((lt - 0.12) / 0.1) });
      const a = F.anchors.tao;
      if (a) {
        const from = [1012, 398], d = dist(from, a.head), to = lerp2(from, a.head, clamp((d - a.r - 16) / d));
        stroke(k + '.tail', [from, to], { z: Z.annot, w: 3.5, draw: EASE.out(clamp((lt - 0.05) / 0.15)) });
      }
      if (t >= T.hi) {   // highlighter under “最好的事” (the 6th–9th characters of line 2)
        const x0 = QT.x0 + 5 * QT.size - 6, x1 = x0 + 4 * QT.size + 12, hp = EASE.out(clamp((t - T.hi) / 0.4)), xe = lerp(x0, x1, hp);
        const y0 = QT.y2 - 27, y1 = QT.y2 + 29, top = [], bot = [];
        for (let i = 0; i <= 8; i++) { const xx = lerp(x0, xe, i / 8); top.push([xx, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([xx, y1 + Math.sin(i * 2.3) * 4]); }
        stroke(k + '.hi', top.concat(bot), { z: Z.annot - 0.5, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
      }
    },
    cues: () => [[T.quote, 'pop'], [T.hi, 'swish']],
  };

  /* ---------------- poses & faces ---------------- */
  Object.assign(FACE, {
    c6_talk: { mouth: 'o', brow: 'arc', browY: 0.03 },
    c6_ponder: { eyes: 'happy', mouth: 'flat', mw: 0.18, brow: 'line', browL: 8, browR: 8 },
  });
  const SITB = POSE.sitBase;
  Object.assign(POSE, {
    c6_fist: { tilt: -3, armR: [30, 118], armL: [16, 10] },
    c6_pcReach: { ...SITB, lean: 10, tilt: 3, armScale: 1.4, ikL: { w: 1, to: 'desk', dx: 40, dy: -4, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: BTN[0] - 4 - 760, dy: BTN[1] - PCD.top, bend: 'down' } },
    c6_pcRest: { ...SITB, ikL: { w: 1, to: 'desk', dx: 10, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'desk', dx: 70, dy: -2, bend: 'down' } },
    c6_books: { tilt: 10, lean: 1, ikL: { w: 1, to: 'abs', dx: STK.x - 80, dy: 655, bend: 'out' }, ikR: { w: 1, to: 'abs', dx: STK.x + 80, dy: 655, bend: 'out' } },
    c6_sPonder: { tilt: -7, armL: [14, 8], ikR: { w: 1, to: 'chin', dx: 0.32, dy: 0.06, bend: 'down' } },
    c6_sIn: { lean: 7, tilt: 4, armL: [14, 8], ikR: { w: 1, to: 'abs', dx: INSIDE[0], dy: INSIDE[1], bend: 'down' } },
    c6_sLift: { lean: 2, tilt: 2, armL: [14, 8], ikR: { w: 1, to: 'abs', dx: 1312, dy: 604, bend: 'down' } },
    c6_sGive: { lean: -4, tilt: -3, armR: [14, 8], ikL: { w: 1, to: 'abs', dx: HAND[0], dy: HAND[1], bend: 'down' }, ikR: { w: 0 } },
    c6_mReach: { lean: 3, armL: [16, 10], ikR: { w: 1, to: 'abs', dx: HAND[0], dy: HAND[1], bend: 'down' } },
    c6_mHold: { tilt: 6, armScale: 1.2, ikL: { w: 1, to: 'abs', dx: PC6[0] - 45, dy: PC6[1] + 5, bend: 'down' }, ikR: { w: 1, to: 'abs', dx: PC6[0] + 45, dy: PC6[1] + 5, bend: 'down' } },
    c6_mRead: { tilt: 10, armScale: 1.2, ikL: { w: 1, to: 'abs', dx: PC6[0] - 88, dy: PC6[1] + 8, bend: 'down' }, ikR: { w: 1, to: 'abs', dx: PC6[0] + 88, dy: PC6[1] + 8, bend: 'down' } },
    c6_taoHold: { armR: [14, 8], ikL: { w: 1, to: 'abs', dx: 1150, dy: 668, bend: 'down' } },
  });
  const writing = (dx0 = 22) => t => ({ ...SITB, tilt: 9, lean: 3, ikL: { w: 1, to: 'desk', dx: -40, dy: -2, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: dx0 + 9 * Math.sin(t * 7.3), dy: -6 + 3 * Math.sin(t * 11.1), bend: 'down' } });
  const typing = t => ({ ...SITB, tilt: 4, ikL: { w: 1, to: 'desk', dx: 42 + 4 * Math.sin(t * 13), dy: -8, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: 108 + 5 * Math.sin(t * 17 + 1), dy: -8 + 3 * Math.abs(Math.sin(t * 15)), bend: 'down' } });
  const explain = t => ({ lean: 2, tilt: -2 + 3 * Math.sin(t * 6), armL: [30 + 20 * Math.sin(t * 4.3), 30 + 30 * Math.sin(t * 6.1 + 1)], armR: [60 + 30 * Math.sin(t * 5.2 + 0.5), 20 + 35 * Math.sin(t * 7.3)] });
  const explainFace = t => (Math.sin(t * 9) > 0 ? FACE.grin : FACE.c6_talk);
  const talkFace = t => (Math.sin(t * 8.5) > 0 ? FACE.smile : FACE.c6_talk);
  const m1Talk = t => ({ tilt: 2 * Math.sin(t * 6), armL: [16, 10], armR: [62 + 18 * Math.sin(t * 5), 48 + 24 * Math.sin(t * 7)] });
  const m3Talk = t => ({ tilt: -2 * Math.sin(t * 6), armR: [16, 10], armL: [62 + 18 * Math.sin(t * 5.4 + 1), 48 + 24 * Math.sin(t * 6.6)] });
  const listen = list => t => ({ tilt: nodTilt(t, list, 9) });
  // the advisor walks to the cabinet and back (his position also places the paper he carries)
  const SPOS = [[0, [1010, FL]], [T.walk0, [1205, FL], T.walk1 - T.walk0, 'lin'], [T.back0, [800, FL], T.back1 - T.back0, 'lin'], [T.c6 + OUT, OFF, 0]];
  const sX = t => evalTrack(SPOS, t)[0];
  const sListen = t => ({ tilt: -2 + nodTilt(t, T.nodS, 8), armL: [14, 8], armR: [14, 8] });
  const sWalk = t => ({ ...makeWalk(T.walk0, T.walk1, 5.2)(t), ikR: { w: 0, to: 'abs', dx: HANDLE(T.walk1 + 0.3)[0], dy: HANDLE(T.walk1 + 0.3)[1], bend: 'down' } });
  const sReach = t => { const h = HANDLE(t); return { lean: 6, tilt: 3, armL: [14, 8], ikR: { w: 1, to: 'abs', dx: h[0], dy: h[1], bend: 'down' } }; };
  const sCarry = t => ({ ...makeWalk(T.back0, T.back1, 5.2)(t), ikL: { w: 1, to: 'abs', dx: sX(t) - 32, dy: 640, bend: 'down' }, ikR: { w: 1, to: 'abs', dx: sX(t) - 32, dy: 640, bend: 'down' } });
  const gradHold = t => {
    const u = (t - T.hop) / 0.42, h = u > 0 && u < 1 ? -42 * Math.sin(Math.PI * u) : 0, tuck = u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
    return { hop: h, armScale: 1.25, legL: [7 + 16 * tuck, -40 * tuck], legR: [7 + 16 * tuck, -40 * tuck],
      ikL: { w: 1, to: 'abs', dx: 800 - DIP.w / 2 - 12, dy: 648 + h, bend: 'down' }, ikR: { w: 1, to: 'abs', dx: 800 + DIP.w / 2 + 12, dy: 648 + h, bend: 'down' } };
  };

  defineScene({
    id: 'change', chapter: '从那以后', dur: DUR, floor: FL,
    cast: {
      terry: { ...E6.teen },                                  // L1：走上来
      tCls: { ...E6.teen, desk: [CLS.x, CLS.top] },           // ① 教室
      tLib: { ...E6.teen },                                   // ② 图书馆
      mate1: { ...E6.mate1 }, tTalk: { ...E6.teen }, mate3: { ...E6.mate3 },   // ③ 同学
      tPc: { ...E6.teen, desk: [760, PCD.top] },              // ④ 电脑房
      tDesk: { ...E6.teen, desk: [DK.x, DK.top] },            // ⑤ 书桌
      tMeet: { ...E6.teen }, stein: { ...E6.stein },          // ⑥ 每周见面
      tCard: { ...E6.teen },                                  // ⑦ 第一道题
      tGrad: { ...E6.teen },                                  // ⑧ 博士
      tao: { ...E6.taoAdult },                                // ⑨ 长大后回头看
    },
    order: ['terry', 'tCls', 'tLib', 'mate1', 'tTalk', 'mate3', 'tPc', 'tDesk', 'stein', 'tMeet', 'tCard', 'tGrad', 'tao'],
    tracks: {
      terry: {
        enter: T.w0,
        pos: [[0, [-110, FL]], [T.w0, [800, FL], T.w1 - T.w0, 'lin'], [T.c0 + OUT, OFF, 0]],
        pose: [[0, makeWalk(T.w0, T.w1, 5.2)], [T.w1, 'stand', 0.12], [T.nod, t => ({ ...POSE.c6_fist, tilt: -3 + nodTilt(t, [T.nod + 0.12], 10) }), 0.12, 'back']],
        face: [[0, 'smile'], [T.nod - 0.1, 'focus', 0.08]],
        turn: [[0, 0.45], [T.w1, 0.05, 0.15]],
        gaze: [[0, [1600, 500]], [T.w1, 'viewer']],
        squash: [[0, 1], [T.nod, 1.06, 0.05], [T.nod + 0.05, 1, 0.22, 'back']],
      },
      tCls: {
        enter: T.clsIn,
        pos: [[0, [CLS.x, SEAT]], [T.c1 + OUT, OFF, 0]],
        pose: [[0, writing(40)]],
        face: [[0, 'focus']],
        turn: [[0, -0.4]],
        gaze: [[0, 'board'], [3.75, 'note'], [4.3, 'board']],
      },
      tLib: {
        enter: T.libIn,
        pos: [[0, [930, FL]], [T.c2 + OUT, OFF, 0]],
        pose: [[0, 'c6_books']],
        face: [[0, 'focus'], [T.flip + 0.2, { ...FACE.focus, mouth: 'smile', mw: 0.24 }, 0.08]],
        turn: [[0, 0.1]],
        gaze: [[0, 'book']],
      },
      mate1: {
        enter: T.talk,
        pos: [[0, [470, FL]], [T.c3 + OUT, OFF, 0]],
        pose: [[0, 'stand'], [T.sp1, m1Talk, 0.12], [T.sw, 'stand', 0.15]],
        face: [[0, 'smile'], [T.sp1, talkFace, 0.05], [T.sw, 'smile', 0.08]],
        turn: [[0, 0.35]],
        gaze: [[0, 'tTalk'], [T.sp3, 'mate3']],
      },
      tTalk: {
        enter: T.talk + 0.08,
        pos: [[0, [800, FL]], [T.c3 + OUT, OFF, 0]],
        pose: [[0, listen(T.nods)]],
        face: [[0, 'smile'], [T.sp1 + 0.2, 'focus', 0.08], [T.nods[0], 'smile', 0.08], [T.sw, 'focus', 0.08], [T.nods[2], 'smile', 0.08]],
        turn: [[0, -0.3], [T.sw, 0.3, 0.15]],
        gaze: [[0, 'mate1'], [T.sw, 'mate3']],
      },
      mate3: {
        enter: T.talk + 0.04,
        pos: [[0, [1130, FL]], [T.c3 + OUT, OFF, 0]],
        pose: [[0, 'stand'], [T.sp3, m3Talk, 0.12], [T.sp3e, 'stand', 0.15]],
        face: [[0, 'smile'], [T.sp3, talkFace, 0.05], [T.sp3e, 'smile', 0.08]],
        turn: [[0, -0.35]],
        gaze: [[0, 'tTalk']],
      },
      tPc: {
        enter: T.pcIn,
        pos: [[0, [760, SEAT]], [T.c4 + OUT, OFF, 0]],
        pose: [[0, typing], [T.reach, 'c6_pcReach', 0.15, 'back'], [T.off + 0.25, 'c6_pcRest', 0.2], [T.off + 0.75, t => ({ ...POSE.c6_pcRest, tilt: nodTilt(t, [T.off + 0.75], 8) }), 0.05]],
        face: [[0, 'grin'], [T.reach - 0.12, 'focus', 0.08], [T.off + 0.35, 'smile', 0.1]],
        turn: [[0, 0.4], [T.off + 0.4, 0.1, 0.15]],
        gaze: [[0, 'screen'], [T.reach - 0.12, 'btn'], [T.off + 0.4, 'viewer']],
      },
      tDesk: {
        enter: T.deskIn,
        pos: [[0, [DK.x, SEAT]], [T.c5 + OUT, OFF, 0]],
        pose: [[0, writing(22)]],
        face: [[0, 'focus']],
        turn: [[0, 0.1]],
        gaze: [[0, 'sheet']],
        squash: [[0, 1], ...PAGES.flatMap(p => [[p, 0.98, 0.05], [p + 0.05, 1, 0.15]])],
      },
      stein: {
        enter: T.stIn,
        pos: SPOS,
        pose: [[0, sListen], [T.think, 'c6_sPonder', 0.2, 'back'], [T.thinkEnd, sListen, 0.15], [T.walk0, sWalk, 0.1], [T.walk1, sReach, 0.18],
          [T.pick - 0.15, 'c6_sIn', 0.15], [T.pick + 0.1, 'c6_sLift', 0.2], [T.back0, sCarry, 0.15], [T.give, 'c6_sGive', 0.25], [T.take + 0.15, { tilt: 4, armL: [14, 8], armR: [14, 8] }, 0.25]],
        face: [[0, 'smile'], [T.think, 'c6_ponder', 0.08], [T.thinkEnd, 'idea', 0.06], [T.walk0 + 0.3, 'focus', 0.1], [T.pick, 'idea', 0.06], [T.back0 + 0.2, 'smile', 0.1]],
        turn: [[0, -0.35], [T.walk0, 0.45, 0.12], [T.back0, -0.45, 0.12], [T.take + 0.2, -0.3, 0.15]],
        gaze: [[0, 'tMeet'], [T.walk0, 'cab'], [T.back0, 'tMeet']],
      },
      tMeet: {
        enter: T.wk0,
        pos: [[0, [-140, FL]], [T.wk0, [600, FL], T.wk1 - T.wk0, 'lin'], [T.c6 + OUT, OFF, 0]],
        pose: [[0, makeWalk(T.wk0, T.wk1, 5.2)], [T.wk1, 'stand', 0.12], [T.ex0, explain, 0.12], [T.ex1, { tilt: -3, armL: [16, 10], armR: [16, 10] }, 0.18],
          [T.give + 0.05, 'c6_mReach', 0.25], [T.take + 0.1, 'c6_mHold', 0.25], [T.open, 'c6_mRead', 0.2, 'back']],
        face: [[0, 'smile'], [T.ex0, explainFace, 0.05], [T.ex1, 'focus', 0.08], [T.take, 'surprised', 0.06], [T.take + 0.35, 'smile', 0.08], [T.open, 'focus', 0.08]],
        turn: [[0, 0.45], [T.wk1, 0.35, 0.12]],
        gaze: [[0, [1600, 520]], [T.wk1, 'stein'], [T.walk0, 'cab'], [T.back0 + 0.2, 'stein'], [T.give, 'paperT'], [T.open, 'paperT']],
        squash: [[0, 1], [T.take, 1.05, 0.05], [T.take + 0.05, 1, 0.2, 'back']],
      },
      tCard: {
        enter: T.teen7,
        pos: [[0, [140, FL]], [T.c7 + OUT, OFF, 0]],
        pose: [[0, 'stand'], [T.scratch, 'scratchStand', 0.12, 'back'], [T.arr0, 'stand', 0.2]],
        face: [[0, 'neutral'], [T.scratch, 'puzzled', 0.08], [T.arr0, 'focus', 0.1], [T.check, 'surprised', 0.06], [T.check + 0.5, 'smile', 0.1]],
        turn: [[0, 0.4]],
        gaze: [[0, 'card'], [T.arr0, 'tip'], [T.check + 0.5, 'viewer']],
        squash: [[0, 1], [T.check, 1.06, 0.05], [T.check + 0.05, 1, 0.22, 'back']],
      },
      tGrad: {
        enter: T.grad,
        pos: [[0, [800, FL]], [T.c8 + OUT, OFF, 0]],
        pose: [[0, gradHold]],
        face: [[0, 'smile'], [T.hop, 'joy', 0.06], [T.hop + 1.3, 'proudGrin', 0.1]],
        turn: [[0, 0]],
        gaze: [[0, 'viewer']],
        squash: [[0, 1], [T.hop - 0.08, 0.92, 0.06], [T.hop, 1.05, 0.08], [T.hop + 0.42, 0.93, 0.04], [T.hop + 0.46, 1, 0.2, 'back']],
      },
      tao: {
        enter: T.tao,
        pos: [[0, [1200, FL]], [T.end + 0.35, OFF, 0]],
        pose: [[0, 'c6_taoHold'], [T.pulse, { ...POSE.c6_taoHold, ikL: { w: 1, to: 'abs', dx: 1146, dy: 650, bend: 'down' } }, 0.15], [T.pulse + 0.6, 'c6_taoHold', 0.2]],
        face: [[0, 'smile'], [T.quote, { ...FACE.smile, brow: 'arc', browY: 0.03 }, 0.1]],
        turn: [[0, 0.35], [T.look, -0.45, 0.15]],
        gaze: [[0, [1600, 470]], [T.look, 'door'], [T.pulse, 'essay'], [T.pulse + 0.9, 'door']],
      },
    },
    targets: F => ({
      board: [470, 300], note: [1110, 585], book: [STK.x, 592], screen: [1060, 445], btn: BTN, sheet: DK.sheet,
      cab: [1340, 520], paperT: paperCenter(F.t, F) || HAND, card: [CD.x, CD.y], tip: [tipX(F.t), AR.y], door: [DOOR.x, 430], essay: [1146, 640],
    }),
    set: [
      { type: 'floor', t0: 0.3, t1: T.end + 0.32 },
      { type: 'board', ...BD, t0: T.cls, t1: T.p1 + 0.28 },
      { type: 'stool', x: CLS.x, seat: SEAT + 6, t0: T.cls, t1: T.p1 + 0.28 },
      { type: 'desk', x: CLS.x, top: CLS.top, w: 300, t0: T.cls, t1: T.p1 + 0.28 },
      { type: 'stool', x: 760, seat: SEAT + 6, t0: T.pc, t1: T.p4 + 0.28 },
      { type: 'desk', x: PCD.x, top: PCD.top, w: 560, t0: T.pc, t1: T.p4 + 0.28 },
      { type: 'stool', x: DK.x, seat: SEAT + 6, t0: T.desk, t1: T.p5 + 0.28 },
      { type: 'desk', x: DK.x, top: DK.top, w: 460, t0: T.desk, t1: T.p5 + 0.28 },
      { type: 'door', ...DOOR, t0: T.door, t1: T.end + 0.32 },
    ],
    fx: [
      // the age stamp: 18 straight into the corner; 20 when he gets his PhD; gone before the cut
      { type: 'ageStamp', age: 18, t0: T.s18, ...E6.STAMP, center: E6.STAMP.dock, dockT: -99, t1: T.s18out, key: 'c6s18' },
      { type: 'ageStamp', age: 20, t0: T.s20, ...E6.STAMP, center: E6.STAMP.dock, dockT: -99, t1: T.s20out, key: 'c6s20' },
      // L1
      { type: 'title', id: 'c6Hd', text: '从那以后', x: 800, y: 250, size: 76, color: 'red', rot: -2, underline: true, t0: T.hd, t1: T.c0 + 0.3 },
      // L2–L4：四格快切
      { type: 'c6_cls', id: 'c6cls' },
      { type: 'c6_lib', id: 'c6lib' },
      { type: 'c6_spk', id: 'c6spk1', char: 'mate1', dir: 1, t0: T.sp1, t1: T.sw },
      { type: 'c6_spk', id: 'c6spk3', char: 'mate3', dir: -1, t0: T.sp3, t1: T.sp3e },
      { type: 'c6_pc', id: 'c6pc' },
      { type: 'label', id: 'c6lbPc', text: '少打了', at: [990, 236], rot: -4, size: 52, t0: T.lbPc, t1: T.p4 + 0.3, target: [1050, 380], bend: -0.2, gap: 10 },
      // L5
      { type: 'c6_dk', id: 'c6dk' },
      { type: 'label', id: 'c6lbProb', text: '导师给的题', at: [470, 470], rot: -3, size: 46, t0: T.lbProb, t1: T.p5 + 0.3, target: [612, 566], bend: 0.2, gap: 10 },
      // L6–L8
      { type: 'c6_cal', id: 'c6cal' },
      { type: 'c6_cab', id: 'c6cab' },
      { type: 'thought', id: 'c6th', at: [1150, 300], rx: 82, ry: 52, t0: T.think + 0.05, t1: T.thinkEnd, from: { char: 'stein', part: 'headTop' } },
      { type: 'c6_dd', id: 'c6dd' },
      { type: 'c6_pp', id: 'c6pp' },
      // L9–L10
      { type: 'c6_cd', id: 'c6cd' },
      { type: 'label', id: 'c6lbYr', text: '有的题，要很多年', at: [900, 655], rot: -2, size: 50, t0: T.lbYr, t1: T.p7 + 0.3 },
      // L11
      { type: 'c6_gr', id: 'c6gr' },
      // L12–L13
      { type: 'c6_dr', id: 'c6dr' },
      { type: 'c6_es', id: 'c6es' },
      { type: 'c6_qt', id: 'c6qt' },
      { type: 'title', id: 'c6note', text: '（他 2019 年写的）', x: 760, y: 440, size: 38, color: 'red', rot: -1, t0: T.note, t1: T.end + 0.3 },
      // eased exits (keep last: they fade what was drawn before them)
      { type: 'c6_fade', t0: T.c0, keys: ['terry.', 'c6Hd'] },
      { type: 'c6_fade', t0: T.c1, keys: ['tCls.'] },
      { type: 'c6_fade', t0: T.p1, keys: ['board', 'desk' + CLS.x, 'stool' + CLS.x, 'c6cls'] },
      { type: 'c6_fade', t0: T.c2, keys: ['tLib.', 'c6libS'] },
      { type: 'c6_fade', t0: T.p2, keys: ['c6lib.'] },
      { type: 'c6_fade', t0: T.c3, keys: ['mate1.', 'tTalk.', 'mate3.'] },
      { type: 'c6_fade', t0: T.c4, keys: ['tPc.'] },
      { type: 'c6_fade', t0: T.p4, keys: ['desk' + PCD.x, 'stool760', 'c6pc', 'c6lbPc'] },
      { type: 'c6_fade', t0: T.c5, keys: ['tDesk.'] },
      { type: 'c6_fade', t0: T.p5, keys: ['desk' + DK.x, 'stool' + DK.x, 'c6dk', 'c6lbProb'] },
      { type: 'c6_fade', t0: T.thinkEnd - 0.2, d: 0.2, keys: ['c6th', 'c6dd.th'] },
      { type: 'c6_fade', t0: T.c6, keys: ['tMeet.', 'stein.', 'c6pp'] },
      { type: 'c6_fade', t0: T.p6, keys: ['c6cal', 'c6cab'] },
      { type: 'c6_fade', t0: T.c7, keys: ['tCard.'] },
      { type: 'c6_fade', t0: T.p7, keys: ['c6cd', 'c6lbYr'] },
      { type: 'c6_fade', t0: T.c8, keys: ['tGrad.', 'c6gr'] },
      { type: 'c6_fade', t0: T.end, d: 0.3, keys: ['tao.', 'door', 'c6dr', 'c6es', 'c6qt', 'c6note', 'floor'] },
    ],
    sfx: [[T.nod, 'plip'], [T.cls + 0.05, 'pop'], [T.lib + 0.05, 'pop'], [T.talk, 'pop'], [T.talk + 0.08, 'pop'], ...T.nods.map(n => [n, 'plip']),
      [T.pc + 0.05, 'pop'], [T.desk + 0.1, 'pop'], [T.stIn, 'pop'], ...T.nodS.map(n => [n, 'plip']), [T.think, 'boop'], [T.thinkEnd, 'ding'],
      [T.teen7, 'pop'], [T.scratch, 'boop'], [T.grad + 0.05, 'pop'], [T.hop + 0.42, 'thud'], [T.tao, 'pop'], [T.look, 'whip']],
    steps: [{ t0: T.w0, t1: T.w1, hz: 5.2 }, { t0: T.wk0, t1: T.wk1, hz: 5.2 }, { t0: T.walk0, t1: T.walk1, hz: 5.2 }, { t0: T.back0, t1: T.back1, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 3.1, text: '从那以后，他变了：' },
      { t0: 3.4, t1: 6.4, text: '认真上课，认真读书；' },
      { t0: 6.7, t1: 10.1, text: '多听听同学和老师怎么说；' },
      { t0: 10.2, t1: 12.8, text: '游戏，也少打了。' },
      { t0: 13.5, t1: 17.3, text: '导师给的题，他做得特别用功。' },
      { t0: 17.8, t1: 21.4, text: '每个星期，他去见斯坦老师。' },
      { t0: 21.5, t1: 24.7, text: '老师耐心听完，想一想，' },
      { t0: 24.8, t1: 28.8, text: '就从柜子里抽出一篇论文递给他。' },
      { t0: 29.7, t1: 32.7, text: '导师给他的第一道题，' },
      { t0: 32.8, t1: 37.0, text: '他直到博士毕业五年后，才解出来。' },
      { t0: 38.0, t1: 42.8, text: '1996年，他二十岁，拿到了博士学位。', say: '一九九六年，他二十岁，拿到了博士学位。' },
      { t0: 43.5, t1: 46.1, text: '回头看，他写道：' },
      { t0: 46.4, t1: 51.0, text: '“差点没通过，可能是当时最好的事。”' },
    ],
  });
})();
