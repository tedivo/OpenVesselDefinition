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
    const pos = `${stackData.isoStack}${pad2(iTier)}`;

    baySlotData[pos] = { pos };

    const sizes = Object.keys(stackData.stackInfoByLength);

    if (sizes.length) {
      sizes.forEach((size) => {
        if (!baySlotData[pos].sizes) baySlotData[pos].sizes = {};
        baySlotData[pos].sizes[size] = 1;
      });
    } else {
      delete baySlotData[pos];
    }
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
