// 第 15 场 · 两个星期 vs 好几个月（17→18 岁，1993）
// 事实（ep6-script.md，《A Close Call》）：同学们为资格口试准备好几个月：把课本从头读到尾、组学习小组、互相模拟考试；
//   还演小品，演一个“death committee”（三位特别严厉的教授）。他自己：“I went to the classes that I enjoyed, dropped out of the ones
//   I did not … spent an embarrassingly large fraction of my early graduate years messing around online … or playing computer games
//   until late at night at the graduate dormitory computer room.” “I probably only did about two weeks' worth of preparation for the
//   generals, while my fellow classmates had devoted months. Nevertheless, I felt quite confident going into the exam.”
// 演绎：同学们只是“同学们”；网页和游戏画面都是示意的小格子（不写游戏名）；钟的指针飞转 = 时间到了深夜；
//   日历上的“好几个月”“2 周”是比较用的示意。小品里的“最凶的考官”眉毛竖起来是演的，演完大家一起笑。
// 印章：开头接上一场停靠的 17 岁；说到“他一共只准备了大约两个星期”时在角落换成 18 岁，留到结尾（交给第 20 场）。
// 结尾：最后 0.55 秒全部淡出，只剩停靠的 18 岁印章。
// 字幕：第 5–10 句整体后移 0.5 秒（给小品最后大家一起笑留时间）；每句时长不变。
(() => {
  const FL = 780;
  /* ---------------- times (scene clock) ---------------- */
  const SWAP = 31.25;                                                                                   // 17 → 18, in the corner
  const STUDY = 0.2, M_IN = [0.45, 0.6, 0.75, 0.9], CAL = 1.4, CFLIP = [2.0, 2.45, 2.9];               // L1 0.3–3.5
  const BOOK = 3.85, FLIP0 = 4.15, FLIPD = 0.27, NFLIP = 8, BOOK_OUT = 6.75;                            // L2 3.8–6.6
  const GROUP = 6.8, TALK = [7.0, 7.55], MOCK = 8.45, ANSWER = 9.35, CUTA = 10.3;                      // L3 6.7–10.3
  const SKIT = CUTA + 0.12, NOTE4 = 11.0, FIERCE = [12.35, 12.5, 12.65], PLACARD = 12.95, SHAKE0 = 12.8, LAUGH = 14.6, CUTB = 15.45;   // L4 10.6–14.6
  const DOORS = CUTB + 0.12, T_IN0 = 15.9, T_IN1 = 16.8, SHRUG = 17.35, SHRUG1 = 18.7;                  // L5 16.0–19.0
  const W1a = 19.35, W1b = 19.75, GOIN = 19.8, COMEOUT = 20.55, W2a = 20.95, W2b = 21.7, SHAKE = 21.8, SHAKE1 = 22.6, W3a = 22.7, CUTC = 23.05;   // L6 19.3–23.3
  const ROOM = CUTC + 0.12, WEB = 23.75, GAME = 27.45, CUTD = 30.75;                                    // L7 23.6–26.8, L8 26.9–30.5
  const CALS = CUTD + 0.12, LFLIP = [31.7, 32.0, 32.3], RING = 33.15, CUTE = 35.05;                    // L9 31.2–35.0
  const XDOOR = CUTE + 0.12, W4a = 35.3, W4b = 36.25, PAT = 36.4, PAT1 = 37.4, W5a = 37.55, W5b = 38.4, FADE0 = 38.85, DUR = 39.4;   // L10 35.1–38.9
  const IN = 0.3;   // characters fade back in this long after a cut

  /* ---------------- layout ---------------- */
  const TBL = { x: 650, w: 620, top: 600 }, SEAT = 645, M1 = 560, M2 = 800, M3 = [215, 262], M4 = [1085, 1040];   // study table
  const STACK = 420, BKC = [M4[1], 615], BKW = 80, BKH = 110;                                                      // the book stack, the open book
  const SK = { x: 565, w: 620 }, E1 = 385, E3 = 565, E4 = 745, EXX = 1060;                                         // skit: committee table, three examiners, the examinee
  const D1 = 560, D2 = 1020, DTOP = 370, DW = 210;                                                                 // the two class doors
  const CHX = 740, CSEAT = 655, KB = [862, 586], SCR = { x0: 895, y0: 395, x1: 1115, y1: 555 }, CLK = [1240, 252];   // computer room
  const XD = 420;                                                                                                  // the exam door

  /* ---------------- helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const fadeItems = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * Math.max(0, k)).toFixed(3); } };
  const abs = (x, y, bend = 'down') => ({ w: 1, to: 'abs', dx: x, dy: y, bend });
  const scrib = (k, x0, x1, y, n, o) => { const pts = []; for (let j = 0; j <= n; j++) pts.push([lerp(x0, x1, j / n), y + (j % 2 ? -4 : 3) + rnd(hstr(k), j, 3) * 1.5]); stroke(k, pts, o); };

  /* ---------------- generic bits ---------------- */
  COMP.a6_hLayer = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const k = fx.fo !== undefined ? 1 - clamp((t - fx.fo) / (fx.fd || 0.25)) : 1; if (k <= 0) return;
      const n0 = DL.items.length;
      fx.paint(t, F, t - fx.t0);
      fadeItems(n0, k);
    },
    cues: fx => fx.sfxAt || [],
  };
  COMP.a6_hNote = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, k = clamp((fx.t1 - t) / 0.2), pp = EASE.back(clamp(lt / 0.2)), size = fx.size || 40, n0 = DL.items.length, lines = [].concat(fx.text);
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(fx.rot || 0);
      lines.forEach((l, i) => text(fx.id + '.t' + i, l, 0, (i - (lines.length - 1) / 2) * size * 1.2, { size, color: C.red, z: Z.annot, scale: lerp(0.6, 1, pp), opacity: clamp(lt / 0.08), halo: 8 }));
      DL.restore();
      fadeItems(n0, k);
    },
    cues: fx => [[fx.t0, 'pop']],
  };
  COMP.a6_hVis = {
    draw(fx, t) {
      for (const id in fx.chars) {
        const k = evalTrack(fx.chars[id], t); if (k >= 0.999) continue;
        DL.items.forEach(it => { if (it.key.startsWith(id + '.')) it.attrs.opacity = +((it.attrs.opacity ?? 1) * Math.max(0, k)).toFixed(3); });
      }
    },
  };
  COMP.a6_hEnd = {
    draw(fx, t) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k >= 1) return;
      DL.items.forEach(it => { if (!/^stamp/.test(it.key)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * k).toFixed(3); });
    },
  };
  /** the age stamp swapped in the corner: the old one shrinks away (t1), the new one is stamped right there */
  COMP.a6_hStamps = {
    init(fx) {
      fx.old = { type: 'ageStamp', age: 17, t0: -3, ...E6.STAMP, dockT: -2, t1: SWAP };
      fx.neu = { type: 'ageStamp', age: 18, t0: SWAP + 0.3, ...E6.STAMP, center: E6.STAMP.dock, dockT: -99, pulse: [SWAP + 0.85] };
      return fx;
    },
    draw(fx, t, F) { COMP.ageStamp.draw(fx.old, t, F); COMP.ageStamp.draw(fx.neu, t, F); },
    cues: fx => [[SWAP, 'swish'], ...COMP.ageStamp.cues(fx.neu)],
  };

  /* ---------------- a calendar: header with a label, a page of day boxes, a block of pages below, pages rolling up ---------------- */
  const calPaint = (k, cx, top, o, t, p) => {
    const { w, h, label, size = 48, rows = 4, thick = 0, flips = [] } = o, z = o.z ?? Z.set + 2, x0 = cx - w / 2, x1 = cx + w / 2, hy = top + 74;
    for (let i = thick; i >= 1; i--) stroke(k + '.pg' + i, [[x0 + 3 + i * 1.5, top + h + i * 6], [x1 - 3 - i * 1.5, top + h + i * 6]], { z: z - 0.1, w: 2.6, draw: stag(p, 2, 3) });
    stroke(k + '.body', box(x0, top, x1, top + h), { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
    [-w / 4, w / 4].forEach((dx, i) => stroke(k + '.ring' + i, ringPts(k + '.ring' + i, cx + dx, top - 2, 8, 14, { n: 8, a0: 160, sweep: 300 }), { z: z + 0.3, w: 3.5, draw: stag(p, 1, 3) }));
    stroke(k + '.hd', [[x0, hy], [x1, hy]], { z: z + 0.1, w: 4, draw: stag(p, 1, 3) });
    if (p > 0.5) text(k + '.lab', label, cx, top + 40, { size, z: z + 0.2, opacity: clamp((p - 0.5) * 3) });
    const cw = (w - 40) / 7, ch = Math.min(40, (h - 74 - 30) / 4), gy = hy + 16;
    const grid = (kk, zz, sy) => {
      for (let r = 0; r <= rows; r++) stroke(kk + '.h' + r, [[x0 + 20, hy + (gy - hy + r * ch) * sy], [x1 - 20, hy + (gy - hy + r * ch) * sy]], { z: zz, w: 2.2, color: C.pencil, draw: stag(p, 2, 3), boil: 0.4 });
      for (let c = 0; c <= 7; c++) stroke(kk + '.v' + c, [[x0 + 20 + c * cw, hy + (gy - hy) * sy], [x0 + 20 + c * cw, hy + (gy - hy + rows * ch) * sy]], { z: zz, w: 2.2, color: C.pencil, draw: stag(p, 2, 3), boil: 0.4 });
    };
    grid(k + '.g', z + 0.1, 1);
    flips.forEach((f, j) => {   // a page rolls up into the header and is gone
      const q = clamp((t - f) / 0.32); if (q <= 0 || q >= 1) return;
      const sy = Math.cos(Math.PI / 2 * EASE.in(q));
      stroke(k + '.fp' + j, box(x0 + 2, hy, x1 - 2, hy + (h - 76) * sy), { z: z + 0.4, w: 4, fill: C.paper });
      grid(k + '.fg' + j, z + 0.45, sy);
    });
  };

  /* ---------------- 1 · the study table: books, the wall calendar 好几个月 ---------------- */
  const BOOKS = [[136, 30, 0], [124, 34, 6], [130, 28, -5], [118, 32, 3]];
  const studyPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.4)), z = Z.desk + 1, k = 'a6hStudy';
    SETDRAW.chair({ x: M1, seat: SEAT, full: true }, p);
    SETDRAW.chair({ x: M2, seat: SEAT, full: true }, p);
    SETDRAW.desk({ x: TBL.x, top: TBL.top, w: TBL.w }, p);
    let y = TBL.top;
    BOOKS.forEach(([w, h, dx], i) => {   // a stack of thick textbooks
      const x = STACK + dx;
      stroke(k + '.bk' + i, box(x - w / 2, y - h, x + w / 2, y), { z: z + i * 0.05, w: 4, fill: C.paper, draw: stag(p, 1, 3) });
      stroke(k + '.bs' + i, [[x - w / 2 + 14, y - h + 4], [x - w / 2 + 14, y - 4]], { z: z + i * 0.05 + 0.01, w: 2.4, draw: stag(p, 2, 3) });
      stroke(k + '.bt' + i, [[x - 12, y - h / 2], [x + w / 2 - 22, y - h / 2]], { z: z + i * 0.05 + 0.01, w: 2.4, color: C.pencil, draw: stag(p, 2, 3) });
      y -= h;
    });
  };
  const wallCalPaint = (t, F, lt) => calPaint('a6hCal', 1300, 196, { w: 220, h: 250, label: '好几个月', size: 44, thick: 6, flips: CFLIP }, t, EASE.out(clamp(lt / 0.4)));

  /** the open book in mate4's hands; pages turning from front to back */
  const page = (k, x0, w, seed, z, sx) => {
    DL.save(); DL.translate(x0, BKC[1]); DL.scale(sx, 1);
    stroke(k, box(0, -BKH / 2, w, BKH / 2), { z, w: 3.5, fill: C.paper });
    for (let i = 0; i < 5; i++) scrib(k + '.l' + i, 12, w - 12 - ((seed + i * 3) % 4) * 6, -BKH / 2 + 20 + i * 18, 5, { z: z + 0.1, w: 2.2, color: C.pencil, boil: 0.5 });
    DL.restore();
  };
  COMP.a6_hBook = {
    draw(fx, t) {
      if (t < BOOK || t >= BOOK_OUT + 0.25) return;
      const n0 = DL.items.length, pop = Math.max(0.01, EASE.back(clamp((t - BOOK) / 0.25))), z = Z.front + 1, k = 'a6hBook', sx = BKC[0];
      DL.save(); DL.about(BKC[0], BKC[1], () => DL.scale(pop));
      const n = clamp(Math.floor((t - FLIP0) / FLIPD + 1), 0, NFLIP);
      page(k + '.l', sx, BKW, n, z, -1);
      page(k + '.r', sx, BKW, n + 1, z, 1);
      stroke(k + '.sp', [[sx, BKC[1] - BKH / 2 - 2], [sx, BKC[1] + BKH / 2 + 2]], { z: z + 0.6, w: 4 });
      for (let i = 0; i < NFLIP; i++) {
        const q = EASE.io(clamp((t - FLIP0 - i * FLIPD) / 0.24)); if (q <= 0 || q >= 1) continue;
        page(k + '.f' + i, sx, BKW, i + 2, z + 0.5, Math.cos(Math.PI * q));
      }
      DL.restore();
      fadeItems(n0, 1 - clamp((t - BOOK_OUT) / 0.25));
    },
    cues: () => [[BOOK, 'pop'], ...Array.from({ length: NFLIP }, (_, i) => [FLIP0 + i * FLIPD, 'swish'])],
  };
  /** the mock exam: a question card in mate3's raised hand */
  COMP.a6_hQCard = {
    draw(fx, t, F) {
      if (t < MOCK + 0.1 || t >= CUTA + 0.25) return;
      const a = F.anchors.mate3; if (!a) return;
      const n0 = DL.items.length, h = a.handR, c = [h[0] + 34, h[1] - 58], pop = EASE.back(clamp((t - MOCK - 0.1) / 0.2)), z = Z.front + 1, k = 'a6hQ';
      DL.save(); DL.about(h[0], h[1], () => DL.scale(Math.max(0.01, pop))); DL.translate(c[0], c[1]); DL.rotate(6);
      stroke(k + '.c', box(-40, -50, 40, 50), { z, w: 4, fill: C.paper });
      text(k + '.q', '?', 0, 2, { size: 76, font: CFG.FONT_MIX, z: z + 0.1 });
      DL.restore();
      fadeItems(n0, 1 - clamp((t - CUTA) / 0.25));
    },
    cues: () => [[MOCK + 0.1, 'pop']],
  };

  /* ---------------- 2 · the skit: a little stage, the committee table, a placard 最凶的考官 ---------------- */
  const skitPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1, k = 'a6hSkit';
    const val = [[90, 64]];
    for (let i = 0; i < 12; i++) { const x = 90 + i * 107.5; val.push([x + 54, 122], [x + 107.5, 104, 1]); }
    val.push([1380, 64, 1], [90, 64, 1]);
    stroke(k + '.val', val, { z: z + 0.5, w: 4.5, fill: C.paper, draw: stag(p, 0, 3) });
    [[90, 210, 1], [1380, 1260, -1]].forEach(([xo, xi, s], j) => {   // the two curtains, tied back
      stroke(k + '.cur' + j, [[xo, 110], [xi, 110, 1], [xi - s * 30, 330], [xi - s * 80, 520, 1], [xi - s * 40, 640], [xi, FL - 6, 1], [xo, FL - 6, 1], [xo, 110, 1]], { z, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
      for (let f = 1; f <= 2; f++) stroke(k + '.fold' + j + f, [[xo + s * f * 34, 116], [xo + s * f * 30, 500], [xo + s * f * 36, FL - 12]], { z: z + 0.1, w: 2.2, color: C.pencil, draw: stag(p, 2, 3), boil: 0.5 });
      stroke(k + '.tie' + j, [[xi - s * 80, 512], [xo, 520]], { z: z + 0.1, w: 3.5, draw: stag(p, 2, 3) });
    });
    stroke(k + '.stage', [[60, FL], [1420, FL - 2]], { z, w: 4, draw: stag(p, 1, 3) });
    [E1, E3, E4].forEach(x => SETDRAW.chair({ x, seat: SEAT, full: true }, p));
    SETDRAW.desk({ x: SK.x, top: TBL.top, w: SK.w }, p);
    // the placard drops onto the front of the table
    if (t >= PLACARD) {
      const u = clamp((t - PLACARD) / 0.22), dy = -(1 - EASE.out(u)) * 60, rot = 4 * Math.exp(-6 * (t - PLACARD)) * Math.sin(18 * (t - PLACARD));
      DL.save(); DL.translate(SK.x, 646 + dy); DL.rotate(rot);
      stroke(k + '.pl', box(-150, -34, 150, 34), { z: Z.desk + 1, w: 4.5, fill: C.paper });
      text(k + '.plt', '最凶的考官', 0, 0, { size: 44, z: Z.desk + 1.2, opacity: clamp(u * 3) });
      DL.restore();
    }
  };
  /** trembling marks beside the examinee */
  COMP.a6_hShiver = {
    draw(fx, t, F) {
      if (t < SHAKE0 || t >= LAUGH) return;
      const a = F.anchors.mate2; if (!a) return;
      const on = Math.floor((t - SHAKE0) * 10) % 2;
      [-1, 1].forEach(s => [0, 1].forEach(j => {
        const x = a.hip[0] + s * (58 + j * 16 + on * 4), y = a.hip[1] - 70 + j * 30;
        stroke(`a6hShiver.${s > 0 ? 'r' : 'l'}${j}`, [[x, y - 18], [x + s * 6, y], [x, y + 18]], { z: Z.fx, w: 3.2 });
      }));
    },
  };

  /** the play-acted examiners' huge slanted eyebrows (keys under each character, so they fade with him) */
  COMP.a6_hBrows = {
    draw(fx, t, F) {
      if (t >= LAUGH) return;
      [['mate1', FIERCE[0]], ['mate3', FIERCE[1]], ['mate4', FIERCE[2]]].forEach(([id, f]) => {
        if (t < f) return;
        const a = F.anchors[id]; if (!a) return;
        const u = EASE.back(clamp((t - f) / 0.15)), up = [(a.headTop[0] - a.head[0]) / a.r, (a.headTop[1] - a.head[1]) / a.r], rt = [-up[1], up[0]];
        const fu = (evalTrack(TRACKS[id].turn, t) ?? 0) * 0.28, P = (x, y) => [a.head[0] + (rt[0] * x - up[0] * y) * a.r, a.head[1] + (rt[1] * x - up[1] * y) * a.r];
        [-1, 1].forEach((s, i) => stroke(`${id}.a6brow${i}`, [P(s * 0.12 + fu, -0.66), P(s * 0.6 + fu, lerp(-0.7, -0.98, u))], { z: Z.front + 0.5, w: 7.5 }));
      });
    },
    cues: () => FIERCE.map(f => [f, 'whip']),
  };

  /* ---------------- 3 · two doors: 不喜欢的课 / 喜欢的课 ---------------- */
  const doorAt = (k, x, sign, open, p, z) => {
    const x0 = x - DW / 2, x1 = x + DW / 2;
    stroke(k + '.fr', [[x0, FL], [x0, DTOP, 1], [x1, DTOP, 1], [x1, FL]], { z, w: 6, draw: stag(p, 0, 3) });
    if (open > 0.02) for (let i = 0; i < 7; i++) {   // the dark doorway behind the opening door
      const xa = x0 + 14 + i * 28; stroke(k + '.dk' + i, [[xa, DTOP + 14], [xa + 18, FL - 6]], { z: z + 0.05, w: 2.4, color: C.pencil, opacity: clamp(open * 2) });
    }
    const lw = (DW - 24) * Math.cos(open * 1.25);
    stroke(k + '.leaf', box(x0 + 12, DTOP + 12, x0 + 12 + lw, FL - 2), { z: z + 0.1, w: 4, fill: C.paper, draw: stag(p, 1, 3) });
    if (p > 0.8) dot(k + '.knob', [x0 + 12 + lw - 22, 590], 6, C.ink, z + 0.2);
    const sw = textWidth(sign, 42) / 2 + 22;
    stroke(k + '.sg', box(x - sw, 296, x + sw, 352), { z: z + 0.2, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    if (p > 0.6) text(k + '.sgt', sign, x, 324, { size: 42, z: z + 0.3, opacity: clamp((p - 0.6) * 4) });
  };
  const openTrack = [[0, 0], [W1b - 0.05, 1, 0.15], [GOIN + 0.35, 0, 0.15], [COMEOUT - 0.08, 1, 0.12], [COMEOUT + 0.35, 0, 0.15]];
  const doorsPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1;
    stroke('a6hDoors.floor', [[100, FL], [1500, FL - 2]], { z, w: 2.2, color: C.pencil, draw: p, opacity: 0.8 });
    doorAt('a6hDoorA', D1, '不喜欢的课', 0, p, z);
    doorAt('a6hDoorB', D2, '喜欢的课', evalTrack(openTrack, t), p, z);
  };

  /* ---------------- 4 · night, the dorm computer room: moon in the window, a wall clock racing to the small hours ---------------- */
  const roomPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1, k = 'a6hRoom';
    stroke(k + '.win', box(150, 140, 410, 380), { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.wx', [[150, 260], [410, 260]], { z: z + 0.1, w: 3.5, draw: stag(p, 1, 3) });
    stroke(k + '.wy', [[280, 140], [280, 380]], { z: z + 0.1, w: 3.5, draw: stag(p, 1, 3) });
    stroke(k + '.moon', [[206, 168], [186, 196], [188, 226], [214, 244], [190, 236], [172, 210], [178, 182], [206, 168]], { z: z + 0.2, w: 4, draw: stag(p, 2, 3) });   // a crescent
    [[340, 180], [372, 222], [222, 312], [352, 330]].forEach(([x, y], i) => {
      stroke(k + '.st' + i + 'a', [[x - 8, y], [x + 8, y]], { z: z + 0.2, w: 3, draw: stag(p, 2, 3) });
      stroke(k + '.st' + i + 'b', [[x, y - 8], [x, y + 8]], { z: z + 0.2, w: 3, draw: stag(p, 2, 3) });
    });
    stroke(k + '.pl', box(560, 112, 740, 168), { z, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    if (p > 0.6) text(k + '.plt', '电脑房', 650, 140, { size: 44, z: z + 0.2, opacity: clamp((p - 0.6) * 4) });
    // the clock: from 9 in the evening to half past 2 at night
    stroke(k + '.clk', ringPts(k + '.clk', CLK[0], CLK[1], 62, 62, { n: 14, closed: true }), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
    for (let i = 0; i < 12; i++) { const a = i * 30 * RAD, r0 = i % 3 ? 50 : 44; stroke(k + '.ct' + i, [[CLK[0] + Math.sin(a) * r0, CLK[1] - Math.cos(a) * r0], [CLK[0] + Math.sin(a) * 56, CLK[1] - Math.cos(a) * 56]], { z: z + 0.1, w: i % 3 ? 2.2 : 3.5, draw: stag(p, 1, 3) }); }
    const hr = 21 + 5.5 * EASE.io(clamp((t - WEB) / (CUTD - 0.5 - WEB))), ha = (hr % 12) / 12 * 2 * Math.PI, ma = (hr % 1) * 2 * Math.PI;
    if (p > 0.7) {
      stroke(k + '.hh', [CLK, [CLK[0] + Math.sin(ha) * 30, CLK[1] - Math.cos(ha) * 30]], { z: z + 0.2, w: 5.5 });
      stroke(k + '.mh', [CLK, [CLK[0] + Math.sin(ma) * 46, CLK[1] - Math.cos(ma) * 46]], { z: z + 0.2, w: 3.5 });
      dot(k + '.cc', CLK, 6, C.ink, z + 0.3);
    }
    SETDRAW.chair({ x: CHX, seat: CSEAT, full: true }, p);
    // desk, an old boxy computer, a keyboard
    const dz = Z.desk;
    stroke(k + '.slab', superPts(1020, 609, 420, 20, 16, 7), { z: dz, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.lgL', [[832, 618], [834, FL]], { z: dz, w: 5, draw: stag(p, 1, 3) });
    stroke(k + '.lgR', [[1208, 618], [1206, FL]], { z: dz, w: 5, draw: stag(p, 1, 3) });
    if (p > 0.8) shadow(k + '.dsh', 1020, FL + 4, 440, 1);
    stroke(k + '.back', [[1140, 378], [1186, 404, 1], [1186, 572, 1], [1140, 590, 1]], { z: Z.set + 2, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(k + '.crt', box(868, 370, 1142, 590), { z: Z.set + 2.1, w: 5.5, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(k + '.scr', superPts((SCR.x0 + SCR.x1) / 2, (SCR.y0 + SCR.y1) / 2, SCR.x1 - SCR.x0, SCR.y1 - SCR.y0, 22, 9), { z: Z.set + 2.2, w: 4, closed: true, draw: stag(p, 2, 3) });
    dot(k + '.led', [1118, 574], 5 * stag(p, 2, 3), C.ink, Z.set + 2.2);
    stroke(k + '.kb', box(KB[0] - 30, 586, KB[0] + 120, 600), { z: dz + 0.5, w: 4, fill: C.paper, draw: stag(p, 2, 3) });
    if (p > 0.9) screenPaint(t, Z.set + 2.3);
  };
  const screenPaint = (t, z) => {
    const k = 'a6hScr', { x0, y0, x1, y1 } = SCR;
    if (t < GAME) {   // a web page, scrolling
      stroke(k + '.bar', box(x0 + 12, y0 + 10, x1 - 12, y0 + 30), { z, w: 2.6 });
      for (let i = 0; i < 3; i++) dot(k + '.bd' + i, [x0 + 24 + i * 12, y0 + 20], 3, C.ink, z);
      const sc = Math.max(0, t - WEB) * 34, top = y0 + 40, bot = y1 - 10;
      for (let r = 0; r < 14; r++) {
        const y = top + 8 + r * 30 - sc; if (y < top + 4 || y > bot - 6) continue;
        if (r % 4 === 1) {   // a little picture: a box with a mountain
          if (y + 34 > bot) continue;
          stroke(k + '.pic' + r, box(x0 + 20, y - 6, x0 + 84, y + 30), { z, w: 2.6 });
          stroke(k + '.mt' + r, [[x0 + 24, y + 26], [x0 + 44, y + 6, 1], [x0 + 58, y + 18, 1], [x0 + 68, y + 10, 1], [x0 + 80, y + 26]], { z, w: 2.4 });
          scrib(k + '.pt' + r, x0 + 96, x1 - 30, y + 8, 6, { z, w: 2.2, color: C.pencil, boil: 0.4 });
        } else if (r % 4 !== 2) scrib(k + '.tx' + r, x0 + 20, x1 - 20 - (r % 3) * 30, y, 9, { z, w: 2.2, color: r % 4 === 3 ? C.ink : C.pencil, boil: 0.4 });
      }
      const cu = [x0 + 120 + 50 * Math.sin((t - WEB) * 1.7), y0 + 90 + 30 * Math.sin((t - WEB) * 1.1)];   // the mouse pointer wandering
      stroke(k + '.cur', [cu, [cu[0], cu[1] + 22, 1], [cu[0] + 6, cu[1] + 16, 1], [cu[0] + 15, cu[1] + 16, 1], cu], { z: z + 0.1, w: 2.6, fill: C.paper });
    } else {           // a game: a little grid map, trees, a castle, a hero hopping from square to square
      const gx = x0 + 22, gy = y0 + 18, cs = 29, nc = 6, nr = 4;
      for (let r = 0; r <= nr; r++) stroke(k + '.gh' + r, [[gx, gy + r * cs], [gx + nc * cs, gy + r * cs]], { z, w: 2, color: C.pencil, boil: 0.3 });
      for (let c = 0; c <= nc; c++) stroke(k + '.gv' + c, [[gx + c * cs, gy], [gx + c * cs, gy + nr * cs]], { z, w: 2, color: C.pencil, boil: 0.3 });
      [[1, 0], [0, 2], [3, 3], [2, 1]].forEach(([c, r], i) => { const cx = gx + c * cs + cs / 2, cy = gy + r * cs + cs / 2; stroke(k + '.tr' + i, [[cx - 9, cy + 9], [cx, cy - 10, 1], [cx + 9, cy + 9, 1], [cx - 9, cy + 9, 1]], { z, w: 2.4 }); });
      const cx = gx + 4.5 * cs, cy = gy + 1.4 * cs;   // the castle
      stroke(k + '.cas', [[cx - 22, cy + 22], [cx - 22, cy - 14, 1], [cx - 14, cy - 14, 1], [cx - 14, cy - 22, 1], [cx - 6, cy - 22, 1], [cx - 6, cy - 14, 1], [cx + 6, cy - 14, 1], [cx + 6, cy - 22, 1], [cx + 14, cy - 22, 1], [cx + 14, cy - 14, 1], [cx + 22, cy - 14, 1], [cx + 22, cy + 22, 1], [cx - 22, cy + 22, 1]], { z, w: 3, fill: C.paper });
      stroke(k + '.cd', [[cx - 6, cy + 22], [cx - 6, cy + 8, 1], [cx + 6, cy + 8, 1], [cx + 6, cy + 22]], { z: z + 0.1, w: 2.4 });
      const PATH = [[0, 3], [1, 3], [1, 2], [2, 2], [3, 2], [3, 1], [4, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3]], si = Math.floor(Math.max(0, t - GAME) / 0.32) % PATH.length, [hc, hrw] = PATH[si];
      const hop = Math.sin(Math.PI * ((Math.max(0, t - GAME) / 0.32) % 1)) * 5;
      dot(k + '.hero', [gx + hc * cs + cs / 2, gy + hrw * cs + cs / 2 - hop], 7, C.ink, z + 0.2);
    }
  };

  /* ---------------- 5 · two calendars: 同学们 好几个月 / 小陶 2 周 ---------------- */
  const calsPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.4)), k = 'a6hCals';
    calPaint('a6hCalA', 480, 200, { w: 300, h: 300, label: '好几个月', size: 50, thick: 10, flips: LFLIP }, t, p);
    calPaint('a6hCalB', 940, 200, { w: 300, h: 300, label: '2 周', size: 56, rows: 2, thick: 1 }, t, p);
    if (p > 0.6) {
      const o = { size: 48, z: Z.set + 3, opacity: clamp((p - 0.6) * 4) };
      text(k + '.la', '同学们', 480, 620, o);
      text(k + '.lb', '小陶', 940, 620, o);
    }
    const rq = EASE.out(clamp((t - RING) / 0.35));
    if (rq > 0) stroke(k + '.ring', ringPts(k + '.ring', 940, 241, 82, 40, { n: 12, a0: -150, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: rq });
  };

  /* ---------------- 6 · the door 资格口试 ---------------- */
  const examPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1, k = 'a6hExam', x0 = XD - 115, x1 = XD + 115, top = 350;
    stroke(k + '.floor', [[80, FL], [1500, FL - 2]], { z, w: 2.2, color: C.pencil, draw: p, opacity: 0.8 });
    stroke(k + '.fr', [[x0, FL], [x0, top, 1], [x1, top, 1], [x1, FL]], { z, w: 6, draw: stag(p, 0, 3) });
    stroke(k + '.leaf', box(x0 + 14, top + 14, x1 - 14, FL - 2), { z: z + 0.1, w: 4, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(k + '.pn0', box(x0 + 40, top + 44, x1 - 40, top + 190), { z: z + 0.15, w: 2.6, draw: stag(p, 2, 3) });
    stroke(k + '.pn1', box(x0 + 40, top + 230, x1 - 40, FL - 34), { z: z + 0.15, w: 2.6, draw: stag(p, 2, 3) });
    if (p > 0.8) dot(k + '.knob', [x1 - 36, 590], 7, C.ink, z + 0.2);
    stroke(k + '.sg', box(XD - 140, 268, XD + 140, 330), { z: z + 0.2, w: 5, fill: C.paper, draw: stag(p, 1, 3) });
    if (p > 0.6) text(k + '.sgt', '资格口试', XD, 299, { size: 50, z: z + 0.3, opacity: clamp((p - 0.6) * 4) });
  };

  /* ---------------- poses & faces ---------------- */
  const SITP = POSE.sitBase;
  Object.assign(POSE, {
    a6_hAsk: { lean: 3, armScale: 1.15, ikR: abs(366, 466), armL: [16, 10] },
    a6_hHandUp: { ...SITP, armScale: 1.55, armR: [125, 30], ikL: abs(M1 - 40, 598) },
    a6_hHoldBook: { tilt: 4, armScale: 1.05, ikL: abs(BKC[0] - BKW + 8, BKC[1] + 22), ikR: abs(BKC[0] + BKW - 8, BKC[1] + 22) },
    a6_hLaughSit: { ...SITP, lean: -6, tilt: -8, armScale: 1.2, armL: [40, 70], armR: [40, 70] },
    a6_hShrug: { tilt: 8, armScale: 1.1, armL: [30, 80], armR: [30, 80] },
    a6_hFlat: { tilt: -2 },
  });
  Object.assign(FACE, {
    a6_hFierce: { lidL: 0.22, lidR: 0.22, mouth: 'frown', mw: 0.36 },   // the big eyebrows are drawn by a6_hBrows
    a6_hScared: { eyeSY: 1.16, pupil: 0.7, brow: 'line', browL: -20, browR: -20, browY: 0.08, mouth: 'wavy', mw: 0.36 },
    a6_hNope: { lidL: 0.32, lidR: 0.32, brow: 'line', browL: -6, browR: -6, mouth: 'frown', mw: 0.28 },
  });
  const cross = x => ({ ...SITP, lean: -2, tilt: -3, ikL: abs(x + 36, SEAT - 58), ikR: abs(x - 36, SEAT - 50) });   // arms folded, the stern look
  const deskHands = (x, wr = 0) => t => ({ ...SITP, tilt: 6, ikL: abs(x - 46, 598), ikR: abs(x + 44 + (wr ? 6 * Math.sin(t * wr) : 0), 598 - (wr ? 3 * Math.abs(Math.sin(t * wr * 0.5)) : 0)) });
  const tremble = t => ({ legL: [5, 0], legR: [5, 0], armScale: 1.1, armL: [12, 36], armR: [12, 36], tilt: 5 * Math.sin(t * 40), lean: 2 * Math.sin(t * 33) });
  const typing = (fast) => t => { const f = fast ? 17 : 9, a = Math.max(0, Math.sin(t * f)), b = Math.max(0, Math.sin(t * f + 2.2)); return { ...SITP, lean: 8, tilt: 4, armScale: 1.45, ikL: abs(KB[0], KB[1] - 9 * a), ikR: abs(KB[0] + 58, KB[1] - 9 * b) }; };
  const pat = t => { const ph = (t - PAT) * 2 * Math.PI * 1.6, d = Math.max(0, Math.sin(ph)); return { tilt: -4, lean: -2, armScale: 1.2, ikL: { w: 1, to: 'head', dx: 0.15, dy: 1.75 - 0.25 * d, bend: 'down' }, armR: [14, 10] }; };
  const nod = t0 => [[t0, 1.05, 0.05], [t0 + 0.05, 1, 0.2, 'back']];
  const bounce = t0 => [[t0, 1.07, 0.05], [t0 + 0.05, 0.97, 0.1], [t0 + 0.15, 1.05, 0.1], [t0 + 0.25, 1, 0.2, 'back']];
  const mateVis = [[0, 1], [CUTA, 0, 0.25], [CUTA + IN, 1, 0.2], [CUTB, 0, 0.25]];
  const OFF = [-800, FL];

  defineScene({
    id: 'habits', chapter: '两个星期 vs 好几个月', dur: DUR, floor: FL,
    cast: { mate1: E6.mate1, mate2: E6.mate2, mate3: E6.mate3, mate4: E6.mate4, terry: { ...E6.teen, bag: true, bagFloor: [606, FL - 78] } },
    order: ['mate1', 'mate2', 'mate3', 'mate4', 'terry'],
    tracks: {
      mate1: {
        enter: M_IN[0],
        pos: [[0, [M1, SEAT]], [CUTA + 0.27, [E1, SEAT], 0], [CUTB + 0.27, OFF, 0]],
        pose: [[0, deskHands(M1, 9)], [GROUP, deskHands(M1), 0.15], [ANSWER, 'a6_hHandUp', 0.12, 'back'],
          [CUTA + 0.27, deskHands(E1), 0], [FIERCE[0], cross(E1), 0.12], [LAUGH, 'a6_hLaughSit', 0.12, 'back']],
        face: [[0, 'focus'], [GROUP, 'smile', 0.06], [MOCK + 0.15, 'effort', 0.05], [ANSWER, 'idea', 0.05], [ANSWER + 0.4, 'grin', 0.06],
          [CUTA + 0.27, 'neutral', 0], [FIERCE[0], 'a6_hFierce', 0.05], [LAUGH, 'laugh', 0.05]],
        turn: [[0, 0.2], [GROUP, -0.15, 0.1], [MOCK, -0.3, 0.1], [CUTA + 0.27, 0.25, 0]],
        gaze: [[0, [600, 600]], [GROUP, 'mate2'], [MOCK + 0.1, [400, 410]], [ANSWER + 0.3, 'mate3'], [CUTA + 0.27, 'viewer'], [SHAKE0, 'mate2'], [LAUGH, 'viewer']],
        squash: [[0, 1], ...nod(GROUP + 0.2), ...bounce(LAUGH)],
      },
      mate2: {
        enter: M_IN[1],
        pos: [[0, [M2, SEAT]], [CUTA + 0.27, [EXX, FL], 0], [SHAKE0, t => [EXX + 3 * Math.sin(t * 47), FL], 0], [LAUGH, [EXX, FL], 0.1], [CUTB + 0.27, OFF, 0]],
        pose: [[0, deskHands(M2, 8)], [GROUP, deskHands(M2), 0.15], [CUTA + 0.27, 'stand', 0], [SHAKE0, tremble, 0.1], [LAUGH, 'kidCheer', 0.12, 'back']],
        face: [[0, 'focus'], [GROUP, 'smile', 0.06], [CUTA + 0.27, 'neutral', 0], [FIERCE[0], 'surprised', 0.05], [SHAKE0, 'a6_hScared', 0.05], [LAUGH, 'joy', 0.05]],
        turn: [[0, -0.2], [GROUP, -0.3, 0.1], [CUTA + 0.27, -0.4, 0]],
        gaze: [[0, [760, 600]], [GROUP, 'mate4'], [MOCK + 0.2, 'mate1'], [CUTA + 0.27, 'mate3'], [LAUGH, 'viewer']],
        squash: [[0, 1], ...nod(GROUP + 0.3), [SHAKE0, 0.95, 0.1], [LAUGH, 1, 0.1], ...bounce(LAUGH + 0.05)],
      },
      mate3: {
        enter: M_IN[2],
        pos: [[0, [M3[0], FL]], [GROUP, [M3[1], FL], 0.3, 'lin'], [CUTA + 0.27, [E3, SEAT], 0], [CUTB + 0.27, OFF, 0]],
        pose: [[0, 'thinkStand'], [GROUP, makeWalk(GROUP, GROUP + 0.3, 6), 0], [GROUP + 0.3, 'stand', 0.1], [MOCK, 'a6_hAsk', 0.12, 'back'],
          [CUTA + 0.27, deskHands(E3), 0], [FIERCE[1], cross(E3), 0.12], [LAUGH, 'a6_hLaughSit', 0.12, 'back']],
        face: [[0, 'focus'], [GROUP, 'smile', 0.06], [MOCK, 'proud', 0.06], [ANSWER + 0.4, 'smile', 0.06], [CUTA + 0.27, 'neutral', 0], [FIERCE[1], 'a6_hFierce', 0.05], [LAUGH, 'laugh', 0.05]],
        turn: [[0, 0.35], [CUTA + 0.27, 0, 0]],
        gaze: [[0, [STACK, 520]], [GROUP, 'mate1'], [CUTA + 0.27, 'viewer'], [SHAKE0, 'mate2'], [LAUGH, 'viewer']],
        squash: [[0, 1], ...nod(GROUP + 0.4), ...nod(ANSWER + 0.5), ...bounce(LAUGH + 0.1)],
      },
      mate4: {
        enter: M_IN[3],
        pos: [[0, [M4[0], FL]], [GROUP, [M4[1], FL], 0.3, 'lin'], [CUTA + 0.27, [E4, SEAT], 0], [CUTB + 0.27, OFF, 0]],
        pose: [[0, 'stand'], [BOOK - 0.1, 'a6_hHoldBook', 0.12, 'back'], [BOOK_OUT, 'stand', 0.15], [GROUP, makeWalk(GROUP, GROUP + 0.3, 6), 0], [GROUP + 0.3, 'stand', 0.1],
          [CUTA + 0.27, deskHands(E4), 0], [FIERCE[2], cross(E4), 0.12], [LAUGH, 'a6_hLaughSit', 0.12, 'back']],
        face: [[0, 'smile'], [BOOK, 'focus', 0.06], [BOOK_OUT, 'smile', 0.06], [CUTA + 0.27, 'neutral', 0], [FIERCE[2], 'a6_hFierce', 0.05], [LAUGH, 'laugh', 0.05]],
        turn: [[0, -0.3], [CUTA + 0.27, -0.2, 0]],
        gaze: [[0, [1300, 330]], [BOOK, [BKC[0] - 20, BKC[1]]], [BOOK + 0.9, [BKC[0] + 30, BKC[1]]], [BOOK + 1.8, [BKC[0] - 20, BKC[1] + 20]], [GROUP, 'mate2'], [MOCK + 0.1, 'mate1'],
          [CUTA + 0.27, 'viewer'], [SHAKE0, 'mate2'], [LAUGH, 'viewer']],
        squash: [[0, 1], ...nod(GROUP + 0.5), ...bounce(LAUGH + 0.15)],
      },
      terry: {
        pos: [[0, [1800, FL]], [T_IN0, [1300, FL], T_IN1 - T_IN0, 'lin'], [W1a, [D2, FL], W1b - W1a, 'lin'], [W2a, [D1 + 40, FL], W2b - W2a, 'lin'], [W3a, [240, FL], 0.7, 'lin'],
          [CUTC + 0.27, [CHX, CSEAT], 0], [CUTD + 0.27, [1300, FL], 0], [W4a, [900, FL], W4b - W4a, 'lin'], [W5a, [XD + 220, FL], W5b - W5a, 'lin']],
        bag: [[0, 1], [CUTC + 0.27, 0, 0], [CUTD + 0.27, 1, 0]],
        pose: [[0, makeWalk(T_IN0, T_IN1, 5.2, { bag: true })], [T_IN1, 'stand', 0.1], [SHRUG, 'a6_hShrug', 0.12, 'back'], [SHRUG1, 'stand', 0.15],
          [W1a, makeWalk(W1a, W1b, 5.6, { bag: true }), 0], [W1b, 'stand', 0.1], [W2a, makeWalk(W2a, W2b, 6, { bag: true }), 0], [W2b, 'stand', 0.1],
          [W3a, makeWalk(W3a, W3a + 0.7, 6, { bag: true }), 0],
          [CUTC + 0.27, typing(false), 0], [GAME, typing(true), 0.1],
          [CUTD + 0.27, 'stand', 0], [W4a, makeWalk(W4a, W4b, 5.4, { bag: true }), 0], [W4b, 'stand', 0.1], [PAT, pat, 0.12, 'back'], [PAT1, 'stand', 0.15],
          [W5a, makeWalk(W5a, W5b, 5.4, { bag: true }), 0], [W5b, 'stand', 0.1]],
        face: [[0, 'smile'], [SHRUG, 'grin', 0.06], [GOIN - 0.3, 'joy', 0.05], [COMEOUT, 'joy', 0], [W2a + 0.3, 'smile', 0.08], [W2b, 'neutral', 0.08], [SHAKE, 'a6_hNope', 0.06], [W3a, 'smile', 0.1],
          [CUTC + 0.27, 'smile', 0], [GAME, 'grin', 0.06], [CUTD + 0.27, 'smile', 0], [PAT, 'smile', 0], [W5b, 'smile', 0]],
        turn: [[0, -0.45], [T_IN1, -0.15, 0.12], [W1a, -0.45, 0.08], [W1b, -0.3, 0.1], [W2a, -0.45, 0.08], [W2b, -0.4, 0.1],
          [SHAKE, t => -0.35 + 0.4 * Math.sin((t - SHAKE) * 15), 0.06], [SHAKE1, -0.45, 0.1],
          [CUTC + 0.27, 0.45, 0], [CUTD + 0.27, -0.25, 0], [W4a, -0.45, 0.08], [W4b, -0.15, 0.1], [W5a, -0.45, 0.08], [W5b, -0.35, 0.1]],
        gaze: [[0, [1000, 500]], [T_IN1, 'viewer'], [W1a, [D2, 560]], [COMEOUT, 'viewer'], [W2a, [D1, 330]], [SHAKE1, [200, 560]],
          [CUTC + 0.27, [1000, 470]], [GAME, [1040, 460]],
          [CUTD + 0.27, [700, 300]], [RING, [940, 241]], [RING + 1.0, 'viewer'], [W4a, [XD, 450]], [PAT, 'viewer'], [W5a, [XD, 450]]],
        squash: [[0, 1], [SHRUG, 0.95, 0.1], [SHRUG1, 1, 0.15], ...nod(PAT + 0.05), ...nod(PAT + 0.7)],
      },
    },
    fx: [
      { type: 'a6_hStamps', id: 'a6hStamps' },
      { type: 'a6_hVis', id: 'a6hVis', chars: {
        mate1: mateVis, mate2: mateVis, mate3: mateVis, mate4: mateVis,
        terry: [[0, 1], [GOIN, 0, 0.3], [COMEOUT, 1, 0.22], [CUTC, 0, 0.25], [CUTC + IN, 1, 0.2], [CUTD, 0, 0.25], [CUTD + IN, 1, 0.2]] } },
      // L1–L3 · the classmates at the study table
      { type: 'a6_hLayer', id: 'a6hStudyL', t0: STUDY, fo: CUTA, paint: studyPaint, sfxAt: [[STUDY, 'paper']] },
      { type: 'a6_hLayer', id: 'a6hCalL', t0: CAL, fo: CUTA, paint: wallCalPaint, sfxAt: [[CAL, 'pop'], ...CFLIP.map(f => [f, 'paper'])] },
      { type: 'a6_hBook', id: 'a6hBook' },
      { type: 'speech', id: 'a6hTalk0', text: '……', at: [890, 344], tail: [-26, 26], speaker: 'mate2', size: 60, t0: TALK[0], t1: TALK[0] + 0.9 },
      { type: 'speech', id: 'a6hTalk1', text: '……', at: [1030, 330], tail: [-10, 30], speaker: 'mate4', size: 60, t0: TALK[1], t1: TALK[1] + 0.9 },
      { type: 'a6_hQCard', id: 'a6hQCard' },
      { type: 'mark', id: 'a6hBang', char: '!', on: ['mate1'], dx: -34, t0: ANSWER + 0.05, t1: CUTA },
      // L4 · the skit
      { type: 'a6_hLayer', id: 'a6hSkitL', t0: SKIT, fo: CUTB, paint: skitPaint, sfxAt: [[SKIT, 'paper'], [PLACARD + 0.18, 'thud'], [LAUGH, 'tada']] },
      { type: 'a6_hShiver', id: 'a6hShiver' },
      { type: 'a6_hBrows', id: 'a6hBrows' },
      { type: 'a6_hNote', id: 'a6hN4', text: '（小品，开玩笑的）', at: [760, 210], rot: -3, t0: NOTE4, t1: CUTB + 0.15 },
      // L5–L6 · his doors
      { type: 'a6_hLayer', id: 'a6hDoorsL', t0: DOORS, fo: CUTC, paint: doorsPaint, sfxAt: [[DOORS, 'paper'], [W1b - 0.05, 'swish'], [GOIN + 0.4, 'tap'], [COMEOUT - 0.08, 'swish'], [COMEOUT + 0.4, 'tap']] },
      // L7–L8 · the computer room at night
      { type: 'a6_hLayer', id: 'a6hRoomL', t0: ROOM, fo: CUTD, paint: roomPaint, sfxAt: [[ROOM, 'paper'], [WEB, 'beep'], [GAME, 'zip']] },
      // L9 · two calendars; L10 · the door
      { type: 'a6_hLayer', id: 'a6hCalsL', t0: CALS, fo: CUTE, paint: calsPaint, sfxAt: [[CALS, 'paper'], ...LFLIP.map(f => [f, 'paper']), [RING, 'pen']] },
      { type: 'a6_hLayer', id: 'a6hExamL', t0: XDOOR, paint: examPaint, sfxAt: [[XDOOR, 'paper']] },
      { type: 'a6_hEnd', id: 'a6hEnd', f0: FADE0, fd: DUR - 0.05 - FADE0 },
    ],
    sfx: [[ANSWER, 'ding'], [SHRUG, 'boop'], [SHAKE, 'boing'], [PAT + 0.05, 'tap'], [PAT + 0.7, 'tap'],
      ...Array.from({ length: 12 }, (_, i) => [WEB + 0.2 + i * 0.3, 'key']), ...Array.from({ length: 16 }, (_, i) => [GAME + 0.1 + i * 0.18, 'key'])],
    steps: [{ t0: GROUP, t1: GROUP + 0.3, hz: 6 }, { t0: T_IN0, t1: T_IN1, hz: 5.2 }, { t0: W1a, t1: W1b, hz: 5.6 }, { t0: W2a, t1: W2b, hz: 6 }, { t0: W3a, t1: W3a + 0.6, hz: 6 },
      { t0: W4a, t1: W4b, hz: 5.4 }, { t0: W5a, t1: W5b, hz: 5.4 }],
    subs: [
      { t0: 0.3, t1: 3.5, text: '同学们准备了好几个月：' },
      { t0: 3.8, t1: 6.6, text: '把课本从头读到尾，' },
      { t0: 6.7, t1: 10.3, text: '组学习小组，互相模拟考试，' },
      { t0: 10.6, t1: 14.6, text: '还编了小品，演三位最凶的考官。' },
      { t0: 16.0, t1: 19.0, text: '小陶呢？还是老样子：' },
      { t0: 19.3, t1: 23.3, text: '喜欢的课就去，不喜欢的就不去；' },
      { t0: 23.6, t1: 26.8, text: '很多时间，在网上闲逛，' },
      { t0: 26.9, t1: 30.5, text: '在电脑房打游戏，打到深夜。' },
      { t0: 31.2, t1: 35.0, text: '他一共只准备了大约两个星期。' },
      { t0: 35.1, t1: 38.9, text: '进考场的时候，他还挺有把握。' },
    ],
  });
})();
