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
    { stafVar: "STAF BAY", source: "isoBay", mapper: pad2 },
    { stafVar: "LEVEL", source: "level", mapper: getBayLevelEnumValueToStaf },
    {
      stafVar: "20 NAME",
      source: "label20",
      passValue: true,
      dashIsEmpty: true,
    },
    {
      stafVar: "40 NAME",
      source: "label40",
      passValue: true,
      dashIsEmpty: true,
    },
    {
      stafVar: "LCG 20",
      source: "infoByContLength.20.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 20],
    },
    {
      stafVar: "LCG 24",
      source: "infoByContLength.24.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 24],
    },
    {
      stafVar: "LCG 40",
      source: "infoByContLength.40.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 40],
    },
    {
      stafVar: "LCG 45",
      source: "infoByContLength.45.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 45],
    },
    {
      stafVar: "LCG 48",
      source: "infoByContLength.48.lcg",
      mapper: safeNumberMmToMt,
      setSelf: ["size", 48],
    },
    {
      stafVar: "STACK WT 20",
      source: "infoByContLength.20.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 24",
      source: "infoByContLength.24.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 40",
      source: "infoByContLength.40.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 45",
      source: "infoByContLength.45.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    {
      stafVar: "STACK WT 48",
      source: "infoByContLength.48.stackWeight",
      mapper: safeNumberGramsToTons,
    },
    { stafVar: "MAX HEIGHT", source: "maxHeight", mapper: safeNumberMmToMt },
    {
      stafVar: "PAIRED BAY",
      source: "pairedBay",
      mapper: getStafForeAftEnumValue,
    },
    {
      stafVar: "REEFER PLUGS",
      source: "reeferPlugs",
      mapper: getStafForeAftEnumValue,
    },
    { stafVar: "DOORS", source: "doors", mapper: getStafForeAftEnumValue },
    { stafVar: "ATHWARTSHIPS", source: "athwartShip", mapper: yNToBoolean },
    { stafVar: "BULKHEAD", source: "bulkhead.fore", mapper: yNToBoolean },
    {
      stafVar: "BULKHEAD LCG",
      source: "bulkhead.foreLcg",
      mapper: safeNumberMmToMt,
    },
  ],
  postProcessors: [],
};

export default BayLevelConfig;
