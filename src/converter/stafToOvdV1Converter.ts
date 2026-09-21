import {
  calculateMasterCGs,
  cleanRepeatedTcgs,
} from "./core/calculateMasterCGs";
import mapStafSections, { STAF_MIN_SECTIONS } from "./core/mapStafSections";

import IOpenVesselDefinitionV1 from "../models/v1/IOpenVesselDefinitionV1";
import IRowDataStaf from "./types/IRowDataStaf";
import IShipData from "../models/v1/parts/IShipData";
import IStafDataProcessed from "./types/IStafDataProcessed";
import ITierDataStaf from "./types/ITierDataStaf";
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
import { connectPairedBays } from "./core/connectPairedBays";
import detectBay40sLocation from "./core/bay40s/detectBay40sLocation";
import { expandTrailing40sBays } from "./core/bay40s/trailing40sBays";
import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import { createDictionaryMultiple } from "../helpers/createDictionary";
import createSummary from "./core/createSummary";
import { getContainerLengths } from "./core/getContainerLengths";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import { processAllSections } from "./sections/stafToOvd/processAllSections";
import substractLabels from "./core/substractLabels";
import { tiersRemap } from "./core/tiersRemap";
import transformLids from "./core/transformLids";

export interface IStafToOvdOptions {
  /**
   * Create the missing half of the pair at the end of the vessel, so the last
   * bay follows the same 40s convention as every other pair.
   * See {@link expandTrailing40sBays}. Default `true`.
   */
  normalizeTrailing40sBay?: boolean;
  /**
   * The convention to place the trailing 40s under. Defaults to whatever the
   * rest of the file already uses, and to `AFT` when the file says nothing.
   */
  bay40sLocation?: ForeAftEnum;
}

export default function stafToOvdV1Converter(
  fileContent: string,
  lpp: number,
  vgcHeightFactor = 0.45,
  tier82is = 82,
  { normalizeTrailing40sBay = true, bay40sLocation }: IStafToOvdOptions = {}
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
  const rowDataByBayLevel = createDictionaryMultiple<IRowDataStaf, string>(
    dataProcessed.rowData,
    (d) => `${d.isoBay}-${d.level}`
  ),
    tierDataByBayLevel = createDictionaryMultiple<ITierDataStaf, string>(
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

  /** Pair bays according to:
 * 1. Those that have 40s AFT or FORE
 * 2. In Between bays
 * 3. Check OVD FROM BVO
 * */
  dataProcessed.bayLevelData = connectPairedBays(dataProcessed.bayLevelData);

  /** 4.1. Where does this file keep its 40s? */
  let bay40sLocationUsed =
    bay40sLocation ??
    detectBay40sLocation(dataProcessed.bayLevelData).bay40sLocation;

  /**
   * 4.2. The last bay of a vessel has no 20' stack aft of it, so STAF exports
   * routinely declare its 40s in the bay itself and never create the bay they
   * extend into. Create it, so the last pair looks like all the others.
   */
  let isoBaysTotal = isoBays;

  if (normalizeTrailing40sBay) {
    const { changed, maxIsoBay } = expandTrailing40sBays(
      dataProcessed.bayLevelData,
      {
        bay40sLocation: bay40sLocationUsed ?? ForeAftEnum.AFT,
        mutate: true,
      }
    );

    if (changed.length > 0) {
      isoBaysTotal = Math.max(isoBaysTotal, maxIsoBay);

      // The bay was created on the deck that needed it. Fill the other decks
      // too: bays 1..isoBays must exist at every level, which is what
      // `addMissingBays` is for, and what lets pairing rely on N and N+2.
      dataProcessed.bayLevelData = addMissingBays(dataProcessed.bayLevelData, {
        ...preSizeSummary,
        isoBays: isoBaysTotal,
      });

      bay40sLocationUsed =
        bay40sLocation ??
        detectBay40sLocation(dataProcessed.bayLevelData).bay40sLocation;
    }
  }

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
    bay40sLocation: bay40sLocationUsed,
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
    isoBays: isoBaysTotal,
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
      "https://raw.githubusercontent.com/tedivo/OpenVesselDefinition/master/schema.json",
    $schemaId: "IOpenVesselDefinitionV1",
    version: "1.0.0",
    shipData: { ...shipData, masterCGs: masterCGsTiersRemapped },
    sizeSummary: sizeSummaryTiersRemapped,
    baysData: baysDataTiersRemapped,
    positionLabels,
    lidData: transformLids(dataProcessed.lidData),
    vesselPartsData: [],
  };

  // Final Clean-Up
  cleanUpOvdJson(result);

  return result;
}
