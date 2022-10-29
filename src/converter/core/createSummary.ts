import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import ISizeSummary from "../../models/base/ISizeSummary";
import { sortNumericAsc } from "../../helpers/sortByMultipleFields";

// Used in case bayLevel data is missing
const MAX_BELOW_TIER = 66;

/**
 * Examines the data to return a summary (bays, max/min tiers and rows)
 * @returns Object { isoBays, centerLineRow, maxRow, maxAboveTier, minAboveTier, maxBelowTier, minBelowTier,}
 */
export default function createSummary({
  isoBays,
  bayLevelData,
}: {
  isoBays: number;
  bayLevelData: Array<IBayLevelDataStaf>;
}): ISizeSummary {
  const summary: ISizeSummary = {
    isoBays,
    centerLineRow: 0,
    maxRow: undefined,
    maxAboveTier: undefined,
    minAboveTier: undefined,
    maxBelowTier: undefined,
    minBelowTier: undefined,
  };

  // 0. Through Bays-Tiers
  bayLevelData.forEach((bl) => {
    addBayToSummary(bl, summary);
  });

  return summary;
}

/**
 * Mutates the summary with the maximum dimensions after checking the bl
 * @param bl Bay Data
 * @param summary Existing Summart
 */
export function addBayToSummary(bl: IBayLevelDataStaf, summary: ISizeSummary) {
  // Tiers obtained from perSlotInfo
  const tiersFromSlotsInfo = bl.perSlotInfo
    ? Object.keys(bl.perSlotInfo).map((s) => s.substring(2))
    : [];
  // Tiers obtained from perTierInfo
  const tiersFromTiersInfo = bl.perTierInfo ? Object.keys(bl.perTierInfo) : [];

  // Concat and unique
  const allTiers = tiersFromSlotsInfo
    .concat(tiersFromTiersInfo)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort(sortNumericAsc)
    .map(Number);

  if (allTiers.length) {
    const maxTier = allTiers[allTiers.length - 1];
    const minTier = allTiers[0];

    if (bl.level === BayLevelEnum.ABOVE) {
      if (summary.maxAboveTier === undefined || summary.maxAboveTier < maxTier)
        summary.maxAboveTier = maxTier;
      if (summary.minAboveTier === undefined || summary.minAboveTier > minTier)
        summary.minAboveTier = minTier;
    } else if (bl.level === BayLevelEnum.BELOW) {
      if (summary.maxBelowTier === undefined || summary.maxBelowTier < maxTier)
        summary.maxBelowTier = maxTier;
      if (summary.minBelowTier === undefined || summary.minBelowTier > minTier)
        summary.minBelowTier = minTier;
    }
  }

  const rowsFromSlotsInfo = bl.perSlotInfo
    ? Object.keys(bl.perSlotInfo).map((s) => s.substring(0, 2))
    : [];
  const rowsFromRowInfo =
    bl.perRowInfo && bl.perRowInfo.each ? Object.keys(bl.perRowInfo.each) : [];

  // Concat and unique
  const allRows = rowsFromSlotsInfo
    .concat(rowsFromRowInfo)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort()
    .map(Number);

  const bayMaxRow = allRows[allRows.length - 1];
  const bayMinRow = allRows[0];

  // Centerline row, through row definitions
  if (!summary.centerLineRow && bayMinRow === 0) summary.centerLineRow = 1;

  // Max row, through row definitions
  if (
    bayMaxRow !== undefined &&
    (summary.maxRow === undefined || summary.maxRow < bayMaxRow)
  )
    summary.maxRow = bayMaxRow;
}
