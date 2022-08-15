import {
  IIsoBayPattern,
  IIsoPositionPattern,
  IIsoStackPattern,
  IJoinedStackTierPattern,
  TYesNo,
} from "../../../models/base/types/IPositionPatterns";
import { pad2, safePad6 } from "../../../helpers/pad";

import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import { IMasterCGs } from "../../../models/v1/parts/IShipData";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import ISlotData from "../../../models/v1/parts/ISlotData";
import IStackStafData from "../../types/IStackStafData";
import { SHIP_EDITOR_MIN_TIER } from "./consts";
import { createStackStafData } from "./StackConfig";
import { getStackAndTiersFromSlotKeys } from "../../../helpers/getStackAndTiersFromSlotKeys";
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
      const stackData = createStackStafData([bl], dummyMasterCGs);
      const stackDataByStack = stackData.reduce((acc, sData) => {
        acc[sData.isoStack] = sData;
        return acc;
      }, {} as { [stack: IIsoStackPattern]: IStackStafData });

      const slotsKeys = Object.keys(perSlotInfo) as IJoinedStackTierPattern[];
      const { minTier } = getStackAndTiersFromSlotKeys(slotsKeys);

      slotsKeys.forEach((slotKey) => {
        const slotStack = slotKey.substring(0, 2);
        if (stackDataByStack[slotStack]) {
          const stackDataOfStack: IStackStafData = stackDataByStack[slotStack];
          // If not contained, add it
          if (
            !slotIsContainedInStackData(stackDataOfStack, perSlotInfo[slotKey])
          ) {
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
    slotKey: IJoinedStackTierPattern,
    minTierOfBay: number
  ): SixDigitPos {
    const slotTier = Number(slotKey.substring(2));
    if (isNaN(slotTier)) throw { error: "Missing pos in slot" };

    const bay = pad2(Number(isoBay));
    return `${bay}${slotKey}` as SixDigitPos;

    // if (level === BayLevelEnum.ABOVE && minTierOfBay < SHIP_EDITOR_MIN_TIER) {
    //   const newTier = slotTier + (SHIP_EDITOR_MIN_TIER - minTierOfBay);
    //   const stack = slotKey.substring(0, 2);
    //   return `${bay}${stack}${pad2(newTier)}` as SixDigitPos;
    // } else {
    //   return `${bay}${slotKey}` as SixDigitPos;
    // }
  }

  type SixDigitPos = `${number}${number}${number}${number}${number}${number}`;

  function slotIsContainedInStackData(
    stackDataOfStack: IStackStafData,
    slotData: ISlotData
  ): boolean {
    const slotDataTier = Number(slotData.pos.substring(2));

    if (
      !slotData.reefer &&
      slotDataTier >= Number(stackDataOfStack.bottomIsoTier) &&
      slotDataTier <= Number(stackDataOfStack.topIsoTier)
    ) {
      const hashSizesStack = Object.keys(stackDataOfStack.stackInfoByLength)
        .sort(sortNumericAsc)
        .join("#");

      const hashSizesSlot = Object.keys(slotData.sizes)
        .sort(sortNumericAsc)
        .join("#");

      return hashSizesStack === hashSizesSlot;
    }
    return false;
  }
}
