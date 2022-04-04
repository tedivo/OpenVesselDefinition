import { IIsoPositionPattern } from "../../base/types/IPositionPatterns";
import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

type IAcceptsContainers = Partial<{ [name in TContainerLengths]: boolean }>;
export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  isoPosition: IIsoPositionPattern;
  acceptsContainers: IAcceptsContainers;
  reeferPlug?: boolean;
  restricted?: boolean;
  coolStowProhibited?: boolean;
  hazardousProhibited?: true | IDangerousAndHazardous;
}
