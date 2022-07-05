import { IIsoStackTierPattern, TYesNo } from "./types/IPositionPatterns";

interface ISizeSummary {
  isoBays: number;
  centerLineStack: TYesNo;
  maxStack?: IIsoStackTierPattern;
  maxAboveTier?: IIsoStackTierPattern;
  minAboveTier?: IIsoStackTierPattern;
  maxBelowTier?: IIsoStackTierPattern;
  minBelowTier?: IIsoStackTierPattern;
}

export default ISizeSummary;
