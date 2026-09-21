import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import { IIsoBayPattern } from "../../../models/base/types/IPositionPatterns";
import { sortNumericAsc } from "../../../helpers/sortByMultipleFields";

/** A pair of bays that together can hold 40'+ containers */
export interface IPairedBays {
  level: BayLevelEnum;
  /** The forward bay of the pair: lower ISO bay number, declares `pairedBay: AFT` */
  fwd: IIsoBayPattern;
  /** The aft bay of the pair: higher ISO bay number, declares `pairedBay: FWD` */
  aft: IIsoBayPattern;
}

/** A bay that is not part of any pair */
export interface IUnpairedBay {
  isoBay: IIsoBayPattern;
  level: BayLevelEnum;
}

export interface IGetPairedBaysResult {
  pairs: IPairedBays[];
  unpaired: IUnpairedBay[];
}

/**
 * Enumerates the paired bays of a vessel, per level.
 *
 * A pair is two bays of the same level, two ISO bay numbers apart, where the
 * forward one declares `pairedBay: AFT` and the aft one declares
 * `pairedBay: FWD`. Remember that {@link IBayLevelData.pairedBay} names the
 * *other* bay of the pair, so the value is the opposite of the bay's own
 * position.
 *
 * Nothing is assumed from position in the list: a vessel whose first bay is a
 * lone 20' one pairs 003 with 005, not 001 with 003.
 *
 * Bays whose `pairedBay` is unset, whose neighbour does not reciprocate, or
 * whose partner is not the adjacent bay number, are returned in `unpaired`.
 *
 * Does not mutate `baysData`.
 */
export function getPairedBays(baysData: IBayLevelData[]): IGetPairedBaysResult {
  const pairs: IPairedBays[] = [];
  const unpaired: IUnpairedBay[] = [];

  const levels = baysData
    .map((bl) => bl.level)
    .filter((v, i, a) => a.indexOf(v) === i);

  levels.forEach((level) => {
    const bays = baysData
      .filter((bl) => bl.level === level)
      .sort((a, b) => sortNumericAsc(a.isoBay, b.isoBay));

    for (let i = 0; i < bays.length; i++) {
      const bay = bays[i];
      const nextBay = bays[i + 1];

      // Both halves must agree, AND be the two bays a 40' actually spans.
      // Being next to each other in the list is not enough: a vessel may open
      // with a lone 20' bay (001 unpaired, the first pair being 003/005), or
      // skip a bay number entirely, and pairing across that gap would invent
      // a 40' slot where the ship has none.
      if (
        bay.pairedBay === ForeAftEnum.AFT &&
        nextBay?.pairedBay === ForeAftEnum.FWD &&
        Number(nextBay.isoBay) === Number(bay.isoBay) + 2
      ) {
        pairs.push({ level, fwd: bay.isoBay, aft: nextBay.isoBay });
        i++; // -> consume the aft bay too
      } else {
        unpaired.push({ isoBay: bay.isoBay, level });
      }
    }
  });

  return { pairs, unpaired };
}
