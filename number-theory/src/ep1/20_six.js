// 第 2 场 · 7 和 6（six）：练习本特写（一张大横线纸，Jasper 站在右下，小问号站在旁边一摞本子上）。
// 16 − 9 = 7；16 是 4×4、9 是 3×3（小点阵）；4 × 4 → 4²（红笔“不是 4×2！”）；大 4×4 点阵拿掉左下 3×3，剩下 ┐ 形 7 个（黄色）；
// 4² − 3² = 7；Jasper 画小拐角 ┐ 当记号；小问号问“什么意思？”“0 算不算？”；规则卡片（数轴、负数便签）；
// 那 6 呢？□² − □² = 6；草稿纸越堆越高：9 − 3、16 − 10、25 − 19（右边的数不是平方：红色小 ?）；6 旁边还是空格；
// 最后分成两格：还没找到 / 根本没有，停 2 秒以上，然后全部清掉。所有算式在页面加载时验算（算错就 console.error）。
// 开场：一张大纸画出来（Jasper、小问号、一摞本子同时出现）；结尾：两格、纸、本子淡出，小问号跳走，Jasper 走出画面。
(() => {
  const FL = 780;

  /* ---------------- the maths, checked ---------------- */
  const isSq = n => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
  if (16 - 9 !== 7 || 4 * 4 !== 16 || 3 * 3 !== 9 || 4 * 4 - 3 * 3 !== 7 || 4 * 2 === 16) console.error('b1_six: 16 − 9 = 7 = 4² − 3² (and 4² is not 4×2)');
  const TRIES = [[9, 3], [16, 10], [25, 19]];
  TRIES.forEach(([a, b]) => { if (a - b !== 6 || !isSq(a) || isSq(b)) console.error('b1_six: a try for 6 should be square − non-square = 6', a, b); });
  { let n = 0; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (!(i >= 1 && j < 3)) n++; if (n !== 7) console.error('b1_six: 4×4 minus its bottom-left 3×3 should leave 7', n); }

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    PAPER: -0.2, NAME: 0.55, KID: 0.1, QM: 0.3,
    // L2–L4: 16 − 9 = 7; the small squares; 4 × 4 → 4²
    E1: 3.65, G4: 7.0, C4: 7.6, G3: 8.95, C3: 9.5, E2: 11.4, NOT42: 13.4,
    // L5–L6: the big 4×4 loses its 3×3; the ┐ of 7; 4² − 3² = 7
    SMALL_OUT: 15.2, BIG: 15.65, CUT: 17.15, SEVEN: 18.85, BAND: 20.95, E3: 21.5, IDEA: 23.35,
    // L7–L10: the mark, and the little question mark's two questions
    POINT1: 25.15, MARK: 25.9, PROUD: 27.25, QS1: 29.3, SHEEP: 31.5, QS1_OFF: 33.6,
    POINT2: 34.0, RING4: 35.45, RING3: 36.6, NOD1: 37.55, POINT2_OFF: 37.85, QS2: 39.2, PUZ: 39.6,
    // L11–L15: the rule card
    A_OUT: 41.85, MOVE: 42.0, QS2_OFF: 42.4, CARD: 43.45, CL1: 46.35, NL: 47.6, CL2: 52.05, NEG: 57.0, PULSE: 60.6, NOD2: 61.0,
    // L16–L20: what about 6?
    CARD_OUT: 64.3, W1a: 64.45, W1b: 64.95, QROW: 64.95,
    SH: [67.45, 71.6, 75.8, 79.35, 79.8], SW: [67.7, 71.85, 76.05], SQ: [69.6, 73.65, 78.0],
    SCRATCH: 80.5, SLOT: 81.0, MARKP: 81.75,
    // L21: not found yet, or not there at all?
    D_OUT: 83.0, QS3: 83.45, THINK: 83.95, PL: 83.9, PR: 85.3, QS3_OFF: 87.3,
    QM_EX: 87.55, EXa: 87.75, EXb: 88.75, END_OUT: 88.2, DUR: 88.8,
  };

  /* ---------------- helpers ---------------- */
  /** fade every item drawn since n0 by a (0..1) */
  const fadeFrom = (n0, a) => { if (a >= 1) return; for (let i = n0; i < DL.items.length; i++) { const at = DL.items[i].attrs; at.opacity = +((at.opacity ?? 1) * a).toFixed(3); } };
  /** a hand-written line, laid out now (so its glyph boxes can be used for placing things) */
  const W = (id, text, x, y, size, t0, o = {}) => {
    const fx = { type: 'write', id, text, x, y, size, t0, speed: 2600, w: 6, sfx: 'pen', gap: 0.03, glyphGap: 0.03, ...o };
    if (fx.color === 'red') fx.z = fx.z ?? Z.annot;
    layoutWriting(fx); fx._b1 = 1; return fx;
  };
  const drawLayout = (k, L, t, o = {}) => L.strokes.forEach((s, j) => {
    const q = clamp((t - s.t0) / s.dur); if (q > 0) stroke(k + '.' + j, s.pts, { z: o.z ?? Z.board, w: o.w || 5.5, color: o.color === 'red' ? C.red : C.ink, draw: q, boil: 0.55 });
  });
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const span = (bs, i0, i1) => [bs[i0].x, bs[i1].x + bs[i1].w];   // x range of glyphs i0..i1

  /** a group of components: optional move (xf: [[t, [dx, dy]]]); from `out` on it fades (and shrinks toward `about`) over `dur` */
  COMP.b1_grp = {
    init(fx) {
      fx.inner = [].concat(fx.inner);
      fx.inner.forEach(f => { const c = COMP[f.type]; if (c.init && !f._b1) { c.init(f); f._b1 = 1; } });
      return fx;
    },
    draw(fx, t, F) {
      const u = fx.out === undefined ? 0 : clamp((t - fx.out) / (fx.dur ?? 0.35));
      if (u >= 1) return;
      const n0 = DL.items.length;
      DL.save();
      if (fx.xf) { const d = evalTrack(fx.xf, t); DL.translate(d[0], d[1]); }
      if (u > 0 && fx.about) { const e = EASE.in(u); DL.about(fx.about[0], fx.about[1], () => DL.scale(1 - (fx.shrink ?? 0.25) * e)); }
      fx.inner.forEach(f => COMP[f.type].draw(f, t, F));
      DL.restore();
      fadeFrom(n0, 1 - u);
    },
    cues: fx => fx.inner.flatMap(f => (COMP[f.type].cues ? COMP[f.type].cues(f) : [])).concat(fx.out !== undefined && fx.whoosh ? [[fx.out, 'whoosh']] : []),
  };
  /** free drawing: fn(t, lt, key, F) from t0 on */
  COMP.b1_fn = {
    draw(fx, t, F) { if (t < fx.t0) return; fx.fn(t, t - fx.t0, fx.id, F); },
    cues: fx => fx.cues || [],
  };

  /* ---------------- the page (a big ruled sheet) and the pile of exercise books ---------------- */
  const PAGE = { x0: 36, y0: 84, x1: 1254, y1: 772 };
  const RULES = [192, 289, 386, 483, 580, 677];   // baselines: the written lines sit on them
  PROPS.b1_paper = (fx, t, lt, p) => {
    const { x0, y0, x1, y1 } = PAGE, k = fx.id, z = Z.set;
    stroke(k + '.sheet', [[x0, y0], [x1, y0 + 3, 1], [x1 - 3, y1, 1], [x0 + 3, y1 - 2, 1], [x0, y0, 1]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.shade', [[x0 + 14, y1 + 8], [x1 + 8, y1 + 6, 1], [x1 + 8, y0 + 14]], { z: z - 0.5, w: 2.4, color: C.pencil, opacity: 0.6 * p, boil: 0.5 });
    RULES.forEach((y, i) => stroke(k + '.l' + i, [[x0 + 24, y], [x1 - 24, y + 1]], { z: z + 0.1, w: 1.8, color: C.pencil, opacity: 0.5, draw: stag(p, 1, 3), boil: 0.4 }));
    stroke(k + '.m', [[96, y0 + 12], [96, y1 - 12]], { z: z + 0.1, w: 1.8, color: C.red, opacity: 0.45, draw: stag(p, 2, 3), boil: 0.4 });
  };
  const BOOKS = { at: [1515, FL], top: FL - 104 };   // the little question mark stands on the top book
  PROPS.b1_books = (fx, t, lt, p) => {
    const k = fx.id, z = Z.desk;
    [[0, -17, 154, 34, 0], [-6, -51, 142, 34, -1.5], [5, -86, 134, 36, 2]].forEach(([cx, cy, w, h, r], i) => {
      DL.save(); DL.about(cx, cy, () => DL.rotate(r));
      stroke(`${k}.b${i}`, rect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), { z: z + i * 0.1, w: 4.5, fill: C.paper, draw: stag(p, i, 3) });
      stroke(`${k}.e${i}`, [[cx - w / 2 + 12, cy + h / 2 - 9], [cx + w / 2 - 6, cy + h / 2 - 9]], { z: z + i * 0.1 + 0.05, w: 2.2, color: C.pencil, opacity: 0.8, draw: stag(p, i, 3) });
      DL.restore();
    });
    shadow(k + '.shadow', 0, 4, 180, p);
  };

  /* ---------------- L2–L4: 16 − 9 = 7, the small squares, 4 × 4 → 4² ---------------- */
  const E1 = W('b1e1', '16 − 9 = 7', 120, 100, 92, T.E1);
  const cx16 = (E1.boxes[0].x + E1.boxes[1].x + E1.boxes[1].w) / 2, cx9 = E1.boxes[5].x + E1.boxes[5].w / 2;
  const G4 = { type: 'n1_dots', id: 'b1g4', x: cx16 - 1.5 * 46, y: 232, N: 4, gap: 46, t0: T.G4, pop: 0.5 };
  const G3 = { type: 'n1_dots', id: 'b1g3', x: cx9 - 46, y: 278, N: 3, gap: 46, t0: T.G3, pop: 0.45 };
  const C4 = W('b1c4', '4×4', cx16, 400, 48, T.C4, { anchor: 'middle', w: 5 });
  const C3 = W('b1c3', '3×3', cx9, 400, 48, T.C3, { anchor: 'middle', w: 5 });
  const E2 = W('b1e2', '4 × 4 → 4²', 120, 500, 80, T.E2);
  const SQ2 = E2.boxes[9];   // the little ² of 4²
  const NOT42 = { type: 'label', id: 'b1n42', text: '不是 4×2！', at: [560, 672], rot: -3, size: 46, t0: T.NOT42, t1: 999, target: [SQ2.x + SQ2.w / 2, E2.y + 80 * 0.46], bend: 0.15 };

  /* ---------------- L5–L6: the big 4×4 loses its bottom-left 3×3: 7 left, the ┐ ---------------- */
  const BIG = { type: 'n1_dots', id: 'b1big', x: 760, y: 150, N: 4, gap: 76, t0: T.BIG, pop: 0.6, cut: { k: 3, t: T.CUT }, band: { t: T.BAND } };
  const SEVEN = { type: 'label', id: 'b1l7', text: '7 个', at: [836, 302], rot: -3, size: 52, t0: T.SEVEN, t1: 999 };

  // L6: 4² − 3² = 7 (under the big square); L7: Jasper's mark ┐ after the 7; L9: rings round the two squares.
  // From L11 on this line is the page's header: it moves to the top-left (the 7 sits right where the 7 of 16 − 9 = 7 was).
  const E3 = W('b1e3', '4² − 3² = 7', 700, 500, 80, T.E3);
  const HDR = [150 - E3.x, 112 - E3.y];           // the move: header at (150, 112), baseline on the first rule (192)
  const HDR_XF = [[0, [0, 0]], [T.MOVE, HDR, 0.7, 'io']];
  const MARK_AT = [E3.boxes[10].x + E3.boxes[10].w + 44, E3.y + 40];
  const MARK = { type: 'prop', id: 'b1mark', kind: 'n1_mark', at: MARK_AT, t0: T.MARK, drawDur: 0.35, size: 50, w: 7,
    scale: [[0, 1], [T.MARKP, 1.35, 0.15, 'out'], [T.MARKP + 0.2, 1, 0.3]], sfxAt: [[T.MARK, 'pen'], [T.MARKP, 'boop']] };
  const ringOver = (k, L, i0, i1, p) => {
    const [x0, x1] = span(L.boxes, i0, i1), h = L.size;
    stroke(k, ringPts(k, (x0 + x1) / 2 + 3, L.y + h * 0.42, (x1 - x0) / 2 + 24, h / 2 + 19, { n: 12, a0: -140, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: p });
  };
  // L12 "两个数": red rings round the two numbers themselves, the bases 4 and 3 (not the little ²); they stay through L13 (前一个 / 后一个)
  const ringBase = (k, L, i, p) => {
    const b = L.boxes[i], h = L.size;
    stroke(k, ringPts(k, b.x + b.w / 2 - 3, L.y + h * 0.52, b.w / 2 + 10, h / 2 + 12, { n: 12, a0: -140, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, draw: p });
  };
  const BASES = { type: 'b1_fn', id: 'b1bs', t0: T.CL1, cues: [[T.CL1, 'pen'], [T.CL1 + 0.3, 'pen']],
    fn: (t, lt, k) => { ringBase(k + '.a', E3, 0, EASE.out(clamp(lt / 0.3))); ringBase(k + '.b', E3, 5, EASE.out(clamp((lt - 0.3) / 0.3))); } };
  const RINGS = { type: 'b1_fn', id: 'b1rg', t0: T.RING4, cues: [[T.RING4, 'pen'], [T.RING3, 'pen']],
    fn: (t, lt, k) => { ringOver(k + '.a', E3, 0, 1, EASE.out(clamp(lt / 0.35))); ringOver(k + '.b', E3, 5, 6, EASE.out(clamp((t - T.RING3) / 0.35))); } };

  /* ---------------- L11–L15: the rule card (lines written as they are said) ---------------- */
  const CARD_AT = [640, 470];
  // local version of the card's "负数：以后" sticky note: the shared one (100 wide) is narrower than its own text (150)
  PROPS.b1_card = (fx, t, lt, p) => {
    const n0 = DL.items.length, k = fx.id;
    PROPS.n1_card({ ...fx, neg: undefined }, t, lt, p);
    if (lt >= fx.neg) {
      const u = EASE.back(clamp((lt - fx.neg) / 0.3)), y = 300 / 2 - 58, cx = -fx.w / 2 - 6, hw = 88, z = Z.annot - 1;
      stroke(k + '.ng', rect(cx - hw, y - 28, cx + hw, y + 24), { z: z + 0.6, w: 3, fill: '#FFF6B8', draw: u });
      text(k + '.ngt', '负数：以后', cx, y - 2, { size: 30, z: z + 0.7, anchor: 'middle', color: C.red, opacity: u });
    }
    for (let i = n0; i < DL.items.length; i++) {
      const it = DL.items[i], m = /\.l(\d)$/.exec(it.key);
      if (!m || !it.key.startsWith(fx.id + '.')) continue;
      const tr = fx.reveal[+m[1]], chars = [...(it.text || '')];
      if (t < tr) { it.text = ''; it.attrs.opacity = 0; continue; }
      it.text = chars.slice(0, Math.min(chars.length, Math.floor((t - tr) * 10) + 1)).join('');
    }
  };
  const CARD = {
    type: 'prop', id: 'b1card', kind: 'b1_card', t0: T.CARD, drawDur: 0.5, w: 660,
    pos: [[0, [CARD_AT[0], CARD_AT[1] - 24]], [T.CARD, CARD_AT, 0.3, 'back']],
    scale: [[0, 1.2], [T.PULSE, 1.27, 0.25, 'out'], [T.PULSE + 0.3, 1.2, 0.35]],
    lines: ['两个数都是 0 或正整数', '前一个比后一个大；后一个可以是 0'], reveal: [T.CL1, T.CL2],
    nl: T.NL - T.CARD, neg: T.NEG - T.CARD,
    sfxAt: [[T.CARD, 'paper'], [T.CARD + 0.32, 'pop'], [T.CL1, 'pen'], [T.CL1 + 0.5, 'pen'], [T.NL, 'pen'], [T.CL2, 'pen'], [T.CL2 + 0.6, 'pen'], [T.NEG, 'plip'], [T.PULSE, 'boop']],
  };

  /* ---------------- L16: what about 6?  □² − □² = 6, its '=' under the header's '=' ---------------- */
  const qTmp = layoutWriting({ text: '□² − □² = 6', x: 0, y: 0, size: 80, t0: 0, speed: 1 });
  const QROW = W('b1qr', '□² − □² = 6', E3.boxes[8].x + HDR[0] - qTmp.boxes[8].x, 209, 80, T.QROW);
  const SLOT_AT = [MARK_AT[0] + HDR[0], MARK_AT[1] + HDR[1] + (QROW.y - (E3.y + HDR[1]))];
  const SLOT = { type: 'b1_fn', id: 'b1slot', t0: T.SLOT, cues: [[T.SLOT, 'boop']],
    fn: (t, lt, k) => {   // an empty, dashed spot where the mark would go (pencil)
      const s = Math.max(0.01, EASE.back(clamp(lt / 0.3))), h = 29 * s, [cx, cy] = SLOT_AT;
      const c = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
      for (let i = 0; i < 4; i++) {
        const a = c[i], b = c[(i + 1) % 4];
        [[0.06, 0.38], [0.62, 0.94]].forEach(([u0, u1], j) => stroke(`${k}.d${i}_${j}`, [lerp2(a, b, u0), lerp2(a, b, u1)], { z: Z.board, w: 3.5, color: C.pencil }));
      }
    } };

  /* ---------------- L17–L20: scratch paper, piling up ---------------- */
  const SHEET = { w: 400, h: 170 };
  const SHEETS = [
    { at: [930, 640], rot: -2, tx: '9 − 3' }, { at: [916, 560], rot: 2, tx: '16 − 10' }, { at: [940, 480], rot: -1.5, tx: '25 − 19' },
    { at: [922, 400], rot: 2.5, scrib: true }, { at: [942, 320], rot: -2.5, scrib: true },
  ].map((s, i) => {
    const o = { ...s, i, t0: T.SH[i], type: 'b1_sheet', id: 'b1sh' + i };
    if (s.tx) {
      o.L = layoutWriting({ text: s.tx, x: -170, y: 22, size: 58, t0: T.SW[i], speed: 1500, gap: 0.04, glyphGap: 0.04 });
      o.Q = layoutWriting({ text: '?', x: o.L.x + o.L.width + 18, y: 12, size: 46, t0: T.SQ[i], speed: 1600 });
    }
    return o;
  });
  const toWorld = (s, p) => { const r = s.rot * RAD, c = Math.cos(r), sn = Math.sin(r); return [s.at[0] + c * p[0] - sn * p[1], s.at[1] + sn * p[0] + c * p[1]]; };
  COMP.b1_sheet = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, u = EASE.out(clamp(lt / 0.28)), k = fx.id, z = Z.board + fx.i * 0.5, { w, h } = SHEET;
      DL.save(); DL.translate(fx.at[0] + (1 - u) * 90, fx.at[1] - (1 - u) * 60); DL.rotate(fx.rot + (1 - u) * 10);
      stroke(k + '.s', [[-w / 2, -h / 2], [w / 2, -h / 2 + 2, 1], [w / 2 - 2, h / 2, 1], [-w / 2 + 2, h / 2 - 2, 1], [-w / 2, -h / 2, 1]], { z, w: 4, fill: C.paper, opacity: clamp(lt / 0.1) });
      if (fx.L) {
        drawLayout(k + '.w', fx.L, t, { z: z + 0.2, w: 5.5 });
        drawLayout(k + '.q', fx.Q, t, { z: z + 0.3, w: 5, color: 'red' });
      }
      if (fx.scrib) {   // more tries, scribbled and crossed out
        const sp = clamp((lt - 0.2) / 0.35);
        [[-165, 40, 14], [-150, 70, 9]].forEach(([x0, y, n], j) => {
          const pts = []; for (let q = 0; q <= n; q++) pts.push([x0 + q * 22, y + (q % 2 ? -14 : 10) + (q % 3) * 3]);
          stroke(`${k}.z${j}`, pts, { z: z + 0.2, w: 3.5, draw: clamp(sp * 2 - j * 0.6), boil: 0.8 });
        });
        stroke(k + '.x', [[-178, 82], [150, 22]], { z: z + 0.3, w: 4.5, color: C.red, draw: clamp((lt - 0.5) / 0.2) });
      }
      DL.restore();
    },
    cues: fx => [[fx.t0, 'paper']].concat(fx.L ? [[fx.L.t0, 'pen'], [fx.L.t0 + 0.3, 'pen'], [fx.Q.t0, 'pen']] : [[fx.t0 + 0.25, 'pen'], [fx.t0 + 0.5, 'pen']]),
  };
  const PILE_C = [930, 520];

  /* ---------------- L21: two boxes: not found yet / not there at all ---------------- */
  const BOX_L = [90, 172, 610, 690], BOX_R = [690, 172, 1210, 690], GND = 650;   // top below the name on the page
  const panel = (k, box, lt, cap) => {
    const [x0, y0, x1, y1] = box;
    stroke(k + '.f', rect(x0, y0, x1, y1), { z: Z.board, w: 5, fill: C.paper, draw: EASE.out(clamp(lt / 0.4)) });
    const cu = clamp((lt - 0.3) / 0.22);
    if (cu > 0) text(k + '.cap', cap, (x0 + x1) / 2, y0 + 58, { size: 56, z: Z.board + 1, scale: lerp(0.6, 1, EASE.back(cu)), opacity: clamp(cu * 3) });
    stroke(k + '.g', [[x0 + 30, GND], [x1 - 30, GND + 2]], { z: Z.board + 0.5, w: 2.4, color: C.pencil, opacity: 0.8, draw: clamp((lt - 0.35) / 0.3) });
  };
  // left: a little person, still flipping through a pile of scratch paper
  const quad = (a, b, c, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * b[0] + u * u * c[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * b[1] + u * u * c[1]];
  const SEARCH = { type: 'b1_fn', id: 'b1pl', t0: T.PL, cues: [[T.PL, 'paper'], [T.PL + 0.3, 'pop'], [T.PL + 0.9, 'paper'], [T.PL + 1.6, 'paper']],
    fn: (t, lt, k) => {
      panel(k, BOX_L, lt, '还没找到');
      const a = clamp((lt - 0.4) / 0.3); if (a <= 0) return;
      const z = Z.board + 1, o = { z, w: 4.5, opacity: a };
      for (let i = 0; i < 6; i++) { const y = GND - 6 - i * 9, x = 445 + [0, 6, -5, 8, -3, 4][i]; stroke(`${k}.pp${i}`, rect(x - 64, y - 4, x + 64, y + 4), { z: z + i * 0.01, w: 3, fill: C.paper, opacity: a }); }
      const fl = Math.max(0, Math.sin(lt * 2 * Math.PI / 0.9));
      const hip = [300, 590], neck = [328, 540], head = [348, 510], sh = [324, 550];
      stroke(k + '.lgL', [hip, [292, 620], [278, GND]], o);
      stroke(k + '.lgR', [hip, [316, 620], [328, GND]], o);
      stroke(k + '.bd', [hip, neck], o);
      stroke(k + '.amA', [sh, [356, 574], [386, 594 - 14 * fl]], o);
      stroke(k + '.amB', [sh, [348, 584], [378, 604]], o);
      stroke(k + '.hd', ringPts(k + '.hr', head[0], head[1], 26, 26, { n: 12, closed: true }), { ...o, closed: true, fill: C.paper });
      dot(k + '.e0', [356, 514], 3.6, C.ink, z + 0.1); dot(k + '.e1', [368, 513], 3.6, C.ink, z + 0.1);
      for (let j = 0; j < 3; j++) {   // pages flying up out of the pile, over his head
        const s = lt - 0.55 - j * 0.33; if (s < 0) continue;
        const u = (s / 1.0) % 1, p = quad([432, 596], [372, 250], [176 + j * 28, 450], u), al = a * (1 - clamp((u - 0.72) / 0.28));
        DL.save(); DL.about(p[0], p[1], () => DL.rotate(u * 470 + j * 40));
        stroke(`${k}.fy${j}`, rect(p[0] - 22, p[1] - 16, p[0] + 22, p[1] + 16), { z: z + 0.3, w: 3, fill: C.paper, opacity: al });
        stroke(`${k}.fz${j}`, [[p[0] - 12, p[1] - 3], [p[0] + 12, p[1] - 3]], { z: z + 0.35, w: 2, color: C.pencil, opacity: al });
        DL.restore();
      }
    } };
  // right: a door with a padlock on it
  const LOCKED = { type: 'b1_fn', id: 'b1pr', t0: T.PR, cues: [[T.PR, 'paper'], [T.PR + 0.3, 'pop'], [T.PR + 0.95, 'thud']],
    fn: (t, lt, k) => {
      panel(k, BOX_R, lt, '根本没有');
      const a = clamp((lt - 0.4) / 0.3); if (a <= 0) return;
      const z = Z.board + 1, cx = 950;
      stroke(k + '.door', [[870, GND], [870, 330, 1], [1030, 330, 1], [1030, GND]], { z, w: 5.5, fill: C.paper, opacity: a });
      stroke(k + '.in', [[892, GND - 14], [892, 352, 1], [1008, 352, 1], [1008, GND - 14]], { z: z + 0.1, w: 2.4, color: C.pencil, opacity: 0.8 * a });
      dot(k + '.knob', [1008, 498], 7, C.ink, z + 0.2);
      const lu = EASE.back(clamp((lt - 0.8) / 0.25)); if (lu <= 0) return;
      const ly = 520 - (1 - lu) * 70, la = clamp(lu * 3), arc = [];
      for (let i = 0; i <= 8; i++) { const g = Math.PI + i / 8 * Math.PI; arc.push([cx + 24 * Math.cos(g), ly - 18 + 24 * Math.sin(g)]); }
      stroke(k + '.shk', [[cx - 24, ly + 4], ...arc, [cx + 24, ly + 4]], { z: z + 0.3, w: 6, opacity: la });
      stroke(k + '.lb', superPts(cx, ly + 26, 80, 58, 20, 7), { z: z + 0.4, w: 5, closed: true, fill: C.paper, opacity: la });
      dot(k + '.kh', [cx, ly + 20], 6.5, C.ink, z + 0.5);
      stroke(k + '.kh2', [[cx, ly + 24], [cx, ly + 38]], { z: z + 0.5, w: 5, opacity: la });
    } };

  /* ---------------- poses ---------------- */
  Object.assign(POSE, {
    b1_pointUL: { lean: 2, tilt: 4, armScale: 1.5, armL: [118, 4], armR: [14, 10] },   // points up-left at the page (arm clear of the face)
  });
  // writing on the scratch paper: the left hand reaches for the pen tip (out of reach → the arm points at it)
  const reachFor = s => t => {
    const p = toWorld(s, penAt(t < s.Q.t0 - 0.05 ? s.L : s.Q, t));
    return { lean: -2, tilt: -5, armScale: 1.6, armR: [14, 10], ikL: { w: 1, to: 'abs', dx: p[0], dy: p[1], bend: 'down' } };
  };
  const JX = 1370, JX2 = 1290;
  const walkIn = makeWalk(T.W1a, T.W1b, 5.2), walkOut = makeWalk(T.EXa, T.EXb, 5.6);
  const qmHead = [BOOKS.at[0], BOOKS.top - 160 * 0.75];
  const reachKeys = [0, 1, 2].flatMap(i => [[T.SW[i] - 0.15, reachFor(SHEETS[i]), 0.15, 'back'], [SHEETS[i].Q.tEnd + 0.25, 'stand', 0.15]]);
  if (SHEETS.slice(0, 3).some((s, i) => s.L.tEnd > s.Q.t0 || s.Q.tEnd + 0.4 > (T.SW[i + 1] ?? T.SCRATCH))) console.error('b1_six: scratch-paper timing overlaps');

  defineScene({
    id: 'six', chapter: '7 和 6', dur: T.DUR, floor: FL,
    cast: { kid: { ...N1.kid, z: 6 } },   // z: in front of the pile of books when he walks out past them
    order: ['kid'],
    tracks: {
      kid: {
        enter: T.KID,
        pos: [[0, [JX, FL]], [T.W1a, [JX2, FL], T.W1b - T.W1a, 'lin'], [T.EXa, [1720, FL], T.EXb - T.EXa, 'lin']],
        pose: [[0, 'stand'],
          [T.POINT1, 'b1_pointUL', 0.12, 'back'], [T.PROUD, 'stand', 0.15],
          [T.POINT2, 'b1_pointUL', 0.12, 'back'], [T.POINT2_OFF, 'stand', 0.15],
          [T.PUZ, 'thinkStand', 0.14, 'back'], [T.QS2_OFF, 'stand', 0.15],
          [T.W1a, walkIn, 0.08], [T.W1b, 'stand', 0.1],
          ...reachKeys,
          [T.SCRATCH, 'scratchStand', 0.14, 'back'], [T.THINK, 'thinkStand', 0.14, 'back'],
          [T.EXa, walkOut, 0.08]],
        face: [[0, 'smile'], [T.E1, 'focus', 0.1], [T.NOT42 + 0.3, 'grin', 0.08], [T.BIG, 'focus', 0.1], [T.SEVEN, 'smile', 0.1],
          [T.IDEA, 'idea', 0.08], [T.POINT1, 'grin', 0.08], [T.PROUD, 'proud', 0.1], [T.QS1 + 0.1, 'surprised', 0.08], [T.SHEEP, 'sheepish', 0.1],
          [T.POINT2, 'smile', 0.1], [T.PUZ, 'puzzled', 0.1], [T.QS2_OFF, 'focus', 0.1], [T.CL2 + 0.4, 'smile', 0.1], [T.PULSE + 0.2, 'proud', 0.1],
          [T.W1a, 'focus', 0.1], [T.QROW + 0.4, 'grin', 0.1],
          [T.SW[0], 'focus', 0.1], [T.SQ[0], 'puzzled', 0.1], [T.SW[1], 'focus', 0.1], [T.SQ[1], 'sheepish', 0.1], [T.SW[2], 'focus', 0.1], [T.SQ[2], 'puzzled', 0.1],
          [T.SCRATCH, 'sheepish', 0.1], [T.THINK, 'puzzled', 0.1], [T.EXa - 0.3, 'smile', 0.1]],
        turn: [[0, -0.2], [0.9, -0.3, 0.12], [T.PROUD, 0, 0.12], [T.QS1 + 0.1, 0.35, 0.12], [T.POINT2, -0.3, 0.12], [T.POINT2_OFF, 0.35, 0.12],
          [T.QS2_OFF, -0.3, 0.12], [T.THINK, -0.25, 0.12], [T.EXa - 0.3, 0.5, 0.1]],
        squash: [[0, 1], [T.IDEA, 0.9, 0.08], [T.IDEA + 0.08, 1.06, 0.1], [T.IDEA + 0.2, 1, 0.12],
          [T.SQ[0], 0.94, 0.08], [T.SQ[0] + 0.08, 1, 0.12], [T.SQ[1], 0.94, 0.08], [T.SQ[1] + 0.08, 1, 0.12]],
        gaze: [[0, 'viewer'], [0.9, 'name'], [T.E1, 'e1'], [T.G4, 'grids'], [T.E2, 'e2'], [T.NOT42 + 0.2, 'n42'], [T.BIG, 'big'], [T.E3, 'e3'],
          [T.POINT1, 'mark'], [T.PROUD, 'viewer'], [T.QS1 + 0.1, 'qmh'], [T.POINT2, 'e3'], [T.POINT2_OFF, 'qmh'],
          [T.QS2_OFF, 'card'], [T.CL1, 'e3'], [T.CL1 + 1.1, 'card'], [T.W1a, 'qrow'], [T.SW[0] - 0.2, 'sh0'], [T.SW[1] - 0.2, 'sh1'], [T.SW[2] - 0.2, 'sh2'], [T.SH[3], 'pile'],
          [T.SLOT, 'slot'], [T.THINK, 'panelL'], [T.PR + 0.1, 'panelR'], [T.QS3_OFF - 0.3, 'viewer']],
      },
    },
    targets: F => {
      const d = evalTrack(HDR_XF, F.t), pen = i => toWorld(SHEETS[i], [-80, 50]);
      return {
        name: [1170, 130], e1: [380, 146], grids: [250, 320], e2: [340, 540], n42: [560, 672], big: [874, 264],
        e3: [925 + d[0], 540 + d[1]], mark: [MARK_AT[0] + d[0], MARK_AT[1] + d[1]], qmh: qmHead, card: CARD_AT,
        qrow: [360, 249], slot: SLOT_AT, sh0: pen(0), sh1: pen(1), sh2: pen(2), pile: [PILE_C[0], 380],
        panelL: [350, 450], panelR: [950, 450],
      };
    },
    fx: [
      // the page (with Jasper's name on it) and the pile of exercise books: there from the start, faded at the end
      { type: 'b1_grp', id: 'b1pgG', out: T.END_OUT, dur: 0.4, inner: [
        { type: 'prop', id: 'b1pg', kind: 'b1_paper', at: [0, 0], t0: T.PAPER, drawDur: 0.55, sfxAt: [[0.02, 'paper']] },
        { type: 'scribe', id: 'b1nm', text: 'Jasper', x: 1112, y: 130, size: 40, t0: T.NAME, cps: 10, z: Z.set + 0.3 },
      ] },
      { type: 'b1_grp', id: 'b1bkG', out: T.END_OUT, dur: 0.4, inner: { type: 'prop', id: 'b1bk', kind: 'b1_books', at: BOOKS.at, t0: T.PAPER, drawDur: 0.5 } },

      // L2–L10: the working on the page; it all fades at L11 (except 4² − 3² = 7 and its mark, which become the header)
      { type: 'b1_grp', id: 'b1A', out: T.A_OUT, dur: 0.4, whoosh: true, inner: [
        E1,
        { type: 'b1_grp', id: 'b1sg', out: T.SMALL_OUT, dur: 0.35, inner: [G4, G3, C4, C3] },
        E2, NOT42, BIG, SEVEN,
      ] },
      { type: 'b1_grp', id: 'b1hdr', out: T.D_OUT, dur: 0.4, xf: HDR_XF, inner: [
        E3, MARK, { type: 'b1_grp', id: 'b1rgG', out: T.A_OUT, dur: 0.35, inner: RINGS },
        { type: 'b1_grp', id: 'b1bsG', out: T.CARD_OUT, dur: 0.4, inner: BASES },
      ] },

      // L11–L15: the rule card; at L16 it shrinks away toward the top-right corner
      { type: 'b1_grp', id: 'b1cdG', out: T.CARD_OUT, dur: 0.45, about: [1180, 150], shrink: 0.7, whoosh: true, inner: CARD },

      // L16–L20: □² − □² = 6, the scratch paper pile, the empty spot after the 6
      { type: 'b1_grp', id: 'b1qG', out: T.D_OUT, dur: 0.4, inner: [QROW, SLOT] },
      { type: 'b1_grp', id: 'b1shG', out: T.D_OUT, dur: 0.4, about: PILE_C, shrink: 0.12, whoosh: true, inner: SHEETS },

      // L21: two boxes
      { type: 'b1_grp', id: 'b1pnG', out: T.END_OUT, dur: 0.4, inner: [SEARCH, LOCKED] },

      // 小问号, standing on the pile of exercise books
      {
        type: 'qm', id: 'b1qm', size: 150, t0: T.QM, signSide: 'left', signSize: 50,
        pos: [[0, [BOOKS.at[0], BOOKS.top]], [T.QM_EX, [1740, BOOKS.top - 70], 0.5, 'in']],
        mood: [[0, 'neutral'], [T.QS1, 'doubt'], [T.QS1_OFF, 'neutral'], [T.NOD1, 'happy'], [T.QS2, 'surprised'], [T.QS2 + 0.4, 'doubt'],
          [T.QS2_OFF, 'happy'], [T.CARD + 0.8, 'neutral'], [T.NOD2, 'happy'], [T.CARD_OUT, 'neutral'], [T.SLOT, 'doubt'], [T.PR + 1.2, 'neutral']],
        act: [[0, 'idle'], [T.QS1, 'tap'], [T.QS1 + 1.6, 'idle'], [T.NOD1, 'nod'], [T.NOD1 + 1.1, 'idle'], [T.QS2 + 0.4, 'tap'], [T.QS2 + 1.8, 'idle'],
          [T.QS2_OFF, 'hop'], [T.QS2_OFF + 0.9, 'idle'], [T.NOD2, 'nod'], [T.NOD2 + 1.1, 'idle'], [T.QS3, 'tap'], [T.QS3 + 1.5, 'idle'], [T.QM_EX, 'hop']],
        sign: [[0, null], [T.QS1, '什么意思？'], [T.QS1_OFF, null], [T.QS2, '0 算不算？'], [T.QS2_OFF, null], [T.QS3, '哪一种？'], [T.QS3_OFF, null]],
        gaze: [[0, 'e1'], [T.G4, 'grids'], [T.E2, 'e2'], [T.BIG, 'big'], [T.E3, 'e3'], [T.MARK, 'mark'], [T.PROUD, 'kid'], [T.POINT2, 'e3'], [T.NOD1, 'kid'],
          [T.QS2_OFF, 'card'], [T.W1a, 'qrow'], [T.SH[0], 'sh0'], [T.SH[1], 'sh1'], [T.SH[2], 'sh2'], [T.SCRATCH, 'kid'], [T.SLOT, 'slot'],
          [T.QS3, 'kid'], [T.PL + 0.2, 'panelL'], [T.PR + 0.2, 'panelR'], [T.QS3_OFF - 0.3, 'viewer']],
        sfxAt: [[T.QS1, 'boop'], [T.QS2, 'boop'], [T.QS3, 'boop'], [T.QM_EX, 'hop']],
      },
    ],
    sfx: [[T.MOVE, 'whoosh']],
    steps: [{ t0: T.W1a, t1: T.W1b, hz: 5.2 }, { t0: T.EXa, t1: T.EXb, hz: 5.6 }],
    subs: [
      { t0: 0.3, t1: 3.35, text: "Jasper的本子上写着：" },   // L1
      { t0: 3.55, t1: 6.35, text: "16减9等于7。", say: "十六减九等于七。" },   // L2
      { t0: 6.75, t1: 10.82, text: "16是4乘4，9是3乘3。", say: "十六是四乘四，九是三乘三。" },   // L3
      { t0: 11.22, t1: 14.87, text: "4乘4，可以写成4的平方。", say: "四乘四，可以写成四的平方。" },   // L4
      { t0: 15.57, t1: 20.33, text: "4×4的点阵，拿掉3×3，剩下7个。", say: "四乘四的点阵，拿掉三乘三，剩下七个。" },   // L5
      { t0: 20.83, t1: 24.28, text: "所以，7是两个平方的差。", say: "所以，七是两个平方的差。" },   // L6
      { t0: 24.98, t1: 28.65, text: "“我给它画个小拐角，当记号。”", voice: "kid", say: "我给它画个小拐角，当记号。" },   // L7
      { t0: 29.15, t1: 33.4, text: "“小拐角是什么意思？别人看得懂吗？”", voice: "qm", say: "小拐角是什么意思？别人看得懂吗？" },   // L8
      { t0: 33.8, t1: 38.68, text: "“意思是：能写成一个平方减另一个平方。”", voice: "kid", say: "意思是：能写成一个平方减另一个平方。" },   // L9
      { t0: 39.08, t1: 41.73, text: "“0的平方算不算？”", voice: "qm", say: "零的平方算不算？" },   // L10
      { t0: 42.23, t1: 45.89, text: "好问题。规则得写清楚：" },   // L11
      { t0: 46.19, t1: 51.72, text: "两个数，都从0、1、2、3……里挑，", say: "两个数，都从零、一、二、三……里挑，" },   // L12
      { t0: 51.92, t1: 56.37, text: "前一个比后一个大，后一个可以是0。", say: "前一个比后一个大，后一个可以是零。" },   // L13
      { t0: 56.57, t1: 60.02, text: "比0还小的数，以后再说。", say: "比零还小的数，以后再说。" },   // L14
      { t0: 60.42, t1: 64.07, text: "写清楚了，别人才能照着用。" },   // L15
      { t0: 64.97, t1: 67.14, text: "那6呢？", say: "那六呢？" },   // L16
      { t0: 67.54, t1: 71.32, text: "“9减3？3不是平方。”", voice: "kid", say: "九减三？三不是平方。" },   // L17
      { t0: 71.72, t1: 75.52, text: "“16减10？10也不是。”", voice: "kid", say: "十六减十？十也不是。" },   // L18
      { t0: 75.92, t1: 78.64, text: "“25减19……”", voice: "kid", say: "二十五减十九……" },   // L19
      { t0: 79.24, t1: 82.89, text: "找了半天，6还没有小拐角。", say: "找了半天，六还没有小拐角。" },   // L20
      { t0: 83.39, t1: 87.04, text: "“是还没找到，还是根本没有？”", voice: "qm", say: "是还没找到，还是根本没有？" },   // L21
    ],
  });
})();
