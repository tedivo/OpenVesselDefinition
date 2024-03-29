import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import LidConfig from "../sections/stafToOvd/LidConfig";
import convertStafObjectToOpenVesselDefinition from "./convertStafObjectToOpenVesselDefinition";
import getSectionsFromFileContent from "./getSectionsFromFileContent";
import mapStafSections from "./mapStafSections";
import stafLidString from "../mocks/stafLidString";
import transformLids from "./transformLids";

describe("transformLids should...", () => {
  it("work ok", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafLidString)
    );
    const lidSection = sectionsByName["LID"];

    const processed = convertStafObjectToOpenVesselDefinition<ILidDataFromStaf>(
      lidSection,
      LidConfig
    );

    const transformed = transformLids(processed);

    expect(lidSection.length).toBe(20);
    expect(transformed.length).toBe(10);
  });
});
