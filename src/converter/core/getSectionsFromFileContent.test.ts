import { stafFileString } from "../mocks/stafFileString";
import getSectionsFromFileContent from "./getSectionsFromFileContent";

describe("Test getSectionsFromFileContent", () => {
  it("should find all the sections, headers and data", () => {
    const output = getSectionsFromFileContent(stafFileString);

    expect(output.length).toBe(2);
    expect(output[0].name).toBe("SECTION1");
    expect(output[0].headers).toEqual(["Header1a", "Header2a", "Header3a"]);
    expect(output[0].data).toEqual([["data1", "data2", "data3"]]);
    expect(output[1].name).toBe("SECTION2");
    expect(output[1].headers).toEqual(["Header1b", "Header2b", "Header3b"]);
    expect(output[1].data).toEqual([
      ["data4", "data5", "data6"],
      ["data7", "data8", "data9"],
    ]);
  });
});
