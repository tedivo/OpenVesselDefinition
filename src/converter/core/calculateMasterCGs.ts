import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IIsoTierPattern,
} from "../../models/base/types/IPositionPatterns";
import {
  IMasterCGs,
  IShipDataIntermediateStaf,
} from "../../models/v1/parts/IShipData";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ValuesSourceEnum from "../../models/base/enums/ValuesSourceEnum";
import { ValuesSourceRowTierEnum } from "../../models/base/enums/ValuesSourceRowTierEnum";
import sortRowsArray from "../../helpers/sortRowsArray";

/**
 * Extract main TCGs and VCGs. Once extracted, delete repetitions
 */
export function calculateMasterCGs(
  shipData: IShipDataIntermediateStaf,
  bls: IBayLevelDataStaf[]
): IMasterCGs {
  const extractedAboveTCGs: IInventory = {};
  const extractedBelowTCGs: IInventory = {};
  const extractedBottomBases: IInventory = {};
  const result: IMasterCGs = { aboveTcgs: {}, belowTcgs: {}, bottomBases: {} };

  const shouldProcessRows =
    shipData.tcgOptions.values !== ValuesSourceEnum.ESTIMATED;
  const shouldProcessTiers =
    shipData.vcgOptions.values !== ValuesSourceRowTierEnum.ESTIMATED;

  if (!shouldProcessRows && !shouldProcessTiers) {
    return result;
  }

  bls.forEach((bl) => {
    // A. Rows
    const perRowInfoEach = bl.perRowInfo.each;
    const perRowInfoCommon = bl.perRowInfo.common;

    if (shouldProcessRows && perRowInfoEach !== undefined) {
      const rows = Object.keys(perRowInfoEach) as IIsoRowPattern[];
      const extractedTCGs =
        bl.level === BayLevelEnum.ABOVE
          ? extractedAboveTCGs
          : extractedBelowTCGs;

      rows.forEach((row) => {
        // Create dictionary for this row if it doesn't exist
        if (!extractedTCGs[row]) extractedTCGs[row] = new Map<number, number>();
        // Gather TCG value
        const tcgValue = perRowInfoEach[row].tcg;

        if (tcgValue !== undefined) {
          // Create repetitions counter
          if (!extractedTCGs[row].has(tcgValue)) {
            extractedTCGs[row].set(tcgValue, 0);
          }
          // Annotate repetition
          extractedTCGs[row].set(
            tcgValue,
            extractedTCGs[row].get(tcgValue) + 1
          );
        }

        const vcgValue =
          perRowInfoEach[row].bottomBase || perRowInfoCommon.bottomBase;

        if (vcgValue !== undefined) {
          const tier =
            perRowInfoEach[row].bottomIsoTier || perRowInfoCommon.bottomIsoTier;

          if (!extractedBottomBases[tier])
            extractedBottomBases[tier] = new Map<number, number>();

          // Create repetitions counter
          if (!extractedBottomBases[tier].has(vcgValue)) {
            extractedBottomBases[tier].set(vcgValue, 0);
          }

          // Annotate repetition
          extractedBottomBases[tier].set(
            vcgValue,
            extractedBottomBases[tier].get(vcgValue) + 1
          );
        }
      });
    }
  });

  result.aboveTcgs = chooseMostRepeatedValue(extractedAboveTCGs, sortRowsArray);

  result.belowTcgs = chooseMostRepeatedValue(extractedBelowTCGs, sortRowsArray);

  result.bottomBases = chooseMostRepeatedValue(
    extractedBottomBases,
    (a: string, b: string) => Number(a) - Number(b)
  );

  // TODO: Remove repeated TCGs & VCGs?

  return result;
}

export interface IInventory {
  [name: IIsoRowPattern | IIsoTierPattern]: Map<number, number>;
}

export interface ISResult {
  [name: IIsoRowPattern | IIsoTierPattern]: number;
}

export function chooseMostRepeatedValue(
  e: IInventory,
  sortKeysFn?: (a: string, b: string) => number
): ISResult {
  const keys = Object.keys(e) as IIsoRowPattern[];
  const result: ISResult = {};

  keys.forEach((key) => {
    let mostRepeatedValue = undefined;
    let mostRepeatedCounter = 0;
    const repMap = e[key];

    repMap.forEach((repetitions, val) => {
      if (mostRepeatedCounter < repetitions) {
        mostRepeatedValue = val;
        mostRepeatedCounter = repetitions;
      }
    });

    result[key] = mostRepeatedValue;
  });

  if (!sortKeysFn) return result;

  return sortResult(result, sortKeysFn);
}

function sortResult(
  result: ISResult,
  sortKeysFn: (a: string, b: string) => number
) {
  return Object.keys(result)
    .sort(sortKeysFn)
    .reduce((acc, key) => {
      acc[key] = result[key];
      return acc;
    }, {});
}

export function cleanRepeatedTcgs(masterCGs: IMasterCGs, bls: IBayLevelData[]) {
  bls
    .filter((bl) => !!bl.perRowInfo)
    .forEach((bl) => {
      // A. Rows
      const perRowInfoEach = bl.perRowInfo.each;
      const rows = Object.keys(perRowInfoEach) as IIsoRowPattern[];
      const masterInfoTcgs =
        bl.level === BayLevelEnum.ABOVE
          ? masterCGs.aboveTcgs
          : masterCGs.belowTcgs;

      rows.forEach((row) => {
        const rowInfo = perRowInfoEach[row];

        if (rowInfo.tcg !== undefined && rowInfo.tcg === masterInfoTcgs[row]) {
          rowInfo.tcg = undefined;
        }
      });
    });
}
