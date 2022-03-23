import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import IShipData from "../../models/v1/parts/IShipData";
import IStackStafData from "../models/IStackStafData";
import ILidData from "../../models/v1/parts/ILidData";
import ISlotData from "../../models/v1/parts/ISlotData";
import ITierStafData from "../models/ITierStafData";

export default interface IStafDataProcessed {
  shipData: IShipData;
  bayLevelData: IBayLevelData[];
  stackData: IStackStafData[];
  tierData: ITierStafData[];
  slotData: ISlotData[];
  lidData: ILidData[];
}
