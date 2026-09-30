// Drive the real player: poster → play → chapters → think pause → phone width. Prints state; errors must be "none".
// Usage: NODE_PATH=$(npm root -g) node playtest.cjs <page.html> <outdir>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [file, outdir = '.'] = process.argv.slice(2);
  fs.mkdirSync(outdir, { recursive: true });
  const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
  const st = () => p.evaluate(() => ({ time: document.getElementById('time').textContent, poster: !document.getElementById('poster').hidden,
    think: !document.getElementById('think').hidden, ...(window.__audio ? window.__audio() : {}) }));
  await p.screenshot({ path: path.join(outdir, 'rest.png') });
  console.log('at rest      ', await st());
  await p.click('#poster'); await p.waitForTimeout(2500);
  console.log('playing 2.5 s', await st());
  const scenes = await p.evaluate(() => window.__scenes);
  const chaps = await p.$$('.chap');
  if (chaps.length > 1) { await chaps[1].click(); await p.waitForTimeout(1500); console.log('chapter 2    ', await st()); }
  const pauses = await p.evaluate(() => (typeof EP !== 'undefined' ? EP.pauses : []));
  if (!pauses.length) console.log('think pause   (this episode has no pauses — skipped)');
  if (pauses.length) {
    await p.evaluate(t => { const s = document.getElementById('scrub'); s.value = t; s.dispatchEvent(new Event('input')); }, Math.max(0, pauses[0] - 1));
    await p.click('#btnPlay'); await p.waitForTimeout(2600);
    console.log('think pause  ', await st());
    await p.screenshot({ path: path.join(outdir, 'think.png') });
    await p.click('#think'); await p.waitForTimeout(1200);
    console.log('continued    ', await st());
  }
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(outdir, 'phone.png'), fullPage: true });
  console.log('scenes', scenes.map(s => `${s.id}@${s.start}`).join(' '));
  console.log('phone horizontal overflow:', await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
