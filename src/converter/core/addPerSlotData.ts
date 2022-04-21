import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IJoinedStackTierPattern } from "../../models/base/types/IPositionPatterns";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import ISlotData from "../../models/v1/parts/ISlotData";

/**
 * Get SlotData and add it to BayLevelData
 * @param bayLevelData
 * @param slotData
 * @param preCalculatedMinAboveTier
 */
export default function addPerSlotData(
  bayLevelData: IBayLevelData[],
  slotData: ISlotData[],
  preCalculatedMinAboveTier: number
) {
  if (!bayLevelData) {
    throw new Error("Missing bayLevelData");
  }

  if (!slotData) return;

  bayLevelData.forEach((bl) => {
    const isoBay = bl.isoBay;

    slotData
      .filter((v) => {
        const iTIer = Number(v.position.substring(5, 7));
        return (
          v.position.indexOf(isoBay) === 0 &&
          ((bl.level === BayLevelEnum.ABOVE &&
            iTIer >= preCalculatedMinAboveTier) ||
            (bl.level === BayLevelEnum.BELOW &&
              iTIer < preCalculatedMinAboveTier))
        );
      })
      .forEach((v) => {
        const pos = v.position.substring(3, 7) as IJoinedStackTierPattern; // Remove bay

        const { position, sizes, ...withoutSizesAndPos } = v;

        // Create it if it doesn't exist
        if (!bl.perSlotInfo[pos]) bl.perSlotInfo[pos] = { pos, sizes: {} };

        // Existing sizes in BayLevelData
        const existingSizesInBl = Object.keys(bl.perSlotInfo[pos].sizes).filter(
          (size) => bl.perSlotInfo[pos].sizes[size] === 1
        );

        // Sizes from slotData
        const existingSizesInSlot = Object.keys(sizes).filter(
          (size) => sizes[size] === 1
        );

        // Concat and unique
        const allExistingSizes = existingSizesInBl
          .concat(existingSizesInSlot)
          .filter((v, idx, arr) => arr.indexOf(v) === idx);

        if (allExistingSizes.length) {
          // Create object of sizes
          bl.perSlotInfo[pos].sizes = allExistingSizes.reduce((acc, v) => {
            acc[v] = 1;
            return acc;
          }, {});

          Object.assign(bl.perSlotInfo[pos], withoutSizesAndPos);

          // Delete unnecesary reefer
          if (bl.perSlotInfo[pos].reefer === 0)
            delete bl.perSlotInfo[pos].reefer;
        } else {
          // If no sizes exist, delete object
          delete bl.perSlotInfo[pos];
        }
      });
  });
}
