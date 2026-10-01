// 尾声：碰到难题，不再干等那一声“叮”；坐下来，先卡一会儿。三句金句：看出来 / 写清楚 / 想通。
(() => {
  const FL = 780, TX = 1120, PG = [440, 400];
  const bulbBox = F => { const p = F.targets['bulb.bulb']; return p ? [p[0] - 46, p[1] - 46, 92, 92] : null; };
  const GOLD = [['看出来，靠聪明；', 14.8], ['写清楚，靠练习；', 17.5], ['想通，靠的是不放弃。', 20.2]];
  defineScene({
    id: 'ending', chapter: '尾声', dur: 28.5, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [7.1, [TX, FL - 4], 0.2], [23.8, [TX + 60, FL], 0.15]],
        pose: [[0, 'stand'], [3.8, 'lookUp', 0.12], [5.3, 'akimbo', 0.12, 'back'], [7.1, { ...POSE.sitFloor, armScale: 1.5, ikR: { w: 1, to: 'head', dx: 0.9, dy: 0.5, bend: 'down' } }, 0.25],
          [10.6, { ...POSE.sitFloor, armScale: 1.6, ikR: { w: 1, to: 'head', dx: 1.0, dy: -0.95, bend: 'out' } }, 0.15], [14.8, { ...POSE.sitFloor, armScale: 1.5, ikR: { w: 1, to: 'head', dx: 0.9, dy: 0.5, bend: 'down' } }, 0.15],
          [23.8, 'kidCheer', 0.12, 'back']],
        face: [[0, 'focus'], [3.8, 'neutral', 0.05], [5.3, 'proud', 0.05], [7.1, 'focus', 0.05], [10.6, 'effort', 0.05], [14.8, 'smile', 0.08], [23.8, 'joy', 0.05]],
        turn: [[0, -0.45], [3.8, -0.1, 0.1], [7.1, -0.4, 0.15], [14.8, -0.2, 0.1], [23.8, 0, 0.1]],
        gaze: [[0, 'page'], [3.8, 'bulbT'], [5.3, 'viewer'], [7.1, 'page'], [14.8, 'gold'], [23.8, 'viewer']],
        squash: [[0, 1], [23.8, 1.12, 0.06], [23.86, 1, 0.25, 'back']],
      },
    },
    targets: F => ({ page: PG, bulbT: F.targets['bulb.bulb'] || [TX, 380], gold: [560, 360] }),
    fx: [
      { type: 'ageStamp', age: 10, t0: -3, ...E3.STAMP, dockT: -2 },
      { type: 'prop', kind: 'e3_page', id: 'pg', at: PG, rot: -2, t0: 0.3, t1: 14.8, w: 560, h: 460, lines: 5, title: '难题' },
      ...[0, 1, 2].map(i => ({ type: 'scribe', id: 'tr' + i, text: ['试：1，2，3……', '线索：总剩两格', '好问题：为什么？'][i], x: PG[0] - 200, y: PG[1] - 40 + i * 84, size: 40, t0: 10.7 + i * 1.1, t1: 14.8, cps: 10 })),
      // waiting for the "ding"? not any more
      { type: 'e3_bulb', id: 'bulb', char: 'terry', size: 84, t0: 3.8, t1: 7.1, state: [[0, 'off']] },
      { type: 'strike', id: 'bx', rect: bulbBox, t0: 5.3, t1: 7.1, dur: 0.25 },
      { type: 'label', id: 'lbWait', text: '干等', at: [1330, 300], rot: 4, size: 48, t0: 5.4, t1: 7.1, target: { target: 'bulb.bulb' }, bend: -0.2, gap: 20 },
      // the three ways out of being stuck
      { type: 'title', id: 'k1', text: '试例子', x: 930, y: 360, size: 52, t0: 10.6, t1: 14.8, color: 'red', rot: -5 },
      { type: 'title', id: 'k2', text: '找线索', x: 1130, y: 300, size: 52, t0: 11.7, t1: 14.8, color: 'red', rot: 2 },
      { type: 'title', id: 'k3', text: '问好问题', x: 1340, y: 360, size: 52, t0: 12.8, t1: 14.8, color: 'red', rot: 5 },
      // the series' golden lines
      ...GOLD.map(([s, t0], i) => ({ type: 'title', id: 'g' + i, text: s, x: 560, y: 220 + i * 110, size: 66, t0 })),
      { type: 'band', id: 'hiG', rect: [560 - 330 + 6 * 66, 220 + 220 - 40, 3 * 66, 80], t0: 21.6, dur: 0.45 },
      { type: 'qm', id: 'qm', pos: [[0, [860, 760]]], size: 160, t0: 23.8, burst: true, act: [[0, 'hop']], mood: [[0, 'happy']], gaze: [[0, 'terry']] },
      { type: 'e3_bulb', id: 'bulb2', char: 'terry', size: 100, t0: 23.8, state: [[0, 'on']] },
      { type: 'speech', id: 'yay', text: ['卡住了？太好了，', '这题有意思！'], at: [1360, 300], tail: [-70, 90], speaker: 'terry', t0: 24.0, t1: 28.5, size: 52, rot: -3 },
    ],
    sfx: [[7.1, 'thud']],
    subs: [
      { t0: 0.3, t1: 3.7, text: '从那以后，小陶碰到难题，' },
      { t0: 3.8, t1: 7.0, text: '不再干等那一声“叮”。' },
      { t0: 7.1, t1: 10.5, text: '他会坐下来，先卡一会儿：' },
      { t0: 10.6, t1: 14.2, text: '试例子，找线索，问好问题。' },
      { t0: 14.8, t1: 17.4, text: '看出来，靠聪明；' },
      { t0: 17.5, t1: 20.1, text: '写清楚，靠练习；' },
      { t0: 20.2, t1: 23.2, text: '想通，靠的是不放弃。' },
      { t0: 23.8, t1: 27.99, text: '“卡住了？太好了，这题有意思！”', voice: 'kid' },
    ],
  });
})();
