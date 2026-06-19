<template>
  <section class="svh" aria-labelledby="svh-title">
    <h2 id="svh-title" class="svh__heading">Service history</h2>
    <p class="svh__sub">
      Transcribed from the owner's service book, workshop invoices and ITV reports — newest first.
    </p>

    <ol class="svh__list">
      <li
        v-for="(entry, i) in serviceHistory"
        :key="i"
        class="svh__item"
        :style="{ '--c': historyTypes[entry.type].color }"
      >
        <span class="svh__dot" :title="historyTypes[entry.type].label">{{ historyTypes[entry.type].icon }}</span>
        <div class="svh__card">
          <div class="svh__meta">
            <span class="svh__date">{{ formatDate(entry.date) }}</span>
            <span v-if="entry.km" class="svh__km">{{ fmt(entry.km) }} km</span>
            <span class="svh__tag">{{ historyTypes[entry.type].label }}</span>
          </div>
          <p class="svh__title">{{ entry.title }}</p>
          <p v-if="entry.place" class="svh__place">{{ entry.place }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { serviceHistory, historyTypes } from '../data/serviceHistory.js';

const fmt = (n) => Number(n).toLocaleString('en-US');

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<style scoped>
.svh {
  margin-top: var(--space-3xl);
}

.svh__heading {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.svh__heading::before {
  content: '';
  width: 4px;
  height: 1.05em;
  border-radius: 999px;
  background: linear-gradient(180deg, #b25533, #a4161a);
}

.svh__sub {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: var(--space-xs);
  margin-bottom: var(--space-xl);
  max-width: 60ch;
}

.svh__list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

/* the vertical rail */
.svh__list::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 13px;
  width: 2px;
  background: var(--border);
}

.svh__item {
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
}

.svh__item:last-child {
  padding-bottom: 0;
}

.svh__dot {
  position: relative;
  z-index: 1;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  background: var(--card);
  border: 2px solid var(--c);
  box-shadow: 0 0 0 4px var(--bg);
}

.svh__card {
  border: 1px solid var(--border);
  border-left: 3px solid var(--c);
  border-radius: var(--radius);
  background: var(--card);
  padding: var(--space-md) var(--space-lg);
  transition: transform var(--transition), box-shadow var(--transition);
}

.svh__card:hover {
  transform: translateX(2px);
  box-shadow: var(--shadow);
}

.svh__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.svh__date {
  font-weight: 700;
  font-size: 0.9rem;
}

.svh__km {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--muted);
  padding: 1px var(--space-sm);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
}

.svh__tag {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c);
  margin-left: auto;
}

.svh__title {
  font-size: 0.95rem;
}

.svh__place {
  margin-top: 2px;
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
