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

export type TValuePerContainerLength = {
  containerLenght: TContainerLengths;
  value: number;
};
