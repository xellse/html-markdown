// Export a built episode as an MP4 video: frame-accurate pictures (the page's pure render(t)) + the episode's
// sound mixed offline exactly as the player plays it (voice, music beds with ducking, sound effects).
//
// Usage (from the project folder):
//   NODE_PATH=$(npm root -g) node tools/export_video.cjs episode-1.html episode-1-4k.mp4 [options]
// Options:
//   --res 3840x2160   output size (default 4K UHD; 1920x1080 for a quick preview)
//   --fps 24          frame rate (the animation is drawn at 24 fps; keep 24)
//   --from 0 --to 30  export only part of the episode (seconds), for testing
//   --crf 18          x264 quality (lower = better/bigger; 18 is visually lossless)
//   --preset medium   x264 speed/size trade-off
//   --jobs 3          render frames with N browser pages in parallel (each writes its own segment)
//   --no-audio        pictures only
//   --hold 10         seconds to hold the picture at each "轮到你了" pause (a video can't wait for a tap): the frame
//                     stays, a 想一想 countdown appears and the think music plays, then the answer follows (0 = no hold)
// Needs: Playwright's Chromium (npm i -g playwright) and ffmpeg (on PATH, or FFMPEG=/path/to/ffmpeg,
// or python3 -m pip install imageio-ffmpeg — its bundled binary is used automatically).
// The page must have been built with its audio pack next to it (python3 tools/audio.py epN).
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');

function args() {
  const a = process.argv.slice(2), o = { res: '3840x2160', fps: 24, crf: 18, preset: 'medium', jobs: 1, audio: true, hold: 10 };
  o.page = a[0]; o.out = a[1];
  for (let i = 2; i < a.length; i++) {
    const k = a[i];
    if (k === '--no-audio') o.audio = false;
    else if (k.startsWith('--')) o[k.slice(2)] = a[++i];
  }
  if (!o.page || !o.out) { console.error('usage: export_video.cjs <page.html> <out.mp4> [--res 3840x2160] [--fps 24] [--from s] [--to s] [--crf 18] [--jobs N] [--no-audio]'); process.exit(2); }
  const [w, h] = o.res.split('x').map(Number); o.w = w; o.h = h; o.fps = +o.fps; o.jobs = Math.max(1, +o.jobs); o.hold = Math.max(0, +o.hold);
  return o;
}
function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return 'ffmpeg'; } catch (e) { /* not on PATH */ }
  try { return execFileSync('python3', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())']).toString().trim(); } catch (e) { /* no imageio-ffmpeg */ }
  console.error('ffmpeg not found: install it, set FFMPEG=/path/to/ffmpeg, or python3 -m pip install imageio-ffmpeg'); process.exit(2);
}
const launch = () => chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});

async function openPage(browser, file, o) {
  const p = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: o.w / 1600 });
  const logs = [];
  p.on('console', m => { if (m.type() === 'error') logs.push(m.text()); });
  p.on('pageerror', e => logs.push('pageerror: ' + e.message));
  await p.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => typeof window.render === 'function' && typeof window.__duration === 'number', null, { timeout: 15000 });
  // only the drawing: the stage SVG fills the 1600x900 viewport, every other page element is hidden
  await p.addStyleTag({ content: `html,body{margin:0!important;padding:0!important;background:#FBF8F1!important;overflow:hidden!important}
    body *{visibility:hidden!important} #stage .overlay{display:none!important}
    #stage{visibility:visible!important;position:fixed!important;left:0!important;top:0!important;width:1600px!important;height:900px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;max-width:none!important;aspect-ratio:auto!important;z-index:99999!important}
    #svg,#svg *{visibility:visible!important} #svg{position:absolute!important;left:0!important;top:0!important;width:1600px!important;height:900px!important}` });
  const fonts = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
  if (!fonts) console.warn('warning: no web font loaded — the video would use a fallback font (see references/environment.md)');
  return { p, logs };
}

/** video time v -> episode time t (and seconds left in a hold, or 0) */
function mapTime(v, holds) {
  let acc = 0;
  for (const [p, H] of holds) {
    if (v < p + acc) break;
    if (v < p + acc + H) return { t: p, left: p + acc + H - v };
    acc += H;
  }
  return { t: v - acc, left: 0 };
}
// the hold overlay: drawn into the SVG (so it is in the frame), in the empty lower half of the stage
const HOLD_SVG = `<g id="__hold" font-family="'ZCOOL KuaiLe','Patrick Hand',sans-serif">
  <text id="__holdT" x="720" y="668" font-size="60" fill="#D7383B" text-anchor="middle">想一想……</text>
  <circle cx="960" cy="648" r="50" fill="#FBF8F1" stroke="#D7383B" stroke-width="6"/>
  <text id="__holdN" x="960" y="672" font-size="64" fill="#D7383B" text-anchor="middle" font-family="'Patrick Hand',sans-serif">10</text></g>`;

async function renderFrames(browser, file, o, f0, f1, segPath, ff, label, holds) {
  const { p, logs } = await openPage(browser, file, o);
  await p.evaluate(svg => { const host = document.getElementById('svg'); const g = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`, 'image/svg+xml').documentElement.firstElementChild; host.appendChild(document.importNode(g, true)); document.getElementById('__hold').style.display = 'none'; }, HOLD_SVG);
  const enc = spawn(ff, ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(o.fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', o.preset, '-crf', String(o.crf), '-profile:v', 'high', '-level:v', '5.1', '-pix_fmt', 'yuv420p', '-r', String(o.fps), segPath], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => { enc.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))); });
  const t0 = Date.now();
  for (let i = f0; i < f1; i++) {
    const { t, left } = mapTime(i / o.fps, holds);
    await p.evaluate(([t, left]) => {
      window.render(t);
      const g = document.getElementById('__hold'); g.style.display = left > 0 ? '' : 'none';
      if (left > 0) document.getElementById('__holdN').textContent = String(Math.ceil(left - 1e-6));
    }, [t, left]);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1600, height: 900 } });
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if ((i - f0) % 240 === 239) {
      const k = i - f0 + 1, per = (Date.now() - t0) / k;
      console.log(`${label} ${k}/${f1 - f0} frames (${(per / 1000).toFixed(2)} s/frame, ~${Math.round(per * (f1 - f0 - k) / 60000)} min left)`);
    }
  }
  enc.stdin.end(); await done; await p.close();
  if (logs.length) console.warn(label + ' console errors:\n  ' + logs.slice(0, 10).join('\n  '));
}

async function renderAudio(browser, file, o, wavPath, holds) {
  const { p } = await openPage(browser, file, { ...o, w: 1600 });
  const hasPack = await p.evaluate(() => !!(window.TAO_AUDIO && window.TAO_AUDIO.voice));
  if (!hasPack) { console.warn('no audio pack in the page (run python3 tools/audio.py first) — exporting without sound'); await p.close(); return false; }
  const n = await p.evaluate(holds => window.__renderAudio(48000, holds), holds);
  const fd = fs.openSync(wavPath, 'w'), CH = 6 * 1024 * 1024;
  for (let i = 0; i < n; i += CH) fs.writeSync(fd, Buffer.from(await p.evaluate(([i, CH]) => window.__wavChunk(i, CH), [i, CH]), 'base64'));
  fs.closeSync(fd); await p.close();
  return true;
}

(async () => {
  const o = args(), ff = ffmpegPath();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'epvideo-'));
  const browser = await launch();
  const [epDur, pauses] = await (async () => { const { p } = await openPage(browser, o.page, { ...o, w: 1600 }); const d = await p.evaluate(() => [window.__duration, window.__pauses || []]); await p.close(); return d; })();
  const holds = o.hold > 0 ? pauses.map(x => [x, o.hold]) : [];
  const dur = epDur + holds.reduce((s, h) => s + h[1], 0);
  if (holds.length) console.log(`holding ${o.hold} s at ${holds.length} pause(s): ${pauses.map(x => x.toFixed(1)).join(', ')} s`);
  const from = +(o.from || 0), to = Math.min(+(o.to || dur), dur);
  const F0 = Math.round(from * o.fps), F1 = Math.round(to * o.fps);
  console.log(`exporting ${o.page}: ${from.toFixed(1)}–${to.toFixed(1)} s, ${F1 - F0} frames at ${o.w}x${o.h} ${o.fps} fps, ${o.jobs} job(s)`);

  const wav = path.join(tmp, 'audio.wav');
  const audioP = o.audio ? renderAudio(browser, o.page, o, wav, holds) : Promise.resolve(false);

  const per = Math.ceil((F1 - F0) / o.jobs), segs = [];
  const jobs = [];
  for (let j = 0; j < o.jobs; j++) {
    const a = F0 + j * per, b = Math.min(F1, a + per); if (a >= b) break;
    const seg = path.join(tmp, `seg${j}.mp4`); segs.push(seg);
    jobs.push(renderFrames(browser, o.page, o, a, b, seg, ff, `[job ${j + 1}]`, holds));
  }
  const [withAudio] = await Promise.all([audioP, ...jobs]);
  await browser.close();

  const list = path.join(tmp, 'segs.txt');
  fs.writeFileSync(list, segs.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));
  const mux = ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list];
  if (withAudio) mux.push('-ss', String(from), '-t', String(to - from), '-i', wav);
  mux.push('-map', '0:v:0'); if (withAudio) mux.push('-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k');
  mux.push('-c:v', 'copy', '-movflags', '+faststart', '-shortest', o.out);
  execFileSync(ff, mux, { stdio: 'inherit' });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`wrote ${o.out} (${(fs.statSync(o.out).size / 1048576).toFixed(1)} MB)`);
})().catch(e => { console.error(e); process.exit(1); });
