/**
 * Converts string to number. Returns undefined if isNaN(s)
 * @param s String
 * @returns Number or undefined
 */
export function safeNumberMtToMm(s: string): number | undefined {
  // Number("") and Number("  ") are 0, not NaN, so a blank/whitespace-only field (e.g.
  // a STAF line with fewer columns than headers) must be rejected before the isNaN
  // check below, or it would be treated as a real 0 value instead of "missing".
  if (!s || s.trim() === "") return undefined;
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return Math.round(n * 1000);
}

export function safeNumberTonsToGrams(s: string): number | undefined {
  if (!s || s.trim() === "") return undefined;
  const n = Number(s);
  if (isNaN(n)) return undefined;
  return Math.round(n * 1000000);
}

export function safeNumberMmToMt(sn: number | string | undefined): string {
  if (sn === undefined) return "-";
  const n = typeof sn === "string" ? Number(sn) : sn;
  if (isNaN(n) || globalThis.isNaN(n)) return "-";

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
