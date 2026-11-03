import { describe, expect, it } from 'vitest';
import { coverBox } from './cover.js';

describe('coverBox', () => {
  it('maps a box when the image exactly fits', () => {
    const b = coverBox({
      W: 200,
      H: 100,
      iw: 2000,
      ih: 1000,
      pos: { x: 0.5, y: 0.5 },
      box: { x: 0.5, y: 0.1, w: 0.2, h: 0.8 },
    });
    expect(b).toEqual({ left: 100, top: 10, width: 40, height: 80 });
  });
  it('shifts with object-position when the image is cropped horizontally', () => {
    // image 4:1 into a 2:1 container → scaled to height, 50 % of width hidden
    const b = coverBox({
      W: 200,
      H: 100,
      iw: 400,
      ih: 100,
      pos: { x: 1, y: 0.5 },
      box: { x: 0.5, y: 0, w: 0.25, h: 1 },
    });
    expect(b.left).toBe(0); // dw=400, ox=-200, left = -200 + 0.5*400
    expect(b.width).toBe(100);
  });
});
