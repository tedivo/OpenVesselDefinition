import IOpenShipSpecV1 from "../../../models/v1/IOpenShipSpecV1";
import cleanupStackInfo from "./cleanUpStackInfo";

export function cleanUpOVSJson(json: IOpenShipSpecV1) {
  const baylevelData = json.baysData;
  baylevelData.forEach((bl) => {
    cleanupStackInfo(bl.perStackInfo);
  });
}
