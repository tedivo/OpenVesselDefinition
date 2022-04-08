export enum PositionFormatEnum {
  "BAY_STACK_TIER" = 1,
  "BAY_TIER_STACK" = 2,
  "STACK_BAY_TIER" = 3,
  "STACK_TIER_BAY" = 4,
  "TIER_BAY_STACK" = 5,
  "TIER_STACK_BAY" = 6,
}

export default PositionFormatEnum;

export const getStafPositionFormatEnumValue = (
  s:
    | "BAY-STACK-TIER"
    | "BAY-TIER-STACK"
    | "STACK-BAY-TIER"
    | "STACK-TIER-BAY"
    | "TIER-BAY-STACK"
    | "TIER-STACK-BAY"
): PositionFormatEnum => {
  const withLowDash = s.split("-").join("_");
  return PositionFormatEnum[withLowDash];
};
