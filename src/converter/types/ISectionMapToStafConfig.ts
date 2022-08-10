import RecursiveKeyOf from "../../helpers/types/RecursiveKeyOf";

type ISectionMapToStafConfig<T> = ISectionMapToStafConfigArray<T>;

export interface ISectionMapToStafConfigArray<T> {
  stafSection: string;
  mapVars: IMappedVarStafMasterConfig<T>[];
  postProcessors?: Array<(d: T) => void>;
  singleRow?: boolean;
}

type IMappedVarStafMasterConfig<T> =
  | {
      stafVar: string;
      fixedValue: string;
      source?: never;
      setSelf?: [string, string | number];
    }
  | ({
      stafVar: string;
      source: RecursiveKeyOf<T>;
      setSelf?: [string, string | number];
      fixedValue?: never;
    } & (IMappedVarStafConfigWithMapper | IMappedVarStafConfigWithoutMapper));

interface IMappedVarStafConfigWithMapper {
  mapper: (s: string | number) => string | number | boolean | undefined;
  passValue?: never;
  dashIsEmpty?: never;
}

interface IMappedVarStafConfigWithoutMapper {
  passValue: true;
  dashIsEmpty: boolean;
  mapper?: never;
}

export type IMappedVarStafConfigWithArray<T, U> =
  IMappedVarStafMasterConfig<T> & {
    isArray: true;
    primaryKeyOfObjectInArray: keyof U;
    targetKeyOfObjectInArray: keyof U;
    valueOfPkOfObjectInArray: string | number | boolean;
  };

export default ISectionMapToStafConfig;
