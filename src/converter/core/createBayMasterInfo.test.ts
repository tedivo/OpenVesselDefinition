import { shipData, shipDataBays } from "../mocks/shipData";

import { IJoinedStackTierPattern } from "../../models/base/types/IPositionPatterns";
import createBayMasterInfo from "./createBayMasterInfo";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";

const mockSlotInfoKeysAbove: IJoinedStackTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedStackTierPattern[] = ["0002", "0004"];

describe("createBayMasterInfo should", () => {
  it("works correctly", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    createBayMasterInfo(bayLevelData);

    const [bay001Above] = bayLevelData;

    expect(bay001Above.masterInfo).toBeDefined();
    expect(bay001Above.masterInfo.topIsoTier).toBe("86");
    expect(bay001Above.masterInfo.bottomIsoTier).toBe("80");
    expect(bay001Above.masterInfo.bottomBase).toBe(50000);
    expect(bay001Above.masterInfo.maxHeight).toBeUndefined();
  });
});
