// The book's anatomy - where each part sits - and its choreography: the whole
// opening and closing as a pure function of time. Nothing here touches three.js
// or the DOM, so all of it can be checked in node without a GPU.
import { TURN_MS, TURN_FWD, TURN_BACK, EASE_MOVE } from './easing.js';

// Each book is a slab standing on edge. In its own frame the covers are the
// +/-x faces, the spine is the +z face and the fore-edge is -z.
export const BOOK_W = 0.22;
export const BOOK_H = 1.5;
export const BOOK_D = 1.0;
export const GAP = 0.04;
export const FRONT_X = BOOK_W / 2;
export const SPINE_Z = BOOK_D / 2;

// The front board hinges on the spine edge, lifted just clear of the page block
// so the leaves have somewhere to lie beneath it.
export const BOARD_T = 0.012;
export const BOARD_LIFT = 0.006;
export const COVER_HINGE = { x: FRONT_X + BOARD_LIFT, z: SPINE_Z };

export const LEAF_COUNT = 2;
export const LEAF_W = BOOK_D * 0.96;
export const LEAF_H = BOOK_H * 0.96;
const LEAF_GAP = 0.0015;

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

// Leaf 0 lies on the page block, the last one just under the board. A plane
// turned half a circle about a hinge lying in it stays in its own plane, so a
// leaf could never land on top of the opened cover - it would sink into it. Its
// hinge rises while the leaf is in the air instead: under the board at rest,
// above it on landing. At mid-turn a shift of a few thousandths is invisible.
export function leafRestX(i) {
  return FRONT_X + LEAF_GAP * (i + 1);
}

export function leafLandX(i) {
  return FRONT_X + BOARD_LIFT + LEAF_GAP * (LEAF_COUNT - i);
}

export function leafHingeX(i, t) {
  return leafRestX(i) + (leafLandX(i) - leafRestX(i)) * smoothstep(0.25, 0.75, t);
}

export function restX(index, count) {
  const span = count * (BOOK_W + GAP) - GAP;
  return -span / 2 + index * (BOOK_W + GAP) + BOOK_W / 2;
}

// ---- The bookcase --------------------------------------------------------------
// One shelf holds up to this many. Past that the case grows another shelf and
// the books are shared out evenly, so no shelf is left holding a single volume.
// Newest first: the top shelf, left to right.
export const MAX_PER_SHELF = 15;
export const PLANK_H = 0.05;
export const ROW_PITCH = BOOK_H + 0.35; // a book, the plank above it, headroom

// The rest camera for a single shelf; taller cases scale its distance.
export const CAMERA = { fov: 24, target: { y: 0.05, z: 0.4 }, offset: { y: 0.85, z: 7.2 } };
const FRAME_H = 2 * Math.hypot(CAMERA.offset.y, CAMERA.offset.z) * Math.tan((CAMERA.fov * Math.PI) / 360);

// Each extra shelf makes the canvas taller by exactly one row, and the camera
// steps back by the same factor - so a book is the same size on screen whether
// the case holds fifteen or sixty. Widening the fov instead would bend the top
// and bottom shelves.
export function bookcase(count) {
  const rows = Math.max(1, Math.ceil(count / MAX_PER_SHELF));
  // Share the books out evenly: the top `extra` shelves take one more than the
  // rest, so 31 goes 11/10/10 rather than 11/11/9.
  const base = Math.floor(count / rows);
  const extra = count % rows;
  const perRow = base + (extra ? 1 : 0);
  const scale = 1 + ((rows - 1) * ROW_PITCH) / FRAME_H;
  const centreY = ((rows - 1) * ROW_PITCH) / 2;
  const rest = (i) => {
    const long = extra * (base + 1);
    const row = i < long ? Math.floor(i / (base + 1)) : extra + Math.floor((i - long) / base); // 0 = top shelf
    const start = row * base + Math.min(row, extra);
    const onThisShelf = base + (row < extra ? 1 : 0);
    return { x: restX(i - start, onThisShelf), y: (rows - 1 - row) * ROW_PITCH, row };
  };
  const target = { x: 0, y: CAMERA.target.y + centreY, z: CAMERA.target.z };
  const camera = {
    x: 0,
    y: target.y + CAMERA.offset.y * scale,
    z: target.z + CAMERA.offset.z * scale
  };
  return { rows, perRow, scale, centreY, rest, target, camera };
}

// Where the book is held to be read. It is pulled straight out first, so it
// clears its neighbours before it turns.
export const PULL_Z = 1.15;
export const READ = { y: 0.02, z: 1.6, tilt: -0.25 };

// Open, the spread runs from one page-width left of the spine to the fore-edge,
// so its centre sits half a book-depth left of the book's origin. With the card
// overlaid on the right of the canvas the spread moves left to stay clear of it.
export function readX(cardBeside) {
  return cardBeside ? -0.19 : 0.5;
}

// An open book is held at the height of the shelf it came from, not the middle
// of the case - on a tall case the middle can be a screen away from where the
// reader was looking. It sits nearer the camera than the shelf does, so it
// follows the shelf's height by the ratio of the two depths, which keeps it level
// with its own gap on screen.
const ROW_FOLLOW = 1 - (READ.z - CAMERA.target.z) / CAMERA.offset.z;

// The reading pose, measured from the camera's target. Only its depth scales with
// the case: the camera steps back by `scale` and the book steps back with it, so
// it stays the same size on screen. Across and up it does not - the canvas only
// grows taller, so at that depth a world unit is still the same number of pixels
// from the centre. With a single shelf this is exactly the fixed pose the scene
// has always used.
export function readPose(cardBeside, layout, index) {
  const rowY = index === undefined ? layout.centreY : layout.rest(index).y;
  return {
    x: layout.target.x + readX(cardBeside),
    y: layout.target.y + (READ.y - CAMERA.target.y) + (rowY - layout.centreY) * ROW_FOLLOW,
    z: layout.target.z + (READ.z - CAMERA.target.z) * layout.scale
  };
}

// ---- Choreography ------------------------------------------------------------
// Page turns keep the paper view's 700ms and its curves; the book itself moves
// on a plain ease-in-out.
const STAGGER = 160;
const OPEN = { pull: [0, 380], present: [260, 900], cover: 860, leaves: 1120 };
const CLOSE = { leaves: 0, cover: STAGGER * LEAF_COUNT, present: [820, 1400], pull: [1250, 1600] };

export const OPEN_MS = OPEN.leaves + STAGGER * (LEAF_COUNT - 1) + TURN_MS;
export const CLOSE_MS = CLOSE.pull[1];

// "read this": the reader leans in until the right-hand page covers the frame,
// then the review itself takes over. The page spans this much of the frame along
// whichever side it meets first - the width, on the site's wide canvas. A touch
// past the edges, so no neighbouring spine peeks in beside the page.
export const LEAN_MS = 900;
export const LEAN_FILL = 1.03;

function seg(ms, start, end) {
  return clamp01((ms - start) / (end - start));
}

// Every value runs 0 (on the shelf) to 1 (open and still).
export function openState(ms) {
  const leaves = [];
  for (let i = 0; i < LEAF_COUNT; i += 1) {
    // The top leaf, nearest the cover, follows the cover over first.
    const start = OPEN.leaves + STAGGER * (LEAF_COUNT - 1 - i);
    leaves.push(TURN_FWD(seg(ms, start, start + TURN_MS)));
  }
  return {
    pull: EASE_MOVE(seg(ms, OPEN.pull[0], OPEN.pull[1])),
    present: EASE_MOVE(seg(ms, OPEN.present[0], OPEN.present[1])),
    cover: TURN_FWD(seg(ms, OPEN.cover, OPEN.cover + TURN_MS)),
    leaves
  };
}

export function closeState(ms) {
  const leaves = [];
  for (let i = 0; i < LEAF_COUNT; i += 1) {
    // The last leaf turned lies on top of the left-hand stack, so it goes back first.
    const start = CLOSE.leaves + STAGGER * i;
    leaves.push(1 - TURN_BACK(seg(ms, start, start + TURN_MS)));
  }
  return {
    leaves,
    cover: 1 - TURN_BACK(seg(ms, CLOSE.cover, CLOSE.cover + TURN_MS)),
    present: 1 - EASE_MOVE(seg(ms, CLOSE.present[0], CLOSE.present[1])),
    pull: 1 - EASE_MOVE(seg(ms, CLOSE.pull[0], CLOSE.pull[1]))
  };
}
