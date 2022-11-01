import {
  ILCGOptionsIntermediate,
  ITGCOptionsIntermediate,
  IVGCOptionsIntermediate,
} from "../../models/v1/parts/IShipData";
import ValuesSourceEnum, {
  ValuesSourceRowTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";
import { shipData, shipDataBays } from "../mocks/shipData";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import { IJoinedRowTierPattern } from "../../models/base/types/IPositionPatterns";
import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../models/base/enums/PortStarboardEnum";
import { cgsRemap } from "./cgsRemap";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import createSummary from "./createSummary";

function createMockedBl() {
  const mockSlotInfoKeysAbove: IJoinedRowTierPattern[] = [
    "0080",
    "0082",
    "0084",
    "0086",
  ];
  const mockSlotInfoKeysBelow: IJoinedRowTierPattern[] = ["0002", "0004"];

  const bayLevelData = createMockedSimpleBayLevelData(
    3,
    mockSlotInfoKeysAbove,
    mockSlotInfoKeysBelow
  ).map((bl) => {
    const { perTierInfo, ...rest } = bl;
    return rest;
  });

  bayLevelData[0].infoByContLength[20].lcg = 100000;
  bayLevelData[0].infoByContLength[24].lcg = 99000;
  bayLevelData[1].infoByContLength[20].lcg = 100000;
  bayLevelData[1].infoByContLength[24].lcg = 99000;
  bayLevelData[2].infoByContLength[20].lcg = 80000;
  bayLevelData[2].infoByContLength[40].lcg = 72000;
  bayLevelData[3].infoByContLength[20].lcg = 80000;
  bayLevelData[3].infoByContLength[40].lcg = 72000;

  bayLevelData.forEach((bl) => {
    bl.perRowInfo.each["00"].tcg = 10;
    bl.perRowInfo.each["01"].tcg = 2610;
    bl.perRowInfo.each["02"].tcg = -2590;
    bl.perRowInfo.each["00"].bottomBase =
      bl.level === BayLevelEnum.ABOVE ? 20000 : 1000;
    bl.perRowInfo.each["01"].bottomBase =
      bl.level === BayLevelEnum.ABOVE ? 20000 : 1000;
    bl.perRowInfo.each["02"].bottomBase =
      bl.level === BayLevelEnum.ABOVE ? 20000 : 1000;
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
    baseLcgOptions: {
      values: ValuesSourceEnum.KNOWN,
      reference: LcgReferenceEnum.AFT_PERPENDICULAR,
      orientationIncrease: ForeAftEnum.FWD,
      lpp: 100000,
    } as ILCGOptionsIntermediate,
    baseVcgOptions: {
      values: ValuesSourceRowTierEnum.BY_STACK,
      heightFactor: 0,
    } as IVGCOptionsIntermediate,
    baseTcgOptions: {
      values: ValuesSourceEnum.KNOWN,
      direction: PortStarboardEnum.STARBOARD,
    } as ITGCOptionsIntermediate,
  };
}

describe("cgsRemap should ...", () => {
  it("Remap nothing", () => {
    const { bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions } =
      createMockedBl();

    cgsRemap(bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions);

    expect(bayLevelData[0].infoByContLength[20].lcg).toBe(100000);
    expect(bayLevelData[0].infoByContLength[24].lcg).toBe(99000);
    expect(bayLevelData[1].infoByContLength[20].lcg).toBe(100000);
    expect(bayLevelData[1].infoByContLength[24].lcg).toBe(99000);
    expect(bayLevelData[2].infoByContLength[20].lcg).toBe(80000);
    expect(bayLevelData[2].infoByContLength[40].lcg).toBe(72000);
    expect(bayLevelData[3].infoByContLength[20].lcg).toBe(80000);
    expect(bayLevelData[3].infoByContLength[40].lcg).toBe(72000);

    expect(bayLevelData[0].perRowInfo.each["00"].tcg).toBe(10);
    expect(bayLevelData[0].perRowInfo.each["01"].tcg).toBe(2610);
    expect(bayLevelData[0].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(bayLevelData[1].perRowInfo.each["00"].tcg).toBe(10);
    expect(bayLevelData[1].perRowInfo.each["01"].tcg).toBe(2610);
    expect(bayLevelData[1].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(bayLevelData[2].perRowInfo.each["00"].tcg).toBe(10);
    expect(bayLevelData[2].perRowInfo.each["01"].tcg).toBe(2610);
    expect(bayLevelData[2].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(bayLevelData[3].perRowInfo.each["00"].tcg).toBe(10);
    expect(bayLevelData[3].perRowInfo.each["01"].tcg).toBe(2610);
    expect(bayLevelData[3].perRowInfo.each["02"].tcg).toBe(-2590);

    expect(bayLevelData[0].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(bayLevelData[0].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(bayLevelData[0].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(bayLevelData[1].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(bayLevelData[1].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(bayLevelData[1].perRowInfo.each["02"].bottomBase).toBe(1000);
    expect(bayLevelData[2].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(bayLevelData[2].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(bayLevelData[2].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(bayLevelData[3].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(bayLevelData[3].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(bayLevelData[3].perRowInfo.each["02"].bottomBase).toBe(1000);
  });

  it("Remap LCG, from FWD-perp to AFT-perp", () => {
    const { bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions } =
      createMockedBl();

    bayLevelData[0].infoByContLength[20].lcg = 0;
    bayLevelData[0].infoByContLength[24].lcg = 1000;
    bayLevelData[1].infoByContLength[20].lcg = 0;
    bayLevelData[1].infoByContLength[24].lcg = 1000;
    bayLevelData[2].infoByContLength[20].lcg = 20000;
    bayLevelData[2].infoByContLength[40].lcg = 28000;
    bayLevelData[3].infoByContLength[20].lcg = 20000;
    bayLevelData[3].infoByContLength[40].lcg = 28000;

    const newBayLevelData = cgsRemap(
      bayLevelData,
      {
        ...baseLcgOptions,
        lpp: 100000,
        reference: LcgReferenceEnum.FWD_PERPENDICULAR,
        orientationIncrease: ForeAftEnum.AFT,
      },
      baseVcgOptions,
      baseTcgOptions
    );

    expect(newBayLevelData[0].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[0].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[1].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[1].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[2].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[2].infoByContLength[40].lcg).toBe(72000);
    expect(newBayLevelData[3].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[3].infoByContLength[40].lcg).toBe(72000);

    expect(newBayLevelData[0].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[0].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[0].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[1].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[1].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[1].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[2].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[2].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[2].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[3].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[3].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[3].perRowInfo.each["02"].tcg).toBe(-2590);

    expect(newBayLevelData[0].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[1].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["02"].bottomBase).toBe(1000);
    expect(newBayLevelData[2].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[3].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["02"].bottomBase).toBe(1000);
  });

  it("Remap LCG, from MIDSHIPS-FWD to AFT-perp", () => {
    const { bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions } =
      createMockedBl();

    bayLevelData[0].infoByContLength[20].lcg = 50000;
    bayLevelData[0].infoByContLength[24].lcg = 49000;
    bayLevelData[1].infoByContLength[20].lcg = 50000;
    bayLevelData[1].infoByContLength[24].lcg = 49000;
    bayLevelData[2].infoByContLength[20].lcg = 30000;
    bayLevelData[2].infoByContLength[40].lcg = 22000;
    bayLevelData[3].infoByContLength[20].lcg = 30000;
    bayLevelData[3].infoByContLength[40].lcg = 22000;

    const newBayLevelData = cgsRemap(
      bayLevelData,
      {
        ...baseLcgOptions,
        lpp: 100000,
        reference: LcgReferenceEnum.MIDSHIPS,
        orientationIncrease: ForeAftEnum.FWD,
      },
      baseVcgOptions,
      baseTcgOptions
    );

    expect(newBayLevelData[0].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[0].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[1].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[1].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[2].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[2].infoByContLength[40].lcg).toBe(72000);
    expect(newBayLevelData[3].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[3].infoByContLength[40].lcg).toBe(72000);

    expect(newBayLevelData[0].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[0].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[0].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[1].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[1].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[1].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[2].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[2].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[2].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[3].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[3].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[3].perRowInfo.each["02"].tcg).toBe(-2590);

    expect(newBayLevelData[0].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[1].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["02"].bottomBase).toBe(1000);
    expect(newBayLevelData[2].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[3].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["02"].bottomBase).toBe(1000);
  });

  it("Remap LCG, from MIDSHIPS-AFT to AFT-perp", () => {
    const { bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions } =
      createMockedBl();

    bayLevelData[0].infoByContLength[20].lcg = -50000;
    bayLevelData[0].infoByContLength[24].lcg = -49000;
    bayLevelData[1].infoByContLength[20].lcg = -50000;
    bayLevelData[1].infoByContLength[24].lcg = -49000;
    bayLevelData[2].infoByContLength[20].lcg = -30000;
    bayLevelData[2].infoByContLength[40].lcg = -22000;
    bayLevelData[3].infoByContLength[20].lcg = -30000;
    bayLevelData[3].infoByContLength[40].lcg = -22000;

    const newBayLevelData = cgsRemap(
      bayLevelData,
      {
        ...baseLcgOptions,
        lpp: 100000,
        reference: LcgReferenceEnum.MIDSHIPS,
        orientationIncrease: ForeAftEnum.AFT,
      },
      baseVcgOptions,
      baseTcgOptions
    );

    expect(newBayLevelData[0].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[0].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[1].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[1].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[2].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[2].infoByContLength[40].lcg).toBe(72000);
    expect(newBayLevelData[3].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[3].infoByContLength[40].lcg).toBe(72000);

    expect(newBayLevelData[0].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[0].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[0].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[1].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[1].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[1].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[2].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[2].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[2].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[3].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[3].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[3].perRowInfo.each["02"].tcg).toBe(-2590);

    expect(newBayLevelData[0].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[1].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["02"].bottomBase).toBe(1000);
    expect(newBayLevelData[2].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[3].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["02"].bottomBase).toBe(1000);
  });

  it("Remap TCG, from PORT To STBD", () => {
    const { bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions } =
      createMockedBl();

    bayLevelData.forEach((bl) => {
      bl.perRowInfo.each["00"].tcg = -10;
      bl.perRowInfo.each["01"].tcg = -2610;
      bl.perRowInfo.each["02"].tcg = 2590;
    });

    const newBayLevelData = cgsRemap(
      bayLevelData,
      baseLcgOptions,
      baseVcgOptions,
      {
        ...baseTcgOptions,
        values: ValuesSourceEnum.KNOWN,
        direction: PortStarboardEnum.PORT,
      }
    );

    expect(newBayLevelData[0].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[0].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[1].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[1].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[2].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[2].infoByContLength[40].lcg).toBe(72000);
    expect(newBayLevelData[3].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[3].infoByContLength[40].lcg).toBe(72000);

    expect(newBayLevelData[0].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[0].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[0].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[1].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[1].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[1].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[2].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[2].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[2].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[3].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[3].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[3].perRowInfo.each["02"].tcg).toBe(-2590);

    expect(newBayLevelData[0].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[1].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["02"].bottomBase).toBe(1000);
    expect(newBayLevelData[2].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[3].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["02"].bottomBase).toBe(1000);
  });

  it("Remap VCG, from VCG45 To BottomBase", () => {
    const { bayLevelData, baseLcgOptions, baseVcgOptions, baseTcgOptions } =
      createMockedBl();

    const ADDED_VCG = Math.round((8.5 / 0.003280839895) * 0.45);

    bayLevelData.forEach((bl) => {
      bl.perRowInfo.each["00"].bottomBase =
        (bl.level === BayLevelEnum.ABOVE ? 20000 : 1000) + ADDED_VCG;
      bl.perRowInfo.each["01"].bottomBase =
        (bl.level === BayLevelEnum.ABOVE ? 20000 : 1000) + ADDED_VCG;
      bl.perRowInfo.each["02"].bottomBase =
        (bl.level === BayLevelEnum.ABOVE ? 20000 : 1000) + ADDED_VCG;
    });

    const newBayLevelData = cgsRemap(
      bayLevelData,
      baseLcgOptions,
      {
        ...baseVcgOptions,
        heightFactor: 0.45,
      },
      baseTcgOptions
    );

    expect(newBayLevelData[0].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[0].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[1].infoByContLength[20].lcg).toBe(100000);
    expect(newBayLevelData[1].infoByContLength[24].lcg).toBe(99000);
    expect(newBayLevelData[2].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[2].infoByContLength[40].lcg).toBe(72000);
    expect(newBayLevelData[3].infoByContLength[20].lcg).toBe(80000);
    expect(newBayLevelData[3].infoByContLength[40].lcg).toBe(72000);

    expect(newBayLevelData[0].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[0].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[0].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[1].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[1].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[1].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[2].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[2].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[2].perRowInfo.each["02"].tcg).toBe(-2590);
    expect(newBayLevelData[3].perRowInfo.each["00"].tcg).toBe(10);
    expect(newBayLevelData[3].perRowInfo.each["01"].tcg).toBe(2610);
    expect(newBayLevelData[3].perRowInfo.each["02"].tcg).toBe(-2590);

    expect(newBayLevelData[0].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[0].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[1].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[1].perRowInfo.each["02"].bottomBase).toBe(1000);
    expect(newBayLevelData[2].perRowInfo.each["00"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["01"].bottomBase).toBe(20000);
    expect(newBayLevelData[2].perRowInfo.each["02"].bottomBase).toBe(20000);
    expect(newBayLevelData[3].perRowInfo.each["00"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["01"].bottomBase).toBe(1000);
    expect(newBayLevelData[3].perRowInfo.each["02"].bottomBase).toBe(1000);
  });
});
