import LcgReferenceEnum from "../../models/v1/enums/LcgReferenceEnum";
import PositionFormatEnum from "../../models/v1/enums/PositionFormatEnum";
import StackWeightCalculationEnum from "../../models/v1/enums/StackWeightCalculationEnum";
import {
  LengthUnitsEnum,
  WeightUnitsEnum,
} from "../../models/v1/enums/UnitsEnum";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/v1/enums/ValuesSourceEnum";
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
