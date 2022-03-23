import sortByMultipleFields from "./sortByMultipleFields";

interface IDummy {
  a: string;
  b: number;
}
const arr: IDummy[] = [
  { a: "a", b: 20 },
  { a: "a", b: 10 },
  { a: "b", b: 11 },
  { a: "b", b: 13 },
  { a: "z", b: 100 },
];

describe("sortByMultipleFields function should", () => {
  it("sort one column ASC ok", () => {
    const sortedArray = arr
      .slice()
      .sort(sortByMultipleFields([{ name: "a", ascending: true }]));

    expect(sortedArray.length).toBe(arr.length);

    expect(sortedArray[0].a).toBe("a");
    expect(sortedArray[1].a).toBe("a");
    expect(sortedArray[2].a).toBe("b");
    expect(sortedArray[3].a).toBe("b");
    expect(sortedArray[4].a).toBe("z");
  });
  it("sort one column DESC ok", () => {
    const sortedArray = arr
      .slice()
      .sort(sortByMultipleFields([{ name: "a", ascending: false }]));

    expect(sortedArray.length).toBe(arr.length);

    expect(sortedArray[4].a).toBe("a");
    expect(sortedArray[3].a).toBe("a");
    expect(sortedArray[2].a).toBe("b");
    expect(sortedArray[1].a).toBe("b");
    expect(sortedArray[0].a).toBe("z");
  });
  it("sort one column ASC ok, numeric", () => {
    const sortedArray = arr
      .slice()
      .sort(
        sortByMultipleFields([{ name: "b", ascending: true, isNumeric: true }])
      );

    expect(sortedArray.length).toBe(arr.length);

    expect(sortedArray[0].b).toBe(10);
    expect(sortedArray[1].b).toBe(11);
    expect(sortedArray[2].b).toBe(13);
    expect(sortedArray[3].b).toBe(20);
    expect(sortedArray[4].b).toBe(100);
  });
  it("sort one column DESC ok, numeric", () => {
    const sortedArray = arr
      .slice()
      .sort(
        sortByMultipleFields([{ name: "b", ascending: false, isNumeric: true }])
      );

    expect(sortedArray.length).toBe(arr.length);

    expect(sortedArray[4].b).toBe(10);
    expect(sortedArray[3].b).toBe(11);
    expect(sortedArray[2].b).toBe(13);
    expect(sortedArray[1].b).toBe(20);
    expect(sortedArray[0].b).toBe(100);
  });

  it("sort multiple column ASC & ASC ok", () => {
    const sortedArray = arr.slice().sort(
      sortByMultipleFields([
        { name: "a", ascending: true, isNumeric: false },
        { name: "b", ascending: true, isNumeric: true },
      ])
    );

    expect(sortedArray.length).toBe(arr.length);

    expect(sortedArray[0].a).toBe("a");
    expect(sortedArray[1].a).toBe("a");
    expect(sortedArray[2].a).toBe("b");
    expect(sortedArray[3].a).toBe("b");
    expect(sortedArray[4].a).toBe("z");

    expect(sortedArray[0].b).toBe(10);
    expect(sortedArray[1].b).toBe(20);
    expect(sortedArray[2].b).toBe(11);
    expect(sortedArray[3].b).toBe(13);
    expect(sortedArray[4].b).toBe(100);
  });

  it("sort multiple column ASC & DESC ok", () => {
    const sortedArray = arr.slice().sort(
      sortByMultipleFields([
        { name: "a", ascending: true, isNumeric: false },
        { name: "b", ascending: false, isNumeric: true },
      ])
    );

    expect(sortedArray.length).toBe(arr.length);

    expect(sortedArray[0].a).toBe("a");
    expect(sortedArray[1].a).toBe("a");
    expect(sortedArray[2].a).toBe("b");
    expect(sortedArray[3].a).toBe("b");
    expect(sortedArray[4].a).toBe("z");

    expect(sortedArray[0].b).toBe(20);
    expect(sortedArray[1].b).toBe(10);
    expect(sortedArray[2].b).toBe(13);
    expect(sortedArray[3].b).toBe(11);
    expect(sortedArray[4].b).toBe(100);
  });
});
