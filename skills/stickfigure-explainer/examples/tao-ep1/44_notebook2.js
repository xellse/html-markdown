// 小问号登场（三）：回到作业本。别人看不见你的脑子，只看得见纸上的字。小问号转身向观众挥手——以后还会常来。
(() => {
  const B = window.q1Book, FL = B.FL;
  const QM_X = 860, QM_Y = 752, TERRY_X = 1452;
  const WAVE_T = 7.35;
  const done = { t0: -30, speed: 5000, silent: true };

  /** little scratch squiggles by Terry's scratching hand (ink) */
  COMP.q1_scratch = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const h = a.handR, ph = Math.floor(t * 6) % 2;
      [0, 1].forEach(i => stroke('q1sc' + i, [[h[0] + 14 + i * 8, h[1] - 16 - i * 12 + ph * 3], [h[0] + 22 + i * 8, h[1] - 24 - i * 12], [h[0] + 30 + i * 8, h[1] - 16 - i * 12 - ph * 3]], { z: Z.fx, w: 3, boil: 0.8 }));
    },
  };
  defineScene({
    id: 'notebook2', dur: 12.0, floor: FL,
    cast: {
      terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        pos: [[0, [TERRY_X, FL]]],
        pose: [[0, 'q1_scratchStand'], [WAVE_T + 1.2, 'q1_thinkStand', 0.25]],
        face: [[0, 'puzzled'], [WAVE_T + 1.2, 'focus', 0.1]],
        turn: [[0, -0.3]],
        gaze: [[0, 'qmHead'], [3.8, 'leftPage'], [WAVE_T + 1.2, 'bigX']],
      },
    },
    targets: () => ({ qmHead: [QM_X + 10, QM_Y - 180], leftPage: [400, 430], bigX: [B.BIG.x + 200, B.BIG.y + 90] }),
    fx: [
      { type: 'prop', kind: 'q1_book', id: 'book', t0: -30, at: [0, 0], drawDur: 0 },
      ...B.LINES.map(s => ({ type: 'write', ...s, ...done, w: 6 })),
      ...B.NOTES.map(s => ({ type: 'write', ...s, ...done, w: 4 })),
      { type: 'write', ...B.BIG, ...done, w: 9 },
      { type: 'prop', kind: 'q1_rocket', id: 'rk', t0: -30, at: B.ROCKET_AT, drawDur: 0 },
      // what only Terry can see: the thought bubble above his head
      { type: 'thought', id: 'q1th', at: [1400, 330], rx: 150, ry: 70, t0: 0.5, t1: 3.65, from: { char: 'terry', part: 'headTop', dy: -30 } },
      { type: 'write', id: 'q1thw', text: '3x = 21', x: 1318, y: 306, size: 46, t0: 0.85, t1: 3.65, speed: 1500, w: 4.5, z: Z.fx + 1, sfx: 'pen' },
      { type: 'label', id: 'lbSee', text: '小问号看不见', at: [1440, 176], rot: -3, t0: 1.9, t1: 3.65, target: [1410, 262], bend: 0.2, gap: 6 },
      // what everyone can see: the written steps (yellow = the key idea)
      ...B.LINES.map((s, i) => ({ type: 'highlight', id: 'q1hl' + i, of: s.id, t0: 4.0 + i * 0.4, dur: 0.35 })),
      { type: 'q1_scratch', id: 'scr', char: 'terry', t0: 0, t1: WAVE_T + 1.2 },
      { type: 'q1_qm', id: 'qm', size: 240, t0: -30,
        pos: [[0, [QM_X, QM_Y]]],
        act: [[0, 'tap'], [3.9, 'idle'], [4.3, 'nod'], [6.3, 'idle'], [WAVE_T, 'wave']],
        mood: [[0, 'doubt'], [4.3, 'neutral'], [WAVE_T, 'happy']],
        gaze: [[0, [B.BIG.x + 200, B.BIG.y + 90]], [3.85, [400, 430]], [WAVE_T - 0.25, 'viewer']],
        sign: [[0, '为什么是 7？'], [WAVE_T - 0.05, null]],
        tilt: [[0, 0], [3.85, -6, 0.3], [WAVE_T - 0.25, 0, 0.25]],
        sfxAt: [[4.3, 'plip'], [WAVE_T, 'boop'], [WAVE_T + 0.4, 'plip']] },
    ],
    sfx: [...[0, 1, 2, 3, 4].map(i => [(0.5 + i) / 2.6, 'q1_tap'])],
    subs: [
      { t0: 0.2, t1: 3.6, text: '可是别人看不见你的脑子，' },
      { t0: 3.7, t1: 7.1, text: '只看得见你写在纸上的字。' },
      { t0: 7.2, t1: 11.7, text: '这个小问号，以后还会常常来找他。' },
    ],
  });
  Object.assign(POSE, {
    q1_thinkStand: { tilt: -6, armScale: 1.5, ikR: { w: 1, to: 'hip', dx: 24, dy: -2, bend: 'out' }, ikL: { w: 1, to: 'head', dx: -1.02, dy: 0.42, bend: 'out' } },
  });
})();
