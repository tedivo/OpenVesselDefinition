import ValuesSourceEnum from "../../../models/base/enums/ValuesSourceEnum";
import { applyOvdToStafOptionsToData } from "./applyOvdToStafOptionsToData";
import { mockedJson } from "../../ovdV1ToStafConverter.test";

describe("applyOvdToStafOptionsToData should", () => {
  it("Don't remove CGs", () => {
    const json = applyOvdToStafOptionsToData(
      JSON.parse(JSON.stringify(mockedJson)),
      { removeCGs: false, removeBaysWithNonSizeSlots: false }
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
      { removeCGs: true, removeBaysWithNonSizeSlots: false }
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
    });

    expect(jsonApplied.baysData.length).toBe(3);
  });
});
