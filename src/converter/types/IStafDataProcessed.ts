import IRowStafData from "./IRowStafData";
import ISlotData from "../../models/v1/parts/ISlotData";
import ITierStafData from "./ITierStafData";
import { IBayLevelDataStaf } from "./IBayLevelDataStaf";
import { ILidDataFromStaf } from "./ILidDataFromStaf";
import { IShipDataIntermediateStaf } from "./IShipDataStaf";

export default interface IStafDataProcessed {
  shipData: IShipDataIntermediateStaf;
  bayLevelData: IBayLevelDataStaf[];
  rowData: IRowStafData[];
  tierData: ITierStafData[];
  slotData: ISlotData[];
  lidData: ILidDataFromStaf[];
}
