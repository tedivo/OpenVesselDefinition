import {
  IIsoBayPattern,
  IIsoPositionPattern,
  IIsoRowPattern,
  IJoinedRowTierPattern,
  TYesNo,
} from "../../../models/base/types/IPositionPatterns";
import { pad2, safePad6 } from "../../../helpers/pad";

import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import { IMasterCGs } from "../../../models/v1/parts/IShipData";
import IRowStafData from "../../types/IRowStafData";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import ISlotData from "../../../models/v1/parts/ISlotData";
import { SHIP_EDITOR_MIN_TIER } from "./consts";
import { createRowStafData } from "./RowConfig";
import { getRowsAndTiersFromSlotKeys } from "../../../helpers/getRowsAndTiersFromSlotKeys";
import { sortNumericAsc } from "../../../helpers/sortByMultipleFields";
import { yNToStaf } from "../../../helpers/yNToBoolean";

/**
 * DEFINITION of SLOT
 */
const SlotConfig: ISectionMapToStafConfig<ISlotData, ISlotData> = {
  stafSection: "SLOT",
  mapVars: [
    { stafVar: "SLOT", source: "position", mapper: passAsString },
    { stafVar: "ACCEPTS 20", source: "sizes.20", mapper: yNToStaf },
    { stafVar: "ACCEPTS 40", source: "sizes.40", mapper: yNToStaf },
    { stafVar: "ACCEPTS 45", source: "sizes.45", mapper: yNToStaf },
    { stafVar: "ACCEPTS 48", source: "sizes.48", mapper: yNToStaf },
    { stafVar: "REEFER TYPE", source: "reefer", mapper: iNToStaf },
    { stafVar: "ACCEPTS 24", source: "sizes.24", mapper: yNToStaf },
  ],
  preProcessor: createSlotData,
};

export default SlotConfig;

function passAsString(x: string) {
  return x;
}

function iNToStaf(s: TYesNo): "I" | "N" {
  return s === 1 ? "I" : "N";
}

function createSlotData(bayData: IBayLevelData[]): ISlotData[] {
  let slotsData: ISlotData[] = [];
  const dummyMasterCGs: IMasterCGs = {
    aboveTcgs: {},
    belowTcgs: {},
    bottomBases: {},
  };

  bayData.forEach((bl) => {
    const perSlotInfo = bl.perSlotInfo;
    if (perSlotInfo) {
      const slotsDataBL: ISlotData[] = [];
      const rowData = createRowStafData([bl], dummyMasterCGs);
      const rowDataByRow = rowData.reduce((acc, sData) => {
        acc[sData.isoRow] = sData;
        return acc;
      }, {} as { [row: IIsoRowPattern]: IRowStafData });

      const slotsKeys = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];
      const { minTier } = getRowsAndTiersFromSlotKeys(slotsKeys);

      slotsKeys.forEach((slotKey) => {
        const slotRow = slotKey.substring(0, 2);
        if (rowDataByRow[slotRow]) {
          const rowDataOfRow: IRowStafData = rowDataByRow[slotRow];
          // If not contained, add it
          if (!slotIsContainedInRowData(rowDataOfRow, perSlotInfo[slotKey])) {
            slotsDataBL.push({
              ...perSlotInfo[slotKey],
              position: generatePositionForStaf(
                bl.isoBay,
                bl.level,
                slotKey,
                Number(minTier)
              ) as IIsoPositionPattern,
            });
          }
        } else {
          slotsDataBL.push({
            ...perSlotInfo[slotKey],
            position: generatePositionForStaf(
              bl.isoBay,
              bl.level,
              slotKey,
              Number(minTier)
            ) as IIsoPositionPattern,
          });
        }
      });
      if (slotsDataBL.length) {
        slotsData = slotsData.concat(slotsDataBL.sort(sortByPos));
      }
    }
  });

  return slotsData;

  function sortByPos(a: ISlotData, b: ISlotData) {
    return Number(a.pos) > Number(b.pos) ? 1 : -1;
  }

  function generatePositionForStaf(
    isoBay: IIsoBayPattern,
    level: BayLevelEnum,
    slotKey: IJoinedRowTierPattern,
    minTierOfBay: number
  ): SixDigitPos {
    const slotTier = Number(slotKey.substring(2));
    if (isNaN(slotTier)) throw { error: "Missing pos in slot" };

    const bay = pad2(Number(isoBay));
    return `${bay}${slotKey}` as SixDigitPos;

    // if (level === BayLevelEnum.ABOVE && minTierOfBay < SHIP_EDITOR_MIN_TIER) {
    //   const newTier = slotTier + (SHIP_EDITOR_MIN_TIER - minTierOfBay);
    //   const row = slotKey.substring(0, 2);
    //   return `${bay}${row}${pad2(newTier)}` as SixDigitPos;
    // } else {
    //   return `${bay}${slotKey}` as SixDigitPos;
    // }
  }

  type SixDigitPos = `${number}${number}${number}${number}${number}${number}`;

  function slotIsContainedInRowData(
    rowDataOfRow: IRowStafData,
    slotData: ISlotData
  ): boolean {
    const slotDataTier = Number(slotData.pos.substring(2));

    if (
      !slotData.reefer &&
      slotDataTier >= Number(rowDataOfRow.bottomIsoTier) &&
      slotDataTier <= Number(rowDataOfRow.topIsoTier)
    ) {
      const hashSizesRow = Object.keys(rowDataOfRow.rowInfoByLength)
        .sort(sortNumericAsc)
        .join("#");

      const hashSizesSlot = slotData.sizes
        ? Object.keys(slotData.sizes).sort(sortNumericAsc).join("#")
        : "";

      return hashSizesRow === hashSizesSlot;
    }
    return false;
  }
}
