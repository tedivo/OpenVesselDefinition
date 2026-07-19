import ISectionMapConfig from "../../types/ISectionMapConfig";
import { IShipDataIntermediateStaf } from "../../../models/v1/parts/IShipData";
import { getStafForeAftEnumValue } from "../../../models/base/enums/ForeAftEnum";
import { getStafLcgReferenceEnumValue } from "../../../models/base/enums/LcgReferenceEnum";
import { getStafPortStarboardValue } from "../../../models/base/enums/PortStarboardEnum";
import { getStafPositionFormatEnumValue } from "../../../models/base/enums/PositionFormatEnum";
import { getStafValuesSourceEnumValue } from "../../../models/base/enums/ValuesSourceEnum";
import { getStafValuesSourceRowTierEnumValue } from "../../../models/base/enums/ValuesSourceRowTierEnum";

// This converter only implements metric unit conversions (safeNumberMtToMm,
// safeNumberTonsToGrams, etc. all assume meters/tonnes input). There is no spec yet for
// supporting imperial/BRITISH STAF files, so rather than silently misinterpreting
// feet/long-tons as meters/tonnes, fail loudly if a file declares non-metric UNITS.
function assertMetricUnits(s: string): "METRIC" {
  if (s !== "METRIC") {
    throw new Error(
      `Unsupported STAF UNITS value "${s}": only METRIC STAF files are currently supported.`
    );
  }

  return s;
}

/**
 * DEFINITION of main Ship class for the converter
 */
const ShipConfig: ISectionMapConfig<IShipDataIntermediateStaf> = {
  stafSection: "SHIP",
  singleRow: true,
  mapVars: {
    CLASS: { target: "shipClass", passValue: true, dashIsEmpty: true },
    UNITS: { target: "lenghtUnits", mapper: assertMetricUnits },
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
      mapper: getStafValuesSourceRowTierEnumValue,
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
