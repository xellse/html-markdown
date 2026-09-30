// 片名卡：系列名（来自 meta.json 的 series）+ 本集标题 + 主角挥手
defineScene({
  id: 'title', chapter: '开场', dur: 5.6, noSeries: true, floor: 690,
  cast: {
    kid: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  },
  tracks: {
    kid: {
      enter: 1.2,
      pos: [[0, [1280, 690]]],
      pose: [[0, 'stand'], [1.5, t => ({ ...POSE.wave, armR: [118, 40 + 28 * Math.sin((t - 1.5) * 11)] }), 0.12], [3.6, 'stand', 0.2]],
      face: [[0, 'joy']],
      turn: [[0, -0.25]],
    },
  },
  set: [{ type: 'floor', t0: 1.0 }],
  fx: [
    // t0 slightly negative: frame 0 is never blank
    { type: 'title', id: 'series', text: EP.series, x: 660, y: 300, size: 130, t0: -0.15, underline: true, sfx: 'stamp' },
    { type: 'title', id: 'ep', text: '演示', x: 660, y: 460, size: 64, t0: 0.8, color: 'red', rot: -3 },
    { type: 'title', id: 'name', text: '为什么是平方数？', x: 660, y: 570, size: 96, t0: 1.1, color: 'red', rot: -2 },
    { type: 'qm', id: 'qm', pos: [[0, [1450, 690]]], size: 160, t0: 2.4, act: [[0, 'hop'], [3.2, 'idle']], mood: [[0, 'happy']] },
  ],
  sfx: [[0.02, 'stamp'], [1.2, 'hop']],
  subs: [{ t0: 0.3, t1: 5.4, text: '演示：为什么是平方数？', hide: true }],
});
