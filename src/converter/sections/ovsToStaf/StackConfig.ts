import BayLevelEnum, {
  getBayLevelEnumValueToStaf,
} from "../../../models/base/enums/BayLevelEnum";
import IBayLevelData, {
  IBayStackInfo,
} from "../../../models/v1/parts/IBayLevelData";
import IStackStafData, {
  IStackInfoByLengthWithAcceptsSize,
} from "../../types/IStackStafData";
import pad, { pad2, safePad2 } from "../../../helpers/pad";
import {
  safeNumberGramsToTons,
  safeNumberMmToMt,
} from "../../../helpers/safeNumberConversions";
import sortByMultipleFields, {
  sortNumericAsc,
} from "../../../helpers/sortByMultipleFields";

import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import { IJoinedStackTierPattern } from "../../../models/base/types/IPositionPatterns";
import { IMasterCGs } from "../../../models/v1/parts/IShipData";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import { SHIP_EDITOR_MIN_TIER } from "./consts";
import { TContainerLengths } from "../../../models/v1/parts/Types";
import { getStackAndTiersFromSlotKeys } from "../../../helpers/getStackAndTiersFromSlotKeys";
import { yNToStaf } from "../../../helpers/yNToBoolean";

/**
 * FROM OVS TO STAF
 * DEFINITION of a Stack
 */
const StackConfig: ISectionMapToStafConfig<IStackStafData, IStackStafData> = {
  stafSection: "STACK",
  mapVars: [
    { stafVar: "STAF BAY", source: "isoBay", mapper: safePad2 },
    { stafVar: "LEVEL", source: "level", mapper: getBayLevelEnumValueToStaf },
    { stafVar: "ISO STACK", source: "isoStack", mapper: safePad2 },
    { stafVar: "CUSTOM STACK", fixedValue: "-" },
    { stafVar: "TOP TIER", source: "topIsoTier", mapper: safePad2 },
    { stafVar: "BOTTOM TIER", source: "bottomIsoTier", mapper: safePad2 },
    { stafVar: "BOTTOM VCG", source: "bottomBase", mapper: safeNumberMmToMt },
    { stafVar: "TCG", source: "tcg", mapper: safeNumberMmToMt },
    {
      stafVar: "ACCEPTS 20",
      source: "stackInfoByLength.20.acceptsSize",
      mapper: yNToStaf,
    },

    {
      stafVar: "ACCEPTS 40",
      source: "stackInfoByLength.40.acceptsSize",
      mapper: yNToStaf,
    },
    {
      stafVar: "ACCEPTS 45",
      source: "stackInfoByLength.45.acceptsSize",
      mapper: yNToStaf,
    },
    {
      stafVar: "ACCEPTS 48",
      source: "stackInfoByLength.48.acceptsSize",
      mapper: yNToStaf,
    },
    // {
    //   stafVar: "ACCEPTS 53",
    //   source: "stackInfoByLength.53.acceptsSize",
    //   mapper: yNToStaf,
    // },
    {
      stafVar: "LCG 20",
      source: "stackInfoByLength.20.lcg",
      mapper: (n: number, record: IStackStafData) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 20),
    },
    {
      stafVar: "LCG 40",
      source: "stackInfoByLength.40.lcg",
      mapper: (n: number, record: IStackStafData) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 40),
    },
    {
      stafVar: "LCG 45",
      source: "stackInfoByLength.45.lcg",
      mapper: (n: number, record: IStackStafData) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 45),
    },
    {
      stafVar: "LCG 48",
      source: "stackInfoByLength.48.lcg",
      mapper: (n: number, record: IStackStafData) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 48),
    },
    // {
    //   stafVar: "LCG 53",
    //   source: "stackInfoByLength.53.lcg",
    //   mapper: safeNumberMmToMt,
    // },
    {
      stafVar: "STACK WT 20",
      source: "stackInfoByLength.20.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 40",
      source: "stackInfoByLength.40.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 45",
      source: "stackInfoByLength.45.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 48",
      source: "stackInfoByLength.48.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    // {
    //   stafVar: "STACK WT 53",
    //   source: "stackInfoByLength.53.stackWeight",
    //   mapper: safeNumberGramsToTons,
    // },
    { stafVar: "MAX HT", source: "maxHeight", mapper: safeNumberMmToMt },
    {
      stafVar: "ACCEPTS 24",
      source: "stackInfoByLength.24.acceptsSize",
      mapper: yNToStaf,
    },
    {
      stafVar: "LCG 24",
      source: "stackInfoByLength.24.lcg",
      mapper: (n: number, record: IStackStafData) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 24),
    },
    {
      stafVar: "STACK WT 24",
      source: "stackInfoByLength.24.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "20 ISO STK",
      source: "isoStack20",
      mapper: pad4,
    },
    {
      stafVar: "40 ISO STK",
      source: "isoStack40",
      mapper: pad4,
    },
  ],
  preProcessor: createStackStafData,
};

function pad4(num: string) {
  if (isNaN(Number(num))) return "-";
  return pad(num, 4);
}

function createSafeNumberMmToMtOrPercentageBySize(
  n: number,
  record: IStackStafData,
  size: TContainerLengths
): string {
  const hasSize = record.stackInfoByLength?.[size];

  if (n === undefined || isNaN(n)) return hasSize?.bayHasLcg ? "%" : "-";
  return safeNumberMmToMt(n);
}

export function createStackStafData(
  bayData: IBayLevelData[],
  masterCGs: IMasterCGs
): IStackStafData[] {
  const bls = bayData.slice().sort(
    sortByMultipleFields([
      { name: "isoBay", ascending: true },
      { name: "level", ascending: true },
    ])
  );

  const resp: IStackStafData[] = [];

  bls.forEach((bl) => {
    const slotKeys = bl.perSlotInfo
      ? (Object.keys(bl.perSlotInfo) as IJoinedStackTierPattern[])
      : [];

    const perStackInfo = bl.perStackInfo;
    const infoByContLength = bl.infoByContLength;

    const { stacks, tiersByStack } = getStackAndTiersFromSlotKeys(slotKeys);
    let allSizes: TContainerLengths[] = [];

    stacks.sort(sortNumericAsc).forEach((stack) => {
      const stackInfoByLength = perStackInfo?.each?.[stack]?.stackInfoByLength;

      const stackInfoBLWithSize: Partial<{
        [key in TContainerLengths]: IStackInfoByLengthWithAcceptsSize;
      }> = {};

      if (stackInfoByLength) {
        (
          Object.keys(stackInfoByLength).map(Number) as TContainerLengths[]
        ).forEach((len) => {
          stackInfoBLWithSize[len] = {
            ...stackInfoByLength[len],
            acceptsSize: 1,
            bayHasLcg: infoByContLength?.[len]?.lcg !== undefined ? 1 : 0,
          };
          allSizes.push(len);
        });
      } else {
        const sizesInBay = Object.keys(infoByContLength).map(
          Number
        ) as TContainerLengths[];
        if (!bl.perStackInfo) bl.perStackInfo = { each: {}, common: {} };
        if (!bl.perStackInfo.each) bl.perStackInfo.each = {};
        sizesInBay.forEach((len) => {
          if (bl.perStackInfo.each[len] === undefined)
            bl.perStackInfo.each[len] = {} as IBayStackInfo;
          if (!bl.perStackInfo.each[len].stackInfoByLength)
            bl.perStackInfo.each[len].stackInfoByLength =
              {} as IStackInfoByLengthWithAcceptsSize;

          const stackInfoBLWithSizeOfLen: IStackInfoByLengthWithAcceptsSize =
            bl.perStackInfo.each[len].stackInfoByLength;

          stackInfoBLWithSizeOfLen.bayHasLcg =
            infoByContLength?.[len]?.lcg !== undefined ? 1 : 0;
        });
      }

      slotKeys.forEach((slotKey) => {
        const slot = bl.perSlotInfo[slotKey];
        const sizes = Object.keys(slot.sizes || {}).map(
          Number
        ) as TContainerLengths[];
        sizes.forEach((len) => {
          if (!stackInfoBLWithSize[len]) {
            stackInfoBLWithSize[len] = {
              size: len,
              acceptsSize: 1,
              bayHasLcg: infoByContLength?.[len]?.lcg !== undefined ? 1 : 0,
            };
            allSizes.push(len);
          }
        });
      });

      // Sizes
      allSizes = allSizes.filter((v, i, arr) => arr.indexOf(v) === i);

      const isoStack20 = allSizes.some((v) => v < 40)
        ? `${safePad2(bl.isoBay)}${stack}`
        : "-";

      const isoStack40 = allSizes.some(
        (v) => v >= 40 && bl.pairedBay !== undefined
      )
        ? `${safePad2(
            Number(bl.isoBay) + (bl.pairedBay === ForeAftEnum.FWD ? -1 : 1)
          )}${stack}`
        : "-";

      const topIsoTier = pad2(tiersByStack[stack].maxTier);
      const bottomIsoTier = pad2(tiersByStack[stack].minTier);

      const stackData: IStackStafData = {
        isoBay: bl.isoBay,
        level: bl.level,
        isoStack: stack,
        topIsoTier: topIsoTier,
        bottomIsoTier: bottomIsoTier,
        bottomBase:
          perStackInfo?.each?.[stack]?.bottomBase ??
          perStackInfo?.common?.bottomBase ??
          (bottomIsoTier ? masterCGs.bottomBases[bottomIsoTier] : undefined),
        maxHeight:
          perStackInfo?.each?.[stack]?.maxHeight ??
          perStackInfo?.common?.maxHeight,
        tcg:
          perStackInfo?.each?.[stack]?.tcg ??
          (bl.level === BayLevelEnum.ABOVE
            ? masterCGs.aboveTcgs[stack]
            : masterCGs.belowTcgs[stack]),
        stackInfoByLength: stackInfoBLWithSize,
        isoStack20,
        isoStack40,
      };

      resp.push(stackData);
    });
  });

  return resp;
}

export default StackConfig;
