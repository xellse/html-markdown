#!/usr/bin/env python3
"""Make an episode's audio pack: narration clips (Edge neural voices) + trimmed music beds.

    python3 tools/audio.py ep1 [--music-src DIR]

Reads src/<ep>/meta.json ("audio" block). Writes
  audio/voice/<hash>.mp3          narration cache (one clip per subtitle line; reused while text/voice are unchanged)
  audio/music/<file>              music beds, trimmed + faded + re-encoded (made once from --music-src)
  <out>.audio.js                  window.TAO_AUDIO = {voice, music, credits}, loaded by the page
and prints lines whose narration runs longer than the gap before the next line (the player then holds the picture).
"""
import argparse, asyncio, base64, hashlib, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
import build  # noqa: E402

CA = '/root/.ccr/ca-bundle.crt'


def dump_lines(page):
    env = dict(os.environ, NODE_PATH='/opt/node22/lib/node_modules')
    out = subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'dump_lines.cjs'), page], env=env)
    return json.loads(out)


async def tts_all(jobs):
    if os.path.exists(CA):  # the session's TLS proxy
        import certifi
        certifi.where = lambda: CA
    import edge_tts
    sem = asyncio.Semaphore(4)

    async def one(text, cfg, path):
        async with sem:
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(text, cfg['voice'], rate=cfg.get('rate', '+0%'), pitch=cfg.get('pitch', '+0Hz'),
                                               proxy=os.environ.get('HTTPS_PROXY')).save(path + '.part')
                    os.replace(path + '.part', path)
                    return
                except Exception as e:  # network hiccup: retry
                    if attempt == 2:
                        raise
                    print('  retry', text[:12], type(e).__name__)
                    await asyncio.sleep(2 * (attempt + 1))
    await asyncio.gather(*(one(*j) for j in jobs))


def mp3_len(path):
    from mutagen.mp3 import MP3
    return MP3(path).info.length


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def b64(path):
    return base64.b64encode(open(path, 'rb').read()).decode('ascii')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('ep')
    ap.add_argument('--music-src', help='folder with the original music files (only needed the first time)')
    a = ap.parse_args()
    meta = json.load(open(os.path.join(ROOT, 'src', a.ep, 'meta.json'), encoding='utf-8'))
    cfg = meta['audio']
    tmp_page = os.path.join(ROOT, f'.{a.ep}-lines.html')
    build.build(a.ep, out=tmp_page, audio=False)
    scenes = dump_lines(tmp_page)
    os.remove(tmp_page)

    # --- narration
    vdir = os.path.join(ROOT, 'audio', 'voice'); os.makedirs(vdir, exist_ok=True)
    lines, jobs = [], []
    for sc in scenes:
        for s in sc['subs']:
            if not s['say']:
                continue
            vc = cfg['voices'][s['voice']]
            h = hashlib.sha1(json.dumps([vc, s['say']], ensure_ascii=False).encode()).hexdigest()[:16]
            path = os.path.join(vdir, h + '.mp3')
            lines.append((sc, s, path))
            if not os.path.exists(path) and all(j[2] != path for j in jobs):
                jobs.append((s['say'], vc, path))
    if jobs:
        print(f'generating {len(jobs)} narration clips…')
        asyncio.run(tts_all(jobs))
    voice = {}
    over = []
    for sc, s, path in lines:
        d = mp3_len(path)
        voice[s['key']] = {'d': round(d, 3), 'b': b64(path)}
        later = [x['t0'] for x in sc['subs'] if x['t0'] > s['t0'] and x['say']]
        room = (min(later) if later else sc['dur']) - s['t0']
        if d > room - 0.05:
            over.append((s['key'], round(d, 2), round(room, 2), s['say']))

    # --- music beds
    mdir = os.path.join(ROOT, 'audio', 'music'); os.makedirs(mdir, exist_ok=True)
    music = {}
    for key, tr in cfg['tracks'].items():
        out = os.path.join(mdir, tr['file'])
        if not os.path.exists(out):
            src = os.path.join(a.music_src or '', tr['file'])
            if not os.path.exists(src):
                sys.exit(f'missing music source {src} (pass --music-src)')
            secs = tr['secs']
            subprocess.check_call([ffmpeg(), '-v', 'error', '-y', '-i', src, '-t', str(secs),
                                   '-af', f'afade=t=in:d=0.04,afade=t=out:st={secs - 2.5}:d=2.5',
                                   '-ac', '2', '-ar', '44100', '-b:a', '64k', out])
        music[key] = {'d': round(mp3_len(out), 3), 'b': b64(out), 'title': tr['title']}

    titles = ' · '.join(dict.fromkeys(t['title'] for t in cfg['tracks'].values()))
    pack = {'voice': voice, 'music': music,
            'credits': f'配乐：Kevin MacLeod（incompetech.com）《{titles}》，CC BY 4.0 授权。配音：微软 Edge 神经网络语音（云希、云夏）。'}
    out_js = os.path.join(ROOT, meta['out'].replace('.html', '.audio.js'))
    with open(out_js, 'w', encoding='utf-8') as f:
        f.write('window.TAO_AUDIO = ' + json.dumps(pack, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f'wrote {out_js} ({os.path.getsize(out_js) // 1024} KB): {len(voice)} lines, {len(music)} music beds')
    if over:
        print('\nlines longer than their slot (player will hold the picture):')
        for k, d, room, t in over:
            print(f'  {k:14s} {d:5.2f}s > {room:5.2f}s  {t}')


if __name__ == '__main__':
    main()
