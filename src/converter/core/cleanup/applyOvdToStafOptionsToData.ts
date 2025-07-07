import {
  IBayLevelDataStaf,
  IBaySlotData,
} from "../../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IJoinedRowTierPattern,
} from "../../../models/base/types/IPositionPatterns";

import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import IOpenVesselDefinitionV1 from "../../../models/v1/IOpenVesselDefinitionV1";
import IShipData from "../../../models/v1/parts/IShipData";
import { TContainerLengths } from "../../../models/v1/parts/Types";
import ValuesSourceEnum from "../../../models/base/enums/ValuesSourceEnum";

type TApplyOvdToStafOptionsToData = {
  removeCGs: boolean;
  removeBaysWithNonSizeSlots: boolean;
  removeBelowTiers24AndHigher: boolean;
};

export function applyOvdToStafOptionsToData(
  json: IOpenVesselDefinitionV1,
  {
    removeCGs = false,
    removeBaysWithNonSizeSlots = false,
    removeBelowTiers24AndHigher = false,
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

  if (removeBelowTiers24AndHigher && json.sizeSummary.maxBelowTier > 22) {
    // 3. Remove below tiers 24 and higher
    json.sizeSummary.maxBelowTier = 22;
    json.baysData = removeBelowTiersAbove22FromBayLevelData(json.baysData);
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

    const slotsDataKeysLength = slotsDataKeys.length;
    if (slotsDataKeysLength === 0) {
      return false;
    }

    const haveDefinedSizes = slotsDataKeys.filter((slotName) => {
      if (perSlotInfo[slotName].restricted) return false;

      return Object.keys(perSlotInfo[slotName].sizes).length > 0;
    });

    return haveDefinedSizes.length > 0;
  });
}

function removeBelowTiersAbove22FromBayLevelData(
  bls: IBayLevelDataStaf[]
): IBayLevelDataStaf[] {
  return bls.map((bl) => {
    const perSlotInfo = bl.perSlotInfo;
    if (!perSlotInfo || bl.level === BayLevelEnum.ABOVE) {
      return bl;
    }

    const slotsDataKeys = Object.keys(perSlotInfo) as IJoinedRowTierPattern[];

    const newPerSlotInfo = slotsDataKeys.reduce((acc, slotName) => {
      const tier = slotName.substring(2);
      const iTier = Number(tier);

      if (isNaN(iTier) || iTier >= 24) {
        return acc;
      }

      acc[slotName] = perSlotInfo[slotName];

      return acc;
    }, {} as IBaySlotData);

    bl.perSlotInfo = newPerSlotInfo;

    return bl;
  });
}
