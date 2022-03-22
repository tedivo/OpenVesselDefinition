import IBayLevelData from "./parts/IBayLevelData";
import ILidData from "./parts/ILidData";
import IShipData from "./parts/IShipData";
import ISlotData from "./parts/ISlotData";

export default interface IShipInfoData {
  shipData: IShipData;
  baysData: Array<IBayLevelData>;
  slotsData: Array<ISlotData>;
  lidData: Array<ILidData>;
}
