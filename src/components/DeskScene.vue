<template>
  <!-- The landing page's desk: a few things lying around the card, and the light
       from a window falling across it as the sun over Valencia moves (see
       composables/useDeskLight.js). Purely decorative. -->
  <div class="desk" :class="{ 'desk--lit': lit, 'desk--dark': theme === 'dark' }" :style="light" aria-hidden="true">
    <!-- things on the desk, drawn from above; they scroll away with the card -->
    <div class="desk__things">
      <!-- a plant -->
      <svg class="thing thing--plant" viewBox="-170 -170 340 340">
        <circle r="66" fill="#c4bdae" />
        <circle r="56" fill="#4c443c" />
        <g v-for="(leaf, i) in leaves" :key="i" class="leaf" :style="{ '--sway-d': `${leaf.d}s`, '--sway-o': `${leaf.o}s` }">
          <g :transform="`rotate(${leaf.a}) scale(${leaf.s})`">
            <path d="M8 0 C 38 -30, 104 -34, 150 0 C 104 34, 38 30, 8 0 Z" :fill="leaf.c" />
            <path d="M14 0 L 142 0" stroke="rgba(255,255,255,0.22)" stroke-width="2" fill="none" />
          </g>
        </g>
      </svg>

      <!-- the camera, its strap lying in a loop beside it -->
      <svg class="thing thing--camera" viewBox="0 0 360 340">
        <path d="M58 86 C 10 92, 6 200, 70 262 C 140 328, 300 320, 330 230 C 350 168, 334 104, 302 86" fill="none" stroke="#3b342e" stroke-width="11" stroke-linecap="round" />
        <rect x="124" y="128" width="112" height="78" rx="6" fill="#1f2321" />
        <rect x="124" y="148" width="112" height="5" fill="#363b38" />
        <rect x="124" y="166" width="112" height="5" fill="#363b38" />
        <rect x="132" y="196" width="96" height="16" rx="4" fill="#2c312e" />
        <rect x="46" y="76" width="16" height="22" rx="4" fill="#7c7f78" />
        <rect x="298" y="76" width="16" height="22" rx="4" fill="#7c7f78" />
        <rect x="54" y="52" width="252" height="84" rx="16" fill="#a8aaa3" />
        <rect x="54" y="52" width="252" height="84" rx="16" fill="none" stroke="#7c7f78" stroke-width="3" />
        <rect x="160" y="58" width="40" height="30" rx="3" fill="#6c706b" />
        <circle cx="246" cy="94" r="21" fill="#3a3e3c" />
        <circle cx="246" cy="94" r="14" fill="none" stroke="#5a5f5b" stroke-width="3" stroke-dasharray="2 3" />
        <circle cx="278" cy="72" r="7" fill="#3a3e3c" />
        <circle cx="104" cy="94" r="18" fill="#3a3e3c" />
        <circle cx="104" cy="94" r="5" fill="#7c7f78" />
      </svg>

      <!-- a notebook and the pen, a couple of index cards under them -->
      <svg class="thing thing--notes" viewBox="0 0 400 420">
        <g transform="rotate(-9 200 210)">
          <rect x="70" y="40" width="250" height="160" rx="5" fill="#fbfaf3" />
          <rect x="70" y="74" width="250" height="2" fill="rgba(164,22,26,0.5)" />
        </g>
        <g transform="rotate(6 200 210)">
          <rect x="96" y="20" width="250" height="160" rx="5" fill="#f4f1e6" />
          <rect x="96" y="54" width="250" height="2" fill="rgba(164,22,26,0.5)" />
        </g>
        <rect x="70" y="92" width="226" height="296" rx="9" fill="#2b312d" />
        <rect x="292" y="98" width="9" height="284" rx="2" fill="#e6e2d4" />
        <rect x="250" y="92" width="10" height="296" fill="#1b201d" />
        <g transform="rotate(-27 190 250)">
          <rect x="40" y="240" width="300" height="21" rx="10.5" fill="#3a3f3c" />
          <rect x="40" y="240" width="112" height="21" rx="10.5" fill="#2f3431" />
          <rect x="70" y="236" width="74" height="6" rx="3" fill="#c3c5bf" />
          <rect x="318" y="244" width="28" height="13" rx="4" fill="#242826" />
          <path d="M346 246 L 360 250.5 L 346 255 Z" fill="#b9bbb4" />
        </g>
      </svg>

      <!-- two books, the top one with its ribbon out -->
      <svg class="thing thing--books" viewBox="0 0 320 380">
        <g transform="rotate(7 160 190)">
          <rect x="46" y="30" width="224" height="318" rx="6" fill="#3c5560" />
          <rect x="262" y="38" width="10" height="302" fill="#e8e4d6" />
        </g>
        <g transform="rotate(-5 160 190)">
          <path d="M196 330 L 196 372 L 205 362 L 214 372 L 214 330 Z" fill="#a4161a" />
          <rect x="58" y="42" width="204" height="292" rx="6" fill="#74403a" />
          <rect x="255" y="50" width="9" height="276" fill="#ece8da" />
          <rect x="88" y="92" width="144" height="74" rx="3" fill="#efe9da" />
          <rect x="104" y="114" width="112" height="6" rx="3" fill="#74403a" opacity="0.7" />
          <rect x="120" y="132" width="80" height="5" rx="2.5" fill="#74403a" opacity="0.45" />
        </g>
      </svg>

      <!-- a couple of prints -->
      <div class="thing thing--prints">
        <span class="print print--a"><img :src="triesteImg.src" :srcset="triesteImg.webp" sizes="220px" alt="" loading="lazy" decoding="async" /></span>
        <span class="print print--b"><img :src="pragueImg.src" :srcset="pragueImg.webp" sizes="220px" alt="" loading="lazy" decoding="async" /></span>
      </div>

      <!-- the car key, on its ring with a small red tag -->
      <svg class="thing thing--key" viewBox="0 0 220 160">
        <circle cx="70" cy="64" r="26" fill="none" stroke="#a9aba5" stroke-width="5" />
        <g transform="rotate(24 58 88)">
          <rect x="36" y="80" width="40" height="72" rx="12" fill="#a4161a" />
          <rect x="42" y="88" width="28" height="56" rx="8" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2" stroke-dasharray="3 3" />
        </g>
        <rect x="88" y="40" width="112" height="52" rx="22" fill="#232624" transform="rotate(12 144 66)" />
        <circle cx="128" cy="62" r="7" fill="#383c3a" transform="rotate(12 144 66)" />
        <circle cx="152" cy="62" r="7" fill="#383c3a" transform="rotate(12 144 66)" />
        <circle cx="176" cy="62" r="7" fill="#383c3a" transform="rotate(12 144 66)" />
      </svg>
    </div>

    <!-- the room: dimmer at night, a lamp left on -->
    <div class="desk__dusk"></div>
    <div class="desk__light">
      <div class="desk__lamp"></div>
      <div class="desk__sun">
        <div class="desk__window">
          <div class="desk__panes">
            <span v-for="n in 4" :key="n" class="desk__pane"></span>
          </div>
          <div class="desk__branch desk__branch--a">
            <i v-for="(l, i) in branchA" :key="i" :style="l"></i>
          </div>
          <div class="desk__branch desk__branch--b">
            <i v-for="(l, i) in branchB" :key="i" :style="l"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDeskLight } from '../composables/useDeskLight.js';
import { theme } from '../composables/useTheme.js';
import { triesteImg, pragueImg } from '../data/media.js';

const lightVars = useDeskLight();
const lit = ref(false);
// The light is fixed to the viewport - except while the page is still sliding
// in, when its translate makes the page, not the viewport, the frame of
// reference. Bring the light up only once the page has settled.
const SETTLED_MS = 800;
onMounted(() => window.setTimeout(() => { lit.value = true; }, SETTLED_MS));
const light = computed(() => lightVars.value);

// The plant's leaves: angle, size, colour, and their own sway.
const GREENS = ['#5f7d57', '#6f8c65', '#536f4c', '#7b9670'];
const leaves = [0, 38, 79, 118, 160, 197, 238, 279, 320].map((a, i) => ({
  a: a + (i % 2 ? 6 : -4),
  s: [1, 0.86, 1.08, 0.92, 1.02, 0.84, 1.1, 0.9, 0.98][i],
  c: GREENS[i % GREENS.length],
  d: (6 + (i % 4) * 1.3).toFixed(1),
  o: (-i * 0.9).toFixed(1)
}));

// Leaves outside the window: shadows inside the light. A fixed pseudo-random
// scatter, so the page renders the same every time.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
function branch(n, bx, by) {
  return Array.from({ length: n }, () => {
    const w = 38 + rnd() * 46;
    return {
      left: `${(bx + rnd() * 0.32) * 100}%`,
      top: `${(by + rnd() * 0.36) * 100}%`,
      width: `${w}px`,
      height: `${w * 0.45}px`,
      rotate: `${rnd() * 180}deg`,
      opacity: (0.55 + rnd() * 0.45).toFixed(2)
    };
  });
}
const branchA = branch(26, 0.15, 0.08);
const branchB = branch(16, 0.62, 0.5);
</script>

<style scoped>
/* ---- Things on the desk ----------------------------------------------------
   Spread across the full width behind the content column, clipped at the
   viewport's edges, and scrolling away with the card. */
.desk__things {
  position: absolute;
  top: -60px;
  bottom: 0;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  overflow: hidden;
  pointer-events: none;
}

.thing {
  position: absolute;
  display: block;
  overflow: visible;
  /* every object casts its shadow from the same sun (or lamp) */
  filter: drop-shadow(var(--desk-shadow-x, 4px) var(--desk-shadow-y, 6px) var(--desk-shadow-blur, 10px) rgba(28, 30, 22, var(--desk-shadow-alpha, 0.2)));
  transition: filter 2s ease;
}

.thing--plant {
  width: 340px;
  left: calc(50% - 740px);
  top: 70px;
}

.thing--camera {
  width: 290px;
  left: calc(50% + 392px);
  top: 130px;
  rotate: 14deg;
}

.thing--notes {
  width: 380px;
  left: calc(50% - 720px);
  top: 640px;
  rotate: -6deg;
}

/* Further down the page, beside the chapters. */
.thing--books {
  width: 290px;
  left: calc(50% + 450px);
  top: 36%;
  rotate: 9deg;
}

.thing--prints {
  width: 300px;
  height: 300px;
  left: calc(50% - 680px);
  top: 55%;
}

.print {
  position: absolute;
  display: block;
  width: 220px;
  padding: 10px 10px 30px;
  background: #fbfaf3;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.print img {
  display: block;
  width: 100%;
  aspect-ratio: 5 / 4;
  object-fit: cover;
}

.print--a { left: 0; top: 0; rotate: -8deg; }
.print--b { left: 70px; top: 90px; rotate: 6deg; }

.thing--key {
  width: 200px;
  left: calc(50% - 600px);
  top: 84%;
  rotate: -18deg;
}

.leaf {
  animation: lj-leaf var(--sway-d) ease-in-out var(--sway-o) infinite alternate;
}

@keyframes lj-leaf {
  from { rotate: -2.2deg; }
  to { rotate: 2.4deg; }
}

/* ---- The light ---------------------------------------------------------------
   Fixed to the viewport, under the content: the text always stays crisp. A
   soft-light blend - white brightens, 50% grey changes nothing - so the leaves
   outside the window, drawn in grey, become shadows inside the light. */
.desk__light,
.desk__dusk {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.6s ease;
}

.desk--lit .desk__light,
.desk--lit .desk__dusk {
  opacity: 1;
}

.desk__light {
  mix-blend-mode: soft-light;
  overflow: hidden;
}

.desk__dusk {
  mix-blend-mode: multiply;
  background: radial-gradient(ellipse 80% 70% at 70% 25%, transparent 30%, rgba(40, 44, 60, 0.16) 100%);
  opacity: 0;
}

.desk--lit .desk__dusk {
  opacity: var(--desk-night, 0);
}

.desk__lamp {
  position: absolute;
  inset: 0;
  opacity: var(--desk-night, 0);
  background: radial-gradient(ellipse 46% 40% at 72% 22%, #ffc477 0%, rgba(255, 196, 119, 0.35) 45%, transparent 75%);
  transition: opacity 2s ease;
}

.desk__sun {
  position: absolute;
  left: 50%;
  top: 50%;
}

/* Two panes by two, 300 x 380 each with a 26px frame between them. */
.desk__window {
  position: absolute;
  width: 626px;
  height: 786px;
  transform: var(--desk-window, none) translate(-313px, -393px);
  transform-origin: 0 0;
  opacity: var(--desk-window-opacity, 0);
  transition: transform 2s ease, opacity 2s ease;
}

/* The panes and each branch are blurred on their own layers: the sway then only
   moves an already-blurred layer (cheap, on the GPU), instead of re-blurring
   the whole window on every frame. */
.desk__panes,
.desk__branch {
  position: absolute;
  filter: blur(var(--desk-blur, 10px));
}

.desk__panes {
  inset: 0;
}

.desk__pane {
  position: absolute;
  width: 300px;
  height: 380px;
  background: var(--desk-sun, #fff);
}

.desk__pane:nth-child(2),
.desk__pane:nth-child(4) { left: 326px; }
.desk__pane:nth-child(3),
.desk__pane:nth-child(4) { top: 406px; }

.desk__branch {
  inset: -10%;
  will-change: transform;
  transform-origin: 50% 0;
  animation: lj-branch 7.5s ease-in-out infinite alternate;
}

.desk__branch--b {
  transform-origin: 30% 0;
  animation-duration: 5.2s;
  animation-delay: -2s;
}

.desk__branch i {
  position: absolute;
  background: #808080; /* neutral under soft-light: a shadow inside the light */
  border-radius: 50% 0 50% 0;
}

@keyframes lj-branch {
  from { rotate: -1.6deg; translate: -6px 0; }
  to { rotate: 1.4deg; translate: 8px 3px; }
}

/* Narrower screens: the desk keeps its light; the things step aside. */
/* ---- In the dark ----------------------------------------------------------
   Soft-light barely shows on a dark desk, so the light adds itself instead
   (screen): there black is the neutral, so the leaves turn black to stay
   shadows. The room is already dark - no dimming layer - and the things on
   the desk are only lit by the lamp and the moon. */
.desk--dark .desk__light {
  mix-blend-mode: screen;
}

.desk--dark .desk__branch i {
  background: #000;
}

.desk--dark .desk__lamp {
  background: radial-gradient(ellipse 46% 40% at 72% 22%, rgba(255, 186, 104, 0.34) 0%, rgba(255, 186, 104, 0.12) 45%, transparent 75%);
}

.desk--dark .desk__dusk {
  display: none;
}

.desk--dark .thing {
  filter: drop-shadow(var(--desk-shadow-x, 4px) var(--desk-shadow-y, 6px) var(--desk-shadow-blur, 10px) rgba(0, 0, 0, var(--desk-shadow-alpha, 0.5))) brightness(0.62) saturate(0.82);
}

@media (max-width: 1180px) {
  .thing--camera { left: calc(50% + 380px); }
  .thing--books { left: calc(50% + 410px); }
  .thing--key { left: calc(50% - 560px); }
}

@media (max-width: 1000px) {
  .thing { display: none; }
}
</style>
