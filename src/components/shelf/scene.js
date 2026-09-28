// Named imports only: a namespace import would defeat tree-shaking and drag the
// whole of three into the lazy chunk.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BoxGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshDepthMaterial, ShadowMaterial, HemisphereLight, DirectionalLight,
  CanvasTexture, Color, SRGBColorSpace, Raycaster, Vector2, Vector3, DoubleSide,
  RGBADepthPacking
} from 'three';
import { drawSpine, drawFront, drawPage } from './covers.js';
import { applyBend, makeBendUniforms } from './bend.js';
import {
  BOOK_W, BOOK_H, BOOK_D, BOARD_T, COVER_HINGE, SPINE_Z, LEAF_COUNT, LEAF_W, LEAF_H,
  FRONT_X, PULL_Z, READ, OPEN_MS, CLOSE_MS, LEAN_MS, LEAN_FILL, CAMERA, PLANK_H,
  openState, closeState, leafHingeX, bookcase, readPose
} from './book.js';
import { EASE_MOVE } from './easing.js';

// A tap, not a drag: on a phone a scroll that starts on the canvas must not pull
// a book off the shelf.
const TAP_SLOP_PX = 8;
const TAP_MS = 500;

// Switching views is a choice the visitor makes, so the shelf is still offered
// where motion is reduced. What goes is the animation: every sequence lands on
// its final pose in one step.
export function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

function matte(options = {}) {
  // Paper is matte. One specular highlight and it turns to plastic.
  return new MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...options });
}

function textureFrom(canvas) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createScene(canvas, { posts, palette }) {
  const still = prefersReducedMotion();

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;

  // Transparent: the page shows through, so the shelf sits on the paper rather
  // than in a box of its own.
  const scene = new Scene();

  // A long focal length. A wide fov is what makes a three.js scene read as a
  // game; this should read as photographed, from a little above.
  // One shelf or several: the layout decides where every book rests and how far
  // back the camera stands (see bookcase() in book.js).
  const layout = bookcase(posts.length);
  const camera = new PerspectiveCamera(CAMERA.fov, 1, 0.1, 100);
  camera.position.set(layout.camera.x, layout.camera.y, layout.camera.z);
  camera.lookAt(layout.target.x, layout.target.y, layout.target.z);

  // three's lights are in physical units (r155+): a matte surface returns
  // albedo * irradiance / PI, so it takes roughly PI of light to render paper as
  // paper. The first version used legacy-sized intensities and drew everything
  // at about a third of its colour - grey. Measured with these: an open page
  // renders at its drawn colour, spines a shade below it, like books under a lamp.
  const sky = new HemisphereLight(0xffffff, 0xffffff, 2.8);
  const key = new DirectionalLight(0xffffff, 1.1);
  // Near-overhead, aimed at the middle of the case and stepping back with the
  // camera. With one shelf this is exactly the light the scene always had.
  key.position.set(-0.8 * layout.scale, layout.centreY + 7 * layout.scale, 2.2 * layout.scale);
  key.target.position.set(0, layout.centreY, 0);
  scene.add(key.target);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.01;
  // The light looks almost straight down, so a taller case adds depth to its
  // view, not width: only `far` grows. Widening the bounds would spread the same
  // shadow map thinner and step the shadow edges.
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 16 * layout.scale });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(sky, key);

  // The page is the floor: an invisible plane that shows only the shadows that
  // fall on it, so the books stand on the paper instead of on a grey slab.
  // With several shelves, only the floor under the bottom one takes shadows: a
  // book held up by the top shelf would otherwise throw a stray patch far below.
  const groundGeometry = new PlaneGeometry(40, layout.rows > 1 ? 2.4 : 40);
  const groundMaterial = new ShadowMaterial({ opacity: 0.08 });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -BOOK_H / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const shelf = new Group();
  scene.add(shelf);

  // Shared by every book: page edges and back boards, the ruled page, and the
  // inside of the cover.
  const paper = matte();
  const page = matte();
  const endpaper = matte();

  const bookGeometry = new BoxGeometry(BOOK_W, BOOK_H, BOOK_D);
  const books = posts.map((post, i) => {
    const spine = matte();
    // Face order is +x, -x, +y, -y, +z, -z: front cover, back cover, head, tail,
    // spine, fore-edge.
    const mesh = new Mesh(bookGeometry, [paper, paper, paper, paper, spine, paper]);
    const rest = layout.rest(i);
    mesh.position.set(rest.x, rest.y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { post, index: i, spine };
    shelf.add(mesh);
    return mesh;
  });

  // The bottom shelf stands on the page itself; every shelf above it stands on a
  // thin plank, one book-depth deep and a little wider than its row.
  const plank = matte();
  const plankGeometries = [];
  for (let row = 0; row < layout.rows - 1; row += 1) {
    const onRow = books.filter((mesh) => layout.rest(mesh.userData.index).row === row);
    const xs = onRow.map((mesh) => mesh.position.x);
    const width = Math.max(...xs) - Math.min(...xs) + BOOK_W + 0.24;
    const geometry = new BoxGeometry(width, PLANK_H, BOOK_D + 0.12);
    plankGeometries.push(geometry);
    const plankMesh = new Mesh(geometry, plank);
    plankMesh.position.set((Math.max(...xs) + Math.min(...xs)) / 2, onRow[0].position.y - BOOK_H / 2 - PLANK_H / 2, 0);
    plankMesh.castShadow = true;
    plankMesh.receiveShadow = true;
    shelf.add(plankMesh);
  }

  /* ---- The opening rig, lent to whichever book is off the shelf --------------
     Built in the book's own frame (see book.js): a front board hinged on the
     spine edge, and leaves that bend as they turn. */
  const boardGeometry = new BoxGeometry(BOARD_T, BOOK_H, BOOK_D);
  const board = new Mesh(boardGeometry, [paper, endpaper, paper, paper, paper, paper]);
  board.position.set(BOARD_T / 2, 0, -BOOK_D / 2);
  board.castShadow = true;
  board.receiveShadow = true;
  const coverHinge = new Group();
  coverHinge.position.set(COVER_HINGE.x, 0, COVER_HINGE.z);
  coverHinge.add(board);

  const leafGeometry = new PlaneGeometry(LEAF_W, LEAF_H, 32, 1);
  const leaves = Array.from({ length: LEAF_COUNT }, () => {
    const uniforms = makeBendUniforms(LEAF_W);
    const material = matte({ side: DoubleSide });
    applyBend(material, uniforms);
    // The shadow has to come from the bent, turning leaf too, not a flat one.
    const depth = new MeshDepthMaterial({ depthPacking: RGBADepthPacking, side: DoubleSide });
    applyBend(depth, uniforms, { shade: false });
    const mesh = new Mesh(leafGeometry, material);
    mesh.customDepthMaterial = depth;
    mesh.position.x = LEAF_W / 2; // hinge at the holder's origin
    mesh.castShadow = true;
    const holder = new Group();
    holder.rotation.y = Math.PI / 2; // leaf face -> book +x, spine-to-edge -> book -z
    holder.position.z = SPINE_Z;
    holder.add(mesh);
    return { holder, uniforms, material, depth };
  });

  let currentPalette = palette;
  let cardBeside = true;
  let out = -1; // the book off the shelf, or -1
  let frontMaterial = null;
  let animating = false;
  let dirty = true;
  let frame = 0;
  const invalidate = () => {
    dirty = true;
  };

  function lend(index) {
    const mesh = books[index];
    frontMaterial = matte({ map: textureFrom(drawFront(mesh.userData.post, currentPalette)) });
    board.material[0] = frontMaterial;
    mesh.material[0] = page; // what the cover will reveal
    mesh.add(coverHinge);
    leaves.forEach((leaf) => mesh.add(leaf.holder));
    out = index;
  }

  function reclaim() {
    if (out < 0) return;
    const mesh = books[out];
    mesh.remove(coverHinge);
    leaves.forEach((leaf) => mesh.remove(leaf.holder));
    mesh.material[0] = paper;
    board.material[0] = paper;
    if (frontMaterial) {
      frontMaterial.map.dispose();
      frontMaterial.dispose();
      frontMaterial = null;
    }
    const rest = layout.rest(out);
    mesh.position.set(rest.x, rest.y, 0);
    mesh.rotation.set(0, 0, 0);
    out = -1;
    invalidate();
  }

  const pulled = new Vector3();
  const reading = new Vector3();

  function pose(s) {
    const mesh = books[out];
    const rest = layout.rest(out);
    const read = readPose(cardBeside, layout, out);
    pulled.set(rest.x, rest.y, PULL_Z * s.pull);
    reading.set(read.x, read.y, read.z);
    mesh.position.lerpVectors(pulled, reading, s.present);
    // Yaw first to show the cover, then tip back like a book on a lectern.
    mesh.rotation.set(READ.tilt * s.present, (-Math.PI / 2) * s.present, 0);
    coverHinge.rotation.y = -Math.PI * s.cover;
    leaves.forEach((leaf, i) => {
      leaf.uniforms.uTurn.value = s.leaves[i];
      leaf.holder.position.x = leafHingeX(i, s.leaves[i]);
    });
    invalidate();
  }

  function run(total, frameAt) {
    if (still) {
      frameAt(total);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const started = performance.now();
      function step(now) {
        const ms = Math.min(total, now - started);
        frameAt(ms);
        if (ms < total) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }

  function play(total, stateAt) {
    return run(total, (ms) => pose(stateAt(ms)));
  }

  async function open(index) {
    if (animating || out >= 0) return;
    animating = true;
    try {
      lend(index);
      await play(OPEN_MS, openState);
    } finally {
      // A throw mid-sequence must not leave the shelf inert.
      animating = false;
    }
  }

  async function close() {
    if (animating || out < 0) return;
    animating = true;
    try {
      await play(CLOSE_MS, closeState);
    } finally {
      reclaim();
      animating = false;
    }
  }

  // The reader leans in over the open book until its right-hand page fills the
  // frame. Only the camera moves; the component navigates once this resolves.
  const restCamera = { position: camera.position.clone(), quaternion: camera.quaternion.clone() };

  function leanTarget() {
    const mesh = books[out];
    mesh.updateMatrixWorld(true);
    // The right-hand page is the page block's front face, square to its normal.
    const centre = new Vector3(FRONT_X, 0, 0).applyMatrix4(mesh.matrixWorld);
    const normal = new Vector3(1, 0, 0).transformDirection(mesh.matrixWorld);
    const up = new Vector3(0, 1, 0).transformDirection(mesh.matrixWorld);
    // Cover, not contain: on a wide canvas a portrait page that merely fits the
    // height sits in the frame like a picture. Leaning in means the page takes
    // the frame edge to edge, the way the review's own sheet takes the screen.
    const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
    const byHeight = BOOK_H / 2 / LEAN_FILL / tanHalf;
    const byWidth = BOOK_D / 2 / LEAN_FILL / (tanHalf * camera.aspect);
    const distance = Math.min(byHeight, byWidth);
    const target = camera.clone();
    target.position.copy(centre).addScaledVector(normal, distance);
    target.up.copy(up);
    target.lookAt(centre);
    return target;
  }

  function leanPose(k, target) {
    const e = EASE_MOVE(k);
    camera.position.lerpVectors(restCamera.position, target.position, e);
    camera.quaternion.slerpQuaternions(restCamera.quaternion, target.quaternion, e);
    invalidate();
  }

  async function leanIn() {
    if (animating || out < 0) return;
    animating = true;
    try {
      const target = leanTarget();
      await run(LEAN_MS, (ms) => leanPose(ms / LEAN_MS, target));
    } finally {
      animating = false;
    }
  }

  // Where book `index` will lie once open, in canvas CSS pixels - the card is
  // placed against this, so on a tall case it appears beside the book.
  const probe = new Group();
  function readingRect(index) {
    const read = readPose(cardBeside, layout, index);
    probe.position.set(read.x, read.y, read.z);
    probe.rotation.set(READ.tilt, -Math.PI / 2, 0);
    probe.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const xs = [];
    const ys = [];
    for (const z of [-BOOK_D / 2, SPINE_Z + BOOK_D]) {
      for (const y of [-BOOK_H / 2, BOOK_H / 2]) {
        const q = new Vector3(FRONT_X, y, z).applyMatrix4(probe.matrixWorld).project(camera);
        xs.push(((q.x + 1) / 2) * w);
        ys.push(((1 - q.y) / 2) * h);
      }
    }
    return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
  }

  /* ---- Picking -------------------------------------------------------------- */
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const pickListeners = new Set();
  let press = null;

  function indexAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    raycaster.setFromCamera(ndc, camera);
    // Recursive, so the opened board and leaves count as their book.
    const hit = raycaster.intersectObjects(books, true)[0];
    let node = hit ? hit.object : null;
    while (node && node.userData.index === undefined) node = node.parent;
    return node ? node.userData.index : -1;
  }

  function onDown(event) {
    if (!event.isPrimary) return;
    press = { x: event.clientX, y: event.clientY, t: performance.now() };
  }

  function onUp(event) {
    const p = press;
    press = null;
    if (!p || !event.isPrimary || animating) return;
    const moved = Math.hypot(event.clientX - p.x, event.clientY - p.y);
    if (moved > TAP_SLOP_PX || performance.now() - p.t > TAP_MS) return;
    const index = indexAt(event.clientX, event.clientY);
    if (index >= 0) pickListeners.forEach((cb) => cb(index));
  }

  function onCancel() {
    press = null;
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);

  /* ---- Palette, size, loop --------------------------------------------------- */
  function setPalette(next) {
    currentPalette = next;
    sky.groundColor = new Color(next.shade);
    paper.color = new Color(next.surface);
    endpaper.color = new Color(next.surface);
    plank.color = new Color(next.shade);

    const oldPage = page.map;
    const pageTexture = textureFrom(drawPage(next));
    [page, ...leaves.map((leaf) => leaf.material)].forEach((material) => {
      material.map = pageTexture;
      material.needsUpdate = true;
    });
    if (oldPage) oldPage.dispose();

    books.forEach((mesh) => {
      const spine = mesh.userData.spine;
      const old = spine.map;
      spine.map = textureFrom(drawSpine(mesh.userData.post, next));
      spine.needsUpdate = true;
      if (old) old.dispose();
    });

    // The open book's cover is the one texture drawn lazily; it follows too.
    if (frontMaterial && out >= 0) {
      const old = frontMaterial.map;
      frontMaterial.map = textureFrom(drawFront(books[out].userData.post, next));
      frontMaterial.needsUpdate = true;
      old.dispose();
    }
    invalidate();
  }

  function resize(w, h) {
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    invalidate();
  }

  // With the card overlaid on the right, an open book reads to the left of it.
  function setLayout(next) {
    if (next.cardBeside === cardBeside) return;
    cardBeside = next.cardBeside;
    if (out >= 0 && !animating) pose(openState(OPEN_MS));
  }

  // Nothing moves at rest, so only draw when something changed.
  const firstFrame = new Set();
  function tick() {
    frame = requestAnimationFrame(tick);
    if (!dirty) return;
    dirty = false;
    renderer.render(scene, camera);
    if (firstFrame.size) {
      firstFrame.forEach((cb) => cb());
      firstFrame.clear();
    }
  }

  setPalette(palette);

  return {
    open,
    close,
    leanIn,
    // Resolves once the shelf has actually been drawn, so the page can wait for
    // it before fading across rather than reveal an empty canvas.
    drawn: () => new Promise((resolve) => firstFrame.add(resolve)),
    busy: () => animating,
    openIndex: () => out,
    shelves: layout.rows,
    readingRect,
    onPick(cb) {
      pickListeners.add(cb);
      return () => pickListeners.delete(cb);
    },
    setPalette,
    resize,
    setLayout,
    start() {
      if (!frame) tick();
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
    // Dev-only probes: freeze the sequence at one moment, and read back what was
    // drawn, so the choreography can be checked frame by frame.
    debug: {
      scrub(index, phase, ms) {
        if (out !== index) {
          reclaim();
          lend(index);
        }
        pose(phase === 'close' ? closeState(ms) : openState(ms));
      },
      // Which book a click at these client coordinates would pick, or -1.
      pickAt: (x, y) => indexAt(x, y),
      // Freeze the lean-in at k in [0, 1] over the open book (open one first).
      lean(k) {
        if (out >= 0) leanPose(k, leanTarget());
      },
      reset() {
        camera.position.copy(restCamera.position);
        camera.quaternion.copy(restCamera.quaternion);
        reclaim();
      },
      coverAccentSample() {
        if (!frontMaterial) return null;
        const img = frontMaterial.map.image;
        const ctx = img.getContext('2d');
        const [r, g, b] = ctx.getImageData(img.width / 2, Math.round(img.height * 0.16) + 5, 1, 1).data;
        return `${r},${g},${b}`;
      },
      timings: { open: OPEN_MS, close: CLOSE_MS, lean: LEAN_MS }
    },
    dispose() {
      cancelAnimationFrame(frame);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      pickListeners.clear();
      reclaim();
      [bookGeometry, boardGeometry, leafGeometry, groundGeometry, ...plankGeometries].forEach((g) => g.dispose());
      [paper, endpaper, plank, groundMaterial].forEach((m) => m.dispose());
      if (page.map) page.map.dispose();
      page.dispose();
      leaves.forEach((leaf) => {
        leaf.material.dispose();
        leaf.depth.dispose();
      });
      books.forEach((mesh) => {
        const spine = mesh.userData.spine;
        if (spine.map) spine.map.dispose();
        spine.dispose();
      });
      key.shadow.dispose();
      renderer.dispose();
      // dispose() alone leaves the context alive until GC; toggling views would
      // otherwise pile them up toward the browser's cap.
      renderer.forceContextLoss();
    }
  };
}
