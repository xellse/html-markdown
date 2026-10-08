// 开场：一张地图——接陶哲轩第 6 集：书桌前的 Jasper；小问号从《数学少年陶哲轩》书上跳到他的练习本上；
// 本子放大出一行行算式（最后一行 16 − 9 = 7）；"算对了，然后呢？"；翻页切到全局地图：两扇门、五级台阶、雾；先走第一步。
(() => {
  const FL = N1.FL;
  const FADE = (f0, inner, fd = 0.4) => ({ type: 'n1_fade', f0, fd, inner });
  const OUT = 22.5;            // book/desk/notebook/Jasper fade before the page turn (L7.t0 − 0.4)
  const MAP0 = 22.9, DUR = 64.8, END = DUR - 0.6;

  // ---- poses: Jasper stands at the right of the desk, writing on the open notebook (his left hand on the page)
  Object.assign(POSE, {
    a1_write: { lean: -3, tilt: -2, armScale: 1.6, armR: [12, 10], ikL: { w: 1, to: 'desk', dx: 0, dy: 0, bend: 'down' } },
    a1_look: { lean: -1, tilt: -9, armScale: 1.6, armR: [14, 12], ikL: { w: 1, to: 'desk', dx: -4, dy: 0, bend: 'down' } },
  });
  const a1_scribble = t => ({ ...POSE.a1_write, ikL: { w: 1, to: 'desk', dx: 7 * Math.sin(t * 12), dy: 3 * Math.sin(t * 19), bend: 'down' } });

  // ---- fade a character out (characters have no t1): scale the opacity of everything keyed "<char>."
  COMP.a1_charFade = {
    draw(fx, t) {
      const k = clamp((t - fx.f0) / fx.fd); if (k <= 0) return;
      const pre = fx.char + '.';
      for (const it of DL.items) if (it.key.startsWith(pre)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * (1 - k)).toFixed(3);
    },
  };

  // ---- the page turn: a sheet of paper sweeps right → left over the old picture (the map is drawn on the new page)
  COMP.a1_flip = {
    draw(fx, t) {
      const u = (t - fx.t0) / fx.dur; if (u <= 0 || u >= 1) return;
      const e = EASE.io(u), k = fx.id;
      const X = y => lerp(1760, -260, e) + (y - 400) * 0.22 + 30 * Math.sin(y / 795 * Math.PI);
      const edge = [0, 100, 200, 300, 400, 500, 600, 700, 795].map(y => [X(y), y]);
      stroke(k + '.sheet', [...edge, [1720, 795, 1], [1720, 0, 1], [X(0), 0, 1]], { z: 55, fill: C.paper, noStroke: true, w: 1, boil: 0 });
      stroke(k + '.sh', edge.map(([x, y]) => [x - 16, y]), { z: 55.1, w: 3, color: C.pencil, opacity: 0.6 });
      stroke(k + '.edge', edge, { z: 55.2, w: 4.5 });
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  // ---- the finished Tao book, standing on the floor; a red "完" stamp lands on it (local origin = cover centre)
  PROPS.a1_book = (fx, t, lt, p) => {
    const k = fx.id, w = 250, h = 310, z = Z.desk;
    stroke(k + '.c', [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z, w: 5, fill: C.paper, draw: p });
    stroke(k + '.sp', [[-w / 2 + 22, -h / 2 + 4], [-w / 2 + 22, h / 2 - 4]], { z, w: 3.5, draw: clamp(p * 2 - 0.6) });
    const tp = clamp(p * 2.5 - 1.2);
    text(k + '.t1', '数学少年', 12, -100, { size: 46, z: z + 0.3, opacity: tp });
    text(k + '.t2', '陶哲轩', 12, -46, { size: 46, z: z + 0.3, opacity: tp });
    if (p > 0.7) portrait(k + '.pt', -8, 58, 40, { z: z + 0.3, happy: true });
    shadow(k + '.sh', 0, h / 2 + 4, w + 30, p);
    const sl = lt - fx.stampAt; if (sl < 0) return;
    const sp = EASE.back(clamp(sl / 0.22)), sc = lerp(1.8, 1, sp);
    DL.save(); DL.translate(70, 108); DL.rotate(-14); DL.scale(sc);
    stroke(k + '.st', ringPts(k + '.st', 0, 0, 36, 36, { n: 14, a0: -110, sweep: 372 }), { z: z + 0.6, w: 5.5, color: C.red, opacity: clamp(sl / 0.1) });
    text(k + '.stt', '完', 0, 2, { size: 44, color: C.red, z: z + 0.6, opacity: clamp(sl / 0.1) });
    DL.restore();
  };

  // ---- Jasper's open exercise book on the desk (beside the shared desk's closed "Jasper" book)
  PROPS.a1_nb = (fx, t, lt, p) => {
    const k = fx.id, z = Z.desk + 0.4;
    stroke(k + '.l', [[1206, 638], [1214, 603, 1], [1276, 600, 1], [1277, 638, 1], [1206, 638, 1]], { z, w: 4, fill: C.paper, draw: p });
    stroke(k + '.r', [[1277, 638], [1276, 600, 1], [1337, 603, 1], [1346, 638, 1], [1277, 638, 1]], { z, w: 4, fill: C.paper, draw: p });
    for (let i = 0; i < 3; i++) {
      stroke(`${k}.a${i}`, [[1222 + i * 1.5, 612 + i * 8], [1262, 611 + i * 8]], { z: z + 0.1, w: 2.5, color: C.pencil, draw: p });
      stroke(`${k}.b${i}`, [[1288, 612 + i * 8], [1328 + i * 2, 613 + i * 8]], { z: z + 0.1, w: 2.5, color: C.pencil, draw: p });
    }
  };

  // ---- the zoomed-in page: a sheet of exercise paper with a callout tail pointing at the open book
  PROPS.a1_page = (fx, t, lt, p) => {
    const k = fx.id, z = 13;
    stroke(k + '.o', [[360, 112], [1110, 112, 1], [1110, 448, 1], [1204, 604, 1], [1110, 528, 1], [1110, 556, 1], [360, 556, 1], [360, 112, 1]], { z, w: 4.5, fill: C.paper, draw: p });
    for (let i = 0; i < 5; i++) stroke(`${k}.r${i}`, [[386, 208 + i * 78], [1086, 208 + i * 78]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.6, draw: clamp(p * 2 - 0.8 - i * 0.1) });
  };

  // ---- a small pop-up card above a door (local origin = card centre; tail tip at [0, h/2 + tail])
  PROPS.a1_card = (fx, t, lt, p) => {
    const k = fx.id, w = fx.w, h = fx.h, tl = fx.tail || 26, z = 13;
    stroke(k + '.c', [[-w / 2, -h / 2], [w / 2, -h / 2, 1], [w / 2, h / 2, 1], [16, h / 2, 1], [0, h / 2 + tl, 1], [-16, h / 2, 1], [-w / 2, h / 2, 1], [-w / 2, -h / 2, 1]], { z, w: 4, fill: C.paper, draw: p });
  };

  // ---- 7 dots in a row → circled in pairs → the one left over turns red and wiggles
  COMP.a1_seven = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const k = fx.id, g = fx.gap;
      for (let i = 0; i < 7; i++) {
        const u = EASE.back(clamp((t - fx.t0 - i * 0.07) / 0.22)); if (u <= 0) continue;
        let x = fx.x + i * g, y = fx.y, col = C.ink, r = 10 * u;
        if (i === 6 && t >= fx.oddT) {
          const w = t - fx.oddT, d = Math.max(0, 1 - w / 1.6);
          col = C.red; r = 11; x += 7 * Math.sin(w * 20) * d; y -= Math.abs(Math.sin(w * 10)) * 10 * d;
        }
        dot(`${k}.d${i}`, [x, y], r, col, Z.front);
      }
      fx.pairT.forEach((pt, j) => {
        const u = clamp((t - pt) / 0.3); if (u <= 0) return;
        const cx = fx.x + (2 * j + 0.5) * g;
        stroke(`${k}.p${j}`, ringPts(`${k}.pr${j}`, cx, fx.y, g * 0.5 + 18, 23, { n: 14 }), { z: Z.annot, w: 4, color: C.red, draw: u });
      });
    },
    cues: fx => [[fx.t0, 'pop'], ...fx.pairT.map(tt => [tt, 'pen']), [fx.oddT, 'boing']],
  };

  // ---- the whole staircase flashes once (yellow, drawn up the steps, then fades)
  const STEP = i => [520 + 112 * i + 56, 700 - 92 * i - 6];   // = n1_map's step<i> named point
  COMP.a1_stairFlash = {
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0 || lt > 1.6) return;
      const pts = [[474, 700]];
      for (let i = 0; i < 5; i++) { pts.push([632 + 112 * i, 700 - 92 * i, 1]); if (i < 4) pts.push([632 + 112 * i, 608 - 92 * i, 1]); }
      stroke(fx.id, pts, { z: Z.hi, w: 22, color: C.hi, draw: EASE.out(clamp(lt / 0.6)), opacity: 0.85 * (1 - clamp((lt - 1.1) / 0.5)), boil: 0.3 });
    },
    cues: fx => [[fx.t0, 'zip']],
  };

  // ---- L16 "先走第一步": the questions further up recede (map labels 1–4 dim), leaving step 0 and "有没有？"
  COMP.a1_dimSteps = {
    draw(fx, t) {
      const u = clamp((t - fx.t0) / fx.dur); if (u <= 0) return;
      const k = 1 - u * (1 - fx.to), keys = fx.steps.map(i => `${fx.map}.st${i}.q`);
      for (const it of DL.items) if (keys.includes(it.key)) it.attrs.opacity = +((it.attrs.opacity ?? 1) * k).toFixed(3);
    },
  };

  // ---- the signposts in the fog show through for a moment
  COMP.a1_postFlash = {
    draw(fx, t) {
      for (let q = 0; q < 3; q++) {
        const lt = t - fx.t0 - q * 0.12; if (lt < 0 || lt > 1.3) continue;
        const o = Math.sin(Math.PI * lt / 1.3), cx = 1150 + q * 95, cy = 175 + (q % 2) * 40;
        stroke(`${fx.id}.b${q}`, [[cx - 38, cy - 34], [cx + 38, cy - 34, 1], [cx + 38, cy - 4, 1], [cx - 38, cy - 4, 1], [cx - 38, cy - 34, 1]], { z: Z.set + 3, w: 4, opacity: 0.9 * o });
        stroke(`${fx.id}.p${q}`, [[cx, cy - 4], [cx, cy + 70]], { z: Z.set + 3, w: 4, opacity: 0.9 * o });
      }
    },
    cues: fx => [[fx.t0, 'plip']],
  };

  // ---- the little question mark's path: a chain of hops [t0, t1, from, to, height]
  const BOOK = [325, 470], FLOOR = [780, 778], NB = [1285, 618], MAPR = [1140, 752], FOOT = [440, 752];
  const HOPS = [
    [7.85, 8.45, BOOK, FLOOR, 150], [8.55, 9.25, FLOOR, NB, 200],                     // L3: book → floor → notebook
    [22.95, 23.35, NB, MAPR, 60], [23.45, 24.15, MAPR, FOOT, 400],                     // L7: down onto the map, over the stairs
    [44.25, 44.6, FOOT, STEP(0), 70], [45.35, 45.67, STEP(0), STEP(1), 60], [46.4, 46.72, STEP(1), STEP(2), 60],   // L12
    [48.65, 48.98, STEP(2), STEP(3), 60], [50.15, 50.5, STEP(3), STEP(4), 60],          // L13
    [61.25, 62.0, STEP(4), STEP(0), 180],                                               // L16: one big leap back to the first step
  ];
  const a1_qmPos = t => {
    let p = BOOK;
    for (const [t0, t1, a, b, h] of HOPS) {
      if (t < t0) break;
      if (t >= t1) { p = b; continue; }
      const u = (t - t0) / (t1 - t0);
      return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 4 * h * u * (1 - u)];
    }
    return p;
  };

  // ---- the page of sums (four-digit + − × ÷, then 16 − 9 = 7); every line checked: see the comments
  const SUMS = [
    ['2468 + 1357 = 3825', 11.75],   // 2468 + 1357 = 3825
    ['5000 − 1234 = 3766', 12.2],    // 5000 − 1234 = 3766
    ['1250 × 4 = 5000', 12.65],      // 1250 × 4 = 5000
    ['8100 ÷ 9 = 900', 13.1],        // 9 × 900 = 8100
    ['16 − 9 = 7', 13.55],           // 16 − 9 = 7
  ];
  const SX = 430, SY = i => 150 + i * 78, SS = 46;
  const sumFx = SUMS.map(([txt, t0], i) => FADE(OUT, i < 4
    ? { type: 'write', id: `a1_s${i}`, text: txt, x: SX, y: SY(i), size: SS, t0, speed: 4200, gap: 0.015, glyphGap: 0.012, z: 14, silent: true }
    : { type: 'write', id: `a1_s${i}`, text: txt, x: SX, y: SY(i), size: SS, t0, speed: 2600, z: 14, sfx: 'pen' }));
  const tickFx = SUMS.map(([txt], i) => FADE(OUT,
    { type: 'write', id: `a1_ok${i}`, text: '✓', x: SX + writeWidth(txt, SS) + 34, y: SY(i) + 2, size: 42, t0: 15.45 + i * 0.13, speed: 3000, color: 'red', z: 14, sfx: 'pen' }));

  defineScene({
    id: 'open', chapter: '开场：一张地图', dur: DUR, floor: FL,
    cast: { kid: { ...N1.kid, desk: [1335, 627] } },
    tracks: {
      kid: {
        pos: [[0, [1455, FL]], [MAP0 + 0.05, [2400, FL], 0]],
        pose: [[0, a1_scribble], [14.5, 'a1_write', 0.12], [18.45, 'a1_look', 0.12, 'back']],
        face: [[0, 'focus'], [18.45, 'idea', 0.06], [19.5, 'grin', 0.08]],
        turn: [[0, -0.35]],
        gaze: [[0, [1330, 628]], [18.45, [1285, 500]]],
      },
    },
    fx: [
      // the map (drawn on the new page after the turn); doors, step questions, first step lit
      { type: 'n1_map', id: 'a1_map', t0: MAP0, t1: END,
        // keys written [t, 0, on]: n1_map's last() reads the 3rd field as the value (with [t, on] a door never goes dark again)
        doorL: [[28.9, 0, 1], [35.04, 0, 0]], doorR: [[29.25, 0, 1], [30.95, 0, 0], [35.24, 0, 1], [39.3, 0, 0]],
        steps: [[44.6, 0], [45.67, 1], [46.72, 2], [48.98, 3], [50.5, 4]], lit: [[62.0, 0]] },
      { type: 'a1_dimSteps', map: 'a1_map', steps: [1, 2, 3, 4], t0: 61.1, dur: 0.4, to: 0.12 },
      FADE(END, { type: 'title', id: 'a1_nt', text: '数论', x: 800, y: 66, size: 84, t0: 24.75, rot: -2 }),
      // L9: factor door — 6 = 2 × 3 as a 2-by-3 block of dots
      FADE(39.3, { type: 'prop', id: 'a1_cL', kind: 'a1_card', at: [340, 212], w: 420, h: 128, tail: 30, t0: 31.35, drawDur: 0.3 }),
      { type: 'n1_dots', id: 'a1_d6', x: 172, y: 190, N: 3, rows: 2, gap: 44, t0: 31.55, t1: 39.3 },
      FADE(39.3, { type: 'write', id: 'a1_w6', text: '6 = 2 × 3', x: 300, y: 188, size: 46, t0: 32.7, speed: 2600, z: 15 }),
      // L10: remainder door — 7 dots in pairs, one left over
      FADE(39.3, { type: 'prop', id: 'a1_cR', kind: 'a1_card', at: [1300, 206], w: 330, h: 116, tail: 30, t0: 35.15, drawDur: 0.3 }),
      FADE(39.3, { type: 'a1_seven', id: 'a1_7', x: 1180, y: 206, gap: 40, t0: 35.3, pairT: [35.95, 36.15, 36.35], oddT: 36.8 }),
      // L11: the staircase flashes; L14: the signposts in the fog; L15: "更大的家"
      { type: 'a1_stairFlash', id: 'a1_sf', t0: 40.85 },
      { type: 'a1_postFlash', id: 'a1_pf', t0: 53.4 },
      FADE(60.7, { type: 'label', id: 'a1_home', text: '更大的家', at: [1160, 300], target: [1238, 200], t0: 58.1, t1: 99, bend: -0.25 }, 0.3),

      // ---- the desk scene (fades out under the page turn at OUT)
      { type: 'n1_desk', id: 'a1_desk', at: [1180, 640], t0: -1, t1: OUT },
      FADE(OUT, { type: 'prop', id: 'a1_nb', kind: 'a1_nb', at: [0, 0], t0: -1, drawDur: 0 }),
      FADE(9.7, { type: 'prop', id: 'a1_book', kind: 'a1_book', at: [325, 625], t0: 0.3, drawDur: 0.5, stampAt: 1.45, sfxAt: [[0.3, 'pen'], [1.75, 'stamp']] }),
      FADE(OUT, { type: 'prop', id: 'a1_pg', kind: 'a1_page', at: [0, 0], t0: 11.5, drawDur: 0.35, sfxAt: [[11.5, 'paper']] }),
      ...sumFx, ...tickFx,
      { type: 'mark', id: 'a1_bang', char: '!', on: ['kid'], t0: 18.5, t1: 20.3, dx: 6 },
      { type: 'a1_charFade', char: 'kid', f0: OUT, fd: 0.4 },
      { type: 'a1_flip', id: 'a1_flip', t0: 22.45, dur: 0.45 },

      // ---- the little question mark (above the turning page: z 56)
      FADE(END, { type: 'qm', id: 'qm', size: 130, z: 56, t0: 4.0, burst: true, signSize: 58,
        pos: [[0, a1_qmPos]],
        mood: [[0, 'happy'], [9.3, 'neutral'], [18.4, 'happy'], [MAP0, 'neutral'], [53.3, 'surprised'], [56.9, 'neutral'], [62.0, 'happy']],
        act: [[0, 'idle'], [4.35, 'hop'], [7.6, 'idle'], [15.4, 'nod'], [16.2, 'idle'], [19.4, 'hop'], [21.5, 'idle'], [62.05, 'hop']],
        sign: [[0, null], [4.5, '为什么？'], [7.6, null], [16.4, '然后呢？'], [18.3, null],
          [44.2, '有没有？'], [45.35, '怎么造？'], [46.4, '找得全吗？'], [48.62, '为什么不可能？'], [50.15, '有无穷多个吗？'], [52.55, null]],
        gaze: [[0, 'viewer'], [9.3, [1300, 625]], [11.6, [740, 330]], [15.3, 'viewer'], [18.4, [1450, 590]], [MAP0, 'viewer'],
          [28.7, 'a1_map.doorL'], [29.25, 'a1_map.doorR'], [31.25, 'a1_map.doorL'], [35.04, 'a1_map.doorR'], [39.4, [1024, 300]],
          [44.2, 'viewer'], [53.3, [1250, 170]], [55.0, 'viewer'], [57.0, [1250, 170]], [61.2, 'viewer']] }),
    ],
    sfx: [[7.85, 'hop'], [8.55, 'hop'], [9.25, 'plip'], [22.95, 'hop'], [23.45, 'boing'],
      [44.25, 'hop'], [45.35, 'hop'], [46.4, 'hop'], [48.65, 'hop'], [50.15, 'hop'], [61.25, 'whoosh'], [62.0, 'ding']],
    subs: [
      { t0: 0.3, t1: 3.35, text: '陶哲轩的故事讲完了。' },   // L1
      { t0: 3.75, t1: 7.6, text: '那个爱问“为什么”的小问号，' },   // L2
      { t0: 7.7, t1: 11.15, text: '跳到了Jasper的练习本上。' },   // L3
      { t0: 11.85, t1: 14.9, text: 'Jasper每天都在算题。' },   // L4
      { t0: 15.3, t1: 17.95, text: '“算对了，然后呢？”', voice: 'qm', say: '算对了，然后呢？' },   // L5
      { t0: 18.35, t1: 22.0, text: '然后，就可以开始问问题了。' },   // L6
      { t0: 22.9, t1: 27.75, text: '整数的这些问题，叫数论，像一张大地图。' },   // L7
      { t0: 28.25, t1: 30.95, text: '地图上有两扇门：' },   // L8
      { t0: 31.25, t1: 34.74, text: '一扇看一个数是谁乘谁，' },   // L9
      { t0: 35.04, t1: 38.69, text: '一扇看分组以后，还剩几个。' },   // L10
      { t0: 39.39, t1: 43.84, text: '两扇门中间，是一级比一级难的问题：' },   // L11
      { t0: 44.14, t1: 48.42, text: '“有没有？怎么造？找得全吗？”', voice: 'qm', say: '有没有？怎么造？找得全吗？' },   // L12
      { t0: 48.62, t1: 52.47, text: '“为什么不可能？有无穷多个吗？”', voice: 'qm', say: '为什么不可能？有无穷多个吗？' },   // L13
      { t0: 53.07, t1: 56.73, text: '远处有雾。我们只问整数，' },   // L14
      { t0: 56.93, t1: 60.78, text: '可整数会逼我们去找更大的家。' },   // L15
      { t0: 61.08, t1: 63.33, text: '先走第一步。' },   // L16
    ],
  });
})();
