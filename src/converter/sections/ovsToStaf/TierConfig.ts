import BayLevelEnum, {
  getBayLevelEnumValueToStaf,
} from "../../../models/base/enums/BayLevelEnum";
import { pad2, safePad2 } from "../../../helpers/pad";

import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import { IJoinedStackTierPattern } from "../../../models/base/types/IPositionPatterns";
import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import ITierStafData from "../../types/ITierStafData";
import { SHIP_EDITOR_MIN_TIER } from "./consts";
import { getStackAndTiersFromSlotKeys } from "../../../helpers/getStackAndTiersFromSlotKeys";
import sortByMultipleFields from "../../../helpers/sortByMultipleFields";

/**
 * DEFINITION of Tier
 */
const TierConfig: ISectionMapToStafConfig<ITierStafData, ITierStafData> = {
  stafSection: "TIER",
  mapVars: [
    { stafVar: "STAF BAY", source: "isoBay", mapper: safePad2 },
    { stafVar: "LEVEL", source: "level", mapper: getBayLevelEnumValueToStaf },
    { stafVar: "ISO TIER", source: "isoTier", passValue: true },
    { stafVar: "CUSTOM TIER", source: "label", mapper: (s: string) => s },
    { stafVar: "TIER VCG", fixedValue: "-" },
  ],
  preProcessor: createStackTierData,
};

export default TierConfig;

function createStackTierData(bayData: IBayLevelData[]): ITierStafData[] {
  const bls = bayData.slice().sort(
    sortByMultipleFields([
      { name: "isoBay", ascending: true },
      { name: "level", ascending: true },
    ])
  );

  const tiersData: ITierStafData[] = [];

  bls.forEach((bl) => {
    const slotKeys = bl.perSlotInfo
      ? (Object.keys(bl.perSlotInfo) as IJoinedStackTierPattern[])
      : [];

    const { minTier, maxTier } = getStackAndTiersFromSlotKeys(slotKeys);
    const iMinTier = minTier ? Number(minTier) : undefined;

    if (
      bl.level === BayLevelEnum.ABOVE &&
      iMinTier !== undefined &&
      iMinTier < SHIP_EDITOR_MIN_TIER
    ) {
      const iMaxTier = Number(maxTier);
      const minus = SHIP_EDITOR_MIN_TIER - iMinTier;
      for (let t = iMinTier; t <= iMaxTier; t += 2) {
        const tData: ITierStafData = {
          isoBay: bl.isoBay,
          level: bl.level,
          isoTier: pad2(t + minus),
          label: pad2(t),
          vcg: undefined,
        };

        tiersData.push(tData);
      }
      // Add Empty after
      for (let t = iMaxTier + 2; t <= iMaxTier + minus; t += 2) {
        const tData: ITierStafData = {
          isoBay: bl.isoBay,
          level: bl.level,
          isoTier: pad2(t + minus),
          label: "",
          vcg: undefined,
        };

        tiersData.push(tData);
      }
    }
  });

  return tiersData;
}
