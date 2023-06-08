import IBayLevelData, {
  IBayLevelDataStaf,
} from "../models/v1/parts/IBayLevelData";
import IShipData, {
  ILCGOptionsIntermediate,
  IShipDataFromStaf,
  ITGCOptionsIntermediate,
  IVGCOptionsIntermediate,
} from "../models/v1/parts/IShipData";
import ValuesSourceEnum, {
  ValuesSourceRowTierEnum,
} from "../models/base/enums/ValuesSourceEnum";

import BayLevelConfig from "./sections/ovdToStaf/BayLevelConfig";
import ForeAftEnum from "../models/base/enums/ForeAftEnum";
import { ILidDataFromStaf } from "../models/v1/parts/ILidData";
import IOpenVesselDefinitionV1 from "../models/v1/IOpenVesselDefinitionV1";
import IRowStafData from "./types/IRowStafData";
import ISlotData from "../models/v1/parts/ISlotData";
import ITierStafData from "./types/ITierStafData";
import { LINE_SEPARATOR } from "./sections/ovdToStaf/consts";
import LcgReferenceEnum from "../models/base/enums/LcgReferenceEnum";
import LidConfig from "./sections/ovdToStaf/LidConfig";
import PortStarboardEnum from "../models/base/enums/PortStarboardEnum";
import RowConfig from "./sections/ovdToStaf/RowConfig";
import ShipConfig from "./sections/ovdToStaf/ShipConfig";
import SlotConfig from "./sections/ovdToStaf/SlotConfig";
import TierConfig from "./sections/ovdToStaf/TierConfig";
import { cgsRemapOvdToStaf } from "./core/cgsRemapOvdToStaf";
import convertOvdToStafObject from "./core/convertOvdToStafObject";
import { tiersRemap } from "./core/tiersRemap";

export default function ovdV1ToStafConverter(
  originalJson: IOpenVesselDefinitionV1,
  cgOptions?: {
    lcgOptions?: ILCGOptionsIntermediate;
    vcgOptions?: IVGCOptionsIntermediate;
    tcgOptions?: ITGCOptionsIntermediate;
  },
  tier82is = 82
): string {
  const stafParts: string[] = [];

  // Use copy
  const json = JSON.parse(
    JSON.stringify(originalJson)
  ) as IOpenVesselDefinitionV1;

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

  // Do CGs remapping given the safe cgOptions
  if (cgOptions) {
    const { bls, mCGs } = cgsRemapOvdToStaf(
      json.baysData,
      json.shipData.masterCGs,
      lcgOptions,
      vcgOptions,
      tcgOptions
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
      ShipConfig
    )
  );

  const dataForBLs = BayLevelConfig.preProcessor(json.baysData);

  stafParts.push(
    convertOvdToStafObject<IBayLevelDataStaf, IBayLevelData>(
      dataForBLs,
      BayLevelConfig
    )
  );

  const dataForRows = RowConfig.preProcessor(
    json.baysData,
    json.shipData.masterCGs
  );

  stafParts.push(
    convertOvdToStafObject<IRowStafData, IRowStafData>(dataForRows, RowConfig)
  );

  const dataForTiers = TierConfig.preProcessor(json.baysData);

  stafParts.push(
    convertOvdToStafObject<ITierStafData, ITierStafData>(
      dataForTiers,
      TierConfig
    )
  );

  const dataForSlots = SlotConfig.preProcessor(json.baysData);

  stafParts.push(
    convertOvdToStafObject<ISlotData, ISlotData>(dataForSlots, SlotConfig)
  );

  const dataForLids = LidConfig.preProcessor(json.lidData);

  stafParts.push(
    convertOvdToStafObject<ILidDataFromStaf, ILidDataFromStaf>(
      dataForLids,
      LidConfig
    )
  );

  stafParts.push(`*END${LINE_SEPARATOR}`);

  return stafParts.join(LINE_SEPARATOR);
}
