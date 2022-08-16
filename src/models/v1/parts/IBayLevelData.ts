import {
  IIsoBayPattern,
  IIsoStackPattern,
  IIsoTierPattern,
  IJoinedStackTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";

import BayLevelEnum from "../../base/enums/BayLevelEnum";
import ForeAftEnum from "../../base/enums/ForeAftEnum";
import ISlotData from "./ISlotData";
import { TContainerLengths } from "./Types";

interface IBayLevelDataBase {
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
  // Unused fields:
  // slHatch?: string;
  // slForeAft?: string;

  reeferPlugs?: ForeAftEnum;
  doors?: ForeAftEnum;
  pairedBay?: ForeAftEnum;
  reeferPlugLimit?: number;

  bulkhead?: IBulkheadInfo;

  centerLineStack?: TYesNo;
  athwartShip?: TYesNo;
  foreHatch?: TYesNo;

  ventilated?: TYesNo;
  heatSrcFore?: TYesNo;
  ignitionSrcFore?: TYesNo;
  quartersFore?: TYesNo;
  engineRmBulkFore?: TYesNo;
}

export interface IBayLevelDataStaf extends IBayLevelDataBase {
  maxHeight?: number;

  /**
   * Dictionary: contains information that applies to all stacks by container Length
   */
  infoByContLength: TStackInfoByLength;
  /**
   * Dictionary: contains information per Stack number (i.e. "04") like maxTier, minTier, maxWeight...
   */
  perStackInfo?: TBayStackInfoStaf;
  /**
   * Dictionary: contains information per Tier number (i.e. "78").
   *
   * This is not present in the final data (as it's converted from **BY_TIER** to **BY_STACK**)
   */
  perTierInfo?: TBayTierInfoStaf;
  /**
   * Dictionary: contains information per Slot (i.e. "0078")
   */
  perSlotInfo?: IBaySlotData;

  /** If Tiers use custom labels, this is the name of the defintion */
  tiersLabelsDictionary?: string;
  /** If Stacks use custom labels, this is the name of the defintion */
  stacksLabelsDictionary?: string;
}

export default interface IBayLevelData extends IBayLevelDataBase {
  /**
   * Dictionary: contains information that applies to all stacks by container Length
   */
  infoByContLength: TStackInfoByLength;
  /**
   * Dictionary: contains information per Stack number (i.e. "04") like maxTier, minTier, maxWeight...
   */
  perStackInfo?: TBayStackInfo;

  /**
   * Dictionary: contains information per Slot (i.e. "0078")
   */
  perSlotInfo?: IBaySlotData;
}

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
    [key: IIsoStackPattern]: IBayStackInfo;
  };
}

export interface TBayStackInfoStaf {
  common?: TCommonBayInfoStaf;
  each?: {
    [key: IIsoStackPattern]: IBayStackInfoStaf;
  };
}

export interface TCommonBayInfo {
  bottomBase?: number;
  maxHeight?: number;
}

export interface TCommonBayInfoStaf {
  topIsoTier?: IIsoTierPattern;
  bottomIsoTier?: IIsoTierPattern;
  bottomBase?: number;
  maxHeight?: number;
}
export interface IBayStackInfo {
  isoStack: IIsoStackPattern;
  label?: string;
  tcg?: number;
  bottomBase?: number;
  maxHeight?: number;
  /** Overrides general bay LCG and Stack Weight by length */
  stackInfoByLength?: TStackInfoByLength;
}

export interface IBayStackInfoStaf {
  isoStack: IIsoStackPattern;
  label?: string;
  tcg?: number;
  topIsoTier?: IIsoTierPattern;
  bottomIsoTier?: IIsoTierPattern;
  bottomBase?: number;
  maxHeight?: number;
  /** Overrides general bay LCG and Stack Weight by length */
  stackInfoByLength?: TStackInfoByLength;
}

export type TBayTierInfoStaf = {
  [key in IIsoTierPattern]: IBayTierInfo;
};
export interface IBayTierInfo {
  isoTier: IIsoTierPattern;
  label?: string;
  vcg?: number;
}

export interface IBulkheadInfo {
  fore?: TYesNo;
  foreLcg?: number;
  aft?: TYesNo;
  aftLcg?: number;
}
