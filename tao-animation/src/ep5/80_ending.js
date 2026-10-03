// 尾声：好玩 / 认真；那门没及格的课告诉我们：不喜欢的事，也要认真做；喜欢的认真玩，不喜欢的也认真学；
// 最后小陶回到一张卡住的题纸前：“卡住了？回去，再试一次！”（他 9 岁小文章里写的习惯）
(() => {
  const FL = 780, TX = 1260, PG = [760, 540];
  /** 一本合上的书，封面上写着字。{at, t0, t1, title} */
  COMP.h5_book = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const p = EASE.back(clamp((t - fx.t0) / 0.35)), op = fx.t1 !== undefined ? 1 - clamp((t - fx.t1 + 0.3) / 0.3) : 1, k = fx.id, z = Z.front + 3, [x, y] = fx.at;
      DL.save(); DL.translate(x, y); DL.scale(p); DL.rotate(-6);
      stroke(k + '.c', superPts(0, 0, 120, 150, 20, 10), { z, w: 4.5, closed: true, fill: C.paper, opacity: op });
      stroke(k + '.sp', [[-52, -70], [-52, 70]], { z: z + 0.1, w: 3, opacity: op });
      text(k + '.t', fx.title || '书', 6, -10, { size: 40, z: z + 0.2, opacity: op });
      DL.restore();
    },
    cues: fx => [[fx.t0, 'pop']],
  };
  const A = 8.7, B = 16.6, C2 = 21.7;   // section changes
  defineScene({
    id: 'ending', chapter: '尾声', dur: 26.4, floor: FL,
    cast: { terry: E5.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [C2, [1120, FL], 0.5, 'io'], [25.7, [1800, FL], 0.6, 'in']],
        pose: [[0, 'stand'], [0.4, 'kidCheer', 0.12, 'back'], [3.6, 'stand', 0.2], [4.2, 'akimbo', 0.15, 'back'], [A, 'stand', 0.2], [12.8, 'thinkStand', 0.2], [B, 'stand', 0.2],
          [C2 + 0.5, { ...POSE.stand, lean: -6, armScale: 1.7, ikL: { w: 1, to: [PG[0] + 40, PG[1] - 20], bend: 'down' } }, 0.2], [25.0, 'kidCheer', 0.12, 'back']],
        face: [[0, 'joy'], [4.2, 'proud', 0.05], [A, 'neutral', 0.06], [12.8, 'focus', 0.06], [B, 'smile', 0.06], [C2, 'puzzled', 0.06], [23.4, 'idea', 0.05], [25.0, 'joy', 0.05]],
        turn: [[0, -0.3], [C2, -0.5, 0.15], [25.0, -0.1, 0.1]],
        gaze: [[0, 'viewer'], [0.6, 'w1'], [4.4, 'w2'], [A, 'card'], [B, 'viewer'], [C2, 'page'], [25.0, 'viewer']],
      },
    },
    targets: () => ({ w1: [420, 250], w2: [420, 440], card: [760, 440], page: PG }),
    fx: [
      { type: 'ageStamp', label: '长大后', t0: -3, ...E5.STAMP, dockT: -2, t1: 0.6 },   // carried over from the marathon scene, then retired
      // ① 好玩 / 认真
      { type: 'title', id: 'w1', text: '好玩', x: 420, y: 250, size: 130, t0: 0.4, t1: A },
      { type: 'title', id: 'w1s', text: '一次次回到题目前', x: 700, y: 262, size: 44, t0: 1.6, t1: A, color: 'red', anchor: 'start', rot: -2 },
      { type: 'title', id: 'w2', text: '认真', x: 420, y: 440, size: 130, t0: 4.3, t1: A, underline: true },
      { type: 'title', id: 'w2s', text: '证明写到让人忘不了', x: 700, y: 452, size: 44, t0: 5.4, t1: A, color: 'red', anchor: 'start', rot: -2 },
      { type: 'e5_medal', id: 'au', char: 'terry', r: 38, drop: 52, label: '金', t0: 0.4, t1: A, shine: [1.0] },
      { type: 'h5_book', id: 'bk', at: [TX + 150, FL - 190], title: '解题', t0: 4.4, t1: A },
      // ② 那门没及格的课
      { type: 'e5_course', id: 'co', at: [760, 440], title: '无聊的课', t0: 8.8, stampT: 10.0, t1: B, rot: -4 },
      { type: 'title', id: 'also', text: '也要认真做', x: 1020, y: 300, size: 64, t0: 13.0, t1: B, color: 'red', rot: 4, sfx: 'pen' },
      // ③ 喜欢的认真玩，不喜欢的也认真学
      { type: 'title', id: 'g1', text: '喜欢的，认真玩；', x: 600, y: 260, size: 78, t0: 16.65, t1: C2 },
      { type: 'title', id: 'g2', text: '不喜欢的，也认真学。', x: 640, y: 400, size: 78, t0: 18.9, t1: C2, underline: true },
      // ④ 回去，再试一次
      { type: 'prop', id: 'pg', kind: 'e5_page', at: PG, w: 380, h: 300, lines: 0, t0: C2, t1: 26.0, drawDur: 0.4 },
      { type: 'title', id: 'q', text: '?', x: PG[0], y: PG[1] - 40, size: 110, t0: C2 + 0.2, t1: 24.2, color: 'red' },
      { type: 'write', id: 'ok', text: '✓', x: PG[0] - 30, y: PG[1] - 90, size: 110, t0: 24.3, t1: 26.0, color: 'red', sfx: 'ding' },
      { type: 'speech', id: 'again', text: ['卡住了？', '回去，再试一次！'], at: [1200, 230], tail: [20, 110], size: 64, speaker: 'terry', t0: 22.1, t1: 26.0, rot: 4 },
    ],
    subs: [
      { t0: 0.3, t1: 4.1, text: '好玩，让他一次次回到题目前；' },
      { t0: 4.2, t1: 8.4, text: '认真，让他把证明写到让人忘不了。' },
      { t0: 9.1, t1: 12.5, text: '那门没及格的课告诉我们：' },
      { t0: 12.8, t1: 16.2, text: '不喜欢的事，也要认真做。' },
      { t0: 16.9, t1: 21.5, text: '喜欢的，认真玩；不喜欢的，也认真学。' },
      { t0: 22.1, t1: 25.91, text: '“卡住了？回去，再试一次！”', voice: 'kid' },
    ],
  });
})();
