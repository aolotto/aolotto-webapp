/**
 * Converts a balance value into a formatted string representation with specified precision.
 *
 * @param balance - The numeric balance value to be converted.
 * @param precision - The number of decimal places to consider for the balance.
 * @param len - (Optional) The total number of decimal places to include in the formatted string.
 *               If not provided, defaults to the value of `precision`.
 * @returns A string representation of the balance value, formatted with commas as thousand separators
 *          and rounded to the specified precision.
 */
export function toBalanceValue(balance: number, precision: number, len?: number): string {
  precision = precision || 0
  const n = (balance / (10 ** precision)).toFixed(len || precision);
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  const _n = parseFloat(String(n))
  return _n.toLocaleString()
}

/**
 * Shortens a string by keeping the first and last parts of the string,
 * separated by a specified spacer or ellipsis by default.
 *
 * @param text - The input string to be shortened.
 * @param len - The number of characters to keep from the start and end of the string. Defaults to 8 for the start and 7 for the end.
 * @param space - The string to insert between the start and end parts. Defaults to "...".
 * @returns The shortened string with the specified format.
 */
export function shortStr(text: string, len?: number, space?: string): string {
  const first = len || 8;
  const end = len ? -len - 1 : -7;
  return text.slice(0, first) + (space || "...") + text.slice(end);
}