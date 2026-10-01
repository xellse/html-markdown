// 尾声：其实在这之前，他就跌过一跤（考澳大利亚数学奥林匹克，没能进国家队；
// 父母说：进步飞快，但根还没扎深——Gross 1986 的个案研究）。学会面对卡住，他还要花很多年
// （父亲说真正的转变在普林斯顿读研时，17–20 岁），十岁才刚开始。三句金句收尾。
(() => {
  const FL = 780, TX = 1250, G = [820, 540];   // the little plant's own patch of ground
  const GOLD = [['看出来，靠聪明；', 26.6], ['写清楚，靠练习；', 29.3], ['想通，靠的是不放弃。', 32.0]];

  /** 一棵小苗：茎蹿得飞快、根很浅，风一吹就晃；后来根一点点扎深，就稳了。
   *  {at: 地面点, t0, t1, h: [[t, 高]], root: [[t, 根深]]} */
  COMP.h3_plant = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const [gx, gy] = fx.at, H = evalTrack(fx.h, t), R = evalTrack(fx.root, t), k = fx.id, z = Z.set + 2;
      const op = fx.t1 !== undefined ? 1 - clamp((t - fx.t1 + 0.3) / 0.3) : 1;
      // ground strip with a few soil specks
      stroke(k + '.g', [[gx - 230, gy], [gx + 230, gy + 2]], { z, w: 4, draw: EASE.out(clamp((t - fx.t0) / 0.4)), opacity: op });
      for (let i = 0; i < 9; i++) dot(k + '.s' + i, [gx - 200 + i * 50 + (i % 3) * 7, gy + 26 + (i % 2) * 34], 3, C.pencil, z);
      // wobble: a tall stem on shallow roots sways a lot
      const ratio = clamp(H / Math.max(30, R * 3.2), 0, 2.2), sway = Math.sin(t * 4.2) * 7 * Math.max(0, ratio - 0.6);
      const pts = []; const n = 8;
      for (let i = 0; i <= n; i++) { const u = i / n; pts.push([gx + Math.sin(u * 2.2) * 6 + sway * u * u, gy - H * u]); }
      stroke(k + '.stem', pts, { z: z + 0.2, w: 5, opacity: op });
      // leaves: pairs along the stem
      const nl = Math.floor(H / 70);
      for (let i = 0; i < nl; i++) {
        const u = (i + 0.7) / (nl + 0.5), p = pts[Math.round(u * n)] || pts[n], s = i % 2 ? 1 : -1, L = 34 + 6 * (i % 2);
        stroke(k + '.lf' + i, [[p[0], p[1]], [p[0] + s * L * 0.55, p[1] - L * 0.55], [p[0] + s * L, p[1] - L * 0.15], [p[0], p[1]]], { z: z + 0.1, w: 3.5, closed: true, fill: C.paper, opacity: op });
      }
      // roots: three main strands that grow down, plus small side roots
      [[-0.5, 0], [0, 1], [0.55, 2]].forEach(([dx, j]) => {
        const rp = []; for (let i = 0; i <= 6; i++) { const u = i / 6; rp.push([gx + dx * R * 0.45 * u + Math.sin(u * 5 + j) * 6, gy + R * u * (j === 1 ? 1 : 0.8)]); }
        if (R > 4) stroke(k + '.r' + j, rp, { z, w: 3.4, opacity: op });
        if (R > 60) [0.4, 0.7].forEach((u, q) => { const p = rp[Math.round(u * 6)]; stroke(k + '.rs' + j + q, [p, [p[0] + (q ? 18 : -18), p[1] + 22]], { z, w: 2.4, opacity: op }); });
      });
    },
  };

  /** the little rock he trips over */
  COMP.h3_rock = {
    draw(fx, t) {
      if (t < fx.t0 || t >= fx.t1) return;
      const [x, y] = fx.at, p = EASE.out(clamp((t - fx.t0) / 0.3));
      stroke(fx.id, [[x - 26, y], [x - 20, y - 16], [x - 4, y - 24], [x + 16, y - 18], [x + 26, y]], { z: Z.set + 1, w: 4.5, fill: C.paper, draw: p });
    },
  };
  defineScene({
    id: 'ending', chapter: '尾声', dur: 40.3, floor: FL,
    cast: { terry: E3.terry },
    tracks: {
      terry: {
        pos: [[0, [TX, FL]], [35.6, [TX - 30, FL - 2], 0.25]],
        // trips at "跌过一跤", sits up sheepish, gets up; at the end sits down on purpose to "先卡一会儿"
        pose: [[0, 'stand'], [1.6, { ...POSE.stand, lean: 16, tilt: 10, armL: [120, 20], armR: [130, 20] }, 0.1], [2.0, { ...POSE.sitFloor, lean: -6 }, 0.12, 'back'],
          [4.4, 'stand', 0.25], [8.6, { ...POSE.stand, lean: 4, tilt: 10 }, 0.15], [11.6, 'thinkStand', 0.2], [18.6, 'stand', 0.2], [22.7, 'akimbo', 0.15, 'back'],
          [26.6, 'stand', 0.2], [35.6, { ...POSE.sitFloor, armScale: 1.5, ikR: { w: 1, to: 'head', dx: 0.85, dy: 0.5, bend: 'down' } }, 0.25, 'back']],
        face: [[0, 'smile'], [1.6, 'surprised', 0.04], [2.0, 'sheepish', 0.06], [4.4, 'focus', 0.05], [8.6, 'sheepish', 0.06], [11.6, 'neutral', 0.06], [18.6, 'focus', 0.05], [22.7, 'proud', 0.05], [26.6, 'smile', 0.06], [35.6, 'grin', 0.05]],
        turn: [[0, -0.4], [11.6, -0.5, 0.1], [26.6, -0.25, 0.1], [35.6, 0, 0.1]],
        gaze: [[0, 'viewer'], [1.6, [TX - 80, FL]], [4.4, 'sign'], [11.6, 'plant'], [22.7, 'viewer'], [26.6, 'gold'], [35.6, 'viewer']],
        squash: [[0, 1], [2.0, 0.86, 0.06], [2.06, 1, 0.25, 'back'], [35.6, 0.92, 0.05], [35.66, 1, 0.22, 'back']],
      },
    },
    targets: () => ({ sign: [560, 240], plant: [G[0], G[1] - 160], gold: [560, 330] }),
    fx: [
      { type: 'ageStamp', age: 10, t0: -1000, ...E3.STAMP, dockT: -999, pulse: [22.9] },
      { type: 'speedLines', char: 'terry', part: 'footL', t0: 1.6, t1: 2.2 },
      // the selection exam and the team it didn't get him into
      { type: 'title', id: 'amo', text: '澳大利亚数学奥林匹克', x: 560, y: 200, size: 62, t0: 4.5, t1: 11.5, underline: true, ucolor: 'ink' },
      { type: 'title', id: 'team', text: '国家队 →', x: 560, y: 330, size: 70, t0: 8.6, t1: 11.5 },
      { type: 'strike', id: 'nx', rect: [430, 300, 230, 64], t0: 9.0, t1: 11.5, dur: 0.25 },
      { type: 'title', id: 'nope', text: '没进', x: 760, y: 322, size: 60, t0: 9.3, t1: 11.5, color: 'red', rot: 8, sfx: 'stamp' },
      { type: 'h3_rock', id: 'rock', at: [TX - 96, FL], t0: 0.2, t1: 4.4 },
      // "progressed extraordinarily fast … had not set down deep roots"
      { type: 'h3_plant', id: 'pl', at: G, t0: 11.6, t1: 26.6, h: [[0, 0], [11.7, 0], [12.4, 330, 0.9, 'out'], [18.6, 330], [19.0, 360, 6, 'io']], root: [[0, 0], [12.4, 22, 0.6], [18.6, 22], [19.0, 190, 6.5, 'io']] },
      { type: 'label', id: 'lbFast', text: '跑得飞快', at: [560, 230], rot: -4, t0: 12.6, t1: 26.6, target: [G[0] - 14, G[1] - 260], bend: 0.2, gap: 12 },
      { type: 'label', id: 'lbRoot', text: ['根还', '没扎深'], at: [520, 640], rot: 3, t0: 15.2, t1: 18.6, target: [G[0] - 10, G[1] + 26], bend: -0.25, gap: 12 },
      { type: 'title', id: 'mama', text: '（爸爸妈妈说）', x: 1100, y: 150, size: 40, t0: 11.7, t1: 18.6, color: 'red', rot: 3 },
      { type: 'label', id: 'lbYears', text: '很多年', at: [520, 660], rot: 3, t0: 19.2, t1: 26.6, target: [G[0] - 30, G[1] + 120], bend: -0.25, gap: 12 },
      // the series' golden lines
      ...GOLD.map(([s, t0], i) => ({ type: 'title', id: 'g' + i, text: s, x: 560, y: 220 + i * 110, size: 66, t0 })),
      { type: 'band', id: 'hiG', rect: [560 - 330 + 6 * 66, 220 + 220 - 40, 3 * 66, 80], t0: 33.4, dur: 0.45 },
      { type: 'qm', id: 'qm', pos: [[0, [1020, 770]]], size: 150, t0: 35.6, burst: true, act: [[0, 'hop'], [1.2, 'nod']], mood: [[0, 'happy']], gaze: [[0, 'terry']] },
      { type: 'speech', id: 'yay', text: ['卡住了？没关系，', '先卡一会儿！'], at: [1300, 380], tail: [-40, 110], speaker: 'terry', t0: 35.7, t1: 40.3, size: 52, rot: -3 },
    ],
    sfx: [[2.0, 'thud'], [9.0, 'buzz'], [12.4, 'whoosh'], [35.6, 'hop']],
    subs: [
      { t0: 0.3, t1: 4.3, text: '其实在这之前，小陶就跌过一跤：' },
      { t0: 4.4, t1: 8.2, text: '他去考澳大利亚数学奥林匹克，' },
      { t0: 8.6, t1: 11.0, text: '没能进国家队。' },
      { t0: 11.6, t1: 15.0, text: '爸爸妈妈说：他跑得飞快，' },
      { t0: 15.1, t1: 17.9, text: '可是根，还没扎深。' },
      { t0: 18.6, t1: 22.6, text: '学会面对卡住，他还要花很多年。' },
      { t0: 22.7, t1: 25.9, text: '十岁这年，才刚刚开始。' },
      { t0: 26.6, t1: 29.2, text: '看出来，靠聪明；' },
      { t0: 29.3, t1: 31.9, text: '写清楚，靠练习；' },
      { t0: 32.0, t1: 35.0, text: '想通，靠的是不放弃。' },
      { t0: 35.6, t1: 39.79, text: '“卡住了？没关系，先卡一会儿！”', voice: 'kid' },
    ],
  });
})();
