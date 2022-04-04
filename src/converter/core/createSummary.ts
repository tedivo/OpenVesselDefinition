import { IObjectKey } from "../../helpers/types/IObjectKey";
import ISizeSummary from "../../models/base/ISizeSummary";
import {
  IIsoPositionPattern,
  IIsoStackTierPattern,
} from "../../models/base/types/IPositionPatterns";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import IShipData from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import destructurePosition from "./destructurePosition";

// Used in case bayLevel data is missing
const MAX_BELOW_TIER = 66;

/**
 * Examines the data to return a summary (bays, max/min tiers and stacks)
 * @returns Object { isoBays, centerLineStack, maxStack, maxAboveTier, minAboveTier, maxBelowTier, minBelowTier,}
 */
export default function createSummary({
  shipData,
  bayLevelData,
  slotData,
}: {
  shipData: IShipData;
  bayLevelData: Array<IBayLevelData>;
  slotData: IObjectKey<ISlotData, IIsoPositionPattern>;
}): ISizeSummary {
  let centerLineStack = false,
    maxStack: IIsoStackTierPattern | undefined = undefined,
    maxAboveTier: IIsoStackTierPattern | undefined = undefined,
    minAboveTier: IIsoStackTierPattern | undefined = undefined,
    maxBelowTier: IIsoStackTierPattern | undefined = undefined,
    minBelowTier: IIsoStackTierPattern | undefined = undefined;

  const slotDataPositionsArray = Object.keys(slotData) as IIsoPositionPattern[];

  // 0. Through Bays
  bayLevelData.forEach((bl) => {
    if (bl.level === BayLevelEnum.ABOVE) {
      const tiersAbove = Object.keys(
        bl.perTierInfo
      ).sort() as IIsoStackTierPattern[];

      if (tiersAbove.length) {
        const bayMaxAboveTier = tiersAbove[tiersAbove.length - 1];
        const bayMinAboveTier = tiersAbove[0];

        if (maxAboveTier === undefined || maxAboveTier < bayMaxAboveTier)
          maxAboveTier = bayMaxAboveTier;
        if (minAboveTier === undefined || minAboveTier > bayMinAboveTier)
          minAboveTier = bayMinAboveTier;
      }
    } else if (bl.level === BayLevelEnum.BELOW) {
      const tiersBelow = Object.keys(
        bl.perTierInfo
      ).sort() as IIsoStackTierPattern[];

      if (tiersBelow.length) {
        const bayMaxBelowTier = tiersBelow[tiersBelow.length - 1];
        const bayMinBelowTier = tiersBelow[0];

        if (maxBelowTier === undefined || maxBelowTier < bayMaxBelowTier)
          maxBelowTier = bayMaxBelowTier;
        if (minBelowTier === undefined || minBelowTier > bayMinBelowTier)
          minBelowTier = bayMinBelowTier;
      }
    }

    const bayStacks = Object.keys(
      bl.perStackInfo
    ).sort() as IIsoStackTierPattern[];

    const bayMaxStack = bayStacks[bayStacks.length - 1];
    const bayMinStack = bayStacks[0];

    // Centerline stack, through stack definitions
    if (!centerLineStack && bayMinStack === "00") centerLineStack = true;

    // Max stack, through stack definitions
    if (
      bayMaxStack !== undefined &&
      (maxStack === undefined || maxStack < bayMaxStack)
    )
      maxStack = bayMaxStack;
  });

  // 1. Through slots
  slotDataPositionsArray.forEach((position) => {
    const desPos = destructurePosition(position);
    if (desPos) {
      const stack = desPos.stack;
      // Centerline stack, through slots
      if (!centerLineStack && stack === "00") centerLineStack = true;
      // Max stack, through slots
      if (maxStack === undefined || maxStack < stack) maxStack = stack;

      const tier = desPos.tier;
      if (desPos.iTier <= MAX_BELOW_TIER) {
        // Below
        if (maxBelowTier === undefined || maxBelowTier < tier)
          maxBelowTier = tier;
        if (minBelowTier === undefined || minBelowTier > tier)
          minBelowTier = tier;
      } else {
        // Above
        if (maxAboveTier === undefined || maxAboveTier < tier)
          maxAboveTier = tier;
        if (minAboveTier === undefined || minAboveTier > tier)
          minAboveTier = tier;
      }
    }
  });

  const summary: ISizeSummary = {
    isoBays: shipData.isoBays,
    centerLineStack: !!centerLineStack,
    maxStack,
    maxAboveTier,
    minAboveTier,
    maxBelowTier,
    minBelowTier,
  };

  return summary;
}
