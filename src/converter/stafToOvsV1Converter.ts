import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../models/base/enums/ValuesSourceEnum";
import {
  calculateMasterCGs,
  cleanRepeatedTcgs,
} from "./core/calculateMasterCGs";
import mapStafSections, { STAF_MIN_SECTIONS } from "./core/mapStafSections";

import IBayLevelData from "../models/v1/parts/IBayLevelData";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import IShipData from "../models/v1/parts/IShipData";
import IStackStafData from "./models/IStackStafData";
import IStafDataProcessed from "./models/IStafDataProcessed";
import ITierStafData from "./models/ITierStafData";
import addPerSlotData from "../converter/core/addPerSlotData";
import addPerStackInfo from "../converter/core/addPerStackInfo";
import addPerTierInfo from "../converter/core/addPerTierInfo";
import calculateCommonStackInfo from "./core/calculateCommonStackInfo";
import { cgsRemap } from "./core/cgsRemap";
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
  lpp: number,
  vgcHeightFactor = 0.45
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
  dataProcessed.shipData.lcgOptions.lpp = lpp;
  dataProcessed.shipData.vcgOptions.heightFactor = vgcHeightFactor;

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

  // 3. Add tiers info to BayLevel.perTierInfo. Temporary, it will be deleted later
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
  const { lcgOptions, vcgOptions, tcgOptions, ...shipDataWithoutCgsOptions } =
    dataProcessed.shipData;

  // 7. Create Final shipData
  const shipData: IShipData = {
    ...shipDataWithoutCgsOptions,
    lcgOptions: {
      values: lcgOptions.values,
      lpp: lcgOptions.lpp,
    },
    tcgOptions: {
      values: tcgOptions.values,
    },
    vcgOptions: {
      values:
        vcgOptions.values !== ValuesSourceStackTierEnum.ESTIMATED
          ? ValuesSourceEnum.KNOWN
          : ValuesSourceEnum.ESTIMATED,
      heightFactor: vcgOptions.heightFactor,
    },
    containersLengths: getContainerLengths(dataProcessed.bayLevelData),
    masterCGs: { aboveTcgs: {}, belowTcgs: {}, bottomBases: {} },
  };

  // 8. Size Summary
  const sizeSummary = createSummary({
    isoBays,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // 9. Change LCG, TCG & VCG references. Deletes perTierInfo
  cgsRemap(
    dataProcessed.bayLevelData,
    dataProcessed.shipData.lcgOptions,
    dataProcessed.shipData.vcgOptions,
    dataProcessed.shipData.tcgOptions
  );

  // 10. Add `commonStackInfo` to each bay
  calculateCommonStackInfo(dataProcessed.bayLevelData);

  // 11. Obtain most repeated CGs in masterCGs
  shipData.masterCGs = calculateMasterCGs(
    dataProcessed.shipData,
    dataProcessed.bayLevelData
  );

  // 12. cleanRepeatedTcgs
  cleanRepeatedTcgs(shipData.masterCGs, dataProcessed.bayLevelData);

  // OpenShipSpec JSON
  const result: IOpenShipSpecV1 = {
    schema: "OpenVesselSpec",
    version: "1.0.0",
    sizeSummary,
    shipData: shipData,
    baysData: dataProcessed.bayLevelData as IBayLevelData[],
    positionLabels,
    lidData: transformLids(dataProcessed.lidData),
  };

  // Final Clean-Up
  cleanUpOVSJson(result);

  return result;
}
