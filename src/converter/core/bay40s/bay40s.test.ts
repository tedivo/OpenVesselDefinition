import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import detectBay40sLocation from "./detectBay40sLocation";
import { getPairedBays } from "./getPairedBays";
import moveBay40sToLocation from "./moveBay40sToLocation";

/** 001 <-> 003 paired ABOVE, with all the 40s living in the AFT bay (003) */
function makeBays(): IBayLevelData[] {
  return [
    {
      isoBay: "001",
      level: BayLevelEnum.ABOVE,
      pairedBay: ForeAftEnum.AFT,
      infoByContLength: { 20: { size: 20, lcg: 1000 } },
      perRowInfo: {
        common: { bottomBase: 5500 },
        each: {
          "00": { isoRow: "00", tcg: 0, bottomBase: 5500 },
          "02": { isoRow: "02", tcg: -2438, bottomBase: 5500 },
        },
      },
      perSlotInfo: {
        "0082": { pos: "0082", sizes: { 20: 1 } },
        "0282": { pos: "0282", sizes: { 20: 1 } },
      },
    },
    {
      isoBay: "003",
      level: BayLevelEnum.ABOVE,
      pairedBay: ForeAftEnum.FWD,
      infoByContLength: {
        20: { size: 20, lcg: 3000 },
        40: { size: 40, lcg: 2000, rowWeight: 90000, minBottomHeight: 5791 },
      },
      perRowInfo: {
        each: {
          "00": {
            isoRow: "00",
            tcg: 0,
            bottomBase: 5600,
            rowInfoByLength: {
              40: { size: 40, lcg: 2000, minBottomHeight: 5791 },
            },
          },
        },
      },
      perSlotInfo: {
        "0082": { pos: "0082", sizes: { 20: 1, 40: 1 }, reefer: 1 },
        "0282": { pos: "0282", sizes: { 40: 1 }, reefer: 1 },
      },
    },
  ];
}

describe("getPairedBays", () => {
  it("pairs the FWD bay declaring AFT with the AFT bay declaring FWD", () => {
    const { pairs, unpaired } = getPairedBays(makeBays());

    expect(pairs).toEqual([
      { level: BayLevelEnum.ABOVE, fwd: "001", aft: "003" },
    ]);
    expect(unpaired).toHaveLength(0);
  });

  it("does not pair across a missing bay number", () => {
    // 003 extends aft, but 005 does not exist. 007 must not stand in for it.
    const bays: IBayLevelData[] = [
      {
        isoBay: "003",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.AFT,
        infoByContLength: {},
      },
      {
        isoBay: "007",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.FWD,
        infoByContLength: {},
      },
    ];

    const { pairs, unpaired } = getPairedBays(bays);

    expect(pairs).toHaveLength(0);
    expect(unpaired).toEqual([
      { isoBay: "003", level: BayLevelEnum.ABOVE },
      { isoBay: "007", level: BayLevelEnum.ABOVE },
    ]);
  });

  it("starts pairing at 003 when the vessel opens with a lone 20' bay", () => {
    const bays: IBayLevelData[] = [
      {
        isoBay: "001",
        level: BayLevelEnum.ABOVE,
        infoByContLength: {},
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1 } } },
      },
      {
        isoBay: "003",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.AFT,
        infoByContLength: {},
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1, 40: 1 } } },
      },
      {
        isoBay: "005",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.FWD,
        infoByContLength: {},
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1 } } },
      },
    ];

    const { pairs, unpaired } = getPairedBays(bays);

    expect(pairs).toEqual([
      { level: BayLevelEnum.ABOVE, fwd: "003", aft: "005" },
    ]);
    expect(unpaired).toEqual([{ isoBay: "001", level: BayLevelEnum.ABOVE }]);

    // and the lone 20' bay must not drag the convention around
    const detected = detectBay40sLocation(bays);
    expect(detected.bay40sLocation).toBe(ForeAftEnum.FWD);
    expect(detected.consistent).toBe(true);
    expect(detected.unpairedWith40s).toHaveLength(0);
  });

  it("reports a bay whose neighbour does not reciprocate as unpaired", () => {
    const bays = makeBays();
    bays[1].pairedBay = undefined;

    const { pairs, unpaired } = getPairedBays(bays);

    expect(pairs).toHaveLength(0);
    expect(unpaired).toHaveLength(2);
  });
});

describe("detectBay40sLocation", () => {
  it("finds the convention of a consistent vessel", () => {
    const res = detectBay40sLocation(makeBays());

    expect(res.bay40sLocation).toBe(ForeAftEnum.AFT);
    expect(res.consistent).toBe(true);
    expect(res.dissenting).toHaveLength(0);
    expect(res.pairs[0].aftCount).toBeGreaterThan(res.pairs[0].fwdCount);
    expect(res.pairs[0].split).toBe(false);
  });

  it("flags a pair holding 40s on both sides as split and dissenting", () => {
    const bays = makeBays();
    bays[0].perSlotInfo!["0082"].sizes[40] = 1;

    const res = detectBay40sLocation(bays);

    expect(res.pairs[0].split).toBe(true);
    expect(res.consistent).toBe(false);
    expect(res.dissenting).toHaveLength(1);
  });

  it("returns the majority convention and lists the pairs that disagree", () => {
    const bays = makeBays();
    // A second pair, 005 <-> 007, with the 40s in the FWD bay instead
    bays.push(
      {
        isoBay: "005",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.AFT,
        infoByContLength: { 40: { size: 40, lcg: 6000 } },
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1, 40: 1 } } },
      },
      {
        isoBay: "007",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.FWD,
        infoByContLength: { 20: { size: 20 } },
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1 } } },
      },
      // A third pair, 009 <-> 011, agreeing with the first one
      {
        isoBay: "009",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.AFT,
        infoByContLength: { 20: { size: 20 } },
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1 } } },
      },
      {
        isoBay: "011",
        level: BayLevelEnum.ABOVE,
        pairedBay: ForeAftEnum.FWD,
        infoByContLength: { 40: { size: 40 } },
        perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1, 40: 1 } } },
      },
    );

    const res = detectBay40sLocation(bays);

    expect(res.votes).toEqual({
      [ForeAftEnum.FWD]: 1,
      [ForeAftEnum.AFT]: 2,
    });
    expect(res.bay40sLocation).toBe(ForeAftEnum.AFT);
    expect(res.consistent).toBe(false);
    expect(res.dissenting.map((p) => p.fwd)).toEqual(["005"]);
  });

  it("reports bays holding 40s that belong to no pair", () => {
    const bays = makeBays();
    bays.push({
      isoBay: "005",
      level: BayLevelEnum.ABOVE,
      infoByContLength: {},
      perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1, 40: 1 } } },
    });

    const res = detectBay40sLocation(bays);

    expect(res.unpairedWith40s).toEqual([
      { isoBay: "005", level: BayLevelEnum.ABOVE },
    ]);
  });

  it("returns undefined when there is no 40s data to judge", () => {
    const bays = makeBays();
    delete bays[1].infoByContLength[40];
    delete bays[1].perRowInfo!.each!["00"].rowInfoByLength;
    delete bays[1].perSlotInfo!["0082"].sizes[40];
    delete bays[1].perSlotInfo!["0282"].sizes[40];

    const res = detectBay40sLocation(bays);

    expect(res.bay40sLocation).toBeUndefined();
    expect(res.consistent).toBe(true);
  });
});

describe("moveBay40sToLocation", () => {
  it("does not modify the input unless asked to", () => {
    const bays = makeBays();
    const before = JSON.stringify(bays);

    const res = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    expect(JSON.stringify(bays)).toBe(before);
    expect(res.baysData).not.toBe(bays);
  });

  it("moves the slot sizes to the target bay and clears the source", () => {
    const { baysData, movedPairs } = moveBay40sToLocation(makeBays(), {
      bay40sLocation: ForeAftEnum.FWD,
      setRestrictedOnEmptySlots: true,
    });

    const [fwd, aft] = baysData;

    expect(movedPairs).toEqual([
      { level: BayLevelEnum.ABOVE, fwd: "001", aft: "003", from: ForeAftEnum.AFT },
    ]);

    expect(fwd.perSlotInfo!["0082"].sizes).toEqual({ 20: 1, 40: 1 });
    expect(aft.perSlotInfo!["0082"].sizes).toEqual({ 20: 1 });

    // 0282 held only a 40 in the source, so it is now an empty slot
    expect(fwd.perSlotInfo!["0282"].sizes).toEqual({ 20: 1, 40: 1 });
    expect(aft.perSlotInfo!["0282"].sizes).toEqual({});
    expect(aft.perSlotInfo!["0282"].restricted).toBe(1);
  });

  it("carries the reefer plug only when the source slot is left empty", () => {
    const { baysData } = moveBay40sToLocation(makeBays(), {
      bay40sLocation: ForeAftEnum.FWD,
    });

    const [fwd, aft] = baysData;

    // 0082 still holds a 20, so its reefer stays where it is
    expect(aft.perSlotInfo!["0082"].reefer).toBe(1);
    expect(fwd.perSlotInfo!["0082"].reefer).toBeUndefined();

    // 0282 holds nothing now, so the reefer follows the 40
    expect(aft.perSlotInfo!["0282"].reefer).toBeUndefined();
    expect(fwd.perSlotInfo!["0282"].reefer).toBe(1);
  });

  it("moves every field of infoByContLength, including new ones", () => {
    const { baysData } = moveBay40sToLocation(makeBays(), {
      bay40sLocation: ForeAftEnum.FWD,
    });

    const [fwd, aft] = baysData;

    expect(fwd.infoByContLength[40]).toEqual({
      size: 40,
      lcg: 2000,
      rowWeight: 90000,
      minBottomHeight: 5791,
    });
    expect(fwd.infoByContLength[20]).toEqual({ size: 20, lcg: 1000 });
    expect(aft.infoByContLength[40]).toBeUndefined();
    expect(aft.infoByContLength[20]).toEqual({ size: 20, lcg: 3000 });
  });

  it("moves the row info by length without losing fields", () => {
    const { baysData } = moveBay40sToLocation(makeBays(), {
      bay40sLocation: ForeAftEnum.FWD,
    });

    const [fwd, aft] = baysData;

    expect(fwd.perRowInfo!.each!["00"].rowInfoByLength![40]).toEqual({
      size: 40,
      lcg: 2000,
      minBottomHeight: 5791,
    });
    expect(aft.perRowInfo!.each!["00"].rowInfoByLength).toBeUndefined();
  });

  it("seeds a row the target bay does not define with the source row's CGs", () => {
    const bays = makeBays();
    // Row 04 exists only in the source bay, with 40s on it
    bays[1].perRowInfo!.each!["04"] = {
      isoRow: "04",
      tcg: -4876,
      bottomBase: 5600,
      maxHeight: 12000,
      rowInfoByLength: { 40: { size: 40, lcg: 2000 } },
    };

    const { baysData } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    const row04 = baysData[0].perRowInfo!.each!["04"];

    expect(row04).toBeDefined();
    expect(row04.tcg).toBe(-4876);
    expect(row04.bottomBase).toBe(5600);
    expect(row04.maxHeight).toBe(12000);
    expect(row04.rowInfoByLength![40]).toEqual({ size: 40, lcg: 2000 });
  });

  it("leaves minTierHeights behind, in the bay it was written for", () => {
    const bays = makeBays();
    bays[1].perRowInfo!.common = { minTierHeights: { "82": 2896 } };
    bays[1].perRowInfo!.each!["00"].minTierHeights = { "82": 2896 };

    const { baysData } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    expect(baysData[0].perRowInfo!.common?.minTierHeights).toBeUndefined();
    expect(baysData[0].perRowInfo!.each!["00"].minTierHeights).toBeUndefined();
    expect(baysData[1].perRowInfo!.each!["00"].minTierHeights).toEqual({
      "82": 2896,
    });
  });

  it("keeps the target bay's own values and only fills its gaps", () => {
    const bays = makeBays();
    // The target already knows the 40's LCG, but not its weight
    bays[0].infoByContLength[40] = { size: 40, lcg: 1111 };
    bays[0].perRowInfo!.each!["00"].tcg = 7;

    const { baysData } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    expect(baysData[0].infoByContLength[40]).toEqual({
      size: 40,
      lcg: 1111,
      rowWeight: 90000,
      minBottomHeight: 5791,
    });
    expect(baysData[0].perRowInfo!.each!["00"].tcg).toBe(7);
  });

  it("copies common row info across when the target bay has none", () => {
    const bays = makeBays();
    bays[1].perRowInfo!.common = { maxHeight: 11500, bottomBase: 5600 };

    const { baysData } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    // bottomBase was already defined in the target, so it is kept
    expect(baysData[0].perRowInfo!.common).toEqual({
      bottomBase: 5500,
      maxHeight: 11500,
    });
  });

  it("leaves a vessel that already follows the convention untouched", () => {
    const bays = makeBays();
    const before = JSON.stringify(bays);

    const { baysData, movedPairs } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.AFT,
    });

    expect(movedPairs).toHaveLength(0);
    expect(JSON.stringify(baysData)).toBe(before);
  });

  it("is idempotent", () => {
    const once = moveBay40sToLocation(makeBays(), {
      bay40sLocation: ForeAftEnum.FWD,
      setRestrictedOnEmptySlots: true,
    }).baysData;

    const twice = moveBay40sToLocation(once, {
      bay40sLocation: ForeAftEnum.FWD,
      setRestrictedOnEmptySlots: true,
    });

    expect(twice.movedPairs).toHaveLength(0);
    expect(JSON.stringify(twice.baysData)).toBe(JSON.stringify(once));
  });

  it("agrees with detectBay40sLocation after the move", () => {
    const { baysData } = moveBay40sToLocation(makeBays(), {
      bay40sLocation: ForeAftEnum.FWD,
    });

    const res = detectBay40sLocation(baysData);

    expect(res.bay40sLocation).toBe(ForeAftEnum.FWD);
    expect(res.consistent).toBe(true);
  });

  it("leaves unpaired bays alone and reports them", () => {
    const bays = makeBays();
    bays.push({
      isoBay: "005",
      level: BayLevelEnum.ABOVE,
      infoByContLength: {},
      perSlotInfo: { "0082": { pos: "0082", sizes: { 20: 1, 40: 1 } } },
    });

    const { baysData, unpairedWith40s } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    expect(unpairedWith40s).toEqual([
      { isoBay: "005", level: BayLevelEnum.ABOVE },
    ]);
    expect(baysData[2].perSlotInfo!["0082"].sizes).toEqual({ 20: 1, 40: 1 });
  });

  it("mutates in place when asked", () => {
    const bays = makeBays();
    const res = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
      mutate: true,
    });

    expect(res.baysData).toBe(bays);
    expect(bays[0].perSlotInfo!["0082"].sizes[40]).toBe(1);
  });

  it("moves 45s and 48s too, but leaves 24s alone", () => {
    const bays = makeBays();
    bays[1].perSlotInfo!["0082"].sizes = { 20: 1, 24: 1, 40: 1, 45: 1, 48: 1 };

    const { baysData } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.FWD,
    });

    expect(baysData[1].perSlotInfo!["0082"].sizes).toEqual({ 20: 1, 24: 1 });
    expect(baysData[0].perSlotInfo!["0082"].sizes).toEqual({
      20: 1,
      40: 1,
      45: 1,
      48: 1,
    });
  });
});
