// 片尾：下集预告（1987 银牌、1988 金牌）
defineScene({
  id: 'end', chapter: '下集预告', dur: 7.5, floor: 700,
  cast: { terry: E4.terry },
  tracks: {
    terry: {
      enter: 1.6,
      pos: [[0, [1330, 700]]],
      pose: [[0, 'stand'], [2.0, t => ({ ...POSE.wave, armScale: 1.85, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 2) * 11)] }), 0.12]],
      face: [[0, 'smile'], [2.0, 'joy', 0.05]],
      turn: [[0, -0.3]],
    },
  },
  set: [{ type: 'floor', t0: 0.2 }],
  fx: [
    { type: 'title', id: 'nx', text: '下一集', x: 620, y: 200, size: 72, t0: 0, color: 'red', rot: -3 },
    { type: 'title', id: 'a', text: '一年上一级：银牌和金牌', x: 640, y: 380, size: 88, t0: 0.5 },
    { type: 'qm', id: 'qm', pos: [[0, [200, 700]]], size: 200, t0: 2.2, act: [[0, 'hop'], [3.2, 'wave']], mood: [[0, 'happy']] },
    { type: 'speech', id: 'bye', text: '下集见！', at: [1440, 345], tail: [-40, 40], speaker: 'terry', t0: 4.75, t1: 7.5, rot: 5 },
  ],
  subs: [
    { t0: 0.3, t1: 4.5, text: '下一集：一年上一级，银牌和金牌。' },
    { t0: 4.75, t1: 7.0, text: '我们下集见！' },
  ],
});
