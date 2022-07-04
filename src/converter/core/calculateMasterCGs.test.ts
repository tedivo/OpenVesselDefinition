import { IInventory, chooseMostRepeatedValue } from "./calculateMasterCGs";

describe("chooseMostRepeatedValue should...", () => {
  it("work ok with no values", () => {
    const mock: IInventory = {
      "01": new Map<number, number>([]),
    };

    const result = chooseMostRepeatedValue(mock);

    expect(result).toStrictEqual({
      "01": undefined,
    });
  });

  it("work ok with single values", () => {
    const mock: IInventory = {
      "01": new Map<number, number>([[10, 1]]),
    };

    const result = chooseMostRepeatedValue(mock);

    expect(result).toStrictEqual({
      "01": 10,
    });
  });

  it("work ok with many values", () => {
    const mock: IInventory = {
      "01": new Map<number, number>([
        [10, 1],
        [20, 10],
        [30, 2],
      ]),
    };

    const result = chooseMostRepeatedValue(mock);

    expect(result).toStrictEqual({
      "01": 20,
    });
  });
});
