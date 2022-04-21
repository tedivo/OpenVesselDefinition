import {
  IIsoBayPattern,
  IIsoStackTierPattern,
} from "../../base/types/IPositionPatterns";

export default interface ILabelsData {
  bays: {
    [isoBay: IIsoBayPattern]: {
      label20?: string;
      label40?: string;
    };
  };
  tiers: {
    [isoTier: IIsoStackTierPattern]: { label?: string };
  };
  stacks: {
    [isoStack: IIsoStackTierPattern]: { label?: string };
  };
}
