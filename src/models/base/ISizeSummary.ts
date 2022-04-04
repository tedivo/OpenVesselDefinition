import { IIsoStackTierPattern } from "./types/IPositionPatterns";

interface ISizeSummary {
  readonly isoBays: number;
  readonly centerLineStack: boolean;
  readonly maxStack: IIsoStackTierPattern;
  readonly maxAboveTier?: IIsoStackTierPattern;
  readonly minAboveTier?: IIsoStackTierPattern;
  readonly maxBelowTier?: IIsoStackTierPattern;
  readonly minBelowTier?: IIsoStackTierPattern;
}

export default ISizeSummary;
