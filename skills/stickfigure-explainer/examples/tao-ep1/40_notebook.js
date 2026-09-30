// 小问号登场（一）：下课后翻开作业本。大哥哥一步一步写清楚；小陶只写了一个答案。
// 小问号第一次从本子里跳出来，举牌问“为什么是 7？”。（据 Clements 1984 的观察改编，非真实事件）
// Shared with 44_notebook2.js through window.q1Book: the notebook spread, its writing and COMP.q1_qm.
(() => {
  const FL = 780;
  const NB = { x0: 100, x1: 1300, sp: 700, top: 150, bot: 760, E: 58 };
  const RULES = [248, 320, 392, 464, 536, 608, 680];

  /* ---------------- the open notebook spread ---------------- */
  // o: { ear: 0..1 dog-ear lift, head: 0..1 page-name opacity, wig: dog-ear shake 0..1 }
  function drawBook(p, o = {}) {
    const { x0, x1, sp, top, bot, E } = NB, z = Z.set;
    const st = i => stag(p, i, 5);
    // back cover peeking out around the pages
    stroke('q1b.cover', [[sp, top + 6], [sp - 90, top - 10], [x0 - 16, top - 12, 1], [x0 - 16, bot + 22, 1], [sp - 90, bot + 24], [sp, bot + 30], [sp + 90, bot + 24], [x1 + 16, bot + 22, 1], [x1 + 16, top - 12, 1], [sp + 90, top - 10], [sp, top + 6]],
      { z, w: 5, fill: C.paper, draw: st(0) });
    // page stack (thickness) under the bottom edges
    [-1, 1].forEach(s => {
      const xo = s < 0 ? x0 : x1;
      [7, 14].forEach((d, j) => stroke(`q1b.stk${s}${j}`, [[sp, bot + 14 + d], [sp + s * 90, bot + 4 + d], [xo - s * (4 + j * 4), bot + d]], { z: z + 0.2, w: 2.4, draw: st(1) }));
    });
    // the two pages (right page has a dog-eared corner)
    const L = [[sp, top + 16], [sp - 90, top + 1], [x0, top, 1], [x0, bot, 1], [sp - 90, bot + 4], [sp, bot + 14]];
    const R = [[sp, top + 16], [sp + 90, top + 1], [x1, top, 1], [x1, bot - E, 1], [x1 - E, bot, 1], [sp + 90, bot + 4], [sp, bot + 14]];
    stroke('q1b.pL', L, { z: z + 0.5, w: 5, fill: C.paper, draw: st(1) });
    stroke('q1b.pR', R, { z: z + 0.5, w: 5, fill: C.paper, draw: st(1) });
    // spine: a crease and two soft pencil shade lines
    stroke('q1b.spine', [[sp, top + 16], [sp + 1, (top + bot) / 2], [sp, bot + 14]], { z: z + 1, w: 4, draw: st(2) });
    [-12, 12].forEach((d, j) => stroke('q1b.sh' + j, [[sp + d, top + 24], [sp + d * 1.1, bot + 6]], { z: z + 1, w: 2, color: C.pencil, opacity: 0.6, draw: st(2) }));
    // ruled lines + margin lines (pencil)
    RULES.forEach((y, i) => {
      stroke('q1b.rl' + i, [[x0 + 26, y], [sp - 30, y + 1]], { z: z + 1, w: 2, color: C.pencil, opacity: 0.55, draw: st(3), boil: 0.4 });
      const xe = y > bot - E - 30 ? x1 - E - 40 : x1 - 26;
      stroke('q1b.rr' + i, [[sp + 30, y + 1], [xe, y]], { z: z + 1, w: 2, color: C.pencil, opacity: 0.55, draw: st(3), boil: 0.4 });
    });
    stroke('q1b.mL', [[x0 + 62, top + 22], [x0 + 62, bot - 18]], { z: z + 1, w: 2, color: C.pencil, opacity: 0.55, draw: st(3), boil: 0.4 });
    stroke('q1b.mR', [[sp + 64, top + 26], [sp + 64, bot - 14]], { z: z + 1, w: 2, color: C.pencil, opacity: 0.55, draw: st(3), boil: 0.4 });
    // dog-ear flap: folded flat at ear=0, stands up toward the corner as it lifts
    const ear = clamp(o.ear || 0), wig = o.wig || 0;
    const tip = lerp2([x1 - E + 4, bot - E + 4], [x1 - 6, bot - 6], ear * 0.8);
    const tipW = [tip[0] + wig * 7, tip[1] - wig * 5];
    stroke('q1b.ear', [[x1 - E, bot, 1], tipW, [x1, bot - E, 1], [x1 - E, bot, 1]], { z: z + 1.5, w: 4, fill: C.paper, draw: st(4) });
    if (Math.abs(wig) > 0.001) { // something is wriggling under the corner
      stroke('q1b.wg0', [[x1 + 16, bot - 76], [x1 + 30, bot - 88]], { z: Z.fx, w: 3.5, boil: 0.8 });
      stroke('q1b.wg1', [[x1 + 22, bot - 46], [x1 + 40, bot - 50]], { z: Z.fx, w: 3.5, boil: 0.8 });
      stroke('q1b.wg2', [[x1 - 84, bot + 30], [x1 - 96, bot + 44]], { z: Z.fx, w: 3.5, boil: 0.8 });
    }
    if (p > 0.9) stroke('q1b.earSh', [[x1 - E + 12, bot - 6], [tipW[0] + 6, tipW[1] + 12]], { z: z + 1.6, w: 2, color: C.pencil, opacity: 0.7, boil: 0.5 });
    // page owners (ink, small)
    const hp = o.head ?? 1;
    if (hp > 0) {
      text('q1b.nL', '姓名：大哥哥', x0 + 78, 198, { size: 32, anchor: 'start', z: z + 2, opacity: hp });
      text('q1b.nR', '姓名：小陶', sp + 80, 198, { size: 32, anchor: 'start', z: z + 2, opacity: hp });
    }
  }
  PROPS.q1_book = (fx, t, lt, p) => {
    const e = fx.ear ? evalTrack(fx.ear, t) : 0, wg = fx.wig ? fx.wig(t) : 0;
    drawBook(p, { ear: e, wig: wg, head: fx.headT === undefined ? 1 : clamp((t - fx.headT) / 0.3) });
  };
  /** the page being turned: sweeps from the right page over the spine to the left */
  PROPS.q1_flip = (fx, t, lt) => {
    const u = EASE.io(clamp(lt / 0.55)); if (u >= 1) return;
    const { sp, top, bot, x1 } = NB, w = x1 - sp;
    const ex = sp + Math.cos(Math.PI * u) * w, lift = Math.sin(Math.PI * u) * 46, mid = sp + (ex - sp) * 0.55;
    stroke('q1f.pg', [[sp, top + 16], [mid, top - lift * 0.9], [ex, top - lift, 1], [ex, bot - lift * 0.6, 1], [mid, bot + 4 - lift * 0.5], [sp, bot + 14]], { z: Z.set + 3, w: 5, fill: C.paper, closed: false });
    stroke('q1f.pgc', [[sp, bot + 14], [sp, top + 16]], { z: Z.set + 3, w: 4 });
  };
  /** Terry's doodle in the corner: a tiny rocket (it comes back in the next scene) */
  PROPS.q1_rocket = (fx, t, lt, p) => {
    const z = Z.board, st = i => stag(p, i, 4);
    DL.rotate(38);
    stroke('q1r.body', [[0, -44], [14, -22], [15, 20, 1], [-15, 20, 1], [-14, -22], [0, -44]], { z, w: 4, fill: C.paper, draw: st(0) });
    stroke('q1r.win', ringPts('q1r.win', 0, -12, 7, 7, { n: 8, closed: true }), { z, w: 3.2, closed: true, fill: C.paper, draw: st(1) });
    stroke('q1r.fL', [[-15, 4], [-27, 26, 1], [-15, 20]], { z, w: 3.6, draw: st(2) });
    stroke('q1r.fR', [[15, 4], [27, 26, 1], [15, 20]], { z, w: 3.6, draw: st(2) });
    stroke('q1r.fl', [[-8, 22], [-4, 40], [0, 30], [4, 44], [8, 22]], { z, w: 3.2, draw: st(3) });
  };

  /* ---------------- handwriting on the pages ---------------- */
  const SZ = 62, LX = 180;
  const probe = s => layoutWriting({ text: s, x: 0, y: 0, size: SZ, t0: 0, speed: 1 });
  const eqOf = s => probe(s).boxes.find(b => b.ch === '=').x;
  const E0 = eqOf('3x + 5 = 26');
  // equal signs aligned, baselines on the ruled lines
  const LINES = [['3x + 5 = 26', 320], ['3x = 21', 464], ['x = 7', 608]].map(([s, base], i) => ({ id: 'q1w' + i, text: s, x: LX + E0 - eqOf(s), y: base - SZ, size: SZ }));
  const NOTES = [{ id: 'q1n0', text: '-5', x: 598, y: 464 - 44, size: 44 }, { id: 'q1n1', text: '÷3', x: 598, y: 608 - 44, size: 44 }];
  const BIG = { id: 'q1big', text: 'x = 7', x: 790, y: 206, size: 150 };
  const ROCKET_AT = [1238, 250];

  /* ---------------- 小问号 (wrapper around the COMP.qm design) ----------------
     Same construction and proportions as COMP.qm, plus: gaze (face + pupils shift toward a target),
     act phases that start when the act starts, hop squash, foot-tap marks, sign pop-in,
     emerge burst, cheek blush when happy. */
  COMP.q1_qm = {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, pos = evalTrack(fx.pos, t), S = (fx.size || 200) / 200;
      const mood = stepTrack(fx.mood, t) || 'neutral';
      let act = 'idle', ta = 0; (fx.act || []).forEach(k => { if (k[0] <= t) { act = k[1]; ta = k[0]; } });
      let sign = null, sT = -99, prev; (fx.sign || []).forEach(k => { if (k[0] <= t) { if (k[1] !== prev) sT = k[0]; sign = k[1]; prev = k[1]; } });
      const at = t - ta;
      const pop = fx.t0 < 0 ? 1 : Math.max(0.01, EASE.back(clamp(lt / 0.3)));
      let hop = 0, tilt = fx.tilt ? evalTrack(fx.tilt, t) : 0, tap = 0, wave = 0, sq = 1, tapHit = -1;
      if (act === 'hop') { const s = Math.abs(Math.sin(at * (fx.hopHz || 2.2) * Math.PI)); hop = -s * 34; sq = 1 - 0.16 * Math.pow(1 - s, 10) + 0.05 * s; }
      if (act === 'nod') tilt += Math.sin(at * 2 * Math.PI * 1.8) * 8;
      if (act === 'shake') tilt += Math.sin(at * 2 * Math.PI * 3.2) * 11;
      if (act === 'tap') { const ph = (at * 2.6) % 1; tap = Math.max(0, Math.sin(ph * 2 * Math.PI)) * 13; tapHit = ph >= 0.5 ? ph - 0.5 : -1; }
      if (act === 'wave') wave = Math.sin(at * 2 * Math.PI * 2.2);
      const k = fx.id, z = fx.z ?? Z.front, col = C.red, w = 6.5;
      // gaze: shift the whole face a little toward the target
      const gz = stepTrack(fx.gaze, t) || 'viewer';
      const gp = Array.isArray(gz) ? gz : (gz !== 'viewer' ? F.targets[gz] : null);
      let lx = 0, ly = 0;
      if (gp) { const hx = pos[0], hy = pos[1] + hop - 160 * S, dx = gp[0] - hx, dy = gp[1] - hy, d = Math.hypot(dx, dy) || 1; lx = dx / d; ly = dy / d; }
      const fsx = lx * 9, fsy = ly * 5;
      // emerge burst (ink), outside the body scale
      if (fx.burst && fx.t0 >= 0 && lt < 0.5) {
        const u = EASE.out(clamp(lt / 0.5));
        DL.save(); DL.translate(pos[0], pos[1]); DL.scale(S);
        for (let i = 0; i < 7; i++) {
          const a = (-170 + i * 26.7) * RAD, r0 = 90 + 90 * u, r1 = r0 + 40 * (1 - u) + 12;
          stroke(k + '.burst' + i, [[Math.cos(a) * r0, -60 + Math.sin(a) * r0 * 0.9], [Math.cos(a) * r1, -60 + Math.sin(a) * r1 * 0.9]], { z: Z.fx, w: 4, opacity: 1 - u, boil: 0.6 });
        }
        DL.restore();
      }
      DL.save(); DL.translate(pos[0], pos[1] + hop); DL.scale(S * pop * (1 + (1 - sq) * 0.6), S * pop * sq);
      stroke(k + '.legL', [[0, -34], [-12, -12], [-26, 0]], { z, w, color: col });
      stroke(k + '.legR', [[0, -34], [14, -12 - tap * 0.4], [28, -tap]], { z, w, color: col });
      if (tapHit >= 0 && tapHit < 0.22) {
        const o = 1 - tapHit / 0.22;
        stroke(k + '.tk0', [[42, -6], [56, -14]], { z: Z.fx, w: 3.5, opacity: o });
        stroke(k + '.tk1', [[38, -20], [48, -32]], { z: Z.fx, w: 3.5, opacity: o });
      }
      DL.about(0, -40, () => DL.rotate(tilt));
      const hook = [[-56, -150], [-52, -180], [-28, -200], [6, -204], [42, -190], [58, -162], [50, -134], [26, -114], [6, -96], [0, -72], [0, -34]];
      stroke(k + '.fill', hook.slice(0, 8).concat([[-10, -120]]), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
      stroke(k + '.hook', hook, { z, w: w + 1.5, color: col });
      const waving = !sign && act === 'wave';
      const handL = [-40, -44 + wave * 4], handR = sign ? [66, -92] : (waving ? [100 + wave * 12, -156] : [38, -46]);
      stroke(k + '.armL', [[0, -70], [-22, -58], handL], { z, w: w - 1, color: col });
      stroke(k + '.armR', [[0, -70], waving ? [52, -90] : [30, -74], handR], { z, w: w - 1, color: col });
      if (waving) [0, 1].forEach(j => { // little wave arcs beside the hand (ink)
        const r = 22 + j * 14, c = [100, -150];
        stroke(k + '.wv' + j, [0, 1, 2, 3].map(i => { const a = (-60 + i * 30) * RAD; return [c[0] + Math.cos(a) * r + 8, c[1] + Math.sin(a) * r]; }), { z: Z.fx, w: 3, opacity: 0.75 - j * 0.25, boil: 0.8 });
      });
      // face
      const blink = ((t + (fx.blink ?? 0.7)) % 3.4) < 0.1;
      const eyeY = -162 + fsy, ex = 14;
      [-1, 1].forEach((s, i) => {
        const e = [s * ex + fsx, eyeY];
        if (mood === 'happy') stroke(k + '.e' + i, [[e[0] - 8, e[1] + 3], [e[0], e[1] - 6], [e[0] + 8, e[1] + 3]], { z, w: 4.5, color: col });
        else if (blink) stroke(k + '.e' + i, [[e[0] - 7, e[1]], [e[0] + 7, e[1]]], { z, w: 4, color: col });
        else dot(k + '.e' + i, [e[0] + lx * 1.5, e[1] + ly * 1.5], mood === 'surprised' ? 7.5 : 6, col, z);
      });
      if (mood === 'doubt') { stroke(k + '.brow', [[4 + fsx, eyeY - 22], [24 + fsx, eyeY - 16]], { z, w: 4, color: col }); stroke(k + '.brow2', [[-24 + fsx, eyeY - 14], [-6 + fsx, eyeY - 16]], { z, w: 4, color: col }); }
      if (mood === 'surprised') { stroke(k + '.brow', [[6 + fsx, eyeY - 20], [14 + fsx, eyeY - 25], [22 + fsx, eyeY - 20]], { z, w: 3.6, color: col }); stroke(k + '.brow2', [[-22 + fsx, eyeY - 20], [-14 + fsx, eyeY - 25], [-6 + fsx, eyeY - 20]], { z, w: 3.6, color: col }); }
      const my = -136 + fsy * 0.6, mx = fsx * 0.8;
      if (mood === 'happy') {
        stroke(k + '.m', [[mx - 12, my - 4], [mx, my + 6], [mx + 12, my - 4]], { z, w: 4.5, color: col });
        [-1, 1].forEach((s, i) => stroke(k + '.bl' + i, [[mx + s * 27 - 5, my - 4], [mx + s * 27 + 2, my - 10]], { z, w: 2.6, color: col, opacity: 0.8 }));
      } else if (mood === 'surprised') stroke(k + '.m', ringPts(k + '.m', mx, my, 6, 8, { n: 8, closed: true }), { z, w: 4, color: col, closed: true, fill: C.paper });
      else if (mood === 'doubt') stroke(k + '.m', [[mx - 12, my], [mx - 4, my - 4], [mx + 4, my + 2], [mx + 12, my - 2]], { z, w: 4, color: col });
      else stroke(k + '.m', [[mx - 9, my - 1], [mx + 9, my - 1]], { z, w: 4.5, color: col });
      // the sign, popping up on its stick
      if (sign) {
        const sp = EASE.back(clamp((t - sT) / 0.25));
        const size = fx.signSize || 40, tw = textWidth(sign, size) + 40, cx = 70, cy = -262 + (1 - sp) * 40;
        stroke(k + '.stick', [handR, [68, cy + 32]], { z, w: 5, color: col });
        DL.about(cx, cy + 32, () => DL.scale(lerp(0.5, 1, sp)));
        stroke(k + '.board', [[cx - tw / 2, cy - 34], [cx + tw / 2, cy - 34, 1], [cx + tw / 2, cy + 32, 1], [cx - tw / 2, cy + 32, 1], [cx - tw / 2, cy - 34, 1]], { z, w: 5, color: col, fill: C.paper });
        text(k + '.sign', sign, cx, cy, { size, color: col, z: z + 0.5 });
      }
      DL.restore();
      DL.save(); DL.translate(pos[0], pos[1] + hop); DL.scale(S * pop); DL.about(0, -40, () => DL.rotate(tilt));
      F.anchors[k] = { head: DL.tp([0, -160]), headTop: DL.tp([0, -214]), mouth: DL.tp([0, -136]), jaw: DL.tp([0, -110]), r: 58 * S * pop, handR: DL.tp(handR), handL: DL.tp(handL), sign: DL.tp([70, -300]) };
      DL.restore();
    },
    cues: fx => (fx.t0 >= 0 && !fx.silent ? [[fx.t0, 'boop']] : []).concat(fx.sfxAt || []),
  };
  SFX.define('q1_tap', tone => { tone('sine', 900, 520, 0.035, 0.12); });

  // shared with 44_notebook2.js
  window.q1Book = { NB, LINES, NOTES, BIG, ROCKET_AT, FL };

  /* ---------------- timing ---------------- */
  const chain = (specs, t0, speed, gapAfter, extra = {}) => {
    let t = t0;
    return specs.map(s => { const fx = layoutWriting({ ...s, t0: t, speed, gap: 0.03, glyphGap: 0.03, ...extra }); t = fx.tEnd + gapAfter; return { ...s, t0: fx.t0, tEnd: fx.tEnd }; });
  };
  const LW = chain(LINES, 4.75, 1250, 0.32);
  // step notes: '-5' right after line 1, '÷3' right after line 2
  const NW = [{ ...NOTES[0], t0: LW[0].tEnd + 0.08 }, { ...NOTES[1], t0: LW[1].tEnd + 0.08 }];
  const QM_T = 13.75, QM_HOP = 13.95, QM_LAND = QM_HOP + 1.8, QM_X = 860, QM_Y = 752;
  const HOPHZ = 4 / 1.8, TERRY_T = 19.45;
  const earWig = t => (t > 12.95 && t < QM_T) ? Math.sin((t - 12.95) * 2 * Math.PI * 5) * clamp((t - 12.95) / 0.3) : 0;

  defineScene({
    id: 'notebook', chapter: '小问号登场', dur: 24.3, floor: FL,
    cast: {
      terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: TERRY_T,
        pos: [[0, [1452, FL]]],
        pose: [[0, 'q1_akimbo']],
        face: [[0, 'proud']],
        turn: [[0, -0.3]],
        gaze: [[0, 'qmHead']],
        squash: [[0, 1], [TERRY_T + 0.05, 1.1, 0.08], [TERRY_T + 0.13, 1, 0.25, 'back']],
      },
    },
    targets: () => ({ qmHead: [QM_X + 10, QM_Y - 180] }),
    fx: [
      { type: 'prop', kind: 'q1_book', id: 'book', t0: 0.1, at: [0, 0], drawDur: 0.8, headT: 4.15,
        ear: [[0, 0], [QM_T - 0.05, 1, 0.12, 'out'], [QM_T + 0.45, 0, 0.5, 'back']], wig: earWig, sfxAt: [[0.12, 'swish']] },
      // the teacher leafs through everyone's notebooks
      ...[0.95, 1.75, 2.55, 3.35].map((t0, i) => ({ type: 'prop', kind: 'q1_flip', id: 'flip' + i, t0, t1: t0 + 0.6, at: [0, 0], drawDur: 0, sfxAt: [[t0, 'paper']] })),
      { type: 'label', id: 'lbL', text: '大哥哥的作业本', at: [420, 96], rot: -2, t0: 4.5, t1: 8.3, target: [400, 180], bend: 0.3, gap: 4 },
      ...LW.map(s => ({ type: 'write', id: s.id, text: s.text, x: s.x, y: s.y, size: s.size, t0: s.t0, speed: 1250, gap: 0.03, glyphGap: 0.03, w: 6, sfx: 'pen' })),
      ...NW.map(s => ({ type: 'write', id: s.id, text: s.text, x: s.x, y: s.y, size: s.size, t0: s.t0, speed: 900, w: 4, sfx: 'pen' })),
      { type: 'label', id: 'lbR', text: '小陶的作业本', at: [1000, 96], rot: 2, t0: 8.85, t1: 12.6, target: [980, 180], bend: -0.3, gap: 4 },
      { type: 'write', id: BIG.id, text: BIG.text, x: BIG.x, y: BIG.y, size: BIG.size, t0: 9.35, speed: 3400, gap: 0.02, glyphGap: 0.02, w: 9, sfx: 'pen', endSfx: 'zip' },
      { type: 'prop', kind: 'q1_rocket', id: 'rk', t0: 10.6, at: ROCKET_AT, drawDur: 0.7, sfxAt: [[10.6, 'pen'], [10.9, 'pen']] },
      // 小问号 hops out of the dog-eared corner
      { type: 'q1_qm', id: 'qm', size: 240, t0: QM_T, burst: true,
        pos: [[0, [1238, QM_Y]], [QM_HOP, [QM_X, QM_Y], QM_LAND - QM_HOP, 'lin']],
        act: [[0, 'idle'], [QM_HOP, 'hop'], [QM_LAND, 'idle'], [17.55, 'tap']], hopHz: HOPHZ,
        mood: [[0, 'surprised'], [QM_HOP + 0.2, 'happy'], [QM_LAND, 'neutral'], [16.55, 'doubt']],
        gaze: [[0, 'viewer'], [QM_LAND + 0.1, [BIG.x + 200, BIG.y + 90]], [TERRY_T + 0.25, [1452, 600]]],
        sign: [[0, null], [17.3, '为什么是 7？']],
        sfxAt: [[QM_T, 'boing'], ...[1, 2, 3, 4].map(n => [QM_HOP + n / HOPHZ - 0.02, 'hop']), [17.3, 'pop']] },
      { type: 'label', id: 'lbQ', text: ['小问号', '（最爱问“为什么”）'], at: [460, 700], rot: -3, t0: 15.9, t1: 19.3, target: [792, 600], bend: -0.25, gap: 8 },
      { type: 'speech', id: 'say', text: ['这不是一眼', '就看出来了吗！'], at: [1392, 398], tail: [34, 66], speaker: 'terry', t0: 19.95, t1: 24.3, size: 54, rot: -3 },
    ],
    sfx: [[TERRY_T, 'pop'], [12.95, 'plip'], [13.2, 'plip'], [13.45, 'plip'],
      ...[0, 1, 2, 3, 4, 5].map(i => [17.55 + (0.5 + i) / 2.6, 'q1_tap'])],
    subs: [
      { t0: 0.2, t1: 4.4, text: '下课了，老师翻开大家的作业本。' },
      { t0: 4.5, t1: 8.7, text: '大哥哥一步一步，写得清清楚楚；' },
      { t0: 8.8, t1: 12.75, text: '小陶的本子上，只有一个答案。' },
      { t0: 12.85, t1: 17.2, text: '这时，本子里跳出来一个小家伙——' },
      { t0: 17.3, t1: 19.8, text: '“为什么是7？”', say: '为什么是七？', voice: 'qm' },
      { t0: 19.9, t1: 24.2, text: '“这不是一眼就看出来了吗！”', voice: 'kid' },
    ],
  });

  // standing poses for Terry in these scenes
  Object.assign(POSE, {
    q1_akimbo: { lean: -2, tilt: -4, ikL: { w: 1, to: 'hip', dx: -30, dy: -6, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 30, dy: -6, bend: 'out' } },
    q1_scratchStand: { tilt: 8, armScale: 1.7, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 1.0, dy: -0.95, bend: 'out' } },
  });
})();
