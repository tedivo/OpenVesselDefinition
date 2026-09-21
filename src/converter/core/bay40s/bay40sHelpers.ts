import IBayLevelData, {
  TRowInfoByLength,
} from "../../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IJoinedRowTierPattern,
} from "../../../models/base/types/IPositionPatterns";

import { TContainerLengths } from "../../../models/v1/parts/Types";

/**
 * Minimum container length, in feet, that needs two paired bays to be stowed.
 * 40', 45', 48' and 53' qualify; 20' and 24' do not.
 */
export const MIN_PAIRED_BAY_LENGTH = 40;

/** The 40'+ lengths of a `sizes` / `infoByContLength` / `rowInfoByLength` dictionary */
export function get40sKeys(
  dict: Record<string | number, unknown> | undefined,
): TContainerLengths[] {
  if (!dict) return [];
  return Object.keys(dict)
    .map(Number)
    .filter((size) => size >= MIN_PAIRED_BAY_LENGTH) as TContainerLengths[];
}

/**
 * Counts how much 40'+ data a bay holds: slots accepting a 40'+ container,
 * plus bay-level and row-level entries by length.
 *
 * Used to decide which bay of a pair currently carries the 40'+ definitions.
 * The absolute number is not meaningful on its own; it is only compared
 * against the paired bay's.
 */
export function count40sData(bl: IBayLevelData | undefined): number {
  if (!bl) return 0;

  let count = 0;

  const perSlotInfo = bl.perSlotInfo;
  if (perSlotInfo) {
    (Object.keys(perSlotInfo) as IJoinedRowTierPattern[]).forEach((pos) => {
      if (get40sKeys(perSlotInfo[pos]?.sizes).length > 0) count++;
    });
  }

  count += get40sKeys(bl.infoByContLength).length;

  const each = bl.perRowInfo?.each;

  if (each) {
    const rows = Object.keys(each) as IIsoRowPattern[];
    rows.forEach((row) => {
      count += get40sKeys(
        each[row]?.rowInfoByLength as TRowInfoByLength,
      ).length;
    });
  }

  return count;
}

/** Does this bay hold any 40'+ data at all? */
export function has40sData(bl: IBayLevelData | undefined): boolean {
  return count40sData(bl) > 0;
}
