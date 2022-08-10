import { pad2, pad3 } from "../../../helpers/pad";
import {
  safeNumberGramsToTons,
  safeNumberMmToMt,
} from "../../../helpers/safeNumberConversions";

import { IBayLevelDataStaf } from "../../../models/v1/parts/IBayLevelData";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import { getBayLevelEnumValueToStaf } from "../../../models/base/enums/BayLevelEnum";
import { getStafForeAftEnumValue } from "../../../models/base/enums/ForeAftEnum";
import yNToBoolean from "../../../helpers/yNToBoolean";

/**
 * FROM OVS TO STAF
 * DEFINITION of main Bay
 */
const BayLevelConfig: ISectionMapToStafConfig<IBayLevelDataStaf> = {
  stafSection: "SECTION",
  mapVars: [
    { stafVar: "STAF BAY", target: "isoBay", mapper: pad2 },
    { stafVar: "LEVEL", target: "level", mapper: getBayLevelEnumValueToStaf },
    {
      stafVar: "20_NAME",
      target: "label20",
      passValue: true,
      dashIsEmpty: true,
    },
    {
      stafVar: "40_NAME",
      target: "label40",
      passValue: true,
      dashIsEmpty: true,
    },
    {
      stafVar: "LCG_20",
      target: "infoByContLength.20.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 20],
    },
    {
      stafVar: "LCG_24",
      target: "infoByContLength.24.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 24],
    },
    {
      stafVar: "LCG_40",
      target: "infoByContLength.40.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 40],
    },
    {
      stafVar: "LCG_45",
      target: "infoByContLength.45.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 45],
    },
    {
      stafVar: "LCG_48",
      target: "infoByContLength.48.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 48],
    },
    {
      stafVar: "STACK_WT_20",
      target: "infoByContLength.20.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK_WT_24",
      target: "infoByContLength.24.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK_WT_40",
      target: "infoByContLength.40.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK_WT_45",
      target: "infoByContLength.45.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK_WT_48",
      target: "infoByContLength.48.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    { stafVar: "MAX_HEIGHT", target: "maxHeight", mapper: safeNumberMmToMt },
    {
      stafVar: "PAIRED_BAY",
      target: "pairedBay",
      mapper: getStafForeAftEnumValue,
    },
    {
      stafVar: "REEFER_PLUGS",
      target: "reeferPlugs",
      mapper: getStafForeAftEnumValue,
    },
    { stafVar: "DOORS", target: "doors", mapper: getStafForeAftEnumValue },
    { stafVar: "ATHWARTSHIPS", target: "athwartShip", mapper: yNToBoolean },
    { stafVar: "BULKHEAD", target: "bulkhead.fore", mapper: yNToBoolean },
    {
      stafVar: "BULKHEAD_LCG",
      target: "bulkhead.foreLcg",
      mapper: safeNumberMmToMt,
    },
  ],
  postProcessors: [],
};

export default BayLevelConfig;
