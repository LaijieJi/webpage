<template>
  <section class="nf">
    <p class="nf__eyebrow">Error 404</p>
    <h1 class="nf__title">This page wandered off the trail.</h1>
    <p class="nf__note">— let's get you back</p>
    <div class="nf__links">
      <router-link class="nf__link" to="/">← back home</router-link>
      <router-link class="nf__link" to="/blog">the journal</router-link>
      <router-link class="nf__link nf__link--alt" to="/photography">the gallery</router-link>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'Lost — Laijie Ji';
});
</script>

<style scoped>
.nf {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(80px, 16vh, 180px) 40px;
  text-align: center;
}

.nf__eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--garage);
  margin: 0 0 18px;
}

.nf__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(34px, 6vw, 60px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0;
}

.nf__note {
  font-family: var(--font-hand);
  font-size: clamp(24px, 3vw, 32px);
  color: var(--muted);
  transform: rotate(-2deg);
  margin: 22px 0 40px;
}

.nf__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
  font-family: var(--font-mono);
  font-size: 13px;
}

.nf__link {
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
}

.nf__link:hover,
.nf__link:focus-visible {
  border-color: var(--accent);
  color: var(--accent);
}

.nf__link--alt:hover,
.nf__link--alt:focus-visible {
  border-color: var(--accent2);
  color: var(--accent2);
}
</style>
