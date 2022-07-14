import { IStackInfoByLengthWithAcceptsSize } from "../converter/models/IStackStafData";
import { TStackInfoByLength } from "../models/v1/parts/IBayLevelData";

/**
 * Mutates the object deleting TContainerLenghts without data
 * @param obj
 */
export function deleteMissingInfoByContLength<T>(
  obj: TWithStackAttributesByContainerLength<T>
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

export function deleteMissingStackInfoByLength<T>(
  obj: TWithStackAttributesByContainerLengthWithAcceptsSize<T>
): void {
  const sizes = Object.keys(obj.stackInfoByLength);

  sizes.forEach((size) => {
    const objBySize = obj.stackInfoByLength[size];
    const keysOfObj = Object.keys(objBySize).filter(
      (o) => objBySize[o] !== undefined
    );

    // Delete if doesn't accepts size
    if (
      keysOfObj.length <= 2 &&
      objBySize.size !== undefined &&
      !objBySize.acceptsSize
    ) {
      delete obj.stackInfoByLength[size];
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

type TWithStackAttributesByContainerLength<T> = T extends {
  infoByContLength: TStackInfoByLength;
}
  ? T
  : never;

type TWithStackAttributesByContainerLengthWithAcceptsSize<T> = T extends {
  stackInfoByLength: IStackInfoByLengthWithAcceptsSize;
}
  ? T
  : never;
