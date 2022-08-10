import { pad2, pad3 } from "../../../helpers/pad";
import {
  safeNumberMtToMm,
  safeNumberTonsToGrams,
} from "../../../helpers/safeNumberConversions";

import ISectionMapConfig from "../../types/ISectionMapConfig";
import IStackStafData from "../../types/IStackStafData";
import { deleteMissingStackInfoByLength } from "../../../helpers/deleteMissingInfo";
import { getStafBayLevelEnumValue } from "../../../models/base/enums/BayLevelEnum";
import yNToBoolean from "../../../helpers/yNToBoolean";

/**
 * DEFINITION of a Stack
 */
const StackConfig: ISectionMapConfig<IStackStafData> = {
  stafSection: "SECTION",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    ISO_STACK: { target: "isoStack", mapper: pad2 },
    CUSTOM_STACK: { target: "label", passValue: true, dashIsEmpty: true },
    TOP_TIER: { target: "topIsoTier", mapper: pad2 },
    BOTTOM_TIER: { target: "bottomIsoTier", mapper: pad2 },
    BOTTOM_VCG: { target: "bottomBase", mapper: safeNumberMtToMm },
    TCG: { target: "tcg", mapper: safeNumberMtToMm },
    LCG_20: {
      target: "stackInfoByLength.20.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 20],
    },
    LCG_24: {
      target: "stackInfoByLength.24.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 24],
    },
    LCG_40: {
      target: "stackInfoByLength.40.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 40],
    },
    LCG_45: {
      target: "stackInfoByLength.45.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 45],
    },
    LCG_48: {
      target: "stackInfoByLength.48.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 48],
    },
    LCG_53: {
      target: "stackInfoByLength.53.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 53],
    },
    STACK_WT_20: {
      target: "stackInfoByLength.20.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_24: {
      target: "stackInfoByLength.24.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_40: {
      target: "stackInfoByLength.40.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_45: {
      target: "stackInfoByLength.45.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_48: {
      target: "stackInfoByLength.48.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_53: {
      target: "stackInfoByLength.53.stackWeight",
      mapper: safeNumberTonsToGrams,
    },
    ACCEPTS_20: {
      target: "stackInfoByLength.20.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_24: {
      target: "stackInfoByLength.24.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_40: {
      target: "stackInfoByLength.40.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_45: {
      target: "stackInfoByLength.45.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_48: {
      target: "stackInfoByLength.48.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_53: {
      target: "stackInfoByLength.53.acceptsSize",
      mapper: yNToBoolean,
    },
    MAX_HT: { target: "maxHeight", mapper: safeNumberMtToMm },
  },
  postProcessors: [deleteMissingStackInfoByLength],
};

export default StackConfig;
