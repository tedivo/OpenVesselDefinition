import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../models/v1/parts/IBayLevelData";

import { IIsoStackPattern } from "../../models/base/types/IPositionPatterns";

export function cleanBayLevelDataNoStaf<T>(
  bayLevelDataFromStaf: IBayLevelDataStaf[]
): IBayLevelData[] {
  return bayLevelDataFromStaf.map((bl) => {
    const { perStackInfo, maxHeight, ...restOfData } = bl;

    delete perStackInfo.common.bottomIsoTier;
    delete perStackInfo.common.topIsoTier;

    if (perStackInfo.each) {
      (Object.keys(perStackInfo.each) as IIsoStackPattern[]).forEach(
        (stack) => {
          delete perStackInfo.each[stack].bottomIsoTier;
          delete perStackInfo.each[stack].topIsoTier;
        }
      );
    }

    return {
      ...restOfData,
      perStackInfo,
    };
  });
}
