enum LcgReferenceEnum {
  "MIDSHIPS" = 1,
  "AFT_PERSPECTIVE" = 2,
  "FWD_PERSPECTIVE" = 3,
}

export default LcgReferenceEnum;

export const getStafLcgReferenceEnumValue = (
  s: "MS" | "AP" | "FP"
): LcgReferenceEnum | undefined => {
  if (s === "MS") return LcgReferenceEnum.MIDSHIPS;
  if (s === "AP") return LcgReferenceEnum.AFT_PERSPECTIVE;
  if (s === "FP") return LcgReferenceEnum.FWD_PERSPECTIVE;
  return undefined;
};
