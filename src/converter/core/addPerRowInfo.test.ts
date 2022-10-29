import {
  IIsoBayPattern,
  IJoinedRowTierPattern,
} from "../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import IRowStafData from "../types/IRowStafData";
import addPerRowInfo from "./addPerRowInfo";
import { createMockedSimpleBayLevelData } from "../mocks/bayLevelData";
import { shipDataBays } from "../mocks/shipData";

const mockSlotInfoKeysAbove: IJoinedRowTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedRowTierPattern[] = ["0002", "0004"];

describe("addPerRowInfo should", () => {
  it("work ok with missing Row Info", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const isoBays = addPerRowInfo(
      bayLevelData,
      undefined as IObjectKeyArray<IRowStafData, string>
    );

    expect(isoBays).toBe(0);
  });

  it("return isoBays correctly", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const isoBays = addPerRowInfo(bayLevelData, {});

    expect(isoBays).toBe(13);
  });

  it("adds row data to BayLevel", () => {
    const bayLevelData = createMockedSimpleBayLevelData(
      shipDataBays,
      mockSlotInfoKeysAbove,
      mockSlotInfoKeysBelow
    );

    const row03Prev = bayLevelData[0].perRowInfo.each["03"];
    expect(row03Prev).toBeUndefined();

    const rowData: IObjectKeyArray<IRowStafData, string> = {
      [`001-${BayLevelEnum.ABOVE}`]: [
        {
          isoBay: "001" as IIsoBayPattern,
          isoRow: "03",
          level: BayLevelEnum.ABOVE,
          rowInfoByLength: {
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

    addPerRowInfo([bayLevelData[0], bayLevelData[1]], rowData);

    const row03 = bayLevelData[0].perRowInfo.each["03"];

    expect(row03).toBeDefined();
    expect(row03.rowInfoByLength).toBeDefined();
    expect(row03.rowInfoByLength[20]).toBeDefined();
    expect(row03.rowInfoByLength[40]).toBeDefined();
    expect(row03.rowInfoByLength[53]).toBeDefined();
    expect(row03.rowInfoByLength[24]).toBeUndefined();
    expect(row03.rowInfoByLength[48]).toBeUndefined();

    expect(row03.rowInfoByLength[20].size).toBe(20);
    expect(row03.rowInfoByLength[40].size).toBe(40);
    expect(row03.rowInfoByLength[53].size).toBe(53);

    const row03InBayBelow = bayLevelData[1].perRowInfo.each["03"];
    expect(row03InBayBelow).toBeUndefined();
  });
});
