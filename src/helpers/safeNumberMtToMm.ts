/**
 * Converts string to number. Returns undefined if isNaN(s)
 * @param s String
 * @returns Number or undefined
 */
export default function safeNumberMtToMm(s: string): number | undefined {
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return Math.round(n * 1000);
}

export function safeNumberKgToGrams(s: string): number | undefined {
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return Math.round(n * 1000);
}
