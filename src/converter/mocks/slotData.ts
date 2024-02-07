import { IIsoPositionPattern } from "../../models/base/types/IPositionPatterns";
import { ISlotDataIntermediate } from "../../models/v1/parts/ISlotData";
import destructurePosition from "../core/destructurePosition";

export const slotData20: ISlotDataIntermediate = {
  position: "0010080",
  pos: "0080",
  sizes: { 20: 1 },
};

export const slotData40: ISlotDataIntermediate = {
  position: "0020080",
  pos: "0080",
  sizes: { 20: 1, 40: 1 },
};

export function createMockedSlotData(
  position: IIsoPositionPattern
): ISlotDataIntermediate {
  const desPos = destructurePosition(position);
  const is40 = desPos.iBay !== desPos.iOddBay;
  return {
    position: position,
    pos: "0080",
    sizes: { 20: 1, 40: is40 ? 1 : 0 },
  };
}
