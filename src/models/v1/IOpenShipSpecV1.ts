import ISizeSummary from "../base/ISizeSummary";
import OpenShipSpecVersion from "../base/OpenShipSpecVersion";
import IBayLevelData from "./parts/IBayLevelData";
import ILabelsData from "./parts/ILabelsData";
import ILidData from "./parts/ILidData";
import IShipData from "./parts/IShipData";

export default interface IOpenShipSpecV1 extends OpenShipSpecVersion {
  sizeSummary: ISizeSummary;
  shipData: IShipData;
  labels: ILabelsData;
  baysData: Array<IBayLevelData>;
  lidData: Array<ILidData>;
}
