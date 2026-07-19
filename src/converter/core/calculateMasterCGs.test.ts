import { IInventory, calculateMasterCGs, chooseMostRepeatedValue } from "./calculateMasterCGs";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { IShipDataIntermediateStaf } from "../../models/v1/parts/IShipData";
import ValuesSourceEnum from "../../models/base/enums/ValuesSourceEnum";
import { ValuesSourceRowTierEnum } from "../../models/base/enums/ValuesSourceRowTierEnum";

describe("calculateMasterCGs should...", () => {
  it("keep a row's own bottomBase of 0 instead of falling back to the bay's common value", () => {
    const shipData = {
      tcgOptions: { values: ValuesSourceEnum.KNOWN },
      vcgOptions: { values: ValuesSourceRowTierEnum.BY_STACK },
    } as IShipDataIntermediateStaf;

    const bls = [
      {
        level: BayLevelEnum.BELOW,
        perRowInfo: {
          common: { bottomBase: 500, bottomIsoTier: "02" },
          each: {
            "00": { isoRow: "00", bottomBase: 0, bottomIsoTier: "02" },
          },
        },
      },
    ] as unknown as IBayLevelDataStaf[];

    const result = calculateMasterCGs(shipData, bls);

    expect(result.bottomBases["02"]).toBe(0);
  });

  it("process VCGs when tcgOptions is ESTIMATED but vcgOptions isn't", () => {
    const shipData = {
      tcgOptions: { values: ValuesSourceEnum.ESTIMATED },
      vcgOptions: { values: ValuesSourceRowTierEnum.BY_STACK },
    } as IShipDataIntermediateStaf;

    const bls = [
      {
        level: BayLevelEnum.BELOW,
        perRowInfo: {
          common: { bottomBase: 500, bottomIsoTier: "02" },
          each: {
            "00": { isoRow: "00", tcg: 100, bottomBase: 300, bottomIsoTier: "02" },
          },
        },
      },
    ] as unknown as IBayLevelDataStaf[];

    const result = calculateMasterCGs(shipData, bls);

    expect(result.bottomBases["02"]).toBe(300);
    expect(result.belowTcgs["00"]).toBeUndefined();
  });

  it("process TCGs when vcgOptions is ESTIMATED but tcgOptions isn't", () => {
    const shipData = {
      tcgOptions: { values: ValuesSourceEnum.KNOWN },
      vcgOptions: { values: ValuesSourceRowTierEnum.ESTIMATED },
    } as IShipDataIntermediateStaf;

    const bls = [
      {
        level: BayLevelEnum.BELOW,
        perRowInfo: {
          common: { bottomBase: 500, bottomIsoTier: "02" },
          each: {
            "00": { isoRow: "00", tcg: 100, bottomBase: 300, bottomIsoTier: "02" },
          },
        },
      },
    ] as unknown as IBayLevelDataStaf[];

    const result = calculateMasterCGs(shipData, bls);

    expect(result.belowTcgs["00"]).toBe(100);
    expect(result.bottomBases["02"]).toBeUndefined();
  });
});

describe("chooseMostRepeatedValue should...", () => {
  it("work ok with no values", () => {
    const mock: IInventory = {
      "01": new Map<number, number>([]),
    };

    const result = chooseMostRepeatedValue(mock);

    expect(result).toStrictEqual({
      "01": undefined,
    });
  });

  it("work ok with single values", () => {
    const mock: IInventory = {
      "01": new Map<number, number>([[10, 1]]),
    };

    const result = chooseMostRepeatedValue(mock);

    expect(result).toStrictEqual({
      "01": 10,
    });
  });

  it("work ok with many values", () => {
    const mock: IInventory = {
      "01": new Map<number, number>([
        [10, 1],
        [20, 10],
        [30, 2],
      ]),
    };

    const result = chooseMostRepeatedValue(mock);

    expect(result).toStrictEqual({
      "01": 20,
    });
  });
});
