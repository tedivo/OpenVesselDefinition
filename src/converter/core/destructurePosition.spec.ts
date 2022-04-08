import destructurePosition from "./destructurePosition";

describe("destructurePosition should", () => {
  it("work correctly on 20'", () => {
    const desPos = destructurePosition("0011018");

    expect(desPos).toBeDefined();

    expect(desPos.bay).toBe("001");
    expect(desPos.tier).toBe("18");
    expect(desPos.stack).toBe("10");
    expect(desPos.oddBay).toBe("001");

    expect(desPos.iBay).toBe(1);
    expect(desPos.iTier).toBe(18);
    expect(desPos.iStack).toBe(10);
    expect(desPos.iOddBay).toBe(1);
  });

  it("work correctly on 40'", () => {
    const desPos = destructurePosition("0040082");

    expect(desPos).toBeDefined();

    expect(desPos.bay).toBe("004");
    expect(desPos.tier).toBe("82");
    expect(desPos.stack).toBe("00");
    expect(desPos.oddBay).toBe("003");

    expect(desPos.iBay).toBe(4);
    expect(desPos.iTier).toBe(82);
    expect(desPos.iStack).toBe(0);
    expect(desPos.iOddBay).toBe(3);
  });

  it("returns error with bad position (letters)", () => {
    const desPos = destructurePosition("00A0082" as any);

    expect(desPos).toBeNull();
  });

  it("returns error with bad position (length < 7)", () => {
    const desPos = destructurePosition("000082" as any);

    expect(desPos).toBeNull();
  });

  it("returns error with bad position (has 999)", () => {
    const desPos = destructurePosition("0999999");

    expect(desPos).toBeNull();
  });

  it("returns error with bad position (starts with 000)", () => {
    const desPos = destructurePosition("0009999");

    expect(desPos).toBeNull();
  });
});
