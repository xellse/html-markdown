/* =====================================================================
   PLAYER  — clock, controls, chapters, "think" pauses, narration sync
   ===================================================================== */
prepareEpisode();
const $ = id => document.getElementById(id);
const ui = { play: $('btnPlay'), restart: $('btnRestart'), scrub: $('scrub'), time: $('time'), narr: $('btnNarr'), snd: $('btnSnd'),
  poster: $('poster'), think: $('think'), chapters: $('chapters') };
const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
};
const fmt = s => { s = Math.max(0, s); const m = Math.floor(s / 60), r = Math.floor(s % 60); return `${m}:${String(r).padStart(2, '0')}`; };
const P = { t: 0, playing: false, poster: true, waiting: null, wall0: 0, t0: 0, prev: 0, lastQ: -1, raf: 0, holdAt: null, narr: true, snd: true };
try { const s = JSON.parse(localStorage.getItem('taoPlayerPrefs') || 'null'); if (s) { P.narr = !!s.narr; P.snd = !!s.snd; } } catch (e) { /* storage blocked */ }
const savePrefs = () => { try { localStorage.setItem('taoPlayerPrefs', JSON.stringify({ narr: P.narr, snd: P.snd })); } catch (e) { /* ignore */ } };

ui.scrub.max = EP.dur.toFixed(2);
const CHAPS = EP.scenes.filter(sc => sc.chapter).map(sc => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.type = 'button'; b.className = 'chap';
  b.innerHTML = `<span></span><span class="ct">${fmt(sc.start)}</span>`; b.firstChild.textContent = sc.chapter;
  b.addEventListener('click', () => { seek(sc.start); play(); });
  li.appendChild(b); ui.chapters.appendChild(li);
  return { sc, b };
});

function paint(t, force) {
  const q = Math.floor(t * CFG.FPS + 1e-6);
  if (force || q !== P.lastQ) { render(t); P.lastQ = q; }
}
function syncUI() {
  const t = P.poster ? 0 : P.t;
  ui.scrub.value = t.toFixed(2);
  ui.scrub.setAttribute('aria-valuetext', `${fmt(t)}`);
  ui.time.textContent = `${fmt(t)} / ${fmt(EP.dur)}`;
  ui.play.innerHTML = P.playing ? ICON.pause : ICON.play;
  ui.play.setAttribute('aria-label', P.playing ? '暂停' : '播放');
  ui.poster.hidden = !P.poster;
  ui.think.hidden = P.waiting === null || P.playing;
  ui.narr.setAttribute('aria-pressed', String(P.narr));
  ui.snd.setAttribute('aria-pressed', String(P.snd));
  let cur = null; for (const c of CHAPS) if (t >= c.sc.start - 1e-6) cur = c;
  CHAPS.forEach(c => c.b.setAttribute('aria-current', String(c === cur && !P.poster)));
}
function fireCues(a, b) {
  for (const c of EP.cues) {
    if (c.t <= a) continue; if (c.t > b) break;
    if (c.sfx && P.snd) SFX.play(c.sfx);
    if (c.say && P.narr) TTS.say(c.say);
  }
}
function tick(now) {
  if (!P.playing) return;
  let t = P.t0 + (now - P.wall0) / 1000;
  // hold the picture while the voice finishes, instead of letting lines pile up
  if (P.narr && TTS.busy()) {
    const nx = EP.syncs.find(x => x > P.prev + 1e-4 && x <= t);
    if (nx !== undefined) { t = Math.max(P.prev, nx - 1e-3); P.t0 = t; P.wall0 = now; }
  }
  // "轮到你了" pauses: stop and wait for the child
  const pp = EP.pauses.find(x => x > P.prev && x <= t);
  if (pp !== undefined) t = pp;
  if (t >= EP.dur) t = EP.dur;
  fireCues(P.prev, t); P.prev = t; P.t = t;
  paint(t);
  if (pp !== undefined) { P.playing = false; P.waiting = pp; syncUI(); return; }
  if (t >= EP.dur) { P.playing = false; syncUI(); return; }
  syncUI();
  P.raf = requestAnimationFrame(tick);
}
function play() {
  const resume = P.waiting !== null;
  if (P.poster || P.t >= EP.dur - 1e-3) P.t = 0;
  P.poster = false; P.playing = true; P.waiting = null;
  SFX.unlock();
  if (!resume) TTS.cancel();
  if (P.narr) TTS.prime();
  P.t0 = P.t; P.prev = resume ? P.t : P.t - 1e-4; P.wall0 = performance.now();
  cancelAnimationFrame(P.raf); P.raf = requestAnimationFrame(tick);
  paint(P.t, true); syncUI();
}
function pause() { P.playing = false; cancelAnimationFrame(P.raf); TTS.cancel(); syncUI(); }
function toggle() { P.playing ? pause() : play(); }
function seek(t) {
  pause(); P.poster = false; P.waiting = null;
  P.t = clamp(+t || 0, 0, EP.dur);
  paint(P.t, true); syncUI();
}
ui.play.addEventListener('click', toggle);
ui.poster.addEventListener('click', play);
ui.think.addEventListener('click', play);
ui.restart.addEventListener('click', () => { seek(0); play(); });
ui.scrub.addEventListener('input', () => seek(+ui.scrub.value));
ui.narr.addEventListener('click', () => { P.narr = !P.narr; if (!P.narr) TTS.cancel(); savePrefs(); syncUI(); });
ui.snd.addEventListener('click', () => { P.snd = !P.snd; if (P.snd) SFX.unlock(); savePrefs(); syncUI(); });
document.addEventListener('keydown', e => {
  if (e.code !== 'Space' && e.key !== ' ') return;
  const tag = e.target && e.target.tagName;
  if (tag === 'BUTTON' || tag === 'TEXTAREA' || (tag === 'INPUT' && e.target.type !== 'range')) return;
  e.preventDefault(); toggle();
});
document.addEventListener('visibilitychange', () => { if (document.hidden && P.playing) pause(); });

// reduced motion: no line boil (holds become perfectly still)
try {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  RM.reduce = mq.matches;
  const onMQ = () => { RM.reduce = mq.matches; paint(P.poster ? EP.poster : P.t, true); };
  mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ);
} catch (e) { /* ignore */ }

// test/automation hooks
window.render = render;
window.__duration = EP.dur;
window.__scenes = EP.scenes.map(s => ({ id: s.id, chapter: s.chapter || null, start: +s.start.toFixed(3), dur: s.dur }));
window.__seek = t => { seek(t); render(P.t); P.lastQ = Math.floor(P.t * CFG.FPS + 1e-6); };

paint(Math.min(EP.poster, EP.dur), true); syncUI();
