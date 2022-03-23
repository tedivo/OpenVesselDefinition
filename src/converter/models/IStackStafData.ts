import BayLevelEnum from "../../models/v1/enums/BayLevelEnum";
import {
  IBayStackInfo,
  IStackAttributesByContainerLength,
} from "../../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../../models/v1/parts/Types";

export type IStackAttributesByContainerLengthWithAcceptsSize =
  IStackAttributesByContainerLength & {
    acceptsSize: boolean;
  };

type IStackStafData = {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** Above, Below */
  level: BayLevelEnum;
  stackAttributesByContainerLength: {
    [key in TContainerLengths]: IStackAttributesByContainerLengthWithAcceptsSize;
  };
} & Omit<IBayStackInfo, "stackAttributesByContainerLength">;

export default IStackStafData;
