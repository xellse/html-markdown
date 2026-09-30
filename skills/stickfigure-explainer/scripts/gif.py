# Usage: python3 gif.py <framesdir> <out.gif> <fps> [width=640]
# Assembles f_0000.png... (from capture.js "fps:N" mode) into an animated GIF preview.
import sys, glob, os
from PIL import Image
d, out, fps = sys.argv[1], sys.argv[2], float(sys.argv[3])
w = int(sys.argv[4]) if len(sys.argv) > 4 else 640
files = sorted(glob.glob(os.path.join(d, 'f_*.png')))
frames = []
for f in files:
    im = Image.open(f).convert('RGB')
    im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    frames.append(im.quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE))
frames[0].save(out, save_all=True, append_images=frames[1:], duration=int(1000 / fps), loop=0, optimize=True)
print('gif', out, len(frames), 'frames', os.path.getsize(out) // 1024, 'KB')
