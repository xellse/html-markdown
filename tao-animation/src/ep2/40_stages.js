// 三级台阶：陶哲轩长大后在文章《There's more to mathematics than rigour and proofs》里，
// 把学数学分成三个阶段：凭感觉（前严谨）→ 讲道理（严谨）→ 感觉更准（后严谨）。
// 八九岁的小陶正从第一级台阶，费劲地迈上第二级。
(() => {
  const FL = 770;
  // the staircase: three blocks rising left to right (tread y, x-range)
  const ST = [
    { y: 650, x0: 180, x1: 600 },
    { y: 530, x0: 600, x1: 1020 },
    { y: 410, x0: 1020, x1: 1420 },
  ];
  const stepTop = x => (x < ST[1].x0 ? ST[0].y : x < ST[2].x0 ? ST[1].y : ST[2].y);

  /* ---------------- set: the big hand-drawn staircase ---------------- */
  SETDRAW.p2s_stairs = (s, p) => {
    const z = Z.set, st = i => stag(p, i, 4);
    stroke('p2s.out', [[ST[0].x0, FL], [ST[0].x0, ST[0].y, 1], [ST[0].x1, ST[0].y, 1], [ST[1].x0, ST[1].y, 1], [ST[1].x1, ST[1].y, 1],
      [ST[2].x0, ST[2].y, 1], [ST[2].x1, ST[2].y, 1], [ST[2].x1, FL, 1]], { z, w: 6, draw: st(0), fill: C.paper });
    stroke('p2s.d1', [[ST[1].x0, ST[0].y], [ST[1].x0, FL]], { z: z + 0.2, w: 4, draw: st(1) });
    stroke('p2s.d2', [[ST[2].x0, ST[1].y], [ST[2].x0, FL]], { z: z + 0.2, w: 4, draw: st(1) });
    stroke('p2s.floor', [[40, FL], [800, FL + 2], [1560, FL - 1]], { z, w: 2.2, color: C.pencil, opacity: 0.8, draw: st(0) });
  };

  /* ---------------- little helpers ---------------- */
  /** a word written in, character by character, centred on (x, y). {text, x, y, size, t0, cps, color} */
  COMP.p2s_word = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const chars = [...fx.text], n = Math.min(chars.length, Math.floor((t - fx.t0) * (fx.cps || 9)) + 1);
      const size = fx.size || 56, x = fx.x - textWidth(fx.text, size) / 2;
      text(fx.id, chars.slice(0, n).join(''), x, fx.y, { size, anchor: 'start', color: fx.color === 'red' ? C.red : C.ink, z: fx.z ?? Z.board });
    },
    cues: fx => { const c = [], n = [...fx.text].length; for (let i = 0; i < n; i += 2) c.push([fx.t0 + i / (fx.cps || 9), 'pen']); return c; },
  };
  /** yellow highlighter swipe over a box [x0, y0, x1, y1] */
  COMP.p2s_hl = {
    draw(fx, t) {
      const p = EASE.out(clamp((t - fx.t0) / (fx.dur || 0.4))); if (p <= 0) return;
      const [x0, y0, x1b, y1] = fx.box, x1 = lerp(x0, x1b, p), n = 8, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); top.push([x, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([x, y1 + Math.sin(i * 2.3) * 4]); }
      stroke(fx.id, top.concat(bot), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    },
    cues: fx => [[fx.t0, 'swish']],
  };
  /** ground shadow that follows a character over the steps (the rig's own shadow only knows one floor) */
  COMP.p2s_shadow = {
    draw(fx, t) {
      const tr = TRACKS[fx.char]; if (!tr || (tr.enter !== undefined && t < tr.enter)) return;
      const p = evalTrack(tr.pos, t), top = fx.fixed ?? stepTop(p[0]);
      const lift = clamp((top - p[1]) / 90);
      shadow('p2s.sh' + fx.char, p[0], top + 4, fx.w * (1 - lift * 0.5), 1 - lift * 0.6);
    },
  };
  /** sweat drops popping off a character's head */
  COMP.p2s_sweat = {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      [0, 1].forEach(i => {
        const ph = ((t - fx.t0) * 1.3 + i * 0.5) % 1, o = Math.sin(Math.PI * ph);
        const s = i ? -1 : 1, c = [a.head[0] + s * (a.r + 22 + ph * 40), a.head[1] - a.r * 0.6 + ph * ph * 50 - 20];
        stroke('p2s.sw' + i, [[c[0], c[1] - 16], [c[0] + 9, c[1] + 2], [c[0], c[1] + 9], [c[0] - 9, c[1] + 2], [c[0], c[1] - 16]], { z: Z.fx, w: 3.4, fill: C.paper, opacity: o });
      });
    },
  };
  /** the essay: a sheet held in the grown-up's left hand */
  COMP.p2s_essay = {
    draw(fx, t, F) {
      if (t < fx.t0) return;
      const a = F.anchors.tao; if (!a) return;
      const h = a.handL, p = EASE.back(clamp((t - fx.t0) / 0.3));
      DL.save(); DL.translate(h[0] - 30, h[1] - 34); DL.rotate(-6); DL.scale(p);
      const W = 104, H = 136, z = Z.front + 1;
      stroke('p2s.es', [[-W / 2, -H / 2], [W / 2, -H / 2, 1], [W / 2, H / 2, 1], [-W / 2, H / 2, 1], [-W / 2, -H / 2, 1]], { z, w: 4.5, fill: C.paper });
      stroke('p2s.est', [[-W / 2 + 14, -H / 2 + 22], [W / 2 - 14, -H / 2 + 20]], { z: z + 0.1, w: 5 });
      for (let i = 0; i < 5; i++) {
        const y = -H / 2 + 46 + i * 17, x1 = W / 2 - 14 - (i === 4 ? 34 : (i % 2) * 10), pts = [];
        for (let k = 0; k <= 6; k++) pts.push([lerp(-W / 2 + 14, x1, k / 6), y + (k % 2 ? -3 : 2)]);
        stroke('p2s.esl' + i, pts, { z: z + 0.1, w: 2.2, color: C.ink, boil: 0.5 });
      }
      DL.restore();
      // the thumb in front of the sheet
      stroke('p2s.thumb', [[h[0] - 6, h[1] + 6], [h[0] - 22, h[1] - 6]], { z: Z.front + 2, w: 6 });
    },
  };
  /** little doodles on the risers */
  PROPS.p2s_eye = (fx, t, lt, p) => {
    const z = Z.board, k = fx.id;
    stroke(k + '.o', [[-34, 0], [-12, -20], [12, -20], [34, 0], [12, 20], [-12, 20], [-34, 0]], { z, w: 4, draw: p, fill: C.paper });
    const look = fx.scan ? Math.sin(lt * 2.4) * 7 : 0;
    if (p > 0.7) dot(k + '.p', [look, 1], 8.5, C.ink, z + 0.1);
    if (fx.spark) [[-30, -46, -20, -30], [0, -54, 0, -36], [30, -46, 20, -30]].forEach(([a, b, c, d], i) =>
      stroke(k + '.s' + i, [[a, b], [c, d]], { z, w: 3.2, draw: clamp(p * 1.6 - 0.6 - i * 0.1) }));
  };
  PROPS.p2s_miniStairs = (fx, t, lt, p) => {
    const z = Z.board;
    stroke(fx.id + '.s', [[-66, 30], [-66, 12, 1], [-22, 12, 1], [-22, -6, 1], [22, -6, 1], [22, -24, 1], [66, -24, 1], [66, 30, 1]], { z, w: 3.6, draw: p });
  };

  /* ---------------- choreography ---------------- */
  const T0X = 430, EDGE = 548, UPX = 700;
  const JUMP0 = 22.75, JUMP1 = 23.2;
  const climb = t => {
    if (t < JUMP0) return [EDGE, ST[0].y];
    const u = clamp((t - JUMP0) / (JUMP1 - JUMP0));
    return [lerp(EDGE, UPX, EASE.io(u)), lerp(ST[0].y, ST[1].y, u) - Math.sin(Math.PI * u) * 86];
  };
  const windmill = t => {
    const s = Math.sin((t - 23.25) * 2 * Math.PI * 2.2);
    return { armScale: 1.6, armL: [110 + 36 * s, 24], armR: [110 - 36 * s, 24], lean: 7 * s, tilt: 5 * s };
  };
  const taoWave = t => ({ ...POSE.p2s_hold, armScale: 1.35, armR: [112, 34 + 24 * Math.sin((t - 21.4) * 9)] });

  Object.assign(POSE, {
    p2s_hold: { armL: [42, 72], armR: [14, 8] },
    p2s_nod: { armL: [42, 72], armR: [14, 8], tilt: 6 },
    p2s_reach: { armScale: 1.75, armL: [135, 10], armR: [135, 10], lean: 6, tilt: -8 },
    p2s_cheer: { armScale: 1.75, armL: [140, 18], armR: [140, 18] },
    p2s_wipe: { tilt: 6, armScale: 1.7, ikL: { w: 1, to: 'hip', dx: -24, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'head', dx: 0.55, dy: -0.72, bend: 'out' } },
    p2s_lookUp: { tilt: -10, lean: -3, armL: [18, 12], armR: [18, 12] },
    p2s_point: { armScale: 1.5, armR: [80, 8], armL: [16, 10] },
  });
  Object.assign(FACE, {
    p2s_effort: { lidL: 0.3, lidR: 0.3, brow: 'line', browL: 16, browR: 16, mouth: 'frown', mw: 0.3 },
  });

  defineScene({
    id: 'stages', chapter: '三级台阶', dur: 27.4, floor: FL,
    cast: {
      tao: { H: 330, head: 0.36, torso: 0.24, leg: 0.32, arm: 0.36, hair: 'tuft', noShadow: true, blink: [3.9, 1.6] },
      terry: { H: 255, head: 0.43, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, noShadow: true, blink: [3.3, 0.9] },
    },
    order: ['tao', 'terry'],
    tracks: {
      tao: {
        enter: 1.1,
        pos: [[0, [1262, ST[2].y]]],
        pose: [[0, 'p2s_hold'], [16.4, 'p2s_nod', 0.2], [17.0, 'p2s_hold', 0.2], [17.6, 'p2s_nod', 0.2], [18.2, 'p2s_hold', 0.2],
          [21.4, taoWave, 0.15], [24.6, 'p2s_hold', 0.25]],
        face: [[0, 'smile'], [6.0, 'neutral', 0.1], [15.7, 'smile', 0.1], [21.4, 'grin', 0.1], [24.6, 'joy', 0.1]],
        turn: [[0, 0], [6.0, -0.35, 0.2]],
        gaze: [[0, 'viewer'], [6.0, 'terryHead'], [15.7, 'viewer'], [18.4, 'terryHead']],
        squash: [[0, 1]],
      },
      terry: {
        enter: 6.0,
        pos: [[0, [T0X, ST[0].y]], [21.6, [EDGE, ST[0].y], 0.7, 'lin'], [JUMP0, climb, 0]],
        pose: [[0, 'stand'], [6.1, 'p2s_point', 0.12], [9.2, 'stand', 0.2], [10.5, 'p2s_lookUp', 0.2], [15.7, 'p2s_lookUp', 0.1],
          [21.6, makeWalk(21.6, 22.3, 5.4)], [22.3, 'p2s_reach', 0.15], [22.5, 'crouch', 0.12], [JUMP0, 'jumpUp', 0.08],
          [JUMP1, 'crouch', 0.06], [23.3, windmill, 0.1], [24.05, 'p2s_wipe', 0.2], [25.0, 'p2s_cheer', 0.14, 'back']],
        face: [[0, 'smile'], [6.4, 'idea', 0.05], [7.4, 'grin', 0.05], [10.5, 'focus', 0.1], [15.7, 'surprised', 0.08], [17.2, 'smile', 0.1],
          [21.4, 'focus', 0.08], [22.3, 'p2s_effort', 0.08], [23.3, 'surprised', 0.05], [24.05, 'p2s_effort', 0.1], [25.0, 'joy', 0.08]],
        turn: [[0, 0.3], [6.1, 0.1, 0.1], [10.5, 0.3, 0.2], [21.6, 0.45, 0.1], [25.0, 0.2, 0.2]],
        gaze: [[0, 'viewer'], [8.4, 'viewer'], [10.5, 'step2'], [15.7, 'taoHead'], [21.4, 'step2'], [JUMP1, 'viewer'], [24.05, 'taoHead']],
        squash: [[0, 1], [22.5, 0.86, 0.12], [JUMP0, 1.12, 0.06], [JUMP1, 0.82, 0.05], [JUMP1 + 0.06, 1, 0.25, 'back'], [25.0, 1.08, 0.06], [25.07, 1, 0.25, 'back']],
      },
    },
    targets: F => ({
      terryHead: F.anchors.terry ? F.anchors.terry.head : [T0X, 470],
      taoHead: F.anchors.tao ? F.anchors.tao.head : [1262, 170],
      step2: [760, 520],
    }),
    set: [{ type: 'p2s_stairs', t0: 0.1 }],
    fx: [
      { type: 'p2s_shadow', id: 'shT', char: 'tao', w: 118, fixed: ST[2].y },
      { type: 'p2s_shadow', id: 'shK', char: 'terry', w: 92 },
      { type: 'p2s_essay', id: 'essay', t0: 1.35 },
      { type: 'label', id: 'p2s.lbEssay', text: '陶哲轩长大后写的文章', at: [700, 190], rot: -3, t0: 2.1, t1: 5.95, target: [1090, 250], bend: -0.2, gap: 10 },
      // step 1: by feel
      { type: 'p2s_word', id: 'p2s.w1', text: '凭感觉', x: 350, y: 712, size: 60, t0: 6.2, cps: 7 },
      { type: 'prop', kind: 'p2s_eye', id: 'p2s.eye1', at: [520, 716], t0: 7.1, drawDur: 0.5, spark: true, sfxAt: [[7.1, 'pen']] },
      { type: 'mark', id: 'p2s.bang', char: '!', on: ['terry'], t0: 7.4, t1: 10.2, dx: 6 },
      // step 2: step by step, with reasons
      { type: 'p2s_hl', id: 'p2s.hl2', box: [712, 566, 908, 620], t0: 12.3, dur: 0.45 },
      { type: 'p2s_word', id: 'p2s.w2', text: '讲道理', x: 810, y: 592, size: 60, t0: 10.6, cps: 7 },
      { type: 'write', id: 'p2s.123', text: '1→2→3', x: 712, y: 650, size: 52, t0: 12.9, speed: 1300, gap: 0.05, glyphGap: 0.12, w: 5, sfx: 'pen' },
      // step 3: sharper feel, backed by rigour
      { type: 'p2s_word', id: 'p2s.w3', text: '感觉更准', x: 1220, y: 472, size: 60, t0: 15.8, cps: 7 },
      { type: 'prop', kind: 'p2s_miniStairs', id: 'p2s.ms', at: [1220, 650], t0: 17.4, drawDur: 0.5, sfxAt: [[17.4, 'pen']] },
      { type: 'prop', kind: 'p2s_eye', id: 'p2s.eye3', at: [1220, 584], t0: 17.9, drawDur: 0.5, spark: true, scan: true, sfxAt: [[17.9, 'pen']] },
      { type: 'label', id: 'p2s.lbBig', text: '长大后的他', at: [1470, 110], rot: 3, t0: 18.4, t1: 21.2, target: { char: 'tao', part: 'headTop', dx: 34, dy: 10 }, bend: 0.25, gap: 12, size: 36 },
      { type: 'p2s_sweat', id: 'p2s.sweat', char: 'terry', t0: 22.3, t1: 25.0 },
    ],
    sfx: [[0.1, 'swish'], [1.1, 'pop'], [6.0, 'pop'], [JUMP0 - 0.02, 'hop'], [JUMP1, 'thud'], [23.3, 'boing'], [25.0, 'tada'], [21.4, 'boop']],
    steps: [{ t0: 21.6, t1: 22.3, hz: 5.4 }],
    subs: [
      { t0: 0.3, t1: 5.9, text: '陶哲轩长大以后，把学数学分成三个阶段：' },
      { t0: 6.0, t1: 10.3, text: '第一步，凭感觉，一眼看出来；' },
      { t0: 10.4, t1: 15.5, text: '第二步，学会严谨，一步一步讲道理；' },
      { t0: 15.6, t1: 21.2, text: '第三步，有了严谨打底，感觉会变得更准。' },
      { t0: 21.3, t1: 26.2, text: '八九岁的小陶，正在迈上第二级台阶。' },
    ],
  });
})();
