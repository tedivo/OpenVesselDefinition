import { IIsoBay } from "../../../helpers/types/IPositionPatterns";
import BayLevelEnum from "../enums/BayLevelEnum";

export default interface ILidData {
  label: string;
  /** 3 digits ISO Bay */
  isoBay: IIsoBay;
  /** Above, Below */
  level: BayLevelEnum;

  portIsoStack: `${number}${number}`;
  starboardIsoStack: `${number}${number}`;

  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;

  overlapPort?: `${number}${number}`;
  overlapStarboard?: `${number}${number}`;
}
