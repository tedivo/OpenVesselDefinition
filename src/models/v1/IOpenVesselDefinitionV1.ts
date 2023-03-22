import IBayLevelData from "./parts/IBayLevelData";
import ILidData from "./parts/ILidData";
import IPositionLabels from "./parts/IPositionLabels";
import IShipData from "./parts/IShipData";
import ISizeSummary from "../base/ISizeSummary";
import OpenVesselDefinitionVersion from "../base/OpenVesselDefinitionVersion";

export default interface IOpenVesselDefinitionV1
  extends OpenVesselDefinitionVersion {
  sizeSummary: ISizeSummary;
  shipData: IShipData;
  baysData: Array<IBayLevelData>;
  positionLabels: IPositionLabels;
  lidData: Array<ILidData>;
}
