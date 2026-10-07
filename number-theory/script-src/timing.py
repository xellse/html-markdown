# lay out subtitle timings: each line = (text, voice, hold_before, say)
import sys, json
def units(s): return sum(0.5 if ch.isascii() and ch.isalnum() else 0 if ch.isspace() else 1 for ch in s)
PACE = {'narr': (0.2, 0.8), 'kid': (0.19, 0.95), 'qm': (0.2, 0.8)}
def vis(s): return len(s.strip('“”"'))   # same rule as tools/check_timing.py
def lay(lines, start=0.3, margin=0.25, gap=0.1, tail=0.5):
    t = start; out = []
    for L in lines:
        text, voice, hold, say, hide = (list(L) + [None, None, None, None])[:5]
        voice = voice or 'narr'; hold = hold or 0
        t += hold
        a, b = PACE[voice]; d = a * units(say or text) + b + margin
        t0, t1 = round(t, 2), round(t + d, 2)
        assert hide or vis(text) <= 20, (text, vis(text))
        o = {'t0': t0, 't1': t1, 'text': text}
        if voice != 'narr': o['voice'] = voice
        if say: o['say'] = say
        if hide: o['hide'] = True
        out.append(o); t = t1 + gap
    return out, round(t - gap + tail, 1)
