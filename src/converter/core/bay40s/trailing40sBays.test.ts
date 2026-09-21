import {
  collapseTrailing40sBays,
  expandTrailing40sBays,
} from "./trailing40sBays";

import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import detectBay40sLocation from "./detectBay40sLocation";

/**
 * The common shape: 001-003 and 005-007 keep their 40s in the AFT bay, but 009
 * is the last bay, holds the 40s itself and never got its 011 created.
 */
function makeVesselWithTrailingBay(): IBayLevelData[] {
  const pair = (
    fwd: string,
    aft: string,
  ): IBayLevelData[] => [
    {
      isoBay: fwd as IBayLevelData["isoBay"],
      level: BayLevelEnum.ABOVE,
      pairedBay: ForeAftEnum.AFT,
      centerLineRow: 0,
      infoByContLength: { 20: { size: 20 } },
      perRowInfo: { each: { "02": { isoRow: "02", tcg: -2438, bottomBase: 5500 } } },
      perSlotInfo: { "0282": { pos: "0282", sizes: { 20: 1 } } },
    },
    {
      isoBay: aft as IBayLevelData["isoBay"],
      level: BayLevelEnum.ABOVE,
      pairedBay: ForeAftEnum.FWD,
      centerLineRow: 0,
      infoByContLength: { 20: { size: 20 }, 40: { size: 40, lcg: 1000 } },
      perRowInfo: { each: { "02": { isoRow: "02", tcg: -2438, bottomBase: 5500 } } },
      perSlotInfo: { "0282": { pos: "0282", sizes: { 20: 1, 40: 1 } } },
    },
  ];

  return [
    ...pair("001", "003"),
    ...pair("005", "007"),
    // 009: last bay, holds the 40s itself, no 011 exists
    {
      isoBay: "009",
      level: BayLevelEnum.ABOVE,
      pairedBay: ForeAftEnum.AFT,
      centerLineRow: 0,
      infoByContLength: { 40: { size: 40, lcg: 9000 } },
      perRowInfo: {
        each: { "02": { isoRow: "02", tcg: -2438, bottomBase: 5500 } },
      },
      perSlotInfo: { "0282": { pos: "0282", sizes: { 40: 1 }, reefer: 1 } },
    },
  ];
}

describe("expandTrailing40sBays", () => {
  it("creates the missing 011 and moves the 40s into it", () => {
    const { baysData, changed, maxIsoBay } = expandTrailing40sBays(
      makeVesselWithTrailingBay(),
    );

    expect(changed).toEqual([
      { isoBay: "011", level: BayLevelEnum.ABOVE, pairedWith: "009" },
    ]);
    expect(maxIsoBay).toBe(11);

    const bay009 = baysData.find((b) => b.isoBay === "009")!;
    const bay011 = baysData.find((b) => b.isoBay === "011")!;

    expect(bay011.perSlotInfo!["0282"].sizes).toEqual({ 40: 1 });
    expect(bay011.infoByContLength[40]).toEqual({ size: 40, lcg: 9000 });

    // 009 keeps the slot, now restricted and empty
    expect(bay009.perSlotInfo!["0282"].sizes).toEqual({});
    expect(bay009.perSlotInfo!["0282"].restricted).toBe(1);
    expect(bay009.infoByContLength[40]).toBeUndefined();
  });

  it("declares the pairing both ways", () => {
    const { baysData } = expandTrailing40sBays(makeVesselWithTrailingBay());

    expect(baysData.find((b) => b.isoBay === "009")!.pairedBay).toBe(
      ForeAftEnum.AFT,
    );
    expect(baysData.find((b) => b.isoBay === "011")!.pairedBay).toBe(
      ForeAftEnum.FWD,
    );
  });

  it("gives the whole vessel one consistent convention", () => {
    const before = detectBay40sLocation(makeVesselWithTrailingBay());
    expect(before.unpairedWith40s).toHaveLength(1);

    const { baysData } = expandTrailing40sBays(makeVesselWithTrailingBay());
    const after = detectBay40sLocation(baysData);

    expect(after.bay40sLocation).toBe(ForeAftEnum.AFT);
    expect(after.consistent).toBe(true);
    expect(after.unpairedWith40s).toHaveLength(0);
    expect(after.pairs).toHaveLength(3);
  });

  it("carries the row geometry into the created bay", () => {
    const { baysData } = expandTrailing40sBays(makeVesselWithTrailingBay());
    const bay011 = baysData.find((b) => b.isoBay === "011")!;

    expect(bay011.perRowInfo!.each!["02"]).toMatchObject({
      isoRow: "02",
      tcg: -2438,
      bottomBase: 5500,
    });
    expect(bay011.level).toBe(BayLevelEnum.ABOVE);
    expect(bay011.centerLineRow).toBe(0);
  });

  it("does not copy minTierHeights into the created bay", () => {
    const bays = makeVesselWithTrailingBay();
    const bay009 = bays.find((b) => b.isoBay === "009")!;
    bay009.perRowInfo!.each!["02"].minTierHeights = { "82": 2896 };

    const { baysData } = expandTrailing40sBays(bays);

    expect(
      baysData.find((b) => b.isoBay === "011")!.perRowInfo!.each!["02"]
        .minTierHeights,
    ).toBeUndefined();
  });

  it("carries the reefer plug with the container", () => {
    const { baysData } = expandTrailing40sBays(makeVesselWithTrailingBay());

    expect(baysData.find((b) => b.isoBay === "011")!.perSlotInfo!["0282"].reefer).toBe(1);
    expect(
      baysData.find((b) => b.isoBay === "009")!.perSlotInfo!["0282"].reefer,
    ).toBeUndefined();
  });

  it("leaves the 40s in place under the FWD convention, but still creates the bay", () => {
    const { baysData } = expandTrailing40sBays(makeVesselWithTrailingBay(), {
      bay40sLocation: ForeAftEnum.FWD,
    });

    const bay009 = baysData.find((b) => b.isoBay === "009")!;
    const bay011 = baysData.find((b) => b.isoBay === "011")!;

    expect(bay009.perSlotInfo!["0282"].sizes).toEqual({ 40: 1 });
    expect(bay011.perSlotInfo!["0282"]).toEqual({
      pos: "0282",
      sizes: {},
      restricted: 1,
    });
  });

  it("does nothing when the partner bay already exists", () => {
    const bays = makeVesselWithTrailingBay();
    bays.push({
      isoBay: "011",
      level: BayLevelEnum.ABOVE,
      infoByContLength: { 20: { size: 20 } },
      perSlotInfo: { "0282": { pos: "0282", sizes: { 20: 1 } } },
    });

    const { changed } = expandTrailing40sBays(bays);

    expect(changed).toHaveLength(0);
  });

  it("does nothing to a vessel whose last bay is already paired", () => {
    const bays = makeVesselWithTrailingBay().slice(0, 4);
    const before = JSON.stringify(bays);

    const { baysData, changed } = expandTrailing40sBays(bays);

    expect(changed).toHaveLength(0);
    expect(JSON.stringify(baysData)).toBe(before);
  });

  it("does not modify the input unless asked to", () => {
    const bays = makeVesselWithTrailingBay();
    const before = JSON.stringify(bays);

    expandTrailing40sBays(bays);

    expect(JSON.stringify(bays)).toBe(before);
  });
});

describe("collapseTrailing40sBays", () => {
  it("folds the created bay back into 009", () => {
    const expanded = expandTrailing40sBays(makeVesselWithTrailingBay()).baysData;

    const { baysData, changed, maxIsoBay } = collapseTrailing40sBays(expanded);

    expect(changed).toEqual([
      { isoBay: "011", level: BayLevelEnum.ABOVE, pairedWith: "009" },
    ]);
    expect(maxIsoBay).toBe(9);
    expect(baysData.find((b) => b.isoBay === "011")).toBeUndefined();

    const bay009 = baysData.find((b) => b.isoBay === "009")!;
    expect(bay009.perSlotInfo!["0282"].sizes).toEqual({ 40: 1 });
    expect(bay009.perSlotInfo!["0282"].restricted).toBeUndefined();
    expect(bay009.infoByContLength[40]).toEqual({ size: 40, lcg: 9000 });
  });

  it("keeps the forward bay's pairedBay so the 40' bay is still named", () => {
    const expanded = expandTrailing40sBays(makeVesselWithTrailingBay()).baysData;
    const { baysData } = collapseTrailing40sBays(expanded);

    expect(baysData.find((b) => b.isoBay === "009")!.pairedBay).toBe(
      ForeAftEnum.AFT,
    );
  });

  it("round-trips back to the original shape", () => {
    const original = makeVesselWithTrailingBay();

    const expanded = expandTrailing40sBays(original).baysData;
    const collapsed = collapseTrailing40sBays(expanded).baysData;

    expect(collapsed).toHaveLength(original.length);
    expect(collapsed.find((b) => b.isoBay === "009")!.perSlotInfo).toEqual(
      original.find((b) => b.isoBay === "009")!.perSlotInfo,
    );
    expect(
      collapsed.find((b) => b.isoBay === "009")!.infoByContLength,
    ).toEqual(original.find((b) => b.isoBay === "009")!.infoByContLength);
  });

  it("drops trailing bays that carry no size at all", () => {
    const expanded = expandTrailing40sBays(makeVesselWithTrailingBay()).baysData;

    // The padding a below deck would get so every bay exists at every level
    expanded.push({
      isoBay: "011",
      level: BayLevelEnum.BELOW,
      infoByContLength: {},
      perSlotInfo: {},
      perRowInfo: { common: {}, each: {} },
    });

    const { baysData, changed } = collapseTrailing40sBays(expanded);

    expect(
      changed.some(
        (c) => c.isoBay === "011" && c.level === BayLevelEnum.BELOW,
      ),
    ).toBe(true);
    expect(baysData.some((b) => b.isoBay === "011")).toBe(false);
  });

  it("stops at the first trailing bay that carries a size", () => {
    const bays = makeVesselWithTrailingBay();
    const { baysData } = collapseTrailing40sBays(bays);

    // 009 holds the 40s, so nothing before it may be swept away
    expect(baysData.some((b) => b.isoBay === "009")).toBe(true);
    expect(baysData.some((b) => b.isoBay === "007")).toBe(true);
  });

  it("leaves a trailing bay that also holds 20s alone", () => {
    const expanded = expandTrailing40sBays(makeVesselWithTrailingBay()).baysData;
    const bay011 = expanded.find((b) => b.isoBay === "011")!;
    bay011.perSlotInfo!["0280"] = { pos: "0280", sizes: { 20: 1 } };

    const { changed } = collapseTrailing40sBays(expanded);

    expect(changed).toHaveLength(0);
  });

  it("leaves an inner pair alone, however 40s-only it looks", () => {
    const bays = makeVesselWithTrailingBay();
    // 003 holds only 40s, but it is not the last bay
    bays[1].infoByContLength = { 40: { size: 40, lcg: 1000 } };
    bays[1].perSlotInfo = { "0282": { pos: "0282", sizes: { 40: 1 } } };

    const { changed } = collapseTrailing40sBays(bays);

    expect(changed).toHaveLength(0);
  });

  it("does not modify the input unless asked to", () => {
    const expanded = expandTrailing40sBays(makeVesselWithTrailingBay()).baysData;
    const before = JSON.stringify(expanded);

    collapseTrailing40sBays(expanded);

    expect(JSON.stringify(expanded)).toBe(before);
  });
});
