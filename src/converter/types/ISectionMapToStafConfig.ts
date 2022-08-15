import RecursiveKeyOf from "../../helpers/types/RecursiveKeyOf";

type ISectionMapToStafConfig<T, U> = ISectionMapToStafConfigArray<T, U>;

export interface ISectionMapToStafConfigArray<T, U> {
  stafSection: string;
  mapVars: IMappedVarStafMasterConfig<T, U>[];
  postProcessors?: Array<(d: T) => void>;
  preProcessor?: (d: unknown[], extra?: unknown) => T[];
  singleRow?: boolean;
}

type IMappedVarStafMasterConfig<T, U> =
  | {
      stafVar: string;
      fixedValue: string;
      source?: never;
      setSelf?: [string, string | number];
    }
  | IMappedVarStafConfigWithSource<T, U>;

type IMappedVarStafConfigWithSource<T, U> = {
  stafVar: string;
  source: RecursiveKeyOf<U>;
  setSelf?: [string, string | number];
  fixedValue?: never;
} & (IMappedVarStafConfigWithMapper<U> | IMappedVarStafConfigWithoutMapper);

interface IMappedVarStafConfigWithMapper<U> {
  mapper: (s: string | number, record?: U) => string | undefined;
  passValue?: never;
}

interface IMappedVarStafConfigWithoutMapper {
  passValue: true;
  mapper?: never;
}

export default ISectionMapToStafConfig;
