import sortByMultipleFields from "../../helpers/sortByMultipleFields";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import ITierStafData from "../models/ITierStafData";

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
          const { isoBay, level, ...sDataK } = tData;
          bl.perTierInfo[sDataK.isoTier] = sDataK;
        });
    }
  });
}
