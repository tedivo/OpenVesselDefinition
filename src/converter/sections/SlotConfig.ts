import ISectionMapConfig from "../models/ISectionMapConfig";
import ISlotData from "../../models/v1/parts/ISlotData";
import { pad7 } from "../../helpers/pad";
import yNToBoolean from "../../helpers/yNToBoolean";

/**
 * DEFINITION of SLOT
 */
const SlotConfig: ISectionMapConfig<ISlotData> = {
  stafSection: "SLOT",
  mapVars: {
    SLOT: { target: "position", mapper: pad7 },
    ACCEPTS_20: { target: "sizes.20", mapper: yNToBoolean },
    ACCEPTS_24: { target: "sizes.24", mapper: yNToBoolean },
    ACCEPTS_40: { target: "sizes.40", mapper: yNToBoolean },
    ACCEPTS_45: { target: "sizes.45", mapper: yNToBoolean },
    ACCEPTS_48: { target: "sizes.48", mapper: yNToBoolean },
    REEFER_TYPE: { target: "reefer", mapper: yNToBoolean },
  },
};

export default SlotConfig;
