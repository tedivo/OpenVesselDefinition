import IShipData from "./parts/IShipData";
import IBayLevelData from "./parts/IBayLevelData";
import ISlotData from "./parts/ISlotData";

export default interface IShipInfoData {
  shipData: IShipData;
  baysData: Array<IBayLevelData>;
  slotsData: Array<ISlotData>;
}
