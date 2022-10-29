export type IIsoRowPattern = `${number}${number}`;

export type IIsoTierPattern =
  | `${number}${number}`
  | `${number}${number}${number}`;

export type IIsoBayPattern = `${number}${number}${number}`;

export type IIsoPositionPattern =
  `${number}${number}${number}${number}${number}${number}${number}`;

export type ICombinedRowTierPattern =
  | `${number}${number}|${number}${number}`
  | `${number}${number}|${number}${number}${number}`;

export type IJoinedRowTierPattern =
  | `${number}${number}${number}${number}`
  | `${number}${number}${number}${number}${number}`;

export type TYesNo = 1 | 0;
