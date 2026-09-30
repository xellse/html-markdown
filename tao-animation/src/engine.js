/* =====================================================================
   CONFIG
   ===================================================================== */
const CFG = {
  W: 1600, H: 900, FPS: 24,
  BOIL_FPS: 5, BOIL_AMP: 1.1, WOBBLE: 1.4,
  FLOOR: 780,
  C: { paper: '#FBF8F1', ink: '#1E1E1E', red: '#D23A3F', pencil: '#9B9B9B', hi: '#FFE066' },
  FONT_ZH: "'ZCOOL KuaiLe','Patrick Hand',sans-serif",
  FONT_MIX: "'Patrick Hand','ZCOOL KuaiLe',sans-serif",
  FONT_MONO: "'VT323','Courier New',monospace",
  SIZE: { sub: 52, label: 40, speech: 84, mark: 84, series: 32 },
};
const C = CFG.C;
// draw-order layers
const Z = { set: 10, hi: 12, board: 14, shadow: 18, chair: 20, back: 28, body: 30, desk: 35, front: 40, fx: 50, annot: 60, stamp: 70, sub: 90 };
const RAD = Math.PI / 180;
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp = (a, b, u) => a + (b - a) * u;
const lerp2 = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const EASE = {
  lin: u => u,
  io: u => u * u * (3 - 2 * u),
  out: u => 1 - Math.pow(1 - u, 3),
  in: u => u * u * u,
  back: u => { const c = 2.2; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); },
};

/* =====================================================================
   NOISE / BOIL  (deterministic: static wobble per key + boil per floor(t*BOIL_FPS))
   ===================================================================== */
const HCACHE = new Map();
function hstr(s) {
  let h = HCACHE.get(s); if (h !== undefined) return h;
  h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  h >>>= 0; HCACHE.set(s, h); return h;
}
function rnd(a, b, c) { // -> [-1, 1)
  let t = (a ^ Math.imul(b + 1, 0x9E3779B1) ^ Math.imul(c + 7, 0x85EBCA77)) >>> 0;
  t = (t + 0x6D2B79F5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
}
const BOIL = { frame: 0, amp: CFG.BOIL_AMP };
function jit(h, i, p, amp) {
  const w = CFG.WOBBLE * 0.5, b = BOIL.amp * amp, f = BOIL.frame * 2 + 1000;
  return [p[0] + rnd(h, i, 1) * w + (b ? rnd(h, i, f) * b : 0),
          p[1] + rnd(h, i, 2) * w + (b ? rnd(h, i, f + 1) * b : 0)];
}

/* =====================================================================
   DRAW LIST  (flat, keyed items; affine matrix stack; reconciled into SVG)
   ===================================================================== */
const DL = {
  items: [], m: [1, 0, 0, 1, 0, 0], st: [], used: new Map(), zoff: 0,
  reset() { this.items.length = 0; this.m = [1, 0, 0, 1, 0, 0]; this.st.length = 0; this.used.clear(); this.zoff = 0; },
  save() { this.st.push(this.m.slice()); },
  restore() { this.m = this.st.pop(); },
  mul(n) {
    const [a, b, c, d, e, f] = this.m, [A, B, Cc, D, E, F] = n;
    this.m = [a * A + c * B, b * A + d * B, a * Cc + c * D, b * Cc + d * D, a * E + c * F + e, b * E + d * F + f];
  },
  translate(x, y) { this.mul([1, 0, 0, 1, x, y]); },
  scale(sx, sy = sx) { this.mul([sx, 0, 0, sy, 0, 0]); },
  rotate(deg) { const r = deg * RAD, c = Math.cos(r), s = Math.sin(r); this.mul([c, s, -s, c, 0, 0]); },
  about(x, y, fn) { this.translate(x, y); fn(); this.translate(-x, -y); },
  tp(p) { const m = this.m; return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]]; },
  k() { const m = this.m; return Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])); },
  add(z, key, tag, attrs, text) {
    const n = this.used.get(key) || 0; this.used.set(key, n + 1);
    if (n) key += '#' + n;
    this.items.push({ z: z + this.zoff, key, tag, attrs, text, o: this.items.length });
  },
};

/* =====================================================================
   DRAWING PRIMITIVES
   ===================================================================== */
const f1 = v => Math.round(v * 10) / 10;
function catRun(R) {
  const n = R.length; let d = '';
  if (n === 2) return `L${f1(R[1][0])} ${f1(R[1][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = R[Math.max(i - 1, 0)], p1 = R[i], p2 = R[i + 1], p3 = R[Math.min(i + 2, n - 1)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}
function smoothD(P, corners, closed) {
  let d = `M${f1(P[0][0])} ${f1(P[0][1])}`;
  if (closed) {
    const n = P.length;
    for (let i = 0; i < n; i++) {
      const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + 'Z';
  }
  let s = 0;
  for (let i = 1; i < P.length; i++) {
    if (i === P.length - 1 || corners[i]) { d += catRun(P.slice(s, i + 1)); s = i; }
  }
  return d;
}
/** A hand-drawn stroke through local points (3rd element truthy = sharp corner).
 *  o: {z, w, color, fill, closed, draw(0..1), boil(scale), opacity, bow, noStroke, blend} */
function stroke(key, pts, o = {}) {
  if (o.draw !== undefined && o.draw <= 0.002) return;
  if (!pts || pts.length < 2) return;
  const h = hstr(key);
  let P = pts, corners = pts.map(p => !!p[2]);
  if (P.length === 2 && !o.closed) {
    const a = P[0], b = P[1], len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const bow = rnd(h, 99, 5) * Math.min(3, len * 0.03) * (o.bow ?? 1);
    P = [a, [(a[0] + b[0]) / 2 - (b[1] - a[1]) / len * bow, (a[1] + b[1]) / 2 + (b[0] - a[0]) / len * bow], b];
    corners = [false, false, false];
  }
  const amp = o.boil ?? 1;
  const W = P.map((p, i) => jit(h, i, DL.tp(p), amp));
  const a = {
    d: smoothD(W, corners, o.closed), fill: o.fill || 'none',
    stroke: o.noStroke ? 'none' : (o.color || C.ink),
    'stroke-width': +((o.w || 6) * DL.k()).toFixed(2),
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  };
  if (o.opacity !== undefined && o.opacity < 1) a.opacity = +o.opacity.toFixed(3);
  if (o.draw !== undefined && o.draw < 1) {
    a.pathLength = 1; a['stroke-dasharray'] = '1 2'; a['stroke-dashoffset'] = +(1 - o.draw).toFixed(4);
    if (a.fill !== 'none') a['fill-opacity'] = o.draw > 0.6 ? 1 : 0;
  }
  if (o.blend) a.style = 'mix-blend-mode:multiply';
  DL.add(o.z ?? Z.body, key, 'path', a);
}
/** Points on a lumpy ring. a0/sweep in degrees; rv = radius variation. */
function ringPts(key, cx, cy, rx, ry, o = {}) {
  const n = o.n || 12, a0 = (o.a0 ?? -120) * RAD, sweep = (o.sweep ?? 360) * RAD, rv = o.rv ?? 0.03;
  const h = hstr(key + '~r'), pts = [], closed = !!o.closed;
  const cnt = closed ? n : n + 1;
  for (let i = 0; i < cnt; i++) {
    const a = a0 + sweep * i / n;
    let rr = 1 + rnd(h, i % n, 3) * rv;
    if (!closed && i === cnt - 1) rr *= 0.965; // Orlin's closing tick
    pts.push([cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr]);
  }
  return pts;
}
function superPts(cx, cy, w, h, n = 20, ex = 5) { // rounded-rect-ish superellipse
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    pts.push([cx + Math.sign(c) * Math.pow(Math.abs(c), 2 / ex) * w / 2, cy + Math.sign(s) * Math.pow(Math.abs(s), 2 / ex) * h / 2]);
  }
  return pts;
}
function dot(key, p, r, color = C.ink, z = Z.front) {
  const q = DL.tp(p), k = DL.k();
  DL.add(z, key, 'circle', { cx: f1(q[0]), cy: f1(q[1]), r: +(r * k).toFixed(2), fill: color });
}
function text(key, str, x, y, o = {}) {
  const m = DL.m;
  let tf = `matrix(${m.map(v => +v.toFixed(4)).join(' ')}) translate(${f1(x)} ${f1(y)})`;
  if (o.rot) tf += ` rotate(${o.rot})`;
  if (o.scale !== undefined && o.scale !== 1) tf += ` scale(${+o.scale.toFixed(4)})`;
  const a = { transform: tf, x: 0, y: 0, 'font-size': o.size || 40, 'font-family': o.font || CFG.FONT_ZH,
    fill: o.color || C.ink, 'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'central' };
  if (o.opacity !== undefined && o.opacity < 1) a.opacity = +o.opacity.toFixed(3);
  if (o.halo) { a.stroke = C.paper; a['stroke-width'] = o.halo; a['stroke-linejoin'] = 'round'; a['paint-order'] = 'stroke'; }
  DL.add(o.z ?? Z.annot, key, 'text', a, str);
}
function textWidth(str, size) {
  let w = 0;
  for (const ch of str) w += ch.charCodeAt(0) > 0x2E80 ? size : (ch === ' ' ? 0.3 : 0.5) * size;
  return w;
}
/** Pencil-scribble ground shadow. */
function shadow(key, cx, cy, w, op = 1) {
  if (op <= 0.02) return;
  const pts = [], n = 9;
  for (let i = 0; i <= n; i++) {
    const u = i / n, amp = 6 * Math.sqrt(Math.max(0, 1 - Math.pow(2 * u - 1, 2))) + 1.5;
    pts.push([cx - w / 2 + w * u, cy + (i % 2 ? amp : -amp)]);
  }
  stroke(key, pts, { z: Z.shadow, w: 2.2, color: C.pencil, opacity: 0.75 * op, boil: 0.6 });
}
/** Curved arrow with a two-stroke head; draws on with p. */
function arrow(key, from, to, o = {}) {
  const p = o.p ?? 1; if (p <= 0) return;
  const len = dist(from, to) || 1, bend = (o.bend ?? 0.18) * len;
  const nx = -(to[1] - from[1]) / len, ny = (to[0] - from[0]) / len;
  const c = [(from[0] + to[0]) / 2 + nx * bend, (from[1] + to[1]) / 2 + ny * bend];
  const q = u => [(1 - u) * (1 - u) * from[0] + 2 * (1 - u) * u * c[0] + u * u * to[0], (1 - u) * (1 - u) * from[1] + 2 * (1 - u) * u * c[1] + u * u * to[1]];
  const pts = []; for (let i = 0; i <= 6; i++) pts.push(q(i / 6));
  const col = o.color || C.red, w = o.w || 3.5, z = o.z ?? Z.annot;
  stroke(key, pts, { z, w, color: col, draw: p, boil: 0.8 });
  if (p > 0.92) {
    const b = q(0.88), tl = dist(b, to) || 1, tx = (b[0] - to[0]) / tl, ty = (b[1] - to[1]) / tl, hl = o.head || 20;
    const r1 = [to[0] + (tx * Math.cos(0.5) - ty * Math.sin(0.5)) * hl, to[1] + (tx * Math.sin(0.5) + ty * Math.cos(0.5)) * hl];
    const r2 = [to[0] + (tx * Math.cos(-0.5) - ty * Math.sin(-0.5)) * hl, to[1] + (tx * Math.sin(-0.5) + ty * Math.cos(-0.5)) * hl];
    stroke(key + '.h', [r1, [to[0], to[1], 1], r2], { z, w, color: col, boil: 0.8 });
  }
}

/* =====================================================================
   HANDWRITING  (single-stroke glyphs so math is always *written*, in stroke order)
   units: height 1 (0 = top, 1 = baseline); 3rd value 1 = corner
   ===================================================================== */
const GLYPH = {
  '0': { w: .6, s: [[[.32, 0], [.08, .2], [.05, .6], [.2, .95], [.42, .98], [.57, .7], [.55, .25], [.34, 0]]] },
  '1': { w: .42, s: [[[.08, .2], [.28, 0, 1], [.28, 1]]] },
  '2': { w: .62, s: [[[.06, .24], [.22, .03], [.44, 0], [.6, .16], [.56, .4], [.3, .7], [.05, 1, 1], [.64, .98]]] },
  '3': { w: .6, s: [[[.07, .12], [.3, 0], [.55, .07], [.58, .27], [.3, .46, 1], [.6, .6], [.62, .84], [.38, 1], [.05, .9]]] },
  '4': { w: .62, s: [[[.46, 0], [.05, .68, 1], [.62, .68]], [[.47, .35], [.47, 1]]] },
  '5': { w: .6, s: [[[.15, .02], [.1, .44, 1], [.36, .37], [.58, .5], [.62, .76], [.42, .98], [.06, .9]], [[.15, .02], [.6, .02]]] },
  '6': { w: .6, s: [[[.55, .02], [.26, .2], [.07, .58], [.14, .92], [.38, 1], [.6, .84], [.58, .6], [.35, .5], [.1, .66]]] },
  '7': { w: .6, s: [[[.04, .04], [.6, .03, 1], [.24, 1]]] },
  '8': { w: .6, s: [[[.55, .14], [.32, 0], [.1, .14], [.3, .45], [.58, .72], [.32, 1], [.05, .74], [.3, .45], [.52, .26], [.55, .14]]] },
  '9': { w: .6, s: [[[.57, .3], [.34, .44], [.1, .3], [.16, .06], [.4, 0], [.57, .16], [.56, .5], [.48, 1]]] },
  'x': { w: .56, s: [[[.05, .4], [.3, .7], [.52, 1]], [[.52, .4], [.28, .7], [.04, 1]]] },
  '+': { w: .62, s: [[[.06, .6], [.56, .6]], [[.31, .34], [.31, .88]]] },
  '-': { w: .5, s: [[[.06, .6], [.44, .6]]] },
  '×': { w: .5, s: [[[.06, .42], [.44, .84]], [[.44, .42], [.06, .84]]] },
  '=': { w: .62, s: [[[.06, .5], [.56, .5]], [[.06, .74], [.56, .74]]] },
  '✓': { w: .8, s: [[[.02, .56], [.25, .9, 1], [.8, .02]]] },
  ' ': { w: .24, s: [] },
  ',': { w: .26, s: [[[.14, .86], [.13, 1.02], [.04, 1.16]]] },
  '.': { w: .24, s: [[[.1, .94], [.13, 1]]] },
  '?': { w: .56, s: [[[.06, .22], [.2, .03], [.4, 0], [.54, .14], [.5, .36], [.3, .52], [.28, .74]], [[.27, .93], [.29, .99]]] },
  '□': { w: .78, s: [[[.08, .2], [.7, .2, 1], [.7, .98, 1], [.08, .98, 1], [.08, .2]]] },
  '(': { w: .34, s: [[[.28, 0], [.1, .3], [.08, .68], [.28, 1.04]]] },
  ')': { w: .34, s: [[[.06, 0], [.24, .3], [.26, .68], [.06, 1.04]]] },
  '≠': { w: .62, s: [[[.06, .5], [.56, .5]], [[.06, .74], [.56, .74]], [[.44, .26], [.18, .98]]] },
  '…': { w: .62, s: [[[.08, .94], [.1, 1]], [[.28, .94], [.3, 1]], [[.48, .94], [.5, 1]]] },
  '→': { w: .82, s: [[[.04, .6], [.74, .6]], [[.52, .4], [.76, .6, 1], [.52, .8]]] },
  '÷': { w: .62, s: [[[.06, .6], [.56, .6]], [[.3, .34], [.31, .38]], [[.3, .82], [.31, .86]]] },
};
function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += dist(pts[i - 1], pts[i]); return L; }
function pointAt(pts, u) {
  const L = polyLen(pts) * u; let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = dist(pts[i - 1], pts[i]);
    if (acc + d >= L) return lerp2(pts[i - 1], pts[i], d ? (L - acc) / d : 0);
    acc += d;
  }
  return pts[pts.length - 1];
}
/** Precompute layout + timing of a handwriting block (pure data). */
function layoutWriting(fx) {
  const size = fx.size, strokes = [], boxes = [];
  let cx = fx.x, tt = fx.t0;
  [...fx.text].forEach((ch, gi) => {
    const g = GLYPH[ch]; if (!g) return;
    boxes.push({ ch, x: cx, y: fx.y, w: g.w * size, h: size });
    g.s.forEach(s => {
      const pts = s.map(([u, v, c]) => [cx + u * size, fx.y + v * size, c]);
      const dur = Math.max(0.06, polyLen(pts) / fx.speed);
      strokes.push({ pts, t0: tt, dur, gi });
      tt += dur + (fx.gap ?? 0.04);
    });
    if (g.s.length) tt += fx.glyphGap ?? 0.03;
    cx += (g.w + (fx.track ?? 0.1)) * size;
  });
  fx.strokes = strokes; fx.boxes = boxes; fx.tEnd = tt; fx.xEnd = cx;
  return fx;
}
function penAt(fx, t) {
  let s = fx.strokes[0]; if (!s) return null;
  for (const k of fx.strokes) if (k.t0 <= t) s = k;
  return pointAt(s.pts, clamp((t - s.t0) / s.dur));
}

/* =====================================================================
   TRACKS  (keys: [t, value, dur=0.12, ease='io']; value may be a library name or fn(t))
   A key starts moving toward its value at t and arrives at t+dur.
   ===================================================================== */
function mix(a, b, u) {
  if (b === undefined) return a;
  if (a === undefined) return b;
  if (typeof b === 'number') return typeof a === 'number' ? a + (b - a) * u : b;
  if (Array.isArray(b)) return b.map((v, i) => mix(Array.isArray(a) ? a[i] : undefined, v, u));
  if (b && typeof b === 'object') {
    const o = {}; for (const k in a) o[k] = a[k];
    for (const k in b) o[k] = mix(a[k], b[k], u);
    return o;
  }
  return u < 0.5 ? a : b;
}
function evalTrack(keys, t, lib, base) {
  if (!keys || !keys.length) return base;
  const res = v => {
    if (typeof v === 'function') v = v(t);
    if (typeof v === 'string' && lib && lib[v]) v = lib[v];
    if (typeof v === 'function') v = v(t);
    if (base && typeof base === 'object' && !Array.isArray(base) && typeof v === 'object') v = Object.assign({}, base, v);
    return v;
  };
  let cur = res(keys[0][1]);
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i]; if (t < k[0]) break;
    const d = k[2] ?? 0.12, u = d <= 0 ? 1 : clamp((t - k[0]) / d);
    cur = mix(cur, res(k[1]), (EASE[k[3] || 'io'])(u));
  }
  return cur;
}
const stepTrack = (keys, t) => { let v = keys ? keys[0][1] : undefined; if (keys) for (const k of keys) if (k[0] <= t) v = k[1]; return v; };

/* =====================================================================
   CHARACTER RIG  — Orlin construction: lumpy head, big eye ovals with dot pupils,
   tiny mouth, one-line body, bare line-end hands/feet, ground shadow.
   ===================================================================== */
const DEF_POSE = { lean: 0, tilt: 0, armL: [16, 10], armR: [16, 10], legL: [7, 0], legR: [7, 0],
  armScale: 1, legScale: 1, thigh: 0.5, sit: 0, hop: 0, sq: 1, bagBob: 0, ikL: { w: 0 }, ikR: { w: 0 } };
const DEF_FACE = { eyes: 'open', lidL: 0, lidR: 0, eyeSY: 1, pupil: 1, brow: 'none', browL: 0, browR: 0, browY: 0,
  mouth: 'flat', mw: 0.28, mo: 0, mx: 0, headSY: 1 };

const SIT = { sit: 1, legScale: 0.85, thigh: 0.25, legL: [62, -57], legR: [62, -57] };
const POSE = {
  stand: {},
  // kid
  carryBag: { armL: [8, 48], armR: [8, 48] },
  crouch: { legL: [30, -62], legR: [30, -62], armL: [38, -25], armR: [38, -25], lean: 0 },
  jumpUp: { legL: [4, 12], legR: [4, 12], armL: [140, 12], armR: [140, 12] },
  sitHands: { ...SIT, legScale: 1.15, thigh: 0.2, legL: [70, -63], legR: [70, -63], ikL: { w: 1, to: 'hip', dx: -30, dy: 12, bend: 'out' }, ikR: { w: 1, to: 'hip', dx: 30, dy: 12, bend: 'out' } },
  sitCrouch: { ...SIT, legScale: 1.1, thigh: 0.2, lean: 4, tilt: 4, sq: 0.9, armL: [22, -10], armR: [22, -10], legL: [70, -50], legR: [70, -50] },
  raiseHand: { legL: [8, 0], legR: [8, 0], lean: -6, tilt: -4, armScale: 1.95, armR: [138, 34],
    ikL: { w: 1, to: 'hip', dx: -22, dy: -10, bend: 'out' } },
  // teen (seated behind desk)
  sitBase: { ...SIT },
  chinHand: { ...SIT, tilt: 12, lean: 3, ikR: { w: 1, to: 'chin', dx: 0.28, dy: 0.02, bend: 'down' }, ikL: { w: 1, to: 'desk', dx: -62, dy: -2, bend: 'out' } },
  armsDesk: { ...SIT, tilt: -5, lean: -2, ikL: { w: 1, to: 'desk', dx: 34, dy: -2, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: -34, dy: -2, bend: 'down' } },
  leanBack: { ...SIT, lean: -7, tilt: -7, armL: [14, 4], ikR: { w: 1, to: 'desk', dx: 62, dy: -2, bend: 'out' } },
  sitUp: { ...SIT, ikL: { w: 1, to: 'desk', dx: -52, dy: -2, bend: 'out' }, ikR: { w: 1, to: 'desk', dx: 52, dy: -2, bend: 'out' } },
  scratchHead: { ...SIT, tilt: 8, ikR: { w: 1, to: 'head', dx: 0.72, dy: -0.72, bend: 'out' }, ikL: { w: 1, to: 'desk', dx: -52, dy: -2, bend: 'out' } },
  thinkChin: { ...SIT, tilt: -8, ikL: { w: 1, to: 'chin', dx: -0.2, dy: 0.02, bend: 'down' }, ikR: { w: 1, to: 'desk', dx: 52, dy: -2, bend: 'out' } },
  shock: { ...SIT, lean: -5, tilt: 0, armL: [118, 36], armR: [118, 36] },
  // teacher
  chalkUp: { armR: [70, 55], armL: [12, 8] },
  write: { lean: 3, armScale: 1.3, armL: [12, 6], ikR: { w: 1, to: 'pen', bend: 'down' } },
  present: { armR: [96, 8], armL: [12, 8] },
  teachShock: { lean: -4, armL: [48, 70], armR: [70, 40] },
};
const FACE = {
  neutral: {},
  smile: { mouth: 'smile', mw: 0.34 },
  focus: { brow: 'line', browL: 14, browR: 14, mouth: 'flat', mw: 0.2 },
  idea: { eyeSY: 1.1, brow: 'arc', browY: 0.04, mouth: 'o' },
  grin: { mouth: 'grin', mw: 0.46, brow: 'arc', browY: 0.02 },
  proud: { lidL: 0.34, lidR: 0.34, mouth: 'smirk', mw: 0.32 },
  joy: { eyes: 'happy', mouth: 'grin', mw: 0.44 },
  bored: { lidL: 0.52, lidR: 0.52, mouth: 'flat', mw: 0.22 },
  puzzled: { lidL: 0.32, brow: 'line', browL: -16, browR: 20, mouth: 'wavy', mw: 0.32 },
  surprised: { eyeSY: 1.12, pupil: 0.78, brow: 'arc', browY: 0.06, mouth: 'o' },
  jaw: { eyeSY: 1.2, pupil: 0.62, brow: 'arc', browY: 0.16, mouth: 'jaw', mo: 1, headSY: 1.08 },
};

const HAIR = {
  // Terry: an upright three-strand tuft with a curl — the series' silhouette
  tuft(sw, sx) {
    const b = 0.02;
    return [
      [[b, -0.97], [b + 0.05 + sx * 0.4, -1.32 - sw * 0.25], [b + 0.2 + sx * 0.7, -1.56 - sw * 0.35], [b + 0.37 + sx * 0.8, -1.5 - sw * 0.3], [b + 0.36 + sx * 0.7, -1.34 - sw * 0.2]],
      [[b - 0.16, -0.95], [b - 0.26 + sx * 0.4, -1.26 - sw * 0.2], [b - 0.4 + sx * 0.5, -1.33 - sw * 0.2]],
      [[b + 0.16, -0.96], [b + 0.3 + sx * 0.3, -1.22 - sw * 0.15]],
    ];
  },
  messy() {
    const z = [];
    for (let i = 0; i <= 14; i++) { const a = (-172 + i * 11.5) * RAD, r = i % 2 ? 1.24 : 0.9; z.push([Math.cos(a) * r, Math.sin(a) * r]); }
    const z2 = [];
    for (let i = 0; i <= 8; i++) { const a = (-150 + i * 15) * RAD, r = i % 2 ? 1.12 : 0.8; z2.push([Math.cos(a) * r, Math.sin(a) * r]); }
    return [z, z2];
  },
  part() {
    const p = [-0.38, -0.92];
    return [
      [p, [0.1, -0.86], [0.6, -0.7], [0.93, -0.36]],
      [[p[0] + 0.04, p[1] + 0.1], [0.2, -0.72], [0.62, -0.55], [0.98, -0.18]],
      [p, [-0.7, -0.66], [-0.97, -0.3]],
      [[-0.5, -0.8], [-0.85, -0.48], [-1.0, -0.12]],
    ];
  },
  ponytail(sw, sx) {
    const bang = [];
    for (let i = 0; i <= 10; i++) { const a = (-160 + i * 14) * RAD, r = i % 2 ? 1.04 : 0.82; bang.push([Math.cos(a) * r, Math.sin(a) * r]); }
    return [
      bang,
      [[0.78, -0.66], [1.2, -0.84], [1.58, -0.5], [1.6 + sx, 0.0], [1.42 + sx, 0.42]],
      [[0.86, -0.56], [1.25, -0.4], [1.36 + sx, 0.02], [1.26 + sx, 0.3]],
      [[-0.96, -0.25], [-1.08, 0.3], [-1.02, 0.85]],
      [[0.97, -0.2], [1.06, 0.34]],
    ];
  },
  sides() {
    // bald dome, two scruffy side tufts, a hopeful comb-over
    const side = s => { const z = []; for (let i = 0; i <= 6; i++) { const a = (s < 0 ? 150 + i * 9 : 30 - i * 9) * RAD, r = i % 2 ? 1.12 : 0.97; z.push([Math.cos(a) * r, Math.sin(a) * r]); } return z; };
    return [side(-1), side(1), [[-0.42, -0.9], [-0.05, -1.08], [0.38, -0.96]], [[-0.3, -0.94], [0.05, -1.14], [0.45, -1.02]]];
  },
};

/** Two-bone IK; returns [elbow, hand]. */
function solveIK(sh, tgt, L1, L2, pick) {
  let dx = tgt[0] - sh[0], dy = tgt[1] - sh[1], d = Math.hypot(dx, dy) || 1;
  const dc = clamp(d, Math.abs(L1 - L2) + 1, L1 + L2 - 0.5);
  const base = Math.atan2(dy, dx), a = Math.acos(clamp((L1 * L1 + dc * dc - L2 * L2) / (2 * L1 * dc), -1, 1));
  const e1 = [sh[0] + Math.cos(base + a) * L1, sh[1] + Math.sin(base + a) * L1];
  const e2 = [sh[0] + Math.cos(base - a) * L1, sh[1] + Math.sin(base - a) * L1];
  const hand = [sh[0] + dx / d * dc, sh[1] + dy / d * dc];
  return [pick(e1, e2), hand];
}

/** Layout pass: resolves tracks and computes the skeleton (no drawing). */
function layoutChar(id, t, F) {
  const def = CAST[id], tr = TRACKS[id] || {};
  const enter = tr.enter ?? -1;
  if (t < enter) return null;
  const pos = evalTrack(tr.pos, t);
  const pose = evalTrack(tr.pose, t, POSE, DEF_POSE);
  const face = evalTrack(tr.face, t, FACE, DEF_FACE);
  const turn = evalTrack(tr.turn, t) ?? 0;
  const sqT = evalTrack(tr.squash, t) ?? 1;
  const H = def.H, r = def.head * H / 2, T = def.torso * H;
  const Lg = def.leg * H * pose.legScale, A = def.arm * H * pose.armScale;
  const [x, y] = pos;
  const seg = (a, len, s) => [s * Math.sin(a * RAD) * len, Math.cos(a * RAD) * len];
  const leg = (spec, s) => {
    const k = seg(spec[0], Lg * pose.thigh, s), f = seg(spec[0] + spec[1], Lg * (1 - pose.thigh), s);
    return { knee: k, foot: [k[0] + f[0], k[1] + f[1]] };
  };
  const lL = leg(pose.legL, -1), lR = leg(pose.legR, 1);
  const reach = Math.max(lL.foot[1], lR.foot[1]);
  const hip = [x, y - (1 - pose.sit) * reach + pose.hop];
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const ln = pose.lean * RAD;
  const neck = [hip[0] + Math.sin(ln) * T, hip[1] - Math.cos(ln) * T];
  const sh = lerp2(neck, hip, 0.15);
  const ha = (pose.lean + pose.tilt) * RAD;
  const head = [neck[0] + Math.sin(ha) * r * 0.92, neck[1] - Math.cos(ha) * r * 0.92];
  const L = { id, def, t, pos, pose, face, turn, r, hip, neck, sh, head, ha,
    knees: [add(hip, lL.knee), add(hip, lR.knee)], feet: [add(hip, lL.foot), add(hip, lR.foot)] };
  // head-local -> world (unit = head radius)
  L.hl = (u, v) => {
    const X = u * r, Y = v * r * face.headSY, c = Math.cos(ha), s = Math.sin(ha);
    return [head[0] + X * c - Y * s, head[1] + X * s + Y * c];
  };
  // arms
  const half = A / 2;
  const target = spec => {
    const dx = spec.dx || 0, dy = spec.dy || 0;
    switch (spec.to) {
      case 'hip': return [hip[0] + dx, hip[1] + dy];
      case 'chin': return L.hl(dx, 0.98 + dy);
      case 'head': return L.hl(dx, dy);
      case 'desk': return [def.desk[0] + dx, def.desk[1] + dy];
      case 'pen': { // aim at the pen, but never steeper than ~32deg (keeps the arm clear of the head)
        const pp = F.pen || [sh[0] + 300, sh[1] - 200], vx = Math.max(1, pp[0] - sh[0]), vy = Math.max(pp[1] - sh[1], -vx * 0.42);
        return [sh[0] + vx, sh[1] + vy];
      }
      default: return [dx, dy];
    }
  };
  L.elbows = []; L.hands = [];
  [-1, 1].forEach((s, i) => {
    const spec = s < 0 ? pose.armL : pose.armR, ik = s < 0 ? pose.ikL : pose.ikR;
    let e = add(sh, seg(spec[0], half, s)), h = add(e, seg(spec[0] + spec[1], half, s));
    if (ik && ik.w > 0.001) {
      const pick = ik.bend === 'down' ? (a, b) => (a[1] > b[1] ? a : b) : (a, b) => (s * a[0] > s * b[0] ? a : b);
      const [e2, h2] = solveIK(sh, target(ik), half, half, pick);
      e = lerp2(e, e2, ik.w); h = lerp2(h, h2, ik.w);
    }
    L.elbows[i] = e; L.hands[i] = h;
  });
  // squash & stretch about the base point, plus entrance pop
  let pop = 1;
  if (tr.enter !== undefined) { const u = (t - tr.enter) / 0.3; if (u < 1) pop = Math.max(0.01, EASE.back(clamp(u))); }
  const sq = sqT * pose.sq;
  L.base = [x, y]; L.sy = sq * pop; L.sx = (1 + (1 - sq) * 0.6) * pop;
  const tf = p => [x + (p[0] - x) * L.sx, y + (p[1] - y) * L.sy];
  // hair lag from vertical/horizontal velocity (pure: sampled at t and t-0.07)
  if (tr.pos) {
    const p0 = evalTrack(tr.pos, t - 0.07), pz = evalTrack(tr.pose, t - 0.07, POSE, DEF_POSE);
    const vy = (y + pose.hop) - (p0[1] + pz.hop), vx = x - p0[0];
    L.sway = clamp(vy * 0.012 + (sqT - (evalTrack(tr.squash, t - 0.07) ?? 1)) * -1.5, -0.4, 0.4);
    L.swayX = clamp(-vx * 0.004, -0.25, 0.25);
  } else { L.sway = 0; L.swayX = 0; }
  F.anchors[id] = {
    head: tf(head), headTop: tf(L.hl(0, -1)), mouth: tf(L.hl(0, 0.62)), jaw: tf(L.hl(0, 1.2)),
    handL: tf(L.hands[0]), handR: tf(L.hands[1]), hip: tf(hip), r: r * L.sy,
    footL: tf(L.feet[0]), footR: tf(L.feet[1]),
  };
  return L;
}

function drawChar(L, F) {
  DL.zoff = L.def.z || 0;
  try { drawCharBody(L, F); } finally { DL.zoff = 0; }
}
function drawCharBody(L, F) {
  const { id, def, pose, face, turn, r, hip, neck, sh, t } = L, hl = L.hl, key = k => id + '.' + k;
  const bw = def.kid ? 5.5 : 6;
  // shadow (outside squash)
  if (!def.noShadow) {
    const FL = floorOf(def), onFloor = clamp(1 - (FL - L.pos[1]) / 30) * (1 - pose.sit);
    const lift = clamp((FL - Math.max(L.feet[0][1], L.feet[1][1])) / 120);
    shadow(key('shadow'), L.pos[0], FL + 4, def.H * 0.36 * (1 - lift * 0.5), onFloor);
  }
  DL.save();
  DL.translate(L.base[0], L.base[1]); DL.scale(L.sx, L.sy); DL.translate(-L.base[0], -L.base[1]);
  // back props
  if (def.bag) drawBagOnChar(L, F);
  // legs + torso
  stroke(key('legL'), [hip, L.knees[0], L.feet[0]], { z: Z.body, w: bw });
  stroke(key('legR'), [hip, L.knees[1], L.feet[1]], { z: Z.body, w: bw });
  stroke(key('torso'), [hip, neck], { z: Z.body, w: bw });
  if (def.tie) {
    const dx = hip[0] - neck[0], dy = hip[1] - neck[1], dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl, px = -uy, py = ux;
    const P = (a, b) => [neck[0] + ux * a + px * b, neck[1] + uy * a + py * b];
    stroke(key('tie'), [P(10, -9), P(dl * 0.52, -12), P(dl * 0.62, 0), P(dl * 0.52, 12), P(10, 9)], { z: Z.body, w: 4, closed: true, fill: C.paper });
    stroke(key('knot'), [P(2, -8), P(12, -8), P(12, 8), P(2, 8)], { z: Z.body, w: 4, closed: true, fill: C.paper });
  }
  // arms
  stroke(key('armL'), [sh, L.elbows[0], L.hands[0]], { z: Z.front, w: bw });
  stroke(key('armR'), [sh, L.elbows[1], L.hands[1]], { z: Z.front, w: bw });
  if (def.chalk) {
    const e = L.elbows[1], h = L.hands[1], d = dist(e, h) || 1, u = [(h[0] - e[0]) / d, (h[1] - e[1]) / d];
    const tip = [h[0] + u[0] * 16, h[1] + u[1] * 16];
    stroke(key('chalk'), [h, tip], { z: Z.front, w: 11 });
    stroke(key('chalk2'), [[h[0] + u[0] * 3, h[1] + u[1] * 3], [tip[0] - u[0] * 3, tip[1] - u[1] * 3]], { z: Z.front, w: 4.5, color: C.paper, boil: 0 });
  }
  // head
  const ring = ringPts(key('head'), 0, 0, 1, 1, { n: 12, a0: -120, sweep: 372, rv: 0.035 }).map(p => hl(p[0], p[1]));
  const fillRing = ringPts(key('head'), 0, 0, 1, 1, { n: 12, a0: -120, sweep: 360, rv: 0.035, closed: true }).map(p => hl(p[0], p[1]));
  stroke(key('headFill'), fillRing, { z: Z.front, closed: true, fill: C.paper, noStroke: true, w: 1 });
  stroke(key('headLine'), ring, { z: Z.front, w: bw });
  drawFace(L, F, key);
  // hair
  const hf = HAIR[def.hair];
  if (hf) {
    const shift = turn * 0.16;
    hf(L.sway, L.swayX).forEach((pts, i) => stroke(key('hair' + i), pts.map(p => hl(p[0] + shift, p[1])), { z: Z.front, w: def.hair === 'tuft' ? 5 : 4.2 }));
  }
  DL.restore();
}

function drawFace(L, F, key) {
  const { def, face, turn, t, hl } = L;
  const kid = !!def.kid;
  const fu = turn * 0.28;
  const ex = kid ? 0.36 : 0.38, ey = kid ? -0.1 : -0.16, erx = kid ? 0.34 : 0.36, ery = kid ? 0.41 : 0.44;
  const pr = (kid ? 0.14 : 0.115) * face.pupil;
  // blink (deterministic)
  const bl = def.blink || [3.7, 0.4];
  const blinking = face.eyes === 'open' && face.eyeSY <= 1.02 && ((t + bl[1]) % bl[0]) < 0.1;
  const gz = stepTrack((TRACKS[L.id] || {}).gaze, t) ?? 'viewer';
  let gpt = null;
  if (Array.isArray(gz)) gpt = gz; else if (gz !== 'viewer') gpt = F.targets[gz] || null;
  const eyesW = [];
  [-1, 1].forEach((s, i) => {
    const far = s * turn < 0 ? 1 - 0.28 * Math.abs(turn) : 1;
    const rx = erx * (1 - 0.1 * Math.abs(turn)) * far, ry = ery * face.eyeSY;
    const cx = s * ex * (1 - 0.12 * Math.abs(turn)) + fu, cy = ey - (face.eyeSY - 1) * 0.2;
    const k = key('eye' + i);
    if (blinking) {
      stroke(k, [hl(cx - rx * 0.85, cy + 0.04), hl(cx, cy + ry * 0.2), hl(cx + rx * 0.85, cy + 0.04)], { z: Z.front, w: 4.5 });
      return;
    }
    if (face.eyes === 'happy') {
      stroke(k, [hl(cx - rx * 0.82, cy + ry * 0.18), hl(cx, cy - ry * 0.42), hl(cx + rx * 0.82, cy + ry * 0.18)], { z: Z.front, w: 5 });
      return;
    }
    const ring = ringPts(k, cx, cy, rx, ry, { n: 11, a0: -100, sweep: 360, rv: 0.04, closed: true }).map(p => hl(p[0], p[1]));
    stroke(k, ring, { z: Z.front, w: 4.5, closed: true, fill: C.paper });
    // pupil: pinned to the rim in the gaze direction
    let dx = 0, dy = 0.25;
    if (gpt) {
      const ew = hl(cx, cy), vx = gpt[0] - ew[0], vy = gpt[1] - ew[1], c = Math.cos(-L.ha), sn = Math.sin(-L.ha);
      dx = vx * c - vy * sn; dy = vx * sn + vy * c;
    }
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const rim = 1 / Math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2);
    const m = gpt ? Math.max(0, rim - pr - 0.03) : 0.06;
    let px = cx + dx * m, py = cy + dy * m;
    const lid = s < 0 ? face.lidL : face.lidR;
    if (lid > 0.01) {
      const ly = cy - ry + 2 * ry * lid, hw = rx * Math.sqrt(Math.max(0, 1 - ((ly - cy) / ry) ** 2));
      stroke(k + 'lid', [hl(cx - hw, ly), hl(cx + hw, ly)], { z: Z.front, w: 4.5, bow: 0.3 });
      py = Math.max(py, Math.min(ly + pr * 0.8, cy + ry - pr));
      // keep pupil inside the oval after pushing it under the lid
      const ny = (py - cy) / ry, maxX = rx * Math.sqrt(Math.max(0, 1 - ny * ny)) - pr;
      px = clamp(px, cx - maxX, cx + maxX);
    }
    dot(k + 'p', hl(px, py), pr * L.r, C.ink, Z.front);
    eyesW.push({ cx, cy, rx, ry });
  });
  // brows
  if (face.brow !== 'none') {
    [-1, 1].forEach((s, i) => {
      const cx = s * ex + fu, top = ey - ery * face.eyeSY - (face.eyeSY - 1) * 0.2;
      const k = key('brow' + i);
      if (face.brow === 'arc') {
        const by = top - 0.14 - face.browY;
        stroke(k, [hl(cx - erx * 0.6, by + 0.06), hl(cx, by - 0.05), hl(cx + erx * 0.6, by + 0.06)], { z: Z.front, w: 4.2 });
      } else {
        const by = top - 0.1 - face.browY, a = (s < 0 ? face.browL : face.browR) * RAD, hlf = 0.2;
        stroke(k, [hl(cx - s * hlf * Math.cos(a), by + hlf * Math.sin(a)), hl(cx + s * hlf * Math.cos(a), by - hlf * Math.sin(a))], { z: Z.front, w: 4.6 });
      }
    });
  }
  // glasses
  if (def.glasses && !blinking) {
    eyesW.forEach((e, i) => stroke(key('gl' + i), superPts(e.cx, e.cy, e.rx * 2 + 0.16, e.ry * 1.75, 16, 4).map(p => hl(p[0], p[1])), { z: Z.front, w: 4, closed: true }));
    if (eyesW.length === 2) stroke(key('glb'), [hl(fu - 0.06, ey - 0.12), hl(fu + 0.06, ey - 0.12)], { z: Z.front, w: 4 });
  }
  // mouth
  const mx = face.mx + fu * 0.85, my = 0.6, w = face.mw, k = key('mouth');
  switch (face.mouth) {
    case 'smile': stroke(k, [hl(mx - w / 2, my - 0.04), hl(mx, my + 0.08), hl(mx + w / 2, my - 0.04)], { z: Z.front, w: 4.5 }); break;
    case 'grin': stroke(k, [hl(mx - w / 2, my - 0.04), hl(mx + w / 2, my - 0.04, 1), hl(mx + w / 4, my + 0.14), hl(mx, my + 0.18), hl(mx - w / 4, my + 0.14)].map((p, i) => i === 1 ? [p[0], p[1], 1] : p), { z: Z.front, w: 4.5, closed: true, fill: C.paper }); break;
    case 'o': stroke(k, ringPts(k, mx, my + 0.02, 0.075, 0.09, { n: 8, closed: true }).map(p => hl(p[0], p[1])), { z: Z.front, w: 4.2, closed: true, fill: C.paper }); break;
    case 'jaw': {
      const cy = my + 0.02 + 0.28 * face.mo, ry = 0.1 + 0.36 * face.mo, rx = 0.12 + 0.05 * face.mo;
      stroke(k, ringPts(k, mx, cy, rx, ry, { n: 10, closed: true }).map(p => hl(p[0], p[1])), { z: Z.front, w: 4.5, closed: true, fill: C.paper });
      break;
    }
    case 'wavy': stroke(k, [hl(mx - w / 2, my), hl(mx - w / 4, my - 0.05), hl(mx, my + 0.03), hl(mx + w / 4, my - 0.05), hl(mx + w / 2, my + 0.01)], { z: Z.front, w: 4.2 }); break;
    case 'smirk': stroke(k, [hl(mx - w / 2, my + 0.02), hl(mx + w / 5, my + 0.03), hl(mx + w / 2, my - 0.07)], { z: Z.front, w: 4.5 }); break;
    case 'frown': stroke(k, [hl(mx - w / 2, my + 0.05), hl(mx, my - 0.05), hl(mx + w / 2, my + 0.05)], { z: Z.front, w: 4.5 }); break;
    default: stroke(k, [hl(mx - w / 2, my), hl(mx + w / 2, my)], { z: Z.front, w: 4.5 });
  }
}

/* =====================================================================
   PROPS
   ===================================================================== */
const BAG = { w: 122, h: 152 };
function bagShape(key, cx, cy, rot, sq, z, p = 1) {
  DL.save(); DL.translate(cx, cy + BAG.h / 2); DL.rotate(rot); DL.scale(1 + (1 - sq) * 0.6, sq); DL.translate(0, -BAG.h / 2);
  const w = BAG.w, h = BAG.h;
  stroke(key + '.body', superPts(0, 0, w, h, 22, 4.2), { z, w: 5, closed: true, fill: C.paper, draw: p });
  stroke(key + '.flap', [[-w / 2 + 5, -h / 2 + 44], [-w * 0.2, -h / 2 + 60], [w * 0.2, -h / 2 + 60], [w / 2 - 5, -h / 2 + 44]], { z, w: 4.5, draw: p });
  stroke(key + '.pocket', superPts(0, h * 0.2, w * 0.58, h * 0.32, 14, 4), { z, w: 4, closed: true, draw: p });
  stroke(key + '.handle', [[-18, -h / 2 + 2], [-14, -h / 2 - 16], [14, -h / 2 - 16], [18, -h / 2 + 2]], { z, w: 4.5, draw: p });
  stroke(key + '.buckle', [[-8, -h / 2 + 54], [8, -h / 2 + 54, 1], [8, -h / 2 + 70, 1], [-8, -h / 2 + 70, 1], [-8, -h / 2 + 54]], { z, w: 3.5, draw: p });
  DL.restore();
}
function bagOnBack(L) { return [L.hip[0] + 40, L.neck[1] + 44 + L.pose.bagBob]; }
function drawBagOnChar(L, F) {
  const tr = TRACKS[L.id], u = evalTrack(tr.bag, L.t) ?? 1;
  if (u < 0.999) return; // detached: drawn by drawLooseBag outside the squash
  const c = bagOnBack(L);
  bagShape(L.id + '.bag', c[0], c[1], -4, 1, Z.back);
  stroke(L.id + '.strap', [[L.neck[0] + 16, L.neck[1] + 4], [L.neck[0] + 2, L.neck[1] + 30], [L.hip[0] - 6, L.hip[1] - 8]], { z: Z.body, w: 4.5 });
  F.anchors[L.id].bag = [c[0], c[1] - BAG.h / 2];
}
function drawLooseBag(L, F) {
  const tr = TRACKS[L.id], u = evalTrack(tr.bag, L.t) ?? 1;
  if (u >= 0.999) return;
  const tf = p => [L.base[0] + (p[0] - L.base[0]) * L.sx, L.base[1] + (p[1] - L.base[1]) * L.sy];
  const from = tf(bagOnBack(L)), to = CAST[L.id].bagFloor;
  const c = [lerp(to[0], from[0], u), lerp(to[1], from[1], u) - Math.sin(Math.PI * u) * 30];
  const sq = evalTrack(tr.bagSq, L.t) ?? 1;
  bagShape(L.id + '.bag', c[0], c[1], lerp(0, -12, u), sq, Z.back);
  shadow(L.id + '.bagshadow', to[0], floorOf(CAST[L.id]) + 4, BAG.w * 1.1, 1 - u);
  F.anchors[L.id].bag = [c[0], c[1] - BAG.h / 2 * sq];
}

/* =====================================================================
   SCENE STATE  — the active scene's data, swapped in by useScene() every frame
   ===================================================================== */
let SC = null, CAST = {}, TRACKS = {}, FXBY = {};
function floorOf(def) { return (def && def.floor) ?? (SC && SC.floor) ?? CFG.FLOOR; }

// shared poses (scenes may add their own with Object.assign(POSE, {...}))
Object.assign(POSE, {
  sitFloor: { sit: 1, legScale: 0.9, thigh: 0.5, legL: [84, 0], legR: [84, 0], armL: [34, 30], armR: [34, 30] },
  wave: { armR: [118, 52], armL: [16, 10] },
  point: { armR: [84, 6], armL: [16, 10] },
  cheer: { armL: [150, 14], armR: [150, 14] },
});
/** Generic walk cycle → pose function of t. o: {bag, idle, lean, bounce} */
function makeWalk(t0, t1, hz = 5.2, o = {}) {
  const idle = o.idle || 'stand', carry = !!o.bag;
  return t => {
    if (t < t0 || t >= t1) return POSE[idle];
    const ph = (t - t0) * hz * Math.PI, s = Math.sin(ph), a = Math.abs(s);
    const odd = Math.floor((t - t0) * hz) % 2;
    const arms = carry ? { armL: [8 + 10 * s, 48], armR: [8 - 10 * s, 48] } : { armL: [14 + 20 * s, 14], armR: [14 - 20 * s, 14] };
    return { legL: [3 + 22 * a, odd ? -38 * (1 - a) : 0], legR: [3 + 22 * a, odd ? 0 : -38 * (1 - a)], ...arms,
      hop: -10 * (1 - a) * (o.bounce ?? 1), lean: o.lean ?? -5, tilt: 3 * s, sq: 1 - 0.05 * a, bagBob: 7 * Math.sin(ph * 2 - 1.3) };
  };
}
/** Walk position: linear from p0 (at t0) to p1 (at t1). */
const walkPath = (t0, t1, x0, x1, y) => [[0, [x0, y]], [t0, [x1, y], t1 - t0, 'lin']];

/* =====================================================================
   SET PIECES  (draw on in stroke order with p; scenes may add their own)
   ===================================================================== */
const stag = (p, i, n) => clamp(p * n - i * 0.7);
const SETDRAW = {
  floor(s, p) { const y = s.y ?? floorOf(); stroke('floor', [[20, y], [800, y + 2], [1580, y - 1]], { z: Z.set, w: 2.2, color: C.pencil, draw: p, opacity: 0.8 }); },
  board(s, p) {
    const { x, y, w, h } = s;
    const rect = (k, x0, y0, x1, y1, i, ww) => stroke(k, [[x0, y0], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1], [x0, y0 - 2]], { z: Z.set, w: ww, draw: stag(p, i, 4) });
    rect('board.o', x, y, x + w, y + h, 0, 6);
    rect('board.i', x + 14, y + 14, x + w - 14, y + h - 14, 1, 3.5);
    stroke('board.tray', [[x + 30, y + h + 12], [x + w - 30, y + h + 12]], { z: Z.set, w: 5, draw: stag(p, 2, 4) });
    stroke('board.eraser', superPts(x + w - 150, y + h + 2, 64, 18, 12, 6), { z: Z.set, w: 4, closed: true, fill: C.paper, draw: stag(p, 3, 4) });
    for (let i = 0; i < 5; i++) stroke('board.dust' + i, [[x + 60 + i * 13, y + h - 30], [x + 84 + i * 13, y + h - 58]], { z: Z.set, w: 1.8, color: C.pencil, opacity: 0.55 * stag(p, 3, 4), boil: 0.5 });
  },
  desk(s, p) {
    const { x, top } = s, z = Z.desk, FL = floorOf(), w = s.w || 226;
    stroke(`desk${x}.slab`, superPts(x, top + 9, w, 20, 16, 7), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
    if (!s.open) stroke(`desk${x}.panel`, [[x - w / 2 + 13, top + 19], [x + w / 2 - 13, top + 19, 1], [x + w / 2 - 13, top + 76, 1], [x - w / 2 + 13, top + 76, 1], [x - w / 2 + 13, top + 19]], { z, w: 4.5, fill: C.paper, draw: stag(p, 1, 3) });
    stroke(`desk${x}.legL`, [[x - w / 2 + 19, top + (s.open ? 18 : 76)], [x - w / 2 + 17, FL]], { z, w: 5, draw: stag(p, 2, 3) });
    stroke(`desk${x}.legR`, [[x + w / 2 - 19, top + (s.open ? 18 : 76)], [x + w / 2 - 17, FL]], { z, w: 5, draw: stag(p, 2, 3) });
    if (p > 0.8) shadow(`desk${x}.sh`, x, FL + 4, w + 24, 1);
  },
  stool(s, p) {
    const { x, seat } = s, z = Z.chair, FL = floorOf();
    stroke(`stool${x}.seat`, superPts(x, seat + 6, 122, 18, 14, 6), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 0, 3) });
    stroke(`stool${x}.ll`, [[x - 48, seat + 14], [x - 58, FL]], { z, w: 5, draw: stag(p, 1, 3) });
    stroke(`stool${x}.lr`, [[x + 48, seat + 14], [x + 58, FL]], { z, w: 5, draw: stag(p, 1, 3) });
    stroke(`stool${x}.bar`, [[x - 55, seat + (FL - seat) * 0.78], [x + 55, seat + (FL - seat) * 0.78]], { z, w: 4, draw: stag(p, 2, 3) });
    if (p > 0.8) shadow(`stool${x}.sh`, x, FL + 4, 150, 1);
  },
  chair(s, p) {
    const { x, seat } = s, z = Z.chair, top = seat - 118, FL = floorOf();
    stroke(`chair${x}.pl`, [[x - 50, seat], [x - 48, top]], { z, w: 5, draw: stag(p, 0, 3) });
    stroke(`chair${x}.pr`, [[x + 50, seat], [x + 48, top]], { z, w: 5, draw: stag(p, 0, 3) });
    stroke(`chair${x}.rail`, [[x - 56, top], [x + 56, top]], { z, w: 5, draw: stag(p, 1, 3) });
    stroke(`chair${x}.rail2`, [[x - 50, top + 34], [x + 50, top + 34]], { z, w: 4, draw: stag(p, 1, 3) });
    if (s.full) {
      stroke(`chair${x}.seat`, superPts(x, seat + 5, 134, 16, 14, 6), { z, w: 5, closed: true, fill: C.paper, draw: stag(p, 1, 3) });
      stroke(`chair${x}.ll`, [[x - 56, seat + 12], [x - 62, FL]], { z, w: 5, draw: stag(p, 2, 3) });
      stroke(`chair${x}.lr`, [[x + 56, seat + 12], [x + 62, FL]], { z, w: 5, draw: stag(p, 2, 3) });
      if (p > 0.8) shadow(`chair${x}.sh`, x, FL + 4, 160, 1);
    }
  },
  /** Door frame the family peeks through. {x, w, top} */
  door(s, p) {
    const { x, w = 230, top = 250 } = s, FL = floorOf(), z = Z.set;
    stroke(`door${x}.f`, [[x - w / 2, FL], [x - w / 2, top, 1], [x + w / 2, top, 1], [x + w / 2, FL]], { z, w: 6, draw: stag(p, 0, 2) });
    stroke(`door${x}.i`, [[x - w / 2 + 16, FL], [x - w / 2 + 16, top + 16, 1], [x + w / 2 - 16, top + 16, 1], [x + w / 2 - 16, FL]], { z, w: 3, draw: stag(p, 1, 2) });
  },
};

/* =====================================================================
   COMPONENTS  (data-driven FX: draw(fx, t, F), optional init(fx) and cues(fx) → [[t, sfx]])
   ===================================================================== */
const PROPS = {}; // scene props drawn in local coords by COMP.prop
/** A little portrait of Terry's head (newspaper photo, thought bubbles, logos). */
function portrait(key, cx, cy, r, o = {}) {
  const z = o.z ?? Z.front, w = o.w || 4.5, col = o.color || C.ink;
  stroke(key + '.fill', ringPts(key, cx, cy, r, r, { n: 12, a0: -120, sweep: 360, rv: 0.035, closed: true }), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
  stroke(key + '.h', ringPts(key, cx, cy, r, r, { n: 12, a0: -120, sweep: 372, rv: 0.035 }), { z, w, color: col });
  HAIR.tuft(0, 0).forEach((pts, i) => stroke(key + '.t' + i, pts.map(p => [cx + p[0] * r, cy + p[1] * r]), { z, w: w * 0.9, color: col }));
  [-1, 1].forEach((s, i) => {
    stroke(key + '.e' + i, ringPts(key + '.e' + i, cx + s * 0.36 * r, cy - 0.1 * r, 0.3 * r, 0.37 * r, { n: 10, closed: true }), { z, w: w * 0.8, color: col, closed: true, fill: C.paper });
    dot(key + '.p' + i, [cx + s * 0.36 * r, cy - 0.04 * r], 0.12 * r, col, z);
  });
  if (o.happy) stroke(key + '.m', [[cx - 0.2 * r, cy + 0.52 * r], [cx, cy + 0.66 * r], [cx + 0.2 * r, cy + 0.52 * r]], { z, w: w * 0.8, color: col });
  else stroke(key + '.m', [[cx - 0.12 * r, cy + 0.58 * r], [cx + 0.12 * r, cy + 0.58 * r]], { z, w: w * 0.8, color: col });
}
const COMP = {
  seriesMark: {
    draw(fx) {
      text('series', fx.text, fx.x, fx.y, { size: CFG.SIZE.series, anchor: 'start', rot: -2, color: C.ink, opacity: 0.8, z: Z.stamp });
      stroke('series.u', [[fx.x, fx.y + 24], [fx.x + 110, fx.y + 20], [fx.x + 222, fx.y + 14]], { z: Z.stamp, w: 2.2, color: C.pencil, boil: 0.5 });
    },
  },
  /** Recurring age stamp: draws on big in the red pen, then docks to a corner and stays. {age, place, center, R, dockT, dock, dockScale, pulse} */
  ageStamp: {
    draw(fx, t) {
      const lt = t - fx.t0; if (lt < 0) return;
      const du = EASE.io(clamp((t - fx.dockT) / 0.4));
      const pos = lerp2(fx.center, fx.dock, du);
      let sc = lerp(1, fx.dockScale, du);
      (fx.pulse || []).forEach(pt => { const v = (t - pt) / 0.45; if (v > 0 && v < 1) sc *= 1 + 0.22 * Math.sin(Math.PI * v); });
      const R = fx.R, k = 'stamp';
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(sc); DL.rotate(-6 * (1 - du) - 4);
      stroke(k + '.o', ringPts(k + '.o', 0, 0, R, R, { n: 14, a0: -110, sweep: 374, rv: 0.025 }), { z: Z.stamp, w: 7, color: C.red, draw: EASE.out(clamp(lt / 0.42)) });
      stroke(k + '.i', ringPts(k + '.i', 0, 0, R - 18, R - 18, { n: 14, a0: 70, sweep: 368, rv: 0.02 }), { z: Z.stamp, w: 3.2, color: C.red, draw: EASE.out(clamp((lt - 0.12) / 0.4)) });
      const digits = String(fx.age), two = digits.length > 1, size = two ? 120 : 170;
      let gx = two ? -140 : -118; const gy = -size / 2 - 4;
      [...digits].forEach((d, di) => {
        const g = GLYPH[d];
        g.s.forEach((s, i) => stroke(k + '.n' + di + '.' + i, s.map(([u, v, c]) => [gx + u * size, gy + v * size, c]), { z: Z.stamp, w: two ? 11 : 12, color: C.red, draw: clamp((lt - 0.3 - di * 0.12) / 0.2), boil: 0.6 }));
        gx += (g.w + 0.1) * size;
      });
      const sl = clamp((lt - 0.48 - (two ? 0.12 : 0)) / 0.2);
      if (sl > 0) text(k + '.sui', '岁', two ? 60 : 58, 8, { size: two ? 100 : 118, color: C.red, z: Z.stamp, scale: lerp(1.9, 1, EASE.back(sl)), opacity: clamp(sl * 3) });
      const rp = clamp((lt - 0.62) / 0.25), rop = 1 - clamp(du * 1.6);
      if (fx.place && rp > 0 && rop > 0) {
        const rw = Math.max(R * 1.5, textWidth(fx.place, 44) / 2 + 60), ry = R + 44;
        stroke(k + '.rib', [[-rw, ry - 30], [rw, ry - 30, 1], [rw - 26, ry, 1], [rw, ry + 30, 1], [-rw, ry + 30, 1], [-rw + 26, ry, 1], [-rw, ry - 30, 1]], { z: Z.stamp, w: 4.5, color: C.red, fill: C.paper, draw: rp, opacity: rop });
        const tp = clamp((lt - 0.78) / 0.15);
        if (tp > 0) text(k + '.place', fx.place, 0, ry + 1, { size: 44, color: C.red, z: Z.stamp, opacity: tp * rop, scale: lerp(1.15, 1, tp) });
      }
      DL.restore();
    },
    cues: fx => [[fx.t0 + 0.02, 'whoosh'], [fx.t0 + 0.5, 'stamp'], [fx.t0 + 0.78, 'pop'], [fx.dockT, 'whoosh'], ...(fx.pulse || []).map(p => [p, 'boop'])],
  },
  /** Handwritten math in stroke order. {id, text, x, y, size, t0, speed, color:'red'|'ink', w, z} */
  write: {
    init: layoutWriting,
    draw(fx, t) {
      if (fx.t1 !== undefined && t >= fx.t1) return;
      const col = fx.color === 'red' ? C.red : C.ink;
      fx.strokes.forEach((s, i) => {
        const p = clamp((t - s.t0) / s.dur);
        if (p > 0) stroke(fx.id + '.s' + i, s.pts, { z: fx.z ?? Z.board, w: fx.w || 6, color: col, draw: p, boil: 0.55 });
      });
    },
    cues: fx => fx.silent ? [] : fx.strokes.map(s => [s.t0, fx.sfx || 'chalk']).concat(fx.endSfx ? [[fx.tEnd - 0.02, fx.endSfx]] : []),
  },
  /** Yellow highlighter swipe behind a writing block = the key math idea. */
  highlight: {
    draw(fx, t) {
      if (fx.t1 !== undefined && t >= fx.t1) return;
      const w = FXBY[fx.of]; if (!w) return;
      const p = EASE.out(clamp((t - fx.t0) / fx.dur)); if (p <= 0) return;
      const x0 = w.x - 22, x1 = lerp(x0, w.xEnd + 4, p), y0 = w.y + w.size * 0.3, y1 = w.y + w.size * 1.04;
      const n = 8, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); top.push([x, y0 + Math.sin(i * 1.7) * 3]); bot.unshift([x, y1 + Math.sin(i * 2.3) * 4]); }
      stroke(fx.id, top.concat(bot), { z: Z.hi, closed: true, fill: C.hi, noStroke: true, opacity: 0.85, blend: true, boil: 0.4, w: 1 });
    },
    cues: fx => [[fx.t0, 'swish']],
  },
  /** Red-pen ring around one glyph of a writing block. */
  ring: {
    draw(fx, t) {
      if (fx.t1 !== undefined && t >= fx.t1) return;
      const w = FXBY[fx.of], b = w && w.boxes[fx.glyph]; if (!b) return;
      const p = EASE.out(clamp((t - fx.t0) / 0.35)); if (p <= 0) return;
      stroke(fx.id, ringPts(fx.id, b.x + b.w / 2, b.y + b.h * 0.52, b.w / 2 + 20, b.h / 2 + 16, { n: 12, a0: -140, sweep: 385, rv: 0.06 }), { z: Z.annot, w: 4.5, color: C.red, draw: p });
    },
    cues: fx => [[fx.t0, 'pen']],
  },
  /** Narrator label (red pen) with an arrow that tracks a target. {text|[lines], at, rot, t0, t1, target, bend, gap, from} */
  label: {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, lines = [].concat(fx.text), size = fx.size || CFG.SIZE.label;
      const sizes = lines.map((_, i) => i === 0 ? size : size * 0.82);
      const w = Math.max(...lines.map((l, i) => textWidth(l, sizes[i]))), h = sizes.reduce((a, b) => a + b * 1.15, 0);
      const pp = EASE.back(clamp(lt / 0.2));
      DL.save(); DL.translate(fx.at[0], fx.at[1]); DL.rotate(fx.rot || 0);
      let yy = -h / 2;
      lines.forEach((l, i) => { yy += sizes[i] * 0.575; text(fx.id + '.t' + i, l, 0, yy, { size: sizes[i], color: fx.color === 'ink' ? C.ink : C.red, z: Z.annot, scale: lerp(0.6, 1, pp), opacity: clamp(lt / 0.08), halo: 8 }); yy += sizes[i] * 0.575; });
      DL.restore();
      const tg = resolveTarget(fx.target, F); if (!tg) return;
      const hw = w / 2 + 12, hh = h / 2 + 8, vx = tg[0] - fx.at[0], vy = tg[1] - fx.at[1];
      const s = Math.min(hw / Math.abs(vx || 1e-6), hh / Math.abs(vy || 1e-6));
      const from = fx.from ? [fx.at[0] + fx.from[0], fx.at[1] + fx.from[1]] : [fx.at[0] + vx * s, fx.at[1] + vy * s];
      const dl = dist(from, tg) || 1, gap = fx.gap ?? 16;
      const to = [tg[0] - (tg[0] - from[0]) / dl * gap, tg[1] - (tg[1] - from[1]) / dl * gap];
      arrow(fx.id + '.a', from, to, { p: EASE.out(clamp((lt - 0.12) / 0.3)), bend: fx.bend ?? 0.2, color: fx.color === 'ink' ? C.ink : C.red });
    },
    cues: fx => [[fx.t0, 'pop']],
  },
  /** Floating speech (no balloon) with a single tail line to the speaker's head. {text, at, tail, speaker, t0, t1, size, rot} */
  speech: {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, pp = EASE.back(clamp(lt / 0.22)), size = fx.size || CFG.SIZE.speech;
      const lines = [].concat(fx.text);
      lines.forEach((l, i) => text(fx.id + (i ? '.' + i : ''), l, fx.at[0], fx.at[1] + (i - (lines.length - 1) / 2) * size * 1.12, { size, font: fx.font || CFG.FONT_ZH, color: fx.color === 'red' ? C.red : C.ink, z: Z.annot, scale: lerp(0.4, 1, pp), rot: fx.rot || 0, halo: 10 }));
      const a = F.anchors[fx.speaker]; if (!a || !fx.tail) return;
      const from = [fx.at[0] + fx.tail[0], fx.at[1] + fx.tail[1]];
      const d = dist(from, a.head), to = lerp2(from, a.head, clamp((d - a.r - 14) / d));
      stroke(fx.id + '.tail', [from, to], { z: Z.annot, w: 3.5, color: fx.color === 'red' ? C.red : C.ink, draw: EASE.out(clamp((lt - 0.05) / 0.15)) });
    },
    cues: fx => [[fx.t0, 'pop']],
  },
  /** "?" / "!" popping above characters' heads. */
  mark: {
    draw(fx, t, F) {
      fx.on.forEach((id, i) => {
        const t0 = fx.t0 + i * (fx.stagger || 0), lt = t - t0;
        if (lt < 0 || t >= fx.t1) return;
        const a = F.anchors[id]; if (!a) return;
        const pp = EASE.back(clamp(lt / 0.2)), rot = rnd(hstr(fx.id + id), 1, 1) * 12;
        text(fx.id + id, fx.char, a.headTop[0] + (fx.dx || 0), a.headTop[1] - 50, { size: fx.size || CFG.SIZE.mark, font: CFG.FONT_MIX, color: C.ink, z: Z.fx, scale: lerp(0.3, 1, pp), rot });
      });
    },
    cues: fx => fx.on.map((_, i) => [fx.t0 + i * (fx.stagger || 0), 'boop']),
  },
  /** Motion lines under a moving hand. */
  speedLines: {
    draw(fx, t, F) {
      const lt = t - fx.t0, dur = fx.t1 - fx.t0; if (lt < 0 || lt > dur) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const h = a[fx.part], op = 1 - clamp((lt - dur * 0.5) / (dur * 0.5));
      [-22, 0, 22].forEach((dx, i) => stroke(fx.id + i, [[h[0] + dx - 6, h[1] + 34 + i * 8], [h[0] + dx - 14, h[1] + 96 + i * 8]], { z: Z.fx, w: 3.5, draw: EASE.out(clamp(lt / 0.1)), opacity: op }));
    },
  },
  /** Little pencil swing arcs beside dangling feet. */
  swingMarks: {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const a = F.anchors[fx.char]; if (!a) return;
      const op = clamp((t - fx.t0) / 0.2);
      [['footL', -1], ['footR', 1]].forEach(([k, s]) => {
        const f = a[k];
        [0, 1].forEach(j => {
          const r = 20 + j * 12, cx = f[0] + s * 6, cy = f[1] - 8;
          const pts = [0, 1, 2, 3].map(i => { const ang = (s < 0 ? 200 - i * 22 : -20 + i * 22) * RAD; return [cx + Math.cos(ang) * r, cy - Math.sin(ang) * r + 18]; });
          stroke(fx.id + k + j, pts, { z: Z.fx, w: 2.4, color: C.ink, opacity: op * (0.8 - j * 0.25), boil: 0.8 });
        });
      });
    },
  },
  /** Big hand-lettered title with a pencil underline. {text, x, y, size, t0, t1, color, rot, underline} */
  title: {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, pp = EASE.back(clamp(lt / (fx.dur ?? 0.3))), size = fx.size || 120;
      text(fx.id, fx.text, fx.x, fx.y, { size, color: fx.color === 'red' ? C.red : C.ink, z: fx.z ?? Z.annot, scale: lerp(0.5, 1, pp), opacity: clamp(lt / 0.1), rot: fx.rot || 0, font: fx.font, anchor: fx.anchor });
      if (fx.underline) {
        const w = textWidth(fx.text, size) * 0.5, y = fx.y + size * 0.62;
        stroke(fx.id + '.u', [[fx.x - w, y + 4], [fx.x, y], [fx.x + w, y - 6]], { z: fx.z ?? Z.annot, w: fx.uw || 5, color: fx.ucolor === 'ink' ? C.ink : C.red, draw: EASE.out(clamp((lt - 0.25) / 0.35)) });
      }
    },
    cues: fx => [[fx.t0, fx.sfx || 'pop']],
  },
  /** Text written out character by character (Chinese handwriting lines). {text, x, y, size, t0, cps, color, anchor, t1} */
  scribe: {
    draw(fx, t) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const chars = [...fx.text], n = Math.min(chars.length, Math.floor((t - fx.t0) * (fx.cps || 12)) + 1);
      text(fx.id, chars.slice(0, n).join(''), fx.x, fx.y, { size: fx.size || 48, color: fx.color === 'red' ? C.red : C.ink, z: fx.z ?? Z.annot, anchor: fx.anchor || 'start', font: fx.font, rot: fx.rot || 0, halo: fx.halo });
    },
    cues: fx => { const c = [], n = [...fx.text].length; for (let i = 0; i < n; i += 3) c.push([fx.t0 + i / (fx.cps || 12), fx.sfx || 'pen']); return c; },
  },
  /** Thought cloud with a trail of little circles toward a character. {at, rx, ry, t0, t1, from:{char,part}} */
  thought: {
    draw(fx, t, F) {
      if (t < fx.t0 || t >= fx.t1) return;
      const lt = t - fx.t0, p = EASE.back(clamp(lt / 0.3)), [cx, cy] = fx.at, rx = fx.rx * p, ry = fx.ry * p;
      const pts = [], n = 11;
      for (let i = 0; i < n * 3; i++) {
        const a = i / (n * 3) * Math.PI * 2, bump = 1 + 0.09 * Math.abs(Math.sin(a * n / 2 * 2));
        pts.push([cx + Math.cos(a) * rx * bump, cy + Math.sin(a) * ry * bump]);
      }
      stroke(fx.id, pts, { z: fx.z ?? Z.fx, w: 4.5, closed: true, fill: C.paper });
      const a = resolveTarget(fx.from, F); if (!a) return;
      [0.35, 0.62, 0.84].forEach((u, i) => {
        const q = lerp2([cx, cy + ry * 0.9], a, u), r = (16 - i * 5) * p;
        stroke(fx.id + '.b' + i, ringPts(fx.id + '.b' + i, q[0], q[1], r, r, { n: 8, closed: true }), { z: fx.z ?? Z.fx, w: 3.5, closed: true, fill: C.paper, draw: clamp((lt - 0.1 - i * 0.06) / 0.1) });
      });
    },
    cues: fx => [[fx.t0, 'boop']],
  },
  /** A scene prop drawn by PROPS[kind](fx, t, lt, p, F) in local coords at pos/rot/scale. */
  prop: {
    draw(fx, t, F) {
      if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
      const lt = t - fx.t0, pos = fx.pos ? evalTrack(fx.pos, t) : fx.at;
      const rot = typeof fx.rot === 'number' ? fx.rot : (fx.rot ? evalTrack(fx.rot, t) : 0);
      const sc = typeof fx.scale === 'number' ? fx.scale : (fx.scale ? evalTrack(fx.scale, t) : 1);
      const p = fx.drawDur === 0 ? 1 : EASE.out(clamp(lt / (fx.drawDur ?? 0.4)));
      DL.save(); DL.translate(pos[0], pos[1]); if (rot) DL.rotate(rot); if (sc !== 1) DL.scale(sc);
      PROPS[fx.kind](fx, t, lt, p, F);
      DL.restore();
    },
    cues: fx => (fx.sfxAt || []),
  },
  subtitles: {
    draw(fx, t) {
      fx.lines.forEach((s, i) => {
        if (s.hide || t < s.t0 || t >= s.t1) return;
        const op = clamp((t - s.t0) / 0.15) * clamp((s.t1 - t) / 0.12);
        const rows = s.text.split('\n');
        rows.forEach((r, j) => text('sub' + i + '.' + j, r, CFG.W / 2, fx.y - (rows.length - 1 - j) * 60, { size: CFG.SIZE.sub, color: C.ink, z: Z.sub, opacity: op, halo: 12 }));
      });
    },
  },
};
/** 小问号 — the red-pen reader who always asks "为什么？".
 *  {id, pos(track), size, t0, t1, mood(step: neutral|happy|doubt|surprised), act(step: idle|hop|nod|tap|wave|shake),
 *   sign(step: text|null), gaze(step: 'viewer'|target|[x,y]), tilt(track), burst, silent} */
COMP.qm = {
  draw(fx, t, F) {
    if (t < fx.t0 || (fx.t1 !== undefined && t >= fx.t1)) return;
    const lt = t - fx.t0, pos = evalTrack(fx.pos, t), S = (fx.size || 200) / 200;
    const mood = stepTrack(fx.mood, t) || 'neutral';
    let act = 'idle', ta = 0; (fx.act || []).forEach(k => { if (k[0] <= t) { act = k[1]; ta = k[0]; } });
    let sign = null, sT = -99, prev; (fx.sign || []).forEach(k => { if (k[0] <= t) { if (k[1] !== prev) sT = k[0]; sign = k[1]; prev = k[1]; } });
    const at = t - ta;
    const pop = fx.t0 < 0 ? 1 : Math.max(0.01, EASE.back(clamp(lt / 0.3)));
    let hop = 0, tilt = fx.tilt ? evalTrack(fx.tilt, t) : 0, tap = 0, wave = 0, sq = 1, tapHit = -1;
    if (act === 'hop') { const s = Math.abs(Math.sin(at * (fx.hopHz || 2.2) * Math.PI)); hop = -s * 34; sq = 1 - 0.16 * Math.pow(1 - s, 10) + 0.05 * s; }
    if (act === 'nod') tilt += Math.sin(at * 2 * Math.PI * 1.8) * 8;
    if (act === 'shake') tilt += Math.sin(at * 2 * Math.PI * 3.2) * 11;
    if (act === 'tap') { const ph = (at * 2.6) % 1; tap = Math.max(0, Math.sin(ph * 2 * Math.PI)) * 13; tapHit = ph >= 0.5 ? ph - 0.5 : -1; }
    if (act === 'wave') wave = Math.sin(at * 2 * Math.PI * 2.2);
    const k = fx.id, z = fx.z ?? Z.front, col = C.red, w = 6.5;
    // gaze: shift the whole face a little toward the target
    const gz = stepTrack(fx.gaze, t) || 'viewer';
    const gp = Array.isArray(gz) ? gz : (gz !== 'viewer' ? F.targets[gz] : null);
    let lx = 0, ly = 0;
    if (gp) { const hx = pos[0], hy = pos[1] + hop - 160 * S, dx = gp[0] - hx, dy = gp[1] - hy, d = Math.hypot(dx, dy) || 1; lx = dx / d; ly = dy / d; }
    const fsx = lx * 9, fsy = ly * 5;
    // emerge burst (ink), outside the body scale
    if (fx.burst && fx.t0 >= 0 && lt < 0.5) {
      const u = EASE.out(clamp(lt / 0.5));
      DL.save(); DL.translate(pos[0], pos[1]); DL.scale(S);
      for (let i = 0; i < 7; i++) {
        const a = (-170 + i * 26.7) * RAD, r0 = 90 + 90 * u, r1 = r0 + 40 * (1 - u) + 12;
        stroke(k + '.burst' + i, [[Math.cos(a) * r0, -60 + Math.sin(a) * r0 * 0.9], [Math.cos(a) * r1, -60 + Math.sin(a) * r1 * 0.9]], { z: Z.fx, w: 4, opacity: 1 - u, boil: 0.6 });
      }
      DL.restore();
    }
    DL.save(); DL.translate(pos[0], pos[1] + hop); DL.scale(S * pop * (1 + (1 - sq) * 0.6), S * pop * sq);
    stroke(k + '.legL', [[0, -34], [-12, -12], [-26, 0]], { z, w, color: col });
    stroke(k + '.legR', [[0, -34], [14, -12 - tap * 0.4], [28, -tap]], { z, w, color: col });
    if (tapHit >= 0 && tapHit < 0.22) {
      const o = 1 - tapHit / 0.22;
      stroke(k + '.tk0', [[42, -6], [56, -14]], { z: Z.fx, w: 3.5, opacity: o });
      stroke(k + '.tk1', [[38, -20], [48, -32]], { z: Z.fx, w: 3.5, opacity: o });
    }
    DL.about(0, -40, () => DL.rotate(tilt));
    const hook = [[-56, -150], [-52, -180], [-28, -200], [6, -204], [42, -190], [58, -162], [50, -134], [26, -114], [6, -96], [0, -72], [0, -34]];
    stroke(k + '.fill', hook.slice(0, 8).concat([[-10, -120]]), { z, closed: true, fill: C.paper, noStroke: true, w: 1 });
    stroke(k + '.hook', hook, { z, w: w + 1.5, color: col });
    const waving = !sign && act === 'wave';
    const handL = [-40, -44 + wave * 4], handR = sign ? [66, -92] : (waving ? [100 + wave * 12, -156] : [38, -46]);
    stroke(k + '.armL', [[0, -70], [-22, -58], handL], { z, w: w - 1, color: col });
    stroke(k + '.armR', [[0, -70], waving ? [52, -90] : [30, -74], handR], { z, w: w - 1, color: col });
    if (waving) [0, 1].forEach(j => { // little wave arcs beside the hand (ink)
      const r = 22 + j * 14, c = [100, -150];
      stroke(k + '.wv' + j, [0, 1, 2, 3].map(i => { const a = (-60 + i * 30) * RAD; return [c[0] + Math.cos(a) * r + 8, c[1] + Math.sin(a) * r]; }), { z: Z.fx, w: 3, opacity: 0.75 - j * 0.25, boil: 0.8 });
    });
    // face
    const blink = ((t + (fx.blink ?? 0.7)) % 3.4) < 0.1;
    const eyeY = -162 + fsy, ex = 14;
    [-1, 1].forEach((s, i) => {
      const e = [s * ex + fsx, eyeY];
      if (mood === 'happy') stroke(k + '.e' + i, [[e[0] - 8, e[1] + 3], [e[0], e[1] - 6], [e[0] + 8, e[1] + 3]], { z, w: 4.5, color: col });
      else if (blink) stroke(k + '.e' + i, [[e[0] - 7, e[1]], [e[0] + 7, e[1]]], { z, w: 4, color: col });
      else dot(k + '.e' + i, [e[0] + lx * 1.5, e[1] + ly * 1.5], mood === 'surprised' ? 7.5 : 6, col, z);
    });
    if (mood === 'doubt') { stroke(k + '.brow', [[4 + fsx, eyeY - 22], [24 + fsx, eyeY - 16]], { z, w: 4, color: col }); stroke(k + '.brow2', [[-24 + fsx, eyeY - 14], [-6 + fsx, eyeY - 16]], { z, w: 4, color: col }); }
    if (mood === 'surprised') { stroke(k + '.brow', [[6 + fsx, eyeY - 20], [14 + fsx, eyeY - 25], [22 + fsx, eyeY - 20]], { z, w: 3.6, color: col }); stroke(k + '.brow2', [[-22 + fsx, eyeY - 20], [-14 + fsx, eyeY - 25], [-6 + fsx, eyeY - 20]], { z, w: 3.6, color: col }); }
    const my = -136 + fsy * 0.6, mx = fsx * 0.8;
    if (mood === 'happy') {
      stroke(k + '.m', [[mx - 12, my - 4], [mx, my + 6], [mx + 12, my - 4]], { z, w: 4.5, color: col });
      [-1, 1].forEach((s, i) => stroke(k + '.bl' + i, [[mx + s * 27 - 5, my - 4], [mx + s * 27 + 2, my - 10]], { z, w: 2.6, color: col, opacity: 0.8 }));
    } else if (mood === 'surprised') stroke(k + '.m', ringPts(k + '.m', mx, my, 6, 8, { n: 8, closed: true }), { z, w: 4, color: col, closed: true, fill: C.paper });
    else if (mood === 'doubt') stroke(k + '.m', [[mx - 12, my], [mx - 4, my - 4], [mx + 4, my + 2], [mx + 12, my - 2]], { z, w: 4, color: col });
    else stroke(k + '.m', [[mx - 9, my - 1], [mx + 9, my - 1]], { z, w: 4.5, color: col });
    // the sign, popping up on its stick
    if (sign) {
      const sp = EASE.back(clamp((t - sT) / 0.25));
      const size = fx.signSize || 40, tw = textWidth(sign, size) + 40, cx = 70, cy = -262 + (1 - sp) * 40;
      stroke(k + '.stick', [handR, [68, cy + 32]], { z, w: 5, color: col });
      DL.about(cx, cy + 32, () => DL.scale(lerp(0.5, 1, sp)));
      stroke(k + '.board', [[cx - tw / 2, cy - 34], [cx + tw / 2, cy - 34, 1], [cx + tw / 2, cy + 32, 1], [cx - tw / 2, cy + 32, 1], [cx - tw / 2, cy - 34, 1]], { z, w: 5, color: col, fill: C.paper });
      text(k + '.sign', sign, cx, cy, { size, color: col, z: z + 0.5 });
    }
    DL.restore();
    DL.save(); DL.translate(pos[0], pos[1] + hop); DL.scale(S * pop); DL.about(0, -40, () => DL.rotate(tilt));
    F.anchors[k] = { head: DL.tp([0, -160]), headTop: DL.tp([0, -214]), mouth: DL.tp([0, -136]), jaw: DL.tp([0, -110]), r: 58 * S * pop, handR: DL.tp(handR), handL: DL.tp(handL), sign: DL.tp([70, -300]) };
    DL.restore();
  },
  cues: fx => (fx.t0 >= 0 && !fx.silent ? [[fx.t0, 'boop']] : []).concat(fx.sfxAt || []),
};
/** "数学小知识" card: an index card that draws on, a red rubber-stamp header, the topic in ink, a red header rule
 *  and faint pencil rules. {id, t0, t1, box:[x0,y0,x1,y1], topic, rules:[y...]} */
COMP.factCard = {
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
function resolveTarget(tg, F) {
  if (!tg) return null;
  if (Array.isArray(tg)) return tg;
  if (tg.char) { const a = F.anchors[tg.char]; if (!a) return null; const p = a[tg.part || 'head']; return p ? [p[0] + (tg.dx || 0), p[1] + (tg.dy || 0)] : null; }
  if (tg.write) {
    const w = FXBY[tg.write], b = w && w.boxes[tg.glyph]; if (!b) return null;
    return [b.x + b.w / 2 + (tg.dx || 0), b.y + b.h + (tg.dy || 0)];
  }
  if (tg.target) { const p = F.targets[tg.target]; return p ? [p[0] + (tg.dx || 0), p[1] + (tg.dy || 0)] : null; }
  return null;
}

/* =====================================================================
   EPISODE  — scenes play back to back; each scene has its own local clock
   scene: { id, chapter?, dur, floor?, cast, tracks, order, set, fx, subs:[{t0,t1,text,say?}],
            sfx:[[t,name]], steps:[{t0,t1,hz}], pauses:[t], targets(F), pen:fxId, noSeries }
   ===================================================================== */
const EP = { scenes: [], dur: 0, poster: 0, series: '数学少年陶哲轩', cues: [], pauses: [], syncs: [] };
function defineScene(sc) { EP.scenes.push(sc); return sc; }
function prepareEpisode() {
  let t = 0;
  EP.scenes.forEach((sc, i) => {
    sc.index = i; sc.start = t; t += sc.dur;
    sc.cast = sc.cast || {}; sc.tracks = sc.tracks || {}; sc.order = sc.order || Object.keys(sc.cast);
    sc.set = sc.set || []; sc.fx = sc.fx || []; sc.subs = sc.subs || [];
    sc.fxby = {};
    sc.fx.forEach(fx => {
      const c = COMP[fx.type]; if (!c) throw new Error(`scene ${sc.id}: unknown fx type "${fx.type}"`);
      if (c.init) c.init(fx); if (fx.id) sc.fxby[fx.id] = fx;
    });
  });
  EP.dur = t;
  const c = [];
  EP.scenes.forEach(sc => {
    const o = sc.start;
    (sc.steps || []).forEach(w => { for (let k = 0; ; k++) { const tt = w.t0 + (k + 0.5) / w.hz; if (tt >= w.t1) break; c.push({ t: o + tt, sfx: w.sfx || 'step' }); } });
    sc.fx.forEach(fx => { const comp = COMP[fx.type]; if (comp.cues) comp.cues(fx).forEach(([tt, n]) => c.push({ t: o + tt, sfx: n })); });
    (sc.sfx || []).forEach(([tt, n]) => c.push({ t: o + tt, sfx: n }));
    sc.subs.forEach((s, i) => { if (s.say !== false) c.push({ t: o + s.t0, say: (typeof s.say === 'string' ? s.say : s.text).replace(/\n/g, ''), key: `${sc.id}#${i}`, voice: s.voice || 'narr' }); });
  });
  // a scene may pre-draw things with negative start times; their sounds must not leak into the previous scene
  EP.cues = c.filter(q => q.say || EP.scenes.some(sc => q.t >= sc.start - 1e-6 && q.t < sc.start + sc.dur && q.t - sc.start >= -1e-6)).sort((a, b) => a.t - b.t);
  EP.pauses = EP.scenes.flatMap(sc => (sc.pauses || []).map(p => sc.start + p)).sort((a, b) => a - b);
  EP.syncs = [...new Set(EP.cues.filter(q => q.say).map(q => q.t).concat(EP.scenes.slice(1).map(s => s.start)))].sort((a, b) => a - b);
}
function sceneAt(t) { const S = EP.scenes; for (let i = S.length - 1; i >= 0; i--) if (t >= S[i].start - 1e-9) return S[i]; return S[0]; }
function useScene(sc) { SC = sc; CAST = sc.cast; TRACKS = sc.tracks; FXBY = sc.fxby; }

/* =====================================================================
   RENDER  — pure function of t
   ===================================================================== */
const layer = document.getElementById('layer');
const NS = 'http://www.w3.org/2000/svg';
const POOL = new Map(); let lastOrder = '';
const RM = { reduce: false };
function commit() {
  const items = DL.items.slice().sort((a, b) => a.z - b.z || a.o - b.o);
  const seen = new Set(), order = [];
  for (const it of items) {
    let el = POOL.get(it.key);
    if (!el || el.tagName !== it.tag) { if (el) el.remove(); el = document.createElementNS(NS, it.tag); el._a = {}; POOL.set(it.key, el); }
    const prev = el._a;
    for (const k in it.attrs) { const v = String(it.attrs[k]); if (prev[k] !== v) { el.setAttribute(k, v); prev[k] = v; } }
    for (const k in prev) if (!(k in it.attrs)) { el.removeAttribute(k); delete prev[k]; }
    if (it.text !== undefined && el._t !== it.text) { el.textContent = it.text; el._t = it.text; }
    seen.add(it.key); order.push(it.key);
  }
  for (const [k, el] of POOL) if (!seen.has(k)) { el.remove(); POOL.delete(k); }
  const ord = order.join('|');
  if (ord !== lastOrder) { for (const k of order) layer.appendChild(POOL.get(k)); lastOrder = ord; }
}
function render(tIn) {
  const t = clamp(Math.floor(tIn * CFG.FPS + 1e-6) / CFG.FPS, 0, EP.dur);
  const sc = sceneAt(Math.min(t, EP.dur - 1e-6)); useScene(sc);
  const lt = t - sc.start;
  BOIL.frame = Math.floor(t * CFG.BOIL_FPS);
  BOIL.amp = RM.reduce ? 0 : CFG.BOIL_AMP;
  DL.reset();
  const F = { t: lt, T: t, anchors: {}, targets: {}, pen: null, scene: sc };
  if (sc.pen) { const w = FXBY[sc.pen]; if (w && lt >= w.t0 - 0.2) F.pen = penAt(w, lt); }
  sc.set.forEach(s => {
    if (s.t1 !== undefined && lt >= s.t1) return;
    const p = s.t0 === undefined ? 1 : EASE.out(clamp((lt - s.t0) / 0.38));
    if (p > 0) SETDRAW[s.type](s, p, lt);
  });
  const Ls = {};
  sc.order.forEach(id => { Ls[id] = layoutChar(id, lt, F); });
  for (const id in F.anchors) F.targets[id] = F.anchors[id].head;
  if (F.pen) F.targets.pen = F.pen;
  if (sc.targets) Object.assign(F.targets, sc.targets(F));
  sc.order.forEach(id => { const L = Ls[id]; if (L) { drawChar(L, F); if (CAST[id].bag) drawLooseBag(L, F); } });
  sc.fx.forEach(fx => COMP[fx.type].draw(fx, lt, F));
  if (!sc.noSeries) COMP.seriesMark.draw({ text: EP.series, x: 40, y: 44 });
  COMP.subtitles.draw({ lines: sc.subs, y: 850 }, lt);
  commit();
  return t;
}

/* =====================================================================
   AUDIO  — one WebAudio context, created on the first user gesture, with three buses: sfx, voice, music
   ===================================================================== */
const LEVEL = { sfx: 0.45, voice: 1.0, music: 0.3, duck: 0.11 };
const AUD = (() => {
  let ctx = null; const bus = {};
  function ensure() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
        ctx = new AC();
        const master = ctx.createGain(); master.connect(ctx.destination);
        for (const k of ['sfx', 'voice', 'music']) { bus[k] = ctx.createGain(); bus[k].gain.value = LEVEL[k]; bus[k].connect(master); }
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { ctx = null; }
    return ctx;
  }
  const b64 = str => { const bin = atob(str), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a.buffer; };
  // callback form of decodeAudioData for older Safari
  const decode = str => new Promise((res, rej) => { try { ctx.decodeAudioData(b64(str), res, rej); } catch (e) { rej(e); } });
  return { ensure, decode, get ctx() { return ctx; }, bus: k => bus[k] };
})();

/* SOUND EFFECTS  — tiny synth on the sfx bus. Scenes add sounds with SFX.define(name, (tone, noise) => …) */
const SFX = (() => {
  let noiseBuf = null;
  const env = (g, t, a, d, pk) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(pk, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  function tone(type, f0, f1, dur, pk, lfo, delay = 0) {
    const ctx = AUD.ctx, t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    if (lfo) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = lfo[0]; lg.gain.value = lfo[1]; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + 0.05); }
    env(g, t, 0.006, dur, pk); o.connect(g).connect(AUD.bus('sfx')); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(type, freq, q, dur, pk, f1, delay = 0) {
    const ctx = AUD.ctx, t = ctx.currentTime + delay, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = rnd(77, i, 3); }
    s.buffer = noiseBuf; f.type = type; f.frequency.setValueAtTime(freq, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur); f.Q.value = q;
    env(g, t, 0.004, dur, pk); s.connect(f).connect(g).connect(AUD.bus('sfx')); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  const LIB = {
    step() { tone('sine', 180, 70, 0.08, 0.32); noise('lowpass', 700, 0.8, 0.04, 0.06); },
    chalk() { noise('bandpass', 3300, 1.6, 0.07, 0.2); noise('highpass', 6000, 0.7, 0.03, 0.05); },
    pen() { noise('bandpass', 2300, 1.2, 0.05, 0.1); },
    pop() { tone('sine', 380, 1000, 0.09, 0.28); },
    plip() { tone('sine', 700, 1400, 0.06, 0.16); },
    boop() { tone('triangle', 640, 1250, 0.08, 0.16); },
    stamp() { tone('sine', 120, 45, 0.24, 0.6); noise('lowpass', 500, 0.7, 0.1, 0.25); },
    whoosh() { noise('bandpass', 500, 0.9, 0.24, 0.12, 2600); },
    whip() { noise('bandpass', 1200, 1.4, 0.12, 0.12, 3800); },
    swish() { noise('bandpass', 1600, 0.8, 0.22, 0.1, 900); },
    thud() { tone('sine', 100, 40, 0.2, 0.55); noise('lowpass', 300, 0.7, 0.08, 0.2); },
    hop() { tone('sine', 280, 760, 0.13, 0.22); },
    zip() { tone('triangle', 300, 1700, 0.15, 0.2); },
    ding() { tone('sine', 1320, 1318, 0.55, 0.22); tone('sine', 1980, 1975, 0.35, 0.08); },
    boing() { tone('triangle', 420, 140, 0.65, 0.34, [16, 70]); },
    key() { noise('bandpass', 2600, 2.2, 0.03, 0.16); tone('square', 900, 700, 0.02, 0.03); },
    beep() { tone('square', 880, 880, 0.12, 0.06); },
    buzz() { tone('square', 150, 140, 0.28, 0.08); },
    tada() { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.22, 0.14, null, i * 0.09)); },
    paper() { noise('bandpass', 900, 0.6, 0.3, 0.12, 2400); },
    tap() { tone('sine', 900, 520, 0.035, 0.12); },
  };
  return {
    unlock: AUD.ensure,
    define(name, fn) { LIB[name] = () => fn(tone, noise); },
    play(n) { const ctx = AUD.ctx; if (!ctx || ctx.state !== 'running') return; try { LIB[n] && LIB[n](); } catch (e) { /* ignore */ } },
  };
})();

/* NARRATION  — pre-recorded clips from the audio pack (window.TAO_AUDIO.voice, keyed "sceneId#line");
   falls back to browser TTS when the pack is missing. busy() lets the clock wait for the voice. */
const NARR = (() => {
  const pack = (window.TAO_AUDIO && window.TAO_AUDIO.voice) || null;
  const buf = {}; let loading = null, src = null, endAt = 0;
  const tts = (() => {
    const ok = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
    let voice = null, active = 0, deadline = 0;
    const pick = () => { try { const vs = speechSynthesis.getVoices() || []; voice = vs.find(v => /zh[-_]CN/i.test(v.lang)) || vs.find(v => /^zh/i.test(v.lang)) || null; } catch (e) { voice = null; } };
    if (ok) { pick(); try { speechSynthesis.addEventListener('voiceschanged', pick); } catch (e) { /* old browsers */ } }
    return {
      prime() { if (!ok) return; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; u.lang = 'zh-CN'; speechSynthesis.speak(u); } catch (e) { /* ignore */ } },
      say(txt) {
        if (!ok) return;
        try {
          const u = new SpeechSynthesisUtterance(txt); u.lang = 'zh-CN'; u.rate = 1.05; if (voice) u.voice = voice;
          const done = () => { active = Math.max(0, active - 1); }; u.onend = done; u.onerror = done;
          active++; deadline = Math.max(deadline, performance.now()) + ([...txt].length / 3.2 + 1.2) * 1000;
          speechSynthesis.speak(u);
        } catch (e) { /* ignore */ }
      },
      busy() { return ok && active > 0 && performance.now() < deadline; },
      cancel() { active = 0; deadline = 0; if (ok) try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } },
    };
  })();
  const recorded = () => !!pack && !!AUD.ctx;
  return {
    /** decode every clip once (after the first tap); resolves when done */
    load() {
      if (loading) return loading;
      if (!pack || !AUD.ctx) return Promise.resolve();
      loading = Promise.all(Object.keys(pack).map(k => AUD.decode(pack[k].b).then(b => { buf[k] = b; }, () => {})));
      return loading;
    },
    dur: key => (pack && pack[key] ? pack[key].d : 0),
    prime() { if (!recorded()) tts.prime(); },
    /** speak a cue, optionally starting part-way into it (after a seek) */
    say(cue, offset = 0) {
      if (recorded()) {
        const b = buf[cue.key]; if (!b || offset >= b.duration - 0.25) return;
        this.cancel();
        const s = AUD.ctx.createBufferSource(); s.buffer = b; s.connect(AUD.bus('voice')); s.start(0, Math.max(0, offset));
        src = s; endAt = AUD.ctx.currentTime + b.duration - offset;
      } else if (offset < 0.3) tts.say(cue.say);
    },
    busy() { return recorded() ? AUD.ctx.currentTime < endAt - 0.03 : tts.busy(); },
    cancel() { if (src) { try { src.stop(); } catch (e) { /* already stopped */ } } src = null; endAt = 0; tts.cancel(); },
  };
})();

/* MUSIC  — looping beds from the audio pack; one bed per run of scenes (EP.music), cross-faded at changes, ducked under the voice */
const MUSIC = (() => {
  const pack = (window.TAO_AUDIO && window.TAO_AUDIO.music) || null;
  const buf = {}; let loading = null, cur = null, ducked = false;
  function stopNode(n, fade) {
    const ctx = AUD.ctx, t = ctx.currentTime;
    try { n.g.gain.cancelScheduledValues(t); n.g.gain.setValueAtTime(n.g.gain.value, t); n.g.gain.linearRampToValueAtTime(0.0001, t + fade); n.s.stop(t + fade + 0.05); } catch (e) { /* ignore */ }
  }
  return {
    available: () => !!pack,
    load() {
      if (loading) return loading;
      if (!pack || !AUD.ctx) return Promise.resolve();
      loading = Promise.all(Object.keys(pack).map(k => AUD.decode(pack[k].b).then(b => { buf[k] = b; }, () => {})));
      return loading;
    },
    current: () => (cur ? cur.key : null),
    /** play bed `key` from `offset` seconds (no-op if it is already the current bed, unless force) */
    set(key, offset = 0, force = false) {
      const ctx = AUD.ctx; if (!ctx) return;
      if (cur && cur.key === key && !force) return;
      if (cur) { stopNode(cur, 0.8); cur = null; }
      const b = key && buf[key]; if (!b) return;
      const t = ctx.currentTime, s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = b; s.loop = true;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(1, t + 0.7);
      s.connect(g).connect(AUD.bus('music')); s.start(t, ((offset % b.duration) + b.duration) % b.duration);
      cur = { key, s, g };
    },
    ready: key => !!buf[key],
    stop(fade = 0.4) { if (cur && AUD.ctx) stopNode(cur, fade); cur = null; },
    duck(on) {
      if (on === ducked || !AUD.ctx) return; ducked = on;
      const g = AUD.bus('music').gain; g.cancelScheduledValues(AUD.ctx.currentTime); g.setTargetAtTime(on ? LEVEL.duck : LEVEL.music, AUD.ctx.currentTime, on ? 0.08 : 0.35);
    },
  };
})();
