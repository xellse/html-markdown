// 第 10 场 · 进国家队（10 岁，1986 年）
// 事实（ep4-script.md）：1986 年通过澳大利亚数学奥林匹克入选国家队；六名队员，另外五人是 11、12 年级的高中生（十六七岁）。
//   澳大利亚奥数委员会的历史记录："We had heard a lot about young Terry but until this year we were not sure how good he really was."
//   第 27 届 IMO 在波兰华沙（1986 年 7 月）。陶哲轩 2004 年回忆："possibly the first extended social experience I had away
//   from my parents, and the first time I can really remember playing a tourist."；委员会记录："Terry fitted in well, socially, with the team"。
// 演绎（画面上的比方，不是真实事件）：比身高、踮脚、老师脑袋里的“厉害表”、和队友击掌、华沙街头拍照。名单上不写名次（没有记录）。
// 开头接第 5 场的结尾（红字“再考一次！”，小陶已经走出画面右边，那时还没有印章）；本集第一次在中央盖“10 岁”印章，再停靠。
(() => {
  const FL = 780, OFF = [-700, FL];
  const TX = 330, TXE = 820;                                   // Terry's spot on the plain stage / in Warsaw

  /* ---------------- times (scene clock) ---------------- */
  const AMO_T = 1.9, A_OUT = 5.15;                             // the olympiad's name; 1986 + the name clear for the stamp
  const STAMP = 5.2, JUMP = 5.62, DOCK = 7.25, CARD = 7.35, CHECK = 8.3, RING6 = 9.95;
  const LINE = 10.6, UPLOOK = 11.3, LB10 = 12.45, LOOKDOWN = 13.7, LB16 = 14.9, TIP = 15.75, REACH = 16.3, DROP = 17.15;
  const FADE = 17.95, OUT0 = 18.3, OUT_DT = 0.09;               // labels fade out; then the five big kids pop off, one by one
  const LEAD = 18.9, CLOUD = 21.0, SEE = 22.0, SCRATCH = 23.6, GAUGE = 24.5;
  const MAP = 27.3, TAKEOFF = 28.25, LAND = 30.4;
  const ST = 31.95, STOP = ST + 1.4, JOKE = 33.7, HI_UP = 34.45, HI_T = 34.6, HI_DOWN = 35.15, LAUGH1 = 36.2, LOOK = 36.8, SPIN = 39.3;
  const RAISE = 41.5, CLICK = 42.1, LOWER = 43.1;
  const DUR = 44.5;

  /* ---------------- sounds ---------------- */
  SFX.define('t4_click', (tone, noise) => {             // camera shutter
    noise('highpass', 2800, 0.8, 0.022, 0.4); tone('square', 1900, 1500, 0.014, 0.05);
    noise('bandpass', 1500, 1.4, 0.05, 0.3, null, 0.07); tone('square', 900, 700, 0.02, 0.05, null, 0.07);
  });
  SFX.define('t4_plane', (tone, noise) => { noise('bandpass', 700, 1.2, 0.5, 0.06, 1500); tone('sawtooth', 110, 150, 0.45, 0.025); });
  SFX.define('t4_squeak', tone => { tone('triangle', 500, 1150, 0.22, 0.12, [24, 40]); });
  SFX.define('t4_clap', (tone, noise) => { noise('bandpass', 1900, 0.9, 0.07, 0.38); noise('highpass', 4200, 0.7, 0.03, 0.12); });

  /* ---------------- cast: the five teammates (shared E4.mate1–5), two team leaders (local: they only appear here) ---------------- */
  Object.assign(HAIR, {
    // team leader 1: a flat crew cut
    t4_crew() {
      const top = [];
      for (let i = 0; i <= 10; i++) { const x = -0.92 + i * 0.184; top.push([x, -1.08 - (i % 2 ? 0.07 : 0) + Math.abs(x) * 0.12]); }
      return [[[-0.98, -0.3], [-1.0, -0.72], ...top, [1.0, -0.72], [0.98, -0.3]]];
    },
    // team leader 2: swept-over wavy hair and a moustache
    t4_wave() {
      return [
        [[-0.95, -0.45], [-0.85, -0.95], [-0.35, -1.18], [0.25, -1.14], [0.7, -0.96], [1.0, -0.55]],
        [[-0.6, -0.86], [-0.2, -0.98], [0.2, -0.86], [0.55, -0.72]],
        [[-0.3, 0.42], [-0.12, 0.36], [0, 0.42], [0.12, 0.36], [0.3, 0.42]],
      ];
    },
  });
  const CAST4 = {
    terry: E4.terry,
    m4: E4.mate4,                                              // the team's one 大姐姐 (ponytail)
    m2: E4.mate2,
    m1: E4.mate1,
    m3: E4.mate3,
    m5: E4.mate5,
    // stand-ins for the pop-off at the end of the line-up (not in `order`: drawn, shrinking, by COMP.t4_popOut)
    x_m2: E4.mate2, x_m1: E4.mate1, x_m4: E4.mate4, x_m3: E4.mate3, x_m5: E4.mate5,
    ld1: { H: 430, head: 0.35, torso: 0.25, leg: 0.32, arm: 0.36, hair: 't4_crew', glasses: true, blink: [4.4, 1.3] },
    ld2: { H: 425, head: 0.35, torso: 0.25, leg: 0.32, arm: 0.36, hair: 't4_wave', blink: [3.8, 2.9] },
  };

  /* ---------------- 0 · the end of the recap, leaving ---------------- */
  /** the recap's red “再考一次！” (same place and size), whisked away */
  COMP.t4_again = {
    draw(fx, t) {
      const u = clamp((t - fx.out) / 0.22); if (u >= 1) return;
      const e = EASE.in(u);
      text('t4.again', '再考一次！', 640 - 90 * e, 380 - 40 * e, { size: 100, color: C.red, z: Z.annot, rot: -4 - 8 * e, scale: 1 - 0.55 * e, opacity: 1 - e });
    },
    cues: fx => [[fx.out, 'whoosh']],
  };

  /* ---------------- 1 · the team list ---------------- */
  /** 国家队（6 人）: five pencil scribbles (the others' names) and 小陶 with a red tick. No ranks. {at, t0, t1, me, check, ring} */
  COMP.t4_roster = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [cx, cy] = fx.at, lt = t - fx.t0, k = fx.id, z = Z.set + 1, W = 450, H = 480, top = cy - H / 2, x0 = cx - W / 2;
      const op = 1 - clamp((t - fx.t1 + 0.2) / 0.2), p = EASE.out(clamp(lt / 0.4));
      stroke(k + '.card', superPts(cx, cy, W, H, 24, 12), { z, w: 5, closed: true, fill: C.paper, draw: p, opacity: op });
      const hq = clamp((lt - 0.25) / 0.2), hy = top + 62, x6 = cx + 48;
      if (hq > 0) {
        text(k + '.h1', '国家队（', x6 - 20, hy, { size: 54, anchor: 'end', z: z + 0.2, opacity: hq * op });
        text(k + '.h6', '6', x6, hy + 2, { size: 62, font: CFG.FONT_MIX, z: z + 0.2, opacity: hq * op });
        text(k + '.h2', ' 人）', x6 + 16, hy, { size: 54, anchor: 'start', z: z + 0.2, opacity: hq * op });
        stroke(k + '.rule', [[x0 + 34, hy + 48], [x0 + W - 34, hy + 45]], { z: z + 0.1, w: 3, draw: EASE.out(clamp((lt - 0.3) / 0.3)), opacity: op });
      }
      for (let i = 0; i < 6; i++) {
        const y = top + 158 + i * 54, q = clamp((lt - 0.4 - i * 0.08) / 0.2); if (q <= 0) continue;
        dot(k + '.b' + i, [x0 + 58, y], 6 * q * op, C.ink, z + 0.2);
        if (i === fx.me) continue;
        const n = 6 + Math.round((rnd(hstr(k), i, 1) + 1) * 2), pts = [];
        for (let j = 0; j <= n; j++) pts.push([x0 + 92 + j * 26, y + (j % 2 ? -8 : 6) + rnd(hstr(k), i, j + 5) * 2]);
        stroke(k + '.s' + i, pts, { z: z + 0.1, w: 3, color: C.pencil, opacity: q * op, boil: 0.6, draw: q });
      }
      const my = top + 158 + fx.me * 54, nq = clamp((lt - 0.8) / 0.2);
      if (nq > 0) text(k + '.me', '小陶', x0 + 88, my, { size: 52, anchor: 'start', z: z + 0.3, opacity: clamp(nq * 3) * op, scale: lerp(0.6, 1, EASE.back(nq)) });
      const cq = EASE.out(clamp((t - fx.check) / 0.25));
      if (cq > 0) stroke(k + '.ck', [[x0 + 214, my - 2], [x0 + 234, my + 20, 1], [x0 + 276, my - 34]], { z: Z.annot, w: 6.5, color: C.red, draw: cq, opacity: op });
      const rq = EASE.out(clamp((t - fx.ring) / 0.35));
      if (rq > 0) stroke(k + '.r6', ringPts(k + '.r6', x6, hy + 4, 34, 38, { n: 11, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: rq, opacity: op });
    },
    cues: fx => [[fx.t0, 'paper'], [fx.t0 + 0.8, 'pop'], [fx.check, 'pen'], [fx.ring, 'pen']],
  };

  /* ---------------- 2 · six in a row ---------------- */
  /** a long red brace over the big kids' heads, with “16、17 岁” on top. {x0, x1, y, text, t0, t1} */
  COMP.t4_brace = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, p = EASE.out(clamp(lt / 0.35)), { x0, x1, y } = fx, xm = (x0 + x1) / 2, k = fx.id;
      stroke(k + '.L', [[x0, y + 28], [x0 + 10, y + 4, 1], [xm - 26, y + 2, 1], [xm, y - 16, 1]], { z: Z.annot, w: 4.5, color: C.red, draw: p, boil: 0.7 });
      stroke(k + '.R', [[x1, y + 28], [x1 - 10, y + 4, 1], [xm + 26, y + 2, 1], [xm, y - 16, 1]], { z: Z.annot, w: 4.5, color: C.red, draw: p, boil: 0.7 });
      const q = clamp((lt - 0.25) / 0.2);
      if (q > 0) text(k + '.t', fx.text, xm, y - 58, { size: 54, color: C.red, z: Z.annot, rot: -2, scale: lerp(0.6, 1, EASE.back(q)), opacity: clamp(q * 3), halo: 8 });
    },
    cues: fx => [[fx.t0, 'pen'], [fx.t0 + 0.25, 'pop']],
  };
  /** a pencil dashed line level with the tall kids' heads, so the gap shows when he goes up on tiptoe */
  COMP.t4_hline = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.3)), n = 12;
      for (let i = 0; i < n; i++) {
        const a = fx.x1 - (fx.x1 - fx.x0) * i / n, b = a - (fx.x1 - fx.x0) / n * 0.55;
        if (i / n > p) break;
        stroke(fx.id + '.d' + i, [[a, fx.y], [b, fx.y]], { z: Z.annot - 1, w: 3, color: C.pencil, boil: 0.5 });
      }
    },
  };

  /* ---------------- 3 · the team leaders ---------------- */
  const LD1X = 880, LD2X = 1100, CLIP = [LD1X - 44, 604];
  /** the clipboard with the team list, held in ld1's left hand */
  COMP.t4_clip = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const c = [a.handL[0] + 40, a.handL[1] - 14], k = fx.id, z = Z.front + 1, W = 86, H = 112;
      const pop = Math.max(0.01, EASE.back(clamp((t - fx.t0) / 0.2)));   // comes in once ld1 has popped in
      DL.save(); DL.translate(c[0], c[1]); DL.rotate(-6); DL.scale(pop);
      stroke(k + '.b', [[-W / 2, -H / 2], [W / 2, -H / 2, 1], [W / 2, H / 2, 1], [-W / 2, H / 2, 1], [-W / 2, -H / 2, 1]], { z, w: 4, fill: C.paper });
      stroke(k + '.c', [[-16, -H / 2 - 8], [16, -H / 2 - 8, 1], [16, -H / 2 + 8, 1], [-16, -H / 2 + 8, 1], [-16, -H / 2 - 8, 1]], { z: z + 0.1, w: 3.5, fill: C.paper });
      for (let i = 0; i < 6; i++) {
        const y = -H / 2 + 26 + i * 14, pts = [];
        for (let j = 0; j <= 5; j++) pts.push([-W / 2 + 14 + j * 11, y + (j % 2 ? -2.5 : 2)]);
        stroke(k + '.l' + i, pts, { z: z + 0.1, w: 2, color: i === 3 ? C.ink : C.pencil, boil: 0.5 });
      }
      DL.restore();
      F.targets[k] = c;
    },
  };
  /** what the leaders have in mind: his face, only heard about (little word-of-mouth arcs) … then a 厉害 dial that can't settle */
  COMP.t4_mind = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [cx, cy] = fx.at, z = Z.fx + 1, k = fx.id, lt = t - fx.t0;
      const pp = Math.max(0.01, EASE.back(clamp(lt / 0.3))), pc = [cx - 92, cy + 2];
      DL.save(); DL.about(pc[0], pc[1], () => DL.scale(pp));
      portrait(k + '.face', pc[0], pc[1], 42, { z, happy: true });
      DL.restore();
      const sp = clamp((lt - 0.3) / 0.2) * (1 - clamp((t - fx.tg) / 0.2));
      if (sp > 0) [-1, 1].forEach(s => [0, 1].forEach(j => {
        const r = 64 + j * 17 + 3 * Math.sin(t * 7 + j * 2), pts = [];
        for (let i = 0; i <= 4; i++) { const a = ((s < 0 ? 180 : 0) - 32 + i * 16) * RAD; pts.push([pc[0] + Math.cos(a) * r, pc[1] + Math.sin(a) * r]); }
        stroke(k + '.w' + (s < 0 ? 'L' : 'R') + j, pts, { z, w: 3.2, opacity: sp, boil: 0.7 });
      }));
      if (t < fx.tg) return;
      const gq = Math.max(0.01, EASE.back(clamp((t - fx.tg) / 0.3))), g = [cx + 92, cy + 34], R = 64;
      DL.save(); DL.about(g[0], g[1] - 20, () => DL.scale(gq));
      const arc = []; for (let i = 0; i <= 12; i++) { const a = (180 + i * 15) * RAD; arc.push([g[0] + Math.cos(a) * R, g[1] + Math.sin(a) * R]); }
      stroke(k + '.dial', [[g[0] - R, g[1], 1], ...arc.slice(1, -1), [g[0] + R, g[1], 1], [g[0] - R, g[1], 1]], { z, w: 4, fill: C.paper });
      [180, 225, 270, 315, 360].forEach((d, i) => { const a = d * RAD; stroke(k + '.tk' + i, [[g[0] + Math.cos(a) * R * 0.74, g[1] + Math.sin(a) * R * 0.74], [g[0] + Math.cos(a) * R * 0.92, g[1] + Math.sin(a) * R * 0.92]], { z: z + 0.1, w: 3 }); });
      const lt2 = t - fx.tg, na = (270 + 74 * Math.sin(lt2 * 4.4) + 14 * Math.sin(lt2 * 11.3)) * RAD;
      stroke(k + '.nd', [g, [g[0] + Math.cos(na) * R * 0.82, g[1] + Math.sin(na) * R * 0.82]], { z: z + 0.2, w: 4.5, boil: 0 });
      dot(k + '.pv', g, 6, C.ink, z + 0.3);
      text(k + '.lab', '厉害', g[0], g[1] + 36, { size: 36, z: z + 0.2 });
      DL.restore();
      const qq = clamp((t - fx.tg - 0.35) / 0.2);
      if (qq > 0) text(k + '.q', '?', g[0] + R + 26, g[1] - R + 4, { size: 76, font: CFG.FONT_MIX, color: C.red, z: z + 0.3, rot: 12, scale: lerp(0.4, 1, EASE.back(qq)), opacity: clamp(qq * 3) });
    },
    cues: fx => [[fx.t0, 'boop'], [fx.tg, 'boing'], [fx.tg + 0.35, 'pop']],
  };

  /* ---------------- 4 · the flight: a hand-drawn map, Australia → Warsaw ---------------- */
  const MP = { x0: 350, y0: 130, lon0: -20, lat0: 72, k: 5 };
  const geo = (lon, lat) => [MP.x0 + (lon - MP.lon0) * MP.k, MP.y0 + (MP.lat0 - lat) * MP.k];
  const pairs = a => { const r = []; for (let i = 0; i < a.length; i += 2) r.push(geo(a[i], a[i + 1])); return r; };
  // rough coastlines (lon, lat). Eurasia is an open line: it runs off the top and right edges of the map.
  const COAST = [
    { open: true, pts: pairs([69, 72, 69, 68.5, 61, 69.8, 55, 68.5, 44, 68.5, 41, 67.5, 33, 69.5, 26, 71, 19, 70, 14, 67.5, 10, 64.5, 5.5, 62.5, 5.2, 59.5,
      8, 58.1, 11, 58.8, 12.8, 55.8, 16.5, 56.5, 18.5, 59.5, 17.5, 61.5, 21, 64.7, 25, 65.5, 21.5, 63, 22.5, 60, 28.5, 60, 24, 57.3, 21, 56.5, 19, 54.5,
      14, 54, 10.5, 54.5, 10.5, 57.6, 8.5, 57.2, 8.5, 53.8, 4.5, 52.5, 1.5, 50.5, -4.6, 48.4, -1.2, 46, -1.5, 43.5, -9, 43, -9.5, 37, -6.4, 36.8, -5.6, 36,
      -2.1, 36.7, 0.2, 38.8, -0.3, 39.5, 0.8, 40.7, 3.2, 41.9, 3.2, 43.3, 6.6, 43.1, 8.7, 44.4, 10.2, 43.9, 11.1, 42.4, 15.6, 40, 15.7, 38, 16.8, 39.2,
      18.5, 40.1, 15.9, 41.6, 12.3, 44.4, 13.7, 45.6, 16.2, 43.5, 19.4, 41.9, 19.5, 40, 22, 36.5, 23.8, 40.4, 26.3, 40.8, 26.5, 39, 28, 36.8, 32.8, 36.1,
      36, 36.6, 35.1, 33.2, 34.2, 31.3, 32.6, 29.9, 33.6, 27.9, 34.6, 29.5, 36.6, 25.8, 39, 21.6, 42.8, 15.5, 43.4, 12.8, 45, 12.8, 48.9, 14, 52.2, 15.6,
      55, 17, 57.7, 18.9, 59.8, 22.4, 58.6, 23.6, 56.4, 24.6, 56.2, 26, 54, 24.1, 51.4, 24.3, 50.1, 26, 48.4, 28.4, 48, 30, 50.1, 30.1, 51.4, 27.9, 54, 26.7,
      56.3, 27.2, 57.3, 25.8, 61.6, 25.2, 66.6, 25.4, 68.6, 23.3, 70.3, 21, 72.6, 21.3, 72.8, 19, 74.6, 14, 76.3, 9.8, 77.5, 8, 80, 10.3, 80.2, 15.6,
      82.3, 16.6, 84.8, 19.2, 86.9, 20.8, 89, 21.8, 91.8, 22.4, 94.4, 19.4, 94.3, 16, 97.6, 16.5, 98.5, 12.5, 98.3, 8, 101.3, 2.8, 104, 1.4, 103.4, 4.4,
      100.4, 7.4, 99.3, 10, 100.8, 13.5, 102.5, 12.2, 104.8, 10.5, 105, 8.7, 106.5, 9.8, 109.2, 11.5, 108.8, 15.2, 106, 19.5, 108, 21.5, 111, 21.5,
      116, 22.8, 119.5, 25.5, 121.5, 28.5, 121.8, 31.5, 120.5, 34.3, 122.5, 37, 119, 37.1, 118, 38.5, 121.5, 39, 124.5, 39.8, 126.3, 37.8, 126.5, 34.5,
      129.5, 35.5, 130, 42.5, 135, 43.2, 140, 48, 141, 52.5, 137, 54, 143, 59.3, 154, 59.3, 160, 61]) },
    { pts: pairs([32.3, 31.3, 29.9, 31.2, 25, 31.6, 20, 30.8, 19, 30.3, 20, 32, 15.2, 32.3, 11, 33.2, 10.2, 36.9, 3, 36.8, -2, 35.1, -5.9, 35.8, -6.8, 34,
      -9.6, 30.5, -13.2, 27.7, -16.5, 22.3, -17.1, 20.8, -16.5, 19.4, -17.4, 14.7, -16.8, 12.3, -15, 11, -13.2, 8.8, -11.4, 6.8, -7.6, 4.4, -2, 4.8, 1, 6,
      4.5, 6.3, 6.3, 4.3, 8.5, 4.7, 9.8, 3.1, 9.3, -0.5, 11.8, -3.5, 13.3, -8.5, 11.8, -16.5, 14.5, -22.8, 17.5, -29.6, 18.4, -34, 20, -34.8, 25.6, -34,
      28, -32.8, 31.3, -29.2, 32.6, -25.9, 35.4, -24.1, 35.5, -21, 40.6, -15, 40.5, -10.6, 39.3, -6.6, 40.2, -2.6, 41.9, -0.7, 43.5, 1.7, 47.5, 4.9,
      51.3, 11.6, 49.1, 11.3, 43.3, 11.6, 42.5, 13.9, 40, 15.9, 38.4, 18.5, 37.2, 21.7, 35.6, 23.9, 34, 26.5, 32.6, 29.9]) },             // Africa
    { pts: pairs([113.5, -22, 114.2, -26.5, 115, -30, 115.7, -33.6, 114.9, -34.4, 118, -35.1, 121.3, -33.9, 124, -32.9, 126.5, -32.2, 131, -31.5,
      134.2, -32.6, 135.8, -34.8, 137.6, -33, 137.8, -35.6, 139.6, -37.2, 140.8, -38.1, 143.6, -38.8, 146.3, -39.1, 149.9, -37.5, 150.2, -35.5,
      151.2, -33.9, 152.5, -32, 153.6, -28.5, 153.2, -25.5, 150.8, -22.6, 149, -20.5, 146.3, -18.9, 145.4, -15.6, 143.5, -14.2, 142.5, -10.7,
      141.6, -12.6, 141.5, -15.9, 140.6, -17.5, 139.3, -17.4, 137.2, -15.9, 135.7, -15, 136.9, -12.3, 135.4, -12, 132.6, -11.5, 131.1, -12.2,
      129.8, -15, 128.3, -15, 126.2, -14, 124.4, -16.5, 122.2, -17.9, 121.1, -19.6, 118.8, -20.3, 116.7, -20.6, 114.6, -21.8]), aus: true },   // Australia
    { pts: pairs([144.6, -40.7, 148.3, -40.9, 148, -43.2, 146.9, -43.6, 145.2, -42.2]) },                                                     // Tasmania
    { pts: pairs([131, -1.3, 134, -0.9, 135.4, -3.3, 138, -1.6, 141, -2.6, 144.6, -3.9, 147.5, -6.1, 148.1, -8.1, 150.8, -10.3, 147.4, -10.1,
      144.6, -7.6, 143.3, -8.3, 142.6, -9.3, 141, -9.1, 139, -8.1, 137.9, -5.4, 135.2, -4.5, 133, -4.1, 132, -2.9]) },                         // New Guinea
    { pts: pairs([109, 1.5, 110.5, 2, 113, 3.1, 115.4, 5.3, 117.2, 7, 119, 5.2, 118, 4.3, 117.8, 1.6, 119, 0.9, 116.5, -2.2, 116, -3.9, 114.5, -4,
      111.9, -3.5, 110.2, -2.9, 109.6, -0.6]) },                                                                                              // Borneo
    { pts: pairs([95.3, 5.6, 97.6, 5.2, 100.4, 2.1, 103.8, -0.9, 106, -3.2, 105.9, -5.8, 104.6, -5.9, 102.3, -4, 100.5, -1.1, 98.7, 1.6]) },   // Sumatra
    { pts: pairs([105.2, -6.8, 108.2, -6.4, 111.5, -6.6, 114.6, -7.7, 111, -8.3, 106.4, -7.4]) },                                              // Java
    { pts: pairs([130.9, 34, 133, 35.5, 135.4, 35.7, 136.8, 37.3, 139.9, 40, 141.5, 41.4, 142, 39.5, 140.9, 36.9, 139.8, 35, 138.2, 34.7, 136.8, 34.3,
      135.1, 33.9, 132.5, 33.9]) },                                                                                                           // Honshu
    { pts: pairs([140, 41.7, 140.4, 43.3, 141.7, 45.4, 145.3, 43.3, 143.2, 42, 141.1, 41.8]) },                                                 // Hokkaido
    { pts: pairs([129.8, 33.3, 131.2, 33.9, 131.9, 32.6, 130.6, 31, 129.8, 32.7]) },                                                            // Kyushu
    { pts: pairs([120.1, 23, 121.5, 25.2, 122, 24.6, 120.8, 22]) },                                                                             // Taiwan
    { pts: pairs([79.8, 6.2, 79.9, 8.6, 80.4, 9.8, 81.8, 7.6, 81.2, 6.2]) },                                                                    // Sri Lanka
    { pts: pairs([120, 16, 120.6, 18.5, 122.3, 18.3, 121.8, 15.6, 124, 13, 123.3, 12.9, 120.6, 14.3]) },                                        // Luzon
    { pts: pairs([122, 7, 124, 8.5, 126.5, 7.3, 126, 6.3, 124.1, 6.2]) },                                                                       // Mindanao
    { pts: pairs([49.3, -12, 50.5, -15.5, 49.2, -19.5, 47, -25, 44, -24.5, 43.5, -21.5, 44.4, -16.5, 47, -15]) },                               // Madagascar
    { pts: pairs([-5.7, 50, 1.4, 51.2, 1.7, 52.7, 0, 53.5, -1.6, 55.6, -2, 57.7, -3, 58.6, -5, 58.6, -6.2, 56.8, -4.9, 55.1, -3.2, 54.8, -3.2, 53.3,
      -4.7, 52.8, -5.1, 51.7, -3.4, 51.4]) },                                                                                                  // Great Britain
    { pts: pairs([-6, 52.2, -6.2, 54, -7.4, 55.3, -8.5, 54.4, -10, 53.5, -9.9, 51.7, -8, 51.7]) },                                              // Ireland
    { pts: pairs([28, 41.5, 28, 43.5, 30.5, 46.5, 33.5, 44.5, 36.5, 45.3, 38.3, 47, 39.7, 47, 37.3, 44.9, 41.6, 41.6, 38, 40.9, 35, 42, 31.2, 41.2]) },  // Black Sea
    { pts: pairs([47, 44.5, 49.2, 46.5, 52.5, 46.9, 53, 45, 51.3, 44.3, 52.8, 41.8, 53.9, 40.7, 53.9, 37.3, 50.4, 37.4, 48.9, 38.4, 49.6, 40.5, 47, 43]) },  // Caspian
  ];
  const START = geo(134, -21), WAW = geo(21, 52.2), CTRL = [1010, 200];
  const route = u => [(1 - u) * (1 - u) * START[0] + 2 * u * (1 - u) * CTRL[0] + u * u * WAW[0], (1 - u) * (1 - u) * START[1] + 2 * u * (1 - u) * CTRL[1] + u * u * WAW[1]];
  const routeDir = u => Math.atan2(2 * (1 - u) * (CTRL[1] - START[1]) + 2 * u * (WAW[1] - CTRL[1]), 2 * (1 - u) * (CTRL[0] - START[0]) + 2 * u * (WAW[0] - CTRL[0])) / RAD;
  const flyU = t => EASE.io(clamp((t - TAKEOFF) / (LAND - TAKEOFF)));
  const MAPBOX = [318, 102, 1282, 736];
  COMP.t4_map = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, k = fx.id, z = Z.set + 1, [x0, y0, x1, y1] = MAPBOX, p = EASE.out(clamp(lt / 0.4));
      stroke(k + '.card', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.shade', [[x0 + 14, y1 + 8], [x1 + 8, y1 + 8, 1], [x1 + 8, y0 + 14]], { z: z - 0.5, w: 2.5, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      COAST.forEach((c, i) => {
        const q = EASE.out(clamp((lt - 0.12 - i * 0.02) / 0.45)); if (q <= 0) return;
        stroke(k + '.c' + i, c.open ? c.pts : c.pts.concat([c.pts[0]]), { z: z + 0.1, w: c.aus ? 4.5 : 3.2, draw: q, boil: 0.5 });
      });
      // a few pencil waves in the oceans
      [[760, 470], [880, 560], [600, 620], [1210, 420], [420, 470], [1000, 690]].forEach(([wx, wy], i) => {
        const q = clamp((lt - 0.4) / 0.3); if (q <= 0) return;
        stroke(k + '.wv' + i, [[wx - 22, wy], [wx - 11, wy - 7], [wx, wy], [wx + 11, wy - 7], [wx + 22, wy]], { z: z + 0.1, w: 2.4, color: C.pencil, opacity: q, boil: 0.6 });
      });
      const aq = clamp((lt - 0.45) / 0.2);
      if (aq > 0) {
        text(k + '.aus', '澳大利亚', START[0] + 4, START[1] + 50, { size: 38, z: z + 0.3, opacity: aq, halo: 6 });
        dot(k + '.s', START, 8 * EASE.back(aq), C.ink, z + 0.3);
      }
      // the route: red dashes laid down behind the plane
      const u = flyU(t), n = 36;
      if (t >= TAKEOFF) for (let i = 0; i < n; i++) {
        const a = i / n, b = (i + 0.5) / n; if (b > u) break;
        stroke(k + '.r' + i, [route(a), route(b)], { z: z + 0.2, w: 4.5, color: C.red, boil: 0.5 });
      }
      // Warsaw: a dot that pops when the plane lands
      const wq = clamp((t - LAND) / 0.2);
      if (wq > 0) {
        dot(k + '.w', WAW, 9 * EASE.back(wq), C.ink, z + 0.3);
        stroke(k + '.wr', ringPts(k + '.wr', WAW[0], WAW[1], 22, 22, { n: 10, a0: -100, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4, color: C.red, draw: EASE.out(clamp((t - LAND - 0.1) / 0.3)) });
      }
      // the plane (top view), nose along the route; pops up at the start, shrinks away on landing
      const sc = 1.25 * Math.max(0.01, EASE.back(clamp((t - TAKEOFF + 0.3) / 0.3))) * (1 - EASE.in(clamp((t - LAND) / 0.25)));
      if (sc > 0.02) {
        const c = route(u), ang = routeDir(Math.min(u, 0.995)), zp = Z.fx;
        DL.save(); DL.translate(c[0], c[1]); DL.rotate(ang); DL.scale(sc);
        [-1, 1].forEach(s => {
          stroke(k + '.wing' + s, [[8, 0], [-6, s * 40, 1], [-17, s * 40, 1], [-11, 0, 1]], { z: zp, w: 3.5, fill: C.paper, boil: 0.4 });
          stroke(k + '.tail' + s, [[-24, 0], [-33, s * 16, 1], [-39, s * 16, 1], [-36, 0, 1]], { z: zp, w: 3.5, fill: C.paper, boil: 0.4 });
        });
        stroke(k + '.body', [[36, 0], [27, -6], [-34, -5], [-40, 0], [-34, 5], [27, 6]], { z: zp + 0.1, w: 3.5, closed: true, fill: C.paper, boil: 0.4 });
        DL.restore();
        // a little pencil motion streak behind it while it flies
        if (t > TAKEOFF && t < LAND) [0.03, 0.055].forEach((d, j) => {
          const b = route(Math.max(0, u - d)), a2 = route(Math.max(0, u - d - 0.04));
          stroke(k + '.sp' + j, [a2, b], { z: zp - 0.1, w: 2.5, color: C.pencil, opacity: 0.8, boil: 0.6 });
        });
      }
    },
    cues: fx => [[fx.t0, 'paper'], [TAKEOFF - 0.3, 'pop'], [TAKEOFF, 't4_plane'], [TAKEOFF + 0.9, 'whoosh'], [LAND, 'plip'], [LAND + 0.1, 'pen']],
  };

  /* ---------------- 5 · Warsaw: a street of narrow old houses and a clock tower ---------------- */
  const HOUSES = [
    { x: 196, w: 250, h: 520, roof: 'step' }, { x: 446, w: 230, h: 480, roof: 'tri' }, { x: 676, w: 260, h: 510, roof: 'curve' },
    { x: 936, w: 230, h: 500, roof: 'tri' }, { x: 1166, w: 250, h: 530, roof: 'step' }, { x: 1416, w: 210, h: 490, roof: 'curve' },
  ];
  const TOWER = { x0: 50, x1: 190, top: 300, tip: 150, clock: [120, 362] };
  SETDRAW.t4_street = (s, p) => {
    const z = Z.set - 0.5;
    HOUSES.forEach((h, i) => {
      const q = clamp(p * 1.6 - i * 0.1); if (q <= 0) return;
      const k = 't4st.h' + i, x0 = h.x, x1 = h.x + h.w, top = FL - h.h, xm = (x0 + x1) / 2;
      let roof;
      if (h.roof === 'tri') roof = [[xm, top - 84, 1]];
      else if (h.roof === 'step') { const sw = h.w / 6; roof = [[x0 + sw, top, 1], [x0 + sw, top - 32, 1], [x0 + 2 * sw, top - 32, 1], [x0 + 2 * sw, top - 64, 1], [x1 - 2 * sw, top - 64, 1], [x1 - 2 * sw, top - 32, 1], [x1 - sw, top - 32, 1], [x1 - sw, top, 1]]; }
      else roof = [[x0 + 24, top - 20], [x0 + h.w * 0.3, top - 30], [xm, top - 82], [x1 - h.w * 0.3, top - 30], [x1 - 24, top - 20]];
      stroke(k, [[x0, FL], [x0, top, 1], ...roof, [x1, top, 1], [x1, FL, 1]], { z, w: 4, fill: C.paper, draw: q });
      stroke(k + '.cor', [[x0 + 4, top + 16], [x1 - 4, top + 15]], { z, w: 2.5, color: C.pencil, draw: q, boil: 0.5 });
      // windows (pencil), two columns — only above the people's heads, so the faces stay on clean paper
      for (let r = 0; ; r++) {
        const wy = top + 44 + r * 92; if (wy + 50 > 392) break;
        [0.27, 0.73].forEach((f, j) => {
          const wx = x0 + h.w * f;
          stroke(k + '.w' + r + j, [[wx - 18, wy], [wx + 18, wy, 1], [wx + 18, wy + 50, 1], [wx - 18, wy + 50, 1], [wx - 18, wy, 1]], { z, w: 2.5, color: C.pencil, draw: q, boil: 0.5 });
        });
      }
      // an arched door (pencil), left out where someone stands in front of it
      if ([SX.m4, SX.m2, TXE, SX.m1].every(x => Math.abs(x - xm) > 60))
        stroke(k + '.d', [[xm - 26, FL], [xm - 26, FL - 72, 1], [xm - 16, FL - 90], [xm, FL - 96], [xm + 16, FL - 90], [xm + 26, FL - 72], [xm + 26, FL, 1]], { z, w: 2.5, color: C.pencil, draw: q, boil: 0.5 });
    });
    // the clock tower
    const q = clamp(p * 1.6), { x0, x1, top, tip, clock } = TOWER, xm = (x0 + x1) / 2;
    if (q > 0) {
      stroke('t4st.tw', [[x0, FL], [x0, top, 1], [x1, top, 1], [x1, FL, 1]], { z, w: 4.5, fill: C.paper, draw: q });
      stroke('t4st.sp', [[x0 - 8, top], [xm, tip, 1], [x1 + 8, top, 1], [x0 - 8, top, 1]], { z, w: 4.5, fill: C.paper, draw: q });
      stroke('t4st.ck', ringPts('t4st.ck', clock[0], clock[1], 34, 34, { n: 12, a0: -110, sweep: 372, rv: 0.02 }), { z, w: 4, fill: C.paper, draw: q });
      stroke('t4st.hh', [clock, [clock[0], clock[1] - 20]], { z, w: 4, draw: q });
      stroke('t4st.hm', [clock, [clock[0] + 22, clock[1] + 6]], { z, w: 3, draw: q });
      [470, 580].forEach((wy, i) => stroke('t4st.tw' + i, [[xm - 12, wy + 40], [xm - 12, wy + 6], [xm, wy - 6], [xm + 12, wy + 6], [xm + 12, wy + 40, 1], [xm - 12, wy + 40, 1]], { z, w: 2.5, color: C.pencil, draw: q, boil: 0.5 }));
      stroke('t4st.td', [[xm - 28, FL], [xm - 28, FL - 76, 1], [xm, FL - 100], [xm + 28, FL - 76], [xm + 28, FL, 1]], { z, w: 2.5, color: C.pencil, draw: q, boil: 0.5 });
    }
  };

  /** Terry's camera: hangs on his chest on a strap; raised to his eye (side view, lens to the left) to take a photo. {up, down, click} */
  const CAM_UP = [TXE - 34, 596];
  COMP.t4_cam = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const a = F.anchors.terry; if (!a) return;
      const u = EASE.io(clamp((t - fx.up) / 0.2)) * (1 - EASE.io(clamp((t - fx.down) / 0.22)));
      const neck = [a.head[0], a.head[1] + a.r * 0.95], hang = [neck[0] + 2, neck[1] + 36];
      const c = lerp2(hang, CAM_UP, u), k = fx.id, z = Z.front + 2;
      if (u < 0.5) {
        stroke(k + '.sL', [[neck[0] - 13, neck[1] - 2], [c[0] - 20, c[1] - 14]], { z: z - 0.1, w: 2.6 });
        stroke(k + '.sR', [[neck[0] + 13, neck[1] - 2], [c[0] + 20, c[1] - 14]], { z: z - 0.1, w: 2.6 });
        stroke(k + '.b', [[c[0] - 26, c[1] - 16], [c[0] + 26, c[1] - 16, 1], [c[0] + 26, c[1] + 18, 1], [c[0] - 26, c[1] + 18, 1], [c[0] - 26, c[1] - 16, 1]], { z, w: 3.8, fill: C.paper });
        stroke(k + '.l', ringPts(k + '.l', c[0], c[1] + 2, 11, 11, { n: 9, closed: true }), { z: z + 0.1, w: 3.4, closed: true, fill: C.paper });
        stroke(k + '.f', [[c[0] + 10, c[1] - 24], [c[0] + 22, c[1] - 24, 1], [c[0] + 22, c[1] - 16, 1]], { z: z + 0.1, w: 3 });
      } else {
        stroke(k + '.b', [[c[0] - 20, c[1] - 20], [c[0] + 24, c[1] - 20, 1], [c[0] + 24, c[1] + 18, 1], [c[0] - 20, c[1] + 18, 1], [c[0] - 20, c[1] - 20, 1]], { z, w: 3.8, fill: C.paper });
        stroke(k + '.l', [[c[0] - 20, c[1] - 11], [c[0] - 36, c[1] - 13, 1], [c[0] - 36, c[1] + 11, 1], [c[0] - 20, c[1] + 9, 1]], { z: z + 0.1, w: 3.6, fill: C.paper });
        stroke(k + '.f', [[c[0] + 2, c[1] - 20], [c[0] + 2, c[1] - 30, 1], [c[0] + 18, c[1] - 30, 1], [c[0] + 18, c[1] - 20, 1]], { z: z + 0.1, w: 3 });
      }
      // the flash: ink rays out of the lens
      const v = (t - fx.click) / 0.4;
      if (v >= 0 && v < 1) for (let i = 0; i < 6; i++) {
        const ang = (150 + i * 12) * RAD, r0 = 16 + 40 * v, L = 34 * Math.sin(Math.PI * Math.min(1, v * 1.4)), o = [c[0] - 40, c[1] - 6];
        stroke(k + '.ray' + i, [[o[0] + Math.cos(ang) * r0, o[1] + Math.sin(ang) * r0], [o[0] + Math.cos(ang) * (r0 + L), o[1] + Math.sin(ang) * (r0 + L)]], { z: Z.fx, w: 4 });
      }
      const kq = clamp((t - fx.click) / 0.18);
      if (kq > 0 && t < fx.down + 0.3) text(k + '.ka', '咔嚓！', fx.ka[0], fx.ka[1], { size: 58, rot: -8, z: Z.annot, halo: 10, scale: lerp(0.5, 1, EASE.back(kq)), opacity: clamp(kq * 3) });
      F.targets[k] = c;
    },
    cues: fx => [[fx.up, 'boop'], [fx.click, 't4_click']],
  };
  /** the tourist map in m2's hands: held upside down at first (the 华沙 on it is upside down), turned the right way up at `spin` */
  const TMAP = [600, 604];
  COMP.t4_tmap = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const k = fx.id, z = Z.front + 1, sc = Math.max(0.01, EASE.back(clamp((t - fx.t0) / 0.25))) * (1 - EASE.in(clamp((t - fx.t1 + 0.2) / 0.2)));
      const rot = 180 - 180 * EASE.io(clamp((t - fx.spin) / 0.35)) - 4, W = 128, H = 92;
      DL.save(); DL.translate(TMAP[0], TMAP[1]); DL.rotate(rot); DL.scale(sc);
      stroke(k + '.b', [[-W / 2, -H / 2], [W / 2, -H / 2, 1], [W / 2, H / 2, 1], [-W / 2, H / 2, 1], [-W / 2, -H / 2, 1]], { z, w: 4, fill: C.paper });
      [-1, 1].forEach(s => stroke(k + '.f' + s, [[s * W / 6, -H / 2 + 3], [s * W / 6, H / 2 - 3]], { z: z + 0.1, w: 2, color: C.pencil }));
      // a river and two streets
      stroke(k + '.rv', [[-W / 2 + 6, 30], [-24, 18], [0, 30], [26, 14], [W / 2 - 6, 22]], { z: z + 0.1, w: 3, boil: 0.6 });
      stroke(k + '.s1', [[-W / 2 + 8, 2], [W / 2 - 8, -2]], { z: z + 0.1, w: 2.4, color: C.pencil });
      stroke(k + '.s2', [[-6, H / 2 - 6], [4, -H / 2 + 34]], { z: z + 0.1, w: 2.4, color: C.pencil });
      text(k + '.t', '华沙', 0, -H / 2 + 20, { size: 30, z: z + 0.2 });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'paper'], [fx.spin, 'swish']],
  };
  /** the high-five: a little ink burst where the two hands meet. {at, t0} */
  COMP.t4_hi5 = {
    draw(fx, t) {
      const v = (t - fx.t0) / 0.35; if (v < 0 || v >= 1) return;
      const [x, y] = fx.at;
      for (let i = 0; i < 7; i++) {
        const a = (-180 + i * 30) * RAD, r0 = 20 + 26 * v, L = 22 * Math.sin(Math.PI * Math.min(1, v * 1.3));
        stroke('t4.h5.' + i, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * (r0 + L), y + Math.sin(a) * (r0 + L)]], { z: Z.fx, w: 4 });
      }
    },
    cues: fx => [[fx.t0, 't4_clap']],
  };
  /** the line-up breaks up: each big kid pops off (their pop-in, reversed). The real teen leaves the stage at t;
   *  the stand-in 'x_<id>' (same look, same pose) is drawn shrinking about its feet for 0.24 s. {outs: [[id, t]]} */
  COMP.t4_popOut = {
    draw(fx, t, F) {
      fx.outs.forEach(([id, t0]) => {
        const u = (t - t0) / 0.24; if (u < 0 || u >= 1) return;
        const sc = u < 0.3 ? 1 + 0.1 * EASE.out(u / 0.3) : 1.1 * (1 - EASE.in((u - 0.3) / 0.7));
        const L = layoutChar('x_' + id, t, F); if (!L) return;
        DL.save(); DL.about(LX[id], FL, () => DL.scale(Math.max(0.01, sc)));
        drawChar(L, F);
        DL.restore();
      });
    },
    cues: fx => fx.outs.map(([, t0]) => [t0, 'plip']),
  };
  /** fades whatever `inner` (another fx) draws, to nothing over [f0, f0 + fd] */
  COMP.t4_fade = {
    draw(fx, t, F) {
      const k = 1 - clamp((t - fx.f0) / fx.fd); if (k <= 0) return;
      const n0 = DL.items.length;
      COMP[fx.inner.type].draw(fx.inner, t, F);
      if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); }
    },
    cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
  };
  /** small backpacks for Warsaw (the engine's bag is too big for this shot): a pack peeking out behind, one strap. on: [[id, w, h, strap]] */
  COMP.t4_packs = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      fx.on.forEach(([id, w, h, strap]) => {
        const a = F.anchors[id]; if (!a) return;
        const neckY = a.head[1] + a.r * 0.95, c = [a.hip[0] + w * 0.42, (neckY + a.hip[1]) / 2 + 2], k = 't4.pk.' + id;
        stroke(k, superPts(c[0], c[1], w, h, 18, 4.2), { z: Z.back, w: 3.8, closed: true, fill: C.paper });
        stroke(k + '.fl', [[c[0] - w / 2 + 4, c[1] - h * 0.2], [c[0], c[1] - h * 0.08], [c[0] + w / 2 - 4, c[1] - h * 0.2]], { z: Z.back + 0.1, w: 3 });
        if (strap) stroke(k + '.st', [[a.head[0] + 10, neckY + 6], [a.hip[0] - 4, a.hip[1] - 14]], { z: Z.body + 0.1, w: 3.2 });
      });
    },
  };
  /** little laugh lines bobbing beside a few heads. on: [[id, t0, t1]] */
  COMP.t4_laugh = {
    draw(fx, t, F) {
      fx.on.forEach(([id, t0, t1]) => {
        if (t < t0 || t >= t1) return;
        const a = F.anchors[id]; if (!a) return;
        const bob = (Math.floor((t - t0) * 7) % 2) * 5;
        [-1, 1].forEach(s => [0, 1].forEach(j => {
          const cx = a.head[0] + s * a.r * (1.22 + j * 0.02), cy = a.head[1] - a.r * (0.15 + j * 0.42) - bob;
          stroke(`t4.lg.${id}.${s}${j}`, [[cx, cy], [cx + s * 13, cy - 8 + j * 4]], { z: Z.fx, w: 3.5 });
        }));
      });
    },
  };

  /* ---------------- poses ---------------- */
  const HI5 = [TXE + 72, 500];                                 // where Terry's and m1's hands meet
  const ldHold = { w: 1, to: 'abs', dx: CLIP[0] - 40, dy: CLIP[1] + 14, bend: 'down' };
  const camHands = { ikL: { w: 1, to: 'abs', dx: CAM_UP[0] - 14, dy: CAM_UP[1] + 18, bend: 'out' }, ikR: { w: 1, to: 'abs', dx: CAM_UP[0] + 20, dy: CAM_UP[1] + 18, bend: 'out' } };
  const mapHands = { ikL: { w: 1, to: 'abs', dx: TMAP[0] - 56, dy: TMAP[1] + 18, bend: 'down' }, ikR: { w: 1, to: 'abs', dx: TMAP[0] + 56, dy: TMAP[1] + 18, bend: 'down' } };
  Object.assign(POSE, {
    t4_jump: { armScale: 1.75, armL: [150, 14], armR: [150, 14], legL: [8, 26], legR: [8, 26], hop: -50 },
    t4_tiptoe: { legScale: 1.24, thigh: 0.5, legL: [2, 0], legR: [2, 0], tilt: -14, lean: -1, armScale: 1.3, armL: [34, 12], armR: [34, 12] },
    t4_reach: { legScale: 1.26, thigh: 0.5, legL: [2, 0], legR: [2, 0], tilt: -12, lean: 1, armScale: 1.95, armL: [146, 14], armR: [146, 14] },
    t4_cheer: { armScale: 1.4, armL: [140, 20], armR: [140, 20] },
    t4_kWave: { armScale: 1.65, armR: [132, 36], armL: [16, 10] },
    t4_ldRead: { tilt: -10, lean: -2, ikL: ldHold, ikR: { w: 1, to: 'abs', dx: CLIP[0] + 38, dy: CLIP[1] + 20, bend: 'down' } },
    t4_ldLook: { tilt: -4, lean: -1, ikL: ldHold, armR: [12, 8] },
    t4_ldScratch: { tilt: 9, ikL: ldHold, armScale: 1.15, ikR: { w: 1, to: 'head', dx: 0.95, dy: -0.85, bend: 'out' } },
    t4_ld2Peek: { lean: -7, tilt: -12, armScale: 1.1, ikR: { w: 1, to: 'chin', dx: 0.28, dy: 0.05, bend: 'down' }, ikL: { w: 1, to: 'hip', dx: -24, dy: -4, bend: 'out' } },
    t4_ld2Scratch: { tilt: -9, armScale: 1.15, ikR: { w: 1, to: 'head', dx: 0.95, dy: -0.85, bend: 'out' }, ikL: { w: 1, to: 'hip', dx: -24, dy: -4, bend: 'out' } },
    t4_lookDown: { tilt: -8, lean: -2 },
    t4_hi5: { lean: -2, tilt: -8, armScale: 1.9, armL: [16, 10], ikR: { w: 1, to: 'abs', dx: HI5[0] - 4, dy: HI5[1] + 6, bend: 'out' } },
    t4_m1hi5: { lean: -4, tilt: 4, armR: [16, 10], ikL: { w: 1, to: 'abs', dx: HI5[0] + 8, dy: HI5[1] - 4, bend: 'down' } },
    t4_m1up: { armScale: 1.4, armR: [140, 20], armL: [14, 10] },          // cheers on his own side, clear of Terry
    t4_mapHold: { tilt: 8, lean: 1, ...mapHands },
    t4_mapHuh: { tilt: 28, lean: 3, ...mapHands },
    t4_camUp: { tilt: -4, armScale: 1.6, ...camHands },
  });
  const tremble = base => t => ({ ...POSE[base], tilt: POSE[base].tilt + 3 * Math.sin(t * 47) });
  const walkE = makeWalk(ST, STOP, 5.2, { lean: -4 });
  const laughBob = t0 => t => 1 + 0.03 * Math.sin((t - t0) * 22);

  /* ---------------- tracks ---------------- */
  // line-up order (left → right after Terry) and Warsaw spots
  const LX = { m2: 520, m1: 700, m4: 880, m3: 1060, m5: 1240 };
  const SX = { m4: 400, m2: 600, m1: 960 };
  const OUTS = [['m5', 0], ['m3', 1], ['m4', 2], ['m1', 3], ['m2', 4]].map(([id, i]) => [id, OUT0 + i * OUT_DT]);
  const OUT_T = Object.fromEntries(OUTS);
  const teenPos = id => [[0, [LX[id], FL]], [OUT_T[id], OFF, 0], ...(SX[id] ? [[ST, [SX[id] + 260, FL], 0], [ST, [SX[id], FL], STOP - ST, 'lin']] : [])];
  const ENTER = { m2: 0, m1: 0.12, m4: 0.24, m3: 0.36, m5: 0.48 };
  const teen = (id, o) => ({
    enter: LINE + ENTER[id],
    pos: teenPos(id),
    pose: [[0, 'stand'], [LOOKDOWN, 't4_lookDown', 0.15], [DROP + 0.2, 'stand', 0.2], [ST, walkE, 0], ...(o.pose || [])],
    face: [[0, 'neutral'], [LINE + 0.6, 'smile', 0.1], [LOOKDOWN, 'neutral', 0.08], [TIP + 0.3, 'surprised', 0.06], [DROP + 0.15, 'smile', 0.08], [ST, 'smile', 0], ...(o.face || [])],
    turn: [[0, 0], [LOOKDOWN, -0.3, 0.12], [ST, -0.5, 0], ...(o.turn || [])],
    gaze: [[0, 'viewer'], [LOOKDOWN, 'terry'], [ST, [-200, 420]], ...(o.gaze || [])],
    squash: [[0, 1], ...(o.squash || [])],
  });
  const TRACKS_ = {
    terry: {
      pos: [[0, [-160, FL]], [0.3, [TX, FL], 1.2, 'lin'], [MAP, OFF, 0], [ST, [TXE + 260, FL], 0], [ST, [TXE, FL], STOP - ST, 'lin']],
      pose: [[0, makeWalk(0.3, 1.5, 5.2)], [1.5, 'stand', 0.12], [JUMP, 't4_jump', 0.1, 'back'], [JUMP + 0.3, 'kidCheer', 0.14], [DOCK, 'stand', 0.15],
        [CARD + 0.3, 'kidPoint', 0.12, 'back'], [LINE, 'stand', 0], [UPLOOK, 'lookUp', 0.15],
        [TIP, tremble('t4_tiptoe'), 0.12, 'back'], [REACH, tremble('t4_reach'), 0.1, 'back'], [DROP, 'stand', 0.07],
        [SEE + 0.1, 't4_kWave', 0.12, 'back'], [SEE + 1.4, 'stand', 0.15],
        [ST, walkE, 0], [STOP, 'stand', 0.12], [HI_UP, 't4_hi5', 0.12, 'back'], [HI_DOWN, 'stand', 0.2],
        [LOOK, 'lookUp', 0.15], [RAISE, 't4_camUp', 0.18, 'back'], [LOWER, 'kidCheer', 0.15, 'back']],
      face: [[0, 'neutral'], [1.5, 'focus', 0.06], [AMO_T, 'neutral', 0.06], [JUMP, 'joy', 0.05], [DOCK, 'grin', 0.06], [LINE, 'neutral', 0], [UPLOOK, 'surprised', 0.05],
        [LB10, 'neutral', 0.08], [TIP, 'effort', 0.06], [DROP + 0.12, 'sheepish', 0.06], [OUT0 + 0.2, 'neutral', 0.08], [LEAD, 'neutral', 0], [SEE, 'smile', 0.08],
        [ST, 'smile', 0], [JOKE, 'grin', 0.05], [HI_T, 'joy', 0.05], [HI_T + 0.45, 'laugh', 0.05], [LAUGH1, 'smile', 0.08], [LOOK, 'idea', 0.06], [RAISE, 'focus', 0.05], [LOWER, 'joy', 0.05]],
      turn: [[0, 0.45], [1.5, 0.3, 0.12], [JUMP, 0, 0.1], [CARD + 0.3, 0.35, 0.1], [LINE, 0.1, 0], [UPLOOK, 0.35, 0.1], [DROP + 0.12, 0.15, 0.1],
        [LEAD, 0.35, 0], [ST, -0.5, 0], [JOKE, 0.5, 0.1], [LOOK, -0.45, 0.12], [RAISE, -0.6, 0.1], [LOWER, 0, 0.12]],
      gaze: [[0, [880, 240]], [AMO_T, [880, 440]], [JUMP, 'viewer'], [CARD + 0.2, 'card'], [LINE, 'viewer'], [UPLOOK, 'm2'], [LB10 + 0.3, 'viewer'],
        [TIP, [520, 380]], [DROP + 0.12, 'viewer'], [OUT0, [1050, 560]], [LEAD, 'ld1'], [SEE + 1.5, 'viewer'], [ST, [-200, 500]], [JOKE, 'm1'], [HI_UP, 'hi5'],
        [HI_T + 0.4, 'm1'], [LAUGH1, 'viewer'],
        [LOOK, 'tower'], [RAISE, 'm2'], [LOWER, 'viewer']],
      squash: [[0, 1], [JUMP + 0.25, 0.86, 0.05], [JUMP + 0.3, 1, 0.22, 'back'], [UPLOOK, 1.06, 0.05], [UPLOOK + 0.06, 1, 0.2, 'back'],
        [TIP, 1.05, 0.12], [DROP, 0.86, 0.05], [DROP + 0.06, 1, 0.22, 'back'],
        [HI_T, 1.07, 0.04], [HI_T + 0.04, 1, 0.22, 'back'], [HI_T + 0.45, laughBob(HI_T), 0.05], [LAUGH1, 1, 0.1], [LOWER, 1.08, 0.05], [LOWER + 0.06, 1, 0.22, 'back']],
    },
    m2: teen('m2', {
      pose: [[STOP, 'stand', 0.12], [LOOK + 0.2, 't4_mapHold', 0.15], [LOOK + 1.3, 't4_mapHuh', 0.15, 'back'], [SPIN, 't4_mapHold', 0.15, 'back'], [RAISE, 't4_cheer', 0.15, 'back'], [LOWER + 0.1, 'stand', 0.2]],
      face: [[JOKE + 0.2, 'smile', 0.06], [LOOK + 0.2, 'focus', 0.06], [LOOK + 1.3, 'puzzled', 0.06], [SPIN + 0.3, 'idea', 0.05], [SPIN + 1.0, 'grin', 0.06], [RAISE, 'grin', 0.05], [LOWER + 0.1, 'laugh', 0.06]],
      turn: [[STOP, 0.3, 0.12], [LOOK + 0.2, 0.1, 0.1], [RAISE, 0.4, 0.1]],
      gaze: [[STOP, 'terry'], [LOOK + 0.2, 'tmap'], [RAISE, 'camT']],
    }),
    m1: teen('m1', {
      pose: [[STOP, 'stand', 0.12], [HI_UP, 't4_m1hi5', 0.12, 'back'], [HI_DOWN, 'stand', 0.2], [RAISE + 0.2, 't4_m1up', 0.12, 'back'], [LOWER + 0.1, 'stand', 0.2]],
      face: [[JOKE + 0.2, 'laugh', 0.05], [HI_UP, 'grin', 0.05], [HI_T + 0.35, 'laugh', 0.05], [LAUGH1, 'smile', 0.08], [LOOK + 0.6, 'surprised', 0.05], [LOOK + 1.6, 'smile', 0.08],
        [RAISE + 0.2, 'grin', 0.05], [LOWER, 'laugh', 0.05]],
      turn: [[STOP, -0.45, 0.12], [LOOK + 0.6, -0.5, 0.1], [RAISE + 0.2, -0.3, 0.1]],
      gaze: [[STOP, 'terry'], [HI_UP, 'hi5'], [HI_T + 0.4, 'terry'], [LOOK + 0.6, 'tower'], [RAISE + 0.2, 'm2'], [LOWER, 'terry']],
      squash: [[JOKE + 0.2, laughBob(JOKE), 0.05], [HI_UP, 1, 0.08], [HI_T + 0.35, laughBob(HI_T), 0.05], [LAUGH1, 1, 0.1]],
    }),
    m4: teen('m4', {
      pose: [[STOP, 'stand', 0.12], [RAISE, 't4_cheer', 0.15, 'back'], [LOWER + 0.1, 'stand', 0.2]],
      face: [[JOKE + 0.3, 'laugh', 0.05], [LAUGH1, 'smile', 0.08], [LOOK, 'surprised', 0.05], [LOOK + 1.2, 'smile', 0.08], [RAISE, 'joy', 0.05], [LOWER + 0.1, 'laugh', 0.06]],
      turn: [[STOP, 0.4, 0.12], [LOOK, -0.6, 0.1], [LOOK + 1.8, 0.55, 0.1], [LOOK + 3.3, -0.4, 0.1], [RAISE, 0.45, 0.1]],
      gaze: [[STOP, 'terry'], [LOOK, [-100, 300]], [LOOK + 1.8, [1300, 260]], [LOOK + 3.3, 'tower'], [RAISE, 'camT']],
    }),
    m3: teen('m3', {}),   // m3 and m5 stay home in the Warsaw shot (fewer people, clearer picture)
    m5: teen('m5', {}),
    // stand-ins for the pop-off: frozen in the pose the real ones have at that moment
    ...Object.fromEntries(Object.keys(LX).map(id => ['x_' + id, { pos: [[0, [LX[id], FL]]], pose: [[0, 'stand']], face: [[0, 'smile']], turn: [[0, -0.3]], gaze: [[0, 'terry']] }])),
    ld1: {
      enter: LEAD + 0.05,
      pos: [[0, [LD1X, FL]], [MAP, OFF, 0]],
      pose: [[0, 't4_ldRead'], [SEE, 't4_ldLook', 0.15], [SCRATCH, 't4_ldScratch', 0.12, 'back']],
      face: [[0, 'focus'], [SEE, 'surprised', 0.05], [SCRATCH, 'puzzled', 0.06]],
      turn: [[0, -0.35]],
      gaze: [[0, 'clip'], [SEE, 'terry']],
      squash: [[0, 1], [SEE, 1.05, 0.05], [SEE + 0.05, 1, 0.2, 'back']],
    },
    ld2: {
      enter: LEAD + 0.18,
      pos: [[0, [LD2X, FL]], [MAP, OFF, 0]],
      pose: [[0, 't4_ld2Peek'], [SEE + 0.15, 'stand', 0.15], [SCRATCH + 0.2, 't4_ld2Scratch', 0.12, 'back']],
      face: [[0, 'focus'], [SEE + 0.15, 'surprised', 0.05], [SCRATCH + 0.2, 'puzzled', 0.06]],
      turn: [[0, -0.45]],
      gaze: [[0, 'clip'], [SEE + 0.15, 'terry']],
      squash: [[0, 1], [SEE + 0.15, 1.05, 0.05], [SEE + 0.2, 1, 0.2, 'back']],
    },
  };

  const CLOUD_AT = [990, 214];
  defineScene({
    id: 'team', chapter: '进国家队', dur: DUR, floor: FL,
    cast: CAST4,
    order: ['ld1', 'ld2', 'm4', 'm2', 'terry', 'm1', 'm3', 'm5'],
    tracks: TRACKS_,
    targets: () => ({ card: [880, 440], tower: [TOWER.clock[0], TOWER.clock[1] - 20], tmap: TMAP, clip: CLIP, camT: [CAM_UP[0] - 30, CAM_UP[1]], hi5: HI5 }),
    set: [
      { type: 'floor', t0: 0.3, t1: MAP },
      { type: 't4_street', t0: ST },
      { type: 'floor', t0: ST },
    ],
    fx: [
      // the hand-over from the recap
      { type: 't4_again', id: 't4.again', out: 0.12 },
      // 1986 · 澳大利亚数学奥林匹克
      { type: 'write', id: 't4.y86', text: '1986', x: 880, y: 130, size: 190, anchor: 'middle', t0: 0.5, t1: A_OUT, speed: 2600, gap: 0.03, glyphGap: 0.06, w: 9, sfx: 'pen', z: Z.annot },
      { type: 'title', id: 't4.amo', text: '澳大利亚数学奥林匹克', x: 880, y: 430, size: 74, t0: AMO_T, t1: A_OUT, underline: true, ucolor: 'ink' },
      // 这一次，他进了国家队！— the 10 stamp comes down in the middle, then docks
      { type: 'ageStamp', age: 10, place: '进国家队', t0: STAMP, ...E4.STAMP, dockT: DOCK, pulse: [] },
      { type: 't4_roster', id: 't4.roster', at: [880, 440], t0: CARD, t1: LINE, me: 3, check: CHECK, ring: RING6 },
      // six in a row
      { type: 't4_fade', f0: FADE, fd: 0.2, inner: { type: 'label', id: 't4.lb10', text: '10 岁', at: [236, 318], rot: -5, size: 54, t0: LB10, t1: LEAD, target: { char: 'terry', part: 'headTop', dy: -75 }, bend: 0.25, gap: 8 } },
      { type: 't4_fade', f0: FADE, fd: 0.2, inner: { type: 't4_brace', id: 't4.br16', text: '16、17 岁', x0: 440, x1: 1320, y: 352, t0: LB16, t1: LEAD } },
      { type: 't4_fade', f0: FADE, fd: 0.2, inner: { type: 't4_hline', id: 't4.hl', x0: 262, x1: 600, y: 401, t0: TIP, t1: LEAD } },
      { type: 't4_popOut', id: 't4.out', outs: OUTS },
      // the team leaders
      { type: 't4_clip', id: 't4.clip', char: 'ld1', t0: LEAD + 0.36, t1: MAP },
      { type: 'title', id: 't4.src', text: '（澳大利亚奥数委员会的记录里写着）', x: 440, y: 330, size: 38, color: 'red', rot: -2, t0: LEAD + 0.5, t1: MAP },
      { type: 'thought', id: 't4.cloud', at: CLOUD_AT, rx: 228, ry: 116, t0: CLOUD, t1: MAP, from: { char: 'ld1', part: 'headTop', dx: 10, dy: -6 } },
      { type: 't4_mind', id: 't4.mind', at: CLOUD_AT, t0: CLOUD + 0.15, t1: MAP, tg: GAUGE },
      // the flight
      { type: 't4_map', id: 't4.map', t0: MAP, t1: ST },
      { type: 'title', id: 't4.jul', text: '7 月', x: 790, y: 640, size: 58, color: 'red', rot: -4, t0: MAP + 0.25, t1: ST },
      { type: 'label', id: 't4.lbWaw', text: '华沙', at: [404, 154], rot: -4, size: 56, t0: LAND + 0.1, t1: ST, target: WAW, bend: -0.25, gap: 16 },
      // Warsaw
      { type: 'title', id: 't4.said', text: '（他后来自己说的）', x: 800, y: 124, size: 42, color: 'red', rot: -2, t0: 36.6, t1: DUR },
      { type: 't4_packs', id: 't4.packs', t0: ST, on: [['m4', 64, 86, true], ['m2', 64, 86, true], ['m1', 64, 86, true], ['terry', 48, 64, false]] },
      { type: 't4_laugh', id: 't4.laugh', on: [['m1', JOKE + 0.2, HI_UP], ['m4', JOKE + 0.3, LAUGH1], ['m1', HI_T + 0.35, LAUGH1], ['terry', HI_T + 0.45, LAUGH1], ['m2', LOWER + 0.15, DUR], ['m1', LOWER + 0.05, DUR]] },
      { type: 't4_hi5', id: 't4.hi5', at: HI5, t0: HI_T },
      { type: 't4_tmap', id: 't4.tmap', t0: LOOK + 0.25, t1: RAISE, spin: SPIN },
      { type: 't4_cam', id: 't4.cam', t0: ST, up: RAISE, down: LOWER, click: CLICK, ka: [820, 300] },
    ],
    sfx: [[JUMP, 'hop'], [JUMP + 0.27, 'thud'], [UPLOOK, 'boop'], [TIP, 't4_squeak'], [DROP, 'thud'], [LEAD + 0.05, 'pop'], [LEAD + 0.18, 'pop'],
      [SEE, 'boop'], [SEE + 0.12, 'plip'], [MAP, 'whoosh'], [ST, 'whoosh'],
      [LINE, 'whoosh'], ...Object.values(ENTER).map(d => [LINE + d, 'pop']), [LOWER, 'hop']],
    steps: [{ t0: 0.3, t1: 1.5, hz: 5.2 }, { t0: ST, t1: STOP, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 4.7, text: '1986年，澳大利亚数学奥林匹克。', say: '一九八六年，澳大利亚数学奥林匹克。' },
      { t0: 5.2, t1: 8.4, text: '这一次，他进了国家队！' },
      { t0: 9.8, t1: 13.6, text: '六个队员里，他最小：才十岁。' },
      { t0: 13.7, t1: 17.9, text: '别的队员，都是十六七岁的高中生。' },
      { t0: 19.0, t1: 23.4, text: '带队的老师们说，以前只是听说过他，' },
      { t0: 23.5, t1: 26.7, text: '不知道他到底有多厉害。' },
      { t0: 27.4, t1: 31.2, text: '七月，他们飞到了波兰的华沙。' },
      { t0: 32.0, t1: 36.0, text: '小陶和大哥哥大姐姐们处得很好。' },
      { t0: 36.5, t1: 41.1, text: '他后来说，那大概是他第一次离开爸妈，' },
      { t0: 41.2, t1: 44.0, text: '像游客一样出远门。' },
    ],
  });
})();
