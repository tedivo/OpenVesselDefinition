import {
  calculateMasterCGs,
  cleanRepeatedTcgs,
} from "./core/calculateMasterCGs";
import mapStafSections, { STAF_MIN_SECTIONS } from "./core/mapStafSections";

import IOpenVesselDefinitionV1 from "../models/v1/IOpenVesselDefinitionV1";
import IRowStafData from "./types/IRowStafData";
import IShipData from "../models/v1/parts/IShipData";
import IStafDataProcessed from "./types/IStafDataProcessed";
import ITierStafData from "./types/ITierStafData";
import ValuesSourceEnum from "../models/base/enums/ValuesSourceEnum";
import { ValuesSourceRowTierEnum } from "../models/base/enums/ValuesSourceRowTierEnum";
import { addMissingBays } from "./core/addMissingBays";
import addPerRowInfo from "../converter/core/addPerRowInfo";
import addPerSlotData from "../converter/core/addPerSlotData";
import addPerTierInfo from "../converter/core/addPerTierInfo";
import calculateCommonRowInfo from "./core/calculateCommonRowInfo";
import { cgsRemapStafToOvd } from "./core/cgsRemapStafToOvd";
import { cleanBayLevelDataNoStaf } from "./core/cleanBayLevelDataNoStaf";
import { cleanUpOvdJson } from "./core/cleanup/cleanUpOvdJson";
import { createDictionaryMultiple } from "../helpers/createDictionary";
import createSummary from "./core/createSummary";
import { getContainerLengths } from "./core/getContainerLengths";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import { processAllSections } from "./sections/stafToOvd/processAllSections";
import substractLabels from "./core/substractLabels";
import { tiersRemap } from "./core/tiersRemap";
import transformLids from "./core/transformLids";

export default function stafToOvdV1Converter(
  fileContent: string,
  lpp: number,
  vgcHeightFactor = 0.45,
  tier82is = 82
): IOpenVesselDefinitionV1 {
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
  const rowDataByBayLevel = createDictionaryMultiple<IRowStafData, string>(
      dataProcessed.rowData,
      (d) => `${d.isoBay}-${d.level}`
    ),
    tierDataByBayLevel = createDictionaryMultiple<ITierStafData, string>(
      dataProcessed.tierData,
      (d) => `${d.isoBay}-${d.level}`
    );

  // 2. Add rows info to BayLevel.perRowInfo and get bays number
  const isoBays = addPerRowInfo(dataProcessed.bayLevelData, rowDataByBayLevel);

  // 3. Add tiers info to BayLevel.perTierInfo. Temporary, it will be deleted later
  addPerTierInfo(dataProcessed.bayLevelData, tierDataByBayLevel);

  // Pre-calculate the minAboveTier
  const preSizeSummary = createSummary({
    isoBays,
    bayLevelData: dataProcessed.bayLevelData,
  });

  dataProcessed.bayLevelData = addMissingBays(
    dataProcessed.bayLevelData,
    preSizeSummary
  );

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
      originalDataSource: {
        reference: lcgOptions.reference,
        orientationIncrease: lcgOptions.orientationIncrease,
      },
    },
    tcgOptions: {
      values: tcgOptions.values,
    },
    vcgOptions: {
      values:
        vcgOptions.values !== ValuesSourceRowTierEnum.ESTIMATED
          ? ValuesSourceEnum.KNOWN
          : ValuesSourceEnum.ESTIMATED,
      heightFactor: vcgOptions.heightFactor,
    },
    containersLengths: getContainerLengths(dataProcessed.bayLevelData),
    masterCGs: { aboveTcgs: {}, belowTcgs: {}, bottomBases: {} },
    loa: 0,
    featuresAllowed: {
      slotConeRequired: false,
      slotHazardousProhibited: false,
      slotCoolStowProhibited: false,
    },
    shipNameAkas: [],
  };

  // 8. Size Summary
  const sizeSummary = createSummary({
    isoBays,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // 9. Change LCG, TCG & VCG references. Deletes perTierInfo
  dataProcessed.bayLevelData = cgsRemapStafToOvd(
    dataProcessed.bayLevelData,
    dataProcessed.shipData.lcgOptions,
    dataProcessed.shipData.vcgOptions,
    dataProcessed.shipData.tcgOptions
  );

  // 10. Add `commonRowInfo` to each bay
  calculateCommonRowInfo(dataProcessed.bayLevelData);

  // 11. Obtain most repeated CGs in masterCGs
  shipData.masterCGs = calculateMasterCGs(
    dataProcessed.shipData,
    dataProcessed.bayLevelData
  );

  // 12. cleanRepeatedTcgs
  cleanRepeatedTcgs(shipData.masterCGs, dataProcessed.bayLevelData);

  // 13. Re-map tiers
  const {
    sizeSummary: sizeSummaryTiersRemapped,
    bls: baysDataTiersRemapped,
    masterCGs: masterCGsTiersRemapped,
  } = tiersRemap({
    sizeSummary,
    masterCGs: shipData.masterCGs,
    bls: cleanBayLevelDataNoStaf(dataProcessed.bayLevelData),
    tier82is,
  });

  // OpenVesselDefinition JSON
  const result: IOpenVesselDefinitionV1 = {
    $schema:
      "https://github.com/tedivo/OpenVesselDefinition/blob/24092bd8cef7b360814c680e749b92ed5398ee0a/schema.json?raw=true",
    $schemaId: "IOpenVesselDefinitionV1",
    version: "1.0.0",
    shipData: { ...shipData, masterCGs: masterCGsTiersRemapped },
    sizeSummary: sizeSummaryTiersRemapped,
    baysData: baysDataTiersRemapped,
    positionLabels,
    lidData: transformLids(dataProcessed.lidData),
  };

  // Final Clean-Up
  cleanUpOvdJson(result);

  return result;
}
