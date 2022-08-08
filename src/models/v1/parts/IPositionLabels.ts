import {
  IIsoBayPattern,
  IIsoStackPattern,
  IIsoTierPattern,
} from "../../base/types/IPositionPatterns";

export default interface IPositionLabels {
  bays?: {
    [isoBay: IIsoBayPattern]: { label20?: string; label40?: string };
  };
}

export interface ITierStackLabelDictionary {
  [stack: IIsoStackPattern]: string;
}

export interface ITierStackLabelDictionaries {
  [name: string]: { [isoTier: IIsoTierPattern]: string };
}
