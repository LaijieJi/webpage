<template>
  <div class="garage">
    <!-- hero -->
    <section class="g-hero">
      <p class="g-hero__eyebrow">The garage</p>
      <h1 class="g-hero__name">{{ car.name }}</h1>
      <p class="g-hero__sub">{{ car.sub }} — Soul Red, and still my favourite drive.</p>

      <div class="g-hero__stage">
        <img :src="mx5Photo" alt="Mazda MX-5 ND in Soul Red, soft top up" />
      </div>

      <div class="g-hero__cols">
        <div>
          <p class="g-hero__story">{{ car.story }}</p>
          <div class="g-odo">
            <div class="g-odo__display">
              <template v-for="(c, i) in odoChars" :key="i">
                <span v-if="c.digit" class="g-odo__digit">{{ c.ch }}</span>
                <span v-else class="g-odo__sep">{{ c.ch }}</span>
              </template>
              <span class="g-odo__unit">KM</span>
            </div>
            <p class="g-odo__hint">on the clock · {{ car.asOf }}, and still rolling</p>
          </div>
        </div>
        <div>
          <p class="g-specs__label">The car</p>
          <div v-for="spec in car.specs" :key="spec.l" class="g-spec">
            <span class="g-spec__l">{{ spec.l }}</span>
            <span class="g-spec__v">
              <span v-if="spec.swatch" class="g-spec__swatch" aria-hidden="true"></span>{{ spec.v }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- schedule -->
    <section class="g-schedule">
      <h2 class="g-h2">On the schedule</h2>
      <p class="g-schedule__summary">{{ summaryLine }}</p>
      <div class="g-schedule__list">
        <div v-for="item in schedule" :key="item.id" class="g-item" :class="{ 'is-dim': item.dim }">
          <div class="g-item__main">
            <h3 class="g-item__name">{{ item.name }}</h3>
            <p class="g-item__meta">{{ item.intervalLabel }}<span class="g-item__last">  ·  {{ item.lastLabel }}</span></p>
            <p class="g-item__note">{{ item.note }}</p>
          </div>
          <div class="g-item__status">
            <div class="g-item__label" :style="{ color: item.barVar }">{{ item.statusLabel }}</div>
            <div v-if="item.hasBar" class="g-bar">
              <div class="g-bar__fill" :style="{ width: item.pct + '%', background: item.barVar }"></div>
            </div>
          </div>
        </div>
      </div>
      <p class="g-footnote">
        Intervals are manufacturer guidelines for normal driving — halve the oil interval for short trips or
        spirited drives. Status is figured against the odometer and the last logged service.
      </p>
    </section>

    <!-- logbook -->
    <section class="g-logbook">
      <h2 class="g-h2">The logbook</h2>
      <p class="g-logbook__sub">Every visit since 2017 — newest first.</p>
      <div v-for="(e, i) in history" :key="i" class="g-log">
        <div class="g-log__when">
          <div class="g-log__date">{{ e.dateLabel }}</div>
          <div class="g-log__km">{{ e.kmLabel }}</div>
        </div>
        <div class="g-log__body">
          <span class="g-log__dot" :style="{ background: e.dot }" aria-hidden="true"></span>
          <div class="g-log__title">{{ e.title }}</div>
          <div class="g-log__type">{{ e.typeLabel }}<template v-if="e.hasPlace"> · {{ e.place }}</template></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { car, schedule, summaryLine, history, odoChars } from '../data/garage.js';
import mx5Photo from '../assets/media/mx5-soul-red.png';
</script>

<style scoped>
.garage { display: block; }

/* ---- Hero --------------------------------------------------------------- */
.g-hero {
  max-width: 1040px;
  margin: 0 auto;
  padding: 40px 40px 0;
}

.g-hero__eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--garage);
  margin: 0;
}

.g-hero__name {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(34px, 6vw, 60px);
  line-height: 1.04;
  margin: 10px 0 8px;
  color: var(--ink);
}

.g-hero__sub {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(18px, 2.4vw, 22px);
  color: var(--muted);
  margin: 0;
}

.g-hero__stage {
  position: relative;
  margin: 34px 0 6px;
}

.g-hero__stage img {
  width: min(760px, 100%);
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 26px 30px rgba(42, 38, 32, 0.28));
}

.g-hero__cols {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 52px;
  align-items: start;
  margin-top: 30px;
}

.g-hero__story {
  font-family: var(--font-serif);
  font-size: 19px;
  line-height: 1.66;
  color: var(--ink);
  margin: 0;
}

/* Odometer */
.g-odo { margin-top: 34px; }

.g-odo__display {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-weight: 500;
}

.g-odo__digit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 46px;
  background: var(--ink);
  color: var(--paper);
  border-radius: 3px;
  font-size: 27px;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.28);
}

.g-odo__sep {
  color: var(--muted);
  font-size: 27px;
  padding: 0 1px;
}

.g-odo__unit {
  margin-left: 9px;
  font-size: 13px;
  letter-spacing: 0.18em;
  color: var(--muted);
}

.g-odo__hint {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--faint);
  margin: 12px 0 0;
}

/* Specs */
.g-specs__label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 6px;
}

.g-spec {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--line);
  padding: 11px 0;
}

.g-spec__l {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.g-spec__v {
  font-family: var(--font-serif);
  font-size: 17px;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.g-spec__swatch {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--garage);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
}

/* ---- Schedule ----------------------------------------------------------- */
.g-schedule {
  max-width: 1040px;
  margin: 0 auto;
  padding: 60px 40px 0;
}

.g-h2 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(26px, 3.4vw, 34px);
  margin: 0 0 8px;
  color: var(--ink);
}

.g-schedule__summary {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--muted);
  margin: 0;
}

.g-schedule__list { margin-top: 18px; }

.g-item {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  align-items: start;
  border-top: 1px solid var(--line);
  padding: 22px 0;
}

.g-item.is-dim { opacity: 0.62; }

.g-item__name {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 21px;
  margin: 0;
  color: var(--ink);
}

.g-item__meta {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--muted);
  margin: 5px 0 0;
}

.g-item__last { color: var(--faint); }

.g-item__note {
  font-family: var(--font-serif);
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--muted);
  margin: 9px 0 0;
  max-width: 52ch;
}

.g-item__status { padding-top: 3px; }

.g-item__label {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.g-bar {
  margin-top: 11px;
  height: 5px;
  background: var(--shade);
  border-radius: 3px;
  overflow: hidden;
}

.g-bar__fill {
  height: 100%;
  border-radius: 3px;
}

.g-footnote {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.6;
  color: var(--faint);
  margin: 22px 0 0;
  max-width: 64ch;
}

/* ---- Logbook ------------------------------------------------------------ */
.g-logbook {
  max-width: 1040px;
  margin: 0 auto;
  padding: 60px 40px 84px;
}

.g-logbook__sub {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 26px;
}

.g-log {
  display: grid;
  grid-template-columns: 116px 1fr;
  gap: 22px;
}

.g-log__when {
  text-align: right;
  padding-top: 1px;
}

.g-log__date {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink);
}

.g-log__km {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--muted);
  margin-top: 2px;
}

.g-log__body {
  position: relative;
  border-left: 1px solid var(--line);
  padding: 0 0 26px 26px;
}

.g-log__dot {
  position: absolute;
  left: -5px;
  top: 5px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--paper);
}

.g-log__title {
  font-family: var(--font-serif);
  font-size: 18.5px;
  color: var(--ink);
  line-height: 1.3;
}

.g-log__type {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--faint);
  margin-top: 5px;
}

@media (max-width: 760px) {
  .g-hero { padding: 30px 22px 0; }
  .g-hero__cols { grid-template-columns: 1fr; gap: 34px; }
  .g-schedule { padding: 48px 22px 0; }
  .g-item { grid-template-columns: 1fr; gap: 12px; }
  .g-item__label { text-align: left; }
  .g-logbook { padding: 48px 22px 64px; }
}

@media (max-width: 420px) {
  .g-odo__digit { width: 26px; height: 38px; font-size: 22px; }
  .g-odo__sep { font-size: 22px; }
}
</style>
