import IBayLevelData, {
  IBayLevelDataStaf,
} from "../models/v1/parts/IBayLevelData";
import IShipData, {
  ILCGOptionsIntermediate,
  IShipDataFromStaf,
  ITGCOptionsIntermediate,
  IVGCOptionsIntermediate,
} from "../models/v1/parts/IShipData";

import BayLevelConfig from "./sections/ovsToStaf/BayLevelConfig";
import { ILidDataFromStaf } from "../models/v1/parts/ILidData";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import IRowStafData from "./types/IRowStafData";
import ISlotData from "../models/v1/parts/ISlotData";
import ITierStafData from "./types/ITierStafData";
import { LINE_SEPARATOR } from "./sections/ovsToStaf/consts";
import LidConfig from "./sections/ovsToStaf/LidConfig";
import RowConfig from "./sections/ovsToStaf/RowConfig";
import ShipConfig from "./sections/ovsToStaf/ShipConfig";
import SlotConfig from "./sections/ovsToStaf/SlotConfig";
import TierConfig from "./sections/ovsToStaf/TierConfig";
import { cgsRemapOvsToStaf } from "./core/cgsRemapOvsToStaf";
import convertOvsToStafObject from "./core/convertOvsToStafObject";
import { tiersRemap } from "./core/tiersRemap";

export default function ovsV1ToStafConverter(
  originalJson: IOpenShipSpecV1,
  cgOptions?: {
    lcgOptions: ILCGOptionsIntermediate;
    vcgOptions: IVGCOptionsIntermediate;
    tcgOptions: ITGCOptionsIntermediate;
  },
  tier82is = 82
): string {
  const stafParts: string[] = [];

  // Use copy
  const json = JSON.parse(JSON.stringify(originalJson)) as IOpenShipSpecV1;

  console.log("SSS", cgOptions);

  // Translate CGs
  if (
    cgOptions &&
    cgOptions.lcgOptions &&
    cgOptions.vcgOptions &&
    cgOptions.tcgOptions
  ) {
    const { bls, mCGs } = cgsRemapOvsToStaf(
      json.baysData,
      json.shipData.masterCGs,
      cgOptions.lcgOptions,
      cgOptions.vcgOptions,
      cgOptions.tcgOptions
    );

    json.shipData.masterCGs = mCGs;
    json.baysData = bls;
  }

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
    convertOvsToStafObject<IShipData, IShipDataFromStaf>(
      [json.shipData],
      ShipConfig
    )
  );

  stafParts.push(
    convertOvsToStafObject<IBayLevelDataStaf, IBayLevelData>(
      json.baysData,
      BayLevelConfig
    )
  );

  const dataForRows = RowConfig.preProcessor(
    json.baysData,
    json.shipData.masterCGs
  );

  stafParts.push(
    convertOvsToStafObject<IRowStafData, IRowStafData>(dataForRows, RowConfig)
  );

  const dataForTiers = TierConfig.preProcessor(json.baysData);

  stafParts.push(
    convertOvsToStafObject<ITierStafData, ITierStafData>(
      dataForTiers,
      TierConfig
    )
  );

  const dataForSlots = SlotConfig.preProcessor(json.baysData);

  stafParts.push(
    convertOvsToStafObject<ISlotData, ISlotData>(dataForSlots, SlotConfig)
  );

  const dataForLids = LidConfig.preProcessor(json.lidData);

  stafParts.push(
    convertOvsToStafObject<ILidDataFromStaf, ILidDataFromStaf>(
      dataForLids,
      LidConfig
    )
  );

  stafParts.push(`*END${LINE_SEPARATOR}`);

  return stafParts.join(LINE_SEPARATOR);
}
