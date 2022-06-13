import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import stafLidString from "../mocks/stafLidString";
import LidConfig from "../sections/LidConfig";
import convertStafObjectToShipOpenSpec from "./convertStafObjectToShipOpenSpec";
import getSectionsFromFileContent from "./getSectionsFromFileContent";
import mapStafSections from "./mapStafSections";
import transformLids from "./transformLids";

describe("transformLids should...", () => {
  it("work ok", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafLidString)
    );
    const lidSection = sectionsByName["LID"];

    const processed = convertStafObjectToShipOpenSpec<ILidDataFromStaf>(
      lidSection,
      LidConfig
    );

    const transformed = transformLids(processed);

    expect(lidSection.length).toBe(20);
    expect(transformed.length).toBe(10);
  });
});
