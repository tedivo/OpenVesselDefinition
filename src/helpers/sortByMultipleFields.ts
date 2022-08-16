export default function sortByMultipleFields<T>(
  fields: Array<ISortByField<T>>
): (a: T, b: T) => number {
  const compareString = (a: T[keyof T], b: T[keyof T]) =>
    String(a).localeCompare(String(b));
  const compareNumber = (a: T[keyof T], b: T[keyof T]) => Number(a) - Number(b);

  return (a: T, b: T) =>
    fields
      .map(({ name, ascending, isNumeric }) => {
        const dir = ascending ? 1 : -1;
        const compareFn = isNumeric ? compareNumber : compareString;
        if (compareFn(a[name], b[name]) > 0) return dir;
        if (compareFn(a[name], b[name]) < 0) return -dir;
        return 0;
      })
      .reduce((p, n) => (p ? p : n), 0);
}

export interface ISortByField<T> {
  name: keyof T;
  ascending: boolean;
  isNumeric?: boolean;
}

/**
 * Sort function for array.sort(), Numeric Ascending
 */
export function sortNumericAsc(a: string | number, b: string | number): number {
  return Number(a) - Number(b);
}

/**
 * Sort function for array.sort(), Numeric Descending
 */
export function sortNumericDesc(a: string, b: string): number {
  return Number(b) - Number(a);
}
