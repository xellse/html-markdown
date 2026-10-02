// Automatic frame checks: the mechanical problems reviewers kept finding by eye, found in a minute instead.
//   NODE_PATH=$(npm root -g) node tools/lint_frames.cjs episode-4.html [step=0.25] [scene-id,...] > lint.md
// Samples the episode every `step` seconds and reports, per scene, with scene-local time ranges:
//   FACE      a line or text drawn over a character's face (face = 0.75 × head radius)
//   CROSS     a line from something else running through a text (arrow, arm, ring, border)
//   OVERLAP   two texts overlapping
//   BAND      something other than the subtitle drawn inside the subtitle band (y > 800)
//   BLANK     nothing on stage but the subtitle, in the middle of a scene
//   SMALL     text smaller than 32 stage px (unreadable on a phone, where the stage is ~0.24×)
//   ZERO      a Latin O in the ZCOOL font (drawn as a square: "IMO" reads "IM口")
//   POP       a group of ≥ 6 shapes that vanishes at once in the middle of a scene (no exit or fade)
//   SEAM      a cut where part of the picture stays and part vanishes (things pop at the cut)
// Keys that differ only in a trailing number (x4g.n0, x4g.n1 …) are reported once as x4g.n#.
// Everything is a hint with a key and a time: open that frame and decide. Exit code is 0 either way.
// Expected hits you can ignore: a hat or glasses a character wears (FACE), a deliberate strike-through (CROSS).
const { chromium } = require('playwright');
const path = require('path');

const [file, stepArg = '0.25', only = ''] = process.argv.slice(2);
const STEP = +stepArg, ONLY = only ? new Set(only.split(',')) : null;
const norm = k => k.replace(/\d+$/, '#');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.route(/^https?:/, r => r.abort());   // geometry only; fonts are not needed
  await p.goto('file://' + path.resolve(file));
  await p.waitForFunction(() => window.__scenes);
  const scenes = await p.evaluate(() => window.__scenes);
  if (!await p.evaluate(() => { window.__seek(0.1); return !!EP.lastF; })) throw new Error('this page was built with an older engine.js: rebuild it first');
  // how big each group is at time T (sum of bbox areas × opacity): used to tell an animated exit from a pop
  await p.evaluate(() => { window.__groupSize = T => { window.__seek(T); const out = {}; for (const it of DL.items) { const el = POOL.get(it.key); if (!el) continue; let bb; try { bb = el.getBBox(); } catch (e) { continue; } const g = it.key.split(/[.#]/)[0]; out[g] = (out[g] || 0) + bb.width * bb.height * (it.attrs.opacity ?? 1); } return out; }; });
  const found = new Map();   // `${scene}|${type}|${id}` -> {scene, type, id, detail, keys: Set, times: []}
  const note = (sc, type, id, detail, raw, t) => {
    const k = `${sc}|${type}|${id}`;
    if (!found.has(k)) found.set(k, { scene: sc, type, id, detail, keys: new Set(), times: [] });
    const f = found.get(k); f.keys.add(raw);
    if (f.times[f.times.length - 1] !== +t.toFixed(2)) f.times.push(+t.toFixed(2));
  };
  for (const sc of scenes) {
    if (ONLY && !ONLY.has(sc.id)) continue;
    let prev = null;
    for (let lt = 0.05; lt < sc.dur - 0.02; lt += STEP) {
      const r = await p.evaluate(T => {
        window.__seek(T);
        const F = EP.lastF, items = DL.items, out = { hits: [], groups: {}, all: {}, shown: 0 };
        const cells = new Set(), cover = (x0, y0, x1, y1) => { for (let x = Math.max(0, Math.floor(x0 / 50)); x <= Math.min(31, Math.floor(x1 / 50)); x++) for (let y = Math.max(0, Math.floor(y0 / 50)); y <= Math.min(15, Math.floor(y1 / 50)); y++) if (!(x >= 27 && y <= 3)) cells.add(x + ',' + y); };   // 50-px grid above the subtitle band; a corner badge (the age stamp) does not count
        const isSub = k => /^sub\d|^series/.test(k);
        const owner = k => k.replace(/[.#][^.#]*$/, '');
        const op = el => { let o = 1; for (let e = el; e && e.tagName !== 'svg'; e = e.parentNode) { const v = e.getAttribute && e.getAttribute('opacity'); if (v !== null && v !== undefined) o *= +v; } return o; };
        const onStage = c => c[0] > -40 && c[0] < 1640 && c[1] > -40 && c[1] < 940;
        const inStage = bb => bb.x < 1600 && bb.x + bb.width > 0 && bb.y < 900 && bb.y + bb.height > 0;
        const heads = Object.entries(F.anchors).filter(([, a]) => a && a.head && a.r && onStage(a.head)).map(([id, a]) => {
          const fill = items.find(i => i.key === id + '.headFill');
          return { id, c: a.head, r: a.r, z: fill ? fill.z : 40, o: fill ? fill.o : 0 };
        });
        const above = (it, h) => it.z > h.z || (it.z === h.z && it.o > h.o);
        const lay = document.getElementById('layer').getCTM();
        const texts = [], lines = [], fills = [];
        const before = (a, b) => a.z < b.z || (a.z === b.z && a.o < b.o);
        for (const it of items) {
          if (isSub(it.key)) continue;
          const el = POOL.get(it.key); if (!el) continue;
          if (op(el) < 0.15) continue;
          let bb; try { bb = el.getBBox(); } catch (e) { continue; }
          const g = it.key.split(/[.#]/)[0], seen = () => { out.groups[g] = (out.groups[g] || 0) + 1; };   // on stage now
          out.all[g] = 1;   // still drawn (maybe off stage: walking off is fine)
          if (it.tag === 'text') {
            const str = (el.textContent || '').trim(); if (!str) continue;
            const m = el.getCTM(), k = Math.hypot(m.a, m.b) / Math.hypot(lay.a, lay.b), size = (+el.getAttribute('font-size') || 40) * k;
            const pt = (x, y) => { const q = el.ownerSVGElement.createSVGPoint(); q.x = x; q.y = y; const w = q.matrixTransform(m).matrixTransform(lay.inverse()); return [w.x, w.y]; };
            const a = pt(bb.x, bb.y), c = pt(bb.x + bb.width, bb.y + bb.height);
            const box = [Math.min(a[0], c[0]), Math.min(a[1], c[1]), Math.max(a[0], c[0]), Math.max(a[1], c[1])];
            if (box[0] > 1600 || box[2] < 0 || box[1] > 900 || box[3] < 0) continue;
            seen();
            cover(...box);
            texts.push({ key: it.key, box, str, it });
            if (size < 32) out.hits.push(['SMALL', it.key, ` “${str.slice(0, 12)}” ≈${Math.round(size)}px`]);
            if (box[3] > 800) out.hits.push(['BAND', it.key, ' (text)']);
            if (/^\s*'?ZCOOL/.test(el.getAttribute('font-family') || '') && /[Oo]/.test(str)) out.hits.push(['ZERO', it.key, ` “${str.slice(0, 16)}”`]);
            for (const h of heads) {
              if (it.key.startsWith(h.id + '.') || !above(it, h)) continue;
              const nx = Math.max(box[0], Math.min(h.c[0], box[2])), ny = Math.max(box[1], Math.min(h.c[1], box[3]));
              if (Math.hypot(nx - h.c[0], ny - h.c[1]) < h.r * 0.75) out.hits.push(['FACE', `${it.key} (text) on ${h.id}`, '']);
            }
          } else if (it.tag === 'path') {
            if (!inStage(bb)) continue;
            seen();
            if (!/shadow|floor/i.test(it.key)) cover(bb.x, bb.y, bb.x + bb.width, bb.y + bb.height);
            if (bb.y + bb.height > 805 && bb.height > 4 && !/shadow|floor/i.test(it.key)) out.hits.push(['BAND', it.key, ' (shape)']);
            const stroke = el.getAttribute('stroke');
            let L = null;
            const pts = () => {
              if (L === null) { try { L = el.getTotalLength(); } catch (e) { L = 0; } }
              const n = Math.min(80, Math.max(8, Math.ceil(L / 10))), q = [];
              for (let i = 0; i <= n && L; i++) { const s = el.getPointAtLength(L * i / n); q.push([s.x, s.y]); }
              return q;
            };
            for (const h of heads) {
              const own = it.key.startsWith(h.id + '.');
              if (own ? !/\.(arm|hand)[LR]$/.test(it.key) : !above(it, h)) continue;   // a character's own arm across its face counts too
              if (bb.x > h.c[0] + h.r || bb.x + bb.width < h.c[0] - h.r || bb.y > h.c[1] + h.r || bb.y + bb.height < h.c[1] - h.r) continue;
              if (pts().some(q => Math.hypot(q[0] - h.c[0], q[1] - h.c[1]) < h.r * (own ? 0.6 : 0.75))) out.hits.push(['FACE', `${it.key} (line) over ${h.id}`, '']);
            }
            if (stroke && stroke !== 'none' && (+el.getAttribute('stroke-width') || 1) >= 2) lines.push({ key: it.key, bb, pts, it });
            const fill = el.getAttribute('fill');
            if (fill && fill !== 'none' && fill !== 'transparent') fills.push({ bb, it });
          } else if (inStage(bb)) { seen(); cover(bb.x, bb.y, bb.x + bb.width, bb.y + bb.height); if (it.tag !== 'text') fills.push({ bb, it }); }
        }
        for (const T of texts) {
          // the inner part of the glyph box: lines that only touch the padding are fine
          const w = T.box[2] - T.box[0], h = T.box[3] - T.box[1];
          const B = [T.box[0] + w * 0.08, T.box[1] + h * 0.2, T.box[2] - w * 0.08, T.box[3] - h * 0.2];
          for (const Lk of lines) {
            if (owner(Lk.key) === owner(T.key) || Lk.key.startsWith(owner(T.key) + '.') || T.key.startsWith(owner(Lk.key) + '.')) continue;
            const bb = Lk.bb;
            if (bb.x > B[2] || bb.x + bb.width < B[0] || bb.y > B[3] || bb.y + bb.height < B[1]) continue;
            // a line under the text but hidden by a filled shape in between (a medal disc, a card) is fine
            const cx = (T.box[0] + T.box[2]) / 2, cy = (T.box[1] + T.box[3]) / 2;
            if (before(Lk.it, T.it) && fills.some(f => before(Lk.it, f.it) && before(f.it, T.it) && f.bb.x < cx && f.bb.x + f.bb.width > cx && f.bb.y < cy && f.bb.y + f.bb.height > cy)) continue;
            if (Lk.pts().some(q => q[0] > B[0] && q[0] < B[2] && q[1] > B[1] && q[1] < B[3])) out.hits.push(['CROSS', `${Lk.key} through ${T.key}`, ` “${T.str.slice(0, 10)}”`]);
          }
        }
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const A = texts[i].box, B = texts[j].box;
          const w = Math.min(A[2], B[2]) - Math.max(A[0], B[0]), h = Math.min(A[3], B[3]) - Math.max(A[1], B[1]);
          if (w <= 0 || h <= 0) continue;
          const small = Math.min((A[2] - A[0]) * (A[3] - A[1]), (B[2] - B[0]) * (B[3] - B[1]));
          if (w * h > 0.25 * small) out.hits.push(['OVERLAP', `${texts[i].key} × ${texts[j].key}`, '']);
        }
        out.shown = cells.size / (32 * 16);
        return out;
      }, sc.start + lt);
      for (const [type, key, detail] of r.hits) {
        const id = key.split(/ (?:over|on|through|×) /).length > 1 ? key.replace(/[^ ]+/g, w => /[.#]/.test(w) ? norm(w) : w) : norm(key);
        note(sc.id, type, id, detail, key, lt);
      }
      if (r.shown < 0.03 && lt > 1 && lt < sc.dur - 1) note(sc.id, 'BLANK', 'stage (nearly) empty', '', '', lt);
      const gone = prev ? Object.keys(prev).filter(g => prev[g] >= 6 && !r.all[g] && lt > 0.6 && lt < sc.dur - 0.6) : [];
      if (gone.length) {
        // look between the two samples: a group that shrinks or fades on its way out is an exit, not a pop
        const ref = await p.evaluate(T => window.__groupSize(T), sc.start + Math.max(0, lt - 1.5 * STEP)), mids = [];
        for (let f = 0; f < 1; f += 0.125) mids.push(await p.evaluate(T => window.__groupSize(T), sc.start + lt - STEP + f * STEP));
        const exits = g => { const v = [ref, ...mids].map(m => m[g]).filter(Boolean); return !ref[g] || Math.min(...v) < 0.8 * Math.max(...v); };
        for (const g of gone) if (!exits(g)) note(sc.id, 'POP', `${g} (${prev[g]} shapes) gone between ${(lt - STEP).toFixed(2)} and ${lt.toFixed(2)}`, '', g, lt);
      }
      prev = r.groups;
    }
  }
  // scene cuts: of the ink just before the cut, how much is still there just after?
  // ~0% is a clean cut, ~100% a seamless carry-over; in between, part of the picture pops at the cut.
  const seams = [];
  const shot = async T => { await p.evaluate(x => window.__seek(x), T); return (await p.locator('#stage').screenshot({ type: 'png' })).toString('base64'); };
  for (let i = 1; i < scenes.length; i++) {
    if (ONLY && !ONLY.has(scenes[i].id) && !ONLY.has(scenes[i - 1].id)) continue;
    const t = scenes[i].start, a = await shot(t - 0.04), c = await shot(t + 0.04);
    const kept = await p.evaluate(async ([a, c]) => {
      const load = s => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = 'data:image/png;base64,' + s; });
      const W = 400, H = 225, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
      const px = im => { g.clearRect(0, 0, W, H); g.drawImage(im, 0, 0, W, H); return g.getImageData(0, 0, W, Math.floor(H * 0.88)).data; };   // above the subtitle band
      const A = px(await load(a)), B = px(await load(c));
      const lum = (X, i) => 0.3 * X[i] + 0.59 * X[i + 1] + 0.11 * X[i + 2], h = A.length / 4 / W, paper = lum(A, (2 * W + 2) * 4);
      let ink = 0, stay = 0;   // an ink pixel "stays" if there is still ink within 1 px after the cut (pencil lines jitter)
      for (let y = 0; y < h; y++) for (let x = 0; x < W; x++) {
        if (lum(A, (y * W + x) * 4) > paper - 40) continue; ink++;
        search: for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < h && xx >= 0 && xx < W && lum(B, (yy * W + xx) * 4) < paper - 20) { stay++; break search; } }
      }
      return ink ? stay / ink : 1;
    }, [a, c]);
    const pct = Math.round(kept * 100);
    seams.push(`${pct > 15 && pct < 90 ? '**SEAM** ' : ''}${scenes[i - 1].id} → ${scenes[i].id} @ ${t.toFixed(2)}: ${pct}% of the ink stays${pct > 15 && pct < 90 ? ' — the rest pops at the cut; fade it out first or carry it on' : ''}`);
  }
  await b.close();
  const order = ['FACE', 'CROSS', 'OVERLAP', 'BAND', 'BLANK', 'SMALL', 'ZERO', 'POP'];
  const span = ts => { const out = []; let a = ts[0], z = ts[0]; for (const x of ts.slice(1)) { if (x - z > STEP * 1.5) { out.push(a === z ? `${a}` : `${a}–${z}`); a = x; } z = x; } out.push(a === z ? `${a}` : `${a}–${z}`); return out.length > 6 ? out.slice(0, 6).join(', ') + ` … (${out.length} spans)` : out.join(', '); };
  let total = 0;
  console.log(`# lint ${path.basename(file)} (step ${STEP}s; times are scene-local)\n`);
  for (const sc of scenes) {
    if (ONLY && !ONLY.has(sc.id)) continue;
    // a line sweeping past a label, or a text scaling in, is gone in a blink: report only if it holds ≥ 2 samples
    const L = [...found.values()].filter(f => f.scene === sc.id && !(/CROSS|SMALL/.test(f.type) && f.times.length < 2)).sort((x, y) => order.indexOf(x.type) - order.indexOf(y.type) || x.times[0] - y.times[0]);
    if (!L.length) continue;
    console.log(`## ${sc.id}`);
    L.forEach(f => { total++; console.log(`- ${f.type}  ${f.id}${f.keys.size > 1 ? ` (${f.keys.size} keys)` : ''}${f.detail}  @ ${span(f.times)}`); });
    console.log('');
  }
  console.log(`## seams\n${seams.map(s => '- ' + s).join('\n')}\n`);
  const bad = seams.filter(s => s.startsWith('**SEAM**')).length;
  console.log(total + bad ? `${total} hint(s), ${bad} seam(s). Open the frames and fix the real ones.` : 'no hints.');
})().catch(e => { console.error(e); process.exit(1); });
