import { pad2 } from "../../helpers/pad";
import {
  IBaySlotData,
  IBayStackInfo,
  TBayStackInfo,
} from "../../models/v1/parts/IBayLevelData";

export function createSlotsFromStack(
  stackData: IBayStackInfo,
  baySlotData: IBaySlotData
): IBaySlotData {
  for (
    let iTier = Number(stackData.bottomIsoTier);
    iTier <= Number(stackData.topIsoTier);
    iTier += 2
  ) {
    const stackTier = `${stackData.isoStack}|${pad2(iTier)}`;

    baySlotData[stackTier] = { stackTier };

    const sizes = Object.keys(stackData.stackAttributesByContainerLength);
    sizes.forEach((size) => {
      if (!baySlotData[stackTier].sizes) baySlotData[stackTier].sizes = {};
      baySlotData[stackTier].sizes[size] = 1;
    });
  }

  return baySlotData;
}

export default function createSlotsFromStacksInfo(
  stacksData: TBayStackInfo,
  baySlotData: IBaySlotData
): IBaySlotData {
  Object.keys(stacksData).forEach((stack) => {
    const stackData = stacksData[stack];
    baySlotData = createSlotsFromStack(stackData, baySlotData);
  });
  return baySlotData;
}
