import BayLevelEnum from "../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import IBayLevelData from "../../models/v1/parts/IBayLevelData";
import { IIsoBayPattern } from "../../models/base/types/IPositionPatterns";
import { pad3 } from "../../helpers/pad";
import { sortNumericAsc } from "../../helpers/sortByMultipleFields";

export function connectPairedBays(bayLevelData: IBayLevelData[]): IBayLevelData[] {
  const bayLevelExtends: {
    [BayLevelEnum.ABOVE]: { [key: IIsoBayPattern]: ForeAftEnum | undefined };
    [BayLevelEnum.BELOW]: { [key: IIsoBayPattern]: ForeAftEnum | undefined };
  } = { [BayLevelEnum.ABOVE]: {}, [BayLevelEnum.BELOW]: {} };

  const levels = [BayLevelEnum.ABOVE, BayLevelEnum.BELOW] as [
    BayLevelEnum.ABOVE,
    BayLevelEnum.BELOW,
  ];

  let newConnections = 0;
  let newConnectionsBays: string[] = [];

  const isoBaysKeys = bayLevelData
    .map((v) => v.isoBay)
    .filter((v, i, a) => !!v && a.indexOf(v) === i)
    .sort(sortNumericAsc) as IIsoBayPattern[];

  bayLevelData.forEach(bl => {
    bayLevelExtends[bl.level][bl.isoBay] = bl.pairedBay
  });

  // 1st pass, pair bays that extend after pairing
  levels.forEach((level) => {
    isoBaysKeys.forEach((isoBay) => {
      if (bayLevelExtends[level][isoBay] === ForeAftEnum.AFT) {
        const iNextBay = Number(isoBay) + 2;
        const nextBay = pad3(iNextBay);

        if (bayLevelExtends[level][nextBay] === undefined) {
          const fwdBay = findBayAndLevel(isoBay, level, bayLevelData);
          if (fwdBay !== undefined) fwdBay.pairedBay = ForeAftEnum.AFT;
          const aftBay = findBayAndLevel(nextBay, level, bayLevelData);
          if (aftBay !== undefined) aftBay.pairedBay = ForeAftEnum.FWD;
          bayLevelExtends[level][nextBay] = ForeAftEnum.FWD;
          newConnections++;
          newConnectionsBays.push(`${level}-${nextBay}: FWD`);
        }
      }
    });
  });

  // 2nd pass, once set, check those pairing to an empty bay
  levels.forEach((level) => {
    isoBaysKeys.forEach((isoBay) => {
      if (bayLevelExtends[level][isoBay] === ForeAftEnum.FWD) {
        const iPrevBay = Number(isoBay) - 2;
        if (iPrevBay < 1) return;

        const prevBay = pad3(iPrevBay);

        if (bayLevelExtends[level][prevBay] === undefined) {
          const aftBay = findBayAndLevel(isoBay, level, bayLevelData);
          if (aftBay !== undefined) aftBay.pairedBay = ForeAftEnum.FWD;
          const fwd = findBayAndLevel(prevBay, level, bayLevelData);
          if (fwd !== undefined) fwd.pairedBay = ForeAftEnum.AFT;
          bayLevelExtends[level][prevBay] = ForeAftEnum.AFT;
          newConnections++;
          newConnectionsBays.push(`${level}-${prevBay}: AFT`);
        }
      }
    });
  });

  isoBaysKeys.forEach((isoBay) => {
    const above = findBayAndLevel(isoBay, BayLevelEnum.ABOVE, bayLevelData);
    const below = findBayAndLevel(isoBay, BayLevelEnum.BELOW, bayLevelData);

    if (above?.pairedBay !== undefined && below && below.pairedBay === undefined) {
      below.pairedBay = above.pairedBay;
      newConnections++;
      newConnectionsBays.push(`${BayLevelEnum.BELOW}-${below.isoBay}: ${ForeAftEnum[below.pairedBay]}`);

    }

    if (below?.pairedBay !== undefined && above && above.pairedBay === undefined) {
      above.pairedBay = below.pairedBay;
      newConnections++;
      newConnectionsBays.push(`${BayLevelEnum.ABOVE}-${above.isoBay}: ${ForeAftEnum[above.pairedBay]}`);
    }
  });

  // 4th pass, pair 2 bays that are in between paired bays
  const pairedBayKeys: Record<IIsoBayPattern, ForeAftEnum | undefined> = {};
  isoBaysKeys.forEach((isoBay) => {
    const above = findBayAndLevel(isoBay, BayLevelEnum.ABOVE, bayLevelData);
    const below = findBayAndLevel(isoBay, BayLevelEnum.BELOW, bayLevelData);

    if (above?.pairedBay !== undefined && below?.pairedBay === above?.pairedBay) {
      pairedBayKeys[isoBay] = above.pairedBay;
    } else {
      pairedBayKeys[isoBay] = undefined;
    }
  });

  const pairedBayKeysArray = Object.keys(pairedBayKeys).sort() as IIsoBayPattern[];
  for (let i = 1; i < pairedBayKeysArray.length - 1; i++) {
    const kPrev = pairedBayKeys[pairedBayKeysArray[i - 1]];
    const kCurr = pairedBayKeys[pairedBayKeysArray[i]];
    const kNext = pairedBayKeys[pairedBayKeysArray[i + 1]];
    const kNNNx = pairedBayKeys[pairedBayKeysArray[i + 2]];

    if (kPrev === ForeAftEnum.FWD && kCurr === undefined && kNext === undefined && kNNNx === ForeAftEnum.AFT) {
      const aboveF = findBayAndLevel(pairedBayKeysArray[i], BayLevelEnum.ABOVE, bayLevelData);
      const belowF = findBayAndLevel(pairedBayKeysArray[i], BayLevelEnum.BELOW, bayLevelData);
      const aboveA = findBayAndLevel(pairedBayKeysArray[i + 1], BayLevelEnum.ABOVE, bayLevelData);
      const belowA = findBayAndLevel(pairedBayKeysArray[i + 1], BayLevelEnum.BELOW, bayLevelData);

      if (aboveF) aboveF.pairedBay = ForeAftEnum.AFT;
      if (belowF) belowF.pairedBay = ForeAftEnum.AFT;
      if (aboveA) aboveA.pairedBay = ForeAftEnum.FWD;
      if (belowA) belowA.pairedBay = ForeAftEnum.FWD;
      newConnections++;
      newConnectionsBays.push(`${BayLevelEnum.ABOVE}-${aboveF.isoBay}: AFT`);
      newConnectionsBays.push(`${BayLevelEnum.BELOW}-${belowF.isoBay}: AFT`);
      newConnectionsBays.push(`${BayLevelEnum.ABOVE}-${aboveA.isoBay}: FWD`);
      newConnectionsBays.push(`${BayLevelEnum.BELOW}-${belowA.isoBay}: FWD`);

    }
  }

  console.log("newConnections", newConnections, newConnectionsBays);

  return bayLevelData;
}

function findBayAndLevel(
  isoBay: IIsoBayPattern,
  level: BayLevelEnum,
  bayLevelData: IBayLevelData[],
): IBayLevelData | undefined {
  return bayLevelData.find((bl) => bl.isoBay === isoBay && bl.level === level);
}
