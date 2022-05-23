import { IIsoStackTierPattern, TYesNo } from "./types/IPositionPatterns";

interface ISizeSummary {
  isoBays: number;
  readonly centerLineStack: TYesNo;
  readonly maxStack?: IIsoStackTierPattern;
  readonly maxAboveTier?: IIsoStackTierPattern;
  readonly minAboveTier?: IIsoStackTierPattern;
  readonly maxBelowTier?: IIsoStackTierPattern;
  readonly minBelowTier?: IIsoStackTierPattern;
}

export default ISizeSummary;
