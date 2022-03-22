/**
 * Converts string to number. Returns undefined if isNaN(s)
 * @param s String
 * @returns Number or undefined
 */
export default function safeNumber(s: string): number | undefined {
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return n;
}
