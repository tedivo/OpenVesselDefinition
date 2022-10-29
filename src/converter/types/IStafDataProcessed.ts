import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import IRowStafData from "./IRowStafData";
import { IShipDataIntermediateStaf } from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import ITierStafData from "./ITierStafData";

export default interface IStafDataProcessed {
  shipData: IShipDataIntermediateStaf;
  bayLevelData: IBayLevelDataStaf[];
  rowData: IRowStafData[];
  tierData: ITierStafData[];
  slotData: ISlotData[];
  lidData: ILidDataFromStaf[];
}
