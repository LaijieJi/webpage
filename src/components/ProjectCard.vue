<template>
  <component
    :is="isLink ? 'a' : 'div'"
    class="card project-card card--link"
    :href="isLink ? primaryHref : undefined"
    target="_blank"
    rel="noreferrer"
  >
    <header>
      <h3>{{ title }}</h3>
      <p v-if="dates" class="project-card__dates">{{ dates }}</p>
    </header>
    <p class="project-card__summary">{{ summary }}</p>
    <ul v-if="tech?.length" class="badges">
      <li v-for="item in tech" :key="item">{{ item }}</li>
    </ul>
    <span v-if="isLink" class="project-card__hint" aria-hidden="true">Abrir proyecto →</span>
  </component>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  tech: { type: Array, default: () => [] },
  dates: { type: String, default: '' },
  summary: { type: String, default: '' },
  links: { type: Array, default: () => [] }
});

const primaryHref = props.links?.[0]?.href ?? null;
const isLink = Boolean(primaryHref);
</script>

<style scoped>
.project-card__dates {
  color: var(--muted);
  font-size: 0.95rem;
}

.project-card__summary {
  color: var(--muted);
}

.card--link {
  text-decoration: none;
  color: inherit;
  position: relative;
  cursor: pointer;
}

.card--link:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

.project-card__hint {
  margin-top: auto;
  font-size: 0.85rem;
  color: var(--accent-strong);
}
</style>
