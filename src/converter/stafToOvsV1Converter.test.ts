import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../models/base/enums/ValuesSourceEnum";

import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import LcgReferenceEnum from "../models/base/enums/LcgReferenceEnum";
import { LengthUnitsEnum } from "../models/base/enums/UnitsEnum";
import PortStarboardEnum from "../models/base/enums/PortStarboardEnum";
import PositionFormatEnum from "../models/base/enums/PositionFormatEnum";
import fs from "fs";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import mapStafSections from "./core/mapStafSections";
import path from "path";
import stafToOvsV1Converter from "./stafToOvsV1Converter";

let stafFileContent: string;

const sectionsExpected: Array<[string, number]> = [
  ["SHIP", 1],
  ["SECTION", 77],
  ["STACK", 1191],
  ["TIER", 602],
  ["SLOT", 2543],
  ["LID", 296],
  ["END", 0],
];

describe("Test Data is as expected...", () => {
  beforeAll(() => {
    stafFileContent = fs.readFileSync(
      path.resolve("./src/converter/mocks/OOL.OBEI.OOCL BEIJING_STAFF2.txt"),
      "utf8"
    );
  });

  it("should find all the sections", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafFileContent)
    );

    const sectionsFound = Object.keys(sectionsByName);
    sectionsExpected.forEach(([name]) => {
      expect(sectionsFound.indexOf(name) >= 0);
    });
  });

  it("should find all the rows in each section", () => {
    const sectionsByName = mapStafSections(
      getSectionsFromFileContent(stafFileContent)
    );

    sectionsExpected.forEach((s) => {
      const [name, num] = s;
      expect(sectionsByName[name].length).toBe(num);
    });
  });
});

describe("stafToOvsV1Converter should...", () => {
  beforeAll(() => {
    stafFileContent = fs.readFileSync(
      path.resolve("./src/converter/mocks/OOL.OBEI.OOCL BEIJING_STAFF2.txt"),
      "utf8"
    );
  });

  it("make conversion of shipData correctly", () => {
    const converted = stafToOvsV1Converter(stafFileContent, 0);
    const shipData = converted.shipData;

    expect(shipData.shipName).toBe("OBEI");
    expect(shipData.positionFormat).toBe(PositionFormatEnum.BAY_STACK_TIER);

    expect(shipData.fileUnits).toBeDefined();
    expect(shipData.fileUnits.lengthUnits).toBe(LengthUnitsEnum.METRIC);

    expect(shipData.lcgOptions).toBeDefined();
    expect(shipData.lcgOptions.values).toBe(ValuesSourceEnum.KNOWN);

    expect(shipData.vcgOptions).toBeDefined();
    expect(shipData.vcgOptions.values).toBe(ValuesSourceEnum.KNOWN);

    expect(shipData.tcgOptions).toBeDefined();
    expect(shipData.tcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
  });

  it("make conversion of bays correctly", () => {
    const converted = stafToOvsV1Converter(stafFileContent, 0);
    expect(converted.baysData.length).toBe(sectionsExpected[1][1]);
  });

  it("make conversion of perStack correctly", () => {
    const perStackInfoKeysLenght = {
      "001-2": 9,
      "001-1": 11,
      "003-2": 9,
      "003-1": 13,
      "005-2": 11,
      "005-1": 15,
      "007-2": 11,
      "007-1": 15,
      "009-2": 13,
      "009-1": 15,
      "011-2": 13,
      "011-1": 15,
      "013-2": 15,
      "013-1": 17,
      "015-2": 15,
      "015-1": 17,
      "017-2": 15,
      "017-1": 17,
      "019-2": 15,
      "019-1": 17,
      "021-2": 15,
      "021-1": 17,
      "023-2": 15,
      "023-1": 17,
      "025-2": 15,
      "025-1": 17,
      "027-2": 15,
      "027-1": 17,
      "029-2": 15,
      "029-1": 17,
      "031-2": 15,
      "031-1": 17,
      "033-2": 15,
      "033-1": 17,
      "035-2": 15,
      "035-1": 17,
      "037-2": 15,
      "037-1": 17,
      "039-2": 15,
      "039-1": 17,
      "041-2": 15,
      "041-1": 17,
      "043-2": 15,
      "043-1": 17,
      "045-2": 15,
      "045-1": 17,
      "047-2": 15,
      "047-1": 17,
      "049-2": 15,
      "049-1": 17,
      "051-2": 15,
      "051-1": 17,
      "053-2": 15,
      "053-1": 17,
      "055-2": 15,
      "055-1": 17,
      "057-2": 15,
      "057-1": 17,
      "059-2": 15,
      "059-1": 17,
      "061-2": 15,
      "061-1": 17,
      "063-2": 15,
      "063-1": 17,
      "065-2": 15,
      "065-1": 17,
      "067-2": 15,
      "067-1": 17,
      "069-2": 15,
      "069-1": 17,
      "071-2": 15,
      "071-1": 17,
      "073-2": 15,
      "073-1": 17,
      "075-2": 15,
      "075-1": 17,
      "079-1": 17,
    };
    const converted = stafToOvsV1Converter(stafFileContent, 0);

    let totalStacks = 0;
    const blDict = converted.baysData
      .map((b) => ({
        bay: b.isoBay,
        level: b.level,
        perStackInfoLength: Object.keys(b.perStackInfo).length,
      }))
      .reduce((acc, v) => {
        totalStacks += v.perStackInfoLength;
        acc[`${v.bay}-${v.level}`] = v.perStackInfoLength;
        return acc;
      }, {});

    Object.keys(blDict).forEach((k) => {
      expect(blDict[k]).toBe(perStackInfoKeysLenght[k]);
    });

    expect(totalStacks).toBe(sectionsExpected[2][1]);
  });

  it("creates sizeSummary correctly", () => {
    const converted = stafToOvsV1Converter(stafFileContent, 0);
    const summary = converted.sizeSummary;

    expect(summary.centerLineStack).toBe(1);
    expect(summary.maxStack).toBe("16");
    expect(summary.maxAboveTier).toBe("98");
    expect(summary.minAboveTier).toBe("82");
    expect(summary.maxBelowTier).toBe("18");
    expect(summary.minBelowTier).toBe("02");
  });

  it.skip("just convert", () => {
    const mockedFiles: [string, string, number][] = [
      [
        "./src/converter/mocks/OOL.OBEI.OOCL BEIJING_STAFF2.txt",
        "./examples/OOL.OBEI.OOCL BEIJING_OPENSHIPSPEC.json",
        320,
      ],
      [
        "./src/converter/mocks/OOL.OASI.OOCL ASIA_STAF.txt",
        "./examples//OOL.OASI.OOCL ASIA_OPENSHIPSPEC.json",
        308,
      ],
    ];

    mockedFiles.forEach(([inputFileName, outputFileName, blp]) => {
      const converted = stafToOvsV1Converter(
        fs.readFileSync(path.resolve(inputFileName), "utf8"),
        blp
      );
      fs.writeFileSync(
        path.resolve(outputFileName),
        JSON.stringify(converted, null, 2)
      );
    });
  });
});
