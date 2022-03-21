import { getStafForeAftEnumValue } from "../../models/v1/enums/ForeAftEnum";
import { getStafLcgReferenceEnumValue } from "../../models/v1/enums/LcgReferenceEnum";
import { getStafPortStarboardValue } from "../../models/v1/enums/PortStarboardEnum";
import { getStafPositionFormatEnumValue } from "../../models/v1/enums/PositionFormatEnum";
import { getStafLengthUnitsEnumValue } from "../../models/v1/enums/UnitsEnum";
import {
  getStafValuesSourceEnumValue,
  getStafValuesSourceStackTierEnumValue,
} from "../../models/v1/enums/ValuesSourceEnum";
import IShipData from "../../models/v1/parts/IShipData";
import ISectionMapConfig from "./ISectionMapConfig";

/**
 * DEFINITION of main Ship class for the converter
 */
const ShipConfig: ISectionMapConfig<IShipData> = {
  stafSection: "SHIP",
  singleRow: true,
  mapVars: {
    CLASS: { target: "shipName", passValue: true },
    UNITS: {
      target: "fileUnits.lengthUnits",
      mapper: getStafLengthUnitsEnumValue,
    },
    LCG_IN_USE: {
      target: "lcgOptions.values",
      mapper: getStafValuesSourceEnumValue,
    },
    LCG_REF_PT: {
      target: "lcgOptions.reference",
      mapper: getStafLcgReferenceEnumValue,
    },
    "LCG_+_DIR": {
      target: "lcgOptions.orientationIncrease",
      mapper: getStafForeAftEnumValue,
    },
    VCG_IN_USE: {
      target: "vcgOptions.values",
      mapper: getStafValuesSourceStackTierEnumValue,
    },
    TCG_IN_USE: {
      target: "tcgOptions.values",
      mapper: getStafValuesSourceEnumValue,
    },
    "TCG_+_DIR": {
      target: "tcgOptions.direction",
      mapper: getStafPortStarboardValue,
    },
    POSITION_FORMAT: {
      target: "positionFormat",
      mapper: getStafPositionFormatEnumValue,
    },
  },
};

export default ShipConfig;
