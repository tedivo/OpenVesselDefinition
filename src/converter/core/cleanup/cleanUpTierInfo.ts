import {
  IBayTierInfo,
  TBayTierInfoStaf,
} from "../../../models/v1/parts/IBayLevelData";

export default function cleanUpPerTierInfo(perTierInfo: TBayTierInfoStaf) {
  const tiers = Object.keys(perTierInfo);

  tiers.forEach((tier) => {
    const tierInfo: IBayTierInfo = perTierInfo[tier];
    delete tierInfo.label;
  });
}
