import { TNumberPadded7 } from "../../helpers/pad";
import { IObjectKey } from "../../helpers/types/IObjectKey";
import OpenShipSpecVersion from "./OpenShipSpecVersion";
import IBayLevelData from "./parts/IBayLevelData";
import ILidData from "./parts/ILidData";
import IShipData from "./parts/IShipData";
import ISlotData from "./parts/ISlotData";

export default interface IOpenShipSpecV1 extends OpenShipSpecVersion {
  shipData: IShipData;
  baysData: Array<IBayLevelData>;
  slotsDataByPosition: IObjectKey<ISlotData, TNumberPadded7>;
  lidData: Array<ILidData>;
}
