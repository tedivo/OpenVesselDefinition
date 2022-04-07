import { IObjectKey } from "../../helpers/types/IObjectKey";
import { IIsoPositionPattern } from "../../models/base/types/IPositionPatterns";
import ISlotData from "../../models/v1/parts/ISlotData";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipData } from "../mocks/shipData";
import { createMockedSlotData } from "../mocks/slotData";
import createSummary from "./createSummary";

const mockSlotPositions: IIsoPositionPattern[] = [
  "0010080",
  "0030080",
  "0020082",
  "0040082",
];

describe("createSummary should", () => {
  it("works correctly", () => {
    const bayLevelData = createMockedSimpleBayLevelData(shipData.isoBays);
    const slotData: IObjectKey<ISlotData, IIsoPositionPattern> = {};

    mockSlotPositions.forEach((position) => {
      slotData[position] = createMockedSlotData(position);
    });

    const params = {
      shipData,
      bayLevelData,
      slotData,
    };

    const summary = createSummary(params);

    expect(summary.isoBays).toBe(13);
    expect(summary.centerLineStack).toBe(1);
    expect(summary.maxStack).toBe("02");
    expect(summary.maxAboveTier).toBe("86");
    expect(summary.minAboveTier).toBe("80");
    expect(summary.maxBelowTier).toBe("08");
    expect(summary.minBelowTier).toBe("02");
  });

  it("manages inconsistencies in Stack", () => {
    const bayLevelData = createMockedSimpleBayLevelData(shipData.isoBays);
    const slotData: IObjectKey<ISlotData, IIsoPositionPattern> = {};

    const inconsistentPositions = mockSlotPositions.slice();
    inconsistentPositions.push("0010480");

    inconsistentPositions.forEach((position) => {
      slotData[position] = createMockedSlotData(position);
    });

    const params = {
      shipData,
      bayLevelData,
      slotData,
    };

    const summary = createSummary(params);

    expect(summary.isoBays).toBe(13);
    expect(summary.centerLineStack).toBe(1);
    expect(summary.maxStack).toBe("04");
    expect(summary.maxAboveTier).toBe("86");
    expect(summary.minAboveTier).toBe("80");
    expect(summary.maxBelowTier).toBe("08");
    expect(summary.minBelowTier).toBe("02");
  });

  it("manages inconsistencies in Tiers", () => {
    const bayLevelData = createMockedSimpleBayLevelData(shipData.isoBays);
    const slotData: IObjectKey<ISlotData, IIsoPositionPattern> = {};

    const inconsistentPositions = mockSlotPositions.slice();
    inconsistentPositions.push("0010288");

    inconsistentPositions.forEach((position) => {
      slotData[position] = createMockedSlotData(position);
    });

    const params = {
      shipData,
      bayLevelData,
      slotData,
    };

    const summary = createSummary(params);

    expect(summary.isoBays).toBe(13);
    expect(summary.centerLineStack).toBe(1);
    expect(summary.maxStack).toBe("02");
    expect(summary.maxAboveTier).toBe("88");
    expect(summary.minAboveTier).toBe("80");
    expect(summary.maxBelowTier).toBe("08");
    expect(summary.minBelowTier).toBe("02");
  });
});
