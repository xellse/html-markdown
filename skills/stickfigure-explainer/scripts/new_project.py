#!/usr/bin/env python3
"""Scaffold a stick-figure animation project from the skill's template.

    python3 new_project.py <target-dir> --series "系列名" [--episode ep1] [--title "第1集 · 标题"]

Creates <target-dir>/ with build.py, src/{engine.js,player.js,shell.html}, tools/, audio/music/ (licensed beds),
and a first episode folder (a copy of the working demo you can edit or replace). Refuses to overwrite files.
"""
import argparse, json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(os.path.dirname(HERE), 'assets', 'template')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('target')
    ap.add_argument('--series', required=True, help='series name shown in the corner of every frame')
    ap.add_argument('--episode', default='ep1', help='episode folder name under src/ (default ep1)')
    ap.add_argument('--title', default=None, help='episode heading, e.g. "第1集 · 为什么是平方数"')
    a = ap.parse_args()

    dst = os.path.abspath(a.target)
    os.makedirs(dst, exist_ok=True)
    clashes = []
    for root, _, files in os.walk(TEMPLATE):
        rel = os.path.relpath(root, TEMPLATE)
        for f in files:
            if rel.startswith(os.path.join('src', 'demo')) or rel == os.path.join('src', 'demo'):
                continue
            if os.path.exists(os.path.join(dst, rel, f)):
                clashes.append(os.path.join(rel, f))
    ep_dir = os.path.join(dst, 'src', a.episode)
    if os.path.exists(ep_dir):
        clashes.append(os.path.relpath(ep_dir, dst))
    if clashes:
        sys.exit('refusing to overwrite: ' + ', '.join(clashes[:8]))

    for root, _, files in os.walk(TEMPLATE):
        rel = os.path.relpath(root, TEMPLATE)
        if rel == os.path.join('src', 'demo') or rel.startswith(os.path.join('src', 'demo') + os.sep):
            continue
        os.makedirs(os.path.join(dst, rel), exist_ok=True)
        for f in files:
            shutil.copy2(os.path.join(root, f), os.path.join(dst, rel, f))
    shutil.copytree(os.path.join(TEMPLATE, 'src', 'demo'), ep_dir)

    meta_p = os.path.join(ep_dir, 'meta.json')
    meta = json.load(open(meta_p, encoding='utf-8'))
    meta['series'] = a.series
    n = ''.join(ch for ch in a.episode if ch.isdigit()) or '1'
    meta['out'] = f'episode-{n}.html'
    if a.title:
        meta['h1'] = a.title
        meta['title'] = f"{a.series} {a.title.split('·')[0].strip()}"
    meta['kicker'] = a.series
    json.dump(meta, open(meta_p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

    print(f'created {dst}')
    print(f'  episode folder: src/{a.episode}/  (starts as the working demo — edit meta.json and the scene files)')
    print('next:')
    print(f'  cd {dst}')
    print(f'  python3 build.py {a.episode}            # -> {meta["out"]} (silent until you make the audio pack)')
    print(f'  python3 tools/audio.py {a.episode}      # narration + music pack (needs network for the voices)')


if __name__ == '__main__':
    main()
