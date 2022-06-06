import addPerSlotData from "../converter/core/addPerSlotData";
import addPerStackInfo from "../converter/core/addPerStackInfo";
import addPerTierInfo from "../converter/core/addPerTierInfo";
import { createDictionaryMultiple } from "../helpers/createDictionary";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import { cleanUpOVSJson } from "./core/cleanup/cleanUpOVSJson";
import createSummary from "./core/createSummary";
import { getContainerLengths } from "./core/getContainerLengths";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import mapStafSections from "./core/mapStafSections";
import substractLabels from "./core/substractLabels";
import IStackStafData from "./models/IStackStafData";
import IStafDataProcessed from "./models/IStafDataProcessed";
import ITierStafData from "./models/ITierStafData";
import { processAllSections } from "./sections/processAllSections";

export default function stafToShipInfoSpecV1Converter(
  fileContent: string
): IOpenShipSpecV1 {
  const sectionsByName = mapStafSections(
    getSectionsFromFileContent(fileContent)
  );

  // 0. Process data
  const dataProcessed: IStafDataProcessed = processAllSections(sectionsByName);

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
    shipData: dataProcessed.shipData,
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

  // 7. Size Summary
  const sizeSummary = createSummary({
    isoBays,
    shipData: dataProcessed.shipData,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // OpenShipSpec JSON
  const result: IOpenShipSpecV1 = {
    schema: "OpenShipSpec",
    version: "1.0.0",
    sizeSummary,
    shipData: dataProcessed.shipData,
    baysData: dataProcessed.bayLevelData,
    positionLabels,
    lidData: dataProcessed.lidData,
  };

  // Final Clean-Up
  cleanUpOVSJson(result);

  return result;
}
