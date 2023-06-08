/**
 * Converts string to number. Returns undefined if isNaN(s)
 * @param s String
 * @returns Number or undefined
 */
export function safeNumberMtToMm(s: string): number | undefined {
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return Math.round(n * 1000);
}

export function safeNumberTonsToGrams(s: string): number | undefined {
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return Math.round(n * 1000000);
}

export function safeNumberMmToMt(n: number | undefined): string {
  if (n === undefined || isNaN(n)) return "-";
  const s = (Math.round(n / 10) / 100).toFixed(2);
  if (s.endsWith(".00")) return s.substring(0, s.length - 1);
  return s;
}

export function safeNumberGramsToTons(n: number): string {
  if (n === undefined || isNaN(n)) return "-";
  const s = (Math.round(n / 10000) / 100).toFixed(2);
  if (s.endsWith(".00")) return s.substring(0, s.length - 1);
  return s;
}
