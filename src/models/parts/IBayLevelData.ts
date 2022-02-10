import { TContainerLengths, TForeAft, TValuePerLenght } from "./Types";

export default interface IBayLevelData {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** "A": Above, "B": Below */
  level: "A" | "B";

  meta: {
    notes?: string;
  };

  name20?: string;
  name40?: string;
  slHatch?: string;
  slForeAft?: string;

  maxHeight?: number;

  reeferPlugs?: TForeAft;
  doors?: TForeAft;
  pairedBay?: TForeAft;
  reeferPlugLimit?: [number, number];

  bulkhead?: {
    exists: true;
    lcg: number;
  };

  centerLineStack?: boolean;
  athwartShip?: boolean;
  foreHatch?: boolean;
  ventilated?: boolean;
  nearBow?: boolean;
  nearStern?: boolean;
  heatSrcFore?: boolean;
  ignitionSrcFore?: boolean;
  quartersFore?: boolean;
  engineRmBulkfore?: boolean;

  lcgsBySize: Array<ILCGBySize>;

  stacksInfo?: Array<IBayStackInfo>;
  tiersInfo?: Array<IBayTierInfo>;
}

interface ILCGBySize {
  size: TContainerLengths;
  lcg: number;
  stackWeight: number;
  bottomWeight: number;
}

interface IBayStackInfo {
  isoStack: `${number}${number}`;
  maxHeight?: number;
  tcg?: number;
  hazard?: number;
  lcg: Array<TValuePerLenght>;
  stackWeights?: Array<TValuePerLenght>;
  bottomWeights?: Array<TValuePerLenght>;
}

interface IBayTierInfo {
  isoTier: `${number}${number}`;
  vcg: number;
}
