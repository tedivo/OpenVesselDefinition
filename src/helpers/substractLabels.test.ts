import { createMockedSimpleBayLevelData } from "../converter/mocks/bayLevelData";
import { IJoinedStackTierPattern } from "../models/base/types/IPositionPatterns";
import { ITierStackLabelDictionaries } from "../models/v1/parts/IPositionLabels";
import substractLabels, {
  dictionaryHash,
  getExistingDictionaryLabelsName,
} from "./substractLabels";

const mockSlotInfoKeysAbove: IJoinedStackTierPattern[] = ["0080", "0082"];
const mockSlotInfoKeysBelow: IJoinedStackTierPattern[] = ["0002", "0004"];

describe("dictionaryHash should", () => {
  it("calculate hash correctly", () => {
    const t1 = { "10": "Diez", "20": "Veinte", "30": undefined };
    const hash1 = dictionaryHash(t1);
    expect(hash1).toBe("10-Diez|20-Veinte");
  });

  it("omit missing and manage undefined correctly", () => {
    const t1 = { "10": "Diez", "20": "Veinte", "30": undefined };
    const hash1 = dictionaryHash(t1);

    const t2 = {
      "20": "Veinte",
      "30": undefined,
      "32": undefined,
      "10": "Diez",
    };
    const hash2 = dictionaryHash(t2);
    expect(hash2).toBe(hash1);
  });
});

describe("getExistingDictionaryLabelsName should", () => {
  const dicts: ITierStackLabelDictionaries = {};
  beforeAll(() => {
    dicts["dict-1"] = { "10": "Diez", "11": "Once" };
    dicts["dict-2"] = { "10": "Diez", "12": "Doce" };
    dicts["dict-3"] = { "10": "Diez", "20": "Twenty" };
    dicts["dict-4"] = { "10": "Diez", "20": "Veinte" };
  });

  it("Should return nothing", () => {
    const n = getExistingDictionaryLabelsName({ "10": "Ten" }, dicts);
    expect(n).toBe("");
  });

  it("Should return correctly", () => {
    const n = getExistingDictionaryLabelsName(
      { "10": "Diez", "12": "Doce" },
      dicts
    );
    expect(n).toBe("dict-2");

    const m = getExistingDictionaryLabelsName(
      { "10": "Diez", "20": "Veinte" },
      dicts
    );
    expect(m).toBe("dict-4");
  });
});

describe("substractLabels should", () => {
  const bayLevelData = createMockedSimpleBayLevelData(
    4,
    mockSlotInfoKeysAbove,
    mockSlotInfoKeysBelow
  );

  it("detect two equal (tiers)", () => {
    bayLevelData[0].perTierInfo["80"].label = "tier-A";
    bayLevelData[0].perTierInfo["82"].label = "tier-B";
    bayLevelData[2].perTierInfo["80"].label = "tier-A";
    bayLevelData[2].perTierInfo["82"].label = "tier-B";

    const substractedLabels = substractLabels(bayLevelData);

    expect(Object.keys(substractedLabels.bays).length).toBe(0);
    expect(Object.keys(substractedLabels.stacks).length).toBe(0);
    expect(Object.keys(substractedLabels.tiers).length).toBe(1);

    expect(substractedLabels.tiers["tiers-labels-1"]).toStrictEqual({
      "80": "tier-A",
      "82": "tier-B",
    });

    expect(bayLevelData[0].tiersLabelsDictionary).toBe("tiers-labels-1");
    expect(bayLevelData[2].tiersLabelsDictionary).toBe("tiers-labels-1");
    expect(bayLevelData[0].stacksLabelsDictionary).toBeFalsy();
  });

  it("detect no equal (tiers)", () => {
    bayLevelData[0].perTierInfo["80"].label = "tier-A";
    bayLevelData[0].perTierInfo["82"].label = "tier-B";
    bayLevelData[2].perTierInfo["80"].label = "tier-A";
    bayLevelData[2].perTierInfo["82"].label = "tier-V";

    const substractedLabels = substractLabels(bayLevelData);

    expect(Object.keys(substractedLabels.bays).length).toBe(0);
    expect(Object.keys(substractedLabels.stacks).length).toBe(0);
    expect(Object.keys(substractedLabels.tiers).length).toBe(2);

    expect(substractedLabels.tiers["tiers-labels-1"]).toStrictEqual({
      "80": "tier-A",
      "82": "tier-B",
    });

    expect(substractedLabels.tiers["tiers-labels-2"]).toStrictEqual({
      "80": "tier-A",
      "82": "tier-V",
    });

    expect(bayLevelData[0].tiersLabelsDictionary).toBe("tiers-labels-1");
    expect(bayLevelData[2].tiersLabelsDictionary).toBe("tiers-labels-2");
    expect(bayLevelData[0].stacksLabelsDictionary).toBeFalsy();
  });

  it("test with stacks", () => {
    bayLevelData[0].perStackInfo["02"].label = "stack-A";
    bayLevelData[0].perStackInfo["00"].label = "stack-B";

    const substractedLabels = substractLabels(bayLevelData);

    expect(Object.keys(substractedLabels.bays).length).toBe(0);
    expect(Object.keys(substractedLabels.stacks).length).toBe(1);

    expect(substractedLabels.stacks["stacks-labels-1"]).toStrictEqual({
      "00": "stack-B",
      "02": "stack-A",
    });

    expect(bayLevelData[0].stacksLabelsDictionary).toBe("stacks-labels-1");
  });
});
