import { IRowInfoByLengthWithAcceptsSize } from "../converter/types/IRowStafData";
import { TRowInfoByLength } from "../models/v1/parts/IBayLevelData";

/**
 * Mutates the object deleting TContainerLenghts without data
 * @param obj
 */
export function deleteMissingInfoByContLength<T>(
  obj: TWithRowAttributesByContainerLength<T>
): void {
  const sizes = Object.keys(obj.infoByContLength);

  sizes.forEach((size) => {
    const objBySize = obj.infoByContLength[size];
    const keysOfObj = Object.keys(objBySize).filter(
      (o) => objBySize[o] !== undefined
    );
    if (keysOfObj.length === 1 && objBySize.size !== undefined) {
      delete obj.infoByContLength[size];
    }
  });
}

export function deleteMissingRowInfoByLength<T>(
  obj: TWithRowAttributesByContainerLengthWithAcceptsSize<T>
): void {
  const sizes = Object.keys(obj.rowInfoByLength);

  sizes.forEach((size) => {
    const objBySize = obj.rowInfoByLength[size];
    const keysOfObj = Object.keys(objBySize).filter(
      (o) => objBySize[o] !== undefined
    );

    // Delete if doesn't accepts size
    if (
      keysOfObj.length <= 2 &&
      objBySize.size !== undefined &&
      !objBySize.acceptsSize
    ) {
      delete obj.rowInfoByLength[size];
    }
  });
}

export function deleteVerboseOptionalFalsyKeys<T>(keys: (keyof T)[]) {
  return (obj: T) => {
    keys.forEach((key) => {
      if (!obj[key]) delete obj[key];
    });
  };
}

type TWithRowAttributesByContainerLength<T> = T extends {
  infoByContLength: TRowInfoByLength;
}
  ? T
  : never;

type TWithRowAttributesByContainerLengthWithAcceptsSize<T> = T extends {
  rowInfoByLength: IRowInfoByLengthWithAcceptsSize;
}
  ? T
  : never;
