/** ISO Row pattern: 2 numbers
 * @pattern ^[0-9]{2}$
*/
export type IIsoRowPattern = `${number}${number}`;

/** ISO Tier pattern: 2 numbers or 3 numbers
 * @pattern ^([0-9][24680]|1[0-9][24680])$
 */
export type IIsoTierPattern =
  | `${number}${number}`
  | `${number}${number}${number}`;

/** ISO Bay pattern: 3 numbers 
 * @pattern ^[0-9][0-9][13579]$
*/
export type IIsoBayPattern = `${number}${number}${number}`;

/** ISO Position pattern: 7 numbers 
 * @pattern ^[0-9]{7}$
*/
export type IIsoPositionPattern =
  `${number}${number}${number}${number}${number}${number}${number}`;

/** Combined Row Tier pattern 
 * @pattern ^[0-9]{2}|[0-9]{2,3}$
*/
export type ICombinedRowTierPattern =
  | `${number}${number}|${number}${number}`
  | `${number}${number}|${number}${number}${number}`;

/** Joined Row Tier pattern
 * @pattern ^[0-9]{4,5}$
*/
export type IJoinedRowTierPattern =
  | `${number}${number}${number}${number}`
  | `${number}${number}${number}${number}${number}`;

/** Yes = 1, No = 0 
 * @pattern ^1|0$
*/
export type TYesNo = 1 | 0;
