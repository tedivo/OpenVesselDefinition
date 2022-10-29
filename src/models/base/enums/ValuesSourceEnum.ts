enum ValuesSourceEnum {
  "ESTIMATED" = 1,
  "KNOWN" = 2,
}

export enum ValuesSourceRowTierEnum {
  "ESTIMATED" = 1,
  "BY_TIER" = 3,
  "BY_STACK" = 4,
}

type TStafValuesSource = "Y" | "N";
type TStafValuesSourceRowTier = "ESTIMATED" | "TIER" | "STACK";

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

export const getStafValuesSourceRowTierEnumValue = (
  s: TStafValuesSourceRowTier
): ValuesSourceRowTierEnum => {
  if (s === "TIER") return ValuesSourceRowTierEnum.BY_TIER;
  if (s === "STACK") return ValuesSourceRowTierEnum.BY_STACK;
  return ValuesSourceRowTierEnum.ESTIMATED;
};

export default ValuesSourceEnum;
