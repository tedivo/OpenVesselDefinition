import IPositionLabels, {
  ITierRowLabelDictionaries,
  ITierRowLabelDictionary,
} from "../../models/v1/parts/IPositionLabels";

import { IBayLevelDataStaf } from "../../models/v1/parts/IBayLevelData";
import { pad2 } from "../../helpers/pad";

/**
 * Obtains a dictionary of labels (for bays, tiers and rows)
 */
export default function substractLabels(
  data: IBayLevelDataStaf[]
): IPositionLabels {
  const positionLabels: IPositionLabels = {
    bays: {},
  };

  data.forEach((bayLevelData) => {
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
      positionLabels.bays[bayLevelData.isoBay].label40 = pad2(
        Number(bayLevelData.isoBay) + 1
      );
    }
  });

  return positionLabels;
}

/**
 * Calculates a dictionary hash for comparison
 * @returns hash
 */
export function dictionaryHash(dict: ITierRowLabelDictionary): string {
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
  dictToCompare: ITierRowLabelDictionary,
  existingDictionaries: ITierRowLabelDictionaries
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
