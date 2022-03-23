/**
 * Converts Y/N to boolean
 * @param s String
 * @returns boolean
 */
export default function yNToBoolean(s: string): boolean {
  return s === "Y" || s === "I";
}
