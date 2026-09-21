import BayLevelEnum from "../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import IBayLevelData from "../models/v1/parts/IBayLevelData";
import detectBay40sLocation from "./core/bay40s/detectBay40sLocation";
import fs from "fs";
import ovdV1ToStafConverter from "./ovdV1ToStafConverter";
import path from "path";
import stafToOvdV1Converter from "./stafToOvdV1Converter";

/**
 * Both example vessels end in a bay that holds its 40s alone, with the bay
 * they extend into never declared — the shape STAF exports routinely produce.
 */
const EXAMPLES: Array<[string, number, number]> = [
  // file, last bay as written, last bay once the pair is completed
  ["./examples/ARGENTINA.CHO.CMA-CGM-HOPE.txt", 85, 87],
  ["./examples/DMS.MSK.ADAMS.txt", 63, 65],
];

const maxIsoBay = (baysData: IBayLevelData[]) =>
  Math.max(...baysData.map((b) => Number(b.isoBay)));

describe.each(EXAMPLES)("%s", (file, lastAsWritten, lastCompleted) => {
  let stafFileContent: string;

  beforeAll(() => {
    stafFileContent = fs.readFileSync(path.resolve(file), "utf8");
  });

  it("leaves the last bay unpaired when normalisation is off", () => {
    const ovd = stafToOvdV1Converter(stafFileContent, 200, 0.45, 82, {
      normalizeTrailing40sBay: false,
    });

    const detected = detectBay40sLocation(ovd.baysData);

    expect(maxIsoBay(ovd.baysData)).toBe(lastAsWritten);
    expect(detected.unpairedWith40s).toHaveLength(1);
    expect(Number(detected.unpairedWith40s[0].isoBay)).toBe(lastAsWritten);
  });

  it("completes the pair on import, and every pair then agrees", () => {
    const ovd = stafToOvdV1Converter(stafFileContent, 200, 0.45, 82);

    const detected = detectBay40sLocation(ovd.baysData);

    expect(maxIsoBay(ovd.baysData)).toBe(lastCompleted);
    expect(detected.unpairedWith40s).toHaveLength(0);
    expect(detected.consistent).toBe(true);
    expect(ovd.shipData.bay40sLocation).toBe(detected.bay40sLocation);
    expect(ovd.sizeSummary.isoBays).toBe(lastCompleted);
  });

  it("leaves no holes: every bay exists at every level", () => {
    const ovd = stafToOvdV1Converter(stafFileContent, 200, 0.45, 82);

    const levels = [...new Set(ovd.baysData.map((b) => b.level))];
    const holes: string[] = [];

    for (let i = 1; i <= ovd.sizeSummary.isoBays; i += 2) {
      const isoBay = String(i).padStart(3, "0");
      levels.forEach((level) => {
        if (!ovd.baysData.some((b) => b.isoBay === isoBay && b.level === level))
          holes.push(`${isoBay}-${level}`);
      });
    }

    expect(holes).toEqual([]);
  });

  it("writes exactly the same STAF back out", () => {
    const baseline = ovdV1ToStafConverter(
      stafToOvdV1Converter(stafFileContent, 200, 0.45, 82, {
        normalizeTrailing40sBay: false,
      }),
      { tier82is: 82, collapseTrailing40sBay: false },
    ).stafText;

    const normalised = ovdV1ToStafConverter(
      stafToOvdV1Converter(stafFileContent, 200, 0.45, 82),
      { tier82is: 82 },
    ).stafText;

    expect(normalised).toBe(baseline);
  });

  it("writes the same STAF when the trailing 40s are put in the AFT bay", () => {
    const baseline = ovdV1ToStafConverter(
      stafToOvdV1Converter(stafFileContent, 200, 0.45, 82, {
        normalizeTrailing40sBay: false,
      }),
      { tier82is: 82, collapseTrailing40sBay: false },
    ).stafText;

    const ovd = stafToOvdV1Converter(stafFileContent, 200, 0.45, 82, {
      bay40sLocation: ForeAftEnum.AFT,
    });

    // The created bay holds the 40s; the one it extends from is restricted
    const created = ovd.baysData.find(
      (b) => Number(b.isoBay) === lastCompleted && b.level === BayLevelEnum.ABOVE,
    )!;
    const extendsFrom = ovd.baysData.find(
      (b) => Number(b.isoBay) === lastAsWritten && b.level === BayLevelEnum.ABOVE,
    )!;

    expect(
      Object.values(created.perSlotInfo!).some((s) => s.sizes[40] !== undefined),
    ).toBe(true);
    expect(created.pairedBay).toBe(ForeAftEnum.FWD);
    expect(extendsFrom.pairedBay).toBe(ForeAftEnum.AFT);
    expect(
      Object.values(extendsFrom.perSlotInfo!).filter((s) => s.restricted).length,
    ).toBeGreaterThan(0);
    expect(
      Object.values(extendsFrom.perSlotInfo!).some(
        (s) => Object.keys(s.sizes).length > 0,
      ),
    ).toBe(false);

    expect(ovdV1ToStafConverter(ovd, { tier82is: 82 }).stafText).toBe(baseline);
  });
});
