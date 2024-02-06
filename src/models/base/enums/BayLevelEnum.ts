/** Bay Level */
enum BayLevelEnum {
  "ABOVE" = 1,
  "BELOW" = 2,
  "TWINDECK" = 3,
}

type TStafBayLevel = "A" | "B" | "T";

const BayLevelFromStafMapper = {
  A: 1,
  B: 2,
  T: 3,
};

const BayLevelToStafMapper: { [key in BayLevelEnum]: TStafBayLevel } = {
  [BayLevelEnum.ABOVE]: "A",
  [BayLevelEnum.BELOW]: "B",
  [BayLevelEnum.TWINDECK]: "T",
};

export const getStafBayLevelEnumValue = (s: TStafBayLevel): BayLevelEnum => {
  return BayLevelFromStafMapper[s];
};

export const getBayLevelEnumValueToStaf = (s: BayLevelEnum): TStafBayLevel => {
  return BayLevelToStafMapper[s];
};

export default BayLevelEnum;
