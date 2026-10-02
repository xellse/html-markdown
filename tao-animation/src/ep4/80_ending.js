// 尾声：四句金句；做错了先别急着擦掉，问问它错在哪一步；小陶用放大镜抓住一只“小错误”。
(() => {
  const FL = 780, TX = 1250, PG = [640, 450];
  const GOLD = [['看出来，靠聪明；', 0.3], ['写清楚，靠练习；', 3.0], ['想通，靠不放弃；', 5.7], ['变强，靠直视自己的错。', 8.7]];
  const CLEAR = 12.6;
  /** 橡皮擦：伸过来要擦，被拦住，抖一抖退回去。{t0, stop, back} */
  COMP.h4_eraser = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const goIn = EASE.out(clamp((t - fx.t0) / 0.6)), shake = t > fx.stop && t < fx.stop + 0.5 ? Math.sin((t - fx.stop) * 50) * 6 : 0;
      const out = EASE.in(clamp((t - fx.back) / 0.5));
      const x = lerp(1180, 1010, goIn) + shake + out * 320, y = 400, k = fx.id;   // halts just right of the ringed answer
      DL.save(); DL.translate(x, y); DL.rotate(-18);
      stroke(k + '.b', superPts(0, 0, 150, 70, 18, 8), { z: Z.fx, w: 5, closed: true, fill: C.paper });
      stroke(k + '.s', [[-20, -35], [-20, 35]], { z: Z.fx + 0.1, w: 4 });
      for (let i = 0; i < 3; i++) stroke(k + '.h' + i, [[-60 + i * 12, -30], [-70 + i * 12, 30]], { z: Z.fx + 0.1, w: 2, color: C.pencil });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'swish'], [fx.stop, 'boing']],
  };
  /** 一只“小错误”：小虫子，背上一个红叉，在纸上乱跑；被放大镜罩住就定住、眼睛瞪大。{t0, caught} */
  COMP.h4_bug = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const lt = t - fx.t0, caught = t >= fx.caught, tc = Math.min(t, fx.caught) - fx.t0;
      const x = PG[0] - 40 + Math.sin(tc * 2.3) * 160 + Math.sin(tc * 5.1) * 30, y = PG[1] + 120 + Math.sin(tc * 3.7) * 25;
      const k = fx.id, z = Z.fx + 1, pop = EASE.back(clamp(lt / 0.3)), wig = caught ? 0 : Math.sin(t * 30) * 0.5;
      DL.save(); DL.translate(x, y); DL.scale(pop);
      for (let i = 0; i < 3; i++) [-1, 1].forEach(s => stroke(`${k}.l${i}${s}`, [[s * 14, -10 + i * 10], [s * (30 + wig * 6), -18 + i * 14 + wig * 8 * (i % 2 ? 1 : -1)]], { z, w: 3 }));
      stroke(k + '.body', ringPts(k, 0, 0, 22, 26, { n: 10, closed: true }), { z: z + 0.1, w: 4, closed: true, fill: C.paper });
      stroke(k + '.x1', [[-9, -9], [9, 9]], { z: z + 0.2, w: 4, color: C.red });
      stroke(k + '.x2', [[9, -9], [-9, 9]], { z: z + 0.2, w: 4, color: C.red });
      const eye = caught ? 6 : 4;
      [-8, 8].forEach((dx, i) => { stroke(`${k}.e${i}`, ringPts(`${k}.e${i}`, dx, -30, eye, eye * 1.2, { n: 8, closed: true }), { z: z + 0.2, w: 2.5, closed: true, fill: C.paper }); dot(`${k}.p${i}`, [dx, -29], 2, C.ink, z + 0.3); });
      DL.restore();
      F.targets[k] = [x, y];
    },
    cues: fx => [[fx.t0, 'plip'], [fx.caught, 'pop']],
  };
  /** 放大镜：从小陶手边移到小错误身上，罩住它。{t0, caught} */
  COMP.h4_glass = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const tg = F.targets.bug, a = F.anchors.terry; if (!tg || !a) return;
      const u = EASE.io(clamp((t - fx.t0) / (fx.caught - fx.t0))), p = lerp2(a.handR, tg, u), k = fx.id, z = Z.fx + 2, sc = EASE.back(clamp((t - fx.t0) / 0.25));
      DL.save(); DL.about(p[0], p[1], () => DL.scale(sc));
      stroke(k + '.ring', ringPts(k, p[0], p[1], 52, 52, { n: 14, closed: true }), { z, w: 6, closed: true });
      stroke(k + '.h', [[p[0] + 37, p[1] + 37], [p[0] + 90, p[1] + 90]], { z, w: 9 });
      stroke(k + '.sh', ringPts(k + 's', p[0], p[1], 36, 36, { n: 8, a0: 200, sweep: 60 }), { z, w: 3, color: C.pencil });
      DL.restore();
    },
  };
  defineScene({
    id: 'ending', chapter: '尾声', dur: 24.0, floor: FL,
    cast: { terry: E4.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [CLEAR, [1100, FL], 0.6, 'io']],
        pose: [[0, 'stand'], [8.7, 'akimbo', 0.15, 'back'], [CLEAR, 'stand', 0.2], [15.0, { ...POSE.stand, lean: -4, armScale: 1.7, ikL: { w: 1, to: [1060, 452], bend: 'down' } }, 0.1, 'back'],
          [16.5, { ...POSE.stand, armScale: 1.5, armL: [85, 8] }, 0.15], [19.1, { ...POSE.stand, armScale: 1.5, armR: [70, 40] }, 0.2], [21.0, 'kidCheer', 0.12, 'back']],
        face: [[0, 'smile'], [8.7, 'proud', 0.05], [CLEAR, 'focus', 0.05], [15.0, 'surprised', 0.05], [16.5, 'focus', 0.06], [20.3, 'idea', 0.05], [21.0, 'joy', 0.05]],
        turn: [[0, -0.3], [CLEAR, -0.45, 0.1], [21.0, 0, 0.1]],
        gaze: [[0, 'gold'], [CLEAR, 'page'], [20.3, 'bug'], [21.0, 'viewer']],
        squash: [[0, 1], [21.0, 1.1, 0.06], [21.06, 1, 0.25, 'back']],
      },
    },
    targets: F => ({ gold: [520, 340], page: PG, bug: F.targets.bug || PG }),
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E4.STAMP, dockT: -2 },
      ...GOLD.map(([s, t0], i) => ({ type: 'title', id: 'g' + i, text: s, x: 560, y: 190 + i * 110, size: 66, t0, t1: CLEAR })),
      { type: 'band', id: 'hiG', rect: [560 - 11 * 66 / 2 + 4 * 66 + 22, 190 + 330 - 40, 6 * 66 - 34, 80], t0: 10.2, t1: CLEAR, dur: 0.45 },   // over 直视自己的错
      // a page with a wrong answer, ringed in red
      { type: 'prop', kind: 'e4_page', id: 'pg', at: PG, rot: -2, t0: CLEAR, w: 640, h: 380, lines: 4 },
      { type: 'write', id: 'wr', text: '1+2+…+20 = 420', x: PG[0] - 262, y: PG[1] - 110, size: 62, t0: CLEAR, speed: 6000, gap: 0.02, glyphGap: 0.02, w: 6, sfx: 'pen' },   // the false sum from the detective scene
      { type: 'ringRect', id: 'rg', rect: { write: 'wr', from: 11, to: 14 }, t0: 14.45, pad: 10 },
      { type: 'h4_eraser', id: 'er', t0: 14.6, stop: 15.1, back: 15.8, t1: 16.4 },
      { type: 'title', id: 'stop', text: '先别擦！', x: 990, y: 200, size: 70, t0: 15.1, t1: 16.6, color: 'red', rot: 6, sfx: 'stamp' },
      { type: 'scribe', id: 'q', text: '你错在哪一步？', x: PG[0] - 200, y: PG[1] + 0, size: 52, t0: 16.7, cps: 10, color: 'red' },
      { type: 'h4_bug', id: 'bug', t0: 17.6, caught: 20.4 },
      { type: 'h4_glass', id: 'gl', t0: 19.6, caught: 20.4 },
      { type: 'speech', id: 'got', text: '抓到你了，小错误！', at: [1180, 300], tail: [10, 90], speaker: 'terry', t0: 20.5, t1: 24.0, size: 56, rot: -3 },
      { type: 'qm', id: 'qm', pos: [[0, [1450, 770]]], size: 150, t0: 20.6, burst: true, act: [[0, 'hop']], mood: [[0, 'happy']], gaze: [[0, 'terry']] },
    ],
    subs: [
      { t0: 0.3, t1: 2.9, text: '看出来，靠聪明；' },
      { t0: 3.0, t1: 5.6, text: '写清楚，靠练习；' },
      { t0: 5.7, t1: 8.3, text: '想通，靠不放弃；' },
      { t0: 8.7, t1: 11.9, text: '变强，靠直视自己的错。' },
      { t0: 12.8, t1: 16.4, text: '下次做错了，先别急着擦掉。' },
      { t0: 16.5, t1: 19.7, text: '问问它：你错在哪一步？' },
      { t0: 20.3, t1: 23.54, text: '“抓到你了，小错误！”', voice: 'kid' },
    ],
  });
})();
