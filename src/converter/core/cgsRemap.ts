import {
  ILCGOptionsIntermediate,
  ITGCOptionsIntermediate,
  IVGCOptionsIntermediate,
} from "../../models/v1/parts/IShipData";
import ValuesSourceEnum, {
  ValuesSourceStackTierEnum,
} from "../../models/base/enums/ValuesSourceEnum";

import ForeAftEnum from "../../models/base/enums/ForeAftEnum";
import { IBayLevelDataIntermediate } from "../../models/v1/parts/IBayLevelData";
import { IIsoStackTierPattern } from "../../models/base/types/IPositionPatterns";
import LcgReferenceEnum from "../../models/base/enums/LcgReferenceEnum";
import PortStarboardEnum from "../../models/base/enums/PortStarboardEnum";
import { TContainerLengths } from "../../models/v1/parts/Types";

export const ONE_MILLIMETER_IN_FEET = 0.003280839895;

/**
 * Remaps LCG to AFT Perp
 * @param bls
 * @param lcgOptions
 * @param vcgOptions
 */
export function cgsRemap(
  bls: IBayLevelDataIntermediate[],
  lcgOptions: ILCGOptionsIntermediate,
  vcgOptions: IVGCOptionsIntermediate,
  tcgOptions: ITGCOptionsIntermediate
) {
  if (lcgOptions.values === ValuesSourceEnum.KNOWN) remapLcgs(lcgOptions, bls);
  if (vcgOptions.values === ValuesSourceStackTierEnum.BY_TIER)
    remapVcgs(vcgOptions, bls);
  if (tcgOptions.values === ValuesSourceEnum.KNOWN) remapTcgs(tcgOptions, bls);
}

/**
 * Remaps VCGs from BY_TIER to BY_STACK. Mutates the object.
 * @param tcgOptions
 * @param bls
 */
function remapTcgs(
  tcgOptions: ITGCOptionsIntermediate,
  bls: IBayLevelDataIntermediate[]
) {
  const tcgSignMult =
    tcgOptions.direction === PortStarboardEnum.STARBOARD ? 1 : -1;

  bls.forEach((bl) => {
    const perStackInfo = bl.perStackInfo;
    const stacks = Object.keys(perStackInfo) as IIsoStackTierPattern[];

    stacks.forEach((stack) => {
      const tcg = perStackInfo[stack].tcg;
      if (tcg !== undefined) perStackInfo[stack].tcg = tcgSignMult * tcg;
    });
  });
}

/**
 * Remaps VCGs from BY_TIER to BY_STACK. Mutates the object.
 * @param vcgOptions
 * @param bls
 */
function remapVcgs(
  vcgOptions: IVGCOptionsIntermediate,
  bls: IBayLevelDataIntermediate[]
) {
  const baseAdjust = Math.round(
    (8.5 / ONE_MILLIMETER_IN_FEET) * (vcgOptions.ratio || 0)
  );

  bls.forEach((bl) => {
    const perStackInfo = bl.perStackInfo;
    const perTierInfo = bl.perTierInfo;

    const stacks = Object.keys(perStackInfo) as IIsoStackTierPattern[];
    stacks.forEach((stack) => {
      const bottomIsoTier = perStackInfo[stack].bottomIsoTier;
      const vcg = perTierInfo[bottomIsoTier]?.vcg;
      if (vcg !== undefined) {
        const bottomBase = vcg - baseAdjust;
        perStackInfo[stack].bottomBase = bottomBase;
      }
    });
    // Important: as "perTierInfo" is used many times, cgsRemap should only
    // be used last in the conversion process.
    delete bl.perTierInfo;
  });
}

/**
 * Remaps LCG to AFT Perp. Mutates the object.
 * @param lcgOptions
 * @param bls
 */
function remapLcgs(
  lcgOptions: ILCGOptionsIntermediate,
  bls: IBayLevelDataIntermediate[]
) {
  const lpp = lcgOptions.lpp;

  const lcgRebase =
    lcgOptions.reference === LcgReferenceEnum.FWD_PERSPECTIVE
      ? -lpp
      : lcgOptions.reference === LcgReferenceEnum.MIDSHIPS
      ? -lpp * 0.5
      : 0;

  const lcgSignMult =
    lcgOptions.orientationIncrease === ForeAftEnum.FWD ? 1 : -1;

  bls.forEach((bl) => {
    const stackInfoByLength = bl.stackInfoByLength;
    const contLens = Object.keys(
      stackInfoByLength
    ) as unknown as TContainerLengths[];

    contLens.forEach((len) => {
      let lcg = stackInfoByLength[len].lcg;
      if (lcg !== undefined) {
        stackInfoByLength[len].lcg = lcg * lcgSignMult + lcgRebase;
      }
    });
  });
}
