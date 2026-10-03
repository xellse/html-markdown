// 第 15 场 · 又一年（10–12 岁，1986–1988）
// 事实（ep5-script.md）：1986、1987、1988 年，澳大利亚数学奥林匹克（AMO）都是选国家队前 6 名的考试；他三次入选（AMT 记录
//   “Selected for the third time”）。澳大利亚奥数委员会（AMOC）有给学生寄练习题的通信练习；他 15 岁写的书里引用了
//   “AMOC Correspondence Programme (1986–1987), Set 1”。他说参加奥赛那些年，从波利亚的《怎样解题》里学了很多。
//   一位退休的老教授（片中不说名字）：他每个周末去，“to talk about recreational mathematics over tea and cakes”。
// 演绎：大门 + 远处一面“国际奥数”小旗；名单卡上不写名次（没有记录；三年都画在同一行，只为让三个 ✓ 对齐）；
//   信封上的“第1套/第2套/第3套”只是示意；聊天气泡里是泛指的好玩数学小图（螺旋、三角形、π、一串点），不是真实谈话内容。
// 印章：开头接上一场停靠的 9 岁，马上在角落换成 10 岁（1986）；说到 1987 换 11 岁（在角落里快速盖下），之后一直是 11 岁，交给第 20 场。
// 结尾：下午茶画面在最后 0.6 秒淡出，只剩停靠的 11 岁印章。
// 字幕：第 6–8 句后移（+0.7 / +1.1 / +1.1 秒），给练习题和书各留一点停顿；每句时长不变。
(() => {
  const FL = 780;
  /* ---------------- layout ---------------- */
  const TX0 = 380, TMX = 790, TBX = 740, KX = 1080, PX = 480, SEAT_A = 676;   // Terry: by the gate / at the mailbox / with the book; tea-room chairs
  const G = { xl: 660, xr: 1060, bx0: 600, bx1: 1120, by0: 236, by1: 392, cx: 860 };
  const MBX = { x0: 880, x1: 1300, top: 520, bot: 640 }, EW = 120, EH = 170, ETOP = 400, OPEN_AT = [600, 470], SH_W = 200, SH_H = 236;
  const BK = { spine: 400, w: 240, h: 300, cy: 430 };

  /* ---------------- times (scene clock) ---------------- */
  const STAMPS = [[-3, 9], [0.35, 10], [10.85, 11]];   // stays 11 to the end (the 1988 card carries the year; havana takes over the 11)
  const T_IN0 = 0.4, T_IN1 = 1.6, FLAG = 0.8, GATE = 2.3, GTXT = 3.85;                    // L1 0.3–5.1
  const SIGN = 5.3, TOP6 = 7.35, RING6 = 7.75, GATE_OUT = 9.0;                             // L2 5.2–8.8
  const CARD = [9.45, 10.85, 12.25], FLASH = 15.3, CARD_OUT = 17.5;                        // L3 9.3–13.9, L4 14.2–17.4
  const MBOX = 18.05, ENV_T = [18.55, 19.2, 19.85], T_WALK0 = 20.2, T_WALK1 = 21.1, REACH_T = 21.15, PULL = 21.35, OPEN = 21.85, SHEET = 21.95, NOTE5 = 22.3, MAIL_OUT = 23.4;   // L5 18.1–22.9
  const T_STEP0 = 23.65, BOOK = 24.2, TITLE = 26.3, BOOK_OPEN = 26.85, FLIPS = [27.35, 27.8, 28.25], NOTE6 = 27.4, BOOK_OUT = 28.95, T_GONE = 29.3;   // L6 24.0–28.6
  const ROOM = 29.15, PROF_IN = 29.3, NOTE7 = 29.75, T_WALK3 = 29.9, T_SIT = 30.85, WAVE0 = 30.1, WAVE1 = 31.0;   // L7 29.6–33.8
  const BUB = [34.0, 35.0, 36.0, 37.0], COOK = [34.45, 36.45, 37.75];                     // L8 33.9–38.3
  const FADE0 = 38.2, DUR = 38.8;

  /* ---------------- helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const fadeItems = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); } };
  const bez = (P0, P1, P2, u) => [(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]];
  const jumpArc = (t0, d, a, b, hgt = 80) => t => { const u = clamp((t - t0) / d); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(Math.PI * u) * hgt]; };
  const scrib = (k, x0, x1, y, n, o) => { const pts = []; for (let j = 0; j <= n; j++) pts.push([lerp(x0, x1, j / n), y + (j % 2 ? -4 : 3) + rnd(hstr(k), j, 3) * 1.5]); stroke(k, pts, o); };

  /* ---------------- generic bits ---------------- */
  /** draws `paint` and fades its own shapes out from fo over fd */
  COMP.a5_bLayer = {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const k = fx.fo !== undefined ? 1 - clamp((t - fx.fo) / (fx.fd || 0.3)) : 1; if (k <= 0) return;
      const n0 = DL.items.length;
      fx.paint(t, F, t - fx.t0);
      fadeItems(n0, k);
    },
    cues: fx => fx.sfxAt || [],
  };
  /** red-pen note (fades in and out) */
  COMP.a5_bNote = {
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
  /** the age stamp, swapped in the corner: the old one shrinks away, the new one is stamped right there (no trip to the middle) */
  COMP.a5_bStamps = {
    init(fx) { fx.inner = fx.seq.map(([at, age]) => ({ type: 'ageStamp', age, t0: at < 0 ? -3 : at, ...E5.STAMP, center: E5.STAMP.dock, dockT: -99, pulse: at < 0 ? [] : [at + 0.5] })); return fx; },
    draw(fx, t, F) {
      const d = E5.STAMP.dock;
      fx.seq.forEach(([at], i) => {
        if (t < at) return;
        const nx = fx.seq[i + 1];
        let k = 1;
        if (nx && t >= nx[0]) { k = 1 - EASE.in(clamp((t - nx[0]) / 0.14)); if (k <= 0.01) return; }
        DL.save(); if (k < 1) DL.about(d[0], d[1], () => DL.scale(k));
        COMP.ageStamp.draw(fx.inner[i], t, F);
        DL.restore();
      });
    },
    cues: fx => fx.seq.filter(([at]) => at >= 0).flatMap(([at]) => [[at, 'whoosh'], [at + 0.45, 'stamp']]),
  };
  /** fades one character (keys starting with prefix) out over [f0, f0 + fd], until `until` */
  COMP.a5_bFadeKeys = {
    draw(fx, t) {
      if (t < fx.f0 || t >= fx.until) return;
      const k = 1 - clamp((t - fx.f0) / fx.fd);
      DL.items.forEach(it => { if (it.key.startsWith(fx.prefix)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * k).toFixed(3); });
    },
  };
  /** the end: everything but the docked stamp fades out */
  COMP.a5_bFadeAll = {
    draw(fx, t) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k >= 1) return;
      DL.items.forEach(it => { if (!/^stamp/.test(it.key)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * k).toFixed(3); });
    },
  };

  /* ---------------- 1 · the gate: 国家队（前 6 名）, a sign 全国选拔考试; far off, a flag 国际奥数 ---------------- */
  const gatePaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1, k = 'a5b.gate';
    [G.xl, G.xr].forEach((x, i) => stroke(k + '.p' + i, box(x - 15, G.by1 - 4, x + 15, FL), { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) }));
    stroke(k + '.b', box(G.bx0, G.by0, G.bx1, G.by1), { z: z + 0.1, w: 5.5, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(k + '.bi', box(G.bx0 + 12, G.by0 + 12, G.bx1 - 12, G.by1 - 12), { z: z + 0.15, w: 2.5, draw: stag(p, 2, 3) });
    if (p > 0.8) { shadow(k + '.s0', G.xl, FL + 4, 70, 1); shadow(k + '.s1', G.xr, FL + 4, 70, 1); }
    const q1 = clamp((t - GTXT) / 0.22);
    if (q1 > 0) text(k + '.t1', '国家队', G.cx, 292, { size: 80, z: z + 0.3, scale: lerp(0.5, 1, EASE.back(q1)), opacity: clamp(q1 * 3) });
    const q2 = clamp((t - TOP6) / 0.22);
    if (q2 > 0) {
      const o = { z: z + 0.3, scale: lerp(0.5, 1, EASE.back(q2)), opacity: clamp(q2 * 3) };
      text(k + '.t2a', '（前', G.cx - 30, 354, { size: 46, anchor: 'end', ...o });
      text(k + '.t2b', '6', G.cx, 356, { size: 56, font: CFG.FONT_MIX, ...o });
      text(k + '.t2c', '名）', G.cx + 30, 354, { size: 46, anchor: 'start', ...o });
    }
    const rq = EASE.out(clamp((t - RING6) / 0.35));
    if (rq > 0) stroke(k + '.r6', ringPts(k + '.r6', G.cx, 358, 25, 33, { n: 11, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: rq });
    if (t >= SIGN) {   // the sign swings in under the banner
      const u = t - SIGN, ang = 14 * Math.exp(-3.2 * u) * Math.cos(9 * u), sc = lerp(0.3, 1, EASE.back(clamp(u / 0.25)));
      DL.save(); DL.translate(G.cx, G.by1); DL.rotate(ang); DL.scale(sc);
      stroke(k + '.str0', [[-70, 0], [-92, 50]], { z: z + 0.05, w: 2.5 });
      stroke(k + '.str1', [[70, 0], [92, 50]], { z: z + 0.05, w: 2.5 });
      stroke(k + '.sg', box(-128, 50, 128, 108), { z: z + 0.2, w: 4, fill: C.paper });
      text(k + '.sgt', '全国选拔考试', 0, 80, { size: 38, z: z + 0.3 });
      DL.restore();
    }
  };
  const flagPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.4)), z = Z.set + 1, k = 'a5b.flag', px = 1336, top = 430;
    stroke(k + '.pole', [[px, FL], [px, top]], { z, w: 5, draw: stag(p, 0, 2) });
    dot(k + '.knob', [px, top - 6], 7 * stag(p, 0, 2), C.ink, z);
    const wv = (x, y) => [x, y + 6 * Math.sin(t * 3.2 - (x - px) * 0.025) * ((x - px) / 200)];
    const tp = [], bt = [];
    for (let i = 0; i <= 8; i++) { const x = px + 4 + i * 25; tp.push(wv(x, 438)); bt.push(wv(x, 534)); }
    const pts = [...tp.slice(0, 8), [tp[8][0], tp[8][1], 1], ...bt.reverse().map((q, i) => (i === 0 || i === 8 ? [q[0], q[1], 1] : q)), [tp[0][0], tp[0][1], 1]];
    stroke(k + '.cloth', pts, { z: z + 0.1, w: 4.5, fill: C.paper, draw: stag(p, 1, 2) });
    const q = clamp((lt - 0.3) / 0.2);
    if (q > 0) text(k + '.t', '国际奥数', px + 104, 487, { size: 40, z: z + 0.2, opacity: q });
    if (p > 0.8) shadow(k + '.sh', px, FL + 4, 60, 1);
  };

  /* ---------------- 2 · three team lists, 1986 / 1987 / 1988 (no ranks: five pencil scribbles and 小陶) ---------------- */
  const CARDS = [['1986', 660, CARD[0]], ['1987', 990, CARD[1]], ['1988', 1320, CARD[2]]], CW = 300, CH = 380, CY = 410, ME = 3, CROT = [-2, 1.5, -1];
  COMP.a5_bCards = {
    draw(fx, t) {
      CARDS.forEach(([yr, cx, t0], j) => {
        const tout = CARD_OUT + j * 0.08;
        if (t < t0 || t >= tout + 0.8) return;
        const drop = EASE.back(clamp((t - t0) / 0.32)), out = EASE.in(clamp((t - tout) / 0.32)), k = 'a5b.card' + j, z = Z.set + 2;
        DL.save(); DL.translate(cx, CY - (1 - drop) * 640 - out * 800); DL.rotate(CROT[j] - (1 - drop) * 10 + out * 8);
        stroke(k, superPts(0, 0, CW, CH, 24, 12), { z, w: 5, closed: true, fill: C.paper });
        text(k + '.h', yr + ' 国家队', 0, -CH / 2 + 54, { size: 48, z: z + 0.2 });
        stroke(k + '.rule', [[-CW / 2 + 28, -CH / 2 + 98], [CW / 2 - 28, -CH / 2 + 95]], { z: z + 0.1, w: 3 });
        for (let i = 0; i < 6; i++) {
          const y = -CH / 2 + 142 + i * 42;
          dot(k + '.b' + i, [-CW / 2 + 36, y], 5.5, C.ink, z + 0.2);
          if (i === ME) continue;
          const n = 5 + Math.round((rnd(hstr(k), i, 1) + 1) * 2), pts = [];
          for (let m = 0; m <= n; m++) pts.push([-CW / 2 + 60 + m * 24, y + (m % 2 ? -7 : 5) + rnd(hstr(k), i, m + 5) * 2]);
          stroke(k + '.s' + i, pts, { z: z + 0.1, w: 3, color: C.pencil, boil: 0.6 });
        }
        const my = -CH / 2 + 142 + ME * 42;
        text(k + '.me', '小陶', -CW / 2 + 58, my, { size: 44, anchor: 'start', z: z + 0.3 });
        // the red tick, half a second after the card lands; all three flash together on “次次都考进了”
        const cq = EASE.out(clamp((t - t0 - 0.5) / 0.25));
        if (cq > 0) {
          const v = (t - FLASH) / 0.45, fl = v > 0 && v < 1 ? 1 + 0.4 * Math.sin(Math.PI * v) : 1, c0 = [64, my - 4];
          DL.save(); DL.about(c0[0], c0[1], () => DL.scale(fl));
          stroke(k + '.ck', [[c0[0] - 26, c0[1]], [c0[0] - 8, c0[1] + 20, 1], [c0[0] + 30, c0[1] - 30]], { z: Z.annot, w: 6.5, color: C.red, draw: cq });
          DL.restore();
          if (v > 0 && v < 1) for (let r = 0; r < 6; r++) {
            const a = (r * 60 - 90) * RAD, r0 = 46 + 24 * v, L = 16 * Math.sin(Math.PI * v);
            stroke(k + '.ray' + r, [[c0[0] + Math.cos(a) * r0, c0[1] + Math.sin(a) * r0], [c0[0] + Math.cos(a) * (r0 + L), c0[1] + Math.sin(a) * (r0 + L)]], { z: Z.annot, w: 3.5, color: C.red });
          }
        }
        DL.restore();
      });
    },
    cues: () => [...CARDS.flatMap(([, , t0]) => [[t0, 'paper'], [t0 + 0.3, 'tap'], [t0 + 0.5, 'pen']]), [FLASH, 'tada'], [CARD_OUT, 'whoosh']],
  };

  /* ---------------- 3 · practice sets in the post: envelopes drop into a letter box; he opens the first one ---------------- */
  const mailPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.4)), z = Z.set + 3, k = 'a5b.mb', { x0, x1, top, bot } = MBX;
    stroke(k + '.post', box(1078, bot - 4, 1102, FL), { z: z - 0.5, w: 4.5, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.lid', [[x0, top], [x0 + 22, top - 22, 1], [x1 + 22, top - 22, 1], [x1, top, 1], [x0, top, 1]], { z: Z.set + 1.5, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(k + '.slot', [[x0 + 36, top - 11], [x1 - 14, top - 11]], { z: Z.set + 1.6, w: 5, draw: stag(p, 1, 3) });
    stroke(k + '.side', [[x1, top], [x1 + 22, top - 22, 1], [x1 + 22, bot - 22, 1], [x1, bot, 1]], { z, w: 4.5, fill: C.paper, draw: stag(p, 2, 3) });
    stroke(k + '.box', box(x0, top, x1, bot), { z, w: 5.5, fill: C.paper, draw: stag(p, 2, 3) });
    stroke(k + '.door', box(1150, 548, 1268, 616), { z: z + 0.1, w: 3, draw: stag(p, 2, 3) });
    dot(k + '.knob', [1252, 582], 5 * stag(p, 2, 3), C.ink, z + 0.2);
    const q = clamp((lt - 0.3) / 0.2);
    if (q > 0) text(k + '.t', '信箱', 1000, 582, { size: 44, z: z + 0.2, opacity: q });
    if (p > 0.8) shadow(k + '.sh', 1090, FL + 4, 80, 1);
  };
  const ENV = [[960, ENV_T[0], '第1套'], [1090, ENV_T[1], '第2套'], [1220, ENV_T[2], '第3套']];
  const ROWS = ['1.', '2.', '3.'].map((s, r) => layoutWriting({ text: s, x: -SH_W / 2 + 20, y: -SH_H / 2 + 30 + r * 66, size: 40, t0: -9, speed: 1 }));
  const drawEnv = (k, c, rot, sc, label, flap) => {
    DL.save(); DL.translate(c[0], c[1]); DL.rotate(rot); DL.scale(sc);
    const z = Z.set + 2;
    stroke(k, box(-EW / 2, -EH / 2, EW / 2, EH / 2), { z, w: 4, fill: C.paper });
    stroke(k + '.f', [[-EW / 2, -EH / 2], [0, -EH / 2 + 30 * (1 - 2 * flap), 1], [EW / 2, -EH / 2]], { z: z + 0.1, w: 3.5 });
    text(k + '.t1', '练习题', 0, -EH / 2 + 56, { size: 36, z: z + 0.2 });
    text(k + '.t2', label, 0, -EH / 2 + 96, { size: 36, z: z + 0.2 });
    DL.restore();
  };
  COMP.a5_bMail = {
    draw(fx, t) {
      if (t < ENV_T[0] || t >= MAIL_OUT + 0.3) return;
      const k0 = 1 - clamp((t - MAIL_OUT) / 0.3), n0 = DL.items.length;
      ENV.forEach(([x, t0, label], i) => {
        if (t < t0) return;
        const fin = [x, ETOP + EH / 2], u = EASE.out(clamp((t - t0) / 0.55));
        let c = bez([1760, 300], [x + 300, 160], fin, u), rot = 9 * (1 - u), sc = 1, flap = 0;
        if (i === 0 && t >= PULL) {   // the first one hops out and opens beside him
          const v = EASE.io(clamp((t - PULL) / 0.45));
          c = bez(fin, [800, 230], OPEN_AT, v); sc = lerp(1, 1.3, v); rot = -8 * Math.sin(Math.PI * v);
          flap = EASE.out(clamp((t - OPEN) / 0.2));
        }
        drawEnv('a5b.env' + i, c, rot, sc, label, flap);
      });
      if (t >= SHEET) {   // a problem sheet slides up out of it: 1. 2. 3.
        const v = EASE.out(clamp((t - SHEET) / 0.35)), z = Z.set + 2.5;
        DL.save(); DL.translate(OPEN_AT[0], lerp(OPEN_AT[1], 300, v));
        stroke('a5b.sheet', box(-SH_W / 2, -SH_H / 2, SH_W / 2, SH_H / 2), { z, w: 4, fill: C.paper });
        ROWS.forEach((w, r) => {
          w.strokes.forEach((s, i) => stroke(`a5b.sheet.n${r}.${i}`, s.pts, { z: z + 0.2, w: 4.5, boil: 0.5 }));
          scrib(`a5b.sheet.l${r}`, -SH_W / 2 + 70, SH_W / 2 - 22 - r * 14, -SH_H / 2 + 54 + r * 66, 8, { z: z + 0.1, w: 2.6, color: C.pencil, boil: 0.6 });
        });
        DL.restore();
      }
      fadeItems(n0, k0);
    },
    cues: () => [...ENV_T.map(e => [e, 'whoosh']), ...ENV_T.map(e => [e + 0.55, 'paper']), [PULL, 'zip'], [OPEN, 'paper'], [SHEET, 'pop']],
  };

  /* ---------------- 4 · a book flies into his hand: 怎样解题 / 波利亚; it opens, pages turn ---------------- */
  const bookPos = t => bez([1700, -200], [1100, 60], [BK.spine + BK.w / 2, BK.cy], EASE.out(clamp((t - BOOK) / 0.45)));
  const page = (k, x0, w, seed, z, sx) => {   // one page from the spine (x0 = spine) to x0 + w·sx (sx < 0: to the left)
    DL.save(); DL.translate(x0, BK.cy); DL.scale(sx, 1);
    stroke(k, box(0, -BK.h / 2, w, BK.h / 2), { z, w: 4, fill: C.paper });
    for (let i = 0; i < 7; i++) {
      const len = w - 50 - ((seed * 3 + i * 7) % 5) * 22, y = -BK.h / 2 + 46 + i * 34;
      if (seed % 3 === 1 && i === 3) { stroke(k + '.fig', [[60, y + 18], [100, y - 26, 1], [140, y + 18, 1], [60, y + 18, 1]], { z: z + 0.1, w: 2.8 }); continue; }
      if (seed % 3 === 1 && i === 4) continue;
      scrib(k + '.l' + i, 24, 24 + len, y, 9, { z: z + 0.1, w: 2.4, color: C.pencil, boil: 0.5 });
    }
    DL.restore();
  };
  COMP.a5_bBook = {
    draw(fx, t) {
      if (t < BOOK || t >= BOOK_OUT + 0.3) return;
      const k0 = 1 - clamp((t - BOOK_OUT) / 0.3), n0 = DL.items.length, k = 'a5b.bk', z = Z.set + 3;
      const o = EASE.io(clamp((t - BOOK_OPEN) / 0.35));
      if (o <= 0) {   // closed, flying in, then held: the cover
        const c = bookPos(t), u = clamp((t - BOOK) / 0.45), v = (t - TITLE) / 0.4, sc = v > 0 && v < 1 ? 1 + 0.06 * Math.sin(Math.PI * v) : 1;
        DL.save(); DL.translate(c[0], c[1]); DL.rotate(-30 * (1 - EASE.out(u))); DL.scale(sc);
        stroke(k + '.cv', box(-BK.w / 2, -BK.h / 2, BK.w / 2, BK.h / 2), { z, w: 5, fill: C.paper });
        stroke(k + '.sp', [[-BK.w / 2 + 18, -BK.h / 2 + 4], [-BK.w / 2 + 18, BK.h / 2 - 4]], { z: z + 0.1, w: 3 });
        stroke(k + '.fr', box(-BK.w / 2 + 34, -BK.h / 2 + 18, BK.w / 2 - 16, BK.h / 2 - 18), { z: z + 0.1, w: 2.4 });
        text(k + '.ti', '怎样解题', 9, -66, { size: 46, z: z + 0.2 });
        stroke(k + '.dc', ringPts(k + '.dc', 9, 18, 34, 34, { n: 12, a0: -110, sweep: 372 }), { z: z + 0.1, w: 3 });   // a little cover picture: a circle with a path to its middle
        stroke(k + '.dc2', [[-40, 70], [-14, 44], [9, 18]], { z: z + 0.1, w: 3 });
        dot(k + '.dc3', [9, 18], 6, C.ink, z + 0.2);
        text(k + '.au', '波利亚', 9, 104, { size: 38, z: z + 0.2 });
        DL.restore();
      } else {         // open: the cover swings over to the left, then three pages turn
        const sx = BK.spine, n = FLIPS.filter(f => t >= f + 0.35).length;
        page(k + '.r', sx, BK.w, 2 + n, z, 1);                             // the page lying on the right
        if (o >= 1) page(k + '.l', sx, BK.w, n === 0 ? 0 : 1 + n, z, -1);  // the page lying on the left
        const cs = Math.cos(Math.PI * o);
        if (o < 1) {   // the cover, turning about the spine
          DL.save(); DL.translate(sx, BK.cy); DL.scale(cs, 1);
          stroke(k + '.cv', box(0, -BK.h / 2, BK.w, BK.h / 2), { z: z + 0.5, w: 5, fill: C.paper });
          if (cs > 0.15) text(k + '.ti', '怎样解题', BK.w / 2 + 9, -66, { size: 46, z: z + 0.6 });
          DL.restore();
        }
        FLIPS.forEach((f, i) => {   // a page turning right → left
          const q = EASE.io(clamp((t - f) / 0.35)); if (q <= 0 || q >= 1) return;
          page(k + '.f' + i, sx, BK.w, 3 + i, z + 0.5, Math.cos(Math.PI * q));
        });
      }
      fadeItems(n0, k0);
    },
    cues: () => [[BOOK, 'whoosh'], [BOOK + 0.45, 'thud'], [TITLE, 'boop'], [BOOK_OPEN, 'paper'], ...FLIPS.map(f => [f, 'swish'])],
  };

  /* ---------------- 5 · weekend tea at the professor's: bubbles with fun little maths, cookies going ---------------- */
  const roomPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.4));
    SETDRAW.chair({ x: PX, seat: SEAT_A, full: true }, p);
    SETDRAW.chair({ x: KX, seat: SEAT_A, full: true }, p);
  };
  const DOODLE = {
    spiral(k, c, p, z) { const pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * 6 * Math.PI, r = 3 + 48 * i / 60; pts.push([c[0] + Math.cos(a) * r * 1.15, c[1] + Math.sin(a) * r * 0.95]); } stroke(k, pts, { z, w: 4, draw: p }); },
    tri(k, c, p, z) {
      const A = [c[0], c[1] - 48], B = [c[0] + 56, c[1] + 40], D = [c[0] - 56, c[1] + 40];
      stroke(k, [A, [B[0], B[1], 1], [D[0], D[1], 1], [A[0], A[1], 1]], { z, w: 4, draw: p });
      const m = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], ab = m(A, B), bd = m(B, D), da = m(D, A);
      stroke(k + '.in', [ab, [bd[0], bd[1], 1], [da[0], da[1], 1], [ab[0], ab[1], 1]], { z, w: 3.5, draw: clamp(p * 2 - 1) });
    },
    pi(k, c, p, z) {
      const x = c[0], y = c[1];
      stroke(k + '.a', [[x - 46, y - 22], [x - 26, y - 34], [x + 20, y - 34], [x + 46, y - 30]], { z, w: 6, draw: clamp(p * 3) });
      stroke(k + '.b', [[x - 16, y - 32], [x - 18, y + 6], [x - 30, y + 36]], { z, w: 6, draw: clamp(p * 3 - 1) });
      stroke(k + '.c', [[x + 14, y - 32], [x + 12, y + 22], [x + 22, y + 36], [x + 34, y + 28]], { z, w: 6, draw: clamp(p * 3 - 2) });
    },
    dots(k, c, p, z) {   // triangles of dots: 1, 3, 6
      const pts = [[-66, 0]];
      [[-28, -8], [-36, 8], [-20, 8]].forEach(q => pts.push(q));
      [[30, -16], [22, 0], [38, 0], [14, 16], [30, 16], [46, 16]].forEach(q => pts.push(q));
      pts.forEach(([dx, dy], i) => { if (i / pts.length < p) dot(k + i, [c[0] + dx, c[1] + dy], 6, C.ink, z); });
    },
  };
  COMP.a5_bBubble = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1 + 0.15) return;
      const lt = t - fx.t0, pop = Math.max(0.01, EASE.back(clamp(lt / 0.25))) * (1 - EASE.in(clamp((t - fx.t1) / 0.15)));
      const [cx, cy] = fx.at, rx = fx.rx || 112, ry = fx.ry || 80, k = fx.id, z = Z.fx;
      DL.save(); DL.about(cx, cy, () => DL.scale(Math.max(0.01, pop)));
      stroke(k, ringPts(k, cx, cy, rx, ry, { n: 16, closed: true, rv: 0.02 }), { z, w: 4.5, closed: true, fill: C.paper });
      const a = F.anchors[fx.speaker];
      if (a) {   // a little tail toward the speaker's head
        const tg = a.headTop, d = dist([cx, cy], tg), ux = (tg[0] - cx) / d, uy = (tg[1] - cy) / d, phi = Math.atan2(uy / ry, ux / rx);
        const e = [cx + Math.cos(phi) * rx, cy + Math.sin(phi) * ry], L = clamp(dist(e, tg) - 26, 18, 64), tip = [e[0] + ux * L, e[1] + uy * L];
        const b1 = [cx + Math.cos(phi - 0.2) * rx * 0.97, cy + Math.sin(phi - 0.2) * ry * 0.97], b2 = [cx + Math.cos(phi + 0.2) * rx * 0.97, cy + Math.sin(phi + 0.2) * ry * 0.97];
        stroke(k + '.tf', [b1, [tip[0], tip[1], 1], [b2[0], b2[1], 1], [b1[0], b1[1], 1]], { z: z + 0.1, fill: C.paper, noStroke: true, w: 1 });
        stroke(k + '.t1', [[cx + Math.cos(phi - 0.2) * rx, cy + Math.sin(phi - 0.2) * ry], tip], { z: z + 0.2, w: 4 });
        stroke(k + '.t2', [[cx + Math.cos(phi + 0.2) * rx, cy + Math.sin(phi + 0.2) * ry], tip], { z: z + 0.2, w: 4 });
      }
      DOODLE[fx.doodle](k + '.d', [cx, cy], EASE.out(clamp((lt - 0.15) / 0.5)), z + 0.3);
      DL.restore();
    },
    cues: fx => [[fx.t0, 'boop']],
  };
  /** the cookie in his hand on its way to his mouth */
  COMP.a5_bBite = {
    draw(fx, t, F) {
      COOK.forEach((c, i) => {
        if (t < c || t >= c + 0.5) return;
        const a = F.anchors.terry; if (!a) return;
        const h = a.handL;
        stroke('a5b.bite' + i, ringPts('a5b.bite' + i, h[0] + 4, h[1] - 6, 11, 7, { n: 7, closed: true }), { z: Z.front + 1, w: 3, closed: true, fill: C.paper });
        dot('a5b.bited' + i, [h[0] + 6, h[1] - 7], 2, C.ink, Z.front + 1.1);
      });
    },
    cues: () => COOK.map(c => [c, 'plip']),
  };

  /* ---------------- poses & faces ---------------- */
  const SIT = POSE.sitBase;
  const abs = (x, y, bend = 'down') => ({ w: 1, to: 'abs', dx: x, dy: y, bend });
  Object.assign(POSE, {
    a5_bReachUp: { tilt: -8, lean: 2, armScale: 1.75, armR: [140, 10], armL: [16, 10] },
    a5_bPointL: { armScale: 1.5, armL: [80, 8], armR: [16, 10] },
    a5_bHold: { tilt: -4, armScale: 1.7, ikL: abs(BK.spine + BK.w - 4, 528), armR: [16, 10] },
    a5_bJump: { legL: [6, 20], legR: [6, 20], armScale: 1.6, armL: [110, 16], armR: [110, 16] },
    a5_bCookie: { ...SIT, armScale: 1.6, ikL: abs(948, 566), armR: [20, 14] },
    a5_bMunch: { ...SIT, armScale: 1.3, ikL: { w: 1, to: 'chin', dx: -0.25, dy: 0.06, bend: 'down' }, armR: [20, 14] },
    a5_bProfSit: { ...SIT, lean: 5, tilt: 3, armL: [20, 16], armR: [24, 20] },
    a5_bProfTalk: { ...SIT, lean: 5, tilt: -3, armR: [78, 36], armL: [20, 16] },
  });
  Object.assign(FACE, { a5_bMunch: { lidL: 0.3, lidR: 0.3, brow: 'arc', browY: 0.02, mouth: 'o' } });
  const kidSit = t => { const s = Math.sin(t * 5.2); return { ...SIT, armL: [20, 14], armR: [20, 14], legL: [62 + 14 * s, -57 + 8 * s], legR: [62 - 14 * s, -57 - 8 * s] }; };
  const profWave = t => ({ ...POSE.a5_bProfSit, armR: [125, 30 + 25 * Math.sin((t - WAVE0) * 11)] });
  const nod = t0 => [[t0, 1.05, 0.05], [t0 + 0.05, 1, 0.2, 'back']];
  const chew = c => t => 1 + 0.03 * Math.sin((t - c) * 26);

  defineScene({
    id: 'between', chapter: '又一年', dur: DUR, floor: FL,
    cast: { terry: E5.terry, prof: E5.prof },
    order: ['prof', 'terry'],
    tracks: {
      terry: {
        pos: [[0, [-160, FL]], [T_IN0, [TX0, FL], T_IN1 - T_IN0, 'lin'], [T_WALK0, [TMX, FL], T_WALK1 - T_WALK0, 'lin'], [T_STEP0, [TBX, FL], 0.3, 'lin'],
          [T_GONE, [1780, FL], 0], [T_WALK3, [KX + 90, FL], T_SIT - T_WALK3, 'lin'], [T_SIT, jumpArc(T_SIT, 0.25, [KX + 90, FL], [KX, SEAT_A], 80), 0]],
        pose: [[0, makeWalk(T_IN0, T_IN1, 5.2, { lean: 5 })], [T_IN1, 'stand', 0.1], [GATE + 0.3, 'lookUp', 0.15], [TOP6 + 0.1, 'thinkStand', 0.14, 'back'], [GATE_OUT, 'stand', 0.15],
          [FLASH, 'kidCheer', 0.12, 'back'], [CARD_OUT, 'stand', 0.15],
          [T_WALK0, makeWalk(T_WALK0, T_WALK1, 5.6, { lean: 5 }), 0], [T_WALK1, 'stand', 0.1], [REACH_T, 'a5_bReachUp', 0.12, 'back'], [PULL + 0.4, 'a5_bPointL', 0.14, 'back'],
          [T_STEP0, makeWalk(T_STEP0, T_STEP0 + 0.3, 5, { lean: -4 }), 0], [BOOK + 0.35, 'a5_bHold', 0.12, 'back'],
          [T_WALK3, makeWalk(T_WALK3, T_SIT, 5.2, { lean: -5 }), 0], [T_SIT, 'a5_bJump', 0.06], [T_SIT + 0.25, kidSit, 0],
          ...COOK.flatMap(c => [[c - 0.3, 'a5_bCookie', 0.14, 'back'], [c + 0.05, 'a5_bMunch', 0.14], [c + 0.55, kidSit, 0.15]])],
        face: [[0, 'smile'], [GATE + 0.3, 'surprised', 0.05], [GATE + 1.2, 'neutral', 0.08], [TOP6 + 0.1, 'focus', 0.06], [GATE_OUT, 'neutral', 0.08],
          [CARD[0] + 0.5, 'smile', 0.06], [CARD[2] + 0.5, 'grin', 0.06], [FLASH, 'joy', 0.05], [CARD_OUT, 'smile', 0.08],
          [ENV_T[0], 'surprised', 0.05], [ENV_T[0] + 0.6, 'smile', 0.08], [PULL + 0.4, 'idea', 0.05], [PULL + 1.1, 'grin', 0.06],
          [BOOK + 0.3, 'surprised', 0.05], [BOOK + 0.9, 'smile', 0.08], [BOOK_OPEN, 'focus', 0.06], [FLIPS[2], 'idea', 0.05],
          [T_WALK3, 'smile', 0], [BUB[0] + 0.3, 'idea', 0.06], [BUB[1], 'grin', 0.06],
          ...COOK.flatMap(c => [[c + 0.05, 'a5_bMunch', 0.06], [c + 0.6, 'grin', 0.06]])],
        turn: [[0, 0.35], [T_IN1, 0.25, 0.1], [GATE_OUT, 0.35, 0.1], [T_WALK0, 0.4, 0.1], [PULL + 0.4, -0.35, 0.1], [T_STEP0, -0.3, 0.1], [T_WALK3, -0.45, 0], [T_SIT + 0.25, -0.35, 0.1]],
        gaze: [[0, [800, 500]], [FLAG, [1440, 487]], [GATE + 0.3, [860, 300]], [TOP6, [860, 356]], [CARD[0], [660, 420]], [CARD[1], [990, 420]], [CARD[2], [1320, 420]], [FLASH, 'viewer'],
          [ENV_T[0], [1150, 420]], [T_WALK0, [1000, 470]], [PULL + 0.3, [600, 330]], [BOOK, [900, 200]], [BOOK + 0.4, [520, 430]], [FLIPS[0], [460, 430]], [T_WALK3, [700, 500]],
          [T_SIT + 0.3, 'prof'], [BUB[1], 'viewer'], [BUB[1] + 0.8, 'prof'], [BUB[3], 'viewer'], [BUB[3] + 0.8, 'prof']],
        squash: [[0, 1], ...CARD.flatMap(c => nod(c + 0.5)), [FLASH, 1.08, 0.05], [FLASH + 0.05, 1, 0.22, 'back'], [BOOK + 0.45, 1.06, 0.05], [BOOK + 0.5, 1, 0.2, 'back'],
          [T_SIT + 0.25, 0.9, 0.04], [T_SIT + 0.29, 1, 0.2, 'back'], ...COOK.flatMap(c => [[c + 0.05, chew(c), 0.05], [c + 0.55, 1, 0.1]])],
      },
      prof: {
        enter: PROF_IN,
        pos: [[0, [PX, SEAT_A]]],
        pose: [[0, 'a5_bProfSit'], [WAVE0, profWave, 0.12], [WAVE1, 'a5_bProfSit', 0.15], [BUB[0] - 0.05, 'a5_bProfTalk', 0.14, 'back'], [BUB[1], 'a5_bProfSit', 0.15],
          [BUB[2] - 0.05, 'a5_bProfTalk', 0.14, 'back'], [BUB[3], 'a5_bProfSit', 0.15]],
        face: [[0, 'smile'], [BUB[0], 'grin', 0.06], [BUB[1], 'idea', 0.05], [BUB[2], 'grin', 0.06], [BUB[3], 'laugh', 0.05]],
        turn: [[0, 0.35]],
        gaze: [[0, [1300, 560]], [T_SIT, 'terry']],
        squash: [[0, 1], ...nod(32.3), ...nod(BUB[1] + 0.2)],
      },
    },
    fx: [
      { type: 'a5_bStamps', id: 'a5b.stamps', seq: STAMPS },
      // 1 · the gate
      { type: 'a5_bLayer', id: 'a5b.flagL', t0: FLAG, t1: GATE_OUT + 0.3, fo: GATE_OUT, paint: flagPaint, sfxAt: [[FLAG, 'pop']] },
      { type: 'a5_bLayer', id: 'a5b.gateL', t0: GATE, t1: GATE_OUT + 0.3, fo: GATE_OUT, paint: gatePaint, sfxAt: [[GATE, 'paper'], [GTXT, 'pop'], [SIGN, 'swish'], [TOP6, 'pop'], [RING6, 'pen']] },
      // 2 · three team lists
      { type: 'a5_bCards', id: 'a5b.cards' },
      // 3 · practice sets by post
      { type: 'a5_bLayer', id: 'a5b.mailL', t0: MBOX, t1: MAIL_OUT + 0.3, fo: MAIL_OUT, paint: mailPaint, sfxAt: [[MBOX, 'paper']] },
      { type: 'a5_bMail', id: 'a5b.mail' },
      { type: 'a5_bNote', id: 'a5b.n5', text: '（他后来写的书里，引用过这些练习题）', at: [760, 132], rot: -2, t0: NOTE5, t1: MAIL_OUT + 0.4 },
      // 4 · the book
      { type: 'a5_bBook', id: 'a5b.book' },
      { type: 'a5_bNote', id: 'a5b.n6', text: ['（他说：比赛那几年，', '从这本书学了很多）'], at: [400, 172], rot: -2, t0: NOTE6, t1: BOOK_OUT + 0.3 },
      { type: 'a5_bFadeKeys', id: 'a5b.tfade', prefix: 'terry.', f0: BOOK_OUT, fd: 0.3, until: T_GONE + 0.05 },
      // 5 · tea at the professor's
      { type: 'a5_bLayer', id: 'a5b.roomL', t0: ROOM, paint: roomPaint },
      { type: 'prop', id: 'a5b.tea', kind: 'e5_tea', at: [800, 584], t0: ROOM, drawDur: 0.5, cookies: [[0, 5], ...COOK.map((c, i) => [c, 4 - i])] },
      { type: 'a5_bNote', id: 'a5b.n7', text: '（每个周末）', at: [800, 176], rot: -3, t0: NOTE7, t1: 32.6 },
      { type: 'a5_bBubble', id: 'a5b.bb0', speaker: 'prof', doodle: 'spiral', at: [370, 250], t0: BUB[0], t1: BUB[0] + 1.8 },
      { type: 'a5_bBubble', id: 'a5b.bb1', speaker: 'terry', doodle: 'tri', at: [1200, 330], rx: 105, ry: 78, t0: BUB[1], t1: BUB[1] + 1.8 },
      { type: 'a5_bBubble', id: 'a5b.bb2', speaker: 'prof', doodle: 'pi', at: [370, 250], t0: BUB[2], t1: BUB[2] + 1.8 },
      { type: 'a5_bBubble', id: 'a5b.bb3', speaker: 'terry', doodle: 'dots', at: [1200, 330], rx: 105, ry: 78, t0: BUB[3], t1: DUR + 1 },
      { type: 'a5_bBite', id: 'a5b.bite' },
      { type: 'a5_bFadeAll', id: 'a5b.end', f0: FADE0, fd: DUR - 0.05 - FADE0 },
    ],
    sfx: [[PROF_IN, 'pop'], [ROOM, 'paper'], [T_SIT, 'hop'], [T_SIT + 0.25, 'thud'], [REACH_T, 'boop']],
    steps: [{ t0: T_IN0, t1: T_IN1, hz: 5.2 }, { t0: T_WALK0, t1: T_WALK1, hz: 5.6 }, { t0: T_STEP0, t1: T_STEP0 + 0.3, hz: 5 }, { t0: T_WALK3, t1: T_SIT, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 5.1, text: '想去国际奥数，每年都要重新考进国家队：' },
      { t0: 5.2, t1: 8.8, text: '全国选拔考试，只取前六名。' },
      { t0: 9.3, t1: 13.9, text: '1986年、1987年、1988年：', say: '一九八六年，一九八七年，一九八八年：' },
      { t0: 14.2, t1: 17.4, text: '三年，他次次都考进了！' },
      { t0: 18.1, t1: 22.9, text: '奥数委员会会把一套套练习题，寄到家里。' },
      { t0: 24.0, t1: 28.6, text: '他还读了一本有名的书：《怎样解题》。' },
      { t0: 29.6, t1: 33.8, text: '周末，他常去一位退休的老教授家，' },
      { t0: 33.9, t1: 38.3, text: '一边喝茶吃点心，一边聊好玩的数学。' },
    ],
  });
})();
