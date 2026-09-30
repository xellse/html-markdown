// 开场：片名卡
defineScene({
  id: 'title', chapter: '开场', dur: 6, noSeries: true, floor: 690,
  cast: {
    terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  },
  tracks: {
    terry: {
      enter: 1.25,
      pos: [[0, [1270, 690]]],
      pose: [[0, 'stand'], [1.55, t => ({ ...POSE.wave, armR: [118, 40 + 28 * Math.sin((t - 1.55) * 11)] }), 0.12], [3.6, 'stand', 0.2]],
      face: [[0, 'joy']],
      turn: [[0, -0.25]],
    },
  },
  set: [{ type: 'floor', t0: 1.1 }],
  fx: [
    { type: 'title', id: 'tt', text: '数学少年陶哲轩', x: 660, y: 300, size: 140, t0: -0.15, underline: true, sfx: 'stamp' },
    { type: 'title', id: 'ep', text: '第 1 集', x: 660, y: 470, size: 64, t0: 0.8, color: 'red', rot: -3 },
    { type: 'title', id: 'epn', text: '一眼看出来', x: 660, y: 575, size: 104, t0: 1.1, color: 'red', rot: -2 },
    { type: 'speech', id: 'hi', text: '嗨！', at: [1420, 380], tail: [-44, 40], speaker: 'terry', t0: 1.7, t1: 4.6, rot: 6 },
  ],
  sfx: [[0.02, 'stamp'], [1.25, 'hop']],
  subs: [{ t0: 0.3, t1: 5.8, text: '数学少年陶哲轩，第一集：一眼看出来。', hide: true }],
});
