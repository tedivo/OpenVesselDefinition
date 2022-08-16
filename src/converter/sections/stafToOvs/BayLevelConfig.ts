import {
  deleteMissingInfoByContLength,
  deleteVerboseOptionalFalsyKeys,
} from "../../../helpers/deleteMissingInfo";
import {
  safeNumberMtToMm,
  safeNumberTonsToGrams,
} from "../../../helpers/safeNumberConversions";

import { IBayLevelDataStaf } from "../../../models/v1/parts/IBayLevelData";
import ISectionMapConfig from "../../types/ISectionMapConfig";
import { getStafBayLevelEnumValue } from "../../../models/base/enums/BayLevelEnum";
import { getStafForeAftEnumValue } from "../../../models/base/enums/ForeAftEnum";
import { pad3 } from "../../../helpers/pad";
import yNToBoolean from "../../../helpers/yNToBoolean";

/**
 * FROM STAF TO OVS
 * DEFINITION of main Bay
 */
const BayLevelConfig: ISectionMapConfig<IBayLevelDataStaf> = {
  stafSection: "SECTION",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    "20_NAME": { target: "label20", passValue: true, dashIsEmpty: true },
    "40_NAME": { target: "label40", passValue: true, dashIsEmpty: true },
    // There is no use for these fields
    // SL_Hatch: { target: "slHatch", passValue: true, dashIsEmpty: true },
    // SL_ForeAft: { target: "slForeAft", passValue: true, dashIsEmpty: true },
    LCG_20: {
      target: "infoByContLength.20.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 20],
    },
    LCG_24: {
      target: "infoByContLength.24.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 24],
    },
    LCG_40: {
      target: "infoByContLength.40.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 40],
    },
    LCG_45: {
      target: "infoByContLength.45.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 45],
    },
    LCG_48: {
      target: "infoByContLength.48.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 48],
    },
    STACK_WT_20: {
      target: "infoByContLength.20.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_24: {
      target: "infoByContLength.24.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_40: {
      target: "infoByContLength.40.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_45: {
      target: "infoByContLength.45.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_48: {
      target: "infoByContLength.48.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    MAX_HEIGHT: { target: "maxHeight", mapper: safeNumberMtToMm },
    PAIRED_BAY: { target: "pairedBay", mapper: getStafForeAftEnumValue },
    REEFER_PLUGS: { target: "reeferPlugs", mapper: getStafForeAftEnumValue },
    DOORS: { target: "doors", mapper: getStafForeAftEnumValue },
    ATHWARTSHIPS: { target: "athwartShip", mapper: yNToBoolean },
    BULKHEAD: { target: "bulkhead.fore", mapper: yNToBoolean },
    BULKHEAD_LCG: { target: "bulkhead.foreLcg", mapper: safeNumberMtToMm },
  },
  postProcessors: [
    deleteMissingInfoByContLength,
    deleteVerboseOptionalFalsyKeys([
      "label20",
      "label40",
      "maxHeight",
      "reeferPlugs",
      "doors",
      "pairedBay",
      "reeferPlugLimit",
      "centerLineStack",
      "athwartShip",
      "foreHatch",
      "ventilated",
      "heatSrcFore",
      "ignitionSrcFore",
      "quartersFore",
      "engineRmBulkFore",
    ]),
  ],
};

export default BayLevelConfig;
