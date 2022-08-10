import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import { IShipDataIntermediateStaf } from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import IStackStafData from "./IStackStafData";
import ITierStafData from "./ITierStafData";

export default interface IStafDataProcessed {
  shipData: IShipDataIntermediateStaf;
  bayLevelData: IBayLevelDataStaf[];
  stackData: IStackStafData[];
  tierData: ITierStafData[];
  slotData: ISlotData[];
  lidData: ILidDataFromStaf[];
}
