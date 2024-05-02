import ForeAftEnum from "../../base/enums/ForeAftEnum";

export type IVesselParts =
  | IVesselPartSpacer
  | IVesselPartCrane
  | IVesselPartSmokeStack
  | IVesselPartBridge;

export interface IVesselPartBase {
  label: string;
  id: string;
  slotRefId: string; // bay-001, ... or ID
  posRef: ForeAftEnum;
  len: number;
  type: VesselPartTypeEnum;
}

export interface IVesselPartCrane extends IVesselPartBase {
  type: VesselPartTypeEnum.CRANE;
  cranes: Array<CraneSideEnum>;
}

export interface IVesselPartSmokeStack extends IVesselPartBase {
  type: VesselPartTypeEnum.SMOKE;
  numberOfSmokeStacks: number;
}

export interface IVesselPartBridge extends IVesselPartBase {
  type: VesselPartTypeEnum.BRIDGE;
  heatSrcBelow: boolean;
}

export interface IVesselPartSpacer extends IVesselPartBase {
  type: VesselPartTypeEnum.SPACER;
  heatSrcBelow: boolean;
}

export enum VesselPartTypeEnum {
  BAY = "BAY",
  SPACER = "SPC",
  BRIDGE = "BRG",
  SMOKE = "SMK",
  CRANE = "CRN",
}

export enum CraneSideEnum {
  PORT = "PORT",
  STARBOARD = "STARBOARD",
  CENTER = "CENTER",
}

export default IVesselParts;
