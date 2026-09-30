// 轮到你了：斐波那契数里的偶数。一眼能看出规律，但“为什么永远这样”要讲清楚（奇偶证明）。
(() => {
  const FL = 780, SEQ_T = '1, 1, 2, 3, 5, 8, 13, 21, 34', SIZE = 84, Y = 200;
  // centre the sequence and find each number's box (digits between separators)
  const probe = layoutWriting({ text: SEQ_T, x: 0, y: 0, size: SIZE, t0: 0, speed: 1 });
  const X0 = 800 - probe.xEnd / 2, NUMS = [];
  let cur = null;
  probe.boxes.forEach((b, i) => {
    if (/[0-9]/.test(b.ch)) { if (!cur) { cur = { i0: i, x0: b.x }; NUMS.push(cur); } cur.x1 = b.x + b.w; }
    else cur = null;
  });
  NUMS.forEach(n => { n.cx = X0 + (n.x0 + n.x1) / 2; n.w = n.x1 - n.x0; });
  const PAR_Y = Y + SIZE + 64, PARITY = ['奇', '奇', '偶', '奇', '奇', '偶', '奇', '奇', '偶'], EVEN = [2, 5, 8];

  COMP.yt_ringNum = {
    draw(fx, t) {
      const p = EASE.out(clamp((t - fx.t0) / 0.35)); if (p <= 0) return;
      const n = NUMS[fx.n];
      stroke(fx.id, ringPts(fx.id, n.cx, Y + SIZE * 0.52, n.w / 2 + 22, SIZE / 2 + 16, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 5, color: C.red, draw: p });
    },
    cues: fx => [[fx.t0, 'pen']],
  };
  /** 奇/偶 under each number, then red separators every three and "永远重复" at the end. */
  COMP.yt_parity = {
    draw(fx, t) {
      NUMS.forEach((n, i) => {
        const lt = t - (fx.t0 + i * fx.step); if (lt < 0) return;
        const pp = EASE.back(clamp(lt / 0.2));
        if (EVEN.includes(i)) {
          const hp = EASE.out(clamp((lt - 0.1) / 0.25));
          if (hp > 0) stroke('yt.phi' + i, superPts(n.cx, PAR_Y, 70 * hp, 64, 14, 3), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, w: 1 });
        }
        text('yt.par' + i, PARITY[i], n.cx, PAR_Y, { size: 54, z: Z.annot, scale: lerp(0.4, 1, pp), opacity: clamp(lt / 0.08) });
      });
      [2, 5].forEach((i, k) => {
        const p = EASE.out(clamp((t - fx.sepT - k * 0.3) / 0.2)); if (p <= 0) return;
        const x = (NUMS[i].cx + NUMS[i + 1].cx) / 2;
        stroke('yt.sep' + k, [[x, PAR_Y - 44], [x + 2, PAR_Y + 40]], { z: Z.annot, w: 5, color: C.red, draw: p });
      });
      const lp = clamp((t - fx.sepT - 0.7) / 0.3);
      if (lp > 0) {
        const x = NUMS[8].cx + 70;
        text('yt.dots', '……', x + 34, PAR_Y, { size: 54, z: Z.annot, color: C.red, opacity: lp });
      }
    },
    cues: fx => NUMS.map((_, i) => [fx.t0 + i * fx.step, 'plip']).concat([[fx.sepT, 'pen'], [fx.sepT + 0.3, 'pen']]),
  };

  defineScene({
    id: 'yourturn', chapter: '轮到你了', dur: 47.4, floor: FL,
    cast: {
      terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.3,
        pos: [[0, [175, FL]]],
        pose: [[0, 'stand'], [3.3, 'point', 0.12], [7.0, { ...POSE.stand, ikR: { w: 1, to: 'chin', dx: 0.2, dy: 0.05, bend: 'down' } }, 0.14],
          [12.6, 'point', 0.1], [16.0, 'cheer', 0.1, 'back'], [19.5, 'stand', 0.2],
          [24.2, { ...POSE.stand, ikR: { w: 1, to: 'chin', dx: 0.2, dy: 0.05, bend: 'down' } }, 0.14], [27.9, 'point', 0.12], [42.4, 'cheer', 0.1, 'back']],
        squash: [[0, 1], [16.0, 1.1, 0.06], [16.08, 1, 0.25, 'back'], [42.4, 1.1, 0.06], [42.48, 1, 0.25, 'back']],
        face: [[0, 'smile'], [3.3, 'grin', 0.05], [7.0, 'focus', 0.05], [12.6, 'smile', 0.05], [16.0, 'proud', 0.05], [19.8, 'surprised', 0.05],
          [24.2, 'focus', 0.05], [27.9, 'idea', 0.05], [32.6, 'focus', 0.05], [37.7, 'grin', 0.05], [42.4, 'joy', 0.05]],
        turn: [[0, 0.35]],
        gaze: [[0, 'viewer'], [3.3, 'seq'], [7.0, 'viewer'], [12.6, 'seq'], [16.0, 'viewer'], [19.8, 'qm'], [24.2, 'viewer'], [27.9, 'par'], [32.6, 'rules'], [42.4, 'viewer']],
      },
    },
    targets: F => ({ seq: [800, 240], par: [800, PAR_Y], rules: [800, 540], qm: (F.anchors.qm || {}).head || [1290, 560] }),
    set: [{ type: 'floor', t0: 0.1 }],
    fx: [
      { type: 'title', id: 'yt', text: '轮到你了！', x: 800, y: 108, size: 96, t0: -0.1, color: 'red', rot: -2, underline: true, sfx: 'tada' },
      { type: 'write', id: 'seq', text: SEQ_T, x: X0, y: Y, size: SIZE, t0: 0.6, speed: 2600, gap: 0.025, glyphGap: 0.02, w: 6.5, sfx: 'pen' },
      { type: 'scribe', id: 'think1', text: '想一想……', x: 800, y: 520, size: 64, t0: 7.2, t1: 12.6, cps: 5, color: 'red', anchor: 'middle', sfx: 'plip' },
      { type: 'yt_ringNum', id: 'r2', n: 2, t0: 12.8 },
      { type: 'yt_ringNum', id: 'r8', n: 5, t0: 13.4 },
      { type: 'yt_ringNum', id: 'r34', n: 8, t0: 14.0 },
      { type: 'speech', id: 'glance', text: '一眼就看出来了！', at: [470, 470], tail: [-150, 60], speaker: 'terry', t0: 16.1, t1: 19.5, size: 64, rot: -3 },
      { type: 'q1_qm', id: 'qm', pos: [[0, [1290, FL]]], size: 230, t0: 19.5,
        act: [[0, 'hop'], [20.4, 'tap'], [27.9, 'idle'], [42.4, 'nod'], [45.2, 'wave']],
        mood: [[0, 'surprised'], [20.4, 'doubt'], [27.9, 'neutral'], [37.7, 'surprised'], [42.4, 'happy']],
        sign: [[0, null], [20.4, '后面也这样？'], [24.2, '为什么？'], [27.9, null], [42.4, '懂了！']] },
      { type: 'scribe', id: 'think2', text: '为什么呢……', x: 800, y: 520, size: 64, t0: 24.6, t1: 27.9, cps: 5, color: 'red', anchor: 'middle', sfx: 'plip' },
      { type: 'yt_parity', id: 'par', t0: 28.2, step: 0.28, sepT: 38.0 },
      { type: 'scribe', id: 'rule1', text: '奇 + 奇 = 偶', x: 800, y: 470, size: 62, t0: 32.8, cps: 6, anchor: 'middle' },
      { type: 'scribe', id: 'rule2', text: '奇 + 偶 = 奇', x: 800, y: 550, size: 62, t0: 34.4, cps: 6, anchor: 'middle' },
      { type: 'scribe', id: 'rule3', text: '偶 + 奇 = 奇', x: 800, y: 630, size: 62, t0: 36.0, cps: 6, anchor: 'middle' },
      { type: 'label', id: 'lbLoop', text: ['又回到“奇、奇”，', '所以永远重复！'], at: [1172, 468], rot: -4, t0: 38.9, t1: 42.3, target: [NUMS[8].cx + 104, PAR_Y + 30], bend: 0.3, gap: 10 },
    ],
    pauses: [12.45, 27.75],
    sfx: [[16.0, 'hop'], [42.4, 'tada']],
    subs: [
      { t0: 0.3, t1: 3.2, text: '还记得斐波那契数吗？' },
      { t0: 3.3, t1: 6.7, text: '请你圈出里面所有的偶数，' },
      { t0: 6.8, t1: 9.9, text: '看看它们藏着什么规律？' },
      { t0: 10.0, t1: 12.4, text: '想好了再点继续。' },
      { t0: 12.6, t1: 15.7, text: '偶数是 2、8、34——', say: '偶数是二、八、三十四——' },
      { t0: 15.8, t1: 19.4, text: '每隔两个数，就有一个偶数！' },
      { t0: 19.5, t1: 24.1, text: '小问号问：后面一万个数，也都这样吗？' },
      { t0: 24.2, t1: 27.6, text: '为什么？想一想，再点继续。' },
      { t0: 27.9, t1: 32.5, text: '只看奇偶：奇、奇、偶，奇、奇、偶……' },
      { t0: 32.6, t1: 37.6, text: '奇加奇得偶，奇加偶得奇，偶加奇得奇，' },
      { t0: 37.7, t1: 42.3, text: '接着又回到“奇、奇”，所以永远重复！' },
      { t0: 42.4, t1: 47.1, text: '把“为什么”讲清楚，小问号就点头啦！' },
    ],
  });
})();
