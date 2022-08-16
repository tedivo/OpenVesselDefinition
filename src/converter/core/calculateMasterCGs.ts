import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoStackPattern,
  IIsoTierPattern,
} from "../../models/base/types/IPositionPatterns";
import {
  IMasterCGs,
  IShipDataIntermediateStaf,
} from "../../models/v1/parts/IShipData";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import sortStacksArray from "../../helpers/sortStacksArray";

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

  const shouldProcessStacks =
    shipData.tcgOptions.values !== ValuesSourceEnum.ESTIMATED;
  const shouldProcessTiers =
    shipData.vcgOptions.values !== ValuesSourceStackTierEnum.ESTIMATED;

  if (!shouldProcessStacks && !shouldProcessTiers) {
    return result;
  }

  bls.forEach((bl) => {
    // A. Stacks
    const perStackInfoEach = bl.perStackInfo.each;
    const perStackInfoCommon = bl.perStackInfo.common;

    if (shouldProcessStacks && perStackInfoEach !== undefined) {
      const stacks = Object.keys(perStackInfoEach) as IIsoStackPattern[];
      const extractedTCGs =
        bl.level === BayLevelEnum.ABOVE
          ? extractedAboveTCGs
          : extractedBelowTCGs;

      stacks.forEach((stack) => {
        // Create dictionary for this stack if it doesn't exist
        if (!extractedTCGs[stack])
          extractedTCGs[stack] = new Map<number, number>();
        // Gather TCG value
        const tcgValue = perStackInfoEach[stack].tcg;

        if (tcgValue !== undefined) {
          // Create repetitions counter
          if (!extractedTCGs[stack].has(tcgValue)) {
            extractedTCGs[stack].set(tcgValue, 0);
          }
          // Annotate repetition
          extractedTCGs[stack].set(
            tcgValue,
            extractedTCGs[stack].get(tcgValue) + 1
          );
        }

        const vcgValue =
          perStackInfoEach[stack].bottomBase || perStackInfoCommon.bottomBase;

        if (vcgValue !== undefined) {
          const tier =
            perStackInfoEach[stack].bottomIsoTier ||
            perStackInfoCommon.bottomIsoTier;

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

  result.aboveTcgs = chooseMostRepeatedValue(
    extractedAboveTCGs,
    sortStacksArray
  );

  result.belowTcgs = chooseMostRepeatedValue(
    extractedBelowTCGs,
    sortStacksArray
  );

  result.bottomBases = chooseMostRepeatedValue(
    extractedBottomBases,
    (a: string, b: string) => Number(a) - Number(b)
  );

  // TODO: Remove repeated TCGs & VCGs?

  return result;
}

export interface IInventory {
  [name: IIsoStackPattern | IIsoTierPattern]: Map<number, number>;
}

export interface ISResult {
  [name: IIsoStackPattern | IIsoTierPattern]: number;
}

export function chooseMostRepeatedValue(
  e: IInventory,
  sortKeysFn?: (a: string, b: string) => number
): ISResult {
  const keys = Object.keys(e) as IIsoStackPattern[];
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
    .filter((bl) => !!bl.perStackInfo)
    .forEach((bl) => {
      // A. Stacks
      const perStackInfoEach = bl.perStackInfo.each;
      const stacks = Object.keys(perStackInfoEach) as IIsoStackPattern[];
      const masterInfoTcgs =
        bl.level === BayLevelEnum.ABOVE
          ? masterCGs.aboveTcgs
          : masterCGs.belowTcgs;

      stacks.forEach((stack) => {
        const stackInfo = perStackInfoEach[stack];

        if (
          stackInfo.tcg !== undefined &&
          stackInfo.tcg === masterInfoTcgs[stack]
        ) {
          stackInfo.tcg = undefined;
        }
      });
    });
}
