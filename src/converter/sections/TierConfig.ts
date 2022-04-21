import { pad3 } from "../../helpers/pad";
import safeNumber from "../../helpers/safeNumber";
import { getStafBayLevelEnumValue } from "../../models/base/enums/BayLevelEnum";
import ISectionMapConfig from "../models/ISectionMapConfig";
import ITierStafData from "../models/ITierStafData";

/**
 * DEFINITION of Tier
 */
const TierConfig: ISectionMapConfig<ITierStafData & { label?: string }> = {
  stafSection: "TIER",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    ISO_TIER: { target: "isoTier", passValue: true, dashIsEmpty: false },
    CUSTOM_TIER: { target: "label", passValue: true, dashIsEmpty: true },
    TIER_VCG: { target: "vcg", mapper: safeNumber },
  },
};

export default TierConfig;
