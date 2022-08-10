import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import IShipData from "../../../models/v1/parts/IShipData";
import { getPositionFormatValueToStaf } from "../../../models/base/enums/PositionFormatEnum";
import { getValuesSourceEnumValueToStaf } from "../../../models/base/enums/ValuesSourceEnum";

/**
 * FROM OVS TO STAF
 * DEFINITION of main Ship class for the converter
 */
const ShipConfig: ISectionMapToStafConfig<IShipData> = {
  stafSection: "SHIP",
  singleRow: true,
  mapVars: [
    {
      stafVar: "CLASS",
      target: "shipClass",
      passValue: true,
      dashIsEmpty: true,
    },
    {
      stafVar: "UNITS",
      fixedValue: "METRIC",
    },
    {
      stafVar: "LCG IN USE",
      target: "lcgOptions.values",
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
      target: "tcgOptions.values",
      mapper: getValuesSourceEnumValueToStaf,
    },
    {
      stafVar: "TCG + DIR",
      fixedValue: "STBD",
    },
    {
      stafVar: "POSITION FORMAT",
      target: "positionFormat",
      mapper: getPositionFormatValueToStaf,
    },
  ],
};

export default ShipConfig;
