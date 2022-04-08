import {
  ICombinedStackTierPattern,
  IIsoPositionPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";
import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

type IAcceptsContainers = Partial<{ [name in TContainerLengths]: TYesNo }>;
export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  pos: IIsoPositionPattern;
  sizes: IAcceptsContainers;
  stackTier: ICombinedStackTierPattern;
  reefer?: TYesNo;
  restricted?: TYesNo;
  coolStowProhibited?: TYesNo;
  hazardousProhibited?: true | IDangerousAndHazardous;
}
