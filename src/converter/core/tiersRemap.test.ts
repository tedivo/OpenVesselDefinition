import { shipData, shipDataBays } from "../mocks/shipData";

import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import { IMasterCGs } from "../../models/v1/parts/IShipData";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import createSummary from "./createSummary";
import { tiersRemap } from "./tiersRemap";

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

  const masterCGs: IMasterCGs = {
    aboveTcgs: {
      "00": 10,
      "01": 2610,
      "02": -2590,
    },
    belowTcgs: {
      "00": 10,
      "01": 2610,
      "02": -2590,
    },
    bottomBases: {
      "80": 20000,
      "02": 1000,
    },
  };

  const summary = createSummary(params);

  return {
    bayLevelData,
    summary,
    masterCGs,
  };
}

describe("stafTiersRemap should", () => {
  it("Keep info the same when tier82is=82", () => {
    const { bayLevelData, summary, masterCGs } = createMockedBl();

    expect(summary.maxAboveTier).toBe(86);
    expect(summary.minAboveTier).toBe(80);
    expect(bayLevelData.length).toBe(4);
    expect(Object.keys(bayLevelData[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);

    const {
      sizeSummary,
      bls,
      masterCGs: newMCGs,
    } = tiersRemap({
      sizeSummary: summary,
      masterCGs,
      bls: bayLevelData,
      tier82is: 82,
      mapFromStafToOvs: true,
    });

    expect(sizeSummary.maxAboveTier).toBe(86);
    expect(sizeSummary.minAboveTier).toBe(80);
    expect(bls.length).toBe(4);
    expect(Object.keys(bls[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);

    expect(newMCGs.aboveTcgs["00"]).toBe(10);
    expect(newMCGs.aboveTcgs["01"]).toBe(2610);
    expect(newMCGs.aboveTcgs["02"]).toBe(-2590);
    expect(newMCGs.belowTcgs["00"]).toBe(10);
    expect(newMCGs.belowTcgs["01"]).toBe(2610);
    expect(newMCGs.belowTcgs["02"]).toBe(-2590);
    expect(newMCGs.bottomBases["80"]).toBe(20000);
    expect(newMCGs.bottomBases["02"]).toBe(1000);
  });

  it("Translate tiers when tier82is !== 82, STAF->OVS", () => {
    const { bayLevelData, summary, masterCGs } = createMockedBl();

    expect(summary.maxAboveTier).toBe(86);
    expect(summary.minAboveTier).toBe(80);
    expect(bayLevelData.length).toBe(4);
    expect(Object.keys(bayLevelData[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);

    const {
      sizeSummary,
      bls,
      masterCGs: newMCGs,
    } = tiersRemap({
      sizeSummary: summary,
      masterCGs,
      bls: bayLevelData,
      tier82is: 72,
      mapFromStafToOvs: true,
    });

    expect(sizeSummary.maxAboveTier).toBe(76);
    expect(sizeSummary.minAboveTier).toBe(70);
    expect(bls.length).toBe(4);
    expect(Object.keys(bls[0].perSlotInfo).sort()).toStrictEqual([
      "0070",
      "0072",
      "0074",
      "0076",
    ]);

    expect(newMCGs.aboveTcgs["00"]).toBe(10);
    expect(newMCGs.aboveTcgs["01"]).toBe(2610);
    expect(newMCGs.aboveTcgs["02"]).toBe(-2590);
    expect(newMCGs.belowTcgs["00"]).toBe(10);
    expect(newMCGs.belowTcgs["01"]).toBe(2610);
    expect(newMCGs.belowTcgs["02"]).toBe(-2590);
    expect(newMCGs.bottomBases["70"]).toBe(20000);
    expect(newMCGs.bottomBases["02"]).toBe(1000);
  });

  it("Translate tiers when tier82is !== 82, OVS->STAF", () => {
    const { bayLevelData, summary, masterCGs } = createMockedBl();

    expect(summary.maxAboveTier).toBe(86);
    expect(summary.minAboveTier).toBe(80);
    expect(bayLevelData.length).toBe(4);
    expect(Object.keys(bayLevelData[0].perSlotInfo).sort()).toStrictEqual([
      "0080",
      "0082",
      "0084",
      "0086",
    ]);

    const {
      sizeSummary,
      bls,
      masterCGs: newMCGs,
    } = tiersRemap({
      sizeSummary: summary,
      masterCGs,
      bls: bayLevelData,
      tier82is: 72,
      mapFromStafToOvs: false,
    });

    expect(sizeSummary.maxAboveTier).toBe(96);
    expect(sizeSummary.minAboveTier).toBe(90);
    expect(bls.length).toBe(4);
    expect(Object.keys(bls[0].perSlotInfo).sort()).toStrictEqual([
      "0090",
      "0092",
      "0094",
      "0096",
    ]);

    expect(newMCGs.aboveTcgs["00"]).toBe(10);
    expect(newMCGs.aboveTcgs["01"]).toBe(2610);
    expect(newMCGs.aboveTcgs["02"]).toBe(-2590);
    expect(newMCGs.belowTcgs["00"]).toBe(10);
    expect(newMCGs.belowTcgs["01"]).toBe(2610);
    expect(newMCGs.belowTcgs["02"]).toBe(-2590);
    expect(newMCGs.bottomBases["90"]).toBe(20000);
    expect(newMCGs.bottomBases["02"]).toBe(1000);
  });
});
