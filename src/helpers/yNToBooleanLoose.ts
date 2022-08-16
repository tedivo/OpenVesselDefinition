import { TYesNo } from "../models/base/types/IPositionPatterns";

/**
 * Converts Y/N to TYesNo
 * @param s String
 * @returns TYesNo
 */
export default function yNToBooleanLoose(s: string): TYesNo | undefined {
  return s !== "" && s !== "-" ? 1 : undefined;
}
