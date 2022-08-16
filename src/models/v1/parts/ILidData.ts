import { IIsoBayPattern, TYesNo } from "../../base/types/IPositionPatterns";

import BayLevelEnum from "../../base/enums/BayLevelEnum";

export default interface ILidData {
  label: string;

  portIsoStack: `${number}${number}`;
  starboardIsoStack: `${number}${number}`;

  startIsoBay: IIsoBayPattern;
  endIsoBay: IIsoBayPattern;

  overlapPort?: TYesNo;
  overlapStarboard?: TYesNo;

  weight?: number;
}

export interface ILidDataFromStaf {
  /** 3 digits ISO Bay */
  isoBay: IIsoBayPattern;
  /** Above, Below */
  level: BayLevelEnum;

  label: string;

  portIsoStack: `${number}${number}`;
  starboardIsoStack: `${number}${number}`;

  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;

  overlapPort?: string;
  overlapStarboard?: string;
}
