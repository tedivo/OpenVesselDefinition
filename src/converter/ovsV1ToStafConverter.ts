import IBayLevelData, {
  IBayLevelDataStaf,
} from "../models/v1/parts/IBayLevelData";
import IShipData, { IShipDataFromStaf } from "../models/v1/parts/IShipData";

import BayLevelConfig from "./sections/ovsToStaf/BayLevelConfig";
import { ILidDataFromStaf } from "../models/v1/parts/ILidData";
import IOpenShipSpecV1 from "../models/v1/IOpenShipSpecV1";
import ISlotData from "../models/v1/parts/ISlotData";
import IStackStafData from "./types/IStackStafData";
import ITierStafData from "./types/ITierStafData";
import { LINE_SEPARATOR } from "./sections/ovsToStaf/consts";
import LidConfig from "./sections/ovsToStaf/LidConfig";
import ShipConfig from "./sections/ovsToStaf/ShipConfig";
import SlotConfig from "./sections/ovsToStaf/SlotConfig";
import StackConfig from "./sections/ovsToStaf/StackConfig";
import TierConfig from "./sections/ovsToStaf/TierConfig";
import convertOvsToStafObject from "./core/convertOvsToStafObject";

export default function ovsV1ToStafConverter(json: IOpenShipSpecV1): string {
  const stafParts: string[] = [];

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

  const dataForStacks = StackConfig.preProcessor(
    json.baysData,
    json.shipData.masterCGs
  );

  stafParts.push(
    convertOvsToStafObject<IStackStafData, IStackStafData>(
      dataForStacks,
      StackConfig
    )
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
