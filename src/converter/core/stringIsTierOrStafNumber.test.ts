import { stringIsTierOrStafNumber } from "./stringIsTierOrStafNumber";

describe("stringIsTierOrStafNumber should...", () => {
  it("detects wrong strings: non-numbers", () => {
    expect(stringIsTierOrStafNumber("a1")).toBe(false);
    expect(stringIsTierOrStafNumber("1a1")).toBe(false);
    expect(stringIsTierOrStafNumber(":a1")).toBe(false);
  });

  it("detects wrong strings: non integers", () => {
    expect(stringIsTierOrStafNumber("10.34")).toBe(false);
    expect(stringIsTierOrStafNumber("20,34")).toBe(false);
  });

  it("detects wrong strings: integers that should be even", () => {
    expect(stringIsTierOrStafNumber("11", true)).toBe(false);
    expect(stringIsTierOrStafNumber("345", true)).toBe(false);
  });

  it("detects wrong strings: integers that should be between 00 and 99", () => {
    expect(stringIsTierOrStafNumber("11")).toBe(true);
    expect(stringIsTierOrStafNumber("345")).toBe(false);
  });

  it("detects wrong strings: integers that should be between 00 and 98 (even)", () => {
    expect(stringIsTierOrStafNumber("12", true)).toBe(true);
    expect(stringIsTierOrStafNumber("11", true)).toBe(false);
  });
});
