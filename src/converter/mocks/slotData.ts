import { IIsoPositionPattern } from "../../models/base/types/IPositionPatterns";
import ISlotData from "../../models/v1/parts/ISlotData";
import destructurePosition from "../core/destructurePosition";

export const slotData20: ISlotData = {
  pos: "0010080",
  stackTier: "00|80",
  sizes: { 20: 1 },
};

export const slotData40: ISlotData = {
  pos: "0020080",
  stackTier: "00|80",
  sizes: { 20: 1, 40: 1 },
};

export function createMockedSlotData(position: IIsoPositionPattern): ISlotData {
  const desPos = destructurePosition(position);
  const is40 = desPos.iBay !== desPos.iOddBay;
  return {
    pos: position,
    stackTier: "00|80",
    sizes: { 20: 1, 40: is40 ? 1 : 0 },
  };
}
