import { IIsoStackTierPattern } from "../models/base/types/IPositionPatterns";
import IBayLevelData from "../models/v1/parts/IBayLevelData";
import IPositionLabels, {
  ITierStackLabelDictionary,
  ITierStackLabelDictionaries,
} from "../models/v1/parts/IPositionLabels";
import { pad3 } from "./pad";

/**
 * Obtains a dictionary of labels (for bays, tiers and stacks)
 */
export default function substractLabels(
  data: IBayLevelData[]
): IPositionLabels {
  const positionLabels: IPositionLabels = {
    bays: {},
    tiers: {},
    stacks: {},
  };

  let incrementalForTiers = 1;
  let incrementalForStacks = 1;

  data.forEach((bayLevelData) => {
    const tierLabels: ITierStackLabelDictionary = {};
    const stackLabels: ITierStackLabelDictionary = {};

    // 1. ISO Bay levels
    if (!positionLabels.bays[bayLevelData.isoBay])
      positionLabels.bays[bayLevelData.isoBay] = {};

    if (bayLevelData.label20) {
      positionLabels.bays[bayLevelData.isoBay].label20 = bayLevelData.label20;
    } else {
      positionLabels.bays[bayLevelData.isoBay].label20 = bayLevelData.isoBay;
    }

    if (bayLevelData.label40) {
      positionLabels.bays[bayLevelData.isoBay].label40 = bayLevelData.label40;
    } else {
      positionLabels.bays[bayLevelData.isoBay].label40 = pad3(
        Number(bayLevelData.isoBay) + 1
      );
    }

    // 2. ISO Tiers
    const tiers = Object.keys(
      bayLevelData.perTierInfo
    ) as IIsoStackTierPattern[];
    tiers.forEach((tier) => {
      if (bayLevelData.perTierInfo[tier].label) {
        tierLabels[tier] = bayLevelData.perTierInfo[tier].label;
      }
    });

    // 3. ISO Stacks
    const stacks = Object.keys(
      bayLevelData.perStackInfo
    ) as IIsoStackTierPattern[];
    stacks.forEach((stack) => {
      if (bayLevelData.perStackInfo[stack].label) {
        stackLabels[stack] = bayLevelData.perStackInfo[stack].label;
      }
    });

    // 4.a Check if tier labels definitions exist
    if (dictionaryHash(tierLabels) !== "") {
      let tierDictName = getExistingDictionaryLabelsName(
        tierLabels,
        positionLabels.tiers
      );
      if (!tierDictName) {
        tierDictName = `tiers-labels-${incrementalForTiers++}`;
        positionLabels.tiers[tierDictName] = tierLabels;
      }
      bayLevelData.tiersLabelsDictionary = tierDictName;
    }

    // 4.b Check if tier labels definitions exist
    if (dictionaryHash(stackLabels) !== "") {
      let stackDictName = getExistingDictionaryLabelsName(
        stackLabels,
        positionLabels.stacks
      );
      if (!stackDictName) {
        stackDictName = `stacks-labels-${incrementalForStacks++}`;
        positionLabels.stacks[stackDictName] = stackLabels;
      }
      bayLevelData.stacksLabelsDictionary = stackDictName;
    }
  });

  return positionLabels;
}

/**
 * Calculates a dictionary hash for comparison
 * @returns hash
 */
export function dictionaryHash(dict: ITierStackLabelDictionary): string {
  return Object.keys(dict)
    .sort()
    .filter((key) => dict[key] !== undefined)
    .map((key) => `${key}-${dict[key]}`)
    .join("|");
}

/**
 *
 * @param dictToCompare Dictionary to be found as existing
 * @param existingDictionaries Existing dictionaries
 * @returns the name of the dictionary (if exists only)
 */
export function getExistingDictionaryLabelsName(
  dictToCompare: ITierStackLabelDictionary,
  existingDictionaries: ITierStackLabelDictionaries
): string {
  const dictToCompareHash = dictionaryHash(dictToCompare);
  const dictNames = Object.keys(existingDictionaries);

  for (let i = 0; i < dictNames.length; i += 1) {
    let currentHash = dictionaryHash(existingDictionaries[dictNames[i]]);
    if (currentHash === dictToCompareHash) {
      return dictNames[i];
    }
  }

  return "";
}
