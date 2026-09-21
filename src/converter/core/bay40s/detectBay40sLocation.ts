import { IPairedBays, IUnpairedBay, getPairedBays } from "./getPairedBays";
import { count40sData, has40sData } from "./bay40sHelpers";

import BayLevelEnum from "../../../models/base/enums/BayLevelEnum";
import ForeAftEnum from "../../../models/base/enums/ForeAftEnum";
import IBayLevelData from "../../../models/v1/parts/IBayLevelData";
import { IIsoBayPattern } from "../../../models/base/types/IPositionPatterns";
import { createDictionary } from "../../../helpers/createDictionary";

/** Where a single pair of bays currently keeps its 40'+ data */
export interface IBay40sPairLocation extends IPairedBays {
  /**
   * The bay of the pair holding the 40'+ data. `undefined` when the pair holds
   * none at all, or when both bays hold exactly the same amount (a tie, which
   * no convention can resolve).
   */
  location: ForeAftEnum | undefined;
  /** Amount of 40'+ data in the forward bay. See {@link count40sData} */
  fwdCount: number;
  /** Amount of 40'+ data in the aft bay. See {@link count40sData} */
  aftCount: number;
  /** Both bays of the pair hold 40'+ data, so the pair contradicts itself */
  split: boolean;
}

export interface IDetectBay40sLocationResult {
  /**
   * The dominant convention, suitable for {@link IShipData.bay40sLocation}.
   *
   * `undefined` when there is no 40'+ data to judge, or when both conventions
   * are equally represented.
   */
  bay40sLocation: ForeAftEnum | undefined;
  /** Every pair follows `bay40sLocation`, and no pair is split */
  consistent: boolean;
  /** Every pair of bays, in `getPairedBays` order */
  pairs: IBay40sPairLocation[];
  /**
   * The pairs that a tool would have to fix: those holding 40'+ data on the
   * side opposite to `bay40sLocation`, and those holding it on both sides.
   */
  dissenting: IBay40sPairLocation[];
  /**
   * Bays holding 40'+ data that belong to no pair. They cannot follow any
   * convention and are left alone by {@link moveBay40sToLocation}, so they are
   * reported here for the caller to resolve (usually by pairing them first
   * with `connectPairedBays`).
   */
  unpairedWith40s: IUnpairedBay[];
  /** How many pairs vote for each convention */
  votes: { [ForeAftEnum.FWD]: number; [ForeAftEnum.AFT]: number };
}

/**
 * Works out where a vessel definition keeps its 40'+ container data: in the
 * forward bay of each pair, or in the aft one.
 *
 * This is a pure calculation — nothing is modified. Feed the result to
 * {@link moveBay40sToLocation} to normalise the bays, and store the chosen
 * convention in `shipData.bay40sLocation`.
 *
 * @param baysData the vessel's `baysData`
 * @returns the dominant convention plus the pairs that disagree with it
 */
export default function detectBay40sLocation(
  baysData: IBayLevelData[],
): IDetectBay40sLocationResult {
  const { pairs: bayPairs, unpaired } = getPairedBays(baysData);

  const baysDict = createDictionary(
    baysData,
    (bl) => bayLevelKey(bl.isoBay, bl.level),
  );

  const votes = { [ForeAftEnum.FWD]: 0, [ForeAftEnum.AFT]: 0 };

  const pairs: IBay40sPairLocation[] = bayPairs.map((pair) => {
    const fwdCount = count40sData(baysDict[bayLevelKey(pair.fwd, pair.level)]);
    const aftCount = count40sData(baysDict[bayLevelKey(pair.aft, pair.level)]);

    let location: ForeAftEnum | undefined = undefined;
    if (fwdCount > aftCount) location = ForeAftEnum.FWD;
    else if (aftCount > fwdCount) location = ForeAftEnum.AFT;

    if (location !== undefined) votes[location]++;

    return {
      ...pair,
      location,
      fwdCount,
      aftCount,
      split: fwdCount > 0 && aftCount > 0,
    };
  });

  let bay40sLocation: ForeAftEnum | undefined = undefined;
  if (votes[ForeAftEnum.FWD] > votes[ForeAftEnum.AFT])
    bay40sLocation = ForeAftEnum.FWD;
  else if (votes[ForeAftEnum.AFT] > votes[ForeAftEnum.FWD])
    bay40sLocation = ForeAftEnum.AFT;

  const dissenting = pairs.filter(
    (p) =>
      p.split ||
      (p.location !== undefined && p.location !== bay40sLocation),
  );

  const unpairedWith40s = unpaired.filter((u) =>
    has40sData(baysDict[bayLevelKey(u.isoBay, u.level)]),
  );

  return {
    bay40sLocation,
    consistent: dissenting.length === 0,
    pairs,
    dissenting,
    unpairedWith40s,
    votes,
  };
}

function bayLevelKey(isoBay: IIsoBayPattern, level: BayLevelEnum): string {
  return `${isoBay}-${level}`;
}
