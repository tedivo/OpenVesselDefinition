import {
  IIsoBayPattern,
  IIsoRowPattern,
  IIsoTierPattern,
} from "../../base/types/IPositionPatterns";

export default interface IPositionLabels {
  bays?: {
    [isoBay: IIsoBayPattern]: { label20?: string; label40?: string };
  };
}

export interface ITierRowLabelDictionary {
  [row: IIsoRowPattern]: string;
}

export interface ITierRowLabelDictionaries {
  [name: string]: { [isoTier: IIsoTierPattern]: string };
}
