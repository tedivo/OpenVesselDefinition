import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../models/v1/parts/IBayLevelData";
import ILidData, { ILidDataFromStaf } from "../../models/v1/parts/ILidData";
import IShipData, { IShipDataFromStaf } from "../../models/v1/parts/IShipData";
import convertOvsToStafObject, {
  getNestedValue,
} from "../core/convertOvsToStafObject";

import BayLevelConfig from "../sections/ovsToStaf/BayLevelConfig";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import ISectionMapToStafConfig from "../types/ISectionMapToStafConfig";
import LidConfig from "../sections/ovsToStaf/LidConfig";
import PositionFormatEnum from "../../models/base/enums/PositionFormatEnum";
import ShipConfig from "../sections/ovsToStaf/ShipConfig";
import { TContainerLengths } from "../../models/v1/parts/Types";
import ValuesSourceEnum from "../../models/base/enums/ValuesSourceEnum";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";

interface IDummy {
  var1: string;
  moreVars: {
    var2: string;
    var3: string;
    varX: {
      varY: string;
    };
  };
  var4: number;
  var5: number;
  var6: number | undefined;
}

const dummyData: IDummy = {
  var1: "AAA",
  moreVars: {
    var2: "BBB",
    var3: "CCC",
    varX: {
      varY: "YYY",
    },
  },
  var4: 1,
  var5: 0,
  var6: undefined,
};

describe("getNestedValue should...", () => {
  it("work ok", () => {
    expect(getNestedValue<IDummy>(dummyData, "var1")).toBe("AAA");
    expect(getNestedValue<IDummy>(dummyData, "moreVars.var2")).toBe("BBB");
    expect(getNestedValue<IDummy>(dummyData, "moreVars.var3")).toBe("CCC");
    expect(getNestedValue<IDummy>(dummyData, "moreVars.varX.varY")).toBe("YYY");
    expect(getNestedValue<IDummy>(dummyData, "var4")).toBe(1);
    expect(getNestedValue<IDummy>(dummyData, "var5")).toBe(0);
    expect(getNestedValue<IDummy>(dummyData, "var6")).toBeUndefined();
  });
});

describe("convertOvsToStafObject should", () => {
  const sectionConfig: ISectionMapToStafConfig<IDummy, IDummy> = {
    stafSection: "DUMMY",
    mapVars: [
      { stafVar: "VAR1", source: "var1", passValue: true },
      {
        stafVar: "VAR2",
        source: "moreVars.var2",
        passValue: true,
      },
      {
        stafVar: "VAR3",
        source: "moreVars.var3",
        passValue: true,
      },
      { stafVar: "VAR4", source: "var4", mapper: (s) => (s ? "Y" : "N") },
      {
        stafVar: "VAR5",
        source: "var5",
        mapper: (s) => (Number(s) + 1000).toString(),
      },
      {
        stafVar: "VAR6",
        source: "var6",
        passValue: true,
      },
      {
        stafVar: "VAR FIXED",
        fixedValue: "METRIC",
      },
    ],
  };

  it("applies the mappers correctly", () => {
    const processed = convertOvsToStafObject<IDummy, IDummy>(
      [dummyData],
      sectionConfig
    );

    const expectedRes =
      "*DUMMY\n**VAR1\tVAR2\tVAR3\tVAR4\tVAR5\tVAR6\tVAR FIXED\nAAA\tBBB\tCCC\tY\t1000\t-\tMETRIC";

    expect(processed).toBe(expectedRes);
  });
});

describe("for SHIP data", () => {
  it("work ok with mocked data of header", () => {
    const shipData: IShipData = {
      shipClass: "MY CLASS",
      containersLengths: [],
      lcgOptions: { values: ValuesSourceEnum.KNOWN, lpp: 200 },
      tcgOptions: { values: ValuesSourceEnum.ESTIMATED },
      vcgOptions: { values: ValuesSourceEnum.ESTIMATED },
      positionFormat: PositionFormatEnum.BAY_STACK_TIER,
      metaInfo: {},
      masterCGs: { aboveTcgs: {}, belowTcgs: {}, bottomBases: {} },
    };

    const processed = convertOvsToStafObject<IShipData, IShipDataFromStaf>(
      [shipData],
      ShipConfig
    );

    const expectedRes =
      "*SHIP\n**CLASS\tUNITS\tLCG IN USE\tLCG REF PT\tLCG + DIR\tVCG IN USE\tTCG IN USE\tTCG + DIR\tPOSITION FORMAT\nMY CLASS\tMETRIC\tY\tAP\tF\tSTACK\tN\tSTBD\tBAY-STACK-TIER";

    expect(processed).toBe(expectedRes);
  });
});

describe("for STAF_BAY data", () => {
  it("work ok with mocked data of bays", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      3,
      ["0282", "0082", "0182", "0284", "0084", "0184"],
      ["0218", "0018", "0118", "0016"]
    );

    const [b001Above, b001Below, b003Above, b003Below] = bayLevelData;

    // Check that MOCKED data is ok, to be sure further data modifications are correct
    expect(b001Above.isoBay).toBe("001");
    expect(b001Above.level).toBe(BayLevelEnum.ABOVE);
    expect(b001Below.isoBay).toBe("001");
    expect(b001Below.level).toBe(BayLevelEnum.BELOW);
    expect(b003Above.isoBay).toBe("003");
    expect(b003Above.level).toBe(BayLevelEnum.ABOVE);
    expect(b003Below.isoBay).toBe("003");
    expect(b003Below.level).toBe(BayLevelEnum.BELOW);

    // Modify data to check it in the result
    b001Above.label20 = "001-Label-20-A";
    b001Below.label20 = "001-Label-20-B";
    b001Above.label40 = "001-Label-40-A";
    b001Below.label40 = "001-Label-40-B";

    b003Above.infoByContLength = {
      20: { lcg: 100000, size: 20, stackWeight: 2000000 },
      40: { lcg: 110000, size: 40, stackWeight: 2100000 },
      45: { lcg: 111000, size: 45, stackWeight: 2200000 },
      48: { lcg: 112000, size: 48, stackWeight: 2300000 },
      53: { lcg: 113000, size: 53, stackWeight: 2400000 },
    };
    b003Below.infoByContLength = {
      20: { lcg: 100000, size: 20, stackWeight: 2100000 },
      24: { lcg: 99000, size: 24, stackWeight: 2900000 },
    };

    b001Above.pairedBay = ForeAftEnum.AFT;
    b001Below.pairedBay = ForeAftEnum.AFT;
    b003Above.pairedBay = ForeAftEnum.FWD;
    b003Below.pairedBay = ForeAftEnum.FWD;

    b003Above.doors = ForeAftEnum.AFT;
    b003Below.doors = ForeAftEnum.AFT;

    b001Above.athwartShip = 1;

    b001Below.bulkhead = { fore: 1, foreLcg: 119000 };

    b001Above.perStackInfo = {
      common: { maxHeight: 5000, bottomBase: 21000 },
    };
    b001Below.perStackInfo = {
      common: { maxHeight: 4500, bottomBase: 17000 },
    };

    b003Above.perStackInfo = {
      common: { maxHeight: 5500, bottomBase: 21000 },
    };
    b003Below.perStackInfo = {
      common: { maxHeight: 5200, bottomBase: 17000 },
    };

    const processed = convertOvsToStafObject<IBayLevelDataStaf, IBayLevelData>(
      bayLevelData,
      BayLevelConfig
    );

    const processedLines = processed.split("\n");
    expect(processedLines.length).toBe(6);
    expect(processedLines[0]).toBe("*SECTION");
    expect(processedLines[1]).toBe(
      "**STAF BAY\tLEVEL\t20 NAME\t40 NAME\tSL Hatch\tSL ForeAft\tLCG 20\tLCG 40\tLCG 45\tLCG 48\tSTACK WT 20\tSTACK WT 40\tSTACK WT 45\tSTACK WT 48\tMAX HEIGHT\tPAIRED BAY\tREEFER PLUGS\tDOORS\tATHWARTSHIPS\tBULKHEAD\tBULKHEAD LCG\tLCG 24\tSTACK WT 24"
    );
    expect(processedLines[2]).toBe(
      "001\tA\t001-Label-20-A\t001-Label-40-A\t-\t-\t-\t-\t-\t-\t-\t-\t-\t-\t5\tA\t-\t-\tY\tN\t-\t-\t-"
    );
    expect(processedLines[3]).toBe(
      "001\tB\t001-Label-20-B\t001-Label-40-B\t-\t-\t-\t-\t-\t-\t-\t-\t-\t-\t4.5\tA\t-\t-\tN\tY\t119\t-\t-"
    );
    expect(processedLines[4]).toBe(
      "003\tA\t-\t-\t-\t-\t100\t110\t111\t112\t2\t2.1\t2.2\t2.3\t5.5\tF\t-\tA\tN\tN\t-\t-\t-"
    );
    expect(processedLines[5]).toBe(
      "003\tB\t-\t-\t-\t-\t100\t-\t-\t-\t2.1\t-\t-\t-\t5.2\tF\t-\tA\tN\tN\t-\t99\t2.9"
    );
  });
});

// describe("for STACK data", () => {
//   it("work ok with mocked data of stacks", () => {
//     const sectionsByName = mapStafSections(
//       getSectionsFromFileContent(stafStackString)
//     );

//     const headerSection = sectionsByName["STACK"];

//     const processed = convertStafObjectToOpenVesselSpec<IStackStafData>(
//       headerSection,
//       StackConfig
//     );

//     expect(processed.length).toBe(30);
//     const row1 = processed[0];

//     expect(row1.isoBay).toBe("001");
//     expect(row1.level).toBe(BayLevelEnum.BELOW);
//     expect(row1.isoStack).toBe("01");
//     expect(row1.topIsoTier).toBe("18");
//     expect(row1.bottomIsoTier).toBe("12");
//     expect(row1.tcg).toBe(1280);
//     expect(row1.stackInfoByLength[20]).toBeTruthy();
//     expect(row1.stackInfoByLength[20].size).toBe(20);
//     expect(row1.stackInfoByLength[20].acceptsSize).toBe(1);
//     expect(row1.stackInfoByLength[24]).toBeFalsy();
//     expect(row1.stackInfoByLength[40]).toBeFalsy();
//     expect(row1.stackInfoByLength[45]).toBeFalsy();
//     expect(row1.stackInfoByLength[48]).toBeFalsy();

//     const row27 = processed[27];
//     expect(row27.isoBay).toBe("003");
//     expect(row27.level).toBe(BayLevelEnum.ABOVE);
//     expect(row27.isoStack).toBe("10");
//     expect(row27.topIsoTier).toBe("90");
//     expect(row27.bottomIsoTier).toBe("82");
//     expect(row27.tcg).toBe(-11380);
//     expect(row27.stackInfoByLength[20]).toBeTruthy();
//     expect(row27.stackInfoByLength[20].size).toBe(20);
//     expect(row27.stackInfoByLength[20].acceptsSize).toBe(1);
//     expect(row27.stackInfoByLength[24]).toBeFalsy();
//     expect(row27.stackInfoByLength[40]).toBeTruthy();
//     expect(row27.stackInfoByLength[45]).toBeTruthy();
//     expect(row27.stackInfoByLength[48]).toBeFalsy();
//   });
// });

// describe("for TIER data", () => {
//   it("work ok with mocked data of tiers", () => {
//     const sectionsByName = mapStafSections(
//       getSectionsFromFileContent(stafTierString)
//     );

//     const headerSection = sectionsByName["TIER"];

//     const processed = convertStafObjectToOpenVesselSpec<ITierStafData>(
//       headerSection,
//       TierConfig
//     );

//     expect(processed.length).toBe(15);
//     const row1 = processed[0];

//     expect(row1.isoBay).toBe("001");
//     expect(row1.level).toBe(BayLevelEnum.BELOW);
//     expect(row1.label).toBe("");
//     expect(row1.isoTier).toBe("12");
//     expect(row1.vcg).toBe(16580);

//     const row2 = processed[1];

//     expect(row2.isoBay).toBe("001");
//     expect(row2.level).toBe(BayLevelEnum.BELOW);
//     expect(row2.label).toBe("");
//     expect(row2.isoTier).toBe("14");
//     expect(row2.vcg).toBe(19170);

//     const row14 = processed[14];

//     expect(row14.isoBay).toBe("003");
//     expect(row14.level).toBe(BayLevelEnum.ABOVE);
//     expect(row14.label).toBe("");
//     expect(row14.isoTier).toBe("82");
//     expect(row14.vcg).toBe(28130);
//   });
// });

// describe("for SLOT data", () => {
//   it("work ok with mocked data of slots", () => {
//     const sectionsByName = mapStafSections(
//       getSectionsFromFileContent(stafSlotString)
//     );

//     const headerSection = sectionsByName["SLOT"];

//     const processed = convertStafObjectToOpenVesselSpec<ISlotData>(
//       headerSection,
//       SlotConfig
//     );

//     expect(processed.length).toBe(23);
//     const row1 = processed[0];
//     const row2 = processed[1];
//     const row23 = processed[22];

//     expect(row1.position).toBe("0190692");
//     expect(row1.sizes[20]).toBe(1);
//     expect(row1.sizes[40]).toBe(1);
//     expect(row1.sizes[45]).toBe(1);
//     expect(row1.sizes[24]).toBe(0);
//     expect(row1.sizes[48]).toBe(0);
//     expect(row1.reefer).toBe(0);

//     expect(row2.sizes[20]).toBe(1);
//     expect(row2.position).toBe("0190782");
//     expect(row2.sizes[40]).toBe(1);
//     expect(row2.sizes[45]).toBe(0);
//     expect(row2.sizes[24]).toBe(0);
//     expect(row2.sizes[48]).toBe(0);
//     expect(row2.reefer).toBe(1);

//     expect(row23.position).toBe("0191088");
//     expect(row23.sizes[20]).toBe(1);
//     expect(row23.sizes[40]).toBe(1);
//     expect(row23.sizes[45]).toBe(1);
//     expect(row23.sizes[24]).toBe(0);
//     expect(row23.sizes[48]).toBe(0);
//     expect(row23.reefer).toBe(0);
//   });
// });

describe("for LID data", () => {
  it("work ok with mocked data of lids (hatch covers)", () => {
    const lidData: ILidData[] = [
      {
        startIsoBay: "001",
        endIsoBay: "003",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "1A01",
      },
      {
        startIsoBay: "001",
        endIsoBay: "001",
        portIsoStack: "01",
        starboardIsoStack: "03",
        label: "1A02",
        overlapStarboard: 1,
      },
      {
        startIsoBay: "001",
        endIsoBay: "001",
        portIsoStack: "05",
        starboardIsoStack: "07",
        label: "1A03",
      },
      {
        startIsoBay: "003",
        endIsoBay: "003",
        portIsoStack: "05",
        starboardIsoStack: "07",
        label: "3A03",
        overlapPort: 1,
      },
      {
        startIsoBay: "003",
        endIsoBay: "007",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "3A04",
      },
    ];

    const expectedOutput: ILidDataFromStaf[] = [
      {
        isoBay: "001",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "D000",
        level: BayLevelEnum.ABOVE,
        joinLidAftLabel: "D001",
      },
      {
        isoBay: "003",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "D001",
        level: BayLevelEnum.ABOVE,
        joinLidFwdLabel: "D000",
      },
      {
        isoBay: "001",
        portIsoStack: "01",
        starboardIsoStack: "03",
        label: "1A02",
        level: BayLevelEnum.ABOVE,
        overlapStarboard: "Y",
      },
      {
        isoBay: "001",
        portIsoStack: "05",
        starboardIsoStack: "07",
        label: "1A03",
        level: BayLevelEnum.ABOVE,
      },
      {
        isoBay: "003",
        portIsoStack: "05",
        starboardIsoStack: "07",
        label: "3A03",
        level: BayLevelEnum.ABOVE,
        overlapPort: "Y",
      },
      {
        isoBay: "003",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "D002",
        joinLidAftLabel: "D003",
        level: BayLevelEnum.ABOVE,
      },
      {
        isoBay: "005",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "D003",
        joinLidFwdLabel: "D002",
        joinLidAftLabel: "D004",
        level: BayLevelEnum.ABOVE,
      },
      {
        isoBay: "007",
        portIsoStack: "06",
        starboardIsoStack: "00",
        label: "D004",
        joinLidFwdLabel: "D003",
        level: BayLevelEnum.ABOVE,
      },
    ];

    expect(lidData.length).toBe(5);

    // Test pre-processor
    const data = LidConfig.preProcessor(lidData);
    expect(data.length).toBe(8);
    expect(data).toEqual(expectedOutput);

    const processed = convertOvsToStafObject<
      ILidDataFromStaf,
      ILidDataFromStaf
    >(data, LidConfig);

    const processedLines = processed.split("\n");
    expect(processedLines.length).toBe(10);
    expect(processedLines[0]).toBe("*LID");
    expect(processedLines[1]).toBe(
      "**LID ID\tSTAF BAY\tLEVEL\tPORT ISO STACK\tSTBD ISO STACK\tJOIN LID FWD\tJOIN LID AFT\tOVERLAP PORT\tOVERLAP STBD"
    );
    expect(processedLines[2]).toBe("D000\t001\tA\t06\t00\t-\tD001\t-\t-");
    expect(processedLines[3]).toBe("D001\t003\tA\t06\t00\tD000\t-\t-\t-");
    expect(processedLines[4]).toBe("1A02\t001\tA\t01\t03\t-\t-\t-\tY");
    expect(processedLines[6]).toBe("3A03\t003\tA\t05\t07\t-\t-\tY\t-");
    expect(processedLines[7]).toBe("D002\t003\tA\t06\t00\t-\tD003\t-\t-");
    expect(processedLines[8]).toBe("D003\t005\tA\t06\t00\tD002\tD004\t-\t-");
    expect(processedLines[9]).toBe("D004\t007\tA\t06\t00\tD003\t-\t-\t-");
  });
});
