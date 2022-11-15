import { IBaySlotData } from "../../../models/v1/parts/IBayLevelData";
import { cleanUpSlotInfo } from "./cleanUpSlotInfo";

describe("cleanUpSlotInfo should", () => {
  it("works ok with existing sizes", () => {
    const perSlotInfo: IBaySlotData = {
      "0080": { pos: "0080", sizes: { "20": 1, "24": 1 } },
      "0082": { pos: "0082", sizes: { "20": 1, "24": 1 } },
    };

    cleanUpSlotInfo(perSlotInfo);

    expect(Object.keys(perSlotInfo)).toStrictEqual(["0080", "0082"]);
  });

  it("works ok with existing sizes and restricted slots", () => {
    const perSlotInfo: IBaySlotData = {
      "0080": { pos: "0080", sizes: { "20": 1, "24": 1 } },
      "0082": { pos: "0082", sizes: {}, restricted: 1 },
    };

    cleanUpSlotInfo(perSlotInfo);

    expect(Object.keys(perSlotInfo)).toStrictEqual(["0080", "0082"]);
  });

  it("removes slots without sizes nor restricted", () => {
    const perSlotInfo: IBaySlotData = {
      "0080": { pos: "0080", sizes: { "20": 1, "24": 1 } },
      "0082": { pos: "0082", sizes: {}, restricted: 0 },
      "0084": { pos: "0084", sizes: {} },
    };

    cleanUpSlotInfo(perSlotInfo);

    expect(Object.keys(perSlotInfo)).toStrictEqual(["0080"]);
  });
});
