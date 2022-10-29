/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { getRowsAndTiersFromSlotKeys } from "./getRowsAndTiersFromSlotKeys";

describe("getRowsAndTiersFromSlotKeys should...", () => {
  it("generates the information", () => {
    const { rows, tiers, minTier, maxTier, maxRow, centerLineRow, tiersByRow } =
      getRowsAndTiersFromSlotKeys(["0080", "0180", "0182", "0280"]);

    expect(rows).toStrictEqual(["02", "00", "01"]);
    expect(tiers).toStrictEqual(["80", "82"]);
    expect(minTier).toBe("80");
    expect(maxTier).toBe("82");
    expect(maxRow).toBe("02");
    expect(centerLineRow).toBe(1);

    expect(tiersByRow["02"].minTier).toBe(80);
    expect(tiersByRow["02"].maxTier).toBe(80);
    expect(tiersByRow["01"].minTier).toBe(80);
    expect(tiersByRow["01"].maxTier).toBe(82);
    expect(tiersByRow["00"].minTier).toBe(80);
    expect(tiersByRow["00"].maxTier).toBe(80);
  });

  it("does correctly for example 1", () => {
    const { rows, tiers, minTier, maxTier, maxRow, centerLineRow, tiersByRow } =
      getRowsAndTiersFromSlotKeys([
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

    expect(rows).toStrictEqual(["06", "04", "02", "01", "03", "05"]);
    expect(tiers).toStrictEqual(["14", "16", "18"]);
    expect(minTier).toBe("14");
    expect(maxTier).toBe("18");
    expect(maxRow).toBe("06");
    expect(centerLineRow).toBe(0);

    expect(tiersByRow["01"].minTier).toBe(14);
    expect(tiersByRow["01"].maxTier).toBe(18);
    expect(tiersByRow["02"].minTier).toBe(14);
    expect(tiersByRow["02"].maxTier).toBe(18);
    expect(tiersByRow["03"].minTier).toBe(18);
    expect(tiersByRow["03"].maxTier).toBe(18);
    expect(tiersByRow["04"].minTier).toBe(18);
    expect(tiersByRow["04"].maxTier).toBe(18);
    expect(tiersByRow["05"].minTier).toBe(18);
    expect(tiersByRow["05"].maxTier).toBe(18);
    expect(tiersByRow["06"].minTier).toBe(18);
    expect(tiersByRow["06"].maxTier).toBe(18);
  });
});
