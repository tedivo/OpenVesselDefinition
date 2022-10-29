import {
  IBayRowInfoStaf,
  TBayRowInfo,
} from "../../models/v1/parts/IBayLevelData";
import createSlotsFromRowsInfo, {
  createSlotsFromRow,
} from "./createSlotsFromRowsInfo";

const testRow01: IBayRowInfoStaf = {
  isoRow: "01",
  topIsoTier: "80",
  bottomIsoTier: "72",
  rowInfoByLength: {
    20: { size: 20 },
    40: { size: 40 },
    48: { size: 48 },
  },
};

const testRow02: IBayRowInfoStaf = {
  isoRow: "02",
  topIsoTier: "76",
  bottomIsoTier: "72",
  rowInfoByLength: {
    20: { size: 20 },
  },
};

describe("createSlotsFromRow should", () => {
  it("work correctly", () => {
    const res = createSlotsFromRow(testRow01, {});

    const keys = Object.keys(res);
    expect(keys.length).toBe(5); // 72-74-76-78-80
    expect(keys).toContain("0172");
    expect(keys).toContain("0174");
    expect(keys).toContain("0176");
    expect(keys).toContain("0178");
    expect(keys).toContain("0180");

    expect(res[keys[0]].sizes).toBeDefined();
    expect(Object.keys(res[keys[0]].sizes).length).toBe(3); //20-40-48
    expect(res[keys[0]].sizes[20]).toBe(1);
    expect(res[keys[0]].sizes[40]).toBe(1);
    expect(res[keys[0]].sizes[48]).toBe(1);
  });
});

describe("createSlotsFromRowsInfo should", () => {
  it("work correctly", () => {
    const rows: TBayRowInfo = {
      each: {
        "01": testRow01,
        "02": testRow02,
      },
      common: {},
    };
    const res = createSlotsFromRowsInfo(rows, {});

    const keys = Object.keys(res);
    expect(keys.length).toBe(8); // 72-74-76-78-80 & 72-74-76
    expect(keys).toContain("0172");
    expect(keys).toContain("0174");
    expect(keys).toContain("0176");
    expect(keys).toContain("0178");
    expect(keys).toContain("0180");
    expect(keys).toContain("0272");
    expect(keys).toContain("0274");
    expect(keys).toContain("0276");

    expect(res[keys[0]].pos).toBe("0172");
    expect(res[keys[0]].sizes).toBeDefined();
    expect(Object.keys(res[keys[0]].sizes).length).toBe(3); //20-40-48
    expect(res[keys[0]].sizes[20]).toBe(1);
    expect(res[keys[0]].sizes[40]).toBe(1);
    expect(res[keys[0]].sizes[48]).toBe(1);

    expect(res[keys[6]].pos).toBe("0274");
    expect(res[keys[5]].sizes).toBeDefined();
    expect(Object.keys(res[keys[5]].sizes).length).toBe(1); //20
    expect(res[keys[5]].sizes[20]).toBe(1);
  });
});
