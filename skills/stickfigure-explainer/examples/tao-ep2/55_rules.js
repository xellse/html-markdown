// 写出有效过程的四个小窍门：四张卡片依次钉上板子，小问号一张一张检查。
// 第④张“写完读一遍”——小陶以前最不爱检查自己的作业（事实），这里他有点不好意思。
(() => {
  const FL = 780;
  const BD = { x0: 70, y0: 96, x1: 1530, y1: 500 };
  const CY0 = 124, CY1 = 468, CW = 320;
  const CX = [270, 630, 990, 1350];
  const PIN = [4.4, 8.2, 11.5, 16.1];           // cards pinned (with the narration)
  const CHK = [7.5, 10.9, 15.5, 28.0];          // 小问号's red ticks
  const TILT = [-1.6, 1.2, -1.0, 1.5];
  const QPOS = [270, 630, 990, 1200];

  /* ---------------- helpers ---------------- */
  const LAY = new Map();
  const lay = (str, size) => { const k = str + '|' + size; let L = LAY.get(k); if (!L) { L = layoutWriting({ text: str, x: 0, y: 0, size, t0: 0, speed: 1500, gap: 0.03, glyphGap: 0.03 }); LAY.set(k, L); } return L; };
  function ink(key, str, x, y, size, t0, t, o = {}) {
    if (t < t0) return;
    lay(str, size).strokes.forEach((s, i) => {
      const p = clamp((t - t0 - s.t0) / s.dur); if (p <= 0) return;
      stroke(key + '.' + i, s.pts.map(q => [q[0] + x, q[1] + y, q[2]]), { z: o.z ?? Z.board + 1, w: o.w || 6, color: o.color === 'red' ? C.red : C.ink, draw: p, boil: 0.55 });
    });
  }

  /* ---------------- the board ---------------- */
  SETDRAW.p2r_board = (s, p) => {
    const { x0, y0, x1, y1 } = BD, z = Z.set, st = i => stag(p, i, 3);
    stroke('p2r.bo', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 6, draw: st(0), fill: C.paper });
    stroke('p2r.bi', [[x0 + 14, y0 + 14], [x1 - 14, y0 + 14, 1], [x1 - 14, y1 - 14, 1], [x0 + 14, y1 - 14, 1], [x0 + 14, y0 + 14, 1]], { z: z + 0.1, w: 3, draw: st(1) });
    // cork speckles (pencil)
    for (let i = 0; i < 46; i++) {
      const h = hstr('p2r.sp' + i), x = lerp(x0 + 30, x1 - 30, (rnd(h, 1, 1) + 1) / 2), y = lerp(y0 + 30, y1 - 30, (rnd(h, 2, 2) + 1) / 2);
      stroke('p2r.sp' + i, [[x, y], [x + 5, y + 3]], { z: z + 0.1, w: 2.2, color: C.pencil, opacity: 0.55 * st(2), boil: 0.3 });
    }
    stroke('p2r.floor', [[20, FL], [800, FL + 2], [1580, FL - 1]], { z, w: 2.2, color: C.pencil, opacity: 0.8, draw: st(0) });
  };

  /* ---------------- doodles (card-local: origin = card centre) ---------------- */
  const DOODLE = [
    // ① a word under a magnifying glass
    (k, t, lt) => {
      const p = clamp(lt / 0.5), z = Z.board + 1;
      if (lt > 0.1) text(k + '.w', '奇数', -18, -8, { size: 40, z, opacity: clamp((lt - 0.1) / 0.2) });
      stroke(k + '.ul', [[-58, 22], [22, 20]], { z, w: 3, draw: clamp((lt - 0.3) / 0.3) });
      stroke(k + '.lens', ringPts(k + '.lens', -18, -6, 60, 60, { n: 14, closed: true }), { z, w: 5, closed: true, draw: p });
      stroke(k + '.h', [[26, 36], [70, 80]], { z, w: 11, draw: clamp((lt - 0.4) / 0.2) });
      stroke(k + '.gl', [[-50, -34], [-38, -46]], { z, w: 3, draw: clamp((lt - 0.5) / 0.2) });
    },
    // ② stairs, one thing per step
    (k, t, lt) => {
      const z = Z.board + 1;
      stroke(k + '.s', [[-90, 62], [-90, 34, 1], [-40, 34, 1], [-40, 4, 1], [10, 4, 1], [10, -26, 1], [60, -26, 1], [60, -56, 1], [100, -56, 1]], { z, w: 5, draw: clamp(lt / 0.6) });
      ['1', '2', '3'].forEach((d, i) => ink(k + '.n' + i, d, -72 + i * 50, 38 - i * 30 - 34, 26, 0.6 + i * 0.2, lt, { z, w: 3.5 }));
      arrow(k + '.a', [-78, -2], [70, -86], { p: EASE.out(clamp((lt - 1.2) / 0.4)), color: C.ink, bend: -0.25, w: 3.5, head: 14, z });
    },
    // ③ (the mini 小问号 is its own qm fx) — a speech tail "为什么？" under it
    () => {},
    // ④ eyes reading lines
    (k, t, lt) => {
      const z = Z.board + 1, p = clamp(lt / 0.4);
      const ph = (lt * 0.7) % 1, row = Math.floor(lt * 0.7) % 3, px = lerp(-9, 9, ph), py = -2 + row * 5;
      [-1, 1].forEach((s, i) => {
        stroke(k + '.e' + i, ringPts(k + '.e' + i, s * 28, -40, 24, 28, { n: 10, closed: true }), { z, w: 4.5, closed: true, fill: C.paper, draw: p });
        if (p > 0.8) dot(k + '.p' + i, [s * 28 + px, -40 + py], 8, C.ink, z + 0.1);
      });
      [14, 40, 66].forEach((y, j) => {
        const pts = []; for (let q = 0; q <= 8; q++) pts.push([lerp(-84, j === 2 ? 40 : 84, q / 8), y + (q % 2 ? -4 : 3)]);
        stroke(k + '.l' + j, pts, { z, w: 3, draw: clamp((lt - 0.3 - j * 0.15) / 0.3), boil: 0.6 });
      });
      if (lt > 1.2) stroke(k + '.rd', [[lerp(-84, 84, ph) - 16, 14 + row * 26 + 14], [lerp(-84, 84, ph) + 4, 14 + row * 26 + 14]], { z, w: 3.5 });
    },
  ];
  const CAP = [['把词说清楚'], ['一步一件事'], ['步步答', '“为什么”'], ['写完读一遍']];

  /** a card that flies in, gets pinned, then fills in: numeral, doodle, caption */
  COMP.p2r_card = {
    draw(fx, t) {
      const i = fx.i, lt = t - fx.t0; if (lt < 0) return;
      const cx = CX[i], cy = (CY0 + CY1) / 2, u = EASE.out(clamp(lt / 0.35));
      const pos = lerp2([cx + 220, 900], [cx, cy], u), rot = lerp(-24, TILT[i], u), sc = lerp(0.6, 1, u);
      DL.save(); DL.translate(pos[0], pos[1]); DL.rotate(rot); DL.scale(sc);
      const W = CW / 2, H = (CY1 - CY0) / 2, k = 'p2r.c' + i, z = Z.board;
      stroke(k, [[-W, -H], [W, -H, 1], [W, H, 1], [-W, H, 1], [-W, -H, 1]], { z, w: 5, fill: C.paper });
      stroke(k + '.sh', [[-W + 12, H + 8], [W + 7, H + 7, 1], [W + 7, -H + 12]], { z: z - 0.2, w: 2.4, color: C.pencil, opacity: 0.7, boil: 0.5 });
      // push-pin (ink)
      const pp = EASE.back(clamp((lt - 0.36) / 0.18));
      if (pp > 0) {
        DL.save(); DL.translate(0, -H + 18); DL.scale(pp);
        stroke(k + '.pin', ringPts(k + '.pin', 0, 0, 13, 13, { n: 9, closed: true }), { z: z + 2, w: 4, closed: true, fill: C.paper });
        dot(k + '.pd', [0, 0], 4.5, C.ink, z + 2.1);
        DL.restore();
      }
      ink(k + '.num', String(i + 1), -W + 26, -H + 26, 86, fx.t0 + 0.5, t, { w: 8 });
      DOODLE[i](k + '.d', t, lt - 0.75);
      const cl = CAP[i], cs = cl.length > 1 ? 42 : 48, n = Math.floor((lt - 1.1) * 9) + 1;
      if (n > 0) {
        let left = n;
        cl.forEach((line, j) => {
          const chars = [...line], m = Math.min(chars.length, left); left -= m; if (m <= 0) return;
          const y = cl.length > 1 ? H - 100 + j * 50 : H - 52;
          text(k + '.cap' + j, chars.slice(0, m).join(''), -textWidth(line, cs) / 2, y, { size: cs, anchor: 'start', z: z + 1 });
        });
      }
      DL.restore();
      // 小问号's red tick in the top-right corner
      if (t >= fx.chk) {
        const q = EASE.out(clamp((t - fx.chk) / 0.22)), x = cx + W - 44, y = CY0 + 60;
        stroke(k + '.ck', [[x - 26, y], [x - 8, y + 22, 1], [x + 30, y - 28]], { z: Z.annot, w: 6.5, color: C.red, draw: q });
      }
    },
    cues: fx => [[fx.t0, 'whoosh'], [fx.t0 + 0.36, 'tap'], [fx.t0 + 0.5, 'pen'], [fx.t0 + 0.8, 'pen'], [fx.t0 + 1.1, 'pen'], [fx.t0 + 1.4, 'pen'], [fx.chk, 'pen'], [fx.chk + 0.02, 'plip']],
  };

  /* ---------------- 小问号's walk from card to card ---------------- */
  const MOVES = [[1.0, -90, QPOS[0], 1.4], [8.2, QPOS[0], QPOS[1], 0.9], [11.5, QPOS[1], QPOS[2], 0.9], [16.1, QPOS[2], QPOS[3], 0.9]];
  const qpos = t => {
    let x = -90;
    MOVES.forEach(([t0, a, b, d]) => { if (t >= t0) x = lerp(a, b, EASE.io(clamp((t - t0) / d))); });
    return [x, FL];
  };
  const qAct = [[0, 'idle']];
  MOVES.forEach(([t0, , , d]) => { qAct.push([t0, 'hop'], [t0 + d, 'idle']); });
  CHK.slice(0, 3).forEach(c => { qAct.push([c, 'nod'], [c + 0.9, 'idle']); });
  qAct.push([24.0, 'hop'], [24.9, 'idle'], [28.0, 'nod'], [28.9, 'hop'], [29.8, 'idle']);
  qAct.sort((a, b) => a[0] - b[0]);
  const cardHi = i => [CX[i], 300];

  Object.assign(POSE, {
    p2r_sheepish: { tilt: 9, armScale: 1.7, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 1.02, dy: -0.35, bend: 'out' } },
    p2r_read: { tilt: -6, lean: -2, armScale: 1.5, ikL: { w: 1, to: 'hip', dx: -26, dy: -4, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 0.7, dy: 1.05, bend: 'down' } },
  });
  Object.assign(FACE, {
    p2r_guilty: { lidL: 0.36, lidR: 0.36, brow: 'line', browL: -18, browR: -18, mouth: 'wavy', mw: 0.3 },
    p2r_shy: { lidL: 0.2, lidR: 0.2, brow: 'line', browL: -12, browR: -12, mouth: 'smile', mw: 0.3 },
  });
  /** one sweat drop by the guilty face (ink) */
  COMP.p2r_drop = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors.terry; if (!a) return;
      const u = ((t - fx.t0) * 0.8) % 1, c = [a.head[0] - a.r - 14, a.head[1] - a.r * 0.3 + u * 26], o = Math.sin(Math.PI * u);
      stroke('p2r.drop', [[c[0], c[1] - 18], [c[0] + 10, c[1] + 2], [c[0], c[1] + 10], [c[0] - 10, c[1] + 2], [c[0], c[1] - 18]], { z: Z.fx, w: 3.4, fill: C.paper, opacity: o });
    },
  };
  // Terry reads card ④ through: his gaze runs along its lines
  const readGaze = t => { const u = (t - 25.2) * 0.9, row = Math.floor(u) % 3; return [CX[3] - 80 + 160 * (u % 1), 300 + row * 26]; };

  defineScene({
    id: 'rules', dur: 30.2, floor: FL,
    cast: {
      terry: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 17.3,
        pos: [[0, [1720, FL]], [17.3, [1455, FL], 1.0, 'lin']],
        pose: [[0, makeWalk(17.3, 18.3, 5.2)], [18.3, 'stand', 0.12], [19.4, 'p2r_sheepish', 0.25], [25.2, 'p2r_read', 0.3], [27.8, 'stand', 0.25]],
        face: [[0, 'neutral'], [18.4, 'focus', 0.1], [19.4, 'p2r_guilty', 0.12], [24.1, 'p2r_shy', 0.15], [25.2, 'focus', 0.12], [27.8, 'smile', 0.1], [28.3, 'joy', 0.1]],
        turn: [[0, -0.6], [18.3, -0.35, 0.12], [19.4, 0.2, 0.2], [24.1, -0.4, 0.2]],
        gaze: [[0, [1200, 700]], [18.3, 'card4'], [19.4, [1560, 700]], [24.1, 'qmHead'], [25.2, readGaze], [27.8, 'viewer']],
        squash: [[0, 1], [19.4, 1.06, 0.05], [19.45, 1, 0.2, 'back'], [28.3, 1.06, 0.05], [28.35, 1, 0.2, 'back']],
      },
    },
    targets: F => ({ card4: cardHi(3), qmHead: F.anchors.qm ? F.anchors.qm.head : [QPOS[3], 620] }),
    steps: [{ t0: 17.3, t1: 18.3, hz: 5.2 }],
    set: [{ type: 'p2r_board', t0: 0.05 }],
    fx: [
      { type: 'p2r_title', id: 'p2r.title' },
      ...PIN.map((t0, i) => ({ type: 'p2r_card', id: 'p2r.card' + i, i, t0, chk: CHK[i] })),
      { type: 'qm', id: 'p2r.mini', size: 92, t0: PIN[2] + 0.8, pos: [[0, [CX[2] + 14, 338]]], blink: 1.9, z: Z.board + 1.5, silent: true,
        mood: [[0, 'neutral'], [12.4, 'happy']], act: [[0, 'idle'], [12.5, 'wave'], [13.9, 'idle']], gaze: [[0, 'viewer'], [12.4, [CX[2], 700]], [13.9, 'viewer']] },
      { type: 'qm', id: 'qm', size: 185, t0: 0.9, burst: false, pos: [[0, qpos]], hopHz: 2.2, act: qAct,
        mood: [[0, 'happy'], [3.0, 'neutral'], ...CHK.slice(0, 3).flatMap(c => [[c, 'happy'], [c + 1.2, 'neutral']]), [12.4, 'happy'], [13.9, 'neutral'],
          [19.4, 'surprised'], [20.4, 'neutral'], [24.0, 'happy']],
        gaze: [[0, 'viewer'], [2.4, cardHi(0)], [8.2, cardHi(1)], [11.5, cardHi(2)], [12.4, [CX[2] + 14, 290]], [13.9, cardHi(2)], [16.1, cardHi(3)],
          [19.4, 'terry'], [21.4, cardHi(3)], [24.0, 'terry'], [26.5, cardHi(3)], [28.9, 'viewer']],
        sfxAt: [[1.0, 'boop'], ...MOVES.flatMap(([t0, , , d]) => [0, 1, 2].filter(n => (n + 0.5) / 2.2 < d).map(n => [t0 + (n + 0.5) / 2.2, 'hop'])), [24.2, 'hop'], [24.65, 'hop'], [29.1, 'hop']] },
      { type: 'label', id: 'p2r.lbHate', text: '以前最不爱做的一步', at: [850, 578], rot: -3, t0: 19.9, t1: 24.0, target: [CX[3] - 150, CY1 - 30], bend: -0.2, gap: 12 },
      { type: 'p2r_drop', id: 'p2r.drop', t0: 19.6, t1: 24.1 },
    ],
    sfx: [[0.05, 'swish'], [19.4, 'boing'], [28.3, 'ding'], [17.3, 'pop']],
    subs: [
      { t0: 0.3, t1: 4.3, text: '写出有效过程，有四个小窍门：' },
      { t0: 4.4, t1: 8.1, text: '一，先把用到的词说清楚。' },
      { t0: 8.2, t1: 11.4, text: '二，一步只做一件事。' },
      { t0: 11.5, t1: 16.0, text: '三，每一步都能回答“为什么”。' },
      { t0: 16.1, t1: 19.3, text: '四，写完从头读一遍——' },
      { t0: 19.4, t1: 23.7, text: '这是小陶以前最不爱做的一步。' },
    ],
  });
  /** the heading, written in */
  COMP.p2r_title = {
    draw(fx, t) {
      const str = '写出有效过程的四个小窍门', n = Math.min(12, Math.floor((t - 0.4) * 9) + 1); if (n <= 0) return;
      text('p2r.tt', [...str].slice(0, n).join(''), 800 - textWidth(str, 50) / 2, 56, { size: 50, anchor: 'start', z: Z.annot });
    },
    cues: () => [0, 2, 4, 6, 8, 10].map(i => [0.4 + i / 9, 'pen']),
  };
})();
