import { TBayStackInfo } from "../../../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../../../models/v1/parts/Types";
import { IStackAttributesByContainerLengthWithAcceptsSize } from "../../models/IStackStafData";

export default function cleanUpPerStackInfo(perStackInfo: TBayStackInfo) {
  const stacks = Object.keys(perStackInfo);

  stacks
    .filter((stack) => !!perStackInfo[stack].stackInfoByLength)
    .forEach((stack) => {
      const attrsByLength = perStackInfo[stack].stackInfoByLength;
      const sizesKeys = Object.keys(
        attrsByLength
      ) as unknown as TContainerLengths[];

      sizesKeys.forEach((size) => {
        const attrs = attrsByLength[
          size
        ] as IStackAttributesByContainerLengthWithAcceptsSize;

        const keysOfObj = Object.keys(attrs).filter(
          (o) => o !== "acceptsSize" && attrs[o] !== undefined
        );

        // Clean-up "acceptsSize" property
        delete attrs.acceptsSize;

        // Clean-up all size object if doesn't accepts size
        if (keysOfObj.length <= 1 && attrs.size !== undefined) {
          delete attrsByLength[size];
        }
      });
    });
}
