// 数学小知识：斐波那契数（系列固定栏目卡片，COMP.a6_factCard 可复用）
(() => {
  /** "数学小知识" card: an index card that draws on, a red rubber-stamp header, the topic in ink, a red header rule
   *  and faint pencil rules. {id, t0, t1, box:[x0,y0,x1,y1], topic, rules:[y...]} */
  COMP.a6_factCard = {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, [x0, y0, x1, y1] = fx.box, k = fx.id, z = Z.set;
      const p = EASE.out(clamp(lt / 0.45));
      stroke(k + '.card', [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0, 1]], { z, w: 5, fill: C.paper, draw: p });
      stroke(k + '.shade', [[x0 + 14, y1 + 8], [x1 + 8, y1 + 8, 1], [x1 + 8, y0 + 14]], { z: z - 0.5, w: 2.5, color: C.pencil, opacity: 0.7 * p, boil: 0.5 });
      // header rule (index cards have a red one) + faint ruled lines
      const hy = y0 + 150;
      stroke(k + '.hr', [[x0 + 18, hy], [x1 - 18, hy - 2]], { z: z + 0.2, w: 3.5, color: C.red, draw: EASE.out(clamp((lt - 0.25) / 0.4)), boil: 0.5 });
      (fx.rules || []).forEach((y, i) => stroke(k + '.rl' + i, [[x0 + 18, y], [x1 - 18, y + 1]], { z: z + 0.1, w: 2, color: C.pencil, opacity: 0.45, draw: EASE.out(clamp((lt - 0.3 - i * 0.05) / 0.4)), boil: 0.4 }));
      // rubber stamp "数学小知识"
      const sp = clamp((lt - 0.35) / 0.18);
      if (sp > 0) {
        const sx = x0 + 190, sy = y0 + 76, sc = lerp(1.7, 1, EASE.out(sp));
        DL.save(); DL.translate(sx, sy); DL.scale(sc); DL.rotate(-5);
        const W = 128, H = 44;
        stroke(k + '.st1', [[-W, -H], [W, -H, 1], [W, H, 1], [-W, H, 1], [-W, -H, 1]], { z: Z.stamp, w: 5, color: C.red, opacity: sp, boil: 0.6 });
        stroke(k + '.st2', [[-W + 9, -H + 9], [W - 9, -H + 9, 1], [W - 9, H - 9, 1], [-W + 9, H - 9, 1], [-W + 9, -H + 9, 1]], { z: Z.stamp, w: 2.4, color: C.red, opacity: sp, boil: 0.6 });
        text(k + '.stt', '数学小知识', 0, 2, { size: 46, color: C.red, z: Z.stamp, opacity: sp });
        DL.restore();
      }
      const tp = clamp((lt - 0.7) / 0.25);
      if (tp > 0) text(k + '.topic', fx.topic, x0 + 360, y0 + 78, { size: 78, anchor: 'start', z: Z.annot, opacity: clamp(tp * 3), scale: lerp(0.7, 1, EASE.back(tp)) });
    },
    cues: fx => [[fx.t0, 'paper'], [fx.t0 + 0.4, 'stamp'], [fx.t0 + 0.72, 'pop']],
  };

  // the sequence, laid out so that it is centred on the card
  const SEQ = '1, 1, 2, 3, 5, 8, 13, 21', SIZE = 100, TRACK = 0.1;
  let wSeq = 0; for (const ch of SEQ) wSeq += (GLYPH[ch].w + TRACK) * SIZE;
  const SEQ_X = Math.round(800 - wSeq / 2), SEQ_Y = 290, BASE = SEQ_Y + SIZE;
  const ARC0 = 3.6, ARC_GAP = 0.52;

  /** Red "+" and arc from each pair into the next number, one after another. */
  COMP.a6_fibArcs = {
    init(fx) { fx.n = 6; return fx; },
    draw(fx, t) {
      const w = FXBY[fx.of]; if (!w) return;
      // group glyph boxes into numbers
      const nums = []; let cur = null;
      w.boxes.forEach(b => {
        if (/\d/.test(b.ch)) { if (!cur) { cur = { x0: b.x, x1: b.x + b.w }; nums.push(cur); } else cur.x1 = b.x + b.w; } else cur = null;
      });
      const cx = i => (nums[i].x0 + nums[i].x1) / 2;
      for (let k = 0; k < fx.n; k++) {
        const t0 = fx.t0 + k * fx.gap, lt = t - t0; if (lt < 0) continue;
        const deep = k % 2 ? 1 : 0, mid = (nums[k].x1 + nums[k + 1].x0) / 2, y = BASE + 26 + deep * 14;
        text(fx.id + '.p' + k, '+', mid + 4, BASE + 8, { size: 60, font: CFG.FONT_MIX, color: C.red, z: Z.annot, scale: lerp(0.3, 1, EASE.back(clamp(lt / 0.15))), halo: 6 });
        arrow(fx.id + '.a' + k, [mid + 4, y + 16], [cx(k + 2) - 4, y], { p: EASE.io(clamp((lt - 0.08) / 0.34)), bend: 0.32 + deep * 0.22, head: 16, w: 4 });
      }
    },
    cues: fx => Array.from({ length: 6 }, (_, k) => [fx.t0 + k * fx.gap, 'pen']),
  };

  defineScene({
    id: 'fib', dur: 10.4, floor: 770,
    cast: {
      terry: { H: 225, head: 0.45, torso: 0.22, leg: 0.3, arm: 0.34, hair: 'tuft', kid: true, blink: [3.3, 0.9] },
    },
    tracks: {
      terry: {
        enter: 1.0,
        pos: [[0, [1400, 770]], [7.1, t => [1400, 770 - 36 * Math.sin(Math.PI * clamp((t - 7.1) / 0.32))], 0]],
        pose: [[0, 'stand'], [7.1, 'jumpUp', 0.08], [7.42, { armL: [84, 6], armR: [16, 10] }, 0.12, 'back'],
          [9.1, { armScale: 1.6, armL: [118, 42], armR: [118, 42] }, 0.12, 'back']],
        face: [[0, 'smile'], [1.3, 'focus', 0.05], [3.4, 'idea', 0.05], [7.1, 'grin', 0.05], [9.1, 'joy', 0.05]],
        turn: [[0, -0.35]],
        gaze: [[0, 'viewer'], [1.3, 'seq'], [3.6, 'arcs'], [7.1, 'viewer'], [7.9, 'chk'], [9.1, 'viewer']],
        squash: [[0, 1], [7.0, 0.88, 0.08], [7.1, 1.1, 0.08], [7.42, 0.9, 0.05], [7.48, 1, 0.2, 'back'], [9.0, 0.9, 0.08], [9.1, 1.08, 0.08], [9.2, 1, 0.25, 'back']],
      },
    },
    targets: () => ({ seq: [800, 340], arcs: [900, 450], chk: [480, 660] }),
    fx: [
      { type: 'a6_factCard', id: 'card', t0: 0, box: [90, 92, 1510, 790], topic: '斐波那契数', rules: [BASE, 490, 590, 690] },
      { type: 'write', id: 'seq', text: SEQ, x: SEQ_X, y: SEQ_Y, size: SIZE, t0: 1.0, speed: 2300, gap: 0.025, glyphGap: 0.025, w: 7, track: TRACK, z: Z.board, sfx: 'pen' },
      { type: 'highlight', id: 'seqHi', of: 'seq', t0: 3.1, dur: 0.4 },
      { type: 'a6_fibArcs', id: 'arcs', of: 'seq', t0: ARC0, gap: ARC_GAP },
      { type: 'speech', id: 'say', text: '下一个是 34！', at: [1060, 560], tail: [230, 24], speaker: 'terry', t0: 7.15, t1: 10.4, rot: -3, size: 76 },
      { type: 'write', id: 'chk', text: '13+21=34 ✓', x: 250, y: 612, size: 76, t0: 7.9, speed: 2600, gap: 0.022, glyphGap: 0.012, color: 'red', w: 5.5, track: 0.16, sfx: 'pen', endSfx: 'ding', z: Z.annot },
    ],
    sfx: [[1.0, 'hop'], [7.1, 'hop'], [9.1, 'boop']],
    subs: [
      { t0: 0.3, t1: 3.3, text: '这串数叫斐波那契数，' },
      { t0: 3.4, t1: 7.05, text: '每个数都是前两个数加起来。' },
      { t0: 7.15, t1: 9.9, text: '“下一个是34！”' },
    ],
  });
})();
