import {
  IIsoBay,
  IStackOrTier,
} from "../../../helpers/types/IPositionPatterns";
import BayLevelEnum from "../enums/BayLevelEnum";
import ForeAftEnum from "../enums/ForeAftEnum";
import { TContainerLengths } from "./Types";

export default interface IBayLevelData {
  /** 3 digits ISO Bay */
  isoBay: IIsoBay;
  /** Above, Below */
  level: BayLevelEnum;

  meta: {
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
    fore: boolean;
    foreLcg: number;
    aft: boolean;
    aftLcg: number;
  };

  centerLineStack?: boolean;
  athwartShip?: boolean;
  foreHatch?: boolean;
  ventilated?: boolean;
  nearBow?: boolean;
  nearStern?: boolean;
  heatSrcFore?: boolean;
  ignitionSrcFore?: boolean;
  quartersFore?: boolean;
  engineRmBulkfore?: boolean;

  stackAttributesByContainerLength: TStackAttributesByContainerLength;
  perStackInfo?: TBayStackInfo;

  perTierInfo?: TBayTierInfo;
}

export type TStackAttributesByContainerLength = {
  [key in TContainerLengths]: IStackAttributesByContainerLength;
};
export interface IStackAttributesByContainerLength {
  size: TContainerLengths;
  lcg: number;
  stackWeight: number;
  bottomWeight: number;
}

export type TBayStackInfo = {
  [key in IStackOrTier]: IBayStackInfo;
};
export interface IBayStackInfo {
  isoStack: IStackOrTier;
  label?: string;
  maxHeight?: number;
  topIsoTier?: IStackOrTier;
  bottomIsoTier?: IStackOrTier;
  bottomVcg?: number;
  tcg?: number;
  hazard?: number;
  stackAttributesByContainerLength: TStackAttributesByContainerLength;
}

export type TBayTierInfo = {
  [key in IStackOrTier]: IBayTierInfo;
};
export interface IBayTierInfo {
  isoTier: IStackOrTier;
  label?: string;
  vcg: number;
}
