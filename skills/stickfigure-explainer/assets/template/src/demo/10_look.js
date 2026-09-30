// 第一步：一眼看出规律（主角写出四行算式），小问号追问“为什么”
(() => {
  const FL = 780, X = 520, SIZE = 84;
  const ROWS = [['1 = 1', 1.2], ['1+3 = 4', 2.6], ['1+3+5 = 9', 4.2], ['1+3+5+7 = 16', 6.0]];
  defineScene({
    id: 'look', chapter: '看出规律', dur: 20.6, floor: FL,
    cast: {
      kid: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      kid: {
        pos: [[0, [260, FL]]],
        pose: [[0, 'kidPoint'], [8.5, 'kidCheer', 0.1, 'back'], [13.0, 'stand', 0.2], [16.5, 'scratchStand', 0.14]],
        squash: [[0, 1], [8.5, 1.1, 0.06], [8.56, 1, 0.25, 'back']],
        face: [[0, 'focus'], [8.5, 'proudGrin', 0.05], [13.0, 'surprised', 0.05], [16.5, 'sheepish', 0.05]],
        turn: [[0, 0.35], [13.0, 0.5, 0.1]],
        gaze: [[0, 'rows'], [8.5, 'viewer'], [13.0, 'qm'], [16.5, 'viewer']],
      },
    },
    targets: F => ({ rows: [820, 380], qm: (F.anchors.qm || {}).head || [1320, 560] }),
    set: [{ type: 'floor', t0: 0 }],
    fx: [
      // the recurring stamp: here it marks a step, not an age
      { type: 'ageStamp', label: '第1步', place: '先看出规律', t0: -0.2, center: [800, 380], R: 150, dockT: 0.9, dock: [1486, 108], dockScale: 0.46 },
      ...ROWS.map(([s, t0], i) => ({ type: 'write', id: 'r' + i, text: s, x: X, y: 150 + i * 118, size: SIZE, t0, speed: 2600, w: 6.5, sfx: 'pen' })),
      // circle the first results in red, then highlight the last row (the pattern) in yellow
      ...ROWS.slice(0, 3).map(([s], i) => ({ type: 'ring', id: 'c' + i, of: 'r' + i, glyph: s.length - 1, t0: 7.2 + i * 0.25 })),
      { type: 'highlight', id: 'hl', of: 'r3', t0: 8.0, dur: 0.35 },
      { type: 'label', id: 'lbSq', text: ['1×1  2×2  3×3  4×4', '全是平方数'], at: [1250, 250], rot: -3, t0: 5.4, t1: 12.9, target: [1180, 470], bend: 0.25, gap: 10 },
      { type: 'speech', id: 'glance', text: ['都是平方数！', '一眼就看出来了！'], at: [270, 330], tail: [0, 90], speaker: 'kid', t0: 8.6, t1: 12.9, size: 56, rot: -3 },
      { type: 'qm', id: 'qm', pos: [[0, [1330, FL]]], size: 220, t0: 12.9, burst: true,
        act: [[0, 'hop'], [13.8, 'tap']], mood: [[0, 'surprised'], [13.8, 'doubt']], sign: [[0, null], [13.6, '为什么？']], gaze: [[0, 'viewer'], [13.6, [300, 560]]] },
    ],
    subs: [
      { t0: 0.3, t1: 5.3, text: '把连续的奇数加起来，看看会得到什么：' },
      { t0: 5.4, t1: 8.4, text: '1，4，9，16……', say: '一，四，九，十六……' },
      { t0: 8.5, t1: 12.9, text: '“都是平方数！一眼就看出来了！”', voice: 'kid' },
      { t0: 13.0, t1: 16.4, text: '“为什么一定是平方数？”', voice: 'qm' },
      { t0: 16.5, t1: 20.3, text: '试了四个都对，还不算证明。' },
    ],
  });
})();
