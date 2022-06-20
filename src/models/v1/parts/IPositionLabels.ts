import {
  IIsoBayPattern,
  IIsoStackTierPattern,
} from "../../base/types/IPositionPatterns";

export default interface IPositionLabels {
  bays?: {
    [isoBay: IIsoBayPattern]: { label20?: string; label40?: string };
  };
}

export interface ITierStackLabelDictionary {
  [stack: IIsoStackTierPattern]: string;
}

export interface ITierStackLabelDictionaries {
  [name: string]: { [isoTier: IIsoStackTierPattern]: string };
}
