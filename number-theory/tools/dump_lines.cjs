// Prints the spoken lines of a built episode page as JSON (used by audio.py).
// NODE_PATH=/opt/node22/lib/node_modules node tools/dump_lines.cjs episode-1.html
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route(/^https?:/, r => r.abort()); // fonts are not needed here
  await p.goto('file://' + path.resolve(process.argv[2]));
  await p.waitForFunction(() => window.__scenes);
  const out = await p.evaluate(() => EP.scenes.map(sc => ({
    id: sc.id, start: sc.start, dur: sc.dur, pauses: sc.pauses || [],
    subs: sc.subs.map((s, i) => ({ key: `${sc.id}#${i}`, t0: s.t0, t1: s.t1, voice: s.voice || 'narr', text: s.hide ? '' : s.text,
      say: s.say === false ? null : (typeof s.say === 'string' ? s.say : s.text).replace(/\n/g, '') })),
  })));
  console.log(JSON.stringify(out));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
