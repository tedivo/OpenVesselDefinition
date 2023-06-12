import { IBayLevelDataStaf } from "../../../models/v1/parts/IBayLevelData";
import { IIsoRowPattern } from "../../../models/base/types/IPositionPatterns";
import IOpenVesselDefinitionV1 from "../../../models/v1/IOpenVesselDefinitionV1";
import IShipData from "../../../models/v1/parts/IShipData";
import { TContainerLengths } from "../../../models/v1/parts/Types";
import ValuesSourceEnum from "../../../models/base/enums/ValuesSourceEnum";

type TApplyOvdToStafOptionsToData = {
  removeCGs: boolean;
  removeBaysWithNonSizeSlots: boolean;
};

export function applyOvdToStafOptionsToData(
  json: IOpenVesselDefinitionV1,
  {
    removeCGs = false,
    removeBaysWithNonSizeSlots = false,
  }: TApplyOvdToStafOptionsToData
): IOpenVesselDefinitionV1 {
  if (removeBaysWithNonSizeSlots) {
    // 1. Remove bays with no slots
    json.baysData = removeBaysWithNoSlotsFromBayLevelData(json.baysData);
  }

  if (removeCGs) {
    // 2.1. Remove CGs from baysData
    json.baysData = removeCGsFromBayLevelData(json.baysData);

    // 2.2. Remove MasterCGs from shipData
    json.shipData.masterCGs = {
      aboveTcgs: {},
      belowTcgs: {},
      bottomBases: {},
    };

    // 2.3 Set CGs to ESTIMATED
    safeCGValue(ValuesSourceEnum.ESTIMATED, "lcgOptions");
    safeCGValue(ValuesSourceEnum.ESTIMATED, "vcgOptions");
    safeCGValue(ValuesSourceEnum.ESTIMATED, "tcgOptions");
  }

  return json;

  function safeCGValue(
    v: ValuesSourceEnum,
    obj: "lcgOptions" | "vcgOptions" | "tcgOptions"
  ) {
    if (!json.shipData) {
      json.shipData = {} as IShipData;
    }

    if (!json.shipData[obj]) {
      json.shipData[obj] = {} as any;
    }

    json.shipData[obj].values = v;
  }
}

function removeCGsFromBayLevelData(
  bls: IBayLevelDataStaf[]
): IBayLevelDataStaf[] {
  return bls
    .filter((bl) => {
      const slotsDataKeys = Object.keys(bl.perSlotInfo);
      return slotsDataKeys.length > 0;
    })
    .map((bl) => {
      // 1. TCGs, VCGs and Bottom Bases
      const perRowInfo = bl.perRowInfo;
      if (perRowInfo) {
        perRowInfo.common.maxHeight = undefined;
        perRowInfo.common.bottomBase = undefined;
        if (perRowInfo.each) {
          (Object.keys(perRowInfo.each) as IIsoRowPattern[]).forEach((row) => {
            const rowInfoEach = perRowInfo.each[row];
            rowInfoEach.bottomBase = undefined;
            rowInfoEach.tcg = undefined;
            rowInfoEach.maxHeight = undefined;
          });
        }
      }

      // 2. By Size
      const perSizeInfo = bl.infoByContLength;
      if (perSizeInfo) {
        const sizes = Object.keys(perSizeInfo).map(
          Number
        ) as TContainerLengths[];
        sizes.forEach((size) => {
          const sizeInfo = perSizeInfo[size];
          sizeInfo.lcg = undefined;
        });
      }

      // 3. Bulkheads
      const bulkheads = bl.bulkhead;
      if (bulkheads) {
        bulkheads.foreLcg = undefined;
        bulkheads.aftLcg = undefined;
      }

      return bl;
    });
}

function removeBaysWithNoSlotsFromBayLevelData(
  bls: IBayLevelDataStaf[]
): IBayLevelDataStaf[] {
  return bls.filter((bl) => {
    const perSlotInfo = bl.perSlotInfo;
    if (!perSlotInfo) {
      return false;
    }

    const slotsDataKeys = Object.keys(perSlotInfo) as IIsoRowPattern[];

    return slotsDataKeys.some((slotName) => {
      const noSlots =
        Object.keys(perSlotInfo[slotName].sizes).length === 0 ||
        !!perSlotInfo[slotName].restricted;
      return !noSlots;
    });
  });
}
