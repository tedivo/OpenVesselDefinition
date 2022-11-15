import IOpenShipSpecV1 from "../../../models/v1/IOpenShipSpecV1";
import { cleanUpRowInfo } from "./cleanUpRowInfo";
import { cleanUpSlotInfo } from "./cleanUpSlotInfo";

export function cleanUpOVSJson(json: IOpenShipSpecV1) {
  const baylevelData = json.baysData;
  baylevelData.forEach((bl) => {
    cleanUpRowInfo(bl.perRowInfo);
    cleanUpSlotInfo(bl.perSlotInfo);
  });
}
