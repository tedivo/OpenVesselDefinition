import {
  IBayStackInfoStaf,
  IStackInfoByLength,
} from "../../models/v1/parts/IBayLevelData";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import { TContainerLengths } from "../../models/v1/parts/Types";
import { TYesNo } from "../../models/base/types/IPositionPatterns";

export type IStackInfoByLengthWithAcceptsSize = IStackInfoByLength & {
  acceptsSize: TYesNo;
  bayHasLcg?: TYesNo;
};

type IStackStafData = {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** Above, Below */
  level: BayLevelEnum;
  isoStack20?: string;
  isoStack40?: string;
  stackInfoByLength: Partial<{
    [key in TContainerLengths]: IStackInfoByLengthWithAcceptsSize;
  }>;
} & Omit<IBayStackInfoStaf, "stackInfoByLength">;

export default IStackStafData;
