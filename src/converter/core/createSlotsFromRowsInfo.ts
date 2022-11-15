import {
  IBayRowInfoStaf,
  IBaySlotData,
  TBayRowInfoStaf,
} from "../../models/v1/parts/IBayLevelData";

import { IRowInfoByLengthWithAcceptsSize } from "../types/IRowStafData";
import { pad2 } from "../../helpers/pad";

export function createSlotsFromRow(
  rowData: IBayRowInfoStaf,
  baySlotData: IBaySlotData
): IBaySlotData {
  for (
    let iTier = Number(rowData.bottomIsoTier);
    iTier <= Number(rowData.topIsoTier);
    iTier += 2
  ) {
    const pos = `${rowData.isoRow}${pad2(iTier)}`;

    baySlotData[pos] = { pos };

    const rowInfoByLength = rowData.rowInfoByLength;
    const sizes = Object.keys(rowInfoByLength);

    if (sizes.length) {
      sizes
        .filter(
          (size) =>
            (rowInfoByLength[size] as IRowInfoByLengthWithAcceptsSize)
              .acceptsSize === 1
        )
        .forEach((size) => {
          if (!baySlotData[pos].sizes) baySlotData[pos].sizes = {};
          baySlotData[pos].sizes[size] = 1;
        });
    } else {
      baySlotData[pos].restricted = 1;
    }
  }

  return baySlotData;
}

export default function createSlotsFromRowsInfo(
  rowsData: TBayRowInfoStaf,
  baySlotData: IBaySlotData
): IBaySlotData {
  const perRowInfoEach = rowsData.each;
  Object.keys(perRowInfoEach).forEach((row) => {
    const rowData = perRowInfoEach[row];
    baySlotData = createSlotsFromRow(rowData, baySlotData);
  });
  return baySlotData;
}
