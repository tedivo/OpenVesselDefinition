import RecursiveKeyOf from "../../helpers/types/RecursiveKeyOf";

type ISectionMapConfig<T> = ISectionMapConfigArray<T>;

export interface ISectionMapConfigArray<T> {
  stafSection: string;
  mapVars: { [name: string]: IMappedVarConfig<T> };
  postProcessors?: Array<(d: T) => void>;
  singleRow?: boolean;
}

export type IMappedVarConfig<T> = {
  target: RecursiveKeyOf<T>;
  setSelf?: [string, string | number];
} & (IMappedVarConfigWithMapper | IMappedVarConfigWithoutMapper);

interface IMappedVarConfigWithMapper {
  mapper: (s: string) => string | number | boolean | undefined;
  passValue?: never;
  dashIsEmpty?: never;
}

interface IMappedVarConfigWithoutMapper {
  passValue: true;
  dashIsEmpty: boolean;
  mapper?: never;
}

export type IMappedVarConfigWithArray<T, U> = IMappedVarConfig<T> & {
  isArray: true;
  primaryKeyOfObjectInArray: keyof U;
  targetKeyOfObjectInArray: keyof U;
  valueOfPkOfObjectInArray: string | number | boolean;
};

export default ISectionMapConfig;
