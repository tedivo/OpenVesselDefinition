import { deleteMissingContainerLenghtDataWithAcceptsSize } from "../../helpers/deleteMissingInfo";
import { pad2, pad3 } from "../../helpers/pad";
import safeNumber from "../../helpers/safeNumber";
import yNToBoolean from "../../helpers/yNToBoolean";
import { getStafBayLevelEnumValue } from "../../models/base/enums/BayLevelEnum";
import ISectionMapConfig from "../models/ISectionMapConfig";
import IStackStafData from "../models/IStackStafData";

/**
 * DEFINITION of a Stack
 */
const StackConfig: ISectionMapConfig<IStackStafData & { label?: string }> = {
  stafSection: "SECTION",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    ISO_STACK: { target: "isoStack", mapper: pad2 },
    CUSTOM_STACK: { target: "label", passValue: true, dashIsEmpty: true },
    TOP_TIER: { target: "topIsoTier", mapper: pad2 },
    BOTTOM_TIER: { target: "bottomIsoTier", mapper: pad2 },
    BOTTOM_VCG: { target: "bottomVcg", mapper: safeNumber },
    TCG: { target: "tcg", mapper: safeNumber },
    LCG_20: {
      target: "stackInfoByLength.20.lcg",
      mapper: safeNumber,
      setSelf: ["size", 20],
    },
    LCG_24: {
      target: "stackInfoByLength.24.lcg",
      mapper: safeNumber,
      setSelf: ["size", 24],
    },
    LCG_40: {
      target: "stackInfoByLength.40.lcg",
      mapper: safeNumber,
      setSelf: ["size", 40],
    },
    LCG_45: {
      target: "stackInfoByLength.45.lcg",
      mapper: safeNumber,
      setSelf: ["size", 45],
    },
    LCG_48: {
      target: "stackInfoByLength.48.lcg",
      mapper: safeNumber,
      setSelf: ["size", 48],
    },
    STACK_WT_20: {
      target: "stackInfoByLength.20.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_24: {
      target: "stackInfoByLength.24.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_40: {
      target: "stackInfoByLength.40.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_45: {
      target: "stackInfoByLength.45.stackWeight",
      mapper: safeNumber,
    },
    STACK_WT_48: {
      target: "stackInfoByLength.48.stackWeight",
      mapper: safeNumber,
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
    MAX_HT: { target: "maxHeight", mapper: safeNumber },
  },
  postProcessors: [deleteMissingContainerLenghtDataWithAcceptsSize],
};

export default StackConfig;
