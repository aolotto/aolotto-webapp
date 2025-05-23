export function toBalanceValue(balance: number, precision: number, len?: number): string {
  const n = (balance / Math.pow(10, precision)).toFixed(len || 0);
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  const _n = parseFloat(String(n))
  return _n.toLocaleString()
}

export function toBalanceQuantity(value: number, precision: number): number {
  return value * Math.pow(10, precision);
}

export function formatTimezoneString(timezone: string, offset: number): string {
  const offsetStr = offset > 0 ? "+" + offset : offset.toString();
  return timezone + "(" + offsetStr + ")";
}

export function formartOffsetHours(offset?: number): number {
  offset = offset || new Date().getTimezoneOffset();
  return (0 - offset / 60);
}

export function formartOffsetString(offset?: number, prefix?: string): string {
  prefix = prefix || "GMT";
  offset = offset || new Date().getTimezoneOffset();
  const h = (0 - offset / 60);
  return h > 0 ? prefix + "+" + h : prefix + h;
}

export function getDateString(timestamp?: number) : string {
  var date = new Date(timestamp);
  var y = date.getFullYear(),
  m = date.getMonth() + 1,
  d = date.getDate();
  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  var t = y + '-' + m + '-' + d
  return t;
}

export function getDateTimeString(timestamp?: number) : string {
  var date = new Date(timestamp);
  var y = date.getFullYear(),
  m = date.getMonth() + 1,
  d = date.getDate(),
  H = date.getHours(),
  M = date.getMinutes(),
  S = date.getSeconds(),
  MS = date.getMilliseconds()

  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  if (H < 10) { H = '0' + H; }
  if (M < 10) { M = '0' + M; }
  if (S < 10) { S = '0' + S; }
  var t = y + '-' + m + '-' + d + 'T' + H + ":" + M + ":" + S 
  return t;
}

export async function digestMessage(message: string, algo: string = 'SHA-1'): Promise<string> {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(algo, new TextEncoder().encode(message))
    ),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');
}

export function shortStr(text: string, len?: number, space?: string): string {
  const first = len || 8;
  const end = len ? -len - 1 : -7;
  return text.slice(0, first) + (space || "...") + text.slice(end);
}


export function generateRange(digit: number) {
  digit = Number(digit)
  if (digit < 1) {
    throw new Error("digit 必须大于 0");
  }
  const start = '0'.repeat(digit);
  const end = '9'.repeat(digit);
  return `${start}-${end}`;
}