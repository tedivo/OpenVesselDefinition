import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import calculateCommonRowInfo from "./calculateCommonRowInfo";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedRowTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedRowTierPattern[] = ["0002", "0004"];

describe("calculateBayMasterInfo should", () => {
  it("works correctly", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    calculateCommonRowInfo(bayLevelData);

    const [bay001Above] = bayLevelData;

    expect(bay001Above.perRowInfo.common).toBeDefined();
    expect(bay001Above.perRowInfo.common.bottomBase).toBe(50000);
    expect(bay001Above.perRowInfo.common.maxHeight).toBeUndefined();
  });
});
