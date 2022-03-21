export enum WeightUnitsEnum {
  "TONNES" = 1,
  "LONG_TONS" = 2,
  "SHORT_TONS" = 3,
  "1000S_LBS" = 4,
  "KILOGRAMS" = 5,
}

export enum LengthUnitsEnum {
  "METRIC" = 1,
  "FEET" = 2,
}

export const getStafLengthUnitsEnumValue = (
  s: keyof typeof LengthUnitsEnum
): LengthUnitsEnum => {
  return LengthUnitsEnum[s];
};
