import { IStackAttributesByContainerLengthWithAcceptsSize } from "../converter/models/IStackStafData";
import { TStackAttributesByContainerLength } from "../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../models/v1/parts/Types";

/**
 * Mutates the object deleting TContainerLenghts without data
 * @param obj
 */
export function deleteMissingContainerLenghtData<T>(
  obj: TWithStackAttributesByContainerLength<T>
): void {
  const sizes = Object.keys(obj.stackAttributesByContainerLength);

  sizes.forEach((size) => {
    const objBySize = obj.stackAttributesByContainerLength[size];
    const keysOfObj = Object.keys(objBySize).filter(
      (o) => objBySize[o] !== undefined
    );
    if (keysOfObj.length === 1 && objBySize.size !== undefined) {
      delete obj.stackAttributesByContainerLength[size];
    }
  });
}

export function deleteMissingContainerLenghtDataWithAcceptsSize<T>(
  obj: TWithStackAttributesByContainerLengthWithAcceptsSize<T>
): void {
  const sizes = Object.keys(obj.stackAttributesByContainerLength);

  sizes.forEach((size) => {
    const objBySize = obj.stackAttributesByContainerLength[size];
    const keysOfObj = Object.keys(objBySize).filter(
      (o) => objBySize[o] !== undefined
    );
    if (
      keysOfObj.length <= 2 &&
      objBySize.size !== undefined &&
      !objBySize.acceptsSize
    ) {
      delete obj.stackAttributesByContainerLength[size];
    }
  });
}

type TWithStackAttributesByContainerLength<T> = T extends {
  stackAttributesByContainerLength: TStackAttributesByContainerLength;
}
  ? T
  : never;

type TWithStackAttributesByContainerLengthWithAcceptsSize<T> = T extends {
  stackAttributesByContainerLength: IStackAttributesByContainerLengthWithAcceptsSize;
}
  ? T
  : never;
