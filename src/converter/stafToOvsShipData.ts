import {
  IShipDataFromStaf,
  IShipDataIntermediateStaf,
} from "../models/v1/parts/IShipData";

import ShipConfig from "./sections/ShipConfig";
import convertStafObjectToShipOpenSpec from "./core/convertStafObjectToShipOpenSpec";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import mapStafSections from "./core/mapStafSections";

/**
 * This function only converts the SHIP section to OVS. Use `stafToOvsV1Converter` to do a full conversion.
 * @param fileContent STAF string
 * @returns IShipDataFromStaf
 */
export default function stafToOvsShipData(
  fileContent: string
): IShipDataFromStaf {
  const sectionsByName = mapStafSections(
    getSectionsFromFileContent(fileContent)
  );

  const sectionsFound = Object.keys(sectionsByName);
  if (sectionsFound.indexOf("SHIP") < 0) {
    throw {
      code: "NotStafFile",
      message: "This file doesn't seem to be a valid STAF file",
    };
  }

  const shipData = convertStafObjectToShipOpenSpec<IShipDataIntermediateStaf>(
    sectionsByName["SHIP"],
    ShipConfig
  )[0];

  const {
    shipName,
    positionFormat,
    fileUnits,
    tcgOptions,
    lcgOptions,
    vcgOptions,
  } = shipData;

  return {
    shipName,
    positionFormat,
    fileUnits,
    tcgOptions,
    lcgOptions,
    vcgOptions,
  };
}
