import BayLevelConfig from "../sections/BayLevelConfig";
import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import { ISectionsByName } from "../models/ISectionContent";
import { IShipDataIntermediateStaf } from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import IStackStafData from "../models/IStackStafData";
import IStafDataProcessed from "../models/IStafDataProcessed";
import ITierStafData from "../models/ITierStafData";
import LidConfig from "../sections/LidConfig";
import ShipConfig from "../sections/ShipConfig";
import SlotConfig from "../sections/SlotConfig";
import StackConfig from "../sections/StackConfig";
import TierConfig from "../sections/TierConfig";
import convertStafObjectToShipOpenSpec from "../core/convertStafObjectToShipOpenSpec";

export function processAllSections(
  sectionsByName: ISectionsByName
): IStafDataProcessed {
  return {
    shipData: convertStafObjectToShipOpenSpec<IShipDataIntermediateStaf>(
      sectionsByName["SHIP"],
      ShipConfig
    )[0],
    bayLevelData: convertStafObjectToShipOpenSpec<IBayLevelDataStaf>(
      sectionsByName["SECTION"],
      BayLevelConfig
    ),
    stackData: convertStafObjectToShipOpenSpec<IStackStafData>(
      sectionsByName["STACK"],
      StackConfig
    ),
    tierData: convertStafObjectToShipOpenSpec<ITierStafData>(
      sectionsByName["TIER"],
      TierConfig
    ),
    slotData: convertStafObjectToShipOpenSpec<ISlotData>(
      sectionsByName["SLOT"],
      SlotConfig
    ),
    lidData: convertStafObjectToShipOpenSpec<ILidDataFromStaf>(
      sectionsByName["LID"],
      LidConfig
    ),
  };
}
