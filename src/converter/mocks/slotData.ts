import { IIsoPositionPattern } from "../../models/base/types/IPositionPatterns";
import ISlotData from "../../models/v1/parts/ISlotData";
import destructurePosition from "../core/destructurePosition";

export const slotData20: ISlotData = {
  isoPosition: "0010080",
  acceptsContainers: { 20: true },
};

export const slotData40: ISlotData = {
  isoPosition: "0020080",
  acceptsContainers: { 20: true, 40: true },
};

export function createMockedSlotData(position: IIsoPositionPattern) {
  const desPos = destructurePosition(position);
  const is40 = desPos.iBay !== desPos.iOddBay;
  return {
    isoPosition: position,
    acceptsContainers: { 20: true, 40: is40 },
  };
}
