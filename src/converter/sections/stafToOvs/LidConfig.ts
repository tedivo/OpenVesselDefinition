import { pad2, pad3 } from "../../../helpers/pad";

import { ILidDataFromStaf } from "../../../models/v1/parts/ILidData";
import ISectionMapConfig from "../../types/ISectionMapConfig";
import { getStafBayLevelEnumValue } from "../../../models/base/enums/BayLevelEnum";
import yNToBooleanLoose from "../../../helpers/yNToBooleanLoose";

/**
 * DEFINITION of LID
 */
const SlotConfig: ISectionMapConfig<ILidDataFromStaf> = {
  stafSection: "LID",
  mapVars: {
    STAF_BAY: { target: "isoBay", mapper: pad3 },
    LEVEL: { target: "level", mapper: getStafBayLevelEnumValue },
    LID_ID: {
      target: "label",
      passValue: true,
      dashIsEmpty: false,
    },
    PORT_ISO_STACK: { target: "portIsoStack", mapper: pad2 },
    STBD_ISO_STACK: { target: "starboardIsoStack", mapper: pad2 },
    JOIN_LID_FWD: {
      target: "joinLidFwdLabel",
      passValue: true,
      dashIsEmpty: true,
    },
    JOIN_LID_AFT: {
      target: "joinLidAftLabel",
      passValue: true,
      dashIsEmpty: true,
    },
    OVERLAP_PORT: { target: "overlapPort", mapper: yNToBooleanLoose },
    OVERLAP_STBD: { target: "overlapStarboard", mapper: yNToBooleanLoose },
  },
};

export default SlotConfig;
