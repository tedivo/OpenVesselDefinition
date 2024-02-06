import {
  IIsoBayPattern,
  IIsoRowPattern,
  IIsoTierPattern,
  IJoinedRowTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";

import BayLevelEnum from "../../base/enums/BayLevelEnum";
import ForeAftEnum from "../../base/enums/ForeAftEnum";
import ISlotData from "./ISlotData";
import { TContainerLengths } from "./Types";

/** Contains the information of a Bay and a Level (i.e. 003 - Above) */
interface IBayLevelDataBase {
  /** 3 digits ISO Bay */
  isoBay: IIsoBayPattern;
  /** Above, Below */
  level: BayLevelEnum;

  meta?: {
    notes?: string;
  };

  label20?: string;
  label40?: string;
  // Unused fields:
  // slHatch?: string;
  // slForeAft?: string;

  /** Where are the reefer plugs. FWD or AFT */
  reeferPlugs?: ForeAftEnum;
  /** Where should the doors be. FWD or AFT */
  doors?: ForeAftEnum;
  /** Refers to the Bay (not the current one). If it's FWD, it means current is AFT */
  pairedBay?: ForeAftEnum;
  reeferPlugLimit?: number;

  bulkhead?: IBulkheadInfo;

  /** Does it has Center Line Row (00)? */
  centerLineRow?: TYesNo;
  athwartShip?: TYesNo;
  foreHatch?: TYesNo;

  ventilated?: TYesNo;
  heatSrcFore?: TYesNo;
  ignitionSrcFore?: TYesNo;
  quartersFore?: TYesNo;
  engineRmBulkFore?: TYesNo;

  telescoping?: TYesNo;
}

export interface IBayLevelDataStaf extends IBayLevelDataBase {
  maxHeight?: number;

  /**
   * Dictionary: contains information that applies to all rows by container Length
   */
  infoByContLength: TRowInfoByLength;
  /**
   * Dictionary: contains information per Row number (i.e. "04") like maxTier, minTier, maxWeight...
   */
  perRowInfo?: TBayRowInfoStaf;
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
  /** If Rows use custom labels, this is the name of the defintion */
  rowsLabelsDictionary?: string;
}

export default interface IBayLevelData extends IBayLevelDataBase {
  /**
   * Dictionary: contains information that applies to all rows by container Length
   */
  infoByContLength: TRowInfoByLength;
  /**
   * Dictionary: contains information per Row number (i.e. "04") like maxTier, minTier, maxWeight...
   */
  perRowInfo?: TBayRowInfo;

  /**
   * Dictionary: contains information per Slot (i.e. "0078")
   */
  perSlotInfo?: IBaySlotData;
}

export interface IBaySlotData {
  [key: IJoinedRowTierPattern]: ISlotData;
}

export type TRowInfoByLength = Partial<{
  [key in TContainerLengths]: IRowInfoByLength;
}>;
export interface IRowInfoByLength {
  size: TContainerLengths;
  lcg?: number;
  rowWeight?: number;
  bottomWeight?: number;
}

export interface TBayRowInfo {
  common?: TCommonBayInfo;
  each?: {
    [key: IIsoRowPattern]: IBayRowInfo;
  };
}

export interface TBayRowInfoStaf {
  common?: TCommonBayInfoStaf;
  each?: {
    [key: IIsoRowPattern]: IBayRowInfoStaf;
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
export interface IBayRowInfo {
  isoRow: IIsoRowPattern;
  label?: string;
  tcg?: number;
  bottomBase?: number;
  maxHeight?: number;
  /** Overrides general bay LCG and Row Weight by length */
  rowInfoByLength?: TRowInfoByLength;
}

export interface IBayRowInfoStaf {
  isoRow: IIsoRowPattern;
  label?: string;
  tcg?: number;
  topIsoTier?: IIsoTierPattern;
  bottomIsoTier?: IIsoTierPattern;
  bottomBase?: number;
  maxHeight?: number;
  /** Overrides general bay LCG and Row Weight by length */
  rowInfoByLength?: TRowInfoByLength;
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
