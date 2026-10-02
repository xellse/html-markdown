// 第 4 集 · 铜牌
// 事实（ep4-script.md）：六题 7、7、3、1、0、1，共 19 分（第一天 17，第二天 2）；那年奖牌线：金 34、银 26、铜 17；
//   满分 42（6 题 × 7 分）；澳大利亚队五人获铜牌；他至今仍是 IMO 历史上最年轻的奖牌得主。
// 演绎：“领奖”只画成挂上奖牌、队员们一起欢呼；他当时怎么想没有记录，这里只演开心，不演别的心事。
// 开场 = 第 30 场结尾（成绩单 7、7、3、1、0、1，位置 E4.SHEET）。
(() => {
  const FL = 780, SH = E4.SHEET, C0 = SH.cell, SC = 'b4b.sc';
  // e4_scores centres the whole row, "= 19" included: shift it right by half the total's width so the six boxes stay
  // exactly where scene 30 left them (E4.SHEET)
  const TOT_W = C0 * 1.5 + 40, AT = [SH.at[0] + TOT_W / 2, SH.at[1]];
  if (7 + 7 + 3 + 1 + 0 + 1 !== 19 || 7 + 7 + 3 !== 17 || 1 + 0 + 1 !== 2 || 6 * 7 !== 42) console.error('b4b: score maths');
  if (E4.SCORES.join() !== '7,7,3,1,0,1') console.error('b4b: E4.SCORES changed');
  /* ---------------- times (scene clock) ---------------- */
  const SWEEP = 0.55, TOTAL = 1.65;
  const RULER = 3.85, LINES_T = [4.2, 4.35, 4.5], BRONZE = 5.55, BAND = 5.75, MARK0 = 6.95, CLIMB = 7.05, CLIMB_D = 0.85, LAND = 8.0, R_END = 10.5;
  const T_IN = 10.55, PULSE = 10.75, MEDAL = 12.55;
  const MATES_IN = 14.55, COUNT = [15.2, 15.55, 15.9, 16.25, 16.6], CUT2 = 18.9;
  const ZJ = 19.25, YOUNG = 20.3, CAP2 = 21.15, CUT3 = 24.6;
  const UL19 = 24.85, COLS = 25.0, FILL1 = 25.45, FILL_DT = 0.085, BR17 = 27.05;
  const FILL2 = [29.3, 29.55], BR2 = 29.75, EMPTY = 30.35;      // shared braces write their number 0.3 s after t0
  const DUR = 32.5;

  SFX.define('b4_none', () => {});

  /* ---------------- 两天加起来：一支红箭头从第 1 格扫到第 6 格，指向 “= 19” ---------------- */
  COMP.b4_sweep = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.targets[SC + '.s0'], b = F.targets[SC + '.s5']; if (!a || !b) return;
      const y = SH.at[1] + C0 / 2 + 15;
      arrow('b4b.sw', [a[0] - C0 / 2 + 6, y + 2], [b[0] + C0 / 2 + 26, y - 6], { p: EASE.io(clamp((t - fx.t0) / 0.7)), bend: -0.015, w: 4.5, head: 18 });
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  /* ---------------- 分数尺 0–42：金 34、银 26、铜 17，一个小三角从 0 爬到 19 ---------------- */
  const RX = 800, RW = 56, Y0 = 740, YT = 300, Yv = v => Y0 - v * (Y0 - YT) / 42;
  const MEDALS = [['金', 34], ['银', 26], ['铜', 17]];
  const markV = t => 19 * EASE.out(clamp((t - CLIMB) / CLIMB_D));
  COMP.b4_ruler = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, p = EASE.out(clamp(lt / 0.4)), z = Z.set + 2, k = 'b4b.r';
      stroke(k + '.body', [[RX - RW / 2, Y0], [RX - RW / 2, YT, 1], [RX + RW / 2, YT, 1], [RX + RW / 2, Y0, 1], [RX - RW / 2, Y0, 1]], { z, w: 5, fill: C.paper, draw: p });
      for (let v = 0; v <= 42; v++) {
        const L = v % 10 === 0 ? 24 : v % 5 === 0 ? 17 : 9, q = clamp((lt - 0.2 - v * 0.006) / 0.1);
        if (q > 0) stroke(k + '.tk' + v, [[RX - RW / 2, Yv(v)], [RX - RW / 2 + L, Yv(v)]], { z: z + 0.1, w: v % 5 ? 2 : 3, opacity: q, boil: 0.4 });
      }
      const nq = clamp((lt - 0.35) / 0.2);
      text(k + '.n0', '0', RX + RW / 2 + 28, Y0 - 4, { size: 44, font: CFG.FONT_MIX, z: z + 0.2, opacity: nq });
      text(k + '.n42', '42', RX + RW / 2 + 36, YT + 2, { size: 44, font: CFG.FONT_MIX, z: z + 0.2, opacity: nq });
      text(k + '.full', '满分', RX + RW / 2 + 118, YT + 4, { size: 38, color: C.ink, z: z + 0.2, opacity: nq });
      // the three medal lines (ink), each with a little medal disc and its number
      MEDALS.forEach(([ch, v], i) => {
        const tl = LINES_T[i]; if (t < tl) return;
        const u = clamp((t - tl) / 0.25), y = Yv(v), bronze = ch === '铜';
        const pulse = bronze && t >= BRONZE ? 1 + 0.5 * Math.max(0, Math.sin(Math.PI * clamp((t - BRONZE) / 0.4))) : 1;
        stroke(k + '.ln' + i, [[RX - RW / 2 - 14, y], [RX + 128, y]], { z: z + 0.3, w: (bronze && t >= BRONZE ? 6 : 4.5) * pulse, draw: EASE.out(u) });
        const lq = clamp((t - tl - 0.15) / 0.2); if (lq <= 0) return;
        const dx = RX + 172, sc = lerp(0.5, 1, EASE.back(lq));
        DL.save(); DL.translate(dx, y); DL.scale(sc);
        stroke(k + '.md' + i, ringPts(k + '.md' + i, 0, 0, 32, 32, { n: 12, closed: true }), { z: z + 0.3, w: 4.5, closed: true, fill: C.paper });
        text(k + '.mc' + i, ch, 0, 1, { size: 38, z: z + 0.4 });
        text(k + '.mv' + i, String(v), 48, 2, { size: 58, font: CFG.FONT_MIX, anchor: 'start', z: z + 0.4 });
        DL.restore();
      });
      // the marker: a little Terry head on a triangle, counting up as it climbs
      if (t >= MARK0) {
        const v = markV(t), y = Yv(v), pop = EASE.back(clamp((t - MARK0) / 0.25)), landed = t >= LAND - 0.15;
        const hop = t >= CLIMB + CLIMB_D ? -10 * Math.max(0, Math.sin(Math.PI * clamp((t - CLIMB - CLIMB_D) / 0.3))) : 0;
        DL.save(); DL.translate(RX - RW / 2 - 4, y); DL.scale(pop);
        stroke(k + '.tri', [[0, 0], [-30, -15, 1], [-30, 15, 1], [0, 0, 1]], { z: Z.front, w: 4, fill: C.ink });
        portrait('b4b.r.me', -66, -6 + hop, 24, { z: Z.front, happy: landed });
        text(k + '.mv', String(Math.round(v)), -118, 0, { size: 50, font: CFG.FONT_MIX, z: Z.front, anchor: 'end' });
        DL.restore();
        // a little burst when it lands on 19
        const q = (t - LAND + 0.15) / 0.45;
        if (q > 0 && q < 1) for (let i = 0; i < 5; i++) {
          const a = (-150 + i * 30) * RAD, c = [RX - RW / 2 - 70, y - 10], r0 = 34 + 26 * q;
          stroke(k + '.bu' + i, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0], [c[0] + Math.cos(a) * (r0 + 16), c[1] + Math.sin(a) * (r0 + 16)]], { z: Z.fx, w: 3.5, opacity: 1 - q, boil: 0.6 });
        }
      }
    },
    cues: fx => [[fx.t0, 'paper'], ...LINES_T.map(tl => [tl, 'pen']), [BRONZE, 'boop'], [MARK0, 'pop'], [CLIMB, 'zip'], [LAND, 'tada']],
  };

  /* ---------------- 领奖：一个台子、一串小旗、两阵纸屑 ---------------- */
  const STAGE = 742;
  SETDRAW.b4_stage = (sp, p) => {
    const x0 = 170, x1 = 1430, z = Z.set + 1;
    stroke('b4b.stg', [[x0, FL], [x0 + 6, STAGE, 1], [x1 - 6, STAGE, 1], [x1, FL]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 2) });
    for (let i = 1; i < 9; i++) { const x = lerp(x0, x1, i / 9); stroke('b4b.stgP' + i, [[x, STAGE + 8], [x + 1, FL - 4]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.7, draw: stag(p, 1, 2), boil: 0.5 }); }
  };
  const BUNT = { x0: 140, x1: 1460, y: 288, sag: 34, n: 15 };
  const buntY = x => BUNT.y + BUNT.sag * (1 - Math.pow((x - (BUNT.x0 + BUNT.x1) / 2) / ((BUNT.x1 - BUNT.x0) / 2), 2));
  COMP.b4_bunting = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1 + 0.3) return;
      const lt = t - fx.t0, op = 1 - clamp((t - fx.t1) / 0.3), z = Z.set + 1, k = 'b4b.bt';
      const pts = []; for (let i = 0; i <= 16; i++) { const x = lerp(BUNT.x0, BUNT.x1, i / 16); pts.push([x, buntY(x)]); }
      stroke(k, pts, { z, w: 2.6, opacity: op, draw: EASE.out(clamp(lt / 0.4)) });
      for (let i = 0; i < BUNT.n; i++) {
        const q = clamp((lt - 0.15 - i * 0.03) / 0.15); if (q <= 0) continue;
        const xa = lerp(BUNT.x0, BUNT.x1, (i + 0.25) / BUNT.n), xb = lerp(BUNT.x0, BUNT.x1, (i + 0.85) / BUNT.n), xm = (xa + xb) / 2;
        const ya = buntY(xa), yb = buntY(xb), tip = [xm + Math.sin(t * 2.4 + i) * 3, (ya + yb) / 2 + 42 * q];
        stroke(k + '.f' + i, [[xa, ya], [xb, yb, 1], [tip[0], tip[1], 1], [xa, ya, 1]], { z, w: 3, fill: C.paper, opacity: op });
        if (i % 2) [0.3, 0.55].forEach((u, j) => stroke(k + '.h' + i + j, [lerp2([xa, ya], tip, u), lerp2([xb, yb], tip, u)], { z: z + 0.1, w: 2, color: C.pencil, opacity: op, boil: 0.5 }));
      }
    },
    cues: fx => [[fx.t0, 'whoosh']],
  };
  /** paper confetti (ink outlines) fluttering down after a medal, behind the people: pure function of t, positions from a hash */
  COMP.b4_confetti = {
    draw(fx, t) {
      const k = fx.id, h = hstr(k);
      (fx.bursts || []).forEach((b, bi) => {
        for (let i = 0; i < 34; i++) {
          const d = rnd(h, bi * 100 + i, 1) * 0.25 + 0.25, u = (t - b - d) / 2.1; if (u <= 0 || u >= 1) continue;
          const x = 200 + (rnd(h, bi * 100 + i, 2) * 0.5 + 0.5) * 1200 + Math.sin(u * 7 + i) * 22, y = 300 + u * 470 + Math.sin(u * 3 + i) * 10;
          const rot = (rnd(h, bi * 100 + i, 3) * 2) * 400 * u, op = 1 - clamp((u - 0.75) / 0.25), kk = k + '.' + bi + '.' + i;
          DL.save(); DL.translate(x, y); DL.rotate(rot);
          if (i % 3 === 0) stroke(kk, [[-8, -3], [-2, 3], [4, -3], [10, 3]], { z: Z.shadow + 1, w: 2.6, opacity: op, boil: 0.5 });
          else stroke(kk, [[-7, -4], [7, -4, 1], [7, 4, 1], [-7, 4, 1], [-7, -4, 1]], { z: Z.shadow + 1, w: 2.4, fill: i % 3 === 1 ? C.paper : C.ink, opacity: op, boil: 0.5 });
          DL.restore();
        }
      });
    },
  };

  /* ---------------- 五块铜牌：每挂上一块，红笔数一个数 ---------------- */
  const CNT = COUNT.map((tc, i) => layoutWriting({ text: String(i + 1), x: 0, y: 0, size: 50, t0: tc + 0.12, speed: 2600, anchor: 'middle' }));
  const MEDAL_IDS = ['b4b.mT', 'b4b.m1', 'b4b.m2', 'b4b.m3', 'b4b.m4'];
  const MEDAL_R = [30, 36, 36, 36, 36];
  COMP.b4_count = {
    draw(fx, t, F) {
      if (t >= fx.t1) return;
      CNT.forEach((L, i) => {
        const c = F.targets[MEDAL_IDS[i] + '.c']; if (!c || t < L.t0) return;
        DL.save(); DL.translate(c[0] + MEDAL_R[i] + 26, c[1] - MEDAL_R[i] - 30);
        L.strokes.forEach((s, j) => { const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke('b4b.cnt' + i + '.' + j, s.pts, { z: Z.annot, w: 6, color: C.red, draw: q, boil: 0.55 }); });
        DL.restore();
      });
    },
    cues: () => CNT.map(L => [L.t0, 'pen']),
  };

  /* ---------------- “最年轻”：红色印章 ---------------- */
  COMP.b4_young = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [x, y] = fx.at, k = 'b4b.yg';
      const c1 = clamp((t - ZJ) / 0.2);
      if (c1 > 0) text(k + '.c0', '至今', x - 10, y - 138, { size: 52, color: C.red, z: Z.annot, opacity: c1, scale: lerp(0.6, 1, EASE.back(c1)), halo: 8 });
      const u = clamp((t - YOUNG) / 0.16);
      if (u > 0) {
        const W = 196, H = 76;
        DL.save(); DL.translate(x, y); DL.rotate(-7); DL.scale(lerp(1.8, 1, EASE.in(u)));
        stroke(k + '.o', [[-W, -H], [W, -H, 1], [W, H, 1], [-W, H, 1], [-W, -H, 1]], { z: Z.annot, w: 6.5, color: C.red, opacity: clamp(u * 2.5), boil: 0.6 });
        stroke(k + '.i', [[-W + 11, -H + 11], [W - 11, -H + 11, 1], [W - 11, H - 11, 1], [-W + 11, H - 11, 1], [-W + 11, -H + 11, 1]], { z: Z.annot, w: 2.6, color: C.red, opacity: clamp(u * 2.5), boil: 0.6 });
        text(k + '.t', '最年轻', 0, 4, { size: 112, color: C.red, z: Z.annot, opacity: clamp(u * 2.5) });
        DL.restore();
        const q = (t - YOUNG - 0.16) / 0.35;
        if (q > 0 && q < 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => {
          const bx = x + sx * (W + 18 + 20 * q), by = y + sy * (H + 10 + 14 * q);
          stroke(k + '.b' + i, [[bx, by], [bx + sx * 24, by + sy * 16]], { z: Z.annot, w: 4.5, color: C.red, opacity: 1 - q, boil: 0.6 });
        });
      }
      const c2 = clamp((t - CAP2) / 0.2);
      if (c2 > 0) {   // "IMO" in Patrick Hand (the Chinese font draws its O as a square)
        const s = 50, w1 = 1.7 * s, rest = ' 奖牌得主', x0 = x - (w1 + textWidth(rest, s)) / 2, yy = y + 140;
        DL.save(); DL.translate(x, yy); DL.scale(lerp(0.6, 1, EASE.back(c2))); DL.translate(-x, -yy);
        text(k + '.c1a', 'IMO', x0, yy + 2, { size: s * 1.1, font: CFG.FONT_MIX, anchor: 'start', color: C.red, z: Z.annot, opacity: c2, halo: 8 });
        text(k + '.c1b', rest, x0 + w1, yy, { size: s, anchor: 'start', color: C.red, z: Z.annot, opacity: c2, halo: 8 });
        DL.restore();
      }
    },
    cues: () => [[ZJ, 'pop'], [YOUNG, 'whoosh'], [YOUNG + 0.15, 'stamp'], [CAP2, 'pop']],
  };

  /* ---------------- 19 = 17 + 2：成绩单自己的红括号写 17 和 2；下面每道题一列 7 格（1 格 = 1 分），第一天满满、第二天空空（铅笔灰） ---------------- */
  const CW = 72, CH = 30, CG = 5, CBOT = 628;                   // below the sheet's own braces (y ≈ 248–342)
  const cellY = j => CBOT - CH / 2 - j * (CH + CG);
  const FILLS = (() => {      // when each scored cell fills in: day 1 one column after another, bottom-up; day 2 the two single points
    const f = [];
    let n = 0;
    [0, 1, 2].forEach(i => { for (let j = 0; j < E4.SCORES[i]; j++) f.push({ i, j, t: FILL1 + (n++) * FILL_DT }); });
    let m = 0;
    [3, 4, 5].forEach(i => { for (let j = 0; j < E4.SCORES[i]; j++) f.push({ i, j, t: FILL2[m++] }); });
    return f;
  })();
  if (FILLS.length !== 19 || FILLS.filter(f => f.i < 3).length !== 17) console.error('b4b: the columns must hold 17 + 2 points');
  // "19" inside "= 19" (same layout as e4_scores: it writes the total at the right of box 6, size cell × 0.62)
  const TOT_L = layoutWriting({ text: '= 19', x: 0, y: 0, size: C0 * 0.62, t0: 0, speed: 1, track: 0.1 });
  COMP.b4_cols = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const z = Z.set + 2, k = 'b4b.col';
      // red underline under the 19
      const s5 = F.targets[SC + '.s5'];
      if (s5 && t >= UL19) {
        const x0 = s5[0] + C0 / 2 + 34, b1 = TOT_L.boxes[2], b2 = TOT_L.boxes[3], y = SH.at[1] - C0 * 0.31 + C0 * 0.62 + 14;
        stroke(k + '.ul', [[x0 + b1.x - 6, y], [x0 + b2.x + b2.w + 8, y - 3]], { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp((t - UL19) / 0.25)) });
      }
      if (t < COLS) return;
      for (let i = 0; i < 6; i++) {
        const c = F.targets[SC + '.s' + i]; if (!c) continue;
        for (let j = 0; j < 7; j++) {
          const a = clamp((t - COLS - (i * 7 + j) * 0.008) / 0.15); if (a <= 0) continue;
          const y = cellY(j), x0 = c[0] - CW / 2, f = FILLS.find(q => q.i === i && q.j === j), full = f && t >= f.t;
          const pk = full ? 1 + 0.12 * Math.max(0, Math.sin(Math.PI * clamp((t - f.t) / 0.2))) : 1;
          DL.save(); DL.translate(c[0], y); DL.scale(a * pk); DL.translate(-c[0], -y);
          stroke(k + i + '.' + j, [[x0, y - CH / 2], [x0 + CW, y - CH / 2, 1], [x0 + CW, y + CH / 2, 1], [x0, y + CH / 2, 1], [x0, y - CH / 2, 1]],
            { z: z + (full ? 0.2 : 0), w: full ? 3.5 : 2.4, color: full ? C.ink : C.pencil, fill: full ? C.ink : C.paper, boil: 0.5 });
          DL.restore();
        }
      }
    },
    cues: () => [[UL19, 'pen'], [COLS, 'paper'], ...FILLS.filter((f, n) => n % 2 === 0 || f.i >= 3).map(f => [f.t, 'tap'])],
  };

  /* ---------------- cast & poses ---------------- */
  // the fourth teammate: a big sister with a ponytail (same build as E4.mate1–3)
  const MATE4 = { H: 398, head: 0.36, torso: 0.25, leg: 0.33, arm: 0.36, hair: 'ponytail', blink: [4.0, 0.5] };
  const MATES = [['mate1', 300], ['mate2', 545], ['mate3', 1055], ['mate4', 1300]];
  const TX = 800;
  POSE.b4_cheer = { armScale: 1.2, armL: [100, 62], armR: [100, 62] };   // a "yay!" with elbows out: hands beside the head, below the bunting
  const mateTracks = (id, x, i) => {
    const tc = COUNT[i + 1], side = x < TX ? -1 : 1;
    return {
      enter: MATES_IN + i * 0.12,
      pos: [[0, [x, STAGE]], [CUT2, [x + side * 900, STAGE], 0.3, 'in']],
      pose: [[0, 'stand'], [tc, 'b4_cheer', 0.1, 'back'], [CUT2, { lean: side * 14, tilt: side * 6, armL: [40, 30], armR: [40, 30] }, 0.08]],   // zip off stage, leaning into it
      face: [[0, 'smile'], [tc, 'joy', 0.05]],
      turn: [[0, -side * 0.3]],
      gaze: [[0, 'terry'], [tc + 0.4, 'viewer']],
      squash: [[0, 1], [tc, 1.07, 0.05], [tc + 0.06, 1, 0.22, 'back']],
    };
  };

  defineScene({
    id: 'bronze', chapter: '铜牌', dur: DUR, floor: FL,
    cast: { terry: { ...E4.terry, floor: STAGE }, mate1: { ...E4.mate1, floor: STAGE }, mate2: { ...E4.mate2, floor: STAGE }, mate3: { ...E4.mate3, floor: STAGE }, mate4: { ...MATE4, floor: STAGE } },
    order: ['mate1', 'mate2', 'mate3', 'mate4', 'terry'],
    tracks: {
      terry: {
        enter: T_IN,
        pos: [[0, [TX, STAGE]], [CUT3, [-600, STAGE], 0]],
        pose: [[0, 'stand'], [MEDAL, 'kidCheer', 0.1, 'back'], [14.2, 'stand', 0.15], [COUNT[4], 'kidCheer', 0.1, 'back'], [CUT2, 'akimbo', 0.15, 'back']],
        face: [[0, 'smile'], [MEDAL, 'joy', 0.05], [CUT2, 'proud', 0.06], [YOUNG, 'proudGrin', 0.05]],
        turn: [[0, 0], [CUT2, 0.3, 0.15], [YOUNG + 1.2, 0, 0.15]],
        gaze: [[0, 'viewer'], [MEDAL + 0.1, 'medal'], [MEDAL + 1.0, 'viewer'], [YOUNG, 'young'], [YOUNG + 1.2, 'viewer']],
        squash: [[0, 1], [MEDAL, 0.9, 0.05], [MEDAL + 0.06, 1.06, 0.08], [MEDAL + 0.14, 1, 0.22, 'back'], [COUNT[4], 1.06, 0.05], [COUNT[4] + 0.06, 1, 0.22, 'back']],
      },
      ...Object.fromEntries(MATES.map(([id, x], i) => [id, mateTracks(id, x, i)])),
    },
    targets: F => ({ medal: F.targets['b4b.mT.c'] || [TX, STAGE - 90], young: [1170, 470] }),
    set: [{ type: 'floor' }, { type: 'b4_stage', t0: T_IN - 0.05, t1: CUT3 }],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2, pulse: [PULSE] },
      // 7 + 7 + 3 + 1 + 0 + 1 = 19
      { type: 'e4_scores', id: SC, at: AT, cell: C0, t0: -1, scores: E4.SCORES.map(v => [v, -5]), total: [19, TOTAL],
        braces: [{ from: 0, to: 2, label: '17', t0: BR17 }, { from: 3, to: 5, label: '2', t0: BR2 }] },
      { type: 'b4_sweep', id: 'b4b.sweep', t0: SWEEP, t1: RULER - 0.1 },
      // the medal lines
      { type: 'b4_ruler', id: 'b4b.ruler', t0: RULER, t1: R_END },
      { type: 'band', id: 'b4b.hiBronze', rect: [RX + 134, Yv(17) - 34, 160, 68], t0: BAND, t1: R_END, dur: 0.35 },
      { type: 'label', id: 'b4b.lbOk', text: '够上了！', at: [470, 430], rot: -6, size: 60, t0: LAND, t1: R_END, target: [RX - 104, Yv(19) - 38], bend: 0.25, gap: 14 },
      // the ceremony
      { type: 'b4_bunting', id: 'b4b.bunt', t0: T_IN, t1: CUT2 },
      { type: 'b4_confetti', id: 'b4b.conf', bursts: [MEDAL + 0.05, COUNT[4] + 0.05] },
      { type: 'label', id: 'b4b.lbMedal', text: '铜牌', at: [1030, 560], rot: 4, size: 52, t0: MEDAL + 0.45, t1: MATES_IN, target: { char: 'terry', part: 'hip', dx: 34, dy: -18 }, bend: -0.2, gap: 16 },
      // the medals: Terry's first, then the four teammates', counted 1–5
      { type: 'e4_medal', id: 'b4b.mT', char: 'terry', r: 30, drop: 44, t0: MEDAL, t1: CUT3, shine: [MEDAL + 0.35, YOUNG + 0.2] },
      ...MATES.map(([id], i) => ({ type: 'e4_medal', id: 'b4b.m' + (i + 1), char: id, r: 36, drop: 60, t0: COUNT[i + 1], t1: CUT2 + 0.4 })),
      { type: 'b4_count', id: 'b4b.count', t1: CUT2 },
      // the youngest ever
      { type: 'b4_young', id: 'b4b.young', at: [1170, 470], t0: ZJ, t1: CUT3 },
      // 19 = 17 + 2
      { type: 'b4_cols', id: 'b4b.cols', t0: UL19 },
      { type: 'label', id: 'b4b.lbEmpty', text: '几乎空白', at: [1310, 500], rot: 4, size: 52, t0: EMPTY, t1: DUR + 1, target: [1094, 480], bend: -0.15, gap: 10 },
    ],
    sfx: [[T_IN, 'pop'], [MATES_IN, 'pop'], [CUT2, 'whoosh']],
    subs: [
      { t0: 0.3, t1: 3.3, text: '两天加起来：19分。', say: '两天加起来：十九分。' },
      { t0: 3.8, t1: 7.6, text: '那一年，铜牌的线是17分——', say: '那一年，铜牌的线是十七分——' },
      { t0: 7.9, t1: 9.9, text: '他够上了！' },
      { t0: 10.6, t1: 14.4, text: '十岁的小陶，拿到了一块铜牌。' },
      { t0: 14.5, t1: 18.3, text: '澳大利亚队一共拿了五块铜牌。' },
      { t0: 19.0, t1: 23.8, text: '至今，他仍是最年轻的IMO奖牌得主。', say: '至今，他仍是最年轻的国际奥数奖牌得主。' },
      { t0: 24.7, t1: 28.9, text: '19分里，有17分是第一天拿的。', say: '十九分里，有十七分是第一天拿的。' },
      { t0: 29.0, t1: 32.0, text: '第二天，几乎是空白。' },
    ],
  });
})();
