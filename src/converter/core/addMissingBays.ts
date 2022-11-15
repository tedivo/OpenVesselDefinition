import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { IIsoBayPattern } from "../../models/base/types/IPositionPatterns";
import ISizeSummary from "../../models/base/ISizeSummary";
import { pad3 } from "../../helpers/pad";
import sortByMultipleFields from "../../helpers/sortByMultipleFields";

export function addMissingBays(
  currentBaysData: IBayLevelDataStaf[],
  sizeSummary: ISizeSummary
): IBayLevelDataStaf[] {
  const createEmptyBayData = (
    isoBay: IIsoBayPattern,
    level: BayLevelEnum
  ): IBayLevelDataStaf => ({
    isoBay,
    level,
    infoByContLength: {},
    perSlotInfo: {},
    perRowInfo: { common: {}, each: {} },
    centerLineRow: sizeSummary.centerLineRow ? 1 : 0,
  });

  const baysDataPerIsoBayAndLevel: IBaysDataPerIsoBayAndLevel = {};
  currentBaysData.forEach((bl) => {
    if (!baysDataPerIsoBayAndLevel[bl.isoBay])
      baysDataPerIsoBayAndLevel[bl.isoBay] = {};
    baysDataPerIsoBayAndLevel[bl.isoBay][
      bl.level === BayLevelEnum.ABOVE ? "above" : "below"
    ] = bl;
  });

  const newBaysData: IBayLevelDataStaf[] = [];

  const hasAboveDeck =
    sizeSummary.maxAboveTier !== undefined &&
    sizeSummary.minAboveTier !== undefined;

  const hasBelowDeck =
    sizeSummary.maxBelowTier !== undefined &&
    sizeSummary.minBelowTier !== undefined;

  for (let i = 1; i <= sizeSummary.isoBays; i += 2) {
    const isoBay = pad3(i);

    if (hasAboveDeck) {
      const bayDataAbove = baysDataPerIsoBayAndLevel[isoBay]?.above;
      if (bayDataAbove !== undefined) {
        newBaysData.push(bayDataAbove);
      } else {
        newBaysData.push(createEmptyBayData(isoBay, BayLevelEnum.ABOVE));
      }
    }

    if (hasBelowDeck) {
      const bayDataBelow = baysDataPerIsoBayAndLevel[isoBay]?.below;
      if (bayDataBelow !== undefined) {
        newBaysData.push(bayDataBelow);
      } else {
        newBaysData.push(createEmptyBayData(isoBay, BayLevelEnum.BELOW));
      }
    }
  }

  newBaysData.sort(
    sortByMultipleFields([
      { name: "isoBay", ascending: true },
      { name: "level", ascending: true },
    ])
  );

  return newBaysData;
}

interface IBaysDataPerIsoBayAndLevel {
  [isoBay: IIsoBayPattern]: {
    above?: IBayLevelDataStaf;
    below?: IBayLevelDataStaf;
  };
}
