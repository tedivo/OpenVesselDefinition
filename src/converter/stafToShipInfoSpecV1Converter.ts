import {
  createDictionary,
  createDictionaryMultiple,
} from "../helpers/createDictionary";
import { TNumberPadded7 } from "../helpers/pad";
import sortByMultipleFields from "../helpers/sortByMultipleFields";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import IBayLevelData from "../models/v1/parts/IBayLevelData";
import ILidData from "../models/v1/parts/ILidData";
import IShipData from "../models/v1/parts/IShipData";
import ISlotData from "../models/v1/parts/ISlotData";
import convertStafObjectToShipOpenSpec from "./core/convertStafObjectToShipOpenSpec";
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
    ),
    slotDataByIsoPosition = createDictionary<ISlotData, TNumberPadded7>(
      dataProcessed.slotData,
      (d) => d.isoPosition
    );

  // Add stack to BayLevel.perStackInfo
  dataProcessed.bayLevelData.forEach((bl) => {
    const key = `${bl.isoBay}-${bl.level}`;
    const stackDataOfBay = stackDataByBayLevel[key];
    if (!bl.perStackInfo) bl.perStackInfo = {};
    if (stackDataOfBay) {
      stackDataOfBay
        .sort(
          sortByMultipleFields<IStackStafData>([
            { name: "isoStack", ascending: true },
          ])
        )
        .forEach((sData) => {
          const { isoBay, level, ...sDataK } = sData;
          bl.perStackInfo[sDataK.isoStack] = sDataK;
        });
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

  const result: IOpenShipSpecV1 = {
    shipData: dataProcessed.shipData,
    baysData: dataProcessed.bayLevelData,
    slotsDataByPosition: slotDataByIsoPosition,
    lidData: dataProcessed.lidData,
  };

  const bl = result.baysData.map((b) => ({
    bay: b.isoBay,
    level: b.level,
    perStackInfoLength: Object.keys(b.perStackInfo).length,
  }));

  const blDict = bl.reduce((acc, v) => {
    acc[`${v.bay}-${v.level}`] = v.perStackInfoLength;
    return acc;
  }, {});

  //console.log(JSON.stringify(blDict, null, 2));

  //console.log(JSON.stringify(result, null, 2));

  return result;
}
