import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import {
  IIsoBayPattern,
  IJoinedStackTierPattern,
} from "../../models/base/types/IPositionPatterns";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipData } from "../mocks/shipData";
import IStackStafData from "../models/IStackStafData";
import addPerStackInfo from "./addPerStackInfo";

const mockSlotInfoKeysAbove: IJoinedStackTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedStackTierPattern[] = ["0002", "0004"];

describe("addPerStackInfo should", () => {
  it("work ok with missing Stack Info", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipData.isoBays,
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
      shipData.isoBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const isoBays = addPerStackInfo(bayLevelData, {});

    expect(isoBays).toBe(11);
  });

  it("adds stack data to BayLevel", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipData.isoBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const stack03Prev = bayLevelData[0].perStackInfo["03"];
    expect(stack03Prev).toBeUndefined();

    const stackData: IObjectKeyArray<IStackStafData, string> = {
      [`001-${BayLevelEnum.ABOVE}`]: [
        {
          isoBay: "001" as IIsoBayPattern,
          isoStack: "03",
          level: BayLevelEnum.ABOVE,
          stackAttributesByContainerLength: {
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

    const stack03 = bayLevelData[0].perStackInfo["03"];

    expect(stack03).toBeDefined();
    expect(stack03.stackAttributesByContainerLength).toBeDefined();
    expect(stack03.stackAttributesByContainerLength[20]).toBeDefined();
    expect(stack03.stackAttributesByContainerLength[40]).toBeDefined();
    expect(stack03.stackAttributesByContainerLength[53]).toBeDefined();
    expect(stack03.stackAttributesByContainerLength[24]).toBeUndefined();
    expect(stack03.stackAttributesByContainerLength[48]).toBeUndefined();

    expect(stack03.stackAttributesByContainerLength[20].size).toBe(20);
    expect(stack03.stackAttributesByContainerLength[40].size).toBe(40);
    expect(stack03.stackAttributesByContainerLength[53].size).toBe(53);

    const stack03InBayBelow = bayLevelData[1].perStackInfo["03"];
    expect(stack03InBayBelow).toBeUndefined();
  });
});
