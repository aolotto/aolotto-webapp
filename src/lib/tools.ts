export function toBalanceValue(balance: number, precision: number, len?: number): string {
  precision = precision || 0
  const n = (balance / (10 ** precision)).toFixed(len || precision);
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  const _n = parseFloat(String(n))
  return _n.toLocaleString()
}
