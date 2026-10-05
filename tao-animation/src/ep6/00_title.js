// 开场：片名卡（最后一集）。17 岁的小陶拖着箱子走进来挥手，小问号在另一边跳。
defineScene({
  id: 'title', chapter: '开场', dur: 5.6, noSeries: true, floor: 720,
  cast: { terry: { ...E6.teen, bag: true } },
  tracks: {
    terry: {
      enter: 0.8,
      pos: [[0, [1700, 720]], [0.8, [1700, 720]], [1.9, [1300, 720], 0.9, 'out']],
      pose: [[0, makeWalk(0.8, 1.9, 5.2, { bag: true })], [2.0, 'stand', 0.15], [2.4, t => ({ ...POSE.wave, armScale: 1.6, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 2.4) * 11)] }), 0.12], [4.4, 'stand', 0.2]],
      face: [[0, 'smile'], [2.4, 'joy', 0.05]],
      turn: [[0, -0.6], [2.0, -0.25, 0.15]],
    },
  },
  fx: [
    { type: 'title', id: 'tt', text: '数学少年陶哲轩', x: 640, y: 250, size: 140, t0: -0.15, underline: true, sfx: 'stamp' },
    { type: 'title', id: 'ep', text: '第 6 集 · 最后一集', x: 640, y: 412, size: 60, t0: 0.6, color: 'red', rot: -3 },
    { type: 'title', id: 'a', text: '聪明不够用了', x: 640, y: 556, size: 96, t0: 1.1, color: 'red', rot: -2 },
    { type: 'qm', id: 'qm', pos: [[0, [180, 720]]], size: 170, t0: 2.6, act: [[0, 'hop'], [4.2, 'wave']], mood: [[0, 'happy']] },
  ],
  subs: [{ t0: 0.3, t1: 5.1, text: '数学少年陶哲轩，第六集：聪明不够用了。', hide: true }],
});
