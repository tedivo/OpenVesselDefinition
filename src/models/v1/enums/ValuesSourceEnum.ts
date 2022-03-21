enum ValuesSourceEnum {
  "ESTIMATED" = 1,
  "KNOWN" = 2,
}

export enum ValuesSourceStackTierEnum {
  "ESTIMATED" = 1,
  "BY_TIER" = 3,
  "BY_STACK" = 4,
}

export const getStafValuesSourceEnumValue = (
  s: "Y" | "N"
): ValuesSourceEnum => {
  if (s === "Y") return ValuesSourceEnum.KNOWN;
  return ValuesSourceEnum.ESTIMATED;
};

export const getStafValuesSourceStackTierEnumValue = (
  s: "ESTIMATED" | "TIER" | "STACK"
): ValuesSourceStackTierEnum => {
  if (s === "TIER") return ValuesSourceStackTierEnum.BY_TIER;
  if (s === "STACK") return ValuesSourceStackTierEnum.BY_STACK;
  return ValuesSourceStackTierEnum.ESTIMATED;
};

export default ValuesSourceEnum;
