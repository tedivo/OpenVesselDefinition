import IShipData, {
  IShipDataFromStaf,
} from "../../../models/v1/parts/IShipData";

import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import { getPositionFormatValueToStaf } from "../../../models/base/enums/PositionFormatEnum";
import { getValuesSourceEnumValueToStaf } from "../../../models/base/enums/ValuesSourceEnum";

/**
 * FROM OVS TO STAF
 * DEFINITION of main Ship class for the converter
 */
const ShipConfig: ISectionMapToStafConfig<IShipDataFromStaf, IShipData> = {
  stafSection: "SHIP",
  singleRow: true,
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
      fixedValue: "AP",
    },
    {
      stafVar: "LCG + DIR",
      fixedValue: "F",
    },
    {
      stafVar: "VCG IN USE",
      fixedValue: "STACK",
    },
    {
      stafVar: "TCG IN USE",
      source: "tcgOptions.values",
      mapper: getValuesSourceEnumValueToStaf,
    },
    {
      stafVar: "TCG + DIR",
      fixedValue: "STBD",
    },
    {
      stafVar: "POSITION FORMAT",
      source: "positionFormat",
      mapper: getPositionFormatValueToStaf,
    },
  ],
};

export default ShipConfig;
