import {
  IIsoStackTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";
import { LengthUnitsEnum, WeightUnitsEnum } from "../../base/enums/UnitsEnum";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../base/enums/ValuesSourceEnum";

import ForeAftEnum from "../../base/enums/ForeAftEnum";
import LcgReferenceEnum from "../../base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../base/enums/PortStarboardEnum";
import PositionFormatEnum from "../../base/enums/PositionFormatEnum";
import StackWeightCalculationEnum from "../../base/enums/StackWeightCalculationEnum";
import type { TContainerLengths } from "./Types";

export default interface IShipData extends IShipDataBase {
  lcgOptions: ILCGOptions;
  vcgOptions: IVGCOptions;
  tcgOptions: ITGCOptions;

  /** All the available container lengths. 20' and 40' should be available in most of the cases */
  containersLengths: Array<TContainerLengths>;

  /** Calculated most observed CGs */
  masterCGs: IMasterCGs;
}

export interface IShipDataIntermediateStaf extends IShipDataBase {
  lcgOptions: ILCGOptionsIntermediate;
  vcgOptions: IVGCOptionsIntermediate;
  tcgOptions: ITGCOptionsIntermediate;
}

interface IShipDataBase {
  lineOperator?: string;
  shipName?: string;
  lloydsCode?: string;
  callSign?: string;
  imoCode?: string;
  shipClass: string;

  /** Position format. Default is *BAY_STACK_TIER*: ##B#S#T */
  positionFormat: PositionFormatEnum;

  stackWeightCalculation: StackWeightCalculationEnum;
  dynamicStackWeightLimit?: TYesNo;

  visibility?: IVisibility;

  /** Note and Revisions history */
  metaInfo: IShipMeta;

  refrigeratedContainersOptions?: IRefrigeratedContainersOptions;
}

interface IHistory {
  personName: string;
  date: Date;
  observations: string;
}

interface IFileUnits {
  /** The length units used in this file */
  lengthUnits: LengthUnitsEnum;
  /** The weight units used in this file */
  weightUnits: WeightUnitsEnum;
}

interface IShipMeta {
  /** This notes display in the profile of the ship */
  note?: string;
  /** History of revisions */
  history?: Array<IHistory>;
}

interface IVisibility {
  observerLCG: number;
  observerVCG: number;
  bowLCG: number;
  bowVCG: number;
  sternLCG: number;
}

export interface ILCGOptions {
  values: ValuesSourceEnum;
  lpp: number;
}

export interface IVGCOptions {
  values: ValuesSourceEnum;
  heightFactor?: number;
}

export interface ITGCOptions {
  values: ValuesSourceEnum;
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
  values: ValuesSourceStackTierEnum;
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
    [stack: IIsoStackTierPattern]: number;
  };
  belowTcgs: {
    [stack: IIsoStackTierPattern]: number;
  };
  bottomBases: {
    [tier: IIsoStackTierPattern]: number;
  };
}

export type IShipDataFromStaf = Pick<
  IShipDataIntermediateStaf,
  "shipClass" | "lcgOptions" | "tcgOptions" | "vcgOptions" | "positionFormat"
>;
