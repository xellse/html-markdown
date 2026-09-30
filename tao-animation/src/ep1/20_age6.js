// 6岁：照着一本书自学 BASIC，在家里的电脑上编了猜谜游戏《Fibonacci》
// (Clements 1984, Fig. 5: the program text below is quoted from Terence's listing)
(() => {
  const FL = 780, DESK_TOP = 600, SEAT = 640;
  const TX = 525, DX = 1210;                     // Terry (seated, left of the screen) / Dad (standing, right)
  const KB0 = 720, KB1 = 930, KB_T = 12.3;       // keyboard centre: Terry's side -> slid over to Dad

  /* ---------------- the screen: a tiny scrolling terminal, pure function of t ---------------- */
  const MONO = 42, ADV = 0.4 * MONO, LH = 42, ROWS = 7, COLS = 29, SX = 508, SY = 127;
  const ROWSX = [], CLEARS = [], KEYS = [], SFXS = [];
  const wrap = s => {
    const out = []; let cur = '';
    s.split(' ').forEach(w => { const nx = cur ? cur + ' ' + w : w; if (nx.length > COLS && cur) { out.push(cur); cur = w; } else cur = nx; });
    if (cur) out.push(cur); return out;
  };
  /** computer prints a message (fast typewriter) */
  const out = (id, t, s, cps = 55) => {
    let tt = t;
    wrap(s).forEach(line => { const ts = [...line].map(() => { const v = tt; tt += 1 / cps; return v; }); ROWSX.push({ id, text: line, ts, t0: ts[0] }); });
    return tt;
  };
  /** somebody types on the keyboard (key clicks every `every` chars) */
  const typed = (id, t, s, cps, every = 1) => {
    let tt = t;
    wrap(s).forEach(line => {
      const ts = [...line].map((ch, i) => { const v = tt; tt += 1 / cps; if (ch !== ' ' && i % every === 0) KEYS.push(v); return v; });
      ROWSX.push({ id, text: line, ts, t0: ts[0] });
    });
    return tt;
  };
  /** INPUT: "? " appears with the prompt, the digits are typed later */
  const input = (id, tPrompt, digits, tType, gap) => {
    const ts = [tPrompt, tPrompt];
    [...digits].forEach((_, i) => { ts.push(tType + i * gap); KEYS.push(tType + i * gap); });
    ROWSX.push({ id, text: '? ' + digits, ts, t0: tPrompt });
    const ret = tType + digits.length * gap + 0.12; KEYS.push(ret); return ret;
  };
  // Terry types his program (lines 10–30 of the real listing), then RUN
  let tt = typed('code', 2.1, '10 PRINT "HERE COMES MR. FIBONACCI"', 36, 2);
  tt = typed('code2', tt + 0.15, '20 PRINT "CAN YOU GUESS WHICH YEAR WAS MR. FIBONACCI BORN?"', 36, 2);
  tt = typed('code3', tt + 0.15, '30 PRINT "WRITE DOWN A NUMBER PLEASE...":INPUT C', 36, 2);
  const T_RUN = typed('run', tt + 0.3, 'RUN', 9) + 0.2;   // RETURN
  KEYS.push(T_RUN);
  CLEARS.push(T_RUN + 0.18);
  // the game
  const G0 = T_RUN + 0.35;
  tt = out('hello', G0, 'HERE COMES MR. FIBONACCI');
  tt = out('ask', tt + 0.2, 'CAN YOU GUESS WHICH YEAR WAS MR. FIBONACCI BORN?');
  const P1 = out('write1', tt + 0.2, 'WRITE DOWN A NUMBER PLEASE...');
  const R1 = input('in1', P1, '1300', 13.3, 0.22);
  tt = out('heaven', R1 + 0.2, 'NO, HE IS ALREADY IN HEAVEN, TRY AGAIN');
  SFXS.push([R1 + 0.2, 'buzz']);
  const P2 = out('write2', tt + 0.35, 'WRITE DOWN A NUMBER PLEASE...');
  const R2 = input('in2', P2, '1000', 21.2, 0.22);
  tt = out('born', R2 + 0.2, 'SORRY, HE WASN\'T BORN YET! TRY AGAIN');
  SFXS.push([R2 + 0.2, 'buzz']);
  const P3 = out('write3', tt + 0.35, 'WRITE DOWN A NUMBER PLEASE...');
  const R3 = input('in3', P3, '1170', 25.8, 0.22);
  const T_OK = R3 + 0.2;
  tt = out('correct', T_OK, 'YOU ARE CORRECT! NOW WE START');
  SFXS.push([T_OK + 0.05, 'tada']);
  tt = out('go', tt + 0.3, 'OKAY. HERE THEY GO');
  // the numbers appear one at a time
  const NUMS = '1 1 2 3 5 8 13 21', T_NUM = tt + 0.25, NUM_GAP = 0.15;
  { let k = 0, prevSpace = true; const ts = [];
    [...NUMS].forEach(ch => { if (ch !== ' ' && prevSpace) { SFXS.push([T_NUM + k * NUM_GAP, 'plip']); k++; } prevSpace = ch === ' '; ts.push(T_NUM + (k - 1) * NUM_GAP); });
    ROWSX.push({ id: 'nums', text: NUMS, ts, t0: ts[0] }); }
  const T_NUM_END = T_NUM + 8 * NUM_GAP, T_HI = T_NUM_END + 0.2, T_CHEER = T_NUM + 0.45;

  function screenAt(t) {
    let lastClear = -1; CLEARS.forEach(c => { if (c <= t) lastClear = c; });
    const live = ROWSX.filter(r => r.t0 <= t && r.t0 >= lastClear);
    const vis = live.slice(-ROWS);
    return vis.map((r, i) => {
      let n = 0; r.ts.forEach(v => { if (v <= t) n++; });
      return { id: r.id, text: r.text.slice(0, n), full: r.text, y: SY + i * LH, last: r.ts[r.ts.length - 1] };
    });
  }
  const rowOf = (t, id) => screenAt(t).find(r => r.id === id);

  PROPS.a6_computer = (fx, t, lt, p) => {
    const zc = Z.set + 1, zt = Z.set + 3;
    // CRT monitor
    stroke('a6c.case', superPts(760, 255, 608, 394, 30, 7), { z: zc, w: 6, closed: true, fill: C.paper, draw: stag(p, 0, 5) });
    stroke('a6c.scr', superPts(760, 252, 548, 332, 30, 5), { z: zc + 0.2, w: 4.5, closed: true, fill: C.paper, draw: stag(p, 1, 5) });
    stroke('a6c.gl1', [[1022, 330], [1018, 380], [1000, 404]], { z: zc + 0.3, w: 2.4, color: C.pencil, opacity: 0.6 * stag(p, 2, 5), boil: 0.5 });
    stroke('a6c.gl2', [[1006, 372], [998, 390]], { z: zc + 0.3, w: 2.4, color: C.pencil, opacity: 0.6 * stag(p, 2, 5), boil: 0.5 });
    [0, 1].forEach(i => stroke('a6c.knob' + i, ringPts('a6c.knob' + i, 990 + i * 30, 436, 8, 8, { n: 8, closed: true }), { z: zc + 0.3, w: 3.5, closed: true, fill: C.paper, draw: stag(p, 2, 5) }));
    if (p > 0.6) dot('a6c.led', [512, 436], 5, C.ink, zc + 0.3);
    // stand + disk drive (lifts the monitor)
    stroke('a6c.plinth', [[716, 452], [804, 452, 1], [816, 478, 1], [704, 478, 1], [716, 452, 1]], { z: Z.set, w: 4.5, fill: C.paper, draw: stag(p, 3, 5) });
    stroke('a6c.drive', [[620, 478], [900, 478, 1], [900, DESK_TOP, 1], [620, DESK_TOP, 1], [620, 478, 1]], { z: Z.set + 0.5, w: 5, fill: C.paper, draw: stag(p, 3, 5) });
    stroke('a6c.slot', [[690, 512], [830, 512]], { z: Z.set + 0.6, w: 5, draw: stag(p, 4, 5) });
    stroke('a6c.lever', [[745, 500], [775, 500, 1], [775, 524, 1], [745, 524, 1], [745, 500, 1]], { z: Z.set + 0.6, w: 3.5, fill: C.paper, draw: stag(p, 4, 5) });
    // keyboard (the computer itself, a wedge), slides over to Dad
    const kx = evalTrack([[0, KB0], [KB_T, KB1, 0.35, 'out']], t), kb = 'a6c.kb', zk = Z.desk + 1;
    stroke(kb, [[kx - 124, DESK_TOP], [kx - 112, 564, 1], [kx + 112, 564, 1], [kx + 124, DESK_TOP, 1], [kx - 124, DESK_TOP, 1]], { z: zk, w: 5, fill: C.paper, draw: stag(p, 4, 5) });
    if (p > 0.8) {
      [0, 1, 2].forEach(r => {
        const y = 573 + r * 8.5, n = 11 - r, x0 = kx - 96 + r * 5;
        for (let i = 0; i < n; i++) stroke(`${kb}.k${r}.${i}`, [[x0 + i * 17.5, y], [x0 + i * 17.5 + 9, y]], { z: zk + 0.1, w: 4, boil: 0.4 });
      });
      stroke(kb + '.space', [[kx - 42, 594], [kx + 42, 594]], { z: zk + 0.1, w: 4, boil: 0.4 });
    }
    if (p < 0.99) return;
    // the text on the screen
    const rows = screenAt(t);
    rows.forEach((r, i) => { if (r.text) text('a6c.row' + i, r.text, SX, r.y, { size: MONO, font: CFG.FONT_MONO, anchor: 'start', z: zt, color: C.ink }); });
    // yellow: the Fibonacci numbers are the key math
    const nr = rows.find(r => r.id === 'nums');
    const hp = EASE.out(clamp((t - T_HI) / 0.35));
    if (nr && hp > 0) {
      const x0 = SX - 10, x1 = lerp(x0, SX + nr.full.length * ADV + 10, hp), y0 = nr.y - 20, y1 = nr.y + 20;
      const top = [], bot = [];
      for (let i = 0; i <= 8; i++) { const x = lerp(x0, x1, i / 8); top.push([x, y0 + Math.sin(i * 1.7) * 2.5]); bot.unshift([x, y1 + Math.sin(i * 2.3) * 3]); }
      stroke('a6c.hi', top.concat(bot), { z: zt - 0.5, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    }
    // blinking block cursor
    const last = rows[rows.length - 1];
    const typing = KEYS.some(k => t >= k && t < k + 0.35);
    if (typing || (t * 2.4) % 1 < 0.55) {
      const cx = last ? SX + last.text.length * ADV + 2 : SX, cy = last ? last.y : SY;
      stroke('a6c.cur', [[cx, cy - 15], [cx + ADV - 2, cy - 15, 1], [cx + ADV - 2, cy + 15, 1], [cx, cy + 15, 1]], { z: zt, closed: true, fill: C.ink, noStroke: true, w: 1, boil: 0.2 });
    }
  };

  // the BASIC book, propped open on the desk so we can see its pages
  SETDRAW.a6_book = (s, p) => {
    const { x } = s, y = DESK_TOP, z = Z.desk + 1;
    stroke('a6b.stand', [[x - 30, y], [x - 4, y - 22, 1], [x + 30, y]], { z, w: 4, draw: stag(p, 0, 4) });
    stroke('a6b.cover', [[x, y - 6], [x - 88, y - 14, 1], [x - 92, y - 92, 1], [x, y - 80, 1], [x + 92, y - 92, 1], [x + 88, y - 14, 1], [x, y - 6, 1]], { z, w: 5, fill: C.paper, draw: stag(p, 0, 4) });
    stroke('a6b.l', [[x - 2, y - 12], [x - 80, y - 20], [x - 84, y - 86, 1], [x - 2, y - 76]], { z: z + 0.1, w: 3.5, fill: C.paper, closed: true, draw: stag(p, 1, 4) });
    stroke('a6b.r', [[x + 2, y - 12], [x + 80, y - 20], [x + 84, y - 86, 1], [x + 2, y - 76]], { z: z + 0.1, w: 3.5, fill: C.paper, closed: true, draw: stag(p, 1, 4) });
    stroke('a6b.spine', [[x, y - 78], [x, y - 8]], { z: z + 0.2, w: 4, draw: stag(p, 1, 4) });
    if (p > 0.7) text('a6b.t', 'BASIC', x - 42, y - 66, { size: 26, font: CFG.FONT_MONO, z: z + 0.2, rot: 5 });
    for (let i = 0; i < 4; i++) {
      if (i) stroke('a6b.tl' + i, [[x - 70, y - 60 + i * 11], [x - 14, y - 56 + i * 11]], { z: z + 0.2, w: 2.2, color: C.pencil, draw: stag(p, 2, 4), boil: 0.5 });
      stroke('a6b.tr' + i, [[x + 14, y - 62 + i * 11], [x + 70, y - 66 + i * 11]], { z: z + 0.2, w: 2.2, color: C.pencil, draw: stag(p, 3, 4), boil: 0.5 });
    }
  };

  /* ---------------- poses ---------------- */
  const bob = (t, ph) => Math.max(0, Math.sin(t * 21 + ph)) * 8;
  const S = POSE.sitBase;
  const tType = t => ({ ...S, lean: 5, tilt: 5, armScale: 1.5,
    ikL: { w: 1, to: 'desk', dx: -14, dy: -bob(t, 0), bend: 'down' }, ikR: { w: 1, to: 'desk', dx: 24, dy: -bob(t, Math.PI), bend: 'down' } });
  const dType = t => ({ lean: -17, tilt: -6, armScale: 1.3, armR: [14, 12],
    ikL: { w: 1, to: 'desk', dx: 0, dy: -bob(t, 0.6), bend: 'down' } });
  Object.assign(POSE, {
    a6_tPress: { ...S, lean: 8, tilt: 8, armScale: 1.5, ikL: { w: 1, to: 'desk', dx: -14, dy: 4, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: 24, dy: 6, bend: 'down' } },
    a6_tRest: { ...S, tilt: -3, armScale: 1.2, ikL: { w: 1, to: 'desk', dx: -130, dy: 2, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: -64, dy: 2, bend: 'down' } },
    a6_tPush: { ...S, lean: 9, tilt: 6, armScale: 1.9, ikL: { w: 1, to: 'desk', dx: 20, dy: -2, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: 44, dy: -2, bend: 'down' } },
    a6_tProud: { ...S, tilt: -9, lean: -3, armScale: 1.2, ikL: { w: 1, to: 'desk', dx: -134, dy: 2, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: -58, dy: 2, bend: 'down' } },
    a6_tCheer: { ...S, armScale: 1.8, armL: [112, 40], armR: [112, 40] },
    a6_dLean: { lean: -17, tilt: -6, armScale: 1.3, armR: [14, 12], ikL: { w: 1, to: 'desk', dx: 0, dy: -4, bend: 'down' } },
    a6_dLaugh: { lean: -6, tilt: 12, armL: [22, -100], armR: [22, -100] },
    a6_dPuzzled: { lean: -12, tilt: 10, armScale: 1.3, ikL: { w: 1, to: 'desk', dx: 0, dy: -4, bend: 'down' }, ikR: { w: 1, to: 'head', dx: 0.7, dy: -0.75, bend: 'out' } },
    a6_dCheer: { lean: -8, tilt: -4, armL: [120, 30], armR: [120, 30] },
  });
  Object.assign(FACE, {
    a6_laugh: { lidL: 0.5, lidR: 0.5, mouth: 'grin', mw: 0.48, brow: 'arc', browY: 0.06 },
  });
  const laughSq = t => 1 + 0.045 * Math.sin((t - 15.2) * 2 * Math.PI * 4.2);
  const cheerSq = t => 1 + 0.06 * Math.abs(Math.sin((t - T_CHEER) * Math.PI * 3.2));

  // Dad's walk in and typing windows
  const DW0 = 10.9, DW1 = 12.15;
  const dadPose = [[0, makeWalk(DW0, DW1, 4.6)], [DW1, 'stand', 0.12], [12.4, 'a6_dLean', 0.25],
    [13.2, dType, 0.1], [14.0, 'a6_dLean', 0.1], [15.2, 'a6_dLaugh', 0.18], [18.8, 'a6_dLean', 0.3],
    [21.1, dType, 0.1], [21.9, 'a6_dLean', 0.1], [22.35, 'a6_dPuzzled', 0.2], [25.2, 'a6_dLean', 0.25],
    [25.7, dType, 0.1], [26.5, 'a6_dLean', 0.1], [T_CHEER + 0.2, 'a6_dCheer', 0.2]];

  defineScene({
    id: 'age6', chapter: '6岁 · 自己编游戏', dur: 31.8, floor: FL,
    cast: {
      terry: { H: 225, head: 0.45, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, desk: [622, 584], blink: [3.3, 0.9], noShadow: true },
      dad: { H: 440, head: 0.4, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'part', glasses: true, desk: [KB1 + 70, 584], blink: [4.2, 1.6] },
    },
    order: ['dad', 'terry'],
    tracks: {
      terry: {
        enter: 1.55,
        pos: [[0, [TX, SEAT]]],
        pose: [[0, 'a6_tRest'], [1.95, tType, 0.2], [T_RUN - 0.25, 'a6_tPress', 0.08], [T_RUN + 0.35, 'a6_tRest', 0.25],
          [12.1, 'a6_tPush', 0.12, 'back'], [12.7, 'a6_tRest', 0.25], [15.4, 'a6_tProud', 0.2], [19.2, 'a6_tRest', 0.3],
          [T_CHEER, 'a6_tCheer', 0.15, 'back']],
        face: [[0, 'smile'], [1.95, 'focus', 0.05], [T_RUN, 'grin', 0.05], [G0 + 0.6, 'smile', 0.05], [11.1, 'surprised', 0.05], [11.6, 'grin', 0.05],
          [13.2, 'smile', 0.05], [15.4, 'proud', 0.05], [19.0, 'smile', 0.05], [22.6, 'joy', 0.05], [24.8, 'smile', 0.05], [26.9, 'grin', 0.05], [T_CHEER, 'joy', 0.05]],
        turn: [[0, 0.35], [G0 + 1.8, 0.1, 0.15], [11.1, 0.55, 0.12], [13.2, 0.35, 0.12], [15.4, 0.15, 0.15], [19.0, 0.35, 0.15], [T_CHEER, 0.05, 0.15]],
        gaze: [[0, 'screen'], [G0 + 1.8, 'viewer'], [11.1, 'dad'], [13.2, 'screen'], [15.4, 'dad'], [16.6, 'viewer'], [19.0, 'screen'], [22.6, 'dad'], [24.0, 'screen'], [T_CHEER + 0.9, 'viewer']],
        squash: [[0, 1], [T_RUN - 0.25, 0.9, 0.06], [T_RUN - 0.1, 1.06, 0.08], [T_RUN + 0.05, 1, 0.2, 'back'], [12.1, 0.9, 0.08], [12.25, 1, 0.2, 'back'],
          [T_CHEER - 0.1, 0.88, 0.08], [T_CHEER, cheerSq, 0.1]],
      },
      dad: {
        pos: walkPath(DW0, DW1, 1720, DX, FL),
        pose: dadPose,
        face: [[0, 'smile'], [13.2, 'focus', 0.05], [14.5, 'surprised', 0.05], [15.2, 'a6_laugh', 0.05], [18.8, 'smile', 0.05],
          [21.1, 'focus', 0.05], [22.35, 'puzzled', 0.05], [25.2, 'neutral', 0.05], [25.7, 'focus', 0.05], [T_OK, 'surprised', 0.05], [T_CHEER + 0.2, 'a6_laugh', 0.05]],
        turn: [[0, -0.55], [12.2, -0.45, 0.1], [15.2, -0.3, 0.1], [18.8, -0.45, 0.1]],
        gaze: [[0, 'terry'], [12.5, 'screen'], [15.2, 'terry'], [16.8, 'viewer'], [18.8, 'screen'], [22.35, 'screen'], [T_CHEER + 0.2, 'terry']],
        squash: [[0, 1], [15.2, laughSq, 0.1], [18.7, 1, 0.2], [T_OK, 1.06, 0.06], [T_OK + 0.1, 1, 0.25, 'back']],
      },
    },
    targets: F => {
      const tg = { screen: [760, 290] };
      const add = (name, id) => { const r = rowOf(F.t, id); if (r) tg[name] = [SX - 14, r.y]; };
      add('rowCode', 'code'); add('rowAsk', 'ask'); add('rowHeaven', 'heaven'); add('rowBorn', 'born');
      return tg;
    },
    set: [
      { type: 'floor', t0: 1.4 },
      { type: 'chair', x: TX, seat: SEAT, t0: 1.45 },
      { type: 'desk', x: 740, top: DESK_TOP, w: 980, t0: 1.4 },
      { type: 'a6_book', x: 370, t0: 1.7 },
    ],
    fx: [
      { type: 'ageStamp', age: 6, place: '自学编电脑程序', t0: 0, center: [800, 360], R: 150, dockT: 1.32, dock: [1486, 108], dockScale: 0.46, pulse: [] },
      { type: 'prop', kind: 'a6_computer', id: 'pc', t0: 1.45, at: [0, 0], drawDur: 0.55 },
      { type: 'label', id: 'lbBook', text: '一本 BASIC 编程书', at: [212, 424], rot: -3, t0: 2.2, t1: 4.8, target: [322, 530], bend: 0.2, gap: 8 },
      { type: 'label', id: 'lbCode', text: ['这是他', '自己写的程序'], at: [236, 196], rot: -3, t0: 4.9, t1: 7.2, target: { target: 'rowCode' }, bend: -0.15, gap: 8 },
      { type: 'label', id: 'lbAsk', text: ['猜猜斐波那契先生', '哪年出生？'], at: [236, 250], rot: -2, t0: 8.9, t1: 12.5, target: { target: 'rowAsk' }, bend: -0.12, gap: 8 },
      { type: 'label', id: 'lbHeaven', text: ['不对，那时他', '已经上天堂啦！'], at: [236, 250], rot: -3, t0: R1 + 0.7, t1: R1 + 4.7, target: { target: 'rowHeaven' }, bend: 0.12, gap: 8 },
      { type: 'label', id: 'lbBorn', text: ['对不起，', '他还没出生呢！'], at: [236, 250], rot: 2, t0: R2 + 0.5, t1: R2 + 4.0, target: { target: 'rowBorn' }, bend: 0.12, gap: 8 },
      { type: 'mark', id: 'huh', char: '?', on: ['dad'], t0: 22.5, t1: 24.9, dx: 60 },
    ],
    sfx: [[1.55, 'hop'], ...KEYS.map(k => [k, 'key']), [T_RUN + 0.2, 'beep'], [G0, 'beep'], ...SFXS, [KB_T, 'whip'], [15.25, 'boing'], [T_HI, 'swish'], [T_CHEER, 'hop']],
    steps: [{ t0: DW0, t1: DW1, hz: 4.6 }],
    subs: [
      { t0: 0.2, t1: 5.3, text: '六岁时，他照着一本书，自学编电脑程序。' },
      { t0: 5.4, t1: 8.3, text: '他编了一个猜谜游戏：' },
      { t0: 8.4, t1: 12.8, text: '猜猜数学家斐波那契是哪年出生的？' },
      { t0: 12.9, t1: 16.6, text: '爸爸猜1300年，电脑说：' },
      { t0: 16.7, t1: 21.1, text: '“不对，那时候他已经上天堂啦！”' },
      { t0: 21.2, t1: 25.6, text: '猜1000年：“他还没出生呢！”' },
      { t0: 25.7, t1: 29.6, text: '猜对1170年，游戏才开始。' },
    ],
  });
})();
