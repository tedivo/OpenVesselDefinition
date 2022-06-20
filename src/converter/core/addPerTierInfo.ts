import sortByMultipleFields from "../../helpers/sortByMultipleFields";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import ITierStafData from "../models/ITierStafData";
import { stringIsTierOrStafNumber } from "./stringIsTierOrStafNumber";

/**
 * Adds the Tier info to the Bay
 * @param bayLevelData
 * @param tierDataByBayLevel
 */
export default function addPerTierInfo(
  bayLevelData: IBayLevelData[],
  tierDataByBayLevel: IObjectKeyArray<ITierStafData, string>
) {
  if (!bayLevelData) {
    throw new Error("Missing bayLevelData");
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
              sDataK.isoTier = label as IIsoStackTierPattern;
            } else {
              throw new Error(
                `Tier label must be an even number between 00 and 98: "${label}"`
              );
            }

          bl.perTierInfo[sDataK.isoTier] = sDataK;
        });
    }
  });
}
