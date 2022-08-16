type TNumberPadded2 = `${number}${number}`;
type TNumberPadded3 = `${number}${number}${number}`;
export type TNumberPadded7 =
  `${number}${number}${number}${number}${number}${number}${number}`;

const pad = (num: string | number, size: number): string => {
  return String(num).padStart(size, "0");
};

export const pad2 = (num: string | number) => pad(num, 2) as TNumberPadded2;

export const pad3 = (num: string | number) => pad(num, 3) as TNumberPadded3;

export const pad7 = (num: string | number) => pad(num, 7) as TNumberPadded7;

export default pad;

export const safePad2 = (
  num: string | number | undefined
): TNumberPadded2 | "-" => {
  if (num === undefined) return "-";
  const v = Number(num);
  if (isNaN(v)) return "-";
  return pad2(v);
};

export const safePad6 = (
  num: string | number | undefined
): `${number}${number}${number}${number}${number}${number}` | "-" => {
  if (num === undefined) return "-";
  const v = Number(num);
  if (isNaN(v)) return "-";
  return pad(v, 6) as `${number}${number}${number}${number}${number}${number}`;
};
