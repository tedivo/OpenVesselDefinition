import {
  CONTAINER_LENGTHS,
  TContainerLengths,
} from "../../models/v1/parts/Types";

import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";

export function getContainerLengths(
  bls: IBayLevelData[]
): Array<TContainerLengths> {
  const containerLenghtsInVessel: Set<TContainerLengths> = new Set();
  bls
    .filter((bl) => !!bl.perSlotInfo)
    .forEach((bl) => {
      const perSlotInfo = bl.perSlotInfo;
      const slotDataKeys = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];

      slotDataKeys.forEach((key) => {
        const slotData = perSlotInfo[key];
        if (slotData.sizes) {
          CONTAINER_LENGTHS.forEach((len) => {
            if (slotData.sizes[len]) containerLenghtsInVessel.add(len);
          });
        }
      });
    });

  return Array.from(containerLenghtsInVessel);
}
