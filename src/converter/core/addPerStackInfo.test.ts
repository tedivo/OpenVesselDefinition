import {
  IIsoBayPattern,
  IJoinedStackTierPattern,
} from "../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import IStackStafData from "../models/IStackStafData";
import addPerStackInfo from "./addPerStackInfo";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedStackTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedStackTierPattern[] = ["0002", "0004"];

describe("addPerStackInfo should", () => {
  it("work ok with missing Stack Info", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const isoBays = addPerStackInfo(
      bayLevelData,
      undefined as IObjectKeyArray<IStackStafData, string>
    );

    expect(isoBays).toBe(0);
  });

  it("return isoBays correctly", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const isoBays = addPerStackInfo(bayLevelData, {});

    expect(isoBays).toBe(13);
  });

  it("adds stack data to BayLevel", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const stack03Prev = bayLevelData[0].perStackInfo.each["03"];
    expect(stack03Prev).toBeUndefined();

    const stackData: IObjectKeyArray<IStackStafData, string> = {
      [`001-${BayLevelEnum.ABOVE}`]: [
        {
          isoBay: "001" as IIsoBayPattern,
          isoStack: "03",
          level: BayLevelEnum.ABOVE,
          stackInfoByLength: {
            20: {
              acceptsSize: 1,
              size: 20,
            },
            40: {
              acceptsSize: 1,
              size: 40,
            },
            53: {
              acceptsSize: 1,
              size: 53,
            },
          },
        },
      ],
    };

    addPerStackInfo([bayLevelData[0], bayLevelData[1]], stackData);

    const stack03 = bayLevelData[0].perStackInfo.each["03"];

    expect(stack03).toBeDefined();
    expect(stack03.stackInfoByLength).toBeDefined();
    expect(stack03.stackInfoByLength[20]).toBeDefined();
    expect(stack03.stackInfoByLength[40]).toBeDefined();
    expect(stack03.stackInfoByLength[53]).toBeDefined();
    expect(stack03.stackInfoByLength[24]).toBeUndefined();
    expect(stack03.stackInfoByLength[48]).toBeUndefined();

    expect(stack03.stackInfoByLength[20].size).toBe(20);
    expect(stack03.stackInfoByLength[40].size).toBe(40);
    expect(stack03.stackInfoByLength[53].size).toBe(53);

    const stack03InBayBelow = bayLevelData[1].perStackInfo.each["03"];
    expect(stack03InBayBelow).toBeUndefined();
  });
});
