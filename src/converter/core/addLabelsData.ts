import sortByMultipleFields from "../../helpers/sortByMultipleFields";
import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import IBayLevelData, {
  IBayStackInfo,
  IBayTierInfo,
  ILabelsOfBayLevel,
} from "../../models/v1/parts/IBayLevelData";
import ILabelsData from "../../models/v1/parts/ILabelsData";

/**
 * Gets the unique dictionary of labels (deleting the duplicated sources)
 * @param bayLevelData
 */
export default function addLabelsData(
  bayLevelData: IBayLevelData[]
): ILabelsData {
  const labels: ILabelsData = { bays: {}, tiers: {}, stacks: {} };

  const bayLevelDataSorted = bayLevelData
    .slice()
    .sort(
      sortByMultipleFields<IBayLevelData>([
        { name: "isoBay", ascending: true, isNumeric: true },
      ])
    );

  bayLevelDataSorted.forEach((bl: IBayLevelData & ILabelsOfBayLevel) => {
    if (!labels.bays[bl.isoBay]) labels.bays[bl.isoBay] = {};

    // Bays
    if (bl.label20) {
      labels.bays[bl.isoBay].label20 = bl.label20;
    }
    if (bl.label40) {
      labels.bays[bl.isoBay].label40 = bl.label40;
    }

    delete bl.label20; // clean-up
    delete bl.label40; // clean-up

    // Tiers
    if (bl.perTierInfo) {
      const isoTierNames = Object.keys(
        bl.perTierInfo
      ) as IIsoStackTierPattern[];

      isoTierNames.forEach((isoTierName) => {
        if (!labels.tiers[isoTierName]) labels.tiers[isoTierName] = {};
        const tier = bl.perTierInfo[isoTierName] as IBayTierInfo & ILabel;
        if (tier.label) {
          labels.tiers[isoTierName].label = tier.label;
        }
        delete tier.label;
      });
    }

    // Stacks
    if (bl.perTierInfo) {
      const isoStackNames = Object.keys(
        bl.perStackInfo
      ) as IIsoStackTierPattern[];

      isoStackNames.forEach((isoStackName) => {
        if (!labels.stacks[isoStackName]) labels.stacks[isoStackName] = {};
        const stack = bl.perStackInfo[isoStackName] as IBayStackInfo & ILabel;

        if (stack.label) {
          labels.tiers[isoStackName].label = stack.label;
        }
        delete stack.label;
      });
    }
  });

  return labels;
}

interface ILabel {
  label?: string;
}
