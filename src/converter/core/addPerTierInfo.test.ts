import {
  IIsoBayPattern,
  IJoinedStackTierPattern,
} from "../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import ITierStafData from "../types/ITierStafData";
import addPerTierInfo from "./addPerTierInfo";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedStackTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedStackTierPattern[] = ["0002", "0004"];

describe("addPerTierInfo should", () => {
  it("work ok with missing Tier Info", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    addPerTierInfo(
      bayLevelData,
      undefined as IObjectKeyArray<ITierStafData, string>
    );

    expect(bayLevelData).toBeDefined();
  });

  it("adds tier data to BayLevel", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const tier78Prev = bayLevelData[0].perTierInfo["78"];
    expect(tier78Prev).toBeUndefined();

    const tierData: IObjectKeyArray<ITierStafData, string> = {
      [`001-${BayLevelEnum.ABOVE}`]: [
        {
          isoBay: "001" as IIsoBayPattern,
          isoTier: "78",
          level: BayLevelEnum.ABOVE,
          vcg: 10,
        },
      ],
    };

    addPerTierInfo([bayLevelData[0], bayLevelData[1]], tierData);

    const tier78 = bayLevelData[0].perTierInfo["78"];

    expect(tier78).toBeDefined();
    expect(tier78.vcg).toBe(10);
    expect(tier78.isoTier).toBe("78");

    const tier78InBayBelow = bayLevelData[1].perTierInfo["78"];
    expect(tier78InBayBelow).toBeUndefined();
  });
});
