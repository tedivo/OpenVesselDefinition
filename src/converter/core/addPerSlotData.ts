import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import ISlotData from "../../models/v1/parts/ISlotData";

/**
 * Get SlotData and add it to BayLevelData
 * @param bayLevelData
 * @param slotData
 * @param preCalculatedMinAboveTier
 */
export default function addPerSlotData(
  bayLevelData: IBayLevelDataStaf[],
  slotData: ISlotData[],
  preCalculatedMinAboveTier: number
) {
  if (!bayLevelData) {
    throw { message: "Missing bayLevelData", code: "MissingBayData" };
  }

  if (!slotData) return;

  bayLevelData.forEach((bl) => {
    const isoBay = bl.isoBay;

    slotData
      .filter((slotData) => {
        const position: string = (slotData as any).position;
        const iTier = Number(position.substring(5));
        return (
          position.indexOf(isoBay) === 0 &&
          ((bl.level === BayLevelEnum.ABOVE &&
            iTier >= preCalculatedMinAboveTier) ||
            (bl.level === BayLevelEnum.BELOW &&
              iTier < preCalculatedMinAboveTier))
        );
      })
      .forEach((slotData) => {
        const ps: string = (slotData as any).position;
        const pos = ps.substring(3) as IJoinedRowTierPattern; // Remove bay

        const { position, sizes, ...withoutSizesAndPos } = slotData;

        // Create it if it doesn't exist
        if (!bl.perSlotInfo[pos]) bl.perSlotInfo[pos] = { pos, sizes: {} };

        // Sizes from slotData
        const existingSizesInSlot = Object.keys(sizes).filter(
          (size) => sizes[size] === 1
        );

        // Unique
        const allExistingSizes = existingSizesInSlot.filter(
          (v, idx, arr) => arr.indexOf(v) === idx
        );

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
          bl.perSlotInfo[pos] = { pos, sizes: {}, restricted: 1 };
        }
      });
  });
}
