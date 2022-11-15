import {
  IIsoBayPattern,
  IJoinedRowTierPattern,
} from "../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import IRowStafData from "../types/IRowStafData";
import { addMissingBays } from "./addMissingBays";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import createSummary from "./createSummary";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedRowTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedRowTierPattern[] = ["0002", "0004"];

describe("addMissingBays should", () => {
  it("Does nothing when no bays are missing", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      11,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const summary = createSummary({ isoBays: 11, bayLevelData });

    // Bays are 1, 3, 5, 7, 9 & 11: 6 bays. Twice (above and below)
    expect(bayLevelData.length).toBe(6 * 2);

    const newBayLevelData = addMissingBays(bayLevelData, summary);

    expect(newBayLevelData.length).toBe(6 * 2);
  });

  it("Adds missing bays", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      11,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const summary = createSummary({ isoBays: 11, bayLevelData });

    const [
      bay01Ab,
      bay01Be,
      bay03Ab,
      bay03Be,
      bay05Ab,
      bay05Be,
      bay07Ab,
      bay07Be,
      bay09Ab,
      bay09Be,
      bay11Ab,
      bay11Be,
    ] = bayLevelData;

    const bayLevelDataWithMissingBays = [
      bay01Ab,
      bay01Be,
      bay03Ab,
      bay03Be,
      bay07Ab,
      bay07Be,
      bay09Ab,
      bay09Be,
    ];

    // Bays are 1, 3, 5, 7, 9 & 11: 6 bays. Twice (above and below)
    expect(bayLevelDataWithMissingBays.length).toBe(4 * 2);

    const newBayLevelData = addMissingBays(
      bayLevelDataWithMissingBays,
      summary
    );

    expect(newBayLevelData.length).toBe(6 * 2);
  });
});
