import type {
  TCompatibilityGroups,
  TContainerLengths,
  TImdgClasses,
  TPositionFormat,
  TStackWeightCalculation,
  TUnits,
  TUnNumber,
  TWeightUnits,
  TForeAft,
} from "./Types";

export default interface IShipData {
  lineOperator: string;
  shipName: string;

  /** Number of ISO Bays in Ship */
  isoBays: number;

  tweenDecks?: boolean;
  hatchless?: boolean;

  /** Position format. Default is *BAY_STACK_TIER*: ##B#S#T */
  positionFormat: TPositionFormat;

  /** All the available container lengths. 20' and 40' should be available in most of the cases */
  containersLengths: Array<TContainerLengths>;

  stackWeightCalculation: TStackWeightCalculation;
  dynamicStackWeightLimit: boolean;

  dangerousAndHazardous?: IDangerousAndHazardous;

  visibility: IVisibility;

  /** Note and Revisions history */
  metaInfo: IShipMeta;

  /** The units this file uses for lengths and weights */
  fileUnits: IFileUnits;

  lcgOptions: ILCGOptions;
  vcgOptions: IVGCOptions;
  tcgOptions: ITGCOptions;

  refrigeratedContainersOptions: IRefrigeratedContainersOptions;
}

interface IHistory {
  personName: string;
  date: Date;
  observations: string;
}

interface IFileUnits {
  /** The length units used in this file */
  lengthUnits: TUnits;
  /** The weight units used in this file */
  weightUnits: TWeightUnits;
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
  values: "KNOWN" | "ESTIMATED";
  reference: "MIDSHIPS" | "AFT_PERP" | "FWD_PERP";
  /** FWD or AFT */
  orientationIncrease: TForeAft;
  /** Array of two values */
  orientatonRange: [number, number];
}

interface IVGCOptions {
  values: "BY_TIER" | "BY_STACK" | "ESTIMATED";
  ratio: number;
}

interface ITGCOptions {
  values: "KNOWN" | "ESTIMATED";
}

interface IRefrigeratedContainersOptions {
  reeferPlugLimit: number;
  copyLimitFwdAft?: boolean;
}

interface IDangerousAndHazardous {
  /** All the available IMDG Classes for this ship */
  imdgClasses: Array<TImdgClasses>;
  /** All the Class 1 compatibility groups allowed */
  compatibilityGroups: Array<TCompatibilityGroups>;
  /** All the restricted UN Numbers allowed */
  unNumbers?: Array<TUnNumber>;
}
