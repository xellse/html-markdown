// 上集回顾：只写答案的“x = 7”和小问号；这一集要讲：怎样把过程写出来。
(() => {
  const FL = 760;
  /** A loose sheet of notebook paper, centred at the prop's position. fx: {w, h, lines, title} */
  PROPS.e2_page = (fx, t, lt, p) => {
    const W = fx.w || 520, H = fx.h || 520, z = Z.set, k = fx.id;
    stroke(k + '.sheet', [[-W / 2, -H / 2], [W / 2, -H / 2 + 4, 1], [W / 2 - 3, H / 2, 1], [-W / 2 + 4, H / 2 - 3, 1], [-W / 2, -H / 2, 1]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(k + '.shade', [[-W / 2 + 12, H / 2 + 8], [W / 2 + 7, H / 2 + 6, 1], [W / 2 + 7, -H / 2 + 12]], { z: z - 0.5, w: 2.4, color: C.pencil, opacity: 0.6 * p, boil: 0.5 });
    const n = fx.lines ?? 5, top = -H / 2 + (fx.title ? 110 : 70);
    for (let i = 0; i < n; i++) {
      const y = top + i * ((H / 2 - 40 - top) / Math.max(1, n - 1));
      stroke(k + '.l' + i, [[-W / 2 + 26, y], [W / 2 - 26, y + 1]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.5, draw: stag(p, 1, 3), boil: 0.4 });
    }
    stroke(k + '.m', [[-W / 2 + 60, -H / 2 + 14], [-W / 2 + 60, H / 2 - 14]], { z: z + 0.1, w: 2, color: C.red, opacity: 0.45, draw: stag(p, 2, 3), boil: 0.4 });
    if (fx.title) text(k + '.t', fx.title, 0, -H / 2 + 52, { size: 40, z: z + 0.2, opacity: clamp((lt - 0.3) / 0.2) });
  };

  const PL = [400, 430], PR = [1210, 430];
  defineScene({
    id: 'recap', chapter: '上集回顾', dur: 18.8, floor: FL,
    cast: {
      terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 0.2,
        pos: [[0, [800, FL]], [10.7, t => [800, FL - 34 * Math.sin(Math.PI * clamp((t - 10.7) / 0.3))], 0]],
        pose: [[0, 'stand'], [4.0, { armL: [40, -110], armR: [40, -110], armScale: 1.2 }, 0.12, 'back'], [8.0, 'stand', 0.2], [10.9, 'point', 0.12], [15.0, 'stand', 0.2]],
        face: [[0, 'smile'], [4.0, 'proud', 0.05], [8.0, 'neutral', 0.05], [10.9, 'idea', 0.05], [14.6, 'smile', 0.05]],
        turn: [[0, -0.3], [10.9, 0.45, 0.1]],
        gaze: [[0, 'pageL'], [4.0, 'viewer'], [8.0, 'viewer'], [10.9, 'pageR']],
        squash: [[0, 1], [10.7, 0.9, 0.06], [10.76, 1.08, 0.08], [10.9, 1, 0.2, 'back']],
      },
    },
    targets: () => ({ pageL: PL, pageR: PR }),
    fx: [
      { type: 'title', id: 'stampR', text: '上集回顾', x: 150, y: 110, size: 44, t0: -0.1, color: 'red', rot: -6 },
      { type: 'prop', kind: 'e2_page', id: 'pl', at: PL, rot: -2, t0: -0.3, w: 480, h: 500, title: '只写答案' },
      { type: 'write', id: 'x7', text: 'x = 7', x: PL[0] - 130, y: 236, size: 124, t0: -2, speed: 3000, w: 8, silent: true },
      { type: 'qm', id: 'qm', pos: [[0, [540, 676]]], size: 170, t0: 0.9, act: [[0, 'tap'], [14.6, 'nod']], mood: [[0, 'doubt'], [14.6, 'happy']],
        sign: [[0, '为什么是 7？'], [14.6, null]], gaze: [[0, 'viewer'], [11.2, 'pageR']] },
      { type: 'speech', id: 'glance', text: ['这不是一眼', '就看出来了吗！'], at: [1060, 330], tail: [-120, 60], speaker: 'terry', t0: 4.0, t1: 7.9, size: 60, rot: -3 },
      // this episode: the answer grows its steps
      { type: 'prop', kind: 'e2_page', id: 'pr', at: PR, rot: 2, t0: 10.8, w: 480, h: 500, title: '写出过程' },
      { type: 'write', id: 's1', text: '3x + 5 = 26', x: PR[0] - 196, y: 300, size: 56, t0: 11.4, speed: 2600, w: 6, sfx: 'pen' },
      { type: 'write', id: 's2', text: '3x = 21', x: PR[0] - 120, y: 400, size: 56, t0: 12.6, speed: 2600, w: 6, sfx: 'pen' },
      { type: 'write', id: 's3', text: 'x = 7', x: PR[0] - 84, y: 500, size: 56, t0: 13.6, speed: 2600, w: 6, sfx: 'pen' },
      { type: 'label', id: 'lbThis', text: '这一集', at: [805, 150], rot: -3, t0: 10.9, t1: 18.8, target: [1000, 210], bend: -0.3, gap: 10, size: 48 },
    ],
    sfx: [[0.2, 'hop'], [10.7, 'hop']],
    subs: [
      { t0: 0.3, t1: 3.9, text: '上一集，小陶有句口头禅——' },
      { t0: 4.0, t1: 7.9, text: '“这不是一眼就看出来了吗！”', voice: 'kid' },
      { t0: 8.0, t1: 10.8, text: '这一集，我们来看看：' },
      { t0: 10.9, t1: 14.5, text: '一个“一眼就看出来”的孩子，' },
      { t0: 14.6, t1: 18.5, text: '是怎么学会把过程写出来的。' },
    ],
  });
})();
