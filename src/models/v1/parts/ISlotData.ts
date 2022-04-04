import { IPosition } from "../../../helpers/types/IPositionPatterns";
import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

type IAcceptsContainers = Partial<{ [name in TContainerLengths]: boolean }>;
export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  isoPosition: IPosition;
  acceptsContainers: IAcceptsContainers;
  reeferPlug?: boolean;
  restricted?: boolean;
  coolStowProhibited?: boolean;
  hazardousProhibited?: true | IDangerousAndHazardous;
}
