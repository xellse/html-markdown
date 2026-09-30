// 轮到你了：□ + □ + □ = 21（停下来想一想，再看答案；最后把“为什么”写出来）
(() => {
  const FL = 780;
  const eqW = size => { const f = layoutWriting({ text: '□ + □ + □ = 21', x: 0, y: 0, size, t0: 0, speed: 1 }); return f.xEnd; };
  const EQ_SIZE = 116, EQ_X = 800 - eqW(EQ_SIZE) / 2;
  defineScene({
    id: 'yourturn', chapter: '轮到你了', dur: 31.6, floor: FL,
    cast: {
      terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.3,
        pos: [[0, [175, FL]]],
        pose: [[0, 'stand'], [2.6, 'point', 0.12], [9.0, { ...POSE.stand, ikR: { w: 1, to: 'chin', dx: 0.2, dy: 0.05, bend: 'down' } }, 0.14],
          [12.6, 'cheer', 0.1, 'back'], [14.6, 'stand', 0.2], [18.4, 'point', 0.12], [22.0, 'stand', 0.2], [27.1, 'cheer', 0.1, 'back']],
        squash: [[0, 1], [12.6, 1.1, 0.06], [12.68, 1, 0.25, 'back'], [27.1, 1.1, 0.06], [27.18, 1, 0.25, 'back']],
        face: [[0, 'smile'], [2.6, 'grin', 0.05], [9.0, 'focus', 0.05], [12.6, 'joy', 0.05], [14.6, 'smile', 0.05], [18.4, 'idea', 0.05], [22.0, 'focus', 0.05], [27.1, 'joy', 0.05]],
        turn: [[0, 0.35]],
        gaze: [[0, 'viewer'], [2.6, 'eq'], [9.0, 'viewer'], [12.6, 'ans'], [14.6, 'chk'], [18.4, 'qm'], [22.0, 'why'], [27.1, 'viewer']],
      },
    },
    targets: F => ({ eq: [800, 320], ans: [800, 470], chk: [800, 590], why: [800, 690], qm: (F.anchors.qm || {}).head || [1330, 540] }),
    set: [{ type: 'floor', t0: 0.1 }],
    fx: [
      { type: 'title', id: 'yt', text: '轮到你了！', x: 800, y: 128, size: 112, t0: -0.1, color: 'red', rot: -2, underline: true, sfx: 'tada' },
      { type: 'write', id: 'eq', text: '□ + □ + □ = 21', x: EQ_X, y: 236, size: EQ_SIZE, t0: 2.7, speed: 2100, gap: 0.03, glyphGap: 0.03, w: 7, sfx: 'pen' },
      { type: 'qm', id: 'qm', pos: [[0, [1340, FL]]], size: 230, t0: 8.9,
        act: [[0, 'hop'], [9.6, 'tap'], [12.6, 'idle'], [18.4, 'tap'], [26.4, 'nod'], [29.0, 'wave']],
        mood: [[0, 'surprised'], [9.6, 'doubt'], [12.6, 'surprised'], [14.6, 'neutral'], [18.4, 'doubt'], [26.4, 'happy']],
        sign: [[0, null], [9.6, '□ 是几？'], [12.6, null], [18.4, '为什么？'], [26.4, '懂了！']] },
      { type: 'scribe', id: 'think', text: '想一想……', x: 800, y: 470, size: 64, t0: 9.2, t1: 12.6, cps: 5, color: 'red', anchor: 'middle', sfx: 'plip' },
      { type: 'write', id: 'ans', text: '□ = 7', x: 800 - 0.5 * layoutWriting({ text: '□ = 7', x: 0, y: 0, size: 112, t0: 0, speed: 1 }).xEnd, y: 404, size: 112, t0: 12.7, speed: 2200, w: 7, sfx: 'pen' },
      { type: 'ring', id: 'r7', of: 'ans', glyph: 4, t0: 13.6 },
      { type: 'highlight', id: 'hl', of: 'ans', t0: 13.3, dur: 0.3 },
      { type: 'write', id: 'chk', text: '7 + 7 + 7 = 21 ✓', x: 800 - 0.5 * layoutWriting({ text: '7 + 7 + 7 = 21 ✓', x: 0, y: 0, size: 70, t0: 0, speed: 1 }).xEnd, y: 548, size: 70, t0: 14.8, speed: 2800, color: 'red', w: 5, sfx: 'pen', endSfx: 'ding', z: Z.annot },
      { type: 'scribe', id: 'why', text: '因为：21 平均分成 3 份，每份是 7。', x: 800, y: 680, size: 60, t0: 22.3, cps: 5.2, anchor: 'middle' },
      { type: 'label', id: 'lbWhy', text: '把想法写出来', at: [318, 452], rot: -4, t0: 23.2, t1: 27.0, target: [372, 650], bend: 0.25, gap: 10 },
    ],
    pauses: [12.45],
    sfx: [[12.6, 'tada'], [26.4, 'ding']],
    subs: [
      { t0: 0.3, t1: 2.4, text: '轮到你了！' },
      { t0: 2.5, t1: 6.2, text: '三个一样的方框，加起来是21，' },
      { t0: 6.3, t1: 8.8, text: '方框里是几？' },
      { t0: 9.0, t1: 12.4, text: '想一想，想好了再点继续。' },
      { t0: 12.6, t1: 14.5, text: '答案是 7！', say: '答案是七！' },
      { t0: 14.6, t1: 18.3, text: '检查一下：7加7加7，正好21。', say: '检查一下：七加七加七，正好二十一。' },
      { t0: 18.4, t1: 21.9, text: '可是小问号还要问：为什么？' },
      { t0: 22.0, t1: 27.0, text: '把想法也写出来：21平均分成3份，每份是7。', say: '把想法也写出来：二十一平均分成三份，每份是七。' },
      { t0: 27.1, t1: 31.4, text: '小问号点头了——这就叫“写清楚”！' },
    ],
  });
})();
