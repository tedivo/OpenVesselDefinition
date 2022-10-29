import {
  IIsoPositionPattern,
  IJoinedRowTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";

import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";
import VoidTypesEnum from "../../base/enums/VoidTypesEnum";

type IAcceptsContainers = Partial<{ [name in TContainerLengths]: TYesNo }>;
export default interface ISlotData {
  /** Position: BAY_STACK_TIER */
  position?: IIsoPositionPattern;
  pos: IJoinedRowTierPattern;
  sizes: IAcceptsContainers;
  reefer?: TYesNo;
  restricted?: VoidTypesEnum;
  coolStowProhibited?: TYesNo;
  hazardousProhibited?: true | IDangerousAndHazardous;
}
