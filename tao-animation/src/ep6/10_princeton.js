// 第 10 场 · 去普林斯顿（17 岁，1992 年秋）
// 事实（ep6-script.md）：1992 年秋，17 岁，拿奖学金去普林斯顿读博士；爸爸陪了头几个星期，教他开银行账户、自己洗衣服；
//   第一天在数学楼大厅看老师名单：“I recognized half the names … It was kind of intimidating.”（PAW 2019）；
//   研究生课 “did not have any homework or tests”，唯一的大考是让人害怕的资格口试（generals）。
// 演绎：地图只画两块示意的陆地和名字，飞机窗口里是小陶的小头像；名单上的名字都是铅笔涂鸦（不写真人名字），14 个里打 7 个勾 = “一半”；
//   银行柜员只是一个小圆头；洗衣机两个按钮，爸爸先按，小陶学着按；“资格口试”的大牌子从天而降是比喻。
// 印章：开场在中央盖 17 岁（飘带“1992 普林斯顿”），再停靠，一直留到结尾（交给第 15 场）。
// 结尾：最后 0.55 秒全部淡出，只剩停靠的 17 岁印章。
// 字幕：第 6–10 句整体后移 0.6 秒（给洗衣机那一格留时间）；每句时长不变。
(() => {
  const FL = 780;
  /* ---------------- times (scene clock) ---------------- */
  const STAMP = 0.35, DOCK = 2.5;
  const T_IN = 2.65, WAVE0 = 3.15, WAVE1 = 3.95, FADE1 = 4.05;                                  // L1 0.3–4.3
  const MAP = 4.2, TAKE = 4.8, LAND = 7.0, NOTE2 = 4.95, MAP_OUT = 7.7;                          // L2 4.4–7.8
  const UNI = 7.82, UNI_SIGN = 8.2, T_W0 = 8.25, T_W1 = 9.95, LOOK = 10.1;                       // L3 7.9–11.1
  const DAD0 = 11.8, DAD1 = 12.9, DADLBL = 12.95, GRAB = 13.1, CUT1 = 15.0;                       // L4 11.7–15.1
  const BANK = CUT1 + 0.12, POINT = 15.6, SIGN0 = 15.85, SIGN1 = 16.55, CUT2 = 16.85;            // L5 15.2–19.0: the bank …
  const WASH = CUT2 + 0.12, PRESS_D = 17.6, PRESS_T = 18.45, CUT3 = 19.85;                        //   … and the washing machine
  const LOBBY = CUT3 + 0.12, T_W2 = 20.2, T_W3 = 21.3, LOOKUP = 21.4, BTITLE = 22.6;             // L6 20.3–24.7
  const TICK0 = 25.25, TICKD = 0.25, RECALL = 25.05, SCARY = 27.55, CUT4 = 29.95;                // L7 25.0–29.8
  const CARD = 30.3, ROW1 = 32.0, ROW2 = 33.2, CUT5 = 35.4;                                       // L8 30.5–35.3
  const DROP = 35.95, LANDS = 36.25, THUMP = 39.35, FEAR = 39.55, FADE0 = 41.2, DUR = 41.8;      // L9 35.4–39.0, L10 39.3–41.3
  const IN = 0.3;   // characters fade back in this long after a cut

  /* ---------------- layout ---------------- */
  const TX1 = 380, TX3 = 900, DX4 = 1140, BX_T = 540, BX_D = 790, WX_T = 730, WX_D = 300, LX_T = 380;
  const P0 = [330, 556], P1 = [800, 70], P2 = [1270, 268];                          // the flight
  const SIG = [[392, 562], [400, 548], [408, 560], [418, 546], [428, 561], [438, 549], [448, 559], [462, 551]];   // the signature on the form
  const BTN_D = [470, 556], BTN_T = [570, 556], DOOR = [520, 675];                    // the washing machine
  const BD = { x0: 640, x1: 1320, y0: 110, y1: 690 }, LIT = [0, 8, 2, 3, 11, 5, 13];   // the name board; 7 of 14 names light up
  const CD = { cx: 930, cy: 420, w: 560, h: 420 };                                    // the 研究生课 card
  const SG = { cx: 670, w: 840, top: 90, h: 280 };                                    // the big 资格口试 sign

  /* ---------------- helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const fadeItems = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * Math.max(0, k)).toFixed(3); } };
  const abs = (x, y, bend = 'down') => ({ w: 1, to: 'abs', dx: x, dy: y, bend });
  const bez = (A, B, Cc, u) => [(1 - u) * (1 - u) * A[0] + 2 * u * (1 - u) * B[0] + u * u * Cc[0], (1 - u) * (1 - u) * A[1] + 2 * u * (1 - u) * B[1] + u * u * Cc[1]];
  const scrib = (k, x0, x1, y, n, o) => { const pts = []; for (let j = 0; j <= n; j++) pts.push([lerp(x0, x1, j / n), y + (j % 2 ? -6 : 5) + rnd(hstr(k), j, 3) * 2]); stroke(k, pts, o); };
  const tick = (k, c, s, o) => stroke(k, [[c[0] - 26 * s, c[1]], [c[0] - 8 * s, c[1] + 20 * s, 1], [c[0] + 30 * s, c[1] - 32 * s]], o);

  /* ---------------- generic bits ---------------- */
  /** draws `paint` from t0 and fades its own shapes out from fo over fd */
  COMP.a6_pLayer = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const k = fx.fo !== undefined ? 1 - clamp((t - fx.fo) / (fx.fd || 0.25)) : 1; if (k <= 0) return;
      const n0 = DL.items.length;
      fx.paint(t, F, t - fx.t0);
      fadeItems(n0, k);
    },
    cues: fx => fx.sfxAt || [],
  };
  /** red-pen note (pops in, fades out) */
  COMP.a6_pNote = {
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
  /** per-character opacity tracks (a character fades out at a cut, jumps while invisible, fades back in) */
  COMP.a6_pVis = {
    draw(fx, t) {
      for (const id in fx.chars) {
        const k = evalTrack(fx.chars[id], t); if (k >= 0.999) continue;
        DL.items.forEach(it => { if (it.key.startsWith(id + '.')) it.attrs.opacity = +((it.attrs.opacity ?? 1) * Math.max(0, k)).toFixed(3); });
      }
    },
  };
  /** the end: everything but the docked stamp fades out */
  COMP.a6_pEnd = {
    draw(fx, t) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k >= 1) return;
      DL.items.forEach(it => { if (!/^stamp/.test(it.key)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * k).toFixed(3); });
    },
  };

  /* ---------------- character tracks shared with the props ---------------- */
  const TPOS = [[0, [TX1, FL]], [FADE1 + 0.27, [1760, FL], 0], [T_W0, [TX3, FL], T_W1 - T_W0, 'lin'],
    [CUT1 + 0.27, [BX_T, FL], 0], [CUT2 + 0.27, [WX_T, FL], 0], [CUT3 + 0.27, [-200, FL], 0], [T_W2, [LX_T, FL], T_W3 - T_W2, 'lin']];
  const VIS = {
    terry: [[0, 1], [FADE1, 0, 0.25], [FADE1 + 0.3, 1, 0], [CUT1, 0, 0.25], [CUT1 + IN, 1, 0.2], [CUT2, 0, 0.25], [CUT2 + IN, 1, 0.2], [CUT3, 0, 0.25], [CUT3 + 0.3, 1, 0]],
    dad: [[0, 1], [CUT1, 0, 0.25], [CUT1 + IN, 1, 0.2], [CUT2, 0, 0.25], [CUT2 + IN, 1, 0.2], [CUT3, 0, 0.25]],
  };
  // the suitcase: stands upright beside him (wheels at x + 150), or is dragged behind him tilted −40° (wheels at x + 210)
  const DRAG = [[0, 0], [T_W0 - 0.05, 1, 0], [T_W1, 0, 0.25]];
  const caseAt = t => { const d = evalTrack(DRAG, t), x = evalTrack(TPOS, t)[0]; return { W: [x + lerp(150, 210, d), FL - 2], rot: lerp(0, -40, d) }; };
  const HANDLE = 205;
  const handleTop = t => { const { W, rot } = caseAt(t), a = rot * RAD; return [W[0] + HANDLE * Math.sin(a), W[1] - HANDLE * Math.cos(a)]; };
  const penTip = t => pointAt(SIG, clamp((t - SIGN0) / (SIGN1 - SIGN0)));

  /* ---------------- 1 · the suitcase ---------------- */
  COMP.a6_pCase = {
    draw(fx, t) {
      if (t < T_IN || t >= CUT1 + 0.26) return;
      const vis = evalTrack(VIS.terry, t); if (vis <= 0.01) return;
      const { W, rot } = caseAt(t), pop = Math.max(0.01, EASE.back(clamp((t - T_IN) / 0.3))), n0 = DL.items.length, k = 'a6pCase', z = Z.body - 1;
      DL.save(); DL.translate(W[0], W[1]); DL.scale(pop); DL.rotate(rot);
      stroke(k + '.rl', [[-14, -140], [-14, -HANDLE]], { z: z - 0.1, w: 4 });
      stroke(k + '.rr', [[14, -140], [14, -HANDLE]], { z: z - 0.1, w: 4 });
      stroke(k + '.grip', [[-22, -HANDLE], [22, -HANDLE]], { z, w: 7 });
      stroke(k + '.body', superPts(0, -80, 96, 126, 22, 7), { z, w: 5, closed: true, fill: C.paper });
      stroke(k + '.rib0', [[-24, -136], [-24, -24]], { z: z + 0.1, w: 2.6 });
      stroke(k + '.rib1', [[24, -136], [24, -24]], { z: z + 0.1, w: 2.6 });
      [-30, 30].forEach((x, i) => stroke(k + '.wh' + i, ringPts(k + '.wh' + i, x, -9, 9, 9, { n: 8, closed: true }), { z: z + 0.1, w: 3.5, closed: true, fill: C.paper }));
      DL.restore();
      fadeItems(n0, vis);
    },
  };

  /* ---------------- 2 · the flight: 澳大利亚 → 美国 ---------------- */
  const planeU = t => EASE.io(clamp((t - TAKE) / (LAND - TAKE)));
  const mapPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1, k = 'a6pMap';
    stroke(k + '.au', ringPts(k + '.au', 330, 642, 128, 70, { n: 14, closed: true, rv: 0.12 }), { z, w: 4, closed: true, draw: p });
    stroke(k + '.us', ringPts(k + '.us', 1270, 384, 160, 80, { n: 15, closed: true, rv: 0.1 }), { z, w: 4, closed: true, draw: p });
    const q = clamp((lt - 0.25) / 0.2);
    if (q > 0) {
      text(k + '.aut', '澳大利亚', 330, 646, { size: 44, z: z + 0.2, opacity: q });
      text(k + '.ust', '美国', 1270, 392, { size: 52, z: z + 0.2, opacity: q });
    }
    for (let i = 0; i < 4; i++) stroke(k + '.w' + i, [[560 + i * 110, 700 - (i % 2) * 40], [585 + i * 110, 690 - (i % 2) * 40], [610 + i * 110, 700 - (i % 2) * 40]], { z, w: 2.4, color: C.pencil, draw: p, boil: 0.5 });   // a few waves of the ocean
    // dashed route behind the plane
    const u = planeU(t), N = 34;
    for (let i = 0; i < N; i++) {
      const u0 = i / N, u1 = Math.min((i + 0.55) / N, u); if (u0 >= u) break;
      stroke(k + '.d' + i, [bez(P0, P1, P2, u0), bez(P0, P1, P2, u1)], { z, w: 3.5, boil: 0.4 });
    }
    // the plane (Terry's little head in the front window)
    if (t < MAP + 0.3) return;
    const c = bez(P0, P1, P2, u), d = [2 * (1 - u) * (P1[0] - P0[0]) + 2 * u * (P2[0] - P1[0]), 2 * (1 - u) * (P1[1] - P0[1]) + 2 * u * (P2[1] - P1[1])];
    const lv = (1 - EASE.io(clamp((u - 0.82) / 0.18))) * EASE.io(clamp((t - TAKE) / 0.3)), rot = Math.atan2(d[1], d[0]) / RAD * lv;   // level on the ground, nose up after take-off, level again to land
    const pop = Math.max(0.01, EASE.back(clamp((t - MAP - 0.3) / 0.3))), bump = t > LAND && t < LAND + 0.3 ? 1 - 0.08 * Math.sin(Math.PI * (t - LAND) / 0.3) : 1;
    const zp = Z.front + 2, kp = 'a6pPlane';
    DL.save(); DL.translate(c[0], c[1]); DL.scale(1.2 * pop, 1.2 * pop * bump); DL.rotate(rot);
    stroke(kp + '.tail', [[-80, -14], [-106, -60, 1], [-86, -62, 1], [-50, -14]], { z: zp - 0.1, w: 5, fill: C.paper });
    stroke(kp + '.body', [[-112, -2], [-98, -18], [58, -19], [94, -10], [114, 2], [94, 14], [-96, 16], [-112, -2]], { z: zp, w: 5, closed: true, fill: C.paper });
    stroke(kp + '.wing', [[14, 4], [-30, 52, 1], [-8, 54, 1], [40, 6]], { z: zp + 0.1, w: 5, fill: C.paper });
    [-64, -40, -16].forEach((x, i) => stroke(kp + '.win' + i, ringPts(kp + '.win' + i, x, -2, 7, 7, { n: 7, closed: true }), { z: zp + 0.1, w: 3, closed: true }));
    stroke(kp + '.cw', ringPts(kp + '.cw', 34, -1, 17, 15, { n: 10, closed: true }), { z: zp + 0.1, w: 3.5, closed: true, fill: C.paper });
    portrait(kp + '.me', 34, 1, 11, { happy: true, z: zp + 0.2, w: 3 });
    DL.restore();
  };

  /* ---------------- 3 · the university: a tower with a spire and an arch, the sign 普林斯顿大学 ---------------- */
  const uniPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.55)), z = Z.set + 1, k = 'a6pUni';
    stroke(k + '.wing', box(150, 440, 690, FL), { z, w: 5, fill: C.paper, draw: stag(p, 0, 5) });
    [[150, 330], [510, 690]].forEach(([a, b], j) => {
      const pts = [[a, 440]];
      for (let x = a; x < b - 1; x += 45) pts.push([x, 418, 1], [x + 22, 418, 1], [x + 22, 440, 1], [Math.min(x + 45, b), 440, 1]);
      stroke(k + '.cr' + j, pts, { z, w: 4.5, draw: stag(p, 1, 5) });
    });
    [200, 265, 575, 640].forEach((x, i) => stroke(k + '.wn' + i, [[x - 15, 612], [x - 15, 545, 1], [x, 518, 1], [x + 15, 545, 1], [x + 15, 612, 1], [x - 15, 612, 1]], { z: z + 0.1, w: 3.5, draw: stag(p, 2, 5) }));
    stroke(k + '.tower', box(330, 252, 510, FL), { z: z + 0.2, w: 5.5, fill: C.paper, draw: stag(p, 1, 5) });
    stroke(k + '.spire', [[318, 254], [420, 104, 1], [522, 254, 1], [318, 254, 1]], { z: z + 0.25, w: 5.5, fill: C.paper, draw: stag(p, 2, 5) });
    stroke(k + '.fin', [[420, 104], [420, 76]], { z: z + 0.25, w: 4.5, draw: stag(p, 3, 5) });
    stroke(k + '.rose', ringPts(k + '.rose', 420, 330, 30, 30, { n: 10, closed: true }), { z: z + 0.3, w: 4, closed: true, draw: stag(p, 3, 5) });
    stroke(k + '.rx', [[392, 330], [448, 330]], { z: z + 0.3, w: 2.6, draw: stag(p, 3, 5) });
    stroke(k + '.ry', [[420, 302], [420, 358]], { z: z + 0.3, w: 2.6, draw: stag(p, 3, 5) });
    stroke(k + '.arch', [[372, FL], [372, 652, 1], [392, 616], [420, 598, 1], [448, 616], [468, 652, 1], [468, FL]], { z: z + 0.3, w: 5, draw: stag(p, 4, 5) });
    stroke(k + '.ad', [[420, 600], [420, FL]], { z: z + 0.3, w: 2.8, draw: stag(p, 4, 5) });
    if (p > 0.8) shadow(k + '.sh', 420, FL + 4, 560, 1);
    const q = clamp((t - UNI_SIGN) / 0.22);
    if (q > 0) {
      const s = lerp(0.5, 1, EASE.back(q));
      DL.save(); DL.about(420, 476, () => DL.scale(s));
      stroke(k + '.sg', box(258, 446, 582, 506), { z: z + 0.5, w: 5, fill: C.paper });
      text(k + '.sgt', '普林斯顿大学', 420, 476, { size: 46, z: z + 0.6, opacity: clamp(q * 3) });
      DL.restore();
    }
  };

  /* ---------------- 4 · the bank window: 银行, a teller (just a round head), a form he signs ---------------- */
  const bankPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 1, k = 'a6pBank';
    stroke(k + '.win', box(140, 300, 450, 576), { z, w: 5.5, fill: C.paper, draw: stag(p, 0, 4) });
    stroke(k + '.th', ringPts(k + '.th', 295, 444, 44, 46, { n: 12, closed: true }), { z: z + 0.1, w: 4.5, closed: true, fill: C.paper, draw: stag(p, 1, 4) });
    if (p > 0.6) {
      dot(k + '.te0', [280, 438], 4.5, C.ink, z + 0.15); dot(k + '.te1', [310, 438], 4.5, C.ink, z + 0.15);
      stroke(k + '.tm', [[284, 462], [295, 469], [306, 462]], { z: z + 0.15, w: 3.5 });
    }
    stroke(k + '.tb', [[222, 576], [236, 528], [295, 500], [354, 528], [368, 576]], { z: z + 0.1, w: 4.5, draw: stag(p, 1, 4) });
    for (let i = 0; i < 6; i++) stroke(k + '.bar' + i, [[170 + i * 50, 302], [170 + i * 50, 574]], { z: z + 0.3, w: 3.2, draw: stag(p, 2, 4) });
    stroke(k + '.sg', box(208, 192, 382, 268), { z: z + 0.2, w: 5, fill: C.paper, draw: stag(p, 1, 4) });
    if (p > 0.5) text(k + '.sgt', '银行', 295, 231, { size: 58, z: z + 0.3, opacity: clamp((p - 0.5) * 3) });
    stroke(k + '.slab', box(100, 576, 492, 598), { z: z + 0.4, w: 5, fill: C.paper, draw: stag(p, 2, 4) });
    stroke(k + '.ctr', box(116, 598, 476, FL), { z: z + 0.35, w: 5, fill: C.paper, draw: stag(p, 3, 4) });
    stroke(k + '.pnl', box(150, 630, 442, 750), { z: z + 0.4, w: 2.6, draw: stag(p, 3, 4) });
    if (p > 0.8) shadow(k + '.sh', 296, FL + 4, 380, 1);
    // the form, leaning on the counter, and his signature on it
    stroke(k + '.form', [[374, 576], [480, 576, 1], [468, 524, 1], [386, 524, 1], [374, 576, 1]], { z: z + 0.6, w: 3.5, fill: C.paper, draw: stag(p, 3, 4) });
    if (p > 0.9) for (let i = 0; i < 2; i++) stroke(k + '.fl' + i, [[392, 534 + i * 9], [440 - i * 14, 533 + i * 9]], { z: z + 0.65, w: 2.2, color: C.pencil, boil: 0.4 });
    const sp = clamp((t - SIGN0) / (SIGN1 - SIGN0));
    if (sp > 0) stroke(k + '.sig', SIG, { z: z + 0.7, w: 3.5, draw: sp, boil: 0.4 });
    const pen = t >= SIGN0 - 0.15 && t < SIGN1 + 0.2;
    const tip = pen ? penTip(t) : [446, 570], tail = pen ? [tip[0] + 16, tip[1] - 40] : [482, 566];
    if (p > 0.9) stroke(k + '.pen', [tip, tail], { z: Z.front + 1, w: 5 });
  };

  /* ---------------- 5 · the washing machine: two buttons, clothes going round, then bubbles ---------------- */
  const spinAt = t => (t < PRESS_D + 0.1 ? 0 : (Math.min(t, PRESS_T + 0.1) - PRESS_D - 0.1) * 5) + (t > PRESS_T + 0.1 ? (t - PRESS_T - 0.1) * 11 : 0);
  const washPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.45)), z = Z.set + 2, k = 'a6pWash';
    const sh = t > PRESS_T + 0.1 && t < PRESS_T + 1.4 ? 3 * Math.sin((t - PRESS_T) * 48) * (1 - (t - PRESS_T - 0.1) / 1.3) : 0;
    DL.save(); DL.translate(DOOR[0] + sh, 0);
    stroke(k + '.body', box(-95, 530, 95, FL - 6), { z, w: 5.5, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.f0', [[-80, FL - 6], [-80, FL]], { z, w: 5, draw: stag(p, 0, 3) });
    stroke(k + '.f1', [[80, FL - 6], [80, FL]], { z, w: 5, draw: stag(p, 0, 3) });
    stroke(k + '.strip', [[-95, 584], [95, 584]], { z: z + 0.1, w: 3.5, draw: stag(p, 1, 3) });
    [[BTN_D, PRESS_D], [BTN_T, PRESS_T]].forEach(([b, tp], i) => {
      const pr = t > tp && t < tp + 0.25 ? 0.7 : 1;
      stroke(k + '.btn' + i, ringPts(k + '.btn' + i, b[0] - DOOR[0], b[1], 12 * pr, 12 * pr, { n: 8, closed: true }), { z: z + 0.2, w: 4, closed: true, fill: C.paper, draw: stag(p, 1, 3) });
    });
    stroke(k + '.door', ringPts(k + '.door', 0, DOOR[1], 64, 64, { n: 14, closed: true }), { z: z + 0.2, w: 5, closed: true, fill: C.paper, draw: stag(p, 2, 3) });
    stroke(k + '.glass', ringPts(k + '.glass', 0, DOOR[1], 48, 48, { n: 12, a0: -60, sweep: 372 }), { z: z + 0.3, w: 3, draw: stag(p, 2, 3) });
    if (p > 0.9) {   // a sock and a shirt going round
      const a = spinAt(t), cs = Math.cos(a), sn = Math.sin(a), R = (x, y) => [x * cs - y * sn, DOOR[1] + x * sn + y * cs];
      stroke(k + '.sock', [R(-30, -6), R(-10, -8), R(-8, 10), R(4, 12)], { z: z + 0.35, w: 4 });
      stroke(k + '.shirt', [R(6, 16), R(30, 14), R(28, 30, 1), R(18, 30), R(18, 18)], { z: z + 0.35, w: 4 });
    }
    DL.restore();
    if (p > 0.8) shadow(k + '.sh', DOOR[0], FL + 4, 220, 1);
    // bubbles after his turn
    for (let i = 0; i < 7; i++) {
      const b0 = PRESS_T + 0.15 + i * 0.16, u = (t - b0) / 1.25; if (u <= 0 || u >= 1) continue;
      const x = DOOR[0] - 60 + ((i * 47) % 120) + 14 * Math.sin(u * 6 + i), y = lerp(536, 360, EASE.out(u)), r = 10 + (i % 3) * 5;
      stroke(k + '.bub' + i, ringPts(k + '.bub' + i, x, y, r, r, { n: 8, closed: true }), { z: Z.fx, w: 3, closed: true, fill: C.paper, opacity: clamp((1 - u) * 4) });
    }
  };

  /* ---------------- 6 · the name board in the maths building: 14 pencil names, 7 light up ---------------- */
  const nameAt = i => [i < 7 ? 712 : 1050, 268 + (i % 7) * 58];
  const boardPaint = (t, F, lt) => {
    const p = EASE.out(clamp(lt / 0.5)), z = Z.set + 1, k = 'a6pBoard', { x0, x1, y0, y1 } = BD, cx = (x0 + x1) / 2;
    stroke(k + '.o', box(x0, y0, x1, y1), { z, w: 6, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.i', box(x0 + 14, y0 + 14, x1 - 14, y1 - 14), { z: z + 0.1, w: 2.5, draw: stag(p, 1, 3) });
    const q = clamp((t - BTITLE) / 0.22);
    if (q > 0) text(k + '.title', '老师名单', cx, 168, { size: 56, z: z + 0.3, scale: lerp(0.5, 1, EASE.back(q)), opacity: clamp(q * 3) });
    stroke(k + '.rule', [[x0 + 40, 206], [x1 - 40, 203]], { z: z + 0.2, w: 3, draw: stag(p, 1, 3) });
    for (let i = 0; i < 14; i++) {
      const [bx, y] = nameAt(i), li = LIT.indexOf(i), ti = li < 0 ? Infinity : TICK0 + li * TICKD, on = t >= ti;
      dot(k + '.b' + i, [bx, y], 5.5 * stag(p, 2, 3), C.ink, z + 0.2);
      const len = 150 + ((i * 37) % 60), v = (t - ti) / 0.45, fl = v > 0 && v < 1 ? Math.sin(Math.PI * v) : 0;
      scrib(k + '.n' + i, bx + 24, bx + 24 + len, y, 8 + (i % 3), { z: z + 0.2, w: on ? 4 + 1.5 * fl : 3, color: on ? C.ink : C.pencil, boil: 0.6, draw: stag(p, 2, 3) });
      if (on) {
        const c = [bx - 34, y - 2], s = 0.62 * (1 + 0.35 * fl);
        tick(k + '.tk' + i, c, s, { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp((t - ti) / 0.18)) });
        if (fl > 0) for (let r = 0; r < 4; r++) {
          const a = (-150 + r * 40) * RAD, r0 = 30 + 14 * v, L = 12 * fl;
          stroke(k + '.ray' + i + '.' + r, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0], [c[0] + Math.cos(a) * (r0 + L), c[1] + Math.sin(a) * (r0 + L)]], { z: Z.annot, w: 3, color: C.red });
        }
      }
    }
  };

  /* ---------------- 7 · the card 研究生课: 作业：无 ✓ 考试：无 ✓ ---------------- */
  COMP.a6_pCard = {
    draw(fx, t) {
      if (t < CARD || t >= CUT5 + 0.4) return;
      const drop = EASE.back(clamp((t - CARD) / 0.35)), out = EASE.in(clamp((t - CUT5) / 0.35)), k = 'a6pCard', z = Z.set + 3, { w, h } = CD;
      DL.save(); DL.translate(CD.cx + out * 700, CD.cy - (1 - drop) * 700 - out * 760); DL.rotate(-2 - (1 - drop) * 10 + out * 25);
      stroke(k, superPts(0, 0, w, h, 24, 12), { z, w: 5, closed: true, fill: C.paper });
      text(k + '.h', '研究生课', 0, -h / 2 + 64, { size: 64, z: z + 0.2 });
      stroke(k + '.rule', [[-w / 2 + 40, -h / 2 + 116], [w / 2 - 40, -h / 2 + 112]], { z: z + 0.1, w: 3 });
      [['作业：无', ROW1, -6], ['考试：无', ROW2, 110]].forEach(([s, tr, y], i) => {
        const q = clamp((t - tr) / 0.2); if (q <= 0) return;
        text(k + '.r' + i, s, -w / 2 + 60, y, { size: 64, anchor: 'start', z: z + 0.2, scale: lerp(0.6, 1, EASE.back(q)), opacity: clamp(q * 3) });
        const cq = EASE.out(clamp((t - tr - 0.35) / 0.25));
        if (cq > 0) tick(k + '.ck' + i, [w / 2 - 110, y - 4], 1.25, { z: Z.annot, w: 7, color: C.red, draw: cq });
      });
      DL.restore();
    },
    cues: () => [[CARD, 'paper'], [CARD + 0.3, 'tap'], [ROW1, 'pop'], [ROW1 + 0.35, 'pen'], [ROW2, 'pop'], [ROW2 + 0.35, 'pen'], [CUT5, 'whoosh']],
  };

  /* ---------------- 8 · the huge sign 资格口试 drops in on two ropes, its shadow falls over him ---------------- */
  COMP.a6_pSign = {
    draw(fx, t) {
      if (t < DROP) return;
      const k = 'a6pSign', z = Z.set + 5, { cx, w, top, h } = SG;
      const u = clamp((t - DROP) / (LANDS - DROP)), ls = t - LANDS;
      const off = t < LANDS ? -600 * (1 - u * u) : 16 * Math.sin(ls * 14) * Math.exp(-6 * ls);
      // the shadow: pencil hatching from under the sign down to the floor
      const sh = 0.3 * clamp((t - DROP) / (LANDS - DROP + 0.1));
      if (sh > 0.01) for (let xb = 270 - 396, i = 0; xb < 1070; xb += 34, i++) {
        const s0 = Math.max(0, 270 - xb), s1 = Math.min(396, 1070 - xb); if (s1 <= s0) continue;
        stroke(k + '.hatch' + i, [[xb + s0, 776 - s0], [xb + s1, 776 - s1]], { z: Z.set + 0.5, w: 2.4, color: C.pencil, opacity: sh, boil: 0.5 });
      }
      const y0 = top + off;
      stroke(k + '.ropeL', [[cx - 330, -10], [cx - 330, y0]], { z, w: 3.5 });
      stroke(k + '.ropeR', [[cx + 330, -10], [cx + 330, y0]], { z, w: 3.5 });
      stroke(k + '.o', box(cx - w / 2, y0, cx + w / 2, y0 + h), { z: z + 0.1, w: 7, fill: C.paper });
      stroke(k + '.i', box(cx - w / 2 + 16, y0 + 16, cx + w / 2 - 16, y0 + h - 16), { z: z + 0.15, w: 3 });
      const v = (t - THUMP) / 0.5, sc = v > 0 && v < 1 ? 1 + 0.32 * Math.exp(-6 * v) * Math.cos(9 * v) : 1, rot = v > 0 && v < 1 ? 3 * Math.exp(-5 * v) * Math.sin(16 * v) : 0;
      text(k + '.t', '资格口试', cx, y0 + h / 2 + 4, { size: 150, z: z + 0.3, scale: sc, rot });
      if (v > 0 && v < 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => {   // impact marks around the words
        const L = 34 * Math.sin(Math.PI * v), bx = cx + sx * 345, by = y0 + h / 2 + sy * 82;
        stroke(k + '.im' + i, [[bx, by], [bx + sx * L, by + sy * L * 0.7]], { z: z + 0.3, w: 4.5 });
        stroke(k + '.jm' + i, [[bx - sx * 20, by + sy * 24], [bx - sx * 20 + sx * L * 0.6, by + sy * (24 + L * 0.8)]], { z: z + 0.3, w: 4.5 });
      });
    },
    cues: () => [[DROP, 'whoosh'], [LANDS, 'thud'], [THUMP, 'stamp']],
  };

  /** a sweat drop beside his head when it gets a bit scary */
  COMP.a6_pSweat = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors.terry; if (!a) return;
      const u = clamp((t - fx.t0) / 0.25), fo = clamp((fx.t1 - t) / 0.2), slide = 10 * clamp((t - fx.t0 - 0.3) / 1.5);
      const c = [a.head[0] + a.r * 1.15, a.head[1] - a.r * 0.25 + slide], s = EASE.back(u);
      stroke('a6pSweat', [[c[0], c[1] - 18 * s], [c[0] + 9 * s, c[1] + 2 * s], [c[0], c[1] + 10 * s], [c[0] - 9 * s, c[1] + 2 * s], [c[0], c[1] - 18 * s]], { z: Z.fx, w: 3.5, closed: true, fill: C.paper, opacity: fo });
    },
    cues: fx => [[fx.t0, 'plip']],
  };

  /* ---------------- poses ---------------- */
  const walkT = makeWalk(T_W0, T_W1, 5.2, { bag: true, lean: -5 });
  const hold = (o = {}) => t => ({ armScale: 1.2, ikR: abs(...handleTop(t)), ...o });
  const waveL = t => ({ ...hold()(t), armL: [118, 22 + 25 * Math.sin((t - WAVE0) * 11)] });
  const dragWalk = t => ({ ...walkT(t), armScale: 1.1, ikR: abs(...handleTop(t)) });
  const lookHold = t => ({ ...POSE.lookUp, ...hold()(t) });
  const dadHold = t => ({ armScale: 1.05, ikL: abs(...handleTop(t)), armR: [16, 10] });
  const signing = t => { const tp = penTip(t); return { lean: 4, tilt: 8, armScale: 1.2, ikL: abs(tp[0] + 10, tp[1] - 26), armR: [16, 10] }; };
  Object.assign(POSE, {
    a6_pDadPoint: { lean: 2, armL: [62, 4], armR: [16, 10] },
    a6_pDadPress: { lean: 5, armScale: 1.2, ikR: abs(BTN_D[0] - 4, BTN_D[1]), armL: [16, 10] },
    a6_pTerryPress: { lean: -5, tilt: -4, armScale: 1.3, ikL: abs(BTN_T[0] + 4, BTN_T[1]), armR: [16, 10] },
    a6_pDadAkimbo: { ...POSE.akimbo },
    a6_pShrink: { ...POSE.lookUp, tilt: -3, lean: -1, armL: [10, 30], armR: [10, 30] },
    a6_pFlinch: { ...POSE.lookUp, lean: -6, tilt: -12, armL: [44, 70], armR: [44, 70] },
  });
  const walkL = makeWalk(T_W2, T_W3, 5.4, { lean: 5 });
  const walkD = makeWalk(DAD0, DAD1, 5.2, { lean: -5 });
  const nod = t0 => [[t0, 1.05, 0.05], [t0 + 0.05, 1, 0.2, 'back']];

  defineScene({
    id: 'princeton', chapter: '去普林斯顿', dur: DUR, floor: FL,
    cast: { terry: { ...E6.teen, bag: true, bagFloor: [-700, FL] }, dad: E6.dad },
    order: ['dad', 'terry'],
    tracks: {
      terry: {
        enter: T_IN,
        pos: TPOS,
        bag: [[0, 1], [CUT1 + 0.26, 0, 0]],
        pose: [[0, hold()], [WAVE0, waveL, 0.12, 'back'], [WAVE1, hold(), 0.15], [T_W0, dragWalk, 0], [T_W1, hold(), 0.12], [LOOK, lookHold, 0.15, 'back'],
          [GRAB - 0.1, 'stand', 0.18],
          [CUT1 + 0.27, 'stand', 0], [SIGN0 - 0.2, signing, 0.15], [SIGN1 + 0.15, 'stand', 0.15],
          [CUT2 + 0.27, 'stand', 0], [PRESS_T - 0.22, 'a6_pTerryPress', 0.15, 'back'], [PRESS_T + 0.45, 'stand', 0.18], [PRESS_T + 0.6, 'kidCheer', 0.12, 'back'], [PRESS_T + 1.3, 'stand', 0.2],
          [T_W2, walkL, 0], [T_W3, 'stand', 0.1], [LOOKUP, 'lookUp', 0.15, 'back'], [SCARY, 'a6_pShrink', 0.12],
          [CUT4, 'stand', 0.2], [ROW2 + 0.5, 'kidCheer', 0.12, 'out'], [ROW2 + 1.6, 'stand', 0.2],
          [DROP + 0.1, 'lookUp', 0.12, 'back'], [THUMP + 0.05, 'a6_pFlinch', 0.08, 'back'], [THUMP + 0.9, 'lookUp', 0.25]],
        face: [[0, 'smile'], [WAVE0, 'grin', 0.06], [T_W0, 'smile', 0], [LOOK, 'idea', 0.05], [LOOK + 0.8, 'grin', 0.06], [DAD1, 'joy', 0.05], [GRAB + 0.6, 'grin', 0.06],
          [CUT1 + 0.27, 'smile', 0], [SIGN0 - 0.2, 'focus', 0.06], [SIGN1 + 0.15, 'grin', 0.06],
          [CUT2 + 0.27, 'smile', 0], [PRESS_D + 0.1, 'surprised', 0.05], [PRESS_D + 0.6, 'idea', 0.05], [PRESS_T - 0.2, 'focus', 0.05], [PRESS_T + 0.3, 'joy', 0.05],
          [CUT3 + 0.3, 'smile', 0], [LOOKUP, 'idea', 0.06], [TICK0, 'surprised', 0.05], [SCARY, 'sheepish', 0.06],
          [CUT4, 'neutral', 0.1], [CARD + 0.5, 'smile', 0.06], [ROW1 + 0.35, 'grin', 0.06], [ROW2 + 0.5, 'joy', 0.05], [ROW2 + 1.6, 'grin', 0.06],
          [DROP + 0.25, 'surprised', 0.05]],
        turn: [[0, -0.2], [T_W0, -0.5, 0], [T_W1, -0.35, 0.1], [CUT1 + 0.27, -0.4, 0], [CUT2 + 0.27, -0.4, 0], [CUT3 + 0.27, 0.45, 0], [T_W3, 0.3, 0.1], [DROP, 0.2, 0.1]],
        gaze: [[0, 'viewer'], [T_W0, [600, 520]], [LOOK, [420, 470]], [DAD1 - 0.3, 'dad'],
          [CUT1 + 0.27, [430, 556]], [POINT, 'dad'], [SIGN0 - 0.1, [425, 552]], [SIGN1 + 0.15, 'dad'],
          [CUT2 + 0.27, DOOR], [PRESS_D - 0.2, BTN_D], [PRESS_D + 0.15, DOOR], [PRESS_T - 0.3, BTN_T], [PRESS_T + 0.3, [520, 440]], [PRESS_T + 1.0, 'dad'],
          [T_W2, [800, 450]], [LOOKUP, [980, 330]], [TICK0, [870, 400]], [SCARY, 'viewer'],
          [CUT4, [930, 420]], [ROW1, [800, 410]], [ROW2, [800, 525]], [ROW2 + 0.5, 'viewer'], [DROP, [670, 230]]],
        squash: [[0, 1], ...nod(SIGN1 + 0.2), [PRESS_T + 0.6, 1.06, 0.05], [PRESS_T + 0.65, 1, 0.2, 'back'], [SCARY, 0.95, 0.12], [CUT4, 1, 0.2],
          [ROW2 + 0.5, 1.06, 0.05], [ROW2 + 0.55, 1, 0.2, 'back'], [LANDS, 0.88, 0.05], [LANDS + 0.05, 1, 0.25, 'back'], [THUMP + 0.05, 0.9, 0.05], [THUMP + 0.1, 1, 0.25, 'back']],
      },
      dad: {
        pos: [[0, [1820, FL]], [DAD0, [DX4, FL], DAD1 - DAD0, 'lin'], [CUT1 + 0.27, [BX_D, FL], 0], [CUT2 + 0.27, [WX_D, FL], 0], [CUT3 + 0.27, [-700, FL], 0]],
        pose: [[0, walkD], [DAD1, 'stand', 0.1], [GRAB, dadHold, 0.15, 'back'],
          [CUT1 + 0.27, 'stand', 0], [POINT, 'a6_pDadPoint', 0.12, 'back'], [SIGN1 + 0.15, 'stand', 0.15],
          [CUT2 + 0.27, 'stand', 0], [PRESS_D - 0.25, 'a6_pDadPress', 0.15, 'back'], [PRESS_D + 0.5, 'stand', 0.2], [PRESS_T + 0.45, 'a6_pDadAkimbo', 0.12, 'back']],
        face: [[0, 'smile'], [DAD1, 'grin', 0.06], [CUT1 + 0.27, 'smile', 0], [SIGN1 + 0.15, 'grin', 0.06], [CUT2 + 0.27, 'smile', 0], [PRESS_D - 0.2, 'focus', 0.05], [PRESS_D + 0.3, 'smile', 0.06], [PRESS_T + 0.4, 'laugh', 0.05]],
        turn: [[0, -0.5], [DAD1, -0.35, 0.1], [CUT1 + 0.27, -0.35, 0], [CUT2 + 0.27, 0.4, 0]],
        gaze: [[0, [900, 520]], [DAD1 - 0.2, 'terry'], [CUT1 + 0.27, [430, 552]], [SIGN1 + 0.15, 'terry'],
          [CUT2 + 0.27, BTN_D], [PRESS_D + 0.2, DOOR], [PRESS_T - 0.3, 'terry'], [PRESS_T + 0.3, [520, 440]]],
        squash: [[0, 1], ...nod(SIGN1 + 0.3), ...nod(PRESS_T + 0.5)],
      },
    },
    fx: [
      { type: 'ageStamp', age: 17, place: '1992 普林斯顿', t0: STAMP, ...E6.STAMP, dockT: DOCK, pulse: [] },
      { type: 'a6_pVis', id: 'a6pVis', chars: VIS },
      // L1 · his suitcase; L2 · the flight
      { type: 'a6_pCase', id: 'a6pCase' },
      { type: 'a6_pLayer', id: 'a6pMapL', t0: MAP, fo: MAP_OUT, paint: mapPaint, sfxAt: [[MAP, 'paper'], [MAP + 0.3, 'pop'], [TAKE, 'whoosh'], [LAND, 'thud']] },
      { type: 'a6_pNote', id: 'a6pN2', text: '（拿着奖学金）', at: [790, 548], rot: -3, t0: NOTE2, t1: MAP_OUT + 0.2 },
      // L3–L4 · the university; dad arrives and takes the suitcase
      { type: 'a6_pLayer', id: 'a6pUniL', t0: UNI, fo: CUT1, paint: uniPaint, sfxAt: [[UNI, 'paper'], [UNI_SIGN, 'pop']] },
      { type: 'label', id: 'a6pDadL', text: '爸爸', at: [1360, 262], target: { char: 'dad', part: 'headTop' }, gap: 18, bend: -0.25, t0: DADLBL, t1: CUT1 + 0.12 },
      // L5 · the bank, the washing machine
      { type: 'a6_pLayer', id: 'a6pBankL', t0: BANK, fo: CUT2, paint: bankPaint, sfxAt: [[BANK, 'paper'], [SIGN0, 'pen'], [SIGN0 + 0.35, 'pen']] },
      { type: 'a6_pLayer', id: 'a6pWashL', t0: WASH, fo: CUT3, paint: washPaint, sfxAt: [[WASH, 'paper'], [PRESS_D, 'beep'], [PRESS_D + 0.15, 'swish'], [PRESS_T, 'beep'], [PRESS_T + 0.2, 'boing'], [PRESS_T + 0.5, 'plip'], [PRESS_T + 0.8, 'plip']] },
      // L6–L7 · the name board
      { type: 'a6_pLayer', id: 'a6pBoardL', t0: LOBBY, fo: CUT4, paint: boardPaint, sfxAt: [[LOBBY, 'paper'], [BTITLE, 'pop'], ...LIT.map((_, i) => [TICK0 + i * TICKD, 'plip'])] },
      { type: 'a6_pNote', id: 'a6pN7', text: '（他后来回忆）', at: [400, 300], rot: -3, t0: RECALL, t1: CUT4 + 0.1 },
      { type: 'a6_pSweat', id: 'a6pSweat', t0: SCARY + 0.1, t1: CUT4 + 0.1 },
      // L8–L10 · no homework, no tests … only the generals
      { type: 'a6_pCard', id: 'a6pCard' },
      { type: 'a6_pSign', id: 'a6pSign' },
      { type: 'a6_pNote', id: 'a6pN10', text: '大家都怕它', at: [1270, 470], rot: -4, t0: FEAR, t1: DUR + 1 },
      { type: 'a6_pEnd', id: 'a6pEnd', f0: FADE0, fd: DUR - 0.05 - FADE0 },
    ],
    sfx: [[T_IN, 'pop'], [WAVE0, 'boop'], [GRAB, 'tap'], [LOOKUP, 'boop'], [SCARY, 'boing']],
    steps: [{ t0: T_W0, t1: T_W1, hz: 5.2 }, { t0: DAD0, t1: DAD1, hz: 5.2 }, { t0: T_W2, t1: T_W3, hz: 5.4 }],
    subs: [
      { t0: 0.3, t1: 4.3, text: '1992年秋天，十七岁的小陶，', say: '一九九二年秋天，十七岁的小陶，' },
      { t0: 4.4, t1: 7.8, text: '拿着奖学金，飞到了美国，' },
      { t0: 7.9, t1: 11.1, text: '去普林斯顿大学读博士。' },
      { t0: 11.7, t1: 15.1, text: '头几个星期，爸爸陪着他：' },
      { t0: 15.2, t1: 19.0, text: '教他开银行账户，自己洗衣服。' },
      { t0: 20.3, t1: 24.7, text: '第一天，他看着数学楼里的老师名单：' },
      { t0: 25.0, t1: 29.8, text: '“一半的名字我都听说过……有点吓人。”' },
      { t0: 30.5, t1: 35.3, text: '这里的研究生课，没有作业，也没有考试。' },
      { t0: 35.4, t1: 39.0, text: '只有一场大考，大家都怕它：' },
      { t0: 39.3, t1: 41.3, text: '资格口试。' },
    ],
  });
})();
