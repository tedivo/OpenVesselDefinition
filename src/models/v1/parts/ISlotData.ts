import {
  IIsoPositionPattern,
  IJoinedStackTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";
import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

type IAcceptsContainers = Partial<{ [name in TContainerLengths]: TYesNo }>;
export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  position: IIsoPositionPattern;
  pos: IJoinedStackTierPattern;
  sizes: IAcceptsContainers;
  reefer?: TYesNo;
  restricted?: TYesNo;
  coolStowProhibited?: TYesNo;
  hazardousProhibited?: true | IDangerousAndHazardous;
}
