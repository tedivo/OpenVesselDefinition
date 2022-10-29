import { pad2, pad3 } from "../../../helpers/pad";
import {
  safeNumberMtToMm,
  safeNumberTonsToGrams,
} from "../../../helpers/safeNumberConversions";

import IRowStafData from "../../types/IRowStafData";
import ISectionMapConfig from "../../types/ISectionMapConfig";
import { deleteMissingRowInfoByLength } from "../../../helpers/deleteMissingInfo";
import { getStafBayLevelEnumValue } from "../../../models/base/enums/BayLevelEnum";
import yNToBoolean from "../../../helpers/yNToBoolean";

/**
 * DEFINITION of a Row
 */
const RowConfig: ISectionMapConfig<IRowStafData> = {
  stafSection: "STACK",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    ISO_STACK: { target: "isoRow", mapper: pad2 },
    CUSTOM_STACK: { target: "label", passValue: true, dashIsEmpty: true },
    TOP_TIER: { target: "topIsoTier", mapper: pad2 },
    BOTTOM_TIER: { target: "bottomIsoTier", mapper: pad2 },
    BOTTOM_VCG: { target: "bottomBase", mapper: safeNumberMtToMm },
    TCG: { target: "tcg", mapper: safeNumberMtToMm },
    LCG_20: {
      target: "rowInfoByLength.20.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 20],
    },
    LCG_24: {
      target: "rowInfoByLength.24.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 24],
    },
    LCG_40: {
      target: "rowInfoByLength.40.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 40],
    },
    LCG_45: {
      target: "rowInfoByLength.45.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 45],
    },
    LCG_48: {
      target: "rowInfoByLength.48.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 48],
    },
    LCG_53: {
      target: "rowInfoByLength.53.lcg",
      mapper: safeNumberMtToMm,
      setSelf: ["size", 53],
    },
    STACK_WT_20: {
      target: "rowInfoByLength.20.rowWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_24: {
      target: "rowInfoByLength.24.rowWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_40: {
      target: "rowInfoByLength.40.rowWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_45: {
      target: "rowInfoByLength.45.rowWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_48: {
      target: "rowInfoByLength.48.rowWeight",
      mapper: safeNumberTonsToGrams,
    },
    STACK_WT_53: {
      target: "rowInfoByLength.53.rowWeight",
      mapper: safeNumberTonsToGrams,
    },
    ACCEPTS_20: {
      target: "rowInfoByLength.20.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_24: {
      target: "rowInfoByLength.24.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_40: {
      target: "rowInfoByLength.40.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_45: {
      target: "rowInfoByLength.45.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_48: {
      target: "rowInfoByLength.48.acceptsSize",
      mapper: yNToBoolean,
    },
    ACCEPTS_53: {
      target: "rowInfoByLength.53.acceptsSize",
      mapper: yNToBoolean,
    },
    MAX_HT: { target: "maxHeight", mapper: safeNumberMtToMm },
  },
  postProcessors: [deleteMissingRowInfoByLength],
};

export default RowConfig;
