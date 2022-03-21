import { LengthUnitsEnum } from "../../models/v1/enums/UnitsEnum";
import PositionFormatEnum from "../../models/v1/enums/PositionFormatEnum";
import IShipData from "../../models/v1/parts/IShipData";
import convertStafObjectToShipOpenSpec from "../core/convertStafObjectToShipOpenSpec";
import getSectionsFromFileContent from "../core/getSectionsFromFileContent";
import mapStafSections from "../core/mapStafSections";
import stafHeaderString from "../mocks/stafHeaderString";
import ISectionMapConfig from "../sections/ISectionMapConfig";
import ShipConfig from "../sections/ShipConfig";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/v1/enums/ValuesSourceEnum";
import LcgReferenceEnum from "../../models/v1/enums/LcgReferenceEnum";
import ForeAftEnum from "../../models/v1/enums/ForeAftEnum";
import PortStarboardEnum from "../../models/v1/enums/PortStarboardEnum";

describe("convertStafObjectToShipOpenSpec should", () => {
  interface IDummy {
    var1: string;
    moreVars: {
      var2: string;
      var3: string;
    };
    var4: number;
    var5: boolean;
  }

  const sectionArray = [
    { VAR1: "AAA", VAR2: "BBB", VAR3: "CCC", VAR4: "1", VAR5: "0" },
  ];

  const sectionConfig: ISectionMapConfig<IDummy> = {
    stafSection: "DUMMY",
    mapVars: {
      VAR1: { target: "var1", passValue: true },
      VAR2: { target: "moreVars.var2", passValue: true },
      VAR3: { target: "moreVars.var3", passValue: true },
      VAR4: { target: "var4", mapper: (s: string) => Number(s) },
      VAR5: { target: "var5", mapper: (s: string) => s !== "0" },
    },
  };

  it("applies the mappers correctly", () => {
    const processed = convertStafObjectToShipOpenSpec<IDummy>(
      sectionArray,
      sectionConfig
    );

    expect(processed.length).toBe(1);

    const firstObj = processed[0];

    expect(firstObj).toBeTruthy();
    expect(firstObj.var1).toBe("AAA");
    expect(firstObj.moreVars.var2).toBe("BBB");
    expect(firstObj.moreVars.var3).toBe("CCC");
    expect(firstObj.var4).toBe(1);
    expect(firstObj.var5).toBe(false);
  });
});

describe("for SHIP data", () => {
  it("work ok with mocked data of header", () => {
    const sections = getSectionsFromFileContent(stafHeaderString);
    const sectionsByName = mapStafSections(sections);

    const headerSection = sectionsByName["SHIP"];

    const processed = convertStafObjectToShipOpenSpec<IShipData>(
      headerSection,
      ShipConfig
    );

    const singleRow = processed[0];

    expect(singleRow.shipName).toBe("OAME");
    expect(singleRow.positionFormat).toBe(PositionFormatEnum.BAY_STACK_TIER);
    expect(singleRow.fileUnits.lengthUnits).toBe(LengthUnitsEnum.METRIC);
    expect(singleRow.lcgOptions).toBeTruthy();
    expect(singleRow.lcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(singleRow.lcgOptions.reference).toBe(LcgReferenceEnum.MIDSHIPS);
    expect(singleRow.lcgOptions.orientationIncrease).toBe(ForeAftEnum.AFT);
    expect(singleRow.vcgOptions.values).toBe(ValuesSourceStackTierEnum.BY_TIER);
    expect(singleRow.tcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(singleRow.tcgOptions.direction).toBe(PortStarboardEnum.STARBOARD);
  });
});
