export type IObjectKey<T, U extends string> = { [name in U]: T };
export type IObjectKeyArray<T, U extends string> = { [name in U]: T[] };
