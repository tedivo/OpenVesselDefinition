import { pad7 } from "../../helpers/pad";
import yNToBoolean from "../../helpers/yNToBoolean";
import ISlotData from "../../models/v1/parts/ISlotData";
import ISectionMapConfig from "../models/ISectionMapConfig";

/**
 * DEFINITION of SLOT
 */
const SlotConfig: ISectionMapConfig<ISlotData> = {
  stafSection: "SLOT",
  mapVars: {
    SLOT: { target: "isoPosition", mapper: pad7 },
    ACCEPTS_20: { target: "acceptsContainers.20", mapper: yNToBoolean },
    ACCEPTS_24: { target: "acceptsContainers.24", mapper: yNToBoolean },
    ACCEPTS_40: { target: "acceptsContainers.40", mapper: yNToBoolean },
    ACCEPTS_45: { target: "acceptsContainers.45", mapper: yNToBoolean },
    ACCEPTS_48: { target: "acceptsContainers.48", mapper: yNToBoolean },
    REEFER_TYPE: { target: "reeferPlug", mapper: yNToBoolean },
  },
};

export default SlotConfig;
