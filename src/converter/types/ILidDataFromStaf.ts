import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IIsoBayPattern } from "../../models/base/types/IPositionPatterns";

/**
 * Lid (hatch cover) data as read from a STAF file.
 *
 * This is an **intermediate** shape: STAF describes lids per bay/level and joins
 * them by label, whereas the OVD {@link ILidData} spans a bay range.
 */
export interface ILidDataFromStaf {
  /** 3 digits ISO Bay */
  isoBay: IIsoBayPattern;
  /** Above, Below */
  level: BayLevelEnum;

  label: string;

  portIsoRow: `${number}${number}`;
  starboardIsoRow: `${number}${number}`;

  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;

  overlapPort?: string;
  overlapStarboard?: string;
}
