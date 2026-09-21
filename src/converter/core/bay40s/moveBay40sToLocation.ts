import IBayLevelData, {
  IBayRowInfo,
  TBayRowInfo,
  TCommonBayInfo,
} from "../../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IJoinedRowTierPattern,
} from "../../../models/base/types/IPositionPatterns";
import { IPairedBays, IUnpairedBay, getPairedBays } from "./getPairedBays";
import { get40sKeys, has40sData } from "./bay40sHelpers";

import deriveBay40sMinBottomHeights, {
  IDerivedMinBottomHeight,
  applyBay40sMinBottomHeights,
} from "./deriveBay40sMinBottomHeights";

import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import ISlotData from "../../../models/v1/parts/ISlotData";
import { cloneObject } from "../../../helpers/objectHelpers";
import { createDictionary } from "../../../helpers/createDictionary";

export interface IMoveBay40sOptions {
  /** Which bay of each pair should end up holding the 40'+ data */
  bay40sLocation: ForeAftEnum;
  /**
   * Mark slots left with no sizes at all as `restricted: 1`, to signify a
   * deliberately empty slot rather than an undefined one. Default `false`.
   */
  setRestrictedOnEmptySlots?: boolean;
  /** Modify `baysData` in place instead of working on a clone. Default `false` */
  mutate?: boolean;
  /**
   * After moving, work out the `minBottomHeight` of each 40'+ size from the
   * two bays' `bottomBase` and write it where the file states none.
   * See {@link deriveBay40sMinBottomHeights}. Default `true`.
   */
  deriveMinBottomHeights?: boolean;
}

export interface IMovedPair extends IPairedBays {
  /** The bay the 40'+ data was taken from */
  from: ForeAftEnum;
}

export interface IMoveBay40sResult {
  /** The normalised bays: a new array unless `mutate` was set */
  baysData: IBayLevelData[];
  /** The pairs that actually had 40'+ data to move */
  movedPairs: IMovedPair[];
  /**
   * Bays holding 40'+ data that belong to no pair. Nothing was done to them:
   * a lone bay cannot follow a FWD/AFT convention. Pair them first
   * (`connectPairedBays`) and run this again.
   */
  unpairedWith40s: IUnpairedBay[];
  /** The `minBottomHeight` values written, if `deriveMinBottomHeights` was on */
  appliedMinBottomHeights: IDerivedMinBottomHeight[];
  /**
   * Rows where the file already states a `minBottomHeight` lower than the two
   * bays' geometry allows. Left untouched, and worth a human look.
   */
  minBottomHeightConflicts: IDerivedMinBottomHeight[];
}

/**
 * Moves every 40'+ definition to one side of each pair of bays, so the whole
 * vessel follows a single convention — the one recorded in
 * `shipData.bay40sLocation`.
 *
 * Use {@link detectBay40sLocation} first to find out which convention the file
 * already leans towards; this function only applies the decision.
 *
 * Everything attached to a 40'+ length travels with it:
 * - the `sizes` entries of each slot, with their per-size options;
 * - `infoByContLength` entries (LCG, weights, minimum bottom height, …);
 * - `perRowInfo.each[row].rowInfoByLength` entries.
 *
 * A row that the target bay does not define is created and seeded from the
 * source row, so the moved containers keep their TCG and bottom base instead
 * of landing on a bare row. `perRowInfo.common` is likewise copied across when
 * the target bay has none. `minTierHeights` is not carried either way: it
 * belongs to the tiers of the bay it was written for.
 *
 * When a source slot is left with no sizes, its slot-level attributes
 * (`reefer`, `coolStowProhibited`, `hazardousProhibited`) follow the 40'+
 * container to the target slot, since nothing remains for them to describe.
 *
 * Merging is gap-filling: whatever the target bay already defines wins, and
 * the source only supplies what is missing. Fields are copied generically
 * rather than one by one, so data added to the model in future travels too.
 *
 * When the two bays of a pair start at different ISO tiers, the 40'+ sizes
 * get a `minBottomHeight` derived from the difference between the bays'
 * `bottomBase` — see {@link deriveBay40sMinBottomHeights}. No `bottomBase` is
 * ever rewritten: the 20' bottoms of each bay stay where they are.
 *
 * @param baysData the vessel's `baysData`
 * @param options see {@link IMoveBay40sOptions}
 */
export default function moveBay40sToLocation(
  baysData: IBayLevelData[],
  options: IMoveBay40sOptions,
): IMoveBay40sResult {
  const {
    bay40sLocation,
    setRestrictedOnEmptySlots = false,
    mutate = false,
    deriveMinBottomHeights = true,
  } = options;

  const data = mutate ? baysData : cloneObject(baysData);

  const { pairs, unpaired } = getPairedBays(data);
  const baysDict = createDictionary(data, (bl) => `${bl.isoBay}-${bl.level}`);

  const from =
    bay40sLocation === ForeAftEnum.FWD ? ForeAftEnum.AFT : ForeAftEnum.FWD;

  const movedPairs: IMovedPair[] = [];

  pairs.forEach((pair) => {
    const fwdBay = baysDict[`${pair.fwd}-${pair.level}`];
    const aftBay = baysDict[`${pair.aft}-${pair.level}`];
    if (!fwdBay || !aftBay) return;

    const toFwd = bay40sLocation === ForeAftEnum.FWD;
    const targetBay = toFwd ? fwdBay : aftBay;
    const sourceBay = toFwd ? aftBay : fwdBay;

    if (!has40sData(sourceBay)) return; // -> already where it should be

    move40sBetweenBays(sourceBay, targetBay, setRestrictedOnEmptySlots);
    movedPairs.push({ ...pair, from });
  });

  const unpairedWith40s = unpaired.filter((u) =>
    has40sData(baysDict[`${u.isoBay}-${u.level}`]),
  );

  let appliedMinBottomHeights: IDerivedMinBottomHeight[] = [];
  let minBottomHeightConflicts: IDerivedMinBottomHeight[] = [];

  if (deriveMinBottomHeights) {
    const { toApply, conflicts } = deriveBay40sMinBottomHeights(data);
    applyBay40sMinBottomHeights(data, toApply);
    appliedMinBottomHeights = toApply;
    minBottomHeightConflicts = conflicts;
  }

  return {
    baysData: data,
    movedPairs,
    unpairedWith40s,
    appliedMinBottomHeights,
    minBottomHeightConflicts,
  };
}

/** Moves all the 40'+ data of `source` into `target`. Both are mutated. */
export function move40sBetweenBays(
  source: IBayLevelData,
  target: IBayLevelData,
  setRestrictedOnEmptySlots: boolean,
): void {
  move40sSlots(source, target, setRestrictedOnEmptySlots);
  move40sInfoByContLength(source, target);
  move40sRowInfo(source, target);
}

/** 1. The slots themselves, and what is left behind when one empties */
function move40sSlots(
  source: IBayLevelData,
  target: IBayLevelData,
  setRestrictedOnEmptySlots: boolean,
): void {
  const sourceSlots = source.perSlotInfo;
  if (!sourceSlots) return;

  const targetSlots = target.perSlotInfo || {};

  (Object.keys(sourceSlots) as IJoinedRowTierPattern[]).forEach((pos) => {
    const sourceSlot = sourceSlots[pos];
    const sizes40 = get40sKeys(sourceSlot?.sizes);
    if (!sourceSlot || sizes40.length === 0) return;

    let targetSlot = targetSlots[pos];
    if (!targetSlot) {
      targetSlot = { pos, sizes: {} };
      targetSlots[pos] = targetSlot;
    }

    sizes40.forEach((size) => {
      if (targetSlot.sizes[size] === undefined)
        targetSlot.sizes[size] = sourceSlot.sizes[size];
      delete sourceSlot.sizes[size];
    });

    // The target slot holds something now, so it is no longer a blocked slot
    if (Object.keys(targetSlot.sizes).length > 0) delete targetSlot.restricted;

    if (Object.keys(sourceSlot.sizes).length === 0) {
      CARRIED_SLOT_ATTRIBUTES.forEach((attr) =>
        carrySlotAttribute(sourceSlot, targetSlot, attr),
      );
      if (setRestrictedOnEmptySlots) sourceSlot.restricted = 1;
    }
  });

  target.perSlotInfo = targetSlots;
}

/** 2. Bay-level info by container length: LCG, weights, minimum bottom height… */
function move40sInfoByContLength(
  source: IBayLevelData,
  target: IBayLevelData,
): void {
  const sourceInfo = source.infoByContLength;
  if (!sourceInfo) return;

  const targetInfo = target.infoByContLength || {};

  get40sKeys(sourceInfo).forEach((size) => {
    const info = sourceInfo[size];
    if (info !== undefined)
      targetInfo[size] = fillGaps(targetInfo[size] || { size }, info);
    delete sourceInfo[size];
  });

  target.infoByContLength = targetInfo;
}

/** 3. Row-level info: the per-length overrides, and the row's own CGs */
function move40sRowInfo(source: IBayLevelData, target: IBayLevelData): void {
  const sourceRowInfo = source.perRowInfo;
  if (!sourceRowInfo) return;

  const targetRowInfo: TBayRowInfo = target.perRowInfo || {};

  // 3.1. Common row info, only where the target bay defines none
  if (sourceRowInfo.common) {
    const { minTierHeights: _tierHeights, ...common } = sourceRowInfo.common;
    targetRowInfo.common = fillGaps<TCommonBayInfo>(
      targetRowInfo.common || {},
      common,
    );
  }

  // 3.2. Each row
  const sourceEach = sourceRowInfo.each;
  if (sourceEach) {
    const targetEach = targetRowInfo.each || {};

    (Object.keys(sourceEach) as IIsoRowPattern[]).forEach((row) => {
      const sourceRow = sourceEach[row];
      const sizes40 = get40sKeys(sourceRow?.rowInfoByLength);
      if (!sourceRow || sizes40.length === 0) return;

      let targetRow = targetEach[row];
      if (!targetRow) {
        targetRow = { isoRow: row };
        targetEach[row] = targetRow;
      }

      // The row's own values (tcg, bottomBase, maxHeight) fill any gap in the
      // target row, so the moved 40s are not left without CGs when the target
      // bay did not define this row. `minTierHeights` stays behind: it
      // describes the tiers of the bay it was written for, and what matters
      // per size is `minBottomHeight`, inside `rowInfoByLength`.
      const {
        rowInfoByLength: _sourceByLength,
        minTierHeights: _sourceTierHeights,
        ...sourceRowScalars
      } = sourceRow;
      fillGaps(targetRow, sourceRowScalars as IBayRowInfo);

      const targetByLength = targetRow.rowInfoByLength || {};
      const sourceByLength = sourceRow.rowInfoByLength || {};

      sizes40.forEach((size) => {
        const info = sourceByLength[size];
        if (info !== undefined)
          targetByLength[size] = fillGaps(targetByLength[size] || { size }, info);
        delete sourceByLength[size];
      });

      targetRow.rowInfoByLength = targetByLength;
      if (Object.keys(sourceByLength).length === 0)
        delete sourceRow.rowInfoByLength;
    });

    targetRowInfo.each = targetEach;
  }

  target.perRowInfo = targetRowInfo;
}

/**
 * Slot attributes that describe the container rather than the cell, and so
 * belong with the 40'+ container once the source slot holds nothing else.
 */
const CARRIED_SLOT_ATTRIBUTES = [
  "reefer",
  "coolStowProhibited",
  "hazardousProhibited",
] as const;

type TCarriedSlotAttribute = (typeof CARRIED_SLOT_ATTRIBUTES)[number];

function carrySlotAttribute(
  source: ISlotData,
  target: ISlotData,
  key: TCarriedSlotAttribute,
): void {
  if (source[key] === undefined) return;
  if (target[key] === undefined) Object.assign(target, { [key]: source[key] });
  delete source[key];
}

/**
 * Copies every key of `source` that `target` leaves undefined. Generic on
 * purpose: fields added to the model later travel without editing this file.
 */
function fillGaps<T extends object>(target: T, source: T | undefined): T {
  if (!source) return target;

  (Object.keys(source) as Array<keyof T>).forEach((key) => {
    if (target[key] === undefined && source[key] !== undefined)
      target[key] = cloneObject(source[key]);
  });

  return target;
}
