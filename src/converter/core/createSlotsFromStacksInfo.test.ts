import { IBayStackInfo } from "../../models/v1/parts/IBayLevelData";
import createSlotsFromStacksInfo, {
  createSlotsFromStack,
} from "./createSlotsFromStacksInfo";

const testStack01: IBayStackInfo = {
  isoStack: "01",
  topIsoTier: "80",
  bottomIsoTier: "72",
  stackInfoByLength: {
    20: { size: 20 },
    40: { size: 40 },
    48: { size: 48 },
  },
};

const testStack02: IBayStackInfo = {
  isoStack: "02",
  topIsoTier: "76",
  bottomIsoTier: "72",
  stackInfoByLength: {
    20: { size: 20 },
  },
};

describe("createSlotsFromStack should", () => {
  it("work correctly", () => {
    const res = createSlotsFromStack(testStack01, {});

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

describe("createSlotsFromStacksInfo should", () => {
  it("work correctly", () => {
    const stacks = {
      "01": testStack01,
      "02": testStack02,
    };
    const res = createSlotsFromStacksInfo(stacks, {});

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
