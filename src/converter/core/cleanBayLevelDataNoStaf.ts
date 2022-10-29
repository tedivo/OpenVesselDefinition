import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../models/v1/parts/IBayLevelData";

import { IIsoRowPattern } from "../../models/base/types/IPositionPatterns";
import sortByMultipleFields from "../../helpers/sortByMultipleFields";

export function cleanBayLevelDataNoStaf<T>(
  bayLevelDataFromStaf: IBayLevelDataStaf[]
): IBayLevelData[] {
  const baysData = bayLevelDataFromStaf.map((bl) => {
    const { perRowInfo, perTierInfo, maxHeight, ...restOfData } = bl;

    delete perRowInfo.common.bottomIsoTier;
    delete perRowInfo.common.topIsoTier;

    if (perRowInfo.each) {
      (Object.keys(perRowInfo.each) as IIsoRowPattern[]).forEach((row) => {
        delete perRowInfo.each[row].bottomIsoTier;
        delete perRowInfo.each[row].topIsoTier;
      });
    }

    return {
      ...restOfData,
      perRowInfo,
    };
  });

  baysData.sort(
    sortByMultipleFields([
      { name: "isoBay", ascending: true },
      { name: "level", ascending: true },
    ])
  );

  return baysData;
}
