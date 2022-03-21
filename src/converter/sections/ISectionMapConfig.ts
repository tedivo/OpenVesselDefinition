import RecursiveKeyOf from "src/helpers/types/RecursiveKeyOf";

type ISectionMapConfig<T> =
  | ISectionMapConfigArray<T>
  | ISectionMapConfigSingle<T>;

export interface ISectionMapConfigArray<T> {
  stafSection: string;
  mapVars: { [name: string]: IMappedVarConfig<T> };
}

export interface ISectionMapConfigSingle<T> {
  stafSection: string;
  mapVars: { [name: string]: IMappedVarConfig<T> };
  singleRow: true;
}

export type IMappedVarConfig<T> =
  | IMappedVarConfigWithMapper<T>
  | IMappedVarConfigWithoutMapper<T>;

interface IMappedVarConfigWithMapper<T> {
  target: RecursiveKeyOf<T>;
  mapper: (s: string) => string | number | boolean;
  passValue?: never;
}

interface IMappedVarConfigWithoutMapper<T> {
  target: RecursiveKeyOf<T>;
  passValue: true;
  mapper?: never;
}

export default ISectionMapConfig;
