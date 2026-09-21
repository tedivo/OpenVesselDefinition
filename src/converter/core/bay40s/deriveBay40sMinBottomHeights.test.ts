import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import deriveBay40sMinBottomHeights from "./deriveBay40sMinBottomHeights";
import moveBay40sToLocation from "./moveBay40sToLocation";

/**
 * Below deck, row 10:
 * - 001 starts at tier 12, bottomBase 4591, and holds the 40s
 * - 003 starts at tier 10, bottomBase 2000, and only takes 20s
 * So a 40' in row 10 can only rest at 4591, i.e. 2591 above the pair's bottom.
 */
function makeUnevenBays(): IBayLevelData[] {
  return [
    {
      isoBay: "001",
      level: BayLevelEnum.BELOW,
      pairedBay: ForeAftEnum.AFT,
      infoByContLength: { 20: { size: 20 }, 40: { size: 40 } },
      perRowInfo: {
        each: { "10": { isoRow: "10", bottomBase: 4591 } },
      },
      perSlotInfo: {
        "1012": { pos: "1012", sizes: { 20: 1, 40: 1 } },
        "1014": { pos: "1014", sizes: { 20: 1, 40: 1 } },
      },
    },
    {
      isoBay: "003",
      level: BayLevelEnum.BELOW,
      pairedBay: ForeAftEnum.FWD,
      infoByContLength: { 20: { size: 20 } },
      perRowInfo: {
        each: { "10": { isoRow: "10", bottomBase: 2000 } },
      },
      perSlotInfo: {
        "1010": { pos: "1010", sizes: { 20: 1 } },
        "1012": { pos: "1012", sizes: { 20: 1 } },
        "1014": { pos: "1014", sizes: { 20: 1 } },
      },
    },
  ];
}

describe("deriveBay40sMinBottomHeights", () => {
  it("derives the gap between the two bays' bottom bases", () => {
    const { derived, toApply, conflicts } = deriveBay40sMinBottomHeights(
      makeUnevenBays(),
    );

    expect(derived).toHaveLength(1);
    expect(derived[0]).toMatchObject({
      level: BayLevelEnum.BELOW,
      fwd: "001",
      aft: "003",
      isoBay: "001",
      isoRow: "10",
      size: 40,
      fwdBottomBase: 4591,
      aftBottomBase: 2000,
      minBottomHeight: 2591,
      conflict: false,
    });
    expect(toApply).toHaveLength(1);
    expect(conflicts).toHaveLength(0);
  });

  it("gives the same value whichever bay holds the 40s", () => {
    const fromFwd = deriveBay40sMinBottomHeights(makeUnevenBays());

    const moved = moveBay40sToLocation(makeUnevenBays(), {
      bay40sLocation: ForeAftEnum.AFT,
      deriveMinBottomHeights: false,
    }).baysData;
    const fromAft = deriveBay40sMinBottomHeights(moved);

    expect(fromAft.derived[0].minBottomHeight).toBe(
      fromFwd.derived[0].minBottomHeight,
    );
    expect(fromFwd.derived[0].isoBay).toBe("001");
    expect(fromAft.derived[0].isoBay).toBe("003");
    expect(fromAft.derived[0].minBottomHeight).toBe(2591);
  });

  it("derives nothing when both bays start level", () => {
    const bays = makeUnevenBays();
    bays[1].perRowInfo!.each!["10"].bottomBase = 4591;

    expect(deriveBay40sMinBottomHeights(bays).derived).toHaveLength(0);
  });

  it("derives nothing when a bottomBase is missing", () => {
    const bays = makeUnevenBays();
    delete bays[1].perRowInfo!.each!["10"].bottomBase;

    expect(deriveBay40sMinBottomHeights(bays).derived).toHaveLength(0);
  });

  it("falls back to the bay's common bottomBase", () => {
    const bays = makeUnevenBays();
    delete bays[1].perRowInfo!.each!["10"].bottomBase;
    bays[1].perRowInfo!.common = { bottomBase: 2000 };

    const { derived } = deriveBay40sMinBottomHeights(bays);

    expect(derived[0].minBottomHeight).toBe(2591);
  });

  it("derives for every 40'+ size the row accepts", () => {
    const bays = makeUnevenBays();
    bays[0].perSlotInfo!["1012"].sizes = { 20: 1, 40: 1, 45: 1 };

    const { derived } = deriveBay40sMinBottomHeights(bays);

    expect(derived.map((d) => d.size).sort()).toEqual([40, 45]);
    expect(derived.every((d) => d.minBottomHeight === 2591)).toBe(true);
  });

  it("keeps a stated value and reports it when it is too low", () => {
    const bays = makeUnevenBays();
    bays[0].perRowInfo!.each!["10"].rowInfoByLength = {
      40: { size: 40, minBottomHeight: 1000 },
    };

    const { toApply, conflicts } = deriveBay40sMinBottomHeights(bays);

    expect(toApply).toHaveLength(0);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].statedMinBottomHeight).toBe(1000);
    expect(conflicts[0].minBottomHeight).toBe(2591);
  });

  it("does not report a stated value that already satisfies the geometry", () => {
    const bays = makeUnevenBays();
    bays[0].perRowInfo!.each!["10"].rowInfoByLength = {
      40: { size: 40, minBottomHeight: 5791 },
    };

    const { toApply, conflicts } = deriveBay40sMinBottomHeights(bays);

    expect(toApply).toHaveLength(0);
    expect(conflicts).toHaveLength(0);
  });
});

describe("moveBay40sToLocation with uneven bottom bases", () => {
  it("writes the derived minBottomHeight and leaves both bottomBases alone", () => {
    const { baysData, appliedMinBottomHeights } = moveBay40sToLocation(
      makeUnevenBays(),
      { bay40sLocation: ForeAftEnum.AFT },
    );

    const [fwd, aft] = baysData;

    expect(appliedMinBottomHeights).toHaveLength(1);
    expect(aft.perRowInfo!.each!["10"].rowInfoByLength![40]).toEqual({
      size: 40,
      minBottomHeight: 2591,
    });

    // The 20' bottoms of each bay never move
    expect(fwd.perRowInfo!.each!["10"].bottomBase).toBe(4591);
    expect(aft.perRowInfo!.each!["10"].bottomBase).toBe(2000);
  });

  it("survives a round trip back to the original side", () => {
    const toAft = moveBay40sToLocation(makeUnevenBays(), {
      bay40sLocation: ForeAftEnum.AFT,
    }).baysData;

    const backToFwd = moveBay40sToLocation(toAft, {
      bay40sLocation: ForeAftEnum.FWD,
    }).baysData;

    expect(
      backToFwd[0].perRowInfo!.each!["10"].rowInfoByLength![40]
        ?.minBottomHeight,
    ).toBe(2591);
    expect(backToFwd[1].perRowInfo!.each!["10"].rowInfoByLength).toBeUndefined();
    expect(backToFwd[0].perRowInfo!.each!["10"].bottomBase).toBe(4591);
    expect(backToFwd[1].perRowInfo!.each!["10"].bottomBase).toBe(2000);
  });

  it("can be turned off", () => {
    const { baysData, appliedMinBottomHeights } = moveBay40sToLocation(
      makeUnevenBays(),
      { bay40sLocation: ForeAftEnum.AFT, deriveMinBottomHeights: false },
    );

    expect(appliedMinBottomHeights).toHaveLength(0);
    expect(
      baysData[1].perRowInfo!.each!["10"].rowInfoByLength?.[40]
        ?.minBottomHeight,
    ).toBeUndefined();
  });

  it("reports a conflict instead of overwriting a stated value", () => {
    const bays = makeUnevenBays();
    bays[0].perRowInfo!.each!["10"].rowInfoByLength = {
      40: { size: 40, minBottomHeight: 1000 },
    };

    const { baysData, minBottomHeightConflicts } = moveBay40sToLocation(bays, {
      bay40sLocation: ForeAftEnum.AFT,
    });

    expect(minBottomHeightConflicts).toHaveLength(1);
    expect(
      baysData[1].perRowInfo!.each!["10"].rowInfoByLength![40]!
        .minBottomHeight,
    ).toBe(1000);
  });
});
