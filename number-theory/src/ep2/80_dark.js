// 第 80 场 · 整条熄灭（dark）：
// 小问号举牌"只有 6？"；红色指针把证明栈逐行扫一遍，所有的 6 改成 □，只有"余 2"发红光，其余行打 ✓"对任何 □ 都成立"。
// 清场：整屏只剩余 2 那条跑道。7 秒纯画面：砖从 2 开始一块块变灰熄灭，越来越快，跑道变成一道疾驰的纸带；右下角计数器
// "熄灭：1 → 250（到 998）→ 507（到 2026）"之后一直往上滚，旁边写"……没有尽头：数不完，也不用数"；经过 1000 时第 1 集
// 电脑纸带的缩影闪一下（"上集电脑查到 1000"时它再晃一下、冒汗）。纸带倒回开头（全是灰的），第 1 集表上的"猜想（还没证明）"
// 标签飞回来贴在 2 上方，撕下换成"证明了 ✓"，旁边钉范围卡。Jasper 说 2026：2026 砖从议程条飞回来、翻面"✗ 没有小拐角"；
// "还没找到 / 根本没有"两格缩小回来，红章盖在"根本没有"上，锁牌亮一下，议程 ③ 打勾。
// 漫士引用②：一排倒扣的杯子（翻来翻去）和一只变色龙（变色），箭头指向方框"不变的东西"；卡①在顶栏弹一下：
// 红方框（整组 4 个点）进进出出，零头两个点垫黄，始终不动。
// 开场：顶栏（卡①②③）+ 议程条（①②打勾）+ 证明栈（8 行全亮、盖了章）+ 范围卡；结尾：只剩顶栏 + 议程条（①②③打勾）。
(() => {
  const FL = N2.FL;

  /* ---------------- the maths, checked ---------------- */
  const rem2 = n => n % 4 === 2;
  // n = a² − b² (a > b ≥ 0)  ⇔  n = d·e with 1 ≤ d ≤ e of the same parity (a = (d + e) / 2, b = (e − d) / 2)
  const isDiff = n => { for (let d = 1; d * d <= n; d++) if (n % d === 0 && (n / d - d) % 2 === 0) return true; return false; };
  for (let n = 1; n <= 3000; n++) if (isDiff(n) === rem2(n)) { console.error('d2_dark: "余 2 ⇔ 没有小拐角" breaks at', n); break; }
  if (!rem2(998) || rem2(999) || rem2(1000) || !(998 + 4 > 1000)) console.error('d2_dark: 998 should be the last 余 2 number below 1000');
  const countRem2 = m => { let c = 0; for (let n = 1; n <= m; n++) if (rem2(n)) c++; return c; };
  if (countRem2(998) !== 250 || countRem2(1000) !== 250) console.error('d2_dark: 余 2 numbers up to 998 should be 250, got', countRem2(998));
  if (countRem2(2026) !== 507 || !rem2(2026) || 2026 !== 4 * 506 + 2) console.error('d2_dark: 2026 should be the 507th 余 2 number, got', countRem2(2026));
  for (let n = 0; n <= 60; n++) for (let g = 1; g <= 4; g++) {   // 卡①: one whole group in or out keeps the 零头
    if ((n + 4 * g) % 4 !== n % 4 || (n >= 4 * g && (n - 4 * g) % 4 !== n % 4)) { console.error('d2_dark: card ① fails at', n, g); break; }
  }

  /* ---------------- timing (scene clock) ---------------- */
  const T = {
    QM: 0.3, QSIGN: 0.8, QDOWN: 3.4, SCAN: 3.6, BOX: 5.15, GLOW: 6.0, OK: 8.3, QHAPPY: 9.0, QOUT: 10.6,
    CLR1: 11.0,                                             // stack + scope card fade
    LANE: 11.6, BRICKS: 11.95, RUN: 12.9,                    // the tape; the first brick starts going out
    A: 14.6, K250: 15.9, K507: 16.7, NOTE: 18.4,             // speed-up; 998 (and the 1000 flash); 2026; "……没有尽头"
    MINI_PULSE: 20.0, MINI_OUT: 23.1,
    REW: 23.6, REW_D: 0.8,                                  // the tape whooshes back to its start
    TAG: 24.4, SWAP: 26.7, CARD: 27.3,                       // the old tag stands ~1.8 s before it is torn off (on "每一个")
    CNT_OUT: 28.05, KID: 28.3, B26: 28.7, FLIP: 30.6, TAPE_OUT: 30.95, PANELS: 31.5, STAMP: 32.4, LOCK: 32.8, LOCK_OUT: 33.8,   // tape + tag leave before the panels come in
    CLR2: 33.9, WALK: 33.8,
    CUPS: 34.6, FLIPS: [36.9, 37.5, 38.1, 40.2, 41.6], CHAM: 39.0, BOXT: 41.0, ARR: [41.5, 41.85], ICONS_OUT: 43.45,
    FLASH1: 43.9, GRP: 44.15, REMHI: 44.7, REMARR: 45.1, GIN1: 45.9, GOUT: 46.6, GIN2: 47.25, REMPULSE: 47.8,
    END: 48.4, DUR: 49.0,
  };

  for (const [k, v] of Object.entries(T)) if (!(typeof v === 'number' || (Array.isArray(v) && v.every(x => typeof x === 'number')))) console.error('d2_dark: bad timing', k, v);
  ['STAMP', 'LOCK', 'LOCK_OUT', 'TAPE_OUT', 'PANELS'].forEach(k => { if (typeof T[k] !== 'number') console.error('d2_dark: missing timing', k); });

  /* ---------------- how many bricks have gone out by time t (continuous, never stops growing) ---------------- */
  const herm = (u, p0, p1, m0, m1) => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1; };
  const K = t => {
    if (t < T.RUN) return 0;
    if (t < T.A) { const s = t - T.RUN; return 0.5 + 1.6 * s + 0.962 * s * s; }                     // 2, 6, 10, 14, 18, 22 — one by one, a little faster each time
    if (t < T.K250) { const D = T.K250 - T.A; return herm((t - T.A) / D, 6, 250, 4.87 * D, 250 * D); }   // … to 998 (the 250th)
    if (t < T.K507) { const D = T.K507 - T.K250; return herm((t - T.K250) / D, 250, 507, 250 * D, 450 * D); }   // … to 2026 (the 507th)
    const s = t - T.K507; return 507 + 450 * s + 300 * s * s + 40 * s * s * s;                       // and on, faster and faster
  };
  if (Math.abs(K(T.A - 1e-9) - 6) > 0.01 || Math.abs(K(T.K250 - 1e-9) - 250) > 0.01 || Math.abs(K(T.K507 - 1e-9) - 507) > 0.01) console.error('d2_dark: K() misses its anchors');
  for (let t = T.RUN; t < 33; t += 0.01) if (K(t + 0.01) < K(t)) { console.error('d2_dark: K() goes down at', t); break; }
  // when brick k is fully out (K = k + 1): bisection, for the puffs and the taps of the first few
  const outAt = k => { let a = T.RUN, b = 40; for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (K(m) < k + 1) a = m; else b = m; } return b; };
  const OUT5 = [0, 1, 2, 3, 4, 5].map(outAt);

  /* ---------------- the 余 2 lane and its bricks ---------------- */
  const LN = { x: 150, y: 380, H: 100, head: 80 }, CW = 132, BX0 = LN.x + LN.head, BY = LN.y + LN.H / 2, BS = 1.25, FRONT = 5;
  const soft = s => 0.5 * (s + Math.sqrt(s * s + 0.5));
  const runOff = t => soft(K(t) - FRONT) - soft(-FRONT);     // cells scrolled: the front of the dark part stays near slot 5
  const OFF = t => {
    if (t < T.REW) return runOff(t);
    return runOff(T.REW) * (1 - EASE.io(clamp((t - T.REW) / T.REW_D)));
  };
  const vel = t => (OFF(t + 0.02) - OFF(t)) / 0.02;            // cells per second (negative while rewinding)
  const blurAt = t => clamp((Math.abs(vel(t)) - 10) / 20);
  const brickX = (k, off) => BX0 + CW * (k + 0.5 - off);

  const lane = { type: 'n2_lanes', id: 'd2ln', x: LN.x, y: LN.y - 2 * (LN.H + 16), W: 1520, H: LN.H, gap: 16, head: LN.head, lanes: [2], labelSize: 44, t0: T.LANE, t1: T.TAPE_OUT };
  const tape = {
    type: 'n2_fn', id: 'd2tp', t0: T.BRICKS,
    cues: [[T.BRICKS, 'pop'], ...OUT5.slice(0, 5).map(x => [x - 0.05, 'tap']), [T.A + 0.3, 'whoosh'], [T.REW, 'swish'], [T.REW + 0.2, 'whoosh']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.TAPE_OUT) / 0.35); if (op <= 0) return;
      const off = OFF(t), b = blurAt(t), Kt = K(t), n0 = DL.items.length;
      // crisp bricks (they fade into the blur as the tape speeds up, and back out of it when the rewind stops)
      if (b < 1) {
        const kmin = Math.max(0, Math.floor(off) - 1), kmax = Math.floor(off + (1640 - BX0) / CW) + 1;
        for (let j = kmin; j <= kmax; j++) {
          const cx = brickX(j, off); if (cx < BX0 + 20 || cx > 1680) continue;
          const sc = EASE.back(clamp((t - T.BRICKS - j * 0.06) / 0.25)); if (sc <= 0.01) continue;
          const fadeL = clamp((cx - BX0 - 20) / 46);
          N2.brick(`${k}.b${j}`, cx, BY, 4 * j + 2, 2, { scale: BS * sc, dim: clamp((Kt - j - 0.5) * 2), opacity: (1 - b) * fadeL });
        }
        // the first few going out: a little grey puff rises from each
        OUT5.slice(0, 5).forEach((to, j) => {
          const u = (t - to) / 0.7; if (u < 0 || u >= 1 || t >= T.REW) return;
          const cx = brickX(j, off), y = BY - 50 - 34 * u;
          stroke(`${k}.pf${j}`, [[cx - 10, y + 10], [cx - 2, y], [cx + 6, y + 6], [cx + 12, y - 6]], { z: Z.fx, w: 3, color: C.pencil, opacity: (1 - u) * (1 - b) });
        });
      }
      // the blur: streaks racing along the lane — grey behind the front, ink ahead of it
      if (b > 0) {
        const dir = vel(t) >= 0 ? 1 : -1, front = BX0 + CW * (Kt - off);
        for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
          const y = LN.y + 18 + i * 16, len = 120 + 70 * ((i * 7 + j * 3) % 4);
          const xx = BX0 + 14 + ((((i * 263 + j * 377 - dir * t * 2900) % 1420) + 1420) % 1420);
          const x1 = Math.min(1600, xx + len); if (x1 - xx < 8) continue;
          stroke(`${k}.st${i}_${j}`, [[xx, y], [x1, y]], { z: Z.set + 1, w: 3.5, color: xx > front ? C.ink : C.pencil, opacity: b * 0.85, boil: 0.6 });
        }
        for (let i = 0; i < 4; i++) {   // speed lines just outside the lane
          const y = i < 2 ? LN.y - 12 - i * 9 : LN.y + LN.H + 12 + (i - 2) * 9, xx = BX0 + ((((i * 397 - dir * t * 2200) % 1300) + 1300) % 1300);
          stroke(`${k}.sp${i}`, [[xx, y], [Math.min(1600, xx + 200), y]], { z: Z.set, w: 2.6, color: C.pencil, opacity: 0.8 * b, boil: 0.6 });
        }
      }
      N2.fadeFrom(n0, op);
    },
  };

  /* ---------------- the counter (right, below the lane): it never stops on a number ---------------- */
  const CB = [1060, 520, 1540, 600];
  const T1 = outAt(0);
  const counter = {
    type: 'n2_grp', id: 'd2ctG', out: T.CNT_OUT, dur: 0.4,
    inner: { type: 'n2_fn', id: 'd2ct', t0: T1, cues: [[T1, 'pop'], [T.K250, 'plip'], [T.K507, 'plip'], [T.NOTE, 'pen']], fn: (t, lt, k) => {
      const p = EASE.out(clamp(lt / 0.3));
      stroke(k + '.box', N2.box(...CB), { z: Z.annot - 1, w: 4, fill: '#FFFFFF', draw: p });
      const n = Math.max(1, Math.floor(K(t) + 1e-9)), cy = (CB[1] + CB[3]) / 2;
      text(k + '.l', '熄灭：', CB[0] + 24, cy, { size: 52, z: Z.annot, anchor: 'start', opacity: p });
      text(k + '.n', String(n), CB[0] + 24 + textWidth('熄灭：', 52), cy + 2, { size: 64, z: Z.annot, anchor: 'start', font: CFG.FONT_MIX, opacity: p });
      const pop = (key, s, y, t0) => { if (t < t0) return; const u = clamp((t - t0) / 0.25); text(key, s, CB[0] + 24, y, { size: 40, color: C.red, z: Z.annot, anchor: 'start', opacity: clamp(u * 3), scale: lerp(1.4, 1, EASE.back(u)) }); };
      pop(k + '.g1', '250（到 998）', 640, T.K250);
      pop(k + '.g2', '507（到 2026）', 692, T.K507);
      if (t >= T.NOTE) {
        const s = '……没有尽头：数不完，也不用数', m = Math.min(s.length, Math.floor((t - T.NOTE) * 11) + 1);
        text(k + '.nt', s.slice(0, m), CB[2], 752, { size: 36, color: C.red, z: Z.annot, anchor: 'end' });
      }
    } },
  };

  /* ---------------- 第 1 集的电脑纸带（缩影）：经过 1000 时闪一下；"上集电脑查到 1000"时晃一下、冒汗 ---------------- */
  const MPC = { x0: 548, x1: 688, y0: 204, y1: 318 }, MCW = 72, MT = [214, 262, 310];
  const mini = {
    type: 'n2_fn', id: 'd2mn', t0: T.K250, cues: [[T.K250, 'ding'], [T.MINI_PULSE, 'boop']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.MINI_OUT) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length, c = [470, 262];
      const pv = (t - T.MINI_PULSE) / 0.5, pulse = pv > 0 && pv < 1 ? 1 + 0.12 * Math.sin(Math.PI * pv) : 1;
      DL.save(); DL.translate(c[0], c[1]); DL.scale(Math.max(0.01, EASE.back(clamp(lt / 0.3))) * pulse); DL.translate(-c[0], -c[1]);
      const { x0, x1, y0, y1 } = MPC, z = Z.board;
      stroke(k + '.box', N2.box(x0, y0, x1, y1), { z, w: 4.5, fill: C.paper });
      stroke(k + '.scr', superPts((x0 + x1) / 2, 256, 108, 74, 24, 7), { z: z + 0.1, w: 3, closed: true, fill: C.paper });
      text(k + '.cnt', '1000', (x0 + x1) / 2, 254, { size: 46, font: CFG.FONT_MONO, z: z + 0.3 });
      stroke(k + '.slot', [[x0 + 2, 220], [x0 + 2, 304]], { z: z + 0.1, w: 6 });
      [[x0 + 40, x0 + 30], [x1 - 40, x1 - 30]].forEach(([a, bb], i) => stroke(`${k}.lg${i}`, [[a, y1], [bb, y1 + 26], [bb + (i ? 14 : -14), y1 + 26]], { z, w: 4 }));
      const xl = x0 - 6 - MCW * 4;
      MT.forEach((y, i) => stroke(`${k}.h${i}`, [[xl, y], [x0, y, 1]], { z, w: i === 1 ? 2.5 : 3.5 }));
      [997, 998, 999, 1000].forEach((n, i) => {
        const x = x0 - 6 - MCW * (3 - i + 0.5);
        stroke(`${k}.v${i}`, [[x - MCW / 2, MT[0]], [x - MCW / 2, MT[2]]], { z, w: 3 });
        text(`${k}.n${i}`, String(n), x, (MT[0] + MT[1]) / 2 + 1, { size: 40, font: CFG.FONT_MONO, z: z + 0.1 });
        if (n % 4 === 2) { const P = [[x - 18, MT[1] + 8], [x + 18, MT[1] + 8], [x + 18, MT[2] - 8], [x - 18, MT[2] - 8]]; P.forEach((a, j) => N2.dash(`${k}.bl${j}`, a, P[(j + 1) % 4], { step: 11, on: 6, w: 2.4 })); }
        else text(`${k}.tk${i}`, '✓', x, (MT[1] + MT[2]) / 2, { size: 40, color: C.red, z: Z.annot - 1, font: CFG.FONT_MIX });
      });
      text(k + '.lab', '上集', xl - 52, 238, { size: 40, color: C.red, z: Z.annot, rot: -6 });
      // the flash: a red ring round the whole thing, once
      const fu = clamp(lt / 0.25) * (1 - clamp((lt - 0.7) / 0.3));
      if (fu > 0) stroke(k + '.fl', ringPts(k + '.flp', 455, 266, 290, 92, { n: 18 }), { z: Z.annot, w: 5, color: C.red, closed: true, opacity: fu });
      // L4 (上集电脑查到 1000，还查不完): it sweats
      if (t > T.MINI_PULSE) for (let i = 0; i < 6; i++) {
        const td = t - (T.MINI_PULSE + 0.1 + i * 0.45); if (td < 0 || td > 0.6) continue;
        const u = td / 0.6, side = i % 2 ? 1 : -1, bx = side > 0 ? x1 + 14 : x0 - 14, by = y0 + 4 + u * 40;
        stroke(`${k}.sw${i % 3}`, [[bx, by - 12], [bx - 6, by + 2], [bx, by + 8], [bx + 6, by + 2], [bx, by - 12, 1]], { z: Z.fx, w: 3, opacity: 1 - u * 0.8 });
      }
      DL.restore();
      N2.fadeFrom(n0, op);
    },
  };

  /* ---------------- 第 1 集表上的"猜想（还没证明）"标签：飞回来贴在 2 上方，撕下换成"证明了 ✓"；旁边钉范围卡 ---------------- */
  const B0X = brickX(0, 0);
  const tag = { type: 'n2_tag', id: 'd2tag', text: '猜想（还没证明）', size: 50, rot: -3, t0: T.TAG, pos: [[0, [-260, 150]], [T.TAG, [B0X, 326], 0.5, 'out']], swap: T.SWAP, t1: T.TAPE_OUT };
  const SCOPE2 = { at: [790, 305], w: 446, h: 110 };
  const scope2 = { type: 'n2_grp', id: 'd2scG', out: T.CLR2, inner: { type: 'prop', kind: 'n1_card', id: 'd2sc', at: SCOPE2.at, w: SCOPE2.w, h: SCOPE2.h, size: 36, lines: ['两个数从 0、1、2……里挑'], t0: T.CARD, sfxAt: [[T.CARD, 'paper']] } };

  /* ---------------- 2026：从议程条飞回来，翻面"✗ 没有小拐角" ---------------- */
  const AG2 = N2.HUD_GEO.ag(2), B26 = [1182, 300], BCTRL = [700, 175];   // under the HUD cards, over the scope card
  const b26At = t => { const u = EASE.io(clamp((t - T.B26) / 0.6)); return [(1 - u) * (1 - u) * AG2[0] + 2 * (1 - u) * u * BCTRL[0] + u * u * B26[0], (1 - u) * (1 - u) * AG2[1] + 2 * (1 - u) * u * BCTRL[1] + u * u * B26[1]]; };
  const brick26 = {
    type: 'n2_fn', id: 'd2b26', t0: T.B26, cues: [[T.B26, 'whoosh'], [T.B26 + 0.6, 'tap'], [T.FLIP, 'swish'], [T.FLIP + 0.18, 'pen']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.CLR2) / 0.35); if (op <= 0) return;
      const n0 = DL.items.length, [x, y] = b26At(t), sc = lerp(0.5, 1.4, EASE.out(clamp(lt / 0.6))), f = (t - T.FLIP) / 0.3;
      const front = 1 - clamp(f * 2), back = clamp(f * 2 - 1);
      if (front > 0.01) { DL.save(); DL.translate(x, y); DL.scale(front, 1); N2.brick(k + '.f', 0, 0, 2026, 2, { scale: sc, opacity: clamp(lt * 5), z: Z.annot + 2 }); DL.restore(); }
      if (back > 0.01) {
        DL.save(); DL.translate(x, y); DL.scale(back, 1);
        stroke(k + '.bk', N2.box(-150, -65, 150, 65), { z: Z.annot + 2, w: 4, fill: '#FFFFFF' });
        text(k + '.n', '2026', 0, -30, { size: 40, z: Z.annot + 2.2, font: CFG.FONT_MIX });
        text(k + '.x', '✗', -112, 30, { size: 50, color: C.red, z: Z.annot + 2.2, font: CFG.FONT_MIX });
        text(k + '.t', '没有小拐角', 22, 30, { size: 40, z: Z.annot + 2.2 });
        DL.restore();
      }
      N2.fadeFrom(n0, op);
    },
  };

  /* ---------------- "还没找到 / 根本没有"两格（缩小）：红章盖"根本没有"，锁牌亮一下 ---------------- */
  const PS = 0.58, PX = 188, PY = 388;
  const panels = { type: 'n2_panels', id: 'd2pn', t0: T.PANELS, xf: [[0, [PX, PY, PS]]], stamp: T.STAMP, lock: T.LOCK, lockOut: T.LOCK_OUT, lockAt: [1520, 260], lockAbs: 0.9, t1: T.CLR2 };

  /* ---------------- 引用②：倒扣的杯子、变色龙 → "不变的东西" ---------------- */
  const CUPX = [200, 290, 380, 470, 560], CUPY = 450, FLIPC = [1, 3, 0, 1, 4];
  const cups = {
    type: 'n2_fn', id: 'd2cup', t0: T.CUPS, cues: [[T.CUPS, 'pen'], ...T.FLIPS.map(x => [x, 'boop'])],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.ICONS_OUT) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length;
      CUPX.forEach((cx, i) => {
        const p = EASE.out(clamp((lt - i * 0.12) / 0.35)); if (p <= 0) return;
        // how many times this cup has flipped, and the flip in progress
        let flips = 0, rot = 0, hop = 0;
        T.FLIPS.forEach((ft, j) => { if (FLIPC[j] !== i || t < ft) return; const u = clamp((t - ft) / 0.4); if (u >= 1) flips++; else { rot = 180 * EASE.io(u); hop = -34 * Math.sin(Math.PI * u); } });
        DL.save(); DL.translate(cx, CUPY + hop); DL.rotate(flips % 2 ? 180 + rot : rot);
        // mouth down: wide rim at the bottom, narrow base on top
        stroke(`${k}.c${i}`, [[-34, 40], [-22, -38, 1], [22, -38, 1], [34, 40, 1]], { z: Z.board, w: 4.5, fill: C.paper, draw: p });
        stroke(`${k}.r${i}`, [[-38, 40], [38, 40]], { z: Z.board + 0.1, w: 4.5, draw: p });
        stroke(`${k}.ft${i}`, [[-16, -38], [-14, -48, 1], [14, -48, 1], [16, -38, 1]], { z: Z.board + 0.1, w: 3.5, draw: p });
        DL.restore();
      });
      stroke(k + '.tb', [[150, CUPY + 46], [612, CUPY + 47]], { z: Z.set, w: 3, color: C.pencil, draw: EASE.out(clamp(lt / 0.5)) });
      N2.fadeFrom(n0, op);
    },
  };
  const CH = [880, 440];
  const chameleon = {
    type: 'n2_fn', id: 'd2ch', t0: T.CHAM, cues: [[T.CHAM, 'pen'], [T.CHAM + 1.2, 'plip'], [T.CHAM + 2.4, 'plip']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.ICONS_OUT) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length, p = EASE.out(clamp(lt / 0.5)), [cx, cy] = CH, z = Z.board;
      // it changes colour: plain → pencil-grey wash → plain … (no pattern: the four patterns only mean 余几)
      const shade = lt > 1.2 && Math.floor((lt - 1.2) / 1.2) % 2 === 0 ? clamp(((lt - 1.2) % 1.2) / 0.25) : 0;
      stroke(k + '.br', [[cx - 150, cy + 58], [cx + 150, cy + 54]], { z: z - 0.5, w: 5, draw: p });   // the branch
      const body = ringPts(k + '.bdp', cx, cy, 92, 44, { n: 16, closed: true }), head = [[cx + 70, cy - 30], [cx + 132, cy - 6, 1], [cx + 80, cy + 26, 1]];
      if (shade > 0 && p >= 1) {
        stroke(k + '.sb', body, { z: z + 0.05, closed: true, fill: C.pencil, noStroke: true, w: 1, opacity: 0.45 * shade });
        stroke(k + '.sh', [...head, [cx + 70, cy - 30, 1]], { z: z + 0.15, fill: C.pencil, noStroke: true, w: 1, opacity: 0.45 * shade });
      }
      stroke(k + '.bd', body, { z, w: 4.5, closed: true, fill: C.paper, draw: p });
      stroke(k + '.hd', head, { z: z + 0.1, w: 4.5, fill: C.paper, draw: p });
      stroke(k + '.ey', ringPts(k + '.eyp', cx + 92, cy - 10, 13, 13, { n: 10, closed: true }), { z: z + 0.2, w: 3.5, closed: true, fill: C.paper, draw: p });
      if (p > 0.6) dot(k + '.pu', [cx + 95 + 3 * Math.sin(lt * 2), cy - 10], 4.5, C.ink, z + 0.3);
      // the tail curls down into a spiral behind the body
      const tail = [], sc = [cx - 128, cy + 14]; for (let i = 0; i <= 16; i++) { const a = -0.3 + i * 0.42, r = 40 * (1 - i / 20); tail.push([sc[0] + r * Math.cos(a), sc[1] + r * Math.sin(a)]); }
      stroke(k + '.tl', [[cx - 88, cy + 4], ...tail], { z, w: 4.5, draw: p });
      [[-40, 1], [30, 1]].forEach(([dx], i) => stroke(`${k}.lg${i}`, [[cx + dx, cy + 36], [cx + dx - 8, cy + 56], [cx + dx + 6, cy + 58]], { z: z + 0.1, w: 4, draw: p }));
      N2.fadeFrom(n0, op);
    },
  };
  const BOXC = [1320, 440], BOXW = 320, BOXH = 110;
  const keepBox = {
    type: 'n2_fn', id: 'd2kb', t0: T.BOXT, cues: [[T.BOXT, 'pop'], ...T.ARR.map(x => [x, 'pen']), [T.REMARR, 'pen']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.END) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length, p = EASE.out(clamp(lt / 0.35)), [cx, cy] = BOXC;
      stroke(k + '.b', N2.box(cx - BOXW / 2, cy - BOXH / 2, cx + BOXW / 2, cy + BOXH / 2), { z: Z.annot - 1, w: 4.5, fill: '#FFFFFF', draw: p });
      text(k + '.t', '不变的东西', cx, cy + 2, { size: 52, z: Z.annot, opacity: clamp(p * 2 - 0.6) });
      // arrows from the cups and from the chameleon (they fade with the icons), later one from the 零头
      const ao = 1 - clamp((t - T.ICONS_OUT) / 0.4);
      if (ao > 0) {
        const m0 = DL.items.length;
        arrow(k + '.a0', [400, 528], [cx - 60, cy + BOXH / 2 + 12], { p: EASE.out(clamp((t - T.ARR[0]) / 0.4)), bend: 0.22, color: C.red, w: 4 });
        arrow(k + '.a1', [CH[0] + 150, CH[1] - 6], [cx - BOXW / 2 - 14, cy - 4], { p: EASE.out(clamp((t - T.ARR[1]) / 0.35)), bend: 0.1, color: C.red, w: 4 });
        N2.fadeFrom(m0, ao);
      }
      if (t >= T.REMARR) arrow(k + '.a2', [REMX[1] + 40, GY], [cx - BOXW / 2 - 14, cy + 8], { p: EASE.out(clamp((t - T.REMARR) / 0.35)), bend: -0.12, color: C.red, w: 4 });
      N2.fadeFrom(n0, op);
    },
  };

  /* ---------------- 卡①：整组（红方框，4 个点）进进出出，零头两个点垫黄、不动 ---------------- */
  const GX = [250, 350, 450, 550], GY = 470, REMX = [690, 740], DIVX = 630;
  // each slot: list of [t, in(1)/out(0)] events; slot 1, 2, 3 are there from the start
  const GEV = { 0: [[T.GIN1, 1], [T.GOUT, 0]], 1: [[T.GRP, 1]], 2: [[T.GRP + 0.12, 1], [T.GOUT, 0], [T.GIN2, 1]], 3: [[T.GRP + 0.24, 1]] };
  const groups = {
    type: 'n2_fn', id: 'd2gr', t0: T.GRP, cues: [[T.GRP, 'pop'], [T.REMHI, 'swish'], [T.GIN1, 'whoosh'], [T.GOUT, 'whoosh'], [T.GIN2, 'whoosh'], [T.REMPULSE, 'boop']],
    fn: (t, lt, k) => {
      const op = 1 - clamp((t - T.END) / 0.4); if (op <= 0) return;
      const n0 = DL.items.length, a = EASE.out(clamp(lt / 0.3));
      text(k + '.hg', '组', (GX[0] + GX[3]) / 2, GY - 112, { size: 44, z: Z.annot, opacity: a });
      text(k + '.hr', '零头', (REMX[0] + REMX[1]) / 2, GY - 112, { size: 44, z: Z.annot, opacity: a });
      stroke(k + '.dv', [[DIVX, GY - 140], [DIVX, GY + 80]], { z: Z.set, w: 3, color: C.pencil, draw: a });
      for (let s = 0; s < 4; s++) {
        // state of slot s at t: present, or flying in from above / out upwards
        let y = null, o = 0;
        for (const [et, inn] of GEV[s]) {
          if (t < et) break;
          const u = clamp((t - et) / 0.45);
          if (inn) { o = clamp(u * 2.5); y = GY - 190 * (1 - EASE.out(u)); if (et <= T.GRP + 0.3) { y = GY; o = clamp(u * 3); } }
          else { o = 1 - clamp(u * 1.4); y = GY - 190 * EASE.in(u); }
        }
        if (y === null || o <= 0.01) continue;
        const m0 = DL.items.length, x = GX[s];
        stroke(`${k}.g${s}`, superPts(x, y, 84, 84, 22, 6), { z: Z.annot - 1, w: 4.5, color: C.red, closed: true });
        [[-15, -15], [15, -15], [-15, 15], [15, 15]].forEach(([dx, dy], j) => dot(`${k}.d${s}_${j}`, [x + dx, y + dy], 9, C.ink, Z.front));
        N2.fadeFrom(m0, o);
      }
      // the 零头: two dots on a yellow highlighter, never moving
      const hu = EASE.out(clamp((t - T.REMHI) / 0.35));
      if (hu > 0) stroke(k + '.hi', [[REMX[0] - 30, GY], [REMX[0] - 30 + (REMX[1] - REMX[0] + 60) * hu, GY]], { z: Z.hi, w: 50, color: C.hi, opacity: 0.85 });
      const pv = (t - T.REMPULSE) / 0.5, pr = pv > 0 && pv < 1 ? 1 + 0.25 * Math.sin(Math.PI * pv) : 1;
      REMX.forEach((x, j) => dot(`${k}.r${j}`, [x, GY], 10 * a * pr, C.ink, Z.front));
      N2.fadeFrom(n0, op);
    },
  };

  /* ---------------- the stack: a red pointer runs down it; extra rings round the □ that are not at the start of their line ---------------- */
  const SX = N2.STACK_X, SY = i => N2.STACK_Y + i * N2.STACK_LH, SCAN_DT = 0.17;
  // (measured: in the stack's 34-px FONT_MIX a CJK char is ≈ 0.95 em, a Latin letter or sign ≈ 0.36 em, a space ≈ 0.22 em)
  const boxAt = i => { const s = N2.STACK[i].replace(/6/g, '□'), j = s.indexOf('□'); let w = 0; for (const ch of s.slice(0, j)) w += 34 * (ch.charCodeAt(0) > 0x2E80 ? 0.95 : ch === ' ' ? 0.22 : 0.36); return SX + w + 12; };
  const scan = {
    type: 'n2_fn', id: 'd2scan', t0: T.SCAN, cues: N2.STACK.map((_, i) => [T.SCAN + i * SCAN_DT, 'tap']),
    fn: (t, lt, k) => {
      const o = 1 - clamp((t - (T.SCAN + 8 * SCAN_DT)) / 0.25);
      if (o > 0) {
        const i = Math.min(7, Math.floor(lt / SCAN_DT)), y = SY(i);
        stroke(k + '.p', [[SX - 76, y - 13], [SX - 44, y, 1], [SX - 76, y + 13, 1], [SX - 76, y - 13, 1]], { z: Z.annot, w: 3, color: C.red, fill: C.red, opacity: o });
      }
      [].forEach(i => {   // (n2_stack now rings each □ where it is; the extra rings are no longer needed)
        const u = clamp((t - T.BOX) / 0.3), v = 1 - clamp((t - T.BOX - 1.0) / 0.4); if (u <= 0 || v <= 0) return;
        stroke(`${k}.r${i}`, ringPts(`${k}.rp${i}`, boxAt(i), SY(i), 24, 24, { n: 10 }), { z: Z.annot, w: 3.5, color: C.red, closed: true, draw: u, opacity: v });
      });
    },
  };

  /* ---------------- 小问号 ---------------- */
  const qm = {
    type: 'n2_grp', id: 'd2qmG', out: T.QOUT, dur: 0.35,
    inner: {
      type: 'qm', id: 'd2qm', size: 150, t0: T.QM, burst: true, pos: [[0, [620, FL]]], signSize: 56,
      mood: [[0, 'neutral'], [T.QSIGN, 'doubt'], [T.QDOWN, 'neutral'], [T.BOX, 'surprised'], [T.QHAPPY, 'happy']],
      act: [[0, 'idle'], [T.QSIGN, 'tap'], [T.QDOWN, 'idle'], [T.QHAPPY, 'nod'], [T.QHAPPY + 1.0, 'idle']],
      sign: [[0, null], [T.QSIGN, '只有 6？'], [T.QDOWN, null]],
      gaze: [[0, [1350, 450]], [T.QSIGN, 'viewer'], [T.QDOWN, [1300, 400]], [T.SCAN + 1.3, [1300, 700]], [T.GLOW, [1310, 690]], [T.OK, [1100, 540]], [T.QHAPPY, 'viewer']],
    },
  };

  /* ---------------- Jasper ---------------- */
  Object.assign(POSE, {
    d2_ptUL: { lean: -2, tilt: -6, armScale: 1.6, armL: [120, 25], armR: [16, 10] },   // left arm up and out (clear of his face): pointing at the 2026 card
  });
  const KX = 1400;

  defineScene({
    id: 'dark', chapter: '整条熄灭', dur: T.DUR, floor: FL,
    cast: { kid: N2.kid },
    tracks: {
      kid: {
        enter: T.KID,
        pos: [[0, [KX, FL]], [T.WALK, [1760, FL], 1.0, 'lin']],
        pose: [[0, 'stand'], [T.B26 - 0.1, 'd2_ptUL', 0.15, 'back'], [T.FLIP + 0.5, 'stand', 0.15], [T.STAMP, 'kidCheer', 0.12, 'back'], [T.STAMP + 0.9, 'stand', 0.15],
          [T.WALK, makeWalk(T.WALK, T.WALK + 1.0, 5.2)]],
        face: [[0, 'smile'], [T.B26, 'grin', 0.08], [T.FLIP, 'idea', 0.06], [T.FLIP + 0.6, 'proudGrin', 0.1], [T.STAMP, 'joy', 0.06], [T.STAMP + 1.0, 'smile', 0.1]],
        turn: [[0, -0.3], [T.PANELS, -0.45, 0.15], [T.WALK, 0.4, 0.15]],
        gaze: [[0, 'b26'], [T.PANELS, 'pnR'], [T.STAMP + 0.9, 'viewer'], [T.WALK, [1700, 640]]],
        squash: [[0, 1], [T.STAMP, 1.06, 0.05], [T.STAMP + 0.05, 1, 0.2, 'back']],
      },
    },
    targets: F => ({ b26: b26At(F.t), pnR: [PX + 950 * PS, PY + 431 * PS] }),
    steps: [{ t0: T.WALK, t1: T.WALK + 1.0, hz: 5.2 }],
    fx: [
      { type: 'n2_hud', id: 'hud', at: 'dark', tick: [[T.STAMP, 2]], flash: [[T.FLASH1, 1]] },
      { type: 'n2_stack', id: 'stack', from: 8, all: -9, stamp: -9, box: T.BOX, glow: T.GLOW, ok: T.OK, t1: T.CLR1 },
      { type: 'n2_grp', id: 'scopeG', out: T.CLR1, dur: 0.4, inner: { type: 'prop', kind: 'n1_card', id: 'scope', at: N2.STACK_CARD.at, w: N2.STACK_CARD.w, h: N2.STACK_CARD.h, size: N2.STACK_CARD.size, lines: N2.STACK_CARD.lines, t0: -1 } },
      scan, qm,
      lane, tape, counter, mini,
      tag, scope2, brick26, panels,
      cups, chameleon, keepBox, groups,
    ],
    subs: [
      {"t0": 0.8, "t1": 3.25, "text": "“只有6不行吗？”", "voice": "qm", "say": "只有六不行吗？"},
      {"t0": 3.5, "t1": 7.59, "text": "用到了6的什么？只用到“6余2”。", "say": "用到了六的什么？只用到“六余二”。"},
      {"t0": 7.79, "t1": 12.7, "text": "所以换成任何余2的数都一样：整条熄灭。", "say": "所以换成任何余二的数，都一样：整条熄灭。"},
      {"t0": 19.8, "t1": 23.34, "text": "上集电脑查到1000，还查不完；", "say": "上集电脑查到一千，还查不完；"},
      {"t0": 23.54, "t1": 28.18, "text": "这回一个理由，管住了这条跑道上的每一个。"},
      {"t0": 28.58, "t1": 33.58, "text": "“2026余2，不用试：没有小拐角！”", "voice": "kid", "say": "两千零二十六余二，不用试：没有小拐角！"},
      {"t0": 34.18, "t1": 38.64, "text": "你看过的另一场演讲里，漫士讲了翻杯子、"},
      {"t0": 38.84, "t1": 43.48, "text": "变色龙这类游戏：去找怎么变都不变的东西。"},
      {"t0": 43.83, "t1": 48.52, "text": "我们找到的，是零头：整组进出，它不变。"},
    ],
  });
})();
