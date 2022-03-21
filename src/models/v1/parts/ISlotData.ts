import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  isoPosition: `${number}${number}${number}${number}${number}${number}${number}`;
  acceptsContainers: Array<TContainerLengths>;
  reeferPlug?: boolean;
  restricted?: boolean;
  coolStowProhibited?: boolean;
  hazardousProhibited?: IDangerousAndHazardous;
}
