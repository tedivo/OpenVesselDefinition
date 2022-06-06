import IOpenShipSpecV1 from "../../../models/v1/IOpenShipSpecV1";
import { IStackAttributesByContainerLengthWithAcceptsSize } from "../../models/IStackStafData";
import cleanUpPerStackInfo from "./cleanupStackInfo";

export function cleanUpOVSJson<T>(json: IOpenShipSpecV1) {
  const baylevelData = json.baysData;
  baylevelData.forEach((bl) => {
    cleanUpPerStackInfo(bl.perStackInfo);
  });
}
