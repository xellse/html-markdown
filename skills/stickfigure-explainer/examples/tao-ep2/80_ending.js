// 尾声：小陶先想“小问号会问什么”，再把回答写在纸上；看出来靠聪明，写清楚靠练习。
(() => {
  const FL = 780, PAGE = [640, 400], LX = 220;
  const LINES = [
    ['① 奇数：两个两个排好，还多出一个。', 0.8],
    ['② 把两个奇数放在一起。', 5.2],
    ['③ 多出来的两个，正好凑成一对。', 7.8],
    ['所以：全部成对，是偶数。', 10.4],
  ];
  const Y0 = 196, DY = 92;
  defineScene({
    id: 'ending', chapter: '尾声', dur: 23.2, floor: FL,
    cast: {
      terry: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        pos: [[0, [1400, FL]]],
        pose: [[0, 'stand'], [4.8, { ...POSE.stand, ikR: { w: 1, to: 'chin', dx: 0.2, dy: 0.05, bend: 'down' } }, 0.14], [7.6, 'point', 0.12],
          [16.5, { armL: [150, 14], armR: [150, 14], armScale: 1.5 }, 0.1, 'back']],
        face: [[0, 'focus'], [4.8, 'idea', 0.05], [7.6, 'smile', 0.05], [16.5, 'joy', 0.05]],
        turn: [[0, -0.4], [16.5, -0.1, 0.1]],
        gaze: [[0, 'page'], [4.8, 'bubble'], [7.6, 'page'], [16.5, 'viewer']],
        squash: [[0, 1], [16.5, 1.1, 0.06], [16.56, 1, 0.25, 'back']],
      },
    },
    targets: () => ({ page: [620, 360], bubble: [1300, 250] }),
    fx: [
      { type: 'prop', kind: 'e2_page', id: 'pg', at: PAGE, rot: -1, t0: -0.3, w: 960, h: 620, lines: 6 },
      ...LINES.map(([s, t0], i) => ({ type: 'scribe', id: 'ln' + i, text: s, x: LX, y: Y0 + i * DY, size: 50, t0, cps: 9 })),
      ...LINES.map(([, t0], i) => ({ type: 'write', id: 'ck' + i, text: '✓', x: 990, y: Y0 + i * DY - 34, size: 64, t0: t0 + 1.6 + (i === 3 ? 0.6 : 0), speed: 1600, color: 'red', w: 6, sfx: 'pen', z: Z.annot })),
      { type: 'qm', id: 'qm', pos: [[0, [1200, 780]]], size: 160, t0: -1, silent: true,
        act: [[0, 'idle'], [2.4, 'nod'], [3.6, 'idle'], [6.8, 'nod'], [8.2, 'idle'], [9.4, 'nod'], [10.6, 'idle'], [12.4, 'nod'], [16.5, 'hop']],
        mood: [[0, 'neutral'], [2.4, 'happy'], [3.6, 'neutral'], [6.8, 'happy']], gaze: [[0, 'page'], [16.5, 'viewer']] },
      { type: 'thought', id: 'bub', at: [1300, 250], rx: 90, ry: 70, t0: 4.8, t1: 7.6, from: { char: 'terry', part: 'headTop' } },
      { type: 'title', id: 'bubq', text: '？', x: 1300, y: 250, size: 90, t0: 5.0, t1: 7.6, color: 'red', sfx: 'boop' },
      { type: 'title', id: 'w1', text: '看出来，靠聪明；', x: 620, y: 586, size: 58, t0: 10.7, t1: 23.2 },
      { type: 'title', id: 'w2', text: '写清楚，靠练习。', x: 620, y: 660, size: 58, t0: 13.6, t1: 23.2, underline: true },
      { type: 'speech', id: 'see', text: ['原来把过程写出来，', '别人就能跟我一起看见！'], at: [1340, 230], tail: [60, 90], speaker: 'terry', t0: 16.5, t1: 23.2, size: 40, rot: -2 },
    ],
    subs: [
      { t0: 0.3, t1: 4.7, text: '从那以后，小陶写题时，会先想一想：' },
      { t0: 4.8, t1: 7.4, text: '“小问号会问什么？”', voice: 'kid' },
      { t0: 7.5, t1: 10.6, text: '然后把回答先写在纸上。' },
      { t0: 10.7, t1: 13.5, text: '看出来，靠的是聪明；' },
      { t0: 13.6, t1: 16.4, text: '写清楚，靠的是练习。' },
      { t0: 16.5, t1: 22.6, text: '“原来把过程写出来，别人就能跟我一起看见！”', voice: 'kid' },
    ],
  });
})();
