enum ForeAftEnum {
  "FWD" = 1,
  "AFT" = 2,
}

type TStafForeAft = "A" | "F" | "-";

export const getStafForeAftEnumValue = (s: TStafForeAft): ForeAftEnum => {
  if (s === "A") return ForeAftEnum.AFT;
  if (s === "F") return ForeAftEnum.FWD;
  return undefined;
};

export const getForeAftEnumToStaf = (s: ForeAftEnum): TStafForeAft => {
  if (s === ForeAftEnum.AFT) return "A";
  if (s === ForeAftEnum.FWD) return "F";
  return "-";
};

export default ForeAftEnum;
