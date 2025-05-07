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
  balance = balance || 0;
  precision = precision || 0;
  const v: number = balance / (10 ** precision);
  const options: Intl.NumberFormatOptions = {
    notation:(len && len >= precision) ? "standard" :"compact",
    roundingPriority: (len && len >= precision) ? "morePrecision" : "lessPrecision"
  };

  return new Intl.NumberFormat("en-US", options).format(v);
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
  if(text == null ){return "" }
  const first = len || 8;
  const end = len ? -len - 1 : -7;
  if(text.length<=first){
    return text
  }else{
    return text.slice(0, first) + (space || "...") + text.slice(end);
  }
}


/**
 * Generates a formatted date-time string in ISO-like format (YYYY-MM-DDTHH:mm:ss).
 *
 * @param timestamp - An optional Unix timestamp (in milliseconds) to convert. 
 * If not provided, the current date and time will be used.
 * @returns A string representing the formatted date and time.
 */
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