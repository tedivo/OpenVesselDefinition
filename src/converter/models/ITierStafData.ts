import BayLevelEnum from "../../models/v1/enums/BayLevelEnum";
import { IBayTierInfo } from "../../models/v1/parts/IBayLevelData";

type ITierStafData = {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** Above, Below */
  level: BayLevelEnum;
} & IBayTierInfo;

export default ITierStafData;
