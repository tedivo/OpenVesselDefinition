import { TYesNo } from "./types/IPositionPatterns";

interface ISizeSummary {
  isoBays: number;
  centerLineRow: TYesNo;
  maxRow?: number;
  maxAboveTier?: number;
  minAboveTier?: number;
  maxBelowTier?: number;
  minBelowTier?: number;
}

export default ISizeSummary;
