import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { theme, watchTheme } from './useTheme.js';

// The light on the landing page's desk follows the real sky over Valencia:
// the sun by day; at night - or whenever the site is dark - the lamp, and the
// moon through the same window when it is up, as bright as its phase.

const LAT = 39.47;
const LON = -0.38;
const R = Math.PI / 180;
const OBLIQUITY = 23.4397 * R;

/* ---- Low-precision astronomy (after Meeus; good to well under a degree) --- */
const daysSinceJ2000 = (date) => (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 864e5;
const rightAscension = (l, b) => Math.atan2(Math.sin(l) * Math.cos(OBLIQUITY) - Math.tan(b) * Math.sin(OBLIQUITY), Math.cos(l));
const declination = (l, b) => Math.asin(Math.sin(b) * Math.cos(OBLIQUITY) + Math.cos(b) * Math.sin(OBLIQUITY) * Math.sin(l));

function sunCoords(d) {
  const M = (357.5291 + 0.98560028 * d) * R;
  const C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * R;
  const L = M + C + 102.9372 * R + Math.PI;
  return { ra: rightAscension(L, 0), dec: declination(L, 0), dist: 149598000 };
}

function moonCoords(d) {
  const L = (218.316 + 13.176396 * d) * R;
  const M = (134.963 + 13.064993 * d) * R;
  const F = (93.272 + 13.22935 * d) * R;
  const l = L + 6.289 * R * Math.sin(M);
  const b = 5.128 * R * Math.sin(F);
  return { ra: rightAscension(l, b), dec: declination(l, b), dist: 385001 - 20905 * Math.cos(M) };
}

// Elevation above the horizon, and the compass bearing it shines from (0 = north).
function place({ ra, dec }, d) {
  const lw = -LON * R;
  const phi = LAT * R;
  const H = (280.16 + 360.9856235 * d) * R - lw - ra;
  const elevation = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const fromSouth = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
  return { elevation: elevation / R, azimuth: ((fromSouth / R + 180) % 360 + 360) % 360 };
}

export function sky(date) {
  const d = daysSinceJ2000(date);
  const s = sunCoords(d);
  const m = moonCoords(d);
  // How much of the moon's face is lit, 0 (new) to 1 (full).
  const phi = Math.acos(Math.sin(s.dec) * Math.sin(m.dec) + Math.cos(s.dec) * Math.cos(m.dec) * Math.cos(s.ra - m.ra));
  const inc = Math.atan2(s.dist * Math.sin(phi), m.dist - s.dist * Math.cos(phi));
  return { sun: place(s, d), moon: { ...place(m, d), lit: (1 + Math.cos(inc)) / 2 } };
}

/* ---- From the sky to the desk -------------------------------------------- */
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// Where a window patch lands for a light source at this elevation and bearing:
// it falls away from the source, further and longer the lower the source is.
function windowFor({ elevation: el, azimuth: az }, skew) {
  const dir = (az + 180) * R;
  const stretch = Math.min(1.9, (1 / Math.tan(Math.max(8, el) * R)) * 0.35 + 0.75);
  const dist = Math.min(520, 140 + stretch * 120);
  const dx = Math.sin(dir) * dist;
  const dy = -Math.cos(dir) * dist;
  const angle = Math.atan2(dy, dx) / R - 90;
  return {
    dir,
    transform: `translate(${dx.toFixed(0)}px, ${dy.toFixed(0)}px) rotate(${angle.toFixed(1)}deg) scale(1, ${stretch.toFixed(3)}) skewX(${skew.toFixed(1)}deg)`
  };
}

// Everything the desk needs to draw itself at a given moment, as CSS values.
export function lightingAt(date, dark = false) {
  const { sun, moon } = sky(date);
  const el = sun.elevation;
  // In the dark theme it is always night on the desk.
  const day = dark ? 0 : smooth(-3, 8, el);
  const night = dark ? 1 : 1 - smooth(-10, -1, el);
  const warm = 1 - smooth(4, 35, el);
  // Moonlight: only once the sun has gone, only while the moon is up, and as
  // bright as its phase.
  const moonlight = night * smooth(-1, 6, moon.elevation) * moon.lit;

  const byDay = day > 0.001;
  const source = byDay ? sun : moon;
  const win = windowFor(source, byDay ? warm * 12 : 0);

  // Shadows of the things on the desk: from the sun by day; at night from the
  // lamp (up and to the right of the card), so they fall down and to the left.
  const reach = byDay ? Math.min(26, 5 + (1 / Math.tan(Math.max(6, el) * R)) * 3.2) : 12;
  const sx = byDay ? Math.sin(win.dir) * reach * day : -9;
  const sy = byDay ? -Math.cos(win.dir) * reach * day : 11;

  const glow = byDay ? day : moonlight * (dark ? 0.26 : 0.7);
  const colour = byDay ? mix([255, 252, 242], [255, 196, 122], warm) : [188, 206, 255];

  return {
    '--desk-window-opacity': glow.toFixed(3),
    '--desk-night': (night * 0.9).toFixed(3),
    '--desk-sun': `rgb(${colour.join(',')})`,
    '--desk-blur': `${(byDay ? 6 + warm * 10 : 12).toFixed(1)}px`,
    '--desk-window': win.transform,
    '--desk-shadow-x': `${sx.toFixed(1)}px`,
    '--desk-shadow-y': `${sy.toFixed(1)}px`,
    '--desk-shadow-blur': `${(6 + reach * 0.5 + night * 6).toFixed(1)}px`,
    '--desk-shadow-alpha': (dark ? 0.55 : 0.16 + day * 0.14).toFixed(3)
  };
}

// Reactive CSS variables for the desk, refreshed every minute and whenever the
// theme changes. In development, ?t=19:30 previews another time today and
// ?at=2026-10-26T22:00Z any moment at all (a full moon, say).
export function useDeskLight() {
  const style = ref({});
  let timer = 0;

  function moment() {
    if (import.meta.env.DEV) {
      const at = new URLSearchParams(window.location.search).get('at');
      if (at && !Number.isNaN(Date.parse(at))) return new Date(at);
      const t = new URLSearchParams(window.location.search).get('t');
      const m = t && t.match(/^(\d{1,2}):(\d{2})$/);
      if (m) {
        const now = new Date();
        const valencia = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
        return new Date(now.getTime() + ((+m[1] - valencia.getHours()) * 60 + (+m[2] - valencia.getMinutes())) * 60000);
      }
    }
    return new Date();
  }

  const update = () => {
    style.value = lightingAt(moment(), theme.value === 'dark');
  };

  onMounted(() => {
    watchTheme();
    update();
    timer = window.setInterval(update, 60000);
  });
  watch(theme, update);
  onBeforeUnmount(() => window.clearInterval(timer));

  return style;
}
