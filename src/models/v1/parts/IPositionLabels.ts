import {
  IIsoBayPattern,
  IIsoStackTierPattern,
} from "../../base/types/IPositionPatterns";

export default interface IPositionLabels {
  bays?: {
    [isoBay: IIsoBayPattern]: { label20?: string; label40?: string };
  };
  tiers?: ITierStackLabelDictionaries;
  stacks?: ITierStackLabelDictionaries;
}

export interface ITierStackLabelDictionary {
  [stack: IIsoStackTierPattern]: string;
}

export interface ITierStackLabelDictionaries {
  [name: string]: { [isoTier: IIsoStackTierPattern]: string };
}
