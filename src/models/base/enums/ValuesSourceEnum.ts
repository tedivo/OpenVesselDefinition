/** CGs Values Source (from STAF) */
enum ValuesSourceEnum {
  "ESTIMATED" = 1,
  "KNOWN" = 2,
}

type TStafValuesSource = "Y" | "N";
export const getStafValuesSourceEnumValue = (
  s: TStafValuesSource
): ValuesSourceEnum => {
  if (s === "Y") return ValuesSourceEnum.KNOWN;
  return ValuesSourceEnum.ESTIMATED;
};

export const getValuesSourceEnumValueToStaf = (
  s: ValuesSourceEnum
): TStafValuesSource => {
  if (Number(s) === ValuesSourceEnum.KNOWN) return "Y";
  return "N";
};

export default ValuesSourceEnum;
