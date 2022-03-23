import pad from "./pad";

describe("pad function should", () => {
  it("work correctly", () => {
    expect(pad(1, 1)).toBe("1");
    expect(pad(1, 2)).toBe("01");
    expect(pad(1, 3)).toBe("001");
    expect(pad(1, 4)).toBe("0001");
    expect(pad(1, 5)).toBe("00001");

    expect(pad(100, 1)).toBe("100");
    expect(pad(100, 2)).toBe("100");
    expect(pad(100, 3)).toBe("100");
    expect(pad(100, 4)).toBe("0100");
    expect(pad(100, 5)).toBe("00100");
  });
});
