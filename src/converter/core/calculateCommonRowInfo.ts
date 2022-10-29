import {
  IBayLevelDataStaf,
  IBayRowInfoStaf,
  TCommonBayInfoStaf,
} from "../../models/v1/parts/IBayLevelData";

import { IIsoRowPattern } from "../../models/base/types/IPositionPatterns";
import { pad2 } from "../../helpers/pad";

/**
 * Add `commonRowInfo` to the bay. Deletes repeated values
 * @param bayLevelData
 */
export default function calculateCommonRowInfo(
  bayLevelData: IBayLevelDataStaf[]
): void {
  if (!bayLevelData) {
    throw { message: "Missing bayLevelData", code: "MissingBayData" };
  }

  bayLevelData.forEach((bl) => {
    const masterInfoStats: IInventoryForMasterInfo = {
      bottomBase: new Map(),
      maxHeight: new Map(),
      topIsoTier: new Map(),
      bottomIsoTier: new Map(),
    };

    const rows = Object.keys(bl.perRowInfo.each) as IIsoRowPattern[];
    rows.forEach((row) => {
      const sDataK = bl.perRowInfo.each[row];
      addToStats(sDataK, masterInfoStats);
    });

    bl.perRowInfo.common = chooseMostRepeatedValue(masterInfoStats);

    bl.perRowInfo.common.maxHeight = bl.maxHeight;
    delete bl.maxHeight;

    // Clean repeated data
    rows.forEach((row) => {
      const sDataK = bl.perRowInfo.each[row];
      const perRowInfoCommon = bl.perRowInfo.common;

      if (sDataK.bottomBase === perRowInfoCommon.bottomBase)
        sDataK.bottomBase = undefined;

      if (sDataK.bottomIsoTier === perRowInfoCommon.bottomIsoTier)
        delete (sDataK as any).bottomIsoTier;

      if (sDataK.topIsoTier === perRowInfoCommon.topIsoTier)
        delete (sDataK as any).topIsoTier;

      if (sDataK.maxHeight === perRowInfoCommon.maxHeight)
        sDataK.maxHeight = undefined;
    });
  });
}

/**
 * Generates maps of most repeated values
 */
function addToStats(
  sData: IBayRowInfoStaf,
  masterInfoStats: IInventoryForMasterInfo
) {
  const { bottomBase, maxHeight, topIsoTier, bottomIsoTier } = sData;

  if (bottomBase !== undefined && !masterInfoStats.bottomBase.has(bottomBase))
    masterInfoStats.bottomBase.set(bottomBase, 0);

  masterInfoStats.bottomBase.set(
    bottomBase,
    masterInfoStats.bottomBase.get(bottomBase) + 1
  );

  if (maxHeight !== undefined && !masterInfoStats.maxHeight.has(maxHeight))
    masterInfoStats.maxHeight.set(maxHeight, 0);

  masterInfoStats.maxHeight.set(
    maxHeight,
    masterInfoStats.maxHeight.get(maxHeight) + 1
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
}

export function chooseMostRepeatedValue(
  e: IInventoryForMasterInfo
): TCommonBayInfoStaf {
  const keys: (keyof TCommonBayInfoStaf)[] = [
    "bottomBase",
    "maxHeight",
    "topIsoTier",
    "bottomIsoTier",
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
    maxHeight: result.maxHeight,
    topIsoTier: pad2(result.topIsoTier),
    bottomIsoTier: pad2(result.bottomIsoTier),
  };
}

interface IInventoryForMasterInfo {
  bottomBase: Map<number, number>;
  maxHeight: Map<number, number>;
  topIsoTier: Map<number, number>;
  bottomIsoTier: Map<number, number>;
}
