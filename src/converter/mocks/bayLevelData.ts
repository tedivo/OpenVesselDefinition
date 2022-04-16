import { pad3 } from "../../helpers/pad";
import {
  IIsoBayPattern,
  IIsoStackTierPattern,
  IJoinedStackTierPattern,
} from "../../models/base/types/IPositionPatterns";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import IBayLevelData, {
  TBayStackInfo,
  TBayTierInfo,
  TStackInfoByLength,
} from "../../models/v1/parts/IBayLevelData";

const defaultAboveTiers: IIsoStackTierPattern[] = ["80", "82", "84", "86"];
const defaultBelowTiers: IIsoStackTierPattern[] = ["02", "04", "06", "08"];
const defaultStacks: IIsoStackTierPattern[] = ["00", "01", "02"];

const defaultStackAttributesByContainerLength2024: TStackInfoByLength = {
  "20": { size: 20 },
  "24": { size: 24 },
};

const defaultStackAttributesByContainerLength2040: TStackInfoByLength = {
  "20": { size: 20 },
  "40": { size: 40 },
};

export const bayLevelData: IBayLevelData = {
  isoBay: "001",
  level: BayLevelEnum.ABOVE,
  stackInfoByLength: defaultStackAttributesByContainerLength2024,
};

export function createMockedSingleBayLevelData(
  isoBay: IIsoBayPattern,
  isAbove: boolean,
  hasZeroStack: boolean,
  perSlotKeys: IJoinedStackTierPattern[]
): IBayLevelData {
  const isFake40 = (Number(isoBay) % 4) - 2 === 1;

  const stacks = hasZeroStack
    ? defaultStacks
    : defaultStacks.filter((s) => s !== "00");

  return {
    isoBay,
    level: isAbove ? BayLevelEnum.ABOVE : BayLevelEnum.BELOW,
    stackInfoByLength: isFake40
      ? defaultStackAttributesByContainerLength2040
      : defaultStackAttributesByContainerLength2024,
    perTierInfo: (isAbove ? defaultAboveTiers : defaultBelowTiers).reduce(
      (acc, v) => {
        acc[v] = { isoTier: v };
        return acc;
      },
      {} as TBayTierInfo
    ),
    perStackInfo: stacks.reduce((acc, v) => {
      acc[v] = { isoStack: v };
      return acc;
    }, {} as TBayStackInfo),

    perSlotInfo: perSlotKeys.reduce((acc, v) => {
      acc[v] = isFake40
        ? { sizes: { 20: 1, 40: 1 } }
        : { sizes: { 20: 1, 24: 1 } };
      return acc;
    }, {}),
  };
}

export function createMockedSimpleBayLevelData(
  isoBays: number | IIsoBayPattern,
  perSlotKeysAbove: IJoinedStackTierPattern[],
  perSlotKeysBelow: IJoinedStackTierPattern[]
): IBayLevelData[] {
  const bays = Number(isoBays);
  const bayLevelDataArray: IBayLevelData[] = [];

  for (let i = 1; i < bays; i += 2) {
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
