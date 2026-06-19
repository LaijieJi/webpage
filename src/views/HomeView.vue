<template>
  <div class="home">
    <!-- hero -->
    <section class="hero">
      <div class="hero__tag" aria-hidden="true">
        <div class="hero__tag-main">VALENCIA · ESP</div>
        <div class="hero__tag-sub">39.47°N · 0.37°W</div>
      </div>
      <h1 class="hero__title">
        I write software. The rest of the time, I'm
        <span class="hero__accent">
          <em>outside</em>
          <span class="hero__underline" aria-hidden="true">
            <svg viewBox="0 0 120 13" preserveAspectRatio="none">
              <path d="M2 8 Q 18 2 34 8 T 66 8 T 98 8 T 118 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
            </svg>
          </span></span>.
      </h1>
      <p class="hero__note">— still figuring it out, slowly</p>
    </section>

    <!-- intro + snapshot -->
    <section class="intro">
      <div class="intro__prose">
        <p class="intro__lead">I read more than I probably should, still write letters by hand, and happily lose an afternoon to a long trail or a quiet lake.</p>
        <p class="intro__lead intro__lead--muted">I'd rather make one thing properly than rush through ten, and I like understanding how things actually work.</p>
      </div>
      <aside class="card">
        <span class="card__tape" aria-hidden="true"></span>
        <div class="card__row">
          <div class="card__label">Currently</div>
          <div class="card__value">Software Developer · EBHealth3</div>
        </div>
        <div class="card__row">
          <div class="card__label">Based in</div>
          <div class="card__value">Valencia, Spain</div>
        </div>
        <div class="card__row">
          <div class="card__label">Studying</div>
          <div class="card__value">Computer Engineering · UPV</div>
        </div>
        <div class="card__row">
          <div class="card__label">Languages</div>
          <div class="card__langs">es · ca · en <span>fluent</span><br />zh · de <span>basics</span></div>
        </div>
      </aside>
    </section>

    <!-- the journey -->
    <section class="journey">
      <p class="journey__kicker">— a short walk through it</p>
      <div class="journey__track">
        <svg class="journey__river" width="68" viewBox="0 0 68 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M34 0 C 62 110, 8 210, 34 320 C 60 430, 6 520, 34 640 C 58 740, 12 850, 34 1000" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" opacity="0.4" />
        </svg>

        <!-- the work -->
        <div class="milestone">
          <span class="milestone__n">01</span>
          <p class="milestone__label">the work</p>
          <div class="work">
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">EBHealth3 — Software Developer</span>
                <span class="work__dates">Mar 2024 → now</span>
              </div>
              <p class="work__note">Backend with Spring Boot, AWS and Docker. Mobile apps in Flutter.</p>
            </div>
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">T-Systems — Internship</span>
                <span class="work__dates">Feb → Aug 2025</span>
              </div>
              <p class="work__note">DevOps and support for internal teams.</p>
            </div>
            <div class="work__item">
              <div class="work__head">
                <span class="work__role">EBHealth3 — Internship</span>
                <span class="work__dates">Sept 2023 → Mar 2024</span>
              </div>
            </div>
          </div>
        </div>

        <!-- the writing -->
        <div class="milestone">
          <span class="milestone__n">02</span>
          <p class="milestone__label">the writing</p>
          <router-link class="writing__post" to="/blog/book-three-body-problem">
            <span class="writing__title">Book Review — The Three-Body Problem</span>
            <span class="writing__date">25 apr 2026</span>
          </router-link>
          <router-link class="writing__more" to="/blog">read the journal →</router-link>
        </div>

        <!-- the seeing -->
        <div class="milestone milestone--last">
          <span class="milestone__n milestone__n--alt">03</span>
          <p class="milestone__label milestone__label--alt">the seeing</p>
          <p class="seeing__text">A camera I carry on slow walks. A few frames find their way back here.</p>
          <p class="seeing__note">a few favourites ↓</p>
          <div class="seeing__row">
            <router-link class="polaroid polaroid--a" to="/photography/hiking-bavaria">
              <span class="polaroid__tape" aria-hidden="true"></span>
              <img :src="photoLeaf" alt="A single leaf on clear water" loading="lazy" />
              <span class="polaroid__caption">starnberg · '25</span>
            </router-link>
            <router-link class="polaroid polaroid--b" to="/photography/hiking-bavaria">
              <span class="polaroid__tape" aria-hidden="true"></span>
              <img :src="photoLake" alt="A lake between trees in Bavaria" loading="lazy" />
              <span class="polaroid__caption">bavaria · '25</span>
            </router-link>
            <router-link class="seeing__gallery" to="/photography">the gallery →</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import photoLeaf from '../assets/media/CF12C5E8-3BBE-4973-8C44-2B4ABD00A866_1_105_c.jpeg';
import photoLake from '../assets/media/F629BFE3-0C58-40A2-BD01-CC8D12B0E433_1_105_c.jpeg';
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

.hero__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(32px, 6.2vw, 78px);
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin: 0;
  max-width: 15ch;
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
  transform: rotate(-1.3deg);
  box-shadow: 0 18px 34px -26px rgba(42, 38, 32, 0.55);
  display: grid;
  gap: 18px;
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
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.polaroid--a { transform: rotate(-3deg); }
.polaroid--b { transform: rotate(2.4deg); margin-top: 16px; }

.polaroid:hover,
.polaroid:focus-visible {
  transform: rotate(0deg) scale(1.04);
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
  .card { transform: none; }
  .journey { padding: 40px 22px 60px; }
  .journey__track { padding-left: 60px; }
  .milestone__n { left: -60px; font-size: 38px; }
}
</style>
