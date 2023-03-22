import IBayLevelData, {
  IBayLevelDataStaf,
} from "../../models/v1/parts/IBayLevelData";
import {
  IIsoRowPattern,
  IIsoTierPattern,
  IJoinedRowTierPattern,
} from "../../models/base/types/IPositionPatterns";
import {
  ILCGOptionsIntermediate,
  IMasterCGs,
  ITGCOptionsIntermediate,
  IVGCOptionsIntermediate,
} from "../../models/v1/parts/IShipData";

import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import { ONE_MILLIMETER_IN_FEET } from "../consts";
import PortStarboardEnum from "../../models/base/enums/PortStarboardEnum";
import { TContainerLengths } from "../../models/v1/parts/Types";
import { getRowsAndTiersFromSlotKeys } from "../../helpers/getRowsAndTiersFromSlotKeys";
import { pad2 } from "../../helpers/pad";

/**
 * Remaps OVS CGS (LCG: Aft-Persp, TCG: STBD, VCG: BottomBase) to other CGSs references
 * @param bls
 * @param masterCGs
 * @param lcgOptions new LCG options
 * @param vcgOptions new VCG options
 * @param tcgOptions new TCG options
 */
export function cgsRemapOvdToStaf(
  bls: IBayLevelDataStaf[],
  masterCGs: IMasterCGs,
  lcgOptions: ILCGOptionsIntermediate,
  vcgOptions: IVGCOptionsIntermediate,
  tcgOptions: ITGCOptionsIntermediate
): { bls: IBayLevelDataStaf[]; mCGs: IMasterCGs } {
  const clonedBls = bls.slice().map((bl) => JSON.parse(JSON.stringify(bl)));
  const clonedMasterCGs = JSON.parse(JSON.stringify(masterCGs));

  remapLcgs(lcgOptions, clonedBls);

  remapVcgs(vcgOptions, clonedBls, clonedMasterCGs);
  remapTcgs(tcgOptions, clonedBls, clonedMasterCGs);

  return {
    bls: clonedBls,
    mCGs: clonedMasterCGs,
  };
}

/**
 * Remaps TCGs. Mutates the object.
 * @param tcgOptions
 * @param bls
 * @param masterCGs
 */
function remapTcgs(
  tcgOptions: ITGCOptionsIntermediate,
  bls: IBayLevelData[],
  masterCGs: IMasterCGs
) {
  if (tcgOptions.direction === PortStarboardEnum.STARBOARD) return;

  const tcgSignMult = -1;

  (Object.keys(masterCGs.aboveTcgs) as IIsoRowPattern[]).forEach((row) => {
    masterCGs.aboveTcgs[row] = tcgSignMult * masterCGs.aboveTcgs[row];
  });

  (Object.keys(masterCGs.belowTcgs) as IIsoRowPattern[]).forEach((row) => {
    masterCGs.belowTcgs[row] = tcgSignMult * masterCGs.belowTcgs[row];
  });

  bls.forEach((bl) => {
    const perRowInfoEach = bl.perRowInfo.each;
    const rows = Object.keys(perRowInfoEach) as IIsoRowPattern[];

    rows.forEach((row) => {
      const tcg = perRowInfoEach[row].tcg;
      if (tcg !== undefined) perRowInfoEach[row].tcg = tcgSignMult * tcg;
    });
  });
}

/**
 * Remaps VCGs. Mutates the object.
 * @param vcgOptions
 * @param bls
 * @param masterCGs
 */
function remapVcgs(
  vcgOptions: IVGCOptionsIntermediate,
  bls: IBayLevelData[],
  masterCGs: IMasterCGs
) {
  const baseAdjust = Math.round(
    (8.5 / ONE_MILLIMETER_IN_FEET) * (vcgOptions.heightFactor || 0)
  );

  bls.forEach((bl) => {
    const perRowInfoEach = bl.perRowInfo?.each;
    if (perRowInfoEach) {
      const { tiersByRow } = getRowsAndTiersFromSlotKeys(
        bl.perSlotInfo
          ? (Object.keys(bl.perSlotInfo) as IJoinedRowTierPattern[])
          : undefined
      );

      const rows = Object.keys(perRowInfoEach) as IIsoRowPattern[];
      rows.forEach((row) => {
        const bottomIsoTier = tiersByRow[row]?.minTier
          ? pad2(tiersByRow[row]?.minTier)
          : "";

        let vcg: number | undefined = undefined;

        vcg =
          perRowInfoEach[row].bottomBase ??
          masterCGs.bottomBases[bottomIsoTier];

        // Adjust using vcgOptions.heightFactor
        if (vcg !== undefined) {
          perRowInfoEach[row].bottomBase = vcg + baseAdjust;
        }
      });
    }
  });

  (Object.keys(masterCGs.bottomBases) as IIsoTierPattern[]).forEach((tier) => {
    masterCGs.bottomBases[tier] = masterCGs.bottomBases[tier] + baseAdjust;
  });
}

/**
 * Remaps LCG from AFT Perp. Mutates the object.
 * @param lcgOptions
 * @param bls
 */
function remapLcgs(lcgOptions: ILCGOptionsIntermediate, bls: IBayLevelData[]) {
  const lpp = lcgOptions.lpp;

  if (
    (lcgOptions.reference === LcgReferenceEnum.AFT_PERPENDICULAR &&
      lcgOptions.orientationIncrease === ForeAftEnum.FWD) ||
    lpp === 0
  ) {
    return;
  }

  const lcgSignMult =
    lcgOptions.orientationIncrease === ForeAftEnum.FWD ? 1 : -1;

  const lcgRebase =
    lcgOptions.reference === LcgReferenceEnum.FWD_PERPENDICULAR
      ? (lcg: number) => lpp + lcg * lcgSignMult
      : lcgOptions.reference === LcgReferenceEnum.MIDSHIPS
      ? (lcg: number) => (lcg - lpp * 0.5) * lcgSignMult
      : (lcg: number) => lcg * lcgSignMult;

  bls.forEach((bl) => {
    const infoByContLength = bl.infoByContLength;
    const contLens = Object.keys(
      infoByContLength
    ) as unknown as TContainerLengths[];

    // remap infoByContLength
    contLens.forEach((len) => {
      let lcg = infoByContLength[len]?.lcg;
      if (lcg !== undefined) {
        infoByContLength[len].lcg = lcgRebase(lcg);
      }
    });

    // remap bulkheads
    const bulkhead = bl.bulkhead;
    if (bulkhead) {
      if (bulkhead.foreLcg !== undefined)
        bulkhead.foreLcg = lcgRebase(bulkhead.foreLcg);
      if (bulkhead.aftLcg !== undefined)
        bulkhead.aftLcg = lcgRebase(bulkhead.aftLcg);
    }

    // remap  perRowInfo.each.[xx].rowInfoByLength
    const perRowInfoEach = bl.perRowInfo?.each;
    if (perRowInfoEach) {
      const rows = Object.keys(perRowInfoEach) as IIsoRowPattern[];
      rows.forEach((row) => {
        const rowInfoByLength = perRowInfoEach[row].rowInfoByLength;
        if (rowInfoByLength) {
          const sizes = Object.keys(rowInfoByLength).map(
            Number
          ) as TContainerLengths[];
          sizes.forEach((size) => {
            const lcg = rowInfoByLength[size].lcg;
            if (lcg !== undefined) {
              rowInfoByLength[size].lcg = lcgRebase(lcg);
            }
          });
        }
      });
    }
  });
}
