import BayLevelEnum, {
  getBayLevelEnumValueToStaf,
} from "../../../models/base/enums/BayLevelEnum";
import {
  CONTAINER_LENGTHS,
  TContainerLengths,
} from "../../../models/v1/parts/Types";
import IBayLevelData, {
  IBayRowInfo,
} from "../../../models/v1/parts/IBayLevelData";
import IRowStafData, {
  IRowInfoByLengthWithAcceptsSize,
} from "../../types/IRowStafData";
import pad, { pad2, safePad2 } from "../../../helpers/pad";
import {
  safeNumberGramsToTons,
  safeNumberMmToMt,
} from "../../../helpers/safeNumberConversions";
import sortByMultipleFields, {
  sortNumericAsc,
} from "../../../helpers/sortByMultipleFields";

import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import { IJoinedRowTierPattern } from "../../../models/base/types/IPositionPatterns";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import IShipData from "../../../models/v1/parts/IShipData";
import { SHIP_EDITOR_MIN_TIER } from "./consts";
import ValuesSourceEnum from "../../../models/base/enums/ValuesSourceEnum";
import { getRowsAndTiersFromSlotKeys } from "../../../helpers/getRowsAndTiersFromSlotKeys";
import { yNToStaf } from "../../../helpers/yNToBoolean";

/**
 * FROM OVD TO STAF
 * DEFINITION of a Row
 */
const RowConfig: ISectionMapToStafConfig<IRowStafDataTemp, IRowStafData> = {
  stafSection: "STACK",
  mapVars: [
    { stafVar: "STAF BAY", source: "isoBay", mapper: safePad2 },
    { stafVar: "LEVEL", source: "level", mapper: getBayLevelEnumValueToStaf },
    { stafVar: "ISO STACK", source: "isoRow", mapper: safePad2 },
    { stafVar: "CUSTOM STACK", fixedValue: "-" },
    { stafVar: "TOP TIER", source: "topIsoTier", mapper: safePad2 },
    { stafVar: "BOTTOM TIER", source: "bottomIsoTier", mapper: safePad2 },
    { stafVar: "BOTTOM VCG", source: "bottomBase", mapper: safeNumberMmToMt },
    { stafVar: "TCG", source: "tcg", mapper: safeNumberMmToMt },
    {
      stafVar: "ACCEPTS 20",
      source: "rowInfoByLength.20.acceptsSize",
      mapper: yNToStaf,
    },

    {
      stafVar: "ACCEPTS 40",
      source: "rowInfoByLength.40.acceptsSize",
      mapper: yNToStaf,
    },
    {
      stafVar: "ACCEPTS 45",
      source: "rowInfoByLength.45.acceptsSize",
      mapper: yNToStaf,
    },
    {
      stafVar: "ACCEPTS 48",
      source: "rowInfoByLength.48.acceptsSize",
      mapper: yNToStaf,
    },
    // {
    //   stafVar: "ACCEPTS 53",
    //   source: "rowInfoByLength.53.acceptsSize",
    //   mapper: yNToStaf,
    // },
    {
      stafVar: "LCG 20",
      source: "rowInfoByLength.20.lcg",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 20),
    },
    {
      stafVar: "LCG 40",
      source: "rowInfoByLength.40.lcg",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 40),
    },
    {
      stafVar: "LCG 45",
      source: "rowInfoByLength.45.lcg",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 45),
    },
    {
      stafVar: "LCG 48",
      source: "rowInfoByLength.48.lcg",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 48),
    },
    // {
    //   stafVar: "LCG 53",
    //   source: "rowInfoByLength.53.lcg",
    //   mapper: safeNumberMmToMt,
    // },
    {
      stafVar: "STACK WT 20",
      source: "rowInfoByLength.20.rowWeight",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberGramsToTonsOrPercentageBySize(n, record, 20),
    },
    {
      stafVar: "STACK WT 40",
      source: "rowInfoByLength.40.rowWeight",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberGramsToTonsOrPercentageBySize(n, record, 40),
    },
    {
      stafVar: "STACK WT 45",
      source: "rowInfoByLength.45.rowWeight",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberGramsToTonsOrPercentageBySize(n, record, 45),
    },
    {
      stafVar: "STACK WT 48",
      source: "rowInfoByLength.48.rowWeight",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberGramsToTonsOrPercentageBySize(n, record, 48),
    },
    // {
    //   stafVar: "STACK WT 53",
    //   source: "rowInfoByLength.53.rowWeight",
    //   mapper: safeNumberGramsToTons,
    // },
    { stafVar: "MAX HT", source: "maxHeight", mapper: safeNumberMmToMt },
    {
      stafVar: "ACCEPTS 24",
      source: "rowInfoByLength.24.acceptsSize",
      mapper: yNToStaf,
    },
    {
      stafVar: "LCG 24",
      source: "rowInfoByLength.24.lcg",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberMmToMtOrPercentageBySize(n, record, 24),
    },
    {
      stafVar: "STACK WT 24",
      source: "rowInfoByLength.24.rowWeight",
      mapper: (n: number, record: IRowStafDataTemp) =>
        createSafeNumberGramsToTonsOrPercentageBySize(n, record, 24),
    },
    {
      stafVar: "20 ISO STK",
      source: "isoRow20",
      mapper: pad4,
    },
    {
      stafVar: "40 ISO STK",
      source: "isoRow40",
      mapper: pad4,
    },
  ],
  preProcessor: createRowStafData,
};

function pad4(num: string) {
  if (isNaN(Number(num))) return "-";
  return pad(num, 4);
}

function createSafeNumberMmToMtOrPercentageBySize(
  n: number,
  record: IRowStafDataTemp,
  size: TContainerLengths
): string {
  const hasSize = record.sizesInBayAndShip.indexOf(size) >= 0;

  if (n === undefined || isNaN(n)) return hasSize ? "%" : "-";
  return safeNumberMmToMt(n);
}

function createSafeNumberGramsToTonsOrPercentageBySize(
  n: number,
  record: IRowStafDataTemp,
  size: TContainerLengths
): string {
  const hasSize = record.sizesInBayAndLevel.indexOf(size) >= 0;

  if (n === undefined || isNaN(n)) return hasSize ? "%" : "-";
  return safeNumberGramsToTons(n);
}

interface IRowStafDataTemp extends IRowStafData {
  sizesInBayAndShip: TContainerLengths[];
  sizesInBayAndLevel: TContainerLengths[];
}

export function createRowStafData(
  bayData: IBayLevelData[],
  shipData: IShipData
): IRowStafDataTemp[] {
  const masterCGs = shipData.masterCGs;

  const bls = bayData.slice().sort(
    sortByMultipleFields([
      { name: "isoBay", ascending: true },
      { name: "level", ascending: true },
    ])
  );

  const allSizesByBay: { [key: string]: Set<TContainerLengths> } = {};
  const allSizesByBayAndLevel: { [key: string]: Set<TContainerLengths> } = {};
  let maxSize20InVessel = 0 as TContainerLengths;
  let maxSize40InVessel = 0 as TContainerLengths;

  const resp: IRowStafDataTemp[] = [];

  bls.forEach((bl) => {
    const slotKeys = bl.perSlotInfo
      ? (Object.keys(bl.perSlotInfo) as IJoinedRowTierPattern[])
      : [];

    const perRowInfo = bl.perRowInfo;
    const infoByContLength = bl.infoByContLength;

    const { rows, tiersByRow } = getRowsAndTiersFromSlotKeys(slotKeys);
    let allSizes: TContainerLengths[] = [];

    rows.sort(sortNumericAsc).forEach((row) => {
      const rowInfoByLength = perRowInfo?.each?.[row]?.rowInfoByLength;

      const rowInfoBLWithSize: Partial<{
        [key in TContainerLengths]: IRowInfoByLengthWithAcceptsSize;
      }> = {};

      if (rowInfoByLength) {
        (
          Object.keys(rowInfoByLength).map(Number) as TContainerLengths[]
        ).forEach((len) => {
          rowInfoBLWithSize[len] = {
            ...rowInfoByLength[len],
            acceptsSize: 1,
            bayHasLcg: infoByContLength?.[len]?.lcg !== undefined ? 1 : 0,
          };
          allSizes.push(len);
        });
      } else {
        const sizesInBay = Object.keys(infoByContLength).map(
          Number
        ) as TContainerLengths[];
        if (!bl.perRowInfo) bl.perRowInfo = { each: {}, common: {} };
        if (!bl.perRowInfo.each) bl.perRowInfo.each = {};
        sizesInBay.forEach((len) => {
          if (bl.perRowInfo.each[len] === undefined)
            bl.perRowInfo.each[len] = {} as IBayRowInfo;
          if (!bl.perRowInfo.each[len].rowInfoByLength)
            bl.perRowInfo.each[len].rowInfoByLength =
              {} as IRowInfoByLengthWithAcceptsSize;

          const rowInfoBLWithSizeOfLen: IRowInfoByLengthWithAcceptsSize =
            bl.perRowInfo.each[len].rowInfoByLength;

          rowInfoBLWithSizeOfLen.bayHasLcg =
            infoByContLength?.[len]?.lcg !== undefined ? 1 : 0;
        });
      }

      slotKeys.forEach((slotKey) => {
        const slot = bl.perSlotInfo[slotKey];
        const sizes = Object.keys(slot.sizes || {}).map(
          Number
        ) as TContainerLengths[];
        sizes.forEach((len) => {
          if (!rowInfoBLWithSize[len]) {
            rowInfoBLWithSize[len] = {
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

      const isoRow20 = allSizes.some((v) => v < 40)
        ? `${safePad2(bl.isoBay)}${row}`
        : "-";

      const isoRow40 = allSizes.some(
        (v) => v >= 40 && bl.pairedBay !== undefined
      )
        ? `${safePad2(
            Number(bl.isoBay) + (bl.pairedBay === ForeAftEnum.FWD ? -1 : 1)
          )}${row}`
        : "-";

      const topIsoTier = pad2(tiersByRow[row].maxTier);
      const bottomIsoTier = pad2(tiersByRow[row].minTier);

      maxSize20InVessel = Math.max(
        ...allSizes.filter((s) => s < 40),
        maxSize20InVessel
      ) as TContainerLengths;

      maxSize40InVessel = Math.max(
        ...allSizes.filter((s) => s >= 40),
        maxSize40InVessel
      ) as TContainerLengths;

      if (!allSizesByBay[bl.isoBay]) allSizesByBay[bl.isoBay] = new Set();
      if (!allSizesByBayAndLevel[`${bl.isoBay}-${bl.level}`])
        allSizesByBayAndLevel[`${bl.isoBay}-${bl.level}`] = new Set();

      allSizes.forEach((size) => {
        allSizesByBay[bl.isoBay].add(size);
        allSizesByBayAndLevel[`${bl.isoBay}-${bl.level}`].add(size);
      });

      const rowData: IRowStafDataTemp = {
        isoBay: bl.isoBay,
        level: bl.level,
        isoRow: row,
        topIsoTier: topIsoTier,
        bottomIsoTier: bottomIsoTier,
        bottomBase:
          perRowInfo?.each?.[row]?.bottomBase ??
          perRowInfo?.common?.bottomBase ??
          (bottomIsoTier ? masterCGs.bottomBases[bottomIsoTier] : undefined),
        maxHeight:
          perRowInfo?.each?.[row]?.maxHeight ?? perRowInfo?.common?.maxHeight,
        tcg:
          perRowInfo?.each?.[row]?.tcg ??
          (bl.level === BayLevelEnum.ABOVE
            ? masterCGs.aboveTcgs[row]
            : masterCGs.belowTcgs[row]),
        rowInfoByLength: rowInfoBLWithSize,
        isoRow20,
        isoRow40,
        sizesInBayAndLevel: [],
        sizesInBayAndShip: [],
      };

      resp.push(rowData);
    });
  });

  const sizesInArrayOnly20s = CONTAINER_LENGTHS.filter(
    (v) => v <= maxSize20InVessel
  );

  const sizesInArrayOnly40s = CONTAINER_LENGTHS.filter(
    (v) => v >= 40 && v <= maxSize40InVessel
  );

  for (let i = 0; i < resp.length; i++) {
    const row = resp[i];
    const isoBay = row.isoBay;

    if (shipData.lcgOptions?.values === ValuesSourceEnum.KNOWN)
      row.sizesInBayAndShip = [
        ...(allSizesByBay[isoBay].has(20) || allSizesByBay[isoBay].has(24)
          ? sizesInArrayOnly20s
          : []),
        ...(allSizesByBay[isoBay].has(40) ||
        allSizesByBay[isoBay].has(45) ||
        allSizesByBay[isoBay].has(48)
          ? sizesInArrayOnly40s
          : []),
      ];

    row.sizesInBayAndLevel = Array.from(
      allSizesByBayAndLevel[`${isoBay}-${row.level}`]
    );
  }

  return resp;
}

export default RowConfig;
