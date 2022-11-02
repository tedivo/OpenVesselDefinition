import {
  IIsoRowPattern,
  IIsoTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";
import ValuesSourceEnum, {
  ValuesSourceRowTierEnum,
} from "../../base/enums/ValuesSourceEnum";

import ForeAftEnum from "../../base/enums/ForeAftEnum";
import LcgReferenceEnum from "../../base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../base/enums/PortStarboardEnum";
import PositionFormatEnum from "../../base/enums/PositionFormatEnum";
import RowWeightCalculationEnum from "../../base/enums/RowWeightCalculationEnum";
import type { TContainerLengths } from "./Types";

export default interface IShipData extends IShipDataBase {
  lcgOptions: ILCGOptions;
  vcgOptions: IVGCOptions;
  tcgOptions: ITGCOptions;

  /** All the available container lengths. 20' and 40' should be available in most of the cases */
  containersLengths: Array<TContainerLengths>;

  /** Calculated most observed CGs */
  masterCGs: IMasterCGs;

  rowWeightCalculation?: RowWeightCalculationEnum;

  /** Restrictions available in slots definitions */
  restrictions?: {
    allowCoolStowProhibited: boolean;
    allowHazardousProhibited: boolean;
  };
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
  lloydsCode?: string;
  callSign?: string;
  imoCode?: string;
  shipClass: string;

  /** Position format. Default is *BAY_STACK_TIER*: ##B#S#T */
  positionFormat: PositionFormatEnum;

  /** Note and Revisions history */
  metaInfo: IShipMeta;

  // UNUSED
  // refrigeratedContainersOptions?: IRefrigeratedContainersOptions;
  // dynamicRowWeightLimit?: TYesNo;
  // visibility?: IVisibility;
}

interface IHistory {
  personName: string;
  date: Date;
  observations: string;
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
  reference?: LcgReferenceEnum;
  orientationIncrease?: ForeAftEnum;
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
  bottomBases: {
    [tier: IIsoTierPattern]: number;
  };
}
