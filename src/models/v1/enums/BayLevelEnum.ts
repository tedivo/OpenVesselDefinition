enum BayLevelEnum {
  "ABOVE" = 1,
  "BELOW" = 2,
  "TWINDECK" = 3,
}

export const getStafBayLevelEnumValue = (s: "A" | "B" | "T"): BayLevelEnum => {
  if (s === "A") return BayLevelEnum.ABOVE;
  if (s === "B") return BayLevelEnum.BELOW;
  if (s === "T") return BayLevelEnum.TWINDECK;
  return undefined;
};

export default BayLevelEnum;
