import BayLevelConfig from "./BayLevelConfig";
import IRowDataStaf from "../../types/IRowDataStaf";
import { ISectionsByName } from "../../types/ISectionContent";
import ISlotData from "../../../models/v1/parts/ISlotData";
import IStafDataProcessed from "../../types/IStafDataProcessed";
import ITierDataStaf from "../../types/ITierDataStaf";
import LidConfig from "./LidConfig";
import RowConfig from "./RowConfig";
import ShipConfig from "./ShipConfig";
import SlotConfig from "./SlotConfig";
import TierConfig from "./TierConfig";
import convertStafObjectToOpenVesselDefinition from "../../core/convertStafObjectToOpenVesselDefinition";
import { IBayLevelDataStaf } from "../../types/IBayLevelDataStaf";
import { ILidDataStaf } from "../../types/ILidDataStaf";
import { IShipDataStaf } from "../../types/IShipDataStaf";

export function processAllSections(
  sectionsByName: ISectionsByName
): IStafDataProcessed {
  return {
    shipData:
      convertStafObjectToOpenVesselDefinition<IShipDataStaf>(
        sectionsByName["SHIP"],
        ShipConfig
      )[0],
    bayLevelData: convertStafObjectToOpenVesselDefinition<IBayLevelDataStaf>(
      sectionsByName["SECTION"],
      BayLevelConfig
    ),
    rowData: convertStafObjectToOpenVesselDefinition<IRowDataStaf>(
      sectionsByName["STACK"],
      RowConfig
    ),
    tierData: convertStafObjectToOpenVesselDefinition<ITierDataStaf>(
      sectionsByName["TIER"],
      TierConfig
    ),
    slotData: convertStafObjectToOpenVesselDefinition<ISlotData>(
      sectionsByName["SLOT"],
      SlotConfig
    ),
    lidData: convertStafObjectToOpenVesselDefinition<ILidDataStaf>(
      sectionsByName["LID"],
      LidConfig
    ),
  };
}
