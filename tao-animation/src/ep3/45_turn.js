// 轮到你了：棋盘留在画面上，先别看答案，自己卡一会儿。停顿之后：“卡住的感觉来了吗？”
(() => {
  const FL = 780, TX = 1180, PAUSE = 11.75;
  defineScene({
    id: 'turn', chapter: '轮到你了', dur: 16.4, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]]],
        pose: [[0, 'thinkStand'], [3.0, 'kidPoint', 0.12, 'back'], [5.7, 'thinkStand', 0.15], [12.3, 'scratchStand', 0.12, 'back']],
        face: [[0, 'focus'], [3.0, 'grin', 0.05], [5.7, 'focus', 0.05], [12.3, 'sheepish', 0.05]],
        turn: [[0, -0.4], [3.0, 0, 0.1], [5.7, -0.4, 0.1], [12.3, 0, 0.1]],
        gaze: [[0, 'board'], [3.0, 'viewer'], [5.7, 'board'], [12.3, 'viewer']],
      },
    },
    targets: () => ({ board: E3B.MAIN.at }),
    fx: [
      { ...E3B.MAIN, type: 'e3_board', id: 'bd', t0: -1, cut: -1, color: null },
      { type: 'ageStamp', age: 10, t0: -3, ...E3.STAMP, dockT: -2 },
      { type: 'title', id: 'yt', text: '轮到你了！', x: 600, y: 120, size: 84, t0: 0.3, color: 'red', rot: -3, sfx: 'stamp' },
      { type: 'qm', id: 'qm', pos: [[0, [960, 770]]], size: 160, t0: -1, silent: true, signSide: 'left',
        act: [[0, 'tap'], [5.7, 'hop'], [6.8, 'idle'], [12.3, 'nod']], mood: [[0, 'doubt'], [12.3, 'happy']],
        sign: [[0, '为什么总剩两格？'], [5.7, '能盖满吗？为什么？']], gaze: [[0, 'board'], [3.0, 'viewer'], [12.3, 'terry']] },
      { type: 'label', id: 'lbT', text: ['先自己', '卡一会儿'], at: [1040, 250], rot: 3, t0: 3.1, t1: 11.7, target: { char: 'terry', part: 'headTop', dy: -14 }, bend: 0.25, gap: 12 },
      { type: 'speech', id: 'sp', text: '卡住啦……', at: [1340, 330], tail: [-60, 70], speaker: 'terry', t0: 12.4, t1: 16.4, size: 52, rot: 4 },
    ],
    pauses: [PAUSE],
    subs: [
      { t0: 0.3, t1: 2.9, text: '先别急着往下看。' },
      { t0: 3.0, t1: 5.6, text: '你也来卡一会儿：' },
      { t0: 5.7, t1: 8.7, text: '能不能盖满？为什么？' },
      { t0: 8.8, t1: 11.6, text: '想好了，再点继续。' },
      { t0: 12.3, t1: 15.9, text: '怎么样，卡住的感觉来了吗？' },
    ],
  });
})();
