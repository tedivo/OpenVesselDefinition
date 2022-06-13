import { pad2 } from "../../helpers/pad";
import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import { IIsoBayPattern } from "../../models/base/types/IPositionPatterns";
import ILidData, { ILidDataFromStaf } from "../../models/v1/parts/ILidData";

export default function transformLids(lidData: ILidDataFromStaf[]): ILidData[] {
  const lidsByLabel: { [name: string]: ILidDataTemp } = {};

  const result = joinAftFwdLids(lidData, lidsByLabel);

  return result;
}

function joinAftFwdLids(
  lidData: ILidDataFromStaf[],
  lidsByLabel: { [name: string]: ILidDataTemp }
): ILidData[] {
  // Create new object
  lidData.forEach((lid, idx) => {
    const label = lid.label || `L${pad2(idx)}`;
    const newLid = {
      label,
      level: lid.level,
      portIsoStack: lid.portIsoStack,
      starboardIsoStack: lid.starboardIsoStack,
      overlapPort: lid.overlapPort,
      overlapStarboard: lid.overlapStarboard,
      startIsoBay: lid.isoBay,
      endIsoBay: lid.isoBay,
      joinLidFwdLabel: lid.joinLidFwdLabel,
      joinLidAftLabel: lid.joinLidAftLabel,
    };

    if (!lidsByLabel[label]) {
      lidsByLabel[label] = newLid;
    } else {
      lidsByLabel[`L${pad2(idx)}`] = newLid;
    }
  });

  Object.keys(lidsByLabel).forEach((label) => {
    // Join FWD
    if (lidsByLabel[label].joinLidFwdLabel) {
      const joinLidFwdLabel = lidsByLabel[label].joinLidFwdLabel;
      const currentStartIsoBay = Number(lidsByLabel[label].startIsoBay);
      const proposedStartIsoBay = Number(
        lidsByLabel[joinLidFwdLabel].startIsoBay
      );
      if (proposedStartIsoBay < currentStartIsoBay)
        lidsByLabel[label].startIsoBay =
          lidsByLabel[joinLidFwdLabel].startIsoBay;
    }

    // Join AFT
    if (lidsByLabel[label].joinLidAftLabel) {
      const joinLidAftLabel = lidsByLabel[label].joinLidAftLabel;
      const currentEndIsoBay = Number(lidsByLabel[label].startIsoBay);
      const proposedEndIsoBay = Number(lidsByLabel[joinLidAftLabel].endIsoBay);

      if (proposedEndIsoBay > currentEndIsoBay)
        lidsByLabel[label].endIsoBay = lidsByLabel[joinLidAftLabel].endIsoBay;
    }
  });

  // Create hash to delete duplicates
  const hashes: Set<string> = new Set();
  Object.keys(lidsByLabel).forEach((label) => {
    const obj = lidsByLabel[label];
    const hash = `${obj.startIsoBay}/${obj.endIsoBay}/${obj.level}/${obj.portIsoStack}/${obj.starboardIsoStack}`;
    obj.hash = hash;
    hashes.add(hash);
  });

  const result = Object.keys(lidsByLabel)
    .filter((k) => {
      const hash = lidsByLabel[k].hash;
      if (hashes.has(hash)) {
        hashes.delete(hash);
        return true;
      }
      return false;
    })
    .map((k) => {
      const { joinLidFwdLabel, joinLidAftLabel, hash, ...newLidData } =
        lidsByLabel[k];
      return newLidData;
    });

  return justOneLevel(result as ILidDataWithLevel[]);
}

function justOneLevel(lidData: ILidDataWithLevel[]): ILidData[] {
  const isoBays: { [name: IIsoBayPattern]: Set<BayLevelEnum> } = {};
  const levelPerBay: { [name: string]: BayLevelEnum } = {};
  lidData.forEach((lid) => {
    if (!isoBays[lid.startIsoBay]) isoBays[lid.startIsoBay] = new Set();
    if (!isoBays[lid.endIsoBay]) isoBays[lid.endIsoBay] = new Set();
    isoBays[lid.startIsoBay].add(lid.level);
    isoBays[lid.endIsoBay].add(lid.level);
  });

  Object.keys(isoBays).forEach((bay) => {
    const v = Array.from(isoBays[bay]);
    // Use max because the Enum has below=2 and above=1
    levelPerBay[bay] = Math.max.apply(null, v);
  });

  return lidData
    .filter(
      (lid) =>
        levelPerBay[lid.startIsoBay] === lid.level ||
        levelPerBay[lid.endIsoBay] === lid.level
    )
    .map((lid) => {
      // Remove level
      const { level, ...withoutLevel } = lid;
      // Clean
      if (!withoutLevel.overlapPort) delete withoutLevel.overlapPort;
      if (!withoutLevel.overlapStarboard) delete withoutLevel.overlapStarboard;
      return withoutLevel;
    });
}

interface ILidDataTemp extends ILidData {
  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;
  hash?: string;
  level?: BayLevelEnum;
}

interface ILidDataWithLevel extends ILidData {
  level: BayLevelEnum;
}
