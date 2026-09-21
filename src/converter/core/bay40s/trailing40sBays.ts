import IBayLevelData, {
  IBayRowInfo,
  IBaySlotData,
  TBayRowInfo,
} from "../../../models/v1/parts/IBayLevelData";
import {
  IIsoBayPattern,
  IIsoRowPattern,
  IJoinedRowTierPattern,
} from "../../../models/base/types/IPositionPatterns";
import { get40sKeys, has40sData } from "./bay40sHelpers";

import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import { cloneObject } from "../../../helpers/objectHelpers";
import { createDictionary } from "../../../helpers/createDictionary";
import { getPairedBays } from "./getPairedBays";
import { move40sBetweenBays } from "./moveBay40sToLocation";
import { pad3 } from "../../../helpers/pad";
import { sortNumericAsc } from "../../../helpers/sortByMultipleFields";

/** A bay created or removed at the end of the vessel */
export interface ITrailing40sBayChange {
  isoBay: IIsoBayPattern;
  level: BayLevelEnum;
  /** The bay it extends from, i.e. the one just forward of it */
  pairedWith: IIsoBayPattern;
}

export interface IExpandTrailing40sBaysOptions {
  /**
   * Which bay of the pair should end up holding the 40'+ data. Defaults to
   * `AFT`, which is what most definitions use.
   */
  bay40sLocation?: ForeAftEnum;
  /** Modify `baysData` in place instead of working on a clone. Default `false` */
  mutate?: boolean;
}

export interface ITrailing40sBaysResult {
  baysData: IBayLevelData[];
  /** The bays created (expand) or removed (collapse) */
  changed: ITrailing40sBayChange[];
  /** The highest ISO bay number after the change, or 0 when there are no bays */
  maxIsoBay: number;
}

/**
 * Materialises the missing half of a pair at the end of the vessel.
 *
 * The last bay of a vessel usually has no 20' stack aft of it, so definitions
 * — and the STAF exports they come from — routinely declare the 40'+ data in
 * that last bay and never create the bay it extends into. With 009 as the last
 * bay the file says "009 holds the 40s, paired AFT" and stops there, even
 * though every other pair keeps its 40s in the aft bay.
 *
 * This creates the missing 011, mirroring the 40'-capable slots of 009 as
 * `restricted` (the space is real, but nothing can stow there on its own),
 * declares the pairing, and then places the 40'+ data on the side
 * `bay40sLocation` asks for — so the trailing pair ends up looking like every
 * other pair: 011 with the 40s, 009 with restricted slots.
 *
 * Only bays whose partner does not already exist are touched, so a bay that is
 * merely missing its `pairedBay` link is left to `connectPairedBays`.
 *
 * {@link collapseTrailing40sBays} is the inverse, for writing STAF back out.
 */
export function expandTrailing40sBays(
  baysData: IBayLevelData[],
  options: IExpandTrailing40sBaysOptions = {},
): ITrailing40sBaysResult {
  const { bay40sLocation = ForeAftEnum.AFT, mutate = false } = options;

  const data = mutate ? baysData : cloneObject(baysData);

  const { unpaired } = getPairedBays(data);
  const baysDict = createDictionary(data, bayKey);

  const changed: ITrailing40sBayChange[] = [];

  unpaired.forEach((u) => {
    const bl = baysDict[`${u.isoBay}-${u.level}`];
    if (!bl || !has40sData(bl)) return;

    const partnerIsoBay = pad3(Number(u.isoBay) + 2);

    // A partner that already exists is a pairing problem, not a missing bay
    if (data.some((b) => b.isoBay === partnerIsoBay && b.level === u.level))
      return;

    const partner = createPartnerBay(bl, partnerIsoBay);

    bl.pairedBay = ForeAftEnum.AFT;
    partner.pairedBay = ForeAftEnum.FWD;

    if (bay40sLocation === ForeAftEnum.AFT)
      move40sBetweenBays(bl, partner, true);

    data.push(partner);
    changed.push({
      isoBay: partnerIsoBay,
      level: u.level,
      pairedWith: u.isoBay,
    });
  });

  sortBays(data);

  return { baysData: data, changed, maxIsoBay: maxIsoBayOf(data) };
}

/**
 * Folds the last bay of the vessel back into its forward partner, when it
 * holds nothing but 40'+ data.
 *
 * The inverse of {@link expandTrailing40sBays}, for writing a definition back
 * out as STAF: the 40'+ data returns to the forward bay, the restricted slots
 * it left behind are filled again, and the trailing bay is dropped.
 *
 * The forward bay keeps its `pairedBay: AFT`, so the 40' bay label is still
 * written out — losing it would change what the 40s mean.
 *
 * Under the FWD convention the trailing bay holds no 40'+ data of its own,
 * only the restricted slots the forward bay's 40s extend into; it is dropped
 * just the same, since nothing can stow there alone.
 *
 * Trailing bays that carry no size at all go the same way: completing a pair
 * on one deck adds empty bays to the others, so that every bay exists at every
 * level, and none of that padding belongs in a STAF file.
 *
 * A trailing bay that also holds 20' (or 24') data is a real bay and is left
 * alone.
 */
export function collapseTrailing40sBays(
  baysData: IBayLevelData[],
  options: { mutate?: boolean } = {},
): ITrailing40sBaysResult {
  const { mutate = false } = options;

  const data = mutate ? baysData : cloneObject(baysData);

  const { pairs } = getPairedBays(data);
  const baysDict = createDictionary(data, bayKey);

  const changed: ITrailing40sBayChange[] = [];
  const toRemove = new Set<string>();

  pairs.forEach((pair) => {
    const fwdBay = baysDict[`${pair.fwd}-${pair.level}`];
    const aftBay = baysDict[`${pair.aft}-${pair.level}`];
    if (!fwdBay || !aftBay) return;

    // Only the last bay of its level, and only if it exists purely to be the
    // aft half of a 40'. That covers both conventions: the bay may hold the
    // pair's 40'+ data, or merely the restricted slots they extend into.
    if (!isLastBayOfLevel(aftBay, data)) return;
    if (!holdsOnly40sData(aftBay)) return;
    if (!has40sData(aftBay) && !has40sData(fwdBay)) return;

    move40sBetweenBays(aftBay, fwdBay, false);

    // The forward bay keeps `pairedBay: AFT`: it is still the fore half of a
    // 40' bay, and that is what names the 40' bay on the way out.
    toRemove.add(`${pair.aft}-${pair.level}`);
    changed.push({
      isoBay: pair.aft,
      level: pair.level,
      pairedWith: pair.fwd,
    });
  });

  // Then drop the padding: bays at the very end that carry no size anywhere.
  // Completing a pair on one deck adds an empty bay to the others, to keep
  // every bay present at every level; none of that belongs in a STAF file.
  const levels = data
    .map((bl) => bl.level)
    .filter((v, i, a) => a.indexOf(v) === i);

  levels.forEach((level) => {
    const ofLevel = data
      .filter((bl) => bl.level === level)
      .sort((a, b) => sortNumericAsc(b.isoBay, a.isoBay));

    for (const bl of ofLevel) {
      if (toRemove.has(bayKey(bl))) continue; // -> already going
      if (!carriesNoSizes(bl)) break; // -> a real bay, stop here

      toRemove.add(bayKey(bl));
      if (!changed.some((c) => c.isoBay === bl.isoBay && c.level === level))
        changed.push({
          isoBay: bl.isoBay,
          level,
          pairedWith: pad3(Number(bl.isoBay) - 2),
        });
    }
  });

  const result = data.filter((bl) => !toRemove.has(bayKey(bl)));

  return { baysData: result, changed, maxIsoBay: maxIsoBayOf(result) };
}

/** Does this bay declare no container size at all, anywhere? */
function carriesNoSizes(bl: IBayLevelData): boolean {
  if (Object.keys(bl.infoByContLength || {}).length > 0) return false;

  const perSlotInfo = bl.perSlotInfo;
  if (perSlotInfo) {
    const positions = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];
    if (positions.some((pos) => Object.keys(perSlotInfo[pos]?.sizes || {}).length))
      return false;
  }

  const each = bl.perRowInfo?.each;
  if (each) {
    const rows = Object.keys(each) as IIsoRowPattern[];
    if (rows.some((row) => Object.keys(each[row]?.rowInfoByLength || {}).length))
      return false;
  }

  return true;
}

/**
 * A new bay mirroring the 40'-capable slots and row geometry of `source`.
 *
 * The slots start `restricted`: the space exists but holds nothing on its own.
 * If 40'+ data is moved in afterwards, that flag is dropped as sizes arrive.
 * The rows carry the source's `bottomBase` and `tcg` so the new bay is not a
 * geometric blank — without them nothing downstream could place a container
 * in it, or work out a `minBottomHeight` for the pair.
 */
function createPartnerBay(
  source: IBayLevelData,
  isoBay: IIsoBayPattern,
): IBayLevelData {
  const perSlotInfo: IBaySlotData = {};
  const rowsWith40s = new Set<IIsoRowPattern>();

  const sourceSlots = source.perSlotInfo;
  if (sourceSlots)
    (Object.keys(sourceSlots) as IJoinedRowTierPattern[]).forEach((pos) => {
      if (get40sKeys(sourceSlots[pos]?.sizes).length === 0) return;
      perSlotInfo[pos] = { pos, sizes: {}, restricted: 1 };
      rowsWith40s.add(pos.substring(0, 2) as IIsoRowPattern);
    });

  const perRowInfo: TBayRowInfo = {};

  if (source.perRowInfo?.common) {
    const { minTierHeights: _tierHeights, ...common } = source.perRowInfo.common;
    perRowInfo.common = cloneObject(common);
  }

  const sourceEach = source.perRowInfo?.each;
  if (sourceEach) {
    const each: { [key: IIsoRowPattern]: IBayRowInfo } = {};

    (Object.keys(sourceEach) as IIsoRowPattern[]).forEach((isoRow) => {
      const sourceRow = sourceEach[isoRow];
      if (!sourceRow) return;
      if (
        !rowsWith40s.has(isoRow) &&
        get40sKeys(sourceRow.rowInfoByLength).length === 0
      )
        return;

      // Geometry only: the per-length info belongs to whichever bay holds it,
      // and `minTierHeights` to the tiers of the bay it was written for
      const {
        rowInfoByLength: _byLength,
        minTierHeights: _tierHeights,
        ...geometry
      } = sourceRow;
      each[isoRow] = cloneObject(geometry) as IBayRowInfo;
    });

    if (Object.keys(each).length > 0) perRowInfo.each = each;
  }

  const partner: IBayLevelData = {
    isoBay,
    level: source.level,
    infoByContLength: {},
    perSlotInfo,
  };

  if (source.centerLineRow !== undefined)
    partner.centerLineRow = source.centerLineRow;
  if (Object.keys(perRowInfo).length > 0) partner.perRowInfo = perRowInfo;

  return partner;
}

/** Does this bay hold 40'+ data and nothing shorter? */
function holdsOnly40sData(bl: IBayLevelData): boolean {
  const shorterThan40 = (dict: Record<string | number, unknown> | undefined) =>
    Object.keys(dict || {})
      .map(Number)
      .some((size) => size < 40);

  if (shorterThan40(bl.infoByContLength)) return false;

  const perSlotInfo = bl.perSlotInfo;
  if (perSlotInfo) {
    const positions = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];
    if (positions.some((pos) => shorterThan40(perSlotInfo[pos]?.sizes)))
      return false;
  }

  const each = bl.perRowInfo?.each;
  if (each) {
    const rows = Object.keys(each) as IIsoRowPattern[];
    if (rows.some((row) => shorterThan40(each[row]?.rowInfoByLength)))
      return false;
  }

  return true;
}

function isLastBayOfLevel(bl: IBayLevelData, baysData: IBayLevelData[]): boolean {
  return !baysData.some(
    (b) => b.level === bl.level && Number(b.isoBay) > Number(bl.isoBay),
  );
}

function bayKey(bl: IBayLevelData): string {
  return `${bl.isoBay}-${bl.level}`;
}

function maxIsoBayOf(baysData: IBayLevelData[]): number {
  return baysData.reduce((max, bl) => Math.max(max, Number(bl.isoBay)), 0);
}

function sortBays(baysData: IBayLevelData[]): void {
  baysData.sort(
    (a, b) =>
      sortNumericAsc(a.isoBay, b.isoBay) || sortNumericAsc(a.level, b.level),
  );
}
