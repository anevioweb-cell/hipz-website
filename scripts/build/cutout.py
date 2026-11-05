"""Cut out the owner's white-background bottle renders with rembg (isnet-general-use).
Pure background removal: nothing is repainted or re-lettered.

rembg alone treats the WHITE logo and the white label panels as background (they touch nothing but
white), punching holes through the brand mark. So the alpha mask is post-processed: every transparent
region fully enclosed by the bottle silhouette is filled (made opaque again) and the ORIGINAL pixels are
kept. Only the outer background is removed.

Run with the venv that has rembg installed:  <venv>/bin/python -I scripts/build/cutout.py
Writes lossless PNG masters to docs/inputs/cutouts/ (gitignored)."""
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage

root = Path(__file__).resolve().parent.parent
src = root / 'docs' / 'inputs'
out = src / 'cutouts'
out.mkdir(exist_ok=True)
session = new_session('isnet-general-use')

for name in ['lemon-white', 'peach-white']:
    original = Image.open(src / f'{name}.jpeg').convert('RGB')
    cut = remove(original, session=session)
    alpha = np.asarray(cut.getchannel('A')).astype(np.uint8)
    solid = alpha > 24
    # keep the largest connected silhouette (drops stray specks), then fill its interior holes
    labels, n = ndimage.label(solid)
    if n > 1:
        sizes = ndimage.sum(solid, labels, range(1, n + 1))
        solid = labels == (int(np.argmax(sizes)) + 1)
    # close small gaps along the edge first (white label panels / logo can touch the silhouette edge),
    # then fill every enclosed region
    closed = ndimage.binary_closing(solid, structure=np.ones((25, 25)), iterations=1)
    filled = ndimage.binary_fill_holes(closed)
    ys = np.where(filled.any(axis=1))[0]
    top, bottom = ys.min(), ys.max()
    # the filled liquid body (below the clear neck/cap, ~22 % of the height) is opaque in reality:
    # make its interior fully opaque; keep rembg's soft alpha for the clear neck and the outer edge
    body = np.zeros_like(filled)
    body[int(top + 0.22 * (bottom - top)) :, :] = True
    interior = ndimage.binary_erosion(filled, iterations=6) & body
    holes = (interior | (ndimage.binary_fill_holes(solid) & ~solid)) & (alpha < 250)
    new_alpha = np.where(interior, 255, np.where(filled, alpha, 0))
    new_alpha = np.maximum(new_alpha, np.where(holes, 255, 0)).astype(np.uint8)
    # soften only the outer edge by 1 px (anti-aliasing), never the interior
    edge = ndimage.binary_dilation(filled) & ~ndimage.binary_erosion(filled)
    blurred = ndimage.uniform_filter(new_alpha.astype(np.float32), size=3).astype(np.uint8)
    new_alpha = np.where(edge, blurred, new_alpha)
    # de-fringe: semi-transparent pixels were blended with the WHITE studio background; remove that
    # white contribution (un-premultiply against white) so no light halo shows on dark backgrounds
    rgb = np.asarray(original).astype(np.float32)
    a = (new_alpha.astype(np.float32) / 255.0)[..., None]
    semi = (a > 0.02) & (a < 0.999)
    clean = np.clip((rgb - (1.0 - a) * 255.0) / np.maximum(a, 0.02), 0, 255)
    rgb = np.where(semi, clean, rgb).astype(np.uint8)
    rgba = np.dstack([rgb, new_alpha])
    img = Image.fromarray(rgba, 'RGBA')
    bbox = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    img = img.crop(bbox)
    dest = out / f'{name.split("-")[0]}-bottle.png'
    img.save(dest)
    print(dest.name, img.size, 'holes filled px:', int(holes.sum()))
