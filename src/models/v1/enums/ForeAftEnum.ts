enum ForeAftEnum {
  "FWD" = 1,
  "AFT" = 2,
}

export const getStafForeAftEnumValue = (s: "A" | "F"): ForeAftEnum => {
  if (s === "A") return ForeAftEnum.AFT;
  return ForeAftEnum.FWD;
};

export default ForeAftEnum;
