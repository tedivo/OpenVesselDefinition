import {
  IIsoRowPattern,
  IIsoTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";

import BayLevelEnum from "../../base/enums/BayLevelEnum";
import ForeAftEnum from "../../base/enums/ForeAftEnum";
import { IIsoBayPattern } from "../../base/types/IPositionPatterns";
import LcgReferenceEnum from "../../base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../base/enums/PortStarboardEnum";
import PositionFormatEnum from "../../base/enums/PositionFormatEnum";
import RowWeightCalculationEnum from "../../base/enums/RowWeightCalculationEnum";
import type { TContainerLengths } from "./Types";
import ValuesSourceEnum from "../../base/enums/ValuesSourceEnum";

export default interface IShipData extends IShipDataBase {
  lcgOptions: ILCGOptions;
  vcgOptions: IVGCOptions;
  tcgOptions: ITGCOptions;

  /** All the available container lengths. 20' and 40' should be available in most of the cases */
  containersLengths: Array<TContainerLengths>;

  /** Calculated most observed CGs */
  masterCGs: IMasterCGs;

  rowWeightCalculation?: RowWeightCalculationEnum;

  /** Features allowed in slot or bay definitions */
  featuresAllowed?: IFeaturesAllowed;

  /** LOA: Lenght Overall */
  loa?: number;
  /** Distance from Ster to Aft Perpendicular */
  sternToAftPp?: number;
}

export interface IShipDataBase {
  lineOperator?: string;
  shipName?: string;
  callSign?: string;
  imoCode?: string;
  shipClass: string;
  yearBuilt?: number;

  /** Position format. Default is *BAY_STACK_TIER*: ##B#S#T */
  positionFormat: PositionFormatEnum;

  /**
   * In a pair of bays that together hold 40'+ containers, which of the two
   * bays carries the 40'+ definitions (slots, LCGs, weights): the FWD bay or
   * the AFT bay of the pair.
   *
   * This is an *authoring convention*, not a property of the vessel: the same
   * ship can be described either way. It is declared once, at ship level, so
   * that every paired bay in the file follows the same rule.
   *
   * Optional, and not enforced by this schema. Older definitions omit it and
   * some may be internally inconsistent; tools are expected to detect the
   * dominant convention, write it here, and normalise the bays to match.
   *
   * @see {@link IBayLevelData.pairedBay} - note its value refers to the *other*
   * bay of the pair, whereas this one names the bay holding the 40'+ data.
   */
  bay40sLocation?: ForeAftEnum;

  /** Note and Revisions history */
  metaInfo?: IShipMeta;

  /** Ship _also known as_ Names */
  shipNameAkas?: string[];

  // UNUSED
  // refrigeratedContainersOptions?: IRefrigeratedContainersOptions;
  // dynamicRowWeightLimit?: TYesNo;
  // visibility?: IVisibility;
}

interface IShipMeta {
  /** This notes display in the profile of the ship */
  note?: string;
}

interface IVisibility {
  observerLCG: number;
  observerVCG: number;
  bowLCG: number;
  bowVCG: number;
  sternLCG: number;
}

export interface IFeaturesAllowed {
  slotCoolStowProhibited: boolean;
  slotHazardousProhibited: boolean;
  slotConeRequired: boolean;
}

export interface ILCGOptions {
  values: ValuesSourceEnum;
  lpp: number;
  reference?: LcgReferenceEnum;
  orientationIncrease?: ForeAftEnum;
  originalDataSource?: {
    reference?: LcgReferenceEnum;
    orientationIncrease?: ForeAftEnum;
  };
}

export interface IVGCOptions {
  values: ValuesSourceEnum;
  heightFactor?: number;
}

export interface ITGCOptions {
  values: ValuesSourceEnum;
  direction?: PortStarboardEnum;
}

interface IRefrigeratedContainersOptions {
  reeferPlugLimit: number;
  copyLimitFwdAft?: TYesNo;
}

export interface IMasterCGs {
  aboveTcgs: {
    [row: IIsoRowPattern]: number;
  };
  belowTcgs: {
    [row: IIsoRowPattern]: number;
  };
  /** Bottom bases for each tier, absolute values */
  bottomBases: {
    [tier: IIsoTierPattern]: number;
  };

  /** For manual adjustment of bottom bases (+/- offset).
   * Relative to mid bottom base (deck). Only used for missing bottom bases (No VCGs) */
  offsetBottomBases?: Array<IBayLevelOffsetBottomBase>;
}

export interface IBayLevelOffsetBottomBase {
  bays: IIsoBayPattern[];
  level: BayLevelEnum;
  offset: number;
}
