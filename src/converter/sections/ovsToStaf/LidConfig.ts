import BayLevelEnum, {
  getBayLevelEnumValueToStaf,
} from "../../../models/base/enums/BayLevelEnum";
import ILidData, { ILidDataFromStaf } from "../../../models/v1/parts/ILidData";
import { pad2, pad3 } from "../../../helpers/pad";

import ISectionMapToStafConfig from "../../types/ISectionMapToStafConfig";
import sortByMultipleFields from "../../../helpers/sortByMultipleFields";
import { yNToStaf } from "../../../helpers/yNToBoolean";

const LidConfig: ISectionMapToStafConfig<ILidDataFromStaf, ILidDataFromStaf> = {
  stafSection: "LID",
  mapVars: [
    { stafVar: "LID ID", source: "label", passValue: true },
    {
      stafVar: "STAF BAY",
      source: "isoBay",
      mapper: (n: string) => pad2(Number(n)),
    },
    { stafVar: "LEVEL", source: "level", mapper: getBayLevelEnumValueToStaf },
    { stafVar: "PORT ISO STACK", source: "portIsoStack", mapper: pad2 },
    { stafVar: "STBD ISO STACK", source: "starboardIsoStack", mapper: pad2 },
    {
      stafVar: "JOIN LID FWD",
      source: "joinLidFwdLabel",
      passValue: true,
    },
    {
      stafVar: "JOIN LID AFT",
      source: "joinLidAftLabel",
      passValue: true,
    },
    {
      stafVar: "OVERLAP PORT",
      source: "overlapPort",
      passValue: true,
    },
    {
      stafVar: "OVERLAP STBD",
      source: "overlapStarboard",
      passValue: true,
    },
  ],
  postProcessors: [],
  preProcessor: convertLidsFromOvsToStaf,
};

export default LidConfig;

function convertLidsFromOvsToStaf(source: ILidData[]): ILidDataFromStaf[] {
  const lidData: ILidDataTemp[] = [];
  let lastDupLabelSequence = 0;

  // 1. Create one record per bay.
  source.forEach((lid) => {
    // ILidData uses one record for many bays.
    // It needs to re-created for N bays when extending more than 1 bay
    if (lid.startIsoBay === lid.endIsoBay) {
      lidData.push(lid);
    } else {
      const startBay = Number(lid.startIsoBay);
      const endBay = Number(lid.endIsoBay);
      for (let i = startBay; i <= endBay; i += 2) {
        const lidClone: ILidDataTemp = { ...lid };
        lidClone.startIsoBay = pad3(i);
        lidClone.endIsoBay = pad3(i);

        if (i < endBay)
          lidClone.joinLidAftLabel = `D${pad3(lastDupLabelSequence + 1)}`;
        if (i > startBay)
          lidClone.joinLidFwdLabel = `D${pad3(lastDupLabelSequence - 1)}`;

        lidClone.label = `D${pad3(lastDupLabelSequence)}`;

        lastDupLabelSequence += 1;

        lidData.push(lidClone);
      }
    }
  });

  const lidDataAbove = lidData.map((lidTemp) => ({
    isoBay: lidTemp.startIsoBay,
    level: BayLevelEnum.ABOVE,
    portIsoStack: lidTemp.portIsoStack,
    starboardIsoStack: lidTemp.starboardIsoStack,
    label: lidTemp.label,
    joinLidAftLabel: lidTemp.joinLidAftLabel,
    joinLidFwdLabel: lidTemp.joinLidFwdLabel,
    overlapPort: lidTemp.overlapPort ? "Y" : undefined,
    overlapStarboard: lidTemp.overlapStarboard ? "Y" : undefined,
  }));

  return lidDataAbove.sort(
    sortByMultipleFields([
      { name: "isoBay", ascending: true },
      { name: "label", ascending: true },
    ])
  );
}

interface ILidDataTemp extends ILidData {
  joinLidFwdLabel?: string;
  joinLidAftLabel?: string;
}
