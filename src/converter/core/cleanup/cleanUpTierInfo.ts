import {
  IBayTierInfo,
  TBayTierInfo,
} from "../../../models/v1/parts/IBayLevelData";

export default function cleanUpPerTierInfo(perTierInfo: TBayTierInfo) {
  const tiers = Object.keys(perTierInfo);

  tiers.forEach((tier) => {
    const tierInfo: IBayTierInfo = perTierInfo[tier];
    delete tierInfo.label;
  });
}
