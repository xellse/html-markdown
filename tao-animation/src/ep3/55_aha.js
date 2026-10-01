// 第 55 场 · 啊哈！：一块骨牌盖住一黑一白；数一数：黑 6 白 8；6 块骨牌用光 6 个黑格，剩下两个白格永远不挨着。
// 小陶跳起来，大灯泡“叮”！这一声叮不是从天上掉下来的：9 次失败 → 一个好问题 → 换个看法 → 叮！
// 开场画面接第 50 场结尾：主棋盘在 E3B.MAIN，剪过角、涂过色，摆着 E3B.TRIES[8]，(2,3)(3,2) 两个白格被圈着；小陶在右边，表情 idea。
(() => {
  const FL = 780, TX = 1180, CELL = E3B.MAIN.cell, N = 4;
  const B0 = E3B.MAIN.at, B1 = [720, 420];                 // the board slides right to make room for the tally
  const SLIDE = 9.85, EXIT = 25.6;                         // board: slide right / slide off to the left
  const BPOS = [[0, B0], [SLIDE, B1, 0.45, 'io'], [EXIT, [-470, 420], 0.5, 'in']];
  const TRY = E3B.TRIES[8];
  const DOM = [1, 0, 'h'];                                  // the domino we look at: (1,0) white + (1,1) black
  const J0 = 22.55, J1 = 23.15, JH = 96;                    // the big jump (take-off, landing, height)
  const H0 = 23.95, H1 = 24.3;                              // a second, smaller bounce

  /* ---------------- the facts, checked ---------------- */
  const left = E3B.cells(N, true);
  const BLK = left.filter(([r, c]) => E3B.black(r, c));    // reading order: the order we count in
  const WHT = left.filter(([r, c]) => !E3B.black(r, c));
  const covered = new Set(TRY.flatMap(d => E3B.domCells(d).map(([r, c]) => r + '_' + c)));
  const LEFT = WHT.filter(([r, c]) => !covered.has(r + '_' + c));
  if (BLK.length !== 6 || WHT.length !== 8) console.error('a3_aha: expected 6 black + 8 white, got', BLK.length, WHT.length);
  if (TRY.some(d => { const [p, q] = E3B.domCells(d); return E3B.black(...p) === E3B.black(...q); })) console.error('a3_aha: a domino is not black+white');
  if (LEFT.length !== 2 || LEFT.map(x => x.join(',')).join(' ') !== '2,3 3,2') console.error('a3_aha: TRIES[8] should leave (2,3) (3,2)', LEFT);
  if (!TRY.some(d => d.join() === DOM.join())) console.error('a3_aha: DOM is not in TRIES[8]');
  if (6 - 6 !== 0 || 8 - 6 !== 2) console.error('a3_aha: arithmetic');

  const boardAt = t => evalTrack(BPOS, t);
  const cellAt = (t, r, c) => { const p = boardAt(t); return [p[0] + (c - (N - 1) / 2) * CELL, p[1] + (r - (N - 1) / 2) * CELL]; };

  /* ---------------- L1–L3: one domino, blown up: two neighbours = one black + one white ---------------- */
  const ZC = [218, 316], ZS = 140;                           // the enlarged domino (left panel)
  const ZT = { lines: 3.45, cells: 3.55, dom: 4.3, hatch: 6.95 };
  COMP.a3_zoomDom = {
    draw(fx, t) {
      if (t < ZT.lines || t >= fx.t1) return;
      const z = Z.set + 2, x0 = ZC[0] - ZS, y0 = ZC[1] - ZS / 2;
      // pencil zoom lines from the real domino on the board
      const d0 = cellAt(t, 1, 0), dl = [d0[0] - CELL / 2, d0[1] - CELL / 2], db = [d0[0] - CELL / 2, d0[1] + CELL / 2];
      const pl = EASE.out(clamp((t - ZT.lines) / 0.3));
      stroke('a3zd.z0', [dl, [x0 + 2 * ZS + 6, y0 - 4]], { z, w: 2.2, color: C.pencil, draw: pl, boil: 0.5 });
      stroke('a3zd.z1', [db, [x0 + 2 * ZS + 6, y0 + ZS + 4]], { z, w: 2.2, color: C.pencil, draw: pl, boil: 0.5 });
      // the two squares (left white, right black), sharing the middle edge
      const pc = EASE.out(clamp((t - ZT.cells) / 0.4));
      stroke('a3zd.box', [[x0, y0], [x0 + 2 * ZS, y0, 1], [x0 + 2 * ZS, y0 + ZS, 1], [x0, y0 + ZS, 1], [x0, y0, 1]], { z: z + 0.3, w: 6, draw: pc, fill: C.paper });
      stroke('a3zd.mid', [[x0 + ZS, y0], [x0 + ZS, y0 + ZS]], { z: z + 0.3, w: 4, draw: clamp(pc * 2 - 1) });
      const hu = clamp((t - ZT.hatch) / 0.5);
      if (hu > 0) hatch('a3zd.h', x0 + ZS, y0, ZS, z + 0.4, hu, 1, 1.3);
      // the domino drops on and covers both
      const du = clamp((t - ZT.dom) / 0.22);
      if (du > 0) {
        DL.save(); DL.translate(ZC[0], ZC[1]); DL.scale(lerp(1.3, 1, EASE.back(du)));
        stroke('a3zd.dom', superPts(0, 0, 2 * ZS - 22, ZS - 22, 20, 6), { z: z + 1, w: 6, closed: true, fill: 'none', opacity: clamp(du * 3) });
        stroke('a3zd.dm', [[0, -ZS * 0.22], [0, ZS * 0.22]], { z: z + 1, w: 3.2, opacity: clamp(du * 3) });
        DL.restore();
      }
    },
    cues: fx => [[ZT.lines, 'whoosh'], [ZT.cells, 'pen'], [ZT.dom + 0.1, 'tap'], [ZT.hatch, 'swish']],
  };

  /* ---------------- L4–L6: count the squares (red numbers on the board) ---------------- */
  const NS = 40;
  const glyphs = n => layoutWriting({ text: String(n), x: 0, y: -NS / 2, size: NS, t0: 0, speed: 1500, gap: 0.02, glyphGap: 0.02, anchor: 'middle' });
  const TB = 10.95, DTB = 0.19, TW = 12.45, DTW = 0.165;   // black 1–6, white 1–8
  const DIMB = 15.95, DIMW = 18.75;                        // "用光了": used squares fade (in the same order)
  const COUNT = [
    ...BLK.map(([r, c], i) => ({ r, c, n: i + 1, t: TB + i * DTB, dim: DIMB + i * 0.12 })),
    ...WHT.map(([r, c], i) => ({ r, c, n: i + 1, t: TW + i * DTW, dim: covered.has(r + '_' + c) ? DIMW + i * 0.1 : null })),
  ].map(o => ({ ...o, g: glyphs(o.n) }));
  COMP.a3_count = {
    draw(fx, t, F) {
      if (t >= fx.t1) return;
      COUNT.forEach((o, i) => {
        if (t < o.t) return;
        const p = F.targets[`${fx.board}.c${o.r}_${o.c}`]; if (!p) return;
        const op = o.dim === null ? 1 : lerp(1, 0.22, clamp((t - o.dim) / 0.25));
        const k = 'a3n' + i, pop = EASE.back(clamp((t - o.t) / 0.16));
        DL.save(); DL.translate(p[0], p[1]);
        dot(k + '.bg', [0, 0], 25 * pop, C.paper, Z.annot - 1);
        o.g.strokes.forEach((s, j) => {
          const u = clamp((t - o.t - s.t0) / s.dur);
          if (u > 0) stroke(k + '.s' + j, s.pts, { z: Z.annot, w: 4.6, color: C.red, draw: u, opacity: op, boil: 0.5 });
        });
        DL.restore();
      });
    },
    cues: () => COUNT.map(o => [o.t, 'plip']),
  };
  /** red pen flashes: rings that swell and fade around board squares */
  COMP.a3_pulse = {
    draw(fx, t, F) {
      fx.at.forEach((t0, i) => {
        const u = (t - t0) / 0.45; if (u < 0 || u > 1) return;
        fx.cells.forEach(([r, c], j) => {
          const p = F.targets[`${fx.board}.c${r}_${c}`]; if (!p) return;
          const R = 44 + 34 * EASE.out(u);
          stroke(`${fx.id}.${i}.${j}`, ringPts(`${fx.id}.${j}`, p[0], p[1], R, R, { n: 12, closed: true, rv: 0.05 }), { z: Z.annot, w: 5 * (1 - u) + 1, color: C.red, closed: true, opacity: 1 - u });
        });
      });
    },
    cues: fx => fx.at.map(t => [t, 'boop']),
  };

  // tally (left panel): 黑 6 - 6 = 0 / 白 8 - 6 = 2  (汉字 typed, numbers hand-written)
  const TS = 68, TXL = 105, TXN = 152, ROW = [300, 420];
  const XEQ = TXN + writeWidth('6', TS) + 0.36 * TS;
  const TALLY = { b: 12.2, w: 13.85, eqB: 15.3, eqW: 18.55, ring2: 19.75 };

  /* ---------------- L7: 啊哈！ (jump, burst lines, the word itself) ---------------- */
  const jumpY = t => {
    if (t >= J0 && t < J1) return -JH * Math.sin(Math.PI * (t - J0) / (J1 - J0));
    if (t >= H0 && t < H1) return -34 * Math.sin(Math.PI * (t - H0) / (H1 - H0));
    return 0;
  };
  COMP.a3_aha = {
    draw(fx, t, F) {
      if (t < J0 || t >= fx.t1) return;
      const a = F.anchors.terry; if (!a) return;
      const lt = t - J0;
      // speed lines under the feet while he shoots up
      const up = 1 - clamp((t - J0 - 0.2) / 0.25);
      if (up > 0) [-26, 0, 26].forEach((dx, i) => {
        const fx0 = (a.footL[0] + a.footR[0]) / 2 + dx, fy = Math.max(a.footL[1], a.footR[1]) + 16 + Math.abs(dx) * 0.3;
        stroke('a3aha.sp' + i, [[fx0, fy], [fx0 + dx * 0.15, fy + 70 - Math.abs(dx)]], { z: Z.fx, w: 4, draw: EASE.out(clamp(lt / 0.08)), opacity: up, boil: 0.6 });
      });
      // emphasis lines: two fans either side of him (keep the top clear for the bulb)
      const op = clamp(lt / 0.1) * (1 - clamp((t - J0 - 2.0) / 0.5)), cx = TX, cy = 560;
      [...[-200, -183, -166, -149, -132], ...[-48, -31, -14, 3, 20]].forEach((deg, i) => {
        const L = i < 5, a0 = deg * RAD, wob = 7 * Math.sin(t * 13 + i * 2.1);   // left fan stays clear of the board
        const r0 = (L ? 176 : 205) + wob + (i % 2) * 12, r1 = r0 + (L ? 44 : 58) + (i % 3) * 8;
        stroke('a3aha.e' + i, [[cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0], [cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1]],
          { z: Z.fx, w: 4.5, draw: EASE.out(clamp((lt - i * 0.015) / 0.12)), opacity: op, boil: 0.8 });
      });
      // the word
      const pp = EASE.back(clamp((t - fx.wordT) / 0.24));
      if (t >= fx.wordT) text('a3aha.w', '啊哈！', 1000, 128, { size: 118, rot: -7, scale: lerp(0.3, 1, pp), opacity: clamp((t - fx.wordT) / 0.08), halo: 12, z: Z.annot });
    },
  };

  /* ---------------- L8: this "ding" … (a red ring round his bulb) ---------------- */
  const bulbAt = F => { const a = F.anchors.terry; return a ? [a.headTop[0], a.headTop[1] - 26 - 130 * 0.62] : [TX, 430]; };
  COMP.a3_bulbRing = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const c = bulbAt(F);
      stroke(fx.id, ringPts(fx.id, c[0], c[1] - 6, 92, 100, { n: 13, a0: 200, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 5, color: C.red, draw: EASE.out(clamp((t - fx.t0) / 0.4)) });
    },
    cues: fx => [[fx.t0, 'pen']],
  };

  /* ---------------- L9: … didn't fall out of the sky (cloud drops a bulb — crossed out) ---------------- */
  const SKY = { cloud: 29.55, drop: 30.05, land: 30.5, x1: 31.15, x2: 31.4, x: 620, cy: 175, by: 470 };
  COMP.a3_sky = {
    draw(fx, t, F) {
      if (t < SKY.cloud || t >= fx.t1) return;
      const z = Z.fx, lt = t - SKY.cloud, p = EASE.back(clamp(lt / 0.3)), { x, cy } = SKY;
      // cloud
      const pts = [], rx = 150 * p, ry = 66 * p;
      for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, bump = 1 + 0.11 * Math.abs(Math.sin(a * 4.5)); pts.push([x + Math.cos(a) * rx * bump, cy + Math.sin(a) * ry * bump]); }
      stroke('a3sky.cl', pts, { z, w: 5, closed: true, fill: C.paper });
      // the bulb falls out of it (drawn by the shared bulb component at a moving spot)
      if (t >= SKY.drop) {
        const u = clamp((t - SKY.drop) / (SKY.land - SKY.drop)), bounce = t > SKY.land ? Math.max(0, Math.sin(Math.PI * (t - SKY.land) / 0.22)) * 22 * (t < SKY.land + 0.22 ? 1 : 0) : 0;
        const by = lerp(cy + 40, SKY.by, EASE.in(u)) - bounce;
        if (u < 1) [-18, 18].forEach((dx, i) => stroke('a3sky.fl' + i, [[x + dx, by - 150], [x + dx, by - 110 - 40 * u]], { z: z - 0.1, w: 3.5, opacity: 0.8 * (1 - u * 0.5), boil: 0.6 }));
        COMP.e3_bulb.draw({ id: 'a3sky.b', at: [x, by + 30], size: 92, t0: -1, state: [[-1, 'on']], z: z + 0.2 }, t, F);
      }
      // a big red ✗ over the whole idea
      [[[x - 190, cy - 70], [x + 190, SKY.by + 70]], [[x + 190, cy - 70], [x - 190, SKY.by + 70]]].forEach((seg, i) => {
        const u = EASE.out(clamp((t - (i ? SKY.x2 : SKY.x1)) / 0.2));
        if (u > 0) stroke('a3sky.x' + i, seg, { z: Z.annot, w: 11, color: C.red, draw: u });
      });
    },
    cues: () => [[SKY.cloud, 'boop'], [SKY.drop, 'whoosh'], [SKY.land, 'boing'], [SKY.x1, 'pen'], [SKY.x2, 'buzz']],
  };

  /* ---------------- L10: the chain that really makes the "ding" ---------------- */
  const CS = 52, CY = 232, CH = 92, PADX = 24, ARW = 52, GAP = 12;
  const CHAIN = [{ text: '9 次失败', t: 32.8 }, { text: '一个好问题', t: 34.0 }, { text: '换个看法', t: 34.85 }, { text: '叮！', t: 35.55 }];
  let cxx = 60;
  CHAIN.forEach(b => { b.w = textWidth(b.text, CS) + 2 * PADX; b.x = cxx; cxx += b.w + ARW + 2 * GAP; });
  const CHAIN_END = CHAIN[3].x + CHAIN[3].w, BAND_T = 36.05;
  if (CHAIN_END > 1390) console.error('a3_aha: chain too wide', CHAIN_END);
  COMP.a3_chain = {
    draw(fx, t) {
      CHAIN.forEach((b, i) => {
        if (t < b.t) return;
        const lt = t - b.t, p = EASE.out(clamp(lt / 0.3)), k = 'a3ch' + i, x0 = b.x, x1 = b.x + b.w, y0 = CY - CH / 2, y1 = CY + CH / 2;
        stroke(k + '.box', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0 - 2, 1]], { z: Z.set + 1, w: 5, draw: p });
        const tp = clamp((lt - 0.12) / 0.15);
        if (tp > 0) text(k + '.t', b.text, (x0 + x1) / 2, CY + 2, { size: CS, z: Z.set + 2, opacity: tp, scale: lerp(0.7, 1, EASE.back(tp)) });
        if (i > 0) { const pb = CHAIN[i - 1]; arrow(k + '.a', [pb.x + pb.w + GAP, CY], [x0 - GAP + 2, CY], { p: EASE.out(clamp((lt + 0.15) / 0.25)), bend: 0, color: C.ink, w: 4.5, head: 16, z: Z.set + 2 }); }
        // little callbacks above the boxes: nine red ✗ / a red ？ / a black-and-white square
        const ip = clamp((lt - 0.25) / 0.3), cx = (x0 + x1) / 2, iy = y0 - 36;
        if (ip <= 0) return;
        if (i === 0) for (let j = 0; j < 9; j++) {
          const xx = cx - 92 + j * 23, q = clamp(ip * 9 - j);
          if (q > 0) { stroke(k + '.x' + j + 'a', [[xx - 8, iy - 9], [xx + 8, iy + 9]], { z: Z.annot, w: 4, color: C.red, draw: q }); stroke(k + '.x' + j + 'b', [[xx + 8, iy - 9], [xx - 8, iy + 9]], { z: Z.annot, w: 4, color: C.red, draw: q }); }
        }
        if (i === 1) text(k + '.q', '？', cx, iy - 4, { size: 48, color: C.red, z: Z.annot, opacity: ip, scale: lerp(0.5, 1, EASE.back(ip)) });
        if (i === 2) {
          const s = 26;
          [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([c, r], j) => {
            const xx = cx - s + c * s, yy = iy - s + r * s;
            stroke(k + '.sq' + j, [[xx, yy], [xx + s, yy, 1], [xx + s, yy + s, 1], [xx, yy + s, 1], [xx, yy, 1]], { z: Z.annot, w: 2.6, draw: ip });
            if ((r + c) % 2 === 0) hatch(k + '.h' + j, xx, yy, s, Z.annot, ip, 1, 0.5);
          });
        }
      });
    },
    cues: () => CHAIN.flatMap((b, i) => (i ? [[b.t - 0.15, 'whip'], [b.t, 'pen']] : [[b.t, 'pen']])),
  };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    a3_pointL: { armScale: 1.5, armL: [82, 6], armR: [16, 10] },
    a3_air: { armScale: 1.75, armL: [150, 16], armR: [150, 16], legL: [16, -34], legR: [16, -34] },
    a3_proud: { lean: -2, tilt: -4, ikL: { w: 1, to: 'hip', dx: -30, dy: -6, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 30, dy: -6, bend: 'out' } },
  });

  defineScene({
    id: 'aha', chapter: '啊哈！', dur: 38.6, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [J0, t => [TX, FL + jumpY(t)], 0]],
        pose: [[0, 'stand'], [1.45, 'a3_pointL', 0.12, 'back'], [4.4, 'stand', 0.2], [7.55, 'a3_proud', 0.15],
          [10.4, 'a3_pointL', 0.12, 'back'], [14.6, 'thinkStand', 0.2], [18.55, 'a3_pointL', 0.12, 'back'], [21.4, 'stand', 0.2],
          [22.2, 'crouch', 0.1], [J0, 'a3_air', 0.07, 'back'], [J1 - 0.05, 'kidCheer', 0.06], [EXIT, 'stand', 0.2], [26.5, 'a3_proud', 0.15],
          [32.6, 'stand', 0.2], [BAND_T, 'a3_proud', 0.15]],
        face: [[0, 'idea'], [1.3, 'focus', 0.08], [7.55, 'smile', 0.08], [10.4, 'focus', 0.08], [19.9, 'surprised', 0.06],
          [22.2, 'idea', 0.05], [J0, 'joy', 0.05], [EXIT, 'proudGrin', 0.08], [29.5, 'puzzled', 0.08], [31.15, 'neutral', 0.08], [32.8, 'smile', 0.08], [BAND_T, 'proudGrin', 0.08]],
        turn: [[0, -0.35], [J0, -0.05, 0.1], [EXIT, -0.3, 0.15]],
        gaze: [[0, 'dom'], [3.5, 'zoom'], [10.4, 'board'], [12.2, 'tallyB'], [12.45, 'board'], [13.85, 'tallyW'], [14.6, 'board'], [15.3, 'tallyB'],
          [16.0, 'board'], [18.55, 'leftW'], [J0 - 0.3, 'viewer'], [26.4, 'bulb'], [29.55, 'sky'], [32.6, 'chain0'], [34.0, 'chain1'], [34.85, 'chain2'], [35.55, 'viewer']],
        squash: [[0, 1], [7.55, 1.05, 0.06], [7.62, 1, 0.2, 'back'], [19.9, 1.06, 0.05], [19.96, 1, 0.2, 'back'],
          [22.2, 0.86, 0.1], [J0, 1.14, 0.06], [J0 + 0.25, 1, 0.12], [J1, 0.84, 0.05], [J1 + 0.06, 1.04, 0.12, 'back'], [J1 + 0.2, 1, 0.15],
          [H0 - 0.08, 0.92, 0.06], [H0, 1.08, 0.06], [H1, 0.9, 0.04], [H1 + 0.05, 1, 0.2, 'back']],
      },
    },
    targets: F => {
      const c = (r, cc) => cellAt(F.t, r, cc);
      const d = lerp2(c(1, 0), c(1, 1), 0.5);
      return { dom: d, zoom: ZC, board: boardAt(F.t), tallyB: [TXN + 40, ROW[0]], tallyW: [TXN + 40, ROW[1]],
        leftW: lerp2(c(2, 3), c(3, 2), 0.5), bulb: bulbAt(F), sky: [SKY.x, SKY.cy + 120],
        chain0: [CHAIN[0].x + CHAIN[0].w / 2, CY], chain1: [CHAIN[1].x + CHAIN[1].w / 2, CY], chain2: [CHAIN[2].x + CHAIN[2].w / 2, CY] };
    },
    set: [{ type: 'floor' }],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, center: E3.STAMP.center, R: E3.STAMP.R, dockT: -2, dock: E3.STAMP.dock, dockScale: E3.STAMP.dockScale },
      // the main board, exactly as scene 50 left it
      { type: 'e3_board', id: 'a3b', pos: BPOS, n: N, cell: CELL, t0: -5, t1: EXIT + 0.55, cut: -5, color: -5,
        attempts: [{ t0: -5, dom: TRY }],
        rings: [{ cells: E3B.domCells(DOM), t0: 1.5, t1: SLIDE }] },
      // L1–L3
      { type: 'a3_zoomDom', id: 'a3zd', t1: SLIDE },
      { type: 'label', id: 'a3lbNext', text: '挨在一起', at: [ZC[0], 182], rot: -3, t0: 5.0, t1: 6.65, target: [ZC[0], ZC[1] - ZS / 2 - 4], bend: 0.25, gap: 8 },
      { type: 'title', id: 'a3bw', text: '一黑一白', x: ZC[0], y: 468, size: 70, t0: 7.5, t1: SLIDE, color: 'ink', sfx: 'pop' },
      { type: 'band', id: 'a3bwHi', rect: [ZC[0] - 150, 430, 300, 78], t0: 8.1, t1: SLIDE, dur: 0.45 },
      // L4–L6: count, tally, subtract
      { type: 'a3_count', id: 'a3cnt', board: 'a3b', t1: EXIT + 0.55 },
      { type: 'title', id: 'a3tB', text: '黑', x: TXL, y: ROW[0], size: TS, t0: TALLY.b, t1: EXIT, color: 'red', sfx: 'pop' },
      { type: 'write', id: 'a3n6', text: '6', x: TXN, y: ROW[0] - TS / 2, size: TS, t0: TALLY.b + 0.08, t1: EXIT, speed: 2600, color: 'red', w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'title', id: 'a3tW', text: '白', x: TXL, y: ROW[1], size: TS, t0: TALLY.w, t1: EXIT, color: 'red', sfx: 'pop' },
      { type: 'write', id: 'a3n8', text: '8', x: TXN, y: ROW[1] - TS / 2, size: TS, t0: TALLY.w + 0.08, t1: EXIT, speed: 2600, color: 'red', w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'write', id: 'a3e6', text: '- 6 = 0', x: XEQ, y: ROW[0] - TS / 2, size: TS, t0: TALLY.eqB, t1: EXIT, speed: 1900, gap: 0.05, glyphGap: 0.1, color: 'red', w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'write', id: 'a3e8', text: '- 6 = 2', x: XEQ, y: ROW[1] - TS / 2, size: TS, t0: TALLY.eqW, t1: EXIT, speed: 1900, gap: 0.05, glyphGap: 0.1, color: 'red', w: 6, z: Z.annot, sfx: 'pen' },
      { type: 'ring', id: 'a3r2', of: 'a3e8', glyph: 6, t0: TALLY.ring2, t1: EXIT },
      { type: 'a3_pulse', id: 'a3pl', board: 'a3b', cells: LEFT, at: [19.85, 20.3] },
      { type: 'label', id: 'a3lbNever', text: '永远不挨着', at: [905, 712], rot: -2, t0: 20.55, t1: 22.45, target: [B1[0] + CELL - 4, B1[1] + CELL - 4], bend: 0.2, gap: 10 },
      // L7: 啊哈！
      { type: 'e3_bulb', id: 'a3bulb', char: 'terry', size: 130, t0: J0, state: [[J0, 'on'], [27.25, 'off'], [27.5, 'on']] },
      { type: 'a3_aha', id: 'a3aha', wordT: J0 + 0.05, t1: EXIT },
      // L8–L10
      { type: 'a3_bulbRing', id: 'a3bring', t0: 26.65, t1: 29.4 },
      { type: 'a3_sky', id: 'a3sky', t1: 32.45 },
      { type: 'a3_chain', id: 'a3chain' },
      { type: 'band', id: 'a3chHi', rect: [CHAIN[0].x, CY - 38, CHAIN_END - CHAIN[0].x, 76], t0: BAND_T, dur: 0.7, pad: 8 },
    ],
    sfx: [[1.5, 'pen'], [SLIDE, 'whoosh'], [22.2, 'swish'], [J0, 'hop'], [J1, 'thud'], [H0, 'hop'], [H1, 'thud'], [EXIT, 'whoosh']],
    subs: [
      { t0: 0.3, t1: 3.3, text: '为什么？看一块骨牌：' },
      { t0: 3.4, t1: 6.6, text: '它盖住的两格挨在一起，' },
      { t0: 6.7, t1: 9.7, text: '所以一定是一黑一白。' },
      { t0: 10.2, t1: 14.2, text: '再数一数：黑格 6 个，白格 8 个。', say: '再数一数：黑格六个，白格八个。' },
      { t0: 14.6, t1: 18.4, text: '6 块骨牌，就用光了 6 个黑格，', say: '六块骨牌，就用光了六个黑格，' },
      { t0: 18.5, t1: 22.1, text: '剩下两个白格，永远不挨着。' },
      { t0: 22.6, t1: 25.46, text: '“啊哈！盖不满！”', voice: 'kid' },
      { t0: 26.36, t1: 29.36, text: '你看，这一声“叮”，' },
      { t0: 29.46, t1: 32.46, text: '不是从天上掉下来的。' },
      { t0: 32.56, t1: 36.76, text: '是一次次失败、一个好问题换来的。' },
    ],
  });
})();
