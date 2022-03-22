type TNumberPadded2 = `${number}${number}`;
type TNumberPadded3 = `${number}${number}${number}`;
type TNumberPadded7 =
  `${number}${number}${number}${number}${number}${number}${number}`;

const pad = (num: string | number, size: number): string => {
  return String(num).padStart(size, "0");
};

export const pad2 = (num: string | number) => pad(num, 2) as TNumberPadded2;

export const pad3 = (num: string | number) => pad(num, 3) as TNumberPadded3;

export const pad7 = (num: string | number) => pad(num, 7) as TNumberPadded7;

export default pad;
