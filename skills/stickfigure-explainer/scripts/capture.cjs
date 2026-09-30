// Screenshot a built episode at given times — the main visual check.
// Usage: NODE_PATH=$(npm root -g) node capture.cjs <page.html> <outdir> <times> [width=1280] [selector=#stage]
//   times: "0,1.5,3" (exact times) | "every:5" (the middle of every 5-second slice: 2.5, 7.5, …) | "fps:12" (every frame, for GIFs)
// The page exposes window.__seek(t) and window.__duration. Writes <outdir>/f_<t>.png (or f_0000.png… in fps mode)
// and <outdir>/console.txt (console errors, page errors, failed requests — must be empty).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [file, outdir, timesArg = '0,2,4,6,8,10', widthArg = '1280', selector = '#stage'] = process.argv.slice(2);
  if (!file || !outdir) { console.error('usage: capture.cjs <page.html> <outdir> <times> [width] [selector]'); process.exit(2); }
  fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
  const p = await b.newPage({ viewport: { width: +widthArg, height: Math.round(+widthArg * 0.75) }, deviceScaleFactor: 1 });
  const logs = [];
  p.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => logs.push('pageerror: ' + e.message));
  p.on('requestfailed', r => logs.push('requestfailed: ' + r.url() + ' ' + r.failure().errorText));
  await p.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  try {
    await p.waitForFunction(() => typeof window.__seek === 'function', null, { timeout: 10000 });
  } catch (e) { // the page threw while loading (a scene error, a missing shared helper …): say why
    fs.writeFileSync(path.join(outdir, 'console.txt'), logs.join('\n') || '(page never became ready, no console output)');
    console.error('page did not start — console:\n  ' + (logs.join('\n  ') || '(nothing logged)'));
    await b.close(); process.exit(1);
  }
  const fonts = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family));
  if (!fonts.length) logs.push('warning: no web font loaded — screenshots use a fallback font (see references/environment.md)');
  const dur = await p.evaluate(() => window.__duration || 10);
  let times;
  if (timesArg.startsWith('fps:')) { const fps = +timesArg.slice(4); times = []; for (let i = 0; i <= Math.round(dur * fps); i++) times.push(+(i / fps).toFixed(4)); }
  else if (timesArg.startsWith('every:')) { const st = +timesArg.slice(6); times = []; for (let t = st / 2; t < dur; t += st) times.push(+t.toFixed(2)); }
  else times = timesArg.split(',').map(Number);
  const el = await p.$(selector);
  if (!el) { console.error('selector not found: ' + selector); process.exit(2); }
  let i = 0;
  for (const t of times) {
    await p.evaluate(t => window.__seek(t), t);
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const name = timesArg.startsWith('fps:') ? `f_${String(i).padStart(4, '0')}.png` : `f_${String(t.toFixed(2)).padStart(7, '0')}.png`;
    await el.screenshot({ path: path.join(outdir, name) });
    i++;
  }
  fs.writeFileSync(path.join(outdir, 'console.txt'), logs.join('\n') || '(no console errors/warnings)');
  console.log(`captured ${times.length} frames to ${outdir}; duration=${dur}; console issues=${logs.length}`);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
