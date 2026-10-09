#!/usr/bin/env python3
"""Make an episode's audio pack: narration clips (Edge neural voices) + trimmed music beds.

    python3 tools/audio.py ep1 [--music-src DIR]

Reads src/<ep>/meta.json ("audio" block). Writes
  audio/voice/<hash>.mp3          narration cache (one clip per subtitle line; reused while text/voice are unchanged)
  audio/music/<file>              music beds, trimmed to tracks.secs + faded + re-encoded (made once from --music-src;
                                  an existing file is used as is — the template's beds are already trimmed)
  <out>.audio.js                  window.TAO_AUDIO = {voice, music, credits}, loaded by the page
prints lines whose narration runs longer than the gap before the next line (the player then holds the picture),
and rebuilds <out>.html so the page links the new pack.
"""
import argparse, asyncio, base64, hashlib, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
import build  # noqa: E402

VOICE_NAMES = {'zh-CN-YunxiNeural': '云希', 'zh-CN-YunxiaNeural': '云夏', 'zh-CN-YunjianNeural': '云健', 'zh-CN-YunyangNeural': '云扬',
               'zh-CN-XiaoxiaoNeural': '晓晓', 'zh-CN-XiaoyiNeural': '晓伊'}


def ca_bundle():
    """CA bundle for TLS-intercepting proxies (e.g. Claude Code cloud sessions); None = system default."""
    for p in (os.environ.get('SSL_CERT_FILE'), os.environ.get('REQUESTS_CA_BUNDLE'), '/root/.ccr/ca-bundle.crt'):
        if p and os.path.exists(p):
            return p
    return None


def node_path():
    if os.environ.get('NODE_PATH'):
        return os.environ['NODE_PATH']
    try:
        return subprocess.check_output(['npm', 'root', '-g'], text=True).strip()
    except Exception:
        return ''


def dump_lines(page):
    env = dict(os.environ, NODE_PATH=node_path())
    out = subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'dump_lines.cjs'), page], env=env)
    return json.loads(out)


async def tts_all(jobs):
    ca = ca_bundle()
    if ca:  # edge-tts builds its SSL context from certifi
        import certifi
        certifi.where = lambda: ca
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
    tmp_page = os.path.join(ROOT, f'.{a.ep}-lines-{os.getpid()}.html')
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
            vc = {k: v for k, v in cfg['voices'][s['voice']].items() if k != 'pace'}   # pace only tunes check_timing, not the voice
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
    used = set(cfg.get('music', {}).values())
    if cfg.get('think') and any(sc['pauses'] for sc in scenes):
        used.add(cfg['think'])
    for key, tr in cfg['tracks'].items():
        if key not in used:
            continue
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

    credits = cfg.get('credits')
    if not credits:
        parts = []
        by = {}
        for key in music:
            tr = cfg['tracks'][key]
            by.setdefault((tr.get('author', 'Kevin MacLeod（incompetech.com）'), tr.get('license', 'CC BY 4.0')), []).append(tr['title'])
        for (author, lic), titles in by.items():
            parts.append(f"配乐：{author}《{' · '.join(dict.fromkeys(titles))}》，{lic} 授权。")
        names = '、'.join(dict.fromkeys(VOICE_NAMES.get(v['voice'], v['voice']) for v in cfg['voices'].values()))
        parts.append(f'配音：微软 Edge 神经网络语音（{names}）。')
        credits = ''.join(parts)
    pack = {'voice': voice, 'music': music, 'credits': credits}
    out_js = os.path.join(ROOT, meta['out'].replace('.html', '.audio.js'))
    with open(out_js, 'w', encoding='utf-8') as f:
        f.write('window.TAO_AUDIO = ' + json.dumps(pack, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f'wrote {out_js} ({os.path.getsize(out_js) // 1024} KB): {len(voice)} lines, {len(music)} music beds')
    if over:
        print('\nlines longer than their slot (player will hold the picture; > 0.3 s is worth fixing):')
        for k, d, room, t in over:
            print(f'  {k:14s} {d:5.2f}s > {room:5.2f}s  {t}')
    build.build(a.ep)   # link the fresh pack into the page


if __name__ == '__main__':
    main()
