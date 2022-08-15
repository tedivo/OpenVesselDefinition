/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { getStackAndTiersFromSlotKeys } from "./getStackAndTiersFromSlotKeys";

describe("getStackAndTiersFromSlotKeys should...", () => {
  it("generates the information", () => {
    const {
      stacks,
      tiers,
      minTier,
      maxTier,
      maxStack,
      centerLineStack,
      tiersByStack,
    } = getStackAndTiersFromSlotKeys(["0080", "0180", "0182", "0280"]);

    expect(stacks).toStrictEqual(["02", "00", "01"]);
    expect(tiers).toStrictEqual(["80", "82"]);
    expect(minTier).toBe("80");
    expect(maxTier).toBe("82");
    expect(maxStack).toBe("02");
    expect(centerLineStack).toBe(1);

    expect(tiersByStack["02"].minTier).toBe(80);
    expect(tiersByStack["02"].maxTier).toBe(80);
    expect(tiersByStack["01"].minTier).toBe(80);
    expect(tiersByStack["01"].maxTier).toBe(82);
    expect(tiersByStack["00"].minTier).toBe(80);
    expect(tiersByStack["00"].maxTier).toBe(80);
  });

  it("does correctly for example 1", () => {
    const {
      stacks,
      tiers,
      minTier,
      maxTier,
      maxStack,
      centerLineStack,
      tiersByStack,
    } = getStackAndTiersFromSlotKeys([
      "0114",
      "0116",
      "0118",
      "0214",
      "0216",
      "0218",
      "0318",
      "0418",
      "0518",
      "0618",
    ]);

    expect(stacks).toStrictEqual(["06", "04", "02", "01", "03", "05"]);
    expect(tiers).toStrictEqual(["14", "16", "18"]);
    expect(minTier).toBe("14");
    expect(maxTier).toBe("18");
    expect(maxStack).toBe("06");
    expect(centerLineStack).toBe(0);

    expect(tiersByStack["01"].minTier).toBe(14);
    expect(tiersByStack["01"].maxTier).toBe(18);
    expect(tiersByStack["02"].minTier).toBe(14);
    expect(tiersByStack["02"].maxTier).toBe(18);
    expect(tiersByStack["03"].minTier).toBe(18);
    expect(tiersByStack["03"].maxTier).toBe(18);
    expect(tiersByStack["04"].minTier).toBe(18);
    expect(tiersByStack["04"].maxTier).toBe(18);
    expect(tiersByStack["05"].minTier).toBe(18);
    expect(tiersByStack["05"].maxTier).toBe(18);
    expect(tiersByStack["06"].minTier).toBe(18);
    expect(tiersByStack["06"].maxTier).toBe(18);
  });
});
