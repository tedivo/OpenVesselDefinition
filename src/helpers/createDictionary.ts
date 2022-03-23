import { IObjectKey, IObjectKeyArray } from "./types/IObjectKey";

/**
 * Creates an Object from Array for a given key function
 * @param arr Array of T
 * @param keyFn Function from T to generate key of object
 * @param warnDuplicates if true will console.warn duplicated keys
 * @returns Object
 */
export function createDictionary<T, U extends string>(
  arr: T[],
  keyFn: (d: T) => string,
  warnDuplicates = false
): IObjectKey<T, U> {
  const dict = {} as IObjectKey<T, U>;
  arr.reduce((acc, sData) => {
    const key = keyFn(sData);
    if (warnDuplicates && acc[key]) console.warn(`key: "${key}" duplicated`);
    acc[key] = sData;
    return acc;
  }, dict);
  return dict;
}

/**
 * Creates a dictionary of grouped keys
 * @param arr Array of T
 * @param keyFn Function from T to generate key of object
 * @returns Object { name: T[] }
 */
export function createDictionaryMultiple<T, U extends string>(
  arr: T[],
  keyFn: (d: T) => string
): IObjectKeyArray<T, U> {
  const dict = {} as IObjectKeyArray<T, U>;
  arr.reduce((acc, sData) => {
    const key = keyFn(sData);
    if (!acc[key]) acc[key] = [];
    acc[key].push(sData);
    return acc;
  }, dict);
  return dict;
}
