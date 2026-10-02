// 上集回顾：卡住曲线；考奥林匹克跌过一跤（掉到“前 6 名”线下）；根还没扎深；这一集，他又去考了一次。
(() => {
  const FL = 770, TX = 1250;
/** 选拔名次卡：前 6 名进国家队；小陶原来是第 6，后来掉到线下。{at, t0, t1, slide} */
  COMP.h4_rank = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [cx, cy] = fx.at, lt = t - fx.t0, p = EASE.out(clamp(lt / 0.4)), k = fx.id, z = Z.set + 1, W = 470, RH = 60, top = cy - 200;
      const op = 1 - clamp((t - fx.t1 + 0.25) / 0.25);
      stroke(k + '.card', superPts(cx, cy + 10, W, 500, 24, 12), { z, w: 5, closed: true, fill: C.paper, draw: p, opacity: op });
      const u = EASE.io(clamp((t - fx.slide) / 0.6));
      for (let i = 0; i < 7; i++) {
        const y = top + i * RH + (i === 6 ? 30 : 0), q = clamp((lt - 0.3 - i * 0.12) / 0.2); if (q <= 0) continue;
        text(k + '.n' + i, String(i + 1), cx - W / 2 + 50, y, { size: 50, font: CFG.FONT_MIX, z: z + 0.2, opacity: q * op });
        // other names: pencil scribbles. Row 6 holds 小陶 until the slide, then someone else's scribble moves in.
        const scr = (key, y0, o) => { const pts = []; for (let j = 0; j <= 8; j++) pts.push([cx - W / 2 + 100 + j * 30, y0 + (j % 2 ? -8 : 6)]); stroke(key, pts, { z: z + 0.1, w: 3, color: C.pencil, opacity: o * op, boil: 0.6 }); };
        if (i < 5) scr(k + '.s' + i, y, q);
        if (i === 5) scr(k + '.s5', y, q * u);
      }
      const cut = top + 5 * RH + 36;
      if (lt > 1.2) {
        const dp = EASE.out(clamp((lt - 1.2) / 0.4));
        for (let d = 0; d < 11; d++) { const x0 = cx - W / 2 + 20 + d * 42; stroke(k + '.cut' + d, [[x0, cut], [x0 + 26, cut]], { z: z + 0.3, w: 4, color: C.red, draw: clamp(dp * 11 - d), opacity: op }); }
        text(k + '.cutT', '前 6 名 → 国家队', cx + W / 2 + 24, cut, { size: 46, color: C.red, anchor: 'start', z: Z.annot, opacity: dp * op });
      }
      // 小陶's name: row 6, then sliding below the line to row 7
      const ny = lerp(top + 5 * RH, top + 6 * RH + 30, u), nq = clamp((lt - 1.0) / 0.2);
      if (nq > 0) text(k + '.me', '小陶', cx - W / 2 + 104, ny, { size: 50, anchor: 'start', z: z + 0.4, opacity: nq * op, scale: lerp(0.6, 1, EASE.back(nq)) });
    },
    cues: fx => [[fx.t0, 'paper'], [fx.t0 + 1.2, 'pen'], [fx.slide, 'whoosh']],
  };
/** 一棵小苗：茎蹿得飞快、根很浅，风一吹就晃；后来根一点点扎深，就稳了。
   *  {at: 地面点, t0, t1, h: [[t, 高]], root: [[t, 根深]]} */
  COMP.h4_plant = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const [gx, gy] = fx.at, H = evalTrack(fx.h, t), R = evalTrack(fx.root, t), k = fx.id, z = Z.set + 2;
      const op = fx.t1 !== undefined ? 1 - clamp((t - fx.t1 + 0.3) / 0.3) : 1;
      // ground strip with a few soil specks
      stroke(k + '.g', [[gx - 230, gy], [gx + 230, gy + 2]], { z, w: 4, draw: EASE.out(clamp((t - fx.t0) / 0.4)), opacity: op });
      for (let i = 0; i < 9; i++) dot(k + '.s' + i, [gx - 200 + i * 50 + (i % 3) * 7, gy + 26 + (i % 2) * 34], 3, C.pencil, z);
      // wobble: a tall stem on shallow roots sways a lot
      const ratio = clamp(H / Math.max(30, R * 3.2), 0, 2.2), sway = Math.sin(t * 4.2) * 7 * Math.max(0, ratio - 0.6);
      const pts = []; const n = 8;
      for (let i = 0; i <= n; i++) { const u = i / n; pts.push([gx + Math.sin(u * 2.2) * 6 + sway * u * u, gy - H * u]); }
      stroke(k + '.stem', pts, { z: z + 0.2, w: 5, opacity: op });
      // leaves: pairs along the stem
      const nl = Math.floor(H / 70);
      for (let i = 0; i < nl; i++) {
        const u = (i + 0.7) / (nl + 0.5), p = pts[Math.round(u * n)] || pts[n], s = i % 2 ? 1 : -1, L = 34 + 6 * (i % 2);
        stroke(k + '.lf' + i, [[p[0], p[1]], [p[0] + s * L * 0.55, p[1] - L * 0.55], [p[0] + s * L, p[1] - L * 0.15], [p[0], p[1]]], { z: z + 0.1, w: 3.5, closed: true, fill: C.paper, opacity: op });
      }
      // roots: three main strands that grow down, plus small side roots
      [[-0.5, 0], [0, 1], [0.55, 2]].forEach(([dx, j]) => {
        const rp = []; for (let i = 0; i <= 6; i++) { const u = i / 6; rp.push([gx + dx * R * 0.45 * u + Math.sin(u * 5 + j) * 6, gy + R * u * (j === 1 ? 1 : 0.8)]); }
        if (R > 4) stroke(k + '.r' + j, rp, { z, w: 3.4, opacity: op });
        if (R > 60) [0.4, 0.7].forEach((u, q) => { const p = rp[Math.round(u * 6)]; stroke(k + '.rs' + j + q, [p, [p[0] + (q ? 18 : -18), p[1] + 22]], { z, w: 2.4, opacity: op }); });
      });
    },
  };

  /** 一条小小的卡住曲线：平 → 掉进谷 → 冲上峰（回顾第 3 集） */
  COMP.h4_curve = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const p = EASE.io(clamp((t - fx.t0) / 1.6)), [x0, y0] = fx.at, W = 620, pts = [];
      const f = u => u < 0.15 ? 0 : u < 0.3 ? -150 * EASE.io((u - 0.15) / 0.15) : u < 0.7 ? -150 + Math.sin(u * 60) * 6 : u < 0.85 ? -150 + 330 * EASE.io((u - 0.7) / 0.15) : 180 - 40 * (u - 0.85) / 0.15;
      for (let i = 0; i <= 60; i++) { const u = i / 60; if (u > p) break; pts.push([x0 + u * W, y0 - f(u)]); }
      stroke(fx.id + '.ax', [[x0 - 20, y0 - 230], [x0 - 20, y0 + 190, 1], [x0 + W + 20, y0 + 190, 1]], { z: Z.set, w: 4 });
      if (pts.length > 1) stroke(fx.id + '.c', pts, { z: Z.set + 1, w: 5.5 });
      const lab = (k, s, x, y, a) => { if (t > fx.t0 + a) text(fx.id + k, s, x, y, { size: 40, color: C.red, z: Z.annot, rot: -3 }); };
      lab('.v', '卡住谷', x0 + 0.48 * W, y0 + 240, 0.9);
      lab('.p', '啊哈峰', x0 + 0.86 * W, y0 - 230, 1.5);
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  defineScene({
    id: 'recap', chapter: '上集回顾', dur: 16.9, floor: FL,
    cast: { terry: E4.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [13.6, [TX + 520, FL], 2.4, 'in']],
        pose: [[0, 'stand'], [4.2, 'thinkStand', 0.15], [8.7, 'stand', 0.15], [13.0, { ...POSE.stand, armScale: 1.6, armL: [150, 10] }, 0.12, 'back'], [13.6, makeWalk(13.6, 16.9, 5.2)]],
        face: [[0, 'smile'], [4.2, 'sheepish', 0.06], [8.7, 'focus', 0.06], [13.0, 'grin', 0.05]],
        turn: [[0, -0.4], [13.0, 0, 0.1], [13.6, 0.6, 0.1]],
        gaze: [[0, 'thing'], [13.0, 'viewer'], [13.6, [1700, 600]]],
        squash: [[0, 1], [13.0, 1.08, 0.06], [13.06, 1, 0.22, 'back']],
      },
    },
    targets: () => ({ thing: [560, 420] }),
    fx: [
      { type: 'title', id: 'stampR', text: '上集回顾', x: 150, y: 110, size: 44, t0: -0.1, t1: 13.0, color: 'red', rot: -6 },
      // no age stamp here: the setback recapped above was before ten (probably age 9); the 10岁 stamp comes in scene 10
      { type: 'h4_curve', id: 'cv', at: [260, 430], t0: 0.3, t1: 4.2 },
      { type: 'h4_rank', id: 'rank', at: [480, 450], t0: 4.25, t1: 8.7, slide: 5.6 },
      { type: 'h4_plant', id: 'pl', at: [560, 560], t0: 8.75, t1: 13.0, h: [[0, 0], [8.8, 0], [9.3, 330, 0.7, 'out']], root: [[0, 0], [9.3, 22, 0.5]] },
      { type: 'label', id: 'lbRoot', text: '根还没扎深', size: 46, at: [240, 660], rot: 3, t0: 10.0, t1: 13.0, target: [550, 590], bend: -0.25, gap: 12 },
      { type: 'title', id: 'again', text: '再考一次！', x: 640, y: 380, size: 100, t0: 13.2, color: 'red', rot: -4, sfx: 'stamp' },
    ],
    sfx: [[13.6, 'whoosh']],
    steps: [{ t0: 13.6, t1: 16.9, hz: 5.2 }],
    subs: [
      { t0: 0.3, t1: 4.1, text: '上一集，小陶学会了面对卡住。' },
      { t0: 4.2, t1: 8.6, text: '我们还知道，他考奥林匹克跌过一跤：' },
      { t0: 8.7, t1: 12.5, text: '爸爸妈妈说，他的根还没扎深。' },
      { t0: 13.0, t1: 16.4, text: '这一集，他又去考了一次。' },
    ],
  });
})();
