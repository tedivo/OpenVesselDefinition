import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { IIsoTierPattern } from "../../models/base/types/IPositionPatterns";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import ITierStafData from "../types/ITierStafData";
import sortByMultipleFields from "../../helpers/sortByMultipleFields";
import { stringIsTierOrStafNumber } from "./stringIsTierOrStafNumber";

/**
 * Adds the Tier info to the Bay
 * @param bayLevelData
 * @param tierDataByBayLevel
 */
export default function addPerTierInfo(
  bayLevelData: IBayLevelDataStaf[],
  tierDataByBayLevel: IObjectKeyArray<ITierStafData, string>
) {
  if (!bayLevelData) {
    throw { message: "Missing bayLevelData", code: "MissingBayData" };
  }

  if (!tierDataByBayLevel) return;

  bayLevelData.forEach((bl) => {
    const key = `${bl.isoBay}-${bl.level}`;
    const tierDataOfBay = tierDataByBayLevel[key];
    if (!bl.perTierInfo) bl.perTierInfo = {};
    if (tierDataOfBay) {
      tierDataOfBay
        .sort(
          sortByMultipleFields<ITierStafData>([
            { name: "isoTier", ascending: true },
          ])
        )
        .forEach((tData) => {
          const { isoBay, level, label, ...sDataK } = tData;

          if (label)
            if (stringIsTierOrStafNumber(label, true)) {
              sDataK.isoTier = label as IIsoTierPattern;
            } else {
              throw {
                code: "TierLabelError",
                message: `Tier label must be an even number between 00 and 98: "${label}"`,
              };
            }

          bl.perTierInfo[sDataK.isoTier] = sDataK;
        });
    }
  });
}
