// 第 6 集 · 导师的话（口试之后，18 岁）
// 事实（ep6-script.md：斯坦悼文 2018 / A Close Call 2019）：考完以后，导师斯坦“as gently and diplomatically as possible”
//   告诉他：这次的表现让人失望，他得把数学基础打扎实。他自己的看法：这是头一回在真心想考好的考试上考砸。
//   他 2018 年写道：“This turned out to be exactly what I needed to hear; I got motivated to actually work properly
//   so as not to disappoint my advisor again.”
// 演绎：导师的话是旁白转述，所以画成两张小卡片，不做成对白气泡；斯坦只是“导师”，不画成本人的样子（打领带的老教授）。
//   长大的陶哲轩手里那张纸只代表“他写的文章”，不写标题。最后的楼梯是比喻（“聪明”的台阶到这里断了，上面一级是“用功”）。
// 开场 = 上一场结尾（只剩停靠的 18 岁印章）；结尾全部清掉，印章也收掉（第 30 场在角落重新盖 18 岁）。
(() => {
  const FL = 770, DUR = 41.3;
  /* ---------------- 布景 ---------------- */
  const DESK = { x0: 640, x1: 960, top: 600 };
  const TCH = { x: 540, seat: 655 }, SCH = { x: 1060, seat: 650 };        // Terry's chair (back on his left), the teacher's (back on his right)
  const SHELF = { x0: 1090, x1: 1370, y0: 120, y1: 330 };
  const TAO_X = 175;
  /* ---------------- 时间（场景内） ---------------- */
  const SET0 = 0.3, T_IN = 0.55, S_WALK = [1.2, 2.9], S_SIT = 3.0, GENTLE = 4.6;
  const CARD = [7.7, 11.0], DOWN = 8.3, SAD = 11.5, CARD_OUT = 14.6;
  const CLOUD0 = 15.0, OWN0 = 15.6, X0 = 18.4, CLOUD1 = 19.8;
  const A_WALK = [19.9, 21.0], WROTE0 = 22.8, LIFT = [23.0, 24.4], FIST = 28.7, NOTE1 = 32.0;
  const PAN0 = 32.35, PAN_D = 0.55, T_WALK = [32.95, 33.5];
  const HOPS = [33.75, 34.35, 34.95, 35.55], WORK0 = 36.7, EDGE = [36.75, 37.0], TEETER = [37.0, 37.7], BACK = 37.75, LB0 = 37.9, BAND0 = 38.4;
  const PAN1 = 40.55, PAN1_D = 0.5;

  /* ---------------- helpers ---------------- */
  const box = (x0, y0, x1, y1) => [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]];
  const inP = (t, t0, d = 0.35) => EASE.out(clamp((t - t0) / d));
  const outP = (t, t1, d = 0.3) => 1 - clamp((t - (t1 - d)) / d);
  const faded = (op, fn) => {
    if (op <= 0.003) return;
    const n0 = DL.items.length; fn();
    if (op < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * op).toFixed(3); }
  };
  const hop = (t0, d, a, b, h) => t => { const u = clamp((t - t0) / d); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - h * 4 * u * (1 - u)]; };
  const PANW = 1700;
  const officeX = t => -PANW * EASE.io(clamp((t - PAN0) / PAN_D));                   // the office slides out to the left …
  const stairX = t => t < PAN1 ? PANW * (1 - EASE.io(clamp((t - PAN0) / PAN_D)))     // … the staircase slides in from the right,
    : -PANW * EASE.io(clamp((t - PAN1) / PAN1_D));                                 // and out to the left at the end

  COMP.b6_sFade = {
    init(fx) { const c = COMP[fx.of.type]; if (c.init) c.init(fx.of); return fx; },
    draw(fx, t, F) { faded(fx.out === undefined ? 1 : 1 - clamp((t - fx.out) / (fx.fd || 0.3)), () => COMP[fx.of.type].draw(fx.of, t, F)); },
    cues: fx => { const c = COMP[fx.of.type]; return c.cues ? c.cues(fx.of) : []; },
  };
  COMP.b6_sTxt = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, op = outP(t, fx.t1, 0.25) * clamp(lt / 0.08);
      text(fx.id, fx.text, fx.x, fx.y, { size: fx.size || 40, color: fx.color === 'ink' ? C.ink : C.red, z: fx.z ?? Z.annot, rot: fx.rot || 0, scale: lerp(0.5, 1, EASE.back(clamp(lt / 0.22))), opacity: op, halo: 8 });
    },
    cues: fx => [[fx.t0, fx.sfx || 'pop']],
  };

  /* ---------------- 办公室：书架、书桌、两把椅子（转场时整体往左滑走） ---------------- */
  COMP.b6_sOffice = {
    draw(fx, t) {
      if (t < SET0 || t >= PAN0 + PAN_D) return;
      const k = 'b6s.of', ox = officeX(t);
      DL.save(); DL.translate(ox, 0);
      // bookshelf on the back wall
      { const { x0, x1, y0, y1 } = SHELF, p = inP(t, SET0, 0.45), z = Z.set;
        stroke(k + '.sh', box(x0, y0, x1, y1), { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
        [190, 260].forEach((y, i) => stroke(k + '.shL' + i, [[x0 + 4, y], [x1 - 4, y + 1]], { z: z + 0.1, w: 4, draw: stag(p, 1, 3) }));
        if (p > 0.7) {
          const rows = [[y0, 190], [190, 260], [260, y1]];
          rows.forEach(([a, b], r) => {
            let x = x0 + 14 + r * 9;
            for (let i = 0; x < x1 - 40; i++) {
              const bw = 16 + ((i * 7 + r * 5) % 4) * 5, bh = (b - a) - 10 - ((i * 5 + r * 3) % 3) * 9;
              if ((i + r) % 5 === 3) { stroke(`${k}.bk${r}.${i}`, [[x, b - 2], [x + bh * 0.42, b - 2 - bh * 0.9, 1], [x + bh * 0.42 + bw, b - 2 - bh * 0.9 + 6, 1], [x + bw, b - 2, 1]], { z: z + 0.2, w: 3, fill: C.paper }); x += bw + bh * 0.42 + 6; continue; }
              stroke(`${k}.bk${r}.${i}`, box(x, b - 2 - bh, x + bw, b - 2), { z: z + 0.2, w: 3, fill: C.paper });
              x += bw + 3;
            }
          });
        }
      }
      // desk (side view) with a few papers on it
      { const { x0, x1, top } = DESK, p = inP(t, SET0 + 0.1, 0.4), z = Z.desk;
        stroke(k + '.dk', superPts((x0 + x1) / 2, top + 9, x1 - x0, 18, 18, 7), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 2) });
        stroke(k + '.dkL', [[x0 + 22, top + 18], [x0 + 20, FL]], { z, w: 5, draw: stag(p, 1, 2) });
        stroke(k + '.dkR', [[x1 - 22, top + 18], [x1 - 20, FL]], { z, w: 5, draw: stag(p, 1, 2) });
        if (p > 0.8) {
          shadow(k + '.dkS', (x0 + x1) / 2, FL + 4, x1 - x0 + 20, 1);
          [0, 1, 2].forEach(i => stroke(k + '.pp' + i, [[760 + i * 4, top - 2 - i * 4], [850 - i * 3, top - 2 - i * 4 + 1]], { z: z + 0.1, w: 3 }));
        }
      }
      // chairs
      [[TCH, -1], [SCH, 1]].forEach(([c, s], i) => {
        const p = inP(t, SET0 + 0.2, 0.35), z = Z.chair, kk = k + '.ch' + i;
        stroke(kk + '.s', superPts(c.x, c.seat + 8, 96, 14, 14, 6), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
        stroke(kk + '.b', [[c.x + s * 44, c.seat + 4], [c.x + s * 50, c.seat - 112]], { z, w: 5, draw: stag(p, 1, 3) });
        stroke(kk + '.b2', superPts(c.x + s * 49, c.seat - 88, 14, 50, 12, 6), { z, w: 4.5, closed: true, fill: C.paper, draw: stag(p, 1, 3) });
        stroke(kk + '.l1', [[c.x - 40, c.seat + 14], [c.x - 44, FL]], { z, w: 5, draw: stag(p, 2, 3) });
        stroke(kk + '.l2', [[c.x + 40, c.seat + 14], [c.x + 44, FL]], { z, w: 5, draw: stag(p, 2, 3) });
      });
      DL.restore();
    },
    cues: () => [[SET0, 'paper'], [PAN0, 'whoosh']],
  };

  /* ---------------- 两张小卡片：转述导师的话（不是对白气泡） ---------------- */
  const CARDS = [{ s: '表现：让人失望', y: 290 }, { s: '基础：要打扎实', y: 383 }];
  COMP.b6_sCards = {
    draw(fx, t) {
      CARDS.forEach((c, i) => {
        if (t < CARD[i] || t >= CARD_OUT) return;
        const lt = t - CARD[i], pp = EASE.back(clamp(lt / 0.25)), w = textWidth(c.s, 40) + 36, x = 800, kk = 'b6s.cd' + i;
        faded(outP(t, CARD_OUT), () => {
          DL.save(); DL.about(x, c.y, () => { DL.scale(lerp(0.4, 1, pp)); DL.rotate(i ? 1.5 : -1.5); });
          stroke(kk + '.sh', [[x - w / 2 + 10, c.y + 40], [x + w / 2 + 6, c.y + 39, 1], [x + w / 2 + 6, c.y - 26]], { z: Z.annot - 1.1, w: 2.4, color: C.pencil, opacity: 0.7, boil: 0.5 });
          stroke(kk, box(x - w / 2, c.y - 33, x + w / 2, c.y + 33), { z: Z.annot - 1, w: 4.5, fill: C.paper });
          text(kk + '.t', c.s, x, c.y + 1, { size: 40, z: Z.annot - 0.9 });
          DL.restore();
        });
      });
    },
    cues: () => CARD.map(c => [c, 'paper']),
  };
  /** inside the thought cloud: "the exam he really wanted to do well in", with a small red ✗ */
  const EX = { c: [420, 228], w: 320, h: 150 };
  COMP.b6_sExam = {
    draw(fx, t) {
      if (t < CLOUD0 + 0.25 || t >= CLOUD1) return;
      const op = clamp((t - CLOUD0 - 0.25) / 0.2) * outP(t, CLOUD1), { c, w, h } = EX, k = 'b6s.ex', z = Z.fx + 1;
      faded(op, () => {
        stroke(k, box(c[0] - w / 2, c[1] - h / 2, c[0] + w / 2, c[1] + h / 2), { z, w: 4, fill: C.paper });
        text(k + '.t', '真心想考好的考试', c[0], c[1] - h / 2 + 32, { size: 36, z: z + 0.1 });
        [0, 1, 2].forEach(r => { const pts = [], y = c[1] + 2 + r * 26, L = r === 2 ? 120 : 190; for (let i = 0; i <= 10; i++) pts.push([c[0] - w / 2 + 28 + L * i / 10, y + (i % 2 ? -4 : 3)]); stroke(k + '.l' + r, pts, { z: z + 0.1, w: 2.6, boil: 0.6 }); });
        const xp = clamp((t - X0) / 0.16), xq = clamp((t - X0 - 0.18) / 0.16), m = [c[0] + w / 2 - 52, c[1] + 34];
        if (xp > 0) stroke(k + '.x1', [[m[0] - 24, m[1] - 24], [m[0] + 24, m[1] + 24]], { z: Z.annot, w: 7, color: C.red, draw: xp });
        if (xq > 0) stroke(k + '.x2', [[m[0] + 24, m[1] - 24], [m[0] - 24, m[1] + 24]], { z: Z.annot, w: 7, color: C.red, draw: xq });
      });
    },
    cues: () => [[X0, 'pen'], [X0 + 0.18, 'pen']],
  };
  /** the article the grown-up Tao holds (no title: only "something he wrote") */
  COMP.b6_sPaper = {
    draw(fx, t, F) {
      if (t < A_WALK[0]) return;
      const a = F.anchors.taoA; if (!a) return;
      const h = a.handR, c = [h[0] + 44, h[1] - 72], k = 'b6s.pa', z = Z.front + 1;
      DL.save(); DL.about(c[0], c[1], () => DL.rotate(4));
      stroke(k, box(c[0] - 55, c[1] - 72, c[0] + 55, c[1] + 72), { z, w: 4, fill: C.paper });
      for (let r = 0; r < 6; r++) { const pts = [], y = c[1] - 48 + r * 20, L = r === 5 ? 50 : 82; for (let i = 0; i <= 8; i++) pts.push([c[0] - 42 + L * i / 8, y + (i % 2 ? -3 : 2)]); stroke(k + '.l' + r, pts, { z: z + 0.1, w: 2.4, boil: 0.6 }); }
      DL.restore();
    },
  };

  /* ---------------- 楼梯：“聪明”的台阶到这里断了，上面一级是“用功”（比喻） ---------------- */
  const ST = [{ x0: 240, x1: 390, y: 700 }, { x0: 390, x1: 540, y: 630 }, { x0: 540, x1: 690, y: 560 }, { x0: 690, x1: 860, y: 490 }];
  const WORK = { x0: 1140, x1: 1400, y: 350 };
  const STAND = [[315, 700], [465, 630], [615, 560], [780, 490]];
  COMP.b6_sStairs = {
    draw(fx, t) {
      if (t < PAN0 || t >= PAN1 + PAN1_D) return;
      const k = 'b6s.st', z = Z.set + 1, sx = stairX(t);
      DL.save(); DL.translate(sx, 0);
      stroke(k + '.fl', [[60, FL], [1560, FL + 1]], { z: Z.set, w: 2.2, color: C.pencil, opacity: 0.8 });
      const prof = [[ST[0].x0, FL]]; ST.forEach(s => prof.push([s.x0, s.y, 1], [s.x1, s.y, 1])); prof.push([ST[3].x1, FL, 1]);
      stroke(k, prof, { z, w: 5, fill: C.paper });
      ST.forEach((s, i) => {
        if (i) stroke(k + '.v' + i, [[s.x0, s.y + 4], [s.x0, FL - 2]], { z: z + 0.1, w: 3, color: C.pencil });
        text(k + '.t' + i, '聪明', (s.x0 + s.x1) / 2, s.y + 38, { size: 40, z: z + 0.2 });
      });
      // the broken edge: a few pencil cracks where the "smart" stairs stop
      [[0, 0], [1, 1]].forEach(([j]) => stroke(k + '.cr' + j, [[ST[3].x1 - 2, ST[3].y + 30 + j * 70], [ST[3].x1 + 12, ST[3].y + 44 + j * 70], [ST[3].x1 + 2, ST[3].y + 58 + j * 70]], { z: z + 0.1, w: 3, color: C.pencil }));
      if (t >= WORK0) {
        const p = inP(t, WORK0, 0.4), { x0, x1, y } = WORK;
        stroke(k + '.w', [[x0, FL], [x0, y, 1], [x1, y, 1], [x1, FL, 1]], { z, w: 5, fill: C.paper, draw: p });
        if (p > 0.6) text(k + '.wt', '用功', (x0 + x1) / 2, y + 46, { size: 48, z: z + 0.2, opacity: clamp((p - 0.6) / 0.3) });
        const bp = EASE.out(clamp((t - BAND0) / 0.35));
        if (bp > 0) {
          const bx0 = (x0 + x1) / 2 - 64, bx1 = lerp(bx0, (x0 + x1) / 2 + 64, bp), y0 = y + 22, y1 = y + 72, top = [], bot = [];
          for (let i = 0; i <= 8; i++) { const xx = lerp(bx0, bx1, i / 8); top.push([xx, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([xx, y1 + Math.sin(i * 2.3) * 4]); }
          stroke(k + '.band', top.concat(bot), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
        }
      }
      if (t >= LB0) {
        const lt = t - LB0, sc = lerp(0.5, 1, EASE.back(clamp(lt / 0.22))), op = clamp(lt / 0.08), cx = (ST[3].x1 + WORK.x0) / 2;
        text(k + '.lb0', '光靠聪明，', cx + 10, 606, { size: 44, color: C.red, z: Z.annot, rot: -3, scale: sc, opacity: op, halo: 8 });
        text(k + '.lb1', '不够用了', cx, 662, { size: 44, color: C.red, z: Z.annot, rot: -3, scale: sc, opacity: op, halo: 8 });
      }
      DL.restore();
    },
    cues: () => [[WORK0, 'paper'], [LB0, 'pen'], [BAND0, 'swish'], [PAN1, 'whoosh']],
  };

  /* ---------------- poses / faces ---------------- */
  const hipT = (dx, dy) => ({ w: 1, to: 'hip', dx, dy, bend: 'out' });
  const SITL = { sit: 1, legScale: 1.12, thigh: 0.24, legL: [66, -60], legR: [66, -60] };
  Object.assign(POSE, {
    b6_sSit: { ...SITL, ikL: hipT(-30, 16), ikR: { w: 1, to: 'desk', dx: 0, dy: -2, bend: 'down' } },
    b6_sDown: { ...SITL, tilt: 11, lean: 4, ikL: hipT(-30, 16), ikR: { w: 1, to: 'desk', dx: -6, dy: -2, bend: 'down' } },
    b6_sSad: { ...SITL, tilt: 16, lean: 6, ikL: hipT(-28, 18), ikR: hipT(28, 18) },
    b6_sFist: { ...SITL, tilt: -2, armScale: 1.15, ikL: hipT(-30, 16), armR: [78, 100], ikR: { w: 0 } },
    b6_sProf: { ...SITL, legScale: 1.05, ikL: { w: 1, to: 'desk', dx: 0, dy: -2, bend: 'down' }, ikR: hipT(30, 16) },
    b6_sHop: { legL: [22, -46], legR: [10, -30], armL: [64, 24], armR: [64, 24], lean: 3 },
    b6_sTeeter: t => ({ lean: -5, tilt: -6, armScale: 1.1, armL: [100 + 45 * Math.sin(t * 15), 25], armR: [100 + 45 * Math.sin(t * 15 + Math.PI), 25] }),
  });
  Object.assign(POSE, {
    b6_sGentle: t => ({ ...POSE.b6_sProf, lean: -9, tilt: -4, armScale: 1.1, armL: [75, 20 + 7 * Math.sin(t * 3)], ikL: { w: 0 } }),
    b6_sNod: t => ({ ...POSE.b6_sFist, tilt: -2 + 9 * Math.max(0, Math.sin((t - FIST - 0.15) * 7)) * (t < FIST + 1.05 ? 1 : 0) }),
  });
  Object.assign(FACE, {
    b6_sSad: { lidL: 0.34, lidR: 0.34, brow: 'line', browL: -18, browR: -18, browY: 0.03, mouth: 'frown', mw: 0.22 },
    b6_sKind: { mouth: 'smile', mw: 0.24, lidL: 0.16, lidR: 0.16, brow: 'line', browL: -8, browR: -8 },
  });
  const taoPos = [[0, [-150, FL]], [A_WALK[0], [TAO_X, FL], A_WALK[1] - A_WALK[0], 'lin'], [PAN0, [TAO_X - PANW, FL], PAN_D, 'io']];
  const taoRead = t => { const x = evalTrack(taoPos, t)[0]; return { ...makeWalk(A_WALK[0], A_WALK[1], 5.2)(t), armL: [14, 8], ikR: { w: 1, to: 'abs', dx: x + 105, dy: 595, bend: 'down' } }; };

  defineScene({
    id: 'stein', chapter: '导师的话', dur: DUR, floor: FL,
    cast: {
      stein: { ...E6.stein, desk: [DESK.x1 - 10, DESK.top - 2] },
      terry: { ...E6.teen, desk: [DESK.x0 + 10, DESK.top - 2] },
      taoA: { ...E6.taoAdult },
    },
    order: ['stein', 'terry', 'taoA'],
    tracks: {
      terry: {
        enter: T_IN,
        pos: [[0, [TCH.x, TCH.seat]], [PAN0, [TCH.x - PANW, TCH.seat], PAN_D, 'io'],
          [T_WALK[0] - 0.02, [-130, FL], 0], [T_WALK[0], [150, FL], T_WALK[1] - T_WALK[0], 'lin'],
          [HOPS[0], hop(HOPS[0], 0.35, [150, FL], STAND[0], 60), 0],
          ...HOPS.slice(1).map((h, i) => [h, hop(h, 0.35, STAND[i], STAND[i + 1], 60), 0]),
          [EDGE[0], [835, ST[3].y], EDGE[1] - EDGE[0], 'io'], [BACK, [795, ST[3].y], 0.25, 'io'],
          [PAN1, [795 - PANW, ST[3].y], PAN1_D, 'io']],
        pose: [[0, 'b6_sSit'], [DOWN, 'b6_sDown', 0.25], [SAD, 'b6_sSad', 0.35],
          [LIFT[0], 'b6_sSit', LIFT[1] - LIFT[0], 'io'], [FIST, 'b6_sNod', 0.14, 'back'], [31.2, 'b6_sSit', 0.3],
          [T_WALK[0] - 0.02, makeWalk(T_WALK[0], T_WALK[1], 5.6), 0],
          ...HOPS.flatMap(h => [[h - 0.1, 'crouch', 0.08], [h, 'b6_sHop', 0.08], [h + 0.35, 'stand', 0.1]]),
          [TEETER[0], 'b6_sTeeter', 0.1], [TEETER[1], 'stand', 0.15], [BACK + 0.3, 'lookUp', 0.2]],
        face: [[0, 'sheepish'], [GENTLE, 'neutral', 0.1], [DOWN, 'sheepish', 0.1], [SAD, 'b6_sSad', 0.3],
          [23.6, 'neutral', 0.3], [24.6, 'focus', 0.15], [31.3, 'smile', 0.15],
          [T_WALK[0], 'smile', 0], [HOPS[0], 'proud', 0.1], [EDGE[1], 'surprised', 0.06], [BACK + 0.3, 'focus', 0.12]],
        turn: [[0, 0.35], [T_WALK[0] - 0.02, 0.35, 0]],
        gaze: [[0, 'stein'], [DOWN, 'desk'], [24.3, 'stein'], [T_WALK[0], 'viewer'], [HOPS[0], 'step'], [EDGE[0], 'gap'], [BACK + 0.2, 'work']],
        squash: [[0, 1], ...HOPS.flatMap(h => [[h + 0.35, 0.9, 0.05], [h + 0.4, 1, 0.2, 'back']]), [EDGE[1], 1.08, 0.06], [EDGE[1] + 0.06, 1, 0.22, 'back']],
      },
      stein: {
        pos: [[0, [1720, FL]], [S_WALK[0], [SCH.x, FL], S_WALK[1] - S_WALK[0], 'lin'], [S_SIT - 0.05, [SCH.x, SCH.seat], 0.2], [PAN0, [SCH.x - PANW, SCH.seat], PAN_D, 'io']],
        pose: [[0, makeWalk(S_WALK[0], S_WALK[1], 5.0)], [S_SIT - 0.05, 'b6_sProf', 0.2], [GENTLE, 'b6_sGentle', 0.2], [CARD_OUT, 'b6_sProf', 0.3]],
        face: [[0, 'neutral'], [S_SIT, 'b6_sKind', 0.15], [29.4, 'smile', 0.15]],
        turn: [[0, -0.45], [S_SIT, -0.35, 0.15]],
        gaze: [[0, 'terry']],
      },
      taoA: {
        pos: taoPos,
        pose: [[0, taoRead]],
        face: [[0, 'smile']],
        turn: [[0, 0.4]],
        gaze: [[0, 'terry']],
      },
    },
    targets: F => ({ desk: [700, 596], step: [(F.anchors.terry ? F.anchors.terry.footR[0] : 400) + 70, 760], gap: [1000, 700], work: [WORK.x0 + 110, WORK.y + 40] }),
    fx: [
      { type: 'ageStamp', age: 18, t0: -3, ...E6.STAMP, dockT: -2, t1: PAN1 + 0.25 },
      { type: 'b6_sOffice', id: 'b6s.office' },
      { type: 'b6_sCards', id: 'b6s.cards' },
      { type: 'b6_sFade', id: 'b6s.cloudF', out: CLOUD1 - 0.3, of: { type: 'thought', id: 'b6s.cloud', at: [420, 230], rx: 250, ry: 125, t0: CLOUD0, t1: CLOUD1, from: { char: 'terry', part: 'headTop', dx: 0, dy: -8 } } },
      { type: 'b6_sExam', id: 'b6s.exam' },
      { type: 'b6_sTxt', id: 'b6s.own', text: '（他自己的看法）', x: 850, y: 215, size: 38, t0: OWN0, t1: CLOUD1 },
      { type: 'b6_sPaper', id: 'b6s.paper' },
      { type: 'b6_sFade', id: 'b6s.wroteF', out: NOTE1 - 0.3, of: { type: 'label', id: 'b6s.wrote', text: '（他 2018 年写的）', at: [330, 330], size: 38, rot: -2, t0: WROTE0, t1: NOTE1, target: { char: 'taoA', part: 'handR', dx: 44, dy: -150 }, bend: 0.1, gap: 10 } },
      { type: 'b6_sStairs', id: 'b6s.stairs' },
    ],
    steps: [{ t0: S_WALK[0], t1: S_WALK[1], hz: 5.0 }, { t0: A_WALK[0], t1: A_WALK[1], hz: 5.2 }, { t0: T_WALK[0], t1: T_WALK[1], hz: 5.6 }],
    sfx: [[T_IN, 'pop'], [S_SIT + 0.1, 'thud'], [DOWN, 'boop'], [FIST + 0.1, 'swish'], ...HOPS.map(h => [h, 'hop']), [EDGE[1], 'boing'], [BACK, 'step']],
    subs: [
      { t0: 0.3, t1: 4.3, text: '考完以后，导师斯坦老师坐下来，' },
      { t0: 4.4, t1: 7.2, text: '尽量温和地告诉他：' },
      { t0: 7.5, t1: 10.7, text: '这次的表现，让人失望；' },
      { t0: 10.8, t1: 14.0, text: '他得把数学基础打扎实。' },
      { t0: 14.9, t1: 19.5, text: '在他看来，这是头一回想考好却考砸了。' },
      { t0: 20.2, t1: 22.4, text: '他后来写道：' },
      { t0: 22.7, t1: 26.7, text: '“这正是我当时需要听到的话。”' },
      { t0: 27.0, t1: 32.2, text: '“我有了动力好好用功，不想再让老师失望。”' },
      { t0: 33.5, t1: 36.5, text: '聪明能带他走到这里，' },
      { t0: 36.6, t1: 40.4, text: '可再往前，光靠聪明不够用了。' },
    ],
  });
})();
