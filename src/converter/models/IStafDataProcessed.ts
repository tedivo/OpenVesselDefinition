import { IBayLevelDataIntermediate } from "../../models/v1/parts/IBayLevelData";
import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import { IShipDataIntermediateStaf } from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import IStackStafData from "../models/IStackStafData";
import ITierStafData from "../models/ITierStafData";

export default interface IStafDataProcessed {
  shipData: IShipDataIntermediateStaf;
  bayLevelData: IBayLevelDataIntermediate[];
  stackData: IStackStafData[];
  tierData: ITierStafData[];
  slotData: ISlotData[];
  lidData: ILidDataFromStaf[];
}
