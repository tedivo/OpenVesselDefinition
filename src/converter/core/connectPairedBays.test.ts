import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import { IIsoBayPattern } from "../../models/base/types/IPositionPatterns";
import { connectPairedBays } from "./connectPairedBays";

function makeBay(
  isoBay: IIsoBayPattern,
  level: BayLevelEnum,
  pairedBay?: ForeAftEnum
): IBayLevelData {
  return {
    isoBay,
    level,
    infoByContLength: {},
    pairedBay,
  };
}

describe("connectPairedBays should", () => {
  it("return the same data when no pairing info exists", () => {
    const data = [
      makeBay("001", BayLevelEnum.ABOVE),
      makeBay("001", BayLevelEnum.BELOW),
      makeBay("003", BayLevelEnum.ABOVE),
      makeBay("003", BayLevelEnum.BELOW),
    ];

    const result = connectPairedBays(data);

    expect(result).toBe(data); // same reference
    result.forEach((bl) => expect(bl.pairedBay).toBeUndefined());
  });

  it("does not modify bays that are already fully paired (AFT + FWD)", () => {
    const data = [
      makeBay("001", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("001", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("003", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("003", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    const [ab001, be001, ab003, be003] = data;
    expect(ab001.pairedBay).toBe(ForeAftEnum.AFT);
    expect(be001.pairedBay).toBe(ForeAftEnum.AFT);
    expect(ab003.pairedBay).toBe(ForeAftEnum.FWD);
    expect(be003.pairedBay).toBe(ForeAftEnum.FWD);
  });

  it("1st pass: sets FWD on the aft bay when the fwd bay has AFT and the aft bay is undefined", () => {
    // Bay 001 has AFT → bay 003 (next) should get FWD
    const data = [
      makeBay("001", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("001", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("003", BayLevelEnum.ABOVE),
      makeBay("003", BayLevelEnum.BELOW),
    ];

    connectPairedBays(data);

    const [ab001, be001, ab003, be003] = data;
    expect(ab001.pairedBay).toBe(ForeAftEnum.AFT);
    expect(be001.pairedBay).toBe(ForeAftEnum.AFT);
    expect(ab003.pairedBay).toBe(ForeAftEnum.FWD);
    expect(be003.pairedBay).toBe(ForeAftEnum.FWD);
  });

  it("2nd pass: sets AFT on the fwd bay when the aft bay has FWD and the fwd bay is undefined", () => {
    // Bay 003 has FWD → bay 001 (prev) should get AFT
    const data = [
      makeBay("001", BayLevelEnum.ABOVE),
      makeBay("001", BayLevelEnum.BELOW),
      makeBay("003", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("003", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    const [ab001, be001, ab003, be003] = data;
    expect(ab001.pairedBay).toBe(ForeAftEnum.AFT);
    expect(be001.pairedBay).toBe(ForeAftEnum.AFT);
    expect(ab003.pairedBay).toBe(ForeAftEnum.FWD);
    expect(be003.pairedBay).toBe(ForeAftEnum.FWD);
  });

  it("3rd pass: propagates pairedBay from ABOVE to BELOW when BELOW is undefined", () => {
    const data = [
      makeBay("001", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("001", BayLevelEnum.BELOW), // missing pairedBay
      makeBay("003", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("003", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    expect(data[1].pairedBay).toBe(ForeAftEnum.AFT); // BELOW bay 001 gets AFT from ABOVE
  });

  it("3rd pass: propagates pairedBay from BELOW to ABOVE when ABOVE is undefined", () => {
    const data = [
      makeBay("001", BayLevelEnum.ABOVE), // missing pairedBay
      makeBay("001", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("003", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("003", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    expect(data[0].pairedBay).toBe(ForeAftEnum.AFT); // ABOVE bay 001 gets AFT from BELOW
  });

  it("4th pass: pairs two bays between already-paired bays", () => {
    // The 4th pass fires when pairedBayKeys matches: FWD, undef, undef, AFT
    // pairedBay=FWD means "paired bay is forward" (this bay is AFT in its pair)
    // pairedBay=AFT means "paired bay is aft"    (this bay is FWD in its pair)
    //
    // Sequence: 001-AFT / 003-FWD (pair) | 005-undef | 007-undef | 009-AFT / 011-FWD (pair)
    // pairedBayKeys:  001=AFT, 003=FWD, 005=undef, 007=undef, 009=AFT, 011=FWD
    // Loop at i=2: kPrev=003(FWD), kCurr=005(undef), kNext=007(undef), kNNNx=009(AFT) → MATCH
    // Result: 005 gets AFT, 007 gets FWD
    const data = [
      makeBay("001", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("001", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("003", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("003", BayLevelEnum.BELOW, ForeAftEnum.FWD),
      makeBay("005", BayLevelEnum.ABOVE),
      makeBay("005", BayLevelEnum.BELOW),
      makeBay("007", BayLevelEnum.ABOVE),
      makeBay("007", BayLevelEnum.BELOW),
      makeBay("009", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("009", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("011", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("011", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    const [, , , , ab005, be005, ab007, be007] = data;
    expect(ab005.pairedBay).toBe(ForeAftEnum.AFT);
    expect(be005.pairedBay).toBe(ForeAftEnum.AFT);
    expect(ab007.pairedBay).toBe(ForeAftEnum.FWD);
    expect(be007.pairedBay).toBe(ForeAftEnum.FWD);
  });

  it("4th pass: does NOT pair bays when pattern does not match FWD-undef-undef-AFT", () => {
    // Only one undefined bay between FWD and AFT — should NOT trigger 4th pass
    const data = [
      makeBay("001", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("001", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("003", BayLevelEnum.ABOVE),
      makeBay("003", BayLevelEnum.BELOW),
      makeBay("005", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("005", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    // Bay 003 should not be modified by the 4th pass alone
    // (it may be set by 1st pass from bay 001 AFT → 003 FWD)
    // Verify 001 and 005 are unchanged
    expect(data[0].pairedBay).toBe(ForeAftEnum.AFT);
    expect(data[4].pairedBay).toBe(ForeAftEnum.FWD);
  });

  it("handles a ship with many bays and mixed pairing", () => {
    const data = [
      makeBay("001", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("001", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("003", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("003", BayLevelEnum.BELOW, ForeAftEnum.FWD),
      makeBay("005", BayLevelEnum.ABOVE), // unpaired 20-bay
      makeBay("005", BayLevelEnum.BELOW),
      makeBay("007", BayLevelEnum.ABOVE, ForeAftEnum.AFT),
      makeBay("007", BayLevelEnum.BELOW, ForeAftEnum.AFT),
      makeBay("009", BayLevelEnum.ABOVE, ForeAftEnum.FWD),
      makeBay("009", BayLevelEnum.BELOW, ForeAftEnum.FWD),
    ];

    connectPairedBays(data);

    // 001-003 pair remains intact
    expect(data[0].pairedBay).toBe(ForeAftEnum.AFT);
    expect(data[2].pairedBay).toBe(ForeAftEnum.FWD);
    // 005 remains unpaired
    expect(data[4].pairedBay).toBeUndefined();
    expect(data[5].pairedBay).toBeUndefined();
    // 007-009 pair remains intact
    expect(data[6].pairedBay).toBe(ForeAftEnum.AFT);
    expect(data[8].pairedBay).toBe(ForeAftEnum.FWD);
  });

  it("returns the original array reference", () => {
    const data = [
      makeBay("001", BayLevelEnum.ABOVE),
      makeBay("001", BayLevelEnum.BELOW),
    ];

    const result = connectPairedBays(data);
    expect(result).toBe(data);
  });

  it("handles an empty array", () => {
    expect(connectPairedBays([])).toEqual([]);
  });
});
