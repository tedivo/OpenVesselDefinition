import { IObjectKey } from "../../helpers/types/IObjectKey";
import ISizeSummary from "../base/ISizeSummary";
import OpenShipSpecVersion from "../base/OpenShipSpecVersion";
import { IIsoPositionPattern } from "../base/types/IPositionPatterns";
import IBayLevelData from "./parts/IBayLevelData";
import ILidData from "./parts/ILidData";
import IShipData from "./parts/IShipData";
import ISlotData from "./parts/ISlotData";

export default interface IOpenShipSpecV1 extends OpenShipSpecVersion {
  sizeSummary: ISizeSummary;
  shipData: IShipData;
  baysData: Array<IBayLevelData>;
  slotsDataByPosition: IObjectKey<ISlotData, IIsoPositionPattern>;
  lidData: Array<ILidData>;
}
