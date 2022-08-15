import {
  IIsoStackPattern,
  IIsoTierPattern,
  IJoinedStackTierPattern,
} from "../models/base/types/IPositionPatterns";

import { pad2 } from "./pad";
import sortStacksArray from "./sortStacksArray";

export function getStackAndTiersFromSlotKeys(
  slotKeys?: IJoinedStackTierPattern[]
): IStackTiersFromSlotsResult {
  if (slotKeys === undefined) {
    return {
      stacks: [],
      tiers: [],
      minTier: undefined,
      maxTier: undefined,
      maxStack: undefined,
      centerLineStack: 0,
      tiersByStack: {},
    };
  }

  const stacks: IIsoStackPattern[] = new Array(slotKeys.length);
  const tiers: IIsoTierPattern[] = new Array(slotKeys.length);
  const tiersByStack: ITiersByStack = {};

  let centerLineStack: 1 | 0 = 0;
  let maxStack = -Infinity;
  let minTier = Infinity;
  let maxTier = -Infinity;

  slotKeys.forEach((pos, idx) => {
    const stack = pos.substring(0, 2) as IIsoStackPattern;
    const tier = pos.substring(2) as IIsoTierPattern;
    const tierAsNumber = Number(tier);
    const stackAsNumber = Number(stack);

    stacks[idx] = stack;
    tiers[idx] = tier;

    if (!centerLineStack && stack === "00") centerLineStack = 1;
    if (stackAsNumber > maxStack) maxStack = stackAsNumber;
    if (tierAsNumber < minTier) minTier = tierAsNumber;
    if (tierAsNumber > maxTier) maxTier = tierAsNumber;

    if (tiersByStack[stack] === undefined) {
      tiersByStack[stack] = {
        minTier: tierAsNumber,
        maxTier: tierAsNumber,
      };
    }

    if (tierAsNumber < tiersByStack[stack].minTier)
      tiersByStack[stack].minTier = tierAsNumber;

    if (tierAsNumber > tiersByStack[stack].maxTier)
      tiersByStack[stack].maxTier = tierAsNumber;
  });

  return {
    stacks: stacks
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .sort(sortStacksArray),
    tiers: tiers.filter((v, idx, arr) => arr.indexOf(v) === idx),
    minTier: pad2(minTier),
    maxTier: pad2(maxTier),
    maxStack: pad2(maxStack),
    centerLineStack,
    tiersByStack,
  };
}

interface IStackTiersFromSlotsResult {
  stacks: IIsoStackPattern[];
  tiers: IIsoTierPattern[];
  minTier: IIsoTierPattern | undefined;
  maxTier: IIsoTierPattern | undefined;
  maxStack: IIsoStackPattern | undefined;
  centerLineStack: 1 | 0;
  tiersByStack: ITiersByStack;
}

interface ITiersByStack {
  [stack: IIsoStackPattern]: {
    minTier: number;
    maxTier: number;
  };
}
