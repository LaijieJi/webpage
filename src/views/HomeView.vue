<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Computer Science student &amp; software developer</h1>
          <p class="view-text">Hi! 👋</p>
          <p class="view-text">
            I'm Laijie Ji, a Computer Engineering student at the Polytechnic University of Valencia. I'm passionate about creating accessible products that solve real problems and make a meaningful impact on people's lives.
          </p>
          <br></br>
          <p class="view-text">
            I enjoy working in multidisciplinary teams where clear communication and transparent documentation help build trustworthy software. Currently expanding my knowledge in Software Development, mobile experiences with Flutter, and Artificial Intelligence.
          </p>
          <br></br>
          <p class="view-text">
            When I am not writing code, I enjoy spending time reading📖, exercising🏃 or learning new things🎒.
          </p>
        </div>
        <div>
          <h2>Languages</h2>
          <ul class="inline-list">
            <li>spanish · native</li>
            <li>catalan · advanced</li>
            <li>english · advanced</li>
            <li>chinese · basic</li>
            <li>german · basic</li>
          </ul>
        </div>
      </header>
      <section class="view-section">
        <h2>Photography</h2>
        <br/>
        <div class="photo-highlight">
          <div class="photo-highlight__copy">
            <p class="view-text">
              I love capturing quiet moments from my travels and daily life. Visit my Instagram gallery to see the latest shots.
            </p>
            <br/>
            <a class="button button--accent" href="https://www.instagram.com/laijie.jpg/" target="_blank" rel="noreferrer">
              Follow on Instagram
            </a>
          </div>
          <div class="photo-highlight__preview">
            <button
              v-for="photo in photos"
              :key="photo.src"
              class="photo-thumb"
              type="button"
              @click="openLightbox(photo)"
            >
              <img :src="photo.thumb" :alt="photo.alt" loading="lazy" />
            </button>
          </div>
        </div>
      </section>

      <transition name="lightbox">
        <div
          v-if="activePhoto"
          class="lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="`Photo: ${activePhoto.alt}`"
        >
          <button class="lightbox__overlay" type="button" @click="closeLightbox"></button>
          <div class="lightbox__content">
            <img :src="activePhoto.src" :alt="activePhoto.alt" />
            <p class="lightbox__caption">{{ activePhoto.caption }}</p>
            <button class="lightbox__close" type="button" @click="closeLightbox" aria-label="Cerrar">
              ×
            </button>
          </div>
        </div>
      </transition>

      <section class="view-section">
        <h2>Contact</h2>
        <p class="view-text">
          Let's talk! you can send me an email, follow me on github or connect with me via linkedin
        </p>
        <div class="inline-actions">
          <a class="button button--accent" href="mailto:contact@laijie.dev">email</a>
          <a class="button button--ghost" href="https://github.com/laijieji" target="_blank" rel="noreferrer">
            Github
          </a>
          <a class="button button--ghost" href="https://linkedin.com/in/laijie-ji" target="_blank" rel="noreferrer">
            Linkedin
          </a>
        </div>
      </section>
      <section class="view-section">
        <h2>Experience</h2>
        <ul class="experience-list">
          <li>
            <div class="experience-header">
              <h3>EBHealth3 | Software Developer</h3>
              <span class="experience-dates">Mar. 2024 - Currently</span>
            </div>
            <p class="view-text">
              Backend Development with Spring Boot, AWS and Docker.
              Mobile Apps with Flutter.
            </p>
          </li>
          <li>
            <div class="experience-header">
              <h3>EBHealth3 | Internship</h3>
              <span class="experience-dates">Sept. 2023 - Mar. 2024</span>
            </div>
          </li>
          <li>
            <div class="experience-header">
              <h3>T-Systems | Internship</h3>
              <span class="experience-dates">Feb. 2025 - Aug. 2025</span>
            </div>
            <p class="view-text">DevOps and support for other internal teams.</p>
          </li>
        </ul>
      </section>

      <section class="view-section">
        <h2>Certifications</h2>
        <ul class="cert-list">
          <li>
            <div class="cert-title">Computer Science</div>
            <div class="cert-meta">Universidad Politécnica de València · 2022 - 2026</div>
          </li>
          <li>
            <div class="cert-title">LFS101x: Introduction to Linux</div>
            <div class="cert-meta">The Linux Foundation · Feb 2024</div>
          </li>
          <li>
            <div class="cert-title">Google IT Automation with Python</div>
            <div class="cert-meta">Google Career Certificates · Nov 2022</div>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import photoOne from '../assets/media/CC41B5D9-DBE7-4E0C-8089-DEC0EE1275A1_1_105_c.jpeg';
import photoTwo from '../assets/media/CF12C5E8-3BBE-4973-8C44-2B4ABD00A866_1_105_c.jpeg';
import photoThree from '../assets/media/F629BFE3-0C58-40A2-BD01-CC8D12B0E433_1_105_c.jpeg';

const photos = [
  {
    src: photoOne,
    thumb: photoOne,
    alt: 'Sunset casting warm light over a building in Munich',
    caption: 'Sunset light bathing the Bayerische Staatskanzlei in Munich.'
  },
  {
    src: photoTwo,
    thumb: photoTwo,
    alt: 'A leaf floating over clear water',
    caption: 'Day trip to Starnberger See'
  },
  {
    src: photoThree,
    thumb: photoThree,
    alt: 'Lake between trees',
    caption: 'Tranquil view of Starnberger See surrounded by autumn trees.'
  }
];

const activePhoto = ref(null);

function openLightbox(photo) {
  activePhoto.value = photo;
  document.documentElement.style.overflow = 'hidden';
}

function closeLightbox() {
  activePhoto.value = null;
  document.documentElement.style.overflow = '';
}

function onKeyDown(event) {
  if (event.key === 'Escape' && activePhoto.value) {
    closeLightbox();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
  document.documentElement.style.overflow = '';
});
</script>

<style scoped>
.inline-actions {
  margin-top: var(--space-lg);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.experience-list {
  margin: var(--space-xl) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-lg);
}

.experience-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: baseline;
  justify-content: space-between;
}

.experience-dates {
  color: var(--muted);
  font-size: 0.95rem;
}

.photo-highlight {
  display: grid;
  gap: var(--space-lg);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-xl);
  box-shadow: var(--shadow);
  align-items: center;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}

.photo-highlight__preview {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.photo-thumb {
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 12px 24px -18px rgba(0, 0, 0, 0.4);
  transition: transform var(--transition), box-shadow var(--transition);
}

.photo-thumb img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.photo-thumb:hover,
.photo-thumb:focus-visible {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px -30px rgba(0, 0, 0, 0.6);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 180ms ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
}

.lightbox__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  padding: 0;
}

.lightbox__content {
  position: relative;
  background: var(--card);
  border-radius: var(--radius);
  padding: var(--space-xl);
  max-width: min(90vw, 48rem);
  max-height: 90vh;
  display: grid;
  gap: var(--space-md);
  box-shadow: 0 40px 60px -30px rgba(0, 0, 0, 0.8);
}

.lightbox__content img {
  width: 100%;
  height: auto;
  border-radius: var(--radius);
  object-fit: contain;
}

.lightbox__caption {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.lightbox__close {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lightbox__close:hover,
.lightbox__close:focus-visible {
  background: rgba(0, 0, 0, 0.6);
}

.cert-list {
  list-style: none;
  margin: var(--space-xl) 0 0;
  padding: 0;
  display: grid;
  gap: var(--space-md);
}

.cert-title {
  font-weight: 600;
}

.cert-meta {
  color: var(--muted);
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .photo-highlight__preview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lightbox__content {
    padding: var(--space-lg);
  }
}
</style>
