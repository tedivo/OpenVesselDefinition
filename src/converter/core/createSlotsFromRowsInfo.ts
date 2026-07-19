import {
  IBayRowInfoStaf,
  IBaySlotData,
  TBayRowInfoStaf,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IJoinedRowTierPattern,
} from "../../models/base/types/IPositionPatterns";

import { IRowInfoByLengthWithAcceptsSize } from "../types/IRowStafData";
import ISlotData from "../../models/v1/parts/ISlotData";
import { TContainerLengths } from "../../models/v1/parts/Types";
import { pad2 } from "../../helpers/pad";

export function createSlotsFromRow(
  rowData: IBayRowInfoStaf,
  baySlotData: IBaySlotData,
): IBaySlotData {
  for (
    let iTier = Number(rowData.bottomIsoTier);
    iTier <= Number(rowData.topIsoTier);
    iTier += 2
  ) {
    const pos = `${rowData.isoRow}${pad2(iTier)}` as IJoinedRowTierPattern;

    baySlotData[pos] = { pos, sizes: {} } as ISlotData;

    const rowInfoByLength = rowData.rowInfoByLength;

    if (!rowInfoByLength) continue;

    const sizesFromRowInfoByLength = Object.keys(rowInfoByLength || {}).map(
      Number,
    ) as TContainerLengths[];

    if (sizesFromRowInfoByLength.length) {
      sizesFromRowInfoByLength.forEach((size) => {
        const acceptsSize = (
          rowInfoByLength[size] as IRowInfoByLengthWithAcceptsSize
        )?.acceptsSize;

        if (acceptsSize) baySlotData[pos].sizes[size] = 1;
      });

      if (Object.keys(baySlotData[pos].sizes).length === 0)
        baySlotData[pos].restricted = 1;
    } else {
      baySlotData[pos].restricted = 1;
    }
  }

  return baySlotData;
}

export default function createSlotsFromRowsInfo(
  rowsData: TBayRowInfoStaf,
  baySlotData: IBaySlotData,
): IBaySlotData {
  const perRowInfoEach = rowsData.each || {};
  const perRowInfoEachKeys = Object.keys(perRowInfoEach);

  perRowInfoEachKeys.forEach((row) => {
    const rowData = perRowInfoEach[row as IIsoRowPattern];
    baySlotData = createSlotsFromRow(rowData, baySlotData);
  });
  return baySlotData;
}
