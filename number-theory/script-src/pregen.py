# pre-generate narration clips for every scripted line (same cache key as tools/audio.py) and report real lengths vs slots
#   python3 pregen.py nt1_lines.json            -> voices from src/ep1/meta.json
#   python3 pregen.py nt2_lines.json [--alt]    -> voices from lines_nt2.VOICES (src/ep2/meta.json once it exists);
#                                                  --alt also makes the clips for lines_nt2.ALT_VOICES (the other narration rate)
import sys, json, os, hashlib, asyncio
ROOT = '/home/user/html-markdown/number-theory'
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, 'tools')); sys.path.insert(0, ROOT); sys.path.insert(0, HERE)
import audio
src = sys.argv[1] if os.path.isabs(sys.argv[1]) else os.path.join(HERE, sys.argv[1])
if 'nt2' in os.path.basename(src):
    import lines_nt2
    sets = [lines_nt2.VOICES] + ([lines_nt2.ALT_VOICES] if '--alt' in sys.argv else [])
else:
    sets = [json.load(open(os.path.join(ROOT, 'src/ep1/meta.json'), encoding='utf-8'))['audio']['voices']]
L = json.load(open(src, encoding='utf-8'))
vdir = os.path.join(ROOT, 'audio', 'voice'); jobs = []; rows = []
for n, voices in enumerate(sets):
    for sid, d in L.items():
        subs = d['subs']
        for i, s in enumerate(subs):
            say = (s.get('say') or s['text']).replace('\n', '')
            vc = voices[s.get('voice', 'narr')]
            h = hashlib.sha1(json.dumps([vc, say], ensure_ascii=False).encode()).hexdigest()[:16]
            p = os.path.join(vdir, h + '.mp3')
            if n == 0: rows.append((sid, i, s, p, subs, d['dur']))
            if not os.path.exists(p) and all(j[2] != p for j in jobs): jobs.append((say, vc, p))
print('generating', len(jobs))
if jobs: asyncio.run(audio.tts_all(jobs))
for sid, i, s, p, subs, dur in rows:
    dd = audio.mp3_len(p); nxt = subs[i + 1]['t0'] if i + 1 < len(subs) else dur
    room = nxt - s['t0']; slot = s['t1'] - s['t0']
    flag = 'OVER' if dd > room - 0.05 else ('tight' if dd > slot else '')
    if flag: print(f'{sid}#{i:<3d} {dd:5.2f}s slot {slot:4.2f} room {room:5.2f} {flag}  {s["text"]}')
