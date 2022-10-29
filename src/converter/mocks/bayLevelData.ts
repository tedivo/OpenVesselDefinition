import IBayLevelData, {
  IBayLevelDataStaf,
  IBayRowInfo,
  TBayRowInfo,
  TBayTierInfoStaf,
  TRowInfoByLength,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoBayPattern,
  IIsoRowPattern,
  IIsoTierPattern,
  IJoinedRowTierPattern,
} from "../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { pad3 } from "../../helpers/pad";

const defaultAboveTiers: IIsoTierPattern[] = ["80", "82", "84", "86"];
const defaultBelowTiers: IIsoTierPattern[] = ["02", "04", "06", "08"];
const defaultRows: IIsoRowPattern[] = ["00", "01", "02"];

const defaultRowAttributesByContainerLength2024: TRowInfoByLength = {
  "20": { size: 20 },
  "24": { size: 24 },
};

const defaultRowAttributesByContainerLength2040: TRowInfoByLength = {
  "20": { size: 20 },
  "40": { size: 40 },
};

export const bayLevelData: IBayLevelData = {
  isoBay: "001",
  level: BayLevelEnum.ABOVE,
  perRowInfo: {},
  infoByContLength: defaultRowAttributesByContainerLength2024,
};

export function createMockedSingleBayLevelData(
  isoBay: IIsoBayPattern,
  isAbove: boolean,
  hasZeroRow: boolean,
  perSlotKeys: IJoinedRowTierPattern[]
): IBayLevelDataStaf {
  const isFake40 = (Number(isoBay) % 4) - 2 === 1;
  const bottomBase = isAbove ? 50000 : 0;

  const rows = hasZeroRow ? defaultRows : defaultRows.filter((s) => s !== "00");

  const perRowInfoEach: { [key: IIsoRowPattern]: IBayRowInfo } = rows.reduce(
    (acc, v) => {
      acc[v] = {
        isoRow: v,
        bottomBase,
        bottomIsoTier: isAbove ? defaultAboveTiers[0] : defaultBelowTiers[0],
        topIsoTier: isAbove ? defaultAboveTiers[3] : defaultBelowTiers[3],
      };
      return acc;
    },
    {}
  );

  const perTierInfo = (isAbove ? defaultAboveTiers : defaultBelowTiers).reduce(
    (acc, v) => {
      acc[v] = { isoTier: v };
      return acc;
    },
    {} as TBayTierInfoStaf
  );

  return {
    isoBay,
    level: isAbove ? BayLevelEnum.ABOVE : BayLevelEnum.BELOW,
    infoByContLength: isFake40
      ? defaultRowAttributesByContainerLength2040
      : defaultRowAttributesByContainerLength2024,
    perTierInfo,
    perRowInfo: {
      each: perRowInfoEach,
      common: {},
    },

    perSlotInfo: perSlotKeys.reduce((acc, v) => {
      acc[v] = isFake40
        ? { pos: v, sizes: { 20: 1, 40: 1 } }
        : { pos: v, sizes: { 20: 1, 24: 1 } };
      return acc;
    }, {}),
  };
}

export function createMockedSimpleBayLevelData(
  isoBays: number | IIsoBayPattern,
  perSlotKeysAbove: IJoinedRowTierPattern[],
  perSlotKeysBelow: IJoinedRowTierPattern[]
): IBayLevelDataStaf[] {
  const bays = Number(isoBays);
  const bayLevelDataArray: IBayLevelData[] = [];

  for (let i = 1; i <= bays; i += 2) {
    let isoBay = pad3(i);
    // Above
    bayLevelDataArray.push(
      createMockedSingleBayLevelData(isoBay, true, true, perSlotKeysAbove)
    );
    // Below
    bayLevelDataArray.push(
      createMockedSingleBayLevelData(isoBay, false, true, perSlotKeysBelow)
    );
  }

  return bayLevelDataArray;
}
