export type TWeightUnits =
  | "TONNES"
  | "LONG_TONS"
  | "SHORT_TONS"
  | "1000S_LBS"
  | "KILOGRAMS";

export type TUnits = "METRIC" | "FEET";

export type TContainerLengths = 20 | 40 | 24 | 45 | 48 | 53;

export type TImdgClasses =
  | "1.1"
  | "1.2"
  | "1.3"
  | "1.4"
  | "1.5"
  | "1.6"
  | "2"
  | "2.1"
  | "2.2"
  | "2.3"
  | "3"
  | "3.1"
  | "3.2"
  | "3.3"
  | "4.1"
  | "4.2"
  | "4.3"
  | "5.1"
  | "5.2"
  | "6.1"
  | "6.2"
  | "7"
  | "8"
  | "9";

export type TCompatibilityGroups =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "J"
  | "K"
  | "L"
  | "N"
  | "S";

export type TUnNumber = `${number}${number}${number}${number}`;

export type TPositionFormat =
  | "BAY_STACK_TIER"
  | "BAY_TIER_STACK"
  | "STACK_BAY_TIER"
  | "STACK_TIER_BAY"
  | "TIER_BAY_STACK"
  | "TIER_STACK_BAY";

export type TStackWeightCalculation = "CONTAINER_LENGTH" | "LENGTH_40_AVG20";

export type TForeAft = "FWD" | "AFT";

export type TValuePerLenght = {
  containerLenght: TContainerLengths;
  value: number;
};
