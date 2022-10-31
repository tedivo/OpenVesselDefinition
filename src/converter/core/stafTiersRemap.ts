import IBayLevelData, {
  IBaySlotData,
} from "../../models/v1/parts/IBayLevelData";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import ISizeSummary from "../../models/base/ISizeSummary";
import { pad2 } from "../../helpers/pad";

const MAX_BELOW_TIER = 66;

/**
 * If tier82is !== 82, it remaps all above tiers
 * @param bls
 * @param tier82is
 */
export function stafTiersRemap(
  sizeSummary: ISizeSummary,
  bls: IBayLevelData[],
  tier82is: number
): { bls: IBayLevelData[]; sizeSummary: ISizeSummary } {
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
    };

  const aboveTierDiff = 82 - tier82is;
  const newBls: IBayLevelData[] = new Array(bls.length);

  const newSizeSummary = { ...sizeSummary };
  newSizeSummary.maxAboveTier = sizeSummary.maxAboveTier - aboveTierDiff;
  newSizeSummary.minAboveTier = sizeSummary.minAboveTier - aboveTierDiff;

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
              2
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
  };
}
