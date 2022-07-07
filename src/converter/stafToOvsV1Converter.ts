import mapStafSections, { STAF_MIN_SECTIONS } from "./core/mapStafSections";

import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import IStackStafData from "./models/IStackStafData";
import IStafDataProcessed from "./models/IStafDataProcessed";
import ITierStafData from "./models/ITierStafData";
import addPerSlotData from "../converter/core/addPerSlotData";
import addPerStackInfo from "../converter/core/addPerStackInfo";
import addPerTierInfo from "../converter/core/addPerTierInfo";
import { calculateMasterCGs } from "./core/calculateMasterCGs";
import { cleanUpOVSJson } from "./core/cleanup/cleanUpOVSJson";
import { createDictionaryMultiple } from "../helpers/createDictionary";
import createSummary from "./core/createSummary";
import { getContainerLengths } from "./core/getContainerLengths";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import { processAllSections } from "./sections/processAllSections";
import substractLabels from "./core/substractLabels";
import transformLids from "./core/transformLids";

export default function stafToOvsV1Converter(
  fileContent: string,
  lbp: number,
  vgcRatio = 0.45
): IOpenShipSpecV1 {
  const sectionsByName = mapStafSections(
    getSectionsFromFileContent(fileContent)
  );

  // Check minimum data
  const sectionsFound = Object.keys(sectionsByName);
  const compliesWithStaf = STAF_MIN_SECTIONS.every(
    (sectionName) => sectionsFound.indexOf(sectionName) >= 0
  );

  if (!compliesWithStaf) {
    throw {
      code: "NotStafFile",
      message: "This file doesn't seem to be a valid STAF file",
    };
  }

  // 0. Process data
  const dataProcessed: IStafDataProcessed = processAllSections(sectionsByName);
  dataProcessed.shipData.lcgOptions.lbp = lbp;

  // 1. Create dictionaries
  const stackDataByBayLevel = createDictionaryMultiple<IStackStafData, string>(
      dataProcessed.stackData,
      (d) => `${d.isoBay}-${d.level}`
    ),
    tierDataByBayLevel = createDictionaryMultiple<ITierStafData, string>(
      dataProcessed.tierData,
      (d) => `${d.isoBay}-${d.level}`
    );

  // 2. Add stacks info to BayLevel.perStackInfo and get bays number
  const isoBays = addPerStackInfo(
    dataProcessed.bayLevelData,
    stackDataByBayLevel
  );

  // 3. Add tiers info to BayLevel.perTierInfo
  addPerTierInfo(dataProcessed.bayLevelData, tierDataByBayLevel);

  // Pre-calculate the minAboveTier
  const preSizeSummary = createSummary({
    isoBays,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // 4. Add slotsData to BayLevel.perSlotInfo
  addPerSlotData(
    dataProcessed.bayLevelData,
    dataProcessed.slotData,
    Number(preSizeSummary.minAboveTier)
  );

  // 5. Create labels dictionaries
  const positionLabels = substractLabels(dataProcessed.bayLevelData);

  // 6. Container Lenghts in Vessel
  dataProcessed.shipData.containersLengths = getContainerLengths(
    dataProcessed.bayLevelData
  );

  // 7. Master CGs (Centers of gravity for TCG & VCG)
  dataProcessed.shipData.masterCGs = calculateMasterCGs(
    dataProcessed.shipData,
    dataProcessed.bayLevelData
  );

  // 8. Size Summary
  const sizeSummary = createSummary({
    isoBays,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // OpenShipSpec JSON
  const result: IOpenShipSpecV1 = {
    schema: "OpenVesselSpec",
    version: "1.0.0",
    sizeSummary,
    shipData: dataProcessed.shipData,
    baysData: dataProcessed.bayLevelData,
    positionLabels,
    lidData: transformLids(dataProcessed.lidData),
  };

  // Final Clean-Up
  cleanUpOVSJson(result);

  return result;
}
