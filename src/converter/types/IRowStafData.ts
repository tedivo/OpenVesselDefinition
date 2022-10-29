import {
  IBayRowInfoStaf,
  IRowInfoByLength,
} from "../../models/v1/parts/IBayLevelData";

import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { TContainerLengths } from "../../models/v1/parts/Types";
import { TYesNo } from "../../models/base/types/IPositionPatterns";

export type IRowInfoByLengthWithAcceptsSize = IRowInfoByLength & {
  acceptsSize: TYesNo;
  /** This one is used to set properly % instead of - when converting back to STAF */
  bayHasLcg?: TYesNo;
};

type IRowStafData = {
  /** 3 digits ISO Bay */
  isoBay: `${number}${number}${number}`;
  /** Above, Below */
  level: BayLevelEnum;
  isoRow20?: string;
  isoRow40?: string;
  rowInfoByLength: Partial<{
    [key in TContainerLengths]: IRowInfoByLengthWithAcceptsSize;
  }>;
} & Omit<IBayRowInfoStaf, "rowInfoByLength">;

export default IRowStafData;
