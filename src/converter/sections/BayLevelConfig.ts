import { deleteMissingContainerLenghtData } from "../../helpers/deleteMissingInfo";
import { pad3 } from "../../helpers/pad";
import safeNumber from "../../helpers/safeNumber";
import yNToBoolean from "../../helpers/yNToBoolean";
import { getStafBayLevelEnumValue } from "../../models/v1/enums/BayLevelEnum";
import { getStafForeAftEnumValue } from "../../models/v1/enums/ForeAftEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import ISectionMapConfig from "../models/ISectionMapConfig";

/**
 * DEFINITION of main Bay
 */
const BayLevelConfig: ISectionMapConfig<IBayLevelData> = {
  stafSection: "SECTION",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    "20_NAME": { target: "label20", passValue: true, dashIsEmpty: true },
    "40_NAME": { target: "label40", passValue: true, dashIsEmpty: true },
    SL_Hatch: { target: "slHatch", passValue: true, dashIsEmpty: true },
    SL_ForeAft: { target: "slForeAft", passValue: true, dashIsEmpty: true },
    LCG_20: {
      target: "stackAttributesByContainerLength.20.lcg",
      mapper: safeNumber,
      setSelf: ["size", 20],
    },
    LCG_24: {
      target: "stackAttributesByContainerLength.24.lcg",
      mapper: safeNumber,
      setSelf: ["size", 24],
    },
    LCG_40: {
      target: "stackAttributesByContainerLength.40.lcg",
      mapper: safeNumber,
      setSelf: ["size", 40],
    },
    LCG_45: {
      target: "stackAttributesByContainerLength.45.lcg",
      mapper: safeNumber,
      setSelf: ["size", 45],
    },
    LCG_48: {
      target: "stackAttributesByContainerLength.48.lcg",
      mapper: safeNumber,
      setSelf: ["size", 48],
    },
    STACK_WT_20: {
      target: "stackAttributesByContainerLength.20.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_24: {
      target: "stackAttributesByContainerLength.24.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_40: {
      target: "stackAttributesByContainerLength.40.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_45: {
      target: "stackAttributesByContainerLength.45.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_48: {
      target: "stackAttributesByContainerLength.48.stackWeight",
      mapper: safeNumber,
    },
    MAX_HEIGHT: { target: "maxHeight", mapper: safeNumber },
    PAIRED_BAY: { target: "pairedBay", mapper: getStafForeAftEnumValue },
    REEFER_PLUGS: { target: "reeferPlugs", mapper: getStafForeAftEnumValue },
    DOORS: { target: "doors", mapper: getStafForeAftEnumValue },
    ATHWARTSHIPS: { target: "athwartShip", mapper: yNToBoolean },
    BULKHEAD: { target: "bulkhead.fore", mapper: yNToBoolean },
    BULKHEAD_LCG: { target: "bulkhead.foreLcg", mapper: safeNumber },
  },
  postProcessors: [deleteMissingContainerLenghtData],
};

export default BayLevelConfig;
