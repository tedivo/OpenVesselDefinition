import { IJoinedStackTierPattern } from "../../models/base/types/IPositionPatterns";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import {
  TContainerLengths,
  CONTAINER_LENGTHS,
} from "../../models/v1/parts/Types";

export function getContainerLengths(
  bls: IBayLevelData[]
): Array<TContainerLengths> {
  const containerLenghtsInVessel: Set<TContainerLengths> = new Set();
  bls
    .filter((bl) => !!bl.perSlotInfo)
    .forEach((bl) => {
      const perSlotInfo = bl.perSlotInfo;
      const slotDataKeys = Object.keys(
        perSlotInfo
      ) as IJoinedStackTierPattern[];

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
