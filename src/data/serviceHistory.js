// Full service history, transcribed from the owner's service book, workshop
// invoices (Talleres Barbado, Maza Motor), the Norauto battery receipt and the
// ITV inspection reports. Newest first. `km` is the odometer at that visit.

export const serviceHistory = [
  { date: '2026-05-01', km: 209000, type: 'cosmetic', title: 'Bodywork & full repaint', place: 'Maza Motor' },
  { date: '2026-04-19', km: null, type: 'part', title: 'Battery replaced — Norauto 45Ah / 300A', place: 'Norauto' },
  { date: '2025-11-14', km: 207000, type: 'inspection', title: 'ITV roadworthiness — passed (next due 14 Nov 2026)' },
  { date: '2025-07-22', km: 204980, type: 'service', title: 'Oil (Castrol 5W30), oil filter & air filter', place: 'Talleres Barbado' },
  { date: '2025-01-20', km: 184000, type: 'service', title: 'Service — oils & filters' },
  { date: '2024-04-19', km: 163000, type: 'service', title: 'Oil & filters, brakes', place: 'Talleres Barbado' },
  { date: '2023-10-01', km: 148000, type: 'inspection', title: 'ITV roadworthiness — passed' },
  { date: '2023-01-20', km: 135000, type: 'service', title: 'Oil, oil & air filter, spark plugs', place: 'Talleres Barbado' },
  { date: '2022-06-20', km: 127000, type: 'cosmetic', title: 'Paint' },
  { date: '2021-11-15', km: 112000, type: 'service', title: 'Service — tyres & brakes' },
  { date: '2021-09-30', km: 108000, type: 'inspection', title: 'ITV roadworthiness — passed' },
  { date: '2020-06-18', km: 81000, type: 'service', title: 'Service — tyres & wheel alignment' },
  { date: '2019-11-12', km: 68000, type: 'service', title: 'Mazda service' },
  { date: '2019-09-03', km: 65000, type: 'inspection', title: 'ITV roadworthiness — passed' },
  { date: '2019-01-22', km: 49000, type: 'service', title: 'Oil & filters, spark plugs, brakes' },
  { date: '2017-10-30', km: 16000, type: 'service', title: 'First scheduled Mazda service' },
  { date: '2017-03-29', km: null, type: 'milestone', title: 'Bought from Mazda dealer' }
];

export const historyTypes = {
  service: { label: 'Service', icon: '🔧', color: '#f97316' },
  inspection: { label: 'ITV', icon: '🛡️', color: '#38bdf8' },
  cosmetic: { label: 'Bodywork', icon: '🎨', color: '#ef4444' },
  part: { label: 'Part', icon: '🔋', color: '#10b981' },
  milestone: { label: 'Milestone', icon: '🏁', color: '#64748b' }
};
