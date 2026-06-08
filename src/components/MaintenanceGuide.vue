<template>
  <section class="cmg" aria-labelledby="cmg-title">
    <header class="cmg__head">
      <h2 id="cmg-title" class="cmg__title">How to log a service</h2>
      <p class="cmg__sub">Record each job once in a small JSON file — the dashboard does the maths.</p>
    </header>

    <!-- Colour legend -->
    <div class="cmg-block">
      <h3 class="cmg-block__title">What the colours mean</h3>
      <ul class="cmg-legend">
        <li v-for="s in statusLegend" :key="s.id" class="cmg-legend__item">
          <span class="cmg-legend__dot" :style="{ background: s.color }"></span>
          <span class="cmg-legend__text">
            <strong :style="{ color: s.color }">{{ s.label }}</strong>
            <span>{{ s.desc }}</span>
          </span>
        </li>
      </ul>
    </div>

    <!-- Steps + annotated file -->
    <div class="cmg-how">
      <ol class="cmg-steps">
        <li class="cmg-step">
          <span class="cmg-step__n">1</span>
          <div>
            <strong>Open the log</strong>
            <p>Edit <code>src/data/serviceLog.json</code> in your editor.</p>
          </div>
        </li>
        <li class="cmg-step">
          <span class="cmg-step__n">2</span>
          <div>
            <strong>Find the item id</strong>
            <p>It matches the card title — e.g. <code>"oil"</code> or <code>"brake-fluid"</code>.</p>
          </div>
        </li>
        <li class="cmg-step">
          <span class="cmg-step__n">3</span>
          <div>
            <strong>Record what you did</strong>
            <p>Set <code>lastKm</code>, <code>lastDate</code>, or both. Save — the page updates.</p>
          </div>
        </li>
      </ol>

      <figure class="cmg-code">
        <figcaption class="cmg-code__bar">
          <span class="cmg-code__dots"><i></i><i></i><i></i></span>
          <span class="cmg-code__name">serviceLog.json</span>
        </figcaption>
        <pre class="cmg-code__body"><code v-html="codeHtml"></code></pre>
      </figure>
    </div>

    <!-- Field reference -->
    <div class="cmg-fields">
      <article class="cmg-field">
        <header>
          <code class="cmg-field__key">lastKm</code>
          <span class="cmg-field__type">number</span>
        </header>
        <p>Odometer reading (in km) at the last service. Drives the <strong>distance</strong> countdown.</p>
        <span class="cmg-field__eg">e.g. <code>42000</code></span>
      </article>
      <article class="cmg-field">
        <header>
          <code class="cmg-field__key">lastDate</code>
          <span class="cmg-field__type">string</span>
        </header>
        <p>Date of the last service as <code>YYYY-MM-DD</code>. Drives the <strong>time</strong> countdown.</p>
        <span class="cmg-field__eg">e.g. <code>"2025-10-12"</code></span>
      </article>
    </div>

    <!-- Progress timeline -->
    <div class="cmg-block">
      <h3 class="cmg-block__title">How progress is measured</h3>
      <div class="cmg-timeline">
        <div class="cmg-track">
          <div class="cmg-track__fill" :style="{ width: pin + '%' }"></div>
          <span class="cmg-pin" :style="{ left: pin + '%' }">
            <span class="cmg-pin__tag">📍 Today</span>
            <span class="cmg-pin__dot"></span>
          </span>
        </div>
        <div class="cmg-ends">
          <span>🔧 Last service</span>
          <span>🏁 Next due</span>
        </div>
      </div>
      <p class="cmg-formula">
        <strong>Next due</strong> = last service + interval. The bar fills as today moves toward it;
        items with both a km and a time interval follow whichever runs out first.
      </p>
    </div>

    <!-- Tips -->
    <ul class="cmg-tips">
      <li><span>🔁</span> Engine items (oil, filters, plugs) accept both — log the km and the date.</li>
      <li><span>⏱️</span> Time-only items (brake fluid, wipers, battery) just need a <code>lastDate</code>.</li>
      <li><span>➕</span> Leave an item out and it simply shows as <em>Not logged</em> until you add it.</li>
    </ul>
  </section>
</template>

<script setup>
import { statusLegend } from '../data/carMaintenance.js';

// Schematic position of "today" on the illustrative timeline.
const pin = 60;

// Pre-highlighted JSON sample (newlines/spacing preserved verbatim).
const codeHtml = `<span class="p">{</span>
  <span class="k">"oil"</span><span class="p">: {</span>
    <span class="k">"lastKm"</span><span class="p">: </span><span class="n">42000</span><span class="p">,</span>
    <span class="k">"lastDate"</span><span class="p">: </span><span class="s">"2025-10-12"</span>
  <span class="p">},</span>
  <span class="k">"brake-fluid"</span><span class="p">: {</span>
    <span class="k">"lastDate"</span><span class="p">: </span><span class="s">"2024-07-01"</span>
  <span class="p">}</span>
<span class="p">}</span>`;
</script>

<style scoped>
.cmg {
  margin-top: var(--space-2xl);
  padding: var(--space-2xl);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(110, 231, 183, 0.1), transparent 55%),
    var(--card);
  box-shadow: var(--shadow);
  display: grid;
  gap: var(--space-2xl);
}

.cmg__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.cmg__sub {
  color: var(--muted);
  margin-top: var(--space-xs);
}

.cmg-block__title,
.cmg-field header {
  margin-bottom: var(--space-md);
}

.cmg-block__title {
  font-size: 1.05rem;
}

/* Legend */
.cmg-legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: var(--space-md);
}

.cmg-legend__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
}

.cmg-legend__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.cmg-legend__text {
  display: grid;
  gap: 2px;
  font-size: 0.88rem;
  color: var(--muted);
}

.cmg-legend__text strong {
  font-size: 0.92rem;
}

/* Steps + code */
.cmg-how {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: var(--space-xl);
  align-items: start;
}

.cmg-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-lg);
}

.cmg-step {
  display: flex;
  gap: var(--space-md);
}

.cmg-step__n {
  flex-shrink: 0;
  width: 1.9rem;
  height: 1.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
  color: #052318;
  background: var(--accent);
}

.cmg-step strong {
  display: block;
}

.cmg-step p {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 2px;
}

/* Code card */
.cmg-code {
  margin: 0;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: var(--shadow);
}

.cmg-code__bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: #111a2e;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.cmg-code__dots {
  display: inline-flex;
  gap: 6px;
}

.cmg-code__dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b4a66;
}

.cmg-code__name {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
  color: #93a3bd;
}

.cmg-code__body {
  margin: 0;
  padding: var(--space-lg);
  background: #0b1220;
  overflow-x: auto;
}

.cmg-code__body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.86rem;
  line-height: 1.7;
  color: #cdd6e4;
}

.cmg-code__body :deep(.k) { color: #7dd3fc; }
.cmg-code__body :deep(.s) { color: #6ee7b7; }
.cmg-code__body :deep(.n) { color: #fbbf24; }
.cmg-code__body :deep(.p) { color: #64748b; }

/* Field reference */
.cmg-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: var(--space-lg);
}

.cmg-field {
  display: grid;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
}

.cmg-field header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: 0;
}

.cmg-field__key {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 700;
  color: var(--accent-strong);
}

.cmg-field__type {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  padding: 1px var(--space-sm);
  border: 1px solid var(--border);
  border-radius: 999px;
}

.cmg-field p {
  color: var(--muted);
  font-size: 0.9rem;
}

.cmg-field__eg {
  font-size: 0.82rem;
  color: var(--muted);
}

/* Timeline */
.cmg-timeline {
  margin-top: var(--space-xs);
}

.cmg-track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text) 10%, transparent);
  margin: 2.4rem 0 var(--space-sm);
}

.cmg-track__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
}

.cmg-pin {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  justify-items: center;
}

.cmg-pin__tag {
  position: absolute;
  bottom: 0.9rem;
  white-space: nowrap;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text);
}

.cmg-pin__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-strong);
  border: 3px solid var(--card);
  box-shadow: 0 0 0 1px var(--border);
}

.cmg-ends {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
}

.cmg-formula {
  margin-top: var(--space-md);
  font-size: 0.85rem;
  color: var(--muted);
}

.cmg-formula strong {
  color: var(--text);
}

/* Tips */
.cmg-tips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-sm);
}

.cmg-tips li {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  font-size: 0.9rem;
  color: var(--muted);
}

.cmg-tips li span {
  flex-shrink: 0;
}

/* Inline code shared look */
.cmg code:not([class]) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  padding: 1px 5px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
}

@media (max-width: 760px) {
  .cmg {
    padding: var(--space-xl);
  }

  .cmg-how {
    grid-template-columns: 1fr;
  }
}
</style>
