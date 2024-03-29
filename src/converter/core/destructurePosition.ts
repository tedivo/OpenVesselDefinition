import {
  IIsoBayPattern,
  IIsoPositionPattern,
  IIsoRowPattern,
  IIsoTierPattern,
} from "../../models/base/types/IPositionPatterns";

import { pad3 } from "../../helpers/pad";

export interface IDestructuredPosition {
  bay: IIsoBayPattern;
  oddBay: IIsoBayPattern;
  row: IIsoRowPattern;
  tier: IIsoTierPattern;
  iBay: number;
  iOddBay: number;
  iRow: number;
  iTier: number;
}

export default function destructurePosition(
  position: IIsoPositionPattern
): IDestructuredPosition | null {
  if (position.length !== 7) return null;

  if (position.indexOf("000") === 0 || position.indexOf("999") >= 0)
    return null;

  const iPosition = Number(position);
  if (isNaN(iPosition)) return null;

  const bay = position.substring(0, 3) as IIsoBayPattern;
  const row = position.substring(3, 5) as IIsoRowPattern;
  const tier = position.substring(5) as IIsoTierPattern;

  const iBay = Number(bay);
  const oddBay = iBay & 1 ? bay : pad3(iBay - 1);
  const iTier = Number(tier);
  const iRow = Number(row);
  const iOddBay = Number(oddBay);

  return {
    bay,
    oddBay,
    row,
    tier,
    iBay,
    iOddBay,
    iTier,
    iRow,
  };
}
