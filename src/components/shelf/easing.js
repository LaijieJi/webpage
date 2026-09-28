// Ported from the CSS page turn in BlogIndexView.vue so the 3D and the paper view
// share one motion signature. Both must move like the same hand or they will not
// read as the same object.
//
//   forward  cubic-bezier(0.42, 0.05, 0.4, 1)   lj-turn-out
//   back     cubic-bezier(0.22, 0.61, 0.3, 1)   lj-turn-in
export const TURN_MS = 700;

// Newton-Raphson on the x component, then read y off the curve.
function bezier(p1x, p1y, p2x, p2y) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    return ((ay * t + by) * t + cy) * t;
  };
}

export const TURN_FWD = bezier(0.42, 0.05, 0.4, 1);
export const TURN_BACK = bezier(0.22, 0.61, 0.3, 1);

// For carrying the book itself - off the shelf and back - rather than turning a
// page: a plain ease-in-out, so it leaves gently and arrives gently.
export const EASE_MOVE = bezier(0.45, 0.05, 0.25, 1);
