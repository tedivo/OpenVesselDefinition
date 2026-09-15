import {
  IBayLevelDataBase,
  IBaySlotData,
  IBayTierInfo,
  TRowInfoByLength,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IIsoTierPattern,
} from "../../models/base/types/IPositionPatterns";

/**
 * Bay & Level data as read from a STAF file.
 *
 * This is an **intermediate** shape: it carries fields (like `perTierInfo`) that
 * don't exist in the final {@link IBayLevelData} of the OVD format.
 */
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

export interface TBayRowInfoStaf {
  common?: TCommonBayInfoStaf;
  each?: {
    [key: IIsoRowPattern]: IBayRowInfoStaf;
  };
}

export interface TCommonBayInfoStaf {
  topIsoTier?: IIsoTierPattern;
  bottomIsoTier?: IIsoTierPattern;
  bottomBase?: number;
  maxHeight?: number;
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
