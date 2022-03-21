import BayLevelEnum from "../enums/BayLevelEnum";
import ForeAftEnum from "../enums/ForeAftEnum";
import { TContainerLengths } from "./Types";

export default interface IBayLevelData {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** Above, Below */
  level: BayLevelEnum;

  meta: {
    notes?: string;
  };

  /* AFT attribs */
  label20?: string;
  label40?: string;
  slHatch?: string;
  slForeAft?: string;

  maxHeight?: number;

  reeferPlugs?: ForeAftEnum;
  doors?: ForeAftEnum;
  pairedBay?: ForeAftEnum;
  reeferPlugLimit?: number;

  bulkhead?: {
    fore: boolean;
    foreLcg: number;
    aft: boolean;
    aftLcg: number;
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

  stackAttributesByContainerLength: Array<IStackAttributesByContainerLength>;
  perStacksInfo?: Array<IBayStackInfo>;

  tiersInfo?: Array<IBayTierInfo>;
}

interface IStackAttributesByContainerLength {
  size: TContainerLengths;
  lcg: number;
  stackWeight: number;
  bottomWeight: number;
}

interface IBayStackInfo {
  isoStack: `${number}${number}`;
  label?: string;
  maxHeight?: number;
  maxIsoTier?: `${number}${number}`;
  tcg?: number;
  hazard?: number;
  stackAttributesByContainerLength: Array<IStackAttributesByContainerLength>;
}

interface IBayTierInfo {
  isoTier: `${number}${number}`;
  label?: string;
  vcg: number;
}
