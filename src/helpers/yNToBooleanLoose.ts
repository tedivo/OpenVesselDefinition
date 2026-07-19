import { TYesNo } from "../models/base/types/IPositionPatterns";

/**
 * Converts Y/N to TYesNo
 * @param s String
 * @returns TYesNo
 */
export default function yNToBooleanLoose(s: string): TYesNo | undefined {
  if (s === "" || s === "-") return undefined;
  return s === "N" ? 0 : 1;
}
