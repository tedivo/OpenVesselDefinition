import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import PositionFormatEnum from "../../models/base/enums/PositionFormatEnum";
import StackWeightCalculationEnum from "../../models/base/enums/StackWeightCalculationEnum";
import {
  LengthUnitsEnum,
  WeightUnitsEnum,
} from "../../models/base/enums/UnitsEnum";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";
import IShipData from "../../models/v1/parts/IShipData";

export const shipData: IShipData = {
  isoBays: 13,
  lineOperator: "OEM",
  shipName: "OEM 1",
  positionFormat: PositionFormatEnum.BAY_STACK_TIER,
  containersLengths: [],
  stackWeightCalculation: StackWeightCalculationEnum.CONTAINER_LENGTH,
  dynamicStackWeightLimit: false,
  metaInfo: {},
  fileUnits: {
    lengthUnits: LengthUnitsEnum.METRIC,
    weightUnits: WeightUnitsEnum.KILOGRAMS,
  },
  lcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
    reference: LcgReferenceEnum.MIDSHIPS,
  },
  vcgOptions: {
    values: ValuesSourceStackTierEnum.ESTIMATED,
  },
  tcgOptions: {
    values: ValuesSourceEnum.ESTIMATED,
  },
};
