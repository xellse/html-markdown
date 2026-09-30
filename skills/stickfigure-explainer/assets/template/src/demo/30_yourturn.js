// 轮到你了：停下来想（播放器自动暂停，出现“想好了吗？点这里看答案”），再揭晓
(() => {
  const FL = 780, EQ = '1+3+5+7+9 = ?', SIZE = 104;
  const w = layoutWriting({ text: EQ, x: 0, y: 0, size: SIZE, t0: 0, speed: 1 }).xEnd;
  defineScene({
    id: 'yourturn', chapter: '轮到你了', dur: 10.8, floor: FL,
    cast: {
      kid: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      kid: {
        pos: [[0, [200, FL]]],
        pose: [[0, 'kidPoint'], [4.1, 'thinkStand', 0.14], [6.9, 'kidCheer', 0.1, 'back']],
        face: [[0, 'smile'], [4.1, 'focus', 0.05], [6.9, 'joy', 0.05]],
        turn: [[0, 0.35]],
        gaze: [[0, 'eq'], [4.1, 'viewer'], [6.9, 'eq']],
      },
    },
    targets: () => ({ eq: [800, 330] }),
    set: [{ type: 'floor', t0: 0 }],
    fx: [
      { type: 'title', id: 'yt', text: '轮到你了！', x: 800, y: 118, size: 96, t0: -0.1, color: 'red', rot: -2, underline: true, sfx: 'tada' },
      { type: 'write', id: 'eq', text: EQ, x: 800 - w / 2, y: 250, size: SIZE, t0: 0.6, speed: 2600, w: 7, sfx: 'pen' },
      { type: 'scribe', id: 'think', text: '想一想……', x: 800, y: 500, size: 64, t0: 4.2, t1: 6.9, cps: 5, color: 'red', anchor: 'middle', sfx: 'plip' },
      { type: 'write', id: 'ans', text: '= 25 = 5×5 ✓', x: 800 - w / 2 + 60, y: 430, size: 96, t0: 7.0, speed: 2600, color: 'red', w: 6, sfx: 'pen', endSfx: 'ding', z: Z.annot },
      { type: 'qm', id: 'qm', pos: [[0, [1360, FL]]], size: 200, t0: 0.4, act: [[0, 'tap'], [6.9, 'nod']], mood: [[0, 'doubt'], [6.9, 'happy']] },
    ],
    pauses: [6.75],
    subs: [
      { t0: 0.3, t1: 4.0, text: '轮到你了：加到9，是多少？', say: '轮到你了：加到九，是多少？' },
      { t0: 4.1, t1: 6.7, text: '想好了再点继续。' },
      { t0: 6.9, t1: 10.4, text: '是25，也就是5乘5！', say: '是二十五，也就是五乘五！' },
    ],
  });
})();
