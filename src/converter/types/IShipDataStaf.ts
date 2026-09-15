import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import { IShipDataBase } from "../../models/v1/parts/IShipData";
import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../models/base/enums/PortStarboardEnum";
import ValuesSourceEnum from "../../models/base/enums/ValuesSourceEnum";
import { ValuesSourceRowTierEnum } from "../../models/base/enums/ValuesSourceRowTierEnum";

/**
 * Ship data as read from a STAF file.
 *
 * This is an **intermediate** shape: units are still as declared in the file and
 * the CG options keep their original references, before being remapped into the
 * OVD {@link IShipData}.
 */
export interface IShipDataStaf extends IShipDataBase {
  lenghtUnits: "METRIC" | "BRITISH";
  lcgOptions: ILCGOptionsStaf;
  vcgOptions: IVGCOptionsStaf;
  tcgOptions: ITGCOptionsStaf;
}

export type IShipDataFromStaf = Pick<
  IShipDataStaf,
  "shipClass" | "lcgOptions" | "tcgOptions" | "vcgOptions" | "positionFormat"
>;

export interface ILCGOptionsStaf {
  values: ValuesSourceEnum;
  reference: LcgReferenceEnum;
  /** FWD or AFT */
  orientationIncrease?: ForeAftEnum;
  lpp: number;
}

export interface IVGCOptionsStaf {
  values: ValuesSourceRowTierEnum;
  heightFactor?: number;
}

export interface ITGCOptionsStaf {
  values: ValuesSourceEnum;
  direction?: PortStarboardEnum;
}
