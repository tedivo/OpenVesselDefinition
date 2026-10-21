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
   * The stack bottom is the lowest `bottomBase` of the stack the container
   * rests in. For a 40'+ size in a pair of bays that means the lower of the
   * two bays' `bottomBase` for that row — not necessarily the one of the bay
   * this entry is written in, since the two bays of a pair may start at
   * different ISO tiers. That lowest bottom base never moves, which is what
   * makes it usable as a reference from either bay.
   *
   * Example: a 45' requiring two 9'6" High-Cubes below it → `5791`.
   *
   * Example: row 10 starts at tier 12 in bay 001 (`bottomBase` 4591) and at
   * tier 10 in bay 003 (`bottomBase` 2000). A 40' spanning the pair can only
   * rest at 4591, so its `minBottomHeight` is `2591` — and whatever stows at
   * 003 tier 10 has to be at least that tall to support it.
   *
   * Some formats state this restriction explicitly per size; others only imply
   * it through per-tier heights (see {@link TMinTierHeights}) or through the
   * bays' bottom bases. When both are present this one wins, as it is stated
   * rather than derived.
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

/**
 * Bulkheads at the ends of this bay. Mostly found on Below bay-levels.
 *
 * Each physical bulkhead is written once. Between two bays with nothing else
 * in the gap, write it as `fore` of the aft bay (the convention STAF uses).
 * Use `aft` only when a vessel part follows this bay, or for the aft-most bay.
 */
export interface IBulkheadInfo {
  fore?: TYesNo;
  foreLcg?: number;
  aft?: TYesNo;
  aftLcg?: number;
}

/**
 * Lashing bridges at the ends of this bay. Only meaningful on the Above level.
 *
 * Same convention as {@link IBulkheadInfo}: between two bays with nothing else
 * in the gap, write the bridge as `fore` of the aft bay. Use `aft` only when a
 * vessel part follows this bay (i.e. a bridge against the fore face of the
 * deckhouse), or for the aft-most bay.
 */
export interface ILashingBridgeInfo {
  fore?: ILashingBridge;
  aft?: ILashingBridge;
}

/**
 * A lashing bridge. Defaults apply to every row of the bay; `perRow`
 * overrides them for stepped bridges or bridges that don't span the beam.
 */
export interface ILashingBridge extends ILashingBridgeHeight {
  /** Position of the bridge. When omitted, it is drawn at the bay's end */
  lcg?: number;
  /** Sparse per-row overrides. `tiers: 0` means no bridge in that row */
  perRow?: { [row: IIsoRowPattern]: ILashingBridgeHeight };
}

export interface ILashingBridgeHeight {
  /** Tiers the bridge reaches above the hatch cover (an "N-tier lashing bridge") */
  tiers: number;
  /**
   * Height of the top of the bridge, in mm **above the stack bottom** of the
   * row (its above-deck `bottomBase`). Wins over `tiers` when both are present.
   *
   * It is a difference, not a position, so it is unaffected by the VCG
   * rebasing the converters apply to `bottomBase`.
   */
  height?: number;
}
