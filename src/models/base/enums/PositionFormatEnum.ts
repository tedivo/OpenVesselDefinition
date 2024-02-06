/** Position Format (from STAF) */
export enum PositionFormatEnum {
  "BAY_STACK_TIER" = 1,
  "BAY_TIER_STACK" = 2,
  "STACK_BAY_TIER" = 3,
  "STACK_TIER_BAY" = 4,
  "TIER_BAY_STACK" = 5,
  "TIER_STACK_BAY" = 6,
}

export default PositionFormatEnum;

type TStafPositionFormat =
  | "BAY-STACK-TIER"
  | "BAY-TIER-STACK"
  | "STACK-BAY-TIER"
  | "STACK-TIER-BAY"
  | "TIER-BAY-STACK"
  | "TIER-STACK-BAY";

export const getStafPositionFormatEnumValue = (
  s: TStafPositionFormat
): PositionFormatEnum => {
  const withLowDash = s.split("-").join("_");
  return PositionFormatEnum[withLowDash];
};

export const getPositionFormatValueToStaf = (
  s: PositionFormatEnum
): TStafPositionFormat => {
  return PositionFormatEnum[s].split("_").join("-") as TStafPositionFormat;
};
