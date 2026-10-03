// 第 5 集 · 第 28 场 · 老教授的难题（id journal）
// 事实（ep5-script.md）：一位退休的老教授（片中不说名字）办的小刊物 JCMN，1987 年 10 月第 44 期问：
//   xπ + y·arctan½ + z·arctan¼ = 0 除了 x=y=z=0 有没有整数解，“Can this be proved?”；
//   1988 年 2 月第 45 期登出 “Terry Tao” 的两页证明（第 5070–5071 页）。他当时 12 岁。
// 演绎：下午茶小圆桌是第 15 场的同一个道具；证明页上的铅笔线条和式子碎片只是示意（不是证明的真实内容，所以碎片里不写等式）；
//   老教授端起茶杯点点头是画面上的演绎，没有对白。
// 开场：换成 12 岁印章（先盖在中央，飘带“1987 年 10 月”，再停靠）。结尾前 0.6 秒内全部清掉，只剩印章。
(() => {
  const FL = 780;
  /* ---------------- times (scene clock) ---------------- */
  const DOCK = 1.85, SET_IN = 1.95, PROF_IN = 2.15, BOOK_IN = 2.4;
  const OPEN = 4.45, FORM = 6.0, NOTE = 7.45, Q_EN = 9.3, LOOK = 10.0, Q_ZH = 10.5, CLOSE = 12.5;
  const CAL_IN = 12.95, FLIPS = [13.35, 13.7, 14.05, 14.4], B45 = 14.9, SPREAD = 15.55, LINES0 = 15.95, LB2 = 16.4, CAL_OUT = 17.9;
  const WALK0 = 18.3, WALK1 = 19.25, RING = 18.95, LB12 = 19.85;
  const TROPHY = 22.3, STRIKE1 = 22.95, MEDAL = 23.55, STRIKE2 = 24.2, ICONS_OUT = 25.15;
  const CARD = 25.6, REACH = 26.5, LIFT = 27.0, CAPTION = 27.3, BAND = 27.85, NOD = 28.2;
  const END = 29.6, DUR = 30.2;
  const fadeEnd = t => 1 - clamp((t - END) / 0.45);

  /* ---------------- little helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  /** multiplies the opacity of everything drawn since item n0 */
  const fadeFrom = (n0, k) => { if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); } };
  /** hand-written GLYPH characters drawn whole, x = left edge, y = top (in the current transform) */
  function glyphs(k, str, x, y, size, o = {}) {
    let gx = x;
    [...str].forEach((ch, i) => {
      const g = GLYPH[ch]; if (!g) return;
      g.s.forEach((s, j) => stroke(`${k}.${i}.${j}`, s.map(([u, v, c]) => [gx + u * size, y + v * size, c]), { z: o.z ?? Z.set + 1, w: o.w || 3, color: o.color || C.ink, opacity: o.opacity, draw: o.draw, boil: 0.5 }));
      gx += (g.w + 0.1) * size;
    });
    return gx - x;
  }
  /** a line of text that appears character by character */
  function typed(k, str, x, y, t0, t, o = {}) {
    if (t < t0) return;
    const ch = [...str], n = Math.min(ch.length, Math.floor((t - t0) * (o.cps || 12)) + 1);
    // keep the line centred on its final width while it grows (draw the full line invisibly would add a second shape)
    const full = textWidth(str, o.size || 48), part = textWidth(ch.slice(0, n).join(''), o.size || 48);
    text(k, ch.slice(0, n).join(''), x - full / 2 + part / 2, y, { size: o.size || 48, color: o.color === 'red' ? C.red : C.ink, z: o.z ?? Z.set + 2, opacity: o.opacity });
  }
  /** fades whatever `inner` (another fx) draws, to nothing over [f0, f0 + fd] */
  COMP.c5_jFade = {
    init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); return fx; },
    draw(fx, t, F) {
      const k = 1 - clamp((t - fx.f0) / (fx.fd || 0.4)); if (k <= 0) return;
      const n0 = DL.items.length;
      COMP[fx.inner.type].draw(fx.inner, t, F);
      fadeFrom(n0, k);
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };

  /* ---------------- 第 44 期：薄薄的小刊物，翻开放大 ---------------- */
  const BK = { c: [682, 612], w: 150, h: 190 };                 // the booklet in the professor's hand
  const PG = { c: [1157.5, 475], w: 725, h: 450 };               // the opened page (x 795–1520, y 250–700)
  const FORMULA = 'xπ + y·arctan(1/2) + z·arctan(1/4) = 0';
  function booklet(k, cx, cy, w, h, issue, z, op = 1) {
    stroke(k + '.cv', box(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), { z, w: 4.5, fill: C.paper, opacity: op });
    stroke(k + '.sh', [[cx - w / 2 + 10, cy + h / 2 + 7], [cx + w / 2 + 6, cy + h / 2 + 6, 1], [cx + w / 2 + 6, cy - h / 2 + 10]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7 * op, boil: 0.5 });
    stroke(k + '.sp', [[cx - w / 2 + 13, cy - h / 2 + 5], [cx - w / 2 + 13, cy + h / 2 - 5]], { z: z + 0.1, w: 3, opacity: op });
    text(k + '.t', 'JCMN', cx + 7, cy - h * 0.2, { size: 42, z: z + 0.2, opacity: op });
    stroke(k + '.ru', [[cx - w / 2 + 28, cy - h * 0.02], [cx + w / 2 - 14, cy - h * 0.02 - 2]], { z: z + 0.1, w: 2.6, opacity: op });
    text(k + '.n', `第 ${issue} 期`, cx + 7, cy + h * 0.18, { size: 36, z: z + 0.2, opacity: op });
  }
  COMP.c5_jBook = {
    draw(fx, t) {
      if (t < BOOK_IN || t >= CLOSE + 0.6) return;
      const k = 'c5jBook', z = Z.front + 1;
      // in his hand: pops in; shrinks away once the page has gone back into it
      const pop = EASE.back(clamp((t - BOOK_IN) / 0.25)), gone = EASE.in(clamp((t - (CLOSE + 0.35)) / 0.2));
      DL.save(); DL.about(BK.c[0], BK.c[1], () => DL.scale(Math.max(0.01, pop * (1 - gone))));
      booklet(k + '.bk', BK.c[0], BK.c[1], BK.w, BK.h, 44, z);
      DL.restore();
      // the page zooms out of it (and back in at the end)
      const u = EASE.out(clamp((t - OPEN) / 0.4)) * (1 - EASE.in(clamp((t - CLOSE) / 0.35)));
      if (u <= 0.002) return;
      const c = lerp2(BK.c, PG.c, u), sc = lerp(BK.w / PG.w, 1, u), W = PG.w / 2, H = PG.h / 2, zp = Z.set + 1;
      DL.save(); DL.translate(c[0], c[1]); DL.scale(sc);
      stroke(k + '.pg', box(-W, -H, W, H), { z: zp, w: 5, fill: C.paper });
      stroke(k + '.pgSh', [[-W + 14, H + 9], [W + 9, H + 8, 1], [W + 9, -H + 14]], { z: zp - 0.1, w: 2.5, color: C.pencil, opacity: 0.7, boil: 0.5 });
      const op = clamp((u - 0.85) / 0.15);
      if (op > 0) {
        text(k + '.hd', 'JCMN 第 44 期', 0, -177, { size: 44, z: zp + 0.2, opacity: op });
        stroke(k + '.hr', [[-W + 30, -142], [W - 30, -145]], { z: zp + 0.1, w: 3, opacity: op });
        typed(k + '.f', FORMULA, 0, -62, FORM, t, { size: 40, cps: 26, opacity: op });
        if (t >= NOTE) text(k + '.note', '（一道很难的题，不用看懂）', 0, 4, { size: 38, color: C.red, z: Z.annot, opacity: op * clamp((t - NOTE) / 0.15), scale: lerp(0.7, 1, EASE.back(clamp((t - NOTE) / 0.2))), halo: 8 });
        typed(k + '.q', 'Can this be proved?', 0, 100, Q_EN, t, { size: 54, cps: 17, opacity: op });
        typed(k + '.zh', '这个，能证明吗？', 0, 172, Q_ZH, t, { size: 46, cps: 9, color: 'red', z: Z.annot, opacity: op });
      }
      DL.restore();
      // zoom lines from the booklet's corners to the page's
      const zl = clamp((u - 0.9) / 0.1) * (1 - gone);
      if (zl > 0) {
        const bx = BK.c[0] + BK.w / 2 + 2, px = PG.c[0] - PG.w / 2 - 2;
        stroke(k + '.zl0', [[bx, BK.c[1] - BK.h / 2], [px, PG.c[1] - PG.h / 2]], { z: Z.set, w: 2.2, color: C.pencil, opacity: 0.7 * zl, boil: 0.5 });
        stroke(k + '.zl1', [[bx, BK.c[1] + BK.h / 2], [px, PG.c[1] + PG.h / 2]], { z: Z.set, w: 2.2, color: C.pencil, opacity: 0.7 * zl, boil: 0.5 });
      }
    },
    cues: () => {
      const c = [[BOOK_IN, 'pop'], [OPEN, 'whoosh'], [OPEN + 0.3, 'paper'], [NOTE, 'pop'], [CLOSE, 'whoosh']];
      for (let i = 0; i < [...FORMULA].length; i += 4) c.push([FORM + i / 26, 'pen']);
      for (let i = 0; i < 19; i += 4) c.push([Q_EN + i / 17, 'pen']);
      for (let i = 0; i < 8; i += 3) c.push([Q_ZH + i / 9, 'pen']);
      return c;
    },
  };

  /* ---------------- 撕页日历：10 月 → 11 → 12 → 1 → 2 月（四个月） ---------------- */
  const CAL = { x: 715, y: 200, w: 200, h: 230, band: 56 };
  const MONTHS = [10, 11, 12, 1, 2];
  const MON_L = MONTHS.map(m => layoutWriting({ text: String(m), x: 0, y: 0, size: 88, t0: -9, speed: 1, anchor: 'middle' }));
  const YEAR_W = writeWidth('1987', 34);
  const calBody = (k, i, z, op) => {   // month number + "月", centred on the page body
    const L = MON_L[i], tw = L.width + 12 + 58, x0 = CAL.x - tw / 2, cy = CAL.y + CAL.band + (CAL.h - CAL.band) / 2;
    DL.save(); DL.translate(x0 + L.width / 2, cy - 44);
    L.strokes.forEach((s, j) => stroke(k + '.m' + j, s.pts, { z, w: 7, boil: 0.5, opacity: op }));
    DL.restore();
    text(k + '.yue', '月', x0 + L.width + 12 + 29, cy + 2, { size: 58, z, opacity: op });
  };
  COMP.c5_jCal = {
    draw(fx, t) {
      if (t < CAL_IN || t >= CAL_OUT + 0.3) return;
      const { x, y, w, h, band } = CAL, z = Z.set + 1, k = 'c5jCal', p = EASE.out(clamp((t - CAL_IN) / 0.35));
      const n0 = DL.items.length;
      stroke(k + '.str', [[x - 52, y + 2], [x, y - 40, 1], [x + 52, y + 2]], { z, w: 2.4, color: C.pencil, draw: p });
      dot(k + '.nail', [x, y - 40], 4.5, C.ink, z);
      stroke(k + '.pg', box(x - w / 2, y, x + w / 2, y + h), { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.sh', [[x - w / 2 + 12, y + h + 8], [x + w / 2 + 8, y + h + 8, 1], [x + w / 2 + 8, y + 12]], { z: z - 0.1, w: 2.4, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      stroke(k + '.band', [[x - w / 2, y + band], [x + w / 2, y + band + 1]], { z: z + 0.1, w: 4, draw: p });
      let i = 0; FLIPS.forEach(f => { if (t >= f) i++; });
      const q = clamp((t - CAL_IN - 0.2) / 0.2);
      if (q > 0) {
        DL.save(); DL.translate(x - YEAR_W / 2, y + band / 2 - 18);
        glyphs(k + '.yr', i >= 3 ? '1988' : '1987', 0, 0, 34, { z: z + 0.2, w: 4.5, opacity: q });
        DL.restore();
        calBody(k + '.cur', i, z + 0.2, q);
      }
      // the page just torn off: swings from its top-left corner, drops and fades
      FLIPS.forEach((f, j) => {
        const u = (t - f) / 0.5; if (u < 0 || u >= 1) return;
        const sw = EASE.out(clamp(u / 0.25)), fall = EASE.in(clamp((u - 0.1) / 0.9)), op = 1 - clamp((u - 0.6) / 0.35), z2 = z + 0.5;
        DL.save(); DL.translate(x - w / 2 + 30 * fall, y + band + 300 * fall); DL.rotate(16 * sw + 36 * fall); DL.translate(-(x - w / 2), -(y + band));
        stroke(k + '.old' + j, box(x - w / 2, y + band, x + w / 2, y + h), { z: z2, w: 5, fill: C.paper, opacity: op });
        calBody(k + '.oldB' + j, j, z2 + 0.1, op);
        DL.restore();
      });
      [-1, 1].forEach(s => stroke(k + '.rg' + s, ringPts(k + '.rg' + s, x + s * 52, y, 10, 15, { n: 8, a0: 100, sweep: 300 }), { z: z + 0.6, w: 4, draw: p }));
      fadeFrom(n0, 1 - clamp((t - CAL_OUT) / 0.3));
    },
    cues: () => [[CAL_IN, 'paper'], ...FLIPS.map(f => [f, 'paper'])],
  };

  /* ---------------- 第 45 期：两整页 + 第三页顶上几行 ---------------- */
  const B45C = [1190, 440], PW = 205, PH = 300;
  const PAGES = [{ c: [965, 440], r: 0 }, { c: [1190, 444], r: 1.5 }, { c: [1415, 438], r: 3 }];
  // the written lines of each page, in page-local coordinates (centre origin); a few carry a little maths fragment (no equations: not the real proof)
  const LN = (() => {
    const out = [[], [], []], h = hstr('c5jPf');
    const add = (j, y, i, o = {}) => {
      const ind = o.ind ? 18 : 0, x0 = -PW / 2 + 18 + ind, full = PW - 36 - ind;
      const len = o.len ?? full * (0.82 + 0.18 * (rnd(h, j * 50 + i, 1) * 0.5 + 0.5));
      out[j].push({ y, x0, len, frag: o.frag, qed: o.qed });
    };
    for (let i = 0; i < 11; i++) add(0, -48 + i * 17.5, i, { ind: i === 0 || i === 6, frag: i === 3 ? 'x , y , z' : i === 8 ? '( x + y )' : null, len: i === 5 ? 96 : undefined });
    for (let i = 0; i < 15; i++) add(1, -126 + i * 18, i, { ind: i === 0 || i === 7 || i === 12, frag: i === 4 ? '→' : i === 10 ? 'z × 4' : null, len: i === 6 || i === 11 ? 84 : undefined });
    for (let i = 0; i < 4; i++) add(2, -126 + i * 18, i, { ind: i === 0, len: i === 3 ? 70 : undefined, qed: i === 3 });
    return out;
  })();
  const lineT = (j, i) => LINES0 + (j === 0 ? i * 0.05 : j === 1 ? 0.4 + i * 0.035 : 0.95 + i * 0.07);
  COMP.c5_jProof = {
    draw(fx, t, F) {
      if (t < B45 || t >= DUR) return;
      const k = 'c5jPf', z = Z.set + 1, fo = fadeEnd(t); if (fo <= 0) return;
      const n0 = DL.items.length;
      // the new issue pops in, then gives way to its pages
      const cq = 1 - clamp((t - SPREAD) / 0.25);
      if (cq > 0) {
        const s = EASE.back(clamp((t - B45) / 0.25)) * lerp(0.7, 1, cq);
        DL.save(); DL.about(B45C[0], B45C[1], () => DL.scale(Math.max(0.01, s)));
        booklet(k + '.bk', B45C[0], B45C[1], BK.w, BK.h, 45, z + 2, cq);
        DL.restore();
      }
      const e = EASE.out(clamp((t - SPREAD) / 0.4));
      if (e > 0) PAGES.forEach((pg, j) => {
        const c = lerp2(B45C, pg.c, e), kk = k + '.p' + j;
        DL.save(); DL.translate(c[0], c[1]); DL.rotate(pg.r * e); DL.scale(lerp(0.45, 1, e));
        stroke(kk, box(-PW / 2, -PH / 2, PW / 2, PH / 2), { z: z + j * 0.01, w: 4.5, fill: C.paper, opacity: clamp(e * 3) });
        stroke(kk + '.sh', [[-PW / 2 + 10, PH / 2 + 7], [PW / 2 + 7, PH / 2 + 6, 1], [PW / 2 + 7, -PH / 2 + 10]], { z: z - 0.2, w: 2.2, color: C.pencil, opacity: 0.65 * e, boil: 0.5 });
        if (j === 0 && t >= LINES0 - 0.1) {   // the article's title (a bold scribble) and the printed byline
          const q = clamp((t - LINES0 + 0.1) / 0.15);
          stroke(kk + '.ti', [[-58, -118], [-20, -122], [20, -117], [58, -121]], { z: z + 0.2, w: 4.5, draw: q, boil: 0.5 });
          text(kk + '.by', 'Terry Tao', 0, -88, { size: 40, z: z + 0.3, opacity: q });
        }
        LN[j].forEach((L, i) => {
          const q = clamp((t - lineT(j, i)) / 0.12); if (q <= 0) return;
          let x = L.x0;
          if (L.frag) x += glyphs(kk + '.fr' + i, L.frag, x, L.y - 15, 21, { z: z + 0.2, w: 2.8, draw: q }) + 8;
          const n = Math.max(3, Math.round((L.x0 + L.len - x) / 9)), pts = [];
          for (let m = 0; m <= n; m++) pts.push([x + (L.x0 + L.len - x) * m / n, L.y + (m % 2 ? -1.8 : 1.4)]);
          stroke(kk + '.l' + i, pts, { z: z + 0.2, w: 2.4, draw: q, boil: 0.6 });
          if (L.qed && q >= 1) glyphs(kk + '.qed', '□', L.x0 + L.len + 10, L.y - 17, 24, { z: z + 0.2, w: 3 });
        });
        DL.restore();
      });
      fadeFrom(n0, fo);
      F.targets.byline = [PAGES[0].c[0], PAGES[0].c[1] - 88];
    },
    cues: () => [[B45, 'pop'], [SPREAD, 'paper'], [SPREAD + 0.1, 'whoosh'], ...[0, 4, 8, 12, 16, 20, 24].map(i => [LINES0 + i * 0.045, 'pen'])],
  };

  /* ---------------- 没有比赛，也没有奖牌：两个小图标 ---------------- */
  const ICON = { cup: [545, 250], medal: [745, 250] };
  COMP.c5_jIcons = {
    draw(fx, t) {
      if (t < TROPHY || t >= ICONS_OUT + 0.3) return;
      const k = 'c5jIc', z = Z.set + 2, n0 = DL.items.length;
      const p1 = EASE.back(clamp((t - TROPHY) / 0.25));
      if (p1 > 0) {   // trophy: a cup with two handles on a stem and a base
        const [x, y] = ICON.cup;
        DL.save(); DL.about(x, y + 30, () => DL.scale(Math.max(0.01, p1)));
        stroke(k + '.cup', [[x - 42, y - 58], [x + 42, y - 58, 1], [x + 34, y - 12], [x + 14, y + 10], [x - 14, y + 10], [x - 34, y - 12], [x - 42, y - 58, 1]], { z, w: 4.5, fill: C.paper, closed: false });
        stroke(k + '.hL', [[x - 40, y - 48], [x - 62, y - 46], [x - 62, y - 24], [x - 34, y - 14]], { z: z - 0.1, w: 4 });
        stroke(k + '.hR', [[x + 40, y - 48], [x + 62, y - 46], [x + 62, y - 24], [x + 34, y - 14]], { z: z - 0.1, w: 4 });
        stroke(k + '.st', [[x, y + 10], [x + 1, y + 34]], { z, w: 4.5 });
        stroke(k + '.ba', box(x - 30, y + 34, x + 30, y + 52), { z, w: 4.5, fill: C.paper });
        DL.restore();
        text(k + '.l1', '比赛', x, y + 96, { size: 40, z, opacity: clamp((t - TROPHY - 0.1) / 0.15) });
      }
      const p2 = EASE.back(clamp((t - MEDAL) / 0.25));
      if (p2 > 0) {   // medal: a V ribbon and a disc with a star
        const [x, y] = ICON.medal;
        DL.save(); DL.about(x, y, () => DL.scale(Math.max(0.01, p2)));
        stroke(k + '.rL', [[x - 30, y - 62], [x - 12, y - 18]], { z: z - 0.1, w: 4 });
        stroke(k + '.rR', [[x + 30, y - 62], [x + 12, y - 18]], { z: z - 0.1, w: 4 });
        stroke(k + '.disc', ringPts(k + '.disc', x, y + 12, 36, 36, { n: 14, closed: true }), { z, w: 4.5, closed: true, fill: C.paper });
        const st = []; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * RAD, r = i % 2 ? 7 : 17; st.push([x + Math.cos(a) * r, y + 13 + Math.sin(a) * r, 1]); }
        st.push([st[0][0], st[0][1], 1]);
        stroke(k + '.star', st, { z: z + 0.1, w: 3 });
        DL.restore();
        text(k + '.l2', '奖牌', x, y + 96, { size: 40, z, opacity: clamp((t - MEDAL - 0.1) / 0.15) });
      }
      fadeFrom(n0, 1 - clamp((t - ICONS_OUT) / 0.3));
    },
    cues: () => [[TROPHY, 'pop'], [MEDAL, 'pop']],
  };

  /* ---------------- 只有一道题：第 44 期那道题，一张小卡片 ---------------- */
  COMP.c5_jCard = {
    draw(fx, t) {
      if (t < CARD || t >= DUR) return;
      const fo = fadeEnd(t); if (fo <= 0) return;
      const k = 'c5jCard', z = Z.set + 2, [x, y] = [640, 252], W = 335, H = 52, s = EASE.back(clamp((t - CARD) / 0.25));
      const n0 = DL.items.length;
      DL.save(); DL.about(x, y, () => DL.scale(Math.max(0.01, s)));
      stroke(k + '.c', box(x - W, y - H, x + W, y + H), { z, w: 4.5, fill: C.paper });
      stroke(k + '.sh', [[x - W + 10, y + H + 7], [x + W + 7, y + H + 6, 1], [x + W + 7, y - H + 10]], { z: z - 0.1, w: 2.2, color: C.pencil, opacity: 0.7, boil: 0.5 });
      text(k + '.f', FORMULA, x, y + 1, { size: 36, z: z + 0.2 });
      DL.restore();
      fadeFrom(n0, fo);
    },
    cues: () => [[CARD, 'pop']],
  };

  /* ---------------- 下午茶：第 15 场的小圆桌；他端起自己那杯时，桌上那杯不再画 ---------------- */
  const TEA = { id: 'c5jTea', at: [300, 584] };
  const CUP_H = [TEA.at[0] + 103, TEA.at[1] - 27];              // the handle of the right-hand cup (e5_tea: cup at x +78, handle +25)
  COMP.c5_jTea = {
    draw(fx, t, F) {
      if (t < SET_IN) return;
      const n0 = DL.items.length;
      COMP.prop.draw(fx.inner, t, F);
      if (t >= LIFT) for (let i = DL.items.length - 1; i >= n0; i--) if (DL.items[i].key.startsWith(TEA.id + '.c2')) DL.items.splice(i, 1);
      fadeFrom(n0, fadeEnd(t));
    },
    cues: () => [[SET_IN, 'paper']],
  };
  /** the cup in his hand (same drawing as the table's), from LIFT on */
  COMP.c5_jCup = {
    draw(fx, t, F) {
      const a = F.anchors.prof; if (!a || t < LIFT) return;
      const h = a.handL, cx = h[0] - 25, by = h[1] + 17, k = 'c5jCup', z = Z.front + 1;
      stroke(k, [[cx - 22, by - 38], [cx - 17, by, 1], [cx + 17, by, 1], [cx + 22, by - 38], [cx - 22, by - 38, 1]], { z, w: 4, closed: true, fill: C.paper });
      stroke(k + '.h', ringPts(k + '.h', cx + 25, by - 21, 9, 11, { n: 7, a0: -90, sweep: 180 }), { z, w: 3.5 });
      for (let i = 0; i < 2; i++) {
        const ph = (t * 0.7 + i * 0.5) % 1, y0 = by - 46 - ph * 40, sx = cx - 6 + i * 12;
        stroke(k + '.s' + i, [[sx, y0], [sx + 6 * Math.sin(ph * 6), y0 - 12], [sx, y0 - 24]], { z, w: 2.6, color: C.pencil, opacity: 0.7 * Math.sin(Math.PI * ph) });
      }
    },
    cues: () => [[LIFT, 'tap']],
  };

  /* ---------------- poses & faces ---------------- */
  Object.assign(POSE, {
    c5_jHold: { tilt: 3, ikR: { w: 1, to: 'abs', dx: BK.c[0] - BK.w / 2 + 6, dy: BK.c[1] - 6, bend: 'down' }, armL: [14, 10] },
    c5_jReach: { lean: -4, tilt: -5, armR: [14, 10], ikL: { w: 1, to: 'abs', dx: CUP_H[0], dy: CUP_H[1], bend: 'down' } },
    c5_jSip: { lean: -1, tilt: 3, armR: [14, 10], ikL: { w: 1, to: 'abs', dx: 434, dy: 540, bend: 'down' } },
  });
  Object.assign(FACE, {
    c5_jAsk: { brow: 'arc', browY: 0.08, eyeSY: 1.06, mouth: 'smirk', mw: 0.3 },
  });
  const nod = t => { const u = clamp((t - NOD) / 0.9); return { ...POSE.c5_jSip, tilt: 3 + 9 * Math.sin(u * Math.PI * 4) * (1 - u) }; };
  const walkT = makeWalk(WALK0, WALK1, 5.2, { lean: -4 });
  const PX = 520, TXX = 760;

  defineScene({
    id: 'journal', chapter: '老教授的难题', dur: DUR, floor: FL,
    cast: { prof: { ...E5.prof }, terry: { ...E5.terry } },
    order: ['prof', 'terry'],
    tracks: {
      prof: {
        enter: PROF_IN,
        pos: [[0, [PX, FL]], [END + 0.05, [-420, FL], 0.35, 'in']],
        pose: [[0, 'stand'], [BOOK_IN - 0.05, 'c5_jHold', 0.14, 'back'], [CLOSE + 0.5, 'stand', 0.18],
          [REACH, 'c5_jReach', 0.3], [LIFT, 'c5_jSip', 0.3], [NOD, nod, 0.05],
          [END + 0.05, { lean: -14, tilt: -6, armR: [40, 30], ikL: { w: 0 } }, 0.1]],
        face: [[0, 'smile'], [FORM, 'focus', 0.08], [LOOK, 'c5_jAsk', 0.06], [CLOSE + 0.3, 'smile', 0.1], [TROPHY, 'neutral', 0.08], [CARD, 'smile', 0.08], [NOD, 'proud', 0.08]],
        turn: [[0, 0.2], [OPEN, 0.35, 0.15], [LOOK, 0.05, 0.12], [SPREAD, 0.35, 0.15], [REACH, -0.3, 0.2], [LIFT + 0.4, 0.35, 0.2]],
        gaze: [[0, 'viewer'], [BOOK_IN + 0.2, 'book'], [OPEN + 0.2, 'page'], [LOOK, 'viewer'], [CAL_IN + 0.2, 'cal'], [SPREAD, 'pages'], [WALK1 - 0.3, 'terry'], [TROPHY, 'icons'], [CARD, 'card'], [REACH, 'cupT'], [LIFT + 0.4, 'terry']],
        squash: [[0, 1], [LOOK, 1.04, 0.06], [LOOK + 0.06, 1, 0.2, 'back']],
      },
      terry: {
        pos: [[0, [1720, FL]], [WALK0, [TXX, FL], WALK1 - WALK0, 'lin'], [END + 0.05, [1900, FL], 0.35, 'in']],
        pose: [[0, walkT], [WALK1, 'stand', 0.12], [END + 0.05, { lean: 14, tilt: 6, armL: [40, 30], armR: [40, 30] }, 0.1]],
        face: [[0, 'smile'], [TROPHY, 'neutral', 0.08], [CARD, 'smile', 0.08], [NOD + 0.1, 'grin', 0.06]],
        turn: [[0, -0.4], [WALK1, 0.3, 0.12], [LB12 + 0.4, 0, 0.12], [TROPHY, -0.15, 0.12], [LIFT + 0.4, -0.35, 0.12]],
        gaze: [[0, [-200, 520]], [WALK1, 'byline'], [LB12 + 0.4, 'viewer'], [TROPHY, 'icons'], [CARD, 'card'], [LIFT + 0.4, 'prof'], [END - 0.3, 'viewer']],
        squash: [[0, 1], [WALK1, 0.94, 0.05], [WALK1 + 0.05, 1, 0.2, 'back'], [NOD + 0.1, 1.05, 0.05], [NOD + 0.16, 1, 0.2, 'back']],
      },
    },
    targets: F => ({ book: BK.c, page: [PG.c[0] - 200, PG.c[1] - 60], cal: [CAL.x, CAL.y + 140], pages: B45C, byline: F.targets.byline || [965, 352], icons: [645, 250], card: [640, 252], cupT: CUP_H }),
    set: [{ type: 'floor', t0: SET_IN, t1: END + 0.45 }],
    fx: [
      { type: 'ageStamp', age: 12, place: '1987 年 10 月', t0: -0.1, ...E5.STAMP, dockT: DOCK, pulse: [] },
      // 周末下午茶（第 15 场同一个道具）
      { type: 'c5_jTea', id: 'c5jTeaW', inner: { type: 'prop', id: TEA.id, kind: 'e5_tea', at: TEA.at, t0: SET_IN, drawDur: 0.5 } },
      // L1–L3：第 44 期
      { type: 'c5_jBook', id: 'c5jBook' },
      // L4：四个月后，第 45 期
      { type: 'c5_jCal', id: 'c5jCal' },
      { type: 'c5_jProof', id: 'c5jPf' },
      { type: 'label', id: 'c5jLb2', text: '两页多', at: [1190, 236], rot: -3, size: 50, t0: LB2, t1: RING - 0.15 },
      // L5：作者 Terry Tao（印刷的署名），12 岁是红笔标签
      { type: 'c5_jFade', f0: LB12 + 2.0, fd: 0.3, inner: { type: 'ringRect', id: 'c5jRing', rect: [965 - 92, 352 - 24, 184, 48], t0: RING, pad: 12 } },
      { type: 'c5_jFade', f0: LB12 + 2.0, fd: 0.3, inner: { type: 'label', id: 'c5jLb12', text: '12 岁', at: [800, 262], rot: -5, size: 52, t0: LB12, t1: DUR, target: [866, 338], bend: 0.2, gap: 10 } },
      // L6：没有比赛，也没有奖牌
      { type: 'c5_jIcons', id: 'c5jIc' },
      { type: 'c5_jFade', f0: ICONS_OUT, fd: 0.3, inner: { type: 'strike', id: 'c5jSt1', rect: [ICON.cup[0] - 62, ICON.cup[1] - 62, 124, 118], t0: STRIKE1, dur: 0.25 } },
      { type: 'c5_jFade', f0: ICONS_OUT, fd: 0.3, inner: { type: 'strike', id: 'c5jSt2', rect: [ICON.medal[0] - 52, ICON.medal[1] - 62, 104, 116], t0: STRIKE2, dur: 0.25 } },
      // L7：只有一道题，和一份写完整的证明
      { type: 'c5_jCard', id: 'c5jCard' },
      { type: 'c5_jFade', f0: END, fd: 0.45, inner: { type: 'scribe', id: 'c5jCap', text: '写完整的证明', x: 1190 - 3 * 52, y: 650, size: 52, t0: CAPTION, cps: 10, z: Z.set + 3 } },
      { type: 'c5_jFade', f0: END, fd: 0.45, inner: { type: 'band', id: 'c5jHi', rect: [1190 - 3 * 52, 620, 312, 60], t0: BAND, dur: 0.4, pad: 12 } },
      { type: 'c5_jCup', id: 'c5jCup' },
    ],
    sfx: [[PROF_IN, 'pop'], [LOOK, 'boop'], [WALK1, 'pop'], [END + 0.05, 'whoosh']],
    steps: [{ t0: WALK0, t1: WALK1, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 4.1, text: '1987年10月，那位老教授，', say: '一九八七年十月，那位老教授，' },
      { t0: 4.2, t1: 8.8, text: '在他办的一份小刊物上，问了一道难题：' },
      { t0: 9.2, t1: 12.2, text: '“这个，能证明吗？”' },
      { t0: 13.1, t1: 17.9, text: '四个月后，刊物登出了一份两页多的证明。' },
      { t0: 18.3, t1: 21.5, text: '作者：陶哲轩，十二岁。' },
      { t0: 22.2, t1: 25.4, text: '没有比赛，也没有奖牌，' },
      { t0: 25.5, t1: 29.7, text: '只有一道题，和一份写完整的证明。' },
    ],
  });
})();
