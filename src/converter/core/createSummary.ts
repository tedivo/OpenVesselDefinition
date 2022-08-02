import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IBayLevelDataIntermediate } from "../../models/v1/parts/IBayLevelData";
import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import ISizeSummary from "../../models/base/ISizeSummary";
import { sortNumericAsc } from "../../helpers/sortByMultipleFields";

// Used in case bayLevel data is missing
const MAX_BELOW_TIER = 66;

/**
 * Examines the data to return a summary (bays, max/min tiers and stacks)
 * @returns Object { isoBays, centerLineStack, maxStack, maxAboveTier, minAboveTier, maxBelowTier, minBelowTier,}
 */
export default function createSummary({
  isoBays,
  bayLevelData,
}: {
  isoBays: number;
  bayLevelData: Array<IBayLevelDataIntermediate>;
}): ISizeSummary {
  const summary: ISizeSummary = {
    isoBays,
    centerLineStack: 0,
    maxStack: undefined,
    maxAboveTier: undefined,
    minAboveTier: undefined,
    maxBelowTier: undefined,
    minBelowTier: undefined,
  };

  // 0. Through Bays-Tiers
  bayLevelData.forEach((bl) => {
    addBayToSummary(bl, summary);
  });

  return summary;
}

/**
 * Mutates the summary with the maximum dimensions after checking the bl
 * @param bl Bay Data
 * @param summary Existing Summart
 */
export function addBayToSummary(
  bl: IBayLevelDataIntermediate,
  summary: ISizeSummary
) {
  // Tiers obtained from perSlotInfo
  const tiersFromSlotsInfo = bl.perSlotInfo
    ? Object.keys(bl.perSlotInfo).map((s) => s.substring(2))
    : [];
  // Tiers obtained from perTierInfo
  const tiersFromTiersInfo = bl.perTierInfo ? Object.keys(bl.perTierInfo) : [];

  // Concat and unique
  const allTiers = tiersFromSlotsInfo
    .concat(tiersFromTiersInfo)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort(sortNumericAsc)
    .map(Number);

  if (allTiers.length) {
    const maxTier = allTiers[allTiers.length - 1];
    const minTier = allTiers[0];

    if (bl.level === BayLevelEnum.ABOVE) {
      if (summary.maxAboveTier === undefined || summary.maxAboveTier < maxTier)
        summary.maxAboveTier = maxTier;
      if (summary.minAboveTier === undefined || summary.minAboveTier > minTier)
        summary.minAboveTier = minTier;
    } else if (bl.level === BayLevelEnum.BELOW) {
      if (summary.maxBelowTier === undefined || summary.maxBelowTier < maxTier)
        summary.maxBelowTier = maxTier;
      if (summary.minBelowTier === undefined || summary.minBelowTier > minTier)
        summary.minBelowTier = minTier;
    }
  }

  const stacksFromSlotsInfo = bl.perSlotInfo
    ? Object.keys(bl.perSlotInfo).map((s) => s.substring(0, 2))
    : [];
  const stacksFromStackInfo =
    bl.perStackInfo && bl.perStackInfo.each
      ? Object.keys(bl.perStackInfo.each)
      : [];

  // Concat and unique
  const allStacks = stacksFromSlotsInfo
    .concat(stacksFromStackInfo)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort()
    .map(Number);

  const bayMaxStack = allStacks[allStacks.length - 1];
  const bayMinStack = allStacks[0];

  // Centerline stack, through stack definitions
  if (!summary.centerLineStack && bayMinStack === 0)
    summary.centerLineStack = 1;

  // Max stack, through stack definitions
  if (
    bayMaxStack !== undefined &&
    (summary.maxStack === undefined || summary.maxStack < bayMaxStack)
  )
    summary.maxStack = bayMaxStack;
}
