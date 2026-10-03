// 第 50 场 · 没及格的课。
// 事实（他自己的回忆，AMS《Living Proof》2019）：喜欢的课都拿高分；觉得无聊的课勉强及格，有两门干脆没及格。
// 其中一门量子力学：老师早就提醒期末要写一篇讲这门学问历史的小文章，他一直没管，直到考试那天；在考场上哭了，被陪着走出考场。
// 年龄只有《纽约时报》2015 说是“大约十二岁”。长大后（IEEE 2021）：想告诉小时候的自己，要养成更认真的学习习惯、不感兴趣的课也要用心听。
// 课程卡上只写“喜欢的课”“无聊的课”（具体是哪几门没有记录，只有量子力学是他点名说的）；日历上的数字只表示“一天天过去”。
// 开场接第 40 场：只有停靠好的 13 岁印章 → 换成 12 岁（飘带“左右”）。结尾只剩停靠好的“长大后”印章，交给第 60 场。
(() => {
  const FL = 780, DUR = 57.6;

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    s13out: 0.12, s12: 0.18, s12dock: 1.7,
    walk0: 1.2, bld: 1.95, door: 3.95, inFade: 3.62, bldOff: 4.05,
    cards: 4.4, kid2: 4.7, hi: [6.2, 6.45, 6.7], cheer: 6.3, cheerEnd: 7.9,
    bore: 8.4, yawn: 8.9, thermo: 9.25, rise: 9.65, yawnEnd: 10.45,
    fail: [13.35, 13.75], others: 15.5, fly: 15.9, flip: 16.9, bigOut: 19.0,
    room: 19.15, teach: 19.3, kid3: 19.4, doodle: 19.9, warn: 20.0, l1: 20.9, l2: 21.8, l3: 24.1, point: 25.9, roomOff: 26.95,
    cal: 27.45, flip0: 28.0, look: 29.7, calOff: 30.95,
    paper: 31.35, sad: 32.7, tears: 32.95, door2: 33.8, proc: 34.45, procAt: 35.05, hand: 35.15, stand: 35.6, out0: 36.0, out1: 37.7, gone: 37.2, examOff: 37.3,
    back: 37.75, fail2: 39.45, note: 40.0, pulse: 41.2, backOff: 42.95,
    s12out: 43.15, sAd: 43.2, sAdDock: 44.95, tao0: 44.9, tao1: 46.1, squat: 46.15, kid: 45.4, self: 45.9, selfOff: 48.4, src: 47.0,
    say1: 48.6, hi1: 49.6, nod1: 50.3, say2: 52.3, nod2: 54.6, smile: 55.0, end: 56.95,
  };
  // calendar: ten pages fly off, faster and faster; under the last one: 考试
  const FLIPS = (() => { let tt = T.flip0; return [0.32, 0.26, 0.21, 0.17, 0.14, 0.11, 0.1, 0.09, 0.08, 0.07].map(d => (tt += d) - d); })();
  T.exam = FLIPS[9];

  /* ---------------- little helpers ---------------- */
  const box = (k, x0, y0, x1, y1, o) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], o);
  /** fades out (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: must stay at the end of fx */
  COMP.x5_bFade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.3));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** the age stamp, which can shrink away into its corner at `out` (to make room for the next one) */
  COMP.x5_bStamp = {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.out !== undefined && t >= fx.out + 0.2)) return;
      const s = fx.out !== undefined && t > fx.out ? 1 - EASE.in(clamp((t - fx.out) / 0.2)) : 1;
      DL.save(); if (s < 1) DL.about(fx.dock[0], fx.dock[1], () => DL.scale(Math.max(0.01, s)));
      COMP.ageStamp.draw(fx, t, F);
      DL.restore();
    },
    cues: fx => COMP.ageStamp.cues(fx),
  };
  /** a red rubber stamp that slams down (paper inside, so the lines under it are covered). o: {size, rot, check, op, wk, z} */
  function rubber(k, cx, cy, label, t0, t, o = {}) {
    const sp = clamp((t - t0) / 0.16); if (sp <= 0) return;
    const size = o.size || 40, wk = o.wk || 1, W = textWidth(label, size) / 2 + (o.check ? 50 : 18), H = size * 0.72, op = (o.op ?? 1) * clamp(sp * 2), z = o.z ?? Z.annot;
    DL.save(); DL.translate(cx, cy); DL.scale(lerp(1.8, 1, EASE.out(sp))); DL.rotate(o.rot ?? -8);
    box(k + '.o', -W, -H, W, H, { z, w: 4.5 * wk, color: C.red, fill: C.paper, opacity: op, boil: 0.6 });
    box(k + '.i', -W + 7, -H + 7, W - 7, H - 7, { z, w: 2 * wk, color: C.red, opacity: op, boil: 0.6 });
    text(k + '.t', label, o.check ? -22 : 0, 2, { size, color: C.red, z: z + 0.1, opacity: op });
    if (o.check) { const g = GLYPH['✓']; stroke(k + '.ck', g.s[0].map(([u, v, c]) => [W - 56 + u * size, -size / 2 + v * size, c]), { z: z + 0.1, w: 5 * wk, color: C.red, opacity: op }); }
    DL.restore();
  }

  /** yellow highlighter drawn ABOVE a speech line (multiply blend), so the speech's paper halo cannot hide it. {rect, t0, t1, dur, pad} */
  COMP.x5_bHiTop = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [x, y, w, h] = fx.rect, pad = fx.pad ?? 8, p = EASE.out(clamp((t - fx.t0) / (fx.dur || 0.35)));
      const x0 = x - pad, xe = lerp(x0, x + w + pad, p), y0 = y + h * 0.08, y1 = y + h * 0.96, top = [], bot = [];
      for (let i = 0; i <= 8; i++) { const xx = lerp(x0, xe, i / 8); top.push([xx, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([xx, y1 + Math.sin(i * 2.3) * 4]); }
      stroke(fx.id, top.concat(bot), { z: Z.annot + 0.5, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    },
    cues: fx => [[fx.t0, 'swish']],
  };

  /* ---------------- L1: the university ---------------- */
  const BX = 700;   // centre of the building (its door)
  PROPS.x5_bUni = (fx, t, lt, p) => {
    const k = fx.id, z = Z.set, n = 5;
    box(k + '.st1', -300, -22, 300, 0, { z, w: 4.5, fill: C.paper, draw: stag(p, 0, n) });
    box(k + '.st2', -272, -44, 272, -22, { z, w: 4.5, fill: C.paper, draw: stag(p, 0, n) });
    box(k + '.wall', -250, -400, 250, -44, { z: z - 0.2, w: 3, draw: stag(p, 1, n) });
    [-215, -120, 120, 215].forEach((x, i) => {
      box(k + '.c' + i, x - 17, -398, x + 17, -50, { z, w: 4.5, fill: C.paper, draw: stag(p, 1, n) });
      box(k + '.cc' + i, x - 27, -412, x + 27, -398, { z, w: 4, fill: C.paper, draw: stag(p, 2, n) });
      box(k + '.cb' + i, x - 25, -56, x + 25, -44, { z, w: 4, fill: C.paper, draw: stag(p, 2, n) });
      stroke(k + '.cl' + i, [[x - 5, -388], [x - 5, -62]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.7 * stag(p, 2, n), boil: 0.4 });
    });
    // the open door: a dark (pencil-hatched) doorway
    box(k + '.dr', -64, -260, 64, -44, { z, w: 5, draw: stag(p, 2, n) });
    for (let i = 0; i < 10; i++) stroke(k + '.dh' + i, [[-54 + i * 12, -250], [-58 + i * 12, -50]], { z: z - 0.1, w: 2.2, color: C.pencil, opacity: 0.75 * stag(p, 3, n), boil: 0.5 });
    box(k + '.ent', -278, -476, 278, -412, { z, w: 5, fill: C.paper, draw: stag(p, 3, n) });
    if (lt > 0.3) text(k + '.name', '大学', 0, -443, { size: 54, z: z + 0.2, opacity: clamp((lt - 0.3) / 0.2) });
    stroke(k + '.ped', [[-298, -476], [0, -592, 1], [298, -476, 1], [-298, -476, 1]], { z, w: 5, fill: C.paper, draw: stag(p, 4, n) });
    stroke(k + '.ped2', [[-230, -488], [0, -572, 1], [230, -488, 1]], { z: z + 0.1, w: 2.4, color: C.pencil, draw: stag(p, 4, n), boil: 0.5 });
  };

  /* ---------------- L2–L5, L11: the course cards, the thermometer, the 量子力学 card ---------------- */
  const CW = 236, CH = 140, CXS = [520, 790, 1060], RYS = [262, 516];
  const CARDS = [0, 1, 2, 3, 4, 5].map(i => ({ x: CXS[i % 3], y: RYS[(i / 3) | 0], title: i < 3 ? '喜欢的课' : '无聊的课', t0: (i < 3 ? T.cards : T.bore) + (i % 3) * 0.14 }));
  const QM = 3, BIG = { at: [800, 400], s: 2.6 }, WKB = 1 / Math.pow(2.6, 0.8);
  /** a course card, centred on the origin. wk thins the lines when the card is drawn big */
  function card(k, title, p, op, z, wk) {
    box(k + '.bx', -CW / 2, -CH / 2, CW / 2, CH / 2, { z, w: 5 * wk, fill: C.paper, draw: p, opacity: op });
    stroke(k + '.sh', [[-CW / 2 + 10, CH / 2 + 7], [CW / 2 + 7, CH / 2 + 7, 1], [CW / 2 + 7, -CH / 2 + 10]], { z: z - 0.1, w: 2.4 * wk, color: C.pencil, opacity: 0.6 * op * p, boil: 0.5 });
    const tp = clamp((p - 0.6) / 0.4); if (tp <= 0) return;
    text(k + '.ti', title, 0, -28, { size: 44, z: z + 0.2, opacity: op * tp });
    [18, 42].forEach((y, j) => stroke(k + '.ln' + j, [[-84, y], [84 - j * 34, y + 1]], { z: z + 0.1, w: 2.2 * wk, color: C.pencil, opacity: 0.55 * op * tp, boil: 0.4 }));
  }
  /** the back of the 量子力学 card: the name and an atom (three orbits, electrons going round) */
  function cardBack(k, t, z, wk) {
    box(k + '.bx', -CW / 2, -CH / 2, CW / 2, CH / 2, { z, w: 5 * wk, fill: C.paper });
    stroke(k + '.sh', [[-CW / 2 + 10, CH / 2 + 7], [CW / 2 + 7, CH / 2 + 7, 1], [CW / 2 + 7, -CH / 2 + 10]], { z: z - 0.1, w: 2.4 * wk, color: C.pencil, opacity: 0.6, boil: 0.5 });
    text(k + '.ti', '量子力学', 0, -38, { size: 40, z: z + 0.2 });
    const ac = [0, 28];
    dot(k + '.nu', ac, 6.5, C.ink, z + 0.3);
    [0, 60, 120].forEach((a, j) => {
      DL.save(); DL.translate(ac[0], ac[1]); DL.rotate(a);
      stroke(k + '.or' + j, ringPts(k + '.or' + j, 0, 0, 40, 13, { n: 14, closed: true }), { z: z + 0.2, w: 2.6 * wk, closed: true });
      const e = t * 2.2 + j * 2.1;
      dot(k + '.el' + j, [Math.cos(e) * 40, Math.sin(e) * 13], 3.6, C.ink, z + 0.3);
      DL.restore();
    });
  }
  const TH = { x: 1330, top: 420, bulb: 618, pass: 516 };
  function thermo(k, t, op) {
    const lt = t - T.thermo; if (lt < 0 || op <= 0) return;
    const p = EASE.out(clamp(lt / 0.4)), z = Z.set + 1, { x, top, bulb, pass } = TH;
    stroke(k + '.tube', [[x - 15, bulb - 24], [x - 15, top + 12], [x - 9, top], [x + 9, top], [x + 15, top + 12], [x + 15, bulb - 24]], { z, w: 4.5, draw: p, opacity: op });
    stroke(k + '.bulb', ringPts(k + '.b', x, bulb, 28, 28, { n: 12, a0: -60, sweep: 300 }), { z, w: 4.5, draw: p, opacity: op });
    for (let i = 0; i < 5; i++) stroke(k + '.tk' + i, [[x - 16, top + 30 + i * 32], [x - 28, top + 30 + i * 32]], { z, w: 2.4, color: C.pencil, opacity: op * p, boil: 0.4 });
    // the pass line + its name
    stroke(k + '.pl', [[x - 42, pass], [x + 40, pass + 1]], { z: z + 0.2, w: 3.5, draw: p, opacity: op });
    if (lt > 0.25) text(k + '.pt', '及格', x + 82, pass, { size: 40, z: z + 0.2, opacity: op * clamp((lt - 0.25) / 0.2) });
    // the level creeps up, overshoots a hair and settles just past the line
    if (p > 0.6) {
      const u = EASE.back(clamp((t - T.rise) / 0.9)), lev = lerp(bulb - 20, pass - 12, u);
      dot(k + '.bf', [x, bulb], 19, C.ink, z + 0.1);
      stroke(k + '.lev', [[x, bulb - 12], [x, lev]], { z: z + 0.1, w: 13, opacity: op, boil: 0.3 });
    }
  }
  COMP.x5_bCards = {
    draw(fx, t) {
      const k = fx.id;
      const op = 1 - clamp((t - T.others) / 0.3);
      CARDS.forEach((c, i) => {
        if (t < c.t0 || (i === QM && t >= T.fly) || (i !== QM && op <= 0)) return;
        const p = EASE.out(clamp((t - c.t0) / 0.35)), o1 = i === QM ? 1 : op;   // the 量子力学 card stays
        DL.save(); DL.translate(c.x, c.y);
        card(k + '.c' + i, c.title, p, o1, Z.set + 1, 1);
        if (i < 3) rubber(k + '.hi' + i, 8, 30, '高分', T.hi[i], t, { check: true, op, rot: -8 + i * 3 });
        if (i === 3 || i === 4) rubber(k + '.f' + i, 6, 30, '不及格', T.fail[i - 3], t, { op: o1, rot: -10 + (i - 3) * 7 });
        DL.restore();
      });
      thermo(k + '.th', t, op);
      // L5: one of the two failed cards flies to the middle, grows, and turns over: 量子力学
      const c = CARDS[QM];
      if (t >= T.fly && t < T.bigOut + 0.3) {
        const u = EASE.io(clamp((t - T.fly) / 0.6)), out = EASE.in(clamp((t - T.bigOut) / 0.3));
        const s = lerp(1, BIG.s, u) * (1 - out), at = lerp2([c.x, c.y], BIG.at, u), v = clamp((t - T.flip) / 0.3), wk = 1 / Math.pow(Math.max(1, lerp(1, BIG.s, u)), 0.8);
        if (s > 0.01) {
          DL.save(); DL.translate(at[0], at[1]); DL.scale(s); DL.scale(Math.max(0.03, Math.abs(Math.cos(Math.PI * v))), 1);
          if (v < 0.5) { card(k + '.c' + QM, c.title, 1, 1, Z.set + 2, wk); rubber(k + '.f' + QM, 6, 30, '不及格', T.fail[0], t, { rot: -10, wk }); }
          else cardBack(k + '.bk', t, Z.set + 2, wk);
          DL.restore();
        }
      }
      // L11: it comes back, and the stamp comes down on it
      if (t >= T.back && t < T.backOff + 0.3) {
        const pop = Math.max(0.01, EASE.back(clamp((t - T.back) / 0.3))), out = EASE.in(clamp((t - T.backOff) / 0.3)), s = BIG.s * pop * (1 - out);
        if (s > 0.01) {
          DL.save(); DL.translate(BIG.at[0], BIG.at[1]); DL.scale(s);
          cardBack(k + '.bk', t, Z.set + 2, WKB);
          rubber(k + '.f9', 2, 22, '不及格', T.fail2, t, { rot: -12, size: 34, wk: WKB });
          DL.restore();
        }
      }
    },
    cues: () => [[T.cards, 'paper'], [T.bore, 'paper'], ...T.hi.map(h => [h, 'stamp']), [T.thermo, 'pop'], [T.rise, 'zip'], ...T.fail.map(h => [h, 'stamp']),
      [T.others, 'swish'], [T.fly, 'whoosh'], [T.flip, 'whip'], [T.bigOut, 'swish'], [T.back, 'pop'], [T.fail2, 'stamp']],
  };

  /* ---------------- L6–L8: the classroom; he draws his own maths ---------------- */
  const BD = { x: 330, y: 250, w: 680, h: 310 }, TCH = 250, DX = 1300, DTOP = 642, KY = 650;
  const LINES = [['期末考试：', T.l1, 322], ['写一篇小文章', T.l2, 406], ['（这门学问的历史）', T.l3, 490]];
  const LX = BD.x + 40, CPS = 6;
  /** where the teacher's chalk is: at the end of whatever is being written */
  const chalkAt = t => {
    let at = [LX + 30, LINES[0][2] + 20];
    LINES.forEach(([s, t0, y]) => { if (t >= t0) { const n = Math.min([...s].length, Math.floor((t - t0) * CPS) + 1); at = [LX + n * 56 - 10, y + 20]; } });
    return at;
  };
  // doodles floating up beside his pencil: a triangle, a spiral, a circle with a diameter, triangle numbers (1, 3, 6 dots)
  const DOODLES = [20.2, 21.5, 22.8, 24.1, 25.4, 26.7, 28.0, 29.1];
  COMP.x5_bDoodle = {
    draw(fx, t) {
      DOODLES.forEach((d0, i) => {
        if (d0 >= fx.t1) return;
        const u = (t - d0) / 1.6; if (u < 0 || u >= 1) return;
        const c = [DX + 112 + u * 50, DTOP - 34 - u * 108], op = clamp(u * 5) * (1 - clamp((u - 0.6) / 0.4)), k = fx.id + '.' + i, s = 26, z = Z.fx, w = 3.2;
        const kind = i % 4;
        if (kind === 0) stroke(k, [[c[0] - s, c[1] + s * 0.8], [c[0], c[1] - s, 1], [c[0] + s, c[1] + s * 0.8, 1], [c[0] - s, c[1] + s * 0.8, 1]], { z, w, opacity: op });
        if (kind === 1) { const pts = []; for (let j = 0; j <= 18; j++) { const a = j * 0.62, r = 3 + j * 1.45; pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } stroke(k, pts, { z, w, opacity: op }); }
        if (kind === 2) { stroke(k, ringPts(k, c[0], c[1], s, s, { n: 12, closed: true }), { z, w, closed: true, opacity: op }); stroke(k + 'd', [[c[0] - s, c[1]], [c[0] + s, c[1]]], { z, w: 2.6, opacity: op }); }
        if (kind === 3) [[0, -1], [-0.5, 0], [0.5, 0], [-1, 1], [0, 1], [1, 1]].forEach(([a, b], j) => { const q = [c[0] + a * 20, c[1] + b * 18], r = 4.5; stroke(k + 'p' + j, ringPts(k + 'p' + j, q[0], q[1], r, r, { n: 6, closed: true }), { z, w: 2.6, closed: true, fill: C.ink, opacity: op }); });
      });
    },
  };

  /* ---------------- L8: the calendar ---------------- */
  const CAL = { at: [640, 400], w: 330, h: 380 };
  function glyphs(k, str, x, y, size, o = {}) {   // GLYPH text drawn whole; x = centre, y = top
    let w = 0; [...str].forEach(ch => { w += (GLYPH[ch].w + 0.1) * size; }); w -= 0.1 * size;
    let gx = x - w / 2;
    [...str].forEach((ch, i) => {
      const g = GLYPH[ch];
      g.s.forEach((s, j) => stroke(`${k}.${i}.${j}`, s.map(([u, v, c]) => [gx + u * size, y + v * size, c]), { z: o.z, w: o.w || 8, opacity: o.opacity, boil: 0.55 }));
      gx += (g.w + 0.1) * size;
    });
  }
  function calPage(k, idx, z, op) {
    const { w, h } = CAL, y0 = -h / 2 + 62;
    box(k + '.pg', -w / 2 + 8, y0, w / 2 - 8, h / 2, { z, w: 4.5, fill: C.paper, opacity: op });
    if (idx < 10) glyphs(k + '.n', String(idx + 1), 0, y0 + 70, 150, { z: z + 0.1, opacity: op });
    else text(k + '.ex', '考试', 0, y0 + 150, { size: 110, z: z + 0.1, opacity: op });
  }
  COMP.x5_bCal = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), k = fx.id, z = Z.set + 1, { w, h } = CAL;
      DL.save(); DL.translate(CAL.at[0], CAL.at[1]); DL.scale(pp);
      // the pad under the pages, and the binding strip
      stroke(k + '.st0', [[-w / 2 + 14, h / 2 + 8], [w / 2 - 2, h / 2 + 8, 1], [w / 2 - 2, -h / 2 + 70]], { z: z - 0.2, w: 2.6, color: C.pencil, boil: 0.5 });
      box(k + '.hd', -w / 2, -h / 2, w / 2, -h / 2 + 62, { z: z + 0.5, w: 5, fill: C.paper });
      [-90, 90].forEach((x, i) => stroke(k + '.rg' + i, ringPts(k + '.rg' + i, x, -h / 2 + 4, 11, 20, { n: 9, a0: 180, sweep: 300 }), { z: z + 0.6, w: 4 }));
      let n = 0; FLIPS.forEach(f => { if (t >= f) n++; });
      calPage(k + '.p' + (n % 2), n, z, 1);
      // the page that just came off flies up and away
      if (n > 0) { const u = (t - FLIPS[n - 1]) / 0.18; if (u < 1) { DL.save(); DL.translate(0, -160 * EASE.out(u)); DL.rotate(-10 * u); calPage(k + '.fly', n - 1, z + 0.3, 1 - u); DL.restore(); } }
      DL.restore();
      const rp = EASE.out(clamp((t - T.exam - 0.2) / 0.35));
      if (rp > 0) stroke(k + '.ring', ringPts(k + '.ring', CAL.at[0], CAL.at[1] + 22, 150, 86, { n: 12, a0: -140, sweep: 385, rv: 0.05 }), { z: Z.annot, w: 5, color: C.red, draw: rp });
    },
    cues: fx => [[fx.t0, 'pop'], ...FLIPS.map(f => [f, 'tap']), [T.exam, 'thud'], [T.exam + 0.2, 'pen']],
  };

  /* ---------------- L9–L10: the exam ---------------- */
  PROPS.x5_bExam = (fx, t, lt, p) => {
    PROPS.e5_page({ id: fx.id, w: 560, h: 520, lines: 0, title: '期末考试' }, t, lt, p);
    const k = fx.id, z = Z.set + 0.3, tp = clamp((lt - 0.35) / 0.25);
    if (tp > 0) {
      text(k + '.q1', '写一篇小文章：', 0, -140, { size: 50, z, opacity: tp });
      text(k + '.q2', '量子力学的历史', 0, -78, { size: 50, z, opacity: tp });
    }
    for (let i = 0; i < 5; i++) stroke(k + '.al' + i, [[-236, -6 + i * 52], [236, -5 + i * 52]], { z: z - 0.1, w: 2, color: C.pencil, opacity: 0.5, draw: stag(p, 1, 3), boil: 0.4 });
  };
  /** two quiet tears, one per eye, sliding down now and then. Keyed as the character's own so they read as part of the face. */
  COMP.x5_bTears = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const r = a.r;
      [-1, 1].forEach((s, i) => {
        const lt = t - fx.t0 - i * 0.7; if (lt < 0) return;
        const u = (lt / 1.9) % 1, x = a.head[0] + s * (0.36 + 0.05 * u) * r, y = a.head[1] + (0.34 + 0.7 * u) * r;
        const op = clamp(u / 0.12) * (1 - clamp((u - 0.75) / 0.25)), sz = 6.5 + 2 * u;
        stroke(fx.char + '.tear' + i, [[x, y - sz * 1.5, 1], [x + sz * 0.8, y + sz * 0.1], [x, y + sz], [x - sz * 0.8, y + sz * 0.1], [x, y - sz * 1.5, 1]], { z: Z.front + 1, w: 3, fill: C.paper, opacity: op, boil: 0.4 });
      });
    },
  };

  /* ---------------- poses, faces ---------------- */
  Object.assign(POSE, {
    // a one-arm stretch (the other arm hangs): not the two-arm cheer
    x5_bYawn: { tilt: 6, lean: 2, armScale: 1.75, armL: [128, 32], armR: [16, 12] },
    // down on one knee: the near leg's foot planted (thigh level, shin straight down), the far knee on the floor
    x5_bKneel: { legL: [85, -85], legR: [15, 75], lean: -6, tilt: -6, armL: [62, 44], armR: [22, -14] },
  });
  Object.assign(FACE, {
    x5_bYawn: { eyes: 'happy', eyeSY: 0.28, brow: 'arc', browY: 0.12, mouth: 'jaw', mo: 0.58, headSY: 1.05 },   // eyes squeezed shut, mouth wide open
    x5_bSad: { lidL: 0.36, lidR: 0.36, brow: 'line', browL: -20, browR: -20, browY: 0.02, mouth: 'frown', mw: 0.26 },
  });
  const doodlePose = t => ({ ...POSE.sitBase, tilt: 7, lean: 4, ikL: { w: 1, to: 'desk', dx: -42, dy: -2, bend: 'down' },
    ikR: { w: 1, to: 'desk', dx: 28 + 9 * Math.sin(t * 7.3), dy: -4 + 3 * Math.sin(t * 11.1), bend: 'down' } });
  const writePose = t => { const c = chalkAt(t); return { lean: 3, armScale: 1.45, armL: [12, 6], ikR: { w: 1, to: 'abs', dx: c[0] + 6 * Math.sin(t * 9), dy: c[1] + 4 * Math.sin(t * 13), bend: 'down' } }; };
  // the proctor's hand rests on the boy's shoulder (it follows him as he gets up and walks out)
  const K3POS = [[0, [DX, KY]], [T.stand, [DX, FL], 0.25, 'io'], [T.out0, [DX + 260, FL], T.out1 - T.out0, 'lin'], [T.gone + 0.32, [2200, FL], 0]];
  const shoulder = t => { const p = evalTrack(K3POS, t); return [p[0] + 26, lerp(KY - 52, FL - 138, clamp((t - T.stand) / 0.25))]; };
  const procPose = t => {
    const base = t < T.out0 ? makeWalk(T.proc + 0.1, T.procAt, 5.2)(t) : makeWalk(T.out0, T.out1, 5.2)(t), sh = shoulder(t);
    return { ...base, armScale: 1.12, lean: -4, ikL: { w: EASE.io(clamp((t - T.hand) / 0.25)), to: 'abs', dx: sh[0], dy: sh[1], bend: 'down' } };
  };
  const nod = t => { for (const n0 of [T.nod1, T.nod2]) { const u = t - n0; if (u > 0 && u < 0.8) return { tilt: 9 * Math.sin(u / 0.4 * Math.PI) }; } return { tilt: 0 }; };

  defineScene({
    id: 'boring', chapter: '没及格的课', dur: DUR, floor: FL,
    cast: {
      terry: { ...E5.terry, bag: true, bagFloor: [BX, FL] },   // L1: walks into the university
      terry2: { ...E5.terry },                                // L2–L4: beside the course cards
      teacher: { ...E5.expert },                              // L6–L7: the quantum mechanics teacher (a generic grown-up)
      proctor: { ...E5.proctor },
      terry3: { ...E5.terry, desk: [DX, DTOP - 3] },          // L6–L10: at a desk (class, then the exam)
      tao: { ...E5.taoAdult },                                // L12–L14: grown up
      kid: { ...E5.terry },                                   // … talking to his younger self
    },
    order: ['terry', 'terry2', 'teacher', 'proctor', 'terry3', 'tao', 'kid'],
    tracks: {
      terry: {
        enter: T.walk0 - 0.1,
        pos: [[0, [1720, FL]], [T.walk0, [BX, FL], T.door - T.walk0, 'lin'], [T.door + 0.05, [-900, FL], 0]],
        pose: [[0, makeWalk(T.walk0, T.door, 5.2, { bag: true, idle: 'carryBag' })]],
        face: [[0, 'smile']],
        turn: [[0, -0.45]],
      },
      terry2: {
        enter: T.kid2,
        pos: [[0, [205, FL]], [T.others + 0.32, [-900, FL], 0]],
        pose: [[0, 'stand'], [T.cheer, 'kidCheer', 0.12, 'back'], [T.cheerEnd, 'stand', 0.15], [T.yawn, 'x5_bYawn', 0.15, 'back'], [T.yawnEnd, 'stand', 0.2]],
        face: [[0, 'smile'], [T.cheer, 'grin', 0.06], [T.cheerEnd, 'smile', 0.1], [T.bore, 'bored', 0.1], [T.yawn, 'x5_bYawn', 0.1], [T.yawnEnd, 'bored', 0.12],
          [T.fail[0], 'surprised', 0.06], [T.fail[1] + 0.6, 'sheepish', 0.1]],
        turn: [[0, 0.4]],
        gaze: [[0, 'top'], [T.bore, 'bottom'], [T.rise, 'thermo'], [T.yawnEnd + 0.3, 'bottom'], [T.fail[0], 'fail0'], [T.fail[1], 'fail1']],
        squash: [[0, 1], [T.cheer, 1.08, 0.05], [T.cheer + 0.05, 1, 0.22, 'back'], [T.fail[0], 0.92, 0.05], [T.fail[0] + 0.05, 1, 0.22, 'back']],
      },
      teacher: {
        enter: T.teach,
        pos: [[0, [TCH, FL]], [T.roomOff + 0.32, [-900, FL], 0]],
        pose: [[0, 'stand'], [T.l1 - 0.1, writePose, 0.15], [T.point, 'present', 0.15, 'back']],
        face: [[0, 'neutral'], [T.point, { ...FACE.focus, mouth: 'o' }, 0.08]],
        turn: [[0, 0.45]],
        gaze: [[0, 'viewer'], [T.l1 - 0.2, 'chalk'], [T.point, 'terry3']],
      },
      proctor: {
        enter: T.proc,
        pos: [[0, [1510, FL]], [T.proc + 0.1, [DX + 150, FL], T.procAt - T.proc - 0.1, 'lin'], [T.out0, [DX + 410, FL], T.out1 - T.out0, 'lin'], [T.gone + 0.32, [2300, FL], 0]],
        pose: [[0, procPose]],
        face: [[0, { ...FACE.neutral, brow: 'arc', browY: 0.02 }]],
        turn: [[0, -0.45], [T.out0, 0.3, 0.15]],
        gaze: [[0, 'terry3']],
      },
      terry3: {
        enter: T.kid3,
        pos: K3POS,
        pose: [[0, 'sitUp'], [T.doodle, doodlePose, 0.12], [T.look, 'sitUp', 0.1, 'back'], [T.stand, 'stand', 0.25],
          [T.out0, makeWalk(T.out0, T.out1, 4.6)]],
        face: [[0, 'neutral'], [T.doodle, 'smile', 0.1], [T.look, 'surprised', 0.05], [T.calOff, 'neutral', 0.15], [T.sad, 'x5_bSad', 0.15]],
        turn: [[0, -0.3], [T.stand, 0.3, 0.2]],
        gaze: [[0, 'teacher'], [T.doodle, 'paper'], [T.look, 'cal'], [T.paper + 0.2, 'exam'], [T.sad, 'paper'], [T.hand, 'proctor'], [T.stand + 0.3, [1700, 760]]],
        squash: [[0, 1], [T.look, 1.07, 0.05], [T.look + 0.05, 1, 0.25, 'back']],
      },
      tao: {
        enter: T.tao0 - 0.1,
        pos: [[0, [1720, FL]], [T.tao0, [930, FL], T.tao1 - T.tao0, 'lin']],
        pose: [[0, makeWalk(T.tao0, T.tao1, 4.8)], [T.squat, 'x5_bKneel', 0.18, 'back']],
        face: [[0, 'smile'], [T.say1, { ...FACE.smile, brow: 'arc', browY: 0.03 }, 0.08]],
        turn: [[0, -0.5]],
        gaze: [[0, 'kid']],
      },
      kid: {
        enter: T.kid,
        pos: [[0, [560, FL]]],
        pose: [[0, nod]],
        face: [[0, 'neutral'], [T.say1, 'focus', 0.1], [T.nod1, 'neutral', 0.1], [T.smile, 'smile', 0.1]],
        turn: [[0, 0.4]],
        gaze: [[0, 'tao']],
      },
    },
    targets: F => ({
      top: [790, 262], bottom: [790, 516], thermo: [TH.x, TH.pass], fail0: [CXS[0], RYS[1]], fail1: [CXS[1], RYS[1]],
      chalk: chalkAt(F.t), paper: [DX + 30, DTOP + 4], cal: CAL.at, exam: [560, 300],
    }),
    set: [
      { type: 'floor', t0: T.bld },
      { type: 'board', ...BD, t0: T.room, t1: T.roomOff + 0.32 },
      { type: 'desk', x: DX, top: DTOP, w: 230, t0: T.room, t1: T.examOff + 0.32 },
      { type: 'door', x: 1510, w: 170, top: 330, t0: T.door2, t1: T.examOff + 0.32 },
    ],
    steps: [{ t0: T.walk0, t1: T.door, hz: 5.2 }, { t0: T.proc + 0.1, t1: T.procAt, hz: 5.2 }, { t0: T.out0, t1: T.out1, hz: 4.6 }, { t0: T.tao0, t1: T.tao1, hz: 4.8 }],
    fx: [
      // the stamp: 13 (as scene 40 left it) → 12 左右 → 长大后
      { type: 'x5_bStamp', age: 13, t0: -3, ...E5.STAMP, dockT: -2, out: T.s13out },
      { type: 'x5_bStamp', age: 12, place: '左右', t0: T.s12, ...E5.STAMP, dockT: T.s12dock, pulse: [T.pulse], out: T.s12out },
      { type: 'x5_bStamp', label: '长大后', t0: T.sAd, ...E5.STAMP, dockT: T.sAdDock },
      // L1
      { type: 'prop', id: 'x5bUni', kind: 'x5_bUni', at: [BX, FL], t0: T.bld, t1: T.bldOff + 0.32, drawDur: 0.6, sfxAt: [[T.bld, 'pen']] },
      // L2–L5, L11
      { type: 'x5_bCards', id: 'x5bCd' },
      { type: 'title', id: 'x5bYawn', text: '哈～', x: 322, y: 506, size: 46, rot: -6, t0: T.yawn + 0.12, t1: T.yawnEnd },
      // L6–L8
      { type: 'scribe', id: 'x5bBd.l0', text: LINES[0][0], x: LX, y: LINES[0][2], size: 56, t0: LINES[0][1], t1: T.roomOff + 0.32, cps: CPS, z: Z.board, sfx: 'chalk' },
      { type: 'scribe', id: 'x5bBd.l1', text: LINES[1][0], x: LX, y: LINES[1][2], size: 56, t0: LINES[1][1], t1: T.roomOff + 0.32, cps: CPS, z: Z.board, sfx: 'chalk' },
      { type: 'scribe', id: 'x5bBd.l2', text: LINES[2][0], x: LX, y: LINES[2][2], size: 56, t0: LINES[2][1], t1: T.roomOff + 0.32, cps: CPS, z: Z.board, sfx: 'chalk' },
      { type: 'label', id: 'x5bWarn', text: '早就提醒了', size: 48, at: [690, 668], rot: -3, t0: T.warn, t1: T.roomOff + 0.32, target: [690, 590], bend: 0.1, gap: 8 },
      { type: 'x5_bDoodle', id: 'x5bDoo', t1: T.look },
      { type: 'x5_bCal', id: 'x5bCal', t0: T.cal, t1: T.calOff + 0.32 },
      // L9–L10
      { type: 'prop', id: 'x5bEx', kind: 'x5_bExam', at: [560, 410], rot: -1, t0: T.paper, t1: T.examOff + 0.32, drawDur: 0.45, sfxAt: [[T.paper, 'paper']] },
      { type: 'x5_bTears', char: 'terry3', t0: T.tears, t1: T.gone + 0.32 },
      // L11
      { type: 'title', id: 'x5bNote', text: '（他自己的回忆；年龄据《纽约时报》2015）', x: 800, y: 700, size: 38, color: 'red', rot: -1, t0: T.note, t1: T.backOff + 0.32 },
      // L12–L14
      { type: 'label', id: 'x5bSelf', text: '小时候的自己', size: 44, at: [300, 380], rot: -4, t0: T.self, t1: T.selfOff, target: { char: 'kid', part: 'headTop', dx: -10, dy: -8 }, bend: 0.25, gap: 12 },
      { type: 'title', id: 'x5bSrc', text: '（2021 年采访）', x: 1260, y: 700, size: 38, color: 'red', rot: -2, t0: T.src, t1: DUR },
      { type: 'speech', id: 'x5bSay1', text: '认真的学习习惯', at: [900, 300], tail: [0, 42], speaker: 'tao', t0: T.say1, t1: DUR, size: 60, rot: -2 },
      { type: 'x5_bHiTop', id: 'x5bHi', rect: [692, 278, 122, 58], t0: T.hi1, t1: DUR, dur: 0.4, pad: 8 },
      { type: 'speech', id: 'x5bSay2', text: '不感兴趣的课，也用心听', at: [1236, 420], tail: [-250, 32], speaker: 'tao', t0: T.say2, t1: DUR, size: 52, rot: 2 },
      // eased exits (must stay last: they fade what was drawn before them)
      { type: 'x5_bFade', t0: T.inFade, d: 0.3, keys: ['terry.'] },
      { type: 'x5_bFade', t0: T.bldOff, d: 0.3, keys: ['x5bUni'] },
      { type: 'x5_bFade', t0: T.others, d: 0.3, keys: ['terry2.'] },
      { type: 'x5_bFade', t0: T.roomOff, d: 0.3, keys: ['board', 'x5bBd', 'x5bWarn', 'teacher.'] },
      { type: 'x5_bFade', t0: T.calOff, d: 0.3, keys: ['x5bCal'] },
      { type: 'x5_bFade', t0: T.gone, d: 0.3, keys: ['terry3.', 'proctor.'] },
      { type: 'x5_bFade', t0: T.examOff, d: 0.3, keys: ['x5bEx', 'desk', 'door'] },
      { type: 'x5_bFade', t0: T.backOff, d: 0.3, keys: ['x5bNote'] },
      { type: 'x5_bFade', t0: T.selfOff - 0.3, d: 0.3, keys: ['x5bSelf'] },
      { type: 'x5_bFade', t0: T.end, d: 0.3, keys: ['tao.', 'kid.', 'x5bSay', 'x5bHi', 'x5bSrc', 'floor'] },
    ],
    sfx: [[T.kid2, 'pop'], [T.cheer, 'hop'], [T.yawn, 'boop'], [T.fail[0], 'boop'], [T.teach, 'pop'], [T.kid3, 'pop'], [T.point, 'tap'], [T.look, 'boop'],
      [T.door2, 'pen'], [T.proc, 'pop'], [T.stand, 'tap'], [T.kid, 'pop'], [T.squat, 'tap'], [T.nod1, 'plip'], [T.nod2, 'plip']],
    subs: [
      { t0: 0.3, t1: 3.9, text: '那几年，他还在大学里上课。' },
      { t0: 4.4, t1: 7.8, text: '喜欢的课，他次次拿高分；' },
      { t0: 8.2, t1: 11.8, text: '觉得无聊的课，勉强及格——' },
      { t0: 12.1, t1: 15.1, text: '有两门，干脆没及格。' },
      { t0: 15.8, t1: 19.0, text: '其中一门，是量子力学。' },
      { t0: 19.4, t1: 23.8, text: '老师早就提醒：期末考试要写小文章，' },
      { t0: 23.9, t1: 26.9, text: '讲讲这门学问的历史。' },
      { t0: 27.5, t1: 31.1, text: '他一直没管，直到考试那天。' },
      { t0: 31.8, t1: 34.4, text: '他在考场上哭了，' },
      { t0: 34.5, t1: 37.9, text: '监考老师陪他走出了考场。' },
      { t0: 38.4, t1: 42.8, text: '那门课，没及格。那年他大约十二岁。' },
      { t0: 43.7, t1: 47.9, text: '长大后，他说想告诉小时候的自己：' },
      { t0: 48.2, t1: 51.8, text: '“要养成更认真的学习习惯，' },
      { t0: 51.9, t1: 56.7, text: '哪怕一开始不感兴趣的课，也要用心听。”' },
    ],
  });
})();
