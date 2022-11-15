import { IBaySlotData } from "../../../models/v1/parts/IBayLevelData";
import { IJoinedRowTierPattern } from "../../../models/base/types/IPositionPatterns";
import ISlotData from "../../../models/v1/parts/ISlotData";

export function cleanUpSlotInfo(perSlotInfo?: IBaySlotData) {
  if (!perSlotInfo) return;

  const slotKeys = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];

  if (slotKeys.length === 0) return;

  slotKeys.forEach((slotKey) => {
    const slotData: ISlotData = perSlotInfo[slotKey];

    if (slotData.sizes) {
      const sizes = Object.keys(slotData.sizes);

      if (sizes.length === 0 && !slotData.restricted) {
        delete perSlotInfo[slotKey];
      }
    } else {
      if (!slotData.restricted) {
        delete perSlotInfo[slotKey];
      }
    }
  });
}
