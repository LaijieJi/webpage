<template>
  <component
    :is="isLink ? 'a' : 'div'"
    class="entry"
    :class="{ 'entry--link': isLink }"
    :href="isLink ? primaryHref : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noreferrer' : undefined"
  >
    <div class="entry__head">
      <h3 class="entry__title">{{ title }}</h3>
      <span v-if="dates" class="entry__dates">{{ dates }}</span>
    </div>
    <p v-if="tech?.length" class="entry__tech">{{ tech.join(' · ') }}</p>
    <p v-if="summary" class="entry__summary">{{ summary }}</p>
    <span v-if="isLink" class="entry__hint" aria-hidden="true">Open project →</span>
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
.entry {
  border-top: 1px solid var(--line);
  padding: var(--space-2xl) 0;
  display: grid;
  gap: var(--space-sm);
  color: inherit;
  text-decoration: none;
}

.entry--link {
  cursor: pointer;
}

.entry__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.entry__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 1.7rem;
  line-height: 1.1;
  transition: color var(--transition);
}

.entry--link:hover .entry__title,
.entry--link:focus-visible .entry__title {
  color: var(--accent);
}

.entry__dates {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--muted);
  white-space: nowrap;
}

.entry__tech {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent2);
}

.entry__summary {
  font-family: var(--font-serif);
  font-size: 1.08rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 62ch;
}

.entry__hint {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

.entry--link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
</style>
