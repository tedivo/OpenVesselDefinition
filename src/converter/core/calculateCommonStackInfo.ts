import {
  IBayLevelDataIntermediate,
  IBayStackInfo,
  TCommonBayInfo,
} from "../../models/v1/parts/IBayLevelData";

import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import { pad2 } from "../../helpers/pad";

/**
 * Add `commonStackInfo` to the bay. Deletes repeated values
 * @param bayLevelData
 */
export default function calculateCommonStackInfo(
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

    const stacks = Object.keys(bl.perStackInfo.each) as IIsoStackTierPattern[];
    stacks.forEach((stack) => {
      const sDataK = bl.perStackInfo.each[stack];
      addToStats(sDataK, masterInfoStats);
    });

    bl.perStackInfo.common = chooseMostRepeatedValue(masterInfoStats);

    bl.perStackInfo.common.maxHeight = bl.maxHeight;
    delete bl.maxHeight;

    // Clean repeated data
    stacks.forEach((stack) => {
      const sDataK = bl.perStackInfo.each[stack];
      const perStackInfoCommon = bl.perStackInfo.common;

      if (sDataK.bottomBase === perStackInfoCommon.bottomBase)
        sDataK.bottomBase = undefined;

      if (sDataK.bottomIsoTier === perStackInfoCommon.bottomIsoTier)
        sDataK.bottomIsoTier = undefined;

      if (sDataK.topIsoTier === perStackInfoCommon.topIsoTier)
        sDataK.topIsoTier = undefined;

      if (sDataK.maxHeight === perStackInfoCommon.maxHeight)
        sDataK.maxHeight = undefined;
    });
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
