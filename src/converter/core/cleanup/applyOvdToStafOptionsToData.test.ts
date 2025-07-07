import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ValuesSourceEnum from "../../../models/base/enums/ValuesSourceEnum";
import { applyOvdToStafOptionsToData } from "./applyOvdToStafOptionsToData";
import { mockedJson } from "../../ovdV1ToStafConverter.test";

describe("applyOvdToStafOptionsToData should", () => {
  it("Don't remove CGs", () => {
    const json = applyOvdToStafOptionsToData(
      JSON.parse(JSON.stringify(mockedJson)),
      {
        removeCGs: false,
        removeBaysWithNonSizeSlots: false,
        removeBelowTiers24AndHigher: false,
      }
    );

    // 1. Check CG Options
    expect(json.shipData.lcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(json.shipData.vcgOptions.values).toBe(ValuesSourceEnum.ESTIMATED);
    expect(json.shipData.tcgOptions.values).toBe(ValuesSourceEnum.ESTIMATED);

    // 2. Check CGs in Bay Level Data
    expect(json.baysData[0].infoByContLength[20].lcg).toBeGreaterThan(0);
    expect(json.baysData[0].perRowInfo.each["02"].tcg).toBeDefined();
    expect(json.baysData[0].perRowInfo.each["00"].bottomBase).toBeDefined();
    expect(json.baysData[0].perRowInfo.each["00"].maxHeight).toBeDefined();
    expect(json.baysData[0].perRowInfo.common.maxHeight).toBeDefined();
    expect(json.baysData[0].perRowInfo.common.bottomBase).toBeDefined();

    // 2. Master CGs
    expect(
      Object.keys(json.shipData.masterCGs.aboveTcgs).length
    ).toBeGreaterThan(0);
    expect(
      Object.keys(json.shipData.masterCGs.belowTcgs).length
    ).toBeGreaterThan(0);
  });

  it("Remove CGs", () => {
    const json = applyOvdToStafOptionsToData(
      JSON.parse(JSON.stringify(mockedJson)),
      {
        removeCGs: true,
        removeBaysWithNonSizeSlots: false,
        removeBelowTiers24AndHigher: false,
      }
    );

    // 1. Check CG Options
    expect(json.shipData.lcgOptions.values).toBe(ValuesSourceEnum.ESTIMATED);
    expect(json.shipData.vcgOptions.values).toBe(ValuesSourceEnum.ESTIMATED);
    expect(json.shipData.tcgOptions.values).toBe(ValuesSourceEnum.ESTIMATED);

    // 2. Check CGs in Bay Level Data
    expect(json.baysData[0].infoByContLength[20].lcg).toBeUndefined();
    expect(json.baysData[0].perRowInfo.each["02"].tcg).toBeUndefined();
    expect(json.baysData[0].perRowInfo.each["00"].bottomBase).toBeUndefined();
    expect(json.baysData[0].perRowInfo.each["00"].maxHeight).toBeUndefined();
    expect(json.baysData[0].perRowInfo.common.maxHeight).toBeUndefined();
    expect(json.baysData[0].perRowInfo.common.bottomBase).toBeUndefined();

    // 2. Master CGs
    expect(Object.keys(json.shipData.masterCGs.aboveTcgs).length).toBe(0);
    expect(Object.keys(json.shipData.masterCGs.belowTcgs).length).toBe(0);
  });

  it("Don't remove Bay if there are sizes", () => {
    const json = JSON.parse(JSON.stringify(mockedJson));
    json.baysData[0].perSlotInfo["0282"].sizes = {};
    json.baysData[0].perSlotInfo["0284"].sizes = {};
    json.baysData[0].perSlotInfo["0080"].sizes = {};
    json.baysData[0].perSlotInfo["0082"].sizes = {};
    json.baysData[0].perSlotInfo["0084"].sizes = {};
    json.baysData[0].perSlotInfo["0182"].sizes = {};
    json.baysData[0].perSlotInfo["0184"].sizes = {};
    json.baysData[0].perSlotInfo["0184"].restricted = 1;

    const jsonApplied = applyOvdToStafOptionsToData(json, {
      removeCGs: false,
      removeBaysWithNonSizeSlots: false,
      removeBelowTiers24AndHigher: false,
    });

    expect(jsonApplied.baysData.length).toBe(4);
  });

  it("Remove Bay if there are no sizes", () => {
    const json = JSON.parse(JSON.stringify(mockedJson));
    json.baysData[0].perSlotInfo["0282"].sizes = {};
    json.baysData[0].perSlotInfo["0284"].sizes = {};
    json.baysData[0].perSlotInfo["0080"].sizes = {};
    json.baysData[0].perSlotInfo["0082"].sizes = {};
    json.baysData[0].perSlotInfo["0084"].sizes = {};
    json.baysData[0].perSlotInfo["0182"].sizes = {};
    json.baysData[0].perSlotInfo["0184"].sizes = {};
    json.baysData[0].perSlotInfo["0184"].reefer = undefined;
    json.baysData[0].perSlotInfo["0184"].restricted = 1;

    expect(json.baysData.length).toBe(4);

    const jsonApplied = applyOvdToStafOptionsToData(json, {
      removeCGs: false,
      removeBaysWithNonSizeSlots: true,
      removeBelowTiers24AndHigher: false,
    });

    expect(jsonApplied.baysData.length).toBe(3);
  });

  it("Remove Slots above 22", () => {
    const json = JSON.parse(JSON.stringify(mockedJson));
    json.baysData[1].perSlotInfo["0224"] = { sizes: { 20: 1 } };
    json.sizeSummary.maxBelowTier = 24;

    expect(json.baysData.length).toBe(4);

    const slotsKeys = Object.keys(json.baysData[1].perSlotInfo);
    expect(slotsKeys.length).toBe(5);
    expect(slotsKeys.includes("0224")).toBe(true);

    const jsonApplied = applyOvdToStafOptionsToData(json, {
      removeCGs: false,
      removeBaysWithNonSizeSlots: false,
      removeBelowTiers24AndHigher: true,
    });

    const slotsKeys2 = Object.keys(jsonApplied.baysData[1].perSlotInfo);

    expect(slotsKeys2.length).toBe(4);
    expect(slotsKeys2.includes("0224")).toBe(false);

    expect(jsonApplied.baysData.length).toBe(4);
  });
});
