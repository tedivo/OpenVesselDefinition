import IBayLevelData, {
  IBayRowInfo,
} from "../../../models/v1/parts/IBayLevelData";
import {
  IIsoBayPattern,
  IIsoRowPattern,
  IJoinedRowTierPattern,
} from "../../../models/base/types/IPositionPatterns";
import { count40sData, get40sKeys } from "./bay40sHelpers";

import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import { TContainerLengths } from "../../../models/v1/parts/Types";
import { createDictionary } from "../../../helpers/createDictionary";
import { getPairedBays } from "./getPairedBays";

/** A `minBottomHeight` that follows from the geometry of a pair of bays */
export interface IDerivedMinBottomHeight {
  level: BayLevelEnum;
  /** The forward bay of the pair */
  fwd: IIsoBayPattern;
  /** The aft bay of the pair */
  aft: IIsoBayPattern;
  /** The bay currently holding the 40'+ data, where the value belongs */
  isoBay: IIsoBayPattern;
  isoRow: IIsoRowPattern;
  size: TContainerLengths;
  /** `bottomBase` of this row in the forward bay */
  fwdBottomBase: number;
  /** `bottomBase` of this row in the aft bay */
  aftBottomBase: number;
  /** The derived value: the difference between the two bottom bases */
  minBottomHeight: number;
  /** The value already present in the data, if any */
  statedMinBottomHeight?: number;
  /** The stated value is lower than the geometry allows */
  conflict: boolean;
}

export interface IDeriveBay40sMinBottomHeightsResult {
  /** Every derived value, whether or not it can be applied */
  derived: IDerivedMinBottomHeight[];
  /** The values that can be written: nothing is stated for them yet */
  toApply: IDerivedMinBottomHeight[];
  /**
   * Entries where the file already states a `minBottomHeight` lower than the
   * bays' geometry allows. Nothing is written for these: a stated value beats
   * a derived one, so the data needs a human look instead.
   */
  conflicts: IDerivedMinBottomHeight[];
}

/**
 * Works out the `minBottomHeight` of the 40'+ containers of each pair of bays
 * from the two bays' `bottomBase`.
 *
 * The two bays of a pair do not always start at the same ISO tier. A 40'
 * spanning them rests at the *higher* of the two bottoms, and whatever stows
 * underneath it in the other bay has to fill the gap. That gap — the
 * difference between the two bottom bases — is the 40's `minBottomHeight`,
 * measured from the pair's lowest `bottomBase`, which is the one that never
 * moves.
 *
 * Example: row 10 starts at tier 12 in bay 001 (`bottomBase` 4591) and at tier
 * 10 in bay 003 (`bottomBase` 2000). A 40' in row 10 can only sit at 4591, so
 * its `minBottomHeight` is 2591 — and the 20' at 003 tier 10 has to be at
 * least that tall for the 40' above it to be supported.
 *
 * The result does not depend on which bay of the pair holds the 40'+ data, so
 * {@link moveBay40sToLocation} neither creates nor destroys these values.
 * No `bottomBase` is ever rewritten.
 *
 * This is a pure calculation — nothing is modified.
 */
export default function deriveBay40sMinBottomHeights(
  baysData: IBayLevelData[],
): IDeriveBay40sMinBottomHeightsResult {
  const { pairs } = getPairedBays(baysData);
  const baysDict = createDictionary(baysData, (bl) => `${bl.isoBay}-${bl.level}`);

  const derived: IDerivedMinBottomHeight[] = [];

  pairs.forEach((pair) => {
    const fwdBay = baysDict[`${pair.fwd}-${pair.level}`];
    const aftBay = baysDict[`${pair.aft}-${pair.level}`];
    if (!fwdBay || !aftBay) return;

    // The 40'+ data lives in whichever bay holds more of it
    const fwdCount = count40sData(fwdBay);
    const aftCount = count40sData(aftBay);
    if (fwdCount === aftCount) return; // -> nothing, or an unresolved split

    const holder = fwdCount > aftCount ? fwdBay : aftBay;

    rowsAccepting40s(holder).forEach((sizes, isoRow) => {
      const fwdBottomBase = rowBottomBase(fwdBay, isoRow);
      const aftBottomBase = rowBottomBase(aftBay, isoRow);

      if (fwdBottomBase === undefined || aftBottomBase === undefined) return;

      const minBottomHeight = Math.abs(fwdBottomBase - aftBottomBase);
      if (minBottomHeight === 0) return; // -> both bays start level, no rule

      sizes.forEach((size) => {
        const statedMinBottomHeight =
          holder.perRowInfo?.each?.[isoRow]?.rowInfoByLength?.[size]
            ?.minBottomHeight;

        derived.push({
          level: pair.level,
          fwd: pair.fwd,
          aft: pair.aft,
          isoBay: holder.isoBay,
          isoRow,
          size,
          fwdBottomBase,
          aftBottomBase,
          minBottomHeight,
          statedMinBottomHeight,
          conflict:
            statedMinBottomHeight !== undefined &&
            statedMinBottomHeight < minBottomHeight,
        });
      });
    });
  });

  return {
    derived,
    toApply: derived.filter((d) => d.statedMinBottomHeight === undefined),
    conflicts: derived.filter((d) => d.conflict),
  };
}

/**
 * Writes the derived values into `baysData`. Mutates, and only fills gaps:
 * a `minBottomHeight` already stated in the file is left alone.
 */
export function applyBay40sMinBottomHeights(
  baysData: IBayLevelData[],
  toApply: IDerivedMinBottomHeight[],
): void {
  const baysDict = createDictionary(baysData, (bl) => `${bl.isoBay}-${bl.level}`);

  toApply.forEach((d) => {
    const bl = baysDict[`${d.isoBay}-${d.level}`];
    if (!bl) return;

    const perRowInfo = bl.perRowInfo || {};
    const each = perRowInfo.each || {};

    const row: IBayRowInfo = each[d.isoRow] || { isoRow: d.isoRow };
    const rowInfoByLength = row.rowInfoByLength || {};
    const info = rowInfoByLength[d.size] || { size: d.size };

    if (info.minBottomHeight === undefined)
      info.minBottomHeight = d.minBottomHeight;

    rowInfoByLength[d.size] = info;
    row.rowInfoByLength = rowInfoByLength;
    each[d.isoRow] = row;
    perRowInfo.each = each;
    bl.perRowInfo = perRowInfo;
  });
}

/** The row's `bottomBase`, falling back to the bay's common one */
function rowBottomBase(
  bl: IBayLevelData,
  isoRow: IIsoRowPattern,
): number | undefined {
  return (
    bl.perRowInfo?.each?.[isoRow]?.bottomBase ?? bl.perRowInfo?.common?.bottomBase
  );
}

/** The rows of a bay that can hold 40'+ containers, and which sizes */
function rowsAccepting40s(
  bl: IBayLevelData,
): Map<IIsoRowPattern, Set<TContainerLengths>> {
  const rows = new Map<IIsoRowPattern, Set<TContainerLengths>>();

  const add = (isoRow: IIsoRowPattern, sizes: TContainerLengths[]) => {
    if (sizes.length === 0) return;
    const set = rows.get(isoRow) || new Set<TContainerLengths>();
    sizes.forEach((s) => set.add(s));
    rows.set(isoRow, set);
  };

  const perSlotInfo = bl.perSlotInfo;
  if (perSlotInfo)
    (Object.keys(perSlotInfo) as IJoinedRowTierPattern[]).forEach((pos) =>
      add(pos.substring(0, 2) as IIsoRowPattern, get40sKeys(perSlotInfo[pos]?.sizes)),
    );

  const each = bl.perRowInfo?.each;
  if (each)
    (Object.keys(each) as IIsoRowPattern[]).forEach((isoRow) =>
      add(isoRow, get40sKeys(each[isoRow]?.rowInfoByLength)),
    );

  return rows;
}
