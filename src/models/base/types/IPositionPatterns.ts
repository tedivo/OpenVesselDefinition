/** ISO Row pattern: 2 numbers */
export type IIsoRowPattern = `${number}${number}`;

/** ISO Tier pattern: 2 numbers or 3 numbers */
export type IIsoTierPattern =
  | `${number}${number}`
  | `${number}${number}${number}`;

/** ISO Bay pattern: 3 numbers */
export type IIsoBayPattern = `${number}${number}${number}`;

/** ISO Position pattern: 7 numbers */
export type IIsoPositionPattern =
  `${number}${number}${number}${number}${number}${number}${number}`;

export type ICombinedRowTierPattern =
  | `${number}${number}|${number}${number}`
  | `${number}${number}|${number}${number}${number}`;

export type IJoinedRowTierPattern =
  | `${number}${number}${number}${number}`
  | `${number}${number}${number}${number}${number}`;

/** Yes = 1, No = 0 */
export type TYesNo = 1 | 0;
