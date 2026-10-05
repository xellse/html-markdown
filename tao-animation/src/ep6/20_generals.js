// 第 6 集 · 资格口试（1994 年初的冬天，18 岁）
// 事实（ep6-script.md：A Close Call / PAW 2019）：三位教授当面考了两个小时；开头讲他准备好的调和分析（T(b) 定理）还不错；
//   一离开这块就露馅——结论只记得个大概：说不准、证不对、说不出有什么用；考官们越问越简单，想让他至少答对一题；
//   一位考官（不点名）记错了他选的科目，准备的题用不上，只问了标准题，他答上了；关门商量了很久，勉强通过。
//   他后来说：“I was very lucky. I was really close.”
// 演绎：黑板角上只是“T(b)”一类的记号；思考云里的式子是示意（虚线、缺了几块）；楼梯上的四张题卡是“越问越简单”的比喻，
//   不是真题（最后一张只写“2>1?”）；墙上的钟只示意“两个小时”“很久”，几点开考没有记录。
//   那天他心里具体想了什么没有记录：小陶只用表情（puzzled / sheepish / 松一口气）。
// 开场 = 上一场结尾（只剩停靠的 18 岁印章，pulse 一下）；结尾全部清掉，只剩停靠的 18 岁印章（第 25 场接着用）。
(() => {
  const FL = 770, DUR = 62.6;
  /* ---------------- 布景 ---------------- */
  const WIN = { x0: 1060, y0: 90, x1: 1300, y1: 270 };          // window (snow outside)
  const CLK = { c: [930, 190], r: 58 };
  const BOARD = { x0: 70, y0: 150, x1: 790, y1: 560 };
  const TAB = { x0: 975, x1: 1555, top: 585, low: 745 };       // the examiners' long table (front panel hides their legs)
  const PX = { exam3: 1095, stein: 1275, exam2: 1455 }, PHIP = 650;
  const CHAIR = { x: 880, seat: 655 }, BENCH = { x: 420, seat: 655 };
  const DOOR = { x0: 950, x1: 1580, top: 300 };
  const TX = 500, BX = 545;                                    // Terry at the board; left edge of his notes

  /* ---------------- 时间（场景内） ---------------- */
  // A. 考场（L1–L2）
  const WIN0 = 0.3, DATE0 = 0.5, DATE1 = 4.45, PULSE = 3.25;
  const TAB0 = 4.4, P_IN = { exam3: 4.55, stein: 4.7, exam2: 4.85 }, CLK0 = 4.6, CHAIR0 = 4.5;
  const SPIN1 = [5.7, 7.5], ARC1 = 8.1;
  // B. 黑板（L3–L4）
  const BOARD0 = 8.3, CPS = 10;
  const WL = [{ s: 'T(b) 定理', y: 410, t0: 9.55 }, { s: 'Tb, T*b', y: 458, t0: 10.35 }, { s: '|Tf| < C|f|', y: 506, t0: 11.15 }];
  const RING0 = 12.1, PREP1 = 13.45;
  const PT0 = 13.7, Q0 = 13.95, STOP = 14.3, LEAK0 = 16.2, L4_OUT = 17.7;
  // C. 只记得个大概（L5–L7）
  const CLOUD0 = 18.15, ASK = [21.9, 23.15, 24.6], XS = [22.55, 23.8, 26.0], SHRUG = 26.2, C_OUT = 28.8;
  // D. 越问越简单（L8–L9）
  const LEAP = 28.9, LAND = LEAP + 0.5, STAIR0 = 28.95, CARD_W = [29.45, 30.45, 31.85, 33.25], HOPS = [30.9, 32.3, 33.7], OFF = 36.15, ST_OUT = 36.6;
  // E. 运气（L10–L12）
  const LUCK0 = 37.0, LUCK1 = 41.5, STACK0 = 40.05, EX_PUZ = 40.8, EX_SCR = 41.7, MIS0 = 42.1, ASIDE = 43.5, BASIC0 = 45.15, TICKS = [45.9, 46.7, 47.5], E_OUT = 48.9;
  // F. 关门商量（L13–L14）；L14 起整体后移 0.8 秒，让“等了很久”停一停
  const WALK4 = [49.35, 50.1], SIT2 = 50.12, BENCH0 = 49.3, WIN1 = 49.4, DOOR0 = 49.4, CLOSE = [49.8, 50.2], SIGN0 = 50.4;
  const SPIN2 = [50.7, 53.7], TAP = [50.6, 53.9], SIGN1 = 54.0, OPEN = [54.0, 54.35], NOD = 54.5, PASS0 = 54.8;
  // G. 松一口气（L15）与收场
  const UP2 = 56.9, WIPE = 57.25, PUFF = 57.7, SAID0 = 57.3, NOTE1 = 61.45, CLOSE2 = [61.55, 61.85], WALK5 = [61.55, 62.35], OUT = 62.25;

  /* ---------------- helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const inP = (t, t0, d = 0.35) => EASE.out(clamp((t - t0) / d));
  const outP = (t, t1, d = 0.3) => 1 - clamp((t - (t1 - d)) / d);         // 1 → 0, gone at t1
  /** draw fn() and multiply the opacity of everything it drew by op (an exit fade for any group of shapes) */
  const faded = (op, fn) => {
    if (op <= 0.003) return;
    const n0 = DL.items.length; fn();
    if (op < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * op).toFixed(3); }
  };
  const hop = (t0, d, a, b, h) => t => { const u = clamp((t - t0) / d); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)]; };
  /** dashed copy of a polyline (pure: the dash phase is a function of t) */
  const dashed = (key, pts, dash, gap, phase, o) => {
    const L = polyLen(pts); let s = -((phase % (dash + gap)) + dash + gap), i = 0;
    for (; s < L; s += dash + gap, i++) {
      const a = Math.max(0, s), b = Math.min(L, s + dash); if (b - a < 2) continue;
      stroke(key + '.' + i, [pointAt(pts, a / L), pointAt(pts, (a + b) / 2 / L), pointAt(pts, b / L)], o);
    }
  };
  SFX.define('b6_whirr', tone => { tone('triangle', 420, 1300, 0.22, 0.06, [28, 90]); });

  /** fade wrapper around any built-in component: {type:'b6_gFade', out (fade starts), fd, of:{…}} */
  COMP.b6_gFade = {
    init(fx) { const c = COMP[fx.of.type]; if (c.init) c.init(fx.of); return fx; },
    draw(fx, t, F) { faded(fx.out === undefined ? 1 : 1 - clamp((t - fx.out) / (fx.fd || 0.3)), () => COMP[fx.of.type].draw(fx.of, t, F)); },
    cues: fx => { const c = COMP[fx.of.type]; return c.cues ? c.cues(fx.of) : []; },
  };
  /** red (or ink) note: pops in (or types in with cps), fades out before t1. {text, x, y, size, t0, t1, color, anchor, rot, ul, cps} */
  COMP.b6_gTxt = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, op = outP(t, fx.t1, 0.25) * clamp(lt / 0.08), size = fx.size || 40;
      const s = fx.cps ? [...fx.text].slice(0, Math.floor(lt * fx.cps) + 1).join('') : fx.text;
      const sc = fx.cps ? 1 : lerp(0.5, 1, EASE.back(clamp(lt / 0.22)));
      text(fx.id, s, fx.x, fx.y, { size, color: fx.color === 'ink' ? C.ink : C.red, z: fx.z ?? Z.annot, anchor: fx.anchor, rot: fx.rot || 0, scale: sc, opacity: op, halo: 8 });
      if (fx.ul) {
        const w = textWidth(fx.text, size) / 2, y = fx.y + size * 0.62;
        stroke(fx.id + '.u', [[fx.x - w, y + 4], [fx.x - w * 0.3, y - 2], [fx.x + w * 0.4, y + 3], [fx.x + w, y - 4]], { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp((lt - 0.25) / 0.35)), opacity: op, boil: 1.4 });
      }
    },
    cues: fx => fx.cps ? Array.from({ length: Math.ceil([...fx.text].length / 3) }, (_, i) => [fx.t0 + i * 3 / fx.cps, 'pen']) : [[fx.t0, fx.sfx || 'pop']],
  };

  /* ---------------- 钟：两个小时 / 商量了很久 ---------------- */
  const SPINS = [[SPIN1[0], SPIN1[1], 120], [SPIN2[0], SPIN2[1], 90]];          // minutes the hands travel
  const clkMin = t => SPINS.reduce((m, [a, b, v]) => m + v * EASE.io(clamp((t - a) / (b - a))), 0);
  const clkPt = (a, rr) => [CLK.c[0] + Math.sin(a * RAD) * rr, CLK.c[1] - Math.cos(a * RAD) * rr];
  const H0 = 300;                                                             // hour hand starts at "10" (just a picture)

  /* ---------------- 黑板上的记号：手（粉笔）跟着写 ---------------- */
  const nibAt = t => {
    let L = WL[0]; for (const l of WL) if (t >= l.t0 - 0.12) L = l;
    const u = clamp((t - L.t0) * CPS / [...L.s].length);
    return [BX + textWidth(L.s, 40) * u, L.y + 10 + 3 * Math.sin(t * 31)];
  };

  /* ---------------- 楼梯：四张题卡，一级比一级小、比一级简单（比喻，不是真题） ---------------- */
  const STEPS = [
    { x0: 100, x1: 420, y: 420, f: '37×48+26=?', s: 40 },
    { x0: 420, x1: 645, y: 505, f: '48×26=?', s: 38 },
    { x0: 645, x1: 810, y: 590, f: '9+8=?', s: 36 },
    { x0: 810, x1: 940, y: 675, f: '2>1?', s: 36 },
  ];
  STEPS.forEach((st, i) => {
    st.card = [st.x0 + 10, st.y + 10, st.x1 - 10, st.y + 10 + st.s + 26];
    st.w = layoutWriting({ text: st.f, x: (st.x0 + st.x1) / 2, y: st.y + 23, size: st.s, t0: CARD_W[i], speed: 3200, anchor: 'middle' });
    if (st.w.width > st.card[2] - st.card[0] - 16) console.error('b6g: card ' + i + ' formula does not fit');
  });
  const STAND = [[300, 420], [540, 505], [735, 590], [880, 675]];             // where Terry stands on each step

  /* ---------------- 记错科目的那叠题卡，和“基础题” ---------------- */
  const HOLD = [870, 365], DESKSPOT = [1012, 566];
  const stackAt = t => {                                                       // {c:[x,y], k:scale, rot}
    if (t < ASIDE) { const u = EASE.out(clamp((t - STACK0) / 0.3)); return { c: lerp2(DESKSPOT, HOLD, u), k: lerp(0.45, 1, u), rot: lerp(-4, 2, u) }; }
    const u = EASE.io(clamp((t - ASIDE) / 0.45)); return { c: lerp2(HOLD, DESKSPOT, u), k: lerp(1, 0.45, u), rot: lerp(2, -4, u) };
  };
  const SW = 220, SH = 116, BW = 170, BH = 84, HOLD2 = [880, 380];
  const handOnStack = t => { const s = stackAt(t); return [s.c[0] + (SW / 2 - 12) * s.k, s.c[1] + 16 * s.k]; };
  const handOnBasic = () => [HOLD2[0] + BW / 2 - 12, HOLD2[1] + 14];

  /* ---------------- poses / faces ---------------- */
  const hipT = (dx, dy) => ({ w: 1, to: 'hip', dx, dy, bend: 'out' });
  Object.assign(POSE, {
    b6_gSit: { sit: 1, legScale: 1.12, thigh: 0.24, legL: [66, -60], legR: [66, -60], ikL: hipT(-30, 16), ikR: hipT(30, 16) },
    b6_gProf: { sit: 1, legScale: 0.85, thigh: 0.25, legL: [62, -57], legR: [62, -57], ikL: { w: 1, to: 'desk', dx: -44, dy: -2, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: 40, dy: -2, bend: 'down' } },
    b6_gPresent: { armScale: 1.25, armR: [96, -6], armL: [16, 10], lean: -2, tilt: -4 },
    b6_gStuck: { armScale: 1.3, armR: [74, 46], armL: [14, 8], lean: 2, tilt: 5 },
    b6_gShrug: { armL: [30, 62], armR: [30, 62], tilt: 7 },
    b6_gHop: { legL: [22, -46], legR: [10, -30], armL: [64, 24], armR: [64, 24], lean: 3 },
    b6_gAnswer: { armScale: 1.3, armR: [128, 18], armL: [16, 10], lean: -2, tilt: -5 },
    b6_gEase: { armL: [8, 4], armR: [8, 4], lean: 2, tilt: 4 },
  });
  Object.assign(POSE, {
    b6_gPoint: { ...POSE.b6_gProf, lean: -4, armScale: 1.1, armL: [118, 12], ikL: { w: 0 } },
    b6_gBeckon: t => ({ ...POSE.b6_gProf, lean: -5, armScale: 1.1, armL: [62, 64 + 34 * Math.max(0, Math.sin(t * 7))], ikL: { w: 0 } }),
    b6_gHold: t => { const h = handOnStack(t); return { ...POSE.b6_gProf, lean: -7, armScale: 1.45, ikL: { w: 1, to: 'abs', dx: h[0], dy: h[1], bend: 'down' } }; },
    b6_gHoldB: () => { const h = handOnBasic(); return { ...POSE.b6_gProf, lean: -7, armScale: 1.45, ikL: { w: 1, to: 'abs', dx: h[0], dy: h[1], bend: 'down' } }; },
    b6_gTap: t => ({ ...POSE.b6_gSit, legR: [66, -60 + 16 * Math.max(0, Math.sin(t * 11))] }),
    b6_gWrite: t => { const p = nibAt(t); return { lean: 2, tilt: 3, armScale: 1.6, armL: [14, 8], ikR: { w: 1, to: 'abs', dx: p[0], dy: p[1], bend: 'down' } }; },
  });
  POSE.b6_gScratch = t => ({ ...POSE.b6_gHold(t), tilt: 9, ikR: { w: 1, to: 'head', dx: 0.95, dy: -0.85, bend: 'out' } });
  Object.assign(FACE, {
    b6_gRelief: { eyes: 'happy', mouth: 'smile', mw: 0.3, brow: 'line', browL: -12, browR: -12, browY: 0.02 },
    b6_gPhew: { lidL: 0.72, lidR: 0.72, brow: 'line', browL: -14, browR: -14, mouth: 'o' },
    b6_gKind: { mouth: 'smile', mw: 0.26, lidL: 0.14, lidR: 0.14 },
  });
  /** a professor's pose track + nods (tilt bumps; negative = forward for someone facing left) */
  const profPose = (keys, nods) => [[0, t => {
    const p = evalTrack(keys, t, POSE, DEF_POSE);
    let b = 0; nods.forEach(([t0, n]) => { const u = (t - t0) / 0.42; if (u > 0 && u < n) b += Math.sin(Math.PI * (u % 1)); });
    return b ? { ...p, tilt: (p.tilt || 0) - 8 * b } : p;
  }]];

  /* ---------------- 房间：窗、钟、长桌、椅子、黑板、长椅、门 ---------------- */
  COMP.b6_gRoom = {
    draw(fx, t, F) {
      const k = 'b6g', z = Z.set;
      // window with falling snow
      faded(t < WIN0 ? 0 : outP(t, WIN1 + 0.3), () => {
        const { x0, y0, x1, y1 } = WIN, p = inP(t, WIN0, 0.4), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        stroke(k + '.win', box(x0, y0, x1, y1), { z, w: 5, fill: C.paper, draw: p });
        stroke(k + '.winV', [[mx, y0 + 4], [mx + 1, y1 - 4]], { z: z + 0.3, w: 3.5, draw: stag(p, 1, 3) });
        stroke(k + '.winH', [[x0 + 4, my], [x1 - 4, my - 1]], { z: z + 0.3, w: 3.5, draw: stag(p, 1, 3) });
        stroke(k + '.sill', [[x0 - 18, y1 + 9], [x1 + 18, y1 + 8]], { z, w: 5, draw: stag(p, 2, 3) });
        stroke(k + '.drift', [[x0 + 6, y1 - 12], [x0 + 46, y1 - 22], [x0 + 96, y1 - 14], [x0 + 150, y1 - 25], [x0 + 196, y1 - 13], [x1 - 6, y1 - 20]], { z: z + 0.2, w: 2.6, draw: stag(p, 2, 3) });
        if (p < 0.95) return;
        for (let i = 0; i < 14; i++) {
          const sp = 30 + (i * 17) % 23, H = y1 - y0 - 34, yy = y0 + 10 + ((i * 41 + (t - WIN0) * sp) % H);
          const xx = x0 + 18 + (i * 83) % (x1 - x0 - 36) + 7 * Math.sin(t * 1.4 + i * 1.7), r = 4.5 + (i % 3);
          const op = clamp((y1 - 22 - yy) / 18) * clamp((yy - y0 - 6) / 10);
          [0, 60, 120].forEach((a, j) => { const ang = (a + i * 23) * RAD; stroke(`${k}.sn${i}.${j}`, [[xx - Math.cos(ang) * r, yy - Math.sin(ang) * r], [xx + Math.cos(ang) * r, yy + Math.sin(ang) * r]], { z: z + 0.2, w: 2, opacity: op, boil: 0.3 }); });
        }
      });
      // wall clock (+ the red "2 小时" arc on the hour hand's path)
      faded(t < CLK0 ? 0 : outP(t, OUT), () => {
        const { c, r } = CLK, zc = z + 1, p = inP(t, CLK0, 0.35), m = clkMin(t);
        stroke(k + '.clkN', [[c[0] - 20, c[1] - r - 2], [c[0], c[1] - r - 24, 1], [c[0] + 20, c[1] - r - 2]], { z: zc, w: 2.2, color: C.pencil, draw: p });
        stroke(k + '.clkO', ringPts(k + '.clkO', c[0], c[1], r, r, { n: 14, a0: -110, sweep: 374, rv: 0.02 }), { z: zc, w: 5.5, fill: C.paper, draw: p });
        if (p < 0.6) return;
        for (let i = 0; i < 12; i++) { const big = i % 3 === 0; stroke(k + '.clkT' + i, [clkPt(i * 30, r * (big ? 0.64 : 0.72)), clkPt(i * 30, r * 0.84)], { z: zc + 0.1, w: big ? 4 : 2.4 }); }
        SPINS.forEach(([a, b], j) => {                                         // pencil blur behind the whirling minute hand
          const u = (t - a) / (b - a); if (u <= 0 || u >= 1) return;
          const a1 = m * 6;
          [0.46, 0.58].forEach((rr, q) => stroke(k + '.clkB' + j + q, [0, 1, 2, 3, 4, 5].map(i => clkPt(a1 - 80 + i * 14, r * rr)), { z: zc + 0.15, w: 2.4, color: C.pencil, opacity: Math.sin(Math.PI * u), boil: 0.6 }));
        });
        stroke(k + '.clkH', [c, clkPt(H0 + m * 0.5, r * 0.42)], { z: zc + 0.2, w: 6 });
        stroke(k + '.clkM', [c, clkPt(m * 6, r * 0.66)], { z: zc + 0.2, w: 4.2 });
        dot(k + '.clkD', c, 4.5, C.ink, zc + 0.3);
      });
      faded(t < SPIN1[0] ? 0 : outP(t, ARC1), () => {
        const u = EASE.io(clamp((t - SPIN1[0]) / (SPIN1[1] - SPIN1[0]))), R = CLK.r + 18;
        if (u > 0.02) {
          const pts = []; for (let i = 0; i <= 8; i++) pts.push(clkPt(H0 + 60 * u * i / 8, R));
          stroke(k + '.arc', pts, { z: Z.annot, w: 5, color: C.red });
          if (u > 0.9) { const e = clkPt(H0 + 60, R); stroke(k + '.arcH', [[e[0] - 14, e[1] - 10], [e[0], e[1], 1], [e[0] - 13, e[1] + 11]], { z: Z.annot, w: 5, color: C.red }); }
        }
      });
      // the examiners' long table
      faded(t < TAB0 ? 0 : outP(t, OUT), () => {
        const { x0, x1, top, low } = TAB, p = inP(t, TAB0, 0.4), zt = Z.desk;
        stroke(k + '.tab', superPts((x0 + x1) / 2, top + 9, x1 - x0, 20, 18, 7), { z: zt, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
        stroke(k + '.tabP', box(x0 + 14, top + 19, x1 - 14, low), { z: zt, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
        stroke(k + '.tabL', [[x0 + 26, low], [x0 + 24, FL]], { z: zt, w: 5, draw: stag(p, 2, 3) });
        stroke(k + '.tabR', [[x1 - 26, low], [x1 - 24, FL]], { z: zt, w: 5, draw: stag(p, 2, 3) });
        if (p > 0.8) shadow(k + '.tabS', (x0 + x1) / 2, FL + 4, x1 - x0 + 30, 1);
      });
      // Terry's chair (side view: he faces right, the back is on his left)
      faded(t < CHAIR0 ? 0 : outP(t, 28.9), () => {
        const { x, seat } = CHAIR, p = inP(t, CHAIR0, 0.35), zc = Z.chair;
        stroke(k + '.chS', superPts(x, seat + 8, 96, 14, 14, 6), { z: zc, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
        stroke(k + '.chB', [[x - 44, seat + 4], [x - 50, seat - 112]], { z: zc, w: 5, draw: stag(p, 1, 3) });
        stroke(k + '.chB2', superPts(x - 49, seat - 88, 14, 50, 12, 6), { z: zc, w: 4.5, closed: true, fill: C.paper, draw: stag(p, 1, 3) });
        stroke(k + '.chL1', [[x - 40, seat + 14], [x - 44, FL]], { z: zc, w: 5, draw: stag(p, 2, 3) });
        stroke(k + '.chL2', [[x + 40, seat + 14], [x + 44, FL]], { z: zc, w: 5, draw: stag(p, 2, 3) });
      });
      // blackboard + his prepared corner of notation
      faded(t < BOARD0 ? 0 : outP(t, 28.9), () => {
        const { x0, y0, x1, y1 } = BOARD, p = inP(t, BOARD0, 0.4);
        stroke(k + '.bdO', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0 - 2]], { z, w: 6, draw: stag(p, 0, 3) });
        stroke(k + '.bdI', [[x0 + 14, y0 + 14], [x1 - 14, y0 + 14, 1], [x1 - 14, y1 - 14, 1], [x0 + 14, y1 - 14, 1], [x0 + 14, y0 + 12]], { z, w: 3.5, draw: stag(p, 1, 3) });
        stroke(k + '.bdT', [[x0 + 30, y1 + 12], [x1 - 30, y1 + 12]], { z, w: 5, draw: stag(p, 2, 3) });
        WL.forEach((L, i) => {
          if (t < L.t0) return;
          const n = Math.min([...L.s].length, Math.floor((t - L.t0) * CPS) + 1);
          text(k + '.wl' + i, [...L.s].slice(0, n).join(''), BX, L.y, { size: 40, anchor: 'start', z: Z.board });
        });
      });
      // corridor bench
      faded(t < BENCH0 ? 0 : outP(t, OUT), () => {
        const { x, seat } = BENCH, p = inP(t, BENCH0, 0.35), zc = Z.chair;
        stroke(k + '.bnS', superPts(x, seat + 8, 210, 16, 16, 6), { z: zc, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 2) });
        stroke(k + '.bnL1', [[x - 88, seat + 16], [x - 92, FL]], { z: zc, w: 5, draw: stag(p, 1, 2) });
        stroke(k + '.bnL2', [[x + 88, seat + 16], [x + 92, FL]], { z: zc, w: 5, draw: stag(p, 1, 2) });
        if (p > 0.8) shadow(k + '.bnSh', x, FL + 4, 230, 1);
      });
      // the door the examiners close: frame, two leaves that swing, a hanging sign
      faded(t < DOOR0 ? 0 : outP(t, OUT), () => {
        const { x0, x1, top } = DOOR, p = inP(t, DOOR0, 0.4), zd = Z.fx + 2;
        stroke(k + '.drF', [[x0, FL], [x0, top, 1], [x1, top, 1], [x1, FL]], { z: zd + 0.5, w: 6, draw: p });
        stroke(k + '.drF2', [[x0 - 16, FL], [x0 - 16, top - 16, 1], [x1 + 16, top - 16, 1], [x1 + 16, FL]], { z: zd + 0.5, w: 3, draw: stag(p, 1, 2) });
        if (t < CLOSE[0]) return;
        const W = (x1 - x0) / 2, o = doorOpen(t), vw = W * (0.13 + 0.87 * (1 - o)), sk = 16 * o;
        [[x0, 1], [x1, -1]].forEach(([hx, s], i) => {
          const fx2 = hx + s * vw, kk = k + '.leaf' + i;
          stroke(kk, [[hx, top], [fx2, top - sk, 1], [fx2, FL + sk * 0.4, 1], [hx, FL, 1], [hx, top, 1]], { z: zd, w: 5, fill: C.paper });
          const ix = u => hx + s * vw * u;
          stroke(kk + '.p1', box(Math.min(ix(0.18), ix(0.82)), top + 40, Math.max(ix(0.18), ix(0.82)), 500), { z: zd + 0.1, w: 2.6, color: C.pencil });
          stroke(kk + '.p2', box(Math.min(ix(0.18), ix(0.82)), 560, Math.max(ix(0.18), ix(0.82)), FL - 40), { z: zd + 0.1, w: 2.6, color: C.pencil });
          if (vw > 60) stroke(kk + '.kn', ringPts(kk + '.kn', ix(0.9), 530, 9, 9, { n: 8, closed: true }), { z: zd + 0.2, w: 3.5, closed: true, fill: C.paper });
        });
      });
      // "商量中……" sign, swinging from a nail on the shut doors
      faded(t < SIGN0 ? 0 : outP(t, SIGN1, 0.25), () => {
        const lt = t - SIGN0, nail = [(DOOR.x0 + DOOR.x1) / 2, DOOR.top + 22], zs = Z.fx + 3;
        const rot = 9 * Math.exp(-3 * lt) * Math.sin(lt * 11) + 2, drop = 40 * (1 - EASE.back(clamp(lt / 0.3)));
        DL.save(); DL.translate(nail[0], nail[1] - drop); DL.rotate(rot);
        stroke(k + '.sgS', [[-96, 70], [0, 0, 1], [96, 70]], { z: zs, w: 2.6 });
        stroke(k + '.sgB', box(-128, 70, 128, 152), { z: zs, w: 4.5, fill: C.paper });
        text(k + '.sgT', '商量中……', 0, 112, { size: 42, z: zs + 0.1 });
        DL.restore();
        dot(k + '.sgN', nail, 5, C.ink, zs + 0.2);
      });
    },
    cues: () => [[WIN0, 'paper'], [TAB0, 'paper'], [CLK0, 'pop'], [SPIN1[0], 'b6_whirr'], [SPIN1[0] + 0.9, 'b6_whirr'], [BOARD0, 'paper'],
      ...WL.flatMap(L => [0, 3, 6, 9].filter(i => i < [...L.s].length).map(i => [L.t0 + i / CPS, 'chalk'])),
      [BENCH0, 'paper'], [DOOR0, 'paper'], [CLOSE[1] - 0.04, 'thud'], [SIGN0, 'paper'], [SPIN2[0], 'b6_whirr'], [SPIN2[0] + 1.2, 'b6_whirr'], [SPIN2[0] + 2.3, 'b6_whirr'],
      [OPEN[0], 'whoosh'], [CLOSE2[1] - 0.04, 'thud']],
  };
  function doorOpen(t) {                                                       // 1 = wide open, 0 = shut
    if (t < OPEN[0]) return 1 - EASE.io(clamp((t - CLOSE[0]) / (CLOSE[1] - CLOSE[0])));
    if (t < CLOSE2[0]) return EASE.out(clamp((t - OPEN[0]) / (OPEN[1] - OPEN[0])));
    return 1 - EASE.io(clamp((t - CLOSE2[0]) / (CLOSE2[1] - CLOSE2[0])));
  }

  /** chalk in Terry's hand while he writes his corner */
  COMP.b6_gChalk = {
    draw(fx, t, F) {
      if (t < WL[0].t0 - 0.2 || t >= 12.4) return;
      const a = F.anchors.terry; if (!a) return;
      const h = a.handR;
      stroke('b6g.chalk', [[h[0] - 4, h[1] + 6], [h[0] + 12, h[1] - 10]], { z: Z.front + 1, w: 9 });
      stroke('b6g.chalk2', [[h[0] - 1, h[1] + 3], [h[0] + 9, h[1] - 7]], { z: Z.front + 1.1, w: 3.5, color: C.paper, boil: 0 });
    },
  };
  /** the examiner's question points past the prepared corner, into the big empty part of the board */
  COMP.b6_gPointer = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors.exam3; if (!a) return;
      const h = a.handL, to = fx.to, op = outP(t, fx.t1);
      faded(op, () => arrow('b6g.ptr', [h[0] - 16, h[1] - 8], to, { p: EASE.out(clamp((t - fx.t0) / 0.3)), bend: 0.16, color: C.ink, w: 4, head: 22, z: Z.fx }));
    },
    cues: fx => [[fx.t0, 'swish']],
  };
  /** the result he only half remembers: dashed, pieces missing, flickering */
  const FUZ = layoutWriting({ text: '(x+1)(x-1)=x×x-1', x: 320, y: 200, size: 40, t0: 0, speed: 1, anchor: 'middle' });
  const MISSING = new Set([2, 11, 15]);
  COMP.b6_gFuzzy = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const op = clamp((t - fx.t0) / 0.4) * outP(t, fx.t1);
      FUZ.strokes.forEach((s, i) => {
        if (MISSING.has(s.gi)) return;
        const flick = 0.45 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2.6 + s.gi * 1.9));
        dashed('b6g.fz' + i, s.pts, 7, 7, t * 9 + s.gi * 3, { z: Z.fx + 0.5, w: 4, opacity: op * flick, boil: 1.6 });
      });
      // a pencil "?" where the missing pieces were
      [...MISSING].forEach((gi, j) => { const b = FUZ.boxes[gi]; if (b) text('b6g.fzq' + j, '?', b.x + b.w / 2, b.y + b.h * 0.6, { size: 36, color: C.pencil, z: Z.fx + 0.5, opacity: op * 0.9, font: CFG.FONT_MIX }); });
    },
  };
  /** the three things he could not do, one card above each examiner; each gets a red ✗ */
  const ASKS = [{ s: '说准？', x: PX.exam3, who: 'exam3' }, { s: '证对？', x: 1268, who: 'stein' }, { s: '有什么用？', x: 1475, who: 'exam2' }];
  COMP.b6_gAsk = {
    draw(fx, t, F) {
      ASKS.forEach((A, i) => {
        if (t < ASK[i] || t >= C_OUT) return;
        const lt = t - ASK[i], pp = EASE.back(clamp(lt / 0.25)), w = textWidth(A.s, 38) + 36, y = 318, kk = 'b6g.ask' + i;
        faded(outP(t, C_OUT), () => {
          const a = F.anchors[A.who];
          if (a) stroke(kk + '.tl', [[A.x - 6 + (a.headTop[0] - A.x) * 0.3, y + 34], [a.headTop[0] - 4, a.headTop[1] - 24]], { z: Z.annot - 1, w: 3.5, draw: clamp(lt / 0.2) });
          DL.save(); DL.about(A.x, y, () => DL.scale(lerp(0.4, 1, pp)));
          stroke(kk, box(A.x - w / 2, y - 32, A.x + w / 2, y + 32), { z: Z.annot - 1, w: 4.5, fill: C.paper });
          text(kk + '.t', A.s, A.x, y + 1, { size: 38, z: Z.annot - 0.9 });
          DL.restore();
          const xp = clamp((t - XS[i]) / 0.18), xq = clamp((t - XS[i] - 0.2) / 0.18), hw = w / 2 - 6;
          if (xp > 0) stroke(kk + '.x1', [[A.x - hw, y - 36], [A.x + hw, y + 36]], { z: Z.annot, w: 7, color: C.red, draw: xp });
          if (xq > 0) stroke(kk + '.x2', [[A.x + hw, y - 36], [A.x - hw, y + 36]], { z: Z.annot, w: 7, color: C.red, draw: xq });
        });
      });
    },
    cues: () => [...ASK.map(a => [a, 'pop']), ...XS.flatMap(x => [[x, 'pen'], [x + 0.2, 'pen']])],
  };
  /** the staircase of ever-easier question cards */
  COMP.b6_gStairs = {
    draw(fx, t) {
      if (t < STAIR0 || t >= ST_OUT) return;
      const p = inP(t, STAIR0, 0.45), k = 'b6g.st', z = Z.set + 1;
      faded(outP(t, ST_OUT), () => {
        const prof = [[STEPS[0].x0, FL]]; STEPS.forEach(s => { prof.push([s.x0, s.y, 1], [s.x1, s.y, 1]); }); prof.push([STEPS[3].x1, FL, 1]);
        stroke(k, prof, { z, w: 5, fill: C.paper, draw: p });
        STEPS.forEach((s, i) => {
          if (i) stroke(k + '.v' + i, [[s.x0, s.y + 4], [s.x0, FL - 2]], { z: z + 0.1, w: 3, color: C.pencil, draw: stag(p, 1, 2) });
          const cp = clamp((t - STAIR0 - 0.3 - i * 0.12) / 0.25); if (cp <= 0) return;
          const [a, b, c, d] = s.card;
          stroke(k + '.c' + i, box(a, b, c, d), { z: z + 0.2, w: 3.5, fill: C.paper, draw: cp });
          s.w.strokes.forEach((g, j) => { const q = clamp((t - g.t0) / g.dur); if (q > 0) stroke(k + '.f' + i + '.' + j, g.pts, { z: z + 0.3, w: 4.5, draw: q < 1 ? q : undefined, boil: 0.5 }); });
        });
      });
    },
    cues: () => [[STAIR0, 'paper'], ...STEPS.map(s => [s.w.strokes[0].t0, 'chalk'])],
  };
  /** red "运气！" with a few sparkle ticks */
  COMP.b6_gLuck = {
    draw(fx, t) {
      if (t < LUCK0 || t >= LUCK1) return;
      const lt = t - LUCK0, op = outP(t, LUCK1, 0.3), pp = EASE.back(clamp(lt / 0.28)), c = [380, 250];
      faded(op, () => {
        text('b6g.luck', '运气！', c[0], c[1], { size: 92, color: C.red, z: Z.annot, rot: -5, scale: lerp(0.4, 1, pp), halo: 10 });
        for (let i = 0; i < 5; i++) {
          const a = (-150 + i * 30) * RAD, u = clamp((lt - 0.2 - i * 0.05) / 0.25), w = 0.6 + 0.4 * Math.sin(t * 6 + i);
          if (u <= 0) continue;
          const r0 = 120, r1 = 120 + 34 * w;
          stroke('b6g.lk' + i, [[c[0] + Math.cos(a) * r0, c[1] + 10 + Math.sin(a) * r0 * 0.75], [c[0] + Math.cos(a) * r1, c[1] + 10 + Math.sin(a) * r1 * 0.75]], { z: Z.annot, w: 4.5, color: C.red, draw: u });
        }
      });
    },
    cues: () => [[LUCK0, 'ding']],
  };
  /** the examiner's own stack of cards (for the wrong subject), then a small "基础题" card */
  COMP.b6_gStack = {
    draw(fx, t) {
      const k = 'b6g.sk';
      if (t >= STACK0 && t < E_OUT) faded(outP(t, E_OUT), () => {
        const s = stackAt(t), z = Z.front + 2;
        DL.save(); DL.translate(s.c[0], s.c[1]); DL.scale(s.k); DL.rotate(s.rot);
        [2, 1].forEach(j => stroke(k + '.b' + j, box(-SW / 2 + 7 * j, -SH / 2 - 7 * j, SW / 2 + 7 * j, SH / 2 - 7 * j), { z: z - 0.1 * j, w: 3.5, fill: C.paper }));
        stroke(k, box(-SW / 2, -SH / 2, SW / 2, SH / 2), { z, w: 4.5, fill: C.paper });
        text(k + '.t', '另一个科目', 0, -SH / 2 + 30, { size: 36, z: z + 0.1 });
        [8, 30].forEach((yy, j) => { const pts = []; for (let i = 0; i <= 10; i++) pts.push([-SW / 2 + 26 + i * 16.8, yy + (i % 2 ? -4 : 3)]); stroke(k + '.l' + j, pts, { z: z + 0.1, w: 2.6, boil: 0.6 }); });
        DL.restore();
      });
      if (t >= BASIC0 && t < E_OUT) faded(outP(t, E_OUT), () => {
        const z = Z.front + 2, pp = EASE.back(clamp((t - BASIC0) / 0.25));
        DL.save(); DL.translate(HOLD2[0], HOLD2[1]); DL.scale(lerp(0.4, 1, pp)); DL.rotate(2);
        stroke(k + '.bc', box(-BW / 2, -BH / 2, BW / 2, BH / 2), { z, w: 4.5, fill: C.paper });
        text(k + '.bt', '基础题', 0, 2, { size: 40, z: z + 0.1 });
        DL.restore();
      });
    },
    cues: () => [[STACK0, 'paper'], [ASIDE, 'swish'], [ASIDE + 0.45, 'tap'], [BASIC0, 'pop']],
  };
  /** sweat drop and a long breath out */
  COMP.b6_gPhew = {
    draw(fx, t, F) {
      const a = F.anchors.terry; if (!a) return;
      const ds = t - (WIPE + 0.2);
      if (ds > 0 && ds < 0.7) {
        const p0 = [a.head[0] - a.r * 0.6, a.head[1] - a.r * 0.5], u = ds / 0.7, c = [p0[0] - 60 * u, p0[1] - 50 * u + 140 * u * u];
        stroke('b6g.drop', [[c[0], c[1] - 12], [c[0] + 7, c[1] + 2], [c[0], c[1] + 8], [c[0] - 7, c[1] + 2], [c[0], c[1] - 12, 1]], { z: Z.fx, w: 3, closed: true, fill: C.paper, opacity: 1 - clamp((u - 0.75) / 0.25) });
      }
      const dp = t - PUFF;
      if (dp > 0 && dp < 1.1) {
        const m = a.mouth, u = dp / 1.1;
        [0, 1, 2].forEach(i => {
          const v = clamp(u * 1.25 - i * 0.12); if (v <= 0 || v >= 1) return;
          const x = m[0] + 30 + 70 * v, y = m[1] - 18 + i * 18 - 10 * v;
          stroke('b6g.pf' + i, [[x, y], [x + 18, y - 6], [x + 36, y + 2]], { z: Z.fx, w: 3, color: C.pencil, opacity: 1 - v, boil: 0.8 });
        });
      }
    },
    cues: () => [[PUFF, 'whoosh']],
  };

  /* ---------------- cast tracks ---------------- */
  const sitPos = x => [x, PHIP];
  const tapCues = [];                                                          // the toe lands when sin(11 t) turns negative
  for (let j = Math.ceil((TAP[0] * 11 / Math.PI - 1) / 2); (2 * j + 1) * Math.PI / 11 < TAP[1]; j++) tapCues.push([(2 * j + 1) * Math.PI / 11, 'tap']);

  defineScene({
    id: 'generals', chapter: '资格口试', dur: DUR, floor: FL,
    cast: {
      exam3: { ...E6.exam3, desk: [PX.exam3, TAB.top - 2] },
      stein: { ...E6.stein, desk: [PX.stein, TAB.top - 2] },
      exam2: { ...E6.exam2, desk: [PX.exam2, TAB.top - 2] },
      terry: { ...E6.teen },
    },
    order: ['exam3', 'stein', 'exam2', 'terry'],
    tracks: {
      terry: {
        pos: [[0, [-130, FL]], [0.35, [600, FL], 1.6, 'lin'],
          [4.75, [880, FL], 0.6, 'lin'], [5.4, [CHAIR.x, CHAIR.seat], 0.18],
          [8.35, [CHAIR.x, FL], 0.15], [8.55, [TX, FL], 0.8, 'lin'],
          [LEAP, hop(LEAP, 0.5, [TX, FL], STAND[0], 150), 0],
          ...HOPS.map((h, i) => [h, hop(h, 0.4, STAND[i], STAND[i + 1], 60), 0]),
          [OFF, hop(OFF, 0.45, STAND[3], [700, FL], 70), 0],
          [WALK4[0], [BENCH.x, FL], WALK4[1] - WALK4[0], 'lin'], [SIT2, [BENCH.x, BENCH.seat], 0.18],
          [UP2, [BENCH.x, FL], 0.18], [WALK5[0], [-160, FL], WALK5[1] - WALK5[0], 'lin']],
        pose: [[0, makeWalk(0.35, 1.95, 5.2)],
          [4.75, makeWalk(4.75, 5.35, 5.6), 0], [5.38, 'b6_gSit', 0.15],
          [8.33, 'stand', 0.12], [8.55, makeWalk(8.55, 9.35, 5.6), 0], [9.4, 'b6_gWrite', 0.15],
          [12.5, 'b6_gPresent', 0.14, 'back'], [STOP, 'b6_gStuck', 0.1],
          [18.4, 'scratchStand', 0.14, 'back'], [21.85, 'stand', 0.15], [SHRUG, 'b6_gShrug', 0.14, 'back'],
          [LEAP - 0.15, 'crouch', 0.1], [LEAP, 'jumpUp', 0.08], [LAND, 'stand', 0.12],
          ...HOPS.flatMap(h => [[h - 0.12, 'crouch', 0.08], [h, 'b6_gHop', 0.08], [h + 0.4, 'stand', 0.1]]),
          [OFF - 0.12, 'crouch', 0.08], [OFF, 'b6_gHop', 0.08], [OFF + 0.45, 'stand', 0.1],
          [TICKS[0] - 0.2, 'b6_gAnswer', 0.12, 'back'], [48.6, 'stand', 0.2],
          [WALK4[0], makeWalk(WALK4[0], WALK4[1], 5.6), 0], [SIT2 - 0.03, 'b6_gSit', 0.15], [TAP[0], 'b6_gTap', 0.1], [TAP[1], 'b6_gSit', 0.1],
          [UP2, 'stand', 0.15], [WIPE, 'wipeSweat', 0.14, 'back'], [59.0, 'b6_gEase', 0.25],
          [WALK5[0], makeWalk(WALK5[0], WALK5[1], 6), 0]],
        face: [[0, 'smile'], [9.5, 'proudGrin', 0.08], [STOP + 0.05, 'puzzled', 0.08], [XS[0], 'sheepish', 0.08],
          [LAND, 'sheepish', 0.08], [HOPS[2] + 0.4, 'focus', 0.1], [OFF + 0.45, 'neutral', 0.1],
          [EX_PUZ, 'surprised', 0.08], [MIS0 + 0.6, 'smile', 0.1], [TICKS[0] - 0.2, 'grin', 0.08], [48.7, 'neutral', 0.1],
          [TAP[0], 'sheepish', 0.1], [OPEN[0] + 0.2, 'surprised', 0.06], [NOD + 0.5, 'b6_gRelief', 0.1],
          [WIPE + 0.3, 'b6_gPhew', 0.1], [PUFF + 1.0, 'b6_gRelief', 0.12]],
        turn: [[0, 0.5], [2.0, 0.3, 0.15], [8.55, -0.5, 0.12], [9.35, 0.35, 0.15],
          [LEAP - 0.2, -0.3, 0.12], [LAND, 0.35, 0.15],
          [OFF - 0.15, -0.3, 0.12], [OFF + 0.5, 0.35, 0.15],
          [WALK4[0], -0.5, 0.12], [WALK4[1], 0.35, 0.15], [WIPE, 0.15, 0.2], [WALK5[0], -0.6, 0.12]],
        gaze: [[0, 'win'], [4.75, 'exam3'], [5.6, 'stein'], [8.4, 'board'], [9.4, 'nib'], [12.5, 'stein'], [Q0 + 0.2, 'qmark'],
          [18.3, 'cloud'], [ASK[0], 'ask0'], [ASK[1], 'ask1'], [ASK[2], 'ask2'], [SHRUG, 'stein'],
          [LAND, 'under'], [32.0, 'stein'], [HOPS[1] + 0.4, 'under'], [HOPS[2] + 0.4, 'under'], [35.0, 'stein'],
          [OFF + 0.45, 'exam3'], [STACK0 + 0.2, 'stack'], [ASIDE + 0.5, 'exam3'], [BASIC0, 'basic'], [TICKS[0], 'exam3'],
          [WALK4[0], 'viewer'], [SIT2, 'door'], [WIPE, 'viewer']],
        squash: [[0, 1], [LAND, 0.86, 0.05], [LAND + 0.05, 1, 0.22, 'back'],
          ...HOPS.flatMap(h => [[h + 0.4, 0.9, 0.05], [h + 0.45, 1, 0.2, 'back']]),
          [OFF + 0.45, 0.88, 0.05], [OFF + 0.5, 1, 0.2, 'back'], [OPEN[0] + 0.2, 1.08, 0.06], [OPEN[0] + 0.26, 1, 0.22, 'back']],
      },
      exam3: {
        enter: P_IN.exam3,
        pos: [[0, sitPos(PX.exam3)], [OUT - 0.25, [PX.exam3 + 2400, PHIP], 0]],
        pose: profPose([[0, 'b6_gProf'], [PT0, 'b6_gPoint', 0.14, 'back'], [15.8, 'b6_gProf', 0.2],
          [STACK0 - 0.05, 'b6_gHold', 0.12], [EX_SCR, 'b6_gScratch', 0.14, 'back'], [43.25, 'b6_gHold', 0.15], [ASIDE + 0.5, 'b6_gProf', 0.18],
          [BASIC0 - 0.05, 'b6_gHoldB', 0.12], [E_OUT - 0.3, 'b6_gProf', 0.2]], [[10.6, 2], [HOPS[0] + 0.45, 1], [HOPS[2] + 0.45, 1], [TICKS[0] + 0.1, 1], [TICKS[1] + 0.1, 1], [TICKS[2] + 0.1, 1], [NOD, 2]]),
        face: [[0, 'neutral'], [10.6, 'b6_gKind', 0.1], [PT0, 'focus', 0.08], [18.0, 'neutral', 0.1], [29.6, 'b6_gKind', 0.1],
          [EX_PUZ, 'puzzled', 0.08], [EX_SCR, 'sheepish', 0.08], [44.2, 'b6_gKind', 0.1], [NOD, 'smile', 0.1]],
        turn: [[0, -0.35]],
        gaze: [[0, 'terry'], [PT0, 'qmark'], [15.8, 'terry'], [STACK0 + 0.1, 'stack'], [ASIDE + 0.5, 'terry']],
      },
      stein: {
        enter: P_IN.stein,
        pos: [[0, sitPos(PX.stein)], [OUT - 0.25, [PX.stein + 2400, PHIP], 0]],
        pose: profPose([[0, 'b6_gProf'], [30.0, 'b6_gBeckon', 0.15], [34.6, 'b6_gProf', 0.2]], [[10.75, 2], [HOPS[1] + 0.45, 1], [NOD + 0.1, 2]]),
        face: [[0, 'neutral'], [10.7, 'b6_gKind', 0.1], [14.0, 'neutral', 0.1], [29.6, 'b6_gKind', 0.1], [NOD, 'smile', 0.1]],
        turn: [[0, -0.35]],
        gaze: [[0, 'terry']],
      },
      exam2: {
        enter: P_IN.exam2,
        pos: [[0, sitPos(PX.exam2)], [OUT - 0.25, [PX.exam2 + 2400, PHIP], 0]],
        pose: profPose([[0, 'b6_gProf']], [[10.9, 2], [HOPS[1] + 0.5, 1], [NOD + 0.2, 2]]),
        face: [[0, 'neutral'], [10.9, 'b6_gKind', 0.1], [14.2, 'neutral', 0.1], [29.6, 'b6_gKind', 0.1], [NOD, 'smile', 0.1]],
        turn: [[0, -0.35]],
        gaze: [[0, 'terry']],
      },
    },
    targets: F => ({
      win: [1180, 190], board: [420, 380], nib: nibAt(F.t), qmark: [300, 260], cloud: [320, 240],
      ask0: [ASKS[0].x, 318], ask1: [ASKS[1].x, 318], ask2: [ASKS[2].x, 318],
      under: [F.anchors.terry ? F.anchors.terry.footR[0] + 60 : 600, 760],
      stack: stackAt(F.t).c, basic: HOLD2, door: [1265, 470],
    }),
    fx: [
      { type: 'ageStamp', age: 18, t0: -3, ...E6.STAMP, dockT: -2, pulse: [PULSE] },
      { type: 'b6_gRoom', id: 'b6g.room' },
      { type: 'b6_gTxt', id: 'b6g.date', text: '1994 年初 · 冬', x: 360, y: 270, size: 64, t0: DATE0, t1: DATE1, cps: 7, anchor: 'start' },
      { type: 'b6_gTxt', id: 'b6g.2h', text: '2 小时', x: 790, y: 112, size: 44, t0: 6.2, t1: ARC1 },
      // A small corner he prepared … and the big empty board around it
      { type: 'b6_gChalk', id: 'b6g.chalkfx' },
      { type: 'b6_gFade', id: 'b6g.ringF', out: PREP1 - 0.3, of: { type: 'ringRect', id: 'b6g.ring', rect: [BX - 12, 384, 236, 146], t0: RING0, t1: PREP1, pad: 16 } },
      { type: 'b6_gFade', id: 'b6g.prepF', out: PREP1 - 0.3, of: { type: 'label', id: 'b6g.prep', text: '准备好的一小块', at: [380, 300], rot: -3, t0: RING0 + 0.2, t1: PREP1, target: [BX + 6, 372], bend: 0.2, gap: 10 } },
      { type: 'b6_gPointer', id: 'b6g.ptrfx', t0: PT0 + 0.15, t1: L4_OUT, to: [336, 300] },
      { type: 'b6_gFade', id: 'b6g.qF', out: L4_OUT - 0.3, of: { type: 'write', id: 'b6g.q', text: '?', x: 236, y: 170, size: 150, t0: Q0, t1: L4_OUT, speed: 2200, w: 9, z: Z.board, sfx: 'chalk' } },
      { type: 'b6_gTxt', id: 'b6g.leak', text: '露馅了', x: 345, y: 480, size: 46, rot: -4, t0: LEAK0, t1: L4_OUT },
      // only half remembered
      { type: 'b6_gFade', id: 'b6g.cloudF', out: C_OUT - 0.3, of: { type: 'thought', id: 'b6g.cloud', at: [320, 240], rx: 240, ry: 100, t0: CLOUD0, t1: C_OUT, from: { char: 'terry', part: 'headTop', dx: 0, dy: -6 } } },
      { type: 'b6_gFuzzy', id: 'b6g.fuzzy', t0: CLOUD0 + 0.3, t1: C_OUT },
      { type: 'b6_gAsk', id: 'b6g.asks' },
      // easier and easier questions
      { type: 'b6_gStairs', id: 'b6g.stairs' },
      // luck: the examiner prepared for another subject
      { type: 'b6_gLuck', id: 'b6g.lk' },
      { type: 'b6_gStack', id: 'b6g.stack' },
      { type: 'b6_gFade', id: 'b6g.misF', out: 44.55, of: { type: 'label', id: 'b6g.mis', text: '记错了科目', at: [560, 296], rot: -3, t0: MIS0, t1: 44.85, target: [HOLD[0] - SW / 2, HOLD[1] - 20], bend: -0.15, gap: 12 } },
      ...TICKS.map((tt, i) => ({ type: 'b6_gFade', id: 'b6g.tkF' + i, out: E_OUT - 0.3, of: { type: 'write', id: 'b6g.tk' + i, text: '✓', x: 556 + i * 76, y: i === 1 ? 300 : 318, size: 52, t0: tt, t1: E_OUT, speed: 2800, color: 'red', w: 6.5, z: Z.annot, sfx: 'plip' } })),
      // barely passed
      { type: 'b6_gTxt', id: 'b6g.pass', text: '勉强通过', x: 1265, y: 236, size: 62, t0: PASS0, t1: 59.6, ul: true, sfx: 'stamp' },
      { type: 'b6_gTxt', id: 'b6g.said', text: '（他后来说）', x: 420, y: 296, size: 38, t0: SAID0, t1: NOTE1 },
      { type: 'b6_gPhew', id: 'b6g.phew' },
    ],
    steps: [{ t0: 0.35, t1: 1.95, hz: 5.2 }, { t0: 4.75, t1: 5.35, hz: 5.6 }, { t0: 8.55, t1: 9.35, hz: 5.6 }, { t0: WALK4[0], t1: WALK4[1], hz: 5.6 }, { t0: WALK5[0], t1: WALK5[1], hz: 6 }],
    sfx: [[P_IN.exam3, 'pop'], [P_IN.stein, 'pop'], [P_IN.exam2, 'pop'], [5.45, 'thud'], [STOP, 'boop'],
      [LEAP, 'hop'], [LAND, 'thud'], ...HOPS.map(h => [h, 'hop']), [OFF, 'hop'], [EX_SCR, 'boop'], [SIT2, 'thud'], ...tapCues, [WIPE, 'swish']],
    subs: [
      { t0: 0.3, t1: 4.3, text: '1994年初的冬天，他十八岁。', say: '一九九四年初的冬天，他十八岁。' },
      { t0: 4.4, t1: 7.8, text: '三位教授，问了两个小时。' },
      { t0: 8.3, t1: 12.9, text: '开头不错：他讲了自己准备好的一小块。' },
      { t0: 13.6, t1: 17.6, text: '可是一离开这一小块，就露馅了。' },
      { t0: 18.1, t1: 21.7, text: '一个结论，他只记得个大概：' },
      { t0: 21.8, t1: 24.4, text: '说不准，证不对，' },
      { t0: 24.5, t1: 28.7, text: '也说不出它有什么用、和什么有关。' },
      { t0: 29.4, t1: 33.0, text: '教授们的问题，越问越简单，' },
      { t0: 33.1, t1: 36.1, text: '想让他至少答对一题。' },
      { t0: 36.8, t1: 39.8, text: '最后，是运气救了他：' },
      { t0: 39.9, t1: 44.7, text: '一位教授记错了科目，准备的题全用不上。' },
      { t0: 45.0, t1: 48.6, text: '问的都是他准备过的基础题。' },
      { t0: 49.3, t1: 53.1, text: '教授们关上门，商量了很久……' },
      { t0: 54.0, t1: 56.6, text: '勉强让他通过了。' },
      { t0: 57.1, t1: 61.5, text: '“我运气太好了，差一点点就没过。”' },
    ],
  });
})();
