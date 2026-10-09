// 第 20 场 · 奇数两条打勾，摆出议程（agenda）
// 四条跑道（空的）；右边每条跑道旁一个小图：一组 4 个点两两配对（两对红椭圆），余 1 落单 1 个点晃一下，余 3 一对加落单 1 个：奇偶只看零头。
// 余 1、余 3 两条跑道盖大勾，右边贴第 1 集结论卡的缩略图"每一个正奇数，都是两个平方的差"和它的范围卡。
// 余 0 跑道：0、4、8、12、16（4–16 上方小勾），后面两块空砖；余 2 跑道：2、6、10、14、18，一个勾也没有，"一个也没找到"。
// Jasper 的书桌，本子放大：顶上"2026 年"，下面横式 2026 ÷ 4 = 506 … 2；数字砖 2026 刷上网点，落进余 2 跑道，然后收起。
// 漫士引用①前半：一堆糖被红框框成 4 颗一组（不画人，不写颗数，没有剩下的）。后半：糖堆清掉，"还没找到 / 根本没有"小卡放大，
// "根本没有"旁挂锁牌"这个世界上谁都做不到"。小问号连跳两下，举出两块牌，和两格小卡排成三张，缩成左上角的议程条。
// 开场：只有顶栏（细跑道条 + 卡①）；结尾：只剩顶栏 + 议程条。
(() => {
  const FL = N2.FL, W = N2.W, F = N2.F;

  /* ---------------- the maths, checked ---------------- */
  const ways = n => { const w = []; for (let a = 1; a <= n; a++) for (let b = 0; b < a; b++) if (a * a - b * b === n) w.push([a, b]); return w; };
  // a group of 4 pairs up, so odd / even depends only on the bit left over
  for (let n = 0; n < 200; n++) if (n % 2 !== (n % 4) % 2) console.error('g2_agenda: parity of', n);
  if ([1, 3].some(r => r % 2 !== 1) || [0, 2].some(r => r % 2 !== 0)) console.error('g2_agenda: lanes 1, 3 odd; 0, 2 even');
  // episode 1: every positive odd number n is ((n + 1) / 2)² − ((n − 1) / 2)²
  for (let n = 1; n < 200; n += 2) { const a = (n + 1) / 2, b = (n - 1) / 2; if (a * a - b * b !== n || b < 0 || a <= b) console.error('g2_agenda: odd', n); }
  const LANE0 = [0, 4, 8, 12, 16], LANE2 = [2, 6, 10, 14, 18], TICKED = [4, 8, 12, 16];
  if (LANE0.some(n => n % 4) || LANE2.some(n => n % 4 !== 2)) console.error('g2_agenda: lane bricks');
  if (TICKED.some(n => !ways(n).length) || LANE2.some(n => ways(n).length)) console.error('g2_agenda: 4–16 found, 2–18 none found');
  // 2026 ÷ 4 = 506 … 2
  if (4 * 506 + 2 !== 2026 || Math.floor(2026 / 4) !== 506 || 2026 % 4 !== 2) console.error('g2_agenda: 2026 = 4 × 506 + 2');
  // the candy: 4 groups of 4, nothing left over
  const CANDY_GROUPS = 4, CANDY = 4 * CANDY_GROUPS;
  if (CANDY % 4 !== 0 || CANDY / 4 !== CANDY_GROUPS) console.error('g2_agenda: candy in fours');

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    LANES: 0.25, ROW0: 0.7, PAIR0: 1.5, ROWS: [2.8, 3.25, 3.7], WIG: [3.3, 4.15], PAR: 4.3, DEMO_OUT: 6.6,
    TICK13: [5.55, 6.0], C1: 7.2, BRICKS: 7.9, SMALL_TICK: 8.5, NONE: 9.2, NONE_OUT: 13.4, C1_OUT: 10.0,
    DESK: 10.35, YEAR: 10.75, DIV: 11.55, DIV_RING: 13.3, B26: 13.65, B26_TAB: 13.95, B26_FLY: 14.3, B26_FLY_DUR: 0.55, B26_AWAY: 15.55,
    LANES_OUT: 15.7, DESK_OUT: 15.7,
    CANDY: 16.3, CANDY_NAME: 17.9, CLUMP: 19.1, FRAMES: [19.5, 19.7, 19.9, 20.1], CANDY_OUT: 21.0,
    PN: 21.4, PN_GROW: 21.75, LOCK: 23.25, LOCK_OUT: 25.9, PN_SHRINK: 26.0,
    QM: 26.1, HOP1: 26.35, SIGN1: 26.55, DET1: 27.3, HOP2: 27.45, SIGN2: 27.6, DET2: 28.4, DET_DUR: 0.35, Y2: 26.6,
    TO_BAR: 30.3, BAR_DUR: 0.35, AGENDA: 30.45, QM_EXIT: 30.25, DUR: 31.0,
  };

  /* ---------------- 四条跑道（数字砖只放余 0、余 2 两条） ---------------- */
  const L = { x: 210, y: 250, W: 800, H: 76, gap: 16, head: 70, cell: 100 };
  const laneY = r => L.y + r * (L.H + L.gap), laneCY = r => laneY(r) + L.H / 2;
  const lanes = { type: 'n2_lanes', id: 'g2ln', ...L, t0: T.LANES, t1: T.LANES_OUT };
  const BS = 0.88;   // bricks at 0.88 (84 × 56): the numbers stay at 37
  COMP.g2_lanefx = {
    draw(fx, t) {
      if (t < T.LANES) return;
      const out = clamp((t - T.LANES_OUT) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length;
      // 余 1、余 3: a big red tick on the whole lane
      [1, 3].forEach((r, i) => {
        const u = clamp((t - T.TICK13[i]) / 0.3); if (u <= 0) return;
        const cx = 560, cy = laneCY(r);
        stroke(`${k}.big${r}`, [[cx - 62, cy - 6], [cx - 18, cy + 34, 1], [cx + 74, cy - 50]], { z: Z.annot, w: 10, color: C.red, draw: EASE.out(u) });
      });
      // 余 0、余 2: their bricks pop in; two empty bricks after 16
      [...LANE0, ...LANE2].forEach((n, i) => {
        const a = EASE.back(clamp((t - T.BRICKS - i * 0.05) / 0.25)); if (a <= 0) return;
        const [x, y] = N2.laneXY(L, n); N2.brick(`${k}.b${n}`, x, y, n, n % 4, { scale: BS * Math.max(0.01, a) });
      });
      [5, 6].forEach((j, i) => {
        const u = clamp((t - T.BRICKS - 0.55 - i * 0.08) / 0.25); if (u <= 0) return;
        const x = L.x + L.head + L.cell * (j + 0.5), y = laneCY(0), hw = 42 * BS / 0.88, hh = 28, P = [[x - hw, y - hh], [x + hw, y - hh], [x + hw, y + hh], [x - hw, y + hh]];
        P.forEach((p, q) => N2.dash(`${k}.e${j}.${q}`, p, P[(q + 1) % 4], { step: 14, on: 7, w: 2.6, z: Z.front, opacity: u }));
      });
      // small ticks above 4, 8, 12, 16
      TICKED.forEach((n, i) => {
        const u = clamp((t - T.SMALL_TICK - i * 0.12) / 0.2); if (u <= 0) return;
        const [x] = N2.laneXY(L, n); text(`${k}.tk${n}`, '✓', x, laneY(0) - 26, { size: 40, color: C.red, z: Z.annot, anchor: 'middle', font: CFG.FONT_MIX, opacity: clamp(u * 2), scale: lerp(0.5, 1, EASE.back(u)) });
      });
      // 余 2: not one found
      const nu = clamp((t - T.NONE) / 0.3) * (1 - clamp((t - T.NONE_OUT) / 0.3));
      if (nu > 0) text(k + '.none', '一个也没找到', 900, laneCY(2), { size: 36, color: C.red, z: Z.annot, anchor: 'middle', opacity: nu });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [...T.TICK13.map(x => [x, 'pen']), [T.BRICKS, 'pop'], [T.BRICKS + 0.3, 'pop'], [T.SMALL_TICK, 'pen'], [T.NONE, 'plip']],
  };

  /* ---------------- 一组 4 个两两配对；零头决定奇偶（每条跑道旁一个小图） ---------------- */
  const DX = 1100, GAP = 26;
  COMP.g2_pairs = {
    draw(fx, t) {
      if (t < T.ROW0) return;
      const out = clamp((t - T.DEMO_OUT) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length;
      const rowT = r => (r === 0 ? T.ROW0 : T.ROWS[r - 1]);
      [0, 1, 2, 3].forEach(r => {
        const t0 = rowT(r), a = EASE.back(clamp((t - t0) / 0.25)); if (a <= 0) return;
        const cy = laneCY(r), s = Math.max(0.01, a);
        // the group of 4 (2 × 2) in a red box; its two columns are two pairs
        stroke(`${k}.g${r}`, N2.box(DX - 30 * s, cy - 30 * s, DX + 30 * s, cy + 30 * s), { z: Z.front, w: 3.5, color: C.red, fill: C.paper });
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([p, q], i) => dot(`${k}.g${r}d${i}`, [DX + p * GAP / 2 * s, cy + q * GAP / 2 * s], 7 * s, C.ink, Z.front + 0.1));
        const pu = clamp((t - (r === 0 ? T.PAIR0 : t0 + 0.2)) / 0.3);
        if (pu > 0) [-1, 1].forEach((p, i) => stroke(`${k}.g${r}p${i}`, ringPts(`${k}.g${r}pp${i}`, DX + p * GAP / 2, cy, 10, 24, { n: 12, a0: -100, sweep: 380, rv: 0.04 }), { z: Z.annot, w: 3, color: C.red, draw: EASE.out(pu) }));
        // the bit left over: r dots; a pair gets an oval, a lone dot wiggles
        const lx = DX + 62;
        if (r >= 2) {
          [-1, 1].forEach((q, i) => dot(`${k}.l${r}p${i}`, [lx, cy + q * GAP / 2], 7 * s, C.ink, Z.front + 0.1));
          if (pu > 0) stroke(`${k}.l${r}o`, ringPts(`${k}.l${r}op`, lx, cy, 10, 24, { n: 12, a0: -100, sweep: 380, rv: 0.04 }), { z: Z.annot, w: 3, color: C.red, draw: EASE.out(pu) });
        }
        if (r % 2) {
          const wt = T.WIG[(r - 1) / 2], w = t > wt && t < wt + 0.7 ? 6 * Math.sin((t - wt) * 32) * (1 - (t - wt) / 0.7) : 0;
          dot(`${k}.l${r}x`, [(r === 1 ? lx : lx + 34) + w, cy], 7 * s, C.red, Z.front + 0.1);
        }
        // 奇 / 偶
        const lu = clamp((t - T.PAR - r * 0.08) / 0.25);
        if (lu > 0) text(`${k}.par${r}`, r % 2 ? '奇' : '偶', DX + 150, cy, { size: 44, color: r % 2 ? C.red : C.ink, z: Z.annot, anchor: 'middle', opacity: clamp(lu * 2), scale: lerp(0.6, 1, EASE.back(lu)) });
      });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.ROW0, 'pop'], [T.PAIR0, 'pen'], ...T.ROWS.map(r => [r, 'pop']), ...T.WIG.map(w => [w, 'plip']), [T.PAR, 'pen']],
  };

  /* ---------------- 第 1 集结论卡缩略图 + 它的范围卡 ---------------- */
  const c1 = {
    type: 'n2_grp', id: 'g2c1g', out: T.C1_OUT,
    inner: [
      { type: 'prop', kind: 'n2_c1card', id: 'g2c1', at: [1295, 318], scale: 0.72, t0: T.C1, drawDur: 0.4, sfxAt: [[T.C1, 'paper']] },
      { type: 'prop', kind: 'n1_card', id: 'g2sc', at: [1295, 452], w: 446, h: 96, size: 36, lines: ['两个数都是 0 或正整数'], t0: T.C1 + 0.35, drawDur: 0.35 },
      { type: 'title', id: 'g2c1t', text: '上集', x: 1478, y: 236, size: 40, color: 'red', rot: -6, t0: T.C1 + 0.25 },
    ],
  };

  /* ---------------- Jasper 的书桌，本子放大：2026 ÷ 4 = 506 … 2 ---------------- */
  const PG = [1050, 215, 1550, 470], DESK_AT = [1290, 650];
  PROPS.g2_page = (fx, t, lt, p) => {
    const k = fx.id, z = Z.board - 0.5, [x0, y0, x1, y1] = PG;
    stroke(k + '.o', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [1262, y1, 1], [1236, 606, 1], [1214, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 4.5, fill: C.paper, draw: p });
    [296, 380, 446].forEach((y, i) => stroke(`${k}.r${i}`, [[x0 + 24, y], [x1 - 24, y]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.6, draw: clamp(p * 2 - 0.8 - i * 0.1) }));
  };
  const DIV_TXT = '2026 ÷ 4 = 506 … 2', DIV_S = 42, DIV_X = 1076, DIV_Y = 318;
  const DIV_LAY = layoutWriting({ text: DIV_TXT, x: DIV_X, y: DIV_Y, size: DIV_S, t0: 0, speed: 1 }), DIV_BOX = DIV_LAY.boxes[DIV_LAY.boxes.length - 1];
  if (DIV_LAY.boxes.length !== [...DIV_TXT].length || DIV_BOX.ch !== '2' || DIV_X + DIV_LAY.width > PG[2] - 16) console.error('g2_agenda: 2026 ÷ 4 line', DIV_LAY.width);
  const desk = [
    { type: 'n1_desk', id: 'g2desk', at: DESK_AT, t0: T.DESK, t1: T.DESK_OUT },
    { type: 'n2_grp', id: 'g2pgg', out: T.DESK_OUT, inner: { type: 'prop', kind: 'g2_page', id: 'g2pg', at: [0, 0], t0: T.DESK + 0.1, drawDur: 0.4, sfxAt: [[T.DESK + 0.1, 'paper']] } },
    F(T.DESK_OUT, { type: 'scribe', id: 'g2year', text: '2026 年', x: 1078, y: 262, size: 46, cps: 10, t0: T.YEAR }, 0.35),
    F(T.DESK_OUT, W('g2div', DIV_TXT, DIV_X, DIV_Y, DIV_S, T.DIV, { speed: 3000, sfx: 'pen' }), 0.35),
    { type: 'n2_fn', id: 'g2divR', t0: T.DIV_RING, cues: [[T.DIV_RING, 'pen']], fn: (t, lt, k) => {
      const o = 1 - clamp((t - T.DESK_OUT) / 0.35); if (o <= 0) return;
      const b = DIV_BOX; stroke(k, ringPts(k + '.p', b.x + b.w / 2, b.y + b.h * 0.52, b.w / 2 + 18, b.h / 2 + 14, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: EASE.out(clamp(lt / 0.35)), opacity: o });
    } },
  ];
  // the brick 2026: white on the page, gets its dot pattern (余 2), drops into lane 2 after "……", then goes away again
  const B26_FROM = [1200, 424], B26_TO = [L.x + L.head + L.cell * 6.5, laneCY(2)];
  COMP.g2_b26 = {
    draw(fx, t) {
      if (t < T.B26) return;
      const k = fx.id, a = EASE.back(clamp((t - T.B26) / 0.25)), fu = EASE.io(clamp((t - T.B26_FLY) / T.B26_FLY_DUR));
      const au = EASE.in(clamp((t - T.B26_AWAY) / 0.4)); if (au >= 1) return;
      let p = lerp2(B26_FROM, B26_TO, fu); p = [p[0], p[1] - 80 * Math.sin(Math.PI * fu) - 120 * au];
      const n0 = DL.items.length;
      // dots after the ninth column: "……" (the lane goes on a long way before 2026)
      if (fu > 0.6) text(k + '.dots', '……', L.x + L.head + L.cell * 5.5, laneCY(2), { size: 40, color: C.pencil, z: Z.front, anchor: 'middle', opacity: clamp((fu - 0.6) / 0.4) });
      const tabU = clamp((t - T.B26_TAB) / 0.35), bw = 128, bh = 62, x0 = p[0] - bw / 2, y0 = p[1] - bh / 2, tw = 30, s = Math.max(0.01, a);
      DL.save(); DL.translate(p[0], p[1]); DL.scale(s); DL.translate(-p[0], -p[1]);
      stroke(k + '.b', N2.box(x0, y0, x0 + bw, y0 + bh), { z: Z.front + 1, w: 3.5, fill: '#FFFDF7' });
      if (tabU > 0) { N2.fill(k + '.f', x0 + 3, y0 + 3, x0 + tw, y0 + bh - 3, 2, { z: Z.front + 1.1, step: 12, dot: 2.6, draw: tabU }); stroke(k + '.tl', [[x0 + tw, y0], [x0 + tw, y0 + bh]], { z: Z.front + 1.15, w: 2.5, opacity: tabU }); }
      text(k + '.n', '2026', lerp(p[0], x0 + tw + (bw - tw) / 2, tabU), p[1] + 1, { size: 40, font: CFG.FONT_MIX, z: Z.front + 1.2, anchor: 'middle' });
      DL.restore();
      if (au > 0) N2.fadeFrom(n0, 1 - au);
    },
    cues: () => [[T.B26, 'pop'], [T.B26_TAB, 'swish'], [T.B26_FLY + T.B26_FLY_DUR, 'tap'], [T.B26_AWAY, 'whoosh']],
  };

  /* ---------------- 引用①前半：一堆糖，红框框成 4 颗一组 ---------------- */
  const CLUMPS = [[555, 600], [800, 600], [1045, 600], [800, 452]], CS = 1.3;
  const OFF = [[-44, -29], [44, -29], [-44, 29], [44, 29]];
  const CANDY_POS = CLUMPS.flatMap(([cx, cy], g) => OFF.map(([dx, dy], i) => {
    const h = hstr('g2candy' + g + '.' + i), j = (q, a) => rnd(h, q, 1) * a;
    return { tight: [cx + dx, cy + dy], loose: [cx + dx * 1.35 + j(1, 18), cy + dy * 1.4 + j(2, 12)], rot: j(3, 28), g };
  }));
  const candy = (k, x, y, rot, s = 1) => {
    DL.save(); DL.translate(x, y); DL.rotate(rot); DL.scale(s);
    stroke(k + '.w0', [[-26, 0], [-42, -12, 1], [-42, 12, 1], [-26, 0, 1]], { z: Z.front, w: 3, fill: C.paper });
    stroke(k + '.w1', [[26, 0], [42, -12, 1], [42, 12, 1], [26, 0, 1]], { z: Z.front, w: 3, fill: C.paper });
    stroke(k + '.c', ringPts(k + '.cp', 0, 0, 27, 17, { n: 12, closed: true }), { z: Z.front + 0.1, w: 3.5, closed: true, fill: C.paper });
    stroke(k + '.s', [[-8, -14], [6, 14]], { z: Z.front + 0.2, w: 2.5, color: C.pencil });
    DL.restore();
  };
  COMP.g2_candy = {
    draw(fx, t) {
      if (t < T.CANDY) return;
      const out = clamp((t - T.CANDY_OUT) / 0.35); if (out >= 1) return;
      const k = fx.id, n0 = DL.items.length, cu = EASE.io(clamp((t - T.CLUMP) / 0.4));
      CANDY_POS.forEach((c, i) => {
        const a = EASE.back(clamp((t - T.CANDY - (i % 7) * 0.05 - Math.floor(i / 7) * 0.03) / 0.25)); if (a <= 0) return;
        const p = lerp2(c.loose, c.tight, cu);
        candy(`${k}.c${i}`, p[0], p[1], lerp(c.rot, c.rot * 0.3, cu), CS * Math.max(0.01, a));
      });
      CLUMPS.forEach(([cx, cy], g) => {
        const u = clamp((t - T.FRAMES[g]) / 0.3); if (u <= 0) return;
        stroke(`${k}.f${g}`, superPts(cx, cy, 216, 140, 24, 6), { z: Z.annot, w: 5, color: C.red, closed: true, draw: EASE.out(u) });
      });
      const nu = clamp((t - T.CANDY_NAME) / 0.3);
      if (nu > 0) text(k + '.name', '拿糖游戏', 800, 300, { size: 56, color: C.red, z: Z.annot, anchor: 'middle', opacity: clamp(nu * 2), scale: lerp(0.6, 1, EASE.back(nu)), rot: -2 });
      if (out > 0) N2.fadeFrom(n0, 1 - out);
    },
    cues: () => [[T.CANDY, 'pop'], [T.CANDY + 0.3, 'pop'], [T.CANDY_NAME, 'pen'], [T.CLUMP, 'swish'], ...T.FRAMES.map(f => [f, 'pen'])],
  };

  /* ---------------- 引用①后半：两格小卡放大，"根本没有"旁挂锁牌；然后三块牌缩成议程条 ---------------- */
  const PS = 0.9, PTX = 800 - (90 + 1420) / 2 * PS, PTY = 200 - 172 * PS;            // big: panels + lock board
  const QS = 0.65, QTX = 740 - 650 * QS, QTY = 350 - 172 * QS;                         // one of three boards
  const [AG2x, AG2y] = N2.HUD_GEO.ag(2), BS3 = 0.07;
  const panels = {
    type: 'n2_panels', id: 'g2pn', t0: T.PN, lock: T.LOCK, lockOut: T.LOCK_OUT, t1: T.TO_BAR + 0.08,
    xf: [[0, [800 - 650 * 0.3, 430 - 431 * 0.3, 0.3]], [T.PN_GROW, [PTX, PTY, PS], 0.6, 'io'], [T.PN_SHRINK, [QTX, QTY, QS], 0.5, 'io'],
      [T.TO_BAR, [AG2x - 650 * BS3, AG2y - 431 * BS3, BS3], T.BAR_DUR, 'in']],
  };
  // the two boards ① ② the little question mark holds up, then hangs in the row; all three fly into the agenda bar
  const QM_AT = [1420, FL], QMS = 150 / 200, QSIGN = 52;
  const BOARDS = [{ s: N2.AGENDA[0], det: T.DET1, at: [500, 240] }, { s: N2.AGENDA[1], det: T.DET2, at: [960, 240] }];
  COMP.g2_boards = {
    draw(fx, t) {
      if (t < Math.min(T.DET1, T.Y2)) return;
      const k = fx.id, n0 = DL.items.length, fo = clamp((t - T.TO_BAR - 0.08) / 0.25); if (fo >= 1) return;
      BOARDS.forEach((B, i) => {
        if (t < B.det) return;
        const size = 40, tw = textWidth(B.s, size) + 40, from = [QM_AT[0] - 70 * QMS, QM_AT[1] - 262 * QMS], fs = (textWidth(B.s, QSIGN) + 40) * QMS / tw;
        const u = EASE.io(clamp((t - B.det) / T.DET_DUR)), bu = EASE.in(clamp((t - T.TO_BAR) / T.BAR_DUR)), [ax, ay] = N2.HUD_GEO.ag(i);
        // up first, then across: the board never passes over the two panels below the row
        let p = [lerp(from[0], B.at[0], EASE.io(u)), lerp(from[1], B.at[1], EASE.out(clamp(u * 1.8)))], s = lerp(fs, 1, u);
        if (bu > 0) { p = lerp2(B.at, [ax, ay], bu); s = lerp(1, 0.1, bu); }
        DL.save(); DL.translate(p[0], p[1]); DL.scale(Math.max(0.01, s));
        stroke(`${k}.b${i}`, N2.box(-tw / 2, -34, tw / 2, 34), { z: Z.annot - 1, w: 5, color: C.red, fill: C.paper });
        text(`${k}.t${i}`, B.s, 0, 1, { size, color: C.red, z: Z.annot - 0.8, anchor: 'middle' });
        DL.restore();
        const nu = clamp((t - B.det - T.DET_DUR) / 0.25) * (1 - clamp((t - T.TO_BAR) / 0.1));
        if (nu > 0) text(`${k}.n${i}`, N2.CIRC[i], B.at[0] - tw / 2 - 30, B.at[1] - 26, { size: 44, color: C.red, z: Z.annot, anchor: 'middle', opacity: nu, scale: lerp(0.5, 1, EASE.back(nu)) });
      });
      // ③ = "余2：" over the two panels (the question from the start of the episode); it flies into the bar with them
      const yu = clamp((t - T.Y2) / 0.3), bu3 = EASE.in(clamp((t - T.TO_BAR) / T.BAR_DUR));
      if (yu > 0) {
        const [ax, ay] = N2.HUD_GEO.ag(2), p = lerp2([QTX + 90 * QS + 4, QTY + 172 * QS - 34], [ax, ay], bu3), s = lerp(1, 0.1, bu3);
        DL.save(); DL.translate(p[0], p[1]); DL.scale(Math.max(0.01, s));
        text(k + '.n2', N2.CIRC[2], 0, 0, { size: 44, color: C.red, z: Z.annot, anchor: 'middle', opacity: yu * (1 - clamp((t - T.TO_BAR) / 0.1)), scale: lerp(0.5, 1, EASE.back(yu)) });
        text(k + '.y2', '余2：', 30, 0, { size: 46, color: C.red, z: Z.annot, anchor: 'start', opacity: yu });
        DL.restore();
      }
      if (fo > 0) N2.fadeFrom(n0, 1 - fo);
    },
    cues: () => [[T.Y2, 'pen'], [T.DET1, 'whoosh'], [T.DET2, 'whoosh'], [T.TO_BAR, 'swish']],
  };

  /* ---------------- 小问号：连跳两下，举出两块牌 ---------------- */
  const qm = {
    type: 'qm', id: 'g2qm', size: 150, t0: T.QM, burst: true, signSide: 'left', signSize: QSIGN,
    pos: [[0, QM_AT], [T.QM_EXIT, [1790, FL], 0.75, 'in']],
    mood: [[0, 'neutral'], [T.SIGN1, 'doubt'], [T.DET1, 'happy'], [T.SIGN2, 'doubt'], [T.DET2, 'happy']],
    act: [[0, 'idle'], [T.HOP1, 'hop'], [T.HOP1 + 0.45, 'idle'], [T.HOP2, 'hop'], [T.HOP2 + 0.45, 'idle'], [T.QM_EXIT, 'hop']],
    sign: [[0, null], [T.SIGN1, N2.AGENDA[0]], [T.DET1, null], [T.SIGN2, N2.AGENDA[1]], [T.DET2, null]],
    gaze: [[0, 'viewer'], [T.DET1, [500, 252]], [T.SIGN2, 'viewer'], [T.DET2, [960, 252]], [T.TO_BAR, [200, 130]], [T.QM_EXIT, [1800, 600]]],
  };

  defineScene({
    id: 'agenda', dur: T.DUR, floor: FL,
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'agenda', agenda: T.AGENDA },
      lanes, { type: 'g2_lanefx', id: 'g2lf' }, { type: 'g2_pairs', id: 'g2pr' },
      c1,
      ...desk, { type: 'g2_b26', id: 'g2b26' },
      { type: 'g2_candy', id: 'g2cd' },
      panels, { type: 'g2_boards', id: 'g2bd' },
      qm,
    ],
    sfx: [[T.HOP1, 'hop'], [T.HOP2, 'hop']],
    subs: [
      {"t0": 0.6, "t1": 4.76, "text": "一组4个能两两配对，奇偶只看零头：", "say": "一组四个能两两配对，奇偶只看零头："},
      {"t0": 4.96, "t1": 9.92, "text": "余1、余3是奇数：上集证过全有小拐角。", "say": "余一、余三是奇数：上集证过，全有小拐角。"},
      {"t0": 10.32, "t1": 15.51, "text": "今年是2026年：506余2，也在余2。", "say": "今年是两千零二十六年：五百零六余二，也在余二。"},
      {"t0": 16.01, "t1": 21.06, "text": "漫士演讲时讲过拿糖游戏，秘诀：四颗一组。"},
      {"t0": 21.36, "t1": 26.0, "text": "他还说数学能说“这个世界上谁都做不到”。", "say": "他还说，数学能说：这个世界上谁都做不到。"},
      {"t0": 26.4, "t1": 30.49, "text": "“平方落哪几条？两个平方相减呢？”", "voice": "qm", "say": "平方落哪几条？两个平方相减呢？"},
    ],
  });
})();
