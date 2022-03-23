import { stafFileStringProcessed } from "../mocks/stafFileString";
import mapStafSections from "./mapStafSections";

describe("Test mapStafSections", () => {
  it("should find all the sections, headers and data", () => {
    const sectionsByName = mapStafSections(stafFileStringProcessed);
    const sectionNames = Object.keys(sectionsByName);

    expect(sectionNames).toEqual(["SECTION1", "SECTION2"]);

    const section1Rows = sectionsByName["SECTION1"];
    expect(section1Rows.length).toBe(1);
    expect(section1Rows[0]["Header1a"]).toBe("data1");
    expect(section1Rows[0]["Header2a"]).toBe("data2");
    expect(section1Rows[0]["Header3a"]).toBe("data3");

    const section2Rows = sectionsByName["SECTION2"];
    expect(section2Rows.length).toBe(2);
    expect(section2Rows[0]["Header1b"]).toBe("data4");
    expect(section2Rows[0]["Header2b"]).toBe("data5");
    expect(section2Rows[0]["Header3b"]).toBe("data6");
    expect(section2Rows[1]["Header1b"]).toBe("data7");
    expect(section2Rows[1]["Header2b"]).toBe("data8");
    expect(section2Rows[1]["Header3b"]).toBe("data9");
  });
});
