import { TYesNo } from "../models/base/types/IPositionPatterns";

/**
 * Converts Y/N to TYesNo
 * @param s String
 * @returns TYesNo
 */
export default function yNToBoolean(s: string): TYesNo {
  return s === "Y" || s === "I" ? 1 : 0;
}
