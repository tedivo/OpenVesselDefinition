import BayLevelConfig from "./BayLevelConfig";
import IRowStafData from "../../types/IRowStafData";
import { ISectionsByName } from "../../types/ISectionContent";
import ISlotData from "../../../models/v1/parts/ISlotData";
import IStafDataProcessed from "../../types/IStafDataProcessed";
import ITierStafData from "../../types/ITierStafData";
import LidConfig from "./LidConfig";
import RowConfig from "./RowConfig";
import ShipConfig from "./ShipConfig";
import SlotConfig from "./SlotConfig";
import TierConfig from "./TierConfig";
import convertStafObjectToOpenVesselDefinition from "../../core/convertStafObjectToOpenVesselDefinition";
import { IBayLevelDataStaf } from "../../types/IBayLevelDataStaf";
import { ILidDataFromStaf } from "../../types/ILidDataFromStaf";
import { IShipDataIntermediateStaf } from "../../types/IShipDataStaf";

export function processAllSections(
  sectionsByName: ISectionsByName
): IStafDataProcessed {
  return {
    shipData:
      convertStafObjectToOpenVesselDefinition<IShipDataIntermediateStaf>(
        sectionsByName["SHIP"],
        ShipConfig
      )[0],
    bayLevelData: convertStafObjectToOpenVesselDefinition<IBayLevelDataStaf>(
      sectionsByName["SECTION"],
      BayLevelConfig
    ),
    rowData: convertStafObjectToOpenVesselDefinition<IRowStafData>(
      sectionsByName["STACK"],
      RowConfig
    ),
    tierData: convertStafObjectToOpenVesselDefinition<ITierStafData>(
      sectionsByName["TIER"],
      TierConfig
    ),
    slotData: convertStafObjectToOpenVesselDefinition<ISlotData>(
      sectionsByName["SLOT"],
      SlotConfig
    ),
    lidData: convertStafObjectToOpenVesselDefinition<ILidDataFromStaf>(
      sectionsByName["LID"],
      LidConfig
    ),
  };
}
