import BayLevelConfig from "./BayLevelConfig";
import { IBayLevelDataStaf } from "../../../models/v1/parts/IBayLevelData";
import { ILidDataFromStaf } from "../../../models/v1/parts/ILidData";
import IRowStafData from "../../types/IRowStafData";
import { ISectionsByName } from "../../types/ISectionContent";
import { IShipDataIntermediateStaf } from "../../../models/v1/parts/IShipData";
import ISlotData from "../../../models/v1/parts/ISlotData";
import IStafDataProcessed from "../../types/IStafDataProcessed";
import ITierStafData from "../../types/ITierStafData";
import LidConfig from "./LidConfig";
import RowConfig from "./RowConfig";
import ShipConfig from "./ShipConfig";
import SlotConfig from "./SlotConfig";
import TierConfig from "./TierConfig";
import convertStafObjectToOpenVesselSpec from "../../core/convertStafObjectToOpenVesselSpec";

export function processAllSections(
  sectionsByName: ISectionsByName
): IStafDataProcessed {
  return {
    shipData: convertStafObjectToOpenVesselSpec<IShipDataIntermediateStaf>(
      sectionsByName["SHIP"],
      ShipConfig
    )[0],
    bayLevelData: convertStafObjectToOpenVesselSpec<IBayLevelDataStaf>(
      sectionsByName["SECTION"],
      BayLevelConfig
    ),
    rowData: convertStafObjectToOpenVesselSpec<IRowStafData>(
      sectionsByName["STACK"],
      RowConfig
    ),
    tierData: convertStafObjectToOpenVesselSpec<ITierStafData>(
      sectionsByName["TIER"],
      TierConfig
    ),
    slotData: convertStafObjectToOpenVesselSpec<ISlotData>(
      sectionsByName["SLOT"],
      SlotConfig
    ),
    lidData: convertStafObjectToOpenVesselSpec<ILidDataFromStaf>(
      sectionsByName["LID"],
      LidConfig
    ),
  };
}
