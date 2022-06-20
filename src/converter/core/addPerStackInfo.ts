import sortStacksArray from "../../helpers/sortStacksArray";
import { IObjectKeyArray } from "../../helpers/types/IObjectKey";
import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import IBayLevelData, {
  TStackInfoByLength,
} from "../../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../../models/v1/parts/Types";
import { createSlotsFromStack } from "../core/createSlotsFromStacksInfo";
import IStackStafData from "../models/IStackStafData";
import { stringIsTierOrStafNumber } from "./stringIsTierOrStafNumber";

/**
 * Add Stack Info to the Bay
 * @param bayLevelData
 * @param stackDataByBayLevel IObjectKeyArray<IStackStafData, string>
 * @returns
 */
export default function addPerStackInfo(
  bayLevelData: IBayLevelData[],
  stackDataByBayLevel: IObjectKeyArray<IStackStafData, string>
) {
  if (!bayLevelData) {
    throw new Error("Missing bayLevelData");
  }

  if (!stackDataByBayLevel) return 0;

  let isoBays: number = 0;

  bayLevelData.forEach((bl) => {
    // Find the max isoBay for ShipData
    if (Number(bl.isoBay) > isoBays) isoBays = Number(bl.isoBay);

    const key = `${bl.isoBay}-${bl.level}`;
    const stackDataOfBay = stackDataByBayLevel[key];
    if (!bl.perStackInfo) bl.perStackInfo = {};
    if (!bl.perSlotInfo) bl.perSlotInfo = {};

    if (stackDataOfBay) {
      let centerLineStack = 0;
      stackDataOfBay
        .sort((a, b) => sortStacksArray(a.isoStack, b.isoStack))
        .forEach((sData) => {
          const { isoBay, level, label, ...sDataK } = sData;

          if (label)
            if (stringIsTierOrStafNumber(label)) {
              sData.isoStack = label as IIsoStackTierPattern;
            } else {
              throw new Error(
                `Stack label must be a number between 00 and 99: "${label}"`
              );
            }

          // a. Set perStackInfo
          bl.perStackInfo[sDataK.isoStack] = sDataK;
          // b. Set perSlotInfo
          bl.perSlotInfo = createSlotsFromStack(sDataK, bl.perSlotInfo);
          // c. centerLineStack?
          if (sDataK.isoStack === "00") centerLineStack = 1;
        });
      if (centerLineStack) bl.centerLineStack = 1;
    }
  });
  return isoBays;
}
