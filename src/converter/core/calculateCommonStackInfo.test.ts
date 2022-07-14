import { IJoinedStackTierPattern } from "../../models/base/types/IPositionPatterns";
import calculateCommonStackInfo from "./calculateCommonStackInfo";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedStackTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedStackTierPattern[] = ["0002", "0004"];

describe("calculateBayMasterInfo should", () => {
  it("works correctly", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    calculateCommonStackInfo(bayLevelData);

    const [bay001Above] = bayLevelData;

    expect(bay001Above.perStackInfo.common).toBeDefined();
    expect(bay001Above.perStackInfo.common.topIsoTier).toBe("86");
    expect(bay001Above.perStackInfo.common.bottomIsoTier).toBe("80");
    expect(bay001Above.perStackInfo.common.bottomBase).toBe(50000);
    expect(bay001Above.perStackInfo.common.maxHeight).toBeUndefined();
  });
});
