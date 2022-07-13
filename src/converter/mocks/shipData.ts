import {
  LengthUnitsEnum,
  WeightUnitsEnum,
} from "../../models/base/enums/UnitsEnum";

import IShipData from "../../models/v1/parts/IShipData";
import PositionFormatEnum from "../../models/base/enums/PositionFormatEnum";
import StackWeightCalculationEnum from "../../models/base/enums/StackWeightCalculationEnum";
import ValuesSourceEnum from "../../models/base/enums/ValuesSourceEnum";

export const shipDataBays = 13;

export const shipData: IShipData = {
  lineOperator: "OEM",
  shipName: "OEM 1",
  positionFormat: PositionFormatEnum.BAY_STACK_TIER,
  containersLengths: [20, 40, 45],
  stackWeightCalculation: StackWeightCalculationEnum.CONTAINER_LENGTH,
  dynamicStackWeightLimit: 0,
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
