import IRowDataStaf from "./IRowDataStaf";
import ISlotData from "../../models/v1/parts/ISlotData";
import ITierDataStaf from "./ITierDataStaf";
import { IBayLevelDataStaf } from "./IBayLevelDataStaf";
import { ILidDataStaf } from "./ILidDataStaf";
import { IShipDataStaf } from "./IShipDataStaf";

export default interface IStafDataProcessed {
  shipData: IShipDataStaf;
  bayLevelData: IBayLevelDataStaf[];
  rowData: IRowDataStaf[];
  tierData: ITierDataStaf[];
  slotData: ISlotData[];
  lidData: ILidDataStaf[];
}
