import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import ILidData from "../../models/v1/parts/ILidData";
import IShipData from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import convertStafObjectToShipOpenSpec from "../core/convertStafObjectToShipOpenSpec";
import { ISectionsByName } from "../models/ISectionContent";
import IStackStafData from "../models/IStackStafData";
import IStafDataProcessed from "../models/IStafDataProcessed";
import ITierStafData from "../models/ITierStafData";
import BayLevelConfig from "../sections/BayLevelConfig";
import LidConfig from "../sections/LidConfig";
import ShipConfig from "../sections/ShipConfig";
import SlotConfig from "../sections/SlotConfig";
import StackConfig from "../sections/StackConfig";
import TierConfig from "../sections/TierConfig";

export function processAllSections(
  sectionsByName: ISectionsByName
): IStafDataProcessed {
  return {
    shipData: convertStafObjectToShipOpenSpec<IShipData>(
      sectionsByName["SHIP"],
      ShipConfig
    )[0],
    bayLevelData: convertStafObjectToShipOpenSpec<IBayLevelData>(
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
    lidData: convertStafObjectToShipOpenSpec<ILidData>(
      sectionsByName["LID"],
      LidConfig
    ),
  };
}
