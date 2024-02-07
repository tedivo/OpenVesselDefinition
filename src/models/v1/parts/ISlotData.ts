import {
  IIsoPositionPattern,
  IJoinedRowTierPattern,
  TYesNo,
} from "../../base/types/IPositionPatterns";

import { IDangerousAndHazardous } from "./IDangerousAndHazardous";
import { TContainerLengths } from "./Types";

/**
 * This object, when present, has details per SIZE
 */
export interface ISlotSizeOptions {
  /** Cone is required */
  cone?: TYesNo;
}

/**
 * Dictionary of sizes. Value can be 0/1 (1 means the size is allowed) or an object of type {@link ISlotSizeOptions}.
 * When this later object is present it's equivalent to value 1 (the size is allowed).
 */
export type IAcceptsContainers = Partial<{
  [name in TContainerLengths]: TYesNo | ISlotSizeOptions;
}>;

export default interface ISlotData {
  /** STACK_TIER. 2 chars for Row, 2 or 3 for Tier. i.e.: 0780 or 0014 or 00100 */
  pos: IJoinedRowTierPattern;
  /** An object with sizes allowed of type {@link IAcceptsContainers} */
  sizes: IAcceptsContainers;
  /** Reefer plug? */
  reefer?: TYesNo;
  /** A slot without sizes can optionally be declared as restricted to signify the empty slot */
  restricted?: TYesNo;
  /** Cannot stow containers that need/are cool */
  coolStowProhibited?: TYesNo;
  /** Cannot stow container that are dangerous */
  hazardousProhibited?: true | IDangerousAndHazardous;
}

export interface ISlotDataIntermediate extends ISlotData {
  position?: IIsoPositionPattern;
}
