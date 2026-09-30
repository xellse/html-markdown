(() => {
  const FL = 780;
  defineScene({
    id: 'code', chapter: '组件测试', dur: 14, floor: FL,
    fx: [
      { type: 'codeBlock', id: 'cb', x: 180, y: 150, size: 54, cps: 18,
        lines: [{ text: 'total = 0', t0: 0.2 }, { text: 'for i in range(1, 10):', t0: 0.8 }, { text: '    total = total + i', t0: 1.8 }, { text: 'print(total)', t0: 2.8 }],
        pc: [[3.6, 0], [4.2, 1], [4.8, 2], [5.4, 1], [6.0, 3]], out: { text: '45', t0: 6.4 } },
      { type: 'varBox', id: 'vi', name: 'i', cx: 1000, cy: 200, vals: [[4.2, '1'], [5.4, '2']], t0: 3.8 },
      { type: 'varBox', id: 'vt', name: 'total', cx: 1250, cy: 200, vals: [[3.7, '0'], [4.8, '1'], [6.0, 'True']], t0: 3.6 },
      { type: 'band', id: 'b1', rect: { code: 'cb', line: 1, from: 9, to: 21 }, t0: 6.8 },
      { type: 'strike', id: 's1', rect: { code: 'cb', line: 1, from: 18, to: 20 }, t0: 7.4 },
      { type: 'ringRect', id: 'r1', rect: { target: 'cb.out', w: 70, h: 70 }, t0: 7.0 },
      { type: 'label', id: 'l1', text: '终点不算！', at: [1000, 420], t0: 7.6, t1: 14, target: { code: 'cb', line: 1, col: 19 } },
      { type: 'numberLine', id: 'nl', from: 1, to: 10, x0: 300, y: 640, dx: 100, t0: 8, token: [[8.5, 1], [9.0, 2], [9.5, 3], [10.5, 9]], fence: [[8.2, 9.5], [12, 10.5]], hi: [[8.3, [1, 9]], [12, [1, 10]]] },
      { type: 'qm', id: 'qm', pos: [[0, [1480, FL]]], size: 170, t0: 1, sign: [[0, null], [2, '10去哪儿了？']], signSide: 'left', mood: [[0, 'doubt']] },
    ],
    subs: [{ t0: 0.3, t1: 3.5, text: '组件测试：代码块、变量盒子、数轴。' }],
  });
})();
