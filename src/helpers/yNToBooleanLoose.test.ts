import yNToBooleanLoose from "./yNToBooleanLoose";

describe("yNToBooleanLoose function should", () => {
  it("return 0 for 'N'", () => {
    expect(yNToBooleanLoose("N")).toBe(0);
  });

  it("return 1 for 'Y'", () => {
    expect(yNToBooleanLoose("Y")).toBe(1);
  });

  it("return undefined for '' and '-'", () => {
    expect(yNToBooleanLoose("")).toBeUndefined();
    expect(yNToBooleanLoose("-")).toBeUndefined();
  });
});
