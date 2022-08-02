import { IIsoStackTierPattern, TYesNo } from "./types/IPositionPatterns";

interface ISizeSummary {
  isoBays: number;
  centerLineStack: TYesNo;
  maxStack?: number;
  maxAboveTier?: number;
  minAboveTier?: number;
  maxBelowTier?: number;
  minBelowTier?: number;
}

export default ISizeSummary;
