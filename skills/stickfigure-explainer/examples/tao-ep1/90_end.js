// 片尾：下集预告
defineScene({
  id: 'end', chapter: '下集预告', dur: 7, floor: 700,
  cast: {
    terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
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
    { type: 'title', id: 'a', text: '看出来', x: 400, y: 380, size: 120, t0: 0.5 },
    { type: 'write', id: 'neq', text: '≠', x: 575, y: 318, size: 130, t0: 1.0, speed: 1800, color: 'red', w: 9, sfx: 'pen', z: Z.annot },
    { type: 'title', id: 'b', text: '证出来', x: 840, y: 380, size: 120, t0: 1.3 },
    { type: 'q1_qm', id: 'qm', pos: [[0, [180, 700]]], size: 190, t0: 2.2, act: [[0, 'hop'], [3.2, 'idle']], mood: [[0, 'doubt']], sign: [[0, null], [3.2, '为什么？']] },
    { type: 'speech', id: 'bye', text: '下集见！', at: [1410, 400], tail: [-40, 40], speaker: 'terry', t0: 4.0, t1: 7, rot: 5 },
  ],
  subs: [
    { t0: 0.3, t1: 3.9, text: '下一集：看出来，不等于证出来。' },
    { t0: 4.0, t1: 6.9, text: '我们下集见！' },
  ],
});
