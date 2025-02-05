import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { IIsoRowPattern } from "../../models/base/types/IPositionPatterns";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import IRowStafData from "../types/IRowStafData";
import { createSlotsFromRow } from "../core/createSlotsFromRowsInfo";
import sortRowsArray from "../../helpers/sortRowsArray";
import { stringIsTierOrStafNumber } from "./stringIsTierOrStafNumber";

/**
 * Add Row Info to the Bay
 * @param bayLevelData
 * @param rowDataByBayLevel IObjectKeyArray<IRowStafData, string>
 * @returns
 */
export default function addPerRowInfo(
  bayLevelData: IBayLevelDataStaf[],
  rowDataByBayLevel: IObjectKeyArray<IRowStafData, string>
) {
  if (!bayLevelData) {
    throw { message: "Missing bayLevelData", code: "MissingBayData" };
  }

  if (!rowDataByBayLevel) return 0;

  let isoBays: number = 0;

  bayLevelData.forEach((bl) => {
    // Find the max isoBay for ShipData
    if (Number(bl.isoBay) > isoBays) isoBays = Number(bl.isoBay);

    const key = `${bl.isoBay}-${bl.level}`;
    const rowDataOfBay = rowDataByBayLevel[key];
    if (!bl.perRowInfo) bl.perRowInfo = { each: {}, common: {} };
    if (!bl.perSlotInfo) bl.perSlotInfo = {};

    if (rowDataOfBay) {
      let centerLineRow: 0 | 1 = 0;
      rowDataOfBay
        .sort((a, b) => sortRowsArray(a.isoRow, b.isoRow))
        .forEach((sData) => {
          const { isoBay, level, label, ...sDataK } = sData;

          if (label) {
            if (stringIsTierOrStafNumber(label)) {
              sData.isoRow = label as IIsoRowPattern;
            } else {
              throw {
                code: "RowLabelError",
                message: `Row label must be a number between 00 and 99: "${label}"`,
              };
            }
          }

          // a. Set perRowInfo
          bl.perRowInfo.each[sDataK.isoRow] = sDataK;
          // b. Set perSlotInfo
          bl.perSlotInfo = createSlotsFromRow(sDataK, bl.perSlotInfo);
          // c. centerLineRow?
          if (sDataK.isoRow === "00") centerLineRow = 1;
        });

      bl.centerLineRow = centerLineRow;
    }
  });
  return isoBays;
}
