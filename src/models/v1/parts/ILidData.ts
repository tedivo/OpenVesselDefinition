import { IIsoBayPattern } from "../../base/types/IPositionPatterns";
import BayLevelEnum from "../../base/enums/BayLevelEnum";

export default interface ILidData {
  label: string;
  /** 3 digits ISO Bay */
  isoBay: IIsoBayPattern;
  /** Above, Below */
  level: BayLevelEnum;

  portIsoStack: `${number}${number}`;
  starboardIsoStack: `${number}${number}`;

  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;

  overlapPort?: `${number}${number}`;
  overlapStarboard?: `${number}${number}`;
}
