// 片尾：下集预告（最后一集：长大的小陶，发现聪明不够用了）
defineScene({
  id: 'end', chapter: '下集预告', dur: 10.7, floor: 700,
  cast: { terry: E5.teen },
  tracks: {
    terry: {
      enter: 4.2,
      pos: [[0, [1330, 700]]],
      pose: [[0, 'stand'], [4.6, 'scratchStand', 0.12], [7.4, t => ({ ...POSE.wave, armScale: 1.6, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 7.4) * 11)] }), 0.12]],
      face: [[0, 'puzzled'], [7.4, 'joy', 0.06]],
      turn: [[0, -0.3]],
    },
  },
  set: [{ type: 'floor', t0: 0.2 }],
  fx: [
    { type: 'title', id: 'nx', text: '下一集 · 最后一集', x: 620, y: 200, size: 72, t0: 0, color: 'red', rot: -3 },
    { type: 'title', id: 'a', text: '聪明，不够用了', x: 640, y: 380, size: 96, t0: 3.3 },
    { type: 'mark', id: 'mk', char: '?', on: ['terry'], t0: 5.0, t1: 7.3 },
    { type: 'qm', id: 'qm', pos: [[0, [200, 700]]], size: 200, t0: 5.4, act: [[0, 'hop'], [7.6, 'wave']], mood: [[0, 'happy']] },
    { type: 'speech', id: 'bye', text: '下集见！', at: [1460, 330], tail: [-40, 40], speaker: 'terry', t0: 7.9, t1: 10.7, rot: 5 },
  ],
  subs: [],   // filled from the script below
});
