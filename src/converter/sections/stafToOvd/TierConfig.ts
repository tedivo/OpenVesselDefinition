import ISectionMapConfig from "../../types/ISectionMapConfig";
import ITierDataStaf from "../../types/ITierDataStaf";
import { getStafBayLevelEnumValue } from "../../../models/base/enums/BayLevelEnum";
import { pad3 } from "../../../helpers/pad";
import { safeNumberMtToMm } from "../../../helpers/safeNumberConversions";

/**
 * DEFINITION of Tier
 */
const TierConfig: ISectionMapConfig<ITierDataStaf> = {
  stafSection: "TIER",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    ISO_TIER: { target: "isoTier", passValue: true, dashIsEmpty: false },
    CUSTOM_TIER: { target: "label", passValue: true, dashIsEmpty: true },
    TIER_VCG: { target: "vcg", mapper: safeNumberMtToMm },
  },
};

export default TierConfig;
