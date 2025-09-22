<template>
  <article class="card project-card">
    <header>
      <h3>{{ title }}</h3>
      <p v-if="dates" class="project-card__dates">{{ dates }}</p>
    </header>
    <p class="project-card__summary">{{ summary }}</p>
    <ul v-if="tech?.length" class="badges">
      <li v-for="item in tech" :key="item">{{ item }}</li>
    </ul>
    <div v-if="links?.length" class="project-card__actions">
      <a
        v-for="link in links"
        :key="link.label + link.href"
        class="project-card__link"
        :href="link.href"
        target="_blank"
        rel="noreferrer"
      >
        {{ link.label }}
      </a>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  tech: { type: Array, default: () => [] },
  dates: { type: String, default: '' },
  summary: { type: String, default: '' },
  links: { type: Array, default: () => [] }
});
</script>

<style scoped>
.project-card__dates {
  color: var(--muted);
  font-size: 0.95rem;
}

.project-card__summary {
  color: var(--muted);
}

.project-card__actions {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.project-card__link {
  font-weight: 600;
  color: var(--accent-strong);
}

.project-card__link:hover,
.project-card__link:focus-visible {
  color: var(--accent);
}
</style>
