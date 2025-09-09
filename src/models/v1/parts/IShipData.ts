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
import { ValuesSourceRowTierEnum } from "../../base/enums/ValuesSourceRowTierEnum";

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

export interface IShipDataIntermediateStaf extends IShipDataBase {
  lenghtUnits: "METRIC" | "BRITISH";
  lcgOptions: ILCGOptionsIntermediate;
  vcgOptions: IVGCOptionsIntermediate;
  tcgOptions: ITGCOptionsIntermediate;
}

export type IShipDataFromStaf = Pick<
  IShipDataIntermediateStaf,
  "shipClass" | "lcgOptions" | "tcgOptions" | "vcgOptions" | "positionFormat"
>;

interface IShipDataBase {
  lineOperator?: string;
  shipName?: string;
  callSign?: string;
  imoCode?: string;
  shipClass: string;
  yearBuilt?: number;

  /** Position format. Default is *BAY_STACK_TIER*: ##B#S#T */
  positionFormat: PositionFormatEnum;

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

//#region intermediate
export interface ILCGOptionsIntermediate {
  values: ValuesSourceEnum;
  reference: LcgReferenceEnum;
  /** FWD or AFT */
  orientationIncrease?: ForeAftEnum;
  lpp: number;
}

export interface IVGCOptionsIntermediate {
  values: ValuesSourceRowTierEnum;
  heightFactor?: number;
}

export interface ITGCOptionsIntermediate {
  values: ValuesSourceEnum;
  direction?: PortStarboardEnum;
}
//#endregion intermediate

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
