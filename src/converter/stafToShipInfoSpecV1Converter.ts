import addPerSlotData from "../converter/core/addPerSlotData";
import addPerStackInfo from "../converter/core/addPerStackInfo";
import addPerTierInfo from "../converter/core/addPerTierInfo";
import { createDictionaryMultiple } from "../helpers/createDictionary";
import substractLabels from "../helpers/substractLabels";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import IBayLevelData from "../models/v1/parts/IBayLevelData";
import ILidData from "../models/v1/parts/ILidData";
import IShipData from "../models/v1/parts/IShipData";
import ISlotData from "../models/v1/parts/ISlotData";
import convertStafObjectToShipOpenSpec from "./core/convertStafObjectToShipOpenSpec";
import createSummary from "./core/createSummary";
import getSectionsFromFileContent from "./core/getSectionsFromFileContent";
import mapStafSections from "./core/mapStafSections";
import IStackStafData from "./models/IStackStafData";
import IStafDataProcessed from "./models/IStafDataProcessed";
import ITierStafData from "./models/ITierStafData";
import BayLevelConfig from "./sections/BayLevelConfig";
import LidConfig from "./sections/LidConfig";
import ShipConfig from "./sections/ShipConfig";
import SlotConfig from "./sections/SlotConfig";
import StackConfig from "./sections/StackConfig";
import TierConfig from "./sections/TierConfig";

export default function stafToShipInfoSpecV1Converter(
  fileContent: string
): IOpenShipSpecV1 {
  const sectionsByName = mapStafSections(
    getSectionsFromFileContent(fileContent)
  );

  // 1. Process data
  const dataProcessed: IStafDataProcessed = {
    shipData: convertStafObjectToShipOpenSpec<IShipData>(
      sectionsByName["SHIP"],
      ShipConfig
    )[0],
    bayLevelData: convertStafObjectToShipOpenSpec<IBayLevelData>(
      sectionsByName["SECTION"],
      BayLevelConfig
    ),
    stackData: convertStafObjectToShipOpenSpec<IStackStafData>(
      sectionsByName["STACK"],
      StackConfig
    ),
    tierData: convertStafObjectToShipOpenSpec<ITierStafData>(
      sectionsByName["TIER"],
      TierConfig
    ),
    slotData: convertStafObjectToShipOpenSpec<ISlotData>(
      sectionsByName["SLOT"],
      SlotConfig
    ),
    lidData: convertStafObjectToShipOpenSpec<ILidData>(
      sectionsByName["LID"],
      LidConfig
    ),
  };

  // 2. Create dictionaries
  const stackDataByBayLevel = createDictionaryMultiple<IStackStafData, string>(
      dataProcessed.stackData,
      (d) => `${d.isoBay}-${d.level}`
    ),
    tierDataByBayLevel = createDictionaryMultiple<ITierStafData, string>(
      dataProcessed.tierData,
      (d) => `${d.isoBay}-${d.level}`
    );

  // 3. Add stacks info to BayLevel.perStackInfo and get bays number
  dataProcessed.shipData.isoBays = addPerStackInfo(
    dataProcessed.bayLevelData,
    stackDataByBayLevel
  );

  // 4. Add tiers info to BayLevel.perTierInfo
  addPerTierInfo(dataProcessed.bayLevelData, tierDataByBayLevel);

  // Pre-calculate the minAboveTier
  const preSizeSummary = createSummary({
    shipData: dataProcessed.shipData,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // 5. Add slotsData to BayLevel.perSlotInfo
  addPerSlotData(
    dataProcessed.bayLevelData,
    dataProcessed.slotData,
    Number(preSizeSummary.minAboveTier)
  );

  // 6. Create labels dictionaries
  const positionLabels = substractLabels(dataProcessed.bayLevelData);

  // 7. Size Summary
  const sizeSummary = createSummary({
    shipData: dataProcessed.shipData,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // Final OpenShipSpec JSON
  const result: IOpenShipSpecV1 = {
    schema: "OpenShipSpec",
    version: "1.0.0",
    sizeSummary,
    shipData: dataProcessed.shipData,
    baysData: dataProcessed.bayLevelData,
    positionLabels,
    lidData: dataProcessed.lidData,
  };

  return result;
}
