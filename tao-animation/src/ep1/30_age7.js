// 7岁：走进中学数学课（样片），接 1983 年报纸头版
(() => {
  const FL = 780, SEAT = 690, DESK_TOP = 628, STOOL = 652;
  const swing = t => {
    const s = Math.sin((t - 8.2) * 2 * Math.PI * 1.5);
    return { ...POSE.sitHands, legL: [70, -63 + 28 * s], legR: [70, -63 - 28 * s], tilt: 4 * s };
  };
  const jumpToStool = t => { const u = clamp((t - 3.42) / 0.2); return [1300, lerp(FL, STOOL, EASE.io(u)) - Math.sin(Math.PI * u) * 38]; };
  // three teens share one choreography (the synchronized double-take), with individual idle poses
  const teen = (base, puzzle, enter, x) => ({
    enter,
    pos: [[0, [x, SEAT]]],
    pose: [[0, base], [2.62, 'sitUp', 0.07, 'back'], [3.8, base, 0.2], [4.6, puzzle, 0.14], [6.05, 'sitUp', 0.08, 'back'], [8.35, 'shock', 0.07, 'back']],
    face: [[0, 'bored'], [2.62, 'surprised', 0.04], [3.1, 'puzzled', 0.05], [3.8, 'bored', 0.06], [4.6, 'puzzled', 0.06], [6.05, 'surprised', 0.04], [8.35, 'jaw', 0.06, 'back']],
    turn: [[0, -0.35], [2.2, 0.45, 0.06], [2.45, -0.35, 0.06], [2.62, 0.7, 0.05], [3.8, -0.35, 0.1], [6.05, 0.6, 0.06], [8.35, 0.25, 0.08]],
    gaze: [[0, 'board'], [2.2, 'terry'], [2.45, 'board'], [2.62, 'terry'], [3.8, 'board'], [6.05, 'terry'], [8.35, 'terry']],
    squash: [[0, 1], [2.62, 1.1, 0.05], [2.68, 1, 0.2, 'back'], [8.35, 1.14, 0.06], [8.42, 1, 0.3, 'back']],
  });
  const TEEN = { H: 384, head: 0.38, torso: 0.22, leg: 0.3, arm: 0.36, noShadow: true };

  // the 27 April 1983 front page (headline quoted in Clements 1984)
  PROPS.newspaper = (fx, t, lt) => {
    const z = 55, W = 520, H = 310;
    stroke('np.sheet', superPts(0, 0, W * 2, H * 2, 28, 14), { z, w: 5, closed: true, fill: C.paper });
    text('np.mast', 'ADELAIDE  ·  27 APRIL 1983', 0, -H + 40, { size: 30, font: CFG.FONT_MIX, z: z + 1, color: C.ink });
    stroke('np.r1', [[-W + 30, -H + 66], [W - 30, -H + 66]], { z: z + 1, w: 4 });
    stroke('np.r2', [[-W + 30, -H + 76], [W - 30, -H + 76]], { z: z + 1, w: 2 });
    text('np.h1', 'TINY TERENCE, 7, IS', 0, -H + 130, { size: 82, font: CFG.FONT_MIX, z: z + 1 });
    text('np.h2', 'HIGH SCHOOL WHIZ', 0, -H + 212, { size: 82, font: CFG.FONT_MIX, z: z + 1 });
    stroke('np.r3', [[-W + 30, -H + 262], [W - 30, -H + 262]], { z: z + 1, w: 2.5 });
    // photo
    const px0 = -W + 40, py0 = -H + 286, px1 = -W + 340, py1 = H - 36;
    stroke('np.photo', [[px0, py0], [px1, py0, 1], [px1, py1, 1], [px0, py1, 1], [px0, py0, 1]], { z: z + 1, w: 4 });
    portrait('np.face', (px0 + px1) / 2, (py0 + py1) / 2 + 20, 78, { z: z + 2, happy: true });
    // the teacher's words, as printed
    const q = ['"There is very little I', 'actually teach him," his', 'teacher said. "He finishes', 'all the work two lessons', 'before the rest."'];
    q.forEach((l, i) => text('np.q' + i, l, -W + 380, -H + 312 + i * 46, { size: 36, font: CFG.FONT_MIX, anchor: 'start', z: z + 1 }));
    const u0 = clamp((lt - 3.95) / 0.9), u1 = clamp((lt - 8.3) / 0.9);
    // red underline follows the narration: first quote (lines 0-1), then the second (from "He finishes")
    [[0, 0, 330, u0], [1, 0, 320, u0], [2, 232, 190, u1], [3, 0, 350, u1], [4, 0, 240, u1]].forEach(([i, dx, len, u], k) => {
      if (u <= 0) return;
      const y = -H + 334 + i * 46, x0 = -W + 380 + dx;
      stroke('np.ul' + k, [[x0, y], [x0 + len * u, y + 2]], { z: z + 2, w: 4, color: C.red, boil: 0.6 });
    });
  };

  defineScene({
    id: 'age7', chapter: '7岁 · 中学数学课', dur: 22.4, floor: FL,
    cast: {
      teacher: { H: 440, head: 0.42, torso: 0.25, leg: 0.33, arm: 0.34, hair: 'sides', tie: true, chalk: true, blink: [3.9, 1.1] },
      teen1: { ...TEEN, hair: 'messy', desk: [520, DESK_TOP], blink: [4.1, 0.2] },
      teen2: { ...TEEN, hair: 'part', glasses: true, desk: [770, DESK_TOP], blink: [3.6, 1.9] },
      teen3: { ...TEEN, hair: 'ponytail', desk: [1020, DESK_TOP], blink: [4.4, 2.7] },
      terry: { H: 240, head: 0.44, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, bag: true, bagFloor: [1440, FL - BAG.h / 2 - 2], blink: [3.3, 0.9] },
    },
    order: ['teacher', 'teen1', 'teen2', 'teen3', 'terry'],
    tracks: {
      terry: {
        pos: [[0, [1760, FL]], [1.9, [1300, FL], 1.05, 'lin'], [3.42, jumpToStool, 0]],
        pose: [[0, makeWalk(1.9, 2.95, 5.2, { bag: true, idle: 'carryBag' })], [2.95, 'carryBag', 0.1], [3.1, 'stand', 0.1], [3.3, 'crouch', 0.08], [3.42, 'jumpUp', 0.08],
          [3.62, 'sitHands', 0.1, 'back'], [5.6, 'sitCrouch', 0.12], [5.78, 'raiseHand', 0.09, 'back'],
          [7.45, 'sitCrouch', 0.12], [7.62, 'sitHands', 0.12, 'back'], [8.2, swing, 0.15]],
        squash: [[0, 1], [3.3, 0.86, 0.08], [3.42, 1.12, 0.06], [3.62, 0.86, 0.05], [3.68, 1, 0.16, 'back'],
          [5.6, 0.88, 0.12], [5.78, 1.14, 0.07], [5.86, 1, 0.22, 'back'], [7.45, 0.9, 0.1], [7.62, 1, 0.18, 'back']],
        bag: [[0, 1], [3.1, 0, 0.22, 'in']],
        bagSq: [[0, 1], [3.32, 0.8, 0.04], [3.36, 1, 0.22, 'back']],
        face: [[0, 'smile'], [2.3, 'neutral', 0.05], [2.75, 'smile', 0.05], [3.8, 'focus', 0.05], [5.1, 'idea', 0.05],
          [5.78, 'grin', 0.05], [7.2, 'proud', 0.05], [8.2, 'joy', 0.05]],
        turn: [[0, -0.6], [2.95, -0.2, 0.1], [3.3, 0, 0.1], [3.8, -0.4, 0.08], [5.78, -0.3, 0.08], [7.2, 0, 0.1], [8.2, 0.05, 0.1]],
        gaze: [[0, [0, 700]], [2.3, 'teens'], [2.75, 'viewer'], [3.2, 'chair'], [3.8, 'board'], [5.78, 'boardHi'], [7.2, 'viewer']],
      },
      teacher: {
        enter: 1.5,
        pos: [[0, [150, FL]]],
        pose: [[0, 'chalkUp'], [3.85, 'write', 0.14], [5.4, 'present', 0.14], [6.05, 'chalkUp', 0.1], [8.35, 'teachShock', 0.08, 'back']],
        face: [[0, 'neutral'], [2.3, 'surprised', 0.05], [2.9, 'smile', 0.05], [3.85, 'focus', 0.05], [5.4, 'neutral', 0.05],
          [6.05, 'surprised', 0.05], [8.35, 'jaw', 0.06]],
        turn: [[0, 0.45], [2.3, 0.6, 0.1], [3.85, 0.55, 0.1], [5.4, 0.2, 0.12], [6.05, 0.5, 0.1]],
        gaze: [[0, 'board'], [2.3, 'terry'], [3.85, 'pen'], [5.4, 'teens'], [6.05, 'terry']],
        squash: [[0, 1], [8.35, 1.08, 0.06], [8.42, 1, 0.25, 'back']],
      },
      teen1: teen('chinHand', 'scratchHead', 1.58, 520),
      teen2: teen('armsDesk', 'armsDesk', 1.66, 770),
      teen3: teen('leanBack', 'thinkChin', 1.74, 1020),
    },
    targets: () => ({ board: [700, 180], boardHi: [650, 120], teens: [760, 560], chair: [1300, STOOL] }),
    pen: 'eq',
    set: [
      { type: 'floor', t0: 1.5 },
      { type: 'board', x: 300, y: 56, w: 850, h: 272, t0: 1.52 },
      { type: 'chair', x: 520, seat: SEAT, t0: 1.5 }, { type: 'chair', x: 770, seat: SEAT, t0: 1.54 }, { type: 'chair', x: 1020, seat: SEAT, t0: 1.58 },
      { type: 'desk', x: 520, top: DESK_TOP, t0: 1.5 }, { type: 'desk', x: 770, top: DESK_TOP, t0: 1.55 }, { type: 'desk', x: 1020, top: DESK_TOP, t0: 1.6 },
      { type: 'stool', x: 1300, seat: STOOL, t0: 1.72 },
    ],
    fx: [
      { type: 'ageStamp', age: 7, place: '去中学上数学课', t0: 0, center: [800, 360], R: 150, dockT: 1.32, dock: [1486, 108], dockScale: 0.46, pulse: [8.1] },
      { type: 'write', id: 'eq', text: '3x + 5 = 26', x: 395, y: 96, size: 112, t0: 3.88, speed: 2300, gap: 0.035, glyphGap: 0.03, w: 7 },
      { type: 'highlight', id: 'hl', of: 'eq', t0: 5.3, dur: 0.28 },
      { type: 'label', id: 'lbName', text: '陶哲轩，7岁', at: [1232, 372], rot: -3, t0: 2.3, t1: 3.8, target: { char: 'terry', part: 'headTop' }, bend: -0.25 },
      { type: 'label', id: 'lbBag', text: ['书包', '（比他还大）'], at: [1478, 404], rot: 3, t0: 2.7, t1: 3.8, target: { char: 'terry', part: 'bag' }, bend: 0.2 },
      { type: 'mark', id: 'q', char: '?', on: ['teen1', 'teen2', 'teen3'], t0: 2.78, t1: 3.75, stagger: 0.06 },
      { type: 'speedLines', id: 'zip', char: 'terry', part: 'handR', t0: 5.8, t1: 6.25 },
      { type: 'speech', id: 'ans', text: 'x = 7！', at: [1150, 392], tail: [70, 32], speaker: 'terry', t0: 5.95, t1: 7.35, rot: -4 },
      { type: 'write', id: 'chk', text: '3×7+5=26 ✓', x: 640, y: 236, size: 64, t0: 7.22, speed: 3200, gap: 0.022, glyphGap: 0.012, color: 'red', w: 5, track: 0.16, sfx: 'pen', endSfx: 'ding', z: Z.annot, t1: 10.75 },
      { type: 'ring', id: 'ring7', of: 'chk', glyph: 2, t0: 7.95, t1: 10.75 },
      { type: 'label', id: 'lbAge', text: '正好是他的年龄', at: [790, 396], rot: -2, t0: 8.05, t1: 10.7, target: { write: 'chk', glyph: 2, dy: 20 }, bend: 0.15, gap: 6 },
      { type: 'label', id: 'lbJaw', text: '下巴（掉了）', at: [372, 404], rot: -4, t0: 8.7, t1: 10.7, target: { char: 'teen1', part: 'mouth', dx: -18 }, bend: -0.3, gap: 12 },
      { type: 'swingMarks', id: 'swing', char: 'terry', t0: 8.3, t1: 10.7 },
      // 1983: the newspaper
      { type: 'prop', kind: 'newspaper', id: 'np', t0: 10.8, pos: [[0, [800, 1320]], [10.8, [800, 452], 0.35, 'out']], rot: -2, drawDur: 0, sfxAt: [[10.8, 'paper'], [11.12, 'thud']] },
      { type: 'label', id: 'lbHead', text: '“小小陶哲轩，7岁，中学里的数学神童”', at: [800, 80], rot: -1, t0: 11.9, t1: 22.4, target: [800, 214], bend: 0.1, gap: 6, size: 40 },
    ],
    sfx: [[1.5, 'plip'], [1.58, 'plip'], [1.66, 'plip'], [1.74, 'plip'], [2.62, 'whip'], [3.3, 'thud'], [3.44, 'hop'],
      [5.78, 'zip'], [6.05, 'whip'], [7.5, 'hop'], [8.35, 'boing']],
    steps: [{ t0: 1.9, t1: 2.95, hz: 5.2 }],
    subs: [
      { t0: 0.2, t1: 3.75, text: '七岁那年，小陶走进了中学的数学课。' },
      { t0: 3.8, t1: 7.15, text: '老师刚写完题，小陶的手就举起来了！' },
      { t0: 7.2, t1: 10.7, text: '脚还够不着地，数学已经够到了高中。' },
      { t0: 10.9, t1: 14.6, text: '1983年，报纸头版登了他的故事。' },
      { t0: 14.7, t1: 19.0, text: '他的数学老师说：“我几乎没什么可教他的，' },
      { t0: 19.1, t1: 22.3, text: '他总是比别人早两节课就做完了。”' },
    ],
  });
})();
