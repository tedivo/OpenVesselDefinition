import { createMockedSimpleBayLevelData } from "../../converter/mocks/bayLevelData";
import { IJoinedStackTierPattern } from "../../models/base/types/IPositionPatterns";
import { ITierStackLabelDictionaries } from "../../models/v1/parts/IPositionLabels";
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

  it("detect bay labels", () => {
    const substractedLabels = substractLabels(bayLevelData);

    expect(Object.keys(substractedLabels.bays).length).toBe(2);

    expect(substractedLabels.bays["001"]).toBeDefined();
    expect(substractedLabels.bays["001"].label20).toBe("001");
    expect(substractedLabels.bays["001"].label40).toBe("002");
    expect(substractedLabels.bays["003"]).toBeDefined();
    expect(substractedLabels.bays["003"].label20).toBe("003");
    expect(substractedLabels.bays["003"].label40).toBe("004");
  });
});
