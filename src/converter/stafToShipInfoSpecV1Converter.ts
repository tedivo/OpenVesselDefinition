import {
  createDictionary,
  createDictionaryMultiple,
} from "../helpers/createDictionary";
import sortByMultipleFields from "../helpers/sortByMultipleFields";
import sortStacksArray from "../helpers/sortStacksArray";
import BayLevelEnum from "../models/base/enums/BayLevelEnum";
import { IIsoPositionPattern } from "../models/base/types/IPositionPatterns";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import IBayLevelData from "../models/v1/parts/IBayLevelData";
import ILidData from "../models/v1/parts/ILidData";
import IShipData from "../models/v1/parts/IShipData";
import ISlotData from "../models/v1/parts/ISlotData";
import convertStafObjectToShipOpenSpec from "./core/convertStafObjectToShipOpenSpec";
import { createSlotsFromStack } from "./core/createSlotsFromStacksInfo";
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

  let isoBays: number = 0;

  // Add stack to BayLevel.perStackInfo
  dataProcessed.bayLevelData.forEach((bl) => {
    // Find the max isoBay for ShipData
    if (Number(bl.isoBay) > isoBays) isoBays = Number(bl.isoBay);

    const key = `${bl.isoBay}-${bl.level}`;
    const stackDataOfBay = stackDataByBayLevel[key];
    if (!bl.perStackInfo) bl.perStackInfo = {};
    if (!bl.perSlotInfo) bl.perSlotInfo = {};

    if (stackDataOfBay) {
      let centerLineStack = 0;
      stackDataOfBay
        .sort((a, b) => sortStacksArray(a.isoStack, b.isoStack))
        .forEach((sData) => {
          const { isoBay, level, ...sDataK } = sData;
          // a. Set perStackInfo
          bl.perStackInfo[sDataK.isoStack] = sDataK;
          // b. Set perSlotInfo
          bl.perSlotInfo = createSlotsFromStack(sDataK, bl.perSlotInfo);
          // c. centerLineStack?
          if (sDataK.isoStack === "00") centerLineStack = 1;
          // d. TODO: Clean perStack redundant sizes
        });
      if (centerLineStack) bl.centerLineStack = 1;
    }
  });

  // Add tier to BayLevel.perTierInfo
  dataProcessed.bayLevelData.forEach((bl) => {
    const key = `${bl.isoBay}-${bl.level}`;
    const tierDataOfBay = tierDataByBayLevel[key];
    if (!bl.perTierInfo) bl.perTierInfo = {};
    if (tierDataOfBay) {
      tierDataOfBay
        .sort(
          sortByMultipleFields<ITierStafData>([
            { name: "isoTier", ascending: true },
          ])
        )
        .forEach((tData) => {
          const { isoBay, level, ...sDataK } = tData;
          bl.perTierInfo[sDataK.isoTier] = sDataK;
        });
    }
  });

  // Use this to know the minAboveTier
  const preSizeSummary = createSummary({
    shipData: dataProcessed.shipData,
    bayLevelData: dataProcessed.bayLevelData,
  });

  // Add slotsData to BayLevel.perSlotInfo
  dataProcessed.bayLevelData.forEach((bl) => {
    const isoBay = bl.isoBay;

    dataProcessed.slotData
      .filter((v) => {
        const iTIer = Number(v.position.substring(5, 7));
        return (
          v.position.indexOf(isoBay) === 0 &&
          ((bl.level === BayLevelEnum.ABOVE &&
            iTIer >= Number(preSizeSummary.minAboveTier)) ||
            (bl.level === BayLevelEnum.BELOW &&
              iTIer < Number(preSizeSummary.minAboveTier)))
        );
      })
      .forEach((v) => {
        const pos = v.position.substring(3, 7); // Remove bay
        const tier = pos.substring(2, 4);

        const { position, sizes, ...withoutSizesAndPos } = v;

        // Create it if it doesn't exist
        if (!bl.perSlotInfo[pos]) bl.perSlotInfo[pos] = { pos, sizes: {} };

        // Existing sizes
        const existingSizesInBl = Object.keys(bl.perSlotInfo[pos].sizes).filter(
          (size) => bl.perSlotInfo[pos].sizes[size] === 1
        );

        // Sizes from slotData
        const existingSizesInSlot = Object.keys(sizes).filter(
          (size) => sizes[size] === 1
        );

        // Concat and unique
        const allExistingSizes = existingSizesInBl
          .concat(existingSizesInSlot)
          .filter((v, idx, arr) => arr.indexOf(v) === idx);

        if (allExistingSizes.length) {
          // Create object of sizes
          bl.perSlotInfo[pos].sizes = allExistingSizes.reduce((acc, v) => {
            acc[v] = 1;
            return acc;
          }, {});

          Object.assign(bl.perSlotInfo[pos], withoutSizesAndPos);

          // Delete unnecesary reefer
          if (bl.perSlotInfo[pos].reefer === 0)
            delete bl.perSlotInfo[pos].reefer;
        } else {
          // If no sizes exist, delete object
          delete bl.perSlotInfo[pos];
        }
      });
  });

  dataProcessed.shipData.isoBays = isoBays;

  const sizeSummary = createSummary({
    shipData: dataProcessed.shipData,
    bayLevelData: dataProcessed.bayLevelData,
  });

  const result: IOpenShipSpecV1 = {
    schema: "OpenShipSpec",
    version: "1.0.0",
    sizeSummary,
    shipData: dataProcessed.shipData,
    baysData: dataProcessed.bayLevelData,
    lidData: dataProcessed.lidData,
  };

  return result;
}
