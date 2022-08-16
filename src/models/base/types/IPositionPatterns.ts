export type IIsoStackPattern = `${number}${number}`;

export type IIsoTierPattern =
  | `${number}${number}`
  | `${number}${number}${number}`;

export type IIsoBayPattern = `${number}${number}${number}`;

export type IIsoPositionPattern =
  `${number}${number}${number}${number}${number}${number}${number}`;

export type ICombinedStackTierPattern =
  | `${number}${number}|${number}${number}`
  | `${number}${number}|${number}${number}${number}`;

export type IJoinedStackTierPattern =
  | `${number}${number}${number}${number}`
  | `${number}${number}${number}${number}${number}`;

export type TYesNo = 1 | 0;
