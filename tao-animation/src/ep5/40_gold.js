// 第 5 集 · 第 40 场 · 金牌（id gold）
// 事实（ep5-script.md）：1988 年六题 7、5、7、7、7、1，共 34 分，金牌线 32；第二天考完的次日（7 月 17 日）他满 13 岁，
//   “celebrated his thirteenth birthday during the contest and was paraded around the cafeteria by his teammates”（Crux 1988）；
//   闭幕式上澳大利亚总理给他颁金牌（片中只说“总理”，只画成一个穿西装打领带的大人）；至今最年轻的 IMO 金牌得主。
// 演绎：食堂里队友们簇拥着他绕桌子走一圈（不扛在肩上）；7 月 17 日比赛还没结束，所以那时他身上没有奖牌。
//   分数尺、三级台阶（铜、银、金：一年上一级）是系列的图示手法。
// 开场 = 第 35 场结尾（成绩单：第 4 格 7、第 6 格 1，位置 E5.SHEET），12 岁印章已停靠；说到“十三岁生日”时快速换成 13 岁。
(() => {
  const FL = 780, SH = E5.SHEET, C0 = SH.cell, SC = 'c5gSc', STAGE = 742;
  if (E5.S88.join() !== '7,5,7,7,7,1' || E5.S88.reduce((a, b) => a + b, 0) !== 34 || 34 <= 32 || 6 * 7 !== 42) console.error('c5_gold: score maths');
  /* ---------------- times (scene clock) ---------------- */
  const WR = [0.35, 0.6, 0.85, -5, 1.1, -5], TOTAL = 2.0;
  const RULER = 4.0, GLINE = 4.55, BAND = 5.2, MARK0 = 5.55, CLIMB = 5.65, CLIMB_D = 0.9, LAND = 6.6;
  const T_IN = 7.3, LB_GOLD = 7.6, A_OUT = 9.85;
  const SWAP = 10.5, CAF = 10.6, ENT0 = 11.0, ENT1 = 12.2, LOOP0 = 12.3, PERIOD = 5.8, LOOP1 = LOOP0 + PERIOD, HB = 15.0, C_OUT = 18.85;
  const STAGE_IN = 19.3, HOP_ST = 19.45, PM_IN = 19.65, PM_ARR = 20.5, LB_CER = 20.0, LB_PM = 20.7, APPROACH = 21.55, REACH = 22.2, MEDAL_ON = 22.85, BACKOFF = 23.15, CLAP = 23.55, S_OUT = 24.5;
  const STEPS_IN = 24.7, RUN0 = 24.95, RUN1 = 25.25, HOPS = [25.25, 25.7, 26.15], HOP_D = 0.3, CHEER2 = 26.9;
  const ZJ = 29.35, YOUNG = 30.3, CAP2 = 31.3, END = 33.9, DUR = 34.5;
  const fadeEnd = t => 1 - clamp((t - END) / 0.45);

  /* ---------------- little helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const fadeFrom = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); } };
  COMP.c5_gFade = {
    init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const k = 1 - clamp((t - fx.f0) / (fx.fd || 0.4)); if (k <= 0) return;
      const n0 = DL.items.length;
      COMP[fx.inner.type].draw(fx.inner, t, F);
      fadeFrom(n0, k);
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };
  /** numbers on the ruler are hand-written like the score sheet's */
  const NUMS = new Map();
  function rulerNum(key, str, x, yc, size, anchor, op, w = 5) {
    const id = str + '|' + size + '|' + anchor;
    if (!NUMS.has(id)) NUMS.set(id, layoutWriting({ text: str, x: 0, y: -size * 0.5, size, t0: -9, speed: 1, anchor }));
    if (op <= 0.01) return;
    DL.save(); DL.translate(x, yc);
    NUMS.get(id).strokes.forEach((st, i) => stroke(key + '.' + i, st.pts, { z: Z.front, w, opacity: op, boil: 0.5 }));
    DL.restore();
  }

  /* ---------------- 印章：12 岁 → 说到“十三岁生日”时在角落快速盖上 13 岁 ---------------- */
  const OLD = { age: 12, t0: -3, ...E5.STAMP, dockT: -2 };
  const NEW = { age: 13, t0: SWAP, center: [0, 0], dock: [0, 0], dockScale: 1, dockT: -99, R: E5.STAMP.R };
  COMP.c5_gStamp = {
    draw(fx, t, F) {
      const [dx, dy] = E5.STAMP.dock;
      if (t < SWAP) {   // the 12 shrinks away in the corner …
        const s = 1 - EASE.in(clamp((t - (SWAP - 0.18)) / 0.18)); if (s <= 0.01) return;
        DL.save(); DL.about(dx, dy, () => DL.scale(s)); COMP.ageStamp.draw(OLD, t, F); DL.restore();
        return;
      }
      // … and the 13 slams down in its place
      const u = clamp((t - SWAP) / 0.3), s = E5.STAMP.dockScale * (1 + 0.45 * (1 - EASE.out(u)));
      DL.save(); DL.translate(dx, dy); DL.scale(s); COMP.ageStamp.draw(NEW, t, F); DL.restore();
    },
    cues: () => [[SWAP - 0.18, 'whoosh'], [SWAP + 0.32, 'stamp']],
  };

  /* ---------------- 分数尺 0–42：金牌线 32，小三角从 0 爬到 34 ---------------- */
  const RX = 1330, RW = 50, Y0 = 740, YT = 300, Yv = v => Y0 - v * (Y0 - YT) / 42;
  const markV = t => 34 * EASE.out(clamp((t - CLIMB) / CLIMB_D));
  COMP.c5_gRuler = {
    draw(fx, t) {
      if (t < RULER || t >= A_OUT + 0.35) return;
      const lt = t - RULER, p = EASE.out(clamp(lt / 0.4)), z = Z.set + 2, k = 'c5gR', n0 = DL.items.length;
      stroke(k + '.body', box(RX - RW / 2, YT, RX + RW / 2, Y0), { z, w: 5, fill: C.paper, draw: p });
      for (let v = 0; v <= 42; v++) {
        const L = v % 10 === 0 ? 22 : v % 5 === 0 ? 15 : 8, q = clamp((lt - 0.2 - v * 0.006) / 0.1);
        if (q > 0) stroke(k + '.tk' + v, [[RX - RW / 2, Yv(v)], [RX - RW / 2 + L, Yv(v)]], { z: z + 0.1, w: v % 5 ? 2 : 3, opacity: q, boil: 0.4 });
      }
      const nq = clamp((lt - 0.35) / 0.2);
      rulerNum(k + '.n0', '0', RX + RW / 2 + 16, Y0 - 4, 42, 'start', nq, 4.5);
      rulerNum(k + '.n42', '42', RX + RW / 2 + 16, YT + 2, 42, 'start', nq, 4.5);
      text(k + '.full', '满分', RX + RW / 2 + 116, YT + 4, { size: 38, z: z + 0.2, opacity: nq });
      // the gold line, with a little medal disc and its number
      if (t >= GLINE) {
        const u = clamp((t - GLINE) / 0.25), y = Yv(32), pulse = 1 + 0.5 * Math.max(0, Math.sin(Math.PI * clamp((t - BAND) / 0.4)));
        stroke(k + '.ln', [[RX - RW / 2 - 14, y], [RX + 44, y]], { z: z + 0.3, w: 5 * pulse, draw: EASE.out(u) });
        const lq = clamp((t - GLINE - 0.15) / 0.2);
        if (lq > 0) {
          DL.save(); DL.translate(RX + 80, y); DL.scale(lerp(0.5, 1, EASE.back(lq)));
          stroke(k + '.md', ringPts(k + '.md', 0, 0, 30, 30, { n: 12, closed: true }), { z: z + 0.3, w: 4.5, closed: true, fill: C.paper });
          text(k + '.mc', '金', 0, 1, { size: 36, z: z + 0.4 });
          rulerNum(k + '.mv', '32', 44, 2, 50, 'start', 1, 5.5);
          DL.restore();
        }
      }
      // the marker: a little Terry head on a triangle, counting up as it climbs, landing just above the line
      if (t >= MARK0) {
        const v = markV(t), y = Yv(v), pop = EASE.back(clamp((t - MARK0) / 0.25)), landed = t >= LAND - 0.15;
        const hop = t >= CLIMB + CLIMB_D ? -10 * Math.max(0, Math.sin(Math.PI * clamp((t - CLIMB - CLIMB_D) / 0.3))) : 0;
        DL.save(); DL.translate(RX - RW / 2 - 4, y); DL.scale(Math.max(0.01, pop));
        stroke(k + '.tri', [[0, 0], [-30, -15, 1], [-30, 15, 1], [0, 0, 1]], { z: Z.front, w: 4, fill: C.red, color: C.red });
        portrait('c5gR.me', -66, -6 + hop, 24, { z: Z.front, happy: landed });
        rulerNum(k + '.mv2', String(Math.round(v)), -112, 0, 48, 'end', 1, 5);
        DL.restore();
        const q = (t - LAND + 0.15) / 0.45;
        if (q > 0 && q < 1) for (let i = 0; i < 5; i++) {
          const a = (-150 + i * 30) * RAD, c = [RX - RW / 2 - 70, y - 10], r0 = 34 + 26 * q;
          stroke(k + '.bu' + i, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0], [c[0] + Math.cos(a) * (r0 + 16), c[1] + Math.sin(a) * (r0 + 16)]], { z: Z.fx, w: 3.5, opacity: 1 - q, boil: 0.6 });
        }
      }
      fadeFrom(n0, 1 - clamp((t - A_OUT) / 0.35));
    },
    cues: () => [[RULER, 'paper'], [GLINE, 'pen'], [MARK0, 'pop'], [CLIMB, 'zip'], [LAND, 'tada']],
  };

  /** paper confetti (ink outlines) fluttering down behind the people: pure function of t, positions from a hash */
  COMP.c5_gConfetti = {
    draw(fx, t) {
      const k = fx.id, h = hstr(k);
      (fx.bursts || []).forEach((b, bi) => {
        for (let i = 0; i < 34; i++) {
          const d = rnd(h, bi * 100 + i, 1) * 0.25 + 0.25, u = (t - b - d) / 2.1; if (u <= 0 || u >= 1) continue;
          const x = 200 + (rnd(h, bi * 100 + i, 2) * 0.5 + 0.5) * 1200 + Math.sin(u * 7 + i) * 22, y = 300 + u * 460 + Math.sin(u * 3 + i) * 10;
          const rot = (rnd(h, bi * 100 + i, 3) * 2) * 400 * u, op = 1 - clamp((u - 0.75) / 0.25), kk = k + '.' + bi + '.' + i;
          DL.save(); DL.translate(x, y); DL.rotate(rot);
          if (i % 3 === 0) stroke(kk, [[-8, -3], [-2, 3], [4, -3], [10, 3]], { z: Z.shadow + 1, w: 2.6, opacity: op, boil: 0.5 });
          else stroke(kk, box(-7, -4, 7, 4), { z: Z.shadow + 1, w: 2.4, fill: i % 3 === 1 ? C.paper : C.ink, opacity: op, boil: 0.5 });
          DL.restore();
        }
      });
    },
  };

  /* ---------------- 食堂：一张长桌（餐盘），墙上一块“食堂”小牌子 ---------------- */
  const TB = { x0: 480, x1: 1120, top: 600 };
  COMP.c5_gCafe = {
    draw(fx, t) {
      if (t < CAF || t >= C_OUT + 0.35) return;
      const k = 'c5gCafe', z = Z.desk, p = EASE.out(clamp((t - CAF) / 0.4)), n0 = DL.items.length, { x0, x1, top } = TB;
      stroke(k + '.slab', box(x0, top, x1, top + 18), { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
      stroke(k + '.lL', [[x0 + 24, top + 18], [x0 + 22, FL]], { z, w: 5, draw: stag(p, 1, 3) });
      stroke(k + '.lR', [[x1 - 24, top + 18], [x1 - 22, FL]], { z, w: 5, draw: stag(p, 1, 3) });
      if (p > 0.8) shadow(k + '.sh', (x0 + x1) / 2, FL + 4, x1 - x0 + 30, 1);
      [570, 720, 880, 1030].forEach((x, i) => {   // trays with a plate and a cup
        const q = stag(p, 2, 3); if (q <= 0) return;
        stroke(k + '.tr' + i, [[x - 44, top - 2], [x + 44, top - 2, 1], [x + 38, top - 10, 1], [x - 38, top - 10, 1], [x - 44, top - 2, 1]], { z: z + 0.1, w: 3.2, fill: C.paper, draw: q });
        stroke(k + '.pl' + i, ringPts(k + '.pl' + i, x - 10, top - 14, 20, 5, { n: 8, closed: true }), { z: z + 0.2, w: 2.6, closed: true, fill: C.paper, draw: q });
        stroke(k + '.cu' + i, box(x + 18, top - 30, x + 32, top - 10), { z: z + 0.2, w: 2.6, fill: C.paper, draw: q });
      });
      // a little hanging sign
      const sx = 250, sy = 232, sq = clamp((t - CAF - 0.2) / 0.3);
      stroke(k + '.sgS', [[sx - 50, sy - 34], [sx, sy - 80, 1], [sx + 50, sy - 34]], { z: Z.set, w: 2.4, color: C.pencil, draw: sq });
      stroke(k + '.sg', box(sx - 80, sy - 36, sx + 80, sy + 36), { z: Z.set, w: 4.5, fill: C.paper, draw: sq });
      if (sq > 0.5) text(k + '.sgT', '食堂', sx, sy + 2, { size: 50, z: Z.set + 0.2, opacity: clamp((sq - 0.5) * 3) });
      fadeFrom(n0, 1 - clamp((t - C_OUT) / 0.35));
    },
    cues: () => [[CAF, 'paper']],
  };

  /* ---------------- 闭幕式：一个小舞台 ---------------- */
  COMP.c5_gStage = {
    draw(fx, t) {
      if (t < STAGE_IN || t >= S_OUT + 0.4) return;
      const k = 'c5gStg', z = Z.set + 1, p = EASE.out(clamp((t - STAGE_IN) / 0.4)), n0 = DL.items.length, x0 = 300, x1 = 1300;
      stroke(k, [[x0, FL], [x0 + 6, STAGE, 1], [x1 - 6, STAGE, 1], [x1, FL]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 2) });
      for (let i = 1; i < 8; i++) { const x = lerp(x0, x1, i / 8); stroke(k + '.p' + i, [[x, STAGE + 8], [x + 1, FL - 4]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.7, draw: stag(p, 1, 2), boil: 0.5 }); }
      fadeFrom(n0, 1 - clamp((t - S_OUT) / 0.35));
    },
    cues: () => [[STAGE_IN, 'paper']],
  };
  /** the medal in the prime minister's hands, until it goes round Terry's neck */
  COMP.c5_gHeld = {
    draw(fx, t, F) {
      if (t < PM_IN || t >= MEDAL_ON) return;
      const a = F.anchors.pm; if (!a) return;
      const hL = a.handL, hR = a.handR, c = [(hL[0] + hR[0]) / 2, (hL[1] + hR[1]) / 2 + 48], k = 'c5gHeld', z = Z.front + 1, r = 30;
      stroke(k + '.rL', [hL, [c[0] - r * 0.32, c[1] - r * 0.86]], { z: z - 0.1, w: 4 });
      stroke(k + '.rR', [hR, [c[0] + r * 0.32, c[1] - r * 0.86]], { z: z - 0.1, w: 4 });
      stroke(k + '.disc', ringPts(k, c[0], c[1], r, r, { n: 14, closed: true }), { z, w: 5, closed: true, fill: C.paper });
      text(k + '.t', '金', c[0], c[1] + 2, { size: 30 * 0.95 + 8, z: z + 0.2 });
    },
  };

  /* ---------------- 三级台阶：1986 铜 · 1987 银 · 1988 金 ---------------- */
  const STEP = [0, 1, 2].map(i => ({ x0: 470 + 230 * i, x1: 700 + 230 * i, top: 690 - 90 * i }));
  const STEP_TXT = ['1986 铜', '1987 银', '1988 金'];
  COMP.c5_gSteps = {
    draw(fx, t) {
      if (t < STEPS_IN || t >= DUR) return;
      const k = 'c5gSt', z = Z.set + 1, n0 = DL.items.length, fo = fadeEnd(t); if (fo <= 0) return;
      STEP.forEach((s, i) => {
        const p = EASE.out(clamp((t - STEPS_IN - i * 0.1) / 0.35)); if (p <= 0) return;
        stroke(k + '.b' + i, box(s.x0, s.top, s.x1, FL), { z: z + i * 0.01, w: 5, fill: C.paper, draw: p });
        const q = clamp((t - STEPS_IN - 0.25 - i * 0.1) / 0.2);
        if (q > 0) text(k + '.t' + i, STEP_TXT[i], (s.x0 + s.x1) / 2, s.top + 45, { size: 42, z: z + 0.2, opacity: q });
      });
      fadeFrom(n0, fo);
    },
    cues: () => [[STEPS_IN, 'paper']],
  };

  /* ---------------- “最年轻”：红色印章（和第 4 集一样） ---------------- */
  COMP.c5_gYoung = {
    draw(fx, t) {
      if (t < ZJ || t >= DUR) return;
      const [x, y] = fx.at, k = 'c5gYg', fo = fadeEnd(t); if (fo <= 0) return;
      const c1 = clamp((t - ZJ) / 0.2) * fo;
      if (c1 > 0) text(k + '.c0', '至今', x - 10, y - 138, { size: 52, color: C.red, z: Z.annot, opacity: c1, scale: lerp(0.6, 1, EASE.back(c1)), halo: 8 });
      const u = clamp((t - YOUNG) / 0.16), uo = clamp(u * 2.5) * fo;
      if (u > 0) {
        const W = 196, H = 76;
        DL.save(); DL.translate(x, y); DL.rotate(-7); DL.scale(lerp(1.8, 1, EASE.in(u)));
        stroke(k + '.o', box(-W, -H, W, H), { z: Z.annot, w: 6.5, color: C.red, opacity: uo, boil: 0.6 });
        stroke(k + '.i', box(-W + 11, -H + 11, W - 11, H - 11), { z: Z.annot, w: 2.6, color: C.red, opacity: uo, boil: 0.6 });
        text(k + '.t', '最年轻', 0, 4, { size: 112, color: C.red, z: Z.annot, opacity: uo });
        DL.restore();
        const q = (t - YOUNG - 0.16) / 0.35;
        if (q > 0 && q < 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => {
          const bx = x + sx * (W + 18 + 20 * q), by = y + sy * (H + 10 + 14 * q);
          stroke(k + '.b' + i, [[bx, by], [bx + sx * 24, by + sy * 16]], { z: Z.annot, w: 4.5, color: C.red, opacity: 1 - q, boil: 0.6 });
        });
      }
      const c2 = clamp((t - CAP2) / 0.2) * fo;
      if (c2 > 0) text(k + '.c1', '金牌得主', x, y + 140, { size: 56, color: C.red, z: Z.annot, opacity: c2, scale: lerp(0.6, 1, EASE.back(clamp((t - CAP2) / 0.2))), halo: 8 });
    },
    cues: () => [[ZJ, 'pop'], [YOUNG, 'whoosh'], [YOUNG + 0.15, 'stamp'], [CAP2, 'pop']],
  };

  /* ---------------- 绕桌子一圈：一条椭圆路线，前半圈在桌子前面，后半圈在桌子后面（被桌子挡住） ---------------- */
  const RXL = 430, PCX = 800;
  const thetaT = t => Math.PI / 2 + 2 * Math.PI * clamp((t - LOOP0) / PERIOD);
  const pathAt = th => [PCX - RXL * Math.cos(th), 740 + 40 * Math.sin(th)];
  const inLoop = t => t >= LOOP0 && t < LOOP1;
  const MATE = {
    mate1: { off: 0.42, from: 1760 }, mate2: { off: 0.84, from: 1900 },
    mate3: { off: -0.42, from: -200 }, mate4: { off: -0.84, from: -350 }, mate5: { off: -1.26, from: -500 },
  };
  const homeOf = id => pathAt(Math.PI / 2 + MATE[id].off);
  const ARMS = {
    mate1: t => ({ armScale: 1.2, armR: [132 + 14 * Math.sin(t * 9), 30], armL: [16, 10] }),
    mate2: () => ({ armScale: 1.4, armL: [140, 20], armR: [140, 20] }),
    mate3: () => ({ armScale: 1.1, ikL: { w: 1, to: 'chin', dx: -0.15, dy: 0.9, bend: 'down' }, ikR: { w: 1, to: 'chin', dx: 0.15, dy: 0.9, bend: 'down' } }),
    mate4: () => ({ armScale: 1.4, armL: [140, 20], armR: [140, 20] }),
    mate5: t => ({ armScale: 1.2, armL: [132 + 14 * Math.sin(t * 9 + 1), 30], armR: [16, 10] }),
  };
  const zipPose = s => ({ lean: s * 14, tilt: s * 6, armL: [40, 30], armR: [40, 30], ikL: { w: 0 }, ikR: { w: 0 } });
  const loopTurn = th => 0.45 * clamp(Math.sin(th) * 4, -1, 1);
  const mateTracks = id => {
    const m = MATE[id], home = homeOf(id), right = m.from > 800, walkE = makeWalk(ENT0, ENT1, 5.2, { lean: -3 }), walkL = makeWalk(LOOP0, LOOP1, 4.6, { lean: -2, bounce: 0.8 });
    const cOut = C_OUT + (right ? 0 : 0.06) + Math.abs(m.off) * 0.04;
    return {
      pos: [[0, t => {
        if (t < ENT0) return [m.from, home[1]];
        if (t < ENT1) return [lerp(m.from, home[0], (t - ENT0) / (ENT1 - ENT0)), home[1]];
        if (inLoop(t)) return pathAt(thetaT(t) + m.off);
        return home;
      }], [cOut, [right ? 2000 : -400, home[1]], 0.35, 'in']],
      pose: [[0, t => {
        if (t < ENT1) return walkE(t);
        const arms = ARMS[id](t);
        return inLoop(t) ? { ...walkL(t), ...arms } : { ...POSE.stand, ...arms };
      }], [cOut, zipPose(right ? 1 : -1), 0.08]],
      face: [[0, 'smile'], [ENT1, 'joy', 0.05], [HB, 'laugh', 0.05], [LOOP1, 'joy', 0.05]],
      turn: [[0, t => (t < ENT1 ? (right ? -0.45 : 0.45) : inLoop(t) ? loopTurn(thetaT(t) + m.off) : (right ? -0.3 : 0.3))], [cOut, right ? 0.45 : -0.45, 0.08]],
      gaze: [[0, 'terry']],
    };
  };
  const zOff = (id, t) => {
    if (t < CAF - 0.1 || t >= C_OUT + 0.6) return 0;
    const th = id === 'terry' ? thetaT(t) : thetaT(t) + MATE[id].off;
    return inLoop(t) && Math.sin(th) < 0 ? -22 : 12;
  };

  /* ---------------- 小陶的路线：站着 → 绕桌子 → 跳上舞台 → 跑出去 → 跑回来一级一级跳上台阶 ---------------- */
  const SP = [[330, FL], [620, 690], [850, 600], [1080, 510]];   // floor start + the three steps (where he stands)
  const hopArc = (a, b, u, h) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)];
  const posT = t => {
    if (inLoop(t)) return pathAt(thetaT(t));
    if (t < HOP_ST) return [PCX, FL];
    if (t < HOP_ST + HOP_D) return hopArc([PCX, FL], [740, STAGE], (t - HOP_ST) / HOP_D, 60);
    if (t < S_OUT) return [740, STAGE];
    if (t < RUN0) return [lerp(740, -300, EASE.in(clamp((t - S_OUT) / 0.3))), STAGE];
    if (t < RUN1) return [lerp(-100, SP[0][0], (t - RUN0) / (RUN1 - RUN0)), FL];
    for (let i = 2; i >= 0; i--) {
      const h0 = HOPS[i];
      if (t >= h0 + HOP_D) return SP[i + 1];
      if (t >= h0) return hopArc(SP[i], SP[i + 1], (t - h0) / HOP_D, 80);
    }
    return SP[0];
  };
  const floorT = t => {
    if (t >= HOP_ST + HOP_D * 0.5 && t < S_OUT) return STAGE;
    for (let i = 2; i >= 0; i--) if (t >= HOPS[i] + HOP_D * 0.5) return SP[i + 1][1];
    return FL;
  };
  Object.assign(POSE, {
    c5_gTuck: { legL: [34, -60], legR: [34, -60], armScale: 1.75, armL: [140, 18], armR: [140, 18] },
    c5_gHold: { lean: -3, ikL: { w: 1, to: 'hip', dx: -66, dy: -50, bend: 'down' }, ikR: { w: 1, to: 'hip', dx: -32, dy: -50, bend: 'down' } },
    c5_gHang: { lean: -8, tilt: -6, armScale: 1.2, ikL: { w: 1, to: 'abs', dx: 752, dy: 606, bend: 'down' }, ikR: { w: 1, to: 'abs', dx: 778, dy: 606, bend: 'down' } },
    c5_gClap: { armScale: 1.1, ikL: { w: 1, to: 'chin', dx: -0.15, dy: 0.9, bend: 'down' }, ikR: { w: 1, to: 'chin', dx: 0.15, dy: 0.9, bend: 'down' } },
  });
  const walkLoopT = makeWalk(LOOP0, LOOP1, 4.6, { lean: -2, bounce: 0.8 });
  const runT = makeWalk(RUN0, RUN1, 6, { lean: -6 });
  const pmWalk = (t0, t1) => makeWalk(t0, t1, 5.2, { lean: -3 });
  const pmHoldWalk = (t0, t1) => { const w = pmWalk(t0, t1); return t => ({ ...w(t), ...POSE.c5_gHold }); };
  const terryHops = HOPS.flatMap(h => [[h, 'c5_gTuck', 0.07], [h + HOP_D, 'stand', 0.1]]);
  const terrySq = HOPS.flatMap(h => [[h + HOP_D, 0.88, 0.05], [h + HOP_D + 0.05, 1, 0.2, 'back']]);

  /** the people of the cafeteria loop (and Terry all scene long), drawn here so each can pass in front of or behind the table */
  const CROWD = ['mate5', 'mate4', 'mate3', 'terry', 'mate1', 'mate2'];
  COMP.c5_gCrowd = {
    draw(fx, t, F) {
      const Ls = CROWD.map(id => [id, layoutChar(id, t, F)]).filter(([, L]) => L);
      Ls.forEach(([id]) => { F.targets[id] = F.anchors[id].head; });
      Ls.sort((a, b) => zOff(a[0], t) - zOff(b[0], t));
      Ls.forEach(([id, L]) => { L.def = { ...L.def, z: zOff(id, t), floor: id === 'terry' ? floorT(t) : FL }; drawChar(L, F); });
    },
  };

  defineScene({
    id: 'gold', chapter: '金牌', dur: DUR, floor: FL,
    cast: {
      terry: { ...E5.terry },
      mate1: { ...E5.mate1 }, mate2: { ...E5.mate2 }, mate3: { ...E5.mate3 }, mate4: { ...E5.mate4 }, mate5: { ...E5.mate5 },
      pm: { ...E5.pm, floor: STAGE },
    },
    order: ['pm'],   // the others are drawn by c5_gCrowd
    tracks: {
      terry: {
        enter: T_IN,
        pos: [[0, posT], [END + 0.05, [1900, SP[3][1]], 0.35, 'in']],
        pose: [[0, 'stand'], [T_IN, 'kidCheer', 0.1, 'back'], [9.6, 'stand', 0.15],
          [LOOP0, t => ({ ...walkLoopT(t), armScale: 1.75, armL: [140, 18], armR: [140, 18] }), 0], [LOOP1, 'kidCheer', 0.1], [C_OUT, 'stand', 0.15],
          [HOP_ST, 'c5_gTuck', 0.07], [HOP_ST + HOP_D, 'stand', 0.1], [MEDAL_ON + 0.3, 'kidCheer', 0.1, 'back'], [24.15, 'stand', 0.15],
          [S_OUT, zipPose(-1), 0.08], [RUN0, runT, 0], ...terryHops, [CHEER2, 'kidCheer', 0.1, 'back'], [28.6, 'stand', 0.15],
          [END + 0.05, zipPose(1), 0.08]],
        face: [[0, 'smile'], [T_IN, 'joy', 0.05], [9.6, 'grin', 0.08], [ENT1, 'joy', 0.05], [C_OUT, 'grin', 0.08], [REACH, 'smile', 0.06], [MEDAL_ON, 'joy', 0.05],
          [S_OUT, 'grin', 0.06], [CHEER2, 'joy', 0.05], [28.6, 'proud', 0.08], [YOUNG, 'proudGrin', 0.06]],
        turn: [[0, 0], [LOOP0, t => (inLoop(t) ? loopTurn(thetaT(t)) : 0), 0], [LOOP1, 0, 0.12], [PM_IN, 0.35, 0.12], [S_OUT, -0.45, 0.08], [RUN0, 0.45, 0], [CHEER2, 0, 0.12], [ZJ, -0.3, 0.12]],
        gaze: [[0, 'viewer'], [ENT0 + 0.3, 'mate1'], [LOOP0, 'viewer'], [PM_ARR, 'pmT'], [MEDAL_ON, 'medal'], [MEDAL_ON + 0.6, 'viewer'], [RUN0, [1700, 400]], [CHEER2, 'viewer'], [ZJ, 'young'], [YOUNG + 1.0, 'viewer']],
        squash: [[0, 1], [T_IN + 0.05, 0.9, 0.05], [T_IN + 0.11, 1.06, 0.08], [T_IN + 0.19, 1, 0.2, 'back'], [HOP_ST + HOP_D, 0.88, 0.05], [HOP_ST + HOP_D + 0.05, 1, 0.2, 'back'],
          [MEDAL_ON + 0.3, 0.92, 0.05], [MEDAL_ON + 0.36, 1, 0.2, 'back'], ...terrySq],
      },
      ...Object.fromEntries(Object.keys(MATE).map(id => [id, mateTracks(id)])),
      pm: {
        pos: [[0, [1720, STAGE]], [PM_IN, [1010, STAGE], PM_ARR - PM_IN, 'lin'], [APPROACH, [930, STAGE], 0.35, 'lin'], [BACKOFF, [1010, STAGE], 0.35, 'lin'], [S_OUT, [1950, STAGE], 0.35, 'in']],
        pose: [[0, pmHoldWalk(PM_IN, PM_ARR)], [APPROACH, pmHoldWalk(APPROACH, APPROACH + 0.35), 0], [REACH, 'c5_gHang', 0.3], [BACKOFF, pmWalk(BACKOFF, BACKOFF + 0.35), 0.1], [CLAP, 'c5_gClap', 0.12, 'back'],
          [S_OUT, zipPose(1), 0.08]],
        face: [[0, 'smile'], [MEDAL_ON, 'grin', 0.06]],
        turn: [[0, -0.4], [S_OUT, 0.45, 0.08]],
        gaze: [[0, 'tHead'], [S_OUT, [1800, 400]]],
      },
    },
    targets: F => {
      const p = posT(F.t);
      return { tHead: [p[0], p[1] - 235], pmT: [1000, 400], medal: [745, 650], young: [300, 400] };
    },
    set: [{ type: 'floor', t0: 7.2, t1: END + 0.45 }],
    fx: [
      { type: 'c5_gStamp', id: 'c5gStamp' },
      // L1：其余格子写 7、5、7、7，写“= 34”（第一帧 = 第 35 场结尾：第 4 格 7、第 6 格 1）
      { type: 'c5_gFade', f0: A_OUT, fd: 0.35, inner: { type: 'e5_scores', id: SC, at: SH.at, cell: C0, t0: -1, scores: E5.S88.map((v, i) => [v, WR[i]]), total: [34, TOTAL] } },
      // L2：金牌线 32
      { type: 'c5_gRuler', id: 'c5gR' },
      { type: 'c5_gFade', f0: A_OUT - 0.3, fd: 0.3, inner: { type: 'band', id: 'c5gHi', rect: [RX + 46, Yv(32) - 34, 130, 68], t0: BAND, dur: 0.35 } },
      // L3：金牌！
      { type: 'c5_gConfetti', id: 'c5gConf', bursts: [T_IN + 0.1, MEDAL_ON + 0.15] },
      { type: 'c5_gFade', f0: A_OUT, fd: 0.3, inner: { type: 'title', id: 'c5gWin', text: '金牌！', x: 800, y: 392, size: 84, color: 'red', rot: -4, t0: LB_GOLD, sfx: 'tada' } },
      // L4–L5：食堂，绕桌子一圈（7 月 17 日，身上还没有奖牌）
      { type: 'c5_gCafe', id: 'c5gCafe' },
      { type: 'c5_gFade', f0: C_OUT, fd: 0.35, inner: { type: 'title', id: 'c5gDate', text: '（7 月 17 日）', x: 1240, y: 262, size: 44, color: 'red', rot: 3, t0: CAF + 0.4, dur: 0.2 } },
      // L6：闭幕式
      { type: 'c5_gStage', id: 'c5gStg' },
      { type: 'c5_gFade', f0: S_OUT, fd: 0.35, inner: { type: 'title', id: 'c5gCer', text: '（1988 年闭幕式）', x: 800, y: 236, size: 44, color: 'red', rot: -2, t0: LB_CER, dur: 0.2 } },
      // L7：铜、银、金
      { type: 'c5_gSteps', id: 'c5gSt' },
      // the crowd (Terry + teammates) and everything that hangs on them
      { type: 'c5_gCrowd', id: 'c5gCrowd' },
      { type: 'c5_gFade', f0: C_OUT - 0.2, fd: 0.3, inner: { type: 'speech', id: 'c5gHB', text: '生日快乐！', at: [800, 226], size: 76, t0: HB, t1: DUR, rot: -3 } },
      { type: 'label', id: 'c5gLbPm', text: '总理', at: [1260, 300], rot: 4, size: 50, t0: LB_PM, t1: APPROACH, target: { char: 'pm', part: 'headTop', dx: 34, dy: 16 }, bend: -0.2, gap: 12 },
      { type: 'c5_gHeld', id: 'c5gHeld' },
      { type: 'e5_medal', id: 'c5gMedal', char: 'terry', label: '金', t0: MEDAL_ON, t1: S_OUT + 0.35, shine: [MEDAL_ON + 0.4] },
      ...STEP.map((s, i) => ({ type: 'c5_gFade', f0: END, fd: 0.45, inner: { type: 'e5_medal', id: 'c5gM' + i, at: [s.x0 + 54, s.top - 58], r: 38, label: ['铜', '银', '金'][i], t0: HOPS[i] + HOP_D, shine: [HOPS[i] + HOP_D + 0.1] } })),
      // L8：至今最年轻的金牌得主
      { type: 'c5_gYoung', id: 'c5gYg', at: [300, 400] },
    ],
    sfx: [[T_IN, 'pop'], [HOP_ST + HOP_D, 'thud'], ...HOPS.map(h => [h, 'hop']), [C_OUT, 'whoosh'], [S_OUT, 'whoosh'], [CLAP, 'boop'], [END + 0.05, 'whoosh']],
    steps: [{ t0: ENT0, t1: ENT1, hz: 5.2 }, { t0: LOOP0, t1: LOOP1, hz: 4.6 }, { t0: PM_IN, t1: PM_ARR, hz: 5.2 }, { t0: RUN0, t1: RUN1, hz: 6 }],
    subs: [
      { t0: 0.3, t1: 3.5, text: '两天加起来：34分。', say: '两天加起来：三十四分。' },
      { t0: 4.0, t1: 7.0, text: '金牌线是32分——', say: '金牌线是三十二分——' },
      { t0: 7.3, t1: 9.7, text: '他拿到了金牌！' },
      { t0: 10.4, t1: 14.6, text: '十三岁生日那天，队友们簇拥着他，' },
      { t0: 14.7, t1: 18.9, text: '在食堂里转了一大圈，给他过生日。' },
      { t0: 19.5, t1: 24.5, text: '闭幕式上，澳大利亚总理亲手把金牌颁给他。' },
      { t0: 25.2, t1: 28.6, text: '铜、银、金：一年上一级。' },
      { t0: 29.2, t1: 34.0, text: '至今，他仍是最年轻的国际奥数金牌得主。' },
    ],
  });
})();
