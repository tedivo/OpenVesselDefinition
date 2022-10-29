import { IRowInfoByLengthWithAcceptsSize } from "../../types/IRowStafData";
import { TBayRowInfo } from "../../../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../../../models/v1/parts/Types";

export function cleanUpRowInfo(perRowInfo: TBayRowInfo) {
  const rows = Object.keys(perRowInfo.each);

  rows.forEach((row) => {
    delete perRowInfo.each[row].label;

    const rowInfoByLength = perRowInfo.each[row].rowInfoByLength;

    if (rowInfoByLength) {
      const sizes = Object.keys(rowInfoByLength).map(
        Number
      ) as TContainerLengths[];

      sizes.forEach((size) => {
        const attrs = rowInfoByLength[size] as IRowInfoByLengthWithAcceptsSize;

        // Clean-up "acceptsSize" property
        delete attrs.acceptsSize;

        // Get keys
        const keysOfObj = Object.keys(attrs).filter(
          (o) => attrs[o] !== undefined
        );

        // Clean-up all size object if doesn't accepts size
        if (keysOfObj.length <= 1 && attrs.size !== undefined) {
          delete rowInfoByLength[size];
        }
      });

      const keysOfObj = Object.keys(rowInfoByLength).filter(
        (o) => rowInfoByLength[o] !== undefined
      );

      if (keysOfObj.length === 0) {
        delete perRowInfo.each[row].rowInfoByLength;
      }
    }
  });
}
