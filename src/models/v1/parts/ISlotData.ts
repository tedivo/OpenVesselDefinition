import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

type IAcceptsContainers = { [name in TContainerLengths]: boolean };
export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  isoPosition: `${number}${number}${number}${number}${number}${number}${number}`;
  acceptsContainers: IAcceptsContainers;
  reeferPlug?: boolean;
  restricted?: boolean;
  coolStowProhibited?: boolean;
  hazardousProhibited?: true | IDangerousAndHazardous;
}
