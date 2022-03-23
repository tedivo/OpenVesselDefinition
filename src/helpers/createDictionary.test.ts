import { createDictionary, createDictionaryMultiple } from "./createDictionary";

describe("createDictionary function should", () => {
  it("generate dictionaries ok", () => {
    interface IDummy {
      id1: string;
      id2: string;
      value: string;
    }
    const arr: IDummy[] = [
      { id1: "id1-1", id2: "id2-1", value: "value-1" },
      { id1: "id1-2", id2: "id2-2", value: "value-2" },
      { id1: "id1-3", id2: "id2-3", value: "value-3" },
    ];

    const dict = createDictionary<IDummy, string>(
      arr,
      (d) => `${d.id1}-${d.id2}`
    );

    expect(Object.keys(dict).length).toBe(arr.length);

    expect(dict["id1-1-id2-1"]).toBeTruthy();
    expect(dict["id1-2-id2-2"]).toBeTruthy();
    expect(dict["id1-3-id2-3"]).toBeTruthy();

    expect(Object.keys(dict["id1-1-id2-1"]).length).toBe(3);
    expect(Object.keys(dict["id1-2-id2-2"]).length).toBe(3);
    expect(Object.keys(dict["id1-3-id2-3"]).length).toBe(3);

    expect(dict["id1-1-id2-1"].value).toBe("value-1");
    expect(dict["id1-2-id2-2"].value).toBe("value-2");
    expect(dict["id1-3-id2-3"].value).toBe("value-3");
  });
});

describe("createDictionaryMultiple function should", () => {
  it("generate dictionaries ok", () => {
    interface IDummy {
      id1: string;
      id2: string;
      value: string;
    }
    const arr: IDummy[] = [
      { id1: "id1-1", id2: "id2-1", value: "value-1" },
      { id1: "id1-1", id2: "id2-1", value: "value-2" },
      { id1: "id1-3", id2: "id2-3", value: "value-3" },
    ];

    const dict = createDictionaryMultiple<IDummy, string>(
      arr,
      (d) => `${d.id1}-${d.id2}`
    );

    expect(Object.keys(dict).length).toBe(2);

    expect(dict["id1-1-id2-1"]).toBeTruthy();
    expect(dict["id1-2-id2-2"]).toBeFalsy();
    expect(dict["id1-3-id2-3"]).toBeTruthy();

    expect(dict["id1-1-id2-1"].length).toBe(2);
    expect(dict["id1-3-id2-3"].length).toBe(1);

    expect(dict["id1-1-id2-1"][0].value).toBe("value-1");
    expect(dict["id1-1-id2-1"][1].value).toBe("value-2");
    expect(dict["id1-3-id2-3"][0].value).toBe("value-3");
  });
});
