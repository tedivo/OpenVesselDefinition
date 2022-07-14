import { IStackInfoByLengthWithAcceptsSize } from "../../models/IStackStafData";
import { TBayStackInfo } from "../../../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../../../models/v1/parts/Types";

export default function cleanUpPerStackInfo(perStackInfo: TBayStackInfo) {
  const stacks = Object.keys(perStackInfo.each);

  stacks.forEach((stack) => {
    delete perStackInfo.each[stack].label;

    const stackInfoByLength = perStackInfo.each[stack].stackInfoByLength;

    if (stackInfoByLength) {
      const sizes = Object.keys(stackInfoByLength).map(
        Number
      ) as TContainerLengths[];

      sizes.forEach((size) => {
        const attrs = stackInfoByLength[
          size
        ] as IStackInfoByLengthWithAcceptsSize;

        // Clean-up "acceptsSize" property
        delete attrs.acceptsSize;

        // Get keys
        const keysOfObj = Object.keys(attrs).filter(
          (o) => attrs[o] !== undefined
        );

        // Clean-up all size object if doesn't accepts size
        if (keysOfObj.length <= 1 && attrs.size !== undefined) {
          delete stackInfoByLength[size];
        }
      });

      const keysOfObj = Object.keys(stackInfoByLength).filter(
        (o) => stackInfoByLength[o] !== undefined
      );

      if (keysOfObj.length === 0) {
        delete perStackInfo.each[stack].stackInfoByLength;
      }
    }
  });
}
