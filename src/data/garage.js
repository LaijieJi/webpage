// Garage data + maintenance schedule for the Mazda MX-5 (ND, 2015),
// mirroring the reference design. Status is figured against the odometer
// and the last logged service.

export const car = {
  name: 'Mazda MX-5',
  sub: 'ND · 2015 · 2.0 Skyactiv-G',
  currentKm: 209000,
  asOf: 'as of June 2026',
  story:
    'A recent find — I bought it in June 2026, already past 209,000 kilometres and freshly repainted in its original Soul Red. The plan is simple: keep it on a steady service rhythm and put many more slow, unhurried kilometres on the clock.',
  specs: [
    { l: 'Engine', v: '2.0 Skyactiv-G' },
    { l: 'Paint', v: 'Soul Red', swatch: true },
    { l: 'Oil grade', v: '0W-20' },
    { l: 'Oil capacity', v: '≈ 4.2 L' },
    { l: 'Coolant', v: 'Mazda FL22' },
    { l: 'Gearbox', v: '6-speed manual' },
    { l: 'Brake fluid', v: 'DOT 3 / 4' }
  ]
};

const items = [
  { id: 'oil', name: 'Engine oil & filter', km: 12000, months: 12, note: '0W-20 full synthetic. Halve it for track days, short hops or dusty roads.' },
  { id: 'tyre-rotation', name: 'Tyre rotation', km: 10000, months: null, note: 'Front-to-rear swap to even out wear; check cold pressures with the wheels off.' },
  { id: 'cabin-filter', name: 'Cabin / pollen filter', km: 20000, months: 12, note: 'Swap yearly for clean airflow and a fog-free windscreen.' },
  { id: 'brake-pads', name: 'Brake pads & discs', km: 20000, months: null, note: 'Inspect every 20,000 km — then replace by wear, not by the calendar.' },
  { id: 'air-filter', name: 'Engine air filter', km: 60000, months: 48, note: 'Inspect every 20,000 km; replace sooner in dusty climates.' },
  { id: 'spark-plugs', name: 'Spark plugs', km: 60000, months: 72, note: 'Iridium plugs. Inspect earlier if the idle feels rough or economy drops.' },
  { id: 'transmission-oil', name: 'Manual transmission oil', km: 90000, months: null, note: 'Not on the strict schedule, but a fresh fill keeps the shift crisp.' },
  { id: 'differential-oil', name: 'Differential oil', km: 90000, months: null, note: 'LSD-friendly gear oil; refresh it alongside the gearbox oil.' },
  { id: 'drive-belt', name: 'Accessory drive belt', km: 100000, months: 96, note: 'Inspect every 60,000 km for cracks; plan a change around 100,000 km.' },
  { id: 'coolant', name: 'Engine coolant', km: 200000, months: 120, note: 'Long-life FL22: first change near 200,000 km, then every 100,000 km.' },
  { id: 'brake-fluid', name: 'Brake fluid', km: null, months: 24, note: 'Hygroscopic — replace every 2 years regardless of distance.' },
  { id: 'wipers', name: 'Wiper blades', km: null, months: 12, note: 'Replace yearly, or whenever they start to streak the glass.' },
  { id: 'battery', name: '12V battery', km: null, months: 48, note: 'Test annually; a convertible that sits loses charge fast.' },
  { id: 'timing-chain', name: 'Timing chain', km: null, months: null, note: 'The Skyactiv-G runs a chain — no scheduled replacement.' }
];

const log = {
  oil: { lastKm: 204980, lastDate: '2025-07-22' },
  'air-filter': { lastKm: 204980, lastDate: '2025-07-22' },
  'spark-plugs': { lastKm: 135000, lastDate: '2023-01-20' },
  'brake-pads': { lastKm: 163000, lastDate: '2024-04-19' },
  battery: { lastDate: '2026-04-19' }
};

const NOW = new Date('2026-06-18');
const fmtKm = (n) => n.toLocaleString('en-US');

function buildSchedule(list, logbook, curKm) {
  const rank = { due: 0, soon: 1, ok: 2, unlogged: 3, none: 4 };
  const out = list.map((it) => {
    const parts = [];
    if (it.km) parts.push(fmtKm(it.km) + ' km');
    if (it.months) parts.push(it.months + ' mo');
    const intervalLabel = 'every ' + (parts.join(' · ') || '—');
    const rec = logbook[it.id];
    let status, statusLabel, pct = 0, lastLabel;
    if (it.km == null && it.months == null) {
      status = 'none'; statusLabel = 'maintenance-free'; lastLabel = 'runs for life';
    } else if (!rec) {
      status = 'unlogged'; statusLabel = 'not logged'; lastLabel = 'no record yet';
    } else {
      let frac = 0;
      if (it.km && rec.lastKm != null) frac = Math.max(frac, (curKm - rec.lastKm) / it.km);
      if (it.months && rec.lastDate) {
        const m = (NOW - new Date(rec.lastDate)) / (1000 * 60 * 60 * 24 * 30.44);
        frac = Math.max(frac, m / it.months);
      }
      pct = Math.max(3, Math.min(100, Math.round(frac * 100)));
      status = frac > 1 ? 'due' : frac >= 0.85 ? 'soon' : 'ok';
      statusLabel = frac > 1 ? 'due now' : frac >= 0.85 ? 'due soon' : 'on track';
      const bits = [];
      if (rec.lastKm != null) bits.push(fmtKm(rec.lastKm) + ' km');
      if (rec.lastDate) bits.push(new Date(rec.lastDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }));
      lastLabel = 'last · ' + bits.join(' · ');
    }
    const barVar = { ok: 'var(--accent)', soon: '#C2872B', due: 'var(--accent2)', unlogged: 'var(--line)', none: 'var(--faint)' }[status];
    return {
      id: it.id,
      name: it.name,
      intervalLabel,
      note: it.note,
      status,
      statusLabel,
      pct,
      lastLabel,
      barVar,
      hasBar: status !== 'none' && status !== 'unlogged',
      dim: status === 'unlogged' || status === 'none',
      rank: rank[status]
    };
  });
  out.sort((a, b) => a.rank - b.rank);
  return out;
}

export const schedule = buildSchedule(items, log, car.currentKm);

const counts = { due: 0, soon: 0, ok: 0, unlogged: 0, none: 0 };
schedule.forEach((s) => { if (counts[s.status] != null) counts[s.status]++; });
export const summaryLine = `${counts.due} due now · ${counts.soon} due soon · ${counts.ok} on track · ${counts.unlogged} not yet logged`;

const types = { service: 'Service', inspection: 'ITV', cosmetic: 'Bodywork', part: 'Part', milestone: 'Milestone' };
const dot = { milestone: 'var(--ink)', cosmetic: 'var(--accent2)', service: 'var(--accent)', inspection: 'var(--faint)', part: 'var(--accent)' };

const hist = [
  { date: '2026-06-05', km: 209000, type: 'milestone', title: 'Bought from the previous owner', place: 'Valencia' },
  { date: '2026-05-01', km: 209000, type: 'cosmetic', title: 'Bodywork & full repaint', place: 'Maza Motor' },
  { date: '2026-04-19', km: null, type: 'part', title: 'Battery replaced — Norauto 45Ah', place: 'Norauto' },
  { date: '2025-11-14', km: 207000, type: 'inspection', title: 'ITV roadworthiness — passed', place: '' },
  { date: '2025-07-22', km: 204980, type: 'service', title: 'Oil, oil filter & air filter', place: 'Talleres Barbado' },
  { date: '2025-01-20', km: 184000, type: 'service', title: 'Service — oils & filters', place: '' },
  { date: '2024-04-19', km: 163000, type: 'service', title: 'Oil & filters, brakes', place: 'Talleres Barbado' },
  { date: '2023-10-01', km: 148000, type: 'inspection', title: 'ITV roadworthiness — passed', place: '' },
  { date: '2023-01-20', km: 135000, type: 'service', title: 'Oil, oil & air filter, spark plugs', place: 'Talleres Barbado' },
  { date: '2022-06-20', km: 127000, type: 'cosmetic', title: 'Paint', place: '' },
  { date: '2021-11-15', km: 112000, type: 'service', title: 'Service — tyres & brakes', place: '' },
  { date: '2021-09-30', km: 108000, type: 'inspection', title: 'ITV roadworthiness — passed', place: '' },
  { date: '2020-06-18', km: 81000, type: 'service', title: 'Service — tyres & wheel alignment', place: '' },
  { date: '2019-11-12', km: 68000, type: 'service', title: 'Mazda service', place: '' },
  { date: '2019-09-03', km: 65000, type: 'inspection', title: 'ITV roadworthiness — passed', place: '' },
  { date: '2019-01-22', km: 49000, type: 'service', title: 'Oil & filters, spark plugs, brakes', place: '' },
  { date: '2017-10-30', km: 16000, type: 'service', title: 'First scheduled Mazda service', place: '' },
  { date: '2017-03-29', km: null, type: 'milestone', title: 'Bought from a Mazda dealer', place: '' }
];

export const history = hist.map((e) => {
  const d = new Date(e.date);
  return {
    dateLabel: d.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    kmLabel: e.km != null ? `${fmtKm(e.km)} km` : '—',
    title: e.title,
    typeLabel: types[e.type].toUpperCase(),
    place: e.place,
    hasPlace: !!e.place,
    dot: dot[e.type]
  };
});

// Odometer split into display characters (digits + thousands separators).
export const odoChars = car.currentKm.toLocaleString('en-US').split('').map((ch) => ({
  ch,
  digit: /\d/.test(ch)
}));

// ----- Mileage over time (sparkline above the logbook) -----
const VW = 820;
const VH = 150;
const PADX = 6;
const PADY = 16;

const points = hist
  .filter((e) => e.km != null)
  .map((e) => ({ t: new Date(e.date).getTime(), km: e.km }))
  .sort((a, b) => a.t - b.t);

const ts = points.map((p) => p.t);
const kms = points.map((p) => p.km);
const minT = Math.min(...ts);
const maxT = Math.max(...ts);
const minK = Math.min(...kms);
const maxK = Math.max(...kms);

const sx = (t) => PADX + ((t - minT) / (maxT - minT)) * (VW - 2 * PADX);
const sy = (k) => VH - PADY - ((k - minK) / (maxK - minK)) * (VH - 2 * PADY);
const coords = points.map((p) => [sx(p.t), sy(p.km)]);
const last = coords[coords.length - 1];

export const mileage = {
  viewBox: `0 0 ${VW} ${VH}`,
  line: coords.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '),
  area:
    `M${coords[0][0].toFixed(1)} ${VH} ` +
    coords.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') +
    ` L${last[0].toFixed(1)} ${VH} Z`,
  last: { x: last[0], y: last[1] },
  fromYear: new Date(minT).getFullYear(),
  toYear: new Date(maxT).getFullYear(),
  minKm: minK.toLocaleString('en-US'),
  maxKm: maxK.toLocaleString('en-US')
};
