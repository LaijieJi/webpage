<template>
  <div class="me">
    <DeskScene />

    <!-- filed like any book in the journal: a catalogue card for me, with a
         greeting written across the top in each language I speak -->
    <header class="entry">
      <p class="entry__hello" aria-hidden="true">
        <transition name="hello" mode="out-in">
          <span :key="hello">{{ hello }}</span>
        </transition><span>,</span>
      </p>
      <h1 class="entry__name">Laijie Ji</h1>
      <div class="entry__lined">
        <p class="entry__note">
          Software developer in Valencia, working through a master's in artificial intelligence at the UPV.
          Usually in the middle of learning something.
        </p>
        <ol class="entry__subjects" aria-label="Subjects">
          <li v-for="(subject, i) in subjects" :key="subject" :style="{ '--s': i }">{{ i + 1 }}. {{ subject }}.</li>
        </ol>
      </div>
    </header>

    <nav class="contents" aria-labelledby="contents-title">
      <h2 id="contents-title" class="contents__title">Contents</h2>
      <ol class="contents__list">
        <li v-for="(chapter, i) in chapters" :key="chapter.id">
          <a class="contents__link" :href="`#${chapter.id}`">
            <span class="contents__name">{{ chapter.title }}</span>
            <span class="contents__leader" aria-hidden="true"></span>
            <span class="contents__n">{{ i + 1 }}</span>
          </a>
        </li>
      </ol>
    </nav>

    <!-- 1 -->
    <section :id="chapters[0].id" class="chapter" v-reveal>
      <span class="chapter__n" aria-hidden="true">1</span>
      <ul class="chapter__margin" aria-label="Places">
        <li>Málaga <span>2004</span></li>
        <li>Shangkou</li>
        <li>Águilas</li>
        <li>Ribarroja <span>2013</span></li>
      </ul>
      <h2 class="chapter__title">{{ chapters[0].title }}</h2>
      <p>
        I was born in Málaga in 2004, but I barely spent any time there. Soon after, my parents took me to
        Shangkou, in Qingtian, my grandparents' village and where my parents are from. I lived there until I
        was two or three, then came back to Spain, to Águilas, in Murcia. My cousins used to take me to the
        library there, and I'd come home with books; that reading is a big part of why Spanish always came
        easily. In 2013 we moved to Ribarroja, near Valencia. Valencian was hard the first year, and after that
        it wasn't.
      </p>
      <dl class="ledger">
        <template v-for="lang in languages" :key="lang.name">
          <dt>{{ lang.name }}</dt>
          <dd>{{ lang.from }}</dd>
        </template>
      </dl>
    </section>

    <!-- 2 -->
    <section :id="chapters[1].id" class="chapter" v-reveal>
      <span class="chapter__n" aria-hidden="true">2</span>
      <p class="chapter__margin">since 2023</p>
      <h2 class="chapter__title">{{ chapters[1].title }}</h2>
      <p>
        I'm a full-stack developer at Wegrant: Vue on the front, Django behind it, Azure and n8n around it.
        Before that I spent a few years at EBHealth3. Both jobs were about the same thing: taking something
        that's harder than it should be and making it easier for the people who deal with it. I don't always
        manage it, but it's the kind of problem I want to work on.
      </p>
      <dl class="ledger ledger--dated">
        <template v-for="row in work" :key="row.what">
          <dt>{{ row.what }}<span v-if="row.note">{{ row.note }}</span></dt>
          <dd>{{ row.when }}</dd>
        </template>
      </dl>
      <dl class="ledger ledger--dated">
        <dt>Computer Engineering, UPV</dt>
        <dd>finished 2026</dd>
        <dt>
          Erasmus semester at TUM, Munich
          <span><router-link to="/blog/a-year-since-munich">A year since Munich</router-link></span>
        </dt>
        <dd>2025</dd>
        <dt>Master's in AI, Pattern Recognition and Digital Imaging, UPV</dt>
        <dd>now</dd>
      </dl>
      <p class="chapter__more">Some of what I've built is on the <router-link to="/projects">projects</router-link> page.</p>
    </section>

    <!-- 3 -->
    <section :id="chapters[2].id" class="chapter" v-reveal>
      <span class="chapter__n" aria-hidden="true">3</span>
      <h2 class="chapter__title">{{ chapters[2].title }}</h2>
      <p>
        Mostly the master's. Between the coursework and its projects, it takes most of the time work doesn't.
      </p>
      <!-- kept current by the site itself: the reading list, the journal, the photographs -->
      <dl class="ledger">
        <dt>Studying</dt>
        <dd>the master's in AI, at the UPV</dd>
        <dt>Working</dt>
        <dd>at Wegrant</dd>
        <template v-if="upNext">
          <dt>Reading next</dt>
          <dd><em>{{ upNext.title }}</em>, {{ upNext.author }}</dd>
        </template>
        <template v-if="latestBook">
          <dt>Last finished</dt>
          <dd><router-link :to="`/blog/${latestBook.slug}`"><em>{{ cardTitle(latestBook) }}</em></router-link>, {{ cardByline(latestBook) }}</dd>
        </template>
        <template v-if="lastTrip">
          <dt>Last trip</dt>
          <dd><router-link :to="`/photography/${lastTrip.slug}`">{{ placeOf(lastTrip) }}</router-link>, {{ monthYear(lastTrip.frontmatter.date) }}</dd>
        </template>
      </dl>
      <p class="chapter__updated">updated October 2026</p>
    </section>

    <!-- 4 -->
    <section :id="chapters[3].id" class="chapter" v-reveal>
      <span class="chapter__n" aria-hidden="true">4</span>
      <h2 class="chapter__title">{{ chapters[3].title }}</h2>
      <p>
        There isn't much free time at the moment. When there is, I read, and I write about some of the books
        in the <router-link to="/blog">journal</router-link>. Or I take the camera out, less often than I'd
        like; one frame from each trip ends up in <router-link to="/photography">photographs</router-link>.
        And once a week <router-link to="/blog/a-miata-of-my-own">the MX-5</router-link> comes out of the
        garage for a drive to wherever I feel like going.
      </p>
      <!-- the frames from the photographs page, in the order they were taken -->
      <ol class="strip" aria-label="Photographs">
        <li v-for="trip in trips" :key="trip.slug" class="strip__cell" :style="{ '--ratio': ratioOf(trip) }">
          <router-link class="strip__frame" :to="`/photography/${trip.slug}`">
            <ResponsiveImg
              :src="mediaFor(trip.slug).image"
              :webp="mediaFor(trip.slug).webp"
              :ratio="mediaFor(trip.slug).ratio"
              :alt="trip.frontmatter.title"
              sizes="200px"
            />
          </router-link>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import posts, { cardByline, cardTitle } from '../data/posts.js';
import { readingList } from '../data/books.js';
import photoEntries from '../data/photography.js';
import { mediaFor } from '../data/photoMedia.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';
import DeskScene from '../components/DeskScene.vue';
import { useSeo, SITE_URL, OG_IMAGE } from '../composables/useSeo.js';

useSeo({
  title: 'Laijie Ji - Software Developer',
  ogTitle: 'Laijie Ji',
  description:
    "Laijie Ji - software developer in Valencia, working through a master's in AI at the UPV. Book reviews and photographs.",
  ogDescription:
    "Software developer in Valencia, working through a master's in AI at the UPV. Usually in the middle of learning something.",
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
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universitat Politècnica de València' },
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

// The subject headings at the foot of the card, as a library would trace them.
const subjects = ['Software engineering', 'Artificial intelligence', 'Books and reading', 'Photography'];

const chapters = [
  { id: 'where-im-from', title: "Where I'm from" },
  { id: 'what-i-do', title: 'What I do' },
  { id: 'now', title: "What I'm on now" },
  { id: 'off-hours', title: 'Off hours' }
];

// Each language, and where it came from.
const languages = [
  { name: 'Spanish', from: 'Águilas, and a lot of library books' },
  { name: 'Valencian', from: 'Ribarroja, after a difficult first year' },
  { name: 'Qingtian dialect', from: 'at home' },
  { name: 'Mandarin', from: 'classes in Valencia; I get by, not fluently' },
  { name: 'English', from: 'school, and a childhood of video games that only came in English' },
  { name: 'German', from: 'a one-semester A1 course at university, then Munich' }
];

const work = [
  { what: 'Full-stack developer, Wegrant', when: 'Jun 2026 - now' },
  { what: 'Software developer, EBHealth3', note: 'Spring Boot, AWS and Docker; mobile apps in Flutter', when: 'Mar 2024 - May 2026' },
  { what: 'Intern, T-Systems', note: 'DevOps and support for internal teams', when: 'Feb - Aug 2025' },
  { what: 'Intern, EBHealth3', when: 'Sep 2023 - Mar 2024' }
];

// Posts are sorted newest-first, so the first one tagged "books" is the latest read.
const latestBook = posts.find((post) => post.frontmatter.tags.includes('books'));
const upNext = readingList[0];

// Trips, newest first; the strip prints them in the order they were taken.
const lastTrip = photoEntries[0];
const trips = [...photoEntries].reverse();

function ratioOf(entry) {
  const [w, h] = (mediaFor(entry.slug).ratio || '3 / 2').split('/').map(Number);
  return (w / h).toFixed(3);
}

// Place labels carry a short year ("Praha · ’26"); keep just the place.
function placeOf(entry) {
  return (mediaFor(entry.slug).place || entry.frontmatter.title).split(' · ')[0];
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function monthYear(value) {
  const d = new Date(value);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

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
</script>

<style scoped>
.me {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
  padding: 52px 40px 104px;
}

/* Everything on the page sits above the desk and its light. */
.me > :not(.desk) {
  position: relative;
  z-index: 1;
}

/* ---- Greeting, handwritten across the top of the card ------------------ */
.entry__hello {
  display: flex;
  align-items: baseline;
  min-height: 1.2em;
  margin: 0;
  font-family: var(--font-hand);
  font-size: clamp(26px, 3.2vw, 32px);
  line-height: 1.1;
  color: var(--accent);
  rotate: -2deg;
}

.entry__hello > span {
  display: inline-block;
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

/* ---- The catalogue card ------------------------------------------------- */
.entry {
  position: relative;
  padding: 30px 44px 0;
  background: var(--card-paper);
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--line), 0 26px 40px -28px rgb(var(--shadow) / 0.55);
  rotate: -0.5deg;
  --reveal-rot: 2deg;
  animation: lj-settle 900ms var(--ease-settle) backwards;
}

/* the hole the drawer rod runs through */
.entry::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 50%;
  background: var(--mat);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
}

.entry__name {
  margin: 18px 0 0;
  padding-bottom: 20px;
  border-bottom: 1.5px solid var(--card-rule);
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(48px, 9vw, 92px);
  line-height: 0.95;
  letter-spacing: -0.025em;
  color: var(--ink);
}

/* Below the rule the card is ruled in faint blue, one line per 32px; the
   note and the subject headings sit on those lines. */
.entry__lined {
  padding: 12px 0 64px;
  background: repeating-linear-gradient(to bottom, transparent 0 31px, var(--card-line) 31px 32px) 0 12px / 100% calc(100% - 76px) no-repeat;
}

.entry__note {
  margin: 0;
  max-width: 50ch;
  font-family: var(--font-serif);
  font-size: 21px;
  line-height: 32px;
  color: var(--ink);
}

/* Traced subject headings, typed in one after another as the card lands. */
.entry__subjects {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.1em;
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 32px;
  color: var(--muted);
}

.entry__subjects li {
  animation: lj-type 700ms steps(22, end) calc(700ms + var(--s) * 520ms) backwards;
}

@keyframes lj-type {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* ---- Contents ----------------------------------------------------------- */
.contents {
  max-width: 560px;
  margin: 64px 0 0 auto;
}

.contents__title {
  margin: 0 0 14px;
  font-family: var(--font-serif);
  font-weight: 400;
  font-style: italic;
  font-size: 22px;
  color: var(--muted);
}

.contents__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.contents__link {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 7px 0;
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--ink);
}

.contents__leader {
  flex: 1;
  min-width: 24px;
  border-bottom: 2px dotted color-mix(in srgb, var(--ink) 30%, transparent);
  translate: 0 -5px;
  transition: border-color var(--transition);
}

.contents__n {
  font-variant-numeric: oldstyle-nums;
  color: var(--accent);
  transition: translate 500ms var(--ease-spring);
}

.contents__name {
  transition: color var(--transition), translate 500ms var(--ease-spring);
}

.contents__link:hover .contents__name,
.contents__link:focus-visible .contents__name {
  color: var(--accent);
  translate: 6px 0;
}

.contents__link:hover .contents__leader,
.contents__link:focus-visible .contents__leader {
  border-color: var(--accent);
}

/* ---- Chapters ----------------------------------------------------------- */
.chapter {
  position: relative;
  margin-top: 88px;
  max-width: calc(112px + 620px); /* one measure for prose and ledgers alike */
  padding-left: 112px;
  scroll-margin-top: 96px; /* clear the sticky header when jumped to */
}

.chapter__n {
  position: absolute;
  left: 0;
  top: -14px;
  font-family: var(--font-serif);
  font-size: 76px;
  line-height: 1;
  font-variant-numeric: oldstyle-nums;
  color: var(--accent);
}

/* Typed notes in the margin, under the chapter number. Scoped under .chapter
   so it outranks the generic `.chapter p` when the note is a paragraph. */
.chapter .chapter__margin {
  position: absolute;
  left: 0;
  top: 82px;
  width: 92px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.9;
  color: var(--muted);
}

.chapter__margin span {
  display: block;
  margin: -4px 0 2px;
  color: var(--faint);
}

.chapter__title {
  margin: 0 0 18px;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 32px;
  line-height: 1.15;
  color: var(--ink);
}

.chapter p {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 19px;
  line-height: 1.68;
  color: var(--ink);
}

.chapter a {
  color: var(--accent);
  border-bottom: 1px solid var(--line);
  transition: border-color var(--transition);
}

.chapter a:hover,
.chapter a:focus-visible {
  border-color: var(--accent);
}

.chapter .chapter__more {
  margin-top: 22px;
  color: var(--muted);
}

.chapter .chapter__updated {
  margin-top: 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--faint);
}

/* A two-column ledger: the thing on the left, where or when on the right. */
.ledger {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  margin: 28px 0 0;
  border-top: 1px solid var(--line);
}

.ledger dt,
.ledger dd {
  margin: 0;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
}

.ledger dt {
  padding-right: 18px;
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--ink);
}

.ledger dt span {
  display: block;
  margin-top: 2px;
  font-size: 15px;
  color: var(--muted);
}

.ledger dd {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 17px;
  color: var(--muted);
}

/* Dated ledgers put the dates in a narrow right-hand column. */
.ledger--dated {
  grid-template-columns: minmax(0, 1fr) auto;
}

.ledger--dated dd {
  padding-left: 18px;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 12.5px;
  text-align: right;
  white-space: nowrap;
  padding-top: 15px;
}

.ledger + .ledger {
  margin-top: 22px;
}

.ledger dd a {
  font-style: normal;
}

.ledger dd em,
.ledger dd a em {
  font-style: italic;
}

/* ---- A short strip of film: the photographs, smaller --------------------- */
.strip {
  display: flex;
  margin: 30px 0 0;
  padding: 0;
  list-style: none;
}

/* Each cell grows in proportion to its frame's ratio, so every frame in the
   strip comes out the same height. */
.strip__cell {
  flex: var(--ratio) 1 0;
  min-width: 0;
  padding: 20px 4px 18px;
  background:
    repeating-linear-gradient(to right, transparent 0 4px, #3b3c37 4px 11px, transparent 11px 16px) 0 5px / 100% 7px no-repeat,
    repeating-linear-gradient(to right, transparent 0 4px, #3b3c37 4px 11px, transparent 11px 16px) 0 calc(100% - 5px) / 100% 7px no-repeat,
    #1d1e1b;
}

.chapter .strip__frame {
  display: block;
  border: none;
  overflow: hidden;
}

.strip__frame :deep(img) {
  transition: scale 900ms var(--ease-out), filter 400ms ease;
}

.strip__frame:hover :deep(img),
.strip__frame:focus-visible :deep(img) {
  scale: 1.06;
  filter: brightness(1.08);
}

@media (max-width: 680px) {
  .me {
    padding: 34px 16px 72px;
  }
  .entry {
    padding: 24px 22px 0;
    rotate: none;
  }
  .entry__note {
    font-size: 19px;
  }
  .contents {
    margin-top: 48px;
  }
  .contents__link {
    font-size: 20px;
  }
  .chapter {
    max-width: none;
    margin-top: 64px;
    padding-left: 0;
  }
  .chapter__n {
    position: static;
    display: block;
    margin-bottom: 4px;
    font-size: 56px;
  }
  .chapter .chapter__margin {
    position: static;
    width: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0 14px;
    margin-bottom: 10px;
  }
  .chapter__margin span {
    display: inline;
    margin: 0 0 0 4px;
  }
  .strip {
    flex-wrap: wrap;
  }
  .strip__cell {
    flex-basis: calc(var(--ratio) * 110px);
  }
  .ledger {
    grid-template-columns: 1fr;
  }
  .ledger dt {
    border-bottom: none;
    padding-bottom: 0;
  }
  .ledger dd {
    padding-top: 2px;
  }
  .ledger--dated dd {
    padding-left: 0;
    text-align: left;
  }
}
</style>
