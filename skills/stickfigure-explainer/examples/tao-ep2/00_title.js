// 开场：片名卡
defineScene({
  id: 'title', chapter: '开场', dur: 6.2, noSeries: true, floor: 690,
  cast: {
    terry: { H: 245, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  },
  tracks: {
    terry: {
      enter: 1.4,
      pos: [[0, [1300, 690]]],
      pose: [[0, 'stand'], [1.7, t => ({ ...POSE.wave, armR: [118, 40 + 28 * Math.sin((t - 1.7) * 11)] }), 0.12], [3.8, 'stand', 0.2]],
      face: [[0, 'joy']],
      turn: [[0, -0.25]],
    },
  },
  set: [{ type: 'floor', t0: 1.2 }],
  fx: [
    { type: 'title', id: 'tt', text: '数学少年陶哲轩', x: 660, y: 290, size: 140, t0: -0.15, underline: true, sfx: 'stamp' },
    { type: 'title', id: 'ep', text: '第 2 集', x: 660, y: 452, size: 64, t0: 0.8, color: 'red', rot: -3 },
    { type: 'title', id: 'a', text: '看出来', x: 430, y: 570, size: 100, t0: 1.1, color: 'red', rot: -2 },
    { type: 'write', id: 'neq', text: '≠', x: 610, y: 516, size: 110, t0: 1.5, speed: 1800, color: 'red', w: 8, sfx: 'pen', z: Z.annot },
    { type: 'title', id: 'b', text: '证出来', x: 870, y: 570, size: 100, t0: 1.9, color: 'red', rot: -2 },
    { type: 'qm', id: 'qm', pos: [[0, [1470, 690]]], size: 170, t0: 2.6, act: [[0, 'hop'], [3.4, 'idle']], mood: [[0, 'happy']], gaze: [[0, [1300, 520]]] },
  ],
  sfx: [[0.02, 'stamp'], [1.4, 'hop']],
  subs: [{ t0: 0.3, t1: 6.0, text: '数学少年陶哲轩，第二集：看出来，不等于证出来。', hide: true }],
});
