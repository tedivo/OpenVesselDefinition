import { stafFileStringProcessed } from "../mocks/stafFileString";
import mapStafSections from "./mapStafSections";

describe("Test mapStafSections", () => {
  it("should find all the sections, headers and data", () => {
    const sectionsByName = mapStafSections(stafFileStringProcessed);
    const sectionNames = Object.keys(sectionsByName);

    expect(sectionNames).toEqual(["SECTION1", "SECTION2"]);

    // console.log(sectionsByName);
  });
});
