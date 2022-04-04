import ForeAftEnum from "../enums/ForeAftEnum";
import LcgReferenceEnum from "../enums/LcgReferenceEnum";
import PortStarboardEnum from "../enums/PortStarboardEnum";
import PositionFormatEnum from "../enums/PositionFormatEnum";
import StackWeightCalculationEnum from "../enums/StackWeightCalculationEnum";
import { LengthUnitsEnum, WeightUnitsEnum } from "../enums/UnitsEnum";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../enums/ValuesSourceEnum";
import { IDangerousAndHazardous } from "./IDangerousAndHazardous";

import type { TContainerLengths } from "./Types";

export default interface IShipData {
  lineOperator: string;
  shipName: string;

  /** Number of ISO Bays in Ship */
  isoBays: number;

  tweenDecks?: boolean;
  hatchless?: boolean;

  /** Position format. Default is *BAY_STACK_TIER*: ##B#S#T */
  positionFormat: PositionFormatEnum;

  /** All the available container lengths. 20' and 40' should be available in most of the cases */
  containersLengths: Array<TContainerLengths>;

  stackWeightCalculation: StackWeightCalculationEnum;
  dynamicStackWeightLimit?: boolean;

  dangerousAndHazardous?: IDangerousAndHazardous;

  visibility?: IVisibility;

  /** Note and Revisions history */
  metaInfo: IShipMeta;

  /** The units this file uses for lengths and weights */
  fileUnits: IFileUnits;

  lcgOptions: ILCGOptions;
  vcgOptions: IVGCOptions;
  tcgOptions: ITGCOptions;

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

interface ILCGOptions {
  values: ValuesSourceEnum;
  reference: LcgReferenceEnum;
  /** FWD or AFT */
  orientationIncrease?: ForeAftEnum;
  /** Array of two values */
  orientatonRange?: [number, number];
}

interface IVGCOptions {
  values: ValuesSourceStackTierEnum;
  ratio?: number;
}

interface ITGCOptions {
  values: ValuesSourceEnum;
  direction?: PortStarboardEnum;
}

interface IRefrigeratedContainersOptions {
  reeferPlugLimit: number;
  copyLimitFwdAft?: boolean;
}
