enum ValuesSourceEnum {
  "ESTIMATED" = 1,
  "KNOWN" = 2,
}

export enum ValuesSourceStackTierEnum {
  "ESTIMATED" = 1,
  "BY_TIER" = 3,
  "BY_STACK" = 4,
}

type TStafValuesSource = "Y" | "N";
type TStafValuesSourceStackTier = "ESTIMATED" | "TIER" | "STACK";

export const getStafValuesSourceEnumValue = (
  s: TStafValuesSource
): ValuesSourceEnum => {
  if (s === "Y") return ValuesSourceEnum.KNOWN;
  return ValuesSourceEnum.ESTIMATED;
};

export const getValuesSourceEnumValueToStaf = (
  s: ValuesSourceEnum
): TStafValuesSource => {
  if (s === ValuesSourceEnum.KNOWN) return "Y";
  return "N";
};

export const getStafValuesSourceStackTierEnumValue = (
  s: TStafValuesSourceStackTier
): ValuesSourceStackTierEnum => {
  if (s === "TIER") return ValuesSourceStackTierEnum.BY_TIER;
  if (s === "STACK") return ValuesSourceStackTierEnum.BY_STACK;
  return ValuesSourceStackTierEnum.ESTIMATED;
};

export default ValuesSourceEnum;
