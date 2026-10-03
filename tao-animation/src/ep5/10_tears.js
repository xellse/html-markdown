// 第 10 场 · 眼泪和蹦床（9 岁，1985 年初）
// 事实（ep5-script.md）：9 岁时他自己写的小文章 “My Recollections”：“I can get upset very easily, and my tears can turn on like
//   a tap. Sometimes when I couldn't do a question, I might throw away my pen, tear up my paper, and walk away to my bed and sulk.”
//   爸爸常讲个笑话逗他，妈妈不忙时会帮他想；“jumping on the trampoline can help relieve my frustration”；
//   “Very often, however, I just went back and tried again, and then found that the problem wasn't too hard after all.”
// 演绎（画面上的比方）：笑话内容没有记录 → 只有一个“哈哈！”；闷气 = 一团乱糟糟的铅笔云，蹦一下小一圈，最后“噗”；
//   眼泪只在第 3 句，画成夸张好笑的“水龙头”。回到书桌时从纸堆里拿一张新纸重新写（原来那张撕了）。
// 开场只有书桌（上一场结尾清空）；说到“小陶九岁时”在中央盖 9 岁印章（飘带“1985 年”），再停靠。
// 结尾：小陶跳下椅子跑出画面，书桌淡出，只剩停靠的印章。
// 字幕：第 5–9 句整体后移（+0.8 / +1.1 / +1.4 / +1.8 / +1.8 秒），给撕纸后的停顿、换场和回书桌留时间；每句时长不变。
(() => {
  const FL = 780, OFF = [-700, FL];
  /* ---------------- layout ---------------- */
  const DX = 250, DTOP = 616, DW = 300, SEAT = 624;            // desk + stool on the left
  const Q = [300, 330];                                         // the big red "?" over the desk
  const MT = 652, PRONE_HEAD = [548, 600];                      // mattress top; his head on the pillow when he sulks face down
  const KB = [610, MT], MB = [850, MT], DADX = 1230;             // kid and mom sitting on the bed; dad standing by it
  const TX = 800, TM = 690;                                     // trampoline centre and mat height
  const PG_BIG = [800, 380], PG_SMALL = [1210, 232], PG_W = 480, PG_H = 500;
  const POOF_C = [TX + 20, 391];                                // where the sulk cloud is when it pops

  /* ---------------- times (scene clock) ---------------- */
  const KID_IN = 0.15, STUCK = 1.4, QT = 2.2;                                     // L1 0.3–3.5
  const STAMP = 4.05, DOCK = 5.75, PAGE = 5.95, NOTE = 6.95;                      // L2 3.9–8.1
  const SHRINK = 8.55, SAD = 9.3, TAP_ON = 10.65, LB_TAP = 11.2, TAP_OFF = 12.85; // L3 8.6–12.79
  const MAD = 13.3, WIND = 14.95, THROW = 15.3, GRAB = 15.8, RIP = 16.3;          // L4 13.19–17.38
  const UP = 17.95, WALK0 = 18.2, FLOP = 19.0, FUME = 19.95, PG_OUT = 21.2;       // L5 18.28–21.14
  const DAD0 = 21.95, DAD1 = 22.95, HAHA = 23.15, SITUP = 23.5, DAD_OUT = 24.4, MOM_IN = 24.55, POINT = 25.0, THINK = 25.5;   // L6 22.04–26.84
  const LEAVE = 26.95, BED_OUT = 27.0, TR_IN = 27.15, JUMP_ON = 27.55;            // L7 27.54–31.54
  const HOPS = [28.35, 28.95, 29.55, 30.15], POOF = 30.65, JOYHOP = 31.15;
  const OFF_T = 32.3, TR_OUT = 32.65, WALK2 = 32.6, PG_BACK = 32.7, SIT2 = 33.75, REACH = 34.05, TAKE = 34.35, WRITE2 = 34.65;  // L8 32.64–37.78
  const IDEA = 38.25, SMILE = 39.0, CHECK = 40.4;                                 // L9 37.88–42.07
  const QSTEPS = [[35.3, 0.8], [36.45, 0.62], [37.6, 0.46], [38.8, 0.33], [39.75, 0.23]];
  const HOPOFF = 42.0, RUN0 = 42.25, RUN1 = 43.2, FADE0 = 43.0, DUR = 43.6;
  const PEN_FLY = 0.55;

  /* ---------------- sounds ---------------- */
  SFX.define('a5_tGush', (tone, noise) => { noise('bandpass', 1700, 0.7, 0.26, 0.12, 800); tone('sine', 520, 260, 0.18, 0.04); });
  SFX.define('a5_tRip', (tone, noise) => { noise('highpass', 2200, 0.8, 0.2, 0.26, 6500); });
  SFX.define('a5_tGrr', tone => { tone('sawtooth', 120, 88, 0.26, 0.05, [9, 14]); });
  SFX.define('a5_tPoof', (tone, noise) => { noise('lowpass', 1000, 0.8, 0.24, 0.32, 260); tone('sine', 300, 900, 0.08, 0.1); });

  /* ---------------- little helpers ---------------- */
  const quad = (cx, y, w, h) => [[cx - w / 2, y], [cx - w / 2 + 12, y - h, 1], [cx + w / 2 - 6, y - h, 1], [cx + w / 2, y, 1], [cx - w / 2, y, 1]];
  const wig = (k, x0, x1, y, n, o) => { const pts = []; for (let j = 0; j <= n; j++) pts.push([lerp(x0, x1, j / n), y + (j % 2 ? -2.4 : 1.8) + rnd(hstr(k), j, 3) * 1.2]); stroke(k, pts, o); };
  const fadeItems = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); } };
  const jumpArc = (t0, d, a, b, hgt = 90) => t => { const u = clamp((t - t0) / d); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(Math.PI * u) * hgt]; };
  const bez = (P0, P1, P2, u) => [(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]];
  /** where the kid's hands are at some other moment (layoutChar is pure; the current frame's anchors are put back) */
  const kidAt = (F, t) => { const keep = F.anchors.kid; layoutChar('kid', t, F); const a = F.anchors.kid; if (keep) F.anchors.kid = keep; else delete F.anchors.kid; return a; };
  let throwFrom = null, dropAt = null;   // constants of the scene, worked out once
  const getThrowFrom = F => throwFrom || (throwFrom = kidAt(F, THROW).handR.slice());
  const getDropAt = F => dropAt || (dropAt = (a => ({ L: a.handL.slice(), R: a.handR.slice() }))(kidAt(F, LEAVE - 0.01)));
  const penFly = (F, t) => { const S = getThrowFrom(F); return bez(S, [S[0] + 300, S[1] - 380], [S[0] + 700, S[1] - 640], clamp((t - THROW) / PEN_FLY)); };

  // trampoline hops: 0.5 s in the air each; the mat sags at take-off and landing
  const HOPS_ALL = [...HOPS, JOYHOP];
  const hopU = t => { for (const h of HOPS_ALL) { const u = (t - h) / 0.5; if (u >= 0 && u < 1) return u; } return -1; };
  const hopY = t => { const u = hopU(t); return u < 0 ? 0 : -112 * 4 * u * (1 - u); };
  const LANDS = [JUMP_ON + 0.35, ...HOPS_ALL.map(h => h + 0.5)];
  const sag = t => {
    let s = 0;
    HOPS_ALL.forEach(h => { const d = t - h; if (d > -0.08 && d < 0.06) s = Math.max(s, 1 - Math.abs(d + 0.01) / 0.08); });
    LANDS.forEach(l => { const e = t - l; if (e > -0.04 && e < 0.1) s = Math.max(s, 1 - Math.abs(e - 0.02) / 0.08); });
    return clamp(s);
  };
  const trampSquash = t => { for (const l of LANDS) { const d = t - l; if (d >= 0 && d < 0.2) return 1 - 0.13 * Math.sin(Math.PI * d / 0.2); } return 1; };

  /* ---------------- set: room (desk, stool, paper, pencil cup) / bed / trampoline ---------------- */
  /** draws `paint` and fades its own shapes out from fo over fd */
  COMP.a5_tLayer = {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const k = fx.fo !== undefined ? 1 - clamp((t - fx.fo) / (fx.fd || 0.3)) : 1; if (k <= 0) return;
      const n0 = DL.items.length;
      fx.paint(t, F, t - fx.t0);
      fadeItems(n0, k);
    },
    cues: fx => fx.sfxAt || [],
  };
  const roomPaint = t => {
    const p = EASE.out(clamp((t + 0.12) / 0.38)), z = Z.desk + 1, k = 'a5t.dk';
    SETDRAW.floor({}, p);
    SETDRAW.stool({ x: DX, seat: SEAT + 2 }, p);
    SETDRAW.desk({ x: DX, top: DTOP, w: DW }, p);
    const q = clamp((p - 0.6) / 0.4); if (q <= 0) return;
    // a little stack of fresh paper at the left end (one is taken at TAKE)
    for (let i = 0; i < (t < TAKE ? 3 : 2); i++) stroke(k + '.st' + i, quad(DX - 110, DTOP + 1 - i * 4, 66, 16), { z: z + i * 0.01, w: 3.2, fill: C.paper, opacity: q });
    // the problem he is stuck on (picked up and torn at GRAB)
    if (t < GRAB) {
      stroke(k + '.sh', quad(DX - 4, DTOP + 1, 150, 30), { z: z + 0.1, w: 3.8, fill: C.paper, opacity: q });
      const n = 1 + Math.min(2, Math.floor(t / 0.6));
      for (let r = 0; r < n; r++) wig(k + '.w' + r, DX - 64 + r * 3, DX + 8 + r * 12, DTOP - 21 + r * 8, 6, { z: z + 0.15, w: 1.8, boil: 0.6, opacity: q });
    }
    // the fresh sheet: slides over from the stack, then fills up with his writing
    if (t >= TAKE) {
      const u = EASE.out(clamp((t - TAKE) / 0.25));
      stroke(k + '.ns', quad(lerp(DX - 110, DX - 4, u), DTOP + 1, lerp(66, 150, u), lerp(16, 30, u)), { z: z + 0.1, w: 3.8, fill: C.paper });
      for (let r = 0; r < 3; r++) {
        const dq = clamp((t - WRITE2 - r * 1.5) / 1.3); if (dq <= 0) continue;
        wig(k + '.nw' + r, DX - 64 + r * 3, DX + 14 + r * 8, DTOP - 21 + r * 8, 7, { z: z + 0.15, w: 1.8, boil: 0.6, draw: dq });
      }
    }
    // pencil cup at the right end, one pencil left in it
    const cx = DX + 122;
    stroke(k + '.cup', [[cx - 15, DTOP - 38], [cx - 13, DTOP, 1], [cx + 13, DTOP, 1], [cx + 15, DTOP - 38, 1]], { z: z + 0.2, w: 3.6, fill: C.paper, opacity: q });
    stroke(k + '.cupT', ringPts(k + '.cupT', cx, DTOP - 38, 15, 4, { n: 8, closed: true }), { z: z + 0.25, w: 3, closed: true, opacity: q });
    if (t < TAKE) stroke(k + '.cp', [[cx - 3, DTOP - 34], [cx - 9, DTOP - 74]], { z: z + 0.15, w: 4.5, opacity: q });
    if (t >= HOPOFF) stroke(k + '.lp', [[DX + 18, DTOP - 6], [DX + 56, DTOP - 11]], { z: z + 0.3, w: 4.5 });   // he leaves his pencil on the desk
  };
  const bedPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.42)), z = Z.set + 1, k = 'a5t.bed';
    stroke(k + '.hb', [[462, FL], [462, 576, 1], [468, 558], [482, 550], [496, 558], [502, 576, 1], [502, FL]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 4) });
    stroke(k + '.fb', [[992, FL], [992, 630, 1], [1020, 630, 1], [1020, FL]], { z, w: 5, fill: C.paper, draw: stag(p, 1, 4) });
    stroke(k + '.m', [[502, MT], [992, MT, 1], [992, 696, 1], [502, 696, 1], [502, MT, 1]], { z: z + 0.1, w: 5, fill: C.paper, draw: stag(p, 2, 4) });
    stroke(k + '.rail', [[502, 714], [992, 714]], { z, w: 4, draw: stag(p, 2, 4) });
    [640, 760, 880].forEach((x, i) => stroke(k + '.q' + i, [[x, MT + 8], [x + 4, 690]], { z: z + 0.15, w: 2, color: C.pencil, opacity: 0.7 * stag(p, 3, 4), boil: 0.5 }));
    stroke(k + '.pl', ringPts(k + '.pl', 556, MT - 12, 52, 15, { n: 12, closed: true }), { z: z + 0.2, w: 4, closed: true, fill: C.paper, draw: stag(p, 3, 4) });
    if (p > 0.8) shadow(k + '.sh', 741, FL + 4, 580, 1);
  };
  const trampPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.4)), k = 'a5t.tr', z = Z.back, sg = sag(t);
    stroke(k + '.mat', [[-124, 0], [-60, 10 + 22 * sg, 1], [60, 10 + 22 * sg, 1], [124, 0]].map(([x, y, c]) => [TX + x, TM + y, c]), { z: z + 0.2, w: 5, draw: stag(p, 0, 3) });
    stroke(k + '.rim', ringPts(k + '.rim', TX, TM, 128, 18, { n: 14, a0: 180, sweep: 180 }), { z, w: 4.5, draw: stag(p, 1, 3) });
    [-108, -44, 44, 108].forEach((x, i) => stroke(k + '.leg' + i, [[TX + x, TM + 8], [TX + x * 1.08, FL]], { z: z - 0.1, w: 4.5, draw: stag(p, 2, 3) }));
    if (p > 0.8) shadow(k + '.sh', TX, FL + 4, 290, 1);
  };

  /* ---------------- the big red "?" over the desk → shrinks while he works → a red ✓ ---------------- */
  const QSC = [[0, 1], ...QSTEPS.map(([s, v]) => [s, v, 0.16, 'back'])];
  COMP.a5_tQ = {
    init(fx) { fx.ck = layoutWriting({ text: '✓', x: Q[0], y: Q[1] - 62, size: 124, t0: CHECK + 0.08, speed: 1700, anchor: 'middle' }); return fx; },
    draw(fx, t) {
      if (t < QT) return;
      const pop = EASE.back(clamp((t - QT) / 0.25)), sc = evalTrack(QSC, t) * (1 - EASE.in(clamp((t - CHECK) / 0.12)));
      if (sc * pop > 0.02) text('a5t.q', '?', Q[0], Q[1], { size: 160, font: CFG.FONT_MIX, color: C.red, z: Z.annot, scale: Math.max(0.01, pop * sc), rot: 10 + 3 * Math.sin(t * 1.7) });
      if (t >= CHECK) fx.ck.strokes.forEach((s, i) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke('a5t.ck' + i, s.pts, { z: Z.annot, w: 10, color: C.red, draw: q, boil: 0.55 }); });
    },
    cues: () => [[QT, 'boop'], ...QSTEPS.map(([s]) => [s, 'plip']), [CHECK, 'ding']],
  };

  /* ---------------- his little essay: floats down to the middle, then waits small in a corner while he quotes it ---------------- */
  const pageFloat = t => { const u = clamp((t - PAGE) / 0.8); return [PG_BIG[0] + 80 * Math.sin((t - PAGE) * 6) * (1 - u), lerp(-330, PG_BIG[1], EASE.out(u))]; };
  const PG_POS = [[0, [PG_BIG[0], -330]], [PAGE, pageFloat, 0], [SHRINK, PG_SMALL, 0.4]];
  const PG_ROT = [[0, 0], [PAGE, t => -3 + 12 * Math.sin((t - PAGE) * 6) * (1 - clamp((t - PAGE) / 0.8)), 0], [SHRINK, 4, 0.4]];
  const PG_SC = [[0, 1], [SHRINK, 0.4, 0.4]];
  COMP.a5_tEssay = {
    draw(fx, t) {
      if (t < PAGE) return;
      let k = 1;
      if (t >= PG_OUT && t < PG_BACK) { k = 1 - clamp((t - PG_OUT) / 0.3); if (k <= 0) return; } else if (t >= PG_BACK) k = clamp((t - PG_BACK) / 0.3);
      const pos = evalTrack(PG_POS, t), rot = evalTrack(PG_ROT, t), sc = evalTrack(PG_SC, t), n0 = DL.items.length, id = 'a5t.pg';
      DL.save(); DL.translate(pos[0], pos[1]); DL.rotate(rot); DL.scale(sc);
      PROPS.e5_page({ id, w: PG_W, h: PG_H, lines: 5, title: '我的回忆', z: Z.set + 3 }, t, t - PAGE, 1);
      const top = -PG_H / 2 + 110, step = (PG_H / 2 - 40 - top) / 4;
      [330, 300, 340, 250, 170].forEach((len, i) => {   // a few lines of his pencil writing
        const q = clamp((t - PAGE - 0.75 - i * 0.16) / 0.3); if (q <= 0) return;
        const pts = [];
        for (let j = 0; j <= 14; j++) pts.push([-PG_W / 2 + 76 + len * j / 14, top + i * step - 14 + (j % 2 ? -5 : 4) + rnd(hstr(id), i, j) * 2]);
        stroke(id + '.s' + i, pts, { z: Z.set + 3.3, w: 3, color: C.pencil, draw: q, boil: 0.6 });
      });
      DL.restore();
      const tv = clamp((sc - 0.72) / 0.2);   // the title only while the page is big
      for (let i = n0; i < DL.items.length; i++) { const it = DL.items[i]; let o = (it.attrs.opacity ?? 1) * k; if (it.key === id + '.t') o *= tv; if (o < 1) it.attrs.opacity = +o.toFixed(3); }
    },
    cues: () => [[PAGE, 'whoosh'], [PAGE + 0.75, 'paper'], [SHRINK, 'whoosh'], [PG_BACK, 'paper']],
  };

  /* ---------------- red-pen note (fades in and out), optional arrow ---------------- */
  COMP.a5_tNote = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, k = clamp((fx.t1 - t) / 0.2), pp = EASE.back(clamp(lt / 0.2)), size = fx.size || 40, n0 = DL.items.length, lines = [].concat(fx.text);
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(fx.rot || 0);
      lines.forEach((l, i) => text(fx.id + '.t' + i, l, 0, (i - (lines.length - 1) / 2) * size * 1.2, { size, color: C.red, z: Z.annot, scale: lerp(0.6, 1, pp), opacity: clamp(lt / 0.08), halo: 8 }));
      DL.restore();
      if (fx.arrow) arrow(fx.id + '.a', fx.arrow[0], fx.arrow[1], { p: EASE.out(clamp((lt - 0.12) / 0.3)), bend: fx.bend ?? 0.2 });
      fadeItems(n0, k);
    },
    cues: fx => [[fx.t0, 'pop']],
  };
  /** floating speech with a tail line to the speaker (fades out) */
  COMP.a5_tSay = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, op = clamp((fx.t1 - t) / 0.2), pp = EASE.back(clamp(lt / 0.22));
      text(fx.id, fx.text, fx.at[0], fx.at[1], { size: fx.size, z: Z.annot, scale: lerp(0.4, 1, pp), rot: fx.rot || 0, halo: 10, opacity: op });
      const a = F.anchors[fx.speaker]; if (!a) return;
      const from = [fx.at[0] + fx.tail[0], fx.at[1] + fx.tail[1]], d = dist(from, a.head), to = lerp2(from, a.head, clamp((d - a.r - 14) / d));
      stroke(fx.id + '.tail', [from, to], { z: Z.annot, w: 3.5, draw: EASE.out(clamp((lt - 0.05) / 0.15)), opacity: op });
    },
    cues: fx => [[fx.t0, 'pop']],
  };

  /* ---------------- tears like a tap: two arcs of water out of the corners of his eyes ---------------- */
  COMP.a5_tTears = {
    draw(fx, t, F) {
      if (t < TAP_ON || t >= TAP_OFF + 0.25) return;
      const a = F.anchors.kid; if (!a) return;
      const L = EASE.out(clamp((t - TAP_ON) / 0.25)) * (1 - EASE.in(clamp((t - TAP_OFF) / 0.25))); if (L <= 0.01) return;
      const r = a.r, s_ = (a.headTop[0] - a.head[0]) / r, c_ = -(a.headTop[1] - a.head[1]) / r;   // head tilt
      const hl = (u, v) => [a.head[0] + u * r * c_ - v * r * s_, a.head[1] + u * r * s_ + v * r * c_];
      [-1, 1].forEach(s => {
        const P0 = hl(s * 0.8, 0), P1 = [P0[0] + s * 110, P0[1] - 70], P2 = [P0[0] + s * 190, FL - 12], k = 'a5t.tear' + (s < 0 ? 'L' : 'R');
        const B = u => bez(P0, P1, P2, u), n = 12;
        [-3.5, 3.5].forEach((o, j) => {
          const pts = [];
          for (let i = 0; i <= n; i++) {
            const u = L * i / n, p = B(u), q = B(Math.min(1, u + 0.02)), b = B(Math.max(0, u - 0.02)), dx = q[0] - b[0], dy = q[1] - b[1], dl = Math.hypot(dx, dy) || 1;
            pts.push([p[0] - dy / dl * o, p[1] + dx / dl * o]);
          }
          stroke(k + j, pts, { z: Z.fx, w: 3 });
        });
        for (let i = 0; i < 4; i++) {   // drops racing along the stream
          const p = B(((t * 1.9 + i / 4 + (s > 0 ? 0.12 : 0)) % 1) * L);
          stroke(k + '.d' + i, ringPts(k + '.d' + i, p[0], p[1], 5, 6.5, { n: 7, closed: true }), { z: Z.fx + 0.1, w: 2.6, closed: true, fill: C.paper });
        }
        if (L > 0.97) {   // splash + a growing puddle where it lands
          const e = B(1), g = clamp((t - TAP_ON - 0.25) / 1.2);
          [-1, 0, 1].forEach(j => stroke(k + '.sp' + (j + 1), [[e[0] + j * 8, e[1] - 4], [e[0] + j * 22, e[1] - 18 - (j === 0 ? 8 : 0)]], { z: Z.fx, w: 2.6, boil: 1.6 }));
          stroke(k + '.pd', ringPts(k + '.pd', e[0], FL - 3, 18 + 26 * g, 4 + 2 * g, { n: 10, closed: true }), { z: Z.set + 2, w: 2.4, color: C.pencil, closed: true });
        }
      });
    },
    cues: () => [[TAP_ON, 'a5_tGush'], [TAP_ON + 0.8, 'a5_tGush'], [TAP_ON + 1.6, 'a5_tGush']],
  };

  /* ---------------- his pencil: in his hand, thrown out of the picture, a new one from the cup later ---------------- */
  COMP.a5_tPen = {
    draw(fx, t, F) {
      const a = F.anchors.kid;
      if (a && (t < THROW || (t >= TAKE && t < HOPOFF))) { const h = a.handR; stroke('a5t.pen', [[h[0] - 5, h[1] + 8], [h[0] + 13, h[1] - 24]], { z: Z.front + 1, w: 4.5 }); }
      const u = (t - THROW) / PEN_FLY;
      if (u >= 0 && u < 1) {
        const p = penFly(F, t), ang = (-60 + 900 * u) * RAD, dx = Math.cos(ang) * 17, dy = Math.sin(ang) * 17;
        stroke('a5t.fly', [[p[0] - dx, p[1] - dy], [p[0] + dx, p[1] + dy]], { z: Z.fx, w: 4.5 });
        [0.06, 0.12].forEach((d, j) => { if (u > d + 0.05) stroke('a5t.fsp' + j, [penFly(F, t - (d + 0.06) * PEN_FLY), penFly(F, t - d * PEN_FLY)], { z: Z.fx - 0.1, w: 2.5, color: C.pencil }); });
      }
    },
    cues: () => [[THROW, 'whip']],
  };

  /* ---------------- the problem sheet: picked up, torn in two, carried to the bed, dropped ---------------- */
  const HW = 56, HH = 80;
  const ZIG = [[0, -40], [-5, -28], [4, -16], [-4, -4], [5, 8], [-4, 20], [4, 32], [0, 40]];   // the torn edge, top → bottom
  const drawHalf = (k, s, c, rot, op, z) => {   // s = -1 left half, +1 right half; the torn edge faces the other half
    DL.save(); DL.translate(c[0], c[1]); DL.rotate(rot);
    const ox = s * HW / 2, ix = -s * HW / 2, edge = ZIG.map(([x, y]) => [ix + x, y]);
    stroke(k, [[ox, -HH / 2], [ox, HH / 2, 1], [edge[7][0], HH / 2, 1], ...edge.slice(0, 7).reverse().map(p => [p[0], p[1], 1]), [ox, -HH / 2, 1]], { z, w: 3.8, fill: C.paper, opacity: op });
    [-14, 8].forEach((y, i) => wig(k + '.w' + i, s < 0 ? ox + 8 : ix + 10, s < 0 ? ix - 10 : ox - 8, y, 4, { z: z + 0.1, w: 2.2, color: C.pencil, boil: 0.6, opacity: op }));
    DL.restore();
  };
  COMP.a5_tHalves = {
    draw(fx, t, F) {
      if (t < GRAB || t >= LEAVE + 0.3 || (t >= FLOP && t < SITUP)) return;
      const z = Z.front - 0.5, k = 'a5t.hv';
      let L, R, op = 1, dy = 0;
      if (t >= LEAVE) { const d = getDropAt(F), v = clamp((t - LEAVE) / 0.3); L = d.L; R = d.R; op = 1 - v; dy = 46 * EASE.in(v); }
      else { const a = F.anchors.kid; if (!a) return; L = a.handL; R = a.handR; }
      if (t < RIP) {
        const c = [(L[0] + R[0]) / 2, (L[1] + R[1]) / 2 - (HH / 2 - 12)];
        DL.save(); DL.translate(c[0], c[1]);
        stroke(k + '.whole', [[-HW, -HH / 2], [HW, -HH / 2, 1], [HW, HH / 2, 1], [-HW, HH / 2, 1], [-HW, -HH / 2, 1]], { z, w: 3.8, fill: C.paper });
        [-14, 8].forEach((y, i) => wig(k + '.ww' + i, -HW + 12, HW - 30 + i * 10, y, 8, { z: z + 0.1, w: 2.2, color: C.pencil, boil: 0.6 }));
        DL.restore();
        return;
      }
      const u = EASE.out(clamp((t - RIP) / 0.12));
      drawHalf(k + 'L', -1, [L[0] + (HW / 2 - 10), L[1] - (HH / 2 - 12) + dy], -14 * u, op, z);
      drawHalf(k + 'R', 1, [R[0] - (HW / 2 - 10), R[1] - (HH / 2 - 12) + dy], 14 * u, op, z);
    },
    cues: () => [[GRAB, 'paper'], [RIP, 'a5_tRip']],
  };

  /* ---------------- sulking face down on the bed: back of the head, kicking feet ---------------- */
  COMP.a5_tProne = {
    draw(fx, t) {
      if (t < FLOP || t >= SITUP) return;
      const lt = t - FLOP, drop = -30 * (1 - EASE.out(clamp(lt / 0.16))), k = 'a5t.pr', r = 53.75, bw = 5.5;
      const H = [PRONE_HEAD[0], PRONE_HEAD[1] + drop], z = Z.body + 1, zh = Z.front;
      const N = [H[0] + r * 0.92, H[1] + r * 0.6 - drop * 0.1], P = [N[0] + 56, N[1] + 6], K = [P[0] + 37, P[1] + 2], S = lerp2(N, P, 0.18);
      const kick = Math.sin(lt * 2 * Math.PI * 1.9);
      [[1, 'L'], [-1, 'R']].forEach(([sg, n]) => { const a = (52 + 34 * sg * kick) * RAD; stroke(k + '.leg' + n, [P, K, [K[0] + Math.cos(a) * 37, K[1] - Math.sin(a) * 37]], { z, w: bw }); });
      stroke(k + '.torso', [N, P], { z, w: bw });
      stroke(k + '.armA', [S, [S[0] - 20, S[1] + 16], [S[0] - 58, S[1] + 14]], { z, w: bw });   // hugging the pillow, under his head
      stroke(k + '.armB', [S, [S[0] + 20, S[1] + 12], [S[0] + 46, S[1] + 12]], { z, w: bw });
      const fill = ringPts(k + '.h', H[0], H[1], r, r, { n: 12, a0: -120, sweep: 360, rv: 0.035, closed: true });
      stroke(k + '.hf', fill, { z: zh, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke(k + '.hl', ringPts(k + '.h', H[0], H[1], r, r, { n: 12, a0: -120, sweep: 372, rv: 0.035 }), { z: zh, w: bw });
      HAIR.tuft(0, 0).forEach((pts, i) => stroke(k + '.hair' + i, pts.map(([u, v]) => [H[0] + v * r, H[1] - u * r]), { z: zh, w: 5 }));   // crown toward the headboard
      stroke(k + '.ear', ringPts(k + '.ear', H[0] + r * 0.16, H[1] + r * 0.05, r * 0.15, r * 0.21, { n: 8, a0: -80, sweep: 250 }), { z: zh + 0.1, w: 3.5 });
    },
  };

  /* ---------------- the sulk: a tangled pencil cloud over his head; smaller with every hop; "噗！" ---------------- */
  const FUME_SZ = [[0, 0], [FUME, 1, 0.3, 'back'], [HOPS[0] + 0.5, 0.74, 0.14, 'back'], [HOPS[1] + 0.5, 0.52, 0.14, 'back'], [HOPS[2] + 0.5, 0.32, 0.14, 'back']];
  COMP.a5_tFume = {
    draw(fx, t, F) {
      if (t < FUME) return;
      const k = 'a5t.fume';
      if (t < POOF) {
        let c;
        if (t < SITUP) c = [PRONE_HEAD[0] + 40, PRONE_HEAD[1] - 118];
        else { const a = F.anchors.kid; if (!a) return; c = [a.head[0] + 20, a.head[1] - 128]; }
        const sc = evalTrack(FUME_SZ, t), rx = 92 * sc, ry = 54 * sc;
        [0, 1].forEach(j => {
          const pts = [], n = 64;
          for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 4 + j * 1.3; pts.push([c[0] + rx * (0.68 * Math.cos(a) + 0.32 * Math.cos(3.7 * a + j)), c[1] + ry * (0.68 * Math.sin(a) + 0.32 * Math.sin(4.3 * a + 2 * j))]); }
          stroke(k + j, pts, { z: Z.fx, w: 3.4, color: C.pencil, boil: 1.6 });
        });
        return;
      }
      const u = clamp((t - POOF) / 0.4), c = POOF_C;
      if (u < 1) for (let i = 0; i < 8; i++) {
        const a = (i * 45 + 20) * RAD, r0 = 72 + 46 * EASE.out(u), r1 = r0 + 26 * (1 - u) + 6;
        stroke(k + '.b' + i, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0 * 0.7], [c[0] + Math.cos(a) * r1, c[1] + Math.sin(a) * r1 * 0.7]], { z: Z.fx, w: 4, opacity: 1 - u });
      }
      const tq = clamp((t - POOF) / 0.15), to = 1 - clamp((t - POOF - 1.0) / 0.25);
      if (to > 0) text(k + '.puh', '噗！', c[0], c[1], { size: 64, z: Z.annot, scale: lerp(0.5, 1, EASE.back(tq)), opacity: clamp(tq * 3) * to, rot: -6, halo: 8 });
    },
    cues: () => [[FUME, 'a5_tGrr'], [POOF, 'a5_tPoof']],
  };

  /** the end: everything but the docked stamp fades out */
  COMP.a5_tFadeAll = {
    draw(fx, t) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k >= 1) return;
      DL.items.forEach(it => { if (!/^stamp/.test(it.key)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * k).toFixed(3); });
    },
  };

  /* ---------------- poses & faces ---------------- */
  const SIT = POSE.sitBase;
  const desk = (dx, dy = -3, bend = 'down') => ({ w: 1, to: 'desk', dx, dy, bend });
  const abs = (x, y, bend = 'down') => ({ w: 1, to: 'abs', dx: x, dy: y, bend });
  const writing = (lean, tilt) => t => ({ ...SIT, lean, tilt, ikL: desk(-52), ikR: desk(22 + 12 * Math.sin(t * 6.3), -6 - 4 * Math.abs(Math.sin(t * 12.6))) });
  Object.assign(POSE, {
    a5_tSit: { ...SIT, ikL: desk(-58), ikR: desk(58) },
    a5_tSlump: { ...SIT, lean: 2, tilt: 7, ikL: desk(-48), ikR: desk(48) },
    a5_tWail: { ...SIT, lean: -3, tilt: -7, armScale: 1.35, armL: [40, 34], armR: [40, 34] },
    a5_tGlare: { ...SIT, lean: 4, tilt: 9, ikL: desk(-46), ikR: desk(30) },
    a5_tWind: { ...SIT, lean: -4, tilt: -6, armScale: 1.75, armR: [140, 30], ikL: desk(-44) },
    a5_tThrow: { ...SIT, lean: 5, tilt: 3, armScale: 1.6, armR: [95, -15], ikL: desk(-44) },
    a5_tGrab: { ...SIT, lean: 3, tilt: 5, armScale: 1.25, ikL: abs(DX - 56, 630), ikR: abs(DX + 56, 630) },
    a5_tRip: { ...SIT, lean: -2, tilt: -5, armScale: 1.4, ikL: abs(DX - 96, 606, 'out'), ikR: abs(DX + 96, 606, 'out') },
    a5_tHold: { armScale: 1.3, armL: [40, -8], armR: [40, -8] },
    a5_tBedHold: { ...SIT, armScale: 1.3, ikL: abs(KB[0] - 62, KB[1] - 4), ikR: abs(KB[0] + 62, KB[1] - 4) },
    a5_tJump: { legL: [6, 22], legR: [6, 22], armScale: 1.75, armL: [140, 18], armR: [140, 18] },
    a5_tReach: { ...SIT, armScale: 1.55, ikL: desk(-112, -6), ikR: desk(118, -30) },
    a5_tSitCheer: { ...SIT, armScale: 1.75, armL: [140, 18], armR: [140, 18] },
    a5_tDadJoke: { lean: -3, tilt: -7, armL: [72, 34], armR: [18, 10] },
    a5_tMomSit: { ...SIT, lean: -3, armL: [22, 16], armR: [22, 16] },
    a5_tMomPoint: { ...SIT, lean: -7, tilt: -6, armScale: 1.05, ikL: abs(KB[0] + 90, KB[1] - 48, 'out'), armR: [22, 16] },
  });
  Object.assign(FACE, {
    a5_tSad: { lidL: 0.28, lidR: 0.28, brow: 'line', browL: -20, browR: -20, mouth: 'frown', mw: 0.28 },
    a5_tWail: { lidL: 0.42, lidR: 0.42, brow: 'line', browL: -24, browR: -24, browY: 0.02, mouth: 'jaw', mo: 0.4 },
    a5_tMad: { lidL: 0.3, lidR: 0.3, brow: 'line', browL: 22, browR: 22, mouth: 'frown', mw: 0.3 },
    a5_tPout: { lidL: 0.36, lidR: 0.36, brow: 'line', browL: 10, browR: 10, mouth: 'flat', mw: 0.18 },
    a5_tPeek: { lidL: 0.3, lidR: 0.3, brow: 'line', browL: -8, browR: -8, mouth: 'smirk', mw: 0.26 },
  });
  const walkHold = t => ({ ...makeWalk(WALK0, FLOP, 6.2, { lean: 6 })(t), armScale: 1.3, armL: [38, -6], armR: [38, -6] });
  const trampPose = t => {
    if (t < JUMP_ON + 0.35) return POSE.a5_tJump;
    const u = hopU(t);
    if (u < 0) return t < POOF ? POSE.stand : POSE.kidCheer;
    const i = HOPS_ALL.findIndex(h => t >= h && t < h + 0.5), arm = [50, 80, 110, 140, 145][i], lg = 18 * Math.sin(Math.PI * u);
    return { armScale: 1.7, armL: [arm, 18], armR: [arm, 18], legL: [6, lg], legR: [6, lg] };
  };
  const laughBob = t0 => t => 1 + 0.03 * Math.sin((t - t0) * 22);

  defineScene({
    id: 'tears', chapter: '眼泪和蹦床', dur: DUR, floor: FL,
    cast: { kid: { ...E5.terry9, desk: [DX, DTOP - 3] }, mom: E5.mom, dad: E5.dad },
    order: ['kid', 'mom', 'dad'],
    tracks: {
      kid: {
        enter: KID_IN,
        pos: [[0, [DX, SEAT]], [UP, [430, FL], 0.16, 'out'], [WALK0, [600, FL], FLOP - WALK0, 'lin'], [FLOP, OFF, 0], [SITUP, KB, 0], [LEAVE, [600, FL], 0.16, 'out'],
          [JUMP_ON, jumpArc(JUMP_ON, 0.35, [600, FL], [TX, TM + 8], 110), 0], [JUMP_ON + 0.35, t => [TX, TM + 8 + 22 * sag(t) + hopY(t)], 0],
          [OFF_T, jumpArc(OFF_T, 0.28, [TX, TM + 8], [700, FL]), 0], [WALK2, [300, FL], SIT2 - 0.05 - WALK2, 'lin'], [SIT2, [DX, SEAT], 0],
          [HOPOFF, jumpArc(HOPOFF, 0.25, [DX, SEAT], [440, FL]), 0], [RUN0, [1830, FL], RUN1 - RUN0, 'lin']],
        pose: [[0, writing(3, 12)], [STUCK, 'sitScratch', 0.14, 'back'], [STAMP - 0.25, 'a5_tSit', 0.15], [SAD, 'a5_tSlump', 0.15], [TAP_ON - 0.05, 'a5_tWail', 0.1, 'back'],
          [TAP_OFF + 0.1, 'a5_tSlump', 0.15], [MAD, 'a5_tGlare', 0.12, 'back'], [WIND, 'a5_tWind', 0.14, 'back'], [THROW, 'a5_tThrow', 0.07],
          [GRAB, 'a5_tGrab', 0.14], [RIP, 'a5_tRip', 0.07, 'back'], [UP, 'a5_tHold', 0.12], [WALK0, walkHold, 0],
          [SITUP, 'a5_tBedHold', 0], [LEAVE, 'stand', 0.12], [JUMP_ON, trampPose, 0], [OFF_T, 'a5_tJump', 0.08], [WALK2, makeWalk(WALK2, SIT2 - 0.05, 5.4, { lean: -5 }), 0],
          [SIT2, 'a5_tSit', 0], [REACH, 'a5_tReach', 0.14], [WRITE2, writing(3, 12), 0.14], [CHECK, 'a5_tSitCheer', 0.12, 'back'],
          [HOPOFF, 'a5_tJump', 0.08], [RUN0, makeWalk(RUN0, RUN1, 8, { lean: 9, bounce: 1.4 }), 0]],
        face: [[0, 'focus'], [STUCK, 'puzzled', 0.06], [PAGE + 0.2, 'neutral', 0.08], [SAD, 'a5_tSad', 0.08], [TAP_ON - 0.05, 'a5_tWail', 0.05], [TAP_OFF + 0.1, 'a5_tSad', 0.08],
          [MAD, 'a5_tMad', 0.06], [SITUP, 'a5_tPeek', 0.06], [THINK, 'focus', 0.08], [LEAVE, 'a5_tPout', 0.06],
          [HOPS[0] + 0.5, 'neutral', 0.06], [HOPS[1] + 0.5, 'smile', 0.06], [HOPS[2] + 0.5, 'grin', 0.06], [POOF, 'joy', 0.05], [OFF_T, 'smile', 0.08],
          [WRITE2, 'focus', 0.08], [IDEA, 'idea', 0.05], [SMILE, 'smile', 0.08], [CHECK, 'grin', 0.05], [CHECK + 0.6, 'joy', 0.05]],
        turn: [[0, 0.12], [STAMP, 0.25, 0.1], [PAGE + 0.2, 0.35, 0.1], [SHRINK, 0, 0.1], [MAD, 0.1, 0.1], [UP, 0.4, 0.08], [SITUP, 0.15, 0], [MOM_IN, 0.3, 0.1],
          [LEAVE, 0.3, 0.1], [JUMP_ON + 0.35, 0, 0.1], [OFF_T, -0.4, 0.08], [SIT2, 0.12, 0], [CHECK, 0, 0.1], [HOPOFF, 0.45, 0.08]],
        gaze: [[0, 'paper'], [QT - 0.1, 'viewer'], [STAMP + 0.1, [800, 360]], [PAGE, 'page'], [SHRINK, 'viewer'], [MAD, 'paper'], [WIND, 'viewer'], [THROW + 0.05, 'penFly'],
          [GRAB, 'paper'], [RIP + 0.1, 'viewer'], [UP, [760, 640]], [SITUP, 'dadH'], [MOM_IN + 0.1, 'momH'], [POINT, 'halves'], [LEAVE, [TX, TM - 40]], [JUMP_ON + 0.35, 'viewer'],
          [OFF_T, [260, 600]], [SIT2, 'paper'], [REACH, 'cupT'], [WRITE2, 'paper'], [CHECK, 'qmark'], [CHECK + 0.6, 'viewer'], [HOPOFF, [1500, 600]]],
        squash: [[0, 1], [QT, 1.05, 0.05], [QT + 0.05, 1, 0.2, 'back'], [TAP_ON, 1.08, 0.05], [TAP_ON + 0.05, 1, 0.22, 'back'], [RIP, 1.07, 0.04], [RIP + 0.04, 1, 0.2, 'back'],
          [UP + 0.14, 0.88, 0.04], [UP + 0.18, 1, 0.2, 'back'], [SITUP, 0.9, 0.04], [SITUP + 0.04, 1, 0.2, 'back'],
          [JUMP_ON, trampSquash, 0], [OFF_T + 0.28, 0.88, 0.04], [OFF_T + 0.32, 1, 0.2, 'back'], [SIT2, 0.9, 0.04], [SIT2 + 0.04, 1, 0.2, 'back'],
          [CHECK, 1.08, 0.05], [CHECK + 0.05, 1, 0.22, 'back'], [HOPOFF + 0.25, 0.88, 0.04], [HOPOFF + 0.29, 1, 0.15, 'back']],
      },
      dad: {
        pos: [[0, [1780, FL]], [DAD0, [DADX, FL], DAD1 - DAD0, 'lin'], [DAD_OUT, [1800, FL], 0.95, 'lin']],
        pose: [[0, makeWalk(DAD0, DAD1, 4.8, { lean: -4 })], [DAD1, 'a5_tDadJoke', 0.14, 'back'], [DAD_OUT, makeWalk(DAD_OUT, DAD_OUT + 0.95, 5, { lean: 4 }), 0]],
        face: [[0, 'smile'], [HAHA - 0.05, 'laugh', 0.05], [DAD_OUT - 0.1, 'smile', 0.08]],
        turn: [[0, -0.45], [DAD_OUT - 0.05, 0.5, 0.1]],
        gaze: [[0, 'kidAt'], [DAD_OUT, [1700, 450]]],
        squash: [[0, 1], [HAHA, laughBob(HAHA), 0.05], [DAD_OUT - 0.1, 1, 0.1]],
      },
      mom: {
        enter: MOM_IN,
        pos: [[0, MB], [LEAVE + 0.05, [MB[0], FL], 0.14, 'out'], [LEAVE + 0.3, [1820, FL], 1.15, 'lin']],
        pose: [[0, 'a5_tMomSit'], [POINT, 'a5_tMomPoint', 0.14, 'back'], [LEAVE + 0.05, 'stand', 0.12], [LEAVE + 0.3, makeWalk(LEAVE + 0.3, LEAVE + 1.45, 5.6, { lean: 5 }), 0]],
        face: [[0, 'smile'], [THINK, 'focus', 0.08], [LEAVE, 'smile', 0.08]],
        turn: [[0, -0.35], [LEAVE + 0.2, 0.5, 0.1]],
        gaze: [[0, 'kid'], [POINT, 'halves'], [LEAVE + 0.2, [1700, 450]]],
      },
    },
    targets: F => {
      const t = F.t, a = F.anchors.kid;
      return {
        paper: [DX, DTOP - 16], cupT: [DX + 122, DTOP - 44], qmark: Q, dadH: [DADX, 444], momH: [MB[0], 470],
        page: t < SHRINK + 0.4 ? evalTrack(PG_POS, t) : PG_SMALL,
        kidAt: t >= FLOP && t < SITUP ? PRONE_HEAD : (a ? a.head : [600, 600]),
        halves: a ? [(a.handL[0] + a.handR[0]) / 2, (a.handL[1] + a.handR[1]) / 2 - 30] : [610, 610],
        penFly: t >= THROW && t < THROW + PEN_FLY ? penFly(F, t) : [700, 100],
      };
    },
    fx: [
      { type: 'a5_tLayer', id: 'a5t.room', t0: -0.12, paint: roomPaint },
      { type: 'a5_tLayer', id: 'a5t.bedL', t0: UP, t1: BED_OUT + 0.3, fo: BED_OUT, fd: 0.3, paint: bedPaint, sfxAt: [[UP, 'paper']] },
      { type: 'a5_tLayer', id: 'a5t.trL', t0: TR_IN, t1: TR_OUT + 0.3, fo: TR_OUT, fd: 0.3, paint: trampPaint, sfxAt: [[TR_IN, 'pop']] },
      { type: 'a5_tQ', id: 'a5t.qfx' },
      // his little essay
      { type: 'a5_tEssay', id: 'a5t.essay' },
      { type: 'a5_tNote', id: 'a5t.n9', text: '（他 9 岁时自己写的小文章）', at: [PG_BIG[0], 668], rot: -2, t0: NOTE, t1: SHRINK + 0.1 },
      // the tap
      { type: 'a5_tTears', id: 'a5t.tears' },
      { type: 'a5_tNote', id: 'a5t.tap', text: '像水龙头', at: [544, 396], size: 48, rot: -5, t0: LB_TAP, t1: TAP_OFF + 0.1, arrow: [[452, 418], [362, 486]], bend: -0.2 },
      // pencil, paper
      { type: 'a5_tPen', id: 'a5t.penfx' },
      { type: 'a5_tHalves', id: 'a5t.halves' },
      // the bed
      { type: 'a5_tProne', id: 'a5t.prone' },
      { type: 'a5_tFume', id: 'a5t.fumefx' },
      { type: 'a5_tSay', id: 'a5t.haha', text: '哈哈！', at: [1010, 300], size: 80, rot: -6, tail: [70, 34], speaker: 'dad', t0: HAHA, t1: DAD_OUT },
      { type: 'a5_tNote', id: 'a5t.joke', text: '（讲个笑话）', at: [1000, 206], rot: -3, t0: HAHA + 0.25, t1: DAD_OUT },
      // the age stamp: 9, early 1985
      { type: 'ageStamp', age: 9, place: '1985 年', t0: STAMP, ...E5.STAMP, dockT: DOCK, pulse: [] },
      { type: 'a5_tFadeAll', id: 'a5t.end', f0: FADE0, fd: DUR - 0.05 - FADE0 },
    ],
    sfx: [[KID_IN, 'pop'], [UP + 0.14, 'thud'], [FLOP, 'thud'], [FLOP + 0.03, 'boing'], [SITUP, 'boop'], [MOM_IN, 'pop'], [POINT, 'tap'], [LEAVE + 0.14, 'thud'],
      [BED_OUT, 'whoosh'], [JUMP_ON, 'hop'], ...HOPS_ALL.map(h => [h, 'boing']), [OFF_T, 'hop'], [OFF_T + 0.28, 'thud'], [SIT2, 'thud'], [REACH + 0.2, 'tap'], [TAKE, 'paper'],
      ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => [WRITE2 + 0.2 + i * 0.68, 'pen']), [HOPOFF, 'hop'], [HOPOFF + 0.25, 'thud']],
    steps: [{ t0: WALK0, t1: FLOP, hz: 6.2 }, { t0: DAD0, t1: DAD1, hz: 4.8 }, { t0: DAD_OUT, t1: DAD_OUT + 0.95, hz: 5 }, { t0: LEAVE + 0.3, t1: LEAVE + 1.2, hz: 5.6 },
      { t0: WALK2, t1: SIT2 - 0.05, hz: 5.4 }, { t0: RUN0, t1: RUN0 + 0.9, hz: 8 }],
    subs: [
      { t0: 0.3, t1: 3.5, text: '题目一难，谁都会卡住。' },
      { t0: 3.9, t1: 8.1, text: '小陶九岁时，自己写过一篇小文章：' },
      { t0: 8.6, t1: 12.79, text: '“我很容易难过，眼泪说来就来。”', voice: 'kid' },
      { t0: 13.19, t1: 17.38, text: '“题做不出时，有时我会扔笔撕纸，', voice: 'kid' },
      { t0: 18.28, t1: 21.14, text: '跑到床上生闷气。”', voice: 'kid' },
      { t0: 22.04, t1: 26.84, text: '爸爸会讲笑话逗他；妈妈有空，会陪他想。' },
      { t0: 27.54, t1: 31.54, text: '他还发现：跳跳蹦床，气就消了。' },
      { t0: 32.64, t1: 37.78, text: '“不过很多时候，我是自己回去，再试一次——', voice: 'kid' },
      { t0: 37.88, t1: 42.07, text: '结果发现，那道题其实没那么难。”', voice: 'kid' },
    ],
  });
})();
