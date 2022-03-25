import { pad2 } from "./pad";
import sortStacksArray from "./sortStacksArray";

describe("sortCellsArray should", () => {
  it("sort properly without 00", () => {
    const cells = new Array(16)
      .fill(1)
      .map((_, idx) => pad2(idx + 1))
      .sort();

    expect(cells.sort(sortStacksArray)).toStrictEqual([
      "16",
      "14",
      "12",
      "10",
      "08",
      "06",
      "04",
      "02",
      "01",
      "03",
      "05",
      "07",
      "09",
      "11",
      "13",
      "15",
    ]);
  });

  it("sort properly with 00", () => {
    const cells = new Array(11)
      .fill(1)
      .map((_, idx) => pad2(idx))
      .sort();

    expect(cells.sort(sortStacksArray)).toStrictEqual([
      "10",
      "08",
      "06",
      "04",
      "02",
      "00",
      "01",
      "03",
      "05",
      "07",
      "09",
    ]);
  });
});
