// 第 5 集 · 第 30 场 · 1988 堪培拉（id canberra）
// 事实（ep5-script.md）：1988 年 IMO 在澳大利亚堪培拉，第一次来到大洋洲；考试 7 月 15、16 日，次日（7 月 17 日）他满 13 岁。
//   爱尔兰队的领队和副领队批改澳大利亚队的第四题，2018 年写道：“Tao's solution of Problem 4 was a model of clarity, rigour and
//   elegance, and left an indelible mark on both of us”。
// 演绎：澳大利亚轮廓是简笔示意；两位阅卷老师互相点头、举着卡片是画面上的演绎；答卷上的线条只是示意（不是他的真实解答）。
//   回忆框里 7 岁的小陶（只写答案、不爱写过程）呼应前几集；“30 年”标在证明页上（让人记了 30 年），不标在箭头上，免得看成“7 岁到 12 岁隔了 30 年”。
// 开场：12 岁印章已停靠。结尾：只留下 1988 年的成绩单（E5.SHEET，只有第 4 格写了 7），交给第 35 场。
(() => {
  const FL = 780, SH = E5.SHEET;
  /* ---------------- times (scene clock) ---------------- */
  const Y88 = 0.4, MAP_IN = 1.6, LB_OCE = 3.2, SHRINK = 5.2, AUS = 5.45, ARR = 7.4, PIN = 7.15, MAP_OUT = 8.95;
  const CAL_IN = 9.1, FLIP = 11.15, CAKE = 12.2, N13 = 12.5, JOY = 12.6, ZIP = 14.3, CAL_OUT = 14.5;
  const SHEET = 15.2, W4 = 15.8, MK_IN = 16.4, NOD1 = 17.9, NOD2 = 18.25, RING4 = 18.6, ANS_OUT = 19.9, APART = 20.05;
  const Y30 = 20.3, CARD = 20.9, WORDS = [24.5, 25.25, 26.0], BAND = 26.55, FORGET = 27.5, SRC = 28.7, D_OUT = 30.75;
  const MEM = 31.5, KID = 31.75, PAPER = 32.15, PROOF = 36.0, ARROW = 36.15, LINES0 = 36.3, LB30 = 38.4;
  const END = 39.7, DUR = 40.3;
  const fadeEnd = t => 1 - clamp((t - END) / 0.45);

  /* ---------------- little helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const fadeFrom = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); } };
  function glyphs(k, str, x, y, size, o = {}) {
    let gx = x;
    [...str].forEach((ch, i) => {
      const g = GLYPH[ch]; if (!g) return;
      g.s.forEach((s, j) => stroke(`${k}.${i}.${j}`, s.map(([u, v, c]) => [gx + u * size, y + v * size, c]), { z: o.z ?? Z.set + 1, w: o.w || 3, color: o.color || C.ink, opacity: o.opacity, draw: o.draw, boil: 0.5 }));
      gx += (g.w + 0.1) * size;
    });
    return gx - x;
  }
  COMP.c5_cFade = {
    init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const k = 1 - clamp((t - fx.f0) / (fx.fd || 0.4)); if (k <= 0) return;
      const n0 = DL.items.length;
      COMP[fx.inner.type].draw(fx.inner, t, F);
      fadeFrom(n0, k);
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };

  /* ---------------- 澳大利亚：简笔轮廓 + 海浪，说到“堪培拉”时缩到上方、插一个图钉 ---------------- */
  const proj = (lon, lat) => [(lon - 133.5) * 0.9 * 13, (-lat - 26.5) * 13];
  const MAINLAND = [[142.5, -10.7], [143.6, -13.6], [145.4, -14.9], [146.3, -19.0], [149.2, -21.5], [151.0, -23.6], [153.0, -25.2], [153.6, -28.6],
    [153.0, -31.0], [151.3, -33.9], [150.1, -36.8], [149.9, -37.6], [147.8, -37.9], [146.4, -39.1], [144.9, -38.2], [143.0, -38.8], [141.0, -38.0],
    [139.7, -37.1], [139.3, -35.6], [138.6, -34.9], [138.1, -34.0], [137.8, -33.0], [137.4, -34.3], [136.0, -35.0], [135.6, -34.7], [135.3, -33.2],
    [134.2, -32.8], [131.0, -31.5], [128.5, -31.7], [126.0, -32.2], [123.6, -33.9], [119.9, -34.0], [117.9, -35.1], [115.0, -34.3], [115.7, -31.8],
    [114.9, -29.5], [114.0, -27.0], [113.4, -25.5], [113.7, -22.5], [114.6, -21.8], [116.8, -20.6], [121.0, -19.5], [122.2, -17.9], [123.6, -16.4],
    [125.5, -14.5], [127.8, -14.0], [129.4, -15.0], [130.2, -13.0], [130.8, -12.4], [132.5, -11.6], [135.0, -12.2], [136.8, -12.3], [135.9, -13.7],
    [135.4, -15.0], [137.5, -16.3], [139.4, -17.4], [140.8, -17.5], [141.6, -15.0], [141.6, -12.6]].map(([a, b]) => proj(a, b));
  const TAS = [[144.6, -40.7], [146.5, -41.1], [148.3, -40.9], [148.0, -42.9], [146.9, -43.6], [145.2, -42.2]].map(([a, b]) => proj(a, b));
  const CBR = proj(149.13, -35.28);
  const WAVES = [[-330, -70], [-345, 110], [-250, 250], [320, -150], [345, 60], [250, 255], [-60, 275]];
  const mapPose = t => {   // centre + scale of the map
    const u = EASE.io(clamp((t - SHRINK) / 0.45));
    return { c: lerp2([800, 470], [800, 215], u), s: lerp(1, 0.52, u) };
  };
  COMP.c5_cMap = {
    draw(fx, t, F) {
      if (t < MAP_IN || t >= MAP_OUT + 0.3) return;
      const k = 'c5cMap', z = Z.set + 1, { c, s } = mapPose(t), p = EASE.out(clamp((t - MAP_IN) / 0.8)), n0 = DL.items.length;
      DL.save(); DL.translate(c[0], c[1]); DL.scale(s);
      stroke(k + '.au', MAINLAND, { z, w: 5 / Math.sqrt(s), closed: true, fill: C.paper, draw: p, boil: 0.7 });
      stroke(k + '.tas', TAS, { z, w: 4.5 / Math.sqrt(s), closed: true, fill: C.paper, draw: clamp(p * 1.4 - 0.4), boil: 0.7 });
      WAVES.forEach(([x, y], i) => {
        const q = clamp((t - MAP_IN - 0.5 - i * 0.06) / 0.25); if (q <= 0) return;
        const pts = []; for (let j = 0; j <= 6; j++) pts.push([x - 36 + j * 12, y + (j % 2 ? -7 : 5)]);
        stroke(k + '.wv' + i, pts, { z, w: 3 / Math.sqrt(s), draw: q, boil: 0.8 });
      });
      DL.restore();
      F.targets.cbr = [c[0] + CBR[0] * s, c[1] + CBR[1] * s];
      // "澳大利亚" once it says so (drawn at full size, outside the map's scale)
      const aq = clamp((t - AUS) / 0.2);
      if (aq > 0) text(k + '.nm', '澳大利亚', c[0] - 10, c[1] - 20, { size: 40, z: z + 0.3, opacity: aq, scale: lerp(0.6, 1, EASE.back(aq)) });
      // the pin drops on Canberra
      const pq = clamp((t - PIN) / 0.3);
      if (pq > 0) {
        const b = [c[0] + CBR[0] * s, c[1] + CBR[1] * s], drop = (1 - EASE.out(pq)) * -70, hd = [b[0] + 10, b[1] - 34 + drop];
        stroke(k + '.needle', [[b[0], b[1]], hd], { z: z + 0.4, w: 3.5 });
        stroke(k + '.head', ringPts(k + '.head', hd[0], hd[1], 13, 13, { n: 10, closed: true }), { z: z + 0.5, w: 4, closed: true, fill: C.paper });
        dot(k + '.hd', [hd[0] - 3, hd[1] - 3], 3.5, C.ink, z + 0.6);
        if (pq >= 1) stroke(k + '.dent', ringPts(k + '.dent', b[0], b[1] + 2, 9, 4, { n: 8, closed: true }), { z: z + 0.3, w: 2.4 });
        const tq = clamp((t - PIN - 0.25) / 0.2);
        if (tq > 0) text(k + '.cbr', '堪培拉', b[0] + 36, b[1] - 34, { size: 44, anchor: 'start', z: z + 0.5, opacity: tq, scale: lerp(0.6, 1, EASE.back(tq)) });
      }
      fadeFrom(n0, 1 - clamp((t - MAP_OUT) / 0.3));
    },
    cues: () => [[MAP_IN, 'pen'], [SHRINK, 'whoosh'], [AUS, 'pop'], [PIN + 0.28, 'tap'], [PIN + 0.3, 'pop']],
  };

  /* ---------------- 日历：7 月 15、16 日考试 → 翻到 17 日：一个小蛋糕和 13 ---------------- */
  const CAL = { x: 800, y: 110, w: 270, h: 235, band: 58 };
  const D15 = layoutWriting({ text: '15', x: 0, y: 0, size: 78, t0: -9, speed: 1, anchor: 'middle' });
  const D16 = layoutWriting({ text: '16', x: 0, y: 0, size: 78, t0: -9, speed: 1, anchor: 'middle' });
  const D17 = layoutWriting({ text: '17', x: 0, y: 0, size: 100, t0: -9, speed: 1, anchor: 'middle' });
  const N13L = layoutWriting({ text: '13', x: 0, y: 0, size: 46, t0: N13, speed: 1500, anchor: 'middle' });
  const drawL = (k, L, x, y, z, o = {}) => { DL.save(); DL.translate(x, y); L.strokes.forEach((s, j) => { const q = o.t === undefined ? 1 : clamp((o.t - s.t0) / s.dur); if (q > 0) stroke(k + j, s.pts, { z, w: o.w || 7, boil: 0.5, opacity: o.op, draw: q < 1 ? q : undefined, color: o.color }); }); DL.restore(); };
  const page1 = (k, z, op) => {
    const top = CAL.y + CAL.band + 18;
    drawL(k + '.a', D15, CAL.x - 62, top, z, { op });
    drawL(k + '.b', D16, CAL.x + 62, top, z, { op });
    text(k + '.ex', '考试', CAL.x, top + 128, { size: 46, z, opacity: op });
  };
  COMP.c5_cCal = {
    draw(fx, t) {
      if (t < CAL_IN || t >= CAL_OUT + 0.3) return;
      const { x, y, w, h, band } = CAL, z = Z.set + 1, k = 'c5cCal', p = EASE.out(clamp((t - CAL_IN) / 0.35)), n0 = DL.items.length;
      stroke(k + '.str', [[x - 64, y + 2], [x, y - 36, 1], [x + 64, y + 2]], { z, w: 2.4, color: C.pencil, draw: p });
      dot(k + '.nail', [x, y - 36], 4.5, C.ink, z);
      stroke(k + '.pg', box(x - w / 2, y, x + w / 2, y + h), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.sh', [[x - w / 2 + 12, y + h + 8], [x + w / 2 + 8, y + h + 8, 1], [x + w / 2 + 8, y + 12]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      stroke(k + '.band', [[x - w / 2, y + band], [x + w / 2, y + band + 1]], { z: z + 0.1, w: 4, draw: p });
      const q = clamp((t - CAL_IN - 0.2) / 0.2);
      if (q > 0) text(k + '.m', '7 月', x, y + band / 2 + 2, { size: 44, z: z + 0.2, opacity: q });
      if (t < FLIP && q > 0) page1(k + '.p1', z + 0.2, q);
      if (t >= FLIP) {   // the 17th: the number, a little cake, and 13 on it
        const top = y + band + 22;
        drawL(k + '.d17', D17, x - 62, top, z + 0.2);
        const cp = EASE.out(clamp((t - CAKE) / 0.35)), cx = x + 66, cb = y + h - 22;
        if (cp > 0) {
          stroke(k + '.ck1', box(cx - 46, cb - 44, cx + 46, cb), { z: z + 0.2, w: 4.5, fill: C.paper, draw: cp });
          stroke(k + '.ck2', box(cx - 32, cb - 78, cx + 32, cb - 44), { z: z + 0.25, w: 4.5, fill: C.paper, draw: cp });
          stroke(k + '.icing', [[cx - 46, cb - 30], [cx - 32, cb - 22], [cx - 16, cb - 31], [cx, cb - 22], [cx + 16, cb - 31], [cx + 32, cb - 22], [cx + 46, cb - 30]], { z: z + 0.3, w: 3, draw: cp });
          [-12, 12].forEach((dx, i) => {
            stroke(k + '.cd' + i, [[cx + dx, cb - 78], [cx + dx, cb - 100]], { z: z + 0.3, w: 4, draw: cp });
            const fl = cp >= 1 ? Math.sin(t * 13 + i * 2) * 1.5 : 0;
            if (cp >= 1) stroke(k + '.fl' + i, [[cx + dx, cb - 103], [cx + dx - 5 + fl, cb - 112], [cx + dx, cb - 124], [cx + dx + 5 + fl, cb - 112], [cx + dx, cb - 103]], { z: z + 0.3, w: 2.6, closed: true, fill: C.paper });
          });
          drawL(k + '.n13', N13L, cx, cb - 41 - 2, z + 0.4, { t, w: 4.5 });
        }
      }
      // the 15–16 page tears off at its top-left corner, swings, drops and fades
      const u = (t - FLIP) / 0.55;
      if (u >= 0 && u < 1) {
        const sw = EASE.out(clamp(u / 0.25)), fall = EASE.in(clamp((u - 0.1) / 0.9)), op = 1 - clamp((u - 0.6) / 0.35), z2 = z + 0.6;
        DL.save(); DL.translate(x - w / 2 + 30 * fall, y + band + 320 * fall); DL.rotate(16 * sw + 36 * fall); DL.translate(-(x - w / 2), -(y + band));
        stroke(k + '.old', box(x - w / 2, y + band, x + w / 2, y + h), { z: z2, w: 5, fill: C.paper, opacity: op });
        page1(k + '.oldP', z2 + 0.1, op);
        DL.restore();
      }
      [-1, 1].forEach(s => stroke(k + '.rg' + s, ringPts(k + '.rg' + s, x + s * 64, y, 10, 15, { n: 8, a0: 100, sweep: 300 }), { z: z + 0.7, w: 4, draw: p }));
      fadeFrom(n0, 1 - clamp((t - CAL_OUT) / 0.3));
    },
    cues: () => [[CAL_IN, 'paper'], [FLIP, 'paper'], [FLIP + 0.15, 'whoosh'], [CAKE, 'pop'], [N13, 'pen']],
  };

  /* ---------------- 第四题：两位阅卷老师一起看的一页答卷 ---------------- */
  const ANS = { c: [800, 575], w: 200, h: 250 };
  COMP.c5_cAns = {
    draw(fx, t) {
      const t0 = MK_IN + 0.25; if (t < t0 || t >= ANS_OUT + 0.3) return;
      const k = 'c5cAns', z = Z.front + 1, [cx, cy] = ANS.c, W = ANS.w / 2, H = ANS.h / 2, n0 = DL.items.length;
      const s = EASE.back(clamp((t - t0) / 0.25));
      DL.save(); DL.about(cx, cy, () => DL.scale(Math.max(0.01, s)));
      stroke(k, box(cx - W, cy - H, cx + W, cy + H), { z, w: 4.5, fill: C.paper });
      text(k + '.hd', '第 4 题', cx, cy - H + 34, { size: 40, z: z + 0.2 });
      const h = hstr(k);
      for (let i = 0; i < 8; i++) {
        const y = cy - H + 80 + i * 20, len = (2 * W - 40) * (i === 7 ? 0.45 : 0.8 + 0.2 * (rnd(h, i, 1) * 0.5 + 0.5)), pts = [];
        for (let m = 0; m <= 14; m++) pts.push([cx - W + 20 + len * m / 14, y + (m % 2 ? -1.6 : 1.3)]);
        stroke(k + '.l' + i, pts, { z: z + 0.1, w: 2.4, boil: 0.6 });
      }
      DL.restore();
      fadeFrom(n0, 1 - clamp((t - ANS_OUT) / 0.3));
    },
    cues: () => [[MK_IN + 0.25, 'paper']],
  };

  /* ---------------- 30 年后：一张卡片 ---------------- */
  const CRD = { x0: 470, y0: 345, x1: 1130, y1: 715 };
  const WTXT = ['清楚、', '严谨、', '优美'], LINE1 = WTXT.join(''), S1 = 70, X1 = 800 - textWidth(LINE1, S1) / 2;
  COMP.c5_cCard = {
    draw(fx, t) {
      if (t < CARD || t >= D_OUT + 0.35) return;
      const k = 'c5cCard', z = Z.set + 1, { x0, y0, x1, y1 } = CRD, p = EASE.out(clamp((t - CARD) / 0.4)), n0 = DL.items.length;
      stroke(k, box(x0, y0, x1, y1), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.sh', [[x0 + 14, y1 + 9], [x1 + 9, y1 + 8, 1], [x1 + 9, y0 + 14]], { z: z - 0.1, w: 2.5, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      // the three words, each as it is said (two characters + a pause mark per word)
      let n = 0;
      WTXT.forEach((w, i) => { if (t >= WORDS[i]) n = WTXT.slice(0, i).join('').length + Math.min(w.length, Math.floor((t - WORDS[i]) * 8) + 1); });
      if (n > 0) { const s = [...LINE1].slice(0, n).join(''); text(k + '.w', s, X1, 455, { size: S1, anchor: 'start', z: z + 0.3 }); }
      fadeFrom(n0, 1 - clamp((t - D_OUT) / 0.35));
    },
    cues: () => WORDS.map(w => [w, 'pen']),
  };

  /* ---------------- 回忆框：7 岁的小陶，纸上只有“答案：…” ---------------- */
  const MEMF = { x0: 150, y0: 300, x1: 635, y1: 720 }, KIDB = [298, 704], KIDS = 0.8;
  COMP.c5_cMem = {
    draw(fx, t, F) {
      if (t < MEM || t >= DUR) return;
      const fo = fadeEnd(t); if (fo <= 0) return;
      const k = 'c5cMem', z = Z.set + 1, { x0, y0, x1, y1 } = MEMF, p = EASE.out(clamp((t - MEM) / 0.4)), n0 = DL.items.length;
      // a soft rounded frame, drawn twice (ink + pencil) like a remembered picture
      stroke(k + '.f', superPts((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0, y1 - y0, 28, 7), { z, w: 4.5, closed: true, fill: C.paper, draw: p });
      stroke(k + '.f2', superPts((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0 - 22, y1 - y0 - 22, 28, 7), { z: z + 0.05, w: 2.2, closed: true, color: C.pencil, opacity: 0.7, draw: p, boil: 0.5 });
      stroke(k + '.fl', [[x0 + 40, y1 - 16], [x1 - 40, y1 - 18]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.8 * p, boil: 0.5 });
      const lq = clamp((t - MEM - 0.3) / 0.2);
      if (lq > 0) text(k + '.age', '（7 岁）', (x0 + x1) / 2, y0 + 44, { size: 42, color: C.red, z: Z.annot, opacity: lq, halo: 8 });
      // the 7-year-old: E5.terry9, a size smaller (drawn here so the frame can scale him)
      const L = layoutChar('kid7', t, F);
      if (L) {
        DL.save(); DL.about(KIDB[0], KIDB[1], () => DL.scale(KIDS));
        drawChar(L, F);
        DL.restore();
        const a = F.anchors.kid7, tf = q => [KIDB[0] + (q[0] - KIDB[0]) * KIDS, KIDB[1] + (q[1] - KIDB[1]) * KIDS];
        for (const key in a) if (Array.isArray(a[key])) a[key] = tf(a[key]);
        a.r *= KIDS; F.targets.kid7 = a.head;
      }
      // the paper he is proud of: only an answer
      const pq = EASE.back(clamp((t - PAPER) / 0.25));
      if (pq > 0) {
        const c = [508, 548];
        DL.save(); DL.about(c[0], c[1], () => DL.scale(Math.max(0.01, pq))); DL.about(c[0], c[1], () => DL.rotate(4));
        stroke(k + '.pp', box(c[0] - 105, c[1] - 62, c[0] + 105, c[1] + 62), { z: z + 0.3, w: 4.5, fill: C.paper });
        text(k + '.ans', '答案：…', c[0], c[1] + 2, { size: 44, z: z + 0.4 });
        DL.restore();
      }
      fadeFrom(n0, fo);
    },
    cues: () => [[MEM, 'paper'], [KID, 'pop'], [PAPER, 'pop']],
  };
  /* ---------------- 一页写满过程的证明（最后一个 □） ---------------- */
  const PP = { x0: 985, y0: 290, x1: 1400, y1: 732 };
  const PLN = (() => {
    const out = [], h = hstr('c5cPf');
    for (let i = 0; i < 15; i++) {
      const y = PP.y0 + 96 + i * 22, ind = i === 0 || i === 5 || i === 10 ? 26 : 0, x0 = PP.x0 + 26 + ind;
      const len = i === 14 ? 150 : (PP.x1 - PP.x0 - 52 - ind) * (i === 4 || i === 9 ? 0.55 : 0.82 + 0.18 * (rnd(h, i, 1) * 0.5 + 0.5));
      out.push({ y, x0, len, frag: i === 2 ? '( x + y )' : i === 7 ? '→' : i === 11 ? 'x × x' : null });
    }
    return out;
  })();
  COMP.c5_cProof = {
    draw(fx, t) {
      if (t < PROOF || t >= DUR) return;
      const fo = fadeEnd(t); if (fo <= 0) return;
      const k = 'c5cPf', z = Z.set + 1, { x0, y0, x1, y1 } = PP, p = EASE.out(clamp((t - PROOF) / 0.4)), n0 = DL.items.length;
      stroke(k, box(x0, y0, x1, y1), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.sh', [[x0 + 14, y1 + 9], [x1 + 9, y1 + 8, 1], [x1 + 9, y0 + 14]], { z: z - 0.1, w: 2.5, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      const hq = clamp((t - PROOF - 0.2) / 0.2);
      if (hq > 0) text(k + '.hd', '证明', x0 + 42, y0 + 46, { size: 48, anchor: 'start', z: z + 0.2, opacity: hq });
      PLN.forEach((L, i) => {
        const q = clamp((t - LINES0 - i * 0.065) / 0.12); if (q <= 0) return;
        let x = L.x0;
        if (L.frag) x += glyphs(k + '.fr' + i, L.frag, x, L.y - 17, 24, { z: z + 0.2, w: 3, draw: q }) + 10;
        const n = Math.max(3, Math.round((L.x0 + L.len - x) / 10)), pts = [];
        for (let m = 0; m <= n; m++) pts.push([x + (L.x0 + L.len - x) * m / n, L.y + (m % 2 ? -2 : 1.6)]);
        stroke(k + '.l' + i, pts, { z: z + 0.2, w: 2.6, draw: q, boil: 0.6 });
        if (i === PLN.length - 1 && q >= 1) glyphs(k + '.qed', '□', L.x0 + L.len + 14, L.y - 22, 30, { z: z + 0.2, w: 3.5 });
      });
      fadeFrom(n0, fo);
    },
    cues: () => [[PROOF, 'paper'], ...[0, 3, 6, 9, 12].map(i => [LINES0 + i * 0.065, 'pen'])],
  };

  /** the red arrow from the memory frame to the proof page */
  COMP.c5_cArrow = {
    draw(fx, t) {
      if (t < ARROW) return;
      arrow('c5cArr', [MEMF.x1 + 14, 500], [PP.x0 - 16, 500], { p: EASE.out(clamp((t - ARROW) / 0.35)), bend: -0.25, w: 5, head: 22 });
    },
    cues: () => [[ARROW, 'swish']],
  };
  /* ---------------- cast & poses ---------------- */
  const TEAM = [['mate1', 290], ['mate2', 470], ['terry', 645], ['mate3', 820], ['mate4', 1000], ['mate5', 1180]];
  const SPEED = 650, startOf = x => ARR - (x + 120) / SPEED;
  const ZIPT = Object.fromEntries(TEAM.map(([id], i) => [id, ZIP + (TEAM.length - 1 - i) * 0.06]));   // the right-most leaves first
  const zipPose = { lean: 14, tilt: 6, armL: [40, 30], armR: [40, 30] };
  const nodPose = (base, t0) => t => { const u = clamp((t - t0) / 0.8); return { ...base, tilt: (base.tilt || 0) + 9 * Math.sin(u * Math.PI * 4) * (1 - u) }; };
  const teamTracks = (id, x) => {
    const s = startOf(x), kid = id === 'terry';
    return {
      pos: [[0, [-120, FL]], [s, [x, FL], ARR - s, 'lin'], [ZIPT[id], [x + 1500, FL], 0.35, 'in']],
      pose: [[0, makeWalk(s, ARR, 5.2, { lean: -4 })], [ARR, 'stand', 0.12], ...(kid ? [[JOY, 'kidCheer', 0.1, 'back'], [JOY + 1.1, 'stand', 0.15]] : [[JOY + 0.1, 'c5_cClap', 0.1, 'back']]), [ZIPT[id], zipPose, 0.08]],
      face: [[0, 'smile'], [JOY, kid ? 'joy' : 'grin', 0.05], [JOY + 1.2, 'smile', 0.1]],
      turn: [[0, 0.45], [ARR, 0, 0.12], ...(kid ? [] : [[JOY, x < 645 ? 0.35 : -0.35, 0.1]]), [ZIPT[id], 0.45, 0.08]],
      gaze: [[0, [1700, 420]], [ARR, 'viewer'], [PIN + 0.2, 'cbr'], [CAL_IN + 0.3, 'cal'], ...(kid ? [[JOY + 0.9, 'viewer']] : [[JOY, 'terry']]), [ZIPT[id] - 0.1, [1700, 420]]],
      squash: [[0, 1], ...(kid ? [[JOY, 0.9, 0.05], [JOY + 0.06, 1.06, 0.08], [JOY + 0.14, 1, 0.2, 'back']] : [])],
    };
  };
  const AX = 590, BX = 1010, AX2 = 380, BX2 = 1220;
  Object.assign(POSE, {
    c5_cClap: { armScale: 1.1, ikL: { w: 1, to: 'chin', dx: -0.15, dy: 0.9, bend: 'down' }, ikR: { w: 1, to: 'chin', dx: 0.15, dy: 0.9, bend: 'down' } },
    c5_cAnsA: { tilt: 4, lean: 2, armL: [14, 10], ikR: { w: 1, to: 'abs', dx: ANS.c[0] - ANS.w / 2 + 4, dy: ANS.c[1] + 10, bend: 'down' } },
    c5_cAnsB: { tilt: -4, lean: -2, armR: [14, 10], ikL: { w: 1, to: 'abs', dx: ANS.c[0] + ANS.w / 2 - 4, dy: ANS.c[1] + 10, bend: 'down' } },
    c5_cCardA: { armL: [14, 10], ikR: { w: 1, to: 'abs', dx: CRD.x0 + 4, dy: 520, bend: 'down' } },
    c5_cCardB: { armR: [14, 10], ikL: { w: 1, to: 'abs', dx: CRD.x1 - 4, dy: 520, bend: 'down' } },
  });
  const walkA = makeWalk(APART, APART + 0.7, 5.2, { lean: -4 }), walkB = makeWalk(APART, APART + 0.7, 5.2, { lean: -4 });
  const markerTracks = (side) => {
    const A = side < 0, x = A ? AX : BX, x2 = A ? AX2 : BX2, me = A ? 'A' : 'B', other = A ? 'markerB' : 'markerA', n = A ? NOD1 : NOD2;
    return {
      enter: MK_IN + (A ? 0 : 0.15),
      pos: [[0, [x, FL]], [APART, [x2, FL], 0.7, 'lin'], [D_OUT, [A ? -420 : 2020, FL], 0.35, 'in']],
      pose: [[0, 'c5_cAns' + me], [n, nodPose(POSE['c5_cAns' + me], n), 0.05], [ANS_OUT, 'stand', 0.15], [APART, A ? walkA : walkB, 0], [APART + 0.7, 'stand', 0.12],
        [CARD + 0.2, 'c5_cCard' + me, 0.2, 'back'], [D_OUT, { lean: A ? -14 : 14, tilt: A ? -6 : 6, armL: [40, 30], armR: [40, 30] }, 0.08]],
      face: [[0, 'focus'], [n, 'smile', 0.06], [Y30, 'neutral', 0.08], [CARD + 0.3, 'smile', 0.08], [WORDS[2] + 0.4, 'proud', 0.08], [FORGET + 0.2, 'smile', 0.08]],
      turn: [[0, A ? 0.3 : -0.3], [n, A ? 0.45 : -0.45, 0.1], [APART, A ? -0.45 : 0.45, 0.1], [APART + 0.7, A ? 0.35 : -0.35, 0.12], [D_OUT, A ? -0.45 : 0.45, 0.08]],
      gaze: [[0, 'ans'], [n - 0.1, other], [n + 1.0, 'ans'], [APART, A ? [-200, 450] : [1800, 450]], [APART + 0.7, 'card'], [FORGET + 0.4, 'viewer']],
      squash: [[0, 1], [n, 1.04, 0.05], [n + 0.06, 1, 0.2, 'back']],
    };
  };

  defineScene({
    id: 'canberra', chapter: '1988 堪培拉', dur: DUR, floor: FL,
    cast: {
      ...Object.fromEntries(TEAM.map(([id]) => [id, { ...E5[id] }])),
      markerA: { ...E5.markerA }, markerB: { ...E5.markerB },
      kid7: { ...E5.terry9, noShadow: true },   // drawn (a size smaller) by c5_cMem, not in `order`
    },
    order: ['mate1', 'mate2', 'mate3', 'mate4', 'mate5', 'terry', 'markerA', 'markerB'],
    tracks: {
      ...Object.fromEntries(TEAM.map(([id, x]) => [id, teamTracks(id, x)])),
      markerA: markerTracks(-1),
      markerB: markerTracks(1),
      kid7: {
        enter: KID,
        pos: [[0, KIDB]],
        pose: [[0, 'stand'], [PAPER + 0.15, 'kidPoint', 0.12, 'back']],
        face: [[0, 'smile'], [PAPER + 0.15, 'proud', 0.06]],
        turn: [[0, 0.3]],
        gaze: [[0, 'viewer'], [PAPER + 0.15, [508, 548]], [PAPER + 1.4, 'viewer']],
      },
    },
    targets: F => ({ cbr: F.targets.cbr || [895, 274], cal: [CAL.x, CAL.y + 150], ans: ANS.c, card: [800, 470] }),
    set: [{ type: 'floor', t0: 5.3, t1: D_OUT + 0.35 }],
    fx: [
      { type: 'ageStamp', age: 12, t0: -3, ...E5.STAMP, dockT: -2 },
      // L1：1988，大洋洲
      { type: 'c5_cFade', f0: SHRINK - 0.1, fd: 0.3, inner: { type: 'write', id: 'c5cY88', text: '1988', x: 800, y: 64, size: 160, anchor: 'middle', t0: Y88, speed: 2600, gap: 0.03, glyphGap: 0.06, w: 9, sfx: 'pen', z: Z.annot } },
      { type: 'c5_cMap', id: 'c5cMap' },
      { type: 'c5_cFade', f0: SHRINK - 0.15, fd: 0.25, inner: { type: 'label', id: 'c5cLbOce', text: '第一次来到大洋洲', at: [1268, 330], rot: -4, size: 48, t0: LB_OCE, t1: DUR, target: [1046, 452], bend: -0.2, gap: 14 } },
      // L3：7 月 15、16 日考试；17 日，13 岁生日
      { type: 'c5_cCal', id: 'c5cCal' },
      // L4：成绩单（只有第 4 格写 7），两位阅卷老师
      { type: 'e5_scores', id: 'c5cSc', at: SH.at, cell: SH.cell, t0: SHEET, scores: [null, null, null, [7, W4], null, null], ringT: [[3, RING4, ANS_OUT]] },
      { type: 'c5_cAns', id: 'c5cAns' },
      // L5–L7：30 年后，他们写道
      { type: 'c5_cFade', f0: D_OUT, fd: 0.35, inner: { type: 'title', id: 'c5cY30', text: '30 年后', x: 800, y: 296, size: 60, color: 'red', rot: -3, t0: Y30 } },
      { type: 'c5_cCard', id: 'c5cCard' },
      { type: 'c5_cFade', f0: D_OUT, fd: 0.35, inner: { type: 'band', id: 'c5cHi', rect: [X1, 455 - 38, textWidth(LINE1, S1), 76], t0: BAND, dur: 0.45, pad: 12 } },
      { type: 'c5_cFade', f0: D_OUT, fd: 0.35, inner: { type: 'scribe', id: 'c5cForget', text: '让我们俩一直忘不了', x: 800 - 9 * 27, y: 570, size: 54, t0: FORGET, cps: 9, z: Z.set + 2 } },
      { type: 'c5_cFade', f0: D_OUT, fd: 0.35, inner: { type: 'title', id: 'c5cSrc', text: '（爱尔兰队的两位老师，2018 年）', x: 800, y: 664, size: 38, color: 'red', t0: SRC, dur: 0.2, sfx: 'pop' } },
      // L8–L9：只写答案的小男孩 → 写满过程的证明，记了 30 年
      { type: 'c5_cMem', id: 'c5cMem' },
      { type: 'c5_cProof', id: 'c5cPf' },
      { type: 'c5_cFade', f0: END, fd: 0.45, inner: { type: 'c5_cArrow', id: 'c5cArr' } },
      { type: 'c5_cFade', f0: END, fd: 0.45, inner: { type: 'label', id: 'c5cLb30', text: '30 年', at: [1492, 410], rot: 5, size: 52, t0: LB30, t1: DUR, target: [1408, 470], bend: 0.2, gap: 10 } },
    ],
    sfx: [[MK_IN, 'pop'], [MK_IN + 0.15, 'pop'], [JOY, 'hop'], [ZIP, 'whoosh'], [NOD1, 'boop'], [D_OUT, 'whoosh']],
    steps: [{ t0: startOf(1180), t1: ARR, hz: 5.2 }, { t0: APART, t1: APART + 0.7, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 5.1, text: '1988年，国际奥数第一次来到大洋洲：', say: '一九八八年，国际奥数第一次来到大洋洲：' },
      { t0: 5.2, t1: 8.6, text: '澳大利亚的首都，堪培拉。' },
      { t0: 9.1, t1: 14.3, text: '7月16日考完，第二天就是他十三岁生日。', say: '七月十六日考完，第二天，就是他十三岁生日。' },
      { t0: 15.2, t1: 19.8, text: '第四题，有两位阅卷老师特别记住了他。' },
      { t0: 20.2, t1: 23.2, text: '三十年后，他们写道：' },
      { t0: 23.5, t1: 27.3, text: '“他的解答清楚、严谨、优美，' },
      { t0: 27.4, t1: 30.6, text: '让我们俩一直忘不了。”' },
      { t0: 31.5, t1: 35.9, text: '那个只写答案、不爱写过程的小男孩，' },
      { t0: 36.0, t1: 39.8, text: '写出的证明，让人记了三十年。' },
    ],
  });
})();
