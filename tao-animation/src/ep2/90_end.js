// 片尾：下集预告
defineScene({
  id: 'end', chapter: '下集预告', dur: 7.5, floor: 700,
  cast: {
    terry: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
  },
  tracks: {
    terry: {
      enter: 1.6,
      pos: [[0, [1330, 700]]],
      pose: [[0, 'stand'], [2.0, t => ({ ...POSE.wave, armR: [118, 40 + 28 * Math.sin((t - 2) * 11)] }), 0.12]],
      face: [[0, 'smile'], [2.0, 'joy', 0.05]],
      turn: [[0, -0.3]],
    },
  },
  set: [{ type: 'floor', t0: 0.2 }],
  fx: [
    { type: 'title', id: 'nx', text: '下一集', x: 620, y: 200, size: 72, t0: 0, color: 'red', rot: -3 },
    { type: 'title', id: 'a', text: '卡住，然后想通', x: 620, y: 380, size: 116, t0: 0.5 },
    { type: 'qm', id: 'qm', pos: [[0, [200, 700]]], size: 200, t0: 2.2, act: [[0, 'hop'], [3.2, 'wave']], mood: [[0, 'happy']] },
    { type: 'speech', id: 'bye', text: '下集见！', at: [1410, 380], tail: [-40, 40], speaker: 'terry', t0: 4.2, t1: 7.5, rot: 5 },
  ],
  subs: [
    { t0: 0.3, t1: 4.0, text: '下一集：卡住，然后想通。' },
    { t0: 4.2, t1: 7.2, text: '我们下集见！' },
  ],
});
