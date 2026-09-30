#!/usr/bin/env python3
"""Build a single self-contained episode page.

    python3 build.py ep1                       -> episode-1.html
    python3 build.py ep1 --only 30 -o x.html   -> only scene files whose name contains "30" (for testing one scene)

src/shell.html holds the page, src/engine.js the shared animation engine, src/player.js the player,
src/<ep>/meta.json the page texts, and src/<ep>/*.js the scenes (played in file-name order).
"""
import argparse, glob, json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')


def build(ep, only=None, out=None):
    meta = json.load(open(os.path.join(SRC, ep, 'meta.json'), encoding='utf-8'))
    shell = open(os.path.join(SRC, 'shell.html'), encoding='utf-8').read()
    engine = open(os.path.join(SRC, 'engine.js'), encoding='utf-8').read()
    player = open(os.path.join(SRC, 'player.js'), encoding='utf-8').read()
    files = sorted(glob.glob(os.path.join(SRC, ep, '*.js')))
    if only:
        keys = only.split(',')
        files = [f for f in files if any(k in os.path.basename(f) for k in keys)]
    scenes = '\n'.join(f'/* ---- {os.path.basename(f)} ---- */\n' + open(f, encoding='utf-8').read() for f in files)
    config = f"EP.series = {json.dumps(meta['series'], ensure_ascii=False)}; EP.poster = {meta.get('poster', 0)};\n"
    page = shell
    for k in ('TITLE', 'DESC', 'H1', 'KICKER', 'ARIA', 'POSTER_LABEL'):
        page = page.replace('{{' + k + '}}', meta[k.lower()])
    for ph, body in (('/*@@ENGINE@@*/', engine), ('/*@@SCENES@@*/', config + scenes), ('/*@@BOOT@@*/', player)):
        page = page.replace(ph, body)
    left = re.findall(r'\{\{[A-Z_]+\}\}|/\*@@[A-Z]+@@\*/', page)
    assert not left, left
    out = out or os.path.join(ROOT, meta['out'])
    open(out, 'w', encoding='utf-8').write(page)
    print(f'built {out}  ({len(files)} scene files, {len(page) // 1024} KB)')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('ep')
    ap.add_argument('--only')
    ap.add_argument('-o', '--out')
    a = ap.parse_args()
    build(a.ep, a.only, a.out)
