<template>
  <section class="view-section">
    <div class="wrap">
      <!-- Vehicle hero -->
      <header class="cm-hero">
        <div class="cm-hero__art">
          <img
            class="cm-car"
            :src="mx5Photo"
            width="1200"
            height="455"
            alt="Mazda MX-5 (ND, 2015) in Soul Red Crystal with the soft top up"
          />
        </div>
        <div class="cm-hero__info">
          <p class="cm-hero__eyebrow">Maintenance dashboard</p>
          <h1 class="cm-hero__name">{{ vehicle.name }}</h1>
          <p class="cm-hero__sub">{{ vehicle.generation }} · {{ vehicle.year }} · {{ vehicle.engine }}</p>
          <ul class="cm-specs">
            <li v-for="spec in vehicle.specs" :key="spec.label" class="cm-spec">
              <span class="cm-spec__label">{{ spec.label }}</span>
              <span class="cm-spec__value">
                <span v-if="spec.label === 'Paint'" class="cm-swatch"></span>{{ spec.value }}
              </span>
            </li>
          </ul>
        </div>
      </header>

      <!-- Status overview -->
      <div class="cm-overview">
        <div class="cm-donut" :style="{ background: summary.gradient }">
          <div class="cm-donut__hole">
            <strong>{{ summary.tracked }}</strong>
            <span>tracked</span>
          </div>
        </div>
        <div class="cm-kpis">
          <div class="cm-kpi" :style="{ '--status': statusMeta.due.color }">
            <strong>{{ summary.due }}</strong><span>Service due</span>
          </div>
          <div class="cm-kpi" :style="{ '--status': statusMeta.soon.color }">
            <strong>{{ summary.soon }}</strong><span>Due soon</span>
          </div>
          <div class="cm-kpi" :style="{ '--status': statusMeta.ok.color }">
            <strong>{{ summary.ok }}</strong><span>On track</span>
          </div>
          <div class="cm-kpi">
            <strong>{{ summary.total }}</strong><span>Items total</span>
          </div>
        </div>
      </div>

      <!-- Odometer control + most urgent service -->
      <div class="cm-panel">
        <div class="cm-odo">
          <label class="cm-odo__label" for="cm-odometer">Current odometer</label>
          <div class="cm-odo__field">
            <input
              id="cm-odometer"
              class="cm-odo__number"
              type="number"
              min="0"
              max="250000"
              step="500"
              v-model.number="odometer"
            />
            <span class="cm-odo__unit">km</span>
          </div>
          <input
            class="cm-odo__range"
            type="range"
            min="0"
            max="200000"
            step="500"
            v-model.number="odometer"
            aria-label="Adjust odometer reading"
          />
          <div class="cm-odo__scale">
            <span>0</span><span>100k</span><span>200k</span>
          </div>
          <p class="cm-odo__hint">Progress is measured from each item's last logged service.</p>
        </div>

        <div
          v-if="nextService"
          class="cm-next"
          :style="{ '--status': statusMeta[nextService.status].color }"
        >
          <span class="cm-next__tag">Most urgent service</span>
          <div class="cm-next__head">
            <span class="cm-next__icon">{{ nextService.icon }}</span>
            <div>
              <p class="cm-next__name">{{ nextService.name }}</p>
              <p class="cm-next__sub">{{ bindingRemainingText(nextService) }}</p>
            </div>
          </div>
          <div class="cm-bar">
            <span class="cm-bar__fill" :style="{ width: nextService.barPct + '%' }"></span>
          </div>
          <span class="cm-next__status">{{ statusMeta[nextService.status].label }}</span>
        </div>
      </div>

      <!-- Category filters -->
      <h2 class="cm-section-title">Service schedule</h2>
      <div class="cm-chips" role="group" aria-label="Filter by category">
        <button
          v-for="cat in categoryList"
          :key="cat"
          type="button"
          class="cm-chip"
          :class="{ 'cm-chip--active': activeCategory === cat }"
          :style="cat !== 'All' ? { '--cat': categories[cat].color } : {}"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Maintenance grid -->
      <div class="cm-grid">
        <article
          v-for="item in filtered"
          :key="item.id"
          class="cm-card"
          :style="{ '--cat': item.color, '--status': statusMeta[item.status].color }"
        >
          <div class="cm-card__top">
            <span class="cm-card__icon">{{ item.icon }}</span>
            <span class="cm-card__cat">{{ item.category }}</span>
          </div>
          <h2 class="cm-card__title">{{ item.name }}</h2>
          <div class="cm-card__badges">
            <span v-if="item.km" class="cm-pill">📏 {{ fmt(item.km) }} km</span>
            <span v-if="item.months" class="cm-pill">🗓️ {{ formatTime(item.months) }}</span>
          </div>
          <p class="cm-card__note">{{ item.note }}</p>

          <div class="cm-card__foot">
            <template v-if="item.kind === 'tracked'">
              <p class="cm-last">Last done: <strong>{{ lastDoneText(item) }}</strong></p>
              <div class="cm-progress">
                <div class="cm-bar">
                  <span class="cm-bar__fill" :style="{ width: item.barPct + '%' }"></span>
                </div>
                <span class="cm-progress__pct">{{ item.roundPct }}%</span>
              </div>
              <div class="cm-card__meta">
                <span class="cm-status"><span class="cm-dot"></span>{{ statusMeta[item.status].label }}</span>
                <span>{{ bindingRemainingText(item) }}</span>
              </div>
              <div class="cm-due">
                <span v-if="item.hasDistance">due at {{ fmt(item.dueKm) }} km</span>
                <span v-if="item.hasTime">due {{ formatDate(item.dueDate) }}</span>
              </div>
            </template>

            <p v-else-if="item.kind === 'unlogged'" class="cm-unlogged">
              Not logged yet — add it under <code>"{{ item.id }}"</code> in <code>serviceLog.json</code>.
            </p>

            <div v-else class="cm-card__meta cm-card__meta--info">
              <span class="cm-status"><span class="cm-dot"></span>{{ statusMeta[item.status].label }}</span>
              <span>no fixed interval</span>
            </div>
          </div>
        </article>
      </div>

      <MaintenanceGuide />

      <p class="cm-footnote">
        Guideline values for a 2015 MX-5 (ND) with the Skyactiv-G petrol engine under normal driving.
        Progress is counted from the last service you record in
        <code>src/data/serviceLog.json</code> — add <code>"lastKm"</code> and/or
        <code>"lastDate"</code> (<code>YYYY-MM-DD</code>) under an item's id. Severe use shortens many
        intervals; always defer to your owner's manual.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { vehicle, categories, maintenanceItems, statusLegend } from '../data/carMaintenance.js';
import serviceLog from '../data/serviceLog.json';
import MaintenanceGuide from '../components/MaintenanceGuide.vue';
import mx5Photo from '../assets/media/mx5-soul-red.png';

const odometer = ref(46500);
const activeCategory = ref('All');
const today = new Date();

const categoryList = ['All', ...Object.keys(categories)];

const statusMeta = Object.fromEntries(
  statusLegend.map((s) => [s.id, { label: s.label, color: s.color }])
);

const fmt = (n) => Number(n).toLocaleString('en-US');

const formatTime = (months) => {
  if (!months) return null;
  return months % 12 === 0 ? `${months / 12} yr` : `${months} mo`;
};

const formatDate = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const addMonths = (date, n) => {
  const r = new Date(date.getTime());
  const day = r.getDate();
  r.setMonth(r.getMonth() + n);
  if (r.getDate() < day) r.setDate(0); // clamp to end of shorter month
  return r;
};

const timeRemainingText = (days) => {
  const abs = Math.abs(days);
  let unit;
  if (abs >= 60) unit = `${Math.round(abs / 30.44)} mo`;
  else if (abs >= 14) unit = `${Math.round(abs / 7)} wk`;
  else unit = `${abs} day${abs === 1 ? '' : 's'}`;
  return days < 0 ? `Overdue by ${unit}` : `${unit} left`;
};

const bindingRemainingText = (item) => {
  if (item.binding === 'distance') {
    return item.kmRemaining < 0
      ? `Overdue by ${fmt(-item.kmRemaining)} km`
      : `${fmt(item.kmRemaining)} km left`;
  }
  return timeRemainingText(item.daysRemaining);
};

const lastDoneText = (item) => {
  const parts = [];
  if (item.lastDate) parts.push(formatDate(item.lastDate));
  if (item.lastKm !== null) parts.push(`${fmt(item.lastKm)} km`);
  return parts.join(' · ');
};

const processed = computed(() => {
  const odo = Math.max(0, Number(odometer.value) || 0);
  return maintenanceItems.map((item) => {
    const base = { ...item, color: categories[item.category].color };

    // No interval at all (e.g. timing chain) — never needs servicing.
    if (!item.km && !item.months) {
      return { ...base, kind: 'none', status: 'none' };
    }

    const log = serviceLog[item.id] || {};
    const lastKm = typeof log.lastKm === 'number' ? log.lastKm : null;
    const lastDate = log.lastDate || null;
    const hasDistance = Boolean(item.km) && lastKm !== null;
    const hasTime = Boolean(item.months) && Boolean(lastDate);

    if (!hasDistance && !hasTime) {
      return { ...base, kind: 'unlogged', status: 'unlogged', logged: false };
    }

    // Distance dimension.
    let dpct = null;
    let dueKm = null;
    let kmRemaining = null;
    if (hasDistance) {
      dueKm = lastKm + item.km;
      kmRemaining = dueKm - odo;
      dpct = ((odo - lastKm) / item.km) * 100;
    }

    // Time dimension.
    let tpct = null;
    let dueDate = null;
    let daysRemaining = null;
    if (hasTime) {
      const last = new Date(lastDate);
      dueDate = addMonths(last, item.months);
      const totalDays = (dueDate - last) / 86400000;
      const elapsedDays = (today - last) / 86400000;
      tpct = (elapsedDays / totalDays) * 100;
      daysRemaining = Math.round((dueDate - today) / 86400000);
    }

    // Whichever dimension is closest to due drives the status.
    const binding = (dpct ?? -Infinity) >= (tpct ?? -Infinity) ? 'distance' : 'time';
    const pct = Math.max(0, binding === 'distance' ? dpct : tpct);
    let status = 'ok';
    if (pct >= 100) status = 'due';
    else if (pct >= 85) status = 'soon';

    return {
      ...base,
      kind: 'tracked',
      logged: true,
      lastKm,
      lastDate,
      hasDistance,
      hasTime,
      dueKm,
      kmRemaining,
      dueDate,
      daysRemaining,
      binding,
      pct,
      barPct: Math.min(100, pct),
      roundPct: Math.round(pct),
      status
    };
  });
});

const filtered = computed(() =>
  activeCategory.value === 'All'
    ? processed.value
    : processed.value.filter((i) => i.category === activeCategory.value)
);

const nextService = computed(() => {
  const tracked = processed.value.filter((i) => i.kind === 'tracked');
  if (!tracked.length) return null;
  return [...tracked].sort((a, b) => b.pct - a.pct)[0];
});

const summary = computed(() => {
  const items = processed.value;
  const tally = (s) => items.filter((i) => i.status === s).length;
  const due = tally('due');
  const soon = tally('soon');
  const ok = tally('ok');
  const tracked = due + soon + ok;
  const dueDeg = tracked ? (due / tracked) * 360 : 0;
  const soonDeg = tracked ? (soon / tracked) * 360 : 0;
  const c = statusMeta;
  const gradient = tracked
    ? `conic-gradient(${c.due.color} 0 ${dueDeg}deg, ${c.soon.color} ${dueDeg}deg ${dueDeg + soonDeg}deg, ${c.ok.color} ${dueDeg + soonDeg}deg 360deg)`
    : `conic-gradient(${c.none.color} 0 360deg)`;
  return { due, soon, ok, tracked, total: items.length, gradient };
});
</script>

<style scoped>
/* Hero */
.cm-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: var(--space-2xl);
  align-items: center;
  padding: var(--space-2xl);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(56, 189, 248, 0.1), transparent 55%),
    var(--card);
  box-shadow: var(--shadow);
}

.cm-hero__art {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: linear-gradient(160deg, #ffffff 0%, #eef1f6 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.cm-car {
  width: min(100%, 32rem);
  height: auto;
  display: block;
}

.cm-hero__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-strong);
}

.cm-hero__name {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin-top: var(--space-xs);
}

.cm-hero__sub {
  color: var(--muted);
  margin-top: var(--space-xs);
  font-weight: 500;
}

.cm-specs {
  list-style: none;
  padding: 0;
  margin: var(--space-xl) 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
  gap: var(--space-sm);
}

.cm-spec {
  display: grid;
  gap: 2px;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
}

.cm-spec__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.cm-spec__value {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.cm-swatch {
  width: 0.85em;
  height: 0.85em;
  border-radius: 50%;
  background: #c41226;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
}

/* Status overview */
.cm-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2xl);
  margin-top: var(--space-2xl);
  padding: var(--space-xl);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow);
}

.cm-donut {
  position: relative;
  width: 124px;
  height: 124px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cm-donut__hole {
  position: absolute;
  inset: 15px;
  border-radius: 50%;
  background: var(--card);
  display: grid;
  place-items: center;
  text-align: center;
  box-shadow: inset 0 2px 10px rgba(15, 23, 42, 0.14);
}

.cm-donut__hole strong {
  font-size: 1.7rem;
  line-height: 1;
}

.cm-donut__hole span {
  font-size: 0.7rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cm-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: var(--space-md);
  flex: 1;
  min-width: 14rem;
}

.cm-kpi {
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--border);
  border-left: 3px solid var(--status, var(--border));
  border-radius: var(--radius);
  background: var(--bg);
  display: grid;
  gap: 2px;
}

.cm-kpi strong {
  font-size: 1.5rem;
  line-height: 1;
  color: var(--status, var(--text));
}

.cm-kpi span {
  font-size: 0.78rem;
  color: var(--muted);
}

/* Control panel */
.cm-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.cm-odo,
.cm-next {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-xl);
  background: var(--card);
  box-shadow: var(--shadow);
}

.cm-odo__label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  font-weight: 600;
}

.cm-odo__field {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.cm-odo__number {
  width: 100%;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 700;
  color: var(--text);
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--border);
  padding: var(--space-xs) 0;
}

.cm-odo__number:focus-visible {
  outline: none;
  border-bottom-color: var(--accent-strong);
}

.cm-odo__unit {
  color: var(--muted);
  font-weight: 600;
}

.cm-odo__range {
  width: 100%;
  margin-top: var(--space-lg);
  accent-color: var(--accent-strong);
}

.cm-odo__scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: var(--space-xs);
}

.cm-odo__hint {
  margin-top: var(--space-md);
  font-size: 0.85rem;
  color: var(--muted);
}

/* Most urgent service highlight */
.cm-next {
  display: grid;
  align-content: start;
  gap: var(--space-md);
  border-left: 4px solid var(--status);
}

.cm-next__tag {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: var(--status);
}

.cm-next__head {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.cm-next__icon {
  font-size: 1.8rem;
  line-height: 1;
}

.cm-next__name {
  font-size: 1.25rem;
  font-weight: 700;
}

.cm-next__sub {
  color: var(--muted);
  font-size: 0.9rem;
}

.cm-next__status {
  justify-self: start;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--status);
  padding: var(--space-xs) var(--space-md);
  border-radius: 999px;
  background: color-mix(in srgb, var(--status) 16%, transparent);
}

/* Progress bar (shared) */
.cm-bar {
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text) 10%, transparent);
  overflow: hidden;
}

.cm-bar__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--status);
  transition: width var(--transition);
}

/* Section title */
.cm-section-title {
  font-size: 1.3rem;
  margin: var(--space-3xl) 0 var(--space-md);
}

/* Filter chips */
.cm-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.cm-chip {
  padding: var(--space-xs) var(--space-lg);
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 600;
  transition: border-color var(--transition), color var(--transition), background var(--transition);
}

.cm-chip:hover,
.cm-chip:focus-visible {
  color: var(--text);
  border-color: var(--cat, var(--accent-strong));
}

.cm-chip--active {
  color: var(--text);
  border-color: var(--cat, var(--accent-strong));
  background: color-mix(in srgb, var(--cat, var(--accent-strong)) 16%, transparent);
}

/* Maintenance grid */
.cm-grid {
  display: grid;
  gap: var(--space-xl);
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
}

.cm-card {
  position: relative;
  display: grid;
  align-content: start;
  gap: var(--space-md);
  padding: var(--space-xl);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
}

.cm-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--cat);
}

.cm-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 28px 48px -32px rgba(15, 23, 42, 0.6);
}

.cm-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
}

.cm-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 12px;
  font-size: 1.35rem;
  background: color-mix(in srgb, var(--cat) 16%, transparent);
}

.cm-card__cat {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--cat);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 999px;
  background: color-mix(in srgb, var(--cat) 12%, transparent);
}

.cm-card__title {
  font-size: 1.2rem;
}

.cm-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.cm-pill {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
  padding: var(--space-xs) var(--space-md);
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.cm-card__note {
  color: var(--muted);
  font-size: 0.92rem;
}

.cm-card__foot {
  display: grid;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
}

.cm-last {
  font-size: 0.8rem;
  color: var(--muted);
}

.cm-last strong {
  color: var(--text);
  font-weight: 600;
}

.cm-progress {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.cm-progress .cm-bar {
  flex: 1;
}

.cm-progress__pct {
  font-size: 0.78rem;
  font-weight: 700;
  min-width: 2.6rem;
  text-align: right;
  color: var(--status);
}

.cm-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--muted);
}

.cm-card__meta--info {
  padding-top: var(--space-xs);
}

.cm-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-weight: 600;
  color: var(--status);
}

.cm-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--status);
}

.cm-due {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  font-size: 0.74rem;
  color: var(--muted);
}

.cm-due span {
  padding: 2px var(--space-sm);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
}

.cm-unlogged {
  font-size: 0.85rem;
  color: var(--muted);
  font-style: italic;
}

.cm-unlogged code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-style: normal;
  font-size: 0.85em;
  padding: 1px 5px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
}

.cm-footnote {
  margin-top: var(--space-2xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.82rem;
  max-width: 72ch;
}

.cm-footnote code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  padding: 1px 5px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
}

@media (max-width: 760px) {
  .cm-hero,
  .cm-panel {
    grid-template-columns: 1fr;
  }

  .cm-hero {
    padding: var(--space-xl);
  }
}
</style>
