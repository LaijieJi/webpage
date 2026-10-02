<template>
  <div class="home">
    <!-- hero -->
    <section class="hero">
      <div class="hero__tag" aria-hidden="true" v-parallax="-0.1">
        <div class="hero__tag-main">VALENCIA · ESP</div>
        <div class="hero__tag-sub">39.47°N · 0.37°W</div>
      </div>
      <p class="hero__hello" aria-hidden="true">
        <transition name="hello" mode="out-in">
          <span :key="hello">{{ hello }}</span>
        </transition><span class="hero__hello-comma">,</span>
      </p>
      <h1 class="hero__title" v-parallax="0.05">
        <span class="w" style="--w: 0">Mostly,</span> <span class="w" style="--w: 1">I'm</span> <span class="hero__accent w" style="--w: 2">
          <em>curious</em>
          <span class="hero__underline" aria-hidden="true">
            <svg viewBox="0 0 120 13" preserveAspectRatio="none">
              <path d="M2 8 Q 18 2 34 8 T 66 8 T 98 8 T 118 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" pathLength="1" />
            </svg>
          </span></span> <span class="w" style="--w: 3">about</span> <span class="w" style="--w: 4">how</span> <span class="w" style="--w: 5">things</span> <span class="w" style="--w: 6">work,</span> <span class="w" style="--w: 7">and</span> <span class="w" style="--w: 8">doing</span> <span class="w" style="--w: 9">them</span> <span class="w" style="--w: 10">properly.</span>
      </h1>
    </section>

    <!-- intro + snapshot -->
    <section class="intro">
      <div class="intro__prose">
        <p class="intro__lead" v-reveal>That curiosity is behind most of what I do, from the code I build to the books I read.</p>
        <p class="intro__lead intro__lead--muted" v-reveal>I'd rather make one thing well than rush through ten, and I care more about understanding something than finishing it fast.</p>
      </div>
      <aside class="card" v-reveal v-tilt="5">
        <span class="card__tape" aria-hidden="true"></span>
        <div class="card__row">
          <div class="card__label">Currently</div>
          <div class="card__value">Full Stack Developer · Wegrant</div>
        </div>
        <div class="card__row">
          <div class="card__label">Based in</div>
          <div class="card__value">Valencia, Spain</div>
        </div>
        <div class="card__row">
          <div class="card__label">Studying</div>
          <div class="card__value">AI &amp; Pattern Recognition · UPV</div>
        </div>
        <div class="card__row">
          <div class="card__label">Languages</div>
          <div class="card__langs">es · ca · en <span>fluent</span><br />zh · de <span>basics</span></div>
        </div>
      </aside>
    </section>

    <!-- the journey -->
    <section class="journey">
      <p class="journey__kicker">- a short walk through it</p>
      <div class="journey__track" v-scroll-progress>
        <svg class="journey__river" width="68" viewBox="0 0 68 1000" preserveAspectRatio="none" aria-hidden="true">
          <!-- a faint trace of the whole route, inked in as you read down it -->
          <path class="journey__river-trace" d="M34 0 C 62 110, 8 210, 34 320 C 60 430, 6 520, 34 640 C 58 740, 12 850, 34 1000" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 7" />
          <path class="journey__river-ink" d="M34 0 C 62 110, 8 210, 34 320 C 60 430, 6 520, 34 640 C 58 740, 12 850, 34 1000" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" pathLength="1" />
        </svg>

        <!-- the work -->
        <div class="milestone" v-reveal>
          <span class="milestone__n">01</span>
          <p class="milestone__label">the work</p>
          <div class="work">
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">Wegrant - Full Stack Developer</span>
                <span class="work__dates">Jun 2026 → now</span>
              </div>
              <p class="work__note">Frontend in Vue, backend in Django, cloud on Azure, and automations with n8n.</p>
            </div>
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">EBHealth3 - Software Developer</span>
                <span class="work__dates">Mar 2024 → May 2026</span>
              </div>
              <p class="work__note">Backend with Spring Boot, AWS and Docker. Mobile apps in Flutter.</p>
            </div>
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">T-Systems - Internship</span>
                <span class="work__dates">Feb → Aug 2025</span>
              </div>
              <p class="work__note">DevOps and support for internal teams.</p>
            </div>
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">EBHealth3 - Internship</span>
                <span class="work__dates">Sept 2023 → Mar 2024</span>
              </div>
            </div>
          </div>
        </div>

        <!-- the writing -->
        <div class="milestone" v-reveal>
          <span class="milestone__n">02</span>
          <p class="milestone__label">the writing</p>
          <router-link v-if="latestBook" class="writing__post" :to="`/blog/${latestBook.slug}`">
            <span class="writing__title">{{ latestBook.frontmatter.title }}</span>
            <span class="writing__date">{{ formatDate(latestBook.frontmatter.date) }}</span>
          </router-link>
          <router-link class="writing__more" to="/blog">read the journal →</router-link>
        </div>

        <!-- the seeing -->
        <div class="milestone milestone--last" v-reveal>
          <span class="milestone__n milestone__n--alt">03</span>
          <p class="milestone__label milestone__label--alt">the seeing</p>
          <p class="seeing__text">A camera I carry on slow walks. A few frames find their way back here.</p>
          <p class="seeing__note">a few favourites ↓</p>
          <div class="seeing__row">
            <router-link class="polaroid polaroid--a" to="/photography/hiking-bavaria" v-tilt="9" v-parallax="0.06">
              <span class="polaroid__tape" aria-hidden="true"></span>
              <ResponsiveImg :src="leafImg.src" :webp="leafImg.webp" alt="A single leaf on clear water" ratio="1 / 1" cover sizes="160px" />
              <span class="polaroid__caption">starnberg · '25</span>
            </router-link>
            <router-link class="polaroid polaroid--b" to="/photography/hiking-bavaria" v-tilt="9" v-parallax="-0.05">
              <span class="polaroid__tape" aria-hidden="true"></span>
              <ResponsiveImg :src="bavariaImg.src" :webp="bavariaImg.webp" alt="The Herzogstand summit in the Bavarian Alps" ratio="1 / 1" cover sizes="160px" />
              <span class="polaroid__caption">Herzogstand '26</span>
            </router-link>
            <router-link class="seeing__gallery" to="/photography">the gallery →</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { leafImg, bavariaImg } from '../data/media.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';
import posts from '../data/posts.js';
import { useSeo, SITE_URL, OG_IMAGE } from '../composables/useSeo.js';

useSeo({
  title: 'Laijie Ji - Full-Stack Developer',
  ogTitle: "Laijie Ji - I write software. The rest of the time, I'm outside.",
  description:
    'Laijie Ji - full-stack developer in Valencia. Projects, a reading journal, photography, and one well-kept Mazda MX-5.',
  ogDescription:
    'Full-stack developer in Valencia. Projects, a reading journal, photography, and one well-kept Mazda MX-5.',
  path: '/',
  ld: [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Laijie Ji',
      url: `${SITE_URL}/`,
      image: OG_IMAGE,
      jobTitle: 'Full-Stack Developer',
      worksFor: { '@type': 'Organization', name: 'Wegrant' },
      address: { '@type': 'PostalAddress', addressLocality: 'Valencia', addressCountry: 'ES' },
      knowsLanguage: ['es', 'ca', 'en', 'zh', 'de'],
      sameAs: [
        'https://github.com/LaijieJi',
        'https://linkedin.com/in/laijie-ji',
        'https://www.instagram.com/laijie.jpg/'
      ]
    },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Laijie Ji', url: `${SITE_URL}/` }
  ]
});

// Posts are sorted newest-first, so the first one tagged "books" is the latest read.
const latestBook = posts.find((post) => (post.frontmatter.tags || []).includes('books'));

// Rotating greeting across the languages I speak.
const greetings = ['hola', 'bon dia', 'hello', '你好', 'hallo'];
const greetIndex = ref(0);
const hello = computed(() => greetings[greetIndex.value]);
let greetTimer;
onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  greetTimer = window.setInterval(() => {
    greetIndex.value = (greetIndex.value + 1) % greetings.length;
  }, 3600);
});
onBeforeUnmount(() => window.clearInterval(greetTimer));

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function formatDate(value) {
  const d = value ? new Date(value) : new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
</script>

<style scoped>
.home {
  display: block;
}

/* ---- Hero --------------------------------------------------------------- */
.hero {
  position: relative;
  max-width: 1040px;
  margin: 0 auto;
  padding: 60px 40px 4px;
}

.hero__tag {
  position: absolute;
  top: 50px;
  right: 40px;
  transform: rotate(4deg);
  border: 1.5px dashed var(--accent2);
  border-radius: 3px;
  padding: 9px 13px;
  text-align: center;
  line-height: 1.5;
  --sway: 1.2deg;
  animation:
    lj-stamp 640ms var(--ease-spring) 1.15s both,
    lj-sway 7s ease-in-out 1.8s infinite alternate;
}

.hero__tag-main {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--accent2);
}

.hero__tag-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--muted);
}

.hero__hello {
  display: flex;
  align-items: baseline;
  font-family: var(--font-hand);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--accent);
  margin: 0 0 6px;
  min-height: 1.1em;
}

/* Each greeting is written in, then lifts off the page as the next comes. */
.hello-enter-active {
  animation: lj-write 900ms cubic-bezier(0.45, 0.1, 0.35, 1) both;
}

.hello-leave-active {
  transition: opacity 380ms ease-in, translate 380ms var(--ease-lift), filter 380ms ease-in;
}

.hello-leave-to {
  opacity: 0;
  translate: 0 -6px;
  filter: blur(2px);
}

.hero__hello > span {
  display: inline-block;
}

.hero__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(32px, 6.2vw, 78px);
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin: 0;
  max-width: 15ch;
}

/* The title sets itself word by word; --w is each word's place. */
.hero__title .w {
  display: inline-block;
  animation: lj-word 900ms var(--ease-settle) calc(120ms + var(--w) * 55ms) both;
}

@keyframes lj-word {
  from {
    opacity: 0;
    translate: 0 0.4em;
    rotate: 3deg;
  }
  40% {
    opacity: 1;
  }
  to {
    opacity: 1;
    translate: none;
    rotate: none;
  }
}

.hero__accent {
  position: relative;
  white-space: nowrap;
}

.hero__accent em {
  font-style: italic;
  color: var(--accent);
}

.hero__underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 13px;
  color: var(--accent);
}

.hero__underline svg {
  display: block;
  width: 100%;
  height: 100%;
}

.hero__underline path {
  stroke-dasharray: 1;
  animation: lj-draw 0.8s cubic-bezier(0.6, 0.1, 0.3, 1) 0.95s both;
}

.hero__note {
  font-family: var(--font-hand);
  font-size: clamp(22px, 2.8vw, 30px);
  color: var(--muted);
  transform: rotate(-3deg);
  margin: 30px 0 0 auto;
  text-align: right;
  max-width: 24ch;
}

/* ---- Intro + snapshot --------------------------------------------------- */
.intro {
  max-width: 1040px;
  margin: 0 auto;
  padding: 40px 40px 60px;
  display: grid;
  grid-template-columns: 1.55fr 0.95fr;
  gap: 60px;
  align-items: start;
}

.intro__prose {
  display: grid;
  gap: 18px;
}

.intro__lead {
  font-family: var(--font-serif);
  font-size: 21px;
  line-height: 1.55;
  color: var(--ink);
  margin: 0;
}

.intro__lead--muted {
  color: var(--muted);
}

.card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 28px 24px 24px;
  box-shadow: 0 18px 34px -26px rgba(42, 38, 32, 0.55);
  display: grid;
  gap: 18px;
  --reveal-rot: 4deg;
  transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) rotate(-1.3deg);
  transition: transform 900ms var(--ease-settle), box-shadow 400ms ease;
}

.card.is-tilting {
  transition: transform 300ms var(--ease-out), box-shadow 400ms ease;
  box-shadow: 0 28px 44px -28px rgba(42, 38, 32, 0.6);
}

.card__tape {
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%) rotate(-2.5deg);
  width: 96px;
  height: 22px;
  background: rgba(176, 85, 51, 0.12);
  border: 1px solid rgba(176, 85, 51, 0.16);
  --sway: 1.5deg;
  animation: lj-sway 6.2s ease-in-out infinite alternate;
}

.card__label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 5px;
}

.card__value {
  font-size: 15px;
}

.card__langs {
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.7;
}

.card__langs span {
  color: var(--muted);
}

/* ---- The journey -------------------------------------------------------- */
.journey {
  max-width: 1040px;
  margin: 0 auto;
  padding: 48px 40px 72px;
}

.journey__kicker {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 32px;
}

.journey__track {
  position: relative;
  padding-left: 96px;
}

.journey__river {
  position: absolute;
  left: 4px;
  top: 8px;
  height: calc(100% - 16px);
  overflow: visible;
}

.journey__river-trace {
  opacity: 0.22;
}

/* --progress comes from v-scroll-progress; without it the river is whole. */
.journey__river-ink {
  opacity: 0.55;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--progress, 1));
}

.milestone {
  position: relative;
  padding: 0 0 48px;
}

.milestone--last {
  padding-bottom: 4px;
}

.milestone__n {
  position: absolute;
  left: -96px;
  top: -12px;
  font-family: var(--font-serif);
  font-size: 50px;
  color: var(--accent);
  line-height: 1;
}

.milestone__n--alt {
  color: var(--accent2);
}

/* As a milestone arrives, its number pops and its contents follow it in. */
.milestone.reveal:not(.reveal--in) :is(.milestone__n, .work__item, .polaroid) {
  opacity: 0;
}

.milestone.reveal--in .milestone__n {
  animation: lj-pop 800ms var(--ease-spring) calc(var(--i, 0) * 90ms + 140ms) backwards;
}

.milestone.reveal--in :is(.work__item, .polaroid) {
  --reveal-rot: 0deg;
  animation: lj-settle var(--dur-settle) var(--ease-settle) calc(var(--d, 0) * 110ms + 200ms) backwards;
}

.work__item:nth-child(2) { --d: 1; }
.work__item:nth-child(3) { --d: 2; }
.work__item:nth-child(4) { --d: 3; }
.polaroid--a { --d: 1; }
.polaroid--b { --d: 2; }

.milestone__label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 14px;
}

.milestone__label--alt {
  color: var(--accent2);
  margin-bottom: 12px;
}

/* the work */
.work {
  display: grid;
  gap: 18px;
}

.work__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.work__role {
  font-family: var(--font-serif);
  font-size: 22px;
}

.work__dates {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.work__note {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--muted);
  margin: 5px 0 0;
}

/* the writing */
.writing__post {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  color: var(--ink);
}

.writing__post:hover .writing__title,
.writing__post:focus-visible .writing__title {
  color: var(--accent);
}

.writing__title {
  font-family: var(--font-serif);
  font-size: 21px;
  transition: color var(--transition);
}

.writing__date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.writing__more {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--accent);
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;
}

/* the seeing */
.seeing__text {
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.5;
  color: var(--muted);
  margin: 0;
  max-width: 42ch;
}

.seeing__note {
  font-family: var(--font-hand);
  font-size: 25px;
  color: var(--accent2);
  transform: rotate(-2deg);
  margin: 18px 0 0 6px;
}

.seeing__row {
  display: flex;
  align-items: flex-start;
  gap: 22px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.polaroid {
  position: relative;
  background: #fffdf7;
  padding: 7px 7px 24px;
  box-shadow: 0 14px 26px -16px rgba(42, 38, 32, 0.55);
  width: 140px;
  display: block;
  --rot: 0deg;
  transform: perspective(600px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) rotate(var(--rot)) scale(var(--lift, 1));
  transition: transform 900ms var(--ease-spring), box-shadow 400ms ease;
}

.polaroid--a { --rot: -3deg; }
.polaroid--b { --rot: 2.4deg; margin-top: 16px; }

/* Picked up: straightened, lifted, its shadow falling further away. */
.polaroid:hover,
.polaroid:focus-visible {
  --rot: 0deg;
  --lift: 1.07;
  z-index: 1;
  box-shadow: 0 26px 36px -18px rgba(42, 38, 32, 0.5);
}

.polaroid.is-tilting {
  transition: transform 300ms var(--ease-out), box-shadow 400ms ease;
}

.polaroid__tape {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(-4deg);
  width: 64px;
  height: 19px;
  background: rgba(245, 240, 225, 0.55);
  border: 1px solid rgba(42, 38, 32, 0.07);
  --sway: 2deg;
  animation: lj-sway 5.4s ease-in-out infinite alternate;
}

.polaroid--b .polaroid__tape {
  animation-duration: 7.3s;
  animation-delay: -2s;
}

.polaroid img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.polaroid__caption {
  display: block;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  color: #8a8170;
  text-align: center;
  margin-top: 8px;
}

.seeing__gallery {
  align-self: center;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink);
  border-bottom: 1px solid var(--accent2);
  padding-bottom: 2px;
}

@media (max-width: 760px) {
  .hero { padding: 40px 22px 4px; }
  .hero__tag { position: static; transform: rotate(2deg); display: inline-block; margin-bottom: 22px; }
  .hero__note { margin-left: 0; text-align: left; }
  .intro { grid-template-columns: 1fr; gap: 30px; padding: 30px 22px 50px; }
  .card { transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)); }
  .journey { padding: 40px 22px 60px; }
  .journey__track { padding-left: 60px; }
  .milestone__n { left: -60px; font-size: 38px; }
}
</style>
