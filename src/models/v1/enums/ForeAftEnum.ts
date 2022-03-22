enum ForeAftEnum {
  "FWD" = 1,
  "AFT" = 2,
}

export const getStafForeAftEnumValue = (s: "A" | "F"): ForeAftEnum => {
  if (s === "A") return ForeAftEnum.AFT;
  if (s === "F") return ForeAftEnum.FWD;
  return undefined;
};

export default ForeAftEnum;
