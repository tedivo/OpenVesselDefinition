import { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
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

  it("joins a lid FWD and AFT across a 3-bay chain into a single startIsoBay/endIsoBay range", () => {
    // isoBay is ordered and odd-only: FWD always points to a smaller bay, AFT always
    // to a larger one. "A" (bay 001) and "B" (bay 005) are standalone lids at the
    // chain's ends. "C" (bay 003, the middle bay) joins FWD to "A" and AFT to "B", so
    // the three per-bay STAF records should collapse into one lid spanning 001-005.
    const testLids: ILidDataFromStaf[] = [
      {
        isoBay: "001",
        level: BayLevelEnum.BELOW,
        label: "A",
        portIsoRow: "08",
        starboardIsoRow: "04",
      },
      {
        isoBay: "003",
        level: BayLevelEnum.BELOW,
        label: "C",
        portIsoRow: "08",
        starboardIsoRow: "04",
        joinLidFwdLabel: "A",
        joinLidAftLabel: "B",
      },
      {
        isoBay: "005",
        level: BayLevelEnum.BELOW,
        label: "B",
        portIsoRow: "08",
        starboardIsoRow: "04",
      },
    ];

    const transformed = transformLids(testLids);
    const lidC = transformed.find((lid) => lid.label === "C");

    expect(lidC).toBeDefined();
    expect(lidC?.startIsoBay).toBe("001");
    expect(lidC?.endIsoBay).toBe("005");
  });
});
