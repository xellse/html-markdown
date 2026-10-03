// 第 60 场 · 写书、短跑和马拉松。
// 事实：15 岁写的《Solving Mathematical Problems》（迪肯大学请他写，1990–1991 年初写成，电子稿存在家里的 Macintosh Plus 上）。
// 序言：“But I just like mathematics because it is fun.”“Two of the main weapons—experience and knowledge—… have to be acquired over time.”
// 致谢：“thanks to my family for … put-downs when I was behind schedule.”（“进度呢？”是演绎，原话没有记录）
// 长大后：奥赛像短跑，研究像马拉松（2010《中国教育报》）；“You have to keep learning, and really enjoy doing mathematics.
// If you don't enjoy it, you won't have the stamina to keep at it.”（澳大利亚数学会 Gazette 2009）
// 开场接第 50 场：只有停靠好的“长大后”印章 → 换成 15 岁（飘带“写书”）→ 说到“长大后”时换回“长大后”。结尾只剩停靠好的印章。
(() => {
  const FL = 780, DUR = 45.6;

  /* ---------------- timing (scene time) ---------------- */
  const T = {
    sAdOut: 0.12, s15: 0.15, s15dock: 1.55,
    desk: 1.3, teen: 1.45, type0: 1.8, book: 2.2, bookLab: 3.0, open: 5.9, q: [8.2, 9.7, 11.0], hiFun: 11.6, bookOff: 12.6,
    arms: 14.5, jar: [15.4, 16.0], glass: 18.5, drip: 19.1, jarsOff: 21.85,
    door: 22.3, fam: 22.9, ask: 24.2, sheep: 24.55, fast: 24.8, homeOff: 26.85,
    s15out: 27.1, sAd: 27.15, sAdDock: 29.15, tao: 28.1, track: 29.25, point: 29.45, dash0: 29.8, dash1: 30.6, sprintLab: 30.2, trackOff: 31.15,
    road: 31.55, jog0: 32.4, jogAt: 33.3, maraLab: 33.4, spr0: 35.6, flop: 36.25, sprOff: 37.3, signs: [37.4, 37.75, 38.1], gauge: 38.8, full: 39.2,
    hiLike: 40.9, src: 41.3, end: 44.95,
  };

  /* ---------------- little helpers ---------------- */
  const box = (k, x0, y0, x1, y1, o) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], o);
  /** fades out (over d s from t0) every item already drawn this frame whose key starts with one of `keys`: must stay at the end of fx */
  COMP.x5_mFade = {
    draw(fx, t) {
      if (t < fx.t0) return;
      const f = 1 - clamp((t - fx.t0) / (fx.d || 0.3));
      DL.items.forEach(it => { if (fx.keys.some(kk => it.key.startsWith(kk))) it.attrs.opacity = +((it.attrs.opacity ?? 1) * f).toFixed(3); });
    },
  };
  /** the age stamp, which can shrink away into its corner at `out` (to make room for the next one) */
  COMP.x5_mStamp = {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.out !== undefined && t >= fx.out + 0.2)) return;
      const s = fx.out !== undefined && t > fx.out ? 1 - EASE.in(clamp((t - fx.out) / 0.2)) : 1;
      DL.save(); if (s < 1) DL.about(fx.dock[0], fx.dock[1], () => DL.scale(Math.max(0.01, s)));
      COMP.ageStamp.draw(fx, t, F);
      DL.restore();
    },
    cues: fx => COMP.ageStamp.cues(fx),
  };

  /* ---------------- L1–L6: the old computer (a boxy Macintosh Plus) on a desk ---------------- */
  const DESK = { x: 640, top: 640, w: 300 }, KB = [560, DESK.top - 6], MAC = [702, DESK.top - 2], STOOL = { x: 400, seat: 700 };
  /** characters typed so far (faster once the family asks about the schedule) */
  const typed = t => Math.max(0, Math.min(t, T.open + 0.3) - T.type0) * 7 + Math.max(0, Math.min(t, T.homeOff) - T.bookOff) * 7 + Math.max(0, Math.min(t, T.homeOff) - T.fast) * 10;
  PROPS.x5_mMac = (fx, t, lt, p) => {
    const k = fx.id, z = Z.desk + 1, n = 4;
    stroke(k + '.body', superPts(0, -112, 172, 224, 24, 7), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, n) });
    stroke(k + '.bez', superPts(0, -150, 128, 100, 20, 6), { z: z + 0.1, w: 4, closed: true, fill: C.paper, draw: stag(p, 1, n) });
    stroke(k + '.scr', superPts(0, -150, 104, 78, 18, 7), { z: z + 0.2, w: 2.6, closed: true, draw: stag(p, 1, n) });
    box(k + '.fd', 8, -74, 64, -62, { z: z + 0.1, w: 3, draw: stag(p, 2, n) });
    stroke(k + '.fds', [[14, -68], [58, -68]], { z: z + 0.2, w: 2.4, draw: stag(p, 2, n) });
    for (let i = 0; i < 4; i++) stroke(k + '.v' + i, [[-66 + i * 9, -38], [-66 + i * 9, -16]], { z: z + 0.1, w: 2, color: C.pencil, opacity: stag(p, 2, n), boil: 0.4 });
    stroke(k + '.chin', [[-80, -30], [80, -30]], { z: z + 0.1, w: 2.4, color: C.pencil, opacity: stag(p, 2, n), boil: 0.4 });
    // the keyboard, in front of it on the desk
    const kx = KB[0] - MAC[0];
    stroke(k + '.kb', [[kx - 64, -2], [kx - 56, -16, 1], [kx + 56, -16, 1], [kx + 64, -2, 1], [kx - 64, -2, 1]], { z: Z.front + 2, w: 4, fill: C.paper, draw: stag(p, 3, n) });
    for (let i = 0; i < 9; i++) stroke(k + '.key' + i, [[kx - 46 + i * 11.5, -9], [kx - 41 + i * 11.5, -9]], { z: Z.front + 2.1, w: 3, opacity: stag(p, 3, n), boil: 0.3 });
    // typed lines on the little screen (the last four rows, scrolling)
    if (p >= 1) {
      const c = Math.floor(typed(t)), per = 11, rows = Math.floor(c / per), first = Math.max(0, rows - 3);
      for (let r = first; r <= rows; r++) {
        const len = r < rows ? per - (r % 3) : c % per; if (len <= 0) continue;
        const y = -176 + (r - first) * 16;
        stroke(k + '.tl' + (r % 5), [[-42, y], [-42 + len * 7.5, y]], { z: z + 0.3, w: 2.6, boil: 0.3 });
      }
      if (Math.floor(t * 2.4) % 2 === 0 && t < T.homeOff) { const r = rows - first, len = c % per; stroke(k + '.cur', [[-40 + len * 7.5, -182 + r * 16], [-40 + len * 7.5, -170 + r * 16]], { z: z + 0.3, w: 3, boil: 0.2 }); }
    }
  };
  /** quick little motion ticks above the hands while he types fast */
  COMP.x5_mFast = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const fr = Math.floor(t * 12);
      ['handL', 'handR'].forEach((part, j) => {
        const h = a[part];
        [-1, 1].forEach((s, i) => { if ((fr + i + j) % 3 === 0) return; stroke(`${fx.id}.${j}${i}`, [[h[0] + s * 10, h[1] - 18], [h[0] + s * 18, h[1] - 32]], { z: Z.fx, w: 3, boil: 0.8 }); });
      });
    },
  };

  /* ---------------- L1–L3: the book (cover → it opens on the preface) ---------------- */
  const BK = { at: [1150, 430], pw: 290, ph: 380 };
  /** a book seen from the front: closed (cover to the right of the spine) → the cover swings over to the left (as in scene 70 of episode 4) */
  function book(k, t, o) {
    const lt = t - o.t0, pp = Math.max(0.01, EASE.back(clamp(lt / 0.3)));
    const u = EASE.io(clamp((t - o.openT) / 0.4)), { pw, ph } = o, h = ph / 2, z = o.z;
    DL.save(); DL.translate(o.pos[0], o.pos[1]); DL.scale(pp); DL.translate(-pw / 2 * (1 - u), 0);
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
  const QX = BK.at[0] + 20, QY = [356, 418, 480], QL = ['我喜欢数学，', '只是因为它', '好玩。'];
  COMP.x5_mBook = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const { pw, ph } = BK, h = ph / 2;
      book(fx.id, t, { pos: BK.at, pw, ph, t0: fx.t0, openT: T.open, z: Z.set + 1,
        cover: (k, z) => {
          box(k + '.cb', 16, -h + 16, pw - 16, h - 16, { z, w: 2.6 });
          ['Solving', 'Mathematical', 'Problems'].forEach((s, i) => text(k + '.ct' + i, s, pw / 2, -86 + i * 56, { size: 42, z }));
          stroke(k + '.cu', [[pw / 2 - 96, 96], [pw / 2 + 96, 93]], { z, w: 4 });
        },
        left: (k, z) => { for (let i = 0; i < 6; i++) stroke(k + '.ll' + i, [[-pw + 34, -h + 80 + i * 48], [-34 - (i % 2) * 40, -h + 81 + i * 48]], { z, w: 2, color: C.pencil, opacity: 0.5, boil: 0.4 }); },
        right: (k, z) => {
          text(k + '.pf', '序言', pw / 2, -h + 50, { size: 40, z, color: C.pencil });
          for (let i = 0; i < 3; i++) stroke(k + '.rl' + i, [[16, QY[i] - BK.at[1] + 26], [pw - 16, QY[i] - BK.at[1] + 27]], { z, w: 2, color: C.pencil, opacity: 0.45, boil: 0.4 });
        },
      });
    },
    cues: fx => [[fx.t0, 'pop'], [T.open, 'paper']],
  };

  /* ---------------- L4–L5: two jars (经验, 知识) filling drop by drop; an hourglass ---------------- */
  const JARS = [{ x: 1000, name: '经验' }, { x: 1230, name: '知识' }], JB = 640, JT = 452, HG = { x: 1440, y: 540, h: 170, w: 96 };
  const level = t => lerp(0.04, 0.62, clamp((t - T.drip) / (T.jarsOff - T.drip)));
  COMP.x5_mJars = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id;
      JARS.forEach((j, i) => {
        const lt = t - T.jar[i]; if (lt < 0) return;
        const pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), z = Z.set + 1, x = j.x;
        DL.save(); DL.translate(x, JB); DL.scale(pp); DL.translate(-x, -JB);
        const side = s => [[x + s * 58, JT + 14], [x + s * 70, JT + 60], [x + s * 72, JB - 40], [x + s * 62, JB - 6], [x + s * 40, JB]];
        const L = side(-1), R = side(1);
        stroke(k + '.jf' + i, L.concat(R.slice().reverse()), { z: z - 0.2, closed: true, fill: C.paper, noStroke: true, w: 1 });
        stroke(k + '.jl' + i, L, { z, w: 5 });
        stroke(k + '.jr' + i, R, { z, w: 5 });
        stroke(k + '.jb' + i, [[x - 40, JB], [x + 40, JB]], { z, w: 5 });
        stroke(k + '.rim' + i, ringPts(k + '.rim' + i, x, JT + 8, 64, 12, { n: 12, closed: true }), { z: z + 0.2, w: 4.5, closed: true });
        // the water: a pencil-shaded body with a wavy top
        const lv = level(t), top = lerp(JB - 6, JT + 40, lv);
        if (lv > 0.02) {
          const wv = [], n = 6; for (let q = 0; q <= n; q++) { const xx = lerp(x - 68, x + 68, q / n); wv.push([xx, top + Math.sin(q * 1.4 + t * 4) * 2.5]); }
          stroke(k + '.wa' + i, wv.concat([[x + 60, JB - 8], [x + 38, JB - 3], [x - 38, JB - 3], [x - 60, JB - 8]]), { z: z - 0.1, closed: true, fill: C.pencil, noStroke: true, opacity: 0.32, w: 1, boil: 0.3 });
          stroke(k + '.wt' + i, wv, { z: z - 0.05, w: 2.6, color: C.pencil, boil: 0.4 });
        }
        DL.restore();
        text(k + '.nm' + i, j.name, x, JB + 50, { size: 50, z: z + 0.3, opacity: clamp(lt / 0.2) });
        // a drop now and then, falling into the jar
        if (t > T.drip) for (let d = 0; d < 2; d++) {
          const u = ((t - T.drip) / 1.3 + i * 0.37 + d * 0.5) % 1, y = lerp(JT - 70, top, EASE.in(u)), op = clamp(u / 0.1) * (1 - clamp((u - 0.92) / 0.08)), s = 7;
          stroke(`${k}.dp${i}${d}`, [[x, y - s * 1.6, 1], [x + s * 0.8, y], [x, y + s], [x - s * 0.8, y], [x, y - s * 1.6, 1]], { z: z + 0.4, w: 3, fill: C.paper, opacity: op, boil: 0.4 });
        }
      });
      // the hourglass: sand runs down while the jars fill
      const lt = t - T.glass;
      if (lt >= 0) {
        const pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), z = Z.set + 1, { x, y, h, w } = HG, hh = h / 2;
        DL.save(); DL.translate(x, y); DL.scale(pp);
        box(k + '.hgT', -w / 2 - 8, -hh - 12, w / 2 + 8, -hh, { z, w: 4.5, fill: C.paper });
        box(k + '.hgB', -w / 2 - 8, hh, w / 2 + 8, hh + 12, { z, w: 4.5, fill: C.paper });
        stroke(k + '.hgL', [[-w / 2, -hh], [-w / 2 + 4, -hh * 0.45], [-7, -6], [-7, 6], [-w / 2 + 4, hh * 0.45], [-w / 2, hh]], { z, w: 4.5 });
        stroke(k + '.hgR', [[w / 2, -hh], [w / 2 - 4, -hh * 0.45], [7, -6], [7, 6], [w / 2 - 4, hh * 0.45], [w / 2, hh]], { z, w: 4.5 });
        const s = clamp((t - T.drip) / (T.jarsOff - T.drip)), topY = lerp(-hh * 0.62, -10, s), botY = lerp(hh - 4, hh * 0.3, s);
        const tw = (yy) => lerp(7, w / 2 - 6, clamp(-yy / (hh * 0.55)));   // half-width of the top bulb at height yy
        stroke(k + '.sT', [[-tw(topY), topY], [tw(topY), topY], [6, -8], [-6, -8]], { z: z - 0.1, closed: true, fill: C.pencil, noStroke: true, opacity: 0.55, w: 1 });
        stroke(k + '.sB', [[0, botY], [w / 2 - 8, hh - 3], [-w / 2 + 8, hh - 3]], { z: z - 0.1, closed: true, fill: C.pencil, noStroke: true, opacity: 0.55, w: 1 });
        if (s > 0 && s < 1) stroke(k + '.st', [[0, -6], [0, botY]], { z: z - 0.05, w: 2, color: C.pencil, boil: 0.6 });
        DL.restore();
        if (lt > 0.25) text(k + '.hgN', '时间', x, y + hh + 54, { size: 40, color: C.red, z: Z.annot, opacity: clamp((lt - 0.25) / 0.2), halo: 8 });
      }
    },
    cues: () => [...T.jar.map(j => [j, 'pop']), [T.glass, 'pop'], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => [T.drip + 0.3 + i * 0.33, 'plip'])],
  };

  /* ---------------- L7–L10: a short running track; a long winding road ---------------- */
  /** a tiny stick runner (not a named character), feet at pos. state: ready | run | cheer | flop */
  COMP.x5_mRunner = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pos = evalTrack(fx.pos, t), sc = (fx.sc ? evalTrack(fx.sc, t) : 1) * Math.max(0.01, EASE.back(clamp(lt / 0.3))), st = stepTrack(fx.state, t) || 'run';
      const scB = fx.sc ? evalTrack(fx.sc, t) : 1, kw = 1 / Math.max(0.5, scB);   // keep the pen width the same at any size
      const k = fx.id, z = fx.z ?? Z.front, zf = fx.z ?? Z.fx, w = 4.8 * kw;   // fx.z: further down the road, behind the jogger
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc);
      const ph = t * 15, s = Math.sin(ph);
      const limb = (key, a, b, c) => stroke(k + key, [a, b, c], { z, w });
      let hip, neck, head;
      if (st === 'flop') {
        // sitting on the road, leaning back on its hands, puffing
        hip = [0, -12]; neck = [-22, -52]; head = [-30, -72];
        limb('.lL', hip, [26, -14], [52, -4]); limb('.lR', hip, [24, -8], [50, 0]);
        limb('.aL', [-20, -46], [-32, -26], [-36, -4]); limb('.aR', [-20, -46], [-8, -26], [-12, -4]);
        for (let i = 0; i < 3; i++) {   // sweat drops flying off
          const u = ((t - fx.flop) * 1.6 + i / 3) % 1, a = (-150 + i * 50) * RAD, r = 22 + 26 * u, c = [head[0] + Math.cos(a) * r, head[1] + Math.sin(a) * r - 6 * u];
          stroke(k + '.sw' + i, [[c[0], c[1] - 6, 1], [c[0] + 4, c[1] + 1], [c[0], c[1] + 5], [c[0] - 4, c[1] + 1], [c[0], c[1] - 6, 1]], { z, w: 2.4 * kw, fill: C.paper, opacity: 1 - u });
        }
      } else if (st === 'ready') {
        hip = [-6, -40]; neck = [18, -74]; head = [30, -92];
        limb('.lL', hip, [10, -22], [0, 0]); limb('.lR', hip, [-26, -22], [-34, 0]);
        limb('.aL', [14, -70], [22, -40], [24, -14]); limb('.aR', [14, -70], [8, -42], [12, -16]);
      } else if (st === 'cheer') {
        hip = [0, -44]; neck = [0, -82]; head = [0, -100];
        limb('.lL', hip, [-8, -22], [-12, 0]); limb('.lR', hip, [8, -22], [12, 0]);
        limb('.aL', [0, -78], [-18, -102], [-22, -126]); limb('.aR', [0, -78], [18, -102], [22, -126]);
      } else {
        hip = [0, -44 - 4 * Math.abs(s)]; neck = [10, -82 - 4 * Math.abs(s)]; head = [16, -100 - 4 * Math.abs(s)];
        const leg = q => { const a = 42 * q * RAD; const kn = [hip[0] + Math.sin(a) * 24, hip[1] + Math.cos(a) * 24]; const b = a - (q < 0 ? 75 : 20) * RAD; return [kn, [kn[0] + Math.sin(b) * 24, kn[1] + Math.cos(b) * 24]]; };
        const L1 = leg(s), L2 = leg(-s);
        limb('.lL', hip, L1[0], L1[1]); limb('.lR', hip, L2[0], L2[1]);
        const sh = lerp2(neck, hip, 0.15), arm = q => { const a = -50 * q * RAD; const el = [sh[0] + Math.sin(a) * 18, sh[1] + Math.cos(a) * 18]; return [el, [el[0] + Math.sin(a + 1.6) * 18, el[1] + Math.cos(a + 1.6) * 18]]; };
        const A1 = arm(s), A2 = arm(-s);
        limb('.aL', sh, A1[0], A1[1]); limb('.aR', sh, A2[0], A2[1]);
        // speed lines trailing behind
        [-70, -46, -22].forEach((y, i) => stroke(k + '.spd' + i, [[-40 - i * 6, y], [-92 - i * 10, y + 2]], { z: zf, w: 3 * kw, boil: 0.8 }));
      }
      stroke(k + '.body', [hip, neck], { z, w });
      stroke(k + '.hf', ringPts(k + '.h', head[0], head[1], 15, 15, { n: 10, closed: true }), { z: z + 0.1, closed: true, fill: C.paper, w });
      if (st === 'flop') {
        stroke(k + '.e0', [[head[0] - 9, head[1] - 6], [head[0] - 4, head[1] - 3], [head[0] - 9, head[1]]], { z: z + 0.2, w: 2.4 * kw });
        stroke(k + '.e1', [[head[0] + 9, head[1] - 6], [head[0] + 4, head[1] - 3], [head[0] + 9, head[1]]], { z: z + 0.2, w: 2.4 * kw });
        stroke(k + '.m', ringPts(k + '.m', head[0], head[1] + 7, 3.5, 4, { n: 7, closed: true }), { z: z + 0.2, w: 2.2 * kw, closed: true });
      } else {
        dot(k + '.e0', [head[0] - 4, head[1] - 2], 2.4, C.ink, z + 0.2); dot(k + '.e1', [head[0] + 6, head[1] - 2], 2.4, C.ink, z + 0.2);
        stroke(k + '.m', st === 'cheer' ? [[head[0] - 5, head[1] + 6], [head[0] + 1, head[1] + 9], [head[0] + 7, head[1] + 6]] : [[head[0] - 3, head[1] + 7], [head[0] + 6, head[1] + 7]], { z: z + 0.2, w: 2.2 * kw });
      }
      DL.restore();
    },
    cues: fx => (fx.sfxAt || []),
  };
  const TRK = { x0: 520, x1: 1440, far: 700, near: 780, start: 572, fin: 1340 };
  COMP.x5_mTrack = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, p = EASE.out(clamp(lt / 0.5)), k = fx.id, z = Z.set + 1, { x0, x1, far, near, start, fin } = TRK;
      stroke(k + '.far', [[x0, far], [lerp(x0, x1, p), far + 1]], { z, w: 4 });
      stroke(k + '.mid', [[x0 + 10, (far + near) / 2], [lerp(x0 + 10, x1 - 10, p), (far + near) / 2]], { z, w: 2.2, color: C.pencil, opacity: 0.7, boil: 0.4 });
      if (p < 0.5) return;
      stroke(k + '.st', [[start + 8, far], [start - 8, near]], { z, w: 4.5 });
      // checkered finish strip
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
        const y0 = far + i * 20, xx = fin - i * 4 + j * 14;
        box(`${k}.ch${i}${j}`, xx, y0, xx + 14, y0 + 20, { z, w: 2, fill: (i + j) % 2 ? C.ink : C.paper });
      }
      // two posts and the tape (it snaps when the runner gets there)
      const P1 = [fin + 34, far - 165], P2 = [fin + 18, near - 165];
      stroke(k + '.po1', [[P1[0], far + 4], P1], { z: z + 0.2, w: 4.5 });
      stroke(k + '.po2', [[P2[0], near - 2], P2], { z: Z.front + 2, w: 4.5 });
      const br = clamp((t - T.dash1 + 0.08) / 0.3);
      if (br <= 0) stroke(k + '.tape', [P1, P2], { z: z + 0.3, w: 3.5 });
      else {
        const m = lerp2(P1, P2, 0.5);
        stroke(k + '.tp1', [P1, [m[0] + 30 * br, m[1] - 34 + 40 * br]], { z: z + 0.3, w: 3.5 });
        stroke(k + '.tp2', [P2, [m[0] + 34 * br, m[1] + 30 + 20 * br]], { z: Z.front + 2, w: 3.5 });
      }
    },
    cues: fx => [[fx.t0, 'pen'], [T.dash1 - 0.08, 'zip']],
  };
  /* the road: a centre line from (600, 786) winding up to the horizon (1280, 240); u = 0 near … 1 far */
  const RP = u => [600 + 680 * Math.pow(u, 1.8) + 420 * Math.sin(u * 2.6 * Math.PI) * u * (1 - u), 786 - 546 * (1 - Math.pow(1 - u, 1.7))];
  const RW = u => 270 * Math.pow(1 - u, 1.4) + 8;
  // the sprinter on the road keeps to the right-hand lane (clear of the jogger), dashes up it, flops; as Tao runs on, it drifts back toward us
  const LANE = u => { const c = RP(u); return [c[0] + RW(u) * 0.22, c[1]]; }, JOGX = 520;
  const SPR_POS = [[0, LANE(0.03)], [T.spr0, LANE(0.24), T.flop - T.spr0, 'out'], [T.flop + 0.1, LANE(0.2), 1.0, 'io']];
  const SIGNS = [{ u: 0.2, size: 64, bw: 96, post: 140 }, { u: 0.46, size: 50, bw: 78, post: 104 }, { u: 0.7, size: 40, bw: 64, post: 78 }];
  COMP.x5_mRoad = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, p = EASE.out(clamp(lt / 0.7)), k = fx.id, z = Z.set + 1;
      const N = 26, L = [], R = [];
      for (let i = 0; i <= N; i++) { const u = i / N * 0.995, c = RP(u), w = RW(u) / 2; L.push([c[0] - w, c[1]]); R.push([c[0] + w, c[1]]); }
      stroke(k + '.L', L, { z, w: 4.5, draw: p });
      stroke(k + '.R', R, { z, w: 4.5, draw: p });
      // the centre dashes stream toward us while he runs
      if (p > 0.6) for (let i = 0; i < 9; i++) {
        const s = (i / 9 + Math.max(0, t - T.jogAt) * 0.11) % 1, u0 = Math.pow(1 - s, 1.6) * 0.95, u1 = u0 + 0.025 * (1 - u0) + 0.004;
        const a = RP(u0), b = RP(Math.min(0.99, u1));
        stroke(k + '.d' + i, [a, b], { z: z + 0.1, w: 2 + 5 * (1 - u0), color: C.pencil, opacity: clamp((p - 0.6) / 0.4) * (u0 < 0.03 ? u0 / 0.03 : 1), boil: 0.3 });
      }
      // little grass ticks along the edges
      for (let i = 1; i < 8; i++) { const u = i / 9, c = RP(u), w = RW(u) / 2 + 14 * (1 - u) + 6, g = 14 * (1 - u) + 4; [-1, 1].forEach(sd => stroke(`${k}.g${i}${sd}`, [[c[0] + sd * w, c[1]], [c[0] + sd * (w + g * 0.4), c[1] - g]], { z, w: 2.4, color: C.pencil, opacity: 0.8 * p, boil: 0.5 })); }
      // signs: 学 学 学
      SIGNS.forEach((sg, i) => {
        const sl = t - T.signs[i]; if (sl < 0) return;
        const c = RP(sg.u), x = c[0] + RW(sg.u) / 2 + 30 * (1 - sg.u) + 18, pp = Math.max(0.01, EASE.back(clamp(sl / 0.25)));
        DL.save(); DL.translate(x, c[1]); DL.scale(pp);
        stroke(`${k}.sp${i}`, [[0, 0], [0, -sg.post]], { z: z + 0.2, w: 4 });
        const bw = sg.bw, bh = bw * 0.8, by = -sg.post - bh / 2;
        box(`${k}.sb${i}`, -bw / 2, by - bh / 2, bw / 2, by + bh / 2, { z: z + 0.3, w: 4, fill: C.paper });
        text(`${k}.st${i}`, '学', 0, by + 2, { size: sg.size, z: z + 0.4 });
        DL.restore();
      });
    },
    cues: () => [[T.road, 'pen'], ...T.signs.map(s => [s, 'pop'])],
  };
  /** a fuel gauge on the runner's chest: the needle swings up to 喜欢 (full) */
  COMP.x5_mGauge = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const lt = t - fx.t0, pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), k = fx.id, z = Z.fx + 1;
      const c = lerp2([a.head[0], a.head[1] + a.r], a.hip, 0.64), R = 36;
      DL.save(); DL.translate(c[0], c[1]); DL.scale(pp);
      stroke(k + '.pl', superPts(12, -10, 226, 74, 20, 6), { z, w: 4, closed: true, fill: C.paper });
      stroke(k + '.arc', ringPts(k + '.arc', -40, 10, R, R, { n: 10, a0: 180, sweep: 180, rv: 0.01 }), { z: z + 0.1, w: 4 });
      [0, 1, 2, 3, 4].forEach(i => { const an = (180 + i * 45) * RAD; stroke(k + '.tk' + i, [[-40 + Math.cos(an) * (R - 9), 10 + Math.sin(an) * (R - 9)], [-40 + Math.cos(an) * (R - 1), 10 + Math.sin(an) * (R - 1)]], { z: z + 0.1, w: 2.6 }); });
      const nu = EASE.back(clamp((t - T.full) / 0.5)), an = (180 + 172 * nu) * RAD;
      stroke(k + '.nd', [[-40, 10], [-40 + Math.cos(an) * (R - 6), 10 + Math.sin(an) * (R - 6)]], { z: z + 0.3, w: 4.5, color: C.red });
      dot(k + '.hub', [-40, 10], 5, C.ink, z + 0.4);
      // the yellow highlighter behind 喜欢 (above the plate, under the word)
      const hp = EASE.out(clamp((t - T.hiLike) / 0.4));
      if (hp > 0) { const x0 = 34, x1 = lerp(x0, 122, hp), top = [], bot = []; for (let i = 0; i <= 6; i++) { const xx = lerp(x0, x1, i / 6); top.push([xx, -34 + Math.sin(i * 1.7) * 2]); bot.unshift([xx, 4 + Math.sin(i * 2.3) * 2]); } stroke(k + '.hi', top.concat(bot), { z: z + 0.15, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 }); }
      text(k + '.like', '喜欢', 79, -14, { size: 40, z: z + 0.2 });
      DL.restore();
      F.targets[k + '.like'] = [c[0] + 79 * pp, c[1] - 14 * pp];
    },
    cues: fx => [[fx.t0, 'pop'], [T.full, 'zip'], [T.hiLike, 'swish']],
  };

  /* ---------------- poses ---------------- */
  const typing = t => {
    const still = t > T.open + 0.3 && t < T.bookOff, f = t >= T.fast ? 22 : 10, amp = still ? 0 : 1;
    return { ...POSE.sitBase, lean: 7, tilt: 3,
      ikL: { w: 1, to: 'abs', dx: KB[0] - 30 + 5 * amp * Math.sin(t * f), dy: KB[1] - 6 - 4 * amp * Math.abs(Math.sin(t * f * 1.3)), bend: 'down' },
      ikR: { w: 1, to: 'abs', dx: KB[0] + 22 + 5 * amp * Math.sin(t * f * 1.1 + 1), dy: KB[1] - 6 - 4 * amp * Math.abs(Math.sin(t * f * 1.2 + 2)), bend: 'down' } };
  };
  const jogPose = t0 => {
    const w = makeWalk(t0, 1e9, 6.2, { lean: -2, bounce: 1.6 });
    return t => { const b = w(t); if (t < t0) return b; const s = Math.sin((t - t0) * 6.2 * Math.PI); return { ...b, armL: [22 + 24 * s, 88], armR: [22 - 24 * s, 88] }; };
  };
  Object.assign(POSE, {
    x5_mPeekD: { lean: -9, tilt: -8, armL: [24, 30], armR: [12, 12] },
    x5_mPeekM: { lean: -7, tilt: -10, armL: [18, 20], ikR: { w: 1, to: 'hip', dx: 30, dy: -6, bend: 'out' } },
  });

  defineScene({
    id: 'marathon', chapter: '写书、短跑和马拉松', dur: DUR, floor: FL,
    cast: { teen: { ...E5.teen }, dad: { ...E5.dad }, mom: { ...E5.mom }, tao: { ...E5.taoAdult } },
    order: ['teen', 'dad', 'mom', 'tao'],
    tracks: {
      teen: {
        enter: T.teen,
        pos: [[0, [STOOL.x, STOOL.seat - 4]], [T.homeOff + 0.32, [-900, STOOL.seat - 4], 0]],
        pose: [[0, typing]],
        face: [[0, { ...FACE.focus, brow: 'arc', browY: 0.02 }], [T.open, 'smile', 0.1], [T.bookOff, { ...FACE.focus, brow: 'arc', browY: 0.02 }, 0.1], [T.sheep, 'sheepish', 0.06]],
        turn: [[0, 0.5]],
        gaze: [[0, 'screen'], [T.open, 'book'], [T.bookOff, 'screen'], [T.arms, 'jars'], [T.drip + 0.8, 'screen'], [T.ask + 0.1, 'dad'], [T.fast, 'screen']],
        squash: [[0, 1], [T.ask + 0.1, 0.94, 0.05], [T.ask + 0.15, 1, 0.22, 'back']],
      },
      dad: {
        enter: T.fam,
        pos: [[0, [1165, FL]], [T.homeOff + 0.32, [-900, FL], 0]],
        pose: [[0, 'x5_mPeekD']],
        face: [[0, { ...FACE.smile, brow: 'line', browL: -10, browR: 16, mouth: 'smirk', mw: 0.3 }]],
        turn: [[0, -0.55]],
        gaze: [[0, 'teen']],
      },
      mom: {
        enter: T.fam + 0.15,
        pos: [[0, [1352, FL]], [T.homeOff + 0.32, [-900, FL], 0]],
        pose: [[0, 'x5_mPeekM']],
        face: [[0, 'smile']],
        turn: [[0, -0.5]],
        gaze: [[0, 'teen']],
      },
      tao: {
        enter: T.tao,
        pos: [[0, [222, FL]], [T.jog0, [JOGX, FL], T.jogAt - T.jog0, 'lin'], [T.end + 0.32, [-900, FL], 0]],
        pose: [[0, 'stand'], [T.point, 'present', 0.15, 'back'], [T.dash1 + 0.4, 'stand', 0.2], [T.jog0, jogPose(T.jog0), 0.12]],
        face: [[0, 'smile'], [T.flop, { ...FACE.smile, brow: 'arc', browY: 0.04 }, 0.08], [T.full, 'joy', 0.08]],
        turn: [[0, 0.4], [T.jog0, 0.3, 0.12]],
        gaze: [[0, 'viewer'], [T.point, 'runner'], [T.dash1 + 0.5, 'viewer'], [T.jog0, [1300, 300]], [T.spr0, 'sprinter'], [T.sprOff, [1300, 300]], [T.gauge + 0.1, 'viewer']],
      },
    },
    targets: F => ({ screen: [MAC[0], MAC[1] - 150], book: [BK.at[0] + 140, 420], jars: [1115, 560], runner: [lerp(TRK.start, TRK.fin + 60, clamp((F.t - T.dash0) / (T.dash1 - T.dash0))), 600],
      sprinter: (p => [p[0], p[1] - 90])(evalTrack(SPR_POS, F.t)) }),
    set: [
      { type: 'floor', t0: T.desk, t1: T.trackOff + 0.32 },
      { type: 'stool', x: STOOL.x, seat: STOOL.seat, t0: T.desk, t1: T.homeOff + 0.32 },
      { type: 'desk', x: DESK.x, top: DESK.top, w: DESK.w, t0: T.desk, t1: T.homeOff + 0.32 },
      { type: 'door', x: 1258, w: 384, top: 248, t0: T.door, t1: T.homeOff + 0.32 },
    ],
    steps: [{ t0: T.jog0, t1: T.end, hz: 6.2 }],
    fx: [
      // the stamp: 长大后 (as scene 50 left it) → 15 岁 写书 → 长大后
      { type: 'x5_mStamp', label: '长大后', t0: -3, ...E5.STAMP, dockT: -2, out: T.sAdOut },
      { type: 'x5_mStamp', age: 15, place: '写书', t0: T.s15, ...E5.STAMP, dockT: T.s15dock, out: T.s15out },
      { type: 'x5_mStamp', label: '长大后', t0: T.sAd, ...E5.STAMP, dockT: T.sAdDock },
      // L1–L6: the computer, the book, the jars, the family at the door
      { type: 'prop', id: 'x5mMac', kind: 'x5_mMac', at: MAC, t0: T.desk, t1: T.homeOff + 0.32, drawDur: 0.5, sfxAt: [[T.desk, 'pen']] },
      { type: 'x5_mBook', id: 'x5mBk', t0: T.book, t1: T.bookOff + 0.32 },
      { type: 'label', id: 'x5mBkL', text: '15 岁写的书', size: 46, at: [1150, 160], rot: -3, t0: T.bookLab, t1: T.open, target: [1150, 236], bend: 0.15, gap: 10 },
      ...QL.map((s, i) => ({ type: 'scribe', id: 'x5mQ' + i, text: s, x: QX, y: QY[i], size: 44, t0: T.q[i], t1: T.bookOff + 0.32, cps: 4, z: Z.set + 2 })),
      { type: 'band', id: 'x5mHiFun', rect: [QX - 2, QY[2] - 23, 90, 46], t0: T.hiFun, t1: T.bookOff + 0.32, dur: 0.35 },
      { type: 'title', id: 'x5mArms', text: '两样主要武器', x: 1115, y: 330, size: 46, color: 'red', rot: -2, t0: T.arms, t1: T.jarsOff + 0.32 },
      { type: 'x5_mJars', id: 'x5mJar', t0: T.jar[0], t1: T.jarsOff + 0.32 },
      { type: 'speech', id: 'x5mAsk', text: '进度呢？', at: [880, 250], tail: [130, 44], speaker: 'dad', t0: T.ask, t1: T.homeOff + 0.32, size: 72, rot: -3 },
      { type: 'x5_mFast', id: 'x5mFast', char: 'teen', t0: T.fast, t1: T.homeOff + 0.32 },
      // L7: the short track
      { type: 'x5_mTrack', id: 'x5mTrk', t0: T.track, t1: T.trackOff + 0.32 },
      { type: 'x5_mRunner', id: 'x5mRun', t0: T.track + 0.2, t1: T.trackOff + 0.32, pos: [[0, [TRK.start + 30, 742]], [T.dash0, [TRK.fin + 70, 742], T.dash1 - T.dash0, 'lin']], sc: [[0, 1.9]],
        state: [[0, 'ready'], [T.dash0, 'run'], [T.dash1 + 0.05, 'cheer']], sfxAt: [[T.dash0, 'whip']] },
      { type: 'title', id: 'x5mSprL', text: '短跑 = 奥数比赛', x: 960, y: 330, size: 50, color: 'red', rot: -3, t0: T.sprintLab, t1: T.trackOff + 0.32 },
      // L8–L10: the long road
      { type: 'x5_mRoad', id: 'x5mRd', t0: T.road, t1: T.end + 0.32 },
      { type: 'title', id: 'x5mMar', text: '马拉松 = 做研究', x: 720, y: 196, size: 50, color: 'red', rot: -2, t0: T.maraLab, t1: T.end + 0.32 },
      { type: 'x5_mRunner', id: 'x5mSpr2', z: Z.body - 2, t0: T.spr0, t1: T.sprOff + 0.32, pos: SPR_POS, sc: [[0, 1.7], [T.spr0, 1.45, T.flop - T.spr0, 'out'], [T.flop + 0.1, 1.5, 1.0, 'io']],
        state: [[0, 'run'], [T.flop, 'flop']], flop: T.flop, sfxAt: [[T.spr0, 'whip'], [T.flop, 'thud']] },
      { type: 'x5_mGauge', id: 'x5mG', char: 'tao', t0: T.gauge, t1: T.end + 0.32 },
      { type: 'title', id: 'x5mSrc', text: '（2009 年采访）', x: 1270, y: 700, size: 38, color: 'red', rot: -2, t0: T.src, t1: T.end + 0.32 },
      // eased exits (must stay last: they fade what was drawn before them)
      { type: 'x5_mFade', t0: T.open - 0.3, d: 0.25, keys: ['x5mBkL'] },
      { type: 'x5_mFade', t0: T.bookOff, d: 0.3, keys: ['x5mBk', 'x5mQ', 'x5mHiFun'] },
      { type: 'x5_mFade', t0: T.jarsOff, d: 0.3, keys: ['x5mJar', 'x5mArms'] },
      { type: 'x5_mFade', t0: T.homeOff, d: 0.3, keys: ['teen.', 'dad.', 'mom.', 'x5mMac', 'x5mAsk', 'x5mFast', 'stool', 'desk', 'door'] },
      { type: 'x5_mFade', t0: T.trackOff, d: 0.3, keys: ['x5mTrk', 'x5mRun', 'x5mSprL', 'floor'] },
      { type: 'x5_mFade', t0: T.sprOff, d: 0.3, keys: ['x5mSpr2'] },
      { type: 'x5_mFade', t0: T.end, d: 0.3, keys: ['tao.', 'x5mRd', 'x5mMar', 'x5mG', 'x5mSrc'] },
    ],
    sfx: [[T.teen, 'pop'], [T.fam, 'pop'], [T.fam + 0.15, 'pop'], [T.sheep, 'boop'], [T.tao, 'pop'], [T.point, 'tap'],
      ...[...Array(14).keys()].map(i => [T.type0 + 0.1 + i * 0.29, 'key']),
      ...[...Array(20).keys()].map(i => [T.bookOff + 0.2 + i * 0.6, 'key']),
      ...[...Array(16).keys()].map(i => [T.fast + i * 0.13, 'key'])],
    subs: [
      { t0: 0.3, t1: 4.9, text: '十五岁，他写了一本书，教人怎么解题。' },
      { t0: 5.4, t1: 7.8, text: '书的开头写着：' },
      { t0: 8.1, t1: 12.3, text: '“我喜欢数学，只是因为它好玩。”' },
      { t0: 13.0, t1: 17.6, text: '他还写：两样主要武器——经验和知识，' },
      { t0: 17.9, t1: 21.3, text: '“只能靠时间，慢慢攒。”' },
      { t0: 22.0, t1: 27.0, text: '他还谢谢家人：在他拖进度时，说了他几句。' },
      { t0: 27.9, t1: 31.3, text: '长大后他说：奥数像短跑；' },
      { t0: 31.4, t1: 35.0, text: '做数学研究，更像跑马拉松：' },
      { t0: 35.4, t1: 40.4, text: '不能一直冲刺，要一直学，还要真心喜欢——' },
      { t0: 40.7, t1: 44.9, text: '“不喜欢，就没有力气坚持下去。”' },
    ],
  });
})();
