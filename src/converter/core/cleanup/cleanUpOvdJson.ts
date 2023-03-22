import IOpenVesselDefinitionV1 from "../../../models/v1/IOpenVesselDefinitionV1";
import { cleanUpRowInfo } from "./cleanUpRowInfo";
import { cleanUpSlotInfo } from "./cleanUpSlotInfo";

export function cleanUpOvdJson(json: IOpenVesselDefinitionV1) {
  const baylevelData = json.baysData;
  baylevelData.forEach((bl) => {
    cleanUpRowInfo(bl.perRowInfo);
    cleanUpSlotInfo(bl.perSlotInfo);
  });
}
