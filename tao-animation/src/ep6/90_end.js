// 片尾（全剧终）：送给你的最后一个问题——3、5、7 每次加 2、全是质数，还有别的一组吗？右下角倒着印一行答案。
/** 让 inner（另一个 fx）在 [f0, f0 + fd] 里淡出，而不是一帧消失 */
COMP.h6_fade = {
  init(fx) { const c = COMP[fx.inner.type]; if (c.init) c.init(fx.inner); },
  draw(fx, t, F) {
    const k = 1 - clamp((t - fx.f0) / fx.fd); if (k <= 0) return;
    const n0 = DL.items.length;
    COMP[fx.inner.type].draw(fx.inner, t, F);
    if (k < 1) for (let i = n0; i < DL.items.length; i++) { const a = DL.items[i].attrs; a.opacity = +((a.opacity ?? 1) * k).toFixed(3); }
  },
  cues: fx => (COMP[fx.inner.type].cues ? COMP[fx.inner.type].cues(fx.inner) : []),
};
defineScene({
  id: 'end', chapter: '最后一个问题', dur: 24.0, floor: 780,
  // carried over from the ending: the new child at the desk, with the little question mark beside him
  cast: { kid: E6.kid },
  tracks: {
    kid: {
      pos: [[0, [1385, 780]]],
      pose: [[0, 'kidCheer'], [0.7, 'stand', 0.2], [4.2, 'thinkStand', 0.2], [18.6, t => ({ ...POSE.wave, armScale: 1.6, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, armR: [118, 22 + 25 * Math.sin((t - 18.6) * 11)] }), 0.12]],
      face: [[0, 'joy'], [0.7, 'smile', 0.06], [4.2, 'focus', 0.06], [12.4, 'idea', 0.05], [18.6, 'joy', 0.05]],
      turn: [[0, -0.3]],
      gaze: [[0, 'q'], [18.6, 'viewer']],
    },
  },
  targets: () => ({ q: [640, 420] }),
  fx: [
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'title', id: 'q', text: '最后一个问题', x: 640, y: 150, size: 72, t0: 0.2, color: 'red', rot: -3 } },
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'write', id: 'w', text: '3 , 5 , 7', x: 470, y: 250, size: 120, t0: 3.9, speed: 2600 } },
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'title', id: 'p1', text: '+2', x: 548, y: 420, size: 52, t0: 5.4, color: 'red' } },
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'title', id: 'p2', text: '+2', x: 720, y: 420, size: 52, t0: 5.9, color: 'red' } },
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'title', id: 'ok', text: '全是质数 ✓', x: 1110, y: 300, size: 56, t0: 6.6, color: 'red', rot: 3 } },
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'title', id: 'qq', text: '还有别的一组吗？', x: 640, y: 540, size: 80, t0: 8.9, underline: true } },
    { type: 'h6_fade', f0: 18.0, fd: 0.45, inner: { type: 'title', id: 'hint', text: '提示：每次加 2 的三个数里，总有 3 的倍数。', x: 560, y: 660, size: 46, t0: 12.3, color: 'red' } },
    { type: 'title', id: 'fin', text: '全剧终 · 谢谢观看！', x: 800, y: 380, size: 110, t0: 18.5, sfx: 'stamp' },
    { type: 'title', id: 'ser', text: '《数学少年陶哲轩》', x: 800, y: 230, size: 64, t0: 18.9, color: 'red' },
    { type: 'e6_desk', id: 'desk', at: [1220, 650], t0: -1 },
    { type: 'qm', id: 'qm', pos: [[0, [1010, 560]], [0.9, [1275, 650], 0.8, 'io']], size: 150, t0: -1, act: [[0, 'hop'], [18.6, 'hop'], [20.4, 'wave']], mood: [[0, 'happy']], sign: [[-1, '轮到你了！'], [0.8, null]], signSize: 70, silent: true },
    // the answer, printed upside down in the corner like a puzzle book
    { type: 'title', id: 'ans', text: '答案：没有！3 的倍数里，只有 3 是质数。', x: 520, y: 770, size: 34, t0: 12.6, rot: 180, color: 'red' },
  ],
  subs: [
    { t0: 0.3, t1: 3.5, text: '最后一个问题，送给你：' },
    { t0: 3.8, t1: 8.0, text: '3、5、7：每次加2，全是质数。', say: '三、五、七：每次加二，全是质数。' },
    { t0: 8.9, t1: 11.5, text: '还有别的一组吗？' },
    { t0: 12.2, t1: 17.8, text: '提示：每次加2的三个数里，总有3的倍数。', say: '提示：每次加二的三个数里，总有一个是三的倍数。' },
    { t0: 18.7, t1: 23.5, text: '《数学少年陶哲轩》，全剧终。谢谢观看！' },
  ],
});
