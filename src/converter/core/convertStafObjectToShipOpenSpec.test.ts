import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../models/base/enums/PortStarboardEnum";
import PositionFormatEnum from "../../models/base/enums/PositionFormatEnum";
import { LengthUnitsEnum } from "../../models/base/enums/UnitsEnum";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import ILidData from "../../models/v1/parts/ILidData";
import IShipData from "../../models/v1/parts/IShipData";
import ISlotData from "../../models/v1/parts/ISlotData";
import convertStafObjectToShipOpenSpec from "../core/convertStafObjectToShipOpenSpec";
import getSectionsFromFileContent from "../core/getSectionsFromFileContent";
import mapStafSections from "../core/mapStafSections";
import stafBayLevelString from "../mocks/stafBayLevelString";
import stafHeaderString from "../mocks/stafHeaderString";
import stafLidString from "../mocks/stafLidString";
import stafSlotString from "../mocks/stafSlotString";
import stafStackString from "../mocks/stafStackString";
import stafTierString from "../mocks/stafTierString";
import ISectionMapConfig from "../models/ISectionMapConfig";
import IStackStafData from "../models/IStackStafData";
import ITierStafData from "../models/ITierStafData";
import BayLevelConfig from "../sections/BayLevelConfig";
import LidConfig from "../sections/LidConfig";
import ShipConfig from "../sections/ShipConfig";
import SlotConfig from "../sections/SlotConfig";
import StackConfig from "../sections/StackConfig";
import TierConfig from "../sections/TierConfig";

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
      VAR1: { target: "var1", passValue: true, dashIsEmpty: true },
      VAR2: { target: "moreVars.var2", passValue: true, dashIsEmpty: true },
      VAR3: { target: "moreVars.var3", passValue: true, dashIsEmpty: true },
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
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafHeaderString)
    );

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

describe("for STAF_BAY data", () => {
  it("work ok with mocked data of bays", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafBayLevelString)
    );

    const headerSection = sectionsByName["SECTION"];

    const processed = convertStafObjectToShipOpenSpec<IBayLevelData>(
      headerSection,
      BayLevelConfig
    );

    expect(processed.length).toBe(4);
    const [row1, row2, row3, row4] = processed;

    expect(row1.isoBay).toBe("001");
    expect(row1.level).toBe(BayLevelEnum.BELOW);
    expect(row1.label20).toBe("label 20 001B");
    expect(row1.label40).toBe("label 40 001B");
    expect(row1.maxHeight).toBe(10.51);
    expect(row1.bulkhead.fore).toBe(1);
    expect(row1.bulkhead.foreLcg).toBe(-117.4);
    expect(row1.stackInfoByLength[20].lcg).toBe(-114.11);
    expect(row1.stackInfoByLength[20].stackWeight).toBe(96);

    expect(row2.isoBay).toBe("001");
    expect(row2.level).toBe(BayLevelEnum.ABOVE);
    expect(row2.maxHeight).toBe(13.1);
    expect(row2.pairedBay).toBe(ForeAftEnum.AFT);

    expect(row3.isoBay).toBe("003");
    expect(row3.level).toBe(BayLevelEnum.BELOW);

    expect(row4.isoBay).toBe("003");
    expect(row4.level).toBe(BayLevelEnum.ABOVE);
    expect(row4.stackInfoByLength[20].lcg).toBe(-106.77);
    expect(row4.stackInfoByLength[40].lcg).toBe(-108.69);
    expect(row4.stackInfoByLength[45].lcg).toBe(-108.69);
    expect(row4.stackInfoByLength[20].stackWeight).toBe(70);
    expect(row4.stackInfoByLength[40].stackWeight).toBe(120);
    expect(row4.stackInfoByLength[45].stackWeight).toBe(120);
  });
});

describe("for STACK data", () => {
  it("work ok with mocked data of stacks", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafStackString)
    );

    const headerSection = sectionsByName["STACK"];

    const processed = convertStafObjectToShipOpenSpec<IStackStafData>(
      headerSection,
      StackConfig
    );

    expect(processed.length).toBe(30);
    const row1 = processed[0];

    expect(row1.isoBay).toBe("001");
    expect(row1.level).toBe(BayLevelEnum.BELOW);
    expect(row1.isoStack).toBe("01");
    expect(row1.topIsoTier).toBe("18");
    expect(row1.bottomIsoTier).toBe("12");
    expect(row1.tcg).toBe(1.28);
    expect(row1.stackInfoByLength[20]).toBeTruthy();
    expect(row1.stackInfoByLength[20].size).toBe(20);
    expect(row1.stackInfoByLength[20].acceptsSize).toBe(1);
    expect(row1.stackInfoByLength[24]).toBeFalsy();
    expect(row1.stackInfoByLength[40]).toBeFalsy();
    expect(row1.stackInfoByLength[45]).toBeFalsy();
    expect(row1.stackInfoByLength[48]).toBeFalsy();

    const row27 = processed[27];
    expect(row27.isoBay).toBe("003");
    expect(row27.level).toBe(BayLevelEnum.ABOVE);
    expect(row27.isoStack).toBe("10");
    expect(row27.topIsoTier).toBe("90");
    expect(row27.bottomIsoTier).toBe("82");
    expect(row27.tcg).toBe(-11.38);
    expect(row27.stackInfoByLength[20]).toBeTruthy();
    expect(row27.stackInfoByLength[20].size).toBe(20);
    expect(row27.stackInfoByLength[20].acceptsSize).toBe(1);
    expect(row27.stackInfoByLength[24]).toBeFalsy();
    expect(row27.stackInfoByLength[40]).toBeTruthy();
    expect(row27.stackInfoByLength[45]).toBeTruthy();
    expect(row27.stackInfoByLength[48]).toBeFalsy();
  });
});

describe("for TIER data", () => {
  it("work ok with mocked data of tiers", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafTierString)
    );

    const headerSection = sectionsByName["TIER"];

    const processed = convertStafObjectToShipOpenSpec<ITierStafData>(
      headerSection,
      TierConfig
    );

    expect(processed.length).toBe(15);
    const row1 = processed[0];

    expect(row1.isoBay).toBe("001");
    expect(row1.level).toBe(BayLevelEnum.BELOW);
    expect(row1.label).toBe("");
    expect(row1.isoTier).toBe("12");
    expect(row1.vcg).toBe(16.58);

    const row2 = processed[1];

    expect(row2.isoBay).toBe("001");
    expect(row2.level).toBe(BayLevelEnum.BELOW);
    expect(row2.label).toBe("");
    expect(row2.isoTier).toBe("14");
    expect(row2.vcg).toBe(19.17);

    const row14 = processed[14];

    expect(row14.isoBay).toBe("003");
    expect(row14.level).toBe(BayLevelEnum.ABOVE);
    expect(row14.label).toBe("");
    expect(row14.isoTier).toBe("82");
    expect(row14.vcg).toBe(28.13);
  });
});

describe("for SLOT data", () => {
  it("work ok with mocked data of slots", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafSlotString)
    );

    const headerSection = sectionsByName["SLOT"];

    const processed = convertStafObjectToShipOpenSpec<ISlotData>(
      headerSection,
      SlotConfig
    );

    expect(processed.length).toBe(23);
    const row1 = processed[0];
    const row2 = processed[1];
    const row23 = processed[22];

    expect(row1.position).toBe("0190692");
    expect(row1.sizes[20]).toBe(1);
    expect(row1.sizes[40]).toBe(1);
    expect(row1.sizes[45]).toBe(1);
    expect(row1.sizes[24]).toBe(0);
    expect(row1.sizes[48]).toBe(0);
    expect(row1.reefer).toBe(0);

    expect(row2.sizes[20]).toBe(1);
    expect(row2.position).toBe("0190782");
    expect(row2.sizes[40]).toBe(1);
    expect(row2.sizes[45]).toBe(0);
    expect(row2.sizes[24]).toBe(0);
    expect(row2.sizes[48]).toBe(0);
    expect(row2.reefer).toBe(1);

    expect(row23.position).toBe("0191088");
    expect(row23.sizes[20]).toBe(1);
    expect(row23.sizes[40]).toBe(1);
    expect(row23.sizes[45]).toBe(1);
    expect(row23.sizes[24]).toBe(0);
    expect(row23.sizes[48]).toBe(0);
    expect(row23.reefer).toBe(0);
  });
});

describe("for LID data", () => {
  it("work ok with mocked data of lids (hatch covers)", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafLidString)
    );

    const headerSection = sectionsByName["LID"];

    const processed = convertStafObjectToShipOpenSpec<ILidData>(
      headerSection,
      LidConfig
    );

    expect(processed.length).toBe(20);
    const row1 = processed[0];
    const row2 = processed[1];
    const row7 = processed[6];

    expect(row1.label).toBe("01B1");
    expect(row1.isoBay).toBe("001");
    expect(row1.level).toBe(BayLevelEnum.BELOW);
    expect(row1.portIsoStack).toBe("08");
    expect(row1.starboardIsoStack).toBe("04");
    expect(row1.joinLidFwdLabel).toBe("");
    expect(row1.joinLidAftLabel).toBe("03B1");
    expect(row1.overlapPort).toBe("");
    expect(row1.overlapStarboard).toBe("");

    expect(row2.label).toBe("XXXX");
    expect(row2.isoBay).toBe("001");
    expect(row2.level).toBe(BayLevelEnum.BELOW);
    expect(row2.portIsoStack).toBe("02");
    expect(row2.starboardIsoStack).toBe("01");
    expect(row2.joinLidFwdLabel).toBe("");
    expect(row2.joinLidAftLabel).toBe("");
    expect(row2.overlapPort).toBe("");
    expect(row2.overlapStarboard).toBe("");

    expect(row7.label).toBe("03B1");
    expect(row7.isoBay).toBe("003");
    expect(row7.level).toBe(BayLevelEnum.BELOW);
    expect(row7.portIsoStack).toBe("08");
    expect(row7.starboardIsoStack).toBe("04");
    expect(row7.joinLidFwdLabel).toBe("01B1");
    expect(row7.joinLidAftLabel).toBe("");
    expect(row7.overlapPort).toBe("");
    expect(row7.overlapStarboard).toBe("");
  });
});
