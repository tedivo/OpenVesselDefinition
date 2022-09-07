import IOpenShipSpecV1 from "../../../models/v1/IOpenShipSpecV1";
import cleanUpStackInfo from "./cleanUpStackInfo";

export function cleanUpOVSJson(json: IOpenShipSpecV1) {
  const baylevelData = json.baysData;
  baylevelData.forEach((bl) => {
    cleanUpStackInfo(bl.perStackInfo);
  });
}
