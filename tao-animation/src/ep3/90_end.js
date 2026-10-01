// 片尾：下集预告（1986 年，第一次参加国际数学奥林匹克）
defineScene({
  id: 'end', chapter: '下集预告', dur: 7.2, floor: 700,
  cast: { terry: E3.terry },
  tracks: {
    terry: {
      enter: 1.6,
      pos: [[0, [1330, 700]]],
      pose: [[0, 'stand'], [2.0, t => ({ ...POSE.wave, armScale: 1.85, armR: [118, 22 + 25 * Math.sin((t - 2) * 11)] }), 0.12]],
      face: [[0, 'smile'], [2.0, 'joy', 0.05]],
      turn: [[0, -0.3]],
    },
  },
  set: [{ type: 'floor', t0: 0.2 }],
  fx: [
    { type: 'title', id: 'nx', text: '下一集', x: 620, y: 200, size: 72, t0: 0, color: 'red', rot: -3 },
    { type: 'title', id: 'a', text: '第一次站上世界赛场', x: 640, y: 380, size: 96, t0: 0.5 },
    { type: 'qm', id: 'qm', pos: [[0, [200, 700]]], size: 200, t0: 2.2, act: [[0, 'hop'], [3.2, 'wave']], mood: [[0, 'happy']] },
    { type: 'speech', id: 'bye', text: '下集见！', at: [1440, 345], tail: [-40, 40], speaker: 'terry', t0: 4.3, t1: 7.2, rot: 5 },
  ],
  subs: [
    { t0: 0.3, t1: 4.1, text: '下一集：第一次站上世界赛场。' },
    { t0: 4.2, t1: 6.4, text: '我们下集见！' },
  ],
});
