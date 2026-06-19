// Service intervals for a Mazda MX-5 (ND, 2015) with the Skyactiv-G petrol engine.
// Figures are manufacturer guideline values for normal driving — see the footnote
// in CarMaintenanceView.vue. `km` = distance interval, `months` = time interval.

export const vehicle = {
  name: 'Mazda MX-5',
  generation: 'ND',
  year: 2015,
  engine: '2.0 Skyactiv-G',
  specs: [
    { label: 'Engine', value: '2.0 Skyactiv-G' },
    { label: 'Paint', value: 'Soul Red' },
    { label: 'Oil grade', value: '0W-20' },
    { label: 'Oil capacity', value: '≈ 4.2 L' },
    { label: 'Coolant', value: 'Mazda FL22' },
    { label: 'Gearbox', value: '6-speed manual' },
    { label: 'Brake fluid', value: 'DOT 3 / 4' }
  ]
};

// Status colours shared by the dashboard cards and the guide legend.
// Earthy, paper-friendly palette: olive = good, ochre = soon, deep red = due.
export const statusLegend = [
  { id: 'ok', label: 'On track', color: '#5b7740', desc: 'Under 85% of the interval used.' },
  { id: 'soon', label: 'Due soon', color: '#c2872b', desc: '85% or more — start planning it in.' },
  { id: 'due', label: 'Service due', color: '#a4161a', desc: 'Interval reached or passed (shows “Overdue by …”).' },
  { id: 'unlogged', label: 'Not logged', color: '#9a8f7e', desc: 'No record yet — add it to serviceLog.json.' },
  { id: 'none', label: 'Maintenance-free', color: '#8a8170', desc: 'No scheduled service, e.g. the timing chain.' }
];

export const categories = {
  Engine: { label: 'Engine', color: '#b25533' },
  Filters: { label: 'Filters', color: '#4c6b4a' },
  Fluids: { label: 'Fluids', color: '#3f6e84' },
  Brakes: { label: 'Brakes', color: '#a4161a' },
  Drivetrain: { label: 'Drivetrain', color: '#8a6d3b' },
  Tyres: { label: 'Tyres', color: '#c2872b' },
  General: { label: 'General', color: '#756b5d' }
};

export const maintenanceItems = [
  {
    id: 'oil',
    name: 'Engine oil & filter',
    icon: '🛢️',
    category: 'Engine',
    km: 12000,
    months: 12,
    note: '0W-20 full synthetic. Halve it (6 mo / 6,000 km) for track days, short hops or dusty roads.'
  },
  {
    id: 'tyre-rotation',
    name: 'Tyre rotation',
    icon: '🔄',
    category: 'Tyres',
    km: 10000,
    months: null,
    note: 'Front-to-rear swap to even out wear. Check cold pressures while the wheels are off.'
  },
  {
    id: 'cabin-filter',
    name: 'Cabin / pollen filter',
    icon: '🍃',
    category: 'Filters',
    km: 20000,
    months: 12,
    note: 'Swap yearly for clean airflow and a fog-free windscreen.'
  },
  {
    id: 'brake-pads',
    name: 'Brake pads & discs',
    icon: '🛑',
    category: 'Brakes',
    km: 20000,
    months: null,
    note: 'Inspect every 20,000 km — then replace by wear, not by the calendar.'
  },
  {
    id: 'air-filter',
    name: 'Engine air filter',
    icon: '🌬️',
    category: 'Filters',
    km: 60000,
    months: 48,
    note: 'Inspect every 20,000 km; replace sooner in dusty climates.'
  },
  {
    id: 'spark-plugs',
    name: 'Spark plugs',
    icon: '⚡',
    category: 'Engine',
    km: 60000,
    months: 72,
    note: 'Iridium plugs. Inspect earlier if the idle feels rough or fuel economy drops.'
  },
  {
    id: 'transmission-oil',
    name: 'Manual transmission oil',
    icon: '⚙️',
    category: 'Drivetrain',
    km: 90000,
    months: null,
    note: "Not on Mazda's strict schedule, but a fresh fill every ~90,000 km keeps the shift crisp."
  },
  {
    id: 'differential-oil',
    name: 'Differential oil',
    icon: '🔩',
    category: 'Drivetrain',
    km: 90000,
    months: null,
    note: 'LSD-friendly gear oil. Refresh it alongside the gearbox oil.'
  },
  {
    id: 'drive-belt',
    name: 'Accessory drive belt',
    icon: '➰',
    category: 'Engine',
    km: 100000,
    months: 96,
    note: 'Inspect every 60,000 km for cracks; plan a replacement around 100,000 km.'
  },
  {
    id: 'coolant',
    name: 'Engine coolant',
    icon: '🌡️',
    category: 'Fluids',
    km: 200000,
    months: 120,
    note: 'Long-life FL22: first change ≈ 10 yr / 200,000 km, then every 4 yr / 100,000 km.'
  },
  {
    id: 'brake-fluid',
    name: 'Brake fluid',
    icon: '🧪',
    category: 'Brakes',
    km: null,
    months: 24,
    note: 'Hygroscopic — replace every 2 years regardless of distance. Sooner if you track the car.'
  },
  {
    id: 'wipers',
    name: 'Wiper blades',
    icon: '🌧️',
    category: 'General',
    km: null,
    months: 12,
    note: 'Replace yearly or whenever they start to streak the glass.'
  },
  {
    id: 'battery',
    name: '12V battery',
    icon: '🔋',
    category: 'General',
    km: null,
    months: 48,
    note: 'Test annually; typical life 4–5 years. A convertible that sits loses charge fast.'
  },
  {
    id: 'timing-chain',
    name: 'Timing chain',
    icon: '🔗',
    category: 'Engine',
    km: null,
    months: null,
    note: 'Maintenance-free — the Skyactiv-G runs a chain, so there is no scheduled replacement.'
  }
];
