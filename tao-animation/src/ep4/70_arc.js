// 第 70 场 · 他后来怎么说：只陈述记录和他自己说过的话（每一条都用红笔小字标出处）。
// ① Clements (1984) 记录他 8 岁时：做完题，不爱检查。② 长大以后（博客上写给学生的职业建议）：《Be sceptical of your own work》；
// ③《Use the wastebasket》：犯过的错要记下来，以后避开（本子里的两条是本集的例子，写给观众的，所以标“比如，你可以记”）；
// ④ 2006 年采访：小时候有点倔，没弄懂的地方不全部想通就不罢休；⑤ 他 15 岁写的书里，练习就是 1986 年 IMO 第 5 题——
// 是不是因为那次 0 分，没有人知道（轻松：小问号耸耸肩）；⑥ 1987 年：7 7 7 7 7 5，只丢了 2 分（只做预告）。
(() => {
  const FL = 780, DUR = 52.1;
  /* ---------------- timing (scene time) ---------------- */
  const T = {
    src1: 1.25, open1: 2.7, w1: 4.5, w2: 5.3, ul: 6.5, shrink: 8.0,
    screen: 8.35, tao: 8.55, quote1: 12.45, quote2: 13.3, src2: 14.0, screenOff: 16.15,
    log: 16.15, src3: 16.9, ex: 17.3, e1: 17.55, e2: 18.75, arrow: 20.05, logOff: 22.85,
    kid: 22.85, page: 22.85, src4: 23.35, stub: 25.0, ringQ: 26.6, walk0: 27.8, walk1: 28.45, walk2: 28.55, walk3: 29.2,
    scratch: 29.25, bulb: 29.9, fix: 30.05, kidOff: 31.9,
    s86: 31.9, ring0: 33.3, small: 35.55, book: 36.0, arr4: 36.25, src5: 36.45, open2: 37.0, fly: 37.9, land: 38.7,
    qm: 40.35, coin: 40.6, shrug: 42.5, nobody: 42.6, clear: 45.0,
    s87: 45.0, y87: 46.2, sc87: 46.9, ring5: 49.5, lost: 49.6,
  };

  /* ---------------- little drawing helpers ---------------- */
  const box = (k, x0, y0, x1, y1, o) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], o);
  /** hand-written GLYPH text drawn whole (no write-on), x = centre, y = top */
  function glyphs(k, str, x, y, size, o = {}) {
    let w = 0; [...str].forEach(ch => { w += (GLYPH[ch].w + 0.1) * size; }); w -= 0.1 * size;
    let gx = x - w / 2;
    [...str].forEach((ch, i) => {
      const g = GLYPH[ch];
      g.s.forEach((s, j) => stroke(`${k}.${i}.${j}`, s.map(([u, v, c]) => [gx + u * size, y + v * size, c]), { z: o.z, w: o.w || 6, color: o.color || C.ink, opacity: o.opacity, draw: o.draw, boil: 0.55 }));
      gx += (g.w + 0.1) * size;
    });
  }
  /** a line of handwriting that appears character by character (in the current DL transform) */
  function typed(k, str, x, y, t0, t, o = {}) {
    if (t < t0) return;
    const ch = [...str], n = Math.min(ch.length, Math.floor((t - t0) * (o.cps || 6)) + 1);
    text(k, ch.slice(0, n).join(''), x, y, { size: o.size || 50, anchor: o.anchor || 'start', color: o.color || C.ink, z: o.z ?? Z.annot, font: o.font });
  }
  function star(k, c, R, o) {
    const pts = []; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * RAD, r = i % 2 ? R * 0.45 : R; pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, 1]); }
    pts.push([pts[0][0], pts[0][1], 1]);
    stroke(k, pts, { w: 3.5, fill: C.paper, ...o });
  }
  /** a book seen from the front: closed (cover to the right of the spine) → the cover swings over to the left.
   *  Local coords: spine at x = 0, page centre line y = 0. o: {pos, sc, pw, ph, t0, openT, z, cover(k, z), left(k, z), right(k, z)} */
  function book(k, t, o) {
    const lt = t - o.t0, pp = o.t0 < 0 ? 1 : Math.max(0.01, EASE.back(clamp(lt / 0.3)));
    const u = EASE.io(clamp((t - o.openT) / 0.4)), { pw, ph } = o, h = ph / 2, z = o.z;
    DL.save(); DL.translate(o.pos[0], o.pos[1]); DL.scale(o.sc * pp); DL.translate(-pw / 2 * (1 - u), 0);
    box(k + '.r', 0, -h, pw, h, { z, w: 4.5, fill: C.paper });
    stroke(k + '.rsh', [[8, h + 7], [pw + 7, h + 6, 1], [pw + 7, -h + 10]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.6, boil: 0.5 });
    if (u > 0.5) o.right(k, z + 0.1);
    const ex = pw * Math.cos(Math.PI * u), lift = 14 * Math.sin(Math.PI * u);
    if (u < 0.5) {
      stroke(k + '.cv', [[0, -h], [ex, -h - lift, 1], [ex, h + lift, 1], [0, h, 1], [0, -h, 1]], { z: z + 0.5, w: 5.5, fill: C.paper });
      DL.save(); DL.scale(Math.max(0.01, Math.cos(Math.PI * u)), 1); o.cover(k, z + 0.6); DL.restore();
    } else {
      stroke(k + '.lp', [[0, -h], [ex, -h - lift, 1], [ex, h + lift, 1], [0, h, 1], [0, -h, 1]], { z: z + 0.5, w: 4.5, fill: C.paper });
      if (u > 0.98) o.left(k, z + 0.6);
    }
    stroke(k + '.spine', [[0, -h - 4], [0, h + 4]], { z: z + 0.7, w: 5 });
    DL.restore();
  }
  const rules = (k, x0, x1, y0, n, dy, z) => { for (let i = 0; i < n; i++) stroke(k + i, [[x0, y0 + i * dy], [x1, y0 + i * dy + 1]], { z, w: 2, color: C.pencil, opacity: 0.5, boil: 0.4 }); };
  const scribbles = (k, x0, x1, y0, n, dy, z) => { for (let i = 0; i < n; i++) { const pts = [], L = (x1 - x0) * (i % 2 ? 0.7 : 0.95); for (let j = 0; j <= 10; j++) pts.push([x0 + L * j / 10, y0 + i * dy + (j % 2 ? -5 : 4)]); stroke(k + i, pts, { z, w: 2.6, color: C.pencil, boil: 0.6 }); } };

  /* ---------------- L1–L2: the researcher's old notebook (1983) ---------------- */
  const NB = { pw: 330, ph: 430 };
  const NBPOS = [[0, [800, 392]], [T.shrink, [235, 228], 0.5, 'io']], NBSC = [[0, 1.15], [T.shrink, 0.36, 0.5, 'io']];
  COMP.m4_aNote83 = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id, pw = NB.pw, h = NB.ph / 2;
      book(k, t, { pos: evalTrack(NBPOS, t), sc: evalTrack(NBSC, t), pw, ph: NB.ph, t0: fx.t0, openT: T.open1, z: Z.set + 1,
        cover: (k, z) => {
          box(k + '.cb', 14, -h + 14, pw - 14, h - 14, { z, w: 2.6 });
          glyphs(k + '.yr', '1983', pw / 2, -h + 90, 74, { z, w: 6.5 });
          text(k + '.ct', '观察记录', pw / 2, 30, { size: 56, z });
          stroke(k + '.ear', [[pw - 46, -h], [pw - 46, -h + 40, 1], [pw, -h + 40]], { z, w: 3 });           // dog-eared corner
          [[60, 150], [250, -150], [90, -170], [270, 120]].forEach(([x, y], i) => dot(k + '.sp' + i, [x, y], 3, C.pencil, z));
        },
        left: (k, z) => {
          portrait(k + '.pt', -pw / 2, -88, 60, { z });
          text(k + '.who', '小陶，8 岁', -pw / 2, 26, { size: 40, z });
          scribbles(k + '.lsc', -pw + 40, -40, 86, 4, 34, z);
        },
        right: (k, z) => {
          rules(k + '.rl', 22, pw - 22, -h + 66, 7, 54, z);
          typed(k + '.w1', '做完题，', 30, -62, T.w1, t, { size: 56, cps: 6, z: z + 0.1 });
          typed(k + '.w2', '不爱检查。', 30, 22, T.w2, t, { size: 56, cps: 6, z: z + 0.1 });
          const up = EASE.out(clamp((t - T.ul) / 0.3));
          if (up > 0) stroke(k + '.ul', [[26, 62], [130, 58], [252, 60]], { z: Z.annot, w: 5, color: C.red, draw: up });
        },
      });
    },
    cues: () => [[T.open1, 'paper'], [T.w1, 'pen'], [T.w1 + 0.5, 'pen'], [T.w2, 'pen'], [T.w2 + 0.5, 'pen'], [T.ul, 'pen'], [T.shrink, 'whoosh']],
  };

  /* ---------------- L3–L4: the grown-up Tao and his blog ---------------- */
  const SCR = { x0: 600, y0: 196, x1: 1380, y1: 560 };
  COMP.m4_aScreen = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.45)), k = fx.id, z = Z.set + 1, { x0, y0, x1, y1 } = SCR, mx = (x0 + x1) / 2;
      box(k + '.bz', x0, y0, x1, y1, { z, w: 6, fill: C.paper, draw: stag(p, 0, 3) });
      box(k + '.in', x0 + 16, y0 + 16, x1 - 16, y1 - 16, { z: z + 0.1, w: 3, draw: stag(p, 1, 3) });
      stroke(k + '.bar', [[x0 + 16, y0 + 66], [x1 - 16, y0 + 66]], { z: z + 0.1, w: 3, draw: stag(p, 1, 3) });
      [0, 1, 2].forEach(i => { if (p > 0.6) stroke(k + '.d' + i, ringPts(k + '.d' + i, x0 + 46 + i * 30, y0 + 41, 9, 9, { n: 8, closed: true }), { z: z + 0.2, w: 3, closed: true }); });
      if (p > 0.7) text(k + '.blog', '博客', mx, y0 + 42, { size: 32, color: C.pencil, z: z + 0.2 });
      // a blinking text cursor until the quote is typed
      if (t > fx.t0 + 0.6 && t < T.quote1 && Math.floor((t - fx.t0) * 2.2) % 2 === 0) stroke(k + '.cur', [[668, 296], [668, 364]], { z: z + 0.2, w: 4, boil: 0.3 });
      // stand + desk
      stroke(k + '.neck', [[mx - 24, y1], [mx - 30, y1 + 64, 1], [mx + 30, y1 + 64, 1], [mx + 24, y1]], { z, w: 5, fill: C.paper, draw: stag(p, 2, 3) });
      stroke(k + '.top', [[x0 - 40, y1 + 66], [x1 + 40, y1 + 68]], { z, w: 5.5, draw: stag(p, 2, 3) });
      stroke(k + '.lgL', [[x0 - 14, y1 + 68], [x0 - 10, FL]], { z, w: 5, draw: stag(p, 2, 3) });
      stroke(k + '.lgR', [[x1 + 14, y1 + 68], [x1 + 10, FL]], { z, w: 5, draw: stag(p, 2, 3) });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /* ---------------- L5–L6: a mistakes notebook (the two entries are this episode's examples) ---------------- */
  const LG = { x0: 520, y0: 214, x1: 1210, y1: 650 };
  const ENTRIES = [['20 个数配成了 20 对', T.e1, 420], ['证明少写了一步', T.e2, 510]];
  COMP.m4_aLog = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), k = fx.id, z = Z.set + 1, { x0, y0, x1, y1 } = LG;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      DL.save(); DL.translate(cx, cy); DL.scale(pp); DL.translate(-cx, -cy);
      box(k + '.pg', x0, y0, x1, y1, { z, w: 5, fill: C.paper });
      stroke(k + '.sh', [[x0 + 12, y1 + 8], [x1 + 8, y1 + 8, 1], [x1 + 8, y0 + 12]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.6, boil: 0.5 });
      for (let i = 0; i < 11; i++) { const x = x0 + 40 + i * ((x1 - x0 - 80) / 10); stroke(k + '.sp' + i, ringPts(k + '.sp' + i, x, y0, 10, 16, { n: 8, a0: 180, sweep: 300 }), { z: z + 0.2, w: 3.5 }); }
      rules(k + '.rl', x0 + 26, x1 - 26, 360, 4, 90, z + 0.1);
      text(k + '.ti', '错误记录', cx, 290, { size: 64, z: z + 0.2 });
      stroke(k + '.tu', [[cx - 150, 336], [cx + 150, 333]], { z: z + 0.2, w: 4 });
      if (t >= T.ex) text(k + '.eg', '比如，你可以记：', x0 + 40, 372, { size: 34, color: C.red, anchor: 'start', z: Z.annot, opacity: clamp((t - T.ex) / 0.15) });
      ENTRIES.forEach(([s, t0, y], i) => {
        const xa = clamp((t - t0) / 0.15), xb = clamp((t - t0 - 0.15) / 0.15), mx = x0 + 70, my = y + 2;
        if (xa > 0) stroke(k + '.xa' + i, [[mx - 16, my - 16], [mx + 16, my + 16]], { z: Z.annot, w: 5, color: C.red, draw: xa });
        if (xb > 0) stroke(k + '.xb' + i, [[mx + 16, my - 16], [mx - 16, my + 16]], { z: Z.annot, w: 5, color: C.red, draw: xb });
        typed(k + '.e' + i, s, x0 + 112, y, t0 + 0.3, t, { size: 48, cps: 9, z: z + 0.3 });
      });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'paper'], ...ENTRIES.flatMap(([, t0]) => [[t0, 'pen'], [t0 + 0.15, 'pen'], [t0 + 0.5, 'pen'], [t0 + 1.0, 'pen']])],
  };
  /** a red arrow drawn in. {from, to, t0, t1, bend, w} */
  COMP.m4_aArrow = {
    draw(fx, t) { if (t < fx.t0 || t >= fx.t1) return; arrow(fx.id, fx.from, fx.to, { p: EASE.out(clamp((t - fx.t0) / 0.35)), bend: fx.bend ?? 0.2, w: fx.w || 5, head: fx.head || 22 }); },
    cues: fx => [[fx.t0, 'swish']],
  };

  /* ---------------- L7–L8: half understood → not done until it is all worked out ---------------- */
  const PG = { at: [500, 430], w: 560, h: 470 }, ROWY = [330, 430, 530], ROWX0 = 300, MARKX = 660;
  COMP.m4_aRows = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id, z = Z.set + 2, ck = GLYPH['✓'];
      ROWY.forEach((y, i) => {
        const p = clamp((t - fx.t0 - 0.3 - i * 0.25) / 0.3); if (p <= 0) return;
        const pts = []; for (let j = 0; j <= 11; j++) pts.push([ROWX0 + j * (i === 1 ? 24 : 28), y + (j % 2 ? -9 : 7) + Math.sin(j * 1.3 + i) * 3]);
        stroke(k + '.row' + i, pts, { z, w: 3.2, draw: p, boil: 0.6 });
      });
      // ✓ ✓ ? : the first two parts understood, the last one not yet
      [0, 1].forEach(i => {
        const q = clamp((t - fx.t0 - 1.0 - i * 0.3) / 0.15); if (q <= 0) return;
        stroke(k + '.ck' + i, ck.s[0].map(([u, v, c]) => [MARKX - 22 + u * 54, ROWY[i] - 30 + v * 54, c]), { z: Z.annot, w: 6, color: C.red, draw: q });
      });
      const qq = clamp((t - fx.t0 - 1.7) / 0.2);
      if (qq > 0) text(k + '.q', '？', MARKX + 4, ROWY[2], { size: 62, color: C.red, z: Z.annot, scale: lerp(0.4, 1, EASE.back(qq)), opacity: t >= T.fix ? 0.5 : 1 });
      const rp = EASE.out(clamp((t - T.ringQ) / 0.35));
      if (rp > 0 && t < T.fix) stroke(k + '.rq', ringPts(k + '.rq', MARKX + 4, ROWY[2], 44, 44, { n: 11, a0: -110, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: rp });
      // worked out: the ? is struck and gets its ✓
      const sp = EASE.out(clamp((t - T.fix) / 0.15)), cp = clamp((t - T.fix - 0.2) / 0.18);
      if (sp > 0) stroke(k + '.qs', [[MARKX - 26, ROWY[2] + 18], [MARKX + 34, ROWY[2] - 18]], { z: Z.annot, w: 5, color: C.red, draw: sp });
      if (cp > 0) stroke(k + '.ck2', ck.s[0].map(([u, v, c]) => [MARKX + 38 + u * 60, ROWY[2] - 36 + v * 60, c]), { z: Z.annot, w: 6.5, color: C.red, draw: cp });
    },
    cues: fx => [[fx.t0 + 1.0, 'pen'], [fx.t0 + 1.3, 'pen'], [fx.t0 + 1.7, 'boop'], [T.ringQ, 'pen'], [T.fix, 'pen'], [T.fix + 0.2, 'pen']],
  };

  /* ---------------- L9–L11: the book he wrote at 15; the 0 flies over to exercise "1986 IMO problem 5" ---------------- */
  const S86 = { at: [470, 214], cell: 96, scale: 0.62 }, X87 = 880, Y86 = 236, Y87 = 476;
  const S86POS = [[0, [800, 400]], [T.small, S86.at, 0.45, 'io'], [T.clear, [X87, Y86], 0.5, 'io']];
  const S86SC = [[0, 1.2], [T.small, S86.scale, 0.45, 'io'], [T.clear, 1, 0.5, 'io']];
  /** a red ring round one cell (a little smaller than the shared one, so it clears the problem number above) */
  const cellRing = (k, x, y, sc, p) => stroke(k, ringPts(k, x, y, 96 * 0.6 * sc, 96 * 0.57 * sc, { n: 11, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: p });
  /** the 1986 sheet (shared e4_scores) moved by tracks, with its year written to its left and the ring round the 0 */
  COMP.m4_aS86 = {
    init(fx) {
      COMP.e4_scores.init(fx.sheet);
      fx.yr = COMP.write.init({ id: fx.id + '.yr', text: '1986', x: -411, y: -32, size: 64, t0: T.s86 + 0.3, speed: 2400, w: 6, anchor: 'middle' });
      return fx;
    },
    draw(fx, t, F) {
      if (t < fx.sheet.t0) return;
      const pos = evalTrack(S86POS, t), sc = evalTrack(S86SC, t);
      fx.sheet.at = pos; fx.sheet.scale = sc;
      COMP.e4_scores.draw(fx.sheet, t, F);
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc); COMP.write.draw(fx.yr, t, F); DL.restore();
      if (t < T.clear) cellRing(fx.id + '.r0', pos[0] + sc * (fx.sheet._bx(4) + 48), pos[1], sc, EASE.out(clamp((t - T.ring0) / 0.3)));
    },
    cues: fx => [...COMP.e4_scores.cues(fx.sheet), ...COMP.write.cues(fx.yr), [T.ring0, 'pen'], [T.small, 'whoosh'], [T.clear, 'whoosh']],
  };
  /** a red ring round cell i of a sheet (via its published centre). {of, i, scale, t0} */
  COMP.m4_aRing = {
    draw(fx, t, F) { const c = F.targets[fx.of + '.s' + fx.i]; if (!c || t < fx.t0) return; cellRing(fx.id, c[0], c[1], fx.scale, EASE.out(clamp((t - fx.t0) / 0.3))); },
    cues: fx => [[fx.t0, 'pen']],
  };
  const BK = { at: [1130, 470], pw: 320, ph: 400 };
  const LAND = [BK.at[0] + 262, BK.at[1] + 2], LANDS = 64;          // beside "第 5 题" on the right-hand page (world)
  COMP.m4_aBook = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id, { pw, ph } = BK, h = ph / 2;
      book(k, t, { pos: BK.at, sc: 1, pw, ph, t0: fx.t0, openT: T.open2, z: Z.set + 1,
        cover: (k, z) => {
          box(k + '.cb', 16, -h + 16, pw - 16, h - 16, { z, w: 2.6 });
          text(k + '.ct', '解题', pw / 2, -50, { size: 104, z });
          stroke(k + '.cu', [[pw / 2 - 100, 30], [pw / 2 + 100, 27]], { z, w: 4 });
          rules(k + '.cr', pw / 2 - 80, pw / 2 + 80, 70, 2, 26, z);
        },
        left: (k, z) => scribbles(k + '.ls', -pw + 36, -36, -h + 70, 8, 40, z),
        right: (k, z) => {
          text(k + '.p0', '练习', 30, -h + 64, { size: 48, anchor: 'start', z });
          text(k + '.p1', '1986 年 IMO', 30, -70, { size: 44, anchor: 'start', z, font: CFG.FONT_MIX });
          text(k + '.p2', '第 5 题', 30, 0, { size: 56, anchor: 'start', z });
          star(k + '.st0', [52, 74], 22, { z, fill: C.ink }); star(k + '.st1', [104, 74], 22, { z, fill: C.ink });
          scribbles(k + '.rs', 30, pw - 30, 130, 2, 36, z);
        },
      });
    },
    cues: () => [[T.book, 'pop'], [T.open2, 'paper']],
  };
  /** the 0 from the 1986 sheet flies along an arc onto the book's page and lands beside "第 5 题" */
  COMP.m4_aFly0 = {
    draw(fx, t, F) {
      if (t < T.fly || t >= fx.t1) return;
      const from = F.targets['m4a.s86.s4']; if (!from) return;
      const u = clamp((t - T.fly) / (T.land - T.fly)), e = EASE.io(u), g = GLYPH['0'];
      const s = lerp(S86.cell * 0.62 * S86.scale, LANDS, e), c = [lerp(from[0], LAND[0], e), lerp(from[1], LAND[1], e) - Math.sin(Math.PI * e) * 160];
      const ld = t - T.land, sq = ld > 0 && ld < 0.3 ? 1 - 0.2 * Math.sin(Math.PI * ld / 0.3) : 1;
      DL.save(); DL.translate(c[0], c[1] + s / 2); DL.scale(1 + (1 - sq) * 0.6, sq); DL.translate(0, -s / 2);
      g.s.forEach((st, i) => stroke(fx.id + '.' + i, st.map(([a, b, cc]) => [(a - g.w / 2) * s, (b - 0.5) * s, cc]), { z: Z.fx, w: 6.5, boil: 0.55 }));
      DL.restore();
      const rp = EASE.out(clamp((t - T.land - 0.05) / 0.3));
      if (rp > 0) stroke(fx.id + '.r', ringPts(fx.id + '.r', LAND[0], LAND[1], 44, 48, { n: 11, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: rp });
    },
    cues: () => [[T.fly, 'whoosh'], [T.land, 'tap'], [T.land + 0.05, 'ding']],
  };
  /** 小问号 shrugs: the same red hook figure, arms coming up into a shrug. {pos, size, t0, t1, shrug} */
  const HOOK = [[-56, -150], [-52, -180], [-28, -200], [6, -204], [42, -190], [58, -162], [50, -134], [26, -114], [6, -96], [0, -72], [0, -34]];
  COMP.m4_aShrug = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, S = fx.size / 200, k = fx.id, z = Z.front, col = C.red, w = 6.5;
      const pop = Math.max(0.01, EASE.back(clamp(lt / 0.3))), su = EASE.back(clamp((t - fx.shrug) / 0.22));
      const hop = lt < 0.6 ? -Math.abs(Math.sin(lt / 0.6 * Math.PI)) * 30 : 0;
      const lift = -8 * su + (t > fx.shrug && t < fx.shrug + 0.5 ? -4 * Math.sin((t - fx.shrug) * 25) * (1 - (t - fx.shrug) / 0.5) : 0);
      const tilt = su * 8 * Math.sin(Math.min(1, (t - fx.shrug) / 0.3) * Math.PI / 2);
      DL.save(); DL.translate(fx.at[0], fx.at[1] + hop); DL.scale(S * pop);
      stroke(k + '.legL', [[0, -34], [-12, -12], [-26, 0]], { z, w, color: col });
      stroke(k + '.legR', [[0, -34], [14, -12], [28, 0]], { z, w, color: col });
      DL.translate(0, lift); DL.about(0, -40, () => DL.rotate(tilt));
      stroke(k + '.fill', HOOK.slice(0, 8).concat([[-10, -120]]), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke(k + '.hook', HOOK, { z, w: w + 1.5, color: col });
      // arms: hanging → elbows out, palms up (a shrug)
      const arm = s => { const e = lerp2([s * 22, -58], [s * 40, -66], su), h = lerp2([s * 40, -44], [s * 62, -100], su); return [[0, -70], e, h]; };
      [-1, 1].forEach((s, i) => {
        const pts = arm(s); stroke(k + '.arm' + i, pts, { z, w: w - 1, color: col });
        if (su > 0.5) { const h = pts[2]; stroke(k + '.palm' + i, [[h[0] - 10, h[1] - 4], [h[0] + 10, h[1] - 4]], { z, w: 4.5, color: col }); }
      });
      // face: eyebrows up, a wavy little mouth
      [-1, 1].forEach((s, i) => {
        dot(k + '.e' + i, [s * 14, -162], 6, col, z);
        stroke(k + '.b' + i, [[s * 6, -184 - 4 * su], [s * 22, -180 - 8 * su]], { z, w: 3.6, color: col });
      });
      stroke(k + '.m', su > 0.3 ? [[-12, -136], [-4, -140], [4, -134], [12, -138]] : [[-9, -137], [9, -137]], { z, w: 4, color: col });
      DL.restore();
      // little shrug ticks beside the hands
      if (t > fx.shrug + 0.1 && t < fx.shrug + 1.4) {
        const op = 1 - clamp((t - fx.shrug - 1.0) / 0.4);
        [-1, 1].forEach((s, i) => [0, 1].forEach(j => {
          const hx = fx.at[0] + s * 62 * S, hy = fx.at[1] + (-100 - 8) * S;
          stroke(`${k}.tk${i}${j}`, [[hx + s * (18 + j * 10), hy - 22 + j * 14], [hx + s * (32 + j * 10), hy - 30 + j * 14]], { z: Z.fx, w: 3, opacity: op, boil: 0.7 });
        }));
      }
    },
    cues: fx => [[fx.t0, 'boop'], [fx.shrug, 'boing']],
  };

  /* ---------------- poses & cast ---------------- */
  Object.assign(POSE, {
    m4_aPresent: { armR: [96, 8], armL: [12, 8], lean: -1 },
    m4_aStubborn: { lean: -3, tilt: -9, ikL: { w: 1, to: 'hip', dx: -30, dy: -6, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 30, dy: -6, bend: 'out' } },
    m4_aPointL: { lean: -2, tilt: -4, armScale: 1.5, armL: [80, 8], armR: [16, 10] },
  });
  const TAOX = 330, KX = 1000, KX2 = 1200;
  const walkPose = t => (t < T.walk1 ? makeWalk(T.walk0, T.walk1, 5.2)(t) : makeWalk(T.walk2, T.walk3, 5.2)(t));

  defineScene({
    id: 'arc', chapter: '他后来怎么说', dur: DUR, floor: FL,
    cast: { tao: E4.taoAdult, terry: E4.terry },
    order: ['tao', 'terry'],
    tracks: {
      tao: {
        enter: T.tao,
        pos: [[0, [TAOX, FL]], [T.logOff, [-900, FL], 0]],
        pose: [[0, 'stand'], [T.tao + 0.5, 'm4_aPresent', 0.15, 'back'], [11.2, 'stand', 0.2], [T.quote1, 'm4_aPresent', 0.15, 'back'],
          [15.6, 'stand', 0.2], [T.e1, 'm4_aPresent', 0.15, 'back'], [T.arrow + 1.0, 'stand', 0.2]],
        face: [[0, 'smile'], [T.quote1, { ...FACE.smile, brow: 'arc', browY: 0.04 }, 0.08], [15.6, 'smile', 0.1], [T.arrow, { ...FACE.smile, brow: 'arc', browY: 0.04 }, 0.08]],
        turn: [[0, 0.4]],
        gaze: [[0, 'viewer'], [T.tao + 0.5, 'screen'], [11.2, 'viewer'], [T.quote1, 'screen'], [15.6, 'viewer'], [T.log + 0.3, 'log'], [T.arrow + 0.2, 'viewer']],
      },
      terry: {
        enter: T.kid,
        pos: [[0, [KX, FL]], [T.walk0, [KX2, FL], T.walk1 - T.walk0, 'lin'], [T.walk2, [KX, FL], T.walk3 - T.walk2, 'lin'], [T.kidOff, [-900, FL], 0]],
        pose: [[0, 'stand'], [T.stub, 'm4_aStubborn', 0.12, 'back'], [T.ringQ, 'thinkStand', 0.15], [T.walk0, walkPose], [T.walk3, 'thinkStand', 0.12],
          [T.scratch + 0.15, 'scratchStand', 0.12], [T.bulb, 'lookUp', 0.1, 'back'], [T.fix + 0.3, 'm4_aPointL', 0.12, 'back']],
        face: [[0, 'neutral'], [T.page + 0.4, 'focus', 0.08], [T.stub, { ...FACE.focus, mouth: 'smirk', mw: 0.3 }, 0.08], [T.ringQ, 'focus', 0.08],
          [T.walk0, 'effort', 0.08], [T.walk3, 'focus', 0.08], [T.bulb, 'idea', 0.05], [T.fix + 0.3, 'grin', 0.08]],
        turn: [[0, -0.45], [T.stub, -0.15, 0.1], [T.ringQ, -0.45, 0.1], [T.walk0, 0.5, 0.08], [T.walk1, -0.5, 0.12], [T.bulb, -0.2, 0.1], [T.fix + 0.3, -0.45, 0.1]],
        gaze: [[0, 'page'], [T.stub, 'viewer'], [T.ringQ, 'qmark'], [T.walk0, [1500, 560]], [T.walk1, 'qmark'], [T.bulb, 'bulbT'], [T.fix + 0.3, 'qmark']],
        squash: [[0, 1], [T.stub, 0.93, 0.05], [T.stub + 0.05, 1, 0.22, 'back'], [T.bulb, 1.08, 0.05], [T.bulb + 0.05, 1, 0.25, 'back']],
      },
    },
    targets: F => ({ screen: [990, 380], log: [865, 430], page: PG.at, qmark: [MARKX, ROWY[2]],
      bulbT: F.anchors.terry ? [F.anchors.terry.headTop[0], F.anchors.terry.headTop[1] - 80] : [KX, 400] }),
    set: [{ type: 'floor', t0: T.screen, t1: T.kidOff }],
    steps: [{ t0: T.walk0, t1: T.walk1, hz: 5.2 }, { t0: T.walk2, t1: T.walk3, hz: 5.2 }],
    fx: [
      // no 10岁 stamp here: this scene spans age 8 to adulthood
      // L1–L2: Clements' notebook
      { type: 'm4_aNote83', id: 'm4a.nb', t0: -0.1, t1: T.logOff },          // already on the page at the cut
      { type: 'title', id: 'm4a.src1', text: '（研究者 Clements 的记录，他 8 岁时）', x: 800, y: 692, size: 38, color: 'red', rot: -1, t0: T.src1, t1: T.shrink },
      { type: 'title', id: 'm4a.age8', text: '8 岁', x: 415, y: 236, size: 40, color: 'red', rot: -3, t0: T.shrink + 0.45, t1: T.logOff },
      // L3–L4: grown up, at his blog
      { type: 'm4_aScreen', id: 'm4a.scr', t0: T.screen, t1: T.screenOff },
      { type: 'scribe', id: 'm4a.q1', text: '“要怀疑你', x: 660, y: 330, size: 86, t0: T.quote1, t1: T.screenOff, cps: 6, z: Z.set + 3 },
      { type: 'scribe', id: 'm4a.q2', text: '自己的作品。”', x: 660, y: 450, size: 86, t0: T.quote2, t1: T.screenOff, cps: 6, z: Z.set + 3 },
      { type: 'title', id: 'm4a.src2', text: '（陶哲轩在博客上写给学生的建议）', x: 990, y: 150, size: 38, color: 'red', rot: -1, t0: T.src2, t1: T.screenOff },
      // L5–L6: write mistakes down, to avoid them later
      { type: 'm4_aLog', id: 'm4a.log', t0: T.log, t1: T.logOff },
      { type: 'title', id: 'm4a.src3', text: '（也是他博客上的建议）', x: 865, y: 156, size: 38, color: 'red', rot: -1, t0: T.src3, t1: T.logOff },
      { type: 'm4_aArrow', id: 'm4a.fwd', from: [1232, 520], to: [1440, 520], bend: 0, w: 6, t0: T.arrow, t1: T.logOff },
      { type: 'title', id: 'm4a.avoid', text: '以后避开', x: 1334, y: 460, size: 46, color: 'red', rot: -3, t0: T.arrow + 0.25, t1: T.logOff },
      // L7–L8: a little stubborn
      { type: 'prop', kind: 'e4_page', id: 'm4a.pg', at: PG.at, rot: -1, t0: T.page, t1: T.kidOff, w: PG.w, h: PG.h, lines: 0, title: '课上学的' },
      { type: 'm4_aRows', id: 'm4a.rows', t0: T.page, t1: T.kidOff },
      { type: 'title', id: 'm4a.src4', text: '（2006 年采访）', x: 1060, y: 170, size: 40, color: 'red', rot: -2, t0: T.src4, t1: T.kidOff },
      { type: 'label', id: 'm4a.stub', text: '有点倔', size: 46, at: [1330, 330], rot: 4, t0: T.stub, t1: T.ringQ + 0.6, target: { char: 'terry', part: 'headTop', dx: 30, dy: 10 }, bend: -0.25, gap: 12 },
      { type: 'e4_bulb', id: 'm4a.bulb', char: 'terry', t0: T.bulb, t1: T.kidOff, state: [[T.bulb, 'on']], size: 84 },
      // L9–L11: the 0 and the book
      { type: 'm4_aS86', id: 'm4a.s86w', sheet: { type: 'e4_scores', id: 'm4a.s86', at: [800, 400], cell: S86.cell, t0: T.s86, scores: E4.SCORES.map(v => [v, -1]) } },
      { type: 'm4_aBook', id: 'm4a.bk', t0: T.book, t1: T.clear },
      { type: 'm4_aArrow', id: 'm4a.yrs', from: [672, 226], to: [1000, 262], bend: -0.22, w: 4.5, head: 18, t0: T.arr4, t1: T.clear },
      { type: 'title', id: 'm4a.4y', text: '4 年后', x: 836, y: 166, size: 44, color: 'red', rot: 3, t0: T.arr4 + 0.25, t1: T.clear },
      { type: 'title', id: 'm4a.src5', text: '（他 15 岁写的书）', x: BK.at[0], y: 712, size: 38, color: 'red', rot: -1, t0: T.src5, t1: T.clear },
      { type: 'm4_aFly0', id: 'm4a.f0', t1: T.clear },
      { type: 'm4_aShrug', id: 'm4a.qm', at: [340, 770], size: 210, t0: T.qm, t1: T.clear, shrug: T.shrug },
      { type: 'title', id: 'm4a.coin', text: '巧合？', x: 600, y: 470, size: 66, color: 'red', rot: -4, t0: T.coin, t1: T.clear },
      { type: 'title', id: 'm4a.nobody', text: '没人知道。', x: 620, y: 566, size: 54, color: 'red', rot: -2, t0: T.nobody, t1: T.clear },
      // L12–L13: next year (a teaser only)
      // under the 1986 row (which glides up here), the 1987 row: same columns, so the jump is visible at a glance
      { type: 'write', id: 'm4a.y87', text: '1987', x: X87 - 411, y: Y87 - 32, size: 64, anchor: 'middle', t0: T.y87, speed: 2400, w: 6, sfx: 'pen' },
      { type: 'e4_scores', id: 'm4a.s87', at: [X87, Y87], cell: 96, t0: T.s87, scores: [7, 7, 7, 7, 7, 5].map((v, i) => [v, T.sc87 + i * 0.18]) },
      { type: 'm4_aRing', id: 'm4a.r5', of: 'm4a.s87', i: 5, scale: 1, t0: T.ring5 },
      { type: 'label', id: 'm4a.lost', text: '只丢了 2 分', size: 54, at: [1320, 676], rot: -3, t0: T.lost, t1: DUR, target: [X87 + 253, Y87 + 62], bend: -0.2, gap: 10 },
    ],
    sfx: [[T.tao, 'pop'], [T.kid, 'pop']],
    subs: [
      { t0: 0.3, t1: 4.3, text: '8岁时，一位研究他的老师写道：', say: '八岁时，一位研究他的老师写道：' },
      { t0: 4.4, t1: 7.6, text: '小陶做完题，不爱检查。' },
      { t0: 8.3, t1: 12.1, text: '长大以后，他却常常提醒大家：' },
      { t0: 12.4, t1: 15.8, text: '“要怀疑你自己的作品。”' },
      { t0: 16.3, t1: 19.9, text: '他还说，犯过的错要记下来，' },
      { t0: 20.0, t1: 22.4, text: '以后才好避开。' },
      { t0: 23.1, t1: 26.3, text: '他说自己小时候有点倔：' },
      { t0: 26.4, t1: 31.0, text: '没弄懂的地方，不全部想通，就不罢休。' },
      { t0: 31.9, t1: 35.5, text: '巧的是：那道0分的第五题，', say: '巧的是：那道零分的第五题，' },
      { t0: 35.6, t1: 39.8, text: '四年后，被他收进了自己写的书里。' },
      { t0: 40.2, t1: 44.4, text: '是不是因为那次0分？没有人知道。', say: '是不是因为那次零分？没有人知道。' },
      { t0: 45.1, t1: 49.1, text: '我们只知道：第二年的国际奥数，' },
      { t0: 49.2, t1: 51.6, text: '他只丢了2分。', say: '他只丢了两分。' },
    ],
  });
  // the 1987 sheet: 7+7+7+7+7+5 = 40 out of 42
  { const s = [7, 7, 7, 7, 7, 5].reduce((a, b) => a + b, 0); if (s !== 40 || 42 - s !== 2) console.error('m4 arc: 1987 scores should total 40 (lost 2)', s); }
})();
