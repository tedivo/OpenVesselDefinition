import IBayLevelData, {
  IBaySlotData,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoTierPattern,
  IJoinedRowTierPattern,
} from "../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IMasterCGs } from "../../models/v1/parts/IShipData";
import ISizeSummary from "../../models/base/ISizeSummary";
import { cloneObject } from "../../helpers/objectHelpers";
import { pad2 } from "../../helpers/pad";

const MAX_BELOW_TIER = 66;

/**
 * Remaps above tiers numbers STAF <-> OVD.
 */
export function tiersRemap({
  sizeSummary,
  masterCGs,
  bls,
  tier82is,
}: {
  sizeSummary: ISizeSummary;
  masterCGs: IMasterCGs;
  bls: IBayLevelData[];
  tier82is: number;
}): { bls: IBayLevelData[]; sizeSummary: ISizeSummary; masterCGs: IMasterCGs } {
  if (
    tier82is === undefined ||
    sizeSummary.maxAboveTier === undefined ||
    sizeSummary.minAboveTier === undefined ||
    isNaN(tier82is) ||
    tier82is === 82
  )
    return {
      bls,
      sizeSummary,
      masterCGs,
    };

  const aboveTierDiff = 82 - tier82is;
  const newBls: IBayLevelData[] = new Array(bls.length);

  // Size Summary
  const newSizeSummary = { ...sizeSummary };
  newSizeSummary.maxAboveTier = sizeSummary.maxAboveTier - aboveTierDiff;
  newSizeSummary.minAboveTier = sizeSummary.minAboveTier - aboveTierDiff;

  // Master CGs. Rebuilt from scratch (rather than mutated in place) so a remapped tier
  // replaces its old key instead of leaving both the old and new tier keys present.
  const newMCGs: IMasterCGs = cloneObject(masterCGs);
  const newBottomBases: IMasterCGs["bottomBases"] = {};
  (Object.keys(masterCGs.bottomBases) as IIsoTierPattern[]).forEach((tier) => {
    const iTier = Number(tier);

    const newTier =
      sizeSummary.minAboveTier !== undefined &&
      iTier >= sizeSummary.minAboveTier
        ? pad2(iTier - aboveTierDiff)
        : tier;

    newBottomBases[newTier] = masterCGs.bottomBases[tier];
  });
  newMCGs.bottomBases = newBottomBases;

  // Bays data
  bls.forEach((bl, arrIdx) => {
    if (bl.level === BayLevelEnum.ABOVE) {
      const { perSlotInfo, ...blBase } = bl;
      const newBl: IBayLevelData = { ...blBase };

      // Remap slots (key & "pos")
      if (perSlotInfo !== undefined) {
        const newperSlotInfo: IBaySlotData = {};

        const slotKeys = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];
        slotKeys.forEach((slotKey) => {
          const tier = slotKey.substring(2);
          const iTier = Number(tier);

          if (iTier > MAX_BELOW_TIER) {
            const newTier = pad2(iTier - aboveTierDiff);
            const newSlotKey = `${slotKey.substring(
              0,
              2,
            )}${newTier}` as IJoinedRowTierPattern;
            newperSlotInfo[newSlotKey] = perSlotInfo[slotKey];
            newperSlotInfo[newSlotKey].pos = newSlotKey;
          } else {
            newperSlotInfo[slotKey] = perSlotInfo[slotKey];
          }
        });

        newBl.perSlotInfo = newperSlotInfo;
      }

      newBls[arrIdx] = newBl;
    } else {
      newBls[arrIdx] = bl;
    }
  });

  return {
    bls: newBls,
    sizeSummary: newSizeSummary,
    masterCGs: newMCGs,
  };
}
