// 第 50 场 · 偶数都不行？（id evens）。代理 D，前缀 d1_。
// 数学（ep1-script.md，自己验算过）：2 试 4 − 2、6 试 9 − 3（2、3 不是平方，红色小"?"）；
// 反例 4 = 2² − 0²（2×2 什么也不拿掉）、8 = 3² − 1² = 9 − 1（3×3 拿掉左下 1×1）、12 = 4² − 2² = 16 − 4（4×4 拿掉左下 2×2）。
// 漫士那期：只画一块"猜了八十年"的大牌子被一大片点推倒；不画人、不写猜想名字、点画得多（不暗示反例简单）。
// 开场：空舞台，Jasper 和小问号在 0.3 秒内蹦出来。结尾前 0.6 秒全部淡出。
// 字幕：L13 起后移 1.0 秒（给"4 跳上木牌、木牌被压倒砸头"留一拍），L16 起再后移 0.6 秒（换画面）；dur 80.4 → 83.2。
// L13：4 先往上拱再落到木牌右端（不穿过算式），停在牌上；木牌在它的重量下倒在 Jasper 头上，4 一直坐在倒下的牌上，L15 的"反例"直接指着它。
(() => {
  const FL = N1.FL, DUR = 83.2, JX = 520, QX = 1150, QS = 150;

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    kid: 0.05, qm: 0.15,
    // L1: 奇数 ✓ 偶数 ?
    odd: 0.45, oddT: 0.85, even: 2.0, evenQ: 2.35, hdOut: 10.8,
    // L2: the scrap paper — 2 = 4 − 2 ?, 6 = 9 − 3 ?
    sheet: 4.15, w1: 4.4, w2: 5.75, puz: 7.0,
    // L3–L5: the sign, the "猜想" tag, the question mark's question
    sign: 7.95, tag: 11.4, qs1: 15.45, qs1Out: 19.3,
    // L6–L7: plant the sign, "还没找到", think
    toss: 19.8, plant: 20.25, nf: 20.6, think: 20.55, shOut: 24.1,
    // L7: Jasper shades his eyes and looks right; pale "?" where 4, 8, 12 will turn up
    shade: 24.3, phA: 24.7, phB: 25.1, phC: 25.5, phOut: 28.75, phAOut: 32.6,
    // L8: "0 也算" — the card
    card: 29.4, qs2: 29.4, flash: 31.0, qs2Out: 32.6, cardOut: 35.6,
    // L9–L11: 4, 8, 12
    A: 33.0, eqA1: 33.3, ring0: 34.55, eqA2: 35.6, tkA: 35.95, cheerA: 36.3, mkA: 36.45,
    B: 38.7, eqB1: 39.0, cutB: 39.75, eqB2: 41.45, tkB: 41.85, mkB: 42.25,
    C: 43.3, eqC1: 43.6, cutC: 44.35, eqC2: 45.95, tkC: 46.4, cheerC: 46.5, mkC: 46.8,
    // L12: the thick corner of 12
    thick: 48.1,
    // L13: 4 hops (up, over its sum) onto the sign's right end; under its weight the sign tips onto Jasper's head; 4 stays on it
    hop: 51.75, land: 52.25, tip0: 52.55, bonk: 52.95, laugh: 53.3,
    // L14–L15 (the fallen sign, with 4 on it, stays on his head until everything clears at arrOut)
    rub: 56.95, rubEnd: 58.5, fanli: 61.75, arrOut: 66.0,
    // L16–L18: the big sign in a video frame, knocked flat by a big field of dots
    frame: 66.75, big: 67.25, bigTxt: 70.0, crowd: 74.3, rush: 74.85, hit: 75.2, frOut: 77.55,
    // L19
    con: 78.15, band: 79.6, end: 82.6,
  };

  /* ---------------- geometry ---------------- */
  // Jasper's sign (a local n1_sign with a longer pole): board SW × SH, pole SP below the board
  const SW = 360, SH = 96, SP = 300, SR = SP + SH / 2;
  const HELD = [420, 392];                   // board centre while he holds it up (his hand on the pole at GRIP)
  const GRIP = [420, 585];
  const BASE = [300, FL];                    // where it is planted
  const PLANT = [BASE[0], FL - SR];
  // his hair top (kid H 255: head centre ≈ 597.5, messy hair 1.24 r above) — the tip angle where the board's lower edge meets it
  const HAIR = [JX, 531];
  const TIP = (() => {
    const dx = HAIR[0] - BASE[0], dy = FL - HAIR[1], d = Math.hypot(dx, dy), phi = Math.atan2(dx, dy) / RAD;
    return phi - Math.acos(SP / d) / RAD;    // ≈ 16°
  })();
  const rotAbout = th => [BASE[0] + SR * Math.sin(th * RAD), FL - SR * Math.cos(th * RAD)];
  // the counter-examples: three dot squares, bottom rows on y = 232
  const G = 52, ROW = 232, EQY = 262, EQS = 46;
  const COL = { A: 610, B: 965, C: 1335 };
  const AX = COL.A - G / 2, AY = ROW - G;                       // 2×2: top-left dot
  const BX = COL.B - G, BY = ROW - 2 * G;                       // 3×3
  const CX = COL.C - 1.5 * G, CY = ROW - 3 * G;                 // 4×4
  // the 2×2 hops onto the right end of the planted board: in board-local coords its top-left dot sits at (lx, LY)
  // (bottom dots resting on the board's top edge); it lands at LX0 and slides to LX1 while the board tips
  const LY = -SH / 2 - G * 0.2 - 2 - G, LX0 = 66, LX1 = 104;
  const LANDG = [PLANT[0] + LX0 - AX, PLANT[1] + LY - AY];          // flight offset at the landing
  const flyOff = u => [LANDG[0] * (1 - (1 - u) * (1 - u)), LANDG[1] * u * u - 130 * Math.sin(Math.PI * u)];   // left first, up, then drop
  const tipU = t => clamp((t - T.tip0) / (T.bonk - T.tip0));
  /** where the 2×2 is: null = at home, {off} = in the air, {lx} = riding on the board */
  function blk(t) {
    if (t < T.hop) return null;
    if (t < T.land) return { off: flyOff((t - T.hop) / (T.land - T.hop)) };
    return { lx: lerp(LX0, LX1, EASE.in(tipU(t))) };
  }
  // the video frame (L16–L18) and what is inside it
  const FR = { cx: 800, cy: 295, w: 1040, h: 390 };
  const GND = 432, BIG = { base: [640, GND], P: 150, w: 420, h: 110 };
  const CR = { x0: 1000, y0: 244, nc: 12, nr: 9, g: 22, r: 6.5, push: -138 };

  /** where Jasper's sign is at time t: board centre c, rotation rot (deg), opacity op — or null */
  function signAt(t) {
    if (t < T.sign) return null;
    if (t < T.toss) { const u = EASE.back(clamp((t - T.sign) / 0.3)); return { c: [HELD[0], HELD[1] + (1 - u) * 30], rot: 0, op: 1 }; }
    if (t < T.plant) {
      const u = (t - T.toss) / (T.plant - T.toss), e = EASE.io(u);
      return { c: [lerp(HELD[0], PLANT[0], e), lerp(HELD[1], PLANT[1], e) - 70 * Math.sin(Math.PI * u)], rot: -14 * Math.sin(Math.PI * u), op: 1 };
    }
    let th = 0;
    if (t < T.land) { const v = (t - T.plant) / 0.5; if (v < 1) th = 3.5 * Math.sin(v * 3 * Math.PI) * (1 - v); }
    else if (t < T.tip0) { const v = t - T.land; th = 2.2 * EASE.out(clamp(v / 0.12)) + 0.7 * Math.sin(v * 31) * (1 - clamp(v / 0.3)); }   // 4 lands: the board dips and creaks
    else {
      th = lerp(2.2, TIP, EASE.in(tipU(t)));                                                          // … then tips under its weight
      const w = (t - T.bonk) / 0.3; if (w > 0 && w < 1) th -= 2.2 * Math.sin(Math.PI * w);
    }
    const op = 1 - clamp((t - T.arrOut) / 0.35);
    return op > 0 ? { c: rotAbout(th), rot: th, op } : null;
  }
  /** board-local point → stage, at time t (for the 2×2 riding on the board) */
  const onBoard = (t, p) => { const s = signAt(t) || { c: PLANT, rot: 0 }, a = s.rot * RAD; return [s.c[0] + p[0] * Math.cos(a) - p[1] * Math.sin(a), s.c[1] + p[0] * Math.sin(a) + p[1] * Math.cos(a)]; };
  /** centre (and a point just right of it) of the 2×2, wherever it is */
  const blkPt = (t, dx = 0) => {
    const b = blk(t);
    if (!b) return [COL.A + dx, ROW - G / 2];
    if (b.off) return [COL.A + b.off[0] + dx, ROW - G / 2 + b.off[1]];
    return onBoard(t, [b.lx + G / 2 + dx, LY + G / 2]);
  };

  /* ---------------- components ---------------- */
  const box = (k, x0, y0, x1, y1, o) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], o);

  /** fades (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: keep these at the end of fx */
  COMP.d1_fade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.35));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** the 2×2 (another fx): at home, in the air, or riding on the board (drawn in the board's own frame) */
  COMP.d1_move = {
    init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const b = blk(t), s = signAt(t); DL.save();
      if (b && b.off) DL.translate(b.off[0], b.off[1]);
      else if (b && s) { DL.translate(s.c[0], s.c[1]); DL.rotate(s.rot); DL.translate(b.lx - AX, LY - AY); }
      COMP[fx.inner.type].draw(fx.inner, t, F); DL.restore();
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };
  /** Jasper's sign (local version of PROPS.n1_sign: longer pole, a red "猜想" tag on its top-left corner) */
  COMP.d1_sign = {
    draw(fx, t) {
      const s = signAt(t); if (!s) return;
      const k = fx.id, p = EASE.out(clamp((t - T.sign) / 0.3)), o = s.op;
      DL.save(); DL.translate(s.c[0], s.c[1]); DL.rotate(s.rot);
      stroke(k + '.pole', [[0, SH / 2], [0, SH / 2 + SP]], { z: Z.front, w: 7, draw: p, opacity: o });
      box(k + '.b', -SW / 2, -SH / 2, SW / 2, SH / 2, { z: Z.front, w: 5, fill: '#F3E3C3', draw: p, opacity: o });
      text(k + '.t', fx.text, 0, 2, { size: 46, z: Z.front + 0.2, anchor: 'middle', opacity: clamp(p * 2 - 0.8) * o });
      const tu = clamp((t - T.tag) / 0.25);
      if (tu > 0) {
        DL.translate(-SW / 2 + 54, -SH / 2 - 8); DL.rotate(-8); DL.scale(Math.max(0.01, lerp(1.6, 1, EASE.back(tu))));
        box(k + '.tag', -54, -29, 54, 29, { z: Z.front + 0.5, w: 4, color: C.red, fill: '#FFFFFF', opacity: clamp(tu * 3) * o });
        text(k + '.tagT', '猜想', 0, 1, { size: 40, color: C.red, z: Z.front + 0.6, opacity: clamp(tu * 3) * o });
      }
      DL.restore();
      // a little dust where the pole goes into the ground
      const v = (t - T.plant) / 0.45;
      if (v > 0 && v < 1) [-1, 1].forEach((sg, i) => stroke(`${k}.dust${i}`, [[BASE[0] + sg * (14 + 30 * v), FL - 4], [BASE[0] + sg * (34 + 30 * v), FL - 18 - 8 * v]], { z: Z.fx, w: 3, color: C.pencil, opacity: 1 - v }));
    },
    cues: () => [[T.sign, 'whip'], [T.tag, 'stamp'], [T.toss, 'whoosh'], [T.plant, 'thud'], [T.land, 'tap'], [T.bonk, 'thud']],
  };
  /** the scrap paper with a folded corner */
  COMP.d1_sheet = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.35)), k = fx.id, [x0, y0, x1, y1] = fx.box, z = Z.set + 0.5;
      stroke(k + '.o', [[x0, y0], [x1 - 34, y0, 1], [x1, y0 + 34, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 3.5, fill: C.paper, draw: p });
      stroke(k + '.ear', [[x1 - 34, y0], [x1 - 34, y0 + 34, 1], [x1, y0 + 34]], { z: z + 0.1, w: 2.5, draw: clamp(p * 2 - 1) });
      [fx.rules || []].flat().forEach((y, i) => stroke(`${k}.r${i}`, [[x0 + 24, y], [x1 - 24, y]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.55 * p, boil: 0.4 }));
    },
    cues: fx => [[fx.t0, 'paper']],
  };
  /** the scope card from scene six, with its second line ("…后一个可以是 0") enlarged and flashed red, then underlined */
  const CL1 = '两个数都是 0 或正整数', CL2a = '前一个比后一个大；', CL2 = CL2a + '后一个可以是 0';
  PROPS.d1_card = (fx, t, lt, p) => {
    PROPS.n1_card({ ...fx, lines: [CL1] }, t, lt, p);
    // ZCOOL's CJK advance is 0.915 em (measured), textWidth counts 1 em: KW corrects the underline's ends
    const KW = 0.915, k = fx.id, w = fx.w, h = fx.h, z = Z.annot - 1, y = -h / 2 + 62 + 50, x0 = -w / 2 + 28;
    const fl = (t - T.flash) / 0.7, pulse = fl > 0 && fl < 1 ? Math.sin(Math.PI * fl) : 0;
    text(k + '.l1', CL2, x0, y, { size: 36, font: CFG.FONT_MIX, z: z + 0.3, anchor: 'start', scale: 1 + 0.1 * pulse, color: pulse > 0.05 ? C.red : C.ink, opacity: clamp(p * 3 - 1.3) });
    const u = EASE.out(clamp((t - T.flash - 0.35) / 0.3));
    if (u > 0) stroke(k + '.ul', [[x0 + KW * textWidth(CL2a, 36), y + 26], [x0 + KW * textWidth(CL2, 36), y + 24]], { z: z + 0.4, w: 4, color: C.red, draw: u });
  };
  /** red loop round the thick corner of 12 (the 4×4 without its bottom-left 2×2) */
  COMP.d1_thick = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const pd = 30, xa = CX - pd, xb = CX + 2 * G - pd, xc = CX + 3 * G + pd, ya = CY - pd, yb = CY + G + pd, yc = CY + 3 * G + pd;
      stroke(fx.id, [[xa, ya], [xc, ya, 1], [xc, yc, 1], [xb, yc, 1], [xb, yb, 1], [xa, yb, 1], [xa, ya - 4, 1]], { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((t - fx.t0) / 0.6)) });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /** the red star where the board hits his head */
  COMP.d1_star = {
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0 || lt >= fx.dur) return;
      const [x, y] = fx.at, s = Math.max(0.01, EASE.back(clamp(lt / 0.22))), op = 1 - clamp((lt - fx.dur + 0.35) / 0.35), k = fx.id;
      const pts = []; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * RAD, r = (i % 2 ? 0.45 : 1) * fx.r; pts.push([Math.cos(a) * r, Math.sin(a) * r, 1]); }
      pts.push([pts[0][0], pts[0][1], 1]);
      DL.save(); DL.translate(x, y - 12 * clamp(lt / fx.dur)); DL.rotate(10 * Math.sin(lt * 5)); DL.scale(s);
      stroke(k + '.s', pts, { z: Z.fx, w: 3.5, color: C.red, fill: C.red, opacity: op, boil: 0.3 });
      DL.restore();
      const lu = clamp(lt / 0.25), lo = 1 - clamp((lt - 0.35) / 0.3);
      if (lo > 0) [-40, 0, 40].forEach((a, i) => {
        const ang = (a - 150) * RAD, r0 = fx.r + 10, r1 = r0 + 20 * lu;
        stroke(`${k}.l${i}`, [[x + Math.cos(ang) * r0, y + Math.sin(ang) * r0], [x + Math.cos(ang) * r1, y + Math.sin(ang) * r1]], { z: Z.fx, w: 3.5, color: C.red, opacity: lo });
      });
    },
    cues: fx => [[fx.t0 + 0.05, 'plip']],
  };
  /** a plain video frame: rounded screen, a play triangle, a progress bar, a pencil ground line */
  COMP.d1_frame = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.45)), k = fx.id, z = Z.set + 1, x0 = FR.cx - FR.w / 2, x1 = FR.cx + FR.w / 2, y0 = FR.cy - FR.h / 2, y1 = FR.cy + FR.h / 2;
      stroke(k + '.o', superPts(FR.cx, FR.cy, FR.w, FR.h, 36, 9), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
      stroke(k + '.pl', [[x0 + 40, y0 + 26], [x0 + 70, y0 + 44, 1], [x0 + 40, y0 + 62, 1], [x0 + 40, y0 + 24, 1]], { z: z + 0.1, w: 3.5, draw: stag(p, 1, 3) });
      const bar = y1 - 26, xs = x0 + 50, xe = x1 - 50;
      stroke(k + '.bar', [[xs, bar], [xe, bar]], { z: z + 0.1, w: 3, color: C.pencil, draw: stag(p, 2, 3) });
      if (p > 0.9) dot(k + '.knob', [xs + Math.min(xe - xs, (t - fx.t0) * 30), bar], 7, C.ink, z + 0.2);
      stroke(k + '.gnd', [[x0 + 30, GND], [x1 - 30, GND]], { z: z + 0.1, w: 2.4, color: C.pencil, draw: stag(p, 2, 3), opacity: 0.8 });
    },
    cues: fx => [[fx.t0, 'paper']],
  };
  /** the big "猜了八十年" sign inside the frame: drawn on, lettered at L17, pushed (leans) and knocked flat at `hit` */
  const BIGTXT = '猜了八十年';
  COMP.d1_big = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.45)), k = fx.id, { base, P, w, h } = BIG;
      const lean = -13 * EASE.out(clamp((t - T.hit) / 0.16)), fall = EASE.in(clamp((t - T.hit - 0.14) / 0.28));
      const bounce = (t - T.hit - 0.42) / 0.25, sy = lerp(1, 0.09, fall) * (bounce > 0 && bounce < 1 ? 1 + 0.6 * Math.sin(Math.PI * bounce) : 1);
      DL.save(); DL.translate(base[0], base[1]); DL.rotate(lean * (1 - 0.7 * fall)); DL.scale(1, sy);
      stroke(k + '.pole', [[0, 0], [0, -P]], { z: Z.front, w: 8, draw: p });
      box(k + '.b', -w / 2, -P - h, w / 2, -P, { z: Z.front, w: 6, fill: '#F3E3C3', draw: p });
      const n = t < T.bigTxt ? 0 : Math.min(BIGTXT.length, Math.floor((t - T.bigTxt) * 5) + 1);
      if (n) text(k + '.t', [...BIGTXT].slice(0, n).join(''), -textWidth(BIGTXT, 64) / 2, -P - h / 2 + 2, { size: 64, z: Z.front + 0.2, anchor: 'start' });
      DL.restore();
      const v = (t - T.hit - 0.42) / 0.5;   // dust where it slams down
      if (v > 0 && v < 1) for (let i = 0; i < 4; i++) {
        const sx = i < 2 ? -1 : 1, x = base[0] + sx * (w / 2 + 6 + 26 * v) - (i % 2) * sx * 40;
        stroke(`${k}.d${i}`, ringPts(`${k}.d${i}`, x, GND - 10 - 6 * v, 12 + 8 * v, 7 + 4 * v, { n: 8, closed: true }), { z: Z.fx, w: 2.5, color: C.pencil, closed: true, opacity: 1 - v });
      }
    },
    cues: () => [[T.bigTxt, 'pen'], [T.hit, 'whip'], [T.hit + 0.42, 'thud']],
  };
  /** the big field of dots (the counter-example): pops in, rushes left into the sign */
  COMP.d1_crowd = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id, ru = clamp((t - T.rush) / (T.hit - T.rush)), off = CR.push * (t < T.hit ? EASE.in(ru) : 1);
      for (let i = 0; i < CR.nr; i++) for (let j = 0; j < CR.nc; j++) {
        const t0 = fx.t0 + (CR.nr - 1 - i) * 0.035 + (CR.nc - 1 - j) * 0.012, u = clamp((t - t0) / 0.2); if (u <= 0) continue;
        dot(`${k}.${i}_${j}`, [CR.x0 + j * CR.g + off, CR.y0 + i * CR.g], CR.r * Math.max(0.01, EASE.back(u)), C.ink, Z.front + 0.5);
      }
      const sl = ru > 0 ? 1 - clamp((t - T.hit) / 0.4) : 0;   // speed lines while it rushes
      if (sl > 0) [0, 1, 2].forEach(i => {
        const y = CR.y0 + 30 + i * 60, x = CR.x0 + (CR.nc - 1) * CR.g + off + 24;
        stroke(`${k}.sl${i}`, [[x, y], [x + 80 - i * 14, y]], { z: Z.fx, w: 3, color: C.pencil, opacity: sl, draw: EASE.out(ru) });
      });
    },
    cues: fx => [[fx.t0, 'pop'], [fx.t0 + 0.2, 'pop'], [T.rush, 'whoosh']],
  };

  /* ---------------- the written lines ---------------- */
  // scrap paper: 2 = 4 − 2 ? / 6 = 9 − 3 ?   (a red "?" by the number that is not a square)
  const SH0 = [760, 198, 1262, 418];
  const W1 = { type: 'write', id: 'd1w1', text: '2 = 4 − 2', x: 800, y: 228, size: 60, speed: 3200, gap: 0.02, glyphGap: 0.02, t0: T.w1, sfx: 'pen', t1: T.shOut + 0.37 };
  const W2 = { type: 'write', id: 'd1w2', text: '6 = 9 − 3', x: 800, y: 320, size: 60, speed: 3200, gap: 0.02, glyphGap: 0.02, t0: T.w2, sfx: 'pen', t1: T.shOut + 0.37 };
  layoutWriting(W1); layoutWriting(W2);
  const Q1 = { type: 'write', id: 'd1q1', text: '?', x: W1.x + W1.width + 18, y: 214, size: 52, speed: 3000, color: 'red', t0: W1.tEnd + 0.08, sfx: 'pen', t1: T.shOut + 0.37 };
  const Q2 = { type: 'write', id: 'd1q2', text: '?', x: W2.x + W2.width + 18, y: 306, size: 52, speed: 3000, color: 'red', t0: W2.tEnd + 0.08, sfx: 'pen', t1: T.shOut + 0.37 };
  // the three counter-examples: "2² − 0² " then "= 4" (written when he says the answer), centred under each square
  const eq = (id, a, b, cx, t1, t2) => {
    const full = layoutWriting({ text: a + b, x: 0, y: 0, size: EQS, t0: 0, speed: 1 });
    const p1 = { type: 'write', id: id + '1', text: a, x: cx - full.width / 2, y: EQY, size: EQS, speed: 2600, t0: t1, t1: T.arrOut + 0.37 };
    layoutWriting(p1);
    const p2 = { type: 'write', id: id + '2', text: b, x: p1.xEnd, y: EQY, size: EQS, speed: 2600, t0: t2, t1: T.arrOut + 0.37 };
    layoutWriting(p2);
    return [p1, p2];
  };
  const EA = eq('d1eqA', '2² − 0² ', '= 4', COL.A, T.eqA1, T.eqA2);
  const EB = eq('d1eqB', '3² − 1² ', '= 8', COL.B, T.eqB1, T.eqB2);
  const EC = eq('d1eqC', '4² − 2² ', '= 12', COL.C, T.eqC1, T.eqC2);
  const markAt = e => [e[1].x + e[1].width + 34, EQY + EQS / 2];
  const tick = (id, x, y, t0) => ({ type: 'write', id, text: '✓', x, y, size: 50, speed: 3000, color: 'red', t0, sfx: 'pen', t1: T.arrOut + 0.37 });
  { // check: the 2×2's flight (up first, then down onto the board) never crosses its own sum "2² − 0² = 4 ┐" or its tick
    const r = G * 0.2 + 4, x1 = markAt(EA)[0] + 24, bad = [];
    const hit = (o, b) => AX + o[0] - r < b[2] && AX + G + o[0] + r > b[0] && AY + o[1] - r < b[3] && AY + G + o[1] + r > b[1];
    const sum = [EA[0].x - 6, EQY - 6, x1, EQY + EQS + 6];
    for (let u = 0.15; u <= 1.0001; u += 0.01) if (hit(flyOff(u), sum)) bad.push(+u.toFixed(2));
    if (bad.length) console.error('d1 evens: the 2×2 flies through its sum at u =', bad.join(','));
  }
  /** a pale pencil "?" where a counter-example will turn up (L7) */
  COMP.d1_ph = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, s = Math.max(0.01, EASE.back(clamp(lt / 0.25)));
      text(fx.id, '?', fx.at[0], fx.at[1] - 4 * Math.sin(lt * 2.4 + fx.at[0]), { size: 96, font: CFG.FONT_MIX, color: C.pencil, z: Z.set + 1, scale: s, rot: -6 + 4 * Math.sin(fx.at[0]), opacity: 0.85 });
    },
    cues: fx => [[fx.t0, 'plip']],
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    d1_hold: { lean: -2, tilt: -4, armScale: 1.5, ikL: { w: 1, to: 'abs', dx: GRIP[0], dy: GRIP[1], bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 28, dy: -6, bend: 'out' } },
    d1_ptL: { lean: -2, tilt: -5, armScale: 1.5, armL: [118, 12], armR: [16, 10] },
    d1_ptR: { lean: 2, tilt: 5, armScale: 1.5, armR: [122, 10], armL: [16, 10] },
    d1_ptR2: { lean: 2, tilt: 3, armScale: 1.5, armR: [108, 6], armL: [16, 10] },
    d1_laugh: { lean: -3, tilt: -6, armScale: 1.3, armL: [38, 44], armR: [38, 44] },
    d1_wow: { lean: -3, armScale: 1.4, armL: [62, 38], armR: [62, 38] },
    // hand over his brow, looking out to the right (L7: "let's go and look")
    d1_shade: { lean: 3, tilt: 7, armScale: 1.6, ikR: { w: 1, to: 'head', dx: 0.86, dy: -0.56, bend: 'out' }, ikL: { w: 1, to: 'hip', dx: -26, dy: -4, bend: 'out' } },
  });

  const QSIGN = [QX + 70 * QS / 200, FL - 262 * QS / 200];
  const sub = (t0, t1, text, o) => ({ t0, t1, text, ...o });

  defineScene({
    id: 'evens', chapter: '偶数都不行？', dur: DUR, floor: FL,
    cast: { kid: N1.kid },
    tracks: {
      kid: {
        enter: T.kid,
        pos: [[0, [JX, FL]]],
        pose: [[0, 'stand'], [4.3, 'd1_ptR', 0.12, 'back'], [T.puz, 'stand', 0.15], [T.sign, 'd1_hold', 0.15, 'back'], [T.toss, 'stand', 0.12],
          [T.think, 'thinkStand', 0.15, 'back'], [T.shade, 'd1_shade', 0.15, 'back'], [T.card, 'stand', 0.15],
          [T.A, 'd1_ptR', 0.12, 'back'], [T.cheerA, 'kidCheer', 0.12, 'back'], [37.6, 'stand', 0.15],
          [T.B, 'd1_ptR2', 0.12, 'back'], [42.0, 'stand', 0.15],
          [T.C, 'd1_ptR2', 0.12, 'back'], [T.cheerC, 'kidCheer', 0.12, 'back'], [47.7, 'akimbo', 0.15],
          [T.hop, 'stand', 0.12], [T.laugh, 'd1_laugh', 0.12, 'back'], [T.rub, 'scratchStand', 0.16], [T.rubEnd, 'stand', 0.2],
          [T.hit, 'd1_wow', 0.1, 'back'], [76.6, 'stand', 0.2]],
        face: [[0, 'smile'], [2.0, 'neutral', 0.1], [4.3, 'focus', 0.1], [T.puz, 'puzzled', 0.1], [T.sign, 'proudGrin', 0.06], [T.tag, 'smile', 0.1],
          [15.6, 'surprised', 0.06], [16.7, 'puzzled', 0.1], [T.shade, 'focus', 0.1], [T.card + 0.1, 'surprised', 0.06], [T.flash, 'idea', 0.06],
          [T.A, 'grin', 0.08], [T.tkA, 'joy', 0.06], [T.B, 'grin', 0.08], [T.tkB, 'joy', 0.06], [T.C, 'grin', 0.08], [T.tkC, 'joy', 0.06], [T.thick, 'proud', 0.1],
          [51.95, 'surprised', 0.06], [T.bonk, 'jaw', 0.04], [T.laugh, 'laugh', 0.08], [T.rub, 'grin', 0.1], [T.rubEnd, 'smile', 0.1],
          [T.fanli, 'grin', 0.08], [63.6, 'smile', 0.1], [T.frame, 'focus', 0.1], [T.hit, 'surprised', 0.05], [76.6, 'smile', 0.1], [T.band, 'proud', 0.1]],
        turn: [[0, 0], [4.3, 0.3, 0.15], [T.puz, 0, 0.15], [15.5, 0.35, 0.15], [T.toss, 0, 0.15], [T.think, -0.2, 0.15], [T.shade, 0.4, 0.15], [T.card, 0.3, 0.15],
          [T.A, 0.25, 0.15], [T.B, 0.3, 0.15], [T.C, 0.35, 0.15], [T.hop, -0.15, 0.12], [T.laugh, 0, 0.15], [T.frame, 0.1, 0.2], [T.con, 0, 0.2]],
        gaze: [[0, 'viewer'], [0.5, 'hdr'], [3.0, 'viewer'], [4.3, 'sheet'], [T.sign, 'viewer'], [T.tag + 0.05, 'tag'], [13.0, 'viewer'], [T.qs1, 'qmS'], [19.5, 'viewer'],
          [T.think, 'signB'], [T.shade, 'phB'], [T.phC, 'phC'], [26.8, 'phA'], [T.card, 'card'], [T.A, 'A'], [T.cheerA, 'viewer'], [T.B, 'B'], [42.0, 'viewer'],
          [T.C, 'C'], [T.cheerC, 'viewer'], [T.thick, 'C'], [T.hop, 'blk'], [T.bonk, 'viewer'], [T.fanli, 'blk'], [63.6, 'viewer'],
          [T.frame, 'frame'], [T.crowd, 'crowd'], [T.hit, 'big'], [76.6, 'viewer'], [T.con, 'con'], [80.2, 'viewer']],
        squash: [[0, 1], [T.cheerA, 1.06, 0.05], [T.cheerA + 0.05, 1, 0.2, 'back'], [T.cheerC, 1.06, 0.05], [T.cheerC + 0.05, 1, 0.2, 'back'],
          [T.bonk, 0.88, 0.05], [T.bonk + 0.05, 1, 0.28, 'back'], [T.hit + 0.42, 0.94, 0.05], [T.hit + 0.47, 1, 0.22, 'back']],
      },
    },
    targets: F => {
      const s = signAt(F.t);
      return {
        hdr: [800, 150], sheet: [1000, 300], tag: [HELD[0] - 126, HELD[1] - 56], signB: PLANT, signC: s ? s.c : PLANT, qmS: QSIGN,
        card: [1200, 215], A: [COL.A, ROW - G / 2], B: [COL.B, ROW - G], C: [COL.C, ROW - 1.5 * G], blk: blkPt(F.t), blkR: blkPt(F.t, G / 2 + 22),
        phA: [COL.A, ROW - G / 2], phB: [COL.B, ROW - G], phC: [COL.C, ROW - 1.5 * G],
        frame: [800, 300], crowd: [1100, 330], big: [640, 360], con: [800, 300],
      };
    },
    set: [{ type: 'floor', t0: 0 }],
    fx: [
      // L1: odd ✓, even ?
      { type: 'scribe', id: 'd1hOdd', text: '奇数', x: 640, y: 150, size: 60, cps: 6, anchor: 'middle', t0: T.odd, t1: T.hdOut + 0.37 },
      { type: 'write', id: 'd1hOddT', text: '✓', x: 690, y: 118, size: 60, speed: 2600, color: 'red', t0: T.oddT, sfx: 'pen', t1: T.hdOut + 0.37 },
      { type: 'scribe', id: 'd1hEven', text: '偶数', x: 900, y: 150, size: 60, cps: 6, anchor: 'middle', t0: T.even, t1: T.hdOut + 0.37 },
      { type: 'write', id: 'd1hEvenQ', text: '?', x: 952, y: 118, size: 60, speed: 2600, color: 'red', t0: T.evenQ, sfx: 'pen', t1: T.hdOut + 0.37 },

      // L2: the scrap paper
      { type: 'd1_sheet', id: 'd1sh', box: SH0, rules: [300, 392], t0: T.sheet, t1: T.shOut + 0.37 },
      W1, Q1, W2, Q2,
      // L6: still only "not found yet"
      { type: 'label', id: 'd1nf', text: '还没找到', size: 44, at: [1408, 300], rot: -3, target: [Q1.x + 36, 300], bend: 0, gap: 10, t0: T.nf, t1: T.shOut + 0.37 },

      // L7: pale "?" where 4, 8, 12 will turn up
      { type: 'd1_ph', id: 'd1phA', at: [COL.A, ROW - G / 2], t0: T.phA, t1: T.phAOut + 0.37 },
      { type: 'd1_ph', id: 'd1phB', at: [COL.B, ROW - G], t0: T.phB, t1: T.phOut + 0.37 },
      { type: 'd1_ph', id: 'd1phC', at: [COL.C, ROW - 1.5 * G], t0: T.phC, t1: T.phOut + 0.37 },

      // L8: the scope card (top right, above the question mark)
      { type: 'prop', kind: 'd1_card', id: 'd1card', at: [1200, 215], w: 640, h: 200, t0: T.card, t1: T.cardOut + 0.37, drawDur: 0.4, sfxAt: [[T.card, 'paper'], [T.flash, 'boop']] },

      // L9–L11: 4, 8, 12 — squares, sums, ticks, Jasper's marks
      { type: 'd1_move', id: 'd1Am', inner: { type: 'n1_dots', id: 'd1A', x: AX, y: AY, N: 2, gap: G, t0: T.A, t1: T.arrOut } },
      { type: 'n1_dots', id: 'd1B', x: BX, y: BY, N: 3, gap: G, t0: T.B, cut: { k: 1, t: T.cutB }, t1: T.arrOut },
      { type: 'n1_dots', id: 'd1C', x: CX, y: CY, N: 4, gap: G, t0: T.C, cut: { k: 2, t: T.cutC }, t1: T.arrOut },
      ...EA, ...EB, ...EC,
      { type: 'ring', id: 'd1r0', of: 'd1eqA1', glyph: 5, t0: T.ring0, t1: T.arrOut + 0.37 },
      tick('d1tkA', AX + G + 42, AY - 30, T.tkA),
      tick('d1tkB', BX + 2 * G + 42, BY - 30, T.tkB),
      tick('d1tkC', CX + 3 * G + 42, CY - 30, T.tkC),
      { type: 'prop', kind: 'n1_mark', id: 'd1mkA', at: markAt(EA), size: 40, t0: T.mkA, drawDur: 0.3, t1: T.arrOut + 0.37, sfxAt: [[T.mkA, 'pen']] },
      { type: 'prop', kind: 'n1_mark', id: 'd1mkB', at: markAt(EB), size: 40, t0: T.mkB, drawDur: 0.3, t1: T.arrOut + 0.37, sfxAt: [[T.mkB, 'pen']] },
      { type: 'prop', kind: 'n1_mark', id: 'd1mkC', at: markAt(EC), size: 40, t0: T.mkC, drawDur: 0.3, t1: T.arrOut + 0.37, sfxAt: [[T.mkC, 'pen']] },
      // L12: the thick corner
      { type: 'd1_thick', id: 'd1thick', t0: T.thick, t1: T.arrOut + 0.37 },
      // L15: 反例 — pointing at the 4 still sitting on the fallen sign
      { type: 'label', id: 'd1fl', text: '反例', size: 52, at: [770, 432], rot: -4, target: { target: 'blkR' }, bend: -0.15, gap: 8, t0: T.fanli, t1: T.arrOut + 0.37 },

      // the sign (drawn after the squares so the 2×2 lands behind its front edge) and the bonk star
      { type: 'd1_sign', id: 'd1sign', text: '偶数都不行！' },
      { type: 'd1_star', id: 'd1star', at: [626, 505], r: 20, t0: T.bonk, dur: 1.5 },

      // L3–L18: the question mark
      { type: 'qm', id: 'd1qm', pos: [[0, [QX, FL]]], size: QS, signSize: 52, t0: T.qm, burst: true,
        mood: [[0, 'neutral'], [2.1, 'doubt'], [4.2, 'neutral'], [T.qs1, 'doubt'], [19.6, 'neutral'], [T.qs2, 'happy'], [32.8, 'neutral'], [T.tkA, 'happy'], [37.8, 'neutral'],
          [T.hop + 0.15, 'surprised'], [T.laugh, 'happy'], [56.5, 'neutral'], [T.hit, 'surprised'], [76.6, 'neutral'], [T.con, 'happy']],
        act: [[0, 'idle'], [T.qs1, 'tap'], [17.6, 'idle'], [T.qs2, 'nod'], [30.6, 'idle'], [T.laugh, 'hop'], [55.65, 'idle'], [T.band, 'nod'], [81.0, 'idle']],
        sign: [[0, null], [T.qs1, '两个就够吗？'], [T.qs1Out, null], [T.qs2, '0 也算！'], [T.qs2Out, null]],
        gaze: [[0, 'viewer'], [0.5, 'hdr'], [4.2, 'sheet'], [T.sign, 'signC'], [T.qs1, 'kid'], [19.6, 'signC'], [T.phA, 'phA'], [T.phC, 'phC'], [T.qs2, 'viewer'], [30.2, 'card'],
          [T.A, 'A'], [T.B, 'B'], [T.C, 'C'], [T.hop, 'blk'], [T.bonk, 'kid'], [T.fanli, 'blk'], [T.frame, 'frame'], [T.con, 'con'], [80.2, 'viewer']] },

      // L16–L18: the video frame, the big sign, the big field of dots
      { type: 'd1_frame', id: 'd1fr', t0: T.frame, t1: T.frOut + 0.37 },
      { type: 'd1_big', id: 'd1big', t0: T.big, t1: T.frOut + 0.37 },
      { type: 'd1_crowd', id: 'd1cr', t0: T.crowd, t1: T.frOut + 0.37 },

      // L19: the moral, in the yellow highlighter
      { type: 'scribe', id: 'd1con', text: '对上几个，不等于全都对', x: 800, y: 300, size: 70, cps: 9, anchor: 'middle', t0: T.con, z: Z.annot },
      { type: 'band', id: 'd1band', rect: [800 - textWidth('对上几个，不等于全都对', 70) / 2, 262, textWidth('对上几个，不等于全都对', 70), 76], t0: T.band, dur: 0.5 },

      // eased exits (must stay last: they fade what was drawn before them)
      { type: 'd1_fade', t0: T.hdOut, keys: ['d1hOdd', 'd1hEven'] },
      { type: 'd1_fade', t0: T.shOut, keys: ['d1sh.', 'd1w1.', 'd1w2.', 'd1q1.', 'd1q2.', 'd1nf.'] },
      { type: 'd1_fade', t0: T.phOut, keys: ['d1phB', 'd1phC'] },
      { type: 'd1_fade', t0: T.phAOut, keys: ['d1phA'] },
      { type: 'd1_fade', t0: T.cardOut, keys: ['d1card.'] },
      { type: 'd1_fade', t0: T.arrOut, keys: ['d1eq', 'd1r0', 'd1tk', 'd1mk', 'd1thick', 'd1fl.'] },
      { type: 'd1_fade', t0: T.frOut, keys: ['d1fr.', 'd1big.', 'd1cr.'] },
      { type: 'd1_fade', t0: T.end, keys: ['kid.', 'd1qm.', 'd1con', 'd1band', 'floor'] },
    ],
    sfx: [[T.kid, 'pop'], [T.hop, 'boing'], [T.laugh, 'hop'], [T.rub, 'tap'], [T.frame + 0.5, 'pop']],
    subs: [
      sub(0.3, 3.62, '奇数解决了。偶数呢？'),   // L1
      sub(4.12, 7.6, '“2找不到，6也找不到……”', { voice: 'kid', say: '二找不到，六也找不到……' }),   // L2
      sub(7.9, 10.72, '“偶数肯定都不行！”', { voice: 'kid', say: '偶数肯定都不行！' }),   // L3
      sub(11.22, 14.87, '还没证明过的说法，叫猜想。'),   // L4
      sub(15.37, 19.22, '“找不到两个，就算全都不行吗？”', { voice: 'qm', say: '找不到两个，就算全都不行吗？' }),   // L5
      sub(19.72, 23.84, '到现在，2和6都只是还没找到。', { say: '到现在，二和六都只是还没找到。' }),   // L6
      sub(24.04, 28.69, '我们找找，这个猜想会不会在别处失败。'),   // L7
      sub(29.29, 32.52, '“还记得吗？0也算。”', { voice: 'qm', say: '还记得吗？零也算。' }),   // L8
      sub(32.92, 38.04, '“2的平方减0的平方……4！4是偶数！”', { voice: 'kid', say: '二的平方减零的平方……四！四是偶数！' }),   // L9
      sub(38.64, 42.85, '“3的平方减1的平方，是8！”', { voice: 'kid', say: '三的平方减一的平方，是八！' }),   // L10
      sub(43.25, 47.41, '“4的平方减2的平方，12！”', { voice: 'kid', say: '四的平方减二的平方，十二！' }),   // L11
      sub(47.91, 51.56, '粗一点的拐角，也能打记号。'),   // L12
      sub(53.26, 56.2, '“哈，被4推倒了！”', { voice: 'kid', say: '哈，被四推倒了！' }),   // L13 (+1.0)
      sub(56.8, 61.05, '猜错没关系，猜想就是拿来检查的。'),   // L14 (+1.0)
      sub(61.55, 65.8, '像4这样推倒猜想的例子，叫反例。', { say: '像四这样推倒猜想的例子，叫反例。' }),   // L15 (+1.0)
      sub(67.1, 69.75, '漫士有一期讲过：'),   // L16 (+1.6)
      sub(69.95, 74.0, '数学家们猜了八十年的一个说法，'),   // L17 (+1.6)
      sub(74.2, 77.45, '也是被一个反例推翻的。'),   // L18 (+1.6)
      sub(78.05, 81.5, '对上几个，不等于全都对。'),   // L19 (+1.6)
    ],
  });
})();
