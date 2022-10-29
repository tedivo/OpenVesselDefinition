import {
  IIsoRowPattern,
  IIsoTierPattern,
  IJoinedRowTierPattern,
} from "../models/base/types/IPositionPatterns";

import { pad2 } from "./pad";
import sortRowsArray from "./sortRowsArray";

export function getRowsAndTiersFromSlotKeys(
  slotKeys?: IJoinedRowTierPattern[]
): IRowTiersFromSlotsResult {
  if (slotKeys === undefined) {
    return {
      rows: [],
      tiers: [],
      minTier: undefined,
      maxTier: undefined,
      maxRow: undefined,
      centerLineRow: 0,
      tiersByRow: {},
    };
  }

  const rows: IIsoRowPattern[] = new Array(slotKeys.length);
  const tiers: IIsoTierPattern[] = new Array(slotKeys.length);
  const tiersByRow: ITiersByRow = {};

  let centerLineRow: 1 | 0 = 0;
  let maxRow = -Infinity;
  let minTier = Infinity;
  let maxTier = -Infinity;

  slotKeys.forEach((pos, idx) => {
    const row = pos.substring(0, 2) as IIsoRowPattern;
    const tier = pos.substring(2) as IIsoTierPattern;
    const tierAsNumber = Number(tier);
    const rowAsNumber = Number(row);

    rows[idx] = row;
    tiers[idx] = tier;

    if (!centerLineRow && row === "00") centerLineRow = 1;
    if (rowAsNumber > maxRow) maxRow = rowAsNumber;
    if (tierAsNumber < minTier) minTier = tierAsNumber;
    if (tierAsNumber > maxTier) maxTier = tierAsNumber;

    if (tiersByRow[row] === undefined) {
      tiersByRow[row] = {
        minTier: tierAsNumber,
        maxTier: tierAsNumber,
      };
    }

    if (tierAsNumber < tiersByRow[row].minTier)
      tiersByRow[row].minTier = tierAsNumber;

    if (tierAsNumber > tiersByRow[row].maxTier)
      tiersByRow[row].maxTier = tierAsNumber;
  });

  return {
    rows: rows
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .sort(sortRowsArray),
    tiers: tiers.filter((v, idx, arr) => arr.indexOf(v) === idx),
    minTier: pad2(minTier),
    maxTier: pad2(maxTier),
    maxRow: pad2(maxRow),
    centerLineRow,
    tiersByRow,
  };
}

interface IRowTiersFromSlotsResult {
  rows: IIsoRowPattern[];
  tiers: IIsoTierPattern[];
  minTier: IIsoTierPattern | undefined;
  maxTier: IIsoTierPattern | undefined;
  maxRow: IIsoRowPattern | undefined;
  centerLineRow: 1 | 0;
  tiersByRow: ITiersByRow;
}

interface ITiersByRow {
  [row: IIsoRowPattern]: {
    minTier: number;
    maxTier: number;
  };
}
