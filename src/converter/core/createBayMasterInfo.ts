import {
  IBayLevelDataIntermediate,
  IBayStackInfo,
  TCommonBayInfo,
} from "../../models/v1/parts/IBayLevelData";

import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import { pad2 } from "../../helpers/pad";

/**
 * Add `masterInfo` to the bay
 * @param bayLevelData
 */
export default function createBayMasterInfo(
  bayLevelData: IBayLevelDataIntermediate[]
): void {
  if (!bayLevelData) {
    throw { message: "Missing bayLevelData", code: "MissingBayData" };
  }

  bayLevelData.forEach((bl) => {
    const masterInfoStats: IInventoryForMasterInfo = {
      bottomBase: new Map(),
      topIsoTier: new Map(),
      bottomIsoTier: new Map(),
      maxHeight: new Map(),
    };

    const stacks = Object.keys(bl.perStackInfo) as IIsoStackTierPattern[];
    stacks.forEach((stack) => {
      const sDataK = bl.perStackInfo[stack];
      addToStats(sDataK, masterInfoStats);
    });

    bl.masterInfo = chooseMostRepeatedValue(masterInfoStats);
  });
}

/**
 * Generates maps of most repeated values
 */
function addToStats(
  sData: IBayStackInfo,
  masterInfoStats: IInventoryForMasterInfo
) {
  const { bottomBase, topIsoTier, bottomIsoTier, maxHeight } = sData;

  if (bottomBase !== undefined && !masterInfoStats.bottomBase.has(bottomBase))
    masterInfoStats.bottomBase.set(bottomBase, 0);

  masterInfoStats.bottomBase.set(
    bottomBase,
    masterInfoStats.bottomBase.get(bottomBase) + 1
  );

  if (
    topIsoTier !== undefined &&
    !masterInfoStats.topIsoTier.has(Number(topIsoTier))
  )
    masterInfoStats.topIsoTier.set(Number(topIsoTier), 0);

  masterInfoStats.topIsoTier.set(
    Number(topIsoTier),
    masterInfoStats.topIsoTier.get(Number(topIsoTier)) + 1
  );

  if (
    bottomIsoTier !== undefined &&
    !masterInfoStats.bottomIsoTier.has(Number(bottomIsoTier))
  )
    masterInfoStats.bottomIsoTier.set(Number(bottomIsoTier), 0);

  masterInfoStats.bottomIsoTier.set(
    Number(bottomIsoTier),
    masterInfoStats.bottomIsoTier.get(Number(bottomIsoTier)) + 1
  );

  if (maxHeight !== undefined && !masterInfoStats.maxHeight.has(maxHeight))
    masterInfoStats.maxHeight.set(maxHeight, 0);

  masterInfoStats.maxHeight.set(
    maxHeight,
    masterInfoStats.maxHeight.get(maxHeight) + 1
  );
}

export function chooseMostRepeatedValue(
  e: IInventoryForMasterInfo
): TCommonBayInfo {
  const keys: (keyof TCommonBayInfo)[] = [
    "bottomBase",
    "topIsoTier",
    "bottomIsoTier",
    "maxHeight",
  ];
  const result: { [k in keyof Partial<IInventoryForMasterInfo>]: number } = {};

  keys.forEach((key) => {
    let mostRepeatedValue: number | undefined = undefined;
    let mostRepeatedCounter = -1;
    const repMap = e[key];

    repMap.forEach((repetitions: number, val: number) => {
      if (mostRepeatedCounter < repetitions) {
        mostRepeatedValue = val;
        mostRepeatedCounter = repetitions;
      }
    });

    result[key] = mostRepeatedValue;
  });

  return {
    bottomBase: result.bottomBase,
    topIsoTier: pad2(result.topIsoTier),
    bottomIsoTier: pad2(result.bottomIsoTier),
    maxHeight: result.maxHeight,
  };
}

interface IInventoryForMasterInfo {
  bottomBase: Map<number, number>;
  topIsoTier: Map<number, number>;
  bottomIsoTier: Map<number, number>;
  maxHeight: Map<number, number>;
}
