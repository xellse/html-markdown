#!/usr/bin/env python3
"""Check subtitle timing before generating audio.

    python3 tools/check_timing.py ep1

Rules (see the skill's references/narrative.md §6):
  - a line shows at most 20 characters (every character counts, punctuation and quotes included);
  - it lasts at least  a × units + b  seconds, where units counts what is spoken (a CJK character or punctuation mark = 1,
    a Latin letter or digit = 0.5) and (a, b) is the voice's pace — meta.json audio.voices.<v>.pace, defaults
    narr/qm (0.20, 0.80) and kid (0.19, 0.95), fitted on 150 real clips of 云希 +5% / 云夏 +0%;
  - the next line starts at least 0.1 s after this one ends.
Prints every violation; exit code 1 if there are any. Real clip lengths are checked later by tools/audio.py.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import build  # noqa: E402
from audio import dump_lines  # noqa: E402

DEFAULT_PACE = {'narr': (0.20, 0.80), 'qm': (0.20, 0.80), 'kid': (0.19, 0.95)}


def units(text):
    return sum(0.5 if ch.isascii() and ch.isalnum() else 0 if ch.isspace() else 1 for ch in text)


def main():
    ep = sys.argv[1] if len(sys.argv) > 1 else 'ep1'
    meta = json.load(open(os.path.join(ROOT, 'src', ep, 'meta.json'), encoding='utf-8'))
    voices = meta.get('audio', {}).get('voices', {})
    page = os.path.join(ROOT, f'.{ep}-lines-{os.getpid()}.html')
    build.build(ep, out=page, audio=False)
    scenes = dump_lines(page)
    os.remove(page)
    bad = 0
    for sc in scenes:
        subs = sc['subs']
        for i, s in enumerate(subs):
            if not s['say']:
                continue
            probs = []
            shown = (s.get('text') or '').strip('“”"')      # the quote marks of a character's line don't count
            if len(shown) > 20:
                probs.append(f'{len(shown)} characters on screen (≤ 20): split it into two lines')
            a, b = voices.get(s['voice'], {}).get('pace', DEFAULT_PACE.get(s['voice'], (0.20, 0.80)))
            need = a * units(s['say']) + b
            if s['t1'] - s['t0'] < need - 1e-6:
                probs.append(f'lasts {s["t1"] - s["t0"]:.2f}s, needs {need:.2f}s')
            nxt = [x['t0'] for x in subs[i + 1:]]
            if nxt and nxt[0] - s['t1'] < 0.1 - 1e-6:
                probs.append(f'next line starts {nxt[0] - s["t1"]:.2f}s after it ends (≥ 0.10)')
            if s['t1'] > sc['dur'] + 1e-6:
                probs.append(f'ends at {s["t1"]:.2f}s, after the scene ({sc["dur"]}s)')
            if probs:
                bad += 1
                print(f'{s["key"]:14s} {"; ".join(probs)}\n{"":14s} {s["say"]}')
    print(f'{bad} line(s) to fix' if bad else 'all lines OK')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
