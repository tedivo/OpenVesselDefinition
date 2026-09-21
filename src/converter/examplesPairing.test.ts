import BayLevelEnum from "../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import IOpenVesselDefinitionV1 from "../models/v1/IOpenVesselDefinitionV1";
import detectBay40sLocation from "./core/bay40s/detectBay40sLocation";
import fs from "fs";
import { getPairedBays } from "./core/bay40s/getPairedBays";
import path from "path";

/**
 * This vessel opens with a lone 20' bay: 001 is unpaired and the first pair is
 * 003/005. Pairing has to come from what each bay declares, never from its
 * position in the list.
 */
describe("DMS.MSK.ADAMS-2-ovd.json", () => {
  let json: IOpenVesselDefinitionV1;

  beforeAll(() => {
    json = JSON.parse(
      fs.readFileSync(
        path.resolve("./examples/DMS.MSK.ADAMS-2-ovd.json"),
        "utf8",
      ),
    );
  });

  it("leaves the opening 20' bay unpaired and starts the pairs at 003", () => {
    const { pairs, unpaired } = getPairedBays(json.baysData);

    const above = pairs.filter((p) => p.level === BayLevelEnum.ABOVE);

    expect(above[0]).toEqual({
      level: BayLevelEnum.ABOVE,
      fwd: "003",
      aft: "005",
    });
    expect(above[1]).toEqual({
      level: BayLevelEnum.ABOVE,
      fwd: "007",
      aft: "009",
    });
    expect(
      unpaired.filter((u) => u.level === BayLevelEnum.ABOVE),
    ).toEqual([{ isoBay: "001", level: BayLevelEnum.ABOVE }]);

    // Every pair is two ISO bay numbers apart
    pairs.forEach((p) =>
      expect(Number(p.aft) - Number(p.fwd)).toBe(2),
    );
  });

  it("reads as a consistent FWD vessel", () => {
    const detected = detectBay40sLocation(json.baysData);

    expect(detected.bay40sLocation).toBe(ForeAftEnum.FWD);
    expect(detected.consistent).toBe(true);
    expect(detected.dissenting).toHaveLength(0);
    expect(detected.unpairedWith40s).toHaveLength(0);
  });
});
