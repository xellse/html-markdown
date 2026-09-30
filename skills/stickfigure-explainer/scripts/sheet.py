# Usage: python3 sheet.py <framesdir> <out.png> [cols=3] [thumb_width=640]
# Tiles f_*.png (sorted) into one labeled contact sheet so a whole clip can be reviewed in one image.
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
tw = int(sys.argv[4]) if len(sys.argv) > 4 else 640
files = sorted(glob.glob(os.path.join(d, 'f_*.png')))
ims = [Image.open(f).convert('RGB') for f in files]
th = int(ims[0].height * tw / ims[0].width)
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * tw + (cols + 1) * 8, rows * (th + 24) + 8), (60, 60, 60))
dr = ImageDraw.Draw(S)
for k, (f, im) in enumerate(zip(files, ims)):
    x, y = 8 + (k % cols) * (tw + 8), 8 + (k // cols) * (th + 24)
    S.paste(im.resize((tw, th)), (x, y + 18))
    dr.text((x, y + 2), os.path.basename(f), fill=(255, 255, 255))
S.save(out)
print('sheet', out, len(ims), 'frames')
