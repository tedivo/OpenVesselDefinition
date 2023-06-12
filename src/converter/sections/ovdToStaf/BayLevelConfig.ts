import ForeAftEnum, {
  getForeAftEnumToStaf,
} from "../../../models/base/enums/ForeAftEnum";
import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../../models/v1/parts/IBayLevelData";
import {
  safeNumberGramsToTons,
  safeNumberMmToMt,
} from "../../../helpers/safeNumberConversions";

import { IJoinedRowTierPattern } from "../../../models/base/types/IPositionPatterns";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import { TContainerLengths } from "../../../models/v1/parts/Types";
import { getBayLevelEnumValueToStaf } from "../../../models/base/enums/BayLevelEnum";
import { safePad2 } from "../../../helpers/pad";
import { yNToStaf } from "../../../helpers/yNToBoolean";

/**
 * FROM OVD TO STAF
 * DEFINITION of main Bay
 */
const BayLevelConfig: ISectionMapToStafConfig<
  IBayLevelDataStaf,
  IBayLevelData
> = {
  stafSection: "SECTION",
  mapVars: [
    { stafVar: "STAF BAY", source: "isoBay", mapper: safePad2 },
    { stafVar: "LEVEL", source: "level", mapper: getBayLevelEnumValueToStaf },
    {
      stafVar: "20 NAME",
      source: "label20",
      mapper: safePad2,
    },
    {
      stafVar: "40 NAME",
      source: "label40",
      mapper: safePad2,
    },
    {
      stafVar: "SL Hatch",
      fixedValue: "-",
    },
    {
      stafVar: "SL ForeAft",
      fixedValue: "-",
    },
    {
      stafVar: "LCG 20",
      source: "infoByContLength.20.lcg",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "LCG 40",
      source: "infoByContLength.40.lcg",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "LCG 45",
      source: "infoByContLength.45.lcg",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "LCG 48",
      source: "infoByContLength.48.lcg",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "STACK WT 20",
      source: "infoByContLength.20.rowWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 40",
      source: "infoByContLength.40.rowWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 45",
      source: "infoByContLength.45.rowWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 48",
      source: "infoByContLength.48.rowWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "MAX HEIGHT",
      source: "perRowInfo.common.maxHeight",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "PAIRED BAY",
      source: "pairedBay",
      mapper: getForeAftEnumToStaf,
    },
    {
      stafVar: "REEFER PLUGS",
      source: "reeferPlugs",
      mapper: getForeAftEnumToStaf,
    },
    { stafVar: "DOORS", source: "doors", mapper: getForeAftEnumToStaf },
    { stafVar: "ATHWARTSHIPS", source: "athwartShip", mapper: yNToStaf },
    { stafVar: "BULKHEAD", source: "bulkhead.fore", mapper: yNToStaf },
    {
      stafVar: "BULKHEAD LCG",
      source: "bulkhead.foreLcg",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "LCG 24",
      source: "infoByContLength.24.lcg",
      mapper: safeNumberMmToMt,
    },
    {
      stafVar: "STACK WT 24",
      source: "infoByContLength.24.rowWeight",
      mapper: safeNumberGramsToTons,
    },
  ],
  postProcessors: [],
  preProcessor: cleanBayLevelData,
};

export default BayLevelConfig;

function cleanBayLevelData(bls: IBayLevelDataStaf[]): IBayLevelDataStaf[] {
  // 1. Check labels
  for (let i = 0; i < bls.length; i++) {
    const bl = bls[i];
    const perSlotInfo = bl.perSlotInfo;
    const slotsData = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];
    const allSizesSet = new Set<TContainerLengths>();

    let hasRestricted = false;

    // Get all sizes in this bay
    slotsData.forEach((slot) => {
      const slotSizes = Object.keys(perSlotInfo[slot].sizes).map(
        Number
      ) as TContainerLengths[];

      slotSizes.forEach((size) => allSizesSet.add(size));

      if (perSlotInfo[slot].restricted) {
        hasRestricted = true;
      }
    });

    const allSizes = Array.from(allSizesSet);

    const label20 =
      allSizes.some((v) => v < 40) || hasRestricted
        ? safePad2(Number(bl.isoBay))
        : "-";

    const label40 = allSizes.some((v) => v >= 40 && bl.pairedBay !== undefined)
      ? safePad2(
          Number(bl.isoBay) + (bl.pairedBay === ForeAftEnum.FWD ? -1 : 1)
        )
      : "-";

    bl.label40 = label40;
    bl.label20 = label20 === "-" && label40 !== "-" ? label40 : label20;
  }

  // 2. Check slots
  return bls.filter((bl) => {
    return bl.label20 !== "-" || bl.label40 !== "-";
  });
}
