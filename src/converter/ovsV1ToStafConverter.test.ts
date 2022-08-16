import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import fs from "fs";
import ovsV1ToStafConverter from "./ovsV1ToStafConverter";
import path from "path";

const json: IOpenShipSpecV1 = {
  schema: "OpenVesselSpec",
  version: "1.0.0",
  sizeSummary: {
    isoBays: 3,
    centerLineStack: 1,
    maxStack: 2,
    maxAboveTier: 84,
    minAboveTier: 80,
    maxBelowTier: 18,
    minBelowTier: 16,
  },
  positionLabels: {},
  shipData: {
    shipClass: "MYCLASS",
    containersLengths: [],
    lcgOptions: {
      values: 2,
      lpp: 200,
    },
    tcgOptions: {
      values: 1,
    },
    vcgOptions: {
      values: 1,
    },
    positionFormat: 1,
    metaInfo: {},
    masterCGs: {
      aboveTcgs: { "02": -3000, "00": 0, "01": 3000 },
      belowTcgs: { "02": -3500, "00": 500, "01": 3500 },
      bottomBases: {},
    },
  },
  baysData: [
    {
      isoBay: "001",
      level: 1,
      infoByContLength: {
        "20": {
          lcg: 120000,
          size: 20,
        },
      },
      pairedBay: 2,
      bulkhead: {
        fore: 0,
      },
      perSlotInfo: {
        "0282": {
          pos: "0282",
          sizes: {
            "20": 1,
          },
        },
        "0284": {
          pos: "0284",
          sizes: {
            "20": 1,
          },
          reefer: 1,
        },
        "0080": {
          pos: "0080",
          sizes: {
            "20": 1,
          },
        },
        "0082": {
          pos: "0082",
          sizes: {
            "20": 1,
          },
        },
        "0084": {
          pos: "0084",
          sizes: {
            "20": 1,
          },
        },
        "0182": {
          pos: "0182",
          sizes: {
            "20": 1,
          },
        },
        "0184": {
          pos: "0184",
          sizes: {
            "20": 1,
          },
          reefer: 1,
        },
      },
      centerLineStack: 1,
      perStackInfo: {
        each: {
          "02": {
            isoStack: "02",
            tcg: -3000,
          },
          "00": {
            isoStack: "00",
            bottomBase: 18500,
            tcg: 0,
            maxHeight: 8200,
          },
          "01": {
            isoStack: "01",
            tcg: 3000,
          },
        },
        common: {
          bottomBase: 21100,
          maxHeight: 5600,
        },
      },
    },
    {
      isoBay: "001",
      level: 2,
      infoByContLength: {
        "20": {
          lcg: 120000,
          size: 20,
        },
      },
      pairedBay: 2,
      bulkhead: {
        fore: 1,
        foreLcg: 123000,
      },
      perSlotInfo: {
        "0218": {
          pos: "0218",
          sizes: {
            "20": 1,
          },
          reefer: 1,
        },
        "0016": {
          pos: "0016",
          sizes: {
            "20": 1,
          },
        },
        "0018": {
          pos: "0018",
          sizes: {},
          restricted: 1,
        },
        "0118": {
          pos: "0118",
          sizes: {
            "20": 1,
          },
          reefer: 1,
        },
      },
      centerLineStack: 1,
      perStackInfo: {
        each: {
          "02": {
            isoStack: "02",
            tcg: -3500,
          },
          "00": {
            isoStack: "00",
            bottomBase: 11600,
            tcg: 500,
            maxHeight: 7000,
          },
          "01": {
            isoStack: "01",
            tcg: 3500,
          },
        },
        common: {
          bottomBase: 14200,
          maxHeight: 4500,
        },
      },
    },
    {
      isoBay: "003",
      level: 1,
      infoByContLength: {
        "20": {
          lcg: 113000,
          size: 20,
          stackWeight: 2000000,
        },
        "40": {
          lcg: 116500,
          size: 40,
          stackWeight: 2100000,
        },
      },
      pairedBay: 1,
      doors: 2,
      bulkhead: {
        fore: 0,
      },
      perSlotInfo: {
        "0282": {
          pos: "0282",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0284": {
          pos: "0284",
          sizes: {
            "20": 1,
            "40": 1,
          },
          reefer: 1,
        },
        "0080": {
          pos: "0080",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0082": {
          pos: "0082",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0084": {
          pos: "0084",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0182": {
          pos: "0182",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0184": {
          pos: "0184",
          sizes: {
            "20": 1,
            "40": 1,
          },
          reefer: 1,
        },
      },
      centerLineStack: 1,
      perStackInfo: {
        each: {
          "02": {
            isoStack: "02",
            tcg: -3000,
          },
          "00": {
            isoStack: "00",
            bottomBase: 18500,
            tcg: 0,
            stackInfoByLength: {
              "20": {
                lcg: 115500,
                size: 20,
                stackWeight: 1250000,
              },
              "40": {
                lcg: 110500,
                size: 40,
                stackWeight: 2250000,
              },
            },
            maxHeight: 8200,
          },
          "01": {
            isoStack: "01",
            tcg: 3000,
          },
        },
        common: {
          bottomBase: 21100,
          maxHeight: 5500,
        },
      },
    },
    {
      isoBay: "003",
      level: 2,
      infoByContLength: {
        "20": {
          lcg: 113000,
          size: 20,
          stackWeight: 2000000,
        },
        "40": {
          lcg: 116500,
          size: 40,
          stackWeight: 2100000,
        },
      },
      pairedBay: 1,
      doors: 2,
      bulkhead: {
        fore: 0,
      },
      perSlotInfo: {
        "0218": {
          pos: "0218",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0016": {
          pos: "0016",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0018": {
          pos: "0018",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
        "0118": {
          pos: "0118",
          sizes: {
            "20": 1,
            "40": 1,
          },
        },
      },
      centerLineStack: 1,
      perStackInfo: {
        each: {
          "02": {
            isoStack: "02",
            tcg: -3500,
          },
          "00": {
            isoStack: "00",
            bottomBase: 11600,
            tcg: 500,
            maxHeight: 7000,
          },
          "01": {
            isoStack: "01",
            tcg: 3500,
          },
        },
        common: {
          bottomBase: 14200,
          maxHeight: 5200,
        },
      },
    },
  ],
  lidData: [
    {
      label: "1A02",
      portIsoStack: "02",
      starboardIsoStack: "02",
      startIsoBay: "001",
      endIsoBay: "001",
    },
    {
      label: "1A00",
      portIsoStack: "00",
      starboardIsoStack: "00",
      startIsoBay: "001",
      endIsoBay: "001",
      overlapPort: 1,
      overlapStarboard: 1,
    },
    {
      label: "1A01",
      portIsoStack: "01",
      starboardIsoStack: "01",
      startIsoBay: "001",
      endIsoBay: "001",
    },

    {
      label: "3A02",
      portIsoStack: "02",
      starboardIsoStack: "02",
      startIsoBay: "003",
      endIsoBay: "003",
      overlapStarboard: 1,
    },
    {
      label: "3A00",
      portIsoStack: "00",
      starboardIsoStack: "00",
      startIsoBay: "003",
      endIsoBay: "003",
    },
    {
      label: "3A01",
      portIsoStack: "01",
      starboardIsoStack: "01",
      startIsoBay: "003",
      endIsoBay: "003",
      overlapPort: 1,
    },
  ],
};

describe("ovsV1ToStafConverter should...", () => {
  it("works ok", () => {
    const processed = ovsV1ToStafConverter(json);

    fs.writeFileSync(path.resolve("./examples/dummyStaf.txt"), processed);
  });
});
