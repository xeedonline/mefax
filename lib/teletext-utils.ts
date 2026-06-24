/** Pad a string to exactly `width` characters */
export function ttPad(str: string, width: number, align: 'left' | 'right' | 'center' = 'left'): string {
  const s = str.slice(0, width);
  const pad = width - s.length;
  if (pad <= 0) return s;
  if (align === 'right') return ' '.repeat(pad) + s;
  if (align === 'center') {
    const l = Math.floor(pad / 2);
    const r = pad - l;
    return ' '.repeat(l) + s + ' '.repeat(r);
  }
  return s + ' '.repeat(pad);
}

/** Centre text in 40 columns */
export function ttCenter(str: string, width = 40): string {
  return ttPad(str, width, 'center');
}

/** A horizontal rule using box-drawing characters */
export const TT_RULE = '─'.repeat(40);
export const TT_THICK = '━'.repeat(40);
export const TT_DOTS  = '·'.repeat(40);

/** Convert an OpenMeteo weather code to a short Teletext label + icon */
export function weatherLabel(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'CLEAR', icon: '☀' };
  if (code <= 2)  return { label: 'P.CLOUDY', icon: '⛅' };
  if (code === 3) return { label: 'OVERCAST', icon: '☁' };
  if (code <= 49) return { label: 'FOGGY', icon: '🌫' };
  if (code <= 55) return { label: 'DRIZZLE', icon: '🌦' };
  if (code <= 65) return { label: 'RAIN', icon: '🌧' };
  if (code <= 75) return { label: 'SNOW', icon: '❄' };
  if (code <= 82) return { label: 'SHOWERS', icon: '🌧' };
  if (code <= 86) return { label: 'SNOW SHWRS', icon: '🌨' };
  if (code <= 99) return { label: 'THUNDERY', icon: '⛈' };
  return { label: 'UNKNOWN', icon: '?' };
}

/** Wind direction from degrees */
export function windDir(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

/** Format a flight altitude nicely */
export function fmtAlt(metres: number | null): string {
  if (metres === null || metres < 0) return '  GND';
  const ft = Math.round(metres * 3.281 / 100) * 100;
  if (ft >= 1000) return `${Math.round(ft / 100) * 100}FT`.padStart(7);
  return `${ft}FT`.padStart(7);
}

/** Format speed (m/s → knots) */
export function fmtSpeed(ms: number | null): string {
  if (ms === null || ms < 0) return '---';
  const kts = Math.round(ms * 1.944);
  return `${kts}KT`;
}

/** Days of week abbreviated */
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** Format current date for Teletext topbar: "MON 24 JUN 2026" */
export function ttDate(d = new Date()): string {
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format HH:MM for topbar */
export function ttTime(d = new Date()): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

/** Random integer between min and max (inclusive) */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random item from an array */
export function randPick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

/** Truncate a string to length with trailing ellipsis */
export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + '…';
}

/** Strip HTML tags from a string */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').trim();
}
