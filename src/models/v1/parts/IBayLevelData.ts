import {
  IIsoBayPattern,
  IIsoStackTierPattern,
  IJoinedStackTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";

import BayLevelEnum from "../../base/enums/BayLevelEnum";
import ForeAftEnum from "../../base/enums/ForeAftEnum";
import ISlotData from "./ISlotData";
import { TContainerLengths } from "./Types";

export interface IBayLevelDataIntermediate {
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

  bulkhead?: IBulkheadInfo;

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

  /**
   * Dictionary: contains information that applies to all stacks by container Length
   */
  infoByContLength: TStackInfoByLength;
  /**
   * Dictionary: contains information per Stack number (i.e. "04") like maxTier, minTier, maxWeight...
   */
  perStackInfo?: TBayStackInfo;
  /**
   * Dictionary: contains information per Tier number (i.e. "78").
   *
   * This is not present in the final data (as it's converted from **BY_TIER** to **BY_STACK**)
   */
  perTierInfo?: TBayTierInfo;
  /**
   * Dictionary: contains information per Slot (i.e. "0078")
   */
  perSlotInfo?: IBaySlotData;

  /** If Tiers use custom labels, this is the name of the defintion */
  tiersLabelsDictionary?: string;
  /** If Stacks use custom labels, this is the name of the defintion */
  stacksLabelsDictionary?: string;
}

type IBayLevelData = Omit<
  IBayLevelDataIntermediate,
  "perTierInfo" | "maxHeight"
>;
export default IBayLevelData;

export interface IBaySlotData {
  [key: IJoinedStackTierPattern]: ISlotData;
}

export type TStackInfoByLength = Partial<{
  [key in TContainerLengths]: IStackInfoByLength;
}>;
export interface IStackInfoByLength {
  size: TContainerLengths;
  lcg?: number;
  stackWeight?: number;
  bottomWeight?: number;
}

export interface TBayStackInfo {
  common?: TCommonBayInfo;
  each?: {
    [key: IIsoStackTierPattern]: IBayStackInfo;
  };
}

export interface TCommonBayInfo {
  topIsoTier?: IIsoStackTierPattern;
  bottomIsoTier?: IIsoStackTierPattern;
  bottomBase?: number;
  maxHeight?: number;
}
export interface IBayStackInfo {
  isoStack: IIsoStackTierPattern;
  label?: string;
  tcg?: number;
  topIsoTier?: IIsoStackTierPattern;
  bottomIsoTier?: IIsoStackTierPattern;
  bottomBase?: number;
  maxHeight?: number;
  /** Overrides general bay LCG and Stack Weight by length */
  stackInfoByLength?: TStackInfoByLength;
}

export type TBayTierInfo = {
  [key in IIsoStackTierPattern]: IBayTierInfo;
};
export interface IBayTierInfo {
  isoTier: IIsoStackTierPattern;
  label?: string;
  vcg?: number;
}

export interface IBulkheadInfo {
  fore?: TYesNo;
  foreLcg?: number;
  aft?: TYesNo;
  aftLcg?: number;
}
