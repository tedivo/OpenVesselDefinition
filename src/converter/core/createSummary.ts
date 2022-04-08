import ISizeSummary from "../../models/base/ISizeSummary";
import {
  IIsoStackTierPattern,
  TYesNo,
} from "../../models/base/types/IPositionPatterns";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import IShipData from "../../models/v1/parts/IShipData";

// Used in case bayLevel data is missing
const MAX_BELOW_TIER = 66;

/**
 * Examines the data to return a summary (bays, max/min tiers and stacks)
 * @returns Object { isoBays, centerLineStack, maxStack, maxAboveTier, minAboveTier, maxBelowTier, minBelowTier,}
 */
export default function createSummary({
  shipData,
  bayLevelData,
}: {
  shipData: IShipData;
  bayLevelData: Array<IBayLevelData>;
}): ISizeSummary {
  let centerLineStack: TYesNo = 0,
    maxStack: IIsoStackTierPattern | undefined = undefined,
    maxAboveTier: IIsoStackTierPattern | undefined = undefined,
    minAboveTier: IIsoStackTierPattern | undefined = undefined,
    maxBelowTier: IIsoStackTierPattern | undefined = undefined,
    minBelowTier: IIsoStackTierPattern | undefined = undefined;

  // 0. Through Bays-Tiers
  bayLevelData.forEach((bl) => {
    // Tiers obtained from perSlotInfo
    const tiersFromSlotsInfo = bl.perSlotInfo
      ? Object.keys(bl.perSlotInfo).map((s) => s.substring(2, 4))
      : [];
    // Tiers obtained from perTierInfo
    const tiersFromTiersInfo = bl.perTierInfo
      ? Object.keys(bl.perTierInfo)
      : [];

    // Concat and unique
    const allTiers = tiersFromSlotsInfo
      .concat(tiersFromTiersInfo)
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .sort() as IIsoStackTierPattern[];

    if (bl.level === BayLevelEnum.ABOVE) {
      if (allTiers.length) {
        const bayMaxAboveTier = allTiers[allTiers.length - 1];
        const bayMinAboveTier = allTiers[0];

        if (maxAboveTier === undefined || maxAboveTier < bayMaxAboveTier)
          maxAboveTier = bayMaxAboveTier;
        if (minAboveTier === undefined || minAboveTier > bayMinAboveTier)
          minAboveTier = bayMinAboveTier;
      }
    } else if (bl.level === BayLevelEnum.BELOW) {
      if (allTiers.length) {
        const bayMaxBelowTier = allTiers[allTiers.length - 1];
        const bayMinBelowTier = allTiers[0];

        if (maxBelowTier === undefined || maxBelowTier < bayMaxBelowTier)
          maxBelowTier = bayMaxBelowTier;
        if (minBelowTier === undefined || minBelowTier > bayMinBelowTier)
          minBelowTier = bayMinBelowTier;
      }
    }

    const stacksFromSlotsInfo = bl.perSlotInfo
      ? Object.keys(bl.perSlotInfo).map((s) => s.substring(0, 2))
      : [];
    const stacksFromStackInfo = bl.perStackInfo
      ? Object.keys(bl.perStackInfo)
      : [];

    // Concat and unique
    const allStacks = stacksFromSlotsInfo
      .concat(stacksFromStackInfo)
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .sort() as IIsoStackTierPattern[];

    const bayMaxStack = allStacks[allStacks.length - 1];
    const bayMinStack = allStacks[0];

    // Centerline stack, through stack definitions
    if (!centerLineStack && bayMinStack === "00") centerLineStack = 1;

    // Max stack, through stack definitions
    if (
      bayMaxStack !== undefined &&
      (maxStack === undefined || maxStack < bayMaxStack)
    )
      maxStack = bayMaxStack;
  });

  const summary: ISizeSummary = {
    isoBays: shipData.isoBays,
    centerLineStack,
    maxStack,
    maxAboveTier,
    minAboveTier,
    maxBelowTier,
    minBelowTier,
  };

  return summary;
}
