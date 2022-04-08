import {
  IIsoBayPattern,
  IIsoStackTierPattern,
  ICombinedStackTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";
import BayLevelEnum from "../../base/enums/BayLevelEnum";
import ForeAftEnum from "../../base/enums/ForeAftEnum";
import { TContainerLengths } from "./Types";
import ISlotData from "./ISlotData";

export default interface IBayLevelData {
  /** 3 digits ISO Bay */
  isoBay: IIsoBayPattern;
  /** Above, Below */
  level: BayLevelEnum;

  meta?: {
    notes?: string;
  };

  /* AFT attribs */
  label20?: string;
  label40?: string;
  slHatch?: string;
  slForeAft?: string;

  maxHeight?: number;

  reeferPlugs?: ForeAftEnum;
  doors?: ForeAftEnum;
  pairedBay?: ForeAftEnum;
  reeferPlugLimit?: number;

  bulkhead?: {
    fore: TYesNo;
    foreLcg: number;
    aft: TYesNo;
    aftLcg: number;
  };

  centerLineStack?: TYesNo;
  athwartShip?: TYesNo;
  foreHatch?: TYesNo;
  ventilated?: TYesNo;
  nearBow?: TYesNo;
  nearStern?: TYesNo;
  heatSrcFore?: TYesNo;
  ignitionSrcFore?: TYesNo;
  quartersFore?: TYesNo;
  engineRmBulkfore?: TYesNo;

  stackAttributesByContainerLength: TStackAttributesByContainerLength;
  perStackInfo?: TBayStackInfo;

  perTierInfo?: TBayTierInfo;

  perSlotInfo?: IBaySlotData;
}

export interface IBaySlotData {
  [key: ICombinedStackTierPattern]: ISlotData;
}

export type TStackAttributesByContainerLength = Partial<{
  [key in TContainerLengths]: IStackAttributesByContainerLength;
}>;
export interface IStackAttributesByContainerLength {
  size: TContainerLengths;
  lcg?: number;
  stackWeight?: number;
  bottomWeight?: number;
}

export type TBayStackInfo = {
  [key in IIsoStackTierPattern]: IBayStackInfo;
};
export interface IBayStackInfo {
  isoStack: IIsoStackTierPattern;
  label?: string;
  maxHeight?: number;
  topIsoTier?: IIsoStackTierPattern;
  bottomIsoTier?: IIsoStackTierPattern;
  bottomVcg?: number;
  tcg?: number;
  hazard?: number;
  stackAttributesByContainerLength?: TStackAttributesByContainerLength;
}

export type TBayTierInfo = {
  [key in IIsoStackTierPattern]: IBayTierInfo;
};
export interface IBayTierInfo {
  isoTier: IIsoStackTierPattern;
  label?: string;
  vcg?: number;
}
