// 上集回顾：1986 年的成绩单和铜牌，红圈圈住 0 分那一格（直直地看着错）；“这一集”：银牌、金牌，还有一张盖着“不及格”的课程卡。
(() => {
  const FL = 770, TX = 1250, OUT = 15.7;
  defineScene({
    id: 'recap', chapter: '上集回顾', dur: 16.1, floor: FL,
    cast: { terry: { ...E5.terry9, H: 262 } },
    tracks: {
      terry: {
        enter: 0.6,
        pos: [[0, [TX, FL]], [8.5, [1760, FL], 0.6, 'in']],
        pose: [[0, 'stand'], [1.4, 'kidCheer', 0.12, 'back'], [3.4, 'stand', 0.2], [5.0, { ...POSE.stand, armScale: 1.7, ikL: { w: 1, to: [1060, 330], bend: 'out' } }, 0.15, 'back'], [8.4, 'stand', 0.15]],
        face: [[0, 'smile'], [1.4, 'joy', 0.05], [4.8, 'focus', 0.06]],
        turn: [[0, -0.3]],
        gaze: [[0, 'viewer'], [4.8, 'zero']],
      },
    },
    targets: F => ({ zero: F.targets['rc.s4'] || [900, 140] }),
    fx: [
      { type: 'title', id: 'yr', text: '第 4 集', x: 300, y: 330, size: 54, t0: 0.2, t1: 5.4, color: 'red', rot: -4 },
      { type: 'e5_scores', id: 'rc', at: [760, 170], cell: 96, t0: 0.4, t1: 9.0, scores: [7, 7, 3, 1, 0, 1].map((v, i) => [v, 0.7 + i * 0.12]), total: [19, 1.6], ringT: [[4, 5.2]] },
      { type: 'e5_medal', id: 'bz', char: 'terry', r: 38, drop: 52, label: '铜', t0: 1.4, t1: 8.9, shine: [2.0] },
      { type: 'label', id: 'look', text: '直直地看着', at: [560, 450], size: 50, rot: -4, t0: 5.6, t1: 8.9, target: { target: 'rc.s4', dx: -56, dy: 22 }, bend: 0.2 },
      { type: 'title', id: 'this', text: '这一集', x: 800, y: 170, size: 70, t0: 8.9, t1: OUT, color: 'red', rot: -3 },
      { type: 'e5_medal', id: 'ag', at: [440, 430], r: 80, label: '银', t0: 9.4, t1: OUT, shine: [9.9] },
      { type: 'e5_medal', id: 'au', at: [800, 430], r: 80, label: '金', t0: 10.4, t1: OUT, shine: [10.9] },
      { type: 'e5_course', id: 'co', at: [1170, 470], title: '一门课', t0: 12.7, stampT: 13.6, t1: OUT, rot: 5 },
    ],
    subs: [
      { t0: 0.3, t1: 4.7, text: '上一集，十岁的小陶拿到了一块铜牌，' },
      { t0: 4.8, t1: 8.6, text: '我们还学会了：直直地看着错。' },
      { t0: 9.2, t1: 12.2, text: '这一集：银牌、金牌，' },
      { t0: 12.6, t1: 15.6, text: '还有一门没及格的课。' },
    ],
  });
})();
