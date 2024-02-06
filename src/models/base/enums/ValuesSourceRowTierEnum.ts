/** CGs Values Source (from STAF) */
export enum ValuesSourceRowTierEnum {
  "ESTIMATED" = 1,
  "BY_TIER" = 3,
  "BY_STACK" = 4,
}

export type TStafValuesSourceRowTier = "ESTIMATED" | "TIER" | "STACK";

export const getStafValuesSourceRowTierEnumValue = (
  s: TStafValuesSourceRowTier
): ValuesSourceRowTierEnum => {
  if (s === "TIER") return ValuesSourceRowTierEnum.BY_TIER;
  if (s === "STACK") return ValuesSourceRowTierEnum.BY_STACK;
  return ValuesSourceRowTierEnum.ESTIMATED;
};

export const getValuesSourceRowTierEnumValueToStaf = (
  s: ValuesSourceRowTierEnum
): TStafValuesSourceRowTier | "N" => {
  if (Number(s) === ValuesSourceRowTierEnum.ESTIMATED) return "N";
  return "STACK";
};
