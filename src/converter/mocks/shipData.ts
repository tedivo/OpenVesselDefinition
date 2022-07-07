import {
  LengthUnitsEnum,
  WeightUnitsEnum,
} from "../../models/base/enums/UnitsEnum";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";

import IShipData from "../../models/v1/parts/IShipData";
import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import PositionFormatEnum from "../../models/base/enums/PositionFormatEnum";
import StackWeightCalculationEnum from "../../models/base/enums/StackWeightCalculationEnum";

export const shipDataBays = 13;

export const shipData: IShipData = {
  lineOperator: "OEM",
  shipName: "OEM 1",
  positionFormat: PositionFormatEnum.BAY_STACK_TIER,
  containersLengths: [20, 40, 45],
  stackWeightCalculation: StackWeightCalculationEnum.CONTAINER_LENGTH,
  dynamicStackWeightLimit: 0,
  metaInfo: {},
  fileUnits: {
    lengthUnits: LengthUnitsEnum.METRIC,
    weightUnits: WeightUnitsEnum.KILOGRAMS,
  },
  lcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
    reference: LcgReferenceEnum.MIDSHIPS,
    lbp: 100,
  },
  vcgOptions: {
    values: ValuesSourceStackTierEnum.ESTIMATED,
  },
  tcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
  },
  masterCGs: {
    aboveTcgs: {},
    belowTcgs: {},
    vcgs: {},
  },
};
