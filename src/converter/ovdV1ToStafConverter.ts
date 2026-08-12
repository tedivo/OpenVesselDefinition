import IBayLevelData, {
  IBayLevelDataStaf,
} from "../models/v1/parts/IBayLevelData";
import IShipData, {
  ILCGOptionsIntermediate,
  IShipDataFromStaf,
  ITGCOptionsIntermediate,
  IVGCOptionsIntermediate,
} from "../models/v1/parts/IShipData";
import ISlotData, { ISlotDataIntermediate } from "../models/v1/parts/ISlotData";

import BayLevelConfig from "./sections/ovdToStaf/BayLevelConfig";
import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import { IIsoPositionPattern } from "../models/base/types/IPositionPatterns";
import { ILidDataFromStaf } from "../models/v1/parts/ILidData";
import IOpenVesselDefinitionV1 from "../models/v1/IOpenVesselDefinitionV1";
import IRowStafData from "./types/IRowStafData";
import ITierStafData from "./types/ITierStafData";
import { LINE_SEPARATOR } from "./sections/ovdToStaf/consts";
import LcgReferenceEnum from "../models/base/enums/LcgReferenceEnum";
import LidConfig from "./sections/ovdToStaf/LidConfig";
import PortStarboardEnum from "../models/base/enums/PortStarboardEnum";
import RowConfig from "./sections/ovdToStaf/RowConfig";
import ShipConfig from "./sections/ovdToStaf/ShipConfig";
import SlotConfig from "./sections/ovdToStaf/SlotConfig";
import TierConfig from "./sections/ovdToStaf/TierConfig";
import ValuesSourceEnum from "../models/base/enums/ValuesSourceEnum";
import { ValuesSourceRowTierEnum } from "../models/base/enums/ValuesSourceRowTierEnum";
import { applyOvdToStafOptionsToData } from "./core/cleanup/applyOvdToStafOptionsToData";
import { cgsRemapOvdToStaf } from "./core/cgsRemapOvdToStaf";
import { cloneObject } from "../helpers/objectHelpers";
import convertOvdToStafObject from "./core/convertOvdToStafObject";
import { tiersRemap } from "./core/tiersRemap";

export default function ovdV1ToStafConverter(
  originalJson: IOpenVesselDefinitionV1,
  options: IConvertOvdToStafObjectOptions,
): { stafText: string; slotsAbove100: string[] } {
  const stafParts: string[] = [];
  const {
    cgOptions,
    tier82is = 82,
    removeCGs = false,
    removeBaysWithNonSizeSlots = false,
    removeBelowTiers24AndHigher = false,
  } = options;

  // Use clone to avoid modifying the original json
  const json = applyOvdToStafOptionsToData(
    cloneObject(originalJson) as IOpenVesselDefinitionV1,
    {
      removeCGs,
      removeBaysWithNonSizeSlots,
      removeBelowTiers24AndHigher,
    },
  );

  // Create safe lcgOptions
  const lpp = cgOptions?.lcgOptions?.lpp || 0;
  const lcgOptions: ILCGOptionsIntermediate = {
    reference: lpp
      ? cgOptions?.lcgOptions?.reference || LcgReferenceEnum.AFT_PERPENDICULAR
      : LcgReferenceEnum.AFT_PERPENDICULAR,
    orientationIncrease: lpp
      ? cgOptions?.lcgOptions?.orientationIncrease || ForeAftEnum.FWD
      : ForeAftEnum.FWD,
    values: cgOptions?.lcgOptions?.values || ValuesSourceEnum.KNOWN,
    lpp,
  };

  const vcgOptions: IVGCOptionsIntermediate = {
    values: cgOptions?.vcgOptions?.values || ValuesSourceRowTierEnum.BY_STACK,
    heightFactor: cgOptions?.vcgOptions?.heightFactor || 0,
  };

  const tcgOptions: ITGCOptionsIntermediate = {
    values: cgOptions?.tcgOptions?.values || ValuesSourceEnum.KNOWN,
    direction: cgOptions?.tcgOptions?.direction || PortStarboardEnum.STARBOARD,
  };

  if (removeCGs) {
    lcgOptions.values = ValuesSourceEnum.ESTIMATED;
    vcgOptions.values = ValuesSourceRowTierEnum.ESTIMATED;
    tcgOptions.values = ValuesSourceEnum.ESTIMATED;
  }

  // Do CGs remapping given the safe cgOptions
  if (cgOptions) {
    const { bls, mCGs } = cgsRemapOvdToStaf(
      json.baysData,
      json.shipData.masterCGs,
      lcgOptions,
      vcgOptions,
      tcgOptions,
    );

    json.shipData.masterCGs = mCGs;
    json.baysData = bls;
  }

  // Update CG OPtions. VCG aren't needed because it's calculated and no header in STAF is needed
  json.shipData.lcgOptions = lcgOptions;
  json.shipData.tcgOptions = tcgOptions;

  // Remap Tiers
  const {
    sizeSummary,
    bls,
    masterCGs: newMasterCGs,
  } = tiersRemap({
    sizeSummary: json.sizeSummary,
    masterCGs: json.shipData.masterCGs,
    bls: json.baysData,
    tier82is,
  });

  json.sizeSummary = sizeSummary;
  json.baysData = bls;
  json.shipData.masterCGs = newMasterCGs;

  stafParts.push(
    convertOvdToStafObject<IShipData, IShipDataFromStaf>(
      [json.shipData],
      ShipConfig,
    ),
  );

  const dataForBLs = BayLevelConfig.preProcessor?.(json.baysData);

  if (dataForBLs)
    stafParts.push(
      convertOvdToStafObject<IBayLevelDataStaf, IBayLevelData>(
        dataForBLs,
        BayLevelConfig,
      ),
    );

  const dataForRows = RowConfig.preProcessor?.(json.baysData, json.shipData);

  if (dataForRows)
    stafParts.push(
      convertOvdToStafObject<IRowStafData, IRowStafData>(
        dataForRows,
        RowConfig,
      ),
    );

  const dataForTiers = TierConfig.preProcessor?.(json.baysData);

  if (dataForTiers)
    stafParts.push(
      convertOvdToStafObject<ITierStafData, ITierStafData>(
        dataForTiers,
        TierConfig,
      ),
    );

  const dataForSlots = SlotConfig.preProcessor?.(json.baysData);
  const dataForSlotsTier100OrAbove: ISlotDataIntermediate[] = [];
  const dataForSlotsTier98OrBelow: ISlotDataIntermediate[] = [];

  if (dataForSlots) {
    dataForSlots.forEach((s) => {
      const tier = s.pos.substring(2);
      if (tier.length > 2) {
        dataForSlotsTier100OrAbove.push(s);
      } else {
        dataForSlotsTier98OrBelow.push(s);
      }
    });

    stafParts.push(
      convertOvdToStafObject<ISlotData, ISlotData>(
        dataForSlotsTier98OrBelow,
        SlotConfig,
      ),
    );
  }

  const dataForLids = LidConfig.preProcessor?.(json.lidData);

  if (dataForLids)
    stafParts.push(
      convertOvdToStafObject<ILidDataFromStaf, ILidDataFromStaf>(
        dataForLids,
        LidConfig,
      ),
    );

  stafParts.push(`*END${LINE_SEPARATOR}`);

  const stafText = stafParts.join(LINE_SEPARATOR);
  console.log("OVD ovdV1ToStafConverter", stafText.length, options);

  return {
    stafText,
    slotsAbove100: dataForSlotsTier100OrAbove
      .map((s) => s.position)
      .filter((pos): pos is IIsoPositionPattern => pos !== undefined),
  };
}

interface IConvertOvdToStafObjectOptions {
  cgOptions?: {
    lcgOptions?: ILCGOptionsIntermediate;
    vcgOptions?: IVGCOptionsIntermediate;
    tcgOptions?: ITGCOptionsIntermediate;
  };
  tier82is?: number;
  removeCGs?: boolean;
  removeBaysWithNonSizeSlots?: boolean;
  removeBelowTiers24AndHigher?: boolean;
}
