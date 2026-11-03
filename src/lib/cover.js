// Where does a point/box of an object-fit: cover image land inside its container?
// iw/ih = image size, W/H = container size, pos = object-position fractions {x,y} (0..1),
// box = {x,y,w,h} fractions of the image. Returns the box in container pixels.
export function coverBox({ W, H, iw, ih, pos, box }) {
  const scale = Math.max(W / iw, H / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const ox = (W - dw) * pos.x;
  const oy = (H - dh) * pos.y;
  return {
    left: ox + box.x * dw,
    top: oy + box.y * dh,
    width: box.w * dw,
    height: box.h * dh,
  };
}
