import {
  safeNumberMmToMt,
  safeNumberMtToMm,
  safeNumberTonsToGrams,
} from "./safeNumberConversions";

describe("safeNumberMtToMm function should", () => {
  it("return undefined for a blank or whitespace-only string", () => {
    expect(safeNumberMtToMm("")).toBeUndefined();
    expect(safeNumberMtToMm("   ")).toBeUndefined();
  });

  it("return undefined for a non-numeric string", () => {
    expect(safeNumberMtToMm("abc")).toBeUndefined();
  });

  it("convert a numeric string from meters to millimeters", () => {
    expect(safeNumberMtToMm("1.5")).toBe(1500);
    expect(safeNumberMtToMm("0")).toBe(0);
  });
});

describe("safeNumberTonsToGrams function should", () => {
  it("return undefined for a blank or whitespace-only string", () => {
    expect(safeNumberTonsToGrams("")).toBeUndefined();
    expect(safeNumberTonsToGrams("   ")).toBeUndefined();
  });

  it("convert a numeric string from tons to grams", () => {
    expect(safeNumberTonsToGrams("1")).toBe(1000000);
    expect(safeNumberTonsToGrams("0")).toBe(0);
  });
});

describe("safeNumberMmToMt function should", () => {
  it("return '-' when input is undefined", () => {
    expect(safeNumberMmToMt(undefined)).toBe("-");
  });

  it("return '-' when input is a non-numeric string", () => {
    expect(safeNumberMmToMt("abc")).toBe("-");
  });

  it("return '-' when input is NaN", () => {
    expect(safeNumberMmToMt(NaN)).toBe("-");
  });

  it("convert numeric input from millimeters to meters", () => {
    expect(safeNumberMmToMt(0)).toBe("0.0");
    expect(safeNumberMmToMt(1000)).toBe("1.0");
    expect(safeNumberMmToMt(10)).toBe("0.01");
    expect(safeNumberMmToMt(12345)).toBe("12.35");
    expect(safeNumberMmToMt(999999999)).toBe("1000000.0");
  });

  it("convert numeric string input from millimeters to meters", () => {
    expect(safeNumberMmToMt("1000")).toBe("1.0");
    expect(safeNumberMmToMt("12345")).toBe("12.35");
    expect(safeNumberMmToMt("1234.5")).toBe("1.23");
  });

  it("handle negative numbers", () => {
    expect(safeNumberMmToMt(-1000)).toBe("-1.0");
    expect(safeNumberMmToMt(-12345)).toBe("-12.34");
  });

  it("round to the nearest centimeter before converting to meters", () => {
    expect(safeNumberMmToMt(4)).toBe("0.0"); // rounds down to 0mm
    expect(safeNumberMmToMt(5)).toBe("0.01"); // rounds up to 10mm
    expect(safeNumberMmToMt(15)).toBe("0.02"); // rounds up to 20mm
  });

  it("only strip a single trailing zero when the result ends in .00", () => {
    const result = safeNumberMmToMt(1000);
    expect(result).toBe("1.0");
    expect(result.endsWith(".00")).toBe(false);
  });

  it("treat an empty string as 0", () => {
    expect(safeNumberMmToMt("")).toBe("0.0");
  });
});
