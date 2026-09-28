// Covers are generated, never sourced: no cover art in the repo, no licensing
// question, and fifteen volumes that look like one small-press series.

const TINT_STEPS = 12;
const PI = Math.PI;

// FNV-1a. Deterministic on purpose - the same title must give the same colour on
// every reload, so the shelf is a stable object rather than a slot machine.
export function coverTint(title) {
  let h = 2166136261;
  for (let i = 0; i < title.length; i += 1) {
    h ^= title.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % TINT_STEPS;
}

// a-miata-of-my-own.md has no `book` and no `bookAuthor` - it is the garage
// entry. One fallback, used by every drawing path.
export function labelFor(post) {
  const fm = post.frontmatter;
  return {
    title: fm.book || fm.title || post.slug,
    author: fm.bookAuthor || ''
  };
}

// display=swap means the faces arrive late. Drawing before they land silently
// falls back to Georgia, which shows up only sometimes - the worst failure mode
// available. Always await this first.
export async function ensureFonts() {
  if (!document.fonts || !document.fonts.load) return;
  await Promise.all([
    document.fonts.load('600 48px Newsreader'),
    document.fonts.load('500 24px "Spline Sans Mono"')
  ]);
  await document.fonts.ready;
}

function surfaceFor(post, palette) {
  const step = coverTint(labelFor(post).title);
  // A narrow wash across the paper tone; never enough to leave the palette.
  const alpha = (step / TINT_STEPS) * 0.1;
  return { base: palette.surface, wash: `rgba(0, 0, 0, ${alpha.toFixed(3)})` };
}

function accentFor(post, palette) {
  return post.frontmatter.variant === 'garage' ? palette.garage : palette.accent;
}

function makeCanvas(width, height) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  return el;
}

// rule · dot · rule, lifted from cover__ornament in BlogIndexView. This is the
// detail that stitches the 3D back to the 2D.
function ornament(ctx, cx, y, span, colour) {
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - span, y);
  ctx.lineTo(cx - 7, y);
  ctx.moveTo(cx + 7, y);
  ctx.lineTo(cx + span, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, y, 2.2, 0, PI * 2);
  ctx.fill();
}

function wrap(ctx, text, cx, top, maxWidth, lineHeight) {
  const words = String(text).split(/\s+/);
  let line = '';
  let y = top;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, cx, y);
      line = word;
      y += lineHeight;
    } else {
      line = next;
    }
  }
  if (line) ctx.fillText(line, cx, y);
}

// The inside of the book: ruled like the journal's own sheet, with the margin in
// the steel blue and the ornament at the foot. No words - the words are HTML.
// u = 0 is the spine side, so the margin sits by the spine on a right-hand page
// and mirrors to the outer edge on the back of a turned leaf, as a real verso does.
export function drawPage(palette, { width = 512, height = 768 } = {}) {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = palette.surface;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = palette.ink;
  ctx.globalAlpha = 0.1;
  ctx.lineWidth = 1.5;
  for (let y = height * 0.14; y < height * 0.88; y += height * 0.036) {
    ctx.beginPath();
    ctx.moveTo(width * 0.06, y);
    ctx.lineTo(width * 0.94, y);
    ctx.stroke();
  }

  ctx.strokeStyle = palette.accent2;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(width * 0.13, height * 0.06);
  ctx.lineTo(width * 0.13, height * 0.94);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ornament(ctx, width / 2, height * 0.93, 48, palette.faint);

  return canvas;
}

export function drawSpine(post, palette, { width = 128, height = 768 } = {}) {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const { base, wash } = surfaceFor(post, palette);
  const { title, author } = labelFor(post);
  const accent = accentFor(post, palette);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // Accent band near the head of the spine.
  ctx.fillStyle = accent;
  ctx.fillRect(0, height * 0.1, width, 34);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = palette.ink;
  ctx.font = '600 40px Newsreader, Georgia, serif';
  ctx.fillText(title, 0, -12, height * 0.72);
  if (author) {
    ctx.font = '500 20px "Spline Sans Mono", monospace';
    ctx.fillStyle = palette.faint;
    ctx.fillText(author.toUpperCase(), 0, 24, height * 0.6);
  }
  ctx.restore();

  return canvas;
}

export function drawFront(post, palette, { width = 512, height = 768 } = {}) {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const { base, wash } = surfaceFor(post, palette);
  const { title, author } = labelFor(post);
  const accent = accentFor(post, palette);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = accent;
  ctx.fillRect(0, height * 0.16, width, 10);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = palette.ink;
  ctx.font = '600 54px Newsreader, Georgia, serif';
  wrap(ctx, title, width / 2, height * 0.34, width - 96, 62);

  ornament(ctx, width / 2, height * 0.6, 90, palette.faint);

  if (author) {
    ctx.font = '500 22px "Spline Sans Mono", monospace';
    ctx.fillStyle = palette.faint;
    ctx.fillText(author.toUpperCase(), width / 2, height * 0.68);
  }

  return canvas;
}
