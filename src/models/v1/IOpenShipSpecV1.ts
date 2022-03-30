import { IObjectKey } from "../../helpers/types/IObjectKey";
import { IPosition } from "../../helpers/types/IPositionPatterns";
import OpenShipSpecVersion from "./OpenShipSpecVersion";
import IBayLevelData from "./parts/IBayLevelData";
import ILidData from "./parts/ILidData";
import IShipData from "./parts/IShipData";
import ISlotData from "./parts/ISlotData";

export default interface IOpenShipSpecV1 extends OpenShipSpecVersion {
  shipData: IShipData;
  baysData: Array<IBayLevelData>;
  slotsDataByPosition: IObjectKey<ISlotData, IPosition>;
  lidData: Array<ILidData>;
}
