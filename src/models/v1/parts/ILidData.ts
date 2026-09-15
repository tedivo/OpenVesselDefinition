import { IIsoBayPattern, TYesNo } from "../../base/types/IPositionPatterns";

export default interface ILidData {
  label: string;

  portIsoRow: `${number}${number}`;
  starboardIsoRow: `${number}${number}`;

  startIsoBay: IIsoBayPattern;
  endIsoBay: IIsoBayPattern;

  overlapPort?: TYesNo;
  overlapStarboard?: TYesNo;

  weight?: number;
}
