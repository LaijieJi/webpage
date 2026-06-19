<template>
  <div class="projects">
    <section class="projects__head">
      <p class="eyebrow">Selected work</p>
      <h1 class="projects__title">Things I've built.</h1>
      <p class="projects__lede">Mostly built to learn something, or to scratch an itch I couldn't ignore.</p>
    </section>
    <section class="projects__list">
      <article v-for="project in projects" :key="project.name" class="proj" v-reveal>
        <div class="proj__head">
          <h2 class="proj__name">{{ project.name }}</h2>
          <span class="proj__dates">{{ project.dates }}</span>
        </div>
        <div class="proj__tech">{{ project.tech }}</div>
        <p class="proj__summary">{{ project.summary }}</p>
        <a
          v-if="project.href"
          class="proj__link"
          :href="project.href"
          target="_blank"
          rel="noreferrer"
        >{{ project.label }} →</a>
        <span v-else-if="project.wip" class="proj__wip">in progress —</span>
      </article>
      <div class="proj__rule"></div>
    </section>
  </div>
</template>

<script setup>
import projects from '../data/projects.json';
</script>

<style scoped>
.projects {
  padding: 64px 40px 84px;
}

.projects__head {
  max-width: 880px;
  margin: 0 auto 8px;
}

.projects__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(32px, 4.6vw, 52px);
  line-height: 1.06;
  margin: 14px 0 0;
}

.projects__lede {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 19px;
  color: var(--muted);
  margin: 16px 0 0;
  max-width: 52ch;
}

.projects__list {
  max-width: 880px;
  margin: 0 auto;
}

.proj {
  border-top: 1px solid var(--line);
  padding: 32px 0;
  display: grid;
  gap: 12px;
}

.proj__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.proj__name {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 28px;
  line-height: 1.1;
  margin: 0;
}

.proj__dates {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.proj__tech {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent2);
}

.proj__summary {
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
  margin: 0;
  max-width: 64ch;
}

.proj__link {
  justify-self: start;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--accent);
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;
}

.proj__link:hover,
.proj__link:focus-visible {
  color: var(--accent2);
  border-color: var(--accent2);
}

.proj__wip {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--faint);
}

.proj__rule {
  border-top: 1px solid var(--line);
}

@media (max-width: 760px) {
  .projects { padding: 44px 22px 64px; }
}
</style>
