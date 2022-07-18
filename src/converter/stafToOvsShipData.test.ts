import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../models/base/enums/ValuesSourceEnum";

import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import LcgReferenceEnum from "../models/base/enums/LcgReferenceEnum";
import { LengthUnitsEnum } from "../models/base/enums/UnitsEnum";
import PortStarboardEnum from "../models/base/enums/PortStarboardEnum";
import PositionFormatEnum from "../models/base/enums/PositionFormatEnum";
import fs from "fs";
import path from "path";
import stafHeaderString from "./mocks/stafHeaderString";
import stafToOvsShipData from "./stafToOvsShipData";

let stafFileContent: string;

describe("stafToShipInfoSpecConverter should...", () => {
  beforeAll(() => {
    stafFileContent = fs.readFileSync(
      path.resolve("./src/converter/mocks/OOL.OBEI.OOCL BEIJING_STAFF2.txt"),
      "utf8"
    );
  });

  it("make conversion of shipData correctly", () => {
    const shipData = stafToOvsShipData(stafFileContent);

    expect(shipData.shipName).toBe("OBEI");
    expect(shipData.positionFormat).toBe(PositionFormatEnum.BAY_STACK_TIER);

    expect(shipData.lcgOptions).toBeDefined();
    expect(shipData.lcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(shipData.lcgOptions.reference).toBe(
      LcgReferenceEnum.AFT_PERPENDICULAR
    );
    expect(shipData.lcgOptions.orientationIncrease).toBe(ForeAftEnum.FWD);

    expect(shipData.vcgOptions).toBeDefined();
    expect(shipData.vcgOptions.values).toBe(ValuesSourceStackTierEnum.BY_TIER);

    expect(shipData.tcgOptions).toBeDefined();
    expect(shipData.tcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(shipData.tcgOptions.direction).toBe(PortStarboardEnum.STARBOARD);
  });

  it("test with mocked data of header", () => {
    const shipData = stafToOvsShipData(stafHeaderString);

    expect(shipData.shipName).toBe("OAME");
    expect(shipData.positionFormat).toBe(PositionFormatEnum.BAY_STACK_TIER);
    expect(shipData.lcgOptions).toBeTruthy();
    expect(shipData.lcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(shipData.lcgOptions.reference).toBe(LcgReferenceEnum.MIDSHIPS);
    expect(shipData.lcgOptions.orientationIncrease).toBe(ForeAftEnum.AFT);
    expect(shipData.vcgOptions.values).toBe(ValuesSourceStackTierEnum.BY_TIER);
    expect(shipData.tcgOptions.values).toBe(ValuesSourceEnum.KNOWN);
    expect(shipData.tcgOptions.direction).toBe(PortStarboardEnum.STARBOARD);
  });
});
