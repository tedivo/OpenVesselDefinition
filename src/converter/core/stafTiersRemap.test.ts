import { shipData, shipDataBays } from "../mocks/shipData";

import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import createSummary from "./createSummary";
import { stafTiersRemap } from "./stafTiersRemap";

const mockSlotInfoKeysAbove: IJoinedRowTierPattern[] = [
  "0080",
  "0082",
  "0084",
  "0086",
];
const mockSlotInfoKeysBelow: IJoinedRowTierPattern[] = ["0002", "0004"];

function createMockedBl() {
  const bayLevelData = createMockedSimpleBayLevelData(
    3,
    mockSlotInfoKeysAbove,
    mockSlotInfoKeysBelow
  ).map((bl) => {
    const { perTierInfo, ...rest } = bl;
    return rest;
  });

  const params = {
    isoBays: shipDataBays,
    shipData,
    bayLevelData,
  };

  const summary = createSummary(params);

  return {
    bayLevelData,
    summary,
  };
}

describe("stafTiersRemap should", () => {
  it("Keep info the same when tier82is=82", () => {
    const { bayLevelData, summary } = createMockedBl();

    expect(summary.maxAboveTier).toBe(86);
    expect(summary.minAboveTier).toBe(80);
    expect(bayLevelData.length).toBe(4);
    expect(Object.keys(bayLevelData[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);

    const { sizeSummary, bls } = stafTiersRemap(summary, bayLevelData, 82);

    expect(sizeSummary.maxAboveTier).toBe(86);
    expect(sizeSummary.minAboveTier).toBe(80);
    expect(bls.length).toBe(4);
    expect(Object.keys(bls[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);
  });

  it("Translate tiers when tier82is !== 82", () => {
    const { bayLevelData, summary } = createMockedBl();

    expect(summary.maxAboveTier).toBe(86);
    expect(summary.minAboveTier).toBe(80);
    expect(bayLevelData.length).toBe(4);
    expect(Object.keys(bayLevelData[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);

    const { sizeSummary, bls } = stafTiersRemap(summary, bayLevelData, 72);

    expect(sizeSummary.maxAboveTier).toBe(76);
    expect(sizeSummary.minAboveTier).toBe(70);
    expect(bls.length).toBe(4);
    expect(Object.keys(bls[0].perSlotInfo).sort()).toStrictEqual([
      "0070",
      "0072",
      "0074",
      "0076",
    ]);
  });
});
