import IShipData, { IMasterCGs } from "../../models/v1/parts/IShipData";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import sortStacksArray from "../../helpers/sortStacksArray";

/**
 * Extract main TCGs and VCGs. Once extracted, delete repetitions
 */
export function calculateMasterCGs(
  shipData: IShipData,
  bls: IBayLevelData[]
): IMasterCGs {
  const extractedAboveTCGs: IInventory = {};
  const extractedBelowTCGs: IInventory = {};
  const extractedVCGs: IInventory = {};
  const result = new MasterCGs();

  const shouldProcessStacks =
    shipData.tcgOptions.values !== ValuesSourceEnum.ESTIMATED;
  const shouldProcessTiers =
    shipData.vcgOptions.values !== ValuesSourceStackTierEnum.ESTIMATED;

  if (!shouldProcessStacks && !shouldProcessTiers) {
    return result;
  }

  bls.forEach((bl) => {
    // A. Stacks
    const perStackInfo = bl.perStackInfo;
    if (shouldProcessStacks && perStackInfo !== undefined) {
      const stacks = Object.keys(perStackInfo) as IIsoStackTierPattern[];
      const extractedTCGs =
        bl.level === BayLevelEnum.ABOVE
          ? extractedAboveTCGs
          : extractedBelowTCGs;

      stacks.forEach((stack) => {
        // Create dictionary for this stack if it doesn't exist
        if (!extractedTCGs[stack])
          extractedTCGs[stack] = new Map<number, number>();
        // Gather TCG value
        const tcgValue = perStackInfo[stack].tcg;

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
      });
    }

    // B. Tiers
    if (
      shouldProcessTiers &&
      shipData.vcgOptions.values === ValuesSourceStackTierEnum.BY_TIER
    ) {
      const perTierInfo = bl.perTierInfo;
      const tiers = Object.keys(perTierInfo) as IIsoStackTierPattern[];

      tiers.forEach((tier) => {
        // Create dictionary for this stack if it doesn't exist
        if (!extractedVCGs[tier])
          extractedVCGs[tier] = new Map<number, number>();
        // Gather TCG value
        const vcgValue = perTierInfo[tier].vcg;

        if (vcgValue !== undefined) {
          // Create repetitions counter
          if (!extractedVCGs[tier].has(vcgValue)) {
            extractedVCGs[tier].set(vcgValue, 0);
          }
          // Annotate repetition
          extractedVCGs[tier].set(
            vcgValue,
            extractedVCGs[tier].get(vcgValue) + 1
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

  result.vcgs = chooseMostRepeatedValue(
    extractedVCGs,
    (a: string, b: string) => Number(a) - Number(b)
  );

  return result;
}

export interface IInventory {
  [name: IIsoStackTierPattern]: Map<number, number>;
}

export interface ISResult {
  [name: IIsoStackTierPattern]: number;
}

export function chooseMostRepeatedValue(
  e: IInventory,
  sortKeysFn?: (a: string, b: string) => number
): ISResult {
  const keys = Object.keys(e) as IIsoStackTierPattern[];
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

function makeJsonFromObject(
  result: ISResult,
  sortKeysFn: (a: string, b: string) => number
): string[] {
  return Object.keys(result)
    .sort(sortKeysFn)
    .map((key) => {
      return `\t"${key}": ${result[key]}`;
    });
}

class MasterCGs implements IMasterCGs {
  aboveTcgs: {};
  belowTcgs: {};
  vcgs: {};
}
