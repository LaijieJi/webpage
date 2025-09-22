<template>
  <p class="post-card__meta">
    <time :dateTime="date">{{ formattedDate }}</time>
    <span v-if="tags?.length" class="post-card__tags">
      ·
      <span v-for="tag in tags" :key="tag" class="post-card__tag">#{{ tag }}</span>
    </span>
  </p>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  date: { type: String, required: true },
  tags: { type: Array, default: () => [] }
});

const formatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' });
const formattedDate = computed(() => {
  const date = props.date ? new Date(props.date) : new Date();
  return formatter.format(date);
});
</script>

<style scoped>
.post-card__tags {
  margin-left: var(--space-xs);
  display: inline-flex;
  gap: var(--space-xs);
  color: var(--muted);
}

.post-card__tag {
  font-size: 0.85rem;
}
</style>
