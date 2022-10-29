import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import ISlotData from "../../models/v1/parts/ISlotData";
import addPerSlotData from "./addPerSlotData";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedRowTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedRowTierPattern[] = ["0002", "0004"];

describe("addPerSlotData should", () => {
  it("work ok with missing SlotData Info", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    addPerSlotData(bayLevelData, undefined as ISlotData[], 80);
  });

  it("used row-tier data to create slotData", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    // Indexes in mocked Array
    const BAY001_ABOVE_Index = 0;
    const BAY001_BELOW_Index = 1;
    const BAY003_BELOW_Index = 3;

    addPerSlotData(bayLevelData, [], 80);

    expect(
      Object.keys(bayLevelData[BAY001_ABOVE_Index].perSlotInfo)
    ).toStrictEqual(["0080", "0082"]);
    expect(
      Object.keys(bayLevelData[BAY001_BELOW_Index].perSlotInfo)
    ).toStrictEqual(["0002", "0004"]);

    expect(bayLevelData[BAY001_ABOVE_Index].perSlotInfo["0080"]).toBeDefined();
    expect(
      bayLevelData[BAY001_ABOVE_Index].perSlotInfo["0090"]
    ).toBeUndefined();
    expect(
      Object.keys(bayLevelData[0].perSlotInfo["0080"].sizes)
    ).toStrictEqual(["20", "24"]);

    expect(bayLevelData[BAY003_BELOW_Index].perSlotInfo["0002"]).toBeDefined();
    expect(
      bayLevelData[BAY003_BELOW_Index].perSlotInfo["0010"]
    ).toBeUndefined();
    expect(
      Object.keys(bayLevelData[BAY003_BELOW_Index].perSlotInfo["0002"].sizes)
    ).toStrictEqual(["20", "40"]);
  });

  it("adds slot data to BayLevel", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const row03Prev = bayLevelData[0].perRowInfo["03"];
    expect(row03Prev).toBeUndefined();

    const slotData: ISlotData[] = [
      { position: "0010380", pos: "0380", sizes: { 20: 1, 24: 1 } },
    ];

    addPerSlotData([bayLevelData[0]], slotData, 80);

    const perSlotInfo0380 = bayLevelData[0].perSlotInfo["0380"];
    expect(perSlotInfo0380).toBeDefined();
  });
});
