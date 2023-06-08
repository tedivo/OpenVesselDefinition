import IShipData, {
  IShipDataFromStaf,
} from "../../../models/v1/parts/IShipData";
import {
  getValuesSourceEnumValueToStaf,
  getValuesSourceRowTierEnumValueToStaf,
} from "../../../models/base/enums/ValuesSourceEnum";

import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import { getForeAftEnumToStaf } from "../../../models/base/enums/ForeAftEnum";
import { getLcgReferenceEnumValueToStaf } from "../../../models/base/enums/LcgReferenceEnum";
import { getPortStarboardValueToStaf } from "../../../models/base/enums/PortStarboardEnum";
import { getPositionFormatValueToStaf } from "../../../models/base/enums/PositionFormatEnum";

/**
 * FROM OVD TO STAF
 * DEFINITION of main Ship class for the converter
 */
const ShipConfig: ISectionMapToStafConfig<IShipDataFromStaf, IShipData> = {
  stafSection: "SHIP",
  mapVars: [
    {
      stafVar: "CLASS",
      source: "shipClass",
      passValue: true,
    },
    {
      stafVar: "UNITS",
      fixedValue: "METRIC",
    },
    {
      stafVar: "LCG IN USE",
      source: "lcgOptions.values",
      mapper: getValuesSourceEnumValueToStaf,
    },
    {
      stafVar: "LCG REF PT",
      source: "lcgOptions.reference",
      mapper: getLcgReferenceEnumValueToStaf,
    },
    {
      stafVar: "LCG + DIR",
      source: "lcgOptions.orientationIncrease",
      mapper: getForeAftEnumToStaf,
    },
    {
      stafVar: "VCG IN USE",
      source: "vcgOptions.values",
      mapper: getValuesSourceRowTierEnumValueToStaf,
    },
    {
      stafVar: "TCG IN USE",
      source: "tcgOptions.values",
      mapper: getValuesSourceEnumValueToStaf,
    },
    {
      stafVar: "TCG + DIR",
      source: "tcgOptions.direction",
      mapper: getPortStarboardValueToStaf,
    },
    {
      stafVar: "POSITION FORMAT",
      source: "positionFormat",
      mapper: getPositionFormatValueToStaf,
    },
  ],
};

export default ShipConfig;
