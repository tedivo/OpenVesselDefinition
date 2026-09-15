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

export type IBayLevelDataBase = {
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
  lashingBridges?: ILashingBridgeInfo;

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
};

/** Contains the information of a Bay and a Level (i.e. 003 - Above) */
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
  /**
   * Minimum height, in mm **above the stack bottom**, at which a container of
   * this size may be stowed.
   *
   * Example: a 45' requiring two 9'6" High-Cubes below it → `5791`.
   *
   * Some formats state this restriction explicitly per size; others only imply
   * it through per-tier heights (see {@link TMinTierHeights}). When both are
   * present this one wins, as it is stated rather than derived.
   */
  minBottomHeight?: number;
}

/**
 * Nominal container height, in mm, per ISO tier.
 *
 * Sparse: only tiers that differ from the vessel's usual height need an entry.
 * 8'6" ≈ 2591, 9'6" High-Cube ≈ 2896.
 *
 * Formats that express stack geometry per tier (rather than per stack) encode
 * minimum container heights this way, which in turn implies which sizes fit at
 * which elevation. Kept so conversion back to such a format stays lossless.
 *
 * These are differences, not positions, so they are unaffected by the LCG/VCG
 * rebasing the converters apply to `bottomBase`, `lcg` and `tcg`.
 */
export type TMinTierHeights = { [tier: IIsoTierPattern]: number };

export interface TBayRowInfo {
  common?: TCommonBayInfo;
  each?: {
    [key: IIsoRowPattern]: IBayRowInfo;
  };
}

export interface TCommonBayInfo {
  bottomBase?: number;
  maxHeight?: number;
  /** Nominal container height per tier, applying to every row of the bay */
  minTierHeights?: TMinTierHeights;
}

export interface IBayRowInfo {
  isoRow: IIsoRowPattern;
  label?: string;
  tcg?: number;
  bottomBase?: number;
  maxHeight?: number;
  /** Overrides general bay LCG, Row Weight and size restrictions by length */
  rowInfoByLength?: TRowInfoByLength;
  /** Overrides the bay's common tier heights for this row */
  minTierHeights?: TMinTierHeights;
}

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

export type ILashingBridgeInfo = ILashingBridgeInfoFore & ILashingBridgeInfoAft;

type ILashingBridgeInfoFore =
  | {
      fore: 0;
      foreTiers?: never;
      foreLcg?: never;
    }
  | {
      fore: 1;
      foreTiers: number;
      foreLcg?: number;
    };

type ILashingBridgeInfoAft =
  | {
      aft: 0;
      aftTiers?: never;
      aftLcg?: never;
    }
  | {
      aft: 1;
      aftTiers: number;
      aftLcg?: number;
    };
