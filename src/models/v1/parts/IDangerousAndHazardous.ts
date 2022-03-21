import { TCompatibilityGroups, TImdgClasses, TUnNumber } from "./Types";

export interface IDangerousAndHazardous {
  /** All the available IMDG Classes for this ship */
  imdgClasses: Array<TImdgClasses>;
  /** All the Class 1 compatibility groups allowed */
  compatibilityGroups: Array<TCompatibilityGroups>;
  /** All the restricted UN Numbers allowed */
  unNumbers?: Array<TUnNumber>;
}
