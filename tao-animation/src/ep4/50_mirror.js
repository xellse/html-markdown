// 第 50 场 · 一面镜子：成绩单变成一面手镜，照出强（7、7）和弱（1、0、1）。
// 学校的数学课对他太简单（陶哲轩 2019 年回忆，AMS《Living Proof》）；世界赛场上，不足变成了一个个分数。
// 那天他心里怎么想，没有记录（日记本空白页 + 红问号；不演小陶的心情）。
// 面对这样的成绩单，谁都可以选：转过头去找借口——这是一个普通小人（戴帽子、没有那撮头发、比小陶高，标“我们（任何人）”），不是小陶；
// 或者直直地看着它问：错在哪一题？卡在哪一步？为什么？只有第二种能让人进步。
// 开场接第 40 场：成绩单在 E4.SHEET，写着 7、7、3、1、0、1 和“= 19”；“= 19”在成绩单滑下去变成镜子时淡出（镜框里放不下它）。
(() => {
  const FL = 780, DUR = 51.0, SH = E4.SHEET, CELL = SH.cell, SC = E4.SCORES;

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    glide: 0.4, totOff: 0.4, frame: 1.5, glint: 2.75, strong: 4.15, weak: 5.35, glint2: 6.8, labOff: 8.45, aside: 8.6,
    panel: 9.15, kid: 9.35, board: 9.6, yawn: 11.25, chin: 12.95, note: 13.45, panelOff: 16.9,
    fly: 17.45, lab: 18.3, box: 19.35, flyOff: 21.75,
    diary: 22.3, open: 23.0, q: 23.55, noRec: 24.65, diaryOff: 26.85,
    center: 26.9, floor: 27.0, we: 27.35, weLab: 27.7, weLabOff: 30.45,
    away: 32.0, ex1: 34.45, hdr1: 35.0, ex2: 36.15, back: 39.45, glass: 39.6, hdr2: 40.15,
    q1: 42.05, ring: 42.6, q2: 43.45, q3: 44.85, check: 47.35, cross: 47.8, smile: 48.2, hi: 48.45,
  };

  /* ---------------- the mirror: frame + handle around the score sheet ----------------
   * local coords: (0, 0) = centre of the score sheet, scale 1 (cells 96). The glass is an oval a bit below the sheet's centre
   * so the red 强 / 弱 braces fit inside it. */
  const MG = { cy: 44, rx: 440, ry: 205, band: 24, hLen: 200, hW: 54 };
  const MPOS = [[0, SH.at], [T.glide, [800, 275], 0.6, 'io'], [T.aside, [1200, 300], 0.5, 'io'], [T.center, [800, 215], 0.6, 'io']];
  const MSC = [[0, 1], [T.aside, 0.55, 0.5, 'io'], [T.center, 0.8, 0.6, 'io']];
  function sparkle(k, c, u, s = 26) {
    if (u <= 0 || u >= 1) return;
    const L = s * Math.sin(Math.PI * u);
    stroke(k + 'a', [[c[0] - L, c[1]], [c[0] + L, c[1]]], { z: Z.fx, w: 3.5, boil: 0.5 });
    stroke(k + 'b', [[c[0], c[1] - L], [c[0], c[1] + L]], { z: Z.fx, w: 3.5, boil: 0.5 });
  }
  function m4Frame(k, t) {
    const lt = t - T.frame; if (lt <= 0) return;
    const p = EASE.out(clamp(lt / 0.7)), z = Z.set + 0.5, { cy, rx, ry, band } = MG;
    // the mirror is opaque paper
    if (p > 0.35) stroke(k + '.fill', ringPts(k + '.f', 0, cy, rx + band, ry + band, { n: 24, closed: true, rv: 0.004 }), { z: Z.set, closed: true, fill: C.paper, noStroke: true, w: 1 });
    stroke(k + '.out', ringPts(k + '.o', 0, cy, rx + band, ry + band, { n: 24, a0: -100, sweep: 368, rv: 0.006 }), { z, w: 7, draw: stag(p, 0, 3) });
    stroke(k + '.in', ringPts(k + '.i', 0, cy, rx, ry, { n: 24, a0: 80, sweep: 366, rv: 0.006 }), { z, w: 4, draw: stag(p, 1, 3) });
    // pencil hatching across the frame band
    const hp = stag(p, 1, 3);
    for (let i = 0; i < 40; i++) {
      const a = (i * 9 + 4) * RAD, c = Math.cos(a), s = Math.sin(a);
      stroke(k + '.hb' + i, [[c * (rx + 6), cy + s * (ry + 6)], [c * (rx + band - 6), cy + s * (ry + band - 6)]], { z, w: 2.2, color: C.pencil, opacity: hp, boil: 0.4 });
    }
    // collar + handle
    const hy = cy + ry + band, hp2 = stag(p, 2, 3);
    stroke(k + '.collar', [[-36, hy - 8], [36, hy - 8, 1], [28, hy + 22, 1], [-28, hy + 22, 1], [-36, hy - 8, 1]], { z, w: 5, fill: C.paper, draw: hp2 });
    stroke(k + '.handle', superPts(0, hy + 22 + MG.hLen / 2, MG.hW, MG.hLen, 20, 4), { z, w: 5, closed: true, fill: C.paper, draw: hp2 });
    stroke(k + '.hh', [[-9, hy + 52], [-9, hy + MG.hLen - 6]], { z: z + 0.1, w: 2.4, color: C.pencil, draw: hp2, boil: 0.4 });
    // glass sheen (pencil) and a glint now and then
    const sp = clamp((lt - 0.6) / 0.3);
    // glass sheen: two pairs of long diagonal streaks (behind the sheet, so they show in the glass around it)
    [[[-418, 70], [-318, -84]], [[-398, 130], [-304, -6]], [[300, 214], [410, 52]], [[340, 226], [424, 108]]]
      .forEach((s, i) => stroke(k + '.sh' + i, s, { z: z + 0.1, w: i % 2 ? 3 : 5, color: C.pencil, opacity: 0.85, draw: sp, bow: 0.2 }));
    sparkle(k + '.gl0', [-372, -22], (t - T.glint) / 0.5);
    sparkle(k + '.gl1', [356, 112], (t - T.glint2) / 0.5, 22);
  }
  /** the red 强 / 弱 braces under the two halves (inside the glass), and later the ring round the 0 */
  function m4Labels(k, sh, t) {
    const rp = EASE.out(clamp((t - T.ring) / 0.3));
    if (rp > 0) stroke(k + '.ring0', ringPts(k + '.ring0', sh._bx(4) + CELL / 2, 0, CELL * 0.6, CELL * 0.57, { n: 11, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: rp });
    const fade = 1 - clamp((t - T.labOff) / 0.25); if (fade <= 0) return;
    const y0 = 126;
    [[0, 1, '强', T.strong], [3, 5, '弱', T.weak]].forEach(([a, b, s, t0], j) => {
      const lt = t - t0; if (lt <= 0) return;
      const x0 = sh._bx(a) + 8, x1 = sh._bx(b) + CELL - 8, m = (x0 + x1) / 2, p = EASE.out(clamp(lt / 0.3));
      stroke(k + '.br' + j, [[x0, y0 - 12], [x0 + 12, y0, 1], [m - 14, y0], [m, y0 + 16, 1], [m + 14, y0, 1], [x1 - 12, y0], [x1, y0 - 12, 1]], { z: Z.annot, w: 4.5, color: C.red, draw: p, opacity: fade });
      const q = clamp((lt - 0.2) / 0.2);
      if (q > 0) text(k + '.lb' + j, s, m, y0 + 50, { size: 50, color: C.red, z: Z.annot, scale: lerp(0.5, 1, EASE.back(q)), opacity: fade * clamp(q * 3), halo: 8 });
    });
  }
  COMP.m4_mirror = {
    init(fx) { COMP.e4_scores.init(fx.sheet); if (fx.sheet._tw) fx.sheet._tw.t1 = T.totOff + 0.3; return fx; },
    draw(fx, t, F) {
      const pos = evalTrack(MPOS, t), sc = evalTrack(MSC, t), k = fx.id;
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc); m4Frame(k, t); DL.restore();
      fx.sheet.at = pos; fx.sheet.scale = sc;           // the sheet itself is the shared e4_scores, moved with the mirror
      const n0 = DL.items.length;
      COMP.e4_scores.draw(fx.sheet, t, F);
      // "= 19" (as scene 40 left it) fades out while the sheet glides down into the mirror
      const f = 1 - clamp((t - T.totOff) / 0.3);
      if (f < 1) for (let i = n0; i < DL.items.length; i++) { const it = DL.items[i]; if (it.key.startsWith('m4s.wt')) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); }
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc); m4Labels(k, fx.sheet, t); DL.restore();
    },
    cues: fx => [[T.glide, 'whoosh'], [T.frame, 'pen'], [T.frame + 0.35, 'pen'], [T.glint, 'plip'], [T.strong, 'pen'], [T.weak, 'pen'],
      [T.glint2, 'plip'], [T.aside, 'whoosh'], [T.center, 'whoosh'], [T.ring, 'pen'], ...COMP.e4_scores.cues(fx.sheet)],
  };

  /* ---------------- L3–L4: a memory panel — the school maths class, far too easy ---------------- */
  const PN = { x0: 90, y0: 140, x1: 860, y1: 694 }, BD = { x0: 130, y0: 200, x1: 566, y1: 466 }, DK = { x: 690, top: 604, w: 250 };
  const box = (k, x0, y0, x1, y1, o) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], o);
  COMP.m4_panel = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), k = fx.id, z = Z.set;
      const cx = (PN.x0 + PN.x1) / 2, cy = (PN.y0 + PN.y1) / 2;
      DL.save(); DL.translate(cx, cy); DL.scale(pp); DL.translate(-cx, -cy);
      box(k + '.box', PN.x0, PN.y0, PN.x1, PN.y1, { z, w: 6, fill: C.paper });
      box(k + '.box2', PN.x0 + 12, PN.y0 + 12, PN.x1 - 12, PN.y1 - 12, { z: z + 0.1, w: 2.4, color: C.pencil });
      stroke(k + '.shade', [[PN.x0 + 16, PN.y1 + 10], [PN.x1 + 10, PN.y1 + 10, 1], [PN.x1 + 10, PN.y0 + 16]], { z: z - 0.5, w: 2.6, color: C.pencil, opacity: 0.7, boil: 0.5 });
      // blackboard + chalk tray
      box(k + '.bo', BD.x0, BD.y0, BD.x1, BD.y1, { z: z + 0.3, w: 5.5, fill: C.paper });
      box(k + '.bi', BD.x0 + 12, BD.y0 + 12, BD.x1 - 12, BD.y1 - 12, { z: z + 0.3, w: 3 });
      stroke(k + '.tray', [[BD.x0 + 24, BD.y1 + 10], [BD.x1 - 24, BD.y1 + 10]], { z: z + 0.3, w: 4.5 });
      // classroom floor + desk (in front of the seated kid)
      stroke(k + '.fl', [[PN.x0 + 16, 652], [PN.x1 - 16, 654]], { z: z + 0.2, w: 2.2, color: C.pencil, opacity: 0.8 });
      stroke(k + '.slab', superPts(DK.x, DK.top + 9, DK.w, 20, 16, 7), { z: Z.desk, w: 5, closed: true, fill: C.paper });
      box(k + '.front', DK.x - DK.w / 2 + 12, DK.top + 19, DK.x + DK.w / 2 - 12, PN.y1 - 16, { z: Z.desk, w: 4.5, fill: C.paper });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'paper']],
  };
  /** little pencil stretch lines beside the yawning kid's hands */
  COMP.m4_stretch = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const op = clamp((t - fx.t0) / 0.15) * clamp((fx.t1 - t) / 0.15);
      [['handL', -1], ['handR', 1]].forEach(([part, s]) => {
        const h = a[part];
        [0, 1].forEach(j => stroke(fx.id + part + j, [[h[0] + s * (18 + j * 12), h[1] - 6 + j * 16], [h[0] + s * (34 + j * 12), h[1] - 16 + j * 16]], { z: Z.fx, w: 3, opacity: op, boil: 0.7 }));
      });
    },
  };

  /* ---------------- L5: the weak scores float out of the mirror and land as a row of numbers ---------------- */
  const FLY = { t: [T.fly, T.fly + 0.17, T.fly + 0.34], dur: 0.8, cells: [3, 4, 5], to: [[470, 470], [620, 470], [770, 470]], size: 108, side: 150 };
  COMP.m4_fly = {
    draw(fx, t, F) {
      if (t < FLY.t[0] || t >= T.flyOff + 0.3) return;
      const op = 1 - clamp((t - T.flyOff) / 0.3), k = fx.id;
      FLY.cells.forEach((ci, j) => {
        const lt = t - FLY.t[j]; if (lt < 0) return;
        const from = F.targets['m4s.s' + ci]; if (!from) return;
        const u = clamp(lt / FLY.dur), e = EASE.io(u), g = GLYPH[String(SC[ci])];
        const s = lerp(CELL * 0.62 * 0.55, FLY.size, EASE.out(u));
        const c = [lerp(from[0], FLY.to[j][0], e), lerp(from[1], FLY.to[j][1], e) - Math.sin(Math.PI * e) * 150];
        const ld = lt - FLY.dur, sq = ld > 0 && ld < 0.3 ? 1 - 0.2 * Math.sin(Math.PI * ld / 0.3) : 1;
        DL.save(); DL.translate(c[0], c[1] + s / 2); DL.scale(1 + (1 - sq) * 0.6, sq); DL.translate(0, -s / 2);
        g.s.forEach((st, i) => stroke(`${k}.d${j}.${i}`, st.map(([a, b, cc]) => [(a - g.w / 2) * s, (b - 0.5) * s, cc]), { z: Z.fx, w: lerp(3.6, 7, u), opacity: op, boil: 0.55 }));
        DL.restore();
        // a score box drawn round each one: "变成了分数"
        const bp = EASE.out(clamp((t - T.box - j * 0.12) / 0.3)), h = FLY.side / 2, [x, y] = FLY.to[j];
        if (bp > 0) box(`${k}.b${j}`, x - h, y - h, x + h, y + h, { z: Z.set + 3, w: 5, fill: C.paper, draw: bp, opacity: op });
      });
    },
    cues: () => [...FLY.t.map(t => [t, 'whoosh']), ...FLY.t.map(t => [t + FLY.dur, 'tap']), [T.box, 'pen'], [T.box + 0.12, 'pen'], [T.box + 0.24, 'pen']],
  };

  /* ---------------- L6: a diary — that day's page is blank ---------------- */
  const DY = { at: [560, 450], pw: 300, ph: 400 };
  function pageRect(k, x0, x1, h, z, o = {}) { box(k, x0, -h, x1, h, { z, w: 4.5, fill: C.paper, ...o }); }
  COMP.m4_diary = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), k = fx.id, z = Z.set + 1;
      const u = EASE.io(clamp((t - T.open) / 0.4)), { pw, ph } = DY, h = ph / 2;
      DL.save(); DL.translate(DY.at[0], DY.at[1]); DL.scale(pp); DL.translate(-pw / 2 * (1 - u), 0);
      // right page (under the cover until it opens), faint rules
      pageRect(k + '.r', 0, pw, h, z);
      for (let i = 0; i < 7; i++) stroke(k + '.rl' + i, [[22, -h + 70 + i * 48], [pw - 22, -h + 71 + i * 48]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.5, boil: 0.4 });
      // the cover swings over to the left (x of its free edge = pw·cos πu)
      const ex = pw * Math.cos(Math.PI * u), lift = 14 * Math.sin(Math.PI * u);
      if (u < 0.5) {
        stroke(k + '.cv', [[0, -h], [ex, -h - lift, 1], [ex, h + lift, 1], [0, h, 1], [0, -h, 1]], { z: z + 0.5, w: 5.5, fill: C.paper });
        const cs = Math.cos(Math.PI * u);
        DL.save(); DL.scale(Math.max(0.01, cs), 1);
        text(k + '.ti', '日记', pw / 2, -40, { size: 84, z: z + 0.6 });
        stroke(k + '.tu', [[pw / 2 - 90, 24], [pw / 2 + 90, 22]], { z: z + 0.6, w: 4 });
        // a strap with a little clasp on the free edge
        box(k + '.strap', pw - 34, -26, pw + 8, 26, { z: z + 0.6, w: 4.5, fill: C.paper });
        dot(k + '.clasp', [pw - 12, 0], 6, C.ink, z + 0.7);
        DL.restore();
      } else {
        // the inside of the cover = the left page: blank, faint rules
        stroke(k + '.lp', [[0, -h], [ex, -h - lift, 1], [ex, h + lift, 1], [0, h, 1], [0, -h, 1]], { z: z + 0.5, w: 4.5, fill: C.paper });
        if (u > 0.98) for (let i = 0; i < 7; i++) stroke(k + '.ll' + i, [[-pw + 22, -h + 70 + i * 48], [-22, -h + 71 + i * 48]], { z: z + 0.6, w: 2, color: C.pencil, opacity: 0.5, boil: 0.4 });
      }
      stroke(k + '.spine', [[0, -h - 4], [0, h + 4]], { z: z + 0.7, w: 5 });
      DL.restore();
    },
    cues: () => [[T.diary, 'pop'], [T.open, 'paper']],
  };

  /* ---------------- L7–L12: the choice ---------------- */
  /** speech without a balloon (ink) whose opacity can dim later. {text, at, tail, speaker, t0, t1, size, rot, dimT, dimTo} */
  COMP.m4_say = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pp = EASE.back(clamp(lt / 0.22)), op = 1 - (1 - (fx.dimTo ?? 1)) * clamp((t - fx.dimT) / 0.4);
      text(fx.id, fx.text, fx.at[0], fx.at[1], { size: fx.size || 56, color: C.ink, z: Z.annot, scale: lerp(0.4, 1, pp), rot: fx.rot || 0, halo: 10, opacity: op });
      const a = F.anchors[fx.speaker]; if (!a) return;
      const from = [fx.at[0] + fx.tail[0], fx.at[1] + fx.tail[1]], d = dist(from, a.head), to = lerp2(from, a.head, clamp((d - a.r - 14) / d));
      stroke(fx.id + '.tail', [from, to], { z: Z.annot, w: 3.5, draw: EASE.out(clamp((lt - 0.05) / 0.15)), opacity: op });
    },
    cues: fx => [[fx.t0, 'pop']],
  };
  /** a red numbered header: ① 找借口 / ② 直视. {n, text, x (left), y, t0, size, dimT, dimTo} */
  COMP.m4_hdr = {
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0) return;
      const op = fx.dimT !== undefined ? 1 - (1 - fx.dimTo) * clamp((t - fx.dimT) / 0.4) : 1, pp = EASE.back(clamp(lt / 0.22)), k = fx.id;
      DL.save(); DL.translate(fx.x + 26, fx.y); DL.scale(lerp(0.5, 1, pp));
      stroke(k + '.o', ringPts(k + '.o', 0, 0, 27, 27, { n: 10, a0: -110, sweep: 375, rv: 0.05 }), { z: Z.annot, w: 4.5, color: C.red, opacity: op, draw: EASE.out(clamp(lt / 0.3)) });
      const g = GLYPH[fx.n], gs = 34;
      g.s.forEach((st, j) => stroke(k + '.n' + j, st.map(([a, b, c]) => [(a - g.w / 2) * gs, (b - 0.5) * gs, c]), { z: Z.annot, w: 5, color: C.red, opacity: op, draw: clamp((lt - 0.1) / 0.18), boil: 0.6 }));
      DL.restore();
      text(k + '.t', fx.text, fx.x + 66, fx.y + 2, { size: fx.size || 50, anchor: 'start', color: C.red, opacity: op * clamp((lt - 0.12) / 0.12), halo: 8, z: Z.annot });
    },
    cues: fx => [[fx.t0, 'pop']],
  };
  /** a red curved arrow over the head: he turns away */
  COMP.m4_turn = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.35)), R = a.r * 1.75, c = a.head, pts = [];
      for (let i = 0; i <= 10; i++) { const ang = (-25 - 125 * i / 10) * RAD; pts.push([c[0] + Math.cos(ang) * R, c[1] + Math.sin(ang) * R]); }
      stroke(fx.id, pts, { z: Z.annot, w: 4.5, color: C.red, draw: p, boil: 0.8 });
      if (p > 0.92) {
        const e = pts[10], b = pts[8], L = dist(b, e) || 1, tx = (b[0] - e[0]) / L, ty = (b[1] - e[1]) / L, hl = 18;
        const r1 = [e[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, e[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
        const r2 = [e[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, e[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
        stroke(fx.id + '.h', [r1, [e[0], e[1], 1], r2], { z: Z.annot, w: 4.5, color: C.red, boil: 0.8 });
      }
    },
    cues: fx => [[fx.t0, 'whip']],
  };
  /** a magnifying glass held up to the right eye (same look as the one in the ending): inside the lens, a big magnified eye
   *  looks at the target. The handle runs down to wherever the right hand is. {char, t0, look: target name} */
  COMP.m4_glass = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const pp = Math.max(0.01, EASE.back(clamp((t - fx.t0) / 0.25))), k = fx.id, z = Z.front + 1, R = a.r * 0.6;
      const c = [a.head[0] + a.r * 0.7, a.head[1] - a.r * 0.08], h = a.handR;
      DL.save(); DL.translate(c[0], c[1]); DL.scale(pp); DL.translate(-c[0], -c[1]);
      const d = dist(c, h) || 1, ux = (h[0] - c[0]) / d, uy = (h[1] - c[1]) / d;
      stroke(k + '.h', [[c[0] + ux * (R + 2), c[1] + uy * (R + 2)], [h[0] + ux * 6, h[1] + uy * 6]], { z, w: 9 });
      stroke(k + '.ring', ringPts(k, c[0], c[1], R, R, { n: 14, closed: true }), { z, w: 6, closed: true, fill: C.paper });
      // the magnified eye
      const tg = F.targets[fx.look] || [c[0] + 200, c[1] - 200], gx = tg[0] - c[0], gy = tg[1] - c[1], gl = Math.hypot(gx, gy) || 1;
      const ex = R * 0.5, ey = R * 0.62, pr = R * 0.22, rim = 1 / Math.sqrt((gx / gl / ex) ** 2 + (gy / gl / ey) ** 2) - pr - 2;
      stroke(k + '.eye', ringPts(k + '.e', c[0], c[1], ex, ey, { n: 11, closed: true }), { z: z + 0.1, w: 4.5, closed: true, fill: C.paper });
      dot(k + '.pu', [c[0] + gx / gl * rim, c[1] + gy / gl * rim], pr, C.ink, z + 0.2);
      stroke(k + '.sh', ringPts(k + 's', c[0], c[1], R * 0.78, R * 0.78, { n: 8, a0: 200, sweep: 55 }), { z: z + 0.1, w: 3, color: C.pencil });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pop']],
  };
  /** the red ✗ over the first choice */
  COMP.m4_x = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const [x0, y0, x1, y1] = fx.rect, a = EASE.out(clamp((t - fx.t0) / 0.18)), b = EASE.out(clamp((t - fx.t0 - 0.2) / 0.18));
      stroke(fx.id + '.a', [[x0, y0], [x1, y1]], { z: Z.annot + 1, w: 9, color: C.red, draw: a });
      if (b > 0) stroke(fx.id + '.b', [[x1, y0], [x0, y1]], { z: Z.annot + 1, w: 9, color: C.red, draw: b });
    },
    cues: fx => [[fx.t0, 'pen'], [fx.t0 + 0.2, 'pen']],
  };

  /** fades out (over FADE s, ending at t1) every item already drawn this frame whose key starts with one of `keys` */
  const FADE = 0.25;
  COMP.m4_fadeOut = {
    draw(fx, t) {
      const f = 1 - clamp((t - (fx.t1 - FADE)) / FADE); if (f >= 1) return;
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** a plain cap (instead of Terry's tuft) for the ordinary kid: a small crown, a band and a bill. Head units, y up = negative. */
  HAIR.m4_cap = () => {
    const crown = []; for (let i = 0; i <= 10; i++) { const a = (-142 + i * 10.4) * RAD; crown.push([Math.cos(a) * 1.1, Math.sin(a) * 1.1]); }
    return [crown, [[-0.86, -0.69], [0.86, -0.69]], [[0.84, -0.69], [1.56, -0.6], [1.52, -0.5], [0.8, -0.56]], [[0, -1.1], [0, -1.22]]];
  };
  Object.assign(POSE, {
    m4_yawn: { ...POSE.sitBase, tilt: -6, lean: -3, armScale: 1.75, armL: [128, 30], armR: [128, 30] },
    m4_cross: { tilt: -9, lean: -2, armScale: 1.4, ikL: { w: 1, to: 'hip', dx: 24, dy: -36, bend: 'down' }, ikR: { w: 1, to: 'hip', dx: -24, dy: -32, bend: 'down' } },
    m4_look: { lean: 2, tilt: -6, armScale: 1.08, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'abs', dx: 608, dy: 636, bend: 'down' } },
  });
  Object.assign(FACE, {
    m4_yawn: { lidL: 0.88, lidR: 0.88, brow: 'arc', browY: 0.1, mouth: 'jaw', mo: 0.32 },
    m4_huff: { lidL: 0.45, lidR: 0.45, brow: 'line', browL: -12, browR: -12, browY: 0.02, mouth: 'wavy', mw: 0.3 },
  });
  const WX = 520;                                     // where the plain little stick figure stands
  const RX = 1060;                                    // left edge of the right-hand column (② 直视 + the three questions)
  const QS = [['错在哪一题？', T.q1, 538], ['卡在哪一步？', T.q2, 620], ['为什么？', T.q3, 702]];

  defineScene({
    id: 'mirror', chapter: '一面镜子', dur: DUR, floor: FL,
    cast: {
      terry: { ...E4.terry, desk: [DK.x, DK.top - 3], noShadow: true },
      // NOT 小陶: a plain stick kid with no tuft ("we" — anyone)
      we: { H: 300, head: 0.4, torso: 0.22, leg: 0.3, arm: 0.34, kid: true, hair: 'm4_cap', blink: [3.7, 0.2] },
    },
    order: ['terry', 'we'],
    tracks: {
      terry: {
        enter: T.kid,
        pos: [[0, [DK.x, 612]], [T.panelOff, [-900, 612], 0]],
        pose: [[0, 'sitUp'], [T.yawn, 'm4_yawn', 0.15, 'back'], [T.chin, 'chinHand', 0.15]],
        face: [[0, 'bored'], [T.yawn, 'm4_yawn', 0.1], [T.chin, 'bored', 0.12]],
        turn: [[0, -0.4]],
        gaze: [[0, 'board']],
        squash: [[0, 1], [T.yawn, 1.06, 0.12], [T.yawn + 0.12, 1, 0.3, 'back']],
      },
      we: {
        enter: T.we,
        pos: [[0, [WX, FL]]],
        pose: [[0, 'stand'], [T.away, 'm4_cross', 0.12, 'back'], [T.back, 'm4_look', 0.14, 'back']],
        face: [[0, 'neutral'], [T.away, 'm4_huff', 0.08], [T.back, 'focus', 0.08], [T.smile, 'smile', 0.1]],
        turn: [[0, 0.45], [T.away, -0.75, 0.14, 'back'], [T.back, 0.3, 0.14, 'back']],
        gaze: [[0, 'weak'], [T.away, [120, 420]], [T.back, 'weak']],
        squash: [[0, 1], [T.away, 0.92, 0.05], [T.away + 0.05, 1, 0.22, 'back'], [T.back, 1.07, 0.05], [T.back + 0.05, 1, 0.22, 'back']],
      },
    },
    targets: F => ({ board: [(BD.x0 + BD.x1) / 2, 300], weak: F.targets['m4s.s4'] || [926, 215] }),
    set: [{ type: 'floor', t0: T.floor }],
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2 },
      // L1–L2: the score sheet (as scene 40 left it) becomes a hand mirror: strong half / weak half
      { type: 'm4_mirror', id: 'm4m', sheet: { type: 'e4_scores', id: 'm4s', at: SH.at, cell: CELL, t0: -1, scores: SC.map(v => [v, -1]), total: [19, -1] } },
      // L3–L4: the memory panel
      { type: 'm4_panel', id: 'm4p', t0: T.panel, t1: T.panelOff },
      { type: 'write', id: 'm4p.q', text: '3x+2=11', x: (BD.x0 + BD.x1) / 2, y: 290, size: 84, anchor: 'middle', t0: T.board, t1: T.panelOff, speed: 2400, w: 6, sfx: 'chalk' },
      { type: 'm4_stretch', id: 'm4p.st', char: 'terry', t0: T.yawn + 0.15, t1: T.chin },
      { type: 'title', id: 'm4p.src', text: '（陶哲轩 2019 年的回忆）', x: (PN.x0 + PN.x1) / 2, y: 742, size: 38, color: 'red', rot: -1, t0: T.note, t1: T.panelOff },
      // L5: the weak scores float out and become a row of scores
      { type: 'm4_fly', id: 'm4f' },
      { type: 'label', id: 'm4f.lb', text: '不足', size: 54, at: [250, 470], rot: -4, t0: T.lab, t1: T.flyOff, target: [390, 470], bend: 0.15, gap: 10 },
      // L6: the diary
      { type: 'm4_diary', id: 'm4d', t0: T.diary, t1: T.diaryOff },
      { type: 'write', id: 'm4d.q', text: '?', x: DY.at[0] + DY.pw / 2, y: DY.at[1] - 104, size: 210, anchor: 'middle', t0: T.q, t1: T.diaryOff, speed: 2600, w: 9, color: 'red', sfx: 'pen' },
      { type: 'title', id: 'm4d.no', text: '没有记录', x: DY.at[0], y: 712, size: 48, color: 'red', rot: -3, t0: T.noRec, t1: T.diaryOff },
      // L7–L9: anyone may turn away and make excuses (a plain stick figure, not 小陶)
      { type: 'label', id: 'm4w.lb', text: ['我们', '（任何人）'], size: 46, at: [684, 652], rot: 3, t0: T.weLab, t1: T.back, target: { char: 'we', part: 'head', dx: 40, dy: 20 }, bend: 0.25, gap: 14 },
      { type: 'm4_turn', id: 'm4w.turn', char: 'we', t0: T.away, t1: T.ex1 },
      { type: 'm4_say', id: 'm4w.e1', text: '题目太偏了。', at: [285, 448], tail: [92, 34], speaker: 'we', t0: T.ex1, t1: DUR, size: 56, rot: -3, dimT: T.back, dimTo: 0.35 },
      { type: 'm4_say', id: 'm4w.e2', text: '我还小。', at: [262, 560], tail: [118, 8], speaker: 'we', t0: T.ex2, t1: DUR, size: 56, rot: 2, dimT: T.back, dimTo: 0.35 },
      { type: 'm4_hdr', id: 'm4w.h1', n: '1', text: '找借口', x: 120, y: 345, t0: T.hdr1, dimT: T.back, dimTo: 0.45 },
      // L10–L11: or look straight at it, with a magnifying glass, and ask three questions
      { type: 'm4_glass', id: 'm4w.gl', char: 'we', t0: T.glass, look: 'weak' },
      { type: 'm4_hdr', id: 'm4w.h2', n: '2', text: '直视', x: RX, y: 455, t0: T.hdr2, size: 54 },
      ...QS.map(([s, t0, y], i) => ({ type: 'scribe', id: 'm4w.q' + i, text: s, x: RX + 8, y, size: 56, t0, cps: 8, color: 'red', halo: 8 })),
      // L12: only the second way works
      { type: 'write', id: 'm4w.ck', text: '✓', x: RX + 196, y: 418, size: 80, t0: T.check, speed: 2600, w: 8, color: 'red', sfx: 'pen', z: Z.annot },
      { type: 'm4_x', id: 'm4w.x', rect: [100, 318, 420, 600], t0: T.cross },
      { type: 'band', id: 'm4w.hi', rect: [RX + 64, 425, 116, 62], t0: T.hi, dur: 0.4 },
      // eased exits (must stay last: they fade what was drawn before them)
      { type: 'm4_fadeOut', id: 'm4fo.p', t1: T.panelOff, keys: ['m4p', 'terry.'] },
      { type: 'm4_fadeOut', id: 'm4fo.d', t1: T.diaryOff, keys: ['m4d'] },
    ],
    sfx: [[T.kid, 'pop'], [T.yawn, 'boop'], [T.we, 'pop'], [T.back, 'whip']],
    subs: [
      { t0: 0.3, t1: 3.7, text: '这张成绩单，像一面镜子。' },
      { t0: 3.8, t1: 8.4, text: '强的地方，弱的地方，都照得清清楚楚。' },
      { t0: 9.1, t1: 13.3, text: '学校的数学课，对他来说太简单了。' },
      { t0: 13.4, t1: 16.6, text: '这是他长大后自己说的。' },
      { t0: 17.1, t1: 21.3, text: '世界赛场上，不足变成了一个个分数。' },
      { t0: 22.2, t1: 26.4, text: '那天他心里怎么想，没有人记下来。' },
      { t0: 26.9, t1: 30.3, text: '可面对一张这样的成绩单，' },
      { t0: 30.6, t1: 34.0, text: '谁都可以选：转过头去——' },
      { t0: 34.4, t1: 38.2, text: '“题目太偏了。”“我还小。”' },
      { t0: 38.9, t1: 41.9, text: '或者，直直地看着它：' },
      { t0: 42.0, t1: 46.2, text: '错在哪一题？卡在哪一步？为什么？' },
      { t0: 46.7, t1: 50.5, text: '只有第二种，能让人真的进步。' },
    ],
  });
})();
