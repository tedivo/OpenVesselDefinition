import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { TYesNo } from "../../models/base/types/IPositionPatterns";
import {
  IBayStackInfo,
  IStackInfoByLength,
} from "../../models/v1/parts/IBayLevelData";
import { TContainerLengths } from "../../models/v1/parts/Types";

export type IStackAttributesByContainerLengthWithAcceptsSize =
  IStackInfoByLength & {
    acceptsSize: TYesNo;
  };

type IStackStafData = {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** Above, Below */
  level: BayLevelEnum;
  stackInfoByLength: Partial<{
    [key in TContainerLengths]: IStackAttributesByContainerLengthWithAcceptsSize;
  }>;
} & Omit<IBayStackInfo, "stackInfoByLength">;

export default IStackStafData;
