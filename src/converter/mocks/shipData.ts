import {
  LengthUnitsEnum,
  WeightUnitsEnum,
} from "../../models/base/enums/UnitsEnum";

import IShipData from "../../models/v1/parts/IShipData";
import PositionFormatEnum from "../../models/base/enums/PositionFormatEnum";
import RowWeightCalculationEnum from "../../models/base/enums/RowWeightCalculationEnum";
import ValuesSourceEnum from "../../models/base/enums/ValuesSourceEnum";

export const shipDataBays = 13;

export const shipData: IShipData = {
  lineOperator: "OEM",
  shipClass: "OEM 1",
  positionFormat: PositionFormatEnum.BAY_STACK_TIER,
  containersLengths: [20, 40, 45],
  rowWeightCalculation: RowWeightCalculationEnum.CONTAINER_LENGTH,
  metaInfo: {},
  lcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
    lpp: 100000,
  },
  vcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
  },
  tcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
  },
  masterCGs: {
    aboveTcgs: {},
    belowTcgs: {},
    bottomBases: {},
  },
};
